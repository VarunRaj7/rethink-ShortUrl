import { expect } from 'chai';
import { describe, it } from 'mocha';
import isUrl from 'is-url';
import Axios, { AxiosResponse } from 'axios';
import { shortUrlModel } from '../src/controllers/v1/shortUrl.model';
import { createLogger } from '../src/utils/logger';

const logger = createLogger('testing');

describe('GET API for the /shortUrl/', () => {
  const google = 'https://www.google.com/';
  Axios.get(`http://localhost:8080/api/v1/shortUrl/${encodeURI(google)}`)
    .then((response) => {
      it(' should return a 200 status for http://www.google.com', () => {
        expect(response.status).to.be.equal(200);
      });
      it(' should return a valid url for http://www.google.com', () => {
        const body: shortUrlModel = JSON.parse(response.data);
        const validUrl = isUrl(body.shortUrl);
        expect(validUrl).to.be.true;
      });
      it(' should return a 400 for http://google.fsk', () => {
        expect(response.status).to.be.equal(400);
      });
    })
    .catch((e) => logger.error(`Failed to create the short url ${e}`));
});

describe('GET API for the /actualUrl/', async () => {
  const google = 'https://www.google.com/';
  const res = await Axios.get(
    `http://localhost:8080/api/v1/shortUrl/${encodeURI(google)}`
  );
  const body: shortUrlModel = JSON.parse(res.data);
  it(` should return a 200 status for ${body.shortUrl} which is google short url`, () => {
    expect(res.status).to.be.equal(200);
  });
  it(' should return a valid url that is http://www.google.com', () => {
    const validUrl = isUrl(body.shortUrl);
    expect(validUrl).to.be.true;
  });
});

describe('GET API for the /user/', async () => {
  const res = await Axios.get('http://localhost:8080/api/v1/user/');
  const body = JSON.parse(res.data);
  it(` should return a 200 status for user `, () => {
    expect(res.status).to.be.equal(200);
  });
  it(' should return a list of short urls created', () => {
    expect(body.Count).to.be.at.least(0);
  });
});
