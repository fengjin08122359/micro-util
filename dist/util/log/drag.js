'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function posMove(target, moveTaget) {
  var dmW = document.documentElement.offsetWidth || document.body.offsetWidth;
  var dmH = document.documentElement.offsetHeight || document.body.offsetHeight;
  var sent = {
    l: 0, //设置div在父元素的活动范围，10相当于给父div设置padding-left：10;
    r: dmW - moveTaget.offsetWidth, // offsetWidth:当前对象的宽度， offsetWidth = width+padding+border
    t: 0,
    b: dmH - moveTaget.offsetHeight,
    n: 0
  };
  drag(target, moveTaget, sent);
}

/**
 *
 */
function addEvent(ele, type, fn) {
  if (ele.addEventListener) {
    ele.addEventListener(type, fn, false);
  } else if (ele.attachEvent) {
    ele.attachEvent('on' + type, fn);
  } else {
    ele['on' + type] = fn; //同过Key 来获取value
  }
}

//封装解绑任意事件的函数
function removeEvent(ele, type, fn) {
  if (ele.removeEventListener) {
    ele.removeEventListener(type, fn);
  } else if (ele.detachEvent) {
    ele.detachEvent('on' + type, fn);
  } else {
    ele['on' + type] = '';
  }
}

var sentObj = {};

function drag(target, moveTaget) {
  var sent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var startFun = function startFun(ev) {
    sentObj = {};
    var dmW = document.documentElement.offsetWidth || document.body.offsetWidth;
    var dmH = document.documentElement.offsetHeight || document.body.offsetHeight;

    sentObj.l = sent.l || 0;
    sentObj.r = sent.r || dmW - moveTaget.offsetWidth;
    sentObj.t = sent.t || 0;
    sentObj.b = sent.b || dmH - moveTaget.offsetHeight;
    sentObj.n = sent.n || 0;
    var oEvent = ev || event;
    sentObj.sentX = (oEvent.pageX || oEvent.touches[0].pageX || 0) - moveTaget.offsetLeft;
    sentObj.sentY = (oEvent.pageY || oEvent.touches[0].pageY || 0) - moveTaget.offsetTop;
    addEvent(document, 'mousemove', moveFun);
    addEvent(document, 'touchmove', moveFun);

    if (ev.stopPropagation) {
      ev.stopPropagation();
    } //For 'Good' browsers
    else {
        ev.cancelBubble = true;
      } //For IE
    return true;
  };
  var moveFun = function moveFun(ev) {
    var oEvent = ev || event;
    var slideLeft = (oEvent.pageX || oEvent.touches[0].pageX || 0) - sentObj.sentX;
    var slideTop = (oEvent.pageY || oEvent.touches[0].pageY || 0) - sentObj.sentY;
    if (slideLeft <= sentObj.l) {
      slideLeft = sentObj.l;
    }
    if (slideLeft >= sentObj.r) {
      slideLeft = sentObj.r;
    }
    if (slideTop <= sentObj.t) {
      slideTop = sentObj.t;
    }
    if (slideTop >= sentObj.b) {
      slideTop = sentObj.b;
    }
    moveTaget.style.left = slideLeft + 'px';
    moveTaget.style.top = slideTop + 'px';
    if (ev.stopPropagation) {
      ev.stopPropagation();
    } //For 'Good' browsers
    else {
        ev.cancelBubble = true;
      } //For IE
    return false;
  };
  var endFun = function endFun() {
    removeEvent(document, 'mousemove', moveFun);
    removeEvent(document, 'touchmove', moveFun);
    // removeEvent(target, 'mouseup', endFun)
    // removeEvent(target, 'touchend', endFun)
  };
  addEvent(target, 'mousedown', startFun);
  addEvent(target, 'touchstart', startFun);
  addEvent(target, 'mouseup', endFun);
  addEvent(target, 'touchend', endFun);
}

exports.default = posMove;