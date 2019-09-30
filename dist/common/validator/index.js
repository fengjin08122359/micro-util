'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _asyncValidator = require('async-validator');

var _asyncValidator2 = _interopRequireDefault(_asyncValidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 校验规则

var validator = function validator(values, fields, callback) {
  var valid = new _asyncValidator2.default(fields);
  valid.validate(values, function (errors, fields) {
    if (errors) {
      callback({
        success: false,
        errors: errors
      });
    } else {
      callback({
        success: true
      });
    }
  });
};

exports.default = validator;