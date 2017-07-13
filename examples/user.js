const { default: auth } = require('../lib/auth');
const { space } = require('../lib/user');

auth('roman.charugin', 'genesis', 'mail.ru')
  .then(space)
  .then((res) => {
    res;
  });