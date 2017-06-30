const FormData = require('form-data');
const Promise = require('bluebird');
const https = require('https');
const { parse: parseUrl } = require('url');

/**
 * Make a request
 * @param {object} options Object with request properties
 * @param {string} options.url Request URL
 * @param {string} [options.method='GET'] Request method (GET, POST, etc.) 
 * @param {object} [options.query=null] Query params
 * @param {object} [options.form=null] Object with form-data params
 * @param {object} [options.headers=null] Object with headers properties
 * @param {boolean} [options.json=true] Parse response as JSON
 * @param {boolean} [options.fullResponse=false] Resolve with full response instead of data
 * @return {Promise} Promise
 */
const request = ({
  url,
  method = 'GET',
  query = null,
  form = null,
  headers = null,
  json = true,
  fullResponse = false
}) => new Promise((resolve, reject) => {
  const req = https.request(
    Object.assign(
      {},
      parseUrl(url),
      {
        method,
        query,
        headers
      }
    )
  );

  req.on('response', (res) => {
    let data = '';

    res.on('data', (chunk) => data += chunk);

    res.on('end', () => {
      try {
        const parsedData = json ? JSON.parse(data) : data;

        if (res.statusCode >= 200 && res.statusCode < 400) { 
          resolve(fullResponse ? res : parsedData);
        } else {
          const err = new Error(data);
          err.name = res.statusCode;
          throw err;
        }
      } catch (err) {
        reject(err);
      }
    });
  });

  req.on('error', reject);

  if (form !== null) {
    form.pipe(req);
  } else {
    req.end();
  }
});

/**
 * Filter cookies for the requested url
 * @param {string} url URL
 * @param {Array} cookies Array of cookies
 * @param {boolean} [stringify=false] Stringify result array
 * @return {string|array} Return filtered array or string of filtered cookies in case stringify=true
 */
const filterCookies = (url, cookies, stringify = true) => cookies
  .map((cookie) => {
    const [ nameValue, ...metaList ] = cookie.split(';');

    const [ name, value ] = nameValue.split('=');

    const meta = metaList.reduce((res, item) => {
      const [ name, value ] = res.split('=');

      res[name.trim().toLowerCase()] = value;

      return res;
    }, {});

    return {
      name,
      value,
      meta
    };
  })
  .filter(({ meta }) => {
    // Check if cookie hasn't being expired yet
    if (typeof meta.expires !== 'undefined' && new Date(meta.expires).getTime() > Date.now()) {
      return false;
    }

    // Check if cookie is suitable for current domain
    if (typeof meta.domain !== 'undefined' && url.indexOf(meta.domain) === -1) {
      return false;
    }

    // Check if cookie is suitable for the current path 
    if (typeof meta.path !== 'undefined' && parseUrl(url).path.indexOf(meta.path) !== 0) {
      return false;
    }

    return true;
  })
  .reduce((res, cookie, index) => {
    if (stringify) {
      res += `${index === 0 ? '' : '; '}${cookie.name}=${cookie.value}`;
    } else {
      res.push(`${cookie.name}=${cookie.value}`);
    }
    
    return res;
  }, stringify ? '' : []);

/**
 * Make authentificated request to the API
 * @param {object} auth Object with auth.props
 * @param {array} auth.cookies Array with cookies;
 *                             should contain at least sdsc and Mpop cookies
 * @param {string} [auth.token=''] Auth-token;
 *                                 will be added to the query params
 * @param {object} options Object with request properties
 * @param {string} options.url Request url
 * @param {string} [options.method='GET'] Request method (GET, POST etc.)
 * @param {object} [options.query=null] Object with query params of request
 * @param {object} [options.word=null] Object with FormData props of the request
 * @return {Promise} Promise
 */
const requestApi = (
  {
    cookies,
    token = ''
  },
  {
    url,
    method = 'GET',
    query = null,
    form = null
  }
) => request({
  url,
  method,
  query: Object.assign({}, query, { token }),
  form,
  headers: {
    Cookie: filterCookies(url, cookies)
  }
});

module.exports = {
  request,
  requestApi,
  filterCookies
};