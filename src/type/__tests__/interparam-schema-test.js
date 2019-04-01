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
          THEN(XOR(id, name), XOR(phone, email))
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
        locations: [{ line: 4, column: 11 }],
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
        locations: [{ line: 4, column: 11 }],
      },
    ]);
  });

  it('accepts valid NOT interparameter constraint definition', () => {
    const schema = buildSchema(`
      type Query {
        field(id: ID, name: String, phone: Int){
          NOT(id)
        }: String
      }
    `);
    expect(validateSchema(schema)).to.deep.equal([]);
  });

  it('accepts valid nested NOT interparameter constraint definition', () => {
    const schema = buildSchema(`
      type Query {
        field(name: String, phone: Int){
          NOT(OR(NOT(name), phone))
        }: String
      }
    `);
    expect(validateSchema(schema)).to.deep.equal([]);
  });

  it('rejects invalid NOT constraint definition', () => {
    const schema = buildSchema(`
      type Query {
        field(id: ID, name: String){
          NOT(unknown)
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

  it('rejects an invalid nested NOT constraint definition', () => {
    const schema = buildSchema(`
      type Query {
        field(id: ID, name: String, phone: String){
          AND(phone, NOT(unknown))
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

  it('accepts valid value dependent constraint definition', () => {
    const schema = buildSchema(`
      type Query {
        field(postal_code: Int){
          >=(postal_code, 1000)
        }: String
      }
    `);
    expect(validateSchema(schema)).to.deep.equal([]);
  });

  it('rejects invalid named value dependent constraint definition', () => {
    const schema = buildSchema(`
      type Query {
        field(postal_code: Int){
          >=(unknown, 1000)
        }: String
      }
    `);
    expect(validateSchema(schema)).to.deep.equal([
      {
        message:
          'The left side of Query.field.>= must be defined as argument to be used in a value constraint.',
        locations: [{ line: 4, column: 11 }],
      },
    ]);
  });

  it('accepts valid nested value dependent constraint definition', () => {
    const schema = buildSchema(`
      type Query {
        field(postal_code: Int, phone: String){
          XOR(
            >=(postal_code, 1000),
            phone
          )
        }: String
      }
    `);
    expect(validateSchema(schema)).to.deep.equal([]);
  });
  // TODO add incorrectly nested value dependent constraints

  it('rejects unsatisfiable constraint definitions', () => {
    const schema = buildSchema(`
      type Query {
        field(id: ID, postal_code: Int, phone: String){
          AND(postal_code, phone)
          AND(id, postal_code)
          XOR(id, phone)
        }: String
      }
    `);
    expect(validateSchema(schema)).to.deep.equal([
      {
        message: 'The constraints defined on Query.field are not satisfiable.',
        locations: [{ line: 3, column: 9 }],
      },
    ]);
  });

  it('rejects unsatisfiable constraint definitions with required arguments', () => {
    const schema = buildSchema(`
      type Query {
        field(id: ID!, postal_code: Int!){
          XOR(id, postal_code) 
        }: String
      }
    `);
    expect(validateSchema(schema)).to.deep.equal([
      {
        message: 'The constraints defined on Query.field are not satisfiable.',
        locations: [{ line: 3, column: 9 }],
      },
    ]);
  });
});
