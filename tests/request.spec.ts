import FormData from 'form-data';
import https from 'https';
import request, { IRequestOptions } from '../src/request';

jest.mock('https');

beforeEach(() => {
  jest.clearAllMocks();
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
  expect(https.request(null).write).toHaveBeenCalledWith('dataParam1=val1&dataParam2=val2');
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
