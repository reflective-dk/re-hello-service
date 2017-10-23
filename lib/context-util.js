"use strict";

var Promise = require('bluebird');

module.exports = {
    getContextFromHeader: (request) => {
        var contextString = request.header('context');
        if (!contextString || contextString.length == 0) {
            return Promise.reject('{"status": [{"severity": "error", "message": "missing header \'context\'"}]}');
        }
        try {
            return Promise.resolve(JSON.parse(contextString));
        } catch (error) {
            return Promise.reject('{"status": [{"severity": "error", "message": "header \'context\' should be valid JSON"}]}');
        }
    }
};
