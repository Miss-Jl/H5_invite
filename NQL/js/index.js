var mySwiper;

function initMySwiper() {
    mySwiper = new Swiper('.swiper-container', {
        direction: 'vertical',
        effect: 'fade',
        loop: false,
        lazyLoading: true,
        onInit: function (swiper) { //Swiper2.x的初始化是onFirstInit
            swiperAnimateCache(swiper); //隐藏动画元素
            swiperAnimate(swiper); //初始化完成开始动画
        },
        onSlideChangeEnd: function (swiper) {
            swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画
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

initMySwiper();

