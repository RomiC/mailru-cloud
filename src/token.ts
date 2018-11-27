import requestToApi, { IApiResponse } from './request-to-api';

import { API_TOKENS_CSRF } from './constants';

import { ICredentials } from './@types';

interface ICsrfResponse {
  /**
   * CSRF-token
   */
  token: string;
}

/**
 * Get CSRF-token
 * @param auth Object with auth-properties
 * @return Promise
 */
export async function csrf(auth: ICredentials): Promise<ICsrfResponse> {
  const { body } = await requestToApi<ICsrfResponse>(auth, {
    url: API_TOKENS_CSRF,
    method: 'POST'
  });

  return body;
}