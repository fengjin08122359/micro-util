import langPackage from "../lang";
import face01 from './images/face01.png'
import face02 from './images/face02.png'
import face03 from './images/face03.png'
import face04 from './images/face04.png'
import face05 from './images/face05.png'
import face06 from './images/face06.png'
import face07 from './images/face07.png'
import face08 from './images/face08.png'
import face09 from './images/face09.png'
import face10 from './images/face10.png'
import face11 from './images/face11.png'
import face12 from './images/face12.png'
import face13 from './images/face13.png'
import face14 from './images/face14.png'
import face15 from './images/face15.png'
import face16 from './images/face16.png'
import face17 from './images/face17.png'
import face18 from './images/face18.png'
import face19 from './images/face19.png'
import face20 from './images/face20.png'
import face21 from './images/face21.png'
/* faceIco
 * 1.imgIco: datas about faceIco
 * 2.replaceOut: relace ico to img
 * 3.replaceIn: relace img to ico
 * 4.repalceToAlert: relace ico to alert icon
 */
/* eslint-disable */
  var imgIco = [
    {
      url: face01,
      ico: '/::)',
      reg: '/::\\)'
    },
    {
      url: face02,
      ico: '/::P',
      reg: '/::P'
    },
    {
      url: face03,
      ico: '/::$',
      reg: '/::\\$'
    },
    {
      url: face04,
      ico: '/::D',
      reg: '/::D'
    },
    {
      url: face05,
      ico: '/::-|',
      reg: '/::\\-\\|'
    },
    {
      url: face06,
      ico: '/::+',
      reg: '/::\\+'
    },
    {
      url: face07,
      ico: '/:,@-D',
      reg: '/:,@\\-D'
    },
    {
      url: face08,
      ico: '/::>',
      reg: '/::>',
      ico1: '/::&gt;',
      reg1: '/::&gt;',
    },
    {
      url: face09,
      ico: '/:,@f',
      reg: '/:,@f'
    },
    {
      url: face10,
      ico: '/:?',
      reg: '/:\\?'
    },
    {
      url: face11,
      ico: '/:bye',
      reg: '/:bye'
    },
    {
      url: face12,
      ico: '/:handclap',
      reg: '/:handclap'
    },
    {
      url: face13,
      ico: '/::*',
      reg: '/::\\*'
    },
    {
      url: face14,
      ico: '/:strong',
      reg: '/:strong'
    },
    {
      url: face15,
      ico: '/:P-(',
      reg: '/:P\\-\\('
    },
    {
      url: face16,
      ico: '/:rose',
      reg: '/:rose'
    },
    {
      url: face17,
      ico: '/:share',
      reg: '/:share'
    },
    {
      url: face18,
      ico: '/:ok',
      reg: '/:ok'
    },
    {
      url: face19,
      ico: '/:sun',
      reg: '/:sun'
    },
    {
      url: face20,
      ico: '/:heart',
      reg: '/:heart'
    },
    {
      url: face21,
      ico: '/:hug',
      reg: '/:hug'
    },
  ];

export default {
  imgIco: imgIco,
  replaceOut:function(str){
    for (var i in imgIco) {
      if (str.indexOf(imgIco[i].ico) != -1) {
        str = str.replace(new RegExp(imgIco[i].reg, 'gm'), "<img class='face-ico' imgid='"+ i +"' src='" + imgIco[i].url +"'>")
      }
      if (imgIco[i].ico1 && imgIco[i].reg1 && str.indexOf(imgIco[i].ico1) != -1) {
        str = str.replace(new RegExp(imgIco[i].reg1, 'gm'), "<img class='face-ico' imgid='"+ i +"' src='" + imgIco[i].url + "'>")
      }
    }
    return str
  },
  replaceIn:function(str){
    var matches = str.match(/<img.*?(?:>|\/>)/gi);
    var elementReplace = []
    if (matches && matches.length>0) {
      matches.forEach(element => {
        var match = element.match(/imgid[=\"\'\s]+[^\"\']+[\"\']/gi);
        if (match && match.length==1) {
          var st = match[0];
          var strindex =  st.indexOf('\"') > -1 ? st.slice(st.indexOf('\"')+1,-1) : st.slice(st.indexOf('\'')+1,-1)
          if (strindex<=imgIco.length) {
            elementReplace.push({
              index:strindex,
              element:element,
            })
          }
        }
      });
    }
    if (elementReplace.length>0) {
      elementReplace.forEach(el => {
        str = str.replace(el.element,imgIco[el.index].ico);
      });
    }
    return str
  },
  repalceToAlert:function (str) {
    for (var i in imgIco) {
      if (str.indexOf(imgIco[i].ico) != -1) {
        str = str.replace(new RegExp(imgIco[i].reg, 'gm'), langPackage.langs.notifyMsg.ico)
      }
      if (imgIco[i].ico1 && imgIco[i].reg1 && str.indexOf(imgIco[i].ico1) != -1) {
        str = str.replace(new RegExp(imgIco[i].reg1, 'gm'), langPackage.langs.notifyMsg.ico)
      }
    }
    return str
  }
}