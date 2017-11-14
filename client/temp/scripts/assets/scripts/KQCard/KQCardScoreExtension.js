"use strict";
cc._RFpush(module, '3f5d8wDA+tMPbPd/k4hBAAR', 'KQCardScoreExtension');
// scripts\KQCard\KQCardScoreExtension.js

var KQCard = require('KQCard');
var KQCardFindTypeExtension = require('KQCardFindTypeExtension');
var KQCardColorsHelper = require('KQCardColorsHelper');
var KQCardScoretsHelper = require('KQCardScoretsHelper');
var GetCardPointsSameCount = require('GetCardPointsSameCount');
var KQCardPointsHelper = require('KQCardPointsHelper');

KQCard.scoreOfCards = function (cards) {
  if (cards == null || cards.length == null) {
    cards = [];
  }

  var isTou = cards.length == 3;
  var typeScore = KQCard._typeScoreOfCards(cards);
  var caleCards = KQCard._convertOneToA(cards.slice());
  caleCards.forEach(function (card) {
    if (card.scores == 1) {
      card.scores = 14;
    }
  });
  //caleCards = KQCard.Sort(caleCards);
  var card20 = KQCard.contain20(caleCards);
  var pointHelper = new KQCardScoretsHelper(caleCards.kq_excludes(card20));
  var maxNum = pointHelper.maxNumber() /*-card20.length == 0 ? 1: pointHelper.maxNumber()-card20.length*/;

  var maxScore = 0; //获取除鬼牌外最大的的点数
  for (var i in pointHelper.pointNumbers) {
    if (parseInt(i) > maxScore && pointHelper.pointNumbers[i] == maxNum) {
      maxScore = parseInt(i);
    }
  }
  caleCards.forEach(function (card) {
    if (card.scores >= 20) {
      card.scores = maxScore;
    }
  });
  card20.forEach(function (card) {
    card.scores = maxScore;
  });
  //cc.log(maxNum)
  //cc.log(maxScore)
  //cc.log(caleCards.kq_excludes(card20))
  //cc.log('----35')
  caleCards.sort(KQCard.sort);
  if (typeScore == 9000000000000000) {
    //五同
    caleCards.sort(function (a1, a2) {
      return a2.scores - a1.scores;
    });
    var totalValue = "";
    //var totalColor = "";
    for (var i in caleCards) {
      var s = caleCards[i].scores;
      //var c = caleCards[i].color;
      totalValue = (parseInt(s) >= 10 ? s : "0" + s) + totalValue;
      //totalColor = c+totalColor;
    }
    //totalValue = totalValue+totalColor;
    //cc.log(totalValue)
    //cc.log(parseInt(totalValue))
    //cc.log(typeScore+parseInt(totalValue))
    return typeScore + parseInt(totalValue);
  } else if (typeScore == 8000000000000000) {
    //同花顺比最大的那张，如果两张相同那就是相同
    if (card20.length > 0) {
      //有鬼牌的时候要改变鬼牌的分数
      caleCards = KQCard._changeCardScors(caleCards);
    }
    var totalValue = "";
    var valueColor = ""; //牌色
    for (var i in caleCards) {
      var s = caleCards[i].scores;
      totalValue = (parseInt(s) >= 10 ? s : "0" + s) + totalValue;
      var c = caleCards[i].color; //牌色
      valueColor = c + valueColor; //牌色
    }
    if (cc.huaSe == 0) return typeScore + parseInt(totalValue);
    return typeScore + parseInt(totalValue + valueColor);
  } else if (typeScore == 7000000000000000) {
    //铁支,找出那四张是什么牌

    var str = "";
    var oneValue = "";
    var valueColor = ""; //牌色
    var oneValueColor = ""; //牌色
    for (var w in caleCards) {
      if (maxScore == caleCards[w].scores) {
        //三条
        var s = caleCards[w].scores;
        str = (parseInt(s) >= 10 ? s : "0" + s) + str;

        var c = caleCards[w].color; //牌色
        valueColor = c + valueColor; //牌色
      } else {
          var s = caleCards[w].scores;
          oneValue = (parseInt(s) >= 10 ? s : "0" + s) + oneValue;

          var c = caleCards[w].color; //牌色
          oneValueColor = c + oneValueColor; //牌色
        }
    }
    //if(cc.huaSe == 0) return typeScore+parseInt(str+oneValue);
    //var qwe = '';
    //qwe = oneValueColor.substr(0,oneValueColor.length -1);
    //oneValueColor = oneValueColor.substr(oneValueColor.length -1);
    //str = str+oneValue + oneValueColor + valueColor + qwe;
    //return typeScore+parseInt(str);
    return typeScore + parseInt(str + oneValue);
  } else if (typeScore == 6000000000000000) {
    //葫芦
    var str = "";
    var oneValue = "";
    var valueColor = ""; //牌色
    var oneValueColor = ""; //牌色
    for (var w in caleCards) {
      if (maxScore == caleCards[w].scores) {
        //三条
        var s = caleCards[w].scores;
        str = (parseInt(s) >= 10 ? s : "0" + s) + str;

        var c = caleCards[w].color; //牌色
        valueColor = c + valueColor; //牌色
      } else {
          var s = caleCards[w].scores;
          oneValue = (parseInt(s) >= 10 ? s : "0" + s) + oneValue;

          var c = caleCards[w].color; //牌色
          oneValueColor = c + oneValueColor; //牌色
        }
    }

    if (isTou) {
      oneValue = oneValue + '0000';
      oneValueColor = oneValueColor + '00';
    }
    return typeScore + parseInt(str + oneValue);
    //if(cc.huaSe == 0) return typeScore+parseInt(str+oneValue);
    //str = str+oneValue + valueColor + oneValueColor;
    //return typeScore+parseInt(str);
  } else if (typeScore == 5000000000000000) {
      //同花,有可能需要比5张牌
      var totalScore = "";
      var totalColor = "";
      //var colors = 0;//获取牌的类型颜色
      //for(var i in caleCards) {
      //  if(parseInt(caleCards[i].point) < 20){
      //    colors = parseInt(caleCards[i].color);
      //    break;
      //  }
      //}

      for (var i in caleCards) {
        var paiPoint = parseInt(caleCards[i].point);
        var colors = parseInt(caleCards[i].point) < 20 ? caleCards[i].color : 5;
        totalColor = colors + totalColor;
        totalScore = (paiPoint >= 10 ? paiPoint : "0" + paiPoint) + totalScore;
      }
      return typeScore + parseInt(totalScore);
      //if(cc.huaSe == 0) return typeScore+parseInt(totalScore);
      //return typeScore+parseInt(totalScore+totalColor);
    } else if (typeScore == 4000000000000000) {
        //顺子
        if (card20.length > 0) {
          //有鬼牌的时候要改变鬼牌的分数
          caleCards = KQCard._changeCardScors(caleCards);
        }
        var totalValue = "";
        var valueColor = ""; //牌色
        for (var i in caleCards) {
          var s = caleCards[i].scores;
          totalValue = (parseInt(s) >= 10 ? s : "0" + s) + totalValue;

          var c = caleCards[i].color; //牌色
          valueColor = c + valueColor; //牌色
        }
        return typeScore + parseInt(totalValue);
        //if(cc.huaSe == 0) return typeScore+parseInt(totalValue);
        //return typeScore+parseInt(totalValue + valueColor);
      } else if (typeScore == 3000000000000000) {
          //三条，找出是哪张牌有3张
          //caleCards.sort(KQCard.sort);
          var str = "";
          var oneValue = "";
          var valueColor = ""; //牌色
          var oneValueColor = ""; //牌色
          var oneValueColor20 = ""; //牌色
          for (var w in caleCards) {
            if (maxScore == caleCards[w].scores) {
              //三条
              var s = caleCards[w].scores;
              str = (parseInt(s) >= 10 ? s : "0" + s) + str;

              var c = caleCards[w].color; //牌色
              valueColor = c + valueColor; //牌色
            } else {
                var s = caleCards[w].scores;
                oneValue = (parseInt(s) >= 10 ? s : "0" + s) + oneValue;

                var c = caleCards[w].color; //牌色
                if (parseInt(s) < 20) {
                  oneValueColor = c + oneValueColor; //牌色
                } else {
                    oneValueColor20 = c + oneValueColor20; //牌色
                  }
              }
          }
          if (isTou) {
            oneValue = oneValue + '0000';
            valueColor = valueColor + '00';
          }
          return typeScore + parseInt(str + oneValue);
          //if(cc.huaSe == 0) return typeScore+parseInt(str+oneValue);
          //str = str+oneValue + oneValueColor + valueColor + oneValueColor20;
          //return typeScore+parseInt(str);
        } else if (typeScore == 2000000000000000) {
            //caleCards.sort(KQCard.sort);
            //两对,有可能需要比5张牌
            var str = "";
            var oneValue = '';
            var valueColor = ""; //牌色
            var oneValueColor = ""; //牌色
            for (var i in pointHelper.pointNumbers) {
              if (pointHelper.pointNumbers[i] == 2) {
                //两对
                for (var w in caleCards) {
                  if (i == caleCards[w].scores) {
                    var s = caleCards[w].scores;
                    str = (parseInt(s) >= 10 ? s : "0" + s) + str;
                    var c = caleCards[w].color; //牌色
                    valueColor = c + valueColor; //牌色
                  }
                }
              } else {
                  for (var q in caleCards) {
                    //单张加花色
                    if (i == caleCards[q].scores) {
                      var s = caleCards[q].scores;
                      oneValue = (parseInt(s) >= 10 ? s : "0" + s) + oneValue;

                      var c = caleCards[q].color; //牌色
                      oneValueColor = oneValueColor + c; //牌色
                    }
                  }
                }
            }
            return typeScore + parseInt(str + oneValue);
            //if(cc.huaSe == 0) return typeScore+parseInt(str+oneValue);
            ////cc.log(str)
            ////cc.log(oneValue)
            //str = str+oneValue +oneValueColor + valueColor;
            //return typeScore+parseInt(str);
          } else if (typeScore == 1000000000000000) {
              //对子
              //caleCards.sort(KQCard.sort);
              var str = "";
              var oneValue = "";
              var oneValueColor = "";
              var valueColor = "";

              if (card20.length > 0) {
                caleCards.sort(function (card1, card2) {
                  return card2.point - card1.point;
                });
                caleCards = caleCards.kq_excludes(card20);
                caleCards.forEach(function (card, index) {
                  var s = card.scores;
                  var c = card.color;
                  str = str + (parseInt(s) >= 10 ? s : "0" + s);
                  if (index == 0) {
                    var s20 = card20[0].scores;
                    str = str + (parseInt(s20) >= 10 ? s20 : "0" + s20);
                    valueColor = valueColor + c;
                    valueColor = valueColor + card20[0].color;
                  } else {
                    oneValueColor = oneValueColor + c;
                  }
                });
                //cc.log(str)
                //cc.log('--------274')
                if (isTou) {
                  str = str + '0000';
                  valueColor = valueColor + '00';
                }
                return typeScore + parseInt(str);
                //if(cc.huaSe == 0) return typeScore+parseInt(str);
                //str = str + oneValueColor + valueColor;
                //return typeScore+parseInt(str);
              }

              for (var i in pointHelper.pointNumbers) {
                if (pointHelper.pointNumbers[i] == maxNum) {
                  //对子
                  for (var w in caleCards) {
                    //对子加花色
                    if (i == caleCards[w].scores) {
                      var s = caleCards[w].scores;
                      valueColor = caleCards[w].color + valueColor;
                      str = (parseInt(s) >= 10 ? s : "0" + s) + str;
                    }
                  }
                } else {
                  for (var q in caleCards) {
                    //单张加花色
                    if (i == caleCards[q].scores) {
                      var s = caleCards[q].scores;
                      oneValueColor = caleCards[q].color + oneValueColor;
                      oneValue = (parseInt(s) >= 10 ? s : "0" + s) + oneValue;
                    }
                  }
                }
              }
              if (isTou) {
                oneValue = oneValue + '0000';
                valueColor = valueColor + '00';
              }
              return typeScore + parseInt(str + oneValue);
              //if(cc.huaSe == 0) return typeScore+parseInt(str+oneValue);
              //str = str+oneValue+oneValueColor+valueColor;
              //return typeScore+parseInt(str);
            } else if (typeScore == 0) {
                //乌龙
                var valuePoint = "";
                var valueColor = "";
                for (var q in caleCards) {
                  var s = caleCards[q].scores;
                  var c = caleCards[q].color; //单张加花色
                  valuePoint = (parseInt(s) >= 10 ? s : "0" + s) + valuePoint;
                  valueColor = c + valueColor;
                }
                if (isTou) {
                  valuePoint = valuePoint + '0000';
                  valueColor = valueColor + '00';
                }
                return typeScore + parseInt(valuePoint);
                //if(cc.huaSe == 0) return typeScore+parseInt(valuePoint);
                //valuePoint = valuePoint + valueColor;
                //return typeScore+parseInt(valuePoint);
              }

  var cardsTotalPoint = 0;
  caleCards.forEach(function (card) {
    cardsTotalPoint += card.point;
  });

  var result = typeScore + cardsTotalPoint;
  return result;
};
KQCard._changeCardScors = function (cardModel) {
  cardModel.forEach(function (card) {
    card.scores = card.point;
    if (card.scores == 1) {
      card.scores = 14;
    }
  });

  var is14 = true; //是 k q j 10 A;
  var is1 = true; //是1 2 3 4 5

  cardModel.forEach(function (card) {
    if (card.scores < 10) {
      is14 = false; //不是 k q j 10 A;
    }
  });
  cardModel.forEach(function (card) {
    card.scores = card.point;
    if (card.scores == 14) {
      card.scores = 1;
    }
  });
  cardModel.forEach(function (card) {
    if (card.scores > 5 && card.scores != 20) {
      is1 = false; //不是1 2 3 4 5
    }
  });

  if (is14) {
    //是 k q j 10 A;
    cardModel.forEach(function (card) {
      if (card.scores == 1) {
        card.scores = 14;
      }
    });

    cardModel.sort(function (a1, a2) {
      return a2.scores - a1.scores;
    });
    var num = 14;
    var scoresAyy = []; //一副牌的分数
    for (var i = 0; i < 5; i++) {
      scoresAyy.push(num);
      num -= 1;
    }
    for (var j = 0; j < scoresAyy.length; j++) {
      for (var i = 0; i < cardModel.length; i++) {
        var cardScores = cardModel[i].scores;
        if (cardScores == scoresAyy[j] && cardScores < 15) {
          scoresAyy.splice(j, 1); //删除不是鬼牌的分
        }
      }
    }
    //cc.log('----------是 k q j 10 A',scoresAyy)
    cardModel.forEach((function (card) {
      //找出选中的牌
      if (card.point >= 20) {
        card.scores = scoresAyy.splice(0, 1)[0];
      }
    }).bind(this));
  } else if (is1) {
    //是1 2 3 4 5
    cardModel.sort(function (a1, a2) {
      return a2.scores - a1.scores;
    });
    var num = 5;
    var scoresAyy = []; //一副牌的分数
    for (var i = 0; i < 5; i++) {
      scoresAyy.push(num);
      num -= 1;
    }
    for (var j = 0; j < scoresAyy.length; j++) {
      for (var i = 0; i < cardModel.length; i++) {
        var cardScores = cardModel[i].scores;
        if (cardScores == scoresAyy[j] && cardScores < 15) {
          scoresAyy.splice(j, 1); //删除不是鬼牌的分
        }
      }
    }
    //cc.log('----------是1 2 3 4 5')
    cardModel.forEach((function (card) {
      //找出选中的牌
      if (card.point >= 20) {
        card.scores = scoresAyy.splice(0, 1)[0];
      }
    }).bind(this));
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
        if (cardScores == scoresAyy[j] && cardScores < 15) {
          scoresAyy.splice(j, 1); //删除不是鬼牌的分
        }
      }
    }
    cardModel.forEach((function (card) {
      //改变牌的分数
      if (card.point >= 20) {
        card.scores = scoresAyy.splice(0, 1)[0];
      }
    }).bind(this));
  }

  cardModel.forEach(function (card) {
    if (card.scores == 1) {
      card.scores = 14;
    }
  });
  cardModel.sort(function (a1, a2) {
    return a1.scores - a2.scores;
  });
  return cardModel;
};
/*#####*/

