require('../bootstrap');
const { CliController } = require('./CliController');

(async function () {
  const cliController = new CliController();
  await cliController.start();
})();

//
// require('../bootstrap');
// const { CliController } = require('./CliController');
// const {AlbumDownloadService} = require('../core/services/AlbumDownloadService');
// (async function () {
//   const albumDownloadService = new AlbumDownloadService();
//   await albumDownloadService.downloadAll();
// })();
//
