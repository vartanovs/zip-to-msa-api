/**
 * @module msaData.ts
 * @description US Government Data (CBSA > MSA & Population) Model
 */

import * as fs from 'fs';
import * as path from 'path';
import * as csvParse from 'csv-parse';

import fetchCSV from '../utils/fetchCSV';
import fsAsync from '../utils/asyncFileSystem';
import Trie, { IMSAData } from './trie';
import writeCSV from '../utils/writeCsv';

interface IParsedData {
  CBSAToMDIV: string[][],
  CBSAToMSA: string[][],
}

/**
 * Generate Parsed CBSA > MDIV and CBSA > MSA Mapping Data
 * @param refreshData Force a fresh fetch of Raw CBSA > MSA Mapping Data
 */
const generateParsedData = async (refreshData: boolean) => {
  // Check if raw CBSA>MSA mapping files are already cached
  const rawCbsaToMsaExists = await fsAsync.exists(path.resolve(__dirname, '../cache/cbsa_to_msa.csv'));
  // If raw mapping is not cached, fetch and save locally in server/cache
  if (!rawCbsaToMsaExists || refreshData) await fetchCSV('cbsa_to_msa.csv');
  // Parse raw data for nexted array of zip and cbsa only
  const parsedDataObject = await parseRawData();
  // Write parsed data into new .csv files
  ;
  await Promise.all([
    writeCSV(parsedDataObject.CBSAToMDIV, 'cbsa_to_mdiv_parsed.csv'),
    writeCSV(parsedDataObject.CBSAToMSA, 'cbsa_to_msa_parsed.csv')
  ]);
};

/**
 * Parse raw CBSA > MSA Mapping Data, generating nested arrays
 * The first set of arrays indicate MDIV:CBSA pairings
 * The second set of arrays indicates CBSA:MSA:POP2014:POP2015 pairings for MSAs only
 */
const parseRawData = () => {
  // Configure CSV Parser
  const csvParser = csvParse({ delimiter: ',' });

  // Write CBSA:MDIV mapping and CBSA:MSA mappings into arrays
  const parsedData: IParsedData = {
    CBSAToMDIV: [],
    CBSAToMSA: [],
  }
  let record;
  csvParser.on('readable', () => {
    while (record = csvParser.read()) {
      if (record[0].length) {
        if (record[1].length) {
          parsedData.CBSAToMDIV.push(record.slice(0, 2));
        }
        if (record[4] === 'Metropolitan Statistical Area' || record[4] === 'LSAD') {
          parsedData.CBSAToMSA.push(record.slice(0, 1).concat(record.slice(3, 4)).concat(record.slice(11, 13)));
        }
      }
    }
  });

  // Wrap stream completion in Promise to resolve after stream ends
  const parseComplete = new Promise<IParsedData>((resolve, reject) => {
    csvParser.on('end', () => resolve(parsedData));
    csvParser.on('error', (err) => reject(err))
  });
  
  fs.createReadStream(path.resolve(__dirname, '../cache/cbsa_to_msa.csv')).pipe(csvParser);

  return parseComplete;
};

/**
 * Generate Trie with O(1) Lookup to lookup data from CBSA
 */
const generateTrie = (fileName: string): Promise<Trie> => {
  // Configure CSV Parser
  const csvParser = csvParse({ delimiter: ',' });

  // Read parsed CSV, adding each ZIP/CBSA Map into the Trie
  const cbsaTrie: Trie = new Trie();
  let record;
  csvParser.on('readable', () => {
    while (record = csvParser.read()) {
      if (record[0] !== 'CBSA') {
        if (record[2] && (record[1] !== 'NAME')) {
          const msaData: IMSAData = {
            msaName: record[1],
            population2014: record[2],
            population2015: record[3],
          }
          cbsaTrie.add(record[0], msaData);
        } else {
          cbsaTrie.add(record[1], record[0]);
        }
      }
    }
  });

  // Wrap stream completion in Promise to resolve after stream ends
  const parseComplete = new Promise<Trie>((resolve, reject) => {
    csvParser.on('end', () => resolve(cbsaTrie));
    csvParser.on('error', (err) => reject(err))
  });
 
  fs.createReadStream(path.resolve(__dirname, `../cache/${fileName}`)).pipe(csvParser);

  return parseComplete;
}

/**
 * Return MSA Data associated with a CBSA
 */
const getData = async (cbsa: string, refreshData: boolean = false) => {
  // Check if parsed CBSA>MSA mapping files are already cached
  const parsedCbsaToMdivExists = await fsAsync.exists(path.resolve(__dirname, '../cache/cbsa_to_mdiv_parsed.csv'));
  const parsedCbsaToMsaExists = await fsAsync.exists(path.resolve(__dirname, '../cache/cbsa_to_msa_parsed.csv'));

  // If files are not cached, parse and save locally in server/cache
  if (!parsedCbsaToMdivExists || !parsedCbsaToMsaExists || refreshData) await generateParsedData(refreshData);
  
  // Short circuit if cbsa is 99999
  const blankMSA: IMSAData = {
    cbsa: cbsa,
    msaName: 'N/A',
    population2014: 'N/A',
    population2015: 'N/A',
  }
  if (cbsa === '99999') return blankMSA;

  // Read parsed csvs to generate Trie data structure
  const mdivToCbsaTrie = await generateTrie('cbsa_to_mdiv_parsed.csv');
  const cbsaToMsaTrie = await generateTrie('cbsa_to_msa_parsed.csv');

  // Retrieve final CBSA from trie - if no MDIV, keep original CBSA
  const finalCBSA = mdivToCbsaTrie.get(cbsa) ? mdivToCbsaTrie.get(cbsa) : cbsa;

  // Retrieve and return MSA data from trie - if no MSA data, use blankMSA
  const msaData: IMSAData= cbsaToMsaTrie.get(finalCBSA as string) ? cbsaToMsaTrie.get(finalCBSA as string) as IMSAData : blankMSA;
  msaData.cbsa = finalCBSA as string;
  return msaData;
};

// Generate module export object and export
const msaData = {
  getData,
}

export default msaData;