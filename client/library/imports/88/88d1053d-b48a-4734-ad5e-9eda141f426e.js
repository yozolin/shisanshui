cc.Class({
    'extends': cc.Component,

    properties: {},

    // use this for initialization
    onLoad: function onLoad() {},

    setString: function setString(str) {
        this._richText().string = str;
    },

    _richText: function _richText() {
        return this.node.getComponent('cc.RichText');
    },

    setEmoji: function setEmoji(spraite) {
        this._spriteFrame().Spraite = spraite;
    },
    _spriteFrame: function _spriteFrame() {
        return this.node.getComponent('cc.Sprite');
    }
});