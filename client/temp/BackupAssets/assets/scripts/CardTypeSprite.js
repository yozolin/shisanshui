const KQCard = require('KQCard');
cc.Class({
    extends: cc.Component,

    properties: {
      _cardName: null,
      _cardModel: null,
    },

    // use this for initialization
    onLoad: function () {

    },

    setCard: function (cardName, index, asdf = true) {
      this._cardName = cardName;
      if(asdf){
          this._cardModel = new KQCard(cardName,index);
      }
      this._loadCardFrame(cardName, function (spriteFrame) {
        this.node.getComponent('cc.Sprite').spriteFrame = spriteFrame;
      }.bind(this));
    },

    cardName: function () {
      return this._cardName;
    },

    cardMode: function () {
      return this._cardModel;
    },

    _cardFullName: function (cardShortName) {
      var cardName = cardShortName;
      if (!cardName.startsWith("public-pic-card-poker")) {
        cardName = "public-pic-card-poker-" + cardName;
      }

      return cardName;
    },

    _loadCardFrame: function (cardName, callback) {
      cc.assert(callback);

      cc.loader.loadRes("play/CardTypeCombine/pockList", cc.SpriteAtlas, function (err, atlas) {
        if (err) {
          cc.error(err);
          return;
        }

        cardName = this._cardFullName(cardName);
        var frame = atlas.getSpriteFrame(cardName);
        callback(frame);
      }.bind(this));
    },
});
