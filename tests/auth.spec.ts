import { promisify } from 'util';
import auth from '../src/auth';
import { API_BASE, AUTH_COMMON_URL, AUTH_SDC_REDIRECT_URL } from '../src/constants';
import filterIncomingCookies from '../src/filter-incoming-cookies';
import request, { rejectRequestPromise, resolveRequestPromise } from '../src/request';
import { csrf, rejectCsrfPromise, resolveCsrfPromise } from '../src/token';

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
  token: 'csrf-token'
};

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

      resolveCsrfPromise(getCsrfTokenResponse);

      return authPromise;
    })
    .then((res) => {
      expect(res).toEqual({
        // tslint:disable-next-line: max-line-length
        cookies: 'Mpop=1551101044:0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000:roman.charugin@mail.ru:;t=0000000000000000000000000000000000000000000000000000000000000000000000000000000000000;sdcs=0000000000000000',
        token: getCsrfTokenResponse.token
      });
    });
});

describe('commonAuth()', () => {
  it('should reject promise on commonAuth request failed', () => {
    const authPromise = auth('wrong_login', 'wrong_pasword', 'mail.ru');
    const err = new Error('Failed to connect to the server!');

    rejectRequestPromise(err);

    return expect(authPromise).rejects.toBe(err);
  });

  it('should reject promise when commonAuth returns no cookies', () => {
    const authPromise = auth('wrong_login', 'wrong_password', 'mail.ru');

    resolveRequestPromise({ info: { headers: {} } });

    return expect(authPromise).rejects.toEqual(new Error('Wrong login or password'));
  });

  it('should reject promise when commonAuth returns cookies array is empty', () => {
    const authPromise = auth('wrong_login', 'wrong_password', 'mail.ru');

    resolveRequestPromise({ info: { headers: { cookies: [] } } });

    return expect(authPromise).rejects.toEqual(new Error('Wrong login or password'));
  });
});

describe('getSdcUrl()', () => {
  it('should reject promise when getSdcUrl request failed', () => {
    const authPromise = auth('login', 'password', 'mail.ru');

    resolveRequestPromise(commonAuthResponse);

    return getNextTickPromise().then(() => {
      const err = new Error('Failed to connect to the server!');
      rejectRequestPromise(err);

      return expect(authPromise).rejects.toBe(err);
    });
  });

  it('should reject promise when getSdcUrl doesn\'t return redirect status', () => {
    const authPromise = auth('login', 'password', 'mail.ru');

    resolveRequestPromise(commonAuthResponse);

    return getNextTickPromise().then(() => {
      resolveRequestPromise({ info: { statusCode: 400, headers: {} } });

      return expect(authPromise).rejects.toEqual(new Error('Failed to get SDC-url'));
    });
  });

  it('should reject promise when getSdcUrl returns redirect location without token', () => {
    const authPromise = auth('login', 'password', 'mail.ru');

    resolveRequestPromise(commonAuthResponse);

    return getNextTickPromise().then(() => {
      resolveRequestPromise({ info: { statusCode: 400, headers: { location: 'https://example.com' } } });

      return expect(authPromise).rejects.toEqual(new Error('Failed to get SDC-url'));
    });
  });
});

