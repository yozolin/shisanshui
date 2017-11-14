var KQCard = require('KQCard');
var ArrayExtension = require('ArrayExtension');
var KQCardPointsHelper = require('KQCardPointsHelper');

module.exports = {};

// 寻找 cardModes 中的 对子
// 这会返回 对子 的索引数组
// 如：[[1, 3], [4, 5]]
KQCard.findDuiZi = function (cardModes) {
  var sDuiZiIndexs = KQCard.findSanTiao(cardModes) || [];
  var result = KQCard._findPointLength(cardModes, 2) || [];
  if (result.length < 2) {
    if (sDuiZiIndexs.length > 0) {
      sDuiZiIndexs.forEach(function (indexs) {
        var s1 = [indexs[0], indexs[1]];
        //var s2 = [indexs[1],indexs[2]];
        //result.push(s2);
        result.push(s1);
      });
    }
    var tresult = KQCard.findGuiPai(cardModes, 2);
    for (var i = 0; i < tresult.length; i++) {
      result.push(tresult[i]);
    }
  }

  result = KQCard.repeat(result);

  return result.length > 0 ? result : [];
};

KQCard._findPointLength = function (cardModes, length) {
  if (cardModes.length < length) {
    return [];
  }

  var obj = cardModes.reduce(function (obj, card, index) {
    var pointIndexs = obj[card.point] || [];
    obj[card.point] = pointIndexs;
    pointIndexs.push(index);
    return obj;
  }, {});

  var result = [];
  for (var prop in obj) {
    var pointIndexs = obj[prop];
    // if (pointIndexs.length == length) {
    //   pointIndexs.sort(function (n1, n2) {
    //     return n1 - n2;
    //   });
    //   result.push(pointIndexs);
    // }
    while (pointIndexs.length >= length && length != 0) {
      //有多的分割多个数组
      var splices = pointIndexs.splice(0, length);
      if (splices.length >= length) {
        splices.sort(function (n1, n2) {
          return n1 - n2;
        });
        result.push(splices);
      }
    }
  }

  result.sort(function (arr1, arr2) {
    var n1 = arr1[0];
    var n2 = arr2[0];
    return n2 - n1;
  });
  return result.length > 0 ? result : [];
};

// 找 两对 的索引数组
// 如：[[1, 2, 3, 4], [5, 6, 7, 8]]
KQCard.findLiaDui = function (cardModes) {
  var duiZiIndexs = KQCard.findDuiZi(cardModes) || [];
  var duiZiIndex = KQCard.findGuiPai(cardModes, 2) || [];

  if (duiZiIndexs.length < 1 && duiZiIndex.length > 0) {
    duiZiIndex.forEach(function (indexs) {
      duiZiIndexs.unshift(indexs);
    });
  }
  if (duiZiIndexs.length < 2) {
    return [];
  }

  var result = [];
  for (var i = 0; i < duiZiIndexs.length; ++i) {
    for (var j = i + 1; j < duiZiIndexs.length; ++j) {
      if (result.length < 10) {
        var pre = duiZiIndexs[i];
        var next = duiZiIndexs[j];
        var s = pre.concat(next);
        var newS = [];
        for (var q = 0; q < s.length; q++) {
          if (newS.indexOf(s[q]) == -1) {
            newS.push(s[q]);
          } else {
            break;
          }
        }
        if (newS.length == 4) {
          newS.sort(function (n1, n2) {
            return n1 - n2;
          });
          result.unshift(newS);
        }
      } else {
        break;
      }
    }
  }
  result = KQCard.repeat(result);
  if (result.length > 6) {
    result = result.slice(0, 6);
  }
  return result;
};

