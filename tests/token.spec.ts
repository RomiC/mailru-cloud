import { API_TOKENS_CSRF } from '../src/constants';
import requestToApi, { resolveRequestToApiPromise } from '../src/request-to-api';
import { csrf } from '../src/token';

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

describe('csrf()', () => {
  it('should call request-to-api with proper params and resolves promise with body', () => {
    const bodyMock = { token: 'csrf-token' };
    const csrfPromise = csrf(auth);

    expect(requestToApi).toHaveBeenCalledWith(auth, {
      url: API_TOKENS_CSRF,
      method: 'POST'
    });

    resolveRequestToApiPromise({ body: bodyMock });

    return expect(csrfPromise).resolves.toBe(bodyMock);
  });
});