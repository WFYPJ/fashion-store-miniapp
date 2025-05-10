// pages/home/index.js
import { fetchGoodsList } from '../../services/good/fetchGoods';
const { COS_URL_PREFIX } = require('../../utils/config');

Page({
  data: {
    bannerList: [],
    goodsList: [],  
    categoryNavList: [
      { id: 'tshirt', name: 'T-shirt', icon: '/icons/tshirt.jpg' },
      { id: 'shirt', name: 'Shirt', icon: '/icons/shirt.jpg' },
      { id: 'dress', name: 'Dress', icon: '/icons/dress.jpg' },
      { id: 'pants', name: 'Pants', icon: '/icons/pants.jpg' },
      { id: 'pajamas', name: 'Pajamas', icon: '/icons/pajamas.jpg' },
      { id: 'skirt', name: 'Skirt', icon: '/icons/skirt.jpg' },
      { id: 'briefs', name: 'Briefs', icon: '/icons/underwear.jpg' }
    ]
  },

  async onLoad() {
    //Set banner images
    const banners = [
      `${COS_URL_PREFIX}/basic/welcome.png`,
      `${COS_URL_PREFIX}/basic/sale.png`,
      `${COS_URL_PREFIX}/basic/new.png`
    ];
    this.setData({ bannerList: banners });
  
    // Fetch product list
    const list = await fetchGoodsList();
  
    // Get latest 4 products
    const newArrivals = [...list]
    .filter(item => !!item.createdAt)
    .sort((a, b) =>  new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);
  console.log('🧪 newArrivals:', newArrivals);
  
    // Get 4 random recommended products
    function getRandomItems(arr, count) {
      const shuffled = [...arr];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled.slice(0, count);
    }
    const recommended = getRandomItems(list, 4);
  
    // Update page data
    this.setData({
      goodsList: list,
      newArrivals,
      recommended
    });
  },

  //Navigate to product list page with selected subcategory
  onClickCategory(e) {
    const { name } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/category/list/list?sub=${encodeURIComponent(name)}`
    });
  },

  // Navigate to product details page
  onClickGoods(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/goods/details/index?id=${id}`,
    });
  },

  // Navigate to admin panel
  goToAdmin() {
    wx.navigateTo({
      url: '/pages/admin/index'
    });
  },

  //Navigate to full new arrivals list
  goToMoreNew() {
    wx.navigateTo({
      url: '/pages/category/list/list?sort=new'
    });
  },
  
  // Navigate to full recommended list
  goToMoreRecommend() {
    wx.navigateTo({
      url: '/pages/category/list/list?sort=recommend'
    });
  }
});