// 找三条
// 如：[[1, 2, 3]];
KQCard.findSanTiao = function (cardModes) {
  if (cardModes.length < 3) {
    return [];
  }
  var result = KQCard._findPointLength(cardModes, 3) || [];
  //for(var q =0;q<result.length;q++){
  //  var indexs = result[q][0];
  //  if(cardModes[indexs].point >= 20){
  //    result.splice(q,1);
  //  }
  //}
  if (result.length < 2) {
    var tieZhiIndexsArray = KQCard.findTieZhi(cardModes);
    if (tieZhiIndexsArray.length > 0) {
      tieZhiIndexsArray.forEach(function (indexs) {
        //let sanTiaoIndexs1 = [indexs[1], indexs[2], indexs[3]];
        //let sanTiaoIndexs2 = [indexs[0], indexs[1], indexs[3]];
        //let sanTiaoIndexs3 = [indexs[0], indexs[2], indexs[3]];
        var sanTiaoIndexs0 = [indexs[0], indexs[1], indexs[2]];
        result.push(sanTiaoIndexs0);
        //result.unshift(sanTiaoIndexs1);
        //result.unshift(sanTiaoIndexs2);
        //result.unshift(sanTiaoIndexs3);
      });
    }
    var tresult = KQCard.findGuiPai(cardModes, 3);
    for (var i = 0; i < tresult.length; i++) {
      result.push(tresult[i]);
    }
  }
  /*if(result.length < 1){
    // 铁支是包含三条的
    let tieZhiIndexsArray = KQCard.findTieZhi(cardModes);
    if (tieZhiIndexsArray) {
      tieZhiIndexsArray.forEach(function(indexs) {
        //let sanTiaoIndexs1 = [indexs[1], indexs[2], indexs[3]];
        //let sanTiaoIndexs2 = [indexs[0], indexs[1], indexs[3]];
        //let sanTiaoIndexs3 = [indexs[0], indexs[2], indexs[3]];
        let sanTiaoIndexs0 = [indexs[0], indexs[1], indexs[2]];
        result.push(sanTiaoIndexs0);
        //result.unshift(sanTiaoIndexs1);
        //result.unshift(sanTiaoIndexs2);
        //result.unshift(sanTiaoIndexs3);
      });
    }
  }*/

  //if(result.length > 10){
  //  result = result.slice(0,10);
  //}

  result = KQCard.repeat(result);
  return result.length > 0 ? result : [];
};

