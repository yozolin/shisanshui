(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Extensions/SpriteHelper.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '936f2uPA8NAuqUZv0R8ZxgP', 'SpriteHelper', __filename);
// scripts/Extensions/SpriteHelper.js

"use strict";

var SpriteHelper = {
  setImageUrl: function setImageUrl(sprite, url) {
    if (url.endsWith("png") || url.endsWith("jpg") || url.endsWith("gif")) {} else {
      //url = url + ".png";
    }

    cc.loader.load({ url: url, type: "jpg" }, function (err, data) {
      if (err) {
        return;
      }

      var frame = new cc.SpriteFrame(data);
      sprite.spriteFrame = frame;
    });
  }
};

module.exports = SpriteHelper;

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
        //# sourceMappingURL=SpriteHelper.js.map
        