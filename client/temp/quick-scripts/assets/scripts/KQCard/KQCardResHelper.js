(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/KQCard/KQCardResHelper.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'be420vtWaJOHoxQcZwP2xN2', 'KQCardResHelper', __filename);
// scripts/KQCard/KQCardResHelper.js

"use strict";

var Helper = {
  loadCardSpriteFrame: function loadCardSpriteFrame(cardName, callback) {
    this._loadCardFrame(cardName, callback);
  },

  setCardSpriteFrame: function setCardSpriteFrame(sprite, cardName) {
    this.loadCardSpriteFrame(cardName, function (spriteFrame) {
      sprite.spriteFrame = spriteFrame;
    });
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

    cc.loader.loadRes("play/CardTypeCombine/pockList", cc.SpriteAtlas, function (err, atlas) {
      if (err) {
        callback(null, err);
        return;
      }

      cardName = this._cardFullName(cardName);
      var frame = atlas.getSpriteFrame(cardName);
      callback(frame);
    }.bind(this));
  }
};

module.exports = Helper;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=KQCardResHelper.js.map
        