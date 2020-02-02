import requestToApi, { IApiDataResponse } from './request-to-api';

import { API_TOKENS_CSRF } from './constants';

import { ICredentials } from './auth';

interface ICsrfData {
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
export async function csrf(auth: ICredentials): Promise<ICsrfData> {
  const { body } = await requestToApi<ICsrfData>(auth, {
    url: API_TOKENS_CSRF,
    method: 'POST'
  }) as IApiDataResponse<ICsrfData>;

  return body;
}