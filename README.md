# Mail.ru Cloud service library

This library provides the methods to work with your [Mail.ru-cloud](https://cloud.mail.ru)-account.

⚠️ Due to Mail.ru-cloud service doesn't support authentification via OAuth or token, **you'll have 
to provide the login and password** from you Mail.ru-account for each request.

## Methods

### Authentification

#### `auth(login, password, domain) => Promise`

Authorize user using provided login, password and domain. It returns, 
so called, _Credentials_ - an object combines cookies and token, which are necessary
for the futher requests. `auth`-method is trying to emulate the web
authentification of Mail.ru services.

**Parameters**

* `login {string}` – user login, first part of email, without domain
* `password {string}` – user password
* `domain {string}` – second part of an email, i.e. `mail.ru`

**Example**

```ts
import {auth, user} from 'mailru-cloud';

auth('mylogin', 'mypassword', 'mail.ru')
  .then(user.space)
  .then((res) => console.log(`
Overquota: ${res.overquota ? 'yes' : 'no'}
Used: ${res.bytes_used}B
Total: ${res.bytes_total}B
`));
```

### File

#### `upload(auth, file) => Promise`

Upload file to the cloud-storage.️ ️️⚠️ This method only upload file to the internal storage. To move file to the cloud storage you need to call [`add`](#add)-method also.

**Parame️ters**

* `auth {Credentials}` - _Credentials_-object, see [Authentification](#Authentification) section for details
* `file {string}` - Path to the file.

**Example**

```ts
import {auth, file} from 'mailru-cloud';

auth('mylogin', 'mypassword', 'mail.ru')
  .then((auth) => file.upload(auth, './file-to-upload.txt'))
  .then(({hash, size}) => console.log(`
  Uploaded file info:
    - hash: ${hash}
    - size: ${size}B
`));
```

#### `add(auth, name, uploadData, conflict) => Promise`

Move file from internal storage to the cloud file system. This operation usually followed [`upload`](#upload)-method calling.

### Token

#### `csrf(auth) => Promise`

Get a new crsf-token.

**Parameters**

* `auth {Crendentials}` - _Credentials_ object, see [Authentification](#Authentification) section for details

**Example**

```ts
import {auth, token} from 'mailru-cloud';

auth('mylogin', 'mypassword', 'mail.ru')
  .then(token.csrf)
  .then((res) => console.log(`New token: ${res.token}`));
```

### User

#### `space(auth) => Promise`

Returns an information about the available space.

**Parameters**

* `auth {Credentials}` - _Credentials_ object, see [Authentification](#Authentification) section for details

**Example**

```ts
import {auth, user} from 'mailru-cloud';

auth('mylogin', 'mypassword', 'mail.ru')
  .then(user.space)
  .then((res) => console.log(`
Overquota: ${res.overquota ? 'yes' : 'no'}
Used: ${res.bytes_used}B
Total: ${res.bytes_total}B
`));
```