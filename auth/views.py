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
        return redirect('/usermgr/')
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
    return render_to_response('auth/sysmgr.html', {'title':'角色管理', 'oprs':'+添加角色','resname':'角色名称',
                                                   'content':roles, 'js':js,'opr_id':'add_role','type':'role'})
    
def domainManage(request):
    
#     name = request.session['NAME']
#     password = request.session['PASS']
#     aus = client.Client(auth_url=AUTH_URL,username=name,password=password)
#     users = []
#     for n in aus.users.findall():
#         print users.append(n.name)
    
    js = '''$(document).ready(function () {
            $('#leftPanel .folders li:eq(3)').css({'background-color':'#DDEBF4'})
            })
            '''
    return render_to_response('auth/domainmgr.html', {'title':'域管理', 'oprs':'+添加域','resname':'域类别',
                                                   'content':'', 'js':js,'opr_id':'add_domain','type':'role'})
    
    
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
    name = request.session['NAME']
    password = request.session['PASS']
    aus = client.Client(auth_url=AUTH_URL,username=name,password=password)
    aus.roles.delete(idx)
    return HttpResponse('OK')

def create_role(request):
    role_name = str(request.POST['name'].encode('utf-8')).strip()
    name = request.session['NAME']
    password = request.session['PASS']
    aus = client.Client(auth_url=AUTH_URL,username=name,password=password)
    aus.roles.create(role_name)
    return redirect('/rolemgr')

    

def find_all_roles(request):
    name = request.session['NAME']
    password = request.session['PASS']
    aus = client.Client(auth_url=AUTH_URL,username=name,password=password)
    roles = [r.name for r in aus.roles.findall()]
    roles_json = simplejson.dumps(roles)
    return HttpResponse(roles_json)


def find_all_tenants(request):
    name = request.session['NAME']
    password = request.session['PASS']
    aus = client.Client(auth_url=AUTH_URL,username=name,password=password)
    tenants = [t.name for t in aus.tenants.findall()]
    tenants_json = simplejson.dumps(tenants)
    return HttpResponse(tenants_json)


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
                                                   'content':user_info, 'js':js,'opr_id':'add_domain','type':'role'})
    
#         aus = client.Client(auth_url=AUTH_URL,username=name,password=password)
#         user = aus.users.find(idx)
    else:
        return redirect('/')
    
    

def create_user(request):
    name = str(request.POST['name'].encode('utf-8')).strip()
    password = str(request.POST['pass']).strip()
    email = str(request.POST['email'].encode('utf-8')).strip()
    tenant_name = str(request.POST['tenant'].encode('utf-8')).strip()
    role_name = str(request.POST['role'].encode('utf-8')).strip()
    
    try:
        
        if name == '' or password == '':
            raise
        tenant_id = ''
        aus = client.Client(auth_url=AUTH_URL)
        
        for t in aus.tenants.findall():
            if tenant_name == t.name:
                tenant_id = t.id
                break
        
        users = [n.name for n in aus.users.findall()]
        if name not in users:
            user_id = aus.users.create(name, password, email, tenant_id, True).id
#            aus.roles.
            role_id = ''
            for role in aus.roles.findall():
                if role.name == role_name:
                    role_id = role.id
                    break
            aus.roles.add_user_role(user_id, role_id, tenant_id)
            
            return redirect('/usermgr')
        else:
            return redirect('/rolemgr')
        
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
            
