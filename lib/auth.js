const { filterCookies, request } = require('./request');
const { csrf } = require('./token');

const {
  AUTH_COMMON_URL,
  AUTH_SDC_REDIRECT_URL,
  API_BASE
} = require('./constants');

/**
 * Common auth request
 * @param {string} login User login
 * @param {string} password User password
 * @param {string} domain User email's domain
 * @return {Promise} Promise
 */
const commonAuth = (login, password, domain) => {
  return request({
    url: AUTH_COMMON_URL,
    query: {
      lang: 'ru_RU',
      from: 'authpop'
    },
    method: 'POST',
    data: {
      Login: login,
      Password: password,
      Domain: domain
    },
    json: false,
    fullResponse: true
  })
    .then(({ headers }) => {
      const setCookies = headers['set-cookie'];
      if (typeof setCookies !== 'undefined' && setCookies.length > 0) {
        return setCookies;
      } else {
        throw new Error('Wrong login or password');
      }
    });
}

/**
 * Get sdc-url
 * @param {Array} cookies Cookies for authentificates user
 * @return {Promise} Promise
 */
const getSdcUrl = (cookies) => request({
  url: AUTH_SDC_REDIRECT_URL,
  query: {
    from: 'https://cloud.mail.ru/home/'
  },
  headers: {
    'Cookie': filterCookies(AUTH_SDC_REDIRECT_URL, cookies)
  },
  json: false,
  fullResponse: true
})
  .then(({ statusCode, headers }) => {
    const location = headers['location'];

    if (statusCode === 302 && /token=[^\&]+/.test(location)) {
      return {
        cookies,
        sdcUrl: location
      };
    } else {
      throw new Error('Failed too get SDC-url');
    }
  });

/**
 * Get sdc-token
 * @param {object} options Object with cookies and sdcurl to follow
 * @param {Array} options.cookies Array with cookies
 * @param {string} options.sdcUrl SDC-Url to follow
 * @return {Promise} Promise
 */
const getSdcToken = ({ cookies, sdcUrl }) => request({
  url: sdcUrl,
  headers: {
    'Cookie': filterCookies(sdcUrl, cookies)
  },
  json: false,
  fullResponse: true
})
  .then(({ headers }) => {
    const setCookies = headers['set-cookie'];
    if (typeof setCookies !== 'undefined' && setCookies.length > 0) {
      return { cookies: [...cookies, ...setCookies] };
    } else {
      throw new Error('Failed to get sdc-token');
    }
  });

/**
 * Get auth object
 * @param {object} options Object with cookies
 * @param {Array} options.cookies Array with cookies
 * @return {Promise} Promise
 */
const getAuth = ({ cookies }) => csrf({ cookies })
  .then(({ token }) => ({
    cookies: filterCookies(API_BASE, cookies),
    token
  }));

module.exports = {
  default: (login, password, domain) => commonAuth(login, password, domain)
    .then(getSdcUrl)
    .then(getSdcToken)
    .then(getAuth),
  commonAuth,
  getSdcUrl,
  getSdcToken,
  getAuth
};