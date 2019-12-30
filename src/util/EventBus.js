import logger from './log'

class EventBus {
  constructor (name) {
    this.handlers = []
    this.keys = []
    this.beforehandlers = []
    this.afterhandlers = []
    this.name = name || 'key'
  }
  push(keys, obj, logStr) {
    var keysType = (keys.constructor)
    if (keysType == Array) {
      keys.forEach(key => {
        this.pushSingle(key, obj, logStr)
      });
    } else if (keysType == String) {
      this.push(keys.split(','), obj, logStr)
    }
  }
  pushSingle(key, obj, logStr) {
    logger.info(this.name + ":" + key, obj);
    this.__tiggerBefore__(key, obj)
    this.handlers.forEach(item => {
      if (key == item.key) {
        item.callback(obj);
      }
    });
    this.__tiggerAfter__(key, obj)
    this.keys.push(key);
    this.keys = [...new Set(this.keys)];
    if (logStr) {
      logger.log(logStr);
    }
  }
  addHandler(handlerName, keys, callback) {
    var keysType = (keys.constructor)
    if (keysType == Array) {
      keys.forEach(key => {
        this.addSingleHandler(handlerName, key, callback)
      });
    } else if (keysType == String) {
      this.addHandler(handlerName, keys.split(','), callback)
    }
  }
  addSingleHandler(handlerName, key, callback) {
    if (key) {
      this.removeHandler(handlerName, key);
      this.handlers.push({
        handlerName: handlerName,
        key: key,
        callback: callback,
      })
    }
  }
  removeHandler(handlerName, key) {
    this.handlers.forEach((item, index) => {
      if (handlerName == item.handlerName) {
        if (!key || key == item.key) {
          this.handlers.splice(index, 1);
        }
      }
    });
  }
  getHandler (handlerName, key, obj) {
    return new Promise((resolve, reject) => {
      var item = this.handlers.filter(item => handlerName == item.handlerName && item.key == key)
      if (item.length > 0) {
        resolve(item[0].callback(obj))
      } else {
        reject()
      }
    })
    .catch(() => {
      reject()
    })
  }
  before(key, callback){
    this.beforehandlers.push({
      key,
      callback
    })
  }
  after(key, callback){
    this.afterhandlers.push({
      key,
      callback
    })
  }
  
  __tiggerBefore__(key, ...rest) {
    this.beforehandlers.forEach(item => {
      if (key == item.key) {
        item.callback(...rest);
      }
    });
  }
  __tiggerAfter__(key, ...rest) {
    setTimeout(() => {
      this.afterhandlers.forEach(item => {
        if (key == item.key) {
          item.callback(...rest);
        }
      });
    }, 1e1)
  }
}
export default EventBus