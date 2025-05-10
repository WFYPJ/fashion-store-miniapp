// pages/admin/index.js
Page({
  // Navigate to add product page
  goToAddProduct() {
    wx.navigateTo({
      url: '/pages/admin/add'
    });
  },
  // Navigate to product management page
  goToGoodsList() {
    wx.navigateTo({
      url: '/pages/admin/goods-list'
    });
  },
  // Relaunch homepage (set flag to refresh on return)
  goToHome() {
    wx.setStorageSync('shouldRefreshHome', true); 
    wx.reLaunch({
      url: '/pages/home/home'
    });
  }
});