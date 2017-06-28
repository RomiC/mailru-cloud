const FormData = require('form-data');
const { request } = require('https');
const { parse: parseUrl } = require('url');

const { post } = require('../lib/request');

const req = request(
  Object.assign({}, parseUrl('https://auth.mail.ru/cgi-bin/auth'), {
    query: {
      lang: 'ru_RU',
      from: 'authpop'
    },
    method: 'POST'
  })
);

req.on('response', (res) => {
  const cookies = res.headers['set-cookie'];
  if (cookies !== 'undefined' && cookies.lenght > 0) {
    const req = request(
      Object.assign({}, parseUrl('https://auth.mail.ru/sdc'), {
        query: {
          from: 'https://cloud.mail.ru/home/'
        },
        headers: {
          Cookie: cookies.filter((cookie) => /domain=(\.auth)?\.mail\.ru/.test(cookie))
            .map((cookie) => cookie.replace(/^([^;]+);.+$/, '$1'))
            .join('; ')
        }
      })
    );
  } else {
    throw new Error('auth failed');
  }
});

req.on('error', (err) => {
  err;
});

// const form = new FormData();
// form.append('page', 'https://cloud.mail.ru/?from=promo');
// form.append('FailPage', '');
// form.append('Domain', 'mail.ru');
// form.append('Login', 'roman.charugin');
// form.append('Password', 'genesis');
// form.append('new_auth_form', 1);
// form.append('saveauth', 1);

// form.pipe(req);

req.end('Domain=mail.ru&Login=roman.charugin&Password=genesis');