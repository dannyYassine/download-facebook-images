/**
 * Created by dannyyassine
 */
const { fork } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const readFile = promisify(fs.readFile);

module.exports = (program) => {
  return program
    .command('albums')
    .description('Downloads photos from your Facebook account')
    .action(async (option, cmd) => {
      // pass token
      const filePath = path.resolve(__dirname, '../..', '.cache', 'user.json');
      const json = await readFile(filePath, 'utf8');
      const data = JSON.parse(json);
      const child = fork(`${__dirname}/worker.js`, [data.token]);
      child.on('message', (data) => {
      })
    })
    .on('--help', () => {
    });
}