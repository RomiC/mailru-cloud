import Promise from 'bluebird';
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
function commonAuth(login: string, password: string, domain: string): Promise<IAuthRequestContext> {
  return request({
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
  }).then(({ info }) => {
    const cookies = info.headers['set-cookie'];

    if (cookies != null && cookies.length > 0) {
      return { cookies };
    } else {
      throw new Error('Wrong login or passwrod');
    }
  });
}

/**
 * Get sdc-url
 * @param context Auth-process context
 * @return Promise
 */
function getSdcUrl(context: IAuthRequestContext): Promise<IAuthRequestContext> {
  return request({
    url: AUTH_SDC_REDIRECT_URL,
    query: {
      from: 'https://cloud.mail.ru/home/'
    },
    headers: {
      Cookie: filterIncomingCookies(AUTH_SDC_REDIRECT_URL, context.cookies)
    }
  }).then(({ info }) => {
    const location = info.headers['location'];

    if (info.statusCode === 302 && /token=[^\&]+/.test(location)) {
      return {
        ...context,
        sdcUrl: location
      };
    } else {
      throw new Error('Failed too get SDC-url');
    }
  });
}

/**
 * Get sdc-token
 * @param context Auth-proccess context
 * @return Promise
 */
function getSdcToken(context: IAuthRequestContext): Promise<IAuthRequestContext> {
  return request({
    url: context.sdcUrl,
    headers: {
      Cookie: filterIncomingCookies(context.sdcUrl, context.cookies)
    }
  }).then(({ info }) => {
    const cookies = info.headers['set-cookie'];

    if (cookies != null && cookies.length > 0) {
      return {
        ...context,
        cookies: [
          ...context.cookies,
          ...cookies
        ]
      };
    } else {
      throw new Error('Failed to get sdc-token');
    }
  });
}

/**
 * Obtain CSRF-token
 * @param context Auth-proccess context
 */
function getCsrfToken(context: IAuthRequestContext): Promise<IAuthRequestContext> {
  return csrf({
    cookies: filterIncomingCookies(API_BASE, context.cookies)
  }).then((res) => ({
    ...context,
    token: res.token
  }));
}

/**
 * Authorize user and obtain credentials for the API
 * @param login User's login
 * @param password User's password
 * @param domain User's mail domain (mail.ru, bk.ru, etc.)
 * @return Promise
 */
export default function auth(login: string, password: string, domain: string): Promise<ICredentials> {
  return commonAuth(login, password, domain)
    .then(getSdcUrl)
    .then(getSdcToken)
    .then(getCsrfToken)
    .then((context) => ({
      cookies: filterIncomingCookies(API_BASE, context.cookies),
      token: context.token
    }));
}