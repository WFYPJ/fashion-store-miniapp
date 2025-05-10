// pages/category/list/list.js
import { fetchGoodsList } from '../../../services/good/fetchGoods'
const { MAIN_CATEGORIES, SUB_CATEGORY_MAP } = require('../../../utils/constants');

Page({
  data: {
    goods: [],
    mainCategory: '',
    subCategory: '',
    availableMainCategories: [],
    allSubCategories: [],
    subCategoryMap: SUB_CATEGORY_MAP
  },

  async onLoad(options) {
    const main = options.main || '';
    const sub = options.sub || '';
  
    let relatedMainCategories = MAIN_CATEGORIES;
    let allSubList = [];
  
    if (!main && sub) {
      // If only subcategory is passed (e.g. from homepage), find all matching main categories
      relatedMainCategories = MAIN_CATEGORIES.filter(main =>
        SUB_CATEGORY_MAP[main]?.includes(sub)
      );
  
      const merged = new Set();
      relatedMainCategories.forEach(main =>
        SUB_CATEGORY_MAP[main]?.forEach(s => merged.add(s))
      );
      allSubList = Array.from(merged);
    } else if (main) {
      // If main category is passed (e.g. from category page)
      allSubList = SUB_CATEGORY_MAP[main] || [];
    } else {
      relatedMainCategories = MAIN_CATEGORIES;
      allSubList = [];
    }
  
    this.setData({
      mainCategory: main,
      subCategory: sub,
      availableMainCategories: relatedMainCategories,
      allSubCategories: allSubList,
      subPickerRange: ['All'].concat(allSubList)
    });
  
    await this.loadFilteredGoods();
  },

  // Handle main category selection
  onMainPickerChange(e) {
    const index = e.detail.value;
    const selectedMain = this.data.availableMainCategories[index];
    const newSubList = this.data.subCategoryMap[selectedMain] || [];

    // Retain subcategory if it's still valid under new main category
    let newSub = '';
    if (this.data.subCategory && newSubList.includes(this.data.subCategory)) {
      newSub = this.data.subCategory;
    }
  
    this.setData({
      mainCategory: selectedMain,
      subCategory: newSub, 
      allSubCategories: newSubList,
      subPickerRange: ['All'].concat(newSubList)
    }, () => {
      this.loadFilteredGoods();
    });
  },

  // Handle subcategory selection
  onSubPickerChange(e) {
    const index = e.detail.value;
    const selectedSub = index === 0 ? '' : this.data.allSubCategories[index - 1];
  
    this.setData({
      subCategory: selectedSub
    }, () => {
      this.loadFilteredGoods();
    });
  },

  // Fetch and filter goods based on current selection
  async loadFilteredGoods() {
    wx.showLoading({ title: 'Loading...' });
    try {
      const allGoods = await fetchGoodsList();
      const { mainCategory, subCategory } = this.data;
  
      let filtered = allGoods;
  
      if (mainCategory && subCategory) {
        filtered = allGoods.filter(item =>
          item.categoryMain === mainCategory &&
          item.categorySub === subCategory
        );
      } else if (mainCategory) {
        filtered = allGoods.filter(item =>
          item.categoryMain === mainCategory
        );
      } else if (subCategory) {
        filtered = allGoods.filter(item =>
          item.categorySub === subCategory
        );
      }
  
      this.setData({ goods: filtered });
    } catch (err) {
      console.error('[list.js] Failed to fetch and filter goods:', err);
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