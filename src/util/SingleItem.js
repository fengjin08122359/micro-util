import DataHandle from './DataHandle';
import validator from '../common/validator';

class SingleItem extends DataHandle {
  constructor(data) {
    super()
    this.key = data.key || ''     //键
    this.props = data.props || {
      label: '',//标题
      required: '',//必填提示
      data: [], //单项关联数据 
      disabled: false, //禁用
      show: true,//展示
      placeholder: '',//占位符
    } //属性列表包含其他属性
    this.valid = data.valid || []//验证信息
    this.type = data.type || 'input' // 类型
    this.value = typeof data.value == 'undefined' ? '' : data.value // 值
    this.children = data.children || []//子节点
    this.rawData = data//原始数据
    this.rawComponents = ['component-single-item']
    this.canRender = false
  }
  dataFind(data) {
    var result = null
    this.data.forEach(item => {
      if (typeof item[data] != "undefined") {
        result = item[data]
      }
    })
    return result
  }
  save(value) {
    var oldValue = this.value
    this.value = value
    if (oldValue != this.value) {
      this.onChange({
        val:this.value,
        oldVal:oldValue
      })
    }
  }
  getKey () {
    return this.key
  }
  getValue() {
    return this.value
  }
  hasInsert () {
    return !(this.getValue() == '')
  }
  onChange({val, oldVal}) {
    return {val, oldVal}
  }
  getValid() {
    var result = {
      success: true,
      type: 'success'
    }
    return new Promise((resolve) => {
      if (!this.key) {
        resolve(result)
        return
      }
      if (this.required && !this.hasInsert()) {
        result = {
          success: false,
          message: '请填写' + this.label,
          type: 'requiredEmpty'
        }
      }
      if (result.success && this.valid.length > 0) {
        validator({
          value: this.getValue()
        }, {
          value: this.valid
        }, res => {
          if (!res.success && res.errors && res.errors.length > 0) {
            resolve({
              success: false,
              message: res.errors[0].message,
              type: 'fail'
            })
          } else {
            resolve(result);
          }
        })
      }
      resolve(result)
    })
  }
  setDisabled(flag) {
    this.disabled = flag
    return this.disabled
  }
  getKeyValue () {
    return {
      key: this.getKey(),
      value: this.getValue(),
      children: this.children.map(item => {
        return item.getKeyValue();
      })
    }
  }
  setKeyValue ({key = '', value = '', children = []}) {
    if (this.getKey() != '' && this.getKey() == key) {
      this.save(value)
      children.forEach(item => {
        var target = this.children.find(target => item.key == target.getKey())
        if (target) {
          target.setKeyValue(item)
        }
      })
    }
  }
  getAllItems() {
    return this.children.map(item => {
      return item.getAllItems()
    }).concat(this)
  }
  getCanRender () {
    return this.canRender || this.rawComponents.length == 0
  }
  render(createElement, vueTarget, context) {
    if (!this.getCanRender()) {
      return createElement()
    } else {
      return createElement(
        'component-single-item',   // 标签名称
        {
          ...context,
          data: this
        },
        [vueTarget.$slots.default]
      )
    }
  }
}

export {
  SingleItem
}