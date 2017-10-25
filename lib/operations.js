"use strict";

var contextUtil = require('./context-util');

module.exports = function(pack) {
    return {
        sendPackage: function(request, response) {
            response.send({
                'package.json': pack,
                operations: [ 'greet', 'echo' ]
            });
        },
        greet: function(request, response) {
            var name = (request.body || {}).name || (request.query || {}).name;
            if (name) {
                response.send({
                    greeting: 'Hello, ' + name.charAt(0).toUpperCase() + name.slice(1) + '!'
                });
            } else {
                response.send({
                    greeting: 'Hello, World!',
                    hint: 'Try including a name in your request, either via query '
                        + 'parameter \'?name=foo\' or via POST \'{ name: "foo" }\''
                });
            }
        },
        echoContext: function(request, response) {
            return contextUtil.getContextFromHeader(request)
                .then(function(context) {
                    response.send(context);
                })
                .catch(function(reason) {
                    response.status(400).send({
                        error: reason
                    });
                });
        }
    };
};
