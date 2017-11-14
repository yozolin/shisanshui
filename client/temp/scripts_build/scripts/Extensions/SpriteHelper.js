"use strict";
cc._RFpush(module, '936f2uPA8NAuqUZv0R8ZxgP', 'SpriteHelper');
// scripts\Extensions\SpriteHelper.js

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

cc._RFpop();