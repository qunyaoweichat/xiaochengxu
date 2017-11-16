import { ajaxPost } from "../public/ajax.js";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        newsList:[],
        list: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu()
        this.getData()
    },
    getData: function () {
        let loadAll = this.data.loadAll;
        let list = this.data.list;
        let page = this.data.page;
        // 如果全加载了 就不再请求
        if (loadAll) {
            return;
        }
        ajaxPost('mine/news/newsList', {}, data => {
            wx.hideLoading()
            this.setData({
                newsList: data.newsList
            })
        })
        ajaxPost("mine/news/getHuanxinRecentChat", {}, data=>{
            wx.hideLoading()
            wx.hideNavigationBarLoading()
            if (page > 0) {
                if (data.contactList.length > 0) {
                    list = list.concat(data.contactList)
                } else {
                    loadAll = true;
                }
            } else {
                list = data.contactList;
            }
            // console.log(list)
            page++;
            this.setData({
                list: list,
                page: page,
                loadAll: loadAll
            })
        })
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        wx.showNavigationBarLoading()
        this.getData()
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