const KQNativeInvoke = require('KQNativeInvoke');
cc.Class({
    extends: cc.Component,

    properties: {
        itemLayout: cc.Layout,
        itemPrefab: cc.Prefab,
    },

    // use this for initialization
    onLoad: function () {
    },

    setPlayerInfos: function (playerInfos, deskInfo) {
        this.itemLayout.node.removeAllChildren();
      playerInfos.forEach(function (user) {
        let item = cc.instantiate(this.itemPrefab);
        item.getComponent('TotalGameResultItem').setUserInfo(user, deskInfo);

        this.itemLayout.node.addChild(item);
      }.bind(this));
    },

    clickShareWeiChat: function () {
      if (KQNativeInvoke.isNativeIOS()) {
          jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName,"wxScreenShareFriend",);
      }
      else {//Android
          KQNativeInvoke.screenshotShare();
      }
    },

    clickSharePengYouQuan: function () {
      if (KQNativeInvoke.isNativeIOS()) {
          jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName,"wxScreenShare",);
      }
      else {//Android
          jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "wxScreenShare", "()V");
      }
    },
});
