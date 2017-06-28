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

module.exports = {
  API_FILE,
  API_FILE_ADD
};