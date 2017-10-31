import { ajaxPost } from '../../../public/ajax.js'
Page({
    prePage: {},
    /**
     * 页面的初始数据
     */
    data: {
        errMsg: '',
        getCodeFlag: false,
        getCodeStr: '获取验证码',
        bankIndex: 0,
        bankCodeId: null,
        bankList: null,
        bankCodeId: '',
        agreen:false
    },
    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {
        wx.hideShareMenu();

        var pages = getCurrentPages();
        this.prevPage = pages[pages.length - 2];
        this.getData();
    },
    getData: function () {
        ajaxPost('bank/bankCodeList', {}, (data) => {
            console.log(data)
            this.setData({
                bankList: data.bankCodeList
            })
        })
    },
    setPhone: function (e) {
        this.setData({
            phone: e.detail.value
        })
    },
    bindPickerChange: function (e) {
        this.setData({
            bankIndex: e.detail.value,
        })
    },
    getCode: function () {
        let phoneReg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
        if (!phoneReg.test(this.data.phone)) {
            this.setData({
                errMsg: '请输入正确的手机号',
            })
            return;
        }
        ajaxPost('sms/sendVerifyCode', { phone: this.data.phone }, (data) => {
            wx.showToast({
                title: '发送成功',
            })
            let time = 120;
            let that = this;
            if (!that.data.getCodeFlag) {
                that.setData({
                    getCodeFlag: true
                })
                let timeout = setInterval(function () {
                    if (time > 1) {
                        time--;
                        that.setData({
                            getCodeStr: time + '后再次获取',
                        })

                    } else {
                        that.setData({
                            getCodeStr: '获取验证码',
                            getCodeFlag: false
                        })
                        clearInterval(timeout)
                    }
                }, 1000)
            }
        })

    },
    agreenEvent:function(){
        this.setData({
            agreen:!this.data.agreen
        })
    },
    submit: function (e) {
        let params = e.detail.value;
        if (!this.data.agreen) {
            this.setData({
                errMsg: '请先阅读并同意服务条款'
            })
            return;
        }
        let userNameReg = /^[\u4e00-\u9fa5]{2,5}$/;
        let phoneReg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
        params.bankCodeId = this.data.bankList[this.data.bankIndex].bankCodeId
        console.log(params)
        if (!params.cardAccountName) {
            this.setData({
                errMsg: '请输入正确的姓名'
            })
            return;
        }
        if (phoneReg.test(!params.phone)) {
            this.setData({
                errMsg: '请输入正确的手机号码'
            })
            return;
        }
        
        if (params.cardNo.length != 16 && params.cardNo.length != 19) {
            this.setData({
                errMsg: '请输入正确的银行卡号'
            })
            return;
        }
        
        this.setData({
            errMsg: ''
        })
        ajaxPost('bank/saveBankCard',params,(data)=>{
            wx.showToast({
                title: '添加成功',
            })
            this.prevPage.getData()
            setTimeout(function(){
                wx.navigateBack()
            },2000)
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