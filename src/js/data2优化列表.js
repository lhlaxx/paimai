var pageSize=10;
var classId=0;
var tabActive=myObject.GetQueryString("category");
if(tabActive!=null){
    classId=tabActive;
}
console.log(classId);
var page=0;
var symbol="￥";

var itemIndex = 0;
var tabLoad=[];

//请求分类并输出
function first_load(data){
    var category=data.data.lable_list.length;
    var tabActive=myObject.GetQueryString("category");
    if(tabActive!=null&&tabActive!=0){

        var result='<li><a  data-index="0" data-id="0" href="#">全部商品</a></li>';
        var result_='<div class="cat" data-index="0"><div class="goodslistContent"><div class="lists"></div></div></div>';
        for(i=0;i<category;i++){
            var categoryName=data.data.lable_list[i].name;
            var categoryId=data.data.lable_list[i].id;
            if(tabActive==categoryId){
                result+='<li><a class="tab-active" data-index="'+(i+1)+'" href="#" data-id="'+categoryId+'">'+categoryName+'</a></li>'
                //$(".tabs-vertical ul li").eq(i).find("a").html(categoryName);
                result_+='<div class="tab-content-active cat" data-index="'+(i+1)+'"><div class="goodslistContent"><div class="lists"></div></div></div>'
            }else{
                result+='<li><a data-index="'+(i+1)+'" href="#" data-id="'+categoryId+'">'+categoryName+'</a></li>'
                //$(".tabs-vertical ul li").eq(i).find("a").html(categoryName);
                result_+='<div class="cat" data-index="'+(i+1)+'"><div class="goodslistContent"><div class="lists"></div></div></div>'
            }

            tabLoad[i]=false;
        }
    }else{
        var result='<li><a class="tab-active" data-index="0" data-id="0" href="#">全部商品</a></li>';
        var result_='<div class="tab-content-active cat" data-index="0"><div class="goodslistContent"><div class="lists"></div></div></div>';
        for(i=0;i<category;i++){
            var categoryName=data.data.lable_list[i].name;
            var categoryId=data.data.lable_list[i].id;
            result+='<li><a data-index="'+(i+1)+'" href="#" data-id="'+categoryId+'">'+categoryName+'</a></li>'
            //$(".tabs-vertical ul li").eq(i).find("a").html(categoryName);
            result_+='<div class="cat" data-index="'+(i+1)+'"><div class="goodslistContent"><div class="lists"></div></div></div>'
            tabLoad[i]=false;
        }
    }


    $(".tabs-vertical ul").append(result);
    $(".tabs-content-placeholder").prepend(result_);
}

	var widget = $('.tabs-vertical');
    var tabs = widget.find('ul a');
    var content = widget.find('.tabs-content-placeholder > div');
    widget.on('click','li',function (e) {
        e.preventDefault();
        // Get the data-index attribute, and show the matching content div
        var index = $(this).find('ul a').data('id');

        var btnName=$(this).find('ul a').html();

        var num=parseInt($(this).find('ul a').data('index'));
        num=num+1;
        console.log(num);
        if(num<10){
            num="0"+num;
        }
        var extra={
            "btnName":btnName,
            "position":"04"+num+"000"
        }
        console.log(extra);
        var Op = "",clickJson = "";
        Op={
            "ot":"3"
        };
        clickJson={
            "actionId":5,
            "uuid":AppHelper.YzAppGetUUID(),
            "openId":openid,
            "ident":"100016",
            "date":parseInt(new Date().getTime() / 1000),
            "name":"商品列表点击左侧按钮",
            "extra":extra
        };
        myObject.addStatisticsEvent(Op,clickJson);


        classId=index;
        var  itemIndex =$(this).find('ul a').data('index');
        
        $(this).find("a").addClass('tab-active');
        $(this).siblings().find("a").removeClass('tab-active');
        $(".tabs-content-placeholder .cat").eq(itemIndex).addClass('tab-content-active');
        $(".tabs-content-placeholder .cat").eq(itemIndex).siblings().removeClass('tab-content-active');

        $('.tab-content-active .goodslistContent .lists').html("");
        $('.tab-content-active').siblings().find(".lists").html("");
        page=0;  
        
        tabLoad[itemIndex]=false;  
        
        if(!tabLoad[itemIndex]){
            // 解锁
            dropload.unlock();
            dropload.noData(false);
        }else{
            // 锁定
            dropload.lock('down');
            dropload.noData();
        }
	
        dropload.resetload();

        clear(test);

    });


	
	
    //dropload();

	var dropload=$('.tabs-content-placeholder').dropload({
        //scrollArea : window, 
        domDown : {
            domClass   : 'dropload-down',
            domRefresh : '<div class="dropload-refresh">↑上拉加载更多</div>',
            domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
            domNoData  : '<div class="dropload-noData">哇塞,你好厉害终于看完了</div>'
        },
        loadDownFn : function(me){
        	console.log("下拉刷新");
            page++;
            var result = '';
            console.log("page:"+page);
            console.log(classId);
            $.ajax({
                type: 'GET',
                async: false,
                url: host+'/index.php/index/Goods/getList',
                dataType: "jsonp",
                jsonp: "callback",
                data:{'chanel':channel,'verCode':verCode,'page':page,'pageSize':pageSize,'classId':classId,'uuid':uuid},
                success: function(data){
                         if(page==1){
                             first_load(data);
                         }
                        console.log(data);
                        var count=data.data.goods_list.length;
                        
                        if(count>0){
                            if(10*page>data.data.total){
                                
                                for(var i = 0; i <data.data.total-10*(page-1); i++){
                                    var picUrl=data.data.goods_list[i].picUrl;
                                    var cornerUrl=data.data.goods_list[i].cornerUrl;
                                    if(picUrl==null){
                                        picUrl="";
                                    }
                                    if(cornerUrl!=null){
                                        var orderContent='<img class="corner" src="'+cornerUrl+'"/>';
                                    }else{
                                        var orderContent="";
                                    }

                                    if(data.data.goods_list[i].is_start==0){
                                        //商品在预约
                                        if(browser.versions.ios){
                                            var bidContent="抢购";
                                        }else{
                                            var bidContent="竞拍";
                                        }
                                        var bidPrice="";
                                        var symbol="";
                                        var starttime=data.data.goods_list[i].start_left_time;
                                        
                                        var goodsid=data.data.goods_list[i].goodsId;
                                        
                                        var clock='<span class="pull-left clock"><img src="../../../static/img/clock.png"/></span>';
                                        var minute_show_id="minute_show_"+data.data.goods_list[i].goodsId;
                                        var second_show_id="second_show_"+data.data.goods_list[i].goodsId;
                                        var startminute=toZero(Math.floor(starttime/60));
                                        var startsecond=toZero(starttime-Math.floor(starttime/60)*60);
                                        
                                        lefttime='<span id="'+minute_show_id+'">'+startminute+'</span><span>:</span><span id="'+second_show_id+'">'+startsecond+'</span>';
                                        var intDiff_= parseInt(starttime);//倒计时总秒数量
                                        
                                        if(data.state=="100"){
                                        	
                                        }else{
                                        	clocktime(intDiff_,minute_show_id,second_show_id,goodsid);
                                        }
                                          
                                        
                                        
                                    }else{
                                        if(browser.versions.ios){
                                            var bidContent="抢购";
                                        }else{
                                            var bidContent="竞拍";
                                        }
                                        var bidPrice=data.data.goods_list[i].bidPrice;
                                        var clock="";
                                        var symbol="￥";
                                        lefttime="";
                                    }
                                    
                                    var goodsUrl=host+"/front/view/app/index/details.html?goodsid="+data.data.goods_list[i].goodsId;
                                    var goodsName=data.data.goods_list[i].goodsName;
                                    if(goodsName.length>25){
                                        goodsName=goodsName.slice(0,25)+"...";
                                    }
                                    var goodsId=data.data.goods_list[i].goodsId;
                                    result += '<div class="goodsAuction"><a data-href="'+goodsUrl+'" id="'+goodsId+'"><div class="pull-left goodsAuction_img">'+orderContent+'<img src="'+picUrl+'"/></div><div class="pull-right goodsAuction_details"><dl><dd><span class="goodsAuction_name">'+goodsName+'</span></dd><dd><span class="pull-left colorRed symbol">'+symbol+'</span><span class="goodsAuction_price pull-left">'+bidPrice+'</span>'+clock+'<span class="left-time pull-left">'+lefttime+'</span><div class="goodsAuction_bidding pull-right">'+bidContent+'</div></dd></dl></div></a></div>';
                                }
                                // 数据加载完
                                    tabLoad[itemIndex] = true;
                                   
                                    // 锁定
                                    me.lock();
                                    // 无数据
                                    me.noData();
                            }else{
                                
                                for(var i = 0; i < 10; i++){
                                    
                                    var picUrl=data.data.goods_list[i].picUrl;
                                    var cornerUrl=data.data.goods_list[i].cornerUrl;
                                    if(picUrl==null){
                                        picUrl="";
                                    }
                                    if(cornerUrl!=null){
                                        var orderContent='<img class="corner" src="'+cornerUrl+'"/>';
                                    }else{
                                        var orderContent=""
                                    }  


                                    if(data.data.goods_list[i].is_start==0){
                                        if(browser.versions.ios){
                                            var bidContent="抢购";
                                        }else{
                                            var bidContent="竞拍";
                                        }
                                        var bidPrice="";
                                        var symbol="";
                                        var starttime=data.data.goods_list[i].start_left_time;
                                        var clock='<span class="pull-left clock"><img src="../../../static/img/clock.png"/></span>';
                                        var minute_show_id="minute_show_"+data.data.goods_list[i].goodsId;
                                        var second_show_id="second_show_"+data.data.goods_list[i].goodsId;
                                        var startminute=toZero(Math.floor(starttime/60));
                                        var startsecond=toZero(starttime-Math.floor(starttime/60)*60);
                                        
                                        lefttime='<span id="'+minute_show_id+'">'+startminute+'</span><span>:</span><span id="'+second_show_id+'">'+startsecond+'</span>';

                                        var goodsid=data.data.goods_list[i].goodsId;
                                        

                                        var intDiff_= parseInt(starttime);//倒计时总秒数量

                                        if(data.state=="100"){
                                        	
                                        }else{
                                        	clocktime(intDiff_,minute_show_id,second_show_id,goodsid); 
                                        }
                                        
                                               
                                        
                                                                                    
                                    }else{
                                        if(browser.versions.ios){
                                            var bidContent="抢购";
                                        }else{
                                            var bidContent="竞拍";
                                        }
                                        var bidPrice=data.data.goods_list[i].bidPrice;
                                        var clock="";
                                        var symbol="￥";
                                        lefttime="";
                                    }
                                    
                                    var goodsName=data.data.goods_list[i].goodsName;
                                    if(goodsName.length>25){
                                        goodsName=goodsName.slice(0,25)+"...";
                                    }
                                    var goodsUrl=host+"/front/view/app/index/details.html?goodsid="+data.data.goods_list[i].goodsId;
                                    var goodsId=data.data.goods_list[i].goodsId;
                                    result += '<div class="goodsAuction"><a data-href="'+goodsUrl+'" id="'+goodsId+'"><div class="pull-left goodsAuction_img">'+orderContent+'<img src="'+picUrl+'"/></div><div class="pull-right goodsAuction_details"><dl><dd><span class="goodsAuction_name">'+goodsName+'</span></dd><dd><span class="pull-left colorRed symbol ">'+symbol+'</span><span class="goodsAuction_price pull-left">'+bidPrice+'</span>'+clock+'<span class="left-time pull-left">'+lefttime+'</span><div class="goodsAuction_bidding pull-right">'+bidContent+'</div></dd></dl></div></a></div>';
                                   
                                    
                                }

                            }
                            
                        }else{
                            if(page==1){
                                $('.tabs-vertical .tabs-content-placeholder').css("height","100%");
                                $('.tab-content-active').html('<div class="emptyBox"><img src="../../../static/img/emptyBox.png"><p class="emptyContent">暂无商品</p></div>');
                                $('.emptyBox').css("marginTop",marginTop);

                                $(".dropload-down").hide();
                            }
                            //锁定
                            me.lock();
                            //无数据
                            me.noData();
                            me.resetload();
                            tabLoad[itemIndex] = true;
                            
                            
                        }  
                        
                        $('.tab-content-active .goodslistContent .lists').append(result);
                        // 每次数据加载完，必须重置
                        me.resetload();
                    
                    
                },
                error: function(xhr, type){
                    //debugger;
                    /*var no_network_html='';
                    no_network_html += '<div class="no_network" style="position: fixed;height: 100%;background: #f2f2f2;width: 100%;z-index: 8;">'
                                        +      '<div class="no_network_center" style="position: relative;top: 50%;left: 50%;width: 5rem;margin-left: -2.5rem;margin-top: -2.5rem;">'  
                                        +            '<img src="../../../static/img/no_network.png" style="width: 100%;">' 
                                        +            '<p style="text-align:  center;padding: 0.2rem 0;color: #333;font-size: 0.4rem;">网络开小差哦！</p>'          
                                        +       '</div>' 
                                        +  '</div>' 
                    //$(".navbar").append(no_network_html);*/
                    myObject.alert('请求失败!');
                    
                    // 即使加载出错，也得重置
                    me.resetload();
                }
            });
        },
        autoLoad:true,
        threshold:50,
	});



