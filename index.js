#!/usr/bin/env node

"use strict";

var bunyan = require('bunyan');
var express = require('express');
var bodyParser = require('body-parser');

var packageJson = require(process.env[ 'PWD' ] + '/package.json');
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
app.get('/hello', operations.sayHello);
app.post('/hello', bodyParser.json(), operations.sayHello);
app.get('/echo', operations.echoContext);
app.post('/echo', operations.echoContext);
