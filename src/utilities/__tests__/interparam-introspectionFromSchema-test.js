/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

import { describe, it } from 'mocha';
import { expect } from 'chai';

import dedent from '../../jsutils/dedent';
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
} from '../../type';
import { printSchema } from '../schemaPrinter';
import { buildClientSchema } from '../buildClientSchema';
import { introspectionFromSchema } from '../introspectionFromSchema';

function introspectionToSDL(introspection) {
  return printSchema(buildClientSchema(introspection));
}

describe('introspectionFromSchema', () => {
  it('converts a simple schema with interparameter constraints', () => {
    const introspection = introspectionFromSchema(
      new GraphQLSchema({
        query: new GraphQLObjectType({
          name: 'Simple',
          fields: {
            aField: {
              type: GraphQLString,
              args: {
                intArg: {
                  type: GraphQLInt,
                },
                boolArg: {
                  type: GraphQLBoolean,
                },
              },
              constraints: [
                {
                  name: 'XOR',
                  leftSide: 'intArg',
                  rightSide: 'boolArg',
                },
              ],
            },
          },
        }),
      }),
    );

    expect(introspectionToSDL(introspection)).to.deep.equal(dedent`
        schema {
          query: Simple
        }
        
        type Simple {
          aField(intArg: Int, boolArg: Boolean){
            XOR(intArg, boolArg)
          }: String
        }
      `);
  });

  it('converts a schema with nested interparameter constraints', () => {
    const introspection = introspectionFromSchema(
      new GraphQLSchema({
        query: new GraphQLObjectType({
          name: 'Simple',
          fields: {
            aField: {
              type: GraphQLString,
              args: {
                intArg: {
                  type: GraphQLInt,
                },
                boolArg: {
                  type: GraphQLBoolean,
                },
              },
              constraints: [
                {
                  name: 'XOR',
                  leftSide: {
                    name: 'NOT',
                    leftSide: 'intArg',
                  },
                  rightSide: 'boolArg',
                },
              ],
            },
          },
        }),
      }),
    );

    expect(introspectionToSDL(introspection)).to.deep.equal(dedent`
        schema {
          query: Simple
        }
        
        type Simple {
          aField(intArg: Int, boolArg: Boolean){
            XOR(NOT(intArg), boolArg)
          }: String
        }
      `);
  });
});
