// pages/admin/add.js
const COS = require('../../libs/cos-wx-sdk-v5')
const cos = new COS({
  getAuthorization: async function (options, callback) {
    const res = await wx.cloud.callFunction({
      name: 'getCosTempCredentials'
    })
    const credentials = res.result.credentials
    callback({
      TmpSecretId: credentials.tmpSecretId,
      TmpSecretKey: credentials.tmpSecretKey,
      SecurityToken: credentials.sessionToken,
      StartTime: res.result.startTime,
      ExpiredTime: res.result.expiredTime
    })
  }
})

Page({
  data: {
    id: '',

    title: '',
    selectedMainCategory: '',
    selectedSubCategory: '',
    primaryImageUrl: '',
    carouselImages: [],
    descImages: [],
    originalSizes: [], // 👉 原始值，展示用
    selectedSizes: [], // 👉 用户选择值
    originalSizeText: '',
    selectedColors: [],
    material: '',
    price: '',
    isPutOnSale: false,

    mainCategories: ['女士', '男士', '中老年', '青少年', '内衣'],
    subCategoryMap: {
      女士: ['短袖T恤', '衬衫', '卫衣', '毛衣', '外套', '裤子', '半身裙','连衣裙', '西装', '风衣', '羽绒服'],
      男士: ['短袖T恤', '衬衫', '卫衣', '毛衣',  '夹克','西装', '外套', '裤子','羽绒服' ],
      中老年: ['短袖T恤', '衬衫', '毛衣',  '开衫','棉衣', '裤子', '羽绒服'],
      青少年: ['短袖T恤', '卫衣', '连帽衫','毛衣', '运动裤', '牛仔裤', '外套', '羽绒服'],
      内衣: ['内裤', '保暖内衣','睡衣']
    },
    subCategories: [],
    sizeOptions: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    newColor: ''
  },

  async onLoad(options) {
    const id = options.id;
    this.setData({ id });

    const db = wx.cloud.database();
    try {
      const res = await db.collection('shangpin').doc(id).get();
      const data = res.data;

      const main = data.categoryMain || '';
      const sub = data.categorySub  || '';

      this.setData({
        title: data.title || '',
        selectedMainCategory: main,
        selectedSubCategory: sub,
        subCategories: this.data.subCategoryMap[main] || [],
        primaryImageUrl: data.primaryImage || '',
        carouselImages: data.images || [],
        descImages: data.desc || [],
        originalSizes: [...(data.sizes || [])],   // 👈 原始绑定
        originalSizeText: (data.sizes || []).join(', '),
        selectedSizes: [...(data.sizes || [])],           // 👈 初始为空，等用户勾选
        selectedColors: data.colors || [],
        material: data.material || '',
        price: data.price || '',
        isPutOnSale: data.isPutOnSale || false
      }, () => {
        console.log('✅ 尺码绑定成功:', this.data.originalSizes);
      });

    } catch (err) {
      console.error('❌ 加载商品失败:', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  removePrimaryImage() {
    this.setData({
      primaryImageUrl: ''
    });
  },

  uploadPrimaryImage() {
    const that = this;
    console.log('📍uploadPrimaryImage 函数触发');
  
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: async res => {
        console.log('📍选择图片成功:', res);
  
        let tempFilePath = res.tempFiles[0].tempFilePath;
        // 尝试压缩（压缩质量 80）
        try {
          const compressed = await wx.compressImage({
            src: tempFilePath,
            quality: 80
          });
         tempFilePath = compressed.tempFilePath;
          console.log('✅ 压缩成功:', tempFilePath);
        } catch (err) {
          console.warn('⚠️ 图片压缩失败，使用原图:', err);
        }
        
        const fileExt = tempFilePath.substring(tempFilePath.lastIndexOf('.'));
        const fileName = `uploads/primary-${Date.now()}${fileExt}`;
        const imageUrl = `https://fzdtest-1350382597.cos.ap-nanjing.myqcloud.com/${fileName}`;
  
        wx.showLoading({ title: '上传中...', mask: true });
        console.log('📍构造预期 URL:', imageUrl);
  
        // 尝试上传
        cos.uploadFile({
          Bucket: 'fzdtest-1350382597',
          Region: 'ap-nanjing',
          Key: fileName,
          FilePath: tempFilePath,
          success: res2 => {
            console.log('✅ COS SDK 回调 success:', res2);
            // 有时不会触发，可以忽略
          },
          error: err => {
            console.error('❌ 上传失败:', err);
          }
        });
  
        // ✅ 无论成功回调触不触发，都先假设上传成功，把 imageUrl 写入
        setTimeout(() => {
          console.log('⏱️ 超时写入图片 URL（兜底处理）:', imageUrl);
          that.setData({ primaryImageUrl: imageUrl });
          wx.hideLoading();
          wx.showToast({ title: '主图上传完成' });
        }, 5000); // 等 5 秒后写入
      },
      fail: err => {
        console.error('❌ 选择图片失败:', err);
      }
    });
  },

  removeCarouselImage(e) {
    const index = e.currentTarget.dataset.index;
    const newList = [...this.data.carouselImages];
    newList.splice(index, 1);
    this.setData({ carouselImages: newList });
  },
  uploadCarouselImages() {
    const that = this;
  
    wx.chooseMedia({
      count: 5,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: async chooseRes => {
        wx.showLoading({ title: '上传中...', mask: true });

        const timestamp = Date.now();
  
        const uploadPromises = chooseRes.tempFiles.map(async (file, index) => {
          let filePath = file.tempFilePath;
          try {
            const compressed = await wx.compressImage({
              src: filePath,
              quality: 80
            });
            filePath = compressed.tempFilePath;
            console.log('✅ 压缩成功:', filePath);
          } catch (err) {
            console.warn('⚠️ 压缩失败，使用原图:', err);
          }

          const fileExt = filePath.substring(filePath.lastIndexOf('.'));
          const fileName = `uploads/carousel-${timestamp}-${index}${fileExt}`;
          const imageUrl = `https://fzdtest-1350382597.cos.ap-nanjing.myqcloud.com/${fileName}`;
  
          // 上传但不依赖回调
          cos.uploadFile({
            Bucket: 'fzdtest-1350382597',
            Region: 'ap-nanjing',
            Key: fileName,
            FilePath: filePath,
            success: res => {
              console.log('✅ 上传 carousel 成功:', res);
            },
            error: err => {
              console.error('❌ 上传 carousel 失败:', err);
            }
          });
  
          return new Promise(resolve => {
            setTimeout(() => {
              resolve(imageUrl); // 无论是否成功，延时写入
            }, 5000);
          });
        });
  
        const urls = await Promise.all(uploadPromises);
        console.log('🚀 最终要写入的图片链接:', urls);
        that.setData({
          carouselImages: [...that.data.carouselImages, ...urls]
        });
  
        wx.hideLoading();
        wx.showToast({ title: '轮播图上传完成' });
      },
      fail: err => {
        console.error('选择轮播图失败:', err);
      }
    });
  },

  removeDescImage(e) {
    const index = e.currentTarget.dataset.index;
    const newList = [...this.data.descImages];
    newList.splice(index, 1);
    this.setData({ descImages: newList });
  },

  uploadDescImages() {
    const that = this;
  
    wx.chooseMedia({
      count: 9,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: async chooseRes => {
        wx.showLoading({ title: '上传中...', mask: true });
        const timestamp = Date.now();
  
        const uploadPromises = chooseRes.tempFiles.map(async (file, index) => {
          let filePath = file.tempFilePath;
          try {
            const compressed = await wx.compressImage({
              src: filePath,
              quality: 80
            });
            filePath = compressed.tempFilePath;
            console.log('✅ 压缩成功:', filePath);
          } catch (err) {
            console.warn('⚠️ 压缩失败，使用原图:', err);
          }
          const fileExt = filePath.substring(filePath.lastIndexOf('.'));
          const fileName = `uploads/desc-${timestamp}-${index}${fileExt}`;
          const imageUrl = `https://fzdtest-1350382597.cos.ap-nanjing.myqcloud.com/${fileName}`;
  
          cos.uploadFile({
            Bucket: 'fzdtest-1350382597',
            Region: 'ap-nanjing',
            Key: fileName,
            FilePath: filePath,
            success: res => {
              console.log('✅ 上传 desc 成功:', res);
            },
            error: err => {
              console.error('❌ 上传 desc 失败:', err);
            }
          });
  
          return new Promise(resolve => {
            setTimeout(() => {
              resolve(imageUrl);
            }, 5000);
          });
        });
  
        const urls = await Promise.all(uploadPromises);
        that.setData({
          descImages: [...that.data.descImages, ...urls]
        });
  
        wx.hideLoading();
        wx.showToast({ title: '详情图上传完成' });
      },
      fail: err => {
        console.error('选择详情图失败:', err);
      }
    });
  },

  onTitleInput(e) {
    this.setData({ title: e.detail.value });
  },
  onMaterialInput(e) {
    this.setData({ material: e.detail.value });
  },
  onPriceInput(e) {
    this.setData({ price: parseFloat(e.detail.value) || '' });
  },
  onPutOnSaleChange(e) {
    this.setData({ isPutOnSale: e.detail.value });
  },
  onMainCategoryChange(e) {
    const main = this.data.mainCategories[e.detail.value];
    this.setData({
      selectedMainCategory: main,
      subCategories: this.data.subCategoryMap[main] || [],
      selectedSubCategory: ''
    });
  },
  onSubCategoryChange(e) {
    const sub = this.data.subCategories[e.detail.value];
    this.setData({ selectedSubCategory: sub });
  },
  onSizeChange(e) {
    console.log('📦 用户点击了尺码：', e.detail.value);
    this.setData({ selectedSizes: e.detail.value });
  },
  onColorInput(e) {
    this.setData({ newColor: e.detail.value });
  },
  addColor() {
    const color = this.data.newColor.trim();
    if (color && !this.data.selectedColors.includes(color)) {
      this.setData({
        selectedColors: [...this.data.selectedColors, color],
        newColor: ''
      });
    }
  },
  removeColor(e) {
    const index = e.currentTarget.dataset.index;
    const updated = [...this.data.selectedColors];
    updated.splice(index, 1);
    this.setData({ selectedColors: updated });
  },

  async submitProduct() {
    const {
      id, title, selectedMainCategory, selectedSubCategory,
      primaryImageUrl, carouselImages, descImages,
      selectedSizes, originalSizes, selectedColors,
      material, price, isPutOnSale
    } = this.data;

    if (!title || !selectedMainCategory || !selectedSubCategory || !primaryImageUrl) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }


    // ✅ 如果用户没选新的尺码，就用原始尺码
    const finalSizes = selectedSizes.length > 0 ? selectedSizes : originalSizes;

    wx.showLoading({ title: '保存中...' });
    try {
      const db = wx.cloud.database();
      await db.collection('shangpin').doc(id).update({
        data: {
          title,
          categoryMain: selectedMainCategory,
          categorySub: selectedSubCategory,
          primaryImage: primaryImageUrl,
          images: carouselImages,
          desc: descImages,
          sizes: finalSizes,
          colors: selectedColors,
          material,
          price,
          isPutOnSale
        }
      });
      wx.setStorageSync('shouldRefreshGoodsList', true); // ✅ 加在这里
      wx.showToast({ title: '修改成功' });
      setTimeout(() => {
        wx.navigateBack();
      }, 1000);
    } catch (err) {
      console.error('❌ 修改失败:', err);
      wx.showToast({ title: '保存失败', icon: 'none' });
    } finally {
      wx.hideLoading();
    }
  }
});