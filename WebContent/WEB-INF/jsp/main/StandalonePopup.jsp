<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" session="false"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ui" uri="http://egovframework.gov/ctl/ui"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%
	String mcsrc1 = request.getParameter("mcsrc");
	String mcsrc2 = (String)request.getAttribute("mcsrc");
	response.setHeader("X-Frame-Options", "ALLOW-FROM http://220.78.29.171:8080");
%>
<!DOCTYPE html>
<html lang="ko">
<head>
<title>teammoca ERP</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" ksc="MOZILLA/5.0 (LINUX; ANDROID 6.0; NEXUS 5 BUILD/MRA58N) APPLEWEBKIT/537.36 (KHTML, LIKE GECKO) CHROME/93.0.4577.82 MOBILE SAFARI/537.36">
<link rel="shortcut icon" href="/moca/images/favis.png">

<META http-equiv="Expires" content="-1">
<META http-equiv="Pragma" content="no-cache">
<META http-equiv="Cache-Control" content="No-Cache">
<link rel="stylesheet" type="text/css" href="/moca/css/moca.css?v=1.11">
<link rel="stylesheet" type="text/css" href="/moca/css/fontawesome.css?v=1">
<link rel="stylesheet" type="text/css" href="/moca/css/moca_layout.css?v=1">
<%
String userAgent = request.getHeader("User-Agent").toUpperCase();
System.out.println("userAgent:"+userAgent+":");
%>
<%
if(userAgent.indexOf("MOBI") > -1 || userAgent.indexOf("IPHONE") > -1   || userAgent.indexOf("ANDROID") > -1) {
%>
	<link rel="stylesheet" type="text/css" href="/moca/css/moca_mobile.css?v=1.12">
<%	
}
%>
<link rel="stylesheet" type="text/css" href="/fullcalendar/lib/fullcalendar.css?v=1">

<script language="JavaScript" src="/moca/js/jquery-3.3.1.min.js"></script>
<script type="text/javascript" src="/moca/js/sha512.min.js"></script>
<script language="JavaScript" src="/moca/js/config.js"></script>
<script language="JavaScript" src="/moca/js/moca.js"></script>
<script type="text/javascript" src="/moca/js/moca_ui.js"></script>
<script type="text/javascript" src="/ckeditor/ckeditor.js"></script>
<script type="text/javascript" src="/fullcalendar/lib/fullcalendar.js"></script>
<script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>

<script>
var $m = new Moca();
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

$(document).ready(function(args) {
	//$m.popClose($('#'+param['__popid'],opener.document));
	$('#'+param['__popid'],opener.document).hide();
	
	/*
	$('.moca_wrap').html('');
	$('#'+param['__popid'],opener.document).find('.moca_popup').css({
		'top':0,
		'left':0
	});
	var arr = Object.keys(opener.CKEDITOR.instances);
	for(var i=0; i < arr.length; i++){
		opener.CKEDITOR.instances[arr[i]].destroy();
	}
	
	var srcid = $('#'+param['__popid'],opener.document).find('[srcid]').attr('srcid');
	$m[srcid].args = opener.$m[srcid].args;
	alert();debugger;
	var targetObj = $('#'+param['__popid'],opener.document).clone();
	var scriptContents = targetObj.find('script').html();
	$('.moca_wrap').append(targetObj);
	$('.moca_wrap').find('script').html(scriptContents);
	*/
});
</script>
<style>
	.button.esc:hover{opacity:1}
</style>
</head>
	<body onunload="$m.popUnload();">
		<div>
			<div type="include"  id="__popup" tag="moca:body" src="<%=mcsrc2%>" 
			popupId="<%=paramMap.get("__popid")%>"  
			popupTitle="<%=paramMap.get("__title")%>"></div>   
			<div class="toast_msg" style="padding:9px 15px; height:35px">
				<!-- <p>조회가 완료되었습니다.</p> -->
			</div>
			<!-- <button class="button btn_esc" type="button" onclick="self.close()" >닫기</button> -->
		</div>
	</body>
</html>