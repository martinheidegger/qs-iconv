'use strict'
var iconv
var iconvLite

function getIconvAdapter () {
  var Iconv = require('iconv').Iconv
  var currentEncoderEncoding
  var currentEncoderIconv
  var currentDecoderEncoding
  var currentDecoderIconv
  return {
    decode: function (bufferOrString, encoding) {
      if (encoding !== currentEncoderEncoding) {
        currentEncoderIconv = new Iconv(encoding, 'utf8')
        currentEncoderEncoding = encoding
      }
      return currentEncoderIconv.convert(bufferOrString)
    },
    encode: function (bufferOrString, encoding) {
      if (encoding !== currentDecoderEncoding) {
        currentDecoderIconv = new Iconv('utf8', encoding)
        currentDecoderEncoding = encoding
      }
      return currentDecoderIconv.convert(bufferOrString)
    }
  }
}

module.exports = function getIconv (useIconv) {
  if (useIconv) {
    if (!iconv) {
      iconv = getIconvAdapter()
    }
    return iconv
  }
  if (!iconvLite) {
    iconvLite = require('iconv-lite')
  }
  return iconvLite
}