// 找同花顺
/*KQCard.findTongHuaShun = function (cardModes, length = 5) {
  if (cardModes.length < length) {
    return [];
  }
  let result = [];
  var sanShunZi = KQCard.sanShunZi1(cardModes,length);
  if(sanShunZi[0] == null){
    return false;
  }
  for(var i=0;i<sanShunZi[0].length;i++) {
    var s = sanShunZi[0][i];
    if (KQCard.isTongHuaShun(s, length)) {
      result.unshift(sanShunZi[1][i]);

    }
  }
  if(result.length > 0){
    return result
  }else{
    return KQCard.findTongHuaShun1(cardModes);
  }
};*/
KQCard.findTongHuaShun = function (cards) {
  var length = arguments.length <= 1 || arguments[1] === undefined ? 5 : arguments[1];

  if (cards.length < length) {
    return [];
  }
  cards = Array.from(cards);
  var colorS = []; //黑桃
  var colorH = []; //红心
  var colorC = []; //梅花
  var colorD = []; //方块
  var pointS = []; //黑桃
  var pointH = []; //红心
  var pointC = []; //梅花
  var pointD = []; //方块
  for (var i = 0; i < cards.length; i++) {
    if (cards[i].color == '4') {
      if (pointS.indexOf(cards[i].point) == -1) {
        pointS.push(cards[i].point);
        colorS.push(cards[i]);
      }
    } else if (cards[i].color == '3') {
      if (pointH.indexOf(cards[i].point) == -1) {
        pointH.push(cards[i].point);
        colorH.push(cards[i]);
      }
    } else if (cards[i].color == '2') {
      if (pointC.indexOf(cards[i].point) == -1) {
        pointC.push(cards[i].point);
        colorC.push(cards[i]);
      }
    } else if (cards[i].color == '1') {
      if (pointD.indexOf(cards[i].point) == -1) {
        pointD.push(cards[i].point);
        colorD.push(cards[i]);
      }
    }
  }

  var color = [colorS, colorH, colorC, colorD];
  var colorSum = []; //总共有几种花色 [5,3,0....]
  for (var i = 0; i < color.length; i++) {
    if (color[i].length >= 5) {
      color[i].sort(function (a1, a2) {
        return a1.point - a2.point;
      });
      colorSum.push(color[i]);
    }
  }
  var result = [];
  for (var i = 0; i < colorSum.length; i++) {
    var s = colorSum[i];
    for (var start = 0; start + 5 <= s.length; ++start) {
      var subCards = s.slice(start, start + 5);
      if (KQCard.isTongHuaShun(subCards)) {
        (function () {
          var indexs = [];
          subCards.forEach(function (ca) {
            for (var q = 0; q < cards.length; q++) {
              var r = cards[q];
              if (r === ca) {
                indexs.push(q);
                break;
              }
            }
          });
          indexs.sort(Array.sortByPoint);
          result.unshift(indexs);
        })();
      }
    }
  }

  if (result.length > 0) {
    return result;
  } else {
    var convertedCards = KQCard._convertOneToA1(cards);
    if (cards === convertedCards) {
      cards.forEach(function (adfs) {
        if (adfs.point == 14) {
          adfs.point = 1;
          adfs.scores = 1;
        }
      });
      return KQCard.findTongHuaShun20(cards);
    }
    return KQCard.findTongHuaShun(convertedCards);
  }
  //return result.length > 0 ? result : null;
};
KQCard.findTongHuaShun20 = function (card) {
  var length = arguments.length <= 1 || arguments[1] === undefined ? 5 : arguments[1];

  if (card.length < length) {
    return false;
  }
  var card20 = KQCard.contain20(card) || [];
  if (card20.length <= 0) {
    return false;
  }
  var cards = card.kq_excludes(card20);

  cards = Array.from(cards);
  var colorS = []; //黑桃
  var colorH = []; //红心
  var colorC = []; //梅花
  var colorD = []; //方块
  var pointS = []; //黑桃
  var pointH = []; //红心
  var pointC = []; //梅花
  var pointD = []; //方块
  for (var i = 0; i < cards.length; i++) {
    if (cards[i].color == '4') {
      if (pointS.indexOf(cards[i].point) == -1) {
        pointS.push(cards[i].point);
        colorS.push(cards[i]);
      }
    } else if (cards[i].color == '3') {
      if (pointH.indexOf(cards[i].point) == -1) {
        pointH.push(cards[i].point);
        colorH.push(cards[i]);
      }
    } else if (cards[i].color == '2') {
      if (pointC.indexOf(cards[i].point) == -1) {
        pointC.push(cards[i].point);
        colorC.push(cards[i]);
      }
    } else if (cards[i].color == '1') {
      if (pointD.indexOf(cards[i].point) == -1) {
        pointD.push(cards[i].point);
        colorD.push(cards[i]);
      }
    }
  }

  var color = [colorS, colorH, colorC, colorD];
  var colorSum = []; //总共有几种花色 [5,3,0....]
  for (var i = 0; i < color.length; i++) {
    if (color[i].length >= parseInt(5 - card20.length)) {
      color[i].sort(function (a1, a2) {
        return a1.point - a2.point;
      });
      colorSum.push(color[i]);
    }
  }
  //cc.log(colorSum)

  var result = [];
  for (var i = 0; i < colorSum.length; i++) {
    var s = colorSum[i];
    for (var j = 1; j <= card20.length; ++j) {
      var num = 5 - j;
      for (var start = 0; start + num <= s.length; ++start) {
        var subCards = s.slice(start, start + num);
        var bool = parseInt(subCards[num - 1]['scores']) - parseInt(subCards[0]['scores']) < 5;
        if (bool) {
          var newCard20;

          (function () {
            var indexs = [];
            newCard20 = card20.slice(0, j);

            subCards = subCards.concat(newCard20);
            subCards.forEach(function (ca) {
              for (var q = 0; q < card.length; q++) {
                var r = card[q];
                if (r === ca) {
                  indexs.push(q);
                  break;
                }
              }
            });
            indexs.sort(Array.sortByNumber);

            result.unshift(indexs);
          })();
        }
      }
    }
  }
  //cc.log(result)
  //cc.log('--------357')
  if (result.length > 0) {
    return result;
  } else {
    var convertedCards = KQCard._convertOneToA1(card);
    if (card === convertedCards) {
      return [];
    }
    return KQCard.findTongHuaShun20(convertedCards);
  }
  //return result.length > 0 ? result : null;
};

