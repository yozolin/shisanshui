/**
 * 邀请码
 * @authors 黄成(you@example.org)
 * @date    2017-06-16 09:44:10
 * @version $Id$
 */
const Socket = require('socket');
cc.Class({
    extends: cc.Component,

    properties: {
        labelNumbers: [cc.Label],
        callbackInviteCode: '',
    },

    onLoad: function () {
      this.clickClear(); //清除数字
    },

    clickClear: function () {
      this.labelNumbers.forEach(function (label) {
        label.string = "";
      });
    },

    clickNumber: function (event, number) {
      var label = this._lastEmptyLabel();
      if (label) {
        label.string = number;
       	//cc.log(label.string ,"----------------");
      } else {
        return;
      }
      let isComplete = (this._lastEmptyLabel() == null);
      //cc.log("isComplete-------------", this.callbackInviteCode);
      let inviteNumber = this._inviteNumber();

      if ( inviteNumber.length == 6 ){
        //cc.log(inviteNumber,"--------------------38"); //邀请码
        let userId = Socket.instance.userInfo.id;
        //Socket.sendInviteCode(inviteNumber, userId);
        this.callbackInviteCode = inviteNumber;
      }
    },
    sendCode :function(){  //发送邀请码
      let userId = Socket.instance.userInfo.id;
      let inviteNumber = this.callbackInviteCode;
      //cc.log(inviteNumber,"--------------------38")
      if( inviteNumber && inviteNumber.length==6){  
        Socket.sendInviteCode(inviteNumber, userId);
        this.callbackInviteCode = '';   //清空邀请码
      }
    },
    clickDeleteOne: function () {
      let label = this._lastNumberLabel();
      if (label) {
        label.string = "";
      }
    },

    _lastEmptyLabel: function () {
      for (var index in this.labelNumbers) {
        var label = this.labelNumbers[index];
        if (label.string == null
        || label.string.length <= 0) {
          return label;
        }
      }
      return null;
    },

    _lastNumberLabel: function () {
      for (var index = this.labelNumbers.length - 1; index >= 0; --index) {
        let label = this.labelNumbers[index];
        if (label.string && label.string.length > 0) {
          return label;
        }
      }

      return null;
    },

    _inviteNumber: function () {
      return this.labelNumbers.reduce(function (inviteNumber, label) {
        //cc.log(inviteNumber,"-----------------");
        return inviteNumber + (label.string || "");
      }, "");
    },
})