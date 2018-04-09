/* eslint-env jasmine */

'use strict';

const path = require('path');
const babel = require('babel-core');
const babelGetExportSources = require('../src');

const babelConfig = {
  presets: ['es2015', 'es2016', 'flow'],
  plugins: [],
};

function getExportSources(relativePath) {
  return babelGetExportSources(
    path.resolve(__dirname, 'project', relativePath),
    babel,
    babelConfig
  );
}

function prependPaths(exportsObj) {
  return Object.keys(exportsObj).reduce((result, exportKey) => {
    return Object.assign({}, result, {
      [exportKey]: path.resolve(__dirname, 'project', exportsObj[exportKey]),
    });
  }, {});
}

describe('babel-get-export-sources', () => {
  describe('failure states', () => {
    it('escalates babel transform errors', (done) => {
      const someError = new Error('some error');
      const fakeBabel = {
        transformFile(f, c, cb) {
          cb(someError);
        },
      };

      babelGetExportSources('./foo', fakeBabel, babelConfig)
        .then(fail)
        .catch((err) => {
          expect(err).toBe(someError);
          done();
        });
    });
  });

  it('finds local default export of a file', (done) => {
    getExportSources('Component.js')
      .then((result) => {
        expect(result).toEqual(prependPaths({
          default: 'Component.js',
        }));
        done();
      })
      .catch(fail);
  });

  it('finds local named exports of a file', (done) => {
    getExportSources('constants.js')
      .then((result) => {
        expect(result).toEqual(prependPaths({
          ONE: 'constants.js',
          TWO: 'constants.js',
          THREE: 'constants.js',
        }));
        done();
      })
      .catch(fail);
  });

  it('finds local n-var named exports of a file', (done) => {
    getExportSources('multiDeclarations.js')
      .then((result) => {
        expect(result).toEqual(prependPaths({
          foo: 'multiDeclarations.js',
          bar: 'multiDeclarations.js',
        }));
        done();
      })
      .catch(fail);
  });

  it('finds local named function exports of a file', (done) => {
    getExportSources('function.js')
      .then((result) => {
        expect(result).toEqual(prependPaths({
          lorem: 'function.js',
        }));
        done();
      })
      .catch(fail);
  });

  it('finds local named class exports of a file', (done) => {
    getExportSources('class.js')
      .then((result) => {
        expect(result).toEqual(prependPaths({
          Foo: 'class.js',
        }));
        done();
      })
      .catch(fail);
  });

  it('finds foreign named exports of a file', (done) => {
    getExportSources('allConstantsProxy.js')
      .then((result) => {
        expect(result).toEqual(prependPaths({
          ONE: 'constants.js',
          TWO: 'constants.js',
          THREE: 'constants.js',
        }));
        done();
      })
      .catch(fail);
  });

  it('finds foreign default export of a file', (done) => {
    getExportSources('defaultProxy.js')
      .then((result) => {
        expect(result).toEqual(prependPaths({
          default: 'Component.js',
        }));
        done();
      })
      .catch(fail);
  });

  it('finds renamed default export of a file', (done) => {
    getExportSources('renamedDefaultProxy.js')
      .then((result) => {
        expect(result).toEqual(prependPaths({
          default: 'constants.js',
        }));
        done();
      })
      .catch(fail);
  });

  it('finds renamed export of a file', (done) => {
    getExportSources('renamedProxy.js')
      .then((result) => {
        expect(result).toEqual(prependPaths({
          Component: 'Component.js',
        }));
        done();
      })
      .catch(fail);
  });

  it('finds foreign subset exports of a file', (done) => {
    getExportSources('renamedSubsetProxy.js')
      .then((result) => {
        expect(result).toEqual(prependPaths({
          ONE: 'multiDeclarations.js',
          THREE: 'Component.js',
        }));
        done();
      })
      .catch(fail);
  });

  it('ignores unknown foreign exports', (done) => {
    getExportSources('unknownProxy.js')
      .then((result) => {
        expect(result).toEqual({});
        done();
      })
      .catch(fail);
  });

  it('finds sources through recursion', (done) => {
    getExportSources('proxyProxy.js')
      .then((result) => {
        expect(result).toEqual(prependPaths({
          TWO: 'constants.js',
        }));
        done();
      })
      .catch(fail);
  });

  it('ignores exports of other modules', (done) => {
    getExportSources('moduleProxy.js')
      .then((result) => {
        expect(result).toEqual({});
        done();
      })
      .catch(fail);
  });

  it('finds indirect proxy exports', (done) => {
    getExportSources('indirectDefaultProxy.js')
      .then((result) => {
        expect(result).toEqual(prependPaths({
          default: 'constants.js',
        }));
        done();
      })
      .catch(fail);
  });

  it('finds indirect foreign exports', (done) => {
    getExportSources('IndirectComponent.js')
      .then((result) => {
        expect(result).toEqual(prependPaths({
          default: 'function.js',
        }));
        done();
      })
      .catch(fail);
  });

  it('finds exported type alias', (done) => {
    getExportSources('typeAlias.js')
      .then((result) => {
        expect(result).toEqual(prependPaths({
          Foo: 'typeAlias.js',
        }));
        done();
      })
      .catch(fail);
  });
});
