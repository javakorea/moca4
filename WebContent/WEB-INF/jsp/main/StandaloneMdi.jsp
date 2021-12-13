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

<link rel="stylesheet" type="text/css" href="/moca/css/moca.css?v=1.1">
<link rel="stylesheet" type="text/css" href="/moca/css/fontawesome.css?v=1">
<link rel="stylesheet" type="text/css" href="/moca/css/moca_layout.css?v=1">
<link rel="stylesheet" type="text/css" href="/fullcalendar/lib/fullcalendar.css?v=1">
<%
if(userAgent.indexOf("MOBI") > -1 || userAgent.indexOf("IPHONE") > -1   || userAgent.indexOf("ANDROID") > -1) {
%>
	<link rel="stylesheet" type="text/css" href="/moca/css/moca_mobile.css?v=1.1">
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




var $m = new Moca();
$m.menuObjs_ori = {};
$m.menuObjs = {};
$m.menu = [];
$m.shortcut = [];
$m.shortcut2 = [];
$m.keyboard = {};

$(document).ready(function() {
    var _fileName = $m.getFileNameFromUrl(param.mcsrc);
    var _srcId = _fileName.substring(0,_fileName.indexOf('.'));
    
    var _if_url = $m._contextRoot+param.mcsrc+"?";
	var params = Object.keys(param);
	for(var i=0; i < params.length; i++){
		var key = params[i];
		if(key != 'mcsrc' && key != 'label'){
			var val = param[key];
			_if_url += key+"="+val+"&";
		}
	}
	//alert(_if_url);
    $m.openMdi(_if_url,_srcId,param.label,'',"mdi_1");
    $m.setPageHeader($(this).find('#titbox'),param.label);
});
</script>
</head>
   <body>
	<div class="moca_wrap iframe">
		<div class="moca_container on flex">		
			<div type="include" style="position:relative" class="fauto" id="mdi" tag="moca:mdi" src="/moca/comm/iframeMdi.html"></div>
		</div>
	</div>
</body>
</html>