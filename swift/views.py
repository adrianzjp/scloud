# coding: UTF-8

# Create your views here.
from django.template import Context, loader
from polls.models import Poll
from django.http import HttpResponse
from django.http import Http404

from api.keystone import client
from django.shortcuts import render_to_response

from api.keystone.mysql import mysql_oprs

from newproject.settings import AUTH_URL
from api.swift import swiftAPI

from django.utils import simplejson
from django.shortcuts import redirect


import math
import logging
import os

import re
import datetime
import hashlib

import zipfile
import StringIO

from django.utils.http import urlquote





def convertBytes(bytes, lst=None):
    if lst is None:
        lst=['B', 'KB', 'MB', 'GB', 'TB', 'PB']
        
    if (bytes == 0):
        return '0 B'    
    
    i = int(math.floor( 
             math.log(bytes, 1024) 
            ))

    if i >= len(lst):
        i = len(lst) - 1
    return ('%.2f' + " " + lst[i]) % (bytes/math.pow(1024, i))


def findUsers(request):
    name = request.session['NAME']
    password = request.session['PASS']
    aus = client.Client(auth_url=AUTH_URL,username=name,password=password,tenant_name=name)
    users = [n.name for n in aus.users.findall()]
    
    user = str(request.POST['user'].encode('utf-8')).strip()

    
    if user in users:
        return HttpResponse('ok')
    else:
        return HttpResponse('nope')




def index(request):
    
    if request.session['NAME']=='' or request.session['NAME'] == None:
        return redirect('/')


    name = request.session['NAME']
    password = request.session['PASS']
    container = mysql_oprs.get_root_name(name)
    tenant = name
    
    root_id = mysql_oprs.find_root_id(name)
    conn = swiftAPI.Connection(authurl = AUTH_URL,user = name,key = password,tenant_name = tenant)
    containers = mysql_oprs.find_folders_in_rootcontainer(name)
#    objects = [(n['name'],convertBytes(n['bytes']),n['last_modified'].split('T')[0]) for n in conn.get_container(container)[1]]        
    objects = mysql_oprs.find_objects_in_rootcontainer(name)
    
    container_id =  request.GET.get('cid',-1)
#    path =  urlquote(request.GET.get('path','none').encode('utf-8'))
    path =  (request.GET.get('path','none').encode('utf-8'))
    if container_id != -1 and path != 'none':
        js = '''$(document).ready(function () {
            $('#leftPanel .folders li:eq(0)').css({'background-color':'#DDEBF4'})
            $('.filelistcontent').empty()
               
                 loading.show()
               $.post("/swift/getContentById/", {id:'''+container_id+'''},    
                      function(data) {
                      //     alert(data)
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
                                          '<tr class="filelistcontent"><td><label class="checkbox" value="none" type="object" ido="'+this[0]+'" name="'+this[2]+'"  fname="'+this[1]+'"></label></td><td class="name" type="obj"><span class="object" id="'+this[0]+'">'+this[1]+'</span></td><td class="size">'+this[3]+'</td><td class="modified_time">'+this[4]+'</td></tr> ')
                                      
                                      
                                  }
                          }); 
                          
                          
                          loading.hide()
                          toolbarhide()
    
               })
        
        
        
        })'''
    
        return render_to_response('swift/index.html', {'js':js,'id':container_id,'path':path})
    else:
        js = '''$(document).ready(function () {
            $('#leftPanel .folders li:eq(0)').css({'background-color':'#DDEBF4'})
            })
            '''
        return render_to_response('swift/index.html', {'containers':containers,'objects':objects,'id':root_id,'js':js})
        
    


def getContentById(request):
    
    name = request.session['NAME']
    password = request.session['PASS']
    container_id = request.POST['id']
    tenant = name
    container_sname = mysql_oprs.getNameById(container_id)

    conn = swiftAPI.Connection(authurl = AUTH_URL,user = name,key = password,tenant_name = tenant)
    
    containers = list(mysql_oprs.findSubContainersById(container_id))
    objects = list(mysql_oprs.findSubObjectsById(container_id))
