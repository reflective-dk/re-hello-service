"use strict";

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

var mockPackage = { foo: 'bar' };
var mockContext = { foo: 'bar' };
var operations = require.main.require('lib/operations')(mockPackage);

describe('hello service', () => {
    describe('sendPackage', function() {
        it('should return package.json and a set of services', function() {
            expect(capture(operations.sendPackage, {}).body)
                .to.deep.include({
                    'package.json': mockPackage,
                    operations: [ 'greet', 'echo' ]
                });
        });
    });

    describe('greet', function() {
        it('should say hello to anonymous caller', function() {
            expect(capture(operations.greet, {}).body)
                .to.include({ greeting: 'Hello, World!' })
                .and.to.have.property('hint').that.matches(/^Try including a name/);
        });
        it('should say hello to name via query parameter', () => {
            expect(capture(operations.greet, { query: { name: 'foo' } }).body)
                .to.include({ greeting: 'Hello, Foo!' })
                .and.not.to.have.property('hint');
        });
        it('should say hello to name via post body', () => {
            expect(capture(operations.greet, { body: { name: 'foo' } }).body)
                .to.include({ greeting: 'Hello, Foo!' })
                .and.not.to.have.property('hint');
        });
    });

    describe('echoContext', function() {
        it('should echo the context from the request header', function(done) {
            expect(pcapture(operations.echoContext, {
                header: function() { return JSON.stringify(mockContext); }
            })).to.eventually.deep.include({ body: mockContext }).notify(done);
        });
        it('should return status code 400 and an error when the context is missing',
           function(done) {
               expect(pcapture(operations.echoContext, { header: function() {} }))
                   .to.eventually.include({ status: 400 })
                   .and.have.nested.property('body.error').notify(done);
           });
        it('should return status code 400 and an error when the context is not json',
           function(done) {
               expect(pcapture(operations.echoContext, {
                   header: function() { return 'My name is Jason, not json.'; }
               })).to.eventually.include({ status: 400 })
                   .and.have.nested.property('body.error').notify(done);
           });
    });
});

function capture(op, request) {
    var response = {
        status: function(s) { response.status = s; return response; },
        send: function(r) { response.body = r; return response; }
    };
    op(request, response);
    return response;
}

function pcapture(op, request) {
    var response = {
        status: function(s) { response.status = s; return response; },
        send: function(r) { response.body = r; return response; }
    };

    return op(request, response).then(function() { return response; });
}
