var KQCardColorsHelper = require('KQCardColorsHelper');
var KQCardPointsHelper = require('KQCardPointsHelper');
var NumberExtension = require('NumberExtension');
var GetCardPointsSameCount = require('GetCardPointsSameCount');

cc = cc || {};
cc.assert = cc.assert || console.assert || function () {};
cc.log = cc.log || console.log || function () {};
cc.error = cc.error || console.error || function () {};

// 牌 Model 类，封装了花色和点数
// 使用：
// new KQCard(22);
var KQCard = function KQCard(point, color, index) {
    this.color = null;
    this.point = null;
    this.sindex = index;
    this._initWithColorAndPoint = function (color, point) {
        if (color == 's') {
            color = 4;
        }
        if (color == 'h') {
            color = 3;
        }
        if (color == 'c') {
            color = 2;
        }
        if (color == 'd') {
            color = 1;
        }

        this.point = Number(point);
        this.scores = Number(point);
        this.color = Number(color);
        this.colorScores = Number(color);

        cc.assert(this.point > 0);
        cc.assert(this.color > 0);
    };

    this._initWithNumber = function (number) {
        this.point = Math.floor(number / 10);
        this.color = number % 10;
        cc.assert(this.point > 0);
        cc.assert(this.color > 0);
    };

    this._initWithObject = function (object) {
        if (object.point) {
            this._initWithColorAndPoint(object.color, object.point);
        } else if (object.suit) {
            this._initWithColorAndPoint(object.suit, object.number);
        }
    };

    this.description = function () {
        return this.cardName();
    };

    this.cardName = function () {
        return this.color + "_" + this.point;
    };

    this.sort = function (otherCard) {
        var asc = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
        var AisMax = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

        return KQCard.sort(this, otherCard, asc, AisMax);
    };

    this.isEqual = function (otherCard) {
        if (!otherCard) {
            return false;
        }
        return this.point == otherCard.point && this.color == otherCard.color && this.sindex == otherCard.sindex;
    };

    if (point && color) {
        this._initWithColorAndPoint(color, point);
        return;
    }

    var number = Number(point);
    if (!Number.isNaN(number)) {
        this._initWithNumber(number);
        return;
    }

    if (typeof point == 'string') {
        // 解析 xxxxd_d 形式
        var found = point.match(/(\.)*\d_\d+/);
        if (found instanceof Array && found.length > 0) {
            var result = found[0];
            var numbers = result.split('_');

            var _color = Number(numbers[0]);
            var _point = Number(numbers[1]);

            this._initWithColorAndPoint(_color, _point);
        }

        return;
    }

    if (typeof point == 'object') {
        this._initWithObject(point);
        return;
    }

    cc.error("初始化错误：" + point + " " + color);
};

// 转换成服务器的牌 model
KQCard.prototype.toServerCard = function () {
    return {
        'suit': this.color,
        'number': this.point
    };
};

KQCard.COLOR_SPADE = 4;
KQCard.COLOR_HEART = 3;
KQCard.COLOR_CLUB = 2;
KQCard.COLOR_DIAMOND = 1;

module.exports = KQCard;

KQCard.cardsFromArray = function (cardNames) {
    return cardNames.map(function (cardName, index) {
        return new KQCard(cardName, null, index);
    });
};

// 将多张牌转换成服务器的形式
KQCard.convertToServerCards = function (cards) {
    return cards.map(function (card) {
        return card.toServerCard();
    });
};

KQCard.TYPE = {
    WuLong: 0,
    DuiZi: 1,
    LiangDui: 2,
    SanTiao: 3,
    ShunZi: 4,
    TongHua: 5,
    HuLu: 6,
    TieZhi: 7,
    TongHuaShun: 8,
    /*#####*/
    WuTong: 9,
    /*#####*/
    SanTaoHua: 10, // 特殊牌
    SanShunZi: 11,
    LiuDuiBan: 12,

    WuDuiSanTiao: 13,
    SiTaoSanTiao: 14,

    CouYiSe: 15,
    SanFenTianXia: 16,
    SanTongHuaShun: 17,
    YiTiaoLong: 18,
    QingLong: 19
};

// 牌类型名
KQCard.cardsTypeName = function (cards) {
    var names = ['乌龙', '对子', '两对', '三条', '顺子', '同花', '葫芦', '铁支', '同花顺', '五同', '三同花', '三顺子', '六对半', '五对三条', '四套三条', '凑一色', '三分天下', '三同花顺', '一条龙', '清龙'];
    var type = KQCard.cardsType(cards);
    return names[type];
};

// 找出牌的类型
KQCard.cardsType = function (cards) {
    if (KQCard.isQingLong(cards)) {
        return KQCard.TYPE.QingLong;
    }

    if (KQCard.isYiTiaoLong(cards)) {
        return KQCard.TYPE.YiTiaoLong;
    }

    //if (KQCard.isSanTongHuaShun(cards)) {
    //    return KQCard.TYPE.SanTongHuaShun;
    //}
    //
    //if (KQCard.isSanFenTianXia(cards)) {
    //    return KQCard.TYPE.SanFenTianXia;
    //}

    if (KQCard.isLiuDuiBan(cards)) {
        return KQCard.TYPE.LiuDuiBan;
    }

    if (KQCard.isSanTongHua(cards)) {
        return KQCard.TYPE.SanTaoHua;
    }

    if (KQCard.isSanShunZi(cards)) {
        return KQCard.TYPE.SanShunZi;
    }

    //if (KQCard.isCouYiSe(cards)) {
    //    return KQCard.TYPE.CouYiSe;
    //}
    //
    //if (KQCard.isWuDuiSanTiao(cards)) {
    //    return KQCard.TYPE.WuDuiSanTiao;
    //}
    //
    //if (KQCard.isSiTaoSanTiao(cards)) {
    //    return KQCard.TYPE.SiTaoSanTiao;
    //}

    /*#####*/
    if (KQCard.containWuTong(cards, 5)) {
        return KQCard.TYPE.WuTong;
    }

    //if (KQCard.containWuTong(cards)) {
    //    return KQCard.TYPE.WuTong;
    //}
    //
    //if (KQCard.containWuTong(cards)) {
    //    return KQCard.TYPE.WuTong;
    //}
    /*#####*/

    if (KQCard.containTongHuaShun(cards, 5)) {
        return KQCard.TYPE.TongHuaShun;
    }

    if (KQCard.containTieZhi(cards)) {
        return KQCard.TYPE.TieZhi;
    }

    if (KQCard.containHuLu(cards)) {
        return KQCard.TYPE.HuLu;
    }

    if (KQCard.containTongHua(cards)) {
        return KQCard.TYPE.TongHua;
    }

    if (KQCard.containShunZi(cards)) {
        return KQCard.TYPE.ShunZi;
    }

    if (KQCard.containSanTiao(cards)) {
        return KQCard.TYPE.SanTiao;
    }

    if (KQCard.containLiaDui(cards)) {
        return KQCard.TYPE.LiangDui;
    }

    if (KQCard.containDuiZi(cards)) {
        return KQCard.TYPE.DuiZi;
    }

    return KQCard.TYPE.WuLong;
};

