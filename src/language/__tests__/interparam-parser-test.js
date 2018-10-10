/**
 * @flow strict
 */

import { describe, it } from 'mocha';
import { parse } from '../parser';
import { expect } from 'chai';
import toJSONDeep from './toJSONDeep';
import { Kind } from '../kinds';

describe('Interparameter Constraints Parser Tests', () => {
  it('Correctly creates an ast from a schema with one interparameter constraint', async () => {
    const schema = `
      type Query {
        user(id: String, name: String){
          id XOR name
        }: User
      }
    `;

    const result = parse(schema);

    expect(toJSONDeep(result)).to.deep.equal({
      kind: Kind.DOCUMENT,
      loc: { start: 0, end: 110 },
      definitions: [
        {
          description: undefined,
          directives: [],
          fields: [
            {
              arguments: [
                {
                  defaultValue: undefined,
                  description: undefined,
                  directives: [],
                  kind: Kind.INPUT_VALUE_DEFINITION,
                  loc: { end: 43, start: 33 },
                  name: {
                    kind: Kind.NAME,
                    loc: { end: 35, start: 33 },
                    value: 'id',
                  },
                  type: {
                    kind: Kind.NAMED_TYPE,
                    loc: { end: 43, start: 37 },
                    name: {
                      kind: Kind.NAME,
                      loc: { end: 43, start: 37 },
                      value: 'String',
                    },
                  },
                },
                {
                  defaultValue: undefined,
                  description: undefined,
                  directives: [],
                  kind: Kind.INPUT_VALUE_DEFINITION,
                  loc: { end: 57, start: 45 },
                  name: {
                    kind: Kind.NAME,
                    loc: { end: 49, start: 45 },
                    value: 'name',
                  },
                  type: {
                    kind: Kind.NAMED_TYPE,
                    loc: { end: 57, start: 51 },
                    name: {
                      kind: Kind.NAME,
                      loc: { end: 57, start: 51 },
                      value: 'String',
                    },
                  },
                },
              ],
              constraints: [
                {
                  kind: Kind.CONSTRAINT_DEFINITION,
                  loc: { end: 81, start: 70 },
                  name: {
                    kind: Kind.NAME,
                    loc: { end: 76, start: 73 },
                    value: 'XOR',
                  },
                  variables: [
                    {
                      kind: Kind.NAME,
                      loc: { end: 72, start: 70 },
                      value: 'id',
                    },
                    {
                      kind: Kind.NAME,
                      loc: { end: 81, start: 77 },
                      value: 'name',
                    },
                  ],
                },
              ],
              description: undefined,
              directives: [],
              kind: Kind.FIELD_DEFINITION,
              loc: { end: 97, start: 28 },
              name: {
                kind: Kind.NAME,
                loc: { end: 32, start: 28 },
                value: 'user',
              },
              type: {
                kind: Kind.NAMED_TYPE,
                loc: { end: 97, start: 93 },
                name: {
                  kind: Kind.NAME,
                  loc: { end: 97, start: 93 },
                  value: 'User',
                },
              },
            },
          ],
          interfaces: [],
          kind: Kind.OBJECT_TYPE_DEFINITION,
          loc: { end: 105, start: 7 },
          name: {
            kind: Kind.NAME,
            loc: { end: 17, start: 12 },
            value: 'Query',
          },
        },
      ],
    });
  });

  it('Correctly creates an ast from a schema with multiple interparameter constraints', async () => {
    const schema = `
      type Query {
        user(id: String, name: String){
          id XOR name
          id AND name
          id OR name
        }: User
      }
    `;

    const result = parse(schema);

    expect(toJSONDeep(result)).to.deep.equal({
      kind: Kind.DOCUMENT,
      loc: { start: 0, end: 153 },
      definitions: [
        {
          description: undefined,
          directives: [],
          fields: [
            {
              arguments: [
                {
                  defaultValue: undefined,
                  description: undefined,
                  directives: [],
                  kind: Kind.INPUT_VALUE_DEFINITION,
                  loc: { end: 43, start: 33 },
                  name: {
                    kind: Kind.NAME,
                    loc: { end: 35, start: 33 },
                    value: 'id',
                  },
                  type: {
                    kind: Kind.NAMED_TYPE,
                    loc: { end: 43, start: 37 },
                    name: {
                      kind: Kind.NAME,
                      loc: { end: 43, start: 37 },
                      value: 'String',
                    },
                  },
                },
                {
                  defaultValue: undefined,
                  description: undefined,
                  directives: [],
                  kind: Kind.INPUT_VALUE_DEFINITION,
                  loc: { end: 57, start: 45 },
                  name: {
                    kind: Kind.NAME,
                    loc: { end: 49, start: 45 },
                    value: 'name',
                  },
                  type: {
                    kind: Kind.NAMED_TYPE,
                    loc: { end: 57, start: 51 },
                    name: {
                      kind: Kind.NAME,
                      loc: { end: 57, start: 51 },
                      value: 'String',
                    },
                  },
                },
              ],
              constraints: [
                {
                  kind: Kind.CONSTRAINT_DEFINITION,
                  loc: { end: 81, start: 70 },
                  name: {
                    kind: Kind.NAME,
                    loc: { end: 76, start: 73 },
                    value: 'XOR',
                  },
                  variables: [
                    {
                      kind: Kind.NAME,
                      loc: { end: 72, start: 70 },
                      value: 'id',
                    },
                    {
                      kind: Kind.NAME,
                      loc: { end: 81, start: 77 },
                      value: 'name',
                    },
                  ],
                },
                {
                  kind: Kind.CONSTRAINT_DEFINITION,
                  loc: { end: 103, start: 92 },
                  name: {
                    kind: Kind.NAME,
                    loc: { end: 98, start: 95 },
                    value: 'AND',
                  },
                  variables: [
                    {
                      kind: Kind.NAME,
                      loc: { end: 94, start: 92 },
                      value: 'id',
                    },
                    {
                      kind: Kind.NAME,
                      loc: { end: 103, start: 99 },
                      value: 'name',
                    },
                  ],
                },
                {
                  kind: Kind.CONSTRAINT_DEFINITION,
                  loc: { end: 124, start: 114 },
                  name: {
                    kind: Kind.NAME,
                    loc: { end: 119, start: 117 },
                    value: 'OR',
                  },
                  variables: [
                    {
                      kind: Kind.NAME,
                      loc: { end: 116, start: 114 },
                      value: 'id',
                    },
                    {
                      kind: Kind.NAME,
                      loc: { end: 124, start: 120 },
                      value: 'name',
                    },
                  ],
                },
              ],
              description: undefined,
              directives: [],
              kind: Kind.FIELD_DEFINITION,
              loc: { end: 140, start: 28 },
              name: {
                kind: Kind.NAME,
                loc: { end: 32, start: 28 },
                value: 'user',
              },
              type: {
                kind: Kind.NAMED_TYPE,
                loc: { end: 140, start: 136 },
                name: {
                  kind: Kind.NAME,
                  loc: { end: 140, start: 136 },
                  value: 'User',
                },
              },
            },
          ],
          interfaces: [],
          kind: Kind.OBJECT_TYPE_DEFINITION,
          loc: { end: 148, start: 7 },
          name: {
            kind: Kind.NAME,
            loc: { end: 17, start: 12 },
            value: 'Query',
          },
        },
      ],
    });
  });
});
