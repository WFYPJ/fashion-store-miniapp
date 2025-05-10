// For front-end pages (e.g. homepage, category pages) — only fetch listed products
export async function fetchGoodsList() {
  return fetchGoods({ onlyOnSale: true });
}

// For admin pages — fetch all products, including those not listed
export async function fetchAllGoods() {
  return fetchGoods({ onlyOnSale: false });
}

// Core function — supports optional filtering and batch fetch
async function fetchGoods({ onlyOnSale = true } = {}) {
  try {
    const db = wx.cloud.database();
    const MAX_LIMIT = 20;

    const condition = onlyOnSale ? { isPutOnSale: true } : {};

    // Count total number of matching documents
    const countRes = await db.collection('products').where(condition).count();
    const total = countRes.total;
    const batchTimes = Math.ceil(total / MAX_LIMIT);
    const tasks = [];

    // Fetch in batches
    for (let i = 0; i < batchTimes; i++) {
      const query = db.collection('products')
        .where(condition)
        .orderBy('createdAt', 'desc')
        .skip(i * MAX_LIMIT)
        .limit(MAX_LIMIT)
        .get();
      tasks.push(query);
    }

    const result = await Promise.all(tasks);
    const goodsList = result.flatMap(r => r.data);

    const finalList = goodsList.map(item => ({
      _id: item._id,
      title: item.title,
      thumb: item.primaryImage,
      isPutOnSale: item.isPutOnSale,
      categoryMain: item.categoryMain,
      categorySub: item.categorySub,
      createdAt: item.createdAt
    }));

    // Optional: keep this log for debugging. Remove if unnecessary.
    console.log('[fetchGoods] Total items fetched:', finalList.length);
    return finalList;
  } catch (err) {
    console.error('[fetchGoods] Failed to fetch products:', err);
    return [];
  }
}