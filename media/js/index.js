
var loading;

function check(){
	var str = $('#file').val()
	if (str == ''){
		return false
		
	}else
	{
		return true
	}


}


function toolbarhide(){//hide the toolbar
	
	   $('#rename').hide()
	   $('#delete').hide()
	   $('#download').hide()
	   $('#share').hide()
	   $('#share_download').hide()
	   $('#delete_share').hide()
	   $('#set_pass_share').hide()
}

function toolbar(){//check the toolbar options
//	alert('hello')
	
	var folders = 0
	var objects = 0
	
	 $(".filelistcontent .checkbox").each(function(){
		 
		 if ($(this).attr("value") == 'checked'){
			   if ($(this).attr("type") == 'folder'){
				   folders += 1
			   }else{
				   objects += 1
			   }
 	   }
		   
	   })
	   
	   toolbarhide()
	  

	  
	   if (folders + objects == 1){
		   
		   $('#rename').show()
	   }else{
		   $('#rename').hide()
	   }
		if (folders + objects > 0){
			
			$('#delete').show()
		}else{
			$('#delete').hide()
		}
		if (objects > 0){
			
			$('#download').show()
			$('#share').show()
			$('#share_download').show()
			$('#delete_share').show()
			$('#set_pass_share').show()
			
		}
	   if (folders > 0){
		  
		  $('#download').hide()
		  $('#share').hide()
		  
	  }
	
}

