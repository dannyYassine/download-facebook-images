/**
 * Created by dannyyassine
 */
const fs = require('fs');
const child_process = require('child_process');
const util = require('util');

const access = util.promisify(fs.access);
const exec = util.promisify(child_process.exec);

class Archive {

  constructor(options = {}) {
    this.deleteTargetFolder = options.deleteTargetFolder || false;
  }

  async compress(folderNamePath, outputName = null) {
    if (!outputName) {
      outputName = folderNamePath;
    }
    await this.startZip(folderNamePath, outputName);
    if (this.deleteTargetFolder) {
      await this._deleteOutputFolder(outputName);
    }
  }

  startZip(folderNamePath, outputName) {
    return new Promise((resolve, reject) => {
      console.log(folderNamePath, outputName);
      const zip = child_process.spawn('zip', [
        `-r`,
        `${folderNamePath}.zip`,
        outputName
      ]);

      zip.stdout.on('data', function (data) {
        console.log(`Archiver: ${data.toString()}`);
      });

      zip.stderr.on('data', function (data) {
        console.log(`Archiver ERROR: ${data.toString()}`);
      });

      zip.on('exit', function (code) {
        resolve();
      });

      zip.on('error', function (code) {
        reject();
      });
    });
  }

  async _deleteOutputFolder(outputPath) {
    try {
      await access(outputPath);
      await exec(`rm -rf ${outputPath}`)
    } catch (e) {
    }
    return void 0;
  }

  async deleteDirectory(directoryPath) {
    await exec(`rm -rf ${directoryPath}`);
  }
}

module.exports = {
  Archive
};