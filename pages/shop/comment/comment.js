import { ajaxPost } from "../../public/ajax.js";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        
        productId: '',
        commentType: 0,
        comment: '',
        starNum: 1,
        page: 0,
        loadAll: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu()
        this.setData({
            productId: options.id
        })
        this.getData(0,(data)=>{
            this.setData({
                comment: data
            })
        })
    },
    getData: function (page, callBack) {
        ajaxPost('product/commentList', {
            productId: this.data.productId,
            commentType: this.data.commentType,
            total: 10,
            page: page
        }, (data) => {
            callBack(data)
        })
    },
    changeType: function (e) {
        let commentType = e.currentTarget.dataset.type;
        this.setData({
            commentType: commentType,
            page: 0,
            loadAll: false
        })
        this.getData(0, (data) => {
            this.setData({
                comment: data,
                
            })
            
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
        let comment = this.data.comment;
        page++;
        this.getData(page, (data) => {
            wx.hideNavigationBarLoading() //完成停止加载
            wx.stopPullDownRefresh() //停止下拉刷新
            // 更新数据，需要加上列表数据
            console.log(data.commentList)
            if (data.commentList.length == 0) {
                this.setData({
                    loadAll: true
                })
            }
            comment.commentList = comment.commentList.concat(data.commentList);
            this.setData({
                page: page,
                comment: comment
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