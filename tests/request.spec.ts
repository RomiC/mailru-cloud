import FormData from 'form-data';
import https from 'https';
import { Stream, Writable } from 'stream';
import request, { IRequestOptions } from '../src/request';

jest.mock('https');

beforeEach(() => jest.clearAllMocks());

test('should call https.request with correct default params', () => {
  const options: IRequestOptions = {
    url: 'https://mail.ru'
  };

  request(options);

  expect(https.request).toHaveBeenCalledWith({
    protocol: 'https:',
    host: 'mail.ru',
    path: '/',
    method: 'GET',
    headers: {}
  });
});

test('should call https.request with data', () => {
  const options: IRequestOptions = {
    url: 'https://mail.ru',
    method: 'POST',
    query: {
      queryParam1: 'val1',
      queryParam2: 'val2'
    },
    data: {
      dataParam1: 'val1',
      dataParam2: 'val2'
    },
    headers: {
      header1: 'val1',
      header2: 'val2'
    }
  };

  request(options);

  expect(https.request).toHaveBeenCalledWith({
    protocol: 'https:',
    host: 'mail.ru',
    path: '/?queryParam1=val1&queryParam2=val2',
    method: 'POST',
    headers: {
      header1: 'val1',
      header2: 'val2'
    }
  });
  expect(https.request(null).end).toHaveBeenCalledWith('dataParam1=val1&dataParam2=val2');
});

test('should call https.request with form data params', () => {
  const form = new FormData();

  const options: IRequestOptions = {
    url: 'https://mail.ru',
    method: 'POST',
    query: {
      queryParam1: 'val1',
      queryParam2: 'val2'
    },
    form,
    headers: {
      header1: 'val1',
      header2: 'val2'
    }
  };

  request(options);

  expect(https.request).toHaveBeenCalledWith({
    protocol: 'https:',
    host: 'mail.ru',
    path: '/?queryParam1=val1&queryParam2=val2',
    method: 'POST',
    headers: {
      'header1': 'val1',
      'header2': 'val2',
      'Content-Type': 'multipart/form-data; boundary=mock-boundary',
      'Content-Length': 666
    }
  });
  expect(form.pipe).toHaveBeenCalledWith(expect.any(Object));
});

test('should support Stream as data param', () => {
  const data = new Stream();
  data.pipe = jest.fn();

  const options: IRequestOptions = {
    url: 'https://mail.ru',
    method: 'POST',
    query: {
      queryParam1: 'val1',
      queryParam2: 'val2'
    },
    data,
    headers: {
      header1: 'val1',
      header2: 'val2'
    }
  };

  request(options);

  expect(https.request).toHaveBeenCalledWith({
    protocol: 'https:',
    host: 'mail.ru',
    path: '/?queryParam1=val1&queryParam2=val2',
    method: 'POST',
    headers: {
      header1: 'val1',
      header2: 'val2'
    }
  });
  expect(data.pipe).toHaveBeenCalledWith(expect.any(Object));
});

test('should resolve promise with response', () => {
  const clientRequestMock = https.request(null);
  const options: IRequestOptions = {
    url: 'https://mail.ru'
  };
  const response: any = new Writable();
  response['statusCode'] = 200;

  const requestPromise = request(options);

  clientRequestMock.emit('response', response);

  response.emit('data', 'OK!');
  response.emit('end');

  return expect(requestPromise).resolves.toEqual({
    info: response,
    body: 'OK!'
  });
});

test('should reject promise with error for responses with bad status', () => {
  const clientRequestMock = https.request(null);
  const options: IRequestOptions = {
    url: 'https://mail.ru'
  };
  const response: any = new Writable();
  response['statusCode'] = 404;
  const err = new Error('NOT FOUND!');
  err.name = '404';

  const requestPromise = request(options);

  clientRequestMock.emit('response', response);

  response.emit('data', 'NOT FOUND!');
  response.emit('end');

  return expect(requestPromise).rejects.toEqual(err);
});

test('should reject promise with error in case of issue during request', () => {
  const clientRequestMock = https.request(null);
  const options: IRequestOptions = {
    url: 'https://mail.ru'
  };
  const err = new Error('Couldn\'t connect to host!');

  const requestPromise = request(options);

  clientRequestMock.emit('error', err);

  return expect(requestPromise).rejects.toEqual(err);
});