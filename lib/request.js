const Promise = require('bluebird');
const https = require('https');
const { parse: parseUrl } = require('url');

/**
 * Make a request
 * @param {object} options Object with request properties
 * @param {string} options.url Request URL
 * @param {string} [options.method=GET] Request method (GET, POST, etc.) 
 * @param {object} [options.query=null] Query params
 * @param {FormData} [options.form=null] Form params
 * @param {object} [options.headers=null] Object with headers properties
 * @param {boolean} [options.json=true] Parse response as JSON
 * @param {boolean} [options.fullResponse=false] Resolve with full response instead of data
 * @return {Promise} Promise
 */
const request = ({ url, method = 'GET', query = null, form = null, headers = null, json = true, fullResponse = false }) => new Promise((resolve, reject) => {
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

module.exports = request;