// 判断是否是同花
KQCard.isTongHua = function (cards) {
    var minLength = arguments.length <= 1 || arguments[1] === undefined ? 3 : arguments[1];

    if (cards.length < minLength) {
        return false;
    }

    var colors = cards.map(function (card) {
        return card.color;
    });

    var color = colors[0];
    for (var index in colors) {
        var e = colors[index];
        if (e != color) {
            return false;
        }
    }
    return true;
};

// 是否包含同花
KQCard.containTongHua = function (cards) {
    var minLength = arguments.length <= 1 || arguments[1] === undefined ? 5 : arguments[1];

    if (cards.length < minLength) {
        return false;
    }
    //if (KQCard.findTongHua(cards).length > 0) {
    //    return true;
    //}
    //return false;
    cards = Array.from(cards);
    cards.sort(KQCard.sortByColor);

    var card20 = KQCard.contain20(cards);
    cards = cards.kq_excludes(card20);
    minLength = minLength - card20.length;

    for (var start = 0; start + minLength <= cards.length; ++start) {
        var subCards = cards.slice(start, start + minLength);
        if (KQCard.isTongHua(subCards, minLength)) {
            return true;
        }
    }

    //return KQCard.containTongHua20(cards);
};
KQCard.containTongHua20 = function (card) {
    if (card.length < 5) {
        return false;
    }
    var card20 = KQCard.contain20(card);
    var cards = card.kq_excludes(card20);
    cards.sort(KQCard.sortByColor);

    for (var j = 1; j <= card20.length; ++j) {
        var num = 5 - j;
        for (var start = 0; start + num <= cards.length; ++start) {
            var subCards = cards.slice(start, start + num);
            if (KQCard.isTongHua(subCards, num)) {
                return true;
            }
        }
    }
    return false;
};
// 判断是否是顺子
KQCard.isShunZi = function (cards) {
    var minLength = arguments.length <= 1 || arguments[1] === undefined ? 3 : arguments[1];

    if (cards.length < minLength) {
        return false;
    }

    if (KQCard._isShunZiAKQ(cards)) {
        return true;
    }

    var points = cards.map(function (card) {
        return card.point;
    }).sort(function (n1, n2) {
        return n1 - n2;
    });

    var point = points[0];
    for (var index in points) {
        var e = points[index];
        if (e != point) {
            return false;
        }

        point = point + 1;
    }

    return true;
};

// 判断是否是 A K Q J 10 这个顺子
KQCard._isShunZiAKQ = function (cards) {
    var length = cards.length;
    if (length.length < 3) {
        return false;
    }

    var point1s = [1];
    var point14s = [14];
    var pointK = 13;

    Number(length - 1).kq_times(function (times) {
        point1s.push(pointK - times);
        point14s.push(pointK - times);
    });

    return KQCard._isCardsContainPoints(cards, point1s) || KQCard._isCardsContainPoints(cards, point14s);
};

// cards 中是否包含 points 这些点数

KQCard._isCardsContainPoints = function (cards, points) {
    var _loop = function (index) {
        var point = points[index];
        var pointCardIndex = cards.findIndex(function (card) {
            return card.point == point;
        });

        if (pointCardIndex < 0) {
            return {
                v: false
            };
        }
    };

    for (var index = 0; index < points.length; ++index) {
        var _ret = _loop(index);

        if (typeof _ret === 'object') return _ret.v;
    }

    return true;
};
KQCard.contain20 = function (cards) {
    if (cards.length <= 0) {
        return [];
    }
    if (typeof cards[0].point == 'undefined') {
        cards = KQCard.cardsFromArray(cards);
    }
    var newCard = cards.filter(function (card) {
        //重新赋值cards
        if (card.point >= 20) {
            return card;
        }
    });
    return newCard || [];
};
// 是否包含顺子
KQCard.containShunZi = function (cards) {
    var minLength = arguments.length <= 1 || arguments[1] === undefined ? 5 : arguments[1];

    if (cards.length < minLength) {
        return false;
    }
    if (KQCard.findShunZi(cards).length > 0) {
        return true;
    }
    return false;
    //let uniqueCards = cards.unique(function(card1, card2) {
    //    return card1.point == card2.point;
    //});
    //uniqueCards.sort(KQCard.sortByPoint);
    //
    //let minPointCard = uniqueCards[0];
    //if (minPointCard.point == 1) {
    //    let APlusCard = new KQCard(minPointCard);
    //    APlusCard.point = 14;
    //    uniqueCards.push(APlusCard);
    //}
    //
    //for (var start = 0; (start + minLength) <= uniqueCards.length; ++start) {
    //    let subCards = uniqueCards.slice(start, start + minLength);
    //    if (KQCard.isShunZi(subCards, minLength)) {
    //        return true;
    //    }
    //}
    //
    //return KQCard.containShunZi20(cards);
};
/*KQCard.containShunZi20 = function (card) {
 if (card.length < 5) {
 return false;
 }
 var card20 = KQCard.contain20(card);
 var cards = card.kq_excludes(card20);
 // 先根据点数去重
 var newArr = [];
 var newArrs = [];
 for (var i = 0; i < cards.length; i++) {
 if (newArrs.indexOf(cards[i].point) == -1) {
 newArr.push(cards[i]);
 newArrs.push(cards[i].point);
 }
 }
 //newArr.forEach(function(card){
 //    if(card.scores == 14){
 //        card.scores = 1;
 //    }
 //})
 newArr.sort(function (n1, n2) {
 return n1.point - n2.point;
 });
 for(var j = 1;j <= card20.length;++j){
 var num = 5 - j;
 for (var start = 0; (start + num) <= newArr.length; ++start) {
 var subCards = newArr.slice(start, start + num);
 var bool = parseInt(subCards[num-1]['scores']) - parseInt(subCards[0]['scores']) < 5;
 if(bool){
 return true;
 }
 }
 }
 // 由于点数是唯一且升序，只需要依次遍历判断是否是顺子即可
 let convertedCards = KQCard._convertOneToA1(card);
 if (card === convertedCards) {
 return false;
 }
 return KQCard.containShunZi20(convertedCards);
 };*/
