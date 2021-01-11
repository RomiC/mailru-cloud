import { auth } from '../dist/index.js';

import { DOMAIN, LOGIN, PASSWORD } from './credentials.js';

(async () => {
  try {
    const { cookies, token } = await auth(LOGIN, PASSWORD, DOMAIN);
    console.log(`Auth succeed!
Cookies: ${cookies}
Token: ${token}`);
  } catch (err) {
    console.error(err);
  }
})();
