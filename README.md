[![Banner](./assets/banner.png)](https://www.glass-h2020.eu/)

![Licence](https://img.shields.io/github/license/TiagoVenceslau/injectable-decorators.svg)
![GitHub language count](https://img.shields.io/github/languages/count/TiagoVenceslau/injectable-decorators?style=plastic)
![GitHub top language](https://img.shields.io/github/languages/top/TiagoVenceslau/injectable-decorators?style=plastic)
[![CodeQL](https://github.com/starnowski/posmulten/workflows/CodeQL/badge.svg)](https://github.com/TiagoVenceslau/injectable-decorators/actions?query=workflow%3ACodeQL)


## Injectable Decorators

Simple implementation of injectables

### Installation

In order to use the injectable decorators package, we need to follow a list of steps presented below.

##### Step 1: Run npm install

To install as a dependency do:
```sh
$ npm install @tvenceslau/injectable-decorators
```

To install as a dev dependency do:
```sh
$ npm install @tvenceslau/injectable-decorators --save-dev
```
instead.




### Repository Structure

```
injectable-decorators
│
│   .gitignore              <-- Defines files ignored to git
│   .gitlab-ci.yml          <-- GitLab CI/CD config file
│   .nmpignore              <-- Defines files ignored by npm
│   .nmprc                  <-- Defines the Npm registry for this package
│   gulpfile.js             <-- Gulp build scripts. used in the 'build' and 'build:prod' npm scripts
│   jest.config.js          <-- Tests Configuration file
│   jsdocs.json             <-- Documentation generation configuration file
│   LICENCE.md              <-- Licence disclamer
│   nodemon.json            <-- Nodemon config file (allows to live test ts files)
│   package.json
│   package-lock.json
│   README.md               <-- Readme File dynamically compiled from 'workdocs' via the 'docs' npm script
│   tsconfig.json           <-- Typescript config file. Is overriden in 'gulpfile.js' 
│
└───bin
│   │   tag_release.sh      <-- Script to help with releases
│   
└───docs
│   │   ...                 <-- Dinamically generated folder, containing the compiled documentation for this repository. generated via the 'docs' npm script
│   
└───src
│   │   ...                 <-- Source code for this repository
│   
└───tests
│   │   ...                 <-- Test sources for this repository
│   
└───workdocs                <-- Folder with all pre-compiled documentation
|    │   ...
|    │   Readme.md           <-- Entry point to the README.md   
|
└───dist
|    |  ...                 <-- Dinamically generated folder containing the bundles for distribution
|
└───lib
    |   ...                 <-- Dinamically generated folder containing the compiled code
```

### Repository Languages

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![ShellScript](https://img.shields.io/badge/Shell_Script-121011?style=for-the-badge&logo=gnu-bash&logoColor=white)


### Related

[decorator-validation](https://github.com/TiagoVenceslau/decorator-decorators)

[db-decorators](https://github.com/TiagoVenceslau/db-decorators)


### Social

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://pt.linkedin.com/in/TiagoVenceslau)