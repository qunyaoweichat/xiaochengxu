import { ajaxPost } from "../../../public/ajax.js";
Page({
    prevPage: '',
    /**
     * 页面的初始数据
     */
    data: {
        orderDetail:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu()
        var pages = getCurrentPages();
        this.prevPage = pages[pages.length - 2];
        let orderId = options.orderId;
        this.setData({
            orderId: orderId
        })
        this.getData(orderId)
    },
    getData: function (orderId) {
        wx.showLoading()
        ajaxPost('order/detail', { orderId: orderId},(data)=>{
            wx.hideLoading()
            console.log(data.orderList[0])
            this.setData({
                orderDetail: data.orderList[0]
            })
        })
    },
    takeDelivery: function (e) {//收货
        let orderId = e.currentTarget.dataset.orderid;
        wx.showModal({
            title: '确定收货？',
            success: (res) => {
                if (res.confirm) {
                    ajaxPost('order/receive', { orderId: orderId }, (data) => {
                        this.prevPage.setData({
                            orderType: 0,
                        })
                        this.prevPage.getData(0, (data) => {
                            wx.showToast({
                                title: '收货成功',
                            })
                            setTimeout(() => {
                                this.prevPage.setData({
                                    list: data,
                                    loadAll: false
                                });
                                wx.pageScrollTo({
                                    scrollTop: 0
                                })
                                wx.navigateBack()
                            }, 2000)
                        })
                    })
                }
            }
        })
    },
    goPay:function(e){
        let orderId = e.currentTarget.dataset.orderid;
        wx.navigateTo({
            url: '../../../buy/pay/pay?orderId=' + orderId,
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