import requestToApi from './request-to-api';

import { API_DISPATCHER } from './constants';

import { ICredentials } from './@types';

interface IEndpoint {
  /**
   * (supposed) Requests limit
   */
  count: number;
  /**
   * Endpoint url
   */
  url: string;
}

interface IDispatcherResponse {
  /**
   * (supposed) Video streaming endpoints
   */
  video: IEndpoint[];
  /**
   * (supposed) Direct links for image
   */
  weblink_view: IEndpoint[];
  /**
   * (supposed) Direct links for video
   */
  weblink_video: IEndpoint[];
  /**
   * Direct links to download file
   */
  weblink_get: IEndpoint[];
  /**
   * (supposed) Direct links for the image thumbnails
   */
  weblink_thumbnails: IEndpoint[];
  /**
   * Auth links
   */
  auth: IEndpoint[];
  /**
   * (supposed) Links to view image
   */
  view: IEndpoint[];
  /**
   * (supposed) Links to download file
   */
  get: IEndpoint[];
  /**
   * Links to upload file
   */
  upload: IEndpoint[];
  /**
   * Links to the thumbnails
   */
  thumbnails: IEndpoint[];
  /**
   * (supposed) Links to share an image
   */
  stock: IEndpoint[];
}

/**
 * Get dispatcher info
 * @param auth Object with auth-properties
 * @return Promise
 */
export async function dispatcher(auth: ICredentials): Promise<IDispatcherResponse> {
  const { body } = await requestToApi<IDispatcherResponse>(auth, {
    url: API_DISPATCHER
  });

  return body;
}