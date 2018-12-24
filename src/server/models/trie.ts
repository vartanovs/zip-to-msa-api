/**
 * @module trie.ts
 * @description Trie Data Model
 */

interface IMSAData {
  cbsa: string,
  pop2014: string,
  pop2015: string,
}

class TrieNode {
  children: {
    [letter: string]: TrieNode,
  };
  data: string | IMSAData | null;

  constructor() {
    this.children = {};
    this.data = null;
  }

  // Method to add a word and data to the Trie
  add(word: string, data: string): string | IMSAData {
    // If the word has no length, store the data
    if (!word.length) {
      this.data = data;
      return this.data;
    }

    // Split off the first letter of the word
    const firstLetter = word[0];
    const rest = word.substring(1);

    // If no child node has been assigned to that letter, create one
    if (!this.children[firstLetter]) {
      this.children[firstLetter] = new TrieNode();
    }
  
    // Recursively call add on the child node assigned to the first letter
    return this.children[firstLetter].add(rest, data);
  }

  // Method to retrieve the data stored at a word in the Trie
  get(word: string): string | IMSAData | null {
    // If the word has no length, retrieve the data
    if (!word.length) {
      return this.data as string;
    }

    // Split off the first letter of the word
    const firstLetter = word[0];
    const rest = word.substring(1);

    // If no child node has been assigned to that letter, return null
    if (!this.children[firstLetter]) {
      return null;
    }

    // Recursively call get on the child node assigned to the first letter
    return this.children[firstLetter].get(rest);    
  }
}

export default TrieNode;