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
  getInterParamTestSchema,
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
  it('accepts a basic XOR constraint with the left parameter given', () => {
    expectPassesRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'XOR',
          leftSide: 'id',
          rightSide: 'name',
        },
      ]),
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

  it('accepts a basic XOR constraint with the right parameter given', () => {
    expectPassesRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'XOR',
          leftSide: 'id',
          rightSide: 'name',
        },
      ]),
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

  it('accepts a leftside nested XOR constraint', () => {
    expectPassesRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'XOR',
          leftSide: {
            name: 'XOR',
            leftSide: 'age',
            rightSide: 'income',
          },
          rightSide: 'hasDrivingLicense',
        },
      ]),
      NoInterparamConstraintViolations,
      `
      {
        human(age: 33){
          iq
        }
      }
      `,
    );
  });

  it('accepts a rightside nested XOR constraint', () => {
    expectPassesRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'XOR',
          leftSide: 'hasDrivingLicense',
          rightSide: {
            name: 'XOR',
            leftSide: 'age',
            rightSide: 'income',
          },
        },
      ]),
      NoInterparamConstraintViolations,
      `
      {
        human(income: 33){
          iq
        }
      }
      `,
    );
  });

  it('recognizes a basic XOR violation', () => {
    expectFailsRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'XOR',
          leftSide: 'id',
          rightSide: 'name',
        },
      ]),
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

  it('recognizes a basic XOR violation with different parameters', () => {
    expectFailsRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'XOR',
          leftSide: 'id',
          rightSide: 'name',
        },
      ]),
      NoInterparamConstraintViolations,
      `
      {
        human(income: 1000){
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

  it('rejects an invalid leftside nested XOR constraint', () => {
    expectFailsRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'XOR',
          leftSide: {
            name: 'XOR',
            leftSide: 'age',
            rightSide: 'income',
          },
          rightSide: 'hasDrivingLicense',
        },
      ]),
      NoInterparamConstraintViolations,
      `
      {
        human(age: 33, income: 3000, hasDrivingLicense: true){
          iq
        }
      }
      `,
      [
        interparamViolation(
          'human',
          { name: 'XOR', leftSide: 'age', rightSide: 'income' },
          3,
          9,
        ),
      ],
    );
  });

  it('rejects an invalid rightside nested XOR constraint', () => {
    expectFailsRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'XOR',
          leftSide: 'hasDrivingLicense',
          rightSide: {
            name: 'XOR',
            leftSide: 'age',
            rightSide: 'income',
          },
        },
      ]),
      NoInterparamConstraintViolations,
      `
      {
        human(age: 33, income: 3000, hasDrivingLicense: true){
          iq
        }
      }
      `,
      [
        interparamViolation(
          'human',
          { name: 'XOR', leftSide: 'age', rightSide: 'income' },
          3,
          9,
        ),
      ],
    );
  });

  /*
   * Then Constraints
   */
  it('accepts a basic valid THEN constraint with both parameters given', () => {
    expectPassesRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'THEN',
          leftSide: 'id',
          rightSide: 'name',
        },
      ]),
      NoInterparamConstraintViolations,
      `
      {
        human(id: 3, name: "Wim"){
          iq
        }
      }
    `,
    );
  });

  it('accepts a basic valid THEN constraint with no parameters given', () => {
    expectPassesRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'THEN',
          leftSide: 'id',
          rightSide: 'name',
        },
      ]),
      NoInterparamConstraintViolations,
      `
      {
        human{
          iq
        }
      }
    `,
    );
  });

  it('accepts a leftside nested THEN constraint', () => {
    expectPassesRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'THEN',
          leftSide: {
            name: 'THEN',
            leftSide: 'age',
            rightSide: 'income',
          },
          rightSide: 'hasDrivingLicense',
        },
      ]),
      NoInterparamConstraintViolations,
      `
      {
        human(age: 33, income: 999, hasDrivingLicense: false){
          iq
        }
      }
      `,
    );
  });

  it('accepts a rightside nested THEN constraint', () => {
    expectPassesRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'THEN',
          leftSide: 'hasDrivingLicense',
          rightSide: {
            name: 'THEN',
            leftSide: 'age',
            rightSide: 'income',
          },
        },
      ]),
      NoInterparamConstraintViolations,
      `
      {
        human(hasDrivingLicense: true, income: 33){
          iq
        }
      }
      `,
    );
  });

  it('recognizes a basic THEN violation', () => {
    expectFailsRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'THEN',
          leftSide: 'id',
          rightSide: 'name',
        },
      ]),
      NoInterparamConstraintViolations,
      `
      {
        human(id: 3){
          iq
        }
      }
      `,
      [
        interparamViolation(
          'human',
          { name: 'THEN', leftSide: 'id', rightSide: 'name' },
          3,
          9,
        ),
      ],
    );
  });

  it('rejects an invalid leftside nested THEN constraint', () => {
    expectFailsRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'THEN',
          leftSide: {
            name: 'THEN',
            leftSide: 'age',
            rightSide: 'income',
          },
          rightSide: 'hasDrivingLicense',
        },
      ]),
      NoInterparamConstraintViolations,
      `
      {
        human(age: 33, hasDrivingLicense: true){
          iq
        }
      }
      `,
      [
        interparamViolation(
          'human',
          { name: 'THEN', leftSide: 'age', rightSide: 'income' },
          3,
          9,
        ),
      ],
    );
  });

  it('rejects an invalid leftside nested THEN constraint', () => {
    expectFailsRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'THEN',
          leftSide: {
            name: 'THEN',
            leftSide: 'age',
            rightSide: 'hasDrivingLicense',
          },
          rightSide: 'income',
        },
      ]),
      NoInterparamConstraintViolations,
      `
      {
        human(age: 33, hasDrivingLicense: true){
          iq
        }
      }
      `,
      [
        interparamViolation(
          'human',
          {
            name: 'THEN',
            leftSide: {
              name: 'THEN',
              leftSide: 'age',
              rightSide: 'hasDrivingLicense',
            },
            rightSide: 'income',
          },
          3,
          9,
        ),
      ],
    );
  });

  it('rejects an invalid rightside nested THEN constraint', () => {
    expectFailsRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'THEN',
          leftSide: 'hasDrivingLicense',
          rightSide: {
            name: 'THEN',
            leftSide: 'age',
            rightSide: 'income',
          },
        },
      ]),
      NoInterparamConstraintViolations,
      `
      {
        human(age: 33, hasDrivingLicense: true){
          iq
        }
      }
      `,
      [
        interparamViolation(
          'human',
          { name: 'THEN', leftSide: 'age', rightSide: 'income' },
          3,
          9,
        ),
        interparamViolation(
          'human',
          {
            name: 'THEN',
            leftSide: 'hasDrivingLicense',
            rightSide: { name: 'THEN', leftSide: 'age', rightSide: 'income' },
          },
          3,
          9,
        ),
      ],
    );
  });
});
