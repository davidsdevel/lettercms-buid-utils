const {join} = require('path');

module.exports = exports = (() => {
  const basepath = process.cwd();

  const packagePath = join(basepath, 'package.json');

  return require(packagePath);
})();