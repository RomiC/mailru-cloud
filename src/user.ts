import Promise from 'bluebird';
import requestToApi, { IApiResponse } from './request-to-api';

import { API_USER_SPACE } from './constants';

import { ICredentials } from './@types';

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

export function space(auth: ICredentials): Promise<ISpaceResponse> {
  return requestToApi<ISpaceResponse>(auth, {
    url: API_USER_SPACE
  }).then(({ body }) => body);
}