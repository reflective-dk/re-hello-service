#!/usr/bin/env node

"use strict";

var bunyan = require('bunyan');
var express = require('express');
var bodyParser = require('body-parser');

var package = require(process.env[ 'PWD' ] + '/package.json');
var config = package.config;
var logger = bunyan.createLogger({
    name: config.serviceName,
    level: config.logLevel
});

var methods = require('./lib/methods.js')(package);

var app = express();
app.listen(8080, function() {
    logger.info('service ready');
});

app.get('/', methods.sendPackage);
app.get('/hello', methods.sayHello);
app.post('/hello', bodyParser.json(), methods.sayHello);
app.get('/echo', methods.echoContext);
app.post('/echo', methods.echoContext);
