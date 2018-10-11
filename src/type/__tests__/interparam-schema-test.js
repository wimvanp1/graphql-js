/**
 * Copyright (c) 2015-present, Wim Vanparijs
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

import { describe, it } from 'mocha';
import { expect } from 'chai';
import { validateSchema } from '../validate';
import { buildSchema } from '../../utilities/buildASTSchema';

describe('Type System: accepts interparameter constraints', () => {
  it('accepts valid interparameter constraints', () => {
    const schema = buildSchema(`
      type Query {
        field(id: ID, name: String){
          id XOR name
        }: String
      }
    `);
    expect(validateSchema(schema)).to.deep.equal([]);
  });

  it('rejects invalid interparameter constraints', () => {
    const schema = buildSchema(`
      type Query {
        field(id: ID, name: String){
          unknown XOR name
        }: String
      }
    `);
    expect(validateSchema(schema)).to.deep.equal([]);
  });
});
