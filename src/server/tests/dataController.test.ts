/**
 * @module dataController.test.ts
 * @description Testing for Data Controller
 */

import * as httpMocks from 'node-mocks-http';

import { Request, Response } from 'express';

import dataController from '../controllers/dataController';
import zipData from '../models/zipData';
import msaData from '../models/msaData';
import { IMSAData } from '../models/trie';

let request: httpMocks.MockRequest<Request>;;
let response: httpMocks.MockResponse<Response>;
let next: jest.Mock

// Mock module dependencies
const mockGetCBSA = jest.spyOn(zipData, 'getCBSA');
const mockGetMSA = jest.spyOn(msaData, 'getMSA');

// Declare testing stubs
const stubZIP = '12345';
const stubCBSA = '67890';
const stubMSAData: IMSAData = {
  msaName: 'Test County',
  population2014: '98765',
  population2015: '43210',
};

describe('Data Controller - Retrieve Data Middleware', () => {
  beforeAll(() => {
    next = jest.fn();
    mockGetCBSA.mockImplementation(() => stubCBSA);
    mockGetMSA.mockImplementation(() => stubMSAData);
  })
  afterAll(() => {
    jest.restoreAllMocks()
  });

  beforeEach(() => {
    response = httpMocks.createResponse({
      locals: {
        zip: stubZIP,
      },
    });
    next.mockClear();
    mockGetCBSA.mockClear();
    mockGetMSA.mockClear();
  });

  it('If no "refresh" query parameter is passed in, "refresh" is set to false', () => {
    request = httpMocks.createRequest({
      method: 'GET',
      url: '/api',
      query: {
        zip: stubZIP,
      }
    });
    dataController.retrieveData(request, response, next)
      .then(() => {
        expect(request.query.refresh).toEqual(false);
      })
  });

  it('If "refresh" query parameter is passed in, but is not "true", it is set to false', () => {
    request = httpMocks.createRequest({
      method: 'GET',
      url: '/api',
      query: {
        zip: stubZIP,
        refresh: 'hello',
      }
    });
    dataController.retrieveData(request, response, next)
      .then(() => {
        expect(request.query.refresh).toEqual(false);
      })
  });

  it('If "refresh" query parameter is "true", "req.query.refresh" remains "true"', () => {
    request = httpMocks.createRequest({
      method: 'GET',
      url: '/api',
      query: {
        zip: stubZIP,
        refresh: 'true',
      }
    });
    dataController.retrieveData(request, response, next)
      .then(() => {
        expect(request.query.refresh).toEqual('true');
      })
  });

  it('Retrieve Data Middleware calls zipData.getCBSA, passing in zip and refresh, responding with CBSA', () => {
    request = httpMocks.createRequest({
      method: 'GET',
      url: '/api',
      query: {
        zip: stubZIP,
      }
    });
    dataController.retrieveData(request, response, next)
      .then(() => {
        expect(mockGetCBSA.mock.calls.length).toEqual(1);
        expect(mockGetCBSA.mock.calls[0][0]).toEqual(stubZIP);
        expect(mockGetCBSA.mock.calls[0][1]).toEqual(request.query.refresh);
        expect(mockGetCBSA.mock.results[0].value).toEqual(stubCBSA);
      })
  });

  it('Retrieve Data Middleware calls msaData.getMSA, passing in CBSA and refresh, responding with MSA Data', () => {
    request = httpMocks.createRequest({
      method: 'GET',
      url: '/api',
      query: {
        zip: stubZIP,
      }
    });
    dataController.retrieveData(request, response, next)
      .then(() => {
        expect(mockGetMSA.mock.calls.length).toEqual(1);
        expect(mockGetMSA.mock.calls[0][0]).toEqual(stubCBSA);
        expect(mockGetMSA.mock.calls[0][1]).toEqual(request.query.refresh);
        expect(mockGetMSA.mock.results[0].value).toEqual(stubMSAData);
      })
  });

  it('Upon resolution, dataController clears retrieveData middleware', () => {
    request = httpMocks.createRequest({
      method: 'GET',
      url: '/api',
      query: {
        zip: stubZIP,
      }
    });
    dataController.retrieveData(request, response, next)
      .then(() => {
        expect(next.mock.calls.length).toEqual(1);
      })
  });
});
