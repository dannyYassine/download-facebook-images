/**
 * Created by dannyyassine
 */
const path = require('path');
require('dotenv').config();

global.use = name => {
  return require(`${__dirname}${name.substring(1)}`)
};
global.appRoot = path.resolve(__dirname, '..');