import { ajaxPost } from "../../public/ajax.js";
var WxParse = require('../../../utils/wxParse/wxParse.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let messageId = options.messageId;
        this.getData(messageId)
    },
    getData: function (messageId) {
        ajaxPost('', { messageId: messageId }, (data) => {
            let type = data.msgTrigger;
            let content = data.msgText;
            let title = data.msgTitle;
            if (type == 'push') {
                WxParse.wxParse('article', 'html', content, this, 0);
                this.setData({
                    type: type,
                    title: title
                })
            } else {
                this.setData({
                    type: type,
                    title: title,
                    content: JSON.parse(content)
                })
            }
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