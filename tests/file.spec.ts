import { API_FILE, API_FILE_ADD } from '../src/constants';
import { add, info, upload } from '../src/file';
import requestToApi, { resolveRequestToApiPromise } from '../src/request-to-api';

jest.mock('../src/request-to-api');

declare module '../src/request-to-api' {
  function resolveRequestToApiPromise(value?: {} | PromiseLike<{}>): void;
  function rejectRequestToApiPromise(reason?: any): void;
}

const auth = {
  // tslint:disable-next-line: max-line-length
  cookies: 'Mpop=1551101044;t=0000000000000000;sdcs=0000000000000000',
  token: 'token'
};

beforeEach(() => {
  jest.clearAllMocks();
})

describe('add()', () => {
  it('should call request-to-api with proper params and resolves promise with body', () => {
    const addFileMock = '/file.txt';
    const uploadDataMock = {
      hash: '6AEB2E9257D40EA0A16659477717E0E5AFBFF288',
      size: 1393
    };

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
  it('should call disaptcher and upload file using porvided url', () => {

  })
})