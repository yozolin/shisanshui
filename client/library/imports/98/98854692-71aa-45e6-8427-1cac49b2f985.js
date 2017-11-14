var UserModelHelper = {
  // 用户是否已出牌
  isPlayedCards: function isPlayedCards(user) {
    cc.assert(user);

    if (user && user.cardInfo && user.cardInfo.length > 0) {
      return true;
    }

    return false;
  },

  // 用户是否已准备
  isUserReady: function isUserReady(user) {
    return user.readyStatus == true;
  }
};

module.exports = UserModelHelper;