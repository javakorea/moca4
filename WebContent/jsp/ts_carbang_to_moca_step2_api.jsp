<?xml version="1.0" encoding="utf-8"?><%@ page contentType="text/xml; charset=UTF-8"%><%@ page language="java" pageEncoding="UTF-8"%><%@ page import="mocaframework.com.cmm.*,java.math.*,java.text.*,java.util.*,com.carbang365.*" %><%@ page import="java.util.*" %><%@ page import="java.io.*" %>
<%!
private static final org.slf4j.Logger LOGGER = org.slf4j.LoggerFactory.getLogger("ts_carbang_to_moca_step2"); 
//"taxPrice_Acquisition_RealCost"
public String getMoney(Map receiptMap,String _key){
	DecimalFormat formatter = new DecimalFormat("###,###");
	if(receiptMap.get(_key) != null && !"".equals( receiptMap.get(_key).toString()) ){
		return formatter.format( Integer.parseInt(receiptMap.get(_key).toString()) )+"원";
	}else{
		return "";
	}
}
%>
<%
	//http://dev-mycar.carbang365.co.kr:9090/to/images/youngsu/250.jpg


	request.setCharacterEncoding("utf-8");
	String xml = request.getParameter("xml");
	if(xml == null){
		xml = "파라미터값xml이 null입니다.";
	}
	
	

	
	
	System.out.println("====================================================");
	System.out.println("[TS로부터온 민원신청상태송신:ts_carbang_to_moca_step2_api.jsp]===================================================="+xml);
	System.out.println("====================================================");
	String xml_string_to_send = "";
	if(xml != null){
        xml_string_to_send += "<contents>";
        xml_string_to_send += "__s1__";
        xml_string_to_send += "__s2__";
        xml_string_to_send += "<RECEIVEDDATA><![CDATA["+xml+"]]></RECEIVEDDATA>";
        xml_string_to_send += "</contents>";
	}
	String s1 = "<CNTC_RESULT_CODE>00000000</CNTC_RESULT_CODE>";
	String s2 = "<CNTC_RESULT_DTLS></CNTC_RESULT_DTLS>";
	
	
	org.springframework.web.context.WebApplicationContext wac = org.springframework.web.context.support.WebApplicationContextUtils.getWebApplicationContext(((HttpServletRequest) request).getSession().getServletContext());
	com.carbang365.TOServiceImpl tOService = (com.carbang365.TOServiceImpl)wac.getBean("toService");
	com.carbang365.TOMapper TOMapper = (com.carbang365.TOMapper)wac.getBean("TOMapper");
	try{
		String Stage = "27";	// 이전신청완료
		Map<String, Object> paramMap = new HashMap<String, Object>();
		
		// xml String 형식으로 데이터가 온다고 함.
		// 아래는 임시. 어떤식으로 올지는 받아봐야 함
		
//		req.getParameter("header");
//		req.getParameter("body");
		
		// xml 파싱
		Map<String, String> xmlMap = new HashMap<String, String>();	// 파싱 후 map으로 casting하여 xmlMap에 담기
		
		// 파싱 후 전문 응답값 key value set
		
		//REQST_RCEPT_NO	// 신청접수번호 : 우리가 채번하는 값임. 해당 번호에 소유권이전 IDX가 들어갈거임. 
		// 요청 시 채번 형식은 yyyyMMddHHss + 소유권이전 테이블 idx 값으로 채번 예정
		// String idx = "";
		// String reqRceptNo = //파싱된 데이터의 REQST_RCEPT_NO
		// idx = reqRceptNo.substring(12, reqRceptNo.length());	// 소유권이전 id
		
//		신청접수번호	REQST_RCEPT_NO	1	VARCHAR2	Y	20 	요청기관 PK
//		민원신청접수번호	CVPL_REQST_NO	1	VARCHAR2	Y	20 	신청번호 PK
//		처리상태	REQST_PROCESS_STTUS_CODE	1	VARCHAR2	Y	2 	등록대기, 반려, 등록완료
//		반려사유	CVPL_RETURN_RESN_DTLS	1	VARCHAR2	Y	20	반려사유

/* 			String REQST_RCEPT_NO = "20210122111322";
		String idx = req.getParameter("idx");
		
		REQST_RCEPT_NO = REQST_RCEPT_NO + idx;
		
		 */
		
		
		
		
		
		
/* 			 <?xml version="1.0" encoding="UTF-8"?>
		 <contents>
			 <REQST_RCEPT_NO>250</REQST_RCEPT_NO>
			 <CVPL_REQST_NO>mxgs-001</CVPL_REQST_NO>
			 <REQST_PROCESS_STTUS_CODE>success</REQST_PROCESS_STTUS_CODE>
			 <CVPL_RETURN_RESN_DTLS></CVPL_RETURN_RESN_DTLS>
		 </contents>
*/
		String _xml = xml;
		String REQST_RCEPT_NO = Util.getXmlValue(_xml, "REQST_RCEPT_NO");
		String CVPL_REQST_NO = Util.getXmlValue(_xml, "CVPL_REQST_NO");
		String REQST_PROCESS_STTUS_CODE = Util.getXmlValue(_xml, "REQST_PROCESS_STTUS_CODE");
		String CVPL_RETURN_RESN_DTLS = Util.getXmlValue(_xml, "CVPL_RETURN_RESN_DTLS");
		// ================================== 임시 값 시작
		xmlMap.put("REQST_RCEPT_NO", REQST_RCEPT_NO);	// 신청접수번호(요청기관 PK)
		xmlMap.put("CVPL_REQST_NO", CVPL_REQST_NO);		// 민원신청접수번호(신청번호 PK)
		xmlMap.put("REQST_PROCESS_STTUS_CODE", REQST_PROCESS_STTUS_CODE);	// 처리상태
		xmlMap.put("CVPL_RETURN_RESN_DTLS", CVPL_RETURN_RESN_DTLS);		// 반려사유
		// ==================================  임시 값 끝
		
		String reqstRceptNo 			= (String)xmlMap.get("REQST_RCEPT_NO");
		String TransferOwnerIndex 		=  Integer.parseInt(reqstRceptNo.substring(14))+"";	// 소유권이전 id
		paramMap.put("idx", TransferOwnerIndex);
		paramMap.put("ResultCode", REQST_PROCESS_STTUS_CODE);
		if("02".equals(REQST_PROCESS_STTUS_CODE)){
			String PROCESS_IMPRTY_RESN_DTLS = Util.getXmlValue(_xml, "PROCESS_IMPRTY_RESN_DTLS");
			Stage = "113";// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////이전등록오류
			paramMap.put("Stage", Stage);
			TOMapper.updateToTransferOwnerStage(paramMap);
		}else{
			// 처리상태 정상일때만 소유권이전 업데이트 및 고객환불처리. 현시점에서 정상 코드가 어떤건지 모르므로 분기문 주석처리. 추후 TS 전문확정 후 응답코드에 따라 아래 분기문 해제해야함
//			if("01".equals(REQST_PROCESS_STTUS_CODE)) {
			Map<String, Object> transferMap = TOMapper.selectToTransferOwner(paramMap);
			System.out.println("[transferMap]::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::"+transferMap);
			// 고객결제상태, 공단입금완료 이면 카방계산비용 - 공단입금비용
			String CarbangDeposit = (String) transferMap.get("CarbangDeposit");	// 카방계산비용 입금유무
			String CorpDeposit = (String) transferMap.get("CorpDeposit");		// 공단청구비용 입금유무
			System.out.println("[카방계산비용 입금]::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::"+CarbangDeposit);
			System.out.println("[공단청구비용 입금]::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::"+CorpDeposit);
			System.out.println("[total_TransferOwner_Price]::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::"+transferMap.get("total_TransferOwner_Price"));
			System.out.println("[totRgfeAmount]::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::"+transferMap.get("totRgfeAmount"));	
			// 고객결제완료, 공단입금 완료이면

			s1 = "<CNTC_RESULT_CODE>00000000</CNTC_RESULT_CODE>";
			s2 = "<CNTC_RESULT_DTLS>CarbangDeposit:"+CarbangDeposit+",CorpDeposit:"+CorpDeposit+"</CNTC_RESULT_DTLS>";
			if("입금".equals(CarbangDeposit) && "입금".equals(CorpDeposit)) {
				BigDecimal total_TransferOwner_Price = new BigDecimal(transferMap.get("total_TransferOwner_Price").toString());	// 카방 계산 총 이전비용
				BigDecimal CustomerAddPayPrice = new BigDecimal(transferMap.get("CustomerAddPayPrice").toString());	// 고객추가금액
				BigDecimal totRgfeAmount = new BigDecimal(transferMap.get("totRgfeAmount").toString());// 공단청구비용 이전등록비용
				BigDecimal agencyFee_PurchaseBond_CarBang = new BigDecimal(transferMap.get("agencyFee_PurchaseBond_CarBang").toString());// 채권대행료
				BigDecimal agencyFee_Transfer_CarBang = new BigDecimal(transferMap.get("agencyFee_Transfer_CarBang").toString());// 카방대행수수료
				
				
				BigDecimal diffPrice = null;																					// 차액
				
				System.out.println("[마지막정산]::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::");
				System.out.println(">>total_TransferOwner_Price>>"+total_TransferOwner_Price);
				System.out.println(">>totRgfeAmount>>"+totRgfeAmount);
				System.out.println(">>환불금액>>"+(BigDecimal)tOService.calcReturnPay(transferMap));
				System.out.println(":::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::");
				/* 환불금 = (고객입금액+고객추가입금액) - 공단이체 - 채권대행료 - 이전대행료 
						
						
				   1.고객입금액 : TO_COST.total_TransferOwner_Price -> total_TransferOwner_Price
				   2.고객추가입금액 : TO_COST.CustomerAddPayPrice -> CustomerAddPayPrice
				   3.공단이체 : TO_TRANSFEROWNER_COST_TS.totRgfeAmount
				   4.채권대행료 : (채권구매 대행율)비용관리:지역별 TO_TRANSFEROWNER_COST_MNG.PurchaseBond_CarBang -> agencyFee_PurchaseBond_CarBang
				   5.이전대행료 : (카방대행수수료)비용관리:지역별 TO_TRANSFEROWNER_COST_MNG.Carbang_RegistrationFee -> agencyFee_Transfer_CarBang
				 
				 
			 	 * 고객이 입금한 총금액에서 공단이 비용납부정보송신 전문으로 요청한 금액과 비용설정관리에서 설정한 채권대행료(0.415%)와 이전대행료(20,000)를 제한 금액이 환불금이 됩니다.
			     */ 
						 
				// 카방 계산비용이 공단 입금비용보다 크면 환불처리
				diffPrice = tOService.calcReturnPay(transferMap);
				s1 = "<CNTC_RESULT_CODE>00000000</CNTC_RESULT_CODE>";
				s2 = "<CNTC_RESULT_DTLS>diffPrice:"+diffPrice+"</CNTC_RESULT_DTLS>";
				//if(total_TransferOwner_Price.compareTo(totRgfeAmount) == 1) {
				if(
						diffPrice.compareTo(BigDecimal.ZERO) == 1
						
				) {
					
					Stage = "23";//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////환급준비중
					paramMap.put("Stage", Stage);
					TOMapper.updateToTransferOwnerStage(paramMap);
					System.out.println("[마지막 환불처리시작]::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::");
					
					
					Map<String, Object> payReqMap = new HashMap<String, Object>();
					
					
					//diffPrice = total_TransferOwner_Price.subtract(totRgfeAmount);
					
					SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
					String reqDt = sdf.format(new Date());
					payReqMap.put("reqDt", reqDt);		// 요청일자
					
					payReqMap.put("Pay_type", "3");													// 결제구분 (1: 고객-카방, 2: 카방-공단, 3: 카방-고객)
					payReqMap.put("TransferOwnerIndex", TransferOwnerIndex);
					payReqMap.put("TransferOwnerIdx", TransferOwnerIndex);
					
					
					
					/* 카방계좌세팅 */
					paramMap.put("idx", TransferOwnerIndex);
					Map bankInfo = TOMapper.selectCarbangBankInfo(paramMap);
					payReqMap.put("bankCd", bankInfo.get("bankCd"));													// 출금은행코드
					payReqMap.put("bankNm", bankInfo.get("bankNm"));												// 출금은행명
					payReqMap.put("accountNo", bankInfo.get("accountNo"));									// 출금은행계좌
					payReqMap.put("bankOwner", bankInfo.get("bankOwner"));											// 출금계좌예금주
					
					
					
					
					payReqMap.put("bank_deposit_owner", transferMap.get("Customer_Bank_Owner"));	// 입금계좌주
					payReqMap.put("bank_deposit_cd", transferMap.get("Customer_Bank_Cd"));			// 입금은행코드
					payReqMap.put("bank_deposit_name", transferMap.get("Customer_Bank_Name"));		// 입금계좌명
					payReqMap.put("bank_deposit_account", transferMap.get("Customer_Account"));		// 입금계좌번호
					payReqMap.put("traceNo", "");													// 납부자번호 (비동기 전문수신이므로 납부자번호 없음. 추후 넣을 수 있는지 확인)
					payReqMap.put("userIdx", "admin");												// 사용자id
					payReqMap.put("payAmount", diffPrice);										// 출금금액
					//payReqMap.put("payAmount", "10000");											// 출금금액(임시. 테스트용이라 큰 금액을 넣으면 당일지급가능액 오류나는듯. 운영 시에는 제거, 위 주석해제처리!! to_do)
					payReqMap.put("payComnt", "고객환급비용");											// 출금통장적요
					payReqMap.put("depositComnt", "고객환급비용");										// 입금통장적요
					
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
					
					//[결제3:이전완료후환불]
					payReqMap.put("caller", "getTransferOwnerRstTsForSchedule(이전완료후환불)");
					payReqMap.put("SERVICE","getTransferOwnerRstTsForSchedule");
					int cnt = tOService.insertTradeRequestBin(payReqMap);
					if(cnt > 0) {
						boolean flag = false;
						for(int z=0; z < 20; z++) {
							Thread.sleep(3000);
							Map<String, Object> resMap = TOMapper.selectTradeRequestBin(payReqMap);
							String rcvFlag = (String) resMap.get("RECV_FLAG"); // 응답구분
							System.out.println("rcvFlag["+rcvFlag+"]::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::"+resMap);
							if("Y".equals(rcvFlag)) {
								flag = true;
								
								String resStr = (String) resMap.get("RECV_MSG"); 	// 응답전문내용
								String resCd = resStr.substring(51, 55);			// 공통부 은행응답코드 
								
								LOGGER.debug("resCd	::: "+resCd);
								
								// 등록이 정상 처리가 됐으면 고객결제정보 테이블 환불내역 insert
								if("0000".equals(resCd)) {
									TOMapper.insertToPaymentHistory(payReqMap);
									Stage = "18";// 환급(완료)	18//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////환급완료
									s1 = "<CNTC_RESULT_CODE>00000000</CNTC_RESULT_CODE>";
									s2 = "<CNTC_RESULT_DTLS>Stage:"+Stage+":환급(완료)</CNTC_RESULT_DTLS>";
								} else if("KS11".equals(resCd) || "0021".equals(resCd)) {
									Stage = "21";// 카방계좌부족 미환급
									s1 = "<CNTC_RESULT_CODE>00000000</CNTC_RESULT_CODE>";
									s2 = "<CNTC_RESULT_DTLS>Stage:"+Stage+":계좌금액부족 미환급</CNTC_RESULT_DTLS>";
								} else if("KS11".equals(resCd) || "0021".equals(resCd)) {
									Stage = "21";// 카방계좌부족 미환급
									s1 = "<CNTC_RESULT_CODE>00000000</CNTC_RESULT_CODE>";
									s2 = "<CNTC_RESULT_DTLS>Stage:"+Stage+":법적제한 계좌</CNTC_RESULT_DTLS>";
								} else if("0051".equals(resCd)) {	
									String text = "";
									TOMapper.insertToPaymentHistory(payReqMap);
									text = "법적제한 계좌 ";
									Stage = "18";		// TS 이전신청결과 미수신 상태
									s1 = "<CNTC_RESULT_CODE>00000000</CNTC_RESULT_CODE>";
									s2 = "<CNTC_RESULT_DTLS>Stage:"+Stage+":법적제한 계좌</CNTC_RESULT_DTLS>";
								} else {
									Stage = "22";////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////환급오류
									s1 = "<CNTC_RESULT_CODE>00000000</CNTC_RESULT_CODE>";
									s2 = "<CNTC_RESULT_DTLS>Stage:"+Stage+":결제오류 "+resCd+"</CNTC_RESULT_DTLS>";
								}
								
							} else if("F".equals(rcvFlag) || "T".equals(rcvFlag)) {	// fale or timeout
								flag = true;
								Stage = "25";	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 카방->ksnet결제 시 오류
								s1 = "<CNTC_RESULT_CODE>00000000</CNTC_RESULT_CODE>";
								s2 = "<CNTC_RESULT_DTLS>Stage:"+Stage+":결제오류 F 또는 T</CNTC_RESULT_DTLS>";
							}
							if(flag) {
								break;
							}
						}
					}
				}else if(diffPrice.compareTo(BigDecimal.ZERO) == 0){
					//환급없음
					Stage = "19";// 환급없음,금액딱맞게끝남 /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////환급없음
					s1 = "<CNTC_RESULT_CODE>00000000</CNTC_RESULT_CODE>";
					s2 = "<CNTC_RESULT_DTLS>Stage:"+Stage+":환급없음</CNTC_RESULT_DTLS>";
				}else if(diffPrice.compareTo(BigDecimal.ZERO) == -1){
					Stage = "20";// 고객입금부족
					s1 = "<CNTC_RESULT_CODE>00000000</CNTC_RESULT_CODE>";
					s2 = "<CNTC_RESULT_DTLS>Stage:"+Stage+":고객입금액부족</CNTC_RESULT_DTLS>";
				} else { 
				}
				System.out.println("Stage["+Stage+"]===================================");
				paramMap.put("compYn", "Y");
				paramMap.put("Stage", Stage);
				// 소유권이전 상태값 업데이트`
				System.out.println("마지막상태업데이트::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::"+paramMap);
				TOMapper.updateToTransferOwnerStage(paramMap);
				if("18".equals(Stage) || "19".equals(Stage)){
					//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////영수증정상발급
					// 화면에서 보내야 하는 값
//					String idx = (String) paramMap.get("idx");	// 소유권이전 idx
					paramMap.put("idx", TransferOwnerIndex);
					// 영수증 조회
					Map<String, Object> receiptMap = TOMapper.selectReceiptInfo(paramMap);
					Map<String, Object> bizMap = TOMapper.selectBiztalkInfo(paramMap); 
					
					s1 = "<CNTC_RESULT_CODE>00000000</CNTC_RESULT_CODE>";
					s2 = "<CNTC_RESULT_DTLS>receiptMap:"+receiptMap+",bizMap:"+bizMap+"</CNTC_RESULT_DTLS>";
					
					int addPrice = 0;		// 추가금
					String returnPrice = "";	// 반환금
					int total_TransferOwner_Price2 = Integer.parseInt(receiptMap.get("total_TransferOwner_Price").toString()); 	// 총이전비용
					int Pay_Amount = Integer.parseInt(receiptMap.get("Pay_Amount").toString()); 	// 고객수취금액
					
					// 이전비용이 고객입금비용보다 크면
					/* if(total_TransferOwner_Price2 > Pay_Amount) {
						//addPrice = total_TransferOwner_Price2 - Pay_Amount;
					} else  */
					if(diffPrice.compareTo(BigDecimal.ZERO) == 1){
						returnPrice = diffPrice.toPlainString();
					}
					System.out.println("//////////////////////////////////////////////transferMap CustomerAddPayPrice:"+transferMap);
					System.out.println(returnPrice+"//////////////////////////////////////////////returnPrice diffPrice:"+diffPrice);
					receiptMap.put("addPrice", transferMap.get("CustomerAddPayPrice"));
					receiptMap.put("returnPrice", returnPrice);
					//C:\zzz\git\TO\WebContent\images\carbang\receipt.png

					
					
					
					//이전일자 ApprovedTime
					//취등록세 taxPrice_Acquisition_RealCost
					//채권(공채)세액및비용 bondInfo_SellingSelPayfPrice
					//등록수수료 Office_RegistrationFee
					//전자수입인지 Revenue_StampPrice
					//대행수수료 Carbang_RegistrationFee
					//토탈 total_TransferOwner_Price
					//고객수취 Pay_Amount
					//이전총비용
					//추가금액
					//반환금액
					

					
					receiptMap.put("returnPrice",returnPrice+"");
					receiptMap.put("addPrice",addPrice+"");
					
					Map param = new HashMap();
					param.put("ApprovedTime", receiptMap.get("ApprovedTime")+":600:200");
					
					param.put("taxPrice_Acquisition_RealCost", getMoney(receiptMap,"taxPrice_Acquisition_RealCost")+":640:340:right");//+60
					param.put("bondInfo_SellingSelPayfPrice", getMoney(receiptMap,"bondInfo_SellingSelPayfPrice")+":640:400:right");
					param.put("Office_RegistrationFee", getMoney(receiptMap,"Office_RegistrationFee")+":640:460:right");
					param.put("Revenue_StampPrice", getMoney(receiptMap,"Revenue_StampPrice")+":640:510:right");
					param.put("Carbang_RegistrationFee", getMoney(receiptMap,"Carbang_RegistrationFee")+":640:570:right");
					
					
					param.put("total", ""+getMoney(receiptMap,"total_TransferOwner_Price")+":540:646");
					
					
					param.put("Pay_Amount", ""+getMoney(receiptMap,"Pay_Amount")+":80:730");
					param.put("total_TransferOwner_Price", ""+getMoney(receiptMap,"total_TransferOwner_Price")+":280:730");
					param.put("addPrice", ""+getMoney(receiptMap,"addPrice")+":480:730");
					param.put("returnPrice", ""+getMoney(receiptMap,"returnPrice")+":590:730");
					
					String srcDir = "/home/ubuntu/TO/apache-tomcat-9.0.39/webapps/to/images/carbang/";
					String srcName = "receipt.png";
					String targetDir = "/home/ubuntu/TO/apache-tomcat-9.0.39/webapps/to/images/youngsu/";
					
					Map confMap = new HashMap();
					confMap.put("srcDir", srcDir);
					confMap.put("srcName", srcName);
					confMap.put("targetDir", targetDir+TransferOwnerIndex+"");
					try{
						String fileName = Util.makeYungsuDoc(param,confMap); 
						System.out.println(fileName+" created! ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::"+fileName);	
					}catch(Exception e3){
						
					}

					//model.addAttribute("pdf", ((String)fileNames.get("pdf")).replaceAll("/home/ubuntu/TO/apache-tomcat-9.0.39/webapps/to/", "http://dev-mycar.carbang365.co.kr:9090/to/"));
					//model.addAttribute("image", ((String)fileNames.get("image")).replaceAll("/home/ubuntu/TO/apache-tomcat-9.0.39/webapps/to/", "http://dev-mycar.carbang365.co.kr:9090/to/"));
					
					String A6 = request.getRequestURL().toString().replaceAll(request.getRequestURI(),"")+request.getContextPath()+"/images/youngsu/"+TransferOwnerIndex+".jpg";
					transferMap.put("A6", A6);
					paramMap.put("today", Util.getToday("yyyy년MM월dd일"));
					Util.biz_talk_api(transferMap,paramMap,bizMap);  
				}
				
			}else if("입금".equals(CarbangDeposit) && "미입금".equals(CorpDeposit)) {
				System.out.println("STEP2 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::");
				Stage = "128";  // 이전신청오류	28	고객결제, 공단결제 후 이전신청 결과로 오류코드가 오는 경우	0125 추가
				s1 = "<CNTC_RESULT_CODE>00000000</CNTC_RESULT_CODE>";
				s2 = "<CNTC_RESULT_DTLS>Stage:"+Stage+":공단미입금</CNTC_RESULT_DTLS>";
				paramMap.put("compYn", "Y");
				paramMap.put("Stage", Stage);
				// 소유권이전 상태값 업데이트
				TOMapper.updateToTransferOwnerStage(paramMap);
			} else {
				System.out.println("STEP2 ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::");
				Stage = "28";  // 이전신청오류	28	고객결제, 공단결제 후 이전신청 결과로 오류코드가 오는 경우	0125 추가
				s1 = "<CNTC_RESULT_CODE>00000000</CNTC_RESULT_CODE>";
				s2 = "<CNTC_RESULT_DTLS>Stage:"+Stage+":이전신청오류</CNTC_RESULT_DTLS>";
				paramMap.put("compYn", "Y");
				paramMap.put("Stage", Stage);
				// 소유권이전 상태값 업데이트
				TOMapper.updateToTransferOwnerStage(paramMap);
			}
		}
		
		
	}catch(Exception e){
		e.printStackTrace();
	}
	
	xml_string_to_send = xml_string_to_send.replaceAll("__s1__",s1).replaceAll("__s2__",s2);
%><%--=xml.replaceAll("<\\?xml.*?>","").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\\n", "<br>") --%>
<%=xml_string_to_send%>