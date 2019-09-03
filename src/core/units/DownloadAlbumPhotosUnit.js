/**
 * Created by dannyyassine
 */
const { Operation } = require('operationkit');
const { DownloadImage } = require('../helpers/DownloadImage');

class DownloadAlbumPhotosUnit extends Operation {

  constructor() {
    super();
    this.downloadImage = new DownloadImage();
  }

  /**
   * @param value
   */
  setAlbums(value) {
    this.albums = value;
  }

  /**
   * @returns {Promise<*>}
   */
  async run() {
    for(let i = 0; i < this.albums.length; i++) {
      const album = this.albums[i];
      this.emit('album:download:start', album);
      for(let j = 0; j < album.photos.length; j++) {
        const photo = album.photos[j];
        this.emit('album:download:photo', photo, j);
        await this.downloadImage.download(photo, album.name, `picture-${j}.png`);
        album.setDownloadedPhoto(photo);
      }
      this.emit('album:download:end', album);
    }
    return void 0;
  }
}

module.exports = {
  DownloadAlbumPhotosUnit
};