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

describe('Type System', () => {
  it('accepts valid interparameter constraints', () => {
    const schema = buildSchema(`
      type Query {
        field(id: ID, name: String){
          XOR(id, name)
        }: String
      }
    `);
    expect(validateSchema(schema)).to.deep.equal([]);
  });

  it('rejects invalid interparameter constraints', () => {
    const schema = buildSchema(`
      type Query {
        field(name: String, name: String){ 
          XOR(unknown, name)
        }: String
      }
    `);

    // The first line of the query is the empty line in the beginning of the string!
    expect(validateSchema(schema)).to.deep.equal([
      {
        message:
          'Query.field.unknown must be defined as argument to be used in a constraint.',
        locations: [{ line: 4, column: 11 }],
      },
    ]);
  });

  it('accepts multiple valid interparameter constraints', () => {
    const schema = buildSchema(`
      type Query {
        field(id: ID, name: String, phone: Int){
          XOR(id, name)
          THEN(name, phone)
        }: String
      }
    `);
    expect(validateSchema(schema)).to.deep.equal([]);
  });

  // TODO add additional test
  /*
  it('rejects duplicate interparameter constraints', () => {
    const schema = buildSchema(`
      type Query {
        field(id: ID, name: String, phone: Int){
          id XOR name
          id XOR name
        }: String
      }
    `);
    expect(validateSchema(schema)).to.deep.equal([
      {
        message:
          'Query.field.unknown must be defined as argument to be used in a constraint.',
        locations: [{ line: 4, column: 11 }],
      },
    ]);
  });
  */
  it('accepts valid nested leftside interparameter constraints', () => {
    const schema = buildSchema(`
      type Query {
        field(id: ID, name: String, phone: Int){
          XOR(XOR(id, name), phone)
        }: String
      }
    `);
    expect(validateSchema(schema)).to.deep.equal([]);
  });

  it('accepts valid nested rightside interparameter constraints', () => {
    const schema = buildSchema(`
      type Query {
        field(id: ID, name: String, phone: Int){
          THEN(id, XOR(name, phone))
        }: String
      }
    `);
    expect(validateSchema(schema)).to.deep.equal([]);
  });

  it('accepts valid nested interparameter constraints on both sides', () => {
    const schema = buildSchema(`
      type Query {
        field(id: ID, name: String, phone: Int, email: String){
          (id XOR name) THEN (phone XOR email)
        }: String
      }
    `);
    expect(validateSchema(schema)).to.deep.equal([]);
  });

  it('rejects left nested invalid interparameter constraints', () => {
    const schema = buildSchema(`
      type Query {
        field(id: ID, name: String, phone: Int){
          XOR(XOR(id, unknown), phone)
        }: String
      }
    `);
    expect(validateSchema(schema)).to.deep.equal([
      {
        message:
          'Query.field.unknown must be defined as argument to be used in a constraint.',
        locations: [{ line: 4, column: 13 }],
      },
    ]);
  });

  it('rejects right nested invalid interparameter constraints', () => {
    const schema = buildSchema(`
      type Query {
        field(id: ID, name: String, phone: Int){
          XOR(id, XOR(phone, unknown))
        }: String
      }
    `);
    expect(validateSchema(schema)).to.deep.equal([
      {
        message:
          'Query.field.unknown must be defined as argument to be used in a constraint.',
        locations: [{ line: 4, column: 12 }],
      },
    ]);
  });

  // TODO make this test
  /* it('accepts valid NOT interparameter constraints', () => {
    const schema = buildSchema(`
      type Query {
        field(id: ID, name: String, phone: Int){
          NOT(id)
        }: String
      }
    `);
    expect(validateSchema(schema)).to.deep.equal([]);
  }); */

  // TODO nested not tests
  // TODO tests with not in other constraints
});
