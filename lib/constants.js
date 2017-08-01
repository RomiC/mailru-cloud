/**
 * Auth base url
 * @type {string}
 */
const AUTH_BASE = 'https://auth.mail.ru';

/**
 * Base Auth URL
 * @type {string}
 */
const AUTH_COMMON_URL = `${AUTH_BASE}/cgi-bin/auth`;

/**
 * Getting SDC-redirect URL
 * @type {string}
 */
const AUTH_SDC_REDIRECT_URL = `${AUTH_BASE}/sdc`;

/**
 * Base URL for eeach request
 * @type {string}
 */
const API_BASE = 'https://cloud.mail.ru/api/v2';

/**
 * Getting dispatcher data url
 * @type {string}
 */
const API_DISPATCHER = `${API_BASE}/dispatcher`;

/**
 * Getting info about file
 * @type {string}
 */
const API_FILE = `${API_BASE}/file`;

/**
 * Adding file to the cloud
 * @type {string}
 */
const API_FILE_ADD = `${API_FILE}/add`;

/**
 * Tokens-request base url
 * @type {string}
 */
const API_TOKENS = `${API_BASE}/tokens`;

/**
 * Requsting new csrf-token
 * @type {string}
 */
const API_TOKENS_CSRF = `${API_TOKENS}/csrf`;

/**
 * User info base url
 * @type {string}
 */
const API_USER = `${API_BASE}/user`;

/**
 * Getting info about user space
 * @type {string}
 */
const API_USER_SPACE = `${API_USER}/space`;

module.exports = {
  AUTH_COMMON_URL,
  AUTH_SDC_REDIRECT_URL,
  API_BASE,
  API_DISPATCHER,
  API_FILE,
  API_FILE_ADD,
  API_TOKENS_CSRF,
  API_USER,
  API_USER_SPACE
};