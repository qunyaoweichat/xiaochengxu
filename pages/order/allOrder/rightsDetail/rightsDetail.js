import { ajaxPost } from "../../../public/ajax.js";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderDetail: {},//页面的数据
        goodsList: {}, //商品列表提出来，方便操作
        orderItemId: [],
        checkAll: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu()

        let orderId = options.orderId ? options.orderId : '17101616061011218004495'; //?后面的是测试数据，可以删除的
        this.setData({
            orderId: orderId
        })
        this.getData(orderId)

    },
    getData: function (orderId) {
        wx.showLoading()
        ajaxPost('order/rights/queryOrderDetail', { orderId: orderId }, (data) => {
            wx.hideLoading()
            let goodsList = data.refundOrderInfo.listOrderItem;
            for (var i = 0; i < goodsList.length; i++) {
                goodsList[i].checked = false
            }
            this.setData({
                orderDetail: data,
                goodsList: goodsList
            })
        })
    },
    selectAll: function () {
        let checkAll = this.data.checkAll;
        let goodsList = this.data.goodsList;
        let orderItemId = this.data.orderItemId;//将选中的id保存到数组里面 提交哪里会用到
        // 如果点击时候是true 那么就是置为false，需要将选择的数组清空，否则就遍历商品将全部数据塞到 orderItemId里
        if (checkAll){
            orderItemId=[]
            for (var i = 0; i < goodsList.length; i++) {
                goodsList[i].checked = false;
            }
        }else{
            for (var i = 0; i < goodsList.length; i++) {
                goodsList[i].checked = true;
                orderItemId.push(goodsList[i].itemId);
            }
        }
        this.setData({
            checkAll: !checkAll,
            goodsList: goodsList,
            orderItemId: orderItemId
        })
    },
    removeByValue: function (val) {
        let arr = this.data.orderItemId
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == val) {
                arr.splice(i, 1);
                break;
            }
        }
        return arr;
    },
    goodsSelect(e) {
        let checked = e.currentTarget.dataset.checked;
        let index = e.currentTarget.dataset.index;
        let checkAll = this.data.checkAll;
        let goodsList = this.data.goodsList;
        let orderItemId = this.data.orderItemId;//将选中的id保存到数组里面 提交哪里会用到
        goodsList[index].checked = !checked;
        if (checked) {
            checkAll = false;
            orderItemId = this.removeByValue(goodsList[index].itemId)
        } else {
            orderItemId.push(goodsList[index].itemId);
            checkAll = true;
            for (var i = 0; i < goodsList.length; i++) {
                if (!goodsList[i].checked) {
                    checkAll = false;
                    break;
                }
            }
        }
        this.setData({
            checkAll: checkAll,
            goodsList: goodsList,
            orderItemId: orderItemId
        })
    },
    submit: function () {
        if (this.data.orderItemId.length==0){
            wx.showToast({
                title: '请选择商品',
                image:'/images/icon-error.png'
            });
            return;
        }
        wx.showLoading()
        ajaxPost('order/rights/confirmRefundItem', { orderId: this.data.orderId, orderItemId: this.data.orderItemId }, (data) => {
            wx.hideLoading()
            data.orderItemId = this.data.orderItemId;//将选择的商品id数组传过去， 下个页面就不用再组织了
            wx.redirectTo({
                url: '../confirmRights/confirmRights?params='+JSON.stringify(data),
            })
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