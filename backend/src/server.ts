import express from 'express';
import bodyParser from 'body-parser';
import { createLogger } from './utils/logger';
import { IndexRouter } from './controllers/v1/index.router';
// import cors from 'cors';

const logger = createLogger('Root');

(async () => {
  const app = express();
  const port = process.env.PORT || 8080; // default port to listen

  app.use(bodyParser.json());

  // Allowing cors
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'DELETE, POST, GET, OPTIONS');
    res.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
    );
    next();
  });

  // Root URI call
  app.get('/', async (req, res) => {
    logger.info('connected with browser');
    return res.status(200).send('Welcome to the ShrotUrl App');
  });

  app.use('/api/v1/', IndexRouter);

  // Start the Server
  app.listen(port, () => {
    logger.info(`server running http://localhost:${port}`);
    logger.info(`press CTRL+C to stop server`);
  });
})();