// 找铁支
// 如：[[1,2,3,4]]
KQCard.findTieZhi = function (cardModes) {
  var result = KQCard._findPointLength(cardModes, 4);
  if (result.length > 0) {
    return result;
  }
  result = [];
  // 五同是包含铁支的
  var wuTongIndexsArray = KQCard.findWuTong(cardModes);
  if (wuTongIndexsArray) {
    wuTongIndexsArray.forEach(function (indexs) {
      var tieZhiIndexs0 = [indexs[0], indexs[1], indexs[2], indexs[3]];
      var tieZhiIndexs1 = [indexs[0], indexs[1], indexs[2], indexs[4]];
      var tieZhiIndexs2 = [indexs[0], indexs[1], indexs[3], indexs[4]];
      var tieZhiIndexs3 = [indexs[0], indexs[2], indexs[3], indexs[4]];
      var tieZhiIndexs4 = [indexs[1], indexs[2], indexs[3], indexs[4]];
      result.push(tieZhiIndexs0);
      result.push(tieZhiIndexs1);
      result.push(tieZhiIndexs2);
      result.push(tieZhiIndexs3);
      result.push(tieZhiIndexs4);
    });
  }
  if (result.length > 10) {
    result = result.slice(0, 10);
  }
  result = KQCard.repeat(result);
  return result.length > 0 ? result : KQCard.findGuiPai(cardModes, 4);
};
//找五同
KQCard.findWuTong = function (cardModes) {
  if (cardModes.length < 5) {
    return [];
  }
  var result = this._findPointLength(cardModes, 5) || [];
  return result.length > 0 ? result : KQCard.findGuiPai(cardModes, 5);
};
// 找顺子
// 如：[[1, 2, 3, 4, 5]]
KQCard.findShunZi = function (cardModes) {
  var length = arguments.length <= 1 || arguments[1] === undefined ? 5 : arguments[1];

  if (cardModes.length < length) {
    return [];
  }
  if (typeof cardModes[0]['point'] == "undefined") {
    cardModes = KQCard.cardsFromArray(cardModes);
  }
  // 先根据点数去重
  var uniqueCards = cardModes.unique(function (card1, card2) {
    return card1.point == card2.point;
  });
  uniqueCards.sort(KQCard.sortByPoint);

  // 如果有 A，则在最后添加 14
  var cardA = cardModes.find(function (card) {
    return card.point == 1;
  });
  if (cardA) {
    var cardAPlus = new KQCard(cardA);
    cardAPlus.point = 14;
    uniqueCards.push(cardAPlus);
  }

  var result = [];

  // 由于点数是唯一且升序，只需要依次遍历判断是否是顺子即可
  for (var start = 0; start + length <= uniqueCards.length; ++start) {
    var subCards = uniqueCards.slice(start, start + length);
    if (KQCard.isShunZi(subCards, length)) {
      (function () {
        var indexs = [];
        subCards.forEach(function (card) {
          var index = cardModes.findIndex(function (originCard) {

            if (card.point == 14) {
              return originCard.point == 1;
            }

            return card === originCard;
          });
          indexs.push(index);
        });

        indexs.sort(Array.sortByNumber);
        result.unshift(indexs);
      })();
    }
  }

  // 处理点数重复的情况
  // 比如 A A K Q J 10 这种
  var repeatIndexsArray = KQCard._findRepeatPointIndexsArray(result, cardModes);
  repeatIndexsArray.forEach(function (indexs) {
    result.unshift(indexs);
  });

  result.sort(function (arr1, arr2) {
    return arr1[0] - arr2[0];
  });

  return result.length > 0 ? result : KQCard.findShunZi20(cardModes);
};
KQCard.findShunZi20 = function (cardModes) {
  var length = arguments.length <= 1 || arguments[1] === undefined ? 5 : arguments[1];

  if (cardModes.length < length) {
    return [];
  }
  var card20 = KQCard.contain20(cardModes);
  if (card20.length <= 0) {
    return [];
  }
  var cards = cardModes.kq_excludes(card20);
  // 先根据点数去重
  var newArr = [];
  var newArrs = [];
  for (var i = 0; i < cards.length; i++) {
    if (newArrs.indexOf(cards[i]['point']) == -1) {
      newArr.push(cards[i]);
      newArrs.push(cards[i].point);
    }
  }

  newArr.sort(function (n1, n2) {
    return n1.point - n2.point;
  });
  var result = [];
  for (var j = 1; j <= card20.length; ++j) {
    var num = length - j;
    for (var start = 0; start + num <= newArr.length; ++start) {
      var subCards = newArr.slice(start, start + num);
      var bool = parseInt(subCards[num - 1]['point']) - parseInt(subCards[0]['point']) < length;
      if (bool) {
        var newCard20;

        (function () {
          var indexs = [];
          newCard20 = card20.slice(0, j);

          subCards = subCards.concat(newCard20);
          subCards.forEach(function (card) {
            for (var q = 0; q < cardModes.length; q++) {
              var r = cardModes[q];
              if (r === card) {
                indexs.push(q);
                break;
              }
            }
          });

          indexs.sort(Array.sortByNumber);
          result.unshift(indexs);
        })();
      }
    }
  }

  if (result.length > 0) {
    return result;
  } else {
    var convertedCards = KQCard._convertOneToA1(cardModes);
    if (cardModes === convertedCards) {
      return false;
    }
    return KQCard.findShunZi20(convertedCards);
  }
};
KQCard._findRepeatPointIndexsArray = function (indexsArray, originCards) {
  var repeatIndexsArray = [];
  indexsArray.forEach(function (indexs) {
    var cards = indexs.map(function (index) {
      return originCards[index];
    });

    cards.forEach(function (card, index) {
      var originIndex = originCards.findIndex(function (originCard) {
        if (typeof card == 'undefined') {
          return;
        }
        if (originCard !== card && originCard.point == card.point) {
          return true;
        }
        return false;
      });

      if (originIndex < 0) {
        return;
      }

      var repeatIndexs = indexs.slice();
      repeatIndexs[index] = originIndex;
      repeatIndexsArray.push(repeatIndexs);
    });
  });

  return repeatIndexsArray;
};

