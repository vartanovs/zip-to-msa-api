/**
 * @module dataController.ts
 * @description Gov Census/HUD Data Controller
 */

import { Request, Response, NextFunction } from 'express';

import zipData from '../models/zipData';
import msaData from '../models/msaData';

/**
 * Middleware - Retrieve CSBA and MSA Data
 */
const retrieveData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Force req.query.refresh to false if it's not explicitly 'true'
  if (req.query.refresh !== 'true') {
    req.query.refresh = false;
  }
  res.locals.cbsa = await zipData.getCBSA(res.locals.zip, req.query.refresh);
  const msaObject = await msaData.getData(res.locals.cbsa, req.query.refresh);
  res.locals = {...res.locals, ...msaObject }
  return next();
};

// Generate module export object and export
const dataController = {
  retrieveData,
}

export default dataController;