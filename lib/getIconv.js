'use strict'
var iconv
var iconvLite

function getIconvAdapter () {
  var Iconv = require('iconv').Iconv
  return {
    decode: function (bufferOrString, encoding) {
      var iconv = new Iconv(encoding, 'utf8')
      return iconv.convert(bufferOrString)
    },
    encode: function (bufferOrString, encoding) {
      var iconv = new Iconv('utf8', encoding)
      return iconv.convert(bufferOrString)
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
