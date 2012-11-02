var should = require('should');

function CustomException(message) {
	this.message = message;
}

CustomException.prototype = new Error;

function tested_function() {
	throw new CustomException('custom exception');
}

describe('CustomException', function() {
	it('expect CustomException', function(done) {
		tested_function.should.throw(CustomException);
		done();
	});
	it('expect message matching', function(done) {
		tested_function.should.throw(/custom exception/);
		done();
	});
});
