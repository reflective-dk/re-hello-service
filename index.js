#!/usr/bin/env node

"use strict";

var bunyan = require('bunyan');
var express = require('express');
var bodyParser = require('body-parser');

var path = require('path');
var packageFile = path.join(path.dirname(require.resolve('./index')), 'package.json');
var packageJson = require(packageFile);
var config = packageJson.config;
var logger = bunyan.createLogger({
    name: config.serviceName,
    level: config.logLevel
});

var operations = require('./lib/operations.js')(packageJson);

var app = express();
app.listen(8080, function() {
    logger.info('service ready');
});

app.get('/', operations.sendPackage);
app.get('/greet', operations.greet);
app.post('/greet', bodyParser.json(), operations.greet);
app.get('/echo', operations.echoContext);
app.post('/echo', operations.echoContext);
