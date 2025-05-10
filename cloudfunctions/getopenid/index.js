const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()  
  const check = await db.collection('users').where({ openid: OPENID }).get()
  
  if (check.data.length === 0) {
    await db.collection('users').add({
      data: {
        openid: OPENID,
        isAdmin: false,
        accessedAt: new Date()
      }
    })
  }

  const res = await db.collection('users').where({
    openid: OPENID,
    isAdmin: true
  }).get()

  return {
    openid: OPENID,
    isAdmin: res.data.length > 0
  }
}