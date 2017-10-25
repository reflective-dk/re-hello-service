# Hello Service #

This module defines an example service on the Reflective Platform.

### Getting started ###

Follow these steps to get the code and check that the basic functionality is
working.

```
git clone git@github.com:reflective-dk/re-hello-service.git
cd reflective-lang-ast
npm install
npm test
node .
```

### Components ###

The aim of any service implementation is to expose logic through a defined set of
services and operations. This particular implementation does so using the set of
components described here.

#### Service module (this module) ####

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

#### Logic modules ####

Include any logic modules you want as dependencies using the `./package.json`
file as usual. Anything beyond routing should be in a separate logic module.

#### `./service-image` folder ####

This folder contains the Dockerfile for the service itself. It also includes a
`package.json` file which references the _service module_ (i.e. the overall
module hosted in this repository). It's a little messy but is structured this way
to keep down the number of repositories and artifacts.

#### `./test-image` folder ####

This folder contains the Dockerfile for _testing_ the service, _not_ a test
version of the service. In other words, it contains instructions on testing the
_service image_ and has a dependency on that.

It also includes a `package.json` and instructions to temporarily clone in the
_service module_ (again, the overall module hosted in this repository). This is
done to run the unit tests of the service module.

#### CircleCI configuration file ####

The CircleCi configuration file is located in `.circleci/config.yml` and it
defines the steps required to run the service and test images, run the tests, and
deploy the service.

### Additional steps ###

In order to build the project on CircleCI and get the service deployed on
Kubernetes, we need to go through the following steps.

#### CircleCI build settings ####

* Create an _Environment Variable_ called `GCLOUD_SERVICE_KEY` and set its value to
the contents of this file:
`7337-infrastructure/gcloud/ComputeEngineServiceAccount/based`.

#### Service configuration ####

When the build has been set up correctly and the service is running in a docker
image, it needs to be exposed to the outside world by adding a service
configuration to `7337-infrastructure/integration-config`. This is the
configuration for the _hello_ service (`hello-service.yml`):

```
apiVersion: v1
kind: Service
metadata:
  name: hello
  labels:
    name: hello
spec:
  type: LoadBalancer
  ports:
  - port: 8080
    name: health
  selector:
    name: hello
```

#### Kubernetes deployment ####

We also need to add a deployment configuration for Kubernetes in
`7337-infrastructure/kubernetes-config`. This is the deployment configuration for
the _hello_ service (`hello-deployment.yml`):

```
apiVersion: apps/v1beta1
kind: Deployment
metadata:
  name: hello
spec:
  replicas: 1
  template:
    metadata:
      labels:
        name: hello
    spec:
      containers:
      - name: hello
        image: gcr.io/city-7337/hello
        ports:
        - containerPort: 8080
          name: health
```

#### Deploying the service on a pod ####

Then we tell Kubernetes to deploy the service on a pod via the configuration
files added to the `7337-infrastructure` repository.

```
$ gcloud source repos clone infrastructure --project=city-7337
$ kubectl create -f ./infrastructure/kubernetes-config/hello-deployment.yml --save-config
$ kubectl create -f ./infrastructure/integration-config/hello-service.yml --save-config
$ kubectl set image deployment/hello hello=gcr.io/city-7337/hello:latest
$ kubectl delete pod -l name=hello
```

#### Other useful Kubernetes commands ####

```
kubectl describe pod -l name=hello
kubectl exec -ti hello-<specific pod name> /bin/sh
```
