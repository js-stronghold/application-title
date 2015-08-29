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

describe('Content', function() {

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

	// var number;
	// beforeEach(function(done) {
	// 	number = 2;
	// 	done();
	// });

	var Content;
	before(function(done) {
		requirejs(['content-types/content'], function(content) {
			Content = content;
			done();
		});
	});

	it('Createing Content should work', function() {
		var sampleContent = new Content('test');

		expect(sampleContent.title).to.equal('test');
	});

	describe('toDomElement()', function() {

		var sampleContent;
		beforeEach(function() {
			sampleContent = new Content('test');
		});

		it('should return a dom element', function() {
			var element = sampleContent.toDomElement();

			expect(element.html()).to.equal('<h3>test</h3>');
		});

		it('returned element should have class "content"', function () {
			var element = sampleContent.toDomElement();

			expect(element.hasClass('content')).to.equal(true);
		});
	});
});