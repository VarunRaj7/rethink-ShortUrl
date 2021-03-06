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
router.get('/shortUrl/:actualUrl', async (req: Request, res: Response) => {
  const actualUrl = decodeURI(req.params.actualUrl)
    .toString()
    .replace(/\/$/, '');

  const user = 'Rethink';

  logger.info(`ShortURL for ${actualUrl}`);

  logger.info(`Checking if it is  valid url ${isUrl(actualUrl)}`);
  // Checking if the given string is a url
  if (!isUrl(actualUrl) || actualUrl === 'undefined') {
    res.status(400).send(`Not a Valid URL`);
    return res;
  }

  if (await actualUrlExists(actualUrl, user, docClient)) {
    // Verifying if the URL exists in dynamodb

    const id = nanoid();

    const ShortUrl = c.base_url + id;

    logger.info(`ShortURL not exists for ${actualUrl}`);
    logger.info(`New ShortURL is ${ShortUrl}`);

    // If the URL not exists create a new short URL
    const newItem: shortUrlModel = {
      actualUrl: actualUrl,
      shortUrl: ShortUrl,
      user: 'Rethink',
      createdAt: new Date().toISOString(),
    };

    // Insert the new short url in the DynamoDB
    // and send it to user
    docClient
      .put({ TableName: c.shortUrl_table, Item: newItem })
      .promise()
      .then(() => res.status(200).send(JSON.stringify(newItem)))
      .catch((e) => res.status(400).send(`Failed to Create retry: ${e}`));
    return res;
  }
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
  return res;
});

// Get actual URL given short URL
router.get('/actualUrl/:shortUrl', async (req: Request, res: Response) => {
  const shortUrl = decodeURI(req.params.shortUrl).toString();

  logger.info(`Retrieving Actual URL for ${shortUrl}`);

  docClient
    .get({
      TableName: c.shortUrl_table,
      Key: {
        shortUrl: shortUrl,
      },
    })
    .promise()
    .then((result) => res.status(200).send(JSON.stringify(result.Item)))
    .catch((e) => res.status(400).send(`Failed to fetch retry: ${e}`));
});

// Delete short URL
router.delete('/shortUrl/:shortUrl', async (req: Request, res: Response) => {
  const shortUrl = decodeURI(req.params.shortUrl).toString();

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

// Fetch the latest 10 urls created by user

router.get('/user/', async (req: Request, res: Response) => {
  const user = 'Rethink';

  // Fecthing the last 10 urls created by user
  logger.info(`ShortURL exists for ${user}`);

  docClient
    .query({
      TableName: c.shortUrl_table,
      IndexName: c.user_index,
      KeyConditionExpression: '#user = :user',
      ExpressionAttributeValues: {
        ':user': user,
      },
      ExpressionAttributeNames: {
        '#user': 'user',
      },
      Limit: 10,
      ScanIndexForward: false,
    })
    .promise()
    .then((result) => res.status(200).send(JSON.stringify(result)))
    .catch((e) => res.status(400).send(`Failed to fetch retry: ${e}`));
});

export const IndexRouter: Router = router;
