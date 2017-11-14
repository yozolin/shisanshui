(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/create_btn_anima.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'df337riLglP3YcI/IJFXecj', 'create_btn_anima', __filename);
// scripts/create_btn_anima.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...

    },

    // use this for initialization
    onLoad: function onLoad() {},
    loadCardSpriteFrame: function loadCardSpriteFrame(cardName, callback) {
        this._loadCardFrame(cardName, callback);
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
        cc.loader.loadRes("play/hall/public/all_effect_ttw_main", cc.SpriteAtlas, function (err, atlas) {
            if (err) {
                callback(null, err);
                return;
            }
            cardName = this._cardFullName(cardName);
            var frame = atlas.getSpriteFrame(cardName);
            callback(frame);
        }.bind(this));
    },
    test: function test() {}

});

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
        //# sourceMappingURL=create_btn_anima.js.map
        