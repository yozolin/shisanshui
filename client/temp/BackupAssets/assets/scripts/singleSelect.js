cc.Class({
    extends: cc.Component,

    properties: {
        nodes:[cc.Node],
        selectedIndex: 0,
    },
/*原来的*/
/*    onLoad: function () {
        var self = this;
        for (var i = 0; i < this.nodes.length; i++) {
            let isSelected = (this.selectedIndex == i);
            this.nodes[i].getComponent('select').setSelected(isSelected);
        }
        for (var i = 0; i < this.nodes.length; i++) {
            var tComp = this.nodes[i].getComponent('select');
            tComp.index = i;
            tComp.clickAction = function() {
                for (var i = 0; i < self.nodes.length; i++) {
                    var comp = self.nodes[i].getComponent('select');
                    comp.setSelected(false);
                }
                this.setSelected(true);
                self.selectedIndex = this.index;
                self.onSelectChange(this.index);
            };
        }
    },
*/
    /*####*/
    onLoad: function () {
        var self = this;
        for (var i = 0; i < this.nodes.length; i++) {
            let isSelected = (this.selectedIndex == i);
            this.nodes[i].getComponent('select').setSelected(isSelected);
        }
        for (var i = 0; i < this.nodes.length; i++) {
            var tComp = this.nodes[i].getComponent('select');
            tComp.index = i;
            tComp.clickAction = function() {
                for (var i = 0; i < self.nodes.length; i++) {
                    var comp = self.nodes[i].getComponent('select');
                    comp.setSelected(false);
                }
                this.setSelected(true);
                self.selectedIndex = this.index;
                self.onSelectChange(this.index);
            };
        }
    },
    onSelectChange: function (selectIndex) {
        cc.log(selectIndex);
    },
    
});
