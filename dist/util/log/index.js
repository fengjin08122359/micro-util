'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.levels = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

require('../bind');

var _storage = require('../storage');

var _storage2 = _interopRequireDefault(_storage);

var _save = require('./save');

var _ui = require('./ui');

var _ui2 = _interopRequireDefault(_ui);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var entries = Object.entries;
/* eslint-disable */

if (typeof console === 'undefined') {
  console = {};
  console.log = function (e) {};
  console.warn = function (e) {};
  console.error = function (e) {};
  console.debug = function (e) {};
  console.info = function (e) {};
};
var startDateStr = new Date().Format("yyyy-MM-dd hh:mm:ss SS");
var levels = exports.levels = ['all', 'log', 'info', 'debug', 'error', 'warn'];
var leveldisplays = ['', 'background: #E170D6;color:#fff;', 'background: #56E13E;color:#fff;', 'background: #0091E1;color:#fff;', 'background: #f7c8c8;color: #235cdc;', 'background: #fff8a9;color: #ca8c1b'];

var slogger = _storage2.default.get('logger') || {
  level: 0,
  only: false,
  saveFile: false,
  UIDsiplay: false
};

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
  init: function init() {
    if (this.level >= 0) {
      console.log = function () {
        return function () {
          for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
            rest[_key] = arguments[_key];
          }

          logger.saveInArguments('log', rest);
        };
      }(console.log);
      console.warn = function () {
        return function () {
          for (var _len2 = arguments.length, rest = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            rest[_key2] = arguments[_key2];
          }

          logger.saveInArguments('warn', rest);
        };
      }(console.warn);
      console.error = function () {
        return function () {
          for (var _len3 = arguments.length, rest = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            rest[_key3] = arguments[_key3];
          }

          logger.saveInArguments('error', rest);
        };
      }(console.error);
      console.info = function () {
        return function () {
          for (var _len4 = arguments.length, rest = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            rest[_key4] = arguments[_key4];
          }

          logger.saveInArguments('info', rest);
        };
      }(console.info);
    }
    _ui2.default.init();
    if (!this.UIDsiplay) {
      _ui2.default.hide();
    }
  },
  log: function log(key) {
    var _console;

    console.log(key);

    for (var _len5 = arguments.length, rest = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
      rest[_key5 - 1] = arguments[_key5];
    }

    (_console = console).log.apply(_console, rest);
  },
  error: function error(key) {
    var _console2;

    console.error(key);

    for (var _len6 = arguments.length, rest = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
      rest[_key6 - 1] = arguments[_key6];
    }

    (_console2 = console).error.apply(_console2, rest);
  },
  debug: function debug(key) {
    var _console3;

    console.debug(key);

    for (var _len7 = arguments.length, rest = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
      rest[_key7 - 1] = arguments[_key7];
    }

    (_console3 = console).debug.apply(_console3, rest);
  },
  info: function info(key) {
    var _console4;

    console.info(key);

    for (var _len8 = arguments.length, rest = Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
      rest[_key8 - 1] = arguments[_key8];
    }

    (_console4 = console).info.apply(_console4, rest);
  },
  warn: function warn(key) {
    var _console5;

    console.warn(key);

    for (var _len9 = arguments.length, rest = Array(_len9 > 1 ? _len9 - 1 : 0), _key9 = 1; _key9 < _len9; _key9++) {
      rest[_key9 - 1] = arguments[_key9];
    }

    (_console5 = console).warn.apply(_console5, rest);
  },
  saveInArguments: function saveInArguments(type, args) {
    try {
      var s = [];
      args.forEach(function (item) {
        if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)).toLowerCase() == 'object') {
          s.push(changeObjectToString(item));
        } else if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)).toLowerCase() == 'boolean' || (typeof item === 'undefined' ? 'undefined' : _typeof(item)).toLowerCase() == 'number' || (typeof item === 'undefined' ? 'undefined' : _typeof(item)).toLowerCase() == 'string') {
          s.push(item);
        }
      });
      var time = new Date().Format('hh:mm:ss');
      this.logArray.push({
        type: type,
        time: time,
        msg: s.length == 1 ? s : JSON.stringify(s)
      });
      var index = levels.indexOf(type);
      if (!this.only && this.level <= index || this.only && this.level == index) {
        console.debug('%c' + type, '' + leveldisplays[index], s.length == 1 ? s : JSON.stringify(s));
      }
      _ui2.default.append({
        type: type,
        time: time,
        msg: s.length == 1 ? s : JSON.stringify(s)
      });
    } catch (e) {}
  },
  getData: function getData(type, str) {
    return this.logArray.filter(function (item) {
      if ((item.type == type || type == 'all') && (!str || item.msg.indexOf(str) > -1)) {
        return true;
      }
    });
  },
  saveAsFile: function saveAsFile() {
    var content = '';
    this.logArray.forEach(function (item) {
      content += item.time + '    ' + item.type + '   ' + item.msg + '\r\n';
    });
    var timeStr = new Date().getTime();
    var dateStr = new Date().Format("yyyy-MM-dd hh:mm:ss SS");
    (0, _save.saveTextAs)(content, "logger " + startDateStr + " to " + dateStr + ".txt");
  },
  setLevel: function setLevel() {
    var level = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5;

    logger.level = parseInt(level);
    slogger.level = logger.level;
    _storage2.default.set('logger', slogger);
  },
  setOnly: function setOnly(only) {
    logger.only = !!only;
    slogger.only = logger.only;
    _storage2.default.set('logger', slogger);
  },
  setSaveFile: function setSaveFile(saveFile) {
    logger.saveFile = !!saveFile;
    slogger.saveFile = logger.saveFile;
    _storage2.default.set('logger', slogger);
  },
  setUIDsiplay: function setUIDsiplay(UIDsiplay) {
    logger.UIDsiplay = !!UIDsiplay;
    slogger.UIDsiplay = logger.UIDsiplay;
    _storage2.default.set('logger', slogger);
  },
  show: function show() {
    _ui2.default.show();
  },
  hide: function hide() {
    _ui2.default.hide();
  }
};
var changeObjectToString = function changeObjectToString(e) {
  var result = '';
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = entries(e)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = _slicedToArray(_step.value, 2),
          key = _step$value[0],
          value = _step$value[1];

      if (value.constructor != Function) {
        if (typeof value == 'string' || typeof value == 'boolean' || typeof value == 'number') {
          result += '\'{' + key + ': ' + value + ' }\',';
        } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object') {
          result += '\'{' + key + ': ' + changeObjectToString(value) + ' }\',';
        }
      } else {
        result += '\'{' + key + ': Function }\',';
      }
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

  return result;
};

logger.saveAs = _save.saveAs;
logger.saveTextAs = _save.saveTextAs;
window.logger = {
  setLevel: function setLevel(level) {
    logger.setLevel(level);
  },
  setOnly: function setOnly(only) {
    logger.setOnly(only);
  },
  setSaveFile: function setSaveFile(can) {
    logger.setSaveFile(can);
  },
  setUIDsiplay: function setUIDsiplay(UIDsiplay) {
    logger.setUIDsiplay(UIDsiplay);
  },
  show: function show() {
    _ui2.default.show();
  }
};

function addEvent(event, func) {
  if (document.all) {
    window.attachEvent("on" + event, func); //对于IE
  } else {
    window.addEventListener(event, func, false);
  }
}
addEvent("unload", function () {
  if (logger.saveFile) {
    logger.saveAsFile();
  }
});
addEvent("error", function (msg, url, line) {
  if (msg && msg.originalEvent) {
    console.error("错误信息：", msg.originalEvent.message);
    console.error("出错文件：", msg.originalEvent.filename);
    console.error("出错行号：", msg.originalEvent.lineno);
    console.error("出错列号：", msg.originalEvent.colno);
  }
});
exports.default = logger;

logger.init();