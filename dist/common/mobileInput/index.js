"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _insertStyle = require("../../util/insertStyle");

var _insertStyle2 = _interopRequireDefault(_insertStyle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var entries = Object.entries;


var path = [];
var OS = function (navigator, userAgent, platform, appVersion) {
  var detect = {};
  detect.webkit = userAgent.match(/WebKit\/([\d.]+)/) ? true : false;
  detect.ipod = /iPod/i.test(platform) || userAgent.match(/(iPod).*OS\s([\d_]+)/) ? true : false;
  detect.ipad = /iPad/i.test(navigator.userAgent) || userAgent.match(/(iPad).*OS\s([\d_]+)/) ? true : false;
  detect.iphone = /iPhone/i.test(platform) || !detect.ipad && userAgent.match(/(iPhone\sOS)\s([\d_]+)/) ? true : false;
  detect.mac = /Mac/i.test(platform);
  detect.ios = detect.ipod || detect.ipad || detect.iphone;
  detect.safari = userAgent.match(/Safari/) && !detect.chrome ? true : false;
  // eslint-disable-next-line 
  detect.mobileSafari = detect.ios && !!appVersion.match(/(?:Version\/)([\w\._]+)/);
  if (detect.ios) detect.iosVersion = parseFloat(appVersion.slice(appVersion.indexOf("Version/") + 8)) || -1;
  return detect;
}(navigator, navigator.userAgent, navigator.platform, navigator.appVersion || navigator.userAgent);
var el = document.documentElement;
var width = el.clientWidth;
var height = el.clientHeight;
var htmlStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%'
};
var bodyStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  overflow: 'hidden'
};

var newStyle = function newStyle() {
  var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'changeStyle';

  var htmlStyleTxt = "";
  var bodyStyleTxt = "";
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = entries(htmlStyle)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = _slicedToArray(_step.value, 2),
          key = _step$value[0],
          value = _step$value[1];

      htmlStyleTxt += key + ": " + value + ";";
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

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = entries(bodyStyle)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _step2$value = _slicedToArray(_step2.value, 2),
          key = _step2$value[0],
          value = _step2$value[1];

      bodyStyleTxt += key + ": " + value + ";";
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  var ns = "html{" + htmlStyleTxt + "}body{" + bodyStyleTxt + "}";
  (0, _insertStyle2.default)(ns, id);
};
newStyle('mainStyle');
var scrollTop = function scrollTop(top) {
  if (typeof top === "undefined") {
    return document.documentElement.scrollTop || document.body.scrollTop;
  } else {
    window.scrollTo(0, top);
  }
};

