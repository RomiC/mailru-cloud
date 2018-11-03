const { default: auth } = require('../lib/auth');
const { login, password, domain } = require('./credentials');

auth(login, password, domain)
  .then((auth) => {
    auth;
  });