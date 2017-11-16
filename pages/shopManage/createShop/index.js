// pages/shopManage/createShop/index.js
import { ajaxPost } from '../../public/ajax.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        creatShopStep: 1,
        //  第一步的数据，保存店铺信息的数据
        categoryList: [],//主营类目
        addressArea: ['请选择省', '请选择市', '请选择区'],
        isChangeArea: false,//是否选择地址，防止将上面的addressArea提交上去
        // 验证信息
        errMsg: '',
        // 第二步，选择模板
        tplId:'',
        // 第三步的店铺id
    },
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getCategory();
        this.getPrice();
    },
    getCategory: function () {
        // 获取分类
        ajaxPost('shop/apply/getCategorys', {}, data => {
            this.setData({
                categoryList: data.oneClass
            })
        })        
    },
    getTpl: function (params) {
        // 获取店铺模板
        ajaxPost('shop/apply/getShopTemplates?shopId=' + params.shopId + '&fromShopId=' + params.fromShopId, {}, data => {
            console.log(data);
            this.setData({
                creatShopStep: 2,
                tempList: data.tempList
            })
        })
    },

    getPrice: function () {
        // 获取价格数据
        ajaxPost('shop/apply/getOpenShopPirceData', {}, data => {
            console.log(data);
            this.setData({
                goodsList: data.goodsList
            })
        })
    },
    // 分类改变的方法
    changeCategory: function (e) {
        var index = e.detail.value;
        console.log(this.data.categoryList[index].name);
        console.log(this.data.categoryList[index].classId)
        this.setData({
            categoryName: this.data.categoryList[index].name,
            categoryId: this.data.categoryList[index].classId
        })
    },
    
    // 修改的地址
    bindRegionChange: function (e) {
        console.log(e.detail.value)
        this.setData({
            addressArea: e.detail.value,
            isChangeArea: true
        })
    },
    // 提交店铺信息
    submitShopInfor:function(e){
        var shopNameReg = /^[\u4E00-\u9FA5A-Za-z0-9]{4,8}$/;
        var addressReg = /^[\u4E00-\u9FA5A-Za-z0-9]{5,20}$/;
        var params = e.detail.value;
        params.areaInfo = params.areaInfo.join(" ")
        if (this.data.categoryId){
            params.categoryId = (this.data.categoryId).toString();
        }
        if (!shopNameReg.test(params.shopName)){
            this.setData({
                errMsg:"请输入4-8位用户名"
            })
            return;
        }
        if (!params.categoryId) {
            this.setData({
                errMsg: "请选择分类"
            });
            return;
        }
        if (!this.data.isChangeArea){
            this.setData({
                errMsg: "请选择店铺地址"
            });
            return;
        }
        if (!addressReg.test(params.address)) {
            this.setData({
                errMsg: "请输入5-20位详细地址"
            });
            return;
        }
        this.setData({
            errMsg: ""
        })
        // 提交店铺信息成功后返回店铺id
        ajaxPost("shop/apply/saveShopinfo",params,data=>{
            var fromShopId = wx.getStorageSync("shopId")
            var shopId = data.shopInfoBo.shopId
            this.setData({
                fromShopId: fromShopId,
                shopId: shopId,
            })
            this.getTpl({ fromShopId: fromShopId, shopId: shopId})
        })

        
    },
    
    selectTpl: function(e) {
        this.setData({
            tplId: e.currentTarget.dataset.id
        })
    },
    submitTpl:function(){
        var shopId = this.data.shopId;
        var templateId = this.data.tplId;
        ajaxPost("shop/apply/setShopTemplate", { shopId: shopId, templateId: templateId},data=>{
            this.setData({
                creatShopStep: 3,
            })
            this.getPrice();
        })
    },
    // 选择服务
    selectGoods: function (e) { 
        this.setData({
            goodsId: e.currentTarget.dataset.id
        })
    },
    payOrder:function(){
        var params ={
            goodsId: this.data.goodsId,
            fromShopId: this.data.fromShopId,
            shopId: this.data.shopId,
        }
        // var params = {
        //     goodsId: this.data.goodsId,
        //     fromShopId: 4,
        //     shopId: 16000328,
        // }
        if (!params.goodsId){
            wx.showToast({
                title: '请选择服务',
                image:'/images/icon-error.png'
            })
            return;
        }
        // 获取订单号
        ajaxPost("shop/apply/createShopOrder",params,data=>{
            console.log(data);
            this.getPrevOrder(data.orderId);

        })
    },
    // 获取预支付订单
    getPrevOrder:function(orderId){
        let loginParams = wx.getStorageSync('loginParams');
        ajaxPost('pay/wechat/wap', { orderId: orderId, openId: loginParams.openid }, (data) => {
            console.log(data)
            this.wxPay(data.payRequestUrl);
        }, (error) => {
            console.log(error)
            wx.showToast({
                title: '支付接口未开发',
            })
        })
    },
    // 调用微信支付
    wxPay: function (wxPayParams) {
        var wxPayParams = JSON.parse(wxPayParams);
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
                setTimeout( ()=> {
                    wx.redirectTo({
                        url: '../shopSuccess/index?shopId='+this.data.shopId,
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