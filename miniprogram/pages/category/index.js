// pages/category/index.js
const { MAIN_CATEGORIES, SUB_CATEGORY_MAP } = require('../../utils/constants');
Page({
  data: {
    // Main categories displayed as tabs
    mainCategories: MAIN_CATEGORIES,
    currentIndex: 0, // Index of currently selected main category
    // Mapping of subcategories with icons for each main category
    subCategoryMap: {
      Women: [
        { name: 'T-shirt', icon: '/images/aduanxiu.jpg' },
        { name: 'Shirt', icon: '/images/achenshan.jpg' },
        { name: 'Sweatshirt', icon: '/images/aweiyi.jpg' },
        { name: 'Sweater', icon: '/images/amaoyi.jpg' },
        { name: 'Dress', icon: '/images/alianyiqun.jpg' },
        { name: 'Coat', icon: '/images/awaitao.jpg' },
        { name: 'Suit', icon: '/images/axizhuang.jpg' },
        { name: 'Trench', icon: '/images/afengyi.jpg' },
        { name: 'Skirt', icon: '/images/abanshenqun.jpg' },
        { name: 'Pants', icon: '/images/akuzi.jpg' },
        { name: 'Down', icon: '/images/ayurongfu.jpg' }
      ],
      Men: [
        { name: 'T-shirt', icon: '/images/bduanxiu.jpg' },
        { name: 'Shirt', icon: '/images/bchenshan.jpg' },
        { name: 'Sweatshirt', icon: '/images/bweiyi.jpg' },
        { name: 'Sweater', icon: '/images/bmaoyi.jpg' },
        { name: 'Jacket', icon: '/images/bjiake.jpg' },
        { name: 'Suit', icon: '/images/bxizhuang.jpg' },
        { name: 'Coat', icon: '/images/bwaitao.jpg' },
        { name: 'Pants', icon: '/images/bkuzi.jpg' },
        { name: 'Down', icon: '/images/byurongfu.jpg' },
      ],
      Seniors: [
        { name: 'T-shirt', icon: '/images/cduanxiu.jpg' },
        { name: 'Shirt', icon: '/images/cchenshan.jpg' },
        { name: 'Sweater', icon: '/images/cmaoyi.jpg' },
        { name: 'Cardigan', icon: '/images/ckaishan.jpg' },
        { name: 'Puffer', icon: '/images/cmianyi.jpg' },
        { name: 'Pants', icon: '/images/ckuzi.jpg' },
        { name: 'Down', icon: '/images/cyurongfu.jpg' }
      ],
      Teens: [
        { name: 'T-shirt', icon: '/images/dduanxiu.jpg' },
        { name: 'Sweatshirt', icon: '/images/dweiyi.jpg' },
        { name: 'Hoodie', icon: '/images/dlianmaoshan.jpg' },
        { name: 'Sweater', icon: '/images/dmaoyi.jpg' },
        { name: 'Sweatpants', icon: '/images/dyundongku.jpg' },
        { name: 'Jeans', icon: '/images/dniuzaiku.jpg' },
        { name: 'Coat', icon: '/images/dwaitao.jpg' },
        { name: 'Down', icon: '/images/dyurongfu.jpg' }
      ],
      Underwear: [
        { name: 'Briefs', icon: '/images/eneiku.jpg' },
        { name: 'Thermals', icon: '/images/ebaonuanneiyi.jpg' },
        { name: 'Pajamas', icon: '/images/eshuiyi.jpg' },
      ]
    },
    subCategories: []  // Subcategories under selected main category
  },

  // Triggered when the page loads
  onLoad() {
    this.setData({
      subCategories: this.data.subCategoryMap[this.data.mainCategories[0]]
    });
  },

  // Triggered when a subcategory is clicked
  onClickSubCategory(e) {
    const sub = e.currentTarget.dataset.sub;
    const main = this.data.mainCategories[this.data.currentIndex]; 
    wx.navigateTo({
      url: `/pages/category/list/list?main=${main}&sub=${sub}`
    });
  },
   
  // Triggered when a main category is selected
  onSelectMainCategory(e) {
    const index = e.currentTarget.dataset.index;
    const selected = this.data.mainCategories[index];
    this.setData({
      currentIndex: index,
      subCategories: this.data.subCategoryMap[selected]
    });
  }
});