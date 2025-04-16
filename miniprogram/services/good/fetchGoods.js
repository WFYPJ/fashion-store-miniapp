// ✅ 给前台页面使用（如首页、分类页）—— 只看上架的商品
export async function fetchGoodsList() {
  return fetchGoods({ onlyOnSale: true });
}

// ✅ 给后台管理页面使用 —— 查看所有商品，包括未上架的
export async function fetchAllGoods() {
  return fetchGoods({ onlyOnSale: false });
}

// ✅ 通用底层函数
async function fetchGoods({ onlyOnSale = true } = {}) {
  try {
    const db = wx.cloud.database();
    const query = db.collection('shangpin');
    const res = onlyOnSale 
      ? await query.where({ isPutOnSale: true }).orderBy('createdAt', 'desc').get()
      : await query.get();

    const goodsList = res.data;
    const finalList = goodsList.map((item) => ({
      _id: item._id,
      title: item.title,
      thumb: item.primaryImage,
      isPutOnSale: item.isPutOnSale,
      categoryMain: item.categoryMain,
      categorySub: item.categorySub
    }));

    return finalList;
  } catch (err) {
    console.error('获取商品列表失败:', err);
    return [];
  }
}