require = function e(t, n, i) {
    function o(s, r) {
        if (!n[s]) {
            if (!t[s]) {
                var c = "function" == typeof require && require;
                if (!r && c) return c(s, !0);
                if (a) return a(s, !0);
                var d = new Error("Cannot find module '" + s + "'");
                throw d.code = "MODULE_NOT_FOUND",
                d
            }
            var u = n[s] = {
                exports: {}
            };
            t[s][0].call(u.exports,
            function(e) {
                var n = t[s][1][e];
                return o(n ? n: e)
            },
            u, u.exports, e, t, n, i)
        }
        return n[s].exports
    }
    for (var a = "function" == typeof require && require,
    s = 0; s < i.length; s++) o(i[s]);
    return o
} ({
    ArrayExtension: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "4fd85NSsFJLd4qHrH0UjHzl", "ArrayExtension"),
        t.exports = {},
        Array.prototype.find || (Array.prototype.find = function(e) {
            if (null == this) throw new TypeError("Array.prototype.find called on null or undefined");
            if ("function" != typeof e) throw new TypeError("predicate must be a function");
            for (var t, n = Object(this), i = n.length >>> 0, o = arguments[1], a = 0; a < i; a++) if (t = n[a], e.call(o, t, a, n)) return t
        }),
        Array.prototype.findIndex || (Array.prototype.findIndex = function(e) {
            if (null === this) throw new TypeError("Array.prototype.findIndex called on null or undefined");
            if ("function" != typeof e) throw new TypeError("predicate must be a function");
            for (var t, n = Object(this), i = n.length >>> 0, o = arguments[1], a = 0; a < i; a++) if (t = n[a], e.call(o, t, a, n)) return a;
            return - 1
        }),
        Array.prototype.includes || Object.defineProperty(Array.prototype, "includes", {
            enumerable: !1,
            value: function(e, t) {
                if (null == this) throw new TypeError('"this" is null or not defined');
                var n = Object(this),
                i = n.length >>> 0;
                if (0 === i) return ! 1;
                for (var o = 0 | t,
                a = Math.max(o >= 0 ? o: i - Math.abs(o), 0); a < i;) {
                    if (n[a] === e) return ! 0;
                    a++
                }
                return ! 1
            }
        }),
        Array.prototype.unique || (Object.defineProperty(Array.prototype, "unique", {
            enumerable: !1,
            value: function(e) {
                var t = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
                return t ? this._unqiue_new(e) : this._unqiue(e)
            }
        }), Object.defineProperty(Array.prototype, "_unqiue_new", {
            enumerable: !1,
            value: function(e) {
                var t = Array.from(this);
                return t._unqiue(e)
            }
        }), Object.defineProperty(Array.prototype, "_unqiue", {
            enumerable: !1,
            value: function(e) {
                for (var t = this.length,
                n = -1; n++<t;) for (var i = n + 1; i < this.length; ++i) {
                    var o = !1;
                    o = e ? e(this[n], this[i]) : this[n] === this[i],
                    o && this.splice(i--, 1)
                }
                return this
            }
        })),
        Array.from || (Array.from = function() {
            var e = Object.prototype.toString,
            t = function(t) {
                return "function" == typeof t || "[object Function]" === e.call(t)
            },
            n = function(e) {
                var t = Number(e);
                return isNaN(t) ? 0 : 0 !== t && isFinite(t) ? (t > 0 ? 1 : -1) * Math.floor(Math.abs(t)) : t
            },
            i = Math.pow(2, 53) - 1,
            o = function(e) {
                var t = n(e);
                return Math.min(Math.max(t, 0), i)
            };
            return function(e) {
                var n = this,
                i = Object(e);
                if (null == e) throw new TypeError("Array.from requires an array-like object - not null or undefined");
                var a, s = arguments.length > 1 ? arguments[1] : void 0;
                if ("undefined" != typeof s) {
                    if (!t(s)) throw new TypeError("Array.from: when provided, the second argument must be a function");
                    arguments.length > 2 && (a = arguments[2])
                }
                for (var r, c = o(i.length), d = t(n) ? Object(new n(c)) : new Array(c), u = 0; u < c;) r = i[u],
                s ? d[u] = "undefined" == typeof a ? s(r, u) : s.call(a, r, u) : d[u] = r,
                u += 1;
                return d.length = c,
                d
            }
        } ()),
        Array.equal || (Array.equal = function(e, t) {
            var n = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2];
            if (void 0 === e || void 0 === t) return ! 1;
            var i = e.length;
            if (i !== t.length) return ! 1;
            for (var o = 0; o < i; o++) if (n) {
                if (e[o] !== t[o]) return ! 1
            } else {
                var a = e[o],
                s = t[o],
                r = !0;
                r = Array.isArray(a) && Array.isArray(s) ? Array.equal(a, s, n) : a == s
            }
            return ! 0
        }),
        Array.prototype.isEqual || Object.defineProperty(Array.prototype, "isEqual", {
            enumerable: !1,
            value: function(e) {
                var t = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
                return Array.equal(this, e, t)
            }
        }),
        Array.sortByNumber || (Array.sortByNumber = function(e, t) {
            var n = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2];
            return (e - t) * (n ? 1 : -1)
        }),
        Array.prototype.findSubArrayIndexs || Object.defineProperty(Array.prototype, "findSubArrayIndexs", {
            enumerable: !1,
            value: function(e, t) {
                var n = this,
                i = [],
                o = function() {
                    var o = e[a],
                    s = t ||
                    function(e) {
                        return o === e
                    },
                    r = n.findIndex(s);
                    return r >= 0 ? void i.push(r) : (i = [], "break")
                };
                for (var a in e) {
                    var s = o();
                    if ("break" === s) break
                }
                return i.length > 0 ? i: null
            }
        }),
        Array.prototype.translationWithStartIndex || Object.defineProperty(Array.prototype, "translationWithStartIndex", {
            enumerable: !1,
            value: function(e) {
                if (0 == e) return this;
                if (e >= this.length) return this;
                var t = this.slice(e),
                n = this.slice(0, e),
                i = t.concat(n);
                return i
            }
        }),
        Array.prototype.kq_insert || Object.defineProperty(Array.prototype, "kq_insert", {
            enumerable: !1,
            value: function(e, t) {
                return null == t ? this: e >= this.length ? void this.push(t) : (this.splice(e, 0, t), this)
            }
        }),
        Array.prototype.kq_excludes || Object.defineProperty(Array.prototype, "kq_excludes", {
            enumerable: !1,
            value: function(e) {
                if (null == e) return this;
                var t = [];
                return this.forEach(function(n) {
                    e.includes(n) || t.push(n)
                }),
                t
            }
        }),
        cc._RFpop()
    },
    {}],
    AudioManager: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "dd5deKFuSZAC4Ky0zI4+z6O", "AudioManager");
        var i = e("manager"),
        o = cc.Class({
            "extends": cc.Component,
            properties: {
                hall_bgm: {
                    "default": null,
                    url: cc.AudioClip
                },
                game_bgm: {
                    "default": null,
                    url: cc.AudioClip
                },
                compare_bgm: {
                    "default": null,
                    url: cc.AudioClip
                },
                daQiang: {
                    "default": null,
                    url: cc.AudioClip
                },
                buttonClick: {
                    "default": null,
                    url: cc.AudioClip
                },
                fapai: {
                    "default": null,
                    url: cc.AudioClip
                }
            },
            statics: {
                instance: null
            },
            onLoad: function() {
                o.instance = this,
                this._registerAppActiveChange(),
                this.soundOn = !0,
                cc.game.addPersistRootNode(this.node),
                cc.game.isPersistRootNode(this.node) ,
                this.mValue = i.getMusicValue(),
                this.mEValue = i.getMusicEffectValue(),
                this.bgAudioId = -1
            },
            playMusic: function() {
                this.bgAudioId = cc.audioEngine.playMusic(this.hall_bgm, !0),
                this.bgAudioId != -1 , cc.audioEngine.setVolume(this.bgAudioId, this.mValue))
            },
            playDeskMusic: function() {
                this.bgAudioId = cc.audioEngine.playMusic(this.game_bgm, !0),
                this.bgAudioId != -1 && cc.audioEngine.setVolume(this.bgAudioId, this.mValue)
            },
            playCompareCardsMusic: function() {
                this.bgAudioId = cc.audioEngine.playMusic(this.compare_bgm, !0),
                this.bgAudioId != -1 && cc.audioEngine.setVolume(this.bgAudioId, this.mValue)
            },
            playDaQiang: function() {
                for (var e = 0; e <= 1; e += .5) this.scheduleOnce(function() {
                    this._playSFX(this.daQiang)
                }.bind(this), e)
            },
            playHumanDaQiang: function() {
                var e = (arguments.length <= 0 || void 0 === arguments[0] ? 1 : arguments[0], "resources/sounds/baozha.wav"),
                t = cc.url.raw(e);
                this._playSFX(t)
            },
            playPokerClick: function() {
                var e = cc.url.raw("resources/sounds/public/poker_click.wav");
                this._playSFX(e)
            },
            playHomeRun: function() {
                var e = arguments.length <= 0 || void 0 === arguments[0] ? 1 : arguments[0],
                t = this._soundsHumanPath(e) + "special1.wav",
                n = cc.url.raw(t);
                this._playSFX(n)
            },
            playFaPai: function() {
                this._playSFX(this.fapai);
                for (var e = 0; e < 6; e++) this.scheduleOnce(function() {
                    this._playSFX(this.fapai)
                }.bind(this), .1 * e)
            },
            playCardType: function() {
                var e = arguments.length <= 0 || void 0 === arguments[0] ? 1 : arguments[0],
                t = arguments.length <= 1 || void 0 === arguments[1] ? -1 : arguments[1];
                if (! (t >= 9 || t < 0)) {
                    var n = this._soundsHumanPath(e) + "common" + (t + 1) + ".wav",
                    i = cc.url.raw(n);
                    this._playSFX(i)
                }
            },
            playStartCompare: function() {
                var e = arguments.length <= 0 || void 0 === arguments[0] ? 1 : arguments[0],
                t = this._soundsHumanPath(e) + "start_compare.wav",
                n = cc.url.raw(t);
                this._playSFX(n)
            },
            playWin: function() {
                var e = cc.url.raw("resources/sounds/openface/win.wav");
                this._playSFX(e)
            },
            playLose: function() {
                var e = cc.url.raw("resources/sounds/openface/lose.wav");
                this._playSFX(e)
            },
            _soundsHumanPath: function(e) {
                var t = "resources/sounds/" + (1 == e ? "man": "woman") + "/";
                return t
            },
            setBgMusicVolumn: function(e) {
                this.mValue = e,
                this.bgAudioId != -1 && cc.audioEngine.setVolume(this.bgAudioId, e)
            },
            setEffectMusicVolum: function(e) {
                this.mEValue = e
            },
            playChatAudio: function(e, t) {
                var n = this.chatTexts().indexOf(t);
                if (n !== -1) {
                    var i = (1 == e ? 1e3: 2e3) + n,
                    o = "resources/sounds/chat/" + i + ".mp3",
                    a = cc.url.raw(o);
                    this._playSFX(a)
                }
            },
            chatTexts: function() {
                return ["不要吵了，专心玩游戏吧！", "大家不要走，决战到天亮~！", "大家好，很高兴见到各位！", "各位不好意思，我离开一会！", "和你合作真是太愉快了！", "快点儿啊，都等得我花都谢了！", "你的牌打得太好了！", "你是妹妹 还是哥哥啊", "交个朋友吧。。", "我有事先走了，下次再玩吧！", "再见了 我会想念大家的，，", "怎么又断线了  网络怎么这么差啊，，"]
            },
            pauseMusic: function() {
                this.soundOn = !1,
                cc.audioEngine.pauseAll()
            },
            resumeMusic: function() {
                this.soundOn = !0,
                cc.audioEngine.resumeAll()
            },
            _playSFX: function(e) {
                if (this.soundOn) {
                    var t = cc.audioEngine.playEffect(e, !1);
                    return cc.audioEngine.setVolume(t, this.mEValue),
                    t
                }
                return null
            },
            _registerAppActiveChange: function() {
                cc.game.on(cc.game.EVENT_HIDE, this._appEnterBackground, this),
                cc.game.on(cc.game.EVENT_SHOW, this._appBecomActive, this)
            },
            _appEnterBackground: function() {
                this.pauseMusic()
            },
            _appBecomActive: function() {
                this.resumeMusic()
            }
        });
        t.exports = o,
        cc._RFpop()
    },
    {
        manager: "manager"
    }],
    CardPrefab: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "94cdbrbPc9KRqx+1sHumWI3", "CardPrefab");
        var i = e("KQCard");
        cc.Class({
            "extends": cc.Component,
            properties: {
                graySprite: cc.Sprite,
                _cardName: null,
                _kqCardMode: null
            },
            onLoad: function() {
                this.graySprite.node.active = !1
            },
            setCard: function(e) {
                this._setCardName(e),
                this._loadCardFrame(e,
                function(e) {
                    this.node.getComponent("cc.Sprite").spriteFrame = e
                }.bind(this))
            },
            cardName: function() {
                return this._cardName
            },
            cardMode: function() {
                return this._kqCardMode
            },
            _setCardName: function(e) {
                this._cardName = e,
                this._kqCardMode = new i(e)
            },
            setSelected: function() {
                var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
                this.graySprite.node.active = e
            },
            isSelected: function() {
                return this.graySprite.node.active
            },
            _cardFullName: function(e) {
                var t = e;
                return t.startsWith("public-pic-card-poker") || (t = "public-pic-card-poker-" + t),
                t
            },
            _loadCardFrame: function(e, t) {
                cc.assert(t),
                cc.loader.loadRes("images/pokerList/pockList", cc.SpriteAtlas,
                function(n, i) {
                    if (n) return void cc.error(n);
                    e = this._cardFullName(e);
                    var o = i.getSpriteFrame(e);
                    t(o)
                }.bind(this))
            }
        }),
        cc._RFpop()
    },
    {
        KQCard: "KQCard"
    }],
    CardTypeCombine: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "45c41vwAhFNYYSXDvaKpEP0", "CardTypeCombine");
        var i = function() {
            function e(e, t) {
                var n = [],
                i = !0,
                o = !1,
                a = void 0;
                try {
                    for (var s, r = e[Symbol.iterator](); ! (i = (s = r.next()).done) && (n.push(s.value), !t || n.length !== t); i = !0);
                } catch(c) {
                    o = !0,
                    a = c
                } finally {
                    try { ! i && r["return"] && r["return"]()
                    } finally {
                        if (o) throw a
                    }
                }
                return n
            }
            return function(t, n) {
                if (Array.isArray(t)) return t;
                if (Symbol.iterator in Object(t)) return e(t, n);
                throw new TypeError("Invalid attempt to destructure non-iterable instance")
            }
        } (),
        o = e("KQCard"),
        a = (e("KQCardFindTypeExtension"), e("AudioManager"));
        cc.Class({
            "extends": cc.Component,
            properties: {
                cardsLayout: cc.Layout,
                btnDuiZi: cc.Button,
                btnLiangDui: cc.Button,
                btnSanTiao: cc.Button,
                btnShunZi: cc.Button,
                btnTongHua: cc.Button,
                btnHuLu: cc.Button,
                btnTieZhi: cc.Button,
                btnTongHuaShun: cc.Button,
                typeButtonsNode: cc.Node,
                btnDeleteTouDao: cc.Button,
                btnDeleteZhongDao: cc.Button,
                btnDeleteWeiDao: cc.Button,
                btnCancelAll: cc.Button,
                btnDone: cc.Button,
                timeNode: cc.Node,
                labelTime: cc.Label,
                layoutTouDao: cc.Layout,
                layoutZhongDao: cc.Layout,
                layoutWeiDao: cc.Layout,
                cardPrefab: cc.Prefab,
                cardTypePrefab: cc.Prefab,
                _cardOffsetY: null,
                _kqCardModes: [],
                _allCardModes: [],
                _findCardTypeObject: null,
                _finishSelectCardsCallback: null,
                _piaoSelect: null
            },
            onLoad: function() {
                this._cardOffsetY = 0,
                this._registerTouchEvents(),
                this._registerDaosLayoutClickEvent(),
                this.reset()
            },
            _hideDeleteButtons: function() {
                this.btnDeleteTouDao.node.active = !1,
                this.btnDeleteZhongDao.node.active = !1,
                this.btnDeleteWeiDao.node.active = !1
            },
            reset: function() {
                this._hideDeleteButtons(),
                this.clearCards(),
                this.timeStop(),
                this._typeButtons().forEach(function(e) {
                    e.interactable = !1
                }),
                this._allCardModes = []
            },
            addCards: function(e) {
                if (cc.assert(e), this._resetCardsPositionY(), e.length > 0) {
                    var t = 0;
                    this.schedule(function() {
                        this.addCard(e[t]),
                        t > 0 && this._resetCardsPositionX(),
                        t++,
                        t >= e.length && (this._reloadKQCardModesInner(), this._resetTypeButtonEnablesWithModels(this._kqCardModes), this.node.getChildByName("playCards").active = !0)
                    }.bind(this), .06, e.length - 1)
                } else e.forEach(this.addCard.bind(this)),
                this._resetCardsPositionX(),
                this._reloadKQCardModesInner(),
                this._resetTypeButtonEnablesWithModels(this._kqCardModes)
            },
            addCard: function(e) {
                var t = !(arguments.length <= 1 || void 0 === arguments[1]) && arguments[1];
                cc.assert(e.length > 0);
                var n = cc.instantiate(this.cardPrefab);
                n.name = e,
                n.getComponent("CardPrefab").setCard(e),
                this.cardsLayout.node.addChild(n),
                n.setPositionY(this._cardOffsetY),
                t && this._resetCardsPositionX();
                var i = new o(e),
                a = this._allCardModes.find(function(e) {
                    return e.isEqual(i)
                });
                null == a && this._allCardModes.push(i)
            },
            reloadCards: function(e) {
                this.clearCards(),
                this._kqCardModes = [],
                this.addCards(e)
            },
            clearCards: function() {
                this.cardsLayout.node.removeAllChildren(),
                this.layoutTouDao.node.removeAllChildren(),
                this.layoutZhongDao.node.removeAllChildren(),
                this.layoutWeiDao.node.removeAllChildren()
            },
            removeCard: function(e) {
                e.length && this.cardsLayout.node.getChildByName(e).removeFromParent()
            },
            setFinishSelectCardsCallback: function(e) {
                "" != this._finishSelectCardsCallback && (this._finishSelectCardsCallback = e, this.node.active = !1)
            },
            _reloadKQCardModesInner: function() {
                this._kqCardModes = this.cardsLayout.node.children.map(function(e) {
                    var t = e.getComponent("CardPrefab");
                    return t.cardMode()
                }).sort(o.sort),
                this._findCardTypeObject = null
            },
            _typeButtons: function() {
                return [this.btnDuiZi, this.btnLiangDui, this.btnSanTiao, this.btnShunZi, this.btnTongHua, this.btnHuLu, this.btnTieZhi, this.btnTongHuaShun]
            },
            _resetTypeButtonEnablesWithModels: function(e) {
                e = e || this._kqCardModes,
                this.btnDuiZi.interactable = o.containDuiZi(e),
                this.btnLiangDui.interactable = o.containLiaDui(e),
                this.btnSanTiao.interactable = o.containSanTiao(e),
                this.btnShunZi.interactable = o.containShunZi(e),
                this.btnTongHua.interactable = o.containTongHua(e),
                this.btnHuLu.interactable = o.containHuLu(e),
                this.btnTieZhi.interactable = o.containTieZhi(e),
                this.btnTongHuaShun.interactable = o.containTongHuaShun(e),
                this._autoActiveTypeButtons()
            },
            _stickOutFindCardType: function(e, t) {
                var n = null;
                if (this._findCardTypeObject = this._findCardTypeObject || {},
                this._findCardTypeObject.title != e && (n = (t() || []).reverse(), this._findCardTypeObject = {
                    title: e,
                    indexsArray: n,
                    index: 0
                }), n = this._findCardTypeObject.indexsArray, n && 0 != n.length) {
                    this._resetCardsPositionY();
                    var i = this._findCardTypeObject.index,
                    o = n[i],
                    a = o.map(function(e) {
                        var t = this._kqCardModes[e];
                        return t.cardName()
                    }.bind(this)),
                    s = this.cardsLayout.node.children.filter(function(e) {
                        var t = e.getComponent("CardPrefab");
                        return a.includes(t.cardName())
                    });
                    this._changeCardPrefabsY(s),
                    i = (i + 1) % n.length,
                    this._findCardTypeObject.index = i
                }
            },
            clickDuiZi: function() {
                this._stickOutFindCardType("duiZi",
                function() {
                    return o.findDuiZi(this._kqCardModes)
                }.bind(this))
            },
            clickLiangDui: function() {
                this._stickOutFindCardType("liangDui",
                function() {
                    return o.findLiaDui(this._kqCardModes)
                }.bind(this))
            },
            clickSanTiao: function() {
                this._stickOutFindCardType("sanTiao",
                function() {
                    return o.findSanTiao(this._kqCardModes)
                }.bind(this))
            },
            clickShunZi: function() {
                this._stickOutFindCardType("shunZi",
                function() {
                    return o.findShunZi(this._kqCardModes)
                }.bind(this))
            },
            clickTongHua: function() {
                this._stickOutFindCardType("tongHua",
                function() {
                    return o.findTongHua(this._kqCardModes)
                }.bind(this))
            },
            clickHuLu: function() {
                this._stickOutFindCardType("huLu",
                function() {
                    return o.findHuLu(this._kqCardModes)
                }.bind(this))
            },
            clickTieZhi: function() {
                this._stickOutFindCardType("tieZhi",
                function() {
                    return o.findTieZhi(this._kqCardModes)
                }.bind(this))
            },
            clickTongHuaShun: function() {
                this._stickOutFindCardType("tongHuaShun",
                function() {
                    return o.findTongHuaShun(this._kqCardModes)
                }.bind(this))
            },
            clickCancelAll: function() {
                this.clickDeleteTouDao(),
                this.clickDeleteZhongDao(),
                this.clickDeleteWeiDao()
            },
            clickDone: function() {
                var e = this._taoDaoCardModes(),
                t = this._zhongDaoCardModes(),
                n = this._weiDaoCardModes();
                this._didSelectedCards(e, t, n)
            },
            _didSelectedCards: function(e, t, n) {
                var i = this._convertCardsToServerModel(e),
                o = this._convertCardsToServerModel(t),
                a = this._convertCardsToServerModel(n),
                s = [i, o, a];
                this._finishSelectCardsCallback && this._finishSelectCardsCallback(s)
            },
            clickDeleteTouDao: function() {
                this._deleteDaoCardsOfLayout(this.layoutTouDao.node)
            },
            clickDeleteZhongDao: function() {
                this._deleteDaoCardsOfLayout(this.layoutZhongDao.node)
            },
            clickDeleteWeiDao: function() {
                this._deleteDaoCardsOfLayout(this.layoutWeiDao.node)
            },
            timeStart: function(e) {
                cc.assert(e > 0),
                this.timeStop(),
                this.timeNode.active = !0,
                this._timeRemainDuration = e,
                this.labelTime.string = String(e),
                this.schedule(this._timeMethod, 1, e)
            },
            timeStop: function() {
                this.unschedule(this._timeMethod),
                this.timeNode.active = !1
            },
            _timeMethod: function() {
                this._timeRemainDuration = this._timeRemainDuration - 1;
                var e = Math.max(this._timeRemainDuration, 0);
                if (this.labelTime.string = e < 10 && e > 0 ? "0" + e: e, this._timeRemainDuration <= 0) return this.timeStop(),
                void this._timeOutAutoSelectCards()
            },
            _timeOutAutoSelectCards: function() {
                var e = this._cacleAutoSelectedCards(),
                t = i(e, 3),
                n = t[0],
                o = t[1],
                a = t[2];
                null != n && null != o && null != a || (n = this._allCardModes.slice( - 3), o = this._allCardModes.slice(5, 10), a = this._allCardModes.slice(0, 5)),
                this._didSelectedCards(n, o, a)
            },
            _cacleAutoSelectedCards: function() {
                var e = this._allCardModes.slice(),
                t = o.autoSelectCards(e, 5);
                e = e.kq_excludes(t);
                var n = o.autoSelectCards(e, 5),
                i = e.kq_excludes(n);
                return 3 == i.length && 5 == n.length && 5 == t.length ? [i, n, t] : []
            },
            _convertCardsToServerModel: function(e) {
                var t = {};
                return t.type = o.cardsType(e),
                t.value = o.scoreOfCards(e),
                t.type >= o.TYPE.SanTaoHua ? t.isContainExtra = this._isContainExtraCardsType(t.type, e) : t.cards = o.convertToServerCards(e),
                t
            },
            _isContainExtraCardsType: function(e, t) {
                return e == o.TYPE.SanTaoHua ? o.containTongHuaShun(t) : e == o.TYPE.SanShunZi ? o.containTongHuaShun(t) : e == o.TYPE.LiuDuiBan && o.containTieZhi(t)
            },
            _registerTouchEvents: function() {
                this.cardsLayout.node.on(cc.Node.EventType.TOUCH_START, this._touchCardLayout.bind(this)),
                this.cardsLayout.node.on(cc.Node.EventType.TOUCH_MOVE, this._touchCardLayout.bind(this)),
                this.cardsLayout.node.on(cc.Node.EventType.TOUCH_END, this._touchCardLayoutEnd.bind(this)),
                this.cardsLayout.node.on(cc.Node.EventType.TOUCH_CANCEL, this._touchCardLayoutEnd.bind(this))
            },
            _touchCardLayout: function(e) {
                e.bubbles = !0;
                var t = e.getLocation(),
                n = this._cardPrefabInCardLayoutWithLocation(t);
                n && (n.getComponent("CardPrefab").setSelected(!0), e.stopPropagation())
            },
            _touchCardLayoutEnd: function(e) {
                this._changeSelectedCardPrefabsY(),
                this._diseclectCardPrefabs()
            },
            _cardPrefabInCardLayoutWithLocation: function(e) {
                e = this.cardsLayout.node.convertToNodeSpaceAR(e);
                var t = this.cardsLayout.node.children.sort(function(e, t) {
                    var n = e.getBoundingBox(),
                    i = t.getBoundingBox();
                    return i.x - n.x
                });
                for (var n in t) {
                    var i = t[n],
                    o = i.getBoundingBox();
                    if (cc.rectContainsPoint(o, e)) return i
                }
                return null
            },
            _changeSelectedCardPrefabsY: function() {
                var e = this._selectedCardPrefabs();
                this._changeCardPrefabsY(e),
                a.instance.playPokerClick()
            },
            _changeCardPrefabsY: function(e) {
                e.forEach(function(e) {
                    var t = e.getPositionY();
                    t == this._cardOffsetY ? e.setPositionY(this._cardOffsetY + 55) : e.setPositionY(this._cardOffsetY)
                }.bind(this))
            },
            _selectedCardPrefabs: function() {
                var e = !(arguments.length <= 0 || void 0 === arguments[0]) && arguments[0],
                t = this.cardsLayout.node.children || [];
                return t.filter(function(t) {
                    var n = t.getComponent("CardPrefab"),
                    i = n.isSelected();
                    return ! i && e && (i = t.getPositionY() > 10),
                    i
                })
            },
            _diseclectCardPrefabs: function() {
                var e = this.cardsLayout.node.children;
                e.forEach(function(e) {
                    e.getComponent("CardPrefab").setSelected(!1)
                })
            },
            _resetCardsPositionX: function() {
                var e = 98,
                t = this.cardsLayout.node.children || [],
                n = t.length;
                if (0 != n) {
                    var i = n / 2,
                    o = 154;
                    t.sort(function(e, t) {
                        var n = e.getComponent("CardPrefab"),
                        i = t.getComponent("CardPrefab");
                        return n.cardMode().sort(i.cardMode())
                    }),
                    t.forEach(function(t, n) {
                        t.zIndex = n;
                        var a = (n - i) * e + o / 3;
                        t.setPositionX(a)
                    })
                }
            },
            _resetCardsPositionY: function() {
                var e = this.cardsLayout.node.children || [];
                e.forEach(function(e) {
                    e.setPositionY(this._cardOffsetY)
                }.bind(this))
            },
            _registerDaosLayoutClickEvent: function() {
                var e = this.layoutTouDao,
                t = this.layoutZhongDao,
                n = this.layoutWeiDao,
                i = this;
                this.layoutTouDao.node.on(cc.Node.EventType.TOUCH_END,
                function(e) {
                    if (this._clickTouDaoLayout(e), this.cardsLayout.node.children.length <= 5) if (t.node.children.length < 5 && 5 == n.node.children.length) {
                        var o = this.cardsLayout.node.children;
                        i._changeCardPrefabsY(o),
                        i._addDaoCardToLayout(t.node)
                    } else if (n.node.children.length < 5 && 5 == t.node.children.length) {
                        var o = this.cardsLayout.node.children;
                        i._changeCardPrefabsY(o),
                        i._addDaoCardToLayout(n.node)
                    }
                }.bind(this)),
                this.layoutZhongDao.node.on(cc.Node.EventType.TOUCH_END,
                function(o) {
                    if (this._clickZhongDaoLayout(o), 5 == t.node.children.length && this.cardsLayout.node.children.length <= 5) if (e.node.children.length < 3 && 5 == n.node.children.length) {
                        var a = this.cardsLayout.node.children;
                        i._changeCardPrefabsY(a),
                        i._addDaoCardToLayout(e.node)
                    } else if (n.node.children.length < 5 && 3 == e.node.children.length) {
                        var a = this.cardsLayout.node.children;
                        i._changeCardPrefabsY(a),
                        i._addDaoCardToLayout(n.node)
                    }
                }.bind(this)),
                this.layoutWeiDao.node.on(cc.Node.EventType.TOUCH_END,
                function(o) {
                    if (this._clickWeiDaoLayout(o), 5 == n.node.children.length && this.cardsLayout.node.children.length <= 5) if (e.node.children.length < 3 && 5 == t.node.children.length) {
                        var a = this.cardsLayout.node.children;
                        i._changeCardPrefabsY(a),
                        i._addDaoCardToLayout(e.node)
                    } else if (t.node.children.length < 5 && 3 == e.node.children.length) {
                        var a = this.cardsLayout.node.children;
                        i._changeCardPrefabsY(a),
                        i._addDaoCardToLayout(t.node)
                    }
                }.bind(this))
            },
            _clickTouDaoLayout: function(e) {
                var t = this._daoCardNodeInLayoutWithEvent(this.layoutTouDao.node, e);
                return t ? void this._deleteDaoCard(t, !0) : void this._addDaoCardToLayout(this.layoutTouDao.node, 3)
            },
            _clickZhongDaoLayout: function(e) {
                var t = this._daoCardNodeInLayoutWithEvent(this.layoutZhongDao.node, e);
                return t ? void this._deleteDaoCard(t, !0) : void this._addDaoCardToLayout(this.layoutZhongDao.node)
            },
            _clickWeiDaoLayout: function(e) {
                var t = this._daoCardNodeInLayoutWithEvent(this.layoutWeiDao.node, e);
                return t ? void this._deleteDaoCard(t, !0) : void this._addDaoCardToLayout(this.layoutWeiDao.node)
            },
            _daoCardNodeInLayoutWithEvent: function(e, t) {
                var n = e.children || [],
                i = t.getLocation();
                i = e.convertToNodeSpaceAR(i);
                for (var o in n) {
                    var a = n[o],
                    s = a.getBoundingBox();
                    if (cc.rectContainsPoint(s, i)) return a
                }
                return null
            },
            _addDaoCardToLayout: function(e) {
                var t = arguments.length <= 1 || void 0 === arguments[1] ? 5 : arguments[1],
                n = e.children || [];
                if (! (n.length >= 5)) {
                    var i = t - n.length,
                    a = this._selectedCardPrefabs(!0) || [];
                    if (0 != a.length) {
                        a.length > i && (a = a.slice(0, i));
                        var s = a.map(function(e) {
                            return e.getComponent("CardPrefab").cardName()
                        });
                        n.forEach(function(e) {
                            s.push(e.getComponent("CardTypeSprite").cardName())
                        });
                        var r = s.map(function(e) {
                            return new o(e)
                        }).sort(function(e, t) {
                            return o.sort(e, t, !1)
                        }),
                        c = e == this.layoutTouDao.node ? r: this._taoDaoCardModes(),
                        d = e == this.layoutZhongDao.node ? r: this._zhongDaoCardModes(),
                        u = e == this.layoutWeiDao.node ? r: this._weiDaoCardModes();
                        this._isValidCardModes(c, d, u) && (e.removeAllChildren(), r.forEach(function(t) {
                            var n = t.cardName(),
                            i = cc.instantiate(this.cardTypePrefab);
                            i.getComponent("CardTypeSprite").setCard(n),
                            e.addChild(i)
                        }.bind(this)), a.forEach(function(e) {
                            e.removeFromParent()
                        }), this._resetCardsPositionY(), this._resetCardsPositionX(), this._autoActiveDeleteDaoButtons(), this._reloadKQCardModesInner(), this._resetTypeButtonEnablesWithModels())
                    }
                }
            },
            _deleteDaoCard: function(e) {
                var t = !(arguments.length <= 1 || void 0 === arguments[1]) && arguments[1],
                n = e.getComponent("CardTypeSprite").cardName();
                this.addCard(n, !0),
                this._resetCardsPositionY(),
                e.removeFromParent(!0),
                this._autoActiveDeleteDaoButtons(),
                t && (this._reloadKQCardModesInner(), this._resetTypeButtonEnablesWithModels())
            },
            _deleteDaoCardsOfLayout: function(e) {
                var t = Array.from(e.children);
                t.forEach(this._deleteDaoCard.bind(this)),
                this._reloadKQCardModesInner(),
                this._resetTypeButtonEnablesWithModels()
            },
            _isValidCardModes: function(e, t, n) {
                if (e = e || [], t = t || [], n = n || [], cc.log(e.length, t.length, n.length), e.length < 3 || t.length < 5 || n.length < 5) return ! 0;
                var i = o.scoreOfCards(e),
                a = o.scoreOfCards(t),
                s = o.scoreOfCards(n);
                return cc.log("牌分数：", i, a, s),
                i < a && a <= s
            },
            _taoDaoCardModes: function() {
                return this._cardModesOfCardPrefabs(this.layoutTouDao.node.children)
            },
            _zhongDaoCardModes: function() {
                return this._cardModesOfCardPrefabs(this.layoutZhongDao.node.children)
            },
            _weiDaoCardModes: function() {
                return this._cardModesOfCardPrefabs(this.layoutWeiDao.node.children)
            },
            _cardModesOfCardPrefabs: function(e) {
                if (!e) return [];
                var t = e.map(function(e) {
                    var t = e.getComponent("CardTypeSprite");
                    return t.cardMode()
                });
                return t || []
            },
            _autoActiveDeleteDaoButtons: function() {
                this._autoActiveDeleteDaoButton(this.layoutTouDao.node, this.btnDeleteTouDao.node),
                this._autoActiveDeleteDaoButton(this.layoutZhongDao.node, this.btnDeleteZhongDao.node),
                this._autoActiveDeleteDaoButton(this.layoutWeiDao.node, this.btnDeleteWeiDao.node)
            },
            _autoActiveDeleteDaoButton: function(e, t) {
                t.active = e.children.length > 0
            },
            _autoActiveTypeButtons: function() {
                var e = 3 == this.layoutTouDao.node.children.length,
                t = 5 == this.layoutZhongDao.node.children.length,
                n = 5 == this.layoutWeiDao.node.children.length,
                i = this.cardsLayout.node.children || [],
                o = i.length > 0;
                this.btnDone.node.active = e && t && n,
                this.btnCancelAll.node.active = this.btnDone.node.active,
                this.typeButtonsNode.active = o
            }
        }),
        cc._RFpop()
    },
    {
        AudioManager: "AudioManager",
        KQCard: "KQCard",
        KQCardFindTypeExtension: "KQCardFindTypeExtension"
    }],
    CardTypeSprite: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "e614c0FMndAtrOMcy8/PcZw", "CardTypeSprite");
        var i = e("KQCard");
        cc.Class({
            "extends": cc.Component,
            properties: {
                _cardName: null,
                _cardModel: null
            },
            onLoad: function() {},
            setCard: function(e) {
                this._cardName = e,
                this._cardModel = new i(e),
                this._loadCardFrame(e,
                function(e) {
                    this.node.getComponent("cc.Sprite").spriteFrame = e
                }.bind(this))
            },
            cardName: function() {
                return this._cardName
            },
            cardMode: function() {
                return this._cardModel
            },
            _cardFullName: function(e) {
                var t = e;
                return t.startsWith("public-pic-card-poker") || (t = "public-pic-card-poker-" + t),
                t
            },
            _loadCardFrame: function(e, t) {
                cc.assert(t),
                cc.loader.loadRes("images/pokerList/pockList", cc.SpriteAtlas,
                function(n, i) {
                    if (n) return void cc.error(n);
                    e = this._cardFullName(e);
                    var o = i.getSpriteFrame(e);
                    t(o)
                }.bind(this))
            }
        }),
        cc._RFpop()
    },
    {
        KQCard: "KQCard"
    }],
    ChatMessage: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "dc8980X2ZVNKrH9BsIsSE4D", "ChatMessage");
        var i = cc.Class({
            "extends": cc.Component,
            properties: {
                richText: cc.RichText,
                spriteBackground: cc.Sprite
            },
            onLoad: function() {},
            setString: function() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
                t = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
                if (0 != e.length) {
                    this.node.active = !0;
                    var n = 300,
                    o = i.parseString(e);
                    this.richText.maxWidth = 0,
                    this.richText.string = o;
                    var a = this.richText.node.getContentSize().width;
                    a > n && (this.richText.maxWidth = n, this.richText.string = o, a = n),
                    this.node.width = a + 28,
                    this.node.height = this.richText.node.getContentSize().height + 20,
                    this.spriteBackground.node.width = this.node.width,
                    this.spriteBackground.node.height = this.node.height,
                    t && (this.unscheduleAllCallbacks(), this.scheduleOnce(this._hideNode.bind(this), 3))
                }
            },
            _hideNode: function() {
                this.node.active = !1
            }
        });
        i.parseString = function(e) {
            var t = e.replace(/<bq\d{1,2}>/g,
            function(e) {
                var t = e.replace("<", " <img src='").replace(">", "'/> ");
                return t
            });
            return t
        },
        t.exports = i,
        cc._RFpop()
    },
    {}],
    ChatTextRecord: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "88d10U9tIpHNK1entoUH0Ju", "ChatTextRecord"),
        cc.Class({
            "extends": cc.Component,
            properties: {},
            onLoad: function() {},
            setString: function(e) {
                this._richText().string = e
            },
            _richText: function() {
                return this.node.getComponent("cc.RichText")
            }
        }),
        cc._RFpop()
    },
    {}],
    CompareCards: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "9aa4aH/Ha1JfaEeY5nFj5P1", "CompareCards");
        var i = e("KQCardResHelper"),
        o = e("AudioManager"),
        a = e("KQCard");
        cc.Class({
            "extends": cc.Component,
            properties: {
                touLayout: cc.Layout,
                zhongLayout: cc.Layout,
                weiLayout: cc.Layout,
                labelTouScore: cc.Label,
                labelTouScoreRight: cc.Label,
                labelZhongScore: cc.Label,
                labelZhongScoreRight: cc.Label,
                labelWeiScore: cc.Label,
                labelWeiScoreRight: cc.Label,
                touScroeTitle: cc.Node,
                zhongScroeTitle: cc.Node,
                weiScroeTitle: cc.Node,
                scoreStyle: 0,
                _daoLayouts: null,
                _labelScores: null,
                _scores: null,
                _user: null,
                _cardsInfo: null,
                _compareIndex: 0
            },
            onLoad: function() {
                this._daoLayouts = [this.touLayout, this.zhongLayout, this.weiLayout],
                this._labelScores = [[this.labelTouScore, this.labelTouScoreRight], [this.labelZhongScore, this.labelZhongScoreRight], [this.labelWeiScore], [this.labelWeiScoreRight]],
                this.reset(),
                this._scores && this.setScores(this._scores)
            },
            reset: function() {
                this._compareIndex = 0,
                this.node.children.forEach(function(e) {
                    e.active = !1
                })
            },
            setCompareData: function(e) {
                this._user = e,
                this._cardsInfo = e.cardInfo;
                var t = e.cardInfo,
                n = t.map(function(e) {
                    return a.cardsFromArray(e.cards)
                }).reduce(function(e, t) {
                    return e.concat(t)
                },
                []),
                i = [e.score1 || 0, e.score2 || 0, e.score3 || 0];
                this.setCards(n),
                this.setScores(i)
            },
            nextCompareScore: function() {
                if (!this._user) return 0;
                var e = this._cardsInfo[this._compareIndex];
                return e ? e.value: 0
            },
            setCards: function(e) {
                var t = this._allCardSprites();
                e.forEach(function(e, n) {
                    if (! (n >= t.length)) {
                        var o = t[n];
                        i.loadCardSpriteFrame(e.cardName(),
                        function(e) {
                            o.spriteFrame = e
                        })
                    }
                })
            },
            setScores: function(e) {
                if (null == this._labelScores) return void(this._scores = e);
                var t = e.map(function(e) {
                    e = Number(e);
                    var t = e > 0 ? "+ " + e: "- " + e * -1;
                    return t
                });
                t.forEach(function(e, t) {
                    var n = this._labelScores[t];
                    n.forEach(function(t) {
                        t.string = e
                    })
                }.bind(this))
            },
            showTouCards: function() {
                this.touLayout.node.active = !0,
                1 == this.scoreStyle ? this.labelTouScoreRight.node.active = !0 : 0 == this.scoreStyle && (this.labelTouScore.node.active = !0, this.touScroeTitle && (this.touScroeTitle.active = !0)),
                o.instance.playCardType(this._user.sex, this._cardsInfo[this._compareIndex].type),
                this._compareIndex += 1
            },
            showZhongCards: function() {
                this.zhongLayout.node.active = !0,
                1 == this.scoreStyle ? this.labelZhongScoreRight.node.active = !0 : 0 == this.scoreStyle && (this.labelZhongScore.node.active = !0, this.zhongScroeTitle && (this.zhongScroeTitle.active = !0)),
                o.instance.playCardType(this._user.sex, this._cardsInfo[this._compareIndex].type),
                this._compareIndex += 1
            },
            showWeiCards: function() {
                this.weiLayout.node.active = !0,
                1 == this.scoreStyle ? this.labelWeiScoreRight.node.active = !0 : 0 == this.scoreStyle && (this.labelWeiScore.node.active = !0, this.weiScroeTitle && (this.weiScroeTitle.active = !0)),
                o.instance.playCardType(this._user.sex, this._cardsInfo[this._compareIndex].type),
                this._compareIndex += 1
            },
            showNextCards: function() {
                this._daoLayouts = [this.touLayout, this.zhongLayout, this.weiLayout];
                var e = this._daoLayouts.find(function(e) {
                    return ! e.node.active
                });
                e == this.touLayout ? this.showTouCards() : e == this.zhongLayout ? this.showZhongCards() : e == this.weiLayout && this.showWeiCards()
            },
            _clearCards: function() {
                this._clearLayoutCards(this.touLayout),
                this._clearLayoutCards(this.zhongLayout),
                this._clearLayoutCards(this.weiLayout)
            },
            _clearLayoutCards: function(e) {
                this._cardSpritesWithLayout(e).forEach(function(e) {
                    e.spriteFrame = null
                })
            },
            _cardSpritesWithLayout: function(e) {
                var t = e.node;
                return t.children.map(function(e) {
                    return e.getComponent("cc.Sprite")
                })
            },
            _allCardSprites: function() {
                var e = this._cardSpritesWithLayout(this.touLayout),
                t = this._cardSpritesWithLayout(this.zhongLayout),
                n = this._cardSpritesWithLayout(this.weiLayout),
                i = e.concat(t).concat(n);
                return i
            }
        }),
        cc._RFpop()
    },
    {
        AudioManager: "AudioManager",
        KQCard: "KQCard",
        KQCardResHelper: "KQCardResHelper"
    }],
    Countdown: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "6406dyBk8tKVrlJ1+mg7cLt", "Countdown"),
        cc.Class({
            "extends": cc.Component,
            properties: {
                labelTime: cc.Label,
                _callback: null
            },
            onLoad: function() {
                this.labelTime.string = "0"
            },
            startCountdown: function(e, t) {
                this.stop(),
                this._callback = t,
                this.node.active = !0,
                this.labelTime.string = "" + e,
                this.schedule(this._countDown, 1, e)
            },
            stop: function() {
                if (this.unschedule(this._countDown), this.node.active = !1, this._callback) {
                    var e = Number(this.labelTime.string) <= 0,
                    t = this._callback;
                    this._callback = null,
                    t(e)
                }
                this._callback = null
            },
            _countDown: function() {
                var e = Number(this.labelTime.string || "0");
                e -= 1,
                e <= 0 && this.stop(),
                this.labelTime.string = String(e)
            }
        }),
        cc._RFpop()
    },
    {}],
    GameResult: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "6a3cdd+2shGlZ+jeI3trSsB", "GameResult");
        var i = e("KQCard"),
        o = e("AudioManager"),
        a = {
            WIN: 2,
            DRAW: 1,
            LOSE: 0
        },
        s = cc.Class({
            "extends": cc.Component,
            properties: {
                winNode: cc.Node,
                loseNode: cc.Node,
                drawNode: cc.Node,
                resultItems: [cc.Node],
                _deskInfo: null,
                _userId: null,
                _closeCallback: null
            },
            onLoad: function() {
                this._hideResultItems()
            },
            showResults: function(e, t) {
                this._deskInfo = e,
                this._userId = t;
                var n = this._resultStatus();
                this.winNode.active = n == a.WIN,
                this.drawNode.active = n == a.DRAW,
                this.loseNode.active = n == a.LOSE,
                this.winNode.active ? o.instance.playWin() : this.loseNode.active && o.instance.playLose(),
                this.node.getComponent("alert").alert(),
                this.node.getComponent("alert").setDismissCallback(function() {
                    this._closeCallback
                }.bind(this));
                var i = e.players.sort(function(e, t) {
                    return t.cScore - e.cScore
                }),
                s = this.resultItems.map(function(e) {
                    return e.getComponent("ResultItem")
                });
                s.forEach(function(t, n) {
                    if (t.node.active = n < i.length, t.node.active) {
                        var o = i[n];
                        t.updateWithPlayerInfo(o, e.isRandomDesk);
                        var a = this._cardsFromUser(o);
                        t.setCards(a)
                    }
                }.bind(this))
            },
            setCloseCallback: function(e) {
                this._closeCallback = e
            },
            _cardsFromUser: function(e) {
                var t = e.cardInfo.map(function(e) {
                    return i.cardsFromArray(e.cards)
                }).reduce(function(e, t) {
                    return e.concat(t)
                },
                []);
                return t
            },
            _hideResultItems: function() {
                this.resultItems.forEach(function(e) {
                    e.acitve = !1
                })
            },
            _resultStatus: function() {
                var e = this._deskInfo.players,
                t = e.find(function(e) {
                    return e.id == this._userId
                }.bind(this)),
                n = t.cScore;
                return this._deskInfo.isRandomDesk && (n = t.diamond),
                n > 0 ? a.WIN: n < 0 ? a.LOSE: a.DRAW
            }
        });
        t.exports = s,
        cc._RFpop()
    },
    {
        AudioManager: "AudioManager",
        KQCard: "KQCard"
    }],
    KQCardColorsHelper: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "cf1deKQQ4NMMYVV+7xEr9Jf", "KQCardColorsHelper");
        var i = function(e) {
            this.colorNumber = {},
            e.forEach(function(e) {
                var t = e.color,
                n = this.colorNumber[t] || 0;
                this.colorNumber[t] = n + 1
            }.bind(this))
        };
        i.prototype.maxNumber = function() {
            var e = 0;
            for (var t in this.colorNumber) {
                var n = this.colorNumber[t];
                e = Math.max(n, e)
            }
            return e
        },
        t.exports = i,
        cc._RFpop()
    },
    {}],
    KQCardFindTypeExtension: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "54a95JOLVRACIP91XEFodqF", "KQCardFindTypeExtension");
        var i = e("KQCard"),
        o = (e("ArrayExtension"), e("KQCardPointsHelper"));
        t.exports = {},
        i.findDuiZi = function(e) {
            return i._findPointLength(e, 2)
        },
        i._findPointLength = function(e, t) {
            if (e.length < t) return null;
            var n = e.reduce(function(e, t, n) {
                var i = e[t.point] || [];
                return e[t.point] = i,
                i.push(n),
                e
            },
            {}),
            i = [];
            for (var o in n) {
                var a = n[o];
                a.length == t && (a.sort(function(e, t) {
                    return e - t
                }), i.push(a))
            }
            return i.sort(function(e, t) {
                var n = e[0],
                i = t[0];
                return n - i
            }),
            i.length > 0 ? i: null
        },
        i.findLiaDui = function(e) {
            var t = i.findDuiZi(e) || [];
            if (t.length < 2) return null;
            for (var n = [], o = 0; o < t.length; ++o) for (var a = o + 1; a < t.length; ++a) {
                var s = t[o],
                r = t[a],
                c = s.concat(r).sort(function(e, t) {
                    return e - t
                });
                n.push(c)
            }
            return n
        },
        i.findSanTiao = function(e) {
            var t = i._findPointLength(e, 3);
            if (t) return t;
            var n = i.findTieZhi(e);
            return n && (t = [], n.forEach(function(e) {
                var n = [e[0], e[1], e[2]],
                i = [e[1], e[2], e[3]],
                o = [e[0], e[1], e[3]],
                a = [e[0], e[2], e[3]];
                t.push(n),
                t.push(i),
                t.push(o),
                t.push(a)
            })),
            t
        },
        i.findShunZi = function(e) {
            var t = 5;
            if (e.length < t) return null;
            var n = e.unique(function(e, t) {
                return e.point == t.point
            });
            n.sort(i.sortByPoint);
            var o = e.find(function(e) {
                return 1 == e.point
            });
            if (o) {
                var a = new i(o);
                a.point = 14,
                n.push(a)
            }
            for (var s = [], r = 0; r + t <= n.length; ++r) {
                var c = n.slice(r, r + t);
                i.isShunZi(c, t) && !
                function() {
                    var t = [];
                    c.forEach(function(n) {
                        var i = e.findIndex(function(e) {
                            return 14 == n.point ? 1 == e.point: n === e
                        });
                        t.push(i)
                    }),
                    t.sort(Array.sortByNumber),
                    s.push(t)
                } ()
            }
            var d = i._findRepeatPointIndexsArray(s, e);
            return d.forEach(function(e) {
                s.push(e)
            }),
            s.sort(function(e, t) {
                return e[0] - t[0]
            }),
            s.length > 0 ? s: null
        },
        i._findRepeatPointIndexsArray = function(e, t) {
            var n = [];
            return e.forEach(function(e) {
                var i = e.map(function(e) {
                    return t[e]
                });
                i.forEach(function(i, o) {
                    var a = t.findIndex(function(e) {
                        return e !== i && e.point == i.point
                    });
                    if (! (a < 0)) {
                        var s = e.slice();
                        s[o] = a,
                        n.push(s)
                    }
                })
            }),
            n
        },
        i.findTongHua = function(e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 5;
            if (e.length < t) return null;
            var n = Array.from(e);
            n.sort(i.sortByColor);
            for (var o = [], a = 0; a + t <= n.length; ++a) {
                var s = n.slice(a, a + t);
                i.isTongHua(s, t) && !
                function() {
                    var t = [];
                    s.forEach(function(n) {
                        var i = e.findIndex(function(e) {
                            return n === e
                        });
                        t.push(i)
                    }),
                    t.sort(Array.sortByNumber),
                    o.push(t)
                } ()
            }
            return o.length > 0 ? o: null
        },
        i.findHuLu = function(e) {
            var t = 5;
            if (e.length < t) return null;
            var n = new o(e),
            i = e.filter(function(e) {
                var t = e.point,
                i = n.pointNumbers[t];
                return 2 == i || 3 == i
            });
            if (i.length < t) return null;
            var a = [],
            s = [];
            for (var r in n.pointNumbers) {
                var c = n.pointNumbers[r];
                2 == c ? a.push(r) : 3 == c && s.push(r)
            }
            if (0 == a.length || 0 == s.length) return null;
            var d = [];
            return a.forEach(function(t) {
                s.forEach(function(n) {
                    var i = [];
                    e.forEach(function(e, o) {
                        var a = e.point;
                        a != t && a != n || i.push(o)
                    }),
                    d.push(i)
                })
            }),
            d.length > 0 ? d: []
        },
        i.findTieZhi = function(e) {
            return this._findPointLength(e, 4)
        },
        i.findTongHuaShun = function(e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 5;
            if (e.length < t) return null;
            var n = Array.from(e);
            n.sort(i.sortByColor);
            for (var o = [], a = 0; a + t <= n.length; ++a) {
                var s = n.slice(a, a + t);
                if (i.isTongHuaShun(s)) {
                    var r = e.findSubArrayIndexs(s);
                    r.sort(Array.sortByNumber),
                    o.push(r)
                }
            }
            var c = function(e, t) {
                return e.isEqual(t)
            },
            d = [i.cardsFromArray(["4_1", "4_13", "4_12", "4_11", "4_10"]), i.cardsFromArray(["3_1", "3_13", "3_12", "3_11", "3_10"]), i.cardsFromArray(["2_1", "2_13", "2_12", "2_11", "2_10"]), i.cardsFromArray(["1_1", "1_13", "1_12", "1_11", "1_10"])];
            return d.forEach(function(t) {
                var n = e.findSubArrayIndexs(t, c);
                n && o.push(n)
            }),
            o.length > 0 ? o: null
        },
        i.testFind = function() {
            cc.log("开始测试 KQCard 找牌"),
            cc.log("测试找对子");
            var e = [],
            t = i.cardsFromArray(["4_1", "3_13", "4_12", "4_11", "4_10", "4_9", "2_9", "2_8", "2_7", "3_6", "2_6", "2_5", "3_5"]),
            n = i.findDuiZi(t);
            cc.assert(n.isEqual([[5, 6], [9, 10], [11, 12]], !1), "find对子 索引不正确"),
            cc.log("测试找两对"),
            n = i.findLiaDui(t),
            cc.assert(n.isEqual([[5, 6, 9, 10], [5, 6, 11, 12], [9, 10, 11, 12]], !1), "find 两对 索引不正确"),
            cc.log("测试找三条"),
            n = i.findSanTiao(t),
            cc.assert(void 0 == n, "应该没有三条"),
            t = i.cardsFromArray(["4_1", "3_1", "2_1", "4_11", "4_10", "4_9", "3_9", "2_9", "2_7", "3_6", "2_6", "2_5", "3_5"]),
            n = i.findSanTiao(t),
            cc.assert(n.isEqual([[0, 1, 2], [5, 6, 7]], !1), "find 三条 索引不正确"),
            cc.log("测试找顺子"),
            n = i.findShunZi(t),
            cc.assert(void 0 == n, "应该没有顺子"),
            e = ["4_1", "3_1", "2_1", "4_8", "4_10", "4_9", "3_9", "2_9", "2_7", "3_6", "2_6", "2_5", "3_5"],
            t = i.cardsFromArray(e),
            n = i.findShunZi(t),
            cc.assert(7 == n.length, "find 顺子 索引不正确"),
            t = i.cardsFromArray(["4_1", "3_2", "2_3", "4_4", "4_5", "4_13", "3_12", "2_11", "2_10"]),
            n = i.findShunZi(t),
            cc.log(n),
            cc.assert(n.isEqual([[0, 1, 2, 3, 4], [0, 5, 6, 7, 8]], !1), "find 顺子 索引不正确"),
            t = i.cardsFromArray(["4_1", "3_1", "2_2", "4_3", "4_4", "4_13", "3_12", "2_11", "2_10"]),
            n = i.findShunZi(t),
            cc.log(n),
            cc.assert(n.isEqual([[0, 5, 6, 7, 8], [1, 5, 6, 7, 8]], !1), "find 顺子 索引不正确"),
            cc.log("测试找同花"),
            t = i.cardsFromArray(["4_1", "3_13", "4_12", "4_11", "4_10", "4_9", "2_9", "2_8", "2_7", "3_6", "2_6", "2_5", "3_5"]),
            n = i.findTongHua(t),
            cc.assert(n.isEqual([[0, 2, 3, 4, 5], [6, 7, 8, 10, 11]], !1), "find 同花 索引不正确"),
            t = i.cardsFromArray(["4_1", "3_13", "4_12", "4_11", "4_10"]),
            n = i.findTongHua(t),
            cc.assert(null == n, "应该没有同花"),
            cc.log("测试找葫芦"),
            t = i.cardsFromArray(["4_1", "3_13", "4_12", "4_11", "4_10", "4_9", "2_9", "2_8", "2_7", "3_6", "2_6", "2_5", "3_5"]),
            n = i.findHuLu(t),
            cc.assert(null == n, "应该没有葫芦"),
            t = i.cardsFromArray(["4_1", "3_1", "2_2", "3_2", "3_4", "4_4", "4_2", "2_8"]),
            n = i.findHuLu(t),
            cc.assert(n.isEqual([[0, 1, 2, 3, 6], [2, 3, 4, 5, 6]], !1), "find 葫芦 索引不正确"),
            cc.log("测试找铁支"),
            t = i.cardsFromArray(["4_1", "3_13", "4_12", "4_11", "4_10", "4_9", "2_9", "2_8", "2_7", "3_6", "2_6", "2_5", "3_5"]),
            n = i.findTieZhi(t),
            cc.assert(null == n, "应该没有铁支"),
            t = i.cardsFromArray(["4_1", "3_1", "2_2", "3_2", "3_4", "4_4", "4_2", "2_8", "1_2"]),
            n = i.findTieZhi(t),
            cc.assert(n.isEqual([[2, 3, 6, 8]], !1), "find 铁支 索引不正确"),
            cc.log("测试找同花顺"),
            t = i.cardsFromArray(["4_1", "3_13", "4_12", "4_11", "4_10", "4_9", "2_9", "2_8", "2_7", "3_6", "2_6", "2_5", "3_5"]),
            n = i.findTongHuaShun(t),
            cc.assert(n.isEqual([[6, 7, 8, 10, 11]], !1), "find 同花顺不正确"),
            t = i.cardsFromArray(["4_1", "4_13", "4_12", "4_11", "4_10", "4_9", "2_9", "2_8", "2_7", "3_6", "2_6", "2_5", "3_5"]),
            n = i.findTongHuaShun(t),
            cc.assert(n.isEqual([[0, 1, 2, 3, 4], [6, 7, 8, 10, 11]], !1), "find 同花顺不正确"),
            cc.log("KQCard 找牌 测试结束")
        },
        cc._RFpop()
    },
    {
        ArrayExtension: "ArrayExtension",
        KQCard: "KQCard",
        KQCardPointsHelper: "KQCardPointsHelper"
    }],
    KQCardPointsHelper: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "42d3e866XhHdbkspy3Qytap", "KQCardPointsHelper");
        var i = function(e) {
            this.pointNumbers = {},
            e.forEach(function(e) {
                var t = e.point,
                n = this.pointNumbers[t] || 0;
                this.pointNumbers[t] = n + 1
            }.bind(this))
        };
        i.prototype.maxNumber = function() {
            var e = 0;
            for (var t in this.pointNumbers) {
                var n = this.pointNumbers[t];
                e = Math.max(n, e)
            }
            return e
        },
        t.exports = i,
        cc._RFpop()
    },
    {}],
    KQCardResHelper: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "be420vtWaJOHoxQcZwP2xN2", "KQCardResHelper");
        var i = {
            loadCardSpriteFrame: function(e, t) {
                this._loadCardFrame(e, t)
            },
            setCardSpriteFrame: function(e, t) {
                this.loadCardSpriteFrame(t,
                function(t) {
                    e.spriteFrame = t
                })
            },
            _cardFullName: function(e) {
                var t = e;
                return t.startsWith("public-pic-card-poker") || (t = "public-pic-card-poker-" + t),
                t
            },
            _loadCardFrame: function(e, t) {
                cc.assert(t),
                cc.loader.loadRes("images/pokerList/pockList", cc.SpriteAtlas,
                function(n, i) {
                    if (n) return void t(null, n);
                    e = this._cardFullName(e);
                    var o = i.getSpriteFrame(e);
                    t(o)
                }.bind(this))
            }
        };
        t.exports = i,
        cc._RFpop()
    },
    {}],
    KQCardScoreExtension: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "3f5d8wDA+tMPbPd/k4hBAAR", "KQCardScoreExtension");
        var i = e("KQCard"),
        o = (e("KQCardFindTypeExtension"), e("KQCardColorsHelper"), e("KQCardPointsHelper"));
        i.scoreOfCards = function(e) {
            var t = i._convertOneToA(e.slice()),
            n = i._typeScoreOfCards(e);
            0 == n && (t = t.slice(0, 3)),
            t = i._typeCardsSort(t);
            var o = t.reduce(function(e, t, n) {
                var i = Math.pow(15 - n, 2 - n),
                o = e + t.point * i;
                return o
            },
            0),
            a = n + o;
            return a
        },
        i._typeScoreOfCards = function(e) {
            var t = 0;
            return i.containTongHuaShun(e) ? t = 8e6: i.containTieZhi(e) ? t = 7e6: i.containHuLu(e) ? t = 6e6: i.containTongHua(e) ? t = 5e6: i.containShunZi(e) ? t = 4e6: i.containSanTiao(e) ? t = 3e6: i.containLiaDui(e) ? t = 2e6: i.containDuiZi(e) && (t = 1e6),
            t
        },
        i._typeCardsSort = function(e) {
            return null == e || 0 == e.length ? e: i.containTongHuaShun(e) ? i._typeCardsSortShunZi(e) : i.containTieZhi(e) ? i._typeCardsSortTieZhi(e) : i.containHuLu(e) ? i._typeCardsSortHuLu(e) : i.containTongHua(e) ? i._typeCardsSortTongHua(e) : i.containShunZi(e) ? i._typeCardsSortShunZi(e) : i.containSanTiao(e) ? i._typeCardsSortSanTiao(e) : i.containLiaDui(e) ? i._typeCardsSortLiangDui(e) : i.containDuiZi(e) ? i._typeCardsSortDuiZi(e) : e.sort(i.sortByPoint).reverse()
        },
        i._typeCardsSortShunZi = function(e) {
            return e.sort(i.sortByPoint).reverse()
        },
        i._typeCardsSortTieZhi = function(e) {
            return i._typeCardsSortByNumberOfPoints(e)
        },
        i._typeCardsSortHuLu = function(e) {
            return i._typeCardsSortByNumberOfPoints(e)
        },
        i._typeCardsSortTongHua = function(e) {
            return e.sort(i.sortByPoint).reverse()
        },
        i._typeCardsSortSanTiao = function(e) {
            return i._typeCardsSortByNumberOfPoints(e)
        },
        i._typeCardsSortLiangDui = function(e) {
            return i._typeCardsSortByNumberOfPoints(e)
        },
        i._typeCardsSortDuiZi = function(e) {
            return i._typeCardsSortByNumberOfPoints(e)
        },
        i._typeCardsSortByNumberOfPoints = function(e) {
            var t = new o(e),
            n = e.slice().sort(function(e, n) {
                var i = t.pointNumbers[e.point],
                o = t.pointNumbers[n.point];
                return o != i ? o - i: n.point - e.point
            });
            return n
        },
        i.testScore = function() {
            cc.log("开始测试分数");
            var e = i.cardsFromArray(["3_7", "1_7", "1_12", "4_11", "2_8"]),
            t = i.cardsFromArray(["2_9", "1_9", "3_6", "3_4", "4_3"]);
            cc.log("对子分数：", i.scoreOfCards(e), i.scoreOfCards(t)),
            cc.assert(i.scoreOfCards(e) < i.scoreOfCards(t));
            var e = i.cardsFromArray(["3_3", "1_6", "1_13"]),
            t = i.cardsFromArray(["2_10", "1_12", "3_13"]);
            cc.log("乌龙分数：", i.scoreOfCards(e), i.scoreOfCards(t)),
            cc.assert(i.scoreOfCards(e) < i.scoreOfCards(t));
            var e = i.cardsFromArray(["3_2", "1_2", "2_3", "4_3", "2_3"]),
            t = i.cardsFromArray(["2_6", "1_6", "3_6", "3_8", "4_8"]);
            cc.log("葫芦分数：", i.scoreOfCards(e), i.scoreOfCards(t)),
            cc.assert(i.scoreOfCards(e) < i.scoreOfCards(t)),
            cc.log("测试分数计算结束")
        },
        cc._RFpop()
    },
    {
        KQCard: "KQCard",
        KQCardColorsHelper: "KQCardColorsHelper",
        KQCardFindTypeExtension: "KQCardFindTypeExtension",
        KQCardPointsHelper: "KQCardPointsHelper"
    }],
    KQCardSelectExtension: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "66642YNpFVIzb+JM2CkwEgS", "KQCardSelectExtension");
        var i = e("KQCard");
        e("KQCardFindTypeExtension");
        i.autoSelectCards = function(e, t) {
            if (e.length <= t) return e;
            for (var n = e.slice().sort(i.sortByPoint), a = [i.findTongHuaShun, i.findHuLu, i.findTongHua, i.findShunZi, i.findSanTiao, i.findLiaDui, i.findDuiZi], s = null, r = 0; r < a.length; ++r) {
                var c = a[r];
                if (s = c.bind(i)(n), s && s.length > 0) break
            }
            var d = [];
            s && s.length > 0 && (d = s[0]);
            var u = d.map(function(e) {
                return n[e]
            });
            if (u.length < t) for (n = n.kq_excludes(u); u.length < t;) u.push(n.pop());
            else u.length > t && (u = u.slice(o, t));
            return u
        },
        i.testAutoSelect = function(e) {
            cc.log("开始测试自动选牌");
            var e = i.cardsFromArray([{
                suit: "c",
                number: 11
            },
            {
                suit: "c",
                number: 10
            },
            {
                suit: "s",
                number: 4
            },
            {
                suit: "s",
                number: 5
            },
            {
                suit: "c",
                number: 6
            },
            {
                suit: "s",
                number: 1
            },
            {
                suit: "c",
                number: 12
            },
            {
                suit: "s",
                number: 12
            },
            {
                suit: "s",
                number: 8
            },
            {
                suit: "c",
                number: 8
            },
            {
                suit: "c",
                number: 7
            },
            {
                suit: "c",
                number: 4
            },
            {
                suit: "c",
                number: 13
            }]),
            t = i.autoSelectCards(e);
            cc.log(JSON.stringify(t)),
            cc.log("自动选牌测试结束")
        },
        cc._RFpop()
    },
    {
        KQCard: "KQCard",
        KQCardFindTypeExtension: "KQCardFindTypeExtension"
    }],
    KQCard: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "c548c0gMf5BGIH4309MULw+", "KQCard");
        var i = e("KQCardColorsHelper"),
        o = e("KQCardPointsHelper");
        e("NumberExtension");
        cc = cc || {},
        cc.assert = cc.assert || console.assert ||
        function() {},
        cc.log = cc.log || console.log ||
        function() {},
        cc.error = cc.error || console.error ||
        function() {};
        var a = function s(e, t) {
            if (this.color = null, this.point = null, this._initWithColorAndPoint = function(e, t) {
                "s" == e && (e = 4),
                "h" == e && (e = 3),
                "c" == e && (e = 2),
                "d" == e && (e = 1),
                this.point = Number(t),
                this.color = Number(e),
                cc.assert(this.point > 0),
                cc.assert(this.color > 0)
            },
            this._initWithNumber = function(e) {
                this.point = Math.floor(e / 10),
                this.color = e % 10,
                cc.assert(this.point > 0),
                cc.assert(this.color > 0)
            },
            this._initWithObject = function(e) {
                e.point ? this._initWithColorAndPoint(e.color, e.point) : e.suit && this._initWithColorAndPoint(e.suit, e.number)
            },
            this.description = function() {
                return this.cardName()
            },
            this.cardName = function() {
                return this.color + "_" + this.point
            },
            this.sort = function(e) {
                var t = !(arguments.length <= 1 || void 0 === arguments[1]) && arguments[1],
                n = arguments.length <= 2 || void 0 === arguments[2] || arguments[2];
                return s.sort(this, e, t, n)
            },
            this.isEqual = function(e) {
                return !! e && (this.point == e.point && this.color == e.color)
            },
            e && t) return void this._initWithColorAndPoint(t, e);
            var n = Number(e);
            if (!Number.isNaN(n)) return void this._initWithNumber(n);
            if ("string" != typeof e) return "object" == typeof e ? void this._initWithObject(e) : void cc.error("初始化错误：" + e + " " + t);
            var i = e.match(/(\.)*\d_\d+/);
            if (i instanceof Array && i.length > 0) {
                var o = i[0],
                a = o.split("_"),
                r = Number(a[0]),
                c = Number(a[1]);
                this._initWithColorAndPoint(r, c)
            }
        };
        a.prototype.toServerCard = function() {
            return {
                suit: this.color,
                number: this.point
            }
        },
        a.COLOR_SPADE = 4,
        a.COLOR_HEART = 3,
        a.COLOR_CLUB = 2,
        a.COLOR_DIAMOND = 1,
        t.exports = a,
        a.cardsFromArray = function(e) {
            return e.map(function(e) {
                return new a(e)
            })
        },
        a.convertToServerCards = function() {
            var e = arguments.length <= 0 || void 0 === arguments[0] ? [] : arguments[0];
            return e.map(function(e) {
                return e.toServerCard()
            })
        },
        a.TYPE = {
            WuLong: 0,
            DuiZi: 1,
            LiangDui: 2,
            SanTiao: 3,
            ShunZi: 4,
            TongHua: 5,
            HuLu: 6,
            TieZhi: 7,
            TongHuaShun: 8,
            SanTaoHua: 9,
            SanShunZi: 10,
            LiuDuiBan: 11,
            SiTaoSanTiao: 12,
            SanFenTianXia: 13,
            SanTongHuaShun: 14,
            YiTiaoLong: 15,
            QingLong: 16
        },
        a.cardsTypeName = function(e) {
            var t = ["乌龙", "对子", "两对", "三条", "顺子", "同花", "葫芦", "铁支", "同花顺", "三桃花", "三顺子", "六对半", "四套三条", "三分天下", "三同花顺", "一条龙", "清龙"],
            n = a.cardsType(e);
            return t[n]
        },
        a.cardsType = function(e) {
            return a.isQingLong(e) ? a.TYPE.QingLong: a.isLong(e) ? a.TYPE.YiTiaoLong: a.isSanTongHuaShun(e) ? a.TYPE.SanTongHuaShun: a.isSanFenTianXia(e) ? a.TYPE.SanFenTianXia: a.isLiuDuiBan(e) ? a.TYPE.LiuDuiBan: a.isSanShunZi(e) ? a.TYPE.SanShunZi: a.isSanTaoHua(e) ? a.TYPE.SanTaoHua: a.containTongHuaShun(e, 5) ? a.TYPE.TongHuaShun: a.containTieZhi(e) ? a.TYPE.TieZhi: a.containHuLu(e) ? a.TYPE.HuLu: a.containTongHua(e) ? a.TYPE.TongHua: a.containShunZi(e) ? a.TYPE.ShunZi: a.containSanTiao(e) ? a.TYPE.SanTiao: a.containLiaDui(e) ? a.TYPE.LiangDui: a.containDuiZi(e) ? a.TYPE.DuiZi: a.TYPE.WuLong
        },
        a.isTongHua = function(e) {
            var t = arguments.length <= 1 || void 0 === arguments[1] ? 3 : arguments[1];
            if (e.length < t) return ! 1;
            var n = e.map(function(e) {
                return e.color
            }),
            i = n[0];
            for (var o in n) {
                var a = n[o];
                if (a != i) return ! 1
            }
            return ! 0
        },
        a.containTongHua = function(e) {
            var t = arguments.length <= 1 || void 0 === arguments[1] ? 5 : arguments[1];
            if (e.length < t) return ! 1;
            e = Array.from(e),
            e.sort(a.sortByColor);
            for (var n = 0; n + t <= e.length; ++n) {
                var i = e.slice(n, n + t);
                if (a.isTongHua(i, t)) return ! 0
            }
            return ! 1
        },
        a.isShunZi = function(e) {
            var t = arguments.length <= 1 || void 0 === arguments[1] ? 3 : arguments[1];
            if (e.length < t) return ! 1;
            if (a._isShunZiAKQ(e)) return ! 0;
            var n = e.map(function(e) {
                return e.point
            }).sort(function(e, t) {
                return e - t
            }),
            i = n[0];
            for (var o in n) {
                var s = n[o];
                if (s != i) return ! 1;
                i += 1
            }
            return ! 0
        },
        a._isShunZiAKQ = function(e) {
            var t = e.length;
            if (t.length < 3) return ! 1;
            var n = [1],
            i = [14],
            o = 13;
            return Number(t - 1).kq_times(function(e) {
                n.push(o - e),
                i.push(o - e)
            }),
            a._isCardsContainPoints(e, n) || a._isCardsContainPoints(e, i)
        },
        a._isCardsContainPoints = function(e, t) {
            for (var n = function(n) {
                var i = t[n],
                o = e.findIndex(function(e) {
                    return e.point == i
                });
                if (o < 0) return {
                    v: !1
                }
            },
            i = 0; i < t.length; ++i) {
                var o = n(i);
                if ("object" == typeof o) return o.v
            }
            return ! 0
        },
        a.containShunZi = function(e) {
            var t = arguments.length <= 1 || void 0 === arguments[1] ? 5 : arguments[1];
            if (e.length < t) return ! 1;
            var n = e.unique(function(e, t) {
                return e.point == t.point
            });
            n.sort(a.sortByPoint);
            var i = n[0];
            if (1 == i.point) {
                var o = new a(i);
                o.point = 14,
                n.push(o)
            }
            for (var s = 0; s + t <= n.length; ++s) {
                var r = n.slice(s, s + t);
                if (a.isShunZi(r, t)) return ! 0
            }
            return ! 1
        },
        a.isTongHuaShun = function(e) {
            return a.isTongHua(e) && a.isShunZi(e)
        },
        a.containTongHuaShun = function(e) {
            var t = arguments.length <= 1 || void 0 === arguments[1] ? 5 : arguments[1];
            if (e.length < t) return ! 1;
            for (var n = Array.from(e).sort(a.sortByColor), i = 0; i + t <= n.length; ++i) {
                var o = n.slice(i, i + t);
                if (a.isTongHuaShun(o, t)) return ! 0
            }
            return ! 1
        },
        a.isQingLong = function(e) {
            var t = 13;
            return e.length == t && a.isTongHuaShun(e)
        },
        a.isLong = function(e) {
            var t = 13;
            return e.length == t && a.isShunZi(e)
        },
        a.isSanTongHuaShun = function(e) {
            var t = a._colorClassCards(e),
            n = [];
            for (var i in t) {
                var o = t[i];
                n.push(o)
            }
            if (3 != n.length) return ! 1;
            n = n.sort(function(e, t) {
                return e.length > t.length
            });
            var s = n[0],
            r = n[1],
            c = n[2];
            return 3 == s.length && 5 == r.length && 5 == c.length && a._isSanTongHuaShun(s, r, c)
        },
        a._colorClassCards = function(e) {
            var t = {};
            return e.forEach(function(e) {
                var n = e.color,
                i = t[n];
                i || (i = [], t[n] = i),
                i.push(e)
            }),
            t
        },
        a._isSanTongHuaShun = function(e, t, n) {
            return a.isTongHuaShun(e) && a.isTongHuaShun(t) && a.isTongHuaShun(n)
        },
        a.isSanShunZi = function(e) {
            if (e.length < 13) return ! 1;
            var t = [],
            n = function(e) {
                return ! t.includes(Number(e.point)) && (t.push(Number(e.point)), !0)
            },
            i = e.filter(n);
            if (i.sort(a.sortByPoint), i.length < 3) return ! 1;
            var o = i.splice(0, 3),
            s = e.filter(function(e) {
                return ! o.includes(e)
            });
            if (t = [], i = s.filter(n).sort(a.sortByPoint), i.length < 5) return ! 1;
            var r = i.splice(0, 5),
            c = s.filter(function(e) {
                return ! r.includes(e)
            }).sort(a.sortByPoint),
            d = a._isSanShunZi(o, r, c);
            if (d) return ! 0;
            var u = a._convertOneToA(e);
            return e !== u && a.isSanShunZi(u)
        },
        a._isSanShunZi = function(e, t, n) {
            return a.isShunZi(e) && a.isShunZi(t) && a.isShunZi(n)
        },
        a.containTieZhi = function(e) {
            var t = 4;
            if (e.length < t) return ! 1;
            var n = new o(e);
            return n.maxNumber() >= t
        },
        a.isTieZhi = function(e) {
            var t = 4;
            if (e.length != t) return ! 1;
            var n = e.reduce(function(e, t) {
                return e == t.point ? e: -1
            },
            e[0].point);
            return n != -1
        },
        a.isSanFenTianXia = function(e) {
            var t = 13;
            if (e.length < t) return ! 1;
            var n = 4,
            i = new o(e),
            a = 0;
            for (var s in i.pointNumbers) {
                var r = i.pointNumbers[s];
                r == n && (a += 1)
            }
            return 3 === a
        },
        a.isSiTaoSanTiao = function(e) {
            var t = 12;
            if (e.length < t) return ! 1;
            var n = 3,
            i = new o(e),
            a = 0;
            for (var s in i.pointNumbers) {
                var r = i.pointNumbers[s];
                r == n && (a += 1)
            }
            return 4 == a
        },
        a.isLiuDuiBan = function(e) {
            var t = 12;
            if (e.length < t) return ! 1;
            var n = 2,
            i = new o(e),
            a = 0;
            for (var s in i.pointNumbers) {
                var r = i.pointNumbers[s];
                r >= n && (a += 1)
            }
            return 6 == a
        },
        a.isSanTaoHua = function(e) {
            var t = 13;
            if (e.length < t) return ! 1;
            var n = new i(e),
            o = [];
            for (var a in n.colorNumber) o.push(n.colorNumber[a]);
            return o.sort(function(e, t) {
                return e - t
            }),
            3 == o.length && (3 == o[0] && 5 == o[1] && 5 == o[2])
        },
        a.containHuLu = function(e) {
            var t = 5;
            if (e.length < t) return ! 1;
            var n = new o(e),
            i = [],
            a = 0;
            for (var s in n.pointNumbers) i[a] = n.pointNumbers[s],
            a += 1;
            return i.indexOf(3) != -1 && i.indexOf(2) != -1
        },
        a.isHuLu = function(e) {
            if (5 != e.length) return ! 1;
            var t = e.map(function(e) {
                return e.point
            }).sort(function(e, t) {
                return e - t
            }),
            n = t[0],
            i = n,
            o = 0,
            a = 0;
            t.forEach(function(e) {
                e != n && e != i && (i = e, a = 0),
                o += e == n ? 1 : 0,
                a += e == i ? 1 : 0
            });
            var s = Math.max(o),
            r = Math.min(a);
            return 2 == r && 3 == s
        },
        a.containSanTiao = function(e) {
            if (e.length < 3) return ! 1;
            var t = new o(e);
            for (var n in t.pointNumbers) if (t.pointNumbers[n] >= 3) return ! 0;
            return ! 1
        },
        a.isSanTiao = function(e) {
            if (3 != e.length) return ! 1;
            var t = e.reduce(function(e, t) {
                return t.point == e ? e: -1
            },
            e[0].point);
            return t != -1
        },
        a.containLiaDui = function(e) {
            if (e.length < 4) return ! 1;
            var t = 0,
            n = new o(e);
            for (var i in n.pointNumbers) if (2 == n.pointNumbers[i] && (t += 1, 2 == t)) return ! 0;
            return ! 1
        },
        a.isLiaDui = function(e) {
            if (4 != e.length) return ! 1;
            var t = new o(e);
            for (var n in t.pointNumbers) if (2 != t.pointNumbers[n]) return ! 1;
            return ! 0
        },
        a.isDuiZi = function(e) {
            if (2 != e.length) return ! 1;
            var t = e[0],
            n = e[1];
            return t.point == n.point
        },
        a.containDuiZi = function(e) {
            if (e.length < 2) return ! 1;
            var t = new o(e);
            for (var n in t.pointNumbers) if (2 == t.pointNumbers[n]) return ! 0;
            return ! 1
        },
        a.isTeShuPai = function(e) {
            return ! (e.length < 13) && (a.isQingLong(e) || a.isLong(e) || a.isSanTongHuaShun(e) || a.isSanFenTianXia(e) || a.isSiTaoSanTiao(e) || a.isLiuDuiBan(e) || a.isSanShunZi(e) || a.isSanTaoHua(e))
        },
        a._convertOneToA = function(e) {
            if (void 0 == e.find(function(e) {
                return 1 == e.point
            })) return e;
            var t = e.map(function(e) {
                if (1 == e.point) {
                    var t = new a(14, e.color);
                    return t
                }
                return e
            });
            return t
        },
        a.sortByPoint = function(e, t) {
            var n = Number(e.point) - Number(t.point);
            return n
        },
        a.sortByColor = function(e, t) {
            var n = arguments.length <= 2 || void 0 === arguments[2] || arguments[2];
            return t.color == e.color ? (e.point - t.point) * (n ? 1 : -1) : t.color - e.color
        },
        a.sort = function(e, t) {
            var n = arguments.length <= 2 || void 0 === arguments[2] || arguments[2],
            i = arguments.length <= 3 || void 0 === arguments[3] || arguments[3],
            o = 1;
            if (e.point == t.point) o = e.color - t.color;
            else {
                var a = e.point,
                s = t.point;
                i && 1 == a && (a = 14),
                i && 1 == s && (s = 14),
                o = a - s
            }
            return o * (n ? 1 : -1)
        },
        a.test = function() {
            cc.log("开始测试 KQCard");
            var e = a.cardsFromArray(["1_1", "1_2", "1_3", "2_1", "2_2", "2_3", "2_4", "2_5", "3_1", "3_2", "3_3", "3_4", "3_5"]);
            cc.assert(a.isSanTongHuaShun(e), "应该是三同花顺"),
            cc.assert(a.isSanShunZi(e), "应该是三顺子"),
            e = a.cardsFromArray(["1_1", "2_1", "3_1", "4_1", "1_12", "2_12", "3_12", "4_12", "1_11", "2_11", "3_11", "4_11", "3_5"]),
            cc.assert(a.isSanFenTianXia(e), "应该是 三分天下"),
            e = a.cardsFromArray(["2_2", "2_1", "3_1", "4_1", "1_12", "2_12", "3_12", "4_12", "1_11", "2_11", "3_11", "4_11", "3_5"]),
            cc.assert(!a.isSanFenTianXia(e), "不应该是三分天下"),
            e = a.cardsFromArray(["1_1", "2_1", "3_1", "1_3", "2_3", "3_3", "1_13", "2_13", "3_13", "1_7", "2_7", "3_7", "3_5"]),
            cc.assert(a.isSiTaoSanTiao(e), "应该是 四套三条"),
            e = a.cardsFromArray(["2_2", "2_1", "3_1", "4_1", "1_12", "2_12", "3_12", "4_12", "1_11", "2_11", "3_11", "4_11", "3_5"]),
            cc.assert(!a.isSiTaoSanTiao(e), "不应该是 四套三条"),
            e = a.cardsFromArray(["1_1", "2_1", "1_2", "2_2", "1_3", "2_3", "1_4", "2_4", "1_5", "2_5", "1_7", "2_7", "3_5"]),
            cc.assert(a.isLiuDuiBan(e), "应该是 六对半"),
            e = a.cardsFromArray(["2_2", "2_1", "3_1", "4_1", "1_12", "2_12", "3_12", "4_12", "1_11", "2_11", "3_11", "4_11", "3_5"]),
            cc.assert(!a.isLiuDuiBan(e), "不应该是 六对半"),
            cc.log("三顺子测试"),
            e = a.cardsFromArray(["1_2", "2_3", "1_4", "2_4", "1_5", "2_6", "1_7", "2_3", "1_10", "2_11", "1_12", "2_13", "3_1"]),
            cc.assert(a.isSanShunZi(e), "应该是 三顺子"),
            e = a.cardsFromArray(["2_2", "2_1", "3_1", "4_1", "1_12", "2_12", "3_12", "4_12", "1_11", "2_11", "3_11", "4_11", "3_5"]),
            cc.assert(!a.isSanShunZi(e), "不应该是 三顺子"),
            cc.log("三桃花测试"),
            e = a.cardsFromArray(["1_3", "1_4", "1_12", "2_4", "2_7", "2_8", "2_10", "2_11", "3_8", "3_9", "3_11", "3_12", "3_13"]),
            cc.assert(a.isSanTaoHua(e), "应该是 三桃花"),
            cc.log("同花顺测试"),
            e = a.cardsFromArray(["1_3", "1_4", "1_5", "1_6", "1_7"]),
            cc.assert(a.isTongHuaShun(e), "应该是 同花顺"),
            cc.log("铁支测试"),
            e = a.cardsFromArray(["1_3", "2_3", "3_3", "4_3", "1_7"]),
            cc.assert(a.containTieZhi(e), "应该包含有 铁支"),
            cc.assert(!a.isTieZhi(e), "应该不是 铁支"),
            e = a.cardsFromArray(["1_3", "2_3", "3_3", "4_3"]),
            cc.assert(a.isTieZhi(e), "应该是 铁支"),
            cc.log("葫芦测试"),
            e = a.cardsFromArray(["1_3", "2_3", "3_3", "4_7", "1_7", "4_8"]),
            cc.assert(a.containHuLu(e), "应该包含 葫芦"),
            cc.assert(!a.isHuLu(e), "应该不是 葫芦"),
            e = a.cardsFromArray(["1_3", "2_3", "3_3", "4_7", "1_7"]),
            cc.assert(a.isHuLu(e), "应该是 葫芦"),
            cc.log("同花测试"),
            e = a.cardsFromArray(["1_2", "1_9", "1_5", "1_8", "1_7"]),
            cc.assert(a.isTongHua(e), "应该是 同花"),
            e = a.cardsFromArray(["1_2", "1_9", "1_5", "1_8", "2_7"]),
            cc.assert(!a.isTongHua(e), "应该不是 同花"),
            e = a.cardsFromArray(["1_2", "1_9", "1_5", "1_8", "3_7", "1_7"]),
            cc.assert(a.containTongHua(e), "应该包含 同花"),
            cc.assert(!a.isTongHua(e), "应该不是 同花"),
            cc.log("顺子测试"),
            e = a.cardsFromArray(["1_2", "2_3", "3_4", "4_5", "1_6"]),
            cc.assert(a.isShunZi(e), "应该是 顺子"),
            e = a.cardsFromArray(["1_1", "2_13", "3_12", "4_11", "1_10"]),
            cc.assert(a.isShunZi(e), "应该是 顺子"),
            e = a.cardsFromArray(["4_1", "3_13", "4_12", "4_11", "4_10", "4_9", "2_9", "2_8", "2_7", "3_6", "2_6", "2_5", "3_5"]),
            cc.assert(a.containShunZi(e), "应该包含 顺子"),
            cc.log("三条测试"),
            e = a.cardsFromArray(["1_2", "2_2", "3_2", "4_5", "1_6"]),
            cc.assert(a.containSanTiao(e), "应该包含 三条"),
            cc.assert(!a.isSanTiao(e), "应该不是 三条"),
            e = a.cardsFromArray(["1_2", "2_2", "3_2"]),
            cc.assert(a.isSanTiao(e), "应该是 三条"),
            cc.log("两对测试"),
            e = a.cardsFromArray(["1_2", "2_2", "3_5", "4_5", "1_6"]),
            cc.assert(a.containLiaDui(e), "应该包含有 两对"),
            cc.assert(!a.isLiaDui(e), "应该不是 两对"),
            e = a.cardsFromArray(["1_2", "2_2", "3_5", "4_5"]),
            cc.assert(a.isLiaDui(e), "应该是 两对"),
            cc.log("对子测试"),
            e = a.cardsFromArray(["1_2", "2_2", "3_7", "4_5", "1_6"]),
            cc.assert(a.containDuiZi(e), "应该包含有 对子"),
            cc.log("\nKQCard 测试结束")
        },
        cc._RFpop()
    },
    {
        KQCardColorsHelper: "KQCardColorsHelper",
        KQCardPointsHelper: "KQCardPointsHelper",
        NumberExtension: "NumberExtension"
    }],
    KQGlabolSocketEventHander: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "babea3CWj9G1pWM9AkXao0n", "KQGlabolSocketEventHander");
        var i = e("socket"),
        o = e("KQGlobalEvent"),
        a = e("KQNativeInvoke"),
        s = {
            start: function() {
                this._didStart || (this._didStart = !0, o.on(i.Event.ReceiveForceExit, this._forceExitApp, this))
            },
            _forceExitApp: function(e) {
                a.forceExitApp()
            }
        };
        t.exports = s,
        cc._RFpop()
    },
    {
        KQGlobalEvent: "KQGlobalEvent",
        KQNativeInvoke: "KQNativeInvoke",
        socket: "socket"
    }],
    KQGlobalEvent: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "d90d6OrggVEXa29ffA+vZY0", "KQGlobalEvent");
        var i = {
            _handles: {},
            emit: function(e) {
                var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                "string" == typeof t && (t = {
                    data: t
                });
                var n = [];
                t.eventName = e;
                for (var i in this._handles) if (i == e) for (var o = 0; o < this._handles[i].length; o++) {
                    var a = this._handles[i][o](t);
                    n.push(a)
                }
                return n
            },
            on: function(e, t, n) {
                this._handles[e] = this._handles[e] || [],
                this._handles[e].push(t.bind(n)),
                t._caller = n
            },
            off: function(e) {
                for (var t = 0; t < this._handles[e].length; t++) this._handles[e][t] = null
            },
            offTarget: function(e) {
                for (var t in this._handles) {
                    var n = this._handles[t],
                    i = n.filter(function(t) {
                        return t._caller = e
                    }).map(function(e, t) {
                        return t
                    }),
                    o = 0;
                    i.forEach(function(e) {
                        n.splice(e + o, 1),
                        o += 1
                    })
                }
            }
        };
        t.exports = i,
        cc._RFpop()
    },
    {}],
    KQNativeInvoke: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "7327dLBqWVNaJ14fJQ4jq6Y", "KQNativeInvoke");
        var i = {
            IOSClassName: "AppController",
            ANDRIODClassName: "com/xinyue/ssz/AppActivity",
            isNativeIOS: function() {
                var e = cc.sys.platform;
                return e == cc.sys.IPHONE || e == cc.sys.IPAD
            },
            isNativeAndroid: function() {
                var e = cc.sys.platform;
                return e == cc.sys.ANDROID
            },
            isNative: function() {
                return 1 == cc.sys.isNative
            }
        };
        i.wxLogin = function() {
            i.isNative() && (i.isNativeIOS() ? jsb.reflection.callStaticMethod(i.IOSClassName, "wxLogin") : i.isNativeAndroid() && jsb.reflection.callStaticMethod(i.ANDRIODClassName, "wxLogin", "()V"))
        },
        i.alert = function(e) {
            i.isNative() && (i.isNativeIOS() || i.isNativeAndroid() && jsb.reflection.callStaticMethod(i.ANDRIODClassName, "alertMessage", "(Ljava/lang/String;)V", e))
        },
        i.log = function(e, t) {
            i.isNative() && (i.isNativeIOS() || i.isNativeAndroid() && jsb.reflection.callStaticMethod(i.ANDRIODClassName, "log", "(Ljava/lang/String;Ljava/lang/String;)V", e, t))
        },
        i.shareHallToWeChatFriend = function() {
            i.isNative() && (i.isNativeIOS() ? jsb.reflection.callStaticMethod(i.IOSClassName, "wxShareHallFriend") : jsb.reflection.callStaticMethod(i.ANDRIODClassName, "wxShareHallFriend", "(Ljava/lang/String;)V", cc.shareUrl))
        },
        i.shareHallToQQriend = function() {
            i.isNative() && (i.isNativeIOS() ? jsb.reflection.callStaticMethod(i.IOSClassName, "wxShareHallFriend") : jsb.reflection.callStaticMethod(i.ANDRIODClassName, "QQShareFriend", "(Ljava/lang/String;)V", cc.shareUrl))
        },
        i.shareHallToQQriend = function() {
            i.isNative() && (i.isNativeIOS() ? jsb.reflection.callStaticMethod(i.IOSClassName, "wxShareHallFriend") : jsb.reflection.callStaticMethod(i.ANDRIODClassName, "shareToQzone", "(Ljava/lang/String;)V", cc.shareUrl))
        },
        i.shareHallToWeChatTimeline = function() {
            i.isNative() && (i.isNativeIOS() ? jsb.reflection.callStaticMethod(i.IOSClassName, "wxShareHallTimeline") : jsb.reflection.callStaticMethod(i.ANDRIODClassName, "wxShareHallTimeline", "(Ljava/lang/String;)V", cc.shareUrl))
        },
        i.forceExitApp = function() {
            i.isNative() && (i.isNativeIOS() ? jsb.reflection.callStaticMethod(i.IOSClassName, "exitApp") : jsb.reflection.callStaticMethod(i.ANDRIODClassName, "exitApp", "()V"))
        },
        i.downloadNewVersion = function(e, t) {
            i.isNativeIOS() ? jsb.reflection.callStaticMethod(i.IOSClassName, "downloadNewVersion:", e) : jsb.reflection.callStaticMethod(i.ANDRIODClassName, "downloadNewVersion", "(Ljava/lang/String;)V", t)
        },
        i.shareRoomToWeChatFriend = function(e, t) {
            i.isNativeIOS() ? jsb.reflection.callStaticMethod(i.IOSClassName, "wxShareFriend:description:", id, t) : i.isNativeAndroid() && jsb.reflection.callStaticMethod(i.ANDRIODClassName, "wxShareFriend", "(Ljava/lang/String;Ljava/lang/String;)V", id, t)
        },
        i.shareRoomToWeChatTimeline = function(e, t) {
            i.isNativeIOS() ? jsb.reflection.callStaticMethod(i.IOSClassName, "wxShare:description:", id, t) : i.isNativeAndroid() && jsb.reflection.callStaticMethod(i.ANDRIODClassName, "wxShare", "(Ljava/lang/String;Ljava/lang/String;)V", id, t)
        },
        i.shareScreenToWeChatFriend = function() {
            i.isNativeIOS() ? jsb.reflection.callStaticMethod(i.IOSClassName, "wxScreenShareFriend") : jsb.reflection.callStaticMethod(i.ANDRIODClassName, "wxScreenShareFriend", "()V")
        },
        i.shareScreenToWeChatTimeline = function() {
            i.isNativeIOS() ? jsb.reflection.callStaticMethod(i.IOSClassName, "wxScreenShare") : jsb.reflectoin.callStaticMethod(i.ANDRIODClassName, "wxScreenShare", "()V")
        },
        i.startRecord = function() {
            i.isNative() && (i.isNativeIOS() ? jsb.reflection.callStaticMethod(i.IOSClassName, "record") : i.isNativeAndroid() && jsb.reflection.callStaticMethod(i.ANDRIODClassName, "record", "()V"))
        },
        i.endRecord = function() {
            i.isNative() && (i.isNativeIOS() ? jsb.reflection.callStaticMethod(i.IOSClassName, "endRecord") : i.isNativeAndroid() && jsb.reflection.callStaticMethod(i.ANDRIODClassName, "endRecord", "()V"))
        },
        i.playAudioWithUrl = function(e) {
            i.isNative() && (i.isNativeIOS() ? jsb.reflection.callStaticMethod(i.IOSClassName, "playUrl:", e) : i.isNativeAndroid() && jsb.reflection.callStaticMethod(i.ANDRIODClassName, "playUrl", "(Ljava/lang/String;)V", e))
        },
        t.exports = i,
        cc._RFpop()
    },
    {}],
    MsgControl: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "dd242dsY+hBG5LpL7ZF7Kn6", "MsgControl");
        var i = e("socket"),
        o = e("ChatMessage"),
        a = e("AudioManager");
        cc.Class({
            "extends": cc.Component,
            properties: {
                bqNode: cc.Node,
                bqNode1: cc.Node,
                btnLanguageNode: cc.Node,
                btnLanguageNode1: cc.Node,
                btnChartNode: cc.Node,
                btnChartNode1: cc.Node,
                textScrollView: cc.Node,
                imageContentNode: cc.Node,
                editBox: cc.EditBox,
                textRecordScrollView: cc.ScrollView,
                textRecordLayout: cc.Layout,
                textPrefab: cc.Prefab,
                chatTextRecordPrefab: cc.Prefab,
                inputNode: cc.Node,
                _userId: null,
                _playerInfos: null,
                _chatTextMessageRecords: null
            },
            onLoad: function() {
                this._userId = i.instance.userInfo.id,
                this._playerInfos = [],
                this.textContent = this.textScrollView.getComponent(cc.ScrollView).content;
                for (var e = this,
                t = a.instance.chatTexts(), n = 0; n < t.length; n++) {
                    var o = cc.instantiate(this.textPrefab);
                    o.getComponent("cellText").setText(t[n]),
                    o.getComponent("cellText").onSelectAction = function(t) {
                        e.onTextClickAction(t)
                    },
                    this.textContent.h = 1e3,
                    this.textContent.addChild(o)
                }
            },
            onTextClickAction: function() {
                var e = arguments.length <= 0 || void 0 === arguments[0] ? "": arguments[0];
                this.editBox.string = "",
                this.sendText(e)
            },
            clickEmoji: function(e, t) {
                var n = this.editBox.string;
                this.editBox.string = n + "<" + t + ">"
            },
            clickSend: function() {
                var e = this.editBox.string || "";
                0 != e.length && (this.editBox.string = "", this.sendText(e))
            },
            sendText: function() {
                var e = arguments.length <= 0 || void 0 === arguments[0] ? "": arguments[0];
                0 != e.length && (i.sendText(this._userId, e), this.dismiss())
            },
            dismiss: function() {
                this.node.active = !1
            },
            bqAction: function() {
                this.bqNode1.active = this.btnLanguageNode.active = this.btnChartNode1.active = !0,
                this.bqNode.active = this.btnLanguageNode1.active = this.btnChartNode.active = !1,
                this.textScrollView.active = !1,
                this.imageContentNode.active = !0,
                this.textRecordScrollView.node.active = !1
            },
            textAction: function() {
                this.bqNode1.active = this.btnLanguageNode.active = this.btnChartNode.active = !1,
                this.bqNode.active = this.btnLanguageNode1.active = this.btnChartNode1.active = !0,
                this.textScrollView.active = !0,
                this.imageContentNode.active = !1,
                this.textRecordScrollView.node.active = !1;
            },
            chartAction: function() {
                this.bqNode1.active = this.btnLanguageNode1.active = this.btnChartNode1.active = !1,
                this.bqNode.active = this.btnLanguageNode.active = this.btnChartNode.active = !0,
                this.textScrollView.active = this.imageContentNode.active = !1,
                this.textRecordScrollView.node.active = !0
            },
            addPlayerInfos: function(e) {
                this._playerInfos = this._playerInfos || [],
                e.forEach(function(e) {
                    var t = this._playerInfos.find(function(t) {
                        return t.id == e.id
                    });
                    null == t && this._playerInfos.push(e)
                }.bind(this))
            },
            addChatTextMessage: function(e, t) {
                this._playerInfos = this._playerInfos || [];
                var n = "[ID:" + e + "说]：",
                i = this._playerInfos.find(function(t) {
                    return t.id == e
                });
                i && (n = "[" + i.nickname + "说]：");
                var a = n + t;
                a = o.parseString(a),
                this._addChatTextToRecord(a)
            },
            _addChatTextToRecord: function(e) {
                var t = cc.instantiate(this.chatTextRecordPrefab),
                n = t.getComponent("ChatTextRecord");
                n.setString(e),
                this.textRecordLayout.node.addChild(t),
                this.textRecordScrollView.scrollToBottom()
            }
        }),
        cc._RFpop()
    },
    {
        AudioManager: "AudioManager",
        ChatMessage: "ChatMessage",
        socket: "socket"
    }],
    NetworkError: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "c99d35Sy6hDPbrte9nVczxP", "NetworkError");
        var i = (e("manager"), e("KQNativeInvoke"));
        cc.Class({
            "extends": cc.Component,
            properties: {},
            onLoad: function() {},
            exitAction: function() {
                cc.director.end(),
                i.isNativeIOS() ? jsb.reflection.callStaticMethod(i.IOSClassName, "exitApp") : jsb.reflection.callStaticMethod(i.ANDRIODClassName, "exitApp", "()V")
            }
        }),
        cc._RFpop()
    },
    {
        KQNativeInvoke: "KQNativeInvoke",
        manager: "manager"
    }],
    NumberExtension: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "80e21gZRpNM4pIiCpZ+7s8m", "NumberExtension"),
        Number.prototype.kq_times || (Number.prototype.kq_times = function(e, t) {
            if (e) for (var n = 0; n < this; ++n) t ? e.apply(t, n) : e(n)
        }),
        cc._RFpop()
    },
    {}],
    Playback: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "0d3095dnBVFo5D1hEDDa5KQ", "Playback");
        var i = e("socket"),
        o = cc.Class({
            "extends": cc.Component,
            properties: {
                _playbackDatas: null,
                _isPlaybacking: !1
            },
            statics: {
                instance: null
            },
            onLoad: function() {
                o.instance = this,
                cc.game.addPersistRootNode(this.node)
            },
            setPlaybackDatas: function(e) {
                this._playbackDatas = e
            },
            removePlaybackDatas: function() {
                this.setPlaybackDatas(null),
                this.stopPlayback()
            },
            isContainPlaybackDatas: function() {
                return null != this._playbackDatas
            },
            startPlayback: function() {
                return cc.log("Playback 开始回放"),
                this._isPlaybacking = !0,
                this._playbackDatas ? void this._executePlayback() : (cc.error("想回放，却没有回放数据"), void this.stopPlayback())
            },
            stopPlayback: function() {
                this._isPlaybacking = !1,
                this.unscheduleAllCallbacks()
            },
            isPlaybacking: function() {
                return this._isPlaybacking
            },
            _executePlayback: function() {
                var e = 1,
                t = 3;
                cc.log(this._playbackDatas),
                this._playbackDatas = this._playbackDatas.filter(function(e, t) {
                    return t == this._playbackDatas.length - 1 || e.indexOf('"action":"gameOver') == -1
                }.bind(this)),
                this._playbackDatas.forEach(function(n, o) {
                    var a = e + o * t;
                    o == this._playbackDatas.length - 1 && (a = e + (o - 1) * t + 1),
                    this.scheduleOnce(function() {
                        cc.log("回放开始模拟 Socket 接收到服务器消息, ", o),
                        i.instance._dispatchResponse(n)
                    },
                    a)
                }.bind(this))
            }
        });
        t.exports = o,
        cc._RFpop()
    },
    {
        socket: "socket"
    }],
    Player: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "6ffa0O02PFOp78QADTW5zGf", "Player");
        var i = (e("socket"), e("KQGlobalEvent"), e("ArrayExtension"), e("UserModelHelper"));
        cc.Class({
            "extends": cc.Component,
            properties: {
                foldCardNode: cc.Node,
                cardsBackLayout: cc.Layout,
                compareCardsNode: cc.Node,
                userInfoNode: cc.Node,
                chatMessageNode: cc.Node,
                userAvatarNode: cc.Node,
                userSampleInfoNode: cc.Node,
                userId: 0,
                piaoTitle: cc.Node,
                piaoTitleFrames: cc.SpriteAtlas,
                _userInfo: null,
                _deskInfo: null,
                playedCompareCardsIndexs: {
                    visible: !1,
                    "default": void 0
                }
            },
            onLoad: function() {
                this.userAvatarNode.on(cc.Node.EventType.TOUCH_START, this._showUserInfo, this),
                this.reset()
            },
            onDestroy: function() {
                this.userAvatarNode.off(cc.Node.EventType.TOUCH_START, this._showUserInfo, this)
            },
            _showUserInfo: function() {
                this.userSampleInfoNode.getComponent("UserSampleInfo").updateWithUser(this._userInfo)
            },
            reset: function() {
                this.foldCardNode.active = !1,
                this.cardsBackLayout.active = !1,
                this.compareCardsNode.active = !1,
                this.compareCardsNode.getComponent("CompareCards").reset(),
                this.updatePiaoTitle(null)
            },
            updateUserInfoWithUsers: function(e) {
                var t = e.find(function(e) {
                    return this.userId == e.id
                }.bind(this));
                this.updateUserInfo(t)
            },
            updatePlayerPiaoTitle: function(e) {
                e.userId == this.userId && this.updatePiaoTitle(e.piaoN)
            },
            updateUserInfo: function(e) {
                if (this._userInfo = e, this.node.active = null != e, this.userInfoNode.active = this.node.active, e) {
                    var t = this.userInfoNode.getComponent("userInfo");
                    t.updateAvatar(e.avatarUrl),
                    t.updateNickname(e.nickname),
                    t.setOfflineVisible(!e.onlineStatus);
                    var n = this._deskInfo.cIndex;
                    this._deskInfo && n > 0 && this.playedCompareCardsIndexs.indexOf(n) == -1 && i.isPlayedCards(e) && (this.playCard(e.id), this.compareCardsNode.getComponent("CompareCards").setCompareData(e)),
                    this.updatePiaoTitle(e.piaoN)
                }
            },
            updatePiaoTitle: function(e) {
                if (null == e) return this.piaoTitle.spriteFrame = null,
                void(this.piaoTitle.active = !1);
                this.piaoTitle.active = !0;
                var t = null;
                t = 0 == e ? "no_piao": "piao_" + e,
                this.piaoTitle.getComponent(cc.Sprite).spriteFrame = this.piaoTitleFrames.getSpriteFrame(t)
            },
            updateBanker: function() {
                var e = this.userInfoNode.getComponent("userInfo");
                if (!this._userInfo) return void e.setIsBanker(!1);
                var t = !!this._userInfo && this._userInfo.isBanker;
                e.setIsBanker(t)
            },
            updateScore: function(e) { ! e && this._userInfo && (e = this._userInfo.totalScore);
                var t = this.userInfoNode.getComponent("userInfo");
                t.updateScore(e)
            },
            updateDeskInfo: function(e) {
                this._deskInfo = e,
                e && !e.isCBegin && this.reset()
            },
            showReadyStatus: function(e) {
                var t = arguments.length <= 1 || void 0 === arguments[1] || arguments[1];
                this.node.active && this._userInfo.id == e && this.userInfoNode.getComponent("userInfo").setReadyNodeVisible(t)
            },
            hideReadyStatus: function() {
                this.userInfoNode.getComponent("userInfo").setReadyNodeVisible(!1)
            },
            playFaPaiAnimation: function() {
                if (cc.log("playFaPaiAnimation"), this.node.active && !i.isPlayedCards(this._userInfo)) {
                    var e = this.cardsBackLayout.getComponent("cardsBack");
                    e.showPlayCardBacks()
                }
            },
            shouldShowFaPaiAnimation: function() {
                return i.isPlayedCards(this._userInfo)
            },
            setUserOnlineStatus: function(e) {
                var t = arguments.length <= 1 || void 0 === arguments[1] ? 1 : arguments[1];
                if (e == this.userId) {
                    var n = this.userInfoNode.getComponent("userInfo");
                    n.setOfflineVisible(1 != t)
                }
            },
            showChatText: function(e, t) {
                if (e == this.userId) {
                    var n = this.chatMessageNode.getComponent("ChatMessage");
                    n.setString(t)
                }
            },
            playCard: function(e) {
                this.userId == e && (this.cardsBackLayout.node.active = !1, this.compareCardsNode.active = !1, this.foldCardNode.active = !0)
            },
            readyToCompareCards: function() {
                this.cardsBackLayout.node.active = !1,
                this.compareCardsNode.active = !0,
                this.foldCardNode.active = !1
            },
            playShootAnimation: function(e, t) {
                if (e == this.userId) {
                    var n = this.userInfoNode.getComponent("userInfo");
                    n.playShootAnimation(t)
                }
            },
            playBulletHoleAnimation: function(e) {
                if (e == this.userId) {
                    var t = this.userInfoNode.getComponent("userInfo");
                    t.playBulletHoleAnimation()
                }
            },
            playHomeRunAimation: function(e) {
                if (e == this.userId) {
                    var t = this.userInfoNode.getComponent("userInfo");
                    t.playHomeRunAimation()
                }
            },
            playSpeakAnimation: function(e) {
                if (e == this.userId) {
                    var t = this.userInfoNode.getComponent("userInfo");
                    t.playSpeakAnimation()
                }
            },
            nextCompareScore: function() {
                if (!this.node.active) return 0;
                var e = this.compareCardsNode.getComponent("CompareCards").nextCompareScore();
                return e
            },
            showNextCompareCards: function() {
                this.nextCompareScore() <= 0 || this.compareCardsNode.getComponent("CompareCards").showNextCards()
            }
        }),
        cc._RFpop()
    },
    {
        ArrayExtension: "ArrayExtension",
        KQGlobalEvent: "KQGlobalEvent",
        UserModelHelper: "UserModelHelper",
        socket: "socket"
    }],
    ResultItem: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "9b2behcoUlLYL1MIMs+04wI", "ResultItem");
        var i = e("KQCardResHelper"),
        o = e("SpriteHelper"),
        a = e("KQCard");
        cc.Class({
            "extends": cc.Component,
            properties: {
                avatarSprite: cc.Sprite,
                labelNickname: cc.Label,
                labelResultNumber: cc.Label,
                layoutTouDao: cc.Layout,
                layoutZhongDao: cc.Layout,
                layoutWeiDao: cc.Layout,
                layoutTeShu: cc.Layout,
                labelTeShuPaiTitle: cc.Label,
                scoreUnitNode: cc.Node,
                diamondUnitNode: cc.Node
            },
            onLoad: function() {},
            updateWithPlayerInfo: function(e) {
                var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
                o.setImageUrl(this.avatarSprite, e.avatarUrl),
                this.labelNickname.string = e.nickname,
                this.labelResultNumber.string = e.cScore,
                this.scoreUnitNode.active = !t,
                this.diamondUnitNode.active = t,
                t && (this.labelResultNumber.string = e.diamond)
            },
            setCards: function(e) {
                cc.assert(13 == e.length);
                var t = e.slice(0, 3),
                n = e.slice(3, 8),
                i = e.slice(8);
                this.setTouCards(t),
                this.setZhongCards(n),
                this.setWeiCards(i)
            },
            setTouCards: function(e) {
                this._setCardsToLayout(this.layoutTouDao, e)
            },
            setZhongCards: function(e) {
                this._setCardsToLayout(this.layoutZhongDao, e)
            },
            setWeiCards: function(e) {
                this._setCardsToLayout(this.layoutWeiDao, e)
            },
            setTeShuCards: function(e) {
                this.layoutTeShu.node.active = !0,
                this.layoutTouDao.node.active = !1,
                this.layoutZhongDao.node.active = !1,
                this.layoutWeiDao.node.active = !1,
                this._setCardsToLayout(this.layoutTeShu, e);
                var t = a.cardsTypeName(e);
                this.labelTeShuPaiTitle.string = t
            },
            _setCardsToLayout: function(e, t) {
                var n = e.node;
                n.children.forEach(function(e, n) {
                    var o = e.getComponent("cc.Sprite"),
                    a = t[n];
                    a && i.setCardSpriteFrame(o, a.cardName())
                })
            }
        }),
        cc._RFpop()
    },
    {
        KQCard: "KQCard",
        KQCardResHelper: "KQCardResHelper",
        SpriteHelper: "SpriteHelper"
    }],
    Setting: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "f3ad6mNk4BMBZzipGQDNlr4", "Setting");
        var i = e("manager");
        cc.Class({
            "extends": cc.Component,
            properties: {
                musicSlider: cc.Node,
                effectSlider: cc.Node,
                btnSwitchAccount: cc.Button,
                _audioManager: null
            },
            onLoad: function() {
                this._audioManager = cc.find("AudioManager") || {},
                this._audioManager = this._audioManager.getComponent("AudioManager"),
                this._initSliders()
            },
            _initSliders: function() {
                this._initSliderEvents();
                var e = i.getMusicValue(),
                t = i.getMusicEffectValue();
                this._audioManager.setBgMusicVolumn(e),
                this._audioManager.setEffectMusicVolum(t),
                this.musicSlider.getComponent("slider").setValue(e),
                this.effectSlider.getComponent("slider").setValue(t)
            },
            _initSliderEvents: function() {
                var e = this;
                this.musicSlider.getComponent("slider").onValueChange = function(t) {
                    i.setMusicValue(t),
                    e._audioManager.setBgMusicVolumn(t)
                },
                this.effectSlider.getComponent("slider").onValueChange = function(t) {
                    i.setMusicEffectValue(t),
                    e._audioManager.setEffectMusicVolum(t)
                }
            },
            clickSwitch: function() {},
            hideSwitch: function() {
                this.btnSwitchAccount && (this.btnSwitchAccount.node.active = !1)
            }
        }),
        cc._RFpop()
    },
    {
        manager: "manager"
    }],
    SpriteHelper: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "936f2uPA8NAuqUZv0R8ZxgP", "SpriteHelper");
        var i = {
            setImageUrl: function(e, t) {
                t.endsWith("png") || t.endsWith("jpg") || t.endsWith("gif") || (t += ".png"),
                cc.loader.load(t,
                function(t, n) {
                    if (!t) {
                        var i = new cc.SpriteFrame(n);
                        e.spriteFrame = i
                    }
                })
            }
        };
        t.exports = i,
        cc._RFpop()
    },
    {}],
    StringExtension: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "7b106eQ/I5F1J85hMxFBIlw", "StringExtension"),
        String.prototype.startsWith || !
        function() {
            var e = function() {
                try {
                    var e = {},
                    t = Object.defineProperty,
                    n = t(e, e, e) && t
                } catch(i) {}
                return n
            } (),
            t = {}.toString,
            n = function(e) {
                if (null == this) throw TypeError();
                var n = String(this);
                if (e && "[object RegExp]" == t.call(e)) throw TypeError();
                var i = n.length,
                o = String(e),
                a = o.length,
                s = arguments.length > 1 ? arguments[1] : void 0,
                r = s ? Number(s) : 0;
                r != r && (r = 0);
                var c = Math.min(Math.max(r, 0), i);
                if (a + c > i) return ! 1;
                for (var d = -1; ++d < a;) if (n.charCodeAt(c + d) != o.charCodeAt(d)) return ! 1;
                return ! 0
            };
            e ? e(String.prototype, "startsWith", {
                value: n,
                configurable: !0,
                writable: !0
            }) : String.prototype.startsWith = n
        } (),
        String.prototype.endsWith || !
        function() {
            var e = function() {
                try {
                    var e = {},
                    t = Object.defineProperty,
                    n = t(e, e, e) && t
                } catch(i) {}
                return n
            } (),
            t = {}.toString,
            n = function(e) {
                if (null == this) throw TypeError();
                var n = String(this);
                if (e && "[object RegExp]" == t.call(e)) throw TypeError();
                var i = n.length,
                o = String(e),
                a = o.length,
                s = i;
                if (arguments.length > 1) {
                    var r = arguments[1];
                    void 0 !== r && (s = r ? Number(r) : 0, s != s && (s = 0))
                }
                var c = Math.min(Math.max(s, 0), i),
                d = c - a;
                if (d < 0) return ! 1;
                for (var u = -1; ++u < a;) if (n.charCodeAt(d + u) != o.charCodeAt(u)) return ! 1;
                return ! 0
            };
            e ? e(String.prototype, "endsWith", {
                value: n,
                configurable: !0,
                writable: !0
            }) : String.prototype.endsWith = n
        } (),
        cc._RFpop()
    },
    {}],
    TotalGameResultItem: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "e1c6f93a1BOnoSiX6kJ0Efn", "TotalGameResultItem");
        var i = e("SpriteHelper");
        cc.Class({
            "extends": cc.Component,
            properties: {
                avatarSprite: cc.Sprite,
                labelUserId: cc.Label,
                labelScore: cc.Label,
                labelNickname: cc.Label,
                _deskInfo: null
            },
            onLoad: function() {},
            setUserInfo: function(e, t) {
                if (e) {
                    var n = e.totalScore;
                    if (t && (0 == t.setting1 || 1 == t.setting1)) {
                        var o = 0 == t.setting1 ? 100 : 200;
                        n -= o
                    }
                    i.setImageUrl(this.avatarSprite, e.avatarUrl),
                    this.labelUserId.string = "" + e.id,
                    this.labelScore.string = n > 0 ? "+ " + n: "- " + n * -1,
                    0 == n && (this.labelScore.string = "0"),
                    this.labelNickname.string = e.nickname
                }
            }
        }),
        cc._RFpop()
    },
    {
        SpriteHelper: "SpriteHelper"
    }],
    TotalGameResult: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "f7fb2e7foJFNJzjdtbAtk7O", "TotalGameResult");
        var i = e("KQNativeInvoke");
        cc.Class({
            "extends": cc.Component,
            properties: {
                itemLayout: cc.Layout,
                itemPrefab: cc.Prefab,
                selectShareView: cc.Node
            },
            onLoad: function() {},
            setPlayerInfos: function(e, t) {
                e.forEach(function(e) {
                    var n = cc.instantiate(this.itemPrefab);
                    n.getComponent("TotalGameResultItem").setUserInfo(e, t),
                    this.itemLayout.node.addChild(n)
                }.bind(this))
            },
            clickShareWeiChat: function() {
                if (i.isNativeIOS()) jsb.reflection.callStaticMethod(i.IOSClassName, "wxScreenShareFriend");
                else if (i.isNativeAndroid()) {
                    var e = this.selectShareView.getComponent("alert");
                    this.shareViewIsShow ? (e.dismissAction(), this.shareViewIsShow = !1) : (e.alert(), this.shareViewIsShow = !0)
                }
            },
            onSelectShare: function(e) {
                var t = this,
                n = e.target.name,
                o = this.selectShareView.getComponent("alert");
                o.dismissAction(),
                this.shareViewIsShow = !1;
                var a = !0;
                "to_timeline" == n && (a = !1),
                setTimeout(function() {
                    i.isNativeIOS() || t.screenshots(a)
                },
                1e3)
            },
            screenshots: function(e) {
                var t = cc.director.getWinSize(),
                n = cc.RenderTexture.create(t.width, t.height, cc.Texture2D.PIXEL_FORMAT_RGBA4444, gl.DEPTH24_STENCIL8_OES);
                n.begin(),
                cc.find("Canvas")._sgNode.visit(),
                n.end(),
                n.saveToFile("1.png", cc.IMAGE_FORMAT_PNG, !0,
                function() {
                    var t = jsb.fileUtils.getWritablePath() + "/1.png";
                    e ? jsb.reflection.callStaticMethod(i.ANDRIODClassName, "shareRecordToSession", "(Ljava/lang/String;)V", t) : jsb.reflection.callStaticMethod(i.ANDRIODClassName, "shareRecordToTimeLine", "(Ljava/lang/String;)V", t)
                })
            },
            clickSharePengYouQuan: function() {
                i.isNativeIOS() ? jsb.reflection.callStaticMethod(i.IOSClassName, "wxScreenShare") : jsb.reflection.callStaticMethod(i.ANDRIODClassName, "wxScreenShare", "()V")
            }
        }),
        cc._RFpop()
    },
    {
        KQNativeInvoke: "KQNativeInvoke"
    }],
    UserModelHelper: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "98854aScapF5oQnHKxJsvmF", "UserModelHelper");
        var i = {
            isPlayedCards: function(e) {
                return cc.assert(e),
                !!(e && e.cardInfo && e.cardInfo.length > 0)
            },
            isUserReady: function(e) {
                return 1 == e.readyStatus
            }
        };
        t.exports = i,
        cc._RFpop()
    },
    {}],
    UserSampleInfo: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "3a9f7A0IgRGPrAZvy1p9s4i", "UserSampleInfo");
        var i = e("SpriteHelper");
        cc.Class({
            "extends": cc.Component,
            properties: {
                labelUserId: cc.Label,
                labelUserIP: cc.Label,
                labelNickname: cc.Label,
                avatarSprite: cc.Sprite,
                manSprite: cc.Sprite,
                womenSprite: cc.Sprite,
                _didShowUserInfo: null
            },
            onLoad: function() {},
            updateWithUser: function(e) {
                if (e) {
                    if (this._didShowUserInfo == e) return this.unscheduleAllCallbacks(),
                    void this._disappearUserInfo();
                    this._didShowUserInfo = e,
                    this.node.active || this.node.getComponent("alert").alert(),
                    this.unscheduleAllCallbacks(),
                    this.scheduleOnce(function() {
                        this._disappearUserInfo()
                    }.bind(this), 5),
                    this.labelUserId.string = "UID:\n" + e.id,
                    this.labelUserIP.string = "用户IP:\n" + e.ipAddress.replace("::ffff:", ""),
                    this.labelNickname.string = e.nickname,
                    this.avatarSprite.spriteFrame = null,
                    i.setImageUrl(this.avatarSprite, e.avatarUrl);
                    var t = e.sex;
                    this.manSprite.node.active = 1 == t,
                    this.womenSprite.node.active = 1 != t
                }
            },
            _disappearUserInfo: function() {
                this.node.active = !1,
                this._didShowUserInfo = null
            }
        }),
        cc._RFpop()
    },
    {
        SpriteHelper: "SpriteHelper"
    }],
    alert: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "16cd2qs73lByZaHhJkQAEee", "alert"),
        cc.Class({
            "extends": cc.Component,
            properties: {
                popNode: cc.Node,
                label: cc.Label,
                _alertCallback: null,
                _willDismissCallback: null,
                _dismissCallback: null,
                _confirmCallback: null,
                _tishi: null,
                _card_num: null
            },
            onLoad: function() {},
            alert: function() {
                this.node.active = !0;
                var e = this.popNode.getComponent(cc.Animation);
                e.play("pop"),
                this._alertCallback && this._alertCallback(this.node)
            },
            dismissAction: function() {
                var e = this._willDismissCallback;
                if (e) {
                    var t = e();
                    if (t) return void this.dismissComplete()
                }
                var n = this.popNode.getComponent(cc.Animation),
                i = n.getAnimationState("pop_dismiss");
                i.on("finished", this.dismissComplete, this),
                n.play("pop_dismiss")
            },
            dismissComplete: function() {
                this.node.active = !1,
                this.onDismissComplete && this.onDismissComplete(),
                this._dismissCallback && this._dismissCallback(this.node)
            },
            dismissPlay: function() {
                cc.director.loadScene("hall")
            },
            onDismissComplete: function() {
                cc.log("onDismissComplete")
            },
            doneAction: function() {
                this.dismissAction(),
                this.onDoneAction();
                var e = this._confirmCallback;
                e && e(this.node)
            },
            onDoneAction: function() {},
            setMessage: function(e) {
                this.label.string = e
            },
            getMessage: function() {
                return this.label.string
            },
            setAlertCallbck: function(e) {
                this._alertCallback = e
            },
            setWillDismissCallback: function(e) {
                this._willDismissCallback = e
            },
            setDismissCallback: function(e) {
                this._dismissCallback = e
            },
            setConfirmCallback: function(e) {
                this._confirmCallback = e
            }
        }),
        cc._RFpop()
    },
    {}],
    cardsBack: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "98986IsXIdHiqLGEVIG2CWP", "cardsBack"),
        cc.Class({
            "extends": cc.Component,
            properties: {
                cardsBackLayout: cc.Layout,
                cardsBackList: [cc.Sprite]
            },
            onLoad: function() {},
            showPlayCardBacks: function() {
                cc.log("显示牌背影"),
                this.hideCardBacks(),
                this.cardsBackLayout.node.active = !0;
                var e = .05,
                t = 0;
                this.cardsBackList.forEach(function(n) {
                    this.scheduleOnce(function() {
                        n.node.active = !0
                    },
                    t),
                    t += e
                }.bind(this))
            },
            hideCardBacks: function() {
                this.cardsBackLayout.node.active = !1,
                this.cardsBackList.forEach(function(e) {
                    e.node.active = !1
                })
            }
        }),
        cc._RFpop()
    },
    {}],
    cards: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "0fcbct/TBxC742saKLuFviQ", "cards"),
        cc.Class({
            "extends": cc.Component,
            properties: {
                spadesImages: [cc.SpriteFrame],
                heartsImages: [cc.SpriteFrame],
                clubImages: [cc.SpriteFrame],
                diamondImages: [cc.SpriteFrame]
            },
            onLoad: function() {}
        }),
        cc._RFpop()
    },
    {}],
    cellText: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "9c9fd3OxWNEp4rijfjJv05t", "cellText"),
        cc.Class({
            "extends": cc.Component,
            properties: {
                labelMsg: cc.Label
            },
            onLoad: function() {},
            setText: function(e) {
                this.labelMsg.getComponent(cc.Label).string = e
            },
            clickAction: function() {
                var e = this.labelMsg.getComponent(cc.Label).string;
                this.onSelectAction(e)
            },
            onSelectAction: function(e) {}
        }),
        cc._RFpop()
    },
    {}],
    choujiang: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "f64e0whLhNLmbOHtPpK94CG", "choujiang");
        e("socket");
        cc.Class({
            "extends": cc.Component,
            properties: {
                option: {
                    "default": [],
                    type: cc.Node
                }
            },
            onLoad: function() {},
            clickBtnchoujiang: function() {
                var e = 0;
                this._tishi = this.node.getChildByName("choujiang_bg").getChildByName("tishi"),
                this._card_num = cc.find("Canvas/user/shop_bg/card_num");
                var t = this._card_num.getComponent(cc.Label);
                t.string < 20 ? this._tishi.active = !0 : this.schedule(function() {
                    0 == e ? (this.option[e].opacity = 128, this.option[this.option.length - 1].opacity = 255) : 1 == e ? (this.option[e].opacity = 128, this.option[e - 1].opacity = 255) : (this.option[e].opacity = 128, this.option[e - 1].opacity = 255),
                    e++,
                    e == this.option.length && (e = 0)
                },
                .1)
            },
            clickBtnComfirm: function() {
                this._tishi.active = !1
            }
        }),
        cc._RFpop()
    },
    {
        socket: "socket"
    }],
    fecha: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "e517077l0xMarB9uQsXGzvk", "fecha"),
        function(e) {
            function n(e, t) {
                for (var n = [], i = 0, o = e.length; i < o; i++) n.push(e[i].substr(0, t));
                return n
            }
            function i(e) {
                return function(t, n, i) {
                    var o = i[e].indexOf(n.charAt(0).toUpperCase() + n.substr(1).toLowerCase());~o && (t.month = o)
                }
            }
            function o(e, t) {
                for (e = String(e), t = t || 2; e.length < t;) e = "0" + e;
                return e
            }
            var a = {},
            s = /d{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|ZZ|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g,
            r = /\d\d?/,
            c = /\d{3}/,
            d = /\d{4}/,
            u = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,
            l = /\[([^]*?)\]/gm,
            h = function() {},
            f = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            p = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            v = n(p, 3),
            _ = n(f, 3);
            a.i18n = {
                dayNamesShort: _,
                dayNames: f,
                monthNamesShort: v,
                monthNames: p,
                amPm: ["am", "pm"],
                DoFn: function(e) {
                    return e + ["th", "st", "nd", "rd"][e % 10 > 3 ? 0 : (e - e % 10 !== 10) * e % 10]
                }
            };
            var g = {
                D: function(e) {
                    return e.getDate()
                },
                DD: function(e) {
                    return o(e.getDate())
                },
                Do: function(e, t) {
                    return t.DoFn(e.getDate())
                },
                d: function(e) {
                    return e.getDay()
                },
                dd: function(e) {
                    return o(e.getDay())
                },
                ddd: function(e, t) {
                    return t.dayNamesShort[e.getDay()]
                },
                dddd: function(e, t) {
                    return t.dayNames[e.getDay()]
                },
                M: function(e) {
                    return e.getMonth() + 1
                },
                MM: function(e) {
                    return o(e.getMonth() + 1)
                },
                MMM: function(e, t) {
                    return t.monthNamesShort[e.getMonth()]
                },
                MMMM: function(e, t) {
                    return t.monthNames[e.getMonth()]
                },
                YY: function(e) {
                    return String(e.getFullYear()).substr(2)
                },
                YYYY: function(e) {
                    return e.getFullYear()
                },
                h: function(e) {
                    return e.getHours() % 12 || 12
                },
                hh: function(e) {
                    return o(e.getHours() % 12 || 12)
                },
                H: function(e) {
                    return e.getHours()
                },
                HH: function(e) {
                    return o(e.getHours())
                },
                m: function(e) {
                    return e.getMinutes()
                },
                mm: function(e) {
                    return o(e.getMinutes())
                },
                s: function(e) {
                    return e.getSeconds()
                },
                ss: function(e) {
                    return o(e.getSeconds())
                },
                S: function(e) {
                    return Math.round(e.getMilliseconds() / 100)
                },
                SS: function(e) {
                    return o(Math.round(e.getMilliseconds() / 10), 2)
                },
                SSS: function(e) {
                    return o(e.getMilliseconds(), 3)
                },
                a: function(e, t) {
                    return e.getHours() < 12 ? t.amPm[0] : t.amPm[1]
                },
                A: function(e, t) {
                    return e.getHours() < 12 ? t.amPm[0].toUpperCase() : t.amPm[1].toUpperCase()
                },
                ZZ: function(e) {
                    var t = e.getTimezoneOffset();
                    return (t > 0 ? "-": "+") + o(100 * Math.floor(Math.abs(t) / 60) + Math.abs(t) % 60, 4)
                }
            },
            m = {
                D: [r,
                function(e, t) {
                    e.day = t
                }],
                Do: [new RegExp(r.source + u.source),
                function(e, t) {
                    e.day = parseInt(t, 10)
                }],
                M: [r,
                function(e, t) {
                    e.month = t - 1
                }],
                YY: [r,
                function(e, t) {
                    var n = new Date,
                    i = +("" + n.getFullYear()).substr(0, 2);
                    e.year = "" + (t > 68 ? i - 1 : i) + t
                }],
                h: [r,
                function(e, t) {
                    e.hour = t
                }],
                m: [r,
                function(e, t) {
                    e.minute = t
                }],
                s: [r,
                function(e, t) {
                    e.second = t
                }],
                YYYY: [d,
                function(e, t) {
                    e.year = t
                }],
                S: [/\d/,
                function(e, t) {
                    e.millisecond = 100 * t
                }],
                SS: [/\d{2}/,
                function(e, t) {
                    e.millisecond = 10 * t
                }],
                SSS: [c,
                function(e, t) {
                    e.millisecond = t
                }],
                d: [r, h],
                ddd: [u, h],
                MMM: [u, i("monthNamesShort")],
                MMMM: [u, i("monthNames")],
                a: [u,
                function(e, t, n) {
                    var i = t.toLowerCase();
                    i === n.amPm[0] ? e.isPm = !1 : i === n.amPm[1] && (e.isPm = !0)
                }],
                ZZ: [/([\+\-]\d\d:?\d\d|Z)/,
                function(e, t) {
                    "Z" === t && (t = "+00:00");
                    var n, i = (t + "").match(/([\+\-]|\d\d)/gi);
                    i && (n = +(60 * i[1]) + parseInt(i[2], 10), e.timezoneOffset = "+" === i[0] ? n: -n)
                }]
            };
            m.dd = m.d,
            m.dddd = m.ddd,
            m.DD = m.D,
            m.mm = m.m,
            m.hh = m.H = m.HH = m.h,
            m.MM = m.M,
            m.ss = m.s,
            m.A = m.a,
            a.masks = {
                "default": "ddd MMM DD YYYY HH:mm:ss",
                shortDate: "M/D/YY",
                mediumDate: "MMM D, YYYY",
                longDate: "MMMM D, YYYY",
                fullDate: "dddd, MMMM D, YYYY",
                shortTime: "HH:mm",
                mediumTime: "HH:mm:ss",
                longTime: "HH:mm:ss.SSS"
            },
            a.format = function(e, t, n) {
                var i = n || a.i18n;
                if ("number" == typeof e && (e = new Date(e)), "[object Date]" !== Object.prototype.toString.call(e) || isNaN(e.getTime())) throw new Error("Invalid Date in fecha.format");
                t = a.masks[t] || t || a.masks["default"];
                var o = [];
                return t = t.replace(l,
                function(e, t) {
                    return o.push(t),
                    "??"
                }),
                t = t.replace(s,
                function(t) {
                    return t in g ? g[t](e, i) : t.slice(1, t.length - 1)
                }),
                t.replace(/\?\?/g,
                function() {
                    return o.shift()
                })
            },
            a.parse = function(e, t, n) {
                var i = n || a.i18n;
                if ("string" != typeof t) throw new Error("Invalid format in fecha.parse");
                if (t = a.masks[t] || t, e.length > 1e3) return ! 1;
                var o = !0,
                r = {};
                if (t.replace(s,
                function(t) {
                    if (m[t]) {
                        var n = m[t],
                        a = e.search(n[0]);~a ? e.replace(n[0],
                        function(t) {
                            return n[1](r, t, i),
                            e = e.substr(a + t.length),
                            t
                        }) : o = !1
                    }
                    return m[t] ? "": t.slice(1, t.length - 1)
                }), !o) return ! 1;
                var c = new Date;
                r.isPm === !0 && null != r.hour && 12 !== +r.hour ? r.hour = +r.hour + 12 : r.isPm === !1 && 12 === +r.hour && (r.hour = 0);
                var d;
                return null != r.timezoneOffset ? (r.minute = +(r.minute || 0) - +r.timezoneOffset, d = new Date(Date.UTC(r.year || c.getFullYear(), r.month || 0, r.day || 1, r.hour || 0, r.minute || 0, r.second || 0, r.millisecond || 0))) : d = new Date(r.year || c.getFullYear(), r.month || 0, r.day || 1, r.hour || 0, r.minute || 0, r.second || 0, r.millisecond || 0),
                d
            },
            "undefined" != typeof t && t.exports ? t.exports = a: "function" == typeof define && define.amd ? define(function() {
                return a
            }) : e.fecha = a
        } (void 0),
        cc._RFpop()
    },
    {}],
    game: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "45811N61jFFA6UrygQla5+x", "game"),
        cc.Class({
            "extends": cc.Component,
            properties: {
                messageNode: cc.Node,
                playNode: cc.Node
            },
            onLoad: function() {},
            showMessageAlert: function() {
                this.messageNode.active = !0;
                var e = this.messageNode.getComponent(cc.Animation);
                e.play("pop")
            },
            dismissMessageAlert: function() {
                var e = this;
                this.scheduleOnce(function() {
                    e.messageNode.active = !1
                },
                .3)
            }
        }),
        cc._RFpop()
    },
    {}],
    hall: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "1e6741Q2VFGDLupV88mg60Z", "hall");
        var i = e("manager"),
        o = e("socket"),
        a = e("KQGlobalEvent"),
        s = e("AudioManager"),
        r = e("KQNativeInvoke"),
        c = e("Playback"),
        d = cc.Class({
            "extends": cc.Component,
            properties: {
                productNodes: [cc.Node],
                shopAlertNode: cc.Node,
                createNode: cc.Node,
                joinNode: cc.Node,
                alertPrefab: cc.Prefab,
                tsSingleSelect: [cc.Node],
                labelNotice: cc.Label,
                labelBanner: cc.Label,
                invitationCode: cc.Node,
                hasCode: cc.Node,
                shareAlertNode: cc.Node,
                recordNode: cc.Node,
                waitingPrefab: cc.Prefab,
                avatarNode: cc.Node,
                nickNameLabel: cc.Label,
                cardNumberLabel: cc.Label,
                userIdLabel: cc.Label,
                codeLabel: cc.Label,
                titleLabel: cc.Label,
                weChatLabel: cc.Label,
                qqLabel: cc.Label,
                phoneLabel: cc.Label,
                exitNode: cc.Node,
                logoutNode: cc.Node,
                recordMsgNode: cc.Node,
                feedbackEditBox: cc.EditBox,
                feedbackNode: cc.Node,
                _userId: 0,
                _openId: null,
                _help: null,
                _close: null
            },
            statics: {
                lastHallInfo: null,
                cacheImageInfo: null
            },
            onLoad: function() {
                this._btn = this.node.getChildByName("btn"),
                this._buttons = this.node.getChildByName("buttons"),
                s.instance.playMusic(),
                c.instance.removePlaybackDatas(),
                d.cacheImageInfo = d.cacheImageInfo || {},
                this._registerSocketEvent(),
                this._startBannerAnimation(),
                this._initJoinRoom(),
                this._sureInviteCode(),
                this.keyBackListen(),
                this._userId = o.instance.userInfo.id,
                this._inviteCode = o.instance.userInfo.inviteCode,
                this._openId = o.instance.userInfo.openId;
                var e = this;
                this._inviteCode ? (this.codeLabel.string = "CODE：" + this._inviteCode, this.hasCode.active = !0, this.invitationCode.active = !1) : (this.hasCode.active = !1, this.invitationCode.active = !0, this.codeLabel.string = "");
                for (var t = 0; t < this.productNodes.length; t++) {
                    var n = this.productNodes[t].getComponent("product");
                    n.onClickAction = function(e) {
                        cc.log(e)
                    }
                }
                this.socket = cc.find("GameSocket").getComponent("socket"),
                this.socket.receviceMessage = function(e) {
                    var t = JSON.parse(e);
                    r.log("收到消息", JSON.stringify(t))
                },
                this.socket.connectionSuccess = function() {
                    e.hiddenNetworkMessage(),
                    e.hiddenCheckMessage()
                },
                this.socket.connectionDisconnect = function() {
                    e.showNetworkMessage("网络链接断开，重新连接中...")
                },
                this.socket.checkNetworkNow = function() {
                    e.showCheckMessage("检查网络中...")
                },
                this.socket.checkNetworkEnd = function() {
                    e.hiddenCheckMessage(),
                    e.hiddenNetworkMessage()
                },
                this.updateUserInfo(),
                o.sendGetUserInfo(this._userId, this._openId),
                this.schedule(function() {
                    o.sendGetUserInfo(this._userId, this._openId)
                }.bind(this), 10),
                o.sendGetHallInfo(this._userId),
                d.lastHallInfo && (this.updateBanner(d.lastHallInfo.info), this.updateNotice(d.lastHallInfo.broadcast))
            },
            onDestroy: function() {
                this.socket.receviceMessage = function() {},
                this.socket.connectionSuccess = function() {},
                this.socket.connectionDisconnect = function() {},
                this.socket.checkNetworkNow = function() {},
                this.socket.checkNetworkEnd = function() {},
                a.offTarget(this)
            },
            _registerSocketEvent: function() {
                a.on(o.Event.JoinDesk, this._jiinRoomSocketCallback, this),
                a.on(o.Event.ReceiveDeskInfo, this._jiinRoomSocketCallback, this),
                a.on(o.Event.ReceiveCreateDesk, this._createRoomSocketCallback, this),
                a.on(o.Event.ReceiveHallInfo, this._socketReceiveHallInfo, this),
                a.on(o.Event.ReceiveGetUserInfo, this._socketReceiveUserInfo, this),
                a.on(o.Event.ReceiveInviteCode, this._socketReceiveInviteCode, this),
                a.on(o.Event.ReceiveAgentInfo, this._socketAgentInfo, this),
                a.on(o.Event.SocketDisconnect, this._socketDisconnect, this),
                a.on(o.Event.SocketConnectSuccessed, this._socketConnected, this)
            },
            _startBannerAnimation: function() {
                var e = this.labelBanner.getComponent(cc.Animation);
                e.play("banner")
            },
            _initJoinRoom: function() {
                var e = this,
                t = this.joinNode.getComponent("joinRoom");
                this.joinNode.getComponent("alert").setAlertCallbck(function() {
                    t.clickClear()
                }),
                t.callbackJoinRoom = function(t) {
                    e.joinNode.getComponent("alert").dismissAction(),
                    e.showWaitingMessage("加入中..."),
                    e.scheduleOnce(function() {
                        e.hiddenWaitingMessage()
                    },
                    2);
                    var n = o.instance.userInfo.id;
                    o.sendJoinDesk(t, n)
                }
            },
            _sureInviteCode: function() {
                var e = this,
                t = this.invitationCode.getComponent("inviteCode");
                t.getComponent("alert").setAlertCallbck(function() {
                    t.clickClear()
                }),
                t.callbackInviteCode = function(t) {
                    e.invitationCode.getComponent("alert").dismissAction(),
                    e.scheduleOnce(function() {
                        e.hiddenWaitingMessage()
                    },
                    2);
                    var n = o.instance.userInfo.id;
                    o.sendInviteCode(t, n)
                }
            },
            _jiinRoomSocketCallback: function(e) {
                if (this.hiddenWaitingMessage(), e.result) cc.director.loadScene("play");
                else {
                    var t = this._joinReasonMap(e.data.reason);
                    this.alertMessage(t)
                }
            },
            _socketReceiveHallInfo: function(e) {
                if (e.result) {
                    var t = e.data;
                    d.lastHallInfo = t;
                    var n = t.broadcast,
                    i = t.info;
                    this.updateNotice(n),
                    this.updateBanner(i)
                }
            },
            _createRoomSocketCallback: function(e) {
                this.hiddenWaitingMessage(),
                cc.log(e.data.reason),
                e.result ? cc.director.loadScene("play") : "noEnoughCardNum" == e.data.reason ? this.alertMessage("房间创建失败，您房卡不足") : this.alertMessage("房间创建失败")
            },
            _joinReasonMap: function(e) {
                var t = {
                    notExist: "房间不存在!",
                    cardNumber: "您房卡不足!"
                },
                n = t[e] || "房间已满!";
                return n
            },
            shopAction: function() {
                var e = this.shopAlertNode.getComponent("alert");
                e.alert(),
                cc.log(this._inviteCode, "----------------------邀请码----------------------"),
                o.sendGetAgent(o.instance.userInfo.id, o.instance.userInfo.inviteCode)
            },
            alertMessage: function(e) {
                var t = cc.instantiate(this.alertPrefab);
                this.node.addChild(t);
                var n = t.getComponent("alert");
                n.setMessage(e),
                n.alert()
            },
            updateNotice: function(e) {
                this.labelNotice.string = e || ""
            },
            updateBanner: function() {
                var e = arguments.length <= 0 || void 0 === arguments[0] ? "": arguments[0];
                this.labelBanner.string = e
            },
            createDoneAction: function() {
                for (var e = {},
                t = ["setting1", "setting2", "setting3", "setting4"], n = 0; n < this.tsSingleSelect.length; n++) {
                    var i = this.tsSingleSelect[n].getComponent("singleSelect").selectedIndex;
                    e[t[n]] = i
                }
                e.userId = this.socket.userInfo.id,
                this.socket.sendMessage("createDesk", e),
                this.createNode.getComponent("alert").dismissAction();
                var o = this;
                this.showWaitingMessage("创建中..."),
                this.scheduleOnce(function() {
                    o.hiddenWaitingMessage()
                },
                2)
            },
            clickRandRoom: function() {
                cc.director.loadScene("randRoom")
            },
            clickShare: function() {
                this.shareAlertNode.getComponent("alert").alert()
            },
            clickRecord: function() {
                var e = this.recordNode.getComponent("alert");
                e.alert(),
                o.sendGetRecrod(o.instance.userInfo.id)
            },
            clickPlayRule: function() {
                this.help = this.node.getChildByName("help");
                var e = this.help.getComponent("alert");
                e.alert()
            },
            shareToFriend: function() {
                r.isNativeIOS() ? jsb.reflection.callStaticMethod(r.IOSClassName, "wxShareHallFriend") : jsb.reflection.callStaticMethod(r.ANDRIODClassName, "wxShareHallFriend", "(Ljava/lang/String;)V", cc.shareUrl)
            },
            shareToTimeline: function() {
                this.shareAlertNode.getComponent("alert").dismissAction(),
                r.isNativeIOS() ? jsb.reflection.callStaticMethod(r.IOSClassName, "wxShareHallTimeline") : jsb.reflection.callStaticMethod(r.ANDRIODClassName, "wxShareHallTimeline", "(Ljava/lang/String;)V", cc.shareUrl)
            },
            clickExit: function() {
                var e = this.exitNode.getComponent("alert");
                e.alert()
            },
            clickCancelLation: function() {
                this.logoutNode.getComponent("alert").alert()
            },
            logoutAction: function() {
                i.setUserInfo(""),
                cc.director.loadScene("login"),
                d.cacheImageInfo = null
            },
            exitAction: function() {
                return cc.sys.isNative ? void cc.director.end() : (cc.director.loadScene("login"), void(d.cacheImageInfo = null))
            },
            _socketReceiveUserInfo: function(e) {
                if (!this.socket.userInfo) return void cc.error("this.socket.userInfo 为空!!!");
                this.nickNameLabel.string = e.data.nickname,
                this.userIdLabel.string = "ID: " + e.data.id,
                this.cardNumberLabel.string = e.data.cardNumber;
                var t = e.data.inviteCode;
                t ? (this.codeLabel.string = "CODE：" + t, this.hasCode.active = !0, this.invitationCode.active = !1) : (this.hasCode.active = !1, this.invitationCode.active = !0, this.codeLabel.string = "");
                var n = this.avatarNode.getComponent(cc.Sprite);
                cc.loader.load(e.data.avatarUrl + ".jpg",
                function(e, t) {
                    if (!e) {
                        var i = new cc.SpriteFrame(t);
                        n.spriteFrame = i
                    }
                })
            },
            _socketReceiveInviteCode: function(e) {
                var t = e.data;
                t ? (this._inviteCode = t, this.codeLabel.string = "CODE：" + t, this.hasCode.active = !0, this.invitationCode.active = !1) : (this.alertMessage("输入的邀请码不存在"), this.hasCode.active = !1, this.invitationCode.active = !0, this.codeLabel.string = "")
            },
            _socketAgentInfo: function(e) {
                var t = e.data;
                if (t) {
                    var n = t.qq,
                    i = t.wechat,
                    a = t.phone;
                    o.i;
                    n || i || a ? (this.titleLabel.string = "请联系您的代理", i && (this.weChatLabel.string = "微信：" + i), n && (this.qqLabel.string = "qq:" + n), a && (this.phoneLabel.string = "电话：" + a)) : this.titleLabel.string = "您的代理很懒，什么联系方式都没留下"
                } else this.titleLabel.string = "您还没有代理，请尽快绑定代理领取房卡",
                this.weChatLabel.string = " ",
                this.qqLabel.string = " ",
                this.phoneLabel.string = " "
            },
            _socketDisconnect: function() {
                this.showNetworkMessage("网络链接断开，重新连接中...")
            },
            _socketConnected: function() {
                this.hiddenNetworkMessage()
            },
            updateUserInfo: function() {
                var e = this.socket.userInfo;
                if (!e) return void cc.error("this.socket.userInfo 为空!!!");
                this.nickNameLabel.string = e.nickname,
                this.userIdLabel.string = "ID: " + e.id,
                this.cardNumberLabel.string = e.cardNumber;
                var t = e.avatarUrl + ".jpg",
                n = this.avatarNode.getComponent(cc.Sprite),
                i = d.cacheImageInfo[t];
                if (i) {
                    var o = new cc.SpriteFrame(i);
                    if (o) return cc.log("从缓存中加载头像"),
                    void(n.spriteFrame = o)
                }
                cc.loader.load(e.avatarUrl + ".jpg",
                function(e, i) {
                    if (!e) {
                        var o = new cc.SpriteFrame(i);
                        n.spriteFrame = o,
                        d.cacheImageInfo[t] = i
                    }
                })
            },
            feedbackAcion: function() {
                var e = this.socket.userInfo.id,
                t = this.feedbackEditBox.string;
                t.length > 0 && (this.feedbackNode.getComponent("alert").dismissAction(), o.sendFeedback(e, t), this.feedbackEditBox.string = "")
            },
            showWaitingMessage: function(e) {
                null != this.waitingNode && cc.sys.isNative && cc.sys.isObjectValid(this.waitingNode) && (this.waitingNode.destory(), this.waitingNode = null),
                this.waitingNode = cc.instantiate(this.waitingPrefab),
                this.node.addChild(this.waitingNode);
                var t = this.waitingNode.getComponent("alert");
                t.setMessage(e),
                t.alert()
            },
            hiddenWaitingMessage: function() {
                null != this.waitingNode && this.waitingNode.getComponent("alert").dismissAction()
            },
            showNetworkMessage: function(e) {
                if (this.networkNode && this.networkNode.active) {
                    var t = this.networkNode.getComponent("alert");
                    if (t.getMessage() == e) return
                }
                if (null != this.networkNode) {
                    var n = cc.removeSelf();
                    this.networkNode.runAction(n),
                    this.networkNode = null
                }
                this.networkNode = cc.instantiate(this.waitingPrefab),
                this.node.addChild(this.networkNode);
                var i = this.networkNode.getComponent("alert"),
                o = this;
                i.onDismissComplete = function() {
                    o.networkNode = null
                },
                i.setMessage(e),
                i.alert()
            },
            hiddenNetworkMessage: function() {
                null != this.networkNode && this.networkNode.getComponent("alert").dismissAction()
            },
            showCheckMessage: function(e) {
                if (this.checkNode && this.checkNode.active) {
                    var t = this.checkNode.getComponent("alert");
                    if (t.getMessage() == e) return
                }
                if (null != this.checkNode) {
                    var n = cc.removeSelf();
                    this.checkNode.runAction(n),
                    this.checkNode = null
                }
                this.checkNode = cc.instantiate(this.waitingPrefab),
                this.node.addChild(this.checkNode);
                var i = this.checkNode.getComponent("alert"),
                o = this;
                i.onDismissComplete = function() {
                    o.checkNode = null
                },
                i.setMessage(e),
                i.alert()
            },
            hiddenCheckMessage: function() {
                null != this.checkNode && this.checkNode.getComponent("alert").dismissAction()
            },
            onBtnClick: function() {
                this._buttons.active ? this._buttons.active = !1 : this._buttons.active = !0
            },
            onBrrowClick: function(e) {
                var t = e.target.name,
                n = cc.find("Canvas/create_or_join_room").getComponent(cc.ScrollView);
                "arrow_right" == t ? n.scrollToRight(.5) : n.scrollToLeft(.5)
            },
            keyBackListen: function() {
                var e = this;
                cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,
                function(t) {
                    t.keyCode == cc.KEY.back && e.clickExit()
                },
                this)
            }
        });
        t.exports = d,
        cc._RFpop()
    },
    {
        AudioManager: "AudioManager",
        KQGlobalEvent: "KQGlobalEvent",
        KQNativeInvoke: "KQNativeInvoke",
        Playback: "Playback",
        manager: "manager",
        socket: "socket"
    }],
    help: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "09981CwNMZOI4DHUg8u9kcj", "help"),
        cc.Class({
            "extends": cc.Component,
            properties: {
                play_method_before: cc.Node,
                play_method_content_label: cc.Node,
                introduce_pai_before: cc.Node,
                details: cc.Node,
                caozuo_before: cc.Node,
                caozuo_content: cc.Node,
                _btn: null,
                _content: null,
                _buttonCom: null,
                _play_method_button: null,
                _introduce_pai_button: null,
                _caozuo_button: null
            },
            onLoad: function() {
                this._play_method_button = this.play_method_before.getComponent(cc.Button),
                this._introduce_pai_button = this.introduce_pai_before.getComponent(cc.Button),
                this._caozuo_button = this.caozuo_before.getComponent(cc.Button),
                this._btn = [this.play_method_before, this.introduce_pai_before, this.caozuo_before],
                this._content = [this.play_method_content_label, this.details, this.caozuo_content],
                this._buttonCom = [this._play_method_button, this._introduce_pai_button, this._caozuo_button],
                this._buttonCom[1].interactable = !1
            },
            onBtnPlayMethodClick: function() {
                for (var e = 0; e < 3; e++) this._buttonCom[e].interactable = !0,
                this._content[e].active = !1;
                this._buttonCom[0].interactable = !1,
                this._content[0].active = !0
            },
            onBtnIntroducePaiClick: function() {
                for (var e = 0; e < 3; e++) this._buttonCom[e].interactable = !0,
                this._content[e].active = !1;
                this._buttonCom[1].interactable = !1,
                this._content[1].active = !0
            },
            onBtnCaozuoClick: function() {
                for (var e = 0; e < 3; e++) this._buttonCom[e].interactable = !0,
                this._content[e].active = !1;
                this._buttonCom[2].interactable = !1,
                this._content[2].active = !0
            }
        }),
        cc._RFpop()
    },
    {}],
    inviteCode: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "d57e37ROzdPDaMYhXIha7NU", "inviteCode");
        var i = e("socket");
        cc.Class({
            "extends": cc.Component,
            properties: {
                labelNumbers: [cc.Label],
                callbackInviteCode: ""
            },
            onLoad: function() {
                this.clickClear()
            },
            clickClear: function() {
                this.labelNumbers.forEach(function(e) {
                    e.string = ""
                })
            },
            clickNumber: function(e, t) {
                var n = this._lastEmptyLabel();
                if (n) {
                    n.string = t,
                    cc.log(n.string, "----------------");
                    null == this._lastEmptyLabel();
                    cc.log("isComplete-------------", this.callbackInviteCode);
                    var o = this._inviteNumber();
                    if (6 == o.length) {
                        i.instance.userInfo.id;
                        this.callbackInviteCode = o
                    }
                }
            },
            sendCode: function() {
                var e = i.instance.userInfo.id,
                t = this.callbackInviteCode;
                cc.log(t, "--------------------38"),
                t && 6 == t.length && (i.sendInviteCode(t, e), this.callbackInviteCode = "")
            },
            clickDeleteOne: function() {
                var e = this._lastNumberLabel();
                e && (e.string = "")
            },
            _lastEmptyLabel: function() {
                for (var e in this.labelNumbers) {
                    var t = this.labelNumbers[e];
                    if (null == t.string || t.string.length <= 0) return t
                }
                return null
            },
            _lastNumberLabel: function() {
                for (var e = this.labelNumbers.length - 1; e >= 0; --e) {
                    var t = this.labelNumbers[e];
                    if (t.string && t.string.length > 0) return t
                }
                return null
            },
            _inviteNumber: function() {
                return this.labelNumbers.reduce(function(e, t) {
                    return e + (t.string || "")
                },
                "")
            }
        }),
        cc._RFpop()
    },
    {
        socket: "socket"
    }],
    joinRoom: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "d5dcb9CJvpPJpnsCQ/q197x", "joinRoom"),
        cc.Class({
            "extends": cc.Component,
            properties: {
                labelNumbers: [cc.Label],
                callbackJoinRoom: null
            },
            onLoad: function() {
                this.clickClear()
            },
            clickNumber: function(e, t) {
                var n = this._lastEmptyLabel();
                if (n) {
                    n.string = t;
                    var i = null == this._lastEmptyLabel();
                    if (i && this.callbackJoinRoom) {
                        var o = this._roomNumber();
                        this.callbackJoinRoom(o)
                    }
                }
            },
            clickClear: function() {
                this.labelNumbers.forEach(function(e) {
                    e.string = ""
                })
            },
            clickDeleteOne: function() {
                var e = this._lastNumberLabel();
                e && (e.string = "")
            },
            _lastEmptyLabel: function() {
                for (var e in this.labelNumbers) {
                    var t = this.labelNumbers[e];
                    if (null == t.string || t.string.length <= 0) return t
                }
                return null
            },
            _lastNumberLabel: function() {
                for (var e = this.labelNumbers.length - 1; e >= 0; --e) {
                    var t = this.labelNumbers[e];
                    if (t.string && t.string.length > 0) return t
                }
                return null
            },
            _roomNumber: function() {
                return this.labelNumbers.reduce(function(e, t) {
                    return e + (t.string || "")
                },
                "")
            }
        }),
        cc._RFpop()
    },
    {}],
    launch: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "0efb2ngHglDtK2A+W4dmfzt", "launch"),
        cc.Class({
            "extends": cc.Component,
            properties: {},
            onLoad: function() {
                this.scheduleOnce(function() {
                    cc.director.loadScene("login")
                },
                .5)
            }
        }),
        cc._RFpop()
    },
    {}],
    login: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "9c72dn88ytPxZWrZRaxt5cr", "login");
        var i = e("manager"),
        o = (e("KQCard"), e("KQCardFindTypeExtension"), e("KQGlobalEvent"), e("AudioManager"), e("KQNativeInvoke")),
        a = e("KQGlabolSocketEventHander");
        cc.Class({
            "extends": cc.Component,
            properties: {
                selectNode: cc.Node,
                alertPrefab: cc.Prefab,
                canvasNode: cc.Node,
                waitingPrefab: cc.Prefab
            },
            goUpdateAction: function() {
                o.isNativeIOS() ? jsb.reflection.callStaticMethod("AppController", "downloadNewVersion:", this.iosUrl) : jsb.reflection.callStaticMethod("com/xinyue/ssz/AppActivity", "downloadNewVersion", "(Ljava/lang/String;)V", this.androidUrl)
            },
            checkVersion: function(e) {
                var t = e.androidVersion,
                n = e.androidVersion;
                if (this.iosUrl = e.iosUrl, this.androidUrl = e.androidUrl, o.isNativeIOS()) if (n != i.version) {
                    this.versionEnable = !1;
                    var a = cc.find("Canvas/update").getComponent("alert");
                    a.alert()
                } else {
                    this.versionEnable = !0;
                    var s = this,
                    r = i.getUserInfo();
                    0 == r.length && (this.loginEnable = !0),
                    this.scheduleOnce(function() {
                        r.length > 0 && (this.loginEnable = !0, s.loginAction())
                    },
                    .5)
                } else if (o.isNativeAndroid()) if (t != i.version) {
                    this.versionEnable = !1;
                    var a = cc.find("Canvas/update").getComponent("alert");
                    a.alert()
                } else {
                    this.versionEnable = !0;
                    var s = this,
                    r = i.getUserInfo();
                    0 == r.length && (this.loginEnable = !0),
                    this.scheduleOnce(function() {
                        r.length > 0 && (this.loginEnable = !0, s.loginAction())
                    },
                    .5)
                } else {
                    window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9128d12e699ab6a7&redirect_uri=http%3A%2F%2Fwww.phpvideo.cn%2Fweb_ssz%2Findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";

                    // this.versionEnable = !0;
                    // var s = this,
                    // r = i.getUserInfo();
                    // 0 == r.length && (this.loginEnable = !0),
                    // this.scheduleOnce(function() {
                    //     r.length > 0 && (this.loginEnable = !0, s.loginAction())
                    // },
                    // .5)
                }
            },
            onLoad: function() {
                a.start();
                var e = this;
                this.loginEnable = !1,
                this.socket = cc.find("GameSocket").getComponent("socket"),
                this.socket.receviceMessage = function(t) {
                    var n = JSON.parse(t);
                    "checkVersion" == n.action ? e.checkVersion(n.data) : "login" == n.action && (n.result ? (e.socket.userInfo = n.data, n.data.roomId.length > 0 ? e.scheduleOnce(function() {
                        cc.director.loadScene("play")
                    },
                    1) : e.scheduleOnce(function() {
                        cc.director.loadScene("hall")
                    },
                    1)) : e.alertMessage("登录失败!"))
                },
                this.socket.getWxInfo = function(t) {
                    i.setUserInfo(t);
                    var n = JSON.parse(t);
                    e.scheduleOnce(function() {
                        e.sendLoginRequest(n)
                    },
                    1)
                };
             	window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9128d12e699ab6a7&redirect_uri=http%3A%2F%2Fwww.phpvideo.cn%2Fweb_ssz%2Findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
				/*-----------------------------------------------*/ 
                if(!cc.sys.isNative){
                	function getQueryString(name) { 
				        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
				        var r = window.location.search.substr(1).match(reg); 
				        if (r != null) return unescape(r[2]); 
				        return null; 
				     }
      				var code = getQueryString("code");
      				if(code){
      					var url="../web_ssz/index.php?code="+code;
      					var xhr = new XMLHttpRequest();
						xhr.onreadystatechange = function () {
						     if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
						         var response = xhr.responseText;
						         t = JSON.parse(response);
						         //i.setUserInfo(response);
						     }
						};
						xhr.open("GET",url, true);
						xhr.send();
					}
                	
                }
				/*-----------------------------------------------*/ 
            },
            onDestroy: function() {
                this.socket.receviceMessage = function() {}
            },
            sendLoginRequest: function(e) {
                this.showWaitingMessage("登录中..."),
                this.socket.sendMessage("login", e)
            },
            loginAction: function() {
                var e = this.selectNode.getComponent("select");
                if (!e.selected) {
                    this.showMsg = cc.instantiate(this.alertPrefab),
                    this.canvasNode.addChild(this.showMsg);
                    var t = this.showMsg.getComponent("alert");
                    return void t.setMessage("请同意用户协议")
                }
                //var n = i.getUserInfo();
                // if (n.length > 0) {
                //     var a = JSON.parse(n);
                //     return void this.sendLoginRequest(a)
                // }
                if( o.isNativeIOS() ){
                	jsb.reflection.callStaticMethod(o.IOSClassName, "wxLogin") 
                }else if(o.isNativeAndroid()){
                	jsb.reflection.callStaticMethod(o.ANDRIODClassName, "wxLogin", "()V");
                }else{
                    window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9128d12e699ab6a7&redirect_uri=http%3A%2F%2Fwww.phpvideo.cn%2Fweb_ssz%2Findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
                	//alert('网页版登录');
                }
                //o.isNativeIOS() ? jsb.reflection.callStaticMethod(o.IOSClassName, "wxLogin") : o.isNativeAndroid() && jsb.reflection.callStaticMethod(o.ANDRIODClassName, "wxLogin", "()V")
            },
            showWaitingMessage: function(e) {
                if (null != this.waitingNode && cc.sys.isNative && cc.isValid(this.waitingNode)) {
                    if (e == this.waitingNode.getComponent("alert").getMessage()) return;
                    this.waitingNode.removeFromParent(),
                    this.waitingNode = null
                }
                this.waitingNode = cc.instantiate(this.waitingPrefab),
                this.canvasNode.addChild(this.waitingNode);
                var t = this.waitingNode.getComponent("alert");
                t.setMessage(e),
                t.alert()
            },
            hiddenWaitingMessage: function() {
                null != this.waitingNode && this.waitingNode.getComponent("alert").dismissAction()
            },
            protocolAction: function() {
                cc.log("protocol action")
            },
            clickUpdate: function() {
                this.goUpdateAction()
            },
            clickExit: function() {
                cc.director.end()
            },
            listenKeyBack: function() {
                var e = 0,
                t = null,
                n = this;
                cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,
                function(i) {
                    i.keyCode == cc.KEY.back && (e++, 1 == e ? (o.isNativeAndroid() && o.alert("再按一次退出！"), t = setTimeout(function() {
                        e = 0,
                        t = null
                    },
                    2e3)) : 2 == e && null != t && (clearTimeout(t), n.clickExit()))
                })
            }
        }),
        cc._RFpop()
    },
    {
        AudioManager: "AudioManager",
        KQCard: "KQCard",
        KQCardFindTypeExtension: "KQCardFindTypeExtension",
        KQGlabolSocketEventHander: "KQGlabolSocketEventHander",
        KQGlobalEvent: "KQGlobalEvent",
        KQNativeInvoke: "KQNativeInvoke",
        manager: "manager"
    }],
    manager: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "4a47fj0J/VHup24OT7njkko", "manager"),
        t.exports = {
            version: "v1.0.4",
            setUserInfo: function(e) {
                cc.sys.localStorage.setItem("userinfo", e)
            },
            getUserInfo: function() {
                var e = cc.sys.localStorage.getItem("userinfo");
                return e ? e: ""
            },
            setMusicValue: function(e) {
                cc.sys.localStorage.setItem("musicVolumn", e)
            },
            getMusicValue: function() {
                var e = cc.sys.localStorage.getItem("musicVolumn");
                return e ? e: 1
            },
            setMusicEffectValue: function(e) {
                cc.sys.localStorage.setItem("musicEffectVolumn", e)
            },
            getMusicEffectValue: function() {
                var e = cc.sys.localStorage.getItem("musicEffectVolumn");
                return e ? e: 1
            }
        },
        cc._RFpop()
    },
    {}],
    play: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "16c65H2Pw9PBaQSvw69LGLQ", "play");
        var i = e("socket"),
        o = e("KQGlobalEvent"),
        a = (e("ArrayExtension"), e("manager"), e("AudioManager")),
        s = e("KQNativeInvoke"),
        r = e("UserModelHelper"),
        c = e("Playback"),
        d = e("fecha"),
        u = e("Player"),
        l = {
            WAIT_PEOPLE: 0,
            WAIT_READY: 1,
            PLAYING: 2
        },
        h = cc.Class({
            "extends": cc.Component,
            properties: {
                playerNodes: [cc.Node],
                chatNode: cc.Node,
                cardTypeCombineNode: cc.Node,
                labelRoomNumber: cc.Label,
                labelOverview: cc.Label,
                labelRemainTime: cc.Label,
                btnShare: cc.Button,
                btnReady: cc.Button,
                btnPiao2: cc.Button,
                btnPiao3: cc.Button,
                fapaiNode: cc.Node,
                btnChatVoice: cc.Button,
                btnChatText: cc.Button,
                startCompareCardsNode: cc.Node,
                voiceRecordAnimationNode: cc.Node,
                settingNode: cc.Node,
                playbackNode: cc.Node,
                oneGameResult: cc.Node,
                totalGameResult: cc.Node,
                selectPiaoView: cc.Node,
                alertRequestExitNode: cc.Node,
                alertRequestExitCountdownNode: cc.Node,
                btnAlertRequestExitConfirmButton: cc.Button,
                btnAlertRequestExitCancelButton: cc.Button,
                alertAnsowerExitNode: cc.Node,
                alertAnsowerExitCountdownNode: cc.Node,
                alert: cc.Node,
                alertForceExitNode: cc.Node,
                waitingPrefab: cc.Prefab,
                playerComps: [u],
                _playerComponents: null,
                _msgControl: null,
                _socket: null,
                _userId: 0,
                _playerInfos: null,
                _deskInfo: null,
                _gameStatus: l.WAIT_PEOPLE,
                _enterTime: null,
                _isComparingCardsNow: !1,
                _playedCompareCardsIndexs: []
            },
            onLoad: function() {
                var e = this;
                this._enterTime = Date.now(),
                this.playerComps.forEach(function(t) {
                    t.playedCompareCardsIndexs = e._playedCompareCardsIndexs
                }),
                a.instance.playDeskMusic(),
                this._initPlayerComponents(),
                this._initSelectCardNode(),
                this._initOneGameResult(),
                this._remainTimeStartUpdate(),
                this._userId = i.instance.userInfo.id,
                this._msgControl = this.chatNode.getComponent("MsgControl"),
                this.settingNode.getComponent("Setting").hideSwitch(),
                this.labelRoomNumber.string = "",
                this.labelRemainTime.node.active = !1,
                this._registerVoiceNodeEvents(),
                this._registerSocketEvent(),
                c.instance.isContainPlaybackDatas() ? (c.instance.startPlayback(), this.playbackNode.active = !0, this.btnChatVoice.node.active = !1, this.btnChatText.node.active = !1) : this._loadDeskInfo(),
                this._socket = i.instance
            },
            _initPlayerComponents: function() {
                this._playerComponents = this.playerNodes.map(function(e) {
                    return e.getComponent("Player")
                })
            },
            _initSelectCardNode: function() {
                var e = this,
                t = this.cardTypeCombineNode.getComponent("CardTypeCombine");
                t.setFinishSelectCardsCallback(function(n) {
                    t.reset(),
                    i.sendPlayCard(e._userId, n),
                    e.cardTypeCombineNode.active = !1
                })
            },
            _initOneGameResult: function() {
                var e = this;
                this.oneGameResult.setCloseCallback = function() {
                    e._isRandomRoom() && cc.director.loadScene("hall")
                }
            },
            onDestroy: function() {
                o.offTarget(this)
            },
            clickExit: function() {
                if (c.instance.isPlaybacking()) return void cc.director.loadScene("hall");
                if (this._deskInfo && this._deskInfo.isDeskOver) return void(this._isComparingCardsNow || cc.director.loadScene("hall"));
                if (this._isRandomRoom()) return void this.alertForceExitNode.getComponent("alert").alert();
                if (0 == this._deskInfo.cIndex) return i.sendLeaveDesk(this._userId),
                void cc.director.loadScene("hall");
                this.btnAlertRequestExitCancelButton.node.active = !0,
                this.btnAlertRequestExitConfirmButton.node.active = !0;
                var e = this.alertRequestExitNode.getComponent("alert");
                e.unscheduleAllCallbacks(),
                e.setMessage("您在申请协商退出，如果所有玩家同意，您将退出游戏。"),
                e.alert(),
                this.alertRequestExitCountdownNode.getComponent("Countdown").stop()
            },
            clickShare: function() {
                var e = String(this._deskInfo.roomId),
                t = "江华十三张 玩法:" + this._deskInfoGameWay();
                t = t + " " + this._deskInfoNumberOfPeople(),
                t = t + "," + this._deskInfoPayInfo(),
                t = t + " " + this._deskInfoNumberOfGame(),
                s.isNativeIOS() ? jsb.reflection.callStaticMethod(s.IOSClassName, "wxShareFriend:description:", e, t) : s.isNativeAndroid() && jsb.reflection.callStaticMethod(s.ANDRIODClassName, "wxShareFriend", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", e, t, cc.shareUrl)
            },
            clickReady: function() {
                this.btnReady.node.active = !1,
                this.btnShare.node.active = !1,
                i.sendReady(this._userId)
            },
            updateRoomNumber: function(e) {
                this.labelRoomNumber.string = "房号 : " + e
            },
            updateGameStatus: function() {
                var e = arguments.length <= 0 || void 0 === arguments[0] ? l.WAIT_PEOPLE: arguments[0];
                this._gameStatus = e,
                this.btnShare.node.active = e == l.WAIT_PEOPLE,
                this.btnReady.node.active = e == l.WAIT_READY,
                e == l.PLAYING && this._playerComponents.forEach(function(e) {
                    e.hideReadyStatus()
                })
            },
            gameStatus: function() {
                return this._gameStatus
            },
            _startGame: function() {
                var e = this;
                this.gameStatus() != l.PLAYING && (this.updateGameStatus(l.PLAYING), this._playFaPaiAnimation(), r.isPlayedCards(this._findPlayerInfoByUserId(this._userId)) || !
                function() {
                    e.scheduleOnce(function() {
                        this._showCardTypeCombine()
                    }.bind(e), 0);
                    var t = e;
                    e.fapaiNode.getComponent("alert").alert(),
                    e.scheduleOnce(function() {
                        t.fapaiNode.active = !1
                    },
                    2)
                } ())
            },
            _playFaPaiAnimation: function() {
                this._playerComponents.forEach(function(e) {
                    "playSelf" != e.node.name && e.playFaPaiAnimation()
                }),
                a.instance.playFaPai()
            },
            _showCardTypeCombine: function() {
                if (!c.instance.isPlaybacking() && !this.cardTypeCombineNode.active) {
                    var e = this.cardTypeCombineNode.getComponent("CardTypeCombine");
                    e.reloadCards([]),
                    e.node.active = !0,
                    e.timeStart(120);
                    var t = this._findCardsByUserId(this._userId),
                    n = this._convertCardsToCardNames(t);
                    e.reloadCards(n)
                }
            },
            _showOneGameResult: function() {
                this._isComparingCardsNow = !1,
                this.updateGameStatus(l.WAIT_PEOPLE);
                var e = this.oneGameResult.getComponent("GameResult");
                e.unscheduleAllCallbacks(),
                e.showResults(this._deskInfo, this._userId),
                this._updateUserScores(),
                this._updateBanker();
                var t = this;
                this.scheduleOnce(function() {
                    t._playerComponents.forEach(function(e) {
                        e.reset()
                    }),
                    t._isRandomRoom() || (t.btnReady.node.active = !0, t._isTotalGameOver() && t._showTotalGameResult())
                },
                .5),
                (this._isRandomRoom() || c.instance.isPlaybacking()) && (e.getComponent("alert").dismissAction = function() {
                    return cc.director.loadScene("hall"),
                    !0
                })
            },
            _showTotalGameResult: function() {
                var e = arguments.length <= 0 || void 0 === arguments[0] ? 2 : arguments[0];
                this.btnReady.node.active = !1,
                this.btnShare.node.active = !1,
                this.alertAnsowerExitNode.active = !1,
                this.alertRequestExitNode.active = !1;
                var t = this.totalGameResult.getComponent("TotalGameResult");
                t.setPlayerInfos(this._deskInfo.players, this._deskInfo);
                var n = this.totalGameResult.getComponent("alert");
                this.scheduleOnce(function() {
                    this.oneGameResult.active = !1,
                    this.totalGameResult.active || n.alert(),
                    n.alert()
                }.bind(this), e),
                n.setDismissCallback(function() {
                    cc.director.loadScene("hall")
                })
            },
            _loadDeskInfo: function() {
                i.sendGetDesckInfo(this._userId)
            },
            _registerSocketEvent: function() {
                o.on(i.Event.ReceiveDeskInfo, this._socketReceiveDeskInfo, this),
                o.on(i.Event.ReceiveOnlineStatus, this._socketReciveOnlineStatus, this),
                o.on(i.Event.ReceiveChatText, this._socketReciveChatTextMessage, this),
                o.on(i.Event.ReceiveRequestDissolve, this._socketReceiveRequestExitMessage, this),
                o.on(i.Event.ReceiveRequestDissolveResult, this._socketReceiveRequestExitResultMessage, this),
                o.on(i.Event.ReceiveAudioMessage, this._socketReceiveAudioMessage, this),
                o.on(i.Event.ReceivePlayCard, this._socketReceivePlayCard, this),
                o.on(i.Event.ReceiveGameOver, this._socketReceiveGameOver, this),
                o.on(i.Event.ReceiveFaPai, this._socketReciveFaPai, this),
                o.on(i.Event.ReceiveReady, this._socketReciveReady, this),
                o.on(i.Event.ReceiveDissolveDesk, this._socketReceiveDissolveDesk, this),
                o.on(i.Event.ReceiveLeaveDesk, this._socketLeaveDesk, this),
                o.on(i.Event.SocketDisconnect, this._receiveSocketConnectError, this),
                o.on(i.Event.SocketConnectSuccessed, this._receiveSocketConnectSuccessed, this),
                o.on(i.Event.ReceivePause, this._socketReceivePause, this),
                o.on(i.Event.ReceiveSelectPiao, this.showSelectPiaoView, this),
                o.on(i.Event.ReceivePlayerPiao, this.updatePlayerPiaoTitle, this)
            },
            _socketReceiveDeskInfo: function(e) {
                if (!e.result) return void cc.error("错误：", e);
                var t = e.data; (t.maxNumber > 2 || 1 == t.setting3) && (this.btnPiao2.node.active = !1, this.btnPiao3.node.active = !1),
                this._deskInfo = t,
                this._updatGameOverview(this._deskInfo),
                this.updateRoomNumber(t.roomId);
                var n = t.playersIndex;
                this._injectUserIdToPlayerComponents(n),
                0 == this._deskInfo.cIndex && (this.btnShare.node.active = !0),
                this._updateSelectPiaoView(t);
                var i = t.players;
                this._playerInfos = i,
                this._updateUserInfos(i),
                this._updateUserScores(),
                this._updateBanker(),
                this._msgControl.addPlayerInfos(this._playerInfos);
                var o = i.find(function(e) {
                    return e.id == this._userId
                }.bind(this));
                this._deskInfo.isCBegin || (this._gameStatus = l.WAIT_READY);
                var a = this._deskInfo.cIndex;
                0 != a && (o && o.cards.length > 0 && this._deskInfo.isCBegin ? this._startGame() : r.isPlayedCards(o) && !this._deskInfo.isCBegin && this._socketReceiveGameOver(e), this._deskInfo.isCBegin || this._isRandomRoom() || this._deskInfo.isDeskOver ? this.btnReady.node.active = !1 : (this.btnReady.node.active = !0, this._isComparingCardsNow && (this.btnReady.node.active = !1)), this._handleUpdateDeskInfoAboutExitRoom(this._deskInfo))
            },
            _socketReciveFaPai: function(e) {
                this._socketReceiveDeskInfo(e)
            },
            _socketReciveOnlineStatus: function(e) {
                if (!e.result) return void cc.error("错误：", e);
                var t = e.data,
                n = t.userId,
                i = t.status;
                this._playerComponents.forEach(function(e) {
                    e.setUserOnlineStatus(n, i)
                })
            },
            _socketReciveChatTextMessage: function(e) {
                var t = e.data.userId,
                n = e.data.msg;
                this._playerComponents.forEach(function(e) {
                    e.showChatText(t, n)
                }),
                this._msgControl.addChatTextMessage(t, n);
                var i = this._playerInfos.find(function(e) {
                    return e.id == t
                }).sex;
                a.instance.playChatAudio(i, n)
            },
            _socketReceiveRequestExitMessage: function(e) {
                if (e.data.userId != this._userId) {
                    var t = this.alertAnsowerExitNode.getComponent("alert");
                    t.alert(),
                    t.unscheduleAllCallbacks();
                    var n = this.alertAnsowerExitCountdownNode.getComponent("Countdown");
                    n.startCountdown(120,
                    function(e) {
                        if (e) return void this.clickAgreeOtherPlayerExit()
                    }.bind(this))
                }
            },
            _socketReceiveRequestExitResultMessage: function(e) {
                if (this._hideReqestExitNode(), this.alertAnsowerExitNode.active && (this.alertAnsowerExitNode.getComponent("alert").dismissAction(), this.alertAnsowerExitCountdownNode.getComponent("Countdown").stop()), e.data.result);
                else {
                    var t = e.data.userId,
                    n = this._findPlayerInfoByUserId(t).nickname;
                    this.showAlertMessage("解散失败，因为" + n + "不同意退出")
                }
            },
            _socketReceiveAudioMessage: function(e) {
                var t = e.data.userId;
                if (this.playSpeakAnimation(t), t != this._userId) {
                    var n = e.data.url;
                    this.playAudioUrl(n)
                }
            },
            _socketReceivePlayCard: function(e) {
                var t = e.data.userId;
                this._playerComponents.forEach(function(e) {
                    e.playCard(t)
                }),
                t == this._userId && (this.cardTypeCombineNode.active = !1)
            },
            _socketReciveReady: function(e) {
                var t = e.data.userId;
                this._playerComponents.forEach(function(e) {
                    e.showReadyStatus(t)
                })
            },
            _socketReceiveGameOver: function(e) {
                if (this._hideReqestExitNode(), !e.result) return void cc.error("错误：", e);
                var t = e.data;
                if ("gameOver" == e.action && t.isDeskOver && i.sendDidReceiveGameOverAction(this._userId), this._deskInfo = e.data, this._isDissvledRoom() && !c.instance.isPlaybacking()) return void this._showTotalGameResult(.1);
                if (Date.now() - this._enterTime < 4e3) return this.btnReady.node.active = !0,
                this._playerComponents.forEach(function(e) {
                    e.reset()
                }),
                void this._playedCompareCardsIndexs.push(this._deskInfo.cIndex);
                var n = e.data;
                this._deskInfo = n,
                this._updatGameOverview(this._deskInfo);
                var o = (n.playersIndex, n.players);
                this._playerInfos = o,
                this._updateUserInfos(o),
                r.isUserReady(this._findCurrentUserInfo()) ? this._playerComponents.forEach(function(e) {
                    e.reset()
                }) : this._startCompareCards(e)
            },
            _socketReceiveDissolveDesk: function(e) {
                this.cardTypeCombineNode.active = !1;
                var t = "房主已解散房间";
                this._isRandomRoom() && (t = "有玩家已强制退出房间，游戏结束。本局游戏不会扣除您的钻石。"),
                this.showAlertMessage(t, !1),
                this.alert.getComponent("alert").setWillDismissCallback(function() {
                    return cc.director.loadScene("hall"),
                    !0
                })
            },
            _socketLeaveDesk: function(e) {
                e.result && (this._deskInfo.isDeskOver || cc.director.loadScene("hall"))
            },
            _socketReceivePause: function(e) {
                if (e.result) {
                    var t = e.data.userId;
                    this._playerComponents.forEach(function(e) {
                        e.userId == t && e.setUserOnlineStatus(t, 0)
                    })
                }
            },
            _receiveSocketConnectError: function(e) {
                this.showNetworkMessage()
            },
            _receiveSocketConnectSuccessed: function(e) {
                this.hiddenNetworkMessage(),
                c.instance.isPlaybacking() || this._loadDeskInfo()
            },
            updateDeskInfo: function(e) {
                this._deskInfo = e,
                this._updatGameOverview(this._deskInfo),
                this.updateRoomNumber(e.roomId);
                var t = e.playersIndex;
                this._injectUserIdToPlayerComponents(t);
                var n = e.players;
                this._playerInfos = n,
                this._updateUserInfos(n),
                this._msgControl.addPlayerInfos(this._playerInfos),
                0 == e.cIndex && e.players.length < 4 && (this.btnShare.node.active = !0)
            },
            _injectUserIdToPlayerComponents: function(e) {
                var t = e.findIndex(function(e) {
                    return e == this._userId
                }.bind(this)),
                n = e.translationWithStartIndex(t);
                this._playerComponents.forEach(function(e, t) {
                    var i = n.length > t ? n[t] : null;
                    e.userId = i
                })
            },
            _updateUserInfos: function(e) {
                var t = this;
                this._playerComponents.forEach(function(n, i) {
                    n.updateDeskInfo(t._deskInfo),
                    n.updateUserInfoWithUsers(e)
                }),
                this._handleTheSameOfIPAdress(e)
            },
            _updateUserScores: function(e) {
                this._playerComponents.forEach(function(e) {
                    e.updateScore()
                })
            },
            _updateBanker: function() {
                this._playerComponents.forEach(function(e) {
                    e.updateBanker()
                })
            },
            _findCardsByUserId: function(e) {
                var t = this._findPlayerInfoByUserId(e);
                return null != t ? t.cards: null
            },
            _findPlayerInfoByUserId: function(e) {
                var t = (this._playerInfos || []).find(function(t) {
                    return e == t.id
                });
                return t
            },
            _findPlayerIndexByUserId: function(e) {
                var t = this._playerComponents.findIndex(function(t) {
                    return t.userId == e
                });
                return t
            },
            _findCurrentUserInfo: function() {
                return this._findPlayerInfoByUserId(this._userId)
            },
            _convertCardsToCardNames: function(e) {
                var t = {
                    s: 4,
                    h: 3,
                    c: 2,
                    d: 1
                };
                return e.map(function(e) {
                    var n = e.number;
                    14 == e.number && (n = 1);
                    var i = t[e.suit],
                    o = Math.max(Math.min(n, 13), 1);
                    return i + "_" + o
                })
            },
            _updatGameOverview: function(e) {
                if (c.instance.isPlaybacking()) return void(this.labelOverview.string = "回放");
                if (this._isRandomRoom()) return void(this.labelOverview.string = "");
                var t = "";
                0 != e.setting1 && 1 != e.setting1 ? t = "局数 : " + e.cIndex + "/" + e.mMax: 0 == e.setting1 ? t = "100条": 1 == e.setting1 && (t = "200条");
                var n = (this._deskInfoGameWay(), "");
                switch (e.setting3) {
                case 0:
                    n = "三道";
                    break;
                case 1:
                    n = "六道";
                    break;
                case 2:
                    n = "坐庄";
                    break;
                case 3:
                    n = "轮庄"
                }
                this.labelOverview.string = "模式 : " + n + " / " + e.maxNumber + "人\n" + t
            },
            _isRandomRoom: function() {
                return null == this._deskInfo || this._deskInfo.isRandomDesk
            },
            _isTotalGameOver: function() {
                return null != this._deskInfo && ( !! this._deskInfo.isDeskOver || this._deskInfo.mMax <= this._deskInfo.cIndex)
            },
            _isDissvledRoom: function() {
                return !! this._deskInfo && this._deskInfo.dissolveStatus
            },
            _startCompareCards: function(e) {
                this._isComparingCardsNow = !0;
                var t = this._findPlayerInfoByUserId(this._userId);
                a.instance.playStartCompare(t.sex),
                this.startCompareCardsNode.getComponent("alert").alert(),
                this.scheduleOnce(function() {
                    this.startCompareCardsNode.active = !1,
                    this._showCompareCardDetails(e)
                }.bind(this), 2)
            },
            _showCompareCardDetails: function(e) {
                this._playerComponents.forEach(function(e) {
                    e.readyToCompareCards()
                });
                var t = this._playerComponents.filter(function(e) {
                    return e.node.active
                }),
                n = this,
                i = this._showCompareCardStep(0, t);
                this.scheduleOnce(function() {
                    n._showCompareCardStep(0, t)
                },
                i),
                this.scheduleOnce(function() {
                    n._showCompareCardStep(0, t)
                },
                2 * i),
                i = 3 * i + .5;
                var o = 1.5,
                a = this._shootDatas() || [],
                s = this._homeRunUserId();
                a.forEach(function(e, t) {
                    n.scheduleOnce(function() {
                        n.playShoot(e.fromUserId, e.toUserId)
                    },
                    i + t * o)
                }),
                i += a.length * o,
                s > 0 && (n.scheduleOnce(function() {
                    n.playHomeRun(s)
                },
                i), i += 1),
                s && (i += 1),
                this.scheduleOnce(function() {
                    n._showCompareCardFinished()
                },
                i)
            },
            _showCompareCardStep: function() {
                var e = arguments.length <= 0 || void 0 === arguments[0] ? 0 : arguments[0],
                t = arguments.length <= 1 || void 0 === arguments[1] ? [] : arguments[1],
                n = e,
                i = 1,
                o = this;
                return t = t.sort(function(e, t) {
                    return e.nextCompareScore() - t.nextCompareScore()
                }),
                t.forEach(function(e) {
                    o.scheduleOnce(function() {
                        e.showNextCompareCards()
                    },
                    n),
                    n += i
                }),
                n
            },
            _isGameOver: function() {},
            _showCompareCardFinished: function() {
                this._showOneGameResult(),
                this._playedCompareCardsIndexs.push(this._deskInfo.cIndex)
            },
            showNetworkMessage: function() {
                var e = arguments.length <= 0 || void 0 === arguments[0] ? "网络链接断开，重新连接中...": arguments[0];
                if (!this.networkNode || !this.networkNode.active) {
                    if (null != this.networkNode) {
                        var t = cc.removeSelf();
                        this.networkNode.runAction(t),
                        this.networkNode = null
                    }
                    this.networkNode = cc.instantiate(this.waitingPrefab),
                    this.node.addChild(this.networkNode);
                    var n = this.networkNode.getComponent("alert"),
                    i = this;
                    n.onDismissComplete = function() {
                        i.networkNode = null
                    },
                    n.setMessage(e),
                    n.alert()
                }
            },
            hiddenNetworkMessage: function() {
                null != this.networkNode && this.networkNode.getComponent("alert").dismissAction()
            },
            showAlertMessage: function(e, t) {
                var n = this.alert.getComponent("alert");
                this.alert.active || n.alert(),
                n.setMessage(e),
                n.unscheduleAllCallbacks(),
                t && n.scheduleOnce(function() {
                    n.dismissAction()
                },
                5)
            },
            showCheckMessage: function() {
                var e = arguments.length <= 0 || void 0 === arguments[0] ? "检查网络中...": arguments[0];
                if (null != this.checkNode) {
                    var t = cc.removeSelf();
                    this.checkNode.runAction(t),
                    this.checkNode = null
                }
                this.checkNode = cc.instantiate(this.waitingPrefab),
                this.node.addChild(this.checkNode);
                var n = this.checkNode.getComponent("alert"),
                i = this;
                n.onDismissComplete = function() {
                    i.checkNode = null
                },
                n.setMessage(e),
                n.alert()
            },
            hiddenCheckMessage: function() {
                null != this.checkNode && this.checkNode.active && this.checkNode.getComponent("alert").dismissAction()
            },
            _registerVoiceNodeEvents: function() {
                var e = this,
                t = this.btnChatVoice.node;
                this.endRecordTime = Date.now(),
                t.on(cc.Node.EventType.TOUCH_START,
                function(t) {
                    if (Date.now() - e.endRecordTime >= 1e3) {
                        e.nativeRecordAction(),
                        e.voiceRecordAnimationNode.active = !0;
                        var n = cc.scaleTo(.12, 1.2);
                        e.btnChatVoice.node.runAction(n),
                        e._isRecording = !0
                    }
                }),
                t.on(cc.Node.EventType.TOUCH_END,
                function(t) {
                    e._isRecording && (e.endRecordTime = Date.now()),
                    e._isRecording = !1,
                    e.nativeEndRecordAction(),
                    e.voiceRecordAnimationNode.active = !1;
                    var n = cc.scaleTo(.12, 1);
                    e.btnChatVoice.node.runAction(n)
                }),
                t.on(cc.Node.EventType.TOUCH_CANCEL,
                function(t) {
                    e._isRecording && (e.endRecordTime = Date.now()),
                    e._isRecording = !1,
                    e.nativeEndRecordAction(),
                    e.voiceRecordAnimationNode.active = !1;
                    var n = cc.scaleTo(.12, 1);
                    e.btnChatVoice.node.runAction(n)
                }),
                i.instance.uploadFinish = function(t) {
                    var n = e._userId;
                    i.sendAudioMessage(n, t),
                    e.playSpeakAnimation(e._userId)
                }
            },
            nativeRecordAction: function() {
                s.isNativeIOS() ? jsb.reflection.callStaticMethod(s.IOSClassName, "record") : s.isNativeAndroid() && (jsb.reflection.callStaticMethod(s.ANDRIODClassName, "record", "()V"), a.instance.pauseMusic())
            },
            nativeEndRecordAction: function() {
                s.isNativeIOS() ? jsb.reflection.callStaticMethod(s.IOSClassName, "endRecord") : s.isNativeAndroid() && (jsb.reflection.callStaticMethod(s.ANDRIODClassName, "endRecord", "()V"), a.instance.resumeMusic())
            },
            playAudioUrl: function(e) {
                s.isNativeIOS() ? jsb.reflection.callStaticMethod(s.IOSClassName, "playUrl:", e) : s.isNativeAndroid() && jsb.reflection.callStaticMethod(s.ANDRIODClassName, "playUrl", "(Ljava/lang/String;)V", e)
            },
            _handleUpdateDeskInfoAboutExitRoom: function(e) {
                if (e.isDissolving) {
                    var t = e.dissolveLeftTime || 120,
                    n = e.dissolveUserId;
                    if (n == this._userId) {
                        this.alertRequestExitNode.active = !0,
                        this.btnAlertRequestExitCancelButton.node.active = !1,
                        this.btnAlertRequestExitConfirmButton.node.active = !1;
                        var i = this.alertRequestExitNode.getComponent("alert");
                        return i.setMessage("您正在申请协商退出，等待其他玩家同意"),
                        void this.alertRequestExitCountdownNode.getComponent("Countdown").startCountdown(t)
                    }
                    var o = e.dissolveAnswerInfo,
                    a = e.playersIndex.findIndex(function(e) {
                        return this._userId == e
                    }.bind(this)),
                    s = o[a];
                    if (s == -1) {
                        this.alertAnsowerExitNode.active = !0;
                        var r = this.alertAnsowerExitCountdownNode.getComponent("Countdown");
                        r.startCountdown(t,
                        function(e) {
                            e && this.clickAgreeOtherPlayerExit()
                        }.bind(this))
                    }
                }
            },
            clickConfirmForceExit: function() {
                i.sendForceExitRoom(this._userId),
                cc.director.loadScene("hall")
            },
            clickConfirmRequestExit: function() {
                this.btnAlertRequestExitCancelButton.node.active = !1,
                this.btnAlertRequestExitConfirmButton.node.active = !1;
                var e = this.alertRequestExitNode.getComponent("alert");
                e.setMessage("您正在申请协商退出，等待其他玩家同意"),
                this.alertRequestExitCountdownNode.getComponent("Countdown").startCountdown(120),
                i.sendLeaveDesk(this._userId)
            },
            clickAgreeOtherPlayerExit: function() {
                this.alertAnsowerExitNode.getComponent("alert").dismissAction(),
                this.alertAnsowerExitNode.getComponent("alert").unscheduleAllCallbacks(),
                this.alertAnsowerExitCountdownNode.getComponent("Countdown").stop(),
                i.sendAnswerDissolve(this._userId, 1)
            },
            clickDisagreeOtherPlayerExit: function() {
                this.alertAnsowerExitNode.getComponent("alert").dismissAction(),
                this.alertAnsowerExitNode.getComponent("alert").unscheduleAllCallbacks(),
                this.alertAnsowerExitCountdownNode.getComponent("Countdown").stop(),
                i.sendAnswerDissolve(this._userId, 0)
            },
            _hideReqestExitNode: function() {
                this.alertRequestExitNode.active && (this.alertRequestExitNode.active = !1, this.alertRequestExitCountdownNode.getComponent("Countdown").stop())
            },
            playShoot: function(e, t) {
                var n = this._findPlayerInfoByUserId(e);
                n && a.instance.playHumanDaQiang(n.sex);
                var i = this._findPlayerIndexByUserId(t);
                this._playerComponents.forEach(function(n) {
                    n.playShootAnimation(e, i),
                    n.playBulletHoleAnimation(t)
                })
            },
            playHomeRun: function(e) {
                var t = this._findPlayerInfoByUserId(e);
                t && a.instance.playHomeRun(t.sex),
                this._playerComponents.forEach(function(t) {
                    t.playHomeRunAimation(e)
                })
            },
            playSpeakAnimation: function(e) {
                this._playerComponents.forEach(function(t) {
                    t.playSpeakAnimation(e)
                })
            },
            _shootDatas: function() {
                var e = this._homeRunUserId(),
                t = this._deskInfo.shotData.filter(function(t) {
                    return t.fromUserId != e
                });
                return t
            },
            _homeRunUserId: function() {
                if (0 == this._deskInfo.setting3) return this._deskInfo.allShotData
            },
            _deskInfoGameWay: function() {
                var e = this._deskInfo.setting3 || 0,
                t = ["三道", "六道", "庄家", "轮庄"];
                return t[e]
            },
            _deskInfoNumberOfGame: function() {
                var e = this._deskInfo.setting1 || 0,
                t = ["100条", "200条", "10局", "20局", "30局"];
                return e <= 1 ? "条数：" + t[e] : "局数：" + t[e]
            },
            _deskInfoNumberOfPeople: function() {
                var e = this._deskInfo.setting2 || 0,
                t = ["4人", "3人", "2人"];
                return t[e]
            },
            _deskInfoPayInfo: function() {
                var e = this._deskInfo.setting4 || 0,
                t = ["房主支付", "房费AA"];
                return t[e]
            },
            _remainTimeStartUpdate: function() {
                this.schedule(this._remainTimeUpdate, 1, cc.macro.REPEAT_FOREVER)
            },
            _remainTimeUpdate: function() {
                if (this._isRandomRoom() || c.instance.isPlaybacking()) return this.labelRemainTime.string = "",
                void(this.labelRemainTime.node.active = !1);
                if (null == this._deskInfo) return this.labelRemainTime.string = "",
                void(this.labelRemainTime.node.active = !1);
                var e = 0 == this._deskInfo.setting1 || 1 == this._deskInfo.setting1;
                if (e) return void(this.labelRemainTime.node.active = !1);
                if (this._deskInfo.createTime) {
                    this.labelRemainTime.node.active = !0;
                    var t = d.parse(this._deskInfo.createTime, "YYYY-MM-DD HH:mm:ss").getTime(),
                    n = 7200,
                    i = (Date.now() - t) / 1e3;
                    i = Math.max(n - i, 0);
                    var o = Math.floor(i / 3600),
                    a = Math.floor(i % 3600 / 60),
                    s = Math.floor(i % 60);
                    if (0 == o && 0 == a && 0 == s) return void(this.labelRemainTime.string = "");
                    var r = "" + o;
                    r.length < 2 && (r = "0" + r);
                    var u = "" + a;
                    u.length < 2 && (u = "0" + u);
                    var l = "" + s;
                    l.length < 2 && (l = "0" + l);
                    var h = "剩余时间：" + r + ":" + u + ":" + l;
                    this.labelRemainTime.string = h
                }
            },
            _handleTheSameOfIPAdress: function(e) {
                if (e && 0 != e.length) {
                    var t = e.reduce(function(e, t) {
                        var n = e[t.ipAddress] || [];
                        return n.push(t),
                        e[t.ipAddress] = n,
                        e
                    },
                    {}),
                    n = null;
                    for (var i in t) {
                        var o = t[i];
                        if (o.length > 1) {
                            n = o;
                            break
                        }
                    }
                    null != n && this._alertSameIpUserInfos(n)
                }
            },
            _alertSameIpUserInfos: function(e) {
                var t = "",
                n = "";
                e.forEach(function(e, i) {
                    t = t + (i > 0 ? " 和 ": "") + e.nickname,
                    n += e.id
                }),
                t += " 在同一 IP 下！",
                this._didAlertSameIpMessage = this._didAlertSameIpMessage || {},
                this._didAlertSameIpMessage[n] || (this.showAlertMessage(t, !0), this._didAlertSameIpMessage[n] = !0)
            },
            _updateSelectPiaoView: function(e) {
                var t = this;
                null != e.waitSelectPiao && e.waitSelectPiao && (t.btnShare.active = !1, t.btnReady.active = !1, e.players.forEach(function(e) {
                    e.id == t._userId && null == e.piaoN && t.showSelectPiaoView()
                }))
            },
            onPiaoBtnClick: function(e) {
                var t = e.target.name,
                n = 0;
                switch (t) {
                case "piao_1":
                    n = 1;
                    break;
                case "piao_2":
                    n = 2;
                    break;
                case "piao_3":
                    n = 3
                }
                this.piaoN = n,
                i.sendPiao(this._userId, n),
                this.hiddenSelectPiaoView()
            },
            showSelectPiaoView: function() {
                var e = this.selectPiaoView.getComponent("alert");
                e.alert(),
                this.btnShare.node.active = !1,
                this.btnReady.node.active = !1
            },
            hiddenSelectPiaoView: function() {
                var e = this.selectPiaoView.getComponent("alert");
                e.dismissAction()
            },
            updatePlayerPiaoTitle: function(e) {
                this._playerComponents.forEach(function(t, n) {
                    t.updatePlayerPiaoTitle(e.data)
                })
            }
        });
        t.exports = h,
        cc._RFpop()
    },
    {
        ArrayExtension: "ArrayExtension",
        AudioManager: "AudioManager",
        KQGlobalEvent: "KQGlobalEvent",
        KQNativeInvoke: "KQNativeInvoke",
        Playback: "Playback",
        Player: "Player",
        UserModelHelper: "UserModelHelper",
        fecha: "fecha",
        manager: "manager",
        socket: "socket"
    }],
    product: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "a9ad2cC2BdEiaFSqV4XCWQV", "product"),
        cc.Class({
            "extends": cc.Component,
            properties: {
                productId: ""
            },
            onLoad: function() {},
            clickAction: function() {
                this.onClickAction(this.productId)
            },
            onClickAction: function(e) {}
        }),
        cc._RFpop()
    },
    {}],
    randRoom: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "4d298BlaelCHqiV5dTDjhuY", "randRoom");
        var i = e("socket"),
        o = e("KQGlobalEvent");
        cc.Class({
            "extends": cc.Component,
            properties: {
                matchingLabel: cc.Label,
                timeNode: cc.Node,
                matchingNode: cc.Node,
                waitingPrefab: cc.Prefab,
                alertPrefab: cc.Prefab,
                _userId: null
            },
            onLoad: function() {
                this._userId = i.instance.userInfo.id,
                o.on(i.Event.ReceiveDeskInfo, this._socketReceiveDeskInfo, this),
                o.on(i.Event.SocketDisconnect, this._socketDisconnect, this),
                o.on(i.Event.SocketConnectSuccessed, this._socketConnected, this),
                o.on(i.Event.ReceiveInterRandom, this._socketReceiveInterRandom, this)
            },
            _socketReceiveDeskInfo: function(e) {
                e.result && cc.director.loadScene("play")
            },
            _socketReceiveInterRandom: function(e) {
                if (this.unschedule(this._timeoutRandomAction), !e.result) {
                    var t = e.data.reason || "加入随机场失败";
                    this.showAlertMessage(t),
                    "你已经在匹配队列" == t ? this._showMatching() : this._hideMatching()
                }
            },
            _socketDisconnect: function() {
                this.matchingNode.active = !1,
                this.showNetworkMessage("网络链接断开，重新连接中...")
            },
            _socketConnected: function() {
                this.hiddenNetworkMessage()
            },
            onDestroy: function() {
                o.offTarget(this)
            },
            clickExit: function() {
                cc.director.loadScene("hall")
            },
            clickStart: function() {
                i.sendEnterRandom(this._userId),
                this._showMatching(),
                this.scheduleOnce(this._timeoutRandomAction, 5)
            },
            clickCancel: function() {
                i.sendCancelRandom(this._userId),
                this._hideMatching()
            },
            _timeoutRandomAction: function() {
                this._hideMatching(),
                this.showAlertMessage("进入匹配失败")
            },
            _showMatching: function() {
                var e = this.matchingNode.getComponent("alert");
                e.alert(),
                this.matchingLabel.string = "正在匹配中，请稍后...";
                var t = 0;
                this.schedule(function() {
                    t += .5,
                    this.timeNode.rotation = t
                },
                .01)
            },
            _hideMatching: function() {
                var e = this.matchingNode.getComponent("alert");
                e.dismissAction()
            },
            showNetworkMessage: function(e) {
                if (this.unschedule(this._timeoutRandomAction), null != this.networkNode) {
                    var t = cc.removeSelf();
                    this.networkNode.runAction(t),
                    this.networkNode = null
                }
                this.networkNode = cc.instantiate(this.waitingPrefab),
                this.node.addChild(this.networkNode);
                var n = this.networkNode.getComponent("alert"),
                i = this;
                n.onDismissComplete = function() {
                    i.networkNode = null
                },
                n.setMessage(e),
                n.alert()
            },
            hiddenNetworkMessage: function() {
                null != this.networkNode && this.networkNode.getComponent("alert").dismissAction()
            },
            showAlertMessage: function(e) {
                return e ? (this.alertMessageNode || (this.alertMessageNode = cc.instantiate(this.alertPrefab), this.node.addChild(this.alertMessageNode)), this.alertMessageNode.getComponent("alert").setMessage(e), void this.alertMessageNode.getComponent("alert").alert()) : void cc.error("不能显示为空的信息")
            }
        }),
        cc._RFpop()
    },
    {
        KQGlobalEvent: "KQGlobalEvent",
        socket: "socket"
    }],
    recordInfo: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "e1457gdvd5I5aENjKvCTkCd", "recordInfo");
        var i = e("socket"),
        o = e("Playback");
        cc.Class({
            "extends": cc.Component,
            properties: {
                timeLabel: cc.Label,
                nicknameLabels: [cc.Label],
                scoreLabels: [cc.Label],
                numNode: cc.Label,
                _parentId: null,
                playbackNode: cc.Node,
                watchNode: cc.Node,
                _recordItemInfo: null
            },
            onLoad: function() {},
            setInfo: function(e) {
                if (this._parentId = e.id, this.playbackNode.active = !1, this.watchNode.active = !0, 0 != e.playersInfo.length) {
                    var t = JSON.parse(e.playersInfo),
                    n = JSON.parse(e.scores);
                    this.timeLabel.string = "对战时间：" + e.createAt;
                    for (var i = 0; i < t.length; i++) this.nicknameLabels[i].string = t[i],
                    this.scoreLabels[i].string = n[i]
                }
            },
            clickAction: function() {
                return this._recordItemInfo ? void cc.log("点击了记录详情 item，开启回放") : void i.sendGetItemRecord(i.instance.userInfo.id, this._parentId)
            },
            _startPlayback: function(e) {
                o.instance.setPlaybackDatas(e),
                cc.director.loadScene("play")
            },
            detailAction: function(e, t) {
                this._recordItemInfo = e,
                this.playbackNode.active = !1,
                this.watchNode.active = !1,
                this.numNode.string = "第" + (t + 1) + "局",
                this.timeLabel.string = "对战时间：" + e.creatAt;
                for (var n = JSON.parse(e.info0), i = JSON.parse(e.info1), o = 0; o < n.length; o++) this.nicknameLabels[o].string = i[o],
                this.scoreLabels[o].string = n[o]
            }
        }),
        cc._RFpop()
    },
    {
        Playback: "Playback",
        socket: "socket"
    }],
    record: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "452f4rFUqRLFYlGEJS5kEWs", "record");
        var i = e("KQGlobalEvent"),
        o = e("socket");
        cc.Class({
            "extends": cc.Component,
            properties: {
                scrollView: cc.Node,
                subScrollView: cc.Node,
                recordItem: cc.Prefab,
                subRecordItem: cc.Prefab
            },
            onLoad: function() {
                this.isSubPage = !1,
                this.subScrollView.active = !1,
                this.scrollViewContent = this.scrollView.getComponent(cc.ScrollView).content,
                this.subScrollViewContent = this.subScrollView.getComponent(cc.ScrollView).content,
                this._registerSocketEvent()
            },
            _registerSocketEvent: function() {
                i.on(o.Event.GetRecord, this._ReceiveRecordInfo, this),
                i.on(o.Event.GetItemRecord, this._ReceiveRecordItem, this)
            },
            _ReceiveRecordInfo: function(e) {
                this.isSubPage = !1,
                this.subScrollView.active = !1,
                this.scrollView.active = !0,
                this.scrollViewContent.removeAllChildren(),
                e.data.filter(function(e) {
                    return e.playersInfo.length > 0
                }).forEach(function(e) {
                    var t = cc.instantiate(this.recordItem);
                    this.scrollViewContent.addChild(t);
                    var n = t.getComponent("recordInfo");
                    n.setInfo(e)
                }.bind(this))
            },
            _ReceiveRecordItem: function(e) {
                this.isSubPage = !0,
                this.subScrollView.active = !0,
                this.scrollView.active = !1,
                this.subScrollViewContent.removeAllChildren();
                for (var t = 0; t < e.data.length; t++) {
                    var n = cc.instantiate(this.recordItem);
                    this.subScrollViewContent.addChild(n);
                    var i = n.getComponent("recordInfo"),
                    o = e.data[t];
                    i.detailAction(o, t)
                }
            },
            closeAction: function() {
                this.isSubPage ? (this.isSubPage = !1, this.subScrollView.active = !1, this.scrollView.active = !0) : this.node.getComponent("alert").dismissAction()
            }
        }),
        cc._RFpop()
    },
    {
        KQGlobalEvent: "KQGlobalEvent",
        socket: "socket"
    }],
    rule: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "92f6eNs7RdDRJIRLCZnyulJ", "rule"),
        cc.Class({
            "extends": cc.Component,
            properties: {},
            onLoad: function() {},
            clickExit: function() {
                cc.director.loadScene("hall")
            }
        }),
        cc._RFpop()
    },
    {}],
    select_mapai: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "8e7e53kJcJK9rwMSxnloqI5", "select_mapai"),
        cc.Class({
            "extends": cc.Component,
            properties: {
                pai: cc.Node,
                mapai: {
                    "default": [],
                    type: cc.SpriteFrame
                }
            },
            onLoad: function() {
                this.singleSelect = this.node.getComponent("singleSelect"),
                this.singleSelect.onLoad(),
                this.com = this.pai.getComponent(cc.Sprite)
            },
            clickBtnComfirm: function() {
                this.com.spriteFrame = this.mapai[this.singleSelect.selectedIndex]
            }
        }),
        cc._RFpop()
    },
    {}],
    select: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "e913aIwAtVEo5jMrf40D5rw", "select"),
        cc.Class({
            "extends": cc.Component,
            properties: {
                bgNode: cc.Node,
                selectedNode: cc.Node,
                pai: cc.Node
            },
            onLoad: function() {
                this.selected = !0
            },
            clickAction: function() {
                this.selected = !this.selected,
                this.selectedNode.active = this.selected
            },
            setSelected: function(e) {
                this.selected = e,
                this.selectedNode.active = this.selected
            },
            clickSelectKuang: function() {
                this.selected = !this.selected,
                this.selectedNode.active = this.selected;
                var e = this.pai.getComponent(cc.Button);
                this.selectedNode.active === !1 ? e.interactable = !1 : e.interactable = !0
            }
        }),
        cc._RFpop()
    },
    {}],
    singleSelect: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "194a8h4vXFO+bXX92yzqbfq", "singleSelect"),
        cc.Class({
            "extends": cc.Component,
            properties: {
                nodes: [cc.Node],
                selectedIndex: 0
            },
            onLoad: function() {
                for (var e = this,
                t = 0; t < this.nodes.length; t++) {
                    var n = this.selectedIndex == t;
                    this.nodes[t].getComponent("select").setSelected(n)
                }
                for (var t = 0; t < this.nodes.length; t++) {
                    var i = this.nodes[t].getComponent("select");
                    i.index = t,
                    i.clickAction = function() {
                        for (var t = 0; t < e.nodes.length; t++) {
                            var n = e.nodes[t].getComponent("select");
                            n.setSelected(!1)
                        }
                        this.setSelected(!0),
                        e.selectedIndex = this.index,
                        e.onSelectChange(this.index)
                    }
                }
            },
            onSelectChange: function(e) {
                cc.log(e)
            }
        }),
        cc._RFpop()
    },
    {}],
    slider: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "1c921w7bEFKUIdNwItOX3oG", "slider"),
        cc.Class({
            "extends": cc.Component,
            properties: {
                indicatorNode: cc.Node,
                backgroundNode: cc.Node,
                selectedNode: cc.Node,
                value: 0
            },
            onLoad: function() {
                var e = this;
                this.indicatorNode.on(cc.Node.EventType.TOUCH_START,
                function(e) {}),
                this.indicatorNode.on(cc.Node.EventType.TOUCH_MOVE,
                function(t) {
                    var n = e.node.convertToNodeSpace(cc.v2(t.getLocationX(), t.getLocationY()));
                    e.updateSlider(n)
                }),
                this.indicatorNode.on(cc.Node.EventType.TOUCH_END,
                function(t) {
                    var n = e.node.convertToNodeSpace(cc.v2(t.getLocationX(), t.getLocationY()));
                    e.updateSlider(n)
                }),
                this.indicatorNode.on(cc.Node.EventType.TOUCH_CANCEL,
                function(t) {
                    var n = e.node.convertToNodeSpace(cc.v2(t.getLocationX(), t.getLocationY()));
                    e.updateSlider(n)
                }),
                this.maxWidth = this.node.width - 28,
                this.setValue(this.value)
            },
            updateSlider: function(e) {
                var t = e.x;
                t < 0 && (t = 0),
                t > this.maxWidth && (t = this.maxWidth),
                this.setValue(t / this.maxWidth),
                this.onValueChange(this.value)
            },
            setValue: function(e) {
                this.value = e,
                this.value < 0 && (this.value = 0),
                this.value > 1 && (this.value = 1),
                this.maxWidth = this.node.width - 28,
                this.indicatorNode.x = this.value * this.maxWidth + 10,
                this.selectedNode.width = this.value * this.maxWidth + this.indicatorNode.width / 2
            },
            onValueChange: function(e) {
                cc.log(e)
            }
        }),
        cc._RFpop()
    },
    {}],
    socket: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "cf75cLLNo1ETbJFrx/23i/H", "socket");
        var i = e("manager"),
        o = e("KQGlobalEvent"),
        a = e("KQNativeInvoke"),
        s = {
            MaxReconnectCheckInterval: 5
        },
        r = cc.Class({
            "extends": cc.Component,
            properties: {
                _lastReceiveMsgTime: 0,
                _timeout: 8
            },
            statics: {
                instance: null,
                url: "ws://119.29.106.40:5003"
            },
            onLoad: function() {
                r.instance = this,
                this.name = "socket",
                cc.game.addPersistRootNode(this.node),
                cc.game.isPersistRootNode(this.node) && cc.log("添加全局节点 Socket 成功"),
                this._registerAppActiveChange(),
                this.isCreating = !1,
                this.createIndex = 0,
                this.createSocket(),
                this.schedule(function() {
                    this.checkConnection()
                },
                5),
                this.recvTime = Date.now(),
                cc.log(i.version),
                this._checkSocket()
            },
            checkConnection: function() {
                this.sendMessage("checkAction", "")
            },
            createSocket: function() {
                var e = this;
                return this.createIndex++,
                this.createIndex > 5 ? (this.networkError(), void a.forceExitApp()) : (this.isCreating = !0, o.emit(r.Event.SocketConnecting), this.ws = new WebSocket(r.url), null === this.ws ? (this.networkError(), o.emit(r.Event.SocketConnectError, {
                    data: "Socket 创建失败"
                }), void a.forceExitApp()) : (this.socketError = !1, this.ws.onopen = function(t) {
                    e._lastReceiveMsgTime = cc.sys.now(),
                    o.emit(r.Event.SocketConnectSuccessed, t),
                    e.isCreating = !1,
                    e.socketError = !1,
                    e.createIndex = 0,
                    e.connectionSuccess(),
                    e.sendReconnectInfo()
                },
                this.ws.onmessage = function(t) {
                    e._lastReceiveMsgTime = cc.sys.now(),
                    o.emit(r.Event.SocketReceiveMessage, t.data),
                    e.isCreating = !1,
                    e.socketError = !1,
                    e.receviceMessage(t.data),
                    e._dispatchResponse(t.data),
                    e.recvTime = Date.now()
                },
                this.ws._kq_onerror = function(t) {
                    if (cc.error("WebSocket 连接错误：" + t), o.emit(r.Event.SocketConnectError, {
                        data: t
                    }), e.ws.close(), e.ws) {
                        var n = e.ws;
                        e.ws.onclose(),
                        n.onclose = function() {}
                    }
                },
                void(this.ws.onclose = function(t) {
                    cc.log("WebSocket 已关闭 close time=" + Date.now() + " event: " + t),
                    e.isCreating = !1,
                    e.socketError = !0,
                    e.ws = null,
                    e.connectionDisconnect(),
                    o.emit(r.Event.SocketDisconnect, t)
                })))
            },
            reconnect: function() {
                var e = this;
                this.scheduleOnce(function() { ! e.isCreating && e.socketError && e.createSocket()
                },
                2)
            },
            sendReconnectInfo: function() {
                var e = this;
                this.scheduleOnce(function() {
                    if (null != this.userInfo) {
                        var t = e.userInfo.user_id || e.userInfo.id;
                        e.sendMessage("reconnect", {
                            userId: t
                        })
                    }
                },
                1)
            },
            receviceMessage: function(e) {},
            connectionDisconnect: function() {},
            connectionSuccess: function() {},
            networkError: function() {},
            checkNetworkStart: function() {},
            checkNetworkEnd: function() {},
            _dispatchResponse: function(e) {
                var t = JSON.parse(e),
                n = t.action;
                n && o.emit(n, t),
                null != t.shareUrl && (cc.shareUrl = t.shareUrl)
            },
            _registerAppActiveChange: function() {
                cc.game.on(cc.game.EVENT_HIDE, this._appEnterBackground, this),
                cc.game.on(cc.game.EVENT_SHOW, this._appBecomActive, this)
            },
            _appEnterBackground: function() {
                var e = cc.sys.now();
                if (! (e - this._lastAppEnterBackgroundTime < 100)) {
                    this._lastAppEnterBackgroundTime = e;
                    var t = this.userInfo ? this.userInfo.id: void 0;
                    r.sendAppPause(t),
                    this._cancelCheckSocket()
                }
            },
            _appBecomActive: function() {
                var e = cc.sys.now();
                if (! (e - this._lastAppBecomActiveTime < 100)) {
                    this._lastAppBecomActiveTime = e;
                    var t = this.userInfo ? this.userInfo.id: void 0;
                    r.sendAppActive(t),
                    this._checkSocket(),
                    this.scheduleOnce(function() {
                        this._checkSocketExecute()
                    }.bind(this), 1.5)
                }
            },
            enterbackgroudAction: function() {
                this._appEnterBackground()
            },
            resumeAction: function() {
                this._checkNetwork(),
                this._appBecomActive()
            },
            sendMessage: function(e, t) {
                return t = this._strongVerifyData(t),
                this.socketError ? (cc.error("socket 连接错误：" + this.socketError), void this.reconnect()) : void(cc.sys.isObjectValid(this.ws) ? this.ws.readyState === WebSocket.OPEN && this.ws.send(this._convertParameterToString(e, t)) : this.connectionDisconnect())
            },
            _strongVerifyData: function() {
                var e = arguments.length <= 0 || void 0 === arguments[0] ? {}: arguments[0];
                return "string" == typeof e && (e = {
                    string: e
                }),
                null == e && (e = {}),
                e.userId || this.userInfo && "object" == typeof this.userInfo && this.userInfo.id && (e.userId = this.userInfo.id),
                e
            },
            _convertParameterToString: function(e) {
                var t = arguments.length <= 1 || void 0 === arguments[1] ? {}: arguments[1],
                n = {};
                return n.action = e,
                n.data = t,
                JSON.stringify(n)
            },
            _checkNetwork: function() {
                this.checkNetworkNow && this.checkNetworkNow(),
                this.shouldCheck = !0,
                this.socketError ? this.connectionDisconnect() : (this.recvTime = 0, this.sendMessage("checkAction", ""), this.scheduleOnce(function() {
                    this.checkNetworkEnd(),
                    this.shouldCheck = !1,
                    0 === this.recvTime && this.connectionDisconnect()
                },
                2.5))
            },
            _checkSocket: function() {
                this.schedule(this._checkSocketExecute, s.MaxReconnectCheckInterval, cc.macro.REPEAT_FOREVER)
            },
            _cancelCheckSocket: function() {
                this.unschedule(this._checkSocketExecute)
            },
            _checkSocketExecute: function() {
                if (this._isSocketTimeout() && this.ws) return void this.ws._kq_onerror("连接超时")
            },
            _isSocketTimeout: function() {
                return this._lastReceiveMessageInterval() >= this._timeout
            },
            _lastReceiveMessageInterval: function() {
                var e = cc.sys.now(),
                t = (e - this._lastReceiveMsgTime) / 1e3;
                return cc.log("WebSocket 现在距上一条收到消息的时间间隔是：" + t + " 秒"),
                t
            }
        });
        r.Event = {
            SocketConnecting: "SocketConnecting",
            SocketConnectSuccessed: "SocketConnectSuccessed",
            SocketDisconnect: "SocketDisconnect",
            SocketConnectError: "SocketConnectError",
            SocketReceiveMessage: "SocketReceiveMessage",
            InviteCode: "inviteCode",
            JoinDesk: "joinDesk",
            CreateDesk: "createDesk",
            LeaveDesk: "leaveDesk",
            DissolveDesk: "dissolveDesk",
            AnswerDissolve: "answerDissolve",
            GetDeskInfo: "getDeskInfo",
            SendImage: "sendImage",
            SendText: "sendText",
            SendAudioMessage: "sendAudioMessage",
            GetRecord: "getRecord",
            GetAgent: "getAgent",
            GetItemRecord: "getItemRecord",
            PlayCard: "playCard",
            TimeoutDissolve: "timeoutDissolve",
            Feedback: "feedback",
            EnterRandom: "interRandom",
            CancelRandom: "cancelRandom",
            ForceExitRandom: "dissolve",
            Ready: "ready",
            GetHallInfo: "getHallInfo",
            GetUserInfo: "getUserInfo",
            CheckAction: "checkAction",
            Pause: "pause",
            Active: "active",
            Piao: "piao",
            ReceiveSelectPiao: "pleaseSelectPiao",
            ReceivePlayerPiao: "piao",
            ReceiveRequestDissolve: "requestDissolve",
            ReceiveRequestDissolveResult: "requestDissolveResult",
            ReceiveChatText: "sendText",
            ReceiveDeskInfo: "deskInfo",
            ReceiveGameOver: "gameOver",
            ReceiveFaPai: "fapai",
            ReceiveOnlineStatus: "sendOnlineStatus",
            ReceiveAudioMessage: "sendAudioMessage",
            ReceivePlayCard: "playCard",
            ReceiveCreateDesk: "createDesk",
            ReceiveReady: "ready",
            ReceiveHallInfo: "getHallInfo",
            ReceiveGetUserInfo: "getUserInfo",
            ReceiveCheckAction: "checkAction",
            ReceiveForceExit: "forceExit",
            ReceiveDissolveDesk: "dissolveDesk",
            ReceiveInterRandom: "interRandom",
            ReceivePause: "pause",
            ReceiveLeaveDesk: "leaveDesk",
            ReceiveInviteCode: "inviteCode",
            ReceiveAgentInfo: "agentInfo"
        },
        r.sendCheckAction = function() {
            this.instance.sendMessage(this.Event.CheckAction, null)
        },
        r.sendDidReceiveGameOverAction = function(e) {
            var t = e ? {
                userId: e
            }: null;
            this.instance.sendMessage(r.Event.DidReceiveGameOverAction, t)
        },
        r.sendDissolveDesk = function(e) {
            cc.assert(e);
            var t = {
                userId: e
            };
            this.instance.sendMessage(this.Event.DissolveDesk, t)
        },
        r.sendAppPause = function(e) {
            var t = e ? {
                userId: e
            }: null;
            this.instance.sendMessage(this.Event.Pause, t)
        },
        r.sendAppActive = function(e) {
            var t = e ? {
                userId: e
            }: null;
            this.instance.sendMessage(this.Event.Active, t)
        },
        r.sendCreateDesk = function(e, t) {
            cc.assert(e),
            cc.assert(t),
            e.userId = t,
            this.instance.sendMessage(this.Event.CreateDesk, e)
        },
        r.sendJoinDesk = function(e, t) {
            cc.assert(e),
            cc.assert(t);
            var n = {
                roomId: e,
                userId: t
            };
            this.instance.sendMessage(this.Event.JoinDesk, n)
        },
        r.sendInviteCode = function(e, t) {
            cc.log(e),
            cc.log(t);
            var n = {
                inviteCode: e,
                userId: t
            };
            this.instance.sendMessage(this.Event.InviteCode, n)
        },
        r.sendGetDesckInfo = function(e) {
            cc.assert(e);
            var t = {
                userId: e
            };
            this.instance.sendMessage(this.Event.GetDeskInfo, t)
        },
        r.sendText = function(e, t) {
            cc.assert(e),
            cc.assert(t);
            var n = {
                msg: t,
                userId: e
            };
            this.instance.sendMessage(this.Event.SendText, n)
        },
        r.sendAudioMessage = function(e) {
            var t = arguments.length <= 1 || void 0 === arguments[1] ? "": arguments[1];
            if (cc.assert(e), cc.assert(t.length > 0), 0 != t.length) {
                var n = {
                    url: t,
                    userId: e
                };
                this.instance.sendMessage(this.Event.SendAudioMessage, n)
            }
        },
        r.sendImage = function(e, t) {
            cc.assert(e),
            cc.assert(t);
            var n = {
                msg: t,
                userId: e
            };
            this.instance.sendMessage(this.Event.SendImage, n)
        },
        r.sendGetRecrod = function(e) {
            cc.assert(e);
            var t = {
                userId: e
            };
            this.instance.sendMessage(this.Event.GetRecord, t)
        },
        r.sendGetAgent = function(e, t) {
            cc.assert(e);
            var n = {
                userId: e,
                inviteCode: t
            };
            this.instance.sendMessage(this.Event.GetAgent, n)
        },
        r.sendGetItemRecord = function(e, t) {
            cc.assert(e),
            cc.assert(t);
            var n = {
                userId: e,
                parentId: t
            };
            this.instance.sendMessage(this.Event.GetItemRecord, n)
        },
        r.sendLeaveDesk = function(e) {
            cc.assert(e);
            var t = {
                userId: e
            };
            this.instance.sendMessage(this.Event.LeaveDesk, t)
        },
        r.sendAnswerDissolve = function(e) {
            var t = arguments.length <= 1 || void 0 === arguments[1] ? 0 : arguments[1];
            cc.assert(e);
            var n = {
                userId: e,
                answer: t
            };
            this.instance.sendMessage(this.Event.AnswerDissolve, n)
        },
        r.sendForceExitRoom = function(e) {
            cc.assert(e);
            var t = {
                userId: e
            };
            this.instance.sendMessage(this.Event.DissolveDesk, t)
        },
        r.sendPlayCard = function(e, t) {
            cc.assert(e);
            var n = {
                userId: e,
                card: t
            };
            this.instance.sendMessage(this.Event.PlayCard, n)
        },
        r.sendTimeoutDissolve = function(e) {
            cc.assert(e);
            var t = {
                userId: e
            };
            this.instance.sendMessage(this.Event.TimeoutDissolve, t)
        },
        r.sendFeedback = function(e, t) {
            cc.assert(e),
            cc.assert(t);
            var n = {
                userId: e,
                text: t
            };
            this.instance.sendMessage(this.Event.Feedback, n)
        },
        r.sendEnterRandom = function(e) {
            cc.assert(e);
            var t = {
                userId: e
            };
            this.instance.sendMessage(this.Event.EnterRandom, t)
        },
        r.sendCancelRandom = function(e) {
            cc.assert(e);
            var t = {
                userId: e
            };
            this.instance.sendMessage(this.Event.CancelRandom, t)
        },
        r.sendReady = function(e) {
            cc.assert(e);
            var t = {
                userId: e
            };
            this.instance.sendMessage(this.Event.Ready, t)
        },
        r.sendPiao = function(e, t) {
            var n = {
                userId: e,
                piaoN: t
            };
            this.instance.sendMessage(this.Event.Piao, n)
        },
        r.sendGetHallInfo = function(e) {
            var t = {
                userId: e
            };
            this.instance.sendMessage(this.Event.GetHallInfo, t)
        },
        r.sendGetUserInfo = function(e, t) {
            var n = {
                userId: e,
                openId: t
            };
            this.instance.sendMessage(this.Event.GetUserInfo, n)
        },
        t.exports = r,
        cc._RFpop()
    },
    {
        KQGlobalEvent: "KQGlobalEvent",
        KQNativeInvoke: "KQNativeInvoke",
        manager: "manager"
    }],
    userInfo: [function(e, t, n) {
        "use strict";
        cc._RFpush(t, "e8d10xRGnJAn42wJsuC6aBi", "userInfo");
        var i = e("AudioManager"),
        o = e("Playback");
        cc.Class({
            "extends": cc.Component,
            properties: {
                spriteAvatar: cc.Sprite,
                labelNickname: cc.Label,
                labelScore: cc.Label,
                spriteOffline: cc.Sprite,
                voiceNode: cc.Node,
                homeRunNode: cc.Node,
                readyNode: cc.Node,
                shootNodes: [cc.Node],
                bankerNode: cc.Node
            },
            onLoad: function() {
                this.updateScore()
            },
            setReadyNodeVisible: function() {
                var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
                this.readyNode.active = 0 != e
            },
            updateScore: function() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                this.labelScore.string = "" + e
            },
            updateNickname: function() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "";
                this.labelNickname.string = e
            },
            updateAvatar: function(e) {
                e.endsWith("png") || e.endsWith("jpg") || e.endsWith("gif") || (e += ".png"),
                cc.loader.load(e,
                function(e, t) {
                    if (!e) {
                        var n = new cc.SpriteFrame(t);
                        this.spriteAvatar.spriteFrame = n
                    }
                }.bind(this))
            },
            setOfflineVisible: function() {
                var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
                o.instance.isPlaybacking() || (this.spriteOffline.node.active = e)
            },
            setIsBanker: function() {
                var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
                this.bankerNode.active = e
            },
            playShootAnimation: function() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
                t = this.shootNodes[e];
                t.active = !0;
                var n = t.getComponent(cc.Animation);
                n.play("shoot").on("finished",
                function() {
                    t.active = !1
                },
                this),
                i.instance.playDaQiang()
            },
            playBulletHoleAnimation: function() {
                var e = this.node.getChildByName("bulletHole");
                e.active = !0;
                var t = e.getComponent(cc.Animation);
                t.play("bulletHole").on("finished",
                function() {
                    e.active = !1
                },
                this)
            },
            playSpeakAnimation: function() {
                this.voiceNode.active = !0,
                this.scheduleOnce(function() {
                    this.voiceNode.active = !1
                }.bind(this), 4)
            },
            playHomeRunAimation: function() {
                var e = this.homeRunNode.getComponent("alert");
                e.alert(),
                this.scheduleOnce(function() {
                    this.homeRunNode.active = !1
                }.bind(this), 2)
            }
        }),
        cc._RFpop()
    },
    {
        AudioManager: "AudioManager",
        Playback: "Playback"
    }]
},
{},
["AudioManager", "CardPrefab", "CardTypeCombine", "CardTypeSprite", "ChatMessage", "MsgControl", "KQGlobalEvent", "ArrayExtension", "NumberExtension", "SpriteHelper", "StringExtension", "fecha", "KQCard", "KQCardColorsHelper", "KQCardFindTypeExtension", "KQCardPointsHelper", "KQCardResHelper", "KQCardScoreExtension", "KQCardSelectExtension", "UserModelHelper", "NetworkError", "ChatTextRecord", "CompareCards", "Countdown", "GameResult", "Player", "ResultItem", "TotalGameResult", "TotalGameResultItem", "UserSampleInfo", "Playback", "Setting", "KQGlabolSocketEventHander", "KQNativeInvoke", "alert", "cards", "cardsBack", "cellText", "choujiang", "game", "hall", "help", "inviteCode", "joinRoom", "launch", "login", "manager", "play", "product", "randRoom", "record", "recordInfo", "rule", "select", "select_mapai", "singleSelect", "slider", "socket", "userInfo"]);