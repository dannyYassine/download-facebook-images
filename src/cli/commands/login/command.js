/**
 * Created by dannyyassine
 */
const open = require('open');
const { fork } = require('child_process');
const fs = require('fs');
const { promisify }= require('util');
const writeFile = promisify(fs.writeFile);
const ngrok = require('ngrok');
const path = require('path');

module.exports = (program) => {
  return program
    .command('login')
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

      let child = fork(`${__dirname}/worker.js`);
      child.on('message', async (data) => {
        const { token } = data;
        const filePath = path.resolve(__dirname, '../../', '.temp', 'user.json');
        await writeFile(filePath, JSON.stringify({ token }), 'utf8');

        console.log('Got token!');
        child.kill('SIGKILL');

        console.log('now run: \'fb-download albums\' to get your albums!');

        process.exit(0);
      });
    });
}

function delay(t, val) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(val);
    }, t);
  });
}