var adHeight = function () {
  var adjustHeight = 0;
  var special = 0;
  if (OS.ios && OS.iosVersion <= 12) {
    adjustHeight = 40;
    if (screen.height == 812 && screen.width == 375) {
      adjustHeight = 40;
    } else if (screen.height == 736 && screen.width == 414) {
      if (width > 365 && width < 385) {
        adjustHeight = 40;
        special = 288;
      }
      if (width > 404 && width < 424) {
        adjustHeight = 40;
        special = 303;
      }
    } else if (screen.height == 667 && screen.width == 375) {
      if (width > 365 && width < 385) {
        adjustHeight = 40;
        special = 288;
      }
      if (width > 404 && width < 424) {
        adjustHeight = 40;
        special = 303;
      }
    } else if (screen.height == 568 && screen.width == 320) {
      adjustHeight = 40;
    }
  }
  return {
    adjustHeight: adjustHeight,
    special: special
  };
}();
var STATUS = {
  currentStatus: [],
  blurClick: 0,
  focusClick: 1,
  onScroll: 2,
  onResize: 3,
  checking: 4,
  checkSuccess: 5,
  blurSuccess: 6,
  blurFail: 7,
  focusAfterInsert: 8,
  checkSuccessNormal: 9,
  checkSuccessIphone: 10,
  checkSuccessAndroid: 11,
  changeStatus: function changeStatus(num) {
    if (this.blurFail == num) {
      this.currentStatus = [];
    } else if (this.focusAfterInsert == num) {
      var index = this.currentStatus.indexOf(this.blurClick);
      if (index > -1) {
        this.currentStatus.splice(index, 1);
      }
    } else if (this.blurSuccess == num) {
      this.currentStatus = [];
    } else {
      this.currentStatus.push(num);
    }
  },
  has: function has(num) {
    if (this.currentStatus.length > 0) {
      return this.currentStatus.indexOf(num) > -1;
    }
    return false;
  }
};
var inputCheck = {
  changeStatus: 1,
  changeCheckTimeout: null,
  init: function init(_ref) {
    var fail = _ref.fail,
        success = _ref.success;

    var m = this;
    var el = document.documentElement;
    width = el.clientWidth;
    height = el.clientHeight;
    m.failCall = fail;
    m.successCall = success;
    document.body.addEventListener("scroll", function () {
      if (m.startCheckTimeout) {
        clearTimeout(m.startCheckTimeout);
      }
      m.startCheckTimeout = null;
      if (!STATUS.has(STATUS.blurClick)) {
        STATUS.changeStatus(STATUS.onScroll);
        m.changeCheck();
      }
    }, false);
    document.body.addEventListener("resize", function () {
      if (m.startCheckTimeout) {
        clearTimeout(m.startCheckTimeout);
      }
      m.startCheckTimeout = null;
      if (!STATUS.has(STATUS.blurClick)) {
        STATUS.changeStatus(STATUS.onResize);
        m.changeCheck();
      }
    }, false);
  },
  changeCheck: function changeCheck() {
    var m = this;
    if (this.changeCheckTimeout) {
      clearTimeout(this.changeCheckTimeout);
    }
    this.changeCheckTimeout = setTimeout(function () {
      if (!STATUS.has(STATUS.checking)) {
        m.checkFun();
      }
    }, 700);
  },
  startCheck: function startCheck() {
    var m = this;
    if (!navigator.userAgent.match(/.*iphone.*|.*Linux.*|.*AppleWebKit.*Mobile.*/)) {
      return;
    }
    STATUS.changeStatus(STATUS.focusClick);
    bodyStyle.height = 'auto';
    bodyStyle.bottom = adHeight.adjustHeight + 'px';
    newStyle();
    if (this.startCheckTimeout) {
      clearTimeout(this.startCheckTimeout);
    }
    this.startCheckTimeout = setTimeout(function () {
      if (!m.isWindowChange()) {
        m.blurInput(m.isDetectedError());
      } else {
        m.changeCheck();
      }
    }, 2000);
  },
  isWindowChange: function isWindowChange() {
    var htmlHeight = el.clientHeight;
    var isresize = htmlHeight != height;
    var isscroll = scrollTop() != 0;
    return isresize || isscroll;
  },
  isInReliableArea: function isInReliableArea() {
    var htmlHeight = el.clientHeight;
    var isresize = htmlHeight !== height;
    var scrollY = scrollTop();
    var reliableScroll = !(adHeight.special && adHeight.special > scrollY);
    var isscroll = scrollY != 0 && scrollY < height && reliableScroll;
    return isresize || isscroll;
  },
  isDetectedError: function isDetectedError() {
    return !(STATUS.has(STATUS.onScroll) || STATUS.has(STATUS.onResize));
  },
  isScorll: false,
  checkFun: function checkFun() {
    var m = this;
    m.isScorll = false;
    if (m.isWindowChange()) {
      bodyStyle.height = 'auto';
      bodyStyle.bottom = adHeight.adjustHeight + 'px';
      newStyle();
      STATUS.changeStatus(STATUS.checking);
      if (m.isInReliableArea()) {
        STATUS.changeStatus(STATUS.checkSuccessNormal);
        m.success();
      } else {
        scrollTop(adHeight.special || 99999);
        m.isScorll = true;
        if (OS.ios) {
          path[0] = 1;
          m.checkIphone();
          STATUS.changeStatus(STATUS.checkSuccessIphone);
        } else {
          path[0] = 2;
          m.checkNotIphone();
          STATUS.changeStatus(STATUS.checkSuccessAndroid);
        }
      }
    } else {
      m.blurInput();
    }
  },
  success: function success() {
    STATUS.changeStatus(STATUS.checkSuccess);
    this.savedHeight = el.clientHeight;
    if (this.successCall) {
      this.successCall(parseInt(bodyStyle.bottom));
    }
  },
  end: function end() {
    var m = this;
    STATUS.changeStatus(STATUS.blurClick);
    setTimeout(function () {
      if (STATUS.has(STATUS.blurClick)) {
        if (m.checkTimeout) {
          clearTimeout(m.checkTimeout);
        }
        htmlStyle.position = "absolute";
        htmlStyle.top = 0;
        htmlStyle.left = 0;
        htmlStyle.width = "100%";
        htmlStyle.height = "100%";
        bodyStyle.bottom = 0;
        newStyle();
        scrollTop(0);
        STATUS.changeStatus(STATUS.blurSuccess);
      } else {
        STATUS.changeStatus(STATUS.blurFail);
      }
    }, 100);
  },
  checkIphone: function checkIphone() {
    var m = this;
    if (m.checkTimeout) {
      clearTimeout(m.checkTimeout);
    }
    m.checkTimeout = setTimeout(function () {
      m.checkIphoneFun();
    }, 300);
  },
  checkNotIphone: function checkNotIphone() {
    var m = this;
    if (m.checkTimeout) {
      clearTimeout(m.checkTimeout);
    }
    m.checkTimeout = setTimeout(function () {
      m.checkNotIphoneFun();
    }, 500);
  },
  samples: [],
  checkIphoneFun: function checkIphoneFun() {
    var m = this;
    if (m.isInReliableArea()) {
      m.success();
      return;
    }
    if (document.activeElement && document.activeElement.scrollIntoViewIfNeeded) {
      window.setTimeout(function () {
        document.activeElement.scrollIntoViewIfNeeded();
      }, 0);
    }
    if (m.checkTimeout) {
      clearTimeout(m.checkTimeout);
    }
    m.samples = [];
    m.getSample();
  },
  checkNotIphoneFun: function checkNotIphoneFun() {
    var m = this;
    if (scrollTop() < document.body.scrollHeight && document.documentElement.scrollTop != 0) {
      path[0] = 1;
      this.checkIphone();
    } else if (!(document.body.clientWidth == 320)) {
      //iphone5例外
      if (document.activeElement && document.activeElement.scrollIntoViewIfNeeded) {
        window.setTimeout(function () {
          document.activeElement.scrollIntoViewIfNeeded();
        }, 0);
      }
      m.success();
    }
  },
  getSample: function getSample() {
    var m = this;
    var scHeight = document.body.scrollHeight;
    var htmlHeight = el.clientHeight;
    var scrollY = scrollTop();
    m.samples.push({
      scHeight: scHeight,
      scrollY: scrollY,
      height: htmlHeight
    });
    m.changeHeight();
    if (m.isInReliableArea()) {
      m.success();
    } else if (m.samples.length == 1) {
      m.checkTimeout = setTimeout(function () {
        if (scrollTop() < 100 && m.isScorll || scrollTop() == 0 && document.body.scrollHeight == el.clientHeight) {
          var keyboardHeight = scrollTop() || height - window.innerHeight;
          var sheight = keyboardHeight || 99999;
          scrollTop(sheight);
        }
        m.getSample();
      }, 500);
    }
  },
  changeHeight: function changeHeight() {
    var m = this;
    if (m.samples.length == 1) {
      var w = m.checkHeight(m.samples[0]);
      var a = w.a;
      var b = w.b;
      var c = w.c;
      var h = w.h;
      if (c < -100) {
        m.samples[0].type = 1;
      } else if (a < 10) {
        if (b > 0) {
          m.samples[0].type = 2;
          htmlStyle.top = 0;
          htmlStyle.width = "100%";
          htmlStyle.height = h + 'px';
          newStyle();
        } else {
          m.samples[0].type = 3;
          htmlStyle.top = 0;
          htmlStyle.width = "100%";
          htmlStyle.height = height + 'px';
          newStyle();
        }
      } else {
        m.samples[0].type = 4;
        htmlStyle.top = 0;
        htmlStyle.width = "100%";
        htmlStyle.height = height + 'px';
        newStyle();
      }
      path[1] = m.samples[0].type;
      return;
    } else if (m.samples.length >= 2) {
      var first = m.samples[0];
      var second = m.samples[1];
      path[2] = 3;
      if (first.scrollY == second.scrollY && first.height == second.height && first.scHeight == second.scHeight) {
        path[2] = 0;
        m.success();
        return;
      } else if (first.scrollY != second.scrollY) {
        var w2 = m.checkHeight(second);
        var b2 = w2.b2;
        var h2 = w2.h2;
        if (b2 > 0) {
          second.type = 2;
          htmlStyle.top = 0;
          htmlStyle.width = "100%";
          htmlStyle.height = h2 + 'px';
          newStyle();
        } else {
          htmlStyle.top = 0;
          htmlStyle.width = "100%";
          htmlStyle.height = height + 'px';
          newStyle();
        }
        path[2] = 1;
        m.samples = [m.samples.pop()];
      } else if (first.height != second.height) {
        if (first.type == 3) {
          path[2] = 2;
          htmlStyle.top = 0;
          htmlStyle.width = "100%";
          htmlStyle.height = second.height + 'px';
          newStyle();
        }
        m.success();
        return;
      } else {
        m.success();
        return;
      }
    }
  },
  checkHeight: function checkHeight(sample) {
    var a = Math.abs(sample.scHeight - height);
    var b = sample.scrollY - height * 2;
    var c = sample.height - height;
    var d = sample.scHeight - sample.scrollY;
    var h = Math.min(d, height / 2);
    h = parseInt(Math.max(h, height / 2));
    return {
      a: a,
      b: b,
      c: c,
      h: h
    };
  },
  focusAfterInsert: function focusAfterInsert() {
    var continueInsert = height != el.clientHeight || scrollTop() != 0;
    if (continueInsert) {
      STATUS.changeStatus(STATUS.focusAfterInsert);
    }
    return continueInsert;
  },
  blurInput: function blurInput(value) {
    if (this.failCall) {
      this.failCall(value);
    }
  }
};
exports.default = inputCheck;