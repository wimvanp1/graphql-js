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
          id XOR name
        }: String
      }
    `);
    expect(validateSchema(schema)).to.deep.equal([]);
  });

  it('rejects invalid interparameter constraints', () => {
    const schema = buildSchema(`
      type Query {
        field(name: String, name: String){ 
          unknown XOR name
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
          id XOR name
          name THEN phone
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
          (id XOR name) XOR phone
        }: String
      }
    `);
    expect(validateSchema(schema)).to.deep.equal([]);
  });

  it('accepts valid nested rightside interparameter constraints', () => {
    const schema = buildSchema(`
      type Query {
        field(id: ID, name: String, phone: Int){
          id THEN (name XOR phone)
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
          ((id XOR unknown) XOR phone)
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
          (id XOR (phone XOR unknown))
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
});
