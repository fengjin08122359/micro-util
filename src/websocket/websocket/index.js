import './websocket-web-js'
import config from '../../config'
import { websocketFrame } from '../../util/key-frame'
import keepalive from './keepalive'
import manager from '../index';

var message =  {
  websocket: null,
  pk: '',
  init () {
    
  },
  setConnectLimit (data) {
    keepalive.setConnectLimit(data)
  },
  reconnect () {
    var can = this.pk && this.websocket && this.websocket.readyState == this.websocket.CLOSED
    if (can) {
      this.start(this.pk);
    }
    return can
  },
  test () {
    var url = config.testUrl;
    var testWS = this.connect(url);
    websocketFrame.addHandler('websocket-test', 'websocket-open' + url, () => {
      websocketFrame.removeHandler('websocket-test', 'websocket-error' + url);
      websocketFrame.removeHandler('websocket-test', 'websocket-close' + url);
      websocketFrame.push('websocket-set-success')
      testWS.close();
    })
    websocketFrame.addHandler('websocket-test', 'websocket-error' + url, () => {
      websocketFrame.push('websocket-set-fail')
    })
    websocketFrame.addHandler('websocket-test', 'websocket-close' + url, () => {
      websocketFrame.push('websocket-set-fail')
    })
  },
  start (pk) {
    this.pk = pk;
    config.setWebsocketUrl(pk)
    var url = config.websocketUrl;
    this.websocket = this.connect(url);
    this.websocket.onopen = () => {
      websocketFrame.push('websocket-login');
    }
    this.websocket.onmessage = (message) => {
      websocketFrame.push('websocket-receive', message)
      this.receive(message);
    }
    this.websocket.onclose = () => {
      websocketFrame.push('websocket-close');
    } 
  },
  connect (url) {
    var websocket = new window.WebSocket(url)
    websocket.onopen = () => {
      this.websocket = websocket
      keepalive.init();
      keepalive.connnectNumber = 0;
      websocketFrame.push('websocket-open' + url);
    }
    websocket.onerror = function(evt){
      websocketFrame.push('websocket-error' + url, evt);
    } 
    websocket.onclose = function(evt){
      websocketFrame.push('websocket-close' + url, evt);
    } 
    return websocket;
  },
  send (message) {
    var w = this
    if (w.websocket != null && w.websocket.readyState == w.websocket.OPEN) {
      if (typeof message == 'object') {
        message = JSON.stringify(message)
      }
      w.websocket.send(message)
    }
  },
  receive (message) {
    var json = JSON.parse(message.data);
    var type = json.type
    var body = json.content;
    var fromClient = json.fromClient
    try {
      body = JSON.parse(json.content)
    // eslint-disable-next-line no-empty
    } catch (error){}
    websocketFrame.push('receive', {
      json,
      type,
      body,
      fromClient,
    })
  },
  closeManager () {
    if (this.websocket && this.websocket.readyState !== this.websocket.CLOSED) {
      this.websocket.close();
    }
  },
}

export default message;