KQCard._typeScoreOfCards = function (cards) {
  var typeScore = 0;
  if (KQCard.containWuTong(cards)) {
    typeScore = 9000000000000000;
  } else if (KQCard.containTongHuaShun(cards)) {
    typeScore = 8000000000000000;
  } else if (KQCard.containTieZhi(cards)) {
    typeScore = 7000000000000000;
  } else if (KQCard.containHuLu(cards)) {
    typeScore = 6000000000000000;
  } else if (KQCard.containTongHua(cards)) {
    typeScore = 5000000000000000;
  } else if (KQCard.containShunZi(cards)) {
    typeScore = 4000000000000000;
  } else if (KQCard.containSanTiao(cards)) {
    typeScore = 3000000000000000;
  } else if (KQCard.containLiaDui(cards)) {
    typeScore = 2000000000000000;
  } else if (KQCard.containDuiZi(cards)) {
    typeScore = 1000000000000000;
  }

  return typeScore;
};
/*
 // 根据牌型进行排序
 KQCard._typeCardsSort = function (cards) {
 if ((cards == null) || (cards.length == 0)) {
 return cards;
 }
 if(KQCard.containWuTong(cards)){
 return KQCard._typeCardsSortWutong(cards);
 } else if (KQCard.containTongHuaShun(cards)) {
 return KQCard._typeCardsSortShunZi(cards);
 } else if (KQCard.containTieZhi(cards)) {
 return KQCard._typeCardsSortTieZhi(cards);
 } else if (KQCard.containHuLu(cards)) {
 return KQCard._typeCardsSortHuLu(cards);
 } else if (KQCard.containTongHua(cards)) {
 return KQCard._typeCardsSortTongHua(cards);
 } else if (KQCard.containShunZi(cards)) {
 return KQCard._typeCardsSortShunZi(cards);
 } else if (KQCard.containSanTiao(cards)) {
 return KQCard._typeCardsSortSanTiao(cards);
 } else if (KQCard.containLiaDui(cards)) {
 return KQCard._typeCardsSortLiangDui(cards);
 } else if (KQCard.containDuiZi(cards)) {
 return KQCard._typeCardsSortDuiZi(cards);
 }

 return cards.sort(KQCard.sortByPoint).reverse();
 };

 KQCard._typeCardsSortShunZi = function (cards) {
 return cards.sort(KQCard.sortByPoint).reverse();
 };

 KQCard._typeCardsSortTieZhi = function (cards) {
 return KQCard._typeCardsSortByNumberOfPoints(cards);
 };

 /!*#####*!/
 KQCard._typeCardsSortWutong = function (cards) {
 return KQCard._typeCardsSortByNumberOfPoints(cards);
 };
 /!*#####*!/

 KQCard._typeCardsSortHuLu = function (cards) {
 return KQCard._typeCardsSortByNumberOfPoints(cards);
 };

 KQCard._typeCardsSortTongHua = function (cards) {
 return cards.sort(KQCard.sortByPoint).reverse();
 };

 KQCard._typeCardsSortSanTiao = function (cards) {
 return KQCard._typeCardsSortByNumberOfPoints(cards);
 };

 KQCard._typeCardsSortLiangDui = function (cards) {
 return KQCard._typeCardsSortByNumberOfPoints(cards);
 };

 KQCard._typeCardsSortDuiZi = function (cards) {
 return KQCard._typeCardsSortByNumberOfPoints(cards);
 };
 */
