import { ajaxPost } from '../../public/ajax.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfor: {},
        errMsg: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu()
        this.getData();
        this.setTitle();
    },
    getData: function () {
        ajaxPost('mine', {}, (data) => {
            this.setData({
                userInfor: data.mine
            })
        })
    },
    changeSex: function (e) {
        console.log(e)
    },
    formSubmit: function (e) {
        let params = e.detail.value;
        let idCardReg = /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/;
        let nameReg = /^[\u4e00-\u9fa5]{2,5}$/;
        if (params.nickname.length > 6 || params.nickname.length < 2) {
            this.setData({
                errMsg: '请输入2-6位昵称'
            })
            return;
        }
        if (!nameReg.test(params.realName)) {
            this.setData({
                errMsg: '请输入正确的姓名'
            })
            return;
        }
        if (!idCardReg.test(params.idCard)) {
            this.setData({
                errMsg: '请输入正确身份证'
            })
            return;
        }
        this.setData({ errMsg: '' });
        wx.showLoading()
        ajaxPost('user/editUser', params, (res) => {
            let userInfor = this.data.userInfor;
            userInfor.userName = params.nickname;
            userInfor.userSex = params.userSex;
            userInfor.realName = params.realName;
            userInfor.idCard = params.idCard;
            wx.setStorage({
                key: 'userInfor',
                data: userInfor,
            })
            wx.showToast({
                title: '修改成功',
            })
            setTimeout(function () {
                wx.navigateBack()
            }, 2000)
        })
    },
    setTitle: function () {

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