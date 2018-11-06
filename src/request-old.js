const Promise = require('bluebird');
const https = require('https');
const { stringify: stringifyObj } = require('querystring');
const { parse: parseUrl } = require('url');

/**
 * Make a request
 * @param {object} options Object with request properties
 * @param {string} options.url Request URL
 * @param {string} [options.method='GET'] Request method (GET, POST, etc.) 
 * @param {object} [options.query=null] Query params
 * @param {FormData} [options.form=null] Object with form-data params
 * @param {object} [options.data=null] Object with data params
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
  data = null,
  headers = null,
  json = true,
  fullResponse = false
}) => new Promise((resolve, reject) => {
  const req = https.request(
    Object.assign(
      {},
      parseUrl(url + (query !== null ? `?${stringifyObj(query)}` : '')),
      {
        method,
        headers: Object.assign({}, headers, form !== null ? {
          'Content-Type': `multipart/form-data; boundary=${form.getBoundary()}`,
          'Content-Length': form.getLengthSync()
        } : null)
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

  req.on('error', (err) => {
    reject(err);
  });

  if (form === null) {
    if (data !== null) {
      req.write(stringifyObj(data));
    }

    req.end();
  } else {
    form.pipe(req);
  }
});

/**
 * Filter cookies for the requested url
 * @param {string} url URL
 * @param {Array} cookies Array of cookies
 * @param {boolean} [stringify=true] Stringify result array
 * @return {string|array} Return filtered array or string of filtered cookies in case stringify=true
 */
const filterCookies = (url, cookies, stringify = true) => cookies
  .map((cookie) => {
    const [ nameValue, ...metaList ] = cookie.split(';');

    const [ name, value ] = nameValue.split('=');

    const meta = metaList.reduce((res, item) => {
      const [ name, value ] = item.split('=');

      res[name.trim().toLowerCase()] = value || true;

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
    if (typeof meta.expires !== 'undefined' && new Date(meta.expires).getTime() < Date.now()) {
      return false;
    }

    if (typeof meta.domain !== 'undefined' || typeof meta.path !== 'undefined') {
      const { hostname: domain, pathname: path } = parseUrl(url);

      const prefixDomain = `.${domain}`;
      // Check if cookie is fine for current domain
      if (
        typeof meta.domain !== 'undefined' &&
        prefixDomain.indexOf(meta.domain) + meta.domain.length !== prefixDomain.length
      ) {
        return false;
      }

      // Check if cookie is suitable for the current path 
      if (typeof meta.path !== 'undefined' && path.indexOf(meta.path) !== 0) {
        return false;
      }
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
 * @param {string} auth.cookies List of cookies
 * @param {string} [auth.token=''] Auth-token;
 *                                 will be added to the query params
 * @param {object} options Object with request properties
 * @param {string} options.url Request url
 * @param {string} [options.method='GET'] Request method (GET, POST etc.)
 * @param {object} [options.query=null] Object with query params of request
 * @param {FormData} [options.form=null] Object with form-data props of the request
 * @param {object} [options.data=null] Object with data props of the request
 * @param {boolean} [options.json=true] Parse response as JSON
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
    form = null,
    data = null,
    json = true
  }
) => request({
  url,
  method,
  query: (query !== null || token.length > 0) ? Object.assign({}, query, token.length > 0 ? { token } : null) : null,
  form,
  data,
  json,
  headers: {
    'Cookie': cookies,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
  }
})
  .then((res) => json ? res.body : res);

module.exports = {
  request,
  requestApi,
  filterCookies
};