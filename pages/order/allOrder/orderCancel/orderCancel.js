import { ajaxPost } from "../../../public/ajax.js";
Page({
    prevPage: '',
    /**
     * 页面的初始数据
     */
    data: {
        orderDetail: {},
        reasonList: [],
        cancelReasonList:[]
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
        ajaxPost('order/detail', { orderId: orderId }, (data) => {
            wx.hideLoading()
            console.log(data.orderList[0])
            this.setData({
                orderDetail: data.orderList[0]
            })
        })
        // 取消原因
        let cancelReasonList = [
            {
                "code": "UNABLE_BUY",
                "msg": "不想买了"
            },
            {
                "code": "BUYERS_MISTAKE_REMAKE",
                "msg": "误拍或重拍了"
            },
            {
                "code": "COMPLETED_OFFLINE",
                "msg": "已通过银行线下(或网银)直接汇款"
            },
            {
                "code": "COMPLETED_MEET",
                "msg": "已通过同城见面交易"
            }
        ]
        var reasonList = []
        for (var i = 0; i < cancelReasonList.length; i++){
            reasonList.push(cancelReasonList[i].msg)
        }
        this.setData({
            reasonList: reasonList,
            cancelReasonList: cancelReasonList,
        })
    },
    selectReason:function(e){
        wx.showActionSheet({
            itemList: this.data.reasonList,
            success: (res)=> {
                this.setData({
                    submitParams: this.data.cancelReasonList[res.tapIndex]
                })
            }
        })
    },
    cancelOrder: function () { //取消订单
        let orderId = this.data.orderId;
        let submitParams = this.data.submitParams;
        if (!submitParams){
            wx.showToast({
                title: '请选择原因',
                image:'/images/icon-error.png'
            })
            return;
        }
        submitParams.orderId = orderId
        wx.showModal({
            title: '确定取消订单？',
            success: (res) => {
                if (res.confirm) {
                    ajaxPost('order/cancel', submitParams, (data) => {
                        this.prevPage.getData(0, (data) => {
                            wx.showToast({
                                title: '取消成功',
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