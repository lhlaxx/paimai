/**
 * 浏览器内核判断
 * @link http://www.w3cfuns.com/notes/14464/7b2534086675dcc0bccd699da58ecefd.html
 */
browser={
    versions:function(){
        var u = navigator.userAgent, app = navigator.appVersion;
        // alert(u);return
        return {         //移动终端浏览器版本信息
            trident : u.indexOf('Trident') > -1, //IE内核
            presto  : u.indexOf('Presto') > -1, //opera内核
            webKit  : u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko   : u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile  : !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios     : !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android : u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
            iPhone  : u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
            iPad    : u.indexOf('iPad') > -1, //是否iPad
            webApp  : u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
            wechat  : u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
                qq  : u.indexOf('QQ') > -1, //是否QQ
            alipay  : u.indexOf("Alipay") >-1 //是否为支付宝客户端
        };
    }(),
    language:(navigator.browserLanguage || navigator.language).toLowerCase()
}
