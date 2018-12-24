/**
 * @module dataController.ts
 * @description Gov Census/HUD Data Controller
 */

import { Request, Response, NextFunction } from 'express';

import zipData from '../models/zipData';
import msaData from '../models/msaData';

/**
 * Middleware - Retrieve Zip Code Data
 */
const retrieveData = async (_: Request, res: Response, next: NextFunction): Promise<void> => {
  res.locals.cbsa = await zipData.getCBSA(res.locals.zip);
  const msa = await msaData.getData(res.locals.cbsa);
  console.log(msa);
  return next();
};

// Generate module export object and export
const dataController = {
  retrieveData,
}

export default dataController;