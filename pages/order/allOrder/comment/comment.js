import { ajaxPost } from "../../../public/ajax.js";
Page({
    prevPage: '',
    /**
     * 页面的初始数据
     */
    data: {
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu();
        var pages = getCurrentPages();
        this.prevPage = pages[pages.length - 2];
        let orderInfor = JSON.parse(options.orderInfor);
        let submitData = new Array();
        for (let i = 0; i < orderInfor.orderShop.shopProduct.length; i++){
            submitData[i] = new Object();
            submitData[i].orderId = orderInfor.orderId;
            submitData[i].productId = orderInfor.orderShop.shopProduct[i].productId;
            submitData[i].commentContent = '';
            submitData[i].commentLevel = -1;
        }
        this.setData({
            submitData: submitData,
            orderInfor: orderInfor
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
    setStarnum:function(e){
        let index = e.currentTarget.dataset.index;
        let productIndex = e.currentTarget.dataset.productindex
        let submitData = this.data.submitData;
        submitData[productIndex].commentLevel = index
        this.setData({
            submitData: submitData
        })
    },
    setComment:function(e){
        wx.showLoading()
        let productIndex = e.currentTarget.dataset.productindex
        let commentContent = e.detail.value;
        let submitData = this.data.submitData;
        submitData[productIndex].commentContent = commentContent
        this.setData({
            submitData: submitData
        })
        wx.hideLoading()
    },
    submit:function(e){
        let params = this.data.submitData;
        for( let i=0; i< params.length; i++){
            if (params[i].commentLevel<0){
                wx.showModal({
                    title: '请完成所有评论',
                    content: '',
                    showCancel:false,
                })
                return;
            }
           
        }
        ajaxPost('product/saveReviews', { commentDataList: params} ,(data)=>{
            wx.showToast({
                title: '提交成功',
            })
            setTimeout(()=> {
                this.prevPage.getData(0, (data) => {
                    wx.pageScrollTo({
                        scrollTop: 0
                    })
                    this.prevPage.setData({
                        list: data,
                        loadAll: false
                    })
                    wx.navigateBack()
                })
            }, 2000)
            
            
        })
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