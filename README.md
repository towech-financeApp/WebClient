# WebClient

![License: BSD-3-Clause](https://img.shields.io/github/license/towech-financeApp/WebClient)

WebClient for the Towech FinanceApp, it is created using reactJS and when used inside
a docker container, it utilizes nginx for serving it.

This webClient is created using as few component libraries as possible, the intention of this 
is to learn to create frontend apps entirely from scratch.

# Table of Contents
1. [Environment](#Environment)
2. [Installation](#Installation)
3. [Future improvements](#Future_Improvements)
4. [Credits](#Credits)

## Environment
The respository only uses one environment variable which is the url to the API service.
For the prod build, the url needs to be passed as an ARG to work.

## Installation

### Local instalation
To run this worker on local, node and npm are needed. This repository uses a git 
[submodel](https://github.com/towech-financeApp/Models), so them need to be downloaded 
as well: 

> git clone --recurse-submodules -j8 git://github.com/towech-financeApp/UserService.git

If the repo was already cloned, then use the command inside the folder:
> git submodule update --init --recursive

The install the dependencies from the package-lock file using the command:
> npm ci

To run the dev server:
> npm run start

### Docker
To run this worker on a docker container, first it needs to be built:

For development
> docker build towechFinance-WebClient . --target dev

For production
> docker build towechFinance-WebClient . --target --build-arg REACT_APP_WEBAPI=\<url>

## Future_Improvements
- [ ] Create a functional UI
- [ ] Create a decent looking UI

## Credits
- Jose Tow [[@Tow96](https://github.com/Tow96)]
