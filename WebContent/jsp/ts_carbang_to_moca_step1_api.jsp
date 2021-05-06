<?xml version="1.0" encoding="utf-8"?><%@ page contentType="text/xml; charset=UTF-8"%><%@ page language="java" pageEncoding="UTF-8"%><%@ page import="java.util.*,com.carbang365.*,mocaframework.com.cmm.*" %><%@ page import="java.io.*" %>
<%!
private static final org.slf4j.Logger LOGGER = org.slf4j.LoggerFactory.getLogger("ts_carbang_to_moca_step1");
%>
<%
	boolean payOk = false;
	request.setCharacterEncoding("utf-8");
	String xml = request.getParameter("xml");
	if(xml == null){
		xml = "파라미터값xml이 null입니다.";
	}

	System.out.println("====================================================");
	System.out.println("[TS로부터온 비용납부정보송신:ts_carbang_to_moca_step1_api.jsp]===================================================="+xml);
	System.out.println("====================================================");
	String xml_string_to_send = "";

	
	//연계결과코드	CNTC_RESULT_CODE	1	VARCHAR2	Y	8
	//연계결과상세	CNTC_RESULT_DTLS	1	VARCHAR2	Y	200
	
	
	
	
	System.out.println("11====================================================");
	org.springframework.web.context.WebApplicationContext wac = org.springframework.web.context.support.WebApplicationContextUtils.getWebApplicationContext(((HttpServletRequest) request).getSession().getServletContext());
	com.carbang365.TOServiceImpl tOService = (com.carbang365.TOServiceImpl)wac.getBean("toService");
	com.carbang365.TOMapper TOMapper = (com.carbang365.TOMapper)wac.getBean("TOMapper");
