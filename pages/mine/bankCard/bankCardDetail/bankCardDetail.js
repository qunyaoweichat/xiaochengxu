import { ajaxPost } from '../../../public/ajax.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showLayer:false,
        dealPwd:'',
        cardInfor:null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu();
        ajaxPost('bank/viewBankCard', { bankId: options.id},(data)=>{
            console.log(data)
            this.setData({
                cardInfor: data.bankCard
            })
        })
    },
    setPaypassword:function(e){
        console.log(e)
        this.setData({
            dealPwd: e.detail.value
        })
    },
    showLayer:function(){
        this.setData({
            showLayer:true
        })
    },
    hideLayer: function () {
        this.setData({
            showLayer: false
        })
    },
    delCard:function(){
        console.log(this.data);
        ajaxPost('bank/unBindBankCard', { bankId: this.data.cardInfor.bankId, dealPwd: this.data.dealPwd }, (data) => {
            wx.showToast({
                title: '删除成功',
            })
            setTimeout(function () {
                wx.navigateBack({

                })
            }, 2000)
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