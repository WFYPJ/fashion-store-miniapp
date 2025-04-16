import { fetchAllGoods } from '../../services/good/fetchGoods';

Page({
  data: {
    goods: [],
    mainCategories: ['女士', '男士', '中老年', '青少年', '内衣'],
    subCategoryMap: {
      女士: ['短袖T恤', '衬衫', '卫衣', '毛衣', '外套', '裤子', '半身裙','连衣裙', '西装', '风衣', '羽绒服'],
      男士: ['短袖T恤', '衬衫', '卫衣', '毛衣',  '夹克','西装', '外套', '裤子','羽绒服' ],
      中老年: ['短袖T恤', '衬衫', '毛衣',  '开衫','棉衣', '裤子', '羽绒服'],
      青少年: ['短袖T恤', '卫衣', '连帽衫','毛衣', '运动裤', '牛仔裤', '外套', '羽绒服'],
      内衣: ['内裤', '保暖内衣','睡衣']
    },
    subCategories: [],
    selectedMainCategory: '',
    selectedSubCategory: ''
  },

  async onLoad() {
    const defaultMain = this.data.mainCategories[0];
    this.setData({
      selectedMainCategory: defaultMain,
      subCategories: this.data.subCategoryMap[defaultMain],
      selectedSubCategory: '全部'
    }, this.loadGoods);
  },

  async loadGoods() {
    wx.showLoading({ title: '加载中' });
    try {
      const allGoods = await fetchAllGoods(); // 使用结构已调整的商品数据

      const { selectedMainCategory, selectedSubCategory } = this.data;
      let filtered = allGoods;

      if (selectedMainCategory) {
        filtered = filtered.filter(item => item.categoryMain === selectedMainCategory);
      }
      if (selectedSubCategory && selectedSubCategory !== '全部') {
        filtered = filtered.filter(item => item.categorySub === selectedSubCategory);
      }

      this.setData({ goods: filtered });
    } catch (err) {
      console.error('❌ 加载失败:', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
    } finally {
      wx.hideLoading();
    }
  },

  onMainCategoryChange(e) {
    const main = this.data.mainCategories[e.detail.value];
    this.setData({
      selectedMainCategory: main,
      subCategories: this.data.subCategoryMap[main],
      selectedSubCategory: '全部'
    }, this.loadGoods);
  },

  onSubCategoryChange(e) {
    const sub = this.data.subCategories[e.detail.value];
    this.setData({
      selectedSubCategory: sub
    }, this.loadGoods);
  },

  onClickGoods(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/goods/details/index?id=${id}`,
    });
  },

  onEdit(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/admin/edit?id=${id}`
    });
  },

  onShow() {
    const shouldRefresh = wx.getStorageSync('shouldRefreshGoodsList');
    if (shouldRefresh) {
      this.loadGoods(); // ✅ 自动刷新商品列表
      wx.removeStorageSync('shouldRefreshGoodsList');
    }
  },

  onDelete(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '删除后不可恢复，确定删除该商品？',
      success: async res => {
        if (res.confirm) {
          try {
            const db = wx.cloud.database();
            await db.collection('shangpin').doc(id).remove();
            wx.showToast({ title: '删除成功' });
            this.loadGoods();
          } catch (err) {
            console.error('❌ 删除失败:', err);
            wx.showToast({ title: '删除失败', icon: 'none' });
          }
        }
      }
    });
  }
});