import auth from '../src/auth';
import { add, upload } from '../src/file';

import { DOMAIN, LOGIN, PASSWORD } from './credentials';

const file = './package.json';

(async () => {
  try {
    const credentials = await auth(LOGIN, PASSWORD, DOMAIN);
    const uploadData = await upload(credentials, file);
    const res = await add(credentials, '/package.json', uploadData);

    process.stdout.write(`File '${res.body} was succesfully uploaded!\n`);
  } catch (err) {
    process.stderr.write(`ERROR: ${err}\n`);
  }
})();