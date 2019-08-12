import './bind';
import storage from './storage';

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
var levels = ['no', 'log', 'info', 'debug', 'error', 'warn']
var leveldisplays = ['no', 'background: #E170D6;color:#fff;', 'background: #56E13E;color:#fff;', 'background: #0091E1;color:#fff;', 'background: #f7c8c8;color: #235cdc;', 'background: #fff8a9;color: #ca8c1b']
var logger = {
  LEVEL_LOG: 1,
  LEVEL_INFO: 2,
  LEVEL_DEBUG: 3,
  LEVEL_ERROR: 4,
  LEVEL_WARN: 5,
  level: parseInt(storage.get('loggerLevel')) || 3,
  only:storage.get('loggerOnly') || false,
  logArray: [],
  init () {
    if (this.level > 0) {
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
    } catch (e) {

    }
  },
  saveAsFile() {
    var content = ''
    this.logArray.forEach(item => {
      content += item.time + '    ' + item.msg + '\r\n'
    })
    var timeStr = new Date().getTime();
    var dateStr = new Date().Format("yyyy-MM-dd hh:mm:ss SS");
    saveTextAs(content, "logger " + startDateStr + " to " + dateStr + ".txt");
  },
  setLevel (level = 5) {
    logger.level = parseInt(level)
    storage.set('loggerLevel', logger.level)
  },
  setOnly (only) {
    logger.only = !!only
    storage.set('loggerOnly', logger.only)
  },
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
  ||
  (typeof navigator !== "undefined" &&
    navigator.msSaveOrOpenBlob && navigator.msSaveOrOpenBlob.bind(navigator))
  // Everyone else
  ||
  (function (view) {
    "use strict";
    // IE <10 is explicitly unsupported
    if (typeof navigator !== "undefined" &&
      /MSIE [1-9]\./.test(navigator.userAgent)) {
      return;
    }
    var
      doc = view.document
      // only get URL when necessary in case Blob.js hasn't overridden it yet
      ,
      get_URL = function () {
        return view.URL || view.webkitURL || view;
      },
      save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a"),
      can_use_save_link = !view.externalHost && "download" in save_link,
      click = function (node) {
        var event = doc.createEvent("MouseEvents");
        event.initMouseEvent(
          "click", true, false, view, 0, 0, 0, 0, 0, false, false, false, false, 0, null
        );
        node.dispatchEvent(event);
      },
      webkit_req_fs = view.webkitRequestFileSystem,
      req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem,
      throw_outside = function (ex) {
        (view.setImmediate || view.setTimeout)(function () {
          throw ex;
        }, 0);
      },
      force_saveable_type = "application/octet-stream",
      fs_min_size = 0,
      deletion_queue = [],
      process_deletion_queue = function () {
        var i = deletion_queue.length;
        while (i--) {
          var file = deletion_queue[i];
          if (typeof file === "string") { // file is an object URL
            get_URL().revokeObjectURL(file);
          } else { // file is a File
            file.remove();
          }
        }
        deletion_queue.length = 0; // clear queue
      },
      dispatch = function (filesaver, event_types, event) {
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
      FileSaver = function (blob, name) {
        // First try a.download, then web filesystem, then object URLs
        var
          filesaver = this,
          type = blob.type,
          blob_changed = false,
          object_url, target_view, get_object_url = function () {
            var object_url = get_URL().createObjectURL(blob);
            deletion_queue.push(object_url);
            return object_url;
          },
          dispatch_all = function () {
            dispatch(filesaver, "writestart progress write writeend".split(" "));
          }
          // on any filesys errors revert to saving with object URLs
          ,
          fs_error = function () {
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
          abortable = function (func) {
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
            var save = function () {
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
      saveAs = function (blob, name) {
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

    FS_proto.error =
      FS_proto.onwritestart =
      FS_proto.onprogress =
      FS_proto.onwrite =
      FS_proto.onabort =
      FS_proto.onerror =
      FS_proto.onwriteend =
      null;

    view.addEventListener("unload", process_deletion_queue, false);
    saveAs.unload = function () {
      process_deletion_queue();
      view.removeEventListener("unload", process_deletion_queue, false);
    };
    return saveAs;
  }(
    typeof self !== "undefined" && self ||
    typeof window !== "undefined" && window ||
    this.content
  ));


String.prototype.endsWithAny = function () {
  var strArray = Array.prototype.slice.call(arguments),
    $this = this.toLowerCase().toString();
  for (var i = 0; i < strArray.length; i++) {
    if ($this.indexOf(strArray[i], $this.length - strArray[i].length) !== -1) return true;
  }
  return false;
};

var saveTextAs = saveTextAs ||
  (function (textContent, fileName, charset) {
    fileName = fileName || 'download.txt';
    charset = charset || 'utf-8';
    textContent = (textContent || '').replace(/\r?\n/g, "\r\n");
    if (saveAs && Blob) {
      var blob = new Blob([textContent], {
        type: "text/plain;charset=" + charset
      });
      saveAs(blob, fileName);
      return true;
    } else { //IE9-
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
  })
logger.init()
logger.saveAs = saveAs
logger.saveTextAs = saveTextAs
window.logger = {
  setLevel (level) {
    logger.setLevel(level)
  },
  setOnly (only) {
    logger.setOnly(only)
  },
}
window.onerror = (msg, url, line) => {
  if(msg && msg.originalEvent){
    console.error("错误信息：" , msg.originalEvent.message);
    console.error("出错文件：" , msg.originalEvent.filename);
    console.error("出错行号：" , msg.originalEvent.lineno);
    console.error("出错列号：" , msg.originalEvent.colno);
  }
}
export default logger