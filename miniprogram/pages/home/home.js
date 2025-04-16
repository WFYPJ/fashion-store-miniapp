import { fetchGoodsList } from '../../services/good/fetchGoods';
Page({
  data: {
    bannerList: [
      'https://fzdtest-1350382597.cos.ap-nanjing.myqcloud.com/basic/banner-store.png',
      'https://fzdtest-1350382597.cos.ap-nanjing.myqcloud.com/basic/banner-promo.png',
      'https://fzdtest-1350382597.cos.ap-nanjing.myqcloud.com/basic/banner-new.png'
    ],
    goodsList: [],
    isAdmin: false 
  },

  async onLoad() {
    try {
      // 调用云函数 getopenid，获取 openid 和是否为管理员
      const res = await wx.cloud.callFunction({
        name: 'getopenid'
      });
  
      const { openid, isAdmin } = res.result;
      console.log('✅ 当前 openid:', openid);
      console.log('✅ 是否为管理员:', isAdmin);
  
      // 设置是否显示“进入管理页面”按钮
      this.setData({ isAdmin });
  
    } catch (err) {
      console.error('❌ 获取 openid 失败:', err);
    }
  
    // 加载商品列表
    const list = await fetchGoodsList();
    this.setData({
      goodsList: list
    });
  },

  onClickGoods(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/goods/details/index?id=${id}`,
    });
  },
  goToAdmin() {
    wx.navigateTo({
      url: '/pages/admin/index'
    });
  },
  goToCheckboxDemo() {
    wx.navigateTo({
      url: '/pages/demo-checkbox/demo-checkbox'
    });
  },
  // 轮播图不跳转，直接去掉这个函数也可以
  // onClickBanner(e) {
  //   // 不跳转
  // }
});