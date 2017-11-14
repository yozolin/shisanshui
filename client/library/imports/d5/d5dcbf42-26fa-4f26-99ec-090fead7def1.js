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