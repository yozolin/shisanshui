const KQCardResHelper = require('KQCardResHelper');
const AudioManager = require('AudioManager');
const KQCard = require('KQCard');

cc.Class({
    extends: cc.Component,

    properties: {
        touLayout: cc.Layout,
        zhongLayout: cc.Layout,
        weiLayout: cc.Layout,

        touLayoutBack: cc.Layout,
        zhongLayoutBack: cc.Layout,
        weiLayoutBack: cc.Layout,
        baoDao: cc.Node,  //报道图,
        playTotalScore: cc.Layout,  //所有玩家的总分数

        daoScoreLayouts: [cc.Layout],
        daoTitleNodes: [cc.Node],
        TScoreLayout: cc.Layout,
        TtitleNode: cc.Node,

        pNum:0,         //玩家人数
        teShuTime:0,    //特殊牌出牌顺序
        teShuNum:0,     //特殊牌人数

        _lCScore:null,
        _daoLayouts: null, // 头、中、尾集合
        _daoLayoutBacks: null, // 头、中、尾集合
        _scores: null,
        _user: null,       // 用于比牌的数据
        _cardsInfo: null,
        _compareIndex: 0,  // 将要比较的 索引  0~2
    },

    // use this for initialization
    onLoad: function () {

        this._daoLayouts = [this.touLayout, this.zhongLayout, this.weiLayout];
        this._daoLayoutBacks = [this.touLayoutBack, this.zhongLayoutBack, this.weiLayoutBack];
        this.reset();

        if (this._scores) {
            this.setScores(this._scores);
        }

    },

    reset: function () {
        this._compareIndex = 0;

        this.node.children.forEach(function (node) {node.active = false;});

        this.baoDao.getComponent(cc.Sprite).spriteFrame = null;

        var nodes = this.touLayoutBack.node.children.concat(this.zhongLayoutBack.node.children).concat(this.weiLayoutBack.node.children);

        this.cardSpriteAtlas = this.node.parent.parent.getComponent('play').cardSpriteAtlas;

        nodes.forEach(function (nod) {

            nod.removeAllChildren();

            var cardSprite = nod.getComponent(cc.Sprite);

            KQCard._loadCardFrame(this.cardSpriteAtlas, "public-pic-card-poker-back" ,cardSprite);

        }.bind(this));

        this.daoScoreLayouts.forEach(function (nod) {nod.node.active = false;}.bind(this));

        this.daoTitleNodes.forEach(function (nod) {nod.active = false;}.bind(this));

        if(this.TScoreLayout) this.TScoreLayout.node.active = false;

        if(this.TtitleNode) this.TtitleNode.active = false;

        this.unscheduleAllCallbacks();

        //console.log('执行了一遍清除定时器--------------------------------')

        if(this.TScoreLayout) this.TScoreLayout.node.stopAllActions();

        if(this.playTotalScore) this.playTotalScore.node.stopAllActions();
    },

    setCompareData: function (user) {
        this._user = user;
        this._cardsInfo = user.cardInfo;
        let cardsInfo = user.cardInfo;
        this._lCScore = user.lCScore;
        let cards = cardsInfo.map(function (cardInfoItem) {
            return KQCard.cardsFromArray(cardInfoItem.cards);
        }).reduce(function (array, subCards) {
            return array.concat(subCards);
        }, []);


        let scores = [user.score1 || 0, user.score2 || 0, user.score3 || 0,user.lScore1 || 0, user.lScore2 || 0, user.lScore3 || 0];
        this.setCards(cards);
        this.setScores(scores);
    },

    //显示所有玩家的总分数
    showScoreResult: function() {
        if(!this._user) return;
        var scores = this._user.cScore;
        this.setScores([scores],[this.playTotalScore],true);
        this.playTotalScore.node.active = true;
        this.playTotalScore.node.opacity = 255;
        var x = this.playTotalScore.node.x;
        var y = this.playTotalScore.node.y;
        this.playTotalScore.node.runAction(cc.moveTo(0.8, cc.p(x, y+30)));
        this.scheduleOnce(function() {
            this.playTotalScore.node.runAction(cc.fadeOut(0.2));
        }.bind(this),0.6);
        this.scheduleOnce(function() {this.playTotalScore.node.y = y;}.bind(this),1);
    },

    //显示三道分数
    showNextCompareScore: function(isContainExtra) {
        if(isContainExtra && this.TScoreLayout){
            var scores1 = this._lCScore.splice(0,1);
            if(scores1.length <= 0) return;
            this.setScores(scores1,[this.TScoreLayout],true);
            this.TtitleNode.active = true;
            this.TScoreLayout.node.active = true;

            var scaleTo11 = cc.scaleTo (0.3, 1.8)
            var scaleTo21 = cc.scaleTo (0.1, 1.1)
            var scaleTo31 = cc.scaleTo (0.1, 1.3)
            var scaleToSeq1 =cc.sequence(scaleTo11,scaleTo21,scaleTo31);
            this.TScoreLayout.node.runAction(scaleToSeq1);
        }

        if(this.daoScoreLayouts.length <= 0) return;
        if(!this._user.isContainExtra){
            var index = this._compareIndex == 0 ? 1: this._compareIndex;
            this.daoScoreLayouts[index-1].node.active = true;
            this.daoScoreLayouts[index+2].node.active = true;
            this.daoTitleNodes[index-1].active = true;
        }

        var scores = this._lCScore.splice(0,1);
        if(scores.length <= 0  && !this.TScoreLayout) return;
        this.setScores(scores,[this.TScoreLayout],true);
        this.TtitleNode.active = true;
        this.TScoreLayout.node.active = true;

        var scaleTo1 = cc.scaleTo (0.3, 1.8)
        var scaleTo2 = cc.scaleTo (0.1, 1.1)
        var scaleTo3 = cc.scaleTo (0.1, 1.3)
        var scaleToSeq =cc.sequence(scaleTo1,scaleTo2,scaleTo3);
        this.TScoreLayout.node.runAction(scaleToSeq);

    },

    // 下一个要比较的分数
    // 如果没有要比较的了，则返回 0
    nextCompareScore: function() {
        if (!this._user) return 0;

        var data;
        if(this._user.isContainExtra){
            data = this._cardsInfo[0];
            if (data) return data.type * 9000000000000000;
        }else{
            data = this._cardsInfo[this._compareIndex];
        }
        if (!data) return 0;
        return data.value;
    },

    setMaPai: function (nodes ,cardName) {
        if(cc.maPai == cardName){

            var nodds = new cc.Node(); //创建一个节点对象

            nodds.addComponent(cc.Sprite); //添加精灵组件

            cc.loader.loadRes('play/desk/img_red5_1', cc.SpriteFrame, function (err, spriteFrame) {

                if (err) {cc.error(err.message || err);return;}

                var btnSprite1 = nodds.getComponent(cc.Sprite);

                btnSprite1.sizeMode = 0;

                btnSprite1.spriteFrame = spriteFrame;

                btnSprite1.node.width = nodes.width + 10;

                btnSprite1.node.height = nodes.height + 10;

            }.bind(this));

            nodes.addChild(nodds);
        }
    },

    setCards: function (cards) {

        let cardSprites = this._allCardSprites();

        this.cardSpriteAtlas = this.node.parent.parent.getComponent('play').cardSpriteAtlas;

        cards.forEach(function (kqCard, index) {
            if (index >= cardSprites.length) {
                return;
            }
            cardSprites[index].node.removeAllChildren();

            cardSprites[index].node.getComponent(cc.Sprite).spriteFrame = "";

            var nodds1 = new cc.Node(); //创建一个节点对象

            nodds1.cardName = kqCard.cardName();

            nodds1.width = cardSprites[index].node.width;

            nodds1.height = cardSprites[index].node.height;

            nodds1.addComponent(cc.Sprite); //添加精灵组件

            var cardSprite = nodds1.getComponent('cc.Sprite');

            cardSprite.sizeMode = 0;

            var path = "public-pic-card-poker-" + kqCard.cardName();

            KQCard._loadCardFrame(this.cardSpriteAtlas, path ,cardSprite);

            this.setMaPai(cardSprite.node, kqCard.cardName());

            cardSprites[index].node.addChild(nodds1);

        }.bind(this));

        var cards0 = cards.slice(0,3)
        var cards1 = cards.slice(3,8)
        var cards2 = cards.slice(8,13)

        var cards11 = [cards0, cards1, cards2]
        //头道
        let typeName0 = KQCard.cardsType(cards0)+1;
        typeName0 = typeName0>=10 ? typeName0 :"0"+typeName0;
        typeName0 = typeName0=='04' ? '11' :typeName0;

        //中道
        let typeName1 = KQCard.cardsType(cards1)+1;
        typeName1 = typeName1>=10 ? typeName1 :"0"+typeName1;
        typeName1 = typeName1=='07' ? '22' :typeName1;

        //尾道
        let typeName2 = KQCard.cardsType(cards2)+1;
        typeName2 = typeName2>=10 ? typeName2 :"0"+typeName2;

        cardSprites = cardSprites.map(function(i){return i.node;});

        if(typeName0) KQCard._setGuiCard(0, 0, 3, typeName0, cards11, cardSprites, this.cardSpriteAtlas);
        if(typeName1) KQCard._setGuiCard(1, 3, 8, typeName1, cards11, cardSprites, this.cardSpriteAtlas);
        if(typeName2) KQCard._setGuiCard(2, 8, 13, typeName2, cards11, cardSprites, this.cardSpriteAtlas);

    },


    setScores: function (scores ,Layouts = null ,is_WH = false) {
        if(!Layouts){
            Layouts = this.daoScoreLayouts;
            if(Layouts.length <= 0) return;
        }

        scores.forEach(function (string, index) {

            let labels = Layouts[index];

            labels.node.removeAllChildren();

            var path = "play/CardTypeCombine/" + ((Number(string) >= 0) ? "addNum" : "delNum");

            this._creatorNodes(labels.node ,10 ,path ,'' ,is_WH);

            var strings = (string > 0) ? (string) + "": (string * -1) + "";

            var stringAyy = strings.split("");

            for(var i = 0;i < stringAyy.length;i++){

                let s = stringAyy[i];

                this._creatorNodes(labels.node ,Number(s) ,path ,'' ,is_WH);

            }

            labels.type = 1;

        }.bind(this));
    },

    _creatorNodes:function(nodes,name,path,paths,w_h = false){

        var node = new cc.Node(); //创建一个节点对象

        node.addComponent(cc.Sprite); //添加精灵组件

        var btnSprite = node.getComponent(cc.Sprite);

        btnSprite.sizeMode = 0;

        btnSprite.node.width = 18;btnSprite.node.height = 23;
        //name = name + "";
        this._loadCardFrame(name, function (spriteFrame) {

            btnSprite.spriteFrame = spriteFrame;

            if(w_h){btnSprite.node.width = 30;btnSprite.node.height = 40;}

        }.bind(this), path, paths);

        nodes.addChild(node);

    },

    _setCardSpriteFrame: function (indexs,nodes) {
        let cardsInfo = this._cardsInfo;
        let cards = cardsInfo.map(function (cardInfoItem) {
                return KQCard.cardsFromArray(cardInfoItem.cards);
            })[indexs] || [];

        this.cardSpriteAtlas = this.node.parent.parent.getComponent('play').cardSpriteAtlas;

        // cc.log(this._cardsInfo)
        // cc.log(cards)
        // cc.log('------555')

        cards.forEach(function (kqCard, index) {

            nodes.children[index].removeAllChildren();

            nodes.children[index].getComponent(cc.Sprite).spriteFrame = ""

            var nodds1 = new cc.Node(); //创建一个节点对象

            nodds1.cardName = kqCard.cardName();

            nodds1.width = nodes.children[index].width;

            if(nodes.parent.parent.name == "playSelf"){

                nodes.children[index].height = 130;

                nodds1.height = 130;

            }else{

                nodes.children[index].height = 115;

                nodds1.height = 115;

                //console.log(nodes);
                //console.log(nodds1);
            }

            nodds1.addComponent(cc.Sprite); //添加精灵组件

            var cardSprite = nodds1.getComponent('cc.Sprite');

            cardSprite.sizeMode = 0;

            var path = "public-pic-card-poker-" + kqCard.cardName();

            cardSprite.node.removeAllChildren();

            KQCard._loadCardFrame(this.cardSpriteAtlas, path ,cardSprite);

            this.setMaPai(cardSprite.node, kqCard.cardName());

            nodes.children[index].addChild(nodds1);

        }.bind(this));

        var typeName = KQCard.cardsType(cards)+1;

        typeName = typeName>=10 ? typeName+"" :"0"+typeName;

        //头道
        if(indexs == 0){
            typeName = typeName=='04' ? '11' :typeName;
        }
        else if(indexs == 1){
            typeName = typeName=='07' ? '22' :typeName;
        }

        var cardSprites = nodes.children.map(function(i){return i;});

        KQCard._setGuiCards(typeName, cards, cardSprites, this.cardSpriteAtlas);

    },

    showTouCards: function () {
        if(this._user.isContainExtra == true) return;
        //console.log('开始执行一次定时动作--------------------------------')

        this.touLayoutBack.node.active = false;
        this._setCardSpriteFrame(0,this.touLayoutBack.node);
        this.scheduleOnce(function() {
            this.touLayout.node.active = false;
            this.touLayoutBack.node.active = true;
        }.bind(this), 0.7);

        this.touLayout.node.active = true;
        this.touLayout.node.scaleY = 0.7;
        this.scheduleOnce(function() {
            this.touLayout.node.scaleY = 1;
        }.bind(this), 0.02);


        var types = this._cardsInfo[this._compareIndex].type == 3 ? 333:this._cardsInfo[this._compareIndex].type;
        AudioManager.instance.playCardType(this._user.sex, types);
        this._compareIndex += 1;
    },

    showZhongCards: function () {
        if(this._user.isContainExtra == true) return;

        this.zhongLayoutBack.node.active = false;
        this._setCardSpriteFrame(1,this.zhongLayoutBack.node);
        this.scheduleOnce(function() {
            this.zhongLayout.node.active = false;
            this.zhongLayoutBack.node.active = true;
        }.bind(this), 0.7);

        this.zhongLayout.node.active = true;
        this.zhongLayout.node.scaleY = 0.7;
        this.scheduleOnce(function() {
            this.zhongLayout.node.scaleY = 1;
        }.bind(this), 0.02);

        var types = this._cardsInfo[this._compareIndex].type == 6 ? 555:this._cardsInfo[this._compareIndex].type;
        AudioManager.instance.playCardType(this._user.sex, types);
        this._compareIndex += 1;
    },

    showWeiCards: function () {
        //console.log('执行了一次尾道动画---------------')
        if(this._user.isContainExtra == true) return;
        //this._setCardSpriteFrame(1,this.zhongLayoutBack.node);
        this.weiLayoutBack.node.active = false;
        this._setCardSpriteFrame(2,this.weiLayoutBack.node);
        this.scheduleOnce(function() {
            this.weiLayout.node.active = false;
            this.weiLayoutBack.node.active = true;
        }.bind(this), 0.7);

        this.weiLayout.node.active = true;
        this.weiLayout.node.scaleY = 0.7;
        this.scheduleOnce(function() {
            this.weiLayout.node.scaleY = 1;
        }.bind(this), 0.02);

        AudioManager.instance.playCardType(this._user.sex, this._cardsInfo[this._compareIndex].type);
        this._compareIndex += 1;
    },

    showTeShuCards: function (cards) {
        //let typeName = KQCard.cardsTypeName(cardsNames);
        this._daoLayoutBacks = [this.touLayoutBack, this.zhongLayoutBack, this.weiLayoutBack];

        let touCardSprites = this._cardSpritesWithLayout(this._daoLayoutBacks[0]);
        let zhongCardSprites = this._cardSpritesWithLayout(this._daoLayoutBacks[1]);
        let weiCardSprites = this._cardSpritesWithLayout(this._daoLayoutBacks[2]);
        let cardSprites = touCardSprites.concat(zhongCardSprites).concat(weiCardSprites);
        this.cardSpriteAtlas = this.node.parent.parent.getComponent('play').cardSpriteAtlas;
        this.scheduleOnce(function() {
            cards.forEach(function (kqCard, index) {
                if (index >= cardSprites.length) return;

                let cardSprite = cardSprites[index];

                var path = "public-pic-card-poker-" + kqCard.cardName();

                cardSprite.node.removeAllChildren();

                KQCard._loadCardFrame(this.cardSpriteAtlas, path ,cardSprite);

                this.setMaPai(cardSprite.node, kqCard.cardName());

            }.bind(this));
            this._daoLayoutBacks.forEach(function (nodes) {nodes.node.active = true;}.bind(this));
            AudioManager.instance.playCardType(this._user.sex, this._cardsInfo[0].type);
        }.bind(this),0.1);
    },

    showNextCards: function () {
        var cardTypeCombine = this.node.parent.parent.getChildByName('CardTypeCombine').getComponent('CardTypeCombine');
        cardTypeCombine.reset();
        cardTypeCombine.node.active = false;

        this.touLayoutBack.node.parent.active = true;
        if (this._user.isContainExtra) {
            var cards = this._cardsInfo[0].cards.map(function (cardInfoItem) {
                return KQCard.cardsFromArray(cardInfoItem);
            }).reduce(function (array, subCards) {
                return array.concat(subCards);
            }, []);
            this.showTeShuCards(cards);
            this.showBaoDao(0,0);
            this.baoDao.active = true;
            return;
        }
        this._daoLayouts = [this.touLayout, this.zhongLayout, this.weiLayout];
        this._daoLayouts.forEach(function (nodes) {
            nodes.node.active = false;
        });
        if (this._compareIndex == 0) {
            this.showBaoDao(0,140);
            this.showTouCards();
        }
        else if (this._compareIndex == 1) {
            this.showBaoDao(1,85);
            this.showZhongCards();
        }
        else if (this._compareIndex == 2) {
            this.showBaoDao(2,34);
            this.showWeiCards();
        }

        this.baoDao.active = true;
        this.scheduleOnce(function() {this.baoDao.active = false;}.bind(this), 0.7);

    },

    showAllCards: function () {
        if(!this._user) return;

        if (this._user.isContainExtra) {

            var cards = this._cardsInfo[0].cards.map(function (cardInfoItem) {return KQCard.cardsFromArray(cardInfoItem);})
                .reduce(function (array, subCards) {return array.concat(subCards);}, []);

            this.showTeShuCards(cards);

            //return;
        }

        if(!this._daoLayoutBacks) return;

        this.touLayoutBack.node.parent.active = true;

        this._daoLayoutBacks.forEach(function (nodes,index) {

            nodes.node.active = true;

            nodes.node.children.forEach(function (no) {no.active = true;});

            this._setCardSpriteFrame(index,nodes.node);

            if(this.TScoreLayout) this.daoTitleNodes[index].active = true;

        }.bind(this));

        if(!this.TScoreLayout) return;

        this.daoScoreLayouts.forEach(function (nodes) {

            nodes.node.active = true;

        }.bind(this));

        this.setScores([this._user.cScore],[this.TScoreLayout],true);

        this.TtitleNode.active = true;

        this.TScoreLayout.node.active = true;

    },

    showBaoDao: function (index,positonY) {
        let cardsInfo = this._cardsInfo;
        let cardType = cardsInfo.map(function (cardInfoItem) {
            return cardInfoItem.type
        });

        let typeName0 = cardType[index]+1;
        typeName0 = typeName0>=10 ? typeName0 :"0"+typeName0;
        if(index == 0) typeName0 = typeName0=='04' ? '11' :typeName0;
        if(index == 1) typeName0 = typeName0=='07' ? '22' :typeName0;

        if(cardType[index] == 10) typeName0 = '15';//特殊牌
        if(cardType[index] == 11) typeName0 = '14';
        if(cardType[index] == 12) typeName0 = '16';
        if(cardType[index] == 18) typeName0 = '25';
        if(cardType[index] == 19) typeName0 = '26';

        var path = this._user.isContainExtra?"game-right_specia":"game-poker_type";

        this._loadCardFrame(typeName0, function (spriteFrame) {
            var btnSprites1 =  this.baoDao.getComponent(cc.Sprite);
            btnSprites1.spriteFrame = spriteFrame;
        }.bind(this), "play/CardTypeCombine/game_txt",path);
        this.baoDao.y = positonY;
    },

    _loadCardFrame: function (cardName, callback, path = "play/CardTypeCombine/pockList",
                              paths = "public-pic-card-poker-") {
        cc.loader.loadRes(path, cc.SpriteAtlas, function (err, atlas) {
            if (err) {
                cc.error(err);
                return;
            }
            cardName = cardName + "";
            cardName = this._cardFullName(cardName,paths);
            var frame = atlas.getSpriteFrame(cardName);
            callback(frame);
        }.bind(this));
    },

    _cardFullName: function (cardShortName,paths) {
        if(!paths) return cardShortName;
        var cardName = cardShortName;
        if (!cardName.startsWith(paths)) {
            cardName = paths + cardName;
        }
        return cardName;
    },

    _clearCards: function () {
        this._clearLayoutCards(this.touLayout);
        this._clearLayoutCards(this.zhongLayout);
        this._clearLayoutCards(this.weiLayout);
    },

    _clearLayoutCards: function (layout) {
        this._cardSpritesWithLayout(layout).forEach(function (sprite) {
            sprite.spriteFrame = null;
        });
    },

    _cardSpritesWithLayout: function (layout) {
        let node = layout.node;
        return node.children.map(function (node) {
            return node.getComponent('cc.Sprite');
        });
    },

    _allCardSprites: function () {
        let touCardSprites = this._cardSpritesWithLayout(this.touLayout);
        let zhongCardSprites = this._cardSpritesWithLayout(this.zhongLayout);
        let weiCardSprites = this._cardSpritesWithLayout(this.weiLayout);
        let result = touCardSprites.concat(zhongCardSprites).concat(weiCardSprites);
        return result;
    },

});