// 是否是同花顺
KQCard.isTongHuaShun = function (cards) {
    return KQCard.isTongHua(cards) && KQCard.isShunZi(cards);
};

// 是否包含有同花顺
KQCard.containTongHuaShun = function (cards) {
    var minLength = arguments.length <= 1 || arguments[1] === undefined ? 5 : arguments[1];

    if (cards.length < minLength) {
        return false;
    }
    if (KQCard.findTongHuaShun(cards).length > 0) {
        return true;
    }
    return false;
    //var sanShunZi = KQCard.sanShunZi1(cards,minLength)[0];
    //if(sanShunZi == null){
    //    return false;
    //}
    //var result = false;
    //for(var i=0;i<sanShunZi.length;i++) {
    //    var s = sanShunZi[i];
    //    if (KQCard.isTongHuaShun(s, minLength)) {
    //        return true;
    //    }
    //}
    //return KQCard.containTongHuaShun1(cards);
};
/*KQCard.containTongHuaShun1 = function (cards, minLength = 5) {
 if (cards.length < minLength) {
 return false;
 }
 let tempCards = Array.from(cards).sort(KQCard.sortByColor);
 for (var start = 0; (start + minLength) <= tempCards.length; ++start) {
 let subCards = tempCards.slice(start, start + minLength);
 if (KQCard.isTongHuaShun(subCards, minLength)) {
 return true;
 }
 }

 let convertedCards = KQCard._convertOneToA1(cards);
 if (cards === convertedCards) {
 return KQCard.containTongHuaShun20(cards);
 }
 return KQCard.containTongHuaShun1(convertedCards);
 //return false;
 };
 KQCard.containTongHuaShun20 = function (card, minLength = 5) {
 if (card.length < minLength) {
 return false;
 }
 var card20 = KQCard.contain20(card) || [];
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
 for(var i=0;i<cards.length;i++){
 if(cards[i].color == '4'){
 if(pointS.indexOf(cards[i].point) == -1){
 pointS.push(cards[i].point);
 colorS.push(cards[i]);
 }

 }else if(cards[i].color == '3'){
 if(pointH.indexOf(cards[i].point) == -1){
 pointH.push(cards[i].point);
 colorH.push(cards[i]);
 }
 }else if(cards[i].color == '2'){
 if(pointC.indexOf(cards[i].point) == -1){
 pointC.push(cards[i].point);
 colorC.push(cards[i]);
 }
 }else if(cards[i].color == '1'){
 if(pointD.indexOf(cards[i].point) == -1){
 pointD.push(cards[i].point);
 colorD.push(cards[i]);
 }
 }
 }

 var color = [colorS,colorH,colorC,colorD];
 var colorSum = [];    //总共有几种花色 [5,3,0....]
 for(var i=0;i<color.length;i++){
 if(color[i].length >= parseInt(5 - card20.length)){
 //color[i].forEach(function(ca){
 //    if(ca.scores == 14){
 //        ca.scores = 1;
 //    }
 //})
 color[i].sort(function(a1,a2){
 return a1 - a2;
 })
 colorSum.push(color[i]);
 }
 }

 for(var i=0;i<colorSum.length;i++) {
 var s = colorSum[i]
 for(var j = 1;j <= card20.length;++j){
 var num = 5 - j;
 for (var start = 0; (start + num) <= s.length; ++start) {
 var subCards = s.slice(start, start + num);
 var bool = parseInt(subCards[num-1]['scores']) - parseInt(subCards[0]['scores']) < 5;
 if(bool){
 return true;
 }
 }
 }
 }



 let convertedCards = KQCard._convertOneToA1(card);
 if (card === convertedCards) {
 return false;
 }
 return KQCard.containTongHuaShun20(convertedCards);
 };*/

// 是否是清龙
KQCard.isQingLong = function (cards) {
    var length = 13;
    if (cards.length != length) {
        return false;
    }
    var card20 = KQCard.contain20(cards);
    if (card20.length > 0) {
        return false;
    }
    /**
     *
     */
    var colorS = []; //黑桃
    var colorH = []; //红心
    var colorC = []; //梅花
    var colorD = []; //方块
    for (var i = 0; i < cards.length; i++) {
        if (cards[i].suit == 's') {
            colorS.push(cards[i]);
        } else if (cards[i].suit == 'h') {
            colorH.push(cards[i]);
        } else if (cards[i].suit == 'c') {
            colorC.push(cards[i]);
        } else if (cards[i].suit == 'd') {
            colorD.push(cards[i]);
        }
    }
    var ls = colorS.length; //黑桃个数
    var lh = colorH.length; //红桃个数
    var lc = colorC.length; //梅花个数
    var ld = colorD.length; //方块个数
    var color = [ls, lh, lc, ld];
    var colorSum = []; //总共有几种花色 [5,3,0....]
    for (var i = 0; i < color.length; i++) {
        if (color[i] != 0) {
            colorSum.push(color[i]);
        }
    }
    if (colorSum.length == 1) {
        if (colorSum[0] == 13) {

            if (KQCard.isYiTiaoLong(cards)) {

                var teShuCard = cards.filter(function (i) {
                    return i;
                });

                teShuCard = KQCard.cardsFromArray(teShuCard);

                teShuCard.forEach(function (a) {
                    if (a.scores == 1) a.scores = 14;
                });

                teShuCard.sort(function (a, b) {
                    return b.scores - a.scores;
                });

                teShuCard = KQCard.convertToServerCards(teShuCard);

                var a1 = teShuCard.splice(0, 5);

                var a2 = teShuCard.splice(0, 5);

                cc.teShuPaiCards = [teShuCard, a2, a1];

                return true;
            }
        }
    }
    //return KQCard.isTongHuaShun(cards);
    return false;
};

