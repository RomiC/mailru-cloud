const { default: auth } = require('../lib/auth');
const { space } = require('../lib/user');
const { login, password, domain } = require('./credentials');

auth(login, password, domain)
  .then(space)
  .then((res) => {
    res;
  });