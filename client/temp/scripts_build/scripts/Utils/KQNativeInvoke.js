"use strict";
cc._RFpush(module, '7327dLBqWVNaJ14fJQ4jq6Y', 'KQNativeInvoke');
// scripts\Utils\KQNativeInvoke.js

var KQNativeInvoke = {
  IOSClassName: "AppController",
  ANDRIODClassName: "com/gongpa/ssz/AppActivity",

  isNativeIOS: function isNativeIOS() {
    var platform = cc.sys.platform;
    if (platform == cc.sys.IPHONE || platform == cc.sys.IPAD) {
      return true;
    }
    return false;
  },

  isNativeAndroid: function isNativeAndroid() {
    var platform = cc.sys.platform;
    if (platform == cc.sys.ANDROID) {
      return true;
    }
    return false;
  },

  isNative: function isNative() {
    return cc.sys.isNative == true;
  }
};

// MARK: 可调用的本地方法
/**
 * 微信登录
 */
KQNativeInvoke.wxLogin = function () {
  if (!KQNativeInvoke.isNative()) {
    return;
  }

  if (KQNativeInvoke.isNativeIOS()) {
    jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "wxLogin"); //IOS
  } else if (KQNativeInvoke.isNativeAndroid()) {
      //Android
      jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "wxLogin", "()V");
    }
};

/**
 * 分享大厅信息到微信好友
 * 
 */
KQNativeInvoke.shareHallToWeChatFriend = function () {
  if (!KQNativeInvoke.isNative()) {
    return;
  }

  if (KQNativeInvoke.isNativeIOS()) {
    jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "wxShareHallFriend");
  } else {
    //Android
    jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "wxShareHallFriend", "()V");
  }
};

/**
 * 分享大厅信息到朋友圈
 * 
 */
KQNativeInvoke.shareHallToWeChatTimeline = function () {
  if (!KQNativeInvoke.isNative()) {
    return;
  }

  if (KQNativeInvoke.isNativeIOS()) {
    jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "wxShareHallTimeline");
  } else {
    //Android
    jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "wxShareHallTimeline", "()V");
  }
};

/**
 * 强制退出 APP
 * 
 */
KQNativeInvoke.forceExitApp = function () {
  if (!KQNativeInvoke.isNative()) {
    return;
  }

  if (KQNativeInvoke.isNativeIOS()) {
    jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "exitApp");
  } else {
    //Android
    jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "exitApp", "()V");
  }
};

/**
 * 下载新版本
 * 
 * @param {String} iosUrl      iOS 版本地址
 * @param {String} androidUrl  安卓版本地址
 */
KQNativeInvoke.downloadNewVersion = function (iosUrl, androidUrl) {
  if (KQNativeInvoke.isNativeIOS()) {
    jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "downloadNewVersion:", iosUrl);
  } else {
    //Android
    jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "downloadNewVersion", "(Ljava/lang/String;)V", androidUrl);
  }
};

/**
 * 分享房间给微信好友
 * 
 * @param {String} roomId         房间 id 信息
 * @param {String} description    文本描述
 */
KQNativeInvoke.shareRoomToWeChatFriend = function (roomId, description) {
  if (KQNativeInvoke.isNativeIOS()) {
    jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "wxShareFriend:description:", id, description, title);
  } else if (KQNativeInvoke.isNativeAndroid()) {
    //Android
    jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "wxShareFriend", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", id, description, title);
  }
};

/**
 * 分享房间到微信朋友圈
 * 
 * @param {String} roomId         房间 id 信息
 * @param {String} description    文本描述
 */
KQNativeInvoke.shareRoomToWeChatTimeline = function (roomId, description) {
  if (KQNativeInvoke.isNativeIOS()) {
    jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "wxShare:description:", id, description, title);
  } else if (KQNativeInvoke.isNativeAndroid()) {
    //Android
    jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "wxShare", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", id, description, title);
  }
};

/**
 * 分享屏幕截图到微信好友
 */
KQNativeInvoke.shareScreenToWeChatFriend = function () {
  if (KQNativeInvoke.isNativeIOS()) {
    jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "wxScreenShareFriend");
  } else {
    //Android
    jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "wxScreenShareFriend", "()V");
  }
};

/**
 * 分享屏幕截图到微信朋友圈
 */
KQNativeInvoke.shareScreenToWeChatTimeline = function () {
  if (KQNativeInvoke.isNativeIOS()) {
    jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "wxScreenShare");
  } else {
    //Android
    jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "wxScreenShare", "()V");
  }
};

/**
 * 开始录音
 */
KQNativeInvoke.startRecord = function () {
  if (!KQNativeInvoke.isNative()) {
    return;
  }

  if (KQNativeInvoke.isNativeIOS()) {
    jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "record");
  } else if (KQNativeInvoke.isNativeAndroid()) {
    jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "record", "()V");
  }
};

/**
 * 结束录音
 */
KQNativeInvoke.endRecord = function () {
  if (!KQNativeInvoke.isNative()) {
    return;
  }

  if (KQNativeInvoke.isNativeIOS()) {
    jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "endRecord");
  } else if (KQNativeInvoke.isNativeAndroid()) {
    jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "endRecord", "()V");
  }
};

KQNativeInvoke.screenshotShare = function () {
  var strings = arguments.length <= 0 || arguments[0] === undefined ? 'shareIMG' : arguments[0];

  if (this._isCapturing) {
    return;
  }
  this._isCapturing = true;
  var size = cc.director.getWinSize();
  var fileName = "result_share.jpg";
  var fullPath = jsb.fileUtils.getWritablePath() + fileName;
  if (jsb.fileUtils.isFileExist(fullPath)) {
    jsb.fileUtils.removeFile(fullPath);
  }
  var texture = new cc.RenderTexture(Math.floor(size.width), Math.floor(size.height), cc.IMAGE_FORMAT_PNG, gl.DEPTH24_STENCIL8_OES);
  texture.setPosition(cc.p(size.width / 2, size.height / 2));
  texture.begin();
  cc.director.getRunningScene().visit();
  texture.end();
  texture.saveToFile(fileName, cc.IMAGE_FORMAT_PNG);

  var self = this;
  var tryTimes = 0;
  var fn = function fn() {
    if (jsb.fileUtils.isFileExist(fullPath)) {

      if (cc.sys.os == cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod(self.ANDRIODClassName, strings, "(Ljava/lang/String;)V", fullPath);
      }
      self._isCapturing = false;
    } else {
      tryTimes++;
      if (tryTimes > 10) {
        console.log("time out...");
        return;
      }
      setTimeout(fn, 50);
    }
  };
  setTimeout(fn, 50);
};

/**
 * 播放网络语音
 * 
 * @param {String} audioUrl 语音地址
 */
KQNativeInvoke.playAudioWithUrl = function (audioUrl) {
  if (!KQNativeInvoke.isNative()) {
    return;
  }

  if (KQNativeInvoke.isNativeIOS()) {
    jsb.reflection.callStaticMethod(KQNativeInvoke.IOSClassName, "playUrl:", audioUrl);
  } else if (KQNativeInvoke.isNativeAndroid()) {
    //Android
    jsb.reflection.callStaticMethod(KQNativeInvoke.ANDRIODClassName, "playUrl", "(Ljava/lang/String;)V", audioUrl);
  }
};

module.exports = KQNativeInvoke;

cc._RFpop();