require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"ArrayExtension":[function(require,module,exports){
"use strict";
cc._RFpush(module, '4fd85NSsFJLd4qHrH0UjHzl', 'ArrayExtension');
// scripts\Extensions\ArrayExtension.js

// 给 Array 添加方法
// arr.find(...)
// arr.findIndex(...)
// arr.includes(e)
// arr.unique(equalFunction, isNewArray)
// Array.from
// Array.equal
// arr.isEqual(otherArray, isStrict)
// Array.sortByNumber
// arr.findSubArrayIndexs([])   用于查找数组内的部分元素的索引
// arr.translationWithStartIndex(startIndex) 将数组内的元素平移
// 如：[1, 2, 3, 4, 5].translationWithStartIndex(3) => [4,5,1,2,3]
// arr.kq_insert(index, e)   插入一个元素
// arr.kq_excludes(array)   // 除了array数组中的元素

module.exports = {};

if (!Array.prototype.find) {
  Array.prototype.find = function (predicate) {
    'use strict';
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}

if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function (predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.findIndex called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return i;
      }
    }
    return -1;
  };
}

// https://tc39.github.io/ecma262/#sec-array.prototype.includes
if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    enumerable: false,
    value: function value(searchElement, fromIndex) {

      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If len is 0, return false.
      if (len === 0) {
        return false;
      }

      // 4. Let n be ? ToInteger(fromIndex).
      //    (If fromIndex is undefined, this step produces the value 0.)
      var n = fromIndex | 0;

      // 5. If n ≥ 0, then
      //  a. Let k be n.
      // 6. Else n < 0,
      //  a. Let k be len + n.
      //  b. If k < 0, let k be 0.
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

      // 7. Repeat, while k < len
      while (k < len) {
        // a. Let elementK be the result of ? Get(O, ! ToString(k)).
        // b. If SameValueZero(searchElement, elementK) is true, return true.
        // c. Increase k by 1.
        // NOTE: === provides the correct "SameValueZero" comparison needed here.
        if (o[k] === searchElement) {
          return true;
        }
        k++;
      }

      // 8. Return false
      return false;
    }
  });
}

// unique
if (!Array.prototype.unique) {
  Object.defineProperty(Array.prototype, 'unique', {
    enumerable: false,
    value: function value(equalFunction) {
      var newArray = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      if (newArray) {
        return this._unqiue_new(equalFunction);
      }

      return this._unqiue(equalFunction);
    }
  });

  Object.defineProperty(Array.prototype, '_unqiue_new', {
    enumerable: false,
    value: function value(equalFunction) {
      var array = Array.from(this);

      return array._unqiue(equalFunction);
    }
  });

  Object.defineProperty(Array.prototype, '_unqiue', {
    enumerable: false,
    value: function value(equalFunction) {
      var len = this.length;
      var i = -1;

      while (i++ < len) {
        var j = i + 1;

        for (; j < this.length; ++j) {
          var isEqual = false;
          if (equalFunction) {
            isEqual = equalFunction(this[i], this[j]);
          } else {
            isEqual = this[i] === this[j];
          }

          if (isEqual) {
            this.splice(j--, 1);
          }
        }
      }
      return this;
    }
  });
}

// Production steps of ECMA-262, Edition 6, 22.1.2.1
// Reference: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-array.from
if (!Array.from) {
  Array.from = (function () {
    var toStr = Object.prototype.toString;
    var isCallable = function isCallable(fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    var toInteger = function toInteger(value) {
      var number = Number(value);
      if (isNaN(number)) {
        return 0;
      }
      if (number === 0 || !isFinite(number)) {
        return number;
      }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function toLength(value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };

    // The length property of the from method is 1.
    return function from(arrayLike /*, mapFn, thisArg */) {
      // 1. Let C be the this value.
      var C = this;

      // 2. Let items be ToObject(arrayLike).
      var items = Object(arrayLike);

      // 3. ReturnIfAbrupt(items).
      if (arrayLike == null) {
        throw new TypeError("Array.from requires an array-like object - not null or undefined");
      }

      // 4. If mapfn is undefined, then let mapping be false.
      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      var T;
      if (typeof mapFn !== 'undefined') {
        // 5. else
        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
        if (!isCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }

        // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 2) {
          T = arguments[2];
        }
      }

      // 10. Let lenValue be Get(items, "length").
      // 11. Let len be ToLength(lenValue).
      var len = toLength(items.length);

      // 13. If IsConstructor(C) is true, then
      // 13. a. Let A be the result of calling the [[Construct]] internal method of C with an argument list containing the single item len.
      // 14. a. Else, Let A be ArrayCreate(len).
      var A = isCallable(C) ? Object(new C(len)) : new Array(len);

      // 16. Let k be 0.
      var k = 0;
      // 17. Repeat, while k < len… (also steps a - h)
      var kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFn) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }
      // 18. Let putStatus be Put(A, "length", len, true).
      A.length = len;
      // 20. Return A.
      return A;
    };
  })();
}

if (!Array.equal) {
  Array.equal = function (arr1, arr2) {
    var strict = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

    if (arr1 === undefined || arr2 === undefined) {
      return false;
    }

    var length = arr1.length;
    if (length !== arr2.length) return false;
    for (var i = 0; i < length; i++) {
      if (strict) {
        if (arr1[i] !== arr2[i]) {
          return false;
        }
      } else {
        var value1 = arr1[i];
        var value2 = arr2[i];
        var result = true;
        if (Array.isArray(value1) && Array.isArray(value2)) {
          result = Array.equal(value1, value2, strict);
        } else {
          result = value1 == value2;
        }
      }
    }

    return true;
  };
}

if (!Array.prototype.isEqual) {
  Object.defineProperty(Array.prototype, 'isEqual', {
    enumerable: false,
    value: function value(otherArray) {
      var strict = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      return Array.equal(this, otherArray, strict);
    }
  });
}

if (!Array.sortByNumber) {
  Array.sortByNumber = function (n1, n2) {
    var asc = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

    return (n1 - n2) * (asc ? 1 : -1);
  };
}

if (!Array.prototype.findSubArrayIndexs) {
  Object.defineProperty(Array.prototype, 'findSubArrayIndexs', {
    enumerable: false,
    value: function value(subArray, f) {
      var _this = this;

      var indexs = [];

      var _loop = function () {
        var subValue = subArray[i];
        var findFunc = f || function (thisValue) {
          return subValue === thisValue;
        };
        var index = _this.findIndex(findFunc);
        if (index >= 0) {
          indexs.push(index);
        } else {
          indexs = [];
          return 'break';
        }
      };

      for (var i in subArray) {
        var _ret = _loop();

        if (_ret === 'break') break;
      }

      return indexs.length > 0 ? indexs : null;
    }
  });
}

if (!Array.prototype.translationWithStartIndex) {
  Object.defineProperty(Array.prototype, 'translationWithStartIndex', {
    enumerable: false,
    value: function value(startIndex) {
      if (startIndex == 0) {
        return this;
      }

      if (startIndex >= this.length) {
        return this;
      }

      var pre = this.slice(startIndex);
      var last = this.slice(0, startIndex);
      var result = pre.concat(last);

      return result;
    }
  });
}

if (!Array.prototype.kq_insert) {
  Object.defineProperty(Array.prototype, 'kq_insert', {
    enumerable: false,
    value: function value(index, e) {
      if (e == null) {
        return this;
      }

      if (index >= this.length) {
        this.push(e);
        return;
      }

      this.splice(index, 0, e);

      return this;
    }
  });
}

if (!Array.prototype.kq_excludes) {
  Object.defineProperty(Array.prototype, 'kq_excludes', {
    enumerable: false,
    value: function value(otherArray) {
      if (otherArray == null) {
        return this;
      }

      var result = [];
      this.forEach(function (element) {
        if (!otherArray.includes(element)) {
          result.push(element);
        }
      });

      return result;
    }
  });
}

/*
if(!Array.prototype.min){
  Array.prototype.min = function() {
    var min = this[0];
    var len = this.length;
    for (var i = 1; i < len; i++) {
      if (this[i] < min) {
        min = this[i];
      }
    }
    return min;
  }
}*/

cc._RFpop();
},{}],"AudioManager":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'dd5deKFuSZAC4Ky0zI4+z6O', 'AudioManager');
// scripts\Audio\AudioManager.js

var manager = require('manager');

var AudioManager = cc.Class({
    "extends": cc.Component,

    properties: {
        hall_bgm: {
            "default": null,
            url: cc.AudioClip
        },

        // 打枪
        daQiang: {
            "default": null,
            url: cc.AudioClip
        },

        fapai: {
            "default": null,
            url: cc.AudioClip
        },

        window: {
            "default": null,
            url: cc.AudioClip
        },

        click_weixin_login: {
            "default": null,
            url: cc.AudioClip
        },

        fangPai: {
            "default": null,
            url: cc.AudioClip
        }

    },

    statics: {
        instance: null
    },

    onLoad: function onLoad() {
        AudioManager.instance = this;
        this._registerAppActiveChange();

        this.soundOn = true;
        cc.game.addPersistRootNode(this.node);
        if (cc.game.isPersistRootNode(this.node)) {
            // cc.log('添加全局节点成功');
        }
        this.mValue = manager.getMusicValue();
        this.mEValue = manager.getMusicEffectValue();
        this.bgAudioId = -1;
    },

    stopHallMusic: function stopHallMusic() {
        cc.audioEngine.stop(this.bgAudioId);
    },

    playMusic: function playMusic() {
        this.bgAudioId = cc.audioEngine.playMusic(this.hall_bgm, true);
        if (this.bgAudioId != -1) {
            //cc.log('play');
            cc.audioEngine.setVolume(this.bgAudioId, this.mValue);
        }
        //cc.audioEngine.playMusic( url, true )
    },

    playCompareCardsMusic: function playCompareCardsMusic() {
        this.bgAudioId = cc.audioEngine.playMusic(this.hall_bgm, true);
        if (this.bgAudioId != -1) {
            cc.audioEngine.setVolume(this.bgAudioId, this.mValue);
        }
    },

    playDaQiang: function playDaQiang() {
        for (var start = 0; start <= 1.6; start = start + 0.5) {
            this.scheduleOnce((function () {
                this._playSFX(this.daQiang);
            }).bind(this), start);
        }
    },

    // “打枪”
    playHumanDaQiang: function playHumanDaQiang() {
        var sex = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

        var path = "resources/sounds/man" /* + (sex == 1 ? "man" : "woman")*/;
        path = path + "/daqiang1.mp3";

        var url = cc.url.raw(path);
        this._playSFX(url);
    },

    // “中枪”
    playHumanZQiang: function playHumanZQiang() {
        var sex = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

        var path = "resources/sounds/man" /* + (sex == 1 ? "man" : "woman")*/;
        path = path + "/daqiang3.mp3";

        var url = cc.url.raw(path);
        this._playSFX(url);
    },

    playPokerClick: function playPokerClick() {
        var url = cc.url.raw('resources/sounds/public/click_wx_login.mp3');
        this._playSFX(url);
    },

    // 播放全垒打音效
    playHomeRun: function playHomeRun() {
        var sex = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

        var path = this._soundsHumanPath(sex) + "special1.mp3";
        var url = cc.url.raw(path);
        this._playSFX(url);
    },

    // 播放发牌音效
    playFaPai: function playFaPai() {
        var path1 = this._soundsHumanPath(1) + "room_start_compare.mp3";
        var url1 = cc.url.raw(path1);
        this._playSFX(url1);
        //let pokerDeal = this._soundsHumanPath(1) + "poker_deal.mp3";
        //let urlPokerDeal = cc.url.raw(pokerDeal);
        //this._playSFX(urlPokerDeal);
        this._playSFX(this.fapai);
        for (var index = 0; index < 6; index++) {
            this.scheduleOnce((function () {
                this._playSFX(this.fapai);
            }).bind(this), index * 0.1);
        }
    },

    playCardType: function playCardType() {
        var sex = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
        var type = arguments.length <= 1 || arguments[1] === undefined ? -1 : arguments[1];

        // 只播放普通类型的语音
        if (type >= 10 || type < 0) {
            // 10 及以上是特殊牌
            var _path = this._soundsHumanPath(sex) + type + ".mp3";
            var _url = cc.url.raw(_path);
            this._playSFX(_url);
            return;
        }

        var path = this._soundsHumanPath(sex) + "common" + (type + 1) + ".mp3";
        var url = cc.url.raw(path);
        this._playSFX(url);
    },

    // 播放 开始比牌
    playStartCompare: function playStartCompare() {
        var sex = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

        var path = this._soundsHumanPath(sex) + "start_compare.mp3";
        var url = cc.url.raw(path);
        this._playSFX(url);
    },

    playWin: function playWin() {
        var url = cc.url.raw('resources/sounds/openface/win.mp3');
        this._playSFX(url);
    },

    playLose: function playLose() {
        var url = cc.url.raw('resources/sounds/openface/lose.mp3');
        this._playSFX(url);
    },

    coinIncome: function coinIncome() {
        var url = cc.url.raw('resources/sounds/openface/coin_income.mp3');
        this._playSFX(url);
    },

    _soundsHumanPath: function _soundsHumanPath(sex) {
        var path = "resources/sounds/man/" /* + (sex == 1 ? "man" : "woman") + "/"*/;
        return path;
    },

    setBgMusicVolumn: function setBgMusicVolumn(value) {
        this.mValue = value;
        if (this.bgAudioId != -1) {
            cc.audioEngine.setVolume(this.bgAudioId, value);
        }
    },

    setEffectMusicVolum: function setEffectMusicVolum(value) {
        this.mEValue = value;
    },

    /*聊天*/
    playChatAudio: function playChatAudio(sex, str) {
        var index = this.chatTexts().indexOf(str);
        if (index === -1) {
            return;
        }
        var number = "CHAT" + (index + 1);
        var path = "resources/sounds/chat/" + number + ".mp3";
        var url = cc.url.raw(path);
        this._playSFX(url);
    },

    chatTexts: function chatTexts() {
        return ['还不出牌，我都快去吃锅边糊了', '嗨呀，我家里老人都比你打的快', '嗨呀，打牌打的我都困了', '哎，你快慢慢找，我先去西湖逛一下', '快一点呀，我等你想好我厕所都上一趟了', '你这在干嘛，这么慢', '嗨呀，最近在忙什么，很久没见了', '来来来，三缺一', '来来来，赶紧坐下来打一圈', '跟你们这些高手打我会紧张，让我一点', '蛮晚到天亮，输了可以让你们先欠着'];
    },

    pauseMusic: function pauseMusic() {
        this.soundOn = false;
        cc.audioEngine.pauseMusic();
    },

    resumeMusic: function resumeMusic() {
        this.soundOn = true;
        cc.audioEngine.resumeMusic();
    },

    _playSFX: function _playSFX(clip) {
        if (this.soundOn) {
            var audioId = cc.audioEngine.playEffect(clip, false);
            cc.audioEngine.setVolume(audioId, this.mEValue);
            return audioId;
        }

        return null;
    },

    // MARK: 前后台操作
    _registerAppActiveChange: function _registerAppActiveChange() {
        cc.game.on(cc.game.EVENT_HIDE, this._appEnterBackground, this);
        cc.game.on(cc.game.EVENT_SHOW, this._appBecomActive, this);
    },

    /**
     * 进入后台
     */
    _appEnterBackground: function _appEnterBackground() {
        var now = cc.sys.now();
        if (now - this._lastAppEnterBackgroundTime < 100) {
            return;
        }
        this._lastAppEnterBackgroundTime = now;

        this.pauseMusic();
    },

    /**
     * 进入前台
     */
    _appBecomActive: function _appBecomActive() {
        var now = cc.sys.now();
        if (now - this._lastAppBecomActiveTime < 100) {
            return;
        }
        this._lastAppBecomActiveTime = now;

        this.resumeMusic();
    },

    /*确定按钮音效*/
    playBtnClickSFX: function playBtnClickSFX() {
        this._playSFX(this.click_weixin_login);
    },
    /*公共按钮，按键或者关闭按钮之类的音效*/
    palyBtnPublicSFX: function palyBtnPublicSFX() {
        this._playSFX(this.click_weixin_login);
    },

    /*取消按钮音效*/
    palyBtnCancelClickSFX: function palyBtnCancelClickSFX() {
        this._playSFX(this.click_weixin_login);
    },
    palyBtnCreateRoomSFX: function palyBtnCreateRoomSFX() {
        this._playSFX(this.click_weixin_login);
    },
    palyWindowSFX: function palyWindowSFX() {
        this._playSFX(this.window);
    },
    palyWeiXinLoginSFX: function palyWeiXinLoginSFX() {
        this._playSFX(this.click_weixin_login);
    },
    palyFangPaiSFX: function palyFangPaiSFX() {
        this._playSFX(this.fangPai);
    }

});

module.exports = AudioManager;

cc._RFpop();
},{"manager":"manager"}],"CardPrefab":[function(require,module,exports){
"use strict";
cc._RFpush(module, '94cdbrbPc9KRqx+1sHumWI3', 'CardPrefab');
// scripts\CardPrefab.js

var KQCard = require('KQCard');

cc.Class({
  'extends': cc.Component,

  properties: {
    graySprite: cc.Sprite,

    _cardName: null,
    _kqCardMode: null
  },

  // use this for initialization
  onLoad: function onLoad() {
    this.graySprite.node.active = false;
  },

  // 通过牌名设置牌
  setCard: function setCard(cardName) {
    this._setCardName(cardName);

    this._loadCardFrame(cardName, (function (spriteFrame) {
      this.node.getComponent('cc.Sprite').spriteFrame = spriteFrame;
    }).bind(this));
  },

  cardName: function cardName() {
    return this._cardName;
  },

  cardMode: function cardMode() {
    return this._kqCardMode;
  },

  _setCardName: function _setCardName(cardName) {
    this._cardName = cardName;
    this._kqCardMode = new KQCard(cardName);
  },

  // 设置选择状态
  setSelected: function setSelected() {
    var selected = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

    this.graySprite.node.active = selected;
  },

  isSelected: function isSelected() {
    return this.graySprite.node.active;
  },

  _cardFullName: function _cardFullName(cardShortName) {
    var cardName = cardShortName;
    if (!cardName.startsWith("public-pic-card-poker")) {
      cardName = "public-pic-card-poker-" + cardName;
    }

    return cardName;
  },

  _loadCardFrame: function _loadCardFrame(cardName, callback) {
    cc.assert(callback);

    cc.loader.loadRes("play/CardTypeCombine/pockList", cc.SpriteAtlas, (function (err, atlas) {
      if (err) {
        cc.error(err);
        return;
      }

      cardName = this._cardFullName(cardName);
      var frame = atlas.getSpriteFrame(cardName);
      callback(frame);
    }).bind(this));
  }
});

cc._RFpop();
},{"KQCard":"KQCard"}],"CardTypeCombine":[function(require,module,exports){
"use strict";
cc._RFpush(module, '45c41vwAhFNYYSXDvaKpEP0', 'CardTypeCombine');
// scripts\CardTypeCombine.js

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var KQCard = require('KQCard');
var KQCardFindTypeExtension = require('KQCardFindTypeExtension');
var AudioManager = require('AudioManager');
var play = require('play');
var KQCardScoretsHelper = require('KQCardScoretsHelper');
// 牌类型 component
//
cc.Class({
    'extends': cc.Component,
    statics: {
        instances: null
    },
    properties: {
        cardsLayout: cc.Layout,
        // btnDuiZi: cc.Button,
        // btnLiangDui: cc.Button,
        // btnSanTiao: cc.Button,
        // btnShunZi: cc.Button,
        // btnTongHua: cc.Button,
        // btnHuLu: cc.Button,
        // btnTieZhi: cc.Button,
        // btnTongHuaShun: cc.Button,
        // btnWuTong: cc.Button,
        // typeButtonsNode: cc.Node,
        btnDeleteTouDao: cc.Button, // 头道
        btnDeleteZhongDao: cc.Button, // 中道
        btnDeleteWeiDao: cc.Button, // 尾道
        btnCancelAll: cc.Button, // 全部取消
        btnDone: cc.Button, // 确定出牌
        timeNode: cc.Node,
        labelTime: cc.Label,
        layoutTouDao: cc.Layout,
        layoutZhongDao: cc.Layout,
        layoutWeiDao: cc.Layout,
        cardAllNode: cc.Node,
        cardPrefab: cc.Prefab,
        cardTypePrefab: cc.Prefab,

        touDaoNode: cc.Node,
        zhongDaoNode: cc.Node,
        weiDaoNode: cc.Node,

        autoCardScrollView: cc.ScrollView,
        autoCard: cc.Prefab,
        autoCardLayout: cc.Layout,
        autoCardAnimation: cc.Node,

        LayoutWithEvent: [],

        BtnClickGongXiNiComfirm: false, //用于检查用户是否点击了恭喜你页面的确定按钮
        cardsLayoutSortColor: false,
        /*#####*/

        _cardOffsetY: null,

        _kqCardModes: [],
        _allCardModes: [],
        _findCardTypeObject: null, // 用来记录找到的牌型对象
        _findCardIndex: null, // 用来记录找到的牌型对象

        _finishSelectCardsCallback: null
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.BtnClickGongXiNiComfirm = false;
        this.cardsLayoutSortColor = false;
        this._cardOffsetY = 0;
        this._registerTouchEvents();
        this._registerDaosLayoutClickEvent();
        this.reset();
        this._findCardIndex = {};
        this.cardTime = 0.3;

        this.cardSpriteAtlas = this.node.parent.getComponent('play').cardSpriteAtlas;
        this.daoSpriteAtlas = this.node.parent.getComponent('play').daoSpriteAtlas;
    },

    /*#####点击空白地方将牌收回去*/
    onClickCardTypeCombineNode: function onClickCardTypeCombineNode() {
        this._resetCardsPositionY();
    },

    _hideDeleteButtons: function _hideDeleteButtons() {
        //this.btnDeleteTouDao.node.active = false;
        //this.btnDeleteZhongDao.node.active = false;
        //this.btnDeleteWeiDao.node.active = false;
    },

    // 重置，回到最初始有状态
    reset: function reset() {
        this._hideDeleteButtons();
        this.clearCards();
        this.timeStop();
        //this._typeButtons().forEach(function (button) {
        //    button.interactable = false;
        //});
        this._allCardModes = [];
    },

    cardsLayoutSort: function cardsLayoutSort(e) {
        var nodeAyy = e.target.children;
        if (nodeAyy[0].active == true) {
            //按大小
            this.cardsLayoutSortColor = true;
            nodeAyy[0].active = false;
            nodeAyy[1].active = true;
            this._resetCardsPositionX();
            return;
        } else if (nodeAyy[1].active == true) {
            //按花色
            this.cardsLayoutSortColor = false;
            nodeAyy[0].active = true;
            nodeAyy[1].active = false;
            this._resetCardsPositionX();
        }
        //this.cardsLayoutSortColor = nodeAyy[1].active == false;
        //this.cardsLayoutSortColor == true
    },

    addCards: function addCards(cardNames) {
        cc.assert(cardNames);
        this._resetCardsPositionY();
        //cardNames.sort(function(a1,a2){
        //    return a1.split('_')[0] - a2.split('_')[0];
        //})
        cardNames.forEach((function (card, index) {
            this.addCard(card, false, index);
        }).bind(this));
        //this.cardsLayoutSort();
        this._resetCardsPositionX();
        this._reloadKQCardModesInner();
        this._resetTypeButtonEnablesWithModels(this._kqCardModes);
    },

    addCard: function addCard(cardName) {
        var autoChangePositionX = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
        var index = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

        cc.assert(cardName.length > 0);

        var cardPrefab = cc.instantiate(this.cardPrefab);
        cardPrefab.name = cardName;
        // if(cc.maPai){
        //     var cardMaPai = '3_' + cc.maPai;
        //     if(cardName == cardMaPai){
        //         cardPrefab.color = new cc.Color(226, 145, 145);
        //     }
        // }
        cardPrefab.getComponent('CardPrefab').setCard(cardName, index);
        this.cardsLayout.node.addChild(cardPrefab);
        cardPrefab.setPositionY(this._cardOffsetY);

        if (autoChangePositionX) {
            this._resetCardsPositionX();
        }
        //let newCard = new KQCard(cardName,null,index);
        //let originCard = this._allCardModes.find(function(card) {
        //    return card.isEqual(newCard);
        //});
        //if (originCard == null && !autoChangePositionX) {
        //    this._allCardModes.push(newCard);
        //}
    },

    addCardModes: function addCardModes(cardNames) {
        cc.assert(cardNames.length > 0);
        this._allCardModes = [];
        cardNames.forEach((function (cardName, index) {
            var newCard = new KQCard(cardName, null, index);
            this._allCardModes.push(newCard);
        }).bind(this));
    },

    reloadCards: function reloadCards(cardNames) {
        //cardNames=['1_1', '2_1', '3_11', '1_12', '2_2', '3_2', '4_11', '4_12', '3_13', '2_5', '1_13', '4_3', '1_3'];
        // cardNames=['1_1', '2_1', '3_11', '1_12', '2_2', '3_2', '4_11', '4_12', '3_13', '2_5', '1_13', '4_3', '1_3'];
        //三度同花
        // cardNames=['2_13', '2_5', '2_7', '3_1', '3_2', '3_4', '3_3', '3_13', '1_12', '1_6', '1_1', '1_4', '1_5'];
        //三同花顺
        //  cardNames=['2_1', '2_2', '2_3', '2_4', '2_5', '3_6', '3_7', '3_8', '3_9', '3_10', '4_1', '4_2', '4_3'];
        //一条龙
        // cardNames=['2_1', '2_2', '2_3', '2_4', '2_5', '3_6', '3_7', '3_8', '3_9', '3_10', '1_11', '1_12', '1_13'];
        //三顺子
        //cardNames=['4_1', '3_2', '4_3', '1_7', '4_5', '4_6', '3_9', '4_8', '3_1', '1_13', '4_12', '4_11', '2_10'];
        // cardNames=['3_5', '3_4', '4_3', '1_2', '3_1', '4_9', '3_9', '4_8', '3_10', '1_13', '4_12', '4_11', '2_10'];
        // cardNames=['3_5', '3_4', '4_3', '1_2', '3_1', '4_5', '3_6', '4_8', '3_6', '1_13', '4_12', '4_11', '2_7'];
        //cardNames=['3_4', '3_4', '4_6', '2_20', '1_20', '1_20', '3_6', '4_8', '3_6', '1_8', '4_12', '4_11', '2_20'];
        //三丰天下
        //cardNames=['1_1', '2_1', '3_1', '1_2', '2_2', '3_2', '4_1', '4_2', '3_3', '2_3', '1_3', '4_3', '1_13'];
        //4丰天下
        // cardNames=['1_1', '2_1', '3_1', '1_4', '2_4', '3_2', '4_2', '1_2', '3_4', '2_3', '1_3', '4_3', '1_2'];
        //六岁半
        // cardNames=['1_1', '2_1', '3_11', '1_12', '2_2', '3_2', '4_11', '4_12', '3_13', '2_5', '1_13', '4_3', '1_3'];
        //cardNames=['1_9', '2_11', '3_8', '1_12', '2_2', '3_2', '1_13', '2_5', '3_5','1_4', '2_4', '3_4', '3_10'];
        // cardNames=['4_9', '2_3', '3_4', '3_6', '2_1', '2_4', '2_2', '2_5', '2_13','2_8', '2_10', '2_11', '2_12'];
        //   cardNames=['4_2', '2_3', '3_4', '3_5', '2_1', '2_4', '2_2', '2_5', '2_13','2_8', '2_10', '2_11', '2_12'];
        //cardNames=['4_1', '2_1', '1_4', '3_4', '1_6', '2_6', '1_8', '3_8', '2_8','2_12', '1_12', '2_13', '3_13'];
        // cardNames=['4_9', '2_3', '3_4', '3_6', '2_8', '2_9', '2_10', '2_11', '2_13','3_13', '3_12', '2_12', '1_12'];
        // cardNames=['4_9', '2_9', '3_4', '3_6', '1_8', '2_1', '2_5', '2_4', '2_3','3_13', '3_12', '2_2', '1_12'];
        //cardNames=['3_2', '4_2', '2_4', '3_5', '1_5', '3_7', '2_7', '3_10', '2_1','2_13', '2_10', '2_12', '2_11'];
        //cardNames=['4_2', '4_3', '4_4', '4_5', '4_5', '4_6', '4_12', '4_13', '2_12','3_12', '2_8', '3_8', '2_11'];
        //cardNames=['4_3', '1_3', '4_5', '4_5', '3_5', '2_5', '1_20', '4_11', '3_12','4_12', '4_8', '4_1', '1_12'];
        //cardNames=['4_3', '1_3', '4_5', '4_5', '2_20', '1_20', '1_20', '4_11', '3_12','4_12', '4_8', '4_1', '1_12'];
        //cardNames=['4_3', '3_4', '4_6', '4_5', '2_7', '1_20', '1_3', '4_4', '3_6','4_7', '4_8', '2_12', '1_12'];
        cc.log(cardNames);
        this.clearCards();
        this._kqCardModes = [];
        this.addCards(cardNames);
    },

    clearCards: function clearCards() {
        this.cardsLayout.node.removeAllChildren();
        this.layoutTouDao.node.removeAllChildren();
        this.layoutZhongDao.node.removeAllChildren();
        this.layoutWeiDao.node.removeAllChildren();
    },

    removeCard: function removeCard(cardName) {
        if (!cardName.length) {
            return;
        }

        this.cardsLayout.node.getChildByName(cardName).removeFromParent();
    },

    setFinishSelectCardsCallback: function setFinishSelectCardsCallback(callback) {
        this._finishSelectCardsCallback = callback;
        this.node.active = false;
    },

    _reloadKQCardModesInner: function _reloadKQCardModesInner() {
        //this._kqCardModes = this.cardsLayout.node.children.map(function (cardPrefabNode) {
        //    let cardPrefab = cardPrefabNode.getComponent('CardPrefab');
        //    return cardPrefab.cardMode();
        //}).sort(KQCard.sort);
        //this._findCardTypeObject = null;
    },

    _typeButtons: function _typeButtons() {
        //return [
        //    this.btnDuiZi,
        //    this.btnLiangDui,
        //    this.btnSanTiao,
        //    this.btnShunZi,
        //    this.btnTongHua,
        //    this.btnHuLu,
        //    this.btnTieZhi,
        //    this.btnTongHuaShun,
        //    /*#####*/
        //    //this.btnWuTong,
        //    /*#####*/
        //];
    },

    _resetTypeButtonEnablesWithModels: function _resetTypeButtonEnablesWithModels(cardModes) {
        /*cardModes.length == 13*/
        //cardModes = cardModes || this._kqCardModes;
        //
        ///*#####初始化牌*/
        //var ButtonsLayoutChilds = this.typeButtonsNode.children;
        //for(var i=0;i<ButtonsLayoutChilds.length;i++){
        //    ButtonsLayoutChilds[i].interactable = false;
        //}
        //
        //this.btnDuiZi.interactable = KQCard.containDuiZi(cardModes);
        //this.btnLiangDui.interactable = KQCard.containLiaDui(cardModes);
        //this.btnSanTiao.interactable = KQCard.containSanTiao(cardModes);
        //this.btnShunZi.interactable = KQCard.containShunZi(cardModes);
        //this.btnTongHua.interactable = KQCard.containTongHua(cardModes);
        //this.btnHuLu.interactable = KQCard.containHuLu(cardModes);
        //this.btnTieZhi.interactable = KQCard.containTieZhi(cardModes);
        //this.btnTongHuaShun.interactable = KQCard.containTongHuaShun(cardModes);
        ////this.btnWuTong.interactable = KQCard.containWuTong(cardModes);
        ////KQCard.isTeShuPai(cardModes)
        ////let typeName = KQCard.cardsTyp-eName(cardModes);
        ////KQCard.isLiuDuiBan(cardModes);
        ////alert(this.btnShunZi.interactable)
        ///*#####如果有多一色，就是设置无同按钮的可交互性*/
        ////if(cc.duoYiSe == 0) {
        ////    this.wuTongNode = this.typeButtonsNode.getChildByName("btnWuTong");
        ////    this.btnWuTong = this.wuTongNode.getComponent(cc.Button);
        ////    this.btnWuTong.interactable = KQCard.containWuTong(cardModes);
        ////}
        ///*#####*/
        //
        //this._autoActiveTypeButtons();
        //
        ///*#####设置按钮可交互和不可交互时的透明度*/
        //for(var i=0;i<ButtonsLayoutChilds.length;i++){
        //    if(ButtonsLayoutChilds[i].getComponent(cc.Button).interactable){
        //        ButtonsLayoutChilds[i].opacity = 255;
        //    }else{
        //        ButtonsLayoutChilds[i].opacity = 125;
        //    }
        //}
    },

    // 将找到了牌类型的牌突出出来
    _stickOutFindCardType: function _stickOutFindCardType(title, findMethods) {

        // 先根据牌类型找出所有的索引集合
        //var findedIndexsArray = null;
        //this._findCardTypeObject = this._findCardTypeObject || {};
        //if (this._findCardTypeObject.title != title) {
        //    findedIndexsArray = (findMethods() || []).reverse();
        //
        //    for(var i =0;i<findedIndexsArray.length-1;i++){//删除同类型牌
        //        var index = findedIndexsArray[i];
        //        /*if(title == 'liangDui'){
        //         let jStringspoint = index.map(function(indexs){
        //         return this._kqCardModes[indexs].point;
        //         }.bind(this));
        //         var isBreak = false;
        //         var repNum = jStringspoint.reduce(function(p,n){
        //         if(!p[n]){
        //         p[n] = 1;
        //         }else{
        //         p[n] += 1
        //         }
        //         return p
        //         },{});
        //         for(var y in repNum){
        //         if(repNum[y] >= 3){
        //         isBreak = true;
        //         }
        //         }
        //         if(isBreak){
        //         cc.log(repNum)
        //         cc.log(findedIndexsArray)
        //         cc.log(i)
        //         cc.log('--------291')
        //         findedIndexsArray.splice(i,1);
        //         continue;
        //         }
        //         }*/
        //        var iString = '';
        //        for(var j =i+1;j<findedIndexsArray.length;j++){
        //            var s = findedIndexsArray[j];
        //            var jString = '';
        //
        //            let iStrings = s.map(function(index){
        //                let cardModel = this._kqCardModes[index];
        //                return cardModel.cardName();
        //            }.bind(this));
        //
        //            let jStrings = index.map(function(indexs){
        //                let cardModel = this._kqCardModes[indexs];
        //                return cardModel.cardName();
        //            }.bind(this));
        //
        //
        //            for(var r = 0;r < index.length;r++){
        //                jString = jString + iStrings[r];
        //                iString = iString + jStrings[r];
        //            }
        //
        //            if(jString == iString){
        //                findedIndexsArray.splice(i,1);
        //                break;
        //            }
        //        }
        //    }
        //
        //    this._findCardTypeObject = {
        //        title: title,
        //        indexsArray: findedIndexsArray,
        //        //index: title=="duiZi"?findedIndexsArray.length-1:0
        //        index: 0
        //    };
        //}
        //
        //findedIndexsArray = this._findCardTypeObject.indexsArray;
        //if (!findedIndexsArray || findedIndexsArray.length == 0) {
        //    return;
        //}
        //// 将已有的突出的牌的位置重置回初始位置
        //this._resetCardsPositionY();
        //
        //// 计算出要突出的牌数组
        //var index = this._findCardTypeObject.index;
        //let indexs = findedIndexsArray[index];
        //
        //let selectedCardNames = indexs.map(function(index){
        //    let cardModel = this._kqCardModes[index];
        //    return cardModel.cardName();
        //}.bind(this));
        //
        //let cardNodes = this.cardsLayout.node.children.filter(function (cardNode) {
        //    let cardPrefab = cardNode.getComponent('CardPrefab');
        //    if(selectedCardNames.includes(cardPrefab.cardName())) {
        //        var nameIndex = selectedCardNames.indexOf(cardPrefab.cardName());
        //        selectedCardNames.splice(nameIndex,1);
        //        return true;
        //    }
        //    return false;
        //});

        //// 突出计算出来的牌数组
        //this._changeCardPrefabsY(cardNodes);
        //// 保存好，用于再次点击了突出下一组牌
        //index = (index + 1) % findedIndexsArray.length;
        //this._findCardTypeObject.index = index;
    },

    clickDuiZi: function clickDuiZi() {
        this._stickOutFindCardType("duiZi", (function () {
            return KQCard.findDuiZi(this._kqCardModes);
        }).bind(this));
    },

    clickLiangDui: function clickLiangDui() {
        this._stickOutFindCardType("liangDui", (function () {
            return KQCard.findLiaDui(this._kqCardModes);
        }).bind(this));
    },

    clickSanTiao: function clickSanTiao() {
        this._stickOutFindCardType("sanTiao", (function () {
            return KQCard.findSanTiao(this._kqCardModes);
        }).bind(this));
    },

    clickShunZi: function clickShunZi() {
        this._stickOutFindCardType("shunZi", (function () {
            return KQCard.findShunZi(this._kqCardModes);
        }).bind(this));
    },

    clickTongHua: function clickTongHua() {
        this._stickOutFindCardType("tongHua", (function () {
            return KQCard.findTongHua(this._kqCardModes);
        }).bind(this));
    },

    clickHuLu: function clickHuLu() {
        this._stickOutFindCardType("huLu", (function () {
            return KQCard.findHuLu(this._kqCardModes);
        }).bind(this));
    },

    clickTieZhi: function clickTieZhi() {
        this._stickOutFindCardType("tieZhi", (function () {
            return KQCard.findTieZhi(this._kqCardModes);
        }).bind(this));
    },

    /*#####*/
    clickWuTong: function clickWuTong() {
        this._stickOutFindCardType("wuTong", (function () {
            return KQCard.findWuTong(this._kqCardModes);
        }).bind(this));
    },
    /*#####*/

    clickTongHuaShun: function clickTongHuaShun() {
        this._stickOutFindCardType("tongHuaShun", (function () {
            return KQCard.findTongHuaShun(this._kqCardModes);
        }).bind(this));
    },

    clickCancelAll: function clickCancelAll() {
        this.clickDeleteTouDao();
        this.clickDeleteZhongDao();
        this.clickDeleteWeiDao();
    },

    /*点击完成按钮*/
    clickDone: function clickDone() {
        cc.sys.localStorage.removeItem("timestamp");
        this.cardAlls = this.cardAllNode.children.sort(function (a, b) {
            return b.y - a.y;
        }).map(function (i) {
            return i.children[0];
        });

        var touCardModels = this._taoDaoCardModes();
        var zhongCardModes = this._zhongDaoCardModes();
        var weiCardModes = this._weiDaoCardModes();
        this._didSelectedCards(touCardModels, zhongCardModes, weiCardModes);
    },

    /*点击恭喜你页面的确定按钮*/
    onBtnGongXiNiComfirmClick: function onBtnGongXiNiComfirmClick() {
        //记录玩家点击了确定按钮：
        this.BtnClickGongXiNiComfirm = true;

        var cards = [];

        cc.teShuPaiCards.forEach(function (i) {
            cards = cards.concat(i);
        });

        var teShuPaiCardsServerInfo = this._convertCardsToServerModel2(cards);
        var result = [teShuPaiCardsServerInfo];
        if (this._finishSelectCardsCallback) {
            this._finishSelectCardsCallback(result);
        }
    },

    _didSelectedCards: function _didSelectedCards(touCards, zhongCards, weiCards) {
        touCards = touCards || [];
        zhongCards = zhongCards || [];
        weiCards = weiCards || [];
        var touServerInfo = this._convertCardsToServerModel(touCards);
        var zhongServerInfo = this._convertCardsToServerModel(zhongCards);
        var weiServerInfo = this._convertCardsToServerModel(weiCards);

        //console.log(touServerInfo);
        //console.log(zhongServerInfo);
        //console.log(weiServerInfo);
        //console.log("---------------------------------512");
        if (!(touServerInfo.value < zhongServerInfo.value && zhongServerInfo.value <= weiServerInfo.value)) {
            this.autoCardAnimation.y = -50;
            this.autoCardAnimation.opacity = 255;
            this.autoCardAnimation.runAction(cc.moveTo(1, cc.p(0, 0)));
            this.scheduleOnce((function () {
                var action = cc.spawn(cc.moveTo(this.cardTime, cc.p(0, 10)), cc.fadeOut(this.cardTime));
                this.autoCardAnimation.runAction(action);
            }).bind(this), 1.5);
            return;
        }
        var result = [touServerInfo, zhongServerInfo, weiServerInfo];
        //return;
        if (this._finishSelectCardsCallback) {
            this._finishSelectCardsCallback(result);
        }
    },

    clickDeleteTouDao: function clickDeleteTouDao() {
        this._deleteDaoCardsOfLayout(this.layoutTouDao.node);
    },

    clickDeleteZhongDao: function clickDeleteZhongDao() {
        this._deleteDaoCardsOfLayout(this.layoutZhongDao.node);
    },

    clickDeleteWeiDao: function clickDeleteWeiDao() {
        this._deleteDaoCardsOfLayout(this.layoutWeiDao.node);
    },

    // 计时器事件
    timeStart: function timeStart(duration) {
        cc.assert(duration > 0);
        this.timeStop();
        this.timeNode.active = true;
        var timestamp = cc.sys.localStorage.getItem("timestamp"); // 获取本地存储的时间戳
        if (timestamp) {
            // 如果有则证明玩家是重新进来了的
            var now = Date.parse(new Date());
            var time = duration * 1000;
            if (now - timestamp > time) {
                // 超时
                if (now - timestamp < 2 * time) {
                    duration = 5; // 玩家可能出于其他原因退出游戏导致超时，为其提供5秒时间整理牌型（这已经是很仁慈的了）。
                } else {
                        cc.sys.localStorage.removeItem("timestamp");
                    }
            } else {
                duration = Math.floor(duration - (now - timestamp) / 1000);
            }
        } else {
            // 如果没有时间戳，则保存，为玩家退出游戏保留证据；
            var timestamp = Date.parse(new Date());
            cc.sys.localStorage.setItem('timestamp', timestamp);
        }
        this._timeRemainDuration = duration;
        this.labelTime.string = String(duration);
        this.timeNode.getComponent("time").setTime(duration * 0.5);
        this.schedule(this._timeMethod, 1, duration);
    },

    timeStop: function timeStop() {
        this.unschedule(this._timeMethod);
        this.timeNode.active = false;
    },

    _timeMethod: function _timeMethod() {
        this._timeRemainDuration = this._timeRemainDuration - 1;

        var remain = Math.max(this._timeRemainDuration, 0);
        this.labelTime.string = remain < 10 && remain > 0 ? '0' + remain : remain;

        if (this._timeRemainDuration <= 0) {
            this.timeStop();
            if (cc.chaoShiChuPai == true) this._timeOutAutoSelectCards();
            cc.sys.localStorage.removeItem("timestamp");
            return;
        }
    },

    // 超时后，自动选牌
    _timeOutAutoSelectCards: function _timeOutAutoSelectCards() {
        /**
         * 隐藏恭喜你
         */
        play.gongXiNiShow(false);
        if (typeof cc.teShuPaiCards != "undefined" && cc.teShuPaiCards != null) {
            this.onBtnGongXiNiComfirmClick();
            return;
        }

        //let [touCardModels, zhongCardModes, weiCardModes] = this._cacleAutoSelectedCards();

        var _findCardIndex$arr$0 = _slicedToArray(this._findCardIndex.arr[0], 3);

        var touCardModels = _findCardIndex$arr$0[0];
        var zhongCardModes = _findCardIndex$arr$0[1];
        var weiCardModes = _findCardIndex$arr$0[2];

        if (touCardModels == null || zhongCardModes == null || weiCardModes == null) {
            touCardModels = this._allCardModes.slice(-3);
            zhongCardModes = this._allCardModes.slice(5, 10);
            weiCardModes = this._allCardModes.slice(0, 5);
        }

        // cc.log(touCardModels)
        // cc.log(zhongCardModes)
        // cc.log(weiCardModes)
        // cc.log(this._allCardModes)
        // cc.log("自动选牌 touCardModels zhongCardModes weiCardModes：");
        this._didSelectedCards(touCardModels, zhongCardModes, weiCardModes);
    },

    _cacleAutoSelectedCards: function _cacleAutoSelectedCards() {
        var cards = this._allCardModes.filter(function (i) {
            return i;
        });
        var resultCards = [];
        for (var i = 1; i < 3; i++) {
            var cardss = KQCard.autoSelectCards(cards, 5);
            cards = cards.kq_excludes(cardss);
            resultCards.push(cardss);
        }
        resultCards.push(cards);
        //let touScore = KQCard.scoreOfCards(resultCards[2]);
        //let zhongScore = KQCard.scoreOfCards(resultCards[1]);
        //let weiScore = KQCard.scoreOfCards(resultCards[0]);
        // cc.log(resultCards)
        // cc.log(this._allCardModes)
        // cc.log("牌分数自动选牌：", touScore, zhongScore, weiScore);
        //let weiCardModes = KQCard.autoSelectCards(cards, 5);
        //cards = cards.kq_excludes(weiCardModes);
        //
        //let zhongCardModes = KQCard.autoSelectCards(cards, 5);
        //
        //let touCardModes = cards.kq_excludes(zhongCardModes);
        //if (touCardModes.length == 3 && zhongCardModes.length == 5 && weiCardModes.length == 5) {
        //    return [touCardModes, zhongCardModes, weiCardModes];
        //}
        if (resultCards[2].length == 3 && resultCards[1].length == 5 && resultCards[0].length == 5) {
            return [resultCards[2], resultCards[1], resultCards[0]];
        }

        return [];
    },

    _convertCardsToServerModel: function _convertCardsToServerModel(cards) {
        var result = {};
        result.type = KQCard.cardsType(cards);
        result.value = KQCard.scoreOfCards(cards);
        cards = KQCard._typeCardsSortByNumberOfPoints1(cards);
        result.cards = KQCard.convertToServerCards(cards);

        return result;
    },

    /*#####*/
    _convertCardsToServerModel2: function _convertCardsToServerModel2(cards) {
        var convertToServerCards = [];

        cc.teShuPaiCards.forEach(function (cardMode) {
            var arr = [];
            cardMode = KQCard._typeCardsSortByNumberOfPoints(KQCard.cardsFromArray(cardMode));
            cardMode.forEach(function (cca) {
                var point = cca.point == 14 ? 1 : cca.point;
                arr.push({ number: point, suit: cca.color });
            });
            convertToServerCards.push(arr);
        });
        var result = {};
        result.type = KQCard.cardsType(cards);
        result.value = 0;
        result.cards = convertToServerCards;

        if (result.type >= KQCard.TYPE.SanTaoHua && cc.moshi != 1) {
            // 特殊牌
            result.isContainExtra = true;
        }

        return result;
    },
    /*#####*/
    // 特殊牌里是否还含有特殊牌
    // 包含的情况有：
    // 三桃花 可能含有同花顺
    // 三顺子 可能含有同花顺
    // 六对半 可能含有铁支
    _isContainExtraCardsType: function _isContainExtraCardsType(type, cards) {
        if (type == KQCard.TYPE.SanTaoHua) {
            return KQCard.containTongHuaShun(cards);
        } else if (type == KQCard.TYPE.SanShunZi) {
            return KQCard.containTongHuaShun(cards);
        } else if (type == KQCard.TYPE.LiuDuiBan) {
            return KQCard.containTieZhi(cards);
        }
        return false;
    },

    // 触摸事件
    _registerTouchEvents: function _registerTouchEvents() {
        //this.cardsLayout.node.on(cc.Node.EventType.TOUCH_START, this._touchCardLayout.bind(this));
        //this.cardsLayout.node.on(cc.Node.EventType.TOUCH_MOVE, this._touchCardLayout.bind(this));
        //this.cardsLayout.node.on(cc.Node.EventType.TOUCH_END, this._touchCardLayoutEnd.bind(this));
        //this.cardsLayout.node.on(cc.Node.EventType.TOUCH_CANCEL, this._touchCardLayoutEnd.bind(this));
    },
    cacleAutoSelectedCardsIndex: function cacleAutoSelectedCardsIndex(cards) {
        //cc.log('------622')
        var testFind = KQCard.testFind(cards) || [];
        //cc.log('------6221')
        var result = [];
        for (var i = 0; i < testFind.length; i++) {
            var s = testFind[i];
            if (s.length >= 1) {
                for (var j = 0; j < s.length; j++) {
                    //result.push(s[0]);//只取一个
                    result.push(s[j]); //
                }
            }
        }
        return result;
    },

    cacleAutoSelectedCardsArray: function cacleAutoSelectedCardsArray(cards) {
        var indexs = this.cacleAutoSelectedCardsIndex(cards);
        if (indexs.length < 1) {
            return false;
        }
        var selectedCard = [];
        for (var i = 0; i < indexs.length; i++) {
            var s = indexs[i];
            var a = s.map(function (index) {
                return cards[index];
            });
            selectedCard.push(a);
        }
        return selectedCard;
    },

    cacleAutoSelectedCards2: function cacleAutoSelectedCards2() {
        var cards = this._allCardModes.slice();
        var cardsArray = this.cacleAutoSelectedCardsArray(cards);
        var resultArray = [];
        for (var i = 0; i < cardsArray.length; i++) {
            var _s = cardsArray[i] || [];
            var qwer = [];
            for (var j = 1; j < cardsArray.length; j++) {
                var d = cardsArray[j] || [];
                var sC = _s.kq_excludes(d);
                if (sC.length == _s.length && _s.length > 0) {
                    //判断牌相同 即没有重复的
                    qwer = [_s, d];
                }
            }
            if (qwer.length > 1) {
                resultArray.push(qwer);
            }
        }

        //补全计划1
        for (var i = 0; i < resultArray.length; i++) {

            var _s2 = resultArray[i];

            var cardss = this._allCardModes.slice();

            cardss = cardss.kq_excludes(_s2[0]);

            cardss = cardss.kq_excludes(_s2[1]);

            if (cardss.length >= 5) {
                _s2[2] = KQCard.autoSelectCards(cardss, 5);
            } else {
                _s2[2] = KQCard.autoSelectCards(cardss, 3);
            }

            resultArray[i].sort(function (a1, a2) {
                return KQCard.scoreOfCards(a1) - KQCard.scoreOfCards(a2);
            });
        }
        //补全计划2
        for (var i = 0; i < resultArray.length; i++) {
            var s = resultArray[i];
            var cardsqe = this._allCardModes.filter(function (ii) {
                //重新赋值cards
                return ii;
            });
            //去重
            var q = s[0].concat(s[1]).concat(s[2]);
            var cardsq = cardsqe.kq_excludes(q);
            s[0] = s[0].kq_excludes(s[1]);
            s[0] = s[0].kq_excludes(s[2]);
            s[1] = s[1].kq_excludes(s[0]);
            s[1] = s[1].kq_excludes(s[2]);
            s[2] = s[2].kq_excludes(s[1]);
            s[2] = s[2].kq_excludes(s[0]);
            //多余删除
            if (s[2].length > 5) {
                //尾道
                var a = s[2].splice(5, s[2].length - 5);
                for (var y in a) {
                    cardsq.push(a[y]);
                }
            }
            if (s[1].length > 5) {
                //中道
                var a = s[1].splice(5, s[1].length - 5);
                for (var y in a) {
                    cardsq.push(a[y]);
                }
            }
            if (s[0].length > 3) {
                //头道
                var a = s[0].splice(3, s[0].length - 3);
                for (var y in a) {
                    cardsq.push(a[y]);
                }
            }
            //cardsq = KQCard._convertOneToA(cardsq);
            cardsq.sort(KQCard.sortByPoint);
            cardsq.forEach(function (card11) {
                if (card11.point == 14) {
                    card11.point = 1;
                }
            });
            //有缺添加
            while (s[2].length < 5) {
                //尾道
                s[2].push(cardsq.pop() || []);
            }
            while (s[1].length < 5) {
                //中道
                s[1].push(cardsq.pop() || []);
            }
            while (s[0].length < 3) {
                //头道
                s[0].push(cardsq.pop() || []);
            }
            /*if(cardsq.length > 0){
                while(s[2].length < 5) {//尾道
                    s[2].push(cardsq.pop());
                }
            }
            if(cardsq.length > 0){
                while(s[1].length < 5) {//中道
                    s[1].push(cardsq.pop());
                }
            }
            if(cardsq.length > 0){
                while(s[0].length < 3) {//头道
                    s[0].push(cardsq.pop());
                }
            }*/
            if (s[2][4] == null || s[1][4] == null || s[0][2] == null || s[2][4] == '' || s[1][4] == '' || s[0][2] == '') {
                resultArray.splice(i, 1);
            }
        }

        var resultCards = [];
        var cardss1 = this._allCardModes.filter(function (i) {
            return i;
        });
        var indexasdf = 2;
        for (var i = 0; i < 3; i++) {
            var _length = indexasdf == 0 ? 3 : 5;
            var cardss = KQCard.autoSelectCards(cardss1, _length) || [];
            cardss1 = cardss1.kq_excludes(cardss);
            resultCards[indexasdf] = cardss;
            indexasdf--;
        }

        for (var i = 0; i < resultCards.length; i++) {
            var _length2 = i == 0 ? 3 : 5;
            if (resultCards[i].length < _length2) {
                cardss1 = cardss1.kq_excludes(resultCards[i]);
                while (resultCards[i].length < _length2) {
                    resultCards[i].push(cardss1.pop());
                }
            }
        }

        resultArray.push(resultCards);

        var cardsTypeNames = [];
        var resultArrays = [];

        for (var i = 0; i < resultArray.length; i++) {
            //删除类型相同的组合
            var _s3 = resultArray[i];
            var typeName0 = KQCard.cardsTypeName(_s3[0]);
            typeName0 += KQCard.cardsTypeName(_s3[1]);
            typeName0 += KQCard.cardsTypeName(_s3[2]);
            if (cardsTypeNames.indexOf(typeName0) == -1) {
                var touScore = KQCard.scoreOfCards(_s3[0]);
                var zhongScore = KQCard.scoreOfCards(_s3[1]);
                var weiScore = KQCard.scoreOfCards(_s3[2]);
                if (zhongScore > touScore && zhongScore < weiScore) {
                    cardsTypeNames.push(typeName0);
                    resultArrays.push(_s3);
                }
            }
        }

        resultArrays.sort(function (a1, a2) {
            var b0 = parseInt(KQCard.cardsType(a2[0])) + "";
            var b1 = parseInt(KQCard.cardsType(a2[1])) + "";
            var b2 = parseInt(KQCard.cardsType(a2[2])) + "";

            var s0 = parseInt(KQCard.cardsType(a1[0])) + "";
            var s1 = parseInt(KQCard.cardsType(a1[1])) + "";
            var s2 = parseInt(KQCard.cardsType(a1[2])) + "";

            var s = parseInt(s2 + s1 + s0);
            var b = parseInt(b2 + b1 + b0);

            return b - s;
        });

        if (resultArrays.length > 7) {
            resultArrays = resultArrays.slice(0, 7);
        }
        //for(var i = 0;i < resultArrays.length;i++){//如果有相公牌则删除
        //    let s = resultArrays[i];
        //    let touScore = KQCard.scoreOfCards(s[0]);
        //    let zhongScore = KQCard.scoreOfCards(s[1]);
        //    let weiScore = KQCard.scoreOfCards(s[2]);
        //    cc.log(touScore,zhongScore,weiScore);
        //    if(weiScore < touScore || weiScore < zhongScore){
        //        resultArrays.splice(i,1);
        //    }
        //}
        //cc.log(resultArrays)
        //cc.log('-------897')

        //if(cc.teShuPaiCards){
        //    var TeShuCards = cc.teShuPaiCards.map(function(ca){
        //       return KQCard._typeCardsSortByNumberOfPoints(KQCard.cardsFromArray(ca));
        //    });
        //    resultArrays.unshift(TeShuCards);
        //
        //}

        if (resultArrays.length <= 0) {

            this._allCardModes.forEach(function (i) {
                if (i.scores == 1) i.scores = 14;
            });

            var card20 = KQCard.contain20(this._allCardModes);

            this._allCardModes = this._allCardModes.kq_excludes(card20);

            this._allCardModes = KQCard._typeCardsSortByNumberOfPoints(this._allCardModes);

            this._allCardModes = card20.concat(this._allCardModes);

            var asdf1 = this._allCardModes.slice(0, 5);

            var asdf2 = this._allCardModes.slice(5, 10);

            var asdf3 = this._allCardModes.slice(10, 13);

            resultArrays.push([asdf3, asdf2, asdf1]);
        }

        this.autoCardLayout.node.removeAllChildren();
        this.autoCardScrollView.scrollToLeft();
        for (var i = 0; i < resultArrays.length; i++) {
            //添加预制体
            var _s4 = resultArrays[i];
            var autoCard = cc.instantiate(this.autoCard);
            autoCard.y = 0;
            _s4[0].forEach(function (i) {
                if (i.point == 14) i.point = 1;
            });
            _s4[1].forEach(function (i) {
                if (i.point == 14) i.point = 1;
            });
            _s4[2].forEach(function (i) {
                if (i.point == 14) i.point = 1;
            });
            var cardsNode = [autoCard.children[1], autoCard.children[3], autoCard.children[2]];

            this._setCardDaoSprite(cardsNode, _s4);

            autoCard.cardArray = _s4;
            var eventHandler = new cc.Component.EventHandler();
            eventHandler.target = this.node;
            eventHandler.component = "CardTypeCombine";
            eventHandler.handler = "clickAutoSelectedCards";
            eventHandler.customEventData = i;
            autoCard.getComponent(cc.Button).clickEvents.push(eventHandler);
            this.autoCardLayout.node.addChild(autoCard);
        }
        this._findCardIndex.arr = resultArrays;

        this.autoSelectedCardsOne();
    },

    //daoCancelAll: function () {
    //    var nodes = [this.layoutTouDao.node,this.layoutZhongDao.node,this.layoutWeiDao.node];
    //    for(var i = 0;i < nodes.length;i++){
    //        nodes[i].removeAllChildren();
    //    }
    //},

    autoSelectedCardsOne: function autoSelectedCardsOne() {
        this.cardsLayout.node.removeAllChildren();

        var indexs = 0;

        for (var i = 0; i < this.autoCardLayout.node.children.length; i++) {

            var nodes = this.autoCardLayout.node.children[i];

            nodes.children[0].active = false;
        }

        this.autoCardLayout.node.children[indexs].children[0].active = true;

        var resultArray = this._findCardIndex.arr[indexs];

        this._findCardIndex.indexs = indexs;

        for (var i = 0; i < resultArray.length; i++) {

            var cardModes = resultArray[i];

            cardModes.sort(KQCard.sort);

            var num = 0;
            if (i == 1) {
                num = 3;
            } else if (i == 2) {
                num = 8;
            }
            //cardModes.forEach(function(i){if (i.point == 14) i.point = 1;})
            cardModes.forEach((function (cardMode, index) {

                var cardName = cardMode.cardName();

                var numBer = num + index;

                var nodds1 = new cc.Node(); //创建一个节点对象

                nodds1.anchorY = 1;

                nodds1.addComponent(cc.Sprite); //添加精灵组件

                this.cardAllNode.children[numBer].addChild(nodds1);

                this.cardAllNode.children[numBer].children[0].cardName = cardName;

                this.cardAllNode.children[numBer].children[0]._cardModel = new KQCard(cardName, null, index);

                var btnSprites = this.cardAllNode.children[numBer].children[0].getComponent(cc.Sprite);

                this.cardAllNode.children[numBer].getComponent(cc.Sprite).spriteFrame = '';

                btnSprites.node.removeAllChildren();

                if (cc.maPai == cardName) {

                    var nodds = new cc.Node(); //创建一个节点对象

                    nodds.addComponent(cc.Sprite); //添加精灵组件

                    cc.loader.loadRes('play/desk/img_red5_1', cc.SpriteFrame, (function (err, spriteFrame) {

                        if (err) {
                            cc.error(err.message || err);return;
                        }

                        var btnSprite1 = nodds.getComponent(cc.Sprite);

                        btnSprite1.spriteFrame = spriteFrame;

                        btnSprite1.node.width = 107;

                        btnSprite1.node.height = 155;

                        btnSprite1.node.y = -65.5;
                    }).bind(this));

                    btnSprites.node.addChild(nodds);
                }

                var path = 'public-pic-card-poker-' + cardName;

                this._loadCardFrame(this.cardSpriteAtlas, path, btnSprites, 95, 130);
            }).bind(this));
        }

        this.clickAutoSelectedCards(null);

        //this._setCardDaoSprite();
    },

    clickAutoSelectedCards: function clickAutoSelectedCards(event) {
        var indexs = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

        for (var i = 0; i < this.autoCardLayout.node.children.length; i++) {

            var nodes = this.autoCardLayout.node.children[i];

            nodes.children[0].active = false;
        }

        this.autoCardLayout.node.children[indexs].children[0].active = true;

        AudioManager.instance.playPokerClick();

        if (event) {
            var resultArray = event.target.cardArray;
        } else {
            var resultArray = this._findCardIndex.arr[indexs];
        }
        var touScore = KQCard.scoreOfCards(resultArray[0]);
        var zhongScore = KQCard.scoreOfCards(resultArray[1]);
        var weiScore = KQCard.scoreOfCards(resultArray[2]);
        //cc.log(touScore);
        //cc.log(zhongScore);
        //cc.log(weiScore);
        //console.log('----------1180')
        resultArray = resultArray.map((function (cardMode) {

            cardMode = KQCard._typeCardsSortByNumberOfPoints(cardMode);

            return cardMode.map((function (cardModes) {

                return cardModes.cardName();
            }).bind(this));
        }).bind(this));
        //console.log(resultArray)

        this.LayoutWithEvent.forEach(function (nodes) {

            nodes.color = new cc.Color(255, 255, 255);

            nodes.children.forEach(function (i) {
                i.color = new cc.Color(255, 255, 255);
            });
        });

        this.LayoutWithEvent = [];

        resultArray = resultArray[0].concat(resultArray[1]).concat(resultArray[2]);

        var cardAllNode = this.cardAllNode.children.map(function (i) {
            return i;
        });

        for (var i = 0; i < resultArray.length; i++) {

            var s = resultArray[i];

            for (var j = 0; j < cardAllNode.length; j++) {

                var d = cardAllNode[j];

                d.getComponent(cc.Button).interactable = false;

                if (d.children[0].cardName == s) {

                    d.stopAllActions();

                    var detail = this.changeNodeSpaceAR[i];

                    var call = cc.callFunc((function () {

                        this.cardAllNode.children.forEach(function (nodes) {
                            nodes.getComponent(cc.Button).interactable = true;
                        });

                        this._setCardDaoSprite();
                    }).bind(this), this);

                    d.runAction(cc.sequence(cc.moveTo(this.cardTime, detail), call));

                    cardAllNode.splice(j, 1);

                    break;
                }
            }
        }
    },

    _loadCardFrame: function _loadCardFrame(SpriteFrame, path, SpritesNode, w, h) {

        var Sprite = SpriteFrame.getSpriteFrame(path);

        SpritesNode.spriteFrame = Sprite;

        if (w) SpritesNode.node.width = w;

        if (h) SpritesNode.node.height = h;
    },

    stickOutFindCardType1: function stickOutFindCardType1(cards) {
        var index = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
    },

    //// 将已有的突出的牌的位置重置回初始位置
    //this._resetCardsPositionY();
    //let selectedCardNames = cards.map(function(cardModel){
    //    return cardModel.cardName();
    //}.bind(this));
    //
    //let cardNodes = this.cardsLayout.node.children.filter(function (cardNode) {
    //    let cardPrefab = cardNode.getComponent('CardPrefab');
    //    if(selectedCardNames.includes(cardPrefab.cardName())) {
    //        var nameIndex = selectedCardNames.indexOf(cardPrefab.cardName());
    //        selectedCardNames.splice(nameIndex,1);
    //        return true;
    //    }
    //    return false;
    //});
    //
    //cc.log('-------696')
    //this._changeCardPrefabsY(cardNodes);
    //if(index == 1){
    //    this._addDaoCardToLayout(this.layoutTouDao.node, 3);
    //}
    //else if(index == 2){
    //    this._addDaoCardToLayout(this.layoutZhongDao.node);
    //}
    //else if(index == 3){
    //    this._addDaoCardToLayout(this.layoutWeiDao.node);
    //}

    _touchCardLayout: function _touchCardLayout(event) {
        //event.bubbles = true;
        //let location = event.getLocation();
        //let cardPrefab = this._cardPrefabInCardLayoutWithLocation(location);
        //if (cardPrefab) {
        //    cardPrefab.getComponent('CardPrefab').setSelected(true);
        //    event.stopPropagation();
        //}
    },

    _touchCardLayoutEnd: function _touchCardLayoutEnd(event) {
        //this._changeSelectedCardPrefabsY();
        //this._diseclectCardPrefabs();
    },

    _cardPrefabInCardLayoutWithLocation: function _cardPrefabInCardLayoutWithLocation(location) {
        //location = this.cardsLayout.node.convertToNodeSpaceAR(location);
        //let cardNodes = this.cardsLayout.node.children.sort(function (cardNode1, cardNode2) {
        //    let rect1 = cardNode1.getBoundingBox();
        //    let rect2 = cardNode2.getBoundingBox();
        //    return rect2.x - rect1.x;
        //});
        //for (let index in cardNodes) {
        //    let cardNode = cardNodes[index];
        //
        //    let rect = cardNode.getBoundingBox();
        //
        //    if (cc.rectContainsPoint(rect, location)) {
        //        return cardNode;
        //    }
        //}
        //
        //return null;
    },

    _changeSelectedCardPrefabsY: function _changeSelectedCardPrefabsY() {
        //let cardNodes = this._selectedCardPrefabs();
        //this._changeCardPrefabsY(cardNodes);
        //
        //AudioManager.instance.playPokerClick();
    },

    _changeCardPrefabsY: function _changeCardPrefabsY(cardNodes) {
        //cardNodes.forEach(function (cardNode) {
        //    let y = cardNode.getPositionY();
        //    if (y == this._cardOffsetY) {
        //        cardNode.setPositionY(this._cardOffsetY + 55);
        //    } else {
        //        cardNode.setPositionY(this._cardOffsetY);
        //    }
        //}.bind(this));
    },

    _selectedCardPrefabs: function _selectedCardPrefabs() {
        var includeStickOut = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
    },

    //let cardNodes = this.cardsLayout.node.children || [];
    //return cardNodes.filter(function (cardNode) {
    //    let cardPrefab = cardNode.getComponent('CardPrefab');
    //    let isSelected = cardPrefab.isSelected();
    //    if (!isSelected && includeStickOut) {
    //        isSelected = cardNode.getPositionY() > 10;
    //    }
    //
    //    return isSelected;
    //});
    _diseclectCardPrefabs: function _diseclectCardPrefabs() {
        //let cardNodes = this.cardsLayout.node.children;
        //cardNodes.forEach(function (node) {
        //    node.getComponent('CardPrefab').setSelected(false);
        //});
    },

    // 重置 cards 的 X
    _resetCardsPositionX: function _resetCardsPositionX() {
        //let interval = 98;
        //let interval = 78;
        //let cardNodes = this.cardsLayout.node.children || [];
        //let length = cardNodes.length;
        //if (length == 0) {
        //    return;
        //}
        //
        //let middleIndex = length / 2;
        //let cardWidth = 154;
        //
        //
        ////this.cardsLayoutSort();
        //if(this.cardsLayoutSortColor == true){
        //    this.cardsLayout.node.children.sort(function (n1, n2) {
        //        let component1 = n1.getComponent('CardPrefab');
        //        let component2 = n2.getComponent('CardPrefab');
        //        return component2.cardMode().color - component1.cardMode().color;
        //    });
        //}else{
        //    this.cardsLayout.node.children.sort(function (n1, n2) {
        //        let component1 = n1.getComponent('CardPrefab');
        //        let component2 = n2.getComponent('CardPrefab');
        //        return component1.cardMode().sort(component2.cardMode());
        //    });
        //}
        ////cardNodes.sort(function (n1, n2) {
        ////    let component1 = n1.getComponent('CardPrefab');
        ////    let component2 = n2.getComponent('CardPrefab');
        ////
        ////    return component1.cardMode().sort(component2.cardMode());
        ////});
        //
        //cardNodes.forEach(function (cardNode, index) {
        //    cardNode.zIndex = index;
        //    let x = (index - middleIndex) * interval + cardWidth / 3;
        //    cardNode.setPositionX(x);
        //});
    },

    // 重置 cards 的 X为0
    resetCardsPositionX1: function resetCardsPositionX1() {
        //let cardNodes = this.cardsLayout.node.children || [];
        //let length = cardNodes.length;
        //if (length == 0) {
        //    return;
        //}
        //cardNodes.forEach(function (cardNode) {
        //    cardNode.setPositionY(0);
        //});
    },

    _resetCardsPositionY: function _resetCardsPositionY() {
        //let cardNodes = this.cardsLayout.node.children || [];
        //cardNodes.forEach(function (cardNode) {
        //    cardNode.setPositionY(this._cardOffsetY);
        //}.bind(this));
    },

    // 头、中、尾道 layout 的点击事件
    _registerDaosLayoutClickEvent: function _registerDaosLayoutClickEvent() {

        this.changeNodeSpaceAR = []; //记录所有牌的坐标
        this.cardAllNode.children.forEach((function (nodes) {
            //获取节点的世界坐标
            var cardBackWorldSpace1 = nodes.convertToWorldSpaceAR(cc.v2(0, 0));
            //获取相对父节点所在的坐标
            var detail = nodes.parent.convertToNodeSpaceAR(cardBackWorldSpace1);

            this.changeNodeSpaceAR.push(detail);
        }).bind(this));
    },

    clickAllCard: function clickAllCard(event) {
        AudioManager.instance.playPokerClick();
        if (this.LayoutWithEvent.length <= 1) {
            this.LayoutWithEvent.push(event.target);
            event.target.color = new cc.Color(182, 182, 182);
            event.target.children.forEach(function (i) {
                i.color = new cc.Color(182, 182, 182);
            });
        }
        if (this.LayoutWithEvent.length == 2) {

            var arr = [];

            this.LayoutWithEvent.forEach((function (nodes) {
                //获取节点的世界坐标
                var cardBackWorldSpace1 = nodes.convertToWorldSpaceAR(cc.v2(0, 0));
                //获取相对父节点所在的坐标
                var detail = nodes.parent.convertToNodeSpaceAR(cardBackWorldSpace1);

                arr.unshift(detail);
            }).bind(this));

            this.LayoutWithEvent.forEach((function (nodes, index) {

                nodes.color = new cc.Color(255, 255, 255);

                nodes.children.forEach(function (i) {
                    i.color = new cc.Color(255, 255, 255);
                });

                nodes.getComponent(cc.Button).interactable = false;

                this.scheduleOnce((function () {

                    nodes.getComponent(cc.Button).interactable = true;

                    this._setCardDaoSprite();
                }).bind(this), this.cardTime);

                nodes.stopAllActions();

                var detail = arr[index];

                nodes.runAction(cc.moveTo(this.cardTime, detail));
            }).bind(this));

            this.LayoutWithEvent = [];
        }
    },

    _setCardDaoSprite: function _setCardDaoSprite() {
        var nodes = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
        var cards = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

        if (!nodes) {

            this.cardAlls = this.cardAllNode.children.sort(function (a, b) {
                return b.y - a.y;
            }).map(function (i) {
                return i.children[0];
            });

            cards = [this._taoDaoCardModes(), this._zhongDaoCardModes(), this._weiDaoCardModes()];

            cards.forEach(function (card) {
                card.forEach(function (i) {
                    if (i.scores == 14) {
                        i.scores = 1;
                    }
                });
            });

            nodes = [this.touDaoNode, this.zhongDaoNode, this.weiDaoNode];
        }

        //头道
        var typeName0 = KQCard.cardsType(cards[0]) + 1;

        typeName0 = typeName0 >= 10 ? typeName0 : "0" + typeName0;

        typeName0 = typeName0 == '04' ? '11' : typeName0;

        var path = 'game_poker_type' + typeName0;

        this._loadCardFrame(this.daoSpriteAtlas, path, nodes[0].getComponent(cc.Sprite));

        //中道
        var typeName1 = KQCard.cardsType(cards[1]) + 1;

        typeName1 = typeName1 >= 10 ? typeName1 : "0" + typeName1;

        typeName1 = typeName1 == '07' ? '22' : typeName1;

        path = 'game_poker_type' + typeName1;

        this._loadCardFrame(this.daoSpriteAtlas, path, nodes[1].getComponent(cc.Sprite));

        //尾道
        var typeName2 = KQCard.cardsType(cards[2]) + 1;

        typeName2 = typeName2 >= 10 ? typeName2 : "0" + typeName2;

        path = 'game_poker_type' + typeName2;

        this._loadCardFrame(this.daoSpriteAtlas, path, nodes[2].getComponent(cc.Sprite));

        this.cardAllNode.children.forEach(function (n) {
            n.getComponent(cc.Sprite).spriteFrame = "";
        });

        if (cards) {

            if (typeName0) KQCard._setGuiCard(0, 0, 3, typeName0, cards, this.cardAllNode.children, this.cardSpriteAtlas);

            if (typeName1) KQCard._setGuiCard(1, 3, 8, typeName1, cards, this.cardAllNode.children, this.cardSpriteAtlas);

            if (typeName2) KQCard._setGuiCard(2, 8, 13, typeName2, cards, this.cardAllNode.children, this.cardSpriteAtlas);
        }
    },

    _clickTouDaoLayout: function _clickTouDaoLayout(event) {
        this._daoCardNodeInLayoutWithEvent(this.layoutTouDao.node, event);
    },

    _clickZhongDaoLayout: function _clickZhongDaoLayout(event) {
        this._daoCardNodeInLayoutWithEvent(this.layoutZhongDao.node, event);
    },

    _clickWeiDaoLayout: function _clickWeiDaoLayout(event) {
        this._daoCardNodeInLayoutWithEvent(this.layoutWeiDao.node, event);
    },

    _daoCardNodeInLayoutWithEvent: function _daoCardNodeInLayoutWithEvent(node, event) {
        var cardNodes = node.children || [];
        var location = event.getLocation();
        location = node.convertToNodeSpaceAR(location);
        //var cardBackWorldSpace = this.layoutZhongDao.node.convertToWorldSpaceAR(cc.v2(0, 0));
        ////获取节点的世界坐标
        //var detail = this.layoutZhongDao.node.parent.convertToNodeSpaceAR(cardBackWorldSpace);
        ////获取相对父节点所在的坐标
        //this.layoutWeiDao.node.runAction(cc.moveTo(1,detail));
        for (var index in cardNodes) {
            var cardNode = cardNodes[index];
            var rect = cardNode.getBoundingBox();
            if (cc.rectContainsPoint(rect, location)) {
                AudioManager.instance.playPokerClick();
                var arrs = [node, cardNode];
                if (this.LayoutWithEvent.length == 1) {
                    if (this.LayoutWithEvent[0][0].name != node.name) {
                        cardNode.opacity = 200;
                        this.LayoutWithEvent.push(arrs);
                    } else {
                        this.LayoutWithEvent[0][1].opacity = 255;
                        this.LayoutWithEvent = [];
                    }
                } else if (this.LayoutWithEvent.length == 0) {
                    //cc.log(cardNode)
                    this.LayoutWithEvent.push(arrs);
                    cardNode.opacity = 200;
                }
                if (this.LayoutWithEvent.length == 2) {
                    var node1 = this.LayoutWithEvent[0][1];
                    var node2 = this.LayoutWithEvent[1][1];
                    //获取节点的世界坐标
                    var cardBackWorldSpace = node1.convertToWorldSpaceAR(cc.v2(0, 0));
                    //获取相对父节点所在的坐标
                    var detail = node1.parent.convertToNodeSpaceAR(cardBackWorldSpace);
                    node2.runAction(cc.moveTo(1, detail));
                }

                return;
            }
        }

        //return null;
    },

    _addDaoCardToLayout: function _addDaoCardToLayout(node) {
        var maxNumberCard = arguments.length <= 1 || arguments[1] === undefined ? 5 : arguments[1];
    },

    //let cardNodes = node.children || [];
    //if (cardNodes.length >= 5) {
    //    return;
    //}
    //let remainCount = maxNumberCard - cardNodes.length;
    //
    //var selectedCards = this._selectedCardPrefabs(true) || [];
    //
    //if (selectedCards.length == 0) {
    //    return;
    //}
    //if (selectedCards.length > remainCount) {
    //    selectedCards = selectedCards.slice(0, remainCount);
    //}
    //
    //let selectedCardNames = selectedCards.map(function (cardPrefab) {
    //    return cardPrefab.getComponent('CardPrefab').cardName();
    //});
    //
    //cardNodes.forEach(function (cardTypeNode) {
    //    selectedCardNames.push(cardTypeNode.getComponent('CardTypeSprite').cardName());
    //});
    //
    //let cardModes = selectedCardNames.map(function (cardName,index) {
    //    return new KQCard(cardName,null,index);
    //}).sort(function (c1, c2) {
    //    return KQCard.sort(c1, c2, false);
    //});

    //let touCardModes = (node == this.layoutTouDao.node) ? cardModes : this._taoDaoCardModes();
    //let zhongCardModes = (node == this.layoutZhongDao.node) ? cardModes : this._zhongDaoCardModes();
    //let weiCardModes = (node == this.layoutWeiDao.node) ? cardModes : this._weiDaoCardModes();
    //if (!this._isValidCardModes(touCardModes, zhongCardModes, weiCardModes)) {
    //    this.cacleAutoSelectedCards1();
    //    cc.log('相公牌：自动选择牌')
    //    return;
    //}
    //
    //node.removeAllChildren();
    //
    //cardModes.forEach(function (cardMode,index) {
    //    let cardName = cardMode.cardName();
    //    let cardTypeSprite = cc.instantiate(this.cardTypePrefab);
    //    cardTypeSprite.names = cardName+'+'+index;
    //    cardTypeSprite.getComponent('CardTypeSprite').setCard(cardName,index);
    //    node.addChild(cardTypeSprite);
    //}.bind(this));
    //
    //
    //selectedCards.forEach(function (node) {
    //    node.removeFromParent();
    //});
    //this._resetCardsPositionY();
    //this._resetCardsPositionX();
    //
    //this._autoActiveDeleteDaoButtons();
    //
    //this._reloadKQCardModesInner();
    //this._resetTypeButtonEnablesWithModels();
    // 删除 头、中或尾道中的某中牌
    _deleteDaoCard: function _deleteDaoCard(cardTypeNode) {
        var reloadTypeButtonEnables = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
    },

    //let cardName = cardTypeNode.getComponent('CardTypeSprite').cardName();
    //this.addCard(cardName, true);
    //
    //this._resetCardsPositionY();
    //
    //cardTypeNode.removeFromParent(true);
    //this._autoActiveDeleteDaoButtons();
    //
    //if (reloadTypeButtonEnables) {
    //    this._reloadKQCardModesInner();
    //    this._resetTypeButtonEnablesWithModels();
    //}
    // 删除 头道或中道或尾道上所有的 牌
    _deleteDaoCardsOfLayout: function _deleteDaoCardsOfLayout(daoLayout) {
        //let cardNodes = Array.from(daoLayout.children);
        //cardNodes.forEach(this._deleteDaoCard.bind(this));
        //
        //this._reloadKQCardModesInner();
        //this._resetTypeButtonEnablesWithModels();
    },

    // 判断能否使用选择中的牌
    // 即：头道要小于中道、中道要小于尾道
    _isValidCardModes: function _isValidCardModes(touCardModes, zhongCardModes, weiCardModes) {
        touCardModes = touCardModes || [];
        zhongCardModes = zhongCardModes || [];
        weiCardModes = weiCardModes || [];
        if (touCardModes.length < 3 || zhongCardModes.length < 5 || weiCardModes.length < 5) {
            return true;
        }

        var touScore = KQCard.scoreOfCards(touCardModes);
        var zhongScore = KQCard.scoreOfCards(zhongCardModes);
        var weiScore = KQCard.scoreOfCards(weiCardModes);
        return touScore < zhongScore && zhongScore <= weiScore;
    },

    // 头道上已有的牌
    _taoDaoCardModes: function _taoDaoCardModes() {
        return this._cardModesOfCardPrefabs(this.cardAlls.slice(0, 3));
    },

    // 中道上已有的牌
    _zhongDaoCardModes: function _zhongDaoCardModes() {
        //return this._cardModesOfCardPrefabs(this.layoutZhongDao.node.children);
        return this._cardModesOfCardPrefabs(this.cardAlls.slice(3, 8));
    },

    // 尾道上已有的牌
    _weiDaoCardModes: function _weiDaoCardModes() {
        //return this._cardModesOfCardPrefabs(this.layoutWeiDao.node.children);
        return this._cardModesOfCardPrefabs(this.cardAlls.slice(8, 13));
    },

    _cardModesOfCardPrefabs: function _cardModesOfCardPrefabs(cardTypeNodes) {
        if (!cardTypeNodes) {
            return [];
        }

        var cardModes = cardTypeNodes.map(function (node) {
            //let component = node.getComponent('CardTypeSprite');
            //return component.cardMode();._cardModel
            return node._cardModel;
        });

        return cardModes || [];
    },

    // 自动设置 头、中、尾道的删除按钮的可见性
    _autoActiveDeleteDaoButtons: function _autoActiveDeleteDaoButtons() {
        //this._autoActiveDeleteDaoButton(this.layoutTouDao.node, this.btnDeleteTouDao.node);
        //this._autoActiveDeleteDaoButton(this.layoutZhongDao.node, this.btnDeleteZhongDao.node);
        //this._autoActiveDeleteDaoButton(this.layoutWeiDao.node, this.btnDeleteWeiDao.node);
    },

    _autoActiveDeleteDaoButton: function _autoActiveDeleteDaoButton(layout, button) {
        //button.active = layout.children.length > 0;
    },

    // 自动设置 “全部取消”、“确定出牌”、“类型选择”按钮的可见性
    _autoActiveTypeButtons: function _autoActiveTypeButtons() {
        //let cardNodes = this.cardsLayout.node.children || [];
        //let hasCardUnSelected = cardNodes.length > 0;
        //this.btnDone.node.active = !hasCardUnSelected;
        //this.btnCancelAll.node.active = this.btnDone.node.active;
        //this.typeButtonsNode.active = hasCardUnSelected;
    }

});

cc._RFpop();
},{"AudioManager":"AudioManager","KQCard":"KQCard","KQCardFindTypeExtension":"KQCardFindTypeExtension","KQCardScoretsHelper":"KQCardScoretsHelper","play":"play"}],"CardTypeSprite":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e614c0FMndAtrOMcy8/PcZw', 'CardTypeSprite');
// scripts\CardTypeSprite.js

var KQCard = require('KQCard');
cc.Class({
  'extends': cc.Component,

  properties: {
    _cardName: null,
    _cardModel: null
  },

  // use this for initialization
  onLoad: function onLoad() {},

  setCard: function setCard(cardName, index) {
    var asdf = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

    this._cardName = cardName;
    if (asdf) {
      this._cardModel = new KQCard(cardName, null, index);
    }
    this._loadCardFrame(cardName, (function (spriteFrame) {
      this.node.getComponent('cc.Sprite').spriteFrame = spriteFrame;
    }).bind(this));
  },

  cardName: function cardName() {
    return this._cardName;
  },

  cardMode: function cardMode() {
    return this._cardModel;
  },

  _cardFullName: function _cardFullName(cardShortName) {
    var cardName = cardShortName;
    if (!cardName.startsWith("public-pic-card-poker")) {
      cardName = "public-pic-card-poker-" + cardName;
    }

    return cardName;
  },

  _loadCardFrame: function _loadCardFrame(cardName, callback) {
    cc.assert(callback);

    cc.loader.loadRes("play/CardTypeCombine/pockList", cc.SpriteAtlas, (function (err, atlas) {
      if (err) {
        cc.error(err);
        return;
      }

      cardName = this._cardFullName(cardName);
      var frame = atlas.getSpriteFrame(cardName);
      callback(frame);
    }).bind(this));
  }
});

cc._RFpop();
},{"KQCard":"KQCard"}],"ChatMessage":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'dc8980X2ZVNKrH9BsIsSE4D', 'ChatMessage');
// scripts\Chat\ChatMessage.js

// 用于在游戏过程中，展示用户的聊天消息

var ChatMessage = cc.Class({
    "extends": cc.Component,

    properties: {
        richText: cc.RichText,
        spriteBackground: cc.Sprite,
        emoji: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        ChatMessage.instances = this;
    },

    setString: function setString() {
        var string = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];
        var autoHide = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

        if (string.length == 0) {
            return;
        }

        this.node.active = true;
        this.richText.node.active = true;
        this.spriteBackground.node.active = true;
        this.emoji.active = false;
        var maxWidth = 300;
        var realStr = ChatMessage.parseString(string);

        // 由于 cc.RichText 在指定 maxWidth 后，该结点的 width 会一直
        // 是 maxWidth 值。而在将 maxWidth 指定为0时，其 contentSize.width 会
        // 是内容的真正所需的宽度
        //
        // 所以这里先将 maxWidth 设为 0，获取其实际内容 width 后再调整
        this.richText.maxWidth = 0;
        this.richText.string = realStr;

        var contentWidth = this.richText.node.getContentSize().width;
        if (contentWidth > maxWidth) {
            this.richText.maxWidth = maxWidth;
            this.richText.string = realStr;
            contentWidth = maxWidth;
        }

        this.node.width = contentWidth + 28;
        this.node.height = this.richText.node.getContentSize().height + 20;

        this.spriteBackground.node.width = this.node.width;
        this.spriteBackground.node.height = this.node.height;

        if (autoHide) {
            this._hideNode();
            //this.unscheduleAllCallbacks();
            //this.scheduleOnce(this._hideNode.bind(this), 3);
        }
    },

    showEmoji: function showEmoji(sprite) {
        this._hideNode();
        this.node.active = true;
        this.emoji.active = true;
        this.richText.node.active = false;
        this.spriteBackground.node.active = false;
        var btnSprites = this.emoji.getComponent(cc.Sprite);
        btnSprites.spriteFrame = sprite;
    },

    _hideNode: function _hideNode() {
        this.unscheduleAllCallbacks();
        this.scheduleOnce((function () {
            this.node.active = false;
        }).bind(this), 3);
    }

});
ChatMessage.setEmoji = function (sprite) {
    this.instances._hideNode();
    this.instances.node.active = true;
    this.instances.emoji.active = true;
    this.instances.richText.node.active = false;
    this.instances.spriteBackground.node.active = false;
    var btnSprites = this.instances.emoji.getComponent(cc.Sprite);
    btnSprites.spriteFrame = sprite;
    //console.log(this.emoji);
    //return;
    //
    //this.emoji.Sprite = sprite;
},

// 将 <bq10> 改为： <img src='bg10'/>
ChatMessage.parseString = function (str) {
    var result = str.replace(/<bq\d{1,2}>/g, function (match) {
        var bq = match.replace("<", " <img src='").replace(">", "'/> ");
        return bq;
    });
    return result;
}, module.exports = ChatMessage;

cc._RFpop();
},{}],"ChatTextRecord":[function(require,module,exports){
"use strict";
cc._RFpush(module, '88d10U9tIpHNK1entoUH0Ju', 'ChatTextRecord');
// scripts\Pefabs\ChatTextRecord.js

cc.Class({
    'extends': cc.Component,

    properties: {},

    // use this for initialization
    onLoad: function onLoad() {},

    setString: function setString(str) {
        this._richText().string = str;
    },

    _richText: function _richText() {
        return this.node.getComponent('cc.RichText');
    },

    setEmoji: function setEmoji(spraite) {
        this._spriteFrame().Spraite = spraite;
    },
    _spriteFrame: function _spriteFrame() {
        return this.node.getComponent('cc.Sprite');
    }
});

cc._RFpop();
},{}],"CompareCards":[function(require,module,exports){
"use strict";
cc._RFpush(module, '9aa4aH/Ha1JfaEeY5nFj5P1', 'CompareCards');
// scripts\Pefabs\CompareCards.js

var KQCardResHelper = require('KQCardResHelper');
var AudioManager = require('AudioManager');
var KQCard = require('KQCard');

cc.Class({
    'extends': cc.Component,

    properties: {
        touLayout: cc.Layout,
        zhongLayout: cc.Layout,
        weiLayout: cc.Layout,

        touLayoutBack: cc.Layout,
        zhongLayoutBack: cc.Layout,
        weiLayoutBack: cc.Layout,
        baoDao: cc.Node, //报道图,
        playTotalScore: cc.Layout, //所有玩家的总分数

        daoScoreLayouts: [cc.Layout],
        daoTitleNodes: [cc.Node],
        TScoreLayout: cc.Layout,
        TtitleNode: cc.Node,

        pNum: 0, //玩家人数
        teShuTime: 0, //特殊牌出牌顺序
        teShuNum: 0, //特殊牌人数

        _lCScore: null,
        _daoLayouts: null, // 头、中、尾集合
        _daoLayoutBacks: null, // 头、中、尾集合
        _scores: null,
        _user: null, // 用于比牌的数据
        _cardsInfo: null,
        _compareIndex: 0 },

    // 将要比较的 索引  0~2
    // use this for initialization
    onLoad: function onLoad() {

        this._daoLayouts = [this.touLayout, this.zhongLayout, this.weiLayout];
        this._daoLayoutBacks = [this.touLayoutBack, this.zhongLayoutBack, this.weiLayoutBack];
        this.reset();

        if (this._scores) {
            this.setScores(this._scores);
        }
    },

    reset: function reset() {
        this._compareIndex = 0;

        this.node.children.forEach(function (node) {
            node.active = false;
        });

        this.baoDao.getComponent(cc.Sprite).spriteFrame = null;

        var nodes = this.touLayoutBack.node.children.concat(this.zhongLayoutBack.node.children).concat(this.weiLayoutBack.node.children);

        this.cardSpriteAtlas = this.node.parent.parent.getComponent('play').cardSpriteAtlas;

        nodes.forEach((function (nod) {

            nod.removeAllChildren();

            var cardSprite = nod.getComponent(cc.Sprite);

            KQCard._loadCardFrame(this.cardSpriteAtlas, "public-pic-card-poker-back", cardSprite);
        }).bind(this));

        this.daoScoreLayouts.forEach((function (nod) {
            nod.node.active = false;
        }).bind(this));

        this.daoTitleNodes.forEach((function (nod) {
            nod.active = false;
        }).bind(this));

        if (this.TScoreLayout) this.TScoreLayout.node.active = false;

        if (this.TtitleNode) this.TtitleNode.active = false;

        this.unscheduleAllCallbacks();

        //console.log('执行了一遍清除定时器--------------------------------')

        if (this.TScoreLayout) this.TScoreLayout.node.stopAllActions();

        if (this.playTotalScore) this.playTotalScore.node.stopAllActions();
    },

    setCompareData: function setCompareData(user) {
        this._user = user;
        this._cardsInfo = user.cardInfo;
        var cardsInfo = user.cardInfo;
        this._lCScore = user.lCScore;
        var cards = cardsInfo.map(function (cardInfoItem) {
            return KQCard.cardsFromArray(cardInfoItem.cards);
        }).reduce(function (array, subCards) {
            return array.concat(subCards);
        }, []);

        var scores = [user.score1 || 0, user.score2 || 0, user.score3 || 0, user.lScore1 || 0, user.lScore2 || 0, user.lScore3 || 0];
        this.setCards(cards);
        this.setScores(scores);
    },

    //显示所有玩家的总分数
    showScoreResult: function showScoreResult() {
        if (!this._user) return;
        var scores = this._user.cScore;
        this.setScores([scores], [this.playTotalScore], true);
        this.playTotalScore.node.active = true;
        this.playTotalScore.node.opacity = 255;
        var x = this.playTotalScore.node.x;
        var y = this.playTotalScore.node.y;
        this.playTotalScore.node.runAction(cc.moveTo(0.8, cc.p(x, y + 30)));
        this.scheduleOnce((function () {
            this.playTotalScore.node.runAction(cc.fadeOut(0.2));
        }).bind(this), 0.6);
        this.scheduleOnce((function () {
            this.playTotalScore.node.y = y;
        }).bind(this), 1);
    },

    //显示三道分数
    showNextCompareScore: function showNextCompareScore(isContainExtra) {
        if (isContainExtra && this.TScoreLayout) {
            var scores1 = this._lCScore.splice(0, 1);
            if (scores1.length <= 0) return;
            this.setScores(scores1, [this.TScoreLayout], true);
            this.TtitleNode.active = true;
            this.TScoreLayout.node.active = true;

            var scaleTo11 = cc.scaleTo(0.3, 1.8);
            var scaleTo21 = cc.scaleTo(0.1, 1.1);
            var scaleTo31 = cc.scaleTo(0.1, 1.3);
            var scaleToSeq1 = cc.sequence(scaleTo11, scaleTo21, scaleTo31);
            this.TScoreLayout.node.runAction(scaleToSeq1);
        }

        if (this.daoScoreLayouts.length <= 0) return;
        if (!this._user.isContainExtra) {
            var index = this._compareIndex == 0 ? 1 : this._compareIndex;
            this.daoScoreLayouts[index - 1].node.active = true;
            this.daoScoreLayouts[index + 2].node.active = true;
            this.daoTitleNodes[index - 1].active = true;
        }

        var scores = this._lCScore.splice(0, 1);
        if (scores.length <= 0 && !this.TScoreLayout) return;
        this.setScores(scores, [this.TScoreLayout], true);
        this.TtitleNode.active = true;
        this.TScoreLayout.node.active = true;

        var scaleTo1 = cc.scaleTo(0.3, 1.8);
        var scaleTo2 = cc.scaleTo(0.1, 1.1);
        var scaleTo3 = cc.scaleTo(0.1, 1.3);
        var scaleToSeq = cc.sequence(scaleTo1, scaleTo2, scaleTo3);
        this.TScoreLayout.node.runAction(scaleToSeq);
    },

    // 下一个要比较的分数
    // 如果没有要比较的了，则返回 0
    nextCompareScore: function nextCompareScore() {
        if (!this._user) return 0;

        var data;
        if (this._user.isContainExtra) {
            data = this._cardsInfo[0];
            if (data) return data.type * 9000000000000000;
        } else {
            data = this._cardsInfo[this._compareIndex];
        }
        if (!data) return 0;
        return data.value;
    },

    setMaPai: function setMaPai(nodes, cardName) {
        if (cc.maPai == cardName) {

            var nodds = new cc.Node(); //创建一个节点对象

            nodds.addComponent(cc.Sprite); //添加精灵组件

            cc.loader.loadRes('play/desk/img_red5_1', cc.SpriteFrame, (function (err, spriteFrame) {

                if (err) {
                    cc.error(err.message || err);return;
                }

                var btnSprite1 = nodds.getComponent(cc.Sprite);

                btnSprite1.sizeMode = 0;

                btnSprite1.spriteFrame = spriteFrame;

                btnSprite1.node.width = nodes.width + 10;

                btnSprite1.node.height = nodes.height + 10;
            }).bind(this));

            nodes.addChild(nodds);
        }
    },

    setCards: function setCards(cards) {

        var cardSprites = this._allCardSprites();

        this.cardSpriteAtlas = this.node.parent.parent.getComponent('play').cardSpriteAtlas;

        cards.forEach((function (kqCard, index) {
            if (index >= cardSprites.length) {
                return;
            }
            cardSprites[index].node.removeAllChildren();

            cardSprites[index].node.getComponent(cc.Sprite).spriteFrame = "";

            var nodds1 = new cc.Node(); //创建一个节点对象

            nodds1.cardName = kqCard.cardName();

            nodds1.width = cardSprites[index].node.width;

            nodds1.height = cardSprites[index].node.height;

            nodds1.addComponent(cc.Sprite); //添加精灵组件

            var cardSprite = nodds1.getComponent('cc.Sprite');

            cardSprite.sizeMode = 0;

            var path = "public-pic-card-poker-" + kqCard.cardName();

            KQCard._loadCardFrame(this.cardSpriteAtlas, path, cardSprite);

            this.setMaPai(cardSprite.node, kqCard.cardName());

            cardSprites[index].node.addChild(nodds1);
        }).bind(this));

        var cards0 = cards.slice(0, 3);
        var cards1 = cards.slice(3, 8);
        var cards2 = cards.slice(8, 13);

        var cards11 = [cards0, cards1, cards2];
        //头道
        var typeName0 = KQCard.cardsType(cards0) + 1;
        typeName0 = typeName0 >= 10 ? typeName0 : "0" + typeName0;
        typeName0 = typeName0 == '04' ? '11' : typeName0;

        //中道
        var typeName1 = KQCard.cardsType(cards1) + 1;
        typeName1 = typeName1 >= 10 ? typeName1 : "0" + typeName1;
        typeName1 = typeName1 == '07' ? '22' : typeName1;

        //尾道
        var typeName2 = KQCard.cardsType(cards2) + 1;
        typeName2 = typeName2 >= 10 ? typeName2 : "0" + typeName2;

        cardSprites = cardSprites.map(function (i) {
            return i.node;
        });

        if (typeName0) KQCard._setGuiCard(0, 0, 3, typeName0, cards11, cardSprites, this.cardSpriteAtlas);
        if (typeName1) KQCard._setGuiCard(1, 3, 8, typeName1, cards11, cardSprites, this.cardSpriteAtlas);
        if (typeName2) KQCard._setGuiCard(2, 8, 13, typeName2, cards11, cardSprites, this.cardSpriteAtlas);
    },

    setScores: function setScores(scores) {
        var Layouts = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
        var is_WH = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

        if (!Layouts) {
            Layouts = this.daoScoreLayouts;
            if (Layouts.length <= 0) return;
        }

        scores.forEach((function (string, index) {

            var labels = Layouts[index];

            labels.node.removeAllChildren();

            var path = "play/CardTypeCombine/" + (Number(string) >= 0 ? "addNum" : "delNum");

            this._creatorNodes(labels.node, 10, path, '', is_WH);

            var strings = string > 0 ? string + "" : string * -1 + "";

            var stringAyy = strings.split("");

            for (var i = 0; i < stringAyy.length; i++) {

                var s = stringAyy[i];

                this._creatorNodes(labels.node, Number(s), path, '', is_WH);
            }

            labels.type = 1;
        }).bind(this));
    },

    _creatorNodes: function _creatorNodes(nodes, name, path, paths) {
        var w_h = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];

        var node = new cc.Node(); //创建一个节点对象

        node.addComponent(cc.Sprite); //添加精灵组件

        var btnSprite = node.getComponent(cc.Sprite);

        btnSprite.sizeMode = 0;

        btnSprite.node.width = 18;btnSprite.node.height = 23;
        //name = name + "";
        this._loadCardFrame(name, (function (spriteFrame) {

            btnSprite.spriteFrame = spriteFrame;

            if (w_h) {
                btnSprite.node.width = 30;btnSprite.node.height = 40;
            }
        }).bind(this), path, paths);

        nodes.addChild(node);
    },

    _setCardSpriteFrame: function _setCardSpriteFrame(indexs, nodes) {
        var cardsInfo = this._cardsInfo;
        var cards = cardsInfo.map(function (cardInfoItem) {
            return KQCard.cardsFromArray(cardInfoItem.cards);
        })[indexs] || [];

        this.cardSpriteAtlas = this.node.parent.parent.getComponent('play').cardSpriteAtlas;

        // cc.log(this._cardsInfo)
        // cc.log(cards)
        // cc.log('------555')

        cards.forEach((function (kqCard, index) {

            nodes.children[index].removeAllChildren();

            nodes.children[index].getComponent(cc.Sprite).spriteFrame = "";

            var nodds1 = new cc.Node(); //创建一个节点对象

            nodds1.cardName = kqCard.cardName();

            nodds1.width = nodes.children[index].width;

            if (nodes.parent.parent.name == "playSelf") {

                nodes.children[index].height = 130;

                nodds1.height = 130;
            } else {

                nodes.children[index].height = 115;

                nodds1.height = 115;

                //console.log(nodes);
                //console.log(nodds1);
            }

            nodds1.addComponent(cc.Sprite); //添加精灵组件

            var cardSprite = nodds1.getComponent('cc.Sprite');

            cardSprite.sizeMode = 0;

            var path = "public-pic-card-poker-" + kqCard.cardName();

            cardSprite.node.removeAllChildren();

            KQCard._loadCardFrame(this.cardSpriteAtlas, path, cardSprite);

            this.setMaPai(cardSprite.node, kqCard.cardName());

            nodes.children[index].addChild(nodds1);
        }).bind(this));

        var typeName = KQCard.cardsType(cards) + 1;

        typeName = typeName >= 10 ? typeName + "" : "0" + typeName;

        //头道
        if (indexs == 0) {
            typeName = typeName == '04' ? '11' : typeName;
        } else if (indexs == 1) {
            typeName = typeName == '07' ? '22' : typeName;
        }

        var cardSprites = nodes.children.map(function (i) {
            return i;
        });

        KQCard._setGuiCards(typeName, cards, cardSprites, this.cardSpriteAtlas);
    },

    showTouCards: function showTouCards() {
        if (this._user.isContainExtra == true) return;
        //console.log('开始执行一次定时动作--------------------------------')

        this.touLayoutBack.node.active = false;
        this._setCardSpriteFrame(0, this.touLayoutBack.node);
        this.scheduleOnce((function () {
            this.touLayout.node.active = false;
            this.touLayoutBack.node.active = true;
        }).bind(this), 0.7);

        this.touLayout.node.active = true;
        this.touLayout.node.scaleY = 0.7;
        this.scheduleOnce((function () {
            this.touLayout.node.scaleY = 1;
        }).bind(this), 0.02);

        var types = this._cardsInfo[this._compareIndex].type == 3 ? 333 : this._cardsInfo[this._compareIndex].type;
        AudioManager.instance.playCardType(this._user.sex, types);
        this._compareIndex += 1;
    },

    showZhongCards: function showZhongCards() {
        if (this._user.isContainExtra == true) return;

        this.zhongLayoutBack.node.active = false;
        this._setCardSpriteFrame(1, this.zhongLayoutBack.node);
        this.scheduleOnce((function () {
            this.zhongLayout.node.active = false;
            this.zhongLayoutBack.node.active = true;
        }).bind(this), 0.7);

        this.zhongLayout.node.active = true;
        this.zhongLayout.node.scaleY = 0.7;
        this.scheduleOnce((function () {
            this.zhongLayout.node.scaleY = 1;
        }).bind(this), 0.02);

        var types = this._cardsInfo[this._compareIndex].type == 6 ? 555 : this._cardsInfo[this._compareIndex].type;
        AudioManager.instance.playCardType(this._user.sex, types);
        this._compareIndex += 1;
    },

    showWeiCards: function showWeiCards() {
        //console.log('执行了一次尾道动画---------------')
        if (this._user.isContainExtra == true) return;
        //this._setCardSpriteFrame(1,this.zhongLayoutBack.node);
        this.weiLayoutBack.node.active = false;
        this._setCardSpriteFrame(2, this.weiLayoutBack.node);
        this.scheduleOnce((function () {
            this.weiLayout.node.active = false;
            this.weiLayoutBack.node.active = true;
        }).bind(this), 0.7);

        this.weiLayout.node.active = true;
        this.weiLayout.node.scaleY = 0.7;
        this.scheduleOnce((function () {
            this.weiLayout.node.scaleY = 1;
        }).bind(this), 0.02);

        AudioManager.instance.playCardType(this._user.sex, this._cardsInfo[this._compareIndex].type);
        this._compareIndex += 1;
    },

    showTeShuCards: function showTeShuCards(cards) {
        //let typeName = KQCard.cardsTypeName(cardsNames);
        this._daoLayoutBacks = [this.touLayoutBack, this.zhongLayoutBack, this.weiLayoutBack];

        var touCardSprites = this._cardSpritesWithLayout(this._daoLayoutBacks[0]);
        var zhongCardSprites = this._cardSpritesWithLayout(this._daoLayoutBacks[1]);
        var weiCardSprites = this._cardSpritesWithLayout(this._daoLayoutBacks[2]);
        var cardSprites = touCardSprites.concat(zhongCardSprites).concat(weiCardSprites);
        this.cardSpriteAtlas = this.node.parent.parent.getComponent('play').cardSpriteAtlas;
        this.scheduleOnce((function () {
            cards.forEach((function (kqCard, index) {
                if (index >= cardSprites.length) return;

                var cardSprite = cardSprites[index];

                var path = "public-pic-card-poker-" + kqCard.cardName();

                cardSprite.node.removeAllChildren();

                KQCard._loadCardFrame(this.cardSpriteAtlas, path, cardSprite);

                this.setMaPai(cardSprite.node, kqCard.cardName());
            }).bind(this));
            this._daoLayoutBacks.forEach((function (nodes) {
                nodes.node.active = true;
            }).bind(this));
            AudioManager.instance.playCardType(this._user.sex, this._cardsInfo[0].type);
        }).bind(this), 0.1);
    },

    showNextCards: function showNextCards() {
        var cardTypeCombine = this.node.parent.parent.getChildByName('CardTypeCombine').getComponent('CardTypeCombine');
        cardTypeCombine.reset();
        cardTypeCombine.node.active = false;

        this.touLayoutBack.node.parent.active = true;
        if (this._user.isContainExtra) {
            var cards = this._cardsInfo[0].cards.map(function (cardInfoItem) {
                return KQCard.cardsFromArray(cardInfoItem);
            }).reduce(function (array, subCards) {
                return array.concat(subCards);
            }, []);
            this.showTeShuCards(cards);
            this.showBaoDao(0, 0);
            this.baoDao.active = true;
            return;
        }
        this._daoLayouts = [this.touLayout, this.zhongLayout, this.weiLayout];
        this._daoLayouts.forEach(function (nodes) {
            nodes.node.active = false;
        });
        if (this._compareIndex == 0) {
            this.showBaoDao(0, 140);
            this.showTouCards();
        } else if (this._compareIndex == 1) {
            this.showBaoDao(1, 85);
            this.showZhongCards();
        } else if (this._compareIndex == 2) {
            this.showBaoDao(2, 34);
            this.showWeiCards();
        }

        this.baoDao.active = true;
        this.scheduleOnce((function () {
            this.baoDao.active = false;
        }).bind(this), 0.7);
    },

    showAllCards: function showAllCards() {
        if (!this._user) return;

        if (this._user.isContainExtra) {

            var cards = this._cardsInfo[0].cards.map(function (cardInfoItem) {
                return KQCard.cardsFromArray(cardInfoItem);
            }).reduce(function (array, subCards) {
                return array.concat(subCards);
            }, []);

            this.showTeShuCards(cards);

            //return;
        }

        if (!this._daoLayoutBacks) return;

        this.touLayoutBack.node.parent.active = true;

        this._daoLayoutBacks.forEach((function (nodes, index) {

            nodes.node.active = true;

            nodes.node.children.forEach(function (no) {
                no.active = true;
            });

            this._setCardSpriteFrame(index, nodes.node);

            if (this.TScoreLayout) this.daoTitleNodes[index].active = true;
        }).bind(this));

        if (!this.TScoreLayout) return;

        this.daoScoreLayouts.forEach((function (nodes) {

            nodes.node.active = true;
        }).bind(this));

        this.setScores([this._user.cScore], [this.TScoreLayout], true);

        this.TtitleNode.active = true;

        this.TScoreLayout.node.active = true;
    },

    showBaoDao: function showBaoDao(index, positonY) {
        var cardsInfo = this._cardsInfo;
        var cardType = cardsInfo.map(function (cardInfoItem) {
            return cardInfoItem.type;
        });

        var typeName0 = cardType[index] + 1;
        typeName0 = typeName0 >= 10 ? typeName0 : "0" + typeName0;
        if (index == 0) typeName0 = typeName0 == '04' ? '11' : typeName0;
        if (index == 1) typeName0 = typeName0 == '07' ? '22' : typeName0;

        if (cardType[index] == 10) typeName0 = '15'; //特殊牌
        if (cardType[index] == 11) typeName0 = '14';
        if (cardType[index] == 12) typeName0 = '16';
        if (cardType[index] == 18) typeName0 = '25';
        if (cardType[index] == 19) typeName0 = '26';

        var path = this._user.isContainExtra ? "game-right_specia" : "game-poker_type";

        this._loadCardFrame(typeName0, (function (spriteFrame) {
            var btnSprites1 = this.baoDao.getComponent(cc.Sprite);
            btnSprites1.spriteFrame = spriteFrame;
        }).bind(this), "play/CardTypeCombine/game_txt", path);
        this.baoDao.y = positonY;
    },

    _loadCardFrame: function _loadCardFrame(cardName, callback) {
        var path = arguments.length <= 2 || arguments[2] === undefined ? "play/CardTypeCombine/pockList" : arguments[2];
        var paths = arguments.length <= 3 || arguments[3] === undefined ? "public-pic-card-poker-" : arguments[3];

        cc.loader.loadRes(path, cc.SpriteAtlas, (function (err, atlas) {
            if (err) {
                cc.error(err);
                return;
            }
            cardName = cardName + "";
            cardName = this._cardFullName(cardName, paths);
            var frame = atlas.getSpriteFrame(cardName);
            callback(frame);
        }).bind(this));
    },

    _cardFullName: function _cardFullName(cardShortName, paths) {
        if (!paths) return cardShortName;
        var cardName = cardShortName;
        if (!cardName.startsWith(paths)) {
            cardName = paths + cardName;
        }
        return cardName;
    },

    _clearCards: function _clearCards() {
        this._clearLayoutCards(this.touLayout);
        this._clearLayoutCards(this.zhongLayout);
        this._clearLayoutCards(this.weiLayout);
    },

    _clearLayoutCards: function _clearLayoutCards(layout) {
        this._cardSpritesWithLayout(layout).forEach(function (sprite) {
            sprite.spriteFrame = null;
        });
    },

    _cardSpritesWithLayout: function _cardSpritesWithLayout(layout) {
        var node = layout.node;
        return node.children.map(function (node) {
            return node.getComponent('cc.Sprite');
        });
    },

    _allCardSprites: function _allCardSprites() {
        var touCardSprites = this._cardSpritesWithLayout(this.touLayout);
        var zhongCardSprites = this._cardSpritesWithLayout(this.zhongLayout);
        var weiCardSprites = this._cardSpritesWithLayout(this.weiLayout);
        var result = touCardSprites.concat(zhongCardSprites).concat(weiCardSprites);
        return result;
    }

});

cc._RFpop();
},{"AudioManager":"AudioManager","KQCard":"KQCard","KQCardResHelper":"KQCardResHelper"}],"Countdown":[function(require,module,exports){
"use strict";
cc._RFpush(module, '6406dyBk8tKVrlJ1+mg7cLt', 'Countdown');
// scripts\Pefabs\Countdown.js

cc.Class({
    "extends": cc.Component,

    properties: {
        labelTime: cc.Label,
        //timeNode: cc.Node,

        _callback: null
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.labelTime.string = "0";
    },

    /**
     * 开始倒计时
     * 
     * @param  {Number} time 时长
     * @param  {Function} callback 倒计时的回调
     */
    startCountdown: function startCountdown(time, callback) {
        this.stop();
        this._callback = callback;

        this.node.active = true;
        this.labelTime.string = "" + time;
        this.schedule(this._countDown, 1, time);
        this.getComponent("time").setTime(time * 0.5);
    },

    stop: function stop() {
        this.unschedule(this._countDown);
        this.node.active = false;

        if (this._callback) {
            var isTimeout = Number(this.labelTime.string) <= 0;
            var callback = this._callback;
            this._callback = null;
            callback(isTimeout);
        }

        this._callback = null;
    },

    _countDown: function _countDown() {
        var time = Number(this.labelTime.string || "0");
        time = time - 1;

        if (time <= 0) {
            this.stop();
        }

        this.labelTime.string = String(time);
    }

});

cc._RFpop();
},{}],1:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],2:[function(require,module,exports){
(function (global){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"base64-js":1,"ieee754":3,"isarray":4}],3:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],4:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],"GameResult":[function(require,module,exports){
"use strict";
cc._RFpush(module, '6a3cdd+2shGlZ+jeI3trSsB', 'GameResult');
// scripts\Play\GameResult.js

var KQCard = require('KQCard');
var AudioManager = require('AudioManager');

var ResultStatus = {
  WIN: 2,
  DRAW: 1,
  LOSE: 0
};

var GameResult = cc.Class({
  'extends': cc.Component,

  properties: {
    winNode: cc.Node,
    loseNode: cc.Node,
    drawNode: cc.Node,
    contentNode: cc.Node,

    resultItems: [cc.Node],

    _deskInfo: null,
    _userId: null,
    _closeCallback: null
  },

  // use this for initialization
  onLoad: function onLoad() {
    this._hideResultItems();
  },

  showResults: function showResults(deskInfo, currentUserId) {
    this._deskInfo = deskInfo;
    this._userId = currentUserId;

    var resultStatus = this._resultStatus();
    this.contentNode.active = true;
    this.winNode.active = resultStatus == ResultStatus.WIN;
    this.drawNode.active = resultStatus == ResultStatus.DRAW;
    this.loseNode.active = resultStatus == ResultStatus.LOSE;

    if (this.winNode.active) {
      AudioManager.instance.playWin();
    } else if (this.loseNode.active) {
      AudioManager.instance.playLose();
    }

    this.node.getComponent('alert').alert();
    this.node.getComponent('alert').setDismissCallback((function () {
      this._closeCallback;
    }).bind(this));

    var playerInfos = deskInfo.players.sort(function (p1, p2) {
      return p2.cScore - p1.cScore;
    });
    var itemComps = this.resultItems.map(function (node) {
      return node.getComponent('ResultItem');
    });
    itemComps.forEach((function (itemComp, index) {
      itemComp.node.active = index < playerInfos.length;
      if (!itemComp.node.active) {
        return;
      }

      var user = playerInfos[index];
      itemComp.updateWithPlayerInfo(user, deskInfo.isRandomDesk);
      var cards = this._cardsFromUser(user);
      itemComp.setCards(cards);
    }).bind(this));
  },

  setCloseCallback: function setCloseCallback(callback) {
    this._closeCallback = callback;
  },

  _cardsFromUser: function _cardsFromUser(user) {
    var cards = user.cardInfo.map(function (cardInfoItem) {
      return KQCard.cardsFromArray(cardInfoItem.cards);
    }).reduce(function (array, subCards) {
      return array.concat(subCards);
    }, []);

    return cards;
  },

  _hideResultItems: function _hideResultItems() {
    this.resultItems.forEach(function (node) {
      node.acitve = false;
    });
  },

  _resultStatus: function _resultStatus() {
    var playerInfos = this._deskInfo.players;
    var user = playerInfos.find((function (user) {
      return user.id == this._userId;
    }).bind(this));

    var score = user.cScore;
    if (this._deskInfo.isRandomDesk) {
      // 如果是随机场的话，应该用钻石来判断输赢
      score = user.diamond;
    }

    if (score > 0) {
      return ResultStatus.WIN;
    } else if (score < 0) {
      return ResultStatus.LOSE;
    }

    return ResultStatus.DRAW;
  }
});

module.exports = GameResult;

cc._RFpop();
},{"AudioManager":"AudioManager","KQCard":"KQCard"}],"GetCardPointsSameCount":[function(require,module,exports){
"use strict";
cc._RFpush(module, '64665arSbVGtqTVZeISv/TD', 'GetCardPointsSameCount');
// scripts\KQCard\GetCardPointsSameCount.js

/*#####*/
//��������һ���������ڵ���ͬ�������Ƶ�����
var GetCardPointsSameCount = function GetCardPointsSameCount(cards) {
    this.cardNumbers = {};
    for (var i in cards) {
        var s;
        if (typeof cards[i].number == 'undefined') {
            s = cards[i].point;
        } else {
            s = cards[i].number;
        }
        if (this.cardNumbers[s]) {
            this.cardNumbers[s]++;
        } else {
            this.cardNumbers[s] = 1;
        }
        //cc.log(this.cardNumbers[cards[i].number])
        //cc.log(cards)
        //cc.log(cards[i].number)
        //cc.log('---7')
    }
    return this.cardNumbers;
};

module.exports = GetCardPointsSameCount;

cc._RFpop();
},{}],"Invit":[function(require,module,exports){
"use strict";
cc._RFpush(module, '37d962bf0NPxaQIYUcZDwR3', 'Invit');
// scripts\Invit.js

var Socket = require('socket');
cc.Class({
  'extends': cc.Component,

  properties: {
    labelNumbers: [cc.Label],
    callbackJoinRoom: null
  },

  // use this for initialization
  onLoad: function onLoad() {
    this.clickClear();
  },

  clickNumber: function clickNumber(event, number) {
    var label = this._lastEmptyLabel();
    if (label) {
      label.string = number;
    } else {
      return;
    }
    var isComplete = this._lastEmptyLabel() == null;
    var inviteNumber = this._roomNumber();
    if (inviteNumber.length == 6) {
      this.callbackJoinRoom = inviteNumber;
    }
  },

  sendCode: function sendCode() {
    //发送邀请码
    var userId = Socket.instance.userInfo.id;
    var inviteNumber = this.callbackJoinRoom;
    console.log(inviteNumber, "------------------------");
    if (inviteNumber.length == 6) {
      Socket.sendInviteCode(inviteNumber, userId);
      this.callbackJoinRoom = ''; //清空邀请码
    }
  },

  clickClear: function clickClear() {
    this.callbackJoinRoom = '';
    this.labelNumbers.forEach(function (label) {
      label.string = "";
    });
  },

  clickDeleteOne: function clickDeleteOne() {
    var label = this._lastNumberLabel();
    if (label) {
      label.string = "";
    }
  },

  _lastEmptyLabel: function _lastEmptyLabel() {
    for (var index in this.labelNumbers) {
      var label = this.labelNumbers[index];
      if (label.string == null || label.string.length <= 0) {
        return label;
      }
    }
    return null;
  },

  _lastNumberLabel: function _lastNumberLabel() {
    for (var index = this.labelNumbers.length - 1; index >= 0; --index) {
      var label = this.labelNumbers[index];
      if (label.string && label.string.length > 0) {
        return label;
      }
    }

    return null;
  },

  _roomNumber: function _roomNumber() {
    return this.labelNumbers.reduce(function (roomNumber, label) {
      return roomNumber + (label.string || "");
    }, "");
  }
});

cc._RFpop();
},{"socket":"socket"}],"KQCardColorsHelper":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'cf1deKQQ4NMMYVV+7xEr9Jf', 'KQCardColorsHelper');
// scripts\KQCard\KQCardColorsHelper.js

// 牌花色帮助类
// 用于计算一个牌数组的花色相同的牌的张数
var KQCardColorsHelper = function KQCardColorsHelper(cards) {
  this.colorNumber = {};

  cards.forEach((function (card) {
    var color = card.color;
    var number = this.colorNumber[color] || 0;
    this.colorNumber[color] = number + 1;
  }).bind(this));
};

// 相同花色的牌的最大数量
KQCardColorsHelper.prototype.maxNumber = function () {
  var result = 0;
  for (var prop in this.colorNumber) {
    var number = this.colorNumber[prop];
    result = Math.max(number, result);
  }

  return result;
};

module.exports = KQCardColorsHelper;

cc._RFpop();
},{}],"KQCardFindTypeExtension":[function(require,module,exports){
"use strict";
cc._RFpush(module, '54a95JOLVRACIP91XEFodqF', 'KQCardFindTypeExtension');
// scripts\KQCard\KQCardFindTypeExtension.js

var KQCard = require('KQCard');
var ArrayExtension = require('ArrayExtension');
var KQCardPointsHelper = require('KQCardPointsHelper');

module.exports = {};

// 寻找 cardModes 中的 对子
// 这会返回 对子 的索引数组
// 如：[[1, 3], [4, 5]]
KQCard.findDuiZi = function (cardModes) {
  var sDuiZiIndexs = KQCard.findSanTiao(cardModes) || [];
  var result = KQCard._findPointLength(cardModes, 2) || [];
  if (result.length < 2) {
    if (sDuiZiIndexs.length > 0) {
      sDuiZiIndexs.forEach(function (indexs) {
        var s1 = [indexs[0], indexs[1]];
        //var s2 = [indexs[1],indexs[2]];
        //result.push(s2);
        result.push(s1);
      });
    }
    var tresult = KQCard.findGuiPai(cardModes, 2);
    for (var i = 0; i < tresult.length; i++) {
      result.push(tresult[i]);
    }
  }

  result = KQCard.repeat(result);

  return result.length > 0 ? result : [];
};

KQCard._findPointLength = function (cardModes, length) {
  if (cardModes.length < length) {
    return [];
  }

  var obj = cardModes.reduce(function (obj, card, index) {
    var pointIndexs = obj[card.point] || [];
    obj[card.point] = pointIndexs;
    pointIndexs.push(index);
    return obj;
  }, {});

  var result = [];
  for (var prop in obj) {
    var pointIndexs = obj[prop];
    // if (pointIndexs.length == length) {
    //   pointIndexs.sort(function (n1, n2) {
    //     return n1 - n2;
    //   });
    //   result.push(pointIndexs);
    // }
    while (pointIndexs.length >= length && length != 0) {
      //有多的分割多个数组
      var splices = pointIndexs.splice(0, length);
      if (splices.length >= length) {
        splices.sort(function (n1, n2) {
          return n1 - n2;
        });
        result.push(splices);
      }
    }
  }

  result.sort(function (arr1, arr2) {
    var n1 = arr1[0];
    var n2 = arr2[0];
    return n2 - n1;
  });
  return result.length > 0 ? result : [];
};

// 找 两对 的索引数组
// 如：[[1, 2, 3, 4], [5, 6, 7, 8]]
KQCard.findLiaDui = function (cardModes) {
  var duiZiIndexs = KQCard.findDuiZi(cardModes) || [];
  var duiZiIndex = KQCard.findGuiPai(cardModes, 2) || [];

  if (duiZiIndexs.length < 1 && duiZiIndex.length > 0) {
    duiZiIndex.forEach(function (indexs) {
      duiZiIndexs.unshift(indexs);
    });
  }
  if (duiZiIndexs.length < 2) {
    return [];
  }

  var result = [];
  for (var i = 0; i < duiZiIndexs.length; ++i) {
    for (var j = i + 1; j < duiZiIndexs.length; ++j) {
      if (result.length < 10) {
        var pre = duiZiIndexs[i];
        var next = duiZiIndexs[j];
        var s = pre.concat(next);
        var newS = [];
        for (var q = 0; q < s.length; q++) {
          if (newS.indexOf(s[q]) == -1) {
            newS.push(s[q]);
          } else {
            break;
          }
        }
        if (newS.length == 4) {
          newS.sort(function (n1, n2) {
            return n1 - n2;
          });
          result.unshift(newS);
        }
      } else {
        break;
      }
    }
  }
  result = KQCard.repeat(result);
  if (result.length > 6) {
    result = result.slice(0, 6);
  }
  return result;
};

// 找三条
// 如：[[1, 2, 3]];
KQCard.findSanTiao = function (cardModes) {
  if (cardModes.length < 3) {
    return [];
  }
  var result = KQCard._findPointLength(cardModes, 3) || [];
  //for(var q =0;q<result.length;q++){
  //  var indexs = result[q][0];
  //  if(cardModes[indexs].point >= 20){
  //    result.splice(q,1);
  //  }
  //}
  if (result.length < 2) {
    var tieZhiIndexsArray = KQCard.findTieZhi(cardModes);
    if (tieZhiIndexsArray.length > 0) {
      tieZhiIndexsArray.forEach(function (indexs) {
        //let sanTiaoIndexs1 = [indexs[1], indexs[2], indexs[3]];
        //let sanTiaoIndexs2 = [indexs[0], indexs[1], indexs[3]];
        //let sanTiaoIndexs3 = [indexs[0], indexs[2], indexs[3]];
        var sanTiaoIndexs0 = [indexs[0], indexs[1], indexs[2]];
        result.push(sanTiaoIndexs0);
        //result.unshift(sanTiaoIndexs1);
        //result.unshift(sanTiaoIndexs2);
        //result.unshift(sanTiaoIndexs3);
      });
    }
    var tresult = KQCard.findGuiPai(cardModes, 3);
    for (var i = 0; i < tresult.length; i++) {
      result.push(tresult[i]);
    }
  }
  /*if(result.length < 1){
    // 铁支是包含三条的
    let tieZhiIndexsArray = KQCard.findTieZhi(cardModes);
    if (tieZhiIndexsArray) {
      tieZhiIndexsArray.forEach(function(indexs) {
        //let sanTiaoIndexs1 = [indexs[1], indexs[2], indexs[3]];
        //let sanTiaoIndexs2 = [indexs[0], indexs[1], indexs[3]];
        //let sanTiaoIndexs3 = [indexs[0], indexs[2], indexs[3]];
        let sanTiaoIndexs0 = [indexs[0], indexs[1], indexs[2]];
        result.push(sanTiaoIndexs0);
        //result.unshift(sanTiaoIndexs1);
        //result.unshift(sanTiaoIndexs2);
        //result.unshift(sanTiaoIndexs3);
      });
    }
  }*/

  //if(result.length > 10){
  //  result = result.slice(0,10);
  //}

  result = KQCard.repeat(result);
  return result.length > 0 ? result : [];
};

// 找同花顺
/*KQCard.findTongHuaShun = function (cardModes, length = 5) {
  if (cardModes.length < length) {
    return [];
  }
  let result = [];
  var sanShunZi = KQCard.sanShunZi1(cardModes,length);
  if(sanShunZi[0] == null){
    return false;
  }
  for(var i=0;i<sanShunZi[0].length;i++) {
    var s = sanShunZi[0][i];
    if (KQCard.isTongHuaShun(s, length)) {
      result.unshift(sanShunZi[1][i]);

    }
  }
  if(result.length > 0){
    return result
  }else{
    return KQCard.findTongHuaShun1(cardModes);
  }
};*/
KQCard.findTongHuaShun = function (cards) {
  var length = arguments.length <= 1 || arguments[1] === undefined ? 5 : arguments[1];

  if (cards.length < length) {
    return [];
  }
  cards = Array.from(cards);
  var colorS = []; //黑桃
  var colorH = []; //红心
  var colorC = []; //梅花
  var colorD = []; //方块
  var pointS = []; //黑桃
  var pointH = []; //红心
  var pointC = []; //梅花
  var pointD = []; //方块
  for (var i = 0; i < cards.length; i++) {
    if (cards[i].color == '4') {
      if (pointS.indexOf(cards[i].point) == -1) {
        pointS.push(cards[i].point);
        colorS.push(cards[i]);
      }
    } else if (cards[i].color == '3') {
      if (pointH.indexOf(cards[i].point) == -1) {
        pointH.push(cards[i].point);
        colorH.push(cards[i]);
      }
    } else if (cards[i].color == '2') {
      if (pointC.indexOf(cards[i].point) == -1) {
        pointC.push(cards[i].point);
        colorC.push(cards[i]);
      }
    } else if (cards[i].color == '1') {
      if (pointD.indexOf(cards[i].point) == -1) {
        pointD.push(cards[i].point);
        colorD.push(cards[i]);
      }
    }
  }

  var color = [colorS, colorH, colorC, colorD];
  var colorSum = []; //总共有几种花色 [5,3,0....]
  for (var i = 0; i < color.length; i++) {
    if (color[i].length >= 5) {
      color[i].sort(function (a1, a2) {
        return a1.point - a2.point;
      });
      colorSum.push(color[i]);
    }
  }
  var result = [];
  for (var i = 0; i < colorSum.length; i++) {
    var s = colorSum[i];
    for (var start = 0; start + 5 <= s.length; ++start) {
      var subCards = s.slice(start, start + 5);
      if (KQCard.isTongHuaShun(subCards)) {
        (function () {
          var indexs = [];
          subCards.forEach(function (ca) {
            for (var q = 0; q < cards.length; q++) {
              var r = cards[q];
              if (r === ca) {
                indexs.push(q);
                break;
              }
            }
          });
          indexs.sort(Array.sortByPoint);
          result.unshift(indexs);
        })();
      }
    }
  }

  if (result.length > 0) {
    return result;
  } else {
    var convertedCards = KQCard._convertOneToA1(cards);
    if (cards === convertedCards) {
      cards.forEach(function (adfs) {
        if (adfs.point == 14) {
          adfs.point = 1;
          adfs.scores = 1;
        }
      });
      return KQCard.findTongHuaShun20(cards);
    }
    return KQCard.findTongHuaShun(convertedCards);
  }
  //return result.length > 0 ? result : null;
};
KQCard.findTongHuaShun20 = function (card) {
  var length = arguments.length <= 1 || arguments[1] === undefined ? 5 : arguments[1];

  if (card.length < length) {
    return false;
  }
  var card20 = KQCard.contain20(card) || [];
  if (card20.length <= 0) {
    return false;
  }
  var cards = card.kq_excludes(card20);

  cards = Array.from(cards);
  var colorS = []; //黑桃
  var colorH = []; //红心
  var colorC = []; //梅花
  var colorD = []; //方块
  var pointS = []; //黑桃
  var pointH = []; //红心
  var pointC = []; //梅花
  var pointD = []; //方块
  for (var i = 0; i < cards.length; i++) {
    if (cards[i].color == '4') {
      if (pointS.indexOf(cards[i].point) == -1) {
        pointS.push(cards[i].point);
        colorS.push(cards[i]);
      }
    } else if (cards[i].color == '3') {
      if (pointH.indexOf(cards[i].point) == -1) {
        pointH.push(cards[i].point);
        colorH.push(cards[i]);
      }
    } else if (cards[i].color == '2') {
      if (pointC.indexOf(cards[i].point) == -1) {
        pointC.push(cards[i].point);
        colorC.push(cards[i]);
      }
    } else if (cards[i].color == '1') {
      if (pointD.indexOf(cards[i].point) == -1) {
        pointD.push(cards[i].point);
        colorD.push(cards[i]);
      }
    }
  }

  var color = [colorS, colorH, colorC, colorD];
  var colorSum = []; //总共有几种花色 [5,3,0....]
  for (var i = 0; i < color.length; i++) {
    if (color[i].length >= parseInt(5 - card20.length)) {
      color[i].sort(function (a1, a2) {
        return a1.point - a2.point;
      });
      colorSum.push(color[i]);
    }
  }
  //cc.log(colorSum)

  var result = [];
  for (var i = 0; i < colorSum.length; i++) {
    var s = colorSum[i];
    for (var j = 1; j <= card20.length; ++j) {
      var num = 5 - j;
      for (var start = 0; start + num <= s.length; ++start) {
        var subCards = s.slice(start, start + num);
        var bool = parseInt(subCards[num - 1]['scores']) - parseInt(subCards[0]['scores']) < 5;
        if (bool) {
          var newCard20;

          (function () {
            var indexs = [];
            newCard20 = card20.slice(0, j);

            subCards = subCards.concat(newCard20);
            subCards.forEach(function (ca) {
              for (var q = 0; q < card.length; q++) {
                var r = card[q];
                if (r === ca) {
                  indexs.push(q);
                  break;
                }
              }
            });
            indexs.sort(Array.sortByNumber);

            result.unshift(indexs);
          })();
        }
      }
    }
  }
  //cc.log(result)
  //cc.log('--------357')
  if (result.length > 0) {
    return result;
  } else {
    var convertedCards = KQCard._convertOneToA1(card);
    if (card === convertedCards) {
      return [];
    }
    return KQCard.findTongHuaShun20(convertedCards);
  }
  //return result.length > 0 ? result : null;
};

// 找铁支
// 如：[[1,2,3,4]]
KQCard.findTieZhi = function (cardModes) {
  var result = KQCard._findPointLength(cardModes, 4);
  if (result.length > 0) {
    return result;
  }
  result = [];
  // 五同是包含铁支的
  var wuTongIndexsArray = KQCard.findWuTong(cardModes);
  if (wuTongIndexsArray) {
    wuTongIndexsArray.forEach(function (indexs) {
      var tieZhiIndexs0 = [indexs[0], indexs[1], indexs[2], indexs[3]];
      var tieZhiIndexs1 = [indexs[0], indexs[1], indexs[2], indexs[4]];
      var tieZhiIndexs2 = [indexs[0], indexs[1], indexs[3], indexs[4]];
      var tieZhiIndexs3 = [indexs[0], indexs[2], indexs[3], indexs[4]];
      var tieZhiIndexs4 = [indexs[1], indexs[2], indexs[3], indexs[4]];
      result.push(tieZhiIndexs0);
      result.push(tieZhiIndexs1);
      result.push(tieZhiIndexs2);
      result.push(tieZhiIndexs3);
      result.push(tieZhiIndexs4);
    });
  }
  if (result.length > 10) {
    result = result.slice(0, 10);
  }
  result = KQCard.repeat(result);
  return result.length > 0 ? result : KQCard.findGuiPai(cardModes, 4);
};
//找五同
KQCard.findWuTong = function (cardModes) {
  if (cardModes.length < 5) {
    return [];
  }
  var result = this._findPointLength(cardModes, 5) || [];
  return result.length > 0 ? result : KQCard.findGuiPai(cardModes, 5);
};
// 找顺子
// 如：[[1, 2, 3, 4, 5]]
KQCard.findShunZi = function (cardModes) {
  var length = arguments.length <= 1 || arguments[1] === undefined ? 5 : arguments[1];

  if (cardModes.length < length) {
    return [];
  }
  if (typeof cardModes[0]['point'] == "undefined") {
    cardModes = KQCard.cardsFromArray(cardModes);
  }
  // 先根据点数去重
  var uniqueCards = cardModes.unique(function (card1, card2) {
    return card1.point == card2.point;
  });
  uniqueCards.sort(KQCard.sortByPoint);

  // 如果有 A，则在最后添加 14
  var cardA = cardModes.find(function (card) {
    return card.point == 1;
  });
  if (cardA) {
    var cardAPlus = new KQCard(cardA);
    cardAPlus.point = 14;
    uniqueCards.push(cardAPlus);
  }

  var result = [];

  // 由于点数是唯一且升序，只需要依次遍历判断是否是顺子即可
  for (var start = 0; start + length <= uniqueCards.length; ++start) {
    var subCards = uniqueCards.slice(start, start + length);
    if (KQCard.isShunZi(subCards, length)) {
      (function () {
        var indexs = [];
        subCards.forEach(function (card) {
          var index = cardModes.findIndex(function (originCard) {

            if (card.point == 14) {
              return originCard.point == 1;
            }

            return card === originCard;
          });
          indexs.push(index);
        });

        indexs.sort(Array.sortByNumber);
        result.unshift(indexs);
      })();
    }
  }

  // 处理点数重复的情况
  // 比如 A A K Q J 10 这种
  var repeatIndexsArray = KQCard._findRepeatPointIndexsArray(result, cardModes);
  repeatIndexsArray.forEach(function (indexs) {
    result.unshift(indexs);
  });

  result.sort(function (arr1, arr2) {
    return arr1[0] - arr2[0];
  });

  return result.length > 0 ? result : KQCard.findShunZi20(cardModes);
};
KQCard.findShunZi20 = function (cardModes) {
  var length = arguments.length <= 1 || arguments[1] === undefined ? 5 : arguments[1];

  if (cardModes.length < length) {
    return [];
  }
  var card20 = KQCard.contain20(cardModes);
  if (card20.length <= 0) {
    return [];
  }
  var cards = cardModes.kq_excludes(card20);
  // 先根据点数去重
  var newArr = [];
  var newArrs = [];
  for (var i = 0; i < cards.length; i++) {
    if (newArrs.indexOf(cards[i]['point']) == -1) {
      newArr.push(cards[i]);
      newArrs.push(cards[i].point);
    }
  }

  newArr.sort(function (n1, n2) {
    return n1.point - n2.point;
  });
  var result = [];
  for (var j = 1; j <= card20.length; ++j) {
    var num = length - j;
    for (var start = 0; start + num <= newArr.length; ++start) {
      var subCards = newArr.slice(start, start + num);
      var bool = parseInt(subCards[num - 1]['point']) - parseInt(subCards[0]['point']) < length;
      if (bool) {
        var newCard20;

        (function () {
          var indexs = [];
          newCard20 = card20.slice(0, j);

          subCards = subCards.concat(newCard20);
          subCards.forEach(function (card) {
            for (var q = 0; q < cardModes.length; q++) {
              var r = cardModes[q];
              if (r === card) {
                indexs.push(q);
                break;
              }
            }
          });

          indexs.sort(Array.sortByNumber);
          result.unshift(indexs);
        })();
      }
    }
  }

  if (result.length > 0) {
    return result;
  } else {
    var convertedCards = KQCard._convertOneToA1(cardModes);
    if (cardModes === convertedCards) {
      return false;
    }
    return KQCard.findShunZi20(convertedCards);
  }
};
KQCard._findRepeatPointIndexsArray = function (indexsArray, originCards) {
  var repeatIndexsArray = [];
  indexsArray.forEach(function (indexs) {
    var cards = indexs.map(function (index) {
      return originCards[index];
    });

    cards.forEach(function (card, index) {
      var originIndex = originCards.findIndex(function (originCard) {
        if (typeof card == 'undefined') {
          return;
        }
        if (originCard !== card && originCard.point == card.point) {
          return true;
        }
        return false;
      });

      if (originIndex < 0) {
        return;
      }

      var repeatIndexs = indexs.slice();
      repeatIndexs[index] = originIndex;
      repeatIndexsArray.push(repeatIndexs);
    });
  });

  return repeatIndexsArray;
};

// 找同花
// 如：[[1, 2, 3, 4, 5]]
KQCard.findTongHua = function (cardModes) {
  var length = arguments.length <= 1 || arguments[1] === undefined ? 5 : arguments[1];

  if (cardModes.length < length) {
    return [];
  }

  var cards = Array.from(cardModes);
  cards.sort(KQCard.sortByColor);

  var result = [];
  for (var start = 0; start + length <= cards.length; ++start) {
    var subCards = cards.slice(start, start + length);
    if (KQCard.isTongHua(subCards, length)) {
      (function () {
        var indexs = [];
        subCards.forEach(function (card) {
          var index = cardModes.findIndex(function (originCard) {
            return card === originCard;
          });
          indexs.push(index);
        });
        //indexs = indexs.length > 5 ? indexs.splice(1,1) : indexs;
        indexs.sort(Array.sortByNumber);
        result.unshift(indexs);
      })();
    }
  }
  return result.length > 0 ? result : KQCard.findTongHua20(cardModes);
};
KQCard.findTongHua20 = function (cardModes) {
  if (cardModes.length < 5) {
    return [];
  }
  var card20 = KQCard.contain20(cardModes);
  if (card20.length <= 0) {
    return [];
  }
  var cards = cardModes.kq_excludes(card20);
  // 先根据点数去重
  cards.sort(KQCard.sortByColor);

  var result = [];
  for (var j = 1; j <= card20.length; ++j) {
    var num = 5 - j;
    for (var start = 0; start + num <= cards.length; ++start) {
      var subCards = cards.slice(start, start + num);
      if (KQCard.isTongHua(subCards, num)) {
        var newCard20;

        (function () {
          var indexs = [];
          newCard20 = card20.slice(0, j);

          subCards = subCards.concat(newCard20);
          subCards.forEach(function (card) {
            for (var q = 0; q < cardModes.length; q++) {
              var r = cardModes[q];
              if (r === card) {
                indexs.push(q);
                break;
              }
            }
          });

          indexs.sort(Array.sortByNumber);
          result.unshift(indexs);
        })();
      }
    }
  }

  return result.length > 0 ? result : [];
};

KQCard.findHuLu = function (cardModes) {
  var length = 5;
  if (cardModes.length < length) {
    return [];
  }

  var p_3 = KQCard.findSanTiao(cardModes);
  var p_4 = KQCard.findTieZhi(cardModes);
  var p2 = KQCard.findDuiZi(cardModes) || [];
  //var p_3 =  this._findPointLength(cardModes, 3) || [];
  //var p_4 = this._findPointLength(cardModes, 4) || [];
  //var p2 = this._findPointLength(cardModes, 2) || [];
  if (p2.length <= 0) {
    if (p_3) {
      p_3.forEach(function (indexs) {
        var sanTiaoIndexs0 = [indexs[0], indexs[1]];
        //let sanTiaoIndexs1 = [indexs[0], indexs[2]];
        var sanTiaoIndexs3 = [indexs[1], indexs[2]];
        p2.push(sanTiaoIndexs0);
        //p2.unshift(sanTiaoIndexs1);
        p2.push(sanTiaoIndexs3);
      });
    }

    if (p_4) {
      p_4.forEach(function (indexs) {
        var sanTiaoIndexs0 = [indexs[0], indexs[1]];
        //let sanTiaoIndexs1 = [indexs[0], indexs[2]];
        //let sanTiaoIndexs2 = [indexs[0], indexs[3]];
        //let sanTiaoIndexs3 = [indexs[1], indexs[2]];
        //let sanTiaoIndexs4 = [indexs[1], indexs[3]];
        var sanTiaoIndexs6 = [indexs[2], indexs[3]];
        p2.push(sanTiaoIndexs0);
        //p2.unshift(sanTiaoIndexs1);
        //p2.unshift(sanTiaoIndexs2);
        //p2.unshift(sanTiaoIndexs3);
        //p2.unshift(sanTiaoIndexs4);
        p2.push(sanTiaoIndexs6);
      });
    }
  }

  if (p2 == null || p_3 == null) {
    return [];
  }
  var tresult = [];
  p2.forEach(function (i_3) {
    var s = i_3;
    p_3.forEach(function (i_2) {
      s = i_3.concat(i_2);
      for (var i = 0; i < s.length - 1; i++) {
        var index = s[i];
        for (var j = i + 1; j < s.length; j++) {
          if (index == s[j]) {
            s = null;
            break;
          }
        }
        if (s == null) {
          break;
        }
      }
      if (s !== null) {
        tresult.unshift(s);
      }
    });
  });
  if (tresult.length > 10) {
    tresult = tresult.slice(0, 10);
  }
  return tresult.length > 0 ? tresult : KQCard.findHuLu20(cardModes);
};
KQCard.findHuLu20 = function (cardModes) {
  var length = 5;
  if (cardModes.length < length) {
    return [];
  }
  var card20 = KQCard.contain20(cardModes) || [];
  if (card20.length <= 0) {
    return [];
  }
  var p_3 = KQCard.findGuiPai(cardModes, 3);
  var p_4 = KQCard.findGuiPai(cardModes, 4);
  var p_2 = KQCard.findGuiPai(cardModes, 2);
  if (p_2 == null) {
    p_2 = [];
  }
  if (p_3) {
    p_3.forEach(function (indexs) {
      var sanTiaoIndexs0 = [indexs[0], indexs[1]];
      var sanTiaoIndexs3 = [indexs[1], indexs[2]];
      p_2.unshift(sanTiaoIndexs0);
      p_2.unshift(sanTiaoIndexs3);
    });
  }

  if (p_4) {
    p_4.forEach(function (indexs) {
      var sanTiaoIndexs0 = [indexs[0], indexs[1]];
      var sanTiaoIndexs6 = [indexs[2], indexs[3]];
      p_2.unshift(sanTiaoIndexs0);
      p_2.unshift(sanTiaoIndexs6);
    });
  }

  if (p_2 == null || p_3 == null) {
    return [];
  }
  var tresult = [];
  p_2.forEach(function (i_3) {
    var s = i_3;
    p_3.forEach(function (i_2) {
      s = i_3.concat(i_2);
      for (var i = 0; i < s.length - 1; i++) {
        var index = s[i];
        for (var j = i + 1; j < s.length; j++) {
          if (index == s[j]) {
            s = null;
            break;
          }
        }
        if (s == null) {
          break;
        }
      }
      if (s !== null) {
        tresult.unshift(s);
      }
    });
  });
  if (tresult.length > 10) {
    tresult = tresult.slice(0, 10);
  }
  return tresult.length > 0 ? tresult : [];
};

KQCard.findGuiPai = function (cardModes) {
  var numBer = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

  var card20 = KQCard.contain20(cardModes).map(function (card) {
    //得到鬼牌的索引
    for (var q = 0; q < cardModes.length; q++) {
      var r = cardModes[q];
      if (r === card) {
        return q;
      }
    }
  });
  if (card20.length <= 0) {
    return [];
  }
  var result = [];
  for (var j = 1; j <= card20.length; ++j) {
    var num = numBer - j; //除鬼牌外 我应该找多少张牌匹配
    var indexs = KQCard._findPointLength(cardModes, num) || [];
    for (var t = 0; t < indexs.length; t++) {
      if (numBer == 2) {
        //是对子的时候把鬼牌和单张匹配都循环一遍
        for (var o = 0; o < card20.length; ++o) {
          var s = indexs[t].concat(card20[o]);
          if (s.length == numBer) {
            result.push(s);
          }
        }
      } else {
        var s = indexs[t].concat(card20.slice(0, j)); //依次相加鬼牌第一次加一张 递增
        if (s.length == numBer) {
          result.push(s);
        }
      }
    }
  }
  if (result.length > 10) {
    result = result.slice(0, 10);
  }
  result = KQCard.repeat(result); //去重
  return result.length > 0 ? result : [];
};

KQCard.repeat = function (result) {
  for (var i = 0; i < result.length; i++) {
    var index = result[i];

    var newAyy = [];
    for (var o = 0; o < index.length; o++) {
      //有重复干掉你
      if (newAyy.indexOf(index[o]) == -1) {
        newAyy.push(index[o]);
      } else {
        result.splice(i, 1);
        break;
      }
    }

    for (var j = i + 1; j < result.length - 1; j++) {
      var s = result[j];
      var jString = '';
      var iString = '';
      for (var r = 0; r < s.length; r++) {
        jString = jString + s[r];
        iString = iString + index[r];
      }
      if (jString == iString) {
        //有重复干掉你
        result.splice(i, 1);
        break;
      }
    }
  }
  return result;
};

KQCard.testFind = function (cardModes) {
  var WuTong = KQCard.findWuTong(cardModes) || [];
  var TongHuaShun = KQCard.findTongHuaShun(cardModes) || [];
  var TieZhi = KQCard.findTieZhi(cardModes) || [];
  var HuLu = KQCard.findHuLu(cardModes) || [];
  var TongHua = KQCard.findTongHua(cardModes) || [];
  var ShunZi = KQCard.findShunZi(cardModes) || [];
  var SanTiao = KQCard.findSanTiao(cardModes) || [];
  var LiaDui = KQCard.findLiaDui(cardModes) || [];
  var DuiZi = KQCard.findDuiZi(cardModes) || [];
  var result = [WuTong, TongHuaShun, TieZhi, HuLu, TongHua, ShunZi, SanTiao, LiaDui, DuiZi];
  return result;
};

cc._RFpop();
},{"ArrayExtension":"ArrayExtension","KQCard":"KQCard","KQCardPointsHelper":"KQCardPointsHelper"}],"KQCardPointsHelper":[function(require,module,exports){
"use strict";
cc._RFpush(module, '42d3e866XhHdbkspy3Qytap', 'KQCardPointsHelper');
// scripts\KQCard\KQCardPointsHelper.js

// 牌点数帮助类
// 用来计算一个牌数组内的相同点数的牌的张数
var KQCardPointsHelper = function KQCardPointsHelper(cards) {
    this.pointNumbers = {};
    cards.forEach((function (card) {
        var point = card.point;
        var number = this.pointNumbers[point] || 0;
        this.pointNumbers[point] = number + 1;
    }).bind(this));
};

// 相同点数牌的最大数量
KQCardPointsHelper.prototype.maxNumber = function () {
    var result = 0;
    for (var prop in this.pointNumbers) {
        var number = this.pointNumbers[prop];
        //if(number < 20){
        result = Math.max(number, result);
        //}
    }

    return result;
};

module.exports = KQCardPointsHelper;

/*var cards = [
    {'suit':'s',number:2},
    {'suit':'s',number:2},
    {'suit':'s',number:4},
    {'suit':'s',number:4},
    {'suit':'s',number:6},
    {'suit':'s',number:6},
    {'suit':'s',number:8},
    {'suit':'s',number:8},
    {'suit':'s',number:10},
    {'suit':'s',number:10},
    {'suit':'s',number:12},
    {'suit':'s',number:12},
    {'suit':'s',number:14}
];
var test = new KQCardPointsSame(cards);
console.log(test);*/

cc._RFpop();
},{}],"KQCardResHelper":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'be420vtWaJOHoxQcZwP2xN2', 'KQCardResHelper');
// scripts\KQCard\KQCardResHelper.js

var Helper = {
  loadCardSpriteFrame: function loadCardSpriteFrame(cardName, callback) {
    this._loadCardFrame(cardName, callback);
  },

  setCardSpriteFrame: function setCardSpriteFrame(sprite, cardName) {
    this.loadCardSpriteFrame(cardName, function (spriteFrame) {
      sprite.spriteFrame = spriteFrame;
    });
  },

  _cardFullName: function _cardFullName(cardShortName) {
    var cardName = cardShortName;
    if (!cardName.startsWith("public-pic-card-poker")) {
      cardName = "public-pic-card-poker-" + cardName;
    }

    return cardName;
  },

  _loadCardFrame: function _loadCardFrame(cardName, callback) {
    cc.assert(callback);

    cc.loader.loadRes("play/CardTypeCombine/pockList", cc.SpriteAtlas, (function (err, atlas) {
      if (err) {
        callback(null, err);
        return;
      }

      cardName = this._cardFullName(cardName);
      var frame = atlas.getSpriteFrame(cardName);
      callback(frame);
    }).bind(this));
  }
};

module.exports = Helper;

cc._RFpop();
},{}],"KQCardScoreExtension":[function(require,module,exports){
"use strict";
cc._RFpush(module, '3f5d8wDA+tMPbPd/k4hBAAR', 'KQCardScoreExtension');
// scripts\KQCard\KQCardScoreExtension.js

var KQCard = require('KQCard');
var KQCardFindTypeExtension = require('KQCardFindTypeExtension');
var KQCardColorsHelper = require('KQCardColorsHelper');
var KQCardScoretsHelper = require('KQCardScoretsHelper');
var GetCardPointsSameCount = require('GetCardPointsSameCount');
var KQCardPointsHelper = require('KQCardPointsHelper');

KQCard.scoreOfCards = function (cards) {
  if (cards == null || cards.length == null) {
    cards = [];
  }

  var isTou = cards.length == 3;
  var typeScore = KQCard._typeScoreOfCards(cards);
  var caleCards = KQCard._convertOneToA(cards.slice());
  caleCards.forEach(function (card) {
    if (card.scores == 1) {
      card.scores = 14;
    }
  });
  //caleCards = KQCard.Sort(caleCards);
  var card20 = KQCard.contain20(caleCards);
  var pointHelper = new KQCardScoretsHelper(caleCards.kq_excludes(card20));
  var maxNum = pointHelper.maxNumber() /*-card20.length == 0 ? 1: pointHelper.maxNumber()-card20.length*/;

  var maxScore = 0; //获取除鬼牌外最大的的点数
  for (var i in pointHelper.pointNumbers) {
    if (parseInt(i) > maxScore && pointHelper.pointNumbers[i] == maxNum) {
      maxScore = parseInt(i);
    }
  }
  caleCards.forEach(function (card) {
    if (card.scores >= 20) {
      card.scores = maxScore;
    }
  });
  card20.forEach(function (card) {
    card.scores = maxScore;
  });
  //cc.log(maxNum)
  //cc.log(maxScore)
  //cc.log(caleCards.kq_excludes(card20))
  //cc.log('----35')
  caleCards.sort(KQCard.sort);
  if (typeScore == 9000000000000000) {
    //五同
    caleCards.sort(function (a1, a2) {
      return a2.scores - a1.scores;
    });
    var totalValue = "";
    //var totalColor = "";
    for (var i in caleCards) {
      var s = caleCards[i].scores;
      //var c = caleCards[i].color;
      totalValue = (parseInt(s) >= 10 ? s : "0" + s) + totalValue;
      //totalColor = c+totalColor;
    }
    //totalValue = totalValue+totalColor;
    //cc.log(totalValue)
    //cc.log(parseInt(totalValue))
    //cc.log(typeScore+parseInt(totalValue))
    return typeScore + parseInt(totalValue);
  } else if (typeScore == 8000000000000000) {
    //同花顺比最大的那张，如果两张相同那就是相同
    if (card20.length > 0) {
      //有鬼牌的时候要改变鬼牌的分数
      caleCards = KQCard._changeCardScors(caleCards);
    }
    var totalValue = "";
    var valueColor = ""; //牌色
    for (var i in caleCards) {
      var s = caleCards[i].scores;
      totalValue = (parseInt(s) >= 10 ? s : "0" + s) + totalValue;
      var c = caleCards[i].color; //牌色
      valueColor = c + valueColor; //牌色
    }
    if (cc.huaSe == 0) return typeScore + parseInt(totalValue);
    return typeScore + parseInt(totalValue + valueColor);
  } else if (typeScore == 7000000000000000) {
    //铁支,找出那四张是什么牌

    var str = "";
    var oneValue = "";
    var valueColor = ""; //牌色
    var oneValueColor = ""; //牌色
    for (var w in caleCards) {
      if (maxScore == caleCards[w].scores) {
        //三条
        var s = caleCards[w].scores;
        str = (parseInt(s) >= 10 ? s : "0" + s) + str;

        var c = caleCards[w].color; //牌色
        valueColor = c + valueColor; //牌色
      } else {
          var s = caleCards[w].scores;
          oneValue = (parseInt(s) >= 10 ? s : "0" + s) + oneValue;

          var c = caleCards[w].color; //牌色
          oneValueColor = c + oneValueColor; //牌色
        }
    }
    //if(cc.huaSe == 0) return typeScore+parseInt(str+oneValue);
    //var qwe = '';
    //qwe = oneValueColor.substr(0,oneValueColor.length -1);
    //oneValueColor = oneValueColor.substr(oneValueColor.length -1);
    //str = str+oneValue + oneValueColor + valueColor + qwe;
    //return typeScore+parseInt(str);
    return typeScore + parseInt(str + oneValue);
  } else if (typeScore == 6000000000000000) {
    //葫芦
    var str = "";
    var oneValue = "";
    var valueColor = ""; //牌色
    var oneValueColor = ""; //牌色
    for (var w in caleCards) {
      if (maxScore == caleCards[w].scores) {
        //三条
        var s = caleCards[w].scores;
        str = (parseInt(s) >= 10 ? s : "0" + s) + str;

        var c = caleCards[w].color; //牌色
        valueColor = c + valueColor; //牌色
      } else {
          var s = caleCards[w].scores;
          oneValue = (parseInt(s) >= 10 ? s : "0" + s) + oneValue;

          var c = caleCards[w].color; //牌色
          oneValueColor = c + oneValueColor; //牌色
        }
    }

    if (isTou) {
      oneValue = oneValue + '0000';
      oneValueColor = oneValueColor + '00';
    }
    return typeScore + parseInt(str + oneValue);
    //if(cc.huaSe == 0) return typeScore+parseInt(str+oneValue);
    //str = str+oneValue + valueColor + oneValueColor;
    //return typeScore+parseInt(str);
  } else if (typeScore == 5000000000000000) {
      //同花,有可能需要比5张牌
      var totalScore = "";
      var totalColor = "";
      //var colors = 0;//获取牌的类型颜色
      //for(var i in caleCards) {
      //  if(parseInt(caleCards[i].point) < 20){
      //    colors = parseInt(caleCards[i].color);
      //    break;
      //  }
      //}

      for (var i in caleCards) {
        var paiPoint = parseInt(caleCards[i].point);
        var colors = parseInt(caleCards[i].point) < 20 ? caleCards[i].color : 5;
        totalColor = colors + totalColor;
        totalScore = (paiPoint >= 10 ? paiPoint : "0" + paiPoint) + totalScore;
      }
      return typeScore + parseInt(totalScore);
      //if(cc.huaSe == 0) return typeScore+parseInt(totalScore);
      //return typeScore+parseInt(totalScore+totalColor);
    } else if (typeScore == 4000000000000000) {
        //顺子
        if (card20.length > 0) {
          //有鬼牌的时候要改变鬼牌的分数
          caleCards = KQCard._changeCardScors(caleCards);
        }
        var totalValue = "";
        var valueColor = ""; //牌色
        for (var i in caleCards) {
          var s = caleCards[i].scores;
          totalValue = (parseInt(s) >= 10 ? s : "0" + s) + totalValue;

          var c = caleCards[i].color; //牌色
          valueColor = c + valueColor; //牌色
        }
        return typeScore + parseInt(totalValue);
        //if(cc.huaSe == 0) return typeScore+parseInt(totalValue);
        //return typeScore+parseInt(totalValue + valueColor);
      } else if (typeScore == 3000000000000000) {
          //三条，找出是哪张牌有3张
          //caleCards.sort(KQCard.sort);
          var str = "";
          var oneValue = "";
          var valueColor = ""; //牌色
          var oneValueColor = ""; //牌色
          var oneValueColor20 = ""; //牌色
          for (var w in caleCards) {
            if (maxScore == caleCards[w].scores) {
              //三条
              var s = caleCards[w].scores;
              str = (parseInt(s) >= 10 ? s : "0" + s) + str;

              var c = caleCards[w].color; //牌色
              valueColor = c + valueColor; //牌色
            } else {
                var s = caleCards[w].scores;
                oneValue = (parseInt(s) >= 10 ? s : "0" + s) + oneValue;

                var c = caleCards[w].color; //牌色
                if (parseInt(s) < 20) {
                  oneValueColor = c + oneValueColor; //牌色
                } else {
                    oneValueColor20 = c + oneValueColor20; //牌色
                  }
              }
          }
          if (isTou) {
            oneValue = oneValue + '0000';
            valueColor = valueColor + '00';
          }
          return typeScore + parseInt(str + oneValue);
          //if(cc.huaSe == 0) return typeScore+parseInt(str+oneValue);
          //str = str+oneValue + oneValueColor + valueColor + oneValueColor20;
          //return typeScore+parseInt(str);
        } else if (typeScore == 2000000000000000) {
            //caleCards.sort(KQCard.sort);
            //两对,有可能需要比5张牌
            var str = "";
            var oneValue = '';
            var valueColor = ""; //牌色
            var oneValueColor = ""; //牌色
            for (var i in pointHelper.pointNumbers) {
              if (pointHelper.pointNumbers[i] == 2) {
                //两对
                for (var w in caleCards) {
                  if (i == caleCards[w].scores) {
                    var s = caleCards[w].scores;
                    str = (parseInt(s) >= 10 ? s : "0" + s) + str;
                    var c = caleCards[w].color; //牌色
                    valueColor = c + valueColor; //牌色
                  }
                }
              } else {
                  for (var q in caleCards) {
                    //单张加花色
                    if (i == caleCards[q].scores) {
                      var s = caleCards[q].scores;
                      oneValue = (parseInt(s) >= 10 ? s : "0" + s) + oneValue;

                      var c = caleCards[q].color; //牌色
                      oneValueColor = oneValueColor + c; //牌色
                    }
                  }
                }
            }
            return typeScore + parseInt(str + oneValue);
            //if(cc.huaSe == 0) return typeScore+parseInt(str+oneValue);
            ////cc.log(str)
            ////cc.log(oneValue)
            //str = str+oneValue +oneValueColor + valueColor;
            //return typeScore+parseInt(str);
          } else if (typeScore == 1000000000000000) {
              //对子
              //caleCards.sort(KQCard.sort);
              var str = "";
              var oneValue = "";
              var oneValueColor = "";
              var valueColor = "";

              if (card20.length > 0) {
                caleCards.sort(function (card1, card2) {
                  return card2.point - card1.point;
                });
                caleCards = caleCards.kq_excludes(card20);
                caleCards.forEach(function (card, index) {
                  var s = card.scores;
                  var c = card.color;
                  str = str + (parseInt(s) >= 10 ? s : "0" + s);
                  if (index == 0) {
                    var s20 = card20[0].scores;
                    str = str + (parseInt(s20) >= 10 ? s20 : "0" + s20);
                    valueColor = valueColor + c;
                    valueColor = valueColor + card20[0].color;
                  } else {
                    oneValueColor = oneValueColor + c;
                  }
                });
                //cc.log(str)
                //cc.log('--------274')
                if (isTou) {
                  str = str + '0000';
                  valueColor = valueColor + '00';
                }
                return typeScore + parseInt(str);
                //if(cc.huaSe == 0) return typeScore+parseInt(str);
                //str = str + oneValueColor + valueColor;
                //return typeScore+parseInt(str);
              }

              for (var i in pointHelper.pointNumbers) {
                if (pointHelper.pointNumbers[i] == maxNum) {
                  //对子
                  for (var w in caleCards) {
                    //对子加花色
                    if (i == caleCards[w].scores) {
                      var s = caleCards[w].scores;
                      valueColor = caleCards[w].color + valueColor;
                      str = (parseInt(s) >= 10 ? s : "0" + s) + str;
                    }
                  }
                } else {
                  for (var q in caleCards) {
                    //单张加花色
                    if (i == caleCards[q].scores) {
                      var s = caleCards[q].scores;
                      oneValueColor = caleCards[q].color + oneValueColor;
                      oneValue = (parseInt(s) >= 10 ? s : "0" + s) + oneValue;
                    }
                  }
                }
              }
              if (isTou) {
                oneValue = oneValue + '0000';
                valueColor = valueColor + '00';
              }
              return typeScore + parseInt(str + oneValue);
              //if(cc.huaSe == 0) return typeScore+parseInt(str+oneValue);
              //str = str+oneValue+oneValueColor+valueColor;
              //return typeScore+parseInt(str);
            } else if (typeScore == 0) {
                //乌龙
                var valuePoint = "";
                var valueColor = "";
                for (var q in caleCards) {
                  var s = caleCards[q].scores;
                  var c = caleCards[q].color; //单张加花色
                  valuePoint = (parseInt(s) >= 10 ? s : "0" + s) + valuePoint;
                  valueColor = c + valueColor;
                }
                if (isTou) {
                  valuePoint = valuePoint + '0000';
                  valueColor = valueColor + '00';
                }
                return typeScore + parseInt(valuePoint);
                //if(cc.huaSe == 0) return typeScore+parseInt(valuePoint);
                //valuePoint = valuePoint + valueColor;
                //return typeScore+parseInt(valuePoint);
              }

  var cardsTotalPoint = 0;
  caleCards.forEach(function (card) {
    cardsTotalPoint += card.point;
  });

  var result = typeScore + cardsTotalPoint;
  return result;
};
KQCard._changeCardScors = function (cardModel) {
  cardModel.forEach(function (card) {
    card.scores = card.point;
    if (card.scores == 1) {
      card.scores = 14;
    }
  });

  var is14 = true; //是 k q j 10 A;
  var is1 = true; //是1 2 3 4 5

  cardModel.forEach(function (card) {
    if (card.scores < 10) {
      is14 = false; //不是 k q j 10 A;
    }
  });
  cardModel.forEach(function (card) {
    card.scores = card.point;
    if (card.scores == 14) {
      card.scores = 1;
    }
  });
  cardModel.forEach(function (card) {
    if (card.scores > 5 && card.scores != 20) {
      is1 = false; //不是1 2 3 4 5
    }
  });

  if (is14) {
    //是 k q j 10 A;
    cardModel.forEach(function (card) {
      if (card.scores == 1) {
        card.scores = 14;
      }
    });

    cardModel.sort(function (a1, a2) {
      return a2.scores - a1.scores;
    });
    var num = 14;
    var scoresAyy = []; //一副牌的分数
    for (var i = 0; i < 5; i++) {
      scoresAyy.push(num);
      num -= 1;
    }
    for (var j = 0; j < scoresAyy.length; j++) {
      for (var i = 0; i < cardModel.length; i++) {
        var cardScores = cardModel[i].scores;
        if (cardScores == scoresAyy[j] && cardScores < 15) {
          scoresAyy.splice(j, 1); //删除不是鬼牌的分
        }
      }
    }
    //cc.log('----------是 k q j 10 A',scoresAyy)
    cardModel.forEach((function (card) {
      //找出选中的牌
      if (card.point >= 20) {
        card.scores = scoresAyy.splice(0, 1)[0];
      }
    }).bind(this));
  } else if (is1) {
    //是1 2 3 4 5
    cardModel.sort(function (a1, a2) {
      return a2.scores - a1.scores;
    });
    var num = 5;
    var scoresAyy = []; //一副牌的分数
    for (var i = 0; i < 5; i++) {
      scoresAyy.push(num);
      num -= 1;
    }
    for (var j = 0; j < scoresAyy.length; j++) {
      for (var i = 0; i < cardModel.length; i++) {
        var cardScores = cardModel[i].scores;
        if (cardScores == scoresAyy[j] && cardScores < 15) {
          scoresAyy.splice(j, 1); //删除不是鬼牌的分
        }
      }
    }
    //cc.log('----------是1 2 3 4 5')
    cardModel.forEach((function (card) {
      //找出选中的牌
      if (card.point >= 20) {
        card.scores = scoresAyy.splice(0, 1)[0];
      }
    }).bind(this));
  } else {
    cardModel.sort(function (a1, a2) {
      return a1.scores - a2.scores;
    });
    var scoresAyy = []; //用来装鬼牌分数
    for (var i = 0; i < 5; i++) {
      var s = parseInt(cardModel[0].scores) + i; //最小的牌的分数
      scoresAyy.push(s); //一副牌的分数
    }
    for (var j = 0; j < scoresAyy.length; j++) {
      for (var i = 0; i < cardModel.length; i++) {
        var cardScores = cardModel[i].scores;
        if (cardScores == scoresAyy[j] && cardScores < 15) {
          scoresAyy.splice(j, 1); //删除不是鬼牌的分
        }
      }
    }
    cardModel.forEach((function (card) {
      //改变牌的分数
      if (card.point >= 20) {
        card.scores = scoresAyy.splice(0, 1)[0];
      }
    }).bind(this));
  }

  cardModel.forEach(function (card) {
    if (card.scores == 1) {
      card.scores = 14;
    }
  });
  cardModel.sort(function (a1, a2) {
    return a1.scores - a2.scores;
  });
  return cardModel;
};
/*#####*/

KQCard._typeScoreOfCards = function (cards) {
  var typeScore = 0;
  if (KQCard.containWuTong(cards)) {
    typeScore = 9000000000000000;
  } else if (KQCard.containTongHuaShun(cards)) {
    typeScore = 8000000000000000;
  } else if (KQCard.containTieZhi(cards)) {
    typeScore = 7000000000000000;
  } else if (KQCard.containHuLu(cards)) {
    typeScore = 6000000000000000;
  } else if (KQCard.containTongHua(cards)) {
    typeScore = 5000000000000000;
  } else if (KQCard.containShunZi(cards)) {
    typeScore = 4000000000000000;
  } else if (KQCard.containSanTiao(cards)) {
    typeScore = 3000000000000000;
  } else if (KQCard.containLiaDui(cards)) {
    typeScore = 2000000000000000;
  } else if (KQCard.containDuiZi(cards)) {
    typeScore = 1000000000000000;
  }

  return typeScore;
};
/*
 // 根据牌型进行排序
 KQCard._typeCardsSort = function (cards) {
 if ((cards == null) || (cards.length == 0)) {
 return cards;
 }
 if(KQCard.containWuTong(cards)){
 return KQCard._typeCardsSortWutong(cards);
 } else if (KQCard.containTongHuaShun(cards)) {
 return KQCard._typeCardsSortShunZi(cards);
 } else if (KQCard.containTieZhi(cards)) {
 return KQCard._typeCardsSortTieZhi(cards);
 } else if (KQCard.containHuLu(cards)) {
 return KQCard._typeCardsSortHuLu(cards);
 } else if (KQCard.containTongHua(cards)) {
 return KQCard._typeCardsSortTongHua(cards);
 } else if (KQCard.containShunZi(cards)) {
 return KQCard._typeCardsSortShunZi(cards);
 } else if (KQCard.containSanTiao(cards)) {
 return KQCard._typeCardsSortSanTiao(cards);
 } else if (KQCard.containLiaDui(cards)) {
 return KQCard._typeCardsSortLiangDui(cards);
 } else if (KQCard.containDuiZi(cards)) {
 return KQCard._typeCardsSortDuiZi(cards);
 }

 return cards.sort(KQCard.sortByPoint).reverse();
 };

 KQCard._typeCardsSortShunZi = function (cards) {
 return cards.sort(KQCard.sortByPoint).reverse();
 };

 KQCard._typeCardsSortTieZhi = function (cards) {
 return KQCard._typeCardsSortByNumberOfPoints(cards);
 };

 /!*#####*!/
 KQCard._typeCardsSortWutong = function (cards) {
 return KQCard._typeCardsSortByNumberOfPoints(cards);
 };
 /!*#####*!/

 KQCard._typeCardsSortHuLu = function (cards) {
 return KQCard._typeCardsSortByNumberOfPoints(cards);
 };

 KQCard._typeCardsSortTongHua = function (cards) {
 return cards.sort(KQCard.sortByPoint).reverse();
 };

 KQCard._typeCardsSortSanTiao = function (cards) {
 return KQCard._typeCardsSortByNumberOfPoints(cards);
 };

 KQCard._typeCardsSortLiangDui = function (cards) {
 return KQCard._typeCardsSortByNumberOfPoints(cards);
 };

 KQCard._typeCardsSortDuiZi = function (cards) {
 return KQCard._typeCardsSortByNumberOfPoints(cards);
 };
 */
KQCard._typeCardsSortByNumberOfPoints = function (cards) {

  cards = KQCard._changeGuiCard(cards);

  cards.forEach(function (i) {
    if (i.scores == 1) i.scores = 14;
  });

  var pointHelper = new KQCardScoretsHelper(cards);
  var newCards = cards.slice().sort(function (card1, card2) {
    var numberOfCard1 = pointHelper.pointNumbers[card1.scores];
    var numberOfCard2 = pointHelper.pointNumbers[card2.scores];

    if (numberOfCard2 != numberOfCard1) {
      return numberOfCard2 - numberOfCard1;
    }
    var scores1 = card1.scores == 1 ? 14 : card1.scores;
    var scores2 = card2.scores == 1 ? 14 : card2.scores;
    return scores2 - scores1;
    //return card2.scores - card1.scores;
  });
  newCards.forEach(function (i) {
    if (i.scores == 14) i.scores = 1;
  });
  return newCards /*.concat(card20)*/;
};

KQCard._typeCardsSortByNumberOfPoints1 = function (cards) {

  cards = KQCard._changeGuiCard(cards);

  cards.forEach(function (i) {
    if (i.scores == 1) i.scores = 14;
  });

  var pointHelper = new KQCardScoretsHelper(cards);
  var newCards = cards.slice().sort(function (card1, card2) {
    var numberOfCard1 = pointHelper.pointNumbers[card1.scores];
    var numberOfCard2 = pointHelper.pointNumbers[card2.scores];

    if (numberOfCard2 != numberOfCard1) {
      return numberOfCard1 - numberOfCard2;
    }
    var scores1 = card1.scores == 1 ? 14 : card1.scores;
    var scores2 = card2.scores == 1 ? 14 : card2.scores;
    return scores1 - scores2;
    //return card1.scores - card2.scores;
  });
  newCards.forEach(function (i) {
    if (i.scores == 14) i.scores = 1;
  });
  return newCards;
};

KQCard._changeGuiCard = function (cards) {

  var card20 = KQCard.contain20(cards);

  var ca = cards.kq_excludes(card20);

  var helper = new KQCardPointsHelper(ca);

  var so = 0;

  var color = 1;

  var type = KQCard.cardsType(cards) + 1;

  type = type >= 10 ? type : "0" + type;

  if (type == "05" || type == "09") {

    return KQCard._changeCardScors(cards);
  }
  if (type == "06") {

    for (var w in helper.pointNumbers) {

      var maxNumber = helper.pointNumbers[w];

      if (w == 1) w = 14;

      if (maxNumber >= helper.maxNumber() && so < parseInt(w) && parseInt(w) != 20) {
        so = parseInt(w);
      }
    }
    color = ca[0].color;

    so = so == 14 ? 1 : so;

    card20.forEach(function (n) {

      n.scores = so;

      n.colorScores = color;
    });
  }
  if (type == "07" || type == "22" || type == "08" || type == "10" || type == "04" || type == "11" || type == "02") {

    for (var w in helper.pointNumbers) {

      var maxNumber = helper.pointNumbers[w];

      if (w == 1) w = 14;

      if (maxNumber >= helper.maxNumber() && so < parseInt(w) && parseInt(w) != 20) {
        so = parseInt(w);
      }
    }

    so = so == 14 ? 1 : so;

    ca.forEach(function (n) {
      if (so == n.point && color < n.color) color = n.color;
    });

    card20.forEach((function (n) {

      n.scores = so;

      n.colorScores = color;
    }).bind(this));
  }

  return card20.concat(ca);
};

KQCard._setGuiCard = function (index, start, end, type, cards, nodes, cardSpriteAtlas) {
  //cc.log(cardSpriteAtlas)
  //cc.log('-----593')
  var card20 = KQCard.contain20(cards[index]);

  var ca = cards[index].kq_excludes(card20);

  var helper = new KQCardPointsHelper(ca);

  var so = 0;

  var color = 1;

  var node = nodes.slice(start, end).filter(function (n) {

    if (n.childrenCount > 0 && n.children[0].cardName) {

      if (parseInt(n.children[0].cardName.split("_")[1]) == 20) return true;
    }
  });

  if (type == "05" || type == "09") {

    cards[index] = KQCard._changeCardScors(cards[index]);

    so = cards[index].filter(function (i) {
      if (i.point == 20) return true;
    }).map(function (i) {
      return i.scores == 14 ? 1 : i.scores;
    });

    node.forEach((function (n) {

      var btnSprite = n.getComponent(cc.Sprite);

      var cardName = ca[0].color + "_" + so.splice(0, 1)[0];

      var path = "public-pic-card-poker-" + cardName;

      KQCard._loadCardFrame(cardSpriteAtlas, path, btnSprite);
    }).bind(this));
  }
  if (type == "06") {

    for (var w in helper.pointNumbers) {

      var maxNumber = helper.pointNumbers[w];

      if (w == 1) w = 14;

      if (maxNumber >= helper.maxNumber() && so < parseInt(w) && parseInt(w) != 20) {
        so = parseInt(w);
      }
    }

    color = ca[0].color;

    so = so == 14 ? 1 : so;

    node.forEach((function (n) {

      var btnSprite = n.getComponent(cc.Sprite);

      var cardName = color + "_" + so;

      var path = "public-pic-card-poker-" + cardName;

      KQCard._loadCardFrame(cardSpriteAtlas, path, btnSprite);
    }).bind(this));
  }
  if (type == "07" || type == "22" || type == "08" || type == "10" || type == "04" || type == "11" || type == "02") {

    for (var w in helper.pointNumbers) {

      var maxNumber = helper.pointNumbers[w];

      if (w == 1) w = 14;

      if (maxNumber >= helper.maxNumber() && so < parseInt(w) && parseInt(w) != 20) {
        so = parseInt(w);
      }
    }

    so = so == 14 ? 1 : so;

    ca.forEach(function (n) {
      if (so == n.point && color < n.color) color = n.color;
    });

    node.forEach((function (n) {

      var btnSprite = n.getComponent(cc.Sprite);

      var cardName = color + "_" + so;

      var path = "public-pic-card-poker-" + cardName;

      KQCard._loadCardFrame(cardSpriteAtlas, path, btnSprite);
    }).bind(this));
  }
};

KQCard._setGuiCards = function (type, cards, nodes, cardSpriteAtlas) {
  //cc.log(cardSpriteAtlas)
  //cc.log('-----593')
  var card20 = KQCard.contain20(cards);

  var ca = cards.kq_excludes(card20);

  var helper = new KQCardPointsHelper(ca);

  var so = 0;

  var color = 1;

  var node = nodes.slice().filter(function (n) {

    if (n.childrenCount > 0 && n.children[0].cardName) {

      if (parseInt(n.children[0].cardName.split("_")[1]) == 20) return true;
    }
  });

  if (type == "05" || type == "09") {

    cards = KQCard._changeCardScors(cards);

    so = cards.filter(function (i) {
      if (i.point == 20) return true;
    }).map(function (i) {
      return i.scores == 14 ? 1 : i.scores;
    });

    node.forEach((function (n) {

      var btnSprite = n.getComponent(cc.Sprite);

      var cardName = ca[0].color + "_" + so.splice(0, 1)[0];

      var path = "public-pic-card-poker-" + cardName;

      KQCard._loadCardFrame(cardSpriteAtlas, path, btnSprite);
    }).bind(this));
  }
  if (type == "06") {

    for (var w in helper.pointNumbers) {

      var maxNumber = helper.pointNumbers[w];

      if (w == 1) w = 14;

      if (maxNumber >= helper.maxNumber() && so < parseInt(w) && parseInt(w) != 20) {
        so = parseInt(w);
      }
    }

    color = ca[0].color;

    so = so == 14 ? 1 : so;

    node.forEach((function (n) {

      var btnSprite = n.getComponent(cc.Sprite);

      var cardName = color + "_" + so;

      var path = "public-pic-card-poker-" + cardName;

      KQCard._loadCardFrame(cardSpriteAtlas, path, btnSprite);
    }).bind(this));
  }
  if (type == "07" || type == "22" || type == "08" || type == "10" || type == "04" || type == "11" || type == "02") {

    for (var w in helper.pointNumbers) {

      var maxNumber = helper.pointNumbers[w];

      if (w == 1) w = 14;

      if (maxNumber >= helper.maxNumber() && so < parseInt(w) && parseInt(w) != 20) {
        so = parseInt(w);
      }
    }

    so = so == 14 ? 1 : so;

    ca.forEach(function (n) {
      if (so == n.point && color < n.color) color = n.color;
    });

    node.forEach((function (n) {

      var btnSprite = n.getComponent(cc.Sprite);

      var cardName = color + "_" + so;

      var path = "public-pic-card-poker-" + cardName;

      KQCard._loadCardFrame(cardSpriteAtlas, path, btnSprite);
    }).bind(this));
  }
};

KQCard._loadCardFrame = function (SpriteFrame, path, SpritesNode, w, h) {
  //cc.log(SpriteFrame)
  //cc.log('---769')
  var Sprite = SpriteFrame.getSpriteFrame(path);

  SpritesNode.spriteFrame = Sprite;

  if (w) SpritesNode.node.width = w;

  if (h) SpritesNode.node.height = h;
};

KQCard.testScore = function () {};

cc._RFpop();
},{"GetCardPointsSameCount":"GetCardPointsSameCount","KQCard":"KQCard","KQCardColorsHelper":"KQCardColorsHelper","KQCardFindTypeExtension":"KQCardFindTypeExtension","KQCardPointsHelper":"KQCardPointsHelper","KQCardScoretsHelper":"KQCardScoretsHelper"}],"KQCardScoretsHelper":[function(require,module,exports){
"use strict";
cc._RFpush(module, '3d3b5YPHXhN44h/B0miZFRE', 'KQCardScoretsHelper');
// scripts\KQCard\KQCardScoretsHelper.js

// 牌点数帮助类
// 用来计算一个牌数组内的相同点数的牌的张数
var KQCardScoretsHelper = function KQCardScoretsHelper(cards) {
    this.pointNumbers = {};
    cards.forEach((function (card) {
        var point = card.scores;
        var number = this.pointNumbers[point] || 0;
        this.pointNumbers[point] = number + 1;
    }).bind(this));
};

// 相同点数牌的最大数量
KQCardScoretsHelper.prototype.maxNumber = function () {
    var result = 0;
    for (var prop in this.pointNumbers) {
        var number = this.pointNumbers[prop];
        //if(number < 20){
        result = Math.max(number, result);
        //}
    }

    return result;
};

module.exports = KQCardScoretsHelper;

/*var cards = [
    {'suit':'s',number:2},
    {'suit':'s',number:2},
    {'suit':'s',number:4},
    {'suit':'s',number:4},
    {'suit':'s',number:6},
    {'suit':'s',number:6},
    {'suit':'s',number:8},
    {'suit':'s',number:8},
    {'suit':'s',number:10},
    {'suit':'s',number:10},
    {'suit':'s',number:12},
    {'suit':'s',number:12},
    {'suit':'s',number:14}
];
var test = new KQCardPointsSame(cards);
console.log(test);*/

cc._RFpop();
},{}],"KQCardSelectExtension":[function(require,module,exports){
"use strict";
cc._RFpush(module, '66642YNpFVIzb+JM2CkwEgS', 'KQCardSelectExtension');
// scripts\KQCard\KQCardSelectExtension.js

var KQCard = require('KQCard');
var KQCardFindTypeExtension = require('KQCardFindTypeExtension');

// 牌自动选择的扩展

/**
 * 自动选择牌，由大到小
 *
 * @param  {[KQCard]} originCards  被选择的原始牌数组
 *
 * @return {[KQCard]}
 */
KQCard.autoSelectCards = function (originCards, maxLength) {
    if (originCards.length <= maxLength) {
        return originCards;
    }
    originCards.forEach(function (card) {
        if (card.scores == 1) {
            card.scores = 14;
        }
    });
    var cards = originCards.slice().sort(function (a, b) {
        return a.scores - b.scores;
    });

    var findFuncs = [KQCard.findWuTong, KQCard.findTongHuaShun, KQCard.findTieZhi, KQCard.findHuLu, KQCard.findTongHua, KQCard.findShunZi, KQCard.findSanTiao, KQCard.findLiaDui, KQCard.findDuiZi];

    var indexArrays = null;
    for (var i = 0; i < findFuncs.length; ++i) {
        var func = findFuncs[i];
        indexArrays = func.bind(KQCard)(cards);
        if (indexArrays && indexArrays.length > 0) {
            break;
        }
    }

    var indexs = [];
    if (indexArrays && indexArrays.length > 0) {
        // 找出同类型的牌里的分数最大的牌
        var maxScore = 0;
        indexArrays.forEach(function (tempIndexs) {
            var tempCards = tempIndexs.map(function (index) {
                return cards[index];
            });
            var score = KQCard.scoreOfCards(tempCards);
            if (score > maxScore) {
                maxScore = score;
                indexs = tempIndexs;
            }
        });
    }

    var targetCards = indexs.map(function (index) {
        return cards[index];
    });

    /*if (targetCards.length < maxLength) {
     cards = cards.kq_excludes(targetCards);
     while(targetCards.length < maxLength) {
     targetCards.push(cards.pop());
     }
     } else */if (targetCards.length > maxLength) {
        targetCards = targetCards.slice(0, maxLength);
    }

    return targetCards || [];
};

KQCard.testAutoSelect = function (cards) {};

cc._RFpop();
},{"KQCard":"KQCard","KQCardFindTypeExtension":"KQCardFindTypeExtension"}],"KQCard":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'c548c0gMf5BGIH4309MULw+', 'KQCard');
// scripts\KQCard\KQCard.js

var KQCardColorsHelper = require('KQCardColorsHelper');
var KQCardPointsHelper = require('KQCardPointsHelper');
var NumberExtension = require('NumberExtension');
var GetCardPointsSameCount = require('GetCardPointsSameCount');

cc = cc || {};
cc.assert = cc.assert || console.assert || function () {};
cc.log = cc.log || console.log || function () {};
cc.error = cc.error || console.error || function () {};

// 牌 Model 类，封装了花色和点数
// 使用：
// new KQCard(22);
var KQCard = function KQCard(point, color, index) {
    this.color = null;
    this.point = null;
    this.sindex = index;
    this._initWithColorAndPoint = function (color, point) {
        if (color == 's') {
            color = 4;
        }
        if (color == 'h') {
            color = 3;
        }
        if (color == 'c') {
            color = 2;
        }
        if (color == 'd') {
            color = 1;
        }

        this.point = Number(point);
        this.scores = Number(point);
        this.color = Number(color);
        this.colorScores = Number(color);

        cc.assert(this.point > 0);
        cc.assert(this.color > 0);
    };

    this._initWithNumber = function (number) {
        this.point = Math.floor(number / 10);
        this.color = number % 10;
        cc.assert(this.point > 0);
        cc.assert(this.color > 0);
    };

    this._initWithObject = function (object) {
        if (object.point) {
            this._initWithColorAndPoint(object.color, object.point);
        } else if (object.suit) {
            this._initWithColorAndPoint(object.suit, object.number);
        }
    };

    this.description = function () {
        return this.cardName();
    };

    this.cardName = function () {
        return this.color + "_" + this.point;
    };

    this.sort = function (otherCard) {
        var asc = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
        var AisMax = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

        return KQCard.sort(this, otherCard, asc, AisMax);
    };

    this.isEqual = function (otherCard) {
        if (!otherCard) {
            return false;
        }
        return this.point == otherCard.point && this.color == otherCard.color && this.sindex == otherCard.sindex;
    };

    if (point && color) {
        this._initWithColorAndPoint(color, point);
        return;
    }

    var number = Number(point);
    if (!Number.isNaN(number)) {
        this._initWithNumber(number);
        return;
    }

    if (typeof point == 'string') {
        // 解析 xxxxd_d 形式
        var found = point.match(/(\.)*\d_\d+/);
        if (found instanceof Array && found.length > 0) {
            var result = found[0];
            var numbers = result.split('_');

            var _color = Number(numbers[0]);
            var _point = Number(numbers[1]);

            this._initWithColorAndPoint(_color, _point);
        }

        return;
    }

    if (typeof point == 'object') {
        this._initWithObject(point);
        return;
    }

    cc.error("初始化错误：" + point + " " + color);
};

// 转换成服务器的牌 model
KQCard.prototype.toServerCard = function () {
    return {
        'suit': this.color,
        'number': this.point
    };
};

KQCard.COLOR_SPADE = 4;
KQCard.COLOR_HEART = 3;
KQCard.COLOR_CLUB = 2;
KQCard.COLOR_DIAMOND = 1;

module.exports = KQCard;

KQCard.cardsFromArray = function (cardNames) {
    return cardNames.map(function (cardName, index) {
        return new KQCard(cardName, null, index);
    });
};

// 将多张牌转换成服务器的形式
KQCard.convertToServerCards = function (cards) {
    return cards.map(function (card) {
        return card.toServerCard();
    });
};

KQCard.TYPE = {
    WuLong: 0,
    DuiZi: 1,
    LiangDui: 2,
    SanTiao: 3,
    ShunZi: 4,
    TongHua: 5,
    HuLu: 6,
    TieZhi: 7,
    TongHuaShun: 8,
    /*#####*/
    WuTong: 9,
    /*#####*/
    SanTaoHua: 10, // 特殊牌
    SanShunZi: 11,
    LiuDuiBan: 12,

    WuDuiSanTiao: 13,
    SiTaoSanTiao: 14,

    CouYiSe: 15,
    SanFenTianXia: 16,
    SanTongHuaShun: 17,
    YiTiaoLong: 18,
    QingLong: 19
};

// 牌类型名
KQCard.cardsTypeName = function (cards) {
    var names = ['乌龙', '对子', '两对', '三条', '顺子', '同花', '葫芦', '铁支', '同花顺', '五同', '三同花', '三顺子', '六对半', '五对三条', '四套三条', '凑一色', '三分天下', '三同花顺', '一条龙', '清龙'];
    var type = KQCard.cardsType(cards);
    return names[type];
};

// 找出牌的类型
KQCard.cardsType = function (cards) {
    if (KQCard.isQingLong(cards)) {
        return KQCard.TYPE.QingLong;
    }

    if (KQCard.isYiTiaoLong(cards)) {
        return KQCard.TYPE.YiTiaoLong;
    }

    //if (KQCard.isSanTongHuaShun(cards)) {
    //    return KQCard.TYPE.SanTongHuaShun;
    //}
    //
    //if (KQCard.isSanFenTianXia(cards)) {
    //    return KQCard.TYPE.SanFenTianXia;
    //}

    if (KQCard.isLiuDuiBan(cards)) {
        return KQCard.TYPE.LiuDuiBan;
    }

    if (KQCard.isSanTongHua(cards)) {
        return KQCard.TYPE.SanTaoHua;
    }

    if (KQCard.isSanShunZi(cards)) {
        return KQCard.TYPE.SanShunZi;
    }

    //if (KQCard.isCouYiSe(cards)) {
    //    return KQCard.TYPE.CouYiSe;
    //}
    //
    //if (KQCard.isWuDuiSanTiao(cards)) {
    //    return KQCard.TYPE.WuDuiSanTiao;
    //}
    //
    //if (KQCard.isSiTaoSanTiao(cards)) {
    //    return KQCard.TYPE.SiTaoSanTiao;
    //}

    /*#####*/
    if (KQCard.containWuTong(cards, 5)) {
        return KQCard.TYPE.WuTong;
    }

    //if (KQCard.containWuTong(cards)) {
    //    return KQCard.TYPE.WuTong;
    //}
    //
    //if (KQCard.containWuTong(cards)) {
    //    return KQCard.TYPE.WuTong;
    //}
    /*#####*/

    if (KQCard.containTongHuaShun(cards, 5)) {
        return KQCard.TYPE.TongHuaShun;
    }

    if (KQCard.containTieZhi(cards)) {
        return KQCard.TYPE.TieZhi;
    }

    if (KQCard.containHuLu(cards)) {
        return KQCard.TYPE.HuLu;
    }

    if (KQCard.containTongHua(cards)) {
        return KQCard.TYPE.TongHua;
    }

    if (KQCard.containShunZi(cards)) {
        return KQCard.TYPE.ShunZi;
    }

    if (KQCard.containSanTiao(cards)) {
        return KQCard.TYPE.SanTiao;
    }

    if (KQCard.containLiaDui(cards)) {
        return KQCard.TYPE.LiangDui;
    }

    if (KQCard.containDuiZi(cards)) {
        return KQCard.TYPE.DuiZi;
    }

    return KQCard.TYPE.WuLong;
};

// 判断是否是同花
KQCard.isTongHua = function (cards) {
    var minLength = arguments.length <= 1 || arguments[1] === undefined ? 3 : arguments[1];

    if (cards.length < minLength) {
        return false;
    }

    var colors = cards.map(function (card) {
        return card.color;
    });

    var color = colors[0];
    for (var index in colors) {
        var e = colors[index];
        if (e != color) {
            return false;
        }
    }
    return true;
};

// 是否包含同花
KQCard.containTongHua = function (cards) {
    var minLength = arguments.length <= 1 || arguments[1] === undefined ? 5 : arguments[1];

    if (cards.length < minLength) {
        return false;
    }
    //if (KQCard.findTongHua(cards).length > 0) {
    //    return true;
    //}
    //return false;
    cards = Array.from(cards);
    cards.sort(KQCard.sortByColor);

    var card20 = KQCard.contain20(cards);
    cards = cards.kq_excludes(card20);
    minLength = minLength - card20.length;

    for (var start = 0; start + minLength <= cards.length; ++start) {
        var subCards = cards.slice(start, start + minLength);
        if (KQCard.isTongHua(subCards, minLength)) {
            return true;
        }
    }

    //return KQCard.containTongHua20(cards);
};
KQCard.containTongHua20 = function (card) {
    if (card.length < 5) {
        return false;
    }
    var card20 = KQCard.contain20(card);
    var cards = card.kq_excludes(card20);
    cards.sort(KQCard.sortByColor);

    for (var j = 1; j <= card20.length; ++j) {
        var num = 5 - j;
        for (var start = 0; start + num <= cards.length; ++start) {
            var subCards = cards.slice(start, start + num);
            if (KQCard.isTongHua(subCards, num)) {
                return true;
            }
        }
    }
    return false;
};
// 判断是否是顺子
KQCard.isShunZi = function (cards) {
    var minLength = arguments.length <= 1 || arguments[1] === undefined ? 3 : arguments[1];

    if (cards.length < minLength) {
        return false;
    }

    if (KQCard._isShunZiAKQ(cards)) {
        return true;
    }

    var points = cards.map(function (card) {
        return card.point;
    }).sort(function (n1, n2) {
        return n1 - n2;
    });

    var point = points[0];
    for (var index in points) {
        var e = points[index];
        if (e != point) {
            return false;
        }

        point = point + 1;
    }

    return true;
};

// 判断是否是 A K Q J 10 这个顺子
KQCard._isShunZiAKQ = function (cards) {
    var length = cards.length;
    if (length.length < 3) {
        return false;
    }

    var point1s = [1];
    var point14s = [14];
    var pointK = 13;

    Number(length - 1).kq_times(function (times) {
        point1s.push(pointK - times);
        point14s.push(pointK - times);
    });

    return KQCard._isCardsContainPoints(cards, point1s) || KQCard._isCardsContainPoints(cards, point14s);
};

// cards 中是否包含 points 这些点数

KQCard._isCardsContainPoints = function (cards, points) {
    var _loop = function (index) {
        var point = points[index];
        var pointCardIndex = cards.findIndex(function (card) {
            return card.point == point;
        });

        if (pointCardIndex < 0) {
            return {
                v: false
            };
        }
    };

    for (var index = 0; index < points.length; ++index) {
        var _ret = _loop(index);

        if (typeof _ret === 'object') return _ret.v;
    }

    return true;
};
KQCard.contain20 = function (cards) {
    if (cards.length <= 0) {
        return [];
    }
    if (typeof cards[0].point == 'undefined') {
        cards = KQCard.cardsFromArray(cards);
    }
    var newCard = cards.filter(function (card) {
        //重新赋值cards
        if (card.point >= 20) {
            return card;
        }
    });
    return newCard || [];
};
// 是否包含顺子
KQCard.containShunZi = function (cards) {
    var minLength = arguments.length <= 1 || arguments[1] === undefined ? 5 : arguments[1];

    if (cards.length < minLength) {
        return false;
    }
    if (KQCard.findShunZi(cards).length > 0) {
        return true;
    }
    return false;
    //let uniqueCards = cards.unique(function(card1, card2) {
    //    return card1.point == card2.point;
    //});
    //uniqueCards.sort(KQCard.sortByPoint);
    //
    //let minPointCard = uniqueCards[0];
    //if (minPointCard.point == 1) {
    //    let APlusCard = new KQCard(minPointCard);
    //    APlusCard.point = 14;
    //    uniqueCards.push(APlusCard);
    //}
    //
    //for (var start = 0; (start + minLength) <= uniqueCards.length; ++start) {
    //    let subCards = uniqueCards.slice(start, start + minLength);
    //    if (KQCard.isShunZi(subCards, minLength)) {
    //        return true;
    //    }
    //}
    //
    //return KQCard.containShunZi20(cards);
};
/*KQCard.containShunZi20 = function (card) {
 if (card.length < 5) {
 return false;
 }
 var card20 = KQCard.contain20(card);
 var cards = card.kq_excludes(card20);
 // 先根据点数去重
 var newArr = [];
 var newArrs = [];
 for (var i = 0; i < cards.length; i++) {
 if (newArrs.indexOf(cards[i].point) == -1) {
 newArr.push(cards[i]);
 newArrs.push(cards[i].point);
 }
 }
 //newArr.forEach(function(card){
 //    if(card.scores == 14){
 //        card.scores = 1;
 //    }
 //})
 newArr.sort(function (n1, n2) {
 return n1.point - n2.point;
 });
 for(var j = 1;j <= card20.length;++j){
 var num = 5 - j;
 for (var start = 0; (start + num) <= newArr.length; ++start) {
 var subCards = newArr.slice(start, start + num);
 var bool = parseInt(subCards[num-1]['scores']) - parseInt(subCards[0]['scores']) < 5;
 if(bool){
 return true;
 }
 }
 }
 // 由于点数是唯一且升序，只需要依次遍历判断是否是顺子即可
 let convertedCards = KQCard._convertOneToA1(card);
 if (card === convertedCards) {
 return false;
 }
 return KQCard.containShunZi20(convertedCards);
 };*/
// 是否是同花顺
KQCard.isTongHuaShun = function (cards) {
    return KQCard.isTongHua(cards) && KQCard.isShunZi(cards);
};

// 是否包含有同花顺
KQCard.containTongHuaShun = function (cards) {
    var minLength = arguments.length <= 1 || arguments[1] === undefined ? 5 : arguments[1];

    if (cards.length < minLength) {
        return false;
    }
    if (KQCard.findTongHuaShun(cards).length > 0) {
        return true;
    }
    return false;
    //var sanShunZi = KQCard.sanShunZi1(cards,minLength)[0];
    //if(sanShunZi == null){
    //    return false;
    //}
    //var result = false;
    //for(var i=0;i<sanShunZi.length;i++) {
    //    var s = sanShunZi[i];
    //    if (KQCard.isTongHuaShun(s, minLength)) {
    //        return true;
    //    }
    //}
    //return KQCard.containTongHuaShun1(cards);
};
/*KQCard.containTongHuaShun1 = function (cards, minLength = 5) {
 if (cards.length < minLength) {
 return false;
 }
 let tempCards = Array.from(cards).sort(KQCard.sortByColor);
 for (var start = 0; (start + minLength) <= tempCards.length; ++start) {
 let subCards = tempCards.slice(start, start + minLength);
 if (KQCard.isTongHuaShun(subCards, minLength)) {
 return true;
 }
 }

 let convertedCards = KQCard._convertOneToA1(cards);
 if (cards === convertedCards) {
 return KQCard.containTongHuaShun20(cards);
 }
 return KQCard.containTongHuaShun1(convertedCards);
 //return false;
 };
 KQCard.containTongHuaShun20 = function (card, minLength = 5) {
 if (card.length < minLength) {
 return false;
 }
 var card20 = KQCard.contain20(card) || [];
 var cards = card.kq_excludes(card20);

 cards = Array.from(cards);
 var colorS = []; //黑桃
 var colorH = []; //红心
 var colorC = []; //梅花
 var colorD = []; //方块
 var pointS = []; //黑桃
 var pointH = []; //红心
 var pointC = []; //梅花
 var pointD = []; //方块
 for(var i=0;i<cards.length;i++){
 if(cards[i].color == '4'){
 if(pointS.indexOf(cards[i].point) == -1){
 pointS.push(cards[i].point);
 colorS.push(cards[i]);
 }

 }else if(cards[i].color == '3'){
 if(pointH.indexOf(cards[i].point) == -1){
 pointH.push(cards[i].point);
 colorH.push(cards[i]);
 }
 }else if(cards[i].color == '2'){
 if(pointC.indexOf(cards[i].point) == -1){
 pointC.push(cards[i].point);
 colorC.push(cards[i]);
 }
 }else if(cards[i].color == '1'){
 if(pointD.indexOf(cards[i].point) == -1){
 pointD.push(cards[i].point);
 colorD.push(cards[i]);
 }
 }
 }

 var color = [colorS,colorH,colorC,colorD];
 var colorSum = [];    //总共有几种花色 [5,3,0....]
 for(var i=0;i<color.length;i++){
 if(color[i].length >= parseInt(5 - card20.length)){
 //color[i].forEach(function(ca){
 //    if(ca.scores == 14){
 //        ca.scores = 1;
 //    }
 //})
 color[i].sort(function(a1,a2){
 return a1 - a2;
 })
 colorSum.push(color[i]);
 }
 }

 for(var i=0;i<colorSum.length;i++) {
 var s = colorSum[i]
 for(var j = 1;j <= card20.length;++j){
 var num = 5 - j;
 for (var start = 0; (start + num) <= s.length; ++start) {
 var subCards = s.slice(start, start + num);
 var bool = parseInt(subCards[num-1]['scores']) - parseInt(subCards[0]['scores']) < 5;
 if(bool){
 return true;
 }
 }
 }
 }



 let convertedCards = KQCard._convertOneToA1(card);
 if (card === convertedCards) {
 return false;
 }
 return KQCard.containTongHuaShun20(convertedCards);
 };*/

// 是否是清龙
KQCard.isQingLong = function (cards) {
    var length = 13;
    if (cards.length != length) {
        return false;
    }
    var card20 = KQCard.contain20(cards);
    if (card20.length > 0) {
        return false;
    }
    /**
     *
     */
    var colorS = []; //黑桃
    var colorH = []; //红心
    var colorC = []; //梅花
    var colorD = []; //方块
    for (var i = 0; i < cards.length; i++) {
        if (cards[i].suit == 's') {
            colorS.push(cards[i]);
        } else if (cards[i].suit == 'h') {
            colorH.push(cards[i]);
        } else if (cards[i].suit == 'c') {
            colorC.push(cards[i]);
        } else if (cards[i].suit == 'd') {
            colorD.push(cards[i]);
        }
    }
    var ls = colorS.length; //黑桃个数
    var lh = colorH.length; //红桃个数
    var lc = colorC.length; //梅花个数
    var ld = colorD.length; //方块个数
    var color = [ls, lh, lc, ld];
    var colorSum = []; //总共有几种花色 [5,3,0....]
    for (var i = 0; i < color.length; i++) {
        if (color[i] != 0) {
            colorSum.push(color[i]);
        }
    }
    if (colorSum.length == 1) {
        if (colorSum[0] == 13) {

            if (KQCard.isYiTiaoLong(cards)) {

                var teShuCard = cards.filter(function (i) {
                    return i;
                });

                teShuCard = KQCard.cardsFromArray(teShuCard);

                teShuCard.forEach(function (a) {
                    if (a.scores == 1) a.scores = 14;
                });

                teShuCard.sort(function (a, b) {
                    return b.scores - a.scores;
                });

                teShuCard = KQCard.convertToServerCards(teShuCard);

                var a1 = teShuCard.splice(0, 5);

                var a2 = teShuCard.splice(0, 5);

                cc.teShuPaiCards = [teShuCard, a2, a1];

                return true;
            }
        }
    }
    //return KQCard.isTongHuaShun(cards);
    return false;
};

// 是否是一条龙
KQCard.isLong = function (cards) {
    var length = 13;
    if (cards.length != length) {
        return false;
    }

    return KQCard.isShunZi(cards);
};

/*#####*/
/*是否一条龙*/
KQCard.isYiTiaoLong = function (cards) {
    //cards:{number:1~13 ,'suit':'h'...}
    var length = 13;
    if (cards.length != length) {
        return false;
    }
    var card20 = KQCard.contain20(cards);
    if (card20.length > 0) {
        return false;
    }
    if (typeof cards[0].number == 'undefined') {
        cards = KQCard.convertToServerCards(cards);
    }
    var number = cards.map(function (card) {
        return card.number;
    }).sort(function (n1, n2) {
        return n1 - n2;
    });
    for (var i = 0; i < cards.length - 1; i++) {
        if (number[i] != number[i + 1] - 1) {
            return false;
        }
    }

    var teShuCard = cards.filter(function (i) {
        return i;
    });

    teShuCard = KQCard.cardsFromArray(teShuCard);

    teShuCard.forEach(function (a) {
        if (a.scores == 1) a.scores = 14;
    });

    teShuCard.sort(function (a, b) {
        return b.scores - a.scores;
    });

    teShuCard = KQCard.convertToServerCards(teShuCard);

    var a1 = teShuCard.splice(0, 5);

    var a2 = teShuCard.splice(0, 5);

    cc.teShuPaiCards = [teShuCard, a2, a1];
    //cc.log(cc.teShuPaiCards )
    //cc.log('--------728')
    return true;
};
/*#####*/
/*是否三同花*/
KQCard.isSanTongHua = function (cards) {
    var length = 13;
    if (cards.length != length) {
        return false;
    }
    var card20 = KQCard.contain20(cards);
    if (card20.length > 0) {
        return false;
    }
    if (typeof cards[0].suit == "undefined") {
        cards = KQCard._convertCardsToCardNames(cards);
    }
    var colorS = []; //黑桃
    var colorH = []; //红心
    var colorC = []; //梅花
    var colorD = []; //方块
    for (var i = 0; i < cards.length; i++) {
        if (cards[i].suit == 's') {
            colorS.push(cards[i]);
        } else if (cards[i].suit == 'h') {
            colorH.push(cards[i]);
        } else if (cards[i].suit == 'c') {
            colorC.push(cards[i]);
        } else if (cards[i].suit == 'd') {
            colorD.push(cards[i]);
        }
    }
    var ls = colorS.length; //黑桃个数
    var lh = colorH.length; //红桃个数
    var lc = colorC.length; //梅花个数
    var ld = colorD.length; //方块个数
    var sanCard = [colorS, colorH, colorC, colorD];
    var teShuCard = [];
    var color = [ls, lh, lc, ld];
    var colorSum = []; //总共有几种花色 [5,3,0....]
    for (var i = 0; i < color.length; i++) {
        if (color[i] != 0) {
            colorSum.push(color[i]);
            teShuCard.push(sanCard[i]);
        }
    }

    //三种花色
    if (colorSum.length == 3) {
        for (var i = 0; i < colorSum.length; i++) {
            if (colorSum[i] != 5 && colorSum[i] != 3) {
                return false;
            }
        }
        teShuCard.sort(function (a, b) {
            return a.length - b.length;
        });
        cc.teShuPaiCards = teShuCard;
        return true;
    }
    return false;
};
/*是否凑一色*/
KQCard.isCouYiSe = function (cards) {
    var length = 13;
    if (cards.length != length) {
        return false;
    }
    var card20 = KQCard.contain20(cards);
    if (card20.length > 0) {
        return false;
    }
    if (typeof cards[0].suit == 'undefined') {
        cards = KQCard._convertCardsToCardNames(cards);
    }
    var colorS = []; //黑桃
    var colorH = []; //红心
    for (var i = 0; i < cards.length; i++) {
        if (cards[i].suit == 's' || cards[i].suit == 'c') {
            colorS.push(cards[i]); //全黑
        } else if (cards[i].suit == 'h' || cards[i].suit == 'd') {
                colorH.push(cards[i]); //全红
            }
    }

    //如果牌中包含四种花色就不可能是三同花
    if (colorS.length == 13 || colorH.length == 13) {
        return true;
    }
    //else if(colorH.length == 13){
    //    return true;
    //}
    return false;
};
/*#####*/
// 是否是六对半
KQCard.isLiuDuiBan = function (cards) {
    var length = 12;
    if (cards.length < length) {
        return false;
    }

    var duiZiLength = 2;
    //计算一个牌数组内的相同点数的牌的张数
    var cardNumbers = new GetCardPointsSameCount(cards);
    var numberOfDuiZi = 0;
    var numberOfYi = 0;
    for (var prop in cardNumbers) {
        var value = cardNumbers[prop];
        if (value == duiZiLength || value == 3) {
            numberOfDuiZi = numberOfDuiZi + 1;
        } else if (value == 4) {
            numberOfDuiZi = numberOfDuiZi + 2;
        }
        //else if (value == 6 || value == 7 || value == 5) {
        //    numberOfDuiZi = numberOfDuiZi + 0;
        //}
        else if (value == 1) {
                numberOfYi += 1;
            }
    }

    if (numberOfDuiZi == 6) {

        var teShuCard = cards.filter(function (i) {
            return i;
        });

        teShuCard = KQCard.cardsFromArray(teShuCard);

        teShuCard.forEach(function (a) {
            if (a.scores == 1) a.scores = 14;
        });

        teShuCard.sort(function (a, b) {
            return b.scores - a.scores;
        });

        teShuCard = KQCard.convertToServerCards(teShuCard);

        var a1 = teShuCard.splice(0, 5);

        var a2 = teShuCard.splice(0, 5);

        cc.teShuPaiCards = [teShuCard, a2, a1];

        return true;
    }
    return false;
};

KQCard.isWuDuiSanTiao = function (cards) {
    var length = 13;
    if (cards.length < length) {
        return false;
    }

    var duiZiLength = 2;
    var sanTiaoLength = 3;
    //计算一个牌数组内的相同点数的牌的张数
    var cardNumbers = new GetCardPointsSameCount(cards);
    var numberOfDuiZi = 0;
    var numberOfSanTiao = 0;
    for (var prop in cardNumbers) {
        var value = cardNumbers[prop];
        if (value == duiZiLength) {
            numberOfDuiZi = numberOfDuiZi + 1;
        } else if (value == sanTiaoLength) {
            numberOfSanTiao = numberOfSanTiao + 1;
        } else if (value >= 4) {
            numberOfDuiZi = numberOfDuiZi + 2;
        }
    }
    return numberOfDuiZi == 5 && numberOfSanTiao == 1;
};

//判断5张或者3张是否顺子
KQCard.isShunZi1 = function (arr) {
    //console.log(arr);
    for (var i = 0; i < arr.length - 1; i++) {
        if (arr[i + 1] - arr[i] != 1) {
            //不是顺子
            //console.log("不是顺子");
            return false;
        }
    }
    return true;
};

KQCard.isSanShunZi = function (cards) {
    var length = 13;
    if (cards.length != length) {
        return false;
    }

    if (typeof cards[0].suit == 'undefined') {
        cards = KQCard._convertCardsToCardNames(cards);
    }

    //取出牌的点数
    var number = cards.map(function (card) {
        return card.number;
    });
    //排序
    number.sort(function (n1, n2) {
        return n1 - n2;
    });
    if (KQCard.fenZhu(number, 5, 5) == false) {
        var number = cards.map(function (card) {
            return card.number;
        });
        //排序
        number.sort(function (n1, n2) {
            return n1 - n2;
        });
        if (KQCard.fenZhu(number, 5, 3) == false) {
            var number = cards.map(function (card) {
                return card.number;
            });
            //排序
            number.sort(function (n1, n2) {
                return n1 - n2;
            });
            if (KQCard.fenZhu(number, 3, 5) == false) {
                //不是三顺子
                var AIsExist = false; //是否存在A
                for (var i in cards) {
                    if (cards[i].number == 1) {
                        AIsExist = true;
                        //console.log("存在A");
                        break;
                    }
                }
                if (!AIsExist) {
                    //console.log("退出递归");
                    return false;
                }

                for (var i in cards) {
                    if (cards[i].number == 1) {
                        //console.log("A转为14");
                        cards[i].number = 14;
                        break;
                    }
                }
                if (cc.teShuPaiCards && cc.teShuPaiCards.length > 0 && cc.teShuPaiCards[0][0] && typeof cc.teShuPaiCards[0][0] == 'number') {
                    var newCards = cards.filter(function (i) {
                        return i;
                    });
                    var newCards1 = cc.teShuPaiCards.map(function (arr) {
                        var cad = arr.map(function (number) {
                            for (var i = 0; i < newCards.length; i++) {
                                if (newCards[i].number == number) {
                                    return newCards.splice(i, 1)[0];
                                    break;
                                }
                            }
                        });
                        return cad;
                    });
                    cc.teShuPaiCards = newCards1;
                }
                return KQCard.isSanShunZi(cards);
            }
        }
    }
    if (cc.teShuPaiCards && cc.teShuPaiCards.length > 0 && cc.teShuPaiCards[0][0] && typeof cc.teShuPaiCards[0][0] == 'number') {
        var newCards = cards.filter(function (i) {
            return i;
        });
        var newCards1 = cc.teShuPaiCards.map(function (arr) {
            var cad = arr.map(function (number) {
                for (var i = 0; i < newCards.length; i++) {
                    if (newCards[i].number == number) {
                        return newCards.splice(i, 1)[0];
                        break;
                    }
                }
            });
            return cad;
        });
        cc.teShuPaiCards = newCards1;
    }
    return true;
};

//分组553||535||355
KQCard.fenZhu = function (number, num1, num2) {
    var arr1 = [];
    var arr2 = [];
    var arr3 = [];
    for (var i = 0; i < number.length - 1; i++) {
        if (i == 0) {
            arr1.push(number[0]);
        }
        if (number[i + 1] - number[i] == 0) {
            continue;
        }
        arr1.push(number[i + 1]);
        if (arr1.length == num1) {
            //取第一组是顺子
            if (KQCard.isShunZi1(arr1)) {
                //这5个是顺子,从数组中移除
                for (var i = 0; i < arr1.length; i++) {
                    for (var j = 0; j < number.length; j++) {
                        if (number[j] == arr1[i]) {
                            //两个数一样的只删除一个
                            if (number[j] == number[j + 1]) {
                                continue;
                            }
                            number.splice(j, 1); //从number中移除
                        }
                    }
                }
                /*console.log("删除第一组后的number");
                 console.log(number);*/
                //接下来取第二组
                for (var i = 0; i < number.length - 1; i++) {
                    if (i == 0) {
                        arr2.push(number[0]);
                    }
                    if (number[i + 1] - number[i] == 0) {
                        continue;
                    }
                    arr2.push(number[i + 1]);
                    if (arr2.length == num2) {
                        //取第二组是顺子
                        if (KQCard.isShunZi1(arr2)) {
                            for (var i = 0; i < arr2.length; i++) {
                                for (var j = 0; j < number.length; j++) {
                                    if (number[j] == arr2[i]) {
                                        //两个数一样的只删除一个
                                        if (number[j] == number[j + 1]) {
                                            continue;
                                        }
                                        number.splice(j, 1); //从number中移除
                                    }
                                }
                            }
                            /*console.log("删除第二组后的number");
                             console.log(number);*/
                            arr3 = number;
                            //接下来就是剩下的了
                            if (KQCard.isShunZi1(arr3)) {
                                //第三组也是顺子
                                var asdf = [arr1, arr2, arr3];

                                asdf.sort(function (n1, n2) {
                                    return n1.length - n2.length;
                                });

                                if (!cc.teShuPaiCards) cc.teShuPaiCards = asdf;

                                return true;
                            }
                            //第三组不是顺子
                            return false;
                        }
                        //第二组不是顺子
                        return false;
                    }
                }
            }
            //第一组不是顺子
            return false;
        }
    }
    //如果取不到num1个数
    if (arr1.length < num1) {
        return false;
    }
    if (arr2.length < num2) {
        return false;
    }
};

KQCard.isSanShunZi1 = function (cards) {
    var length = 13;
    if (cards.length != length) {
        return false;
    }
    if (typeof cards[0].point == 'undefined') {
        cards = KQCard.cardsFromArray(cards);
    }
    var card20 = KQCard.contain20(cards);
    if (card20.length > 0) {
        return false;
    }

    cards = Array.from(cards);
    cards.sort(KQCard.sortByPoint);
    var wei = [];
    var zhong = [];
    var tou = [];
    var sanShunZi = KQCard.sanShunZi1(cards)[0]; //获取所有组合的头道
    if (!sanShunZi) {
        //你连头道都没有 怎么更我混
        return false;
    }

    var newCard = cards.filter(function (i) {
        //重新赋值cards
        return i;
    });
    var newCards1 = [];
    var newPoint = []; //判断point是否相同
    var duiZi = []; //取出有对子当中的一张牌
    for (var s in cards) {
        if (newPoint.indexOf(cards[s].point) < 0) {
            newCards1.push(cards[s]);
            newPoint.push(cards[s].point);
        } else {
            //取出有对子当中的一张牌
            duiZi.push(cards[s]);
        }
    }

    for (var j = 0; j < sanShunZi.length; ++j) {
        //循环所有头道
        var number3 = sanShunZi[j];
        if (typeof number3 == 'undefined') {
            continue;
        }
        for (var i = 0; i < cards.length; ++i) {
            var newCards = newCards1.filter(function (i) {
                //重新赋值cards
                return i;
            });

            newCards = newCards.kq_excludes(number3); //删除牌里的头道
            if (wei.length != 5) {
                var subCards = newCards.slice(i, i + 5);
                if (subCards.length == 5 || KQCard.isShunZi(subCards)) {
                    //得到尾道 删除牌里的尾道
                    wei = subCards;
                    // cc.log(number3)
                    // cc.log(newCards1)
                    // cc.log(subCards)
                    // cc.log(newCards)
                    // cc.log(i)
                    // cc.log('-----716')
                    newCards = newCards.kq_excludes(subCards);
                }
            }

            if (wei.length == 5) {
                //把剩余的牌和对子的单张合并
                var tasks = duiZi.filter(function (i) {
                    //重新赋值对子
                    return i;
                });
                tasks = tasks.kq_excludes(number3); //判断头道和对子的单张是否有相同 有的话就删除
                newCards = newCards.concat(tasks); //把剩余的牌和对子的单张合并
            }

            if (zhong.length != 5 && newCards.length == 5) {
                if (KQCard.isShunZi(newCards)) {
                    //是三顺子
                    zhong = newCards;
                }
            }
            if (wei.length == 5 && zhong.length == 5) {
                //是三顺子终止循环
                break;
            } else {
                //来吧 继续吧
                zhong = [];wei = [];tou = [];
            }
        }
        if (wei.length == 5 && zhong.length == 5) {
            //是三顺子终止循环
            tou = number3;
            break;
        } else {
            //来吧 继续吧
            zhong = [];wei = [];tou = [];
        }
    }

    cards = newCard;
    if (KQCard._isSanShunZi(tou, zhong, wei)) {
        //是三顺子
        tou = KQCard.convertToServerCards(tou);
        zhong = KQCard.convertToServerCards(zhong);
        wei = KQCard.convertToServerCards(wei);

        if (!cc.teShuPaiCards) cc.teShuPaiCards = [tou, zhong, wei];
        return true;
    }
    var convertedCards = KQCard._convertOneToA1(cards);
    if (cards === convertedCards) {
        cards.forEach(function (a) {
            if (a.point == 14) a.point = 1;
        });
        //return false;
        return KQCard.isSanShunZi1(cards);
    }
    return KQCard.isSanShunZi(convertedCards);
};

KQCard.sanShunZi1 = function (cards) {
    var length = arguments.length <= 1 || arguments[1] === undefined ? 3 : arguments[1];

    var shunzi = KQCard.findShunZi(cards, length);
    var cardsT = [];
    var cardsIndex = [];
    if (shunzi == null) {
        return false;
    }
    for (var i = 0; i < shunzi.length; i++) {
        var a = shunzi[i];
        var cardsShunzi = [];
        // var cardsIndex = [];
        for (var j = 0; j < a.length; j++) {
            var index = a[j];
            if (typeof cards[index] == 'undefined') {
                continue;
            }
            cardsShunzi.push(cards[index]);
        }
        cardsIndex.push(a);
        cardsT.push(cardsShunzi);
    }
    return [cardsT, cardsIndex];
};

KQCard._isSanShunZi = function (touCards, zhongCards, weiCards) {
    return KQCard.isShunZi(touCards) && KQCard.isShunZi(zhongCards) && KQCard.isShunZi(weiCards);
};
// 是否是三同花顺
KQCard.isSanTongHuaShun = function (cards) {
    var length = 13;
    if (cards.length != length) {
        return false;
    }
    var card20 = KQCard.contain20(cards);
    if (card20.length > 0) {
        return false;
    }
    var colorCardsObject = KQCard._colorClassCards(cards);

    var subCards = [];
    for (var prop in colorCardsObject) {
        var _cards = colorCardsObject[prop];
        subCards.push(_cards);
    }

    if (subCards.length != 3) {
        return false;
    }

    subCards = subCards.sort(function (s1, s2) {
        return s1.length > s2.length;
    });

    var touCards = subCards[0];
    var zhongCards = subCards[1];
    var weiCards = subCards[2];

    if (touCards.length != 3 || zhongCards.length != 5 || weiCards.length != 5) {
        return false;
    }

    return KQCard._isSanTongHuaShun(touCards, zhongCards, weiCards);
};

// 将牌根据 color 进行分类
KQCard._colorClassCards = function (cards) {
    var colorCardsObject = {};
    cards.forEach(function (card) {
        var color = card.color;
        var subCards = colorCardsObject[color];
        if (!subCards) {
            subCards = [];
            colorCardsObject[color] = subCards;
        }
        subCards.push(card);
    });

    return colorCardsObject;
};

// 是否是三同花顺
KQCard._isSanTongHuaShun = function (touCards, zhongCards, weiCards) {
    return KQCard.isTongHuaShun(touCards) && KQCard.isTongHuaShun(zhongCards) && KQCard.isTongHuaShun(weiCards);
};

// 是否是 “三分天下”
KQCard.isSanFenTianXia = function (cards) {
    var length = 13;
    if (cards.length < length) {
        return false;
    }

    var tieZhiLength = 4;
    var pointHelper = new KQCardPointsHelper(cards);
    var numberOfTieZhi = 0;
    for (var prop in pointHelper.pointNumbers) {
        var value = pointHelper.pointNumbers[prop];
        if (value == tieZhiLength) {
            numberOfTieZhi = numberOfTieZhi + 1;
        }
    }
    return numberOfTieZhi === 3;
};

// 是否是 “四套三条”
KQCard.isSiTaoSanTiao = function (cards) {
    var length = 13;
    if (cards.length < length) {
        return false;
    }
    var sanTiaoLength = 3;
    var pointHelper = new KQCardPointsHelper(cards);
    var numberOfSanTiao = 0;
    for (var prop in pointHelper.pointNumbers) {
        var value = pointHelper.pointNumbers[prop];
        if (value == sanTiaoLength) {
            numberOfSanTiao = numberOfSanTiao + 1;
        }
    }

    return numberOfSanTiao == 4;
};

// 是否是 “三桃花”
// 头、中、尾道为相同花色的牌
KQCard.isSanTaoHua = function (cards) {
    var length = 13;
    if (cards.length < length) {
        return false;
    }
    var card20 = KQCard.contain20(cards);
    if (card20.length > 0) {
        return false;
    }
    var colorHelper = new KQCardColorsHelper(cards);
    var colorNumbers = [];
    for (var prop in colorHelper.colorNumber) {
        colorNumbers.push(colorHelper.colorNumber[prop]);
    }

    colorNumbers.sort(function (n1, n2) {
        return n1 - n2;
    });

    if (colorNumbers.length != 3) {
        return false;
    }

    if (colorNumbers[0] == 3 && colorNumbers[1] == 5 && colorNumbers[2] == 5) {
        return true;
    }

    return false;
};

// 判断是否包含铁支
// 四张同样点数的牌
KQCard.containTieZhi = function (cards) {
    var length = 4;
    if (cards.length < length) {
        return false;
    }
    var card20 = KQCard.contain20(cards);
    cards = cards.kq_excludes(card20);
    length = length - card20.length;
    var helper = new KQCardPointsHelper(cards);

    for (var w in helper.pointNumbers) {
        var maxNumber = helper.pointNumbers[w];
        if (maxNumber >= length) {
            card20.forEach(function (ca) {
                ca.scores = parseInt(w);
            });
            return true;
        }
    }
    //if(helper.maxNumber() >= length){
    //    return helper.maxNumber() >= length;
    //}
    // else{
    //    return KQCard.containGuiPai(cards,4);
    //}
    //if (KQCard.findTieZhi(cards).length > 0) {
    //    return true;
    //}
    return false;
};

// 判断是否是铁支
KQCard.isTieZhi = function (cards) {
    var length = 4;
    if (cards.length != length) {
        return false;
    }

    var result = cards.reduce(function (point, card) {
        if (point == card.point) {
            return point;
        }
        return -1;
    }, cards[0].point);

    return result != -1;
};

/*#####是否包含五同*/
//五张同样点数的牌
KQCard.containWuTong = function (cards) {
    var length = 5;
    if (cards.length < length) {
        return false;
    }
    var card20 = KQCard.contain20(cards);
    cards = cards.kq_excludes(card20);
    length = length - card20.length;
    //五张牌相同的
    var helper = new KQCardPointsHelper(cards);
    //for(var w in helper.pointNumbers) {
    //    cc.log(w)
    //}
    //cc.log(cards)
    //cc.log(helper)
    //cc.log(card20)
    //cc.log(helper.maxNumber())
    //cc.log('------1307')
    //if(helper.maxNumber() >= length){
    //    return helper.maxNumber() >= length;
    //}
    for (var w in helper.pointNumbers) {
        var maxNumber = helper.pointNumbers[w];
        if (maxNumber >= length) {
            card20.forEach(function (ca) {
                ca.scores = parseInt(w);
            });
            return helper.maxNumber() >= length;
        }
    }
    return false;
};

/*判断是否五同*/
KQCard.isWuTong = function (cards) {
    var length = 5;
    if (cards.length != length) {
        return false;
    }

    var result = cards.reduce(function (point, card) {
        if (point == card.point) {
            return point;
        }
        return -1;
    }, cards[0].point);

    return result != -1;
};
/*#####*/

// 是否是 “葫芦”
// 三张相同 + 一对
KQCard.containHuLu = function (cards) {
    var length = 5;
    if (cards.length < length) {
        return false;
    }
    if (KQCard.findHuLu(cards).length > 0) {
        return true;
    }
    //let pointHelper = new KQCardPointsHelper(cards);
    //var pointNumbers = [];
    //var index = 0;
    //for (let prop in pointHelper.pointNumbers) {
    //    pointNumbers[index] = pointHelper.pointNumbers[prop];
    //    index = index + 1;
    //}
    //var h=[];
    //var h1=[];
    //for(var i in pointNumbers){
    //    var s=pointNumbers[i];
    //    if(s == 3){
    //        h.push(s)
    //    }
    //    else if(s==4){
    //        h1.push(s)
    //    }
    //
    //}
    //
    //if ((pointNumbers.indexOf(3) != -1) && (pointNumbers.indexOf(2) != -1)
    // || h.length > 1 || h1.length > 1 ||(pointNumbers.indexOf(4) != -1)
    // && (pointNumbers.indexOf(2) != -1)) {
    //    return true;
    //}

    return false;
};

// 判断是否是 葫芦
KQCard.isHuLu = function (cards) {
    if (cards.length != 5) {
        return false;
    }

    var points = cards.map(function (card) {
        return card.point;
    }).sort(function (p1, p2) {
        return p1 - p2;
    });

    var p1 = points[0];
    var p2 = p1;
    var numberP1 = 0;
    var numberP2 = 0;

    points.forEach(function (point) {
        if (point != p1 && point != p2) {
            p2 = point;
            numberP2 = 0;
        }

        numberP1 = numberP1 + (point == p1 ? 1 : 0);
        numberP2 = numberP2 + (point == p2 ? 1 : 0);
    });

    var maxNumber = Math.max(numberP1);
    var minNumber = Math.min(numberP2);

    return minNumber == 2 && maxNumber == 3;
};

// 是否包含有 “三条”
KQCard.containSanTiao = function (cards) {
    var length = 3;
    if (cards.length < length) {
        return false;
    }
    //if (KQCard.findSanTiao(cards).length > 0) {
    //    return true;
    //}
    var card20 = KQCard.contain20(cards);
    cards = cards.kq_excludes(card20);
    length = length - card20.length;
    var pointHelper = new KQCardPointsHelper(cards);
    for (var w in pointHelper.pointNumbers) {
        var maxNumber = pointHelper.pointNumbers[w];
        if (maxNumber >= length) {
            card20.forEach(function (ca) {
                ca.scores = parseInt(w);
            });
            return true;
        }
    }
    //for (let prop in pointHelper.pointNumbers) {
    //    if (pointHelper.pointNumbers[prop] >= length) {
    //        return true;
    //    }
    //}
    return false;

    //
    //return KQCard.containGuiPai(cards,3);
};

// 是否是 “三条”
KQCard.isSanTiao = function (cards) {
    if (cards.length != 3) {
        return false;
    }

    var result = cards.reduce(function (point, card) {
        if (card.point == point) {
            return point;
        }

        return -1;
    }, cards[0].point);

    return result != -1;
};

// 是否包含有 ：两对
KQCard.containLiaDui = function (cards) {
    if (cards.length < 4) {
        return false;
    }
    if (KQCard.findLiaDui(cards).length > 0) {
        return true;
    }
    //var numberOfDuiZi = 0;
    //let pointHelper = new KQCardPointsHelper(cards);
    //for (let prop in pointHelper.pointNumbers) {
    //    if (pointHelper.pointNumbers[prop] == 2) {
    //        numberOfDuiZi = numberOfDuiZi + 1;
    //        if (numberOfDuiZi == 2) {
    //            return true;
    //        }
    //    }
    //}

    return false;
};

// 是否是 两对
KQCard.isLiaDui = function (cards) {
    if (cards.length != 4) {
        return false;
    }

    var pointHelper = new KQCardPointsHelper(cards);
    for (var prop in pointHelper.pointNumbers) {
        if (pointHelper.pointNumbers[prop] != 2) {
            return false;
        }
    }
    return true;
};

// 是不是对子
KQCard.isDuiZi = function (cards) {
    if (cards.length != 2) {
        return false;
    }

    var card1 = cards[0];
    var card2 = cards[1];

    return card1.point == card2.point;
};

// 是否包含对子
KQCard.containDuiZi = function (cards) {
    var length = 2;
    if (cards.length < length) {
        return false;
    }
    //if (KQCard.findDuiZi(cards).length > 0) {
    //    return true;
    //}
    var card20 = KQCard.contain20(cards);
    cards = cards.kq_excludes(card20);
    length = length - card20.length;
    var pointHelper = new KQCardPointsHelper(cards);
    //for (let prop in pointHelper.pointNumbers) {
    //    if (pointHelper.pointNumbers[prop] >= length) {
    //        return true;
    //    }
    //}
    for (var w in pointHelper.pointNumbers) {
        var maxNumber = pointHelper.pointNumbers[w];
        if (maxNumber >= length) {
            card20.forEach(function (ca) {
                ca.scores = parseInt(w);
            });
            return true;
        }
    }
    return false;
    //return KQCard.containGuiPai(cards,2);
};

KQCard.containGuiPai = function (cards, length) {
    if (cards.length < length) {
        return false;
    }
    var card20 = KQCard.contain20(cards);
    cards = cards.kq_excludes(card20);
    var helper = new KQCardPointsHelper(cards);
    var maxNumber = helper.maxNumber() + card20.length;
    return maxNumber >= length;
};
/*#####*/
// 是否是特殊牌
KQCard.isTeShuPai = function (cards) {
    if (cards.length < 13) {
        return false;
    }

    return KQCard.isQingLong(cards) || KQCard.isYiTiaoLong(cards) || KQCard.isLiuDuiBan(cards) || KQCard.isSanShunZi(cards) || KQCard.isSanTongHua(cards)
    /*|| KQCard.isSanTongHuaShun(cards)
     || KQCard.isSanFenTianXia(cards)
     || KQCard.isSiTaoSanTiao(cards)
      || KQCard.isWuDuiSanTiao(cards)
     || KQCard.isCouYiSe(cards)*/;
};

// 将牌中的 1 变化为 A（14)
KQCard._convertOneToA = function (cards) {
    if (cards.find(function (card) {
        return card.point == 1;
    }) == undefined) {
        return cards;
    }
    var result = cards.map(function (card) {
        if (card.point == 1) {
            var newCard = new KQCard(14, card.color);
            return newCard;
        }
        return card;
    });

    return result;
};

KQCard._convertOneToA1 = function (cards) {
    if (cards.find(function (card) {
        return card.point == 1;
    }) == undefined) {
        return cards;
    }
    var num = 0;
    var result = cards.map(function (card) {
        if (card.point == 1 && num == 0) {
            num++;
            var newCard = new KQCard(14, card.color);
            return newCard;
        }
        return card;
    });

    return result;
};

// KQCard 的排序方法
KQCard.sortByPoint = function (card1, card2) {
    var result = Number(card1.point) - Number(card2.point);
    return result;
};

KQCard.sortByColor = function (card1, card2) {
    var pointAsc = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

    if (card2.color == card1.color) {
        return (card1.point - card2.point) * (pointAsc ? 1 : -1);
    }
    return card2.color - card1.color;
};

KQCard.sort = function (card1, card2) {
    var asc = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
    var AisMax = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

    var result = 1;
    if (card1.point == card2.point) {
        result = card1.color - card2.color;
    } else {
        var point1 = card1.point;
        var point2 = card2.point;
        if (AisMax && point1 == 1) {
            point1 = 14;
        }

        if (AisMax && point2 == 1) {
            point2 = 14;
        }

        result = point1 - point2;
    }

    return result * (asc ? 1 : -1);
};

//转为客户端的牌
KQCard._convertCardsToCardNames = function (cards) {
    // [{"suit":"s","number":10}]
    var suitColorMap = ['', 'd', 'c', 'h', 's'];
    return cards.map(function (card) {
        var cardNumber = card.point;
        var color = suitColorMap[card.color];
        var number = Math.max(Math.min(cardNumber, 13), 1);
        return { number: number, suit: color };
    });
};

cc._RFpop();
},{"GetCardPointsSameCount":"GetCardPointsSameCount","KQCardColorsHelper":"KQCardColorsHelper","KQCardPointsHelper":"KQCardPointsHelper","NumberExtension":"NumberExtension"}],"KQGlabolSocketEventHander":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'babea3CWj9G1pWM9AkXao0n', 'KQGlabolSocketEventHander');
// scripts\Socket\KQGlabolSocketEventHander.js

var Socket = require('socket');
var KQGlobalEvent = require('KQGlobalEvent');
var KQNativeInvoke = require('KQNativeInvoke');

var KQGlabolSocketEventHander = {
    start: function start() {
        if (this._didStart) {
            return;
        }
        this._didStart = true;

        KQGlobalEvent.on(Socket.Event.ReceiveForceExit, this._forceExitApp, this);
    },

    _forceExitApp: function _forceExitApp(response) {
        KQNativeInvoke.forceExitApp();
    }
};

module.exports = KQGlabolSocketEventHander;

cc._RFpop();
},{"KQGlobalEvent":"KQGlobalEvent","KQNativeInvoke":"KQNativeInvoke","socket":"socket"}],"KQGlobalEvent":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd90d6OrggVEXa29ffA+vZY0', 'KQGlobalEvent');
// scripts\Event\KQGlobalEvent.js

var KQGlobalEvent = {
    _handles: {},
    //发送事件
    emit: function emit(eventName) {
        var data = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        if (typeof data == 'string') {
            data = { 'data': data };
        }

        var returns = []; //返回值
        data.eventName = eventName; //保存一下事件名字

        for (var findEvenName in this._handles) {
            if (findEvenName == eventName) {
                for (var i = 0; i < this._handles[findEvenName].length; i++) {
                    var returnValue = this._handles[findEvenName][i](data);
                    returns.push(returnValue);
                }
            }
        }

        return returns;
    },
    //添加普通事件
    on: function on(eventName, callback, target) {
        // console.log('收到事件', eventName);
        this._handles[eventName] = this._handles[eventName] || [];

        this._handles[eventName].push(callback.bind(target));
        callback._caller = target;
    },

    //通过事件名移除一个监听器
    off: function off(eventName) {
        for (var i = 0; i < this._handles[eventName].length; i++) {
            this._handles[eventName][i] = null;
        }
    },

    // 移动一个 target 上所有的监听
    offTarget: function offTarget(target) {
        for (var name in this._handles) {
            var eventHandlers = this._handles[name];
            var indexs = eventHandlers.filter(function (callback) {
                return callback._caller = target;
            }).map(function (callback, index) {
                return index;
            });

            var indexOffset = 0;
            indexs.forEach(function (index) {
                eventHandlers.splice(index + indexOffset, 1);
                indexOffset = indexOffset + 1;
            });
        }
    }
};

module.exports = KQGlobalEvent;

cc._RFpop();
},{}],"KQNativeInvoke":[function(require,module,exports){
"use strict";
cc._RFpush(module, '7327dLBqWVNaJ14fJQ4jq6Y', 'KQNativeInvoke');
// scripts\Utils\KQNativeInvoke.js

var KQNativeInvoke = {
  IOSClassName: "AppController",
  ANDRIODClassName: "com/gongpa/ssz/AppActivity",

  isNativeIOS: function isNativeIOS() {
    var platform = cc.sys.platform;
    if (platform == cc.sys.IPHONE || platform == cc.sys.IPAD) {
      return true;
    }
    return false;
  },

  isNativeAndroid: function isNativeAndroid() {
    var platform = cc.sys.platform;
    if (platform == cc.sys.ANDROID) {
      return true;
    }
    return false;
  },

  isNative: function isNative() {
    return cc.sys.isNative == true;
  }
};

// MARK: 可调用的本地方法
/**
 * 微信登录
 */
KQNativeInvoke.wxLogin = function () {
  if (!KQNativeInvoke.isNative()) {
    return;
  }

  if (KQNativeInvoke.isNativeIOS()) {
    jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "wxLogin"); //IOS
  } else if (KQNativeInvoke.isNativeAndroid()) {
      //Android
      jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "wxLogin", "()V");
    }
};

/**
 * 分享大厅信息到微信好友
 * 
 */
KQNativeInvoke.shareHallToWeChatFriend = function () {
  if (!KQNativeInvoke.isNative()) {
    return;
  }

  if (KQNativeInvoke.isNativeIOS()) {
    jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "wxShareHallFriend");
  } else {
    //Android
    jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "wxShareHallFriend", "()V");
  }
};

/**
 * 分享大厅信息到朋友圈
 * 
 */
KQNativeInvoke.shareHallToWeChatTimeline = function () {
  if (!KQNativeInvoke.isNative()) {
    return;
  }

  if (KQNativeInvoke.isNativeIOS()) {
    jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "wxShareHallTimeline");
  } else {
    //Android
    jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "wxShareHallTimeline", "()V");
  }
};

/**
 * 强制退出 APP
 * 
 */
KQNativeInvoke.forceExitApp = function () {
  if (!KQNativeInvoke.isNative()) {
    return;
  }

  if (KQNativeInvoke.isNativeIOS()) {
    jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "exitApp");
  } else {
    //Android
    jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "exitApp", "()V");
  }
};

/**
 * 下载新版本
 * 
 * @param {String} iosUrl      iOS 版本地址
 * @param {String} androidUrl  安卓版本地址
 */
KQNativeInvoke.downloadNewVersion = function (iosUrl, androidUrl) {
  if (KQNativeInvoke.isNativeIOS()) {
    jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "downloadNewVersion:", iosUrl);
  } else {
    //Android
    jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "downloadNewVersion", "(Ljava/lang/String;)V", androidUrl);
  }
};

/**
 * 分享房间给微信好友
 * 
 * @param {String} roomId         房间 id 信息
 * @param {String} description    文本描述
 */
KQNativeInvoke.shareRoomToWeChatFriend = function (roomId, description) {
  if (KQNativeInvoke.isNativeIOS()) {
    jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "wxShareFriend:description:", id, description, title);
  } else if (KQNativeInvoke.isNativeAndroid()) {
    //Android
    jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "wxShareFriend", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", id, description, title);
  }
};

/**
 * 分享房间到微信朋友圈
 * 
 * @param {String} roomId         房间 id 信息
 * @param {String} description    文本描述
 */
KQNativeInvoke.shareRoomToWeChatTimeline = function (roomId, description) {
  if (KQNativeInvoke.isNativeIOS()) {
    jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "wxShare:description:", id, description, title);
  } else if (KQNativeInvoke.isNativeAndroid()) {
    //Android
    jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "wxShare", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", id, description, title);
  }
};

/**
 * 分享屏幕截图到微信好友
 */
KQNativeInvoke.shareScreenToWeChatFriend = function () {
  if (KQNativeInvoke.isNativeIOS()) {
    jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "wxScreenShareFriend");
  } else {
    //Android
    jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "wxScreenShareFriend", "()V");
  }
};

/**
 * 分享屏幕截图到微信朋友圈
 */
KQNativeInvoke.shareScreenToWeChatTimeline = function () {
  if (KQNativeInvoke.isNativeIOS()) {
    jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "wxScreenShare");
  } else {
    //Android
    jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "wxScreenShare", "()V");
  }
};

/**
 * 开始录音
 */
KQNativeInvoke.startRecord = function () {
  if (!KQNativeInvoke.isNative()) {
    return;
  }

  if (KQNativeInvoke.isNativeIOS()) {
    jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "record");
  } else if (KQNativeInvoke.isNativeAndroid()) {
    jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "record", "()V");
  }
};

/**
 * 结束录音
 */
KQNativeInvoke.endRecord = function () {
  if (!KQNativeInvoke.isNative()) {
    return;
  }

  if (KQNativeInvoke.isNativeIOS()) {
    jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "endRecord");
  } else if (KQNativeInvoke.isNativeAndroid()) {
    jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "endRecord", "()V");
  }
};

KQNativeInvoke.screenshotShare = function () {
  var strings = arguments.length <= 0 || arguments[0] === undefined ? 'shareIMG' : arguments[0];

  if (this._isCapturing) {
    return;
  }
  this._isCapturing = true;
  var size = cc.director.getWinSize();
  var fileName = "result_share.jpg";
  var fullPath = jsb.fileUtils.getWritablePath() + fileName;
  if (jsb.fileUtils.isFileExist(fullPath)) {
    jsb.fileUtils.removeFile(fullPath);
  }
  var texture = new cc.RenderTexture(Math.floor(size.width), Math.floor(size.height), cc.IMAGE_FORMAT_PNG, gl.DEPTH24_STENCIL8_OES);
  texture.setPosition(cc.p(size.width / 2, size.height / 2));
  texture.begin();
  cc.director.getRunningScene().visit();
  texture.end();
  texture.saveToFile(fileName, cc.IMAGE_FORMAT_PNG);

  var self = this;
  var tryTimes = 0;
  var fn = function fn() {
    if (jsb.fileUtils.isFileExist(fullPath)) {

      if (cc.sys.os == cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod(self.ANDRIODClassName, strings, "(Ljava/lang/String;)V", fullPath);
      }
      self._isCapturing = false;
    } else {
      tryTimes++;
      if (tryTimes > 10) {
        console.log("time out...");
        return;
      }
      setTimeout(fn, 50);
    }
  };
  setTimeout(fn, 50);
};

/**
 * 播放网络语音
 * 
 * @param {String} audioUrl 语音地址
 */
KQNativeInvoke.playAudioWithUrl = function (audioUrl) {
  if (!KQNativeInvoke.isNative()) {
    return;
  }

  if (KQNativeInvoke.isNativeIOS()) {
    jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "playUrl:", audioUrl);
  } else if (KQNativeInvoke.isNativeAndroid()) {
    //Android
    jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "playUrl", "(Ljava/lang/String;)V", audioUrl);
  }
};

module.exports = KQNativeInvoke;

cc._RFpop();
},{}],"MsgControl":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'dd242dsY+hBG5LpL7ZF7Kn6', 'MsgControl');
// scripts\Chat\MsgControl.js

var Socket = require('socket');
var ChatMessage = require('ChatMessage');
var AudioManager = require('AudioManager');

// 用来发送消息的 component
cc.Class({
    'extends': cc.Component,

    properties: {
        //bqNode:cc.Node,
        //bqNode1:cc.Node,
        //btnLanguageNode:cc.Node,
        //btnLanguageNode1:cc.Node,
        //btnChartNode:cc.Node,
        //btnChartNode1:cc.Node,
        textScrollView: cc.Node,
        imageContentNode: cc.Node,

        editBox: cc.EditBox,

        textRecordScrollView: cc.ScrollView,
        textRecordLayout: cc.Layout,

        textPrefab: cc.Prefab,
        chatTextRecordPrefab: cc.Prefab,
        emojiPrefab: cc.Prefab,
        // imagePrefab:cc.Prefab,

        biaoqing: [cc.Node], // [亮的背景, 暗的背景]   快捷语
        kuaijieyu: [cc.Node], // [亮的背景, 暗的背景]   表情
        content: [cc.Node], // [快捷语, 表情]  
        inputNode: cc.Node,
        emoji: [cc.Node],
        _userId: null,

        _playerInfos: null, // 记录用户信息
        _chatTextMessageRecords: null },

    // 聊天文本消息记录
    // use this for initialization
    onLoad: function onLoad() {
        this._userId = Socket.instance.userInfo.id;
        this._playerInfos = [];
        this.textContent = this.textScrollView.getComponent(cc.ScrollView).content;
        // this.imageContent = this.imageScrollView.getComponent(cc.ScrollView).content;
        var self = this;
        var textData = AudioManager.instance.chatTexts();
        for (var i = 0; i < textData.length; i++) {
            var item = cc.instantiate(this.textPrefab);
            item.getComponent('cellText').setText(textData[i]);
            item.getComponent('cellText').onSelectAction = function (text) {
                self.onTextClickAction(text);
            };
            this.textContent.h = 1000;
            this.textContent.addChild(item);
        }
    },

    clickKuaiJieYu: function clickKuaiJieYu() {
        this.kuaijieyu[0].active = true; // 快捷语 背景
        this.kuaijieyu[1].active = false; // 快捷语 按钮
        this.biaoqing[0].active = false; // 背景表情
        this.biaoqing[1].active = true; // 表情按钮
        this.content[0].active = true;
        this.content[1].active = false;
    },
    clickBiaoQing: function clickBiaoQing() {
        this.biaoqing[0].active = true; // 背景表情
        this.biaoqing[1].active = false; // 表情按钮
        this.kuaijieyu[0].active = false; // 快捷语 背景
        this.kuaijieyu[1].active = true; // 快捷语 按钮
        this.content[0].active = false;
        this.content[1].active = true;
    },
    onTextClickAction: function onTextClickAction() {
        var text = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];

        this.editBox.string = "";
        this.sendText(text);
    },

    clickEmoji: function clickEmoji(event, emojiName) {
        var string = this.editBox.string;
        this.editBox.string = string + "<" + emojiName + ">";
        this.sendEmoji(emojiName);
    },

    clickSend: function clickSend() {
        var string = this.editBox.string || "";
        if (string.length == 0) {
            return;
        }
        this.editBox.string = "";
        this.sendText(string);
    },

    sendEmoji: function sendEmoji(emojiName) {
        if (emojiName.length == 0) {
            return;
        }
        Socket.sendEmoji(this._userId, emojiName);
        this.dismiss();
    },

    sendText: function sendText() {
        var text = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];

        if (text.length == 0) {
            return;
        }
        Socket.sendText(this._userId, text);
        this.dismiss();
    },

    dismiss: function dismiss() {
        this.node.active = false;
    },

    bqAction: function bqAction() {
        this.bqNode1.active = this.btnLanguageNode.active = this.btnChartNode1.active = true;
        this.bqNode.active = this.btnLanguageNode1.active = this.btnChartNode.active = false;
        this.textScrollView.active = false;
        this.imageContentNode.active = true;
        this.textRecordScrollView.node.active = false;
    },

    textAction: function textAction() {
        this.bqNode1.active = this.btnLanguageNode.active = this.btnChartNode.active = false;
        this.bqNode.active = this.btnLanguageNode1.active = this.btnChartNode1.active = true;
        this.textScrollView.active = true;
        this.imageContentNode.active = false;
        this.textRecordScrollView.node.active = false;
    },

    chartAction: function chartAction() {
        this.bqNode1.active = this.btnLanguageNode1.active = this.btnChartNode1.active = false;
        this.bqNode.active = this.btnLanguageNode.active = this.btnChartNode.active = true;
        this.textScrollView.active = this.imageContentNode.active = false;
        this.textRecordScrollView.node.active = true;
    },

    addPlayerInfos: function addPlayerInfos(playerInfos) {
        this._playerInfos = this._playerInfos || [];

        playerInfos.forEach((function (userInfo) {
            var haveUserInfo = this._playerInfos.find(function (ownUserInfo) {
                return ownUserInfo.id == userInfo.id;
            });

            if (haveUserInfo == null) {
                this._playerInfos.push(userInfo);
            }
        }).bind(this));
    },

    addChatTextMessage: function addChatTextMessage(userId, text) {
        this._playerInfos = this._playerInfos || [];

        var nickname = "[ID:" + userId + "说]：";
        var userInfo = this._playerInfos.find(function (userInfo) {
            return userInfo.id == userId;
        });

        if (userInfo) {
            nickname = "[" + userInfo.nickname + "说]：";
        }

        var str = nickname + text;
        str = ChatMessage.parseString(str);
        this._addChatTextToRecord(str);
    },

    addChatEmojiMessage: function addChatEmojiMessage(userId, emoji) {
        this._playerInfos = this._playerInfos || [];

        var nickname = "[ID:" + userId + "说]：";
        var userInfo = this._playerInfos.find(function (userInfo) {
            return userInfo.id == userId;
        });
        if (userInfo) {
            nickname = "[" + userInfo.nickname + "说]：";
        };
        var str = nickname + emoji;
        str = ChatMessage.parseString(str);
        this._addChatEmojiToRecord(emoji);
        // cc.log(emoji)
        // cc.log('---190')
    },

    _addChatEmojiToRecord: function _addChatEmojiToRecord(emoji) {
        var self = this;
        this._loadEmojiFrame(emoji, function (frame) {
            //var item  = cc.instantiate(self.emojiPrefab);
            //cc.log(frame)
            //var btnSprites =  item.getComponent(cc.Sprite);
            //btnSprites.spriteFrame = frame;
            //let chatEmojiRecord = item.getComponent('ChatTextRecord');
            //chatEmojiRecord.setEmoji(frame);
            ChatMessage.setEmoji(frame);
        });
    },

    _loadEmojiFrame: function _loadEmojiFrame(Emojiname, callback) {
        cc.loader.loadRes("/textures/chat/bq", cc.SpriteAtlas, (function (err, atlas) {
            if (err) {
                //console.log(null, err)
                return;
            }
            var frame = atlas.getSpriteFrame(Emojiname);
            callback(frame);
        }).bind(this));
    },

    _addChatTextToRecord: function _addChatTextToRecord(text) {
        var item = cc.instantiate(this.chatTextRecordPrefab);
        var chatTextRecord = item.getComponent('ChatTextRecord');
        chatTextRecord.setString(text);

        this.textRecordLayout.node.addChild(item);
        this.textRecordScrollView.scrollToBottom();
    }
});

cc._RFpop();
},{"AudioManager":"AudioManager","ChatMessage":"ChatMessage","socket":"socket"}],"NetworkError":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'c99d35Sy6hDPbrte9nVczxP', 'NetworkError');
// scripts\NetworkError.js

var manager = require('manager');
var KQNativeInvoke = require('KQNativeInvoke');

cc.Class({
    'extends': cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function onLoad() {},

    exitAction: function exitAction() {
        cc.director.end();
        if (KQNativeInvoke.isNativeIOS()) {
            jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "exitApp");
        } else {
            //Android
            jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "exitApp", "()V");
        }
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{"KQNativeInvoke":"KQNativeInvoke","manager":"manager"}],"NumberExtension":[function(require,module,exports){
"use strict";
cc._RFpush(module, '80e21gZRpNM4pIiCpZ+7s8m', 'NumberExtension');
// scripts\Extensions\NumberExtension.js

// number.kq_times(f)   调用多次

if (!Number.prototype.kq_times) {

    /**
     * 调用一个方法 this 次
     * 
     * @param  {Function} f 要调用的方法
     * @param  {Object}   thisArg   可选； f 的 this值
     */
    Number.prototype.kq_times = function (f, thisArg) {
        if (!f) {
            return;
        }

        for (var i = 0; i < this; ++i) {
            if (thisArg) {
                f.apply(thisArg, i);
            } else {
                f(i);
            }
        }
    };
}

cc._RFpop();
},{}],"Playback":[function(require,module,exports){
"use strict";
cc._RFpush(module, '0d3095dnBVFo5D1hEDDa5KQ', 'Playback');
// scripts\Playback\Playback.js

var Socket = require('socket');

// 用于回放的组件
var Playback = cc.Class({
  'extends': cc.Component,

  properties: {
    _playbackDatas: null, // 用于回放的数据
    _isPlaybacking: false
  },

  statics: {
    instance: null
  },

  onLoad: function onLoad() {
    Playback.instance = this;
    cc.game.addPersistRootNode(this.node);
  },

  // 设置回放数据
  setPlaybackDatas: function setPlaybackDatas(datas) {
    this._playbackDatas = datas;
  },

  // 清空回放数据。同时会清空回放
  removePlaybackDatas: function removePlaybackDatas() {
    this.setPlaybackDatas(null);
    this.stopPlayback();
  },

  // 是否包含回放数据
  isContainPlaybackDatas: function isContainPlaybackDatas() {
    return this._playbackDatas != null;
  },

  // 开始回放
  startPlayback: function startPlayback() {
    // 模拟 socket 接收到了事件即可
    //cc.log("Playback 开始回放");

    this._isPlaybacking = true;

    if (!this._playbackDatas) {
      cc.error("想回放，却没有回放数据");
      this.stopPlayback();
      return;
    }

    this._executePlayback();
  },

  // 停止回放
  stopPlayback: function stopPlayback() {
    this._isPlaybacking = false;
    this.unscheduleAllCallbacks();
  },

  // 是否正在回放
  isPlaybacking: function isPlaybacking() {
    return this._isPlaybacking;
  },

  // 执行真正的回放操作
  _executePlayback: function _executePlayback() {
    var startTime = 1.0;
    var interval = 3.0;
    cc.log(this._playbackDatas);

    // 在某些特殊情况下
    // 回放数据里会包含两套 gameOver action
    // 所以需要过滤掉其中一个
    this._playbackDatas = this._playbackDatas.filter((function (string, index) {
      if (index == this._playbackDatas.length - 1) {
        return true;
      }

      return string.indexOf('"action":"gameOver') == -1;
    }).bind(this));

    this._playbackDatas.forEach((function (data, index) {
      var delay = startTime + index * interval;
      if (index == this._playbackDatas.length - 1) {
        // 如果是最后一个，则应该只间隔一秒
        delay = startTime + (index - 1) * interval + 1;
      }

      this.scheduleOnce(function () {
        cc.log("回放开始模拟 Socket 接收到服务器消息, ", index);
        Socket.instance._dispatchResponse(data);
      }, delay);
    }).bind(this));
  }

});

module.exports = Playback;

cc._RFpop();
},{"socket":"socket"}],"Player":[function(require,module,exports){
"use strict";
cc._RFpush(module, '6ffa0O02PFOp78QADTW5zGf', 'Player');
// scripts\Play\Player.js

var Socket = require('socket');
var KQGlobalEvent = require('KQGlobalEvent');
var ArrayExtension = require('ArrayExtension');
var UserModelHelper = require('UserModelHelper');
var Playback = require('Playback');
var KQCardResHelper = require('KQCardResHelper');
var KQCard = require('KQCard');
var AudioManager = require('AudioManager');

cc.Class({
    'extends': cc.Component,

    properties: {
        foldCardNode: cc.Node, // 牌盖着时的样子
        teShuPaiNode: cc.Node, // 特殊牌盖着时的样子
        cardsBackLayout: cc.Layout, // 13张牌背影，可用来展示发牌动画 含 cardsBack Component
        compareCardsNode: cc.Node, // compareCards   含 CompareCards Component
        userInfoNode: cc.Node, // 包含用户信息 含 userInfo Component
        chatMessageNode: cc.Node, // 聊天消息 包含 ChatMessage Component
        userAvatarNode: cc.Node,
        //userSampleInfoNode: cc.Node,
        bulletHolePrefab: cc.Prefab, //中枪
        bulletHoleNode: cc.Node, //中枪
        shotNode: [cc.Node], //打枪
        userId: 0,
        cardTypePrefab: cc.Prefab,
        // 用户信息
        // 1、 如果 包含：cardInfo:[]，表明用户已经出牌
        //
        _userInfo: null,
        _deskInfo: null,
        /**/
        playedCompareCardsIndexs: {
            visible: false,
            'default': undefined
        }
        /**/
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.userAvatarNode.on(cc.Node.EventType.TOUCH_START, this._showUserInfo, this);
        this.reset();
        this.foldCardNodeBack = false; //判断是否点击了拍的背影
        this.cardSpriteAtlas = this.node.parent.getComponent('play').cardSpriteAtlas;
    },

    onDestroy: function onDestroy() {
        this.userAvatarNode.off(cc.Node.EventType.TOUCH_START, this._showUserInfo, this);
    },

    click_leave: function click_leave() {
        var userid = Socket.instance.userInfo.id;
        var leaveId = this._userInfo.id;
        Socket.sendQingli(leaveId, userid);
    },

    _showUserInfo: function _showUserInfo() {
        //this.userSampleInfoNode.getComponent('UserSampleInfo').updateWithUser(this._userInfo);
    },

    reset: function reset() {
        this.foldCardNode.active = false;
        this.cardsBackLayout.active = false;
        this.compareCardsNode.active = false;
        this.teShuPaiNode.active = false;
        this.bulletHoleNode.active = false;
        this.bulletHoleNode.removeAllChildren();
        this.bulletHoleNode.children.forEach(function (node) {
            node.active = false;
        });
        if (this.shotNode.length > 0) this.shotNode.forEach(function (node) {
            if (node) node.active = false;
        });
        this.compareCardsNode.getComponent('CompareCards').reset();
        this.compareCardsNode.getComponent('CompareCards').unscheduleAllCallbacks();
    },

    /*####*/
    reset2: function reset2() {
        this.foldCardNode.active = false;
        this.cardsBackLayout.active = false;
        this.teShuPaiNode.active = false;
        this.bulletHoleNode.active = false;
        this.bulletHoleNode.removeAllChildren();
        this.bulletHoleNode.children.forEach(function (node) {
            node.active = false;
        });
        if (this.shotNode.length > 0) this.shotNode.forEach(function (node) {
            if (node) node.active = false;
        });
        //this.compareCardsNode.active = false;
        //this.compareCardsNode.getComponent('CompareCards').reset();
    },
    /*#####*/

    updateUserInfoWithUsers: function updateUserInfoWithUsers(users) {
        var user = users.find((function (e) {
            return this.userId == e.id;
        }).bind(this));

        this.updateUserInfo(user);
    },
    showQingli: function showQingli(creator, index) {
        if (!this.node.active) {
            return;
        }
        if (index > 0) {
            this.userInfoNode.getComponent('userInfo').setqingli(false);
        } else {
            if (creator) {
                this.userInfoNode.getComponent('userInfo').setqingli(false);
            } else {
                this.userInfoNode.getComponent('userInfo').setqingli(true);
            }
        }
    },
    updateUserInfo: function updateUserInfo(user) {
        this._userInfo = user;
        this.node.active = user != null;
        this.userInfoNode.active = this.node.active;
        if (!user) {
            return;
        }

        var userInfo = this.userInfoNode.getComponent('userInfo');
        userInfo.updateAvatar(user.avatarUrl);
        userInfo.updateUserId(user.id);
        userInfo.updateNickname(user.nickname);
        userInfo.setOfflineVisible(!user.onlineStatus);

        //if (this._deskInfo && this._deskInfo.cIndex > 0) {
        //  if (UserModelHelper.isPlayedCards(user)) {
        //    this.playCard(user.id);
        //    this.compareCardsNode.getComponent('CompareCards').setCompareData(user);
        //  }
        //}
        /**/
        var cIndex = this._deskInfo.cIndex;
        if (this._deskInfo && cIndex > 0 && this.playedCompareCardsIndexs.indexOf(cIndex) == -1) {
            if (UserModelHelper.isPlayedCards(user)) {
                this.playCard(user.id, user.cardInfo);
                this.compareCardsNode.getComponent('CompareCards').setCompareData(user);
            }
        }
        /**/
    },

    // 更新房主信息
    updateBanker: function updateBanker() {
        var userInfoComp = this.userInfoNode.getComponent('userInfo');
        if (!this._userInfo) {
            userInfoComp.setIsBanker(false);
            return;
        }

        var isBanker = this._userInfo ? this._userInfo.isBanker : false;
        userInfoComp.setIsBanker(isBanker);
    },

    showFangZhuStatus: function showFangZhuStatus(createId) {
        var visible = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

        if (!this.node.active) {
            return;
        }
        if (this._userInfo.id == createId) {
            this.userInfoNode.getComponent('userInfo').setFangZhuNodeVisible(visible);
        }
    },

    /**
     * 更新分数
     *
     * @param {Number} score 用户分数、可选
     */
    updateScore: function updateScore(score) {
        if (!score && this._userInfo) {
            score = this._userInfo.totalScore;
        }

        var userInfo = this.userInfoNode.getComponent('userInfo');
        userInfo.updateScore(score);
    },

    showReadyStatus: function showReadyStatus(userId) {
        var visible = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

        if (!this.node.active) {
            return;
        }

        if (this._userInfo.id == userId) {
            this.userInfoNode.getComponent('userInfo').setReadyNodeVisible(visible);
        }
    },
    showBeilv: function showBeilv(userId, bl) {
        if (!this.node.active) {
            return;
        }
        if (this._userInfo.id == userId) {
            this.userInfoNode.getComponent('userInfo').setBeilvLabel(bl);
        }
    },
    /*setDeskInfo: function (deskInfo) {
     this._deskInfo = deskInfo;
     },*/
    updateDeskInfo: function updateDeskInfo(deskInfo) {
        this._deskInfo = deskInfo;

        if (deskInfo && !deskInfo.isCBegin) {
            this.reset();
        }
    },
    /**/

    hideReadyStatus: function hideReadyStatus() {
        this.userInfoNode.getComponent('userInfo').setReadyNodeVisible(false);
    },

    playFaPaiAnimation: function playFaPaiAnimation() {
        if (!this.node.active) {
            return;
        }
        if (UserModelHelper.isPlayedCards(this._userInfo)) {
            return;
        }
        var cardsBack = this.cardsBackLayout.getComponent('cardsBack');
        cardsBack.showPlayCardBacks();
    },

    shouldShowFaPaiAnimation: function shouldShowFaPaiAnimation() {
        return UserModelHelper.isPlayedCards(this._userInfo);
    },

    setUserOnlineStatus: function setUserOnlineStatus(userId) {
        var status = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

        if (userId != this.userId) {
            return;
        }

        var userInfo = this.userInfoNode.getComponent('userInfo');
        userInfo.setOfflineVisible(status != 1);
    },

    showChatText: function showChatText(userId, message) {
        if (userId != this.userId) {
            return;
        }

        var chatMessage = this.chatMessageNode.getComponent('ChatMessage');
        chatMessage.setString(message);
    },

    // 用户已经出牌，处于三堆盖着牌的状态
    playCard: function playCard(userId, cardInfo) {
        if (this.userId != userId) {
            return;
        }

        this.cardsBackLayout.node.active = false;
        this.compareCardsNode.active = false;
        this.foldCardNode.targetOff(this.foldCardNode);
        this.foldCardNode.active = true;
        this.foldCardNode.children.slice(0, 3).forEach((function (node) {
            node.active = true;
            node.children.forEach((function (noe) {
                noe.active = true;

                var cardSprite = noe.getComponent('cc.Sprite');

                var path = 'public-pic-card-poker-back';

                this._loadCardFrame(this.cardSpriteAtlas, path, cardSprite);
            }).bind(this));
        }).bind(this));
        this.foldCardNode.on(cc.Node.EventType.TOUCH_END, (function (event) {
            this._clickFoldCardNode(event);
        }).bind(this), this.foldCardNode);
    },

    _clickFoldCardNode: function _clickFoldCardNode(event) {

        if (this.userId != Socket.instance.userInfo.id) return;

        var cardInfo = this._userInfo.cardInfo.length == 1 ? this._userInfo.cardInfo[0].cards : this._userInfo.cardInfo;

        var cards = cardInfo.map((function (cardInfoItem) {

            if (this._userInfo.cardInfo.length == 1) return KQCard.cardsFromArray(cardInfoItem);

            return KQCard.cardsFromArray(cardInfoItem.cards);
        }).bind(this)).reduce(function (array, subCards) {
            return array.concat(subCards);
        }, []);

        var foldCardNode = this.foldCardNode.children.slice(0, 3);

        var nodes = foldCardNode.map(function (node) {
            return node.children;
        }).reduce(function (array, sub) {
            return array.concat(sub);
        }, []);

        cards.forEach((function (kqCard, index) {

            if (index >= nodes.length) return;

            nodes[index].removeAllChildren();

            nodes[index].getComponent(cc.Sprite).spriteFrame = "";

            var nodds1 = new cc.Node(); //创建一个节点对象

            nodds1.width = nodes[0].width;

            nodds1.height = nodes[0].height;

            nodds1.addComponent(cc.Sprite); //添加精灵组件

            var cardSprite = nodds1.getComponent('cc.Sprite');

            cardSprite.sizeMode = 0;

            var cardName = this.foldCardNodeBack == false ? kqCard.cardName() : "back";

            nodds1.cardName = cardName;

            var path = 'public-pic-card-poker-' + cardName;

            this._loadCardFrame(this.cardSpriteAtlas, path, cardSprite);

            if (cc.maPai == cardName) {

                var nodds = new cc.Node(); //创建一个节点对象

                nodds.addComponent(cc.Sprite); //添加精灵组件

                cc.loader.loadRes('play/desk/img_red5_1', cc.SpriteFrame, (function (err, spriteFrame) {

                    if (err) {
                        cc.error(err.message || err);return;
                    }

                    var btnSprite1 = nodds.getComponent(cc.Sprite);

                    btnSprite1.spriteFrame = spriteFrame;

                    btnSprite1.node.width = cardSprite.node.width + 10;

                    btnSprite1.node.height = cardSprite.node.height + 10;
                }).bind(this));

                cardSprite.node.addChild(nodds);
            }

            nodes[index].addChild(nodds1);
        }).bind(this));

        var cards0 = cards.slice(0, 3);
        var cards1 = cards.slice(3, 8);
        var cards2 = cards.slice(8, 13);

        cards = [cards0, cards1, cards2];
        //头道
        var typeName0 = KQCard.cardsType(cards0) + 1;
        typeName0 = typeName0 >= 10 ? typeName0 : "0" + typeName0;
        typeName0 = typeName0 == '04' ? '11' : typeName0;

        //中道
        var typeName1 = KQCard.cardsType(cards1) + 1;
        typeName1 = typeName1 >= 10 ? typeName1 : "0" + typeName1;
        typeName1 = typeName1 == '07' ? '22' : typeName1;

        //尾道
        var typeName2 = KQCard.cardsType(cards2) + 1;
        typeName2 = typeName2 >= 10 ? typeName2 : "0" + typeName2;

        if (typeName0) KQCard._setGuiCard(0, 0, 3, typeName0, cards, nodes, this.cardSpriteAtlas);
        if (typeName1) KQCard._setGuiCard(1, 3, 8, typeName1, cards, nodes, this.cardSpriteAtlas);
        if (typeName2) KQCard._setGuiCard(2, 8, 13, typeName2, cards, nodes, this.cardSpriteAtlas);
        if (this.foldCardNodeBack == false) {
            this.foldCardNodeBack = true;
        } else if (this.foldCardNodeBack == true) {
            this.foldCardNodeBack = false;
        }
    },

    _loadCardFrame: function _loadCardFrame(SpriteFrame, path, SpritesNode, w, h) {

        var Sprite = SpriteFrame.getSpriteFrame(path);

        SpritesNode.spriteFrame = Sprite;

        if (w) SpritesNode.node.width = w;

        if (h) SpritesNode.node.height = h;
    },

    // 准备好开始比牌
    // readyToCompareCards: function () {
    //     this.foldCardNode.targetOff(this.foldCardNode);
    //     this.foldCardNodeBack = true;
    //     this._clickFoldCardNode();
    //     this.cardsBackLayout.node.active = false;
    //     this.compareCardsNode.active = true;
    //     //this.foldCardNode.active = false;
    //     if(this.compareCardsNode.getComponent('CompareCards')._user){
    //         if(this.compareCardsNode.getComponent('CompareCards')._user.isContainExtra){
    //             this.teShuPaiNode.active = true;
    //         }else{
    //             this.teShuPaiNode.active = false;
    //         }
    //     }
    // },
    readyToCompareCards: function readyToCompareCards() {
        this.foldCardNode.targetOff(this.foldCardNode);
        this.foldCardNodeBack = true;
        this._clickFoldCardNode();
        this.cardsBackLayout.node.active = false;
        this.compareCardsNode.active = true;
        this.foldCardNode.active = true;
        if (this.compareCardsNode.getComponent('CompareCards')._user) {
            if (this.compareCardsNode.getComponent('CompareCards')._user.isContainExtra) {
                this.teShuPaiNode.active = true;
            } else {
                this.teShuPaiNode.active = false;
            }
        }
    },

    // 播放打枪动画
    // @param userId   要主动打枪的用户id
    // @param toUserIndex  挨枪的用户的 index
    playShootAnimation: function playShootAnimation(userId, toUserIndex) {
        if (userId != this.userId) {
            return;
        }
        var shotNode = this.shotNode[toUserIndex];
        shotNode.active = true;
        shotNode.children[0].active = true;
        shotNode.children[1].active = true;

        //枪
        var rotateBy = cc.rotateTo(0.1, -15);
        var delay1 = cc.delayTime(0.1);
        var rotateBy1 = cc.rotateTo(0.1, 0);
        var start_func1 = cc.callFunc(function () {
            shotNode.children[0].active = true;
        });
        var end_func1 = cc.callFunc(function () {
            shotNode.children[0].active = false;
        });
        var action = cc.repeat(cc.sequence(start_func1, rotateBy, delay1, rotateBy1, end_func1), 3);

        //烟
        var fadeIn = cc.fadeIn(0);
        var scaleTo1 = cc.scaleTo(0, 0.8);
        var scaleTo2 = cc.scaleTo(0.08, 1);
        var fadeOutAndScaleTo = cc.spawn(cc.fadeOut(0.02), cc.scaleTo(0.02, 0.5));
        var delay2 = cc.delayTime(.2);
        var start_func2 = cc.callFunc(function () {
            shotNode.children[1].active = true;
        });
        var end_func2 = cc.callFunc(function () {
            shotNode.children[1].active = false;
        });
        var action1 = cc.repeat(cc.sequence(start_func2, fadeIn, scaleTo1, scaleTo2, fadeOutAndScaleTo, delay2, end_func2), 3);

        shotNode.children[0].runAction(action);
        shotNode.children[1].runAction(action1);

        //let userInfo = this.userInfoNode.getComponent('userInfo');
        //userInfo.playShootAnimation(toUserIndex);
    },

    // 播放中枪动画
    playBulletHoleAnimation: function playBulletHoleAnimation(userId) {
        if (userId != this.userId) {
            return;
        }

        this.bulletHoleNode.active = true;

        var bulletHoleNode = cc.instantiate(this.bulletHolePrefab);

        bulletHoleNode.children.forEach((function (node) {
            node.active = false;
        }).bind(this));

        bulletHoleNode.children[0].y = 0;

        this.bulletHoleNode.addChild(bulletHoleNode);

        var interval = 0.3;

        var initTime = 0;

        bulletHoleNode.children.forEach((function (node) {

            this.scheduleOnce(function () {

                AudioManager.instance.playHumanZQiang();

                node.active = true;

                var y = Math.round(Math.random()) == 0 ? -1 : 1;

                y = Math.floor(Math.random() * 38) * y;

                var x = Math.round(Math.random()) == 0 ? -1 : 1;

                x = Math.floor(Math.random() * 38) * x;

                node.x = x;

                node.y = y;
            }, initTime);

            initTime = initTime + interval;
        }).bind(this));
    },

    // 播放全垒打动画
    playHomeRunAimation: function playHomeRunAimation(userId) {
        if (userId != this.userId) {
            return;
        }

        var userInfo = this.userInfoNode.getComponent('userInfo');
        userInfo.playHomeRunAimation();
    },

    playSpeakAnimation: function playSpeakAnimation(userId) {
        if (userId != this.userId) {
            return;
        }

        var userInfo = this.userInfoNode.getComponent('userInfo');
        userInfo.playSpeakAnimation();
    },

    nextCompareScore: function nextCompareScore() {
        if (!this.node.active) {
            return 0;
        }

        var score = this.compareCardsNode.getComponent('CompareCards').nextCompareScore();
        return score;
    },

    showNextCompareCards: function showNextCompareCards() {
        if (this.nextCompareScore() <= 0) {
            return;
        }
        this.teShuPaiNode.active = false;
        this.compareCardsNode.getComponent('CompareCards').showNextCards();
    },

    showAllCompareCards: function showAllCompareCards(users) {
        var user = users.find((function (e) {
            return this.userId == e.id;
        }).bind(this));
        this.compareCardsNode.getComponent('CompareCards').setCompareData(user);
        this.compareCardsNode.getComponent('CompareCards').showAllCards();

        this.updateScore(this._userInfo.totalScore || 0);
    },

    showNextCompareScore: function showNextCompareScore(isContainExtra) {
        this.compareCardsNode.getComponent('CompareCards').showNextCompareScore(isContainExtra);
    },

    showScoreResult: function showScoreResult() {
        this.compareCardsNode.getComponent('CompareCards').showScoreResult();
    }
});

cc._RFpop();
},{"ArrayExtension":"ArrayExtension","AudioManager":"AudioManager","KQCard":"KQCard","KQCardResHelper":"KQCardResHelper","KQGlobalEvent":"KQGlobalEvent","Playback":"Playback","UserModelHelper":"UserModelHelper","socket":"socket"}],"ResultItem":[function(require,module,exports){
"use strict";
cc._RFpush(module, '9b2behcoUlLYL1MIMs+04wI', 'ResultItem');
// scripts\Play\ResultItem.js

var KQCardResHelper = require('KQCardResHelper');
var SpriteHelper = require('SpriteHelper');
var KQCard = require('KQCard');

cc.Class({
  'extends': cc.Component,

  properties: {
    avatarSprite: cc.Sprite,
    labelNickname: cc.Label,
    labelResultNumber: cc.Label,
    layoutTouDao: cc.Layout,
    layoutZhongDao: cc.Layout,
    layoutWeiDao: cc.Layout,
    layoutTeShu: cc.Layout,

    labelTeShuPaiTitle: cc.Label,

    scoreUnitNode: cc.Node, // 积分
    diamondUnitNode: cc.Node },

  // 钻石
  onLoad: function onLoad() {},

  //{"id":100049,"nickname":"imya","openId":"xx","avatarUrl":"xx","sex":1,
  // "cardNumber":3,"onlineStatus":1,"inviteCode":"","ipAddress":"::ffff:222.244.65.201",
  // "lastLoginTime":"2017-04-13 22:09:01","createAt":"2017-04-11 22:39:30",
  // "updateAt":"2017-04-13 22:09:01",
  // "cards":[],"roomId":"598883","readyStatus":true,"totalScore":0,
  // "cScore":0,"isBanker":false}
  updateWithPlayerInfo: function updateWithPlayerInfo(playerInfo) {
    var isRandomRoom = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    SpriteHelper.setImageUrl(this.avatarSprite, playerInfo.avatarUrl);
    this.labelNickname.string = playerInfo.nickname;
    //cc.log(this.labelResultNumber.string)
    //cc.log(playerInfo)
    //cc.log(playerInfo.cScore)
    //cc.log('---36')
    this.labelResultNumber.string = playerInfo.cScore;

    this.scoreUnitNode.active = !isRandomRoom;
    this.diamondUnitNode.active = isRandomRoom;
    var Number = playerInfo.cScore;
    if (isRandomRoom) {
      // 如果是随机场的话，则显示钻石数量
      Number = playerInfo.cScore * 5;
    }
    this.labelResultNumber.string = Number;
  },

  setCards: function setCards(cards) {
    cc.assert(cards.length == 13);

    // 不会再有特殊牌了
    /*if (KQCard.isTeShuPai(cards)) {
      this.setTeShuCards(cards);
      return;
      }
    */

    //let touCards = cards.slice(0, 3);
    //let zhongCards = cards.slice(3, 3 + 5);
    //let weiCards = cards.slice(8);
    //this.setTouCards(touCards);
    //this.setZhongCards(zhongCards);
    //this.setWeiCards(weiCards);
  }

});
/*setTouCards: function (cards) {
  this._setCardsToLayout(this.layoutTouDao, cards);
},
 setZhongCards: function (cards) {
  this._setCardsToLayout(this.layoutZhongDao, cards);
},
  setWeiCards: function (cards) {
  this._setCardsToLayout(this.layoutWeiDao, cards);
},*/

//结算  将特殊牌放入Layout
/*setTeShuCards: function (cards) {
  this.layoutTeShu.node.active = true;
  this.layoutTouDao.node.active = false;
  this.layoutZhongDao.node.active = false;
  this.layoutWeiDao.node.active = false;
  this._setCardsToLayout(this.layoutTeShu, cards);
   let typeName = KQCard.cardsTypeName(cards);
  this.labelTeShuPaiTitle.string = typeName;
},*/

//结算将牌放到Layout里面
/*_setCardsToLayout: function (layout, cards) {
  let node = layout.node;
  node.children.forEach(function (spriteNode, index) {
    let sprite = spriteNode.getComponent('cc.Sprite');
    let card = cards[index];
    if (!card) {
      return;
    }
     KQCardResHelper.setCardSpriteFrame(sprite, card.cardName());
  });
},*/

cc._RFpop();
},{"KQCard":"KQCard","KQCardResHelper":"KQCardResHelper","SpriteHelper":"SpriteHelper"}],"Setting":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'f3ad6mNk4BMBZzipGQDNlr4', 'Setting');
// scripts\Setting\Setting.js

var Manager = require('manager');
var KQNativeInvoke = require('KQNativeInvoke');

cc.Class({
  'extends': cc.Component,

  properties: {
    phone: cc.Label,
    musicSlider: cc.Node,
    effectSlider: cc.Node,
    btnSwitchAccount: cc.Button,
    shareBg: cc.Node,
    wx: cc.Node,
    pyq: cc.Node,
    music: cc.Node,
    sounds: cc.Node,
    _audioManager: null,
    _musicOn: 1,
    _soundsOn: 1,
    _phone: null
  },

  // use this for initialization
  onLoad: function onLoad() {
    this._audioManager = cc.find('AudioManager') || {};
    this._audioManager = this._audioManager.getComponent('AudioManager');
    this._initSliders();
    this.phone.string = this._phone ? this._phone : "无";
    var bgMusic = cc.sys.localStorage.getItem("bgMusic");
    var bgSound = cc.sys.localStorage.getItem("bgSound");
    //console.log(bgMusic);
    if (bgMusic != '') {
      if (parseInt(bgMusic) == 1) {
        this._musicOn = 1;
        this.music.getChildByName('music_on').active = true;
        this.music.getChildByName('music_off').active = false;
      } else {
        this._musicOn = 0;
        this.music.getChildByName('music_on').active = false;
        this.music.getChildByName('music_off').active = true;
      }
    }
    if (bgSound == 0) {
      // 如果背景音效是关闭的
      if (parseInt(bgSound) == 0) {
        this._soundsOn = 0;
        this.sounds.getChildByName('sounds_on').active = false;
        this.sounds.getChildByName('sounds_off').active = true;
      } else {
        this._soundsOn = 1;
        this.sounds.getChildByName('sounds_on').active = true;
        this.sounds.getChildByName('sounds_off').active = false;
      }
      this._audioManager.setEffectMusicVolum(this._soundsOn);
    }
  },
  clickWx: function clickWx() {
    //点击微信
    if (!cc.sys.isNative) {
      this.shareBg.active = true;
      this.wx.active = true;
    } else {
      var title = cc.sys.localStorage.getItem('shareTitle');
      var description = cc.sys.localStorage.getItem('desc');
      var recordId = cc.sys.localStorage.getItem('recordId');
      var roomId = cc.sys.localStorage.getItem('roomId');
      var id = '';
      if (roomId) {
        id = 'roomId=' + roomId;
      }
      if (recordId) {
        id = 'recordId=' + recordId;
      }
      if (KQNativeInvoke.isNativeIOS()) {
        jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "wxShareFriend:description:", id, description, title);
      } else if (KQNativeInvoke.isNativeAndroid()) {
        //Android
        var str = "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V";
        jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "wxShareFriend", str, id, description, title);
      }
    }
  },
  clickPyq: function clickPyq() {
    //点击朋友圈
    if (!cc.sys.isNative) {
      this.shareBg.active = true;
      this.pyq.active = true;
    } else {
      var title = cc.sys.localStorage.getItem('shareTitle');
      var description = cc.sys.localStorage.getItem('desc');
      var recordId = cc.sys.localStorage.getItem('recordId');
      var roomId = cc.sys.localStorage.getItem('roomId');
      var id = '';
      if (roomId) {
        id = 'roomId=' + roomId;
      }
      if (recordId) {
        id = 'recordId=' + recordId;
      }
      if (KQNativeInvoke.isNativeIOS()) {
        jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "wxShareHallTimeline:description:", id, description, title);
      } else if (KQNativeInvoke.isNativeAndroid()) {
        //Android
        var str = "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V";
        jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "wxShareHallTimeline", str, id, description, title);
      }
    }
  },

  clickshareBg: function clickshareBg() {
    // 点击分享背景图
    this.shareBg.active = false;
    this.wx.active = false;
    this.pyq.active = false;
  },
  clickMusic: function clickMusic() {
    //点击音乐
    this.music.children[1].active = this._musicOn = !this._musicOn;
    this.music.children[2].active = !this._musicOn;
    var volume = 0;
    if (this._musicOn) {
      this._audioManager.setBgMusicVolumn(1);
      this._audioManager.playMusic();
      volume = 1;
    } else {
      this._audioManager.setBgMusicVolumn(0);
      volume = 0;
    }
    cc.sys.localStorage.setItem("bgMusic", volume);
  },

  clickSounds: function clickSounds() {
    //点击了音效
    this.sounds.children[1].active = this._soundsOn = !this._soundsOn;
    this.sounds.children[2].active = !this._soundsOn;
    var volume = 0;
    if (this._soundsOn) {
      this._audioManager.setEffectMusicVolum(1);
      volume = 1;
    } else {
      this._audioManager.setEffectMusicVolum(0);
      volume = 0;
    }
    cc.sys.localStorage.setItem("bgSound", volume);
  },
  clickSetting: function clickSetting() {//点击设置

  },
  _initSliders: function _initSliders() {
    this._initSliderEvents();

    var musicVal = Manager.getMusicValue();
    var effectVal = Manager.getMusicEffectValue();

    this._audioManager.setBgMusicVolumn(musicVal);
    this._audioManager.setEffectMusicVolum(effectVal);

    this.musicSlider.getComponent('slider').setValue(musicVal);
    this.effectSlider.getComponent('slider').setValue(effectVal);
  },

  _initSliderEvents: function _initSliderEvents() {
    var self = this;
    this.musicSlider.getComponent('slider').onValueChange = function (value) {
      Manager.setMusicValue(value);
      self._audioManager.setBgMusicVolumn(value);
    };

    this.effectSlider.getComponent('slider').onValueChange = function (value) {
      Manager.setMusicEffectValue(value);
      self._audioManager.setEffectMusicVolum(value);
    };
  },

  clickSwitch: function clickSwitch() {},

  hideSwitch: function hideSwitch() {
    if (this.btnSwitchAccount) {
      this.btnSwitchAccount.node.active = false;
    }
  }
});

cc._RFpop();
},{"KQNativeInvoke":"KQNativeInvoke","manager":"manager"}],"SpriteHelper":[function(require,module,exports){
"use strict";
cc._RFpush(module, '936f2uPA8NAuqUZv0R8ZxgP', 'SpriteHelper');
// scripts\Extensions\SpriteHelper.js

var SpriteHelper = {
  setImageUrl: function setImageUrl(sprite, url) {
    if (url.endsWith("png") || url.endsWith("jpg") || url.endsWith("gif")) {} else {
      //url = url + ".png";
    }

    cc.loader.load({ url: url, type: "jpg" }, function (err, data) {
      if (err) {
        return;
      }

      var frame = new cc.SpriteFrame(data);
      sprite.spriteFrame = frame;
    });
  }
};

module.exports = SpriteHelper;

cc._RFpop();
},{}],"StringExtension":[function(require,module,exports){
"use strict";
cc._RFpush(module, '7b106eQ/I5F1J85hMxFBIlw', 'StringExtension');
// scripts\Extensions\StringExtension.js

// 给 String 添加功能

// str.startsWith("");
// str.endsWith("");

if (!String.prototype.startsWith) {
	(function () {
		'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
		var defineProperty = (function () {
			// IE 8 only supports `Object.defineProperty` on DOM elements
			try {
				var object = {};
				var $defineProperty = Object.defineProperty;
				var result = $defineProperty(object, object, object) && $defineProperty;
			} catch (error) {}
			return result;
		})();
		var toString = ({}).toString;
		var startsWith = function startsWith(search) {
			if (this == null) {
				throw TypeError();
			}
			var string = String(this);
			if (search && toString.call(search) == '[object RegExp]') {
				throw TypeError();
			}
			var stringLength = string.length;
			var searchString = String(search);
			var searchLength = searchString.length;
			var position = arguments.length > 1 ? arguments[1] : undefined;
			// `ToInteger`
			var pos = position ? Number(position) : 0;
			if (pos != pos) {
				// better `isNaN`
				pos = 0;
			}
			var start = Math.min(Math.max(pos, 0), stringLength);
			// Avoid the `indexOf` call if no match is possible
			if (searchLength + start > stringLength) {
				return false;
			}
			var index = -1;
			while (++index < searchLength) {
				if (string.charCodeAt(start + index) != searchString.charCodeAt(index)) {
					return false;
				}
			}
			return true;
		};
		if (defineProperty) {
			defineProperty(String.prototype, 'startsWith', {
				'value': startsWith,
				'configurable': true,
				'writable': true
			});
		} else {
			String.prototype.startsWith = startsWith;
		}
	})();
}

// str.endsWith("");
if (!String.prototype.endsWith) {
	(function () {
		'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
		var defineProperty = (function () {
			// IE 8 only supports `Object.defineProperty` on DOM elements
			try {
				var object = {};
				var $defineProperty = Object.defineProperty;
				var result = $defineProperty(object, object, object) && $defineProperty;
			} catch (error) {}
			return result;
		})();
		var toString = ({}).toString;
		var endsWith = function endsWith(search) {
			if (this == null) {
				throw TypeError();
			}
			var string = String(this);
			if (search && toString.call(search) == '[object RegExp]') {
				throw TypeError();
			}
			var stringLength = string.length;
			var searchString = String(search);
			var searchLength = searchString.length;
			var pos = stringLength;
			if (arguments.length > 1) {
				var position = arguments[1];
				if (position !== undefined) {
					// `ToInteger`
					pos = position ? Number(position) : 0;
					if (pos != pos) {
						// better `isNaN`
						pos = 0;
					}
				}
			}
			var end = Math.min(Math.max(pos, 0), stringLength);
			var start = end - searchLength;
			if (start < 0) {
				return false;
			}
			var index = -1;
			while (++index < searchLength) {
				if (string.charCodeAt(start + index) != searchString.charCodeAt(index)) {
					return false;
				}
			}
			return true;
		};
		if (defineProperty) {
			defineProperty(String.prototype, 'endsWith', {
				'value': endsWith,
				'configurable': true,
				'writable': true
			});
		} else {
			String.prototype.endsWith = endsWith;
		}
	})();
}

cc._RFpop();
},{}],"TotalGameResultItem":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e1c6f93a1BOnoSiX6kJ0Efn', 'TotalGameResultItem');
// scripts\Play\TotalGameResultItem.js

var SpriteHelper = require('SpriteHelper');
cc.Class({
  "extends": cc.Component,

  properties: {
    avatarSprite: cc.Sprite,
    labelUserId: cc.Label,
    labelScore: cc.Label,
    labelNickname: cc.Label,

    _deskInfo: null
  },

  // use this for initialization
  onLoad: function onLoad() {},

  setUserInfo: function setUserInfo(user, deskInfo) {
    if (!user) {
      return;
    }

    var totalScore = user.totalScore;
    if (deskInfo && (deskInfo.setting1 == 0 || deskInfo.setting1 == 1)) {
      var baseScore = deskInfo.setting1 == 0 ? 100 : 200;
      totalScore = totalScore - baseScore;
    }

    SpriteHelper.setImageUrl(this.avatarSprite, user.avatarUrl);
    this.labelUserId.string = "" + user.id;
    this.labelScore.string = totalScore > 0 ? "+ " + totalScore : "- " + totalScore * -1;
    if (totalScore == 0) {
      this.labelScore.string = "0";
    }
    this.labelNickname.string = user.nickname;
  }
});

cc._RFpop();
},{"SpriteHelper":"SpriteHelper"}],"TotalGameResult":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'f7fb2e7foJFNJzjdtbAtk7O', 'TotalGameResult');
// scripts\Play\TotalGameResult.js

var KQNativeInvoke = require('KQNativeInvoke');
var Socket = require('socket');
cc.Class({
    'extends': cc.Component,

    properties: {
        itemLayout: cc.Layout,
        itemPrefab: cc.Prefab,
        timeLabel: cc.Label, // 时间
        jushuLabel: cc.Label, // 局数
        roomId: cc.Label, // 房间号
        nicknameLabels: cc.Label,
        recordInfo_sview: [cc.Node],

        sharrBg: cc.Node,
        btnWeiXin: cc.Node,
        btnGongXuoHao: cc.Node,
        btnZhuShou: cc.Node,
        btnZongFen: cc.Node,

        suanfen_sview: cc.Node,
        suanFenPrefab: cc.Prefab,
        suanFenBgPrefab: cc.Prefab
    },

    // use this for initialization
    onLoad: function onLoad() {},

    onDisable: function onDisable() {
        //if(cc.sys.isBrowser){
        //
        var shareTitle = '开房玩[大众十三水]';
        var desc = '开好房了，就等你们一起来[大众十三水]啦！晚了位置就没了哟~';
        cc.sys.localStorage.setItem('shareTitle', shareTitle);
        cc.sys.localStorage.setItem('desc', desc);

        // cc.sys.localStorage.removeItem("shareTitle");
        // cc.sys.localStorage.removeItem("desc");
        cc.sys.localStorage.removeItem("recordId");
        //cc.sys.localStorage.setItem("roomId",'');
        if (window.shareToTimeLine) {
            window.shareToTimeLine();
        }
        if (window.shareToSession) {
            window.shareToSession();
        }
        //}
    },
    js: function js(setting2) {
        var jushu = 5;
        switch (setting2) {
            case 0:
                jushu = 5;break;case 1:
                jushu = 10;break;
            case 2:
                jushu = 20;break;case 3:
                jushu = 30;break;
        }
        return jushu;
    },

    creator: function creator(_creator, players) {
        //创房者
        for (var i = 0; i < players.length; i++) {
            if (players[i].id == _creator) {
                return i;
            }
        }
    },

    _clickBtn: function _clickBtn() {
        this.btnZhuShou.active = true;
        this.btnZongFen.active = false;
    },

    clickZongFen: function clickZongFen() {

        this.btnZhuShou.active = true;

        this.btnZongFen.active = false;

        this.recordInfo_sview.forEach(function (node) {
            node.active = true;
        });

        this.suanfen_sview.active = false;
    },
    _globalMsg: function _globalMsg(recordInfo) {
        //if(cc.sys.isBrowser) {
        var roomId = "房间号：" + recordInfo.roomId;
        var pj = ["5 ", "10 ", "20 "];
        var js = "局数：" + pj[recordInfo.setting1 - 2];
        var time = "时间：" + (recordInfo.createAt ? recordInfo.createAt : recordInfo.createTime);
        var shareTitle = "[大众十三水]战绩";
        var desc = roomId + js + time + " 点击查看详情";
        var recordId = recordInfo.id != undefined ? recordInfo.id : recordInfo.recordId;
        cc.sys.localStorage.setItem("shareTitle", shareTitle);
        cc.sys.localStorage.setItem("desc", desc);
        cc.sys.localStorage.setItem("recordId", recordId);
        cc.sys.localStorage.setItem("roomId", '');

        if (window.shareToTimeLine) {
            window.shareToTimeLine();
        }
        if (window.shareToSession) {
            window.shareToSession();
        }
        //}
    },
    //大局
    setPlayerInfos: function setPlayerInfos(playerInfos, deskInfo) {
        playerInfos.sort(function (a, b) {
            return b.totalScore - a.totalScore;
        }); // 排序
        // cc.log(playerInfos)
        // cc.log(deskInfo)
        // cc.log('--65')

        this._globalMsg(deskInfo);
        this.recordInfo_sview.forEach(function (node) {
            node.active = true;
        });

        this.suanfen_sview.active = false;

        this.btnZhuShou.active = true;

        this.btnZongFen.active = false;

        this._playerInfos = playerInfos;

        this._deskInfo = deskInfo;

        var createId = deskInfo.createUserId ? deskInfo.createUserId : deskInfo.createId;

        var nickname = playerInfos[this.creator(createId, playerInfos)].nickname;

        this.roomId.string = deskInfo.roomId;

        var createAt = deskInfo.createAt ? deskInfo.createAt : deskInfo.createTime;

        this.timeLabel.string = createAt.substr(0, 11);

        this.jushuLabel.string = this.js(deskInfo.setting1 - 2);

        this.nicknameLabels.string = nickname;

        this.itemLayout.node.removeAllChildren();

        playerInfos.forEach((function (user) {

            var item = cc.instantiate(this.itemPrefab);

            item.getComponent('TotalGameResultItem').setUserInfo(user, deskInfo);

            if (deskInfo.createUserId == user.id || deskInfo.createId == user.id) {

                item.children[1].children[0].active = true;
            } else {

                item.children[1].children[0].active = false;
            }

            this.itemLayout.node.addChild(item);
        }).bind(this));
    },

    //算分能手
    clickSuanFen: function clickSuanFen() {

        this.btnZhuShou.active = false;

        this.btnZongFen.active = true;

        this.recordInfo_sview.forEach(function (node) {
            node.active = false;
        });

        this.suanfen_sview.active = true;

        var playersRigth = this._playerInfos.filter(function (player) {
            return player.totalScore > 0;
        });

        var playersLeft = this._playerInfos.filter(function (player) {
            return player.totalScore < 0;
        });

        var playersRigthScore = playersRigth.map(function (player) {
            return player.totalScore;
        });

        var playersLeftScore = playersLeft.map(function (player) {
            return player.totalScore * -1;
        });

        var playersIndex = [],
            arrs = [playersRigthScore.filter(function (i) {
            return i;
        }), playersLeftScore.filter(function (i) {
            return i;
        })],
            indexs = playersLeftScore.length > playersRigthScore.length ? 0 : 1; //1是赢的人 0输的人

        // for(var i = 0;i < arrs[indexs].length; i++){

        //     var score = arrs[indexs][i];

        //     var d = this.getCombBySum(arrs[indexs==1?0:1], score)[0] || [];

        //     if(d.length > 0){

        //         playersIndex.push([score,d]);

        //         d.forEach(function (s) {

        //             var index = arrs[indexs==1?0:1].indexOf(s);

        //             if(index != -1) arrs[indexs==1?0:1].splice(index,1);

        //         });
        //     }
        // }

        // if(playersIndex.length == 0) indexs = 2;
        indexs = 2;
        this.suanfen_sview.children[0].removeAllChildren();

        playersLeft.forEach((function (user, index) {

            var suanFenBgPrefab = cc.instantiate(this.suanFenBgPrefab);

            suanFenBgPrefab.removeAllChildren();

            this._ctarePrefab(1, suanFenBgPrefab, user, user.totalScore, this._deskInfo, -200, 0);

            var x = 0,
                y = 0;

            if (indexs == 1) {
                for (var j = 0; j < playersIndex[index][1].length; j++) {

                    var s = playersIndex[index][1][j];

                    var d = playersRigthScore.indexOf(s);

                    if (d != -1) {

                        var plays = playersRigth.splice(d, 1)[0];

                        playersRigthScore.splice(d, 1);

                        if (plays) {

                            if (suanFenBgPrefab.childrenCount >= 3) y = -90;

                            if (suanFenBgPrefab.childrenCount == 3) x = 0;

                            if (suanFenBgPrefab.childrenCount >= 5) y = -180;

                            if (suanFenBgPrefab.childrenCount == 5) x = 0;

                            this._ctarePrefab(0, suanFenBgPrefab, plays, plays.totalScore, this._deskInfo, x, y);

                            x += 200;
                        }
                    }
                }
            } else if (indexs == 0) {
                var fen = suanFenBgPrefab.children[0].getChildByName("fen").getComponent(cc.Label).string.substr(3) * -1;

                for (var j = 0; j < playersIndex.length; j++) {

                    var s = playersIndex[j];

                    var d = s[1].indexOf(fen);

                    var q = s[0];

                    var w = playersRigthScore.indexOf(q);

                    if (d != -1 && w != -1) {

                        var plays = playersRigth[w];

                        this._ctarePrefab(0, suanFenBgPrefab, plays, plays.totalScore, this._deskInfo, x, y, fen);
                    }
                }
            } else {
                var q = playersLeftScore[index];
                var addScore = 0;
                var arr = [];
                for (var j = 0; j < playersRigthScore.length; j++) {
                    var w = playersRigthScore[j];
                    if (addScore < q) {
                        addScore += w;
                        if (addScore > q) {
                            arr.push(w - (addScore - q));
                        } else {
                            arr.push(w);
                        }
                        if (q - w >= 0) {
                            playersRigthScore[j] = 0;
                        }
                    }
                    if (addScore > q) {
                        playersRigthScore[j] = addScore - q;
                        break;
                    }
                }

                for (var t = 0; t < arr.length; t++) {
                    var r = arr[t];
                    if (r == 0) continue;
                    if (suanFenBgPrefab.childrenCount >= 3) y = -90;

                    if (suanFenBgPrefab.childrenCount == 3) x = 0;

                    if (suanFenBgPrefab.childrenCount >= 5) y = -180;

                    if (suanFenBgPrefab.childrenCount == 5) x = 0;

                    var plays = playersRigth[t];

                    this._ctarePrefab(0, suanFenBgPrefab, plays, r, this._deskInfo, x, y);

                    x += 200;
                }
            }

            this.suanfen_sview.children[0].addChild(suanFenBgPrefab);
        }).bind(this));
    },

    _ctarePrefab: function _ctarePrefab(shu, node, user, totalScore, deskInfo, x, y) {
        var fen = arguments.length <= 7 || arguments[7] === undefined ? null : arguments[7];

        var suanFenPrefab = cc.instantiate(this.suanFenPrefab);

        suanFenPrefab.getChildByName("ID").getComponent(cc.Label).string = "ID:" + user.id;

        if (deskInfo.createUserId == user.id) suanFenPrefab.getChildByName("ID").color = new cc.Color(235, 115, 122);

        suanFenPrefab.getChildByName("shu").getComponent(cc.Label).string = shu == 0 ? "输" : "";

        var str = shu == 0 ? totalScore + "分" : "总分:" + totalScore;

        if (fen) str = fen + "分";

        suanFenPrefab.getChildByName("fen").getComponent(cc.Label).string = str;

        var sprite = suanFenPrefab.getChildByName("haed").getComponent(cc.Sprite);

        var headUrl = user.avatarUrl; // 头像URL

        cc.loader.load({ url: headUrl, type: "jpg" }, function (err, tex) {

            if (!err) {

                var frame = new cc.SpriteFrame(tex);

                sprite.spriteFrame = frame;

                sprite.node.height = 55;

                sprite.node.width = 55;
            }
        });

        suanFenPrefab.x = x;

        suanFenPrefab.y = y;

        node.height = 90 + y * -1;

        node.addChild(suanFenPrefab);
    },

    clickExit: function clickExit() {
        Socket.sendOnceAgain('false', this._userId);
        cc.director.loadScene('hall');
    },

    clickShareWeiChat: function clickShareWeiChat() {
        if (!cc.sys.isNative) {
            this.sharrBg.active = true;
        } else {
            if (KQNativeInvoke.isNativeIOS()) {
                jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "wxScreenShareFriend");
            } else {
                //Android
                KQNativeInvoke.screenshotShare();
            }
        }
    },
    clickShareBg: function clickShareBg() {
        this.sharrBg.active = false;
    },
    clickSharePengYouQuan: function clickSharePengYouQuan() {
        if (KQNativeInvoke.isNativeIOS()) {
            jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "wxScreenShare");
        } else {
            //Android
            jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "wxScreenShare", "()V");
        }
    },

    getCombBySum: function getCombBySum(array, sum, tolerance, targetCount) {
        var util = {
            /*
             get combination from array
             arr: target array
             num: combination item length
             return: one array that contain combination arrays
             */
            getCombination: function getCombination(arr, num) {
                var r = [];
                (function f(t, a, n) {
                    if (n == 0) {
                        return r.push(t);
                    }
                    for (var i = 0, l = a.length; i <= l - n; i++) {
                        f(t.concat(a[i]), a.slice(i + 1), n - 1);
                    }
                })([], arr, num);
                return r;
            },
            //take array index to a array
            getArrayIndex: function getArrayIndex(array) {
                var i = 0,
                    r = [];
                for (i = 0; i < array.length; i++) {
                    r.push(i);
                }

                return r;
            }
        },
            logic = {
            //sort the array,then get what's we need
            init: function init(array, sum) {
                //clone array
                var _array = array.concat(),
                    r = [],
                    i = 0;
                //sort by asc
                _array.sort(function (a, b) {
                    return a - b;
                });
                //get all number when it's less than or equal sum
                for (i = 0; i < _array.length; i++) {
                    if (_array[i] <= sum) {
                        r.push(_array[i]);
                    } else {
                        break;
                    }
                }

                return r;
            },
            //important function
            core: function core(array, sum, arrayIndex, count, r) {
                var i = 0,
                    k = 0,
                    combArray = [],
                    _sum = 0,
                    _cca = [],
                    _cache = [];

                if (count == _returnMark) {
                    return;
                }
                //get current count combination
                combArray = util.getCombination(arrayIndex, count);
                for (i = 0; i < combArray.length; i++) {
                    _cca = combArray[i];
                    _sum = 0;
                    _cache = [];
                    //calculate the sum from combination
                    for (k = 0; k < _cca.length; k++) {
                        _sum += array[_cca[k]];
                        _cache.push(array[_cca[k]]);
                    }
                    if (Math.abs(_sum - sum) <= _tolerance) {
                        r.push(_cache);
                    }
                }

                logic.core(array, sum, arrayIndex, count - 1, r);
            }

        },
            r = [],
            _array = [],
            _targetCount = 0,
            _tolerance = 0,
            _returnMark = 0;

        //check data
        _targetCount = targetCount || _targetCount;
        _tolerance = tolerance || _tolerance;

        _array = logic.init(array, sum);
        if (_targetCount) {
            _returnMark = _targetCount - 1;
        }

        logic.core(_array, sum, util.getArrayIndex(_array), _targetCount || _array.length, r);

        return r;
    }
});

cc._RFpop();
},{"KQNativeInvoke":"KQNativeInvoke","socket":"socket"}],"UserModelHelper":[function(require,module,exports){
"use strict";
cc._RFpush(module, '98854aScapF5oQnHKxJsvmF', 'UserModelHelper');
// scripts\ModelUtils\UserModelHelper.js

var UserModelHelper = {
  // 用户是否已出牌
  isPlayedCards: function isPlayedCards(user) {
    cc.assert(user);

    if (user && user.cardInfo && user.cardInfo.length > 0) {
      return true;
    }

    return false;
  },

  // 用户是否已准备
  isUserReady: function isUserReady(user) {
    return user.readyStatus == true;
  }
};

module.exports = UserModelHelper;

cc._RFpop();
},{}],"UserSampleInfo":[function(require,module,exports){
"use strict";
cc._RFpush(module, '3a9f7A0IgRGPrAZvy1p9s4i', 'UserSampleInfo');
// scripts\Play\UserSampleInfo.js

var SpriteHelper = require('SpriteHelper');

cc.Class({
  'extends': cc.Component,

  properties: {
    labelUserId: cc.Label,
    labelUserIP: cc.Label,
    labelNickname: cc.Label,
    avatarSprite: cc.Sprite,
    manSprite: cc.Sprite,
    womenSprite: cc.Sprite,

    _didShowUserInfo: null
  },

  // use this for initialization
  onLoad: function onLoad() {},

  updateWithUser: function updateWithUser(user) {
    return;
    if (!user) {
      return;
    }

    if (this._didShowUserInfo == user) {
      this.unscheduleAllCallbacks();
      this._disappearUserInfo();
      return;
    }

    this._didShowUserInfo = user;
    if (!this.node.active) {
      this.node.getComponent('alert').alert();
    }

    this.unscheduleAllCallbacks();
    this.scheduleOnce((function () {
      this._disappearUserInfo();
    }).bind(this), 5);

    this.labelUserId.string = "UID:\n" + user.id;
    this.labelUserIP.string = "用户IP:\n" + user.ipAddress.replace("::ffff:", "");
    this.labelNickname.string = user.nickname;
    this.avatarSprite.spriteFrame = null;
    SpriteHelper.setImageUrl(this.avatarSprite, user.avatarUrl);

    var sex = user.sex; // sex: 1 男  2 女
    this.manSprite.node.active = sex == 1;
    this.womenSprite.node.active = sex != 1;
  },

  _disappearUserInfo: function _disappearUserInfo() {
    this.node.active = false;
    this._didShowUserInfo = null;
  }
});

cc._RFpop();
},{"SpriteHelper":"SpriteHelper"}],"agreement":[function(require,module,exports){
"use strict";
cc._RFpush(module, '8f601dzNnZLtq+KGT0uqDqF', 'agreement');
// scripts\agreement.js

var Socket = require('socket');
var KQGlobalEvent = require('KQGlobalEvent');
var KQGlabolSocketEventHander = require('KQGlabolSocketEventHander');
cc.Class({
    'extends': cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        agreement: {
            'default': null,
            type: cc.Label
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        KQGlobalEvent.on(Socket.Event.ReceiveHallInfo, this._socketReceiveHallInfo, this);
        // cc.log('----61')
        //  cc.log(this.agreement)
    },
    _socketReceiveHallInfo: function _socketReceiveHallInfo(response) {
        if (!response.result) {
            return;
        }
        var s = cc.find('Canvas/agreement');
        var data = response.data;
        //this._info1 = response.data;
        // cc.log(this.agreement)
        // cc.log(s)
        // cc.log('----61')
        this.agreement.string = data.info1 || "";
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{"KQGlabolSocketEventHander":"KQGlabolSocketEventHander","KQGlobalEvent":"KQGlobalEvent","socket":"socket"}],"alert":[function(require,module,exports){
"use strict";
cc._RFpush(module, '16cd2qs73lByZaHhJkQAEee', 'alert');
// scripts\alert.js

var AudioManager = require('AudioManager');
cc.Class({
  'extends': cc.Component,

  properties: {
    // foo: {
    //    default: null,      // The default value will be used only when the component attaching
    //                           to a node for the first time
    //    url: cc.Texture2D,  // optional, default is typeof default
    //    serializable: true, // optional, default is true
    //    visible: true,      // optional, default is true
    //    displayName: 'Foo', // optional
    //    readonly: false,    // optional, default is false
    // },
    // ...
    popNode: cc.Node,
    label: cc.Label,

    _alertCallback: null,
    _willDismissCallback: null,
    _dismissCallback: null,
    _confirmCallback: null, // 点击确定后的回调
    _tishi: null,
    _card_num: null
  },

  // use this for initialization
  onLoad: function onLoad() {},

  alert: function alert() {
    this.node.active = true;
    var anim = this.popNode.getComponent(cc.Animation);
    anim.play('pop');

    if (this._alertCallback) {
      this._alertCallback(this.node);
    }
  },
  /*#####弹出结果*/
  alertResult: function alertResult() {
    this.node.active = true;
    cc.find("Canvas/show_result").active = false;
    var anim = this.popNode.getComponent(cc.Animation);
    anim.play('pop');

    if (this._alertCallback) {
      this._alertCallback(this.node);
    }
  },

  /*#####点击确定*/
  playBtnClickSFX: function playBtnClickSFX() {
    AudioManager.instance.playBtnClickSFX();
  },

  /*#####点击取消*/
  palyBtnCancelClickSFX: function palyBtnCancelClickSFX() {
    AudioManager.instance.palyBtnCancelClickSFX();
  },

  /*#####点击关闭或者按键之类的按钮，播放音效*/
  palyBtnPublicSFX: function palyBtnPublicSFX() {
    AudioManager.instance.palyBtnPublicSFX();
  },

  /*#####点击创建房间，播放音效*/
  palyBtnCreateRoomSFX: function palyBtnCreateRoomSFX() {
    AudioManager.instance.palyBtnCreateRoomSFX();
  },
  /*#####点击创建房间，播放音效*/
  palyWindowSFX: function palyWindowSFX() {
    AudioManager.instance.palyWindowSFX();
  },

  palyWeiXinLoginSFX: function palyWeiXinLoginSFX() {
    AudioManager.instance.palyWeiXinLoginSFX();
  },
  palyFangPaiSFX: function palyFangPaiSFX() {
    AudioManager.instance.palyFangPaiSFX();
  },

  dismissAction: function dismissAction() {
    var willDismissCallback = this._willDismissCallback;
    if (willDismissCallback) {
      var result = willDismissCallback();
      if (result) {
        this.dismissComplete();
        return;
      }
    }

    var anim = this.popNode.getComponent(cc.Animation);
    var dismissAnim = anim.getAnimationState('pop_dismiss');
    dismissAnim.on('finished', this.dismissComplete, this);
    anim.play('pop_dismiss');
  },

  /*#####隐藏结果页面*/
  dismissActionResult: function dismissActionResult() {
    var willDismissCallback = this._willDismissCallback;
    if (willDismissCallback) {
      var result = willDismissCallback();
      if (result) {
        this.dismissComplete();
        return;
      }
    }

    var anim = this.popNode.getComponent(cc.Animation);
    var dismissAnim = anim.getAnimationState('pop_dismiss');
    dismissAnim.on('finished', this.dismissComplete, this);
    anim.play('pop_dismiss');
    cc.find("Canvas/show_result").active = true;
  },

  dismissComplete: function dismissComplete() {
    this.node.active = false;

    if (this.onDismissComplete) {
      this.onDismissComplete();
    }

    if (this._dismissCallback) {
      this._dismissCallback(this.node);
    }
  },
  dismissPlay: function dismissPlay() {
    cc.director.loadScene("hall");
  },

  onDismissComplete: function onDismissComplete() {
    //cc.log("onDismissComplete");
  },

  doneAction: function doneAction() {
    this.dismissAction();
    this.onDoneAction();

    var confirmCallback = this._confirmCallback;
    if (confirmCallback) {
      confirmCallback(this.node);
    }
  },

  onDoneAction: function onDoneAction() {},

  setMessage: function setMessage(msg) {
    this.label.string = msg;
  },

  getMessage: function getMessage() {
    return this.label.string;
  },

  setAlertCallbck: function setAlertCallbck(callback) {
    this._alertCallback = callback;
  },

  setWillDismissCallback: function setWillDismissCallback(callback) {
    this._willDismissCallback = callback;
  },

  setDismissCallback: function setDismissCallback(callback) {
    this._dismissCallback = callback;
  },

  setConfirmCallback: function setConfirmCallback(callback) {
    this._confirmCallback = callback;
  }

});
/*setMessage: function (message) {
  this.label.getComponent('cc.Label').string = message;
},*/

// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{"AudioManager":"AudioManager"}],"animation":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'c9ee9y0ua5NRLSZAxQqDjdw', 'animation');
// scripts\animation.js

/**
 *  房间特殊牌动画
 *
 *
 *
 * 
 */
cc.Class({
    "extends": cc.Component,

    properties: {
        fapaiNode: cc.Prefab, //
        liuduiban: cc.Prefab,
        santonghua: cc.Prefab,
        sanshunzi: cc.Prefab,
        quanleida: cc.Prefab,
        qinglong: cc.Prefab
    },

    // use this for initialization
    onLoad: function onLoad() {},
    fapaiAnimation: function fapaiAnimation() {
        var fapai = this.node.getChildByName('fapai');
        fapai = cc.removeSelf();
        var fapaiAnim = cc.instantiate(this.fapaiNode);
        this.node.addChild(fapaiAnim);

        var Lgun = fapaiAnim.getChildByName("left_gang"); // 左边的抢
        var Rgun = fapaiAnim.getChildByName("right_gang"); // 右边的抢
        var mask = fapaiAnim.getChildByName("mask");
        /* -----------start及子节点----------- */
        var start = fapaiAnim.getChildByName("start"),
            quan = start.getChildByName("quan"),
            baodian = start.getChildByName("baodian"),
            ditan = start.getChildByName("ditan"),
            beginIco = start.getChildByName("begin_icon"),
            title = start.getChildByName("title"),
            rWing = start.getChildByName("rWing"),
            lWing = start.getChildByName("lWing");
        /* --------------------------------- */
        var self = this;
        fapaiAnim.active = true;
        mask.runAction(cc.scaleTo(0.2, 10, 10));
        Lgun.runAction(cc.sequence(self.LgunAction()));
        Rgun.runAction(cc.sequence(self.RgunAction()));

        var startFinished = cc.callFunc(function () {
            rWing.active = true;
            lWing.active = true;
            lWing.runAction(cc.sequence(cc.repeat(cc.sequence(cc.skewTo(0.05, 20, -10), cc.skewTo(0.05, 0, 0)), 3), cc.fadeOut(0)));
            rWing.runAction(cc.sequence(cc.repeat(cc.sequence(cc.skewTo(0.05, 20, -10), cc.skewTo(0.05, 0, 0)), 3), cc.fadeOut(0)));
        });
        var wingFinished = cc.callFunc(function () {
            setTimeout(function () {
                start.runAction(cc.scaleTo(0.2, 0, 0));
            }, 500);
        });
        setTimeout(function () {
            start.active = true;
            start.runAction(cc.sequence(cc.scaleTo(0.2, 1.5, 1.5), cc.scaleTo(0.2, 1, 1), startFinished, wingFinished));
            quan.runAction(cc.sequence(cc.scaleTo(0.2, 10, 10), cc.fadeOut(0)));
            baodian.runAction(cc.sequence(cc.scaleTo(0.2, 1.5, 1.5), cc.fadeOut(0)));
        }, 400);
        setTimeout(function () {
            lWing.active = false;
            rWing.active = false;
            start.active = false;
            fapaiAnim.active = false;
            fapaiAnim.removeFromParent(true);
        }, 2000);
    },
    LgunAction: function LgunAction() {
        // 左边的枪
        return [cc.spawn([cc.moveTo(0.2, cc.v2(-430, 152)), cc.scaleTo(0.2, 2, 2)]), cc.spawn([cc.fadeTo(0.2, 255), cc.moveTo(0.2, cc.v2(-220, 0)), cc.rotateTo(0.2, 35)]), cc.fadeOut(0)];
    },
    RgunAction: function RgunAction() {
        // 右边的枪
        return [cc.spawn([cc.moveTo(0.2, cc.v2(430, 152)), cc.scaleTo(0.2, -2, 2)]), cc.spawn([cc.fadeTo(0.2, 255), cc.moveTo(0.2, cc.v2(220, 0)), cc.rotateTo(0.2, -35)]), cc.fadeOut(0)];
    },
    _bezier1: function _bezier1(index) {
        var bezier = [];
        bezier[0] = [[cc.v2(100, 74), cc.v2(150, 174), cc.v2(200, -174)], cc.v2(100, 74)];
        bezier[1] = [[cc.v2(-72, 284), cc.v2(-122, 384), cc.v2(-222, -150)], cc.v2(-72, 284)];
        bezier[2] = [[cc.v2(-70, 200), cc.v2(-120, 300), cc.v2(-220, -200)], cc.v2(-70, 200)];
        bezier[3] = [[cc.v2(-123, 213), cc.v2(-173, 313), cc.v2(-273, -160)], cc.v2(-123, 213)];
        bezier[4] = [[cc.v2(110, 237), cc.v2(160, 337), cc.v2(260, -177)], cc.v2(210, 237)];
        bezier[5] = [[cc.v2(183, 115), cc.v2(233, 215), cc.v2(333, -155)], cc.v2(183, 115)];
        bezier[6] = [[cc.v2(92, 116), cc.v2(142, 216), cc.v2(242, -146)], cc.v2(92, 116)];
        bezier[7] = [[cc.v2(-26, 124), cc.v2(-76, 224), cc.v2(-176, -164)], cc.v2(-26, 124)];
        bezier[8] = [[cc.v2(-110, 81), cc.v2(-220, 131), cc.v2(-460, -180)], cc.v2(-110, 81)];
        bezier[9] = [[cc.v2(-125, 33), cc.v2(-225, 133), cc.v2(-275, -133)], cc.v2(-125, 33)];
        bezier[10] = [[cc.v2(0, 0), cc.v2(50, 100), cc.v2(150, -150)], cc.v2(0, 0)];
        bezier[11] = [[cc.v2(-235, 5), cc.v2(-275, 105), cc.v2(-375, -186)], cc.v2(-235, 5)];
        bezier[12] = [[cc.v2(-80, 4), cc.v2(-130, 104), cc.v2(-230, -233)], cc.v2(-80, 4)];
        bezier[13] = [[cc.v2(100, -7), cc.v2(150, 107), cc.v2(250, -177)], cc.v2(100, -7)];
        bezier[14] = [[cc.v2(154, 23), cc.v2(204, 113), cc.v2(254, -173)], cc.v2(254, 23)];
        return bezier[index];
    },
    // 青龙动画
    _qinglongAniamtion: function _qinglongAniamtion(type) {
        var qinglong = cc.instantiate(this.qinglong);
        this.node.addChild(qinglong);
        var bg = qinglong.getChildByName('bg');
        var title = '';
        if (type == "ql") {
            title = qinglong.getChildByName('qlongtitle');
        } else {
            title = qinglong.getChildByName('longtitle');
        }

        var yun1 = qinglong.getChildByName('yun1');
        var yun2 = qinglong.getChildByName('yun2');
        var yun3 = qinglong.getChildByName('yun3');
        var yun4 = qinglong.getChildByName('yun4');
        var long = qinglong.getChildByName("long");

        var hua1 = qinglong.getChildByName('hua1');
        var hua2 = qinglong.getChildByName('hua2');
        var hua3 = qinglong.getChildByName('hua3');
        var A = [],
            B = [],
            C = [];
        var hua = [];

        var test = cc.instantiate(hua1);

        var self = this;
        for (var i = 0; i < 5; i++) {
            A[i] = cc.instantiate(hua1);
            A[i].runAction(cc.fadeTo(0.1, 255));
            hua.push(A[i]);
            B[i] = cc.instantiate(hua2);
            B[i].runAction(cc.fadeTo(0.1, 255));
            hua.push(B[i]);
            C[i] = cc.instantiate(hua3);
            C[i].runAction(cc.fadeTo(0.1, 255));
            hua.push(C[i]);
        };
        var bgFinished = cc.callFunc(function () {
            title.runAction(cc.sequence(cc.spawn(cc.scaleTo(0.2, 1, 1), cc.fadeTo(0.2, 255)), cc.scaleTo(0.2, 2, 2), cc.spawn(cc.scaleTo(0.2, 1.5, 1.5), longStart)));
        });
        var longStart = cc.callFunc(function () {
            long.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.2, 255), cc.scaleTo(0.2, 0.5)), cc.scaleTo(0.1, 3, 3), cc.spawn(cc.scaleTo(0.1, 1, 1), yunStart)));
        });
        var flowerStart = cc.callFunc(function () {});
        var yunStart = cc.callFunc(function () {
            yun1.runAction(cc.spawn(cc.fadeTo(0.2, 255), cc.repeat(cc.sequence(cc.moveTo(0.2, cc.v2(-334, 234)), cc.moveTo(0.2, cc.v2(-344, 234))), 3)));
            yun2.runAction(cc.spawn(cc.fadeTo(0.2, 255), cc.repeat(cc.sequence(cc.moveTo(0.2, cc.v2(-368, -82)), cc.moveTo(0.2, cc.v2(-358, -82))), 3)));
            yun3.runAction(cc.spawn(cc.fadeTo(0.2, 255), cc.repeat(cc.sequence(cc.moveTo(0.2, cc.v2(408, -4)), cc.moveTo(0.2, cc.v2(398, -4))), 3)));
            yun4.runAction(cc.spawn(cc.fadeTo(0.2, 255), cc.repeat(cc.sequence(cc.moveTo(0.2, cc.v2(406, 181)), cc.moveTo(0.2, cc.v2(416, 181))), 3)));
            for (var i = 1; i < hua.length; i++) {
                hua[i].setPosition(self._bezier(i)[1]);
                qinglong.addChild(hua[i]);
                hua[i].runAction(cc.sequence(cc.spawn(cc.bezierTo(0.3, self._bezier(i)[0]), cc.scaleTo(0.3, 1, 1), cc.fadeTo(0.3, 0))));
            }
            setTimeout(function () {
                qinglong.removeFromParent(true);
            }, 1500);
            //yun1
        });
        bg.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.4, 255), cc.scaleTo(0.4, 30, 30)), bgFinished));
        title.runAction(cc.scaleTo(0.2, 2, 2));
    },
    // 三顺子动画
    _sanshunziAnimation: function _sanshunziAnimation() {
        var sanshunzi = cc.instantiate(this.sanshunzi);
        this.node.addChild(sanshunzi);
        var bg = sanshunzi.getChildByName('bg');
        var Ltu = sanshunzi.getChildByName('Ltu');
        var Rtu = sanshunzi.getChildByName('Rtu');
        var title = sanshunzi.getChildByName('title');
        var zushun1 = sanshunzi.getChildByName('zushun1');
        var zushun2 = sanshunzi.getChildByName('zushun2');
        var zushun3 = sanshunzi.getChildByName('zushun3');
        var zushun4 = sanshunzi.getChildByName('zushun4');
        var zushun5 = sanshunzi.getChildByName('zushun5');
        var self = this;
        var bgFinished = cc.callFunc(function () {
            title.runAction(cc.sequence(cc.spawn(cc.scaleTo(0.2, 1, 1), cc.fadeTo(0.2, 255)), titleFinished));
        });
        var titleFinished = cc.callFunc(function () {
            title.runAction(cc.sequence(cc.scaleTo(0.2, 2.5, 2.5), titleScale));
            Ltu.runAction(cc.sequence(cc.fadeTo(0.2, 255)));
            Rtu.runAction(cc.sequence(cc.fadeTo(0.2, 255)));
        });
        var titleScale = cc.callFunc(function () {
            // title放大完成后 竹笋2和3同时进行
            title.runAction(cc.scaleTo(0.2, 1.5, 1.5));
            zushun2.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.2, 255), cc.scaleTo(0.2, 12, 12)), cc.scaleTo(0.2, 10, 10), ZS1));
            zushun3.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.2, 255), cc.scaleTo(0.2, 22, 22)), cc.scaleTo(0.2, 20, 20), ZS4));
            setTimeout(function () {
                zushun5.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.2, 255), cc.scaleTo(0.2, 12, 12)), cc.scaleTo(0.2, 10, 10)));
            }, 100);
            setTimeout(function () {
                self.sanshunzi.active = false;
                sanshunzi.removeFromParent(true);
            }, 2000);
        });
        var ZS1 = cc.callFunc(function () {
            zushun1.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.2, 255), cc.scaleTo(0.2, 12, 12)), cc.scaleTo(0.2, 10, 10)));
        });
        var ZS4 = cc.callFunc(function () {
            zushun4.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.2, 255), cc.scaleTo(0.2, 14, 14)), cc.scaleTo(0.2, 12, 12)));
        });
        bg.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.4, 255), cc.scaleTo(0.4, 30, 30)), bgFinished));
        title.runAction(cc.scaleTo(0.2, 2, 2));
    },
    // 全垒打
    _quanleidaAnimation: function _quanleidaAnimation() {
        var quanleida = cc.instantiate(this.quanleida);
        this.node.addChild(quanleida);
        var bg = quanleida.getChildByName('bg');
        var ball = quanleida.getChildByName('ball');
        var bangqiutao = quanleida.getChildByName('bangqiutao');
        var bangqiugun = quanleida.getChildByName('bangqiugun');
        var Lyun = quanleida.getChildByName('Lyun');
        var Ryun = quanleida.getChildByName('Ryun');
        var title = quanleida.getChildByName('title');
        var bgFinished = cc.callFunc(function () {
            title.runAction(cc.sequence(cc.spawn(cc.scaleTo(0.2, 1, 1), cc.fadeTo(0.2, 255)), titleFinished));
        });
        var titleFinished = cc.callFunc(function () {
            title.runAction(cc.sequence(cc.scaleTo(0.2, 2.5, 2.5), cc.scaleTo(0.2, 1.5, 1.5), cc.repeat(cc.sequence(cc.moveTo(0.3, cc.v2(0, 20)), cc.moveTo(0.3, cc.v2(0, 0))), 2)));

            Lyun.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.2, 255), cc.scaleTo(0.2, 20, 20), cc.moveTo(0.2, cc.v2(-270, 70))), cc.repeat(cc.sequence(cc.moveTo(0.3, cc.v2(-270, 26)), cc.moveTo(0.3, cc.v2(-270, 46))), 2)));

            Ryun.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.2, 255), cc.scaleTo(0.2, 20, 20), cc.moveTo(0.2, cc.v2(270, 70))), cc.repeat(cc.sequence(cc.moveTo(0.3, cc.v2(270, 66)), cc.moveTo(0.3, cc.v2(270, 46))), 2)));

            bangqiutao.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.2, 255), cc.scaleTo(0.3, 10, 10), cc.moveTo(0.3, cc.v2(250, 50))), bqtFinished));
        });
        var bqtFinished = cc.callFunc(function () {
            bangqiutao.runAction(cc.repeat(cc.sequence(cc.rotateTo(0.2, -10), cc.rotateTo(0.2, 0)), 3));
            ball.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.1, 255), cc.moveTo(0.2, cc.v2(196, 83))), ballFinished));
        });
        var ballFinished = cc.callFunc(function () {
            ball.runAction(cc.spawn(cc.fadeTo(0.2, 0), cc.moveTo(0.2, cc.v2(0, 0)), cc.scaleTo(0.2, 4, 4)));
            bangqiugun.runAction(cc.sequence(cc.spawn(cc.scaleTo(0.2, 2, 2), cc.fadeTo(0.2, 255)), cc.scaleTo(0.3, 1.5, 1.5)));
            setTimeout(function () {
                bg.runAction(cc.fadeTo(0.2, 0));
                ball.runAction(cc.fadeTo(0.2, 0));
                bangqiutao.runAction(cc.fadeTo(0.2, 0));
                bangqiugun.runAction(cc.fadeTo(0.2, 0));
                Lyun.runAction(cc.fadeTo(0.2, 0));
                Ryun.runAction(cc.fadeTo(0.2, 0));
                title.runAction(cc.fadeTo(0.2, 0));

                quanleida.removeFromParent(true);
            }, 2000);
        });
        bg.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.4, 255), cc.scaleTo(0.4, 30, 30)), bgFinished));
        title.runAction(cc.sequence(cc.scaleTo(0.2, 2, 2)));
    },

    // 三同花动画
    _santonghuaAnimation: function _santonghuaAnimation() {
        var santonghua = cc.instantiate(this.santonghua);
        this.node.addChild(santonghua);
        var bg = santonghua.getChildByName('bg');
        var hua1 = santonghua.getChildByName('hua1');
        var hua2 = santonghua.getChildByName('hua2');
        var hua3 = santonghua.getChildByName('hua3');
        var Rtaohua = santonghua.getChildByName('Rtaohua');
        var Ltaohua = santonghua.getChildByName('Ltaohua');
        var title = santonghua.getChildByName('title');
        var self = this;
        //var H1 = cc.instantiate(hua1);
        var A = [],
            B = [],
            C = [];
        var hua = [];
        for (var i = 0; i < 5; i++) {
            A[i] = cc.instantiate(hua1);
            A[i].runAction(cc.fadeTo(0.1, 255));
            hua.push(A[i]);
            B[i] = cc.instantiate(hua2);
            B[i].runAction(cc.fadeTo(0.1, 255));
            hua.push(B[i]);
            C[i] = cc.instantiate(hua3);
            C[i].runAction(cc.fadeTo(0.1, 255));
            hua.push(C[i]);
        };
        var bgFinished = cc.callFunc(function () {
            title.runAction(cc.sequence(cc.spawn(cc.scaleTo(0.2, 1, 1), cc.fadeTo(0.2, 255)), cc.scaleTo(0.2, 1, 1), titleFinished));
        });
        var titleFinished = cc.callFunc(function () {
            title.runAction(cc.sequence(cc.scaleTo(0.1, 1.8, 1.8)));
            Ltaohua.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.2, 255), cc.scaleTo(0.2, 3, 3), cc.moveTo(0.2, cc.v2(-160, -60)))));
            Rtaohua.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.2, 255), cc.scaleTo(0.2, 3, 3), cc.moveTo(0.2, cc.v2(140, -60)))));
            for (var i = 1; i < hua.length; i++) {
                hua[i].setPosition(self._bezier(i)[1]);
                santonghua.addChild(hua[i]);
                hua[i].runAction(cc.sequence(cc.spawn(cc.bezierTo(0.3, self._bezier(i)[0]), cc.scaleTo(0.3, 1, 1), cc.fadeTo(0.3, 0))));
            }
            setTimeout(function () {
                bg.runAction(cc.fadeTo(0.2, 0));
                Rtaohua.runAction(cc.fadeTo(0.2, 0));
                Ltaohua.runAction(cc.fadeTo(0.2, 0));
                title.runAction(cc.fadeTo(0.2, 0));
                santonghua.removeFromParent(true);
            }, 1500);
        });
        bg.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.3, 255), cc.scaleTo(0.3, 30, 30)), bgFinished));
        title.runAction(cc.sequence(cc.scaleTo(0.2, 2, 2)));
    },
    // 贝塞尔曲线(只能定三个点)
    _bezier: function _bezier(index) {
        var bezier = [];
        bezier[0] = [[cc.v2(200, 74), cc.v2(250, 124), cc.v2(400, -174)], cc.v2(200, 74)];
        bezier[1] = [[cc.v2(-72, 284), cc.v2(-122, 334), cc.v2(-272, -150)], cc.v2(-72, 284)];
        bezier[2] = [[cc.v2(-270, 300), cc.v2(-320, 350), cc.v2(-420, -200)], cc.v2(-270, 300)];
        bezier[3] = [[cc.v2(-223, 213), cc.v2(-273, 263), cc.v2(-373, -160)], cc.v2(-223, 213)];
        bezier[4] = [[cc.v2(210, 237), cc.v2(260, 287), cc.v2(360, -177)], cc.v2(210, 237)];
        bezier[5] = [[cc.v2(183, 115), cc.v2(233, 164), cc.v2(333, -155)], cc.v2(183, 115)];
        bezier[6] = [[cc.v2(92, 116), cc.v2(142, 166), cc.v2(242, -146)], cc.v2(92, 116)];
        bezier[7] = [[cc.v2(-26, 124), cc.v2(-76, 174), cc.v2(-176, -164)], cc.v2(-26, 124)];
        bezier[8] = [[cc.v2(-310, 81), cc.v2(-360, 131), cc.v2(-460, -180)], cc.v2(-310, 81)];
        bezier[9] = [[cc.v2(-125, 33), cc.v2(-175, 83), cc.v2(-275, -133)], cc.v2(-125, 33)];
        bezier[10] = [[cc.v2(0, 0), cc.v2(50, 50), cc.v2(150, -150)], cc.v2(0, 0)];
        bezier[11] = [[cc.v2(-235, 5), cc.v2(-275, 55), cc.v2(-375, -86)], cc.v2(-235, 5)];
        bezier[12] = [[cc.v2(-80, 4), cc.v2(-130, 54), cc.v2(-230, -233)], cc.v2(-80, 4)];
        bezier[13] = [[cc.v2(100, -7), cc.v2(150, 57), cc.v2(250, -177)], cc.v2(100, -7)];
        bezier[14] = [[cc.v2(254, 23), cc.v2(304, 73), cc.v2(404, -173)], cc.v2(254, 23)];
        return bezier[index];
    },

    // 六对半动画
    _liuduibanAnimation: function _liuduibanAnimation() {
        var liuduiban = cc.instantiate(this.liuduiban);
        this.node.addChild(liuduiban);
        var bg = liuduiban.getChildByName('bg');
        var Lqi = liuduiban.getChildByName('Lqi');
        var Rqi = liuduiban.getChildByName('Rqi');
        var Cqi = liuduiban.getChildByName('Cqi');
        var Rtaohua = liuduiban.getChildByName('Rtaohua');
        var Ltaohua = liuduiban.getChildByName('Ltaohua');
        var title = liuduiban.getChildByName('title');

        var bgFinished = cc.callFunc(function () {
            title.runAction(cc.sequence(cc.spawn(cc.scaleTo(0.2, 1, 1), cc.fadeTo(0.2, 255)), titleFinished));
        });
        var titleFinished = cc.callFunc(function () {
            title.runAction(cc.sequence(cc.scaleTo(0.1, 2.5, 2.5), cc.scaleTo(0.1, 1.8, 1.8), Finished));
            Ltaohua.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.2, 255), cc.scaleTo(0.2, 3, 3), cc.moveTo(0.2, cc.v2(-160, -60)))));
            Rtaohua.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.2, 255), cc.scaleTo(0.2, 3, 3), cc.moveTo(0.2, cc.v2(140, -60)))));
        });
        var Finished = cc.callFunc(function () {
            Lqi.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.2, 255), cc.moveTo(0.2, cc.v2(-103, 158))), cc.moveTo(0.2, cc.v2(-103, 168)), cc.moveTo(0.2, cc.v2(-103, 158))));
            Rqi.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.2, 255), cc.moveTo(0.2, cc.v2(133, 160))), cc.moveTo(0.2, cc.v2(133, 170)), cc.moveTo(0.2, cc.v2(133, 160))));
            setTimeout(function () {
                Cqi.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.2, 255), cc.moveTo(0.2, cc.v2(20, 96))), cc.moveTo(0.2, cc.v2(20, 106)), cc.moveTo(0.2, cc.v2(20, 96))));
                Ltaohua.runAction(cc.sequence(cc.repeat(cc.sequence(cc.rotateTo(0.3, 10), cc.rotateTo(0.3, 0)), 2), thFinished));
                Rtaohua.runAction(cc.repeat(cc.sequence(cc.rotateTo(0.3, -10), cc.rotateTo(0.3, 0)), 2));
            }, 500);
        });
        var thFinished = cc.callFunc(function () {
            bg.runAction(cc.fadeTo(0.2, 0));
            Lqi.runAction(cc.fadeTo(0.2, 0));
            Rqi.runAction(cc.fadeTo(0.2, 0));
            Cqi.runAction(cc.fadeTo(0.2, 0));
            Rtaohua.runAction(cc.fadeTo(0.2, 0));
            Ltaohua.runAction(cc.fadeTo(0.2, 0));
            title.runAction(cc.fadeTo(0.2, 0));
            liuduiban.removeFromParent(true);
        });
        bg.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.4, 255), cc.scaleTo(0.4, 30, 30)), bgFinished));
        title.runAction(cc.sequence(cc.scaleTo(0.2, 2, 2)));
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"cardNum":[function(require,module,exports){
"use strict";
cc._RFpush(module, '19329zUw3hCTpBk+7waBT2d', 'cardNum');
// scripts\cardNum.js

cc.Class({
    "extends": cc.Component,

    properties: {

        cards: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.totalCards();
    },
    totalCards: function totalCards() {
        // var create = this.node.children;
        //console.log(this.node);
        var renshu = this.node.getChildByName("renshu");
        var jushu = this.node.getChildByName("jushu");
        var getCard = this.node.getChildByName("cards");
        //var renshu = create[3], jushu = create[4], getCard = create[6];

        var rs = renshu.getComponent("singleSelect").selectedIndex;
        var js = jushu.getComponent("singleSelect").selectedIndex;
        var gc = getCard.getComponent("singleSelect").selectedIndex;

        var R = 1,
            J = 1,
            G = 1;
        switch (rs) {
            case 0:
                R = 1;break;
            case 1:
                R = 2;break;
            case 2:
                R = 3;break;
            case 3:
                R = 4;break;
        }
        switch (js) {
            case 0:
                J = 1;break;
            case 1:
                J = 2;break;
            case 2:
                J = 3;break;
        }
        switch (gc) {
            case 0:
                G = 1;break; // AA制
            default:
                G = 0;break;
        }
        this.cards.string = R + J;
        //this.cards.string = G ? (R+J):(R+J)*(R+3);  // (R+J)表示每个人要出的房卡量；(R+3)表示一共有多少人，  
    }
});

cc._RFpop();
},{}],"cardsBack":[function(require,module,exports){
"use strict";
cc._RFpush(module, '98986IsXIdHiqLGEVIG2CWP', 'cardsBack');
// scripts\cardsBack.js

// 牌背影列表 component
// 可以显示、隐藏牌背影列表
cc.Class({
  "extends": cc.Component,

  properties: {
    cardsBackLayout: cc.Layout,
    cardsBackList: [cc.Sprite]
  },

  // use this for initialization
  onLoad: function onLoad() {},

  // 以动画的方式显示牌背影
  showPlayCardBacks: function showPlayCardBacks() {
    this.hideCardBacks();
    this.cardsBackLayout.node.active = true;

    var interval = 0.05;
    var startTime = 0;
    this.cardsBackList.forEach((function (cardBack) {
      this.scheduleOnce(function () {
        cardBack.node.active = true;
      }, startTime);
      startTime = startTime + interval;
    }).bind(this));
  },

  // 隐藏显示牌背影
  hideCardBacks: function hideCardBacks() {
    this.cardsBackLayout.node.active = false;
    this.cardsBackList.forEach(function (cardBack) {
      cardBack.node.active = false;
    });
  }
});

cc._RFpop();
},{}],"cards":[function(require,module,exports){
"use strict";
cc._RFpush(module, '0fcbct/TBxC742saKLuFviQ', 'cards');
// scripts\cards.js

cc.Class({
    "extends": cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        /*牌花色*/
        spadesImages: [cc.SpriteFrame],
        heartsImages: [cc.SpriteFrame],
        clubImages: [cc.SpriteFrame],
        diamondImages: [cc.SpriteFrame]
    },

    // use this for initialization
    onLoad: function onLoad() {}

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"cellText":[function(require,module,exports){
"use strict";
cc._RFpush(module, '9c9fd3OxWNEp4rijfjJv05t', 'cellText');
// scripts\cellText.js

cc.Class({
    "extends": cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        labelMsg: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {},

    setText: function setText(text) {
        this.labelMsg.getComponent(cc.Label).string = text;
    },

    clickAction: function clickAction() {
        var text = this.labelMsg.getComponent(cc.Label).string;
        this.onSelectAction(text);
    },

    onSelectAction: function onSelectAction(msg) {}

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"changInfo":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'cb225d0jXtB0JToI7yXR0hG', 'changInfo');
// scripts\changInfo.js

var Socket = require('socket');
var KQGlobalEvent = require('KQGlobalEvent');

cc.Class({
    'extends': cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        phoneEditBox: cc.EditBox,
        wxEditBox: cc.EditBox,
        alert: cc.Prefab,
        canvas: cc.Node,
        _userId: null
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._userId = Socket.instance.userInfo.id;
        this._registerSocketEvent();
    },

    _registerSocketEvent: function _registerSocketEvent() {
        KQGlobalEvent.on(Socket.Event.ReceiveOnChangeInfo, this._ReceiveChangeInfo, this);
    },
    _ReceiveChangeInfo: function _ReceiveChangeInfo(response) {
        var changedRows = response.data;
        var msg = '';
        //console.log(response);
        //console.log(changedRows);
        //console.log("-------------------------------38");
        if (changedRows) {
            msg = "更改成功";
        } else {
            msg = "今天已经更新过了，请明天再更新";
        }
        this.alertMsg(msg);
    },
    clickAction: function clickAction() {
        var wx = this.wxEditBox.string;
        var phone = this.phoneEditBox.string;
        var info = {};
        var msg = '';
        if (!wx && !phone) {
            msg = "请填写微信号和手机号";
            phone = "";
            this.alertMsg(msg);
            return;
        }
        if (!/(^[1-9]\d*$)/.test(phone)) {
            msg = "您输入的手机号码格式不对，请重新输入";
            phone = "";
            this.alertMsg(msg);
            return;
        }
        if (phone.length != 11) {
            msg = "您输入的手机号码不够11位，请重新输入";
            phone = "";
            this.alertMsg(msg);
            return;
        }
        if (!/(^[1-9a-zA-Z]\d*$)/.test(wx)) {
            msg = "您输入的微信号格式不对，请重新输入";
            wx = "";
            this.alertMsg(msg);
            return;
        }
        if (wx.length < 6 || wx.length > 20) {
            msg = "您输入的微信号格式超出范围，请输入6~20位的微信号";
            wx = "";
            this.alertMsg(msg);
            return;
        }
        info.wx = wx;
        info.phone = phone;
        Socket.sendChangeInfo(this._userId, info);
    },

    alertMsg: function alertMsg(msg) {
        var alert = cc.instantiate(this.alert);
        this.canvas.addChild(alert);
        var comp = alert.getComponent('alert');
        comp.setMessage(msg);
    }
});

cc._RFpop();
},{"KQGlobalEvent":"KQGlobalEvent","socket":"socket"}],"change_mapai":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'ed8274emaRL471ny4dnQ8cA', 'change_mapai');
// scripts\change_mapai.js

cc.Class({
    "extends": cc.Component,

    properties: {

        mPtitle: cc.Label,
        _cards: [],
        renshuSelect: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        var hs = 3;
        var ds = 5;
        if (cc.set) {
            hs = cc.set.setting7[0];
            ds = cc.set.setting7[1];
        }
        this._cards = [hs, ds];
        this.mp(hs, ds);
    },
    change: function change() {
        var selectedIndex = this.renshuSelect.getComponent('singleSelect').selectedIndex;
        var hs = Math.ceil(Math.random() * 40 / 10); //获取一个1~4的数字，代表花色
        var ds = Math.ceil(Math.random() * 130 / 10); //获取一个1~13的数字，代表点数
        var card = [hs, ds];
        this._cards = card;
        this.mp(hs, ds, selectedIndex);
    },
    mp: function mp(h, d, index) {
        var ma = "单码";
        var hs = ["方块", "梅花", "红桃", "黑桃"];
        var ds = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
        if (index) {
            var defaultMa = 4;
            if (h >= defaultMa - index + 1) {
                ma = "双码";
            }
        }
        this.mPtitle.string = hs[h - 1] + ds[d - 1] + ma;
    }
});

cc._RFpop();
},{}],"checkSelect":[function(require,module,exports){
"use strict";
cc._RFpush(module, '974a0c6jzZPRI5AeaAb4U0z', 'checkSelect');
// scripts\checkSelect.js

cc.Class({
    "extends": cc.Component,

    properties: {
        selectedIndex: 0,
        selectedNode: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.selected = true;
        this.selectedIndex = 0;
        this.selectedNode.active = true;
    },
    clickAction: function clickAction(e, data) {
        this.selected = !this.selected;
        this.selectedNode.active = this.selected;
        this.selectedIndex = this.selected ? 0 : null;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RFpop();
},{}],"choujiang":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'f64e0whLhNLmbOHtPpK94CG', 'choujiang');
// scripts\choujiang.js

var socket = require("socket");
cc.Class({
    "extends": cc.Component,

    properties: {
        option: {
            "default": [],
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function onLoad() {},

    clickBtnchoujiang: function clickBtnchoujiang() {
        for (var i = 0; i < this.option.length; i++) {
            this.option[i].opacity = 255;
        }
        var index = 0;
        this._tishi = this.node.getChildByName("choujiang_bg").getChildByName("tishi");
        this._card_num = cc.find("Canvas/user/shop_bg/card_num");
        var comp = this._card_num.getComponent(cc.Label);
        this.callback = function () {
            if (index == 0) {
                this.option[index].opacity = 128;
                this.option[this.option.length - 1].opacity = 255;
            } else if (index == 1) {
                this.option[index].opacity = 128;
                this.option[index - 1].opacity = 255;
            } else {
                this.option[index].opacity = 128;
                this.option[index - 1].opacity = 255;
            }
            index++;
            if (index == this.option.length) {
                index = 0;
            }
        };
        if (comp.string < 20) {
            this._tishi.active = true;
        } else {
            //choujiang
            this.schedule(this.callback, 0.05);
            this.schedule(function () {
                this.unschedule(this.callback);
                for (var i = 0; i < this.option.length; i++) {
                    this.option[i].opacity = 255;
                }
                var i = Math.floor(Math.random() * 12);
                this.option[i].opacity = 128;
            }, 3, 0, 1);
        }
    },

    //***
    clickBtnComfirm: function clickBtnComfirm() {
        this._tishi.active = false;
        //this.node.active = false;
    }
});
//****

// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{"socket":"socket"}],"create_btn_anima":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'df337riLglP3YcI/IJFXecj', 'create_btn_anima');
// scripts\create_btn_anima.js

cc.Class({
    "extends": cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...

    },

    // use this for initialization
    onLoad: function onLoad() {},
    loadCardSpriteFrame: function loadCardSpriteFrame(cardName, callback) {
        this._loadCardFrame(cardName, callback);
    },
    _cardFullName: function _cardFullName(cardShortName) {
        var cardName = cardShortName;
        if (!cardName.startsWith("public-pic-card-poker")) {
            cardName = "public-pic-card-poker-" + cardName;
        }
        return cardName;
    },
    _loadCardFrame: function _loadCardFrame(cardName, callback) {
        cc.assert(callback);
        cc.loader.loadRes("play/hall/public/all_effect_ttw_main", cc.SpriteAtlas, (function (err, atlas) {
            if (err) {
                callback(null, err);
                return;
            }
            cardName = this._cardFullName(cardName);
            var frame = atlas.getSpriteFrame(cardName);
            callback(frame);
        }).bind(this));
    },
    test: function test() {}

});

cc._RFpop();
},{}],"fecha":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e517077l0xMarB9uQsXGzvk', 'fecha');
// scripts\Extensions\fecha.js

(function (main) {
  'use strict';

  /**
   * Parse or format dates
   * @class fecha
   */
  var fecha = {};
  var token = /d{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|ZZ|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g;
  var twoDigits = /\d\d?/;
  var threeDigits = /\d{3}/;
  var fourDigits = /\d{4}/;
  var word = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;
  var literal = /\[([^]*?)\]/gm;
  var noop = function noop() {};

  function shorten(arr, sLen) {
    var newArr = [];
    for (var i = 0, len = arr.length; i < len; i++) {
      newArr.push(arr[i].substr(0, sLen));
    }
    return newArr;
  }

  function monthUpdate(arrName) {
    return function (d, v, i18n) {
      var index = i18n[arrName].indexOf(v.charAt(0).toUpperCase() + v.substr(1).toLowerCase());
      if (~index) {
        d.month = index;
      }
    };
  }

  function pad(val, len) {
    val = String(val);
    len = len || 2;
    while (val.length < len) {
      val = '0' + val;
    }
    return val;
  }

  var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var monthNamesShort = shorten(monthNames, 3);
  var dayNamesShort = shorten(dayNames, 3);
  fecha.i18n = {
    dayNamesShort: dayNamesShort,
    dayNames: dayNames,
    monthNamesShort: monthNamesShort,
    monthNames: monthNames,
    amPm: ['am', 'pm'],
    DoFn: function DoFn(D) {
      return D + ['th', 'st', 'nd', 'rd'][D % 10 > 3 ? 0 : (D - D % 10 !== 10) * D % 10];
    }
  };

  var formatFlags = {
    D: function D(dateObj) {
      return dateObj.getDate();
    },
    DD: function DD(dateObj) {
      return pad(dateObj.getDate());
    },
    Do: function Do(dateObj, i18n) {
      return i18n.DoFn(dateObj.getDate());
    },
    d: function d(dateObj) {
      return dateObj.getDay();
    },
    dd: function dd(dateObj) {
      return pad(dateObj.getDay());
    },
    ddd: function ddd(dateObj, i18n) {
      return i18n.dayNamesShort[dateObj.getDay()];
    },
    dddd: function dddd(dateObj, i18n) {
      return i18n.dayNames[dateObj.getDay()];
    },
    M: function M(dateObj) {
      return dateObj.getMonth() + 1;
    },
    MM: function MM(dateObj) {
      return pad(dateObj.getMonth() + 1);
    },
    MMM: function MMM(dateObj, i18n) {
      return i18n.monthNamesShort[dateObj.getMonth()];
    },
    MMMM: function MMMM(dateObj, i18n) {
      return i18n.monthNames[dateObj.getMonth()];
    },
    YY: function YY(dateObj) {
      return String(dateObj.getFullYear()).substr(2);
    },
    YYYY: function YYYY(dateObj) {
      return dateObj.getFullYear();
    },
    h: function h(dateObj) {
      return dateObj.getHours() % 12 || 12;
    },
    hh: function hh(dateObj) {
      return pad(dateObj.getHours() % 12 || 12);
    },
    H: function H(dateObj) {
      return dateObj.getHours();
    },
    HH: function HH(dateObj) {
      return pad(dateObj.getHours());
    },
    m: function m(dateObj) {
      return dateObj.getMinutes();
    },
    mm: function mm(dateObj) {
      return pad(dateObj.getMinutes());
    },
    s: function s(dateObj) {
      return dateObj.getSeconds();
    },
    ss: function ss(dateObj) {
      return pad(dateObj.getSeconds());
    },
    S: function S(dateObj) {
      return Math.round(dateObj.getMilliseconds() / 100);
    },
    SS: function SS(dateObj) {
      return pad(Math.round(dateObj.getMilliseconds() / 10), 2);
    },
    SSS: function SSS(dateObj) {
      return pad(dateObj.getMilliseconds(), 3);
    },
    a: function a(dateObj, i18n) {
      return dateObj.getHours() < 12 ? i18n.amPm[0] : i18n.amPm[1];
    },
    A: function A(dateObj, i18n) {
      return dateObj.getHours() < 12 ? i18n.amPm[0].toUpperCase() : i18n.amPm[1].toUpperCase();
    },
    ZZ: function ZZ(dateObj) {
      var o = dateObj.getTimezoneOffset();
      return (o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4);
    }
  };

  var parseFlags = {
    D: [twoDigits, function (d, v) {
      d.day = v;
    }],
    Do: [new RegExp(twoDigits.source + word.source), function (d, v) {
      d.day = parseInt(v, 10);
    }],
    M: [twoDigits, function (d, v) {
      d.month = v - 1;
    }],
    YY: [twoDigits, function (d, v) {
      var da = new Date(),
          cent = +('' + da.getFullYear()).substr(0, 2);
      d.year = '' + (v > 68 ? cent - 1 : cent) + v;
    }],
    h: [twoDigits, function (d, v) {
      d.hour = v;
    }],
    m: [twoDigits, function (d, v) {
      d.minute = v;
    }],
    s: [twoDigits, function (d, v) {
      d.second = v;
    }],
    YYYY: [fourDigits, function (d, v) {
      d.year = v;
    }],
    S: [/\d/, function (d, v) {
      d.millisecond = v * 100;
    }],
    SS: [/\d{2}/, function (d, v) {
      d.millisecond = v * 10;
    }],
    SSS: [threeDigits, function (d, v) {
      d.millisecond = v;
    }],
    d: [twoDigits, noop],
    ddd: [word, noop],
    MMM: [word, monthUpdate('monthNamesShort')],
    MMMM: [word, monthUpdate('monthNames')],
    a: [word, function (d, v, i18n) {
      var val = v.toLowerCase();
      if (val === i18n.amPm[0]) {
        d.isPm = false;
      } else if (val === i18n.amPm[1]) {
        d.isPm = true;
      }
    }],
    ZZ: [/([\+\-]\d\d:?\d\d|Z)/, function (d, v) {
      if (v === 'Z') v = '+00:00';
      var parts = (v + '').match(/([\+\-]|\d\d)/gi),
          minutes;

      if (parts) {
        minutes = +(parts[1] * 60) + parseInt(parts[2], 10);
        d.timezoneOffset = parts[0] === '+' ? minutes : -minutes;
      }
    }]
  };
  parseFlags.dd = parseFlags.d;
  parseFlags.dddd = parseFlags.ddd;
  parseFlags.DD = parseFlags.D;
  parseFlags.mm = parseFlags.m;
  parseFlags.hh = parseFlags.H = parseFlags.HH = parseFlags.h;
  parseFlags.MM = parseFlags.M;
  parseFlags.ss = parseFlags.s;
  parseFlags.A = parseFlags.a;

  // Some common format strings
  fecha.masks = {
    'default': 'ddd MMM DD YYYY HH:mm:ss',
    shortDate: 'M/D/YY',
    mediumDate: 'MMM D, YYYY',
    longDate: 'MMMM D, YYYY',
    fullDate: 'dddd, MMMM D, YYYY',
    shortTime: 'HH:mm',
    mediumTime: 'HH:mm:ss',
    longTime: 'HH:mm:ss.SSS'
  };

  /***
   * Format a date
   * @method format
   * @param {Date|number} dateObj
   * @param {string} mask Format of the date, i.e. 'mm-dd-yy' or 'shortDate'
   */
  fecha.format = function (dateObj, mask, i18nSettings) {
    var i18n = i18nSettings || fecha.i18n;

    if (typeof dateObj === 'number') {
      dateObj = new Date(dateObj);
    }

    if (Object.prototype.toString.call(dateObj) !== '[object Date]' || isNaN(dateObj.getTime())) {
      throw new Error('Invalid Date in fecha.format');
    }

    mask = fecha.masks[mask] || mask || fecha.masks['default'];

    var literals = [];

    // Make literals inactive by replacing them with ??
    mask = mask.replace(literal, function ($0, $1) {
      literals.push($1);
      return '??';
    });
    // Apply formatting rules
    mask = mask.replace(token, function ($0) {
      return $0 in formatFlags ? formatFlags[$0](dateObj, i18n) : $0.slice(1, $0.length - 1);
    });
    // Inline literal values back into the formatted value
    return mask.replace(/\?\?/g, function () {
      return literals.shift();
    });
  };

  /**
   * Parse a date string into an object, changes - into /
   * @method parse
   * @param {string} dateStr Date string
   * @param {string} format Date parse format
   * @returns {Date|boolean}
   */
  fecha.parse = function (dateStr, format, i18nSettings) {
    var i18n = i18nSettings || fecha.i18n;

    if (typeof format !== 'string') {
      throw new Error('Invalid format in fecha.parse');
    }

    format = fecha.masks[format] || format;

    // Avoid regular expression denial of service, fail early for really long strings
    // https://www.owasp.org/index.php/Regular_expression_Denial_of_Service_-_ReDoS
    if (dateStr.length > 1000) {
      return false;
    }

    var isValid = true;
    var dateInfo = {};
    format.replace(token, function ($0) {
      if (parseFlags[$0]) {
        var info = parseFlags[$0];
        var index = dateStr.search(info[0]);
        if (! ~index) {
          isValid = false;
        } else {
          dateStr.replace(info[0], function (result) {
            info[1](dateInfo, result, i18n);
            dateStr = dateStr.substr(index + result.length);
            return result;
          });
        }
      }

      return parseFlags[$0] ? '' : $0.slice(1, $0.length - 1);
    });

    if (!isValid) {
      return false;
    }

    var today = new Date();
    if (dateInfo.isPm === true && dateInfo.hour != null && +dateInfo.hour !== 12) {
      dateInfo.hour = +dateInfo.hour + 12;
    } else if (dateInfo.isPm === false && +dateInfo.hour === 12) {
      dateInfo.hour = 0;
    }

    var date;
    if (dateInfo.timezoneOffset != null) {
      dateInfo.minute = +(dateInfo.minute || 0) - +dateInfo.timezoneOffset;
      date = new Date(Date.UTC(dateInfo.year || today.getFullYear(), dateInfo.month || 0, dateInfo.day || 1, dateInfo.hour || 0, dateInfo.minute || 0, dateInfo.second || 0, dateInfo.millisecond || 0));
    } else {
      date = new Date(dateInfo.year || today.getFullYear(), dateInfo.month || 0, dateInfo.day || 1, dateInfo.hour || 0, dateInfo.minute || 0, dateInfo.second || 0, dateInfo.millisecond || 0);
    }
    return date;
  };

  /* istanbul ignore next */
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = fecha;
  } else if (typeof define === 'function' && define.amd) {
    define(function () {
      return fecha;
    });
  } else {
    main.fecha = fecha;
  }
})(this);

cc._RFpop();
},{}],"game":[function(require,module,exports){
"use strict";
cc._RFpush(module, '45811N61jFFA6UrygQla5+x', 'game');
// scripts\game.js

cc.Class({
    'extends': cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        messageNode: cc.Node,
        playNode: cc.Node

    },

    // use this for initialization
    onLoad: function onLoad() {},

    showMessageAlert: function showMessageAlert() {
        this.messageNode.active = true;
        var comp = this.messageNode.getComponent(cc.Animation);
        comp.play('pop');
    },

    dismissMessageAlert: function dismissMessageAlert() {
        var self = this;
        this.scheduleOnce(function () {
            self.messageNode.active = false;
        }, 0.3);
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"hall_btn_anima":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'b8a30Txa91I27+7HOFLyJA6', 'hall_btn_anima');
// scripts\hall_btn_anima.js

cc.Class({
    "extends": cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        create_anima: {
            type: cc.SpriteFrame,
            "default": []
        }
    },

    // use this for initialization
    onLoad: function onLoad() {}

});

cc._RFpop();
},{}],"hall":[function(require,module,exports){
"use strict";
cc._RFpush(module, '1e6741Q2VFGDLupV88mg60Z', 'hall');
// scripts\hall.js

var manager = require('manager');
var Socket = require('socket');
var KQGlobalEvent = require('KQGlobalEvent');
var AudioManager = require('AudioManager');
var KQNativeInvoke = require('KQNativeInvoke');
var Playback = require('Playback');

var hall = cc.Class({
    'extends': cc.Component,

    properties: {

        //productNodes:[cc.Node],
        shopAlertNode: cc.Node,
        createNode: cc.Node,
        joinNode: cc.Node,
        gengxin: cc.Node,
        alertPrefab: cc.Prefab,
        tsSingleSelect: [cc.Node], // 创建房间信息，单选
        tsCheckSeclect: [cc.Node], // 创建房间信息，复选
        selectMoShi: cc.Node, // 创建房间信息，模式（庄家模式和无特殊牌）
        selectGuiPai: cc.Node, // 创建房间信息，模式（庄家模式和无特殊牌）
        overTime: cc.Node, // 超时出牌
        //labelNotice: cc.Label,      // 公告
        labelBanner: cc.Label, // banner label
        recordNode: cc.Node,
        waitingPrefab: cc.Prefab,
        setting: cc.Node,
        //用户信息
        avatarNode: cc.Node,
        nickNameLabel: cc.Label,
        cardNumberLabel: cc.Label,
        userIdLabel: cc.Label,
        codeLabel: cc.Label,
        //phone:cc.Label,
        // userInfoMsgNode:cc.Node,
        logoutNode: cc.Node,
        //战绩
        recordMsgNode: cc.Node,
        feedbackEditBox: cc.EditBox, //反馈
        feedbackNode: cc.Node,
        wxshare: cc.Node,
        _userId: 0,
        _openId: null,
        _help: null,
        _close: null,
        iosUrl: null,
        aUrl: null

    },

    statics: {
        lastHallInfo: null, // 上一次收到的大厅信息
        cacheImageInfo: null
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.keyBackListen();
        if (cc.sys.isBrowser) {
            if (window.shareToTimeLine) {
                window.shareToTimeLine();
            }
            if (window.shareToSession) {
                window.shareToSession();
            }
        }
        cc.sys.localStorage.removeItem("timestamp");
        var bg = this.node.getChildByName("room_bg");
        var windowP = cc.director.getWinSizeInPixels();
        var scaleX = windowP.width / bg.width;
        var scaleY = windowP.height / bg.height;
        var scale = Math.max(scaleX, scaleY);
        bg.scaleX = scale;
        bg.scaleY = scale;
        this.clearLocalStorage();
        cc.from = {};
        cc.from.isUseMa = true;
        cc.from.ma = 0;
        cc.isRoomViewShow = false;
        this._btn = this.node.getChildByName("btn");
        this._buttons = this.node.getChildByName("buttons");
        var volume = cc.sys.localStorage.getItem("bgVolume");
        if (volume != null && parseInt(volume)) {
            AudioManager.instance.playMusic();
        }

        var bgSound = cc.sys.localStorage.getItem("bgSound");
        if (bgSound == 0) {
            var audioManager = cc.find('AudioManager');
            audioManager = audioManager.getComponent('AudioManager');
            audioManager.setEffectMusicVolum(bgSound);
        }
        Playback.instance.removePlaybackDatas();

        hall.cacheImageInfo = hall.cacheImageInfo || {};

        this._registerSocketEvent();
        this._startBannerAnimation();
        this._initJoinRoom();

        this._userId = Socket.instance.userInfo.id;
        this._openId = Socket.instance.userInfo.openId;
        this._inviteCode = Socket.instance.userInfo.inviteCode; //邀请码
        var self = this;
        this.socket = cc.find('GameSocket').getComponent('socket');
        this.socket.receviceMessage = function (response) {
            var data = JSON.parse(response);
        };

        this.socket.connectionSuccess = function () {
            self.hiddenNetworkMessage();
            self.hiddenCheckMessage();
        };
        this.socket.connectionDisconnect = function () {
            self.showNetworkMessage('网络链接断开，重新连接中...');
        };
        this.socket.checkNetworkNow = function () {
            self.showCheckMessage('检查网络中...');
        };
        this.socket.checkNetworkEnd = function () {
            self.hiddenCheckMessage();
            self.hiddenNetworkMessage();
        };

        //  /*设置用户信息*/
        this.updateUserInfo();
        /*刷新用户信息*/
        Socket.sendGetUserInfo(this._userId, this._openId);
        /*定时刷新用户信息*/
        this.schedule((function () {
            Socket.sendGetUserInfo(this._userId, this._openId);
        }).bind(this), 10); //10s一次
        Socket.sendGetHallInfo(this.socket.userInfo.id);
        if (hall.lastHallInfo) {
            this.updateBanner(hall.lastHallInfo.info);
        }
        cc.onShareWXResp = null;
        cc.director.preloadScene('play', function () {
            cc.director.preloadScene('login');
        });
        if (cc.joinDesk != null) {
            if (!cc.joinDesk.result) {
                var reason = cc.joinDesk.reason;
                this.alertMessage(reason);
            }
            cc.joinDesk = null;
        }
        if (cc.qingli != null) {
            this.alertMessage("您被房主请出房间");
            cc.qingli = null;
        }
        //var creatAnima = this.node.getChildByName("create_room");
    },

    keyBackListen: function keyBackListen() {
        var _this = this;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (e) {
            if (e.keyCode == cc.KEY.back) {
                if (!KQNativeInvoke.isNativeIOS()) {
                    jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "backToDesk", "()V");
                }
            }
        }, this);
    },

    clickWxShare: function clickWxShare() {
        if (!cc.sys.isNative) {
            this.wxshare.active = true;
        } else {
            var title = cc.sys.localStorage.getItem('shareTitle');
            var description = cc.sys.localStorage.getItem('desc');
            var recordId = cc.sys.localStorage.getItem('recordId');
            var id = '';
            if (recordId) {
                id = 'recordId=' + recordId;
            }

            if (KQNativeInvoke.isNativeIOS()) {
                jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "wxShareFriend", id, description, title);
            } else {
                //Android
                var str = "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V";
                jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "wxShareFriend", str, id, description, title);
            }
        }
    },

    //分享到朋友圈
    shareHallTimeline: function shareHallTimeline() {
        if (!cc.sys.isNative) {
            this.wxshare.active = true;
        } else {
            var title = cc.sys.localStorage.getItem('shareTitle');
            var description = cc.sys.localStorage.getItem('desc');
            var recordId = cc.sys.localStorage.getItem('recordId');
            var id = '';
            if (recordId) {
                id = 'recordId=' + recordId;
            }

            if (KQNativeInvoke.isNativeIOS()) {
                jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "wxShareHallTimeline", id, description, title);
            } else {
                //Android
                var str = "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V";
                jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "wxShareHallTimeline", str, id, description, title);
            }
        }
    },

    shareBg: function shareBg() {
        if (!cc.sys.isNative) {
            this.wxshare.active = false;
        } else {
            // if (KQNativeInvoke.isNativeIOS()) {
            //     jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName,"wxShareHallTimeline",id, description,title);
            // }
            // else {//Android
            //     var str = "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V";
            //     jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "wxShareHallTimeline", str,id, description,title);
            // }
        }
    },

    clearLocalStorage: function clearLocalStorage() {
        var shareTitle = '开房玩[大众十三水]';
        var desc = '开好房了，就等你们一起来[大众十三水]啦！晚了位置就没了哟~';
        cc.sys.localStorage.removeItem('roomId');
        cc.sys.localStorage.setItem('shareTitle', shareTitle);
        cc.sys.localStorage.setItem('desc', desc);
    },

    onDestroy: function onDestroy() {
        this.socket.receviceMessage = function () {};
        this.socket.connectionSuccess = function () {};
        this.socket.connectionDisconnect = function () {};
        this.socket.checkNetworkNow = function () {};
        this.socket.checkNetworkEnd = function () {};

        KQGlobalEvent.offTarget(this);
    },

    _registerSocketEvent: function _registerSocketEvent() {
        KQGlobalEvent.on(Socket.Event.JoinDesk, this._jiinRoomSocketCallback, this);
        KQGlobalEvent.on(Socket.Event.ReceiveDeskInfo, this._jiinRoomSocketCallback, this);
        KQGlobalEvent.on(Socket.Event.ReceiveCreateDesk, this._createRoomSocketCallback, this);
        KQGlobalEvent.on(Socket.Event.ReceiveHallInfo, this._socketReceiveHallInfo, this);
        KQGlobalEvent.on(Socket.Event.ReceiveGetUserInfo, this._socketReceiveUserInfo, this);
        KQGlobalEvent.on(Socket.Event.SocketDisconnect, this._socketDisconnect, this);
        //KQGlobalEvent.on(Socket.Event.ReceiveInviteCode, this._socketReceiveInviteCode, this);
        KQGlobalEvent.on(Socket.Event.SocketConnectSuccessed, this._socketConnected, this);
        //KQGlobalEvent.on(Socket.Event.ReceiveSharePng, this._socketSharePng, this);
    },

    // 跳转到公众号
    guanzhu: function guanzhu() {
        // var url = "http://www.honggefeng.cn/gzh/index.html";
        // cc.sys.openURL(url)
    },
    _startBannerAnimation: function _startBannerAnimation() {
        var anim = this.labelBanner.getComponent(cc.Animation);
        anim.play('banner');
    },
    downLoad: function downLoad() {
        var url = 'https://fir.im/5tne';
        cc.sys.openURL(url);

        //window.location.href = "http://www.baidu.com";
        //console.log("？？？？？？？？");
    },

    _initJoinRoom: function _initJoinRoom() {
        var self = this;
        var joinRoom = this.joinNode.getComponent('joinRoom');

        joinRoom.callbackJoinRoom = function (number) {
            // self.joinNode.getComponent('alert').dismissAction();
            // self.showWaitingMessage('加入中...');
            // self.scheduleOnce(function() {
            //     self.hiddenWaitingMessage();
            // }, 2.0);

            /*加入房间请求*/
            var userId = Socket.instance.userInfo.id;
            Socket.sendJoinDesk(number, userId);
        };
    },

    _jiinRoomSocketCallback: function _jiinRoomSocketCallback(response) {
        var _this2 = this;

        if (cc.isRoomViewShow) {
            return;
        }
        this.hiddenWaitingMessage();

        if (response.result) {
            (function () {
                if (cc.from == null) {
                    cc.from = {};
                }
                var joinRoom = _this2.joinNode.getComponent('joinRoom');

                _this2.joinNode.getComponent('alert').setAlertCallbck(function () {
                    joinRoom.clickClear();
                });
                cc.from.ma = response.data.maPai;
                cc.director.loadScene('play');
            })();
        } else {
            var reasonInfo = this._joinReasonMap(response.data.reason);
            this.alertMessage(reasonInfo);
        }
    },

    _socketReceiveHallInfo: function _socketReceiveHallInfo(response) {
        if (cc.isRoomViewShow) {
            return;
        }
        if (!response.result) {
            return;
        }
        var data = response.data;
        hall.lastHallInfo = data;
        var isIOS = data.isIOS;
        var isAndroid = data.isA;
        var vIOS = data.vIOS;
        var vA = data.vA;
        this.iosUrl = data.iosUrl;
        this.aUrl = data.aUrl;
        if (cc.sys.isNative) {
            if (KQNativeInvoke.isNativeIOS()) {
                if (isIOS == 1) {
                    if (vIOS != '1.0.3') {
                        this.gengxin.active = true;
                    }
                }
            } else {
                //Android
                if (isAndroid == 1) {
                    if (vA != '1.0.4') {
                        this.gengxin.active = true;
                    }
                }
            }
        }
        var notice = data.broadcast;
        var banner = data.info;
        //this.updateNotice(notice);
        this.updateBanner(banner);
    },
    downloadNewVersion: function downloadNewVersion() {
        if (KQNativeInvoke.isNativeIOS()) {
            cc.sys.openURL(this.iosUrl);
            // jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "downloadNewVersion:", this.iosUrl);
        } else {
                //Android
                cc.sys.openURL(this.aUrl);
                // jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "downloadNewVersion", "(Ljava/lang/String;)V", this.aUrl);
            }
    },
    _createRoomSocketCallback: function _createRoomSocketCallback(response) {
        if (cc.isRoomViewShow) {
            return;
        }
        this.hiddenWaitingMessage();

        if (response.result) {
            cc.director.loadScene('play');
        }
        /*如果钻石不足，则提示*/
        else {
                this.alertMessage("您的钻石不足");
            }
    },

    _joinReasonMap: function _joinReasonMap(reason) {
        var reasonInfo = {
            notExist: "房间不存在!",
            cardNumber: "您房卡不足!"
        };

        var info = reasonInfo[reason] || "房间已满!";
        return info;
    },

    /*shop*/
    shopAction: function shopAction() {
        var comp = this.shopAlertNode.getComponent('alert');
        comp.alert();
    },
    /*提示*/
    alertMessage: function alertMessage(msg) {
        var node = cc.instantiate(this.alertPrefab);
        this.node.addChild(node);
        var comp = node.getComponent('alert');
        comp.setMessage(msg);
        comp.alert();
    },

    //updateNotice: function (notice) {
    //    if(this.labelNotice == null){
    //        return;
    //    }
    //  this.labelNotice.string = notice || "";
    //},

    updateBanner: function updateBanner() {
        var banner = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];

        if (this.labelBanner == null) {
            return;
        }
        this.labelBanner.string = banner;
    },

    /*#####
    * setting1 局数  (0 | 1 | 2 )
    * setting2 人数  (0 | 1 | 2 | 3)
    * setting3 玩法  (0 | 1 | 2 | 3 | 4)
    * setting4 AA制收取房费  (0 | 1 | 2 )
    * setting5 其他  (0)
    * setting6  
    * setting7
    * */
    createDoneAction: function createDoneAction() {
        var info = {};
        var self = this;
        var key = ['setting1', 'setting2', 'setting4', 'setting5'];
        for (var i = 0; i < this.tsSingleSelect.length; i++) {
            var tsIndex = self.tsSingleSelect[i].getComponent('singleSelect').selectedIndex;
            info[key[i]] = tsIndex;
        }

        info['setting3'] = this.selectMoShi.getComponent('selectMoShi')._select;
        info['setting6'] = this.overTime.getComponent('overTime')._selected;
        //console.log( info['setting6'] );
        if (!info['setting3'][3]) {
            // 玩法 [疯狂场,鬼牌,比花色,坐庄,马牌] info['setting3'][3]第三项表示坐庄模式，非坐庄模式的倍率是1倍
            info['setting5'] = 0; // 倍率 (0~1) == (1~3倍)
        }
        info['setting8'] = null;

        info['setting7'] = this.selectMoShi.getComponent('change_mapai')._cards;
        cc.set = info;
        info['userId'] = this.socket.userInfo.id; //用户Id
        this.socket.sendMessage('createDesk', info);

        this.createNode.getComponent('alert').dismissAction();

        //let self = this;
        this.showWaitingMessage('创建中...');
        this.scheduleOnce(function () {
            self.hiddenWaitingMessage();
        }, 2.0);
    },

    // 随机场
    /*clickRandRoom: function () {
      cc.director.loadScene('randRoom');
    },*/

    clickRecord: function clickRecord() {
        var comp = this.recordNode.getComponent('alert');
        comp.alert();
        Socket.sendGetRecrod(Socket.instance.userInfo.id);
    },

    clickPlayRule: function clickPlayRule() {
        //cc.director.loadScene('rule');
        this.help = this.node.getChildByName("help");
        var comp = this.help.getComponent('alert');
        comp.alert();
    },

    clickPlay: function clickPlay() {
        if (cc.clickOut) cc.director.loadScene('play');
    },

    /*切换账号*/
    clickCancelLation: function clickCancelLation() {
        this.logoutNode.getComponent('alert').alert();
    },

    logoutAction: function logoutAction() {
        manager.setUserInfo('');
        cc.director.loadScene('login');
        hall.cacheImageInfo = null;
    },

    exitAction: function exitAction() {
        manager.setUserInfo('');
        if (!cc.sys.isNative) {
            cc.director.loadScene('login');
            hall.cacheImageInfo = null;
            return;
        }

        if (KQNativeInvoke.isNativeIOS()) {
            jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "exitApp");
        } else if (KQNativeInvoke.isNativeAndroid()) {
            //Android com.lling.qianjianglzg
            jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "exitApp", "()V");
        }
        cc.director.end();
    },

    //接收处理用户数据
    _socketReceiveUserInfo: function _socketReceiveUserInfo(response) {
        if (cc.isRoomViewShow) {
            return;
        }
        if (!this.socket.userInfo) {
            cc.error("this.socket.userInfo 为空!!!");
            return;
        }
        //console.log(response,"----------------------用户信息");
        //this.phone.string = response.data.phone ? response.data.phone : "无";
        this.setting.getComponent('Setting')._phone = response.data.phone ? response.data.phone : null;
        this.setting.getComponent('Setting').phone.string = response.data.phone ? response.data.phone : '无';
        this.nickNameLabel.string = response.data.nickname; // 用户名
        this.userIdLabel.string = 'ID: ' + response.data.id; // ID
        this.cardNumberLabel.string = response.data.cardNumber;
        var sprite = this.avatarNode.getComponent(cc.Sprite);
        cc.loader.load({ url: response.data.avatarUrl, type: "jpg" }, function (err, tex) {
            if (!err) {
                var frame = new cc.SpriteFrame(tex);
                sprite.spriteFrame = frame;
            }
        });
    },

    _socketDisconnect: function _socketDisconnect() {
        this.showNetworkMessage("网络链接断开，重新连接中...");
    },

    _socketConnected: function _socketConnected() {
        this.hiddenNetworkMessage();
    },

    //更新用户信息
    updateUserInfo: function updateUserInfo() {
        var info = this.socket.userInfo;
        if (!info) {
            cc.error("this.socket.userInfo 为空!!!");
            return;
        }

        this.nickNameLabel.string = info.nickname;
        this.userIdLabel.string = 'ID: ' + info.id;
        this.cardNumberLabel.string = info.cardNumber;

        var avatarUrl = info.avatarUrl + ".jpg";
        var sprite = this.avatarNode.getComponent(cc.Sprite);
        var texture = hall.cacheImageInfo[avatarUrl];
        if (texture) {
            var frame = new cc.SpriteFrame(texture);
            if (frame) {
                //cc.log("从缓存中加载头像");
                sprite.spriteFrame = frame;
                return;
            }
        }

        cc.loader.load({ url: info.avatarUrl, type: "jpg" }, function (err, tex) {
            if (!err) {
                var frame = new cc.SpriteFrame(tex);
                sprite.spriteFrame = frame;

                hall.cacheImageInfo[avatarUrl] = tex;
            }
        });
    },

    /*提交意见*/
    feedbackAcion: function feedbackAcion() {
        var userId = this.socket.userInfo.id;
        var text = this.feedbackEditBox.string;
        if (text.length > 0) {
            this.feedbackNode.getComponent('alert').dismissAction();
            Socket.sendFeedback(userId, text);
            this.feedbackEditBox.string = '';
        }
    },

    showWaitingMessage: function showWaitingMessage(msg) {
        if (this.waitingNode != null && cc.sys.isNative && cc.sys.isObjectValid(this.waitingNode)) {
            this.waitingNode.destory();
            this.waitingNode = null;
        }
        this.waitingNode = cc.instantiate(this.waitingPrefab);
        this.node.addChild(this.waitingNode);
        var comp = this.waitingNode.getComponent('alert');
        comp.setMessage(msg);
        comp.alert();
    },

    hiddenWaitingMessage: function hiddenWaitingMessage() {
        if (this.waitingNode != null) {
            this.waitingNode.getComponent('alert').dismissAction();
        }
    },

    //network
    showNetworkMessage: function showNetworkMessage(msg) {
        if (this.networkNode && this.networkNode.active) {
            var _alert = this.networkNode.getComponent('alert');
            if (_alert.getMessage() == msg) {
                return;
            }
        }

        if (this.networkNode != null) {
            var removeSelfAction = cc.removeSelf();
            this.networkNode.runAction(removeSelfAction);
            this.networkNode = null;
        }
        this.networkNode = cc.instantiate(this.waitingPrefab);
        this.node.addChild(this.networkNode);
        var comp = this.networkNode.getComponent('alert');
        var self = this;
        comp.onDismissComplete = function () {
            self.networkNode = null;
        };
        comp.setMessage(msg);
        comp.alert();
    },

    hiddenNetworkMessage: function hiddenNetworkMessage() {
        if (this.networkNode != null) {
            this.networkNode.getComponent('alert').dismissAction();
        }
    },

    //checkNode
    showCheckMessage: function showCheckMessage(msg) {
        if (!(this.checkNode && this.checkNode.active)) {} else {
            var _alert2 = this.checkNode.getComponent('alert');
            if (_alert2.getMessage() == msg) {
                return;
            }
        }

        if (this.checkNode != null) {
            var removeSelfAction = cc.removeSelf();
            this.checkNode.runAction(removeSelfAction);
            this.checkNode = null;
        }
        this.checkNode = cc.instantiate(this.waitingPrefab);
        this.node.addChild(this.checkNode);
        var comp = this.checkNode.getComponent('alert');
        var self = this;
        comp.onDismissComplete = function () {
            self.checkNode = null;
        };
        comp.setMessage(msg);
        comp.alert();
    },

    hiddenCheckMessage: function hiddenCheckMessage() {
        if (this.checkNode != null) {
            this.checkNode.getComponent('alert').dismissAction();
        }
    },
    onBtnClick: function onBtnClick() {
        if (this._buttons.active) {
            this._buttons.active = false;
        } else {
            this._buttons.active = true;
        }
    }

});

// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },
module.exports = hall;

cc._RFpop();
},{"AudioManager":"AudioManager","KQGlobalEvent":"KQGlobalEvent","KQNativeInvoke":"KQNativeInvoke","Playback":"Playback","manager":"manager","socket":"socket"}],"help":[function(require,module,exports){
"use strict";
cc._RFpush(module, '09981CwNMZOI4DHUg8u9kcj', 'help');
// scripts\help.js

cc.Class({
    "extends": cc.Component,
    properties: {
        /*sprites: {
            default: null,
            type: cc.SpriteAtlas
        },*/
        play_method_before: cc.Node, //玩法介绍
        play_method_content_label: cc.Node, //玩法介绍内容
        introduce_pai_before: cc.Node, //牌型介绍
        details: cc.Node, //牌型介绍内容
        caozuo_before: cc.Node, //操作介绍
        caozuo_content: cc.Node, //操作介绍内容
        _btn: null,
        _content: null,
        _buttonCom: null,
        _play_method_button: null,
        _introduce_pai_button: null,
        _caozuo_button: null
    },

    // use this for initialization
    onLoad: function onLoad() {
        //this._play_method_button = this.play_method_before.getComponent(cc.Button);
        //this._introduce_pai_button = this.introduce_pai_before.getComponent(cc.Button);
        //this._caozuo_button = this.caozuo_before.getComponent(cc.Button);
        //this._btn = [this.play_method_before,this.introduce_pai_before,this.caozuo_before];
        //this._content = [this.play_method_content_label,this.details,this.caozuo_content];
        //this._buttonCom = [this._play_method_button,this._introduce_pai_button,this._caozuo_button];
        ////刚开始牌型介绍的按钮不可用
        //this._buttonCom[1].interactable = false;
    },
    // 点击玩法介绍
    onBtnPlayMethodClick: function onBtnPlayMethodClick() {
        //for(var i=0;i<3;i++){
        //    //所有按钮设置为可用
        //    this._buttonCom[i].interactable = true;
        //    //所有的内容都隐藏掉
        //    this._content[i].active = false;
        //}
        ////当前点击的设置为不可用
        //this._buttonCom[0].interactable = false;
        ////当前点击的对应的内容可见
        this._content[0].active = true;
    },
    //点击牌型介绍
    onBtnIntroducePaiClick: function onBtnIntroducePaiClick() {
        //for(var i=0;i<3;i++){
        //    //所有按钮设置为可用
        //    this._buttonCom[i].interactable = true;
        //    //所有的内容都隐藏掉
        //    this._content[i].active = false;
        //}
        ////当前点击的设置为不可用
        //this._buttonCom[1].interactable = false;
        ////当前点击的对应的内容可见
        //this._content[1].active = true;
    },
    //点击操作介绍
    onBtnCaozuoClick: function onBtnCaozuoClick() {
        //for(var i=0;i<3;i++){
        //    //所有按钮设置为可用
        //    this._buttonCom[i].interactable = true;
        //    //所有的内容都隐藏掉
        //    this._content[i].active = false;
        //}
        ////当前点击的设置为不可用
        //this._buttonCom[2].interactable = false;
        ////当前点击的对应的内容可见
        //this._content[2].active = true;
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"inviteCode":[function(require,module,exports){
"use strict";
cc._RFpush(module, '777f9/eB7RKK4aO7FmNYFgO', 'inviteCode');
// scripts\inviteCode.js

/**
 * 邀请码
 * @authors 黄成(you@example.org)
 * @date    2017-06-16 09:44:10
 * @version $Id$
 */
var Socket = require('socket');
cc.Class({
  'extends': cc.Component,

  properties: {
    labelNumbers: [cc.Label],
    callbackInviteCode: ''
  },

  onLoad: function onLoad() {
    this.clickClear(); //清除数字
  },

  clickClear: function clickClear() {
    this.labelNumbers.forEach(function (label) {
      label.string = "";
    });
  },

  clickNumber: function clickNumber(event, number) {
    var label = this._lastEmptyLabel();
    if (label) {
      label.string = number;
      //cc.log(label.string ,"----------------");
    } else {
        return;
      }
    var isComplete = this._lastEmptyLabel() == null;
    //cc.log("isComplete-------------", this.callbackInviteCode);
    var inviteNumber = this._inviteNumber();

    if (inviteNumber.length == 6) {
      //cc.log(inviteNumber,"--------------------38"); //邀请码
      var userId = Socket.instance.userInfo.id;
      //Socket.sendInviteCode(inviteNumber, userId);
      this.callbackInviteCode = inviteNumber;
    }
  },
  sendCode: function sendCode() {
    //发送邀请码
    var userId = Socket.instance.userInfo.id;
    var inviteNumber = this.callbackInviteCode;
    //cc.log(inviteNumber,"--------------------38")
    if (inviteNumber && inviteNumber.length == 6) {
      Socket.sendInviteCode(inviteNumber, userId);
      this.callbackInviteCode = ''; //清空邀请码
    }
  },
  clickDeleteOne: function clickDeleteOne() {
    var label = this._lastNumberLabel();
    if (label) {
      label.string = "";
    }
  },

  _lastEmptyLabel: function _lastEmptyLabel() {
    for (var index in this.labelNumbers) {
      var label = this.labelNumbers[index];
      if (label.string == null || label.string.length <= 0) {
        return label;
      }
    }
    return null;
  },

  _lastNumberLabel: function _lastNumberLabel() {
    for (var index = this.labelNumbers.length - 1; index >= 0; --index) {
      var label = this.labelNumbers[index];
      if (label.string && label.string.length > 0) {
        return label;
      }
    }

    return null;
  },

  _inviteNumber: function _inviteNumber() {
    return this.labelNumbers.reduce(function (inviteNumber, label) {
      //cc.log(inviteNumber,"-----------------");
      return inviteNumber + (label.string || "");
    }, "");
  }
});

cc._RFpop();
},{"socket":"socket"}],"joinRoom":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd5dcb9CJvpPJpnsCQ/q197x', 'joinRoom');
// scripts\joinRoom.js

cc.Class({
  "extends": cc.Component,

  properties: {
    labelNumbers: [cc.Label],
    callbackJoinRoom: null
  },

  // use this for initialization
  onLoad: function onLoad() {
    this.clickClear();
  },

  clickNumber: function clickNumber(event, number) {
    var label = this._lastEmptyLabel();
    if (label) {
      label.string = number;
    } else {
      return;
    }

    var isComplete = this._lastEmptyLabel() == null;
    if (isComplete && this.callbackJoinRoom) {
      var roomNumber = this._roomNumber();
      // cc.log("要加入的房间号是：", roomNumber);
      this.callbackJoinRoom(roomNumber);
    }
  },

  clickClear: function clickClear() {
    this.labelNumbers.forEach(function (label) {
      label.string = "";
    });
  },

  clickDeleteOne: function clickDeleteOne() {
    var label = this._lastNumberLabel();
    if (label) {
      label.string = "";
    }
  },

  _lastEmptyLabel: function _lastEmptyLabel() {
    for (var index in this.labelNumbers) {
      var label = this.labelNumbers[index];
      if (label.string == null || label.string.length <= 0) {
        return label;
      }
    }
    return null;
  },

  _lastNumberLabel: function _lastNumberLabel() {
    for (var index = this.labelNumbers.length - 1; index >= 0; --index) {
      var label = this.labelNumbers[index];
      if (label.string && label.string.length > 0) {
        return label;
      }
    }

    return null;
  },

  _roomNumber: function _roomNumber() {
    return this.labelNumbers.reduce(function (roomNumber, label) {
      return roomNumber + (label.string || "");
    }, "");
  }
});

cc._RFpop();
},{}],"launch":[function(require,module,exports){
"use strict";
cc._RFpush(module, '0efb2ngHglDtK2A+W4dmfzt', 'launch');
// scripts\launch.js

cc.Class({
    'extends': cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.scheduleOnce(function () {
            cc.director.loadScene('login');
        }, 0.5);
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"login":[function(require,module,exports){
(function (Buffer){
"use strict";
cc._RFpush(module, '9c72dn88ytPxZWrZRaxt5cr', 'login');
// scripts\login.js

var manager = require('manager');
var KQCard = require('KQCard');
var Socket = require('socket');
var KQCardFindTypeExtension = require('KQCardFindTypeExtension');
var KQGlobalEvent = require('KQGlobalEvent');
var AudioManager = require('AudioManager');
var KQNativeInvoke = require('KQNativeInvoke');
var KQGlabolSocketEventHander = require('KQGlabolSocketEventHander');

var APPID = 'wxe8993f468b16fa5d';
var ROOMID = '';
//授权地址
//正式地址
// var REDIRECT_URI = "http%3A%2F%2Fwww.honggefeng.cn%2FsszWeb%2Findex.php";
// 测试地址
var REDIRECT_URI = "http%3a%2f%2fo1o2.cn";

var HREF = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + APPID + "&redirect_uri=" + REDIRECT_URI + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";

cc.Class({

    'extends': cc.Component,
    properties: {
        //selectNode:cc.Node,
        alertPrefab: cc.Prefab,
        canvasNode: cc.Node,
        loadingNode: cc.Node,
        //err:cc.Node,
        waitingPrefab: cc.Prefab,
        recordInfo: cc.Prefab,
        label: cc.Label
    },

    goUpdateAction: function goUpdateAction() {
        if (KQNativeInvoke.isNativeIOS()) {
            jsb.reflection.callStaticMethod("AppController", "downloadNewVersion:", this.iosUrl);
        } else {
            //Android
            jsb.reflection.callStaticMethod("com/gongpa/ssz/AppActivity", "downloadNewVersion", "(Ljava/lang/String;)V", this.androidUrl);
        }
    },

    checkVersion: function checkVersion(vData) {
        //var version = vData.version;
        cc.info1 = vData.version;
        this.iosUrl = vData.iosUrl;
        this.androidUrl = vData.androidUrl;
        //if (manager.version != version) {//更新版本
        //    this.versionEnable = false;
        //    this.goUpdateAction();
        //    //this.versionLabel.string = '请到服务器更新到最新版本';
        //}
        //else {
        //this.versionLabel.string = '当前版本 ' + manager.version;
        if (KQNativeInvoke.isNativeIOS()) {
            // if(iosVersion != manager.version) {
            //     this.versionEnable = false;
            //     var updateAlert = cc.find("Canvas/update").getComponent("alert");
            //     updateAlert.alert();
            // }
            // else {
            this.versionEnable = true;
            var self = this;
            var info = manager.getUserInfo();
            if (info.length == 0) {
                this.loginEnable = true;
            }
            this.scheduleOnce(function () {
                if (info.length > 0) {
                    this.loginEnable = true;
                    self.loginAction();
                }
            }, 0.5);
            //}
        } else if (KQNativeInvoke.isNativeAndroid()) {
                // if(androidVersion != manager.version) {
                //     this.versionEnable = false;
                //     var updateAlert = cc.find("Canvas/update").getComponent("alert");
                //     updateAlert.alert();
                // }
                // else {
                this.versionEnable = true;
                var self = this;
                var info = manager.getUserInfo();
                if (info.length == 0) {
                    this.loginEnable = true;
                }
                this.scheduleOnce(function () {
                    if (info.length > 0) {
                        this.loginEnable = true;
                        self.loginAction();
                    }
                }, 0.5);
                //}
            } else {
                    this.versionEnable = true;
                    var self = this;
                    // var info = manager.getUserInfo();
                    // if (info.length == 0) {
                    //     this.loginEnable = true;
                    // }
                    this.scheduleOnce(function () {
                        if (!cc.sys.isNative) {
                            var recordId = self.getQueryString('recordId');
                            if (recordId) {
                                Socket.sendGetRecrodFromId(recordId);
                                return;
                            }
                            var roomId = self.getQueryString("roomId");
                            if (roomId) {
                                var info = manager.getUserInfo();
                                if (info.length > 0) {
                                    var data = JSON.parse(info);
                                    if (!data.errcode) {
                                        self.sendLoginRequest(data);
                                    } else {
                                        manager.setUserInfo("");
                                    }
                                    return;
                                } else {
                                    self._get_HREF(roomId);
                                }
                            }
                        }
                        var info = manager.getUserInfo();
                        if (info.length > 0) {
                            var data = null;
                            try {
                                data = JSON.parse(info);
                            } catch (e) {
                                manager.setUserInfo("");
                                data = null;
                            }
                            if (!data || data.errcode) {
                                manager.setUserInfo("");
                            } else {
                                this.loginEnable = true;
                                self.loginAction();
                            }
                        } else {
                            if (!cc.sys.isNative) {
                                var code = self.getQueryString("code");
                                var roomId = self.getQueryString("roomId");
                                if (roomId) {
                                    var info = manager.getUserInfo();
                                    if (info.length > 0) {
                                        var data = JSON.parse(info);
                                        if (!data.errcode) {
                                            self.sendLoginRequest(data);
                                        } else {
                                            manager.setUserInfo("");
                                        }
                                        return;
                                    } else {
                                        self._get_HREF(roomId);
                                    }
                                }
                                if (code) {
                                    try {
                                        var obj = new XMLHttpRequest(); // XMLHttpRequest对象用于在后台与服务器交换数据
                                        var url = "./get_token.php";
                                        obj.open("POST", url, true);
                                        obj.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); // 添加http头，发送信息至服务器时内容编码类型
                                        obj.onreadystatechange = function () {
                                            if (obj.readyState == 4 && (obj.status == 200 || obj.status == 304)) {
                                                // 304未修改
                                                //alert(obj.responseText);
                                                var data = JSON.parse(obj.responseText);
                                                if (!data.errcode) {
                                                    manager.setUserInfo(obj.responseText);
                                                    self.sendLoginRequest(data);
                                                }
                                            }
                                        };
                                        obj.send("code=" + code);
                                    } catch (e) {
                                        //alert(e);
                                    }
                                }
                            }
                        }
                    }, 0.5);
                }
        //}
    },
    keyBackListen: function keyBackListen() {
        var _this = this;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (e) {
            if (e.keyCode == cc.KEY.back) {
                if (!KQNativeInvoke.isNativeIOS()) {
                    jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "backToDesk", "()V");
                }
            }
        }, this);
    },
    onLoad: function onLoad() {
        this.keyBackListen();
        if (!cc.sys.isNative && cc.sys.isMobile) {
            var canvas = cc.find("Canvas");
            var cvs = canvas.getComponent(cc.Canvas);
        }
        KQGlabolSocketEventHander.start();
        this.socket = cc.find('GameSocket').getComponent('socket');
        var self = this;
        this.loginEnable = false;
        this.socket.receviceMessage = function (response) {
            var data = JSON.parse(response);
            //console.log(data)
            if (data.action == 'checkVersion') {
                try {
                    self.checkVersion(data.data);
                } catch (e) {
                    //this.err.string = e;
                }
            } else if (data.action == 'login') {
                    if (data.result) {
                        //成功
                        self.socket.userInfo = data.data; //运行时态信息
                        if (!cc.sys.isNative) {
                            var roomId = self.getQueryString("roomId");
                            //console.log(roomId);
                            if (roomId) {
                                var userId = data.data.id;
                                var exitInRoom = data.data.roomId;
                                if (exitInRoom != "") {
                                    roomId = exitInRoom;
                                }
                                Socket.sendLoginJoin(roomId, userId);
                                return;
                            }
                        }
                        self._loadingLabel("登录中");
                        if (data.data.roomId.length > 0) {
                            cc.director.loadScene('play');
                        } else {
                            cc.director.loadScene('hall');
                        }
                    } else {
                        // self.alertMessage('登录失败!');
                    }
                }
        };
        this._registerSocketEvent();

        this.socket.getWxInfo = function (info) {
            manager.setUserInfo(info); //保存本地
            var data = JSON.parse(info); //str -> json(obj)
            self.scheduleOnce(function () {
                //延迟执行 1s
                self.sendLoginRequest(data); //登录请求
            }, 1);
        };

        // let search = window.location.search;
        // var openid = "JzIwMTcvNi8xNiDkuIrljYgxMMzowOCc=";
        // var unionid = '8dOtAcDic5Sichv3lxtMXYJgmunTLOLv';
        // var nickname = "哇哈哈";
        // if (search) {
        //     var url = window.location.search;
        //     var loc = url.substring(url.lastIndexOf('=') + 1, url.length);
        //     if (loc == 1) {
        //         openid = 'JzIwMTctNi0xNiAwOTo0NTo1OSc=';
        //         unionid = 'JzIwMTctNi0xNiAwOTo0NTo1OSc';
        //         nickname = loc;
        //     }
        //     else if (loc == 2) {
        //         openid = 'JzIwMTcvNi8xNiDkuIrljYg5OjM4OjMzJw==';
        //         unionid = 'JzIwMTcvNi8xNiDkuIrljYg5OjM4OjMzJw';
        //         nickname = loc;
        //     }
        //     else if (loc == 3) {
        //         openid = 'JzIwMTctNi0xNiAwOTo0NToc=';
        //         unionid = '8dOtAcDic5Sichv3lxtMXYmunTLOLv';
        //         nickname = loc;
        //     }
        //     else if (loc == 4) {
        //         openid = 'ozlXIwgv_QJT0ykdUihaABmsWp2A';
        //         unionid = 'o-3911qWsQsW3wUodqFfUtbsAeNk';
        //         nickname = loc;
        //     }
        //     else if (loc == 5) {
        //         openid = 'JzIwMTcvNi8xNiDkuIrljYgxMDowMzowOCc=';
        //          unionid = 'o-JzIwMTcvNi8xNiDkuIrljYgxMDowM';
        //         nickname = loc;
        //     }else if(loc == 6){
        //         openid = 'JzIwMTcvNi8xNiDkuIrljYgxMMzoc=';
        //          unionid = 'o-zIwMTcvNi8xNiDkuIrl';
        //         nickname = loc;
        //     }

        // }
        // var testData = '{"openid":"'+openid+'","nickname":"'+nickname+'","unionid":"'+unionid+'","sex":1,"language":"zh_CN","city":"Changsha","province":"Hunan","country":"CN","headimgurl":"http:\/\/wx.qlogo.cn\/mmopen\/8D8dOtAcDic5Sichv3lxtMXYJgmunTLOLvTT5AFM4zaqKEthZibv8xdWkgjN9Yb4AQnwvSurz27UB29xx81XORwx55XanxqctdD\/0","privilege":[]}';

        // if (!cc.sys.isNative){
        //     manager.setUserInfo(testData);
        // }
    },

    _registerSocketEvent: function _registerSocketEvent() {
        KQGlobalEvent.on(Socket.Event.ReceiveLoginJoin, this._LoginJoin, this);
        KQGlobalEvent.on(Socket.Event.ReceiveRecordId, this._ReceiveRecordId, this);
        KQGlobalEvent.on(Socket.Event.ReceiveNoUionid, this._ReceiveNoUionid, this);
    },
    _get_HREF: function _get_HREF(roomId) {
        if (roomId != ROOMID) {
            ROOMID = roomId;
            roomId = "%3froomId%3d" + roomId;
            REDIRECT_URI = REDIRECT_URI + roomId;
            HREF = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + APPID + "&redirect_uri=" + REDIRECT_URI + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
        }
    },
    _ReceiveNoUionid: function _ReceiveNoUionid(response) {
        manager.setUserInfo("");
        var self = this;
        var roomId = this.getQueryString("roomId");
        if (roomId) {
            //roomId = "%3froomId%3d"+roomId ;
            //REDIRECT_URI = REDIRECT_URI+roomId;
            this._get_HREF(roomId);
        }
        setTimeout(function () {
            self.loadingNode.parent.active = false;
            self.loadingNode.stopAllActions();
        }, 2000);
        this._loadingLabel("登录失败，请重新登录");
    },
    _ReceiveRecordId: function _ReceiveRecordId(response) {
        var data = response.data;
        if (data.recordMsg.length > 0) {
            var record = data.recordMsg[0];
            var playersInfo = JSON.parse(record.playersInfo).players;
            var recordNode = cc.instantiate(this.recordInfo);
            var totalGameResult = recordNode.getComponent("TotalGameResult");
            playersInfo.sort(function (a, b) {
                return b.totalScore - a.totalScore;
            }); // 排序
            totalGameResult.setPlayerInfos(playersInfo, record);
            totalGameResult._clickBtn();
            recordNode.getComponent('alert').alert();
            this.node.addChild(recordNode);
        }
    },
    _LoginJoin: function _LoginJoin(response) {
        this._loadingLabel("进入房间，正在为您请求数据");
        if (response.result) {
            if (cc.from == null) {
                cc.from = {};
            }
            cc.from.ma = response.data.maPai;
            cc.director.loadScene('play');
        } else {
            cc.joinDesk = {};
            cc.director.loadScene('hall');
            var reasonInfo = this._joinReasonMap(response.data.reason);
            cc.joinDesk.result = response.result;
            cc.joinDesk.reason = reasonInfo;
        }
    },
    _joinReasonMap: function _joinReasonMap(reason) {
        var reasonInfo = {
            notExist: "房间不存在!",
            cardNumber: "您房卡不足!"
        };
        var info = reasonInfo[reason] || "房间已满!";
        return info;
    },

    getQueryString: function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);return null;
    },

    agreements: function agreements() {
        this.agreementNode.active = true;
        //this.agreementLabel.string = cc.info1;
        this.agreementLabel.node.y = 0;
    },

    onDestroy: function onDestroy() {
        this.socket.receviceMessage = function () {};
    },

    _loadingLabel: function _loadingLabel(label) {
        this.label.string = label;
    },

    sendLoginRequest: function sendLoginRequest(data) {
        //this.showWaitingMessage('登录中...');
        this.loadingNode.parent.active = true;
        this.loadingNode.runAction(cc.repeatForever(cc.rotateBy(2, 360)));
        //return;
        this.socket.sendMessage('login', data);
    },

    loginAction: function loginAction() {
        var info = manager.getUserInfo();
        if (info.length > 0) {
            var data = JSON.parse(info);
            this.sendLoginRequest(data);
            return;
        }
        if (!cc.sys.isNative) {
            // cc.sys.openURL(HREF);
            window.location.href = HREF;
        } else {
            if (KQNativeInvoke.isNativeIOS()) {
                jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "wxLogin"); //IOS
            } else if (KQNativeInvoke.isNativeAndroid()) {
                    //Android
                    jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "wxLogin", "()V");
                }
        }
    },

    loginYkAction: function loginYkAction() {
        //var comp = this.selectNode.getComponent('select');
        //if (!comp.selected) {
        //    this.showMsg = cc.instantiate(this.alertPrefab);
        //    this.canvasNode.addChild(this.showMsg);
        //    let comp = this.showMsg.getComponent('alert');
        //    comp.setMessage('请同意用户协议');
        //    return;
        //}
        var testDate = new Date();
        var time = "'" + testDate.toLocaleString() + "'";
        var openid = new Buffer(time).toString('base64');
        var testData = '{"openid":"' + openid + '","nickname":"游客","sex":1,"language":"zh_CN","city":"Changsha","province":"Hunan","country":"CN","headimgurl":"http:\/\/wx.qlogo.cn\/mmopen\/BVyz4R8q6puJibEv1hrsaTmIKQhkaTS9FyvcevvC5hlxFnfOuspDjicG0GtzyJXOhNT7g1WZDeCDQhnRdEOgz3QMnP0F9iboQGy\/0","privilege":[]}';
        var data = JSON.parse(testData);
        this.sendLoginRequest(data);
    },

    showWaitingMessage: function showWaitingMessage(msg) {
        if (this.waitingNode != null && cc.sys.isNative && cc.isValid(this.waitingNode)) {
            if (msg == this.waitingNode.getComponent('alert').getMessage()) {
                return;
            }
            this.waitingNode.removeFromParent();
            this.waitingNode = null;
        }
        this.waitingNode = cc.instantiate(this.waitingPrefab);
        this.canvasNode.addChild(this.waitingNode);
        var comp = this.waitingNode.getComponent('alert');
        //console.log(comp);

        comp.setMessage(msg);
        comp.alert();
    },

    hiddenWaitingMessage: function hiddenWaitingMessage() {
        if (this.waitingNode != null) {
            this.waitingNode.getComponent('alert').dismissAction();
        }
    },

    protocolAction: function protocolAction() {
        cc.log('protocol action');
    }
});

cc._RFpop();
}).call(this,require("buffer").Buffer)

},{"AudioManager":"AudioManager","KQCard":"KQCard","KQCardFindTypeExtension":"KQCardFindTypeExtension","KQGlabolSocketEventHander":"KQGlabolSocketEventHander","KQGlobalEvent":"KQGlobalEvent","KQNativeInvoke":"KQNativeInvoke","buffer":2,"manager":"manager","socket":"socket"}],"maPai":[function(require,module,exports){
"use strict";
cc._RFpush(module, '8b896xHkCtE1IzD8BDK4cWL', 'maPai');
// scripts\Play\maPai.js

cc.Class({
    "extends": cc.Component,

    properties: {
        maPaiSprite: [cc.SpriteFrame],
        spriteNode: cc.Sprite,
        labelNode: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {}

});

cc._RFpop();
},{}],"manager":[function(require,module,exports){
"use strict";
cc._RFpush(module, '4a47fj0J/VHup24OT7njkko', 'manager');
// scripts\manager.js

module.exports = {
    version: 'v1.0.0',

    setUserInfo: function setUserInfo(str) {
        cc.sys.localStorage.setItem('userinfo', str);
    },

    getUserInfo: function getUserInfo() {
        var value = cc.sys.localStorage.getItem('userinfo');
        if (!value) {
            return "";
        }
        return value;
    },

    setMusicValue: function setMusicValue(value) {
        cc.sys.localStorage.setItem('musicVolumn', value);
    },

    getMusicValue: function getMusicValue() {
        var value = cc.sys.localStorage.getItem('musicVolumn');
        if (!value) {
            return 1;
        }
        return value;
    },

    setMusicEffectValue: function setMusicEffectValue(value) {
        cc.sys.localStorage.setItem('musicEffectVolumn', value);
    },

    getMusicEffectValue: function getMusicEffectValue() {
        var value = cc.sys.localStorage.getItem('musicEffectVolumn');
        if (!value) {
            return 1;
        }
        return value;
    }
};

cc._RFpop();
},{}],"overTime":[function(require,module,exports){
"use strict";
cc._RFpush(module, '48748u5hxdOD4WTPWQqSQwN', 'overTime');
// scripts\overTime.js

cc.Class({
    'extends': cc.Component,

    properties: {
        nodes: [cc.Node],
        //selectedIndex: 0,
        _selected: 1
    },

    /*####*/
    onLoad: function onLoad() {
        var self = this;
        this._select = true;
        var overTime = 0;
        if (cc.set) {
            overTime = cc.set.setting6;
            this._selected = this._select = overTime;
        }

        for (var i = 0; i < this.nodes.length; i++) {
            var active = this._select;
            this._selected = this._select;
            this.nodes[i].getComponent('select').setSelected(active);
            var title = this.nodes[i].getChildByName('title');
            if (self._select) {
                title.color = new cc.Color(13, 210, 222);
            } else {
                title.color = new cc.Color(255, 255, 255);
            }
        }

        for (var i = 0; i < this.nodes.length; i++) {
            var tComp = this.nodes[i].getComponent('select');
            tComp.index = i;
            tComp.clickAction = function () {
                this.setSelected(self._selected = self._select = !self._select);
                var title = this.node.getChildByName("title");
                if (self._select) {
                    title.color = new cc.Color(13, 210, 222);
                } else {
                    title.color = new cc.Color(255, 255, 255);
                }
                self.onSelectChange(this.index);
            };
        }
        if (this.node._name == "orders" && cc.set) {
            //this.remember_set(overTime);
        }
    },
    remember_set: function remember_set(obj) {
        for (var i = 0; i < this.nodes.length; i++) {
            this.nodes[i].getComponent('select').setSelected(obj);
            this.nodes[i].getChildByName('title').color = new cc.Color(255, 255, 255);
            if (obj) {
                var title = this.nodes[0].getChildByName('title');
                title.color = new cc.Color(13, 210, 222);
            }
        }
    },

    onSelectChange: function onSelectChange(selectIndex) {
        //cc.log(selectIndex);
    }

});

cc._RFpop();
},{}],"play":[function(require,module,exports){
"use strict";
cc._RFpush(module, '16c65H2Pw9PBaQSvw69LGLQ', 'play');
// scripts\play.js

var Socket = require('socket');
var KQGlobalEvent = require('KQGlobalEvent');
var ArrayExtension = require('ArrayExtension');
var Manager = require('manager');
var AudioManager = require('AudioManager');
var KQNativeInvoke = require('KQNativeInvoke');
var UserModelHelper = require('UserModelHelper');
var Playback = require('Playback');
var fecha = require('fecha');
var manager = require('manager');
/*#####*/
var KQCard = require('KQCard');
/**/
var Player = require('Player');
/**/
//const isTeShuPai = require('isTeShuPai');
//特殊牌类型
var TESHUPAITYPE = {
    isTeShuPai: false,
    isLiuDuiBan: false,
    isSanShunZi: false,
    isSanTaoHua: false,

    isQingLong: false,
    isYiTiaoLong: false,
    isSanTongHuaShun: false,
    isSanFenTianXia: false,
    isCouYiSe: false,
    isSiTaoSanTiao: false,
    isWuDuiSanTiao: false
};

var GAMESTATUS = {
    WAIT_PEOPLE: 0, // 等人
    WAIT_READY: 1, // 等待他人准备
    PLAYING: 2 };
// 正在玩游戏
var sTitle = '';
var sDescription = '';
var sId = '';
// 布局
//          2
//   3            1
//     self 0
var Play = cc.Class({
    'extends': cc.Component,

    properties: {
        playerNodes: [cc.Node],
        //playsCoins: [cc.Node],
        chatNode: cc.Node,
        cardTypeCombineNode: cc.Node,
        typeButtonsNode: cc.Node,
        phone: cc.Label,
        labelRoomNumber: cc.Label,
        labelOverview: cc.Label,
        labelRemainTime: cc.Label,
        btnShare: cc.Button,
        btnReady: cc.Button, // 准备按钮
        btnStartGame: cc.Button, // 开始按钮
        beilv: cc.Node, // 选择倍率节点
        btnChatVoice: cc.Button,
        btnChatText: cc.Button,
        againBtn: cc.Node,

        startCompareCardsNode: cc.Node,
        settingNode: cc.Node,
        VoiceMsgBg: cc.Node,
        exit: cc.Node, // 离开房间节点
        Dissolve: cc.Node, // 解散房间节点
        shareBg: cc.Node, // 分享背景
        totalGameResult: cc.Node, // 结果节点
        alertRequestExitNode: cc.Node, // 申请退出 Node
        dissolveAlter: cc.Node, // 申请退出 Node
        alertRequestExitCountdownNode: cc.Node, // 申请退出倒计时 Node
        alertAnsowerExitNode: cc.Node, // 回答申请退出  Node
        contentAnsowerExitNode: cc.Node, // 回答申请退出头像  Node
        alertAnsowerExitResult: cc.Node, // 回答申请退出结果  Node
        alertAnsowerExitCountdownNode: cc.Node, // 回答以上请退出的倒计时
        Countdown: cc.Node, // 倒计时
        labelTime: cc.Label,
        needCard: cc.Label,
        alert: cc.Node,
        coinsContainerNode: cc.Node,
        btnAlertRequestExitConfirmButton: cc.Button,
        btnAlertRequestExitCancelButton: cc.Button,

        autoTishi: cc.Prefab,
        waitingPrefab: cc.Prefab,
        coinsPrefab: cc.Prefab,
        playerComps: [Player],

        gongXiNi: cc.Node,
        teShuPai: cc.Node,

        cardSpriteAtlas: cc.SpriteAtlas,
        daoSpriteAtlas: cc.SpriteAtlas,

        _liuDuiBan: false,
        _sanShunZi: false,
        _sanTongHua: false,
        _yiTiaoLong: false,

        _QingLong: false,
        _SanTongHuaShun: false,
        _SanFenTianXia: false,
        _CouYiSe: false,
        _SiTaoSanTiao: false,
        _WuDuiSanTiao: false,

        _playerComponents: null,
        _msgControl: null,
        _nowTimeAgain: 0,

        _socket: null,
        _userId: 0,
        _playerInfos: null,
        _deskInfo: null, // createTime 创建时间  isDissolving 表示是否正在解散 dissolveLeftTime 离解散剩余多长时间 dissolveAnswerInfo [处理过的人的信息]
        _gameStatus: GAMESTATUS.WAIT_PEOPLE,
        _enterTime: null,
        _bigRecordInfo: null,
        _players: null,
        /**/
        _isComparingCardsNow: false, // 是否正在比牌
        _playedCompareCardsIndexs: [], // 已经播放过比牌的局数
        /**/
        fapaiNode: cc.Prefab,
        liuduiban: cc.Prefab,
        santonghua: cc.Prefab,
        sanshunzi: cc.Prefab,
        quanleida: cc.Prefab
    },
    keyBackListen: function keyBackListen() {
        var _this = this;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (e) {
            if (e.keyCode == cc.KEY.back) {
                if (!KQNativeInvoke.isNativeIOS()) {
                    jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "backToDesk", "()V");
                }
            }
        }, this);
    },
    // use this for initialization
    onLoad: function onLoad() {
        var _this2 = this;

        this.keyBackListen();
        this.headCardTime = 0.85;
        var bg = this.node.getChildByName("room_bg");
        var windowP = cc.director.getWinSizeInPixels();
        var scaleX = windowP.width / bg.width;
        var scaleY = windowP.height / bg.height;
        var scale = Math.max(scaleX, scaleY);
        bg.scaleX = scale;
        bg.scaleY = scale;

        this.BtnClickGongXiNiComfirm = this.cardTypeCombineNode.getComponent("CardTypeCombine").BtnClickGongXiNiComfirm;
        this._enterTime = Date.now();
        /**/
        this.playerComps.forEach(function (playerComp) {
            playerComp.playedCompareCardsIndexs = _this2._playedCompareCardsIndexs;
        });
        /**/
        /*AudioManager.instance.playDeskMusic();*/

        AudioManager.instance.stopHallMusic();
        var bgSound = cc.sys.localStorage.getItem("bgSound");
        if (bgSound == 0) {
            var audioManager = cc.find('AudioManager');
            audioManager = audioManager.getComponent('AudioManager');
            audioManager.setEffectMusicVolum(bgSound);
        }

        this._initPlayerComponents();
        this._initSelectCardNode();
        this._initOneGameResult();
        this._remainTimeStartUpdate();

        this._userId = Socket.instance.userInfo.id;
        this._msgControl = this.chatNode.getComponent('MsgControl');
        this._userId = Socket.instance.userInfo.id;
        this.beilv.getComponent("selectbeilv")._userid = this._userId;
        //this.settingNode.getComponent("Setting").hideSwitch();
        this.labelRoomNumber.string = "";
        this.labelRemainTime.node.active = false;

        this._registerVoiceNodeEvents();
        this._registerSocketEvent();

        Play.instances = this;
        this._gongXiNiShow(false);
        if (Playback.instance.isContainPlaybackDatas()) {
            Playback.instance.startPlayback();
            this.playbackNode.active = true;
            this.btnChatVoice.node.active = false;
            //this.cardsFromArray.node.active = false;
        } else {
                this._loadDeskInfo();
            }

        this._socket = Socket.instance;

        cc.director.preloadScene('hall', function () {
            cc.director.preloadScene('login');
        });

        cc.clickOut = false;
        //this.timeStart(5);
    },

    timeStart: function timeStart(duration, action) {
        cc.assert(duration > 0);
        this.timeStop();
        this.Countdown.active = true;
        if (action != "ready") {
            var timestamp = cc.sys.localStorage.getItem("timestamp"); // 获取本地存储的时间戳
            if (timestamp) {
                // 如果有则证明玩家是重新进来了的
                var now = Date.parse(new Date());
                var time = duration * 1000;
                if (now - timestamp > time) {
                    // 超时
                    if (now - timestamp < 2 * time) {
                        duration = 5; // 玩家可能出于其他原因退出游戏导致超时，为其提供5秒时间整理牌型（这已经是很仁慈的了）。
                    } else {
                            cc.sys.localStorage.removeItem("timestamp");
                        }
                } else {
                    duration = Math.floor(duration - (now - timestamp) / 1000);
                }
            } else {
                // 如果没有时间戳，则保存，为玩家退出游戏保留证据；
                var timestamp = Date.parse(new Date());
                cc.sys.localStorage.setItem('timestamp', timestamp);
            }
        }
        this._timeRemainDuration = duration;
        this.labelTime.string = String(duration);
        this.Countdown.getComponent("time").setTime(duration * 0.5);
        var self = this;
        this.callback = function () {
            self._timeMethod(action);
        };
        this.schedule(this.callback, 1, duration);
    },

    timeStop: function timeStop() {
        this.unschedule(this.callback);
        this.Countdown.active = false;
    },

    _timeMethod: function _timeMethod(action) {
        this._timeRemainDuration = this._timeRemainDuration - 1;

        var remain = Math.max(this._timeRemainDuration, 0);
        this.labelTime.string = remain < 10 && remain > 0 ? '0' + remain : remain;

        if (this._timeRemainDuration <= 0) {
            this.timeStop();
            if (action == "ready") {
                if (this._deskInfo.cIndex > 0) {
                    this.clickReady();
                }
            }
            cc.sys.localStorage.removeItem("timestamp");
            return;
        }
    },

    _globalMsg: function _globalMsg(data) {
        //if(!cc.sys.isNative){
        var roomId = data.roomId;
        var wf = data.setting3; ///[疯狂场,鬼牌,比花色,坐庄,马牌]
        var room = "房号：" + roomId;
        var fk = wf[0] ? "疯狂场 " : "普通场 "; // 疯狂场
        var gp = wf[1] ? "鬼牌 " : "无鬼 "; // 鬼牌
        var hs = wf[2] ? "比花色 " : "不比花色 "; // 比花色
        var zj = wf[3] ? "坐庄 " : "不坐庄 "; // 庄家
        var mp = wf[4] ? "买马 " : "不买马 "; // 马牌
        var sf = "房费:" + (data.setting4 ? data.setting4 == 1 ? "赢者扣 " : "房主扣 " : "平摊 "); //收费
        var shareTitle = room + " 模式:" + zj + sf;

        var pj = ["5局 ", "10局 ", "20局 "]; //牌局
        var ds = ["4人不加色 ", "5人加一色 ", "6人二色 ", "7人加三色 "]; //多色
        var rs = ds[data.setting2] + "";
        var js = pj[data.setting1 - 2];
        var desc = '[大众十三水] ' + zj + fk + mp + gp + sf + rs + js + " 点击直接进入房间";

        sTitle = shareTitle;
        sDescription = desc;
        sId = 'roomId=' + roomId;

        cc.sys.localStorage.setItem('roomId', roomId);
        cc.sys.localStorage.setItem('shareTitle', shareTitle);
        cc.sys.localStorage.setItem('desc', desc);

        if (cc.sys.isBrowser) {
            if (window.shareToTimeLine) {
                window.shareToTimeLine();
            }
            if (window.shareToSession) {
                window.shareToSession();
            }
        }
        //}
    },

    /*#####*/
    /*显示马牌*/
    _initMaPai: function _initMaPai() {},

    _initPlayerComponents: function _initPlayerComponents(playerIndex) {
        this._playerComponents = this.playerNodes.map(function (node) {
            return node.getComponent('Player');
        });

        if (!playerIndex) {
            playerIndex = [0, 1, 2, 3, 4, 5];
        }

        var a = this._playerComponents.splice(1, 7);

        for (var i = 0; i < playerIndex.length - 1; i++) {
            var index1 = playerIndex[i];
            var index2 = playerIndex[i + 1];
            var tmp = null;
            tmp = a[index1];
            a[index1] = a[index2];
            a[index2] = tmp;
        }

        a.forEach((function (node) {
            this._playerComponents.push(node);
        }).bind(this));

        if (this.playsCoins && this.playsCoins.length > 0) {
            this.playsCoins.forEach((function (node) {
                node.active = false;
            }).bind(this));
        }

        this.playsCoins = [];

        this._playerComponents.forEach((function (plays, i) {
            var name = "coins" + i;

            var node = new cc.Node();

            node.name = name;

            node.x = plays.node.x;

            node.y = plays.node.y;

            this.node.addChild(node);

            this.playsCoins.push(node);
        }).bind(this));
    },

    _initSelectCardNode: function _initSelectCardNode() {
        var self = this;
        var cardTypeCombineComp = this.cardTypeCombineNode.getComponent('CardTypeCombine');
        cardTypeCombineComp.setFinishSelectCardsCallback(function (serverCardsInfo) {
            cardTypeCombineComp.reset();
            Socket.sendPlayCard(self._userId, serverCardsInfo);
            self.cardTypeCombineNode.active = false;
        });
    },

    /**/
    _initOneGameResult: function _initOneGameResult() {
        var self = this;
        // this.oneGameResult.setCloseCallback = function () {
        //     if (self._isRandomRoom()) {
        //         cc.director.loadScene('hall');
        //     }
        // };
    },

    onDestroy: function onDestroy() {
        KQGlobalEvent.offTarget(this);
    },

    clickLeaveDesk: function clickLeaveDesk() {
        // 点击离开桌子
        if (this._deskInfo.cIndex == 0) {
            // 还没开始可以退出房间
            if (this._deskInfo.createId == this._userId) {
                cc.director.loadScene('hall');
            } else {
                Socket.sendLeaveDesk(this._userId);
            }
        }
    },
    clickDissolveDesk: function clickDissolveDesk() {
        // 点击解散桌子
        if (this._deskInfo.createId == this._userId) {
            // 只有房主才能解散桌子
            this.btnAlertRequestExitCancelButton.node.active = true;
            this.btnAlertRequestExitConfirmButton.node.active = true;
            var _alert = this.alertRequestExitNode.getComponent('alert');
            _alert.unscheduleAllCallbacks();
            _alert.setMessage("是否要解散房间");
            _alert.alert();
        }
    },

    clickExitOut: function clickExitOut() {
        Socket.sendDissolveDesk(this._userId);
    },

    //解散退出房间
    clickExit: function clickExit() {
        if (Playback.instance.isPlaybacking()) {
            cc.director.loadScene('hall');
            return;
        }
        /**/
        if (this._deskInfo && this._deskInfo.isDeskOver) {
            if (!this._isComparingCardsNow) {
                // 如果房间已结束，并且不是正在播放打牌动画, 则直接离开房间
                cc.director.loadScene('hall');
            }
            return;
        }
        /**/
        //if (this._isRandomRoom()) {
        //    this.alertForceExitNode.getComponent('alert').alert();
        //    return;
        //}
        if (this._deskInfo.cIndex == 0) {
            if (this._deskInfo.createId == this._userId) {
                var alert1 = this.dissolveAlter.getComponent('alert');
                alert1.alert();
            } else {
                Socket.sendLeaveDesk(this._userId);
            }
            return;
        }
        this.btnAlertRequestExitCancelButton.node.active = true;
        this.btnAlertRequestExitConfirmButton.node.active = true;

        var alert = this.alertRequestExitNode.getComponent('alert');
        alert.unscheduleAllCallbacks();
        alert.setMessage("是否解散房间？");
        alert.alert();

        this.alertRequestExitCountdownNode.getComponent('Countdown').stop();
    },
    //不解散退出房间
    clickOut: function clickOut() {
        if (this._deskInfo.cIndex == 0) {
            if (this._deskInfo.createId == this._userId) {
                cc.clickOut = true;
                cc.director.loadScene('hall');
                return;
            } else {
                Socket.sendLeaveDesk(this._userId);
            }
        }
    },

    clickShareBg: function clickShareBg() {
        cc.find("Canvas/shareBg").active = false;
        this.shareBg.active = false;
    },
    guanzhu: function guanzhu() {
        // var url = "http://www.honggefeng.cn/gzh/index.html";
        // cc.sys.openURL(url)
    },
    recordShare: function recordShare() {
        if (this._deskInfo.recordId) {
            var shareTitle = "[大众十三水]战绩";
            var roomId = "房间号：" + this._deskInfo.roomId;
            var pj = ["5 ", "10 ", "20 "]; //牌局
            var js = "局数：" + pj[this._deskInfo.setting1 - 2];
            var time = "时间：" + this._deskInfo.createTime;
            var desc = roomId + js + time + "点击查看详情";

            var recordId = this._deskInfo.recordId;
            cc.sys.localStorage.setItem("shareTitle", shareTitle);
            cc.sys.localStorage.setItem("desc", desc);
            cc.sys.localStorage.setItem("recordId", recordId);
            cc.sys.localStorage.setItem("roomId", '');

            sTitle = shareTitle;
            sDescription = desc;
            sId = 'roomId=' + roomId;
            if (recordId) {
                sId = 'recordId=' + recordId;
            }

            if (cc.sys.isBrowser) {
                if (window.shareToTimeLine) {
                    window.shareToTimeLine();
                }
                if (window.shareToSession) {
                    window.shareToSession();
                }
            }
        };
        if (!cc.sys.isNative) {
            cc.find("Canvas/shareBg").active = true;
        } else {
            if (KQNativeInvoke.isNativeIOS()) {
                jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "wxScreenShareFriend");
            } else {
                //Android
                KQNativeInvoke.screenshotShare();
            }
        }
    },
    // 点击桌面分享
    clickDeskShare: function clickDeskShare() {
        //this._globalMsg(this._deskInfo);
        if (!cc.sys.isNative) {
            var shareBg = cc.find("Canvas/shareBg");
            shareBg.active = true;
            //var wxBg = this.shareBg.getChildByName("wx");
            //var pyqBg = this.shareBg.getChildByName("PYQ");
            //wxBg.active = true;
            //pyqBg.active = false;
            //this.shareBg.active = true;
        }
        var id = sId;
        var title = sTitle;
        var description = sDescription;
        if (KQNativeInvoke.isNativeIOS()) {
            jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "wxShareFriend:description:", id, description, title);
        } else if (KQNativeInvoke.isNativeAndroid()) {
            //Android
            var str = "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V";
            jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "wxShareFriend", str, id, description, title);
        }
    },
    //点击分享按钮
    clickShare: function clickShare() {
        //this._globalMsg(this._deskInfo);
        if (!cc.sys.isNative) {
            var wxBg = this.shareBg.getChildByName("wx");
            var pyqBg = this.shareBg.getChildByName("PYQ");
            wxBg.active = true;
            pyqBg.active = false;
            this.shareBg.active = true;
        }
        var id = sId;
        var title = sTitle;
        var description = sDescription;

        // let roomId = String(this._deskInfo.roomId);
        // var description = "大众十三水 玩法:"
        // description = description + " " + this._deskInfoNumberOfPeople();
        // description = description + "," + this._deskInfoPayInfo();
        // description = description + " " + this._deskInfoNumberOfGame();

        if (KQNativeInvoke.isNativeIOS()) {
            jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "wxShareFriend:description:", id, description, title);
        } else if (KQNativeInvoke.isNativeAndroid()) {
            //Android
            var str = "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V";
            jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "wxShareFriend", str, id, description, title);
        }
    },

    //分享到朋友圈
    shareHallTimeline: function shareHallTimeline() {
        if (!cc.sys.isNative) {
            var wxBg = this.shareBg.getChildByName("wx");
            var pyqBg = this.shareBg.getChildByName("PYQ");
            wxBg.active = false;
            pyqBg.active = true;
            this.shareBg.active = true;
        } else {
            var id = sId;
            var title = sTitle;
            var description = sDescription;

            if (KQNativeInvoke.isNativeIOS()) {
                jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "wxShareHallTimeline", id, description, title);
            } else {
                //Android
                var str = "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V";
                jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "wxShareHallTimeline", str, id, description, title);
            }
        }
    },

    //点击准备按钮
    clickReady: function clickReady() {
        this.btnReady.node.active = false;
        this.btnShare.node.active = false;
        this.timeStop();
        Socket.sendReady(this._userId);
    },

    //点击开始按钮
    clickStartGame: function clickStartGame() {
        this.btnReady.node.active = false;
        this.btnShare.node.active = false;
        this.btnStartGame.node.active = false;
        Socket.sendStartGame(this._userId);
    },

    updateRoomNumber: function updateRoomNumber(roomNumber) {
        var gameNumberString = "";
        if (this._deskInfo.setting1 != 0 && this._deskInfo.setting1 != 1) {
            gameNumberString = "局数 : " + "" + this._deskInfo.cIndex + "/" + this._deskInfo.mMax;
        } else if (this._deskInfo.setting1 == 0) {
            gameNumberString = "局数 : 10局";
        } else if (this._deskInfo.setting1 == 1) {
            gameNumberString = "局数 : 20局";
        }
        this.labelRoomNumber.string = "房号 : " + "" + roomNumber + "    " + gameNumberString;
    },

    updateGameStatus: function updateGameStatus() {
        var status = arguments.length <= 0 || arguments[0] === undefined ? GAMESTATUS.WAIT_PEOPLE : arguments[0];

        this._gameStatus = status;

        this.btnShare.node.active = status == GAMESTATUS.WAIT_PEOPLE;
        this.btnReady.node.active = status == GAMESTATUS.WAIT_READY;
        this.isReadyStatus();
    },

    gameStatus: function gameStatus() {
        return this._gameStatus;
    },
    isReadyStatus: function isReadyStatus() {
        if (this._playerInfos && this._playerInfos.length > 0) {
            this._playerInfos.forEach((function (playerInfo) {
                var userInfoSelf = cc.find('Canvas/playSelf/userInfoSelf');
                if (playerInfo.id == this._userId) {
                    if (!playerInfo.readyStatus && !this._isComparingCardsNow && !Playback.instance.isPlaybacking() && !Playback.instance.isContainPlaybackDatas()) {
                        userInfoSelf.getComponent('userInfo').setReadyNodeVisible(false);
                        if (this._deskInfo.cIndex == 0) {
                            //一局还没开始
                            this.btnReady.node.active = false;
                            if (this._deskInfo.players.length < this._deskInfo.maxNumber) {
                                this.btnShare.node.active = true;
                            } else {
                                this.btnShare.node.active = false;
                            }

                            if (this._deskInfo.players.length >= 2 && this._deskInfo.createId == this._userId) {
                                //是否是房主
                                this.btnStartGame.node.active = true;
                            } else {
                                this.btnStartGame.node.active = false;
                            }
                        } else {
                            this.btnReady.node.active = true;
                            this.btnShare.node.active = false;
                            this.btnStartGame.node.active = false;
                            this.btnStartGame.node.active = false;
                        }
                    } else {
                        this.btnReady.node.active = false;
                        this.btnShare.node.active = false;
                        this.btnStartGame.node.active = false;
                        if (!this._isComparingCardsNow) {
                            userInfoSelf.getComponent('userInfo').setReadyNodeVisible(true);
                        } else {
                            this._playerComponents.forEach(function (playerComp) {
                                playerComp.hideReadyStatus();
                            });
                        }
                    }
                }
                //console.log(this._isComparingCardsNow)
                //console.log("准备状态--------")
                if (this._isComparingCardsNow) {
                    //
                    this._playerComponents.forEach(function (playerComp) {
                        playerComp.hideReadyStatus();
                    });
                }
            }).bind(this));
        }
    },

    isGameStart: function isGameStart() {
        if (this._deskInfo.cIndex == 0) {
            //一局还没开始
            if (this._deskInfo.createId == this._userId) {
                //是否是房主
                if (!this._isComparingCardsNow && !Playback.instance.isPlaybacking() && !Playback.instance.isContainPlaybackDatas() && this._deskInfo.players.length >= 2) {
                    this.btnStartGame.node.active = true;
                    this.btnReady.node.active = false;
                } else {
                    this.btnStartGame.node.active = false;
                }
            } else {
                this.btnStartGame.node.active = false;
            }

            if (this._deskInfo.players.length < this._deskInfo.maxNumber) {
                this.btnShare.node.active = true;
            } else {
                this.btnShare.node.active = false;
            }
        } else {
            this.btnStartGame.node.active = false;
            this.btnShare.node.active = false;
        }
    },

    /// 游戏动画
    _startGame: function _startGame(playMusic) {

        if (this.gameStatus() == GAMESTATUS.PLAYING) {
            return;
        }
        //this._playerInfos = players;
        //this._playerComponents.forEach(function (player) {
        //
        //});
        this._playerComponents.forEach(function (playerComp) {
            playerComp.reset(); //#####
            playerComp.hideReadyStatus();
        });
        this.teShuPai.active = false;

        this.unscheduleAllCallbacks();

        this.playsCoins.forEach(function (no) {
            if (no) no.removeAllChildren();
        });

        this._playerComponents.forEach((function (plays, i) {

            var name = "coins" + i;

            var node = this.node.getChildByName(name);

            if (node) {
                node.removeAllChildren();
                this.node.removeChild(node);
            }
        }).bind(this));
        // cc.log(this.node)
        // cc.log('------709')
        this._updateUserInfos(this._playerInfos);
        this.showCompareCard();
        this._isComparingCardsNow = true;
        this.updateGameStatus(GAMESTATUS.PLAYING);
        this._playFaPaiAnimation(playMusic);

        var cardTypeCombine = this.cardTypeCombineNode.getComponent('CardTypeCombine');

        cardTypeCombine.reset();

        cardTypeCombine.node.active = false;

        if (!UserModelHelper.isPlayedCards(this._findPlayerInfoByUserId(this._userId))) {
            this.node.getComponent("animation").fapaiAnimation();
            this.scheduleOnce((function () {
                this._showCardTypeCombine();
            }).bind(this), 1.9);
        }
    },

    _playFaPaiAnimation: function _playFaPaiAnimation(playMusic) {
        this._playerComponents.forEach(function (player) {
            player.playFaPaiAnimation();
        });
        if (playMusic) {
            AudioManager.instance.playFaPai();
        }
    },

    /*#####*/
    //是否特殊牌
    isTeShuPai: function isTeShuPai(cards) {
        var result = KQCard.isTeShuPai(cards);
        if (result) {
            TESHUPAITYPE.isTeShuPai = true;
        } else {
            TESHUPAITYPE.isTeShuPai = false;
        }
        return result;
    },
    //是否一条龙
    isYiTiaoLong: function isYiTiaoLong(cards) {
        var result = KQCard.isYiTiaoLong(cards);
        if (result) {
            TESHUPAITYPE.isYiTiaoLong = true;
        } else {
            TESHUPAITYPE.isYiTiaoLong = false;
        }
        return result;
    },
    //是否六对半
    isLiuDuiBan: function isLiuDuiBan(cards) {
        var result = KQCard.isLiuDuiBan(cards);
        if (result) {
            TESHUPAITYPE.isLiuDuiBan = true;
        } else {
            TESHUPAITYPE.isLiuDuiBan = false;
        }
    },
    //是否三顺子
    isSanShunZi: function isSanShunZi(cards) {
        var result = KQCard.isSanShunZi(cards);
        if (result) {
            TESHUPAITYPE.isSanShunZi = true;
        } else {
            TESHUPAITYPE.isSanShunZi = false;
        }
    },
    //是否三同花
    isSanTongHua: function isSanTongHua(cards) {
        var result = KQCard.isSanTongHua(cards);
        if (result) {
            TESHUPAITYPE.isSanTaoHua = true;
        } else {
            TESHUPAITYPE.isSanTaoHua = false;
        }
    },
    //是否三同花顺
    isSanTongHuaShun: function isSanTongHuaShun(cards) {
        var result = KQCard.isSanTongHuaShun(cards);
        if (result) {
            TESHUPAITYPE.isSanTongHuaShun = true;
        } else {
            TESHUPAITYPE.isSanTongHuaShun = false;
        }
    },
    //是否是清龙
    isQingLong: function isQingLong(cards) {
        var result = KQCard.isQingLong(cards);
        if (result) {
            TESHUPAITYPE.isQingLong = true;
        } else {
            TESHUPAITYPE.isQingLong = false;
        }
    },
    //是否是 “三分天下”
    isSanFenTianXia: function isSanFenTianXia(cards) {
        var result = KQCard.isSanFenTianXia(cards);
        if (result) {
            TESHUPAITYPE.isSanFenTianXia = true;
        } else {
            TESHUPAITYPE.isSanFenTianXia = false;
        }
    },
    //是否是 “四套三条”
    isSiTaoSanTiao: function isSiTaoSanTiao(cards) {
        var result = KQCard.isSiTaoSanTiao(cards);
        if (result) {
            TESHUPAITYPE.isSiTaoSanTiao = true;
        } else {
            TESHUPAITYPE.isSiTaoSanTiao = false;
        }
    },
    //是否是五对三条
    isWuDuiSanTiao: function isWuDuiSanTiao(cards) {
        var result = KQCard.isWuDuiSanTiao(cards);
        if (result) {
            TESHUPAITYPE.isWuDuiSanTiao = true;
        } else {
            TESHUPAITYPE.isWuDuiSanTiao = false;
        }
    },
    //是否是凑一色
    isCouYiSe: function isCouYiSe(cards) {
        var result = KQCard.isCouYiSe(cards);
        if (result) {
            TESHUPAITYPE.isCouYiSe = true;
        } else {
            TESHUPAITYPE.isCouYiSe = false;
        }
    },
    /*#####*/

    /*显示配牌页面*/
    _showCardTypeCombine: function _showCardTypeCombine() {
        if (Playback.instance.isPlaybacking()) {
            return;
        }
        if (this.cardTypeCombineNode.active) {
            return;
        }

        this.startCompareCardsNode.active = false;
        this.btnReady.node.active = false;
        this.btnShare.node.active = false;

        cc.teShuPaiCards = null;

        var cardTypeCombine = this.cardTypeCombineNode.getComponent('CardTypeCombine');
        cardTypeCombine.reset();
        cardTypeCombine.reloadCards([]);
        cardTypeCombine.node.active = true;
        cardTypeCombine.timeStart(60);
        this.timeStart(60, "");
        this.cardTypeCombineNode.scale = 1;

        var cards = this._findCardsByUserId(this._userId);
        //"1_9""3_9""2_9"
        // "2_7""1_7""3_3""2_12"
        //"1_1""1_3""2_6""1_11""2_1""3_4"//
        // if(this._userId == 2){
        //     cards = [{suit: "d", number:2},{suit: "d", number:2}, {suit: "d", number:2},//青龙

        //         {suit: "h", number:2}, {suit: "d", number:2},
        //         {suit: "c", number:3}, {suit: "c", number:3}, {suit: "c", number:3},

        //         {suit: "d", number:3}, {suit: "d", number:4},
        //         {suit: "d", number:4}, {suit: "d", number:4}, {suit: "d", number:4}];
        // }
        //if(this._userId == 1){d
        //    cards = [{suit: "c", number:1},{suit: "h", number:1}, {suit: "s", number:1},//青龙
        //
        //        {suit: "h", number:8}, {suit: "c", number:2},
        //        {suit: "d", number:8}, {suit: "h", number:8}, {suit: "d", number:20},
        //        {suit: "h", number:9}, {suit: "s", number:9},
        //        {suit: "s", number:9}, {suit: "s", number:9}, {suit: "h", number:9}];
        //}
        // else if(this._userId == 6){
        //     cards = [{suit: "d", number:11},{suit: "d", number:13}, {suit: "d", number:11},//青龙
        //         {suit: "d", number:1}, {suit: "d", number:1},
        //         {suit: "h", number:2}, {suit: "h", number:4}, {suit: "h", number:9},
        //         {suit: "s", number:7}, {suit: "s", number:7},
        //         {suit: "s", number:5}, {suit: "s", number:5}, {suit: "s", number:5},];
        // }

        //else if(this._userId == 3){
        //    cards = [{suit: "d", number:4},{suit: "d", number:13}, {suit: "s", number:13},//青龙
        //        {suit: "d", number:6}, {suit: "s", number:7},
        //        {suit: "d", number:8}, {suit: "c", number:9}, {suit: "c", number:10},
        //        {suit: "s", number:1}, {suit: "s", number:3},
        //        {suit: "s", number:10}, {suit: "s", number:8}, {suit: "s", number:12},];
        //}
        cc.moshi = 0;
        for (var i = 0; i < cards.length; i++) {
            var s = cards[i].number;
            if (s >= 20) {
                cc.moshi = 1;
                break;
            }
        }
        var cardNames = this._convertCardsToCardNames(cards);
        cardTypeCombine.reloadCards(cardNames);
        cardTypeCombine.addCardModes(cardNames);

        //cc.from.moshi == 0选择了庄家模式

        if (cc.moshi != 1) {
            this.isTeShuPai(cards);
            this.isQingLong(cards);
            this.isYiTiaoLong(cards);
            this.isLiuDuiBan(cards);
            this.isSanShunZi(cards);
            this.isSanTongHua(cards);
            if (TESHUPAITYPE.isTeShuPai) {
                this.cardTypeCombineNode.scale = 0;
                var nodes = this.gongXiNi.getChildByName("bg");
                nodes.opacity = 240;
            }
            //this.isSanTongHuaShun(cards);
            //this.isSanFenTianXia(cards);
            //this.isSiTaoSanTiao(cards);
            //this.isWuDuiSanTiao(cards);
            //this.isCouYiSe(cards);
            this._showGongXiNiAndBtnTeShuPai();
        }
        cardTypeCombine.cacleAutoSelectedCards2();

        if (cc.moshi == 1) cc.teShuPaiCards = null;
        this._playerComponents.forEach(function (playerComp) {
            playerComp.reset(); //#####
            playerComp.hideReadyStatus();
        });
    },

    getIsTeShuPai: function getIsTeShuPai(userId) {
        var cards = this._findCardsByUserId(userId);
        return this.isTeShuPai(cards);
    },

    /*#####检测特殊牌类型，显示相对应的恭喜你页面和特殊牌精灵*/
    _showGongXiNiAndBtnTeShuPai: function _showGongXiNiAndBtnTeShuPai() {
        /*如果有特殊牌*/
        if (TESHUPAITYPE.isTeShuPai) {
            if (TESHUPAITYPE.isQingLong) {
                this._gongXiNiShow(true, "同花十三水");
                this._sanTongHua = true;
            } else if (TESHUPAITYPE.isYiTiaoLong) {
                this._gongXiNiShow(true, "十三水");
                this._yiTiaoLong = true;
            } else if (TESHUPAITYPE.isLiuDuiBan) {
                this._gongXiNiShow(true, "六对半");
                this._liuDuiBan = true;
            } else if (TESHUPAITYPE.isSanShunZi) {
                this._gongXiNiShow(true, "三顺子");
                this._sanShunZi = true;
            } else if (TESHUPAITYPE.isSanTaoHua) {
                this._gongXiNiShow(true, "三同花");
                this._sanTongHua = true;
            }
            //else if(TESHUPAITYPE.isSanTongHuaShun){
            //    this._gongXiNiShow(true);
            //    this._SanTongHuaShun = true;
            //}
            //else if(TESHUPAITYPE.isSanFenTianXia){
            //    this._gongXiNiShow(true);
            //    this._SanFenTianXia = true;
            //}
            //else if(TESHUPAITYPE.isCouYiSe){
            //    this._gongXiNiShow(true);
            //    this._CouYiSe = true;
            //}
            //else if(TESHUPAITYPE.isSiTaoSanTiao){
            //    this._gongXiNiShow(true);
            //    this._SiTaoSanTiao = true;
            //}
            //else if(TESHUPAITYPE.isWuDuiSanTiao){
            //    this._gongXiNiShow(true);
            //    this._WuDuiSanTiao = true;
            //}
            else {
                    this._gongXiNiShow(false);
                }
        }
        //this._initTeShuPaiSprite();
    },

    /*#####控制特殊牌精灵的显示*/
    _initTeShuPaiSprite: function _initTeShuPaiSprite() {
        /*把所有的特殊牌精灵都隐藏掉*/
        //for(var i=0;i<this.teshupai_min.length;i++){
        //    this.teshupai_min[i].active = false;
        //    this.teshupai_max[i].active = false;
        //}
        ///*如果是一条龙，就显示一条龙的精灵*/
        //if(this._yiTiaoLong){
        //    this.teshupai_min[3].active = true;
        //    this.teshupai_max[3].active = true;
        //}
        ///*如果是六对半就显示六对半的精灵*/
        //else if(this._liuDuiBan){
        //    this.teshupai_min[0].active = true;
        //    this.teshupai_max[0].active = true;
        //}
        ///*如果是三顺子就显示三顺子的精灵*/
        //else if(this._sanShunZi){
        //    this.teshupai_min[1].active = true;
        //    this.teshupai_max[1].active = true;
        //}
        ///*如果是三同花，就显示三同花的精灵*/
        //else if(this._sanTongHua){
        //    this.teshupai_min[2].active = true;
        //    this.teshupai_max[2].active = true;
        //}
        ///*如果是三同花，就显示三同花的精灵*/
        //else if(this._QingLong){
        //    this.teshupai_min[4].active = true;
        //    this.teshupai_max[4].active = true;
        //}_gongXiNiShow
        ///*如果是三同花，就显示三同花的精灵*/
        //else if(this._SanTongHuaShun){
        //    this.teshupai_min[5].active = true;
        //    this.teshupai_max[5].active = true;
        //}
        ///*如果是三同花，就显示三同花的精灵*/
        //else if(this._SanFenTianXia){
        //    this.teshupai_min[6].active = true;
        //    this.teshupai_max[6].active = true;
        //}
        ///*如果是三同花，就显示三同花的精灵*/
        //else if(this._CouYiSe){
        //    this.teshupai_min[7].active = true;
        //    this.teshupai_max[7].active = true;
        //}
        ///*如果是三同花，就显示三同花的精灵*/
        //else if(this._SiTaoSanTiao){
        //    this.teshupai_min[8].active = true;
        //    this.teshupai_max[8].active = true;
        //}
        ///*如果是三同花，就显示三同花的精灵*/
        //else if(this._WuDuiSanTiao){
        //    this.teshupai_min[9].active = true;
        //    this.teshupai_max[9].active = true;
        //}
    },

    /*#####*/
    //显示gongXiNi 页面和teShuPai
    clickGongXiNiShow: function clickGongXiNiShow() {
        this.cardTypeCombineNode.scale = 1;
        var nodes = this.gongXiNi.getChildByName("bg");
        nodes.opacity = 0;
    },

    _gongXiNiShow: function _gongXiNiShow(statues) {
        var test = arguments.length <= 1 || arguments[1] === undefined ? "" : arguments[1];

        //var alterCom = this.gongXiNi.getComponent("alert");
        var alterCom = this.gongXiNi.getComponent('alert');
        alterCom.unscheduleAllCallbacks();
        test = "是否按特殊牌型[" + test + "]出牌？" + "\n" + "(取消后点击左下角可再报道)";
        alterCom.setMessage(test);
        if (statues) {
            alterCom.alert();
        } else {
            alterCom.dismissAction();
        }
        this.teShuPai.active = statues;
        var nodes = this.teShuPai.getChildByName("btnTeshupai");
        nodes.children[0].runAction(cc.repeatForever(cc.rotateBy(1, -360)));
        nodes.children[1].runAction(cc.repeatForever(cc.rotateBy(1, 360)));
    },
    /*#####*/

    //  结果相关
    // 显示一局结果
    _showOneGameResult: function _showOneGameResult() {
        /**/
        this._isComparingCardsNow = false;
        /**/
        this.updateGameStatus(GAMESTATUS.WAIT_PEOPLE);
        //let oneGameResult = this.oneGameResult.getComponent('GameResult');
        //oneGameResult.unscheduleAllCallbacks();
        //oneGameResult.showResults(this._deskInfo, this._userId);
        this._updateUserScores();
        //this._updateBanker();
        //
        var self = this;
        this.scheduleOnce(function () {
            //self._playerComponents.forEach(function (playerComp) {
            //  //playerComp.reset();
            //  //playerComp.reset2();  //#####
            //});

            if (!self._isRandomRoom()) {
                //if (self._deskInfo.cIndex == 0) {//一局还没开始
                //    self.btnReady.node.active = true;
                //}
                if (self._isTotalGameOver()) {
                    self._showTotalGameResult();
                }
            }
        }, 0.5);

        if (this._isRandomRoom() || Playback.instance.isPlaybacking()) {
            this.scheduleOnce(function () {
                oneGameResult.getComponent('alert').dismissAction();
                cc.director.loadScene('hall');
            }, 2);
            return true;
        }
    },

    // 显示总结果
    _showTotalGameResult: function _showTotalGameResult() {
        var showDelay = arguments.length <= 0 || arguments[0] === undefined ? 2 : arguments[0];

        this.timeStop();
        //cc.find("Canvas/show_result").active = false;
        this.btnReady.node.active = false;
        this.btnShare.node.active = false;
        this.alertAnsowerExitNode.active = false;
        this.alertRequestExitNode.active = false;
        if (this._deskInfo.cIndex == this._deskInfo.mMax) {
            this.againBtn.active = true;
        } else {
            this.againBtn.active = false;
        }

        var totalGameResultComp = this.totalGameResult.getComponent('TotalGameResult');
        if (totalGameResultComp.node.active) {
            return;
        }

        if (this._bigRecordInfo == null) {
            this._bigRecordInfo = this._deskInfo.players;
        }
        totalGameResultComp.setPlayerInfos(this._bigRecordInfo, this._deskInfo);

        var alert = this.totalGameResult.getComponent('alert');
        this.scheduleOnce((function () {
            //this.oneGameResult.active = false;
            //alert.alert();
            /**/
            if (!this.totalGameResult.active) {
                alert.alert();
            }
            /**/
        }).bind(this), showDelay);

        alert.setDismissCallback(function () {
            Socket.sendOnceAgain('false', this._userId);
            //cc.director.loadScene('hall');
        });
    },
    clickAgain: function clickAgain() {
        Socket.sendOnceAgain('true', this._userId);
    },

    // MARK: Socket 相关
    _loadDeskInfo: function _loadDeskInfo() {
        Socket.sendGetDesckInfo(this._userId);
    },
    _registerSocketEvent: function _registerSocketEvent() {
        KQGlobalEvent.on(Socket.Event.ReceiveDeskInfo, this._socketReceiveDeskInfo, this);
        KQGlobalEvent.on(Socket.Event.ReceiveOnlineStatus, this._socketReciveOnlineStatus, this);
        KQGlobalEvent.on(Socket.Event.ReceiveChatText, this._socketReciveChatTextMessage, this);
        KQGlobalEvent.on(Socket.Event.ReceiveChatEmoji, this._socketReciveChatEmojiMessage, this);
        KQGlobalEvent.on(Socket.Event.ReceiveRequestDissolve, this._socketReceiveRequestExitMessage, this);
        KQGlobalEvent.on(Socket.Event.ReceiveRequestDissolveResult, this._socketReceiveRequestExitResultMessage, this);
        KQGlobalEvent.on(Socket.Event.ReceiveAudioMessage, this._socketReceiveAudioMessage, this);
        KQGlobalEvent.on(Socket.Event.ReceivePlayCard, this._socketReceivePlayCard, this);
        KQGlobalEvent.on(Socket.Event.ReceiveGameOver, this._socketReceiveGameOver, this);
        KQGlobalEvent.on(Socket.Event.ReceiveFaPai, this._socketReciveFaPai, this);
        KQGlobalEvent.on(Socket.Event.ReceiveReady, this._socketReciveReady, this);
        KQGlobalEvent.on(Socket.Event.ReceiveDissolveDesk, this._socketReceiveDissolveDesk, this);
        KQGlobalEvent.on(Socket.Event.ReceiveLeaveDesk, this._socketLeaveDesk, this);
        KQGlobalEvent.on(Socket.Event.SocketDisconnect, this._receiveSocketConnectError, this);
        KQGlobalEvent.on(Socket.Event.SocketConnectSuccessed, this._receiveSocketConnectSuccessed, this);
        KQGlobalEvent.on(Socket.Event.ReceivePause, this._socketReceivePause, this);
        KQGlobalEvent.on(Socket.Event.ReceiveSelectBeiLv, this._ReceiveSelectBeiLv, this);
        KQGlobalEvent.on(Socket.Event.ReceiveBeiLv, this._ReceiveBeiLv, this);
        KQGlobalEvent.on(Socket.Event.ReceiveQingLi, this._ReceiveQingLi, this);
        KQGlobalEvent.on(Socket.Event.ReceiveOnceAgain, this._ReceiveOnceAgain, this);
    },

    _ReceiveOnceAgain: function _ReceiveOnceAgain(response) {
        var _this3 = this;

        /**
         * 再来一局
         * 总结果要隐藏掉
         * 比牌要隐藏掉
         * 发牌要显示
         */
        this._playedCompareCardsIndexs = [];
        this.playerComps.forEach(function (playerComp) {
            playerComp.playedCompareCardsIndexs = _this3._playedCompareCardsIndexs;
        });
        var data = response.data;
        if (!data.reason) {
            this.totalGameResult.active = false;
            this.startCompareCardsNode.active = false;
            this._playerComponents.forEach(function (playerComp) {
                playerComp.reset(); //#####
            });
            this._socketReceiveDeskInfo(response);
        } else {
            var now = Date.now();
            if (now - this._nowTimeAgain > 1500) {
                this._nowTimeAgain = now;
                this.alertAnsowerExitResult.y = -143;
                this.alertAnsowerExitResult.opacity = 255;
                this.alertAnsowerExitResult.children[0].getComponent(cc.Label).string = '房卡不足';
                var action = cc.spawn(cc.moveTo(0.3, cc.p(0, 20)), cc.fadeOut(0.3));
                this.alertAnsowerExitResult.runAction(cc.sequence(cc.moveTo(1, cc.p(0, 0)), action));
            }
        }
    },

    _ReceiveSelectBeiLv: function _ReceiveSelectBeiLv() {
        if (this._deskInfo.createId != this._userId) {
            this.beilv.active = true;
            var B3 = this.beilv.getChildByName('bg').getChildByName('btn3').getComponent(cc.Button);
            if (this._deskInfo.setting5 == 1) {
                /**
                 * 庄家选择两倍的时候 3倍按钮是不能响应的
                 * 选择三倍不用管，全部显示，
                 * 选择一倍也不用管，直接发牌，
                 */
                B3.interactable = false;
            }
            var selectBl = this.beilv.getComponent('selectBeilv');
            selectBl._userid = this._userid;
        }
    },

    _ReceiveBeiLv: function _ReceiveBeiLv(response) {
        var userId = response.data.userId;
        var bl = response.data.beilv;
        this._playerComponents.forEach(function (player) {
            player.showBeilv(userId, bl);
        });
    },

    _ReceiveQingLi: function _ReceiveQingLi(response) {
        var leaveId = response.data.leaveId;
        if (leaveId == this._userId) {
            if (cc.qingli == null) {
                var ql = response.action;
                cc.qingli = '';
                cc.qingli = ql;
            }
            cc.director.loadScene('hall');
        }
    },

    _socketReceiveDeskInfo: function _socketReceiveDeskInfo(response) {
        if (!response.result) {
            cc.error("错误：", response);
            return;
        }
        var data = response.data;

        this._initPlayerComponents(data.playersIndexAyy);
        /*#####添加五同按钮*/
        // cc.moshi = 0;

        // if(data.setting3[1] == true) cc.moshi = 1;  //  ？？？

        cc.maPai = null;

        if (data.maPai.length == 2) cc.maPai = data.maPai[0] + "_" + data.maPai[1];

        cc.huaSe = data.setting3[2];

        cc.chaoShiChuPai = data.setting6;

        cc.duoYiSe = response.data.setting2; //setting2为 4~7 人（0~3）

        this._deskInfo = data;
        this._globalMsg(data);
        this._updatGameOverview(this._deskInfo);
        this.updateRoomNumber(data.roomId);
        this.needCard.string = data.needCard; // 开放需要的房卡
        var playerIndexs = data.playersIndex; // [100049]
        this._injectUserIdToPlayerComponents(playerIndexs);

        var players = data.players;
        this._playerInfos = players;
        this._updateUserInfos(players);
        this._updateUserScores();
        this._updateBanker();
        this._msgControl.addPlayerInfos(this._playerInfos);

        var currentUserInfo = players.find((function (playerInfo) {
            return playerInfo.id == this._userId;
        }).bind(this));

        if (data.createId == this._userId) {
            if (data.cIndex > 0) {
                // 开始游戏了，请离按钮全部隐藏
                this._playerComponents.forEach(function (player) {
                    player.showQingli(false, data.cIndex);
                });
            } else {
                // 游戏没开始，房主的请离按钮不显示
                this._playerComponents.forEach(function (player) {
                    if (data.createId == player.userId) {
                        // 我是房主，不显示我的请离按钮
                        player.showQingli(true, data.cIndex);
                    } else {
                        player.showQingli(false, data.cIndex);
                    }
                });
            }
        }

        this._playerComponents.forEach(function (player) {
            if (data.createId == player.userId) {
                //显示房主
                player.showFangZhuStatus(data.createId, true);
            } else {
                player.showFangZhuStatus(player.userId, false);
            }
        });

        if (this._deskInfo.createId != this._userId) {
            // 非庄家
            if (this._deskInfo.cIndex == 0) {
                // 如果还没开始游戏，显示退出按钮，隐藏解散按钮
                this.exit.active = true;
                this.Dissolve.active = false;
            } else {
                // 反之
                this.exit.active = false;
                this.Dissolve.active = true;
            }
        } else {
            // 庄家
            if (this._deskInfo.cIndex > 0) {
                // 开局了 隐藏退出按钮
                this.exit.active = false;
                this.Dissolve.active = true;
            } else {
                // 没开局 两个都显示
                this.exit.active = true;
                this.Dissolve.active = true;
            }
        }

        if (!this._deskInfo.isCBegin) {
            this._gameStatus = GAMESTATUS.WAIT_READY;
        }
        for (var i = 0; i < players.length; i++) {
            var s = players[i];
            var is = s.readyStatus; //true/false
            var userId = s.id;
            this._playerComponents.forEach((function (player) {
                if (!this._deskInfo.isCBegin) player.showReadyStatus(userId, is);
            }).bind(this));
        }
        if (currentUserInfo && currentUserInfo.cards.length > 0 && this._deskInfo.isCBegin) {
            if (!currentUserInfo.cardInfo.length) {
                this._startGame(true);
            } else {
                this._startGame(false);
            }
        } else if (UserModelHelper.isPlayedCards(currentUserInfo) && !this._deskInfo.isCBegin) {
            this._socketReceiveGameOver(response);
        }
        this.isReadyStatus();
        this._handleUpdateDeskInfoAboutExitRoom(this._deskInfo);
        this.showCompareCard();
    },

    showCompareCard: function showCompareCard() {
        if (this._deskInfo.cIndex == 0 || this._deskInfo.isCBegin || !this._deskInfo.players || this._deskInfo.players.length <= 0 || this._deskInfo.players[0].cardInfo <= 0) {
            return;
        }

        this.playsCoins.forEach(function (no) {
            if (no) no.removeAllChildren();
        });

        this.unscheduleAllCallbacks();

        this.node.stopAllActions();

        this._playerComponents.forEach(function (playerComp) {
            playerComp.readyToCompareCards();
        });

        this._playerComponents.forEach((function (player) {

            if (player.node.active) player.showAllCompareCards(this._deskInfo.players);
        }).bind(this));

        this.startCompareCardsNode.active = false;

        this._isComparingCardsNow = false;

        this.isReadyStatus();

        this.scheduleOnce((function () {

            if (this._isTotalGameOver()) this._showTotalGameResult();
        }).bind(this), 0.5);
    },

    _socketReciveFaPai: function _socketReciveFaPai(response) {
        //  发牌了开始比牌隐藏掉
        this.startCompareCardsNode.active = false;
        this.timeStop();
        this._isComparingCardsNow = true;
        this._gameStatus = GAMESTATUS.WAIT_READY;
        this._socketReceiveDeskInfo(response);
    },
    logoutAction: function logoutAction() {
        cc.director.loadScene('login');
        manager.setUserInfo('');
        //hall.cacheImageInfo = null;
    },
    _socketReciveOnlineStatus: function _socketReciveOnlineStatus(response) {
        //{"action":"sendOnlineStatus","result":true,"data":{"userId":100049,"status":1}}
        if (!response.result) {
            cc.error("错误：", response);
            return;
        }

        var data = response.data;
        var userId = data.userId;
        var status = data.status;

        this._playerComponents.forEach(function (player) {
            player.setUserOnlineStatus(userId, status);
        });
    },

    _socketReciveChatTextMessage: function _socketReciveChatTextMessage(response) {
        var userId = response.data.userId;
        var message = response.data.msg;

        this._playerComponents.forEach(function (player) {
            player.showChatText(userId, message);
        });

        this._msgControl.addChatTextMessage(userId, message);

        var sex = this._playerInfos.find(function (user) {
            return user.id == userId;
        }).sex;
        AudioManager.instance.playChatAudio(sex, message);
    },
    _socketReciveChatEmojiMessage: function _socketReciveChatEmojiMessage(response) {
        var userId = response.data.userId;
        var emoji = response.data.emoji;

        //this._playerComponents.forEach(function (player) {
        //    player.showChatText(userId, emoji);
        //});
        //this._msgControl.addChatEmojiMessage(userId, emoji);
        this._msgControl._loadEmojiFrame(emoji, (function (frame) {
            this._playerComponents.forEach(function (player) {
                if (player.userId == userId) player.chatMessageNode.getComponent('ChatMessage').showEmoji(frame);
            });
        }).bind(this));
    },

    _socketReceiveRequestExitMessage: function _socketReceiveRequestExitMessage(response) {
        //if (response.data.userId == this._userId) {
        //    return;
        //}

        var alert_bg = this.alertAnsowerExitNode.getChildByName("alert_bg");

        var btnAgree = alert_bg.getChildByName("btnAgree");

        var btnDisagree = alert_bg.getChildByName("btnDisagree");

        btnAgree.active = true;

        btnDisagree.active = true;

        var dataInfos = response.data.info;

        if (!this.alertAnsowerExitNode.active) {

            var alertComp = this.alertAnsowerExitNode.getComponent('alert');

            alertComp.alert();

            alertComp.unscheduleAllCallbacks();

            this.contentAnsowerExitNode.children.forEach(function (i) {
                i.active = false;
            });

            this._playerInfos.forEach((function (playerInfo, index) {

                var play = this.contentAnsowerExitNode.children[index];

                var name = play.getChildByName("nickname");

                var back = play.getChildByName("fanzhu");

                var img = play.getChildByName("avatar_bg");

                play.active = true;

                name.getComponent(cc.Label).string = playerInfo.nickname;

                if (this._deskInfo.createId == playerInfo.id) {
                    //显示房主

                    back.active = true;
                } else {

                    back.active = false;
                }

                cc.loader.load({ url: playerInfo.avatarUrl, type: "jpg" }, (function (err, data) {

                    if (err) return;

                    var frame = new cc.SpriteFrame(data);

                    img.getComponent(cc.Sprite).spriteFrame = frame;
                }).bind(this));
            }).bind(this));

            var countdown = this.alertAnsowerExitCountdownNode.getComponent('Countdown');

            countdown.startCountdown(60, (function (isTimeout) {

                if (isTimeout) {

                    this.clickAgreeOtherPlayerExit();

                    return;
                }
            }).bind(this));
        }

        this._playerInfos.forEach((function (playerInfo, index) {

            var dataInfo = dataInfos[index];

            var play = this.contentAnsowerExitNode.children[index];

            var str = play.getChildByName("id");

            var dataInfo = dataInfos[index];

            if (dataInfo == 1) {

                if (this._userId == playerInfo.id) {
                    //显示房主

                    btnAgree.active = false;

                    btnDisagree.active = false;
                }

                str.getComponent(cc.Label).string = "同意";
            } else {

                str.getComponent(cc.Label).string = "";
            }
        }).bind(this));
    },

    _socketReceiveRequestExitResultMessage: function _socketReceiveRequestExitResultMessage(response) {
        this._hideReqestExitNode();
        if (this.alertAnsowerExitNode.active) {
            this.alertAnsowerExitNode.getComponent('alert').dismissAction();
            this.alertAnsowerExitCountdownNode.getComponent('Countdown').stop();
        }

        if (response.data.result) {
            // 解散成功
        } else {
                var userId = response.data.userId;
                var nickname = this._findPlayerInfoByUserId(userId).nickname;
                this.alertAnsowerExitResult.y = -143;
                this.alertAnsowerExitResult.opacity = 255;
                this.alertAnsowerExitResult.children[0].getComponent(cc.Label).string = nickname + '不同意退出';
                var action = cc.spawn(cc.moveTo(.3, cc.p(0, 20)), cc.fadeOut(this.cardTime));
                this.alertAnsowerExitResult.runAction(cc.sequence(cc.moveTo(1, cc.p(0, 0)), action));

                //this.showAlertMessage('解散失败，因为' + nickname + '不同意退出');
            }
    },

    _socketReceiveAudioMessage: function _socketReceiveAudioMessage(response) {
        var userId = response.data.userId;
        this.playSpeakAnimation(userId);

        if (userId == this._userId) {
            return;
        }

        var url = response.data.url;
        this.playAudioUrl(url);
    },

    _socketReceivePlayCard: function _socketReceivePlayCard(response) {
        // 有用户已经准备好了牌
        var userId = response.data[0].userId;
        var cardInfo = response.data[1].card;
        this._deskInfo = response.data[2].s;
        var players = response.data[2].s.players;
        this._playerInfos = players;
        this._updateUserInfos(players);
        this._playerComponents.forEach(function (player) {
            player.playCard(userId, cardInfo);
        });

        if (userId == this._userId) {
            this.cardTypeCombineNode.active = false;
        }
    },
    _getSelfReadyStatus: function _getSelfReadyStatus() {
        var self = this._findPlayerInfoByUserId(this._userId);
        return self.readyStatus;
    },
    _socketReciveReady: function _socketReciveReady(response) {
        var userId = response.data.userId;
        this._playerComponents.forEach((function (player) {
            if (!this._deskInfo.isCBegin) player.showReadyStatus(userId);
        }).bind(this));
    },

    //收到游戏结束
    _socketReceiveGameOver: function _socketReceiveGameOver(response) {
        this.timeStop();
        cc.sys.localStorage.removeItem("timestamp");

        this._hideReqestExitNode();

        // 一局游戏结束
        if (!response.result) {
            cc.error("错误：", response);
            return;
        }
        /**/
        var deskInfo = response.data;
        if (response.action == 'gameOver' && deskInfo.isDeskOver) {

            Socket.sendDidReceiveGameOverAction(this._userId);
        }
        /**/
        this._deskInfo = response.data;

        // 如果是强制解散房间，则直接显示总成绩
        if (this._isDissvledRoom() && !Playback.instance.isPlaybacking()) {
            this._showTotalGameResult(0.1);
            return;
        }

        if (Date.now() - this._enterTime < 1000 * 4) {
            // 刚进来的话，不展示比牌动画
            //  let oneGameResult = this.oneGameResult.getComponent('GameResult');
            //  oneGameResult.unscheduleAllCallbacks();
            //  oneGameResult.showResults(this._deskInfo, this._userId);
            this.isReadyStatus();
            this.btnShare.node.active = false;
            this.btnReady.node.active = true;
            this._playerComponents.forEach(function (playerComp) {
                playerComp.reset();
            });
            /**/
            this._playedCompareCardsIndexs.push(this._deskInfo.cIndex);
            /**/
            return;
        }

        var data = response.data;
        this._deskInfo = data;
        this._bigRecordInfo = data.bigRecordInfo;
        //console.log(data);
        //console.log("-----------------------------------1709");
        this._updatGameOverview(this._deskInfo);
        //let playerIndexs = data.playersIndex; // [100049]

        var players = data.players;
        this._playerInfos = players;
        this._updateUserInfos(players);
        //this._updateRecordInfo(players);

        if (UserModelHelper.isUserReady(this._findCurrentUserInfo())) {
            this._playerComponents.forEach(function (playerComp) {
                playerComp.reset();
            });
        } else {
            this._startCompareCards(response);
        }

        if (Date.now() - this._enterTime < 1000 * 4) {
            this.showCompareCard();
            return;
        }
    },
    // _updateRecordInfo:function(players){

    //     // this._bigRecordInfo.push();
    // },
    _socketReceiveDissolveDesk: function _socketReceiveDissolveDesk(response) {
        this.cardTypeCombineNode.active = false;
        cc.director.loadScene('hall');

        // this.alert.getComponent('alert').setWillDismissCallback(function(){

        //   return true;
        // });

        // let message = "房主已解散房间";
        // if (this._isRandomRoom()) {
        //   message = "有玩家已强制退出房间，游戏结束。本局游戏不会扣除您的钻石。";
        // }

        // this.showAlertMessage(message, false);
    },
    /**/
    _socketLeaveDesk: function _socketLeaveDesk(response) {
        if (!response.result) {
            return;
        }

        if (this._deskInfo.isDeskOver) {
            // 如果房间已结束，也不用再自动退回到大厅了
            return;
        }

        cc.director.loadScene('hall');
    },
    /**/
    // socket 收到有人手机进入后台消息
    _socketReceivePause: function _socketReceivePause(response) {
        if (!response.result) {
            return;
        }

        var userId = response.data.userId;
        this._playerComponents.forEach(function (player) {
            if (player.userId == userId) {
                player.setUserOnlineStatus(userId, 0);
            }
        });
    },

    _receiveSocketConnectError: function _receiveSocketConnectError(response) {
        this.showNetworkMessage();
    },

    _receiveSocketConnectSuccessed: function _receiveSocketConnectSuccessed(response) {
        this.hiddenNetworkMessage();

        if (!Playback.instance.isPlaybacking()) {
            this._loadDeskInfo();
        }
    },
    /**/
    // MARK: 更新房间信息
    updateDeskInfo: function updateDeskInfo(deskInfo) {
        this._deskInfo = deskInfo;
        this._updatGameOverview(this._deskInfo);
        this.updateRoomNumber(deskInfo.roomId);

        var playerIndexs = deskInfo.playersIndex; // [100049]
        this._injectUserIdToPlayerComponents(playerIndexs);

        var players = deskInfo.players;
        this._playerInfos = players;
        this._updateUserInfos(players);
        this._msgControl.addPlayerInfos(this._playerInfos);
        if (deskInfo.cIndex == 0 && this._deskInfo.players.length < this._deskInfo.maxNumber) {
            this.btnShare.node.active = true;
        }
    },
    /**/
    _injectUserIdToPlayerComponents: function _injectUserIdToPlayerComponents(playerIndexs) {
        var currentUserIdIndex = playerIndexs.findIndex((function (userId) {
            return userId == this._userId;
        }).bind(this));

        var fixedPlayerIndexs = playerIndexs.translationWithStartIndex(currentUserIdIndex);
        this._playerComponents.forEach(function (playerComponent, index) {
            var userId = fixedPlayerIndexs.length > index ? fixedPlayerIndexs[index] : null;
            playerComponent.userId = userId;
        });
    },

    _updateUserInfos: function _updateUserInfos(userInfos) {
        var self = this;
        this._playerComponents.forEach(function (playerComponent, index) {
            //playerComponent.setDeskInfo(self._deskInfo);
            /**/
            playerComponent.updateDeskInfo(self._deskInfo);
            /**/
            playerComponent.updateUserInfoWithUsers(userInfos);
        });

        //this._handleTheSameOfIPAdress(userInfos);
    },

    _updateUserScores: function _updateUserScores(userInfos) {
        this._playerComponents.forEach(function (player) {
            player.updateScore();
        });
    },

    _updateBanker: function _updateBanker() {
        this._playerComponents.forEach(function (player) {
            player.updateBanker();
        });
    },

    // 私有方法
    _findCardsByUserId: function _findCardsByUserId(userId) {
        var player = this._findPlayerInfoByUserId(userId);

        return player != null ? player.cards : null;
    },

    _findPlayerInfoByUserId: function _findPlayerInfoByUserId(userId) {
        var player = (this._playerInfos || []).find(function (playerInfo) {
            return userId == playerInfo.id;
        });

        return player;
    },

    _findPlayerIndexByUserId: function _findPlayerIndexByUserId(userId) {
        //let index = this._playerComponents.findIndex(function (playerComp) {
        //    return playerComp.userId == userId;
        //});
        var index = this.playerNodes.findIndex(function (node) {
            return node.getComponent('Player').userId == userId;
        });
        return index;
    },

    _findCurrentUserInfo: function _findCurrentUserInfo() {
        return this._findPlayerInfoByUserId(this._userId);
    },

    _convertCardsToCardNames: function _convertCardsToCardNames(cards) {
        // [{"suit":"s","number":10}]
        var suitColorMap = {
            s: 4,
            h: 3,
            c: 2,
            d: 1
        };
        return cards.map(function (card) {
            var cardNumber = card.number;

            // 服务器中的 14 是 A
            if (card.number == 14) {
                cardNumber = 1;
            }
            var color = suitColorMap[card.suit];
            var number = Math.max(Math.min(cardNumber, 21), 1);
            return color + "_" + number;
        });
    },

    // 更新游戏总览信息
    _updatGameOverview: function _updatGameOverview(deskInfo) {
        if (Playback.instance.isPlaybacking()) {
            this.labelOverview.string = "回放";
            return;
        }

        if (this._isRandomRoom()) {
            this.labelOverview.string = "";
            return;
        }
        var bihuase = "不比花色 ";
        var zuozhuang = "不坐庄 ";
        var putong = "普通场 ";
        var wugui = "无鬼 ";
        var maPai = '不买马 ';
        var renshu = "4人不加色 ";
        var card = "平摊";

        //[疯狂场,鬼牌,比花色,坐庄,马牌]
        if (this._deskInfo.setting3[2]) {
            bihuase = "比花色  ";
        }
        if (this._deskInfo.setting3[3]) {
            zuozhuang = "坐庄 ";
        }
        if (this._deskInfo.setting3[0]) {
            putong = "疯狂场  ";
        }
        if (this._deskInfo.setting3[1]) {
            wugui = "有鬼  ";
        }
        if (this._deskInfo.setting3[4]) {
            maPai = "买马";
            var huaSe = "方块";
            var dianShu = 1;
            switch (this._deskInfo.setting7[0]) {//setting7 [1~4,1~13] 表示 [花色，点数]
                case 1:
                    huaSe = "方块";break;
                case 2:
                    huaSe = "梅花";break;
                case 3:
                    huaSe = "红心";break;
                case 4:
                    huaSe = "黑桃";break;
            }
            switch (this._deskInfo.setting7[1]) {
                case 1:
                    dianShu = 'A';break;
                case 2:
                    dianShu = 2;break;
                case 3:
                    dianShu = 3;break;
                case 4:
                    dianShu = 4;break;
                case 5:
                    dianShu = 5;break;
                case 6:
                    dianShu = 6;break;
                case 7:
                    dianShu = 7;break;
                case 8:
                    dianShu = 8;break;
                case 9:
                    dianShu = 9;break;
                case 10:
                    dianShu = 10;break;
                case 11:
                    dianShu = 'J';break;
                case 12:
                    dianShu = 'Q';break;
                case 13:
                    dianShu = 'K';break;
            }
            maPai = huaSe + dianShu + maPai;
        }

        if (this._deskInfo.setting2 == 1) {
            renshu = "5人加一色 ";
        } else if (this._deskInfo.setting2 == 2) {
            renshu = "6人加二色 ";
        } else if (this._deskInfo.setting2 == 3) {
            renshu = "7人加三色 ";
        }
        if (this._deskInfo.setting4 == 1) {
            card = "赢者扣 ";
        } else if (this._deskInfo.setting4 == 2) {
            card = "房主扣 ";
        }

        this.labelOverview.string = "模式 : " + bihuase + zuozhuang + putong + wugui + maPai + "\n" + "其他：" + renshu + card;
        //this.labelOverview.string = "模式 : " + "" + deskInfo.maxNumber + "人" +bihuase+zuozhuang+putong+wugui+maPai;
    },

    // 是否是随机房
    _isRandomRoom: function _isRandomRoom() {
        if (this._deskInfo == null) {
            return true;
        }

        return this._deskInfo.isRandomDesk;
    },

    // 是否所有局数都用完了
    _isTotalGameOver: function _isTotalGameOver() {
        if (this._deskInfo == null) {
            return false;
        }

        if (this._deskInfo.isDeskOver) {
            return true;
        }

        return this._deskInfo.mMax <= this._deskInfo.cIndex;
    },

    // 是否已解散房间
    _isDissvledRoom: function _isDissvledRoom() {
        if (this._deskInfo) {
            return this._deskInfo.dissolveStatus;
        }

        return false;
    },

    _startCompareCards: function _startCompareCards(data) {
        this._isComparingCardsNow = true;
        this._gongXiNiShow(false);
        this._players = data.data.players;
        var user = this._findPlayerInfoByUserId(this._userId);
        if (!this.totalGameResult.active) {
            AudioManager.instance.playStartCompare(user.sex);
        }

        this.startCompareCardsNode.getComponent('alert').alert();
        this._playerComponents.forEach(function (playerComp) {
            playerComp.readyToCompareCards();
        });
        this.unscheduleAllCallbacks();
        this.scheduleOnce((function () {
            this.startCompareCardsNode.active = false;
            this._showCompareCardDetails(data);
        }).bind(this), 1.0);
    },

    _showCompareCardDetails: function _showCompareCardDetails(data) {

        this._playerComponents.forEach(function (playerComp) {
            playerComp.reset();
            playerComp.readyToCompareCards();
        });

        var cardTypeCombine = this.cardTypeCombineNode.getComponent('CardTypeCombine');

        cardTypeCombine.reset();

        cardTypeCombine.node.active = false;

        var comparePlayers1 = this._playerComponents.filter(function (player) {

            if (player.node.active) {

                var user = player.compareCardsNode.getComponent('CompareCards')._user;

                if (!user.isContainExtra) return player.node.active;
            }
        });

        var teShuPlayers = this._playerComponents.filter(function (player) {

            if (player.node.active) {

                var user = player.compareCardsNode.getComponent('CompareCards')._user;

                if (user.isContainExtra) return player.node.active;
            }
        });
        var self = this;
        var duration = this._showCompareCardStep(0, comparePlayers1);

        this.scheduleOnce(function () {
            self._showCompareCardStep(0, comparePlayers1);
        }, duration);

        this.scheduleOnce(function () {
            self._showCompareCardStep(0, comparePlayers1);
        }, duration * 2);

        if (teShuPlayers.length > 0) {
            this.scheduleOnce(function () {
                self._showCompareCardStep(0, teShuPlayers, true);
            }, duration * 3);
        }

        duration = duration * 3 + 0.5;

        for (var i = 0; i < teShuPlayers.length; i++) {

            var user = teShuPlayers[i].compareCardsNode.getComponent('CompareCards')._user;

            if (user.isContainExtra) duration = duration + 2.5;
        }

        var shootDuration = this.headCardTime;

        var shootDatas = this._shootDatas() || [];

        var shotData = this._shotData() || [];

        var homeRunUserId = this._homeRunUserId();

        var shotDataTimes = 0;

        shotData.forEach(function (data, index) {

            self.scheduleOnce(function () {

                self.playShoot(data.fromUserId, data.toUserId);
            }, duration + index * shootDuration);

            shotDataTimes += self.headCardTime;

            duration += self.headCardTime;
        });

        if (homeRunUserId.length >= 1) {

            shootDatas.forEach(function (data, index) {

                self.scheduleOnce(function () {

                    self.playShoot(data.fromUserId, data.toUserId);
                }, duration + (index + shotDataTimes) * shootDuration);

                duration += self.headCardTime;
            });
        }

        duration = duration + shootDatas.length * shootDuration + shotData.length * shootDuration;

        if (homeRunUserId > 0) {

            self.scheduleOnce(function () {
                self.playHomeRun(homeRunUserId);
            }, duration);

            duration = duration + 1;
        }

        if (homeRunUserId) {
            duration = duration + 1;
        }

        //this.scheduleOnce(function () {this._jinBiAction();}.bind(this), duration);//显示结算金币//显示结果
        this._jinBiAction(duration);
        //this.scheduleOnce(function () {
        //
        //    this._playerComponents.forEach(function (playerComp) {playerComp.showScoreResult();});
        //
        //    self._showCompareCardFinished();
        //
        //}.bind(this), duration);
    },

    _jinBiAction: function _jinBiAction(duration) {
        var comparePlayers1 = this._playerComponents.filter(function (player) {
            return player.node.active;
        });

        var nextTime = 0; //下一个动作开始的时间

        var zTime = 0; //下下一个动作开始的时间

        var start = 0;

        var end = 0;

        var coinsContainerAyy = []; //所有的用户的金币 一个用户一个数组

        var coinsAyy = []; //所有的金币，一个数组

        this.playsCoins.forEach(function (no) {
            if (no) no.removeAllChildren();
        });

        comparePlayers1.forEach((function (plays, index) {
            //根据积分创建金币

            var cScore = plays.compareCardsNode.getComponent('CompareCards')._user.cScore;

            if (cScore < 0) {

                cScore *= -1;

                var node = new cc.Node();

                node.name = "coinsContainer";

                var numScore = cScore > 30 ? 30 : cScore;
                for (var i = 0; i < numScore; i++) {
                    this._createJinBiPrefab(node, node); //根据积分创建金币
                }

                this.playsCoins[index].addChild(node);

                coinsContainerAyy.push(node.children);
            }
        }).bind(this));

        this.playsCoins.forEach(function (no) {
            if (no) no.active = false;
        });

        this.scheduleOnce((function () {
            //显示结果

            this.playsCoins.forEach(function (no) {
                if (no) no.active = true;
            });

            AudioManager.instance.coinIncome();

            coinsContainerAyy.forEach((function (coinsAyys) {
                //把金币移动到容器

                var initTime = 0;

                var interval = 0.002;

                coinsAyys.forEach((function (coins) {
                    //把金币移动到容器

                    var y = Math.round(Math.random()) == 0 ? -1 : 1;

                    y = Math.floor(Math.random() * 38) * y;

                    var x = Math.round(Math.random()) == 0 ? -1 : 1;

                    x = Math.floor(Math.random() * 38) * x;

                    var cardBackWorldSpace1 = this.node.convertToWorldSpaceAR(cc.v2(x, y));

                    var v2 = coins.convertToNodeSpaceAR(cardBackWorldSpace1);

                    this.scheduleOnce(function () {

                        coins.runAction(cc.moveBy(0.2, v2));
                    }, initTime);

                    initTime = initTime + interval;
                }).bind(this));

                nextTime = initTime;

                coinsAyy = coinsAyy.concat(coinsAyys); //把金币集合到一个数组
            }).bind(this));

            var zcScore = 0;

            comparePlayers1.forEach((function (plays) {
                //计算金币

                var cScore = plays.compareCardsNode.getComponent('CompareCards')._user.cScore;

                cScore = cScore > 30 ? 30 : cScore;

                if (cScore > 0) zcScore += cScore * 1;
            }).bind(this));

            var coinsAyy1 = coinsAyy.splice(zcScore, coinsAyy.length);

            coinsAyy1.forEach(function (node) {
                node.parent.removeChild(node);
            });

            comparePlayers1.forEach((function (plays) {
                //把金币到用户头像附近

                var cScore = plays.compareCardsNode.getComponent('CompareCards')._user.cScore;

                if (cScore > 0) {

                    var interval = 0.0025;

                    var initTime = nextTime + 1;

                    var numScore = cScore > 30 ? 30 : cScore;

                    //end += numScore;

                    coinsAyy.splice(0, numScore).forEach((function (coinsNode) {
                        //把金币到用户头像附近

                        this.scheduleOnce(function () {

                            //获取节点的世界坐标
                            var cardBackWorldSpace1 = plays.node.convertToWorldSpaceAR(cc.v2(0, 0));
                            //获取相对父节点所在的坐标
                            var detail = coinsNode.convertToNodeSpaceAR(cardBackWorldSpace1);

                            var moveBy = cc.moveBy(0.25, detail);

                            var nextFadeIn = cc.fadeOut(0.13);

                            var moveSeq = cc.sequence(moveBy, nextFadeIn);

                            coinsNode.runAction(moveSeq);
                        }, initTime);

                        initTime = initTime + interval;
                    }).bind(this));

                    //start += cScore;

                    zTime = initTime;
                }
            }).bind(this));

            this.scheduleOnce((function () {
                //显示结果

                //this.playsCoins.forEach(function(no){if(no) no.active = false;});

                this._showCompareCardFinished();

                comparePlayers1.forEach(function (playerComp) {
                    playerComp.showScoreResult();
                });
            }).bind(this), zTime);

            this.scheduleOnce((function () {
                //显示结果

                this.playsCoins.forEach(function (no) {
                    if (no) no.removeAllChildren();
                });
            }).bind(this), zTime + 5);
        }).bind(this), duration);
    },

    _createJinBiPrefab: function _createJinBiPrefab(node, v2Node) {

        var nodes = cc.instantiate(this.coinsPrefab);

        var y = Math.round(Math.random()) == 0 ? -1 : 1;

        y = Math.floor(Math.random() * 38) * y + v2Node.y;

        var x = Math.round(Math.random()) == 0 ? -1 : 1;

        x = Math.floor(Math.random() * 38) * x + v2Node.x;

        nodes.x = x;

        nodes.y = y;

        node.addChild(nodes);
    },

    _showCompareCardStep: function _showCompareCardStep() {
        var startTime = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
        var comparePlayers = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
        var isContainExtra = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

        var duration = startTime;
        var interval = this.headCardTime;
        var teshuTime = 0;
        var self = this;

        comparePlayers = comparePlayers.sort(function (player1, player2) {
            return player1.nextCompareScore() - player2.nextCompareScore();
        });

        var co = comparePlayers;
        //console.log(co)
        //console.log('-------------执行了几次')

        co.forEach(function (player) {

            self.scheduleOnce(function () {
                player.showNextCompareCards();
            }, duration + teshuTime);

            duration = duration + interval;
            var user = player.compareCardsNode.getComponent('CompareCards')._user;
            if (user.isContainExtra) {
                if (user.cardInfo[0].type == 10) {

                    self.scheduleOnce(function () {
                        this.node.getComponent("animation")._santonghuaAnimation();
                    }, duration - 1 + teshuTime);

                    teshuTime += 2.5;
                } else if (user.cardInfo[0].type == 11) {

                    self.scheduleOnce(function () {
                        this.node.getComponent("animation")._sanshunziAnimation();
                    }, duration - 1 + teshuTime);

                    teshuTime += 2.5;
                } else if (user.cardInfo[0].type == 12) {

                    self.scheduleOnce(function () {
                        this.node.getComponent("animation")._liuduibanAnimation();
                    }, duration - 1 + teshuTime);

                    teshuTime += 2.5;
                } else if (user.cardInfo[0].type == 18) {

                    self.scheduleOnce(function () {
                        this.node.getComponent("animation")._qinglongAniamtion('long');
                    }, duration - 1 + teshuTime);

                    teshuTime += 2.5;
                } else if (user.cardInfo[0].type == 19) {

                    self.scheduleOnce(function () {
                        this.node.getComponent("animation")._qinglongAniamtion("ql");
                    }, duration - 1 + teshuTime);

                    teshuTime += 2.5;
                }
            }
        });

        if (isContainExtra) {

            for (var i = 0; i < co.length; i++) duration = duration + 2.5;

            this._playerComponents.forEach(function (player) {
                if (player.node.active) {
                    self.scheduleOnce(function () {
                        player.showNextCompareScore(isContainExtra);
                    }, duration - interval);
                }
            });
        } else {
            co.forEach(function (player) {
                self.scheduleOnce(function () {
                    player.showNextCompareScore();
                }, duration - interval);
            });
        }

        return duration + teshuTime;
    },

    _isGameOver: function _isGameOver() {},

    // 比牌完成后会调用的方法
    _showCompareCardFinished: function _showCompareCardFinished() {
        this.timeStart(5, "ready");
        this._showOneGameResult();
        /**/
        this._playedCompareCardsIndexs.push(this._deskInfo.cIndex);
        /**/
    },

    //network
    showNetworkMessage: function showNetworkMessage() {
        var msg = arguments.length <= 0 || arguments[0] === undefined ? "网络链接断开，重新连接中..." : arguments[0];

        if (this.networkNode && this.networkNode.active) {
            return;
        }

        if (this.networkNode != null) {
            var removeSelfAction = cc.removeSelf();
            this.networkNode.runAction(removeSelfAction);
            this.networkNode = null;
        }
        this.networkNode = cc.instantiate(this.waitingPrefab);
        this.node.addChild(this.networkNode);
        var comp = this.networkNode.getComponent('alert');
        var self = this;
        comp.onDismissComplete = function () {
            self.networkNode = null;
        };
        comp.setMessage(msg);
        comp.alert();
    },

    hiddenNetworkMessage: function hiddenNetworkMessage() {
        if (this.networkNode != null) {
            this.networkNode.getComponent('alert').dismissAction();
        }
    },

    showAlertMessage: function showAlertMessage(msg, autoDismiss) {
        var alertComp = this.alert.getComponent('alert');
        if (!this.alert.active) {
            alertComp.alert();
        }

        alertComp.setMessage(msg);
        alertComp.unscheduleAllCallbacks();
        if (autoDismiss) {
            alertComp.scheduleOnce(function () {
                alertComp.dismissAction();
            }, 5);
        }
    },

    //checkNode
    showCheckMessage: function showCheckMessage() {
        var msg = arguments.length <= 0 || arguments[0] === undefined ? '检查网络中...' : arguments[0];

        if (this.checkNode != null) {
            var removeSelfAction = cc.removeSelf();
            this.checkNode.runAction(removeSelfAction);
            this.checkNode = null;
        }
        this.checkNode = cc.instantiate(this.waitingPrefab);
        this.node.addChild(this.checkNode);
        var comp = this.checkNode.getComponent('alert');
        var self = this;
        comp.onDismissComplete = function () {
            self.checkNode = null;
        };
        comp.setMessage(msg);
        comp.alert();
    },

    hiddenCheckMessage: function hiddenCheckMessage() {
        if (this.checkNode != null && this.checkNode.active) {
            this.checkNode.getComponent('alert').dismissAction();
        }
    },

    /////  聊天语音逻辑
    // _registerVoiceNodeEvents: function () {
    //     let self = this;
    //     let chatVoiceNode = this.btnChatVoice.node;
    //     this.endRecordTime = Date.now();
    //     chatVoiceNode.on(cc.Node.EventType.TOUCH_START,function(event) {
    //         if (Date.now() - self.endRecordTime >= 1000) {
    //             self.nativeRecordAction();
    //             //self.voiceRecordAnimationNode.active = true;

    //             let action = cc.scaleTo(0.12, 1.2);
    //             self.btnChatVoice.node.runAction(action);

    //             self._isRecording = true;
    //         }
    //     });
    //     chatVoiceNode.on(cc.Node.EventType.TOUCH_END,function(event) {
    //         if (self._isRecording) {
    //             self.endRecordTime = Date.now();
    //         }
    //         self._isRecording = false;

    //         self.nativeEndRecordAction();
    //         //self.voiceRecordAnimationNode.active = false;

    //         let action = cc.scaleTo(0.12, 1);
    //         self.btnChatVoice.node.runAction(action);
    //     });
    //     chatVoiceNode.on(cc.Node.EventType.TOUCH_CANCEL,function(event) {
    //         if (self._isRecording) {
    //             self.endRecordTime = Date.now();
    //         }
    //         self._isRecording = false;

    //         self.nativeEndRecordAction();
    //         //self.voiceRecordAnimationNode.active = false;

    //         let action = cc.scaleTo(0.12, 1);
    //         self.btnChatVoice.node.runAction(action);
    //     });
    //     Socket.instance.uploadFinish = function(url) {
    //         let userId = self._userId;
    //         Socket.sendAudioMessage(userId, url);
    //         self.playSpeakAnimation(self._userId);
    //     };
    // },

    _registerVoiceNodeEvents: function _registerVoiceNodeEvents() {
        var self = this;
        var chatVoiceNode = this.btnChatVoice.node;
        this.endRecordTime = Date.now();
        chatVoiceNode.on(cc.Node.EventType.TOUCH_START, function (event) {
            // self.VoiceMsgBgAnimation();
            if (!cc.sys.isNative) {
                var runTime = 0.3;
                var tishi = cc.instantiate(self.autoTishi);
                self.node.addChild(tishi);
                var action = cc.spawn(cc.moveTo(0.3, cc.v2(0, 0)), cc.fadeIn(0.3));
                tishi.runAction(action);
                self.scheduleOnce((function () {
                    var finished = cc.callFunc(function () {
                        tishi.removeFromParent(true);
                    });
                    var action = cc.sequence(cc.spawn(cc.fadeOut(runTime), cc.moveTo(runTime, cc.v2(0, 50))), finished);
                    tishi.runAction(action);
                }).bind(this), 1.5);
                //var url = "www.baidu.com";
                //let userId = self._userId;
                //Socket.sendAudioMessage(userId, url);
            } else {
                    if (Date.now() - self.endRecordTime >= 1000) {
                        self.VoiceMsgBgAnimation();
                        self.nativeRecordAction();
                        var _action = cc.scaleTo(0.12, 1.2);
                        self.btnChatVoice.node.runAction(_action);
                        self._isRecording = true;
                    }
                }
        });
        chatVoiceNode.on(cc.Node.EventType.TOUCH_END, function (event) {
            self.VoiceMsgBg.active = false;
            if (self._isRecording) {
                self.endRecordTime = Date.now();
            }
            self._isRecording = false;

            self.nativeEndRecordAction();
            //self.voiceRecordAnimationNode.active = false;

            var action = cc.scaleTo(0.12, 1);
            self.btnChatVoice.node.runAction(action);
        });
        chatVoiceNode.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            self.VoiceMsgBg.active = false;
            if (self._isRecording) {
                self.endRecordTime = Date.now();
            }
            self._isRecording = false;

            self.nativeEndRecordAction();
            //self.voiceRecordAnimationNode.active = false;

            var action = cc.scaleTo(0.12, 1);
            self.btnChatVoice.node.runAction(action);
        });
        Socket.instance.uploadFinish = function (url) {
            var userId = self._userId;
            Socket.sendAudioMessage(userId, url);
            self.playSpeakAnimation(self._userId);
        };
    },
    VoiceMsgBgAnimation: function VoiceMsgBgAnimation() {
        this.VoiceMsgBg.active = true;
        var whileLayout = this.VoiceMsgBg.getChildByName("whileLayout");
        var childWhile = whileLayout.getChildByName("childWhile");
        if (this.whileLayoutInterval) {
            clearInterval(this.whileLayoutInterval);
        }

        this.whileLayoutInterval = setInterval(function () {
            var node = cc.instantiate(childWhile);
            if (whileLayout.children.length > 5) {
                whileLayout.removeAllChildren();
            }
            whileLayout.addChild(node);
        }, 200);

        var layout = this.VoiceMsgBg.getChildByName("layout");
        var cWhile = layout.getChildByName("while");

        if (this.layoutInterval) {
            clearInterval(this.layoutInterval);
        }

        this.layoutInterval = setInterval(function () {
            var node = cc.instantiate(cWhile);
            if (layout.children.length > 3) {
                layout.removeAllChildren();
            }
            layout.addChild(node);
        }, 300);
    },
    nativeRecordAction: function nativeRecordAction() {
        if (KQNativeInvoke.isNativeIOS()) {
            jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "record");
        } else if (KQNativeInvoke.isNativeAndroid()) {
            //Android com.lling.qianjianglzg
            jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "record", "()V");
            AudioManager.instance.pauseMusic();
        }
    },

    nativeEndRecordAction: function nativeEndRecordAction() {
        if (KQNativeInvoke.isNativeIOS()) {
            jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "endRecord");
        } else if (KQNativeInvoke.isNativeAndroid()) {
            //Android
            jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "endRecord", "()V");
            AudioManager.instance.resumeMusic();
        }
    },

    playAudioUrl: function playAudioUrl(url) {
        //console.log("---------------------------2553");
        if (KQNativeInvoke.isNativeIOS()) {
            jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "playUrl:", url);
        } else if (KQNativeInvoke.isNativeAndroid()) {
            //Android
            jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "playUrl", "(Ljava/lang/String;)V", url);
        }
    },

    // MARK:  退出游戏逻辑
    _handleUpdateDeskInfoAboutExitRoom: function _handleUpdateDeskInfoAboutExitRoom(deskInfo) {
        if (!deskInfo.isDissolving) {
            return;
        }
        var dataInfos = deskInfo.dissolveAnswerInfo;

        var alertComp = this.alertAnsowerExitNode.getComponent('alert');

        alertComp.alert();

        alertComp.unscheduleAllCallbacks();

        this.contentAnsowerExitNode.children.forEach(function (i) {
            i.active = false;
        });

        this._playerInfos.forEach((function (playerInfo, index) {

            var play = this.contentAnsowerExitNode.children[index];

            var name = play.getChildByName("nickname");

            var back = play.getChildByName("fanzhu");

            var img = play.getChildByName("avatar_bg");

            var str = play.getChildByName("id");

            var dataInfo = dataInfos[index];

            play.active = true;

            name.getComponent(cc.Label).string = playerInfo.nickname;

            if (this._deskInfo.createId == playerInfo.id) {
                //显示房主

                back.active = true;
            } else {

                back.active = false;
            }

            cc.loader.load({ url: playerInfo.avatarUrl, type: "jpg" }, (function (err, data) {

                if (err) return;

                var frame = new cc.SpriteFrame(data);

                img.getComponent(cc.Sprite).spriteFrame = frame;
            }).bind(this));

            if (dataInfo == 1) {

                str.getComponent(cc.Label).string = "同意";
            } else {

                str.getComponent(cc.Label).string = "";
            }
        }).bind(this));

        var dissolveLeftTime = deskInfo.dissolveLeftTime || 60;

        var countdown = this.alertAnsowerExitCountdownNode.getComponent('Countdown');

        countdown.startCountdown(dissolveLeftTime, (function (isTimeout) {

            if (isTimeout) {
                this.clickAgreeOtherPlayerExit();
                return;
            }
        }).bind(this));

        var dissolveUserId = deskInfo.dissolveUserId;

        if (dissolveUserId == this._userId) {

            var alert_bg = this.alertAnsowerExitNode.getChildByName("alert_bg");

            var btnAgree = alert_bg.getChildByName("btnAgree");

            var btnDisagree = alert_bg.getChildByName("btnDisagree");

            btnAgree.active = false;

            btnDisagree.active = false;
            //this.alertRequestExitNode.active = true;
            //this.btnAlertRequestExitCancelButton.node.active = false;
            //this.btnAlertRequestExitConfirmButton.node.active = false;
            //let alert = this.alertRequestExitNode.getComponent('alert');
            //alert.setMessage("您正在申请协商退出，等待其他玩家同意");
            //this.alertRequestExitCountdownNode.getComponent('Countdown').startCountdown(dissolveLeftTime);
            return;
        }

        //let dissolveAnswerInfos = deskInfo.dissolveAnswerInfo;
        //let currentUserIdIndex = deskInfo.playersIndex.findIndex(function(userId) {
        //    return this._userId == userId;
        //}.bind(this));
        //
        //let answerResult = dissolveAnswerInfos[currentUserIdIndex];
        //
        //if (answerResult == -1) {
        //    // -1 表示未处理  0 表示拒绝  1表示同意
        //    this.alertAnsowerExitNode.active = true;
        //
        //    let countdown = this.alertAnsowerExitCountdownNode.getComponent('Countdown');
        //
        //    countdown.startCountdown(dissolveLeftTime, function(isTimeout) {
        //        if (isTimeout) {
        //            this.clickAgreeOtherPlayerExit();
        //        }
        //    }.bind(this));
        //
        //}
    },

    // 确定要强制退出游戏
    clickConfirmForceExit: function clickConfirmForceExit() {
        Socket.sendForceExitRoom(this._userId);
        cc.director.loadScene('hall');
    },

    // 确认请求退出游戏
    clickConfirmRequestExit: function clickConfirmRequestExit() {
        this.btnAlertRequestExitCancelButton.node.active = false;
        this.btnAlertRequestExitConfirmButton.node.active = false;
        var alert = this.alertRequestExitNode.getComponent('alert');
        if (this._deskInfo.cIndex > 0) {
            alert.setMessage("您正在申请协商退出，等待其他玩家同意");
            this.alertRequestExitCountdownNode.getComponent('Countdown').startCountdown(60);
        }
        Socket.sendLeaveDesk(this._userId);
    },

    // 同意他人退出
    clickAgreeOtherPlayerExit: function clickAgreeOtherPlayerExit() {
        //this.alertAnsowerExitNode.getComponent('alert').dismissAction();
        //this.alertAnsowerExitNode.getComponent('alert').unscheduleAllCallbacks();
        //this.alertAnsowerExitCountdownNode.getComponent('Countdown').stop();
        var alert_bg = this.alertAnsowerExitNode.getChildByName("alert_bg");
        var btnAgree = alert_bg.getChildByName("btnAgree");
        var btnDisagree = alert_bg.getChildByName("btnDisagree");
        btnAgree.active = false;
        btnDisagree.active = false;
        Socket.sendAnswerDissolve(this._userId, 1);
    },

    // 不同意他人退出
    clickDisagreeOtherPlayerExit: function clickDisagreeOtherPlayerExit() {
        //this.alertAnsowerExitNode.getComponent('alert').dismissAction();
        //this.alertAnsowerExitNode.getComponent('alert').unscheduleAllCallbacks();
        //this.alertAnsowerExitCountdownNode.getComponent('Countdown').stop();
        var alert_bg = this.alertAnsowerExitNode.getChildByName("alert_bg");
        var btnAgree = alert_bg.getChildByName("btnAgree");
        var btnDisagree = alert_bg.getChildByName("btnDisagree");
        btnAgree.active = false;
        btnDisagree.active = false;
        Socket.sendAnswerDissolve(this._userId, 0);
    },

    // 隐藏请求退出 Node
    _hideReqestExitNode: function _hideReqestExitNode() {
        if (!this.alertRequestExitNode.active) {
            return;
        }

        this.alertRequestExitNode.active = false;
        this.alertRequestExitCountdownNode.getComponent('Countdown').stop();
    },

    //// 打枪
    playShoot: function playShoot(fromUserId, toUserId) {
        var user = this._findPlayerInfoByUserId(fromUserId);
        if (user) {
            AudioManager.instance.playHumanDaQiang(user.sex);
        }

        var toUserIndex = this._findPlayerIndexByUserId(toUserId);

        this._playerComponents.forEach((function (player) {
            if (this._userId == fromUserId || this._userId == toUserId) player.showNextCompareScore();
            player.playShootAnimation(fromUserId, toUserIndex);
            player.playBulletHoleAnimation(toUserId);
        }).bind(this));
    },

    // 播放全垒打动效
    playHomeRun: function playHomeRun(userId) {
        var user = this._findPlayerInfoByUserId(userId);
        if (user) {
            AudioManager.instance.playHomeRun(user.sex);
        }
        this.node.getComponent("animation")._quanleidaAnimation('long');

        this._playerComponents.forEach((function (player) {

            player.showNextCompareScore();
        }).bind(this));
    },

    playSpeakAnimation: function playSpeakAnimation(userId) {
        this._playerComponents.forEach(function (player) {
            player.playSpeakAnimation(userId);
        });
    },

    _shootDatas: function _shootDatas() {
        var homeRunUserId = this._homeRunUserId(); // 全垒打
        var shootDatas = this._deskInfo.shotData.filter(function (data) {
            return data.fromUserId == homeRunUserId;
        });
        return shootDatas;
    },

    _shotData: function _shotData() {
        var homeRunUserId = this._homeRunUserId(); // 打枪
        var shotData = this._deskInfo.shotData.filter(function (data) {
            return data.fromUserId != homeRunUserId;
        });
        return shotData;
    },

    _homeRunUserId: function _homeRunUserId() {
        return this._deskInfo.allShotData;
    },

    // MARK: 房间信息部分

    // 获取房间的玩法
    _deskInfoGameWay: function _deskInfoGameWay() {
        var setting = this._deskInfo.setting3;
        if (setting == null) {
            setting = 2;
        }
        var names = ["庄家模式", "无特殊牌", "普通模式"];
        return names[setting];
    },

    _deskInfoNumberOfGame: function _deskInfoNumberOfGame() {
        var setting = this._deskInfo.setting1;
        var infos = ['10局', '20局', '40局', '5局'];
        /*if (setting <= 1) {
         return '条数：' + infos[setting];
         }*/
        if (setting == 2) {
            setting = 0;
        } else if (setting == 3) {
            setting = 1;
        } else if (setting == 4) {
            setting = 2;
        } else if (setting == 5) {
            setting = 3;
        }
        return '局数：' + infos[setting];
    },

    _deskInfoNumberOfPeople: function _deskInfoNumberOfPeople() {
        var setting = this._deskInfo.setting2;
        var infos = ['2人', '3人', '4人', '5人'];
        return infos[setting];
    },

    _deskInfoPayInfo: function _deskInfoPayInfo() {
        var setting = this._deskInfo.setting4;
        if (setting == null) {
            setting = 0;
        }
        if (setting == 0) {
            setting = 1;
        }
        var infos = ['房主霸主庄', '房费AA'];
        return infos[setting];
    },

    _deskInfoJiaYiSeInfo: function _deskInfoJiaYiSeInfo() {
        var setting = this._deskInfo.setting7 == 0 ? 1 : 0;
        var infos = ['无多一色', '多一色'];
        return infos[setting];
    },

    _deskInfoGuiPaiInfo: function _deskInfoGuiPaiInfo() {
        var setting = undefined;
        if (this._deskInfo.setting8 == null) {
            setting = 0;
        } else if (this._deskInfo.setting8 == 0) {
            setting = 1;
        } else if (this._deskInfo.setting8 == 1) {
            setting = 2;
        }
        var infos = ['无王牌', '两张王牌', '四张王牌'];
        return infos[setting];
    },

    // MARK: 剩余时间
    _remainTimeStartUpdate: function _remainTimeStartUpdate() {
        //this.schedule(this._remainTimeUpdate, 1.0, cc.macro.REPEAT_FOREVER);
    },

    _remainTimeUpdate: function _remainTimeUpdate() {
        if (this._isRandomRoom() || Playback.instance.isPlaybacking()) {
            this.labelRemainTime.string = "";
            this.labelRemainTime.node.active = false;
            return;
        }

        if (this._deskInfo == null) {
            this.labelRemainTime.string = "";
            this.labelRemainTime.node.active = false;
            return;
        }

        var isTaoShu = this._deskInfo.setting1 == 0 || this._deskInfo.setting1 == 1;
        if (isTaoShu) {
            this.labelRemainTime.node.active = false;
            return;
        }

        if (!this._deskInfo.createTime) {
            return;
        }

        this.labelRemainTime.node.active = true;
        var createTime = fecha.parse(this._deskInfo.createTime, 'YYYY-MM-DD HH:mm:ss').getTime();
        var oneHour = 60 * 60;
        var remain = (Date.now() - createTime) / 1000;
        remain = Math.max(oneHour - remain, 0);

        var mins = Math.floor(remain / 60);
        var secs = Math.floor(remain % 60);
        if (mins == 0 && secs == 0) {
            this.labelRemainTime.string = "";
            return;
        }

        var minsString = "" + mins;
        if (minsString.length < 2) {
            minsString = "0" + minsString;
        }

        var secsString = "" + secs;
        if (secsString.length < 2) {
            secsString = "0" + secsString;
        }

        var string = "剩余时间：00:" + minsString + ":" + secsString;
        this.labelRemainTime.string = string;
    },

    // MARK: 处理同 IP 的用户
    _handleTheSameOfIPAdress: function _handleTheSameOfIPAdress(userInfos) {
        if (!userInfos || userInfos.length == 0) {
            return;
        }

        var ipUserInfos = userInfos.reduce(function (ips, userInfo) {
            var users = ips[userInfo.ipAddress] || [];
            users.push(userInfo);

            ips[userInfo.ipAddress] = users;
            return ips;
        }, {});

        var sameIpUsers = null;
        for (var ip in ipUserInfos) {
            var users = ipUserInfos[ip];
            if (users.length > 1) {
                sameIpUsers = users;
                break;
            }
        }

        if (sameIpUsers == null) {
            return;
        }

        this._alertSameIpUserInfos(sameIpUsers);
    },

    _alertSameIpUserInfos: function _alertSameIpUserInfos(users) {
        var message = "";
        var userIds = "";
        users.forEach(function (user, index) {
            message = message + (index > 0 ? ' 和 ' : '') + user.nickname;
            userIds = userIds + user.id;
        });
        message = message + ' 在同一 IP 下！';

        this._didAlertSameIpMessage = this._didAlertSameIpMessage || {};
        if (this._didAlertSameIpMessage[userIds]) {
            return;
        }

        this.showAlertMessage(message, true);
        this._didAlertSameIpMessage[userIds] = true;
    }

});
Play.gongXiNiShow = function (type) {
    this.instances._gongXiNiShow(type);
};
module.exports = Play;

cc._RFpop();
},{"ArrayExtension":"ArrayExtension","AudioManager":"AudioManager","KQCard":"KQCard","KQGlobalEvent":"KQGlobalEvent","KQNativeInvoke":"KQNativeInvoke","Playback":"Playback","Player":"Player","UserModelHelper":"UserModelHelper","fecha":"fecha","manager":"manager","socket":"socket"}],"product":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'a9ad2cC2BdEiaFSqV4XCWQV', 'product');
// scripts\product.js

cc.Class({
    'extends': cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        productId: ''
    },

    // use this for initialization
    onLoad: function onLoad() {},

    clickAction: function clickAction() {
        this.onClickAction(this.productId);
    },

    onClickAction: function onClickAction(productId) {}

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"randRoom":[function(require,module,exports){
"use strict";
cc._RFpush(module, '4d298BlaelCHqiV5dTDjhuY', 'randRoom');
// scripts\randRoom.js

var Socket = require('socket');
var KQGlobalEvent = require('KQGlobalEvent');

cc.Class({
    'extends': cc.Component,

    properties: {
        matchingLabel: cc.Label,
        timeNode: cc.Node,
        matchingNode: cc.Node,
        waitingPrefab: cc.Prefab,
        alertPrefab: cc.Prefab,

        tishi: cc.Node,

        _userId: null,
        _response: null
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._userId = Socket.instance.userInfo.id;
        cc.isRoomViewShow = true;
        KQGlobalEvent.on(Socket.Event.ReceiveDeskInfo, this._socketReceiveDeskInfo, this);
        KQGlobalEvent.on(Socket.Event.SocketDisconnect, this._socketDisconnect, this);
        KQGlobalEvent.on(Socket.Event.SocketConnectSuccessed, this._socketConnected, this);
        KQGlobalEvent.on(Socket.Event.ReceiveInterRandom, this._socketReceiveInterRandom, this);
    },

    _socketReceiveDeskInfo: function _socketReceiveDeskInfo(response) {
        if (!response.result) {
            return;
        }

        cc.director.loadScene('play');
    },

    _socketReceiveInterRandom: function _socketReceiveInterRandom(response) {
        //服务器发送  {'action':'interRandom','result':false,'data':{'reason':reason}}
        this._response = response;
        this.unschedule(this._timeoutRandomAction);
        // 处理随机场匹配不成功的情况
        if (response.result) {
            return;
        }

        var reason = response.data.reason || "加入随机场失败";
        this.showAlertMessage(reason);

        if (reason == '你已经在匹配队列') {
            this._showMatching();
        } else {
            this._hideMatching();
        }
    },

    _socketDisconnect: function _socketDisconnect() {
        // 连接已断开
        this.matchingNode.active = false;
        this.showNetworkMessage('网络链接断开，重新连接中...');
    },

    _socketConnected: function _socketConnected() {
        this.hiddenNetworkMessage();
    },

    onDestroy: function onDestroy() {
        KQGlobalEvent.offTarget(this);
    },

    clickExit: function clickExit() {
        cc.director.loadScene('hall');
    },

    clickStart: function clickStart() {
        Socket.sendEnterRandom(this._userId);
        this._showMatching();

        /*#####begin*/
        //reason是服务器发送回来的
        /*if(this._response.data.reason == "你的钻石不足"){
            this.tishi.active = true;
        }*/
        /*#####end*/

        this.scheduleOnce(this._timeoutRandomAction, 5);
    },
    /*#####点击空白地方，砖石不足提示消失*/
    /*onBtnKong:function () {
        if(this.tishi.active){
            this.tishi.active = false;
        }else{
            //什么也不做
        }
    },*/
    /*取消匹配*/
    clickCancel: function clickCancel() {
        Socket.sendCancelRandom(this._userId);

        this._hideMatching();
    },

    _timeoutRandomAction: function _timeoutRandomAction() {
        this._hideMatching();
        this.showAlertMessage('进入匹配失败');
    },

    _showMatching: function _showMatching() {
        var comp = this.matchingNode.getComponent('alert');
        comp.alert();
        this.matchingLabel.string = '正在匹配中，请稍后...';
        var num = 0;
        this.schedule(function () {
            num = num + 0.5;
            this.timeNode.rotation = num;
        }, 0.01);
    },

    _hideMatching: function _hideMatching() {
        var comp = this.matchingNode.getComponent('alert');
        comp.dismissAction();
    },

    showNetworkMessage: function showNetworkMessage(msg) {
        this.unschedule(this._timeoutRandomAction);

        if (this.networkNode != null) {
            var removeSelfAction = cc.removeSelf();
            this.networkNode.runAction(removeSelfAction);
            this.networkNode = null;
        }
        this.networkNode = cc.instantiate(this.waitingPrefab);
        this.node.addChild(this.networkNode);
        var comp = this.networkNode.getComponent('alert');
        var self = this;
        comp.onDismissComplete = function () {
            self.networkNode = null;
        };
        comp.setMessage(msg);
        comp.alert();
    },

    hiddenNetworkMessage: function hiddenNetworkMessage() {
        if (this.networkNode != null) {
            this.networkNode.getComponent('alert').dismissAction();
        }
    },

    showAlertMessage: function showAlertMessage(msg) {
        if (!msg) {
            cc.error("不能显示为空的信息");
            return;
        }

        if (!this.alertMessageNode) {
            this.alertMessageNode = cc.instantiate(this.alertPrefab);
            this.node.addChild(this.alertMessageNode);
        }

        this.alertMessageNode.getComponent('alert').setMessage(msg);
        this.alertMessageNode.getComponent('alert').alert();
    }
});

cc._RFpop();
},{"KQGlobalEvent":"KQGlobalEvent","socket":"socket"}],"recordInfo":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e1457gdvd5I5aENjKvCTkCd', 'recordInfo');
// scripts\recordInfo.js

var Socket = require('socket');
var Playback = require('Playback');
var record = require('record');

cc.Class({
    'extends': cc.Component,

    properties: {
        timeLabel: cc.Label, // 时间
        jushuLabel: cc.Label, // 局数
        createUser: cc.Node, // 房主
        roomId: cc.Label, // 房间号
        jifen: cc.Label, // 积分
        id: cc.Label,
        avatarNode: cc.Node, // 头像
        creatorImg: cc.Node, // 创房头像
        nicknameLabels: cc.Label,
        scoreLabels: [cc.Label],
        //numNode:cc.Label,
        _parentId: null,
        //playbackNode:cc.Node,//回放按钮
        //watchNode:cc.Node,//查看按钮
        reordInfo: cc.Node,
        _recordItemInfo: null,
        totalGameResult: cc.Node

    },

    // use this for initialization
    onLoad: function onLoad() {
        this.totalGameResult = cc.find("Canvas/recordInfo");
    },

    setInfo: function setInfo(recordInfo) {
        this._parentId = recordInfo.id;
        //this.watchNode.active = true;
        //this.playbackNode.active = false;
        if (recordInfo.playersInfo.length == 0) {
            return;
        }

        var playersInfo = JSON.parse(recordInfo.playersInfo);
        recordInfo.scores = JSON.parse(recordInfo.scores);

        var fen = recordInfo.scores[this.fen(recordInfo.userid, playersInfo.playersIndex)];
        //cc.log(fen)
        //cc.log(recordInfo.scores)
        //cc.log(this.fen(recordInfo.userid,playersInfo.playersIndex))
        //cc.log(recordInfo.userid)
        //cc.log(playersInfo.playersIndex)
        //cc.log(recordInfo)
        //cc.log(playersInfo)
        //cc.log('----47')
        this.jifen.string = fen >= 0 ? "+" + fen : fen;

        var headUrl = playersInfo.players[this.creator(recordInfo.createUserId, playersInfo.playersIndex)].avatarUrl; // 头像URL
        var sprite = this.avatarNode.getComponent(cc.Sprite);
        cc.loader.load({ url: headUrl, type: "jpg" }, function (err, tex) {
            if (!err) {
                var frame = new cc.SpriteFrame(tex);
                sprite.spriteFrame = frame;
            }
        });

        this.roomId.string = "房号：" + playersInfo.roomId;
        this.timeLabel.string = "时间：" + playersInfo.time.substr(5, 11);
        this.jushuLabel.string = "局数：" + this.js(playersInfo.setting1 - 2);

        //for (var i = 0;i < playersInfo.players.length;i++) {
        //  this.nicknameLabels[i].string = playersInfo.players[i].nickname;
        //  this.scoreLabels[i].string = playersInfo.players[i].totalScore;
        //}
    },
    js: function js(setting2) {
        var jushu = 5;
        switch (setting2) {
            case 0:
                jushu = 5;break;
            case 1:
                jushu = 10;break;
            case 2:
                jushu = 20;break;
            case 3:
                jushu = 30;break;
        }
        return jushu;
    },

    fen: function fen(userid, players) {
        // 找积分
        for (var i = 0; i < players.length; i++) {
            if (players[i] == userid) {
                return i;
            }
        }
    },
    creator: function creator(_creator, players) {
        //创房者
        for (var i = 0; i < players.length; i++) {
            if (players[i] == _creator) {
                return i;
            }
        }
    },

    clickAction: function clickAction(event, data) {
        var playersInfo = JSON.parse(data.playersInfo);
        var totalGameResultComp = this.totalGameResult.getComponent('TotalGameResult');
        totalGameResultComp.setPlayerInfos(playersInfo.players, data);
        totalGameResultComp._clickBtn();
        this.totalGameResult.getComponent('alert').alert();

        //if (this._recordItemInfo) {
        //  this._startPlayback(this._recordItemInfo._info8Array);
        //  return;
        //}
        ////Socket.sendGetItemRecord(Socket.instance.userInfo.id,this._parentId);
        //Socket.sendGetItemRecord(Socket.instance.userInfo.id,--index);
    },

    _startPlayback: function _startPlayback(playBackInfo) {
        //Playback.instance.setPlaybackDatas(playBackInfo);
        //cc.director.loadScene('play');
    },

    detailAction: function detailAction(recordItemInfo, index) {
        //this._recordItemInfo = recordItemInfo;
        ////this.playbackNode.active = true
        ////console.log();
        ////this.numNode.string = "第" + (index + 1) + "局";
        //this.timeLabel.string = recordItemInfo.creatAt.substr(5,11);
        //let objArray = JSON.parse(recordItemInfo.info8);
        //this._recordItemInfo._info8Array = objArray;
        //let playersArray = objArray.map(function(str){
        //  return JSON.parse(str);
        //});
        //
        //var players = playersArray[playersArray.length-1].data.players;
        //for (var i = 0;i < players.length;i++) {
        //    this.nicknameLabels[i].string = players[i].nickname;
        //    this.scoreLabels[i].string = players[i].cScore;
        //}
    },
    records: function records() {}

});

cc._RFpop();
},{"Playback":"Playback","record":"record","socket":"socket"}],"record":[function(require,module,exports){
"use strict";
cc._RFpush(module, '452f4rFUqRLFYlGEJS5kEWs', 'record');
// scripts\record.js

var KQGlobalEvent = require('KQGlobalEvent');
var Socket = require('socket');
cc.Class({
    'extends': cc.Component,

    properties: {
        scrollView: cc.Node,
        recordItem: cc.Prefab
    },

    //subScrollView:cc.Node,
    //subRecordItem:cc.Node,
    //splash:cc.Prefab,
    //reordInfo:cc.Node,
    //
    //jifen:cc.Label,
    //head:cc.Node,
    //id:cc.Label,
    //nickname:cc.Label,
    //creat:cc.Label,        // 创房人
    //createUser:cc.Node,     //  头像
    //
    //timeLabel:cc.Label,   // 时间
    //jushuLabel:cc.Label,  // 局数
    ////createUser:cc.Node,   // 房主
    //roomId:cc.Label,      // 房间号
    //_records:null,
    // use this for initialization
    onLoad: function onLoad() {
        //this.isSubPage = false;
        //this.subScrollView.active = false;
        //
        //this.subScrollViewContent = this.subScrollView.getComponent(cc.ScrollView).content;
        //console.log( this.subScrollViewContent );
        //this.recordInfo = this.subScrollViewContent.children[0];
        //this.reords = this.subScrollViewContent.children[0].children[3];
        this.scrollViewContent = this.scrollView.getComponent(cc.ScrollView).content;
        this._registerSocketEvent();
    },

    _registerSocketEvent: function _registerSocketEvent() {
        KQGlobalEvent.on(Socket.Event.GetRecord, this._ReceiveRecordInfo, this);
        //KQGlobalEvent.on(Socket.Event.GetItemRecord, this._ReceiveRecordItem, this);
    },

    _ReceiveRecordInfo: function _ReceiveRecordInfo(response) {
        //cc.log(response)
        //cc.log('------78')
        //console.log(response);
        //this._records = response.data;
        //this.isSubPage = false;
        //this.subScrollView.active = false;
        //this.scrollView.active = true;

        this.scrollViewContent.removeAllChildren();
        var index = 0;
        response.data.filter(function (record) {
            return record.playersInfo.length > 0;
        }).forEach((function (recordInfo) {
            index++;
            var item = cc.instantiate(this.recordItem);
            this.scrollViewContent.addChild(item);
            var comp = item.getComponent('recordInfo');
            comp.setInfo(recordInfo);
            var recordBtn = item.children[7].getComponent(cc.Button);
            recordBtn.clickEvents[0].customEventData = recordInfo;
            // var eventHandler = new cc.Component.EventHandler();
            // eventHandler.target = comp.node.children[7];
            // eventHandler.component = "btn";
            // eventHandler.handler = "clickAction";
            //eventHandler.customEventData = "my data";
            //console.log(comp.node.children[7]);
        }).bind(this));
    },

    closeAction: function closeAction() {
        if (this.isSubPage) {
            this.isSubPage = false;
            this.subScrollView.active = false;
            this.scrollView.active = true;
        } else {
            this.node.getComponent('alert').dismissAction();
        }
    }
});
/* clickAction:function( index ){
     //_ReceiveRecordItem()
 },
 _ReceiveRecordItem:function(RecordItemInfo) {
     cc.log(RecordItemInfo)
     cc.log('------78')
     //console.log(RecordItemInfo);return;
     var index = RecordItemInfo.data
     var playersInfo = JSON.parse(this._records[index].playersInfo);
     
     var players = playersInfo.players;                  // 玩家信息
     var playersIndex = playersInfo.playersIndex;        // 玩家的位置
     var createUserId = this._records[index].createUserId;   // 创房ID
     var sendUserId = this._records[index].userid;           // 发送人ID
      this.isSubPage = true;
     this.subScrollView.active = true;
     this.scrollView.active = false;
      this.timeLabel.string = (this._records[index].createAt).substr(5,11);               // 时间
     this.jushuLabel.string = this.js(JSON.parse(this._records[index].setting2));        // 局数
     this.roomId.string = this._records[index].roomId;                                   // 房间号
     this.creat.string = this.findCreator(this._records[index].createUserId,players);    // 房主
      this.subScrollViewContent = this.subScrollView.getComponent(cc.ScrollView).content;
     this.subScrollViewContent.removeAllChildren();
      for(var i = 0; i < players.length; i++ ){
         var item = cc.instantiate(this.splash);
         this.subScrollViewContent.addChild(item);
         var comp = item.getComponent('recordInfo');
         var creator = 0;       
         var self = 0;       // 表示自己，要对自己的比牌记录背景做处理
         if(createUserId == players[i].id){
             creator =1;
         }
         if( sendUserId == players[i].id){
             self = 1;
         }
         this.records(comp,i,creator,self,index);
     }
  },
 records:function(info,i,creator,self,index){
     if(self){
         info.node.color = new cc.Color(125, 126, 200);
     }
     cc.log(info)
     cc.log('----119')
     var players = JSON.parse(this._records[index].playersInfo).players;
     var scores = this._records[index].scores ;
     info.nicknameLabels.string = players[i].nickname;
     info.id.string = players[i].id;
     info.jifen.string = scores[i];
      var headUrl = players[i].avatarUrl;   //头像连接
     var sprite = info.avatarNode.getComponent(cc.Sprite);
     cc.loader.load(headUrl+".jpg", function (err, tex) {
       if (!err) {
           var frame = new cc.SpriteFrame(tex);
           sprite.spriteFrame=frame;
       }
     });
     info.creatorImg.active = creator;
 },
 findCreator:function(createId,players){ //找房主
     for(var i=0; i<players.length;i++){
         if(createId == players[i].id){
             return players[i].nickname;
         }
     }
 },
 js:function(num){
     var J = 5;
     switch(num){
         case 0: J = 5;break;
         case 1: J = 10;break;
         case 2: J = 20;break;
         case 3: J = 30;break;
     }
     return J;
 },*/

cc._RFpop();
},{"KQGlobalEvent":"KQGlobalEvent","socket":"socket"}],"rule":[function(require,module,exports){
"use strict";
cc._RFpush(module, '92f6eNs7RdDRJIRLCZnyulJ', 'rule');
// scripts\rule.js

cc.Class({
    'extends': cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function onLoad() {},

    clickExit: function clickExit() {
        cc.director.loadScene('hall');
    }
});

cc._RFpop();
},{}],"scale":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'c1c33tgIe9JvLb/mE+2mRnK', 'scale');
// scripts\scale.js

cc.Class({
    "extends": cc.Component,

    properties: {
        content: cc.Node
    },

    onLoad: function onLoad() {
        var visibleSize = cc.director.getVisibleSize();
        var contentSize = {};
        contentSize.width = this.node.width;
        contentSize.height = this.node.height;
        var scaleX = visibleSize.width / contentSize.width;
        var scaleY = visibleSize.height / contentSize.height;
        var scale = Math.min(scaleX, scaleY).toFixed(2);
        this.node.scaleX = scale;
        this.node.scaleY = scale;
    }
});

cc._RFpop();
},{}],"selectMoShi":[function(require,module,exports){
"use strict";
cc._RFpush(module, '0030eDrh7xEm6AeR3FCg5WU', 'selectMoShi');
// scripts\selectMoShi.js

cc.Class({
    'extends': cc.Component,

    properties: {
        nodes: [cc.Node],
        selectedIndex: 0,
        _select: [],
        _selected: 0,
        beilv: cc.Node, // 倍率
        _blShow: 0 },

    // 倍率的显示状态
    onLoad: function onLoad() {
        this.beilv.active = this._blShow;
        this._select = [1, 1, 1, 0, 0];
        if (cc.set) {
            // 记录上一句的房间情况
            this._select = cc.set['setting3'];
        }
        var self = this;
        for (var i = 0; i < this.nodes.length; i++) {
            var active = this._select[i];
            this.nodes[i].getComponent('select').setSelected(active);
            var title = this.nodes[i].getChildByName('title');
            if (this._select[i]) {
                title.color = new cc.Color(13, 210, 222);
            } else {
                title.color = new cc.Color(255, 255, 255);
            }
            if (i == 3) {
                this.beilv.active = this._blShow = this._select[3];
            }
        }

        for (var i = 0; i < this.nodes.length; i++) {
            var tComp = this.nodes[i].getComponent('select');
            tComp.index = i;
            tComp.clickAction = function () {
                var index = this.index;
                for (var i = 0; i < self.nodes.length; i++) {
                    var comp = self.nodes[i].getComponent('select');
                }
                this.setSelected(self._select[index] = !self._select[index]);
                if (this.index == 3) {
                    // 第三个是庄家模式，庄家模式显示倍率
                    self.beilv.active = this._blShow = self._select[3];
                }

                self._select[index] = self._select[index];
                self.selectedIndex = index;
                self.onSelectChange(index);

                var title = this.node.children[0];
                if (self._select[index]) {
                    // 如果当前选项为TRUE 则显示青色
                    title.color = new cc.Color(13, 210, 222);
                } else {
                    // 反之 白色
                    title.color = new cc.Color(255, 255, 255);
                }
            };
        }
    },
    onSelectChange: function onSelectChange(selectIndex) {
        //cc.log(selectIndex);
        //console.log(this._select);
    }

});

cc._RFpop();
},{}],"select_mapai":[function(require,module,exports){
"use strict";
cc._RFpush(module, '8e7e53kJcJK9rwMSxnloqI5', 'select_mapai');
// scripts\select_mapai.js

cc.Class({
    "extends": cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        pai: cc.Node,
        mapai: {
            "default": [],
            type: cc.SpriteFrame
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.selectMa = this.node.getComponent("select_ma");
        this.selectMa.onLoad();
        this.com = this.pai.getComponent(cc.Sprite);
    },

    clickBtnComfirm: function clickBtnComfirm() {
        this.com.spriteFrame = this.mapai[cc.from.ma];
        //console.log(this.com.spriteFrame);
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"select_ma":[function(require,module,exports){
"use strict";
cc._RFpush(module, '4bc0b2bZGRGXoAfdO3Y6Squ', 'select_ma');
// scripts\select_ma.js

cc.Class({
    "extends": cc.Component,

    properties: {
        rightIcon: [cc.Node],
        mapaiRight: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        if (cc.from == null) {
            cc.from = {};
        }
        //如果不带马，则马牌为空
        if (this.mapaiRight.active == false) {
            cc.from.isUseMa = false;
            cc.from.ma = null;
        } else {
            cc.from.isUseMa = true;
            //否则马牌默认为第0个，即黑桃5
            cc.from.ma = 0;
        }
        for (var i = 0; i < this.rightIcon.length; i++) {
            if (i == 0) {
                this.rightIcon[i].active = true;
                cc.from.ma = 0;
                this.select = this.rightIcon[i];
            } else {
                this.rightIcon[i].active = false;
            }
        }
    },
    onMaPaiClick: function onMaPaiClick(e) {
        var targetName = e.target.name;
        //cc.log(targetName)
        if (targetName != this.select.parent.name) {
            if (targetName == "select_kuang1") {
                this.select = this.rightIcon[2];
                cc.from.ma = 2;
            } else if (targetName == "select_kuang2") {
                this.select = this.rightIcon[1];
                cc.from.ma = 1;
            } else if (targetName == "select_kuang3") {
                this.select = this.rightIcon[0];
                cc.from.ma = 0;
            }
            for (var i = 0; i < this.rightIcon.length; i++) {
                this.rightIcon[i].active = false;
            }
            this.select.active = true;
        }
        //console.log(cc.from.ma);
    }

});

cc._RFpop();
},{}],"selectbeilv":[function(require,module,exports){
"use strict";
cc._RFpush(module, '253cf+Bll9FV5ngl0DW3PxZ', 'selectbeilv');
// scripts\selectbeilv.js

var KQGlobalEvent = require('KQGlobalEvent');
var Socket = require('socket');
cc.Class({
    'extends': cc.Component,

    properties: {
        _userid: 0
    },

    // use this for initialization
    onLoad: function onLoad() {},
    clickBeiLv: function clickBeiLv(event, num) {
        this.node.active = false;
        Socket.sendBeiLv(num, this._userid);
    }

});

cc._RFpop();
},{"KQGlobalEvent":"KQGlobalEvent","socket":"socket"}],"select":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e913aIwAtVEo5jMrf40D5rw', 'select');
// scripts\select.js

cc.Class({
    "extends": cc.Component,

    properties: {
        bgNode: cc.Node, //选择框
        selectedNode: cc.Node, //对号
        pai: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        //console.log(this.node);
        this.selected = true;
        //console.log(cc.set);
    },

    clickAction: function clickAction() {
        this.selected = !this.selected;
        this.selectedNode.active = this.selected;
    },

    setSelected: function setSelected(selected) {
        this.selected = selected;
        this.selectedNode.active = this.selected;
    },
    /*#####*/
    clickSelectKuang: function clickSelectKuang() {
        this.selected = !this.selected;
        this.selectedNode.active = this.selected;
        cc.from.isUseMa = this.selected;
        var mapaiCom = this.pai.getComponent(cc.Button);
        if (this.selectedNode.active === false) {
            mapaiCom.interactable = false;
        } else {
            mapaiCom.interactable = true;
        }
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"singleSelect":[function(require,module,exports){
"use strict";
cc._RFpush(module, '194a8h4vXFO+bXX92yzqbfq', 'singleSelect');
// scripts\singleSelect.js

cc.Class({
    'extends': cc.Component,

    properties: {
        nodes: [cc.Node],
        selectedIndex: 0
    },

    /*####*/
    onLoad: function onLoad() {
        var self = this;
        var rs = 0;
        var js = 0;
        var sf = 0;
        var bl = 0;
        if (cc.set) {
            js = cc.set.setting1;
            rs = cc.set.setting2;
            sf = cc.set.setting4;
            bl = cc.set.setting5;
        }
        for (var i = 0; i < this.nodes.length; i++) {
            var isSelected = this.selectedIndex == i;
            this.nodes[i].getComponent('select').setSelected(isSelected);
            var index = 0;
            var selectIndex = this.selectedIndex;
            this.nodes[i].getChildByName('title').color = new cc.Color(255, 255, 255);
            if (selectIndex == i) {
                this.nodes[selectIndex].getChildByName("title").color = new cc.Color(13, 210, 222);
            }
        }
        for (var i = 0; i < this.nodes.length; i++) {
            var tComp = this.nodes[i].getComponent('select');
            tComp.index = i;

            tComp.clickAction = function () {
                for (var i = 0; i < self.nodes.length; i++) {
                    var comp = self.nodes[i].getComponent('select');
                    comp.setSelected(false);
                }
                var Peers = this.node.parent.children; // 同辈节点
                var index = 0;
                for (var a = 0; a < Peers.length; a++) {
                    if (Peers[a].children.length > 0) {
                        // 如果同辈有子节点 处理子节点文字的颜色
                        var title = Peers[a].getChildByName("title");
                        title.color = new cc.Color(255, 255, 255);
                    }
                }
                this.node.getChildByName('title').color = new cc.Color(13, 210, 222);
                //this.node.children[index].color = new cc.Color(13,210,222);
                this.setSelected(true);
                self.selectedIndex = this.index;
                self.onSelectChange(this.index);
            };
        }
        if (this.node._name == "renshu" && cc.set) {
            console.log(rs);
            this.remember_set(rs);
        }
        if (this.node._name == "jushu" && cc.set) {
            this.remember_set(js);
        }
        if (this.node._name == "cards" && cc.set) {
            this.remember_set(sf);
        }
        if (this.node._name == "beiLv" && cc.set) {
            this.remember_set(bl);
        }
    },
    remember_set: function remember_set(num) {
        this.selectedIndex = num;
        for (var i = 0; i < this.nodes.length; i++) {
            var isSelected = num == i;
            this.nodes[i].getComponent('select').setSelected(isSelected);
            var index = 0;
            this.nodes[i].getChildByName('title').color = new cc.Color(255, 255, 255);
            if (num == i) {
                // if( this.nodes[num].children[0].name == "title" ){
                //     index = 0;
                // }else if(this.nodes[num].children[1].name == "title"){
                //     index =1;
                // }
                this.nodes[num].getChildByName('title').color = new cc.Color(13, 210, 222);
            }
        }
    },

    onSelectChange: function onSelectChange(selectIndex) {}

});

cc._RFpop();
},{}],"slider":[function(require,module,exports){
"use strict";
cc._RFpush(module, '1c921w7bEFKUIdNwItOX3oG', 'slider');
// scripts\slider.js

cc.Class({
    "extends": cc.Component,

    properties: {
        indicatorNode: cc.Node,
        backgroundNode: cc.Node,
        selectedNode: cc.Node,

        value: 0
    },

    // use this for initialization
    onLoad: function onLoad() {
        var self = this;
        this.indicatorNode.on(cc.Node.EventType.TOUCH_START, function (event) {});
        this.indicatorNode.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            var pt = self.node.convertToNodeSpace(cc.v2(event.getLocationX(), event.getLocationY()));
            self.updateSlider(pt);
        });
        this.indicatorNode.on(cc.Node.EventType.TOUCH_END, function (event) {
            var pt = self.node.convertToNodeSpace(cc.v2(event.getLocationX(), event.getLocationY()));
            self.updateSlider(pt);
        });
        this.indicatorNode.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            var pt = self.node.convertToNodeSpace(cc.v2(event.getLocationX(), event.getLocationY()));
            self.updateSlider(pt);
        });

        //this.maxWidth = this.node.width - 40;
        this.maxWidth = this.node.width - 28;
        this.setValue(this.value);
    },

    updateSlider: function updateSlider(pt) {
        var x = pt.x;
        if (x < 0) {
            x = 0;
        }

        if (x > this.maxWidth) {
            x = this.maxWidth;
        }
        this.setValue(x / this.maxWidth);
        this.onValueChange(this.value);
    },

    /*0 - 1*/
    setValue: function setValue(value) {
        this.value = value;
        if (this.value < 0) {
            this.value = 0;
        }
        if (this.value > 1) {
            this.value = 1;
        }
        //this.maxWidth = this.node.width - 38;
        this.maxWidth = this.node.width - 28;
        this.indicatorNode.x = this.value * this.maxWidth + 10;
        this.selectedNode.width = this.value * this.maxWidth + this.indicatorNode.width / 2;
    },

    onValueChange: function onValueChange(value) {
        cc.log(value);
    }
});

cc._RFpop();
},{}],"socket":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'cf75cLLNo1ETbJFrx/23i/H', 'socket');
// scripts\socket.js

var manager = require('manager');
var KQGlobalEvent = require('KQGlobalEvent');
var KQNativeInvoke = require('KQNativeInvoke');

var SocketConstant = {
  MaxReconnectCheckInterval: 5 };

/**
 * 这是对 WebSocket 的一个封装
 * 
 * 里面包含自动重连的功能
 */
// 重连检测时间片
var Socket = cc.Class({
  'extends': cc.Component,

  properties: {
    _lastReceiveMsgTime: 0, // 最后一次收到消息时间(毫秒)
    _timeout: 8 },

  // 超时时长 （秒）
  statics: {
    instance: null,
    // url:"ws://182.18.26.13:5041",
    url: "ws://123.56.20.164:5041"
  },

  // url:"ws://192.168.0.108:5041",
  //url:"ws://183.3.205.149:5002",
  // use this for initialization
  onLoad: function onLoad() {
    Socket.instance = this;

    this.name = "socket";

    cc.game.addPersistRootNode(this.node);
    if (cc.game.isPersistRootNode(this.node)) {
      cc.log('添加全局节点 Socket 成功');
    }

    this._registerAppActiveChange();

    this.isCreating = false;
    this.createIndex = 0;
    this.createSocket();

    this.schedule(function () {
      this.checkConnection();
    }, 5);

    this.recvTime = Date.now(); //接收到最新一条服务器的信息的时间
    //cc.log(manager.version);

    this._checkSocket();
  },

  checkConnection: function checkConnection() {
    //客户端定时给服务端发送点数据，防止连接由于长时间没有通讯而被某些节点的防火墙关闭导致连接断开的情况。
    this.sendMessage('checkAction', '');
  },

  createSocket: function createSocket() {
    var self = this;
    this.createIndex++; //创建次数加1
    if (this.createIndex > 5) {
      this.networkError();
      KQNativeInvoke.forceExitApp();
      return;
    }
    this.isCreating = true;

    KQGlobalEvent.emit(Socket.Event.SocketConnecting);
    this.ws = new WebSocket(Socket.url);
    if (this.ws === null) {
      this.networkError();
      KQGlobalEvent.emit(Socket.Event.SocketConnectError, { 'data': 'Socket 创建失败' });
      KQNativeInvoke.forceExitApp();
      return;
    }
    this.socketError = false;

    // socket 连接成功
    this.ws.onopen = function (event) {
      //cc.log("WebSocket 连接成功：", event);

      self._lastReceiveMsgTime = cc.sys.now();
      KQGlobalEvent.emit(Socket.Event.SocketConnectSuccessed, event);

      self.isCreating = false;
      self.socketError = false;
      self.createIndex = 0;
      self.connectionSuccess();
      self.sendReconnectInfo();
    };

    // socket 接收到消息
    this.ws.onmessage = function (event) {
      self._lastReceiveMsgTime = cc.sys.now();
      KQGlobalEvent.emit(Socket.Event.SocketReceiveMessage, event.data);

      self.isCreating = false;
      self.socketError = false;
      self.receviceMessage(event.data);
      self._dispatchResponse(event.data);
      self.recvTime = Date.now(); //接收最新一条信息的时间

      /**/
    };

    /**
     * socket 发生错误
     * 
     * socket 本身有 `onerror` 回调，但事实证明，其不靠谱，
     * 有很大的机率有误报的行为，常常在没有错误时，会给错误回调。
     * 且不能定制超时时长
     * 
     * @param {String} message 
     */
    this.ws._kq_onerror = function (message) {
      cc.error('WebSocket 连接错误：' + message);

      KQGlobalEvent.emit(Socket.Event.SocketConnectError, { data: message });
      self.ws.close();
      if (!self.ws) {
        return;
      }

      // 虽然调用了 websocket 的 close 方法，但是
      // 它并会立即调用 onclose 回调，而是在未来的某
      // 一时间再回调 onclose；但这里明显可以直接回调了。
      var ws = self.ws;

      self.ws.onclose();
      ws.onclose = function () {};
    };

    // socke 已关闭
    this.ws.onclose = function (event) {
      //cc.log('WebSocket 已关闭 close time=' + Date.now() + " event: " + event);

      self.isCreating = false;
      self.socketError = true;
      self.ws = null;
      self.connectionDisconnect();
      KQGlobalEvent.emit(Socket.Event.SocketDisconnect, event);
      //cc.log('socket close'+JSON.stringify(event));
    };
  },

  reconnect: function reconnect() {
    var self = this;
    this.scheduleOnce(function () {
      if (!self.isCreating && self.socketError) {
        self.createSocket();
      }
    }, 2);
  },

  sendReconnectInfo: function sendReconnectInfo() {
    var self = this;
    this.scheduleOnce(function () {
      if (this.userInfo != null) {
        var userId = self.userInfo.user_id || self.userInfo.id;
        self.sendMessage('reconnect', {
          'userId': userId
        });
      }
    }, 1);
  },

  receviceMessage: function receviceMessage(response) {},

  connectionDisconnect: function connectionDisconnect() {},

  connectionSuccess: function connectionSuccess() {},

  networkError: function networkError() {},

  checkNetworkStart: function checkNetworkStart() {},

  checkNetworkEnd: function checkNetworkEnd() {},

  _dispatchResponse: function _dispatchResponse(responseString) {
    //cc.log("WebSocket 接收到服务器消息：", responseString);
    var response = JSON.parse(responseString);
    var action = response["action"];
    if (action) {
      KQGlobalEvent.emit(action, response);
    }
  },

  // MARK: 前后台操作
  _registerAppActiveChange: function _registerAppActiveChange() {
    //cc.log("WebSocket 注册应用进入前、后台事件");
    cc.game.on(cc.game.EVENT_HIDE, this._appEnterBackground, this);
    cc.game.on(cc.game.EVENT_SHOW, this._appBecomActive, this);
  },

  /**
   * 进入后台
   */
  _appEnterBackground: function _appEnterBackground() {
    var now = cc.sys.now();
    if (now - this._lastAppEnterBackgroundTime < 100) {
      return;
    }
    this._lastAppEnterBackgroundTime = now;

    //cc.log("WebSocket 检测到应用进入后台：", new Date());
    var id = this.userInfo ? this.userInfo.id : undefined;
    Socket.sendAppPause(id);
    this._cancelCheckSocket();
  },

  /**
   * 进入前台 
   */
  _appBecomActive: function _appBecomActive() {
    var now = cc.sys.now();
    if (now - this._lastAppBecomActiveTime < 100) {
      return;
    }
    this._lastAppBecomActiveTime = now;

    //cc.log("WebSocket 检测到应用进入前台：", new Date());
    var id = this.userInfo ? this.userInfo.id : undefined;
    Socket.sendAppActive(id);
    this._checkSocket();

    this.scheduleOnce((function () {
      this._checkSocketExecute();
    }).bind(this), 1.5);
  },

  //进入后台操作
  enterbackgroudAction: function enterbackgroudAction() {
    this._appEnterBackground();
  },

  //进入前台操作
  resumeAction: function resumeAction() {
    //检查网络
    this._checkNetwork();
    this._appBecomActive();
  },

  sendMessage: function sendMessage(action, data) {
    data = this._strongVerifyData(data);

    if (this.socketError) {
      cc.error("socket 连接错误：" + this.socketError);
      this.reconnect();
      return;
    }
    //cc.log('WebSocket 发送消息：' + action, data);
    if (cc.sys.isObjectValid(this.ws)) {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(this._convertParameterToString(action, data));
      }
    } else {
      this.connectionDisconnect();
    }
  },

  _strongVerifyData: function _strongVerifyData() {
    var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    if (typeof data == 'string') {
      data = { "string": data };
    }

    if (data == null) {
      data = {};
    }

    if (!data["userId"]) {
      if (this.userInfo && typeof this.userInfo == 'object' && this.userInfo.id) {
        data["userId"] = this.userInfo.id;
      }
    }
    return data;
  },

  _convertParameterToString: function _convertParameterToString(action) {
    var data = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var obj = {};
    obj.action = action;
    obj.data = data;

    return JSON.stringify(obj);
  },

  // 检查网络
  _checkNetwork: function _checkNetwork() {
    if (this.checkNetworkNow) {
      this.checkNetworkNow();
    }

    this.shouldCheck = true;
    if (!this.socketError) {
      this.recvTime = 0;
      this.sendMessage('checkAction', '');
      this.scheduleOnce(function () {
        this.checkNetworkEnd();
        this.shouldCheck = false;
        if (this.recvTime === 0) {
          this.connectionDisconnect();
        }
      }, 2.5);
    } else {
      this.connectionDisconnect();
    }
  },

  // MARK: socket 掉线尽早确认
  _checkSocket: function _checkSocket() {
    this.schedule(this._checkSocketExecute, SocketConstant.MaxReconnectCheckInterval, cc.macro.REPEAT_FOREVER);
  },

  _cancelCheckSocket: function _cancelCheckSocket() {
    this.unschedule(this._checkSocketExecute);
  },

  _checkSocketExecute: function _checkSocketExecute() {
    if (this._isSocketTimeout() && this.ws) {
      this.ws._kq_onerror('连接超时');
      return;
    }
  },

  // socket 是否已超时
  _isSocketTimeout: function _isSocketTimeout() {
    return this._lastReceiveMessageInterval() >= this._timeout;
  },

  // 上一次收到消息到现在的时间间隔
  _lastReceiveMessageInterval: function _lastReceiveMessageInterval() {
    var now = cc.sys.now();
    var interval = (now - this._lastReceiveMsgTime) / 1000;
    //cc.log(`WebSocket 现在距上一条收到消息的时间间隔是：${interval} 秒`);
    return interval;
  }

});

// MARK: Socket 事件定义
Socket.Event = {
  SocketConnecting: "SocketConnecting", // Socket 正在连接
  SocketConnectSuccessed: "SocketConnectSuccessed", // 连接成功
  SocketDisconnect: "SocketDisconnect", // Socket 断开连接
  SocketConnectError: "SocketConnectError", // Socket 连接错误
  SocketReceiveMessage: "SocketReceiveMessage", // Socket 接收到消息

  LoginJoin: "loginJoin", // 客户端发送 从登陆界面获取房间号进入游戏
  RecordId: "recordId", // 客户端发送 
  OnceAgain: "onceAgain", // 客户端发送 
  BeiLv: "beiLv", // 客户端发送 
  InviteCode: "inviteCode", // 客户端发送   邀请码
  JoinDesk: "joinDesk", // 客户端发送
  CreateDesk: "createDesk", // 客户端发送
  LeaveDesk: "leaveDesk", // 离开桌子
  DissolveDesk: "dissolveDesk", // 解散桌子
  AnswerDissolve: "answerDissolve", // 回答请求退出命令
  GetDeskInfo: "getDeskInfo", // 客户端发送
  SendImage: "sendImage", // 客户端发送
  SendText: "sendText", // 客户端发送
  SendEmoji: "sendEmoji", // 客户端发送
  ChangeInfo: "changeInfo", // 客户端发送
  SendAudioMessage: "sendAudioMessage", // 客户端发送  发送语音消息
  GetRecord: "getRecord", // 获取战绩信息
  GetItemRecord: "getItemRecord", // 获取战绩信息
  PlayCard: "playCard", // 客户端发送，用户打出牌
  TimeoutDissolve: "timeoutDissolve", // 请求退出超时时，需要发出的消息
  Feedback: "feedback", // 客户端发送  反馈信息
  SharePng: "sharePng", // 客户端发送  分享领取砖石
  EnterRandom: "interRandom", // 客户端发送  进入随机场
  CancelRandom: "cancelRandom", // 客户端发送  取消进入随机场
  ForceExitRandom: "dissolve", // 客户端发送 强制退出随机场
  Ready: "ready", // 客户端发送 准备
  StartGame: "startGame", // 客户端发送 开始游戏
  GetHallInfo: "getHallInfo", // 客户端发送 获取大厅信息
  GetUserInfo: "getUserInfo", // 客户端发送 获取用户信息
  CheckAction: "checkAction", // 客户端发送，用来检测与服务器的连通性
  Pause: "pause", // 客户端进入后台时要发送的消息
  Active: "active", // 客户端回到前台时要发送的消息
  Qingli: "qingli", // 客户端回到前台时要发送的消息

  ReceiveRequestDissolve: "requestDissolve", // 请求解散桌子 服务器发送
  ReceiveRequestDissolveResult: "requestDissolveResult", // 请求解散桌子结果
  ReceiveChatText: "sendText", // 服务器发送
  ReceiveChatEmoji: "sendEmoji", // 服务器发送
  ReceiveDeskInfo: "deskInfo", // 服务器发送
  ReceiveGameOver: "gameOver", // 服务器发送
  ReceiveFaPai: "fapai", // 服务器发送
  ReceiveSharePng: "sharePngs", // 服务器发送
  ReceiveOnlineStatus: "sendOnlineStatus", // 服务器发送
  ReceiveOnChangeInfo: "changeInfo", // 服务器发送
  ReceiveAudioMessage: "sendAudioMessage", // 服务器发送，接收到用户发送了语音消息
  ReceivePlayCard: "playCard", // 服务器发送，有用户已经准备好牌
  ReceiveCreateDesk: "createDesk", // 服务器发送，创建房间的回调
  ReceiveReady: "ready", // 服务器发送，有用户点击了准备
  ReceiveHallInfo: "getHallInfo", // 服务器发送
  ReceiveGetUserInfo: "getUserInfo", // 服务器发送 获取用户信息
  ReceiveCheckAction: "checkAction", // 服务器发送  用来确认 Socket 还在连着
  ReceiveForceExit: "forceExit", // 服务器发送  用来使客户端强退
  ReceiveDissolveDesk: "dissolveDesk", // 服务器发送   当房主退出时，解散桌子
  ReceiveInterRandom: "interRandom", // 服务器发送   进入随机场的反馈
  ReceivePause: "pause", // 服务器发送   当有用户设备进入后台时，会收到这条消息
  ReceiveInviteCode: 'inviteCode', // 服务器发送，收到邀请码的消息
  ReceiveLeaveDesk: 'leaveDesk', // 服务器发送，收到需要离开桌子的消息
  ReceiveSelectBeiLv: 'selectBeiLv', // 服务器发送，收到选择倍率的消息
  ReceiveBeiLv: 'beiLv', // 服务器发送，收到倍率的消息
  ReceiveQingLi: 'qingli', // 服务器发送，收到请离
  ReceiveRecordId: 'recordId', // 服务器发送，收到战绩信息
  ReceiveLoginJoin: 'loginJoin', // 服务器发送，收到从页面进入房间信息
  ReceiveOnceAgain: 'onceAgain', // 服务器发送，收到再来一局信息
  ReceiveNoUionid: 'noUionid' };

// MARK: Socket 提供的可发给服务器消息的方法

// 服务器发送，收到没有unionID信号
Socket.sendCheckAction = function () {
  this.instance.sendMessage(this.Event.CheckAction, null);
};
/**/
Socket.sendDidReceiveGameOverAction = function (userId) {
  var param = userId ? { "userId": userId } : null;
  this.instance.sendMessage(Socket.Event.DidReceiveGameOverAction, param);
};
/**/

/**
 * 当 APP 进入后台时要发送的消息
 */
Socket.sendAppPause = function (userId) {
  var param = userId ? { "userId": userId } : null;
  this.instance.sendMessage(this.Event.Pause, param);
};

/**
 * 当 APP 进入前台时发送的消息
 */
Socket.sendAppActive = function (userId) {
  var param = userId ? { "userId": userId } : null;
  this.instance.sendMessage(this.Event.Active, param);
};

// 开房
Socket.sendCreateDesk = function (createDescInfo, userId) {
  cc.assert(createDescInfo);
  cc.assert(userId);

  createDescInfo["userId"] = userId;
  this.instance.sendMessage(this.Event.CreateDesk, createDescInfo);
};

Socket.sendQingli = function (leaveId, userId) {
  var param = {
    "leaveId": leaveId,
    "userId": userId
  };
  this.instance.sendMessage(this.Event.Qingli, param);
};
// 从登陆页面加入房间
Socket.sendLoginJoin = function (roomId, userId) {
  var param = {
    "roomId": roomId,
    "userId": userId
  };
  this.instance.sendMessage(this.Event.LoginJoin, param);
};
// 再来一局
Socket.sendOnceAgain = function (again, userId) {
  var param = {
    "userId": userId,
    "again": again
  };
  this.instance.sendMessage(this.Event.OnceAgain, param);
};
// 加入房间
Socket.sendJoinDesk = function (roomId, userId) {
  cc.assert(roomId);
  cc.assert(userId);

  var param = {
    "roomId": roomId,
    "userId": userId
  };
  this.instance.sendMessage(this.Event.JoinDesk, param);
};
// 向服务端发送我选择的倍率
Socket.sendBeiLv = function (beilv, userId) {
  var param = {
    "beilv": beilv,
    "userId": userId
  };
  this.instance.sendMessage(this.Event.BeiLv, param);
};
// 发送邀请码
Socket.sendInviteCode = function (inviteCode, userId) {
  var param = {
    "inviteCode": inviteCode,
    "userId": userId
  };
  this.instance.sendMessage(this.Event.InviteCode, param);
};

// 获取房间信息
Socket.sendGetDesckInfo = function (userId) {
  cc.assert(userId);
  var param = {
    "userId": userId
  };

  this.instance.sendMessage(this.Event.GetDeskInfo, param);
};

Socket.sendText = function (userId, text) {
  //cc.assert(userId);
  //cc.assert(text);
  var param = {
    "msg": text,
    "userId": userId
  };
  this.instance.sendMessage(this.Event.SendText, param);
};
Socket.sendEmoji = function (userId, emoji) {
  var param = {
    "emoji": emoji,
    "userId": userId
  };
  this.instance.sendMessage(this.Event.SendEmoji, param);
};
Socket.sendChangeInfo = function (userId, Info) {
  var param = {
    "changeInfo": Info,
    "userId": userId
  };
  this.instance.sendMessage(this.Event.ChangeInfo, param);
};
Socket.sendAudioMessage = function (userId) {
  var url = arguments.length <= 1 || arguments[1] === undefined ? "" : arguments[1];

  cc.assert(userId);
  cc.assert(url.length > 0);

  if (url.length == 0) {
    return;
  }

  var param = {
    "url": url,
    "userId": userId
  };
  this.instance.sendMessage(this.Event.SendAudioMessage, param);
};

Socket.sendImage = function (userId, image) {
  cc.assert(userId);
  cc.assert(image);
  var param = {
    "msg": image,
    "userId": userId
  };
  this.instance.sendMessage(this.Event.SendImage, param);
};

Socket.sendGetRecrod = function (userId) {
  cc.assert(userId);
  var param = {
    "userId": userId
  };
  this.instance.sendMessage(this.Event.GetRecord, param);
};

Socket.sendGetRecrodFromId = function (recordId) {
  var param = {
    "recordId": recordId
  };
  this.instance.sendMessage(this.Event.RecordId, param);
};

Socket.sendDissolveDesk = function (userId) {
  cc.assert(userId);
  var param = {
    "userId": userId
  };
  this.instance.sendMessage(this.Event.DissolveDesk, param);
};

Socket.sendGetItemRecord = function (userId, parentId) {
  cc.assert(userId);
  cc.assert(parentId);
  var param = {
    "userId": userId,
    "parentId": parentId
  };

  this.instance.sendMessage(this.Event.GetItemRecord, param);
};

Socket.sendLeaveDesk = function (userId) {
  cc.assert(userId);
  var param = {
    "userId": userId
  };

  this.instance.sendMessage(this.Event.LeaveDesk, param);
},

/**
 * 回答退房请求
 * 
 * @param  {Number} userId 当前用户 id
 * @param  {NUmber} answer=1 回答。1 表示同意； 0 表示拒绝； -1 表示未选择
 */
Socket.sendAnswerDissolve = function (userId) {
  var answer = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

  cc.assert(userId);
  var param = {
    "userId": userId,
    "answer": answer
  };

  this.instance.sendMessage(this.Event.AnswerDissolve, param);
}, Socket.sendForceExitRoom = function (userId) {
  cc.assert(userId);
  var param = {
    "userId": userId
  };

  this.instance.sendMessage(this.Event.DissolveDesk, param);
},

// 十三张中
// cardInfo 类似于：
// [{
//         'cards':[{'suit':suit,'number':number},{}],//特殊牌不用传
//         'type':0,
//         'value':4,
//         'isContainExtra':true,// 特殊牌是否包含特殊牌
//     },
//     {
//         'cards':[{'suit':suit,'number':number},{}],
//         'type':0,
//         'value':4
//     }]
Socket.sendPlayCard = function (userId, cardInfo) {
  cc.assert(userId);
  var param = {
    "userId": userId,
    "card": cardInfo
  };

  this.instance.sendMessage(this.Event.PlayCard, param);
};

Socket.sendTimeoutDissolve = function (userId) {
  cc.assert(userId);
  var param = {
    "userId": userId
  };

  this.instance.sendMessage(this.Event.TimeoutDissolve, param);
};

Socket.sendFeedback = function (userId, text) {
  cc.assert(userId);
  cc.assert(text);
  var param = {
    "userId": userId,
    "text": text
  };

  this.instance.sendMessage(this.Event.Feedback, param);
};

Socket.sendSharePng = function (userId) {
  cc.assert(userId);
  var param = {
    "userId": userId
  };
  this.instance.sendMessage(this.Event.SharePng, param);
};
// 开始匹配随机场
Socket.sendEnterRandom = function (userId) {
  cc.assert(userId);
  var param = {
    "userId": userId
  };

  this.instance.sendMessage(this.Event.EnterRandom, param);
};

// 取消匹配随机场
Socket.sendCancelRandom = function (userId) {
  cc.assert(userId);
  var param = {
    "userId": userId
  };

  this.instance.sendMessage(this.Event.CancelRandom, param);
};

// 准备
Socket.sendReady = function (userId) {
  cc.assert(userId);
  var param = {
    "userId": userId
  };

  this.instance.sendMessage(this.Event.Ready, param);
}, Socket.sendStartGame = function (userId) {
  cc.assert(userId);
  var param = {
    "userId": userId
  };
  cc.log(this.Event.StartGame);
  cc.log();
  this.instance.sendMessage(this.Event.StartGame, param);
},

// 获取大厅信息
Socket.sendGetHallInfo = function (userId) {
  var param = {
    "userId": userId
  };

  this.instance.sendMessage(this.Event.GetHallInfo, param);
},

// 获取用户信息
Socket.sendGetUserInfo = function (userId, openId) {
  var param = {
    "userId": userId,
    "openId": openId
  };

  this.instance.sendMessage(this.Event.GetUserInfo, param);
}, module.exports = Socket;

cc._RFpop();
},{"KQGlobalEvent":"KQGlobalEvent","KQNativeInvoke":"KQNativeInvoke","manager":"manager"}],"test":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'f3a5ah1deZEh6HfPdghRXyA', 'test');
// scripts\KQCard\test.js

this._changeCardScors = function (cardModel) {

    cardModel.forEach(function (card) {
        card.scores = card.number;
    });

    cardModel = this._convertOneToA(cardModel);

    var is14 = true; //是A K Q J 10 ;

    var is1 = true; //是1 2 3 4 5

    cardModel.forEach(function (card) {
        if (card.scores < 10) is14 = false;
    }); //不是A K Q J 10

    cardModel.forEach(function (card) {
        if ((card.scores > 5 || card.scores == 14) && card.scores != 20) is1 = false;
    }); //不是1 2 3 4 5});

    if (is14) {
        //是A K Q J 10 ;

        cardModel.sort(function (a1, a2) {
            return a2.scores - a1.scores;
        });

        var num = 14,
            scoresAyy = []; //一副牌的分数

        for (var i = 0; i < 5; i++) {

            scoresAyy.push(num);

            num -= 1;
        }

        for (var j = 0; j < scoresAyy.length; j++) {

            for (var i = 0; i < cardModel.length; i++) {

                var cardScores = cardModel[i].scores;

                if (cardScores == scoresAyy[j] && cardScores < 15) scoresAyy.splice(j, 1); //删除不是鬼牌的分
            }
        }

        cardModel.forEach(function (card) {
            if (card.scores >= 20) card.scores = scoresAyy.splice(0, 1)[0];
        }); //找出选中的牌
    } else if (is1) {
            //是1 2 3 4 5

            cardModel.sort(function (a1, a2) {
                return a2.scores - a1.scores;
            });

            var num = 5,
                scoresAyy = []; //一副牌的分数

            for (var i = 0; i < 5; i++) {

                scoresAyy.push(num);

                num -= 1;
            }

            for (var j = 0; j < scoresAyy.length; j++) {

                for (var i = 0; i < cardModel.length; i++) {

                    var cardScores = cardModel[i].scores;

                    if (cardScores == scoresAyy[j] && cardScores < 15) scoresAyy.splice(j, 1); //删除不是鬼牌的分
                }
            }

            cardModel.forEach(function (card) {
                if (card.scores >= 20) card.scores = scoresAyy.splice(0, 1)[0];
            }); //找出选中的牌
        } else {
                cardModel.sort(function (a1, a2) {
                    return a1.scores - a2.scores;
                });

                var scoresAyy = []; //用来装鬼牌分数

                for (var i = 0; i < 5; i++) {

                    var s = parseInt(cardModel[0].scores) + i; //最小的牌的分数

                    scoresAyy.push(s); //一副牌的分数
                }

                for (var j = 0; j < scoresAyy.length; j++) {

                    for (var i = 0; i < cardModel.length; i++) {

                        var cardScores = cardModel[i].scores;

                        if (cardScores == scoresAyy[j] && cardScores < 15) scoresAyy.splice(j, 1); //删除不是鬼牌的分
                    }
                }
                cardModel.forEach(function (card) {
                    if (card.scores >= 20) card.scores = scoresAyy.splice(0, 1)[0];
                }); //改变牌的分数
            }

    cardModel = this._convertOneToA(cardModel);

    cardModel.sort(function (a1, a2) {
        return a1.scores - a2.scores;
    });
    return cardModel;
};

cc._RFpop();
},{}],"time":[function(require,module,exports){
"use strict";
cc._RFpush(module, '458d4VWlwNDT6xQ+pFW8Bby', 'time');
// scripts\time.js

cc.Class({
        "extends": cc.Component,

        properties: {
                leftNode: cc.Node,
                RigthNode: cc.Node,
                _time: null
        },

        // use this for initialization
        onLoad: function onLoad() {},

        setTime: function setTime(time) {

                this.unscheduleAllCallbacks();

                this._time = time;

                this.leftNode.rotation = 0;

                this.RigthNode.rotation = 0;

                this.RigthNode.stopAllActions();

                this.leftNode.stopAllActions();

                this.leftNode.runAction(cc.rotateBy(this._time, -180));

                this.scheduleOnce((function () {

                        this.RigthNode.runAction(cc.rotateBy(this._time, 180));
                }).bind(this), this._time);
        }

});

cc._RFpop();
},{}],"userInfo":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e8d10xRGnJAn42wJsuC6aBi', 'userInfo');
// scripts\userInfo.js

var AudioManager = require('AudioManager');
var Playback = require('Playback');

cc.Class({
  'extends': cc.Component,

  properties: {
    spriteAvatar: cc.Sprite,
    labelNickname: cc.Label,
    labelScore: cc.Label,
    spriteOffline: cc.Sprite,
    voiceNode: cc.Node,
    homeRunNode: cc.Node,
    readyNode: cc.Node,
    beilv: cc.Label,
    shootNodes: [cc.Node],
    bankerNode: cc.Node,
    fangZhuNode: cc.Node,
    qingli: cc.Node,
    id: cc.Label
  },

  // use this for initialization
  onLoad: function onLoad() {
    this.updateScore();
  },

  setqingli: function setqingli() {
    var visible = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

    this.qingli.active = visible != false;
  },

  setReadyNodeVisible: function setReadyNodeVisible() {
    var visible = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

    this.readyNode.active = visible != false;
  },
  setBeilvLabel: function setBeilvLabel(bl) {
    //this.beilv.active = true;
    this.beilv.string = bl ? bl + "倍" : '';
  },

  setFangZhuNodeVisible: function setFangZhuNodeVisible() {
    var visible = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

    this.fangZhuNode.active = visible != false;
  },

  updateScore: function updateScore() {
    var score = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

    if (score >= 0) {
      this.labelScore.string = "+" + score;
    } else {
      this.labelScore.string = "" + score;
    }
  },
  updateUserId: function updateUserId(id) {
    this.id.string = id ? "ID:" + id : "";
  },
  updateNickname: function updateNickname() {
    var nickname = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];

    this.labelNickname.string = nickname;
  },

  updateAvatar: function updateAvatar(avatar) {
    if (avatar.endsWith("png") || avatar.endsWith("jpg") || avatar.endsWith("gif")) {} else {
      //avatar = avatar + ".png";
    }

    cc.loader.load({ url: avatar, type: "jpg" }, (function (err, data) {
      if (err) {
        return;
      }

      var frame = new cc.SpriteFrame(data);
      this.spriteAvatar.spriteFrame = frame;
    }).bind(this));
  },

  setOfflineVisible: function setOfflineVisible() {
    var visible = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

    if (Playback.instance.isPlaybacking()) {
      // 如果是处理回放状态，就不用再处理离线消息了
      return;
    }

    this.spriteOffline.node.active = visible;
  },

  setIsBanker: function setIsBanker() {
    var isBanker = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

    this.bankerNode.active = isBanker;
  },

  playShootAnimation: function playShootAnimation() {
    var toIndex = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

    //let shootNode = this.shootNodes[toIndex];
    //shootNode.active = true;
    //let anim = shootNode.getComponent(cc.Animation);
    //anim.play('shoot').on('finished', function () {
    //  shootNode.active = false;
    //}, this);

    AudioManager.instance.playDaQiang();
  },

  playBulletHoleAnimation: function playBulletHoleAnimation() {
    var bulletHoleNode = this.node.getChildByName('bulletHole');
    bulletHoleNode.active = true;
    var anim = bulletHoleNode.getComponent(cc.Animation);
    anim.play('bulletHole').on('finished', function () {
      bulletHoleNode.active = false;
    }, this);
  },

  playSpeakAnimation: function playSpeakAnimation() {
    this.voiceNode.active = true;
    this.scheduleOnce((function () {
      this.voiceNode.active = false;
    }).bind(this), 4);
  },

  // 播放全垒打动画
  playHomeRunAimation: function playHomeRunAimation() {
    //let alert = this.homeRunNode.getComponent('alert');
    //alert.alert();
    //this.scheduleOnce(function () {
    //  this.homeRunNode.active = false;
    //}.bind(this), 2);
  }
});

cc._RFpop();
},{"AudioManager":"AudioManager","Playback":"Playback"}],"zhuanNumCtrl":[function(require,module,exports){
"use strict";
cc._RFpush(module, '1b0dfWuicJLYJDmjjT1lmQc', 'zhuanNumCtrl');
// scripts\zhuanNumCtrl.js

cc.Class({
    "extends": cc.Component,

    properties: {
        zhuanNumLabel: cc.Label,
        jushu: cc.Node,
        AA: cc.Node,
        _selectedPeopleIndex: null,
        _selectedJushuIndex: null,
        _selectedAAIndex: null
    },

    onLoad: function onLoad() {
        this._ctrl();
    },

    clickPeopleAction: function clickPeopleAction() {
        this._ctrl();
    },

    clickAAAction: function clickAAAction() {
        this._ctrl();
    },

    clickJushuAction: function clickJushuAction() {
        this._ctrl();
    },

    _ctrl: function _ctrl() {
        this._selectedPeopleIndex = this.node.getComponent("singleSelect").selectedIndex;
        this._selectedJushuIndex = this.jushu.getComponent("singleSelect").selectedIndex;
        this._selectedAAIndex = this.AA.getComponent("checkSelect").selectedIndex;
        //人数选2人时且没选上AA制收费
        var renShu = 2;
        if (this._selectedPeopleIndex == 0) {
            renShu = 2;
        } else if (this._selectedPeopleIndex == 1) {
            renShu = 3;
        } else if (this._selectedPeopleIndex == 2) {
            renShu = 4;
        } else if (this._selectedPeopleIndex == 3) {
            renShu = 5;
        }
        var zhuangShi = 20;
        if (this._selectedJushuIndex == 0) {
            zhuangShi = 20;
        } else if (this._selectedJushuIndex == 1) {
            zhuangShi = 40;
        } else if (this._selectedJushuIndex == 2) {
            zhuangShi = 80;
        } else if (this._selectedJushuIndex == 3) {
            zhuangShi = 10;
        }
        //AA
        if (this._selectedAAIndex != null) {
            zhuangShi = Math.ceil(zhuangShi / renShu);
        }
        this.zhuanNumLabel.string = zhuangShi;
        //if(this._selectedPeopleIndex == 0){
        //    if(this._selectedAAIndex == null){
        //局数选10局时
        //if(this._selectedJushuIndex == 0){
        //    this.zhuanNumLabel.string = "10";
        //}
        ////局数选20局时
        //if(this._selectedJushuIndex == 1){
        //    this.zhuanNumLabel.string = "30";
        //}
        ////局数选30局时
        //if(this._selectedJushuIndex == 2){
        //    this.zhuanNumLabel.string = "80";
        //}
        //}
        //    else{
        //        //局数选10局时
        //        if(this._selectedJushuIndex == 0){
        //            this.zhuanNumLabel.string = "8";
        //        }
        //        //局数选20局时
        //        if(this._selectedJushuIndex == 1){
        //            this.zhuanNumLabel.string = "15";
        //        }
        //        //局数选30局时
        //        if(this._selectedJushuIndex == 2){
        //            this.zhuanNumLabel.string = "23";
        //        }
        //    }
        //
        //}
        //人数选3人
        //else if(this._selectedPeopleIndex == 1){
        //    //没选上AA制收费
        //    if(this._selectedAAIndex == null){
        //        //局数选10局时
        //        if(this._selectedJushuIndex == 0){
        //            this.zhuanNumLabel.string = "21";
        //        }
        //        //局数选20局时
        //        if(this._selectedJushuIndex == 1){
        //            this.zhuanNumLabel.string = "42";
        //        }
        //        //局数选30局时
        //        if(this._selectedJushuIndex == 2){
        //            this.zhuanNumLabel.string = "60";
        //        }
        //    }
        //    //选了AA收费
        //    else{
        //        //局数选10局时
        //        if(this._selectedJushuIndex == 0){
        //            this.zhuanNumLabel.string = "7";
        //        }
        //        //局数选20局时
        //        if(this._selectedJushuIndex == 1){
        //            this.zhuanNumLabel.string = "14";
        //        }
        //        //局数选30局时
        //        if(this._selectedJushuIndex == 2){
        //            this.zhuanNumLabel.string = "20";
        //        }
        //    }
        //
        //}
        ////人数选4人且没选上AA制收费
        //else{
        //    if(this._selectedAAIndex == null){
        //        //局数选10局时
        //        if(this._selectedJushuIndex == 0){
        //            this.zhuanNumLabel.string = "28";
        //        }
        //        //局数选20局时
        //        if(this._selectedJushuIndex == 1){
        //            this.zhuanNumLabel.string = "56";
        //        }
        //        //局数选30局时
        //        if(this._selectedJushuIndex == 2){
        //            this.zhuanNumLabel.string = "84";
        //        }
        //    }
        //    //AA制收费选上了
        //    else{
        //        //局数选10局时
        //        if(this._selectedJushuIndex == 0){
        //            this.zhuanNumLabel.string = "7";
        //        }
        //        //局数选20局时
        //        if(this._selectedJushuIndex == 1){
        //            this.zhuanNumLabel.string = "14";
        //        }
        //        //局数选30局时
        //        if(this._selectedJushuIndex == 2){
        //            this.zhuanNumLabel.string = "21";
        //        }
        //    }
        //}
    }
});

cc._RFpop();
},{}]},{},["AudioManager","CardPrefab","CardTypeCombine","CardTypeSprite","ChatMessage","MsgControl","KQGlobalEvent","ArrayExtension","NumberExtension","SpriteHelper","StringExtension","fecha","Invit","GetCardPointsSameCount","KQCard","KQCardColorsHelper","KQCardFindTypeExtension","KQCardPointsHelper","KQCardResHelper","KQCardScoreExtension","KQCardScoretsHelper","KQCardSelectExtension","test","UserModelHelper","NetworkError","ChatTextRecord","CompareCards","Countdown","GameResult","Player","ResultItem","TotalGameResult","TotalGameResultItem","UserSampleInfo","maPai","Playback","Setting","KQGlabolSocketEventHander","KQNativeInvoke","agreement","alert","animation","cardNum","cards","cardsBack","cellText","changInfo","change_mapai","checkSelect","choujiang","create_btn_anima","game","hall","hall_btn_anima","help","inviteCode","joinRoom","launch","login","manager","overTime","play","product","randRoom","record","recordInfo","rule","scale","select","selectMoShi","select_ma","select_mapai","selectbeilv","singleSelect","slider","socket","time","userInfo","zhuanNumCtrl"])
