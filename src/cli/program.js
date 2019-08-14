#!/usr/bin/env node
const program = require('commander');
const ngrok = require('ngrok');
const open = require('open');
const { fork } = require('child_process');
const fs = require('fs');
const path = require('path');
const { promisify }= require('util');
const readFile = promisify(fs.readFile);

program
  .version('0.1.0');

program
  .command('login to Facebook')
  .description('Log in to your facebook account to get session token')
  .action(async (command, options) => {
    const url = await ngrok.connect(3000);
    console.log('We need you to login in order for us to get yours photos :)');
    console.log('Please log in at:')
    console.log(url);
    console.log('');
    console.log('Opening browser...');

    await delay(3000);

    await open(url);

    let child = fork(`${__dirname}/commands/login/worker.js`);
    child.on('message', (data) => {
      console.log('Got token!');
      child.kill('SIGKILL');
      process.exit(0);
    });
  });

program
  .command('download')
  .description('Downloads photos from your Facebook account')
  .option('-t, --tagged', 'from tagged photos')
  .option('-a, --albums', 'from user uploaded albums')
  .action(async (command, options) => {
    // pass token
    const filePath = path.resolve(__dirname, '.temp', 'user.json');
    const json = await readFile(filePath, 'utf8');
    const data = JSON.parse(json);
    let child = fork(`${__dirname}/commands/download/worker.js`, [data.token]);
    child.on('message', (data) => {
    })
  });

function delay(t, val) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(val);
    }, t);
  });
}

program.parse(process.argv);