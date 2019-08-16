const cliProgress = require('cli-progress');
const { ExtractTaggedPhotos } = use('@/core/services/ExtractTaggedPhotos');

class TaggedController {

  constructor(email, password, facebookUserName) {
    this.total = 0;
    this.extractTaggedPhotos = new ExtractTaggedPhotos(email, password, facebookUserName);
    this.cli = new cliProgress.Bar({}, cliProgress.Presets.shades_grey);
  }

  /**
   * @returns {Promise<void>}
   */
  async start() {

    try {
      this.extractTaggedPhotos.on('download:step', message => {
        console.log(message);
      });

      this.extractTaggedPhotos.on('album:download:start', ({ total }) => {
        this.total = total;
        console.log(`Starting to download ${total} photos)`);
        this.cli.start(total, 0);
      });

      this.extractTaggedPhotos.on('album:download:end', () => {
        this.cli.update(this.total);
        console.log('');
        this.cli.stop();
      });

      this.extractTaggedPhotos.on('album:download:photo', ({url, index}) => {
        this.cli.update(index+1);
      });

      this.extractTaggedPhotos.on('archive:start', () => {
        console.log('Archiving...');
      });

      await this.extractTaggedPhotos.start();
    } catch (e) {
      console.log(`ERROR: ${e.message}`);
    }
  }
}

module.exports = {
  TaggedController
};