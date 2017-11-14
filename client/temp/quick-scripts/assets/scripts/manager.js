(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/manager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '4a47fj0J/VHup24OT7njkko', 'manager', __filename);
// scripts/manager.js

'use strict';

module.exports = {
    version: 'v1.0.0',

    setUserInfo: function setUserInfo(str) {
        cc.sys.localStorage.setItem('userinfo', str);
    },

    getUserInfo: function getUserInfo() {
        var value = cc.sys.localStorage.getItem('userinfo');
        if (!value) {
            return "";
        }
        return value;
    },

    setMusicValue: function setMusicValue(value) {
        cc.sys.localStorage.setItem('musicVolumn', value);
    },

    getMusicValue: function getMusicValue() {
        var value = cc.sys.localStorage.getItem('musicVolumn');
        if (!value) {
            return 1;
        }
        return value;
    },

    setMusicEffectValue: function setMusicEffectValue(value) {
        cc.sys.localStorage.setItem('musicEffectVolumn', value);
    },

    getMusicEffectValue: function getMusicEffectValue() {
        var value = cc.sys.localStorage.getItem('musicEffectVolumn');
        if (!value) {
            return 1;
        }
        return value;
    }
};

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
        //# sourceMappingURL=manager.js.map
        