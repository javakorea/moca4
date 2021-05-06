<%
/**************************************************************************************************************************
* Program Name  : 본인실명확인 요청 Sample JSP (Real)  
* File Name     : pccName_sample_seed.jsp
* Comment       : 
* History       : 
*
**************************************************************************************************************************/
%>
<%
    response.setHeader("Pragma", "no-cache" );
    response.setDateHeader("Expires", 0);
    response.setHeader("Pragma", "no-store");
    response.setHeader("Cache-Control", "no-cache" );
%>
<%@ page  contentType = "text/html;charset=ksc5601"%>
<%@ page import = "java.util.*" %> 
<%
	
    String id       = request.getParameter("id");                               // 본인실명확인 회원사 아이디
    String srvNo    = request.getParameter("srvNo");                            // 본인실명확인 서비스번호
    String reqNum   = request.getParameter("reqNum");                           // 본인실명확인 요청번호 (sample 페이지와 result 페이지가  동일하지 않으면 결과페이지 복호화 시 에러)
	String exVar    = "0000000000000000";                                       // 복호화용 임시필드
    String retUrl   = request.getParameter("retUrl");                           // 본인실명확인 결과수신 URL
	String certDate	= request.getParameter("certDate");                         // 본인실명확인 요청시간
	String certGb	= request.getParameter("certGb");                           // 본인실명확인 본인확인 인증수단
	String addVar	= request.getParameter("addVar");                           // 본인실명확인 추가 파라메터

    //01. 암호화 모듈 선언
	com.sci.v2.pccv2.secu.SciSecuManager seed  = new com.sci.v2.pccv2.secu.SciSecuManager();

	//02. 1차 암호화
	String encStr = "";
	String reqInfo      = id+"^"+srvNo+"^"+reqNum+"^"+certDate+"^"+certGb+"^"+addVar+"^"+exVar;  // 데이터 암호화

	seed.setInfoPublic(id,"6EF7AC806E2749EB1CB83777F0C73160"); // 회원사 ID 및 PWD 셋팅 패스워드는 16자리 필수 영문 무관

	encStr               = seed.getEncPublic(reqInfo);

	//03. 위변조 검증 값 생성
	com.sci.v2.pccv2.secu.hmac.SciHmac hmac = new com.sci.v2.pccv2.secu.hmac.SciHmac();
	String hmacMsg  = seed.getEncReq(encStr,"HMAC");

	//03. 2차 암호화
	reqInfo  = seed.getEncPublic(encStr + "^" + hmacMsg + "^" + "0000000000000000");  //2차암호화

	//04. 회원사 ID 처리를 위한 암호화
	reqInfo = seed.EncPublic(reqInfo + "^" + id + "^"  + "00000000");

%>
<meta http-equiv="X-UA-Compatible" content="IE=edge" />

