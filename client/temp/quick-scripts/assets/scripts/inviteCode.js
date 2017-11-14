(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/inviteCode.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '777f9/eB7RKK4aO7FmNYFgO', 'inviteCode', __filename);
// scripts/inviteCode.js

'use strict';

/**
 * 邀请码
 * @authors 黄成(you@example.org)
 * @date    2017-06-16 09:44:10
 * @version $Id$
 */
var Socket = require('socket');
cc.Class({
  extends: cc.Component,

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
        //# sourceMappingURL=inviteCode.js.map
        