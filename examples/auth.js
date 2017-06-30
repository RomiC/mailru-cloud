const FormData = require('form-data');

const request = require('../lib/request');

/**
 * Common auth request
 * @param {string} login User login
 * @param {string} password User password
 * @param {string} domain User email's domain
 * @return {Promise} Promise
 */
const commonAuth = (login, password, domain) => request({
  url: 'https://auth.mail.ru/cgi-bin/auth',
  query: {
    lang: 'ru_RU',
    from: 'authpop'
  },
  method: 'POST',
  json: false,
  fullResponse: true
})
  .then(({ headers }) => {
    const cookies = headers['set-cookie'];
    if (typeof cookies !== 'undefined' && cookies.length > 0) {
      return cookies;
    } else {
      throw new Error('Wrong login or password.');
    }
  });

/**
 * Get sdc-url
 * @param {Array} cookies Cookies for authentificates user
 * @return {Promise} Promise
 */
const getSdcUrl = (cookies) => request({
  url: 'https://auth.mail.ru/sdc',
  query: {
    from: 'https://cloud.mail.ru/home/'
  },
  headers: {
    Cookie: cookies.filter((cookie) => /domain=(\.auth)?\.mail\.ru/.test(cookie))
      .map((cookie) => cookie.replace(/^([^;]+);.+$/, '$1'))
      .join('; ')
  },
  json: false,
  fullResponse: true
})
  .then(({ statusCode, headers }) => {
    if (statusCode === 302 && typeof headers['Location'] !== 'undefined') {
      return {
        cookies,
        sdcUrl: headers['Location']
      };
    } else {
      throw new Error('SDC-Url is empty!');
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
    Cookie: cookies.filter((cookie) => /domain=(\.cloud)?\.mail\.ru/.test(cookie))
      .map((cookie) => cookie.replace(/^([^;]+);.+$/, '$1'))
      .join('; ')
  },
  json: false,
  fullResponse: true
})
  .then(({ headers }) => {
    const cookies = headers['set-cookie'];
    if (typeof cookies !== 'undefined' && cookies.lenght > 0) {

    }
  })

module.exports = (login, password, domain) => commonAuth(login, password, domain)
  .then(getSdcUrl)
  .then(getSdcToken);