var helpers = require('./../helpers.js');
var should = require('chai').should();

describe('Test helpers', function() {
	describe('Test validation', function() {

		it('Should return invalid if undefined', function() {
			helpers
				.validate(undefined, 'Error message')
				.should
				.equal(false);
		});

		it('Should return invalid if string is empty', function() {
			helpers
				.validate(undefined, 'Error message')
				.should
				.equal(false);
		});

		it('Should return valid if string is neither undefined nor empty', function() {
			helpers
				.validate('input_parameter', 'Error message')
				.should
				.equal(true);
		});

	});

	describe('Test hash', function() {
		it('Should sha1-hash a string', function() {
			helpers
				.hash('this text will be hashed', 'secret')
				.should
				.equal('sha1=7608a419d6585d1e15e3d501ea01bd692383454d');
		});
	});


	describe('Test hashes comparison', function() {
		it('Should return false if hashes do not match', function() {
			helpers
				.hashes_matches(
					'sha1=7608a419d6585d1e15e3d501ea01bd692383454d', 
					'sha1=083e5593b38e5b54ac9413ae9d49af89c868ed6c')
				.should
				.equal(false);
		});

		it('Should return true if hashes matches', function() {
			helpers
				.hashes_matches(
					'sha1=7608a419d6585d1e15e3d501ea01bd692383454d', 
					'sha1=7608a419d6585d1e15e3d501ea01bd692383454d')
				.should
				.equal(true);
		});
	});
});