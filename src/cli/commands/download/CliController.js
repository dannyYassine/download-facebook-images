const cliProgress = require('cli-progress');

const { FacebookDownload } = use('@/core/services/FacebookDownload');
const { ExtractTaggedPhotos } = use('@/core/services/ExtractTaggedPhotos');

class CliController {

  constructor(userToken) {
    this.facebookDownload = new FacebookDownload(userToken);
    this.cli = new cliProgress.Bar({}, cliProgress.Presets.shades_grey);
  }

  /**
   * @returns {Promise<void>}
   */
  async start() {
    
    try {
      this.facebookDownload.on('album:download:start', album => {
        console.log(`Album: ${album.name} (${album.count} photos)`);
        this.cli.start(album.count, 0);
      });

      this.facebookDownload.on('album:download:end', album => {
        this.cli.update(album.count);
        console.log('');
        this.cli.stop();
      });

      this.facebookDownload.on('album:download:photo', (photo, index) => {
        this.cli.update(index+1);
      });

      this.facebookDownload.on('archive:start', () => {
        console.log('Archiving...');
      });

      await this.facebookDownload.downloadUserPhotoAlbums();
    } catch (e) {
      console.log(`ERROR: ${e.message}`);
    }
  }
}

module.exports = {
  CliController
};