var handlers = {}
var datas = {}
var handles = {}
export const install = (name, obj, key, type='data') => {
  var mainkey = key || 'default'
  var dealName = name + (type=='data' ? 'Data' : 'Handle')
  if (dealName && handlers[dealName] == undefined) {
    handlers[dealName] = {}
  } 
  if (dealName && handlers[dealName][mainkey] == undefined){
    handlers[dealName][mainkey] = obj
  } else if (name && key) {
    handlers[dealName][mainkey] = obj
  }
  if (mainkey == 'default') {
    if (type == 'data') {
      datas[name] = obj
    } else if (type == 'handle') {
      handles[name] = obj
    }
  }
}

export const rgHandle = handles
export const rgData = datas

export const display = (name, key='default') => {
  if (key == '') {
    return handlers[name]
  }
  return handlers[name] && handlers[name][key]
}

export const displayAll = () => {
  return handlers
}  


export const displayHandle = (name, key='default',) => {
  return display(name + 'Handle', key, 'handle')
}

export const displayData = (name, key='default') => {
  return display(name + 'Data', key, 'data')
}
export default {
  install,
  display,
  displayAll,
  displayHandle,
  displayData,
}