/**
 * Created by dannyyassine
 */
const path = require('path');

module.exports = {
  appRoot: appRoot,
  tempDirPath: path.resolve(appRoot, .cache),
  imagesDirPath: path.resolve(appRoot, .cache, 'images'),
};