try{
	
	System.out.println("2===================================================="+TOMapper);
	//toService.exeTsStep1(request,xml);
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	/************************************ 로그 시작 ************************************/
/* 	
	LOGGER.debug("===================== TS 확정비용 전문 수신 시작 =====================");
	Enumeration TsParams = req.getParameterNames();
	while(TsParams.hasMoreElements()) {
	  String name = (String) TsParams.nextElement();
	  LOGGER.debug(name + " : " + req.getParameter(name) + "     "); 
	}
	LOGGER.debug("===================== TS 확정비용 전문 수신 끝 =====================");
	 */
	/************************************ 로그 끝 ************************************/
/*			
* 연계기관코드	CNTC_INSTT_CODE
사업자등록번호	BIZRNO
신청접수번호	REQST_RCEPT_NO
민원신청접수번호	CVPL_REQST_NO
공채(할인)	NTPBND_DSCNT_AMOUNT
취득세	ACQSTX_AMOUNT
수입증지금액	REVENUE_STMPTAX_AMOUNT
전자납부수수료	ELCTRN_PAY_FEE_AMOUNT
공채(할인) + 취득세 + 수입증지금액 + 전자납부수수료


총등록비금액	TOT_RGFE_AMOUNT
공채(매입)	NTPBND_DSCNT_AMOUNT


	
	<?xml version="1.0" encoding="UTF-8"?>
	<contents>
	    <CNTC_INSTT_CODE>CARBANGAPP</CNTC_INSTT_CODE>
	    <BIZRNO>876-88-01194</BIZRNO>
	    <REQST_RCEPT_NO>adp-009</REQST_RCEPT_NO>
	    <CVPL_REQST_NO>mxgs-001</CVPL_REQST_NO>
	    <NTPBND_DSCNT_AMOUNT>13579</NTPBND_DSCNT_AMOUNT>
	    <ACQSTX_AMOUNT>123454321</ACQSTX_AMOUNT>
	    <REVENUE_STMPTAX_AMOUNT>1200</REVENUE_STMPTAX_AMOUNT>
	    <ELCTRN_PAY_FEE_AMOUNT>1000</ELCTRN_PAY_FEE_AMOUNT>
	    <TOT_RGFE_AMOUNT>12200</TOT_RGFE_AMOUNT>
	    <NTPBND_DSCNT_AMOUNT>12345</NTPBND_DSCNT_AMOUNT>
	</contents>
	
	*/

	
	
	
	
	String Stage = "";
	
	// xml String 형식으로 데이터가 온다고 함.
	// 아래는 임시. 어떤식으로 올지는 받아봐야 함
	
//		req.getParameter("header");
//		req.getParameter("body");
	
	// xml 파싱
	// 파싱 후 전문 응답값 key value set
	Map<String, String> xmlMap = new HashMap<String, String>();	// 파싱 후 map으로 casting하여 xmlMap에 담기
	Map<String, Object> costMap = new HashMap<String, Object>();
	
	String _xml = xml;

	System.out.println("");
	System.out.println("=============================================================================================================");
	System.out.println("[TS로부터온 비용납부정보송신 STEP3:/mobile/reciveTransferOwnerPriceTs.do]====================================================");
	System.out.println(_xml);
	System.out.println("=============================================================================================================");	
	System.out.println("");
	String CNTC_INSTT_CODE = Util.getXmlValue(_xml, "CNTC_INSTT_CODE");
	String BIZRNO = Util.getXmlValue(_xml, "BIZRNO");
	String REQST_RCEPT_NO = Util.getXmlValue(_xml, "REQST_RCEPT_NO");
	String CVPL_REQST_NO = Util.getXmlValue(_xml, "CVPL_REQST_NO");
	
	String NTPBND_DSCNT_AMOUNT = Util.getXmlValue(_xml, "NTPBND_DSCNT_AMOUNT");//공채할인
	String NTPBND_DSCNT_AMOUNT2 = Util.getXmlValue(_xml, "NTPBND_DSCNT_AMOUNT");//공채매입
	
	String ACQSTX_AMOUNT = Util.getXmlValue(_xml, "ACQSTX_AMOUNT");
	String REVENUE_STMPTAX_AMOUNT = Util.getXmlValue(_xml, "REVENUE_STMPTAX_AMOUNT");
	String ELCTRN_PAY_FEE_AMOUNT = Util.getXmlValue(_xml, "ELCTRN_PAY_FEE_AMOUNT");
	String TOT_RGFE_AMOUNT = Util.getXmlValue(_xml, "TOT_RGFE_AMOUNT");
	
	
	String ACCO_NAME = Util.getXmlValue(_xml, "ACCO_NAME");
	String BNK_CODE = Util.getXmlValue(_xml, "BNK_CODE");
	String ACCO_NO = Util.getXmlValue(_xml, "ACCO_NO");
	
	
	xmlMap.put("CNTC_INSTT_CODE", CNTC_INSTT_CODE);
	xmlMap.put("BIZRNO", BIZRNO);
	xmlMap.put("REQST_RCEPT_NO", REQST_RCEPT_NO);
	xmlMap.put("CVPL_REQST_NO", CVPL_REQST_NO);
	xmlMap.put("NTPBND_DSCNT_AMOUNT", NTPBND_DSCNT_AMOUNT);
	xmlMap.put("ACQSTX_AMOUNT", ACQSTX_AMOUNT);
	xmlMap.put("REVENUE_STMPTAX_AMOUNT", REVENUE_STMPTAX_AMOUNT);
	xmlMap.put("ELCTRN_PAY_FEE_AMOUNT", ELCTRN_PAY_FEE_AMOUNT);
	xmlMap.put("TOT_RGFE_AMOUNT", TOT_RGFE_AMOUNT);
	
	xmlMap.put("ACCO_NAME", ACCO_NAME);
	xmlMap.put("BNK_CODE", BNK_CODE);
	xmlMap.put("ACCO_NO", ACCO_NO);
	System.out.println("[XMP -> MAP]=================================================================================================");
	System.out.println(xmlMap);
	System.out.println("=============================================================================================================");	
	
	//REQST_RCEPT_NO	// 신청접수번호 : 우리가 채번하는 값임. 해당 번호에 소유권이전 IDX가 들어갈거임. 
	// 요청 시 채번 형식은 yyyyMMddHHss + 소유권이전 테이블 idx 값으로 채번 예정
	// String reqRceptNo = //파싱된 데이터의 REQST_RCEPT_NO
	
	
	
	// 공단 응답값
//		연계기관코드	CNTC_INSTT_CODE			1	VARCHAR2	O	10 	요청기관 승인ID
//		사업자등록번호	BIZRNO					1	VARCHAR2	O	13 	
//		신청접수번호	REQST_RCEPT_NO			1	VARCHAR2	O	20 	요청기관 PK
//		민원신청접수번호	CVPL_REQST_NO			1	VARCHAR2	O	20 	신청번호 PK
//		공채(할인)		NTPBND_DSCNT_AMOUNT		1	NUMBER	O	22	
//		취득세		ACQSTX_AMOUNT			1	NUMBER	O	22	
//		수입증지금액	REVENUE_STMPTAX_AMOUNT	1	NUMBER	O	22	
//		전자납부수수료	ELCTRN_PAY_FEE_AMOUNT	1	NUMBER	O	22	
//		총등록비금액	TOT_RGFE_AMOUNT			1	NUMBER	O	22	공채(할인) + 취득세 + 수입증지금액 + 전자납부수수료
//		공채(매입)		NTPBND_DSCNT_AMOUNT		1	NUMBER	O	22	
	
	// ================================= 임시 조회용 값 set 시작 ================================= //
	
	
	
	/*
	String REQST_RCEPT_NO = "20210122111322";
	REQST_RCEPT_NO = REQST_RCEPT_NO + idx;
	
	xmlMap.put("CNTC_INSTT_CODE", "0000000000");
	xmlMap.put("BIZRNO", "1112221111555");
	xmlMap.put("REQST_RCEPT_NO", REQST_RCEPT_NO);
	xmlMap.put("CVPL_REQST_NO", "0000000001");
	xmlMap.put("NTPBND_DSCNT_AMOUNT", "15200");
	xmlMap.put("ACQSTX_AMOUNT", "1000200");
	xmlMap.put("REVENUE_STMPTAX_AMOUNT", "3000");
	xmlMap.put("ELCTRN_PAY_FEE_AMOUNT", "3000");
	xmlMap.put("TOT_RGFE_AMOUNT", "10000");
	*/
	
	// ================================= 임시 조회용 값 set 끝 ================================= //

	
	
	String cntcInsttCode 			= xmlMap.get("CNTC_INSTT_CODE");            	// 연계기관코드
	String bizrno 					= xmlMap.get("BIZRNO");                     	// 사업자등록번호
	String reqstRceptNo 			= xmlMap.get("REQST_RCEPT_NO");             	// 신청접수번호 (카방pk : yyyyMMddHHss + 소유권이전idx)
	String cvplReqstNo 				= xmlMap.get("CVPL_REQST_NO");              	// 민원신청접수번호 (공단PK)
	String ntpbndDscntAmount 		= xmlMap.get("NTPBND_DSCNT_AMOUNT");        	// 공채(할인)
	String acqstxAmount 			= xmlMap.get("ACQSTX_AMOUNT");              	// 취득세
	String revenueStmptaxAmount 	= xmlMap.get("REVENUE_STMPTAX_AMOUNT");     	// 수입증지금액
	String elctrnPayFeeAmount 		= xmlMap.get("ELCTRN_PAY_FEE_AMOUNT");      	// 전자납부수수료
	String totRgfeAmount 			= xmlMap.get("TOT_RGFE_AMOUNT");            	// 총등록비금액
	String ntpbndPrcsAmount 		= xmlMap.get("NTPBND_DSCNT_AMOUNT2");        	// 공채(매입) :: 공채(할인)과 key중복>>> 레이아웃이 잘못온듯. 우선 컬럼은 추가해두고 수신 key는 테스트시점에 확인.
	
	String ACCO_NAME2 				= xmlMap.get("ACCO_NAME"); 
	String BNK_CODE2 				= xmlMap.get("BNK_CODE"); 
	String ACCO_NO2 				= xmlMap.get("ACCO_NO"); 
	
	System.out.println(">>>xmlMap>>>"+xmlMap);
	//String TransferOwnerIndex 		= reqstRceptNo.substring(14, reqstRceptNo.length());	// 소유권이전 id
	System.out.println(">>>reqstRceptNo>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+reqstRceptNo);
	String TransferOwnerIndex 		= Integer.parseInt(reqstRceptNo.substring(14))+"";
	
	costMap.put("cntcInsttCode", cntcInsttCode);
	costMap.put("bizrno", bizrno);
	costMap.put("reqstRceptNo", reqstRceptNo);
	costMap.put("cvplReqstNo", cvplReqstNo);
	costMap.put("ntpbndDscntAmount", ntpbndDscntAmount);
	costMap.put("acqstxAmount", acqstxAmount);
	costMap.put("revenueStmptaxAmount", revenueStmptaxAmount);
	costMap.put("elctrnPayFeeAmount", elctrnPayFeeAmount);
	costMap.put("totRgfeAmount", totRgfeAmount);
	costMap.put("ntpbndPrcsAmount", ntpbndPrcsAmount);
	costMap.put("TransferOwnerIdx", TransferOwnerIndex);
	costMap.put("idx", TransferOwnerIndex);
	costMap.put("TransferownerIdx", TransferOwnerIndex);
	
	
	
	costMap.put("ACCO_NAME", ACCO_NAME2);
	costMap.put("BNK_CODE", BNK_CODE2);
	costMap.put("ACCO_NO", ACCO_NO2);
	
	System.out.println(reqstRceptNo+">>>costMap>>>"+costMap);
	// TS 확정 이전비용 테이블 INSERT BNK_CODE
	//DELETE  FROM TO_TRANSFEROWNER_COST_TS
	// WHERE cvplReqstNo = '20210323152214000144'
	 
	TOMapper.deleteCostTs(costMap);
	TOMapper.insertTransferCostTs(costMap);
	

	// 소유권이전 상세 조회		<<< 고객소유권이전 결제내역(TO_USER_PAYMENT_INFO 테이블생성 필요) left join 해서 결제 여부까지 같이 조회
	Map<String, Object> trnsOwner = TOMapper.selectToTransferOwner(costMap);
	Map<String, Object> bankInfo = TOMapper.selectToTransferOwnerDetail(costMap);
	
	
	//A.*, B.Carbang_BankCd, B.Carbang_BankNumber, B.Carbang_BankOwner 
	int currentStage = Integer.parseInt(trnsOwner.get("Stage").toString());
	System.out.println(reqstRceptNo+">>>currentStage>>>"+currentStage);
	// 고객결제 완료 상태이면  ( == Stage > 13) 즉시이체 결제 전문 insert (method 따로 빼기) 카방->공단 계좌로 입금 else 암것도 안함. 고객결제 안하고 고객이 app 종료 시 그대로 이전신청 취소되도록
	if(currentStage > 13) {
		
		Map<String, Object> payReqMap = new HashMap<String, Object>();
		
		java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyyMMdd");
		String reqDt = sdf.format(new Date());
		payReqMap.put("reqDt", reqDt);								// 요청일자
		
		payReqMap.put("Pay_type", "2");								// 결제구분 (1: 고객-카방, 2: 카방-공단, 3: 카방-고객)
		payReqMap.put("TransferOwnerIdx", TransferOwnerIndex);	// 소유권이전idx
		
		
		payReqMap.put("bankCd", bankInfo.get("Carbang_BankCd"));								// 출금은행코드
		//payReqMap.put("bankNm", "케이뱅크");							// 출금은행명
		payReqMap.put("accountNo", bankInfo.get("Carbang_BankNumber"));				// 출금은행계좌
		payReqMap.put("bankOwner", bankInfo.get("Carbang_BankOwner"));						// 출금계좌예금주
		
		/*
		payReqMap.put("bankCd", "089");								// 출금은행코드
		payReqMap.put("bankNm", "케이뱅크");							// 출금은행명
		payReqMap.put("accountNo", "70110000000522");				// 출금은행계좌
		payReqMap.put("bankOwner", "(주)카방");						// 출금계좌예금주
		payReqMap.put("bank_deposit_owner", "지티유 주식회사");			// 입금계좌주
		payReqMap.put("bank_deposit_cd", "081");					// 입금은행코드
		payReqMap.put("bank_deposit_name", "하나은행");				// 입금계좌명
		payReqMap.put("bank_deposit_account", "11891001796904");	// 입금계좌번호
		payReqMap.put("traceNo", "");								// 납부자번호 (비동기 전문수신이므로 납부자번호 없음. 추후 넣을 수 있는지 확인)
		payReqMap.put("userIdx", "admin");							// 사용자id
		payReqMap.put("payAmount", totRgfeAmount);					// 출금금액
		payReqMap.put("payComnt", "공단입금비용");						// 출금통장적요
		payReqMap.put("depositComnt", "공단입금비용");					// 입금통장적요
		*/
		
		/*
		payReqMap.put("bank_deposit_owner", "지티유 주식회사");			// 입금계좌주
		payReqMap.put("bank_deposit_cd", "081");					// 입금은행코드
		payReqMap.put("bank_deposit_name", "하나은행");				// 입금계좌명
		payReqMap.put("bank_deposit_account", "11891001796904");	// 입금계좌번호
		*/
		payReqMap.put("bank_deposit_owner", ACCO_NAME2);			// 입금계좌주
		payReqMap.put("bank_deposit_cd", BNK_CODE2);					// 입금은행코드
		//payReqMap.put("bank_deposit_name", "하나은행");				// 입금계좌명
		payReqMap.put("bank_deposit_account", ACCO_NO2);	// 입금계좌번호	
		
		
		payReqMap.put("traceNo", "");								// 납부자번호 (비동기 전문수신이므로 납부자번호 없음. 추후 넣을 수 있는지 확인)
		payReqMap.put("userIdx", "admin");							// 사용자id
		payReqMap.put("payAmount", totRgfeAmount);					// 출금금액
		payReqMap.put("payComnt", "공단입금비용");						// 출금통장적요
		payReqMap.put("depositComnt", "공단입금비용");					// 입금통장적요
		System.out.println(">>payReqMap>>"+payReqMap);
		
		// 결제 공통부 전문을 생성한다.
		LOGGER.debug("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
		
		payReqMap.put("sendType", "7"); //송금이체
		String cmmStr = tOService.setKsnetCmmArea(payReqMap);
		LOGGER.debug(cmmStr);
		LOGGER.debug("공통부 길이"+cmmStr.length());
		
		// 계좌등록 개별부 전문을 생성한다.
		String individualStr = tOService.setKsnetRemittanceArea(payReqMap);
		LOGGER.debug(individualStr);
		LOGGER.debug("개별부 길이"+individualStr.length());
		LOGGER.debug("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
		
		String fullMsg = cmmStr + individualStr;
		LOGGER.debug("전체전문 길이"+fullMsg.length());
		
		
		// 전문 테이블 insert를 위한 값 set
		payReqMap.put("compCode", "CARBANG1");	// 송금업체코드
		payReqMap.put("msgCode", "0100100");	// 송금이체
		payReqMap.put("sendMsg", fullMsg);		// 요청전문
		
		payReqMap.put("CALLER", "reciveTransferOwnerPriceTs(TS비용확정 전문을수신하고즉시이체하고후속처리)");
		payReqMap.put("SERVICE","reciveTransferOwnerPriceTsAfter");
		System.out.println("[결제등록]>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
		
		
		System.out.println("reqDt>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+payReqMap.get("reqDt"));
		System.out.println("bankCd>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+payReqMap.get("bankCd"));
		System.out.println("compCode>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+payReqMap.get("compCode"));
		System.out.println("seqNo>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+payReqMap.get("seqNo"));
		
		//[결제2:TS비용확정 전문을수신하고즉시이체하고후속처리]
		int cnt = tOService.insertTradeRequestBin(payReqMap);
		if(cnt > 0) {
			boolean flag = false;
			for(int z=0; z < 20; z++) { 
				Thread.sleep(3000);
				System.out.println("["+z+"]>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
				System.out.println("reqDt>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+payReqMap.get("reqDt"));
				System.out.println("bankCd>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+payReqMap.get("bankCd"));
				System.out.println("compCode>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+payReqMap.get("compCode"));
				System.out.println("seqNo>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+payReqMap.get("seqNo"));
				Map<String, Object> resMap = TOMapper.selectTradeRequestBin(payReqMap);	// 임시. 추후 db합쳐지면 주석해제
				
				String rcvFlag = (String) resMap.get("RECV_FLAG"); // 응답구분
				System.out.println("rcvFlag["+rcvFlag+"]==================================="+resMap  );
				if("Y".equals(rcvFlag)) {
					flag = true;
					
					String resStr = (String) resMap.get("RECV_MSG"); 	// 응답전문내용
					System.out.println("resStr.substring================================================================================================================================================="  );
					String resCd = resStr.substring(51, 55);			// 공통부 은행응답코드 
					
					LOGGER.debug("resCd	::: "+resCd);
					String text = "";
					// 등록이 정상 처리가 됐으면 고객결제정보 테이블 insert
					if("0000".equals(resCd)) {
						TOMapper.insertToPaymentHistory(payReqMap);
						Stage = "16";		// TS 이전신청결과 미수신 상태
					} else {
						System.out.println("resCd["+resCd+"]===================================================================================================================================");
						
						if(resCd.equals("0051")){
							TOMapper.insertToPaymentHistory(payReqMap);
							text = "법적제한 계좌 ";
							Stage = "16";		// TS 이전신청결과 미수신 상태
						}else if(resCd.equals("KS23")){
							TOMapper.insertToPaymentHistory(payReqMap);
							text = "이체금액 포맷오류 ";
							Stage = "25";		// 카방->ksnet결제 시 오류							
						}else if(resCd.equals("KS32")){
							TOMapper.insertToPaymentHistory(payReqMap);
							text = "전문포맷오류, 공통부 은행코드 기입 오류 ";
							Stage = "25";		// 카방->ksnet결제 시 오류
						}else if(resCd.equals("KS03")){
							TOMapper.insertToPaymentHistory(payReqMap);
							text = "업체코드 확인불가, 서비스 이용불가 상태";
							Stage = "25";		// 카방->ksnet결제 시 오류	
						}else if(resCd.equals("KS11")){
							TOMapper.insertToPaymentHistory(payReqMap);
							text = "송금이체 잔액부족(당일지급가능액)";
							Stage = "25";		// 카방->ksnet결제 시 오류		
						}else if(resCd.equals("KS05")){
							TOMapper.insertToPaymentHistory(payReqMap);
							text = "중복전문수신";
							Stage = "25";		// 카방->ksnet결제 시 오류	
						}else{
							Stage = "25";	// 카방->ksnet결제 시 오류
						}
					}
					
					if(xml != null){
						payOk = true;
				        if("16".equals(Stage)) {
				        	xml_string_to_send += "<contents>";
					        xml_string_to_send += "<CNTC_RESULT_CODE>00000000</CNTC_RESULT_CODE>";
					        xml_string_to_send += "<CNTC_RESULT_DTLS>비용납부송신성공 "+text+"</CNTC_RESULT_DTLS>";
					        xml_string_to_send += "<RECEIVEDDATA><![CDATA["+xml+"]]></RECEIVEDDATA>";
					        xml_string_to_send += "</contents>";
				        }else{
				        	xml_string_to_send += "<contents>";
					        xml_string_to_send += "<CNTC_RESULT_CODE>99999999</CNTC_RESULT_CODE>";
					        xml_string_to_send += "<CNTC_RESULT_DTLS>("+resCd+")"+text+"</CNTC_RESULT_DTLS>";
					        xml_string_to_send += "<RECEIVEDDATA><![CDATA["+xml+"]]></RECEIVEDDATA>";
					        xml_string_to_send += "</contents>";
				        }
					}
					
					
				} else if("F".equals(rcvFlag) || "T".equals(rcvFlag)) {	// fale or timeout
					flag = true;
					Stage = "25";	// 카방->ksnet결제 시 오류
				}
				System.out.println("flag["+flag+"]===================================");
				if(flag) {
					break;
				}
			}
			System.out.println("Stage["+Stage+"]===================================");
			
			// 소유권이전 상태값 업데이트
			if(Stage.equals("")) {
				Stage = "25";  
			}
			costMap.put("Stage", Stage); 
			TOMapper.updateToTransferOwnerStage(costMap);
		}
	}else {
		//costMap.put("Stage", "29");	// 고객미결제취소
		// 소유권이전 상태값 업데이트
		//TOMapper.updateToTransferOwnerStage(costMap);
	}			


	

	
}catch(Exception e){
	e.printStackTrace();
}
		

if(payOk == false){
	xml_string_to_send += "<contents>";
    xml_string_to_send += "<CNTC_RESULT_CODE>44444444</CNTC_RESULT_CODE>";
    xml_string_to_send += "<CNTC_RESULT_DTLS>시스템에러가 발생하였습니다.</CNTC_RESULT_DTLS>";
    xml_string_to_send += "<RECEIVEDDATA><![CDATA["+xml+"]]></RECEIVEDDATA>";
    xml_string_to_send += "</contents>";
}
	
%><%--=xml.replaceAll("<\\?xml.*?>","").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\\n", "<br>") --%>
<%=xml_string_to_send%>