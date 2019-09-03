/**
 * Created by dannyyassine
 */
const fs = require('fs');
const child_process = require('child_process');
const util = require('util');
const EventEmitter = require('events');

const access = util.promisify(fs.access);
const exec = util.promisify(child_process.exec);
const env = $get('env');

class Archive extends EventEmitter {

  constructor(options = {}) {
    super();
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
      this.emit(folderNamePath, outputName);
      this.emit('archive:start');
      const zip = child_process.spawn('zip', [
        `-r`,
        `${folderNamePath}.zip`,
        outputName
      ], {
        cwd: env.appRoot
      });

      zip.stdout.on('data', data => {
        this.emit('archive:data', `${data.toString()}`);
      });

      zip.stderr.on('data', data => {
        this.emit('archive:error', `${data.toString()}`);
      });

      zip.on('exit', code => {
        this.emit('archive:end', code);
        resolve(code);
      });

      zip.on('error', code => {
        this.emit('archive:error', code);
        reject(code);
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