describe('getSdcToken()', () => {
  it('should reject promise when getSdcToken-request failed', () => {
    const authPromise = auth('login', 'password', 'mail.ru');

    resolveRequestPromise(commonAuthResponse);

    return getNextTickPromise()
      .then(() => {
        resolveRequestPromise(getSdcUrlResponse);

        return getNextTickPromise();
      })
      .then(() => {
        const err = new Error('Failed to connect to the server!');
        rejectRequestPromise(err);

        return expect(authPromise).rejects.toBe(err);
      });
  });

  it('should reject promise when getSdcToken returns no cookies', () => {
    const authPromise = auth('login', 'password', 'mail.ru');

    resolveRequestPromise(commonAuthResponse);

    return getNextTickPromise()
      .then(() => {
        resolveRequestPromise(getSdcUrlResponse);

        return getNextTickPromise();
      })
      .then(() => {
        resolveRequestPromise({ info: { headers: {} } });

        return expect(authPromise).rejects.toEqual(new Error('Failed to get sdc-token'));
      });
  });

  it('should reject promise when getSdcToken returns empty cookies array', () => {
    const authPromise = auth('login', 'password', 'mail.ru');

    resolveRequestPromise(commonAuthResponse);

    return getNextTickPromise()
      .then(() => {
        resolveRequestPromise(getSdcUrlResponse);

        return getNextTickPromise();
      })
      .then(() => {
        resolveRequestPromise({ info: { headers: { 'set-cookie': [] } } });

        return expect(authPromise).rejects.toEqual(new Error('Failed to get sdc-token'));
      });
  });
});

describe('getCsrfToken()', () => {
  it('should reject promise when getCsrfToken request failed', () => {
    const authPromise = auth('login', 'password', 'mail.ru');

    resolveRequestPromise(commonAuthResponse);

    return getNextTickPromise()
      .then(() => {
        resolveRequestPromise(getSdcUrlResponse);

        return getNextTickPromise();
      })
      .then(() => {
        resolveRequestPromise(getSdcTokenResponse);

        return getNextTickPromise();
      })
      .then(() => {
        const err = new Error('Failed to connect to the server');

        rejectCsrfPromise(err);

        return expect(authPromise).rejects.toBe(err);
      });
  });

  it('should reject promise when getCsrfToken returns no token', () => {
    const authPromise = auth('login', 'password', 'mail.ru');

    resolveRequestPromise(commonAuthResponse);

    return getNextTickPromise()
      .then(() => {
        resolveRequestPromise(getSdcUrlResponse);

        return getNextTickPromise();
      })
      .then(() => {
        resolveRequestPromise(getSdcTokenResponse);

        return getNextTickPromise();
      })
      .then(() => {
        resolveCsrfPromise(null);

        return expect(authPromise).rejects.toBeInstanceOf(Error);
      });
  });

  it('should reject promise when getCsrfToken returns empty token', () => {
    const authPromise = auth('login', 'password', 'mail.ru');

    resolveRequestPromise(commonAuthResponse);

    return getNextTickPromise()
      .then(() => {
        resolveRequestPromise(getSdcUrlResponse);

        return getNextTickPromise();
      })
      .then(() => {
        resolveRequestPromise(getSdcTokenResponse);

        return getNextTickPromise();
      })
      .then(() => {
        resolveCsrfPromise({});

        return expect(authPromise).rejects.toEqual(new Error('Failed to get CSRF-token'));
      });
  });

  it('should reject promise when getCsrfToken returns null as token', () => {
    const authPromise = auth('login', 'password', 'mail.ru');

    resolveRequestPromise(commonAuthResponse);

    return getNextTickPromise()
      .then(() => {
        resolveRequestPromise(getSdcUrlResponse);

        return getNextTickPromise();
      })
      .then(() => {
        resolveRequestPromise(getSdcTokenResponse);

        return getNextTickPromise();
      })
      .then(() => {
        resolveCsrfPromise({ token: null });

        return expect(authPromise).rejects.toEqual(new Error('Failed to get CSRF-token'));
      });
  });

  it('should reject promise when getCsrfToken returns empty string as a token', () => {
    const authPromise = auth('login', 'password', 'mail.ru');

    resolveRequestPromise(commonAuthResponse);

    return getNextTickPromise()
      .then(() => {
        resolveRequestPromise(getSdcUrlResponse);

        return getNextTickPromise();
      })
      .then(() => {
        resolveRequestPromise(getSdcTokenResponse);

        return getNextTickPromise();
      })
      .then(() => {
        resolveCsrfPromise({ token: '' });

        return expect(authPromise).rejects.toEqual(new Error('Failed to get CSRF-token'));
      });
  });
});
