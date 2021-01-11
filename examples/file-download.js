import auth from '../dist/auth.js';
import { download } from '../dist/file.js';

import { DOMAIN, LOGIN, PASSWORD } from './credentials.js';

const file = '/test/image.png';

auth(LOGIN, PASSWORD, DOMAIN)
  .then((cred) => credentials = cred)
  .then(() => download(credentials, file))
  .then((filename) => {
    process.stdout.write(`File '${filename} was successfully downloaded\n`);
  })
  .catch((error) => {
    process.stderr.write(error);
  });