
import { ajaxPost } from '../../public/ajax.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        errMsg: '',
        userInfor: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu()
        this.setData({
            userInfor: wx.getStorageSync('userInfor')
        })

    },
    submitForm: function (e) {
        var params = e.detail.value;
        console.log(params)
        if (params.oldPassword.length != 6) {
            this.setData({
                errMsg: '请输入正确的支付密码'
            })
            return;
        }
        if (params.payPwd.length != 6) {
            this.setData({
                errMsg: '支付密码必须为6位纯数字'
            })
            return;
        }
        if (params.reNewPassword == "") {
            this.setData({
                errMsg: '请确认密码'
            })
            return;
        }
        if (params.payPwd != params.reNewPassword) {
            this.setData({
                errMsg: '两次支付密码不一致'
            })
            return;
        }
        this.setData({
            errMsg: ''
        })
        ajaxPost('mine/updatePayPassword', params, (data) => {
            wx.showToast({
                title: '修改成功',
            })
            setTimeout(function () {
                wx.navigateBack()
            }, 2000)
        })
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