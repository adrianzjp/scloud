#!/usr/bin/python2.7  
# -*- coding: utf-8 -*-  
import logging
import hashlib 
logging.basicConfig()
from django.template import Context, loader
from polls.models import Poll
from django.http import HttpResponse
from django.http import Http404
from api.keystone import client
from django.shortcuts import render_to_response
from newproject.settings import AUTH_URL
from django.shortcuts import redirect
from api.keystone.mysql import mysql_oprs

import re
import datetime
from django.utils import simplejson


from api.swift import swiftAPI
from api import mysql_oprs

def is_super_admin(user):
    
    if mysql_oprs.check_space(user)>0: return 0
    elif mysql_oprs.get_role_by_name(user)[0][0] == 'super_admin':return 1
    else: return -1
    


def index(request):
    message =  request.GET.get('message','')
    
    return render_to_response('auth/index.html', {'message':message})

def reg(request):
    message =  request.GET.get('message','')
    return render_to_response('auth/register.html', {'message':message})

def authenticate(request):
#    
#    name = 'ADMIN'
#    pw = 'ADMIN'
    name = str(request.POST['name'].encode('utf-8')).strip()
    pw = str(request.POST['pass']).strip()
#        
    try:
        if name == '' or pw == '':
            raise
        
        if len(mysql_oprs.auth(name, pw))==0:
            raise
#         aus = client.Client(auth_url=AUTH_URL,username=name,password=pw,tenant_name=name)
        
        request.session['NAME'] = name
        request.session['PASS'] = pw
        flag = is_super_admin(name)

#         flag  = 1
        if flag == 1:
            return redirect('/usermgr/')
        elif flag == 0:
            return redirect('/domain_admin/')
        else:
            return redirect('/')
#         return redirect('/swift/')

    except:
        request.session['NAME'] = ''
        return redirect('/?message=user not existing or password is wrong')
    
def userManage(request):
    
    name = request.session['NAME']
    password = request.session['PASS']
    
    users = mysql_oprs.get_users()
    
#     aus = client.Client(auth_url=AUTH_URL,username=name,password=password)
#     users = []
#     for n in aus.users.findall():
#         print users.append(n.name)
    
    js = '''$(document).ready(function () {
            $('#leftPanel .folders li:eq(0)').css({'background-color':'#DDEBF4'})
            })
            '''
    return render_to_response('auth/sysmgr.html', {'title':'用户管理', 'oprs':'+添加用户','resname':'用户名',
                                                   'content':users, 'js':js,'opr_id':'add_user','type':'user'})
    
def roleManage(request):
    
    name = request.session['NAME']
    password = request.session['PASS']
#     aus = client.Client(auth_url=AUTH_URL,username=name,password=password)
    roles = mysql_oprs.get_roles()
#     users = []
#     for n in aus.users.findall():
#         print users.append(n.name)
    
    js = '''$(document).ready(function () {
            $('#leftPanel .folders li:eq(1)').css({'background-color':'#DDEBF4'})
            })
            '''
    return render_to_response('auth/rolemgr.html', {'title':'角色管理', 'oprs':'+添加角色','resname':'角色名称',
                                                   'content':roles, 'js':js,'opr_id':'add_role','type':'role'})
    
def domainManage(request):
    
#     name = request.session['NAME']
#     password = request.session['PASS']
#     aus = client.Client(auth_url=AUTH_URL,username=name,password=password)
#     users = []
#     for n in aus.users.findall():
#         print users.append(n.name)

    public_domains = mysql_oprs.get_domains_by_domain_type(1)
    protected_domains = mysql_oprs.get_domains_by_domain_type(2)
    private_domains = mysql_oprs.get_domains_by_domain_type(3)
    
    js = '''$(document).ready(function () {
            $('#leftPanel .folders li:eq(3)').css({'background-color':'#DDEBF4'})
            })
            '''
    return render_to_response('auth/domainmgr.html', {'title':'域管理', 'oprs':'+添加域','resname':'域类别',
                                                   'pub':public_domains,'pro':protected_domains,'pri':private_domains, 'js':js,'opr_id':'add_domain',
                                                   'type':'domain_active'})


