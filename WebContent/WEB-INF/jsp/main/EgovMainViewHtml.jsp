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

<link rel="stylesheet" type="text/css" href="/moca/css/moca.css?v=1">
<link rel="stylesheet" type="text/css" href="/moca/css/fontawesome.css?v=1">
<link rel="stylesheet" type="text/css" href="/moca/css/moca_layout.css?v=1">
<%
if(userAgent.indexOf("MOBI") > -1 || userAgent.indexOf("IPHONE") > -1   || userAgent.indexOf("ANDROID") > -1) {
%>
	<link rel="stylesheet" type="text/css" href="/moca/css/moca_mobile.css?v=1">
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
<%
	String authorCodeString= (String)request.getAttribute("authorCode");
	java.util.List menuList= (java.util.List)request.getAttribute("menuList");
	System.out.println("menuList:"+menuList);
	/*
	menuList:[{menuNo=1000000, menuOrdr=1, menuNm=접수/등록관리, upperMenuId=0, depth=1, menuDc=접수/등록관리, relateImageNm=/, relateImagePath=/, progrmFileNm=dir, chk=1}, 
	            {menuNo=1010000, menuOrdr=1, menuNm=접수등록관리, upperMenuId=1000000, depth=2, menuDc=접수동륵관리, relateImageNm=/, relateImagePath=/, progrmFileNm=EFL_RECP, chk=1}, 
	            {menuNo=1020000, menuOrdr=2, menuNm=메일발송내역, upperMenuId=1000000, depth=2, menuDc=메일발송내역, relateImageNm=/, relateImagePath=/, progrmFileNm=EFL_MAIL, chk=1}, {menuNo=2000000, menuOrdr=2, menuNm=파일관리, upperMenuId=0, depth=1, menuDc=직급체계관리, relateImageNm=/, relateImagePath=/, progrmFileNm=dir, chk=1}, {menuNo=2010000, menuOrdr=1, menuNm=통제별파일조회, upperMenuId=2000000, depth=2, menuDc=통제별파일조회, relateImageNm=/, relateImagePath=/, progrmFileNm=EFL_CAFL, chk=1}, {menuNo=3000000, menuOrdr=3, menuNm=파일출납현황, upperMenuId=0, depth=1, menuDc=파일출납현황, relateImageNm=/, relateImagePath=/, progrmFileNm=dir, chk=1}, {menuNo=3010000, menuOrdr=1, menuNm=사용자출납현황, upperMenuId=3000000, depth=2, menuDc=사용자출납현황, relateImageNm=/, relateImagePath=/, progrmFileNm=EFL_OUTU, chk=1}, {menuNo=3020000, menuOrdr=2, menuNm=시스템출납현황, upperMenuId=3000000, depth=2, menuDc=시스템출납현황, relateImageNm=/, relateImagePath=/, progrmFileNm=EFL_OUTS, chk=1}, {menuNo=4000000, menuOrdr=4, menuNm=기준정보관리, upperMenuId=0, depth=1, menuDc=근태관리, relateImageNm=/, relateImagePath=/, progrmFileNm=dir, chk=0}, {menuNo=4010000, menuOrdr=1, menuNm=사용자관리, upperMenuId=4000000, depth=2, menuDc=사용자관리, relateImageNm=/, relateImagePath=/, progrmFileNm=EFC_USER, chk=0}, {menuNo=4020000, menuOrdr=2, menuNm=권한관리, upperMenuId=4000000, depth=2, menuDc=권한관리, relateImageNm=/, relateImagePath=, progrmFileNm=EFC_AUTH, chk=0}, {menuNo=4030000, menuOrdr=3, menuNm=법인목록, upperMenuId=4000000, depth=2, menuDc=법인목록, relateImageNm=/, relateImagePath=/, progrmFileNm=EFC_CORP, chk=0}, {menuNo=4040000, menuOrdr=4, menuNm=업무시스템목록, upperMenuId=4000000, depth=2, menuDc=업무시스템목록, relateImageNm=/, relateImagePath=, progrmFileNm=EFC_SYST, chk=0}, {menuNo=4050000, menuOrdr=5, menuNm=모집단관리, upperMenuId=4000000, depth=2, menuDc=모집단관리, relateImageNm=/, relateImagePath=/, progrmFileNm=EFC_POPU, chk=0}, {menuNo=4060000, menuOrdr=6, menuNm=통제항목관리, upperMenuId=4000000, depth=2, menuDc=통제항목관리, relateImageNm=, relateImagePath=/, progrmFileNm=EFL_MSCA, chk=0}, {menuNo=4070000, menuOrdr=7, menuNm=공통코드관리, upperMenuId=4000000, depth=2, menuDc=공통코드관리, relateImageNm=/, relateImagePath=, progrmFileNm=EFC_CODE, chk=0}, {menuNo=4080000, menuOrdr=8, menuNm=메뉴관리, upperMenuId=4000000, depth=2, menuDc=메뉴관리, relateImageNm=/, relateImagePath=/, progrmFileNm=EFC_MENU, chk=0}, {menuNo=4090000, menuOrdr=9, menuNm=프로그램관리, upperMenuId=4000000, depth=2, menuDc=프로그램관리, relateImageNm=/, relateImagePath=/, progrmFileNm=EFC_PROG, chk=0}, {menuNo=6000000, menuOrdr=6, menuNm=시스템설정, upperMenuId=0, depth=1, menuDc=시스템설정, relateImageNm=/, relateImagePath=/, progrmFileNm=dir, chk=0}, {menuNo=6010000, menuOrdr=1, menuNm=시스템설정, upperMenuId=6000000, depth=2, menuDc=시스템설정, relateImageNm=/, relateImagePath=/, progrmFileNm=EFC_PROP, chk=0}, {menuNo=6020000, menuOrdr=2, menuNm=사용자로그, upperMenuId=6000000, depth=2, menuDc=사용자로그, relateImageNm=/, relateImagePath=/, progrmFileNm=EFC_ULOG, chk=0}, {menuNo=6030000, menuOrdr=3, menuNm=ICPRO-시스템출납팝업샘플, upperMenuId=6000000, depth=2, menuDc=ICPRO-시스템출납팝업, relateImageNm=/, relateImagePath=/, progrmFileNm=EFL_OUTS_POP, chk=0}]
			
	*/		
			
%>
<script>
var moca = new Moca();
moca.menuObjs_ori = {};
moca.menuObjs = {};
moca.menu = [];
moca.shortcut = [];
moca.shortcut2 = [];
moca.keyboard = {};

moca.setSession("authorCode",'<%=authorCodeString%>');
$(document).ready(function() {
	$('body').attr("spellcheck",false);
	<%
	
		for(int i=0; i < menuList.size(); i++){
			java.util.Map row = (java.util.Map)menuList.get(i);
			String depth = row.get("depth").toString(); 
			
			if("1".equals(depth)){
				String open_close = "close";
				if(i==0){
					open_close = "open";
				}
	%>
				moca.menu.push({cd: "<%=row.get("menuNo").toString()%>", nm: "<%=row.get("menuNm").toString()%>", level:<%=row.get("depth").toString()%>,open_close:"<%=open_close%>", shortCut:"<%=row.get("shortcut")%>", url:"<%=row.get("progrmStrePath").toString()%>"});
				moca.menuObjs["<%=row.get("menuNo").toString()%>"] = [];			
				<%-- ////depth1 단축키///
				var a = '<%=row.get("shortcut")%>';
				var array = a.split("+");
				var isPlus = a.indexOf("+");
				var c = '';
				if(isPlus > -1){
					c = '<span class="shortcut"><i>'+array[0].replace(/\s/g,'')+'</i>+<i>'+array[1].replace(/\s/g,'')+'</i></span>';
				}else if(array[0] != null && a != 'null' && a != ''){
					c = '<span class="shortcut"><i>'+array[0].replace(/\s/g,'')+'</i></span>';		
				};
				moca.shortcut2.push({key: '<%=row.get("menuNm").toString()%>',val:c});
				///////////////////// --%>
	<%			
			}else{
	%>
				moca.menuObjs["<%=row.get("upperMenuNo").toString()%>"].push({cd: "<%=row.get("menuNo").toString()%>", nm: "<%=row.get("menuNm").toString()%>", level: <%=row.get("depth").toString()%>, url:"<%=row.get("progrmStrePath").toString()%>", fromDate:"<%=row.get("fromdate")%>", toDate:"<%=row.get("todate")%>", shortCut:"<%=row.get("shortcut")%>"});			
				//단축키데이터객체만들기//////////////////////////////////////////////////////////////////////////
				var a = '<%=row.get("shortcut")%>';
				var array = a.split("+");
				var isPlus = a.indexOf("+");
				var c = '';
				if(isPlus > -1){
					c = '<span class="shortcut"><i>'+array[0].replace(/\s/g,'').toUpperCase()+'</i>+<i>'+array[1].replace(/\s/g,'').toUpperCase()+'</i></span>';
				}else if(array[0] != null && a != 'null' && a != ''){
					c = '<span class="shortcut"><i>'+array[0].replace(/\s/g,'').toUpperCase()+'</i></span>';		
				}
				moca.shortcut.push({key: 'li<%=row.get("menuNo").toString()%>',val:c});
				moca.keyboard[a.toUpperCase().replace(/\s/g,'')] = 'li<%=row.get("menuNo").toString()%>';
	
	
	////////////////////////////////////////////////////////////////////////////////////////////
	<%		
			}
		}
	%>


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
	    
	
	
});
</script>
</head>
   <body>
	<div class="moca_wrap">
		<div type="wframe"  id="header" tag="moca:header" src="/moca/comm/header.html"></div>
		<div type="wframe"  id="aside"tag="moca:aside" src="/moca/comm/aside.html"></div>
		<div class="moca_container on flex">		
			<div type="wframe" style="width:210px" id="lnb" tag="moca:lnb" src="/moca/comm/lnb.html"></div>
			<div type="wframe" style="position:relative" class="fauto" id="mdi" tag="moca:mdi" src="/moca/comm/mdi.html"></div>
		</div>
		<div type="wframe"  id="footer" tag="moca:footer" src="/moca/comm/footer.html"></div>
	</div>
</body>
</html>