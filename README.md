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