#    objects = [(n['name'],convertBytes(n['bytes']),n['last_modified'].split('T')[0]) for n in conn.get_container(container_sname)[1]]
    
#    containers_objects = objects.extend(containers)
#    objects = [(n['name'],convertBytes(n['bytes']),n['last_modified'].split('T')[0]) for n in conn.get_container(container_sname)[1]]        
    
    
    results = simplejson.dumps(containers+objects)
#    results = simplejson.dumps(containers+objects)
    
    return HttpResponse(results)


def getParentId(request):
    container_id = request.POST['id']
    
    container_parent_id = mysql_oprs.getParentId(container_id)
    
    return HttpResponse(container_parent_id)
    
    



def getObjects(request):
    name = request.session['NAME']
    password = request.session['PASS']
    container = str(request.POST['container'].encode('utf-8')).strip()
    tenant = str(request.POST['tenant'].encode('utf-8')).strip()
    conn = swiftAPI.Connection(authurl = AUTH_URL,user = name,key = password,tenant_name = tenant)
    
    #[(n['name'],n['bytes']) for n in conn.get_container('1')[1]]
    
#    objects = simplejson.dumps([n['name'] for n in conn.get_container(container)[1]])
    objects = simplejson.dumps([(n['name'],convertBytes(n['bytes']),n['last_modified'].split('T')[0]) for n in conn.get_container(container)[1]])
    #objects = ','.join([n['name'] for n in conn.get_container(container)[1]])
    
    return HttpResponse(objects)



def reName(request):
    
    newname = str(request.POST['newname'].encode('utf-8')).strip()
    oldname = str(request.POST['oldname'].encode('utf-8')).strip()
    data_id = str(request.POST['data_id'].encode('utf-8')).strip()
    
    #判断后缀名文件格式是否命名相同
    newname_list = newname.split('.')
    extention_new = newname_list[len(newname_list)-1]
    
    oldname_list = oldname.split('.')
    extention_old = oldname_list[len(oldname_list)-1]
    
    if (extention_old != extention_new or len(newname_list) == 1) and len(oldname_list) > 1:
        newname = newname+'.'+extention_old
    else:
        pass
    
        
    
    mysql_oprs.reName(newname, data_id)
    
    return HttpResponse(newname)
    

    

def content_delete(request):

    name = request.session['NAME']
    password = request.session['PASS']
    
    container_id = request.POST['id']
    container_storage_name = mysql_oprs.getNameById(container_id)
    tenant = name
#    folder_ids:folder_ids,files

    folder_ids = request.POST['folder_ids']
    file_ids = str(request.POST['file_ids'].encode('utf-8')).strip()
    
#    fileslist = files.split(',')
#    
#    conn = swiftAPI.Connection(authurl = AUTH_URL,user = name,key = password,tenant_name = tenant)
#
#    #delete the files in the files list
#    for f in fileslist:
#        if f!='':
#            conn.delete_object(container_storage_name, f)
            
    #delete the folder in the folder id list
    mysql_oprs.deleteContent(folder_ids+file_ids)
        
            
    return HttpResponse('ok')
    





def deletefile(request):
    name = request.session['NAME']
    password = request.session['PASS']
    
    container = str(request.POST['container'].encode('utf-8')).strip()
    tenant = str(request.POST['tenant'].encode('utf-8')).strip()
    filename = str(request.POST['filename'].encode('utf-8')).strip()
    
#    logging.INFO('debug') 
#    logging.INFO('warn')  
#    logging.error('error') 
    
    
#    
#    
    conn = swiftAPI.Connection(authurl = AUTH_URL,user = name,key = password,tenant_name = tenant)
    headobj = conn.head_object(container,filename)
    houzhui = headobj['x-object-meta-orig-filename'].split('.',1)[1]
    conn.delete_object(container, filename)
    
