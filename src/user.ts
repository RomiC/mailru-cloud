import requestToApi from './request-to-api';

import { API_USER_SPACE } from './constants';

import { ICredentials } from './auth';

interface ISpaceResponse {
  /**
   * (supposed) Is space exceeded
   */
  overquota: boolean;
  /**
   * Amount of used space (in bytes)
   */
  bytes_used: number;
  /**
   * Amount of available space (in bytes)
   */
  bytes_total: number;
}

export async function space(auth: ICredentials): Promise<ISpaceResponse> {
  const { body } = await requestToApi<ISpaceResponse>(auth, {
    url: API_USER_SPACE
  });

  return body;
}