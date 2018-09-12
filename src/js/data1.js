// 页数
var page = 0;
var style= 0;

var itemIndex = 0;
var tabLoad=[];

var iostxt2;
var iostxt1;
var iostxt3;
if(browser.versions.ios){
    iostxt2="抢中";
    iostxt1="抢";
    iostxt3="抢"
}else{
    iostxt2="中标";
    iostxt1="拍";
    iostxt3="拍";
}

$(".tabs-underline li").each(function(){
    var index=$(this).find("a").data('index');
    itemIndex=index;
    tabLoad[itemIndex]=false;
})

$(".tabs-underline li a").on('click', function (e) {

    var index = $(this).data('index');
    if(index==0){
        style=0;
    }else if(index==1){
        style=1;
    }else if(index==2){
        style=2;
    }else if(index==3){
        style=3;
    }

    var $this = $(this);
    itemIndex = $(this).data('index');

    $this.addClass('tab-active')
    $this.parent().siblings().find("a").removeClass('tab-active');
    $('.tabs-content-placeholder>div.content').eq(itemIndex).addClass("tab-content-active");
    $('.tabs-content-placeholder>div.content').eq(itemIndex).siblings().removeClass('tab-content-active');

    $(".dropload-down").show();
    //$(".dropload-down").remove();
    $('.tab-content-active .recordContent .lists').html("");
    //$('.tab-content-active').siblings().find(".dropload-up").remove();
    $(this).parent().find("span").removeClass("show");
    $(this).parent().find("span").css("display","none");



    page=0;
    tabLoad[itemIndex]=false;
    // 如果数据没有加载完
    if(!tabLoad[itemIndex]){
        // 解锁
        dropload.unlock();
        dropload.noData(false);
    }else{

        // 锁定
        dropload.lock('down');
        dropload.noData();
    }

    // 重置
    dropload.resetload();

    var loc=window.location.href;
    if((loc.indexOf("hasDot=true")>=0)||(loc.indexOf("hasDot=1")>=0)){

        if(index==2||index==3){
            var symbol1=$(".signal1").attr("class");
            var symbol2=$(".signal2").attr("class");
            if(symbol1.indexOf("show")<0){
                if(symbol2.indexOf("show")<0){
                    window.Auction.dimissDot();
                }
            }
        }


    }


});

