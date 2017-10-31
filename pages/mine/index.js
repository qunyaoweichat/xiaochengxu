import { ajaxPost} from '../public/ajax.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showDrop:false,
        userInfor:{},
        shopDetail:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu();
        this.setTitle();
        this.getData();
        this.getShopInfor();
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        // 由于微信页面的加载机制，onshow执行的慢不能在这里请求数据不然页面无法渲染,onload只执行一次，所以返回的时候数据无法重新请求，所以在onshow的 时候重新获取下本地存储更新之前修改的数据
        let userInfor = wx.getStorageSync('userInfor');
        if (userInfor){
            this.setData({
                userInfor: userInfor
            })
        }
        
    },
    getData(){
        ajaxPost('mine',{},(data)=>{
            this.setData({
                userInfor:data.mine
            })
            wx.setStorage({
                key: 'userInfor',
                data: data.mine
            })

        })
    },
    getShopInfor(){
        wx.getStorage({
            key: 'shopDetail',
            success: (res)=> {
                this.setData({
                    shopDetail: res.data
                })
            },
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
            url: '../../webIM/index/index',
        })
    },
    setTitle:function(){
        wx.setNavigationBarTitle({
            title: '个人中心',
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