var int=self.setInterval("UpdateData()",10000);
    function UpdateData(){
        var pageSize=$(".tabs-content-placeholder .tab-content-active .lists .goodsAuction").length;
        if(pageSize==0){
            return
        }

        $.ajax({
            type: 'GET',
            async: false,
            url:host+'/index.php/index/Goods/getList',
            dataType: "jsonp",
            jsonp: "callback",
            data:{'chanel':channel,'verCode':verCode,'page':1,'pageSize':pageSize,'classId':classId,'uuid':uuid},
            success: function(data){
                console.log(data.state);
                if(data.state=="100"){
                    return
                }
                var j=pageSize;
                console.log("pageSize:"+pageSize);
                
                if(j==0){   
                }else{
                    for(var i=0;i<j;i++){
                        var abc=$(".tab-content-active .goodsAuction").eq(i).find("a").attr("class");
                        if(abc==null){
                            abc="";
                        }
                         console.log(abc);
                        if(abc.indexOf("unstart")<0){
                            var priceid=data.data.goods_list[i].goodsId;
                            console.log(data.data.goods_list);
                            console.log(priceid);
                            var priceid_last=$(".tab-content-active .goodsAuction").eq(i).find("a").attr("id");
                            
                            if(priceid_last==priceid){
                                var price=data.data.goods_list[i].bidPrice;
                                
                                var price_last=$(".tab-content-active .goodsAuction").eq(i).find(".goodsAuction_price").html();
                               
                                if(data.data.goods_list[i].is_start==1){
                                    if(price!=price_last||price_last==""){
                                    $(".tab-content-active .goodsAuction").eq(i).find(".goodsAuction_price").css("background","#fe4141");
                                    $(".tab-content-active .goodsAuction").eq(i).find(".goodsAuction_price").html(price);
                                    $(".tab-content-active .goodsAuction").eq(i).find(".goodsAuction_price").animate({background:"#fff"},500);
                                    }
                                }else{
                                
                                }
                            }else{
                                console.log("列表对应不上");
                                $('.tab-content-active .goodslistContent .lists').html("");
                                page=0; 
                                tabLoad[itemIndex] = false;
                                //setTimeout(function(){
                                    var catid=$(".tab-content-active").attr("data-index");
                                    //myObject.alert(catid);
                                    //window.location.reload(); 
                                    $(".tabs-left ul li").eq(catid).trigger("click");
                                //},2000)
                                //dropload.resetload();

                                clear(test);
                                break;
                            }  
                        } 
                    }         
                }             
            },
            error: function(xhr, type){
                myObject.alert('请求失败!');
            }
        });
    }
    


    
    function clocktime(intDiff_,minute_show_id,second_show_id,goodsid){
        
        var timeEnd = parseInt(intDiff_*1);
        setTime();
        function setTime() {
            var day=0, hour=0, minute=0, second=0;//时间默认值
            if(intDiff_ > 0){
                day = Math.floor(intDiff_ / (60 * 60 * 24));
                hour = Math.floor(intDiff_ / (60 * 60)) - (day * 24);
                minute = Math.floor(intDiff_ / 60) - (day * 24 * 60) - (hour * 60);
                second = Math.floor(intDiff_) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
            }

            $("#"+goodsid).addClass("unstart");
            $("#"+minute_show_id).html(toZero(minute));
            $("#"+second_show_id).html(toZero(second));
            if (intDiff_ <= 0) {
                
                $("#"+goodsid).find(".symbol").html("￥");
                $("#"+goodsid).find(".clock").html("");
                $("#"+goodsid).find(".left-time").html("");
                //ajax请求
                $("#"+goodsid).removeClass("unstart");
                UpdateData();
                return false;
            }else {
                test.push(setTimeout(function () {
                    setTime();
                }, 1000));
            }

            intDiff_--;
        }
        

    }
    function toZero(num) {
            if (num <= 9) {
                return "0" + num;
            } else {
                return "" + num;
            }
        }
    function clear(timeouts) {
       
        for (var i in timeouts) {
            clearTimeout(timeouts[i]);
        }
        timeouts = [];
    }
	
     




   