/**
 * Created by dannyyassine
 */
const fs = require('fs');
const child_process = require('child_process');
const util = require('util');
const exec = util.promisify(child_process.exec);
const access = util.promisify(fs.access);

class FileHelper {

  /**
   * Deletes directory
   *
   * @param dir
   * @returns {Promise<void>}
   */
  async deleteDirectory(dir) {
    await exec(`rm -rf ${dir}`);
  }

  /**
   * Check if the file exists in the current directory.
   *
   * @param dir
   * @returns {Promise<boolean>}
   */
  async directoryExists(dir) {
    try {
      await access(file, fs.constants.F_OK);
      return true;
    } catch (e) {
      return false
    }
  }
 }

 module.exports = new FileHelper();