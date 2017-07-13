const { requestApi } = require('./request');

const { API_USER_SPACE } = require('./constants');
/**
 * Info about user drive's available space
 * @typedef {object} UserSpace
 * @property {boolean} overquota Flag indicates that disk is full
 * @property {number} used Used space in KB
 * @property {number} total Total available space in KB
 */

/**
 * Getting info about user drive's space
 * @param {object} auth Object with auth properties
 * @param {Promise.<UserSpace,Error>} Info about user space if fullfilled,
 * or rejected with an error
 */
const space = (auth) => requestApi(auth, { url: API_USER_SPACE });

module.exports = {
  space
};