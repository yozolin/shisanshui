(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/KQCard/KQCardSelectExtension.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '66642YNpFVIzb+JM2CkwEgS', 'KQCardSelectExtension', __filename);
// scripts/KQCard/KQCardSelectExtension.js

'use strict';

var KQCard = require('KQCard');
var KQCardFindTypeExtension = require('KQCardFindTypeExtension');

// 牌自动选择的扩展

/**
 * 自动选择牌，由大到小
 *
 * @param  {[KQCard]} originCards  被选择的原始牌数组
 *
 * @return {[KQCard]}
 */
KQCard.autoSelectCards = function (originCards, maxLength) {
    if (originCards.length <= maxLength) {
        return originCards;
    }
    originCards.forEach(function (card) {
        if (card.scores == 1) {
            card.scores = 14;
        }
    });
    var cards = originCards.slice().sort(function (a, b) {
        return a.scores - b.scores;
    });

    var findFuncs = [KQCard.findWuTong, KQCard.findTongHuaShun, KQCard.findTieZhi, KQCard.findHuLu, KQCard.findTongHua, KQCard.findShunZi, KQCard.findSanTiao, KQCard.findLiaDui, KQCard.findDuiZi];

    var indexArrays = null;
    for (var i = 0; i < findFuncs.length; ++i) {
        var func = findFuncs[i];
        indexArrays = func.bind(KQCard)(cards);
        if (indexArrays && indexArrays.length > 0) {
            break;
        }
    }

    var indexs = [];
    if (indexArrays && indexArrays.length > 0) {
        // 找出同类型的牌里的分数最大的牌
        var maxScore = 0;
        indexArrays.forEach(function (tempIndexs) {
            var tempCards = tempIndexs.map(function (index) {
                return cards[index];
            });
            var score = KQCard.scoreOfCards(tempCards);
            if (score > maxScore) {
                maxScore = score;
                indexs = tempIndexs;
            }
        });
    }

    var targetCards = indexs.map(function (index) {
        return cards[index];
    });

    /*if (targetCards.length < maxLength) {
     cards = cards.kq_excludes(targetCards);
     while(targetCards.length < maxLength) {
     targetCards.push(cards.pop());
     }
     } else */if (targetCards.length > maxLength) {
        targetCards = targetCards.slice(0, maxLength);
    }

    return targetCards || [];
};

KQCard.testAutoSelect = function (cards) {};

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
        //# sourceMappingURL=KQCardSelectExtension.js.map
        