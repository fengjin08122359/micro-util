"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var storedImgs = [];
var storeImg = function storeImg(src) {
  //保存已展示的图片
  return new Promise(function (resolve, reject) {
    var img = new Image();
    img.src = src;
    if (img.complete) {
      storedImgs.push(src);
      resolve(src);
    }
    img.onload = function () {
      storedImgs.push(src);
      resolve(src);
    };
    img.onerror = function () {
      resolve(src);
    };
  }).catch(function () {
    resolve(src);
  });
};
exports.default = {
  store: function store(_ref) {
    var imgs = _ref.imgs,
        callback = _ref.callback;

    var imgArray = [];
    if (imgs.constructor == Array) {
      imgs.forEach(function (element) {
        if (storedImgs.indexOf(element) == -1) {
          imgArray.push(storeImg(element));
        }
      });
    } else if (imgs.constructor == String) {
      if (storedImgs.indexOf(imgs) == -1) {
        imgArray.push(storeImg(imgs));
      }
    }
    Promise.all(imgArray).then(function () {
      callback();
    });
  }
};