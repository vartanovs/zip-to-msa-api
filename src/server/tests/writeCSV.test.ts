/**
 * @module writeCSV.test.ts
 * @description Testing for Write CSV Utility
 */

// Import Module To Be Tested
import { writeCSV } from "../utils/writeCSV";

// Import and Mock Dependencies
import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
dotenv.config();
const mockCreateWriteStream = jest.spyOn(fs, 'createWriteStream');

// Prepare Stubs
const stubFileName = 'test_to_test.csv';
let stubReadableStream: any;

describe('Write CSV Utility', () => {
  beforeAll(async () => {
    stubReadableStream = await fetch(`${process.env.PS_URI}/zip_to_cbsa.csv`).then(res => res.body);
  });

  afterAll(() => {
    mockCreateWriteStream.mockRestore()
  });

  it('WriteCSV calls createWriteStream, passing the fileName argument', async () => {
    await writeCSV(stubReadableStream, stubFileName)
    expect(mockCreateWriteStream).toBeCalledTimes(1);
    expect(mockCreateWriteStream).toBeCalledWith(path.resolve(__dirname, `../cache/${stubFileName}`))
  });
});