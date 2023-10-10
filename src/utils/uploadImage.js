import store from "@store";

export const UploadImageType = {
  Avatar: {
    name: "avatar",
    path: "/wxmp/user/uploadAvatar",
    retName: 'avatar_url'
  },
  UserProfileBg: {
    name: "bg_image",
    path: "/wxmp/user/uploadBgImage",
    retName: 'bg_image_url'
  }
}

export const uploadImage = (type, sourceImage) => {
  if(!sourceImage) return new Promise.reject('请上传图片！')
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      name: type.name,
      url: store.state.app.baseApi + type.path,
      filePath: sourceImage,
      formData: {
        token: store.state.user.token,
      },
      header: {
        "content-type": "multipart/form-data",
      },
      success: (res) => {
        console.log(res, "上传图片");
        if (res.statusCode == 200) {
          let image = JSON.parse(res.data).data[type.retName];
          resolve(image);
        } else {
          uni.showToast({ title: res?.msg || "请稍后重试" });
          reject();
        }
      },
      fail: (err) => {
        console.error('上传图片错误',err);
        uni.showToast({ title: err?.data?.msg || "请稍后重试" ,icon:'none'});
        reject(err);
      },
    });
  });
};


export const uploadAvatar = (_avatarUrl) => {
  if(!_avatarUrl) return new Promise.reject('请上传图片！')
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      name: "avatar",
      url: store.state.app.baseApi + "/wxmp/user/uploadAvatar",
      filePath: _avatarUrl,
      formData: {
        token: store.state.user.token,
      },
      header: {
        "content-type": "multipart/form-data",
      },
      success: (res) => {
        console.log(res, "上传图片");
        if (res.statusCode == 200) {
          let avatar = JSON.parse(res.data).data?.avatar_url;
          resolve(avatar);
        } else {
          uni.showToast({ title: res?.msg || "请稍后重试" });
          reject();
        }
      },
      fail: (err) => {
        console.log('fafff',err);
        uni.showToast({ title: err?.data?.msg || "请稍后重试" ,icon:'error'});
        reject(err);
      },
    });
  });
};
