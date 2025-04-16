// pages/admin/index.js
Page({
  goToAddProduct() {
    wx.navigateTo({
      url: '/pages/admin/add'
    });
  },
  goToGoodsList() {
    wx.navigateTo({
      url: '/pages/admin/goods-list'
    });
  },
  goToHome() {
    wx.setStorageSync('shouldRefreshHome', true); // 如果首页需要刷新的标记
    wx.reLaunch({
      url: '/pages/home/home'
    });
  }
});