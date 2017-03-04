babel-get-export-sources
========================

[![Build Status](https://travis-ci.org/Xiphe/babel-get-export-sources.svg?branch=master)](https://travis-ci.org/Xiphe/babel-get-export-sources)
[![Coverage Status](https://coveralls.io/repos/github/Xiphe/babel-get-export-sources/badge.svg?branch=master)](https://coveralls.io/github/Xiphe/babel-get-export-sources?branch=master)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

get all local module files that are exported by a package


install
-------

`npm i es6-get-export-source`


use
---

```js
const path = require('path');
const getExportSources = require('babel-get-export-sources');
const babel = require('babel-core');
const mainFile = path.resolve(__dirname, require('./package.json').main);
const babelConfig = {
  presets: [
    'babel-preset-es2015',
    'babel-preset-es2016'
  ],
  plugins: [
    'transform-object-rest-spread',
  ]
};

getExportSources(mainFile, babel, babelConfig).then((result) => {
  console.log(result);
  /*
  {
    default: '/Users/xiphe/[...]/somePackage/src/DefaultComponent.js',
    HelperComponent: '/Users/xiphe/[...]/somePackage/src/lib/HelperComponent.js'
  }
  */
}, (error) => {
  /* do s.th. with error */
});
```


