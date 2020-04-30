'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _DataHandle = require('./DataHandle');

var _DataHandle2 = _interopRequireDefault(_DataHandle);

var _Handle = require('./Handle');

var _Handle2 = _interopRequireDefault(_Handle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

var convertVuex = function convertVuex(target) {
  var state = {
    target: target
  };
  var getters = {};
  var mutations = {};
  var actions = {};
  if (target instanceof _DataHandle2.default) {
    var ownFunKey = Object.getOwnPropertyNames(Object.getPrototypeOf(target));
    ownFunKey.forEach(function (key) {
      var value = target[key];
      if (typeof value == "function" && key != 'constructor') {
        actions[key] = function (_ref, arg) {
          _objectDestructuringEmpty(_ref);

          return value(arg);
        };
      }
    });
  } else if (target instanceof _Handle2.default) {
    var _ownFunKey = Object.getOwnPropertyNames(Object.getPrototypeOf(target));
    var allFunKey = Object.getOwnPropertyNames(target);
    var funKeys = allFunKey.filter(function (item) {
      return item.indexOf(_ownFunKey) == -1;
    });
    funKeys.forEach(function (key) {
      var value = target[key];
      if (typeof value == "function" && key != 'constructor') {
        actions[key] = function (_ref2, arg) {
          _objectDestructuringEmpty(_ref2);

          return value(arg);
        };
      }
    });
  }
  return {
    namespaced: true,
    state: state,
    getters: getters,
    mutations: mutations,
    actions: actions
  };
};

exports.default = convertVuex;