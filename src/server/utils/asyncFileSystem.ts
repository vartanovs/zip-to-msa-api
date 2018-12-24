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

/**
 * Read the contents of an entire file
 * @param path A path to a file
 * @returns Promise which resolves to file contents
 */
const readFile = (path: string): Promise<{}> => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

/**
 * Write data to a file, replacing the file if it exists
 * @param path A path to a file
 * @param data Data to be written
 * @returns Promise which resolves to null
 */
const writeFile = (path: string, data: string): Promise<null> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err) => {
      if (err) reject(err);
      else resolve(null);
    });
  });
};

const fsAsync = {
  exists,
  readFile,
  writeFile,
}

export default fsAsync;