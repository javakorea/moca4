<%@ page  contentType = "text/html;charset=ksc5601"%>
<%@ page import ="java.util.*,java.text.SimpleDateFormat"%>
<%
        //날짜 생성
        Calendar today = Calendar.getInstance();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        String day = sdf.format(today.getTime());

        java.util.Random ran = new Random();
        //랜덤 문자 길이
        int numLength = 6;
        String randomStr = "";

        for (int i = 0; i < numLength; i++) {
            //0 ~ 9 랜덤 숫자 생성
            randomStr += ran.nextInt(10);
        }

		//reqNum은 최대 40byte 까지 사용 가능
        String reqNum = "123456789";   //sample 페이지와 result 페이지가  동일하지 않으면 결과페이지 복호화 시 에러
		String certDate=day;

%>

<html>
    <head>
        <title>서울신용평가정보 본인실명확인서비스  테스트</title>
        <meta http-equiv="Content-Type" content="text/html; charset=euc-kr">
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
    </head>
    <body onload="document.reqCBAForm.id.focus();" bgcolor="#FFFFFF" topmargin=0 leftmargin=0 marginheight=0 marginwidth=0>
        <center>
            <br><br><br>
            <span class="style1">서울신용평가정보 본인실명확인서비스 테스트</span><br>

            <form name="reqCBAForm" method="post" action="./pcc_V3_sample_seed_v2.jsp">
                <table cellpadding=1 cellspacing=1>
                    <tr>
                        <td align=center>회원사아이디</td>
                        <td align=left><input type="text" name="id" size='41' maxlength ='8' value = ""></td>
                    </tr>
                    <tr>
                        <td align=center>서비스번호</td>
                        <td align=left><input type="text" name="srvNo" size='41' maxlength ='6' value=""></td>
                    </tr>
                    <tr>
                        <td align=center>요청번호</td>
                        <td align=left><input type="text" name="reqNum" size='41' maxlength ='40' value='<%=reqNum%>'></td>
                    </tr>
					<tr>
                        <td align=center>인증구분</td>
                        <td align=left>
                            <select name="certGb" style="width:300">
                                
                                <option value="H">휴대폰</option>
                            </select>
                        </td>
                    </tr>
					<tr>
                        <td align=center>요청시간</td>
                        <td align=left><input type="text" name="certDate" size='41' maxlength ='40' value='<%=certDate%>'></td>
                    </tr>
					<tr>
                        <td align=center>추가파라미터</td>
                        <td align=left><input type="text" name="addVar"  size="41" maxlength ='320' value=""></td>
                    </tr>
                    <tr>
                        <td align=center>결과수신URL</td><!-- 결과수신 URL(32http:// 포함한 주소) -->
								  	     				  <!-- 32http:// 인 경우 - 동일 프레임에서 결과 수신하는 경우
															   31http:// 인 경우 - 부모창에서 결과 수신하는 경우 -->
                        <td align=left><input type="text" name="retUrl" size="41" value="32http://결과페이지 도메인/pcc_V3_popup_seed_v2.jsp"></td>
                    </tr>
                </table>
                <br><br>
                <input type="submit" value="본인확인서비스V3 테스트">
            </form>
            <br>
            <br>
            이 Sample화면은 서울신용평가 본인실명확인서비스 테스트를 위해 제공하고 있는 화면입니다.<br>
			<p style="color:red"><b> Sample페이지를 테스트로만 적용시키신 후 실제 운영사이트에 반영하실때는 샘플로 제공되고있는 파일명으로는 사용을 하지 말아주십시오. </b></p>
            <br>
        </center>
    </body>
</html>