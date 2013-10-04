/*
jQWidgets v1.8.0 (2012-03-09)
Copyright (c) 2011-2012 jQWidgets.
License: http://jqwidgets.com/license/
*/

(function(a){a.jqx.dataAdapter=function(c,b){this._source=c;this._options=b||{};this.records=new Array();this._downloadComplete=new Array();if(this._options.autoBind==true){this.dataBind()}};a.jqx.dataAdapter.prototype={getrecords:function(){return this.records},dataBind:function(e){var b=this._source;if(!b){return}if(b.dataFields!=null){b.datafields=b.dataFields}if(b.recordstartindex==undefined){b.recordstartindex=0}if(b.recordendindex==undefined){b.recordendindex=0}if(b.loadallrecords==undefined){b.loadallrecords=true}if(b.sort!=undefined){this.sort=b.sort}if(b.filter!=undefined){this.filter=b.filter}this.records=new Array();var q=this._options||{};this.virtualmode=q.virtualmode!=undefined?q.virtualmode:false;this.totalrecords=q.totalrecords!=undefined?q.totalrecords:0;this.pageable=q.pageable!=undefined?q.pageable:false;this.pagesize=q.pagesize!=undefined?q.pagesize:0;this.pagenum=q.pagenum!=undefined?q.pagenum:0;this.cachedrecords=q.cachedrecords!=undefined?q.cachedrecords:new Array();this.originaldata=new Array();this.recordids=new Array();this.updaterow=q.updaterow!=undefined?q.updaterow:null;this.addrow=q.addrow!=undefined?q.addrow:null;this.deleterow=q.deleterow!=undefined?q.deleterow:null;var h=this;var f=b.datatype;if(b.datatype==="csv"||b.datatype==="tab"||b.datatype=="text"){f="text"}var d=q.async!=undefined?q.async:true;switch(f){case"local":case"array":default:var c=b.localdata.length;this.totalrecords=this.virtualmode?(b.totalrecords||c):c;if(this.totalrecords==undefined){this.totalrecords=0}var n=b.datafields?b.datafields.length:0;var l=function(r,v){var u={};for(j=0;j<v;j++){var s=b.datafields[j];var t="";if(undefined==s||s==null){continue}if(s.map){t=r[s.map];if(t!=undefined&&t!=null){t=t.toString()}else{t=""}}if(t==""){t=r[s.name];if(t!=undefined&&t!=null){t=t.toString()}else{t=""}}t=h.getvaluebytype(t,s);u[s.name]=t}return u};if(!a.isArray(b.localdata)){this.records=new Array();a.each(b.localdata,function(s){if(n>0){var r=this;var t=l(r,n);h.records[h.records.length]=t}else{h.records[h.records.length]=this}})}else{if(n==0){this.records=b.localdata}else{a.each(b.localdata,function(s){var r=this;var t=l(r,n);h.records[h.records.length]=t})}}this.originaldata=b.localdata;this.cachedrecords=this.records;if(q.uniqueDataFields){var p=this.getUniqueRecords(this.records,q.uniqueDataFields);this.records=p;this.cachedrecords=p}if(a.isFunction(q.loadComplete)){q.loadComplete(b.localdata)}break;case"json":case"jsonp":case"xml":case"xhtml":case"script":case"text":if(b.localdata!=null){if(a.isFunction(b.beforeprocessing)){b.beforeprocessing(b.localdata)}if(b.datatype==="xml"){h.loadxml(b.localdata,b.localdata,b)}else{if(f==="text"){h.loadtext(b.localdata,b)}else{h.loadjson(b.localdata,b.localdata,b)}}if(q.uniqueDataFields){var p=h.getUniqueRecords(h.records,q.uniqueDataFields);h.records=p;h.cachedrecords=p}if(a.isFunction(q.loadComplete)){q.loadComplete(b.localdata)}return}var k=q.data!=undefined?q.data:{};if(b.processdata){b.processdata(k)}if(a.isFunction(q.processData)){q.processData(k)}if(a.isFunction(q.formatData)){var m=q.formatData(k);if(m!=undefined){k=m}}var o="application/x-www-form-urlencoded";if(q.contentType){o=q.contentType}var g="GET";if(q.type){g=q.type}a.ajax({dataType:f,type:g,url:b.url,async:d,contentType:o,data:k,success:function(u,r,v){if(a.isFunction(b.beforeprocessing)){b.beforeprocessing(u,r,v)}if(a.isFunction(q.downloadComplete)){q.downloadComplete(u,r,v)}if(u==null){return}var s=u;if(u.records){s=u.records}if(u.totalrecords){b.totalrecords=u.totalrecords}if(b.datatype==="xml"){h.loadxml(null,s,b)}else{if(f==="text"){h.loadtext(s,b)}else{h.loadjson(null,s,b)}}if(q.uniqueDataFields){var t=h.getUniqueRecords(h.records,q.uniqueDataFields);h.records=t;h.cachedrecords=t}h.callDownloadComplete();if(a.isFunction(q.loadComplete)){q.loadComplete(u)}},error:function(t,r,s){if(a.isFunction(b.loaderror)){b.loaderror(t,r,s)}if(a.isFunction(q.loadError)){q.loadError(t,r,s)}t=null;h.callDownloadComplete()},beforeSend:function(s,r){if(a.isFunction(q.beforeSend)){q.beforeSend(s,r)}if(a.isFunction(b.beforesend)){b.beforesend(s,r)}}});break}},getUniqueRecords:function(d,f){if(d&&f){var b=d.length;var l=f.length;var h=new Array();var k=new Array();for(urec=0;urec<b;urec++){var g=d[urec];var e="";for(datafieldindex=0;datafieldindex<l;datafieldindex++){var c=f[datafieldindex];e+=g[c]+"_"}if(!k[e]){h[h.length]=g}k[e]=true}}return h},bindDownloadComplete:function(c,b){this._downloadComplete[this._downloadComplete.length]={id:c,func:b}},unbindDownloadComplete:function(c){for(var b=0;b<this._downloadComplete.length;b++){if(this._downloadComplete[b].id==c){this._downloadComplete[b].func=null;this._downloadComplete.splice(b,1);break}}},callDownloadComplete:function(){for(complete=0;complete<this._downloadComplete.length;complete++){var b=this._downloadComplete[complete];if(b.func!=null){b.func()}}},getid:function(e,c,d){if(a(e,c).length>0){return a(e,c).text()}if(e){if(e.toString().length>0){var b=a(c).attr(e);if(b!=null&&b.toString().length>0){return b}}}return d},loadjson:function(k,m,b){if(typeof(k)=="string"){k=a.parseJSON(k)}if(b.root==undefined){b.root=""}if(b.record==undefined){b.record=""}var k=k||m;if(!k){k=[]}if(b.root!=""){if(k[b.root]!=undefined){k=k[b.root]}else{a.each(k,function(u){var t=this;if(this==b.root){k=this;return false}else{if(this[b.root]!=undefined){k=this[b.root]}}})}}else{if(!k.length){for(obj in k){if(a.isArray(k[obj])){k=k[obj];break}}}}if(k==null||k.length==undefined){alert("JSON Parse error.");return}if(k.length==0){alert("Could not find data records.");return}var e=k.length;this.totalrecords=this.virtualmode?(b.totalrecords||e):e;this.records=new Array();this.originaldata=new Array();var h=this.records;var s=!this.pageable?b.recordstartindex:this.pagesize*this.pagenum;this.recordids=new Array();if(b.loadallrecords){s=0;e=this.totalrecords}var d=0;if(this.virtualmode){s=!this.pageable?b.recordstartindex:this.pagesize*this.pagenum;d=s;s=0;e=this.totalrecords}var r=b.datafields?b.datafields.length:0;if(r==0){var l=k[0];var g=new Array();for(obj in l){var p=obj;g[g.length]={name:p}}b.datafields=g;r=g.length}for(i=s;i<e;i++){var n=k[i];if(n==undefined){break}if(b.record&&b.record!=""){n=n[b.record]}var c=this.getid(b.id,n,i);if(!this.recordids[c]){this.recordids[c]=n;var o={};for(j=0;j<r;j++){var f=b.datafields[j];var q="";if(undefined==f||f==null){continue}if(f.map){q=n[f.map];if(q!=undefined&&q!=null){q=q.toString()}else{q=""}}if(q==""){q=n[f.name];if(q!=undefined&&q!=null){q=q.toString()}else{q=""}}q=this.getvaluebytype(q,f);o[f.name]=q}if(b.recordendindex<=0||s<b.recordendindex){h[d+i]=a.extend({},o);h[d+i].uid=c;this.originaldata[d+i]=a.extend({},h[i])}}}this.records=h;this.cachedrecords=this.records},loadxml:function(p,m,c){if(c.root==undefined){c.root=""}if(c.record==undefined){c.record=""}var p=p||a(c.root+" "+c.record,m);if(!p){p=[]}var f=p.length;if(p.length==0){alert("Could not find xml data records.");return}this.totalrecords=this.virtualmode?(c.totalrecords||f):f;this.records=new Array();this.originaldata=new Array();var k=this.records;var t=!this.pageable?c.recordstartindex:this.pagesize*this.pagenum;this.recordids=new Array();if(c.loadallrecords){t=0;f=this.totalrecords}var e=0;if(this.virtualmode){t=!this.pageable?c.recordstartindex:this.pagesize*this.pagenum;e=t;t=0;f=this.totalrecords}var s=c.datafields?c.datafields.length:0;if(s==0){var l=p[0];var h=new Array();for(obj in l){var q=obj;h[h.length]={name:q}}c.datafields=h;s=h.length}for(i=t;i<f;i++){var n=p[i];if(n==undefined){break}var d=this.getid(c.id,n,i);if(!this.recordids[d]){this.recordids[d]=n;var o={};for(j=0;j<s;j++){var g=c.datafields[j];var r="";if(undefined==g||g==null){continue}if(g.map){r=a(g.map,n).text()}if(r==""){r=a(g.name,n).text()}var b=r;r=this.getvaluebytype(r,g);o[g.name]=r}if(c.recordendindex<=0||t<c.recordendindex){k[e+i]=a.extend({},o);k[e+i].uid=d;this.originaldata[e+i]=a.extend({},k[i])}}}this.records=k;this.cachedrecords=this.records},loadtext:function(k,b){if(k==null){return}var t=b.rowDelimiter||"\n";var s=k.split(t);var e=s.length;this.totalrecords=this.virtualmode?(b.totalrecords||e):e;this.records=new Array();this.originaldata=new Array();var g=this.records;var r=!this.pageable?b.recordstartindex:this.pagesize*this.pagenum;this.recordids=new Array();if(b.loadallrecords){r=0;e=this.totalrecords}var d=0;if(this.virtualmode){r=!this.pageable?b.recordstartindex:this.pagesize*this.pagenum;d=r;r=0;e=this.totalrecords}var o=b.datafields.length;var q=b.columnDelimiter;if(!q){q=(b.datatype==="tab")?"\t":","}for(i=r;i<e;i++){var l=s[i];var c=this.getid(b.id,l,i);if(!this.recordids[c]){this.recordids[c]=l;var m={};var h=s[i].split(q);for(j=0;j<o;j++){if(j>=h.lenght){continue}var f=b.datafields[j];var n=h[j];if(f.type){n=this.getvaluebytype(n,f)}var p=f.map||f.name||j.toSring();m[p]=n}g[d+i]=a.extend({},m);g[d+i].uid=c;this.originaldata[d+i]=a.extend({},g[i])}}this.records=g;this.cachedrecords=this.records},getvaluebytype:function(e,b){var c=e;if(b.type=="date"){var d=new Date(e);if(d.toString()=="NaN"||d.toString()=="Invalid Date"){if(a.jqx.dataFormat){e=a.jqx.dataFormat.tryparsedate(e)}else{e=d}}else{e=d}if(e==null){e=c}}else{if(b.type=="float"||b.type=="number"){var e=parseFloat(e);if(isNaN(e)){e=c}}else{if(b.type=="int"){var e=parseInt(e);if(isNaN(e)){e=c}}else{if(b.type=="bool"){if(e!=null){if(e.toLowerCase()=="false"){e=false}else{if(e.toLowerCase()=="true"){e=true}}}if(e==1){e=true}else{if(e==0){e=false}else{e=""}}}}}}return e}};a.jqx.dataFormat={};a.extend(a.jqx.dataFormat,{regexTrim:/^\s+|\s+$/g,regexInfinity:/^[+-]?infinity$/i,regexHex:/^0x[a-f0-9]+$/i,regexParseFloat:/^[+-]?\d*\.?\d*(e[+-]?\d+)?$/,toString:Object.prototype.toString,isBoolean:function(b){return typeof b==="boolean"},isObject:function(b){return(b&&(typeof b==="object"||a.isFunction(b)))||false},isDate:function(b){return b instanceof Date},arrayIndexOf:function(e,d){if(e.indexOf){return e.indexOf(d)}for(var b=0,c=e.length;b<c;b++){if(e[b]===d){return b}}return -1},isString:function(b){return typeof b==="string"},isNumber:function(b){return typeof b==="number"&&isFinite(b)},isNull:function(b){return b===null},isUndefined:function(b){return typeof b==="undefined"},isValue:function(b){return(this.isObject(b)||this.isString(b)||this.isNumber(b)||this.isBoolean(b))},isEmpty:function(b){if(!this.isString(b)&&this.isValue(b)){return false}else{if(!this.isValue(b)){return true}}b=a.trim(b).replace(/\&nbsp\;/ig,"").replace(/\&#160\;/ig,"");return b===""},startsWith:function(c,b){return c.indexOf(b)===0},endsWith:function(c,b){return c.substr(c.length-b.length)===b},trim:function(b){return(b+"").replace(this.regexTrim,"")},isArray:function(b){return this.toString.call(b)==="[object Array]"},defaultcalendar:function(){var b={"/":"/",":":":",firstDay:0,days:{names:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],namesAbbr:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],namesShort:["Su","Mo","Tu","We","Th","Fr","Sa"]},months:{names:["January","February","March","April","May","June","July","August","September","October","November","December",""],namesAbbr:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",""]},AM:["AM","am","AM"],PM:["PM","pm","PM"],eras:[{name:"A.D.",start:null,offset:0}],twoDigitYearMax:2029,patterns:{d:"M/d/yyyy",D:"dddd, MMMM dd, yyyy",t:"h:mm tt",T:"h:mm:ss tt",f:"dddd, MMMM dd, yyyy h:mm tt",F:"dddd, MMMM dd, yyyy h:mm:ss tt",M:"MMMM dd",Y:"yyyy MMMM",S:"yyyy\u0027-\u0027MM\u0027-\u0027dd\u0027T\u0027HH\u0027:\u0027mm\u0027:\u0027ss",ISO:"yyyy-mm-dd hh:mm:ss"},percentsymbol:"%",currencysymbol:"$",currencysymbolposition:"before",decimalseparator:".",thousandsseparator:","};return b},expandFormat:function(f,e){e=e||"F";var d,c=f.patterns,b=e.length;if(b===1){d=c[e];if(!d){throw"Invalid date format string '"+e+"'."}e=d}else{if(b===2&&e.charAt(0)==="%"){e=e.charAt(1)}}return e},getEra:function(d,c){if(!c){return 0}var g,f=d.getTime();for(var e=0,b=c.length;e<b;e++){g=c[e].start;if(g===null||f>=g){return e}}return 0},toUpper:function(b){return b.split("\u00A0").join(" ").toUpperCase()},toUpperArray:function(b){var e=[];for(var d=0,c=b.length;d<c;d++){e[d]=toUpper(b[d])}return e},getEraYear:function(c,e,b,f){var d=c.getFullYear();if(!f&&e.eras){d-=e.eras[b].offset}return d},getDayIndex:function(f,e,c){var b,g=f.days,d=f._upperDays;if(!d){f._upperDays=d=[toUpperArray(g.names),toUpperArray(g.namesAbbr),toUpperArray(g.namesShort)]}e=toUpper(e);if(c){b=this.arrayIndexOf(d[1],e);if(b===-1){b=this.arrayIndexOf(d[2],e)}}else{b=this.arrayIndexOf(d[0],e)}return b},getMonthIndex:function(k,h,d){var b=k.months,c=k.monthsGenitive||k.months,f=k._upperMonths,g=k._upperMonthsGen;if(!f){k._upperMonths=f=[toUpperArray(b.names),toUpperArray(b.namesAbbr)];k._upperMonthsGen=g=[toUpperArray(c.names),toUpperArray(c.namesAbbr)]}h=toUpper(h);var e=this.arrayIndexOf(d?f[1]:f[0],h);if(e<0){e=this.arrayIndexOf(d?g[1]:g[0],h)}return e},appendPreOrPostMatch:function(f,b){var e=0,h=false;for(var g=0,d=f.length;g<d;g++){var k=f.charAt(g);switch(k){case"'":if(h){b.push("'")}else{e++}h=false;break;case"\\":if(h){b.push("\\")}h=!h;break;default:b.push(k);h=false;break}}return e},getTokenRegExp:function(){return/\/|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z|gg|g/g},formatlink:function(b,d){var c="";if(d&&d.target){c="target="+d.target}if(c!=""){return"<a "+c+' href="'+b+'">'+b+"</a>"}return'<a href="'+b+'">'+b+"</a>"},formatemail:function(b){return'<a href="mailto:'+b+'">'+b+"</a>"},formatnumber:function(q,p,l){if(l==undefined||l==null){l=this.defaultcalendar()}if(!this.isNumber(q)){q*=1}var m;if(p.length>1){m=parseInt(p.slice(1),10)}var s={};var n=p.charAt(0).toUpperCase();s.thousandsSeparator=l.thousandsseparator;s.decimalSeparator=l.decimalseparator;switch(n){case"D":case"d":case"F":case"f":s.decimalPlaces=m;break;case"N":case"n":s.decimalPlaces=0;break;case"C":case"c":s.decimalPlaces=m;if(l.currencysymbolposition=="before"){s.prefix=l.currencysymbol}else{s.suffix=l.currencysymbol}break;case"P":case"p":s.suffix=l.percentagesymbol;break;default:throw"Bad number format specifier: "+n}if(this.isNumber(q)){var f=(q<0);var d=q+"";var o=(s.decimalSeparator)?s.decimalSeparator:".";var b;if(this.isNumber(s.decimalPlaces)){var g=s.decimalPlaces;var k=Math.pow(10,g);d=Math.round(q*k)/k+"";b=d.lastIndexOf(".");if(g>0){if(b<0){d+=o;b=d.length-1}else{if(o!=="."){d=d.replace(".",o)}}while((d.length-1-b)<g){d+="0"}}}if(s.thousandsSeparator){var r=s.thousandsSeparator;b=d.lastIndexOf(o);b=(b>-1)?b:d.length;var e=d.substring(b);var c=-1;for(var h=b;h>0;h--){c++;if((c%3===0)&&(h!==b)&&(!f||(h>1))){e=r+e}e=d.charAt(h-1)+e}d=e}d=(s.prefix)?s.prefix+d:d;d=(s.suffix)?d+s.suffix:d;return d}else{return q}},tryparsedate:function(c,d){if(d==undefined||d==null){d=this.defaultcalendar()}var b=this;patterns=d.patterns;for(prop in patterns){date=b.parsedate(c,patterns[prop],d);if(date){return date}}return null},getparseregexp:function(b,p){var r=b._parseRegExp;if(!r){b._parseRegExp=r={}}else{var f=r[p];if(f){return f}}var o=this.expandFormat(b,p).replace(/([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g,"\\\\$1"),l=["^"],c=[],k=0,e=0,u=this.getTokenRegExp(),g;while((g=u.exec(o))!==null){var t=o.slice(k,g.index);k=u.lastIndex;e+=this.appendPreOrPostMatch(t,l);if(e%2){l.push(g[0]);continue}var d=g[0],h=d.length,q;switch(d){case"dddd":case"ddd":case"MMMM":case"MMM":case"gg":case"g":q="(\\D+)";break;case"tt":case"t":q="(\\D*)";break;case"yyyy":case"fff":case"ff":case"f":q="(\\d{"+h+"})";break;case"dd":case"d":case"MM":case"M":case"yy":case"y":case"HH":case"H":case"hh":case"h":case"mm":case"m":case"ss":case"s":q="(\\d\\d?)";break;case"zzz":q="([+-]?\\d\\d?:\\d{2})";break;case"zz":case"z":q="([+-]?\\d\\d?)";break;case"/":q="(\\"+b["/"]+")";break;default:throw"Invalid date format pattern '"+d+"'.";break}if(q){l.push(q)}c.push(g[0])}this.appendPreOrPostMatch(o.slice(k),l);l.push("$");var s=l.join("").replace(/\s+/g,"\\s+"),n={regExp:s,groups:c};return r[p]=n},outOfRange:function(d,b,c){return d<b||d>c},expandYear:function(g,e){var c=new Date(),b=getEra(c);if(e<100){var d=g.twoDigitYearMax;d=typeof d==="string"?new Date().getFullYear()%100+parseInt(d,10):d;var f=this.getEraYear(c,g,b);e+=f-(f%100);if(e>d){e-=100}}return e},parsedate:function(z,G,u){if(u==undefined||u==null){u=this.defaultcalendar()}z=this.trim(z);var r=u,L=this.getparseregexp(r,G),k=new RegExp(L.regExp).exec(z);if(k===null){return null}var H=L.groups,x=null,p=null,K=null,J=null,q=null,g=0,C,B=0,I=0,b=0,d=null,s=false;for(var D=0,F=H.length;D<F;D++){var c=k[D+1];if(c){var y=H[D],f=y.length,h=parseInt(c,10);switch(y){case"dd":case"d":J=h;if(this.outOfRange(J,1,31)){return null}break;case"MMM":case"MMMM":K=this.getMonthIndex(r,c,f===3);if(this.outOfRange(K,0,11)){return null}break;case"M":case"MM":K=h-1;if(this.outOfRange(K,0,11)){return null}break;case"y":case"yy":case"yyyy":p=f<4?this.expandYear(r,h):h;if(this.outOfRange(p,0,9999)){return null}break;case"h":case"hh":g=h;if(g===12){g=0}if(this.outOfRange(g,0,11)){return null}break;case"H":case"HH":g=h;if(this.outOfRange(g,0,23)){return null}break;case"m":case"mm":B=h;if(this.outOfRange(B,0,59)){return null}break;case"s":case"ss":I=h;if(this.outOfRange(I,0,59)){return null}break;case"tt":case"t":s=r.PM&&(c===r.PM[0]||c===r.PM[1]||c===r.PM[2]);if(!s&&(!r.AM||(c!==r.AM[0]&&c!==r.AM[1]&&c!==r.AM[2]))){return null}break;case"f":case"ff":case"fff":b=h*Math.pow(10,3-f);if(this.outOfRange(b,0,999)){return null}break;case"ddd":case"dddd":q=this.getDayIndex(r,c,f===3);if(this.outOfRange(q,0,6)){return null}break;case"zzz":var e=c.split(/:/);if(e.length!==2){return null}C=parseInt(e[0],10);if(this.outOfRange(C,-12,13)){return null}var n=parseInt(e[1],10);if(this.outOfRange(n,0,59)){return null}d=(C*60)+(startsWith(c,"-")?-n:n);break;case"z":case"zz":C=h;if(this.outOfRange(C,-12,13)){return null}d=C*60;break;case"g":case"gg":var t=c;if(!t||!r.eras){return null}t=trim(t.toLowerCase());for(var E=0,A=r.eras.length;E<A;E++){if(t===r.eras[E].name.toLowerCase()){x=E;break}}if(x===null){return null}break}}}var o=new Date(),w,m=r.convert;w=o.getFullYear();if(p===null){p=w}else{if(r.eras){p+=r.eras[(x||0)].offset}}if(K===null){K=0}if(J===null){J=1}if(m){o=m.toGregorian(p,K,J);if(o===null){return null}}else{o.setFullYear(p,K,J);if(o.getDate()!==J){return null}if(q!==null&&o.getDay()!==q){return null}}if(s&&g<12){g+=12}o.setHours(g,B,I,b);if(d!==null){var v=o.getMinutes()-(d+o.getTimezoneOffset());o.setHours(o.getHours()+parseInt(v/60,10),v%60)}return o},cleardatescache:function(){this.datescache=new Array()},formatdate:function(w,A,r){if(r==undefined||r==null){r=this.defaultcalendar()}var e=w.toString()+"_"+A;if(this.datescache&&this.datescache[e]){return this.datescache[e]}if(!A||!A.length||A==="i"){var C;C=this.formatDate(w,r.patterns.F,culture);return C}var x=r.eras,c=A==="s";A=this.expandFormat(r,A);C=[];var h,y=["0","00","000"],n,o,b=/([^d]|^)(d|dd)([^d]|$)/g,B=0,t=this.getTokenRegExp(),d;function l(D,G){var F,E=D+"";if(G>1&&E.length<G){F=(y[G-2]+E);return F.substr(F.length-G,G)}else{F=E}return F}function z(){if(n||o){return n}n=b.test(A);o=true;return n}function f(E,D){if(d){return d[D]}switch(D){case 0:return E.getFullYear();case 1:return E.getMonth();case 2:return E.getDate()}}for(;;){var k=t.lastIndex,s=t.exec(A);var p=A.slice(k,s?s.index:A.length);B+=this.appendPreOrPostMatch(p,C);if(!s){break}if(B%2){C.push(s[0]);continue}var u=s[0],g=u.length;switch(u){case"ddd":case"dddd":var q=(g===3)?r.days.namesAbbr:r.days.names;C.push(q[w.getDay()]);break;case"d":case"dd":n=true;C.push(l(f(w,2),g));break;case"MMM":case"MMMM":var v=f(w,1);C.push(r.months[g===3?"namesAbbr":"names"][v]);break;case"M":case"MM":C.push(l(f(w,1)+1,g));break;case"y":case"yy":case"yyyy":v=this.getEraYear(w,r,this.getEra(w,x),c);if(g<4){v=v%100}C.push(l(v,g));break;case"h":case"hh":h=w.getHours()%12;if(h===0){h=12}C.push(l(h,g));break;case"H":case"HH":C.push(l(w.getHours(),g));break;case"m":case"mm":C.push(l(w.getMinutes(),g));break;case"s":case"ss":C.push(l(w.getSeconds(),g));break;case"t":case"tt":v=w.getHours()<12?(r.AM?r.AM[0]:" "):(r.PM?r.PM[0]:" ");C.push(g===1?v.charAt(0):v);break;case"f":case"ff":case"fff":C.push(l(w.getMilliseconds(),3).substr(0,g));break;case"z":case"zz":h=w.getTimezoneOffset()/60;C.push((h<=0?"+":"-")+l(Math.floor(Math.abs(h)),g));break;case"zzz":h=w.getTimezoneOffset()/60;C.push((h<=0?"+":"-")+l(Math.floor(Math.abs(h)),2)+":"+l(Math.abs(w.getTimezoneOffset()%60),2));break;case"g":case"gg":if(r.eras){C.push(r.eras[getEra(w,x)].name)}break;case"/":C.push(r["/"]);break;default:throw"Invalid date format pattern '"+u+"'.";break}}var m=C.join("");if(!this.datescache){this.datescache=new Array()}this.datescache[e]=m;return m}})})(jQuery);