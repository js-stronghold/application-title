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

describe('Note', function() {

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
		Note;
	before(function(done) {
		requirejs(['content-types/content', 'content-types/note'], function(content, note) {
			Content = content;
			Note = note;
			done();
		});
	});

	it('Createing Note should work', function() {
		var sampleNote = new Note('test', 'message');

		expect(sampleNote.title).to.equal('test');
	});

	it('Note should inherit Content', function () {
		var sampleNote = new Note('belejka', 'kupi hlqb');

		expect(sampleNote).to.be.an.instanceof(Content);
	});

	it('Note should have a property "message"', function () {
		var sampleNote = new Note('belejka', 'go to Cherno More');

		expect(sampleNote.message).to.equal('go to Cherno More');
	});

	describe('toDomElement()', function() {

		var sampleNote,
			title = 'belejka',
			message = 'nahrani kompa';
			
		beforeEach(function() {
			sampleNote = new Note(title, message);
		});

		it('should return a dom element with title', function() {
			var element = sampleNote.toDomElement();

			expect($(element)
				.find('h3')
				.html())
			.to.equal(title);
		});

		it('returned element should have class "content"', function () {
			var element = sampleNote.toDomElement();

			expect(element.hasClass('content')).to.equal(true);
		});

		it('return element should contain element with class .note with the message content', function () {
			var element = sampleNote.toDomElement();

			expect($(element).find('.note').html()).to.equal(message);
		});
	});
});