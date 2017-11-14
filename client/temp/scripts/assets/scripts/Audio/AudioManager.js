"use strict";
cc._RFpush(module, 'dd5deKFuSZAC4Ky0zI4+z6O', 'AudioManager');
// scripts\Audio\AudioManager.js

var manager = require('manager');

var AudioManager = cc.Class({
    "extends": cc.Component,

    properties: {
        hall_bgm: {
            "default": null,
            url: cc.AudioClip
        },

        // 打枪
        daQiang: {
            "default": null,
            url: cc.AudioClip
        },

        fapai: {
            "default": null,
            url: cc.AudioClip
        },

        window: {
            "default": null,
            url: cc.AudioClip
        },

        click_weixin_login: {
            "default": null,
            url: cc.AudioClip
        },

        fangPai: {
            "default": null,
            url: cc.AudioClip
        }

    },

    statics: {
        instance: null
    },

    onLoad: function onLoad() {
        AudioManager.instance = this;
        this._registerAppActiveChange();

        this.soundOn = true;
        cc.game.addPersistRootNode(this.node);
        if (cc.game.isPersistRootNode(this.node)) {
            // cc.log('添加全局节点成功');
        }
        this.mValue = manager.getMusicValue();
        this.mEValue = manager.getMusicEffectValue();
        this.bgAudioId = -1;
    },

    stopHallMusic: function stopHallMusic() {
        cc.audioEngine.stop(this.bgAudioId);
    },

    playMusic: function playMusic() {
        this.bgAudioId = cc.audioEngine.playMusic(this.hall_bgm, true);
        if (this.bgAudioId != -1) {
            //cc.log('play');
            cc.audioEngine.setVolume(this.bgAudioId, this.mValue);
        }
        //cc.audioEngine.playMusic( url, true )
    },

    playCompareCardsMusic: function playCompareCardsMusic() {
        this.bgAudioId = cc.audioEngine.playMusic(this.hall_bgm, true);
        if (this.bgAudioId != -1) {
            cc.audioEngine.setVolume(this.bgAudioId, this.mValue);
        }
    },

    playDaQiang: function playDaQiang() {
        for (var start = 0; start <= 1.6; start = start + 0.5) {
            this.scheduleOnce((function () {
                this._playSFX(this.daQiang);
            }).bind(this), start);
        }
    },

    // “打枪”
    playHumanDaQiang: function playHumanDaQiang() {
        var sex = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

        var path = "resources/sounds/man" /* + (sex == 1 ? "man" : "woman")*/;
        path = path + "/daqiang1.mp3";

        var url = cc.url.raw(path);
        this._playSFX(url);
    },

    // “中枪”
    playHumanZQiang: function playHumanZQiang() {
        var sex = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

        var path = "resources/sounds/man" /* + (sex == 1 ? "man" : "woman")*/;
        path = path + "/daqiang3.mp3";

        var url = cc.url.raw(path);
        this._playSFX(url);
    },

    playPokerClick: function playPokerClick() {
        var url = cc.url.raw('resources/sounds/public/click_wx_login.mp3');
        this._playSFX(url);
    },

    // 播放全垒打音效
    playHomeRun: function playHomeRun() {
        var sex = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

        var path = this._soundsHumanPath(sex) + "special1.mp3";
        var url = cc.url.raw(path);
        this._playSFX(url);
    },

    // 播放发牌音效
    playFaPai: function playFaPai() {
        var path1 = this._soundsHumanPath(1) + "room_start_compare.mp3";
        var url1 = cc.url.raw(path1);
        this._playSFX(url1);
        //let pokerDeal = this._soundsHumanPath(1) + "poker_deal.mp3";
        //let urlPokerDeal = cc.url.raw(pokerDeal);
        //this._playSFX(urlPokerDeal);
        this._playSFX(this.fapai);
        for (var index = 0; index < 6; index++) {
            this.scheduleOnce((function () {
                this._playSFX(this.fapai);
            }).bind(this), index * 0.1);
        }
    },

    playCardType: function playCardType() {
        var sex = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
        var type = arguments.length <= 1 || arguments[1] === undefined ? -1 : arguments[1];

        // 只播放普通类型的语音
        if (type >= 10 || type < 0) {
            // 10 及以上是特殊牌
            var _path = this._soundsHumanPath(sex) + type + ".mp3";
            var _url = cc.url.raw(_path);
            this._playSFX(_url);
            return;
        }

        var path = this._soundsHumanPath(sex) + "common" + (type + 1) + ".mp3";
        var url = cc.url.raw(path);
        this._playSFX(url);
    },

    // 播放 开始比牌
    playStartCompare: function playStartCompare() {
        var sex = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

        var path = this._soundsHumanPath(sex) + "start_compare.mp3";
        var url = cc.url.raw(path);
        this._playSFX(url);
    },

    playWin: function playWin() {
        var url = cc.url.raw('resources/sounds/openface/win.mp3');
        this._playSFX(url);
    },

    playLose: function playLose() {
        var url = cc.url.raw('resources/sounds/openface/lose.mp3');
        this._playSFX(url);
    },

    coinIncome: function coinIncome() {
        var url = cc.url.raw('resources/sounds/openface/coin_income.mp3');
        this._playSFX(url);
    },

    _soundsHumanPath: function _soundsHumanPath(sex) {
        var path = "resources/sounds/man/" /* + (sex == 1 ? "man" : "woman") + "/"*/;
        return path;
    },

    setBgMusicVolumn: function setBgMusicVolumn(value) {
        this.mValue = value;
        if (this.bgAudioId != -1) {
            cc.audioEngine.setVolume(this.bgAudioId, value);
        }
    },

    setEffectMusicVolum: function setEffectMusicVolum(value) {
        this.mEValue = value;
    },

    /*聊天*/
    playChatAudio: function playChatAudio(sex, str) {
        var index = this.chatTexts().indexOf(str);
        if (index === -1) {
            return;
        }
        var number = "CHAT" + (index + 1);
        var path = "resources/sounds/chat/" + number + ".mp3";
        var url = cc.url.raw(path);
        this._playSFX(url);
    },

    chatTexts: function chatTexts() {
        return ['还不出牌，我都快去吃锅边糊了', '嗨呀，我家里老人都比你打的快', '嗨呀，打牌打的我都困了', '哎，你快慢慢找，我先去西湖逛一下', '快一点呀，我等你想好我厕所都上一趟了', '你这在干嘛，这么慢', '嗨呀，最近在忙什么，很久没见了', '来来来，三缺一', '来来来，赶紧坐下来打一圈', '跟你们这些高手打我会紧张，让我一点', '蛮晚到天亮，输了可以让你们先欠着'];
    },

    pauseMusic: function pauseMusic() {
        this.soundOn = false;
        cc.audioEngine.pauseMusic();
    },

    resumeMusic: function resumeMusic() {
        this.soundOn = true;
        cc.audioEngine.resumeMusic();
    },

    _playSFX: function _playSFX(clip) {
        if (this.soundOn) {
            var audioId = cc.audioEngine.playEffect(clip, false);
            cc.audioEngine.setVolume(audioId, this.mEValue);
            return audioId;
        }

        return null;
    },

    // MARK: 前后台操作
    _registerAppActiveChange: function _registerAppActiveChange() {
        cc.game.on(cc.game.EVENT_HIDE, this._appEnterBackground, this);
        cc.game.on(cc.game.EVENT_SHOW, this._appBecomActive, this);
    },

    /**
     * 进入后台
     */
    _appEnterBackground: function _appEnterBackground() {
        var now = cc.sys.now();
        if (now - this._lastAppEnterBackgroundTime < 100) {
            return;
        }
        this._lastAppEnterBackgroundTime = now;

        this.pauseMusic();
    },

    /**
     * 进入前台
     */
    _appBecomActive: function _appBecomActive() {
        var now = cc.sys.now();
        if (now - this._lastAppBecomActiveTime < 100) {
            return;
        }
        this._lastAppBecomActiveTime = now;

        this.resumeMusic();
    },

    /*确定按钮音效*/
    playBtnClickSFX: function playBtnClickSFX() {
        this._playSFX(this.click_weixin_login);
    },
    /*公共按钮，按键或者关闭按钮之类的音效*/
    palyBtnPublicSFX: function palyBtnPublicSFX() {
        this._playSFX(this.click_weixin_login);
    },

    /*取消按钮音效*/
    palyBtnCancelClickSFX: function palyBtnCancelClickSFX() {
        this._playSFX(this.click_weixin_login);
    },
    palyBtnCreateRoomSFX: function palyBtnCreateRoomSFX() {
        this._playSFX(this.click_weixin_login);
    },
    palyWindowSFX: function palyWindowSFX() {
        this._playSFX(this.window);
    },
    palyWeiXinLoginSFX: function palyWeiXinLoginSFX() {
        this._playSFX(this.click_weixin_login);
    },
    palyFangPaiSFX: function palyFangPaiSFX() {
        this._playSFX(this.fangPai);
    }

});

module.exports = AudioManager;

cc._RFpop();