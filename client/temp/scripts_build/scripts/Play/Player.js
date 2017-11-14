"use strict";
cc._RFpush(module, '6ffa0O02PFOp78QADTW5zGf', 'Player');
// scripts\Play\Player.js

var Socket = require('socket');
var KQGlobalEvent = require('KQGlobalEvent');
var ArrayExtension = require('ArrayExtension');
var UserModelHelper = require('UserModelHelper');
var Playback = require('Playback');
var KQCardResHelper = require('KQCardResHelper');
var KQCard = require('KQCard');
var AudioManager = require('AudioManager');

cc.Class({
    'extends': cc.Component,

    properties: {
        foldCardNode: cc.Node, // 牌盖着时的样子
        teShuPaiNode: cc.Node, // 特殊牌盖着时的样子
        cardsBackLayout: cc.Layout, // 13张牌背影，可用来展示发牌动画 含 cardsBack Component
        compareCardsNode: cc.Node, // compareCards   含 CompareCards Component
        userInfoNode: cc.Node, // 包含用户信息 含 userInfo Component
        chatMessageNode: cc.Node, // 聊天消息 包含 ChatMessage Component
        userAvatarNode: cc.Node,
        //userSampleInfoNode: cc.Node,
        bulletHolePrefab: cc.Prefab, //中枪
        bulletHoleNode: cc.Node, //中枪
        shotNode: [cc.Node], //打枪
        userId: 0,
        cardTypePrefab: cc.Prefab,
        // 用户信息
        // 1、 如果 包含：cardInfo:[]，表明用户已经出牌
        //
        _userInfo: null,
        _deskInfo: null,
        /**/
        playedCompareCardsIndexs: {
            visible: false,
            'default': undefined
        }
        /**/
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.userAvatarNode.on(cc.Node.EventType.TOUCH_START, this._showUserInfo, this);
        this.reset();
        this.foldCardNodeBack = false; //判断是否点击了拍的背影
        this.cardSpriteAtlas = this.node.parent.getComponent('play').cardSpriteAtlas;
    },

    onDestroy: function onDestroy() {
        this.userAvatarNode.off(cc.Node.EventType.TOUCH_START, this._showUserInfo, this);
    },

    click_leave: function click_leave() {
        var userid = Socket.instance.userInfo.id;
        var leaveId = this._userInfo.id;
        Socket.sendQingli(leaveId, userid);
    },

    _showUserInfo: function _showUserInfo() {
        //this.userSampleInfoNode.getComponent('UserSampleInfo').updateWithUser(this._userInfo);
    },

    reset: function reset() {
        this.foldCardNode.active = false;
        this.cardsBackLayout.active = false;
        this.compareCardsNode.active = false;
        this.teShuPaiNode.active = false;
        this.bulletHoleNode.active = false;
        this.bulletHoleNode.removeAllChildren();
        this.bulletHoleNode.children.forEach(function (node) {
            node.active = false;
        });
        if (this.shotNode.length > 0) this.shotNode.forEach(function (node) {
            if (node) node.active = false;
        });
        this.compareCardsNode.getComponent('CompareCards').reset();
        this.compareCardsNode.getComponent('CompareCards').unscheduleAllCallbacks();
    },

    /*####*/
    reset2: function reset2() {
        this.foldCardNode.active = false;
        this.cardsBackLayout.active = false;
        this.teShuPaiNode.active = false;
        this.bulletHoleNode.active = false;
        this.bulletHoleNode.removeAllChildren();
        this.bulletHoleNode.children.forEach(function (node) {
            node.active = false;
        });
        if (this.shotNode.length > 0) this.shotNode.forEach(function (node) {
            if (node) node.active = false;
        });
        //this.compareCardsNode.active = false;
        //this.compareCardsNode.getComponent('CompareCards').reset();
    },
    /*#####*/

    updateUserInfoWithUsers: function updateUserInfoWithUsers(users) {
        var user = users.find((function (e) {
            return this.userId == e.id;
        }).bind(this));

        this.updateUserInfo(user);
    },
    showQingli: function showQingli(creator, index) {
        if (!this.node.active) {
            return;
        }
        if (index > 0) {
            this.userInfoNode.getComponent('userInfo').setqingli(false);
        } else {
            if (creator) {
                this.userInfoNode.getComponent('userInfo').setqingli(false);
            } else {
                this.userInfoNode.getComponent('userInfo').setqingli(true);
            }
        }
    },
    updateUserInfo: function updateUserInfo(user) {
        this._userInfo = user;
        this.node.active = user != null;
        this.userInfoNode.active = this.node.active;
        if (!user) {
            return;
        }

        var userInfo = this.userInfoNode.getComponent('userInfo');
        userInfo.updateAvatar(user.avatarUrl);
        userInfo.updateUserId(user.id);
        userInfo.updateNickname(user.nickname);
        userInfo.setOfflineVisible(!user.onlineStatus);

        //if (this._deskInfo && this._deskInfo.cIndex > 0) {
        //  if (UserModelHelper.isPlayedCards(user)) {
        //    this.playCard(user.id);
        //    this.compareCardsNode.getComponent('CompareCards').setCompareData(user);
        //  }
        //}
        /**/
        var cIndex = this._deskInfo.cIndex;
        if (this._deskInfo && cIndex > 0 && this.playedCompareCardsIndexs.indexOf(cIndex) == -1) {
            if (UserModelHelper.isPlayedCards(user)) {
                this.playCard(user.id, user.cardInfo);
                this.compareCardsNode.getComponent('CompareCards').setCompareData(user);
            }
        }
        /**/
    },

    // 更新房主信息
    updateBanker: function updateBanker() {
        var userInfoComp = this.userInfoNode.getComponent('userInfo');
        if (!this._userInfo) {
            userInfoComp.setIsBanker(false);
            return;
        }

        var isBanker = this._userInfo ? this._userInfo.isBanker : false;
        userInfoComp.setIsBanker(isBanker);
    },

    showFangZhuStatus: function showFangZhuStatus(createId) {
        var visible = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

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
    updateScore: function updateScore(score) {
        if (!score && this._userInfo) {
            score = this._userInfo.totalScore;
        }

        var userInfo = this.userInfoNode.getComponent('userInfo');
        userInfo.updateScore(score);
    },

    showReadyStatus: function showReadyStatus(userId) {
        var visible = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

        if (!this.node.active) {
            return;
        }

        if (this._userInfo.id == userId) {
            this.userInfoNode.getComponent('userInfo').setReadyNodeVisible(visible);
        }
    },
    showBeilv: function showBeilv(userId, bl) {
        if (!this.node.active) {
            return;
        }
        if (this._userInfo.id == userId) {
            this.userInfoNode.getComponent('userInfo').setBeilvLabel(bl);
        }
    },
    /*setDeskInfo: function (deskInfo) {
     this._deskInfo = deskInfo;
     },*/
    updateDeskInfo: function updateDeskInfo(deskInfo) {
        this._deskInfo = deskInfo;

        if (deskInfo && !deskInfo.isCBegin) {
            this.reset();
        }
    },
    /**/

    hideReadyStatus: function hideReadyStatus() {
        this.userInfoNode.getComponent('userInfo').setReadyNodeVisible(false);
    },

    playFaPaiAnimation: function playFaPaiAnimation() {
        if (!this.node.active) {
            return;
        }
        if (UserModelHelper.isPlayedCards(this._userInfo)) {
            return;
        }
        var cardsBack = this.cardsBackLayout.getComponent('cardsBack');
        cardsBack.showPlayCardBacks();
    },

    shouldShowFaPaiAnimation: function shouldShowFaPaiAnimation() {
        return UserModelHelper.isPlayedCards(this._userInfo);
    },

    setUserOnlineStatus: function setUserOnlineStatus(userId) {
        var status = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

        if (userId != this.userId) {
            return;
        }

        var userInfo = this.userInfoNode.getComponent('userInfo');
        userInfo.setOfflineVisible(status != 1);
    },

    showChatText: function showChatText(userId, message) {
        if (userId != this.userId) {
            return;
        }

        var chatMessage = this.chatMessageNode.getComponent('ChatMessage');
        chatMessage.setString(message);
    },

    // 用户已经出牌，处于三堆盖着牌的状态
    playCard: function playCard(userId, cardInfo) {
        if (this.userId != userId) {
            return;
        }

        this.cardsBackLayout.node.active = false;
        this.compareCardsNode.active = false;
        this.foldCardNode.targetOff(this.foldCardNode);
        this.foldCardNode.active = true;
        this.foldCardNode.children.slice(0, 3).forEach((function (node) {
            node.active = true;
            node.children.forEach((function (noe) {
                noe.active = true;

                var cardSprite = noe.getComponent('cc.Sprite');

                var path = 'public-pic-card-poker-back';

                this._loadCardFrame(this.cardSpriteAtlas, path, cardSprite);
            }).bind(this));
        }).bind(this));
        this.foldCardNode.on(cc.Node.EventType.TOUCH_END, (function (event) {
            this._clickFoldCardNode(event);
        }).bind(this), this.foldCardNode);
    },

    _clickFoldCardNode: function _clickFoldCardNode(event) {

        if (this.userId != Socket.instance.userInfo.id) return;

        var cardInfo = this._userInfo.cardInfo.length == 1 ? this._userInfo.cardInfo[0].cards : this._userInfo.cardInfo;

        var cards = cardInfo.map((function (cardInfoItem) {

            if (this._userInfo.cardInfo.length == 1) return KQCard.cardsFromArray(cardInfoItem);

            return KQCard.cardsFromArray(cardInfoItem.cards);
        }).bind(this)).reduce(function (array, subCards) {
            return array.concat(subCards);
        }, []);

        var foldCardNode = this.foldCardNode.children.slice(0, 3);

        var nodes = foldCardNode.map(function (node) {
            return node.children;
        }).reduce(function (array, sub) {
            return array.concat(sub);
        }, []);

        cards.forEach((function (kqCard, index) {

            if (index >= nodes.length) return;

            nodes[index].removeAllChildren();

            nodes[index].getComponent(cc.Sprite).spriteFrame = "";

            var nodds1 = new cc.Node(); //创建一个节点对象

            nodds1.width = nodes[0].width;

            nodds1.height = nodes[0].height;

            nodds1.addComponent(cc.Sprite); //添加精灵组件

            var cardSprite = nodds1.getComponent('cc.Sprite');

            cardSprite.sizeMode = 0;

            var cardName = this.foldCardNodeBack == false ? kqCard.cardName() : "back";

            nodds1.cardName = cardName;

            var path = 'public-pic-card-poker-' + cardName;

            this._loadCardFrame(this.cardSpriteAtlas, path, cardSprite);

            if (cc.maPai == cardName) {

                var nodds = new cc.Node(); //创建一个节点对象

                nodds.addComponent(cc.Sprite); //添加精灵组件

                cc.loader.loadRes('play/desk/img_red5_1', cc.SpriteFrame, (function (err, spriteFrame) {

                    if (err) {
                        cc.error(err.message || err);return;
                    }

                    var btnSprite1 = nodds.getComponent(cc.Sprite);

                    btnSprite1.spriteFrame = spriteFrame;

                    btnSprite1.node.width = cardSprite.node.width + 10;

                    btnSprite1.node.height = cardSprite.node.height + 10;
                }).bind(this));

                cardSprite.node.addChild(nodds);
            }

            nodes[index].addChild(nodds1);
        }).bind(this));

        var cards0 = cards.slice(0, 3);
        var cards1 = cards.slice(3, 8);
        var cards2 = cards.slice(8, 13);

        cards = [cards0, cards1, cards2];
        //头道
        var typeName0 = KQCard.cardsType(cards0) + 1;
        typeName0 = typeName0 >= 10 ? typeName0 : "0" + typeName0;
        typeName0 = typeName0 == '04' ? '11' : typeName0;

        //中道
        var typeName1 = KQCard.cardsType(cards1) + 1;
        typeName1 = typeName1 >= 10 ? typeName1 : "0" + typeName1;
        typeName1 = typeName1 == '07' ? '22' : typeName1;

        //尾道
        var typeName2 = KQCard.cardsType(cards2) + 1;
        typeName2 = typeName2 >= 10 ? typeName2 : "0" + typeName2;

        if (typeName0) KQCard._setGuiCard(0, 0, 3, typeName0, cards, nodes, this.cardSpriteAtlas);
        if (typeName1) KQCard._setGuiCard(1, 3, 8, typeName1, cards, nodes, this.cardSpriteAtlas);
        if (typeName2) KQCard._setGuiCard(2, 8, 13, typeName2, cards, nodes, this.cardSpriteAtlas);
        if (this.foldCardNodeBack == false) {
            this.foldCardNodeBack = true;
        } else if (this.foldCardNodeBack == true) {
            this.foldCardNodeBack = false;
        }
    },

    _loadCardFrame: function _loadCardFrame(SpriteFrame, path, SpritesNode, w, h) {

        var Sprite = SpriteFrame.getSpriteFrame(path);

        SpritesNode.spriteFrame = Sprite;

        if (w) SpritesNode.node.width = w;

        if (h) SpritesNode.node.height = h;
    },

    // 准备好开始比牌
    // readyToCompareCards: function () {
    //     this.foldCardNode.targetOff(this.foldCardNode);
    //     this.foldCardNodeBack = true;
    //     this._clickFoldCardNode();
    //     this.cardsBackLayout.node.active = false;
    //     this.compareCardsNode.active = true;
    //     //this.foldCardNode.active = false;
    //     if(this.compareCardsNode.getComponent('CompareCards')._user){
    //         if(this.compareCardsNode.getComponent('CompareCards')._user.isContainExtra){
    //             this.teShuPaiNode.active = true;
    //         }else{
    //             this.teShuPaiNode.active = false;
    //         }
    //     }
    // },
    readyToCompareCards: function readyToCompareCards() {
        this.foldCardNode.targetOff(this.foldCardNode);
        this.foldCardNodeBack = true;
        this._clickFoldCardNode();
        this.cardsBackLayout.node.active = false;
        this.compareCardsNode.active = true;
        this.foldCardNode.active = true;
        if (this.compareCardsNode.getComponent('CompareCards')._user) {
            if (this.compareCardsNode.getComponent('CompareCards')._user.isContainExtra) {
                this.teShuPaiNode.active = true;
            } else {
                this.teShuPaiNode.active = false;
            }
        }
    },

    // 播放打枪动画
    // @param userId   要主动打枪的用户id
    // @param toUserIndex  挨枪的用户的 index
    playShootAnimation: function playShootAnimation(userId, toUserIndex) {
        if (userId != this.userId) {
            return;
        }
        var shotNode = this.shotNode[toUserIndex];
        shotNode.active = true;
        shotNode.children[0].active = true;
        shotNode.children[1].active = true;

        //枪
        var rotateBy = cc.rotateTo(0.1, -15);
        var delay1 = cc.delayTime(0.1);
        var rotateBy1 = cc.rotateTo(0.1, 0);
        var start_func1 = cc.callFunc(function () {
            shotNode.children[0].active = true;
        });
        var end_func1 = cc.callFunc(function () {
            shotNode.children[0].active = false;
        });
        var action = cc.repeat(cc.sequence(start_func1, rotateBy, delay1, rotateBy1, end_func1), 3);

        //烟
        var fadeIn = cc.fadeIn(0);
        var scaleTo1 = cc.scaleTo(0, 0.8);
        var scaleTo2 = cc.scaleTo(0.08, 1);
        var fadeOutAndScaleTo = cc.spawn(cc.fadeOut(0.02), cc.scaleTo(0.02, 0.5));
        var delay2 = cc.delayTime(.2);
        var start_func2 = cc.callFunc(function () {
            shotNode.children[1].active = true;
        });
        var end_func2 = cc.callFunc(function () {
            shotNode.children[1].active = false;
        });
        var action1 = cc.repeat(cc.sequence(start_func2, fadeIn, scaleTo1, scaleTo2, fadeOutAndScaleTo, delay2, end_func2), 3);

        shotNode.children[0].runAction(action);
        shotNode.children[1].runAction(action1);

        //let userInfo = this.userInfoNode.getComponent('userInfo');
        //userInfo.playShootAnimation(toUserIndex);
    },

    // 播放中枪动画
    playBulletHoleAnimation: function playBulletHoleAnimation(userId) {
        if (userId != this.userId) {
            return;
        }

        this.bulletHoleNode.active = true;

        var bulletHoleNode = cc.instantiate(this.bulletHolePrefab);

        bulletHoleNode.children.forEach((function (node) {
            node.active = false;
        }).bind(this));

        bulletHoleNode.children[0].y = 0;

        this.bulletHoleNode.addChild(bulletHoleNode);

        var interval = 0.3;

        var initTime = 0;

        bulletHoleNode.children.forEach((function (node) {

            this.scheduleOnce(function () {

                AudioManager.instance.playHumanZQiang();

                node.active = true;

                var y = Math.round(Math.random()) == 0 ? -1 : 1;

                y = Math.floor(Math.random() * 38) * y;

                var x = Math.round(Math.random()) == 0 ? -1 : 1;

                x = Math.floor(Math.random() * 38) * x;

                node.x = x;

                node.y = y;
            }, initTime);

            initTime = initTime + interval;
        }).bind(this));
    },

    // 播放全垒打动画
    playHomeRunAimation: function playHomeRunAimation(userId) {
        if (userId != this.userId) {
            return;
        }

        var userInfo = this.userInfoNode.getComponent('userInfo');
        userInfo.playHomeRunAimation();
    },

    playSpeakAnimation: function playSpeakAnimation(userId) {
        if (userId != this.userId) {
            return;
        }

        var userInfo = this.userInfoNode.getComponent('userInfo');
        userInfo.playSpeakAnimation();
    },

    nextCompareScore: function nextCompareScore() {
        if (!this.node.active) {
            return 0;
        }

        var score = this.compareCardsNode.getComponent('CompareCards').nextCompareScore();
        return score;
    },

    showNextCompareCards: function showNextCompareCards() {
        if (this.nextCompareScore() <= 0) {
            return;
        }
        this.teShuPaiNode.active = false;
        this.compareCardsNode.getComponent('CompareCards').showNextCards();
    },

    showAllCompareCards: function showAllCompareCards(users) {
        var user = users.find((function (e) {
            return this.userId == e.id;
        }).bind(this));
        this.compareCardsNode.getComponent('CompareCards').setCompareData(user);
        this.compareCardsNode.getComponent('CompareCards').showAllCards();

        this.updateScore(this._userInfo.totalScore || 0);
    },

    showNextCompareScore: function showNextCompareScore(isContainExtra) {
        this.compareCardsNode.getComponent('CompareCards').showNextCompareScore(isContainExtra);
    },

    showScoreResult: function showScoreResult() {
        this.compareCardsNode.getComponent('CompareCards').showScoreResult();
    }
});

cc._RFpop();