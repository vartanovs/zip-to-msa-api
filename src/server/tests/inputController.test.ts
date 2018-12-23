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

describe('Input Controller - Validate Input Middleware', () => {
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
  })
})