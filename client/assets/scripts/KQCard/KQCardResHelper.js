let Helper = {
  loadCardSpriteFrame: function (cardName, callback) {
    this._loadCardFrame(cardName, callback);
  },

  setCardSpriteFrame: function (sprite, cardName) {
    this.loadCardSpriteFrame(cardName, function (spriteFrame) {
      sprite.spriteFrame = spriteFrame;
    });
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
        callback(null, err)
        return;
      }

      cardName = this._cardFullName(cardName);
      var frame = atlas.getSpriteFrame(cardName);
      callback(frame);
    }.bind(this));
  },
};

module.exports = Helper;
