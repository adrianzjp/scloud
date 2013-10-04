


$(document).ready(function () {
	$('.contentlist .modify').click(function(){
		
		type = $(this).attr('type')
		
		if ('user' == type){
			
			id = $(this).attr('idf')
			$.post("/useredit/", {id:id},	
					function(data) {
				document.location.reload();
				
			})
			
			
		}
		
		if ('role' == type){
			
			id = $(this).attr('idf')
			$.post("/roleedit/", {id:id},	
					function(data) {
				document.location.reload();
				
			})
			
		}

	
	})
	
	
	
	$('.contentlist .del').click(function(){
		
		if (confirm('你确认要删除么？')){
			type = $(this).attr('type')
			
			if ('user' == type){
				
				id = $(this).attr('idf')
				$.post("/userdel/", {id:id},	
						function(data) {
					document.location.reload();
					
				})
				
				
			}
			
			if ('role' == type){
				
				id = $(this).attr('idf')
				$.post("/roledel/", {id:id},	
						function(data) {
					document.location.reload();
					
				})
				
			}
		}
		
	})
	
	$('#add_domain').click(function(){
		$('#mainPanel').append(
				'<div id="window">'+
				'<div id="windowHeader">'+
				'<span>'+
				'<img src="/site_media/img/images/folder.png" alt="" style="margin-right: 15px" />添加域'+
				'</span>'+
				'</div>'+
				'<div style="overflow: hidden;" id="windowContent">'+
				'<form action="/create_role/" method="post">'+
				'<div class="create_f"><span style="display:inline-block;width:80px; ">域名称<span style="color:red">*</span>：</span> <input type="text" name = "name" /></div>'+
				'<div class="create_f"><span style="display:inline-block;width:80px; ">域类型<span style="color:red">*</span>：</span><select name="template">'+
				'<option value="teacher-student">pulic 域</option>'+
				'<option value="teacher-student">protected 域</option>'+
				'<option value="teacher-student">private 域</option>'+
				'</select></div>'+
				'<div class="" style="padding:10px;text-align:center">'+
				'<input type="submit" value="创建角色"/>'+
				'</div>'+
				'</form>'+
				'</div>'+
		'</div>')
		
		$('.create_f').css({"padding":"10px","font-size":"13px","font-weight":"bold"});
		$('#window').jqxWindow({  maxWidth: 700, minHeight: 150, minWidth: 300,  width: 400});
		$('#window').jqxWindow('resizable', false);
		
		
	})
	
	
	$('#add_role').click(function(){
		$('#mainPanel').append(
					'<div id="window">'+
					'<div id="windowHeader">'+
					'<span>'+
					'<img src="/site_media/img/images/folder.png" alt="" style="margin-right: 15px" />添加角色'+
					'</span>'+
					'</div>'+
					'<div style="overflow: hidden;" id="windowContent">'+
					'<form action="/create_role/" method="post">'+
					'<div class="create_f"><span style="display:inline-block;width:80px; ">角色名称<span style="color:red">*</span>：</span> <input type="text" name = "name" /></div>'+
					'<div class="create_f"><span style="display:inline-block;width:80px; ">角色模版<span style="color:red">*</span>：</span><select name="template">'+
					'<option value="teacher-student">University模版</option>'+
					'<option value="teacher-student">enterprise模版</option>'+
					'</select></div>'+
					'<div class="" style="padding:10px;text-align:center">'+
					'<input type="submit" value="创建角色"/>'+
					'</div>'+
					'</form>'+
					'</div>'+
			'</div>')
			
			$('.create_f').css({"padding":"10px","font-size":"13px","font-weight":"bold"});
			$('#window').jqxWindow({  maxWidth: 700, minHeight: 150, minWidth: 300,  width: 400});
			$('#window').jqxWindow('resizable', false);
		
		
	})
	
	$('#add_user').click(function(){
		
		var roles = ''
		var tenants = ''
		 $.post("/allroles/", {},	
	  				function(data) {
			 
	    		   
		          		data = eval(data)
		          		length = (data.length)
		    		  
		          		$.each(data,function(){
		          			roles += '<option value="'+this+'">'+this+'</option>'
		          		})
		          		
		          		$.post("/alltenants/", {},
		          				function(data){
				          			data = eval(data)
				          			length = (data.length)
				          			
				          			$.each(data,function(){
				          				tenants += '<option value="'+this+'">'+this+'</option>'
				          			})
				          			$('#mainPanel').append(
				          					'<div id="window">'+
				          					'<div id="windowHeader">'+
				          					'<span>'+
				          					'<img src="/site_media/img/images/folder.png" alt="" style="margin-right: 15px" />添加用户'+
				          					'</span>'+
				          					'</div>'+
				          					'<div style="overflow: hidden;" id="windowContent">'+
				          					'<form action="/create_user/" method="post">'+
				          					'<div class="create_f"><span style="display:inline-block;width:80px; ">用户名<span style="color:red">*</span>：</span> <input type="text" name = "name" /></div>'+
				          					'<div class="create_f"><span style="display:inline-block;width:80px; ">密码<span style="color:red">*</span>：</span> <input type="text" name = "pass" /></div>'+
				          					'<div class="create_f"><span style="display:inline-block;width:80px; ">邮箱：</span> <input type="text" name = "email" /></div>'+
				          					'<div class="create_f"><span style="display:inline-block;width:80px; ">角色<span style="color:red">*</span>：</span><select name="role">'+
				          					roles+
				          					'</select></div>'+
				          					'<div class="create_f"><span style="display:inline-block;width:80px; ">所属域<span style="color:red">*</span>：</span><select name="tenant">'+
				          					tenants+
				          					'</select></div>'+
				          					'<div class="" style="padding:10px;text-align:center">'+
				          					'<input type="submit" value="创建用户"/>'+
				          					'</div>'+
				          					'</form>'+
				          					'</div>'+
				          			'</div>')
				          			
				          			$('.create_f').css({"padding":"10px","font-size":"13px","font-weight":"bold"});
				          			$('#window').jqxWindow({  maxWidth: 700, minHeight: 150, minWidth: 300,  width: 400});
				          			$('#window').jqxWindow('resizable', false);
		          			
		          			
		          		})
		          		
		})
		
		
		
		
	})
		
		
       
       
	
})