import { ajaxPost } from "../../../public/ajax.js";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        reason:'',//售后原因，由原因列表传过来
        data: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let data = JSON.parse(options.params);
        this.setData({
            data: data
        })
        wx.hideShareMenu()
    },
    submit:function(){
        let data=this.data.data;
        if (!this.data.reason){
            wx.showToast({
                title: '请选择原因',
                image: '/images/icon-error.png'
            });
            return;
        }
        let orderId = data.refundOrderInfo.orderId;
        let orderItemId = data.orderItemId;
        let memberRefundInfo = {
            refundType: data.memberRefundInfo.refundType,
            refundMoney: data.memberRefundInfo.refundMoney,
            mobile: data.memberRefundInfo.mobile,
            refundReason:this.data.reason.msg,
            remark:''
        }
        ajaxPost('order/rights/createRefundOrder',{ orderId:orderId, orderItemId:orderItemId,memberRefundInfo:memberRefundInfo},
        (data)=>{
            wx.showToast({
                title: '提交成功',
            });
            setTimeout(function(){
                wx.navigateBack()
            })
        }, (data) =>{
            if (data.retCode='99999'){
                wx.showModal({
                    title: '已经申请，请勿重复提交',
                    showCancel:false
                })
            }else{
                wx.showToast({
                    title: '请求异常',
                    image: '/images/icon-error.png'
                });
            }
            
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
        console.log(this.data.reason)
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