import {websocket} from './index';
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
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.check();
    this.interval = setInterval(() => {
      this.check();
    }, this.checkTime * 1000);
  },
  setPong () {
    this.pong = new Date().getTime();
  },
  check () {
    if (navigator && navigator.onLine == false) {
      this.endTimeout()
      return;
    }
    if (websocket && websocket.readyState == websocket.CLOSED) {
      this.endTimeout()
    }
  },
  endTimeout () {
    if (this.keepAliveModel) {
      this.end();
    }
    if (this.reconnect()) {
      return;
    }
    websocketFrame.push('websocket-reconnect');
  },
  end () {
    if (this.interval) {
      clearInterval(this.interval);
    }
    if (websocket && websocket.readyState != websocket.CLOSED) {
      websocket.close();
    }
    this.connnectNumber++;
  },
  reconnect () {
    var isReconnect = false;
    if (this.connnectNumber <= this.connectTime) {
      isReconnect = true;
      websocketFrame.push('websocket-close');
    }
    return isReconnect;
  }
}