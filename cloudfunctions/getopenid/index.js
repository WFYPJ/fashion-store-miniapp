// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()  // ✅ 变量名是大写 OPENID
  // 👉 先检查是否已存在该 openid
  const check = await db.collection('users').where({ openid: OPENID }).get()
  // 👉 如果不存在，就新增记录
  if (check.data.length === 0) {
    await db.collection('users').add({
      data: {
        openid: OPENID,
        isAdmin: false,      // 默认不是管理员
        accessedAt: new Date()
      }
    })
  }
  // 👉 2. 判断是否是管理员
  const res = await db.collection('users').where({
    openid: OPENID,
    isAdmin: true
  }).get()

  return {
    openid: OPENID,
    isAdmin: res.data.length > 0
  }
}