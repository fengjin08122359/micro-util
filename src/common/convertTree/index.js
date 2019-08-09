let converTree = (data, isChildFn, contentFn, idFun, getChildren) => {
  if (typeof getChildren == 'undefined' || !getChildren) {
    getChildren = (data) => {
      return data.children
    }
  }
  if (typeof isChildFn == 'undefined' || !isChildFn) {
    isChildFn = (data) => {
      return data.children && data.children.length > 0
    }
  }
  if (typeof contentFn == 'undefined' || !contentFn) {
    contentFn = (data) => {
      return data.title || data.content || ''
    }
  }
  if (typeof idFun == 'undefined' || !idFun) {
    idFun = (data) => {
      return data.id || ''
    }
  }
  return [convertJson(data, isChildFn, contentFn, idFun, getChildren)]
}
let convertJson = (data, isChildFn, contentFn, idFun, getChildren) => {
  var item = {}
  item.id = idFun(data);
  item.label = contentFn(data)
  item.isLeaf = isChildFn(data)
  if (getChildren(data)) {
    item.children = [];      
    getChildren(data).forEach(element => {
      item.children.push(convertJson(element, isChildFn, contentFn, idFun, getChildren));
    });
  }
  return item
}
export default converTree