function formatParams(data) {
  var arr = [];
  for(var name in data){
    if (data[name] != undefined) {
      arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
    }
  }
  return arr.join("&");
}
function baseAjax() {
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
  var timer = setTimeout( function(){
    timeout = true;
    xmlhttp.abort();
  }, time );
  var callback = arguments[3];
  var failcallback = arguments[4];
  var type = arguments[5];
  var contentType = 'application/x-www-form-urlencoded'
  if (type == 'json') {
    contentType = "application/json"
  }
  var async = arguments[6];
  xmlhttp.open(arguments[0],arguments[1],async);
  xmlhttp.onreadystatechange = function(){
    if( timeout ) {
      if (timer) {
        clearTimeout( timer );
      }
      if (failcallback) {
        failcallback();
        failcallback = null;
      }
      return ;
    }
    if ((xmlhttp.readyState == 4)  && xmlhttp.status >= 200 && xmlhttp.status <300) {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var result = xmlhttp.responseText
        try{
          result = JSON.parse(result)
        }catch(e){}
        callback(result);
      }
    } else if (xmlhttp.status >= 400) {
      if (failcallback) {
        failcallback();
        failcallback = null;
      }
    }
  }
  if (!navigator.onLine) {
    if (failcallback) {
      failcallback();
      failcallback = null;
    }
    return
  }
  if (arguments[0] == 'GET') {
      xmlhttp.setRequestHeader('Content-Type', contentType);
      xmlhttp.send();
  } else {
    var msgdata = arguments[2];
    var str = formatParams(msgdata);
    if (type == 'json') {
      str = JSON.stringify(msgdata)
    } else if (type == 'form') {
      str = msgdata;
    }
    xmlhttp.setRequestHeader("Content-type", contentType );
    xmlhttp.send(str);
  }
}
function pullRequest(method, url, params, success, failure, contentType = 'text', async = true) {

if (method == 'GET') {
  url = url + (url.indexOf('?')>-1?'&':'?') +formatParams(params)
}
baseAjax(method,url,params,success,failure, contentType, async)
}

var jsonp = (url, params, success, failure, async = true, jsonpCallback = 'jsonpCallback', jsonpName = 'jsonpCallback') => {
  url = url + (url.indexOf('?') > -1 ? '&' : '?') + formatParams(params)
  url += (url.indexOf('?') > -1 ? '&' : '?') + jsonpName + '=' + jsonpCallback
  window[jsonpCallback] = function (e) {
    success(e);
  };
  var script = document.createElement('script');
  script.setAttribute('src', url);
  script.id = jsonpName;
  script.type = 'text/javascript'
  if (!async) {
    script.async = true;
  }
  // 把script标签加入head，此时调用开始
  var removeNode = function () {
    if (document.getElementById(jsonpName)) {
      if (document.getElementById(jsonpName).remove) {
        document.getElementById(jsonpName).remove()
      } else {
        document.getElementById(jsonpName).removeNode(true)
      }
    }
  }
  removeNode()
  script.onerror = (e) => {
    failure();
    removeNode()
  }
  script.onload = () => {
    success();
    removeNode()
  }
  document.body.appendChild(script);
}
export default {
  post: function (url, params, success, failure, async) {
    return pullRequest('POST', url, params, success, failure, 'text', async)
  },
  get: function (url, params, success, failure, async) {
    return pullRequest('GET', url, params, success, failure, 'text', async)
  },
  postJson: function (url, params, success, failure, async) {
    return pullRequest('POST', url, params, success, failure, 'json', async)
  },
  postFrom: function (url, params, success, failure, async) {
    return pullRequest('POST', url, params, success, failure, 'form', async)
  },
  jsonp: (url, params, success, failure, async, jsonpCallback, jsonpName) => {
    return jsonp(url, params, success, failure, async, jsonpCallback, jsonpName);
  }
}