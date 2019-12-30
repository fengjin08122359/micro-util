import manager from './index';
import { websocketFrame } from '../../util/key-frame';

export default {
  pong: 0,
  sendTime: 2,
  checkTime: 3,
  warnTime: 10,
  reconnectTime: 20,
  connnectNumber: 0,
  connectTime: 1,
  keepAliveModel: true,
  w: null,
  init () {
    this.pong = 0;
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.check();
    this.interval = setInterval(() => {
      this.check();
    }, this.checkTime * 1000);
  },
  setConnectLimit (data) {
    this.connectTime = typeof data == 'number' ? parseInt(data) : -1
  },
  setPong () {
    this.connnectNumber = 0;
    this.pong = new Date().getTime();
  },
  check () {
    if (navigator && navigator.onLine == false) {
      this.endTimeout()
      return;
    }
    if (manager.websocket && manager.websocket.readyState == manager.websocket.CLOSED) {
      this.endTimeout()
      return
    }
    if (this.pong && new Date().getTime() - this.pong > this.reconnectTime * 1000) {
      this.endTimeout()
      return;
    }
  },
  endTimeout () {
    if (this.keepAliveModel) {
      this.end();
    }
    if (this.reconnect()) {
      return;
    }
    if (this.interval) {
      clearInterval(this.interval);
    }
    websocketFrame.push('websocket-reconnect');
  },
  end () {
    if (manager.websocket && manager.websocket.readyState == manager.websocket.OPEN) {
      manager.websocket.close();
    }
  },
  reconnect () {
    var isReconnect = false;
    if (this.connnectNumber <= this.connectTime) {
      isReconnect = true;
      if (manager.reconnect()) {
        this.connnectNumber++;
      }
      websocketFrame.push('websocket-close');
    }
    return isReconnect;
  }
}