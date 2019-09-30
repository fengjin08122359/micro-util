'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _register = require('./register');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var entries = Object.entries;

function isPromise(obj) {
  return !!obj && ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

var Handle = function () {
  function Handle(item, key) {
    var _this = this;

    _classCallCheck(this, Handle);

    if (item.name) {
      (0, _register.install)(item.name, this, key, 'handle');
    }
    this.beforehandlers = [];
    this.afterhandlers = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      var _loop = function _loop() {
        var _step$value = _slicedToArray(_step.value, 2),
            key = _step$value[0],
            value = _step$value[1];

        if (typeof value == "function") {
          _this[key] = function () {
            for (var _len2 = arguments.length, input = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              input[_key2] = arguments[_key2];
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
        } else {
          _this[key] = value;
        }
      };

      for (var _iterator = entries(item)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        _loop();
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    var ownKeys = Object.getOwnPropertyNames(Object.getPrototypeOf(item));
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

  _createClass(Handle, [{
    key: '__tiggerBefore__',
    value: function __tiggerBefore__(key) {
      for (var _len3 = arguments.length, input = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        input[_key3 - 1] = arguments[_key3];
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
      for (var _len4 = arguments.length, input = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
        input[_key4 - 2] = arguments[_key4];
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
      for (var _len5 = arguments.length, input = Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
        input[_key5 - 2] = arguments[_key5];
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

  return Handle;
}();

exports.default = Handle;