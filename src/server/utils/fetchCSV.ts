/**
 * @module fetchData.ts
 * @description CSV Fetching Utility
 */

import * as dotenv from 'dotenv';
dotenv.config();

import fetch from 'node-fetch';
import { writeCSV } from './writeCSV';

/**
 * Fetch Raw CSV Data and send to writeCSV
 * @param fileName The name of the file to be fetched and stored
 */
const fetchCSV = (fileName: string) => {
  return fetch(`${process.env.PS_URI}/${fileName}`)
    .then(response => writeCSV(response.body, fileName))
    .catch(err => console.error(err));
};

export default fetchCSV;
