'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SingleItem = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _DataHandle2 = require('./DataHandle');

var _DataHandle3 = _interopRequireDefault(_DataHandle2);

var _validator = require('../common/validator');

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SingleItem = function (_DataHandle) {
  _inherits(SingleItem, _DataHandle);

  function SingleItem(data) {
    _classCallCheck(this, SingleItem);

    var _this = _possibleConstructorReturn(this, (SingleItem.__proto__ || Object.getPrototypeOf(SingleItem)).call(this));

    _this.key = data.key || ''; //键
    _this.props = data.props || {
      label: '', //标题
      required: '', //必填提示
      data: [], //单项关联数据 
      disabled: false, //禁用
      show: true, //展示
      placeholder: '' //占位符
      //属性列表包含其他属性
    };_this.valid = data.valid || []; //验证信息
    _this.type = data.type || 'input'; // 类型
    _this.value = typeof data.value == 'undefined' ? '' : data.value; // 值
    _this.children = data.children || []; //子节点
    _this.rawData = data; //原始数据
    _this.rawComponents = ['component-single-item'];
    _this.canRender = false;
    return _this;
  }

  _createClass(SingleItem, [{
    key: 'dataFind',
    value: function dataFind(data) {
      var result = null;
      this.data.forEach(function (item) {
        if (typeof item[data] != "undefined") {
          result = item[data];
        }
      });
      return result;
    }
  }, {
    key: 'save',
    value: function save(value) {
      var oldValue = this.value;
      this.value = value;
      if (oldValue != this.value) {
        this.onChange({
          val: this.value,
          oldVal: oldValue
        });
      }
    }
  }, {
    key: 'getKey',
    value: function getKey() {
      return this.key;
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      return this.value;
    }
  }, {
    key: 'hasInsert',
    value: function hasInsert() {
      return !(this.getValue() == '');
    }
  }, {
    key: 'onChange',
    value: function onChange(_ref) {
      var val = _ref.val,
          oldVal = _ref.oldVal;

      return { val: val, oldVal: oldVal };
    }
  }, {
    key: 'getValid',
    value: function getValid() {
      var _this2 = this;

      var result = {
        success: true,
        type: 'success'
      };
      return new Promise(function (resolve) {
        if (!_this2.key) {
          resolve(result);
          return;
        }
        if (_this2.required && !_this2.hasInsert()) {
          result = {
            success: false,
            message: '请填写' + _this2.label,
            type: 'requiredEmpty'
          };
        }
        if (result.success && _this2.valid.length > 0) {
          (0, _validator2.default)({
            value: _this2.getValue()
          }, {
            value: _this2.valid
          }, function (res) {
            if (!res.success && res.errors && res.errors.length > 0) {
              resolve({
                success: false,
                message: res.errors[0].message,
                type: 'fail'
              });
            } else {
              resolve(result);
            }
          });
        }
        resolve(result);
      });
    }
  }, {
    key: 'setDisabled',
    value: function setDisabled(flag) {
      this.disabled = flag;
      return this.disabled;
    }
  }, {
    key: 'getKeyValue',
    value: function getKeyValue() {
      return {
        key: this.getKey(),
        value: this.getValue(),
        children: this.children.map(function (item) {
          return item.getKeyValue();
        })
      };
    }
  }, {
    key: 'setKeyValue',
    value: function setKeyValue(_ref2) {
      var _this3 = this;

      var _ref2$key = _ref2.key,
          key = _ref2$key === undefined ? '' : _ref2$key,
          _ref2$value = _ref2.value,
          value = _ref2$value === undefined ? '' : _ref2$value,
          _ref2$children = _ref2.children,
          children = _ref2$children === undefined ? [] : _ref2$children;

      if (this.getKey() != '' && this.getKey() == key) {
        this.save(value);
        children.forEach(function (item) {
          var target = _this3.children.find(function (target) {
            return item.key == target.getKey();
          });
          if (target) {
            target.setKeyValue(item);
          }
        });
      }
    }
  }, {
    key: 'getAllItems',
    value: function getAllItems() {
      return this.children.map(function (item) {
        return item.getAllItems();
      }).concat(this);
    }
  }, {
    key: 'getCanRender',
    value: function getCanRender() {
      return this.canRender || this.rawComponents.length == 0;
    }
  }, {
    key: 'render',
    value: function render(createElement, vueTarget, context) {
      if (!this.getCanRender()) {
        return createElement();
      } else {
        return createElement('component-single-item', // 标签名称
        {
          context: context,
          data: this
        }, [vueTarget.$slots.default]);
      }
    }
  }]);

  return SingleItem;
}(_DataHandle3.default);

exports.SingleItem = SingleItem;