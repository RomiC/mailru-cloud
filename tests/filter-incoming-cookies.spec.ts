import filterIncomingCookies from '../src/filter-incoming-cookies';

const cookiesMock = [
  // tslint:disable: max-line-length
  'expired_cookie=val1; expires=Tue, 25 Feb 2010 13:24:04 GMT; path=/; domain=.auth.mail.ru; Secure; HttpOnly',
  'unappropriate_domain=val2; expires=Sun, 26 May 2119 13:24:04 GMT; path=/; domain=.auth.mail.ru',
  'unappropriate_path=val3; expires=Sun, 26 May 2019 13:24:04 GMT; path=/cgi-bin; domain=.mail.ru; Secure; HttpOnly'
  // tslint:enable: max-line-length
];

it('should filter expired cookies', () => {
  expect(filterIncomingCookies('https://auth.mail.ru/', cookiesMock))
    .toEqual('unappropriate_domain=val2');
});

it('should filter cookies with unappropiate domain', () => {
  expect(filterIncomingCookies('https://mail.ru/cgi-bin', cookiesMock))
    .toEqual('unappropriate_path=val3');
});

it('should filter cookies with unappropriate path', () => {
  expect(filterIncomingCookies('https://auth.mail.ru/', cookiesMock))
    .toEqual('unappropriate_domain=val2');
});