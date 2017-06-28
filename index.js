const https = require('https');
const url = require('url');

const parsedUrl = url.parse('https://clouder-api.mail.ru/api/v1/create/README.md?mode=autorename');

const upload = https.request(
  Object.assign(
    parsedUrl,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'image/jpeg',
        'Authorization': 'Bearer 050b59f9ec44732780488ab9de5b74535412701537363830'
      }
    }
  ),
  (res) => {
    console.log(res.statusCode);
    let data = '';
    const {statusCode} = res;

    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      if (statusCode === 200) {
        console.log('done! ', data);
      } else {
        console.error(data);
      }
    });
  }
);

upload.on('error', console.error);

process.stdin.on('end', () => upload.end());

process.stdin
  .pipe(upload);