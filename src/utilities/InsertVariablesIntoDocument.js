/* @flow strict */

import { Kind } from '../language/kinds';
import type {
  ArgumentNode,
  DefinitionNode,
  DocumentNode,
  OperationDefinitionNode,
  ValueNode,
  VariableDefinitionNode,
} from '../language';
import { GraphQLSchema } from '../type';

export function insertVariablesIntoDocument(
  schema: GraphQLSchema,
  document: DocumentNode,
  variableValues: { string: mixed },
): DocumentNode {
  const documentWithVarsReplaced: DocumentNode = document;

  // Only try to insert variables if variables are used
  if (variableValues && Object.keys(variableValues).length) {
    // Go over the top level definitions (eg query)
    for (
      let docI = 0;
      docI < documentWithVarsReplaced.definitions.length;
      docI++
    ) {
      // We hold a temporary var with the definition.
      // So that we can use it to check that this is really an operation definition
      // Which we know it is, but we need to keep the type checker happy!
      const def: DefinitionNode = documentWithVarsReplaced.definitions[docI];

      if (def.kind !== Kind.OPERATION_DEFINITION) {
        continue;
      }

      const definition: OperationDefinitionNode = def;

      // Go over the fields
      for (
        let fieldI = 0;
        fieldI < definition.selectionSet.selections.length;
        fieldI++
      ) {
        const field = definition.selectionSet.selections[fieldI];

        if (field.kind !== Kind.FIELD) {
          // Currently, fragments and inline fragments are not supported
          continue;
        }

        // Go over the arguments
        for (
          let argI = 0;
          field.arguments && argI < field.arguments.length;
          argI++
        ) {
          const arg: ArgumentNode = field.arguments[argI];
          const argValue: ValueNode = field.arguments[argI].value;

          // Check if the argument contains a variable
          if (argValue.kind !== Kind.VARIABLE) {
            // We are only interested in arguments with a variable value
            continue;
          }

          // Get the value for that variable
          const value = variableValues[argValue.name.value];

          // Get the variable definition, which should exist
          const variableDefinition = getVariableDefintion(
            argValue.name.value,
            definition.variableDefinitions,
          );

          if (variableDefinition === null) {
            // Keep flow happy, but should not happen
            continue;
          }

          // Create a new value node based on the value of the variable
          const resolvedValueNode = variableToResolvedValueNode(
            variableDefinition,
            value,
          );

          // Inject the value as a node into the document
          // The resolved value is not null in normal cases.
          // If this would be the case, than we just 'reinstall' the argument node
          // $FlowFixMe
          arg.value = resolvedValueNode === null ? arg : resolvedValueNode;
        }
      }
    }
  }

  return documentWithVarsReplaced;
}

function variableToResolvedValueNode(
  variableDefinition: VariableDefinitionNode,
  variableValue,
): ValueNode | null {
  let type = variableDefinition.type;
  while (type.kind !== Kind.NAMED_TYPE) {
    type = type.type;
  }

  switch (type.name.value) {
    case 'Int':
      return {
        kind: Kind.INT,
        value: variableValue,
      };
    case 'Float':
      return {
        kind: Kind.FLOAT,
        value: variableValue,
      };
    case 'String':
      return {
        kind: Kind.STRING,
        value: variableValue,
      };
    case 'Boolean':
      return {
        kind: Kind.BOOLEAN,
        value: variableValue,
      };
    // TODO list & enum?
    default:
      return null;
  }
}

function getVariableDefintion(
  variableName: string,
  variableDefinitions?: $ReadOnlyArray<VariableDefinitionNode>,
): VariableDefinitionNode | null {
  if (!variableDefinitions) {
    return null;
  }

  // Go over all definitions to find the variable
  for (let i = 0; i < variableDefinitions.length; i++) {
    if (variableDefinitions[i].variable.name.value) {
      return variableDefinitions[i];
    }
  }

  // The definition is not found
  return null;
}
