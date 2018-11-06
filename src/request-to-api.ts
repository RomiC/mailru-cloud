import Promise from 'bluebird';

import request, { IRequestOptions } from './request';

import { USER_AGENT } from './constants';

import { ICredentials } from './@types';

export type IRequestToApiOptions = Pick<IRequestOptions, 'url' | 'method' | 'query' | 'form' | 'data'>;

export interface IApiResponse<B = any> {
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

/**
 * Make a certain request to the API
 * @param auth Auth options
 * @param options Other request options
 * @return Promise
 */
export default function requestToApi<B>(
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
    data
  } = options;

  return request({
    url,
    method,
    query: {
      ...query,
      ...(token ? { token } : {})
    } ,
    form,
    data,
    headers: {
      'Cookie': cookies,
      'User-Agent': USER_AGENT
    }
  }).then(({ info, body }) => {
    try {
      const parsedData: IApiResponse<B> = JSON.parse(body);

      return parsedData;
    } catch (err) {
      return err;
    }
  });
}