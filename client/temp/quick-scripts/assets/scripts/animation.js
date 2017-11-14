(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/animation.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c9ee9y0ua5NRLSZAxQqDjdw', 'animation', __filename);
// scripts/animation.js

"use strict";

/**
 *  房间特殊牌动画
 *
 *
 *
 * 
 */
cc.Class({
    extends: cc.Component,

    properties: {
        fapaiNode: cc.Prefab, //
        liuduiban: cc.Prefab,
        santonghua: cc.Prefab,
        sanshunzi: cc.Prefab,
        quanleida: cc.Prefab,
        qinglong: cc.Prefab
    },

    // use this for initialization
    onLoad: function onLoad() {},
    fapaiAnimation: function fapaiAnimation() {
        var fapai = this.node.getChildByName('fapai');
        fapai = cc.removeSelf();
        var fapaiAnim = cc.instantiate(this.fapaiNode);
        this.node.addChild(fapaiAnim);

        var Lgun = fapaiAnim.getChildByName("left_gang"); // 左边的抢
        var Rgun = fapaiAnim.getChildByName("right_gang"); // 右边的抢
        var mask = fapaiAnim.getChildByName("mask");
        /* -----------start及子节点----------- */
        var start = fapaiAnim.getChildByName("start"),
            quan = start.getChildByName("quan"),
            baodian = start.getChildByName("baodian"),
            ditan = start.getChildByName("ditan"),
            beginIco = start.getChildByName("begin_icon"),
            title = start.getChildByName("title"),
            rWing = start.getChildByName("rWing"),
            lWing = start.getChildByName("lWing");
        /* --------------------------------- */
        var self = this;
        fapaiAnim.active = true;
        mask.runAction(cc.scaleTo(0.2, 10, 10));
        Lgun.runAction(cc.sequence(self.LgunAction()));
        Rgun.runAction(cc.sequence(self.RgunAction()));

        var startFinished = cc.callFunc(function () {
            rWing.active = true;
            lWing.active = true;
            lWing.runAction(cc.sequence(cc.repeat(cc.sequence(cc.skewTo(0.05, 20, -10), cc.skewTo(0.05, 0, 0)), 3), cc.fadeOut(0)));
            rWing.runAction(cc.sequence(cc.repeat(cc.sequence(cc.skewTo(0.05, 20, -10), cc.skewTo(0.05, 0, 0)), 3), cc.fadeOut(0)));
        });
        var wingFinished = cc.callFunc(function () {
            setTimeout(function () {
                start.runAction(cc.scaleTo(0.2, 0, 0));
            }, 500);
        });
        setTimeout(function () {
            start.active = true;
            start.runAction(cc.sequence(cc.scaleTo(0.2, 1.5, 1.5), cc.scaleTo(0.2, 1, 1), startFinished, wingFinished));
            quan.runAction(cc.sequence(cc.scaleTo(0.2, 10, 10), cc.fadeOut(0)));
            baodian.runAction(cc.sequence(cc.scaleTo(0.2, 1.5, 1.5), cc.fadeOut(0)));
        }, 400);
        setTimeout(function () {
            lWing.active = false;
            rWing.active = false;
            start.active = false;
            fapaiAnim.active = false;
            fapaiAnim.removeFromParent(true);
        }, 2000);
    },
    LgunAction: function LgunAction() {
        // 左边的枪
        return [cc.spawn([cc.moveTo(0.2, cc.v2(-430, 152)), cc.scaleTo(0.2, 2, 2)]), cc.spawn([cc.fadeTo(0.2, 255), cc.moveTo(0.2, cc.v2(-220, 0)), cc.rotateTo(0.2, 35)]), cc.fadeOut(0)];
    },
    RgunAction: function RgunAction() {
        // 右边的枪
        return [cc.spawn([cc.moveTo(0.2, cc.v2(430, 152)), cc.scaleTo(0.2, -2, 2)]), cc.spawn([cc.fadeTo(0.2, 255), cc.moveTo(0.2, cc.v2(220, 0)), cc.rotateTo(0.2, -35)]), cc.fadeOut(0)];
    },
    _bezier1: function _bezier1(index) {
        var bezier = [];
        bezier[0] = [[cc.v2(100, 74), cc.v2(150, 174), cc.v2(200, -174)], cc.v2(100, 74)];
        bezier[1] = [[cc.v2(-72, 284), cc.v2(-122, 384), cc.v2(-222, -150)], cc.v2(-72, 284)];
        bezier[2] = [[cc.v2(-70, 200), cc.v2(-120, 300), cc.v2(-220, -200)], cc.v2(-70, 200)];
        bezier[3] = [[cc.v2(-123, 213), cc.v2(-173, 313), cc.v2(-273, -160)], cc.v2(-123, 213)];
        bezier[4] = [[cc.v2(110, 237), cc.v2(160, 337), cc.v2(260, -177)], cc.v2(210, 237)];
        bezier[5] = [[cc.v2(183, 115), cc.v2(233, 215), cc.v2(333, -155)], cc.v2(183, 115)];
        bezier[6] = [[cc.v2(92, 116), cc.v2(142, 216), cc.v2(242, -146)], cc.v2(92, 116)];
        bezier[7] = [[cc.v2(-26, 124), cc.v2(-76, 224), cc.v2(-176, -164)], cc.v2(-26, 124)];
        bezier[8] = [[cc.v2(-110, 81), cc.v2(-220, 131), cc.v2(-460, -180)], cc.v2(-110, 81)];
        bezier[9] = [[cc.v2(-125, 33), cc.v2(-225, 133), cc.v2(-275, -133)], cc.v2(-125, 33)];
        bezier[10] = [[cc.v2(0, 0), cc.v2(50, 100), cc.v2(150, -150)], cc.v2(0, 0)];
        bezier[11] = [[cc.v2(-235, 5), cc.v2(-275, 105), cc.v2(-375, -186)], cc.v2(-235, 5)];
        bezier[12] = [[cc.v2(-80, 4), cc.v2(-130, 104), cc.v2(-230, -233)], cc.v2(-80, 4)];
        bezier[13] = [[cc.v2(100, -7), cc.v2(150, 107), cc.v2(250, -177)], cc.v2(100, -7)];
        bezier[14] = [[cc.v2(154, 23), cc.v2(204, 113), cc.v2(254, -173)], cc.v2(254, 23)];
        return bezier[index];
    },
    // 青龙动画
    _qinglongAniamtion: function _qinglongAniamtion(type) {
        var qinglong = cc.instantiate(this.qinglong);
        this.node.addChild(qinglong);
        var bg = qinglong.getChildByName('bg');
        var title = '';
        if (type == "ql") {
            title = qinglong.getChildByName('qlongtitle');
        } else {
            title = qinglong.getChildByName('longtitle');
        }

        var yun1 = qinglong.getChildByName('yun1');
        var yun2 = qinglong.getChildByName('yun2');
        var yun3 = qinglong.getChildByName('yun3');
        var yun4 = qinglong.getChildByName('yun4');
        var long = qinglong.getChildByName("long");

        var hua1 = qinglong.getChildByName('hua1');
        var hua2 = qinglong.getChildByName('hua2');
        var hua3 = qinglong.getChildByName('hua3');
        var A = [],
            B = [],
            C = [];
        var hua = [];

        var test = cc.instantiate(hua1);

        var self = this;
        for (var i = 0; i < 5; i++) {
            A[i] = cc.instantiate(hua1);
            A[i].runAction(cc.fadeTo(0.1, 255));
            hua.push(A[i]);
            B[i] = cc.instantiate(hua2);
            B[i].runAction(cc.fadeTo(0.1, 255));
            hua.push(B[i]);
            C[i] = cc.instantiate(hua3);
            C[i].runAction(cc.fadeTo(0.1, 255));
            hua.push(C[i]);
        };
        var bgFinished = cc.callFunc(function () {
            title.runAction(cc.sequence(cc.spawn(cc.scaleTo(0.2, 1, 1), cc.fadeTo(0.2, 255)), cc.scaleTo(0.2, 2, 2), cc.spawn(cc.scaleTo(0.2, 1.5, 1.5), longStart)));
        });
        var longStart = cc.callFunc(function () {
            long.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.2, 255), cc.scaleTo(0.2, 0.5)), cc.scaleTo(0.1, 3, 3), cc.spawn(cc.scaleTo(0.1, 1, 1), yunStart)));
        });
        var flowerStart = cc.callFunc(function () {});
        var yunStart = cc.callFunc(function () {
            yun1.runAction(cc.spawn(cc.fadeTo(0.2, 255), cc.repeat(cc.sequence(cc.moveTo(0.2, cc.v2(-334, 234)), cc.moveTo(0.2, cc.v2(-344, 234))), 3)));
            yun2.runAction(cc.spawn(cc.fadeTo(0.2, 255), cc.repeat(cc.sequence(cc.moveTo(0.2, cc.v2(-368, -82)), cc.moveTo(0.2, cc.v2(-358, -82))), 3)));
            yun3.runAction(cc.spawn(cc.fadeTo(0.2, 255), cc.repeat(cc.sequence(cc.moveTo(0.2, cc.v2(408, -4)), cc.moveTo(0.2, cc.v2(398, -4))), 3)));
            yun4.runAction(cc.spawn(cc.fadeTo(0.2, 255), cc.repeat(cc.sequence(cc.moveTo(0.2, cc.v2(406, 181)), cc.moveTo(0.2, cc.v2(416, 181))), 3)));
            for (var i = 1; i < hua.length; i++) {
                hua[i].setPosition(self._bezier(i)[1]);
                qinglong.addChild(hua[i]);
                hua[i].runAction(cc.sequence(cc.spawn(cc.bezierTo(0.3, self._bezier(i)[0]), cc.scaleTo(0.3, 1, 1), cc.fadeTo(0.3, 0))));
            }
            setTimeout(function () {
                qinglong.removeFromParent(true);
            }, 1500);
            //yun1
        });
        bg.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.4, 255), cc.scaleTo(0.4, 30, 30)), bgFinished));
        title.runAction(cc.scaleTo(0.2, 2, 2));
    },
    // 三顺子动画
    _sanshunziAnimation: function _sanshunziAnimation() {
        var sanshunzi = cc.instantiate(this.sanshunzi);
        this.node.addChild(sanshunzi);
        var bg = sanshunzi.getChildByName('bg');
        var Ltu = sanshunzi.getChildByName('Ltu');
        var Rtu = sanshunzi.getChildByName('Rtu');
        var title = sanshunzi.getChildByName('title');
        var zushun1 = sanshunzi.getChildByName('zushun1');
        var zushun2 = sanshunzi.getChildByName('zushun2');
        var zushun3 = sanshunzi.getChildByName('zushun3');
        var zushun4 = sanshunzi.getChildByName('zushun4');
        var zushun5 = sanshunzi.getChildByName('zushun5');
        var self = this;
        var bgFinished = cc.callFunc(function () {
            title.runAction(cc.sequence(cc.spawn(cc.scaleTo(0.2, 1, 1), cc.fadeTo(0.2, 255)), titleFinished));
        });
        var titleFinished = cc.callFunc(function () {
            title.runAction(cc.sequence(cc.scaleTo(0.2, 2.5, 2.5), titleScale));
            Ltu.runAction(cc.sequence(cc.fadeTo(0.2, 255)));
            Rtu.runAction(cc.sequence(cc.fadeTo(0.2, 255)));
        });
        var titleScale = cc.callFunc(function () {
            // title放大完成后 竹笋2和3同时进行
            title.runAction(cc.scaleTo(0.2, 1.5, 1.5));
            zushun2.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.2, 255), cc.scaleTo(0.2, 12, 12)), cc.scaleTo(0.2, 10, 10), ZS1));
            zushun3.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.2, 255), cc.scaleTo(0.2, 22, 22)), cc.scaleTo(0.2, 20, 20), ZS4));
            setTimeout(function () {
                zushun5.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.2, 255), cc.scaleTo(0.2, 12, 12)), cc.scaleTo(0.2, 10, 10)));
            }, 100);
            setTimeout(function () {
                self.sanshunzi.active = false;
                sanshunzi.removeFromParent(true);
            }, 2000);
        });
        var ZS1 = cc.callFunc(function () {
            zushun1.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.2, 255), cc.scaleTo(0.2, 12, 12)), cc.scaleTo(0.2, 10, 10)));
        });
        var ZS4 = cc.callFunc(function () {
            zushun4.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.2, 255), cc.scaleTo(0.2, 14, 14)), cc.scaleTo(0.2, 12, 12)));
        });
        bg.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.4, 255), cc.scaleTo(0.4, 30, 30)), bgFinished));
        title.runAction(cc.scaleTo(0.2, 2, 2));
    },
    // 全垒打
    _quanleidaAnimation: function _quanleidaAnimation() {
        var quanleida = cc.instantiate(this.quanleida);
        this.node.addChild(quanleida);
        var bg = quanleida.getChildByName('bg');
        var ball = quanleida.getChildByName('ball');
        var bangqiutao = quanleida.getChildByName('bangqiutao');
        var bangqiugun = quanleida.getChildByName('bangqiugun');
        var Lyun = quanleida.getChildByName('Lyun');
        var Ryun = quanleida.getChildByName('Ryun');
        var title = quanleida.getChildByName('title');
        var bgFinished = cc.callFunc(function () {
            title.runAction(cc.sequence(cc.spawn(cc.scaleTo(0.2, 1, 1), cc.fadeTo(0.2, 255)), titleFinished));
        });
        var titleFinished = cc.callFunc(function () {
            title.runAction(cc.sequence(cc.scaleTo(0.2, 2.5, 2.5), cc.scaleTo(0.2, 1.5, 1.5), cc.repeat(cc.sequence(cc.moveTo(0.3, cc.v2(0, 20)), cc.moveTo(0.3, cc.v2(0, 0))), 2)));

            Lyun.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.2, 255), cc.scaleTo(0.2, 20, 20), cc.moveTo(0.2, cc.v2(-270, 70))), cc.repeat(cc.sequence(cc.moveTo(0.3, cc.v2(-270, 26)), cc.moveTo(0.3, cc.v2(-270, 46))), 2)));

            Ryun.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.2, 255), cc.scaleTo(0.2, 20, 20), cc.moveTo(0.2, cc.v2(270, 70))), cc.repeat(cc.sequence(cc.moveTo(0.3, cc.v2(270, 66)), cc.moveTo(0.3, cc.v2(270, 46))), 2)));

            bangqiutao.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.2, 255), cc.scaleTo(0.3, 10, 10), cc.moveTo(0.3, cc.v2(250, 50))), bqtFinished));
        });
        var bqtFinished = cc.callFunc(function () {
            bangqiutao.runAction(cc.repeat(cc.sequence(cc.rotateTo(0.2, -10), cc.rotateTo(0.2, 0)), 3));
            ball.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.1, 255), cc.moveTo(0.2, cc.v2(196, 83))), ballFinished));
        });
        var ballFinished = cc.callFunc(function () {
            ball.runAction(cc.spawn(cc.fadeTo(0.2, 0), cc.moveTo(0.2, cc.v2(0, 0)), cc.scaleTo(0.2, 4, 4)));
            bangqiugun.runAction(cc.sequence(cc.spawn(cc.scaleTo(0.2, 2, 2), cc.fadeTo(0.2, 255)), cc.scaleTo(0.3, 1.5, 1.5)));
            setTimeout(function () {
                bg.runAction(cc.fadeTo(0.2, 0));
                ball.runAction(cc.fadeTo(0.2, 0));
                bangqiutao.runAction(cc.fadeTo(0.2, 0));
                bangqiugun.runAction(cc.fadeTo(0.2, 0));
                Lyun.runAction(cc.fadeTo(0.2, 0));
                Ryun.runAction(cc.fadeTo(0.2, 0));
                title.runAction(cc.fadeTo(0.2, 0));

                quanleida.removeFromParent(true);
            }, 2000);
        });
        bg.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.4, 255), cc.scaleTo(0.4, 30, 30)), bgFinished));
        title.runAction(cc.sequence(cc.scaleTo(0.2, 2, 2)));
    },

    // 三同花动画
    _santonghuaAnimation: function _santonghuaAnimation() {
        var santonghua = cc.instantiate(this.santonghua);
        this.node.addChild(santonghua);
        var bg = santonghua.getChildByName('bg');
        var hua1 = santonghua.getChildByName('hua1');
        var hua2 = santonghua.getChildByName('hua2');
        var hua3 = santonghua.getChildByName('hua3');
        var Rtaohua = santonghua.getChildByName('Rtaohua');
        var Ltaohua = santonghua.getChildByName('Ltaohua');
        var title = santonghua.getChildByName('title');
        var self = this;
        //var H1 = cc.instantiate(hua1);
        var A = [],
            B = [],
            C = [];
        var hua = [];
        for (var i = 0; i < 5; i++) {
            A[i] = cc.instantiate(hua1);
            A[i].runAction(cc.fadeTo(0.1, 255));
            hua.push(A[i]);
            B[i] = cc.instantiate(hua2);
            B[i].runAction(cc.fadeTo(0.1, 255));
            hua.push(B[i]);
            C[i] = cc.instantiate(hua3);
            C[i].runAction(cc.fadeTo(0.1, 255));
            hua.push(C[i]);
        };
        var bgFinished = cc.callFunc(function () {
            title.runAction(cc.sequence(cc.spawn(cc.scaleTo(0.2, 1, 1), cc.fadeTo(0.2, 255)), cc.scaleTo(0.2, 1, 1), titleFinished));
        });
        var titleFinished = cc.callFunc(function () {
            title.runAction(cc.sequence(cc.scaleTo(0.1, 1.8, 1.8)));
            Ltaohua.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.2, 255), cc.scaleTo(0.2, 3, 3), cc.moveTo(0.2, cc.v2(-160, -60)))));
            Rtaohua.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.2, 255), cc.scaleTo(0.2, 3, 3), cc.moveTo(0.2, cc.v2(140, -60)))));
            for (var i = 1; i < hua.length; i++) {
                hua[i].setPosition(self._bezier(i)[1]);
                santonghua.addChild(hua[i]);
                hua[i].runAction(cc.sequence(cc.spawn(cc.bezierTo(0.3, self._bezier(i)[0]), cc.scaleTo(0.3, 1, 1), cc.fadeTo(0.3, 0))));
            }
            setTimeout(function () {
                bg.runAction(cc.fadeTo(0.2, 0));
                Rtaohua.runAction(cc.fadeTo(0.2, 0));
                Ltaohua.runAction(cc.fadeTo(0.2, 0));
                title.runAction(cc.fadeTo(0.2, 0));
                santonghua.removeFromParent(true);
            }, 1500);
        });
        bg.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.3, 255), cc.scaleTo(0.3, 30, 30)), bgFinished));
        title.runAction(cc.sequence(cc.scaleTo(0.2, 2, 2)));
    },
    // 贝塞尔曲线(只能定三个点)
    _bezier: function _bezier(index) {
        var bezier = [];
        bezier[0] = [[cc.v2(200, 74), cc.v2(250, 124), cc.v2(400, -174)], cc.v2(200, 74)];
        bezier[1] = [[cc.v2(-72, 284), cc.v2(-122, 334), cc.v2(-272, -150)], cc.v2(-72, 284)];
        bezier[2] = [[cc.v2(-270, 300), cc.v2(-320, 350), cc.v2(-420, -200)], cc.v2(-270, 300)];
        bezier[3] = [[cc.v2(-223, 213), cc.v2(-273, 263), cc.v2(-373, -160)], cc.v2(-223, 213)];
        bezier[4] = [[cc.v2(210, 237), cc.v2(260, 287), cc.v2(360, -177)], cc.v2(210, 237)];
        bezier[5] = [[cc.v2(183, 115), cc.v2(233, 164), cc.v2(333, -155)], cc.v2(183, 115)];
        bezier[6] = [[cc.v2(92, 116), cc.v2(142, 166), cc.v2(242, -146)], cc.v2(92, 116)];
        bezier[7] = [[cc.v2(-26, 124), cc.v2(-76, 174), cc.v2(-176, -164)], cc.v2(-26, 124)];
        bezier[8] = [[cc.v2(-310, 81), cc.v2(-360, 131), cc.v2(-460, -180)], cc.v2(-310, 81)];
        bezier[9] = [[cc.v2(-125, 33), cc.v2(-175, 83), cc.v2(-275, -133)], cc.v2(-125, 33)];
        bezier[10] = [[cc.v2(0, 0), cc.v2(50, 50), cc.v2(150, -150)], cc.v2(0, 0)];
        bezier[11] = [[cc.v2(-235, 5), cc.v2(-275, 55), cc.v2(-375, -86)], cc.v2(-235, 5)];
        bezier[12] = [[cc.v2(-80, 4), cc.v2(-130, 54), cc.v2(-230, -233)], cc.v2(-80, 4)];
        bezier[13] = [[cc.v2(100, -7), cc.v2(150, 57), cc.v2(250, -177)], cc.v2(100, -7)];
        bezier[14] = [[cc.v2(254, 23), cc.v2(304, 73), cc.v2(404, -173)], cc.v2(254, 23)];
        return bezier[index];
    },

    // 六对半动画
    _liuduibanAnimation: function _liuduibanAnimation() {
        var liuduiban = cc.instantiate(this.liuduiban);
        this.node.addChild(liuduiban);
        var bg = liuduiban.getChildByName('bg');
        var Lqi = liuduiban.getChildByName('Lqi');
        var Rqi = liuduiban.getChildByName('Rqi');
        var Cqi = liuduiban.getChildByName('Cqi');
        var Rtaohua = liuduiban.getChildByName('Rtaohua');
        var Ltaohua = liuduiban.getChildByName('Ltaohua');
        var title = liuduiban.getChildByName('title');

        var bgFinished = cc.callFunc(function () {
            title.runAction(cc.sequence(cc.spawn(cc.scaleTo(0.2, 1, 1), cc.fadeTo(0.2, 255)), titleFinished));
        });
        var titleFinished = cc.callFunc(function () {
            title.runAction(cc.sequence(cc.scaleTo(0.1, 2.5, 2.5), cc.scaleTo(0.1, 1.8, 1.8), Finished));
            Ltaohua.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.2, 255), cc.scaleTo(0.2, 3, 3), cc.moveTo(0.2, cc.v2(-160, -60)))));
            Rtaohua.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.2, 255), cc.scaleTo(0.2, 3, 3), cc.moveTo(0.2, cc.v2(140, -60)))));
        });
        var Finished = cc.callFunc(function () {
            Lqi.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.2, 255), cc.moveTo(0.2, cc.v2(-103, 158))), cc.moveTo(0.2, cc.v2(-103, 168)), cc.moveTo(0.2, cc.v2(-103, 158))));
            Rqi.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.2, 255), cc.moveTo(0.2, cc.v2(133, 160))), cc.moveTo(0.2, cc.v2(133, 170)), cc.moveTo(0.2, cc.v2(133, 160))));
            setTimeout(function () {
                Cqi.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.2, 255), cc.moveTo(0.2, cc.v2(20, 96))), cc.moveTo(0.2, cc.v2(20, 106)), cc.moveTo(0.2, cc.v2(20, 96))));
                Ltaohua.runAction(cc.sequence(cc.repeat(cc.sequence(cc.rotateTo(0.3, 10), cc.rotateTo(0.3, 0)), 2), thFinished));
                Rtaohua.runAction(cc.repeat(cc.sequence(cc.rotateTo(0.3, -10), cc.rotateTo(0.3, 0)), 2));
            }, 500);
        });
        var thFinished = cc.callFunc(function () {
            bg.runAction(cc.fadeTo(0.2, 0));
            Lqi.runAction(cc.fadeTo(0.2, 0));
            Rqi.runAction(cc.fadeTo(0.2, 0));
            Cqi.runAction(cc.fadeTo(0.2, 0));
            Rtaohua.runAction(cc.fadeTo(0.2, 0));
            Ltaohua.runAction(cc.fadeTo(0.2, 0));
            title.runAction(cc.fadeTo(0.2, 0));
            liuduiban.removeFromParent(true);
        });
        bg.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.4, 255), cc.scaleTo(0.4, 30, 30)), bgFinished));
        title.runAction(cc.sequence(cc.scaleTo(0.2, 2, 2)));
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=animation.js.map
        