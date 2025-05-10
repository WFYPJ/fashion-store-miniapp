const cloud = require('wx-server-sdk');
cloud.init();
const sts = require('qcloud-cos-sts');

const BUCKET_NAME = process.env.COS_BUCKET_NAME;
const REGION = process.env.COS_REGION;
const APPID = process.env.TENCENT_APP_ID;

exports.main = async () => {
  const config = {
    secretId: process.env.TENCENT_SECRET_ID,
    secretKey: process.env.TENCENT_SECRET_KEY,
    durationSeconds: 1800, 
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
            `qcs::cos:${REGION}:uid/${APPID}:${BUCKET_NAME}/uploads/*`
          ],
        },
      ],
    },
  };

  return new Promise((resolve, reject) => {
    sts.getCredential(config, (err, tempKeys) => {
      if (err) {
        console.error('❌ Failed to get credentials:', err);
        reject(err);
      } else {
        resolve(tempKeys);
      }
    });
  });
};