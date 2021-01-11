import auth from '../dist/auth.js';
import { info } from '../dist/file.js';

import { DOMAIN, LOGIN, PASSWORD } from './credentials.js';
import humanReadableSize from './human-readable-size.js';

function getSourceInfo(fileInfoData) {
  return `
  path: ${fileInfoData.home}
  type: ${fileInfoData.type}
  ${fileInfoData.type === 'folder' ?
      `content: ${fileInfoData.count.files} files, ${fileInfoData.count.folders} folders` :
      `size: ${humanReadableSize(fileInfoData.size)}
  virus scan: ${fileInfoData.virus_scan}`}\n`;
}

(async () => {
  try {
    const credentials = await auth(LOGIN, PASSWORD, DOMAIN);
    const fileInfoData = await info(credentials, '/package.json');
    const folderInfoData = await info(credentials, '/');

    process.stdout.write(getSourceInfo(fileInfoData));
    process.stdout.write(getSourceInfo(folderInfoData));
  } catch (err) {
    process.stderr.write(`ERROR: ${err}\n`);
  }
})();