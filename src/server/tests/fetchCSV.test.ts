
/**
 * @module fetchCSV.test.ts
 * @description Testing for Fetch CSV Utility
 */

import * as dotenv from 'dotenv';
dotenv.config();

// Import Module To Be Tested
import fetchCSV from "../utils/fetchCSV";

// Import and Mock Dependencies
import * as writeCSV from '../utils/writeCSV';
jest.mock('../utils/writeCSV');
const mockWriteCSV = jest.spyOn(writeCSV, 'writeCSV');
const mockConsoleError = jest.spyOn(global.console, 'error')

// Prepare Stubs
const stubFileName = 'test_to_test.csv';
const stubErrTrigger = 'error.csv';
const stubFetchResponse = { body: 'stream' };

// Prepare Fetch Mock
const fetchMock = require('fetch-mock').sandbox();
const nodeFetch = require('node-fetch');
nodeFetch.default = fetchMock;
fetchMock.get(`${process.env.PS_URI}/${stubFileName}`, stubFetchResponse);
fetchMock.get(`${process.env.PS_URI}/${stubErrTrigger}`, { throws: Error() });

describe('Fetch CSV Utility', () => {
  beforeAll(() => {
    mockConsoleError.mockImplementation(() => {});
  })

  afterAll(() => {
    mockWriteCSV.mockRestore();
    mockConsoleError.mockRestore();
  })

  beforeEach(() => {
    fetchMock.resetHistory();
    mockWriteCSV.mockClear();
    mockConsoleError.mockClear();
  })

  it('FetchCSV calls fetch, passing the fileName argument into the URL', () => {
    fetchCSV(stubFileName)
    expect(fetchMock.called()).toEqual(true);
    expect(fetchMock.calls()[0][0]).toEqual(`${process.env.PS_URI}/${stubFileName}`);
  });

  it('AND upon resolution, it calls writeCSV, passing in the response body and the fileName as arguments', () => {
    fetchCSV(stubFileName)
      .then(() => {
        expect(mockWriteCSV).toBeCalledTimes(1);
        expect(mockWriteCSV).toBeCalledWith(stubFetchResponse.body, stubFileName);
      });
  });

  it('AND upon rejection, it logs an error', () => {
    fetchCSV(stubErrTrigger)
      .then(() => {
        expect(mockConsoleError).toBeCalledTimes(1);
      });
  });
});