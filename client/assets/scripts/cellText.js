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
        labelMsg:cc.Label,
    },

    // use this for initialization
    onLoad: function () {

    },

    setText:function(text) {
        this.labelMsg.getComponent(cc.Label).string = text;
    },

    clickAction: function() {
        var text = this.labelMsg.getComponent(cc.Label).string;
        this.onSelectAction(text);
    },

    onSelectAction:function(msg) {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
