'use strict'

var index = require('..')
var test = require('tap').test

test('structure of index', function (t) {
	t.deepEqual(index, {
		encoder: require('../encoder'),
		decoder: require('../decoder')
	})
	t.end()
})