KQCard._typeCardsSortByNumberOfPoints = function (cards) {

  cards = KQCard._changeGuiCard(cards);

  cards.forEach(function (i) {
    if (i.scores == 1) i.scores = 14;
  });

  var pointHelper = new KQCardScoretsHelper(cards);
  var newCards = cards.slice().sort(function (card1, card2) {
    var numberOfCard1 = pointHelper.pointNumbers[card1.scores];
    var numberOfCard2 = pointHelper.pointNumbers[card2.scores];

    if (numberOfCard2 != numberOfCard1) {
      return numberOfCard2 - numberOfCard1;
    }
    var scores1 = card1.scores == 1 ? 14 : card1.scores;
    var scores2 = card2.scores == 1 ? 14 : card2.scores;
    return scores2 - scores1;
    //return card2.scores - card1.scores;
  });
  newCards.forEach(function (i) {
    if (i.scores == 14) i.scores = 1;
  });
  return newCards /*.concat(card20)*/;
};

KQCard._typeCardsSortByNumberOfPoints1 = function (cards) {

  cards = KQCard._changeGuiCard(cards);

  cards.forEach(function (i) {
    if (i.scores == 1) i.scores = 14;
  });

  var pointHelper = new KQCardScoretsHelper(cards);
  var newCards = cards.slice().sort(function (card1, card2) {
    var numberOfCard1 = pointHelper.pointNumbers[card1.scores];
    var numberOfCard2 = pointHelper.pointNumbers[card2.scores];

    if (numberOfCard2 != numberOfCard1) {
      return numberOfCard1 - numberOfCard2;
    }
    var scores1 = card1.scores == 1 ? 14 : card1.scores;
    var scores2 = card2.scores == 1 ? 14 : card2.scores;
    return scores1 - scores2;
    //return card1.scores - card2.scores;
  });
  newCards.forEach(function (i) {
    if (i.scores == 14) i.scores = 1;
  });
  return newCards;
};

