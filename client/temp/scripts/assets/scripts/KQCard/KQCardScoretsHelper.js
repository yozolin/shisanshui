"use strict";
cc._RFpush(module, '3d3b5YPHXhN44h/B0miZFRE', 'KQCardScoretsHelper');
// scripts\KQCard\KQCardScoretsHelper.js

// 牌点数帮助类
// 用来计算一个牌数组内的相同点数的牌的张数
var KQCardScoretsHelper = function KQCardScoretsHelper(cards) {
    this.pointNumbers = {};
    cards.forEach((function (card) {
        var point = card.scores;
        var number = this.pointNumbers[point] || 0;
        this.pointNumbers[point] = number + 1;
    }).bind(this));
};

// 相同点数牌的最大数量
KQCardScoretsHelper.prototype.maxNumber = function () {
    var result = 0;
    for (var prop in this.pointNumbers) {
        var number = this.pointNumbers[prop];
        //if(number < 20){
        result = Math.max(number, result);
        //}
    }

    return result;
};

module.exports = KQCardScoretsHelper;

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

cc._RFpop();