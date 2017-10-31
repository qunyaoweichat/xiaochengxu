import { ajaxPost } from "../../public/ajax.js";
Page({
    prevPage:'',
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
        let pages = getCurrentPages();
        this.prevPage = pages[pages.length - 2];
        this.getData();
    },

    getData:function(){
        wx.showLoading()
        ajaxPost('search', {}, (data) => {
            wx.hideLoading()
            this.setData({
                list: data.keyword
            })
        })
        // 从历史中获取搜索历史
        wx.getStorage({
            key: 'keywordHistory',
            success: (res)=> {
                this.setData({
                    keywordHistory:res.data
                })
            },
        })
    },
    searchGoods: function (e) {
        let keywords = e.detail.value;
        if (!keywords){
            keywords = e.currentTarget.dataset.keyword;
        }
        this.prevPage.searchGoods(keywords);
    },
    // 清空历史记录
    clearStorage:function(){
        wx.removeStorage({
            key: 'keywordHistory',
            success: (res)=> {
                wx.showToast({
                    title: '清除成功',
                })
                this.setData({
                    keywordHistory:[]
                })
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