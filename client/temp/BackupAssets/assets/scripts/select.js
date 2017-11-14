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
        bgNode:cc.Node,   //选择框
        selectedNode:cc.Node,  //对号
        pai:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.selected = true;
    },
    
    clickAction:function() {
        this.selected = !this.selected;
        this.selectedNode.active = this.selected;
    },
    
    setSelected:function(selected) {
        this.selected = selected;
        this.selectedNode.active = this.selected;
    },

    /*我写的*/
    clickSelectKuang:function() {
        //console.log(this._maPai);
        this.selected = !this.selected;
        this.selectedNode.active = this.selected;
        cc.from.isUseMa = this.selected;
        //var mapai = cc.find("Canvas/create_room/create_room_bg/pai");
        var mapaiCom = this.pai.getComponent(cc.Button);
        if(this.selectedNode.active === false){
            mapaiCom.interactable = false;
        }else{
            mapaiCom.interactable = true;
        }
    },


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
