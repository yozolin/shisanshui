cc.Class({
    extends: cc.Component,

    properties: {
        labelTime: cc.Label,
        //timeNode: cc.Node,

        _callback: null,
    },

    // use this for initialization
    onLoad: function () {
        this.labelTime.string = "0";
    },

    /**
     * 开始倒计时
     * 
     * @param  {Number} time 时长
     * @param  {Function} callback 倒计时的回调
     */
    startCountdown: function(time, callback) {
        this.stop();
        this._callback = callback;

        this.node.active = true;
        this.labelTime.string = "" + time;
        this.schedule(this._countDown, 1, time);
        this.getComponent("time").setTime(time * 0.5)
    },

    stop: function() {
        this.unschedule(this._countDown);
        this.node.active = false;

        if (this._callback) {
            let isTimeout = Number(this.labelTime.string) <= 0;
            let callback = this._callback;
            this._callback = null;
            callback(isTimeout);
        }

        this._callback = null;
    },

    _countDown: function() {
        var time = Number(this.labelTime.string || "0");
        time = time - 1;

        if (time <= 0) {
            this.stop();
        }

        this.labelTime.string = String(time);
    },


});
