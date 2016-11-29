'use strict'

var test = require('tap').test
var qs = require('qs')
var querystring = require('querystring')
var qsIconv = require('..')

test('Encoder Integration with qs', function (t) {
  t.equal(qs.stringify({
    test: 'こんにちは！'
  }, {
    encoder: qsIconv.encoder('shift_jis')
  }), 'test=%82%B1%82%F1%82%C9%82%BF%82%CD%81I')
  t.end()
})

test('Encoder Integration with qs & iconv', function (t) {
  t.equal(qs.stringify({
    test: 'こんにちは！'
  }, {
    encoder: qsIconv.encoder('shift_jis', true)
  }), 'test=%82%B1%82%F1%82%C9%82%BF%82%CD%81I')
  t.end()
})

test('Alternative Encoder Integration with qs', function (t) {
  t.equal(qs.stringify({
    test: 'ÄÖÜ'
  }, {
    encoder: qsIconv.encoder('macroman')
  }), 'test=%80%85%86')
  t.end()
})

test('Make sure that important characters are still encoded', function (t) {
  t.equal(qs.stringify({
    test: 'ÄÖÜ'
  }, {
    encoder: qsIconv.encoder('utf8')
  }), 'test=%C3%84%C3%96%C3%9C')
  t.end()
})

test('Decoder integration with querystring', function (t) {
  var _escape = querystring.escape
  querystring.escape = qsIconv.encoder('shift_jis')
  t.deepEqual(querystring.stringify({
    test: 'こんにちは！'
  }), 'test=%82%B1%82%F1%82%C9%82%BF%82%CD%81I')
  querystring.escape = _escape
  t.end()
})

test('Encoder correctly handles short characters like linefeed', function (t) {
  t.equal(qs.stringify({
    test: 'test\r\ntest'
  }, {
    encoder: qsIconv.encoder('ISO-8859-1')
  }), 'test=test%0D%0Atest')
  t.end()
})

test('Empty String encoder', function (t) {
  t.equal(qsIconv.encoder('shift_jis')(''), '')
  t.end()
})
