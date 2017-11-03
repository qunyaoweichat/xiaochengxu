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
        yourname: '',
        myName: '',
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
        let myName = "16000275";
        let yourname = "16000272";
        this.setData({
            myName: myName,
            yourname: yourname
        })
        // 获取聊天记录，暂时从本地取，后面会从接口获取
        var history = wx.getStorageSync(yourname + myName);
        console.log(history)
        var num = wx.getStorageSync(yourname + myName).length - 1
        if (num > 0) {
            setTimeout(function () {
                that.setData({
                    chatMsg: history,
                    toView: wx.getStorageSync(yourname + myName)[num].mid
                })
            }, 10)
        }
        wx.setNavigationBarTitle({
            title: yourname,
        })
        this.hxloign();

    },
    onShow: function () {
        var that = this
        this.setData({
            inputMessage: ''
        })
    },

    hxloign: function () {
        var options = {
            apiUrl: WebIM.config.apiURL,
            user: this.data.myName,
            pwd: '767269cce4004b2fa9e290f3ae3ed13f7183d1ad',
            grant_type: 'password',
            appKey: WebIM.config.appkey //应用key
        }
        WebIM.conn.open(options)
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
        var that = this
        var myName = that.data.myName;
        var yourname = that.data.yourname;
        var id = WebIM.conn.getUniqueId();
        var msg = new WebIM.message('txt', id);
        msg.set({
            msg: that.data.sendInfo,
            to: yourname,
            roomType: false,
            success: function (id, serverMsgId) {
                console.log('send text message success')
            }
        });
        console.log("Sending textmessage")
        msg.body.chatType = 'singleChat';
        WebIM.conn.send(msg.body);
        if (msg) {
            var value = WebIM.parseEmoji(msg.value.replace(/\n/mg, ''))
            var time = WebIM.time()
            var msgData = {
                info: {
                    to: msg.body.to
                },
                username: yourname,
                yourname: msg.body.to,
                msg: {
                    type: msg.type,
                    data: value
                },
                style: 'self',
                time: time,
                mid: msg.id
            }
            that.data.chatMsg.push(msgData)
            wx.setStorage({
                key: yourname + myName,
                data: that.data.chatMsg,
                success: function () {
                    //console.log('success', that.data)
                    that.setData({
                        chatMsg: that.data.chatMsg,
                        emojiList: [],
                        inputMessage: ''
                    })
                    setTimeout(function () {
                        that.setData({
                            toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
                        })
                    }, 100)
                }
            })
            that.setData({
                userMessage: ''
            })
        }
    },
    // 接收数据
    receiveMsg: function (msg, type) {
        console.log(msg)
        var that = this
        var myName = that.data.myName;
        var yourname = that.data.yourname;
        if (msg.from == yourname || msg.to == yourname) {
            if (type == 'txt') {
                var value = WebIM.parseEmoji(msg.data.replace(/\n/mg, ''))
                
            } else if (type == 'emoji') {
                var value = msg.data
            } else if (type == 'audio') {
                // 如果是音频则请求服务器转码
                console.log('Audio Audio msg: ', msg);
                var token = msg.accessToken;
                console.log('get token: ', token)
                var options = {
                    url: msg.url,
                    header: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept': 'audio/mp3',
                        'Authorization': 'Bearer ' + token
                    },
                    success: function (res) {
                        console.log('downloadFile success Play', res);
                        // wx.playVoice({
                        // filePath: res.tempFilePath
                        // })
                        msg.url = res.tempFilePath
                        var msgData = {
                            info: {
                                from: msg.from,
                                to: msg.to
                            },
                            username: '',
                            yourname: msg.from,
                            msg: {
                                type: type,
                                data: value,
                                url: msg.url
                            },
                            style: '',
                            time: time,
                            mid: msg.type + msg.id
                        }

                        if (msg.from == yourname) {
                            msgData.style = ''
                            msgData.username = msg.from
                        } else {
                            msgData.style = 'self'
                            msgData.username = msg.to
                        }

                        var msgArr = that.data.chatMsg;
                        msgArr.pop();
                        msgArr.push(msgData);

                        that.setData({
                            chatMsg: that.data.chatMsg,
                        })
                        console.log("New audio");
                    },
                    fail: function (e) {
                        console.log('downloadFile failed', e);
                    }
                };
                console.log('Download');
                wx.downloadFile(options);
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
                yourname: msg.from,
                msg: {
                    type: type,
                    data: value,
                    url: msg.url
                },
                style: '',
                time: time,
                mid: msg.type + msg.id
            }
            console.log('Audio Audio msgData: ', msgData);
            if (msg.from == yourname) {
                msgData.style = ''
                msgData.username = msg.from
            } else {
                msgData.style = 'self'
                msgData.username = msg.to
            }
            //console.log(msgData, that.data.chatMsg, that.data)
            that.data.chatMsg.push(msgData)
            wx.setStorage({
                key: yourname + myName,
                data: that.data.chatMsg,
                success: function () {
                    if (type == 'audio')
                        return;
                    //console.log('success', that.data)
                    that.setData({
                        chatMsg: that.data.chatMsg,
                    })
                    setTimeout(function () {
                        that.setData({
                            toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
                        })
                    }, 100)
                }
            })
        }
    },
    sendImage: function () {
        var that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album'],
            success: function (res) {
                that.upLoadImage(res, that)
            },
            fial:function(res){
                console.log(res)
            }
        })
    },
    receiveImage: function (msg, type) {
        var that = this
        var myName = that.data.myName;
        var yourname = that.data.yourname;
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
                yourname: msg.from,
                msg: {
                    type: 'img',
                    data: msg.url
                },
                style: '',
                time: time,
                mid: 'img' + msg.id
            }
            //console.log(msgData)
            that.data.chatMsg.push(msgData)
            //console.log(that.data.chatMsg)
            wx.setStorage({
                key: yourname + myName,
                data: that.data.chatMsg,
                success: function () {
                    that.setData({
                        chatMsg: that.data.chatMsg
                    })
                    setTimeout(function () {
                        that.setData({
                            toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
                        })
                    }, 100)
                }
            })
        }
    },
    upLoadImage: function (res, that) {
        var that = this
        var myName = that.data.myName;
        var yourname = that.data.yourname;
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
                                to: yourname,                  // 接收消息对象
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
                                    username: myName,
                                    yourname: msg.body.to,
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
                                    key: yourname + myName,
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

















