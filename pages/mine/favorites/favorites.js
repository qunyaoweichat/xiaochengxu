import { ajaxPost } from '../../public/ajax.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        type: 'goods',
        list: null,
        page: 0,
        loadAll: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu()
        this.getGoods(0, (data) => {
            this.setData({
                list: data.product
            })
        })
    },
    // 获取商品列表的接口
    getGoods: function (page, callBack) {
        wx.showLoading()
        ajaxPost('mine/collection', { type: this.data.type, page: page }, (data) => {
            callBack(data)
            wx.hideLoading()
        })
    },
    // 获取店铺列表的接口
    getShop: function (page, callBack) {
        wx.showLoading()
        ajaxPost('mine/collection', { type: this.data.type, page: page }, (data) => {
            callBack(data)
            wx.hideLoading()

        })
    },

    changeType: function (e) {
        let type = e.currentTarget.dataset.type;
        this.setData({
            page: 0,
            type: type,
            loadAll: false
        })
        if (type == 'goods') {
            this.getGoods(0, (data) => {
                this.setData({
                    list: data.product
                })
            });
        } else {
            this.getShop(0, (data) => {
                this.setData({
                    list: data.shop
                })
            });
        }
    },
    goodsRemove: function (e) {
        let productId = e.currentTarget.dataset.id;
        ajaxPost('product/markProduct', { productId: productId, isMark: 0 }, (data) => {
            wx.showToast({
                title: '取消成功',
                mask: true,
            });
            let list = this.data.list;
            for (let i = 0; i < list.length; i++) {
                if (list[i].productId == productId) {
                    list.splice(i, 1);
                }
            }
            this.setData({
                list: list
            })
        })
    },
    shopRemove: function (e) {
        let shopId = e.currentTarget.dataset.id
        ajaxPost('shop/markShop', { shopId: shopId, isMark: 0 }, (data) => {
            wx.showToast({
                title: '取消成功',
                mask: true,
            });
            let list = this.data.list;
            for (let i = 0; i < list.length; i++) {
                if (list[i].shopId == shopId) {
                    list.splice(i, 1);
                }
            }
            this.setData({
                list: list
            })
        })
    },
    onReachBottom: function () {
        console.log(this.data.loadAll)
        if (this.data.loadAll) {
            return;
        }
        wx.showNavigationBarLoading() //在标题栏中显示加载
        let page = this.data.page;
        let list = this.data.list;
        let type = this.data.type;
        page++;
        if (type == 'goods') {
            this.getGoods(page, (data) => {
                wx.hideNavigationBarLoading() //完成停止加载
                if (data.product.length == 0) {
                    this.setData({
                        loadAll: true,
                    })
                } else {
                    list = list.concat(data.product);
                }
                this.setData({
                    page: page,
                    list: list
                })
            })
        } else {
            this.getGoods(page, (data) => {
                wx.hideNavigationBarLoading() //完成停止加载
                // 更新数据，需要加上列表数据
                if (data.shop.length == 0) {
                    this.setData({
                        loadAll: true,
                    })
                } else {
                    list = list.concat(data.shop);
                }

                this.setData({
                    page: page,
                    list: list
                })
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
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})