import { fetchAllGoods } from '../../services/good/fetchGoods';
const { MAIN_CATEGORIES, SUB_CATEGORY_MAP } = require('../../utils/constants');

Page({
  data: {
    goods: [],
    mainCategories: MAIN_CATEGORIES,
    subCategoryMap: SUB_CATEGORY_MAP,
    subCategories: [],
    selectedMainCategory: '',
    selectedSubCategory: ''
  },

  async onLoad() {
    const defaultMain = this.data.mainCategories[0];
    this.setData({
      selectedMainCategory: defaultMain,
      subCategories: this.data.subCategoryMap[defaultMain],
      selectedSubCategory: 'All'
    }, this.loadGoods);
  },

  async loadGoods() {
    wx.showLoading({ title: 'Loading...' });
    try {
      const allGoods = await fetchAllGoods(); 

      const { selectedMainCategory, selectedSubCategory } = this.data;
      let filtered = allGoods;

      if (selectedMainCategory) {
        filtered = filtered.filter(item => item.categoryMain === selectedMainCategory);
      }
      if (selectedSubCategory && selectedSubCategory !== 'All') {
        filtered = filtered.filter(item => item.categorySub === selectedSubCategory);
      }

      this.setData({ goods: filtered });
    } catch (err) {
      wx.showToast({ title: 'Failed to load', icon: 'none' });
    } finally {
      wx.hideLoading();
    }
  },

  onMainCategoryChange(e) {
    const main = this.data.mainCategories[e.detail.value];
    this.setData({
      selectedMainCategory: main,
      subCategories: this.data.subCategoryMap[main],
      selectedSubCategory: 'All'
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
      this.loadGoods(); 
      wx.removeStorageSync('shouldRefreshGoodsList');
    }
  },

  onDelete(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) {
      wx.showToast({ title: 'Invalid ID', icon: 'none' });
      return;
    }
    wx.showModal({
      title: 'Confirm delete',
      content: 'This action cannot be undone. Proceed?',
      success: async res => {
        if (res.confirm) {
          try {
            const db = wx.cloud.database();
            await db.collection('products').doc(id).remove();
            wx.showToast({ title: 'Deleted' });
            this.loadGoods();
          } catch (err) {
            console.error('❌ Failed to delete product:', err);
            wx.showToast({ title: 'Delete failed', icon: 'none' });
          }
        }
      }
    });
  }
});