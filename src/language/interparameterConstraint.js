/**
 * Copyright (c) 2018 Wim Vanparijs
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

export const InterparameterConstraintOperator = Object.freeze({
  XOR: 'XOR',
  OR: 'OR',
  THEN: 'THEN',
  WITH: 'WITH',
  AND: 'AND',
  NOT: 'NOT',
});

export const InterparameterValueConstraintOperator = Object.freeze({
  GT: '>',
  LT: '<',
  GTE: '>=',
  LTE: '<=',
  E: '=',
});

export function isInterparameterConstraintOperator(name: string) {
  return InterparameterConstraintOperator.hasOwnProperty(name);
}

export function isInterparameterValueConstraintOperator(symbol: string) {
  return (
    Object.values(InterparameterValueConstraintOperator).indexOf(symbol) > -1
  );
}