$(document).ready(function () {
	
	toolbarhide()
	
	loading=new ol.loading({id:"toolbar"});
	
	$('#leftPanel .folders li a').click(function(){
		
		//$(this).css({"background-color":"#DDEBF4"})
		//$(this).siblings().css({"background":"none"})
		
	})
	
	
	//window to create the container folder
	
	$('#create_folder').click(function(){
		
		var container_id = $('#crumb_content').attr("value")
		$('#mainPanel').append(
				'<div id="window">'+
	                '<div id="windowHeader">'+
	                    '<span>'+
	                        '<img src="/site_media/img/images/folder.png" alt="" style="margin-right: 15px" />创建文件夹'+
	                    '</span>'+
	            	'</div>'+
	            	'<div style="overflow: hidden;" id="windowContent">'+
	            			'<div class="create_f">文件夹名称： <input type="text" name = "folder_name" id="folder_name"/></div>'+
	            			'<input type="hidden" name="parent_id" value="'+container_id+'"/>'+
	            			'<div class="" style="padding:10px;text-align:center"><input type="submit" value="创建文件夹" id="create_f"/></div>'+
	            		'<input style="display:none" type="text" name="tenant" value="'+"hello"+'"/>'+
	            	'</div>'+
	    		'</div>')
		$('#create_f').click(function(){
			
			var folder_name = $('#folder_name').attr('value')
			

			$.post("/swift/createfolderByParentId/", {parent_id:container_id, folder_name:folder_name},	
  				function(data) {
				
				$('#filelist table').prepend(
      					'<tr class="filelistcontent"><td><label class="checkbox" value="none" type="folder" idf="'+data+'"></label></td><td class="name" type="folder" style="background:url(/site_media/img/folder.png) no-repeat left;padding-left:50px;"><span class="folder"  id="'+data+'">'+folder_name+'</span></td><td class="size"></td><td class="modified_time"></td></tr>')

    	   })
    	   	$('#window').remove()
	    	
	    
	    
	    })	
	    		
	   	$('.create_f').css({"padding":"10px","font-size":"13px","font-weight":"bold"});
	    $('#window').jqxWindow({ maxHeight: 400, maxWidth: 700, minHeight: 150, minWidth: 300, height: 100, width: 400});
	    $('#window').jqxWindow('resizable', false);
	})
	
	$('#upload_file').click(function(){
		$('#u_file').fadeToggle(300)
		var container_id = $('#crumb_content').attr("value")
		var path = $('#crumb_content').html()
		$('#file_append').remove()
		$('#u_file form').append(
				'<div id="file_append">'+
				'<input type="hidden" name="id" value="'+container_id+'"/>'+
    			'<input type="hidden" name="path" value="'+path+'"/>')+
    			'</div>'
	})
	

	
	
	
	
	//window to upload a file
	/*
	$('#upload_file').click(function(){
		var container_id = $('#crumb_content').attr("value")
		var path = $('#crumb_content').html()
            			$('#mainPanel').append(
            					'<div id="window">'+
	            	                '<div id="windowHeader">'+
		                                '<span>'+
		                                    '<img src="/site_media/img/images/folder.png" alt="" style="margin-right: 15px" />文件上传'+
		                                '</span>'+
	                            	'</div>'+
	                            	'<div style="overflow: hidden;" id="windowContent">'+
	                            		'<form action="/swift/uploadobjectById/" enctype="multipart/form-data" method="post">'+
	                            			'<input type="hidden" name="id" value="'+container_id+'"/>'+
	                            			'<input type="hidden" name="path" value="'+path+'"/>'+
		                            		'<fieldset>'+
		                            			'<legend>Profile image</legend>'+
		                            			'<label for="file">Choose photo</label>'+
		                            			'<input type="file" name="file" id="file" />'+
		                            			'<input type="submit" name="upload" id="upload" value="上传文件" />'+
		                            		'</fieldset>'+
	                            		'</form>'+
	                            	'</div>'+
                        		'</div>')
            			
                        		
                       	$('.upload').css({"padding":"10px","font-size":"13px","font-weight":"bold"});
                        $('#window').jqxWindow({ maxHeight: 400, maxWidth: 700, minHeight: 200, minWidth: 300, height: 200, width: 400});
                        $('#window').jqxWindow('resizable', false);
       })
       
       */
       //click the check all
	
       $('#check_all').click(function(){
    	   
    	   if ($(this).attr("value") == "none"){
    		   
    		   $(this).attr("value","checked")
    		   $(this).css({"background-image":"url(/site_media/img/checkbox.png)","background-repeat":"no-repeat","background-position":"0 100%"})
    		   
    		   var check_counts = parseInt($('#crumb_content').attr("count"))
    		   $(".filelistcontent .checkbox").each(function(){
    			   
    			   $(this).attr("value","checked")
    			   check_counts = (check_counts) + 1
    			   $(this).css({"background-image":"url(/site_media/img/checkbox.png)","background-repeat":"no-repeat","background-position":"0 100%"})
    			   
    		   })
    		   $('#crumb_content').attr("count",check_counts)
    		   
    		   var check_counts = $('#crumb_content').attr("count")
        	   
    		   toolbar()
//        	   if (check_counts!=0){
//        		   $('.toolbar_add').show()
//        	   }else{
//        		   $('.toolbar_add').hide()
//        	   }
    		   
    	   }else{
    		   $(this).attr("value","none")
    		   $(this).css({"background-image":"url(/site_media/img/checkbox.png)","background-repeat":"no-repeat","background-position":"0 0"})
    		   
    		   $(".filelistcontent .checkbox").each(function(){
    			   
    			   $(this).attr("value","none")
    			   
    	    	   $(this).css({"background-image":"url(/site_media/img/checkbox.png)","background-repeat":"no-repeat","background-position":"0 0"})
    			   
    		   })
    		   $('#crumb_content').attr("count","0")
    		   
    		   var check_counts = $('#crumb_content').attr("count")
        	   
    		   toolbar()
//        	   if (check_counts!=0){
////        		   $('.toolbar_add').show()
//        	   }else{
//        		   toolbar()
////        		   $('.toolbar_add').hide()
//        	   }
s    		   
    	   }
    	   
    	   
    	   
    	   
       })
       
       
       
       
       
       
       //click the folder
       $('table .folder').live("click",function(){
    	   
    	   $('#u_file').hide()
       	   $('#window').remove()

    	   var contaienr_id = $(this).attr("id") 
    	   $('#crumb_content').attr("value",contaienr_id)
    	   var name = $(this).html()
    	   var content = $('#crumb_content').html()
    	   content = content + '/' + name
    	   $('#crumb_content').html(content)
    	   
    	   $('.filelistcontent').empty()
    	   $('#check_all').attr("value","none")
    	   $('#check_all').css({"background-image":"url(/site_media/img/checkbox.png)","background-repeat":"no-repeat","background-position":"0 0"})
    	   
  		   loading.show()
    	   $.post("/swift/getContentById/", {id:contaienr_id},	
  				function(data) {
    		   
	          		data = eval(data)
	          		length = (data.length)
					var c = 0;
	    		  	
	    		  	if (length == 0){
	    		  		$('#mainPanel').css({"background-image":"url(/site_media/img/my_empty_folder.gif)","background-position":"bottom","background-repeat":"no-repeat","height":"500px"})
	    		  		
	    		  		
	    		  	}
	    		  
	    		  
	          		$.each(data,function(){
	          			if(this.length==4){
	          				
	          				$('#filelist table').append(
	          					'<tr class="filelistcontent"><td><label class="checkbox" value="none" type="folder" idf="'+this[0]+'"></label></td><td class="name" type="folder" style="background:url(/site_media/img/folder.png) no-repeat left;padding-left:50px;"><span class="folder"  id="'+this[0]+'">'+this[1]+'</span></td><td class="size"></td><td class="modified_time"></td></tr>')
	          				
	          			}else if(this.length==5){
	          				
	          				$('#filelist table').append(
	          					'<tr class="filelistcontent"><td><label class="checkbox" value="none" type="object" ido="'+this[0]+'" name="'+this[2]+'" fname="'+this[1]+'"></label></td><td class="name" type="obj"><span class="object" id="'+this[0]+'">'+this[1]+'</span></td><td class="size">'+this[3]+'</td><td class="modified_time">'+this[4]+'</td></tr> ')
	          				
	          				
	          			}
	          		}); 
	          		
	          		
	          		loading.hide()
//	     		    $('.toolbar_add').hide()
	          		toolbarhide()


    	   })
    	   
    	   
       })
       
       //click the return back button
       $('#tbBack').live("click",function(){
    	   $('#u_file').hide()
    	   $('#window').remove()
    	   if ($('#crumb_content').html()!=''){
	    	   var contaienr_id = $('#crumb_content').attr("value") 
	    	   $.post("/swift/getParentId/", {id:contaienr_id},	
	  				function(data) {
	    		   
	    		   $('#crumb_content').attr("value",data) 
	        	   var content = $('#crumb_content').html()
	       	   	   content = content.split("/")
	        	   content.pop()
	        	   content = content.join("/")
	        	   
	        	   $('#crumb_content').html(content)
		        	   
	    		   $('.filelistcontent').empty()
	    		   $('#check_all').attr("value","none")
	    		   $('#check_all').css({"background-image":"url(/site_media/img/checkbox.png)","background-repeat":"no-repeat","background-position":"0 0"})
	    		   
				   loading.show()
		    	   $.post("/swift/getContentById/", {id:data},	
		  				function(data) {
			    		  // 	alert(data)
			    		   
			          		data = eval(data)
			          		length = (data.length)
			          		
			          		if (length != 0){
			    		  		$('#mainPanel').css({"background":"none"})
			    		  		
			    		  		
			    		  	}
							var c = 0;
			          		$.each(data,function(){
			          			if(this.length==4){
			          				
			          				$('#filelist table').append(
				          					'<tr class="filelistcontent"><td><label class="checkbox" value="none" type="folder" idf="'+this[0]+'"></label></td><td class="name" type="folder" style="background:url(/site_media/img/folder.png) no-repeat left;padding-left:50px;"><span class="folder"  id="'+this[0]+'">'+this[1]+'</span></td><td class="size"></td><td class="modified_time"></td></tr>')
			          				
			          			}else if(this.length==5){
			          				
			          				$('#filelist table').append(
			          					'<tr class="filelistcontent"><td><label class="checkbox" value="none" type="object" ido="'+this[0]+'" name="'+this[2]+'" fname="'+this[1]+'"></label></td><td class="name" type="obj"><span class="object" id="'+this[0]+'">'+this[1]+'</span></td><td class="size">'+this[3]+'</td><td class="modified_time">'+this[4]+'</td></tr> ')
			          				
			          				
			          			}
			          		
			          		}); 
							
							loading.hide()
//				    		$('.toolbar_add').hide()
							
							toolbarhide()


		    	   })
	    		   
	    	   })
    		   
    		   
    		   
    		   
    	   }
    	   
    	   
    	   
    	   
       })
       
       
       
       
       
       
       
       //click the checkbox
       

       
       $('table label:not(.checkbox_all)').live("click",function(){
    	   
    	   
    	   //判断checkbox是否被选中
    	   if ($(this).attr("value") == 'none'){
	    	   $(this).attr("value","checked")
	    	   
	    	   var check_counts = $('#crumb_content').attr("count")
	    	   check_counts = parseInt(check_counts) + 1
	    	   $('#crumb_content').attr("count",check_counts)
	    	   
	    	   
	    	   $(this).css({"background-image":"url(/site_media/img/checkbox.png)","background-repeat":"no-repeat","background-position":"0 100%"})

	    	   
	    	   
    	   }else{
	    	   var check_counts = $('#crumb_content').attr("count")
	    	   check_counts = parseInt(check_counts) - 1
	    	   $('#crumb_content').attr("count",check_counts)
	    	   $(this).attr("value","none")
	    	   $(this).css({"background-image":"url(/site_media/img/checkbox.png)","background-repeat":"no-repeat","background-position":"0 0"})
    	   }
    	   
    	   
    	   //判断选中类型
    	   var check_counts = $('#crumb_content').attr("count")
    	   
//    	   if (check_counts!=0){
//    		   $('.toolbar_add').show()
//    		   
//    	   }else{
//    		   $('.toolbar_add').hide()
//    	   }
    	   toolbar()
    	   
       })
       
       
       
     //click the delete url
		$('#delete').live("click",function(){
		 
		 //遍历所有的checkbox元素，记录被选中的元素
		 
			var folder_ids = ""
			var file_ids = ""
			 $(".filelistcontent .checkbox").each(function(){
			   
			   if ($(this).attr('value') == "checked"){
			   		if ($(this).attr('type') == 'folder'){
			   			
			   			folder_ids += $(this).attr('idf')+","
			   			
			   		}
			   		
			   		if ($(this).attr('type') == 'object'){
			   			
			   			file_ids += $(this).attr('ido')+","
			   		}
			   			
			   }
			 });
			//alert(folder_ids)
			//alert(files)
		
			var contaienr_id = $('#crumb_content').attr("value") 
			
			if (confirm('确定要删除选中的内容吗？')){
			   
			 	   $.post("/swift/content_delete/", {id:contaienr_id,folder_ids:folder_ids,file_ids:file_ids},	
			 				function(data) {
			 		   
					 		  $(".filelistcontent .checkbox").each(function(){
								   
								   if ($(this).attr('value') == "checked"){
								   		
								 	   $(this).parent().parent().remove()
								   			
								   }
								});
			 		   
			 	   })
			  }
		 
		 
		})
       
       
     //click the share url
		$('#share').live("click",function(){
			
			
		 //遍历所有的checkbox元素，记录被选中的元素
			var folder_ids = ""
			var files = ""
			 $(".filelistcontent .checkbox").each(function(){
			   
			   if ($(this).attr('value') == "checked"){
			   		if ($(this).attr('type') == 'folder'){
			   			
			   			folder_ids += $(this).attr('idf')+","
			   			
			   		}
			   		
			   		if ($(this).attr('type') == 'object'){
			   			
			   			files += $(this).attr('name')+","
			   		}
			   			
			   }
			 });
			//alert(folder_ids)
			//alert(files)
		
			var contaienr_id = $('#crumb_content').attr("value") 
			var name = prompt("要分享用户名","");
			if (name){
				
				
				$.post("/swift/findusers/", {user:name},	//check whether the user existed
						function(data) {
					if (data=='ok' && name!=""){
						
						$.post("/swift/content_share/", {id:contaienr_id,folder_ids:folder_ids,files:files,user_to:name},	
								function(data) {
							alert('分享成功')
						})
						
					}else{
						
						alert('分享用户不存在')
					}
				})
				
			}
			
			
		 
		 
		})
		
		
		//click the rename url
		$('#rename').live("click",function(){
			
			
			//遍历所有的checkbox元素，记录被选中的元素
			var folder_id = ""
			var file_id = ""
			$(".filelistcontent .checkbox").each(function(){
				
				if ($(this).attr('value') == "checked"){
					if ($(this).attr('type') == 'folder'){
						
						folder_id = $(this).attr('idf')
						
					}
					
					if ($(this).attr('type') == 'object'){
						
						file_id = $(this).attr('ido')
					}
					
				}
			});
			//alert(folder_ids)
			//alert(files)
			
			var contaienr_id = $('#crumb_content').attr("value") 
			var name = prompt("重新命名为：","");
			
			
			var data_id = ""
			if (folder_id != ""){
				data_id = folder_id
			}else{
				data_id = file_id
			}
			
			if (name != null && data_id!=""){
				
				var old_name = $('#'+data_id).html()
				
				$.post("/swift/rename/", {id:contaienr_id,data_id:data_id,newname:name,oldname:old_name},	
						function(data) {
						
							$('#'+data_id).html(data)
//						location.reload() 
					
				})
				
			}
		})
	
		//click the index download url
		$('#download').live("click",function(){
			
			
			//遍历所有的checkbox元素，记录被选中的元素
			
			var contaienr_id = $('#crumb_content').attr("value") 
			var folder_ids = ""
			var files = ""
			var rfiles = ""
			$(".filelistcontent .checkbox").each(function(){
				
				if ($(this).attr('value') == "checked"){
					if ($(this).attr('type') == 'folder'){
						
						folder_ids += $(this).attr('idf')+","
						
					}
					
					if ($(this).attr('type') == 'object'){
						
						files += $(this).attr('name')+'-'
						
						//存在浏览器弹窗问题
						//window.open("http://www.baidu.com",'_blank')
						//alert('hello')
					}
					
				}
			});
			window.open("/"+contaienr_id+"/"+files+"/download",'_blank')
//			window.open("/"+contaienr_id+"/"+$(this).attr('name')+"/download",'_blank')
			
			//alert(folder_ids)
			//alert(files)
			
			
			
			
		})
       
       
		//click the share download url
		$('#share_download').live("click",function(){
			
			
			//遍历所有的checkbox元素，记录被选中的元素
			
			var contaienr_id = $('#crumb_content').attr("value") 
			var folder_ids = ""
				var files = ""
					$(".filelistcontent .checkbox").each(function(){
						
						if ($(this).attr('value') == "checked"){
							if ($(this).attr('type') == 'folder'){
								
								folder_ids += $(this).attr('idf')+","
								
							}
							
							if ($(this).attr('type') == 'object'){
								
//								files += $(this).attr('url')
								files += $(this).attr('url')+'-'
								
								//存在浏览器弹窗问题
								//window.open("http://www.baidu.com",'_blank')
								//alert('hello')
							}
							
						}
					});
			
			//alert(folder_ids)
			//alert(files)
			
//			window.open("/")
			window.open("/"+files+"/share_download",'_blank')

			
			
		})
		//click the share download url
		$('#delete_share').live("click",function(){
			
			
			//遍历所有的checkbox元素，记录被选中的元素
			
			var contaienr_id = $('#crumb_content').attr("value") 
			var folder_ids = ""
				var files = ""
					$(".filelistcontent .checkbox").each(function(){
						
						if ($(this).attr('value') == "checked"){
							if ($(this).attr('type') == 'folder'){
								
								folder_ids += $(this).attr('idf')+","
								
							}
							
							if ($(this).attr('type') == 'object'){
								
//								files += $(this).attr('url')
								files += $(this).attr('url')+'-'
								$(this).parent().parent().remove()
								
								//存在浏览器弹窗问题
								//window.open("http://www.baidu.com",'_blank')
								//alert('hello')
							}
							
						}
					});
			
			$.post("/"+files+"/share_delete", {},	//check whether the user existed
					function(data) {
					if (data=='ok'){
						
						alert('分享取消')
					}
						
			})			
			
			
		})
		
		
       
       
	
})