#    filename = filename+'.'+houzhui

    logging.basicConfig(filename = os.path.join(os.getcwd(), 'log.txt'),level = logging.INFO, filemode = 'w', format = '%(asctime)s - %(levelname)s: %(message)s')   
    logging.info('type:'+'delete'+' '+'tenant:'+tenant+' '+'container:'+' '+container+' '+'filename:'+' '+filename)
#    mysql_oprs.put_info('delete_file', tenant, container, filename, name)    
#    
    return HttpResponse('OK')
    

from django import forms
class UploadFileForm(forms.Form):
    title = forms.CharField(max_length=50)
    file = forms.FileField()


from django.utils.encoding import force_unicode

import sys
import codecs


def uploadobjectById(request):
    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES)

        content =  request.FILES['file']
        name = request.session['NAME']
        password = request.session['PASS']
        container_id = request.POST['id']
        path = request.POST['path']
        container = mysql_oprs.getNameById(container_id)
        
        tenant = name
#        filename = str(request.POST['filename'].encode('utf-8')).strip()
        filename = request.FILES['file'].name.encode('utf-8').strip()
        filesize = convertBytes(request.FILES['file'].size)
        file_m_storagename = name+'_'+'file_'+"".join(re.split('\W+', str(datetime.datetime.now())))
        
        x_filename = ('uploadfile.'+request.FILES['file'].name.split('.',1)[1]).encode('utf-8')
#        x_filename = (filename+'.'+request.FILES['file'].name.split('.')[1].encode('utf-8')).encode('utf-8')
#        fname = str(request.FILES['file'].name).strip()
#        metaname = (request.POST['filename']+'.txt').encode('utf-8')

        
        conn = swiftAPI.Connection(authurl = AUTH_URL,user = name,key = password,tenant_name = tenant)
        conn.put_object(container, file_m_storagename, content,headers = {'x-object-meta-orig-filename':x_filename})
        
        mysql_oprs.put_into_objectdata(filename, file_m_storagename, tenant, 'object', container_id, 'ok', '/', 'x',str(filesize))
        
        logging.basicConfig(filename = os.path.join(os.getcwd(), 'log.txt'),level = logging.INFO, filemode = 'w', format = '%(asctime)s - %(levelname)s: %(message)s')   
        logging.info('type:'+'upload_file'+' '+'tenant:'+tenant+' '+'container:'+' '+container+' '+'filename:'+' '+filename)          
        
        return redirect('/swift?cid='+container_id+'&path='+urlquote(path))
#        return redirect('swift/index.html', {'js':js})

        pass
    else:
        form = UploadFileForm()





def uploadobject(request):
    
    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES)
#        if form.is_valid():
#        content =  codecs.EncodedFile(request.FILES['file'],"utf-8").read()
        content =  request.FILES['file']
        name = request.session['NAME']
        password = request.session['PASS']
        
        container = str(request.POST['container'].encode('utf-8')).strip()
        tenant = str(request.POST['tenant'].encode('utf-8')).strip()
#        filename = str(request.POST['filename'].encode('utf-8')).strip()
        filename = request.FILES['file'].name.encode('utf-8').strip()
        
        x_filename = ('uploadfile.'+request.FILES['file'].name.split('.',1)[1]).encode('utf-8')
#        x_filename = (filename+'.'+request.FILES['file'].name.split('.')[1].encode('utf-8')).encode('utf-8')
#        fname = str(request.FILES['file'].name).strip()
#        metaname = (request.POST['filename']+'.txt').encode('utf-8')

        
        conn = swiftAPI.Connection(authurl = AUTH_URL,user = name,key = password,tenant_name = tenant)
        conn.put_object(container, filename, content,headers = {'x-object-meta-orig-filename':x_filename})
        
        logging.basicConfig(filename = os.path.join(os.getcwd(), 'log.txt'),level = logging.INFO, filemode = 'w', format = '%(asctime)s - %(levelname)s: %(message)s')   
        logging.info('type:'+'upload_file'+' '+'tenant:'+tenant+' '+'container:'+' '+container+' '+'filename:'+' '+filename)          
        
