/**
 * Created by dannyyassine
 */
const { Model } = require('./Model');
const { Photo } = require('./Photo');

class Album extends Model {

  constructor(model = {}) {
    super(model);

    this.id = model.id;
    this.count = model.count || 0;
    this.name = model.name || 'unknown_album';
    this.photos = model.photos ? Photo.decode(model.photos) : [];
    this.name = this.name.replace(/\//g, '-');

    this._undownloadedPhotos = {};
    this._downloadedPhotos = {};

    this.addPhotosToDownload(this.photos);
  }

  get needsToDownloadMorePhotos() {
    return this.count !== (Object.keys(this._undownloadedPhotos).length + Object.keys(this._downloadedPhotos).length);
  }

  getPhotosToDownload() {
    return this.photos.filter(photo => {
      return !!this._undownloadedPhotos[photo.id];
    });
  }

  setDownloadedPhoto(photo) {
    delete this._undownloadedPhotos[photo.id];
    this._downloadedPhotos[photo.id] = true;
  }

  addPhotosToDownload(photos) {
    this.photos = this.photos.concat(photos);
    photos.forEach(photo => {
      this._undownloadedPhotos[photo.id] = true;
    });
  }
}

module.exports = {
  Album
};