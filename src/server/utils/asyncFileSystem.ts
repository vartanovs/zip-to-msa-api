/**
 * @module asyncFileSystem.ts
 * @description Asynchronous File System Commands (return promises)
 */

// Import Node.js File System Module
import * as fs from 'fs';

/**
 * Check if a file exists
 * @param path A path to a file
 * @returns Promise which resolves to file contents
 */
const exists = (path: string): Promise<boolean> => {
  return new Promise((resolve) => {
    fs.exists(path, (exists) => {
      resolve(exists);
    });
  });
};

const fsAsync = {
  exists,
}

export default fsAsync;