def domainAdmin(request):
    
    space_info = mysql_oprs.get_space_by_user_name(request.session['NAME'])[0]
    space_id = space_info[0]
    
    space_used = 0
    public_domains = mysql_oprs.get_domains_by_space_id_and_domain_type_id(space_id,1)
    protected_domains = mysql_oprs.get_domains_by_space_id_and_domain_type_id(space_id,2)
    private_domains = mysql_oprs.get_domains_by_space_id_and_domain_type_id(space_id,3)
    
    for n in public_domains:
        space_used += n[3]
        
    for n in protected_domains:
        space_used += n[3]
        
    for n in private_domains:
        space_used += n[3]
    
    spare_space = space_info[2] - space_used
    
    
    js = '''$(document).ready(function () {
            $('#leftPanel .folders li:eq(0)').css({'background-color':'#DDEBF4'})
            })
            '''
    return render_to_response('auth/domainadmin.html', {'title':'域管理', 'oprs':'+添加域','resname':'域类别',
                                                   'pub':public_domains,'pro':protected_domains,'pri':private_domains, 'js':js,'opr_id':'add_domain',
                                                   'type':'domain_active','space_info':space_info,'spare_space':spare_space,'space_id':space_id})

    
    
    
def userDelete(request):
    idx = str(request.POST['id']).strip()
    name = request.session['NAME']
    password = request.session['PASS']
    
    mysql_oprs.delete_user_by_id(idx)
#     aus = client.Client(auth_url=AUTH_URL,username=name,password=password)
#     aus.users.delete(idx)
    return HttpResponse('OK')
    
def roleDelete(request):
    idx = str(request.POST['id']).strip()
    
    try:
        mysql_oprs.delete_role_by_id(idx)
    except:
        pass
#     name = request.session['NAME']
#     password = request.session['PASS']
#     aus = client.Client(auth_url=AUTH_URL,username=name,password=password)
#     aus.roles.delete(idx)
    return HttpResponse('OK')


def domainDelete(request):
    idx = str(request.POST['id']).strip()
    
    try:
        mysql_oprs.delete_domain_by_id(idx)
    except:
        pass
#     name = request.session['NAME']
#     password = request.session['PASS']
#     aus = client.Client(auth_url=AUTH_URL,username=name,password=password)
#     aus.roles.delete(idx)
    return HttpResponse('OK')

def create_domain_role(request):
    user_id = str(request.POST['user_id'].encode('utf-8')).strip()
    role_id = str(request.POST['role_id'].encode('utf-8')).strip()
    domain_id = str(request.POST['domain_id_type_id'].encode('utf-8')).strip().split('_')[0]
    
    try:
        if mysql_oprs.check_user_domain_roles(user_id, role_id, domain_id) > 0:
            raise
        mysql_oprs.put_user_domain_roles(user_id, role_id,domain_id)
    except:
        return redirect('/useredit/?id='+user_id+'&message=user already has the domain and role')
        pass
    return redirect('/useredit/?id='+user_id)

    

def find_all_roles(request):
    name = request.session['NAME']
    password = request.session['PASS']
#     aus = client.Client(auth_url=AUTH_URL,username=name,password=password)
    roles = [(r[0], r[1]) for r in mysql_oprs.get_roles()]
    roles_json = simplejson.dumps(roles)
    return HttpResponse(roles_json)

    

def find_all_roles_in_domain(request):
    name = request.session['NAME']
    password = request.session['PASS']
#     aus = client.Client(auth_url=AUTH_URL,username=name,password=password)
    domain_id = str(request.POST['domain_id'].encode('utf-8')).strip()

    rolesindomain = [(r[0], r[1]) for r in mysql_oprs.get_roles_by_domain_type(domain_id)]
    roles_json = simplejson.dumps(rolesindomain)
    return HttpResponse(roles_json)


def find_all_domains(request):
    name = request.session['NAME']
    password = request.session['PASS']
    
#         cursor.execute("select id,domain_type_id, name from domain")
    domains = [(r[0], r[1], r[2]) for r in mysql_oprs.get_domains()]
    domains_json = simplejson.dumps(domains)
    return HttpResponse(domains_json)
