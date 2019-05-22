import fs from 'fs';
import FormData from 'form-data';
import path from 'path';

import { ICredentials } from './auth';
import dispatcher from './dispatcher';
import requestToApi from './request-to-api';

import { API_FILE_ADD } from './constants';

interface UploadResponse {
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
 * Upload file to the cloud-server. It just upload file to the storage and return
 * it's hash and the size
 * @param auth Credentials
 * @param file Path to the file to upload
 * @return Promise
 */
export async function upload(auth: ICredentials, file: string) {
  const filename = path.basename(file);
  const form = new FormData();

  form.append('file', fs.createReadStream(file), {
    filename,
    knownLength: fs.statSync(file).size
  });

  const { upload: uploadResource } = await dispatcher(auth);
  const fileInfo = await requestToApi(auth, {
    url: uploadResource[0].url,
    method: 'POST',
    form,
    json: false
  }) as string;
  const [hash, size] = fileInfo.split(';');

  return {
    hash,
    size: parseInt(size, 10)
  };
}