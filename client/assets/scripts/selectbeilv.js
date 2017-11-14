const KQGlobalEvent = require('KQGlobalEvent');
const Socket = require('socket');
cc.Class({
    extends: cc.Component,

    properties: {
        _userid : 0,
    },

    // use this for initialization
    onLoad: function () {

    },
    clickBeiLv:function(event,num){
        this.node.active = false;
        Socket.sendBeiLv(num,this._userid);
    },
   
});
