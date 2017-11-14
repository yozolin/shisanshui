cc.Class({
    "extends": cc.Component,

    properties: {
        content: cc.Node
    },

    onLoad: function onLoad() {
        var visibleSize = cc.director.getVisibleSize();
        var contentSize = {};
        contentSize.width = this.node.width;
        contentSize.height = this.node.height;
        var scaleX = visibleSize.width / contentSize.width;
        var scaleY = visibleSize.height / contentSize.height;
        var scale = Math.min(scaleX, scaleY).toFixed(2);
        this.node.scaleX = scale;
        this.node.scaleY = scale;
    }
});