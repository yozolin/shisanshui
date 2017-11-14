cc.Class({
    extends: cc.Component,

    properties: {
        selectedIndex : 0,
        selectedNode : cc.Node  
    },

    // use this for initialization
    onLoad: function () {
        this.selected = true;
        this.selectedIndex = 0;
        this.selectedNode.active = true;
    },
    clickAction:function(e,data) {
        this.selected = !this.selected;
        this.selectedNode.active = this.selected;
        this.selectedIndex = this.selected?0:null;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
