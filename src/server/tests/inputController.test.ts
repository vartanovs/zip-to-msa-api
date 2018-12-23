/**
 * @module inputController.test.ts
 * @description Testing for Input Controller
 */

import * as httpMocks from 'node-mocks-http';

import { Request, Response } from 'express';

import inputController from '../controllers/inputController';
import errorMessages from '../utils/errorMessages';

let request: httpMocks.MockRequest<Request>;;
let response: httpMocks.MockResponse<Response>;
let next = jest.fn();

describe('Input Controller - Confirm/Validate Input Middleware', () => {
  beforeEach(() => {
    response = httpMocks.createResponse();
    next.mockClear();
  });

  it('Not providing a "zip" query parameter results in a noZip error', () => {
    request = httpMocks.createRequest({
      method: 'GET',
      url: '/api',
    });
    inputController.confirmInput(request, response, next);
    expect(response.statusCode).toEqual(400);
    expect(JSON.parse(response._getData())).toEqual(errorMessages.zip.noZip);
    expect(next.mock.calls.length).toEqual(0);
  });

  it('Providing a "zip" query parameter clears the confirmInput middleware', () => {
    request = httpMocks.createRequest({
      method: 'GET',
      url: '/api',
      query: {
        zip: "90210",
      },
    });
    inputController.confirmInput(request, response, next);
    expect(next.mock.calls.length).toEqual(1);
  });

  it('Providing a "zip" query parameter not 5 characters long results in an invalidLength error', () => {
    request = httpMocks.createRequest({
      method: 'GET',
      url: '/api',
      query: {
        zip: "123",
      },
    });
    inputController.validateInput(request, response, next);
    expect(response.statusCode).toEqual(400);
    expect(JSON.parse(response._getData())).toEqual(errorMessages.zip.invalidLength);
    expect(next.mock.calls.length).toEqual(0);
  });

  it('Providing a non-number "zip" query parameter results in a zipIsNaN error', () => {
    request = httpMocks.createRequest({
      method: 'GET',
      url: '/api',
      query: {
        zip: "1234e",
      },
    });
    inputController.validateInput(request, response, next);
    expect(response.statusCode).toEqual(400);
    expect(JSON.parse(response._getData())).toEqual(errorMessages.zip.zipIsNaN);
    expect(next.mock.calls.length).toEqual(0);
  });

  it('Providing a 5-digit "zip" query parameter clears validateInput middleware', () => {
    request = httpMocks.createRequest({
      method: 'GET',
      url: '/api',
      query: {
        zip: "90210",
      },
    });
    inputController.validateInput(request, response, next);
    expect(next.mock.calls.length).toEqual(1);
  });
})