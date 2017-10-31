import { ajaxPost } from "../../public/ajax.js";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        page:0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading()
        this.getData()
    },
    getData: function () {
        let loadAll = this.data.loadAll;
        let list = this.data.list ? this.data.list : [];
        let page = this.data.page;
        // 如果全加载了 就不再请求
        if (loadAll){
            return;
        }
        
        ajaxPost('mine/news/systemMsgList', { page: page}, (data) => {
            wx.hideLoading()
            wx.hideNavigationBarLoading()
            if (page > 0) {
                if (data.messageList.length > 0) {
                    list = list.concat(data.messageList)
                } else {
                    loadAll = true;
                }
            } else {
                list = data.messageList;
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
    goDetail:function(e){
        let params = e.currentTarget.dataset.params;
        console.log(params.msgText)
        wx.navigateTo({
            url: '' + params.msgTrigger + '&content=' + params.msgText + '&title=' + params.msgTitle
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