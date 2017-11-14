// 牌花色帮助类
// 用于计算一个牌数组的花色相同的牌的张数
var KQCardColorsHelper = function (cards) {
  this.colorNumber = {};

  cards.forEach(function (card) {
    let color = card.color;
    var number = this.colorNumber[color] || 0;
    this.colorNumber[color] = number + 1;
  }.bind(this));
};

// 相同花色的牌的最大数量
KQCardColorsHelper.prototype.maxNumber = function () {
  var result = 0;
  for (let prop in this.colorNumber) {
    let number = this.colorNumber[prop];
    result = Math.max(number, result);
  }

  return result;
};

module.exports = KQCardColorsHelper;
