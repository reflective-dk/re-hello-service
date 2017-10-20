"use strict";

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

var mockPackage = { foo: 'bar' };
var operations = require.main.require('lib/operations')(mockPackage);

describe('hello-service', () => {
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
