/**
 * @module writeCSV.ts
 * @description CSV Writing Utility
 */

import * as fs from 'fs';
import * as path from 'path';
import * as csvStringify from 'csv-stringify';

/**
 * Write parsed mappings into new .csv files
 * @param parsedDataObject Object with nested array mapping objects
 * @param fileName The name of the new file to be written
 */
const writeCSV = (parsedDataArray: string[][], fileName: string) => {
  // Wrap CSV Stringification Stream and Writefile into Promise
  const writeComplete = new Promise<void>((resolve, reject) => {
    csvStringify(parsedDataArray, { header: false }, (err, output) => {
      if (err) reject(err);
      else fs.writeFile(path.resolve(__dirname, `../cache/${fileName}`), output, (err) => {
        if (err) reject(err)
        else resolve();
      });
    });
  });
  return writeComplete;
};

export default writeCSV;
