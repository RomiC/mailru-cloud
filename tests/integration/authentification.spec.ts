import dotenv from 'dotenv';
import auth from '../../src/auth';

const MAILRU_DOMAIN = 'mail.ru';

if (process.env.TRAVIS !== 'true') {
  dotenv.config();
}

const { MAILRU_LOGIN, MAILRU_PASSWORD } = process.env;

test('should throw an error in case of wrong login or password', () => {
  return expect(auth('bad_login', 'bad_password', 'mail.ru')).rejects.toEqual(new Error('Wrong login or password'));
});

test('should authentificate user with valid login and password', () => {
  return auth(MAILRU_LOGIN, MAILRU_PASSWORD, MAILRU_DOMAIN).then((res) => {
    expect(res.cookies).toBeDefined();
    expect(res.cookies.length).toBeGreaterThan(0);
    expect(res.token).toBeDefined();
    expect(res.token.length).toBeGreaterThan(0);
  });
});