/**
 * @module fetchData.ts
 * @description CSV Fetching Utility
 */

import * as fs from 'fs';
import * as path from 'path';

import fetch from 'node-fetch';

/**
 * Fetch Raw CSV Data
 * @param fileName The name of the file to be fetched and stored
 */
const fetchCSV = (fileName: string): Promise<void> => {
  // Wrap fetch in promise, resolve upon completion of writeFile stream
  return new Promise((resolve, reject) => {
    fetch(`https://s3.amazonaws.com/peerstreet-static/engineering/zip_to_msa/${fileName}`)
      .then(response => {
        const dest = fs.createWriteStream(path.resolve(__dirname, `../cache/${fileName}`));
        response.body.pipe(dest);
        dest.on('close', resolve);
      })
      .catch(err => reject(err));
  });
};

export default fetchCSV;
