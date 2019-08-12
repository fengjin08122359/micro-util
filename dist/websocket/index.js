'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _websocket = require('./websocket');

var _websocket2 = _interopRequireDefault(_websocket);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _keyFrame = require('../util/key-frame');

var _Handle = require('../util/Handle');

var _Handle2 = _interopRequireDefault(_Handle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//建立webscoket连接
//判断连接建立成功
//使用websocket
//使用flash
// 接口对接(in out)
exports.default = new _Handle2.default({
  pk: '',
  manager: null,
  init: function init(data) {
    this.pk = data || '';
    if (!this.manager) {
      _config2.default.init();
      this.initManager();
      _websocket2.default.test();
    }
  },
  initManager: function initManager() {
    var _this = this;

    _keyFrame.websocketFrame.addHandler('websocket', 'websocket-set-success', function () {
      _this.manager = _websocket2.default;
      _this.startManager(_this.pk);
      _keyFrame.websocketFrame.push('websocket-set', _this.manager);
    });
    _keyFrame.websocketFrame.addHandler('websockey', 'websocket-set-fail', function () {
      _keyFrame.websocketFrame.push('websocket-fail', _this.manager);
    });
  },
  closeManager: function closeManager() {
    if (this.manager) {
      this.manager.closeManager();
    }
  },
  sendMsg: function sendMsg(msg) {
    this.manager.send(msg);
  },
  startManager: function startManager(data) {
    var _this2 = this;

    if (this.manager) {
      this.manager.start(data);
    } else {
      setTimeout(function () {
        if (_this2.manager) {
          _this2.manager.start(data);
        } else {
          _keyFrame.websocketFrame.push('websocket-fail', _this2.manager);
        }
      }, 2000);
    }
  },
  isClose: function isClose() {
    if (this.manager) {
      return this.manager.websocket.readyState == this.manager.websocket.CLOSED;
    } else {
      return true;
    }
  }
});