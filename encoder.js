'use strict'

var getIconv = require('./lib/getIconv.js')

function encodeChar (char) {
  // From http://www.hjp.at/doc/rfc/rfc3986.html#sec_2.3
  //
  //  ... %41-%5A and %61-%7A), DIGIT (%30-%39), hyphen (%2D), period (%2E),
  //      underscore (%5F), or tilde (%7E) should not be created by URI
  //      producers and, when found in a URI, should be decoded to their
  //      corresponding unreserved characters by URI normalizers.
  if ((char >= 0x41 && char <= 0x5A) ||
    (char >= 0x61 && char <= 0x7A) ||
    (char >= 0x30 && char <= 0x39) ||
    char === 0x2D ||
    char === 0x2E ||
    char === 0x5F ||
    char === 0x7E) {
    return String.fromCharCode(char)
  }
  if (char < 0x10) {
    return '%0' + char.toString(16).toUpperCase()
  }
  return '%' + char.toString(16).toUpperCase()
}

module.exports = function encoder (codec, useIconv) {
  var iconvImpl = getIconv(useIconv)
  return function (bufferOrString) {
    if (bufferOrString.length === 0) {
      return ''
    }
    var encodedBuffer = iconvImpl.encode(bufferOrString, codec)
    var result = []
    for (var i = 0; i < encodedBuffer.length; i++) {
      result.push(encodeChar(encodedBuffer.readUInt8(i)))
    }
    return result.join('')
  }
}
