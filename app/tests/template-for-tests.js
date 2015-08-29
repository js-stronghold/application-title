var requirejs = require('requirejs');
var expect = require('chai').expect;

requirejs.config({
	baseUrl: '',
	nodeRequire: 'require'
});

describe('Template', function() {

	// var yourModule;
	// before(function(done) {
	// 	requirejs(['scripts/content'], function(module) {
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