const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const {
  API_FILE,
  API_FILE_ADD
} = require('./constants');
const {
  get,
  post
} = require('./request');

const info = () => {};

/**
 * Upload file to the cloud
 * @param {string} file Path+filename
 */
const add = (file) => {
  const filename = path.basename(file);
  const form = new FormData();

  form.append('file', fs.createReadStream(file), filename);
  form.append('_file', filename);

  post(
    'https://cloclo27-upload.cloud.mail.ru/upload/',
    {
      'cloud_domain': 2,
      'x-email': 'roman.charugin@mail.ru',
      'fileapi149804416817438': ''
    },
    form,
    (res) => process.stdout.write(res.toString()),
    (err) => process.stderr.write(err.message)
  );
};

module.exports = {
  info,
  add
};