KQCard._changeGuiCard = function (cards) {

  var card20 = KQCard.contain20(cards);

  var ca = cards.kq_excludes(card20);

  var helper = new KQCardPointsHelper(ca);

  var so = 0;

  var color = 1;

  var type = KQCard.cardsType(cards) + 1;

  type = type >= 10 ? type : "0" + type;

  if (type == "05" || type == "09") {

    return KQCard._changeCardScors(cards);
  }
  if (type == "06") {

    for (var w in helper.pointNumbers) {

      var maxNumber = helper.pointNumbers[w];

      if (w == 1) w = 14;

      if (maxNumber >= helper.maxNumber() && so < parseInt(w) && parseInt(w) != 20) {
        so = parseInt(w);
      }
    }
    color = ca[0].color;

    so = so == 14 ? 1 : so;

    card20.forEach(function (n) {

      n.scores = so;

      n.colorScores = color;
    });
  }
  if (type == "07" || type == "22" || type == "08" || type == "10" || type == "04" || type == "11" || type == "02") {

    for (var w in helper.pointNumbers) {

      var maxNumber = helper.pointNumbers[w];

      if (w == 1) w = 14;

      if (maxNumber >= helper.maxNumber() && so < parseInt(w) && parseInt(w) != 20) {
        so = parseInt(w);
      }
    }

    so = so == 14 ? 1 : so;

    ca.forEach(function (n) {
      if (so == n.point && color < n.color) color = n.color;
    });

    card20.forEach((function (n) {

      n.scores = so;

      n.colorScores = color;
    }).bind(this));
  }

  return card20.concat(ca);
};

