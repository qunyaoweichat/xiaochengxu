import { ajaxPost } from "../../../public/ajax.js";
Page({

    /**
     * 页面的初始数据
     */
    data: {

        tabs: [
            {
                name: '全部',
                incomeType: null
            },
            {
                name: '收入',
                incomeType: 'In'
            },
            {
                name: '支出',
                incomeType: 'Out'
            }
        ],
        list: [],
        page: 0,
        incomeType: null,
        loadAll: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu()

        this.getData(0, (data) => {
            this.setData({
                list: data.cashAccountMonthList
            })
        });
    },

    getData: function (page,callBack) {
        ajaxPost('mine/wallet/queryCashAccountMonthList', { incomeType: this.data.incomeType, page: page, total: 10 }, (data) => {
            console.log(data)
            callBack(data);
        })
    },

    changeType: function (e) {
        let incomeType = e.currentTarget.dataset.type;
        this.setData({
            incomeType: incomeType
        })
        this.getData(0, (data) => {
            this.setData({
                list: data.cashAccountMonthList,
                loadAll: false
            })
        });
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
            if (data.cashAccountMonthList.length == 0) {
                this.setData({
                    loadAll: true
                })
            }
            list = list.concat(data.cashAccountMonthList);
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