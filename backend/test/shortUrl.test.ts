import { expect } from 'chai';
import { describe, it } from 'mocha';
import isUrl from 'is-url';
import Axios, { AxiosResponse } from 'axios';
import { shortUrlModel } from '../src/controllers/v1/shortUrl.model';
import { createLogger } from '../src/utils/logger';

const logger = createLogger('testing');
const google = 'https://www.google.com/';

// Testing the GET api/v1/shortUrl/:actualUrl Endpoint
describe('GET API for the /shortUrl/', () => {
  // logger.info(
  //   `http://localhost:8080/api/v1/shortUrl/${encodeURIComponent(google)}`
  // );

  let responseValid: AxiosResponse;
  let responseInvalid: Number;

  before(async () => {
    responseValid = await Axios.get(
      `http://localhost:8080/api/v1/shortUrl/${encodeURIComponent(google)}`
    );
    await Axios.get(
      `http://localhost:8080/api/v1/shortUrl/${encodeURIComponent(
        'https://google'
      )}`
    ).catch(() => {
      responseInvalid = 400;
    });
  });

  it(' should return a 200 status for http://www.google.com', (done) => {
    expect(responseValid.status).to.be.equal(200);
    done();
  });

  it(' should return a valid url for http://www.google.com', (done) => {
    const body: shortUrlModel = responseValid.data;
    const validUrl = isUrl(body.shortUrl);
    expect(validUrl).to.be.true;
    done();
  });
  it(' should return a 400 for http://google', (done) => {
    logger.info(responseInvalid);
    expect(responseInvalid).to.be.equal(400);
    done();
  });
});

// Testing the GET api/v1/actualUrl/:shortUrl Endpoint
describe('GET API for the /actualUrl/', async () => {
  let responseValid1: AxiosResponse;
  let responseValid2: AxiosResponse;

  before(async () => {
    responseValid1 = await Axios.get(
      `http://localhost:8080/api/v1/shortUrl/${encodeURIComponent(google)}`
    );

    responseValid2 = await Axios.get(
      `http://localhost:8080/api/v1/actualUrl/${encodeURIComponent(
        responseValid1.data.shortUrl
      )}`
    );
  });
  it(` should return a 200 status for google short url`, (done) => {
    expect(responseValid2.status).to.be.equal(200);
    done();
  });
  it(' should return a valid url that is http://www.google.com', (done) => {
    const validUrl = isUrl(responseValid2.data.Item.shortUrl);
    expect(validUrl).to.be.true;
    done();
  });
});

// Testing the GET api/v1/user/ Endpoint
describe('GET API for the /user/', async () => {
  let response: AxiosResponse;

  before(async () => {
    response = await Axios.get(`http://localhost:8080/api/v1/user/`);
  });

  it(` should return a 200 status for user `, (done) => {
    expect(response.status).to.be.equal(200);
    done();
  });
  it(' should return a list of short urls created', (done) => {
    expect(response.data.Count).to.be.at.least(0);
    done();
  });
});
