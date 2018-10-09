/**
 * @flow strict
 */

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Source } from '../source';
import { createLexer, TokenKind } from '../lexer';

describe('Interparameter Constraints Parser Tests', () => {
  it('Correctly creates a lexicon from a schema without interparameter constraints', async () => {
    const schema = `
      type Query {
        user(id: String, name: String): User
      }
    `;

    const source = new Source(schema);
    const lexer = createLexer(source, {});

    // Check manually if the lexer does it jobs
    let i = 0; // Position in the array of type values to be checked
    const lexerValues = [
      // type Query {
      TokenKind.NAME,
      TokenKind.NAME,
      TokenKind.BRACE_L,

      // user(id: String, name: String): User
      TokenKind.NAME,
      TokenKind.PAREN_L,
      TokenKind.NAME,
      TokenKind.COLON,
      TokenKind.NAME,
      TokenKind.NAME,
      TokenKind.COLON,
      TokenKind.NAME,
      TokenKind.PAREN_R,
      TokenKind.COLON,
      TokenKind.NAME,

      // }
      TokenKind.BRACE_R,
    ];

    while (lexer.lookahead().kind !== TokenKind.EOF) {
      expect(lexer.advance().kind).to.equal(lexerValues[i]);
      i++;
    }
  });

  it('Correctly creates a lexicon from a query with an empty set of interparameter constraints', async () => {
    const schema = `
      type Query {
        user(id: String, name: String){}: User
      }
    `;

    const source = new Source(schema);
    const lexer = createLexer(source, {});

    // Check manually if the lexer does it jobs
    let i = 0; // Position in the array of type values to be checked
    const lexerValues = [
      // type Query {
      TokenKind.NAME,
      TokenKind.NAME,
      TokenKind.BRACE_L,

      // user
      TokenKind.NAME,

      // (id: String, name: String)
      TokenKind.PAREN_L,
      TokenKind.NAME,
      TokenKind.COLON,
      TokenKind.NAME,
      TokenKind.NAME,
      TokenKind.COLON,
      TokenKind.NAME,
      TokenKind.PAREN_R,

      // {}: User
      TokenKind.BRACE_L,
      TokenKind.BRACE_R,
      TokenKind.COLON,
      TokenKind.NAME,

      // }
      TokenKind.BRACE_R,
    ];

    while (lexer.lookahead().kind !== TokenKind.EOF) {
      expect(lexer.advance().kind).to.equal(lexerValues[i]);
      i++;
    }
  });

  it('Correctly creates a lexicon from a query with a sample set of interparameter constraints', async () => {
    const schema = `
      type Query {
        user(id: String, name: String){
          id XOR name
        }: User
      }
    `;

    const source = new Source(schema);
    const lexer = createLexer(source, {});

    // Check manually if the lexer does it jobs
    let i = 0; // Position in the array of type values to be checked
    const lexerValues = [
      // type Query {
      TokenKind.NAME,
      TokenKind.NAME,
      TokenKind.BRACE_L,

      // user
      TokenKind.NAME,

      // (id: String, name: String)
      TokenKind.PAREN_L,
      TokenKind.NAME,
      TokenKind.COLON,
      TokenKind.NAME,
      TokenKind.NAME,
      TokenKind.COLON,
      TokenKind.NAME,
      TokenKind.PAREN_R,

      // { id XOR name }
      TokenKind.BRACE_L,
      TokenKind.NAME,
      TokenKind.NAME,
      TokenKind.NAME,
      TokenKind.BRACE_R,

      // : User
      TokenKind.COLON,
      TokenKind.NAME,

      // }
      TokenKind.BRACE_R,
    ];

    while (lexer.lookahead().kind !== TokenKind.EOF) {
      expect(lexer.advance().kind).to.equal(lexerValues[i]);
      i++;
    }
  });
});
