import { ajaxPost } from "../../public/ajax.js";
import { hexMD5  } from "../../../utils/MD5.js";
Page({

    /**
     * 页面的初始数据
     */
    payType: '',// 根据type来判断是微信支付还是余额支付
    data: {
        payInfor: '',
        passwordArr: [],
        passwordStr: [],
        orderId: '',
        showLayer: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let orderId = options.orderId ? options.orderId : '17101910151111011004062'
        this.setData({
            orderId: orderId
        })
        this.getData(orderId)
    },
    getData: function (orderId) {
        ajaxPost('order/selPayType', { orderId: orderId }, (data) => {
            console.log(data)
            this.setData({
                payInfor: data
            })
        })
        ajaxPost('pay/wechat/app', { orderId: orderId },(data)=>{
            this.setData({
                wxPayParams: data.payRequestUrl
            })
        })
    },
    radioChange: function (e) {
        this.payType = e.detail.value;
    },
    pay: function () {
        if (this.payType == 'cashCount') {
            this.setData({
                showLayer: true
            })
        } else if (this.payType == 'weichat') {
            console.log('调用微信支付 ')
            this.wxPay()
        } else {
            wx.showToast({
                title: '请选择支付方式',
                image: '/images/icon-error.png'
            })
        }

    },
    wxPay: function () {
        let wxPayParams = JSON.parse(this.data.wxPayParams);
        console.log(wxPayParams)
        wx.requestPayment({
            timeStamp: wxPayParams.timestamp,
            nonceStr: wxPayParams.noncestr,
            package: 'prepay_id=' + wxPayParams.prepayid,
            signType: 'MD5',
            paySign: wxPayParams.sign,
            success:function(data){
                console.log('成功')
                console.log(data)
            },
            fail:function(err){
                console.log('异常')
                console.log(err)
            }
        })
    },
    yePay: function (dealPwd) {
        wx.showLoading()
        ajaxPost('pay/wallet', { orderId: this.data.orderId, dealPwd: dealPwd }, (data) => {
            wx.hideLoading()
            wx.showToast({
                title: '支付成功',
            }),
                setTimeout(function () {
                    wx.redirectTo({
                        url: '../../order/allOrder/orderList?orderType=2',
                    })
                }, 2000)
        }, (data) => {
            wx.showToast({
                title: data.retInfo,
                image: '/images/icon-error.png'
            })
            this.setData({
                passwordArr: [],
                passwordStr: []
            })
        })
    },
    // 余额支付
    setPassword: function (e) {
        let v = e.currentTarget.dataset.v;
        let passwordArr = this.data.passwordArr;
        let passwordStr = this.data.passwordStr;
        if (passwordArr.length < 6) {
            passwordArr.push(v)
            passwordStr.push("*")
            this.setData({
                passwordArr: passwordArr,
                passwordStr: passwordStr
            })
            if (passwordArr.length == 6) {
                let dealPwd = passwordArr.join('')
                this.yePay(dealPwd)
            }
        }
    },
    // 删除密码
    delPasswird: function (e) {
        let passwordArr = this.data.passwordArr;
        let passwordStr = this.data.passwordStr;
        passwordArr.pop();
        passwordStr.pop();
        this.setData({
            passwordArr: passwordArr,
            passwordStr: passwordStr
        })
    },
    hidePayLayer: function () {
        this.setData({
            showLayer: false
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