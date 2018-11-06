import auth from '../src/auth';

import { DOMAIN, LOGIN, PASSWORD } from './credentials';

auth(LOGIN, PASSWORD, DOMAIN)
  .then((credentials) => {
    // tslint:disable-next-line:no-console
    console.log('auth success!', credentials);
  })
  .catch((err: Error) => {
    // tslint:disable-next-line:no-console
    console.error(err);
  });