import { ajaxPost } from "../../public/ajax.js";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabList: [{
            name: '全部',
            orderType: 0
        }, {
            name: '待付款',
            orderType: 1
        }, {
            name: '待发货',
            orderType: 2
        },
        {
            name: '待收货',
            orderType: 3
        }, {
            name: '待评价',
            orderType: 4
        }],
        orderType: 0,
        page: 0,
        loadAll: false

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let orderType = options.orderType;
        if (!orderType) {
            orderType = 0;
        }
        this.setData({
            orderType: orderType
        })
        wx.hideShareMenu()
        this.getData(0, (data) => {
            this.setData({
                list: data,
                loadAll: false
            })
        })
    },
    getData: function (page, callBack) {
        wx.showLoading()
        ajaxPost('mine/order', { page: page, orderType: this.data.orderType }, (data) => {
            wx.hideLoading()
            callBack(data.orderList)
        })
    },
    changeType: function (e) {
        let orderType = e.currentTarget.dataset.type;
        this.setData({
            orderType: orderType,
            page:0
        })
        this.getData(0, (data) => {
            this.setData({
                list: data,
                loadAll: false
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
                        this.setData({
                            orderType: 4,
                        })
                        this.getData(0, (data) => {

                            wx.showToast({
                                title: '收货成功',
                            })
                            this.setData({
                                list: data,
                                loadAll: false
                            })
                        })
                    })
                }
            }
        })
    },
    // 去评论
    goComment: function (e) {
        let orderinfor = e.currentTarget.dataset.orderinfor;
        wx.navigateTo({
            url: './comment/comment?orderInfor=' + JSON.stringify(orderinfor),
        })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.data.loadAll) {
            return;
        }
        wx.showNavigationBarLoading() //在标题栏中显示加载
        let page = this.data.page;
        let list = this.data.list;
        page++;
        this.getData(page, (data) => {
            console.log(data)
            wx.hideNavigationBarLoading() //完成停止加载
            wx.stopPullDownRefresh() //停止下拉刷新
            // 更新数据，需要加上列表数据
            if (data.length == 0) {
                this.setData({
                    loadAll: true
                })
            }
            list = list.concat(data);
            this.setData({
                page: page,
                list: list
            })
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
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})