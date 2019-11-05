"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function formatParams(data) {
  var arr = [];
  for (var name in data) {
    if (data[name] != undefined) {
      arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
    }
  }
  return arr.join("&");
}
function baseAjax() {
  for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
    rest[_key] = arguments[_key];
  }

  var xmlhttp;
  var time = 60000;
  var timeout = false;

  if (window.XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  } else {
    xmlhttp = null;
    return;
  }
  var timer = setTimeout(function () {
    timeout = true;
    xmlhttp.abort();
  }, time);
  var callback = rest[3];
  var failcallback = rest[4];
  var type = rest[5];
  var contentType = 'application/x-www-form-urlencoded';
  if (type == 'json') {
    contentType = "application/json";
  }
  var async = rest[6];
  xmlhttp.open(rest[0], rest[1], async);
  xmlhttp.onreadystatechange = function () {
    if (timeout) {
      if (timer) {
        clearTimeout(timer);
      }
      if (failcallback) {
        failcallback();
        failcallback = null;
      }
      return;
    }
    if (xmlhttp.readyState == 4 && xmlhttp.status >= 200 && xmlhttp.status < 300) {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var result = xmlhttp.responseText;
        try {
          result = JSON.parse(result);
        } catch (e) {}
        callback(result);
      }
    } else if (xmlhttp.status >= 400) {
      if (failcallback) {
        failcallback();
        failcallback = null;
      }
    }
  };
  if (!navigator.onLine) {
    if (failcallback) {
      failcallback();
      failcallback = null;
    }
    return;
  }
  if (rest[0] == 'GET') {
    xmlhttp.setRequestHeader('Content-Type', contentType);
    xmlhttp.send();
  } else {
    var msgdata = rest[2];
    var str = formatParams(msgdata);
    if (type == 'json') {
      str = JSON.stringify(msgdata);
    } else if (type == 'form') {
      str = msgdata;
    }
    xmlhttp.setRequestHeader("Content-type", contentType);
    xmlhttp.send(str);
  }
}
function pullRequest(method, url, params, success, failure) {
  var contentType = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'text';
  var async = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : true;


  if (method == 'GET') {
    url = url + (url.indexOf('?') > -1 ? '&' : '?') + formatParams(params);
  }
  baseAjax(method, url, params, success, failure, contentType, async);
}

var _jsonp = function _jsonp(url, params, success, failure) {
  var async = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
  var jsonpCallback = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'jsonpCallback';
  var jsonpName = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 'jsonpCallback';

  url = url + (url.indexOf('?') > -1 ? '&' : '?') + formatParams(params);
  url += (url.indexOf('?') > -1 ? '&' : '?') + jsonpName + '=' + jsonpCallback;
  window[jsonpCallback] = function (e) {
    success(e);
  };
  var script = document.createElement('script');
  script.setAttribute('src', url);
  script.id = jsonpName;
  script.type = 'text/javascript';
  if (!async) {
    script.async = true;
  }
  // 把script标签加入head，此时调用开始
  var removeNode = function removeNode() {
    if (document.getElementById(jsonpName)) {
      if (document.getElementById(jsonpName).remove) {
        document.getElementById(jsonpName).remove();
      } else {
        document.getElementById(jsonpName).removeNode(true);
      }
    }
  };
  removeNode();
  script.onerror = function (e) {
    failure();
    removeNode();
  };
  script.onload = function () {
    success();
    removeNode();
  };
  document.body.appendChild(script);
};
exports.default = {
  post: function post(url, params, success, failure, async) {
    return pullRequest('POST', url, params, success, failure, 'text', async);
  },
  get: function get(url, params, success, failure, async) {
    return pullRequest('GET', url, params, success, failure, 'text', async);
  },
  postJson: function postJson(url, params, success, failure, async) {
    return pullRequest('POST', url, params, success, failure, 'json', async);
  },
  postForm: function postForm(url, params, success, failure, async) {
    return pullRequest('POST', url, params, success, failure, 'form', async);
  },
  jsonp: function jsonp(url, params, success, failure, async, jsonpCallback, jsonpName) {
    return _jsonp(url, params, success, failure, async, jsonpCallback, jsonpName);
  }
};