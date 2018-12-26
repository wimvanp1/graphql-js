/**
 * @flow strict
 */

import { describe, it } from 'mocha';
import { parse } from '../parser';
import { expect } from 'chai';
import toJSONDeep from './toJSONDeep';
import { Kind } from '../kinds';

describe('Interparameter Constraints Parser Tests', () => {
  it('Correctly parses a schema with one interparameter constraint', async () => {
    const schema = `
      type Query {
        user(id: String, name: String){
          XOR(id, name)
        }: User
      }
    `;

    const result = parse(schema);

    expect(toJSONDeep(result)).to.deep.equal({
      kind: Kind.DOCUMENT,
      loc: { start: 0, end: 112 },
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
                  leftSide: {
                    kind: Kind.NAME,
                    loc: { end: 76, start: 74 },
                    value: 'id',
                  },
                  loc: { end: 83, start: 70 },
                  name: {
                    kind: Kind.NAME,
                    loc: { end: 73, start: 70 },
                    value: 'XOR',
                  },
                  rightSide: {
                    kind: Kind.NAME,
                    loc: { end: 82, start: 78 },
                    value: 'name',
                  },
                },
              ],
              description: undefined,
              directives: [],
              kind: Kind.FIELD_DEFINITION,
              loc: { end: 99, start: 28 },
              name: {
                kind: Kind.NAME,
                loc: { end: 32, start: 28 },
                value: 'user',
              },
              type: {
                kind: Kind.NAMED_TYPE,
                loc: { end: 99, start: 95 },
                name: {
                  kind: Kind.NAME,
                  loc: { end: 99, start: 95 },
                  value: 'User',
                },
              },
            },
          ],
          interfaces: [],
          kind: Kind.OBJECT_TYPE_DEFINITION,
          loc: { end: 107, start: 7 },
          name: {
            kind: Kind.NAME,
            loc: { end: 17, start: 12 },
            value: 'Query',
          },
        },
      ],
    });
  });

  it('Correctly parses a schema with multiple interparameter constraints', async () => {
    const schema = `
      type Query {
        user(id: String, name: String){
          XOR(id, name)
          THEN(id, name)
          XOR(id, name)
        }: User
      }
    `;

    const result = parse(schema);

    expect(toJSONDeep(result)).to.deep.equal({
      kind: Kind.DOCUMENT,
      loc: { start: 0, end: 161 },
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
                  leftSide: {
                    kind: Kind.NAME,
                    loc: { end: 76, start: 74 },
                    value: 'id',
                  },
                  loc: { end: 83, start: 70 },
                  name: {
                    kind: Kind.NAME,
                    loc: { end: 73, start: 70 },
                    value: 'XOR',
                  },
                  rightSide: {
                    kind: Kind.NAME,
                    loc: { end: 82, start: 78 },
                    value: 'name',
                  },
                },
                {
                  kind: Kind.CONSTRAINT_DEFINITION,
                  leftSide: {
                    kind: Kind.NAME,
                    loc: { end: 101, start: 99 },
                    value: 'id',
                  },
                  loc: { end: 108, start: 94 },
                  name: {
                    kind: Kind.NAME,
                    loc: { end: 98, start: 94 },
                    value: 'THEN',
                  },
                  rightSide: {
                    kind: Kind.NAME,
                    loc: { end: 107, start: 103 },
                    value: 'name',
                  },
                },
                {
                  kind: Kind.CONSTRAINT_DEFINITION,
                  leftSide: {
                    kind: Kind.NAME,
                    loc: { end: 125, start: 123 },
                    value: 'id',
                  },
                  loc: { end: 132, start: 119 },
                  name: {
                    kind: Kind.NAME,
                    loc: { end: 122, start: 119 },
                    value: 'XOR',
                  },
                  rightSide: {
                    kind: Kind.NAME,
                    loc: { end: 131, start: 127 },
                    value: 'name',
                  },
                },
              ],
              description: undefined,
              directives: [],
              kind: Kind.FIELD_DEFINITION,
              loc: { end: 148, start: 28 },
              name: {
                kind: Kind.NAME,
                loc: { end: 32, start: 28 },
                value: 'user',
              },
              type: {
                kind: Kind.NAMED_TYPE,
                loc: { end: 148, start: 144 },
                name: {
                  kind: Kind.NAME,
                  loc: { end: 148, start: 144 },
                  value: 'User',
                },
              },
            },
          ],
          interfaces: [],
          kind: Kind.OBJECT_TYPE_DEFINITION,
          loc: { end: 156, start: 7 },
          name: {
            kind: Kind.NAME,
            loc: { end: 17, start: 12 },
            value: 'Query',
          },
        },
      ],
    });
  });

  it('Correctly parses a schema with a nested left-side interparameter constraint', async () => {
    const schema = `
      type Query {
        user(aa: String, bb: String, ccc: Int){
          XOR(XOR(aa, bb), ccc)
        }: User
      }
    `;

    const result = parse(schema);

    expect(toJSONDeep(result)).to.deep.equal({
      kind: Kind.DOCUMENT,
      loc: { start: 0, end: 128 },
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
                    value: 'aa',
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
                  loc: { end: 55, start: 45 },
                  name: {
                    kind: Kind.NAME,
                    loc: { end: 47, start: 45 },
                    value: 'bb',
                  },
                  type: {
                    kind: Kind.NAMED_TYPE,
                    loc: { end: 55, start: 49 },
                    name: {
                      kind: Kind.NAME,
                      loc: { end: 55, start: 49 },
                      value: 'String',
                    },
                  },
                },
                {
                  defaultValue: undefined,
                  description: undefined,
                  directives: [],
                  kind: Kind.INPUT_VALUE_DEFINITION,
                  loc: { end: 65, start: 57 },
                  name: {
                    kind: Kind.NAME,
                    loc: { end: 60, start: 57 },
                    value: 'ccc',
                  },
                  type: {
                    kind: Kind.NAMED_TYPE,
                    loc: { end: 65, start: 62 },
                    name: {
                      kind: Kind.NAME,
                      loc: { end: 65, start: 62 },
                      value: 'Int',
                    },
                  },
                },
              ],
              constraints: [
                {
                  kind: Kind.CONSTRAINT_DEFINITION,
                  loc: { end: 99, start: 78 },
                  name: {
                    kind: Kind.NAME,
                    loc: { end: 81, start: 78 },
                    value: 'XOR',
                  },
                  leftSide: {
                    kind: Kind.CONSTRAINT_DEFINITION,
                    loc: { end: 93, start: 82 },
                    name: {
                      kind: Kind.NAME,
                      loc: { end: 85, start: 82 },
                      value: 'XOR',
                    },
                    leftSide: {
                      kind: Kind.NAME,
                      loc: { end: 88, start: 86 },
                      value: 'aa',
                    },
                    rightSide: {
                      kind: Kind.NAME,
                      loc: { end: 92, start: 90 },
                      value: 'bb',
                    },
                  },
                  rightSide: {
                    kind: Kind.NAME,
                    loc: { end: 98, start: 95 },
                    value: 'ccc',
                  },
                },
              ],
              description: undefined,
              directives: [],
              kind: Kind.FIELD_DEFINITION,
              loc: { end: 115, start: 28 },
              name: {
                kind: Kind.NAME,
                loc: { end: 32, start: 28 },
                value: 'user',
              },
              type: {
                kind: Kind.NAMED_TYPE,
                loc: { end: 115, start: 111 },
                name: {
                  kind: Kind.NAME,
                  loc: { end: 115, start: 111 },
                  value: 'User',
                },
              },
            },
          ],
          interfaces: [],
          kind: Kind.OBJECT_TYPE_DEFINITION,
          loc: { end: 123, start: 7 },
          name: {
            kind: Kind.NAME,
            loc: { end: 17, start: 12 },
            value: 'Query',
          },
        },
      ],
    });
  });

  it('Correctly parses a schema with a nested right-side interparameter constraint', async () => {
    const schema = `
      type Query {
        user(aa: String, bb: String, ccc: Int){
          XOR(aa, XOR(bb, ccc))
        }: User
      }
    `;

    const result = parse(schema);

    expect(toJSONDeep(result)).to.deep.equal({
      kind: Kind.DOCUMENT,
      loc: { start: 0, end: 128 },
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
                    value: 'aa',
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
                  loc: { end: 55, start: 45 },
                  name: {
                    kind: Kind.NAME,
                    loc: { end: 47, start: 45 },
                    value: 'bb',
                  },
                  type: {
                    kind: Kind.NAMED_TYPE,
                    loc: { end: 55, start: 49 },
                    name: {
                      kind: Kind.NAME,
                      loc: { end: 55, start: 49 },
                      value: 'String',
                    },
                  },
                },
                {
                  defaultValue: undefined,
                  description: undefined,
                  directives: [],
                  kind: Kind.INPUT_VALUE_DEFINITION,
                  loc: { end: 65, start: 57 },
                  name: {
                    kind: Kind.NAME,
                    loc: { end: 60, start: 57 },
                    value: 'ccc',
                  },
                  type: {
                    kind: Kind.NAMED_TYPE,
                    loc: { end: 65, start: 62 },
                    name: {
                      kind: Kind.NAME,
                      loc: { end: 65, start: 62 },
                      value: 'Int',
                    },
                  },
                },
              ],
              constraints: [
                {
                  kind: Kind.CONSTRAINT_DEFINITION,
                  loc: { end: 99, start: 78 },
                  name: {
                    kind: Kind.NAME,
                    loc: { end: 81, start: 78 },
                    value: 'XOR',
                  },
                  leftSide: {
                    kind: Kind.NAME,
                    loc: { end: 84, start: 82 },
                    value: 'aa',
                  },
                  rightSide: {
                    kind: Kind.CONSTRAINT_DEFINITION,
                    loc: { end: 98, start: 86 },
                    name: {
                      kind: Kind.NAME,
                      loc: { end: 89, start: 86 },
                      value: 'XOR',
                    },
                    leftSide: {
                      kind: Kind.NAME,
                      loc: { end: 92, start: 90 },
                      value: 'bb',
                    },
                    rightSide: {
                      kind: Kind.NAME,
                      loc: { end: 97, start: 94 },
                      value: 'ccc',
                    },
                  },
                },
              ],
              description: undefined,
              directives: [],
              kind: Kind.FIELD_DEFINITION,
              loc: { end: 115, start: 28 },
              name: {
                kind: Kind.NAME,
                loc: { end: 32, start: 28 },
                value: 'user',
              },
              type: {
                kind: Kind.NAMED_TYPE,
                loc: { end: 115, start: 111 },
                name: {
                  kind: Kind.NAME,
                  loc: { end: 115, start: 111 },
                  value: 'User',
                },
              },
            },
          ],
          interfaces: [],
          kind: Kind.OBJECT_TYPE_DEFINITION,
          loc: { end: 123, start: 7 },
          name: {
            kind: Kind.NAME,
            loc: { end: 17, start: 12 },
            value: 'Query',
          },
        },
      ],
    });
  });

  it('Correctly parses a schema with a nested interparameter constraints on both sides', async () => {
    const schema = `
      type Query {
        user(aa: String, bb: String, ccc: Int, ddd: Int){
          THEN(XOR(aa, bb), XOR(ccc, ddd))
        }: User
      }
    `;

    const result = parse(schema);

    expect(toJSONDeep(result)).to.deep.equal({
      kind: Kind.DOCUMENT,
      loc: { start: 0, end: 149 },
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
                    value: 'aa',
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
                  loc: { end: 55, start: 45 },
                  name: {
                    kind: Kind.NAME,
                    loc: { end: 47, start: 45 },
                    value: 'bb',
                  },
                  type: {
                    kind: Kind.NAMED_TYPE,
                    loc: { end: 55, start: 49 },
                    name: {
                      kind: Kind.NAME,
                      loc: { end: 55, start: 49 },
                      value: 'String',
                    },
                  },
                },
                {
                  defaultValue: undefined,
                  description: undefined,
                  directives: [],
                  kind: Kind.INPUT_VALUE_DEFINITION,
                  loc: { end: 65, start: 57 },
                  name: {
                    kind: Kind.NAME,
                    loc: { end: 60, start: 57 },
                    value: 'ccc',
                  },
                  type: {
                    kind: Kind.NAMED_TYPE,
                    loc: { end: 65, start: 62 },
                    name: {
                      kind: Kind.NAME,
                      loc: { end: 65, start: 62 },
                      value: 'Int',
                    },
                  },
                },
                {
                  defaultValue: undefined,
                  description: undefined,
                  directives: [],
                  kind: Kind.INPUT_VALUE_DEFINITION,
                  loc: { end: 75, start: 67 },
                  name: {
                    kind: Kind.NAME,
                    loc: { end: 70, start: 67 },
                    value: 'ddd',
                  },
                  type: {
                    kind: Kind.NAMED_TYPE,
                    loc: { end: 75, start: 72 },
                    name: {
                      kind: Kind.NAME,
                      loc: { end: 75, start: 72 },
                      value: 'Int',
                    },
                  },
                },
              ],
              constraints: [
                {
                  kind: Kind.CONSTRAINT_DEFINITION,
                  loc: { end: 120, start: 88 },
                  name: {
                    kind: Kind.NAME,
                    loc: { end: 92, start: 88 },
                    value: 'THEN',
                  },
                  leftSide: {
                    kind: Kind.CONSTRAINT_DEFINITION,
                    loc: { end: 104, start: 93 },
                    name: {
                      kind: Kind.NAME,
                      loc: { end: 96, start: 93 },
                      value: 'XOR',
                    },
                    leftSide: {
                      kind: Kind.NAME,
                      loc: { end: 99, start: 97 },
                      value: 'aa',
                    },
                    rightSide: {
                      kind: Kind.NAME,
                      loc: { end: 103, start: 101 },
                      value: 'bb',
                    },
                  },
                  rightSide: {
                    kind: Kind.CONSTRAINT_DEFINITION,
                    loc: { end: 119, start: 106 },
                    name: {
                      kind: Kind.NAME,
                      loc: { end: 109, start: 106 },
                      value: 'XOR',
                    },
                    leftSide: {
                      kind: Kind.NAME,
                      loc: { end: 113, start: 110 },
                      value: 'ccc',
                    },
                    rightSide: {
                      kind: Kind.NAME,
                      loc: { end: 118, start: 115 },
                      value: 'ddd',
                    },
                  },
                },
              ],
              description: undefined,
              directives: [],
              kind: Kind.FIELD_DEFINITION,
              loc: { end: 136, start: 28 },
              name: {
                kind: Kind.NAME,
                loc: { end: 32, start: 28 },
                value: 'user',
              },
              type: {
                kind: Kind.NAMED_TYPE,
                loc: { end: 136, start: 132 },
                name: {
                  kind: Kind.NAME,
                  loc: { end: 136, start: 132 },
                  value: 'User',
                },
              },
            },
          ],
          interfaces: [],
          kind: Kind.OBJECT_TYPE_DEFINITION,
          loc: { end: 144, start: 7 },
          name: {
            kind: Kind.NAME,
            loc: { end: 17, start: 12 },
            value: 'Query',
          },
        },
      ],
    });
  });

  it('Correctly parses a schema with a NOT-constraint', async () => {
    const schema = `
      type Query {
        user(id: String, name: String){
          NOT(id)
        }: User
      }
    `;

    const result = parse(schema);

    expect(toJSONDeep(result)).to.deep.equal({
      kind: Kind.DOCUMENT,
      loc: { start: 0, end: 106 },
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
                  loc: { end: 77, start: 70 },
                  name: {
                    kind: Kind.NAME,
                    loc: { end: 73, start: 70 },
                    value: 'NOT',
                  },
                  leftSide: {
                    kind: Kind.NAME,
                    loc: { end: 76, start: 74 },
                    value: 'id',
                  },
                  rightSide: undefined,
                },
              ],
              description: undefined,
              directives: [],
              kind: Kind.FIELD_DEFINITION,
              loc: { end: 93, start: 28 },
              name: {
                kind: Kind.NAME,
                loc: { end: 32, start: 28 },
                value: 'user',
              },
              type: {
                kind: Kind.NAMED_TYPE,
                loc: { end: 93, start: 89 },
                name: {
                  kind: Kind.NAME,
                  loc: { end: 93, start: 89 },
                  value: 'User',
                },
              },
            },
          ],
          interfaces: [],
          kind: Kind.OBJECT_TYPE_DEFINITION,
          loc: { end: 101, start: 7 },
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
