'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _DataHandle2 = require('../../util/DataHandle');

var _DataHandle3 = _interopRequireDefault(_DataHandle2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ChangeTitle = function (_DataHandle) {
  _inherits(ChangeTitle, _DataHandle);

  function ChangeTitle() {
    _classCallCheck(this, ChangeTitle);

    var _this = _possibleConstructorReturn(this, (ChangeTitle.__proto__ || Object.getPrototypeOf(ChangeTitle)).call(this, 'changeTitle'));

    _this.title = '';
    _this.interval = null;
    _this.timeout = null;
    _this.statusList = [];
    _this.currentStatus = [];
    return _this;
  }

  _createClass(ChangeTitle, [{
    key: 'init',
    value: function init() {
      this.title = document.title;
    }
  }, {
    key: 'addStatus',
    value: function addStatus(json) {
      if (json.name && this.statusList.filter(function (item) {
        return item.name == json.name;
      }).length > 0) {
        this.statusList = this.statusList.map(function (item) {
          if (item.name == json.name) {
            item = {
              title: json.title || '',
              blinkTitle: json.blinkTitle || '',
              name: json.name || ''
            };
          }
          return item;
        }, []);
      } else {
        this.statusList.push({
          title: json.title || '',
          blinkTitle: json.blinkTitle || '',
          name: json.name || ''
        });
      }
    }
  }, {
    key: 'change',
    value: function change(name) {
      if (this.currentStatus.indexOf(name) == -1) {
        this.currentStatus.push(name);
      }
      this.check();
    }
  }, {
    key: 'reset',
    value: function reset(name) {
      if (this.currentStatus.indexOf(name) > -1) {
        this.currentStatus.splice(this.currentStatus.indexOf(name), 1);
      }
      this.check();
    }
  }, {
    key: 'check',
    value: function check() {
      var _this2 = this;

      if (this.interval) {
        clearInterval(this.interval);
      }
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      var curList = this.statusList.filter(function (item) {
        return _this2.currentStatus.indexOf(item.name) > -1;
      });
      if (curList.length > 0) {
        var cur = curList[0];
        if (cur.blinkTitle != '' && cur.title != cur.blinkTitle) {
          this.interval = setInterval(function () {
            document.title = cur.title.replace('$title', _this2.title);
            _this2.timeout = setTimeout(function () {
              document.title = cur.blinkTitle.replace('$title', _this2.title);
            }, 500);
          }, 1000);
        } else {
          document.title = cur.title.replace('$title', this.title);
        }
      } else if (document.title != this.title) {
        document.title = this.title;
      }
    }
  }]);

  return ChangeTitle;
}(_DataHandle3.default);

exports.default = new ChangeTitle();