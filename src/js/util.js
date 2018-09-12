//add by sunny 09/12 2018
var currentHost = window.location.host;
//var currentHost = "pm.yz314.com";
if(currentHost.indexOf('61.152.66.114') >= 0) {
	currentHost = 'http://' + currentHost + '/auc/';
} else {
	currentHost = 'http://' + currentHost + '/';
}

var wxObject = {
	host: currentHost
};

function showFooter() {
	var footer = '<footer class="wx-footer">' +
		'    <a class="fItem active" href="/front/view/app/index/">' +
		'        <img class="icon" src="../../../static/img/tab-icon/index-icon.png"/>' +
		'        <span class="navTitle">首页</span>' +
		'    </a>' +
		'    <a class="fItem indexUplimit" href="/front/view/app/index/recentdeal.html">' +
		'        <img class="icon" src="../../../static/img/tab-icon/new-icon.png"/>' +
		'        <span class="navTitle">最新成交</span>' +
		'    </a>' +
		'    <a class="fItem userIndex" href="/front/view/app/index/goodslists.html">' +
		'        <img class="icon" src="../../../static/img/tab-icon/list-icon.png"/>' +
		'        <span class="navTitle">商品列表</span>' +
		'    </a>' +
		'    <a class="fItem userIndex" href="../user/index.html">' +
		'        <img class="icon" src="../../../static/img/tab-icon/user-icon.png"/>' +
		'        <span class="navTitle">我的</span>' +
		'    </a>' +
		'</footer>';
	$('body').append(footer);

	//alert(footer);
}

function wxFooter() {
	var curPage = window.location.pathname;
	var xp = curPage.split('/');
	var xpp = xp[xp.length - 2] + '/' + xp[xp.length - 1];
	console.log(xpp)
	if(xpp == "index/goodslists.html" || xpp == "index/recentdeal.html" || xpp == "user/index.html" || xpp == "index/shitusun.html" || xpp == "user/feedback.html" || xpp == "user/index.html" || xpp == "user/userShop.html") {
		showFooter();
	}
}

try {
	if(Constant == undefined) {}
} catch(e) {
	//TODO handle the exception
	Constant = {
		IS_FIRST: 0,
		VERSION_CODE: "116",
		VERSION_NAME: "10.1.1",
		DEVICE_ID: "dddddddd",
		APP_ID: "123456",
		CHANNEL_ID: "xiaomi",
		UUID: "uuuuuu",
		OPEN_ID: "wx_xxxxx",
		USER_ID: "1",
		PACKAGE_NAME: "com.uzi.hlpm"
	}

	var Auction = {
		log: function(msg) {},
		toast: function(data) {},
		about: function() {},
		getUUID: function() {
			return Constant.UUID;
		},
		getAppId: function() {
			return Constant.APP_ID;
		},
		getChannelId: function() {
			return Constant.CHANNEL_ID;
		},
		getDeviceId: function() {
			return Constant.DEVICE_ID;
		},
		getVersionCode: function() {
			return Constant.VERSION_CODE;
		},
		getVersionName: function() {
			return Constant.VERSION_NAME;
		},
		getPackageName: function() {
			return Constant.PACKAGE_NAME;
		},
		update: function() {},
		login: function(data) {},
		loginSuccess: function(openId, userId, isFirst) {
			Constant.IS_FIRST = isFirst;
			Constant.OPEN_ID = openId;
			Constant.USER_ID = userId;
			window.location.href = myObject.host + '/front/view/app/user/index.html';

		},
		logout: function(position) {
			window.location.href = myObject.host + '/front/view/app/login/index.html';
			//window.open(url);
			//alert('logout');
		},
		pingPay: function(callbackUrl, data) {},
		thirdPay: function(actionUrl) {},
		openUrl: function(url) {
			//window.location.href=url;
			window.open(url);
		},
		back: function() {
			window.history.back();
		},
		loginDialog: function() {},
		refreshPage: function(position) {},
		backPage: function(position) {},
		share: function(data) {},
		writeOrder: function(data) {},
		turnBrowser: function(url) {},
		dimissDialog: function(data) {},
		dimissDot: function() {},
		loginFail: function() { //ios独有
		}
	};
	//Auction.logout();
	window.Auction = Auction;

	wxFooter();
}