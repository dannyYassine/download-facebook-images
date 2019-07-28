/**
 * Created by dannyyassine
 */
const fs = require('fs');
const path = require('path');
const util = require('util');
const EventEmitter = require('events');
const mkdir = util.promisify(fs.mkdir);
const { Album } = require('../models/Album');
const { DownloadImage } = require('../helpers/DownloadImage');
const { Archive } = require('../helpers/Archive');
const apiHelper = require('../helpers/ApiHelper');
const fileHelper = require('../helpers/FileHelper');

class FacebookDownload extends EventEmitter {

  constructor(userToken) {
    super();
    this.userToken = userToken;
    this.imagesFilePath = path.resolve(__dirname, 'images');

    this.downloadImage = new DownloadImage();
    this.archive = new Archive({
      deleteTargetFolder: true
    });
  }

  async downloadUserPhotoAlbums() {
    try {
      await this.getAlbums();
      await this.createImagesDirectory();
      await this.createAlbumDirectories();
      await this.downloadPhotos();
      await this.archiveImages();
    } catch (e) {
      await this.tearDown();
      throw e;
    }
  }

  async getAlbums() {
    const albumsData = await apiHelper.getAllPhotoAlbums(this.userToken);
    this.albums = Album.decode(albumsData);
    return this.albums;
  }

  async createImagesDirectory() {
    await fileHelper.deleteDirectory(this.imagesFilePath);
    await mkdir(this.imagesFilePath);
    return void 0;
  }

  async createAlbumDirectories() {
    for(let i = 0; i < this.albums.length; i++) {
      const album = this.albums[i];
      const filePath = path.resolve(__dirname, 'images', album.name);
      const directoryExist = await fileHelper.directoryExists(filePath);
      if (!directoryExist) {
        mkdir(filePath);
      }
    }
    return void 0;
  }

  async downloadPhotos() {
    for(let i = 0; i < this.albums.length; i++) {
      const album = this.albums[i];
      this.emit('album:download', album);
      for(let j = 0; j < album.photos.length; j++) {
        const photo = album.photos[j];
        this.emit('album:download:photo', photo, j);
        await this.downloadImage.download(photo, album.name, `picture-${j}.png`);
        album.setDownloadedPhoto(photo);
      }
    }

    return void 0;
  }

  async archiveImages() {
    await this.archive.compress('images', 'images');
  }

  async tearDown() {
    await this.archive.deleteDirectory(this.imagesFilePath);
  }

}

module.exports = {
  FacebookDownload
};