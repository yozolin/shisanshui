cc.Class({
    extends: cc.Component,

    properties: {
        bgNode:cc.Node,   //选择框
        selectedNode:cc.Node,  //对号
        pai:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        //console.log(this.node);
        this.selected = true;
        //console.log(cc.set);
    },
    
    clickAction:function() {
        this.selected = !this.selected;
        this.selectedNode.active = this.selected;
      
    },
    
    setSelected:function(selected) {
        this.selected = selected;
        this.selectedNode.active = this.selected;
    },
    /*#####*/
    clickSelectKuang:function() {
        this.selected = !this.selected;
        this.selectedNode.active = this.selected;
        cc.from.isUseMa = this.selected;
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
