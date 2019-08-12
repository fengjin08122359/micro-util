'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _storage = require('../util/storage');

var _storage2 = _interopRequireDefault(_storage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var host = (window.location.protocol == 'http:' ? 'ws://' : 'wss://') + (document.location.hostname == '' ? 'localhost' : document.location.hostname) + (document.location.port == '' ? '' : ':' + document.location.port);
// let host = 'ws://www.any800.com'

var RndNum = function RndNum(n) {
  var rnd = '';
  for (var i = 0; i < n; i++) {
    rnd += Math.floor(Math.random() * 10);
  }
  return rnd;
};

var randomNum = '';
if (!_storage2.default.get('randomNum')) {
  randomNum = new Date().getTime().toString() + RndNum(4).toString();
  _storage2.default.set('randomNum', randomNum);
}
randomNum = _storage2.default.get('randomNum');

exports.default = {
  randomNum: randomNum,
  testUrl: '',
  websocketUrl: '',
  wsBegin: '',
  pre: '/',
  swfForWebsocketUrl: './WebSocketMain.swf',
  httpUrl: '/',
  init: function init() {
    this.wsBegin = host + this.pre;
    this.testUrl = this.wsBegin + 'test' + new Date().getTime();
    window.WEB_SOCKET_SWF_LOCATION = this.swfForWebsocketUrl;
  },
  set: function set(json) {
    this.pre = json.pre || this.pre;
    this.httpUrl = json.httpUrl || this.httpUrl;
  },
  setWebsocketUrl: function setWebsocketUrl(pk) {
    this.websocketUrl = this.wsBegin + pk;
  },
  setSWFLocation: function setSWFLocation(swfForWebsocketUrl) {
    this.swfForWebsocketUrl = swfForWebsocketUrl;
    window.WEB_SOCKET_SWF_LOCATION = this.swfForWebsocketUrl;
  }
};