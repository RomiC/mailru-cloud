import Promise from 'bluebird';
import FormData from 'form-data';
import { IncomingMessage } from 'http';
import https from 'https';
import { stringify as stringifyObj } from 'querystring';
import { parse as parseUrl } from 'url';

interface IQueryParams {
  [key: string]: any;
}

interface IHeaders {
  [key: string]: any;
}

interface IRequestData {
  [key: string]: any;
}

export interface IRequestOptions {
  /**
   * URL to request
   */
  url: string;
  /**
   * Request method name
   * @default 'GET'
   */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  /**
   * Query params
   */
  query?: IQueryParams;
  /**
   * Form data
   */
  form?: FormData;
  /**
   * Request data
   */
  data?: IRequestData;
  /**
   * List of headers
   */
  headers?: IHeaders;
}

export interface IResponse {
  info: IncomingMessage;
  body?: string;
}

/**
 * Make a request
 * @param {object} options Object with request params
 * @return {Promise} Promise
 */
export default function request(options: IRequestOptions): Promise<IResponse> {
  const {
    url,
    method = 'GET',
    query,
    form,
    data,
    headers
  } = options;

  const {
    protocol,
    host,
    path
  } = parseUrl(`${url}${query != null ? `?${stringifyObj(query)}` : ''}`);

  return new Promise((resolve, reject) => {
    const req = https.request({
      protocol,
      host,
      path,
      method,
      headers: Object.assign({}, headers, form != null ? {
        'Content-Type': `multipart/form-data; boundary=${form.getBoundary()}`,
        'Content-Length': form.getLengthSync()
      } : null)
    });

    req.on('response', (res: IncomingMessage) => {
      let responseData = '';

      res.on('data', (chunk: string) => responseData += chunk);

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          resolve({
            info: res,
            body: responseData
          });
        } else {
          const err = new Error(responseData);
          err.name = res.statusCode.toString();
          throw err;
        }
      });
    });

    req.on('error', (err: Error) => {
      reject(err);
    });

    if (form != null) {
      form.pipe(req);
    } else {
      if (data != null) {
        req.write(stringifyObj(data));
      }

      req.end();
    }
  });
}