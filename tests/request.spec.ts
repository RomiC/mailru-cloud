import https from 'https';
import request, { IRequestOptions } from '../src/request';

jest.mock('https', () => {
  const fakeRequest = {
    on: jest.fn(),
    write: jest.fn(),
    end: jest.fn()
  };

  return {
    request: jest.fn(() => {
      return fakeRequest;
    })
  };
});

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

test('should call https.request with form data', () => {
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
  expect(https.request({}).write).toHaveBeenCalledWith('dataParam1=val1&dataParam2=val2');
});