// 找同花
// 如：[[1, 2, 3, 4, 5]]
KQCard.findTongHua = function (cardModes) {
  var length = arguments.length <= 1 || arguments[1] === undefined ? 5 : arguments[1];

  if (cardModes.length < length) {
    return [];
  }

  var cards = Array.from(cardModes);
  cards.sort(KQCard.sortByColor);

  var result = [];
  for (var start = 0; start + length <= cards.length; ++start) {
    var subCards = cards.slice(start, start + length);
    if (KQCard.isTongHua(subCards, length)) {
      (function () {
        var indexs = [];
        subCards.forEach(function (card) {
          var index = cardModes.findIndex(function (originCard) {
            return card === originCard;
          });
          indexs.push(index);
        });
        //indexs = indexs.length > 5 ? indexs.splice(1,1) : indexs;
        indexs.sort(Array.sortByNumber);
        result.unshift(indexs);
      })();
    }
  }
  return result.length > 0 ? result : KQCard.findTongHua20(cardModes);
};
KQCard.findTongHua20 = function (cardModes) {
  if (cardModes.length < 5) {
    return [];
  }
  var card20 = KQCard.contain20(cardModes);
  if (card20.length <= 0) {
    return [];
  }
  var cards = cardModes.kq_excludes(card20);
  // 先根据点数去重
  cards.sort(KQCard.sortByColor);

  var result = [];
  for (var j = 1; j <= card20.length; ++j) {
    var num = 5 - j;
    for (var start = 0; start + num <= cards.length; ++start) {
      var subCards = cards.slice(start, start + num);
      if (KQCard.isTongHua(subCards, num)) {
        var newCard20;

        (function () {
          var indexs = [];
          newCard20 = card20.slice(0, j);

          subCards = subCards.concat(newCard20);
          subCards.forEach(function (card) {
            for (var q = 0; q < cardModes.length; q++) {
              var r = cardModes[q];
              if (r === card) {
                indexs.push(q);
                break;
              }
            }
          });

          indexs.sort(Array.sortByNumber);
          result.unshift(indexs);
        })();
      }
    }
  }

  return result.length > 0 ? result : [];
};

