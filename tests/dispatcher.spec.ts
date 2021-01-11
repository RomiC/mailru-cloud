import { API_DISPATCHER } from '../src/constants';
import { dispatcher } from '../src/dispatcher';
import requestToApi, { resolveRequestToApiPromise } from '../src/request-to-api';

jest.mock('../src/request-to-api');

const auth = {
  cookies: 'Mpop=1551101044;t=0000000000000000;sdcs=0000000000000000',
  token: 'token'
};

describe('dispatcher()', () => {
  it('should call requestToApi with correct params and resolve promise with body', () => {
    const dispatcherPromise = dispatcher(auth);
    const bodyMock = {
      video: [{ count: 1, url: 'https://video.mail.ru' }]
    };

    expect(requestToApi).toHaveBeenCalledWith(auth, {
      url: API_DISPATCHER
    });

    resolveRequestToApiPromise({ body: bodyMock });

    return expect(dispatcherPromise).resolves.toBe(bodyMock);
  });
});
