const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const {
  API_FILE_UPLOAD,
  API_FILE,
  API_FILE_ADD
} = require('./constants');
const { request, requestApi } = require('./request');

/**
 * Upload file to the cloud-server
 * @param {object} auth Object with auth-properties
 * @param {string} file Path to the uploading file
 * @return {Promise} Promise
 */
const upload = (auth, file) => {
  const filename = path.basename(file);
  const form = new FormData();

  form.append('file', fs.createReadStream(file), {
    filename,
    knownLength: fs.statSync(file).size
  });
  
  return requestApi({ cookies: auth.cookies }, {
    url: API_FILE_UPLOAD,
    method: 'POST',
    form,
    json: false
  })
    .then((res) => {
      const [hash, size] = res.split(';');

      return {
        hash,
        size: parseInt(size)
      };
    });
};

const info = () => {};

/**
 * Add file to the cloud
 * @param {Object} auth Opject with auth-params
 * @param {Object} file Object with adding file params
 * @param {string} file.name Path+filename of the file on disk
 * @param {string} file.hash Hash of uploaded file (see upload function)
 * @param {number} file.size File size, could be obtained from the upload function
 * @param {string} [file.conflict='rename'] Strategy name for case if file already exists
 * @return {Promise} Promise
 */
const add = (auth, {
  name,
  hash,
  size,
  conflict = 'rename'
}) => requestApi(auth, {
  url: API_FILE_ADD,
  method: 'POST',
  data: {
    home: name,
    hash,
    size,
    conflict
  }
});

module.exports = {
  upload,
  info,
  add
};