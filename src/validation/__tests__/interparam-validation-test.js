/**
 * Copyright (c) 2015-present, Wim Vanparijs
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

import { describe, it } from 'mocha';
import {
  expectFailsRuleWithSchema,
  expectPassesRuleWithSchema,
  interparamTestSchema,
} from './harness';
import {
  interparameterConstraintViolationMessage,
  NoInterparamConstraintViolations,
} from '../rules/NoInterparamConstraintViolations';

function interparamViolation(fieldName, constraint, line, column) {
  return {
    message: interparameterConstraintViolationMessage(constraint, fieldName),
    locations: [{ line, column }],
  };
}

describe('Validate: Interparameterconstraints', () => {
  it('accepts a basic XOR constraint', () => {
    expectPassesRuleWithSchema(
      interparamTestSchema,
      NoInterparamConstraintViolations,
      `
      {
        human(id: 3){
          iq
        }
      }
    `,
    );
  });

  it('accepts a basic XOR constraint', () => {
    expectPassesRuleWithSchema(
      interparamTestSchema,
      NoInterparamConstraintViolations,
      `
      {
        human(name: "Wim"){
          iq
        }
      }
    `,
    );
  });

  it('recognizes a basic XOR violation', () => {
    expectFailsRuleWithSchema(
      interparamTestSchema,
      NoInterparamConstraintViolations,
      `
      {
        human(id: 3, name: "Wim"){
          iq
        }
      }
      `,
      [
        interparamViolation(
          'human',
          { name: 'XOR', leftSide: 'id', rightSide: 'name' },
          3,
          9,
        ),
      ],
    );
  });

  // TODO add tests for nested XOR violations + nested XOR passes
});
