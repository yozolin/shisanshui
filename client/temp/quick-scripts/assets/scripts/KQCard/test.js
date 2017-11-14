(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/KQCard/test.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f3a5ah1deZEh6HfPdghRXyA', 'test', __filename);
// scripts/KQCard/test.js

"use strict";

undefined._changeCardScors = function (cardModel) {

    cardModel.forEach(function (card) {
        card.scores = card.number;
    });

    cardModel = this._convertOneToA(cardModel);

    var is14 = true; //是A K Q J 10 ;

    var is1 = true; //是1 2 3 4 5

    cardModel.forEach(function (card) {
        if (card.scores < 10) is14 = false;
    }); //不是A K Q J 10

    cardModel.forEach(function (card) {
        if ((card.scores > 5 || card.scores == 14) && card.scores != 20) is1 = false;
    }); //不是1 2 3 4 5});

    if (is14) {
        //是A K Q J 10 ;

        cardModel.sort(function (a1, a2) {
            return a2.scores - a1.scores;
        });

        var num = 14,
            scoresAyy = []; //一副牌的分数

        for (var i = 0; i < 5; i++) {

            scoresAyy.push(num);

            num -= 1;
        }

        for (var j = 0; j < scoresAyy.length; j++) {

            for (var i = 0; i < cardModel.length; i++) {

                var cardScores = cardModel[i].scores;

                if (cardScores == scoresAyy[j] && cardScores < 15) scoresAyy.splice(j, 1); //删除不是鬼牌的分
            }
        }

        cardModel.forEach(function (card) {
            if (card.scores >= 20) card.scores = scoresAyy.splice(0, 1)[0];
        }); //找出选中的牌
    } else if (is1) {
        //是1 2 3 4 5

        cardModel.sort(function (a1, a2) {
            return a2.scores - a1.scores;
        });

        var num = 5,
            scoresAyy = []; //一副牌的分数

        for (var i = 0; i < 5; i++) {

            scoresAyy.push(num);

            num -= 1;
        }

        for (var j = 0; j < scoresAyy.length; j++) {

            for (var i = 0; i < cardModel.length; i++) {

                var cardScores = cardModel[i].scores;

                if (cardScores == scoresAyy[j] && cardScores < 15) scoresAyy.splice(j, 1); //删除不是鬼牌的分
            }
        }

        cardModel.forEach(function (card) {
            if (card.scores >= 20) card.scores = scoresAyy.splice(0, 1)[0];
        }); //找出选中的牌
    } else {
        cardModel.sort(function (a1, a2) {
            return a1.scores - a2.scores;
        });

        var scoresAyy = []; //用来装鬼牌分数

        for (var i = 0; i < 5; i++) {

            var s = parseInt(cardModel[0].scores) + i; //最小的牌的分数

            scoresAyy.push(s); //一副牌的分数
        }

        for (var j = 0; j < scoresAyy.length; j++) {

            for (var i = 0; i < cardModel.length; i++) {

                var cardScores = cardModel[i].scores;

                if (cardScores == scoresAyy[j] && cardScores < 15) scoresAyy.splice(j, 1); //删除不是鬼牌的分
            }
        }
        cardModel.forEach(function (card) {
            if (card.scores >= 20) card.scores = scoresAyy.splice(0, 1)[0];
        }); //改变牌的分数
    }

    cardModel = this._convertOneToA(cardModel);

    cardModel.sort(function (a1, a2) {
        return a1.scores - a2.scores;
    });
    return cardModel;
};

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
        //# sourceMappingURL=test.js.map
        