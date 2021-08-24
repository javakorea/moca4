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
<link rel="shortcut icon" href="/to/moca/images/favis.png">

<META http-equiv="Expires" content="-1">
<META http-equiv="Pragma" content="no-cache">
<META http-equiv="Cache-Control" content="No-Cache">
<script language="JavaScript" src="/to/moca/js/jquery-3.3.1.min.js"></script>
<script type="text/javascript" src="/to/moca/js/sha512.min.js"></script>
<script language="JavaScript" src="/to/moca/js/config.js"></script>
<script language="JavaScript" src="/to/moca/js/moca.js"></script>
<script type="text/javascript" src="/to/moca/js/moca_ui.js"></script>
<script type="text/javascript" src="/to/ckeditor/ckeditor.js"></script>
<script>
var moca = new Moca();
var param = {};
<%
	java.util.Enumeration en = request.getParameterNames();
	while(en.hasMoreElements()){
		String key = (String)en.nextElement();
		String val = java.net.URLDecoder.decode(request.getParameter(key),"UTF-8");
%>
param['<%=key%>'] = '<%=val%>';
<%
	}
%>
</script>
<style>
	
	.button.esc:hover{opacity:1}
</style>
</head>
   <body>
	<div class="moca_wrap">
		<div type="wframe"  id="__popup" tag="moca:body" src="<%=mcsrc2%>" popupId="<%=request.getParameter("__popid")%>" popupTitle="<%=java.net.URLDecoder.decode(request.getParameter("__title"),"UTF-8")%>"></div>
		<div class="toast_msg" style="padding:9px 15px; height:35px">
			<!-- <p>조회가 완료되었습니다.</p> -->
		</div>
		<button class="button btn_esc" type="button" onclick="self.close()" >닫기</button>
	</div>
</body>
</html>