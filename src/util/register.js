var handlers = {}

export const install = (name, obj, key) => {
  var mainkey = key || 'default'
  if (name && handlers[name] == undefined) {
    handlers[name] = {}
  } 
  if (name && handlers[name][mainkey] == undefined){
    handlers[name][mainkey] = obj
  } else if (name && key) {
    handlers[name][mainkey] = obj
  }
}

export const display = (name, key='default') => {
  if (key == '') {
    return handlers[name]
  }
  return handlers[name] && handlers[name][key]
}

export const displayAll = () => {
  return handlers
}  


export const displayHandle = (name, key='default') => {
  return display(name + 'Handle', key)
}

export const displayData = (name, key='default') => {
  return display(name + 'Data', key)
}

export default {
  install,
  display,
  displayAll,
  displayHandle,
  displayData
}