KQCard.findHuLu = function (cardModes) {
  var length = 5;
  if (cardModes.length < length) {
    return [];
  }

  var p_3 = KQCard.findSanTiao(cardModes);
  var p_4 = KQCard.findTieZhi(cardModes);
  var p2 = KQCard.findDuiZi(cardModes) || [];
  //var p_3 =  this._findPointLength(cardModes, 3) || [];
  //var p_4 = this._findPointLength(cardModes, 4) || [];
  //var p2 = this._findPointLength(cardModes, 2) || [];
  if (p2.length <= 0) {
    if (p_3) {
      p_3.forEach(function (indexs) {
        var sanTiaoIndexs0 = [indexs[0], indexs[1]];
        //let sanTiaoIndexs1 = [indexs[0], indexs[2]];
        var sanTiaoIndexs3 = [indexs[1], indexs[2]];
        p2.push(sanTiaoIndexs0);
        //p2.unshift(sanTiaoIndexs1);
        p2.push(sanTiaoIndexs3);
      });
    }

    if (p_4) {
      p_4.forEach(function (indexs) {
        var sanTiaoIndexs0 = [indexs[0], indexs[1]];
        //let sanTiaoIndexs1 = [indexs[0], indexs[2]];
        //let sanTiaoIndexs2 = [indexs[0], indexs[3]];
        //let sanTiaoIndexs3 = [indexs[1], indexs[2]];
        //let sanTiaoIndexs4 = [indexs[1], indexs[3]];
        var sanTiaoIndexs6 = [indexs[2], indexs[3]];
        p2.push(sanTiaoIndexs0);
        //p2.unshift(sanTiaoIndexs1);
        //p2.unshift(sanTiaoIndexs2);
        //p2.unshift(sanTiaoIndexs3);
        //p2.unshift(sanTiaoIndexs4);
        p2.push(sanTiaoIndexs6);
      });
    }
  }

  if (p2 == null || p_3 == null) {
    return [];
  }
  var tresult = [];
  p2.forEach(function (i_3) {
    var s = i_3;
    p_3.forEach(function (i_2) {
      s = i_3.concat(i_2);
      for (var i = 0; i < s.length - 1; i++) {
        var index = s[i];
        for (var j = i + 1; j < s.length; j++) {
          if (index == s[j]) {
            s = null;
            break;
          }
        }
        if (s == null) {
          break;
        }
      }
      if (s !== null) {
        tresult.unshift(s);
      }
    });
  });
  if (tresult.length > 10) {
    tresult = tresult.slice(0, 10);
  }
  return tresult.length > 0 ? tresult : KQCard.findHuLu20(cardModes);
};
KQCard.findHuLu20 = function (cardModes) {
  var length = 5;
  if (cardModes.length < length) {
    return [];
  }
  var card20 = KQCard.contain20(cardModes) || [];
  if (card20.length <= 0) {
    return [];
  }
  var p_3 = KQCard.findGuiPai(cardModes, 3);
  var p_4 = KQCard.findGuiPai(cardModes, 4);
  var p_2 = KQCard.findGuiPai(cardModes, 2);
  if (p_2 == null) {
    p_2 = [];
  }
  if (p_3) {
    p_3.forEach(function (indexs) {
      var sanTiaoIndexs0 = [indexs[0], indexs[1]];
      var sanTiaoIndexs3 = [indexs[1], indexs[2]];
      p_2.unshift(sanTiaoIndexs0);
      p_2.unshift(sanTiaoIndexs3);
    });
  }

  if (p_4) {
    p_4.forEach(function (indexs) {
      var sanTiaoIndexs0 = [indexs[0], indexs[1]];
      var sanTiaoIndexs6 = [indexs[2], indexs[3]];
      p_2.unshift(sanTiaoIndexs0);
      p_2.unshift(sanTiaoIndexs6);
    });
  }

  if (p_2 == null || p_3 == null) {
    return [];
  }
  var tresult = [];
  p_2.forEach(function (i_3) {
    var s = i_3;
    p_3.forEach(function (i_2) {
      s = i_3.concat(i_2);
      for (var i = 0; i < s.length - 1; i++) {
        var index = s[i];
        for (var j = i + 1; j < s.length; j++) {
          if (index == s[j]) {
            s = null;
            break;
          }
        }
        if (s == null) {
          break;
        }
      }
      if (s !== null) {
        tresult.unshift(s);
      }
    });
  });
  if (tresult.length > 10) {
    tresult = tresult.slice(0, 10);
  }
  return tresult.length > 0 ? tresult : [];
};

