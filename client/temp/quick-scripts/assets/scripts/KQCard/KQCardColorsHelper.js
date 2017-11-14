(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/KQCard/KQCardColorsHelper.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'cf1deKQQ4NMMYVV+7xEr9Jf', 'KQCardColorsHelper', __filename);
// scripts/KQCard/KQCardColorsHelper.js

"use strict";

// 牌花色帮助类
// 用于计算一个牌数组的花色相同的牌的张数
var KQCardColorsHelper = function KQCardColorsHelper(cards) {
  this.colorNumber = {};

  cards.forEach(function (card) {
    var color = card.color;
    var number = this.colorNumber[color] || 0;
    this.colorNumber[color] = number + 1;
  }.bind(this));
};

// 相同花色的牌的最大数量
KQCardColorsHelper.prototype.maxNumber = function () {
  var result = 0;
  for (var prop in this.colorNumber) {
    var number = this.colorNumber[prop];
    result = Math.max(number, result);
  }

  return result;
};

module.exports = KQCardColorsHelper;

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
        //# sourceMappingURL=KQCardColorsHelper.js.map
        