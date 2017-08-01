const { default: auth } = require('../lib/auth');
const dispatcher = require('../lib/dispatcher');

auth('roman.charugin', 'genesis', 'mail.ru')
  .then(dispatcher)
  .then((res) => {
    res;
  })
  .catch((err) => {
    err;
  });