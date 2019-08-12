'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

require('./bind');

var _storage = require('./storage');

var _storage2 = _interopRequireDefault(_storage);

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
var levels = ['no', 'log', 'info', 'debug', 'error', 'warn'];
var leveldisplays = ['no', 'background: #E170D6;color:#fff;', 'background: #56E13E;color:#fff;', 'background: #0091E1;color:#fff;', 'background: #f7c8c8;color: #235cdc;', 'background: #fff8a9;color: #ca8c1b'];
var logger = {
  LEVEL_LOG: 1,
  LEVEL_INFO: 2,
  LEVEL_DEBUG: 3,
  LEVEL_ERROR: 4,
  LEVEL_WARN: 5,
  level: parseInt(_storage2.default.get('loggerLevel')) || 3,
  only: _storage2.default.get('loggerOnly') || false,
  logArray: [],
  init: function init() {
    if (this.level > 0) {
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
    } catch (e) {}
  },
  saveAsFile: function saveAsFile() {
    var content = '';
    this.logArray.forEach(function (item) {
      content += item.time + '    ' + item.msg + '\r\n';
    });
    var timeStr = new Date().getTime();
    var dateStr = new Date().Format("yyyy-MM-dd hh:mm:ss SS");
    saveTextAs(content, "logger " + startDateStr + " to " + dateStr + ".txt");
  },
  setLevel: function setLevel() {
    var level = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5;

    logger.level = parseInt(level);
    _storage2.default.set('loggerLevel', logger.level);
  },
  setOnly: function setOnly(only) {
    logger.only = !!only;
    _storage2.default.set('loggerOnly', logger.only);
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

/* FileSaver.js
 *  A saveAs() & saveTextAs() FileSaver implementation.
 *  2014-06-24
 *
 *  Modify by Brian Chen
 *  Author: Eli Grey, http://eligrey.com
 *  License: X11/MIT
 *    See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 */

/*globalData self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

var saveAs = saveAs
// IE 10+ (native saveAs)
|| typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob && navigator.msSaveOrOpenBlob.bind(navigator)
// Everyone else
|| function (view) {
  "use strict";
  // IE <10 is explicitly unsupported

  if (typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
    return;
  }
  var doc = view.document
  // only get URL when necessary in case Blob.js hasn't overridden it yet

  ,
      get_URL = function get_URL() {
    return view.URL || view.webkitURL || view;
  },
      save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a"),
      can_use_save_link = !view.externalHost && "download" in save_link,
      click = function click(node) {
    var event = doc.createEvent("MouseEvents");
    event.initMouseEvent("click", true, false, view, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    node.dispatchEvent(event);
  },
      webkit_req_fs = view.webkitRequestFileSystem,
      req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem,
      throw_outside = function throw_outside(ex) {
    (view.setImmediate || view.setTimeout)(function () {
      throw ex;
    }, 0);
  },
      force_saveable_type = "application/octet-stream",
      fs_min_size = 0,
      deletion_queue = [],
      process_deletion_queue = function process_deletion_queue() {
    var i = deletion_queue.length;
    while (i--) {
      var file = deletion_queue[i];
      if (typeof file === "string") {
        // file is an object URL
        get_URL().revokeObjectURL(file);
      } else {
        // file is a File
        file.remove();
      }
    }
    deletion_queue.length = 0; // clear queue
  },
      dispatch = function dispatch(filesaver, event_types, event) {
    event_types = [].concat(event_types);
    var i = event_types.length;
    while (i--) {
      var listener = filesaver["on" + event_types[i]];
      if (typeof listener === "function") {
        try {
          listener.call(filesaver, event || filesaver);
        } catch (ex) {
          throw_outside(ex);
        }
      }
    }
  },
      FileSaver = function FileSaver(blob, name) {
    // First try a.download, then web filesystem, then object URLs
    var filesaver = this,
        type = blob.type,
        blob_changed = false,
        object_url,
        target_view,
        get_object_url = function get_object_url() {
      var object_url = get_URL().createObjectURL(blob);
      deletion_queue.push(object_url);
      return object_url;
    },
        dispatch_all = function dispatch_all() {
      dispatch(filesaver, "writestart progress write writeend".split(" "));
    }
    // on any filesys errors revert to saving with object URLs

    ,
        fs_error = function fs_error() {
      // don't create more object URLs than needed
      if (blob_changed || !object_url) {
        object_url = get_object_url(blob);
      }
      if (target_view) {
        target_view.location.href = object_url;
      } else {
        window.open(object_url, "_blank");
      }
      filesaver.readyState = filesaver.DONE;
      dispatch_all();
    },
        abortable = function abortable(func) {
      return function () {
        if (filesaver.readyState !== filesaver.DONE) {
          return func.apply(this, arguments);
        }
      };
    },
        create_if_not_found = {
      create: true,
      exclusive: false
    },
        slice;
    filesaver.readyState = filesaver.INIT;
    if (!name) {
      name = "download";
    }
    if (can_use_save_link) {
      object_url = get_object_url(blob);
      save_link.href = object_url;
      save_link.download = name;
      click(save_link);
      filesaver.readyState = filesaver.DONE;
      dispatch_all();
      return;
    }
    // Object and web filesystem URLs have a problem saving in Google Chrome when
    // viewed in a tab, so I force save with application/octet-stream
    // http://code.google.com/p/chromium/issues/detail?id=91158
    if (view.chrome && type && type !== force_saveable_type) {
      slice = blob.slice || blob.webkitSlice;
      blob = slice.call(blob, 0, blob.size, force_saveable_type);
      blob_changed = true;
    }
    // Since I can't be sure that the guessed media type will trigger a download
    // in WebKit, I append .download to the filename.
    // https://bugs.webkit.org/show_bug.cgi?id=65440
    if (webkit_req_fs && name !== "download") {
      name += ".download";
    }
    if (type === force_saveable_type || webkit_req_fs) {
      target_view = view;
    }
    if (!req_fs) {
      fs_error();
      return;
    }
    fs_min_size += blob.size;
    req_fs(view.TEMPORARY, fs_min_size, abortable(function (fs) {
      fs.root.getDirectory("saved", create_if_not_found, abortable(function (dir) {
        var save = function save() {
          dir.getFile(name, create_if_not_found, abortable(function (file) {
            file.createWriter(abortable(function (writer) {
              writer.onwriteend = function (event) {
                target_view.location.href = file.toURL();
                deletion_queue.push(file);
                filesaver.readyState = filesaver.DONE;
                dispatch(filesaver, "writeend", event);
              };
              writer.onerror = function () {
                var error = writer.error;
                if (error.code !== error.ABORT_ERR) {
                  fs_error();
                }
              };
              "writestart progress write abort".split(" ").forEach(function (event) {
                writer["on" + event] = filesaver["on" + event];
              });
              writer.write(blob);
              filesaver.abort = function () {
                writer.abort();
                filesaver.readyState = filesaver.DONE;
              };
              filesaver.readyState = filesaver.WRITING;
            }), fs_error);
          }), fs_error);
        };
        dir.getFile(name, {
          create: false
        }, abortable(function (file) {
          // delete file if it already exists
          file.remove();
          save();
        }), abortable(function (ex) {
          if (ex.code === ex.NOT_FOUND_ERR) {
            save();
          } else {
            fs_error();
          }
        }));
      }), fs_error);
    }), fs_error);
  },
      FS_proto = FileSaver.prototype,
      saveAs = function saveAs(blob, name) {
    return new FileSaver(blob, name);
  };
  FS_proto.abort = function () {
    var filesaver = this;
    filesaver.readyState = filesaver.DONE;
    dispatch(filesaver, "abort");
  };
  FS_proto.readyState = FS_proto.INIT = 0;
  FS_proto.WRITING = 1;
  FS_proto.DONE = 2;

  FS_proto.error = FS_proto.onwritestart = FS_proto.onprogress = FS_proto.onwrite = FS_proto.onabort = FS_proto.onerror = FS_proto.onwriteend = null;

  view.addEventListener("unload", process_deletion_queue, false);
  saveAs.unload = function () {
    process_deletion_queue();
    view.removeEventListener("unload", process_deletion_queue, false);
  };
  return saveAs;
}(typeof self !== "undefined" && self || typeof window !== "undefined" && window || undefined.content);

String.prototype.endsWithAny = function () {
  var strArray = Array.prototype.slice.call(arguments),
      $this = this.toLowerCase().toString();
  for (var i = 0; i < strArray.length; i++) {
    if ($this.indexOf(strArray[i], $this.length - strArray[i].length) !== -1) return true;
  }
  return false;
};

var saveTextAs = saveTextAs || function (textContent, fileName, charset) {
  fileName = fileName || 'download.txt';
  charset = charset || 'utf-8';
  textContent = (textContent || '').replace(/\r?\n/g, "\r\n");
  if (saveAs && Blob) {
    var blob = new Blob([textContent], {
      type: "text/plain;charset=" + charset
    });
    saveAs(blob, fileName);
    return true;
  } else {
    //IE9-
    var saveTxtWindow = window.frames.saveTxtWindow;
    if (!saveTxtWindow) {
      saveTxtWindow = document.createElement('iframe');
      saveTxtWindow.id = 'saveTxtWindow';
      saveTxtWindow.style.display = 'none';
      document.body.insertBefore(saveTxtWindow, null);
      saveTxtWindow = window.frames.saveTxtWindow;
      if (!saveTxtWindow) {
        saveTxtWindow = window.open('', '_temp', 'width=100,height=100');
        if (!saveTxtWindow) {
          window.alert('Sorry, download file could not be created.');
          return false;
        }
      }
    }

    var doc = saveTxtWindow.document;
    doc.open('text/html', 'replace');
    doc.charset = charset;
    if (fileName.endsWithAny('.htm', '.html')) {
      doc.close();
      doc.body.innerHTML = '\r\n' + textContent + '\r\n';
    } else {
      if (!fileName.endsWithAny('.txt')) fileName += '.txt';
      doc.write(textContent);
      doc.close();
    }

    var retValue = doc.execCommand('SaveAs', null, fileName);
    saveTxtWindow.close();
    return retValue;
  }
};
logger.init();
logger.saveAs = saveAs;
logger.saveTextAs = saveTextAs;
window.logger = {
  setLevel: function setLevel(level) {
    logger.setLevel(level);
  },
  setOnly: function setOnly(only) {
    logger.setOnly(only);
  }
};
window.onerror = function (msg, url, line) {
  if (msg && msg.originalEvent) {
    console.error("错误信息：", msg.originalEvent.message);
    console.error("出错文件：", msg.originalEvent.filename);
    console.error("出错行号：", msg.originalEvent.lineno);
    console.error("出错列号：", msg.originalEvent.colno);
  }
};
exports.default = logger;