/**
 * @module server/app.ts
 * @description Server Declaration and Route
 */

import * as express from 'express';

// Invoke express server
const app = express();

const redirectMessage = 'Welcome to the Zip to MSA API.<br>\
  This route is not active.<br>\
  Please send a GET request with a query parameter "zip" to "/api".<br>\
  API response will include the following:<br>\
  <ul>\
    <li>Your input zip code.\
    <li>The matching CBSA code.\
    <li>The matching MSA name.\
    <li>The MSA\'s population for 2015.\
    <li>The MSA\'s population for 2014.\
  </ul>';

app.use('*',
  (_: express.Request, res: express.Response) => res.status(404).send(redirectMessage));

export default app;