KQCard.findGuiPai = function (cardModes) {
  var numBer = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

  var card20 = KQCard.contain20(cardModes).map(function (card) {
    //得到鬼牌的索引
    for (var q = 0; q < cardModes.length; q++) {
      var r = cardModes[q];
      if (r === card) {
        return q;
      }
    }
  });
  if (card20.length <= 0) {
    return [];
  }
  var result = [];
  for (var j = 1; j <= card20.length; ++j) {
    var num = numBer - j; //除鬼牌外 我应该找多少张牌匹配
    var indexs = KQCard._findPointLength(cardModes, num) || [];
    for (var t = 0; t < indexs.length; t++) {
      if (numBer == 2) {
        //是对子的时候把鬼牌和单张匹配都循环一遍
        for (var o = 0; o < card20.length; ++o) {
          var s = indexs[t].concat(card20[o]);
          if (s.length == numBer) {
            result.push(s);
          }
        }
      } else {
        var s = indexs[t].concat(card20.slice(0, j)); //依次相加鬼牌第一次加一张 递增
        if (s.length == numBer) {
          result.push(s);
        }
      }
    }
  }
  if (result.length > 10) {
    result = result.slice(0, 10);
  }
  result = KQCard.repeat(result); //去重
  return result.length > 0 ? result : [];
};

KQCard.repeat = function (result) {
  for (var i = 0; i < result.length; i++) {
    var index = result[i];

    var newAyy = [];
    for (var o = 0; o < index.length; o++) {
      //有重复干掉你
      if (newAyy.indexOf(index[o]) == -1) {
        newAyy.push(index[o]);
      } else {
        result.splice(i, 1);
        break;
      }
    }

    for (var j = i + 1; j < result.length - 1; j++) {
      var s = result[j];
      var jString = '';
      var iString = '';
      for (var r = 0; r < s.length; r++) {
        jString = jString + s[r];
        iString = iString + index[r];
      }
      if (jString == iString) {
        //有重复干掉你
        result.splice(i, 1);
        break;
      }
    }
  }
  return result;
};

KQCard.testFind = function (cardModes) {
  var WuTong = KQCard.findWuTong(cardModes) || [];
  var TongHuaShun = KQCard.findTongHuaShun(cardModes) || [];
  var TieZhi = KQCard.findTieZhi(cardModes) || [];
  var HuLu = KQCard.findHuLu(cardModes) || [];
  var TongHua = KQCard.findTongHua(cardModes) || [];
  var ShunZi = KQCard.findShunZi(cardModes) || [];
  var SanTiao = KQCard.findSanTiao(cardModes) || [];
  var LiaDui = KQCard.findLiaDui(cardModes) || [];
  var DuiZi = KQCard.findDuiZi(cardModes) || [];
  var result = [WuTong, TongHuaShun, TieZhi, HuLu, TongHua, ShunZi, SanTiao, LiaDui, DuiZi];
  return result;
};