/**
 * Created by dannyyassine
 */
const { Operation } = require('operationkit');

class DownloadImageUnit extends Operation {

  constructor(photo, downloadPath) {
    super();
    this.photo = photo;
    this.downloadPath = downloadPath;
  }

  async run() {
    await this.downloadImage.downloadAtPath(this.photo, this.downloadPath);
  }

}

module.exports = {
  DownloadImageUnit
};