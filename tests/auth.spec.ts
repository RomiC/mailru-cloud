import { promisify } from 'util';
import auth from '../src/auth';
import { AUTH_COMMON_URL, AUTH_SDC_REDIRECT_URL, API_BASE } from '../src/constants';
import filterIncomingCookies from '../src/filter-incoming-cookies';
import request, { getRequestPromise, rejectRequestPromise, resolveRequestPromise } from '../src/request';
import { csrf, resolveCsrfPromise, rejectCsrfPromise } from '../src/token';

jest.mock('../src/request');
jest.mock('../src/token');

declare module '../src/token' {
  function getCsrfPromise(): Promise<any>;
  function resolveCsrfPromise(value?: {} | PromiseLike<{}>): void;
  function rejectCsrfPromise(reason?: any): void;
}

declare module '../src/request' {
  function getRequestPromise(): Promise<any>;
  function resolveRequestPromise(value?: {} | PromiseLike<{}>): void;
  function rejectRequestPromise(reason?: any): void;
}

beforeEach(() => {
  jest.clearAllMocks();
});

const getNextTickPromise = promisify(process.nextTick);

const commonAuthResponse = {
  info: {
    headers: {
      'set-cookie': [
        // tslint:disable: max-line-length
        'GarageID=0000000000000000000000000000; expires=Tue, 25 Feb 2020 13:24:04 GMT; path=/; domain=.auth.mail.ru; Secure; HttpOnly',
        'Mpop=1551101044:0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000:roman.charugin@mail.ru:; expires=Sun, 26 May 2019 13:24:04 GMT; path=/; domain=.mail.ru',
        'ssdc=5d8e447c3aa546aae06edb49eb237; expires=Sun, 26 May 2019 13:24:04 GMT; path=/; domain=.auth.mail.ru; Secure; HttpOnly',
        'ssdc_info=5d8e:0:00000000; expires=Sun, 26 May 2019 13:24:04 GMT; path=/; domain=.auth.mail.ru; HttpOnly',
        't=0000000000000000000000000000000000000000000000000000000000000000000000000000000000000; expires=Sat, 24 Aug 2019 13:24:04 GMT; path=/; domain=.mail.ru'
        // tslint:enable: max-line-length
      ]
    }
  }
};
const getSdcUrlResponse = {
  info: {
    headers: {
      location: 'https://auth.mail.ru/?token=sdc-url-token'
    },
    statusCode: 302
  }
};
const getSdcTokenResponse = {
  info: {
    headers: {
      'set-cookie': [
        // tslint:disable-next-line: max-line-length
        'sdcs=0000000000000000; expires=Sun, 26 May 2019 14:45:45 GMT; path=/; domain=.cloud.mail.ru; Secure; HttpOnly'
      ]
    }
  }
};
const getCsrfTokenResponse = {
  token: ''
}

it('should return credentials for correct login and password', () => {
  const authPromise = auth('correctLogin', 'correctPassword', 'correctDomain');

  expect(request).toHaveBeenLastCalledWith({
    url: AUTH_COMMON_URL,
    query: {
      lang: 'ru_RU',
      from: 'authpop'
    },
    method: 'POST',
    data: {
      Login: 'correctLogin',
      Password: 'correctPassword',
      Domain: 'correctDomain'
    }
  });

  resolveRequestPromise(commonAuthResponse);

  return getNextTickPromise()
    .then(() => {
      expect(request).toHaveBeenLastCalledWith({
        url: AUTH_SDC_REDIRECT_URL,
        query: {
          from: 'https://cloud.mail.ru/home/'
        },
        headers: {
          Cookie: filterIncomingCookies(AUTH_SDC_REDIRECT_URL, commonAuthResponse.info.headers['set-cookie'])
        }
      });

      resolveRequestPromise(getSdcUrlResponse);

      return getNextTickPromise();
    })
    .then(() => {
      expect(request).toHaveBeenLastCalledWith({
        url: 'https://auth.mail.ru/?token=sdc-url-token',
        headers: {
          Cookie: filterIncomingCookies(
            'https://auth.mail.ru/?token=sdc-url-token',
            commonAuthResponse.info.headers['set-cookie']
          )
        }
      });

      resolveRequestPromise(getSdcTokenResponse);

      return getNextTickPromise();
    })
    .then(() => {
      expect(csrf).toHaveBeenCalledWith({
        cookies: filterIncomingCookies(API_BASE, [
          ...commonAuthResponse.info.headers['set-cookie'],
          ...getSdcTokenResponse.info.headers['set-cookie']
        ])
      });
    });
});