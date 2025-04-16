// pages/goods/details/index.js
Page({
  data: {
    product: null,
    sortedSizes: [] // 新增字段，用于按顺序展示尺码
  },

  async onLoad(options) {
    const id = options.id;
    const db = wx.cloud.database();
    const res = await db.collection('shangpin').doc(id).get();
    const data = res.data;

    // ✅ 加入这两行（原来的主子分类处理）
    data.categoryMain = data['categoryMain'];
    data.categorySub = data['categorySub'];

    // ✅ 排序尺码
    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const sortedSizes = sizeOrder.filter(size => (data.sizes || []).includes(size));

    console.log('🐛 商品详情数据:', data);
    console.log('✅ 原始 data.sizes 是：', data.sizes);

    const mergedImages = [data.primaryImage, ...(data.images || []).filter(url => url !== data.primaryImage)];
    const mergedDesc = [
      ...mergedImages,
      ...(data.desc || []).filter(url => !mergedImages.includes(url))
    ];

    // ✅ 设置数据
    this.setData({
      product: data,
      sortedSizes,
      mergedImages,
      mergedDesc
    });
  },

  onContact() {
    wx.previewImage({
      urls: ['https://fzdtest-1350382597.cos.ap-nanjing.myqcloud.com/basic/wechat.png']
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