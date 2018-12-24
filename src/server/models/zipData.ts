/**
 * @module zipData.ts
 * @description US Government Data (Zip > CBSA Map) Model
 */

import * as fs from 'fs';
import * as path from 'path';
import * as csvParse from 'csv-parse';
import * as csvStringify from 'csv-stringify';

import fsAsync from '../utils/asyncFileSystem';
import fetchCsvData from '../utils/fetchCsvData';
import Trie from './trie';

/**
 * Generate Parsed Zip Code > CBSA Mapping Data with only ZIP and CBSA parameters
 * @param refreshData Force a fresh fetch of Raw Zip Code > CBSA Mapping Data
 */
const generateParsedData = async (refreshData: boolean) => {
  // Check if raw ZIP>CBSA mapping files are already cached
  const rawZipToCbsaExists = await fsAsync.exists(path.resolve(__dirname, '../cache/zip_to_cbsa.csv'));
  // If raw mapping is not cached, fetch and save locally in server/cache
  if (!rawZipToCbsaExists || refreshData) await fetchCsvData('zip_to_cbsa.csv');
  // Parse raw data for nexted array of zip and cbsa only
  const parsedDataArray = await parseRawData();
  // Write parsed data into new .csv file
  await writeParsedData(parsedDataArray);
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
 * Write ZIP:CBSA Mapped pairs into parsed .csv file
 * @param parsedDataArray Nested array of ZIP:CBSA Mapped Pairs
 */
const writeParsedData = (parsedDataArray: string[][]) => {
  // Wrap CSV Stringification Stream and Writefile into Promise
  const writeComplete = new Promise<void>((resolve, reject) => {
    csvStringify(parsedDataArray, { header: false }, (err, output) => {
      if (err) reject(err);
      else fs.writeFile(path.resolve(__dirname, '../cache/zip_to_cbsa_parsed.csv'), output, (err) => {
        if (err) reject(err)
        else resolve();
      });
    });
  });
  return writeComplete;
};

/**
 * Generate Trie with O(1) Lookup to lookup CBSA from ZIP
 */
const generateTrie = (): Promise<Trie> => {
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
 
  fs.createReadStream(path.resolve(__dirname, '../cache/zip_to_cbsa_parsed.csv')).pipe(csvParser);

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
  const zipTrie = await generateTrie();

  // Retrieve cbsa from Trie
  return zipTrie.get(zip);
};

// Generate module export object and export
const zipData = {
  getCBSA,
}

export default zipData;
