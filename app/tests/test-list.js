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

describe('List', function() {

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

	var Content,
		List,
		items = [
			'milk',
			'soap',
			'honey',
			'boza'
		];

	before(function(done) {
		requirejs(['content-types/content', 'content-types/list'], function(content, list) {
			Content = content;
			List = list;
			done();
		});
	});

	it('Createing List should work', function() {
		var sampleList = new List('test', items);

		expect(sampleList.title).to.equal('test');
	});

	it('List should inherit Content', function () {
		var sampleList = new List('belejka', items);

		expect(sampleList).to.be.an.instanceof(Content);
	});

	it('List should have a property "item" an array of items', function () {
		var sampleList = new List('belejka', items);

		expect(sampleList.items).to.equal(items);
	});

	describe('toDomElement()', function() {

		var sampleList,
			title = 'belejka';
			
		beforeEach(function() {
			sampleList = new List(title, items);
		});

		it('should return a dom element with title', function() {
			var element = sampleList.toDomElement();

			expect($(element)
				.find('h3')
				.html())
			.to.equal(title);
		});

		it('returned element should have class "content"', function () {
			var element = sampleList.toDomElement();

			expect(element.hasClass('content')).to.equal(true);
		});

		it('return element should contain an ul with the items of this List', function () {
			var element = sampleList.toDomElement(),
				ulChildren = $(element).find('.list').children();

			expect(ulChildren.length).to.equal(items.length);

			items.forEach(function(item, index) {
				var li = $(ulChildren[index]);
				expect(items).to.contain(li.html());
			});
		});
	});
});