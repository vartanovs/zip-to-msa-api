/**
 * @module writeCSV.ts
 * @description CSV Writing Utility
 */

import * as fs from 'fs';
import * as path from 'path';
import { Stringifier } from 'csv-stringify';

/**
 * Asynchronously write readable stream into new .csv file
 * @param dataStream Data stream to be written into .csv file
 * @param fileName The name of the new file to be written
 */
export const writeCSV = (dataStream: NodeJS.ReadableStream | Stringifier, fileName: string) => new Promise((resolve, reject) => {
  const destination = fs.createWriteStream(path.resolve(__dirname, `../cache/${fileName}`));
  // Pipe data stream to desination file, resolve promise upon completion
  dataStream.pipe(destination);
  destination.on('close', resolve);
  destination.on('error', reject);
});

