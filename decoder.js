'use strict'

var getIconv = require('./lib/getIconv.js')
var reg = /%([0-9A-F]{2})/ig

module.exports = function decoder (codec, useIconv) {
  var iconvImpl = getIconv(useIconv)
  return function (string) {
    if (string.length === 0) {
      return ''
    }
    var buffers = []
    var lastIndex = 0
    reg.lastIndex = 0
    while (reg.test(string)) {
      var charPos = reg.lastIndex - 3
      buffers.push(new Buffer(string.substring(lastIndex, charPos)))
      buffers.push(new Buffer([parseInt(string.substr(charPos + 1, 2), 16)]))
      lastIndex = reg.lastIndex
    }
    if (lastIndex < string.length) {
      buffers.push(new Buffer(string.substring(lastIndex, string.length)))
    }

    return iconvImpl.decode(Buffer.concat(buffers), codec).toString()
  }
}
