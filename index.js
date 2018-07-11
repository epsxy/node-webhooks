#!/usr/bin/env node

var express = require('express');
var bodyParser = require('body-parser');
var shell = require('shelljs');
var path = require('path');
var pkg = require(path.join(__dirname, 'package.json'));
var logger = require('winston');
var commander = require('commander');
var helpers = require('./helpers.js');

// Configure logger
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Default variables
var DEFAULT_PORT = 8080;
var DEFAULT_ROUTE = '/webhook';

// Commander configuration
commander
    .version(pkg.version)
    .option('-p, --port <port>', 'Port Number', DEFAULT_PORT)
    .option('-r, --route <route>', 'Route for server', DEFAULT_ROUTE)
    .option('-c, --conf <conf', 'Path to conf file', '')
    .option('-s, --script <script>', 'Path to script to trigger', '')
    .parse(process.argv);

// Starting logs
logger.info('... Webhooks server starting ...');
logger.debug(`Will use port ${commander.port}`);
logger.debug(`Will use route ${commander.route}`);
logger.debug(`Will use conf file ${commander.conf}`);
logger.debug(`Will trigger script ${commander.script}`);

// Validation
is_conf_valid = helpers.validate(commander.conf, 'Configuration file not provided');
is_script_valid = helpers.validate(commander.script, 'Script file not provided');
conf_file = require(commander.conf);
secret = conf_file.secret;
is_secret_valid = helpers.validate(secret, 'Secret not provided');

if(!is_script_valid || !is_conf_valid || !is_secret_valid) {
	process.exit(1);
}

var app = express();
app.use( bodyParser.json() );
app.post(commander.route, function (req, res) {

  var github_hash = req.get('X-Hub-Signature');
  var hash = helpers.hash(req.body, secret);

  if(helpers.hashes_matches(hash, github_hash)) {
	const { stdout, stderr, code } = shell.exec(commander.script, { silent: true });
  	if(code !== 0) {
  		logger.error('500 - ' + stderr)
  		res.status(500).send('An error has occured while executing the script - ' + stderr)
  	} else {
  		logger.info('200 - ' + stdout)
  		res.status(200).send('Hook triggered - ' + stdout);	
  	}
  }
  else {
	logger.error('403 - Signatures does not match')
  	res.status(403).send('Signatures does not match');
  }
});

// Start server
app.listen(commander.port, function() {
	logger.info('Express server is up and running');
});
