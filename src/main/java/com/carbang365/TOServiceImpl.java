package com.carbang365;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.collections.MapUtils;
import org.apache.commons.lang3.StringUtils;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.ModelMap;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import egovframework.com.cmm.service.Globals;
import egovframework.com.utl.sim.service.EgovFileCmprs;
import egovframework.com.utl.sim.service.EgovFileTool;
import egovframework.let.utl.fcc.service.EgovStringUtil;
import mocaframework.com.cmm.API;
import mocaframework.com.cmm.U;
import mocaframework.com.cmm.Util;

@Service("toService")
public class TOServiceImpl implements TOServiceInterface {
	private static final Logger LOGGER = LoggerFactory.getLogger(TOServiceImpl.class);
	boolean testMode = true;
	
	@Autowired
	TOMapper TOMapper;
		
	@Transactional(propagation = Propagation.REQUIRED, rollbackFor={Exception.class})
	public String insertMemoJson(Map<String, Object> mocaMap, ModelMap model) throws Exception {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			List list_D = (List)paramMap.get("paramList_D");
			String TransferOwnerIdx = (String)paramMap.get("TransferOwnerIdx");
			String SESS_USERID = (String)paramMap.get("SESS_USERID");
			String SESS_USERNM = (String)paramMap.get("SESS_USERNM");
					
					
			//Detail처리==========================================================================================================================================
			//삭제대상을 먼저삭제해야 insert시 문제가 없다.
			for(int i=0;i < list_D.size() ;i++) {
				Map row = (Map)list_D.get(i);
				if("D".equalsIgnoreCase(U.getStatus(row)) ) {
					row.put("TransferOwnerIdx", TransferOwnerIdx);
					row.put("SESS_USERID", SESS_USERID);
					row.put("SESS_USERNM", SESS_USERNM);
		    		model.addAttribute("cnt", TOMapper.deleteMemo(row));
		    	}
			}
			for(int i=0;i < list_D.size() ;i++) {
				Map row = (Map)list_D.get(i);
		    	if("C".equalsIgnoreCase(U.getStatus(row)) ) {
					row.put("TransferOwnerIdx", TransferOwnerIdx);
					row.put("SESS_USERID", SESS_USERID);
					row.put("SESS_USERNM", SESS_USERNM);	
		    		model.addAttribute("cnt", TOMapper.insertMemo(row));
		    	}else if("U".equalsIgnoreCase(U.getStatus(row)) ) {
		    	}
		
			}
			return "";
	};
	
	//@Transactional(propagation = Propagation.REQUIRED, rollbackFor={Exception.class})
	public String TO_006_updateAcquistionPrice(Map<String, Object> mocaMap, ModelMap model) throws Exception {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			

			String year = (String) paramMap.get("Year");
			Calendar cal = Calendar.getInstance();
			int year_int = cal.get(Calendar.YEAR);
			// 최초 조회 시 연도가 없으면 현재연도 set
			if(StringUtils.isEmpty(year)) {
				paramMap.put("Year", year_int+"");
			}else if("thisYear".equalsIgnoreCase(year)){
				paramMap.put("Year", year_int+"");
			}else if("nextYear".equalsIgnoreCase(year)){
				paramMap.put("Year", (year_int+1)+"");
			}
			
			
			
			
			int cnt = 0;
//			조회 시 목록의 모든 차종, 모든 연료 그대로 화면에서 보내야함. 값이 없으면 0으로 set
//			목록 형식은 /TO_006/acquistionPriceList.do의 return 값과 동일함. 목록명  : acquistionPriceList
			List<Map<String, Object>> acquistionPriceList = (List<Map<String, Object>>) paramMap.get("acquistionPriceList");
			if(acquistionPriceList.size() <= 0) {
				throw new Exception("수정대상 목록이 없습니다.");
			} else {
				year = (String)paramMap.get("Year");
				// 취득세율 저장 시 백분율 -> 실제 값으로 변경
				for(Map<String, Object> acquistionPrice : acquistionPriceList) {
					TOUtil.setPercentToRate(acquistionPrice,"Acquisition_taxRate");
					TOUtil.setIntValue(acquistionPrice,"ReductionPrice1");		
					TOUtil.setIntValue(acquistionPrice,"ReductionPrice2");	
					TOUtil.setDateValue(acquistionPrice,"LimitDate1");	
					TOUtil.setDateValue(acquistionPrice,"LimitDate2");	
					acquistionPrice.put("Year", year);
				}
			}
			
			//String year = (String) acquistionPriceList.get(0).get("Year");
			
			
			
			

			
			// 1. 취득세율 삭제
			cnt += TOMapper.deleteAcquistionTax(paramMap);
			// 2. 취득세율 저장
			cnt += TOMapper.insertAcquistionTax(paramMap);
			// 3. 감면금액 삭제
			cnt += TOMapper.deleteAcquistionReducePrice(paramMap);
			// 4. 기본감면금액 저장
			cnt += TOMapper.insertAcquistionReducePrice(paramMap);
			// 4. 친환경감면금액 저장
			cnt += TOMapper.insertAcquistionReducePriceEco(paramMap);
			
			model.addAttribute("cnt", cnt);
			
		return "";
	};
	
	public int excelUp(String filePath,Map paramMap,ModelMap model) throws Exception {
		int cnt = 0;
		try {
		 	String srcId = (String)paramMap.get("srcId");
		 	String uploadType = (String)paramMap.get("uploadType");
            if("MT_GRID".equalsIgnoreCase(srcId)) {//금융기관DB
            	List excelList = (List)paramMap.get("excelList");
            	paramMap.put("fincialList", excelList);
				if("2".equals(uploadType)) {
					TOMapper.deleteFincialDbInfo(paramMap);
				}
				cnt = TOMapper.insertFincialDbInfo(paramMap);
				model.addAttribute("cnt", cnt); 
	    		model.addAttribute("grdId", (String)paramMap.get("grdId"));
	    		model.addAttribute("pageId", (String)paramMap.get("pageId"));
	    		model.addAttribute("srcId", (String)paramMap.get("srcId"));
            }else if("TO_007S01".equalsIgnoreCase(srcId)) {
			 	if(uploadType.equals("2")) {
			 		TOMapper.deleteStndCarPriceList(paramMap);
				}
	            cnt = TOMapper.updateStndCarPriceList(paramMap);
				model.addAttribute("cnt", cnt); 
	    		model.addAttribute("grdId", (String)paramMap.get("grdId"));
	    		model.addAttribute("pageId", (String)paramMap.get("pageId"));
	    		model.addAttribute("srcId", (String)paramMap.get("srcId"));
	    		
				paramMap.put("inqType", "0");
				model.addAttribute("stndCarPriceList", TOMapper.selectStndCarPriceList(paramMap));
				model.addAttribute("stndCarPriceCntList", TOMapper.selectStndCarPriceListCnt());
            }
         }catch (Exception e) {
            e.printStackTrace();
            model.addAttribute("error", e.getMessage());
         }
		 return cnt;
	};
	

	public int TO_005_updateVehicleRate(Map<String, Object> mocaMap, ModelMap model) throws Exception{
		Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
		// 서비스 테스트용 구문 추가
		if(MapUtils.isEmpty(paramMap)) {
			paramMap = mocaMap;
		}
		int cnt = 0; 
		String inqType = (String) paramMap.get("inqType");
		
		// 차량감가적용율 수정
		if("1".equals(inqType)) {
			// 기존 데이터 삭제
			TOMapper.deleteOriRate(paramMap);
			// 변경 데이터 insert
			cnt = TOMapper.insertOriRate(paramMap);
			
		} else if("2".equals(inqType)) {	// 차량시세추가적용율 수정
			// 기존 데이터 삭제
			TOMapper.deleteAddRate(paramMap);
			// 변경 데이터 insert
			cnt = TOMapper.insertAddRate(paramMap);
			
		} else {	// 차량 중간/상한가 수정
//			String MdlRate = (String) paramMap.get("MdlRate");
//			String UpRate = (String) paramMap.get("UpRate");
//			
//			if(StringUtils.isEmpty(MdlRate) && StringUtils.isEmpty(UpRate)) {
//				throw new NullPointerException("비율이 없습니다");
//			}
			cnt = TOMapper.updateAddRatePercent(paramMap);
		}
		return cnt;
	}
	
	
	public int TO_010_updateTransferCostMng(Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			// 저장 시 백분율을 실 값으로 변환
			List<Map<String, Object>> costMngList = (List<Map<String, Object>>) paramMap.get("costMngList");
			
			for(Map<String, Object> costMng : costMngList) {
				BigDecimal Bank_IncomeRate = new BigDecimal((String) costMng.get("Bank_IncomeRate"));				// 은행이율
				BigDecimal Bank_IncomeTax = new BigDecimal((String) costMng.get("Bank_IncomeTax"));					// 소득세
				BigDecimal Bank_LocalTax = new BigDecimal((String) costMng.get("Bank_LocalTax"));					// 지방소득세
				BigDecimal Bank_AgencyFee = new BigDecimal((String) costMng.get("Bank_AgencyFee"));					// 증권/은행 대행수수료
				BigDecimal PurchaseBond_CarBang = new BigDecimal((String) costMng.get("PurchaseBond_CarBang"));		// 채권구매대행율
				
				Bank_IncomeRate = Bank_IncomeRate.divide(new BigDecimal("100"));
				Bank_IncomeTax = Bank_IncomeTax.divide(new BigDecimal("100"));
				Bank_LocalTax = Bank_LocalTax.divide(new BigDecimal("100"));
				Bank_AgencyFee = Bank_AgencyFee.divide(new BigDecimal("100"));
				PurchaseBond_CarBang = PurchaseBond_CarBang.divide(new BigDecimal("100"));

				costMng.put("Bank_IncomeRate", Bank_IncomeRate.toPlainString());
				costMng.put("Bank_IncomeTax", Bank_IncomeTax.toPlainString());
				costMng.put("Bank_LocalTax", Bank_LocalTax.toPlainString());
				costMng.put("Bank_AgencyFee", Bank_AgencyFee.toPlainString());
				costMng.put("PurchaseBond_CarBang", PurchaseBond_CarBang.toPlainString());
			}
			
			// 값이 없어도 TO_010/transferCostMngList.do return 목록 그대로 화면에서 보내야함. 목록명 : costMngList
			// 1. 비용관리 삭제
			TOMapper.deleteToTransferCostMng();
			// 2. 비용관리 저장
			int cnt = TOMapper.insertToTransferCostMng(paramMap);
			return cnt;
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
		return 0;
	}
	
	// 결제(KSNET) 전문 insert
	public int insertTradeRequestBin(Map<String, Object> paramMap) throws Exception{
		int insertCnt = 0;
		// 오늘날짜 전문번호 조회
		String sendIdx = TOMapper.selectTradeReqBinSeq();
		
		// 전문 일련번호 채번
		if(StringUtils.isEmpty(sendIdx)) {
			// 전문번호는 일자마다 초기화, 당일자 데이터가 없으면000001
			sendIdx = String.format("%06d", 1);
		} else {
			int tmpInt = Integer.parseInt(sendIdx) + 1;
			sendIdx = String.format("%06d", tmpInt);
		}
		// 전문 테이블 insert를 위한 값 set
		paramMap.put("seqNo", sendIdx);			// 전문일련번호
		
		// 서비스타입
		String sendType = (String) paramMap.get("sendType");
		String serviceType = "";
		if("7".equals(sendType)) {	// 송금이체
			serviceType = "PAY";
		} else {
			serviceType = "DBT";
		}
		paramMap.put("serviceType", serviceType);
		// 간편결제_계좌등록 전문 insert 
//			tODBcarbangDevapiMapper.insertTradeRequestBin(paramMap);	// 임시. db가 나눠져있어 개발db mapper 호출. 추후 삭제예정
		LOGGER.debug(">>>>>>>>>>>TOMapper.insertTradeRequestBin>>>>>>>>>>>>>"+paramMap);
		insertCnt = TOMapper.insertTradeRequestBin(paramMap);	// 임시. 추후 db합쳐지면 주석해제
		LOGGER.debug(">>>>>>>>>>>insertCnt>>>>>>>>>>>>>"+insertCnt); 
		Set s = paramMap.keySet();
		Iterator it = s.iterator();
		String params = "";
		while(it.hasNext()) {
			String key = (String)it.next();
			String val = "";
			if(paramMap.get(key) != null) {
				val = paramMap.get(key).toString();
				if(val != null) {
					key = key.trim();
					val = val.trim();
				}
			}
			params +=key+"_____"+val+"~~~~~";
		}
		paramMap.put("PARAM",params);
		LOGGER.debug(">>>>>>>>>>>paramMap.get(\"SERVICE\")>>>>>>>>>>>>>"+paramMap.get("SERVICE"));
		if(paramMap.get("SERVICE") != null) {
			insertCnt = TOMapper.insertTradeRequestBinForTO(paramMap);
		}
		return insertCnt;
	};
	
	/*
	 * 결제이력남기기
	 * @see com.carbang365.TOServiceInterface#insertToPaymentHistory(java.util.Map)
	 */
	public String insertToPaymentHistory(Map<String, Object> payReqMap) throws Exception{
		String idx = this.getAutoCrement("TO_PAYMENT_HISTORY");
		payReqMap.put("idx",idx);
		int cnt = TOMapper.insertToPaymentHistory(payReqMap);
		return idx;
	};

	private String getAutoCrement(String table_name) {
		Map m = new HashMap();
		m.put("table_name", table_name);
		String s = TOMapper.selectAutoIncrement(m);
		return s;
	};
	
	
	
	
	
	
	
	
	
	/*
	 * [스케쥴러용] 약관적용일이 되면 적용하기
	 * @see com.carbang365.TOServiceInterface#TO_012_updateEnable(java.util.Map, org.springframework.ui.ModelMap)
	 */
	public int TO_012_updateEnable() throws Exception {
		// TO_DO
		// 당일이 해당 약관의 적용일이면 기존약관 미적용/ 해당약관 적용 처리 하는부분 필요할듯.
		// 이건 수동약관 적용/미적용 처리를 위한거니까 그대로 두고... 위에건 스케줄러로 돌려야할지 협의 필요.
		
		// 해당 항목 약관 적용여부 일괄 미적용 처리
		int cnt = 0;
		List TermsUpCds = TOMapper.selectTermsUpCds(new HashMap());
		for(int i=0; i < TermsUpCds.size(); i++) {
			Map row  = (Map)TermsUpCds.get(i);
			String TermsUpCd = (String)row.get("TermsUpCd");
			Map p = new HashMap();
			p.put("TermsUpCd", TermsUpCd);
			List list = TOMapper.selectForUpdateTermsEnable(p);
			if(list.size() > 0) {
				TOMapper.deleteTermsEnable(p);
				cnt = TOMapper.updateTermsEnable(p);
			}
		}
		 


		return cnt;
	};
	
	
	
