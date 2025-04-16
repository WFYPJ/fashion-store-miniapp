const cloud = require('wx-server-sdk');
cloud.init({ env: 'cloud1-8gdub9sg91d4f061' }); // 替换为你的环境 ID

exports.main = async (event, context) => {
  try {
    const fileList = event.fileList.map(filename =>
      `cloud://cloud1-8gdub9sg91d4f061.fzdtest-1350382597.cos.ap-nanjing.myqcloud.com/${filename}`
    );

    console.log('请求 fileList:', fileList); // ✅ 打印确认
    const res = await cloud.getTempFileURL({ fileList });
    console.log('云函数返回:', res); // ✅ 再打印一次返回结果
    return res;
  } catch (err) {
    console.error('云函数异常:', err);
    return { err };
  }
};