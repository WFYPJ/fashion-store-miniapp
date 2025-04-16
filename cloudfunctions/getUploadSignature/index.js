// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const COS = require('cos-nodejs-sdk-v5')

// 替换成你自己的 SecretId 和 SecretKey
const cos = new COS({
  SecretId: 'AKIDe9PPAetrZ6NOBizzjCOKzNVMwGJ6dvwh',
  SecretKey: 'WlkTv73j8H9l6BzXpqbASTEk0AAuY5Wh'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const { filename } = event;

  const Bucket = 'fzdtest-1350382597'
  const Region = 'ap-nanjing'

  const authorization = cos.getAuthorization({
    Method: 'PUT',
    Key: filename,
    Bucket,
    Region,
    Sign: true
  })

  const uploadUrl = `https://${Bucket}.cos.${Region}.myqcloud.com/${filename}`

  return {
    uploadUrl,
    authorization,
    filename
  }
}