import DataHandle from './DataHandle'
import Handle from './Handle'

let convertVuex = (target) => {
  let state = {
    target
  }
  let getters = {}
  let mutations = {}
  let actions = {}
  if (target instanceof DataHandle) {
    let ownFunKey = Object.getOwnPropertyNames(Object.getPrototypeOf(target)) 
    ownFunKey.forEach(key => {
      var value = target[key]
      if (typeof value == "function" && key != 'constructor') {
        actions[key] = ({}, arg) => {
          return value(arg)
        }
      }
    })
  } else if (target instanceof Handle) {
    let ownFunKey = Object.getOwnPropertyNames(Object.getPrototypeOf(target)) 
    let allFunKey = Object.getOwnPropertyNames((target));
    let funKeys = allFunKey.filter(item => item.indexOf(ownFunKey) == -1)
    funKeys.forEach(key => {
      var value = target[key]
      if (typeof value == "function" && key != 'constructor') {
        actions[key] = ({}, arg) => {
          return value(arg)
        }
      }
    })
  }
  return {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
  }
}

export default convertVuex;