const { default: auth } = require('../lib/auth');

auth('roman.charugin', 'genesis', 'mail.ru')
  .then((auth) => {
    auth;
  });