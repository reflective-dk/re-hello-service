"use strict";

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var rp = require('request-promise');

var serviceUrl = 'http://hello';

describe('hello service', () => {
    describe('greet', () => {
        it('should greet anonymous caller', function(done) {
            expect(rp({ uri: serviceUrl + '/greet', json: true }))
                .to.eventually.include({ greeting: 'Hello, World!' })
                .and.have.property('hint').that.matches(/^Try including a name/)
                .notify(done);
        });
        it('should say hello to name via query parameter', function(done) {
            expect(rp({ uri: serviceUrl + '/greet?name=foo', json: true }))
                .to.eventually.include({ greeting: 'Hello, Foo!' })
                .and.not.to.have.property('hint').notify(done);
        });
        it('should say hello to name via post body', function(done) {
            expect(rp({
                uri: serviceUrl + '/greet',
                method: 'POST',
                body: { name: 'foo' },
                json: true
            })).to.eventually.include({ greeting: 'Hello, Foo!' })
                .and.not.to.have.property('hint').notify(done);
        });
    });
});
