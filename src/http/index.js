import api from '../util/api'
import { httpFrame } from '../util/key-frame'
import logger from '../util/log';

export const httplink = (name, url, data, type='get', async=true) => {
  return new Promise((resolve, reject) => {
    api[type](url, data, res => {
      httpFrame.push('http-'+ name, {
        data: data,
        res: res
      })
      resolve({data: data, res: res})
    },() => {
      httpFrame.push('http-'+ name +"-fail,http-fail", data);
      reject(data)
    }, async)
  })
  .catch((error) => {
    logger.error(error)
  })
}


export const jsonplink = (name, url, data, type='jsonp', async=true, jsonpCallback='jsonpCallback', jsonpName = 'jsonpCallback') => {
  return new Promise((resolve, reject) => {
    api.jsonp(url, data, res => {
      httpFrame.push('jsonp-'+ name, {
        data: data,
        res: res
      })
      resolve({data: data, res: res})
    },() => {
      httpFrame.push('jsonp-'+ name +"-fail,jsonp-fail", data);
      reject(data)
    }, async, jsonpCallback, jsonpName)
  })
  .catch((error) => {
    logger.error(error)
  })
}


