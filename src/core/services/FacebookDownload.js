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
const env = $get('env');

class FacebookDownload extends EventEmitter {

  constructor(userToken) {
    super();
    this.userToken = userToken;
    this.imagesFilePath = path.resolve(env.tempDirPath,  'images');

    this.downloadImage = new DownloadImage();
    this.archive = new Archive({
      deleteTargetFolder: true
    });
    this.archive.on('archive:start', output => {
      this.emit('archive:start', output);
    });

    this.archive.on('archive:end', output => {
      this.emit('archive:end', output);
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
      const filePath = path.resolve(env.appRoot, .cache, 'images', album.name);
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
      this.emit('album:download:start', album);
      const photos = album.getPhotosToDownload();
      for(let j = 0; j < photos.length; j++) {
        const photo = photos[j];
        this.emit('album:download:photo', photo, j);
        await this.downloadImage.download(photo, album.name, `picture-${j}.png`);
        album.setDownloadedPhoto(photo);
      }
      if (album.getNeedsToDownloadMorePhotos()) {
        await this.downloadMorePhotos(album);
      }
      this.emit('album:download:end', album);
    }
    return void 0;
  }

  async downloadMorePhotos(album) {
    const photos = await apiHelper.getAlbumPhotos(album, this.userToken);
    album.addPhotosToDownload(photos);
    const previousCount = album.getDownloadCount();
    for(let j = 0; j < photos.length; j++) {
      const photo = photos[j];
      this.emit('album:download:photo', photo, previousCount+j);
      await this.downloadImage.download(photo, album.name, `picture-${previousCount+j}.png`);
      album.setDownloadedPhoto(photo);
    }
    if (album.getNeedsToDownloadMorePhotos()) {
      await this.downloadMorePhotos(album);
    }
  }

  async archiveImages() {
    await this.archive.compress(this.imagesFilePath, this.imagesFilePath);
  }

  async tearDown() {
    await this.archive.deleteDirectory(this.imagesFilePath);
  }

}

module.exports = {
  FacebookDownload
};