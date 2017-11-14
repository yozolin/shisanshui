"use strict";
cc._RFpush(module, '4a47fj0J/VHup24OT7njkko', 'manager');
// scripts\manager.js

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

cc._RFpop();