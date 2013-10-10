from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

from newproject import settings

urlpatterns = patterns('',
#    url(r'^polls/$', 'polls.views.index'),
#    url(r'^polls/(?P<poll_id>\d+)/$', 'polls.views.detail'),
#    url(r'^polls/(?P<poll_id>\d+)/results/$', 'polls.views.results'),
#    url(r'^polls/(?P<poll_id>\d+)/vote/$', 'polls.views.vote'),
#    url(r'^admin/', include(admin.site.urls)),
    
    url(r'^swift/$', 'swift.views.index'),
    url(r'^swift/getobjects/$', 'swift.views.getObjects'),
    url(r'^swift/deletefile/$', 'swift.views.deletefile'),
    url(r'^swift/downloadfile/$', 'swift.views.downloadfile'),
    url(r'^swift/uploadobject/$', 'swift.views.uploadobject'),
    url(r'^swift/uploadobjectById/$', 'swift.views.uploadobjectById'),
    url(r'^swift/createfolder/$', 'swift.views.createfolder'),
    url(r'^swift/createfolderByParentId/$', 'swift.views.createfolderByParentId'),
    url(r'^swift/getContentById/$', 'swift.views.getContentById'),
    url(r'^swift/getParentId/$', 'swift.views.getParentId'),
    url(r'^swift/deletefolder/$', 'swift.views.deletefolder'),
    url(r'^swift/content_delete/$', 'swift.views.content_delete'),
    url(r'^swift/content_share/$', 'swift.views.content_share'),
    url(r'^swift/share/$', 'swift.views.share'),
    url(r'^swift/findusers/$', 'swift.views.findUsers'),
    url(r'^swift/rename/$', 'swift.views.reName'),
    url(r'^swift/share_download/$', 'swift.views.share_download'),
    url(r'^(?P<share_url>[^/]+)/share_download$',
        'swift.views.share_download',
        name='share_download'),
    url(r'^(?P<share_delete>[^/]+)/share_delete$',
        'swift.views.share_delete',
        name='share_delete'),
    
    url(r'^(?P<container_id>[^/]+)/(?P<object_path>.+)/download$',
        'swift.views.object_download',
        name='object_download'),
#    url(r'^swift/createtenant/$', 'swift.views.createtenant'),
    
    url(r'^$', 'auth.views.index'),
    url(r'^reg/$', 'auth.views.reg'),
    url(r'^usermgr/$', 'auth.views.userManage'),
    url(r'^userdel/$', 'auth.views.userDelete'),
    url(r'^useredit/$', 'auth.views.edit_user'),
    url(r'^allusers/$', 'auth.views.find_all_users'),
    url(r'^allroles/$', 'auth.views.find_all_roles'),
    url(r'^allrolesindomain/$', 'auth.views.find_all_roles_in_domain'),
    url(r'^alldomains/$', 'auth.views.find_all_domains'),
    url(r'^create_user/$', 'auth.views.create_user'),
    
    url(r'^rolemgr/$', 'auth.views.roleManage'),
    url(r'^permissionmgr/$', 'auth.views.permissionManage'),
    url(r'^spacemgr/$', 'auth.views.spaceManage'),
    url(r'^roleedit/$', 'auth.views.edit_role'),
    url(r'^roledel/$', 'auth.views.roleDelete'),
    url(r'^create_domain_role/$', 'auth.views.create_domain_role'),
    url(r'^create_user_domain_role/$', 'auth.views.create_user_domain_role'),
    
    
    url(r'^domainmgr/$', 'auth.views.domainManage'),
    url(r'^domain_admin/$', 'auth.views.domainAdmin'),
    url(r'^domain_detail/$', 'auth.views.edit_domain'),
    url(r'^domaindel/$', 'auth.views.domainDelete'),
    url(r'^domain_active/$', 'auth.views.domainActive'),
    url(r'^space_update/$', 'auth.views.spaceUpdate'),
    url(r'^create_domain/$', 'auth.views.create_domain'),
    url(r'^roledel/$', 'auth.views.roleDelete'),
    url(r'^create_role/$', 'auth.views.create_role'),
    
    url(r'^add_permissions/$', 'auth.views.add_permission'),
    
    url(r'^auth/$', 'auth.views.authenticate'),
    url(r'^auth/register/$', 'auth.views.register'),
    url(r'^auth/logout/$', 'auth.views.logout'),
    
    url(r'^site_media/(?P<path>.*)$','django.views.static.serve',{'document_root':settings.STATIC_PATH}),
#    url(r'^swift/(?P<poll_id>\d+)/$', 'swift.views.detail'),
#    url(r'^swift/(?P<poll_id>\d+)/results/$', 'swift.views.results'),
#    url(r'^swift/(?P<poll_id>\d+)/vote/$', 'swift.views.vote'),
)