// 是否是一条龙
KQCard.isLong = function (cards) {
    var length = 13;
    if (cards.length != length) {
        return false;
    }

    return KQCard.isShunZi(cards);
};

/*#####*/
/*是否一条龙*/
KQCard.isYiTiaoLong = function (cards) {
    //cards:{number:1~13 ,'suit':'h'...}
    var length = 13;
    if (cards.length != length) {
        return false;
    }
    var card20 = KQCard.contain20(cards);
    if (card20.length > 0) {
        return false;
    }
    if (typeof cards[0].number == 'undefined') {
        cards = KQCard.convertToServerCards(cards);
    }
    var number = cards.map(function (card) {
        return card.number;
    }).sort(function (n1, n2) {
        return n1 - n2;
    });
    for (var i = 0; i < cards.length - 1; i++) {
        if (number[i] != number[i + 1] - 1) {
            return false;
        }
    }

    var teShuCard = cards.filter(function (i) {
        return i;
    });

    teShuCard = KQCard.cardsFromArray(teShuCard);

    teShuCard.forEach(function (a) {
        if (a.scores == 1) a.scores = 14;
    });

    teShuCard.sort(function (a, b) {
        return b.scores - a.scores;
    });

    teShuCard = KQCard.convertToServerCards(teShuCard);

    var a1 = teShuCard.splice(0, 5);

    var a2 = teShuCard.splice(0, 5);

    cc.teShuPaiCards = [teShuCard, a2, a1];
    //cc.log(cc.teShuPaiCards )
    //cc.log('--------728')
    return true;
};
/*#####*/
/*是否三同花*/
KQCard.isSanTongHua = function (cards) {
    var length = 13;
    if (cards.length != length) {
        return false;
    }
    var card20 = KQCard.contain20(cards);
    if (card20.length > 0) {
        return false;
    }
    if (typeof cards[0].suit == "undefined") {
        cards = KQCard._convertCardsToCardNames(cards);
    }
    var colorS = []; //黑桃
    var colorH = []; //红心
    var colorC = []; //梅花
    var colorD = []; //方块
    for (var i = 0; i < cards.length; i++) {
        if (cards[i].suit == 's') {
            colorS.push(cards[i]);
        } else if (cards[i].suit == 'h') {
            colorH.push(cards[i]);
        } else if (cards[i].suit == 'c') {
            colorC.push(cards[i]);
        } else if (cards[i].suit == 'd') {
            colorD.push(cards[i]);
        }
    }
    var ls = colorS.length; //黑桃个数
    var lh = colorH.length; //红桃个数
    var lc = colorC.length; //梅花个数
    var ld = colorD.length; //方块个数
    var sanCard = [colorS, colorH, colorC, colorD];
    var teShuCard = [];
    var color = [ls, lh, lc, ld];
    var colorSum = []; //总共有几种花色 [5,3,0....]
    for (var i = 0; i < color.length; i++) {
        if (color[i] != 0) {
            colorSum.push(color[i]);
            teShuCard.push(sanCard[i]);
        }
    }

    //三种花色
    if (colorSum.length == 3) {
        for (var i = 0; i < colorSum.length; i++) {
            if (colorSum[i] != 5 && colorSum[i] != 3) {
                return false;
            }
        }
        teShuCard.sort(function (a, b) {
            return a.length - b.length;
        });
        cc.teShuPaiCards = teShuCard;
        return true;
    }
    return false;
};
/*是否凑一色*/
KQCard.isCouYiSe = function (cards) {
    var length = 13;
    if (cards.length != length) {
        return false;
    }
    var card20 = KQCard.contain20(cards);
    if (card20.length > 0) {
        return false;
    }
    if (typeof cards[0].suit == 'undefined') {
        cards = KQCard._convertCardsToCardNames(cards);
    }
    var colorS = []; //黑桃
    var colorH = []; //红心
    for (var i = 0; i < cards.length; i++) {
        if (cards[i].suit == 's' || cards[i].suit == 'c') {
            colorS.push(cards[i]); //全黑
        } else if (cards[i].suit == 'h' || cards[i].suit == 'd') {
                colorH.push(cards[i]); //全红
            }
    }

    //如果牌中包含四种花色就不可能是三同花
    if (colorS.length == 13 || colorH.length == 13) {
        return true;
    }
    //else if(colorH.length == 13){
    //    return true;
    //}
    return false;
};
/*#####*/
// 是否是六对半
KQCard.isLiuDuiBan = function (cards) {
    var length = 12;
    if (cards.length < length) {
        return false;
    }

    var duiZiLength = 2;
    //计算一个牌数组内的相同点数的牌的张数
    var cardNumbers = new GetCardPointsSameCount(cards);
    var numberOfDuiZi = 0;
    var numberOfYi = 0;
    for (var prop in cardNumbers) {
        var value = cardNumbers[prop];
        if (value == duiZiLength || value == 3) {
            numberOfDuiZi = numberOfDuiZi + 1;
        } else if (value == 4) {
            numberOfDuiZi = numberOfDuiZi + 2;
        }
        //else if (value == 6 || value == 7 || value == 5) {
        //    numberOfDuiZi = numberOfDuiZi + 0;
        //}
        else if (value == 1) {
                numberOfYi += 1;
            }
    }

    if (numberOfDuiZi == 6) {

        var teShuCard = cards.filter(function (i) {
            return i;
        });

        teShuCard = KQCard.cardsFromArray(teShuCard);

        teShuCard.forEach(function (a) {
            if (a.scores == 1) a.scores = 14;
        });

        teShuCard.sort(function (a, b) {
            return b.scores - a.scores;
        });

        teShuCard = KQCard.convertToServerCards(teShuCard);

        var a1 = teShuCard.splice(0, 5);

        var a2 = teShuCard.splice(0, 5);

        cc.teShuPaiCards = [teShuCard, a2, a1];

        return true;
    }
    return false;
};

