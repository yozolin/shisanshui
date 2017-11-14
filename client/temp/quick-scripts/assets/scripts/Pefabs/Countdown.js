(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Pefabs/Countdown.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '6406dyBk8tKVrlJ1+mg7cLt', 'Countdown', __filename);
// scripts/Pefabs/Countdown.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        labelTime: cc.Label,
        //timeNode: cc.Node,

        _callback: null
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.labelTime.string = "0";
    },

    /**
     * 开始倒计时
     * 
     * @param  {Number} time 时长
     * @param  {Function} callback 倒计时的回调
     */
    startCountdown: function startCountdown(time, callback) {
        this.stop();
        this._callback = callback;

        this.node.active = true;
        this.labelTime.string = "" + time;
        this.schedule(this._countDown, 1, time);
        this.getComponent("time").setTime(time * 0.5);
    },

    stop: function stop() {
        this.unschedule(this._countDown);
        this.node.active = false;

        if (this._callback) {
            var isTimeout = Number(this.labelTime.string) <= 0;
            var callback = this._callback;
            this._callback = null;
            callback(isTimeout);
        }

        this._callback = null;
    },

    _countDown: function _countDown() {
        var time = Number(this.labelTime.string || "0");
        time = time - 1;

        if (time <= 0) {
            this.stop();
        }

        this.labelTime.string = String(time);
    }

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
        //# sourceMappingURL=Countdown.js.map
        