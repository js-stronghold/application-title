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

describe('Day Module', function() {

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

	var Day,
		Note;
	before(function(done) {
		requirejs(['day', 'content-types/note'], function(day, note) {
			Day = day;
			Note = note;
			done();
		});
	});

	it('Creating Day should work', function() {
		var aDay = new Day(1);

		expect(aDay.number).to.equal(1);
	});

	it('addContent should add content to the contents property', function() {
		var myDay = new Day(24),
			myNote = new Note('belejka', 'Sub Zero: xxxacz<+z');

		myDay.addContent(myNote);

		expect(myDay.contents[0]).to.equal(myNote);
	});

	it('Day contents property should be readonly', function() {
		var someDay = new Day(24),
			myNote = new Note('belejka', 'Sub Zero: xxxacz<+z');

		someDay.addContent(myNote);
		expect(someDay.contents[0]).to.equal(myNote);

		someDay.contents = [];
		expect(someDay.contents[0]).to.equal(myNote);

		someDay.contents = 0;
		expect(someDay.contents[0]).to.equal(myNote);

		someDay.contents = {
			x: 'y'
		};
		expect(someDay.contents[0]).to.equal(myNote);

		someDay.contents = function() {
			return 24;
		};
		expect(someDay.contents[0]).to.equal(myNote);

		someDay.contents.push('aso');
		someDay.contents.push('pika');
		expect(someDay.contents.length).to.equal(1);
	});

	it('Day _contents property should be invisible', function() {
		var someDay = new Day(24),
			myNote = new Note('belejka', 'Sub Zero: xxxacz<+z'),
			ownKeys,
			prototypeKeys;

		ownKey = Object.keys(someDay);
		expect(ownKey).to.not.include('_contents');

		prototypeKeys = Object.keys(Object.getPrototypeOf(someDay));
		expect(prototypeKeys).to.not.include('_contents');
		expect(prototypeKeys).to.include('contents');
	});
});