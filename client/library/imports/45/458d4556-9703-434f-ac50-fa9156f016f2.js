cc.Class({
        "extends": cc.Component,

        properties: {
                leftNode: cc.Node,
                RigthNode: cc.Node,
                _time: null
        },

        // use this for initialization
        onLoad: function onLoad() {},

        setTime: function setTime(time) {

                this.unscheduleAllCallbacks();

                this._time = time;

                this.leftNode.rotation = 0;

                this.RigthNode.rotation = 0;

                this.RigthNode.stopAllActions();

                this.leftNode.stopAllActions();

                this.leftNode.runAction(cc.rotateBy(this._time, -180));

                this.scheduleOnce((function () {

                        this.RigthNode.runAction(cc.rotateBy(this._time, 180));
                }).bind(this), this._time);
        }

});