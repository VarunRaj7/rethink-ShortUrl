import { Router, Request, Response } from 'express';
import { customAlphabet } from 'nanoid';
import isUrl from 'is-url';
import { createDynamoDBClient, actualUrlExists } from './dataUtils';
import { config } from '../../config/config';
import { createLogger } from '../../utils/logger';
import { shortUrlModel } from './shortUrl.model';

const logger = createLogger('ShortURL');
const c = config.dev;

const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  8
);

const docClient = createDynamoDBClient();

const router: Router = Router();

// Get ShortURL given actual URL
router.get('/shortUrl/', async (req: Request, res: Response) => {
  const actualUrl = req.body.actualUrl.replace(/\/$/, '');

  // Checking if the given string is a url
  if (!isUrl(actualUrl)) {
    res.status(400).send(`Not a Valid URL`);
  }

  if (await actualUrlExists(actualUrl, docClient)) {
    // Verifying if the URL exists in dynamodb

    const id = nanoid();

    const ShortUrl = c.base_url + id;

    logger.info(`ShortURL not exists for ${actualUrl}`);
    logger.info(`New ShortURL is ${ShortUrl}`);

    // If the URL not exists create a new short URL
    const newItem: shortUrlModel = {
      actualUrl: actualUrl,
      shortUrl: ShortUrl,
      user: 'Varun',
      createdAt: new Date().toISOString(),
    };

    // Insert the new short url in the DynamoDB
    // and send it to user
    docClient
      .put({ TableName: c.shortUrl_table, Item: newItem })
      .promise()
      .then(() => res.status(200).send(JSON.stringify(newItem)))
      .catch((e) => res.status(400).send(`Failed to Create retry: ${e}`));
  } else {
    // Verifying if the URL exists
    // send the Short URL
    logger.info(`ShortURL exists for ${actualUrl}`);
    docClient
      .query({
        TableName: c.shortUrl_table,
        IndexName: c.actualUrl_index,
        KeyConditionExpression: 'actualUrl = :actualUrl',
        ExpressionAttributeValues: {
          ':actualUrl': actualUrl,
        },
      })
      .promise()
      .then((result) => {
        if (result.Items !== undefined) {
          res.status(200).send(JSON.stringify(result.Items[0]));
        }
      })
      .catch((e) => res.status(400).send(`Failed to fetch retry: ${e}`));
  }
});

// Get actual URL given short URL
router.get('/actualUrl/', async (req: Request, res: Response) => {
  const { shortUrl } = req.body;

  logger.info(`Retrieving Actual URL for ${shortUrl}`);

  docClient
    .get({
      TableName: c.shortUrl_table,
      Key: {
        shortUrl: shortUrl,
      },
    })
    .promise()
    .then((result) => res.status(200).send(JSON.stringify(result)))
    .catch((e) => res.status(400).send(`Failed to fetch retry: ${e}`));
});

// Delete short URL
/*
router.delete('/shortUrl/', async (req: Request, res: Response) => {
  const { shortUrl } = req.body;

  logger.info(`Deleting Short URL ${shortUrl}`);

  docClient
    .delete({
      TableName: c.shortUrl_table,
      Key: {
        shortUrl: shortUrl,
      },
    })
    .promise()
    .then(() => res.status(200).send(`Successfully Deleted ${shortUrl}`))
    .catch((e) => res.status(400).send(`Failed to delete retry: ${e}`));
});
*/

// Fetch the latest 10 urls created by user

router.get('/user/', async (req: Request, res: Response) => {
  const user = 'Varun';

  // Fecthing the last 10 urls created by user
  logger.info(`ShortURL exists for ${user}`);

  docClient
    .scan({
      TableName: c.shortUrl_table,
      IndexName: c.user_index,
      FilterExpression: '#user = :user',
      ExpressionAttributeValues: {
        ':user': user,
      },
      ExpressionAttributeNames: {
        '#user': 'user',
      },
      Limit: 10,
    })
    .promise()
    .then((result) => res.status(200).send(JSON.stringify(result)))
    .catch((e) => res.status(400).send(`Failed to fetch retry: ${e}`));
});

export const IndexRouter: Router = router;
