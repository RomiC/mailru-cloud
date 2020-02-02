import auth, { ICredentials } from '../src/auth';
import { download } from '../src/file';

import { DOMAIN, LOGIN, PASSWORD } from './credentials';

const file = '/testest/image.png';

let credentials: ICredentials = null;

auth(LOGIN, PASSWORD, DOMAIN)
  .then((cred) => credentials = cred)
  .then(() => {
    return download(credentials, file);
  })
  .then((filename) => {
    process.stdout.write(`File '${filename} was successfully downloaded\n`);
  })
  .catch((error) => {
    process.stderr.write(error);
  });