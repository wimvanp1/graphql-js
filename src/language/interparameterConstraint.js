/**
 * Copyright (c) 2018 Wim Vanparijs
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

import type { NameNode } from './ast';

export const InterparameterConstraintOperator = Object.freeze({
  XOR: 'XOR',
  THEN: 'THEN',
  WITH: 'WITH',
});

export function isInterparameterConstraintOperator(name: NameNode) {
  return InterparameterConstraintOperator.hasOwnProperty(name.value);
}
