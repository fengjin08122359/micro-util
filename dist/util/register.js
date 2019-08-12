'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var handlers = {};

var install = exports.install = function install(name, obj, key) {
  var mainkey = key || 'default';
  if (name && handlers[name] == undefined) {
    handlers[name] = {};
  }
  if (name && handlers[name][mainkey] == undefined) {
    handlers[name][mainkey] = obj;
  } else if (name && key) {
    handlers[name][mainkey] = obj;
  }
};

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

  return display(name + 'Handle', key);
};

var displayData = exports.displayData = function displayData(name) {
  var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';

  return display(name + 'Data', key);
};

exports.default = {
  install: install,
  display: display,
  displayAll: displayAll,
  displayHandle: displayHandle,
  displayData: displayData
};