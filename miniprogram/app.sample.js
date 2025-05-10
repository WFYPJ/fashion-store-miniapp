App({
  onLaunch() {
    if (!wx.cloud) {
      console.error('Please use base library 2.2.3 or above');
    } else {
      wx.cloud.init({
        env: '<your-env-id>',  // Replace with your actual env ID
        traceUser: true,
      });
    }
  }
});