const Socket = require('socket');
cc.Class({
    extends: cc.Component,

    properties: {
        labelNumbers: [cc.Label],
        callbackJoinRoom: null,
    },

    // use this for initialization
    onLoad: function () {
      this.clickClear();
    },

    clickNumber: function (event, number) {
      var label = this._lastEmptyLabel();
      if (label) {
        label.string = number;
      } else {
        return;
      }
      let isComplete = (this._lastEmptyLabel() == null);
      let inviteNumber = this._roomNumber();
      if (inviteNumber.length == 6) {
        this.callbackJoinRoom = inviteNumber;
      }
    },

    sendCode :function(){  //发送邀请码
      let userId = Socket.instance.userInfo.id;
      let inviteNumber = this.callbackJoinRoom;
      console.log(inviteNumber ,"------------------------");
      if( inviteNumber.length==6){  
        Socket.sendInviteCode(inviteNumber, userId);
        this.callbackJoinRoom = '';   //清空邀请码
      }
    },

    clickClear: function () {
      this.callbackJoinRoom = '';
      this.labelNumbers.forEach(function (label) {
        label.string = "";
      });
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

    _roomNumber: function () {
      return this.labelNumbers.reduce(function (roomNumber, label) {
        return roomNumber + (label.string || "");
      }, "");
    },
});
