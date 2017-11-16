
import { ajaxPost} from '../public/ajax.js';
var strophe = require('../../utils/strophe.js')
var WebIM = require('../../utils/WebIM.js')
var WebIM = WebIM.default

// 语音的配置暂时留着， 后面如果需要的话再开发
var RecordStatus = {
    SHOW: 0,
    HIDE: 1,
    HOLD: 2,
    SWIPE: 3,
    RELEASE: 4
}

var RecordDesc = {
    0: '长按开始录音',
    2: '向上滑动取消',
    3: '松开手取消',
}
// 接收三个参数：数据，类型，是否是自己发的
var MsgDataFactory = function(data,type,isSelf){
    var msgData = {
        type: type,
        style: false,
        chatType: 'singleChat',
        secret: "",
        chatHistory: '',
        content: '',
        url: '',
        fileName: '',
        fromUid: data.fromUid,
        toUid: data.toUid,
        msgId: data.msgId,
        sendTime: WebIM.time()
        
    }
    if (isSelf){
        msgData.style=true;
    }
    switch(type){
        case "img":
            msgData.fileName = data.fileName;
            msgData.url = data.url;
            break;
        case "txt":
            msgData.content = data.content
    }
    return msgData
}
Page({
    data: {
        chatMsg: [],
        chatMsgPage:1,
        chatMsgTotal:10,
        chatMsgFlag:true,
        chatMsgAll:false,
        emojiStr: '',
        toUid: '',
        fromUid: '',
        sendInfo: '',
        userMessage: '',
        inputMessage: '',
        indicatorDots: true,
        autoplay: false,
        interval: 5000,
        duration: 1000,
        show: 'emoji_list',
        view: 'scroll_view',
        toView: '',
        emoji: WebIM.Emoji,
        emojiObj: WebIM.EmojiObj,
        msgView: {},
        RecordStatus: RecordStatus,
        RecordDesc: RecordDesc,
        recordStatus: RecordStatus.HIDE,
        
    },
    onLoad: function (options) {
        let shopId = options.shopId ? options.shopId:"4";
        // 获取环信数据（用户相关，店铺相关，聊天记录）
        this.getHxData(shopId)
    },
    onShow: function () {
        this.setData({
            inputMessage: ''
        })
    },
    getHxData: function (shopId){
        wx.showLoading()
        ajaxPost("huanxin/toHuanxinChat?shopId=" + shopId,{},data=>{
            wx.hideLoading()
            // 环信登录
            this.hxloign(data.userHuanXin);
            // 设置标题
            wx.setNavigationBarTitle({
                title: data.shopHuanXin.nickname,
            })
            this.setData({
                fromUid: (data.userHuanXin.userId).toString(),
                toUid: (data.shopHuanXin.userId).toString(),
                chatMsg: data.huanxinChatInfo.chatList
            })
            setTimeout(() => {
                this.setData({
                    toView: this.data.chatMsg[this.data.chatMsg.length - 1].msgId
                })
            }, 10)
        })
    },

    hxloign: function (userHuanXin) {
        var options = {
            apiUrl: WebIM.config.apiURL,
            user: (userHuanXin.userId).toString(),
            pwd: userHuanXin.huanxinPwd,
            grant_type: 'password',
            appKey: WebIM.config.appkey //应用key
        }
        WebIM.conn.open(options)
    },
    getHistory: function () {
        var chatMsgFlag = this.data.chatMsgFlag;
        var chatMsg = this.data.chatMsg;
        var scrollItem = this.data.chatMsg[0].msgId;//加载成功后要滚动到的位置
        if (!chatMsgFlag || chatMsg.length < 10) {
            return
        }
        this.setData({
            chatMsgFlag: false
        })
        this.data.chatMsgPage += 1;
        ajaxPost("huanxin/getHuanxinChatInfo", { 
            page: this.data.chatMsgPage, 
            pageSize: this.data.chatMsgTotal, 
            fromUid: this.data.fromUid, 
            toUid: this.data.toUid
        },data=>{
            console.log(data);
            // 如果请求到的数据小于page 那么说明已经请求完了，下一页没数据了，显示已加载全部
            if (data.chatList.length>0){
                this.setData({
                    chatMsgFlag: false,
                    chatMsgAll: true
                })
            }
            chatMsg = data.chatList.concat(chatMsg)
            this.setData({
                chatMsg: chatMsg,
            })
            // 滚动到之前的第一条数据位置
            setTimeout(() => {
                this.setData({
                    toView: scrollItem
                })
            }, 10)
            // 过500ms后才可请求第二次，否则会一次请求N页的
            setTimeout(() => {
                this.setData({
                    chatMsgFlag: true
                })
            }, 100)
        })
    },
    // 发送消息
    sendMessage: function () {
        if (!this.data.userMessage.trim()) return;
        var toUid = this.data.toUid;
        var fromUid = this.data.fromUid
        var id = WebIM.conn.getUniqueId();
        var msg = new WebIM.message('txt', id);
        msg.set({
            msg: this.data.sendInfo,
            to: toUid,
            roomType: false,
            body:{
                chatType: 'singleChat'
            }
        });
        WebIM.conn.send(msg.body);
        // 整理数据然后保存到数据库
        if (msg) {
            var value = WebIM.parseEmoji(msg.value.replace(/\n/mg, ''))
            var data = {
                fromUid: fromUid,
                toUid: toUid,
                msgId: id,
                content: value[0].data
            }
            var msgData = new MsgDataFactory(data, 'txt', true);
            // 数据添加到页面，
            this.data.chatMsg.push(msgData)
            this.setData({
                userMessage: '',
                chatMsg: this.data.chatMsg
            })
            // 数据保存到数据库
            this.saveMsgToServe(msgData)
            setTimeout(() => {
                this.setData({
                    toView: this.data.chatMsg[this.data.chatMsg.length - 1].msgId
                })
            }, 10)
            
        }
    },
    
    // 接收数据
    receiveMsg: function (msg, type) {
        console.log(msg)
        var fromUid = this.data.fromUid;
        var toUid = this.data.toUid;
        var id = WebIM.conn.getUniqueId();
        if (msg.from == toUid || msg.to == toUid) {
            if (type == 'txt') {
                var value = WebIM.parseEmoji(msg.data.replace(/\n/mg, ''))
            } else if (type == 'emoji') {
                var value = msg.data
            }
            var data = {
                fromUid: msg.from,
                toUid: msg.to,
                msgId: id,
                content: value[0].data
            }
            var msgData = new MsgDataFactory(data, 'txt', false);
            // 数据添加到页面，
            this.data.chatMsg.push(msgData)
            this.setData({
                chatMsg: this.data.chatMsg
            })
            // 数据保存到数据库
            this.saveMsgToServe(msgData)
            setTimeout(() => {
                this.setData({
                    toView: this.data.chatMsg[this.data.chatMsg.length - 1].msgId
                })
            }, 10)
        }
    },
    // 选择图片
    sendImage: function () {
        var that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album'],
            success: (res)=> {
                that.upLoadImage(res)
            },
            fial:function(res){
                console.log(res)
            }
        })
    },
    receiveImage: function (msg, type) {
        console.log(msg,type)
        var fromUid = this.data.fromUid;
        var toUid = this.data.toUid;
        var id = WebIM.conn.getUniqueId();
        if (msg) {
            //console.log(msg)
            var data = {
                fromUid: msg.from,
                toUid: msg.to,
                msgId: id,
                url: msg.url,
                fileName: msg.filename
            }
            var msgData = new MsgDataFactory(data, 'img', false);
            // 数据添加到页面，
            this.data.chatMsg.push(msgData)
            this.setData({
                chatMsg: this.data.chatMsg
            })
            // 数据保存到数据库
            this.saveMsgToServe(msgData)
            
            setTimeout(() => {
                this.setData({
                    toView: this.data.chatMsg[this.data.chatMsg.length - 1].msgId
                })
            }, 10)
        }
    },
    upLoadImage: function (res) {
        var that = this
        var fromUid = that.data.fromUid;
        var toUid = that.data.toUid;
        var tempFilePaths = res.tempFilePaths[0]
        wx.getImageInfo({
            src: tempFilePaths,
            success: function (res) {
                // console.log(res)
                var allowType = {
                    'jpg': true,
                    'gif': true,
                    'png': true,
                    'bmp': true
                };
                var str = WebIM.config.appkey.split('#')
                var width = res.width
                var height = res.height
                var index = res.path.lastIndexOf('.')
                if (index != -1) {
                    var filetype = res.path.slice(index + 1)
                }
                if (filetype.toLowerCase() in allowType) {
                    wx.uploadFile({
                        url: 'https://a1.easemob.com/' + str[0] + '/' + str[1] + '/chatfiles',
                        filePath: tempFilePaths,
                        name: 'file',
                        header: {
                            'Content-Type': 'multipart/form-data'
                        },
                        success: function (res) {
                            var data = res.data
                            var dataObj = JSON.parse(data)
                            var id = WebIM.conn.getUniqueId();// 生成本地消息id
                            var msg = new WebIM.message('img', id);
                            var file = {
                                type: 'img',
                                size: {
                                    width: width,
                                    height: height
                                },
                                'url': dataObj.uri + '/' + dataObj.entities[0].uuid,
                                'filetype': filetype,
                                'filename': tempFilePaths
                            }
                            //console.log(file)
                            var option = {
                                apiUrl: WebIM.config.apiURL,
                                body: file,
                                to: toUid,
                                roomType: false,
                                chatType: 'singleChat'
                            }
                            msg.set(option)
                            WebIM.conn.send(msg.body)

                            // 数据展示和保存到库
                            if (msg) {
                                var data = {
                                    fromUid: fromUid,
                                    toUid: toUid,
                                    msgId:id,
                                    url: file.url,
                                    fileName: file.filename
                                }
                                var msgData = new MsgDataFactory(data, 'img', true);
                                console.log(msgData)
                                // 数据添加到页面，
                                that.data.chatMsg.push(msgData)
                                that.setData({
                                    chatMsg: that.data.chatMsg
                                })
                                // 数据保存到数据库
                                that.saveMsgToServe(msgData)
                                
                                setTimeout(() => {
                                    that.setData({
                                        toView: that.data.chatMsg[that.data.chatMsg.length - 1].msgId
                                    })
                                }, 10)
                            }
                        },
                        
                    })
                }
            },
            fail:function(res){
                console.log(res)
            }
        })
    },
    // 保存聊天记录到数据库
    saveMsgToServe: function (params) {
        params={
            fromUid: (params.fromUid).toString(),
            toUid: (params.toUid).toString(),
            content: params
        }
        // 接口要时间戳，在这里转下
        var sendTime = Date.parse(new Date(params.content.sendTime))
        sendTime = sendTime / 1000
        params.content.sendTime = sendTime;
        ajaxPost("huanxin/saveHuanxinChat", params, data => {
            
        },err=>{
        })
    },
    bindMessage: function (e) {
        this.setData({
            userMessage: e.detail.value
        })
    },
    cleanInput: function () {
        var that = this
        var setUserMessage = {
            sendInfo: that.data.userMessage
        }
        that.setData(setUserMessage)
    },
    focus: function () {
        this.setData({
            show: 'emoji_list',
            view: 'scroll_view'
        })
    },
    cancelEmoji: function () {
        this.setData({
            show: 'emoji_list',
            view: 'scroll_view'
        })
    },
    // 预览图片
    previewImage: function (event) {
        var url = event.target.dataset.url
        wx.previewImage({
            urls: [url]  // 需要预览的图片http链接列表
        })
    }
    
})

















