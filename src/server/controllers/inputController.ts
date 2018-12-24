/**
 * @module inputController.ts
 * @description User Input Controller
 */

import { Request, Response, NextFunction } from 'express';

import errorMessages from '../utils/errorMessages';

/**
 * Middleware - Confirm that a 'zip' query parameter was provided
 */
const confirmInput = (req: Request, res: Response, next: NextFunction): void | Response => {
  if (!req.query.zip) return res.status(400).json(errorMessages.zip.noZip);
  return next();
};

/**
 * Middleware - Validate query parameters - 'zip' is a 5-digit number and refresh is an optional boolean
 */
const validateInput = (req: Request, res: Response, next: NextFunction): void | Response => {
  if (req.query.zip.length !== 5) return res.status(400).json(errorMessages.zip.invalidLength);
  const zipAsNum = Number(req.query.zip);
  if (Number.isNaN(zipAsNum)) return res.status(400).json(errorMessages.zip.zipIsNaN);
  res.locals.zip = req.query.zip;
  return next();
};

// Generate module export object and export
const inputController = {
  confirmInput,
  validateInput,
}

export default inputController;
