(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/time.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '458d4VWlwNDT6xQ+pFW8Bby', 'time', __filename);
// scripts/time.js

"use strict";

cc.Class({
        extends: cc.Component,

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

                this.scheduleOnce(function () {

                        this.RigthNode.runAction(cc.rotateBy(this._time, 180));
                }.bind(this), this._time);
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
        //# sourceMappingURL=time.js.map
        