KQCard.isWuDuiSanTiao = function (cards) {
    var length = 13;
    if (cards.length < length) {
        return false;
    }

    var duiZiLength = 2;
    var sanTiaoLength = 3;
    //计算一个牌数组内的相同点数的牌的张数
    var cardNumbers = new GetCardPointsSameCount(cards);
    var numberOfDuiZi = 0;
    var numberOfSanTiao = 0;
    for (var prop in cardNumbers) {
        var value = cardNumbers[prop];
        if (value == duiZiLength) {
            numberOfDuiZi = numberOfDuiZi + 1;
        } else if (value == sanTiaoLength) {
            numberOfSanTiao = numberOfSanTiao + 1;
        } else if (value >= 4) {
            numberOfDuiZi = numberOfDuiZi + 2;
        }
    }
    return numberOfDuiZi == 5 && numberOfSanTiao == 1;
};

//判断5张或者3张是否顺子
KQCard.isShunZi1 = function (arr) {
    //console.log(arr);
    for (var i = 0; i < arr.length - 1; i++) {
        if (arr[i + 1] - arr[i] != 1) {
            //不是顺子
            //console.log("不是顺子");
            return false;
        }
    }
    return true;
};

KQCard.isSanShunZi = function (cards) {
    var length = 13;
    if (cards.length != length) {
        return false;
    }

    if (typeof cards[0].suit == 'undefined') {
        cards = KQCard._convertCardsToCardNames(cards);
    }

    //取出牌的点数
    var number = cards.map(function (card) {
        return card.number;
    });
    //排序
    number.sort(function (n1, n2) {
        return n1 - n2;
    });
    if (KQCard.fenZhu(number, 5, 5) == false) {
        var number = cards.map(function (card) {
            return card.number;
        });
        //排序
        number.sort(function (n1, n2) {
            return n1 - n2;
        });
        if (KQCard.fenZhu(number, 5, 3) == false) {
            var number = cards.map(function (card) {
                return card.number;
            });
            //排序
            number.sort(function (n1, n2) {
                return n1 - n2;
            });
            if (KQCard.fenZhu(number, 3, 5) == false) {
                //不是三顺子
                var AIsExist = false; //是否存在A
                for (var i in cards) {
                    if (cards[i].number == 1) {
                        AIsExist = true;
                        //console.log("存在A");
                        break;
                    }
                }
                if (!AIsExist) {
                    //console.log("退出递归");
                    return false;
                }

                for (var i in cards) {
                    if (cards[i].number == 1) {
                        //console.log("A转为14");
                        cards[i].number = 14;
                        break;
                    }
                }
                if (cc.teShuPaiCards && cc.teShuPaiCards.length > 0 && cc.teShuPaiCards[0][0] && typeof cc.teShuPaiCards[0][0] == 'number') {
                    var newCards = cards.filter(function (i) {
                        return i;
                    });
                    var newCards1 = cc.teShuPaiCards.map(function (arr) {
                        var cad = arr.map(function (number) {
                            for (var i = 0; i < newCards.length; i++) {
                                if (newCards[i].number == number) {
                                    return newCards.splice(i, 1)[0];
                                    break;
                                }
                            }
                        });
                        return cad;
                    });
                    cc.teShuPaiCards = newCards1;
                }
                return KQCard.isSanShunZi(cards);
            }
        }
    }
    if (cc.teShuPaiCards && cc.teShuPaiCards.length > 0 && cc.teShuPaiCards[0][0] && typeof cc.teShuPaiCards[0][0] == 'number') {
        var newCards = cards.filter(function (i) {
            return i;
        });
        var newCards1 = cc.teShuPaiCards.map(function (arr) {
            var cad = arr.map(function (number) {
                for (var i = 0; i < newCards.length; i++) {
                    if (newCards[i].number == number) {
                        return newCards.splice(i, 1)[0];
                        break;
                    }
                }
            });
            return cad;
        });
        cc.teShuPaiCards = newCards1;
    }
    return true;
};

//分组553||535||355
KQCard.fenZhu = function (number, num1, num2) {
    var arr1 = [];
    var arr2 = [];
    var arr3 = [];
    for (var i = 0; i < number.length - 1; i++) {
        if (i == 0) {
            arr1.push(number[0]);
        }
        if (number[i + 1] - number[i] == 0) {
            continue;
        }
        arr1.push(number[i + 1]);
        if (arr1.length == num1) {
            //取第一组是顺子
            if (KQCard.isShunZi1(arr1)) {
                //这5个是顺子,从数组中移除
                for (var i = 0; i < arr1.length; i++) {
                    for (var j = 0; j < number.length; j++) {
                        if (number[j] == arr1[i]) {
                            //两个数一样的只删除一个
                            if (number[j] == number[j + 1]) {
                                continue;
                            }
                            number.splice(j, 1); //从number中移除
                        }
                    }
                }
                /*console.log("删除第一组后的number");
                 console.log(number);*/
                //接下来取第二组
                for (var i = 0; i < number.length - 1; i++) {
                    if (i == 0) {
                        arr2.push(number[0]);
                    }
                    if (number[i + 1] - number[i] == 0) {
                        continue;
                    }
                    arr2.push(number[i + 1]);
                    if (arr2.length == num2) {
                        //取第二组是顺子
                        if (KQCard.isShunZi1(arr2)) {
                            for (var i = 0; i < arr2.length; i++) {
                                for (var j = 0; j < number.length; j++) {
                                    if (number[j] == arr2[i]) {
                                        //两个数一样的只删除一个
                                        if (number[j] == number[j + 1]) {
                                            continue;
                                        }
                                        number.splice(j, 1); //从number中移除
                                    }
                                }
                            }
                            /*console.log("删除第二组后的number");
                             console.log(number);*/
                            arr3 = number;
                            //接下来就是剩下的了
                            if (KQCard.isShunZi1(arr3)) {
                                //第三组也是顺子
                                var asdf = [arr1, arr2, arr3];

                                asdf.sort(function (n1, n2) {
                                    return n1.length - n2.length;
                                });

                                if (!cc.teShuPaiCards) cc.teShuPaiCards = asdf;

                                return true;
                            }
                            //第三组不是顺子
                            return false;
                        }
                        //第二组不是顺子
                        return false;
                    }
                }
            }
            //第一组不是顺子
            return false;
        }
    }
    //如果取不到num1个数
    if (arr1.length < num1) {
        return false;
    }
    if (arr2.length < num2) {
        return false;
    }
};

