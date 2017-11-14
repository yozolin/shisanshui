module.exports = {
    version:'v1.0.0',

    setUserInfo:function(str) {
        cc.sys.localStorage.setItem('userinfo', str);
    },

    getUserInfo:function() {
        var value = cc.sys.localStorage.getItem('userinfo');
        if (!value) {
            return "";
        }
        return value;
    },

    setMusicValue:function(value) {
        cc.sys.localStorage.setItem('musicVolumn',value);
    },

    getMusicValue:function() {
        var value = cc.sys.localStorage.getItem('musicVolumn');
        if (!value) {
            return 1;
        }
        return value;
    },

    setMusicEffectValue:function(value) {
        cc.sys.localStorage.setItem('musicEffectVolumn',value);
    },

    getMusicEffectValue:function() {
        var value = cc.sys.localStorage.getItem('musicEffectVolumn');
        if (!value) {
            return 1;
        }
        return value;
    },
};
