const Socket = require('socket');
const KQGlobalEvent = require('KQGlobalEvent');
const ArrayExtension = require('ArrayExtension');
const UserModelHelper = require('UserModelHelper');
const Playback = require('Playback');
cc.Class({
    extends: cc.Component,

    properties: {
        foldCardNode: cc.Node,      // 牌盖着时的样子
        foldCardNode1: cc.Node,      // 牌盖着时的样子
        cardsBackLayout: cc.Layout, // 13张牌背影，可用来展示发牌动画 含 cardsBack Component
        compareCardsNode: cc.Node,  // compareCards   含 CompareCards Component
        userInfoNode: cc.Node,          // 包含用户信息 含 userInfo Component
        chatMessageNode: cc.Node,       // 聊天消息 包含 ChatMessage Component
        userAvatarNode: cc.Node,
        userSampleInfoNode: cc.Node,
        id:cc.Label,
        userId: 0,
      /*#####*/
        teShuPaiLabel:cc.Node,
        cardTypePrefab: cc.Prefab,
      // 用户信息
      // 1、 如果 包含：cardInfo:[]，表明用户已经出牌
      //
        _userInfo: null,
        _deskInfo: null,
        /**/
        playedCompareCardsIndexs: {
            visible: false,
            default: undefined,
        }
        /**/
    },

    // use this for initialization
    onLoad: function () {
      this.userAvatarNode.on(cc.Node.EventType.TOUCH_START, this._showUserInfo, this);
      this.reset();
    },

    onDestroy: function () {
      this.userAvatarNode.off(cc.Node.EventType.TOUCH_START, this._showUserInfo, this);
    },

    _showUserInfo: function () {
      this.userSampleInfoNode.getComponent('UserSampleInfo').updateWithUser(this._userInfo);
    },

    reset: function () {
        this.foldCardNode.active = false;
        this.foldCardNode1.active = false;
      this.teShuPaiLabel.active = false;
      this.cardsBackLayout.active = false;
      this.compareCardsNode.active = false;
      this.compareCardsNode.getComponent('CompareCards').reset();
    },

    /*####*/
    reset2: function () {
        this.foldCardNode.active = false;
        this.foldCardNode1.active = false;
      this.teShuPaiLabel.active = false;
      this.cardsBackLayout.active = false;
      //this.compareCardsNode.active = false;
      //this.compareCardsNode.getComponent('CompareCards').reset();
    },
    /*#####*/

    updateUserInfoWithUsers: function (users) {
      let user = users.find(function (e) {
        return this.userId == e.id;
      }.bind(this));

      this.updateUserInfo(user);
    },

    updateUserInfo: function (user) {
      this._userInfo = user;
      this.node.active = (user != null);
      this.userInfoNode.active = this.node.active;
      if (!user) {
        return;
      }

      let userInfo = this.userInfoNode.getComponent('userInfo');
      userInfo.updateAvatar(user.avatarUrl);
      userInfo.updateNickname(user.nickname);
      userInfo.setOfflineVisible(!user.onlineStatus);

      //if (this._deskInfo && this._deskInfo.cIndex > 0) {
      //  if (UserModelHelper.isPlayedCards(user)) {
      //    this.playCard(user.id);
      //    this.compareCardsNode.getComponent('CompareCards').setCompareData(user);
      //  }
      //}
        /**/
        const cIndex = this._deskInfo.cIndex;
        if (this._deskInfo && cIndex > 0 && (this.playedCompareCardsIndexs.indexOf(cIndex) == -1)) {
            if (UserModelHelper.isPlayedCards(user)) {
                this.playCard(user.id,user.cardInfo);
                this.compareCardsNode.getComponent('CompareCards').setCompareData(user);
            }
        }
        /**/
    },

    // 更新房主信息
    updateBanker: function() {
      let userInfoComp = this.userInfoNode.getComponent('userInfo');
      if (!this._userInfo) {
        userInfoComp.setIsBanker(false);
        return;
      }

      let isBanker = this._userInfo ? this._userInfo.isBanker : false;
      userInfoComp.setIsBanker(isBanker);      
    },

    showFangZhuStatus: function (createId, visible = true) {
        if (!this.node.active) {
            return;
        }
        if (this._userInfo.id == createId) {
            this.userInfoNode.getComponent('userInfo').setFangZhuNodeVisible(visible);
        }
    },

    /**
     * 更新分数 
     * 
     * @param {Number} score 用户分数、可选
     */
    updateScore: function(score) {
      if (!score && this._userInfo) {
        score = this._userInfo.totalScore;
      }

      let userInfo = this.userInfoNode.getComponent('userInfo');
      userInfo.updateScore(score);
    },

    showReadyStatus: function (userId, visible = true) {
      if (!this.node.active) {
        return;
      }

      if (this._userInfo.id == userId) {
        this.userInfoNode.getComponent('userInfo').setReadyNodeVisible(visible);
      }
    },

    /*setDeskInfo: function (deskInfo) {
     this._deskInfo = deskInfo;
     },*/
    updateDeskInfo: function (deskInfo) {
        this._deskInfo = deskInfo;

        if (deskInfo && !deskInfo.isCBegin) {
            this.reset();
        }
    },
    /**/

    hideReadyStatus: function () {
      this.userInfoNode.getComponent('userInfo').setReadyNodeVisible(false);
    },

    playFaPaiAnimation: function () {
      cc.log("playFaPaiAnimation");
      if (!this.node.active) {
        return;
      }

      if (UserModelHelper.isPlayedCards(this._userInfo)) {
        return;
      }

      let cardsBack = this.cardsBackLayout.getComponent('cardsBack');
      cardsBack.showPlayCardBacks();
    },

    shouldShowFaPaiAnimation: function () {
      return UserModelHelper.isPlayedCards(this._userInfo);
    },

    setUserOnlineStatus: function (userId, status = 1) {
      if (userId != this.userId) {
        return;
      }

      let userInfo = this.userInfoNode.getComponent('userInfo');
      userInfo.setOfflineVisible(status != 1);
    },

    showChatText: function (userId, message) {
      if (userId != this.userId) {
        return;
      }

      let chatMessage = this.chatMessageNode.getComponent('ChatMessage');
      chatMessage.setString(message);
    },

    // 用户已经出牌，处于三堆盖着牌的状态
    playCard: function (userId,cardInfo) {
      if (this.userId != userId) {
        return;
      }

      this.cardsBackLayout.node.active = false;
      this.compareCardsNode.active = false;
      this.teShuPaiLabel.active = false;
      /*#####如果是特殊牌就显示特殊牌型这四个字在盖着牌的上面*/
      var play = cc.find("Canvas").getComponent("play");  //play组件
      //如果点击了恭喜你页面的确定按钮
      //if(this.compareCardsNode.getComponent("CardTypeCombine").BtnClickGongXiNiComfirm){
          if(cc.moshi != 1){
              if(play.getIsTeShuPai(this.userId)){
                  this.teShuPaiLabel.active = true;
              }else{
                  this.teShuPaiLabel.active = false;
              }
          }
        cc.log(this)
        cc.log('------229')
        if (Playback.instance.isPlaybacking()) {//"回放";
            this.foldCardNode1.active = true;
            return;
        }
        if(this.name != "playSelf<Player>"){
            return;
        }
        this.foldCardNode.active = true;
        for(var i = 0; i < 3;i++){
            var node = this.foldCardNode.children[i];
            node.removeAllChildren();
            var cardModes = [];
            for(var j = 0; j < cardInfo[i].cards.length;j++){
                var s = cardInfo[i].cards[j];
                cardModes.push(s);
            }
            cardModes = cardModes.map(function(serCard){
                return serCard.suit+'_'+serCard.number;
            });
            cardModes.forEach(function (cardName) {
                let cardTypeSprite = cc.instantiate(this.cardTypePrefab);
                if(cc.maPai){
                    var cardMaPai = '3_' + cc.maPai;
                    if(cardName == cardMaPai){
                        cardTypeSprite.color = new cc.Color(226, 145, 145);
                    }
                }
                cardTypeSprite.width = 66;
                cardTypeSprite.height = 92;
                cardTypeSprite.getComponent('CardTypeSprite').setCard(cardName);
                node.addChild(cardTypeSprite);
            }.bind(this));
        }
        //}

    },

    // 准备好开始比牌
    readyToCompareCards: function () {
      this.cardsBackLayout.node.active = false;
      this.compareCardsNode.active = true;
      this.foldCardNode.active = false;
      this.teShuPaiLabel.active = false;
    },

    // 播放打枪动画
    // @param userId   要主动打枪的用户id
    // @param toUserIndex  挨枪的用户的 index
    playShootAnimation: function (userId, toUserIndex) {
      if (userId != this.userId) {
        return;
      }

      let userInfo = this.userInfoNode.getComponent('userInfo');
      userInfo.playShootAnimation(toUserIndex);
    },

    // 播放中枪动画
    playBulletHoleAnimation: function (userId) {
      if (userId != this.userId) {
        return;
      }

      let userInfo = this.userInfoNode.getComponent('userInfo');
      userInfo.playBulletHoleAnimation();
    },

    // 播放全垒打动画
    playHomeRunAimation: function (userId) {
      if (userId != this.userId) {
        return;
      }

      let userInfo = this.userInfoNode.getComponent('userInfo');
      userInfo.playHomeRunAimation();
    },

    playSpeakAnimation: function (userId) {
      if (userId != this.userId) {
        return;
      }

      let userInfo = this.userInfoNode.getComponent('userInfo');
      userInfo.playSpeakAnimation();
    },

    nextCompareScore: function () {
      if (!this.node.active) {
        return 0;
      }

      let score = this.compareCardsNode.getComponent('CompareCards').nextCompareScore();
      return score;
    },

    showNextCompareCards: function () {
      if (this.nextCompareScore() <= 0) {
        return;
      }

      this.compareCardsNode.getComponent('CompareCards').showNextCards();
    },
});
