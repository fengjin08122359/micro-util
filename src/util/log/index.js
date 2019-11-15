import '../bind';
import storage from '../storage';
import {saveAs, saveTextAs} from './save'
import ui from './ui'
let {
  entries
} = Object;
/* eslint-disable */
if (typeof console === 'undefined') {
  console = {}
  console.log = function (e) {}
  console.warn = function (e) {}
  console.error = function (e) {}
  console.debug = function (e) {}
  console.info = function (e) {}
};
const startDateStr = new Date().Format("yyyy-MM-dd hh:mm:ss SS")
export const levels = ['all', 'log', 'info', 'debug', 'error', 'warn']
var leveldisplays = ['', 'background: #E170D6;color:#fff;', 'background: #56E13E;color:#fff;', 'background: #0091E1;color:#fff;', 'background: #f7c8c8;color: #235cdc;', 'background: #fff8a9;color: #ca8c1b']

var slogger =  storage.get('logger') || {
  level: 0,
  only: false,
  saveFile: false,
  UIDsiplay: false
}

var logger = {
  LEVEL_LOG: 1,
  LEVEL_INFO: 2,
  LEVEL_DEBUG: 3,
  LEVEL_ERROR: 4,
  LEVEL_WARN: 5,
  level: slogger.level,
  only: slogger.only,
  saveFile: slogger.saveFile,
  UIDsiplay: slogger.UIDsiplay,
  logArray: [],
  init () {
    if (this.level >= 0) {
      console.log = (function () {
        return function (...rest) {
          logger.saveInArguments('log', rest);
        }
      })(console.log);
      console.warn = (function () {
        return function (...rest) {
          logger.saveInArguments('warn', rest);
        }
      })(console.warn);
      console.error = (function () {
        return function (...rest) {
          logger.saveInArguments('error', rest);
        }
      })(console.error);
      console.info = (function () {
        return function (...rest) {
          logger.saveInArguments('info', rest);
        }
      })(console.info);
    }
    ui.init()
    if (!this.UIDsiplay) {
      ui.hide()
    }
  },
  log(key, ...rest) {
    console.log(key);
    console.log(...rest);
  },
  error(key, ...rest) {
    console.error(key);
    console.error(...rest);
  },
  debug(key, ...rest) {
    console.debug(key);
    console.debug(...rest);
  },
  info(key, ...rest) {
    console.info(key);
    console.info(...rest);
  },
  warn(key, ...rest) {
    console.warn(key);
    console.warn(...rest);
  },
  saveInArguments(type, args) {
    try {
      var s = []
      args.forEach(item => {
        if ((typeof item).toLowerCase() == 'object') {
          s.push(changeObjectToString(item))
        } else if ((typeof item).toLowerCase() == 'boolean' || (typeof item).toLowerCase() == 'number' || (typeof item).toLowerCase() == 'string') {
          s.push(item)
        }
      })
      var time = new Date().Format('hh:mm:ss')
      this.logArray.push({
        type,
        time,
        msg: s.length == 1 ? s : JSON.stringify(s)
      })
      var index = levels.indexOf(type)
      if ((!this.only && this.level <= index) || (this.only && this.level == index)) {
        console.debug(`%c${type}`, `${leveldisplays[index]}`, s.length == 1 ? s : JSON.stringify(s))
      }
      ui.append({
        type,
        time,
        msg: s.length == 1 ? s : JSON.stringify(s)
      })
    } catch (e) {

    }
  },
  getData(type, str) {
    return this.logArray.filter(item => {
      if ((item.type == type || type=='all') && (!str ||  item.msg.indexOf(str) > -1) ) {
        return true
      }
    })
  },
  saveAsFile() {
    var content = ''
    this.logArray.forEach(item => {
      content += item.time + '    ' + item.type + '   '  + item.msg + '\r\n'
    })
    var timeStr = new Date().getTime();
    var dateStr = new Date().Format("yyyy-MM-dd hh:mm:ss SS");
    saveTextAs(content, "logger " + startDateStr + " to " + dateStr + ".txt");
  },
  setLevel (level = 5) {
    logger.level = parseInt(level)
    slogger.level = logger.level
    storage.set('logger', slogger)
  },
  setOnly (only) {
    logger.only = !!only
    slogger.only = logger.only
    storage.set('logger', slogger)
  },
  setSaveFile (saveFile) {
    logger.saveFile = !!saveFile
    slogger.saveFile = logger.saveFile
    storage.set('logger', slogger)
  },
  setUIDsiplay (UIDsiplay) {
    logger.UIDsiplay = !!UIDsiplay
    slogger.UIDsiplay = logger.UIDsiplay
    storage.set('logger', slogger)
  },
  show() {
    ui.show()
  },
  hide() {
    ui.hide()
  }
}
let changeObjectToString = (e) => {
  var result = '';
  for (let [key, value] of entries(e)) {
    if (value.constructor != Function) {
      if (typeof value == 'string' || typeof value == 'boolean' || typeof value == 'number') {
        result += `'{${key}: ${value} }',`
      } else if (typeof value == 'object') {
        result += `'{${key}: ${changeObjectToString(value)} }',`
      }
    } else {
      result += `'{${key}: Function }',`
    }
  }
  return result;
};

logger.saveAs = saveAs
logger.saveTextAs = saveTextAs
window.logger = {
  setLevel (level) {
    logger.setLevel(level)
  },
  setOnly (only) {
    logger.setOnly(only)
  },
  setSaveFile (can) {
    logger.setSaveFile(can)
  },
  setUIDsiplay (UIDsiplay) {
    logger.setUIDsiplay(UIDsiplay)
  },
  show() {
    ui.show()
  }
}   

function addEvent(event, func) {
  if (document.all){
    window.attachEvent("on"+ event,func)//对于IE
  } else {
    window.addEventListener(event,func,false);
  }
}
addEvent ("unload", () => {
  if (logger.saveFile) {
    logger.saveAsFile()
  }
}) 
addEvent ("error", (msg, url, line) => {
  if(msg && msg.originalEvent){
    console.error("错误信息：" , msg.originalEvent.message);
    console.error("出错文件：" , msg.originalEvent.filename);
    console.error("出错行号：" , msg.originalEvent.lineno);
    console.error("出错列号：" , msg.originalEvent.colno);
  }
}) 
export default logger
logger.init()