#        mysql_oprs.put_info('create_file', tenant, container, filename, name)   
    else:
        form = UploadFileForm()
    
#    return render_to_response('swift/index.html', {})
    return redirect('/swift/')

#    
    
def createfolderByParentId(request):
    
    name = request.session['NAME']
    password = request.session['PASS']
    
#    container = str(request.POST['container'].encode('utf-8')).strip()
    parent_id = request.POST['parent_id']
    tenant = name
    folder_m_name = str(request.POST['folder_name'].encode('utf-8')).strip()
#    #        fname = str(request.FILES['file'].name).strip()
#  
    folder_m_storagename = "".join(re.split('\W+', str(datetime.datetime.now())))
    conn = swiftAPI.Connection(authurl = AUTH_URL,user = name,key = password,tenant_name = tenant)
    conn.put_container(folder_m_storagename)
    
    logging.basicConfig(filename = os.path.join(os.getcwd(), 'log.txt'),level = logging.INFO, filemode = 'w', format = '%(asctime)s - %(levelname)s: %(message)s')   
    logging.info('type:'+'create_folder'+' '+'tenant:'+tenant+' '+'container:'+' '+folder_m_storagename) 
    mysql_oprs.put_into_objectdata(folder_m_name, folder_m_storagename, tenant, "container", parent_id, "ok", "/", "x")
    
    container_id = mysql_oprs.getIdByName(folder_m_storagename)
    
    
    return HttpResponse(container_id)
    
#    try:
#    except Exception, e:
#        return HttpResponse(e)
    


def createfolder(request):
    
    if request.method == 'POST':
        
#        content =  open(request.FILES['file'],'rb')
        name = request.session['NAME']
        password = request.session['PASS']
        
    #    container = str(request.POST['container'].encode('utf-8')).strip()
        tenant = str(request.POST['tenant'].encode('utf-8')).strip()
        folder_m_name = str(request.POST['folder_name'].encode('utf-8')).strip()
    #        fname = str(request.FILES['file'].name).strip()
  
        folder_m_storagename = "".join(re.split('\W+', str(datetime.datetime.now())))
        conn = swiftAPI.Connection(authurl = AUTH_URL,user = name,key = password,tenant_name = tenant)
        conn.put_container(folder_m_storagename)
        
        logging.basicConfig(filename = os.path.join(os.getcwd(), 'log.txt'),level = logging.INFO, filemode = 'w', format = '%(asctime)s - %(levelname)s: %(message)s')   
        logging.info('type:'+'create_folder'+' '+'tenant:'+tenant+' '+'container:'+' '+folder_m_storagename) 
        mysql_oprs.put_into_objectdata(folder_m_name, folder_m_storagename, tenant, "container", 0, "", "", "")
        
#        mysql_oprs.put_info('create_folder', tenant, folder_name, '', name)   
#        conn.put_object(container, filename, content)
    else:
        pass;
    
#    return render_to_response('swift/index.html', {})
    return redirect('/swift/')

#def createtenant(request):
#    
#    if request.method == 'POST':
#        
##        content =  open(request.FILES['file'],'rb')
#        name = request.session['NAME']
#        password = request.session['PASS']
#        aus = client.Client(auth_url=AUTH_URL)
#        
#    #    container = str(request.POST['container'].encode('utf-8')).strip()
#        tenant = str(request.POST['tenant_name'].encode('utf-8')).strip()
##        tenant = str(request.POST['folder_name'].encode('utf-8')).strip()
#    #        fname = str(request.FILES['file'].name).strip()
#    
#        
#        conn = swiftAPI.Connection(authurl = AUTH_URL,user = name,key = password,tenant_name = tenant)
#        tenant_id = aus.tenants.create(tenant, 'tenant created by user for sharing', True).id
#        
#        user_id = ''
#        
#        aus.users.findall()
#        for n in aus.users.findall():
#            if n.name == name:
#                user_id = n.id
#        role_id = aus.roles.create(tenant)
#        if user_id!='':
#            aus.tenants.add_user(tenant_id, user_id, role_id)
##        conn = swiftAPI.Connection(authurl = AUTH_URL,user = name,key = password,tenant_name = name)
##        conn.put_container(folder_name)
##        conn.put_object(container, filename, content)
#    else:
#        pass;
#    
##    return render_to_response('swift/index.html', {})
#    return redirect('/swift/')

