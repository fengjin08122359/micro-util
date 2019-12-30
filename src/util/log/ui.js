import logger, {levels} from "."
import drag from './drag'
const addHandler = (element,type,handler) => { 
  if(element.addEventListener){  
      element.addEventListener(type,handler,false)
  }else if(element.attachEvent){ 
      element.attachEvent('on' + type ,handler)
  }else{
      element['on'+type] = handler
  }
}
const insertStyle =  (cssStr, id) => {
  var nod = document.createElement("style");  
  nod.type="text/css";
  nod.id = id || 'theme_style'
  if(nod.styleSheet){         
    nod.styleSheet.cssText = cssStr;  
  } else {  
    nod.innerHTML = cssStr;       
  }
  if (document.getElementById(nod.id)) {
    if (document.getElementById(nod.id).remove) {
      document.getElementById(nod.id).remove()
    } else {
      document.getElementById(nod.id).removeNode(true)
    }
  }
  document.getElementsByTagName("head")[0].appendChild(nod); 
};
const CSSID = 'nclient-util-log-css'
const LOG_CLASS = 'nclient-util-log'
const LOG_ZOOM_CLASS = 'nclient-util-log-zoom'

let logHtml = `<div class='tools'><span class='control'>暂停</span><span class='zoom'>缩小</span><span class='from'>all</span><span class='copy'>导出</span><span class='move'>移动</span><span class='closebtn'>关闭</span></div><div class='list'></div>`
let logCss = `.nclient-util-log {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 300px;
  height: 60%;
  background: rgb(255, 255, 255);
  border: 1px solid #000;
  border-radius: 5px;
  z-index: 1000000;
  display: none;
}
.nclient-util-log.nclient-util-log-zoom {
  width: 300px;
  height: 40px;
}
.nclient-util-log .tools {
  position: absolute;
  top: 0px;
  width: 80%;
  height: 20px;
  margin: 10px 10%;
}

.nclient-util-log .list {
  position: absolute;
  top: 40px;
  width: 100%;
  bottom: 0px;
  overflow-x: hidden;
  overflow-y: auto;
  word-break: break-all;
}

.nclient-util-log .tools span {
  width: 16.6%;
  box-sizing: border-box;
  display: inline-block;
  text-align: center;
  line-height: 20px;
  background: #e1e1e1;
  cursor: pointer;
}
.nclient-util-log .tools span.move {
  cursor: move;
}

.nclient-util-log .logBoxcol {
  background: #333333;
  color: #fff;
}

.nclient-util-log .logBoxcol:nth-child(even) {
  background: #fff;
  color: #333333;
}`

var removeNode = (node) => {
  if (node.remove) {
    node.remove()
  } else {
    node.removeNode(true)
  }
}
var addCss = () => {
  insertStyle(logCss, CSSID)
}
var addHtml = () => {
  var div = document.createElement("div");
  div.innerHTML = logHtml
  div.className = `${LOG_CLASS}`
  document.body.appendChild(div)
}
var clearHtml = () => {
  if (document.getElementsByClassName(`${LOG_CLASS}`).length > 0) {
    document.getElementsByClassName(`${LOG_CLASS}`).forEach(node => removeNode(node))
  }
}

var status= {
  control: false,
  zoom: false,
  level: 0
}

var show = () => {
  var box = document.querySelector(`.${LOG_CLASS}`);
  if (box) {
    box.style.display = 'block'
  }
}

var hide = () => {
  var box = document.querySelector(`.${LOG_CLASS}`);
  if (box) {
    box.style.display = 'none'
  }
  display();
}



var init = () => {
  clearHtml()
  addCss()
  addHtml()
  show()
  var logBox = document.querySelector(`.${LOG_CLASS}`);
  var control = document.querySelector(`.${LOG_CLASS} .control`);
  var zoom = document.querySelector(`.${LOG_CLASS} .zoom`);
  var from = document.querySelector(`.${LOG_CLASS} .from`);
  var copy = document.querySelector(`.${LOG_CLASS} .copy`);
  var move = document.querySelector(`.${LOG_CLASS} .move`);
  var closebtn = document.querySelector(`.${LOG_CLASS} .closebtn`);
  drag(move, logBox)
  addHandler(control, 'click', () => {
    status.control = !status.control
    control.innerHTML = status.control ? '开始' : '暂停'
    if (!status.control) {
      display()
    }
  })
  addHandler(zoom, 'click', () => {
    status.zoom = !status.zoom
    zoom.innerHTML = status.zoom ? '缩小' : '放大'
    logBox.className = `${LOG_CLASS} ${status.zoom ? LOG_ZOOM_CLASS: ''}`
  })
  addHandler(from, 'click', () => {
    status.level++
    if (status.level >= levels.length) {
      status.level = 0;
    }
    from.innerHTML = levels[status.level]
    display()
  })
  addHandler(copy, 'click', () => {
    logger.saveAsFile();
  })
  addHandler(closebtn, 'click', () => {
    hide()
  })

}

var display = () => {
  var sdata = logger.getData(levels[status.level])
  var list = document.querySelector(`.${LOG_CLASS} .list`);
  if (list) {
    var html = "";
    for(var i=0,len=sdata.length;i<len;i++){
      var target = sdata[i]
      var text = target.time + ' ' + target.type + ' ' + target.msg
      html +=('<div class="logBoxcol">'+text+'</div>');
    }
    list.innerHTML = html
    list.scrollTop = list.scrollHeight
  }
}
var append = (target) => {
  if (status.control) {
    return
  }
  var list = document.querySelector(`.${LOG_CLASS} .list`);
  if (list) {
    var div = document.createElement("div");
    var msg = target.time + ' ' + target.type + ' ' + target.msg
    div.innerHTML = `${msg}`
    div.className = `logBoxcol`
    list.appendChild(div)
    list.scrollTop = list.scrollHeight
  }
}
export default {
  init,
  hide,
  show,
  display,
  append
}