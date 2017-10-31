import weCropper from '../../../utils/weCropper/weCropper.js'
import { ajaxPost } from '../../public/ajax.js'
const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 50
var app = getApp();
Page({
    data: {
        cropperOpt: {
            id: 'cropper',
            width,
            height,
            scale: 2.5,
            zoom: 8,
            cut: {
                x: (width - 300) / 2,
                y: (height - 300) / 2,
                width: 300,
                height: 300
            }
        }
    },
    touchStart(e) {
        this.wecropper.touchStart(e)
    },
    touchMove(e) {
        this.wecropper.touchMove(e)
    },
    touchEnd(e) {
        this.wecropper.touchEnd(e)
    },
    getCropperImage() {
        this.wecropper.getCropperImage((avatar) => {
            //  获取到裁剪后的图片
            if (avatar) {
                
                var header = wx.getStorageSync('loginInfor');//请求头加入登录的信息
                var userInfor = wx.getStorageSync('userInfor');//获取到本地存储的用户信息，在成功后重新存储
                wx.showLoading({})
                wx.uploadFile({
                    url: app.globalData.apiHost +'user/uploadIcon', //仅为示例，非真实的接口地址
                    filePath: avatar,
                    header: header,
                    Method:'post',
                    name: 'file',
                    success: function (res) {
                        let data = JSON.parse(res.data);
                        console.log(data);
                        if (data.retCode =="00000"){
                            userInfor.userIcon = avatar;
                            wx.setStorageSync('userInfor', userInfor)
                            wx.redirectTo({
                                url: '../setIndex',
                            })
                            
                        }
                        
                    }
                })
            } else {
                console.log('获取图片失败，请稍后重试')
            }
        })
    },
    uploadTap() {
        const self = this

        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success(res) {
                let src = res.tempFilePaths[0]
                //  获取裁剪图片资源后，给data添加src属性及其值
                self.wecropper.pushOrign(src)
            }
        })
    },
    onLoad(option) {
        // do something
        const { cropperOpt } = this.data
        const { src } = option;
        if (src) {
            Object.assign(cropperOpt, { src })
            new weCropper(cropperOpt)
                .on('ready', function (ctx) {
                })
                .on('beforeImageLoad', (ctx) => {
                    wx.showToast({
                        title: '上传中',
                        icon: 'loading',
                        duration: 20000
                    })
                })
                .on('imageLoad', (ctx) => {

                    wx.hideToast()
                })
        }
    }
})
