'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.httpFrame = exports.websocketFrame = undefined;

var _EventBus = require('./EventBus');

var _EventBus2 = _interopRequireDefault(_EventBus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _EventBus2.default();
var websocketFrame = exports.websocketFrame = new _EventBus2.default('websocketFrame');

var httpFrame = exports.httpFrame = new _EventBus2.default('httpFrame');