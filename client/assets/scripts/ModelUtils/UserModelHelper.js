const UserModelHelper = {
  // 用户是否已出牌
  isPlayedCards: function (user) {
    cc.assert(user);

    if (user && user.cardInfo && user.cardInfo.length > 0) {
      return true;
    }

    return false;
  },

  // 用户是否已准备
  isUserReady: function (user) {
    return user.readyStatus == true;
  },
};

module.exports = UserModelHelper;
