/**
 * @module arrayToStream.test.ts
 * @description Testing for Data Array to CSV Stream Utility
 */

 // Import Module To Be Tested
import arrayToStream from "../utils/arrayToStream";

// Import and Mock Stringify Dependencies
import * as stringify from 'csv-stringify';
jest.mock('csv-stringify', () => {
  return jest.fn(() => {
    return {
      write: () => {},
      end: () => {},
    };
  });
});

// Prepare Stubs
const stubData = [['a', 'b'], ['c', 'd']];

describe('Array To Stream Utility', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });
  
  it('arrayToStream calls stringify, passing a delimiter', () => {
    arrayToStream(stubData);
    expect(stringify).toBeCalledTimes(1);
    expect(stringify).toBeCalledWith({ delimiter: ',' });
  });
});
