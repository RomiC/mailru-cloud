import request, { IRequestOptions } from './request';

import { USER_AGENT } from './constants';

import { ICredentials } from './auth';

export type IRequestToApiOptions = Pick<
  IRequestOptions,
  'url' | 'method' | 'query' | 'form' | 'data'
> & { json?: boolean };

export interface IApiDataResponse<B> {
  /**
   * Current user email
   */
  email: string;
  /**
   * Response body
   */
  body: B;
  /**
   * (supposed) Server time
   */
  time: number;
  /**
   * Response status
   */
  status: number;
}

export type IApiResponse<B> = IApiDataResponse<B> | string;

/**
 * Make a certain request to the API
 *
 * @param auth Auth options
 * @param options Other request options
 * @return Promise
 */
export default async function requestToApi<B>(
  auth: ICredentials,
  options: IRequestToApiOptions
): Promise<IApiResponse<B>> {
  const {
    cookies,
    token
  } = auth;
  const {
    url,
    method = 'GET',
    query = {},
    form,
    data,
    json = true
  } = options;

  try {
    const { body } = await request({
      url,
      method,
      query: {
        ...query,
        ...(token ? { token } : {})
      },
      form,
      data,
      headers: {
        'Cookie': cookies,
        'User-Agent': USER_AGENT
      }
    });

    /**
     * TODO: Add handlers for the following cases:
     * - ok: 200,
     * - redirect: 302,
     * - notmodified: 304,
     * - invalid: 400,
     * - paymentRequired: 402,
     * - denied: 403,
     * - notfound: 404,
     * - unacceptable: 406,
     * - timeout: 408,
     * - conflict: 409,
     * - unprocessable: 422,
     * - failedDependency: 424,
     * - manyRequests: 429,
     * - retryWith: 449,
     * - blockedContent: 451,
     * - fail: 500,
     * - notImplemented: 501,
     * - unavailable: 503,
     * - insufficient: 507,
     */

    if (json === true && !!body) {
      const parsedData: IApiResponse<B> = JSON.parse(body) as IApiResponse<B>;

      return parsedData;
    } else {
      return body;
    }
  } catch (err) {
    return Promise.reject(err);
  }
}