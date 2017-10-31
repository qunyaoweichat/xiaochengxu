import { ajaxPost } from "../../../public/ajax.js";
Page({
    prePage:{},
    /**
     * 页面的初始数据
     */
    data: {
        data:{},
        cardList:[]
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
        ajaxPost('mine/wallet/accountCashEncash',{},(data)=>{
            let cardList = data.userBankCardList;
            for (var i = 0; i < cardList.length; i++){
                cardList[i].cardNo = cardList[i].cardNo.substring(cardList[i].cardNo.length - 4, cardList[i].cardNo.length)
            }
            this.setData({
                data: data,
                cardList: cardList
            })
        })
    },
    radioChange:function(e){
        this.setData({
            bankId:e.detail.value
        })
    },
    submit:function(e){
        if (!this.data.bankId){
            wx.showToast({
                title: '请选择银行卡',
                image:'/images/icon-error.png'
            })
            return;
        }
        let params = e.detail.value;
        params.bankId = this.data.bankId;
        ajaxPost('mine/wallet/createAccountEncashOrder', params,(data)=>{
            wx.showToast({
                title: '提交成功',
            })
            this.prevPage.getData();
            setTimeout(function(){
                wx.navigateBack()
            },2000)
        },(data)=>{
            wx.showToast({
                title: data.retInfo,
                image: '/images/icon-error.png'
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