'use strict'

var getIconv = require('./lib/getIconv.js')
var qsEncoder = require('querystring').escape

module.exports = function encoder (codec, useIconv) {
  var iconvImpl = getIconv(useIconv)
  return function (bufferOrString) {
    if (bufferOrString.length === 0) {
      return ''
    }
    var str = bufferOrString.toString()
    var encodedBuffer = iconvImpl.encode(bufferOrString, codec)

    var result = []
    for (var i = 0; i < encodedBuffer.length; i++) {
      var encCode = encodedBuffer.readUInt8(i)
      var charCode = str.charCodeAt(i)
      if (charCode === encCode) {
        result.push(qsEncoder(str.charAt(i)))
      } else {
        result.push('%' + encCode.toString(16).toUpperCase())
      }
    }
    return result.join('')
  }
}
