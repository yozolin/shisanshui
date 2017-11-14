cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {

    },

    setString: function (str) {
      this._richText().string = str;
    },

    _richText: function () {
      return this.node.getComponent('cc.RichText');
    },
    
    setEmoji:function(spraite){
        this._spriteFrame().Spraite = spraite;
    },
    _spriteFrame:function(){
        return this.node.getComponent('cc.Sprite');
    },
});