KQCard.isSanShunZi1 = function (cards) {
    var length = 13;
    if (cards.length != length) {
        return false;
    }
    if (typeof cards[0].point == 'undefined') {
        cards = KQCard.cardsFromArray(cards);
    }
    var card20 = KQCard.contain20(cards);
    if (card20.length > 0) {
        return false;
    }

    cards = Array.from(cards);
    cards.sort(KQCard.sortByPoint);
    var wei = [];
    var zhong = [];
    var tou = [];
    var sanShunZi = KQCard.sanShunZi1(cards)[0]; //获取所有组合的头道
    if (!sanShunZi) {
        //你连头道都没有 怎么更我混
        return false;
    }

    var newCard = cards.filter(function (i) {
        //重新赋值cards
        return i;
    });
    var newCards1 = [];
    var newPoint = []; //判断point是否相同
    var duiZi = []; //取出有对子当中的一张牌
    for (var s in cards) {
        if (newPoint.indexOf(cards[s].point) < 0) {
            newCards1.push(cards[s]);
            newPoint.push(cards[s].point);
        } else {
            //取出有对子当中的一张牌
            duiZi.push(cards[s]);
        }
    }

    for (var j = 0; j < sanShunZi.length; ++j) {
        //循环所有头道
        var number3 = sanShunZi[j];
        if (typeof number3 == 'undefined') {
            continue;
        }
        for (var i = 0; i < cards.length; ++i) {
            var newCards = newCards1.filter(function (i) {
                //重新赋值cards
                return i;
            });

            newCards = newCards.kq_excludes(number3); //删除牌里的头道
            if (wei.length != 5) {
                var subCards = newCards.slice(i, i + 5);
                if (subCards.length == 5 || KQCard.isShunZi(subCards)) {
                    //得到尾道 删除牌里的尾道
                    wei = subCards;
                    // cc.log(number3)
                    // cc.log(newCards1)
                    // cc.log(subCards)
                    // cc.log(newCards)
                    // cc.log(i)
                    // cc.log('-----716')
                    newCards = newCards.kq_excludes(subCards);
                }
            }

            if (wei.length == 5) {
                //把剩余的牌和对子的单张合并
                var tasks = duiZi.filter(function (i) {
                    //重新赋值对子
                    return i;
                });
                tasks = tasks.kq_excludes(number3); //判断头道和对子的单张是否有相同 有的话就删除
                newCards = newCards.concat(tasks); //把剩余的牌和对子的单张合并
            }

            if (zhong.length != 5 && newCards.length == 5) {
                if (KQCard.isShunZi(newCards)) {
                    //是三顺子
                    zhong = newCards;
                }
            }
            if (wei.length == 5 && zhong.length == 5) {
                //是三顺子终止循环
                break;
            } else {
                //来吧 继续吧
                zhong = [];wei = [];tou = [];
            }
        }
        if (wei.length == 5 && zhong.length == 5) {
            //是三顺子终止循环
            tou = number3;
            break;
        } else {
            //来吧 继续吧
            zhong = [];wei = [];tou = [];
        }
    }

    cards = newCard;
    if (KQCard._isSanShunZi(tou, zhong, wei)) {
        //是三顺子
        tou = KQCard.convertToServerCards(tou);
        zhong = KQCard.convertToServerCards(zhong);
        wei = KQCard.convertToServerCards(wei);

        if (!cc.teShuPaiCards) cc.teShuPaiCards = [tou, zhong, wei];
        return true;
    }
    var convertedCards = KQCard._convertOneToA1(cards);
    if (cards === convertedCards) {
        cards.forEach(function (a) {
            if (a.point == 14) a.point = 1;
        });
        //return false;
        return KQCard.isSanShunZi1(cards);
    }
    return KQCard.isSanShunZi(convertedCards);
};

KQCard.sanShunZi1 = function (cards) {
    var length = arguments.length <= 1 || arguments[1] === undefined ? 3 : arguments[1];

    var shunzi = KQCard.findShunZi(cards, length);
    var cardsT = [];
    var cardsIndex = [];
    if (shunzi == null) {
        return false;
    }
    for (var i = 0; i < shunzi.length; i++) {
        var a = shunzi[i];
        var cardsShunzi = [];
        // var cardsIndex = [];
        for (var j = 0; j < a.length; j++) {
            var index = a[j];
            if (typeof cards[index] == 'undefined') {
                continue;
            }
            cardsShunzi.push(cards[index]);
        }
        cardsIndex.push(a);
        cardsT.push(cardsShunzi);
    }
    return [cardsT, cardsIndex];
};

KQCard._isSanShunZi = function (touCards, zhongCards, weiCards) {
    return KQCard.isShunZi(touCards) && KQCard.isShunZi(zhongCards) && KQCard.isShunZi(weiCards);
};
// 是否是三同花顺
KQCard.isSanTongHuaShun = function (cards) {
    var length = 13;
    if (cards.length != length) {
        return false;
    }
    var card20 = KQCard.contain20(cards);
    if (card20.length > 0) {
        return false;
    }
    var colorCardsObject = KQCard._colorClassCards(cards);

    var subCards = [];
    for (var prop in colorCardsObject) {
        var _cards = colorCardsObject[prop];
        subCards.push(_cards);
    }

    if (subCards.length != 3) {
        return false;
    }

    subCards = subCards.sort(function (s1, s2) {
        return s1.length > s2.length;
    });

    var touCards = subCards[0];
    var zhongCards = subCards[1];
    var weiCards = subCards[2];

    if (touCards.length != 3 || zhongCards.length != 5 || weiCards.length != 5) {
        return false;
    }

    return KQCard._isSanTongHuaShun(touCards, zhongCards, weiCards);
};

// 将牌根据 color 进行分类
KQCard._colorClassCards = function (cards) {
    var colorCardsObject = {};
    cards.forEach(function (card) {
        var color = card.color;
        var subCards = colorCardsObject[color];
        if (!subCards) {
            subCards = [];
            colorCardsObject[color] = subCards;
        }
        subCards.push(card);
    });

    return colorCardsObject;
};

// 是否是三同花顺
KQCard._isSanTongHuaShun = function (touCards, zhongCards, weiCards) {
    return KQCard.isTongHuaShun(touCards) && KQCard.isTongHuaShun(zhongCards) && KQCard.isTongHuaShun(weiCards);
};