#     aus = client.Client(auth_url=AUTH_URL,username=name,password=password)
#     tenants = [t.name for t in aus.tenants.findall()]
#     tenants_json = simplejson.dumps(tenants)
#     return HttpResponse(tenants_json)


def edit_user(request):
    name = request.session['NAME']
    password = request.session['PASS']
    
    if name!='' and password!='':
        idx = str(request.GET['id']).strip()
        user_info = mysql_oprs.get_user_by_id(idx)
        js = '''$(document).ready(function () {
            $('#leftPanel .folders li:eq(0)').css({'background-color':'#DDEBF4'})
            })'''
        return render_to_response('auth/useredit.html', {'title':'编辑用户', 'oprs':'返回','resname':'域类别',
                                                   'content':user_info, 'js':js,'opr_id':'','type':'role'})
    
#         aus = client.Client(auth_url=AUTH_URL,username=name,password=password)
#         user = aus.users.find(idx)
    else:
        return redirect('/')

def domainActive(request):
    name = request.session['NAME']
    password = request.session['PASS']
    
    if name!='' and password!='':
        idx = str(request.POST['id']).strip()
        active_code = str(request.POST['active_code']).strip()
        if active_code == '0':
            active_code = '1'
        elif active_code == '1':
            active_code = '0'
        
        mysql_oprs.update_domain_is_active(idx, active_code)
        
        return HttpResponse('OK')
    
#         aus = client.Client(auth_url=AUTH_URL,username=name,password=password)
#         user = aus.users.find(idx)
    else:
        return redirect('/')
    
def add_permission(request):
    name = request.session['NAME']
    password = request.session['PASS']
    
    if name!='' and password!='':
        permission_ids_exist = set(request.POST['permission_ids'].split(','))
        permissions = set(request.REQUEST.getlist('permissions'))
        
        role_id = request.POST['role_id']
        
        permission_union =','.join(list(permission_ids_exist | permissions))
        
        mysql_oprs.update_role_permissions(role_id, permission_union)
        
        
        return redirect('/roleedit/?id='+role_id)
    
#         aus = client.Client(auth_url=AUTH_URL,username=name,password=password)
#         user = aus.users.find(idx)
    else:
        return redirect('/')
    
def edit_role(request):
    name = request.session['NAME']
    password = request.session['PASS']
    
    if name!='' and password!='':
        idx = str(request.GET['id']).strip()
        role_info = mysql_oprs.get_role_by_id(idx)[0]
        permission_ids = role_info[5]
        
        permissions = mysql_oprs.get_permission_by_ids(permission_ids)
        
        js = '''$(document).ready(function () {
            $('#leftPanel .folders li:eq(1)').css({'background-color':'#DDEBF4'})
            })'''
        return render_to_response('auth/roleedit.html', {'title':'编辑角色', 'oprs':'返回','resname':'域类别',
                                                   'content':role_info, 'permissions':permissions, 'js':js,'opr_id':'','type':'role','permission_ids':permission_ids})
    
#         aus = client.Client(auth_url=AUTH_URL,username=name,password=password)
#         user = aus.users.find(idx)
    else:
        return redirect('/')
    
    

def create_role(request):
    rname = str(request.POST['rname'].encode('utf-8')).strip()
    rtype = str(request.POST['rtype']).strip()
#     role_name = str(request.POST['role'].encode('utf-8')).strip()
    
    try:
        
        if rname == '' or rtype == '' or len(mysql_oprs.check_role(rname))>0:
            raise
        mysql_oprs.put_role(rname=rname, rtype=rtype)
        return redirect('/rolemgr')
        
    except Exception,ex:
        return redirect('/rolemgr/?message='+str(ex))

def create_domain(request):
    dname = str(request.POST['name'].encode('utf-8')).strip()
    dtype = str(request.POST['type']).strip()
    dsize = str(request.POST['size']).strip()
    
    spare_space = str(request.POST['spare_space']).strip()
    space_id = str(request.POST['space_id']).strip()
    
    
