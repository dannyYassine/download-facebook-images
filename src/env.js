/**
 * Created by dannyyassine
 */
const path = require('path');

module.exports = {
  appRoot: appRoot,
  tempDirPath: path.resolve(appRoot, '.temp'),
  imagesDirPath: path.resolve(appRoot, '.temp', 'images'),
};