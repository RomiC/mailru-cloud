import Promise from 'bluebird';
import { ServerResponse } from 'http';
import https from 'https';
import { stringify as stringifyObj } from 'querystring';
import { parse as parseUrl } from 'url';

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
const request: (options: IRequestOptions) => Promise<any> = ({
  url,
  method = 'GET',
  query,
  form,
  data,
  headers,
  json = true,
  fullResponse = false
}) => new Promise((resolve, reject) => {
  const req = https.request({
    ...parseUrl(url + (query != null ? `?${stringifyObj(query)}` : '')),
    method,
    headers: Object.assign({}, headers, form != null ? {
      'Content-Type': `multipart/form-data; boundary=${form.getBoundary()}`,
      'Content-Length': form.getLengthSync()
    } : null)
  });

  req.on('response', (res: ServerResponse) => {
    let data = '';

    res.on('data', (chunk: string) => data += chunk);

    res.on('end', () => {
      try {
        const parsedData = json ? JSON.parse(data) : data;

        if (res.statusCode >= 200 && res.statusCode < 400) { 
          resolve(fullResponse ? res : parsedData);
        } else {
          const err = new Error(data);
          err.name = res.statusCode.toString();
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