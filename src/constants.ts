/**
 * Auth base url
 */
export const AUTH_BASE = 'https://auth.mail.ru';

/**
 * Base Auth URL
 */
export const AUTH_COMMON_URL = `${AUTH_BASE}/cgi-bin/auth`;

/**
 * Getting SDC-redirect URL
 */
export const AUTH_SDC_REDIRECT_URL = `${AUTH_BASE}/sdc`;

/**
 * Base URL for eeach request
 */
export const API_BASE = 'https://cloud.mail.ru/api/v2';

/**
 * Getting dispatcher data url
 */
export const API_DISPATCHER = `${API_BASE}/dispatcher`;

/**
 * Getting info about file
 */
export const API_FILE = `${API_BASE}/file`;

/**
 * Adding file to the cloud
 */
export const API_FILE_ADD = `${API_FILE}/add`;

/**
 * Tokens-request base url
 */
export const API_TOKENS = `${API_BASE}/tokens`;

/**
 * Requsting new csrf-token
 */
export const API_TOKENS_CSRF = `${API_TOKENS}/csrf`;

/**
 * User info base url
 */
export const API_USER = `${API_BASE}/user`;

/**
 * Getting info about user space
 */
export const API_USER_SPACE = `${API_USER}/space`;

/**
 * User-Agent
 */
// tslint:disable-next-line:max-line-length
export const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36';