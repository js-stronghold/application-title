var expect = require('chai').expect;

describe('Template', function() {
	var number;
	beforeEach(function(done) {
		number = 2;
		done();
	});

	it('sampleTest', function () {
		expect(2).to.equal(number);
	});
});