// pages/admin/edit.js
const COS = require('../../libs/cos-wx-sdk-v5')
const { COS_URL_PREFIX, COS_BUCKET, COS_REGION } = require('../../utils/config');
const { MAIN_CATEGORIES, SUB_CATEGORY_MAP, SIZE_OPTIONS } = require('../../utils/constants');

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
    originalSizes: [], 
    selectedSizes: [], 
    originalSizeText: '',
    selectedColors: [],
    material: '',
    price: '',
    isPutOnSale: false,
    mainCategories: MAIN_CATEGORIES,
    subCategoryMap: SUB_CATEGORY_MAP,
    subCategories: [],
    sizeOptions: SIZE_OPTIONS,
    newColor: ''
  },

  async onLoad(options) {
    const id = options.id;
    this.setData({ id });

    const db = wx.cloud.database();
    try {
      const res = await db.collection('products').doc(id).get();
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
        originalSizes: [...(data.sizes || [])],   
        originalSizeText: (data.sizes || []).join(', '),
        selectedSizes: [...(data.sizes || [])],           
        selectedColors: data.colors || [],
        material: data.material || '',
        price: data.price || '',
        isPutOnSale: data.isPutOnSale || false
      });
    } catch (err) {
      wx.showToast({ title: 'Failed to load', icon: 'none' });
    }
  },

  removePrimaryImage() {
    this.setData({primaryImageUrl: ''});
  },

  uploadPrimaryImage() {
    const that = this;  
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: async res => {
        let tempFilePath = res.tempFiles[0].tempFilePath;
        try {
          const compressed = await wx.compressImage({src: tempFilePath,quality: 80});
          tempFilePath = compressed.tempFilePath;
        } catch (err) {}
        
        const fileExt = tempFilePath.substring(tempFilePath.lastIndexOf('.'));
        const fileName = `uploads/primary-${Date.now()}${fileExt}`;
        const imageUrl = `${COS_URL_PREFIX}/${fileName}`;
  
        wx.showLoading({ title: 'Uploading...', mask: true });
  
        cos.uploadFile({
          Bucket: COS_BUCKET,
          Region: COS_REGION,
          Key: fileName,
          FilePath: tempFilePath,
        });
  
        setTimeout(() => {
          that.setData({ primaryImageUrl: imageUrl });
          wx.hideLoading();
          wx.showToast({ title: 'Uploaded' });
        }, 5000); 
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
        wx.showLoading({ title: 'Uploading...', mask: true });
        const timestamp = Date.now();
  
        const uploadPromises = chooseRes.tempFiles.map(async (file, index) => {
          let filePath = file.tempFilePath;
          try {
            const compressed = await wx.compressImage({src: filePath,quality: 80});
            filePath = compressed.tempFilePath;
          } catch (err) {}

          const fileExt = filePath.substring(filePath.lastIndexOf('.'));
          const fileName = `uploads/carousel-${timestamp}-${index}${fileExt}`;
          const imageUrl = `${COS_URL_PREFIX}/${fileName}`;
  
          cos.uploadFile({
            Bucket: COS_BUCKET,
            Region: COS_REGION,
            Key: fileName,
            FilePath: filePath,
          });
  
          return new Promise(resolve => {
            setTimeout(() => {
              resolve(imageUrl); 
            }, 5000);
          });
        });
  
        const urls = await Promise.all(uploadPromises);
        that.setData({
          carouselImages: [...that.data.carouselImages, ...urls]
        });
  
        wx.hideLoading();
        wx.showToast({ title: 'Uploaded' });
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
        wx.showLoading({ title: 'Uploading...', mask: true });
        const timestamp = Date.now();
  
        const uploadPromises = chooseRes.tempFiles.map(async (file, index) => {
          let filePath = file.tempFilePath;
          try {
            const compressed = await wx.compressImage({
              src: filePath,
              quality: 80
            });
            filePath = compressed.tempFilePath;
          } catch (err) {}

          const fileExt = filePath.substring(filePath.lastIndexOf('.'));
          const fileName = `uploads/desc-${timestamp}-${index}${fileExt}`;
          const imageUrl = `${COS_URL_PREFIX}/${fileName}`;
  
          cos.uploadFile({
            Bucket: COS_BUCKET,
            Region: COS_REGION,
            Key: fileName,
            FilePath: filePath
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
        wx.showToast({ title: 'Uploaded' });
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
      wx.showToast({ title: 'Please complete all fields', icon: 'none' });
      return;
    }


    const finalSizes = selectedSizes.length > 0 ? selectedSizes : originalSizes;

    wx.showLoading({ title: 'Saving...' });
    try {
      const db = wx.cloud.database();
      await db.collection('products').doc(id).update({
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
      wx.setStorageSync('shouldRefreshGoodsList', true); 
      wx.showToast({ title: 'Saved' });
      setTimeout(() => {
        wx.navigateBack();
      }, 1000);
    } catch (err) {
      wx.showToast({ title: 'Save failed', icon: 'none' });
    } finally {
      wx.hideLoading();
    }
  }
});