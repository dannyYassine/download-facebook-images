require('../bootstrap');
const { CliController } = require('./CliController');

(async function () {
  const cliController = new CliController();
  await cliController.start();
})();
