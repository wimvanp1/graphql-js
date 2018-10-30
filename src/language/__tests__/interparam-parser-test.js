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
                  leftSide: {
                    kind: Kind.NAME,
                    loc: { end: 72, start: 70 },
                    value: 'id',
                  },
                  rightSide: {
                    kind: Kind.NAME,
                    loc: { end: 81, start: 77 },
                    value: 'name',
                  },
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

  it('Correctly parses a schema with multiple interparameter constraints', async () => {
    const schema = `
      type Query {
        user(id: String, name: String){
          id XOR name
          id THEN name
          id XOR name
        }: User
      }
    `;

    const result = parse(schema);

    expect(toJSONDeep(result)).to.deep.equal({
      kind: Kind.DOCUMENT,
      loc: { start: 0, end: 155 },
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
                  leftSide: {
                    kind: Kind.NAME,
                    loc: { end: 72, start: 70 },
                    value: 'id',
                  },
                  rightSide: {
                    kind: Kind.NAME,
                    loc: { end: 81, start: 77 },
                    value: 'name',
                  },
                },
                {
                  kind: Kind.CONSTRAINT_DEFINITION,
                  loc: { end: 104, start: 92 },
                  name: {
                    kind: Kind.NAME,
                    loc: { end: 99, start: 95 },
                    value: 'THEN',
                  },
                  leftSide: {
                    kind: Kind.NAME,
                    loc: { end: 94, start: 92 },
                    value: 'id',
                  },
                  rightSide: {
                    kind: Kind.NAME,
                    loc: { end: 104, start: 100 },
                    value: 'name',
                  },
                },
                {
                  kind: Kind.CONSTRAINT_DEFINITION,
                  loc: { end: 126, start: 115 },
                  name: {
                    kind: Kind.NAME,
                    loc: { end: 121, start: 118 },
                    value: 'XOR',
                  },
                  leftSide: {
                    kind: Kind.NAME,
                    loc: { end: 117, start: 115 },
                    value: 'id',
                  },
                  rightSide: {
                    kind: Kind.NAME,
                    loc: { end: 126, start: 122 },
                    value: 'name',
                  },
                },
              ],
              description: undefined,
              directives: [],
              kind: Kind.FIELD_DEFINITION,
              loc: { end: 142, start: 28 },
              name: {
                kind: Kind.NAME,
                loc: { end: 32, start: 28 },
                value: 'user',
              },
              type: {
                kind: Kind.NAMED_TYPE,
                loc: { end: 142, start: 138 },
                name: {
                  kind: Kind.NAME,
                  loc: { end: 142, start: 138 },
                  value: 'User',
                },
              },
            },
          ],
          interfaces: [],
          kind: Kind.OBJECT_TYPE_DEFINITION,
          loc: { end: 150, start: 7 },
          name: {
            kind: Kind.NAME,
            loc: { end: 17, start: 12 },
            value: 'Query',
          },
        },
      ],
    });
  });

  it('Correctly parses a schema with one interparameter constraint in parenthesis', async () => {
    const schema = `
      type Query {
        user(id: String, name: String){
          (id XOR name)
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
                  loc: { end: 82, start: 71 },
                  name: {
                    kind: Kind.NAME,
                    loc: { end: 77, start: 74 },
                    value: 'XOR',
                  },
                  leftSide: {
                    kind: Kind.NAME,
                    loc: { end: 73, start: 71 },
                    value: 'id',
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

  it('Correctly parses a schema with a nest leftside interparameter constraint', async () => {
    const schema = `
      type Query {
        user(aa: String, bb: String, ccc: Int){
          ((aa XOR bb) XOR ccc)
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
                  loc: { end: 98, start: 80 },
                  name: {
                    kind: Kind.NAME,
                    loc: { end: 94, start: 91 },
                    value: 'XOR',
                  },
                  leftSide: {
                    kind: Kind.CONSTRAINT_DEFINITION,
                    loc: { end: 89, start: 80 },
                    name: {
                      kind: Kind.NAME,
                      loc: { end: 86, start: 83 },
                      value: 'XOR',
                    },
                    leftSide: {
                      kind: Kind.NAME,
                      loc: { end: 82, start: 80 },
                      value: 'aa',
                    },
                    rightSide: {
                      kind: Kind.NAME,
                      loc: { end: 89, start: 87 },
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

  it('Correctly parses a schema with a nested rightside interparameter constraint', async () => {
    const schema = `
      type Query {
        user(aa: String, bb: String, ccc: Int){
          (aa XOR (bb XOR ccc))
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
                  loc: { end: 98, start: 79 },
                  name: {
                    kind: Kind.NAME,
                    loc: { end: 85, start: 82 },
                    value: 'XOR',
                  },
                  leftSide: {
                    kind: Kind.NAME,
                    loc: { end: 81, start: 79 },
                    value: 'aa',
                  },
                  rightSide: {
                    kind: Kind.CONSTRAINT_DEFINITION,
                    loc: { end: 97, start: 87 },
                    name: {
                      kind: Kind.NAME,
                      loc: { end: 93, start: 90 },
                      value: 'XOR',
                    },
                    leftSide: {
                      kind: Kind.NAME,
                      loc: { end: 89, start: 87 },
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
          ((aa XOR bb) THEN (ccc XOR ddd))
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
                  loc: { end: 119, start: 90 },
                  name: {
                    kind: Kind.NAME,
                    loc: { end: 105, start: 101 },
                    value: 'THEN',
                  },
                  leftSide: {
                    kind: Kind.CONSTRAINT_DEFINITION,
                    loc: { end: 99, start: 90 },
                    name: {
                      kind: Kind.NAME,
                      loc: { end: 96, start: 93 },
                      value: 'XOR',
                    },
                    leftSide: {
                      kind: Kind.NAME,
                      loc: { end: 92, start: 90 },
                      value: 'aa',
                    },
                    rightSide: {
                      kind: Kind.NAME,
                      loc: { end: 99, start: 97 },
                      value: 'bb',
                    },
                  },
                  rightSide: {
                    kind: Kind.CONSTRAINT_DEFINITION,
                    loc: { end: 118, start: 107 },
                    name: {
                      kind: Kind.NAME,
                      loc: { end: 114, start: 111 },
                      value: 'XOR',
                    },
                    leftSide: {
                      kind: Kind.NAME,
                      loc: { end: 110, start: 107 },
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
});
