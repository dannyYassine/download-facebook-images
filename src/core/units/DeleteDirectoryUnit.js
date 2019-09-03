/**
 * Created by dannyyassine
 */
const { Operation } = require('operationkit');

const fileHelper = require('../helpers/FileHelper');

class DeleteDirectoryUnit extends Operation {

  constructor(directoryFilePath) {
    super();
    this.directoryFilePath = directoryFilePath;
  }

  /**
   * @returns {Promise<*>}
   */
  async run() {
    await fileHelper.deleteDirectory(this.directoryFilePath);
    return void 0;
  }
}

module.exports = {
  DeleteDirectoryUnit
};