/**
 * Created by dannyyassine
 */
const { fork } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const readFile = promisify(fs.readFile);

module.exports = (program) => {
  program
    .command('download')
    .description('Downloads photos from your Facebook account')
    .option('-t, --tagged', 'from tagged photos')
    .option('-a, --albums', 'from user uploaded albums')
    .action(async (command, options) => {
      // pass token
      const filePath = path.resolve(__dirname, '../..', '.temp', 'user.json');
      const json = await readFile(filePath, 'utf8');
      const data = JSON.parse(json);
      let child = fork(`${__dirname}/worker.js`, [data.token]);
      child.on('message', (data) => {
      })
    });
}