'use strict'

var test = require('tap').test
var qs = require('qs')
var querystring = require('querystring')
var qsIconv = require('..')

test('Decoder Integration with qs', function (t) {
  t.deepEqual(qs.parse('test=%82%B1%82%F1%82%C9%82%BF%82%CD%81I', {
    decoder: qsIconv.decoder('shift_jis')
  }), {
    test: 'こんにちは！'
  })
  t.end()
})

test('Decoder Integration with qs & iconv', function (t) {
  t.deepEqual(qs.parse('test=%82%B1%82%F1%82%C9%82%BF%82%CD%81I', {
    decoder: qsIconv.decoder('shift_jis', true)
  }), {
    test: 'こんにちは！'
  })
  t.end()
})

test('Alternative decoder Integration with qs & iconv', function (t) {
  t.deepEqual(qs.parse('test=%80%85%86', {
    decoder: qsIconv.decoder('macroman', true)
  }), {
    test: 'ÄÖÜ'
  })
  t.end()
})

test('Alternative Decoder Integration with qs', function (t) {
  t.deepEqual(qs.parse('test=%80%85%86', {
    decoder: qsIconv.decoder('macroman')
  }), {
    test: 'ÄÖÜ'
  })
  t.end()
})

test('Decoder integration with querystring', function (t) {
  var _unescape = querystring.unescape
  querystring.unescape = qsIconv.decoder('shift_jis')
  t.deepEqual(querystring.parse('test=%82%B1%82%F1%82%C9%82%BF%82%CD%81I'), {
    test: 'こんにちは！'
  })
  querystring.unescape = _unescape
  t.end()
})

test('Make sure that important characters are still deencoded', function (t) {
  t.deepEqual(qs.parse('test=%C3%84%C3%96%C3%9C', {
    decoder: qsIconv.decoder('utf8')
  }), {
    test: 'ÄÖÜ'
  })
  t.end()
})

test('Empty String decoder', function (t) {
  t.equal(qsIconv.decoder('shift_jis')(''), '')
  t.end()
})
