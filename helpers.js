const logger = require('winston');
const crypto = require('crypto');
const fs = require('fs');

var exports = module.exports = {};

/**
* @function 
* @name validate
* @param {string} parameter - Input parameter to check
* @returns {boolean} Return if parameter is valid or not
**/
exports.validate = function(parameter) {
	return parameter !== undefined && parameter !== '';
}

/**
* @function 
* @name validate_input
* @param {string} conf - Input conf file parameter to check
* @param {string} script - Input script file parameter to check
* @returns {boolean, Array.<string>} - is_valid: boolean which indicates if it's valid or not, messages: error messages
**/
exports.validate_input = function(conf, script) {
	error_msg = [];
	is_conf_valid = this.validate(conf);
	if(!is_conf_valid) {
	  error_msg.push('Configuration file not provided')
	} else {
		if(fs.existsSync(conf)) {
			content = fs.readFileSync(conf)
			conf_file = JSON.parse(content);
			secret = conf_file.secret;
			is_secret_valid = this.validate(secret);
			if(!is_secret_valid) {
			  error_msg.push('Secret not provided')
			}
		} else {
			error_msg.push('Unable to find file: ' + conf);
		}
	}
	is_script_valid = this.validate(script);
	if(!is_script_valid) {
	  error_msg.push('Script file not provided');
	} else {
		if(!fs.existsSync(script)) {
			error_msg.push('Unable to find file: ' + script);
		}
	}
	return {
		is_valid: error_msg.length == 0, 
		messages: error_msg
	}
}

/**
* @function 
* @name hash
* @param {string} body - Stringified JSON body of the hook POST request
* @param {string} secret - Secret from conf, to compute hash
* @returns {string} Return sha1 hash of the POST payload
**/
exports.hash = function(stringified_body, secret) {
	hash = crypto.createHmac('sha1', secret)
					.update(stringified_body)
					.digest('hex');

	return 'sha1=' + hash;
}

/**
* @function 
* @name hash
* @param {string} local_hash - Computed payload hash
* @param {string} request_hash - Request provided hash
* @returns {boolean} Return secure comparison of the two hashes
**/
exports.hashes_matches = function(local_hash, request_hash) {
	return local_hash.length === request_hash.length && 
		crypto.timingSafeEqual(Buffer.from(local_hash), Buffer.from(request_hash));
}