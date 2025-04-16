Page({
  data: {
    mainCategories: ['女士', '男士', '中老年', '青少年', '内衣'],
    currentIndex: 0,
    subCategoryMap: {
      女士: [
        { name: '短袖T恤', icon: '/images/aduanxiu.jpg' },
        { name: '衬衫', icon: '/images/achenshan.jpg' },
        { name: '卫衣', icon: '/images/aweiyi.jpg' },
        { name: '毛衣', icon: '/images/amaoyi.jpg' },
        { name: '连衣裙', icon: '/images/alianyiqun.jpg' },
        { name: '外套', icon: '/images/awaitao.jpg' },
        { name: '西装', icon: '/images/axizhuang.jpg' },
        { name: '风衣', icon: '/images/afengyi.jpg' },
        { name: '半身裙', icon: '/images/abanshenqun.jpg' },
        { name: '裤子', icon: '/images/akuzi.jpg' },
        { name: '羽绒服', icon: '/images/ayurongfu.jpg' }
      ],
      男士: [
        { name: '短袖T恤', icon: '/images/bduanxiu.jpg' },
        { name: '衬衫', icon: '/images/bchenshan.jpg' },
        { name: '卫衣', icon: '/images/bweiyi.jpg' },
        { name: '毛衣', icon: '/images/bmaoyi.jpg' },
        { name: '夹克', icon: '/images/bjiake.jpg' },
        { name: '西装', icon: '/images/bxizhuang.jpg' },
        { name: '外套', icon: '/images/bwaitao.jpg' },
        { name: '裤子', icon: '/images/bkuzi.jpg' },
        { name: '羽绒服', icon: '/images/byurongfu.jpg' },
      ],
      中老年: [
        { name: '短袖T恤', icon: '/images/cduanxiu.jpg' },
        { name: '衬衫', icon: '/images/cchenshan.jpg' },
        { name: '毛衣', icon: '/images/cmaoyi.jpg' },
        { name: '开衫', icon: '/images/ckaishan.jpg' },
        { name: '棉衣', icon: '/images/cmianyi.jpg' },
        { name: '裤子', icon: '/images/ckuzi.jpg' },
        { name: '羽绒服', icon: '/images/cyurongfu.jpg' }
      ],
      青少年: [
        { name: '短袖T恤', icon: '/images/dduanxiu.jpg' },
        { name: '卫衣', icon: '/images/dweiyi.jpg' },
        { name: '连帽衫', icon: '/images/dlianmaoshan.jpg' },
        { name: '毛衣', icon: '/images/dmaoyi.jpg' },
        { name: '运动裤', icon: '/images/dyundongku.jpg' },
        { name: '牛仔裤', icon: '/images/dniuzaiku.jpg' },
        { name: '外套', icon: '/images/dwaitao.jpg' },
        { name: '羽绒服', icon: '/images/dyurongfu.jpg' }
      ],
      内衣: [
        { name: '内裤', icon: '/images/eneiku.jpg' },
        { name: '保暖内衣', icon: '/images/ebaonuanneiyi.jpg' },
        { name: '睡衣', icon: '/images/eshuiyi.jpg' },
      ]
    },
    subCategories: []
  },

  onLoad() {
    this.setData({
      subCategories: this.data.subCategoryMap[this.data.mainCategories[0]]
    });
  },
  onClickSubCategory(e) {
    const sub = e.currentTarget.dataset.sub;
    const main = this.data.mainCategories[this.data.currentIndex]; // 获取当前主分类
    wx.navigateTo({
      url: `/pages/category/list/list?main=${main}&sub=${sub}`
    });
  },

  onSelectMainCategory(e) {
    const index = e.currentTarget.dataset.index;
    const selected = this.data.mainCategories[index];
    this.setData({
      currentIndex: index,
      subCategories: this.data.subCategoryMap[selected]
    });
  }
});