KQCard._setGuiCard = function (index, start, end, type, cards, nodes, cardSpriteAtlas) {
  //cc.log(cardSpriteAtlas)
  //cc.log('-----593')
  var card20 = KQCard.contain20(cards[index]);

  var ca = cards[index].kq_excludes(card20);

  var helper = new KQCardPointsHelper(ca);

  var so = 0;

  var color = 1;

  var node = nodes.slice(start, end).filter(function (n) {

    if (n.childrenCount > 0 && n.children[0].cardName) {

      if (parseInt(n.children[0].cardName.split("_")[1]) == 20) return true;
    }
  });

  if (type == "05" || type == "09") {

    cards[index] = KQCard._changeCardScors(cards[index]);

    so = cards[index].filter(function (i) {
      if (i.point == 20) return true;
    }).map(function (i) {
      return i.scores == 14 ? 1 : i.scores;
    });

    node.forEach((function (n) {

      var btnSprite = n.getComponent(cc.Sprite);

      var cardName = ca[0].color + "_" + so.splice(0, 1)[0];

      var path = "public-pic-card-poker-" + cardName;

      KQCard._loadCardFrame(cardSpriteAtlas, path, btnSprite);
    }).bind(this));
  }
  if (type == "06") {

    for (var w in helper.pointNumbers) {

      var maxNumber = helper.pointNumbers[w];

      if (w == 1) w = 14;

      if (maxNumber >= helper.maxNumber() && so < parseInt(w) && parseInt(w) != 20) {
        so = parseInt(w);
      }
    }

    color = ca[0].color;

    so = so == 14 ? 1 : so;

    node.forEach((function (n) {

      var btnSprite = n.getComponent(cc.Sprite);

      var cardName = color + "_" + so;

      var path = "public-pic-card-poker-" + cardName;

      KQCard._loadCardFrame(cardSpriteAtlas, path, btnSprite);
    }).bind(this));
  }
  if (type == "07" || type == "22" || type == "08" || type == "10" || type == "04" || type == "11" || type == "02") {

    for (var w in helper.pointNumbers) {

      var maxNumber = helper.pointNumbers[w];

      if (w == 1) w = 14;

      if (maxNumber >= helper.maxNumber() && so < parseInt(w) && parseInt(w) != 20) {
        so = parseInt(w);
      }
    }

    so = so == 14 ? 1 : so;

    ca.forEach(function (n) {
      if (so == n.point && color < n.color) color = n.color;
    });

    node.forEach((function (n) {

      var btnSprite = n.getComponent(cc.Sprite);

      var cardName = color + "_" + so;

      var path = "public-pic-card-poker-" + cardName;

      KQCard._loadCardFrame(cardSpriteAtlas, path, btnSprite);
    }).bind(this));
  }
};

