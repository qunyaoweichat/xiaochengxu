import { ajaxPost } from "../../public/ajax.js";
function CreatData() {
    this.params = {
        shopId: '',
        page: 0,
        classId: '',
        brandList: [],
        priceList: [],
        keyword: '',
        groupId: '',
        className: '',
        orderType: 0,
        goodsType: ''
    }
};
Page({

    data: {
        // 筛选的控制
        showFilterBox: false,
        // 搜索的默认提示文字
        keyword: '搜索商品',
        // 销量价格的筛选
        salesType: 1,
        priceType: 3,
        // 筛选里面的以选中的数据
        condition:{},
        // 是否已经加载全部
        loadAll:false,
        // 已选中筛选条件列表
    },
    
    onLoad: function (options) {
       
        let shopId = options.shopId ? options.shopId : 4;
        let groupId = options.groupId ? options.groupId : "";
        let groupName = options.groupName ? options.groupName : "最新商品";
        // 初始化一个空的实例获取到参数
        let creatData = new CreatData();
        creatData.params.groupId = groupId;
        creatData.params.shopId = shopId;
        this.setData({
            params: creatData.params,
            shopId: shopId
        })
        // 请求列表和筛选条件
        this.getData();
        this.getConditions(shopId);
        // 设置title
        wx.setNavigationBarTitle({
            title: groupName,
        })
    },
    onShow:function(){
        this.setData({
            selectConditions: {
                brandList: [],
                priceList: [],
                className: ""
            }
        })
    },
    getData: function (callBack) {
        // wx.showLoading()
        let list = this.data.list ? this.data.list : [];
        let loadAll = this.data.loadAll;
        let params = this.data.params;
        ajaxPost('product/list', params, (data) => {
            // wx.hideLoading()
            if (params.page > 0) {
                if (data.productList.length > 0) {
                    list = list.concat(data.productList)
                } else {
                    loadAll = true;
                }
            } else {
                list = data.productList;
            }
            // 如果有回调就执行回调
            if (callBack) callBack()
            params.page++;
            this.setData({
                params:params,
                list: list,
                loadAll: loadAll
            })
        })
    },
    getConditions: function (shopId){
        ajaxPost('condition/selectConditions', { shopId: shopId }, (data) => {
            // 遍历数据，给每个上加上checked
            for(var item in data){
                for(var i=0; i<data[item].length; i++){
                    data[item][i].checked=false;
                }
            }
            this.setData({
                conditionList: data
            })
            console.log(data)
        })
    },
    // 按销量筛选
    changeTypebySales: function (e) {
        let type = e.currentTarget.dataset.type;
        let params = this.data.params;
        params.orderType = type;
        params.page = 0;
        this.getData(() => {
            // 切换salesType
            let salesType = type == 1 ? "2" : "1";
            this.setData({
                salesType: salesType
            })
        })

    },
    // 按价格排序
    changeTypebyPrice: function (e) {
        let type = e.currentTarget.dataset.type;
        let params = this.data.params;
        params.orderType = type;
        params.page = 0;
        this.getData(() => {
            // 切换priceType
            let priceType = type == 3 ? "4" : "3";
            this.setData({
                priceType: priceType
            })
        })
    },
    // 搜索的方法，搜索页面主要是拿到关键字传回来，逻辑还是在这块做
    searchGoods: function (keyword,callBack) {
        // 由于搜索需要重置的参数太多，所以新定义一个数据
        let creatData = new CreatData();
        let params = creatData.params;
        params.keyword = keyword;
        wx.showLoading()
        ajaxPost('search/result', params, (data) => {
            wx.hideLoading()
            // 如果有回调就执行回调
            params.page++;
            this.setData({
                params: params,
                list: data.productList
            })
            // 从本地获取搜索历史，如果获取到了就将之前搜索的keyword加进去，如果没获取到，那么就创建个keywordHistory的数组存起来
            let keywordHistory = wx.getStorage({
                key: 'keywordHistory',
                success: function (res) {
                    for (var i = 0; i < res.data.length; i++){
                        if (res.data[i] != keyword){
                            res.data.push(keyword);
                            break;
                        }
                    }
                    
                    wx.setStorage({
                        key: 'keywordHistory',
                        data: res.data,
                    })
                },
                fail:function(){
                    wx.setStorage({
                        key: 'keywordHistory',
                        data: [keyword],
                    })
                }
            })
            wx.navigateBack()
        })
    },
    showFilterBox: function () {
        this.setData({
            showFilterBox: true
        })
    },
    // 选择类别
    setClass:function(e){
        let classname = e.currentTarget.dataset.classname;
        let selectConditions = this.data.selectConditions;        
        selectConditions.className = classname;
        this.setData({
            selectConditions: selectConditions,
        })
    },
    // 选择品牌
    setBrand:function(e){
        let brand = e.currentTarget.dataset.brand;
        let index = e.currentTarget.dataset.index;

        // 获取筛选的数据列表和已选择数据列表
        let selectConditions = this.data.selectConditions;        
        let conditionList = this.data.conditionList;
        // 修改数据
        conditionList.brand[index].checked = !conditionList.brand[index].checked;
        // 当checked为true的时候加入数组，为false的时候从数组移除
        if (conditionList.brand[index].checked){
            selectConditions.brandList.push({ text: brand })
        }else{
            for (var i = 0; i < selectConditions.brandList.length; i++) {
                if (selectConditions.brandList[i].text == brand) {
                    selectConditions.brandList.splice(i, 1);
                    break;
                }
            }
        }        
        this.setData({
            selectConditions: selectConditions,
            conditionList: conditionList
        })
    },
    // 选择价格区间
    setPrice:function(e){
        let minPrice = e.currentTarget.dataset.min;
        let maxPrice = e.currentTarget.dataset.max;
        let index = e.currentTarget.dataset.index;

        // 获取筛选的数据列表和已选择数据列表
        let selectConditions = this.data.selectConditions;
        let conditionList = this.data.conditionList;
        conditionList.price[index].checked = !conditionList.price[index].checked;
        // 当checked为true的时候加入数组，为false的时候从数组移除
        if (conditionList.price[index].checked) {
            selectConditions.priceList.push({ minPrice: minPrice }, { maxPrice: maxPrice})
        } else {
            for (var i = 0; i < selectConditions.priceList.length; i++) {
                if (selectConditions.priceList[i].minPrice == minPrice && selectConditions.priceList[i].maxPrice == maxPrice) {
                    selectConditions.priceList.splice(i, 1);
                    break;
                }
            }
        }        
        this.setData({
            selectConditions: selectConditions,
            conditionList: conditionList
        })
    },
    // 筛选
    filterGoods: function () {
        let creatData = new CreatData();
        let params = creatData.params;
        // 筛选的条件，塞到params里面
        let selectConditions = this.data.selectConditions;
        for (let item in selectConditions){
            params[item] = selectConditions[item]
        }
        this.setData({
            params: params,
            showFilterBox: false
        })
        this.getData()
    },
    hideFilterbBox:function(){
        this.setData({
            showFilterBox: false
        })
    },
    goSearch: function () {
        wx.navigateTo({
            url: '../shopSearch/shopSearch',
        })
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.getData();
    },
})