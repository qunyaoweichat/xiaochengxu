import { ajaxPost } from '../../public/ajax.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        errMsg:'',
        userInfor:{}
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
    edtEmail:function(e){
        var params = e.detail.value;
        var regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if (!regEmail.test(params.email)){
            this.setData({
                errMsg:'请输入正确的邮箱'
            });
            return;
        }
        this.setData({
            errMsg: ''
        })
        ajaxPost('mine/editEmail',params,(data)=>{
            wx.showToast({
                title: '修改成功',
            })
            this.data.userInfor.email = params.email;
            wx.setStorageSync('userInfor', this.data.userInfor)
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