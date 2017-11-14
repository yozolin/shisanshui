cc.Class({
    "extends": cc.Component,

    properties: {
        indicatorNode: cc.Node,
        backgroundNode: cc.Node,
        selectedNode: cc.Node,

        value: 0
    },

    // use this for initialization
    onLoad: function onLoad() {
        var self = this;
        this.indicatorNode.on(cc.Node.EventType.TOUCH_START, function (event) {});
        this.indicatorNode.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            var pt = self.node.convertToNodeSpace(cc.v2(event.getLocationX(), event.getLocationY()));
            self.updateSlider(pt);
        });
        this.indicatorNode.on(cc.Node.EventType.TOUCH_END, function (event) {
            var pt = self.node.convertToNodeSpace(cc.v2(event.getLocationX(), event.getLocationY()));
            self.updateSlider(pt);
        });
        this.indicatorNode.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            var pt = self.node.convertToNodeSpace(cc.v2(event.getLocationX(), event.getLocationY()));
            self.updateSlider(pt);
        });

        //this.maxWidth = this.node.width - 40;
        this.maxWidth = this.node.width - 28;
        this.setValue(this.value);
    },

    updateSlider: function updateSlider(pt) {
        var x = pt.x;
        if (x < 0) {
            x = 0;
        }

        if (x > this.maxWidth) {
            x = this.maxWidth;
        }
        this.setValue(x / this.maxWidth);
        this.onValueChange(this.value);
    },

    /*0 - 1*/
    setValue: function setValue(value) {
        this.value = value;
        if (this.value < 0) {
            this.value = 0;
        }
        if (this.value > 1) {
            this.value = 1;
        }
        //this.maxWidth = this.node.width - 38;
        this.maxWidth = this.node.width - 28;
        this.indicatorNode.x = this.value * this.maxWidth + 10;
        this.selectedNode.width = this.value * this.maxWidth + this.indicatorNode.width / 2;
    },

    onValueChange: function onValueChange(value) {
        cc.log(value);
    }
});