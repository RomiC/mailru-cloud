import auth from '../src/auth';
import { space } from '../src/user';

import { DOMAIN, LOGIN, PASSWORD } from './credentials';
import humanReadableSize from './human-readable-size';

auth(LOGIN, PASSWORD, DOMAIN)
  .then(space)
  .then((res) => {
    process.stdout.write(`
Overquota: ${res.overquota ? 'yes' : 'no'}
Used: ${humanReadableSize(res.bytes_used)}
Total: ${humanReadableSize(res.bytes_total)}
`);
  });