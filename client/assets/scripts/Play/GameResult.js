const KQCard = require('KQCard');
const AudioManager = require('AudioManager');

let ResultStatus = {
  WIN: 2,
  DRAW: 1,
  LOSE: 0,
};


let GameResult = cc.Class({
  extends: cc.Component,

  properties: {
    winNode: cc.Node,
    loseNode: cc.Node,
    drawNode: cc.Node,
    contentNode: cc.Node,

    resultItems: [cc.Node],

    _deskInfo: null,
    _userId: null,
    _closeCallback: null,
  },

  // use this for initialization
  onLoad: function () {
    this._hideResultItems();
  },

  showResults: function (deskInfo, currentUserId) {
    this._deskInfo = deskInfo;
    this._userId = currentUserId;

    let resultStatus = this._resultStatus();
    this.contentNode.active = true;
    this.winNode.active =  (resultStatus == ResultStatus.WIN);
    this.drawNode.active = (resultStatus == ResultStatus.DRAW);
    this.loseNode.active = (resultStatus == ResultStatus.LOSE);

    if (this.winNode.active) {
      AudioManager.instance.playWin();
    } else if (this.loseNode.active) {
      AudioManager.instance.playLose();
    }

    this.node.getComponent('alert').alert();
    this.node.getComponent('alert').setDismissCallback(function () {
      this._closeCallback
    }.bind(this));

    let playerInfos = deskInfo.players.sort(function (p1, p2) {
      return p2.cScore - p1.cScore;
    });
    let itemComps = this.resultItems.map(function (node) {
      return node.getComponent('ResultItem');
    });
    itemComps.forEach(function (itemComp, index) {
      itemComp.node.active = index < playerInfos.length;
      if (!itemComp.node.active) {
        return;
      }

      let user = playerInfos[index];
      itemComp.updateWithPlayerInfo(user, deskInfo.isRandomDesk);
      let cards = this._cardsFromUser(user);
      itemComp.setCards(cards);
    }.bind(this));
  },

  setCloseCallback: function (callback) {
    this._closeCallback = callback;
  },

  _cardsFromUser: function (user) {
    let cards = user.cardInfo.map(function (cardInfoItem) {
      return KQCard.cardsFromArray(cardInfoItem.cards);
    }).reduce(function (array, subCards) {
      return array.concat(subCards);
    }, []);

    return cards;
  },

  _hideResultItems: function () {
    this.resultItems.forEach(function (node) {
      node.acitve = false;
    });
  },

  _resultStatus: function() {
    let playerInfos = this._deskInfo.players;
    let user = playerInfos.find(function (user) {
      return user.id == this._userId;
    }.bind(this));

    let score = user.cScore;
    if (this._deskInfo.isRandomDesk) {
      // 如果是随机场的话，应该用钻石来判断输赢
      score = user.diamond;
    }

    if (score > 0) {
      return ResultStatus.WIN;
    } else if (score < 0) {
      return ResultStatus.LOSE;
    }

    return ResultStatus.DRAW;
  },
});

module.exports = GameResult;
