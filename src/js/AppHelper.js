AppHelper = {
	YzAppGetUUID:function (){
    	var uuid='';
    	try{
            uuid = window.Auction.getUUID();
        }catch(e){
        }
        return uuid;
    },
    YzAppGetVerCode:function (){
    	var verCode='';
    	try{
            verCode = window.Auction.getVersionCode();
        }catch(e){
        }
        return verCode;
    },
    YzAppGetChannel:function (){
    	var channel='';
    	try{
            channel= window.Auction.getChannelId();
        }catch(e){
        }
        return channel;
    },
    YzAppGetAppId:function (){
        var appid='';
        try{
            appid= window.Auction.getAppId();
        }catch(e){
        }
        return appid;
    },
    YzAppGetDeviceId:function (){
        var deviceid='';
        try{
            deviceid= window.Auction.getDeviceId();
        }catch(e){
        }
        return deviceid;
    },
}	