	//[결제1:이전비용확정후해당비용공단입금]
	//@RequestMapping(value = "/schedule/poll_insertTradeRequestBinForSchedule.do")
	//@Transactional(propagation = Propagation.REQUIRED, rollbackFor = {Exception.class})
	/*
	 * [스케쥴러용] TS이전비용확정후 입금한 금액에 대한 결과확인
	 * @see com.carbang365.TOServiceInterface#TO_012_updateEnable(java.util.Map, org.springframework.ui.ModelMap)
	 */
	//public void selectListForInsertTradeRequest() throws Exception {
	public void reciveTransferOwnerPriceTsAfter() throws Exception {
		String logTitle = "[결제2:TS비용확정 전문을수신하고즉시이체하고후속처리:reciveTransferOwnerPriceTsAfter]";
		try {
LOGGER.info(logTitle+"===============================================================");
LOGGER.debug(logTitle+"===============================================================");
			List list = TOMapper.selectListForInsertTradeRequest(new HashMap());//대상건만 조회함 
			for(int i=0; i < list.size(); i++) {
				Map m = (Map)list.get(i);
				String SERVICE = (String)m.get("SERVICE");
				String PARAM = (String)m.get("PARAM");
				String rcvFlag = (String)m.get("RECV_FLAG");
				String resStr = (String) m.get("RECV_MSG");
				Map payReqMap = m;
LOGGER.debug(logTitle+"PARAM>>> "+PARAM);
				String[] arr = PARAM.split("~~~~~");
				for(int k=0; k < arr.length; k++) {
					String keyAndVal = arr[k];
					String[] twoArr = keyAndVal.split("_____");
					if(twoArr != null && twoArr.length > 1) {
						payReqMap.put(twoArr[0], twoArr[1]);
					}
				}
				boolean flag = false;
				String Stage = "";
LOGGER.debug(logTitle+"rcvFlag>>> "+rcvFlag);
				if("Y".equals(rcvFlag)) {
					flag = true;
					 	// 응답전문내용
					String resCd = resStr.substring(51, 55);			// 공통부 은행응답코드 
LOGGER.debug(logTitle+"resCd	::: "+resCd);
LOGGER.debug(logTitle+"resCd>>> "+resCd); 
					payReqMap.put("RES_CD", resCd);
					// 등록이 정상 처리가 됐으면 고객결제정보 테이블 insert
					if("0000".equals(resCd)) {
						String idx_auto = this.insertToPaymentHistory(payReqMap);
						Stage = "16";		// TS 이전신청결과 미수신 상태
						payReqMap.put("RESULT_YN", "Y");
					} else {
						Stage = "25";	// 카방->ksnet결제 시 오류
						payError25(logTitle, resCd,payReqMap);
						payReqMap.put("RESULT_YN", "E");
					}
					payReqMap.put("Stage", Stage);
					TOMapper.updateToTransferOwnerStage(payReqMap);
					int cnt = TOMapper.updateResultForTOTradeRequestBin(payReqMap);//추가개발
				} else if("F".equals(rcvFlag) || "T".equals(rcvFlag)) {	// fale or timeout
					flag = true;
					Stage = "25";	// 카방->ksnet결제 시 오류
					payReqMap.put("Stage", Stage);
					payReqMap.put("RESULT_YN", rcvFlag);
					TOMapper.updateToTransferOwnerStage(payReqMap);
					int cnt = TOMapper.updateResultForTOTradeRequestBin(payReqMap);//추가개발
				}
				//if("Y".equals(rcvFlag) || "F".equals(rcvFlag) || "T".equals(rcvFlag)) {
					//payReqMap에서 costMap에 필요한값을 가져옴
					//costMap.put("cntcInsttCode", cntcInsttCode);
					//costMap.put("bizrno", bizrno);
					//costMap.put("reqstRceptNo", reqstRceptNo);
					//costMap.put("cvplReqstNo", cvplReqstNo);
					//costMap.put("ntpbndDscntAmount", ntpbndDscntAmount);
					//costMap.put("acqstxAmount", acqstxAmount);
					//costMap.put("revenueStmptaxAmount", revenueStmptaxAmount);
					//costMap.put("elctrnPayFeeAmount", elctrnPayFeeAmount);
					//costMap.put("totRgfeAmount", totRgfeAmount);
					//costMap.put("ntpbndPrcsAmount", ntpbndPrcsAmount);
					//costMap.put("TransferOwnerIndex", TransferOwnerIndex);
					//costMap.put("idx", TransferOwnerIndex);
					
					//costMap.put("Stage", Stage);
					// 소유권이전 상태값 업데이트
				//}
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
	};
	
	
	public void savePaymentAccountAfter() throws Exception {
		String logTitle = "[결제3:savePaymentAccount(간편결제 계좌등록 요청):savePaymentAccountAfter]";
		try {
LOGGER.info(logTitle+"===============================================================");
LOGGER.debug(logTitle+"===============================================================");
			Map trMap = new HashMap();
			trMap.put("SERVICE", "savePaymentAccountAfter");
			List list = TOMapper.selectListForInsertTradeRequest(trMap);
			for(int i=0; i < list.size(); i++) {
				Map m = (Map)list.get(i);
				String SERVICE = (String)m.get("SERVICE");
				String PARAM = (String)m.get("PARAM");
				String rcvFlag = (String)m.get("RECV_FLAG");
				String resStr = (String) m.get("RECV_MSG");
				Map payReqMap = m;
LOGGER.debug(logTitle+"PARAM>>> "+PARAM);
				String[] arr = PARAM.split("~~~~~");
				for(int k=0; k < arr.length; k++) {
					String keyAndVal = arr[k];
					String[] twoArr = keyAndVal.split("_____");
					if(twoArr != null && twoArr.length > 1) {
						payReqMap.put(twoArr[0], twoArr[1]);
					}
				}
				boolean flag = false;
				String Stage = "";
LOGGER.debug(logTitle+"rcvFlag>>> "+rcvFlag);
				if("Y".equals(rcvFlag)) {
					flag = true;
					 	// 응답전문내용
					String resCd = resStr.substring(51, 55);			// 공통부 은행응답코드 
LOGGER.debug(logTitle+"resCd	::: "+resCd);
LOGGER.debug(logTitle+"resCd>>> "+resCd); 
					payReqMap.put("RES_CD", resCd);
					// 등록이 정상 처리가 됐으면 고객결제정보 테이블 insert
					if("0000".equals(resCd)) {
						String idx_auto = this.insertToPaymentHistory(payReqMap);
						Stage = "16";		// TS 이전신청결과 미수신 상태
						payReqMap.put("RESULT_YN", "Y");
					} else {
						Stage = "25";	// 카방->ksnet결제 시 오류
						payError25(logTitle, resCd,payReqMap);
						payReqMap.put("RESULT_YN", "E");
					}
					payReqMap.put("Stage", Stage);
					TOMapper.updateToTransferOwnerStage(payReqMap);
					int cnt = TOMapper.updateResultForTOTradeRequestBin(payReqMap);//추가개발
				} else if("F".equals(rcvFlag) || "T".equals(rcvFlag)) {	// fale or timeout
					flag = true;
					Stage = "25";	// 카방->ksnet결제 시 오류
					payReqMap.put("Stage", Stage);
					payReqMap.put("RESULT_YN", rcvFlag);
					TOMapper.updateToTransferOwnerStage(payReqMap);
					int cnt = TOMapper.updateResultForTOTradeRequestBin(payReqMap);//추가개발
				}
				//if("Y".equals(rcvFlag) || "F".equals(rcvFlag) || "T".equals(rcvFlag)) {
					//payReqMap에서 costMap에 필요한값을 가져옴
					//costMap.put("cntcInsttCode", cntcInsttCode);
					//costMap.put("bizrno", bizrno);
					//costMap.put("reqstRceptNo", reqstRceptNo);
					//costMap.put("cvplReqstNo", cvplReqstNo);
					//costMap.put("ntpbndDscntAmount", ntpbndDscntAmount);
					//costMap.put("acqstxAmount", acqstxAmount);
					//costMap.put("revenueStmptaxAmount", revenueStmptaxAmount);
					//costMap.put("elctrnPayFeeAmount", elctrnPayFeeAmount);
					//costMap.put("totRgfeAmount", totRgfeAmount);
					//costMap.put("ntpbndPrcsAmount", ntpbndPrcsAmount);
					//costMap.put("TransferOwnerIndex", TransferOwnerIndex);
					//costMap.put("idx", TransferOwnerIndex);
					
					//costMap.put("Stage", Stage);
					// 소유권이전 상태값 업데이트
				//}
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
	};
	
	
	//[결제3:이전완료후환불처리]
	public void getTransferOwnerRstTsForSchedule() throws Exception {
		String logTitle = "[결제3:이전완료후환불:getTransferOwnerRstTsForSchedule]";
		try {
LOGGER.info(logTitle+"===============================================================");
LOGGER.debug(logTitle+"===============================================================");
			List list = TOMapper.selectListTransferOwnerRstTs(new HashMap());//대상건만 조회함 
			for(int i=0; i < list.size(); i++) {
				Map m = (Map)list.get(i);
				
				String SERVICE = (String)m.get("SERVICE");
				String PARAM = (String)m.get("PARAM");
				String rcvFlag = (String)m.get("RECV_FLAG");
				String resStr = (String) m.get("RECV_MSG");
				
				Map payReqMap = m;
				String[] arr = PARAM.split("~~~~~");
				for(int k=0; k < arr.length; k++) {
					String keyAndVal = arr[k];
					String[] twoArr = keyAndVal.split("_____");
					payReqMap.put(twoArr[0], twoArr[1]);
				}
				boolean flag = false;
				String Stage = "";
LOGGER.debug(logTitle+"rcvFlag>>> "+rcvFlag);
				if("Y".equals(rcvFlag)) {
					flag = true;
					 	// 응답전문내용
					String resCd = resStr.substring(51, 55);			// 공통부 은행응답코드 
					LOGGER.debug("resCd	::: "+resCd);
LOGGER.debug(logTitle+"resCd>>> "+resCd); 
					payReqMap.put("RES_CD", resCd);
					// 등록이 정상 처리가 됐으면 고객결제정보 테이블 insert
					if("0000".equals(resCd)) {
						String idx_auto = this.insertToPaymentHistory(payReqMap);
						Stage = "18";//환급(완료)
						payReqMap.put("compYn", "Y");
						payReqMap.put("RESULT_YN", "Y");
					} else if("KS11".equals(resCd) || "0021".equals(resCd)) {
						Stage = "21";//카방계좌부족 미환급	
						payReqMap.put("RESULT_YN", "E");
					} else {
						Stage = "25";// 카방->ksnet결제 시 오류
						payError25(logTitle, resCd,payReqMap);
						payReqMap.put("RESULT_YN", "E");
					}
					payReqMap.put("Stage", Stage);
					
					TOMapper.updateToTransferOwnerStage(payReqMap);
					int cnt = TOMapper.updateResultForTOTradeRequestBin(payReqMap);//추가개발
				} else if("F".equals(rcvFlag) || "T".equals(rcvFlag)) {	// fale or timeout
					flag = true;
					Stage = "25";	// 카방->ksnet결제 시 오류
					payReqMap.put("Stage", Stage);
					payReqMap.put("RESULT_YN", rcvFlag);
					TOMapper.updateToTransferOwnerStage(payReqMap);
					int cnt = TOMapper.updateResultForTOTradeRequestBin(payReqMap);//추가개발
				}
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
	}

	private void payError25(String logTitle, String resCd, Map payReqMap) {
		if("U239".equalsIgnoreCase(resCd)) {
			String contents = "신한은행	0088	U239	자동이체미신청 계좌";
			LOGGER.debug(logTitle+"에러내용>>> "+contents); 
			payReqMap.put("RES_CONTENTS", contents);
		}else {
			LOGGER.debug(logTitle+"에러코드>>> "+resCd);
		}
	};

	//9001:양도증명신청
	public void sendKakaoCert(Map<String, Object> mocaMap, ModelMap model,HttpServletRequest request) throws Exception{
		LOGGER.debug("[9001:양도증명신청]----------------------------------------------------------------------------> START");
		Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
		ToUserVO userVo = (ToUserVO)request.getSession().getAttribute("userInfo");
		if(userVo == null) {
			model.addAttribute("error", "로그인해주세요.");
		}
		
		/*TS에 보낼 전문파라미터를 가져옴 */
		Map tsMap = getMapForTs(paramMap,request);//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		tsMap.put("REQST_SE_CODE", "9001");
		LOGGER.debug("[9001:tsMap]---------------------------------------------------------------------------->"+tsMap);
		/*******************************************************************************************************************************************************
		 * 											카방TS로 전송하기
		 *******************************************************************************************************************************************************/
		String urlForRsRequest = getUrlForTsRequest(testMode);
		String rsResponse = Util.curlToTs(urlForRsRequest,tsMap);
		LOGGER.debug("[9001:양도증명신청:/ts/api/transfer_request]********************************************************************************************************************");	
		LOGGER.debug(tsMap.toString());
		LOGGER.debug("-------------------------------------------------------------------------------------------------------------------------------------------------------");	
		LOGGER.debug("[양도증명신청 응답체크]"+urlForRsRequest+"---------------------------------------------->"+rsResponse);	
		LOGGER.debug("*******************************************************************************************************************************************************");
		
		Map hisMap = new HashMap();
		hisMap.put("TsParams", tsMap.toString());
		hisMap.put("REQST_RCEPT_NO",tsMap.get("REQST_RCEPT_NO"));
		hisMap.put("REQST_SE_CODE",tsMap.get("REQST_SE_CODE"));
		hisMap.put("registerId","SYSTEM");
		hisMap.put("idx",paramMap.get("idx"));
		hisMap.put("TsRequestYn","Y");
		hisMap.put("TsResponse",rsResponse);
		TOMapper.insertTsHis(hisMap);

		
		
		
		
		if(rsResponse == null || rsResponse.startsWith("error")) {
			//이전신청오류112업데이트
			Map uptMap = new HashMap();
			//uptMap.put("idx", String.valueOf((long) paramMap.get("idx")));
			uptMap.put("idx", paramMap.get("idx").toString());
			
			uptMap.put("Stage", "112");
			TOMapper.updateToTransferOwnerStage(uptMap);
		}else {
			String error_type = "";
			String error_type2 = "";
			String GRTE_AHRZT = Util.getXmlValue(rsResponse, "GRTE_AHRZT");
			String ASGR_AHRZT = Util.getXmlValue(rsResponse, "ASGR_AHRZT");
			String PROCESS_IMPRTY_RESN_CODE = Util.getXmlValue(rsResponse, "PROCESS_IMPRTY_RESN_CODE");
			String PROCESS_IMPRTY_RESN_DTLS = Util.getXmlValue(rsResponse, "PROCESS_IMPRTY_RESN_DTLS");
			String CVPL_REQST_NO = Util.getXmlValue(rsResponse, "CVPL_REQST_NO");
			
			
			List errorCodeList = null;
			if(PROCESS_IMPRTY_RESN_DTLS != null && !"".equals(PROCESS_IMPRTY_RESN_DTLS.trim())) {
				Map p = new HashMap();
				String[] arr = PROCESS_IMPRTY_RESN_DTLS.split(",");
				String PROCESS_IMPRTY_RESN_DTLS_RE = "";
				for(int z=0; z < arr.length; z++) {
					if(z == arr.length-1) {
						PROCESS_IMPRTY_RESN_DTLS_RE += "'"+arr[z]+"'";
					}else {
						PROCESS_IMPRTY_RESN_DTLS_RE += "'"+arr[z]+"',";
					}
				}
				p.put("ErrCode", PROCESS_IMPRTY_RESN_DTLS_RE);
				errorCodeList = TOMapper.selectToCodeList(p);				
			};
			
			if(PROCESS_IMPRTY_RESN_DTLS != null && !"".equals(PROCESS_IMPRTY_RESN_DTLS.trim())) {
				if(PROCESS_IMPRTY_RESN_DTLS.indexOf("E41")> -1 || PROCESS_IMPRTY_RESN_DTLS.indexOf("E42")> -1 ) {
					error_type = "9";//고객오류
				}else if(PROCESS_IMPRTY_RESN_DTLS.indexOf("E50")> -1 
						|| PROCESS_IMPRTY_RESN_DTLS.indexOf("E51")> -1
						|| PROCESS_IMPRTY_RESN_DTLS.indexOf("E52")> -1
						|| PROCESS_IMPRTY_RESN_DTLS.indexOf("E53")> -1
						|| PROCESS_IMPRTY_RESN_DTLS.indexOf("E54")> -1
						|| PROCESS_IMPRTY_RESN_DTLS.indexOf("E55")> -1
						|| PROCESS_IMPRTY_RESN_DTLS.indexOf("E56")> -1
						|| PROCESS_IMPRTY_RESN_DTLS.indexOf("E57")> -1
						|| PROCESS_IMPRTY_RESN_DTLS.indexOf("E58")> -1
						|| PROCESS_IMPRTY_RESN_DTLS.indexOf("E59")> -1) {
					error_type = "5";//인증오류
				}else {
					error_type = "112";//이전신청오류
				}
			};
			
			Thread.sleep(1010);
			Map hisMap2 = new HashMap();
			hisMap2.put("REQST_RCEPT_NO",tsMap.get("REQST_RCEPT_NO"));
			hisMap2.put("REQST_SE_CODE",tsMap.get("REQST_SE_CODE"));
			hisMap2.put("registerId","SYSTEM");
			hisMap2.put("idx",paramMap.get("idx"));
			hisMap2.put("TsRequestYn","Y");
			hisMap2.put("TsResponse",rsResponse);
			hisMap2.put("RESN_CODE",PROCESS_IMPRTY_RESN_CODE);
			hisMap2.put("RESN_DTLS",PROCESS_IMPRTY_RESN_DTLS.toString().replaceAll(",","___"));
			if(errorCodeList != null) {
				
				//[E41___E62][{CODE_ID=toCodeList,ErrTxt=양도인실명인증실패,TransferEnable=2,ErrCode=E41},{CODE_ID=toCodeList,ErrTxt=차량번호로진행중인위임요청이존재함,TransferEnable=2,ErrCode=E62}]
				String s = "";
				if(errorCodeList != null) {
					for(int k=0; k < errorCodeList.size(); k++) {
						Map row = (Map)errorCodeList.get(k);
						s += "("+row.get("ErrCode")+")"+row.get("ErrTxt")+"<br/>";
					}
				}
				hisMap2.put("RESN_DTLS_MSG",s);
			}
			
			TOMapper.insertTsHis(hisMap2);
			

			// 인증요청 후 넘어온 결과값 parsing
			Map<String, Object> parseSellerResMap = new HashMap();parseSellerResMap.put("tx_id", ASGR_AHRZT);
			
			Map<String, Object> parseBuyerResMap = new HashMap();parseBuyerResMap.put("tx_id", GRTE_AHRZT);
			if("02".equals(PROCESS_IMPRTY_RESN_CODE)){//오류
				parseSellerResMap.put("errcode", PROCESS_IMPRTY_RESN_CODE);
				parseBuyerResMap.put("errcode", PROCESS_IMPRTY_RESN_CODE);
				paramMap.put("Stage", error_type);//고객정보오류,인증오류,이전신청오류
			}else {
				paramMap.put("CVPL_REQST_NO", CVPL_REQST_NO);
				paramMap.put("Stage", "1");//미인증
				TOMapper.updateToTransferOwnerCVPL_REQST_NO(paramMap);
			}
			
			TOMapper.updateToTransferOwnerStage(paramMap);
			// 양도/양수인 각 인증상태 업데이트
			// 오류 시 : {"errcode":"E499","errmsg":"invalid field birthday"}
			paramMap.put("updateType", "1");
			// 인증오류 시 처리
/*			if(StringUtils.isEmpty((String) parseSellerResMap.get("errcode")) == false
				|| StringUtils.isEmpty((String) parseBuyerResMap.get("errcode")) == false) {
				
				paramMap.put("Stage", "5");					// 인증오류
				TOMapper.updateToTransferOwnerStage(paramMap);	// 소유권이전 상태값 업데이트
			}
			*/
			
			// 양도/양수인 인증상태
			String CertificationState = "";			// 카카오페이인증상태(1:인증,2:미인증,3:인증대기중,4:오류,5:기타)																														// 카카오페이인증상태(1:인증,2:미인증,3:인증대기중,4:오류,5:기타)
			String CertificationId_yangdo = "";		// 양도인 카카오페이 인증접수번호
			String CertificationId_yangsu = "";		// 양수인 카카오페이 인증접수번호
			// 양도인 인증상태 값 update
			if("02".equals(PROCESS_IMPRTY_RESN_CODE)){ 
				CertificationState = "4";	//인증오류
				CertificationId_yangdo = (String) parseSellerResMap.get("errcode");	// 접수번호 대신 오류코드를 넣는다(임시)
				paramMap.put("CertificationId", "");
			} else {
				CertificationState = "2";	//미인증(호출성공)
				CertificationId_yangdo = (String) parseSellerResMap.get("tx_id");	// 인증 접수번호
				paramMap.put("CertificationId", CertificationId_yangdo);
			}
			paramMap.put("CertificationState", CertificationState);
			
			TOMapper.updateToTransferOwnerSeller(paramMap);
			
			// 양수인 인증상태 값 update
			if(StringUtils.isEmpty((String) parseBuyerResMap.get("errcode")) == false) {
			}
			
			if("02".equals(PROCESS_IMPRTY_RESN_CODE)){ 
				CertificationState = "4";	//인증오류
				CertificationId_yangsu = (String) parseBuyerResMap.get("errcode");	// 접수번호 대신 오류코드를 넣는다(임시)
				paramMap.put("CertificationId", "");
			} else {
				CertificationState = "2";	//미인증(호출성공)
				CertificationId_yangsu = (String) parseBuyerResMap.get("tx_id");	// 인증 접수번호
				paramMap.put("CertificationId", CertificationId_yangsu);
			}
			paramMap.put("CertificationState", CertificationState);
			
			TOMapper.updateToTransferOwnerBuyer(paramMap);
	        
			/* 화면에 값 전달 */
			model.addAttribute("error_type", error_type);
			model.addAttribute("errorCodeList", errorCodeList);
	        model.addAttribute("PROCESS_IMPRTY_RESN_CODE", PROCESS_IMPRTY_RESN_CODE);
	        model.addAttribute("PROCESS_IMPRTY_RESN_DTLS", PROCESS_IMPRTY_RESN_DTLS);
			model.addAttribute("kakaoSellerResMap", parseSellerResMap);
			model.addAttribute("kakaoBuyerResMap", parseBuyerResMap);
			model.addAttribute("transferownerId", paramMap.get("TransferOwnerIndex"));
			model.addAttribute("sellerId", paramMap.get("sellerIdx"));//매도인은 idx없음!!
			model.addAttribute("buyerId", paramMap.get("buyerIdx"));
		}
	};
	public Map sendRequestTs(Map<String, Object> tsMap) throws Exception{
		LOGGER.debug("[1100:민원신청]----------------------------------------------------------------------------> START");

		
		
		
		
		
		//#{idx},#{REQST_SE_CODE},#{REQST_RCEPT_NO},CURRENT_TIMESTAMP,#{registerId},#{TsParams}
		String urlForRsRequest = getUrlForTsRequest(testMode);
		String rsResponse = Util.curlToTs(urlForRsRequest,tsMap);
		LOGGER.debug("[이전등록신청:/ts/api/transfer_request]1100********************************************************************************************************************");	
		LOGGER.debug(tsMap.toString());
		LOGGER.debug("-------------------------------------------------------------------------------------------------------------------------------------------------------");	
		LOGGER.debug("[이전등록신청  응답체크]"+urlForRsRequest+"---------------------------------------------->"+rsResponse);	
		LOGGER.debug("1100110011001100*******************************************************************************************************************************************************");
		
		Map re = new HashMap();
		if(rsResponse == null || rsResponse.startsWith("error")) {
			LOGGER.debug("------------------------------> STEP12");	
			//이전신청오류112업데이트
			Map uptMap = new HashMap();
			uptMap.put("idx", (String)tsMap.get("idx"));
			uptMap.put("Stage", "112");
			TOMapper.updateToTransferOwnerStage(uptMap);
		}else {
            Map statusReqMap = new HashMap();
            statusReqMap.put("CNTC_INFO_CODE", (String)tsMap.get("CNTC_INFO_CODE"));
            statusReqMap.put("CHARGER_ID", (String)tsMap.get("CHARGER_ID"));
            statusReqMap.put("CHARGER_NM", (String)tsMap.get("CHARGER_NM"));
            statusReqMap.put("CHARGER_IP_ADRES", (String)tsMap.get("CHARGER_IP_ADRES"));
            statusReqMap.put("CNTC_INSTT_CODE", (String)tsMap.get("CNTC_INSTT_CODE"));
            
            
            
            statusReqMap.put("REQST_RCEPT_NO", (String)tsMap.get("REQST_RCEPT_NO"));
            statusReqMap.put("CVPL_REQST_NO", (String)tsMap.get("CVPL_REQST_NO"));
			String urlForRsRequestState = getUrlForTsStateRequest(testMode);
			String rsStateResponse = Util.curlToTs(urlForRsRequestState,statusReqMap);
			LOGGER.debug("[민원신청상태조회:/ts/api/transfer_status_request]^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ");	
			LOGGER.debug(tsMap.toString());
			LOGGER.debug("-------------------------------------------------------------------------------------------------------------------------------------------------------");	
			LOGGER.debug("[민원신청상태조회 응답체크]"+urlForRsRequestState+"---------------------------------------------->"+rsStateResponse);	
			LOGGER.debug("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
			String PROCESS_IMPRTY_RESN_CODE = Util.getXmlValue(rsResponse, "PROCESS_IMPRTY_RESN_CODE");
			String PROCESS_IMPRTY_RESN_DTLS = Util.getXmlValue(rsResponse, "PROCESS_IMPRTY_RESN_DTLS");
			re.put("PROCESS_IMPRTY_RESN_CODE", PROCESS_IMPRTY_RESN_CODE);
			re.put("PROCESS_IMPRTY_RESN_DTLS", PROCESS_IMPRTY_RESN_DTLS);
			
			
			re.put("TsRequestYn1100","Y");
			re.put("TsResponse1100",rsResponse.replaceAll("\'", "^").replaceAll("\"", "^^").replaceAll("\\s", "__"));
		}
		return re;
	};
	
	
	public void exeTsStep1(HttpServletRequest req, String _jsp_xml)  throws Exception, InterruptedException{    
			
	};
	
	
	// 결제(KSNET)호출 공통부 작성
		public String setKsnetCmmArea(Map<String, Object> paramMap) throws Exception{
			
			/*
			// 1. KSNET 간편결제 개발 관련 업체코드
		  - 실시간 자동이체 업체코드(송금이체 동일) : CARBANG1
		  - 실시간 자동이체 KSCODE : 6118
		  - 계좌인증(FCS) 업체코드 : FCS04896
		  - ARS 업체코드 : CARBANG1  
		  - ARS Auth_Key : WuXip1AqhyD1wZxqPSAg
			 */
			
//			ARS는 DB insert방식이 아닌 url 통신방식임. 아래 경로 문서 및 샘플소스 참조
//			carbang\carbang_api\카방API연계정보_20201023\API연계정보\결제-KSNET\출금이체대행 모듈\모듈\ARS_API

			StringBuffer rtnCmmStr = new StringBuffer();
			
			try {
			
				String sendType = (String) paramMap.get("sendType");	// 전문구분
				String bankCd = (String) paramMap.get("bankCd");		// 은행코드 (식별코드 사용 시 판단예정..)
				
				
				// (필수)식별코드(9, 좌측 스페이스 정렬) :: 출금대행(KSDEBIT), 송금대행(KSBPAY), 기업(TXEB9KSV), 국민(업체코드와 동일), 외환(REALTIME), 농협(SRS1), 씨티(JCKC), 전북(DONKSVN) 그 외 은행은 SPACE
				String identifiactionCd = "";								
				String companyCd = "CARBANG1";								// (필수)업체코드 				: 8, 좌측 스페이스정렬
				String bankCd2 = String.format("%-2s", "");					// 은행코드2(미사용) 			: 2, 좌측 스페이스정렬
				String msgCd = "";											// 메시지코드 					: 4, 좌측 스페이스정렬
				String taskTypeCd = "";										// 업무구분코드 					: 3, 좌측 스페이스정렬
				String sendCnt = "1";										// (필수)송신횟수 :: 고정값 1 		: 1, 좌측 스페이스정렬
				String sendIdx = "";										// (필수)전문번호(Unique Key (업체코드+은행코드3+전송일자+전문번호)) : 6, 오른쪽정렬 0패딩 
				String sendDate = "";										// (필수)전송일자 				: 8, Date(YYYYMMDD)
				String sendTime = "";										// (필수)전송시간 				: 6, Time(HHMMSS)
				String resCd = String.format("%-4s", "");					// 응답코드 					: 4, 좌측 스페이스정렬
				String bankResCd = String.format("%-4s", "");				// 은행응답코드 					: 4, 좌측 스페이스정렬
				String reqDate = String.format("%-8s", "");;				// 조회일자 (처리결과 조회 시 사용) 	: 8, Date(YYYYMMDD)
				String reqIdx = String.format("%06d", 0);					// 조회번호 					: 6, 오른쪽정렬 0패딩
				String bankSendIdx = String.format("%-15s", ""); 			// 은행전문번호					: 15, 좌측 스페이스정렬
				String bankCd3 = "";										// (필수)은행코드3 				: 3, 좌측 스페이스정렬
				String reserve = String.format("%-13s", "");; 				// 예비 						: 13, 좌측 스페이스정렬
				
				// 전송 일자/시간 set
				SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
				SimpleDateFormat sdf2 = new SimpleDateFormat("HHmmss");
				Calendar cal = Calendar.getInstance();
				
				sendDate = sdf.format(cal.getTime());
				sendTime = sdf2.format(cal.getTime());
				
				// 은행코드
				bankCd3 = bankCd;
				
				// 오늘날짜 전문번호 조회
				sendIdx = TOMapper.selectTradeReqBinSeq();
				
				// 전문 일련번호 채번
				if(StringUtils.isEmpty(sendIdx)) {
					// 전문번호는 일자마다 초기화, 당일자 데이터가 없으면000001
					sendIdx = String.format("%06d", 1);
				} else {
					int tmpInt = Integer.parseInt(sendIdx) + 1;
					sendIdx = String.format("%06d", tmpInt);
				}
				
				switch (sendType) {
				case "1":	// (계좌조회는 FCS계좌조회 API사용, 전문은 사용하지 않지만 케이스는 남겨둠)계좌 조회, 예금주 조회, 성명 조회 :(요청 : 0600/400, 응답 : 0610/400)
					msgCd = "0600";
					taskTypeCd = "400";
					companyCd = "FCS04896";	// 계좌인증 업체코드
					break;
				case "2":	// 출금이체계좌등록(KSNET ARS 이용업체) : 0600/501(요청), 0610/501(응답)
					msgCd = "0600";
					taskTypeCd = "501";
					break;
				case "3":	// 출금 이체 : 요청 : 0100/501, 응답 : 0110/501
					msgCd = "0100";
					taskTypeCd = "501";
					companyCd = "CARBANG1";
					break;
				case "4":	// 처리결과 조회 : 요청 : 0600/101, 응답 : 0610/101
					msgCd = "0600";
					taskTypeCd = "101";
					break;
				case "5":	// 집계 조회 : 요청 : 0700/100, 응답 : 0710/100
					msgCd = "0700";
					taskTypeCd = "100";
					break;
				case "6":	// 출금이체계좌해지 : 요청 : 0600/501, 응답 : 0610/501
					msgCd = "0600";
					taskTypeCd = "501";
					break;
				case "7":	// 송금이체요청
					msgCd = "0100";
					taskTypeCd = "100";
					break;
		
				default:
					break;
				}
				
				// 식별코드 set
				identifiactionCd = String.format("%-9s", this.getIdentifiactionCd(sendType, bankCd, companyCd));
				
				rtnCmmStr.append(identifiactionCd)
					.append(companyCd)
					.append(bankCd2)
					.append(msgCd)
					.append(taskTypeCd)
					.append(sendCnt)
					.append(sendIdx)
					.append(sendDate)
					.append(sendTime)
					.append(resCd)
					.append(bankResCd)
					.append(reqDate)
					.append(reqIdx)
					.append(bankSendIdx)
					.append(bankCd3)
					.append(reserve);
			} catch (Exception e) {
				e.printStackTrace();
			}
			
			return rtnCmmStr.toString();
		};
	
		
		// 결제(KSNET) 출금이체, 집금이체 개별부 전문을 생성한다
		public String setKsnetPaymentArea(Map<String, Object> paramMap) {
			StringBuffer rtnAreaStr = new StringBuffer();
			
			try {
				SimpleDateFormat sdf = new SimpleDateFormat("HHmmss");
				Calendar cal = Calendar.getInstance();
				
//				String reqIdx = String.format("%06d", 0);					// 조회번호 					: 6, 오른쪽정렬 0패딩
//				String bankSendIdx = String.format("%-15s", ""); 			// 은행전문번호					: 15, 좌측 스페이스정렬
//				C : 좌측 스페이스 정렬, N :  우측 0정렬, D : DATE, T : TIME
				
				/*
				출금 계좌번호	C	15        ○		출금 등록 계좌
				통장 비밀번호	C	8
				복기부호	C	6             		
				출금 금액	N	13            ○		출금할 금액
				출금 후 잔액부호	C	1     		
				출금 후 잔액	N	13        		
				출금 은행코드2	C	2         		
				입금 계좌번호	C	15        		
				수수료	N	9                 		
				이체시각	T	6             ○		현재 시각
				출금 통장 적요	C	20        ○		
				신원확인번호	C	13        ○		생년월일/사업자번호
				자동이체구분	C	2
				입금 통장 적요	C	20        △		
				납부자번호	C	20            ○		
				기관코드	C	10            		
				출금 은행코드3	C	3         ○		
				제로페이 구분	C	2         △		제로페이 이용업체
				은행전문번호	C	22        	△	제로페이 이용업체
				예비		16
				*/        
				
				String payAccountNo 		= String.format("%-15s", paramMap.get("accountNo")); 	// 출금 계좌번호 C 15
				String bankPw 				= String.format("%8s", ""); 							// 통장비밀번호 C	8
				String tmp 					= String.format("%6s", "");								// 복기부호 C 6
				String payAmount 			= String.format("%013d", Integer.parseInt((String) paramMap.get("payAmount")));	// 출금금액 N 13
				String balanceMakr 			= String.format("%1s", "");								// 출금 후 잔액부호 C 1
				String balance 				= String.format("%013d", 0);							// 출금 후 잔액 N 13
				String bankCd2 				= String.format("%2s", ""); 							// 출금은행코드2 C 2
				String depositAccountNo 	= String.format("%15s", ""); 							// 입금 계좌번호 C 15
				String charge 				= String.format("%09d", 495); 							// 수수료 N 9
				String reqTime 				= sdf.format(cal.getTime()); 							// 이체시각 T 6
				String payBankComnt 		= (String) paramMap.get("payComnt"); 					// 출금 통장 적요 C 20
				String idNo 				= String.format("%-13s", paramMap.get("idNo"));			// 신원확인번호 C 13 (개인: 생년월일6자리 yymmdd)
				String autoPayType 			= String.format("%2s", "");								// 자동이체구분 C 2
				String depositBankComnt 	= (String) paramMap.get("depositComnt");				// 입금 통장 적요 C 20
				String traceNo 				= String.format("%-20s", paramMap.get("traceNo"));		// 납부자번호 C 20
				String orgCd 				= String.format("%10s", "");							// 기관코드 C 10
				String bankCd3 				= String.format("%-3s", paramMap.get("bankCd"));		// 은행코드 C 3
				
				// 입출금 통장적요 한글 2byte 처리
				int len1 = 20 - payBankComnt.length() * 2;
				int len2 = 20 - depositBankComnt.length() * 2;
				String strLen1 = "%-"+String.valueOf(payBankComnt.length()+len1)+"s";
				String strLen2 = "%-"+String.valueOf(depositBankComnt.length()+len2)+"s";
				
				payBankComnt 		= String.format(strLen1, (String) paramMap.get("payComnt")); 			// 출금 통장 적요 C 20
				depositBankComnt 	= String.format(strLen2, (String) paramMap.get("depositComnt"));		// 입금 통장 적요 C 20
				
				LOGGER.debug("payBankComnt : "+payBankComnt);
				LOGGER.debug("depositBankComnt : "+depositBankComnt);
				
				
				// 개별부 전체 길이는 200byte여야 하는데 전문 레이아웃 상의 값은 총 216byte.
				// ksnet 담당자 확인 결과  은행코드3까지 넣은 후 이후 길이는 공백으로 200byte까지 밀어넣으면 된다고 함. (2021.01.11)
				String restStr = String.format("%24s", "");
				
				String zeroPay 				= String.format("%2s", "");								// 제로페이 구분 C 2
				String zeropayBankSeq 		= String.format("%22s", ""); 							// 은행전문번호	C	22 (제로페이 이용업체만)
				String reserve 				= String.format("%16s", "");							// 예비 16
				
				rtnAreaStr.append(payAccountNo)
					.append(bankPw)
					.append(tmp)
					.append(payAmount)
					.append(balanceMakr)
					.append(balance)
					.append(bankCd2)
					.append(depositAccountNo)
					.append(charge)
					.append(reqTime)
					.append(payBankComnt)
					.append(idNo)
					.append(autoPayType)
					.append(depositBankComnt)
					.append(traceNo)
					.append(orgCd)
					.append(bankCd3)
//					.append(zeroPay)
//					.append(zeropayBankSeq)
//					.append(reserve)
					.append(restStr);
				
			} catch (Exception e) {
				e.printStackTrace();
			}
			
			return rtnAreaStr.toString();
		}
		// 결제(KSNET) 송금이체, 지급이체 개별부 전문을 생성한다
		public String setKsnetRemittanceArea(Map<String, Object> paramMap) throws Exception{
			StringBuffer rtnAreaStr = new StringBuffer();
			
			try {
				SimpleDateFormat sdf = new SimpleDateFormat("HHmmss");
				Calendar cal = Calendar.getInstance();
				
//				String reqIdx = String.format("%06d", 0);					// 조회번호 					: 6, 오른쪽정렬 0패딩
//				String bankSendIdx = String.format("%-15s", ""); 			// 은행전문번호					: 15, 좌측 스페이스정렬
//				C : 좌측 스페이스 정렬, N :  우측 0정렬, D : DATE, T : TIME
				
				/*
				출금 계좌번호	C	15	○	
				통장 비밀번호	C	8		
				복기부호		C	6		
				출금 금액		N	13	○	
				출금 후 잔액부호	C	1		○
				출금 후 잔액		N	13		○
				입금 은행코드2	C	2		
				입금 계좌번호	C	15	○	
				수수료		N	9		○
				이체 시각		T	6	○	
				입금 계좌 적요	C	20	○	
				CMS코드		C	16	△	
				신원확인번호	C	13		
				자동이체 구분	C	2		
				출금 계좌 적요	C	20	○	
				입금 은행코드3	C	3	○	
				급여 구분		C	1		
				예비			C	37		
				 */        
				LOGGER.debug(">>>>>>>>>>>>>>>>>>>>>>>>>>>>"+paramMap.get("payAmount")+"::::::::::::::");
				String payAccountNo 		= String.format("%-15s", paramMap.get("accountNo")); 		// 출금 계좌번호 C 15
				String bankPw 				= String.format("%8s", ""); 								// 통장비밀번호 C	8
				String tmp 					= String.format("%6s", "");									// 복기부호 C 6
				String payAmount 			= String.format("%013d", Integer.parseInt(paramMap.get("payAmount").toString()));	// 출금금액 N 13
				String balanceMakr 			= String.format("%1s", "");									// 출금 후 잔액부호 C 1
				String balance 				= String.format("%013d", 0);								// 출금 후 잔액 N 13
				String bankCd2 				= String.format("%2s", ""); 								// 출금은행코드2 C 2
				String depositAccountNo 	= String.format("%-15s", paramMap.get("bank_deposit_account")); 	// 입금 계좌번호 C 15
				String charge 				= String.format("%09d", 495); 								// 수수료 N 9
				String reqTime 				= sdf.format(cal.getTime()); 								// 이체시각 T 6
				String depositBankComnt 	= (String) paramMap.get("depositComnt");					// 입금 통장 적요 C 20
				String cmsCd				= String.format("%16s", "");								// cms코드 C	16 (입금받는 통장이 cms계좌일 경우 사용. --> 등록할 수 있는 계좌는 ksnet 서비스 계좌 중 출금이체가 가능한 계좌이며 cms계좌는 현시점에 등록할 수 없음)
				String idNo 				= String.format("%-13s", "");								// 신원확인번호 C 13 (개인: 생년월일6자리 yymmdd)
				String autoPayType 			= String.format("%2s", "");									// 자동이체구분 C 2
				String payBankComnt 		= (String) paramMap.get("payComnt"); 						// 출금 통장 적요 C 20
				String bankCd3 				= String.format("%-3s", paramMap.get("bank_deposit_cd"));	// 입금은행코드3 C 3
				String salaryYn 			= String.format("%1s", "");									// 급여구분 C 1
				String rest 				= String.format("%37s", "");								// 예비 C 37
				
				// 입출금 통장적요 한글 2byte 처리
				int len1 = 20 - payBankComnt.length() * 2;
				int len2 = 20 - depositBankComnt.length() * 2;
				String strLen1 = "%-"+String.valueOf(payBankComnt.length()+len1)+"s";
				String strLen2 = "%-"+String.valueOf(depositBankComnt.length()+len2)+"s";
				
				payBankComnt 		= String.format(strLen1, (String) paramMap.get("payComnt")); 			// 출금 통장 적요 C 20
				depositBankComnt 	= String.format(strLen2, (String) paramMap.get("depositComnt"));		// 입금 통장 적요 C 20
				
				LOGGER.debug("payBankComnt : "+payBankComnt);
				LOGGER.debug("depositBankComnt : "+depositBankComnt);
				
				rtnAreaStr.append(payAccountNo)
				.append(bankPw)
				.append(tmp)
				.append(payAmount)
				.append(balanceMakr)
				.append(balance)
				.append(bankCd2)
				.append(depositAccountNo)
				.append(charge)
				.append(reqTime)
				.append(depositBankComnt)
				.append(cmsCd)
				.append(idNo)
				.append(autoPayType)
				.append(payBankComnt)
				.append(bankCd3)
				.append(salaryYn)
				.append(rest);
				
			} catch (Exception e) {
				e.printStackTrace();
				throw e;
			}
			
			return rtnAreaStr.toString();
		};
		
		

		
		// 식별코드를 구한다
		public String getIdentifiactionCd(String type, String bankCd, String companyCd) {
			String identifiactionCd = "";
			// (필수)식별코드(9, 좌측 스페이스 정렬) :: 출금대행(KSDEBIT), 송금대행(KSBPAY), 
			// 기업(TXEB9KSV), 국민(업체코드와 동일), 외환(REALTIME), 농협(SRS1), 씨티(JCKC), 전북(DONKSVN) 그 외 은행은 SPACE
			if("3".equals(type)) {	// 출금 이체
				identifiactionCd = "KSDEBIT";
			} 
			else if("7".equals(type)) {	// 송금 이체
				// 임시. to_do. 공통부 식별코드가 출금이체 레이아웃과 송금 레이아웃이 다름. 출금이체는 출금대행(KSDEBIT), 송금대행(KSBPAY) 이고
				// 송금은 하단 은행만 체크 나머지는 space처리하라고 되어있음. 우선 해보고 오류나면 변경 처리
				identifiactionCd = "KSBPAY";
			} else {
				switch (bankCd) {
				case "003":	// 기업은행
					identifiactionCd = "TXEB9KSV";
					break;
				case "004":	// 국민은행
					identifiactionCd = companyCd;
					break;
				case "005":	// 외환은행
					identifiactionCd = "REALTIME";
					break;
				case "011":	// 농협
					identifiactionCd = "SRS1";
					break;
				case "027":	// 한국씨티은행
					identifiactionCd = "JCKC";
					break;
				case "037":	// 전북
					identifiactionCd = "DONKSVN";
					break;
				default:
					identifiactionCd = "";
					break;
				}
			}
			
			return identifiactionCd;
		}
		
		// 결제(KSNET) 출금이체 계좌등록(ARS이용업체) 개별부 전문을 생성한다
		public String setKsnetAccountSignArea(Map<String, Object> paramMap) {
			StringBuffer rtnAreaStr = new StringBuffer();
			
			try {
				// 전송 일자/시간 set
				SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
				Calendar cal = Calendar.getInstance();
				
				String identifiactionCd 		= "D"; 													// 식별코드 C 1
				String prodSeq 					= "0000000"; 											// 처리순번 N 7
				String bankCd2 					= String.format("%2s", ""); 							// 식별코드 C 2 (은행코드는 3자리임. 공통부와 마찬가지로 은행코드2는 사용하지 않는듯. 우선 공백처리)
				String accountNo 				= String.format("%-16s", paramMap.get("accountNo")); 	// 계좌번호 C 16
				String reqType 					= "1"; 													// 신청구분(1:등록) C 1
				String autoPayDay 				= String.format("%2s", ""); 							// 자동납부일자 D 2
				String storeCd6 				= String.format("%6s", ""); 							// 취급점코드6 C 6
				String reqDate 					= sdf.format(cal.getTime()); 							// 신청일자 D 8
				String prodResYn 				= String.format("%1s", "");								// 처리여부 C 1 (은행 응답값이므로 공백처리)
				String prodResCd 				= String.format("%4s", "");								// 불능코드 C 4 (은행 응답값이므로 공백처리)
				String chkIdNo 					= "Y";													// 신원확인번호체크 C 1
				String idNo 					= String.format("%-13s", paramMap.get("idNo"));			// 신원확인번호 C 13 (개인: 생년월일6자리 yymmdd)
				String traceNo 					= String.format("%-20s", paramMap.get("traceNo"));		// 납부자번호 C 20 (업체에서 사용하는 납부자번호. 본인인증 결과값의 접수일련번호를 사용)
				String temp 					= String.format("%16s", "");							// 업체/은행 사용정보 C 16
				String orgCd 					= String.format("%10s", "");							// 기관코드 C 10
				String bankCd3 					= String.format("%-3s", paramMap.get("bankCd"));		// 은행코드 C 3
				String storeCd7 				= "0000000"; 											// 취급점코드7 C 7
				String exemptionType	 		= "A"; 													// 일부면제 업체구분(KSNET ARS이용업체‘A’) C 1
				String useOrgCd 				= String.format("%20s", "");							// 은행코드 C 20
				String depositorType 			= "0";													// 예금주실명번호종류(0:개인고객 또는 외국인, 1: 사업자, 2: 여권번호) C 1
				String agreeDataType 			= "5";													// 동의자료구분(5:ARS) C 1
				String reserve 					= String.format("%35s", "");							// 예비 35
				String arsProcNo 				= String.format("%12s", paramMap.get("traceNo"));		// ars처리일련번호(=traceno)
				String reserve2 				= String.format("%12s", "");							// 예비2 12
				
				rtnAreaStr.append(identifiactionCd)
					.append(prodSeq)
					.append(bankCd2)
					.append(accountNo)
					.append(reqType)
					.append(autoPayDay)
					.append(storeCd6)
					.append(reqDate)
					.append(prodResYn)
					.append(prodResCd)
					.append(chkIdNo)
					.append(idNo)
					.append(traceNo)
					.append(temp)
					.append(orgCd)
					.append(bankCd3)
					.append(storeCd7)
					.append(exemptionType)
					.append(useOrgCd)
					.append(depositorType)
					.append(agreeDataType)
					.append(reserve)
					.append(arsProcNo)
					.append(reserve2);
				
			} catch (Exception e) {
				e.printStackTrace();
			}
			return rtnAreaStr.toString();
		};

		
	public String getUrlForTsRequest(boolean testMode) {
		if(testMode) {
			return "http://dev-mycar.carbang365.co.kr:9090/to/jsp/ts_moca_to_carbang_dev.jsp";
		}else {
			return "http://dev-mycar.carbang365.co.kr:9090/to/jsp/ts_moca_to_carbang_op.jsp";
		}
	};
	
	public String getUrlForTsStateRequest(boolean testMode) {
		if(testMode) {
			return "http://dev-mycar.carbang365.co.kr:9090/to/jsp/ts_moca_to_carbang_step1_dev.jsp";
		}else {
			return "http://dev-mycar.carbang365.co.kr:9090/to/jsp/ts_moca_to_carbang_step1_op.jsp";
		}
	};
	
	/* 환불금 = (고객입금액+고객추가입금액) - 공단이체 - 채권대행료 - 이전대행료 
	
	
	   1.고객입금액 : TO_COST.total_TransferOwner_Price -> total_TransferOwner_Price
	   2.고객추가입금액 : TO_COST.CustomerAddPayPrice -> CustomerAddPayPrice
	   3.공단이체 : TO_TRANSFEROWNER_COST_TS.totRgfeAmount
	   4.채권대행료 : (채권구매 대행율)비용관리:지역별 TO_TRANSFEROWNER_COST_MNG.PurchaseBond_CarBang -> agencyFee_PurchaseBond_CarBang
	   5.이전대행료 : (카방대행수수료)비용관리:지역별 TO_TRANSFEROWNER_COST_MNG.Carbang_RegistrationFee -> agencyFee_Transfer_CarBang
	 
	 
	 * 고객이 입금한 총금액에서 공단이 비용납부정보송신 전문으로 요청한 금액과 비용설정관리에서 설정한 채권대행료(0.415%)와 이전대행료(20,000)를 제한 금액이 환불금이 됩니다.
  */ 
	public BigDecimal calcReturnPay(Map<String, Object> transferMap) throws Exception{
		BigDecimal total_TransferOwner_Price = new BigDecimal(transferMap.get("total_TransferOwner_Price").toString());	// 카방 계산 총 이전비용
		BigDecimal CustomerAddPayPrice = new BigDecimal(transferMap.get("CustomerAddPayPrice").toString());	// 고객추가금액
		BigDecimal totRgfeAmount = new BigDecimal(transferMap.get("totRgfeAmount").toString());// 공단청구비용 이전등록비용
		BigDecimal agencyFee_PurchaseBond_CarBang = new BigDecimal(transferMap.get("agencyFee_PurchaseBond_CarBang").toString());// 채권대행료
		BigDecimal agencyFee_Transfer_CarBang = new BigDecimal(transferMap.get("agencyFee_Transfer_CarBang").toString());// 카방대행수수료
		BigDecimal diffPrice = total_TransferOwner_Price.add(CustomerAddPayPrice).subtract(totRgfeAmount).subtract(agencyFee_PurchaseBond_CarBang).subtract(agencyFee_Transfer_CarBang);
		return diffPrice;
	}
	
	/*
	 * _REQST_RCEPT_NO에서 idx를 추출함 
	 */
	public String getIdx(String _REQST_RCEPT_NO) {
		String idxString = _REQST_RCEPT_NO.substring(14);
		return Integer.parseInt(idxString)+"";
	};

	public String getCHARGER_ID() {
		return Globals.CHARGER_ID;
	};	
	public String getCHARGER_NM(){
		return Globals.CHARGER_NM;
	};	
	public String getCHARGER_IP_ADRES(){
		return Globals.CHARGER_IP_ADRES;
	};	
	public String getBIZRNO(){
		return Globals.BIZRNO;
	};	
	public String getMNDT_AHRZT(){
		return Globals.MNDT_AHRZT;
	};		
	public String getCNTC_INSTT_CODE(){
		return Globals.CNTC_INSTT_CODE;
	};	
	public String getCNTC_INFO_CODE(){
		return Globals.CNTC_INFO_CODE;
	};	
	
	public void TS_1100() {
		try {
			//selectFor1100
			List list = TOMapper.selectFor1100(new HashMap()); 
			for(int i=0; i < list.size(); i++) {
				Map row = (Map)list.get(i);
				String TsParams1100 = (String)row.get("TsParams1100");
				String idx = (String)row.get("idx");
				TsParams1100 = TsParams1100.replaceAll("\\{", "").replaceAll("\\}", "");
				String[] arr = TsParams1100.split(",");
				Map tsMap = new HashMap();
				for(int j=0; j < arr.length; j++) {
					String keyVal = arr[j];
					String[] arr2 = keyVal.split("=");
					tsMap.put(arr2[0].trim(), arr2[1].trim()); 
				}
				Map responseMap = sendRequestTs(tsMap);
				Map hisMap = new HashMap();
				hisMap.put("REQST_RCEPT_NO",tsMap.get("REQST_RCEPT_NO"));
				hisMap.put("REQST_SE_CODE",tsMap.get("REQST_SE_CODE"));
				hisMap.put("registerId","SYSTEM");
				hisMap.put("idx",idx);
				hisMap.put("TsRequestYn","Y");
				hisMap.put("TsResponse",responseMap.get("TsResponse1100"));
				TOMapper.insertTsHis(hisMap);
				responseMap.put("idx",idx);
				responseMap.put("TsRequestYn1100","Y");
				responseMap.put("TsParams1100", "");
				LOGGER.debug(">>>>>>>>>>>>>>>>>>"+responseMap); 
				TOMapper.updateToForTs(responseMap);
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
	};
	
	
	public Map exeTs1100(Map param) throws Exception{
		Map responseMap = new HashMap();
		List list = TOMapper.reExeTs1100(param); 
		if(list != null && list.size() > 0) {
			Map row = (Map)list.get(0);
			//selectFor1100
			String TsParams1100 = (String)row.get("TsParams1100");
			String idx = row.get("idx").toString();
			TsParams1100 = TsParams1100.replaceAll("\\{", "").replaceAll("\\}", "");
			String[] arr = TsParams1100.split(",");
			Map tsMap = new HashMap();
			for(int j=0; j < arr.length; j++) {
				String keyVal = arr[j];
				String[] arr2 = keyVal.split("=");
				tsMap.put(arr2[0].trim(), arr2[1].trim()); 
			}
			responseMap = sendRequestTs(tsMap);
			Map hisMap = new HashMap();
			hisMap.put("REQST_RCEPT_NO",tsMap.get("REQST_RCEPT_NO"));
			hisMap.put("REQST_SE_CODE",tsMap.get("REQST_SE_CODE"));
			hisMap.put("registerId","SYSTEM");
			hisMap.put("idx",idx);
			hisMap.put("TsRequestYn","Y");
			hisMap.put("TsResponse",responseMap.get("TsResponse1100"));
			TOMapper.insertTsHis(hisMap);
			responseMap.put("idx",idx);
			responseMap.put("TsRequestYn1100","Y");
			responseMap.put("TsParams1100", "");
			LOGGER.debug(">>>>>>>>>>>>>>>>>>"+responseMap); 
			TOMapper.updateToForTs(responseMap);
		}
		return responseMap;
	};
	
	
	public Map getMapForTs(Map paramMap,HttpServletRequest request) {
		ToUserVO userVo = (ToUserVO)request.getSession().getAttribute("userInfo");
		TOUtil.encrypt(paramMap,"bSocialNumber_Second","enc_bSocialNumber_Second");
		TOUtil.encrypt(paramMap,"sSocialNumber_Second","enc_sSocialNumber_Second");
		
		// 화면에서 보내야 하는 값
//		String inqType = (String) paramMap.get("inqType");		// 1: 양도인, 2: 양수인
		String idx = (String) paramMap.get("idx");				// 소유권이전 id (카카오페이 인증호출 후 채번, 값이 있는 경우는 TS이전신청 시 정보오류로 다시 돌아왔을 경우 idx를 보내야함)
		// 소유권이전 insert 안됐을 때만 insert 수행(양도/양수인 요청이 같은 서블릿 url이므로.)
		// 최초 요청 시 소유권이전/양도/양수인 정보 저장
		
		String sellerIdx = (String) paramMap.get("sellerIdx");	// 소유권이전 판매자(양도인)  (카카오페이 인증호출 후 채번, 값이 있는 경우는 TS이전신청 시 정보오류로 다시 돌아왔을 경우 idx를 보내야함)
		String buyerIdx = (String) paramMap.get("buyerIdx");	// 소유권이전 구매자(양수인)  (카카오페이 인증호출 후 채번, 값이 있는 경우는 TS이전신청 시 정보오류로 다시 돌아왔을 경우 idx를 보내야함)
		
		// 양도/양수 카카오페이 인증정보
		String sName = (String) paramMap.get("sName");											// 판매자성명
		String sBirthday = (String) paramMap.get("sBirthday");									// 판매자생년월일(yyyyMMdd)
		String sPhoneNumber = (String) paramMap.get("sPhoneNumber");							// 판매자전화번호
		String bName = (String) paramMap.get("bName");											// 구매자성명
		String bBirthday = (String) paramMap.get("bBirthday");									// 구매자생년월일(yyyyMMdd)
		String bPhoneNumber = (String) paramMap.get("bPhoneNumber");							// 구매자전화번호
		
		// ================================= 임시 조회용 값 set 시작 ================================= //
		// 아래 항목은 화면에서 보내야 하는 값으로, 양도/양수인 최초 1회 인증완료 후 고객정보 오류로 돌아왔을 경우에는 없어도됨. 그 외에는 필수 값
		// 화면 param 명시 값으로 구현 후 제거예정(CertificationState, CertificationId 제외)
		LOGGER.debug("9001:양도증명신청9001:양도증명신청9001:양도증명신청9001:양도증명신청9001:양도증명신청9001:양도증명신청------------------------------> STEP2");
		// 1. 소유권이전 정보
		String UserIndex = "";                      							// 신청자고유번호(TO_USERS테이블 IDX)
		UserIndex = userVo.getIdx();
		LOGGER.debug("9001:양도증명신청9001:양도증명신청9001:양도증명신청9001:양도증명신청9001:양도증명신청9001:양도증명신청------------------------------> STEP3");
		String Request_VehicleNumber =(String) paramMap.get("Request_VehicleNumber");    	// 요청시점의 차량번호                                                                                        
		String Request_OwnerName = (String) paramMap.get("Request_OwnerName");              		// 요청 시점의 소유자 이름                                                                                       
		String Request_DrivingDistance =(String) paramMap.get("Request_DrivingDistance"); // 요청시점의 주행거리                                                                                          
		String RegistrationIndex = (String) paramMap.get("RegistrationIndex");              			// 자동차등록원부 색인번호 - 소유권 이전에 따라 차량 정보가 요청 시점과 다를수 있음                                                      
		String TransferDistrict = (String) paramMap.get("TransferDistrict");               		// 소유권 이전지역                                                                                            
		String PurchasePrice = (String) paramMap.get("PurchasePrice");                  			// 매매금액 (부가세 포함)                                                                                       
		String UserName = (String) paramMap.get("UserName");                       							// 신청자명(로그인사용자명)                                                                                       
		String InsurSstate = (String) paramMap.get("InsurSstate");                    						// 보험가입여부(1:가입, 2:미가입, 3:해당없음(등록 전 시점에 오류 등)    
		String carType = (String) paramMap.get("carType");                    								// 차종    
		String carName = (String) paramMap.get("carName");                    		// 차명    
		String ChassisNumber =(String) paramMap.get("ChassisNumber");                    // 차대번호    
		// 2. 소유권이전 판매자정보 (전자서명 원문 데이터 작성을 위해 양도/양수인 정보를 보내야함)
		String sSocialNumber_First = (String) paramMap.get("sSocialNumber_First");				// 주민번호 앞자리
		String sSocialNumber_Second = (String) paramMap.get("sSocialNumber_Second");			// 주민번호 뒷자리
		String sAddress_Base =(String) paramMap.get("sAddress_Base");						// 주소기본
		String sAddress_Detail = (String) paramMap.get("sAddress_Detail");					// 주소상세
		String sAddress_ZipCode = (String) paramMap.get("sAddress_ZipCode");						// 우편번호
		// 3. 소유권이전 구매자정보 (전자서명 원문 데이터 작성을 위해 양도/양수인 정보를 보내야함)
		String bSocialNumber_First = (String) paramMap.get("bSocialNumber_First");				// 주민번호 앞자리
		String bSocialNumber_Second = (String) paramMap.get("bSocialNumber_Second");			// 주민번호 뒷자리
		String bAddress_Base = (String) paramMap.get("bAddress_Base");					// 주소기본
		String bAddress_Detail = (String) paramMap.get("bAddress_Detail");							// 주소상세
		String bAddress_ZipCode = (String) paramMap.get("bAddress_ZipCode");						// 우편번호
		LOGGER.debug("9001:양도증명신청9001:양도증명신청9001:양도증명신청9001:양도증명신청9001:양도증명신청9001:양도증명신청------------------------------> STEP4");
		// map set
		paramMap.put("UserIndex", UserIndex);
		paramMap.put("Request_VehicleNumber", Request_VehicleNumber);
		paramMap.put("Request_OwnerName", Request_OwnerName);
		paramMap.put("Request_DrivingDistance", Request_DrivingDistance);
		paramMap.put("RegistrationIndex", RegistrationIndex);
		paramMap.put("TransferDistrict", TransferDistrict);
		paramMap.put("PurchasePrice", PurchasePrice);
		paramMap.put("UserName", UserName);
		paramMap.put("InsurSstate", InsurSstate);
		paramMap.put("carType", carType);
		paramMap.put("carName", carName);
		paramMap.put("ChassisNumber", ChassisNumber);
		paramMap.put("sellerName", sName);
		paramMap.put("sellerSocialNumber_First", sSocialNumber_First);
		paramMap.put("sellerSocialNumber_Second", sSocialNumber_Second);
		paramMap.put("sellerPhoneNumber", sPhoneNumber);
		paramMap.put("sellerAddress_Base", sAddress_Base);
		paramMap.put("sellerAddress_Detail", sAddress_Detail);
		paramMap.put("sAddress_ZipCode", sAddress_ZipCode);
		paramMap.put("sBirthday", sBirthday);
		paramMap.put("buyerName", bName);
		paramMap.put("buyerSocialNumber_First", bSocialNumber_First);
		paramMap.put("buyerSocialNumber_Second", bSocialNumber_Second);
		paramMap.put("buyerPhoneNumber", bPhoneNumber);
		paramMap.put("buyerAddress_Base", bAddress_Base);
		paramMap.put("buyerAddress_Detail", bAddress_Detail);
		paramMap.put("bAddress_ZipCode", bAddress_ZipCode);
		paramMap.put("bBirthday", bBirthday);
		LOGGER.debug("9001:양도증명신청9001:양도증명신청9001:양도증명신청9001:양도증명신청9001:양도증명신청9001:양도증명신청------------------------------> STEP5");
		
		if(StringUtils.isEmpty(idx)) {
			// ================================= 임시 조회용 값 set 끝 ================================= //
			String Stage = "1";	//  인증진행중 (양수/양도인 미인증)
			paramMap.put("Stage", Stage);
			// 인증남은시간 (초-> 시간)
			int ExpireTime = Integer.parseInt(Globals.EXPIRES_IN);
			ExpireTime = ExpireTime /60 / 60;
			paramMap.put("ExpireTime", ExpireTime); 
			// 소유권이전(TO_TRANSFEROWNER) isnert
			TOMapper.insertToTransferOwner(paramMap);
//			idx = String.valueOf((long) paramMap.get("idx"));
			idx = paramMap.get("idx").toString();
			
			paramMap.put("TransferOwnerIndex", idx);
			// 소유권이전 판매자정보(TO_TRANSFEROWNER_SELLER) insert
			TOUtil.encrypt(paramMap,"sellerSocialNumber_Second","enc_sellerSocialNumber_Second");
			TOMapper.insertToTransferOwnerSeller(paramMap);
			String idx_sell = "";
//			idx_sell = String.valueOf((long) paramMap.get("idx"));
			idx_sell = paramMap.get("idx").toString();
			
			paramMap.put("sellerIdx", idx_sell);
			TOUtil.encrypt(paramMap,"buyerSocialNumber_Second","enc_buyerSocialNumber_Second");
			TOMapper.insertToTransferOwnerBuyer(paramMap);
			String idx_buy = "";
//			idx_buy = String.valueOf((long) paramMap.get("idx"));
			idx_buy = paramMap.get("idx").toString();
			
			paramMap.put("buyerIdx", idx_buy);
		}else {
			paramMap.put("TransferOwnerIndex", idx);
			paramMap.put("sellerIdx", idx);//인증상태업데이트 에서 사용
			paramMap.put("buyerIdx", idx);
			paramMap.put("sIdx", idx);//양수인,양도인 정보업데이트에서 사용
			paramMap.put("bIdx", idx);
			
			TOMapper.update_TO_TRANSFEROWNER_BUYER(paramMap);
			TOMapper.update_TO_TRANSFEROWNER_SELLER(paramMap);
		};
		
		Map selected = TOMapper.selectToInfoForTs(paramMap);
		TOUtil.decrypt(selected,"buyerSocialNumber_Second","buyerSocialNumber_Second");
		TOUtil.decrypt(selected,"sellerSocialNumber_Second","sellerSocialNumber_Second");
		
		Map tsMap = new HashMap();
		
		tsMap.put("CVPL_REQST_NO",selected.get("CVPL_REQST_NO"));/*연계정보코드*/
		tsMap.put("CNTC_INFO_CODE", getCNTC_INFO_CODE());/*연계정보코드*/
		tsMap.put("CHARGER_ID", getCHARGER_ID());
		tsMap.put("CHARGER_NM", getCHARGER_NM());
		tsMap.put("CHARGER_IP_ADRES",getCHARGER_IP_ADRES());
		tsMap.put("CNTC_INSTT_CODE", getCNTC_INSTT_CODE());/*연계기관코드*/
		tsMap.put("BIZRNO", getBIZRNO());/*사업자등록번호 876-88-01194*/
		tsMap.put("ORGNZT_CODE", Globals.ORGNZT_CODE);/* 등록관청코드 6101: 한국교통안전공단 자동차온라인등록센터 */
		
		if(((String)selected.get("buyerName")).equalsIgnoreCase(userVo.getName())) {
			tsMap.put("APPLCNT_MPNUM", (String)selected.get("buyerPhoneNumber") );/* 대리인 곧 양수인 */
			tsMap.put("APPLCNT_NM", (String)selected.get("buyerName") );/* 대리인 곧 양수인 */
			tsMap.put("APPLCNT_MBER_REGIST_NO", (String)selected.get("buyerSocialNumber_First")+""+(String)selected.get("buyerSocialNumber_Second"));/* 대리인 곧 양수인 */
		}else {
			//양도인 Seller로
			tsMap.put("APPLCNT_MPNUM", (String)selected.get("sellerPhoneNumber"));/* 대리인 */
			tsMap.put("APPLCNT_NM",(String)selected.get("sellerName"));/* 대리인 */
			tsMap.put("APPLCNT_MBER_REGIST_NO",(String)selected.get("sellerSocialNumber_First")+""+(String)selected.get("sellerSocialNumber_Second"));/* 대리인 */
		}
		tsMap.put("ASGR_MPNUM", (String)selected.get("sellerPhoneNumber"));
		tsMap.put("ASGR_NM", (String)selected.get("sellerName"));
		tsMap.put("ASGR_MBER_REGIST_NO", (String)selected.get("sellerSocialNumber_First")+""+(String)selected.get("sellerSocialNumber_Second"));
		
		tsMap.put("GRTE_MPNUM", (String)selected.get("buyerPhoneNumber"));
		tsMap.put("GRTE_NM", (String)selected.get("buyerName"));
		tsMap.put("GRTE_MBER_REGIST_NO", (String)selected.get("buyerSocialNumber_First")+""+(String)selected.get("buyerSocialNumber_Second"));
		tsMap.put("VHRNO",(String)selected.get("Request_VehicleNumber") );/* 자동차등록번호 */
		tsMap.put("TRVL_DSTNC", selected.get("Request_DrivingDistance").toString() );/* 주행거리 */
		tsMap.put("ACQS_AMOUNT", ((Long)selected.get("PurchasePrice")).toString());/* 매매금액 */
		tsMap.put("TRNSFR_DE", Util.getToday("yyyyMMdd"));/* 잔금지급일 없으므로 오늘 */
		tsMap.put("TRDE_CNTRCT_DE", Util.getToday("yyyyMMdd"));/* 매매일 없으므로 오늘 */
		tsMap.put("CAR_DELY_DE", Util.getToday("yyyyMMdd"));/* 인도일 없으므로 오늘 */
		tsMap.put("SELLER_RELATE_SE_CODE", "2");/* 매도자관계 1:배우자 또는 직계비속 2:기타 */
		tsMap.put("PAY_TRGET_GUBUN", Globals.PAY_TRGET_GUBUN);/* 납부대상 1:양수인 2:요청기관(카방) */
		tsMap.put("VIN",(String)selected.get("ChassisNumber") );/* 차대번호 */
		tsMap.put("STMPTAX_ELCTRN_PAY_NO", "0000000000123456789");/* 전자수입인지 고유번호 */
		tsMap.put("TAXT_SE_CODE", Globals.TAXT_SE_CODE);/* 01:양수인, 02:요청기업,03:전체  박민성-> 양도증명신청시 현재 보내주시는 TAXT_SE_CODE 값을 03 -> 02로 수정 (과세구분코드를 카방으로 수정)*/
		tsMap.put("TRNSFR_CHANNEL", Globals.TRNSFR_CHANNEL);/* 이전채널 01:TS(기본), 02:계양구청 */
		/* 3월12일 9001*/
		tsMap.put("MNDT_AHRZT", getMNDT_AHRZT());
		tsMap.put("REQST_RCEPT_NO",(String)selected.get("REQST_RCEPT_NO"));/* 소유권이전아이디에서 -> 20자리 20210321131525000009 년월일시분초(14자리)+6자리코드*/
		
		return tsMap;
	}


	
	public void insertTO_COST(Map<String, Object> mocaMap, ModelMap model) throws Exception {
		Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);

		
//			12.14
//			이전비용 조회는 기존 프로시저를 사용하지 못함 (기존 프로시저에 일부 비율이 하드코딩 되어있고 to_be버전에서는 비용관리로 비율을 관리하므로)
//			프로시저를 호출하는 방식이 아닌 로직 그대로를 소스에 녹여서 사용할 예정
		
		/***************************************************************************************************************
		 * 
		 * 양수인 차고지 지역을 화면에서 보내야함. 지역은 아래 항목과 동일하게 보내야함.
		 * key : District_Major (ex - String District_Major = (String) paramMap.get("District_Major"); )
		 * 서울특별시 / 부산광역시 / 대구광역시 / 인천광역시 / 광주광역시 / 대전광역시 / 울산광역시
		 * 세종특별자치시 / 경기도 / 강원도 / 충청북도 / 전라북도 / 전라남도 / 경상북도 / 경상남도 / 제주특별자치도
		 *   
		 ***************************************************************************************************************/
		
//			output data
		String calcValueType = "";								// 채권 테이블 데이터 수집 방식 - 1 : 배기량 우선 분류 / 2 : 차량 크기 등록 기준 분류 (경형,소형,중형,대형)
		BigDecimal bondInfo_Purchase_Value = null;				// 채권 구매 적용 값 - 비율 또는 금액
		int bondInfo_Purchase_Type = 0;							// 채권 구매 적용 방식 - 0 : 채권구매 없음 / 1 : 비율적용 / 2 : 금액적용)
		BigDecimal bondInfo_Discount_Value = null;				// 채권 할인 적용 값 - 금액
		Integer bondInfo_Discount_Type = 0;						// 채권 할인 적용 방식 - 0 : 면제없음 / 1 : 일부면제 / 2 : 전체면제 / 3 : 한도초과면제
		Integer bondInfo_CutOffType	= 0;						// 채권 할인 후 금액 절사 형식 - 0 : 논리오류(절사없음) / 1 : 절사없음 / 2 : 2500원 미만 절사 / 3 : 5000원 / 4 : 10000원
		BigDecimal bondInfo_PurchasePrice_Original = null;		// 채권 구매 금액 (할인전)
		BigDecimal bondInfo_PurchasePrice_Result = null;		// 채권 구매 금액 (할인후)
		BigDecimal bondInfo_SellingPrice_Basis = null;			// 채권 기준가
		BigDecimal bondInfo_SellingPrice_Today = null;			// 채권 매도 가격 (금일)
		BigDecimal bondInfo_SellingPrice_Result = null;			// 채권 매도 금액
		BigDecimal bondInfo_PurchasePrice_RealCost = null;		// 채권 구매 실소요 비용 (즉시매도 후 차액)
		BigDecimal agencyFee_PurchaseBond_CarBang = null;		// 카방 채권 구매 대행 수수료
		BigDecimal agencyFee_SellingBond_Bank_Ratio = null;		// 은행 채권 매도 대행 수수료율
		BigDecimal agencyFee_SellingBond_Bank = null;			// 은행 채권 매도 대행 수수료
		long leftDayOfMonth = 0;								// 현재 월 남은일수
		Integer dayOfYear = 365;								// 365
		BigDecimal bondInfo_BankIncomeRate = null;				// 은행 이율
		BigDecimal bondInfo_SellingProfit = null;				// 채권 매도 수익금 (선급이자)
		Integer office_StampCost = 0;							// 구청 인지 비용 (사용안함. 관공서 등록수수료, 수입인지만 사용)
		Integer Revenue_StampPrice = 0;							// 수입인지
		Integer agencyFee_Office_Registration = 0;				// 구청 등록 수수료
		Integer agencyFee_Transfer_CarBang = 0;					// 카방 소유권 이전 수수료
		BigDecimal taxRate_Acquisition = null;					// 취득세 비율
		BigDecimal taxPrice_Acquisition_ReductionPrice = null;	// 취득세 감면액
		BigDecimal taxPrice_Acquisition = null;					// 취득세 금액
		BigDecimal taxPrice_Acquisition_RealCost = null;		// 취득세 금액 (감면금액 적용)
		BigDecimal taxRate_Income = null;						// 채권 매도 수익금 소득세율
		BigDecimal taxRate_Local = null;						// 채권 매도 수익금 지방세율
		BigDecimal taxPrice_Income = null;						// 채권 매도 수익금 소득세액
		BigDecimal taxPrice_Local = null;						// 채권 매도 수익금 지방세액
																					BigDecimal lastVehicleBasisPrice = null;				       // 차량 과세표준금액 (입력한 매매금액과 감가상각적용금액중 더 큰 금액)
		BigDecimal bondInfo_SellingSelPayfPrice = null;			// 채권즉시매도시 본인부담액
		BigDecimal officeCharge = null;							// 구청수수료(인지대+수입인지+구청등록수수료)
		BigDecimal total_TransferOwner_Price = null;			// 총 이전비용 
		String Bank_Nm = "";									// 은행명 
		String bondExemptionYn = "N";							// 채권면제여부 
		String today = null;									// 오늘날짜
		
		
		/************************************ 화면에서 보내야하는 파라미터 ************************************/
		String District_Major = (String) paramMap.get("District_Major");						// 양수인 행정구역(시도)
		if(District_Major.indexOf("서울")>-1) {
			District_Major = "서울특별시";
		}else if(District_Major.indexOf("부산")>-1) {
			District_Major = "부산광역시";
		}else if(District_Major.indexOf("대구")>-1) {
			District_Major = "대구광역시";
		}else if(District_Major.indexOf("울산")>-1) {
			District_Major = "울산광역시";
		}else if(District_Major.indexOf("대전")>-1) {
			District_Major = "대전광역시";
		}
		paramMap.put("District_Major",District_Major); 
		String District_Major_Gu = (String) paramMap.get("District_Major_Gu");					// 양수인 행정구역(구)
		String VehicleBasisPrice = (String) paramMap.get("VehicleBasisPrice");					// 매매가격 (경감율 적용된 매매가 또는 과세표준 금액)
		String toVehicleRegistrationIdx = (String) paramMap.get("toVehicleRegistrationIdx");	// 자동차 등록원부 idx
		String toTransferOwnerIdx = (String) paramMap.get("toTransferOwnerIdx");				// 소유권이전요청 IDX (/TOM_52/mobile/sendKakaoCert.do 결과값으로 화면에 RETURN하는값)
		
		/************************************ idx로 차량상세조회 후 조회하는 파라미터 ************************************/
		String NewVehicle 		= "0";					// 신차중고차구분 - 0 고정사용-다 중고차임 (0 : 중고차 / 1 : 신차)
		String BusinessType 	= "자가용";				// 자가용/영업용 (개인소유권이전은 다 비영업용 대상임. 자가용 고정)
		String VehicleType 		= "";					// 차량형식 : 승용, 승합, 화물
		String Class			= "";					// 차량등급	: 경형, 소형, 중형, 대형
		String Fuel 			= "";					// 연료 		: 휘발유, 경유, 전기, 수소, 하이브리드 (친환경 자동차의 경우 하이브리드로 설정)
		String Purpose			= "";					// 사용목적	: 일반, 다목적
		String Weight 			= "";					// 차량 무게 (톤 단위)
		String RidingCapacity 	= "";					// 승차인원
		String Displacement 	= "";					// 배기량
		String EcoFriendly 		= "";					// 친환경여부 (0:일반, 1: 친환경)
		String RegNumber 		= "";					// 차량번호(미필수, 로그 기록용)
		String CountryOrigin 	= "";					// 제조국(국산/수입)
		
		// 고정값 set
		paramMap.put("NewVehicle", NewVehicle);
		paramMap.put("BusinessType", BusinessType);

		
		// ================================= 임시 조회용 값 set 시작 ================================= //
		
//			if("".equals(District_Major) || District_Major == null) District_Major = "서울특별시";									// 행정구역(시도)
//			if("".equals(VehicleBasisPrice) || VehicleBasisPrice == null) VehicleBasisPrice = "19000000";						// 사용자 입력 매매금액
//			if("".equals(toVehicleRegistrationIdx) || toVehicleRegistrationIdx == null) toVehicleRegistrationIdx = "127";		// 자동차 등록원부 idx
//			
//			paramMap.put("District_Major", District_Major);
//			paramMap.put("VehicleBasisPrice", VehicleBasisPrice);
//			paramMap.put("idx", toVehicleRegistrationIdx);
		
		// ================================= 임시 조회용 값 set 끝 ================================= //
		
		// 차량 상세조회용 idx put (조회 시 변수 처리를 위해 보낸값이 아닌 idx로 put) -- 여러군데서 사용하므로 변수명 맞추기 위해.
		paramMap.put("idx", toVehicleRegistrationIdx);

		// 오늘날짜
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		today = sdf.format(new Date());
		
		
		// 사용자 입력 매매금액은 수수료를 제외한 금액으로 봐야함 (매매금액 = 매매금액 / 1.1)
		int tmpVehicleBasisPrice = Integer.parseInt(VehicleBasisPrice);
		tmpVehicleBasisPrice = (int) (tmpVehicleBasisPrice / 1.1);
		VehicleBasisPrice = String.valueOf(tmpVehicleBasisPrice);
		paramMap.put("VehicleBasisPrice", VehicleBasisPrice);
		
		// 차량 상세조회
		Map<String, Object> carInfoDetail = TOMapper.selectCarInfoDetail(paramMap);
		
		if(carInfoDetail == null) {
			throw new Exception("차량 상세 정보가 없습니다");
		}
		
		VehicleType 	= carInfoDetail.get("CarType").toString();				// 차량형식 : 승용, 승합, 화물
		Class			= carInfoDetail.get("Class").toString();				// 차량등급	: 경형, 소형, 중형, 대형
		Fuel 			= carInfoDetail.get("Fuel").toString();					// 연료 		: 휘발유, 경유, 전기, 수소, 하이브리드 (친환경 자동차의 경우 하이브리드로 설정)
		Purpose			= carInfoDetail.get("Purpose").toString();				// 사용목적	: 일반, 다목적
		Weight 			= carInfoDetail.get("Weight").toString();				// 차량 무게 (톤 단위)
		RidingCapacity 	= carInfoDetail.get("RidingCapacity").toString();		// 승차인원
		Displacement 	= carInfoDetail.get("Displacement").toString();			// 배기량
		EcoFriendly 	= carInfoDetail.get("EcoFriendly").toString();			// 친환경여부 (0:일반, 1: 친환경)
		RegNumber 		= carInfoDetail.get("RegNumber").toString();			// 차량번호(미필수, 로그 기록용)
		CountryOrigin 	= carInfoDetail.get("CountryOrigin").toString();		// 제조국
		
		// 친환경여부
		if("Y".equals(EcoFriendly)){
			EcoFriendly = "1";
			carInfoDetail.put("EcoFriendly", EcoFriendly);
		} else {
			EcoFriendly = "0";
		}
		
		if("수입".equals(CountryOrigin)) {
			CountryOrigin = "외산";
			carInfoDetail.put("CountryOrigin", CountryOrigin);
		}

		if(!"승용".equals(VehicleType)) {
			CountryOrigin = "통합";
			carInfoDetail.put("CountryOrigin", CountryOrigin);
		}
		
		// 차량시세조회
		// 차량 시세적용은 제작 경과년/월/일을 구해서 경과년으로 계산하지만, 이전비용 계산 시에는 경과년이 아닌 현재년도-제작년도 기준으로 계산해야함. (21.01.22 이지선K)
		carInfoDetail.put("calcTransferCost", "Y");
		Map<String, Object> carPriceInfo = TOMapper.selectRemainingPrice(carInfoDetail);
		BigDecimal UsedCarRemainingPrice = null;
		
		if(carPriceInfo != null) {
			BigDecimal tmpVal1 = new BigDecimal(carPriceInfo.get("bondStndardPrice").toString());	// 채권계산을 위한 감가상각적용금액(추가율없이 기준 잔가율만 곱한 값)
			
			// 감가상각 적용금액 천원 미만 절사
			UsedCarRemainingPrice = new BigDecimal(tmpVal1.setScale(-3, BigDecimal.ROUND_DOWN).intValue());	
		}
		
		// 입력한 매매금액과 차량시세가격 중 더 높은 금액을 차량시세 기준금액으로 잡는다.
		if(!"".equals(UsedCarRemainingPrice) && !"0".equals(UsedCarRemainingPrice)) {
			BigDecimal tempVehicleBasisPrice = new BigDecimal(VehicleBasisPrice);
			
			if(tempVehicleBasisPrice.compareTo(UsedCarRemainingPrice) == 1) {
				lastVehicleBasisPrice = tempVehicleBasisPrice;
			} else {
				lastVehicleBasisPrice = UsedCarRemainingPrice;
			}
		} else {
			lastVehicleBasisPrice = new BigDecimal(VehicleBasisPrice);
		}
		
		paramMap.putAll(carInfoDetail);
		paramMap.putAll(carPriceInfo);
		
		
		int ditrictMajorCd = 0;
		
		if(StringUtils.isEmpty(District_Major)) {
			throw new Exception("양수인 차고지 지역은 필수 값입니다.");
		} else {
			if("서울특별시".equals(District_Major)) {
				ditrictMajorCd = 1;	// 서울도시철도채권
			} else if("부산광역시".equals(District_Major) || "대구광역시".equals(District_Major)) {
				ditrictMajorCd = 2;	// 지방도시철도채권
			} else {
				ditrictMajorCd = 3;	// 지역개발채권
			}
		}
		paramMap.put("ditrictMajorCd", ditrictMajorCd);
		
		// 지역에 따른 채권우선조건 조회
		calcValueType = TOMapper.selectToBondBasisValueType(paramMap);
		
		// 지역에 따른 수수로율 조회
		Map<String, Object> taxMap = TOMapper.selectToTransferCostPrice(paramMap);
		if(taxMap == null) {
			throw new Exception("지역에 따른 수수로율 조회실패["+District_Major+"]");
		}
		
		bondInfo_CutOffType 				=  (Integer) taxMap.get("Cutoff_Type");								// 원단위 절사금액
		office_StampCost 					=  (Integer) taxMap.get("Office_StampPrice");						// 인지대
		Revenue_StampPrice 					=  (Integer) taxMap.get("Revenue_StampPrice");						// 수입인지
		agencyFee_Office_Registration 		=  (Integer) taxMap.get("Office_RegistrationFee");					// 구청등록수수료
		agencyFee_Transfer_CarBang 			=  (Integer) taxMap.get("Carbang_RegistrationFee"); 				// 카방 소유권 이전 수수료
		agencyFee_PurchaseBond_CarBang 		=  new BigDecimal(taxMap.get("PurchaseBond_CarBang").toString());	// 카방 채권 구매 대행 수수료
		agencyFee_SellingBond_Bank_Ratio 	=  new BigDecimal(taxMap.get("Bank_AgencyFee").toString());			// 은행 채권 매도 대행 수수료율
		bondInfo_BankIncomeRate 			=  new BigDecimal(taxMap.get("Bank_IncomeRate").toString());		// 은행이율
		taxRate_Income 						=  new BigDecimal(taxMap.get("Bank_IncomeTax").toString()); 		// 채권 매도 수익금 소득세율
		taxRate_Local 						=  new BigDecimal(taxMap.get("Bank_LocalTax").toString()); 			// 은행지방소득세
		leftDayOfMonth 						=  (long) taxMap.get("LeftDayOfMonth"); 							// 현재월 남은일수
		Bank_Nm 							=  (String) taxMap.get("Bank_Nm"); 									// 은행명
		
		
		// 취득세 및 감면금액 조회
		String classType = "";
		if("경형".equals(Class)){
			classType = "1";	// 경형
		} else {
			classType = "2";	// 소/중/대형
		}
		paramMap.put("classType", classType);
		
		// 이전비 계산용 취득세/감면비율 조회 
		Map<String, Object> acqMap = TOMapper.selectAcquistionPriceByTransfer(paramMap);
		
		taxRate_Acquisition = new BigDecimal(acqMap.get("Acquisition_taxRate").toString());
		BigDecimal rdcTmp1 = new BigDecimal(acqMap.get("ReductionPrice1").toString());	// 기본감면금액
		BigDecimal rdcTmp2 = new BigDecimal(acqMap.get("ReductionPrice2").toString());	// 친환경 감면금액
		
		// 친환경차량
		if("1".equals(EcoFriendly)){
			// 취득세 감면액은 기본감면, 친환경감면 중 더 큰 금액을 구한다
			if(rdcTmp1.compareTo(rdcTmp2) == 1) {
				taxPrice_Acquisition_ReductionPrice = rdcTmp1;
			} else {
				taxPrice_Acquisition_ReductionPrice = rdcTmp2;
			}
		} else {
			taxPrice_Acquisition_ReductionPrice = rdcTmp1;
		}
		
		
		
		// 현재시간에 따라 추가율 적용/미적용 된 일별 채권단가 조회
		Map<String, Object> bondPriceMap = TOMapper.selectToUpriceByTime(paramMap);
		
		if(bondPriceMap == null) {
			throw new Exception("채권기준가 조회오류");
		}
		
		bondInfo_SellingPrice_Basis = new BigDecimal(bondPriceMap.get("BondPrice_Basis").toString());	// 채권 기준가
		bondInfo_SellingPrice_Today = new BigDecimal(bondPriceMap.get("BondPrice_Today").toString());	// 채권 매도 가격 (금일)
		
		// input map에 모든 값 set 후 최종 리턴
		paramMap.put("calcValueType", calcValueType);
		//paramMap.putAll(acqMap);
		paramMap.putAll(taxMap);
		paramMap.putAll(bondPriceMap);
		
		String otherCase = "";
		String sortType = "1";
		paramMap.put("sortType", sortType);
		LOGGER.debug("paramMapparamMapparamMapparamMapparamMapparamMap:"+paramMap); 
		// 지역별 채권율 계산 타입 조회
		Map<String, Object> PurchaseTypeMap = TOMapper.selectBondPurchaseTypeValue(paramMap);
		bondInfo_Purchase_Type = (Integer) PurchaseTypeMap.get("ApplyType");	// 채권계산방법
		
		// 지역별 채권율 할인율 계산 타입 조회
		Map<String, Object> discountTypeMap = TOMapper.selectBondDiscountTypeValue(paramMap);
		bondInfo_Discount_Type = (Integer) discountTypeMap.get("ApplyType");	// 채권할인 계산방법
		
		// 화물의 경우 넝어오는 값이 (타입/value) 0이면 otherCase 1-4까지 넣고 다시조회
		if(VehicleType.equals("화물")) {
			// 화물 채권계산타입이 0이면 4회 더 다른 케이스를 조회.
			if(bondInfo_Purchase_Type == 0) {
				for(int i = 1; i < 5; i++) {
					otherCase = String.valueOf(i);
					paramMap.put("otherCase", otherCase);
					PurchaseTypeMap = TOMapper.selectBondPurchaseTypeValue(paramMap);
					bondInfo_Purchase_Type = (Integer) PurchaseTypeMap.get("ApplyType");	// 채권계산방법
					
					if(bondInfo_Purchase_Type > 0) {
						break;
					}
				}
			}
			// 화물 채권할인타입이 0이면 4회 더 다른 케이스를 조회.
			if(bondInfo_Discount_Type == 0) {
				for(int i = 1; i < 5; i++) {
					otherCase = String.valueOf(i);
					paramMap.put("otherCase", otherCase);
					discountTypeMap = TOMapper.selectBondPurchaseTypeValue(paramMap);
					bondInfo_Discount_Type = (Integer) discountTypeMap.get("ApplyType");	// 채권계산방법
					
					if(bondInfo_Discount_Type > 0) {
						break;
					}
				}
			}
		}

		sortType = "2";
		paramMap.put("sortType", sortType);
		
		// 지역별 채권율 계산 값 조회
		Map<String, Object> PurchaseValMap = TOMapper.selectBondPurchaseTypeValue(paramMap);
		bondInfo_Purchase_Value = new BigDecimal(PurchaseValMap.get("ApplyValue").toString());	// 채권계산적용율/금액
		
		// 지역별 채권율 할인율 계산 값 조회
		Map<String, Object> discountValMap = TOMapper.selectBondDiscountTypeValue(paramMap);
		bondInfo_Discount_Value = new BigDecimal(discountValMap.get("ApplyValue").toString());	// 채권할인 적용율/금액
		
		// 화물의 경우 넝어오는 값이 (타입/value) 0이면 otherCase 1-4까지 넣고 다시조회
		if(VehicleType.equals("화물")) {
			
			// 화물 채권계산금액이 0이면 4회 더 다른 케이스를 조회.
			if(bondInfo_Purchase_Value.equals(0)) {
				for(int i = 1; i < 5; i++) {
					otherCase = String.valueOf(i);
					paramMap.put("otherCase", otherCase);
					PurchaseValMap = TOMapper.selectBondPurchaseTypeValue(paramMap);
					bondInfo_Purchase_Value = new BigDecimal(PurchaseValMap.get("ApplyValue").toString());	// 채권계산적용율/금액
					
					if(!bondInfo_Purchase_Value.equals(0)) {
						break;
					}
				}
			}
			// 화물 채권할인금액이 0이면 4회 더 다른 케이스를 조회.
			if(bondInfo_Discount_Value.equals(0)) {
				for(int i = 1; i < 5; i++) {
					otherCase = String.valueOf(i);
					paramMap.put("otherCase", otherCase);
					discountValMap = TOMapper.selectBondDiscountTypeValue(paramMap);
					bondInfo_Discount_Value = new BigDecimal(discountValMap.get("ApplyValue").toString());	// 채권할인 적용율/금액
					
					if(!bondInfo_Discount_Value.equals(0)) {
						break;
					}
				}
			}
		}
		
		// 승용 다목적 또는 7인이상일 때 채권계산방법이 0(해당없음)일 경우 해당 지역 채권계산 방법(배기량/대중소형)에 따라 다시 채권율을 계산한다.
		if("승용".equals(VehicleType) && bondInfo_Purchase_Type == 0 && (Integer.parseInt(RidingCapacity) >= 7 || "다목적".equals(Purpose)) ) {
			paramMap.put("RidingCapacity", "0");
			paramMap.put("Purpose", "");
			
			PurchaseTypeMap = TOMapper.selectBondPurchaseTypeValue(paramMap);
			bondInfo_Purchase_Type = (Integer) PurchaseTypeMap.get("ApplyType");	// 채권계산방법
				
			// 지역별 채권율 계산 값 조회
			PurchaseValMap = TOMapper.selectBondPurchaseTypeValue(paramMap);
			bondInfo_Purchase_Value = new BigDecimal(PurchaseValMap.get("ApplyValue").toString());	// 채권계산적용율/금액
			
			paramMap.put("RidingCapacity", RidingCapacity);
			paramMap.put("Purpose", Purpose);
		}
		
		// 승용 다목적 또는 7인이상일 때 채권할인방법이 4(해당없음)일 경우 해당 지역 채권할인 방법(배기량/대중소형)에 따라 다시 채권할인율을 계산한다.
		if("승용".equals(VehicleType) && bondInfo_Discount_Type == 4 && (Integer.parseInt(RidingCapacity) >= 7 || "다목적".equals(Purpose)) ) {
			paramMap.put("RidingCapacity", "0");
			paramMap.put("Purpose", "");
			
			// 지역별 채권율 할인율 계산 타입 조회
			discountTypeMap = TOMapper.selectBondDiscountTypeValue(paramMap);
			bondInfo_Discount_Type = (Integer) discountTypeMap.get("ApplyType");	// 채권할인 계산방법
			
			discountValMap = TOMapper.selectBondDiscountTypeValue(paramMap);
			bondInfo_Discount_Value = new BigDecimal(discountValMap.get("ApplyValue").toString());	// 채권할인 적용율/금액
			
			paramMap.put("RidingCapacity", RidingCapacity);
			paramMap.put("Purpose", Purpose);
		}
		
		// 채권 구매 금액 (할인전)을 구한다.
		if(bondInfo_Purchase_Type == 0) {			// 채권구매 없음
			bondInfo_PurchasePrice_Original = new BigDecimal(0);
			
		} else if(bondInfo_Purchase_Type == 1) {	// 비율적용
			BigDecimal temp = lastVehicleBasisPrice.multiply(bondInfo_Purchase_Value);
			bondInfo_PurchasePrice_Original = temp.divide(new BigDecimal("100"), 3, BigDecimal.ROUND_HALF_UP);	// 소수점 3자리수 반올림
			
		} else if(bondInfo_Purchase_Type == 2) {	// 금액적용
			bondInfo_PurchasePrice_Original = bondInfo_Purchase_Value;
		}
		
		
		// 원단위 절사처리
		Map<String, Object> calcMap = new HashMap<String, Object>();
		calcMap.put("targetPrice", bondInfo_PurchasePrice_Original);
		calcMap.put("type", bondInfo_CutOffType);
		
		// 원단위 절사가 적용된 금액을 구한다
		bondInfo_PurchasePrice_Original = TOMapper.getBondInfoPurchasePriceCutoff(calcMap);
		
		// 채권 구매 금액 (할인후)을 구한다.
		if(bondInfo_Discount_Type == 0) {			// 면제없음
			bondInfo_PurchasePrice_Result = bondInfo_PurchasePrice_Original;
		} else if(bondInfo_Discount_Type == 1) {	// 일부면제
			
			// 채권 구매금액이 할인금액보다 크면 채권 구매 금액 (할인후) = 할인전금액-할인금액
			if(bondInfo_PurchasePrice_Original.compareTo(bondInfo_Discount_Value) == 1) {	
				bondInfo_PurchasePrice_Result = bondInfo_PurchasePrice_Original.subtract(bondInfo_Discount_Value);
			} 
			// 할인 금액이 할인전 금액보다 크면 채권구매금액은 0
			else {
				bondInfo_PurchasePrice_Result = new BigDecimal("0");
			}
		} else if(bondInfo_Discount_Type == 2) {	// 전체면제
			bondInfo_PurchasePrice_Result = new BigDecimal("0");	// 전체 면제이므로 채권구매금액 0
		} else if(bondInfo_Discount_Type == 3) {	// 한도초과면제
			
			//  할인전 금액이 할인금액보다 크면 채권구매금액은 할인금액
			if(bondInfo_PurchasePrice_Original.compareTo(bondInfo_Discount_Value) == 1) {
				bondInfo_PurchasePrice_Result = bondInfo_Discount_Value;
			} 
			// 할인금액이 작으면 채권구매금액은 할인전 금액
			else {
				bondInfo_PurchasePrice_Result = bondInfo_PurchasePrice_Original;
			}
		}
		
		// 채권 매도 금액(즉시할인금액)
		bondInfo_SellingPrice_Result =  bondInfo_PurchasePrice_Result.multiply(bondInfo_SellingPrice_Today)
											.divide(bondInfo_SellingPrice_Basis, 0, BigDecimal.ROUND_FLOOR);
		
		// 채권 구매 실소요 비용 (즉시매도 후 차액) = 채권 구매 금액 (할인후) - 채권 매도 금액
		bondInfo_PurchasePrice_RealCost = bondInfo_PurchasePrice_Result.subtract(bondInfo_SellingPrice_Result);
		
		// 카방 채권 구매 대행 수수료 = 채권 구매 금액 (할인후) * 카방대행 수수료율이 4000보다 작으면 4000, 아니면 권 구매 금액 (할인후) * 카방대행 수수료율
		BigDecimal carcTemp =  bondInfo_PurchasePrice_Result.multiply(agencyFee_PurchaseBond_CarBang);
		
		if(carcTemp.compareTo(new BigDecimal("4000")) == 1) {
			agencyFee_PurchaseBond_CarBang = carcTemp;
		} else {
			agencyFee_PurchaseBond_CarBang = new BigDecimal("4000");
		}
		
		// 수수료 원미만 절사
		agencyFee_PurchaseBond_CarBang = new BigDecimal(agencyFee_PurchaseBond_CarBang.setScale(1, BigDecimal.ROUND_DOWN).intValue());
		
		// 은행 채권 매도 대행 수수료 (비용관리 조회 시  퍼센트가 아닌 실제 곱할 금액을 조회했으므로, 따로 /100 처리하지 않아도 됨)
		agencyFee_SellingBond_Bank = new BigDecimal(bondInfo_SellingPrice_Result.multiply(agencyFee_SellingBond_Bank_Ratio).setScale(-1, BigDecimal.ROUND_DOWN).intValue());
		
		// 채권 매도 수익금 (선급이자) (비용관리 조회 시  퍼센트가 아닌 실제 곱할 금액을 조회했으므로, 따로 /100 처리하지 않아도 됨). 소수점 이하 버림
		bondInfo_SellingProfit = bondInfo_PurchasePrice_Result.multiply(bondInfo_BankIncomeRate)
								.multiply(new BigDecimal(leftDayOfMonth)).divide(new BigDecimal(dayOfYear), 0, BigDecimal.ROUND_FLOOR);
		
		// 취득세 금액을 구한다 (원단위 절사)
		taxPrice_Acquisition = new BigDecimal(lastVehicleBasisPrice.multiply(taxRate_Acquisition).setScale(-1, BigDecimal.ROUND_DOWN).intValue());
		
		// 감면액 적용 후 취득세 최종금액을 구한다
		taxPrice_Acquisition_RealCost = taxPrice_Acquisition.subtract(taxPrice_Acquisition_ReductionPrice);
		// 취득세 최종금액이 0보다 작으면 0
		if(taxPrice_Acquisition_RealCost.compareTo(new BigDecimal("0")) != 1) {
			taxPrice_Acquisition_RealCost = new BigDecimal("0");
		}
		
		// 채권 매도 수익금 소득세액 (원단위절사)
		taxPrice_Income = new BigDecimal(bondInfo_SellingProfit.multiply(taxRate_Income).setScale(-1, BigDecimal.ROUND_DOWN).intValue());
		// 채권 매도 수익금 지방세액(=지방소득세)
		taxPrice_Local = new BigDecimal(taxPrice_Income.multiply(taxRate_Local).setScale(-1, BigDecimal.ROUND_DOWN).intValue());
		
		
		// 채권즉시매도시 본인부담액 (즉시할인매도금액+은행대행수수료-선급이자+소득세+지방소득세)
		bondInfo_SellingSelPayfPrice = bondInfo_PurchasePrice_RealCost.add(agencyFee_SellingBond_Bank)
										.subtract(bondInfo_SellingProfit).add(taxPrice_Income).add(taxPrice_Local);
		
		// 구청수수료 (인지대 + 등록수수료 + 수입인지) 우선 등록수수료는 비용관리에서 다0원으로 설정. 추후 TS 추가등록비용을 내야한다면 등록수수료 금액 변경, 
		// 구청 수수료 계산은 인지대/등록수수료/수입인지 세 항목을 다 더하는걸로 협의 (20.12.18 이지선K)
		officeCharge = new BigDecimal(Revenue_StampPrice + agencyFee_Office_Registration + office_StampCost);
		
		
		// 총 이전비용(채권즉시매도시 본인부담액 + 카방 채권매입대행 전산이용(기본4000원, 이상 0.415%) + 구청등록수수료 + 취득세 납부액 + 이전대행 수수료) 
		total_TransferOwner_Price = bondInfo_SellingSelPayfPrice.add(agencyFee_PurchaseBond_CarBang)
										.add(officeCharge).add(taxPrice_Acquisition_RealCost).add(new BigDecimal(agencyFee_Transfer_CarBang));
		
		bondExemptionYn = bondInfo_PurchasePrice_Result.equals(0)? "Y" : "N";
		
		Map<String, Object> transferCostMap = new HashMap<String, Object>();
		
		transferCostMap.put("District_Major", District_Major);										// 매입 지자체(시도)
		transferCostMap.put("District_Major_Gu", District_Major_Gu);								// 매입 지자체(구)
		transferCostMap.put("ValueType", calcValueType);											// 채권 테이블 데이터 수집 방식 - 1 : 배기량 우선 분류 / 2 : 차량 크기 등록 기준 분류 (경형,소형,중형,대형)
		transferCostMap.put("bondInfo_Purchase_Value", bondInfo_Purchase_Value);					// 채권 구매 적용 값 - 비율 또는 금액
		transferCostMap.put("bondInfo_Purchase_Type", bondInfo_Purchase_Type);						// 채권 구매 적용 방식 - 0 : 채권구매 없음 / 1 : 비율적용 / 2 : 금액적용)
		transferCostMap.put("bondInfo_Discount_Value", bondInfo_Discount_Value);					// 채권 할인 적용 값 - 금액
		transferCostMap.put("bondInfo_Discount_Type", bondInfo_Discount_Type);						// 채권 할인 적용 방식 - 0 : 면제없음 / 1 : 일부면제 / 2 : 전체면제 / 3 : 한도초과면제
		transferCostMap.put("bondInfo_CutOffType", bondInfo_CutOffType);							// 채권 할인 후 금액 절사 형식 - 0 : 논리오류(절사없음) / 1 : 절사없음 / 2 : 2500원 미만 절사 / 3 : 5000원 / 4 : 10000원
		transferCostMap.put("bondInfo_SellingPrice_Basis", bondInfo_SellingPrice_Basis);			// 채권 기준가
		transferCostMap.put("agencyFee_SellingBond_Bank_Ratio", agencyFee_SellingBond_Bank_Ratio);	// 은행 채권 매도 대행 수수료율
		transferCostMap.put("leftDayOfMonth", leftDayOfMonth);										// 현재 월 남은일수
		transferCostMap.put("bondInfo_BankIncomeRate", bondInfo_BankIncomeRate);					// 은행 이율
		transferCostMap.put("taxRate_Acquisition", taxRate_Acquisition);							// 취득세 비율
		transferCostMap.put("taxRate_Income", taxRate_Income);										// 채권 매도 수익금 소득세율
		transferCostMap.put("taxRate_Local", taxRate_Local);										// 채권 매도 수익금 지방세율
		transferCostMap.put("total_TransferOwner_Price", total_TransferOwner_Price);				// 총 이전비용
		transferCostMap.put("taxPrice_Acquisition_RealCost", taxPrice_Acquisition_RealCost);		// 취득세 최종금액 
		transferCostMap.put("taxPrice_Acquisition", taxPrice_Acquisition);							// 취득세 
		transferCostMap.put("taxPrice_Acquisition_ReductionPrice", taxPrice_Acquisition_ReductionPrice);		// 취득세 할인면제금액
		transferCostMap.put("Bank_Nm", Bank_Nm);													// 채권매입은행
		transferCostMap.put("bondInfo_SellingPrice_Today", bondInfo_SellingPrice_Today);			// 채권매도단가
		transferCostMap.put("bondInfo_SellingPrice_Result", bondInfo_SellingPrice_Result);			// 채권매입금액
		transferCostMap.put("bondInfo_PurchasePrice_RealCost", bondInfo_PurchasePrice_RealCost);	// 즉시할인매도금액
		transferCostMap.put("agencyFee_SellingBond_Bank", agencyFee_SellingBond_Bank);				// 은행수수료
		transferCostMap.put("bondInfo_SellingProfit", bondInfo_SellingProfit);						// 선급이자
		transferCostMap.put("taxPrice_Income", taxPrice_Income);									// 소득세
		transferCostMap.put("taxPrice_Local", taxPrice_Local);										// 지방소득세
		transferCostMap.put("agencyFee_PurchaseBond_CarBang", agencyFee_PurchaseBond_CarBang);		// 채권매입전산이용료
		transferCostMap.put("officeCharge", officeCharge);											// 인지세
		transferCostMap.put("Revenue_StampPrice", Revenue_StampPrice);								// 전자수입인지
		transferCostMap.put("agencyFee_Office_Registration", agencyFee_Office_Registration);		// 관공서등록수수료
		transferCostMap.put("office_StampCost", office_StampCost);									// 인지대
		transferCostMap.put("agencyFee_Transfer_CarBang", agencyFee_Transfer_CarBang);				// 카방 이전등록대행료
		transferCostMap.put("bondExemptionYn", bondExemptionYn);									// 채권면제여부
		transferCostMap.put("District_Major", District_Major);										// 매입지자체
		transferCostMap.put("today", today);														// 오늘날짜
		transferCostMap.put("bondInfo_PurchasePrice_Original", bondInfo_PurchasePrice_Original);	// 채권 구매 금액 (할인전)
		transferCostMap.put("bondInfo_PurchasePrice_Result", bondInfo_PurchasePrice_Result);		// 채권 구매 금액 (할인후)
		transferCostMap.put("bondInfo_Discount_Value", bondInfo_Discount_Value);					// 채권할인금액
		transferCostMap.put("bondInfo_SellingSelPayfPrice", bondInfo_SellingSelPayfPrice);			// 채권비용 계(채권즉시매도시 본인부담액)
		transferCostMap.put("toTransferOwnerIdx", toTransferOwnerIdx);								// 소유권 이전요청 idx
		transferCostMap.put("lastVehicleBasisPrice", lastVehicleBasisPrice);						// 차량과세표준금액
		transferCostMap.put("VehicleBasisPrice", VehicleBasisPrice);								// 입력매매가격(부가세제외)
		transferCostMap.put("RegNumber", carInfoDetail.get("RegNumber"));							// 차량번호
		transferCostMap.put("District_Major", paramMap.get("District_Major"));						// 양수인 주소 시도
		transferCostMap.put("District_Major_Gu", paramMap.get("District_Major_Gu"));				// 양수인 주소 구
		transferCostMap.put("UsedCarRemainingPrice", UsedCarRemainingPrice);						// 표준금액에 경감율적용한 금액
		
		// 소유권이전 금액정보 insert
		TOMapper.deleteTransferownerCost(transferCostMap); 
		TOMapper.insertToTransferownerCost(transferCostMap);
		// 임시. 화면확인용 로그 시작
		Map<String, Object> tempLogMap = new HashMap<String, Object>();
		
		tempLogMap.put("차량과세표준금액", lastVehicleBasisPrice);
		tempLogMap.put("입력매매금액", VehicleBasisPrice);
		tempLogMap.put("감가상각적용금액", UsedCarRemainingPrice);
		tempLogMap.put("지역 채권율", bondInfo_Purchase_Value);
		tempLogMap.put("채권단위적용금액(절사후)", bondInfo_PurchasePrice_Original);	// 절사 전 금액에 절사 후 금액을 덮었으므로 절사전(매매가용 채권액) 은 수기계산시 확인해야함
		tempLogMap.put("채권 할인 후 금액 절사 형식(0 : 논리오류(절사없음) / 1 : 5000 / 2 : 10000 / 3 : 최저매입금액)", bondInfo_CutOffType);
		tempLogMap.put("채권할인금액", bondInfo_Discount_Value);
		tempLogMap.put("실채권금액", bondInfo_PurchasePrice_Result);
		tempLogMap.put("채권매도단가", bondInfo_SellingPrice_Today);
		tempLogMap.put("(매도단가 적용금액)즉시할인금액", bondInfo_SellingPrice_Result);
		tempLogMap.put("즉시할인매도금액", bondInfo_PurchasePrice_RealCost);
		tempLogMap.put("(원단위절사) 은행 대행수수료(0.6%)", agencyFee_SellingBond_Bank);
		tempLogMap.put("(서울1.00 / 그외 1.05) 공채(은행)발행이율", bondInfo_BankIncomeRate);
		tempLogMap.put("현재 월 남은일수", leftDayOfMonth);
		tempLogMap.put("일수", dayOfYear);
		tempLogMap.put("(원미만 절사) 선급이자 금액", bondInfo_SellingProfit);
		tempLogMap.put("(원단위 절사) 소득세 14%", taxPrice_Income);
		tempLogMap.put("(원단위 절사) 지방소득세 10%", taxPrice_Local);
		tempLogMap.put("채권비용 계(채권즉시매도시 본인부담액)", bondInfo_SellingSelPayfPrice);
		tempLogMap.put("(원미만절사) 카방 채권매입대행 전산이용(기본4000원, 이상 0.415%)", agencyFee_PurchaseBond_CarBang);
		tempLogMap.put("인지대(3000)+수입인지(3,000)+구청등록수수료(0)", officeCharge);
		tempLogMap.put("(원단위절사) 취득세 **% ", taxPrice_Acquisition);
		tempLogMap.put("경차 감경/친환경차량 취득세 감경", taxPrice_Acquisition_ReductionPrice);
		tempLogMap.put("취득세 납부액", taxPrice_Acquisition_RealCost);
		tempLogMap.put("이전대행 수수료", agencyFee_Transfer_CarBang);
		tempLogMap.put("총 이전비용", total_TransferOwner_Price);
		tempLogMap.put("차량형식", VehicleType);
		tempLogMap.put("배기량", Displacement);
		tempLogMap.put("차량등급", Class);
		tempLogMap.put("사용목적", Purpose);
		tempLogMap.put("승차인원", RidingCapacity);
		tempLogMap.put("친환경여부(1: 친환경, 0: 친환경아님)", EcoFriendly);
		tempLogMap.put("제조국", CountryOrigin);
		tempLogMap.put("차량번호", RegNumber);
		tempLogMap.put("유종", Fuel);
		tempLogMap.put("행정구역(시도)", District_Major);

		model.addAttribute("tempLogMap", tempLogMap);	// 임시 (검증을 위한 각 항목 한글key)
		// 임시. 화면확인용 로그 끝
		
		
		model.addAttribute("taxMap", taxMap);
		model.addAttribute("bondPriceMap", bondPriceMap);
		model.addAttribute("calcValueType", calcValueType);
		model.addAttribute("transferCostMap", transferCostMap);
	};
	
	public void TS_9100_getStatus_Job() {
		try {
			List list = TOMapper.checkCert(new HashMap()); 
			LOGGER.debug("###########################################################################");
			LOGGER.debug("###########################################################################");
			LOGGER.debug("###########################################################################");
			LOGGER.debug("###########################################################################");
			LOGGER.debug("############################[인증확인]#################################");
			LOGGER.debug("############################"+list.size()+"건 ##############################");
			LOGGER.debug("###########################################################################");
			LOGGER.debug("###########################################################################");
			LOGGER.debug("###########################################################################");
			LOGGER.debug("###########################################################################");
			LOGGER.debug("###########################################################################");
			for(int i=0; i < list.size(); i++) {
				Map row = (Map)list.get(i);
				String idx = row.get("idx").toString();
				String tx_id_Seller = (String)row.get("tx_id_Seller");
				String tx_id_Buyer = (String)row.get("tx_id_Buyer");			
				String State_Seller =row.get("State_Seller").toString();
				String State_Buyer = row.get("State_Buyer").toString();
				
				if(State_Seller.equals("2")) {
					row.put("tx_id", tx_id_Seller);
					String result = TOUtil.getKakaoCertStatus(row).toString();
					LOGGER.debug("###########################################################################");
					LOGGER.debug("############################"+row+"######################################");
					LOGGER.debug("############################[인증결과]#################################");
					LOGGER.debug("############################"+result+"##############################");
					LOGGER.debug("###########################################################################");
					LOGGER.debug("###########################################################################");
					LOGGER.debug("###########################################################################");
					// 인증요청 후 넘어온 결과값 parsing
					Gson gson = new Gson();
					Map<String,Object> parseMap = new HashMap<String,Object>();  
					parseMap = (Map<String,Object>) gson.fromJson(result, Map.class);
					String status = "";
					Map<String,Object> temp1 = (Map<String,Object>) parseMap.get("data");
					if(temp1 != null) {
						List<Map<String,Object>> temp2 = (List<Map<String,Object>>) temp1.get("signed_data");
						parseMap = (Map<String,Object>) temp2.get(0);
						status = (String) parseMap.get("status");
						if("COMPLETE".equalsIgnoreCase(status)){
							Map paramMap = new HashMap();
							paramMap.put("tx_id", tx_id_Seller);
							paramMap.put("CertificationId", tx_id_Seller);
							paramMap.put("inqType", "1");
							paramMap.put("idx", idx);
							paramMap.put("sellerVerifyYn", "N");
							if(State_Buyer.equals("2")) {
								paramMap.put("buyerVerifyYn", "N");
							}else {
								paramMap.put("buyerVerifyYn", "Y");
							}
							certVerify(paramMap);
						}
					}
				}
				if(State_Buyer.equals("2")) {
					row.put("tx_id", tx_id_Buyer);
					String result = TOUtil.getKakaoCertStatus(row).toString();
					Gson gson = new Gson();
					Map<String,Object> parseMap = new HashMap<String,Object>();  
					parseMap = (Map<String,Object>) gson.fromJson(result, Map.class);
					String status = "";
					Map<String,Object> temp1 = (Map<String,Object>) parseMap.get("data");
					if(temp1 != null) {
						List<Map<String,Object>> temp2 = (List<Map<String,Object>>) temp1.get("signed_data");
						parseMap = (Map<String,Object>) temp2.get(0);
						status = (String) parseMap.get("status");
						if("COMPLETE".equalsIgnoreCase(status)){
							Map paramMap = new HashMap();
							paramMap.put("tx_id", tx_id_Buyer);
							paramMap.put("CertificationId", tx_id_Buyer);
							paramMap.put("inqType", "2");
							paramMap.put("idx", idx);
							paramMap.put("buyerVerifyYn", "N");
							if(State_Seller.equals("2")) {
								paramMap.put("sellerVerifyYn", "N");
							}else {
								paramMap.put("sellerVerifyYn", "Y");
							}
							certVerify(paramMap);
						}
					}
				}
			}
			
		}catch(Exception e) {
			e.printStackTrace();
		}

		
		
	};
	
	public void certVerify(Map<String, Object> paramMap) {
		int cnt = 0; 
		String inqType = (String) paramMap.get("inqType");					// 1: 양도인, 2: 양수인
		String oriSellerVerifyYn = (String) paramMap.get("sellerVerifyYn");	// 양도인 인증 검증여부 (Y/N) -- 서버에서 보내준 값 그대로 보내야함. 초기값은  N, 검증 성공 시 Y
		String oriBuyerVerifyYn = (String) paramMap.get("buyerVerifyYn");	// 양수인 인증 검증여부 (Y/N) -- 서버에서 보내준 값 그대로 보내야함. 초기값은  N, 검증 성공 시 Y
		String Stage = "";
		
		if(StringUtils.isEmpty(oriSellerVerifyYn)) {
			oriSellerVerifyYn = "N";
		}
		if(StringUtils.isEmpty(oriBuyerVerifyYn)) {
			oriBuyerVerifyYn = "N";
		}
		
		Map row = TOMapper.checkSellerBuyer(paramMap);
		String State_Seller = row.get("State_Seller").toString();
		String State_Buyer = row.get("State_Buyer").toString();
		if("1".equals(inqType)) {// 양도인
			State_Seller = "1";
		} else {// 양수인
			State_Buyer = "1";
		}
		
		
		if("1".equals(State_Seller) && "1".equals(State_Buyer)) {
			Stage = "10";	//고객미결제 , 비용미확정
		}else if("1".equals(State_Seller) && !"1".equals(State_Buyer)) {
			Stage = "2";
		}else if(!"1".equals(State_Seller) && "1".equals(State_Buyer)) {
			Stage = "3";
		}else if(!"1".equals(State_Seller) && !"1".equals(State_Buyer)) {
			Stage = "1";
		}else if("4".equals(State_Seller) || "4".equals(State_Buyer)) {
			Stage = "5";//인증오류
		}

		paramMap.put("Stage", Stage);
		LOGGER.debug(":::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::"+row);
		LOGGER.debug("inqType "+inqType+"========================================================sendKakaoCertVerify:::"+Stage);
		LOGGER.debug("inqType "+inqType+"========================================================sendKakaoCertVerify:::"+Stage);

		String CertificationState = "1"; // 카카오페이인증상태(1:인증,2:미인증,3:인증대기중,4:오류,5:기타)
		String CertificationData = ""; 	// 전자서명값 ===> 검증 후 넘어온 전자서명값 set

			// 인증요청 후 넘어온 key set
			
			paramMap.put("CertificationData", CertificationData);
			
			
			// 소유권이전(TO_TRANSFEROWNER) 상태값 update
			TOMapper.updateToTransferOwnerStage(paramMap);
			paramMap.put("updateType", "2");
 
			
			if("1".equals(inqType)) {	// 양도인
				paramMap.put("CertificationState", State_Seller);
				// 소유권이전 판매자정보(TO_TRANSFEROWNER_SELLER) 전자서명정보 updaet
				TOMapper.updateToTransferOwnerSeller(paramMap);
			} else {					// 양수인
				paramMap.put("CertificationState", State_Buyer);
				paramMap.put("CertificationState", CertificationState);
				// 소유권이전 구매자정보(TO_TRANSFEROWNER_BUYER) 전자서명정보 updaet
				TOMapper.updateToTransferOwnerBuyer(paramMap);
			}
			LOGGER.debug(Stage+"========================================================TOMapper.updateToTransferOwnerBuyer:"+paramMap);
			// 양도/양수인 검증여부 set
			if("2".equals(Stage)) {	// 양수인 미인증
				paramMap.put("sellerVerifyYn", "Y");
				paramMap.put("buyerVerifyYn", "N");
			}
			else if("3".equals(Stage)) {	// 양도인 미인증
				paramMap.put("sellerVerifyYn", "N");
				paramMap.put("buyerVerifyYn", "Y");
			}
			else if("6".equals(Stage) || "10".equals(Stage)) {	// 이전신청대기중 , 고객미결제:비용미확정
				paramMap.put("sellerVerifyYn", "Y");
				paramMap.put("buyerVerifyYn", "Y");
			}
	}
	
	/**
	 * 개인간 소유권 이전 목록 C/U/D 처리
	 */
	@Transactional(propagation = Propagation.REQUIRED, rollbackFor={Exception.class})
	public void modifyTfrnChnlList(Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			List list = (List)paramMap.get("paramList");
			//String TransferOwnerIdx = (String)paramMap.get("TransferOwnerIdx");
			//String SESS_USERID = (String)paramMap.get("SESS_USERID");
			//String SESS_USERNM = (String)paramMap.get("SESS_USERNM");
					
					
			//Detail처리==========================================================================================================================================
			//삭제대상을 먼저삭제해야 insert시 문제가 없다.
//			for(int i=0;i < list.size() ;i++) {
//				Map row = (Map)list.get(i);
//				if("D".equalsIgnoreCase(U.getStatus(row)) ) {
//					row.put("TransferOwnerIdx", TransferOwnerIdx);
//					row.put("SESS_USERID", SESS_USERID);
//					row.put("SESS_USERNM", SESS_USERNM);
//		    		model.addAttribute("cnt", TOMapper.deleteMemo(row));
//		    	}
//			}
			for(int i=0;i < list.size() ;i++) {
				Map row = (Map)list.get(i);
		    	if("C".equalsIgnoreCase(U.getStatus(row)) ) {
		    		model.addAttribute("cnt", TOMapper.insertTrfnChnl(row));
		    	}else if("U".equalsIgnoreCase(U.getStatus(row)) ) {
		    		model.addAttribute("cnt", TOMapper.updateTrfnChnl(row));
		    	}else if("D".equalsIgnoreCase(U.getStatus(row)) ) {
		    		model.addAttribute("cnt", TOMapper.deleteTrfnChnl(row));
		    	}
		
			}
		} catch(Exception e) {
			e.printStackTrace();
			LOGGER.error(e.toString());
		}
	};

	/**
	  * <pre>
	  * 자동차 제조사 가격 조회 
	  * 차대번호로 웹스크래핑을 통해 제조사 가격을 조회한 후 조회 결과를 제조사 가격 테이블에 입력한다.
	  * </pre>
	  * <pre>
	  * <b>Parameters:</b>
	  * 	 ▶ String vhidNo : 차대번호
	  * 
	  * </pre>
	  * <pre>
	  * <b>Returns:</b>
	  * 	Map resMap : 제조사 가격정보
	  * </pre>
	  * @author Badboy
	  */
	public Map inqPrcFromMfco(String vhidNo) throws Exception {
		LOGGER.debug(" inqPrcFromMfco start...");
		LOGGER.debug(" vhidNo : {}", vhidNo);
		
		Map resMap = new HashMap();
		int nRtn = 0;
		String srchResult = "";		// 조회 결과
		
		// 입력 차대번호 검증
		if(EgovStringUtil.isEmpty(vhidNo)) {
			LOGGER.error("inqPriceFromMfco Error : 입력된 차대번호가 없습니다.");
			return null;
		}
	
		// 차대번호로 제조사 확인 : 현대/기아만 해당, 다른 제조사 이면 리턴
		// 차대번호 앞 1~2자리 : KM - 현대, KN - 기아
		if( !vhidNo.startsWith("KM") && !vhidNo.startsWith("KN")) {
			LOGGER.info("inqPriceFromMfco Info : 현대/기아차 만 제조사 가격조회 가능");
			return null;
		}

		// 제조사 가격 테이블에서 우선 조회
		Map tMap = new HashMap();
		tMap.put("vhidNo", vhidNo);

		Map rMap = TOMapper.selectVhclMfcoPrcMgntBase(tMap);
		// 제조사 가격 테이블 존재 시 그 값을 리턴
		if(rMap != null) 
			return rMap;
		
		// 테이블에 없는 경우 차대번호로 제조사 가격 조회 요청
		String osName = System.getProperty("os.name");
		Process process = null;
		BufferedReader br = null;
		StringBuffer sb = new StringBuffer();
		String pyName = "";
		
		if(vhidNo.startsWith("KM"))
			pyName = "vhclPrice_H.py";		// 현대차
		else
			pyName = "vhclPrice_K.py";		// 기아차
		
		try {
			String [] cmd = null;
			
			String strEncoding = "utf-8";
			
			if(osName.toLowerCase().startsWith("window")) {
				cmd = new String [] {"cmd.exe", "/y", "/c", "python C:/Users/carbang-dev3/Desktop/Pythonworkspace/"+ pyName + " " + vhidNo };
				strEncoding = "euc-kr";
			}
			else {
				cmd = new String [] {"/bin/sh", "-c", "python3 /home/ubuntu/scrapping/" + pyName + " " + vhidNo };
			}
			
			// 콘솔 명령 실행
			process = Runtime.getRuntime().exec(cmd);
			
			// 실행결과 확인
			br = new BufferedReader(new InputStreamReader(process.getInputStream(), strEncoding));
			
			String sResult = "";
			while((sResult = br.readLine()) != null) {
				sb.append(sResult).append("\n");
				LOGGER.debug(">>> " + sResult);
			}
			
		} catch(IOException ioe) {
			LOGGER.error(ioe.getMessage());
		} catch(Exception e) {
			e.printStackTrace();
		}

		
		srchResult = sb.toString();
		
		// 조회 결과 오류 검증
		if(EgovStringUtil.isEmpty(srchResult) || EgovStringUtil.indexOf(srchResult, "raise_for_status") >= 0) {
			LOGGER.error("제조사 차량가격 조회 중 오류 발생("+vhidNo+") : " + srchResult );
			return null;
		}
		
		// 조회결과 파싱 및 DB입력
		Gson gsonObj = new Gson();
		JsonObject rsltObj = gsonObj.fromJson(srchResult, JsonObject.class);
		//Map<String, Object> rMap = gsonObj.fromJson(srchResult, HashMap.class); // 가격이 정상적으로 변환되지 않음.
		
		JsonObject dataObj = null;
		JsonArray arrOptions = null;	// 현대차만 옵션 정보 존재
		
		LOGGER.debug("srchResult = " + rsltObj.toString());
		//LOGGER.debug("srchResult = " + rMap.toString());
		
		//현대차 조회 결과 파싱
		if(vhidNo.startsWith("KM")) {
			//Map dataMap = (Map)rMap.get("data");
			if(!"0000".equals(rsltObj.get("resultCode").getAsString())) {
				LOGGER.info(" message : " + rsltObj.get("message").getAsString());
				return null;
			}
			
			dataObj = rsltObj.getAsJsonObject("data");
			LOGGER.debug("dataObj = " + dataObj);
			
			if("".equals(dataObj.toString())) {
				LOGGER.info(" 조회결과가 없습니다.");
				return null;
			}
			
			resMap.put("vhidNo", 	vhidNo);							// 차대번호
			resMap.put("sclssNm", 	dataObj.get("sclasNm").getAsString());				// 소분류명
			resMap.put("basePrc", 	dataObj.get("trimPrice").getAsBigDecimal());		// 기본가격
			resMap.put("salePrc", 	dataObj.get("salePrice").getAsBigDecimal());		// 차량가격(기본+옵션)
			resMap.put("mdlNm", 	dataObj.get("modelNm").getAsString());				// 모델명
			
			arrOptions = dataObj.getAsJsonArray("options");
			
			LOGGER.debug("dataObj = " + dataObj);
			LOGGER.debug("arrOptions = " + arrOptions);
		}
		//기아차 조회 결과 파싱
		else {
		// 결과 string : {"selectCarSpec":{"krSpcNm":"K3 1.6 가솔린 4DR 트렌디스타일 A/T","fSaleAmt":"19,730,000"},"saleAmt":"19,800,000"}
		//			    {"selectCarSpec":null,"saleAmt":null}
			if(rsltObj.get("saleAmt") == null) {
				LOGGER.info(" 조회결과가 없습니다.");
				return null;
			}
			
			dataObj = rsltObj.getAsJsonObject("selectCarSpec");
			
			resMap.put("vhidNo", 	vhidNo);														// 차대번호
			resMap.put("sclssNm", 	"");															// 소분류명
			resMap.put("basePrc", 	dataObj.get("fSaleAmt").getAsString().replaceAll(",", ""));		// 기본가격
			resMap.put("salePrc", 	rsltObj.get("saleAmt").getAsString().replaceAll(",", ""));		// 차량가격
			resMap.put("mdlNm", 	dataObj.get("krSpcNm").getAsString());							// 모델명
		}
		
		
		LOGGER.debug("dataMap="+resMap);
		
		// 차량 제조사 가격 관리 기본 테이블 인서트
		TOMapper.insertMfcoPrcMgntBase(resMap);
		
		// options 파싱 및 테이블 입력: 현대차만 해당
		if(arrOptions != null) {
			for(int i=0;i<arrOptions.size();i++) {
				JsonObject optObj = (JsonObject) arrOptions.get(i);
				Map<String, Object>optMap = new HashMap<String, Object>();
				
				optMap.put("vhidNo", 	vhidNo);
				optMap.put("optCdNm", 	optObj.get("optNm").getAsString());
				optMap.put("optCd", 	optObj.get("OPTCD").getAsString());
				optMap.put("optPrc", 	optObj.get("optionPrice").getAsBigDecimal());
				
				//optionList.add(optMap);
				// 차량 제조사 옵션가격 내역 테이블 인서트
				LOGGER.debug("optMap = " + optMap);
				TOMapper.insertMfcoOptPrcPtcl(optMap);
				
			}
		}
		
		return resMap; 
	}
	
	@Transactional(propagation = Propagation.REQUIRED, rollbackFor={Exception.class})
	public String TO_018_procUnfyPayVou(Map<String, Object> mocaMap, ModelMap model) throws Exception {
		
		Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
		
		String orgFileNm		= (String)paramMap.get("orgFileNm"); 
		String physicalFileNm	= (String)paramMap.get("physicalFileNm");
		String physicalFilePath	= (String)paramMap.get("physicalFilePath");
		String subDir			= (String)paramMap.get("subDir");
		String uploadDir		= (String)paramMap.get("uploadDir");
		String payDt			= (String)paramMap.get("payDt");
		
		payDt = payDt.replace("-", "");
		LOGGER.debug("payDt = " + payDt);
		
		// 1.압축 해제 처리==========================================================================================================================================
		// 1-1 압축해제 폴더 생성 => 각 zip 파일별로 별도 폴더 생성
		String deCompressDir = uploadDir + File.separator + subDir + File.separator + "unZip" + File.separator + physicalFileNm;
		LOGGER.debug("deCompressDir : " + deCompressDir);
		EgovFileTool.createDirectories(deCompressDir);
		
		// 1-2 압축 해제
		boolean isOk = EgovFileCmprs.decmprsFile(physicalFilePath, deCompressDir);
		LOGGER.debug("deCompress : " + isOk);

		// 2. 압축해제된 jpg 파일 OCR 인식 후 소유권 이전 건에 매핑
		File zipDir = new File(deCompressDir);
		File[] fileArray = zipDir.listFiles();
		
		try {
			String pyName = "callKakaoVisionAPI.py";
			String strEncoding = "utf-8";
			String osName = System.getProperty("os.name");
			Process process = null;
			BufferedReader br = null;

			// 매핑대상 소유권 신청 목록 조회
			Map<String, Object> tMap = new HashMap<String, Object>();
			tMap.put("payDt", payDt);
			List<Map<String, Object>> potList = TOMapper.selectUnfyPayVouMappingList(tMap);

			// OCR인식 호출
			//for(int i=0;i<fileArray.length; i++) {
			for(int i=0;i<fileArray.length; i++) {
				String imgPath = fileArray[i].getAbsolutePath();				
				LOGGER.debug("imgPath = " + imgPath);
				
				String [] cmd = null;
				
				// 콘솔 명령 실행
				if(osName.toLowerCase().startsWith("window")) {
					cmd = new String [] {"cmd.exe", "/y", "/c", "python C:/Users/carbang-dev3/Desktop/Pythonworkspace/"+ pyName + " " 
							+ Globals.KAKAO_VISION_API_KEY + " " + imgPath };
					strEncoding = "euc-kr";
				}
				else {
					cmd = new String [] {"/bin/sh", "-c", "python3 /home/ubuntu/scrapping/" + pyName + " " + Globals.KAKAO_VISION_API_KEY + " " + imgPath };
				}

				process = Runtime.getRuntime().exec(cmd);
				
				// 실행결과 확인
				br = new BufferedReader(new InputStreamReader(process.getInputStream(), strEncoding));
				
				String sResult = "";
				StringBuffer sb = new StringBuffer();
				while((sResult = br.readLine()) != null) {
					sb.append(sResult).append("\n");
					LOGGER.debug(">>> " + sResult);
				}
				
				String ocrResult = sb.toString();
				// 매핑
				unfyPayVouMapping(ocrResult, imgPath, orgFileNm, payDt, potList);
			}
		}
		catch(IOException ioe) {
			LOGGER.error(ioe.getMessage());
		}
		catch(Exception e ) {
			e.printStackTrace();
		}
		
		return "";
	}
	
	public int unfyPayVouMapping(String ocrResult, String imgPath, String orgFileNm, String payDt, List<Map<String, Object>> potList) {
		
		int nRtn = 0;
		String unfyPayVouMngNO = "";
		
		// 조회 결과 오류 검증
		if(EgovStringUtil.isEmpty(ocrResult) || 
				EgovStringUtil.indexOf(ocrResult, "raise_for_status") >= 0 || EgovStringUtil.indexOf(ocrResult, "raise_for_status") >= 0 ) {
			LOGGER.error("Ocr 처리 실패("+imgPath+") : " + ocrResult );
		}
		else {
			for(int i=0;i<potList.size();i++) {
				Map potMap = potList.get(i);
				
				String idx			= (String)potMap.get("idx").toString();
				String elecPayNo 	= EgovStringUtil.isNullToString((String)potMap.get("elecPayNo"));		// 전자납부번호
				String vhclNo 		= EgovStringUtil.isNullToString((String)potMap.get("vhclNo"));			// 차량번호
				String vhidNo 		= EgovStringUtil.isNullToString((String)potMap.get("vhidNo"));			// 차대번호
				String payrNm		= EgovStringUtil.isNullToString((String)potMap.get("payrNm"));			// 납부자명
				
				LOGGER.debug("elecPayNo = " + elecPayNo);
				LOGGER.debug("vhclNo = " + vhclNo);
				LOGGER.debug("vhIdNo = " + vhidNo);
				LOGGER.debug("payrNm = " + payrNm);
				LOGGER.debug("orgFileNm = " + orgFileNm);
				
				// 전자납부번호->차량번호->차대번호 순으로 ocr결과 문자열에서 조회
				if(ocrResult.indexOf(elecPayNo) > 0 || ocrResult.indexOf(vhclNo) > 0 || ocrResult.indexOf(vhidNo) > 0 ) {
					LOGGER.debug("Matched : >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
					Map<String, Object> uMap = new HashMap<String, Object>();
					
					uMap.put("idx", idx);
					uMap.put("payrNm", payrNm);
					uMap.put("vhclNo", vhclNo);
					uMap.put("payDt", payDt);
					uMap.put("elecPayNo", elecPayNo);
					uMap.put("payVouFileNm", orgFileNm);
					
					// 통합납부영수증 관리 테이블 인서트
					TOMapper.insertToUnfyPayVouMgntBase(uMap);
					unfyPayVouMngNO = uMap.get("unfyPayVouMngNo").toString();
					
					LOGGER.debug("unfyPayVouMngNO=" + unfyPayVouMngNO);
					
					// 소유권이전 테이블의 통합납부영수증 관리번호 업데이트
					TOMapper.updateUnfyPayVouMngNo(uMap);
					
					// potList에서 매핑 건 삭제
					potList.remove(i);
					
					return 1;
				}
					
			}
		}
		
		return nRtn;
	}
	
	/*
	 * [스케쥴러용] 스케줄러 오늘일정 있을경우 sms알림서비스
	 * @see com.carbang365.TOServiceInterface#todayScheduleAlarmSms(java.util.Map, org.springframework.ui.ModelMap)
	 */
	public void batchTodayScheduleAlarmSms() throws Exception {
		// TO_DO
		
		//selectTodaySchedule
		List scheduleList = TOMapper.selectTodaySchedule(new HashMap());
		try {
	    	if(scheduleList != null && scheduleList.size() > 0){
	    		for(int i=0;i < scheduleList.size() ;i++) {
	    			Map sendMap = (Map)scheduleList.get(i);
	    			System.out.println(sendMap);
	    			System.out.println(sendMap.get("MBTLNUM").toString().replace("-", ""));
			    	String _cont = sendMap.get("SCH_TITLE").toString();
			    	if(_cont.length() > 20) {
			    		_cont = _cont.substring(0,20)+"...";
			    	};
			    	String sendPhoneNum;
			    	if("superadmin".equals(sendMap.get("SCH_WRITER"))) {
			    		sendPhoneNum = "01091168072,01090789322";
			    	}else {
			    		sendPhoneNum = sendMap.get("MBTLNUM").toString().replace("-", "");
			    	}
			    	String _resultCode = API.sendSms(
			    			"[당일] "+
			    					sendMap.get("SCH_START").toString().substring(0, 16)+" "+
	    				_cont+" 일정",
	    				sendPhoneNum,
	    				sendMap.get("SCH_WRITER").toString()
			    	);
			    	
			    	System.out.println(_resultCode);
			    	JSONParser parser = new JSONParser();
			    	Object obj = parser.parse( _resultCode );
			    	JSONObject jsonObj = (JSONObject) obj;

			    	String code = jsonObj.get("result_code").toString();
			    	String name = (String) jsonObj.get("message");
			    	System.out.println("code:"+code);
			    	System.out.println("name:"+name);
			    	
			    	if(code.equals("1")){
			    		Map<String, Object> uMap = new HashMap<String, Object>();
						uMap.put("SCH_IDX", sendMap.get("SCH_IDX"));
				    	TOMapper.updateScheduleSendSmsYn(uMap);
			    	}
	    		}
	    	}
		}catch(Exception e) {
			e.printStackTrace();
		}
	};
	
	/*
	 * [스케쥴러용] 스케줄러 내일일정 있을경우 sms알림서비스
	 * @see com.carbang365.TOServiceInterface#tomorrowScheduleAlarmSms(java.util.Map, org.springframework.ui.ModelMap)
	 */
	public void batchTomorrowScheduleAlarmSms() throws Exception {
		// TO_DO
		
		//selectTomorrowSchedule
		List scheduleList = TOMapper.selectTomorrowSchedule(new HashMap());
		try {
	    	if(scheduleList != null && scheduleList.size() > 0){
	    		for(int i=0;i < scheduleList.size() ;i++) {
	    			Map sendMap = (Map)scheduleList.get(i);
	    			System.out.println(sendMap);
	    			System.out.println(sendMap.get("MBTLNUM").toString().replace("-", ""));
			    	String _cont = sendMap.get("SCH_TITLE").toString();
			    	if(_cont.length() > 20) {
			    		_cont = _cont.substring(0,20)+"...";
			    	};
			    	String sendPhoneNum;
			    	if("superadmin".equals(sendMap.get("SCH_WRITER"))) {
			    		sendPhoneNum = "01091168072,01090789322";
			    	}else {
			    		sendPhoneNum = sendMap.get("MBTLNUM").toString().replace("-", "");
			    	}
			    	System.out.println("sendPhoneNum_"+sendPhoneNum);
			    	String _resultCode = API.sendSms(
			    			"[1일전]\n"+
			    					sendMap.get("SCH_START").toString().substring(0, 16)+" "+
	    				_cont+" 일정",
	    				sendPhoneNum,
	    				sendMap.get("SCH_WRITER").toString()
			    	);
			    	
			    	System.out.println(_resultCode);
			    	JSONParser parser = new JSONParser();
			    	Object obj = parser.parse( _resultCode );
			    	JSONObject jsonObj = (JSONObject) obj;

			    	String code = jsonObj.get("result_code").toString();
			    	String name = (String) jsonObj.get("message");
			    	System.out.println("code:"+code);
			    	System.out.println("name:"+name);
			    	
	    		}
	    	}
		}catch(Exception e) {
			e.printStackTrace();
		}
	};
	/*
	 * [스케쥴러용] 스케줄러 일정알림 조회(3일전 미리조회)
	 * @see com.carbang365.TOServiceInterface#tomorrowScheduleAlarmSms(java.util.Map, org.springframework.ui.ModelMap)
	 */
	public void batchThreeDaysScheduleAlarmSms() throws Exception {
		// TO_DO
		
		//selectThreeDaysSchedule
		List scheduleList = TOMapper.selectThreeDaysSchedule(new HashMap());
		try {
	    	if(scheduleList != null && scheduleList.size() > 0){
	    		for(int i=0;i < scheduleList.size() ;i++) {
	    			Map sendMap = (Map)scheduleList.get(i);
	    			System.out.println(sendMap);
	    			System.out.println(sendMap.get("MBTLNUM").toString().replace("-", ""));
			    	String _cont = sendMap.get("SCH_TITLE").toString();
			    	if(_cont.length() > 20) {
			    		_cont = _cont.substring(0,20)+"...";
			    	};
			    	//System.out.println(_cont);
			    	String sendPhoneNum;
			    	if("superadmin".equals(sendMap.get("SCH_WRITER"))) {
			    		sendPhoneNum = "01091168072,01090789322";
			    	}else {
			    		sendPhoneNum = sendMap.get("MBTLNUM").toString().replace("-", "");
			    	}
			    	String _resultCode = API.sendSms(
			    			"[3일전]\n"+
			    					sendMap.get("SCH_START").toString().substring(0, 16)+" "+
	    				_cont+" 일정",
	    				sendPhoneNum,
	    				sendMap.get("SCH_WRITER").toString()
			    	);
			    	
			    	System.out.println(_resultCode);
			    	JSONParser parser = new JSONParser();
			    	Object obj = parser.parse( _resultCode );
			    	JSONObject jsonObj = (JSONObject) obj;

			    	String code = jsonObj.get("result_code").toString();
			    	String name = (String) jsonObj.get("message");
			    	System.out.println("code:"+code);
			    	System.out.println("name:"+name);
			    	
	    		}
	    	}
		}catch(Exception e) {
			e.printStackTrace();
		}
	};
	/*
	 * [스케쥴러용] 스케줄러 일정알림 조회(7일전 미리조회)
	 * @see com.carbang365.TOServiceInterface#tomorrowScheduleAlarmSms(java.util.Map, org.springframework.ui.ModelMap)
	 */
	public void batchAWeekScheduleAlarmSms() throws Exception {
		// TO_DO
		
		//selectTomorrowSchedule
		List scheduleList = TOMapper.selectAWeekSchedule(new HashMap());
		try {
	    	if(scheduleList != null && scheduleList.size() > 0){
	    		for(int i=0;i < scheduleList.size() ;i++) {
	    			Map sendMap = (Map)scheduleList.get(i);
	    			System.out.println(sendMap);
	    			System.out.println(sendMap.get("MBTLNUM").toString().replace("-", ""));
			    	String _cont = sendMap.get("SCH_TITLE").toString();
			    	if(_cont.length() > 20) {
			    		_cont = _cont.substring(0,20)+"...";
			    	};
			    	//System.out.println(_cont);
			    	String sendPhoneNum;
			    	if("superadmin".equals(sendMap.get("SCH_WRITER"))) {
			    		sendPhoneNum = "01091168072,01090789322";
			    	}else {
			    		sendPhoneNum = sendMap.get("MBTLNUM").toString().replace("-", "");
			    	}
			    	String _resultCode = API.sendSms(
			    			"[7일전]\n"+
			    					sendMap.get("SCH_START").toString().substring(0, 16)+" "+
	    				_cont+" 일정",
	    				sendPhoneNum,
	    				sendMap.get("SCH_WRITER").toString()
			    	);
			    	
			    	System.out.println(_resultCode);
			    	JSONParser parser = new JSONParser();
			    	Object obj = parser.parse( _resultCode );
			    	JSONObject jsonObj = (JSONObject) obj;

			    	String code = jsonObj.get("result_code").toString();
			    	String name = (String) jsonObj.get("message");
			    	System.out.println("code:"+code);
			    	System.out.println("name:"+name);
			    	
	    		}
	    	}
		}catch(Exception e) {
			e.printStackTrace();
		}
	};
	/*
	 * [스케쥴러용] 주식 아침9시알람
	 * @see com.carbang365.TOServiceInterface#tomorrowScheduleAlarmSms(java.util.Map, org.springframework.ui.ModelMap)
	 */
	public void batchStockAlarmSms() throws Exception {
		//batchStockAlarmSms
		try {
	    	String _resultCode = API.sendSms(
	    			"안녕하세요!"+ "오전 9시 주식 개장시간입니다",
				"01090789322,01091168072",
				"superadmin"
	    	);
	    	System.out.println(_resultCode);
		}catch(Exception e) {
			e.printStackTrace();
		}
	};
}