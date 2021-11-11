<%--
  Class Name : EgovMainView.jsp 
  Description : 메인화면
  Modification Information
 
      수정일         수정자                   수정내용
    -------    --------    ---------------------------
     2011.08.31   JJY       경량환경 버전 생성
 
    author   : 실행환경개발팀 JJY
    since    : 2011.08.31 
--%>
<%@ page contentType="text/html; charset=utf-8"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ui" uri="http://egovframework.gov/ctl/ui"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%  
response.setHeader("Cache-Control","no-store");  
response.setHeader("Pragma","no-cache");  
response.setDateHeader("Expires",0);  
if (request.getProtocol().equals("HTTP/1.1"))
        response.setHeader("Cache-Control", "no-cache");
%>  
<!DOCTYPE html>
<html lang="ko">
<head>
<title>teammoca ERP</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">


<%
String userAgent = request.getHeader("User-Agent").toUpperCase();
System.out.println("userAgent:"+userAgent+":");
if(userAgent.indexOf("MOBI") > -1 || userAgent.indexOf("IPHONE") > -1   || userAgent.indexOf("ANDROID") > -1) {
%>
	<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" ksc="<%=userAgent%>">
<%	
}
%>



<link rel="shortcut icon" href="/moca/images/favis.png">

<META http-equiv="Expires" content="-1">
<META http-equiv="Pragma" content="no-cache">
<META http-equiv="Cache-Control" content="No-Cache">

<link rel="stylesheet" type="text/css" href="/moca/css/moca.css">
<link rel="stylesheet" type="text/css" href="/moca/css/fontawesome.css">
<link rel="stylesheet" type="text/css" href="/moca/css/moca_layout.css">
<link rel="stylesheet" type="text/css" href="/fullcalendar/lib/fullcalendar.css">
<%
if(userAgent.indexOf("MOBI") > -1 || userAgent.indexOf("IPHONE") > -1   || userAgent.indexOf("ANDROID") > -1) {
%>
	<link rel="stylesheet" type="text/css" href="/moca/css/moca_mobile.css">
<%	
}
%>
<script language="JavaScript" src="/moca/js/jquery-3.3.1.min.js"></script>
<script type="text/javascript" src="/moca/js/sha512.min.js"></script>
<script language="JavaScript" src="/moca/js/config.js"></script>
<script language="JavaScript" src="/moca/js/moca.js"></script>
<script type="text/javascript" src="/moca/js/moca_ui.js"></script>
<script type="text/javascript" src="/ckeditor/ckeditor.js"></script>
<script type="text/javascript" src="/fullcalendar/lib/fullcalendar.js"></script>

<script>

var param = {};

<%
	java.util.Map paramMap = new java.util.HashMap();   
	java.util.Enumeration en = request.getParameterNames();
	while(en.hasMoreElements()){
		try{
			String key = (String)en.nextElement();
			System.out.println("--------------------->33key"+key+","+request.getParameter(key)); 
			if(request.getParameter(key) != null && !"".equals(request.getParameter(key))){
				String val = java.net.URLDecoder.decode(request.getParameter(key),"UTF-8");
				paramMap.put(key,val);
%>
				param['<%=key%>'] = '<%=val%>';
<%
			}	
		}catch(Exception e){
			System.out.println("==============="+e);
		}
	}
	System.out.println("--------------------->paramMap-->"+paramMap);
%> 




var moca = new Moca();
moca.menuObjs_ori = {};
moca.menuObjs = {};
moca.menu = [];
moca.shortcut = [];
moca.shortcut2 = [];
moca.keyboard = {};

