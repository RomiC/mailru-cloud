import { auth } from '../dist/auth.js';
import { space } from '../dist/user.js';

import { DOMAIN, LOGIN, PASSWORD } from './credentials.js';
import humanReadableSize from './human-readable-size.js';

(async () => {
  try {
    const credentials = await auth(LOGIN, PASSWORD, DOMAIN);

    const { bytes_used, bytes_total } = await space(credentials);

    console.log(`Used: ${humanReadableSize(bytes_used)}
Free: ${humanReadableSize(bytes_total - bytes_used)}
Total: ${humanReadableSize(bytes_total)}`);
  } catch (err) {
    console.error(err);
  }
})();