def deletefolder(request):
    
    if request.method == 'POST':
        
#        content =  open(request.FILES['file'],'rb')
        name = request.session['NAME']
        password = request.session['PASS']
        
        container = str(request.POST['container'].encode('utf-8')).strip()
        tenant = str(request.POST['tenant'].encode('utf-8')).strip()
#        folder_name = str(request.POST['folder_name'].encode('utf-8')).strip()
    #        fname = str(request.FILES['file'].name).strip()
        
        conn = swiftAPI.Connection(authurl = AUTH_URL,user = name,key = password,tenant_name = tenant)
        conn.delete_container(container)
        
        logging.basicConfig(filename = os.path.join(os.getcwd(), 'log.txt'),level = logging.INFO, filemode = 'w', format = '%(asctime)s - %(levelname)s: %(message)s')   
        logging.info('type:'+'delete_folder'+' '+'tenant:'+tenant+' '+'container:'+' '+container)
#        mysql_oprs.put_info('delete_folder', tenant, container, '', name)       
#        conn.put_object(container, filename, content)
    else:
        pass;
    
#    return render_to_response('swift/index.html', {})
    return redirect('/swift/')

#    
    

import urllib2
def downloadfile(request):
#    from django.core.servers.basehttp import FileWrapper 

    name = request.session['NAME']
    password = request.session['PASS']
    
    container = str(request.GET['container'].encode('utf-8')).strip()
    tenant = str(request.GET['tenant'].encode('utf-8')).strip()
    
    filename = urllib2.unquote(request.GET['filename'])
#    
    conn = swiftAPI.Connection(authurl = AUTH_URL,user = name,key = password,tenant_name = tenant)
    result = conn.get_object(container, filename)
    
    response = HttpResponse(result[1], content_type='application/octet-stream') 
    
    
    response['Content-Disposition'] = 'attachment; filename='+filename
    return response
    
def object_download(request, container_id, object_path):
    name = request.session['NAME']
    password = request.session['PASS']
    tenant = name
    conn = swiftAPI.Connection(authurl = AUTH_URL,user = name,key = password,tenant_name = tenant)
    
    container_name = mysql_oprs.getNameById(container_id)
    zip_filename = "".join(re.split('\W+', str(datetime.datetime.now())))

    s = StringIO.StringIO()

    zf = zipfile.ZipFile(s, "w")
    
    ##test
    files = object_path.split('-')
    
    if len(files) > 2:
    
        for f in files:
            if f!='':
                result = conn.get_object(container_name, f)
                rname = mysql_oprs.changeSnameToName(f, container_id).decode('utf-8')
                zf.writestr(rname, result[1])
        zf.close()
        resp = HttpResponse(s.getvalue(), mimetype = "application/x-zip-compressed")
        # ..and correct content-disposition
        resp['Content-Disposition'] = 'attachment; filename=%s' % zip_filename
        
    #    resp = HttpResponse(result[1], content_type='application/octet-stream') 
    #    resp['Content-Disposition'] = 'attachment; filename='+object_path.encode('utf-8')
        return resp
    else:
        result = conn.get_object(container_name, files[0])
        resp = HttpResponse(result[1], content_type='application/octet-stream') 
        rname = mysql_oprs.changeSnameToName(files[0], container_id)
        resp['Content-Disposition'] = 'attachment; filename='+rname
        return resp
        
        

'''
    codes about data share
'''

def content_share(request):

    name = request.session['NAME']
    password = request.session['PASS']
    
    container_id = request.POST['id']
    container_storage_name = mysql_oprs.getNameById(container_id)
    tenant = name
