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
import type { FieldNode } from '../../language';

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
    case 'AND':
      return executeConstraintValidationWithRule(
        context,
        constraint,
        fieldNode,
        (leftSideValidity: boolean, rightSideValidity: boolean): boolean =>
          // AND is valid when left and right are both valid
          leftSideValidity && rightSideValidity,
      );
    case 'NOT':
      return executeConstraintValidationWithRule(
        context,
        constraint,
        fieldNode,
        // The rightSideValidity would be true for a not constraint
        (leftSideValidity: boolean, _): boolean => !leftSideValidity,
      );
    case '>':
      return executeValueConstraintValidationWithRule(
        context,
        constraint,
        fieldNode,
        (fieldValue: number, value: number): boolean => fieldValue > value,
      );
    case '>=':
      return executeValueConstraintValidationWithRule(
        context,
        constraint,
        fieldNode,
        (fieldValue: number, value: number): boolean => fieldValue >= value,
      );
    case '<':
      return executeValueConstraintValidationWithRule(
        context,
        constraint,
        fieldNode,
        (fieldValue: number, value: number): boolean => fieldValue < value,
      );
    case '<=':
      return executeValueConstraintValidationWithRule(
        context,
        constraint,
        fieldNode,
        (fieldValue: number, value: number): boolean => fieldValue <= value,
      );
    case '=':
      return executeValueConstraintValidationWithRule(
        context,
        constraint,
        fieldNode,
        (fieldValue: number, value: number): boolean => fieldValue === value,
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
  isValidFunction, // (boolean, boolean) => boolean)
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

  let rightSideValidity = true;

  // Only validate the validity of the right side if an argument/constraint is given
  // There is no right side with a not constraint
  // A value can also be given if this is a value dependent constraint. This case is tested elsewhere.
  if (
    constraint.rightSide &&
    (typeof constraint.rightSide === 'string' ||
      typeof constraint.rightSide === 'object')
  ) {
    rightSideValidity =
      typeof constraint.rightSide === 'object'
        ? validateConstraint(context, constraint.rightSide, fieldNode)
        : args[constraint.rightSide] !== undefined;
  }

  // console.log(leftSideValidity);
  // console.log(rightSideValidity);

  // Check if this combination of valid sides is also valid as a whole for this constraint
  // Note that in case the constraint does not have a right side, true will be given!
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

/**
 * Checks the validity of a value constraint
 * @param context
 * @param constraint The constraint to be checked
 * @param fieldNode The node of the field where the constraint is located
 * @param isValidFunction (fieldValue: number, value: number): boolean
 * @returns {boolean}
 */
function executeValueConstraintValidationWithRule(
  context,
  constraint: GraphQLConstraint,
  fieldNode,
  isValidFunction, // (number, number) => boolean)
): boolean {
  const args = fieldNodeToArgMap(fieldNode);

  if (
    constraint.leftSide &&
    typeof constraint.leftSide === 'string' &&
    constraint.rightSide
  ) {
    // Test the general case with a numberic value constraint
    if (typeof constraint.rightSide === 'number') {
      const paramName: string = constraint.leftSide;
      const rightValue: number = constraint.rightSide;
      const argValue = args[paramName];

      if (
        !isNaN(constraint.rightSide) &&
        constraint.rightSide !== undefined &&
        typeof argValue === 'string' &&
        !isNaN(argValue) &&
        isValidFunction(parseFloat(argValue), rightValue)
      ) {
        return true;
      }
    }

    // Test a special case where the equal operator is used with a string or bool
    else if (
      constraint.name === '=' &&
      typeof constraint.rightSide === 'string'
    ) {
      const paramName: string = constraint.leftSide;
      const rightValue: string = constraint.rightSide;
      const argValue = args[paramName];

      // String scenario
      if (typeof argValue === 'string' && argValue === rightValue) {
        return true;
      }

      // Boolean scenario
      if (
        typeof argValue === 'boolean' &&
        ((argValue === true && rightValue.toLowerCase() === 'true') ||
          (argValue === false && rightValue.toLowerCase() === 'false'))
      ) {
        return true;
      }
    }
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
function fieldNodeToArgMap(fieldNode: FieldNode) {
  if (!fieldNode || !fieldNode.arguments) {
    // No arguments have been defined, return an empty map
    return {};
  }

  const args = fieldNode.arguments;

  return keyValMap(
    args,
    field => field.name.value,
    field =>
      field.value && field.value.value !== undefined
        ? field.value.value
        : undefined,
  );
}

function constraintToString(constraint: GraphQLConstraint): string {
  let result = constraint.name + '(';

  result +=
    typeof constraint.leftSide === 'object'
      ? '(' + constraintToString(constraint.leftSide) + ')'
      : constraint.leftSide;

  // The right side is optional in a NOT constraint
  if (constraint.rightSide) {
    result += ', ';
    result +=
      typeof constraint.rightSide === 'object'
        ? '(' + constraintToString(constraint.rightSide) + ')'
        : constraint.rightSide;
  }

  result += ')';

  return result;
}
