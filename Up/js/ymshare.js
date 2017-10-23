function getTimeStamp() {
 var tmp = Date.parse(new Date()).toString();
    tmp = tmp.substr(0, 10);
    return tmp;
}
function getNonceStr() {
    var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var maxPos = $chars.length;
    var noceStr = "";
    for (i = 0; i < 32; i++) {
        noceStr += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return noceStr;
}
function getSign(NickName) {
    $.ajax({
        type: "post",
        url: "http://wx.yuemia.com/wechat/sign.ashx",
        async: false,
        data: {"noncstr": NonceStr ,"timestamp":TimeStamp ,"url": localurl ,"NickName": NickName},
        timeout: 10000,
        success: function (data) {
            sign = data.sign;
            configjsapi();
            return data;
        }

    });
}


var TimeStamp = getTimeStamp();
var NonceStr = getNonceStr();
var localurl = window.location.href;

var lineLink = '';
var imgUrl = '';
var descContent = '';
var shareTitle = '';
var AppID = '';
var isDebug='';

var sign = "";

//转发参数对应顺序   标题、描述、链接、图片、appid、项目名称
/**
 * @param {String} a 转发标题
 * @param {String} b 转发描述
 * @param {String} c 转发链接
 * @param {String} d 转发图片
 * @param {String} e 微信的参数
 * @param {String} f 项目名称
*/
function ymshare(a, b, c, d, e, f) {
    shareTitle = a;
    descContent = b;
    lineLink = c;
    imgUrl = d;
    AppID = e;
    getSign(f);

}

function configjsapi() {

    wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: AppID, // 必填，公众号的唯一标识
        timestamp: TimeStamp, // 必填，生成签名的时间戳
        nonceStr: NonceStr, // 必填，生成签名的随机串
        signature: sign,// 必填，签名，见附录1
        jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });

}





function ShareMsg() {

    // 2. 分享接口
    // 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
    wx.onMenuShareAppMessage({

        title: shareTitle,
        link: lineLink,
        imgUrl: imgUrl,
        desc: descContent,

        trigger: function (res) {
            //alert('用户点击发送给朋友');
        },
        success: function (res) {
            //userRelay();

        },
        cancel: function (res) {
            //alert('已取消');
        },
        fail: function (res) {
            //alert(JSON.stringify(res));
        }
    });

    // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
    wx.onMenuShareTimeline({
        title: descContent,
        link: lineLink,
        imgUrl: imgUrl,
        desc: descContent,
        trigger: function (res) {
            //alert('用户点击分享到朋友圈');
        },
        success: function (res) {
            //userRelay();
        },
        cancel: function (res) {
            //alert('已取消');
        },
        fail: function (res) {
            //alert(JSON.stringify(res));
        }
    });

};
function choosePic(complete) {
    wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          //  var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            var localIds = res.localIds[0].toString(); // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片

            wx.uploadImage({
                localId: localIds, // 需要上传的图片的本地ID，由chooseImage接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: function (res) {
                    var serverId = res.serverId; // 返回图片的服务器端ID

                    $.ajax({
                        url: "../Ajax/upload.ashx",
                        dataType: "json",
                        type: "POST",
                        data: { id: serverId, openid: request("openid") },
                        success: function (data) {
                            complete(data.url);

                        },
                        error: function (data) {
                            alert(data.result);
                        }
                    });
                }
            });

        }
    });
}
wx.ready(function () {
    ShareMsg();

});
 