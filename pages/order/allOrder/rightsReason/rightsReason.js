import { ajaxPost } from "../../../public/ajax.js";
Page({
    prevPage:{},
    /**
     * 页面的初始数据
     */
    data: {
        selecIndex:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu()
        var pages = getCurrentPages();
        this.prevPage = pages[pages.length - 2];
        this.getData()
    },
    getData: function () {
        wx.showLoading()
        ajaxPost('order/rights/refundReason', {}, (data) => {
            wx.hideLoading()
            this.setData({
                refundReasonList: data.refundReasonList,
            })
        })
    },
    setIndex:function(e){
        let index = e.currentTarget.dataset.index;
        this.setData({
            selecIndex:index
        })
        
    },
    back:function(){
        this.prevPage.setData({
            reason: this.data.refundReasonList[this.data.selecIndex]
        })
        wx.navigateBack()
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
