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
	var Day,
		Note;
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
			}
		});

		requirejs(['calendar/day', 'content-types/note'], function(day, note) {
			Day = day;
			Note = note;
			done();
		});
	});

	it('Creating Day should work', function() {
		var today = new Date();
		var aDay = new Day(today);

		expect(aDay.number).to.equal(today.getDate());
	});

	describe('Day properties', function() {
		var myNote,
			myDay;
		beforeEach(function() {
			myNote = new Note('belejka', 'Sub Zero: xxxacz<+z');
			myDay = new Day(new Date(2015, 10, 24));
		});

		it('addContent should add content to the contents property', function() {
			myDay.addContent(myNote);

			expect(myDay.contents[0]).to.equal(myNote);
			expect(myDay.contents[0].title).to.equal('belejka');
		});

		it('addContent chaining should work', function () {
			myDay.addContent(myNote)
				.addContent(myNote)
				.addContent(myNote);

			expect(myDay.contents.length).to.equal(3);
		});

		it('When content is added Day should be highlighted', function() {
			myDay.addContent(myNote);

			expect(myDay.isHighlighted).to.equal(true);
		});

		it('removeContent should work', function () {
			var removedNote;

			myDay.addContent(myNote)
				.addContent(myNote)
				.addContent(myNote);

			myDay.removeContent(myNote);
			expect(myDay.contents.length).to.equal(2);

			removedNote = myDay.removeContent(myNote);
			expect(myDay.contents.length).to.equal(1);
			expect(removedNote).to.equal(myNote);

			myDay.removeContent(myNote);
			expect(myDay.contents.length).to.equal(0);

			removedNote = myDay.removeContent(myNote);
			expect(myDay.contents.length).to.equal(0);
			expect(removedNote).to.equal(null);
		});

		it('When content is removed and there is no content left Day should stop being highlighted', function () {
			myDay.addContent(myNote)
				.addContent(myNote)
				.addContent(myNote);

			expect(myDay.isHighlighted).to.equal(true);

			myDay.removeContent(myNote);
			expect(myDay.isHighlighted).to.equal(true);

			myDay.removeContent(myNote);
			expect(myDay.isHighlighted).to.equal(true);

			myDay.removeContent(myNote);
			expect(myDay.isHighlighted).to.equal(false);
		});

		it('Day "contents" property should be readonly', function() {
			myDay.addContent(myNote);
			expect(myDay.contents[0]).to.equal(myNote);

			myDay.contents = [];
			expect(myDay.contents[0]).to.equal(myNote);

			myDay.contents = 0;
			expect(myDay.contents[0]).to.equal(myNote);

			myDay.contents = {
				x: 'y'
			};
			expect(myDay.contents[0]).to.equal(myNote);

			myDay.contents = function() {
				return 24;
			};
			expect(myDay.contents[0]).to.equal(myNote);

			myDay.contents.push('aso');
			myDay.contents.push('pika');
			expect(myDay.contents.length).to.equal(1);
		});

		it('Day "_contents" property should be invisible', function() {
			var ownKey = Object.keys(myDay),
				prototypeKeys = Object.keys(Object.getPrototypeOf(myDay));

			expect(ownKey).to.not.include('_contents');

			expect(prototypeKeys).to.not.include('_contents');
			expect(prototypeKeys).to.include('contents');
		});

		describe('toDomElement()', function () {
			it('should return a dom element', function () {
				var element = myDay.toDomElement();

				expect(element).to.have.property('html');
			});

			it('should be of class day', function () {
				var element = myDay.toDomElement();

				expect($(element).hasClass('day')).to.equal(true);
			});

			it('should warp it\'s contents.toDomElement()', function () {
				var dayHTML,
					noteHTML = myNote.toDomElement().html();

				myDay.addContent(myNote)
					.addContent(myNote);

				dayHTML = myDay.toDomElement().html();	

				expect(dayHTML).to.include(noteHTML);
				expect(dayHTML).to.include(noteHTML + '</div><div class="content">' + noteHTML);
			});
		});
	});
});