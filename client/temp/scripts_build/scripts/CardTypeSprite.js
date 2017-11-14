"use strict";
cc._RFpush(module, 'e614c0FMndAtrOMcy8/PcZw', 'CardTypeSprite');
// scripts\CardTypeSprite.js

var KQCard = require('KQCard');
cc.Class({
  'extends': cc.Component,

  properties: {
    _cardName: null,
    _cardModel: null
  },

  // use this for initialization
  onLoad: function onLoad() {},

  setCard: function setCard(cardName, index) {
    var asdf = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

    this._cardName = cardName;
    if (asdf) {
      this._cardModel = new KQCard(cardName, null, index);
    }
    this._loadCardFrame(cardName, (function (spriteFrame) {
      this.node.getComponent('cc.Sprite').spriteFrame = spriteFrame;
    }).bind(this));
  },

  cardName: function cardName() {
    return this._cardName;
  },

  cardMode: function cardMode() {
    return this._cardModel;
  },

  _cardFullName: function _cardFullName(cardShortName) {
    var cardName = cardShortName;
    if (!cardName.startsWith("public-pic-card-poker")) {
      cardName = "public-pic-card-poker-" + cardName;
    }

    return cardName;
  },

  _loadCardFrame: function _loadCardFrame(cardName, callback) {
    cc.assert(callback);

    cc.loader.loadRes("play/CardTypeCombine/pockList", cc.SpriteAtlas, (function (err, atlas) {
      if (err) {
        cc.error(err);
        return;
      }

      cardName = this._cardFullName(cardName);
      var frame = atlas.getSpriteFrame(cardName);
      callback(frame);
    }).bind(this));
  }
});

cc._RFpop();