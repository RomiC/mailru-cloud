# Cloud.Mail.ru API doc

**Important notice!!** Information below is unofficial documention for the Mail.ru cloud service. It was getted during reverse-engeneering web application. Docs provided without any guarantees.

## Authentification

### 1. Common auth on the mail.ru service

`POST https://auth.mail.ru/cgi-bin/auth?lang=ru_RU&from=authpop`

#### Form data

* **Domain** (`mail.ru`) - domain of the user email
* **Login** (`username`) - user login
* **Password** (`my_security_pass`) - user password

#### Response

Mostly come with 302-redirect header. In case of successfull authorization, the following cookies will be sent as well:

```
GarageID=e2915d7c8fd1469c85f5b7e176e14b43; domain=.auth.mail.ru
Mpop=1498566275:62075b6f605d0871190502190805001b0b0d1d0205084b6a515f475a030503091f04077b164a5e5d50591b545d5046425e585e1755535b54174b44:roman.charugin@mail.ru:; domain=.mail.ru
ssdc=392a7dc9fca94adebec2fe465c21a4b5; domain=.auth.mail.ru
ssdc_info=392a:0:1498566275; domain=.auth.mail.ru
t=obLD1AAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAgAAAAjABADwwcA; domain=.mail.ru
```

### 2. Getting sdc-url

`GET https://auth.mail.ru/sdc?from=https%3A%2F%2Fcloud.mail.ru%2Fhome%2F`

You should send all relevant cookies received on the first step also.

#### Response

In any case you'll receive 302-redirect. Redirect to URL like this one `https://cloud.mail.ru/sdc?token=55b6c1939260442a9a10b59abbba1689` means OK. Any other means error.

### 3. Getting sdc-token

You should follow the success redirect gotted on the previous step.

#### Response

In case of success you'll receive the following cookie:

```
Set-Cookie: sdcs=9twPDC5SufkeQLKj; domain=.cloud.mail.ru
```

### 4. Getting

## Base URL

`https://cloud.mail.ru`

## Base URI

`/api/v2`

## Authorization

For any of requests below you must provide the following cookies:
* **Mpop** - which you receive during the [first authentification request](#1-common-auth-on-the-mailru-service)
* **sdcs** - See "[Getting sdc token](#3-getting-sdc-token)" section

Each method (excepts `/tokens/csrf`) requires `token` param in the query as well. It's also necessary to add the correct `User-Agent` in request header.

## List of methods

### `POST /batch`

(WIP)

### `POST /clone`

(WIP)

### `GET /dispatcher`

Get dipatcher info. Collection of properties including links for upload and download.

#### Response

```json
{
  "email": "me@mail.ru",
	"body": {
		"video": [{"count": "3", "url": "https://cloclo22.datacloudmail.ru/video/"}],
		"view_direct": [{"count": "250", "url": "http://cloclo18.cloud.mail.ru/docdl/"}],
		"weblink_view": [{"count": "50", "url": "https://cloclo18.datacloudmail.ru/weblink/view/"}],
		"weblink_video": [{"count": "3", "url": "https://cloclo18.datacloudmail.ru/videowl/"}],
		"weblink_get": [{"count": 1, "url": "https://cloclo27.cldmail.ru/2yoHNmAc9HVQzZU1hcyM/G"}],
		"weblink_thumbnails": [{"count": "50", "url": "https://cloclo3.datacloudmail.ru/weblink/thumb/"}],
		"auth": [{"count": "500", "url": "https://swa.mail.ru/cgi-bin/auth"}],
		"view": [{"count": "250", "url": "https://cloclo2.datacloudmail.ru/view/"}],
		"get": [{"count": "100", "url": "https://cloclo27.datacloudmail.ru/get/"}],
		"upload": [{"count": "25", "url": "https://cloclo22-upload.cloud.mail.ru/upload/"}],
		"thumbnails": [{"count": "250", "url": "https://cloclo3.cloud.mail.ru/thumb/"}]
	},
	"time": 1457101607726,
	"status": 200
}
```

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

```json
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

Uploading file to cloud. Require `Mpop`-cookie plus valid `User-Agent` header. `Content-Type` should be `multipart/form-data` with specified boundary value. You must also send `Content-Length` header with correct total amount of data in Bytes.

#### Form data boundaries

* **file** - Uploaded file; should also have `filename` param with the file name

#### Response

```
3C194D206659B0678EDF17E21050BF82B277BCFC;5809
```

### `POST https://%server_name%.cloud.mail.ru/refrsh`

Consists of file hash and file size separated by semicolon.

### `POST /file/add`

Adding file to the cloud. (!) Not uploading, but adding uploaded file to the cloud.

#### Form data

* **home** (`//javascript9.ics`) - path to save the file
* **hash** (`3C194D206659B0678EDF17E21050BF82B277BCFC`) - file hash
* **size** (`5809`) - file size
* **conflict** (`rename`) - (supposed) strategy name in case of file is already exists

#### Response
```json
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

```json
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

```json
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

Getting new (or updating existed) token.

#### Response

```json
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

#### Response

```json
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

## Clouder widget

### Base URL

`https://clouder-api.mail.ru`

### Base URI

`/api/v1`

### List of methods

#### `GET /ls/%path%`

Get list of folders

##### Response

```json
{
  "name": "/",
  "type": "d",
  "list": [
    {
      "name": "Saved from Clouder",
      "type": "d"
    },
    …
    {
      "mtime": 1399443686,
      "name": "V44516-01.zip",
      "size": 305781756,
      "public": 1,
      "type": "f"
    },
    …
  ]
}
```

#### `PUT /create/[%path%/]%filename%`

#### Query params

* **mode** (`autorename`) — what to do in case of file is being exists on cloud

#### Body

File content in binary mode.

#### Response

```json
{
  "mtime": 1492519798,
  "name": "photos2.zip",
  "type": "f",
  "size": 6896328
}
```

`409 (Conflict)` in case of file already exists and no autorename mode provide.