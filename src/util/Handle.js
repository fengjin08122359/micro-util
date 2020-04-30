import { install } from "./register";

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

function inheritedPropertyNames(obj) {
  var props = {};
  while(obj) {
    Object.getOwnPropertyNames(obj).forEach(function(p) {
      props[p] = true;
    });
    obj = Object.getPrototypeOf(obj);
  }
  return Object.getOwnPropertyNames(props);
}

class Handle {
  constructor (item, key) {
    if (item.name) {
      install(item.name, this, key, 'handle')
    }
    this.beforehandlers = []
    this.afterhandlers = []
    // let allFunKey = Object.getOwnPropertyNames((item));
    var allFunKey = inheritedPropertyNames(item)
    allFunKey.forEach(key => {
      var value = item[key]
      if (typeof value == "function") {
        this[key] = (...input) => {
          this.__tiggerBefore__(key, ...input)
          var res = value.bind(this)(...input)
          if (res && isPromise(res)) {
            res.then(output=> {
              this.__tiggerAfter__(key, output, ...input)
            })
            .catch(output => {
              this.__tiggerAfterFail__(key, output, ...input)
            })
          } else {
            this.__tiggerAfter__(key, res, ...input)
          }
          return res
        }
      } else {
        this[key] = value
      }
    })
  }
  __tiggerBefore__(key, ...input) {
    this.beforehandlers.forEach(item => {
      if (key == item.key) {
        item.callback({
          input
        });
      }
    });
  }
  __tiggerAfterFail__(key, failoutput = {}, ...input) {
    setTimeout(() => {
      this.afterhandlers.forEach(item => {
        if (key == item.key) {
          item.callback({
            failoutput,
            input
          });
        }
      });
    }, 1e1)
  }
  __tiggerAfter__(key, output = {}, ...input) {
    setTimeout(() => {
      this.afterhandlers.forEach(item => {
        if (key == item.key) {
          item.callback({
            output,
            input
          });
        }
      });
    }, 1e1)
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
}
export default Handle