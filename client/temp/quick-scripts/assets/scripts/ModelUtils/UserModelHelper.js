(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/ModelUtils/UserModelHelper.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '98854aScapF5oQnHKxJsvmF', 'UserModelHelper', __filename);
// scripts/ModelUtils/UserModelHelper.js

"use strict";

var UserModelHelper = {
  // 用户是否已出牌
  isPlayedCards: function isPlayedCards(user) {
    cc.assert(user);

    if (user && user.cardInfo && user.cardInfo.length > 0) {
      return true;
    }

    return false;
  },

  // 用户是否已准备
  isUserReady: function isUserReady(user) {
    return user.readyStatus == true;
  }
};

module.exports = UserModelHelper;

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
        //# sourceMappingURL=UserModelHelper.js.map
        