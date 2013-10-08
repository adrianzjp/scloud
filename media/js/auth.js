


$(document).ready(function () {
	$('.contentlist .update').click(function(){

		
		type = $(this).attr('type')
		
		
		
		if ('space_size' == type){
			
			id = $(this).attr('idf')
			size = $('#newsize'+id).val()
			
			$.post("/space_update/", {id:id, size:size},	
					function(data) {
				document.location.reload();
				
			})
			
			
		}
		
		if ('space_isactive' == type){
			
			id = $(this).attr('idf')
			is_active = $(this).attr('is_active')
			
			$.post("/space_update/", {id:id, is_active:is_active},	
					function(data) {
				document.location.reload();
				
			})
			
			
		}
		
	
	
	})
	
	
	
	$('.contentlist .edit').click(function(){
		
		type = $(this).attr('type')
		
		if ('user' == type){
			
			id = $(this).attr('idf')
			$.post("/useredit/", {id:id},	
					function(data) {
				alert('hello')
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
		
		if ('domain_active' == type){
			id = $(this).attr('idf')
			active_code = $(this).attr('active_code')
			
			$.post("/domain_active/", {id:id, active_code:active_code},	
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
			
			if ('domain_active' == type){
				
				id = $(this).attr('idf')
				$.post("/domaindel/", {id:id},	
						function(data) {
					document.location.reload();
					
				})
				
			}
		}
		
	})
	
	$('#add_domain').click(function(){
		
		var spare_space = $('#spare_space').html()
		var space_id = $('#space_id').html()
		
		
		$('#mainPanel').append(
				'<div id="window">'+
				'<div id="windowHeader">'+
				'<span>'+
				'<img src="/site_media/img/images/folder.png" alt="" style="margin-right: 15px" />添加域'+
				'</span>'+
				'</div>'+
				'<div style="overflow: hidden;" id="windowContent">'+
				'<form action="/create_domain/" method="post">'+
				'<div class="create_f"><span style="display:inline-block;width:80px; ">域名称<span style="color:red">*</span>：</span> <input type="text" name = "name" /></div>'+
				'<div class="create_f"><span style="display:inline-block;width:80px; ">域大小<span style="color:red">*</span>：</span> <input type="text" name = "size" />G</div>'+
				'<div class="create_f"><span style="display:inline-block;width:80px; ">域类型<span style="color:red">*</span>：</span><select name="type">'+
				'<option value="1">pulic 域</option>'+
				'<option value="2">protected 域</option>'+
				'<option value="3">private 域</option>'+
				'</select></div>'+
  				'<input type="hidden" name = "space_id" value="'+space_id+'" />'+
  				'<input type="hidden" name = "spare_space" value="'+spare_space+'" />'+
				
				'<div class="" style="padding:10px;text-align:center">'+
				'<input type="submit" value="创建域"/>'+
				'</div>'+
				'</form>'+
				'</div>'+
		'</div>')
		
		$('.create_f').css({"padding":"10px","font-size":"13px","font-weight":"bold"});
		$('#window').jqxWindow({  maxWidth: 700, minHeight: 150, minWidth: 300,  width: 400});
		$('#window').jqxWindow('resizable', false);
		
		
	})
	
	
	function find_roles_by_domain_id(domain_type_id){
		var roles = ''
		$.ajaxSetup({ 
		    async : false 
		}); //将ajax设置成同步操作
		$.post("/allrolesindomain/", {domain_id:domain_type_id},	
  				function(data) {
  			data = eval(data)
  			length = (data.length)
  			
  			$.each(data,function(){
  				roles += '<option value="'+this[0]+'">'+this[1]+'</option>'
  			})
  			
//  			return roles;
  		})
  		return (roles)
		
		
	}
	
	$('#add_user_domain_role').click(function(){
				var domain_id = $('#domain_id').html()
				var users = ''
				var roles = ''
				var domain_type_id = $('#domain_type_id').html()
				
				roles = (find_roles_by_domain_id(domain_type_id))
				
				$.post("/allusers/", {},	
						function(data) {
					
					data = eval(data)
					length = (data.length)
					
					$.each(data,function(){
						users += '<option value="'+this[0]+'">'+this[1]+'</option>'
					})
					$('#mainPanel').append(
							'<div id="window">'+
							'<div id="windowHeader">'+
							'<span>'+
							'<img src="/site_media/img/images/folder.png" alt="" style="margin-right: 15px" />添加用户到域'+
							'</span>'+
							'</div>'+
							'<div style="overflow: hidden;" id="windowContent">'+
							'<form action="/create_user_domain_role/" method="post">'+
//			          				'<div class="create_f"><span style="display:inline-block;width:80px; ">角色名称<span style="color:red">*</span>：</span> <input type="text" name = "name" /></div>'+
							'<div class="create_f"><span style="display:inline-block;width:80px; " id="sdomain">选择用户<span style="color:red">*</span>：</span><select id="user_id" name="user_id">'+
							users+
							'</select></div>'+
							'<div class="create_f"><span style="display:inline-block;width:80px; " id="srole">选择角色<span style="color:red">*</span>：</span><select name="role_id" id="role_id">'+
							roles+
							'</select></div>'+
							'<div class="" style="padding:10px;text-align:center">'+
							'<input type="submit" value="创建角色"/>'+
							'<input type="hidden" name = "domain_id" value="'+domain_id+'" />'+
							
							'</div>'+
							'</form>'+
							'</div>'+
					'</div>')
					 
					$("#role_id").empty()
					$("#role_id").append(roles);

//					find_roles_by_domain_id(domain_type_id)
					$('.create_f').css({"padding":"10px","font-size":"13px","font-weight":"bold"});
					$('#window').jqxWindow({  maxWidth: 700, minHeight: 150, minWidth: 300,  width: 400});
					$('#window').jqxWindow('resizable', false);
					
				})
				
				
	})
	
	$('#add_domain_role').click(function(){
		
		
			var domains = ''
			var roles = ''
			var user_id = $('#user_id').html()
			$.post("/alldomains/", {},	
		  				function(data) {
		    		   
			          		data = eval(data)
			          		length = (data.length)
			    		  
			          		$.each(data,function(){
			          			domains += '<option value="'+this[0]+'_'+this[1]+'">'+this[2]+'</option>'
			          		})
			          		$('#mainPanel').append(
			          				'<div id="window">'+
			          				'<div id="windowHeader">'+
			          				'<span>'+
			          				'<img src="/site_media/img/images/folder.png" alt="" style="margin-right: 15px" />添加角色'+
			          				'</span>'+
			          				'</div>'+
			          				'<div style="overflow: hidden;" id="windowContent">'+
			          				'<form action="/create_domain_role/" method="post">'+
//			          				'<div class="create_f"><span style="display:inline-block;width:80px; ">角色名称<span style="color:red">*</span>：</span> <input type="text" name = "name" /></div>'+
			          				'<div class="create_f"><span style="display:inline-block;width:80px; " id="sdomain">选择域<span style="color:red">*</span>：</span><select id="domain_id_type_id" name="domain_id_type_id">'+
			          				domains+
			          				'</select></div>'+
			          				'<div class="create_f"><span style="display:inline-block;width:80px; " id="srole">选择角色<span style="color:red">*</span>：</span><select name="role_id" id="role_id">'+
			          				roles+
			          				'</select></div>'+
			          				'<div class="" style="padding:10px;text-align:center">'+
			          				'<input type="submit" value="创建角色"/>'+
			          				'<input type="hidden" name = "user_id" value="'+user_id+'" />'+
			          				
			          				'</div>'+
			          				'</form>'+
			          				'</div>'+
			          		'</div>')
			          		var domain_type_id = $('#domain_id_type_id').val().split("_")[1]
//			          		alert(domain_type_id)
			          		
			          		var roles = find_roles_by_domain_id(domain_type_id)
			          		$("#role_id").empty()
  							$("#role_id").append(roles);
			          		$('#domain_id_type_id').change(function(){
			          			
			          			var domain_type_id = $('#domain_id_type_id').val().split("_")[1]
			          			var roles = find_roles_by_domain_id(domain_type_id)
				          		$("#role_id").empty()
	  							$("#role_id").append(roles);			          			
			          			
			          		})
			          		$('.create_f').css({"padding":"10px","font-size":"13px","font-weight":"bold"});
			          		$('#window').jqxWindow({  maxWidth: 700, minHeight: 150, minWidth: 300,  width: 400});
			          		$('#window').jqxWindow('resizable', false);
			          		
			})
		
		
	})
	
	
	
	
	$('#add_permission').click(function(){
		var permission_ids = $('#permission_ids').html()
		
		var role_id = $('#role_id').html()

		
		$('#mainPanel').append(
				'<div id="window">'+
				'<div id="windowHeader">'+
				'<span>'+
				'<img src="/site_media/img/images/folder.png" alt="" style="margin-right: 15px" />添加权限（共26种权限）'+
				'</span>'+
				'</div>'+
				'<div style="overflow: hidden;" id="windowContent">'+
				'<form action="/add_permissions/" method="post">'+
				'<div id="permissions" class="create_f"><ul>'+
					'<li><label><input name="permissions" type="checkbox" value="1" />GET_OBJ</label></li>'+
					'<li><label><input name="permissions" type="checkbox" value="2" />GET_CON</label></li>'+
					'<li><label><input name="permissions" type="checkbox" value="3" />GET_DOM</label></li>'+
					'<li><label><input name="permissions" type="checkbox" value="4" />GET_CAP</label></li>'+
					'<li><label><input name="permissions" type="checkbox" value="5" />GET_QUE</label></li>'+
					'<li><label><input name="permissions" type="checkbox" value="6" />GET_USE</label></li>'+
					
					'<li><label><input name="permissions" type="checkbox" value="7" />PUT_OBJ</label></li>'+
					'<li><label><input name="permissions" type="checkbox" value="8" />PUT_CON</label></li>'+
					'<li><label><input name="permissions" type="checkbox" value="9" />PUT_DOM</label></li>'+
					'<li><label><input name="permissions" type="checkbox" value="10" />PUT_CAP</label></li>'+
					'<li><label><input name="permissions" type="checkbox" value="11" />PUT_QUE</label></li>'+
					'<li><label><input name="permissions" type="checkbox" value="12" />PUT_USE</label></li>'+
					
					'<li><label><input name="permissions" type="checkbox" value="13" />DELETE_OBJ</label></li>'+
					'<li><label><input name="permissions" type="checkbox" value="14" />DELETE_CON</label></li>'+
					'<li><label><input name="permissions" type="checkbox" value="15" />DELETE_DOM</label></li>'+
					'<li><label><input name="permissions" type="checkbox" value="16" />DELETE_CAP</label></li>'+
					'<li><label><input name="permissions" type="checkbox" value="17" />DELETE_QUE</label></li>'+
					'<li><label><input name="permissions" type="checkbox" value="18" />DELETE_USE</label></li>'+
					
					'<li><label><input name="permissions" type="checkbox" value="19" />UPDATE_OBJ</label></li>'+
					'<li><label><input name="permissions" type="checkbox" value="20" />UPDATE_CON</label></li>'+
					'<li><label><input name="permissions" type="checkbox" value="21" />UPDATE_DOM</label></li>'+
					'<li><label><input name="permissions" type="checkbox" value="22" />UPDATE_CAP</label></li>'+
					'<li><label><input name="permissions" type="checkbox" value="23" />UPDATE_QUE</label></li>'+
					'<li><label><input name="permissions" type="checkbox" value="24" />UPDATE_USE</label></li>'+
				'</ul></div>'+                                                   
				'<div class="" style="padding:10px;text-align:center">'+
				'<input type="hidden" name="permission_ids" value="'+permission_ids+'"/>'+
				'<input type="hidden" name="role_id" value="'+role_id+'"/>'+
				'<input type="submit" value="添加权限"/>'+
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
				'<div class="create_f"><span style="display:inline-block;width:80px; ">角色名称<span style="color:red">*</span>：</span> <input type="text" name = "rname" /></div>'+
				'<div class="create_f"><span style="display:inline-block;width:80px; ">角色类型<span style="color:red">*</span>：</span><select name="rtype">'+
				          					'<option value="sys">系统角色</option>'+
				          					'<option value="template">模版角色</option>'+
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
		
//		var roles = ''
//		var tenants = ''
//		 $.post("/allroles/", {},	
//	  				function(data) {
//			 
//	    		   
//		          		data = eval(data)
//		          		length = (data.length)
//		    		  
//		          		$.each(data,function(){
//		          			roles += '<option value="'+this+'">'+this+'</option>'
//		          		})
//		          		
//		          		$.post("/alltenants/", {},
//		          				function(data){
//				          			data = eval(data)
//				          			length = (data.length)
//				          			
//				          			$.each(data,function(){
//				          				tenants += '<option value="'+this+'">'+this+'</option>'
//				          			})
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
				          					/*'<div class="create_f"><span style="display:inline-block;width:80px; ">角色<span style="color:red">*</span>：</span><select name="role">'+
				          					roles+
				          					'</select></div>'+*/
				          					'<div class="" style="padding:10px;text-align:center">'+
				          					'<input type="submit" value="创建用户"/>'+
				          					'</div>'+
				          					'</form>'+
				          					'</div>'+
				          			'</div>')
				          			
				          			$('.create_f').css({"padding":"10px","font-size":"13px","font-weight":"bold"});
				          			$('#window').jqxWindow({  maxWidth: 700, minHeight: 150, minWidth: 300,  width: 400});
				          			$('#window').jqxWindow('resizable', false);
//		          			
//		          			
//		          		})
//		          		
//		})
//		
		
		
		
	})
		
		
       
       
	
})