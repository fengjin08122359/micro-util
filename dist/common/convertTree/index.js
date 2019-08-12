'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var converTree = function converTree(data, isChildFn, contentFn, idFun, getChildren) {
  if (typeof getChildren == 'undefined' || !getChildren) {
    getChildren = function getChildren(data) {
      return data.children;
    };
  }
  if (typeof isChildFn == 'undefined' || !isChildFn) {
    isChildFn = function isChildFn(data) {
      return data.children && data.children.length > 0;
    };
  }
  if (typeof contentFn == 'undefined' || !contentFn) {
    contentFn = function contentFn(data) {
      return data.title || data.content || '';
    };
  }
  if (typeof idFun == 'undefined' || !idFun) {
    idFun = function idFun(data) {
      return data.id || '';
    };
  }
  return [convertJson(data, isChildFn, contentFn, idFun, getChildren)];
};
var convertJson = function convertJson(data, isChildFn, contentFn, idFun, getChildren) {
  var item = {};
  item.id = idFun(data);
  item.label = contentFn(data);
  item.isLeaf = isChildFn(data);
  if (getChildren(data)) {
    item.children = [];
    getChildren(data).forEach(function (element) {
      item.children.push(convertJson(element, isChildFn, contentFn, idFun, getChildren));
    });
  }
  return item;
};
exports.default = converTree;