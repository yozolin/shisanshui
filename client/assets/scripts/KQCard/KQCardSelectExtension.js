const KQCard = require('KQCard');
const KQCardFindTypeExtension = require('KQCardFindTypeExtension');

// 牌自动选择的扩展

/**
 * 自动选择牌，由大到小
 *
 * @param  {[KQCard]} originCards  被选择的原始牌数组
 *
 * @return {[KQCard]}
 */
KQCard.autoSelectCards = function(originCards, maxLength) {
    if (originCards.length <= maxLength) {
        return originCards;
    }
    originCards.forEach(function(card){
        if(card.scores == 1){
            card.scores = 14;
        }
    });
    let cards = originCards.slice().sort(function(a,b){
        return a.scores - b.scores;
    });

    let findFuncs = [
        KQCard.findWuTong,
        KQCard.findTongHuaShun,
        KQCard.findTieZhi,
        KQCard.findHuLu,
        KQCard.findTongHua,
        KQCard.findShunZi,
        KQCard.findSanTiao,
        KQCard.findLiaDui,
        KQCard.findDuiZi
    ];

    let indexArrays = null;
    for (let i = 0; i < findFuncs.length; ++i) {
        let func = findFuncs[i];
        indexArrays = (func.bind(KQCard))(cards);
        if (indexArrays && indexArrays.length > 0) {
            break;
        }
    }

    var indexs = [];
    if (indexArrays && indexArrays.length > 0) {
        // 找出同类型的牌里的分数最大的牌
        var maxScore = 0;
        indexArrays.forEach(tempIndexs => {
            const tempCards = tempIndexs.map(index => cards[index]);
        const score = KQCard.scoreOfCards(tempCards);
        if (score > maxScore) {
            maxScore = score;
            indexs = tempIndexs;
        }
    });
    }

    let targetCards = indexs.map(function(index) {
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

KQCard.testAutoSelect = function(cards) {

};