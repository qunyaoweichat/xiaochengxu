import { ajaxPost } from "../../../public/ajax.js";
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu()
        let refundId = options.refundId;
        this.setData({
            refundId: refundId
        })
        this.getData(0);
    },
    getData: function (page) {
        wx.showLoading()
        ajaxPost('order/rights/refundConsultRecord', { refundId: this.data.refundId }, (data) => {
            console.log(data)
            wx.hideLoading()
            this.setData({
                data: data,
                list:data.msgList

            })
        })
    },
    getMore:function(){
        console.log('加载更多')
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