/**
 * Created by dannyyassine
 */
const { BlockOperation } = require('operationkit');

const { BaseWorker } = require('./BaseWorker');
const { DownloadAlbumsUnit }  = require('../units/DownloadAlbumsUnit');
const { CreateDirectoryUnit } = require('../units/CreateDirectoryUnit');
const { DownloadAlbumPhotosUnit } = require('../units/DownloadAlbumPhotosUnit');
const { CreateAlbumDirectoriesUnit } = require('../units/CreateAlbumDirectoriesUnit');
const { CompressDirectoryUnit } = require('../units/CompressDirectoryUnit');

const env = $get('env');

class FacebookPhotosDownloadWorker extends BaseWorker {

  main() {
    const downloadAlbums = new DownloadAlbumsUnit(process.env.USER_TOKEN);
    const createImagesDirectory = new CreateDirectoryUnit(env.imagesDirPath);

    const createAlbumPhotosDirectory = new CreateAlbumDirectoriesUnit(env.imagesDirPath);

    const downloadPhotos = new DownloadAlbumPhotosUnit();

    const bridgeOperation = new BlockOperation(() => {
      createAlbumPhotosDirectory.setAlbums(downloadAlbums.result);
      downloadPhotos.setAlbums(downloadAlbums.result);
    });

    const compressDirectoryUnit = new CompressDirectoryUnit(env.imagesDirPath);

    bridgeOperation.dependencies = [
      downloadAlbums,
      createImagesDirectory
    ];
    createAlbumPhotosDirectory.dependencies = [
      bridgeOperation
    ];
    downloadPhotos.dependencies = [
      createAlbumPhotosDirectory
    ];
    compressDirectoryUnit.dependencies = [
      downloadPhotos
    ];

    this.setOperations([
      downloadAlbums,
      createImagesDirectory,
      createAlbumPhotosDirectory,
      downloadPhotos,
      bridgeOperation,
      compressDirectoryUnit
    ]);
  }
}

module.exports = {
  FacebookPhotosDownloadWorker
};