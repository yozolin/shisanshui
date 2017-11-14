(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/joinRoom.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd5dcb9CJvpPJpnsCQ/q197x', 'joinRoom', __filename);
// scripts/joinRoom.js

"use strict";

cc.Class({
  extends: cc.Component,

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

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=joinRoom.js.map
        