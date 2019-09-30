'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var handlers = {};
var datas = {};
var handles = {};
var install = exports.install = function install(name, obj, key) {
  var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'data';

  var mainkey = key || 'default';
  var dealName = name + (type == 'data' ? 'Data' : 'Handle');
  if (dealName && handlers[dealName] == undefined) {
    handlers[dealName] = {};
  }
  if (dealName && handlers[dealName][mainkey] == undefined) {
    handlers[dealName][mainkey] = obj;
  } else if (name && key) {
    handlers[dealName][mainkey] = obj;
  }
  if (mainkey == 'default') {
    if (type == 'data') {
      datas[name] = obj;
    } else if (type == 'handle') {
      handles[name] = obj;
    }
  }
};

var rgHandle = exports.rgHandle = handles;
var rgData = exports.rgData = datas;

var display = exports.display = function display(name) {
  var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';

  if (key == '') {
    return handlers[name];
  }
  return handlers[name] && handlers[name][key];
};

var displayAll = exports.displayAll = function displayAll() {
  return handlers;
};

var displayHandle = exports.displayHandle = function displayHandle(name) {
  var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';

  return display(name + 'Handle', key, 'handle');
};

var displayData = exports.displayData = function displayData(name) {
  var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';

  return display(name + 'Data', key, 'data');
};
exports.default = {
  install: install,
  display: display,
  displayAll: displayAll,
  displayHandle: displayHandle,
  displayData: displayData
};