var dropload=$('.tabs-content-placeholder').dropload({
    scrollArea : window,
    domDown : {
        domClass   : 'dropload-down',
        domRefresh : '<div class="dropload-refresh">↑上拉加载更多</div>',
        domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
        domNoData  : '<div class="dropload-noData">哇塞,你好厉害终于看完了</div>'
    },
    loadDownFn : function(me){
        page++;
        var result = '';

        $.ajax({
            type: 'GET',
            async: false,
            url:host+'/index.php/index/User/getMyRecords',
            dataType: "jsonp",
            jsonp: "callback",
            data:{'openid':openid,'style':style,'verCode':verCode,'lastId':page},
            success: function(data){
                console.log(data);
                var count=data.goods.length;
                if(count>0){

                    if(data.end==true){
                        for(var i = 0; i < count; i++){
                            var state;
                            var statebutton;


                            var nextUrl=data.goods[i].nextUrl;

                            if(nextUrl!=null){
                                $(".recordGoto").attr("href",nextUrl);
                            }

                            var verCode=AppHelper.YzAppGetVerCode();

                            var n = data.goods[i].state;
                            var niubi = data.goods[i].state;


                            // alert(niubi + 'dd');

                            if(verCode!=108)
                            {
                                // alert(niubi + 'nn');
                                switch(n)
                                {
                                    case 0:
                                        state="准备中";
                                        statebutton="准备中";
                                        break;
                                    case 1:
                                        state="进行中";
                                        statebutton="继续"+iostxt1;
                                        var priceTag="当前价";
                                        var jumpUrl=data.goods[i].goods_url;
                                        break;
                                    case 2:
                                        state="恭喜您"+iostxt2;
                                        statebutton="去付款";
                                        var priceTag="成交价";
                                        var jumpUrl=host+"/front/view/app/index/order.html?order_id="+data.goods[i].order_id+"&source=web";
                                        break;
                                    case 6:
                                        state="已结束";
                                        statebutton="参与下一期";
                                        var priceTag="成交价";
                                        if(data.goods[i].haveNew==true){
                                            var jumpUrl=data.goods[i].nextUrl;
                                        }else{
                                            var jumpUrl="javascript:void(0)";
                                        }
                                        break;
                                    default:
                                        var goodsState = data.goods[i].goodsState;
                                        // var n = 2;
                                        // alert(n);
                                        console.log(n);
                                        var displaystyle="display:none";
                                        var stateclass="";
                                        var shaiMsg="晒单得拍币";
                                        var displaystyle_="display:block";
                                        var _displaystyle="display:block";
                                        var isSDK=myObject.GetQueryString("isSDK");
                                        var showid=data.goods[i].showid;
                                        var kindId=data.goods[i].kindId;

                                        switch(goodsState)
                                        {
                                            case 0:
                                                state="恭喜入手";
                                                if(isSDK){
                                                    _displaystyle="display:none";
                                                    displaystyle="display:block";
                                                }else{
                                                    statebutton="分享赚更多";
                                                    displaystyle="display:block";
                                                    stateclass="twoButton";
                                                }
                                                break;
                                            case 1:
                                                state="晒单审核中";
                                                if(isSDK){
                                                    _displaystyle="display:none";
                                                }else{
                                                    statebutton="分享赚更多";
                                                }
                                                break;
                                            case 2:
                                                state="晒单通过";
                                                if(isSDK){
                                                    _displaystyle="display:none";
                                                }else{
                                                    statebutton="分享赚更多";
                                                }
                                                break;
                                            case 3:
                                                state="晒单失败";
                                                shaiMsg="修改晒单";
                                                displaystyle="display:block";
                                                displaystyle_="display:none";
                                                break;
                                        }

                                        var priceTag="成交价";
                                        console.log(state);
                                        console.log(statebutton);
                                        var goodsId=data.goods[i].goodsId;
                                        var goodsName=data.goods[i].goodsName;
                                        var imgUrl=data.goods[i].picUrl;
                                        var goodsPeriod=data.goods[i].issue_id;
                                        var dealTime=data.goods[i].win_t;
                                        var dealPrice=data.goods[i].bidPrice;
                                        var failMsg=data.goods[i].msg;

                                        var shai={
                                            'goodsId':goodsId,
                                            'goodsName':goodsName,
                                            'imgUrl':imgUrl,
                                            'goodsPeriod':goodsPeriod,
                                            'dealTime':dealTime,
                                            'dealPrice':dealPrice,
                                            'failMsg':failMsg,
                                            'showid':showid
                                        };
                                        var shaiContent=JSON.stringify(shai);


                                        if(state=="晒单通过"){
                                            var jumpUrl=host+"/front/view/app/index/sharepage.html?showid="+showid+"&source=web";
                                        }else{
                                            var jumpUrl=host+"/front/view/app/index/sharepage.html?goodsId="+kindId+"&source=web";
                                        }

                                        break;
                                    /*case 3:
                                     state="已拍中";
                                     statebutton="参与下一期";
                                     var priceTag="成交价";
                                     if(data.goods[i].haveNew==true){
                                     var jumpUrl=data.goods[i].nextUrl;
                                     }else{
                                     var jumpUrl="javascript:void(0)";
                                     }
                                     break;

                                     case 4:
                                     state="已拍中";
                                     statebutton="参与下一期";
                                     var priceTag="成交价";
                                     if(data.goods[i].haveNew==true){
                                     var jumpUrl=data.goods[i].nextUrl;
                                     }else{
                                     var jumpUrl="javascript:void(0)";
                                     }
                                     break;
                                     case 5:
                                     state="已拍中";
                                     statebutton="参与下一期";
                                     var priceTag="成交价";
                                     if(data.goods[i].haveNew==true){
                                     var jumpUrl=data.goods[i].nextUrl;
                                     }else{
                                     var jumpUrl="javascript:void(0)";
                                     }
                                     break;
                                     case 6:
                                     state="已结束";
                                     statebutton="参与下一期";
                                     var priceTag="成交价";
                                     if(data.goods[i].haveNew==true){
                                     var jumpUrl=data.goods[i].nextUrl;
                                     }else{
                                     var jumpUrl="javascript:void(0)";
                                     }
                                     break;
                                     */
                                }
                                var sdksuffix="";
                                var isSDK=myObject.GetQueryString("isSDK");
                                if(isSDK){
                                    sdksuffix="&isSDK=true";
                                }
                                if(style==3){
                                    if(data.goods[i].chajiagou==1){
                                        result +=  '<div class="record recordNow"><div class="record-inner"><div class="goods pull-left"><a class="" href="'+data.goods[i].goods_url+'&source=web'+sdksuffix+'"><dl><dd><div class="pull-left recordImg"><span>'+'<img src="'+data.goods[i].picUrl+'" alt=""></span></div><div class="pull-left recordInformation"><dl><dd><span class="colorBlack">市场价:&nbsp;</span><span class="colorBlack">'+'￥'+data.goods[i].realPrice+'</span></dd><dd><span class="colorRed">'+priceTag+':&nbsp;</span><span class="colorRed">'+'￥'+data.goods[i].bidPrice+'</span></dd><dd>差价购获得</dd></dl></div><div class="clear"></div></dd></dl></a></div><div class="recordOperation pull-right"><dl><dd class="'+stateclass+'"><span class="recordStatus">'+state+'</span></dd><dd class="shai" style="'+displaystyle+'"><a class="recordGoto" data-href=\''+shaiContent+'\'>'+shaiMsg+'</a></dd><dd style="'+displaystyle_+'"><a class="recordGoto share-btn" href="'+jumpUrl+'" style="'+_displaystyle+'">'+statebutton+'</a></dd></dl></div></div>'+goodsLogistics(data.goods[i].goodsType,data.goods[i].logistics)+'</div>';
                                    }else {
                                        result +=  '<div class="record recordNow"><div class="record-inner"><div class="goods pull-left"><a class="" href="'+data.goods[i].goods_url+'&source=web'+sdksuffix+'"><dl><dd><div class="pull-left recordImg"><span>'+'<img src="'+data.goods[i].picUrl+'" alt=""></span></div><div class="pull-left recordInformation"><dl><dd><span class="colorBlack">市场价:&nbsp;</span><span class="colorBlack">'+'￥'+data.goods[i].realPrice+'</span></dd><dd><span class="colorRed">'+priceTag+':&nbsp;</span><span class="colorRed">'+'￥'+data.goods[i].bidPrice+'</span></dd><dd><span class="colorBlack">我出价:&nbsp;</span><span class="colorBlack">'+data.goods[i].count+'次'+'</span></dd></dl></div><div class="clear"></div></dd></dl></a></div><div class="recordOperation pull-right"><dl><dd class="'+stateclass+'"><span class="recordStatus">'+state+'</span></dd><dd class="shai" style="'+displaystyle+'"><a class="recordGoto" data-href=\''+shaiContent+'\'>'+shaiMsg+'</a></dd><dd style="'+displaystyle_+'"><a class="recordGoto share-btn" href="'+jumpUrl+'" style="'+_displaystyle+'">'+statebutton+'</a></dd></dl></div></div>'+goodsLogistics(data.goods[i].goodsType,data.goods[i].logistics)+'</div>';
                                    }
                                }else if(style==0) {


                                    var drawFrame = '';
                                    //显示抽奖相关框
                                    if (data.goods[i].showMark == 1)
                                    {
                                        //有抽奖资格
                                        if (data.goods[i].prizeMark == 1) {
                                            //是否已抽奖
                                            if (data.goods[i].drawMark == 1)
                                            {
                                                //已中奖
                                                if (data.goods[i].hasWin == 1)
                                                {
                                                    //查看奖品连接
                                                    var viewPrizeJump = host+"/front/view/app/lottery/winrecord2.html?goodsId="+data.goods[i].goodsId+"&source=web&from=auctionList&openid=" + openid;
                                                    drawFrame = '<div class="record-bottom"><div class="diffPrice-pb">您已抽中' + numberTostr(data.goods[i].prizeLevel)+ '等奖： ' + data.goods[i].prizeName + ' </div><a class="diffPrice-btn2" href="' + viewPrizeJump + '" data-href="' + viewPrizeJump + '">查看奖品</a></div>';
                                                } else {
                                                    //未中奖
                                                    drawFrame = '<div class="record-bottom"><div class="diffPrice-pb">参与下次竞拍，获赠更多抽奖机会</div><a class="diffPrice-btn2" href="#">未抽中</a></div>';
                                                }
                                            } else {
                                                //未抽奖
                                                var goDrawPrizeJump = host+"/front/view/app/lottery/index0.html?goodsId=" + data.goods[i].goodsId + "&source=web&from=auctionList&openid=" + openid;
                                                drawFrame = '<div class="record-bottom"><div class="diffPrice-pb">您获赠一次抽奖机会</div><a class="diffPrice-btn3" href="'+goDrawPrizeJump+'" data-href="'+goDrawPrizeJump+'">去抽奖</a></div>';
                                            }
                                        } else {
                                            //没有抽奖资格 完
                                            drawFrame = '<div class="record-bottom"><div class="diffPrice-pb">参与下期竞拍获赠抽奖机会</div></div>';
                                        }
                                    }



                                    if(data.goods[i].chajiagou==1){
                                        var diffPriceJump = host+"/front/view/app/index/difforder.html?goodsId="+data.goods[i].goodsId+"&source=web";

                                        result +=  '<div class="record recordNow"><div class="record-inner"><div class="goods pull-left"><a class="" href="'+data.goods[i].goods_url+'&source=web'+sdksuffix+'"><dl><dd><div class="pull-left recordImg"><span>'+'<img src="'+data.goods[i].picUrl+'" alt=""></span></div><div class="pull-left recordInformation"><dl><dd><span class="colorBlack">市场价:&nbsp;</span><span class="colorBlack">'+'￥'+data.goods[i].realPrice+'</span></dd><dd><span class="colorRed">'+priceTag+':&nbsp;</span><span class="colorRed">'+'￥'+data.goods[i].bidPrice+'</span></dd><dd><span class="colorBlack">我出价:&nbsp;</span><span class="colorBlack">'+data.goods[i].count+'次'+'</span></dd></dl></div><div class="clear"></div></dd></dl></a></div><div class="recordOperation pull-right"><dl><dd><span class="recordStatus">'+state+'</span></dd><dd><a class="recordGoto-00" href="'+jumpUrl+'" data-href="'+data.goods[i].nextUrl+'">'+statebutton+'</a></dd></dl></div></div>' + '<div class="record-bottom"><div class="diffPrice-pb">已返还'+data.goods[i].return_money+'拍币</div><a class="diffPrice-btn" href="'+diffPriceJump+'" data-href="'+diffPriceJump+'">差价购</a></div>';
                                        result += drawFrame;
                                        result += '</div>';
                                    }else {
                                        result +=  '<div class="record recordNow"><div class="record-inner"><div class="goods pull-left"><a class="" href="'+data.goods[i].goods_url+'&source=web'+sdksuffix+'"><dl><dd><div class="pull-left recordImg"><span>'+'<img src="'+data.goods[i].picUrl+'" alt=""></span></div><div class="pull-left recordInformation"><dl><dd><span class="colorBlack">市场价:&nbsp;</span><span class="colorBlack">'+'￥'+data.goods[i].realPrice+'</span></dd><dd><span class="colorRed">'+priceTag+':&nbsp;</span><span class="colorRed">'+'￥'+data.goods[i].bidPrice+'</span></dd><dd><span class="colorBlack">我出价:&nbsp;</span><span class="colorBlack">'+data.goods[i].count+'次'+'</span></dd></dl></div><div class="clear"></div></dd></dl></a></div><div class="recordOperation pull-right"><dl><dd><span class="recordStatus">'+state+'</span></dd><dd><a class="recordGoto-00" href="'+jumpUrl+'" data-href="'+data.goods[i].nextUrl+'">'+statebutton+'</a></dd></dl></div></div>';
                                        result += drawFrame;
                                        result += '</div>';
                                    }
                                }else{
                                    result +=  '<div class="record recordNow"><div class="record-inner"><div class="goods pull-left"><a class="" href="'+data.goods[i].goods_url+'&source=web'+sdksuffix+'"><dl><dd><div class="pull-left recordImg"><span>'+'<img src="'+data.goods[i].picUrl+'" alt=""></span></div><div class="pull-left recordInformation"><dl><dd><span class="colorBlack">市场价:&nbsp;</span><span class="colorBlack">'+'￥'+data.goods[i].realPrice+'</span></dd><dd><span class="colorRed">'+priceTag+':&nbsp;</span><span class="colorRed">'+'￥'+data.goods[i].bidPrice+'</span></dd><dd><span class="colorBlack">我出价:&nbsp;</span><span class="colorBlack">'+data.goods[i].count+'次'+'</span></dd></dl></div><div class="clear"></div></dd></dl></a></div><div class="recordOperation pull-right"><dl><dd><span class="recordStatus">'+state+'</span></dd><dd><a class="recordGoto" href="'+jumpUrl+'" data-href="'+data.goods[i].nextUrl+'">'+statebutton+'</a></dd></dl></div></div></div>';
                                }
                            }else{
                                switch(n)
                                {
                                    case 0:
                                        state="准备中";
                                        statebutton="准备中";
                                        break;
                                    case 1:
                                        state="进行中";
                                        statebutton="继续"+iostxt1;
                                        var priceTag="当前价";
                                        var jumpUrl=data.goods[i].goods_url;
                                        break;
                                    case 2:
                                        state="恭喜您"+iostxt2;
                                        statebutton="去付款";
                                        var priceTag="成交价";
                                        var jumpUrl=host+"/front/view/app/index/order.html?order_id="+data.goods[i].order_id+"&source=web";
                                        break;
                                    case 3:
                                        state="已"+iostxt3+"中";
                                        statebutton="参与下一期";
                                        var priceTag="成交价";
                                        if(data.goods[i].haveNew==true){
                                            var jumpUrl=data.goods[i].nextUrl;
                                        }else{
                                            var jumpUrl="javascript:void(0)";
                                        }
                                        break;
                                    case 4:
                                        state="已"+iostxt3+"中";
                                        statebutton="参与下一期";
                                        var priceTag="成交价";
                                        if(data.goods[i].haveNew==true){
                                            var jumpUrl=data.goods[i].nextUrl;
                                        }else{
                                            var jumpUrl="javascript:void(0)";
                                        }
                                        break;
                                    case 5:
                                        state="已"+iostxt3+"中";
                                        statebutton="参与下一期";
                                        var priceTag="成交价";
                                        if(data.goods[i].haveNew==true){
                                            var jumpUrl=data.goods[i].nextUrl;
                                        }else{
                                            var jumpUrl="javascript:void(0)";
                                        }
                                        break;
                                    case 6:
                                        state="已结束";
                                        statebutton="参与下一期";
                                        var priceTag="成交价";
                                        if(data.goods[i].haveNew==true){
                                            var jumpUrl=data.goods[i].nextUrl;
                                        }else{
                                            var jumpUrl="javascript:void(0)";
                                        }
                                        break;
                                }

                                if(style==0)
                                {
                                    var drawFrame = '';
                                    //显示抽奖相关框
                                    if (data.goods[i].showMark == 1)
                                    {
                                        //有抽奖资格
                                        if (data.goods[i].prizeMark == 1) {
                                            //是否已抽奖
                                            if (data.goods[i].drawMark == 1)
                                            {
                                                //已中奖
                                                if (data.goods[i].hasWin == 1)
                                                {
                                                    //查看奖品连接
                                                    var viewPrizeJump = host+"/front/view/app/lottery/winrecord2.html?goodsId="+data.goods[i].goodsId+"&source=web&from=auctionList&openid=" + openid;
                                                    drawFrame = '<div class="record-bottom"><div class="diffPrice-pb">您已抽中' + numberTostr(data.goods[i].prizeLevel)+ '等奖： ' + data.goods[i].prizeName + ' </div><a class="diffPrice-btn2" href="' + viewPrizeJump + '" data-href="' + viewPrizeJump + '">查看奖品</a></div>';
                                                } else {
                                                    //未中奖
                                                    drawFrame = '<div class="record-bottom"><div class="diffPrice-pb">参与下次竞拍，获赠更多抽奖机会</div><a class="diffPrice-btn2" href="#">未抽中</a></div>';
                                                }
                                            } else {
                                                //未抽奖
                                                var goDrawPrizeJump = host+"/front/view/app/lottery/index0.html?goodsId=" + data.goods[i].goodsId + "&source=web&from=auctionList&openid=" + openid;
                                                drawFrame = '<div class="record-bottom"><div class="diffPrice-pb">您获赠一次抽奖机会</div><a class="diffPrice-btn3" href="'+goDrawPrizeJump+'" data-href="'+goDrawPrizeJump+'">去抽奖</a></div>';
                                            }
                                        } else {
                                            //没有抽奖资格 完
                                            drawFrame = '<div class="record-bottom"><div class="diffPrice-pb">参与下期竞拍获赠抽奖机会</div></div>';
                                        }
                                    }

                                    if(data.goods[i].chajiagou==1){
                                        var diffPriceJump = host+"/front/view/app/index/difforder.html?goodsId="+data.goods[i].goodsId+"&source=web";
                                        result += '<div class="record recordNow"><div class="record-inner"><div class="goods pull-left"><a class="" href="'+data.goods[i].goods_url+'&source=web'+sdksuffix+'"><dl><dd><div class="pull-left recordImg"><span>'+'<img src="'+data.goods[i].picUrl+'" alt=""></span></div><div class="pull-left recordInformation"><dl><dd><span class="colorBlack">市场价:&nbsp;</span><span class="colorBlack">'+'￥'+data.goods[i].realPrice+'</span></dd><dd><span class="colorRed">'+priceTag+':&nbsp;</span><span class="colorRed">'+'￥'+data.goods[i].bidPrice+'</span></dd><dd><span class="colorBlack">我出价:&nbsp;</span><span class="colorBlack">'+data.goods[i].count+'次'+'</span></dd></dl></div><div class="clear"></div></dd></dl></a></div><div class="recordOperation pull-right"><dl><dd><span class="recordStatus">'+state+'</span></dd><dd><a class="recordGoto-00" href="'+jumpUrl+'" data-href="'+data.goods[i].nextUrl+'">'+statebutton+'</a></dd></dl></div></div><div class="record-bottom"><div class="diffPrice-pb">已返还'+data.goods[i].return_money+'拍币</div><a class="diffPrice-btn" href="'+diffPriceJump+'" data-href="'+diffPriceJump+'">差价购</a></div>';
                                        result += drawFrame;
                                        result += '</div>';
                                    }else {
                                        result += '<div class="record recordNow"><div class="record-inner"><div class="goods pull-left"><a class="" href="'+data.goods[i].goods_url+'&source=web'+sdksuffix+'"><dl><dd><div class="pull-left recordImg"><span>'+'<img src="'+data.goods[i].picUrl+'" alt=""></span></div><div class="pull-left recordInformation"><dl><dd><span class="colorBlack">市场价:&nbsp;</span><span class="colorBlack">'+'￥'+data.goods[i].realPrice+'</span></dd><dd><span class="colorRed">'+priceTag+':&nbsp;</span><span class="colorRed">'+'￥'+data.goods[i].bidPrice+'</span></dd><dd><span class="colorBlack">我出价:&nbsp;</span><span class="colorBlack">'+data.goods[i].count+'次'+'</span></dd></dl></div><div class="clear"></div></dd></dl></a></div><div class="recordOperation pull-right"><dl><dd><span class="recordStatus">'+state+'</span></dd><dd><a class="recordGoto-00" href="'+jumpUrl+'" data-href="'+data.goods[i].nextUrl+'">'+statebutton+'</a></dd></dl></div></div>';
                                        result += drawFrame;
                                        result += '</div>';
                                    }
                                }else {
                                    result +=  '<div class="record recordNow"><div class="record-inner"><div class="goods pull-left"><a class="" href="'+data.goods[i].goods_url+'&source=web'+'"><dl><dd><div class="pull-left recordImg"><span>'+'<img src="'+data.goods[i].picUrl+'" alt=""></span></div><div class="pull-left recordInformation"><dl><dd><span class="colorBlack">市场价:&nbsp;</span><span class="colorBlack">'+'￥'+data.goods[i].realPrice+'</span></dd><dd><span class="colorRed">'+priceTag+':&nbsp;</span><span class="colorRed">'+'￥'+data.goods[i].bidPrice+'</span></dd><dd><span class="colorBlack">我出价:&nbsp;</span><span class="colorBlack">'+data.goods[i].count+'次'+'</span></dd></dl></div><div class="clear"></div></dd></dl></a></div><div class="recordOperation pull-right"><dl><dd><span class="recordStatus">'+state+'</span></dd><dd><a class="recordGoto" href="'+jumpUrl+'" data-href="'+data.goods[i].nextUrl+'">'+statebutton+'</a></dd></dl></div></div></div>';
                                }
                            }


                        }
                        // 数据加载完

                        tabLoad[itemIndex]=true;

                        // 锁定
                        me.lock();
                        // 无数据
                        me.noData();

                    } else {

                        for(var i = 0; i < count; i++){
                            var state;
                            var statebutton;

                            var n = data.goods[i].state;

                            var nextUrl = data.goods[i].nextUrl;

                            if(nextUrl != null){
                                $(".recordGoto").attr("href",nextUrl);
                            }

                            var verCode=AppHelper.YzAppGetVerCode();

                            if(verCode!=108){
                                switch(n)
                                {
                                    case 0:
                                        state="准备中";
                                        statebutton="准备中";
                                        break;
                                    case 1:
                                        state="进行中";
                                        statebutton="继续"+iostxt1;
                                        var priceTag="当前价";
                                        var jumpUrl=data.goods[i].goods_url;
                                        break;
                                    case 2:
                                        state="恭喜您"+iostxt2;
                                        statebutton="去付款";
                                        var priceTag="成交价";
                                        var jumpUrl=host+"/front/view/app/index/order.html?order_id="+data.goods[i].order_id+"&source=web";
                                        break;
                                    case 6:
                                        state="已结束";
                                        statebutton="参与下一期";
                                        var priceTag="成交价";
                                        if(data.goods[i].haveNew==true){
                                            var jumpUrl=data.goods[i].nextUrl;
                                        }else{
                                            var jumpUrl="javascript:void(0)";
                                        }
                                        break;
                                    default:
                                        var n = data.goods[i].goodsState;
                                        // var n = 2;
                                        console.log(n);
                                        var displaystyle="display:none";
                                        var stateclass="";
                                        var shaiMsg="晒单得拍币";
                                        var displaystyle_="display:block";
                                        var _displaystyle="display:block";
                                        var isSDK=myObject.GetQueryString("isSDK");

                                        var showid=data.goods[i].showid;
                                        var kindId=data.goods[i].kindId;
                                        switch(n)
                                        {
                                            case 0:
                                                state="恭喜入手";
                                                if(isSDK){
                                                    _displaystyle="display:none";
                                                    displaystyle="display:block";
                                                }else{
                                                    statebutton="分享赚更多";
                                                    displaystyle="display:block";
                                                    stateclass="twoButton";
                                                }
                                                break;
                                            case 1:
                                                state="晒单审核中";
                                                if(isSDK){
                                                    _displaystyle="display:none";
                                                }else{
                                                    statebutton="分享赚更多";
                                                }
                                                break;
                                            case 2:
                                                state="晒单通过";
                                                if(isSDK){
                                                    _displaystyle="display:none";
                                                }else{
                                                    statebutton="分享赚更多";
                                                }
                                                break;
                                            case 3:
                                                state="晒单失败";
                                                shaiMsg="修改晒单";
                                                displaystyle="display:block";
                                                displaystyle_="display:none";
                                                break;
                                        }

                                        var priceTag="成交价";

                                        var goodsId=data.goods[i].goodsId;
                                        var goodsName=data.goods[i].goodsName;
                                        var imgUrl=data.goods[i].picUrl;
                                        var goodsPeriod=data.goods[i].issue_id;
                                        var dealTime=data.goods[i].win_t;
                                        var dealPrice=data.goods[i].bidPrice;
                                        var failMsg=data.goods[i].msg;

                                        var shai={
                                            'goodsId':goodsId,
                                            'goodsName':goodsName,
                                            'imgUrl':imgUrl,
                                            'goodsPeriod':goodsPeriod,
                                            'dealTime':dealTime,
                                            'dealPrice':dealPrice,
                                            'failMsg':failMsg,
                                            'showid':showid
                                        };
                                        var shaiContent=JSON.stringify(shai);
                                        if(state=="晒单通过"){
                                            var jumpUrl=host+"/front/view/app/index/sharepage.html?showid="+showid+"&source=web";
                                        }else{
                                            var jumpUrl=host+"/front/view/app/index/sharepage.html?goodsId="+kindId+"&source=web";
                                        }


                                        break;
                                    /*case 3:
                                     state="已拍中";
                                     statebutton="参与下一期";
                                     var priceTag="成交价";
                                     if(data.goods[i].haveNew==true){
                                     var jumpUrl=data.goods[i].nextUrl;
                                     }else{
                                     var jumpUrl="javascript:void(0)";
                                     }
                                     break;
                                     case 4:
                                     state="已拍中";
                                     statebutton="参与下一期";
                                     var priceTag="成交价";
                                     break;
                                     case 5:
                                     state="已拍中";
                                     statebutton="参与下一期";
                                     var priceTag="成交价";
                                     if(data.goods[i].haveNew==true){
                                     var jumpUrl=data.goods[i].nextUrl;
                                     }else{
                                     var jumpUrl="javascript:void(0)";
                                     }
                                     break;

                                     case 6:
                                     state="已结束";
                                     statebutton="参与下一期";
                                     var priceTag="成交价";
                                     if(data.goods[i].haveNew==true){
                                     var jumpUrl=data.goods[i].nextUrl;
                                     }else{
                                     var jumpUrl="javascript:void(0)";
                                     }
                                     break;
                                     */
                                }
                                var sdksuffix="";
                                var isSDK=myObject.GetQueryString("isSDK");
                                if(isSDK){
                                    sdksuffix="&isSDK=true";
                                }
                                if(style==3){
                                    if(data.goods[i].chajiagou==1){
                                        result +=  '<div class="record recordNow"><div class="record-inner"><div class="goods pull-left"><a class="" href="'+data.goods[i].goods_url+'&source=web'+sdksuffix+'"><dl><dd><div class="pull-left recordImg"><span>'+'<img src="'+data.goods[i].picUrl+'" alt=""></span></div><div class="pull-left recordInformation"><dl><dd><span class="colorBlack">市场价:&nbsp;</span><span class="colorBlack">'+'￥'+data.goods[i].realPrice+'</span></dd><dd><span class="colorRed">'+priceTag+':&nbsp;</span><span class="colorRed">'+'￥'+data.goods[i].bidPrice+'</span></dd><dd>差价购获得</dd></dl></div><div class="clear"></div></dd></dl></a></div><div class="recordOperation pull-right"><dl><dd class="'+stateclass+'"><span class="recordStatus">'+state+'</span></dd><dd class="shai" style="'+displaystyle+'"><a class="recordGoto" data-href=\''+shaiContent+'\'>'+shaiMsg+'</a></dd><dd style="'+displaystyle_+'"><a class="recordGoto share-btn" href="'+jumpUrl+'" style="'+_displaystyle+'">'+statebutton+'</a></dd></dl></div></div>'+goodsLogistics(data.goods[i].goodsType,data.goods[i].logistics)+'</div>';
                                    }else {
                                        result +=  '<div class="record recordNow"><div class="record-inner"><div class="goods pull-left"><a class="" href="'+data.goods[i].goods_url+'&source=web'+sdksuffix+'"><dl><dd><div class="pull-left recordImg"><span>'+'<img src="'+data.goods[i].picUrl+'" alt=""></span></div><div class="pull-left recordInformation"><dl><dd><span class="colorBlack">市场价:&nbsp;</span><span class="colorBlack">'+'￥'+data.goods[i].realPrice+'</span></dd><dd><span class="colorRed">'+priceTag+':&nbsp;</span><span class="colorRed">'+'￥'+data.goods[i].bidPrice+'</span></dd><dd><span class="colorBlack">我出价:&nbsp;</span><span class="colorBlack">'+data.goods[i].count+'次'+'</span></dd></dl></div><div class="clear"></div></dd></dl></a></div><div class="recordOperation pull-right"><dl><dd class="'+stateclass+'"><span class="recordStatus">'+state+'</span></dd><dd class="shai" style="'+displaystyle+'"><a class="recordGoto" data-href=\''+shaiContent+'\'>'+shaiMsg+'</a></dd><dd style="'+displaystyle_+'"><a class="recordGoto share-btn" href="'+jumpUrl+'" style="'+_displaystyle+'">'+statebutton+'</a></dd></dl></div></div>'+goodsLogistics(data.goods[i].goodsType,data.goods[i].logistics)+'</div>';
                                    }
                                }else if(style==0){

                                    var drawFrame = '';
                                    //显示抽奖相关框
                                    if (data.goods[i].showMark == 1)
                                    {
                                        //有抽奖资格
                                        if (data.goods[i].prizeMark == 1) {
                                            //是否已抽奖
                                            if (data.goods[i].drawMark == 1)
                                            {
                                                //已中奖
                                                if (data.goods[i].hasWin == 1)
                                                {
                                                    //查看奖品连接
                                                    var viewPrizeJump = host+"/front/view/app/lottery/winrecord2.html?goodsId="+data.goods[i].goodsId+"&source=web&from=auctionList&openid=" + openid;
                                                    drawFrame = '<div class="record-bottom"><div class="diffPrice-pb">您已抽中' + numberTostr(data.goods[i].prizeLevel)+ '等奖： ' + data.goods[i].prizeName + ' </div><a class="diffPrice-btn2" href="' + viewPrizeJump + '" data-href="' + viewPrizeJump + '">查看奖品</a></div>';
                                                } else {
                                                    //未中奖
                                                    drawFrame = '<div class="record-bottom"><div class="diffPrice-pb">参与下次竞拍，获赠更多抽奖机会</div><a class="diffPrice-btn2" href="#">未抽中</a></div>';
                                                }
                                            } else {
                                                //未抽奖
                                                var goDrawPrizeJump = host+"/front/view/app/lottery/index0.html?goodsId=" + data.goods[i].goodsId + "&source=web&from=auctionList&openid=" + openid;
                                                drawFrame = '<div class="record-bottom"><div class="diffPrice-pb">您获赠一次抽奖机会</div><a class="diffPrice-btn3" href="'+goDrawPrizeJump+'" data-href="'+goDrawPrizeJump+'">去抽奖</a></div>';
                                            }
                                        } else {
                                            //没有抽奖资格 完
                                            drawFrame = '<div class="record-bottom"><div class="diffPrice-pb">参与下期竞拍获赠抽奖机会</div></div>';
                                        }
                                    }

                                    if(data.goods[i].chajiagou==1){
                                        var diffPriceJump = host+"/front/view/app/index/difforder.html?goodsId="+data.goods[i].goodsId+"&source=web";
                                        result += '<div class="record recordNow"><div class="record-inner"><div class="goods pull-left"><a class="" href="'+data.goods[i].goods_url+'&source=web'+sdksuffix+'"><dl><dd><div class="pull-left recordImg"><span>'+'<img src="'+data.goods[i].picUrl+'" alt=""></span></div><div class="pull-left recordInformation"><dl><dd><span class="colorBlack">市场价:&nbsp;</span><span class="colorBlack">'+'￥'+data.goods[i].realPrice+'</span></dd><dd><span class="colorRed">'+priceTag+':&nbsp;</span><span class="colorRed">'+'￥'+data.goods[i].bidPrice+'</span></dd><dd><span class="colorBlack">我出价:&nbsp;</span><span class="colorBlack">'+data.goods[i].count+'次'+'</span></dd></dl></div><div class="clear"></div></dd></dl></a></div><div class="recordOperation pull-right"><dl><dd><span class="recordStatus">'+state+'</span></dd><dd><a class="recordGoto-00" href="'+jumpUrl+'" data-href="'+data.goods[i].nextUrl+'">'+statebutton+'</a></dd></dl></div></div><div class="record-bottom"><div class="diffPrice-pb">已返还'+data.goods[i].return_money+'拍币</div><a class="diffPrice-btn" href="'+diffPriceJump+'" data-href="'+diffPriceJump+'">差价购</a></div>' ;
                                        result += drawFrame;
                                        result += '</div>';
                                    }else {
                                        result += '<div class="record recordNow"><div class="record-inner"><div class="goods pull-left"><a class="" href="'+data.goods[i].goods_url+'&source=web'+sdksuffix+'"><dl><dd><div class="pull-left recordImg"><span>'+'<img src="'+data.goods[i].picUrl+'" alt=""></span></div><div class="pull-left recordInformation"><dl><dd><span class="colorBlack">市场价:&nbsp;</span><span class="colorBlack">'+'￥'+data.goods[i].realPrice+'</span></dd><dd><span class="colorRed">'+priceTag+':&nbsp;</span><span class="colorRed">'+'￥'+data.goods[i].bidPrice+'</span></dd><dd><span class="colorBlack">我出价:&nbsp;</span><span class="colorBlack">'+data.goods[i].count+'次'+'</span></dd></dl></div><div class="clear"></div></dd></dl></a></div><div class="recordOperation pull-right"><dl><dd><span class="recordStatus">'+state+'</span></dd><dd><a class="recordGoto-00" href="'+jumpUrl+'" data-href="'+data.goods[i].nextUrl+'">'+statebutton+'</a></dd></dl></div></div>';
                                        result += drawFrame;
                                        result += '</div>';
                                    }
                                }else{
                                    result +=  '<div class="record recordNow"><div class="record-inner"><div class="goods pull-left"><a class="" href="'+data.goods[i].goods_url+'&source=web'+sdksuffix+'"><dl><dd><div class="pull-left recordImg"><span>'+'<img src="'+data.goods[i].picUrl+'" alt=""></span></div><div class="pull-left recordInformation"><dl><dd><span class="colorBlack">市场价:&nbsp;</span><span class="colorBlack">'+'￥'+data.goods[i].realPrice+'</span></dd><dd><span class="colorRed">'+priceTag+':&nbsp;</span><span class="colorRed">'+'￥'+data.goods[i].bidPrice+'</span></dd><dd><span class="colorBlack">我出价:&nbsp;</span><span class="colorBlack">'+data.goods[i].count+'次'+'</span></dd></dl></div><div class="clear"></div></dd></dl></a></div><div class="recordOperation pull-right"><dl><dd><span class="recordStatus">'+state+'</span></dd><dd><a class="recordGoto" href="'+jumpUrl+'" data-href="'+data.goods[i].nextUrl+'">'+statebutton+'</a></dd></dl></div></div></div>';
                                }
                            }else{
                                switch(n)
                                {
                                    case 0:
                                        state="准备中";
                                        statebutton="准备中";
                                        break;
                                    case 1:
                                        state="进行中";
                                        statebutton="继续"+iostxt1;
                                        var priceTag="当前价";
                                        var jumpUrl=data.goods[i].goods_url;
                                        break;
                                    case 2:
                                        state="恭喜您"+iostxt2;
                                        statebutton="去付款";
                                        var priceTag="成交价";
                                        var jumpUrl=host+"/front/view/app/index/order.html?order_id="+data.goods[i].order_id+"&source=web";
                                        break;
                                    case 3:
                                        state="已"+iostxt3+"中";
                                        statebutton="参与下一期";
                                        var priceTag="成交价";
                                        if(data.goods[i].haveNew==true){
                                            var jumpUrl=data.goods[i].nextUrl;
                                        }else{
                                            var jumpUrl="javascript:void(0)";
                                        }
                                        break;
                                    case 4:
                                        state="已"+iostxt3+"中";
                                        statebutton="参与下一期";
                                        var priceTag="成交价";
                                        break;
                                    case 5:
                                        state="已"+iostxt3+"中";
                                        statebutton="参与下一期";
                                        var priceTag="成交价";
                                        if(data.goods[i].haveNew==true){
                                            var jumpUrl=data.goods[i].nextUrl;
                                        }else{
                                            var jumpUrl="javascript:void(0)";
                                        }
                                        break;
                                    case 6:
                                        state="已结束";
                                        statebutton="参与下一期";
                                        var priceTag="成交价";
                                        if(data.goods[i].haveNew==true){
                                            var jumpUrl=data.goods[i].nextUrl;
                                        }else{
                                            var jumpUrl="javascript:void(0)";
                                        }
                                        break;
                                }
                                if(style==0){
                                    var drawFrame = '';
                                    //显示抽奖相关框
                                    if (data.goods[i].showMark == 1)
                                    {
                                        //有抽奖资格
                                        if (data.goods[i].prizeMark == 1) {
                                            //是否已抽奖
                                            if (data.goods[i].drawMark == 1)
                                            {
                                                //已中奖
                                                if (data.goods[i].hasWin == 1)
                                                {
                                                    //查看奖品连接
                                                    var viewPrizeJump = host+"/front/view/app/lottery/winrecord2.html?goodsId="+data.goods[i].goodsId+"&source=web&from=auctionList&openid=" + openid;
                                                    drawFrame = '<div class="record-bottom"><div class="diffPrice-pb">您已抽中' + numberTostr(data.goods[i].prizeLevel)+ '等奖： ' + data.goods[i].prizeName + ' </div><a class="diffPrice-btn2" href="' + viewPrizeJump + '" data-href="' + viewPrizeJump + '">查看奖品</a></div>';
                                                } else {
                                                    //未中奖
                                                    drawFrame = '<div class="record-bottom"><div class="diffPrice-pb">参与下次竞拍，获赠更多抽奖机会</div><a class="diffPrice-btn2" href="#">未抽中</a></div>';
                                                }
                                            } else {
                                                //未抽奖
                                                var goDrawPrizeJump = host+"/front/view/app/lottery/index0.html?goodsId=" + data.goods[i].goodsId + "&source=web&from=auctionList&openid=" + openid;
                                                drawFrame = '<div class="record-bottom"><div class="diffPrice-pb">您获赠一次抽奖机会</div><a class="diffPrice-btn3" href="'+goDrawPrizeJump+'" data-href="'+goDrawPrizeJump+'">去抽奖</a></div>';
                                            }
                                        } else {
                                            //没有抽奖资格 完
                                            drawFrame = '<div class="record-bottom"><div class="diffPrice-pb">参与下期竞拍获赠抽奖机会</div><a class="diffPrice-btn2" href="#">查看奖品</a></div>';
                                        }
                                    }
                                    if (data.goods[i].chajiagou==1) {
                                        var diffPriceJump = host+"/front/view/app/index/difforder.html?goodsId="+data.goods[i].goodsId+"&source=web";
                                        result += '<div class="record recordNow"><div class="record-inner"><div class="goods pull-left"><a class="" href="'+data.goods[i].goods_url+'&source=web'+sdksuffix+'"><dl><dd><div class="pull-left recordImg"><span>'+'<img src="'+data.goods[i].picUrl+'" alt=""></span></div><div class="pull-left recordInformation"><dl><dd><span class="colorBlack">市场价:&nbsp;</span><span class="colorBlack">'+'￥'+data.goods[i].realPrice+'</span></dd><dd><span class="colorRed">'+priceTag+':&nbsp;</span><span class="colorRed">'+'￥'+data.goods[i].bidPrice+'</span></dd><dd><span class="colorBlack">我出价:&nbsp;</span><span class="colorBlack">'+data.goods[i].count+'次'+'</span></dd></dl></div><div class="clear"></div></dd></dl></a></div><div class="recordOperation pull-right"><dl><dd><span class="recordStatus">'+state+'</span></dd><dd><a class="recordGoto-00" href="'+jumpUrl+'" data-href="'+data.goods[i].nextUrl+'">'+statebutton+'</a></dd></dl></div></div><div class="record-bottom"><div class="diffPrice-pb">已返还'+data.goods[i].return_money+'拍币</div><a class="diffPrice-btn" href="'+diffPriceJump+'" data-href="'+diffPriceJump+'">差价购</a></div>';
                                        result += drawFrame;
                                        result += '</div>';
                                    } else {
                                        result += '<div class="record recordNow"><div class="record-inner"><div class="goods pull-left"><a class="" href="'+data.goods[i].goods_url+'&source=web'+sdksuffix+'"><dl><dd><div class="pull-left recordImg"><span>'+'<img src="'+data.goods[i].picUrl+'" alt=""></span></div><div class="pull-left recordInformation"><dl><dd><span class="colorBlack">市场价:&nbsp;</span><span class="colorBlack">'+'￥'+data.goods[i].realPrice+'</span></dd><dd><span class="colorRed">'+priceTag+':&nbsp;</span><span class="colorRed">'+'￥'+data.goods[i].bidPrice+'</span></dd><dd><span class="colorBlack">我出价:&nbsp;</span><span class="colorBlack">'+data.goods[i].count+'次'+'</span></dd></dl></div><div class="clear"></div></dd></dl></a></div><div class="recordOperation pull-right"><dl><dd><span class="recordStatus">'+state+'</span></dd><dd><a class="recordGoto-00" href="'+jumpUrl+'" data-href="'+data.goods[i].nextUrl+'">'+statebutton+'</a></dd></dl></div></div>';
                                        result += drawFrame;
                                        result += '</div>';
                                    }

                                } else {
                                    result += '<div class="record recordNow"><div class="record-inner"><div class="goods pull-left"><a class="" href="' + data.goods[i].goods_url + '&source=web' + '"><dl><dd><div class="pull-left recordImg"><span>' + '<img src="' + data.goods[i].picUrl + '" alt=""></span></div><div class="pull-left recordInformation"><dl><dd><span class="colorBlack">市场价:&nbsp;</span><span class="colorBlack">' + '￥' + data.goods[i].realPrice + '</span></dd><dd><span class="colorRed">' + priceTag + ':&nbsp;</span><span class="colorRed">' + '￥' + data.goods[i].bidPrice + '</span></dd><dd><span class="colorBlack">我出价:&nbsp;</span><span class="colorBlack">' + data.goods[i].count + '次' + '</span></dd></dl></div><div class="clear"></div></dd></dl></a></div><div class="recordOperation pull-right"><dl><dd><span class="recordStatus">' + state + '</span></dd><dd><a class="recordGoto" href="' + jumpUrl + '" data-href="' + data.goods[i].nextUrl + '">' + statebutton + '</a></dd></dl></div></div></div>';
                                }
                            }

                        }
                    }

                }else{
                    if(page==1){

                        $('.tab-content-active').html('<div class="emptyBox"><img src="../../../static/img/emptyBox.png"><p class="emptyContent">暂无商品</p></div>');
                        $('.emptyBox').css("marginTop",marginTop);
                        $(".dropload-down").hide();
                    }
                    //锁定
                    me.lock();
                    //无数据
                    me.noData();
                    me.resetload();
                    tabLoad[itemIndex]=true;



                }


                $('.tab-content-active .recordContent .lists').append(result);


                // 每次数据加载完，必须重置
                me.resetload();


            },
            error: function(xhr, type){
                myObject.alert('请求失败!');

                // 即使加载出错，也得重置
                me.resetload();
            },


        });

    },
    autoLoad:true,
    threshold:50,
});

