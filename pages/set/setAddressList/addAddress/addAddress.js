import { ajaxPost } from '../../../public/ajax.js';
Page({
    prevPage: {},//上一页 ，操作完后修改数据
    /**
     * 页面的初始数据
     */
    data: {
        addressArea: ['请选择省', '请选择市', '请选择区'],
        addressDetail: {},
        isAdd:true, //判断添加还是编辑
        isChangeArea:false,// 添加时候需要先修改地址，才能修改，微信这块默认请选择省市区也是可以提交上去的
        errMsg: ''
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu()
        // 设置上个页面的对象
        var pages = getCurrentPages();
        this.prevPage = pages[pages.length - 2];
        
        if (options.params) {
            var params = JSON.parse(options.params);
            if (params.addressArea){
                var addressAreaArr = params.addressArea.split(",")
            }
            this.setData({
                isAdd:false,
                addressArea: addressAreaArr,
                addressDetail: params,
            })
        }
        this.setTitle();
    },
    setTitle: function () {
        let title = '编辑收货地址';
        if (this.data.isAdd) {
            title = '添加收货地址'
        }
        wx.setNavigationBarTitle({
            title: title,
        })
    },
    submitAdress: function (e) {
        let params = e.detail.value;
        let phoneReg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
        if (params.name == '') {
            this.setData({
                errMsg: "请输入收货人"
            })
            return;
        }
        if (!phoneReg.test(params.phone)) {
            this.setData({
                errMsg: "请输入正确的手机号"
            })
            return;
        }
        if (params.addressDetails == '') {
            this.setData({
                errMsg: "请输入详细地址"
            })
            return;
        }
        params.addressArea = params.addressArea.join(" ");
        if (params.isDefault==false){
            params.isDefault =0;
        }else{
            params.isDefault = 1;
        }

        // 根据isAdd来判断调用添加还是编辑
        if (this.data.isAdd){
            this.addAdress(params);
        }else{
            this.edtAdress(params);
        }
        
    },
    addAdress: function (params){
        if (!this.data.isChangeArea){
            this.setData({
                errMsg: "请选择地址"
            })
            return;
        }
        this.setData({
            errMsg: ""
        })
        ajaxPost('mine/addAddress', params, (data) => {
            this.prevPage.getData()
            wx.showToast({
                title: '添加成功',
            })
            setTimeout(function () {
                wx.navigateBack()
            }, 2000)
        })
    },
    edtAdress:function(params){
        this.setData({
            errMsg: ""
        })
        // 编辑需要将id带到参数里面
        params.addressId = this.data.addressDetail.addressId;
        ajaxPost('mine/editAddress', params, (data) => {
            this.prevPage.getData()
            wx.showToast({
                title: '修改成功',
            })
            setTimeout(function () {
                wx.navigateBack()
            }, 2000)
        })
    },
    removeAdress:function(){
        
        let addressId = this.data.addressDetail.addressId;
        let userId = wx.getStorageSync('userInfor').userId
        ajaxPost('mine/deleteAddress', { addressId: addressId, userId: userId},(data)=>{
            this.prevPage.getData()
            wx.showToast({
                title: '删除成功',
            })
            setTimeout(function () {
                wx.navigateBack()
            }, 2000)
        })
    },
    bindRegionChange: function (e) {
        this.setData({
            addressArea: e.detail.value,
            isChangeArea:true
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