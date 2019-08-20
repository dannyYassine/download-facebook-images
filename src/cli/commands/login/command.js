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
      const port = 3000;
      const url = await ngrok.connect(port);
      console.log('We need you to login in order for us to get yours photos :)');
      await delay(3000);
      console.log('Please log in at:')
      console.log(url);
      await delay(1000);
      console.log('');
      console.log('Opening browser...');
      await delay(2000);

      await open(url);

      let child = fork(`${__dirname}/worker.js`, [port]);
      child.on('message', async (data) => {
        const { token } = data;
        const filePath = path.resolve(__dirname, '../../', '.cache', 'user.json');
        await writeFile(filePath, JSON.stringify({ token }), 'utf8');

        child.kill('SIGKILL');

        console.log('Got token!');
        console.log('');

        console.log('now run: \'fb-media albums\' to get your albums!');
        console.log('or');
        console.log('run: \'fb-media tagged\' to get your tagged photos!');

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