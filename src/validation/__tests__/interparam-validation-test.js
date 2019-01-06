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

  /*
   * With Constraints
   */
  it('accepts a basic valid WITH constraint with both parameters given', () => {
    expectPassesRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'WITH',
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

  it('accepts a basic valid WITH constraint with no parameters given', () => {
    expectPassesRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'WITH',
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

  it('accepts a leftside nested WITH constraint', () => {
    expectPassesRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'WITH',
          leftSide: {
            name: 'WITH',
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

  it('accepts a rightside nested WITH constraint', () => {
    expectPassesRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'WITH',
          leftSide: 'hasDrivingLicense',
          rightSide: {
            name: 'WITH',
            leftSide: 'age',
            rightSide: 'income',
          },
        },
      ]),
      NoInterparamConstraintViolations,
      `
      {
        human(hasDrivingLicense: true, income: 33, age: 20){
          iq
        }
      }
      `,
    );
  });

  it('recognizes a basic WITH violation', () => {
    expectFailsRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'WITH',
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
          { name: 'WITH', leftSide: 'id', rightSide: 'name' },
          3,
          9,
        ),
      ],
    );
  });

  it('rejects an invalid leftside nested WITH constraint', () => {
    expectFailsRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'WITH',
          leftSide: {
            name: 'WITH',
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
          { name: 'WITH', leftSide: 'age', rightSide: 'income' },
          3,
          9,
        ),
        interparamViolation(
          'human',
          {
            name: 'WITH',
            leftSide: { name: 'WITH', leftSide: 'age', rightSide: 'income' },
            rightSide: 'hasDrivingLicense',
          },
          3,
          9,
        ),
      ],
    );
  });

  it('rejects an invalid leftside nested WITH constraint', () => {
    expectFailsRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'WITH',
          leftSide: {
            name: 'WITH',
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
            name: 'WITH',
            leftSide: {
              name: 'WITH',
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

  it('rejects an invalid rightside nested WITH constraint', () => {
    expectFailsRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'WITH',
          leftSide: 'hasDrivingLicense',
          rightSide: {
            name: 'WITH',
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
          { name: 'WITH', leftSide: 'age', rightSide: 'income' },
          3,
          9,
        ),
        interparamViolation(
          'human',
          {
            name: 'WITH',
            leftSide: 'hasDrivingLicense',
            rightSide: { name: 'WITH', leftSide: 'age', rightSide: 'income' },
          },
          3,
          9,
        ),
      ],
    );
  });

  /*
   * OR Constraints
   */
  it('accepts a basic valid OR constraint with both parameters given', () => {
    expectPassesRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'OR',
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

  it('accepts a basic valid OR constraint with one parameter given', () => {
    // left side given
    expectPassesRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'OR',
          leftSide: 'id',
          rightSide: 'name',
        },
      ]),
      NoInterparamConstraintViolations,
      `
      {
        human(id:33){
          iq
        }
      }
    `,
    );

    // right side given
    expectPassesRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'OR',
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

  it('accepts a leftside nested OR constraint', () => {
    expectPassesRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'OR',
          leftSide: {
            name: 'OR',
            leftSide: 'age',
            rightSide: 'income',
          },
          rightSide: 'hasDrivingLicense',
        },
      ]),
      NoInterparamConstraintViolations,
      `
      {
        human(income: 999){
          iq
        }
      }
      `,
    );
  });

  it('accepts a rightside nested OR constraint', () => {
    expectPassesRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'OR',
          leftSide: 'hasDrivingLicense',
          rightSide: {
            name: 'OR',
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

  it('recognizes a basic OR violation with no parameters given', () => {
    expectFailsRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'OR',
          leftSide: 'id',
          rightSide: 'name',
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
      [
        interparamViolation(
          'human',
          { name: 'OR', leftSide: 'id', rightSide: 'name' },
          3,
          9,
        ),
      ],
    );
  });

  it('rejects an invalid leftside nested OR constraint', () => {
    expectFailsRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'OR',
          leftSide: {
            name: 'OR',
            leftSide: 'age',
            rightSide: 'income',
          },
          rightSide: 'hasDrivingLicense',
        },
      ]),
      NoInterparamConstraintViolations,
      `
      {
        human(id: 951){
          iq
        }
      }
      `,
      [
        interparamViolation(
          'human',
          { name: 'OR', leftSide: 'age', rightSide: 'income' },
          3,
          9,
        ),
        interparamViolation(
          'human',
          {
            name: 'OR',
            leftSide: { name: 'OR', leftSide: 'age', rightSide: 'income' },
            rightSide: 'hasDrivingLicense',
          },
          3,
          9,
        ),
      ],
    );
  });

  it('rejects an invalid rightside nested OR constraint', () => {
    expectFailsRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'OR',
          leftSide: 'hasDrivingLicense',
          rightSide: {
            name: 'OR',
            leftSide: 'age',
            rightSide: 'income',
          },
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
      [
        interparamViolation(
          'human',
          { name: 'OR', leftSide: 'age', rightSide: 'income' },
          3,
          9,
        ),
        interparamViolation(
          'human',
          {
            name: 'OR',
            leftSide: 'hasDrivingLicense',
            rightSide: { name: 'OR', leftSide: 'age', rightSide: 'income' },
          },
          3,
          9,
        ),
      ],
    );
  });

  /*
   * AND Constraints
   */
  it('accepts a basic valid AND constraint with both parameters given', () => {
    expectPassesRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'AND',
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

  it('accepts a leftside nested AND constraint', () => {
    expectPassesRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'AND',
          leftSide: {
            name: 'AND',
            leftSide: 'age',
            rightSide: 'income',
          },
          rightSide: 'hasDrivingLicense',
        },
      ]),
      NoInterparamConstraintViolations,
      `
      {
        human(income: 999, age: 13, hasDrivingLicense: false){
          iq
        }
      }
      `,
    );
  });

  it('accepts a right side nested AND constraint', () => {
    expectPassesRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'OR',
          leftSide: 'hasDrivingLicense',
          rightSide: {
            name: 'AND',
            leftSide: 'age',
            rightSide: 'income',
          },
        },
      ]),
      NoInterparamConstraintViolations,
      `
      {
        human(age: 21, income: 33){
          iq
        }
      }
      `,
    );
  });

  it('recognizes a basic AND violation with no parameters given', () => {
    expectFailsRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'AND',
          leftSide: 'id',
          rightSide: 'name',
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
      [
        interparamViolation(
          'human',
          { name: 'AND', leftSide: 'id', rightSide: 'name' },
          3,
          9,
        ),
      ],
    );
  });

  it('recognizes a basic AND violation with one of two parameters given', () => {
    expectFailsRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'AND',
          leftSide: 'id',
          rightSide: 'name',
        },
      ]),
      NoInterparamConstraintViolations,
      `
      {
        human(id: 33){
          iq
        }
      }
      `,
      [
        interparamViolation(
          'human',
          { name: 'AND', leftSide: 'id', rightSide: 'name' },
          3,
          9,
        ),
      ],
    );

    expectFailsRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'AND',
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
      [
        interparamViolation(
          'human',
          { name: 'AND', leftSide: 'id', rightSide: 'name' },
          3,
          9,
        ),
      ],
    );
  });

  it('rejects an invalid left side nested AND constraint', () => {
    expectFailsRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'AND',
          leftSide: {
            name: 'AND',
            leftSide: 'age',
            rightSide: 'income',
          },
          rightSide: 'hasDrivingLicense',
        },
      ]),
      NoInterparamConstraintViolations,
      `
      {
        human(age: 951, hasDrivingLicense: false){
          iq
        }
      }
      `,
      [
        interparamViolation(
          'human',
          { name: 'AND', leftSide: 'age', rightSide: 'income' },
          3,
          9,
        ),
        interparamViolation(
          'human',
          {
            name: 'AND',
            leftSide: { name: 'AND', leftSide: 'age', rightSide: 'income' },
            rightSide: 'hasDrivingLicense',
          },
          3,
          9,
        ),
      ],
    );
  });

  it('rejects an invalid right side nested AND constraint', () => {
    expectFailsRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'AND',
          leftSide: 'hasDrivingLicense',
          rightSide: {
            name: 'AND',
            leftSide: 'age',
            rightSide: 'income',
          },
        },
      ]),
      NoInterparamConstraintViolations,
      `
      {
        human(hasDrivingLicense: true, name: "Wim", income: 19520){
          iq
        }
      }
      `,
      [
        interparamViolation(
          'human',
          { name: 'AND', leftSide: 'age', rightSide: 'income' },
          3,
          9,
        ),
        interparamViolation(
          'human',
          {
            name: 'AND',
            leftSide: 'hasDrivingLicense',
            rightSide: { name: 'AND', leftSide: 'age', rightSide: 'income' },
          },
          3,
          9,
        ),
      ],
    );
  });

  it('accepts a basic NOT constraint', () => {
    expectPassesRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'NOT',
          leftSide: 'id',
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

  it('accepts a nest NOT constraint', () => {
    expectPassesRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'AND',
          leftSide: 'id',
          rightSide: {
            name: 'NOT',
            leftSide: 'age',
          },
        },
      ]),
      NoInterparamConstraintViolations,
      `
      {
        human(id: 33){
          iq
        }
      }
    `,
    );
  });

  it('recognizes a basic NOT violation', () => {
    expectFailsRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'NOT',
          leftSide: 'id',
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
      [interparamViolation('human', { name: 'NOT', leftSide: 'id' }, 3, 9)],
    );
  });

  it('recognizes a nested NOT violation', () => {
    expectFailsRuleWithSchema(
      getInterParamTestSchema([
        {
          name: 'AND',
          leftSide: 'id',
          rightSide: {
            name: 'NOT',
            leftSide: 'age',
          },
        },
      ]),
      NoInterparamConstraintViolations,
      `
      {
        human(id: 3, age: 33){
          iq
        }
      }
      `,
      [
        interparamViolation('human', { name: 'NOT', leftSide: 'age' }, 3, 9),
        interparamViolation(
          'human',
          {
            name: 'AND',
            leftSide: 'id',
            rightSide: { name: 'NOT', leftSide: 'age' },
          },
          3,
          9,
        ),
      ],
    );
  });
});
