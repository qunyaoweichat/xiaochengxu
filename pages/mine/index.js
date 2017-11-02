import { ajaxPost} from '../public/ajax.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showDrop:false,
        userInfor:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu();        
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getData();        
    },
    getData(){
        ajaxPost('mine',{},(data)=>{
            let shopId = wx.getStorageSync("shopId");
            this.setData({
                userInfor:data.mine,
                shopId: shopId
            })
        })
    },
    //展示隐藏分组
    toggleDrop: function () {
        this.setData({
            'showDrop': !this.data.showDrop
        })
    },
    hideDrop: function () {
        this.setData({
            'showDrop': false
        })
    },
    // 收藏
    collector: function () {
        this.setData({
            'collector': !this.data.collector
        })
    },
    // 联系商家
    contactBuss: function () {
        wx.navigateTo({
            url: '../../webIM/index/index?shopId='+this.data.shopId,
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

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