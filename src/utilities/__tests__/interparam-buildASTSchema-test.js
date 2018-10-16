/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @noflow
 */

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { parse } from '../../language';
import { printSchema } from '../schemaPrinter';
import { buildASTSchema } from '../buildASTSchema';
import dedent from '../../jsutils/dedent';

/**
 * This function does a full cycle of going from a
 * string with the contents of the DSL, parsed
 * in a schema AST, materializing that schema AST
 * into an in-memory GraphQLSchema, and then finally
 * printing that GraphQL into the DSL
 */
function cycleOutput(body, options) {
  const ast = parse(body);
  const schema = buildASTSchema(ast, options);
  return printSchema(schema, options);
}

describe('Schema Builder', () => {
  it('Handles a field with a XOR-interparameter constraint', () => {
    const body = dedent`
      type Query {
        str(i1: Int, i2: Int){
          i1 XOR i2
        }: String
      }
    `;

    expect(cycleOutput(body)).to.equal(body);
  });
});
