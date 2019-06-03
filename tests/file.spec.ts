import { setReadStream, setStat, StatsMock, StreamMock } from 'fs';
import { Stream } from 'stream';
import { promisify } from 'util';

import { API_FILE, API_FILE_ADD } from '../src/constants';

import dispatcher, { resolveDispatcherPromise } from '../src/dispatcher';
import { add, info, upload } from '../src/file';
import request, { resolveRequestPromise } from '../src/request';
import requestToApi, { resolveRequestToApiPromise } from '../src/request-to-api';

jest.mock('fs');
jest.mock('../src/dispatcher');
jest.mock('../src/request');
jest.mock('../src/request-to-api');

declare module 'fs' {
  type StatsMock = any;
  type StreamMock = any;
  function setStat(s: StatsMock): void;
  function setReadStream(stream: StreamMock): void;
}

declare module '../src/dispatcher' {
  function resolveDispatcherPromise(value?: {} | PromiseLike<{}>): void;
  function rejectDispatcherPromise(reason?: any): void;
}

declare module '../src/request' {
  function resolveRequestPromise(value?: {} | PromiseLike<{}>): void;
  function rejectRequestPromise(reason?: any): void;
}

declare module '../src/request-to-api' {
  function resolveRequestToApiPromise(value?: {} | PromiseLike<{}>): void;
  function rejectRequestToApiPromise(reason?: any): void;
}

const getNextTickPromise = promisify(process.nextTick);

const auth = {
  // tslint:disable-next-line: max-line-length
  cookies: 'Mpop=1551101044;t=0000000000000000;sdcs=0000000000000000',
  token: 'token',
  email: 'user@mail.ru'
};

beforeEach(() => jest.clearAllMocks());

describe('add()', () => {
  const addFileMock = '/file.txt';
  const uploadDataMock = {
    hash: '6AEB2E9257D40EA0A16659477717E0E5AFBFF288',
    size: 1393
  };
  it('should call request-to-api with proper params and resolves promise with body', () => {
    const addPromise = add(auth, addFileMock, uploadDataMock, 'rewrite');

    expect(requestToApi).toHaveBeenCalledWith(auth, {
      url: API_FILE_ADD,
      method: 'POST',
      data: {
        home: addFileMock,
        ...uploadDataMock,
        conflict: 'rewrite'
      }
    });

    resolveRequestToApiPromise({ body: addFileMock });

    return expect(addPromise).resolves.toBe(addFileMock);
  });

  it('should have default value for conflict param equals \'rename\'', () => {
    add(auth, addFileMock, uploadDataMock);

    expect(requestToApi).toHaveBeenCalledWith(auth, {
      url: API_FILE_ADD,
      method: 'POST',
      data: {
        home: addFileMock,
        ...uploadDataMock,
        conflict: 'rename'
      }
    });
  });
});

describe('info()', () => {
  it('should call request-to-api with proper params and resolves promise with body', () => {
    const pathMock = {
      mtime: 1520804586,
      virus_scan: 'pass',
      name: 'file.txt',
      size: 35650,
      hash: '2871A818166C3BD8255F2DD9CC417520D3EB1F76',
      kind: 'file',
      type: 'file',
      home: '/file.txt'
    };

    const infoPromise = info(auth, pathMock.home);

    expect(requestToApi).toHaveBeenCalledWith(auth, {
      url: API_FILE,
      method: 'GET',
      query: {
        home: pathMock.home
      }
    });

    resolveRequestToApiPromise({ body: pathMock });

    return expect(infoPromise).resolves.toBe(pathMock);
  });
});

describe('upload()', () => {
  it('should call disaptcher, upload file using provided url and resolve promise with file hash and size', () => {
    const streamMock = new Stream();
    const dispatcherResultMock = {
      upload: [
        { url: 'http://upload.mail.ru/' }
      ]
    };

    setStat({ size: 9999 });
    setReadStream(streamMock);

    const uploadPromise = upload(auth, './file.txt');

    expect(dispatcher).toHaveBeenCalledWith(auth);
    resolveDispatcherPromise(dispatcherResultMock);

    return getNextTickPromise()
      .then(() => {
        expect(request).toHaveBeenCalledWith({
          url: dispatcherResultMock.upload[0].url,
          method: 'PUT',
          data: streamMock,
          headers: {
            'Cookie': auth.cookies,
            'Content-Length': 9999,
            'X-Requested-With': 'XMLHttpRequest'
          },
          query: {
            'x-email': 'user@mail.ru'
          }
        });

        resolveRequestPromise({ body: '7bc7ba8dd37d19e272cec1bb8415fd821c1735ec' });

        return getNextTickPromise();
      })
      .then(() => {
        return expect(uploadPromise).resolves.toEqual({
          hash: '7bc7ba8dd37d19e272cec1bb8415fd821c1735ec',
          size: 9999
        });
      });
  });
});