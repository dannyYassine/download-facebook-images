#!/usr/bin/env node
const program = require('commander');

const login = require('./commands/login');
const albums = require('./commands/albums');
const tagged = require('./commands/tagged');

program
  .version('0.1.0');

login(program);
albums(program);
tagged(program);

program.parse(process.argv);