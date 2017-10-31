
import {ajaxPost} from '../../public/ajax.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        errMsg:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu()
    },
    submitForm:function(e){
        var params = e.detail.value;
        console.log(params)
        if (params.oldPassword.length<6){
            this.setData({
                errMsg: '请输入正确的密码'
            })
            return;
        }
        if (params.newPassword.length<6) {
            this.setData({
                errMsg: '请输入6-20位新密码'
            })
            return;
        }
        if (params.reNewPassword == "") {
            this.setData({
                errMsg: '请确认密码'
            })
            return;
        }
        if (params.newPassword != params.reNewPassword) {
            this.setData({
                errMsg: '两次密码不一致'
            })
            return;
        }
        this.setData({
            errMsg: ''
        })
        ajaxPost('mine/updatePassword',params,(data)=>{
            wx.showToast({
                title: '修改成功',
            })
            setTimeout(function(){
                wx.navigateBack()
            },2000)
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