function numberTostr(section) {
    var chnNumChar = ["零","一","二","三","四","五","六","七","八","九"];
    var chnUnitSection = ["","万","亿","万亿","亿亿"];
    var chnUnitChar = ["","十","百","千"];

    var strIns = '', chnStr = '';
    var unitPos = 0;
    var zero = true;

    while(section > 0){
        var v = section % 10;
        if(v === 0){
            if(!zero){
                zero = true;
                chnStr = chnNumChar[v] + chnStr;
            }
        }else{
            zero = false;
            strIns = chnNumChar[v];
            strIns += chnUnitChar[unitPos];
            chnStr = strIns + chnStr;
        }
        unitPos++;
        section = Math.floor(section / 10);
        return chnStr;
    }
}


//获取物流信息相关
function goodsLogistics(type,logistics){
    console.log(logistics);
    if(type == 0){
        if(logistics == 0){
            return '<div class="goods-logistics">您的商品正在准备中，请耐心等待物流状态更新</div>'
        }else {
            return '<div class="goods-logistics">您的商品已发货，物流:京东快递，快递单号:'+logistics+'</div>'
        }
    }else if(type == 1){
        if(logistics == 0){
            return '<div class="goods-logistics">您的会员卡正在准备中，请耐心等待状态更新</div>'
        }else {
            return '<div class="goods-logistics" style="width: 100%">您的会员卡密为:'+logistics+'<a href="../index/viprule.html" class="associator-rule">使用方法</a></div>'
        }
    }else if(type == 2){
        if(logistics == 0){
            return '<div class="goods-logistics">您的话费还未充值，请耐心等待</div>'
        }else if(logistics == 1){
            return '<div class="goods-logistics">您的话费充值失败，请联系客服了解详细情况</div>'
        }else if(logistics == 2){
            return '<div class="goods-logistics">您的话费已到账，可自行查看话费余额</div>'
        }else if(logistics == 3) {
            return '<div class="goods-logistics">您的话费正在充值中，可稍后查看话费余额</div>'
        }else {
            return ''
        }
    }else {
        return '<div class="goods-logistics">您的商品暂无相关信息，请联系客服了解详细情况</div>'
    }
}