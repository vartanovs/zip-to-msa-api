/**
 * @module inputController.test.ts
 * @description Testing for Trie Data Model
 */

import Trie from "../models/trie";

describe('Data Model - Trie', () => {
  it('Stores a word based on each letter', () => {
    const testTrie = new Trie();
    testTrie.add('shh', 'secret');
    expect(testTrie.children).toHaveProperty('s');
    expect(testTrie.children.s.children).toHaveProperty('h');
    expect(testTrie.children.s.children.h.children).toHaveProperty('h');
  });
  
  it('AND stores data at the node corresponding with the last letter', () => {
    const testTrie = new Trie();
    testTrie.add('shh', 'secret');
    expect(testTrie.children.s.children.h.children.h).toHaveProperty('data');
    expect(testTrie.children.s.children.h.children.h.data).toEqual('secret');
  });

  it('AND allows retrieval of the data using the get method', () => {
    const testTrie = new Trie();
    testTrie.add('shh', 'secret');
    expect(testTrie.get('shh')).toEqual('secret');
  });

  it('AND returns null if a new word is passed in', () => {
    const testTrie = new Trie();
    testTrie.add('shh', 'secret');
    expect(testTrie.get('oops')).toBeNull();
  });
});