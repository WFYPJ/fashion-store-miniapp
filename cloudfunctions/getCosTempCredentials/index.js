const cloud = require('wx-server-sdk')
cloud.init()

const sts = require('qcloud-cos-sts')

exports.main = async (event, context) => {
  const config = {
    secretId: 'AKIDe9PPAetrZ6NOBizzjCOKzNVMwGJ6dvwh',
    secretKey: 'WlkTv73j8H9l6BzXpqbASTEk0AAuY5Wh',
    durationSeconds: 1800,
    proxy: '',
    policy: {
      version: '2.0',
      statement: [
        {
          action: [
            'name/cos:PutObject',
            'name/cos:PostObject',
            'name/cos:InitiateMultipartUpload',
            'name/cos:ListMultipartUploads',
            'name/cos:ListParts',
            'name/cos:UploadPart',
            'name/cos:CompleteMultipartUpload',
          ],
          effect: 'allow',
          principal: { qcs: ['*'] },
          resource: [
            'qcs::cos:ap-nanjing:uid/1350382597:fzdtest-1350382597/uploads/*',
          ],
        },
      ],
    },
  }

  return new Promise((resolve, reject) => {
    sts.getCredential(config, function (err, tempKeys) {
      if (err) {
        console.error('❌ 获取临时密钥失败:', err)
        reject(err)
      } else {
        resolve(tempKeys)
      }
    })
  })
}