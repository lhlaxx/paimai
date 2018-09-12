/**
 * 一些通用方法

 */
(function(exports) {
    
    /**
     * 将string字符串转为html对象,默认创一个div填充
     * 因为很常用，所以单独提取出来了
     * @param {String} strHtml 目标字符串
     * @return {HTMLElement} 返回处理好后的html对象,如果字符串非法,返回null
     */
    exports.parseHtml = function(strHtml) {
        if (typeof strHtml !== 'string') {
            return strHtml;
        }
        // 创一个灵活的div
        var i,
            a = document.createElement('div');
        var b = document.createDocumentFragment();

        a.innerHTML = strHtml;

        while ((i = a.firstChild)) {
            b.appendChild(i);
        }

        return b;
    };

    /**
     * 将对象渲染到模板
     * @param {String} template 对应的目标
     * @param {Object} obj 目标对象
     * @return {String} 渲染后的模板
     */
    exports.renderTemplate = function(template, obj) {
        return template.replace(/[{]{2}([^}]+)[}]{2}/g, function($0, $1) {
            return obj[$1] || '';
        });
    };

    /**
     * 定义一个计数器
     */
    var counterArr = [0];

    /**
     * 添加测试数据
     * @param {String} dom 目标dom
     * @param {Number} count 需要添加的数量
     * @param {Boolean} isReset 是否需要重置，下拉刷新的时候需要
     * @param {Number} index 属于哪一个刷新
     */
    exports.appendTestData = function(dom, count, isReset, index) {
        if (typeof dom === 'string') {
            dom = document.querySelector(dom);
        }
        
        var prevTitle = typeof index !== 'undefined' ? ('Tab' + index) : '';
        
        var counterIndex = index || 0;
        
        counterArr[counterIndex] = counterArr[counterIndex] || 0;

        if (isReset) {
           
            dom.innerHTML = '';
            counterArr[counterIndex] = 0;
            lastId=1;
        }

        var template = '<li class="dealRecord"><div class="goods pull-left"><a class="" data-href="{{goods_url}}"><dl><dd><span class="datetime colorGrey">{{bidTime}}</span></dd><dd><div class="pull-left dealImg"><span><img src="{{picUrl}}" alt=""></span><img src="../../../static/img/goods/traded.png" class="traded"/></div><div class="pull-left dealInformation"><dl><dd><span class="colorBlack">{{namelabel}}</span><span class="colorBlack">{{nickName}}</span></dd><dd><span class="colorBlack">市场价:&nbsp;</span><span class="colorBlack">{{realPrice}}</span></dd><dd><span class="colorBlack">成交价:&nbsp;</span><span class="colorBlack colorRed">{{bidPrice}}</span></dd></dl></div><div class="clear"></div></dd></dl></a></div><div class="discount pull-right"><dl><dd><span class="colorGrey">节省</span></dd><dd><span class="discountRate">{{ratio}}</span></dd><dd><a class="joinNext" data-href="{{nextUrl}}">{{joinNextContent}}</a></dd></dl></div></li>';

        var html = '';
        //var dateStr = (new Date()).toLocaleString();
        console.log(lastId);
        myObject.commonJsonpAjax(host+'/index.php/index/Frame/onDeal',{
            'chanel':channel,
            'verCode':verCode,
            'lastId':lastId
        }, function(data){
            console.log(data);
                var endValue=data.end;
                $(".mainContent").data("endvalue",endValue);
                var count_=data.goods.length;
                var countflag;
                if(count_==0){
                    $('.mainContent').css({"width":"100%","height":"100%","position":"fixed"});
                    $('.mainContent').html('<div class="emptyBox"><img src="../../../static/img/emptyBox.png"><p class="emptyContent">暂无商品</p></div>');
                    $('.emptyBox').css("marginTop",marginTop);
                    return;
                }
                if(count_<=count){
                    countflag=count_;
                }else{
                    countflag=count;
                }
                
                if(browser.versions.ios){
                    $(".hints").show();
                    namelabel="买主";
                }else{
                    namelabel="中标人";
                }
                for(var i = 0; i < countflag; i++){
                    var ratio=((data.goods[i].ratio.toFixed(3))*100).toFixed(1);
                    if(data.goods[i].haveNew!=false){
                        var href_=data.goods[i].nextUrl;
                        var nextUrl;
                        nextUrl=href_;
                    }else{
                        var nextUrl="";
                    }
                    if(data.goods[i].isShot==true){
                        var joinNextContent="去支付";
                        var payUrl=host+"/front/view/app/index/order.html?order_id="+data.goods[i].order_id;
                        nextUrl=payUrl;
                    }else{
                        var joinNextContent="参与下一期";
                    }
                    var goods_url=data.goods[i].goods_url;
                    var bidTime=data.goods[i].bidTime;
                    var picUrl=data.goods[i].picUrl;
                    var nickName=data.goods[i].nickName;
                    var realPrice=data.goods[i].realPrice;
                    var bidPrice=data.goods[i].bidPrice;

                    

                    html += exports.renderTemplate(template, {
                        goods_url:goods_url,
                        bidTime:bidTime,
                        picUrl:picUrl,
                        namelabel:namelabel,
                        nickName:nickName,
                        realPrice:realPrice,
                        bidPrice:bidPrice,
                        ratio:ratio,
                        nextUrl:nextUrl,
                        joinNextContent:joinNextContent

                    });
                    
                }
                lastId++;
               
                var child = exports.parseHtml(html);
                dom.appendChild(child);
                
        },function(){
            // 即使加载出错，也得重置
            
            myObject.alert('请求失败!');
        });    

        

        
    };

    /**
     * 绑定监听事件 暂时先用click
     * @param {String} dom 单个dom,或者selector
     * @param {Function} callback 回调函数
     * @param {String} eventName 事件名
     */
    exports.bindEvent = function(dom, callback, eventName) {
        eventName = eventName || 'click';
        if (typeof dom === 'string') {
            // 选择
            dom = document.querySelectorAll(dom);
        }
        if (!dom) {
            return;
        }
        if (dom.length > 0) {
            for (var i = 0, len = dom.length; i < len; i++) {
                dom[i].addEventListener(eventName, callback);
            }
        } else {
            dom.addEventListener(eventName, callback);
        }
    };
})(window.Common = {});