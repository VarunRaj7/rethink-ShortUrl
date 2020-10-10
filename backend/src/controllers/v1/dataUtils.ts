import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { config } from '../../config/config';
import { createLogger } from '../../utils/logger';

const logger = createLogger('Datautils');
const c = config.dev;

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    logger.info('Creating a local DynamoDB instance');
    return new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000',
    });
  }

  logger.info(`Connecting to DynamoDB`);
  return new AWS.DynamoDB.DocumentClient();
}

async function actualUrlExists(actualUrl: string, docClient: DocumentClient) {
  const result = await docClient
    .query({
      TableName: c.shortUrl_table,
      IndexName: c.actualUrl_index,
      KeyConditionExpression: 'actualUrl = :actualUrl',
      ExpressionAttributeValues: {
        ':actualUrl': actualUrl,
      },
    })
    .promise();

  logger.info(`${JSON.stringify(result)}`);

  return JSON.stringify(result) === '{}';
}

export { createDynamoDBClient, actualUrlExists };
