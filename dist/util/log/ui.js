"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _insertStyle = require("../insertStyle");

var _insertStyle2 = _interopRequireDefault(_insertStyle);

var _ = require(".");

var _2 = _interopRequireDefault(_);

var _bind = require("../bind");

var _drag = require("./drag");

var _drag2 = _interopRequireDefault(_drag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CSSID = 'nclient-util-log-css';
var LOG_CLASS = 'nclient-util-log';
var LOG_ZOOM_CLASS = 'nclient-util-log-zoom';

var logHtml = "<div class='tools'><span class='control'>\u6682\u505C</span><span class='zoom'>\u7F29\u5C0F</span><span class='from'>all</span><span class='copy'>\u5BFC\u51FA</span><span class='move'>\u79FB\u52A8</span><span class='closebtn'>\u5173\u95ED</span></div><div class='list'></div>";
var logCss = ".nclient-util-log {\n  position: fixed;\n  top: 0px;\n  left: 0px;\n  width: 300px;\n  height: 60%;\n  background: rgb(255, 255, 255);\n  border: 1px solid #000;\n  border-radius: 5px;\n  z-index: 1000000;\n  display: none;\n}\n.nclient-util-log.nclient-util-log-zoom {\n  width: 300px;\n  height: 40px;\n}\n.nclient-util-log .tools {\n  position: absolute;\n  top: 0px;\n  width: 80%;\n  height: 20px;\n  margin: 10px 10%;\n}\n\n.nclient-util-log .list {\n  position: absolute;\n  top: 40px;\n  width: 100%;\n  bottom: 0px;\n  overflow-x: hidden;\n  overflow-y: auto;\n  word-break: break-all;\n}\n\n.nclient-util-log .tools span {\n  width: 16.6%;\n  box-sizing: border-box;\n  display: inline-block;\n  text-align: center;\n  line-height: 20px;\n  background: #e1e1e1;\n  cursor: pointer;\n}\n.nclient-util-log .tools span.move {\n  cursor: move;\n}\n\n.nclient-util-log .logBoxcol {\n  background: #333333;\n  color: #fff;\n}\n\n.nclient-util-log .logBoxcol:nth-child(even) {\n  background: #fff;\n  color: #333333;\n}";

var removeNode = function removeNode(node) {
  if (node.remove) {
    node.remove();
  } else {
    node.removeNode(true);
  }
};
var addCss = function addCss() {
  (0, _insertStyle2.default)(logCss, CSSID);
};
var addHtml = function addHtml() {
  var div = document.createElement("div");
  div.innerHTML = logHtml;
  div.className = "" + LOG_CLASS;
  document.body.appendChild(div);
};
var clearHtml = function clearHtml() {
  if (document.getElementsByClassName("" + LOG_CLASS).length > 0) {
    document.getElementsByClassName("" + LOG_CLASS).forEach(function (node) {
      return removeNode(node);
    });
  }
};

var status = {
  control: false,
  zoom: false,
  level: 0
};

var show = function show() {
  var box = document.querySelector("." + LOG_CLASS);
  if (box) {
    box.style.display = 'block';
  }
};

var hide = function hide() {
  var box = document.querySelector("." + LOG_CLASS);
  if (box) {
    box.style.display = 'none';
  }
  display();
};

var init = function init() {
  clearHtml();
  addCss();
  addHtml();
  show();
  var logBox = document.querySelector("." + LOG_CLASS);
  var control = document.querySelector("." + LOG_CLASS + " .control");
  var zoom = document.querySelector("." + LOG_CLASS + " .zoom");
  var from = document.querySelector("." + LOG_CLASS + " .from");
  var copy = document.querySelector("." + LOG_CLASS + " .copy");
  var move = document.querySelector("." + LOG_CLASS + " .move");
  var closebtn = document.querySelector("." + LOG_CLASS + " .closebtn");
  (0, _drag2.default)(move, logBox);
  (0, _bind.addHandler)(control, 'click', function () {
    status.control = !status.control;
    control.innerHTML = status.control ? '开始' : '暂停';
    if (!status.control) {
      display();
    }
  });
  (0, _bind.addHandler)(zoom, 'click', function () {
    status.zoom = !status.zoom;
    zoom.innerHTML = status.zoom ? '缩小' : '放大';
    logBox.className = LOG_CLASS + " " + (status.zoom ? LOG_ZOOM_CLASS : '');
  });
  (0, _bind.addHandler)(from, 'click', function () {
    status.level++;
    if (status.level >= _.levels.length) {
      status.level = 0;
    }
    from.innerHTML = _.levels[status.level];
    display();
  });
  (0, _bind.addHandler)(copy, 'click', function () {
    _2.default.saveAsFile();
  });
  (0, _bind.addHandler)(closebtn, 'click', function () {
    hide();
  });
};

var display = function display() {
  var sdata = _2.default.getData(_.levels[status.level]);
  var list = document.querySelector("." + LOG_CLASS + " .list");
  if (list) {
    var html = "";
    for (var i = 0, len = sdata.length; i < len; i++) {
      var target = sdata[i];
      var text = target.time + ' ' + target.type + ' ' + target.msg;
      html += '<div class="logBoxcol">' + text + '</div>';
    }
    list.innerHTML = html;
    list.scrollTop = list.scrollHeight;
  }
};
var append = function append(target) {
  if (status.control) {
    return;
  }
  var list = document.querySelector("." + LOG_CLASS + " .list");
  if (list) {
    var div = document.createElement("div");
    var msg = target.time + ' ' + target.type + ' ' + target.msg;
    div.innerHTML = "" + msg;
    div.className = "logBoxcol";
    list.appendChild(div);
    list.scrollTop = list.scrollHeight;
  }
};
exports.default = {
  init: init,
  hide: hide,
  show: show,
  display: display,
  append: append
};