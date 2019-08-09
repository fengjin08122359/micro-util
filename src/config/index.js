import storage from "../util/storage";

let host = (window.location.protocol == 'http:' ? 'ws://' : 'wss://') + (document.location.hostname == '' ? 'localhost' : document.location.hostname) + (document.location.port == '' ? '' : (':' + document.location.port)) 
// let host = 'ws://www.any800.com'

let RndNum = (n) => {
  var rnd = ''
  for (var i = 0; i < n; i++) { rnd += Math.floor(Math.random() * 10) }
  return rnd
}

let randomNum = '';
if (!storage.get('randomNum')) {
  randomNum = new Date().getTime().toString() + RndNum(4).toString()
  storage.set('randomNum', randomNum)
}
randomNum = storage.get('randomNum')

export default {
  randomNum,
  testUrl: '',
  websocketUrl: '',
  wsBegin: '',
  pre: '/',
  swfForWebsocketUrl: './WebSocketMain.swf',
  httpUrl: '/',
  init () {
    this.wsBegin = host + this.pre
    this.testUrl = this.wsBegin + 'test' + new Date().getTime();
    window.WEB_SOCKET_SWF_LOCATION = this.swfForWebsocketUrl;
  },
  set(json) {
    this.pre = json.pre || this.pre
    this.httpUrl = json.httpUrl || this.httpUrl
  },
  setWebsocketUrl (pk) {
    this.websocketUrl = this.wsBegin + pk;
  },
  setSWFLocation (swfForWebsocketUrl) {
    this.swfForWebsocketUrl = swfForWebsocketUrl
    window.WEB_SOCKET_SWF_LOCATION = this.swfForWebsocketUrl;
  }
}