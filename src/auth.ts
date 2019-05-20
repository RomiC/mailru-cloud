import { IncomingHttpHeaders, IncomingMessage } from 'http';

import filterIncomingCookies from './filter-incoming-cookies';
import request from './request';

import { ICredentials } from './@types';

import {
  API_BASE,
  AUTH_COMMON_URL,
  AUTH_SDC_REDIRECT_URL
} from './constants';
import { csrf } from './token';

interface IAuthRequestContext {
  cookies?: IncomingHttpHeaders['set-cookie'];
  sdcUrl?: string;
  token?: string;
}

/**
 * Common auth request
 * @param login User login
 * @param password User password
 * @param domain User email's domain
 * @return Promise
 */
async function commonAuth(login: string, password: string, domain: string): Promise<IAuthRequestContext> {
  const { info } = await request({
    url: AUTH_COMMON_URL,
    query: {
      lang: 'ru_RU',
      from: 'authpop'
    },
    method: 'POST',
    data: {
      Login: login,
      Password: password,
      Domain: domain
    }
  });

  const cookies = info.headers['set-cookie'];

  if (!cookies || cookies.length === 0) {
    throw new Error('Wrong login or password');
  }

  return { cookies };
}

/**
 * Get sdc-url
 * @param context Auth-process context
 * @return Promise
 */
async function getSdcUrl(context: IAuthRequestContext): Promise<IAuthRequestContext> {
  const { info } = await request({
    url: AUTH_SDC_REDIRECT_URL,
    query: {
      from: 'https://cloud.mail.ru/home/'
    },
    headers: {
      Cookie: filterIncomingCookies(AUTH_SDC_REDIRECT_URL, context.cookies)
    }
  });

  const location = info.headers['location'];

  if (info.statusCode !== 302 || !/token=[^\&]+/.test(location)) {
    console.log(info.statusCode, info.headers);
    throw new Error('Failed to get SDC-url');
  }

  return {
    ...context,
    sdcUrl: location
  };
}

/**
 * Get sdc-token
 * @param context Auth-proccess context
 * @return Promise
 */
async function getSdcToken(context: IAuthRequestContext): Promise<IAuthRequestContext> {
  const { info } = await request({
    url: context.sdcUrl,
    headers: {
      Cookie: filterIncomingCookies(context.sdcUrl, context.cookies)
    }
  });

  const cookies = info.headers['set-cookie'];

  if (!cookies || cookies.length === 0) {
    throw new Error('Failed to get sdc-token');
  }

  return {
    ...context,
    cookies: [
      ...context.cookies,
      ...cookies
    ]
  };
}

/**
 * Obtain CSRF-token
 * @param context Auth-proccess context
 */
async function getCsrfToken(context: IAuthRequestContext): Promise<IAuthRequestContext> {
  const { token } = await csrf({
    cookies: filterIncomingCookies(API_BASE, context.cookies)
  });

  if (!token) {
    throw new Error('Failed to get CSRF-token');
  }

  return {
    ...context,
    token
  };
}

/**
 * Authorize user and obtain credentials for the API
 * @param login User's login
 * @param password User's password
 * @param domain User's mail domain (mail.ru, bk.ru, etc.)
 * @return Promise
 */
export default async function auth(login: string, password: string, domain: string): Promise<ICredentials> {
  const context = await commonAuth(login, password, domain)
    .then(getSdcUrl)
    .then(getSdcToken)
    .then(getCsrfToken);

  return {
    cookies: filterIncomingCookies(API_BASE, context.cookies),
    token: context.token
  };
}