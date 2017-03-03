'use strict';

const path = require('path');

module.exports = function getExportSource(entry, babel, babelConfig) {
  function buildBabelConfig(plugin) {
    return Object.assign({}, babelConfig, {
      plugins: [plugin].concat(babelConfig.plugins),
    });
  }

  function findSourceFiles(expt) {
    return getExportPaths(expt.src) // eslint-disable-line
      .then((childExpts) => {
        if (expt.node.type === 'ExportAllDeclaration') {
          const ret = Object.assign({}, childExpts);
          delete ret.default;

          return ret;
        }

        if (expt.node.type === 'ExportNamedDeclaration') {
          return expt.node.specifiers.reduce((result, specifier) => {
            const member = {};
            member[specifier.exported.name] = childExpts[specifier.local.name];
            return Object.assign({}, result, member);
          }, {});
        }

        return Promise.reject(new Error('unexpected node type', expt.node.type));
      });
  }

  function getDeclaredNames(node) {
    if (!node.declaration) {
      return node.specifiers.map(specifier => specifier.exported.name);
    }

    if (node.declaration.type === 'FunctionDeclaration') {
      return [node.declaration.id.name];
    }

    if (node.declaration.type === 'VariableDeclaration') {
      return node.declaration.declarations.map(decl => decl.id.name);
    }

    throw new Error('unknown declaration');
  }

  function getExportPaths(file) {
    return new Promise((resolve, reject) => {
      const foreignExports = [];
      const localExports = {};

      function registerExport(p) {
        if (p.node.source && p.node.source.value && p.node.source.value.indexOf('.') === 0) {
          foreignExports.push({
            node: p.node,
            src: require.resolve(path.resolve(path.dirname(file), p.node.source.value)),
          });
        }
      }

      function findExports() {
        return {
          visitor: {
            ExportNamedDeclaration(p) {
              if (!p.node.source) {
                getDeclaredNames(p.node).forEach((name) => {
                  localExports[name] = file;
                });
              } else {
                registerExport(p);
              }
            },
            ExportAllDeclaration: registerExport,
            ExportDefaultDeclaration() {
              localExports.default = file;
            },
          },
        };
      }

      babel.transformFile(file, buildBabelConfig(findExports), (err) => {
        if (err) {
          return reject(err);
        }

        return Promise.all(
          foreignExports.map(findSourceFiles)
        ).then((results) => {
          return results.reduce((result, r) => {
            return Object.assign({}, result, r);
          }, {});
        })
        .then((resolvedForeignImports) => {
          const ret = Object.assign({}, resolvedForeignImports, localExports);
          return resolve(Object.keys(ret).reduce((r, key) => {
            if (ret[key]) {
              r[key] = ret[key]; // eslint-disable-line
            }

            return r;
          }, {}));
        });
      });
    });
  }

  return getExportPaths(entry);
};
