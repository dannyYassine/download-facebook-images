const { FacebookPhotosDownloadWorker } = require('../workers/FacebookPhotosDownloadWorker');

class AlbumDownloadService {

		constructor() {
			this.worker = null;
		}

    async downloadAll() {
      this.worker = new FacebookPhotosDownloadWorker();
      await this.worker.execute();
    }

}

module.exports = {
  AlbumDownloadService
};