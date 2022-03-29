const {writeFile} = require('fs');
const {version} = require('./getPackage');

const versionVar = `VERSION=v${version}`;

module.exports = exports = writeFile(join(basepath, 'variables.env'), versionVar, (err, res) => {
  if (err)
    throw err;

  console.log('> Version - ', version);
});
