import auth from '../src/auth';
import dispatcher from '../src/dispatcher';

import { DOMAIN, LOGIN, PASSWORD } from './credentials';

auth(LOGIN, PASSWORD, DOMAIN)
  .then(dispatcher)
  .then((res) => {
    process.stdout.write(`
Upload link: ${res.upload[0].url}
Download link: ${res.get[0].url}
`);
  })
  .catch((err) => {
    process.stderr.write(err.message);
  });