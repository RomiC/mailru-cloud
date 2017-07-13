const { default: auth } = require('../lib/auth');
const { upload, add } = require('../lib/file');

const file = './image.jpg';

auth('roman.charugin', 'genesis', 'mail.ru')
  .then((auth) => upload(auth, file)
    .then(({ hash, size }) => add(auth, {
      name: '//image.jpg',
      hash,
      size
    })))
  .then((res) => {
    res;
  });