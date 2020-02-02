import auth from '../src/auth';

import { DOMAIN, LOGIN, PASSWORD } from './credentials';

auth(LOGIN, PASSWORD, DOMAIN)
  .then((credentials) => {
    process.stdout.write(`
Auth succeed!
Cookies: ${credentials.cookies}
Token: ${credentials.token}
`);
  })
  .catch((err: Error) => {
    process.stderr.write(err.message);
  });