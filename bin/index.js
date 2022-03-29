#!/usr/bin/env node
'use strict';

const {argv} = require('yargs');
const upload = require('../lib/upload')
const getVersion = require('../lib/getVersion')
const deploy = require('../lib/deploy')

if (argv.version)
  getVersion();
else if (argv.upload)
  upload();
else if (argv.deploy)
  deploy()

console.log(argv);