
let apiHost = 'https://wxapi.solohui.com/api/wechat/';
// 接收3个参数，
// url:接口地址
// params:参数
// callBack:请求成功且正常返回数据时候调用
// errCallBack：请求成功，但是报错时候调用 非必填，如果没有的话就直接弹窗请求异常
function ajaxPost(url,params,callBack,errCallBack){
    let loginInfor = wx.getStorageSync('loginInfor');
    wx.request({
        url: apiHost+url,
        method: 'post',
        header: loginInfor,
        data: params,
        success: function (data) {
            if (data.data.retCode == "00000") {
                callBack(data.data.data)
            } else {
                if (errCallBack){
                    errCallBack(data.data)
                }else{
                    wx.showToast({
                        title: '请求异常',
                        image: '/images/icon-error.png',
                        mask: true,
                    })
                }
                
            }
        },
        error: function (err) {
            wx.hideLoading()
            wx.showToast({
                title: '系统异常',
                image: '/images/icon-error.png',
                mask: true,
            })
        }

    })
}

function ajaxGet(url, params, callBack,errCallBack){
    wx.request({
        url: apiHost + url,
        method: 'get',
        data: params,
        success: function (data) {
            if (data.data.retCode == "00000") {
                callBack(data.data.data)
            } else {
                if (errCallBack) {
                    errCallBack(data.data.data)
                } else {
                    wx.showToast({
                        title: '请求异常',
                        image: '/images/icon-error.png',
                        mask: true,
                    })
                }
            }
        },
        error: function (err) {
            wx.showModal({
                title: '异常',
                content: '请求异常，请稍候再试',
            })
        }

    })
}
export { ajaxPost, ajaxGet}