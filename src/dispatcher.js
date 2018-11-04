const { requestApi } = require('./request');

const { API_DISPATCHER } = require('./constants');

const dispatcher = (auth) => requestApi(auth, {
  url: API_DISPATCHER
});

module.exports = dispatcher;