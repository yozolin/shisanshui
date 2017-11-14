cc.Class({
    extends: cc.Component,

    properties: {
       teshupai_min:[cc.Node],
       teshupai_max:[cc.Node],
    },

    // use this for initialization
    onLoad: function () {
        var liuDuiBan = true;
        for(var i=0;i<this.teshupai_min.length;i++){
            this.teshupai_min[i].active = false;
            this.teshupai_max[i].active = false;
        }
        if(liuDuiBan){
            this.teshupai_min[0].active = true;
            this.teshupai_max[0].active = true;
        }else if(sanShunZi){
            this.teshupai_min[1].active = true;
            this.teshupai_max[1].active = true;
        }else if(sanTongHua){
            this.teshupai_min[2].active = true;
            this.teshupai_max[2].active = true;
        }else if(yiTiaoLong){
            this.teshupai_min[3].active = true;
            this.teshupai_max[3].active = true;
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
