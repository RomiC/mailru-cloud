import auth from '../src/auth';
import { space } from '../src/user';

import { DOMAIN, LOGIN, PASSWORD } from './credentials';

function humanReadableSize(bytes: number): string {
  const names: string[] = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

  let rest = bytes;

  for (const size in names) {
    if (rest > 1024) {
      rest = Number((rest / 1024).toPrecision(3));
    } else {
      return `${rest} ${names[size]}`;
    }
  }

  return `${rest} ${names[names.length - 1]}`;
}

auth(LOGIN, PASSWORD, DOMAIN)
  .then(space)
  .then((res) => {
    process.stdout.write(`
Overquota: ${res.overquota ? 'yes' : 'no'}
Used: ${humanReadableSize(res.bytes_used)}
Total: ${humanReadableSize(res.bytes_total)}
`);
  });