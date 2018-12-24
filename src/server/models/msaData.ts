/**
 * @module msaData.ts
 * @description US Government Data (CBSA > MSA & Population) Model
 */

// import * as fs from 'fs';
import * as path from 'path';
// import * as csvParse from 'csv-parse';
// import * as csvStringify from 'csv-stringify';

import fetchCsvData from '../utils/fetchCsvData';
import fsAsync from '../utils/asyncFileSystem';
// import Trie from './trie';

/**
 * Generate Parsed CBSA Code > MSA Mapping Data with only ZIP and CBSA parameters
 * @param refreshData Force a fresh fetch of Raw CBSA Code > MSA Mapping Data
 */
const generateParsedData = async (refreshData: boolean) => {
  // Check if raw ZIP>CBSA mapping files are already cached
  const rawCbsaToMsaExists = await fsAsync.exists(path.resolve(__dirname, '../cache/cbsa_to_msa.csv'));
  // If raw mapping is not cached, fetch and save locally in server/cache
  if (!rawCbsaToMsaExists || refreshData) await fetchCsvData('cbsa_to_msa.csv');
  // Parse raw data for nexted array of zip and cbsa only
  // const parsedDataArray = await parseRawData();
  // Write parsed data into new .csv file
  // await writeParsedData(parsedDataArray);
};

/**
 * Return MSA Data associated with a CBSA
 */
const getData = async (cbsa: string, refreshData: boolean = false) => {
  // Check if parsed CBSA>MSA mapping files are already cached
  const parsedCbsaToMsaExists = await fsAsync.exists(path.resolve(__dirname, '../cache/cbsa_to_msa_parsed.csv'));

  // If files are not cached, parse and save locally in server/cache
  if (!parsedCbsaToMsaExists || refreshData) await generateParsedData(refreshData);

  console.log(cbsa);

  // Read parsed csv to generate Trie data structure
  // const cbsaTrie = await generateTrie();

  // Retrieve cbsa from Trie
  // return cbsaTrie.get(cbsa);
};

// Generate module export object and export
const msaData = {
  getData,
}

export default msaData;