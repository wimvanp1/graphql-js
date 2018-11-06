/**
 * Copyright (c) 2015-present, Wim Vanparijs
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

import type { ValidationContext } from '../ValidationContext';
import type { ASTVisitor } from '../../language/visitor';
import type { GraphQLConstraint } from '../../type';
import keyValMap from '../../jsutils/keyValMap';
import { GraphQLError } from '../../error';

export function interparameterConstraintViolationMessage(
  constraint: GraphQLConstraint,
  fieldName: string,
): string {
  const message =
    `The constraint "` +
    constraintToString(constraint) +
    `" on field "${fieldName}" is not met.`;
  return message;
}

/**
 * No interparameter constraint violations
 *
 * A GraphQL field is only valid if all supplied arguments are defined by
 * that field.
 */
export function NoInterparamConstraintViolations(
  context: ValidationContext,
): ASTVisitor {
  return {
    Field(fieldNode) {
      const fieldDef = context.getFieldDef();

      if (!fieldDef || !fieldDef.constraints) {
        // Field definition is required for checking constraints
        // Constraint definition is required as well. No constraints = nothing to be checked
        return;
      }

      // Go over the specified constraints
      for (const constraint of fieldDef.constraints) {
        if (!validateConstraint(constraint, fieldNode)) {
          // Report errors at the top level of the constraint
          // This way, we will show the complete constraint in the error message
          context.reportError(
            new GraphQLError(
              interparameterConstraintViolationMessage(
                constraint,
                fieldDef.name,
              ),
              fieldNode,
            ),
          );
        }
      }
    },
  };
}

/*
 * Internal functions to validate the constraints
 */
function validateConstraint(constraint: GraphQLConstraint, fieldNode): boolean {
  switch (constraint.name) {
    case 'XOR':
      return validateXOR(constraint, fieldNode);
    default:
      // TODO better error (should not happen)
      console.log('Unknown Constraint: ' + constraint.name);
      return false;
  }
}

function validateXOR(constraint: GraphQLConstraint, fieldNode): boolean {
  // TODO remove logs
  /* console.log('Constraint:');
  console.log(constraint);*/

  const args = fieldNodeToArgMap(fieldNode);

  /* console.log('Args: ');
  console.log(args);*/

  const leftSideValidity =
    typeof constraint.leftSide === 'object'
      ? validateConstraint(constraint.leftSide, fieldNode)
      : args[constraint.leftSide];
  const rightSideValidity =
    typeof constraint.rightSide === 'object'
      ? validateConstraint(constraint.rightSide, fieldNode)
      : args[constraint.rightSide];

  // Only one of both sides can be valid, because we have a XOR constraint
  if (leftSideValidity && rightSideValidity) {
    console.log('VIOLATION');
    return false;
  }

  console.log('XOR ok');
  return true;
}

/*
 * Internal helper functions
 */
function fieldNodeToArgMap(fieldNode) {
  if (fieldNode && fieldNode.arguments) {
    return keyValMap(
      fieldNode.arguments,
      field => field.name.value,
      field =>
        field.value && field.value.value !== undefined
          ? field.value.value
          : undefined,
    );
  }

  // No arguments have been defined, return an empty map
  return {};
}

function constraintToString(constraint: GraphQLConstraint): string {
  let result = '';

  result +=
    typeof constraint.leftSide === 'object'
      ? '(' + constraintToString(constraint.leftSide) + ')'
      : constraint.leftSide;
  result += ' ' + constraint.name + ' ';
  result +=
    typeof constraint.rightSide === 'object'
      ? '(' + constraintToString(constraint.rightSide) + ')'
      : constraint.rightSide;

  return result;
}
