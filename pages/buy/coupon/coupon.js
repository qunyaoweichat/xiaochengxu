// pages/buy/coupon/coupon.js
Page({
    prevPage:{},
    productPromotionPrice:0,//优惠券总额
    /**
     * 页面的初始数据
     */
    data: {
        shopCouponList:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let pages = getCurrentPages();
        this.prevPage = pages[pages.length - 2];
        if (options.shopCouponList){
            this.setData({
                shopCouponList: JSON.parse(options.shopCouponList)
            })
        }
    },
    // 选择优惠券
    selectCoupon:function(e){
        // 深拷贝shopCouponList这个对象，防止修改后数据不对
        let shopCouponList = this.data.shopCouponList;
        let selectCouponList = shopCouponList.map((ele) => {
            return Object.assign({}, ele);
        }); 
        //将拷贝出来的对象的优惠券列表清空，
        for (var i = 0; i < selectCouponList.length; i++){
            selectCouponList[i].couponList=[]
        } 
        // 获取点击元素的数据 将该数据填入到selectCoupon这个数组里
        let shopIndex = e.currentTarget.dataset.shopindex;
        let couponindex = e.currentTarget.dataset.couponindex;
        let selectCoupon = shopCouponList[shopIndex].couponList[couponindex];
        selectCouponList[shopIndex].couponList.push(selectCoupon);
        
        // 修改上个页面的已使用优惠券列表和金额
        let AllData = this.prevPage.data.AllData;
        this.productPromotionPrice += selectCoupon.couponPrice;
        AllData.selectCoupon = selectCouponList;//已选择优惠券列表
        AllData.productPromotionPrice = this.productPromotionPrice;//已使用优惠金额
        this.prevPage.setData({
            AllData: AllData,
        });
        // 返回上一页
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})