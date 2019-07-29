/**
 * Created by dannyyassine
 */
const { Operation } = require('operationkit');
const fileHelper = require('../helpers/FileHelper');

class CreateAlbumDirectoriesUnit extends Operation {

  /**
   * @param {Album} albums
   * @param {string} directoryFilePath
   */
  constructor(albums, directoryFilePath) {
    super();
    this.albums = albums;
    this.directoryFilePath = directoryFilePath;
  }

  /**
   * @returns {Promise<*>}
   */
  async run() {
    for(let i = 0; i < this.albums.length; i++) {
      const album = this.albums[i];
      const filePath = path.resolve(this.directoryFilePath, album.name);
      const directoryExist = await fileHelper.directoryExists(filePath);
      if (!directoryExist) {
        await fileHelper.mkDir(filePath);
      }
    }
    return void 0;
  }
}

module.exports = {
  CreateAlbumDirectoriesUnit
};