// 是否是 “三分天下”
KQCard.isSanFenTianXia = function (cards) {
    var length = 13;
    if (cards.length < length) {
        return false;
    }

    var tieZhiLength = 4;
    var pointHelper = new KQCardPointsHelper(cards);
    var numberOfTieZhi = 0;
    for (var prop in pointHelper.pointNumbers) {
        var value = pointHelper.pointNumbers[prop];
        if (value == tieZhiLength) {
            numberOfTieZhi = numberOfTieZhi + 1;
        }
    }
    return numberOfTieZhi === 3;
};

// 是否是 “四套三条”
KQCard.isSiTaoSanTiao = function (cards) {
    var length = 13;
    if (cards.length < length) {
        return false;
    }
    var sanTiaoLength = 3;
    var pointHelper = new KQCardPointsHelper(cards);
    var numberOfSanTiao = 0;
    for (var prop in pointHelper.pointNumbers) {
        var value = pointHelper.pointNumbers[prop];
        if (value == sanTiaoLength) {
            numberOfSanTiao = numberOfSanTiao + 1;
        }
    }

    return numberOfSanTiao == 4;
};

// 是否是 “三桃花”
// 头、中、尾道为相同花色的牌
KQCard.isSanTaoHua = function (cards) {
    var length = 13;
    if (cards.length < length) {
        return false;
    }
    var card20 = KQCard.contain20(cards);
    if (card20.length > 0) {
        return false;
    }
    var colorHelper = new KQCardColorsHelper(cards);
    var colorNumbers = [];
    for (var prop in colorHelper.colorNumber) {
        colorNumbers.push(colorHelper.colorNumber[prop]);
    }

    colorNumbers.sort(function (n1, n2) {
        return n1 - n2;
    });

    if (colorNumbers.length != 3) {
        return false;
    }

    if (colorNumbers[0] == 3 && colorNumbers[1] == 5 && colorNumbers[2] == 5) {
        return true;
    }

    return false;
};

// 判断是否包含铁支
// 四张同样点数的牌
KQCard.containTieZhi = function (cards) {
    var length = 4;
    if (cards.length < length) {
        return false;
    }
    var card20 = KQCard.contain20(cards);
    cards = cards.kq_excludes(card20);
    length = length - card20.length;
    var helper = new KQCardPointsHelper(cards);

    for (var w in helper.pointNumbers) {
        var maxNumber = helper.pointNumbers[w];
        if (maxNumber >= length) {
            card20.forEach(function (ca) {
                ca.scores = parseInt(w);
            });
            return true;
        }
    }
    //if(helper.maxNumber() >= length){
    //    return helper.maxNumber() >= length;
    //}
    // else{
    //    return KQCard.containGuiPai(cards,4);
    //}
    //if (KQCard.findTieZhi(cards).length > 0) {
    //    return true;
    //}
    return false;
};

// 判断是否是铁支
KQCard.isTieZhi = function (cards) {
    var length = 4;
    if (cards.length != length) {
        return false;
    }

    var result = cards.reduce(function (point, card) {
        if (point == card.point) {
            return point;
        }
        return -1;
    }, cards[0].point);

    return result != -1;
};

/*#####是否包含五同*/
//五张同样点数的牌
KQCard.containWuTong = function (cards) {
    var length = 5;
    if (cards.length < length) {
        return false;
    }
    var card20 = KQCard.contain20(cards);
    cards = cards.kq_excludes(card20);
    length = length - card20.length;
    //五张牌相同的
    var helper = new KQCardPointsHelper(cards);
    //for(var w in helper.pointNumbers) {
    //    cc.log(w)
    //}
    //cc.log(cards)
    //cc.log(helper)
    //cc.log(card20)
    //cc.log(helper.maxNumber())
    //cc.log('------1307')
    //if(helper.maxNumber() >= length){
    //    return helper.maxNumber() >= length;
    //}
    for (var w in helper.pointNumbers) {
        var maxNumber = helper.pointNumbers[w];
        if (maxNumber >= length) {
            card20.forEach(function (ca) {
                ca.scores = parseInt(w);
            });
            return helper.maxNumber() >= length;
        }
    }
    return false;
};

/*判断是否五同*/
KQCard.isWuTong = function (cards) {
    var length = 5;
    if (cards.length != length) {
        return false;
    }

    var result = cards.reduce(function (point, card) {
        if (point == card.point) {
            return point;
        }
        return -1;
    }, cards[0].point);

    return result != -1;
};
/*#####*/

// 是否是 “葫芦”
// 三张相同 + 一对
KQCard.containHuLu = function (cards) {
    var length = 5;
    if (cards.length < length) {
        return false;
    }
    if (KQCard.findHuLu(cards).length > 0) {
        return true;
    }
    //let pointHelper = new KQCardPointsHelper(cards);
    //var pointNumbers = [];
    //var index = 0;
    //for (let prop in pointHelper.pointNumbers) {
    //    pointNumbers[index] = pointHelper.pointNumbers[prop];
    //    index = index + 1;
    //}
    //var h=[];
    //var h1=[];
    //for(var i in pointNumbers){
    //    var s=pointNumbers[i];
    //    if(s == 3){
    //        h.push(s)
    //    }
    //    else if(s==4){
    //        h1.push(s)
    //    }
    //
    //}
    //
    //if ((pointNumbers.indexOf(3) != -1) && (pointNumbers.indexOf(2) != -1)
    // || h.length > 1 || h1.length > 1 ||(pointNumbers.indexOf(4) != -1)
    // && (pointNumbers.indexOf(2) != -1)) {
    //    return true;
    //}

    return false;
};

// 判断是否是 葫芦
KQCard.isHuLu = function (cards) {
    if (cards.length != 5) {
        return false;
    }

    var points = cards.map(function (card) {
        return card.point;
    }).sort(function (p1, p2) {
        return p1 - p2;
    });

    var p1 = points[0];
    var p2 = p1;
    var numberP1 = 0;
    var numberP2 = 0;

    points.forEach(function (point) {
        if (point != p1 && point != p2) {
            p2 = point;
            numberP2 = 0;
        }

        numberP1 = numberP1 + (point == p1 ? 1 : 0);
        numberP2 = numberP2 + (point == p2 ? 1 : 0);
    });

    var maxNumber = Math.max(numberP1);
    var minNumber = Math.min(numberP2);

    return minNumber == 2 && maxNumber == 3;
};

