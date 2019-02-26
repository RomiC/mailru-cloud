import FormData from 'form-data';
import { ICredentials } from '../src/@types/index';
import { USER_AGENT } from '../src/constants';
import request, { rejectRequestPromise, resolveRequestPromise } from '../src/request';
import requestToApi from '../src/request-to-api';

jest.mock('../src/request');

declare module '../src/request' {
  function getRequestPromise(): Promise<any>;
  function resolveRequestPromise(value?: {} | PromiseLike<{}>): void;
  function rejectRequestPromise(reason?: any): void;
}

beforeEach(() => {
  jest.clearAllMocks();
});

const auth: ICredentials = {
  token: '109832ur912hiuakaekrq',
  cookies: 'awt=10293041; gwt=108813823; jwt=192387432'
};

test('should properly call request for basic case', () => {
  requestToApi(auth, { url: 'https://api.mail.ru' });

  expect(request).toHaveBeenCalledWith({
    url: 'https://api.mail.ru',
    method: 'GET',
    query: {
      token: auth.token
    },
    form: undefined,
    data: undefined,
    headers: {
      'Cookie': auth.cookies,
      'User-Agent': USER_AGENT
    }
  });
});

test('should preoperly call request without defined token', () => {
  requestToApi(
    {
      ...auth,
      token: undefined
    },
    { url: 'https://api.mail.ru' }
  );

  expect(request).toHaveBeenCalledWith({
    url: 'https://api.mail.ru',
    method: 'GET',
    query: {},
    form: undefined,
    data: undefined,
    headers: {
      'Cookie': auth.cookies,
      'User-Agent': USER_AGENT
    }
  });
});

test('should preoperly call request with query params', () => {
  requestToApi(auth, {
    url: 'https://api.mail.ru',
    query: {
      param1: 'val1',
      param2: 'val2'
    }
  });

  expect(request).toHaveBeenCalledWith({
    url: 'https://api.mail.ru',
    method: 'GET',
    query: {
      token: auth.token,
      param1: 'val1',
      param2: 'val2'
    },
    form: undefined,
    data: undefined,
    headers: {
      'Cookie': auth.cookies,
      'User-Agent': USER_AGENT
    }
  });
});

test('should preoperly call request with form', () => {
  const form = new FormData();

  requestToApi(auth, {
    url: 'https://api.mail.ru',
    form
  });

  expect(request).toHaveBeenCalledWith({
    url: 'https://api.mail.ru',
    method: 'GET',
    query: {
      token: auth.token
    },
    form,
    data: undefined,
    headers: {
      'Cookie': auth.cookies,
      'User-Agent': USER_AGENT
    }
  });
});

test('should preoperly call request with data', () => {
  const data = {
    prop1: 'val1',
    prop2: 'val2'
  };

  requestToApi(auth, {
    url: 'https://api.mail.ru',
    data
  });

  expect(request).toHaveBeenCalledWith({
    url: 'https://api.mail.ru',
    method: 'GET',
    query: {
      token: auth.token
    },
    form: undefined,
    data,
    headers: {
      'Cookie': auth.cookies,
      'User-Agent': USER_AGENT
    }
  });
});

test('should parse response as JSON and return the result', () => {
  const data = { param1: 'val1', param2: 'val2' };
  const requestToApiPromise = requestToApi(auth, { url: 'https://api.mail.ru' });

  resolveRequestPromise({ body: JSON.stringify(data) });

  return expect(requestToApiPromise).resolves.toEqual(data);
});

test('should handle errors appeared during request', () => {
  const err = new Error('ERROR!');
  const requestToApiPromise = requestToApi(auth, { url: 'https://api.mail.ru' });

  rejectRequestPromise(err);

  return expect(requestToApiPromise).rejects.toEqual(err);
});

test('should handle errors appeared during parsing JSON', () => {
  const requestToApiPromise = requestToApi(auth, { url: 'https://api.mail.ru' });

  resolveRequestPromise({
    body: 'wrong json data'
  });

  return expect(requestToApiPromise).rejects.toBeInstanceOf(Error);
});