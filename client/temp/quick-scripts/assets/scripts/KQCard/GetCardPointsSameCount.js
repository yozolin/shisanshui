(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/KQCard/GetCardPointsSameCount.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '64665arSbVGtqTVZeISv/TD', 'GetCardPointsSameCount', __filename);
// scripts/KQCard/GetCardPointsSameCount.js

'use strict';

/*#####*/
//��������һ���������ڵ���ͬ�������Ƶ�����
var GetCardPointsSameCount = function GetCardPointsSameCount(cards) {
    this.cardNumbers = {};
    for (var i in cards) {
        var s;
        if (typeof cards[i].number == 'undefined') {
            s = cards[i].point;
        } else {
            s = cards[i].number;
        }
        if (this.cardNumbers[s]) {
            this.cardNumbers[s]++;
        } else {
            this.cardNumbers[s] = 1;
        }
        //cc.log(this.cardNumbers[cards[i].number])
        //cc.log(cards)
        //cc.log(cards[i].number)
        //cc.log('---7')
    }
    return this.cardNumbers;
};

module.exports = GetCardPointsSameCount;

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
        //# sourceMappingURL=GetCardPointsSameCount.js.map
        