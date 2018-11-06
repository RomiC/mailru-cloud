const { default: auth } = require('../lib/auth');
const { LOGIN, PASSWORD, DOMAIN } = require('./credentials');

auth(LOGIN, PASSWORD, DOMAIN)
  .then((auth) => {
    auth;
  });