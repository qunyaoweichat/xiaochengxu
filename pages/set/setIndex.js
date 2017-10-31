import { ajaxPost } from '../public/ajax.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfor:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu()
    },
    onShow: function () {
        this.getData();
    },


    getData:function(){
        wx.getStorage({
            key: 'userInfor',
            success: (res)=> {
                let mobile = res.data.mobile;
                var sortMobile="";
                if (mobile){
                    sortMobile= mobile.replace(mobile.substr(3, 4), "****");
                }else{
                    sortMobile="暂未绑定手机号，点击绑定"
                }
                
                res.data.sortMobile = sortMobile
                this.setData({   
                    userInfor : res.data
                })
            },
        })
    },
    changeAvatar: function () {
        wx.chooseImage({
            count: 1,
            success: function (res) {
                const src = res.tempFilePaths[0]
                wx.redirectTo({
                    url: './upload/upload?src=' + src
                })
            },
        })
    },
    goBindPhone:function(){
        let mobile = this.data.userInfor.mobile
        if (mobile==""){
            wx.navigateTo({
                url: 'telePhone/telePhone',
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