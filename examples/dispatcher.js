const { default: auth } = require('../lib/auth');
const dispatcher = require('../lib/dispatcher');
const { login, password, domain } = require('./credentials');

auth(login, password, domain)
  .then(dispatcher)
  .then((res) => {
    res;
  })
  .catch((err) => {
    err;
  });