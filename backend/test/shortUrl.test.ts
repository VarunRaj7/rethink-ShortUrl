import { expect } from 'chai';
import { describe, it } from 'mocha';
import isUrl from 'is-url';
import Axios from 'axios';
import { shortUrlModel } from '../src/controllers/v1/shortUrl.model';

describe('GET API for the /shortUrl/', async () => {
  const google = 'https://www.google.com/';
  const res = await Axios.get('http://localhost:8080/api/v1/shortUrl/', {
    data: { actualUrl: google },
  });
  it(' should return a 200 status for http://www.google.com', () => {
    expect(res.status).to.be.equal(200);
  });
  it(' should return a valid url for http://www.google.com', () => {
    const body: shortUrlModel = JSON.parse(res.data);
    const validUrl = isUrl(body.shortUrl);
    expect(validUrl).to.be.true;
  });
  it(' should return a 400 for http://google.fsk', () => {
    expect(res.status).to.be.equal(400);
  });
});

describe('GET API for the /actualUrl/', async () => {
  const google = 'https://www.google.com/';
  const res = await Axios.get('http://localhost:8080/api/v1/actualUrl/', {
    data: { actualUrl: google },
  });
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
