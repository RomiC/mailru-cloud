# Mail.ru Cloud service client

## Base URL

`https://cloud.mail.ru`

## Base URI

`/api/v2`

## List of methods

### `POST /batch`

(WIP)

### `POST /clone`

(WIP)

### `GET /dispatcher`

(WIP)

### `POST /docs/token`

(WIP)

### `GET /file`

(supposed) Getting info about path.

#### Query params

* **home** (`/Cards`) - path to file
* **api** (`2`) - (supposed) api version number
* **build** (`hotfix_CLOUDWEB-7479_41-0-2.201703311709`) - (supposed) client version
* **x-page-id** (`IQFp762REe`) - (???)
* **email** (`roman.charugin@mail.ru`) - user email
* **x-email** (`roman.charugin@mail.ru`) - (supposed) additional user email (against CSRF)
* **token** (`8UaGHDKdytLnS7rUM4yhL2UexPr7QsdY`) - auth token
* **_** (`1492087095170`) - (supposed) timestamp

#### Response

```
{
  "email": "roman.charugin@mail.ru",
  "body": {
    "count": {
      "folders": 3,
      "files": 7
    },
    "tree": "323633323134323230303030",
    "name": "/",
    "grev": 39,
    "kind": "folder",
    "rev": 8,
    "type": "folder",
    "home": "/"
  },
  "time": 1492087233908,
  "status": 200
}
```

### `OPTIONS https://%server_name%.cloud.mail.ru/upload`

(supposed) Getting info about file uploading options


### `POST https://%server_name%.cloud.mail.ru/upload`

Uploading file to cloud

#### Query params

* **cloud_domain** (`2`) - (supposed) number of cloud domain
* **x-email** (`roman.charugin@mail.ru`) - user email
* **fileapi149208709514114** - (supposed) file API version

#### Response

```
3C194D206659B0678EDF17E21050BF82B277BCFC;5809
```

Consists of file hash and file size separated by semicolon.

### `POST /file/add`

Adding file to the cloud. (!) Not uploading, but adding uploaded file to the cloud.

#### Form data

* **home** (`//javascript9.ics`) - path to save the file
* **hash** (`3C194D206659B0678EDF17E21050BF82B277BCFC`) - file hash
* **size** (`5809`) - file size
* **conflict** (`rename`) - (supposed) strategy name in case of file is already exists
* **api** (`2`) - (supposed) api version
* **build** (`hotfix_CLOUDWEB-7479_41-0-2.201703311709`) - (supposed) client version
* **x-page-id** (`IQFp762REe`) - (???)
* **email** (`roman.charugin@mail.ru`) - user email
* **x-email** (`roman.charugin@mail.ru`) - (supposed) additional user email (against CSRF)
* **token** (`8UaGHDKdytLnS7rUM4yhL2UexPr7QsdY`) - auth token

#### Response
```
{
  "email": "roman.charugin@mail.ru",
  "body": "/javascript9 (1).ics",
  "time": 1492092621078,
  "status": 200
}
```

### `POST /file/move`

(WIP)

### `POST /file/remove`

(WIP)

### `POST /file/rename`

(WIP)

### `POST /file/copy`

(WIP)

### `POST /file/publish`

(WIP)

### `POST /file/unpublish`

(WIP)

### `GET /folder`

#### Response

```
{
  "email": "roman.charugin@mail.ru",
  "body": {
    "count": {
      "folders": 3,
      "files": 7
    },
    "tree": "323633323134323230303030",
    "name": "/",
    "grev": 39,
    "size": 2130119208,
    "sort": {
      "order": "asc",
      "type": "name"
    },
    "kind": "folder",
    "rev": 8,
    "type": "folder",
    "home": "/",
    "list": [
      {
        "count": {
          "folders": 0,
          "files": 13
        },
        "tree": "323633323134323230303030",
        "name": "Cards",
        "grev": 3,
        "size": 8492067,
        "kind": "folder",
        "rev": 3,
        "type": "folder",
        "home": "/Cards"
      },
      …
      {
        "mtime": 1393330500,
        "virus_scan": "pass",
        "name": "Cat & Owl_2.zip",
        "size": 154396456,
        "hash": "01EAB35114CE80E9595A11DA5DEECA20B8B65F6E",
        "kind": "file",
        "weblink": "cb92986b8177/Cat & Owl_2.zip",
        "type": "file",
        "home": "/Cat & Owl_2.zip"
      },
      …
    ]
  },
  "time": 1492087097324,
  "status": 200
}
```

