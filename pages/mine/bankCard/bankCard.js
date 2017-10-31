import { ajaxPost } from '../../public/ajax.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        cardList:null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu();
        this.getData();
    },
    getData: function () {
        ajaxPost('bank/bankCardList', { page: 0, total:10},(data)=>{
            // 将卡号截取后三位 本来应该后端裁剪的，蛋疼
            for (let i = 0; i < data.bankCardList.length; i++){
                data.bankCardList[i].cardNo = data.bankCardList[i].cardNo.substring(data.bankCardList[i].cardNo.length - 3, data.bankCardList[i].cardNo.length)
            }
            this.setData({
                cardList: data.bankCardList
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
        this.getData()
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