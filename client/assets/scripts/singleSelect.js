cc.Class({
    extends: cc.Component,

    properties: {
        nodes:[cc.Node],
        selectedIndex: 0,
    },

    /*####*/
    onLoad: function () {
        var self = this;
        var rs = 0;
        var js = 0;
        var sf = 0;
        var bl = 0;
        if(cc.set){
            js = cc.set.setting1;
            rs = cc.set.setting2;
            sf = cc.set.setting4;
            bl = cc.set.setting5;
        }
        for (var i = 0; i < this.nodes.length; i++) {
            let isSelected = (this.selectedIndex == i);
            this.nodes[i].getComponent('select').setSelected(isSelected);
            var index = 0;
            var selectIndex = this.selectedIndex ;
            this.nodes[i].getChildByName('title').color = new cc.Color(255,255,255);
            if( selectIndex == i){
                this.nodes[selectIndex].getChildByName("title").color = new cc.Color(13,210,222);
            }
        }
        for (var i = 0; i < this.nodes.length; i++) {
            var tComp = this.nodes[i].getComponent('select');
            tComp.index = i;

            tComp.clickAction = function() {
                for (var i = 0; i < self.nodes.length; i++) {
                    var comp = self.nodes[i].getComponent('select');
                    comp.setSelected(false);
                }
                var Peers = this.node.parent.children;  // 同辈节点
                var index = 0;
                for(var a=0; a<Peers.length; a++){
                    if( Peers[a].children.length>0 ){            // 如果同辈有子节点 处理子节点文字的颜色
                        var title = Peers[a].getChildByName("title");
                        title.color = new cc.Color(255,255,255);
                    }
                }
                this.node.getChildByName('title').color = new cc.Color(13,210,222);
                //this.node.children[index].color = new cc.Color(13,210,222);
                this.setSelected(true);
                self.selectedIndex = this.index;
                self.onSelectChange(this.index);
            };
        }
        if( this.node._name == "renshu" && cc.set ){
            console.log(rs);
            this.remember_set(rs);
        }
        if( this.node._name == "jushu" && cc.set ){
            this.remember_set(js);
        }
        if( this.node._name == "cards" && cc.set ){
            this.remember_set(sf);
        }
        if( this.node._name == "beiLv" && cc.set ){
            this.remember_set(bl);
        }
    },
    remember_set:function(num){
        this.selectedIndex = num;
        for(var i = 0; i < this.nodes.length; i++){
            let isSelected = (num == i);
            this.nodes[i].getComponent('select').setSelected(isSelected);
            var index = 0;
            this.nodes[i].getChildByName('title').color = new cc.Color(255,255,255);
            if( num == i){
                // if( this.nodes[num].children[0].name == "title" ){
                //     index = 0;
                // }else if(this.nodes[num].children[1].name == "title"){
                //     index =1;
                // }
                this.nodes[num].getChildByName('title').color = new cc.Color(13,210,222);
            }

        }
    },

    onSelectChange: function (selectIndex) {


    },
    
});
