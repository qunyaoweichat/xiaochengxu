import { ajaxPost } from '../../public/ajax.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        oldPhone:'',
        getCodeFlag: false,
        getCodeStr: '获取验证码',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
    setPhone:function(e){
        console.log(e)
        this.setData({
            oldPhone: e.detail.value
        })
    },
    getCode: function () {
        var phoneReg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
        if (!phoneReg.test(this.data.oldPhone)){
            wx.showToast({
                title:'手机号错误',
                image:'/images/icon-error.png'
            });
            return;
        }
        ajaxPost('sms/sendVerifyCode', { phone: this.data.oldPhone},(data)=>{
            wx.showToast({
                title: '发送成功',
            });
            let time = 120;
            let that = this;
            if (!that.data.getCodeFlag) {
                that.setData({
                    getCodeFlag: true
                })
                let timeout = setInterval(function () {
                    if (time > 1) {
                        time--;
                        that.setData({
                            getCodeStr: time + '后再次获取',
                        })

                    } else {
                        that.setData({
                            getCodeStr: '获取验证码',
                            getCodeFlag: false
                        })
                        clearInterval(timeout)
                    }
                }, 1000)
            }
        })
    },
    submit:function(e){
        let params = e.detail.value
        ajaxPost('mine/bindMobile', params, (data) => {
            // 绑定成功后修改本地存储的数据
            let userInfor = wx.getStorageSync('userInfor');
            userInfor.mobile = params.mobile;
            wx.setStorageSync('userInfor', userInfor)
            wx.showToast({
                title: '绑定成功',
            });
            setTimeout(function () {
                wx.navigateBack({

                })
            }, 2000)
        })
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})