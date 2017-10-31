import { ajaxPost } from '../../public/ajax.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        AllData: '',//全部数据
        address:{},
        cartList: {},
        shopCouponList:{},

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let data = JSON.parse(options.data);
        this.setData({
            AllData: data,
            address: data.address,
            cartList: data.shopList,
            shopCouponList: data.shopCouponList
        })
    },
    goCoupon:function(){
        let params='';
        let shopCouponList = this.data.AllData.shopCouponList
        if (shopCouponList.length>0){
            params = JSON.stringify(shopCouponList)
        }
        wx.navigateTo({
            url: '../coupon/coupon?shopCouponList=' + params
        })
    },
    setRemark:function(e){
        let data = this.data.AllData;
        let index = e.currentTarget.dataset.index;
        let value = e.detail.value;
        data.shopList[index].userRemark =value;
    },
    creatOrder:function(){
        // 先将店铺选中元素为空的数据剔除出来，再生成订单
        let params = this.data.AllData;
        ajaxPost('order/create', params,(data)=>{
            wx.redirectTo({
                url: '../pay/pay?orderId=' + data.orderId,
            })
        })
        return;
        
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