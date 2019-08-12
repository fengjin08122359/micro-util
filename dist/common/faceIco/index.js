'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _face = require('../../../public/images/face01.png');

var _face2 = _interopRequireDefault(_face);

var _face3 = require('../../../public/images/face02.png');

var _face4 = _interopRequireDefault(_face3);

var _face5 = require('../../../public/images/face03.png');

var _face6 = _interopRequireDefault(_face5);

var _face7 = require('../../../public/images/face04.png');

var _face8 = _interopRequireDefault(_face7);

var _face9 = require('../../../public/images/face05.png');

var _face10 = _interopRequireDefault(_face9);

var _face11 = require('../../../public/images/face06.png');

var _face12 = _interopRequireDefault(_face11);

var _face13 = require('../../../public/images/face07.png');

var _face14 = _interopRequireDefault(_face13);

var _face15 = require('../../../public/images/face08.png');

var _face16 = _interopRequireDefault(_face15);

var _face17 = require('../../../public/images/face09.png');

var _face18 = _interopRequireDefault(_face17);

var _face19 = require('../../../public/images/face10.png');

var _face20 = _interopRequireDefault(_face19);

var _face21 = require('../../../public/images/face11.png');

var _face22 = _interopRequireDefault(_face21);

var _face23 = require('../../../public/images/face12.png');

var _face24 = _interopRequireDefault(_face23);

var _face25 = require('../../../public/images/face13.png');

var _face26 = _interopRequireDefault(_face25);

var _face27 = require('../../../public/images/face14.png');

var _face28 = _interopRequireDefault(_face27);

var _face29 = require('../../../public/images/face15.png');

var _face30 = _interopRequireDefault(_face29);

var _face31 = require('../../../public/images/face16.png');

var _face32 = _interopRequireDefault(_face31);

var _face33 = require('../../../public/images/face17.png');

var _face34 = _interopRequireDefault(_face33);

var _face35 = require('../../../public/images/face18.png');

var _face36 = _interopRequireDefault(_face35);

var _face37 = require('../../../public/images/face19.png');

var _face38 = _interopRequireDefault(_face37);

var _face39 = require('../../../public/images/face20.png');

var _face40 = _interopRequireDefault(_face39);

var _face41 = require('../../../public/images/face21.png');

var _face42 = _interopRequireDefault(_face41);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* faceIco
 * 1.imgIco: datas about faceIco
 * 2.replaceOut: relace ico to img
 * 3.replaceIn: relace img to ico
 * 4.repalceToAlert: relace ico to alert icon
 */
/* eslint-disable */
var imgIco = [{
  url: _face2.default,
  ico: '/::)',
  reg: '/::\\)'
}, {
  url: _face4.default,
  ico: '/::P',
  reg: '/::P'
}, {
  url: _face6.default,
  ico: '/::$',
  reg: '/::\\$'
}, {
  url: _face8.default,
  ico: '/::D',
  reg: '/::D'
}, {
  url: _face10.default,
  ico: '/::-|',
  reg: '/::\\-\\|'
}, {
  url: _face12.default,
  ico: '/::+',
  reg: '/::\\+'
}, {
  url: _face14.default,
  ico: '/:,@-D',
  reg: '/:,@\\-D'
}, {
  url: _face16.default,
  ico: '/::>',
  reg: '/::>',
  ico1: '/::&gt;',
  reg1: '/::&gt;'
}, {
  url: _face18.default,
  ico: '/:,@f',
  reg: '/:,@f'
}, {
  url: _face20.default,
  ico: '/:?',
  reg: '/:\\?'
}, {
  url: _face22.default,
  ico: '/:bye',
  reg: '/:bye'
}, {
  url: _face24.default,
  ico: '/:handclap',
  reg: '/:handclap'
}, {
  url: _face26.default,
  ico: '/::*',
  reg: '/::\\*'
}, {
  url: _face28.default,
  ico: '/:strong',
  reg: '/:strong'
}, {
  url: _face30.default,
  ico: '/:P-(',
  reg: '/:P\\-\\('
}, {
  url: _face32.default,
  ico: '/:rose',
  reg: '/:rose'
}, {
  url: _face34.default,
  ico: '/:share',
  reg: '/:share'
}, {
  url: _face36.default,
  ico: '/:ok',
  reg: '/:ok'
}, {
  url: _face38.default,
  ico: '/:sun',
  reg: '/:sun'
}, {
  url: _face40.default,
  ico: '/:heart',
  reg: '/:heart'
}, {
  url: _face42.default,
  ico: '/:hug',
  reg: '/:hug'
}];

exports.default = {
  imgIco: imgIco,
  replaceOut: function replaceOut(str) {
    for (var i in imgIco) {
      if (str.indexOf(imgIco[i].ico) != -1) {
        str = str.replace(new RegExp(imgIco[i].reg, 'gm'), "<img class='face-ico' imgid='" + i + "' src='" + imgIco[i].url + "'>");
      }
      if (imgIco[i].ico1 && imgIco[i].reg1 && str.indexOf(imgIco[i].ico1) != -1) {
        str = str.replace(new RegExp(imgIco[i].reg1, 'gm'), "<img class='face-ico' imgid='" + i + "' src='" + imgIco[i].url + "'>");
      }
    }
    return str;
  },
  replaceIn: function replaceIn(str) {
    var matches = str.match(/<img.*?(?:>|\/>)/gi);
    var elementReplace = [];
    if (matches && matches.length > 0) {
      matches.forEach(function (element) {
        var match = element.match(/imgid[=\"\'\s]+[^\"\']+[\"\']/gi);
        if (match && match.length == 1) {
          var st = match[0];
          var strindex = st.indexOf('\"') > -1 ? st.slice(st.indexOf('\"') + 1, -1) : st.slice(st.indexOf('\'') + 1, -1);
          if (strindex <= imgIco.length) {
            elementReplace.push({
              index: strindex,
              element: element
            });
          }
        }
      });
    }
    if (elementReplace.length > 0) {
      elementReplace.forEach(function (el) {
        str = str.replace(el.element, imgIco[el.index].ico);
      });
    }
    return str;
  },
  repalceToAlert: function repalceToAlert(str, ico) {
    for (var i in imgIco) {
      if (str.indexOf(imgIco[i].ico) != -1) {
        str = str.replace(new RegExp(imgIco[i].reg, 'gm'), ico);
      }
      if (imgIco[i].ico1 && imgIco[i].reg1 && str.indexOf(imgIco[i].ico1) != -1) {
        str = str.replace(new RegExp(imgIco[i].reg1, 'gm'), ico);
      }
    }
    return str;
  }
};