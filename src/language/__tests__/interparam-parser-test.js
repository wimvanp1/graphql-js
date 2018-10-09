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

  it('Correctly parses a query with one interparameter constraint', async () => {
    const schema = `
      type User{
        id: String!,
        name: String!
      }
    
      type Query {
        user(id: String, name: String){
          id XOR name
        }: User
      }
    `;

    parse(schema);
  });

  it('Correctly parses a query with multiple interparameter constraints', async () => {
    const schema = `
      type User{
        id: String!,
        name: String!
      }
    
      type Query {
        user(id: String, name: String){
          id XOR name
          id AND name
          id OR name
        }: User
      }
    `;

    parse(schema);
  });
});
