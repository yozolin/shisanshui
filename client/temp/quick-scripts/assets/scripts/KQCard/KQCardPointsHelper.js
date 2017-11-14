(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/KQCard/KQCardPointsHelper.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '42d3e866XhHdbkspy3Qytap', 'KQCardPointsHelper', __filename);
// scripts/KQCard/KQCardPointsHelper.js

"use strict";

// 牌点数帮助类
// 用来计算一个牌数组内的相同点数的牌的张数
var KQCardPointsHelper = function KQCardPointsHelper(cards) {
    this.pointNumbers = {};
    cards.forEach(function (card) {
        var point = card.point;
        var number = this.pointNumbers[point] || 0;
        this.pointNumbers[point] = number + 1;
    }.bind(this));
};

// 相同点数牌的最大数量
KQCardPointsHelper.prototype.maxNumber = function () {
    var result = 0;
    for (var prop in this.pointNumbers) {
        var number = this.pointNumbers[prop];
        //if(number < 20){
        result = Math.max(number, result);
        //}
    }

    return result;
};

module.exports = KQCardPointsHelper;

/*var cards = [
    {'suit':'s',number:2},
    {'suit':'s',number:2},
    {'suit':'s',number:4},
    {'suit':'s',number:4},
    {'suit':'s',number:6},
    {'suit':'s',number:6},
    {'suit':'s',number:8},
    {'suit':'s',number:8},
    {'suit':'s',number:10},
    {'suit':'s',number:10},
    {'suit':'s',number:12},
    {'suit':'s',number:12},
    {'suit':'s',number:14}
];
var test = new KQCardPointsSame(cards);
console.log(test);*/

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
        //# sourceMappingURL=KQCardPointsHelper.js.map
        