/**
 * Created by dannyyassine
 */
require('../../../bootstrap');
const { TaggedController } = require('./TaggedController');

(async function () {
  const [,,email, password, username] = process.argv;
  const taggedController = new TaggedController(email, password, username);
  await taggedController.start();
})();