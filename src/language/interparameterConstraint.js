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

export function isInterparameterConstraintOperator(name: string) {
  return InterparameterConstraintOperator.hasOwnProperty(name);
}