##    folder_ids:folder_ids,files
#
    folder_ids = request.POST['folder_ids']
    files = str(request.POST['files'].encode('utf-8')).strip()
    user_to = str(request.POST['user_to'].encode('utf-8')).strip()
#    
#    
    files = files.split(',')
    
    
    
#    conn = swiftAPI.Connection(authurl = AUTH_URL,user = name,key = password,tenant_name = tenant)

    #delete the files in the files list
    for f in files:
        if f!='':
            md5str = name+','+user_to+','+container_storage_name+','+f+','+str(datetime.datetime.now())
            rname = mysql_oprs.changeSnameToName(f, container_id)
            unique_url = hashlib.md5(md5str).hexdigest()  
            mysql_oprs.put_into_datashare(container_id,rname, f, tenant, 'object', name, password, user_to, unique_url, '')
            
    return HttpResponse('hello')


def share(request):
    
    if request.session['NAME']=='' or request.session['NAME'] == None:
        return redirect('/')
    
    name = request.session['NAME']
    
    user =  request.GET.get('from')
    shares = None
    label = '来自于'
    
    opr = '<a href="#" id="share_download" value="0">下载</a>'
    js = r"$(document).ready(function () {$('#leftPanel .folders li:eq(1)').css({'background-color':'#DDEBF4'});$('#share_others').css({'background-color':'#DDEBF4'})})"
    if user == 'me':
        shares = mysql_oprs.getShareMyself(name)
        label = '分享给'
        js = r"$(document).ready(function () {$('#leftPanel .folders li:eq(1)').css({'background-color':'#DDEBF4'});$('#share_my').css({'background-color':'#DDEBF4'})})"
        opr = '<a href="#" id="delete_share" value="0">取消分享</a><!--<a href="#" id="set_pass_share" value="0">设置密码</a>-->'
    else:
        shares = mysql_oprs.getShareByUserto(name)
        

    
    return render_to_response('swift/share.html', {'shares':shares,'js':js,'label':label,'opr':opr})
    
    pass

def share_download(request,share_url):

    zip_filename = "".join(re.split('\W+', str(datetime.datetime.now())))
    s = StringIO.StringIO()

    zf = zipfile.ZipFile(s, "w")

    urls = share_url.split('-')
    if len(urls) > 2:
    
        for url in urls:
            if url!='':
                info = mysql_oprs.getShareByUrl(url)
                
                name = info[5]#资源所有者名
                password = info[6]#资源所有者密码
                tenant = info[3]
                
                container_name =mysql_oprs.getNameById(info[1])
            
                object_path = info[2]
                rfilename = info[0].decode('utf-8')
                
                conn = swiftAPI.Connection(authurl = AUTH_URL,user = name,key = password,tenant_name = tenant)
                
                result = conn.get_object(container_name, object_path.encode('utf-8'))
                zf.writestr(rfilename, result[1])
        zf.close()
        resp = HttpResponse(s.getvalue(), mimetype = "application/x-zip-compressed")
        # ..and correct content-disposition
        resp['Content-Disposition'] = 'attachment; filename=%s' % zip_filename
        
    #    resp = HttpResponse(result[1], content_type='application/octet-stream') 
    #    resp['Content-Disposition'] = 'attachment; filename='+object_path.encode('utf-8')
        return resp
    else:
        info = mysql_oprs.getShareByUrl(urls[0])
        
        name = info[5]#资源所有者名
        password = info[6]#资源所有者密码
        tenant = info[3]
        
        container_name =mysql_oprs.getNameById(info[1])
    
        object_path = info[2]
        rfilename = info[0]
        
        conn = swiftAPI.Connection(authurl = AUTH_URL,user = name,key = password,tenant_name = tenant)
        
        result = conn.get_object(container_name, object_path.encode('utf-8'))
        resp = HttpResponse(result[1], content_type='application/octet-stream') 
        resp['Content-Disposition'] = 'attachment; filename='+rfilename
        return resp
    
    
def share_delete(request,share_delete):
    
    mysql_oprs.deleteShare(share_delete)
    
    return HttpResponse('ok')
    
    pass




