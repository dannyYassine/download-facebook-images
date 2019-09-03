/**
 * Created by dannyyassine
 */
const path = require('path');
require('dotenv').config();

global.use = name => {
  return require(`${__dirname}${name.substring(1)}`)
};

const registry = {};
global.$get = (namespace) => {
  return registry[namespace];
};

global.$set = (namespace, object) => {
  if ($get[namespace]) {
    throw `Conflict namespace ${namespace} for ${object.constructor.name}`;
  }
  return registry[namespace] = object;
};

global.appRoot = path.resolve(__dirname, '..');

$set('env', require('./env'));