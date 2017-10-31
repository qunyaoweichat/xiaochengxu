// pages/buy/car.js
import { ajaxPost } from '../public/ajax.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        checkAll: false,
        price: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu();
        let redirect = options.redirect;
        ajaxPost('cart', {}, (data) => {
            //给每个店铺和每个商品都加上checked属性，在选择时候会用到
            for (let i = 0; i < data.cart.length; i++) {
                data.cart[i].edt = false;
                data.cart[i].checked = false;
                for (let o = 0; o < data.cart[i].shopProduct.length; o++) {
                    data.cart[i].shopProduct[o].checked = false;
                }
            }
            this.setData({
                cartList: data.cart,
                redirect: redirect
            })
            this.getPrice()
        })
    },
    checkAll: function (e) { // 全选
        let data = this.data.cartList;
        let length = e.detail.value.length;
        if (length == 0) {
            for (let i = 0; i < data.length; i++) {
                data[i].checked = false;
                for (let o = 0; o < data[i].shopProduct.length; o++) {
                    data[i].shopProduct[o].checked = false;
                }
            }
        } else {
            for (let i = 0; i < data.length; i++) {
                data[i].checked = true;
                for (let o = 0; o < data[i].shopProduct.length; o++) {
                    data[i].shopProduct[o].checked = true;
                }
            }
        }
        this.setData({
            cartList: data
        })
        this.getPrice()
    },
    checkShop: function (e) {
        //选择店铺 每次点击，如果当前是选中，就将该店铺下的商品全选，如果是位选中，就将该店铺下的商品置为全不选，
        //如果点击选中的时候，遍历数据，判断每个店铺是否选中，如果都选中就是全选，如果有一个没选中就是没全选
        let data = this.data.cartList;
        let index = e.currentTarget.dataset.index;
        let checked = e.currentTarget.dataset.checked;
        let checkAll = true;
        data[index].checked = !checked;
        if (checked) {
            for (let i = 0; i < data[index].shopProduct.length; i++) {
                data[index].shopProduct[i].checked = false;
            }
            checkAll=false;
        } else {
            for (let i = 0; i < data[index].shopProduct.length; i++) {
                data[index].shopProduct[i].checked = true
            }
            for( let o=0; o<data.length; o++){
                if (!data[o].checked){
                    checkAll=false;
                    break;
                }
            }
        }
        
        this.setData({
            checkAll: checkAll,
            cartList: data
        })
        this.getPrice()
    },
    checkGoods:function(e){
        
        let data = this.data.cartList;
        let index = e.currentTarget.dataset.index;
        let goodsindex = e.currentTarget.dataset.goodsindex;
        let checked = e.currentTarget.dataset.checked;
        let checkAll = true;
        data[index].shopProduct[goodsindex].checked = !checked;
        console.log('-----选中的：' +goodsindex,checked+'-------------')
        if (checked){
            data[index].checked = false;
            checkAll = false;
        }else{
            for (var  i = 0; i < data[index].shopProduct.length; i++) {
                // console.log(data[index].shopProduct[i].checked)
                if (!data[index].shopProduct[i].checked){
                    data[index].checked=false;
                    break;
                }
            }
            // 如果全为false 就将店铺选中
            if (i == data[index].shopProduct.length){
                data[index].checked = true;
            }
            for (let o = 0; o < data.length; o++) {
                if (!data[o].checked) {
                    checkAll = false;
                    break;
                }
            }
            
        }
        this.setData({
            checkAll: checkAll,
            cartList: data
        })
        this.getPrice()
    },
    // 控制显示和隐藏删除按钮
    shopEdt:function(e){
        let data = this.data.cartList;
        let index = e.currentTarget.dataset.index;
        data[index].edt = !data[index].edt
        this.setData({
            cartList:data
        })
    },
    
    // 购物车删除
    delGoods:function(e){
        let data = this.data.cartList;
        let itemId = e.currentTarget.dataset.id;
        let index = e.currentTarget.dataset.index;
        let goodsindex = e.currentTarget.dataset.goodsindex;
        
        ajaxPost('cart/delete', { productItemIds: [itemId]}, result=>{
            data[index].shopProduct.splice(goodsindex, 1);
            if (data[index].shopProduct.length==0){
                data.splice(index,1)
            }
            console.log(data)
            this.setData({
                cartList: data
            })
            this.getPrice();
        })
    },
    // 修改数量
    edtGoods: function (item, productCount){
        
        item.productCount = productCount;
        let params = {
            productItmes: [item]
        }
        console.log(params)
        ajaxPost('cart/edit', params,(data)=>{
            console.log(data)
        })
    },
    addCount: function (e) { //根据index和goodsIndex定位到该商品的数据， 然后拿到后进行计算
        let data = this.data.cartList;
        let index = e.currentTarget.dataset.index;
        let goodsindex = e.currentTarget.dataset.goodsindex;

        let item = data[index].shopProduct[goodsindex]
        let productCount = item.productCount
        productCount = productCount > 200 ? '200' : ++productCount;
        data[index].shopProduct[goodsindex].productCount = productCount;
        this.setData({
            cartList: data
        })
        this.edtGoods(item, productCount)
        this.getPrice()
    },
    subtractCount: function (e) {
        let data = this.data.cartList;
        let index = e.currentTarget.dataset.index;
        let goodsindex = e.currentTarget.dataset.goodsindex;
        let item = data[index].shopProduct[goodsindex]
        let productCount = item.productCount;
        productCount = productCount ==1 ? '1' : --productCount;
        data[index].shopProduct[goodsindex].productCount = productCount;
        this.setData({
            cartList: data
        })
        this.edtGoods(item, productCount)
        this.getPrice()
    },
    setCount: function (e) {
        let data = this.data.cartList;
        let index = e.currentTarget.dataset.index;
        let goodsindex = e.currentTarget.dataset.goodsindex;
        let item = data[index].shopProduct[goodsindex]
        let productCount = e.detail.value;
        if (productCount > 200){
            productCount=200;
        } else if (productCount==0){
            productCount=1;
        }
        data[index].shopProduct[goodsindex].productCount = productCount;
        this.setData({
            cartList: data
        })
        this.edtGoods(item, productCount)
        this.getPrice()
    },

    // 计算价格
    getPrice: function (e) {
        let data = this.data.cartList;
        let price = 0;
        for (let i = 0; i < data.length; i++) {
            for (let o = 0; o < data[i].shopProduct.length; o++) {
                if (data[i].shopProduct[o].checked) {
                    price += data[i].shopProduct[o].productCount * data[i].shopProduct[o].productPrice
                }
            }
        }
        this.setData({
            price: price.toFixed(2)
        })
    },
    // 去下单页面
    goConfirm:function(){
        let data = this.data.cartList;
        let selecNum=0;
        //  遍历数据如果没选中的 那么就不允许跳转
        for (let i = 0; i < data.length; i++) {
            for (let o = 0; o < data[i].shopProduct.length; o++) {
                if (data[i].shopProduct[o].checked) {
                    selecNum+=1;
                }
            }
        }
        if (selecNum==0){
            wx.showToast({
                title: '请选择商品',
                image: '/images/icon-error.png',
            })
            return;
        }

        // 将没选中的商品剔除 下面这个是深度复制，别乱改，不然购物车数据会异常
        let shopList = JSON.parse(JSON.stringify(data))
        for (let i = 0; i < shopList.length; i++) {
            for (let o = 0, flag = true; o < shopList[i].shopProduct.length; flag ? o++ : o) {
                if (shopList[i].shopProduct[o] && !shopList[i].shopProduct[o].checked) {
                    shopList[i].shopProduct.splice(o, 1)
                    flag = false;
                } else {
                    flag = true;
                }
            }
        }
        // 将没有商品的店铺剔除
        for (let i = 0, flag = true; i < shopList.length; flag ? i++ : i) {
            if (shopList[i].shopProduct.length == 0) {
                shopList.splice(i, 1)
                flag = false;
            } else {
                flag = true;
            }
        }
        wx.showLoading()
        ajaxPost('order/check', { shopList: shopList }, data => {
            wx.hideLoading()
            console.log(data)
            wx.navigateTo({
                url: './confirmOrder/confirmOrder?data=' + JSON.stringify(data),
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