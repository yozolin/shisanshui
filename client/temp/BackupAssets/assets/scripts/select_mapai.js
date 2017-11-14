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
        pai:cc.Node,
        mapai:{
            default:[],
            type:cc.SpriteFrame,
        },
    },

    // use this for initialization
    onLoad: function () {
        this.singleSelect = this.node.getComponent("singleSelect");
        this.singleSelect.onLoad();
        this.com = this.pai.getComponent(cc.Sprite);
    },
    
    clickBtnComfirm:function() {
        this.com.spriteFrame = this.mapai[this.singleSelect.selectedIndex];
        //console.log(this.com.spriteFrame);
    },
    

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
