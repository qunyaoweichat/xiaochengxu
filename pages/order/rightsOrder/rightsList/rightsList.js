import { ajaxPost } from "../../../public/ajax.js";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabList: [{
            name: '全部',
            refundStatus: ''
        }, {
            name: '退款中',
            refundStatus: 1
        }, {
            name: '退款完成',
            refundStatus: 4
        }],
        refundStatus: '',
        page: 0,
        loadAll: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu();
        this.getData(0, (data) => {
            this.setData({
                list: data
            })
        })
    },
    getData:function(page,callBack){
        wx.showLoading()
        ajaxPost('order/rights/refundOrderList', { page: page, refundStatus: this.data.refundStatus}, (data) => {
            wx.hideLoading()
            callBack(data.refundOrderList)
        })
    },
    changeType: function (e) {
        let refundStatus = e.currentTarget.dataset.refundstatus;
        this.setData({
            refundStatus: refundStatus,
            page: 0
        })
        this.getData(0, (data) => {
            this.setData({
                list: data,
                loadAll: false
            })
        })
    },
    // 撤销申请
    cancelRefund:function(e){
        let refundId = e.currentTarget.dataset.id;
        console.log(refundId)
        wx.showModal({
            title: '确认撤销维权申请？',
            success: (res)=> {
                wx.showLoading()
                ajaxPost('order/rights/cancelRefund', { refundId: refundId},(data)=>{
                    wx.showToast({
                        title: '撤销成功',
                    })
                    setTimeout(()=>{
                        this.getData(0, (data) => {
                            this.setData({
                                list: data,
                                loadAll: false
                            })
                        })
                    },2000)
                })
            },
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