#     role_name = str(request.POST['role'].encode('utf-8')).strip()
    
    try:
        
        if dname == '' or dtype == '' or dsize == '' or spare_space == '' or space_id == '' or dsize > spare_space:
            raise
        mysql_oprs.put_domain(dname, dtype, space_id, dsize)
        return redirect('/domain_admin/')
        
    except Exception,ex:
        return redirect('/domain_admin/?message='+str(ex))
    

    
    
def create_user(request):
    name = str(request.POST['name'].encode('utf-8')).strip()
    password = str(request.POST['pass']).strip()
    email = str(request.POST['email'].encode('utf-8')).strip()
#     role_name = str(request.POST['role'].encode('utf-8')).strip()
    
    try:
        
        if name == '' or password == '' or len(mysql_oprs.check_user(name))>0:
            raise
        
        
        mysql_oprs.put_user(name=name, pw=password, email=email)
        mysql_oprs.put_space(name, size=2)
        
        return redirect('/usermgr')
#         tenant_id = ''
#         aus = client.Client(auth_url=AUTH_URL)
        
#         for t in aus.tenants.findall():
#             if tenant_name == t.name:
#                 tenant_id = t.id
#                 break
        
#         users = [n.name for n in aus.users.findall()]
#         if name not in users:
#             user_id = aus.users.create(name, password, email, tenant_id, True).id
# #            aus.roles.
#             role_id = ''
#             for role in aus.roles.findall():
#                 if role.name == role_name:
#                     role_id = role.id
#                     break
#             aus.roles.add_user_role(user_id, role_id, tenant_id)
#             
#         else:
#             return redirect('/rolemgr')
        
    except Exception,ex:
        return redirect('/usermgr/?message=')

    
    
    

def register(request):
    
    name = str(request.POST['name'].encode('utf-8')).strip()
    password = str(request.POST['pass']).strip()
    email = str(request.POST['email'].encode('utf-8')).strip()
    
#    name = 'admin'
#    password = 'ADMIN'
#    email = 'd'
    try:
        
        if name == '' or password == '':
            raise
        
        aus = client.Client(auth_url=AUTH_URL)
        
        
        users = [n.name for n in aus.users.findall()]
        tenants = [n.name for n in aus.tenants.findall()] 
        
        
        if name not in users and name not in tenants:
            tenant_id = aus.tenants.create(name, 'name the same as the user name', True).id
            user_id = aus.users.create(name, password, email, tenant_id, True).id
#            aus.roles.
            conn = swiftAPI.Connection(authurl = AUTH_URL,user = name,key = password,tenant_name = name)
            admin_role_id = ''
            for role in aus.roles.findall():
                if role.name == 'admin':
                    admin_role_id = role.id
            aus.roles.add_user_role(user_id, admin_role_id, tenant_id)
            #when creating a user also create three folders for this user as files, pictures, videos
            root_container = name+"root"
            root_contaienr_md5 = hashlib.md5(root_container).hexdigest() 
            conn.put_container(root_contaienr_md5)
            mysql_oprs.put_into_objectdata('root_container', root_contaienr_md5, name, 'container', 0, 'ok', '/', 'x')
            
            root_id = mysql_oprs.find_root_id(name)
            
            folder_m_storagename = "".join(re.split('\W+', str(datetime.datetime.now())))
            conn.put_container(folder_m_storagename)
            mysql_oprs.put_into_objectdata('图片', folder_m_storagename, name, 'container', root_id, 'ok', '/', 'x')

            folder_m_storagename = "".join(re.split('\W+', str(datetime.datetime.now())))
            conn.put_container(folder_m_storagename)
            mysql_oprs.put_into_objectdata('音乐', folder_m_storagename, name, 'container', root_id, 'ok', '/', 'x')
            
            folder_m_storagename = "".join(re.split('\W+', str(datetime.datetime.now())))
            conn.put_container(folder_m_storagename)
            mysql_oprs.put_into_objectdata('文档', folder_m_storagename, name, 'container', root_id, 'ok', '/', 'x')
            
            ##Success
            return redirect('/?message=register success, please login.')
        else:
            return redirect('/reg/?message=user already existed, please try again.')
        
    except Exception,ex:
        return redirect('/reg/?message=some error occurs when try to create a user.')
        

def logout(request):
    request.session['NAME'] = ''
    request.session['PASS'] = ''
    return redirect('/')    
            
