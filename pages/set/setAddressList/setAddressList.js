import { ajaxPost } from '../../public/ajax.js';
Page({
    prevPage:'',
    from:'',
    /**
     * 页面的初始数据
     */
    data: {
        addressList:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var pages = getCurrentPages();
        this.prevPage = pages[pages.length - 2];
        this.from = options.from
        wx.hideShareMenu()
        this.getData();
    },
    getData:function(){
        ajaxPost('mine/addressList', {}, (data) => {
            this.setData({
                addressList: data.addressList
            })
        })
    },
    goEdt:function(e){
        var index = e.currentTarget.dataset.index;
        var params = this.data.addressList[index];
        wx.navigateTo({
            url: './addAddress/addAddress?params=' + JSON.stringify(params),
        })
    },
    // 下单页面会用到这个方法
    setAdress:function(e){
        var index = e.currentTarget.dataset.index;
        var data = this.data.addressList[index];
        if(this.from){
            this.prevPage.setData({
                address: data
            })
            wx.navigateBack({
                
            })
        }
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