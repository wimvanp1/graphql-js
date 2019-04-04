/** @noflow*/

import { describe, it } from 'mocha';
import { expect } from 'chai';
import { insertVariablesIntoField } from '../insertVariablesIntoField';
import { buildASTSchema } from '../buildASTSchema';
import { parse } from '../../language';

describe('Variable insert mechanisms', () => {
  it('does not change the node when no variables need to be filled in', () => {
    const schema = buildASTSchema(
      parse(`
        type Query {
          str(i1: Int, i2: Int){
            XOR(i1, i2)
          }: String
        }
      `),
    );

    const document = parse(`
      query {
        str(i1: 3)
      }
    `);

    expect(
      JSON.stringify(
        insertVariablesIntoField(
          schema.getQueryType().getFields().str,
          document.definitions[0].selectionSet.selections[0],
          {},
        ),
      ),
    ).to.equal(
      JSON.stringify(document.definitions[0].selectionSet.selections[0]),
    );
  });

  it('inserts one value correctly', () => {
    const schema = buildASTSchema(
      parse(`
        type Query {
          str(i1: Int, i2: Int){
            XOR(i1, i2)
          }: String
        }
      `),
    );

    const document = parse(`
      query ($var: Int) {
        str(i1: $var)
      }
    `);

    const variableValues = { var: 3 };

    expect(
      insertVariablesIntoField(
        schema.getQueryType().getFields().str,
        document.definitions[0].selectionSet.selections[0],
        variableValues,
      ).arguments[0].value,
    ).to.deep.equal({ kind: 'IntValue', value: 3 });
  });

  it('inserts the multiple values correctly', () => {
    const schema = buildASTSchema(
      parse(`
        type Query {
          str(i1: Int, i2: Int){
            XOR(i1, i2)
          }: String
        }
      `),
    );

    const document = parse(`
      query ($var: Int, $var2: Int) {
        str(i1: $var, i2: $var2)
      }
    `);

    const variableValues = { var: 3, var2: 6 };

    const fieldWithInsertedVariables = insertVariablesIntoField(
      schema.getQueryType().getFields().str,
      document.definitions[0].selectionSet.selections[0],
      variableValues,
    );

    // Check if var is changed correctly
    expect(fieldWithInsertedVariables.arguments[0].value).to.deep.equal({
      kind: 'IntValue',
      value: 3,
    });

    // Check if var2 is changed correctly
    expect(fieldWithInsertedVariables.arguments[1].value).to.deep.equal({
      kind: 'IntValue',
      value: 6,
    });
  });

  it('leaves not given variables untouched', () => {
    const schema = buildASTSchema(
      parse(`
        type Query {
          str(i1: Int, i2: Int){
            XOR(i1, i2)
          }: String
        }
      `),
    );

    const document = parse(`
      query ($var: Int) {
        str(i1: $var, i2: 5)
      }
    `);

    const variableValues = {};

    // Test that the function left the variable in place
    expect(
      insertVariablesIntoField(
        schema.getQueryType().getFields().str,
        document.definitions[0].selectionSet.selections[0],
        variableValues,
      ).arguments[0].value,
    ).to.deep.equal({
      kind: 'Variable',
      name: { kind: 'Name', value: 'var', loc: { start: 44, end: 47 } },
      loc: { start: 43, end: 47 },
    });
  });
});
