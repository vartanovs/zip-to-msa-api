/**
 * @module zipData.ts
 * @description US Government Data (Zip > CBSA Map) Model
 */

import * as fs from 'fs';
import * as path from 'path';
import * as csvParse from 'csv-parse';

import fetchCSV from '../utils/fetchCSV';
import fsAsync from '../utils/asyncFileSystem';
import Trie from './trie';
// import writeCSV from '../utils/writeCSV';
import { writeCSV } from '../utils/writeCSV';
import arrayToStream from '../utils/arrayToStream';

/**
 * Generate Parsed Zip Code > CBSA Mapping Data with only ZIP and CBSA parameters
 * @param refreshData Force a fresh fetch of Raw Zip Code > CBSA Mapping Data
 */
const generateParsedData = async (refreshData: boolean) => {
  // Check if raw ZIP>CBSA mapping files are already cached
  const rawZipToCbsaExists = await fsAsync.exists(path.resolve(__dirname, '../cache/zip_to_cbsa.csv'));
  // If raw mapping is not cached, fetch and save locally in server/cache
  if (!rawZipToCbsaExists || refreshData) await fetchCSV('zip_to_cbsa.csv');
  // Parse raw data for nexted array of zip and cbsa only
  const parsedDataArray = await parseRawData();
  const parsedDataArrayStream = arrayToStream(parsedDataArray);
  // Write parsed data into new .csv file
  await writeCSV(parsedDataArrayStream, 'zip_to_cbsa_parsed.csv');
};

/**
 * Parse raw Zip > CBSA Mapping Data, generating nested arrays of zip:cbsa pairs
 */
const parseRawData = () => {
  // Configure CSV Parser
  const csvParser = csvParse({ delimiter: ',' });

  // Write first two columns of CSV data to a nested Array
  const parsedData: string[][] = [];
  let record;
  csvParser.on('readable', () => {
    while (record = csvParser.read()) {
      parsedData.push(record.slice(0, 2));
    }
  });

  // Wrap stream completion in Promise to resolve after stream ends
  const parseComplete = new Promise<string[][]>((resolve, reject) => {
    csvParser.on('end', () => resolve(parsedData));
    csvParser.on('error', (err) => reject(err))
  });
 
  fs.createReadStream(path.resolve(__dirname, '../cache/zip_to_cbsa.csv')).pipe(csvParser);

  return parseComplete;
};

/**
 * Generate Trie with O(1) Lookup to lookup CBSA from ZIP
 */
const generateTrie = (fileName: string): Promise<Trie> => {
  // Configure CSV Parser
  const csvParser = csvParse({ delimiter: ',' });

  // Read parsed CSV, adding each ZIP/CBSA Map into the Trie
  const zipTrie: Trie = new Trie();
  let record;
  csvParser.on('readable', () => {
    while (record = csvParser.read()) {
      zipTrie.add(record[0], record[1]);
    }
  });

  // Wrap stream completion in Promise to resolve after stream ends
  const parseComplete = new Promise<Trie>((resolve, reject) => {
    csvParser.on('end', () => resolve(zipTrie));
    csvParser.on('error', (err) => reject(err))
  });
 
  fs.createReadStream(path.resolve(__dirname, `../cache/${fileName}`)).pipe(csvParser);

  return parseComplete;
}

/**
 * Return the CBSA associated with a ZIP Code
 */
const getCBSA = async (zip: string, refreshData: boolean = false) => {
  // Check if parsed ZIP>CBSA mapping files are already cached
  const parsedZipToCbsaExists = await fsAsync.exists(path.resolve(__dirname, '../cache/zip_to_cbsa_parsed.csv'));

  // If files are not cached, parse and save locally in server/cache
  if (!parsedZipToCbsaExists || refreshData) await generateParsedData(refreshData);

  // Read parsed csv to generate Trie data structure
  const zipTrie = await generateTrie('zip_to_cbsa_parsed.csv');

  // Retrieve cbsa from Trie
  return zipTrie.get(zip);
};

// Generate module export object and export
const zipData = {
  getCBSA,
}

export default zipData;
