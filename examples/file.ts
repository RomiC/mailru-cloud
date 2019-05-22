import auth from '../src/auth';
import { upload, info, add } from '../src/file';
import { LOGIN, PASSWORD, DOMAIN } from './credentials';

const file = '../package.json';

auth(LOGIN, PASSWORD, DOMAIN)
  .then()