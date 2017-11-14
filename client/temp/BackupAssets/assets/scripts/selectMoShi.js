cc.Class({
    extends: cc.Component,

    properties: {
        nodes:[cc.Node],
        //selectedIndex: 0,
        _select:[],
        _selected:0,
    },

    onLoad: function () {
        this._select = ['0','0','0','0','0'];
        var self = this;
        for (var i = 0; i < this.nodes.length; i++) {
            //let isSelected = (this.selectedIndex == i);
            this.nodes[i].getComponent('select').setSelected(false);
            self._select[i] = 0; 
        }
        //console.log(this._select);

        for (var i = 0; i < this.nodes.length; i++) {
            var tComp = this.nodes[i].getComponent('select');
            tComp.index = i;
            tComp.clickAction = function() {
                for (var i = 0; i < self.nodes.length; i++) {
                    var comp = self.nodes[i].getComponent('select');
                }
                this.setSelected( self._selected = !self._selected );
                self._select[this.index] = self._selected;
                self.selectedIndex = this.index;
                self.onSelectChange(this.index);
            };
        }
    },
    onSelectChange: function (selectIndex) {
        //cc.log(selectIndex);
        //console.log(this._select);
    },



});
