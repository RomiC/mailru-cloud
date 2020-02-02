import fs, { setReadStream, setStat, setWriteStream } from 'fs';
import https, {setClientRequest} from 'https';
import { Readable, Stream } from 'stream';
import { promisify } from 'util';

import { API_FILE, API_FILE_ADD } from '../src/constants';

import dispatcher, { resolveDispatcherPromise } from '../src/dispatcher';
import { add, download, info, upload } from '../src/file';
import request, { resolveRequestPromise } from '../src/request';
import requestToApi, { resolveRequestToApiPromise } from '../src/request-to-api';
import { ClientRequest } from './__mocks__/https';

jest.mock('fs');
jest.mock('https');
jest.mock('../src/dispatcher');
jest.mock('../src/request');
jest.mock('../src/request-to-api');

declare module 'fs' {
  type StatsMock = any;
  type StreamMock = any;
  function setStat(s: StatsMock): void;
  function setReadStream(stream: StreamMock): void;
  function setWriteStream(stream: StreamMock): void;
}

declare module 'https' {
  function setClientRequest(clientRequest: ClientRequest): void;
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

describe('download()', () => {
  const dispatcherResultMock = {
    get: [
      { url: 'https://get.mail.ru/' }
    ]
  };

  // tslint:disable-next-line: max-line-length
  it('should obtain get-url from dispatcher, request remote resource, pipe to the stream and resolve promise with a filename', () => {
    const clientRequestMock = new ClientRequest();
    const responseMock: any = new Readable();
    const writeStreamMock = new Stream();
    responseMock['statusCode'] = 200;
    responseMock['headers'] = {
      contentDispostion: 'attachment; filename="file.txt"'
    };

    const downloadPromise = download(auth, 'file.txt');

    expect(dispatcher).toHaveBeenCalledWith(auth);
    resolveDispatcherPromise(dispatcherResultMock);

    return getNextTickPromise()
      .then(() => {
        expect(https.get).toHaveBeenCalledWith(
          `https://get.mail.ru/file.txt?x-email=${encodeURIComponent(auth.email)}`,
          { headers: { Cookie: auth.cookies } },
          expect.any(Function)
        );

        setWriteStream(writeStreamMock);

        clientRequestMock.emit('response', responseMock);
        return getNextTickPromise();
      }).then(() => {
        console.log(downloadPromise);
        responseMock.emit('finish');

        return getNextTickPromise();
      }).then(() => {
        expect(fs.createWriteStream).toHaveBeenCalledWith('file.txt');
        expect(downloadPromise).resolves.toBe('file.txt');
      });
  });

  it('should reject promise in case of non-200-response', () => {
    const clientRequestMock = https.get(null);
    const responseMock: any = new Readable();
    responseMock['statusCode'] = 404;
    responseMock['statusMessage'] = 'NOT FOUND';

    const downloadPromise = download(auth, 'file.txt');
    resolveDispatcherPromise(dispatcherResultMock);

    return getNextTickPromise()
      .then(() => {
        clientRequestMock.emit('response', responseMock);

        return getNextTickPromise();
      })
      .then(() => {
        const err = new Error('NOT FOUND');
        err.name = '404';

        expect(downloadPromise).rejects.toEqual(err);
      });
  });

  it('should use saveAs-param value as an output filename', () => {
    const clientRequestMock = https.get(null);
    const writeStreamMock = new Stream();
    const responseMock: any = new Readable();
    responseMock['statusCode'] = 200;
    responseMock['headers'] = {
      contentDispostion: 'attachment; filename="file.txt"'
    };

    const downloadPromise = download(auth, 'file.txt', 'file2.txt');

    expect(dispatcher).toHaveBeenCalledWith(auth);
    resolveDispatcherPromise(dispatcherResultMock);

    return getNextTickPromise()
      .then(() => {
        clientRequestMock.emit('response', responseMock);

        setWriteStream(writeStreamMock);

        return getNextTickPromise();
      })
      .then(() => {
        expect(fs.createWriteStream).toHaveBeenCalledWith('file2.txt');

        responseMock.emit('finish');

        return getNextTickPromise();
      })
      .then(() => {
        expect(downloadPromise).resolves.toBe('file2.txt');
      });
  });
});