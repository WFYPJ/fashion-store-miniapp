// pages/store/index.js
const { COS_URL_PREFIX } = require('../../utils/config');

Page({
  data: {
    COS_URL_PREFIX,
    isAdmin: false
  },

  async onLoad(){
    try {
      const res = await wx.cloud.callFunction({ name: 'getopenid' });
      const { isAdmin } = res.result;
      this.setData({ isAdmin });
    } catch (err) {
      console.error('❌ Failed to get openid:', err);
    }
  },

  onContact() {
    wx.previewImage({
      urls: [`${COS_URL_PREFIX}/basic/wechat.png`]
    });
  },

  goToAdmin() {
    wx.navigateTo({
      url: '/pages/admin/index'
    });
  },

  onShareAppMessage() {
    return {
      title: 'Check out this fashion store!',
      path: '/pages/store/index'
    };
  }
})