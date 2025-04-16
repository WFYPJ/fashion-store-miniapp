// pages/category/list/list.js
import { fetchGoodsList } from '../../../services/good/fetchGoods'

Page({
  data: {
    goods: [],
    mainCategory: '',
    subCategory: ''
  },

  async onLoad(options) {
    const main = options.main; // ⬅️ 主分类
    const sub = options.sub;   // ⬅️ 子分类

    console.log('🔍 接收到的主分类:', main, '子分类:', sub);

    this.setData({
      mainCategory: main,
      subCategory: sub
    });

    wx.showLoading({ title: '加载中' });

    try {
      const allGoods = await fetchGoodsList();
      console.log('📦 所有商品:', allGoods);

      // ✅ 精准匹配：主分类 + 子分类
      const filtered = allGoods.filter(item =>
        item.categoryMain === main &&
        item.categorySub === sub
      );
      console.log('✅ 过滤后的商品:', filtered);

      this.setData({ goods: filtered });
    } catch (err) {
      console.error('❌ 获取商品失败:', err);
    } finally {
      wx.hideLoading();
    }
  },

  onClickGoods(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/goods/details/index?id=${id}`,
    });
  }
});