<html>
<head>
<title>본인실명확인 서비스 Sample 화면</title>
<meta http-equiv="Content-Type" content="text/html; charset=euc-kr">
<meta name="robots" content="noindex,nofollow" />
<style>
   body,p,ol,ul,td
   {
	 font-family: 굴림;
	 font-size: 12px;   
   } 
   
   a:link { size:9px;color:#000000;text-decoration: none; line-height: 12px}
   a:visited { size:9px;color:#555555;text-decoration: none; line-height: 12px}
   a:hover { color:#ff9900;text-decoration: none; line-height: 12px}

   .style1 {
		color: #6b902a;
		font-weight: bold;
	}
	.style2 {
	    color: #666666
	}
	.style3 {
		color: #3b5d00;
		font-weight: bold;
	}
</style>

<script language=javascript>  
    var PCC_window; 

    function openPCCWindow(){ 
        var PCC_window = window.open('', 'PCCV3Window', 'width=400, height=630, resizable=1, scrollbars=no, status=0, titlebar=0, toolbar=0, left=300, top=200' );
       
       if(PCC_window == null){ 
			 alert(" ※ 윈도우 XP SP2 또는 인터넷 익스플로러 7 사용자일 경우에는 \n    화면 상단에 있는 팝업 차단 알림줄을 클릭하여 팝업을 허용해 주시기 바랍니다. \n\n※ MSN,야후,구글 팝업 차단 툴바가 설치된 경우 팝업허용을 해주시기 바랍니다.");
        }
        
        document.reqPCCForm.action = 'https://pcc.siren24.com/pcc_V3/jsp/pcc_V3_j10_v2.jsp';
        document.reqPCCForm.target = 'PCCV3Window';

		return true;
    }
</script>
</head>

<body bgcolor="#FFFFFF" topmargin=0 leftmargin=0 marginheight=0 marginwidth=0  background="/images/mem_back.gif" >

<center>
<br><br><br><br><br><br>
<span class="style1">본인실명확인서비스 요청화면 Sample입니다.</span><br>
<br><br>
<table cellpadding=1 cellspacing=1>    
    <tr>
        <td align=center>회원사아이디</td>
        <td align=left><%=id%></td>
    </tr>
    <tr>
        <td align=center>서비스번호</td>
        <td align=left><%=srvNo%></td>
    </tr>
    <tr>
        <td align=center>요청번호</td>
        <td align=left><%=reqNum%></td>
    </tr>
	<tr>
        <td align=center>인증구분</td>
        <td align=left><%=certGb%></td>
    </tr>
	<tr>
        <td align=center>요청시간</td>
        <td align=left><%=certDate%></td>
    </tr>
	<tr>
        <td align=center>추가파라메터</td>
        <td align=left><%=addVar%></td>
    </tr>    
    <tr>
        <td align=center>&nbsp</td>
        <td align=left>&nbsp</td>
    </tr>
    <tr width=100>
        <td align=center>요청정보(암호화)</td>
        <td align=left>
            <%=reqInfo%>
        </td>
    </tr>
    <tr>
        <td align=center>결과수신URL</td>
        <td align=left><%=retUrl%></td>
    </tr>
	<tr>
        <td align=center>hmacMsg</td>
        <td align=left><%=hmacMsg%></td>
    </tr>
	<tr>
        <td align=center>encStr</td>
        <td align=left><%=encStr%></td>
    </tr>
</table>

<!-- 본인실명확인서비스 요청 form --------------------------->
<form name="reqPCCForm" method="post" action = "" onsubmit="return openPCCWindow()">
    <input type="hidden" name="reqInfo"    value = "<%=reqInfo%>">
    <input type="hidden" name="retUrl"      value = "<%=retUrl%>">
    <input type="hidden" name="verSion"	value = "2">				 <!--모듈 버전정보-->
    <input type="submit" value="본인확인서비스V3 요청" >	
</form>





<BR>
<BR>
<!--End 본인실명확인서비스 요청 form ----------------------->


<br>
<br>
	<table width="450" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td width="130"><a href=http://www.siren24.com/v2alimi/comm/jsp/v2alimiAuth.jsp?id=SIR005&svc_seq=01 target=blank><img src="http://www.siren24.com/mysiren/img/layout/logo.gif" width="122" height="41" border=0></a></td>
        <td width="320"><span class="style2">본 사이트는 서울신용평가정보(주)의 <span class="style3">명의도용방지서비스</span> 협약사이트 입니다. 타인의 명의를 도용하실 경우 관련법령에 따라 처벌 받으실 수 있습니다.</span></td>
      </tr>
    </table>
      <br>
      <br>
    <br>
  이 Sample화면은 본인실명확인서비스 요청화면 개발시 참고가 되도록 제공하고 있는 화면입니다.<br>
<p style="color:red"><b> Sample페이지를 테스트로만 적용시키신 후 실제 운영사이트에 반영하실때는 샘플로 제공되고있는 파일명으로는 사용을 하지 말아주십시오. </b></p>
  <br>
  <br>
  <br>
</center>
</BODY>
</HTML>
