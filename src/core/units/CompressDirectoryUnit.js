/**
 * Created by dannyyassine
 */
const { Operation } = require('operationkit');
const { Archive } = require('../helpers/Archive');

class CompressDirectoryUnit extends Operation {

  constructor() {
    super();
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

  /**
   * @returns {Promise<void>}
   */
  async run() {
    await this.archive.compress(this.imagesFilePath, this.imagesFilePath);
  }
}

module.exports = {
  CompressDirectoryUnit
};