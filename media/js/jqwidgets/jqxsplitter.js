/*
jQWidgets v1.8.0 (2012-03-09)
Copyright (c) 2011-2012 jQWidgets.
License: http://jqwidgets.com/license/
*/

(function(a){a.jqx.jqxWidget("jqxSplitter","",{});a.extend(a.jqx._jqxSplitter.prototype,{defineInstance:function(){this.width=null;this.height=null;this.roundedcorners=false;this.panels=[];this.orientation="vertical";this.disabled=false;this.splitBarSize=5;this.enableCollapseAnimation=false;this.animationDuration="fast";this.cookies=false;this.cookieOptions={};this.touchSplitBarSize=15;this._dimentions={horizontal:{size:"height",outerSize:"outerHeight",dimention:"top",start:"_startY",mouse:"_mouseStartY",page:"pageY",opposite:"vertical"},vertical:{size:"width",outerSize:"outerWidth",dimention:"left",start:"_startX",mouse:"_mouseStartX",page:"pageX",opposite:"horizontal"}};this._touchEvents={mousedown:"touchstart",mouseup:"touchend",mousemove:"touchmove",mouseenter:"mouseenter",mouseleave:"mouseleave"};this._isTouchDevice=false;this._splitBars=[];this._splitPanels=[];this._cursor="";this._panelWrapper=null;this._events=["resize","expanded","collapsed","resizeStart"];this._exceptions={invalidArgument:"Invalid ",invalidOrientation:"Invalid orientation!",invalidStructure:"Invalid structure!",invalidSplitBarSize:"Invalid splitbar size!"}},createInstance:function(){this._cursor=this.host.css("cursor");this._setSplitterSize();this._isTouchDevice=a.jqx.mobile.isTouchDevice();this._validateProperties();this._refresh(true);var b=a.data(document.body,"jqx-splitters")||[];b.push(this.host);a.data(document.body,"jqx-splitters",b);if(this.disabled){this.disabled=false;this.disable()}this._splittersLayout()},_setSplitterSize:function(){var g=0,c,f,b=0,d=0,h=true;if(this.width==="auto"||!isNaN(parseInt(this.width,10))){this.host.css("width",this.width)}if(this.height==="auto"||!isNaN(parseInt(this.height,10))){this.host.css("height",this.height)}for(var e=0;e<this.panels.length;e+=1){b=parseInt(this.panels[e].min,10);if(!this.panels[e].max){h=false}else{d+=parseInt(this.panels[e].max,10)}if(!isNaN(b)){g+=b}}this.host.css("min-"+this._getDimention("size"),g);if(h){this.host.css("max-"+this._getDimention("size"),d)}},_getDimention:function(b){return this._dimentions[this.orientation][b]},_validateProperties:function(){try{this._validatePanels();this._validateStructure();this._validateOptions()}catch(b){alert(b)}},_validatePanels:function(){var e=["max","min","size","collapsed","collapsible","resizable"],b;for(var c=0;c<e.length;c+=1){for(var d=0;d<this.panels.length;d+=1){if(typeof this.panels[d][e[c]]!=="undefined"){this._validatePanel(e[c],this.panels[d])}}}},_validatePanel:function(d,b){var c;if(d!=="collapsed"&&d!=="collapsible"&&d!=="resizable"){c=b[d];b[d]=parseInt(b[d],10);if(isNaN(b[d])){throw new Error(this._exceptions.invalidArgument+d+" for panel "+(i+1)+".")}else{if(typeof c==="string"&&c.indexOf("%")>=0){b["_"+d]=c;b[d]=this.host[this._getDimention("size")]()*b[d]/100}}}else{b[d]=this._parseBoolean(b[d])}},_parseBoolean:function(b){return/^true$/i.test(b)},_validateStructure:function(){if(this.host.children("div").length<2){throw new Error(this._exceptions.invalidStructure)}},_validateOptions:function(){if(this.orientation!=="vertical"&&this.orientation!=="horizontal"){throw new Error(this._exceptions.invalidOrientation)}if(parseInt(this.splitBarSize,10)<0||isNaN(parseInt(this.splitBarSize,10))){throw new Error(this._exceptions.invalidSplitBarSize)}if(parseInt(this.touchSplitBarSize,10)<0||isNaN(parseInt(this.touchSplitBarSize,10))){throw new Error(this._exceptions.invalidSplitBarSize)}},_refresh:function(b){this._render();this._startupLayout(b);this._removeEventHandlers();this._addEventHandlers()},_startupLayout:function(b){var c=false;if(b){if(this.cookies){var d=a.jqx.cookie.cookie("jqxSplitter"+this.element.id);if(d!==null){this.importLayout(d);c=true}}}if(!c){this._refreshWidgetLayout()}},_render:function(){this.host.addClass(this.toThemeProperty("jqx-splitter"));if(this.roundedcorners){this.host.addClass(this.toThemeProperty("jqx-rc-all"))}var c=this.host.children("div"),b;if(this._splitPanels.length<1){for(var d=0;d<c.length;d+=1){b=a(c[d]);b.options={max:9007199254740992,min:0,collapsible:true,resizable:true,collapsed:false,size:b[this._getDimention("size")]()};this._splitPanels.push(b)}this._createSplitBars();this._addCollapseButtons();this._addPanelProperties()}this._wrapperHandler()},_createSplitBars:function(){var e,d,b;for(var c=0;c<this._splitPanels.length;c+=1){if(c+1<this._splitPanels.length){e=this._splitPanels[c];d=this._splitPanels[c+1];b={previous:e,next:d};b.splitBar=this._addSplitBar(e,d);this._splitBars.push(b)}}},_addSplitBar:function(d,c){var b=a("<div/>");b.insertAfter(d);if(this.orientation==="horizontal"){b.width(d.width())}else{b.height(d.height())}return b},_addCollapseButtons:function(){var d=this._splitBars.length;for(var c=0;c<d;c+=1){var b=a("<div/>");this._splitBars[c].splitBar.append(b);if(c!==0&&c!==d-1){b.css("visibility","hidden")}}},_refreshWidgetLayout:function(){this._setSplitterSize();this._removeClasses();this._addClasses();this._validateSize();this._applyOptions();this._performLayout()},_addClasses:function(){var d,b;for(var c=0;c<this._splitPanels.length;c+=1){this._splitPanels[c].addClass(this.toThemeProperty("jqx-splitter-panel"));if(c<this._splitBars.length){b=this._splitBars[c].splitBar;d=b.children(0);b.addClass(this.toThemeProperty("jqx-splitter-splitbar-"+this.orientation));b.removeClass(this.toThemeProperty("jqx-splitter-splitbar-"+this._getDimention("opposite")));d.addClass(this.toThemeProperty("jqx-splitter-collapse-button-"+this.orientation));d.removeClass(this.toThemeProperty("jqx-splitter-collapse-button-"+this._getDimention("opposite")));if(a.browser.msie&&a.browser.version<=7){this._splitBars[c].previous.css("position","relative");this._splitBars[c].next.css("position","relative")}}}},_removeClasses:function(e){var b=this.theme;this.theme=e;for(var d=0;d<this._splitPanels.length;d+=1){this._splitPanels[d].removeClass(this.toThemeProperty("jqx-splitter-panel"));if(d<this._splitBars.length){var c=this._splitBars[d].splitBar.children(0);this._splitBars[d].splitBar.removeClass(this.toThemeProperty("jqx-splitter-splitbar-"+this.orientation));c.removeClass(this.toThemeProperty("jqx-splitter-collapse-button-"+this.orientation))}}this.theme=b},_addPanelProperties:function(){var e=["max","min","size","collapsed","collapsible","resizable"],c=(this.panels instanceof Array)?this.panels:[];for(var d=0;d<this._splitPanels.length;d+=1){for(var b=0;b<e.length;b+=1){if(typeof c[d]!=="undefined"&&typeof c[d][e[b]]!=="undefined"){this._splitPanels[d].options[e[b]]=c[d][e[b]]}else{if(e[b]==="size"){if(this._splitPanels[d][0].style[this._getDimention("size")]!=="auto"&&this._splitPanels[d][0].style[this._getDimention("size")]!==""){this._splitPanels[d].options.size=this._splitPanels[d][this._getDimention("size")]()}else{this._splitPanels[d].options.size=Math.floor(this.host.width()/this._splitPanels.length)}}}}}},_wrapperHandler:function(){if(this._panelWrapper===null){this._panelWrapper=a('<div class="jqx-splitter-panel-wrapper" style="height: 100%;"></div>');this.host.wrapInner(this._panelWrapper);this._panelWrapper=this.host.children()}},_performLayout:function(){var b=this._splitBars.length;while(b){b-=1;this._performSplitterLayout(this._splitBars[b])}this._refreshLayout()},_performSplitterLayout:function(b){if(this.orientation==="horizontal"){b.previous.css("float","none");b.splitBar.css("float","none");b.next.css("float","none");b.splitBar.css("width","100%");b.next.css("width","100%");b.previous.css("width","100%")}else{b.previous.css("float","left");b.splitBar.css("float","left");b.next.css("float","left");b.next.css("height","100%");b.previous.css("height","100%")}},_refreshLayout:function(){if(this.orientation==="vertical"){this._panelWrapper.width(2*this.host.width())}else{this._panelWrapper.css("width",this.host.width())}this._performSplitBarsLayout();this._performPanelLayout()},_performSplitBarsLayout:function(){var d=this.host.height(),e=this.host.width(),c=(this._isTouchDevice)?this.touchSplitBarSize:this.splitBarSize;for(var b=0;b<this._splitBars.length;b+=1){if(this.orientation==="vertical"){this._splitBars[b].splitBar.height(d);this._splitBars[b].splitBar.width(c)}else{this._splitBars[b].splitBar.width(e);this._splitBars[b].splitBar.height(c)}this._centerChild(this._splitBars[b].splitBar.children(0))}},_centerChild:function(b){var c=(a(b.parent()).height()-b.outerHeight())/2,d=(a(b.parent()).width()-b.outerWidth())/2;b.css("margin-top",c);b.css("margin-left",d);return b},_performPanelLayout:function(){var e=this._splitPanels.length,d=0,c=(e-1)*this._splitBars[0].splitBar[this._getDimention("outerSize")](true),b=this.host[this._getDimention("size")](),f;while(d<e){f=this._splitPanels[d];d++;if(!f.options.collapsed){c+=this._handlerPanelSize(f,c,b)}}if(c<b){this._fillContainer(b,c,e-1)}},_getBorderSize:function(c){if(c==null){return 0}var b=this.orientation=="vertical"?parseInt(c.css("border-left-width")):parseInt(c.css("border-top-width"));return b},_handlerPanelSize:function(h,c,b){this._setPanelSize(h,h.options.size);var f=h.options.size,d;if(c+f>=b&&!h.options.collapsed){d=b-c;var e=this._getBorderSize(h),g=c+d-b;if(!isNaN(e)){d-=e}d=Math.min(d,h.options.max);d=Math.max(d,h.options.min);if(!h.options.collapsed){h[this._getDimention("size")](d);h.options.size=d}}return h[this._getDimention("outerSize")](true)},_fillContainer:function(b,d,e){if(typeof e==="undefined"){e=0}var h=this._splitPanels[e],c=b-d,f=h[this._getDimention("size")](),g=c+f;if(e<=this._splitPanels.length){if(h.options.collapsed){this._fillHelper(d,b)}else{if(g>h.options.max){h.options.max=g}h[this._getDimention("size")](g);h.options.size=g}return}g=Math.min(g,h.options.max);if(!h.options.collapsed){h[this._getDimention("size")](g);h.options.size=g}else{g=f=0}if(g+(d-f)<b||h.options.collapsed){this._fillContainer(b,(d-f)+g,e-1)}},_fillHelper:function(d,b){var c,f=false;for(var e=0;e<this._splitPanels.length&&!f;e+=1){c=this._splitPanels[e];if(!c.options.collapsed){f=true}}c[this._getDimention("size")](b-d+c[this._getDimention("size")]())},_applyOptions:function(){for(var b=0;b<this._splitPanels.length;b+=1){if(this._splitPanels[b].options.collapsed){this._splitPanels[b].options.collapsed=false;this.collapseAt(b)}if(!this._splitPanels[b].options.collapsible){if(b<this._splitPanels.length-1){this.hideCollapseButtonAt(b)}else{this.hideCollapseButtonAt(b-1)}}else{if(this._splitPanels[b].options.collapsible){if(b<this._splitPanels.length-1){this.showCollapseButtonAt(b)}else{this.showCollapseButtonAt(b-1)}}}}},_validateSize:function(){var b,d=this._getDimention("size");for(var c=0;c<this._splitPanels.length;c+=1){b=this._splitPanels[c].options;if(b.max<b.size){b.size=b.max}else{if(b.min>b.size){b.min=b.size}}this._splitPanels[c][d](b.size)}},_getEvent:function(b){if(this._isTouchDevice){return this._touchEvents[b]}else{return b}},_removeEventHandlers:function(){var c=this._splitBars.length;var b=this;this.removeHandler(a(document),this._getEvent("mouseup")+"."+this.host.attr("id"));this.removeHandler(a(document),this._getEvent("mousemove")+"."+this.host.attr("id"));while(c){c-=1;this._removeSplitBarHandlers(this._splitBars[c]);this._removeCollapseButtonHandlers(a(this._splitBars[c].splitBar.children(0)),c)}},_removeSplitBarHandlers:function(b){this.removeHandler(b.splitBar,this._getEvent("mouseenter"));this.removeHandler(b.splitBar,this._getEvent("mouseleave"));this.removeHandler(b.splitBar,this._getEvent("mousedown"))},_removeCollapseButtonHandlers:function(b){this.removeHandler(b,this._getEvent("mouseenter"));this.removeHandler(b,this._getEvent("mouseleave"));this.removeHandler(b,this._getEvent("mousedown"))},_addEventHandlers:function(){var d=this._splitBars.length,b=this;b.autoResize=true;this.addHandler(a(document),this._getEvent("mouseup")+"."+this.host.attr("id"),function(){b.autoResize=false;b._stopDrag(b)});this.addHandler(a(document),this._getEvent("mousemove")+"."+this.host.attr("id"),function(e){b._performDrag(b,e)});this.addHandler(a(window),"resize",function(g){if(!b.windowWidth){b.windowWidth=a(window).width()}if(!b.windowHeight){b.windowHeight=a(window).height()}var f=a(window).width();var h=a(window).height();if(b.autoResize){if(f!=b.windowWidth||h!=h){if((typeof b.width==="string"&&b.width.indexOf("%")>=0&&b.orientation=="vertical")||(typeof b.height==="string"&&b.height.indexOf("%")>=0&&b.orientation=="horizontal")){for(var e=0;e<b.panels.length;e+=1){if(b.panels[e]["_size"]!=undefined){b.panels[e]["size"]=b.panels[e]["_size"];b._validatePanel("size",b.panels[e])}}b._addPanelProperties()}}}b.windowWidth=a(window).width();b.windowHeight=a(window).height();b._refreshLayout()});while(d){d-=1;this._addSplitBarHandlers(this._splitBars[d]);this._addCollapseButtonHandlers(a(this._splitBars[d].splitBar.children(0)),d)}if(window.frameElement){if(window.top!=null){var c=function(e){b._stopDrag(b)};if(window.top.document.addEventListener){window.top.document.addEventListener("mouseup",c,false)}else{if(window.top.document.attachEvent){window.top.document.attachEvent("onmouseup",c)}}}}},_addSplitBarHandlers:function(b){var c=this;this.addHandler(b.splitBar,this._getEvent("mousedown"),this._startDrag,{self:this});this.addHandler(b.splitBar,this._getEvent("mouseenter"),function(){a(this).addClass(c.toThemeProperty("jqx-splitter-splitbar-hover"))});this.addHandler(b.splitBar,this._getEvent("mouseleave"),function(){a(this).removeClass(c.toThemeProperty("jqx-splitter-splitbar-hover"))})},_addCollapseButtonHandlers:function(d,c){var b=this;this.addHandler(d,this._getEvent("mouseenter"),function(){d.addClass(b.toThemeProperty("jqx-splitter-collapse-button-hover"))});this.addHandler(d,this._getEvent("mouseleave"),function(){d.removeClass(b.toThemeProperty("jqx-splitter-collapse-button-hover"))});this.addHandler(d,this._getEvent("mousedown"),function(){var e=b._splitBars.length;if(e==1){a.each(b._splitPanels,function(g){var f=b._splitPanels[g].options;if(f.collapsible){b._collapseButtonClickHandler(g);return false}})}else{if(c<e/2){b._collapseButtonClickHandler(c)}else{b._collapseButtonClickHandler(1+c)}}return false})},_collapseButtonClickHandler:function(b){if(this._splitPanels[b].options.collapsed){this.expandAt(b)}else{this.collapseAt(b)}},_startDrag:function(e){var b=e.data.self;b._resizeArea=b._splitBars[b._indexOf(a(e.target))];if((typeof b._resizeArea.previous.options.resizable==="undefined"||b._resizeArea.previous.options.resizable)&&(typeof b._resizeArea.next.options.resizable==="undefined"||b._resizeArea.next.options.resizable)){var d=b._resizeArea.previous,c=b._resizeArea.next;if((!d.options.collapsed&&!c.options.collapsed)&&!(c.options.max<=c[b._getDimention("outerSize")]()&&d.options.max<=d[b._getDimention("outerSize")]())){b._capturedElement=b._makeClone(e.target);b._startX=b._capturedElement.offset().left;b._startY=b._capturedElement.offset().top;b._mouseStartX=(b._isTouchDevice)?e.originalEvent.touches[0].pageX:e.pageX;b._mouseStartY=(b._isTouchDevice)?e.originalEvent.touches[0].pageY:e.pageY;b._raiseEvent(3)}}return false},_makeClone:function(b){var c=a(b).clone();c.css({position:"absolute",top:a(b).offset().top,left:a(b).offset().left});c.fadeTo(0,0.7);c.css("z-index",9999);a(document.body).append(c);return c},_clickCollapse:function(c){var b=c.data.self;b.collapseAt(0)},_performDrag:function(c,e){var d=(c._isTouchDevice)?e.originalEvent.touches[0][c._getDimention("page")]:e[c._getDimention("page")];if(e.which===0&&a.browser.msie&&a.browser.version<9){c._stopDrag(c);return false}if(c._capturedElement!==null&&typeof c._capturedElement!=="undefined"){var b=(d-c[c._getDimention("mouse")])+c[c._getDimention("start")];c._moveSplitBar(b);return false}return true},_moveSplitBar:function(b){b=this._validatePosition(b);if(b.invalid){this._capturedElement.addClass(this.toThemeProperty("jqx-splitter-invalid"))}else{this._capturedElement.removeClass(this.toThemeProperty("jqx-splitter-invalid"))}this._capturedElement.css(this._getDimention("dimention"),b.position)},_validatePosition:function(b){var f=this._resizeArea,h=this._getNextBoundary(f),e=this._getPreviousBoundary(f),d=Math.min(h,h-f.next.options.min,e+f.previous.options.max),c=Math.max(e,e+f.previous.options.min,h-f.next.options.max),g;if(c>d){g=f.next.offset()[this._getDimention("dimention")]-this._capturedElement[this._getDimention("outerSize")](true);return{position:g,invalid:true}}if(b<c){return{position:c,invalid:true}}if(b>d){return{position:d,invalid:true}}return{position:b,invalid:false}},_getNextBoundary:function(b){var d=b.next.offset()[this._getDimention("dimention")]+b.next[this._getDimention("size")]()-this._capturedElement[this._getDimention("outerSize")](true),c=this._nextPanel(b.next);if(c!==null&&c.options.collapsed){d-=c.options.min}return d},_getPreviousBoundary:function(b){var d=b.previous.offset()[this._getDimention("dimention")],c=this._previousPanel(b.previous);if(c!==null&&c.options.collapsed){d+=c.options.min}return d},_previousPanel:function(b){var c=this._indexOfSplitPanel(b);if(c===0){return null}else{return this._splitPanels[c-1]}},_nextPanel:function(b){var c=this._indexOfSplitPanel(b);if(c===this._splitPanels.length-1){return null}else{return this._splitPanels[c+1]}},_indexOfSplitPanel:function(b){var c=this._splitPanels.length;while(c){c-=1;if(this._splitPanels[c][0]===b[0]){return c}}return -1},_stopDrag:function(b){if(b._capturedElement){b._performAreaResize();b._capturedElement.remove()}b._capturedElement=null},_performAreaResize:function(){var b=this._resizeArea,c=this._capturedElement.offset()[this._getDimention("dimention")]-this[this._getDimention("start")],g=b.previous[this._getDimention("size")]()+c,f=b.next[this._getDimention("size")]()-c,e=this._indexOf(b.splitBar),d=b.previous[this._getDimention("size")]();this._setPanelSize(b.previous,g);this._setPanelSize(b.next,f);this._splittersLayout();if(d!==g){this._raiseEvent(0,{firstPanel:{index:e,size:g},secondPanel:{index:e+1,size:f}})}},_splittersLayout:function(){var c=a.data(document.body,"jqx-splitters")||[];if(this.cookies){a.jqx.cookie.cookie("jqxSplitter"+this.element.id,this.exportLayout(),this.cookieOptions)}for(var b=0;b<c.length;b+=1){if(c[b][0]!==this.element){a(c[b]).jqxSplitter("_performLayout")}}},_raiseEvent:function(b,d){var c=new a.Event(this._events[b]);c.owner=this;c.args=d;return this.host.trigger(c)},_setPanelSize:function(b,c){if(!b.options.collapsed){b.options.size=c;b[this._getDimention("size")](c)}else{b[this._getDimention("size")](0)}},_indexOf:function(b){var c=this._splitBars.length;while(c){c-=1;if(this._splitBars[c].splitBar[0]===b[0]){return c}}return -1},_neighborPanel:function(b){var c;if(b===this._splitPanels.length-1){c=this._splitPanels[b-1]}else{c=this._splitPanels[b+1]}return c},_animateResize:function(b,d,f,g){var e={},c=this;e[this._getDimention("size")]=d;b.animate(e,{step:function(){c._splittersLayout.call(c)},duration:f,complete:function(){c._splittersLayout.call(c);if(g&&g instanceof Function){g()}}})},_addDisabledClasses:function(){var c;for(var b=0;b<this._splitBars.length;b+=1){c=this._splitBars[b].splitBar;c.addClass(this.toThemeProperty("jqx-splitter-splitbar-disabled"));c.children(0).addClass(this.toThemeProperty("jqx-splitter-collapse-button-disabled"))}},_removeDisabledClasses:function(){var c;for(var b=0;b<this._splitBars.length;b+=1){c=this._splitBars[b].splitBar;c.removeClass(this.toThemeProperty("jqx-splitter-splitbar-disabled"));c.children(0).removeClass(this.toThemeProperty("jqx-splitter-collapse-button-disabled"))}},_closestSplitBar:function(d,c){for(var b=0;b<this._splitBars.length;b+=1){if((this._splitBars[b].previous[0]===d[0]&&this._splitBars[b].next[0]===c[0])||(typeof c==="undefined"&&this._splitBars[b].previous[0]===d[0])||(this._splitBars[b].next[0]===d[0]&&this._splitBars[b].previous[0]===c[0])){return this._splitBars[b].splitBar}}return null},_themeChanger:function(f,g,e){if(typeof e==="undefined"){e=this.host}var h=e[0].className.split(" "),b=[],j=[],d=e.children();for(var c=0;c<h.length;c+=1){if(h[c].indexOf(f)>=0){b.push(h[c]);j.push(h[c].replace(f,g))}}this._removeOldClasses(b,e);this._addNewClasses(j,e);for(var c=0;c<d.length;c+=1){this._themeChanger(f,g,a(d[c]))}},_removeOldClasses:function(d,c){for(var b=0;b<d.length;b+=1){c.removeClass(d[b])}},_addNewClasses:function(d,c){for(var b=0;b<d.length;b+=1){c.addClass(d[b])}},propertyChangedHandler:function(b,c,e,d){if(c==="disabled"){if(d){this.disable()}else{this.enable()}}else{if(c==="theme"){this._themeChanger(e,d)}else{if(c==="panels"){this._validatePanels();this._addPanelProperties();this._refreshWidgetLayout()}else{this._refreshWidgetLayout()}}}},exportLayout:function(){var b='{ "panels": [';for(var c=0;c<this._splitPanels.length;c+=1){b+="{";for(var d in this._splitPanels[c].options){b+='"'+d+'":';b+='"'+this._splitPanels[c].options[d]+'",'}b=b.substring(0,b.length-1)+" },"}b=b.substring(0,b.length-1)+'],                 "orientation": "'+this.orientation+'" }';return b},importLayout:function(b){try{var c=a.parseJSON(b);this.panels=c.panels;this.orientation=c.orientation;this._validatePanels();this._addPanelProperties();this._refreshWidgetLayout()}catch(d){alert(d)}},expandAt:function(d){if(d<=this._splitPanels.length&&d>=0&&this._splitPanels[d].options.collapsed){var g=this._neighborPanel(d),f=this._splitPanels[d],c=this,e=(this.enableCollapseAnimation)?this.animationDuration:0,b;f.options.collapsed=false;f.options.size=Math.min(f.options.size,g[this._getDimention("size")]());g.options.size=g[this._getDimention("size")]()-f.options.size;b=this._closestSplitBar(f,g);b.removeClass(this.toThemeProperty("jqx-splitter-splitbar-collapsed"));this._animateResize(g,g.options.size,e);this._animateResize(f,f.options.size,e,function(){c._raiseEvent(1,{panel:d})})}},collapseAt:function(d){var f=this._splitPanels[d].options;if(d<this._splitPanels.length&&d>=0&&!f.collapsed&&f.collapsible){var h=this._splitPanels[d],e=h[this._getDimention("size")](),g=(this.enableCollapseAnimation)?this.animationDuration:0,j=this._neighborPanel(d),c=this,b;h.options.size=(e)?e:h.options.size;h.options.collapsed=true;b=this._closestSplitBar(h,j);b.addClass(this.toThemeProperty("jqx-splitter-splitbar-collapsed"));j.options.size=j[this._getDimention("size")]()+e;this._animateResize(j,j.options.size,g);this._animateResize(h,0,g,function(){c._raiseEvent(2,{panel:d})})}},disable:function(){if(!this.disabled){this._removeEventHandlers();this.disabled=true;this._addDisabledClasses()}},enable:function(){if(this.disabled){this._addEventHandlers();this.disabled=false;this._removeDisabledClasses()}},showCollapseButtonAt:function(b){if(b>=0&&b<this._splitBars.length){this._splitBars[b].splitBar.children(0).css("visibility","visible")}},hideCollapseButtonAt:function(b){if(b>=0&&b<this._splitBars.length){this._splitBars[b].splitBar.children(0).css("visibility","hidden")}}})}(jQuery));