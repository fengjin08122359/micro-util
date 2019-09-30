'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _register = require('./register');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function isPromise(obj) {
  return !!obj && ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

var DataHandle = function () {
  function DataHandle(name, key) {
    var _this = this;

    _classCallCheck(this, DataHandle);

    if (name) {
      (0, _register.install)(name, this, key, 'data');
    }
    // super(item)
    this.beforehandlers = [];
    this.afterhandlers = [];
    var ownKeys = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
    ownKeys.forEach(function (key) {
      var value = _this[key];
      if (typeof value == "function") {
        _this[key] = function () {
          for (var _len = arguments.length, input = Array(_len), _key = 0; _key < _len; _key++) {
            input[_key] = arguments[_key];
          }

          _this.__tiggerBefore__.apply(_this, [key].concat(input));
          var res = value.bind(_this).apply(undefined, input);
          if (res && isPromise(res)) {
            res.then(function (output) {
              _this.__tiggerAfter__.apply(_this, [key, output].concat(input));
            }).catch(function (output) {
              _this.__tiggerAfterFail__.apply(_this, [key, output].concat(input));
            });
          } else {
            _this.__tiggerAfter__.apply(_this, [key, res].concat(input));
          }
          return res;
        };
      }
    });
  }

  _createClass(DataHandle, [{
    key: '__tiggerBefore__',
    value: function __tiggerBefore__(key) {
      for (var _len2 = arguments.length, input = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        input[_key2 - 1] = arguments[_key2];
      }

      this.beforehandlers.forEach(function (item) {
        if (key == item.key) {
          item.callback({
            input: input
          });
        }
      });
    }
  }, {
    key: '__tiggerAfterFail__',
    value: function __tiggerAfterFail__(key) {
      for (var _len3 = arguments.length, input = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
        input[_key3 - 2] = arguments[_key3];
      }

      var _this2 = this;

      var failoutput = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      setTimeout(function () {
        _this2.afterhandlers.forEach(function (item) {
          if (key == item.key) {
            item.callback({
              failoutput: failoutput,
              input: input
            });
          }
        });
      }, 1e1);
    }
  }, {
    key: '__tiggerAfter__',
    value: function __tiggerAfter__(key) {
      for (var _len4 = arguments.length, input = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
        input[_key4 - 2] = arguments[_key4];
      }

      var _this3 = this;

      var output = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      setTimeout(function () {
        _this3.afterhandlers.forEach(function (item) {
          if (key == item.key) {
            item.callback({
              output: output,
              input: input
            });
          }
        });
      }, 1e1);
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
  }]);

  return DataHandle;
}();

exports.default = DataHandle;