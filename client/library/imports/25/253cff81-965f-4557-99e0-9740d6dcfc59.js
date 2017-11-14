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