babel-get-export-sources
========================

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


