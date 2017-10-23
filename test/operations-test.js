"use strict";

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

var mockPackage = { foo: 'bar' };
var mockContext = { foo: 'bar' };
var operations = require.main.require('lib/operations')(mockPackage);

describe('hello-service', () => {
    describe('sendPackage', function() {
        it('should return package.json and a set of services', function() {
            expect(capture(operations.sendPackage, {}))
                .to.deep.include({
                    'package.json': mockPackage,
                    operations: [ 'hello', 'echo' ]
                });
        });
    });

    describe('sayHello', function() {
        it('should say hello to anonymous caller', function() {
            expect(capture(operations.sayHello, {}))
                .to.include({ greeting: 'Hello, World!' })
                .and.to.have.property('hint').that.matches(/^Try including a name/);
        });
        it('should say hello to name via query parameter', () => {
            expect(capture(operations.sayHello, { query: { name: 'foo' } }))
                .to.include({ greeting: 'Hello, Foo!' })
                .and.not.to.have.property('hint');
        });
        it('should say hello to name via post body', () => {
            expect(capture(operations.sayHello, { body: { name: 'foo' } }))
                .to.include({ greeting: 'Hello, Foo!' })
                .and.not.to.have.property('hint');
        });
    });

    describe('echoContext', function() {
        it('should echo the context from the request header', function(done) {
            expect(pcapture(operations.echoContext, {
                header: function() { return JSON.stringify(mockContext); }
            })).to.eventually.deep.become(mockContext).notify(done);
        });
        it('should return an error when the context is missing', function(done) {
            expect(pcapture(operations.echoContext, { header: function() {} }))
                .to.eventually.have.property('error').notify(done);
        });
        it('should return an error when the context is not json', function(done) {
            expect(pcapture(operations.echoContext, {
                header: function() { return 'My name is Jason, not json.'; }
            })).to.eventually.have.property('error').notify(done);
        });
    });
});

function capture(op, request) {
    var result;
    op(request, { send: function(r) { result = r; } });
    return result;
}

function pcapture(op, request) {
    var result;
    return op(request, { send: function(r) { result = r; } })
        .then(function() { return result; });
}
