#!/usr/bin/env node
const program = require('commander');

const login = require('./commands/login');
const download = require('./commands/download');

program
  .version('0.1.0');

login(program);
download(program);

program.parse(process.argv);