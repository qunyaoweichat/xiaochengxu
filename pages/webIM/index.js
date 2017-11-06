import { ajaxPost} from '../public/ajax.js';
var strophe = require('../../utils/strophe.js')
var WebIM = require('../../utils/WebIM.js')
var WebIM = WebIM.default

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

Page({
    data: {
        chatMsg: [],
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
        let that = this;
        let fromUid = "16000275";
        let toUid = "16000272";
        this.setData({
            fromUid: fromUid,
            toUid: toUid
        })
        // 获取聊天记录，暂时从本地取，后面会从接口获取
        this.getHistory(fromUid, toUid)

        var history = wx.getStorageSync(toUid + fromUid);
        this.setData({
            chatMsg: history ? history:[]
        })
        wx.setNavigationBarTitle({
            title: toUid,
        })
        this.hxloign();

    },
    onShow: function () {
        this.setData({
            inputMessage: ''
        })
    },

    hxloign: function () {
        var options = {
            apiUrl: WebIM.config.apiURL,
            user: this.data.fromUid,
            pwd: '767269cce4004b2fa9e290f3ae3ed13f7183d1ad',
            grant_type: 'password',
            appKey: WebIM.config.appkey //应用key
        }
        WebIM.conn.open(options)
    },
    // 获取聊天记录
    getHistory: function (fromUid, toUid){
        ajaxPost("huanxin/getHuanxinChatInfo", { fromUid:fromUid,toUid:toUid},data=>{
            console.log(data)
        })
    },
    saveMsgToServe: function (option, frome) {

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
        
        // return;
        // 下面代码可以不要，这个是将数据添加到页面和保存本地的，后面直接调用方法，然后提交提交接口
        if (msg) {
            var value = WebIM.parseEmoji(msg.value.replace(/\n/mg, ''))
            var time = WebIM.time()
            var msgData = {
                info: {
                    to: msg.body.to
                },
                username: fromUid,
                toUid: msg.body.to,
                msg: {
                    type: msg.type,
                    data: value
                },
                style: 'self',
                time: time,
                mid: msg.id
            }
            this.data.chatMsg.push(msgData)
            this.setData({
                userMessage: '',
                chatMsg: this.data.chatMsg
            })
        }
    },
    
    // 接收数据
    receiveMsg: function (msg, type) {
        var fromUid = this.data.fromUid;
        var toUid = this.data.toUid;
        if (msg.from == toUid || msg.to == toUid) {
            if (type == 'txt') {
                var value = WebIM.parseEmoji(msg.data.replace(/\n/mg, ''))
                
            } else if (type == 'emoji') {
                var value = msg.data
            }
            //console.log(msg)
            //console.log(value)
            var time = WebIM.time()
            var msgData = {
                info: {
                    from: msg.from,
                    to: msg.to
                },
                username: '',
                toUid: msg.from,
                msg: {
                    type: type,
                    data: value,
                    url: msg.url
                },
                style: '',
                time: time,
                mid: msg.type + msg.id
            }
            if (msg.from == toUid) {
                msgData.style = ''
                msgData.username = msg.from
            } else {
                msgData.style = 'self'
                msgData.username = msg.to
            }
            //console.log(msgData, that.data.chatMsg, that.data)
            this.data.chatMsg.push(msgData)
            this.setData({
                toView: this.data.chatMsg[this.data.chatMsg.length - 1].mid,
                chatMsg: this.data.chatMsg,
            })
        }
    },
    sendImage: function () {
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album'],
            success: function (res) {
                this.upLoadImage(res)
            },
            fial:function(res){
                console.log(res)
            }
        })
    },
    receiveImage: function (msg, type) {
        var fromUid = this.data.fromUid;
        var toUid = this.data.toUid;
        //console.log(msg)
        if (msg) {
            //console.log(msg)
            var time = WebIM.time()
            var msgData = {
                info: {
                    from: msg.from,
                    to: msg.to
                },
                username: msg.from,
                toUid: msg.from,
                msg: {
                    type: 'img',
                    data: msg.url
                },
                style: '',
                time: time,
                mid: 'img' + msg.id
            }
            //console.log(msgData)
            this.data.chatMsg.push(msgData)
            this.setData({
                toView: this.data.chatMsg[this.data.chatMsg.length - 1].mid,
                chatMsg: this.data.chatMsg
            })
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
                            // console.log(dataObj)
                            var id = WebIM.conn.getUniqueId();                   // 生成本地消息id
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
                                to: toUid,                  // 接收消息对象
                                roomType: false,
                                chatType: 'singleChat'
                            }
                            msg.set(option)
                            WebIM.conn.send(msg.body)
                            if (msg) {
                                //console.log(msg,msg.body.body.url)
                                var time = WebIM.time()
                                var msgData = {
                                    info: {
                                        to: msg.body.to
                                    },
                                    username: fromUid,
                                    toUid: msg.body.to,
                                    msg: {
                                        type: msg.type,
                                        data: msg.body.body.url,
                                        size: {
                                            width: msg.body.body.size.width,
                                            height: msg.body.body.size.height,
                                        }
                                    },
                                    style: 'self',
                                    time: time,
                                    mid: msg.id
                                }
                                that.data.chatMsg.push(msgData)
                                wx.setStorage({
                                    key: toUid + fromUid,
                                    data: that.data.chatMsg,
                                    success: function () {
                                        that.setData({
                                            chatMsg: that.data.chatMsg
                                        })
                                        setTimeout(function () {
                                            that.setData({
                                                toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
                                            })
                                        }, 10)
                                    }
                                })
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
    previewImage: function (event) {
        var url = event.target.dataset.url
        wx.previewImage({
            urls: [url]  // 需要预览的图片http链接列表
        })
    }
    
})

















