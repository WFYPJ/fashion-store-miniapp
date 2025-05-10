// pages/goods/details/index.js
const { COS_URL_PREFIX } = require('../../../utils/config');

Page({
  data: {
    product: null,
    sortedSizes: [],
    COS_URL_PREFIX
  },

  async onLoad(options) {
    const id = options.id;
    const db = wx.cloud.database();
    const res = await db.collection('products').doc(id).get();
    if (!res.data) {
      wx.showToast({ title: 'Product not found', icon: 'none' });
      return;
    }
    const data = res.data;

    data.categoryMain = data['categoryMain'];
    data.categorySub = data['categorySub'];

    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const sortedSizes = sizeOrder.filter(size => (data.sizes || []).includes(size));

    const mergedImages = [data.primaryImage, ...(data.images || []).filter(url => url !== data.primaryImage)];
    const mergedDesc = [
      ...mergedImages,
      ...(data.desc || []).filter(url => !mergedImages.includes(url))
    ];

    this.setData({
      product: data,
      sortedSizes,
      mergedImages,
      mergedDesc
    });
  },

  onContact() {
    wx.previewImage({
      urls: [`${COS_URL_PREFIX}/basic/wechat.png`]
    });
  },

  goBack() {
    wx.navigateBack();
  },

  goToCategory() {
    wx.reLaunch({
      url: '/pages/category/index'
    });
  },

  goToHome() {
    wx.reLaunch({
      url: '/pages/home/home'
    });
  }
});