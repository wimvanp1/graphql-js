/** @noflow*/

import { describe, it } from 'mocha';
import { expect } from 'chai';
import { insertVariablesIntoDocument } from '../InsertVariablesIntoDocument';
import { buildASTSchema } from '../buildASTSchema';
import { parse } from '../../language';

describe('Variable insert mechanisms', () => {
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
      insertVariablesIntoDocument(schema, document, variableValues)
        .definitions[0].selectionSet.selections[0].arguments[0].value,
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

    // Check if var is changed correctly
    expect(
      insertVariablesIntoDocument(schema, document, variableValues)
        .definitions[0].selectionSet.selections[0].arguments[0].value,
    ).to.deep.equal({ kind: 'IntValue', value: 3 });

    // Check if var2 is changed correctly
    expect(
      insertVariablesIntoDocument(schema, document, variableValues)
        .definitions[0].selectionSet.selections[0].arguments[1].value,
    ).to.deep.equal({ kind: 'IntValue', value: 6 });
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

    expect(
      insertVariablesIntoDocument(schema, document, variableValues)
        .definitions[0].selectionSet.selections[0].arguments[0].value,
    ).to.not.equal({ kind: 'IntValue', value: 3 });
  });
});
