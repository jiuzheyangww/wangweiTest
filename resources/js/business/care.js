$("document").ready(function(){
	var orgId=$("#orgId").val();
	var orgSn=$("#orgSn").val();
	var isSubNode=$("#isSubNode").val();
	var careType=$("#careType").val();
	var pageNo=$("#pageNo").val();
	
	$("#addBtn").click(function(){
		$.link("cmsadmin/bus/care/add?careType="+careType+"&orgId="+orgId+"&orgSn="+orgSn+"&isSubNode="+isSubNode+"&pageNo="+pageNo);
	});
	
	$("#addForm").validate({
		tipType:"right",
		ajaxPost:true,
		before:function(curform){
			var memberSn=0;
			var dataAttr=$('#memberId').combogrid("grid").datagrid('getData').rows;
			if(dataAttr!=null){
				for(var i=0; i<dataAttr.length; i++){
					if(dataAttr[i].memberId==$('#memberId').combogrid('getValues')){
						memberSn=1;
						break;
					}
				}
			}
			if(memberSn==1){
				return true;
			}else{
				alert("璇峰厛閫夋嫨鍏氬憳");
				return false;
			}
		},
		callback:function(curform, data) {
			alert(data.msg);
			if(data.code==1){
				$.link("cmsadmin/bus/care/list?careType="+careType+"&orgSn="+orgSn+"&orgId="+orgId+"&isSubNode="+isSubNode+"&pageNo="+pageNo);
			}
		}
	});
	
	$(".list-content table tbody tr").dblclick(function(){
		var checked = $(this).find("input[type=checkbox]");
		if(checked.length==1){
			$.link("cmsadmin/bus/care/update?careId="+checked.val()+"&careType="+careType+"&orgId="+orgId+"&orgSn="+orgSn+"&isSubNode="+isSubNode+"&pageNo="+pageNo);
		}else{
			alert("璇烽€夋嫨涓€鏉′俊鎭�");
		}
	});
	
	$("#updateBtn").click(function(){
		var checked = $(".list-content table tbody tr").find("input[type=checkbox]:checked");
		if(checked.length==1){
			$.link("cmsadmin/bus/care/update?careId="+checked.val()+"&careType="+careType+"&orgId="+orgId+"&orgSn="+orgSn+"&isSubNode="+isSubNode+"&pageNo="+pageNo);
		}else{
			alert("璇烽€夋嫨涓€鏉′俊鎭�");
		}
	});
	
	
	
	$("#chakanBtn").click(function(){
		var checked = $(".list-content table tbody tr").find("input[type=checkbox]:checked");
		if(checked.length==1){
			$.link("cmsadmin/bus/care/chakan?careId="+checked.val()+"&careType="+careType+"&orgId="+orgId+"&orgSn="+orgSn+"&isSubNode="+isSubNode+"&pageNo="+pageNo);
		}else{
			alert("璇烽€夋嫨涓€鏉′俊鎭�");
		}
	});
	
	
	
	
	$("#updateForm").validate({
		tipType:"right",
		ajaxPost:true,
		callback:function(curform, data) {
			alert(data.msg);
			if(data.code==1){
				$.link("cmsadmin/bus/care/list?careType="+careType+"&orgSn="+orgSn+"&orgId="+orgId+"&isSubNode="+isSubNode+"&pageNo="+pageNo);
			}
		}
	});
	
	$("#deleteBtn").click(function(){
		var checked = $(".list-content table tbody tr").find("input[type=checkbox]:checked");
		if(checked.length>=1){
			var ids="";
			checked.each(function(){
				ids+=$(this).val()+",";
			});
			if(confirm("纭畾瑕佸垹闄よ鏉′俊鎭悧锛�")){
				$.ajax({
					url:$.SmartUI.PATH+'cmsadmin/bus/care/delete?careType='+careType+'&ids='+ids,
					type:"post",
					dataType:"json",
					success:function(data){
						alert(data.msg);
						if(data.code == 1){
							$.link("cmsadmin/bus/care/list?careType="+careType+"&orgSn="+orgSn+"&orgId="+orgId+"&isSubNode="+isSubNode+"&pageNo="+pageNo);
						}
					}
				});
			}
		}else{
			alert("璇烽€夋嫨涓€鏉′俊鎭�");
		}
	});
	
	
	$("#backBtn").click(function(){
		$.link("cmsadmin/bus/care/list?careType="+careType+"&orgSn="+orgSn+"&orgId="+orgId+"&isSubNode="+isSubNode+"&pageNo="+pageNo);
	});
	
	var upload_list_setting = {
		upload_url : $.SmartUI.PATH+"listuploadImage",
		flash_url : $.SmartUI.PATH+"resources/cms_inc/uploadfile/swfupload_fp9.swf",
		post_params : {"sn" : "1"},
		use_query_string : false,
		file_types : "*.jpg;*.gif;*.png",
		file_size_limit : "1 MB",
		file_upload_limit : 0,
		prevent_swf_caching:true,
		debug: false,
		button_placeholder_id : "piclistBtn",
		button_image_url:$.SmartUI.PATH+"resources/cms_inc/images/upload_button.jpg",
		button_width : 62,
		button_height : 24,
		file_dialog_start_handler: fileDialogStart_upload_setting2,
		file_dialog_complete_handler: fileDialogComplete,
		upload_success_handler: uploadSuccessList1,
		upload_complete_handler: uploadListComplete
	};
	swfulist = new SWFUpload(upload_list_setting);
	
	//鍥鹃泦绉诲姩
	$( "#picListHtml" ).sortable();
	$( "#picListHtml" ).disableSelection();
	
});