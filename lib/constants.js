/**
 * Base URL for eeach request
 * @type {string}
 */
const API_BASE = 'https://cloud.mail.ru/api/v2';

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
 * Tokens-request base-url
 * @type {string}
 */
const API_TOKENS = `${API_BASE}/tokens`;

/**
 * Requsting new csrf-token
 * @type {string}
 */
const API_TOKENS_CSRF = `${API_TOKENS}/csrf`;

module.exports = {
  API_FILE,
  API_FILE_ADD,
  API_TOKENS_CSRF
};