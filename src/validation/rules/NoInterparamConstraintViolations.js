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
        if (!validateConstraint(context, constraint, fieldNode)) {
          // Report errors at the top level of the constraint
          // This way, we will show the complete constraint in the error message
        }
      }
    },
  };
}

/*
 * Internal functions to validate the constraints
 */
function validateConstraint(
  context: ValidationContext,
  constraint: GraphQLConstraint,
  fieldNode,
): boolean {
  switch (constraint.name) {
    case 'XOR':
      return executeConstraintValidationWithRule(
        context,
        constraint,
        fieldNode,
        (leftSideValidity: boolean, rightSideValidity: boolean): boolean =>
          // XOR is valid if the left or right side is given, but not when both are given
          (leftSideValidity || rightSideValidity) &&
          !(leftSideValidity && rightSideValidity),
      );
    case 'OR':
      return executeConstraintValidationWithRule(
        context,
        constraint,
        fieldNode,
        (leftSideValidity: boolean, rightSideValidity: boolean): boolean =>
          // OR is valid if the left or right side is given, or both
          leftSideValidity || rightSideValidity,
      );
    case 'THEN':
      return executeConstraintValidationWithRule(
        context,
        constraint,
        fieldNode,
        (leftSideValidity: boolean, rightSideValidity: boolean): boolean =>
          // THEN is invalid if left is given and right not
          // So we take the not of this test to check when a THEN is valid.
          !(leftSideValidity && !rightSideValidity),
      );
    case 'WITH':
      return executeConstraintValidationWithRule(
        context,
        constraint,
        fieldNode,
        (leftSideValidity: boolean, rightSideValidity: boolean): boolean =>
          // WITH is valid when left and right are either both valid or both invalid
          (leftSideValidity && rightSideValidity) ||
          (!leftSideValidity && !rightSideValidity),
      );
    default:
      // TODO better error (should not happen)
      // console.log('Unknown Constraint: ' + constraint.name);
      context.reportError(
        new GraphQLError(
          interparameterConstraintViolationMessage(
            constraint,
            fieldNode.name.value,
          ),
          fieldNode,
        ),
      );
      return false;
  }
}

function executeConstraintValidationWithRule(
  context,
  constraint: GraphQLConstraint,
  fieldNode,
  isValidFunction: (boolean, boolean) => boolean,
): boolean {
  // TODO remove logs
  // console.log('Constraint:');
  // console.log(constraint);

  const args = fieldNodeToArgMap(fieldNode);

  // console.log('Args:');
  // console.log(args);

  const leftSideValidity =
    typeof constraint.leftSide === 'object'
      ? validateConstraint(context, constraint.leftSide, fieldNode)
      : args[constraint.leftSide] !== undefined;
  const rightSideValidity =
    typeof constraint.rightSide === 'object'
      ? validateConstraint(context, constraint.rightSide, fieldNode)
      : args[constraint.rightSide] !== undefined;

  // console.log(leftSideValidity);
  // console.log(rightSideValidity);

  // If the left side is valid, then the right side should be valid too
  if (isValidFunction(leftSideValidity, rightSideValidity)) {
    return true;
  }

  context.reportError(
    new GraphQLError(
      interparameterConstraintViolationMessage(
        constraint,
        fieldNode.name.value,
      ),
      fieldNode,
    ),
  );

  return false;
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