<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport"
	content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
<title>모바일 웹 온라인 소유권 이전(TOM_05.jsp)</title>
<link rel="stylesheet" type="text/css" href="/to/css/mobile.css">
<script type="text/javascript">
function func(){
	
	var PCC_window = window.open('', 'PCCV3Window', 'width=400, height=630, resizable=1, scrollbars=no, status=0, titlebar=0, toolbar=0, left=300, top=200' );
    
    if(PCC_window == null){ 
			 alert(" ※ 윈도우 XP SP2 또는 인터넷 익스플로러 7 사용자일 경우에는 \n    화면 상단에 있는 팝업 차단 알림줄을 클릭하여 팝업을 허용해 주시기 바랍니다. \n\n※ MSN,야후,구글 팝업 차단 툴바가 설치된 경우 팝업허용을 해주시기 바랍니다.");
     }
    
	document.getElementById("reqPCCForm").submit();
}
</script>
</head>

<body>
	<div class="wrap">
		<header class="titlebar">
			<button class="btn_back" type="button">이전페이지</button>
		</header>

		<div class="content btn_cont fx2">
			<div class="top_txt">
				<p>
					서비스를 이용을 위해<br>전체 동의가 필요합니다.
				</p>
			</div>
			<div class="agree_cbx">
				<div class="cbx_item all">
					<input type="checkbox" id="cbx_0" checked  onclick="moca.TOM_05_SRC.allchk(this)"> 
					<label class=""	for="cbx_0">전체 동의</label>
				</div>
				<ul class="cbx_list">
					<li class="cbx_item">
						<input type="checkbox" id="cbx_1" checked class='chk'  onclick="moca.TOM_05_SRC.onechk(this)">
						<label class="" for="cbx_1">개인정보 처리방침</label>
						<button class="btn_more" type="button" onclick="moca.TOM_05_SRC.showConts('개인정보 처리방침','1')"></button></li>
					<li class="cbx_item">
						<input type="checkbox" id="cbx_2" checked class='chk'  onclick="moca.TOM_05_SRC.onechk(this)">
						<label class="" for="cbx_2">개인정보 제공동의</label>
						<button class="btn_more" type="button" onclick="moca.TOM_05_SRC.showConts('개인정보 제공동의','2')"></button></li>
					<li class="cbx_item">
						<input type="checkbox" id="cbx_3" checked class='chk'  onclick="moca.TOM_05_SRC.onechk(this)">
						<label class="" for="cbx_3">유료서비스 이용약관</label>
						<button class="btn_more" type="button" onclick="moca.TOM_05_SRC.showConts('유료서비스 이용약관','3')"></button></li>
					<li class="cbx_item">
						<input type="checkbox" id="cbx_4" checked class='chk'  onclick="moca.TOM_05_SRC.onechk(this)">
						<label class="" for="cbx_4">카방 이용약관</label>
						<button class="btn_more" type="button" onclick="moca.TOM_05_SRC.showConts('카방 이용약관','4')"></button></li>
				</ul>

			</div>
		</div>
		<div class="btn_btm">
			<form name="reqPCCForm" id = "reqPCCForm" method="post" action = "https://pcc.siren24.com/pcc_V3/jsp/pcc_V3_j10_v2.jsp" target = 'PCCV3Window' >
			    <input type="hidden" name="reqInfo"    value = "<%=request.getAttribute("reqInfo")%>">
			    <input type="hidden" name="retUrl"      value = "<%=request.getAttribute("retUrl")%>">
			    <input type="hidden" name="verSion"	value = "2">				 <!--모듈 버전정보-->
			    <button class="btn_go" onclick="func();">다음</button>
			</form>
			
		</div>
	</div>

</body>
</html>