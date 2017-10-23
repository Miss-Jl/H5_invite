var mySwiper;

function initMySwiper() {
    mySwiper = new Swiper('.swiper-container', {
        direction: 'vertical',
        effect: 'fade',
        loop: false,
        onInit: function (swiper) { //Swiper2.x的初始化是onFirstInit
            swiperAnimateCache(swiper); //隐藏动画元素
            swiperAnimate(swiper); //初始化完成开始动画
        },
        onSlideChangeEnd: function (swiper) {
            swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画
        }
    })
}

initMySwiper();

var isFull = false;
var oHeight = 0;
var timer = null;
var btn = $('.zhiwen');
var hideImg = $('.hideImg');
var touch = {
    full: function (height) {
        if (oHeight >= height) {
            isFull = true;
            return;
        }
        timer = setInterval(function () {
            if (oHeight >= height) {
                clearInterval(timer)
                addSlide()
            }
            oHeight += 1
            $('.hideImg').css('height', oHeight + 'px')
        }, 1);
    }
}

btn.on('touchstart', function (e) {
    e.preventDefault();
    if (isFull) {
        return
    }
    touch.full(500)
})

btn.on('touchend', function () {
    if (isFull) {
        return
    }
    clearInterval(timer)
    if (oHeight < 500) {
        oHeight = 0;
        hideImg.css('height', oHeight + 'px')
    }
})

function addSlide() {
    hideImg.css('height', 501 + 'px')
    $.ajax({
        url: "/click",
        data: {
            click: 'click'
        },
        type: 'GET',
        error: function (e) {
            console.log(e)
        },
        success: function (rsp) {
            console.log(rsp)
            if (rsp.ret === '0') {
                $('.clickCount').html(rsp.count)
                $('.changeImg img').eq(0).attr('src', './img/section5_bottom_img.png')
                $('.zhiwentip_1 img').eq(0).attr('src', './img/zhiwentip_2.png')
                mySwiper.appendSlide($('.successHtml').html())
                $('#page7 .next-btn').css('display', 'block')
            }
        }
    })
}


var f = $("body").find("audio")[0];
$(".icon-music").click(function () {
    var b = $(this);
    b.hasClass("icon-music--stop") ? (b.removeClass("icon-music--stop"),
        f.play()) : (f.pause(),
        b.addClass("icon-music--stop"))
})

document.addEventListener("WeixinJSBridgeReady", function () {
    f.play();
}, false);