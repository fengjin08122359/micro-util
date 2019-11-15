'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reconnect = exports.websocket = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

require('./websocket-web-js');

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

var _keyFrame = require('../../util/key-frame');

var _keepalive = require('./keepalive');

var _keepalive2 = _interopRequireDefault(_keepalive);

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var message = {
  websocket: null,
  pk: '',
  init: function init() {},
  reconnect: function reconnect() {
    var can = this.pk && this.websocket && this.websocket.readyState == this.websocket.CLOSED;
    if (can) {
      this.start(this.pk);
    }
    return can;
  },
  test: function test() {
    var url = _config2.default.testUrl;
    var testWS = this.connect(url);
    _keyFrame.websocketFrame.addHandler('websocket-test', 'websocket-open' + url, function () {
      _keyFrame.websocketFrame.removeHandler('websocket-test', 'websocket-error' + url);
      _keyFrame.websocketFrame.removeHandler('websocket-test', 'websocket-close' + url);
      _keyFrame.websocketFrame.push('websocket-set-success');
      testWS.close();
    });
    _keyFrame.websocketFrame.addHandler('websocket-test', 'websocket-error' + url, function () {
      _keyFrame.websocketFrame.push('websocket-set-fail');
    });
    _keyFrame.websocketFrame.addHandler('websocket-test', 'websocket-close' + url, function () {
      _keyFrame.websocketFrame.push('websocket-set-fail');
    });
  },
  start: function start(pk) {
    var _this = this;

    this.pk = pk;
    _config2.default.setWebsocketUrl(pk);
    var url = _config2.default.websocketUrl;
    this.websocket = this.connect(url);
    this.websocket.onopen = function () {
      _keyFrame.websocketFrame.push('websocket-login');
    };
    this.websocket.onmessage = function (message) {
      _keyFrame.websocketFrame.push('websocket-receive', message);
      _this.receive(message);
    };
    this.websocket.onclose = function () {
      _keyFrame.websocketFrame.push('websocket-close');
    };
  },
  connect: function connect(url) {
    var _this2 = this;

    var websocket = new window.WebSocket(url);
    websocket.onopen = function () {
      _this2.websocket = websocket;
      _keepalive2.default.init();
      _keepalive2.default.connnectNumber = 0;
      _keyFrame.websocketFrame.push('websocket-open' + url);
    };
    websocket.onerror = function (evt) {
      _keyFrame.websocketFrame.push('websocket-error' + url, evt);
    };
    websocket.onclose = function (evt) {
      _keyFrame.websocketFrame.push('websocket-close' + url, evt);
    };
    return websocket;
  },
  send: function send(message) {
    var w = this;
    if (w.websocket != null && w.websocket.readyState == w.websocket.OPEN) {
      if ((typeof message === 'undefined' ? 'undefined' : _typeof(message)) == Object) {
        message = JSON.stringify(message);
      }
      w.websocket.send(message);
    }
  },
  receive: function receive(message) {
    var json = JSON.parse(message.data);
    var type = json.type;
    var body = json.content;
    var fromClient = json.fromClient;
    try {
      body = JSON.parse(json.content);
      // eslint-disable-next-line no-empty
    } catch (error) {}
    _keyFrame.websocketFrame.push('receive', {
      json: json,
      type: type,
      body: body,
      fromClient: fromClient
    });
  },
  closeManager: function closeManager() {
    if (this.websocket && this.websocket.readyState !== this.websocket.CLOSED) {
      this.websocket.close();
    }
  }
};

exports.default = message;
var websocket = exports.websocket = message.websocket;
var reconnect = exports.reconnect = message.reconnect;