//  这边需要将富文本转成微信的结构，这里引入的是wxParse这个框架。
// 选择商品这块逻辑：点击参数后获取到当前点击的是productSelectList 这个数组里的哪一个对象，然后将点击元素的data-id 存入 selectSku这个数组里面的index的位置，然后将selectSku这个数组转成字符串 在skuTable 这个里面做匹配，获取到匹配到的对象的sku
// 
import { ajaxPost } from "../../public/ajax.js";
var WxParse = require('../../../utils/wxParse/wxParse.js');
Page({
    data: {
        // 页面渲染
        productId: '',
        product: {},
        isMark: 0,
        // 选择商品相关
        productSelect: '',//选中的属性中文名
        productSelectSku: new Array(), //选中skuId
        productSkuList: new Array(), // sku对照表
        productCount: 1,
        showSkuLayer: false,
        showDetail: true,
        cartAddParams: {}
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            productId: options.id,
            redirect: options.redirect
        })
        this.getData(options.id)
    },
    numberLayerCtrl: function () {
        this.setData({
            showSkuLayer: !this.data.showSkuLayer
        })
    },
    // 加入收藏
    collector: function () {
        let isMark = this.data.isMark == 0 ? 1 : 0;
        ajaxPost('product/markProduct', { productId: this.data.productId, isMark: isMark }, (data) => {
            let msg = isMark == 0 ? '取消成功' : '收藏成功';
            wx.showToast({
                title: msg,
                mask: true,
            })
            this.setData({
                isMark: isMark
            })
        })

    },
    getData(productId) {
        ajaxPost('product/isMarkProduct', { productId: productId }, (data) => {
            this.setData({
                isMark: data.isMark
            })
        })
        ajaxPost('product/detail', { productId: productId }, (data) => {
            let product = data.product;
            var that = this;
            WxParse.wxParse('article', 'html', product.productDesc, that, 0);
            this.setData({
                product: product,
                productCount: product.productCount,
                productSelect: product.productSelect,
                productSelectSku: product.productSelectSku,
                productSkuList: product.productSkuList,
                cartAddParams: {
                    productSkuId: product.productSkuId,
                    productId: product.productId,
                    productCount: product.productCount
                }
            })
            wx.setNavigationBarTitle({
                title: data.product.productTitle,
            })
        })
    },
    // 弹窗里面的点击事件
    skuCtrl: function (e) {
        let index = e.currentTarget.dataset.index;
        let id = e.currentTarget.dataset.id;
        let productSelectSku = this.data.productSelectSku;
        productSelectSku[index] = id;
        this.setData({
            productSelectSku: productSelectSku
        })
    },
    addCount: function () {
        let productCount = this.data.productCount;
        let productStock = this.data.product.productStock;
        if (productCount < productStock) {
            productCount++;
            this.setData({
                productCount: productCount
            })
        }
    },
    subtractCount: function () {
        let productCount = this.data.productCount;
        console.log(productCount)
        if (productCount > 1) {
            productCount--
            this.setData({
                productCount: productCount
            })
        }
    },
    setCount: function (e) {
        let productCount = e.detail.value;
        let productStock = this.data.product.productStock;
        if (productCount <= productStock) {
            this.setData({
                productCount: productCount
            })
        } else {
            this.setData({
                productCount: productStock
            })
        }


    },
    // 弹窗里面的确定
    selectGoods: function () {
        let productSkuList = this.data.productSkuList;
        let productSelectSku = this.data.productSelectSku.join(',');
        let selectData = {};
        for (let i = 0; i < productSkuList.length; i++) {
            if (productSkuList[i].attrbuteIdlist == productSelectSku) selectData = productSkuList[i];
        }
        this.setData({
            showSkuLayer: false,
            productSelect: selectData.attrbuteNamelist,
            cartAddParams: {
                productSkuId: selectData.skuId,
                productId: selectData.goodsId
            }
        })
    },
    addCart: function () {
        let params = this.data.cartAddParams;
        params.productCount = this.data.productCount;
        console.log(params);
        ajaxPost('cart/add', params, (data) => {
            wx.showToast({
                title: '添加成功',
            })
        })
    },
    goBuy: function () {
        wx.showLoading()
        let params = this.data.cartAddParams;
        params.productCount = this.data.productCount;
        params.shopId = this.data.product.productShop.shopId;
        console.log(params);
        ajaxPost('order/buyNow', { product: params }, (data) => {
            wx.hideLoading()
            wx.navigateTo({
                url: '../../buy/confirmOrder/confirmOrder?data=' + JSON.stringify(data),
            })
        })
    },
    showDetail: function () {
        this.setData({
            showDetail: true,
        })
    },
    showRecommend: function () {
        this.setData({
            showDetail: false,
        })
    },
    goShopindex: function () {
        wx.navigateBack()
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        let page = getCurrentPages();
        let path = page[page.length - 1].route + '?id=' + this.data.productId
        return {
            title: this.data.product.productTitle,
            path: path,
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
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
        console.log(11)
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },


})