### `POST /folder/add`

(WIP)

### `GET /folder/find`

(WIP)

### `GET /folder/invites`

(supposed) Working with invites

#### Query params

* **api** (`2`) - (supposed) api version number
* **build** (`hotfix_CLOUDWEB-7479_41-0-2.201703311709`) - (supposed) client version
* **x-page-id** (`IQFp762REe`) - (???)
* **email** (`roman.charugin@mail.ru`) - user email
* **x-email** (`roman.charugin@mail.ru`) - (supposed) additional user email (against CSRF)
* **token** (`aFFREMTZBQfxHZadefemdkJv8S6fLxxo`) - auth token
* **_** (`1492087095134`) - (supposed) timestamp

#### Response

```
{
  "email": "roman.charugin@mail.ru",
  "body": [],
  "time": 1492087096085,
  "status": "200"
}
```

### `GET /folder/shared/links`

(WIP)

### `GET /folder/invites/info`

(WIP)

### `POST /folder/invites/reject`

(WIP)

### `POST /folder/mount`

(WIP)

### `GET /folder/shared`

(WIP)

### `GET /folder/shared/incoming`

(WIP)

### `GET /folder/shared/info`

(WIP)

### `POST /folder/share`

(WIP)

### `GET /folder/tree`

(WIP)

### `POST /folder/unmount`

(WIP)

### `POST /folder/unshare`

(WIP)

### `POST /folder/viruscan`

(WIP)

### `GET /mail/ab/contacts`

(WIP)

### `POST /mail/ab/contacts/add`

(WIP)

### `GET /status`

(WIP)

### `POST /tokens/csrf`

(supposed) Getting new (or updating existed) token.

#### Form data

* **api** (`2`) - (supposed) api version number
* **build** (`hotfix_CLOUDWEB-7479_41-0-2.201703311709`) - (supposed) client version
* **x-page-id** (`IQFp762REe`) - (???)
* **email** (`roman.charugin@mail.ru`) - user email
* **x-email** (`roman.charugin@mail.ru`) - (supposed) additional user email (against CSRF)

#### Response

```
{
  "email": "roman.charugin@mail.ru",
  "body": {
    "token": "8UaGHDKdytLnS7rUM4yhL2UexPr7QsdY"
  },
  "time": 1492087095989,
  "status": 200
}
```

### `POST /tokens/download`

(WIP)

### `GET /weblinks`

(WIP)

### `GET /user`

(WIP)

### `POST /user/agree-la`

(WIP)

### `POST /user/edit`

(WIP)

### `POST /user/promo/active`

(WIP)

### `POST /user/promo/ignore`

(WIP)

### `POST /user/promo/invite`

(WIP)

### `POST /user/promo/join`

(WIP)

### `GET /user/space`

Getting info about space.

#### Query params

* **api** (`2`) - (supposed) api version number
* **build** (`hotfix_CLOUDWEB-7479_41-0-2.201703311709`) - (supposed) client version
* **x-page-id** (`IQFp762REe`) - (???)
* **email** (`roman.charugin@mail.ru`) - user email
* **x-email** (`roman.charugin@mail.ru`) - (supposed) additional user email (against CSRF)
* **token** (`8UaGHDKdytLnS7rUM4yhL2UexPr7QsdY`) - auth-token
* **_** (`1492087095137`) - (supposed) timestamp

#### Response

```
{
  "email": "roman.charugin@mail.ru",
  "body": {
    "overquota": false,
    "used": 2031,
    "total": 1048576
  },
  "time": 1492087195197,
  "status": 200
}
```

### `POST /zip`

(WIP)

### `GET /mail/ab/contacts`

(WIP)

### `POST /mail/ab/contacts/add`

(WIP)

### `GET /billing/rates`

(WIP)

### `POST /billing/change`

(WIP)

### `POST /billing/prolong`

(WIP)

### `POST /billing/cancel`

(WIP)

### `POST /billing/history`

(WIP)

### `GET /trashbin`

(WIP)

### `POST /trashbin/restore`

(WIP)

### `POST /trashbin/empty`

(WIP)

### `GET /domain/folders`

(WIP)