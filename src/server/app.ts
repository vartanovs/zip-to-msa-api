/**
 * @module server/app.ts
 * @description Server Declaration and Route
 */

import * as express from 'express';
import * as path from 'path';

// Import Middleware
import inputController from './controllers/inputController';

// Invoke express server
const app = express();

// Primary Route - Expect ZIP code query parameter
app.get('/api',
  inputController.confirmInput,
  inputController.validateInput,
  (_: express.Request, res: express.Response) => res.sendStatus(200));

app.use('*',
  (_: express.Request, res: express.Response) => res.sendFile(path.resolve(__dirname, '../client/index.html')));

export default app;
