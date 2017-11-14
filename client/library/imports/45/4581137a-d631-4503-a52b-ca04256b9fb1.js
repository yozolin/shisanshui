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