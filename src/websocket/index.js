import websocket from './websocket'
import config from '../config'
import { websocketFrame } from '../util/key-frame'
import Handle from '../util/Handle';
//建立webscoket连接
//判断连接建立成功
//使用websocket
//使用flash
// 接口对接(in out)
export default new Handle({
  pk: '',
  manager: null,
  init (data) {
    this.pk = data || ''
    if (!this.manager) {
      config.init();
      this.initManager();
      websocket.test();
    }
  },
  initSingle (data) {
    this.initSingleManager()
    config.wsBegin = data
    websocket.start('')
  },
  initSingleManager() {
    websocketFrame.addHandler('websocket', 'websocket-login', () => {
      this.manager = websocket;
      websocketFrame.push('websocket-set', this.manager)
    })
  },
  initManager () {
    websocketFrame.addHandler('websocket', 'websocket-set-success', () => {
      this.manager = websocket;
      this.startManager(this.pk)
      websocketFrame.push('websocket-set', this.manager)
    })
    websocketFrame.addHandler('websockey', 'websocket-set-fail', () => {
      websocketFrame.push('websocket-fail', this.manager)
    })
  },
  closeManager () {
    if (this.manager) {
      this.manager.closeManager();
    }
  },
  sendMsg (msg) {
    this.manager.send(msg)
  },
  startManager (data) {
    if (this.manager) {
      this.manager.start(data);
    } else {
      setTimeout(() => {
        if (this.manager) {
          this.manager.start(data);
        } else {
          websocketFrame.push('websocket-fail', this.manager)
        }
      }, 2000)
    }
  },
  isClose() {
    if (this.manager) {
      return this.manager.websocket.readyState == this.manager.websocket.CLOSED
    } else {
      return true
    }
  }
})