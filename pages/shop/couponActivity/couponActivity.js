import { ajaxPost } from "../../public/ajax.js";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        couponDetail: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let couponActivityId = options.couponActivityId;
        ajaxPost('coupon/couponActivityInfo', { couponActivityId: couponActivityId},(data)=>{
            this.setData({
                couponActivityId: couponActivityId,
                couponDetail: data.shopCouponActivity
            })
        })
        
    },
    getCoupon:function(){
        ajaxPost('coupon/receiveCoupon', { couponActivityId: this.data.couponActivityId},(data)=>{
            wx.showToast({
                title: '领取成功',
            })
        },(data)=>{
            wx.showModal({
                title: '提示',
                content: '优惠劵已领取完',
            })
        })
    },
    back:function(){
        wx.navigateBack()
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

    onShareAppMessage: function (res) {
        let page = getCurrentPages();
        let path = page[page.length - 1].route ;
        return {
            title: '快来领取优惠券吧',
            path: path,
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    }
})