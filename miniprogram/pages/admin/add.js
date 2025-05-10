// pages/admin/add.js
const COS = require('../../libs/cos-wx-sdk-v5')
const { COS_BUCKET, COS_REGION, COS_URL_PREFIX } = require('../../utils/config');
const { MAIN_CATEGORIES, SUB_CATEGORY_MAP, SIZE_OPTIONS } = require('../../utils/constants');

// Initialize COS SDK with temporary credentials
const cos = new COS({
  getAuthorization: async function (options, callback) {
    const res = await wx.cloud.callFunction({
      name: 'getCosTempCredentials'
    });
    console.log('🧪 Temp Credentials Response:', res); 
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
    title: '',
    mainCategories: MAIN_CATEGORIES,
    subCategoryMap: SUB_CATEGORY_MAP,
    subCategories: [],
    selectedMainCategory: '',
    selectedSubCategory: '',
    primaryImageUrl: '',
    carouselImages: [],
    descImages: [],
    sizeOptions: SIZE_OPTIONS,
    selectedSizes: [],
    newColor: '',
    selectedColors:[],
    material: '',
    price: null,
    isPutOnSale: false
  },

  // Handle text input for product title
  onTitleInput(e) {
    this.setData({ title: e.detail.value });
  },
  // Update subcategories when a main category is selected
  onMainCategoryChange(e) {
    const selectedMainCategory = this.data.mainCategories[e.detail.value];
    const subCategories = this.data.subCategoryMap[selectedMainCategory] || [];
    this.setData({
      selectedMainCategory,
      subCategories,
      selectedSubCategory: ''
    });
  },
  onSubCategoryChange(e) {
    this.setData({ selectedSubCategory: this.data.subCategories[e.detail.value] });
  },
  onSizeChange(e) {
    this.setData({ selectedSizes: e.detail.value });
  },
  onColorInput(e) {
    this.setData({ newColor: e.detail.value.trim() });
  },
  addColor() {
    const { newColor, selectedColors } = this.data;
    if (!newColor) return;
    if (selectedColors.includes(newColor)) {
      return wx.showToast({ title: 'Color already exists', icon: 'none' });
    }
    this.setData({
      selectedColors: [...selectedColors, newColor],
      newColor: ''
    });
  },
  removeColor(e) {
    const index = e.currentTarget.dataset.index;
    const newList = [...this.data.selectedColors];
    newList.splice(index, 1);
    this.setData({ selectedColors: newList });
  },

  onMaterialInput(e) {
    this.setData({ material: e.detail.value });
  },
  onPriceInput(e) {
    this.setData({ price: parseFloat(e.detail.value) });
  },
  onPutOnSaleChange(e) {
    this.setData({ isPutOnSale: e.detail.value });
  },

  // Upload main product image to COS (triggered on user select)
  uploadPrimaryImage() {
    const that = this;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: async res => {
        let tempFilePath = res.tempFiles[0].tempFilePath;
        try {
          const compressed = await wx.compressImage({src: tempFilePath, quality: 80});
          tempFilePath = compressed.tempFilePath;
        } catch (err) {}
        
        const fileExt = tempFilePath.substring(tempFilePath.lastIndexOf('.'));
        const fileName = `uploads/primary-${Date.now()}${fileExt}`;
        const imageUrl = `${COS_URL_PREFIX}/${fileName}`;
  
        wx.showLoading({ title: 'Uploading...', mask: true });  
        
        await cos.putObject({
          Bucket: COS_BUCKET,
          Region: COS_REGION,
          Key: fileName,
          FilePath: tempFilePath,
        }).then(() => {
          that.setData({ primaryImageUrl: imageUrl });
          wx.hideLoading();
          wx.showToast({ title: 'Primary image uploaded' });
        }).catch(err => {
            wx.hideLoading();
            console.error('Primary image upload failed', err);
            wx.showToast({ title: 'Upload failed', icon: 'none' });
        });
      }
    });
  },
  removePrimaryImage() {
    this.setData({primaryImageUrl: ''});
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
            const compressed = await wx.compressImage({ src: filePath, quality: 80 });
            filePath = compressed.tempFilePath;
          } catch (err) {}
  
          const fileExt = filePath.substring(filePath.lastIndexOf('.'));
          const fileName = `uploads/carousel-${timestamp}-${index}${fileExt}`;
          const imageUrl = `${COS_URL_PREFIX}/${fileName}`;
  
          try {
            await cos.putObject({
              Bucket: COS_BUCKET,
              Region: COS_REGION,
              Key: fileName,
              FilePath: filePath,
            });
            return imageUrl;
          } catch (err) {
            console.error('Carousel upload failed', err);
            wx.showToast({ title: 'Upload failed', icon: 'none' });
            return null;
          }
        });
  
        const urls = (await Promise.all(uploadPromises)).filter(url => url !== null);
        that.setData({
          carouselImages: [...that.data.carouselImages, ...urls]
        });
  
        wx.hideLoading();
        wx.showToast({ title: 'Carousel images uploaded' });
      }
    });
  },
  
  removeCarouselImage(e) {
    const index = e.currentTarget.dataset.index;
    const newList = [...this.data.carouselImages];
    newList.splice(index, 1);
    this.setData({ carouselImages: newList });
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
            const compressed = await wx.compressImage({ src: filePath, quality: 80 });
            filePath = compressed.tempFilePath;
          } catch (err) {}
  
          const fileExt = filePath.substring(filePath.lastIndexOf('.'));
          const fileName = `uploads/desc-${timestamp}-${index}${fileExt}`;
          const imageUrl = `${COS_URL_PREFIX}/${fileName}`;
  
          try {
            await cos.putObject({
              Bucket: COS_BUCKET,
              Region: COS_REGION,
              Key: fileName,
              FilePath: filePath,
            });
            return imageUrl;
          } catch (err) {
            console.error('Description image upload failed', err);
            wx.showToast({ title: 'Upload failed', icon: 'none' });
            return null;
          }
        });
  
        const urls = (await Promise.all(uploadPromises)).filter(url => url !== null);
        that.setData({
          descImages: [...that.data.descImages, ...urls]
        });
  
        wx.hideLoading();
        wx.showToast({ title: 'Description images uploaded' });
      }
    });
  },

removeDescImage(e) {
  const index = e.currentTarget.dataset.index;
  const newList = [...this.data.descImages];
  newList.splice(index, 1);
  this.setData({ descImages: newList });
},

  submitProduct() {
    const db = wx.cloud.database();
    const {
      title,
      selectedMainCategory,
      selectedSubCategory,
      primaryImageUrl,
      carouselImages,
      descImages,
      selectedSizes,
      selectedColors,
      material,
      price,
      isPutOnSale
    } = this.data;
  
    if (!title || !selectedMainCategory || !selectedSubCategory || !primaryImageUrl ) {
      return wx.showToast({
        title: 'Please fill in all required fields',
        icon: 'none'
      });
    }
  
    const productData = {
      title,
      categoryMain: selectedMainCategory,
      categorySub: selectedSubCategory,
      primaryImage: primaryImageUrl,
      images: carouselImages,
      desc: descImages,
      sizes: selectedSizes,
      colors: selectedColors,
      material,
      price,
      isPutOnSale,
      createdAt: db.serverDate()
    };
  
    db.collection('products').add({
      data: productData,
      success: res => {
        wx.showToast({
          title: 'Product added',
          icon: 'success'
        });
        setTimeout(() => {
          wx.navigateBack(); 
        }, 1000);
      },
      fail: err => {
        console.error('Submit failed', err);
        wx.showToast({ title: 'Submit failed', icon: 'none' });
      }
    });
  }
});