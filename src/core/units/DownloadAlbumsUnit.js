/**
 * Created by dannyyassine
 */
const { Operation } = require('operationkit');
const apiHelper = require("../helpers/ApiHelper");

class DownloadAlbumsUnit extends Operation {

  constructor(userToken) {
    super();
    this.userToken = userToken;
  }

  async run() {
    const albumsData = await apiHelper.getAllPhotoAlbums(this.userToken);
    return Album.decode(albumsData);
  }

}

module.exports = {
  DownloadAlbumsUnit
};