// 是否包含有 “三条”
KQCard.containSanTiao = function (cards) {
    var length = 3;
    if (cards.length < length) {
        return false;
    }
    //if (KQCard.findSanTiao(cards).length > 0) {
    //    return true;
    //}
    var card20 = KQCard.contain20(cards);
    cards = cards.kq_excludes(card20);
    length = length - card20.length;
    var pointHelper = new KQCardPointsHelper(cards);
    for (var w in pointHelper.pointNumbers) {
        var maxNumber = pointHelper.pointNumbers[w];
        if (maxNumber >= length) {
            card20.forEach(function (ca) {
                ca.scores = parseInt(w);
            });
            return true;
        }
    }
    //for (let prop in pointHelper.pointNumbers) {
    //    if (pointHelper.pointNumbers[prop] >= length) {
    //        return true;
    //    }
    //}
    return false;

    //
    //return KQCard.containGuiPai(cards,3);
};

// 是否是 “三条”
KQCard.isSanTiao = function (cards) {
    if (cards.length != 3) {
        return false;
    }

    var result = cards.reduce(function (point, card) {
        if (card.point == point) {
            return point;
        }

        return -1;
    }, cards[0].point);

    return result != -1;
};

// 是否包含有 ：两对
KQCard.containLiaDui = function (cards) {
    if (cards.length < 4) {
        return false;
    }
    if (KQCard.findLiaDui(cards).length > 0) {
        return true;
    }
    //var numberOfDuiZi = 0;
    //let pointHelper = new KQCardPointsHelper(cards);
    //for (let prop in pointHelper.pointNumbers) {
    //    if (pointHelper.pointNumbers[prop] == 2) {
    //        numberOfDuiZi = numberOfDuiZi + 1;
    //        if (numberOfDuiZi == 2) {
    //            return true;
    //        }
    //    }
    //}

    return false;
};

// 是否是 两对
KQCard.isLiaDui = function (cards) {
    if (cards.length != 4) {
        return false;
    }

    var pointHelper = new KQCardPointsHelper(cards);
    for (var prop in pointHelper.pointNumbers) {
        if (pointHelper.pointNumbers[prop] != 2) {
            return false;
        }
    }
    return true;
};

// 是不是对子
KQCard.isDuiZi = function (cards) {
    if (cards.length != 2) {
        return false;
    }

    var card1 = cards[0];
    var card2 = cards[1];

    return card1.point == card2.point;
};

// 是否包含对子
KQCard.containDuiZi = function (cards) {
    var length = 2;
    if (cards.length < length) {
        return false;
    }
    //if (KQCard.findDuiZi(cards).length > 0) {
    //    return true;
    //}
    var card20 = KQCard.contain20(cards);
    cards = cards.kq_excludes(card20);
    length = length - card20.length;
    var pointHelper = new KQCardPointsHelper(cards);
    //for (let prop in pointHelper.pointNumbers) {
    //    if (pointHelper.pointNumbers[prop] >= length) {
    //        return true;
    //    }
    //}
    for (var w in pointHelper.pointNumbers) {
        var maxNumber = pointHelper.pointNumbers[w];
        if (maxNumber >= length) {
            card20.forEach(function (ca) {
                ca.scores = parseInt(w);
            });
            return true;
        }
    }
    return false;
    //return KQCard.containGuiPai(cards,2);
};

KQCard.containGuiPai = function (cards, length) {
    if (cards.length < length) {
        return false;
    }
    var card20 = KQCard.contain20(cards);
    cards = cards.kq_excludes(card20);
    var helper = new KQCardPointsHelper(cards);
    var maxNumber = helper.maxNumber() + card20.length;
    return maxNumber >= length;
};
/*#####*/
// 是否是特殊牌
KQCard.isTeShuPai = function (cards) {
    if (cards.length < 13) {
        return false;
    }

    return KQCard.isQingLong(cards) || KQCard.isYiTiaoLong(cards) || KQCard.isLiuDuiBan(cards) || KQCard.isSanShunZi(cards) || KQCard.isSanTongHua(cards)
    /*|| KQCard.isSanTongHuaShun(cards)
     || KQCard.isSanFenTianXia(cards)
     || KQCard.isSiTaoSanTiao(cards)
      || KQCard.isWuDuiSanTiao(cards)
     || KQCard.isCouYiSe(cards)*/;
};

// 将牌中的 1 变化为 A（14)
KQCard._convertOneToA = function (cards) {
    if (cards.find(function (card) {
        return card.point == 1;
    }) == undefined) {
        return cards;
    }
    var result = cards.map(function (card) {
        if (card.point == 1) {
            var newCard = new KQCard(14, card.color);
            return newCard;
        }
        return card;
    });

    return result;
};

KQCard._convertOneToA1 = function (cards) {
    if (cards.find(function (card) {
        return card.point == 1;
    }) == undefined) {
        return cards;
    }
    var num = 0;
    var result = cards.map(function (card) {
        if (card.point == 1 && num == 0) {
            num++;
            var newCard = new KQCard(14, card.color);
            return newCard;
        }
        return card;
    });

    return result;
};

// KQCard 的排序方法
KQCard.sortByPoint = function (card1, card2) {
    var result = Number(card1.point) - Number(card2.point);
    return result;
};

KQCard.sortByColor = function (card1, card2) {
    var pointAsc = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

    if (card2.color == card1.color) {
        return (card1.point - card2.point) * (pointAsc ? 1 : -1);
    }
    return card2.color - card1.color;
};

KQCard.sort = function (card1, card2) {
    var asc = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
    var AisMax = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

    var result = 1;
    if (card1.point == card2.point) {
        result = card1.color - card2.color;
    } else {
        var point1 = card1.point;
        var point2 = card2.point;
        if (AisMax && point1 == 1) {
            point1 = 14;
        }

        if (AisMax && point2 == 1) {
            point2 = 14;
        }

        result = point1 - point2;
    }

    return result * (asc ? 1 : -1);
};

//转为客户端的牌
KQCard._convertCardsToCardNames = function (cards) {
    // [{"suit":"s","number":10}]
    var suitColorMap = ['', 'd', 'c', 'h', 's'];
    return cards.map(function (card) {
        var cardNumber = card.point;
        var color = suitColorMap[card.color];
        var number = Math.max(Math.min(cardNumber, 13), 1);
        return { number: number, suit: color };
    });
};