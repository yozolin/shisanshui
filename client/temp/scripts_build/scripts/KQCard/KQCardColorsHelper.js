"use strict";
cc._RFpush(module, 'cf1deKQQ4NMMYVV+7xEr9Jf', 'KQCardColorsHelper');
// scripts\KQCard\KQCardColorsHelper.js

// 牌花色帮助类
// 用于计算一个牌数组的花色相同的牌的张数
var KQCardColorsHelper = function KQCardColorsHelper(cards) {
  this.colorNumber = {};

  cards.forEach((function (card) {
    var color = card.color;
    var number = this.colorNumber[color] || 0;
    this.colorNumber[color] = number + 1;
  }).bind(this));
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

cc._RFpop();