'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('./index');

var _keyFrame = require('../../util/key-frame');

exports.default = {
  pong: 0,
  sendTime: 2,
  checkTime: 3,
  warnTime: 10,
  reconnectTime: 20,
  connnectNumber: 0,
  connectTime: 1,
  keepAliveModel: true,
  w: null,
  init: function init() {
    var _this = this;

    this.pong = 0;
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.check();
    this.interval = setInterval(function () {
      _this.check();
    }, this.checkTime * 1000);
  },
  setConnectLimit: function setConnectLimit(data) {
    this.connectTime = typeof data == 'number' ? parseInt(data) : -1;
  },
  setPong: function setPong() {
    this.connnectNumber = 0;
    this.pong = new Date().getTime();
  },
  check: function check() {
    if (navigator && navigator.onLine == false) {
      this.endTimeout();
      return;
    }
    if (_index.websocket && _index.websocket.readyState == _index.websocket.CLOSED) {
      this.endTimeout();
      return;
    }
    if (this.pong && new Date().getTime() - this.pong > this.reconnectTime * 1000) {
      this.endTimeout();
      return;
    }
  },
  endTimeout: function endTimeout() {
    if (this.keepAliveModel) {
      this.end();
    }
    if (this.reconnect()) {
      return;
    }
    if (this.interval) {
      clearInterval(this.interval);
    }
    _keyFrame.websocketFrame.push('websocket-reconnect');
  },
  end: function end() {
    if (_index.websocket && _index.websocket.readyState == _index.websocket.OPEN) {
      _index.websocket.close();
    }
  },
  reconnect: function reconnect() {
    var isReconnect = false;
    if (this.connnectNumber <= this.connectTime) {
      isReconnect = true;
      if ((0, _index.reconnect)()) {
        this.connnectNumber++;
      }
      _keyFrame.websocketFrame.push('websocket-close');
    }
    return isReconnect;
  }
};