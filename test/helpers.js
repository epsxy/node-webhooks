var helpers = require('./../helpers.js');
var should = require('chai').should();
var expect = require('chai').expect();
var mock = require('mock-fs');

describe('Test helpers', function() {
	describe('Test string validation', function() {

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

	describe('Test input whole validation', function() {
			it('Should report that conf and script parameters were not provided', function() {
			var { is_valid, messages } = helpers.validate_input(undefined,  '');

			is_valid.should.equal(false);
			messages.length.should.equal(2);
			messages
				.should
				.contains('Configuration file not provided', 'Script file not provided')
		});
		
		it('Should report nothing if everything is alright', function() {
			mock({
				'temp': {
					'conf': '{"secret": "password"}', 
					'script': ''
				}
			});

			var { is_valid, messages } = helpers.validate_input('temp/conf', 'temp/script');

			is_valid.should.equal(true);
			messages.length.should.equal(0);
			mock.restore();
		});

		it('Should report that conf file does not exist', function() {
			mock({
				'temp': {
					'script': ''
				}
			});

			var { is_valid, messages } = helpers.validate_input('temp/conf', 'temp/script');

			is_valid.should.equal(false);
			messages.length.should.equal(1);
			messages.should.contains('Unable to find file: temp/conf');
			mock.restore();
		});

		it('Should report that script file does not exist', function() {
			mock({
				'temp': {
					'conf': '{"secret": "password"}'
				}
			});

			var { is_valid, messages } = helpers.validate_input('temp/conf', 'temp/script');

			is_valid.should.equal(false);
			messages.length.should.equal(1);
			messages.should.contains('Unable to find file: temp/script');
			mock.restore();
		});

		it('Should report that secret is missing in conf file', function() {
			mock({
				'temp': {
					'conf': '{"wrong-attribute": "password"}', 
					'script': ''
				}
			});

			var { is_valid, messages } = helpers.validate_input('temp/conf', 'temp/script');

			is_valid.should.equal(false);
			messages.length.should.equal(1);
			messages.should.contains('Secret not provided');
			mock.restore();
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