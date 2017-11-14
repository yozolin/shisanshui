var socket = require("socket");
cc.Class({
    extends: cc.Component,

    properties: {
        option:{
            default:[],
            type:cc.Node
        },
    },

    // use this for initialization
    onLoad: function () {

    },
    
    clickBtnchoujiang:function() {
        for(var i=0;i<this.option.length;i++){
            this.option[i].opacity = 255;
        }
        var index = 0;
        this._tishi = this.node.getChildByName("choujiang_bg").getChildByName("tishi");
        this._card_num = cc.find("Canvas/user/shop_bg/card_num");
        var comp = this._card_num.getComponent(cc.Label);
        this.callback = function(){
                if(index == 0){
                    this.option[index].opacity = 128;
                    this.option[this.option.length-1].opacity = 255;
                }else if(index == 1){
                    this.option[index].opacity = 128;
                    this.option[index - 1].opacity = 255;
                }else{
                    this.option[index].opacity = 128;
                    this.option[index-1].opacity = 255;
                }
                index ++;
                if(index == this.option.length){
                    index = 0;
                }
            };
        if(comp.string < 20) {
            this._tishi.active = true;
        }else{
            //choujiang
            this.schedule(this.callback,0.05);
            this.schedule(function(){
                this.unschedule(this.callback);
                for(var i=0;i<this.option.length;i++){
                    this.option[i].opacity = 255;
                }
                var i = Math.floor(Math.random() * 12);
                this.option[i].opacity = 128;
            },3,0,1);
        }
        
    },
    
    //***
    clickBtnComfirm:function() {
        this._tishi.active = false;
        //this.node.active = false;
    },
    //****

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
