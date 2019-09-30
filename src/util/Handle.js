import { install } from "./register";

let {entries} = Object;
function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}
class Handle {
  constructor (item, key) {
    if (item.name) {
      install(item.name, this, key, 'handle')
    }
    this.beforehandlers = []
    this.afterhandlers = []
    for (let [key, value] of entries(item)) {
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
    }
    var ownKeys = Object.getOwnPropertyNames(Object.getPrototypeOf(item))
    ownKeys.forEach(key => {
      var value = this[key]
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