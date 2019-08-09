var ls = window.localStorage;
export default {
  get: function(key) {
    if (!ls) return '';
    var value = null;
    value = ls[key];
    if (value) {
      value = decodeURIComponent(ls[key]);
    }
    try {
      value = JSON.parse(value)
    } catch (e) {}
    return value
  },
  set: function(key, value) {
    if (typeof(value) == "object") {
      value = JSON.stringify(value);
    }
    ls[key] = encodeURIComponent(value);
  },
  clear: function(key) {
    ls.removeItem(key)
  },
  clearAll: function() {
    ls.clear();
  },
}