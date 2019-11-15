var insertStyle = function (cssStr, id) {
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
export default insertStyle