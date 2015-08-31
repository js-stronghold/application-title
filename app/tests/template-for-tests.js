var requirejs = require('requirejs');
var expect = require('chai').expect;
var jsdom = require('jsdom');
var jq = require('jquery');

requirejs.config({
	baseUrl: 'scripts',
	nodeRequire: 'require',
	paths: {
		jquery: 'libs/jquery-2.1.4'
	}
});

describe('Template', function() {

	before(function(done) {
		jsdom.env({
			html: '',
			done: function(errors, window) {
				global.window = window;
				global.document = window.document;
				global.$ = jq(window);
				Object.keys(window)
					.filter(function(prop) {
						return prop.toLowerCase().indexOf('html') >= 0;
					}).forEach(function(prop) {
						global[prop] = window[prop];
					});
				done();
			}
		});
	});

	// Load your module here
	// var yourModule;
	// before(function(done) {
	// 	requirejs(['content'], function(module) {
	// 		yourModule = module;
	// 		done();
	// 	});
	// });

	var number;
	beforeEach(function(done) {
		number = 2;
		done();
	});

	it('sampleTest', function () {
		expect(2).to.equal(number);
	});
});