# micro-util
前端接口分离工具类

## config 配置项  
1. init() 初始化  
2. set({pre, httpUrl}) 设置ws前缀(pre),http地址  
3. setWebsocketUrl(pk) 设置ws的后缀地址  
4. setSWFLocation(location)) 设置swf文件地址  
## convertTree 树状图转化  
convertTree(data, isChildFn, contentFn, idFun, getChildrenFun)
data: 数据
isChildFn: 是否是子节点的方法
contentFn: 内容的生成方法
idFun: id的生成方法
getChildrenFun: 获取子节点的生成方法
## faceIco 微信图标转换  
1. imgIco 图标对象
2. replaceOut(str) 图标转换为图片
3. replaceIn(str) 图片转换为图标
4. repalceToAlert(str, ico) 图标转换为标签
##  mobileInput 手机输入框拉伸
1. init({fail, success}) 初始化 设置调用成功或失败后的返回
2. startCheck() 开始检测
3. end() 结束检测
6. focusAfterInsert() 在插入后重新聚焦
##  storeImg 保存已展示的图片
storeImg.store({imgs, callback}) 
imgs: 图片地址数组
callback: 存储成功后回调方法
##  httplink 访问http地址
httplink(name, url, data, type='get', async=true)
name: 方法名,每个项目唯一
url: 访问地址
data: 访问数据
type: 类型, get post postJson postForm
async: 是否异步
##  jsonplink 访问jsonp地址
jsonplink(name, url, data, type='jsonp', async=true, jsonpCallback='jsonpCallback', jsonpName = 'jsonpCallback')
name: 方法名,每个项目唯一
url: 访问地址
data: 访问数据
type: 类型, get post postJson postForm
async: 是否异步
jsonpCallback: 回调
jsonpName: jsonp名称
##  DataHandle 数据类型的父类
1. before(key, callback) 在数据处理事件前回调 
2. after(key, callback) 在数据处理事件后回调  
样例:
class Class extends DataHandle{
  constructor(name)
}
##  Handle 事件类型的父类
1. before(key, callback) 在事件前回调 
2. after(key, callback) 在事件后回调  
样例:
new Handle({name:''})
##  EventBus(keyFrame, websocketFrame, httpFrame) 事件监听
1. push(keys, obj, logStr) 推送事件
2. addHandler(handlerName, keys, callback) 增加监听
3. removeHandler(handlerName, key) 删除监听
4. getHandler(handlerName, key, obj) 获取监听
5. before(key, callback) 在监听前回调  
6. after(key, callback) 在监听后回调  
## storage 缓存localstorage
1. get(key) 获取
2. set(key, value) 设置
3. clear(key) 清理单一
4. clearAll() 清理所有
##  logger 日志系统
1. init() 初始化
2. saveAsFile() 将日志保存为文件
3. setLevel(level) 设置日志转换的层级 高到底 0 不使用日志系统, 6 使用地址但不显示在控制台中, 1 log, 2 info, 3 debug, 4 error, 5 warn
4. setOnly(boolean) 设置是否只访问当前层级的日志
5. saveTextAs(content, name, encode='utf-8') 保存为文件
6. saveAs(blob,name) 保存
7. getData(type, msg) 获取日志中的数据 类型,字符串
8. setSaveFile(can) 设置是否在关闭浏览器时导出日志
9. setUIDsiplay 设置可视化界面是否在初始化时显示
10. show() 显示可视化界面
11. hide() 隐藏可视化界面
## websocket 
1. init(data) 先测试后初始化
2. closeManager() 关闭
3. sendMsg(msg) 发送消息
4. isClose() 检测是否关闭
5. initSingle(data) 开启单个初始化
6. setConnectLimit(number) 设置断线重连次数 -1 将不进行断线重连
## register(displayHandle, displayData) 请不要单独使用
对象注册机制,实现在DataHandle, Handle中
1. install 注册对象
2. display 展示对象
3. displayAll 展示所有对象
4. displayHandle 展示事件类型对象
5. displayData 展示数据类型对象
