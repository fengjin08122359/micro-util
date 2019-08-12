"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var ls = window.localStorage;
exports.default = {
  get: function get(key) {
    if (!ls) return '';
    var value = null;
    value = ls[key];
    if (value) {
      value = decodeURIComponent(ls[key]);
    }
    try {
      value = JSON.parse(value);
    } catch (e) {}
    return value;
  },
  set: function set(key, value) {
    if ((typeof value === "undefined" ? "undefined" : _typeof(value)) == "object") {
      value = JSON.stringify(value);
    }
    ls[key] = encodeURIComponent(value);
  },
  clear: function clear(key) {
    ls.removeItem(key);
  },
  clearAll: function clearAll() {
    ls.clear();
  }
};