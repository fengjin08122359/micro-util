'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _log = require('./log.js');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventBus = function () {
  function EventBus(name) {
    _classCallCheck(this, EventBus);

    this.handlers = [];
    this.keys = [];
    this.beforehandlers = [];
    this.afterhandlers = [];
    this.name = name || 'key';
  }

  _createClass(EventBus, [{
    key: 'push',
    value: function push(keys, obj, logStr) {
      var _this = this;

      var keysType = keys.constructor;
      if (keysType == Array) {
        keys.forEach(function (key) {
          _this.pushSingle(key, obj, logStr);
        });
      } else if (keysType == String) {
        this.push(keys.split(','), obj, logStr);
      }
    }
  }, {
    key: 'pushSingle',
    value: function pushSingle(key, obj, logStr) {
      _log2.default.info(this.name + ":" + key, obj);
      this.__tiggerBefore__(key, obj);
      this.handlers.forEach(function (item) {
        if (key == item.key) {
          item.callback(obj);
        }
      });
      this.__tiggerAfter__(key, obj);
      this.keys.push(key);
      this.keys = [].concat(_toConsumableArray(new Set(this.keys)));
      if (logStr) {
        _log2.default.log(logStr);
      }
    }
  }, {
    key: 'addHandler',
    value: function addHandler(handlerName, keys, callback) {
      var _this2 = this;

      var keysType = keys.constructor;
      if (keysType == Array) {
        keys.forEach(function (key) {
          _this2.addSingleHandler(handlerName, key, callback);
        });
      } else if (keysType == String) {
        this.addHandler(handlerName, keys.split(','), callback);
      }
    }
  }, {
    key: 'addSingleHandler',
    value: function addSingleHandler(handlerName, key, callback) {
      if (key) {
        this.removeHandler(handlerName, key);
        this.handlers.push({
          handlerName: handlerName,
          key: key,
          callback: callback
        });
      }
    }
  }, {
    key: 'removeHandler',
    value: function removeHandler(handlerName, key) {
      var _this3 = this;

      this.handlers.forEach(function (item, index) {
        if (handlerName == item.handlerName) {
          if (!key || key == item.key) {
            _this3.handlers.splice(index, 1);
          }
        }
      });
    }
  }, {
    key: 'getHandler',
    value: function getHandler(handlerName, key, obj) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        var item = _this4.handlers.filter(function (item) {
          return handlerName == item.handlerName && item.key == key;
        });
        if (item.length > 0) {
          resolve(item[0].callback(obj));
        } else {
          reject();
        }
      }).catch(function () {
        reject();
      });
    }
  }, {
    key: 'before',
    value: function before(key, callback) {
      this.beforehandlers.push({
        key: key,
        callback: callback
      });
    }
  }, {
    key: 'after',
    value: function after(key, callback) {
      this.afterhandlers.push({
        key: key,
        callback: callback
      });
    }
  }, {
    key: '__tiggerBefore__',
    value: function __tiggerBefore__(key) {
      for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        rest[_key - 1] = arguments[_key];
      }

      this.beforehandlers.forEach(function (item) {
        if (key == item.key) {
          item.callback.apply(item, rest);
        }
      });
    }
  }, {
    key: '__tiggerAfter__',
    value: function __tiggerAfter__(key) {
      var _this5 = this;

      for (var _len2 = arguments.length, rest = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        rest[_key2 - 1] = arguments[_key2];
      }

      setTimeout(function () {
        _this5.afterhandlers.forEach(function (item) {
          if (key == item.key) {
            item.callback.apply(item, rest);
          }
        });
      }, 1e1);
    }
  }]);

  return EventBus;
}();

exports.default = EventBus;