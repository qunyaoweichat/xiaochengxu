
import { ajaxPost } from "../public/ajax.js";
Page({
    /**
     * 页面的初始数据
     */
    data: {//别问为啥数据这么乱···接口返回的就是乱，只能整理下 么办法
        showDrop: false,
        isMark: 0,
        shopDetail: {},
        shopHead:{},
        shopTpl: '',
        shopTplConfig: {},
        couponList:[]
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let shopId = options.shopId ? options.shopId : 4;
        this.setData({
            shopId: shopId,
            partnerCode: options.partnerCode
        })
        // 将shopId存在本地，其他地方会用到
        wx.setStorageSync("shopId", shopId)
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getData();
    },
    getData: function () {
        ajaxPost('cshop/shopDetail', { shopId: this.data.shopId }, (data) => {
            let goodsList, shopHead, shopTplConfig;
            // 店铺过期后数据不全，为了不报错做个 兼容处理
            if (data.tempName != 'shopClose'){
                let componentList = data.tmplList.shopPageComponentList;
                for (let i = 0; i < componentList.length; i++) {
                    if (componentList[i].type == 'head') {
                        shopHead = componentList[i]
                    }
                    if (componentList[i].type == 'goods') {
                        shopTplConfig = componentList[i].contentMap
                        goodsList = componentList[i].templateList;

                    }
                }
            };
            this.setData({ 
                shopDetail: data.shopDetail,
                shopTpl: data.tempName,
                shopHead: shopHead,
                shopTplConfig: shopTplConfig,
                goodsList: goodsList,
                couponList: data.tmplList.shopCouponActivityList
            })
            wx.setNavigationBarTitle({
                title: this.data.shopDetail.shopName,
            })
            // 如果有合伙人code那么就提示分享
            if (this.data.partnerCode) {
                wx.showModal({
                    title: '专属连接已生成',
                    content: '快点击右上角的分享按钮，分享给您的好友吧',
                    showCancel:false
                })
            }
        });
        // 获取收藏状态,由于登录是异步的可能请求的时候还没有登录完成，所以先获取登录信息，如果有登录信息再请求;
        let getMarkStatus = setInterval(() => {
            let loginInfor = wx.getStorageSync("loginInfor");
            if (loginInfor) {
                ajaxPost('shop/isMarkShop', { shopId: this.data.shopId }, (data) => {
                    this.setData({
                        isMark: data.isMark
                    })
                })
                clearInterval(getMarkStatus)
            }
        }, 3000)
        
    },
    // 收藏
    collector: function () {
        let isMark = this.data.isMark=='0'?"1":"0";
        ajaxPost('shop/markShop', { shopId: this.data.shopId, isMark: isMark},(data)=>{
            let msg = isMark=="0"?'取消成功':'收藏成功';
            wx.showToast({
                title: msg,
                mask: true,
            })
            this.setData({
                isMark: isMark
            })
        })

    },
    shareShop:function(){
        console.log(1)
        wx.showShareMenu({
            withShareTicket:true
        })
    },
    onShareAppMessage: function (res) {
        let page = getCurrentPages();
        let path = page[page.length - 1].route + '?shopId=' + this.data.shopId;
        return {
            title: this.data.shopDetail.shopName,
            path: path,
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    },
})