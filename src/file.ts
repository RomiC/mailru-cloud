import fs from 'fs';

import { ICredentials } from './auth';
import dispatcher from './dispatcher';
import request from './request';
import requestToApi, { IApiDataResponse, IApiResponse } from './request-to-api';

import { API_FILE_ADD } from './constants';

interface IUploadData {
  /**
   * Uploaded file hash
   */
  hash: string;
  /**
   * Uploaded file size
   */
  size: number;
}

/**
 * Path+name of saved file
 */
type IAddData = string;

/**
 * Upload file to the cloud-server. It just upload file to the storage and return
 * it's hash and the size
 * @param auth Credentials
 * @param file Path to the file to upload
 * @return Promise
 */
export async function upload(auth: ICredentials, file: string) {
  // const filename = path.basename(file);
  // const form = new FormData();

  // form.append('file', , {
  //   filename,
  //   knownLength: fs.statSync(file).size
  // });

  const { size: fileSize } = fs.statSync(file);

  const { upload: uploadResource } = await dispatcher(auth);
  const fileInfo = await request({
    url: uploadResource[0].url,
    method: 'PUT',
    data: fs.createReadStream(file),
    headers: {
      'Cookie': auth.cookies,
      'Content-Length': fs.statSync(file).size,
      'X-Requested-With': 'XMLHttpRequest'
    },
    query: {
      'x-email': auth.email
    }
  });
  const hash = fileInfo.body;

  return {
    hash,
    size: fileSize
  };
}

export type ConflictResolveStrategy = 'strict' | 'rename' | 'rewrite' | 'ignore';

/**
 * Add uploaded file to the cloud
 * @param auth Credentials
 * @param name Path+filename of the file on the disk
 * @param uploadData Uploaded file
 * @param conflict Strategy name for the case when file with the same name already exists
 * @return {Promise} Promise
 */
export async function add(
  auth: ICredentials,
  name: string,
  uploadData: IUploadData,
  conflict: ConflictResolveStrategy = 'rename'
): Promise<IApiDataResponse<IAddData>> {
  const addRes = await requestToApi(auth, {
    url: API_FILE_ADD,
    method: 'POST',
    data: {
      home: name,
      hash: uploadData.hash,
      size: uploadData.size,
      conflict
    }
  }) as IApiDataResponse<IAddData>;

  return addRes;
}