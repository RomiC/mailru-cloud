const { requestApi } = require('./request');

const { API_TOKENS_CSRF } = require('./constants');

/**
 * Get CSRF-token
 * @param {object} auth Object with auth-properties
 * @return {Promise} Promise
 */
const csrf = (auth) => requestApi(auth, {
  url: API_TOKENS_CSRF,
  method: 'POST'
});

module.exports = {
  csrf
};