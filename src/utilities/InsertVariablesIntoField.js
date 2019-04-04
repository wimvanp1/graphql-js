/* @flow strict */

import { Kind } from '../language/kinds';
import type { ArgumentNode, FieldNode, ValueNode } from '../language';
import type { GraphQLArgument, GraphQLField } from '../type';
import { isWrappingType } from '../type';

export function insertVariablesIntoField(
  fieldDefinition: GraphQLField<*, *>,
  fieldNode: FieldNode,
  variableValues: {},
): FieldNode {
  // Make a deep copy of the field because we are using destructive operations
  const fieldWithVarsReplaced: FieldNode = JSON.parse(
    JSON.stringify(fieldNode),
  );

  // Only try to insert variables if variables are used
  if (variableValues && Object.keys(variableValues).length) {
    // Go over the arguments of the field
    for (
      let argI = 0;
      fieldWithVarsReplaced.arguments &&
      argI < fieldWithVarsReplaced.arguments.length;
      argI++
    ) {
      const arg: ArgumentNode = fieldWithVarsReplaced.arguments[argI];
      const argValue: ValueNode = fieldWithVarsReplaced.arguments[argI].value;

      // Check if the argument contains a variable
      if (argValue.kind !== Kind.VARIABLE) {
        // We are only interested in arguments with a variable value
        continue;
      }

      // console.log('Current arg: ' + arg.name.value);
      // console.log(fieldDefinition.args);

      const argDefinition = getArgumentFromFieldDefinition(
        fieldDefinition,
        arg.name.value,
      );

      if (argDefinition === null) {
        // The argument is always defined, but we need to keep flow happy
        continue;
      }

      // Get the value for that variable
      const value = variableValues[argValue.name.value];

      // Create a new value node based on the value of the variable
      const resolvedValueNode = variableToResolvedValueNode(
        argDefinition,
        value,
      );

      // Inject the value as a node into the document
      // The resolved value is not null in normal cases.
      // If this would be the case, than we just 'reinstall' the argument node
      // $FlowFixMe
      arg.value = resolvedValueNode === null ? arg.value : resolvedValueNode;
    }
  }

  return fieldWithVarsReplaced;
}

function variableToResolvedValueNode(
  argumentDefinition: GraphQLArgument,
  variableValue: mixed,
): mixed {
  let type = argumentDefinition.type;
  let i = 0;

  // Unwrap the wrapper type
  while (isWrappingType(type)) {
    // Break out of this loop after 7 levels (max nesting depth)
    if (i > 7) {
      return null;
    }

    type = type.ofType;
    i++;
  }

  switch (type.name) {
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

function getArgumentFromFieldDefinition(
  fieldDefinition: GraphQLField<*, *>,
  argumentName: string,
): GraphQLArgument | null {
  for (let i = 0; i < fieldDefinition.args.length; i++) {
    const currentArg: GraphQLArgument = fieldDefinition.args[i];

    if (currentArg.name === argumentName) {
      return currentArg;
    }
  }

  return null;
}
