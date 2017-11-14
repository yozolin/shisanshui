// 用于在游戏过程中，展示用户的聊天消息

let ChatMessage = cc.Class({
    extends: cc.Component,

    properties: {
        richText: cc.RichText,
        spriteBackground: cc.Sprite,
        emoji:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        ChatMessage.instances = this;
    },

    setString: function (string = "", autoHide = true) {
        if (string.length == 0) {
            return;
        }

        this.node.active = true;
        this.richText.node.active = true;
        this.spriteBackground.node.active = true;
        this.emoji.active = false;
        let maxWidth = 300;
        let realStr = ChatMessage.parseString(string);

        // 由于 cc.RichText 在指定 maxWidth 后，该结点的 width 会一直
        // 是 maxWidth 值。而在将 maxWidth 指定为0时，其 contentSize.width 会
        // 是内容的真正所需的宽度
        //
        // 所以这里先将 maxWidth 设为 0，获取其实际内容 width 后再调整
        this.richText.maxWidth = 0;
        this.richText.string = realStr;

        let contentWidth = this.richText.node.getContentSize().width;
        if (contentWidth > maxWidth) {
            this.richText.maxWidth = maxWidth;
            this.richText.string = realStr;
            contentWidth = maxWidth;
        }

        this.node.width = contentWidth + 28;
        this.node.height = this.richText.node.getContentSize().height + 20;

        this.spriteBackground.node.width = this.node.width;
        this.spriteBackground.node.height = this.node.height;

        if (autoHide) {
            this._hideNode()
            //this.unscheduleAllCallbacks();
            //this.scheduleOnce(this._hideNode.bind(this), 3);
        }
    },

    showEmoji: function (sprite) {
        this._hideNode();
        this.node.active = true;
        this.emoji.active = true;
        this.richText.node.active = false;
        this.spriteBackground.node.active = false;
        var btnSprites =  this.emoji.getComponent(cc.Sprite);
        btnSprites.spriteFrame = sprite;
    },

    _hideNode: function () {
        this.unscheduleAllCallbacks();
        this.scheduleOnce(function(){
            this.node.active = false;
        }.bind(this), 3);
    },

});
ChatMessage.setEmoji = function(sprite){
    this.instances._hideNode();
    this.instances.node.active = true;
    this.instances.emoji.active = true;
    this.instances.richText.node.active = false;
    this.instances.spriteBackground.node.active = false;
    var btnSprites =  this.instances.emoji.getComponent(cc.Sprite);
    btnSprites.spriteFrame = sprite;
    //console.log(this.emoji);
    //return;
    //
    //this.emoji.Sprite = sprite;
},

// 将 <bq10> 改为： <img src='bg10'/>
ChatMessage.parseString = function (str) {
    let result = str.replace(/<bq\d{1,2}>/g, function(match){
        var bq = match.replace("<", " <img src='").replace(">", "'/> ");
        return bq;
    });
    return result;
},

module.exports = ChatMessage;
