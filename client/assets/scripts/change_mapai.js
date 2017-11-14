cc.Class({
    extends: cc.Component,

    properties: {
        
        mPtitle:cc.Label,
        _cards:[],
        renshuSelect:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        var hs = 3;
        var ds = 5;
        if(cc.set){
            hs = cc.set.setting7[0];
            ds = cc.set.setting7[1];
        }
        this._cards = [hs,ds];
         this.mp(hs,ds);
    },
    change: function(){
        var selectedIndex = this.renshuSelect.getComponent('singleSelect').selectedIndex;
        var hs = Math.ceil( (Math.random()*40)/10 );    //获取一个1~4的数字，代表花色
        var ds = Math.ceil( (Math.random()*130)/10 );   //获取一个1~13的数字，代表点数
        var card = [hs,ds];
        this._cards = card;
        this.mp(hs,ds,selectedIndex)
    },
    mp: function(h,d,index){
        var ma = "单码";
        var hs = [ "方块","梅花","红桃","黑桃"];
        var ds = [ "1","2","3","4","5","6","7","8","9","10","J","Q","K" ];
        if(index){  
            var defaultMa = 4;
            if(h >= (defaultMa-index+1) ){
                ma = "双码";
            }
        }
        this.mPtitle.string = hs[h-1]+ds[d-1]+ma;
   },
});
