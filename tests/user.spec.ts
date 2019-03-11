import { API_USER_SPACE } from '../src/constants';
import requestToApi, { resolveRequestToApiPromise } from '../src/request-to-api';
import { space } from '../src/user';

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
describe('space()', () => {
  it('should call request-to-api with proper params and resolve promisee with body', () => {
    const bodyMock = {
      overquota: false,
      bytes_used: 100000,
      bytes_total: 10000000
    };
    const spacePromise = space(auth);

    expect(requestToApi).toHaveBeenCalledWith(auth, { url: API_USER_SPACE });

    resolveRequestToApiPromise({ body: bodyMock });

    return expect(spacePromise).resolves.toBe(bodyMock);
  });
});