/**
 * Created by dannyyassine
 */
require('../../../bootstrap');
const { CliController } = require('./CliController');

(async function () {
  const userToken = process.argv[2];
  const cliController = new CliController(userToken);
  await cliController.start();
})();