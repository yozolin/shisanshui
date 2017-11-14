cc.Class({
    extends: cc.Component,

    properties: {
        nodes:[cc.Node],
        selectedIndex: 0,
        _select:[],
        _selected:0,
        beilv:cc.Node,  // 倍率
        _blShow:0,      // 倍率的显示状态
    },

    onLoad: function () {
        this.beilv.active = this._blShow;
        this._select = [1,1,1,0,0]; 
        if(cc.set){  // 记录上一句的房间情况
            this._select = cc.set['setting3'];
        }
        var self = this;
        for (var i = 0; i < this.nodes.length; i++) {
            var active = this._select[i];
            this.nodes[i].getComponent('select').setSelected(active);
            var title = this.nodes[i].getChildByName('title');
            if(this._select[i]){
                title.color = new cc.Color(13,210,222);
            }else{
                title.color = new cc.Color(255,255,255);
            }
            if(i==3){
                this.beilv.active = (this._blShow = this._select[3]);
            }
        }

        for (var i = 0; i < this.nodes.length; i++) {
            var tComp = this.nodes[i].getComponent('select');
            tComp.index = i;
            tComp.clickAction = function() {
                var index = this.index;
                for (var i = 0; i < self.nodes.length; i++) {
                    var comp = self.nodes[i].getComponent('select');
                }
                this.setSelected( self._select[index] = !self._select[index] );
                if( this.index == 3 ){                      // 第三个是庄家模式，庄家模式显示倍率
                    self.beilv.active = (this._blShow = self._select[3]);
                }

                self._select[index] = self._select[index];
                self.selectedIndex = index;
                self.onSelectChange(index);

                var title = this.node.children[0];
                if( self._select[index] ){             // 如果当前选项为TRUE 则显示青色
                    title.color = new cc.Color(13,210,222);
                }else{                                      // 反之 白色
                    title.color = new cc.Color(255,255,255);
                }
            };
        }
    },
    onSelectChange: function (selectIndex) {
        //cc.log(selectIndex);
        //console.log(this._select);
    },



});
