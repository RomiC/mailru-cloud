import auth from '../dist/auth.js';
import { add, upload } from '../dist/file.js';

import { DOMAIN, LOGIN, PASSWORD } from './credentials.js';

const file = './package.json';

(async () => {
  try {
    const credentials = await auth(LOGIN, PASSWORD, DOMAIN);
    const uploadData = await upload(credentials, file);
    const addData = await add(credentials, '/package.json', uploadData);

    process.stdout.write(`File '${addData} was succesfully uploaded!\n`);
  } catch (err) {
    process.stderr.write(`ERROR: ${err}\n`);
  }
})();