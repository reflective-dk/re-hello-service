"use strict";

var Promise = require('bluebird');

module.exports = {
  getContextFromHeader: (request) => {
    var context = {};
    var contextString = request.header("context");
    if (!contextString || contextString.length == 0) {
      return Promise.reject('{"status": [{"severity": "error", "message": "missing header \'context\'"}]}');
    } else {
      try {
        context = JSON.parse(contextString);
      } catch (error) {
        return Promise.reject('{"status": [{"severity": "error", "message": "header \'context\' should be valid JSON"}]}');
      }
    }
    return Promise.resolve(context);
  }
};
