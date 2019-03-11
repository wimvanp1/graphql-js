/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @noflow
 */

import { describe, it } from 'mocha';
import { expect } from 'chai';
import { buildClientSchema } from '../buildClientSchema';
import { introspectionFromSchema } from '../introspectionFromSchema';
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
} from '../../';

// Test property:
// Given a server's schema, a client may query that server with introspection,
// and use the result to produce a client-side representation of the schema
// by using "buildClientSchema". If the client then runs the introspection
// query against the client-side schema, it should get a result identical to
// what was returned by the server.
function testSchema(serverSchema) {
  const initialIntrospection = introspectionFromSchema(serverSchema);
  const clientSchema = buildClientSchema(initialIntrospection);
  const secondIntrospection = introspectionFromSchema(clientSchema);
  expect(secondIntrospection).to.deep.equal(initialIntrospection);
}

describe('Type System: build schema from introspection', () => {
  it('builds a schema with interparameter constraints', () => {
    const schema = new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'ArgFields',
        fields: {
          two: {
            description: 'A field with a two args and a XOR constraint',
            type: GraphQLString,
            args: {
              listArg: {
                description: 'This is an list of int arg',
                type: GraphQLList(GraphQLInt),
              },
              boolArg: {
                description: 'This is a boolean arg',
                type: GraphQLBoolean,
              },
            },
            constraints: [
              {
                name: 'XOR',
                leftSide: 'listArg',
                rightSide: 'boolArg',
              },
            ],
          },
        },
      }),
    });

    testSchema(schema);
  });
});
