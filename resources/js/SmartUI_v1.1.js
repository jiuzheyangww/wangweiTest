(function($){
	//form楠岃瘉
	var forms_config = {
		btnSubmit:"#btn_sub", 					//鎻愪氦鎸夐挳id锛岄粯璁や负#btn_sub
		btnReset:"#btn_reset",					//鎻愪氦鎸夐挳id锛岄粯璁や负#btn_reset
		ajaxPost:false,							//琛ㄥ崟鏄惁涓篴jax鎻愪氦
		tipType:"right",						//鎻愮ず淇℃伅绫诲瀷锛屽彲浠ヤ负right,pop(鍒檃llCheck绯荤粺榛樿涓篺alse)
		allCheck:false,							//鎻愪氦鐨勬椂鍊欐槸鍚︿竴娆¤妫€娴嬬帺鎵€鏈夌殑瀛楁銆傞粯璁や负閫愯妫€娴�
		subMsg:false,							//鎻愪氦鏃舵槸鍚︽樉绀烘彁绀轰俊鎭紝濡傦細鍔姏鍔犺浇涓�..銆傞粯璁や负涓嶆彁绀�
		entrySub:false,							//鎸夊洖杞﹂敭鎻愪氦琛ㄥ崟锛岄粯璁や负false锛屽缓璁彧鐢ㄤ綔鐧婚檰琛ㄥ崟
		dataType:{								//琛ㄥ崟楠岃瘉绫诲瀷
			"*":/[\w\W]+/,						//涓嶈兘涓虹┖锛�
			"*6-16":/^[\w\W]{6,16}$/,			//璇疯緭鍏�6鍒�16浣嶄换鎰忓瓧绗︼紒
			"n":/^([-][0-9]+)|([0-9]+)$/, 		//璇疯緭鍏ユ暟瀛楋紒
			"+n":/^[1-9][0-9]*$/, 				//璇疯緭鍏ラ潪闆舵鏁存暟锛�
			"xiaoshu":/^-?[0-9]{1,20}(\.\d*)?$|^-?d^(\.\d*)?$/,  //楠岃瘉灏忔暟
			"ch":/^[\u4e00-\u9fa5]+$/, 			//璇疯緭鍏ユ眽瀛楋紒
			"en":/^[a-zA-Z]+$/, 				//璇疯緭鍏ュ瓧姣嶏紒
			"en_":/^[a-zA-Z]+|_$/, 				//鍙兘杈撳叆瀛楁瘝鍜屼笅鍒掔嚎锛�
			"s":/^[a-zA-Z0-9]+$/, 				//璇疯緭鍏ユ暟瀛楁垨鑰呭瓧姣嶏紒
			"s6-18":/^[a-zA-Z0-9]{6,18}$/, 		//璇疯緭鍏�6-18涓暟瀛楁垨鑰呭瓧姣嶏紒
			"p":/^[0-9]{6}$/, 					//璇峰～姝ｇ‘鐨勫啓閭斂缂栫爜锛�
			"m":/^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|18[0-9]{9}$|17[0-9]{9}$/,	//璇峰～鍐欐纭殑鎵嬫満鍙风爜锛�
			"e":/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,	//璇峰～鍐欐纭殑鐢靛瓙閭欢锛�
			"url":/^(\w+:\/\/)?\w+(\.\w+)+.*$/,						//璇峰～鍐欐纭殑缃戝潃鍦板潃锛�
			"sysUrl":/^[a-zA-z0-9]+[\/]*[a-zA-z0-9\/]*$/,			//绯荤粺鍐呴儴URL
			"idCard":/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/, 
			//"idCard":/^([\d]{15}|[\d]{18}|[\d]{17}[x|X])$/,			//韬唤璇佸彿鐮�
			"qq":/^\d{5,11}$/,										//QQ鍙风爜
			"date":/((^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(10|12|0?[13578])([-\/\._])(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(11|0?[469])([-\/\._])(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(0?2)([-\/\._])(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([3579][26]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][13579][26])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][13579][26])([-\/\._])(0?2)([-\/\._])(29)$))/,
			"datetime":/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/,
				"2":/[0-2]\d*(\.\d+)?$/,
				 "3":/[0-3]\d*(\.\d+)?$/,
				 "4":/[0-4]\d*(\.\d+)?$/,
				 "5":/[0-5]\d*(\.\d+)?$/,
				"7":/[0-7]\d*(\.\d+)?$/,
	},
		callback:function(curform,data){},
		before:function(curform,data){return true}
	};
	var tipmsg={
		w:{
			"*":"涓嶈兘涓虹┖锛�",
			"*6-16":"璇疯緭鍏�6鍒�16浣嶄换鎰忓瓧绗︼紒",
			"n":"璇疯緭鍏ユ暟瀛楋紒",
			"+n":"璇疯緭鍏ラ潪闆舵鏁存暟锛�",
			"xiaoshu":"璇疯緭鍏ユ暣鏁版垨灏忔暟",
			"ch":"璇疯緭鍏ユ眽瀛楋紒",
			"en":"璇疯緭鍏ュ瓧姣嶏紒",
			"en_":"鍙兘杈撳叆瀛楁瘝鍜屼笅鍒掔嚎锛�",
			"s":"璇疯緭鍏ユ暟瀛楁垨鑰呭瓧姣嶏紒",
			"s6-18":"璇疯緭鍏�6-18涓暟瀛楁垨鑰呭瓧姣嶏紒",
			"p":"璇峰～姝ｇ‘鐨勫啓閭斂缂栫爜锛�",
			"m":"璇峰～鍐欐纭殑鎵嬫満鍙风爜锛�",
			"e":"璇峰～鍐欐纭殑鐢靛瓙閭欢锛�",
			"url":"璇峰～鍐欐纭殑缃戝潃锛�",
			"sysUrl":"璇疯緭鍏ユ纭殑鍦板潃",
			"idCard":"璇疯緭鍏ユ纭殑韬唤璇佸彿鐮侊紒",
			"qq":"璇疯緭鍏ユ纭殑QQ鍙风爜",
			"date":"璇疯緭鍏ユ纭殑鏃ユ湡锛佸锛�1990-01-01",
			"datetime":"璇疯緭鍏ユ纭殑鏃ユ湡锛佸锛�1990-01-01 01:01:01",
				"2":"鎵€濉垎鍊间笉鑳藉ぇ浜�2鍒�",
				"3":"鎵€濉垎鍊间笉鑳藉ぇ浜�3鍒�",
				"4":"鎵€濉垎鍊间笉鑳藉ぇ浜�4鍒�",
				"5":"鎵€濉垎鍊间笉鑳藉ぇ浜�5鍒�",
				"7":"鎵€濉垎鍊间笉鑳藉ぇ浜�7鍒�",
				
					
		},
		def:"璇峰～鍐欐纭俊鎭紒",
		reck:"涓ゆ杈撳叆鐨勫唴瀹逛笉涓€鑷达紒",
		passed:"宸查€氳繃楠岃瘉锛�",
		p:"鍔姏杞藉叆涓€�"
	};
	var validate = function(forms,settings){
		//瑕嗙洊榛樿閰嶇疆
		var _settings = $.extend(true, {},forms_config, settings);
		var brothers = this;
		brothers.setting = _settings;
		brothers.tipmsg = $.extend(true,{}, tipmsg, settings.tipmsg);
		if(_settings.tipType != "right"){
			//濡傛灉鏄痯op閭ｄ箞涓€娆″叏閮ㄩ獙璇佸氨浼氫负false锛屽繀椤讳负閫愯楠岃瘉
			brothers.setting.allCheck = false;
		}
		if(_settings.tipType == "pop" || _settings.subMsg){
			//濡傛灉涓簆op鎴栬€呮彁浜や俊鎭樉绀猴紝鍒欏垱寤簆op
			validate.util.createPop.call(this);
		}
		if(_settings.entrySub){
			$(document).keyup(function(event){
				if(event.keyCode ==13){
					forms.find(_settings.btnSubmit).trigger("click");
				}
			});
		}
		//鎻愪氦鎸夐挳浜嬩欢缁戝畾
		forms.find(_settings.btnSubmit).click(function(){
			var allowsub = true;
			if(!_settings.before()){
				return;
			}
			forms.find("[datatype]").each(function(index,obj){
				var curform = this;
				curform.setting = $.extend({},_settings);
				curform.tipmsg = $.extend(true,{}, tipmsg, settings.tipmsg);
				//濡傛灉鏈夋病閫氳繃楠岃瘉鐨勭洿鎺ヨ烦鍑猴紝骞朵笖涓嶈兘鎻愪氦
				var passed = validate.util.check.call(this,curform,$(this))
				if(passed){
					var isrecheck = false;
					if ($(this).attr('recheck')) {
						isrecheck = true;
						var rcvalue = $("input[name="+$(this).attr('recheck')+"]").val();
						passed = validate.util.recheck.call(this,$(this),rcvalue);
					}
					validate.util.renderUI.call(this,curform,$(this),passed,false,isrecheck);
				}else{
					validate.util.renderUI.call(this,curform,$(this),passed,false);
				}
				if(!passed){
					allowsub = false;
					if(!brothers.setting.allCheck){
						return false;
					}
				}
			});
			var btnVal=$(_settings.btnSubmit).attr("value");//鑾峰彇鎸夐挳value
			if(allowsub){//琛ㄥ崟楠岃瘉閫氳繃
				if (_settings.ajaxPost) {
					if(_settings.subMsg) validate.util.renderUI.call(this,brothers,null,200,_settings.subMsg);
					var _url = validate.util.getURL.call(this,forms);
					var param = validate.util.getFormData.call(this,forms);
					$.ajax({
						url:_url,
						data:param,
						type:"post",
						dataType:"json",
						success:function(data){
							_settings.callback(forms,data);
						},
						error:function(data){
							_settings.callback(forms,data);
						}
					});
				}else{
					validate.util.subForm.call(forms,forms);
				}
				//濡傛灉楠岃瘉閫氳繃璁剧疆鎸夐挳澶辨晥锛岄槻姝㈢綉缁滃欢杩熸垨鑰呯敤鎴烽噸澶嶇偣鍑伙紝閫犳垚閲嶅鎵ц銆�
				//$(_settings.btnSubmit).attr("disabled","disabled");
				//$(_settings.btnSubmit).attr("value","鎷煎懡鍔犺浇涓�...");
			}else{
				//濡傛灉楠岃瘉鏈€氳繃锛屽垯杩樺師鎸夐挳鎵€鏈夊睘鎬�
				$(_settings.btnSubmit).attr("disabled",false);
				$(_settings.btnSubmit).attr("value",btnVal);
			}
		});
		//閲嶇疆鎸夐挳浜嬩欢缁戝畾
		$(_settings.btnReset).click(function(){
			forms[0].reset();
		});
		//缁戝畾datatype鐨勪簨浠�
		forms.each(function(){
			$(this).delegate("[datatype]","blur",function(){
				var curform = this;
				curform.setting = $.extend({},_settings);
				curform.tipmsg = $.extend(true,{}, tipmsg, settings.tipmsg);
				
				//鍒ゆ柇鏄惁鏄湪鎻愪氦琛ㄥ崟鎿嶄綔鏃惰Е鍙戠殑楠岃瘉璇锋眰锛涘厛楠岃瘉datatype锛岄€氳繃鍚庨獙璇乺echeck
				var ispass = validate.util.check.call(this,curform,$(this));
				if(ispass){
					var isrecheck = false;
					if ($(this).attr('recheck')) {
						isrecheck = true;
						var rcvalue = $("input[name="+$(this).attr('recheck')+"]").val();
						ispass = validate.util.recheck.call(this,$(this),rcvalue);
					}
					validate.util.renderUI.call(this,curform,$(this),ispass,false,isrecheck);
				}else{
					validate.util.renderUI.call(this,curform,$(this),ispass,false);
				}
			});
		});
	};
	
	validate.util = {
		getBasePath:function(){
		    var curWwwPath=window.document.location.href;  
		    var pathName=window.document.location.pathname;  
		    var pos=curWwwPath.indexOf(pathName);  
		    var localhostPaht=curWwwPath.substring(0,pos);  
		    var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
		    path = localhostPaht+"/";
		    return path;
		},
		renderUI :function(curform,obj,ispass,issubmsg,isrecheck){
			if(curform.setting.tipType =="right" || curform.setting.tipType =="pop"){
				if(curform.setting.tipType =="right" && !issubmsg){
					var validatemsgDiv = "";
					obj.parents('td').children('div').find('.error-msg').remove();
					if(!ispass){
						if(!isrecheck){
							validatemsgDiv = '<span class="validate_checktip validate_wrong">'+curform.tipmsg.w[obj.attr('datatype')]+'</span>';	
						}else{
							validatemsgDiv = '<span class="validate_checktip validate_wrong">'+curform.tipmsg.reck+'</span>';
						}
					}else{
						validatemsgDiv = '<span class="validate_checktip validate_right">'+curform.tipmsg["passed"]+'</span>';
					}
					obj.parents('td').children('div').html(validatemsgDiv);
				}else if(curform.setting.tipType =="pop" || issubmsg){
					if(!issubmsg){
						if(!ispass){
							validate.util.setPopCenter.call(curform,200);
							$(curform).css("border","1px solid #b94a48");
							if(!isrecheck){
								$("#validate_msg").find(".validate_info").html(curform.tipmsg.w[obj.attr('datatype')]);	
							}else{
								$("#validate_msg").find(".validate_info").html(curform.tipmsg.reck);
							}
						}else{
							$(curform).focus();
							$(curform).css("border","1px solid #a7b5bc");
						}
					}else{
						validate.util.setPopCenter.call(curform,200);
						$("#validate_msg").find(".validate_info").html(curform.tipmsg.p);
					}
				}
			}else{
				var error=$('.'+curform.setting.tipType);
				var msg = error.find('.error-message');
				if(!ispass){
					if(!isrecheck){
						msg.html(curform.tipmsg.w[obj.attr('datatype')]);
					}else{
						msg.html(curform.tipmsg.reck);
					}
					error.show();
				}else{
					error.hide();
				}
			}
		},
		createPop :function(){
			if($("#validate_msg").length!==0){return false;}
			var msgdiv = $('<div id="validate_msg"><div class="validate_info"></div></div>').appendTo("body");
		},
		showPop : function(msg){
			validate.util.createPop();
			validate.util.setPopCenter(200);
			$("#validate_msg").find(".validate_info").html(msg);
		},
		setPopCenter:function(time){
			var obj = $("#validate_msg");
			if(obj.css("display")=="block"){
				obj.stop(true);
			}
			var left=($(document.body).width()-obj.outerWidth())/2,
				top=30;
			obj.css({left:left}).show()
			.animate({top : top},{ duration:time , queue:false })
			.animate({opacity:1},{duration:2000})
			.animate({opacity:0},{duration:100,complete:function(){
				$(this).hide().css({top:0,opacity:1});
			}});
		},
		getFormData :function(curform){
			var param = curform.serialize();
			return param;
		},
		subForm :function(curform){
			curform.attr("action",validate.util.getBasePath.call(curform)+curform.attr("action"));
			curform[0].submit();
		},
		getURL :function(curform){
			var baseurl = validate.util.getBasePath();
			return baseurl+curform.attr("action");
		},
		getValue:function(obj){
			var inputval,
				curform=this;
				
			if(obj.is(":radio")){
				inputval=$(":radio[name='"+obj.attr("name")+"']:checked").val();
				//inputval=curform.find(":radio[name='"+obj.attr("name")+"']:checked").val();
			}else if(obj.is(":checkbox")){
				inputval="";
				curform.find(":checkbox[name='"+obj.attr("name")+"']:checked").each(function(){ 
					inputval +=$(this).val()+','; 
				})
			}else{
				inputval=obj.val();
			}
			inputval=$.trim(inputval);
			
			return validate.util.isEmpty.call(obj,inputval) ? "" : inputval;
		},
		isEmpty:function(val){
			return val==="" ? true:false;
		},
		recheck:function(gets,obj){
			return gets.val()==obj;
		},
		_check:function(curform,datatype,inputval){
			if (curform.setting.dataType[datatype]!=undefined) {
				if(curform.setting.dataType[datatype].constructor  == RegExp){
					return curform.setting.dataType[datatype].test(inputval);
				}
			}
		},
		check :function(curform,obj){
			var datatype = obj.attr("datatype");
			var settings = curform.setting;
			var inputval = validate.util.getValue.call(curform,$(this));
			//闅愯棌琛ㄥ崟瀵硅薄涓嶅仛楠岃瘉;
			if($(this).is(":hidden")){
				return true;
			}
			return validate.util._check.call(curform,curform,datatype,inputval);
		}
	};
	//瀹氫箟SmartUI鍖�
	$.extend({"SmartUI":{}});
	//瀹氫箟jquery闈欐€佹柟娉晄howPop锛屾樉绀虹敤鎴蜂俊鎭€�
	$.SmartUI.showPop = function(msg){
		validate.util.createPop();
		validate.util.setPopCenter(200);
		$("#validate_msg").find(".validate_info").html(msg);
	}
	$.SmartUI.PATH = validate.util.getBasePath();
	$.link=function(url){
		window.location.replace($.SmartUI.PATH+url);
	};
	//鎵╁睍jquery瀵硅薄鏂规硶
	$.fn.validate=function(settings){
		return new validate(this,settings);
	};
	var browser = (function(ua) {
		var b = {
			msie : /msie/.test(ua) && !/opera/.test(ua),
			opera : /opera/.test(ua),
			safari : /webkit/.test(ua) && !/chrome/.test(ua),
			firefox : /firefox/.test(ua),
			chrome : /chrome/.test(ua)
		};
		var vMark = "";
		for (var i in b) {
			if (b[i]) {
				vMark = i;
			}
		}
		if (b.safari) {
			vMark = "version";
		}
		b.version = RegExp("(?:" + vMark + ")[\\/: ]([\\d.]+)").test(ua) ? RegExp.$1 : "0";

		b.ie = b.msie;
		b.ie6 = b.msie && parseInt(b.version) == 6;
		b.ie7 = b.msie && parseInt(b.version) == 7;
		b.ie8 = b.msie && parseInt(b.version) == 8;
		b.ie9 = b.msie && parseInt(b.version) == 9;

		return b;
	})(window.navigator.userAgent.toLowerCase());
	$.browser = function(ua) {
		return browser;
	}
	$.wresize = function debounce(callback, delay, context) {
		if ( typeof (callback) !== "function") {
			return;
		}
		delay = delay || 150;
		context = context || null;
		var timeout;
		var runIt = function() {
			callback.apply(context);
		};
		return (function() {
			window.clearTimeout(timeout);
			timeout = window.setTimeout(runIt, delay);
		});
	}
	$.fn.menu = function(activeId) {
		var _this = $(this);
		//璁剧疆涓昏彍鍗曠偣鍑讳簨浠�
		_this.find('.menu-header').click(function() {
			$(this).parent('li').find('ul').show(200);
			$(this).parent('li').siblings().find('ul').hide(200);
		});
		//璁剧疆鑿滃崟閫変腑鏍峰紡
		_this.find('li > ul > li').click(function() {
			_this.find('li > ul > li').removeClass('active');
			$(this).addClass('active');
		});
		if (activeId) {
			//鍙栨秷鎵€鏈夌殑active
			_this.find('li > ul > li').removeClass('active');
			//闅愯棌鎵€鏈夌殑瀛愯彍鍗�
			_this.find('li > ul').hide(200);
			//鑾峰彇婵€娲昏彍鍗曠殑瀛恖i
			$(activeId).parents('li ul').show(200);
			$(activeId).addClass('active');
		}
	}
})(jQuery);