[![ISC License](https://img.shields.io/badge/license-ISC-brightgreen.svg?style=flat)](https://tldrlegal.com/license/-isc-license)
[![Build Status](https://travis-ci.org/martinheidegger/qs-iconv.svg?branch=master)](https://travis-ci.org/martinheidegger/qs-iconv)
[![Coverage Status](https://coveralls.io/repos/github/martinheidegger/qs-iconv/badge.svg?branch=master)](https://coveralls.io/github/martinheidegger/qs-iconv?branch=master)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

# qs-iconv
Character encoding for [qs](https://www.npmjs.com/package/qs) (and by extension: [request](https://www.npmjs.com/package/request)) and [querystring](https://nodejs.org/api/querystring.html#querystring_querystring_escape).

## Why?
Sending requests in Node.js usually encodes url using the `utf-8` character code (both with [querystring](https://nodejs.org/api/querystring.html) and qs). This means that sending a String like `こんにちは！` will become `%E3%81%93%E3%82%93%E3%81%AB%E3%81%A1%E3%81%AF%EF%BC%81`.
Unfortunately not all servers are implemented in `utf8` (particularly in Japan [ShiftJIS](https://en.wikipedia.org/wiki/Shift_JIS) is still very often seen) and those servers might expect form requests to be sent using another encoding.

Example: If the servers speaks `shift_jis` then the above string should be sent as: `%82%B1%82%F1%82%C9%82%BF%82%CD%81I`.

_(Note: Browsers also send form data to servers with `shift_jis` support as `shift_jis` encoded String)_

## How?
This library implements the `encoder` and `decoder` option for qs after installing it you can use it like:

_(encoder)_
```javascript
var qsIconv = require('qs-iconv')
var qs = require('qs')
qs.stringify({test: 'こんにちは！'}, {encoder: qsIconv.encoder('shift_jis')})
```

_(decoder)_
```javascript
var qsIconv = require('qs-iconv')
var qs = require('qs')
qs.parse('%82%B1%82%F1%82%C9%82%BF%82%CD%81I', {decoder: qsIconv.decoder('shift_jis')})
```

## Querystring
Node.js comes with `require('querystring')` right out of the box. It has fewer features than `qs` but should work in quite a few cases as well. This library supports querystring as well! Here is how you would encode the above example using querystring.

```javascript
var qsIconv = require('qs-iconv')
var querystring = require('querystring')
var tmpEscape = querystring.escape
querystring.escape = qsIconv.encoder('shift_jis')
querystring.stringify({test: 'こんにちは！'})
querystring.escape = tmpEscape
```

Of course you unescape works as well:

```javascript
var qsIconv = require('qs-iconv')
var querystring = require('querystring')
var tmpUnescape = querystring.unescape
querystring.unescape = qsIconv.decoder('shift_jis')
querystring.parse('%82%B1%82%F1%82%C9%82%BF%82%CD%81I')
querystring.unescape = tmpUnescape
```

## Request
Most likely you will not come in touch with iconv through `qs` or `querystring` but rather through `request`. Here is how you can make a `shift_jis` POST request using this library:

```javascript
var qsIconv = require('qs-iconv')
var request = require('request')
// inter-locale.com explains encoding in depth
request('https://encoding-server-jsdxxvgqvo.now.sh/', {
    method: 'POST',
    data: {
        field1: 'こんにちは！'
    },
    qsStringifyOptions: {
        encoder: qsIconv.encoder('shift_jis')
    },
    qsParseOptions: {
        decoder: qsIconv.decoder('shift_jis')
    }
})
```

_(Note: `request` supports this library from version `2.72.0`)_

## Iconv
This package uses by default [`iconv-lite`](https://www.npmjs.com/package/iconv-lite) which is a JavaScript-only variant of [iconv](https://www.npmjs.com/package/iconv). But since its stripped down to the bone and might be missing some tricky edge cases this library also allows to take the iconv instead.
For it to work you need to have `iconv` installed **additionally** to `qs-iconv`!

```javascript
var qsIconv = require('qs-iconv')
qsIconv.decoder('shift_jis', true)
qsIconv.encoder('shift_jis', true)
```

## Performance Remark
Both iconv and iconv-lite are not optimized for de-/encoding single charaters but rather a string. Unless we have good support for character encoding this library will add a reasonable performance toll.

## License
ISC

_(Fixes and other contributions welcome)_
