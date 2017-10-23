# Hello Service #

This module defines an example service on the Reflective Platform.

### In action ###

```
git clone git@github.com:reflective-dk/re-hello-service.git
cd reflective-lang-ast
npm install
npm test
```

### Components ###

The aim of any service implementation is to expose logic through a defined set of
services and operations. This particular implementation does so using the set of
components described here.

#### The service module (this module) ####

Think of this module as the _controller_ in a Model-View-Controller (MVC) scenario.
The _model_ is made up of separate logic modules and the _view_ is the set of
HTTP services and operations.

The code necessary to map logic to specific services and operations belongs in
this module. It is a standard NPM module, so put any code needed in the `./lib`
folder and put the code required to start up the service in the `./index.js`
file. This implementation uses `express` to do the _routing_ but in principle,
any framework could be used.

And like any other NPM module, put your tests in the `./test` folder and set it
up to run with `npm test`.

Don't put any advanced logic in this module, just like you wouldn't put business
logic in your _controller_ in MVC.

#### The logic modules ####

Include any logic modules you want as dependencies using the `./package.json`
file as usual. Anything beyond routing should be in a separate logic module.

#### The `service-image` folder ####

#### The `test-image` folder ####

#### The CircleCI configuration ####

The CircleCi configuration file is located in `.circleci/config.yml` and it
defines the steps required to set up a docker image with the service and test
images, run the tests, and deploy the service.
