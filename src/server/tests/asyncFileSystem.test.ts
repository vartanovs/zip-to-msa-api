/**
 * @module arrayToStream.test.ts
 * @description Testing for Promise Based File System Utility
 */

// Import Module To Be Tested
import fsAsync from "../utils/asyncFileSystem";

// Import and Mock Dependencies
import * as fs from 'fs';
import * as path from 'path';
const mockExists = jest.spyOn(fs, 'exists');

// Prepare Stubs
const stubValidPath = path.resolve(__dirname, '../cache/.gitkeep')
const stubInvalidPath = path.resolve(__dirname, '../cache/invalid.csv')

describe('Fetch CSV Utility', () => {
  afterAll(() => {
    mockExists.mockRestore();
  })

  beforeEach(() => {
    mockExists.mockClear();
  })

  it('fsAsync.exists calles fs.exists, passing in the filePath', () => {
    fsAsync.exists(stubValidPath)
      expect(mockExists).toBeCalledTimes(1);
      expect(mockExists.mock.calls[0][0]).toEqual(stubValidPath);
  });

  it('AND resolves to true if a valid path is passed in', async () => {
    let existBool = await fsAsync.exists(stubValidPath);
    expect(existBool).toEqual(true);
  });

  it('AND resolves to false if an invalid path is passed in', async () => {
    let existBool = await fsAsync.exists(stubInvalidPath);
    expect(existBool).toEqual(false);
  });
});