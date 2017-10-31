// pages/mine/contact/contact.js
var WxParse = require('../../../utils/wxParse/wxParse.js');
import { ajaxPost } from "../../public/ajax.js";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list:[]

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu();
        // 从本地拿到shopId 并调用数据
        wx.getStorage({
            key: 'shopDetail',
            success: (res)=> {
                this.getData(res.data.shopId)
            },
        })
        
    },

    getData: function (shopId) {
        console.log(shopId)
        ajaxPost('shop/shopInfoCompanyCard', { shopId:shopId},(data)=>{
            console.log(data)//在调试器打印输出，写完可以删掉
            data.shopCompanyCard.qualification = data.shopCompanyCard.qualification.split(",")
            WxParse.wxParse('craftwork', 'html', data.shopCompanyCard.craftwork, this, 0);
            WxParse.wxParse('teamGraceful', 'html', data.shopCompanyCard.teamGraceful, this, 0);
            this.setData({
                list: data.shopCompanyCard
                
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