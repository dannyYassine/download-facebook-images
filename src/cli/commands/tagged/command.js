/**
 * Created by dannyyassine
 */
const { fork } = require('child_process');
const co = require('co');
const prompt = require('co-prompt');

module.exports = (program) => {
  return program
    .command('tagged')
    .description('Downloads your tagged photos ')
    .option('-e, --email <email>', 'Facebook email')
    .option('-p, --password <password>', 'Facebook password')
    .option('-u, --username <username>', 'Facebook username')
    .action(async (command) => {
      co(function *() {
        let { email, password, username } = command;

        if (!email) {
          email = yield prompt('email: ');
        }
        if (!username) {
          username = yield prompt('username: ');
        }
        if (!password) {
          password = yield prompt.password('password: ');
        }

        const child = fork(`${__dirname}/worker.js`, [email, password, username]);
        child.on('message', (data) => {
        })
      });
    })
    .on('--help', () => {
    });

  return program;
}