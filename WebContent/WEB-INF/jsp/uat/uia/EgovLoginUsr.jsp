<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="ui" uri="http://egovframework.gov/ctl/ui"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<!DOCTYPE html>
<html lang="ko">
<head>
<title>login</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" ksc="MOZILLA/5.0 (IPHONE; CPU IPHONE OS 13_2_3 LIKE MAC OS X) APPLEWEBKIT/605.1.15 (KHTML, LIKE GECKO) VERSION/13.0.3 MOBILE/15E148 SAFARI/604.1">
<link rel="stylesheet" type="text/css" href="/css/login.css">
<script language="JavaScript" src="/moca/js/jquery-3.3.1.min.js"></script>
<script type="text/javascript" src="/moca/js/sha512.min.js"></script>
<script language="JavaScript" src="/moca/js/config.js"></script>
<script language="JavaScript" src="/moca/js/moca.js"></script>
<script type="text/javascript" src="/moca/js/moca_ui.js"></script>
<script type="text/javascript">
var moca = new Moca();
moca.EFC_CORP = {};
moca.EFC_CORP.fn_search = function(){
	moca.exe({
		url : moca._domain+moca._contextRoot+"/efms/EFC_CORP/list_nosess_json.do",
		loadingbar:true,
        data : {
        	"header" : moca.header,
        	"body" : {}
        },			
		callback : function(response){
			var _list = moca.getResList(response,"list");
			var _html = '';
			for(var i=0; i < _list.length; i++){
				var row = _list[i];
				var cd = row['CORP_CD'];
				var nm = row['CORP_NM'];
				//if(cd == _val){
				//	_html += '<option value="'+cd+'" selected>'+cd+' '+nm+'</option>';
				//}else{
					_html += '<option value="'+cd+'">'+nm+'</option>';
				//}
			}
			$('#CORP_CD').html(_html);
		}
	});
};

function actionLogin() {

    if (document.loginForm.id.value =="") {
        alert("아이디를 입력하세요");
        return false;
    } else if (document.loginForm.password.value =="") {
        alert("비밀번호를 입력하세요");
        return false;
    } else {
    	sessionStorage['CORP_CD'] = document.loginForm.CORP_CD.value;
    	sessionStorage['CORP_NM'] = document.loginForm.CORP_CD.innerText;
    	sessionStorage['USER_ID'] = document.loginForm.id.value;
    	var _dt = moca.dateFormat(moca.now()).substring(0,10);
    	var _time = moca.dateFormat(moca.now()).substring(11,16);
    	var _weekday = dateLib.getDay(moca.now().charAt(moca.now().length-1),'han').replace(/요일/g,'');
    	sessionStorage['LOGINDT'] = _dt+'('+_weekday+') '+_time;
        document.loginForm.action="<c:url value='/uat/uia/actionSecurityLogin.do'/>";
        //document.loginForm.j_username.value = document.loginForm.userSe.value + document.loginForm.username.value;
        //document.loginForm.action="<c:url value='/j_spring_security_check'/>";
        document.loginForm.submit();
    }
}

function setCookie (name, value, expires) {
    document.cookie = name + "=" + escape (value) + "; path=/; expires=" + expires.toGMTString();
}

function getCookie(Name) {
    var search = Name + "="
    if (document.cookie.length > 0) { // 쿠키가 설정되어 있다면
        offset = document.cookie.indexOf(search)
        if (offset != -1) { // 쿠키가 존재하면
            offset += search.length
            // set index of beginning of value
            end = document.cookie.indexOf(";", offset)
            // 쿠키 값의 마지막 위치 인덱스 번호 설정
            if (end == -1)
                end = document.cookie.length
            return unescape(document.cookie.substring(offset, end))
        }
    }
    return "";
}

function saveid(form) {
    var expdate = new Date();
    // 기본적으로 30일동안 기억하게 함. 일수를 조절하려면 * 30에서 숫자를 조절하면 됨
    if (form.checkId.checked)
        expdate.setTime(expdate.getTime() + 1000 * 3600 * 24 * 30); // 30일
    else
        expdate.setTime(expdate.getTime() - 1); // 쿠키 삭제조건
    setCookie("saveid", form.id.value, expdate);
}

function getid(form) {
    form.checkId.checked = ((form.id.value = getCookie("saveid")) != "");
}

function fnInit() {
	moca.EFC_CORP.fn_search();
    var message = document.loginForm.message.value;
    if (message != "") {
        alert(message);
    }
    getid(document.loginForm);
    
}


</script>
</head>
<body  onload="fnInit();">
	<div class="wrap">
		<div class="login_box">
			<h1 class="logo">teammoca ERP</h1>
			<div class="login_img"></div>
			<form:form id="loginForm" name="loginForm" method="post">
 			<select name="CORP_CD" id="CORP_CD">
				<option value="001"></option>
			</select>

			<input type="text" placeholder="아이디" title="아이디를 입력하세요." id="id" name="id" maxlength="10">
			<input type="password" placeholder="비밀번호" maxlength="25" title="비밀번호를 입력하세요." id="password" name="password" onkeydown="javascript:if (event.keyCode == 13) { actionLogin(); }"/>
			<button onclick="javascript:actionLogin()" >로그인</button>
			<div class="login_option">
				<input type="checkbox" name="checkId" title="로그인ID 저장여부" onclick="javascript:saveid(this.form);" id="checkId" />아이디저장
			<!--<div class="lang">
					<input type="radio" name="lang" value="kor" checked>한국어
					<input type="radio" name="lang" value="eng">English
				</div> -->
			</div>
            <input type="hidden" name="message" value="${message}" />
            <input type="hidden" name="userSe"  value="USR"/>
            <input name="j_username" type="hidden"/>
            </form:form>                			
		</div>
	</div>
</body>
</html>