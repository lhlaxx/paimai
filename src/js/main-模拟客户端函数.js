var AppHelper=AppHelper;
var currentHost=window.location.host;
if(currentHost.indexOf('61.152.66.114') >= 0){
    currentHost='http://'+ currentHost+'/auc/';
}else{
    currentHost='http://'+ currentHost+'/';
}
var myObject={
    host:currentHost,
    init:function(){
        //this.isNew();
        //this.isNew();
        this.addLoginEvent();
        //this.alertPosition();
        this.hasBlur();
        this.clearInput();
    },
    alert:function(msg,times) {
        $("body").append($("<div class='tips'>" + msg + "</div>"));
        var tipsTop = ($(window).height() - $(".tips").height()) / 2;
        $(".tips").css("top", tipsTop + "px");
        $(".tips").hide();
        setTimeout(function(){
            $(".tips").show();
        },250);
        setTimeout(function() {
            $(".tips").hide();
            $(".tips").remove();
        }, times ? times : 3000);
    },
    addLoginEvent:function(){
        $("body").on("click",".loginButton",function(){
            if(browser.versions.mobile){
                var type=$(this).data("type");
                if(type=="TOUR"){
                    myObject.YKLogin(0);
                }else{
                    if(browser.versions.android){
                        var jsonstr={"from":$(this).attr("data-type"),"callback":"myObject.addLoginCallback"};
                    }else if(browser.versions.ios){
                        var jsonstr={"from":$(this).attr("data-type"),"callback":"myObject.addLoginCallback_"};
                    }
                    window.Auction.login(JSON.stringify(jsonstr));
                }
                
            }
            
        });
    },
    YKLogin:function(yk){
        var uuid=AppHelper.YzAppGetUUID();
        var deviceid=AppHelper.YzAppGetDeviceId();
        var appid=AppHelper.YzAppGetAppId();
        var channel=AppHelper.YzAppGetChannel();
        var verCode=AppHelper.YzAppGetVerCode();
        var platform;
        if(browser.versions.mobile){
            if(browser.versions.android){
                platform=1;
            }else if(browser.versions.ios){
                platform=2;
            }
        }
        var openid=uuid;
        var unionid=uuid;
        var sex=0;
        var headimgurl="";
        var nickname="";
        var if_yk=yk;
        var thirddata={
            'openid':openid,
            'unionid':unionid,
            'sex':sex,
            'headimgurl':headimgurl,
            'nickname':nickname,
            'if_yk':if_yk
        }
        thirddata=JSON.stringify(thirddata);
        $.ajax({
            type:'post',
            async: false,
            url:myObject.host+'/index.php/index/Oauthlogin/getCode',
            dataType:'json',
            data:{'oauth_from':'yk','deviceid':deviceid,'appid':appid,'chanel':channel,'platform':platform,'thirddata':thirddata,'verCode':verCode,'uuid':uuid},
            success:function(data) {
                if(data.state==1){
                    var loc=window.location.href;
                    if(loc.indexOf("index1")>=0){

                    }else{
                        if(data.if_bind==1){
                            $(".tipBox").show();
                            return
                        }
                    }
                    
                        
                    if(browser.versions.ios){
                        if(loc.indexOf("index1")>=0){
                            myObject.alert("游客模式登录成功,请进行出价")
                        }else{
                            myObject.alert("游客模式登录成功");
                        } 
                    }else{
                        myObject.alert("游客模式登录成功");
                    }
                    
                    
                    var openid=data.data.openid;
                    var nickName=data.data.nickName;
                    var picUrl=data.data.head;
                    var memberno=data.data.memberno;
                    var isBind=data.data.isBind;
                    var isNew=data.data.isNew;
                    var bindPhone=data.data.bindPhone;
                    var shareCode=data.data.shareCode;
                    if(picUrl.indexOf('http')<0){
                        picUrl="../../../static/img/usercenter/photo.png";
                    }
                    
                    store.set('openid',openid);
                    store.set('nickName',nickName);
                    store.set('picUrl',picUrl);
                    store.set('memberno',memberno);
                    store.set('isBind',isBind);
                    store.set('isNew',isNew);
                    store.set('phone',bindPhone);
                    store.set('shareCode',shareCode);
                    
                    var verCode=AppHelper.YzAppGetVerCode();
                    if(verCode!=108){
                        var shareCode=data.data.shareCode;
                        if(shareCode!=""){
                            myObject.commonJsonpAjax(myObject.host+'/index.php/index/Share/mkTree',{
                            'scode':shareCode,
                            }, function(data){
                                if(data.state=="1"){
                                    store.set('isNew',false);
                                }
                            },function(){
                            
                            });
                        }  
                        
                        if(isNew==false){
                            var isFirst=0;
                        }else{
                            var isFirst=1;
                        }
                            
                        
                        setTimeout(function(){
                            var loc=window.location.href;
                            if(loc.indexOf("from=homeRecharge")>=0){
                                window.location.href=myObject.host+'/front/view/app/index/recharge.html?from=homeRecharge';
                            }else if(loc.indexOf("from=startpage")>=0){
                                window.Auction.back();
                            }else if(loc.indexOf("from=homeMaster")>=0){
                                window.location.href=myObject.host+'/front/view/app/index/sharegets.html';
                            }
                            if(loc.indexOf("index1.html")>=0){
                                store.set('ykflag',1);
                            }
                            if(loc.indexOf("index2.html")>=0){
                                store.set('ykflag',1);
                            }
                            if(browser.versions.mobile){
                                if(browser.versions.android){
                                    window.Auction.loginSuccess(openid,memberno,isFirst);
                                }else if(browser.versions.ios){
                                    var jsonstr={"openid":openid,"memberno":memberno,"isFirst":isFirst};
                                    window.Auction.loginSuccess(JSON.stringify(jsonstr));
                                }
                            }
                            

                        },1000)
                        
                        
                    }else if(verCode==108){
                        if(loc.indexOf("from=homeRecharge")>=0){
                            window.location.href=myObject.host+'/front/view/app/index/recharge.html?from=homeRecharge';
                        }else if(loc.indexOf("from=startpage")>=0){
                            window.Auction.back();
                        }else if(loc.indexOf("from=mycenter")>=0){
                            window.location.href=myObject.host+'/front/view/app/user/index.html';
                        }else{
                            window.history.go(-1);
                        }
                        if(loc.indexOf("index1.html")>=0){
                            store.set('ykflag',1);
                        }
                        if(loc.indexOf("index2.html")>=0){
                            store.set('ykflag',1);
                        }
                        if(browser.versions.mobile){
                            if(browser.versions.android){
                                window.Auction.loginSuccess(openid,memberno,isFirst);
                            }else if(browser.versions.ios){
                                var jsonstr={"openid":openid,"memberno":memberno,"isFirst":isFirst};
                                window.Auction.loginSuccess(JSON.stringify(jsonstr));
                            }
                        }

                    }

                    
                    
                    
                }else if(data.state==0){
                    myObject.alert(data.msg);
                }
            },
            error:function(){
                myObject.alert("网络不给力...");
            }
        });
    },
    addLoginCallback:function(resultCode,resultMsg){
        if(resultCode == 1){
            var loc=window.location.href;
            var obj = eval('(' + resultMsg + ')');
            var platform=obj.platform;
            var oauth_from=obj.oauth_from;
            var deviceid=obj.deviceid;
            var appid=obj.appid;
            var channel=obj.channel;
            var thirddata1=obj.thirddata;
            var thirddata=JSON.stringify(thirddata1);
            var verCode=obj.versionCode;
            var uuid=AppHelper.YzAppGetUUID();
            store.set('verCode',verCode);
            store.set('channel',channel);
            $.ajax({
                type:'post',
                async: false,
                url:myObject.host+'/index.php/index/Oauthlogin/getCode',
                dataType:'json',
                data:{'oauth_from':oauth_from,'deviceid':deviceid,'appid':appid,'chanel':channel,'platform':platform,'thirddata':thirddata,'verCode':verCode,'uuid':uuid},
                success:function(data) {
                    if(data.state==1){
                        myObject.alert("登录成功");
                        var openid=data.data.openid;
                        var nickName=data.data.nickName;
                        var picUrl=data.data.head;
                        var memberno=data.data.memberno;
                        var isBind=data.data.isBind;
                        var isNew=data.data.isNew;
                        var bindPhone=data.data.bindPhone;
                        var shareCode=data.data.shareCode;
                        if(picUrl.indexOf('http')<0){
                            picUrl="../../../static/img/usercenter/photo.png";
                        }
                        
                        store.set('openid',openid);
                        store.set('nickName',nickName);
                        store.set('picUrl',picUrl);
                        store.set('memberno',memberno);
                        store.set('isBind',isBind);
                        store.set('isNew',isNew);
                        store.set('phone',bindPhone);
                        store.set('shareCode',shareCode);
                        var loc=window.location.href;

                        if(loc.indexOf("from=refund")>=0){
                            //统计
                            var Op = "",clickJson = "";
                            Op={
                                "ot":"3"
                            };
                            clickJson={
                                "actionId":5,
                                "uuid":AppHelper.YzAppGetUUID(),
                                "openId":openid,
                                "ident":"100209",
                                "date":parseInt(new Date().getTime() / 1000),
                                "name":"必返登录成功"
                            };
                            myObject.addStatisticsEvent(Op,clickJson);
                        }

                        if(oauth_from=="wechatapp"){
                            if(loc.indexOf("from=startpage")>=0){

                                var Op = "",clickJson = "";
                                Op={
                                    "ot":"3"
                                };
                                clickJson={
                                    "actionId":5,
                                    "uuid":AppHelper.YzAppGetUUID(),
                                    "openId":openid,
                                    "ident":"100042",
                                    "date":parseInt(new Date().getTime() / 1000),
                                    "name":"登录中转页快捷登录微信"
                                };
                                myObject.addStatisticsEvent(Op,clickJson);

                            }else if(loc.indexOf("from=homeRecharge")>=0){

                                var Op = "",clickJson = "";
                                Op={
                                    "ot":"3"
                                };
                                clickJson={
                                    "actionId":5,
                                    "uuid":AppHelper.YzAppGetUUID(),
                                    "openId":openid,
                                    "ident":"100059",
                                    "date":parseInt(new Date().getTime() / 1000),
                                    "name":"首页充值页登录微信成功"
                                };
                                myObject.addStatisticsEvent(Op,clickJson);

                            }else{

                                var Op = "",clickJson = "";
                                Op={
                                    "ot":"3"
                                };
                                clickJson={
                                    "actionId":5,
                                    "uuid":AppHelper.YzAppGetUUID(),
                                    "openId":openid,
                                    "ident":"100024",
                                    "date":parseInt(new Date().getTime() / 1000),
                                    "name":"快捷登录微信"
                                };
                                myObject.addStatisticsEvent(Op,clickJson);

                            }
                            
                        }else if(oauth_from=="qq"){
                            if(loc.indexOf("from=startpage")>=0){

                                var Op = "",clickJson = "";
                                Op={
                                    "ot":"3"
                                };
                                clickJson={
                                    "actionId":5,
                                    "uuid":AppHelper.YzAppGetUUID(),
                                    "openId":openid,
                                    "ident":"100043",
                                    "date":parseInt(new Date().getTime() / 1000),
                                    "name":"登录中转页快捷登录qq"
                                };
                                myObject.addStatisticsEvent(Op,clickJson);

                            }else if(loc.indexOf("from=homeRecharge")>=0){

                                var Op = "",clickJson = "";
                                Op={
                                    "ot":"3"
                                };
                                clickJson={
                                    "actionId":5,
                                    "uuid":AppHelper.YzAppGetUUID(),
                                    "openId":openid,
                                    "ident":"100062",
                                    "date":parseInt(new Date().getTime() / 1000),
                                    "name":"首页充值页登录qq成功"
                                };
                                myObject.addStatisticsEvent(Op,clickJson);

                            }else{

                                var Op = "",clickJson = "";
                                Op={
                                    "ot":"3"
                                };
                                clickJson={
                                    "actionId":5,
                                    "uuid":AppHelper.YzAppGetUUID(),
                                    "openId":openid,
                                    "ident":"100025",
                                    "date":parseInt(new Date().getTime() / 1000),
                                    "name":"快捷登录qq"
                                };
                                myObject.addStatisticsEvent(Op,clickJson);

                            }
                            

                        }else if(oauth_from=="weibo"){
                            if(loc.indexOf("from=startpage")>=0){

                                var Op = "",clickJson = "";
                                Op={
                                    "ot":"3"
                                };
                                clickJson={
                                    "actionId":5,
                                    "uuid":AppHelper.YzAppGetUUID(),
                                    "openId":openid,
                                    "ident":"100044",
                                    "date":parseInt(new Date().getTime() / 1000),
                                    "name":"登录中转页快捷登录微博"
                                };
                                myObject.addStatisticsEvent(Op,clickJson);

                            }else if(loc.indexOf("from=homeRecharge")>=0){
            
                                var Op = "",clickJson = "";
                                Op={
                                    "ot":"3"
                                };
                                clickJson={
                                    "actionId":5,
                                    "uuid":AppHelper.YzAppGetUUID(),
                                    "openId":openid,
                                    "ident":"100065",
                                    "date":parseInt(new Date().getTime() / 1000),
                                    "name":"首页充值页登录微博成功"
                                };
                                myObject.addStatisticsEvent(Op,clickJson);

                            }else{

                                var Op = "",clickJson = "";
                                Op={
                                    "ot":"3"
                                };
                                clickJson={
                                    "actionId":5,
                                    "uuid":AppHelper.YzAppGetUUID(),
                                    "openId":openid,
                                    "ident":"100032",
                                    "date":parseInt(new Date().getTime() / 1000),
                                    "name":"快捷登录微博"
                                };
                                myObject.addStatisticsEvent(Op,clickJson);
                            }
                            
                        }
                        /*if(loc.indexOf("from=mycenter")>=0){
                            window.location.href=myObject.host+'/front/view/app/user/index.html';
                        }else if(loc.indexOf("from=homeRecharge")>=0){
                            window.location.href=myObject.host+'/front/view/app/index/recharge.html?from=homeRecharge';
                        }else if(loc.indexOf("from=startpage")>=0){
                            window.Auction.back();
                        }else if(loc.indexOf("from=homeMaster")>=0){
                            window.location.href=myObject.host+'/front/view/app/index/sharegets.html';
                        }
                        else{
                            window.history.go(-1);  
                        }*/
                        
                        var verCode=AppHelper.YzAppGetVerCode();
                        if(verCode!=108){
                            var shareCode=data.data.shareCode;
                            if(shareCode!=""){
                                myObject.commonJsonpAjax(myObject.host+'/index.php/index/Share/mkTree',{
                                'scode':shareCode,
                                }, function(data){
                                    if(data.state=="1"){
                                        store.set('isNew',false);
                                    }
                                },function(){
                                
                                });
                            }  
                            setTimeout(function(){
                                if(loc.indexOf("from=homeRecharge")>=0){
                                    window.location.href=myObject.host+'/front/view/app/index/recharge.html?from=homeRecharge';
                                }else if(loc.indexOf("from=startpage")>=0){
                                    window.Auction.back();
                                }else if(loc.indexOf("from=homeMaster")>=0){
                                    window.location.href=myObject.host+'/front/view/app/index/sharegets.html';
                                }
                                
                                if(isNew==false){
                                    var isFirst=0;
                                }else{
                                    var isFirst=1;
                                }
                                
                                window.Auction.loginSuccess(openid,memberno,isFirst);
                            },1000)
                            
                        }else if(verCode==108){
                            if(loc.indexOf("from=homeRecharge")>=0){
                                window.location.href=myObject.host+'/front/view/app/index/recharge.html?from=homeRecharge';
                            }else if(loc.indexOf("from=startpage")>=0){
                                window.Auction.back();
                            }else if(loc.indexOf("from=mycenter")>=0){
                                window.location.href=myObject.host+'/front/view/app/user/index.html';
                            }else{
                                window.history.go(-1);
                            }
                            window.Auction.loginSuccess(openid,memberno);

                        }

                        
                        
                        
                    }else if(data.state==0){
                        myObject.alert(data.msg);
                    }
                },
                error:function(){
                    myObject.alert("网络不给力...");
                }
            });
        }else if(resultCode==-1){
            var loc=window.location.href;
            var resultmsg=resultMsg;
            if(loc.indexOf("from=homeRecharge")>=0){
                if(resultmsg.indexOf("微信")>=0){
                    var ident="100061";
                    var name="充值登录页微信失败";
                }else if(resultmsg.indexOf("QQ")>=0){
                    var ident="100064";
                    var name="充值登录页qq失败";
                }else if(resultmsg.indexOf("微博")>=0){
                    var ident="100067";
                    var name="充值登录页微博失败";
                }

                var Op = "",clickJson = "";
                Op={
                    "ot":"3"
                };
                clickJson={
                    "actionId":5,
                    "uuid":AppHelper.YzAppGetUUID(),
                    "openId":openid,
                    "ident":ident,
                    "date":parseInt(new Date().getTime() / 1000),
                    "name":name,
                };
                myObject.addStatisticsEvent(Op,clickJson);

            }    
            myObject.alert("第三方登录授权失败");
        }else if(resultCode==-2){
            var loc=window.location.href;
            var resultmsg=resultMsg;   

            if(loc.indexOf("from=homeRecharge")>=0){
                if(resultmsg.indexOf("微信")>=0){
                    var ident="100060";
                    var name="充值登录页微信取消";
                }else if(resultmsg.indexOf("QQ")>=0){
                    var ident="100063";
                    var name="充值登录页qq取消";
                }else if(resultmsg.indexOf("微博")>=0){
                    var ident="100066";
                    var name="充值登录页微博取消";
                }
                var Op = "",clickJson = "";
                Op={
                    "ot":"3"
                };
                clickJson={
                    "actionId":5,
                    "uuid":AppHelper.YzAppGetUUID(),
                    "openId":"",
                    "ident":ident,
                    "date":parseInt(new Date().getTime() / 1000),
                    "name":name,
                };
                myObject.addStatisticsEvent(Op,clickJson);

            } 
            myObject.alert("第三方登录授权取消");
        }
    },
    addLoginCallback_:function(result){
        var resultCallback=JSON.stringify(result);
        var resultCode=result.resultCode;
        var resultMsg=result.resultMsg;
        if(resultCode == 1){
            var loc=window.location.href;
            var obj = eval('(' + resultMsg + ')');
            var platform=obj.platform;
            var oauth_from=obj.oauth_from;
            var deviceid=obj.deviceid;
            var appid=obj.appid;
            var channel=obj.channel;
            var thirddata=obj.thirddata;
            var verCode=obj.versionCode;
            var uuid=AppHelper.YzAppGetUUID();
            store.set('verCode',verCode);
            store.set('channel',channel);
            $.ajax({
                type:'post',
                async: false,
                url:myObject.host+'/index.php/index/Oauthlogin/getCode',
                dataType:'json',
                data:{'oauth_from':oauth_from,'deviceid':deviceid,'appid':appid,'chanel':channel,'platform':platform,'thirddata':thirddata,'verCode':verCode,'uuid':uuid},
                success:function(data) {
                    if(data.state==1){
                        myObject.alert("登录成功");
                        var openid=data.data.openid;
                        var nickName=data.data.nickName;
                        var picUrl=data.data.head;
                        var memberno=data.data.memberno;
                        var isBind=data.data.isBind;
                        var isNew=data.data.isNew;
                        var bindPhone=data.data.bindPhone;
                        var shareCode=data.data.shareCode;
                        if(picUrl.indexOf('http')<0){
                            picUrl="../../../static/img/usercenter/photo.png";
                        }
                        store.set('openid',openid);
                        store.set('nickName',nickName);
                        store.set('picUrl',picUrl);
                        store.set('memberno',memberno);
                        store.set('isBind',isBind);
                        store.set('isNew',isNew);
                        store.set('phone',bindPhone);
                        store.set('shareCode',shareCode);

                        var verCode=AppHelper.YzAppGetVerCode();
                        
                        if(verCode!=108){
                            var shareCode=data.data.shareCode;
                            if(shareCode!=""){
                                myObject.commonJsonpAjax(myObject.host+'/index.php/index/Share/mkTree',{
                                'scode':shareCode,
                                }, function(data){
                                    if(data.state=="1"){
                                        store.set('isNew',false);
                                    }
                                },function(){
                                
                                });
                            }  
                        }    
                        var loc=window.location.href;
                        if(loc.indexOf("from=refund")>=0){
                            //统计
                            var Op = "",clickJson = "";
                            Op={
                                "ot":"3"
                            };
                            clickJson={
                                "actionId":5,
                                "uuid":AppHelper.YzAppGetUUID(),
                                "openId":openid,
                                "ident":"100209",
                                "date":parseInt(new Date().getTime() / 1000),
                                "name":"必返登录成功"
                            };
                            myObject.addStatisticsEvent(Op,clickJson);
                        }

                        if(oauth_from=="wechatapp"){
                            if(loc.indexOf("from=startpage")>=0){

                                var Op = "",clickJson = "";
                                Op={
                                    "ot":"3"
                                };
                                clickJson={
                                    "actionId":5,
                                    "uuid":AppHelper.YzAppGetUUID(),
                                    "openId":openid,
                                    "ident":"100042",
                                    "date":parseInt(new Date().getTime() / 1000),
                                    "name":"登录中转页快捷登录微信"
                                };
                                myObject.addStatisticsEvent(Op,clickJson);

                            }else if(loc.indexOf("from=homeRecharge")>=0){

                                var Op = "",clickJson = "";
                                Op={
                                    "ot":"3"
                                };
                                clickJson={
                                    "actionId":5,
                                    "uuid":AppHelper.YzAppGetUUID(),
                                    "openId":openid,
                                    "ident":"100059",
                                    "date":parseInt(new Date().getTime() / 1000),
                                    "name":"首页充值页登录微信成功"
                                };
                                myObject.addStatisticsEvent(Op,clickJson);

                            }else{

                                var Op = "",clickJson = "";
                                Op={
                                    "ot":"3"
                                };
                                clickJson={
                                    "actionId":5,
                                    "uuid":AppHelper.YzAppGetUUID(),
                                    "openId":openid,
                                    "ident":"100024",
                                    "date":parseInt(new Date().getTime() / 1000),
                                    "name":"快捷登录微信"
                                };
                                myObject.addStatisticsEvent(Op,clickJson);

                            }
                            
                        }else if(oauth_from=="qq"){
                            if(loc.indexOf("from=startpage")>=0){

                                var Op = "",clickJson = "";
                                Op={
                                    "ot":"3"
                                };
                                clickJson={
                                    "actionId":5,
                                    "uuid":AppHelper.YzAppGetUUID(),
                                    "openId":openid,
                                    "ident":"100043",
                                    "date":parseInt(new Date().getTime() / 1000),
                                    "name":"登录中转页快捷登录qq"
                                };
                                myObject.addStatisticsEvent(Op,clickJson);

                            }else if(loc.indexOf("from=homeRecharge")>=0){

                                var Op = "",clickJson = "";
                                Op={
                                    "ot":"3"
                                };
                                clickJson={
                                    "actionId":5,
                                    "uuid":AppHelper.YzAppGetUUID(),
                                    "openId":openid,
                                    "ident":"100062",
                                    "date":parseInt(new Date().getTime() / 1000),
                                    "name":"首页充值页登录qq成功"
                                };
                                myObject.addStatisticsEvent(Op,clickJson);

                            }else{

                                var Op = "",clickJson = "";
                                Op={
                                    "ot":"3"
                                };
                                clickJson={
                                    "actionId":5,
                                    "uuid":AppHelper.YzAppGetUUID(),
                                    "openId":openid,
                                    "ident":"100025",
                                    "date":parseInt(new Date().getTime() / 1000),
                                    "name":"快捷登录qq"
                                };
                                myObject.addStatisticsEvent(Op,clickJson);

                            }
                            

                        }else if(oauth_from=="weibo"){
                            if(loc.indexOf("from=startpage")>=0){

                                var Op = "",clickJson = "";
                                Op={
                                    "ot":"3"
                                };
                                clickJson={
                                    "actionId":5,
                                    "uuid":AppHelper.YzAppGetUUID(),
                                    "openId":openid,
                                    "ident":"100044",
                                    "date":parseInt(new Date().getTime() / 1000),
                                    "name":"登录中转页快捷登录微博"
                                };
                                myObject.addStatisticsEvent(Op,clickJson);

                            }else if(loc.indexOf("from=homeRecharge")>=0){
            
                                var Op = "",clickJson = "";
                                Op={
                                    "ot":"3"
                                };
                                clickJson={
                                    "actionId":5,
                                    "uuid":AppHelper.YzAppGetUUID(),
                                    "openId":openid,
                                    "ident":"100065",
                                    "date":parseInt(new Date().getTime() / 1000),
                                    "name":"首页充值页登录微博成功"
                                };
                                myObject.addStatisticsEvent(Op,clickJson);

                            }else{

                                var Op = "",clickJson = "";
                                Op={
                                    "ot":"3"
                                };
                                clickJson={
                                    "actionId":5,
                                    "uuid":AppHelper.YzAppGetUUID(),
                                    "openId":openid,
                                    "ident":"100032",
                                    "date":parseInt(new Date().getTime() / 1000),
                                    "name":"快捷登录微博"
                                };
                                myObject.addStatisticsEvent(Op,clickJson);
                            }
                            
                        }
                        
                        /*if(loc.indexOf("from=mycenter")>=0){
                            window.location.href=myObject.host+'/front/view/app/user/index.html';
                        }else if(loc.indexOf("from=homeRecharge")>=0){
                            window.location.href=myObject.host+'/front/view/app/index/recharge.html?from=homeRecharge';
                        }else if(loc.indexOf("from=startpage")>=0){
                            window.Auction.back();
                        }else if(loc.indexOf("from=homeMaster")>=0){
                            window.location.href=myObject.host+'/front/view/app/index/sharegets.html';
                        }
                        else{
                            window.history.go(-1);  
                        }*/
                        setTimeout(function(){
                            if(loc.indexOf("from=homeRecharge")>=0){
                                window.location.href=myObject.host+'/front/view/app/index/recharge.html?from=homeRecharge';
                            }else if(loc.indexOf("from=startpage")>=0){
                                window.Auction.back();
                            }else if(loc.indexOf("from=homeMaster")>=0){
                                window.location.href=myObject.host+'/front/view/app/index/sharegets.html';
                            }

                            
                            if(isNew==false){
                                var isFirst=0;
                            }else{
                                var isFirst=1;
                            }
                            var jsonstr={"openid":openid,"memberno":memberno,"isFirst":isFirst};
                            window.Auction.loginSuccess(JSON.stringify(jsonstr));
                        },1000)
                        

                    }else if(data.state==0){
                        myObject.alert(data.msg);
                    }
                },
                error:function(){
                    myObject.alert("网络不给力...");
                    $(".loginCover").hide();
                }
            });
        }else if(resultCode==-1){
            var loc=window.location.href;
            var resultmsg=resultMsg;
            if(loc.indexOf("from=homeRecharge")>=0){
                if(resultmsg.indexOf("微信")>=0){
                    var ident="100061";
                    var name="充值登录页微信失败";
                }else if(resultmsg.indexOf("QQ")>=0){
                    var ident="100064";
                    var name="充值登录页qq失败";
                }else if(resultmsg.indexOf("微博")>=0){
                    var ident="100067";
                    var name="充值登录页微博失败";
                }
                var Op = "",clickJson = "";
                Op={
                    "ot":"3"
                };
                clickJson={
                    "actionId":5,
                    "uuid":AppHelper.YzAppGetUUID(),
                    "openId":openid,
                    "ident":ident,
                    "date":parseInt(new Date().getTime() / 1000),
                    "name":name,
                };
                myObject.addStatisticsEvent(Op,clickJson);
            }    
            myObject.alert("第三方登录授权失败");
        }else if(resultCode==-2){
            var loc=window.location.href;
            var resultmsg=resultMsg;
            if(loc.indexOf("from=homeRecharge")>=0){
                if(resultmsg.indexOf("微信")>=0){
                    var ident="100060";
                    var name="充值登录页微信取消";
                }else if(resultmsg.indexOf("QQ")>=0){
                    var ident="100063";
                    var name="充值登录页qq取消";
                }else if(resultmsg.indexOf("微博")>=0){
                    var ident="100066";
                    var name="充值登录页微博取消";
                }
                var Op = "",clickJson = "";
                Op={
                    "ot":"3"
                };
                clickJson={
                    "actionId":5,
                    "uuid":AppHelper.YzAppGetUUID(),
                    "openId":openid,
                    "ident":ident,
                    "date":parseInt(new Date().getTime() / 1000),
                    "name":name,
                };
                myObject.addStatisticsEvent(Op,clickJson);
            } 
            myObject.alert("第三方登录授权取消");
        }
    },
    loadShow:function(){
        $('<div class="loading_bg"><div><img src="'+'../../../static/img/loading.gif'+'"/></div></div>').appendTo($('body'));
    },
    loadHide:function(){
        $('.loading_bg').remove();
    },
    commonJsonpAjax:function(url,data,fn,fe,loadTime){
        $.ajax({
            cache: false,
            url: url,
            type: "get",
            data: data,
            timeout: 10000,
            dataType: "jsonp",
            success: function (data) {
                if(loadTime){
                    setTimeout(function(){
                        myObject.loadHide();
                    },loadTime)
                }else {
                    myObject.loadHide();
                }
                if(fn){
                    fn(data);
                }
            },
            error: function () {
                if(fe){
                    fe();
                }
                myObject.loadHide();
                myObject.alert("网络不给力");
            }
        });
    },
    commonAjax: function (url, type, data, fn,loadTime) {
        var usrinfo=AppHelper.YzAppGetUUID();
        if(usrinfo==""){
            usrinfo="02a37bc83aa253a4d5821995";
        }
        $.ajax({
            cache: false,
            url: url,
            beforeSend: function(request) {
                request.setRequestHeader("X-Wtfs-Signature",usrinfo);
            },
            type: type,
            data: data,
            timeout: 10000,
            dataType: "json",
            success: function (data) {
                if(loadTime){
                    setTimeout(function(){
                        myObject.loadHide();
                    },loadTime)
                }else {
                    myObject.loadHide();
                }
                if(fn){
                    fn(data);
                }
            },
            error: function () {
                myObject.loadHide();
                myObject.alert("网络不给力");
            }
        });
    },
    clock:function(){
        var obj = $(".sendCode");
        obj.attr("disabled","disabled");/*按钮倒计时*/
        var time = 60;
        obj.css({"color":"#ccc","border":"1px solid #ccc"});
        obj.html("60s后重发");
        var set=setInterval(function(){
        obj.html(--time+"s后重发");
        obj.css({"color":"#ccc","border":"1px solid #ccc"});
        }, 1000);/*等待时间*/
        setTimeout(function(){
        obj.attr("disabled",false).html("重新获取验证码");/*倒计时*/
        obj.css({"color":"#fe4141","border":"1px solid #fe4141"});
        clearInterval(set);
        }, 60000);
    },
    validateReg:function(username,type){
        var reg = /^1[34578]\d{9}$/;
        if(!(username.length==11&&reg.test(username))){
            myObject.alert("对不起，请确认您的手机号之后再次输入");
        }else{
            myObject.loadShow();
            myObject.commonAjax(myObject.host+'/index.php/index/Member/getVcode','GET',{
            'phone':username,
            'type':type,
            'extra':''
            }, function(data){
                if(data.state==1){
                    myObject.clock();
                }else{
                    myObject.alert(data.msg);
                }
            },function(){
            
            });
        }
    },
    alertBox:function(){  
        var alertHtml= '<div class="alertbg" onclick=""><div class="alertBox inviteBox"><div class="close" onclick=""><img src="../../../static/img/close.png" onclick=""/></div>'
                        +'<div class="clear"></div><div><h1 id="test">您已登录成功!</h1><p class="ib1">是否输入邀请码成为他人徒弟</p>'
                        +'<div class="inputLabel"><input type="text" maxLength="7" id="ycode"/></div>'
                        +'<p class="ib2">您的师傅是:</p><div class="master"></div></div>'
                        +'<div class="alertline"><div class="lineinside"></div></div>'
                        +'<div class="alert"><button disabled="disabled" type="button">确认</button></div>'
                        +'<p class="ib3">输入邀请码只有一次机会，请确认</p></div></div>'
        
        
            
       
        $('body').append(alertHtml);
        myObject.alertPosition();
        

        $("#ycode").on("input propertychange", function() {
            var valuecode=$("#ycode").val();

            var length=valuecode.length;
            if(length==7){
                

                console.log(valuecode);
                myObject.loadShow();
                myObject.commonJsonpAjax(myObject.host+'/index.php/index/Share/vCode',{
                'scode':valuecode,
                }, function(data){
                    console.log(data);
                    if(data.state=="1"){
                        var sfName=data.data;
                        $(".master").html(sfName);
                        $(".alert button").attr("disabled",false);
                        $(".alert button").css("background","#fe4141");
                    }else if(data.state=="0"){
                        $(".master").html("您的输入有误，请确认后再输");
                    } 
                },function(){
                
                });

            }
        });

        $(".alert button").click(function(){
            var valuecode=$("#ycode").val();
            var openid=store.get('openid');
            myObject.loadShow();
            myObject.commonJsonpAjax(myObject.host+'/index.php/index/Share/mkTree',{
            'scode':valuecode,
            }, function(data){
                if(data.state=="1"){
                    myObject.alert("师徒关系确立成功");
                    $(".alertbg").hide();
                    /*if(browser.versions.mobile){
                        if(browser.versions.android){
                            var openid=store.get('openid');
                            var memberno=store.get('memberno');
                            var isFirst=1;
                            window.Auction.loginSuccess(openid,memberno,isFirst);
                        }else if(browser.versions.ios){
                            var openid=store.get('openid');
                            var memberno=store.get('memberno');
                            var isFirst=1;
                            var jsonstr={"openid":openid,"memberno":memberno,"isFirst":isFirst};
                            window.Auction.loginSuccess(JSON.stringify(jsonstr));
                        }
                    }
                    var loc=window.location.href;
                    if(loc.indexOf("from=homeRecharge")>=0){
                        window.location.href=myObject.host+'/front/view/app/index/recharge.html?from=homeRecharge';
                    }else if(loc.indexOf("from=startpage")>=0){
                        window.Auction.back();
                    }else if(loc.indexOf("from=homeMaster")>=0){
                        window.location.href=myObject.host+'/front/view/app/index/sharegets.html';
                    }*/
                }
            },function(){
            
            });
            var Op = "",clickJson = "";
            Op={
                "ot":"3"
            };
            clickJson={
                "actionId":5,
                "uuid":AppHelper.YzAppGetUUID(),
                "openId":openid,
                "ident":"100103",
                "date":parseInt(new Date().getTime() / 1000),
                "name":"邀请码输入页点确定",
            };
            myObject.addStatisticsEvent(Op,clickJson);
        })
    },
    alertPosition:function(){
        var height=$(window).height();
        var height_=$(".alertBox").height();
        console.log(height);
        console.log(height_);
        //var marginTop=(height-height_)/2;
        var marginTop=(height-height_)/4;
        $(".alertBox").css("top",marginTop);
        console.log(marginTop);

        $("body").on("click",".alertbg",function(e){
            var target = $(e.target);
            var _con = $(".alertbg .alertBox");   // 设置目标区域
            if(!_con.is(e.target) && _con.has(e.target).length === 0){ // Mark 1
                $(this).css("display","none");
                /*if(browser.versions.mobile){
                    if(browser.versions.android){
                        var openid=store.get('openid');
                        var memberno=store.get('memberno');
                        var isFirst=1;
                        window.Auction.loginSuccess(openid,memberno,isFirst);
                    }else if(browser.versions.ios){
                        var openid=store.get('openid');
                        var memberno=store.get('memberno');
                        var isFirst=1;
                        var jsonstr={"openid":openid,"memberno":memberno,"isFirst":isFirst};
                        window.Auction.loginSuccess(JSON.stringify(jsonstr));
                    }
                }
                var loc=window.location.href;
                if(loc.indexOf("from=homeRecharge")>=0){
                    window.location.href=myObject.host+'/front/view/app/index/recharge.html?from=homeRecharge';
                }else if(loc.indexOf("from=startpage")>=0){
                    window.Auction.back();
                }else if(loc.indexOf("from=homeMaster")>=0){
                    window.location.href=myObject.host+'/front/view/app/index/sharegets.html';
                }*/
            }else{

            }
        });
        $("body").on("click",".alertBox>.close img",function(){
            $(".alertbg").hide();
            var openid=store.get('openid');

            var Op = "",clickJson = "";
            Op={
                "ot":"3"
            };
            clickJson={
                "actionId":5,
                "uuid":AppHelper.YzAppGetUUID(),
                "openId":openid,
                "ident":"100102",
                "date":parseInt(new Date().getTime() / 1000),
                "name":"邀请码输入页点叉",
            };
            myObject.addStatisticsEvent(Op,clickJson);

            /*if(browser.versions.mobile){
                if(browser.versions.android){
                    var openid=store.get('openid');
                    var memberno=store.get('memberno');
                    var isFirst=1;
                    window.Auction.loginSuccess(openid,memberno,isFirst);
                }else if(browser.versions.ios){
                    var openid=store.get('openid');
                    var memberno=store.get('memberno');
                    var isFirst=1;
                    var jsonstr={"openid":openid,"memberno":memberno,"isFirst":isFirst};
                    window.Auction.loginSuccess(JSON.stringify(jsonstr));
                }
            }

            var loc=window.location.href;
            if(loc.indexOf("from=homeRecharge")>=0){
                window.location.href=myObject.host+'/front/view/app/index/recharge.html?from=homeRecharge';
            }else if(loc.indexOf("from=startpage")>=0){
                window.Auction.back();
            }else if(loc.indexOf("from=homeMaster")>=0){
                window.location.href=myObject.host+'/front/view/app/index/sharegets.html';
            }*/
        });
    },
    isNew:function(){
        var isNew=store.get('isNew');
        var shareCode=store.get('shareCode');
        var verCode=AppHelper.YzAppGetVerCode();
        if(verCode!=108){
            if(isNew==true){
                setTimeout(function(){
                    myObject.alertBox();
                    store.set('isNew',false);
                },1000)
            }
            
        }
    },
    OnRegister:function(phone,verifyCode,password){
        var chanel=AppHelper.YzAppGetChannel();
        var verCode=AppHelper.YzAppGetVerCode();
        var deviceid=AppHelper.YzAppGetDeviceId();
        var appid=AppHelper.YzAppGetAppId();
        var uuid=AppHelper.YzAppGetUUID();
        var platform;
        if(browser.versions.mobile){
            if(browser.versions.android){
                platform=1;
            }else if(browser.versions.ios){
                platform=2;
            }
        }
        myObject.loadShow();
        myObject.commonJsonpAjax(myObject.host+'/index.php/index/Member/Register',{
        'phone':phone,
        'verifyCode':verifyCode,
        'password':password,
        'chanel':chanel,
        'verCode':verCode,
        'deviceid':deviceid,
        'appid':appid,
        'platform':platform,
        'uuid':uuid,
        }, function(data){
            if(data.state==1){
                myObject.alert("注册成功");
                //var isNewUser=true;
                //myObject.OnLogin(phone,password,isNewUser);
                var openid=data.data.openid;
                var isBind=data.data.isBind;
                var isNew=data.data.isNew;
                var memberno=data.data.memberno;
                var nickName=data.data.nickName;
                var picUrl=data.data.head;
                var shareCode=data.data.shareCode;
                store.set('openid',openid);
                store.set('nickName',nickName);
                store.set('isBind',true);

                store.set('memberno',memberno);
                store.set('picUrl',picUrl); 
                store.set('phone',phone);
                store.set('isNew',true);
                store.set('shareCode',shareCode);
                //myObject.isNew();   
                
                /*if(loc.indexOf("from=mycenter")>=0){

                    window.Auction.backPage(4);
                }else if(loc.indexOf("from=homeRecharge")>=0){
                    window.location.href=myObject.host+'/front/view/app/index/recharge.html?from=homeRecharge';
                }else if(loc.indexOf("from=startpage")>=0){
                    window.Auction.back();
                }else if(loc.indexOf("from=homeMaster")>=0){
                    window.location.href=myObject.host+'/front/view/app/index/sharegets.html';
                }else if(loc.indexOf("from=homesun")>=0){
                    window.Auction.backPage(2);
                }
                else{
                    window.history.go(-1);  
                }*/
                var verCode=AppHelper.YzAppGetVerCode();
                if(verCode!=108){
                    var shareCode=data.data.shareCode;
                    if(shareCode!=""){
                        myObject.commonJsonpAjax(myObject.host+'/index.php/index/Share/mkTree',{
                        'scode':shareCode,
                        }, function(data){
                            console.log(data);
                            if(data.state=="1"){
                                store.set('isNew',false);
                                //var test=store.get('isNew');
                                //alert(test);
                            }else{
                                
                            }
                        },function(){
                            
                        });
                    }    
                    setTimeout(function(){
                        if(browser.versions.mobile){
                        if(browser.versions.android){
                            var openid=store.get('openid');
                            var memberno=store.get('memberno');
                            var isFirst=1;
                            window.Auction.loginSuccess(openid,memberno,isFirst);
                        }else if(browser.versions.ios){
                            var openid=store.get('openid');
                            var memberno=store.get('memberno');
                            var isFirst=1;
                            var jsonstr={"openid":openid,"memberno":memberno,"isFirst":isFirst};
                            window.Auction.loginSuccess(JSON.stringify(jsonstr));
                        }
                    }
                    var loc=window.location.href;
                    if(loc.indexOf("from=mycenter")>=0){

                        //window.Auction.backPage(4);
                    }else if(loc.indexOf("from=homeRecharge")>=0){
                        window.location.href=myObject.host+'/front/view/app/index/recharge.html?from=homeRecharge';
                    }else if(loc.indexOf("from=startpage")>=0){
                        window.Auction.back();
                    }else if(loc.indexOf("from=homeMaster")>=0){
                        window.location.href=myObject.host+'/front/view/app/index/sharegets.html';
                    }
                    else if(loc.indexOf("from=homesun")>=0){
                        //window.Auction.backPage(2);
                    }
                    else{
                        //window.history.go(-1);  
                    }

                    },1000)
                    
                }else if(verCode==108){
                    if(browser.versions.mobile){
                        if(browser.versions.android){
                            var openid=store.get('openid');
                            var memberno=store.get('memberno');
                            
                            window.Auction.loginSuccess(openid,memberno);
                        }else if(browser.versions.ios){
                            var openid=store.get('openid');
                            var memberno=store.get('memberno');
                            
                            var jsonstr={"openid":openid,"memberno":memberno};
                            window.Auction.loginSuccess(JSON.stringify(jsonstr));
                        }
                    }
                    var loc=window.location.href;
                    if(loc.indexOf("login/index.html?from=mycenter")>=0){
                        window.location.href=myObject.host+'/front/view/app/user/index.html';
                    }else{
                        window.Auction.refreshPage(0);
                    }

                }
                
                
            }else if(data.state==0){
                myObject.alert(data.msg);
            }
        },function(){
        
        });
    },
    OnLogin:function(phone,password,isNewUser){
        var reg = /^1[34578]\d{9}$/;
        var loc=window.location.href;
        if(!(phone.length==11&&reg.test(phone))){
            myObject.alert("对不起，请确认您的手机号之后再次输入");
        }else{
            var chanel=AppHelper.YzAppGetChannel();
            var verCode=AppHelper.YzAppGetVerCode();
            var deviceid=AppHelper.YzAppGetDeviceId();
            var platform;
            if(browser.versions.mobile){
                if(browser.versions.android){
                    platform=1;
                }else if(browser.versions.ios){
                    platform=2;
                }
            }
            myObject.loadShow();
            myObject.commonJsonpAjax(myObject.host+'/index.php/index/Member/Login',{
            'phone':phone,
            'password':password,
            'chanel':chanel,
            'verCode':verCode,
            'deviceid':deviceid,
            'platform':platform,
            }, function(data){
                if(data.state==1){
                    console.log(data);
                    myObject.alert("登录成功");
                    var openid=data.data.openid;
                    var isBind=data.data.isBind;
                    var isNew=data.data.isNew;
                    var memberno=data.data.memberno;
                    var nickName=data.data.nickName;
                    var picUrl=data.data.head;
                    store.set('phone',phone);
                    if(isNewUser){
                        store.set('isNew',true)
                    }else{
                        store.set('isNew',isNew);
                    }
                    store.set('openid',openid);
                    store.set('nickName',nickName);
                    store.set('isBind',isBind);
                    store.set('memberno',memberno);
                    store.set('picUrl',picUrl);

                    var verCode=AppHelper.YzAppGetVerCode();
                    if(loc.indexOf("from=refund")>=0){
                        //统计
                        var Op = "",clickJson = "";
                        Op={
                            "ot":"3"
                        };
                        clickJson={
                            "actionId":5,
                            "uuid":AppHelper.YzAppGetUUID(),
                            "openId":openid,
                            "ident":"100209",
                            "date":parseInt(new Date().getTime() / 1000),
                            "name":"必返登录成功"
                        };
                        myObject.addStatisticsEvent(Op,clickJson);
                    }
                    if(verCode!=108){
                        if(browser.versions.android){
                            var openid=store.get('openid');
                            var memberno=store.get('memberno');
                            var isFirst=0;
                            window.Auction.loginSuccess(openid,memberno,isFirst);
                        }else if(browser.versions.ios){
                            var openid=store.get('openid');
                            var memberno=store.get('memberno');
                            var isFirst=0;
                            var jsonstr={"openid":openid,"memberno":memberno,"isFirst":isFirst};
                            window.Auction.loginSuccess(JSON.stringify(jsonstr));
                        }
                        
                        /*if(loc.indexOf("from=mycenter")>=0){
                            window.location.href=myObject.host+'/front/view/app/user/index.html';
                        }else if(loc.indexOf("from=homeRecharge")>=0){
                            window.location.href=myObject.host+'/front/view/app/index/recharge.html?from=homeRecharge';
                        }else if(loc.indexOf("from=startpage")>=0){
                            window.Auction.back();
                        }else if(loc.indexOf("from=homeMaster")>=0){
                            window.location.href=myObject.host+'/front/view/app/index/sharegets.html';
                        }
                        else{
                            window.history.go(-1);  
                        }*/
                        if(loc.indexOf("from=homeRecharge")>=0){
                            window.location.href=myObject.host+'/front/view/app/index/recharge.html?from=homeRecharge';
                        }else if(loc.indexOf("from=startpage")>=0){
                            window.Auction.back();
                        }else if(loc.indexOf("from=homeMaster")>=0){
                            window.location.href=myObject.host+'/front/view/app/index/sharegets.html';
                        }else if (loc.indexOf("aucRecord") >= 0) {
                            window.location.href = myObject.host+'/front/view/app/user/record.html';
                        }
                    }else if(verCode==108){
                        if(browser.versions.android){
                            var openid=store.get('openid');
                            var memberno=store.get('memberno');
                            
                            window.Auction.loginSuccess(openid,memberno);
                        }else if(browser.versions.ios){
                            var openid=store.get('openid');
                            var memberno=store.get('memberno');
                            
                            var jsonstr={"openid":openid,"memberno":memberno};
                            window.Auction.loginSuccess(JSON.stringify(jsonstr));
                        }
                        
                        /*if(loc.indexOf("from=mycenter")>=0){
                            window.location.href=myObject.host+'/front/view/app/user/index.html';
                        }else if(loc.indexOf("from=homeRecharge")>=0){
                            window.location.href=myObject.host+'/front/view/app/index/recharge.html?from=homeRecharge';
                        }else if(loc.indexOf("from=startpage")>=0){
                            window.Auction.back();
                        }else if(loc.indexOf("from=homeMaster")>=0){
                            window.location.href=myObject.host+'/front/view/app/index/sharegets.html';
                        }
                        else{
                            window.history.go(-1);  
                        }*/
                        
                        if(loc.indexOf("login/index.html?from=mycenter")>=0){
                            //window.Auction.back();
                            window.location.href=myObject.host+'/front/view/app/user/index.html';
                        }else{
                            window.Auction.refreshPage(0);
                        }
                    }
                    
                }else if(data.state==0){
                    myObject.alert(data.msg);
                }
            },function(){
            
            });
        }
        
    },
    OnFind:function(phone,verifyCode,password){
        var chanel=AppHelper.YzAppGetChannel();
        var verCode=AppHelper.YzAppGetVerCode();
        myObject.loadShow();
        myObject.commonJsonpAjax(myObject.host+'/index.php/index/Member/Forget',{
        'phone':phone,
        'password':password,
        'verifyCode':verifyCode,
        'chanel':chanel,
        'verCode':verCode,
        }, function(data){
            console.log(data);
            if(data.state==1){
                myObject.alert("密码修改成功");
                setTimeout(function(){
                    var r = window.location.search;
                    r = r.substring(r.indexOf("?"),r.length);
                    window.location.href=myObject.host+'/front/view/app/login/index.html'+r;
                },1000)
            }else if(data.state==0){
                myObject.alert(data.msg);
            }
        },function(){
        
        });
    },
    OnChange:function(phone,verifyCode,password,openid){
        var chanel=AppHelper.YzAppGetChannel();
        var verCode=AppHelper.YzAppGetVerCode();
        myObject.loadShow();
        myObject.commonJsonpAjax(myObject.host+'/index.php/Index/User/ChangePassword',{
        'phone':phone,
        'password':password,
        'verifyCode':verifyCode,
        'chanel':chanel,
        'verCode':verCode,
        'openid':openid,
        }, function(data){
            console.log(data);
            if(data.state==1){
                myObject.alert("密码更改成功");
                setTimeout(function(){
                    window.history.go(-1);
                },500)
            }else if(data.state==0){
                myObject.alert(data.msg);
            }
        },function(){
        
        });
    },
    OnChangeUname:function(username,openid){
        var chanel=AppHelper.YzAppGetChannel();
        var verCode=AppHelper.YzAppGetVerCode();
        myObject.loadShow();
        myObject.commonJsonpAjax(myObject.host+'/index.php/Index/User/changeUserName',{
            'username':username,
            'chanel':chanel,
            'verCode':verCode,
            'openid':openid,
        }, function(data){
            console.log(data);
            if(data.state==1){
                store.set('nickName',username);
                myObject.alert("昵称更改成功");
                setTimeout(function(){
                    window.history.go(-1);
                },500)
            }else if(data.state==0){
                myObject.alert(data.msg);
            }
        },function(){

        });
    },
    OnBind:function(phone,verifyCode,password,openid){
        var chanel=AppHelper.YzAppGetChannel();
        var verCode=AppHelper.YzAppGetVerCode();
        myObject.loadShow();
        myObject.commonJsonpAjax(myObject.host+'/index.php/Index/User/BindMobile',{
        'phone':phone,
        'password':password,
        'verifyCode':verifyCode,
        'chanel':chanel,
        'verCode':verCode,
        'openid':openid,
        }, function(data){
            if(data.state==1){
                myObject.alert("手机号绑定成功");
                store.set('isBind',true);
                //var phone=phone.substring(0, 3) + "****" + phone.substring(7, 11);
                //alert(phone);
                store.set('nickName',phone);
                setTimeout(function(){
                    window.Auction.refreshPage(4);
                },1000)
                
            }else if(data.state==0){
                myObject.alert(data.msg);
            }
        },function(){
        
        });
    },
    addStatisticsEvent:function(Op,clickJson){
        var aid=AppHelper.YzAppGetAppId();
        
        if(aid==undefined){
            var aid=myObject.GetQueryString("aid");
        }
        if(aid==""){
            var aid=myObject.GetQueryString("aid");
        }
        console.log(aid);
        myObject.commonAjax(myObject.host+'/index.php/index/Pinglog/Plog',"post",{
            "V":"1",
            "L":"INFO",
            "Aid":aid,
            "Op":JSON.stringify(Op),
            "Et":"0",
            "M": JSON.stringify(clickJson)
        })
    },
    GetQueryString:function(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    },
    isOpen:function(){
        var chanel=AppHelper.YzAppGetChannel();
        var verCode=AppHelper.YzAppGetVerCode();
        myObject.loadShow();
        myObject.commonJsonpAjax(myObject.host+'/index.php/Index/Frame/getDisableCh',{
        'chanel':chanel,
        'verCode':verCode,
        }, function(data){
            console.log(data.state);
            if(data.state=="1"){
                var ifdisable=data.ifdisable;

                store.set('ifdisable',ifdisable);
            }else if(data.state=="0"){
                myObject.alert(data.msg);
                var ifdisable=data.ifdisable;
                store.set('ifdisable',ifdisable);
            }
            
            
        },function(){
        
        });
    },
    clearInput:function(){
        $(".clear-input").click(function(){
            $(this).parent().find("input").val("");
            $(this).parent().find("input").focus();
        })
    },
    hasBlur:function(){
        /*$("body").on("focus",".info",function(){
            $(this).on("propertychange change",function(){
                console.log($(this).val())
            })
        })*/
        /*$("body").on("input propertychange change",".info",function(event){
            console.log($(this).val());
        });*/

        /*$('.info input').on('propertychange', function(){
            console.log(1)
            var txt=$(this).val();
            if(txt==""){
                 $(this).parent().remove();
            }
        })
        $('.info input').focus(function(){
            console.log(222)
            var txt=$(this).val();
            if(txt!=""){
                $(this).parent().append('<p class="closeImg">#</p>');
            }
        })
        $('.info input').blur(function(){
            $(this).parent().remove();
        })*/
    }
};


