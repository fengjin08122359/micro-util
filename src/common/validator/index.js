import AsyncValidator from 'async-validator'
// 校验规则

const validator = function (values, fields, callback){
  const valid = new AsyncValidator(fields)
  valid.validate(values, (errors, fields) => {
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
  })
}

export default validator