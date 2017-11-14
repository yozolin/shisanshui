(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/NetworkError.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c99d35Sy6hDPbrte9nVczxP', 'NetworkError', __filename);
// scripts/NetworkError.js

'use strict';

var manager = require('manager');
var KQNativeInvoke = require('KQNativeInvoke');

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function onLoad() {},

    exitAction: function exitAction() {
        cc.director.end();
        if (KQNativeInvoke.isNativeIOS()) {
            jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "exitApp");
        } else {
            //Android
            jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "exitApp", "()V");
        }
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
        //# sourceMappingURL=NetworkError.js.map
        