var Constant = {
    IS_FIRST: 0,
    VERSION_CODE: "116",
    VERSION_NAME:"10.1.1",
    DEVICE_ID: "dddddddd",
    APP_ID: "123456",
    CHANNEL_ID: "AHlpm_xiaomi",
    UUID: "uuuuuu",
    OPEN_ID: "wx_xxxxx",
    USER_ID: "1",
    PACKAGE_NAME:"com.uzi.hlpm"
}

var Auction = {
    log: function (msg) {
    },
    toast: function (data) {
    },
    about: function () {
    },
    getUUID: function () {
        return Constant.UUID;
    },
    getAppId: function () {
        return Constant.APP_ID;
    },
    getChannelId: function () {
        return Constant.CHANNEL_ID;
    },
    getDeviceId: function () {
        return Constant.DEVICE_ID;
    },
    getVersionCode: function () {
        return Constant.VERSION_CODE;
    },
    getVersionName: function () {
        return Constant.VERSION_NAME;
    },
    getPackageName: function () {
        return Constant.PACKAGE_NAME;
    },
    update: function () {
    },
    login: function (data) {
    },
    loginSuccess: function (openId, userId, isFirst) {
        Constant.IS_FIRST = isFirst;
        Constant.OPEN_ID = openId;
        Constant.USER_ID = userId;
        window.location.href=  myObject.host+'/front/view/app/user/index.html';

    },
    logout: function (position) {
        window.location.href=  myObject.host+'/front/view/app/login/index.html';
        //window.open(url);
        //alert('logout');
    },
    pingPay: function (callbackUrl, data) {
    },
    thirdPay: function (actionUrl) {
    },
    openUrl: function (url) {
        window.location.href=url;
        //window.open(url);
    },
    back: function () {
    },
    loginDialog: function () {
    },
    refreshPage: function (position) {
    },
    backPage: function (position) {
    },
    share: function (data) {
    },
    writeOrder: function (data) {
    },
    turnBrowser: function (url) {
    },
    dimissDialog: function (data) {
    },
    dimissDot: function () {
    },
};
//Auction.logout();
window.Auction = Auction;

//ios马甲包渠道判断

(function () {
    var channel='',PackageName='';
    try{
        channel= window.Auction.getChannelId();
    }catch(e){
    }
    try{
        PackageName = window.Auction.getPackageName();
    }catch(e){
    }

    if(browser.versions.android){
        if(PackageName == 'com.uzi.xyjp'){
            document.write('<link rel="stylesheet" href="../../../static/css/iosupdatetwo.css"/>');
        }
        if(channel.indexOf("AHlpm")>=0){
            document.write('<link rel="stylesheet" href="../../../static/css/iosupdatefour.css"/>');
        }
    }else if(browser.versions.ios){
        if(channel == "IosJsjx"){
            document.write('<link rel="stylesheet" href="../../../static/css/iosupdate.css"/>');
        }else if(channel == "Iosxypm") {
            document.write('<link rel="stylesheet" href="../../../static/css/iosupdatetwo.css"/>');
        }else if(channel=="IosSdpp"){
            document.write('<link rel="stylesheet" href="../../../static/css/iosupdatethr.css"/>');
        }else{

        }
    }
}());