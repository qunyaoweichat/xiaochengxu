import { ajaxPost } from "../../public/ajax.js";
import { hexMD5 } from "../../../utils/MD5.js";
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
        // 这个是为了测试，开发完后将不会是三元运算符
        let orderId = options.orderId ? options.orderId : '17110110434711275004612'
        let truePrice = options.truePrice;
        this.setData({
            orderId: orderId,
            truePrice: truePrice
        })
        this.getData(orderId)
    },
    getData: function (orderId) {
        // 获取用户信息，包括余额（接口名字气的真奇葩）
        ajaxPost('order/selPayType', { orderId: orderId }, (data) => {
            this.setData({
                payInfor: data
            })
        })
        // 获取微信预支付订单
        let loginParams = wx.getStorageSync('loginParams');
        console.log(loginParams)
        ajaxPost('pay/wechat/wap', { orderId: orderId, openId: loginParams.openid }, (data) => {
            console.log(data)
            this.setData({
                wxPayParams: data.payRequestUrl
            })
        }, (error) => {
            console.log(error)
            
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
            timeStamp: wxPayParams.timeStamp,
            nonceStr: wxPayParams.nonceStr,
            package: wxPayParams.package,
            signType: 'MD5',
            paySign: wxPayParams.paySign,
            success: function (data) {
                console.log(data)
                wx.showToast({
                    title: '支付成功',
                });
                setTimeout(function () {
                    wx.redirectTo({
                        url: '../../order/allOrder/orderList?orderType=2',
                    })
                }, 2000)
            },
            fail: function (err) {
                wx.showToast({
                    title: '支付失败',
                });
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
            });
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