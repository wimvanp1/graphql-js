/**
 * @flow strict
 */

import { describe, it } from 'mocha';
import { parse } from '../parser';

describe('Interparameter Constraints Parser Tests', () => {
  it('Correctly parses a schema without interparameter constraints', async () => {
    const schema = `
      type User{
        id: String!,
        name: String!
      }
    
      type Query {
        user(id: String, name: String): User
      }
    `;

    parse(schema);
  });

  it('Correctly parses a query with an empty set of interparameter constraints', async () => {
    const schema = `
      type User{
        id: String!,
        name: String!
      }
    
      type Query {
        user(id: String, name: String){}: User
      }
    `;

    parse(schema);
  });
});
