var fnBase = {
	init: function() {
		this.mobileSystem();
		this.addGetVersionCodeEvent();
		this.addGetDeviceIdEvent();
		this.addGetChannelIdEvent();
		this.addGetAppIdEvent();
		this.addGetUUIDEvent();
		this.addInputTelEvent();
		this.addGetDiffAppScheme();
		this.addGetPackageNameEvent();
		if(this.mobileType == 'ios') {
			if(this.ChannelId == "IosJsjx") {
				document.write('<link rel="stylesheet" href="../../../static/css/iosupdate.css"/>')
			} else if(this.ChannelId == "Iosxypm") {
				document.write('<link rel="stylesheet" href="../../../static/css/iosupdatetwo.css"/>')
			} else if(this.ChannelId == "IosSdpp") {
				document.write('<link rel="stylesheet" href="../../../static/css/iosupdatethr.css"/>')
			} else {

			}
		} else {
			if(this.PackageName == 'com.uzi.xyjp') {
				document.write('<link rel="stylesheet" href="../../../static/css/iosupdatetwo.css"/>')
			}
			var ChannelId = this.ChannelId;
			if(ChannelId == null) {
				ChannelId = "";
			}
			if(ChannelId.indexOf("AHlpm") >= 0) {
				document.write('<link rel="stylesheet" href="../../../static/css/iosupdatefour.css"/>')
			}
		}
		var currentHost = window.location.host;
		if(currentHost.indexOf('61.152.66.114') >= 0) {
			this.source_url = 'http://' + currentHost + '/auc'
		}
	},
	loadShow: function() {
		$('<div class="loading_bg"><div><img src="' + '../../../static/img/loading.gif' + '"/></div></div>').appendTo($('body'));
	},
	loadHide: function() {
		$('.loading_bg').remove();
	},
	alert: function(msg, times) {
		$("body").append($("<div class='tips-wrap'><div class='tips'>" + msg + "</div></div>"));
		var tipsTop = ($(window).height() - $(".tips").height()) / 2;
		var tipsLeft = $(".tips").outerWidth() / 2;
		$(".tips").css({
			"top": tipsTop + "px",
			"left": "50%",
			"margin-left": -tipsLeft + "px"
		});
		$(".tips").hide();
		setTimeout(function() {
			$(".tips").show();
		}, 250);
		setTimeout(function() {
			$(".tips").hide();
			$(".tips").remove();
		}, times ? times : 2000);
	},
	confirm: function(msg, cancelFn, sureFn) {
		$('<div class="confirm_bg"><div class="content"><div class="confirm-inner"><div class="confirm-text">' + msg + '</div></div><div class="confirm-buttons"><span class="confirm-button btn_cancel">删除草稿</span><span class="confirm-button btn_sure">保存草稿</span></div></div></div>').appendTo($('body'))
		$("body").on("click", ".confirm-buttons .btn_cancel", function() {
			$(".confirm_bg").remove();
			if(cancelFn) {
				cancelFn()
			}
		});
		$("body").on("click", ".confirm-buttons .btn_sure", function() {
			$(".confirm_bg").remove();
			if(sureFn) {
				sureFn()
			}
		});

	},
	addInputTelEvent: function() {
		$("input[type=tel]").keyup(function() {
			var c = $(this);
			if(/[^\d]/.test(c.val())) {
				var temp_amount = c.val().replace(/[^\d]/g, '');
				$(this).val(temp_amount);
			}
		});
	},
	commonAjax: function(url, type, data, fn, loadTime) {
		$.ajax({
			cache: false,
			url: url,
			type: type,
			data: data,
			timeout: 10000,
			dataType: "json",
			success: function(data) {
				if(loadTime) {
					setTimeout(function() {
						fnBase.loadHide();
					}, loadTime)
				} else {
					fnBase.loadHide();
				}
				if(fn) {
					fn(data);
				}
			},
			error: function(err) {
				fnBase.loadHide();
				console.log(err);
				fnBase.alert("网络不给力1")
			}
		});
	},
	//source_url:'http://'+ window.location.host,
	source_url: 'http://pm.yz314.com/',
	commonJsonpAjax: function(url, data, fn, loadTime) {
		$.ajax({
			cache: false,
			url: url,
			type: "get",
			data: data,
			timeout: 10000,
			dataType: "jsonp",
			success: function(data) {
				if(loadTime) {
					setTimeout(function() {
						fnBase.loadHide();
					}, loadTime)
				} else {
					fnBase.loadHide();
				}
				if(fn) {
					fn(data);
				}
			},
			error: function() {
				fnBase.loadHide();
				fnBase.alert("网络不给力2")
			}
		});
	},
	source_domain: 'http://' + window.location.host,
	mobileType: '',
	VersionCode: '',
	DeviceId: '',
	ChannelId: '',
	AppId: '',
	UUID: '',
	PackageName: '',
	mobileSystem: function() {
		if(fnBase.mobileType == '') {
			var u = navigator.userAgent;
			if(u.indexOf('MicroMessenger') > -1) {
				fnBase.mobileType = 'WeChat';
				return 'WeChat'
			} else if(u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
				fnBase.mobileType = 'android';
				return 'android'
			} else if(u.indexOf('iPhone') > -1) {
				fnBase.mobileType = 'ios';
				return 'ios'
			} else if(u.indexOf('Windows Phone') > -1) {
				fnBase.mobileType = 'windows';
				return 'windows'
			}
		} else {
			return fnBase.mobileType;
		}
	},
	addLocationHref: function(href) {
		if(href) {
			if(href.indexOf('?') >= 0) {
				window.location.href = href + "&_=" + Math.random()
			} else {
				window.location.href = href + "?" + Math.random()
			}
		} else {
			window.location.reload()
		}

	},
	addGetVersionCodeEvent: function() {
		var VersionCode = 0;
		try {
			VersionCode = window.Auction.getVersionCode();
			fnBase.VersionCode = VersionCode;
			return VersionCode;
		} catch(err) {
			VersionCode = null;
			fnBase.VersionCode = VersionCode;
			return VersionCode;
		}
	},
	addGetDeviceIdEvent: function() {
		var DeviceId = "";
		try {
			DeviceId = window.Auction.getDeviceId();
			fnBase.DeviceId = DeviceId;
			return DeviceId;
		} catch(err) {
			DeviceId = null;
			fnBase.DeviceId = DeviceId;
			return DeviceId;
		}
	},
	addGetChannelIdEvent: function() {
		var ChannelId = "";
		try {
			ChannelId = window.Auction.getChannelId();
			fnBase.ChannelId = ChannelId;
			return ChannelId;
		} catch(err) {
			ChannelId = null;
			fnBase.ChannelId = ChannelId;
			return ChannelId;
		}
	},
	addGetAppIdEvent: function() {
		var AppId = "";
		try {
			AppId = window.Auction.getAppId();
			fnBase.AppId = AppId;
			return AppId;
		} catch(err) {
			AppId = null;
			fnBase.AppId = AppId;
			return AppId;
		}
	},
	addGetUUIDEvent: function() {
		var UUID = "";
		try {
			UUID = window.Auction.getUUID();
			fnBase.UUID = UUID;
			return UUID;
		} catch(err) {
			UUID = null;
			fnBase.UUID = UUID;
			return UUID;
		}
	},
	addGetDiffAppScheme: function() {
		var diff = "";
		try {
			diff = window.Auction.getDiffAppScheme();
			fnBase.diff = diff;
			return diff;
		} catch(err) {
			diff = null;
			fnBase.diff = diff;
			return diff;
		}
	},
	addGetPackageNameEvent: function() {
		var PackageName = "";
		try {
			PackageName = window.Auction.getPackageName();
			fnBase.PackageName = PackageName;
			return PackageName;
		} catch(err) {
			PackageName = null;
			fnBase.PackageName = PackageName;
			return PackageName;
		}
	},
	getUrlPar: function(name) {
		var _reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"),
			_regNext = window.location.search.substr(1).match(_reg);
		if(_regNext != null) return decodeURI(_regNext[2]) || '';
		else return '';
	},
	addCutStrEvent: function(str, len) {
		var str_length = 0;
		var str_len = 0;
		str_cut = new String();
		str_len = str.length;
		for(var i = 0; i < str_len; i++) {
			a = str.charAt(i);
			str_length++;
			if(escape(a).length > 4) {
				//中文字符的长度经编码之后大于4
				str_length++;
			}
			str_cut = str_cut.concat(a);
			if(str_length >= len) {
				str_cut = str_cut.concat("...");
				return str_cut;
			}
		}
		//如果给定字符串小于指定长度，则返回源字符串；
		if(str_length < len) {
			return str;
		}
	},
	addStatisticsEvent: function(Op, clickJson) {
		var aid = "";
		try {
			aid = window.Auction.getAppId();
		} catch(err) {
			var aid = GetQueryString("aid");

			function GetQueryString(name) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
				var r = window.location.search.substr(1).match(reg);
				if(r != null) return unescape(r[2]);
				return null;
			}
			console.log(aid);

		}
		fnBase.commonAjax(fnBase.source_url + '/index.php/index/Pinglog/Plog', "post", {
			"V": "1",
			"L": "INFO",
			"Aid": aid,
			"Op": JSON.stringify(Op),
			"Et": "0",
			"M": JSON.stringify(clickJson)
		})
	},
	addCopyEvent: function(copyEle, selectorHtml) {
		$(document).on("click", copyEle, function() {
			var u = navigator.userAgent;
			if(u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
				var aux = document.createElement("input");
				aux.setAttribute("value", document.getElementById(selectorHtml).innerHTML);
				document.body.appendChild(aux);
				aux.select();
				var successful = document.execCommand("copy");
				try {
					var msg = successful ? '复制成功' : '复制失败,请尝试手动长按进行复制';
					fnBase.alert(msg);
					console.log(msg);
				} catch(err) {
					console.log(err);
				}
				document.body.removeChild(aux);
			} else if(u.indexOf('iPhone') > -1) {
				var copyDOM = document.querySelector('#' + selectorHtml);
				var range = document.createRange();
				range.selectNode(copyDOM);
				window.getSelection().addRange(range);
				var successful = document.execCommand('copy');
				try {
					var msg = successful ? '复制成功' : '复制失败,请尝试手动长按进行复制';
					fnBase.alert(msg);
					console.log('Copy email command was ' + msg);
				} catch(err) {
					console.log('Oops, unable to copy');
				}
				window.getSelection().removeAllRanges();
			}
		});
	},
	diffFn: function(androidFn, iosFn) {
		if(fnBase.mobileType == 'android') {
			if(androidFn) {
				androidFn()
			}
		} else if(fnBase.mobileType == "ios") {
			if(iosFn) {
				iosFn()
			}

		}
	},
	addDownLoadAppEvent: function(ChannelId) {
		var u = navigator.userAgent;
		if(u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
			var xyjpChannelIdArr = ["AXyjp1_Zmarket", "AXyjp_Freefyp", "AXyjp_Swbose", "AXyjp_Zycp", "AXyjp_FosPush"];
			if(xyjpChannelIdArr.indexOf(ChannelId) >= 0) {
				window.location.href = "http://droimarket.droicdn.com/180/apk/2017/12/22/xyjp_axyjp_fenxiang/XiaoYiJingPai_V10.2.1_113__AXyjp_Fenxiang.apk"
			} else if(ChannelId == 'AHlpm1' || ChannelId == 'AHlpm_Zmarket') {
				window.location.href = "http://droimarket.droicdn.com/180/apk/2017/12/22/hlpm_ahlpm_fenxiang/HuanLePaiMai_V113_10.2.1__AHlpm_Fenxiang.apk"
			} else if(ChannelId == 'Axyjp_Zycp') {
				window.location.href = "http://droimarket.droicdn.com/180/apk/2018/01/19/xyjp_zycp/XiaoYiJingPai_AXyjp_Zycp.apk";
			} else if(ChannelId == 'AXyjp_Zh') {
				window.location.href = "http://droimarket.droicdn.com/180/apk/2018/01/31/xyjp/XiaoYiJingPai_AXyjp_Zh.apk";
			} else {
				window.location.href = "http://droimarket.droicdn.com/180/apk/2018/01/18/jspm/JiSuPaiMai_Afenxiang1.apk";
			}
		} else if(u.indexOf('iPhone') > -1) {
			console.log("ios下载");
			if(ChannelId == 'Ios2') {
				// window.location.href = "https://itunes.apple.com/cn/app/%E6%AC%A2%E4%B9%90%E6%8B%8D%E6%8B%8D-%E7%BD%91%E8%B4%AD%E7%9C%81%E9%92%B1%E8%BF%94%E5%88%A9%E7%AB%9E%E6%8B%8D%E8%BD%AF%E4%BB%B6/id1297877313?mt=8"
				window.location.href = "https://itunes.apple.com/cn/app/id1297877313"
			} else {
				// window.location.href = "https://itunes.apple.com/cn/app/%E5%B0%8F%E6%98%93%E7%AB%9E%E6%8B%8D-%E4%B8%80%E7%AB%99%E5%BC%8F%E5%A8%B1%E4%B9%90%E4%BA%92%E8%81%94%E7%BD%91%E8%B4%AD%E7%89%A9%E5%B9%B3%E5%8F%B0/id1300440000?mt=8"
				window.location.href = "https://itunes.apple.com/cn/app/id1297877313"
			}
		}

	},
	/**
	 * [calculateProcessPercentage 计算开奖进度百分比]
	 * @param  {[int]} pMolecular   [分子]
	 * @param  {[int]} pDenominator [分母]
	 * @return {[int]}              [进度百分比数据]
	 */
	calculateProcessPercentage: function(pMolecular, pDenominator) {
		var prevProgress = 0,
			progress = 0;
		prevProgress = (pMolecular / pDenominator) * 100;

		if(prevProgress <= 0) {
			progress = 0;
		} else if(prevProgress > 0 && parseInt(prevProgress) == 0) {
			progress = 1;
		} else {
			progress = parseInt(prevProgress);
		}

		return progress;
	}
};

