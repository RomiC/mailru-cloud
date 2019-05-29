import fs from 'fs';

import { ICredentials } from './auth';
import { API_FILE, API_FILE_ADD } from './constants';
import dispatcher from './dispatcher';
import request from './request';
import requestToApi, { IApiDataResponse } from './request-to-api';


export interface IUploadData {
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

export interface IInfoData {
  /**
   * Absolute path to the source
   */
  home: string;
  /**
   * (supposed) Source kind (file or folder)
   */
  kind: 'folder' | 'file';
  /**
   * (supposed) Source type
   */
  type: 'folder' | 'file'
  /**
   * File hash (only for files)
   */
  hash?: string;
  /**
   * File passed the virus scan
   */
  virus_scan?: 'pass';
  /**
   * Size of the file in bytes
   */
  size?: number;
  /**
   * Date of modification (Unix-timestamp)
   */
  mtime?: number;
  /**
   * Amount of files and folders, only for folder
   */
  count?: {
    files: number;
    folders: number;
  };
  /**
   * (supposed) Number of global revision of the folder
   */
  grev?: number;
  /**
   * (supposed) Number of current revision of the folder
   */
  rev?: number;
  /**
   * (supposed) Global id of the folder
   */
  tree?: 'string';
}

/**
 * Upload file to the cloud-server. It just upload file to the storage and return
 * it's hash and the size
 * @param auth Credentials
 * @param file Path to the file to upload
 * @return Promise
 */
export async function upload(auth: ICredentials, file: string) {
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

/**
 * Get info about the source (file or folder)
 * @param auth Credentials
 * @param path Path to the file in the cloud
 * @return {Promise} Promise
 */
export async function info(
  auth: ICredentials,
  path: string
): Promise<IApiDataResponse<IInfoData>> {
  const infoRes = await requestToApi(auth, {
    url: API_FILE,
    method: 'GET',
    query: {
      home: path
    }
  }) as IApiDataResponse<IInfoData>;

  return infoRes;
}