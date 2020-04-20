var fileDialogStart = function(){
	
}

//鏂伴椈涓婁紶鏍囬鍥剧墖鏃朵紶姘村嵃鍙傛暟
var fileDialogStart_upload_setting1 = function(){
	swfu1.addPostParam("isMark",$('input[name="isMark"]:checked').val());
	swfu1.addPostParam("markPosition",$("#markPosition").val());
}

//鏂伴椈涓婁紶缁勫浘鍥剧墖鏃朵紶姘村嵃鍙傛暟
var fileDialogStart_upload_setting2 = function(){
	swfulist.addPostParam("isMark",$('input[name="isMark_pic"]:checked').val());
	swfulist.addPostParam("markPosition",$("#markPosition_pic").val());
}


var fileDialogComplete = function(selected,queued,queuednumber){
	if(selected>0){
		this.startUpload();
	}
}
var uploadSuccess  = function(file,serverData){
	serverData = eval('('+serverData+')');
	$("#imgpath").val(serverData.filePath);
}
var uploadSuccess0  = function(file,serverData){
	serverData = eval('('+serverData+')');
	$("#imgpath0").val(serverData.filePath);
}

var uploadSuccess1  = function(file,serverData){

	serverData = eval('('+serverData+')');
	$("#titleImg").append("<option selected='selected' value='/"+serverData.filePath+"'>/"+serverData.filePath+"</option>");
	$("#titleImgShow").attr("src","/"+serverData.filePath);
	
}

var uploadSuccess2  = function(file,serverData){
	serverData = eval('('+serverData+')');
	$("#imgpath").val(serverData.filePath);
	$("#imgPreview").attr("src","/"+serverData.filePath);
}

var uploadComplete  = function(file){
	this.cancelUpload();
}


var uploadSuccessList  = function(file,serverData){
	serverData = eval('('+serverData+')');
	var html="<div class='picbox' class='ui-state-default' title='榧犳爣闀挎寜鍥剧墖绉诲姩'><input type='hidden' name='picImgstr' value='"+serverData.filePath+"'/><img src='"+$.SmartUI.PATH+serverData.filePath+"' width='270' height='110'/><textarea name='picDescription'> </textarea><a href='javascript:void(0);'>绉婚櫎</a></div>";
	$("#picListHtml").html($("#picListHtml").html()+html);
	$("#titleImg").append("<option value='/"+serverData.filePath+"'>/"+serverData.filePath+"</option>");
	$(".picbox a").click(function(){
		$(this).parent("div").remove();
	});
}

//鎵归噺涓婁紶鐓х墖
var uploadSuccessList1  = function(file,serverData){
	serverData = eval('('+serverData+')');
	var html="<div class='picbox' class='ui-state-default' title='榧犳爣闀挎寜鍥剧墖绉诲姩'><input type='hidden' name='careImgs' value='"+serverData.filePath+"'/><img src='"+$.SmartUI.PATH+serverData.filePath+"' width='270' height='110'/><a href='javascript:void(0);'>绉婚櫎</a></div>";
	$("#picListHtml").html($("#picListHtml").html()+html);
	$(".picbox a").click(function(){
		$(this).parent("div").remove();
	});
}

//闂姹囨€讳腑锛屾寚鏍囧彉鏇存壒閲忎笂浼犵収鐗�
var uploadSuccessList2  = function(file,serverData){
	serverData = eval('('+serverData+')');
	var html="<div class='picbox' class='ui-state-default' title='榧犳爣闀挎寜鍥剧墖绉诲姩'><input type='hidden' name='zbData' value='"+serverData.filePath+"'/><img src='"+$.SmartUI.PATH+serverData.filePath+"' width='270' height='110'/><a href='javascript:void(0);'>绉婚櫎</a></div>";
	$("#picListHtml").html($("#picListHtml").html()+html);
	$(".picbox a").click(function(){
		$(this).parent("div").remove();
	});
}

//闂姹囨€讳腑锛屾寚鏍囬攢鍙锋壒閲忎笂浼犵収鐗�
var uploadSuccessList3  = function(file,serverData){
	serverData = eval('('+serverData+')');
	var html="<div class='picbox' class='ui-state-default' title='榧犳爣闀挎寜鍥剧墖绉诲姩'><input type='hidden' name='xhData' value='"+serverData.filePath+"'/><img src='"+$.SmartUI.PATH+serverData.filePath+"' width='270' height='110'/><a href='javascript:void(0);'>绉婚櫎</a></div>";
	$("#picListHtml").html($("#picListHtml").html()+html);
	$(".picbox a").click(function(){
		$(this).parent("div").remove();
	});
}


//闂姹囨€讳腑锛岄璀︾潱鍔炴壒閲忎笂浼犵収鐗�
var uploadSuccessList4  = function(file,serverData){
	serverData = eval('('+serverData+')');
	var html="<div class='picbox' class='ui-state-default' title='榧犳爣闀挎寜鍥剧墖绉诲姩'><input type='hidden' name='yjData' value='"+serverData.filePath+"'/><img src='"+$.SmartUI.PATH+serverData.filePath+"' width='270' height='110'/><a href='javascript:void(0);'>绉婚櫎</a></div>";
	$("#picListHtml").html($("#picListHtml").html()+html);
	$(".picbox a").click(function(){
		$(this).parent("div").remove();
	});
}
var uploadListComplete  = function(file){
	this.startUpload();
}