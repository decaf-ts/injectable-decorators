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