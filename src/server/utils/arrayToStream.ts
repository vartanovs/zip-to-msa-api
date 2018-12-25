/**
 * @module arraytoStream.ts
 * @description Data Streaming Utility
 */

import * as stringify from 'csv-stringify';

/**
 * Convert a nested array into a csv-stringify stream
 * @param dataArray Nested array containing data to be turned to .csv
 */
const arrayToStream = <T>(dataArray: T[][]) => {
  // Set delimieter to separate values
  const stringifier = stringify({ delimiter: ',' });
  // Pass each row of data into csv-stringify and call end() upon completion
  dataArray.forEach(row => stringifier.write(row));
  stringifier.end();
  return stringifier;  
}

export default arrayToStream;
