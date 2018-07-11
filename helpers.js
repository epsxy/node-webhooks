var logger = require('winston');
var crypto = require('crypto');

var exports = module.exports = {};

/**
* @function 
* @name validate
* @param {string} parameter - Input parameter to check
* @param {string} message - Message to print if parameter is invalid
* @returns {boolean} Return if parameter is valid or not
**/
exports.validate = function(parameter, error_message) {
	if (parameter !== undefined && parameter !== '') {
		return true;
	} else {
		logger.error(error_message);
		return false;
	}
}

/**
* @function 
* @name hash
* @param {json} body - JSON body of the hook POST request
* @param {string} secret - Secret from conf, to compute hash
* @returns {string} Return sha1 hash of the POST payload
**/
exports.hash = function(body, secret) {
	hash = crypto.createHmac('sha1', secret)
					.update(JSON.stringify(body))
					.digest('hex')

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