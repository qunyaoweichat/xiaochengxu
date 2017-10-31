module.exports = {
    navCtrl:function(url){
        let path = "";
        let widthBackBtn = false;
        switch (url) {
            case "index":
                path= "../index/index";
                break;
            case "classList":
                path="../class/classList";
                break;
            case "cart":
                path = "../buy/car/car";
                widthBackBtn =true;
                break;
            case "mine":
                path = "../mine/mineIndex/mineIndex";
                break;
        }
        if (widthBackBtn){
            wx.navigateTo({
                url: path,
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
            })
        }else{
            wx.redirectTo({
                url: path,
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
            })
        }
       
    }
};