$(document).ready(function() {
	$('body').attr("spellcheck",false);
	moca.menuObjs_ori = JSON.parse( JSON.stringify( moca.menuObjs ) );
	
    window.addEventListener("keydown",function(event){
        event.stopPropagation();
    })
	$(document).keydown(function(e) {
		if(event.srcElement.tagName != 'INPUT'){
			if(moca.nowGrd != null){
				//그리드 위아래 키 이벤트
				var selectedRealRowIndex = moca.nowGrd.getAttribute("selectedRealRowIndex");
				var reIndex = 0;
				if(event.which == '40' || event.which == '38' ){
					if(event.which == '40'){ //up키
						reIndex = Number(selectedRealRowIndex)+1;
						if(reIndex > moca.nowGrd.list.length-1){
							reIndex = moca.nowGrd.list.length-1;
						}
					}else if(event.which == '38'){ //down키
						reIndex = Number(selectedRealRowIndex)-1;
						if(reIndex < 0){
							reIndex = 0;
						}
					}
					moca.nowGrd.setAttribute("selectedRealRowIndex",reIndex);
					moca._setRowSelection(moca.nowGrd);
					if($(moca.nowGrd).attr('onrowselected')){
						var nowColTd = $(moca.nowGrd).find('td[id='+moca.nowColId+']')[selectedRealRowIndex];
						eval($(moca.nowGrd).attr('onrowselected'))(moca.nowGrd,selectedRealRowIndex,nowColTd,moca.nowGrd);
					}
					
				}
				if(event.which == '13'){ //enter
					if($(moca.nowGrd).attr('ondblclick')){
						var nowColTd = $(moca.nowGrd).find('td[id='+moca.nowColId+']')[selectedRealRowIndex];
						eval($(moca.nowGrd).attr('ondblclick'))(moca.nowGrd,selectedRealRowIndex,nowColTd,moca.nowGrd);
					}
				}
			}
			

			
			
			event.stopImmediatePropagation();
			if(111 < event.which && event.which < 124 && event.which != 116){//Function Key일경우
				e.preventDefault();
				menuId = moca.keyboard['F'+ (event.which-111)];
				$('.leaf.active').removeClass('active');
				moca.tree_click(menuId);
				$('.leaf.active').parent().parent().addClass('moca_tree_open');
			}else{
			    if(event.which != 16 && event.which != 17 && event.which != 18){
			    	var menuId = '';
			    	if( event.shiftKey && event.ctrlKey) {
			    		return;
			    	}else if( event.shiftKey ) {
			        	e.preventDefault();
			        	menuId = moca.keyboard[("SHIFT+"+String.fromCharCode(event.which)).toUpperCase()];
			        }else if( event.ctrlKey ) {
			        	var c = String.fromCharCode(event.which).toUpperCase();
			        	if(c == "C" || c == "V"){
			        		return;
			        	}else{
				        	e.preventDefault();
				        	menuId = moca.keyboard[("CTRL+"+ c)];		        		
			        	}
			        }else if( event.altKey ) {
			        	e.preventDefault();
			        	menuId = moca.keyboard[("ALT+"+String.fromCharCode(event.which)).toUpperCase()];
			        }else if(!event.shiftKey && !event.ctrlKey && !event.altKey){
			        	menuId = moca.keyboard[String.fromCharCode(event.which)];
			        }  
			    	
			        if(menuId != null){
			        	$('.leaf.active').removeClass('active');
			        	moca.tree_click(menuId);
			        	$('.leaf.active').parent().parent().addClass('moca_tree_open');
			        }
			    }
			}	
		}
	});
	    
	
    //moca.tree_click("li4020000","mdi_1");
    
    var _fileName = moca.getFileNameFromUrl(param.mcsrc);
    var _srcId = _fileName.substring(0,_fileName.indexOf('.'));
    
    var _if_url = moca._contextRoot+param.mcsrc+"?";
	var params = Object.keys(param);
	for(var i=0; i < params.length; i++){
		var key = params[i];
		if(key != 'mcsrc'){
			var val = param[key];
			_if_url += key+"="+val+"&";
		}
	}
	alert(_if_url);
    moca.openMdi(_if_url,_srcId,_srcId,'',"mdi_1");
});
</script>
</head>
   <body>
	<div class="moca_wrap iframe">
		<div class="moca_container on flex">		
			<div type="wframe" style="position:relative" class="fauto" id="mdi" tag="moca:mdi" src="/moca/comm/iframeMdi.html"></div>
		</div>
	</div>
</body>
</html>