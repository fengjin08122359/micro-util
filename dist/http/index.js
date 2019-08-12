'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jsonplink = exports.httplink = undefined;

var _api = require('../util/api');

var _api2 = _interopRequireDefault(_api);

var _keyFrame = require('../util/key-frame');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var httplink = exports.httplink = function httplink(name, url, data) {
  var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'get';
  var async = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;

  return new Promise(function (resolve, reject) {
    _api2.default[type](url, data, function (res) {
      _keyFrame.httpFrame.push('http-' + name, {
        data: data,
        res: res
      });
      resolve({ data: data, res: res });
    }, function () {
      _keyFrame.httpFrame.push('http-' + name + "-fail,http-fail", data);
      reject(data);
    }, async);
  }).catch(function () {
    resolve(data);
  });
};

var jsonplink = exports.jsonplink = function jsonplink(name, url, data) {
  var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'jsonp';
  var async = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
  var jsonpCallback = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'jsonpCallback';
  var jsonpName = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 'jsonpCallback';

  return new Promise(function (resolve, reject) {
    _api2.default.jsonp(url, data, function (res) {
      _keyFrame.httpFrame.push('jsonp-' + name, {
        data: data,
        res: res
      });
      resolve({ data: data, res: res });
    }, function () {
      _keyFrame.httpFrame.push('jsonp-' + name + "-fail,jsonp-fail", data);
      reject(data);
    }, async, jsonpCallback, jsonpName);
  }).catch(function () {
    resolve(data);
  });
};