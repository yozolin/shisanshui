const Socket = require('socket');
const KQGlobalEvent = require('KQGlobalEvent');
const KQGlabolSocketEventHander = require('KQGlabolSocketEventHander');
cc.Class({
    extends: cc.Component,

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
            default: null,
            type: cc.Label
        },
    },

    // use this for initialization
    onLoad: function () {
        KQGlobalEvent.on(Socket.Event.ReceiveHallInfo, this._socketReceiveHallInfo, this);
        cc.log('----61')
         cc.log(this.agreement)
    },
    _socketReceiveHallInfo: function (response) {
        if (!response.result) {
            return;
        }
        var s = cc.find('Canvas/agreement');
        let data = response.data;
        //this._info1 = response.data;
        cc.log(this.agreement)
        cc.log(s)
        cc.log('----61')
        this.agreement.string = data.info1 || "";
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
