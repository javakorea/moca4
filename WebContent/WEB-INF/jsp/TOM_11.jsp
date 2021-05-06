<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="java.io.*,java.nio.charset.*,java.util.*,org.apache.log4j.*,com.google.gson.*,com.carbang365.*" %>
<%@ page import="org.apache.http.*,org.apache.http.client.config.*,org.apache.http.client.entity.*,org.apache.http.client.methods.*" %>
<%@ page import="org.apache.http.entity.*,org.apache.http.entity.mime.*,org.apache.http.impl.client.*,org.apache.http.message.*" %>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport"
	content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
<title>모바일 웹 온라인 소유권 이전</title>
<link rel="stylesheet" type="text/css" href="/to/css/mobile.css">
<script language="JavaScript" src="/to/moca/js/jquery-3.3.1.min.js"></script>
<script>
<%
String retInfo = request.getParameter("retInfo");
String id			= "";                                                               //회원사 비즈사이렌아이디                                                            //CI Version

String reqNum		= "";                                                               // 본인확인 요청번호

//복화화용 변수
String encPara		= "";
String encMsg		= "";
String msgChk       = "N";  

//-----------------------------------------------------------------------------------------------------------------

reqNum = "123456789"; //sample 페이지의 reqNum과 동일하지 않으면 결과페이지 복호화 시 에러



// 1. 암호화 모듈 (jar) Loading
com.sci.v2.pccv2.secu.SciSecuManager sciSecuMg = new com.sci.v2.pccv2.secu.SciSecuManager();
sciSecuMg.setInfoPublic(id,"6EF7AC806E2749EB1CB83777F0C73160"); //패스워드는 16자리 필수 영문 무관

// 3. 1차 파싱---------------------------------------------------------------

retInfo  = sciSecuMg.getDec(retInfo, reqNum);

// 4. 요청결과 복호화
String[] aRetInfo1 = retInfo.split("\\^");

encPara  = aRetInfo1[0];         //암호화된 통합 파라미터
encMsg   = aRetInfo1[1];    //암호화된 통합 파라미터의 Hash값

String encMsg2   = sciSecuMg.getMsg(encPara);

// 5. 위/변조 검증 ---------------------------------------------------------------

if(encMsg2.equals(encMsg)){
    msgChk="Y";
}

if(msgChk.equals("N")){
	System.out.println("HMAC 확인이 필요합니다.");
}

// 복호화 및 위/변조 검증 ---------------------------------------------------------------
retInfo  = sciSecuMg.getDec(encPara, reqNum);

String[] aRetInfo = retInfo.split("\\^");
System.out.println("1:!!retInfo!!!!!!!!!!!!!!!!!!!!!!!!!!"+retInfo);



System.out.println("2:!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
	for(int i=0; i < aRetInfo.length; i++){
		System.out.println(i+":"+aRetInfo[i]);
	}
System.out.println("333:!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
%>
	var Name='<%=aRetInfo[0]%>';
	var BirthDate='<%=aRetInfo[1]%>';
	var Sex='<%=aRetInfo[2]%>';
	var UpdateTime='<%=aRetInfo[13]%>';
	var Mobile_Carrier_Major='<%=aRetInfo[12]%>';
	var LoginTime='<%=aRetInfo[13]%>';
	var RegisterTime='<%=aRetInfo[13]%>'; 
	var Mobile_Phone='<%=aRetInfo[11]%>';
	var OsType='3';//web
	var LoginCount='1';//web
	$(document).ready(function(){
		var loginTemp2 = {};
		loginTemp2.name = Name;
		loginTemp2.birthDate = BirthDate;
		loginTemp2.sex = Sex;
		loginTemp2.updateTime = UpdateTime;
		loginTemp2.mobileCarrierMajor = Mobile_Carrier_Major;
		loginTemp2.loginTime = LoginTime;
		loginTemp2.registerTime = RegisterTime;
		loginTemp2.mobilePhone = Mobile_Phone;
		loginTemp2.osType = OsType;
		loginTemp2.loginCount = LoginCount;
		sessionStorage.setItem('loginTemp2', JSON.stringify(loginTemp2));
		location.href="/to/m/TOM_11.html"
	});
</script>
</head>
<body>
</body>
</html>