KQCard._setGuiCards = function (type, cards, nodes, cardSpriteAtlas) {
  //cc.log(cardSpriteAtlas)
  //cc.log('-----593')
  var card20 = KQCard.contain20(cards);

  var ca = cards.kq_excludes(card20);

  var helper = new KQCardPointsHelper(ca);

  var so = 0;

  var color = 1;

  var node = nodes.slice().filter(function (n) {

    if (n.childrenCount > 0 && n.children[0].cardName) {

      if (parseInt(n.children[0].cardName.split("_")[1]) == 20) return true;
    }
  });

  if (type == "05" || type == "09") {

    cards = KQCard._changeCardScors(cards);

    so = cards.filter(function (i) {
      if (i.point == 20) return true;
    }).map(function (i) {
      return i.scores == 14 ? 1 : i.scores;
    });

    node.forEach((function (n) {

      var btnSprite = n.getComponent(cc.Sprite);

      var cardName = ca[0].color + "_" + so.splice(0, 1)[0];

      var path = "public-pic-card-poker-" + cardName;

      KQCard._loadCardFrame(cardSpriteAtlas, path, btnSprite);
    }).bind(this));
  }
  if (type == "06") {

    for (var w in helper.pointNumbers) {

      var maxNumber = helper.pointNumbers[w];

      if (w == 1) w = 14;

      if (maxNumber >= helper.maxNumber() && so < parseInt(w) && parseInt(w) != 20) {
        so = parseInt(w);
      }
    }

    color = ca[0].color;

    so = so == 14 ? 1 : so;

    node.forEach((function (n) {

      var btnSprite = n.getComponent(cc.Sprite);

      var cardName = color + "_" + so;

      var path = "public-pic-card-poker-" + cardName;

      KQCard._loadCardFrame(cardSpriteAtlas, path, btnSprite);
    }).bind(this));
  }
  if (type == "07" || type == "22" || type == "08" || type == "10" || type == "04" || type == "11" || type == "02") {

    for (var w in helper.pointNumbers) {

      var maxNumber = helper.pointNumbers[w];

      if (w == 1) w = 14;

      if (maxNumber >= helper.maxNumber() && so < parseInt(w) && parseInt(w) != 20) {
        so = parseInt(w);
      }
    }

    so = so == 14 ? 1 : so;

    ca.forEach(function (n) {
      if (so == n.point && color < n.color) color = n.color;
    });

    node.forEach((function (n) {

      var btnSprite = n.getComponent(cc.Sprite);

      var cardName = color + "_" + so;

      var path = "public-pic-card-poker-" + cardName;

      KQCard._loadCardFrame(cardSpriteAtlas, path, btnSprite);
    }).bind(this));
  }
};

KQCard._loadCardFrame = function (SpriteFrame, path, SpritesNode, w, h) {
  //cc.log(SpriteFrame)
  //cc.log('---769')
  var Sprite = SpriteFrame.getSpriteFrame(path);

  SpritesNode.spriteFrame = Sprite;

  if (w) SpritesNode.node.width = w;

  if (h) SpritesNode.node.height = h;
};

KQCard.testScore = function () {};

cc._RFpop();