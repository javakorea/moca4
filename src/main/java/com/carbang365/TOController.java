package com.carbang365;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.collections.MapUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.View;

import com.google.gson.Gson;
import com.ibm.icu.text.SimpleDateFormat;

import egovframework.com.cmm.service.EgovProperties;
import egovframework.com.cmm.service.Globals;
import egovframework.let.uss.umt.service.EgovUserManageService;
import egovframework.let.uss.umt.service.UserManageVO;
import egovframework.let.utl.sim.service.EgovFileScrty;
import mocaframework.com.cmm.API;
import mocaframework.com.cmm.U;
import mocaframework.com.cmm.Util;
import mocaframework.com.cmm.service.MocaEFLService;

@Controller
public class TOController{
	private static final Logger LOGGER = LoggerFactory.getLogger(TOController.class);
	boolean testMode = true;
	@Autowired
	TOMapper TOMapper;

	@Autowired
    private View jsonview;
	
	@Autowired
	TOServiceImpl toService;
	
	/** cmmUseService */
	@Resource(name = "mocaEFLService")
	private MocaEFLService mocaEFLService;

	/** userManageService */
	@Resource(name = "userManageService")
	private EgovUserManageService userManageService;
	
//	공통사항
//		1. 화면 링크는 기존 구성과 동일하게 *.html로 링크(이미 각 html 링크는 적용되어 있음. 빠진/추가된 부분만 추후 추가하면 될듯)
//		2. 화면 로드 시 필요 데이터는 ajax를 호출하여 json 형식으로 return, 모카 프레임웤을 이용하여 화면 draw(TO_001.html, EFC_USER.html 참조)
//		3. html에 다른 function은 호출부 명시되어 있으며 'Util.화면명.___ready' 이 형식으로 되어있는건 명시하지 않아도 로드 시점에 호출되는지만 확인.
//		4. 내용이 길어질 경우 패키지 분리 예정
	
	
	/************************************************ 운영관리 시작 ************************************************/
//	1. 운영관리 조회(TO_001)
//		- 탭별 코드 
//		(상태컬럼에 따른 필터적용된 항목 ==> 메인분석 시 상태 코드값은 아래 항목과 서로 맞춰야함. @RequestMapping하나로, 상태코드 항목만 dynamic하게 받을거임)
//			전체 : 0
//			인증진행중 : 1
//			이전신청 대기중 : 2  
//			고객정보오류 : 3
//			고객미결제 : 4
//			결제준비중(KSNET미요청(공단)) : 5
//			공단입금 : 6
//			이전등록상태 : 7
//			이전신청완료 : 8 (전문결과 수신 후 상태값 업데이트)
//			환급 : 9
//			결제오류 : 10
//			취소 : 11

	@RequestMapping(value = "/TO_001/admMngList.do")
	public View selectAdmMngListJson(
			@RequestParam Map<String, Object> mocaMap,
			ModelMap model) throws Exception {
		try {
			
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);

			List<Map<String, Object>> admMngList = TOMapper.selectAdmMngList(paramMap);
			
			// 상태에 따른 운영관리 목록 컬럼 set
			for(Map<String, Object> admMap : admMngList) {

				int Stage = 0;
				if(admMap.get("Stage") == null) {
					Stage = 0;
				}else {
					Stage = Integer.parseInt(admMap.get("Stage").toString());
				}
				
				Map<String, String> stageColMap = this.getAdmColForStage(Stage);
				
				admMap.put("certStage", stageColMap.get("certStage"));
				admMap.put("customerPayStage", stageColMap.get("customerPayStage"));
				admMap.put("compPayStage", stageColMap.get("compPayStage"));
				admMap.put("transferStage", stageColMap.get("transferStage"));
				admMap.put("rePayStage", stageColMap.get("rePayStage"));
			}
			
			//model.addAttribute("admMngCntList", TOMapper.selectAdmMngListCnt());
			model.addAttribute("admMngList", admMngList);
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
//	2. 운영관리상세팝업(양도인/양수인정보/차량정보)(TO_000P01)
//		- 운영관리 row데이터 선택 시 상세팝업 데이터
	@RequestMapping(value = "/TO_000P01/admMngDetail.do")
	public View selectAdmMngDetailJson(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 운영관리 상세조회
			Map <String, Object> detailMap = TOMapper.selectToTransferOwner(paramMap);
			
			String sellerSocialNumber_Second = (String)detailMap.get("sellerSocialNumber_Second");
			TOUtil.decrypt(detailMap, "sellerSocialNumber_Second", null);
			String buyerSocialNumber_Second = (String)detailMap.get("buyerSocialNumber_Second");
			TOUtil.decrypt(detailMap, "buyerSocialNumber_Second", null);
			
			
			paramMap.put("REQST_SE_CODE", "9001");
			List list = TOMapper.selectToTransferownerTsHis(paramMap);
			model.addAttribute("list9001", list);
			
				
			
			// 이전비 계산 전 시점이라 차량 시가적용금액이 없다면 직접조회
			BigDecimal lastVehicleBasisPrice = new BigDecimal(detailMap.get("lastVehicleBasisPrice").toString());
			BigDecimal UsedCarRemainingPrice = null;
			
//			IF(A.PurchasePrice > E.lastVehicleBasisPrice, A.PurchasePrice, E.lastVehicleBasisPrice) AS applyPrice
			
			
			/*
			 1.이전비계산전
			 	PurchasePrice 매매금액 : 고객이 직접 화면에서 입력한 금액(부가세 제외금액)
			 	lastVehicleBasisPrice 시가적용금액 : 시가표준액에서 경감률 적용한 금액
			 	applyPrice 과세표준액 : 부가세 제외금액과 경감률 적용한 금액을 비교해서 더 큰 금액
			 2.이전비계산후
				PurchasePrice 매매금액 : 고객이 직접 화면에서 입력한 금액(부가세 제외금액)
				lastVehicleBasisPrice 시가적용금액 :  시가표준액에서 경감률 적용한 금액
				applyPrice 과세표준액 : 부가세 제외금액과 경감률 적용한 금액을 비교해서 더 큰 금액
			*/
			//1.이전비계산전
			if(lastVehicleBasisPrice.compareTo(BigDecimal.ZERO) == 0) {
				// 입력 매매금액
				BigDecimal PurchasePrice = new BigDecimal(detailMap.get("PurchasePrice").toString());
				
				// 차량 상세조회
				Map<String, Object> param2 = new HashMap<String, Object>();
				param2.put("idx", detailMap.get("vehicleRegistrationIdx"));
				Map<String, Object> carInfoDetail = TOMapper.selectCarInfoDetail(param2);
				
				if(carInfoDetail == null) {
					throw new Exception("차량 상세 정보가 없습니다");
				}
				
				String CountryOrigin 	= carInfoDetail.get("CountryOrigin").toString();		// 제조국
				if("수입".equals(CountryOrigin)) {
					CountryOrigin = "외산";
					carInfoDetail.put("CountryOrigin", CountryOrigin);
				}
				
				// 차량시세조회
				carInfoDetail.put("calcTransferCost", "Y");
				Map<String, Object> carPriceInfo = TOMapper.selectRemainingPrice(carInfoDetail);
				
				if(carPriceInfo != null) {
					// 채권계산을 위한 감가상각적용금액(추가율없이 기준 잔가율만 곱한 값)
					BigDecimal tmpVal1 = new BigDecimal(carPriceInfo.get("bondStndardPrice").toString());	// 채권계산을 위한 감가상각적용금액(추가율없이 기준 잔가율만 곱한 값)
					
					// 감가상각 적용금액 천원 미만 절사
					UsedCarRemainingPrice = new BigDecimal(tmpVal1.setScale(-3, BigDecimal.ROUND_DOWN).intValue());	
					detailMap.put("UsedCarRemainingPrice", UsedCarRemainingPrice);
				}
				
				BigDecimal bugase = new BigDecimal("1.1");
				BigDecimal PurchasePrice_bugase = PurchasePrice.divide(bugase,BigDecimal.ROUND_DOWN);

				detailMap.put("VehicleBasisPrice",PurchasePrice_bugase);
				
				
				detailMap.put("lastVehicleBasisPrice", UsedCarRemainingPrice);
				
				BigDecimal applyPrice = null;
				
				if(PurchasePrice_bugase.compareTo(UsedCarRemainingPrice) > 0) {
					lastVehicleBasisPrice = PurchasePrice_bugase;
				} else {
					lastVehicleBasisPrice = UsedCarRemainingPrice;
				}
				detailMap.put("lastVehicleBasisPrice", lastVehicleBasisPrice);
			}
			
			
			// 오류 시 오류내용 set
			String ErrCode = (String) detailMap.get("ErrCode");
			String ErrTxt = "";
			
			// !!!!!!!!!!!!!!!!!!!! to_do. 임시. TS 이전전문 발송 후 정상 코드값이 뭔지 현재 알 수 없으므로 if 주석처리. 추후 정상코드값 나오면 그 값으로 if 주석해제
//			if(!"00000000".equals(ErrCode)) {
				
				if(!StringUtils.isEmpty(ErrCode)) {
					List<Map <String, Object>> cdDetailList = TOMapper.selectToCodeList(detailMap);
					
					if(cdDetailList.size() == 0) {
						ErrTxt = "관리되지 않는 코드 값입니다";
					} else {
						Map <String, Object> cdDetailMap = cdDetailList.get(0);
						ErrTxt = (String) cdDetailMap.get("ErrTxt");
					}
				}
//			} else {
//				ErrTxt = "-";
//			}
			detailMap.put("ErrTxt", ErrTxt);
			
			// 이전 예상 완료일 조회
			String transferComDate = TOMapper.selectCompletDt(paramMap);
			detailMap.put("transferComDate", transferComDate);
			
			
			// 운영관리 상세 메모 조회
			List<Map <String, Object>> memoList = TOMapper.selectMemoList(paramMap);
			detailMap.put("memoList", memoList);
			
			model.addAttribute("admMngDetail", detailMap);
			
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
	// 고객 추가금액 업데이트
	@RequestMapping(value = "/TO_000P01/updateToTransferownerCost.do")
	public View updateToTransferownerCost(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			int cnt = TOMapper.updateToTransferownerCost(paramMap);
			model.addAttribute("cnt", paramMap);		
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	} 
	// 양수인,양도인 정보 업데이트
	@RequestMapping(value = "/TO_000P01/updateSellerBuyerInfo.do")
	public View updateSellerBuyerInfo(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			int cnt = TOMapper.update_TO_TRANSFEROWNER_BUYER(paramMap);
			int cnt2 = TOMapper.update_TO_TRANSFEROWNER_SELLER(paramMap);
			model.addAttribute("cnt", cnt);		
			model.addAttribute("cnt2", cnt2);
			model.addAttribute("message", "성공적으로 저장되었습니다.");
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	} 

	
//	4. 영수증 조회(운영관리상세팝업 영수증 클릭)
	@RequestMapping(value = "/TO_000P10/receiptInfo.do")
	public View selectReceiptInfoJson(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			
			// 화면에서 보내야 하는 값
//			String idx = (String) paramMap.get("idx");	// 소유권이전 idx
			
			// 영수증 조회
			Map<String, Object> receiptMap = TOMapper.selectReceiptInfo(paramMap);
			
			int addPrice = 0;		// 추가금
			int returnPrice = 0;	// 반환금
			int total_TransferOwner_Price = Integer.parseInt(receiptMap.get("total_TransferOwner_Price").toString()); 	// 총이전비용
			int Pay_Amount = Integer.parseInt(receiptMap.get("Pay_Amount").toString()); 	// 고객수취금액
			
			// 이전비용이 고객입금비용보다 크면
			if(total_TransferOwner_Price > Pay_Amount) {
				addPrice = total_TransferOwner_Price - Pay_Amount;
			} else if(total_TransferOwner_Price < Pay_Amount) {	// 이전비용이 고객입금비용보다 작으면
				returnPrice = Pay_Amount - total_TransferOwner_Price;
			}
			
			receiptMap.put("addPrice", addPrice);
			receiptMap.put("returnPrice", returnPrice);
			
			model.addAttribute("receiptInfo", receiptMap);
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
	
//	5. 양도증명서 조회(운영관리상세팝업 양도증명서 클릭 ---> image로 return할수 있는지, 기존 양도증명서 관리 어케되고있는지 확인)
	@RequestMapping(value = "/TO_000P04/carCertificateInfo.do")
	public View selectcarCertificateInfoJson(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			// to_do 
			model.addAttribute("carCertificateInfo", TOMapper.selectcarCertificateInfo(paramMap));
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
//	6. 오류내용 조회(운영관리상세팝업 쿠콘조회 오류 시 오류내용 버튼 클릭 시 호출)
//	@RequestMapping(value = "/TO_000P02/vehicleErrTxt.do")
//	public View selectcarvehicleErrTxtJson(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
//		try {
//			
//			// 안할거임. 상세 조회 시 에러코드조회, 컨트롤러에서 에러내용 넘기고, 상세화면에서 오류내용 팝업 띄울때 텍스트 넘기는 방식으로 처리예정
//			
//			model.addAttribute("vehicleErrInfo", TOMapper.selectcarvehicleErrTxt(paramMap));
//			
//		}catch(Exception e) {
//			e.printStackTrace();
	
//		}
//        return jsonview;
//	}
	
	
//	7. TS전송(app에서 공단전문 호출 오류 시 관리자에서 전문 전송을 하기위한 버튼. 추가 논의 필요 우선 명확한 협의 후 구현예정)
	@RequestMapping(value = "/TO_000P01/sendTs.do")
	public View prodSendTs(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
        
		try {
        	Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
        	// 서비스 테스트용 구문 추가
        	if(MapUtils.isEmpty(paramMap)) {
        		paramMap = mocaMap;
        	}
			
        	/*************************************************************************************************
        	 * 																								*
        	 * 											TO_DO.												*
        	 * 											협의필요 (삭제될 수 있음)									*	
        	 * 																								*
        	 *************************************************************************************************/
		} catch (Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
		
		return jsonview;
	}
	
	
//	8. 메모목록 조회 (테이블 생성 필요)  
	@RequestMapping(value = "/TO_000P01/memoList.do")
	public View selectMemoListJson(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			model.addAttribute("memoList", TOMapper.selectMemoList(paramMap));
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
//	9. 메모 등록
	@RequestMapping(value = "/TO_000P01/insertMemo.do")
	public View insertMemo(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			toService.insertMemoJson(mocaMap, model);
			model.addAttribute("message", "성공적으로 저장하였습니다");
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
		return jsonview;
	}
//	10. 메모 삭제
//		- 메모내용 수정불가. 삭제 시 물리삭제/논리삭제 판단 필요
	@RequestMapping(value = "/TO_000P01/deleteMemo.do")
	public View deleteMemoJson(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			model.addAttribute("cnt", TOMapper.deleteMemo(paramMap));
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	/************************************************ 운영관리 끝 ************************************************/
			
		
	
	/************************************************ 차량분석오류 시작 ************************************************/
//	1. 차량분석 오류, 등록원부 조회(requestMapping은 하나, parma key로 체크)
//		- 차량분석오류 데이터 조회, 등록원부조회 RequestMapping은 하나로 조회. (inqType을 파라미터로 받아 구분 1:차량분석오류, 2:등록원부 조회)
//		- app에서 조회 시 default 조회날짜는 7일. 화면 로딩 시 달력도 초기값 7일로 세팅해야함. ===> 화면 로딩 시 데이터 조회할 때 stDt,edDt 넘겨줄예정
//		(최초 호출 시 stDT, edDt 없으면 현재일~7일후로 쿼리 parma 세팅)
//		- inqType 값을 dynamic 쿼리로 돌려 조회조건 추가
//		- 소팅은 등록일(RegisterTime) DESC
//		- 구분코드(inqType)
//			1 : 'app에서 Coocon 조회  중 오류 사항만' 조회
//				WHERE 1=1
//				AND regType = 1
//				AND passYn = 'N'
//				AND RegisterTime >= STR_TO_DATE(CONCAT(#{stDt},' 00:00:00'), '%Y%m%d %H:%i:%s')
//				AND RegisterTime <= STR_TO_DATE(CONCAT(#{edDt},' 23:59:59'), '%Y%m%d %H:%i:%s')
//			2 : app,관리자 관계없이 조회한 모든 차량등록원부
//				날짜조회, 페이징 여부 확인해야함. 조회 데이터가 많을것같은데..기본 필터값 없으면 조회 속도 느려질것같음
	@RequestMapping(value = "/TO_002/carAnalysis.do")
	public View selectCarAnalysisJson(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			
			// inqType은 쿼리에서 바로 사용~~ 날짜세팅은 서비스에서~~
			String inqType = (String) paramMap.get("inqType");
			if("1".equals(inqType)) {	// 차량분석 오류. 
				String stDt = (String) paramMap.get("stDt");
				// 최초조회 시 시작일/종료일 없다면 초기 조회값 7일로 세팅
				if(StringUtils.isEmpty(stDt)) {
					SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
					Calendar cal = Calendar.getInstance();
					stDt = sdf.format(cal.getTime());
					cal.add(Calendar.DAY_OF_MONTH, -7);
					String edDt = sdf.format(cal.getTime());
					paramMap.put("stDt", stDt);
					paramMap.put("edDt", edDt);
				}
			}
			List<Map<String, Object>> analList = TOMapper.selectCarAnalysis(paramMap);
			
			paramMap.put("from", paramMap.get("stDt"));
			paramMap.put("to", paramMap.get("stDt"));
			List<Map<String, Object>> todayList = TOMapper.selectCarAnalysis(paramMap);
			
			
			
			model.addAttribute("carAnalysisList", analList);
			model.addAttribute("todayList", todayList);
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	/************************************************ 차량분석오류 끝 ************************************************/
			
	
			
	/************************************************ 등록원부 시작 ************************************************/

	/************************************************ 등록원부 끝 ************************************************/

			
			
	/************************************************ QuickMenu 시작 ************************************************/
		
	// =========================== 회원관리 =========================== //
//		1. 회원목록 조회 (TO_USER 테이블 생성 필요.)
//			- 가입이력 있는데 탈퇴 후 재가입 시 기존회원으로 표시요청함. APP 가입 시 프로세스 정의 필요
	@RequestMapping(value = "/TO_003/userList.do")
	public View selectUserListJson(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			model.addAttribute("userList", TOMapper.selectToUsersList(paramMap));
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
//		2. 회원상세(팝업)
	@RequestMapping(value = "/TO_003/userDetail.do")
	public View selectUserDetailJson(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			model.addAttribute("userDetail", TOMapper.selectToUsersDetail(paramMap));
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
//		3. 회원탈퇴
//			- 탈퇴는 관리자에서만 진행하며 추후 APP에서도 탈퇴메뉴 생성될 수 있음
//			- 개인간 소유권이전에서는 이제와서 탈퇴 메뉴를 붙이기엔 설계 틀어지므로 우선 관리자에서만 탈퇴적용 협의(2020.11.12 이지선K,김유리K,성혜진D)
//			- 회원탈퇴 시 회원상태(1:정상,2:탈퇴), 탈퇴일(수정일), 탈퇴신청자(수정자) Update 처리. 해당 항목은 컬럼 추가 필요
//			- 탈퇴신청자 화면에서 보내야함 (LeaveReqId : 탈퇴신청자(관리자명), idx : 사용자 idx)
	@RequestMapping(value = "/TO_003/updateUserList.do")
	public View updateUserListJson(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			LOGGER.debug(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+paramMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			model.addAttribute("cnt", TOMapper.updateToUsersLeaveYn(paramMap));
			model.addAttribute("message", "성공적으로 처리되었습니다.");
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	// ============================================================= //
	
	
	// ========================= 지역별채권율 등록 ========================= //
//		1. 지역별 채권율 목록조회. servlet url dynamic받을거임 (1:승용차, 2:전기 수소차, 3: 승합차)
//			1-1. 각 승용/전기,수소/승합차별 채권율 리스트 조회 (화면 채권계산방법 그리드에 draw)
//			1-2. 각 승용/전기,수소/승합차별 채권 할인율 리스트 조회 (화면 채권면제 그리드에 draw)
//			1-3. 1-1의 목록과 1-2의 목록을 map에 담아 return.
	@RequestMapping(value = "/TO_004/rgonBondList.do")
	public View selectRgonBondListJson(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			
			List<Map<String, Object>> displacementList 	= new ArrayList<Map<String, Object>>();	// 배기량
			List<Map<String, Object>> sizeList 			= new ArrayList<Map<String, Object>>();	// 대중소형
			List<Map<String, Object>> seaterList 		= new ArrayList<Map<String, Object>>();	// 인승
			List<Map<String, Object>> multipurposeList 	= new ArrayList<Map<String, Object>>();	// 다목적
			List<Map<String, Object>> upperSevenList	= new ArrayList<Map<String, Object>>();	// 7인이상
			List<Map<String, Object>> hybridList 		= new ArrayList<Map<String, Object>>(); // 하이브리드
			List<Map<String, Object>> sizeListByElec 	= new ArrayList<Map<String, Object>>(); // 전기수소 대중소형
			
			int[] arrItemCd = { 1,2,3,9,10,12 };	// (1: 배기량, 2: 대중소형, 3: 인승, 9: 다목적, 10: 7인이상, 12: 하이브리드)
			String[] arrListNm = {"displacementList", "sizeList", "seaterList", "multipurposeList", "upperSevenList", "hybridList"};
			
			List<Object> objList = new ArrayList<Object>();
			objList.add(displacementList);
			objList.add(sizeList);
			objList.add(seaterList);
			objList.add(multipurposeList);
			objList.add(upperSevenList);
			objList.add(hybridList);
			
			// 차종/지역별 구분 
			List<Map<String, Object>> basisValList = TOMapper.selectToRawdataBondBasisvaluetype();
			
			// 대분류/중분류 어느쪽을 선택해도 소분류 6개 항목을 다 내림 (전기수소 제외. 전기수소는 sizeListByElec 한 항목만 내림)
			// inqType1 : 대분류 (1: 승용, 2: 전기수소, 3: 승합, 4: 화물)
			// inqType2 : 중분류 (1: 채권율, 2: 할인율)
			// inqType3 : 소분류 (1: 배기량, 2: 대중소형, 3: 인승, 9: 다목적, 10: 7인이상, 12: 하이브리드)
			
			String inqType1 = (String) paramMap.get("inqType1");
			String inqType2 = (String) paramMap.get("inqType2");
			
			if("2".equals(inqType1)){	// 전기수소
				if("1".equals(inqType2)) {	// 채권율 조회
					sizeListByElec = TOMapper.selectRgonBondListByElec(paramMap);
					model.addAttribute("sizeListByElec", sizeListByElec);
				} else {					// 할인율
					sizeListByElec = TOMapper.selectRgonBondDiscountListByElec(paramMap);
					model.addAttribute("sizeListByElec", sizeListByElec);
				}
				
			} else {
				/*
				for(int i = 0; i < arrItemCd.length; i++) {

					paramMap.put("itemCd", arrItemCd[i]);
					String targetListNm = arrListNm[i];
					if("1".equals(inqType1) && "1".equals(inqType2) && (arrItemCd[i]==3 || arrItemCd[i]==12)){
						model.addAttribute(targetListNm, new ArrayList());
						continue;
					}else if("3".equals(inqType1) && "1".equals(inqType2) && (arrItemCd[i]==2 || arrItemCd[i]==9 || arrItemCd[i]==10 || arrItemCd[i]==12)){
						model.addAttribute(targetListNm, new ArrayList());
						continue;
					}
					
					List<Map<String, Object>> targetList = (List<Map<String, Object>>) objList.get(i);
					
					if("1".equals(inqType2)) {		// 채권율 조회
						targetList = TOMapper.selectRgonBondList(paramMap);
						
					} else {						// 채권할인율 조회
						targetList = TOMapper.selectRgonBondDiscountList(paramMap);
					}
					model.addAttribute(targetListNm, targetList);
				}
				*/
				if("1".equals(inqType2)) {		// 채권율 조회
					model.addAttribute("allList", TOMapper.selectRgonBondList(paramMap));
					
				} else {						// 채권할인율 조회
					model.addAttribute("allList", TOMapper.selectRgonBondDiscountList(paramMap));
				}
				
				
				
			}
			
			model.addAttribute("basisValList", basisValList);
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
//		2. 지역별 채권율 등록. servlet url dynamic받을거임 (1:승용차, 2:전기 수소차, 3: 승합차)
//			- 변경된 항목만 따로 보내는게 아니라 입력값 통으로 보내고 (채권율, 할인율 각 따로)
//			- dynamic하게 받은 구분코드 따라서 해당 항목 조건의 데이터 delete 후 update 처리.
//				* 구분에 맞는 채권율 delete -> update
//				* 구분에 맞는 채권할인율 delete -> update
//			- 단, as-is와 관리자의 자동차 세율 및 적용율 > 중고차 지역별 채권 적용 및 조회 메뉴와 동일하게  채권율/할인율 각 영영별로 저장이 따로 있으면 동일하게 항목 세분화 저장처리예정
	@RequestMapping(value = "/TO_004/inserRgonBondList.do")
	@Transactional(propagation = Propagation.REQUIRED, rollbackFor={Exception.class})
	public View inserRgonBondListJson(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			
			int cnt = 0;
			
			
			/**
			 *	1. 변경 시 차종, 지역, 구분코드 목록을 보내야 한다. (basisValList) << 이전계산시 참조되는 테이블이므로 항목을 잘 맞춰야함.
			 *	구분코드 (1 : 배기량, 2 : 대중소형, 3 : 인승, 4 : 1000cc/0.6톤, 5: 1000cc/1톤, 6: 전체cc/0.6톤, 7: 전체cc/1톤, 8: 1000cc)
			 *	
			 *	2. 변경 시 대분류/중분류 구분을 보내야 한다.
			 *	inqType1 : 대분류 (1: 승용, 2: 전기수소, 3: 승합, 4: 화물)
			 * 	inqType2 : 중분류 (1: 채권율, 2: 할인율)
			 *	
			 *	3. 각 차종/지역별 하나의 항목 선택 시 다른 항목은 비활성화 되며 기존 데이터를 날린다.
			 *		ex) 서울, 승합에서 배기량 선택 시 대중소형, 인승 입력불가 등.
			 *	4. 단, 승용차 다목적, 7인이상의 경우 선택한 값과 관계없이 따로 관리된다.
			 *		ex) 서울, 승용에서 대중소형 선택 시 배기량 항목은 입력불가, 다목적/7인이상은 입력가능
			 *	5. 단, 전기수소(승용/승합/화물) 역시 선택한 값과 관계없이 따로 관리된다.
			 *	항목코드는 지역별 채권율/할인율 itemCd와 같음
			 */
			
			String inqType1 = (String) paramMap.get("inqType1");
			String inqType2 = (String) paramMap.get("inqType2");
			
			List<Map<String, Object>> basisValList 		= (List<Map<String, Object>>) paramMap.get("basisValList");			// 차종/지역별 구분
			List<Map<String, Object>> displacementList 	= (List<Map<String, Object>>) paramMap.get("displacementList");		// 배기량
			List<Map<String, Object>> sizeList 			= (List<Map<String, Object>>) paramMap.get("sizeList");				// 대중소형
			List<Map<String, Object>> seaterList 		= (List<Map<String, Object>>) paramMap.get("seaterList");			// 인승
			List<Map<String, Object>> multipurposeList 	= (List<Map<String, Object>>) paramMap.get("multipurposeList");		// 다목적
			List<Map<String, Object>> upperSevenList	= (List<Map<String, Object>>) paramMap.get("upperSevenList");		// 7인이상
			List<Map<String, Object>> hybridList 		= (List<Map<String, Object>>) paramMap.get("hybridList");		 	// 하이브리드
			List<Map<String, Object>> sizeListByElec 	= (List<Map<String, Object>>) paramMap.get("sizeListByElec"); 		// 전기수소 대중소형
			
			List<Object> objList = new ArrayList<Object>();
			objList.add(displacementList);
			objList.add(sizeList);
			objList.add(seaterList);
			objList.add(multipurposeList);
			objList.add(upperSevenList);
			objList.add(hybridList);
			
			String[] arrListNm = {"displacementList", "sizeList", "seaterList", "multipurposeList", "upperSevenList", "hybridList"};
			
			if("2".equals(inqType1)) {	// 전기수소
				if("1".equals(inqType2)) {	// 채권율
					cnt += TOMapper.updateRgonBondListByElec(paramMap);
				} else {					// 할인율
					cnt += TOMapper.updateRgonBondDiscountListByElec(paramMap);
				}
			} else {
				// 1. 차종/지역별 구분 항목 업데이트
				cnt += TOMapper.updateToRawdataBondBasisvaluetype(paramMap);
				
				for(int i = 0; i < objList.size(); i++) {
					List<Map<String, Object>> targetList = (List<Map<String, Object>>) objList.get(i);
					
					// foreach 업데이트 시 max count를 넘어서므로 리스트별로 따로 업데이트 처리
					if(targetList.size() > 0) {
						paramMap.put("targetList", targetList);
						
						if("1".equals(inqType2)) {	// 채권율
							cnt += TOMapper.updateRgonBondList(paramMap);
						} else {					// 할인율
							cnt += TOMapper.updateRgonBondDiscountList(paramMap);
						}
					}
				}
			}

			model.addAttribute("cnt", cnt);
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	// ============================================================= //
	
	
	// ========================= 차량 감가율 관리 ========================= //
//		1. 차량감가율 조회 (차량감가율, 차량시세 추가적용율, 차량 시세 적용율, 중간가/상한가 비율)
	@RequestMapping(value = "/TO_005/vehicleRateList.do")
	public View selectVehicleRateListJson(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			Map<String, Object> rtnMap = new HashMap<String, Object>();
			
			List<Map<String, Object>> oriRateList = TOMapper.selectOriRateListList(paramMap);	// 차량 감가적용율 목록
			List<Map<String, Object>> addRateList = TOMapper.selectAddRateList(paramMap);		// 차량 시세 추가적용율 목록
			List<Map<String, Object>> totalRateList = TOMapper.selectTotalRateList(paramMap);	// 차량시세적용율(감가율+추가적용율)
			Map<String, Object> addRatioPercentInfo = TOMapper.selectGetAddRatio(paramMap);		// 차량시세 중간가/상한가 추가 비율
			
			rtnMap.put("oriRateList", oriRateList);
			rtnMap.put("addRateList", addRateList);
			rtnMap.put("totalRateList", totalRateList);
			rtnMap.put("addRatioPercentInfo", addRatioPercentInfo);
			
			model.addAttribute("vehicleRateList", rtnMap);
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
//		2. 차량감가적용율/차량시세 추가적용율 수정
//		2-1. 기존 데이터 삭제 후 변경 데이터 insert 처리. 
//			 - 변경 데이터만 체크하지 않으므로 화면에서 감가율 또는 추가적용율 목록을 통으로 넘겨줘야함.
//			 - 차량 중간/상한가 콤보의 value는 기획서상에 정해진 숫자 값이며(운영관리21p, 숫자 외 다른문자 제외) 변경 시 중간가, 상한가 둘 다 한번에 보내야함
//			 - 차량감가적용율 list명 		: vehicleRateList
//			 - 차량시세추가적용율 list명 	: vehicleRateExtraList
//			 - 차량중간가격 변수명 			: MdlRate
//			 - 차량상한가 변수명 			: UpRate
	@RequestMapping(value = "/TO_005/updateVehicleRate.do")
	public View updateVehicleRate(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			int cnt = toService.TO_005_updateVehicleRate(mocaMap, model);
			model.addAttribute("cnt", cnt);
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	};
	// ============================================================= //
	
	
	// ======================== 취득세율 및 감면금액 ======================== //
//	1. 취득세율 및 감면금액 조회
	@RequestMapping(value = "/TO_006/acquistionPriceList.do")
	public View selectAcquistionPriceListJson(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {

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
			
			// to_do
//			연도는 화면에서 항상 당해/내년 두개의 콤보를 뿌려야함
//			해가 바뀌었을때 초기 데이터가 없으면 최초 조회 시 데이터 insert 처리를 해줘야 하는지.. 우선 나중에.
			

			List<Map<String, Object>> acquistionPriceList = TOMapper.selectAcquistionPrice(paramMap);
			
			// 취득세율 백분율 변환
			for(Map<String, Object> acquistionPrice : acquistionPriceList) {
				TOUtil.getPercentValue(acquistionPrice,"Acquisition_taxRate");
			}
			
			model.addAttribute("acquistionPriceList", acquistionPriceList);
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
		return jsonview;
	}


	
//	2. 취득세율 및 감면금액 수정
	@RequestMapping(value = "/TO_006/updateAcquistionPrice.do")
	public View updateAcquistionPrice(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			toService.TO_006_updateAcquistionPrice(mocaMap, model);
			model.addAttribute("message", "성공적으로 저장하였습니다");
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
		return jsonview;
	}
	
	// ============================================================= //

	
	// ======================== 전자수입인지 수동구매 ======================== //
	/*************************************************************************************************
	 * 																								*
	 * 											TO_DO												*
	 * 																								*
	 *************************************************************************************************/
	// ============================================================= //
	
	
// ======================== 시가표준액 등록 조회 ======================== //
//		1. 시가표준액 조회(0:전체, 1:승용, 2:승합, 3:화물, 4:기타)	<<< 화물 쓸건지??
//			- TO_RAWDATA_VEHICLE_SPECIFICATION_TS, TO_RAWDATA_TAXBASE_BASISPRICE
//			제원관리번호(SpecMgmtNumber)로 ts조회 후 형식명(FormName) 컬럼을 key로 시가표준액 테이블 join
//			- 엑셀 다운로드는 mocaframework에서 제공하는 엑셀 다운로드 처리. 엑셀조회를 위한 목록은 해당 requestMapping에서 처리
	@RequestMapping(value = "/TO_007/stndCarPriceList.do")
	public View selectStndCarPriceListJson(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			String inqType = (String)paramMap.get("inqType");
			//if(!inqType.equals("0")) {
				model.addAttribute("stndCarPriceList", TOMapper.selectStndCarPriceList(paramMap));
			//}
			model.addAttribute("stndCarPriceCntList", TOMapper.selectStndCarPriceListCnt());
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
//	시가표준액 저장 삭제. 데이터 많아 프로그램으로 업로드 시 죽거나 중간에 튕겼을 때 찾기 힘듦. 자주 변하는 데이터가 아니므로 
//	DB클라이언트 프로그램으로 직접 업로드 처리 협의 (2020.11.30 김훈T)
//		2. 시가표준액 저장
//			- 업로드된 엑셀 파일을 읽어들여 저장처리.(업로드/업데이트는 구분자 하나 받아서 분기처리)
//				* 업로드(기존데이터유지) : 추가건 업로드를 의미하는지 확인. 기존데이터 가만 냅두고 엑셀에 등록된 데이터 추가가 맞는지? 차명/형식 중복기입하여 업로드 시 중복발생가능함. 확인하기
//				* 업데이트(기존데이터삭제) : 기존데이터 다 날리고 업로드된 엑셀만 저장처리를 원하는게 맞는지 확인하기.
	@RequestMapping(value = "/TO_007/updateStndCarPriceList.do")
	public View updateStndCarPriceListJson(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			String saveType = (String)paramMap.get("saveType");
			LOGGER.debug("saveType:"+saveType);
			List list = (List)paramMap.get("excelList");
			LOGGER.debug("list.size():"+list.size());
			model.addAttribute("cnt", TOMapper.updateStndCarPriceList(paramMap));
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	// ============================================================= //
	
	
	// ========================== 채권단가 조회 ========================== //
//		1. 채권단가조회
//			- 날짜(영업일여부 포함) 선택가능하던데 어떤 의도인지 묻기. 꼭 필요하다면 default 며칠? 그리고 최대 며칠?(당일로부터 앞 며칠~ 뒤 며칠 등)
//			- 엑셀다운로드 마찬가지로 프레임워크 엑셀다운로드 사용. 엑셀다운용 목록 데이터는 조회 서블릿과 동일하게 사용
	@RequestMapping(value = "/TO_008/bondPriceInfo.do")
	public View selectBondPriceInfoJson(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			Map<String, Object> bondPriceMap = new HashMap<String, Object>();
			List<Map<String, Object>> bondPriceList = TOMapper.selectBondPriceInfo(paramMap);
			List<Map<String, Object>> bondAddPriceList = TOMapper.selectBondAddPriceInfo(paramMap);
			bondPriceMap.put("bondPriceList", bondPriceList);
			bondPriceMap.put("bondAddPriceList", bondAddPriceList);
			
			model.addAttribute("bondPriceInfo", bondPriceMap);
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
//		2. 일별채권단가수기적용 / 추가적용금액 수정	::: 당일 날짜만 변경이 가능함(화면에서 유효성 처리 추가)
	@RequestMapping(value = "/TO_008/updateBondPrice.do")
	public View updateBondPrice(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			int cnt = -1;
			String Today = (String) paramMap.get("Today");
			Today = Today.replaceAll("-", "");
			// 예외처리1. 날짜선택 유효성 체크 (추후 bizException 처리예정)
			if(StringUtils.isEmpty(Today)) {
				throw new Exception("날짜는 필수입니다");
				
			} else {

				SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
				Calendar cal = Calendar.getInstance();
				String now = sdf.format(cal.getTime());
				
				if(Today.equals(now)) {
					String inqType = (String) paramMap.get("inqType");
					
					// 1. 일별채권단가 수기수정
					if("1".equals(inqType)) {
						cnt = TOMapper.updateBondPrice(paramMap);
					} 
					// 2. 추가적용금액 수정
					else {
						cnt = TOMapper.updateAddBondPrice(paramMap);
					}
					
				} else { // 예외처리2. 당일 날짜것만 수정가능
					throw new Exception("->"+Today+"당일날짜의 금액만 수정가능합니다"+now);
				}
			}
			model.addAttribute("cnt", cnt);
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
	// ============================================================= //
	
	
	// ========================= TS차량 DB관리 ========================= //
//		1. TS차량 DB관리 조회/상세(0:전체, 1:승용, 2:승합, 3:화물, 4:기타, 5:친환경면제차량)	<<< 화물 쓸건지??
//			- 시가표준액과 거의 동일함
//			- dynamic url
//			- TO_RAWDATA_VEHICLE_SPECIFICATION_TS, TO_RAWDATA_TAXBASE_BASISPRICE
//			제원관리번호(SpecMgmtNumber)로 ts조회 후 형식명(FormName) 컬럼을 key로 시가표준액 테이블 join
//			- 엑셀 다운로드는 mocaframework에서 제공하는 엑셀 다운로드 처리. 엑셀조회를 위한 목록은 해당 requestMapping에서 처리
	@RequestMapping(value = "/TO_009/tsCarDbMngList.do")
	public View selectTsCarDbMngListJson(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			
			// 상세조회 시 SpecMgmtNumber(제원관리번호) 화면 param
			String SpecMgmtNumber = (String) paramMap.get("SpecMgmtNumber");
			if(!StringUtils.isEmpty(SpecMgmtNumber)) {
				model.addAttribute("tsCarDbMngDetail", TOMapper.selectTsCarDbMngDetail(paramMap));
			} else {
				model.addAttribute("tsCarDbMngList", TOMapper.selectTsCarDbMngList(paramMap));
				//model.addAttribute("tsCarDbMngCntList", TOMapper.selectTsCarDbMngListCnt());
			}
			
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
	
	
	
	@RequestMapping(value = "/TO_101/tsCarDbMngList.do")
	public View selectTsCarDbMngListJson_101(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			
			// 상세조회 시 SpecMgmtNumber(제원관리번호) 화면 param
			String SpecMgmtNumber = (String) paramMap.get("SpecMgmtNumber");
			if(!StringUtils.isEmpty(SpecMgmtNumber)) {
				model.addAttribute("tsCarDbMngDetail", TOMapper.selectTsCarDbMngDetail(paramMap));
			} else {
				model.addAttribute("tsCarDbMngList", TOMapper.selectTsCarDbMngList(paramMap));
				//model.addAttribute("tsCarDbMngCntList", TOMapper.selectTsCarDbMngListCnt());
			}
			
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
	
	
	@RequestMapping(value = "/TO_009/selectTsCarDbMngListCnt.do")
	public View selectTsCarDbMngListCnt(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 상세조회 시 SpecMgmtNumber(제원관리번호) 화면 param
			model.addAttribute("tsCarDbMngCntList", TOMapper.selectTsCarDbMngListCnt());
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
	
	@RequestMapping(value = "/TO_101/selectTsCarDbMngListCnt.do")
	public View selectTsCarDbMngListCnt_101(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 상세조회 시 SpecMgmtNumber(제원관리번호) 화면 param
			model.addAttribute("tsCarDbMngCntList", TOMapper.selectTsCarDbMngListCnt());
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
	
	
	// 2. TS차량 DB관리 친환경차 유무 업데이트
	@RequestMapping(value = "/TO_009/updateTsCarDbMng.do")
	public View updateTsCarDbMngJson(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 상세조회 시 SpecMgmtNumber(제원관리번호) 화면 param
			model.addAttribute("tsCarDbMngList", TOMapper.updateTsCarDbMng(paramMap));
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
		return jsonview;
	}
	
	//	TS차량 DB관리 저장 삭제. 데이터 많아 프로그램으로 업로드 시 죽거나 중간에 튕겼을 때 찾기 힘듦. 자주 변하는 데이터가 아니므로 
//	DB클라이언트 프로그램으로 직접 업로드 처리 협의 (2020.11.30 김훈T)
//		3. TS차량 DB관리 저장
//			- 업로드된 엑셀 파일을 읽어들여 저장처리.(업로드/업데이트는 구분자 하나 받아서 분기처리)
//				* 업로드(기존데이터유지) : 추가건 업로드를 의미하는지 확인. 기존데이터 가만 냅두고 엑셀에 등록된 데이터 추가가 맞는지? 차명/형식 중복기입하여 업로드 시 중복발생가능함. 확인하기
//				* 업데이트(기존데이터삭제) : 기존데이터 다 날리고 업로드된 엑셀만 저장처리를 원하는게 맞는지 확인하기.
//	@RequestMapping(value = "/TO_009/{inqType}/updateTsCarDbMngList.do")
//	public View updateTsCarDbMngList(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
//		try {
//			model.addAttribute("cnt", TOMapper.updateTsCarDbMngList(paramMap));
//			
//		}catch(Exception e) {
//			e.printStackTrace();
//		}
//        return jsonview;
//	}
	// ============================================================= //
	
	
	// ========================== 비용관리 설정 ========================== //
//	1. 비용관리 조회
	@RequestMapping(value = "/TO_010/transferCostMngList.do")
	public View selectTransferCostMngListJson(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			
			List<Map<String, Object>> bankList = (List<Map<String, Object>>) TOMapper.selectBankList(paramMap);
			List<Map<String, Object>> costMngList = (List<Map<String, Object>>) TOMapper.selectToTransferCostMng();
			
			// 은행이율 백분율 변환
			for(Map<String, Object> costMng : costMngList) {
				BigDecimal Bank_IncomeRate = new BigDecimal((String) costMng.get("Bank_IncomeRate"));				// 은행이율
				BigDecimal Bank_IncomeTax = new BigDecimal((String) costMng.get("Bank_IncomeTax"));					// 소득세
				BigDecimal Bank_LocalTax = new BigDecimal((String) costMng.get("Bank_LocalTax"));					// 지방소득세
				BigDecimal Bank_AgencyFee = new BigDecimal((String) costMng.get("Bank_AgencyFee"));					// 증권/은행 대행수수료
				BigDecimal PurchaseBond_CarBang = new BigDecimal((String) costMng.get("PurchaseBond_CarBang"));		// 채권구매대행율
				
				Bank_IncomeRate = Bank_IncomeRate.multiply(new BigDecimal(100)).stripTrailingZeros();
				Bank_IncomeTax = Bank_IncomeTax.multiply(new BigDecimal(100)).stripTrailingZeros();
				Bank_LocalTax = Bank_LocalTax.multiply(new BigDecimal(100)).stripTrailingZeros();
				Bank_AgencyFee = Bank_AgencyFee.multiply(new BigDecimal(100)).stripTrailingZeros();
				PurchaseBond_CarBang = PurchaseBond_CarBang.multiply(new BigDecimal(100)).stripTrailingZeros();
			
				costMng.put("Bank_IncomeRate", Bank_IncomeRate.toPlainString() + "%");
				costMng.put("Bank_IncomeTax", Bank_IncomeTax.toPlainString() + "%");
				costMng.put("Bank_LocalTax", Bank_LocalTax.toPlainString() + "%");
				costMng.put("Bank_AgencyFee", Bank_AgencyFee.toPlainString() + "%");
				costMng.put("PurchaseBond_CarBang", PurchaseBond_CarBang.toPlainString() + "%");
			}
			
			model.addAttribute("costMngList", costMngList);
			model.addAttribute("bankList", bankList);
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
		return jsonview;
	}
	
//	2. 비용관리 수정
	@RequestMapping(value = "/TO_010/updateTransferCostMng.do")
	public View updateTransferCostMng(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			int cnt = toService.TO_010_updateTransferCostMng(mocaMap,model); 
			model.addAttribute("cnt", cnt);
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
		return jsonview;
	}
	
	// ============================================================= //
	
	
	// =========================== 매출관리 =========================== //
	@RequestMapping(value = "/TO_011/selectSalesInfo.do")
	public View selectSalesInfo(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			Map idxHash = new HashMap();
			List reList = new ArrayList();
			List list = TOMapper.selectSalesMngList(paramMap);
			for(int i=0; i < list.size(); i++) {
				Map row = (Map)list.get(i);
				Object obj = idxHash.get(row.get("TransferownerIdx"));
				if(obj == null) {
					String Carbang_RegistrationFee = "";
					if(row.get("Carbang_RegistrationFee") != null) {
						Carbang_RegistrationFee = row.get("Carbang_RegistrationFee").toString();
					}
					String agencyFee_Office_Registration = "";
					if(row.get("agencyFee_Office_Registration") != null) {
						agencyFee_Office_Registration = row.get("agencyFee_Office_Registration").toString();
					}
					BigDecimal Carbang_RegistrationFeeBig = new BigDecimal(Carbang_RegistrationFee);
					BigDecimal agencyFee_Office_RegistrationBig = new BigDecimal(agencyFee_Office_Registration);
					BigDecimal sumBig = Carbang_RegistrationFeeBig.add(agencyFee_Office_RegistrationBig);
					row.put("SalesProfit2", sumBig.toPlainString());//2021/03/27 이지선k-> 이익=이전등록대행료+관공서등록수수료
					reList.add(row);
					idxHash.put(row.get("TransferownerIdx"),"true");
				}
			}
			model.addAttribute("salesMngList", reList);
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
		return jsonview;
	}
	// ============================================================= //
	
	
	// =========================== 약관관리 =========================== //
//		1. 약관목록/상세 조회
	@RequestMapping(value = "/TO_012/termsInfo.do")
	public View selectTermsInfoJson(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			
			// 약관 대분류 항목 (개인정보처리방침/서비스제휴제공동의/카방이용약관/유료서비스이용약관) 항목은 관리하지 않으며
			// 각 약관 대분류 항목에 하위 약관 목록만 이력관리하기로 협의하였음
			
			// parm으로 termsId 값이 있으면 약관 상세, 없으면 약관 하위목록
			model.addAttribute("termsInfo", TOMapper.selectTermsInfo(paramMap));
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	};
	@RequestMapping(value = "/TO_012/gonggiInfo.do")
	public View selectGonggiInfoJson(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			
			// 약관 대분류 항목 (개인정보처리방침/서비스제휴제공동의/카방이용약관/유료서비스이용약관) 항목은 관리하지 않으며
			// 각 약관 대분류 항목에 하위 약관 목록만 이력관리하기로 협의하였음
			
			// parm으로 termsId 값이 있으면 약관 상세, 없으면 약관 하위목록
			model.addAttribute("gonggiInfo", TOMapper.selectGonggiInfo(paramMap));
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}	
//		3. 약관등록
	@RequestMapping(value = "/TO_012/isnertTerm.do")
	public View isnertTerm(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			String Selected = (String)paramMap.get("Selected");
			if(Selected.equals("Y")) {
				TOMapper.deleteTermsSelected(paramMap);
			}
			model.addAttribute("cnt", TOMapper.isnertTerm(paramMap));
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	@RequestMapping(value = "/TO_012/isnertGonggi.do")
	public View isnertGonggi(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			model.addAttribute("cnt", TOMapper.isnertGonggi(paramMap));
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
	
	
	
	@RequestMapping(value = "/TO_012/updateTerm.do")
	public View updateTerm(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			
			// TO_DO
			// 당일이 해당 약관의 적용일이면 기존약관 미적용/ 해당약관 적용 처리 하는부분 필요할듯.
			// 이건 수동약관 적용/미적용 처리를 위한거니까 그대로 두고... 위에건 스케줄러로 돌려야할지 협의 필요.
			
			// 해당 항목 약관 적용여부 일괄 미적용 처리
			String Selected = (String)paramMap.get("Selected");
			if("Y".equals(Selected)) {
				TOMapper.deleteTermsSelected(paramMap);
			}
			int cnt = TOMapper.updateTerms(paramMap);
			model.addAttribute("cnt", cnt);
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	@RequestMapping(value = "/TO_012/updateGonggi.do")
	public View updateGonggi(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			int cnt = TOMapper.updateGonggi(paramMap);
			model.addAttribute("cnt", cnt);
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}	
	// ============================================================= //
	
	
	// ========================== 금융기관DB ========================== //
//		1. 금융기관DB 목록/상세조회(엑셀다운 목록도 동일)
	@RequestMapping(value = "/TO_013/fincialDbList.do")
	public View selectFincialDbListJson(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			
			// 목록 : inqType :: 1
			// 상세 : inqType :: 2
			model.addAttribute("fincialDbList", TOMapper.selectFincialDbList(paramMap));
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
//		3. 금융기관DB 저장
//			- 업로드된 엑셀 파일을 읽어들여 저장처리.(업로드/업데이트는 구분자 하나 받아서 분기처리)
//				* 업로드(기존데이터유지) : 추가건 업로드를 의미하는지 확인. 기존데이터 가만 냅두고 엑셀에 등록된 데이터 추가가 맞는지? 차명/형식 중복기입하여 업로드 시 중복발생가능함. 확인하기
//				* 업데이트(기존데이터삭제) : 기존데이터 다 날리고 업로드된 엑셀만 저장처리를 원하는게 맞는지 확인하기.
	@RequestMapping(value = "/TO_013/updateFincialDbInfo.do")
	public View updateFincialDbInfo(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			String uploadType = (String) paramMap.get("uploadType");	// 1: (추가)업로드, 2: (기존데이터삭제)업데이트
			
			// 업데이트일 경우 기존 데이터 삭제 수행
			if("2".equals(uploadType)) {
				TOMapper.deleteFincialDbInfo(paramMap);
			}
			
			int cnt = TOMapper.insertFincialDbInfo(paramMap);
			model.addAttribute("cnt", cnt);
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
	@RequestMapping(value = "/TO_000P08/updateFincial.do")
	public View updateFincial(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			int cnt = TOMapper.updateFincial(paramMap);
			model.addAttribute("cnt", cnt);
			model.addAttribute("message", "성공적으로 저장하였습니다.");
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	// ============================================================= //
	
	
	// ========================== 의뢰시간 설정 ========================== //
//		1. 의뢰시간 조회(신규테이블 필요기존메뉴 없는듯?)
	@RequestMapping(value = "/TO_014/askDateInfo.do")
	public View selectAskDateInfoJson(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			model.addAttribute("askDateInfo", TOMapper.selectAskDateInfo());
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
//		2. 의뢰시간 저장(수정/저장 MAPPER만 따로 서블릿은 같이쓰지머)
	@RequestMapping(value = "/TO_014/updateAskDateInfo.do")
	public View updateAskDateInfo(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			List list = (List)paramMap.get("updateAskDateInfo");
			for(int i=0; i < list.size(); i++) {
				Map m = (Map)list.get(i);
				//LOGGER.debug("------------------------------> m"+m);	
				model.addAttribute("cnt"+i, TOMapper.updateAskDateInfo(m));
			}
			
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	// ============================================================= //
	
	
	// ===================== 소유권이전코드관리 ===================== //
//		1. 소유권이전코드관리 목록조회
	@RequestMapping(value = "/TO_015/toCodeList.do")
	public View selectToCodeListJson(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			model.addAttribute("toCodeList", TOMapper.selectToCodeList(paramMap));
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
//		2. 소유권이전코드별 이전가능여부 업데이트(List. DELETE -> INSERT 처리)
	@RequestMapping(value = "/TO_015/updateToCodeList.do")
	public View updateToCodeList(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			
			// 전체 코드 목록을 화면에서 줘야함 (코드리스트 전체 삭제 -> 넘겨받은 코드 전체 등록)
			// 코드 전체삭제
			TOMapper.deleteToCodeList();
			
			// 코드 전체 등록 (key : toCodeList)
			model.addAttribute("cnt", TOMapper.insertToCodeList(paramMap));
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}

	
	
	@RequestMapping(value = "/callFunc.do")
	public View callFunc(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			
			//model.addAttribute("cnt", TOMapper.callTOGetUsedCarRemainingPriceByKcar(paramMap));
			//paramMap.put("UsedCarRemainingPrice", "16300000");
			model.addAttribute("cnt", TOMapper.selectGetAddRatio(paramMap));
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
		return jsonview;
	}
	// ============================================================= //
	
	
	/************************************************ QuickMenu 끝 ************************************************/
	
	
	// 임시. 나중에 따로 뺄거임
	private String getErrTxt(String errCd) throws Exception {
		String errTxt= "";
		
		switch (errCd) {
		case "8000C505": errTxt ="입력하신 정보와 일치하는 차량이 없습니다. 확인 후 거래하시기 바랍니다."; break;
		case "8000C508": errTxt ="소유자 성명(명칭)이 일치하지 않습니다. 확인 후 거래하시기 바랍니다."; break;
		case "8000E200": errTxt ="해당 기관에서 응답이 없어 거래를 취소합니다(HTTP호출실패). 잠시 후 다시 거래하십시오."; break;
		case "8000E201": errTxt ="해당 기관에서 응답이 없어 거래를 취소합니다(HTTP호출실패). 잠시 후 다시 거래하십시오."; break;
		case "8000E202": errTxt ="해당 기관에서 응답이 없어 거래를 취소합니다(HTTP호출실패). 잠시 후 다시 거래하십시오."; break;
		case "8000E203": errTxt ="해당 기관에서 응답이 없어 거래를 취소합니다(HTTP호출실패). 잠시 후 다시 거래하십시오."; break;
		case "8000E204": errTxt ="해당 기관에서 응답이 없어 거래를 취소합니다(HTTP호출실패). 잠시 후 다시 거래하십시오."; break;
		case "8000F101": errTxt ="해당 기관에서 응답이 없어 거래를 취소합니다. 잠시 후 다시 거래 하시거나 해당 기관 홈페이지를 이용하십시오."; break;
		case "8000F102": errTxt ="해당 기관에서 응답이 없어 거래를 취소합니다. 잠시 후 다시 거래 하시거나 해당 기관 홈페이지를 이용하십시오."; break;
		case "80002F30": errTxt ="해당 기관의 점검 또는 서버 장애입니다. 잠시 후 다시 이용하십시오."; break;
		default: break;
		}
		return errTxt;
	}
	
	private Map<String, String> getAdmColForStage(int stage){
		Map<String, String> rtnMap = new HashMap<String, String>();
		
		String certStage = "";			// 인증유무
		String customerPayStage = "";	// 고객결제유무
		String compPayStage = "";		// 공단입금
		String transferStage = "";		// 이전등록
		String rePayStage = "";			// 환급
		
//		상태코드
//		1 : 양수, 양도 미인증 (그외항목 전부X)
//		2 : 양수인미인증(그외항목 전부X)
//		3 : 양도인미인증(그외항목 전부X)
//		4: 인증준비중(그외항목 전부X)
//		5 : 인증오류(그외항목 전부X)
//		6-9 : 양수,양도 인증완료(그외항목 전부X)
//		10,12 : 양수,양도 인증완료, 고객결제 미입금(그외항목 전부X)
//		11 : 양수,양도 인증완료, 고객결제 미입금(비용확정)(그외항목 전부X)
//		13 : 양수,양도 인증완료, 고객결제 입금, 공단입금 준비중(그외항목 전부X)
//		14 : 양수,양도 인증완료, 고객결제 입금, 공단입금 미입금(그외항목 전부X)
//		15 : 양수,양도 인증완료, 고객결제 입금, 공단입금 미입금(비용미확정)(그외항목 전부X)
//		16 : 양수,양도 인증완료, 고객결제 입금, 공단입금 입금, 이전등록 미완료(환급x)
//		17 : 양수,양도 인증완료, 고객결제 입금, 공단입금 입금, 이전등록 완료, 환급(취소)
//		18 : 양수,양도 인증완료, 고객결제 입금, 공단입금 입금, 이전등록 완료, 환급(완료)
//		19 : 양수,양도 인증완료, 고객결제 입금, 공단입금 입금, 이전등록 완료, 환급(없음)
//		20 : 양수,양도 인증완료, 고객결제 입금, 공단입금 입금, 이전등록 완료, 고객입금부족	
//		21 : 양수,양도 인증완료, 고객결제 입금, 공단입금 입금, 이전등록 완료, 카방계좌부족
//		22 : 양수,양도 인증완료, 고객결제 입금, 공단입금 입금, 이전등록 완료, 환급오류(에러코드)
//		23 : 양수,양도 인증완료, 고객결제 입금, 공단입금 입금, 이전등록 완료, 준비중
//		24 : 양수,양도 인증완료, 고객결제 오류(그외항목 전부X)
//		25 : 양수,양도 인증완료, 고객결제 입금, 공단입금 오류(그외항목 전부X)
//		26 : 양수,양도 인증완료, 나머지 다 취소
//		27 : 양수,양도 인증완료, 고객결제 입금, 공단입금 입금, 이전등록 완료, 환급 X
		
		switch (stage) {
		case 1:
			certStage = "양수, 양도 미인증";
			customerPayStage = "X";
			compPayStage = "X";
			transferStage = "X";
			rePayStage = "X";
			
			break;
		case 2:
			certStage = "양수인미인증";
			customerPayStage = "X";
			compPayStage = "X";
			transferStage = "X";
			rePayStage = "X";
			
			break;
		case 3:
			certStage = "양도인미인증";
			customerPayStage = "X";
			compPayStage = "X";
			transferStage = "X";
			rePayStage = "X";
			
			break;
		case 4:
			certStage = "인증준비중";
			customerPayStage = "X";
			compPayStage = "X";
			transferStage = "X";
			rePayStage = "X";
			
			break;
		case 5:
			certStage = "인증오류";
			customerPayStage = "X";
			compPayStage = "X";
			transferStage = "X";
			rePayStage = "X";
			
			break;
		case 6: case 7: case 8:
			certStage = "양수,양도 인증완료";
			customerPayStage = "X";
			compPayStage = "X";
			transferStage = "X";
			rePayStage = "X";
			
			break;
		case 9: 
			certStage = "인증오류";
			customerPayStage = "X";
			compPayStage = "X";
			transferStage = "X";
			rePayStage = "X";
			
			break;
		case 10: case 12:
			certStage = "양수,양도 인증완료";
			customerPayStage = "미입금";
			compPayStage = "X";
			transferStage = "X";
			rePayStage = "X";
			
			break;
		case 11:
			certStage = "양수,양도 인증완료";
			customerPayStage = "미입금(비용확정)";
			compPayStage = "X";
			transferStage = "X";
			rePayStage = "X";
			
			break;
		case 13:
			certStage = "양수,양도 인증완료";
			customerPayStage = "입금";
			compPayStage = "준비중";
			transferStage = "X";
			rePayStage = "X";
			
			break;
		case 14:
			certStage = "양수,양도 인증완료";
			customerPayStage = "입금";
			compPayStage = "미입금";
			transferStage = "X";
			rePayStage = "X";
			
			break;
		case 15:
			certStage = "양수,양도 인증완료";
			customerPayStage = "입금";
			compPayStage = "미입금(비용미확정)";
			transferStage = "X";
			rePayStage = "X";
			
			break;
		case 16:
			certStage = "양수,양도 인증완료";
			customerPayStage = "입금";
			compPayStage = "입금";
			transferStage = "미완료";
			rePayStage = "X";
			
			break;
		case 17:
			certStage = "양수,양도 인증완료";
			customerPayStage = "입금";
			compPayStage = "입금";
			transferStage = "완료";
			rePayStage = "환급(취소)";
			
			break;
		case 18:
			certStage = "양수,양도 인증완료";
			customerPayStage = "입금";
			compPayStage = "입금";
			transferStage = "완료";
			rePayStage = "환급(완료)";
			
			break;
		case 19:
			certStage = "양수,양도 인증완료";
			customerPayStage = "입금";
			compPayStage = "입금";
			transferStage = "완료";
			rePayStage = "환급(없음)";
			
			break;
		case 20:
			certStage = "양수,양도 인증완료";
			customerPayStage = "입금";
			compPayStage = "입금";
			transferStage = "완료";
			rePayStage = "고객입금부족";
			
			break;
		case 21:
			certStage = "양수,양도 인증완료";
			customerPayStage = "입금";
			compPayStage = "입금";
			transferStage = "완료";
			rePayStage = "카방계좌부족";
			
			break;
		case 22:
			certStage = "양수,양도 인증완료";
			customerPayStage = "입금";
			compPayStage = "입금";
			transferStage = "완료";
			rePayStage = "환급오류(에러코드)";
			
			break;
		case 23:
			certStage = "양수,양도 인증완료";
			customerPayStage = "입금";
			compPayStage = "입금";
			transferStage = "완료";
			rePayStage = "준비중";
			
			break;
		case 24:
			certStage = "양수,양도 인증완료";
			customerPayStage = "오류";
			compPayStage = "X";
			transferStage = "X";
			rePayStage = "X";
			
			break;
		case 25:
			certStage = "양수,양도 인증완료";
			customerPayStage = "입금";
			compPayStage = "오류";
			transferStage = "X";
			rePayStage = "X";
			
			break;
		case 26:
			certStage = "취소";
			customerPayStage = "취소";
			compPayStage = "취소";
			transferStage = "취소";
			rePayStage = "취소";
			
			break;
		case 27:
			certStage = "양수,양도 인증완료";
			customerPayStage = "입금";
			compPayStage = "입금";
			transferStage = "완료";
			rePayStage = "X";
			
			break;
		case 113:
			certStage = "양수,양도 인증완료";
			customerPayStage = "입금";
			compPayStage = "입금";
			transferStage = "X";
			rePayStage = "X";
			
			break;
		case 212:
			certStage = "양수,양도 인증완료";
			customerPayStage = "입금";
			compPayStage = "X";
			transferStage = "X";
			rePayStage = "X";
			
			break;	
		case 128:
			certStage = "양수,양도 인증완료";
			customerPayStage = "입금";
			compPayStage = "X";
			transferStage = "X";
			rePayStage = "X";
			
			break;
		case 28:
			certStage = "양수,양도 인증완료";
			customerPayStage = "입금";
			compPayStage = "X";
			transferStage = "X";
			rePayStage = "X";
			
			break;			
		default:
			certStage = "X";
			customerPayStage = "X";
			compPayStage = "X";
			transferStage = "X";
			rePayStage = "X";
			break;
		}
		
		rtnMap.put("certStage", certStage);
		rtnMap.put("customerPayStage", customerPayStage);
		rtnMap.put("compPayStage", compPayStage);
		rtnMap.put("transferStage", transferStage);
		rtnMap.put("rePayStage", rePayStage);
		
		
		return rtnMap;
	}
	@RequestMapping(value = "/efms/exup.do")
	public View exup(HttpServletRequest request,
			@RequestParam("file") MultipartFile[] files,
			ModelMap model) throws Exception {
		if(!U.preCheck(model)) {return jsonview;}
		try {
			MultipartFile uploadFile= files[0];
			Map info = new HashMap();
			info.put("RECEIPT_SERVER_DIR",EgovProperties.getPathProperty("Globals.excelUploadDir"));
			String uploadPath = U.fileUpload(request, uploadFile, info,"EXCEL");
			File ff = new File(uploadPath);
			String cp = ff.getCanonicalPath();
			String nm = ff.getName();
			String onm = (String)info.get("originalFilename");
			String json = request.getParameter("data");
			Map<String, Object> _map = U.getMap(json);
			Map parentMap = (Map)_map.get("parent");
			Map map = (Map)parentMap.get("data");
			map.put("onm", onm);
		 	String excel_start_index = (String)map.get("excel_start_index");
		 	Map mapper = (Map)map.get("mapper");
            int lindex = onm.lastIndexOf(".");
            String ext = onm.substring(lindex+1);
            List resultList = Util.getExcelListFromFile(uploadPath, excel_start_index, mapper, ext);
            map.put("excelList", resultList);
			int cnt = toService.excelUp(uploadPath,map,model);
		}catch(Exception e) {
			e.printStackTrace();
		}
	    return jsonview; 
    }

	
	
	/*
	 * 단지 스케쥴테스트를 위한 용도 
	 */
	@RequestMapping(value = "/schedule/TO_012/updateEnable.do")
	public View TO_012_updateEnable(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			int cnt = toService.TO_012_updateEnable();
			model.addAttribute("cnt", cnt);
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	};
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	// 2020.12.07 추가
//	공통사항
//	1. 보안번호 관련은 우선 보류. 추후작업
//	2. egov-security 사용여부와 별개로 테스트를 위해 필요 시 로그인/회원가입 우선 구현 예정
	
	/************************************************ 보안번호 시작 ************************************************/
	/*TO_DO
	보안번호 암호화 알고리즘 적용 협의 필요
	보안번호 찾기 SMS 발송 솔루션 필요(앱)
	ID/PW 찾기 기능관련 협의 필요(웹)
	보안번호 설정
	보안번호 입력
	보안번호 찾기
	보안번호 재설정*/
	@RequestMapping(value = "/TOM_02/SecretKey.do")
	public View SecretKey(HttpServletRequest req
			, HttpServletResponse res
			, @RequestParam Map <String, Object> mocaMap
			, ModelMap model) throws Exception {
		try {
			Map paramMap = U.getBodyNoSess(mocaMap);  
			String loginType = (String) paramMap.get("loginType");	// 1:카카오, 2:네이버, 3:페이스북
			String id = (String) paramMap.get("id");				// 소셜로그인 id
			String SecretKey = (String) paramMap.get("SecretKey");				// 소셜로그인 id
			
			String resultCd = "";
			String resultMsg = "";
			ToUserVO userVoOri = TOMapper.selectToUsersDetail(paramMap);
			ToUserVO userVo = TOMapper.selectToUsersDetailBySecretKey(paramMap);
			String loginFailCount = userVoOri.getLoginFailCount();
			if(loginFailCount == null) {
				loginFailCount = "0";
			} 
			if(loginFailCount.equals("3")) {
				resultCd = "0003";	//보안번호 3회 오류
				resultMsg = "보안번호 3회 오류";
			}else if(userVo == null && loginFailCount.equals("2")) {
				resultCd = "0003";	//보안번호 3회 오류
				resultMsg = "보안번호 3회 오류";	
			}else if(userVo == null) {
				String nowFailCnt = (Integer.parseInt(loginFailCount)+1)+"";
				resultCd = "0001";	//보안번호 입력오류
				resultMsg = "보안번호 입력 오류"+"("+nowFailCnt+"회)";
				paramMap.put("loginFailCount", nowFailCnt);
				TOMapper.updateLoginFailCount(paramMap);
			} else if("Y".equals(userVo.getLeaveYn())) {
				resultCd = "0002";	// 탈퇴 회원
				resultMsg = "탈퇴 회원입니다. 다시 회원가입 하시겠습니까?";
			} else {
				req.getSession().setAttribute("userInfo", userVo);
				resultCd = "0000";
				resultMsg = "로그인 성공";
				paramMap.put("loginFailCount", "0");
				TOMapper.updateLoginFailCount(paramMap);
			}
			model.addAttribute("resultCd", resultCd);
			model.addAttribute("resultMsg", resultMsg);
			model.addAttribute("userInfo", userVo);
		}catch(Exception e) {
			e.printStackTrace();
		}
        return jsonview;
	};	
	/************************************************ 보안번호 끝 ************************************************/
	
	
	/************************************************ 로그인/회원가입 시작 ************************************************/
//	1. 회원조회(탈퇴여부 포함)
//	- loginType : 1:카카오, 2:네이버, 3:페이스북
//	- id : 소셜로그인 id
	@RequestMapping(value = {"/TOM_02/userInfo.do","/TOM_02/mobile/userInfo.do"})
	public View selectUserInfoJson(HttpServletRequest req
			, HttpServletResponse res
			, @RequestParam Map<String, Object> mocaMap
			, ModelMap model) throws Exception {
		
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);  

			// 소셜로그인 id, 소셜로그인 타입 필요 (id : 소셜로그인id, loginType : 1:카카오, 2:네이버, 3:페이스북)
			String loginType = (String) paramMap.get("loginType");	// 1:카카오, 2:네이버, 3:페이스북
			String id = (String) paramMap.get("id");				// 소셜로그인 id
			
			String resultCd = "";
			String resultMsg = "";
			
			
			ToUserVO userVoIsLeaveYn = TOMapper.selectToUsersLeaveYn(paramMap); 
			ToUserVO userVo = TOMapper.selectToUsersDetail(paramMap);
			if(userVoIsLeaveYn != null && "Y".equals(userVoIsLeaveYn.getLeaveYn())) {
				resultCd = "0002";	// 탈퇴 회원
				resultMsg = "탈퇴 회원입니다.";
			}else if(userVo == null) {
				resultCd = "0001";	// 미가입 회원
				resultMsg = "미가입 회원입니다. 회원가입 하시겠습니까?";
			} else {
				req.getSession().setAttribute("userInfo", userVo);
				// 로그인 사용자정보 session set
				// 필요 시 추후 Interceptor 설정으로 로그인 유효성 체크 해야함
				HttpSession session = req.getSession();
				session.setAttribute("userInfo", userVo);
				
				resultCd = "0000";
				resultMsg = "로그인 성공";
				model.addAttribute("userInfo", userVo);
			}
			model.addAttribute("resultCd", resultCd);
			model.addAttribute("resultMsg", resultMsg);
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
//	3. 약관조회
	@RequestMapping(value = "/TOM_04/mobile/termsList.do")
	public View selectTermsListJson(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			// 각 소분류 항목 약관중 적용여부(enable) 1인 것만 조회(적용여부(1:적용, 2:미적용))
			model.addAttribute("termsList", TOMapper.selectTermsList(paramMap));
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
//	4. 본인인증 요청
//	- inqType 1: app, 2: web
	@RequestMapping(value = "/TOM_06/mobile/sendIdentityVerify.do")
	public View sendIdentityVerify(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			String inqType = (String) paramMap.get("inqType");
	
			if("1".equals(inqType)) {	// app raon usim 본인인증 호출
				
//				// raon usim 인증테스트
//				Map m = new HashMap();
//				m = TcertClientServer.sendAuthMsg();
//				model.addAttribute("m", m);
				
				
			} else {					// web SCI 본인인증 호출
				
				
			}
			
			// resultCd, resultMsg 리턴 (api 호출 본인인증 오류 응답 시 resultCd, resultMsg 오류코드/메시지 전송)
			
			//model.addAttribute("admMngList", tOMapper.selectAdmMngList(inqtype));
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
	    return jsonview;
	}
	
//	4. 본인인증 결과 (인증번호 입력 후 호출)
//	- inqType 1: app, 2: web
	@RequestMapping(value = "/TOM_06/mobile/callBackIdentityVerify.do")
	public View callBackIdentityVerify(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			String inqType = (String) paramMap.get("inqType");
			String securPassword = (String) paramMap.get("securPassword");	// 인증번호
	
			if("1".equals(inqType)) {	// app raon usim 본인인증 결과 호출
				
				
				
			} else {					// web SCI 본인인증 결과 호출
				
				
			}
			
			// resultCd, resultMsg 리턴 (api 호출 본인인증 오류 응답 시 resultCd, resultMsg 오류코드/메시지 전송)
			
			//model.addAttribute("admMngList", tOMapper.selectAdmMngList(inqtype));
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
	    return jsonview;
	}
	
	/************************************************ 로그인/회원가입 끝 ************************************************/
	
		
	
	/************************************************ 차량분석 시작 ************************************************/
	@RequestMapping(value = {"/TOM_25/mobile/sendCooconOp.do"})
	public View sendCooconOp(@RequestParam Map<String, Object> mocaMap, ModelMap model, HttpServletRequest request) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// ============================ 2021.01.12 변경작업 시작(쿠콘 api -> 카방 api) ============================ 
			/**
			 * =======================================================================================================================================
			 * 
			 * 1. 쿠콘 응답값, 추가 가공값 말고 아래 항목은 화면에서 입력값을 보내줘야함
			 * 	- InputOwner			// 입력 자동차 소유자명
			 * 	- InputRegNumber		// 입력 자동차 차량번호
			 * 	- ReqId					// 로그인 사용자 아이디
			 * 	- ReqMobilePhone		// 로그인 사용자 휴대폰번호
			 * 
			 * 2. 카방 어플에서는 기존 조회이력 있으면 기존 데이터 update 처리를 했으나, 개인소유권이전에서는 조회 시마다 isnert 처리 (2020.11.27 양이사님 요청)
			 * 
			 * 3. 압류저당촉탁여부 판단방법
			 * 	- 저당 : 쿠콘 response 데이터 을부전체건수(EB_COUNT), 을부(반복부)(RESP_MORTGAGE_DATA_INFO)의 을부번호(EB_NO) 또는 갑부상세에 "사항란"에서 "을부번호" 단어(문구)로 검색 (을부전체건수로 체크했음)
			 * 	- 압류/촉탁 : 쿠콘 response 데이터의 갑부상세(반복부)(RESP_OWNER_DATA_INFO)의 사항란(GDETAIL_TEXT)에 "압류"라는 문구가 있으면 압류/촉탁있음. 압류저당촉탁여부 : Y
			 * 	- 둘 다 체크해야함
			 * 
			 * 4. 구조변경, 용도변경 판단방법 (압류저당촉탁여부와는 관계없으나 구조변경/용도변경 시 소유권이전 불가함)
			 * 	- 구조변경 : 쿠콘 response 데이터의 갑부상세(반복부)(RESP_OWNER_DATA_INFO)의 사항란(GDETAIL_TEXT)에 "구조변경" 단어가 있으면 구조변경
			 * 	- 용도변경 : 확인 후 메일발송 예정 (김훈팀장님)
			 * =======================================================================================================================================
			 */
			
			String SeizeCollateralEntrustYn = "N";	// 압류저당촉탁여부
			String PassYn = "Y";					// 정상여부
			String ErrCode = "";					// 오류코드
			String RegType = "1";					// 등록구분(1:APP, 2:관리자)
			String ErrType = "0";					// 오류대상구분(0:해당없음,1:쿠콘,2:카방,0)
			String idx	   = "";					// 자동차 등록원부 idx
			
			// 1. 쿠콘호출
			String CAR_NUM = (String)paramMap.get("CAR_NUM");
			String OWNER_NAME = (String)paramMap.get("OWNER_NAME");
			String PHONE_NUM = (String)paramMap.get("PHONE_NUM");
			
			if(StringUtils.isEmpty(CAR_NUM) || StringUtils.isEmpty(OWNER_NAME)) {
				throw new NullPointerException("차량번호, 소유자명 필수 입력값입니다.");
			}
			
			/**
			 * 2021.01.12 변경
			 * 호출 시 자동차 등록원부 선 insert 처리.
			 * 쿠콘 호출이 자주 먹통이 되어, 쿠콘 api 대신 카방 api 호출하는 방식으로 변경.
			 * 카방 api호출 시 판매상사 차량조회(데이터 없으면 개인간 차량)->쿠콘조회-> (있으면) 그대로 정보 내림, (없으면) ts 개인차량조회 -> 양도인통신사인증(신규)-> 인증 후 정보 업데이트 처리 
			 * */

			paramMap.put("RegType", RegType);

			// 등록원부 저장
			TOMapper.insertToVehicleRegistration(paramMap);
			idx = paramMap.get("idx").toString();
			paramMap.put("idx", idx);	// 형변환(long -> String)
			
			// 1. 차량분석을 위한 carbang api 호출
//			Map<String, Object> result = TOLink.call(paramMap);
			Map<String, Object> result = TOUtil.carbangCall(paramMap);
			
			ErrCode = (String) result.get("RESULT_CD");	// 응답코드
			
			// 00000000  : 쿠콘정상, 9000C505 : 카방API에서 TS 개인 차량분석 -> 양도인 인증 -> 등록원부 업데이트
			if(!"00000000".equals(ErrCode) && !"9000C505".equals(ErrCode)) {	// 오류 시 정상여부, 오류대상구분 set
				Map<String, Object> errMap = new HashMap<String, Object>();

				errMap.put("ResultCd", (String) result.get("RESULT_CD"));	// 쿠콘 결과코드
				errMap.put("ResultMg", "["+ErrCode+"] RESULT_MG:"+(String) result.get("RESULT_MG"));	// 쿠콘 결과메시지
				errMap.put("ErrType", "1");									// 오류대상구분(1:쿠콘,2:카방)
				errMap.put("PassYn", "N");
				errMap.put("idx", idx);
				
				TOMapper.updateToVehicleRegistrationErr(errMap);
				
			} else {
				
				// 00000000 : 쿠콘 정상응답. 기존과 동일하게 처리하면됨, 9000C505 : 카방 api 측에서 직접 업데이트 처리하므로 따로 작업할 필요 없음
				if("00000000".equals(ErrCode)) {
					
					List<Map<String, Object>> masterDetailList = (List<Map<String, Object>>) result.get("RESP_OWNER_DATA_INFO");	// 갑부상세
					List<Map<String, Object>> slaveDetailList = (List<Map<String, Object>>) result.get("RESP_MORTGAGE_DATA_INFO");	// 을부상세
					
					// 3. 압류저당촉탁여부 set
					// 저당사항 체크 (을부전체건수로 체크. 5자리 문자열로 값이 없을 경우 "00000"값으로 넘어옴)
					if("Y".equals(PassYn)) {
						int ebCnt = Integer.parseInt((String) result.get("EB_COUNT"));
						if(ebCnt > 0) {
							SeizeCollateralEntrustYn = "Y";
						}
					}
					
					// 압류/촉탁 체크
					if(masterDetailList.size() > 0) {
						for(Map<String, Object> masterMap : masterDetailList) {
							String detailTxt = (String)masterMap.get("GDETAIL_TEXT");	// 사항란
							
							if(detailTxt.contains("압류")) {
								SeizeCollateralEntrustYn = "Y";
								break;
							}
						}
					}
					
					paramMap.putAll(result);
					paramMap.put("SeizeCollateralEntrustYn", SeizeCollateralEntrustYn);
					paramMap.put("PassYn", PassYn);
					paramMap.put("RegType", RegType);
					paramMap.put("ErrType", ErrType);
					
					// 4. 자동차등록원부 컬럼값 set
					Map<String, Object> vehicleRstMap = this.setToVehicleRst(paramMap);
					vehicleRstMap.put("idx", idx);
					
					// 5. 자동차등록원부 업데이트, idx set
					TOMapper.updateToVehicleRegistration(vehicleRstMap);
					
					// 6. 자동차등록원부 갑지 insert
					if(masterDetailList.size() > 0) {
						List<Map<String, Object>> mList = this.setToVehicleRstMaster(paramMap);
						paramMap.put("masterDetailList", mList);
						TOMapper.insertToVehicleRstMaster(paramMap);
					}
					
					// 7. 자동차등록원부 을지 insert
					if(slaveDetailList.size() > 0) {
						List<Map<String, Object>> sList = this.setToVehicleRstSlave(paramMap);
						paramMap.put("slaveDetailList", sList);
						TOMapper.insertToVehicleRstSlave(paramMap);
					}
										
					// 8. 제조사 차량가격 조회 및 테이블 insert(2021.04.28)
					toService.inqPrcFromMfco((String)vehicleRstMap.get("ChassisNumber"));
										
					
					// 결과 코드, 결과 메시지 set
					model.addAttribute("idx", idx);								// 자동차등록원부 idx
					//여기구현
					Map m = new HashMap();
					m.put("idx", idx);
					m.put("searchTxt", "");
					m.put("inqType", "");
					List<Map<String, Object>> analList = TOMapper.selectCarAnalysis(m);
					 
					model.addAttribute("carAnalysisList", analList);
				}
			}
			
			model.addAttribute("idx", idx);
			model.addAttribute("statusCd", result.get("RESULT_CD"));
			model.addAttribute("statusMsg", result.get("RESULT_MG"));
			
			// ============================ 2021.01.12 변경작업 끝(쿠콘 api -> 카방 api) ============================
			/**
			 * =======================================================================================================================================
			 * 
			 * 1. 쿠콘 응답값, 추가 가공값 말고 아래 항목은 화면에서 입력값을 보내줘야함
			 * 	- InputOwner			// 입력 자동차 소유자명
			 * 	- InputRegNumber		// 입력 자동차 차량번호
			 * 	- ReqId					// 로그인 사용자 아이디
			 * 	- ReqMobilePhone		// 로그인 사용자 휴대폰번호
			 * 
			 * 2. 카방 어플에서는 기존 조회이력 있으면 기존 데이터 update 처리를 했으나, 개인소유권이전에서는 조회 시마다 isnert 처리 (2020.11.27 양이사님 요청)
			 * 
			 * 3. 압류저당촉탁여부 판단방법
			 * 	- 저당 : 쿠콘 response 데이터 을부전체건수(EB_COUNT), 을부(반복부)(RESP_MORTGAGE_DATA_INFO)의 을부번호(EB_NO) 또는 갑부상세에 "사항란"에서 "을부번호" 단어(문구)로 검색 (을부전체건수로 체크했음)
			 * 	- 압류/촉탁 : 쿠콘 response 데이터의 갑부상세(반복부)(RESP_OWNER_DATA_INFO)의 사항란(GDETAIL_TEXT)에 "압류"라는 문구가 있으면 압류/촉탁있음. 압류저당촉탁여부 : Y
			 * 	- 둘 다 체크해야함
			 * 
			 * 4. 구조변경, 용도변경 판단방법 (압류저당촉탁여부와는 관계없으나 구조변경/용도변경 시 소유권이전 불가함)
			 * 	- 구조변경 : 쿠콘 response 데이터의 갑부상세(반복부)(RESP_OWNER_DATA_INFO)의 사항란(GDETAIL_TEXT)에 "구조변경" 단어가 있으면 구조변경
			 * 	- 용도변경 : 확인 후 메일발송 예정 (김훈팀장님)
			 * =======================================================================================================================================
			 */

		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
	    return jsonview;
	}
	//	1. 쿠콘호출 및 등록원부 저장
	//	- 등록원부 조회 데이터는 차량분석오류와 같이 사용할거임.
	//	- 쿠콘조회 및 데이터 적재 후 foward방식으로 등록원부 조회 서블릿 호출. (등록 후 등록 데이터 목록 최상위 노출을 위해)
	@RequestMapping(value = {"/TO_002/sendCoocon.do","/TOM_25/mobile/sendCoocon.do"})
	public View prodSendCoocon(@RequestParam Map<String, Object> mocaMap, ModelMap model, HttpServletRequest request) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// ============================ 2021.01.12 변경작업 시작(쿠콘 api -> 카방 api) ============================ 
			/**
			 * =======================================================================================================================================
			 * 
			 * 1. 쿠콘 응답값, 추가 가공값 말고 아래 항목은 화면에서 입력값을 보내줘야함
			 * 	- InputOwner			// 입력 자동차 소유자명
			 * 	- InputRegNumber		// 입력 자동차 차량번호
			 * 	- ReqId					// 로그인 사용자 아이디
			 * 	- ReqMobilePhone		// 로그인 사용자 휴대폰번호
			 * 
			 * 2. 카방 어플에서는 기존 조회이력 있으면 기존 데이터 update 처리를 했으나, 개인소유권이전에서는 조회 시마다 isnert 처리 (2020.11.27 양이사님 요청)
			 * 
			 * 3. 압류저당촉탁여부 판단방법
			 * 	- 저당 : 쿠콘 response 데이터 을부전체건수(EB_COUNT), 을부(반복부)(RESP_MORTGAGE_DATA_INFO)의 을부번호(EB_NO) 또는 갑부상세에 "사항란"에서 "을부번호" 단어(문구)로 검색 (을부전체건수로 체크했음)
			 * 	- 압류/촉탁 : 쿠콘 response 데이터의 갑부상세(반복부)(RESP_OWNER_DATA_INFO)의 사항란(GDETAIL_TEXT)에 "압류"라는 문구가 있으면 압류/촉탁있음. 압류저당촉탁여부 : Y
			 * 	- 둘 다 체크해야함
			 * 
			 * 4. 구조변경, 용도변경 판단방법 (압류저당촉탁여부와는 관계없으나 구조변경/용도변경 시 소유권이전 불가함)
			 * 	- 구조변경 : 쿠콘 response 데이터의 갑부상세(반복부)(RESP_OWNER_DATA_INFO)의 사항란(GDETAIL_TEXT)에 "구조변경" 단어가 있으면 구조변경
			 * 	- 용도변경 : 확인 후 메일발송 예정 (김훈팀장님)
			 * =======================================================================================================================================
			 */
			
			String SeizeCollateralEntrustYn = "N";	// 압류저당촉탁여부
			String PassYn = "Y";					// 정상여부
			String ErrCode = "";					// 오류코드
			String RegType = "1";					// 등록구분(1:APP, 2:관리자)
			String ErrType = "0";					// 오류대상구분(0:해당없음,1:쿠콘,2:카방,0)
			String idx	   = "";					// 자동차 등록원부 idx
			
			// 1. 쿠콘호출
			String CAR_NUM = (String)paramMap.get("CAR_NUM");
			String OWNER_NAME = (String)paramMap.get("OWNER_NAME");
			String PHONE_NUM = (String)paramMap.get("PHONE_NUM");
			
			if(StringUtils.isEmpty(CAR_NUM) || StringUtils.isEmpty(OWNER_NAME)) {
				throw new NullPointerException("차량번호, 소유자명 필수 입력값입니다.");
			}
			
			/**
			 * 2021.01.12 변경
			 * 호출 시 자동차 등록원부 선 insert 처리.
			 * 쿠콘 호출이 자주 먹통이 되어, 쿠콘 api 대신 카방 api 호출하는 방식으로 변경.
			 * 카방 api호출 시 판매상사 차량조회(데이터 없으면 개인간 차량)->쿠콘조회-> (있으면) 그대로 정보 내림, (없으면) ts 개인차량조회 -> 양도인통신사인증(신규)-> 인증 후 정보 업데이트 처리 
			 * */

			paramMap.put("RegType", RegType);
			ToUserVO userVo = (ToUserVO)request.getSession().getAttribute("userInfo");
			if(userVo == null) {	// 임시.
				throw new Exception("로그인안됨");
			}else {
				paramMap.put("ReqId", userVo.getIdx());
			}
			
			// 등록원부 저장
			TOMapper.insertToVehicleRegistration(paramMap);
			//idx = String.valueOf((long) paramMap.get("idx"));
			idx = paramMap.get("idx").toString();
			paramMap.put("idx", idx);	// 형변환(long -> String)
			
			// 1. 차량분석을 위한 carbang api 호출
//			Map<String, Object> result = TOLink.call(paramMap);
			Map<String, Object> result = TOUtil.carbangCall(paramMap);
/*			
			{RESULT_CD=00000000, CAR_REGNO=41소7390, ADM_REGNO=A081-00087-0040-1313, ERASE_DATE=, CAR_NAME=그랜저(GRANDEUR), 
			CAR_TYPE=승용 대형, CAR_VINARY_NO=KMHFH41NBEA316620, MOVER_TYPE=L6DB, USE=자가용, MODEL_YEAR=2014, COLOR=검정, SOURCE_GB=신조차, 
			FIRST_REG_DATE=2013-08-23, DETAIL_TYPE=, PRODUCT_DATE=2013-08-12, 
			LAST_OWNER=성백근, 
			REGNO=600920-1******, 
			LOCATE_USE=서울특별시 송파구 *** **** **-**********, CHECK_EXP_DATE=2019-08-23 ~ 2021-08-22  주행거리:126000, CONFIRM_DATE=, CLOSE_DATE=, RESP_OWNER_DATA_INFO=[{MAIN_NO=1-1, SUB_NO=, DETAIL_REG_NO=910815-2******, DETAIL_REGDATE=2013-08-23, RECEIPT_NO=041535, GDETAIL_TEXT=신규등록(신조차) 성명(상호) : 배**(50%)  910815-2****** 주소 : 경기도 성남시 *** **** **-** **** 공동소유자 : 배**(551115-1****** 50%), MAIN_CHK=1}, {MAIN_NO=1-3, SUB_NO=, DETAIL_REG_NO=, DETAIL_REGDATE=2017-09-12, RECEIPT_NO=0373-2, GDETAIL_TEXT=자동차검사 강남자동차검사소 검사구분 : 재검사(1부재검사) 주행거리 : 64610, MAIN_CHK=1}, {MAIN_NO=1-4, SUB_NO=, DETAIL_REG_NO=, DETAIL_REGDATE=2019-08-16, RECEIPT_NO=0432-2, GDETAIL_TEXT=자동차검사 강남자동차검사소 검사구분 : 1부재검사(종합) 주행거리 : 97370, MAIN_CHK=1}, {MAIN_NO=1-5, SUB_NO=, DETAIL_REG_NO=600920-1******, DETAIL_REGDATE=2020-07-30, RECEIPT_NO=051072, GDETAIL_TEXT=명의이전등록 성명(상호) : 성** 600920-1****** 주소 : 서울특별시 송파구 *** **** **-** **** 취득일자 : 2020-07-30  이전등록구분:당사자거래이전 주행거리 : 126000, MAIN_CHK=1}, {MAIN_NO=1-6, SUB_NO=, DETAIL_REG_NO=, DETAIL_REGDATE=2020-12-16, RECEIPT_NO=013925, GDETAIL_TEXT=변경등록 주소 : 서울특별시 송파구 *** **** **-** ****, MAIN_CHK=1}], RESP_MORTGAGE_DATA_INFO=[], GD_COUNT=00005, EB_COUNT=00000}
			
			*/
			ErrCode = (String) result.get("RESULT_CD");	// 응답코드
			Map ErrCodeMap = new HashMap();
			List codeList = TOMapper.selectCarSearchErrTypeCodeList();
			for(int j=0;j < codeList.size(); j++) {
				Map row = (Map)codeList.get(j);
				ErrCodeMap.put((String)row.get("CODE"), (String)row.get("CODE_NM"));
			}
			
			// 00000000  : 쿠콘정상, 9000C505 : 카방API에서 TS 개인 차량분석 -> 양도인 인증 -> 등록원부 업데이트
			if(!"00000000".equals(ErrCode) && !"9000C505".equals(ErrCode)) {	// 오류 시 정상여부, 오류대상구분 set
				Map<String, Object> errMap = new HashMap<String, Object>();

				if(result.get("RESULT_MG") == null || "".equals((String)result.get("RESULT_MG"))) {
					result.put("RESULT_MG",(String) ErrCodeMap.get(ErrCode));
					errMap.put("ResultMg", (String) result.get("RESULT_MG"));	// 쿠콘 결과메시지
				}
				errMap.put("ResultCd", (String) result.get("RESULT_CD"));	// 쿠콘 결과코드
				errMap.put("ErrType", "1");									// 오류대상구분(1:쿠콘,2:카방)
				errMap.put("PassYn", "N");
				errMap.put("idx", idx);
				
				TOMapper.updateToVehicleRegistrationErr(errMap);
				
			} else {
				
				// 00000000 : 쿠콘 정상응답. 기존과 동일하게 처리하면됨, 9000C505 : 카방 api 측에서 직접 업데이트 처리하므로 따로 작업할 필요 없음
				if("00000000".equals(ErrCode)) {
					
					List<Map<String, Object>> masterDetailList = (List<Map<String, Object>>) result.get("RESP_OWNER_DATA_INFO");	// 갑부상세
					List<Map<String, Object>> slaveDetailList = (List<Map<String, Object>>) result.get("RESP_MORTGAGE_DATA_INFO");	// 을부상세
					
					// 3. 압류저당촉탁여부 set
					// 저당사항 체크 (을부전체건수로 체크. 5자리 문자열로 값이 없을 경우 "00000"값으로 넘어옴)
					if("Y".equals(PassYn)) {
						int ebCnt = Integer.parseInt((String) result.get("EB_COUNT"));
						if(ebCnt > 0) {
							SeizeCollateralEntrustYn = "Y";
						}
					}
					
					// 압류/촉탁 체크
					if(masterDetailList.size() > 0) {
						for(Map<String, Object> masterMap : masterDetailList) {
							String detailTxt = (String)masterMap.get("GDETAIL_TEXT");	// 사항란
							
							if(detailTxt.contains("압류")) {
								SeizeCollateralEntrustYn = "Y";
								break;
							}
						}
					}
					
					paramMap.putAll(result);
					paramMap.put("SeizeCollateralEntrustYn", SeizeCollateralEntrustYn);
					paramMap.put("PassYn", PassYn);
					paramMap.put("RegType", RegType);
					paramMap.put("ErrType", ErrType);
					
					// 4. 자동차등록원부 컬럼값 set
					Map<String, Object> vehicleRstMap = this.setToVehicleRst(paramMap);
					vehicleRstMap.put("idx", idx);
					
					// 5. 자동차등록원부 업데이트, idx set
					TOMapper.updateToVehicleRegistration(vehicleRstMap);
					
					// 6. 자동차등록원부 갑지 insert
					if(masterDetailList.size() > 0) { 
						List<Map<String, Object>> mList = this.setToVehicleRstMaster(paramMap);
						paramMap.put("masterDetailList", mList);
						TOMapper.insertToVehicleRstMaster(paramMap);
					}
					
					// 7. 자동차등록원부 을지 insert
					if(slaveDetailList.size() > 0) {
						List<Map<String, Object>> sList = this.setToVehicleRstSlave(paramMap);
						paramMap.put("slaveDetailList", sList);
						TOMapper.insertToVehicleRstSlave(paramMap);
					}
					
					
					String LAST_OWNER = (String)result.get("LAST_OWNER");
					String REGNO = (String)result.get("REGNO");
					// 결과 코드, 결과 메시지 set
					model.addAttribute("idx", idx);// 자동차등록원부 idx
					model.addAttribute("LAST_OWNER", LAST_OWNER);//성백근
					model.addAttribute("REGNO", REGNO);//600920-1******
				}
			}
			
			model.addAttribute("idx", idx);
			model.addAttribute("statusCd", result.get("RESULT_CD"));
			model.addAttribute("statusMsg", result.get("RESULT_MG"));
			
			// ============================ 2021.01.12 변경작업 끝(쿠콘 api -> 카방 api) ============================
			/**
			 * =======================================================================================================================================
			 * 
			 * 1. 쿠콘 응답값, 추가 가공값 말고 아래 항목은 화면에서 입력값을 보내줘야함
			 * 	- InputOwner			// 입력 자동차 소유자명
			 * 	- InputRegNumber		// 입력 자동차 차량번호
			 * 	- ReqId					// 로그인 사용자 아이디
			 * 	- ReqMobilePhone		// 로그인 사용자 휴대폰번호
			 * 
			 * 2. 카방 어플에서는 기존 조회이력 있으면 기존 데이터 update 처리를 했으나, 개인소유권이전에서는 조회 시마다 isnert 처리 (2020.11.27 양이사님 요청)
			 * 
			 * 3. 압류저당촉탁여부 판단방법
			 * 	- 저당 : 쿠콘 response 데이터 을부전체건수(EB_COUNT), 을부(반복부)(RESP_MORTGAGE_DATA_INFO)의 을부번호(EB_NO) 또는 갑부상세에 "사항란"에서 "을부번호" 단어(문구)로 검색 (을부전체건수로 체크했음)
			 * 	- 압류/촉탁 : 쿠콘 response 데이터의 갑부상세(반복부)(RESP_OWNER_DATA_INFO)의 사항란(GDETAIL_TEXT)에 "압류"라는 문구가 있으면 압류/촉탁있음. 압류저당촉탁여부 : Y
			 * 	- 둘 다 체크해야함
			 * 
			 * 4. 구조변경, 용도변경 판단방법 (압류저당촉탁여부와는 관계없으나 구조변경/용도변경 시 소유권이전 불가함)
			 * 	- 구조변경 : 쿠콘 response 데이터의 갑부상세(반복부)(RESP_OWNER_DATA_INFO)의 사항란(GDETAIL_TEXT)에 "구조변경" 단어가 있으면 구조변경
			 * 	- 용도변경 : 확인 후 메일발송 예정 (김훈팀장님)
			 * =======================================================================================================================================
			 */

		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
	    return jsonview;
	}
	
//	2. 차량상세정보조회 (소유권이전 가능여부 및 이유 같이 보내줘야함. 의뢰시간 조회 포함. )
	@RequestMapping(value = {"/TO_000P03/carInfoDetail.do","/TOM_39/mobile/carInfoDetail.do","/TOM_39/carInfoDetail.do"})
	public View selectCarInfoDetailJson(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			Map<String, Object> rtnmap = new HashMap<String, Object>(); 
			String transferPsblYn = "Y"; 		// 이전가능여부
			String transferPsblMsg = ""; 		// 이전불가능 사유
			
			// 1. 차량상세정보
			Map<String, Object> carInfoDetail = TOMapper.selectCarInfoDetail(paramMap);
			
			if(carInfoDetail == null) {
				throw new Exception("차량 상세 정보가 없습니다");
			} 
			
			String price = carInfoDetail.get("Price").toString();
			String usage = carInfoDetail.get("Purpose2").toString();
			
			// 기준가액이 없으면 이전신청 불가
			if("0".equals(price)) {
				transferPsblYn = "N";
				transferPsblMsg = "시가표준액 정보가 존재하지 않아 이전이 불가능합니다.";
			}
			
			String CountryOrigin = (String) carInfoDetail.get("CountryOrigin");
			if("수입".equals(CountryOrigin)) {
				CountryOrigin = "외산";
				carInfoDetail.put("CountryOrigin", CountryOrigin);
			}
			
			// 1-1. 차량시세 정보
//			기존 프로시저 호출 하여 차량시세 계산은 사용하지 않기로함
//			Map<String, Object> carPriceInfo = TOMapper.callTOGetUsedCarRemainingPriceByKcar(carInfoDetail);
			
			Map<String, Object> carPriceInfo = TOMapper.selectRemainingPrice(carInfoDetail);
			
			int UsedCarRemainingPrice = 0;
			String VehicleElapsedYear_Original = "";
			String VehicleElapsedMonth = "";
			String VehicleElapsedDay = "";
			int UpRate = 0;
			int MdlRate = 0;
			
			if(carPriceInfo != null) {
				Double tempMarketLowPrice = (double) carPriceInfo.get("marketLowPrice");
				UsedCarRemainingPrice =  tempMarketLowPrice.intValue();											// 차량시세 하한가
				VehicleElapsedYear_Original =  carPriceInfo.get("VehicleElapsedYear_Original").toString();		// 차량경과년
				VehicleElapsedMonth =  carPriceInfo.get("VehicleElapsedMonth").toString();						// 차량경과월
				VehicleElapsedDay =  carPriceInfo.get("VehicleElapsedDay").toString();							// 차량경과일
			}

			// 1-2 차량시세 중간/상한가 적용률 조회
			Map<String, Object> addRatioInfo = TOMapper.selectGetAddRatio(carPriceInfo);
			
			if(addRatioInfo != null) {
				UpRate =  new BigDecimal(addRatioInfo.get("UpRate").toString()).setScale(1, BigDecimal.ROUND_DOWN).intValue();		// 차량시세 상한가
				MdlRate =  new BigDecimal(addRatioInfo.get("MdlRate").toString()).setScale(1, BigDecimal.ROUND_DOWN).intValue();	// 차량시세 중간가(=차량시세)
			}
			
			carInfoDetail.put("UsedCarRemainingPrice", UsedCarRemainingPrice);
			carInfoDetail.put("UpRate", UpRate);
			carInfoDetail.put("MdlRate", MdlRate);
			carInfoDetail.put("VehicleElapsedYear_Original", VehicleElapsedYear_Original);
			carInfoDetail.put("VehicleElapsedMonth", VehicleElapsedMonth);
			carInfoDetail.put("VehicleElapsedDay", VehicleElapsedDay);
			carInfoDetail.put("Usage", usage);
			
			// 2. 자동차 등록원부 을지 (근저당 설정내역)
			List<Map<String, Object>> slaveList = TOMapper.selectCarInfoSlave(paramMap);

			// 3. 자동차 등록원부 갑지
			List<Map<String, Object>> masterList = TOMapper.selectCarInfoMaster(paramMap);
			
			// 4. 데이터가공
			/*
			 * 4-1. 저당설정구분 (txt : 저당설정)
			 * 		>> 사항란 저당설정 들어있으면 을부번호 기준으로 잘라서 을지 loop돌면서 확인 후 값 넣기
			 * 		>> ex) 저당설정 구분 : 단독저당  을부번호 : 482a-2019-219710
			 * 4-2. 압류/촉탁내역 (분실,도난 or 압류)
			 * 4-3. 구조변경내역 (구조변경)
			 * 4-4. 용도변경내역 (용도변경 OR (번호) 용도)
			 * */
			
			List<String> mortgageList = new ArrayList<String>();								// 저당설정구분 리스트
			List<Map<String, Object>> seizeList = new ArrayList<Map<String, Object>>();		// 압류/촉탁내역 리스트
			List<Map<String, Object>> structCngList = new ArrayList<Map<String, Object>>();	// 구조변경 리스트
			List<Map<String, Object>> useCngList = new ArrayList<Map<String, Object>>();		// 용도변경 리스트
			Map<String, Object> structCngMap = null;
			Map<String, Object> useCngMap = null;
			
			for(Map<String, Object> map : masterList) {
				String DetailDescription = (String) map.get("DetailDescription");	// 사항란
				
				if(!StringUtils.isEmpty(DetailDescription)) {
					
					// 4-1. 저당설정구분 (txt : 저당설정)
					if(DetailDescription.contains("저당설정")) {
						mortgageList.add(DetailDescription);
					}
					// 4-2. 압류/촉탁내역 (분실,도난 or 압류)
					else if(DetailDescription.contains("분실,도난") || DetailDescription.contains("압류")) {
						seizeList.add(this.getSeizeDetail(DetailDescription));		
					}
					// 4-3. 구조변경내역 (구조변경)
					else if(DetailDescription.contains("구조변경")) {
						structCngMap = new HashMap<String, Object>();
						structCngMap.put("structCngDate", map.get("RegistrationDate"));
						
						structCngMap.put("structCngTitle", "구조변경 : "+this.comfileTxt("구조변경 \\: (.*)(구조변경 후 내역 \\:)", DetailDescription));
						structCngMap.put("structCngContents", "구조변경 후 내역 : "+this.comfileTxt("구조변경 후 내역 \\: (.*)", DetailDescription));
						structCngList.add(structCngMap);
					}
					// 4-4. 용도변경내역 (용도변경 OR (번호) 용도)
					else if(DetailDescription.contains("용도변경") || DetailDescription.contains("(번호) 용도")) {
						useCngMap = new HashMap<String, Object>();
						useCngMap.put("useCngDate", map.get("RegistrationDate"));
						useCngMap.put("useCngContents", DetailDescription);
						useCngList.add(useCngMap);
					}
				}
			}
			
			// 저당설정구분 목록이 있으면 을부번호로 을지 목록과 매핑하여 저당구분 set
			// ex) 저당설정 구분 : 단독저당  을부번호 : 482a-2019-219710
			if(mortgageList.size() > 0){
				
				for(String mortTxt : mortgageList) {
					String[] temp = mortTxt.split("을부번호 : ");
					String temp2 = temp[0].replace("저당설정 구분 : ", "");
					
					for(Map<String, Object> map : slaveList) {
						String EbNo = (String) map.get("EbNo");
						
						if(temp[1].equals(EbNo)) {
							map.put("mortgageType", temp2);
							break;
						}
					}
				}
			}
			
			/*******************************************************************************************************************************************************
			 * 																																					   *
			 * 														TO_DO.																						   *
			 * 											소유권이전요청 전문호출 전에, 소유권 이전불가 케이스 카방 api에서 주기로함														   *
			 *  										소유권 이전 가능 여부, 사유txt 화면에 보내야함																			   *		
			 * 																																					   *
			 *******************************************************************************************************************************************************/
			
			// 이전신청 가능시간대 조회
			//Map<String, Object> reqDateMap = TOMapper.selectAskDateInfo();
			List reqDateList = TOMapper.selectAskDateInfo();
			Map<String, Object> reqDateMap = (Map<String, Object>)reqDateList.get(0);
			String reqDtpsbYn =  (String) reqDateMap.get("transferPsblYn");
			
			if("Y".equals(transferPsblYn) && "N".equals(reqDtpsbYn)) {
				transferPsblYn = reqDtpsbYn;
				transferPsblMsg = "이전신청 가능한 시간이 아닙니다.";
			}
			
			rtnmap.put("transferPsblYn", transferPsblYn);	// 이전가능여부
			rtnmap.put("transferPsblMsg", transferPsblMsg);	// 이전불가능 사유
			rtnmap.put("seizeList", seizeList);				// 압류/촉탁내역
			rtnmap.put("structCngList", structCngList);		// 구조변경내역
			rtnmap.put("useCngList", useCngList);			// 용도변경내역
			rtnmap.put("carInfoDetail", carInfoDetail);		// 차량 상세정보
			rtnmap.put("mortgageList", slaveList);			// 근저당설정내역
			rtnmap.put("carRstAllList", masterList);		// 전체내역
			
			
			
			model.addAttribute("carDetailInfo", rtnmap);
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
	/************************************************ 차량분석 끝 ************************************************/
	
	
	
	/************************************************ 소유권이전 등록/수정 시작 ************************************************/
//	1. 카카오페이 인증 호출(양수인/양도인 여부 파람값 필요, 양수인/양도인 param다르게 컨트로러는 동일하게 사용) -- 이시점에 소유권이전 최초등록
	@RequestMapping(value = "/TOM_52/mobile/sendKakaoCert.do")
	@Transactional(propagation = Propagation.REQUIRED, rollbackFor = {Exception.class})
	public View sendKakaoCert(@RequestParam Map<String, Object> mocaMap, ModelMap model,HttpServletRequest request) throws Exception {
		try {
			toService.sendKakaoCert(mocaMap,model, request);
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
	    
		return jsonview;
	};
	
	@RequestMapping(value = "/TO_000P01/exeTs1100.do")
	@Transactional(propagation = Propagation.REQUIRED, rollbackFor = {Exception.class})
	public View exeTs1100(@RequestParam Map<String, Object> mocaMap, ModelMap model,HttpServletRequest request) throws Exception {
		Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
		try {
			Map tsResult = toService.exeTs1100(paramMap);
			model.addAttribute("tsResult", tsResult);
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
		return jsonview;
	}
		
		
	@RequestMapping(value = "/TOM_83/mobile/requestTs.do")
	@Transactional(propagation = Propagation.REQUIRED, rollbackFor = {Exception.class})
	public View requestTs(@RequestParam Map<String, Object> mocaMap, ModelMap model,HttpServletRequest request) throws Exception {
		Map hisMap = new HashMap();
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			LOGGER.debug("param[/TOM_83/mobile/requestTs.do] ======================================================================="+paramMap);
			/*TS에 보낼 전문파라미터를 가져옴 */
			Map tsMap = toService.getMapForTs(paramMap,request);
			tsMap.put("REQST_SE_CODE", "1100");
			
			
			ToUserVO userVo = (ToUserVO)request.getSession().getAttribute("userInfo");
			hisMap.put("TsParams", tsMap.toString());
			hisMap.put("idx", (String) paramMap.get("idx"));
			hisMap.put("REQST_SE_CODE",(String) tsMap.get("REQST_SE_CODE"));
			hisMap.put("REQST_RCEPT_NO",(String) tsMap.get("REQST_RCEPT_NO"));
			hisMap.put("registerId",userVo.getIdx());
			hisMap.put("TsRequestYn","N");
			TOMapper.insertTsHis(hisMap);
			Thread.sleep(500);
			hisMap.put("TsRequestYn1100","N");
			hisMap.put("TsParams1100",tsMap.toString());
			TOMapper.updateToForTs(hisMap);
			
			Map<String, Object> mapTimeCheck = TOMapper.selecIsTimeOnForTORequest(paramMap);
			String IsTimeOn = (String)mapTimeCheck.get("IsTimeOn");
			if("1".equals(IsTimeOn) ) {
				Map responseMap = toService.sendRequestTs(tsMap);////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// TS발송!!!
				String PROCESS_IMPRTY_RESN_CODE = (String)responseMap.get("PROCESS_IMPRTY_RESN_CODE");
				String PROCESS_IMPRTY_RESN_DTLS = (String)responseMap.get("PROCESS_IMPRTY_RESN_DTLS");
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
				String error_type = "";
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
						error_type = "212";//이전신청오류
					}
				};
				
				if("02".equals(PROCESS_IMPRTY_RESN_CODE)){//오류
					paramMap.put("Stage", error_type);//고객정보오류,인증오류,이전신청오류
					TOMapper.updateToTransferOwnerStage(paramMap);
				}
				if(paramMap.get("idx") == null || "".equals(paramMap.get("idx"))) {
					paramMap.put("idx",paramMap.get("TransferOwnerIdx"));
				}
				
				model.addAttribute("PROCESS_IMPRTY_RESN_CODE",PROCESS_IMPRTY_RESN_CODE);
				model.addAttribute("PROCESS_IMPRTY_RESN_DTLS",PROCESS_IMPRTY_RESN_DTLS);
				hisMap.put("TsRequestYn","Y");
				hisMap.put("TsResponse",responseMap.get("TsResponse1100"));
				TOMapper.insertTsHis(hisMap);
				Thread.sleep(500);
				responseMap.put("idx",hisMap.get("idx"));
				responseMap.put("TsRequestYn1100","Y");
				responseMap.put("TsParams1100", "");
				LOGGER.debug(">>>>>>>>>>>>>>>>>>"+responseMap); 
				TOMapper.updateToForTs(responseMap);
			}
			model.addAttribute("transferownerId", paramMap.get("TransferOwnerIndex"));
			
		}catch(Exception e) {
			e.printStackTrace();
			Map responseMap = new HashMap();
			responseMap.put("TsRequestYn1100","E");
			responseMap.put("TsResponse1100",e.getMessage());
			responseMap.put("TsParams", "");
			TOMapper.updateToForTs(responseMap);
			hisMap.put("TsRequestYn1100","E");
			hisMap.put("TsResponse1100",e.getMessage());
			TOMapper.insertTsHis(hisMap);
			model.addAttribute("error", e.getMessage());
		}
	    
		return jsonview;
	}
	
//	2. 카카오페이 인증상태 조회
//		- 인증요청 후 화면에서 status 값이 COMPLETE 으로 올 때까지 5초에 한번 호출
	@RequestMapping(value = "/TOM_52/mobile/getKakaoCertStatus.do")
	public View getKakaoCertStatus(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			
			String CertificationId = (String) paramMap.get("tx_id");	// 카카오페이 인증 접수번호
			String status = "";	// 서명 상태값
			
			// ================================= 임시 조회용 값 set 시작 ================================= //
			if(StringUtils.isEmpty(CertificationId)) CertificationId = "ba6614373f5b498488b4e3e7cfb4e572";
			
			paramMap.put("tx_id", CertificationId);
			// ================================= 임시 조회용 값 set 끝 ================================= //
			
			/*******************************************************************************************************************************************************
			 * 											카카오페이 인증상태 조회 																					   		*
			 *******************************************************************************************************************************************************/
			/*
			Map mocaMap = new HashMap();
			mocaMap.put("header", request.getParameter("header"));
			mocaMap.put("body", request.getParameter("body"));
			Map paramMap = mocaframework.com.cmm.U.getBodyNoSess(mocaMap);
			LOGGER.debug("userInfo:"+session.getAttribute("userInfo"));
			 */
			
			String result = TOUtil.getKakaoCertStatus(paramMap).toString();
			
			LOGGER.debug("##################################################");
			LOGGER.debug("result ::: "+result);
			LOGGER.debug("##################################################");
			
			/*******************************************************************************************************************************************************
			 * 											카카오페이 인증상태 조회 																					   		*
			 *******************************************************************************************************************************************************/
			// 인증요청 후 넘어온 결과값 parsing
			Gson gson = new Gson();
			Map<String,Object> parseMap = new HashMap<String,Object>();  
			parseMap = (Map<String,Object>) gson.fromJson(result, Map.class);
			
			Map<String,Object> temp1 = (Map<String,Object>) parseMap.get("data");
			if(temp1 != null) {
				List<Map<String,Object>> temp2 = (List<Map<String,Object>>) temp1.get("signed_data");
				parseMap = (Map<String,Object>) temp2.get(0);
				status = (String) parseMap.get("status");
			}

			
//			서명 처리상태를 rstCd에 담는다
//			서명 처리상태는 res 데이터의 signed_data=[ {status : "" } ] 안에 담겨있음
//			status 각 상태값
//				- PREPARE : 대기중 - 서명을 요청한 상태
//				- COMPLETE : 서명완료 - 비밀번호를 정확히 입력하여 서명을 완료한 상태
//				- EXPIRED : 타임아웃 - 처리마감시간동안 서명을 완료하지 않은 상태
//			
			
			
			model.addAttribute("CertificationId", CertificationId);
			model.addAttribute("status", status);
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
	
		return jsonview;
	}
	
//	3. 카카오페이 검증호출(양수인/양도인 여부 파람값 필요)
//		- 5초에 한번 상택값을 호출하므로... 상태조회 후 완료 시 바로 검증 호출하면 상태조회 중복호출 위험이 있어 검증을 따로 뺌(서명상태 5초에 한번 조회-->카방요청사항)
//		- 검증은 최초1회밖에 안되므로  ts측에서 검증을 한다고 결정되면 검증 프로세스 제외 해야함. 아직 TS측에서 응답오지 않음.12.08 임시.
//		- 양도/양수인 인증 파람값에 따라 각 테이블 업데이트, 소유권이전 상태값 업데이트
//		- 인증실패 시 양도/양수인 인증 파람값에 따라 각 테이블 업데이트, 소유권이전 상태값 업데이트
	@RequestMapping(value = "/TOM_52/mobile/sendKakaoCertVerify.do")
	public View sendKakaoCertVerify(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			toService.certVerify(paramMap);
			model.addAttribute("result", paramMap);
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
	
		return jsonview;
	}


	
//	4. 양수/양도인 카카오페이 인증성공(= ts이전신청)
//		- 양수/양도인 둘다 정상 인증 성공 시 호출 
//		- KTNET 수입인지 발행
//		- TS이전신청요청 전문 발송
//		- 소유권이전신청 전문 응답값 포함(양수/양도인 정보오류 포함)
	@RequestMapping(value = "/TOM_52/mobile/sendTsTransferReq.do")
	public View sendTsTransferReq(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			
			String Stage = "10";	// 고객미결제, TS확정비용 미수신 상태
			String idx = (String) paramMap.get("idx");	// 소유권이전 idx (화면에서 보내야함)
			
			// 임시 조회용 값 set
			if(StringUtils.isEmpty(idx)) {
				idx = "50";
				paramMap.put("idx", "50");
			}
			
			// 수입인지 미사용 계약번호 조회
			Map<String, Object> etcInfosMap = TOMapper.selectToEtcInfos();

			if(etcInfosMap == null) {
				throw new Exception("구매된 수입인지 내역이 없습니다. 수입인지 구매 후 다시 시도해주세요.");
			}
			
			// $user_data2 = array("contractTitle" => "test","contractDate" => "20190903","contractNo" => $ets_no,
			// "contractAmount" => "3000","contractType" => "040","subSerialNo" => $carbodynum,"subIssueAmount" => "3000",
			// "contractFilePath" => "data/ets/".$contractFilePath,"source" => "data/pre/".$contractFilePath2);
			
			long etcInfosId = (long) etcInfosMap.get("ID");							// 수입인지 id
			int contractAmount = (int) etcInfosMap.get("AMOUNT");					// 구매금액
			String contractNo = (String) etcInfosMap.get("NO");						// 계약번호
			String contractTitle = "카방수입인지발행";									// 계약명
			String contractDate = (String) etcInfosMap.get("CREATED_AT");			// 계약체결일
			String contractType = "040"; 											//계약 타입
			boolean isNextProc = true;
			
			String contractFilePath2 = "";	// 양도증명서 원본파일 경로
			String contractFilePath = "";	// 양도증명서 스탬프 찍힌 버전 경로
			
			// 수입인지 구매금액이 1회 발행 금액인 3천원보다 작으면 예외처리
			if(contractAmount < 3000) {
				throw new Exception("수입인지 구매 금액이 발행금액보다 작습니다. 수입인지 구매 후 다시 시도해 주세요");
			}
			
			
			// 수입인지 자동구매는 무조건 3천원, 구매금액이 3천원일 경우 구매금액 남아있는 api 호출 시 KTNET에서 응답값을 안주기로함.
			// 3천원 이상일 경우만 구매금액 남았는지 조회처리
			// 수동구매도 3천단위로 구매예정(운영).. 아래 프로세스는 사용하지 않을듯함. 우선 구현
			if(contractAmount > 3000){
				etcInfosMap.put("sContractNoSeq", "1");	// 계약차수. 1로 하드코딩. (수입인지 구매금액 남았는지 조회를 위해 set 하는 값임)
				
				// 수입인지 구매금액 남았는지 확인 호출
				String jsonStr = Util.curl(Globals.URL_API_NEWISSUECFRMPAYLISTEXAMPLE, etcInfosMap);
				
				Document doc = Jsoup.parseBodyFragment(jsonStr);
				doc.removeAttr("head");
				Element body = doc.body();
				String tmp2 = body.text();
				
				tmp2 = tmp2.substring(tmp2.indexOf("{"), tmp2.lastIndexOf("}")+1);
				tmp2 = tmp2.replaceAll("=", ":");
				
				Map<String, Object> resultMap = Util.getMapFromJsonString(tmp2);		// 결과값 json -> map 변환
				
				String taxamount_str = (String)resultMap.get("taxamount");
				int taxamount = Integer.parseInt(taxamount_str);
				
				List subPaymentResultList;
				Object obj = resultMap.get("subPaymentResultList");
				
				if(obj.getClass().getName().equals("java.lang.String")) {
					subPaymentResultList = new ArrayList();
				}else {
					subPaymentResultList = (List)resultMap.get("subPaymentResultList");
				}
				
				int ets_sum = 3000;
				
				if(taxamount > 0) {
					for(int i=0;i < subPaymentResultList.size(); i++) {
						Map row = (Map)subPaymentResultList.get(i);
						String subIssueAmount_str = (String)row.get("subIssueAmount");
						int subIssueAmount = Integer.parseInt(subIssueAmount_str);
						ets_sum +=subIssueAmount;
					}
					if(taxamount < ets_sum) {
						isNextProc = false;
					}
				}
			}
			
			// 수입인지 발행 가능한 상황에서만 양도증명서 pdf생성 후 수입인지 발행 -> 이전신청 프로세스 진행
			if(isNextProc) {
				
				// 양도증명서 생성을 위한 소유권이전 상세 조회
				Map<String, Object> transferMap = TOMapper.selectToTransferOwner(paramMap);
				
				if(transferMap == null) {
					throw new NullPointerException("소유권이전 데이터가 없어 이전신청을 할 수 없습니다.");
				}
				
				//양도증명서원문pdf생성을 위한 filePath 및 html 생성
				Map param = new HashMap();
				contractFilePath2 = Util.getYangdouOriFileNameFullPath(idx, transferMap);	// 양도증명서 원본파일 경로
				contractFilePath = Util.getYangdouStampFileNameFullPath(idx, transferMap);	// 양도증명서 스탬프 찍힌 버전 경로

				
				param.put("pdfPwd", contractFilePath2);							// 양도증명서 원본 파일경로 
				param.put("html", Util.makeDigitallySignOriHtml(transferMap));	// 양도증명서 html
				
				
				// 양도증명서 원본/스탬프 pdf 생성 (수입인지 발행 전 원본/스탬프 두 파일을 생성해야지 수입인지 발행이 가능함)
				Util.htmlToPdf(param);
				
				param.put("pdfPwd", contractFilePath);							// 양도증명서 스탬프 파일경로
				Util.htmlToPdf(param);
				
				contractFilePath2 = contractFilePath2.replaceAll("/home/ubuntu/TO/apache-tomcat-9.0.39/webapps/ets-hub-connect-window/", ""); // 양도증명서 원문 파일경로 (data/pre/TO_50_basic.pdf)
				contractFilePath = contractFilePath.replaceAll("/home/ubuntu/TO/apache-tomcat-9.0.39/webapps/ets-hub-connect-window/", ""); // 양도증명서 원문 파일경로 (data/pre/TO_50_basic.pdf)
				
				// 수입인지 발행을 위한 값 SET
				// 양도증명서 PDF 발행 후  파일명만 잘라서 contractFilePath에 더하기 >>> contractFilePath = contractFilePath + "파일명.pdf"
				transferMap.put("contractAmount", contractAmount);
				transferMap.put("contractNo", contractNo);
				transferMap.put("contractTitle", contractTitle);
				transferMap.put("contractDate", contractDate);
				transferMap.put("contractType", contractType);
				transferMap.put("contractFilePath2", contractFilePath2);
				
				// 수입인지 발행 후 양도증명서 스탬프 찍힌 버전 파일경로
//				String contractFilePath = Util.getYangdouStampFileNameFullPath(idx, transferMap);	// 수입인지 발행 후 양도증명서 파일경로
				
				transferMap.put("subSerialNo",(String) transferMap.get("ChassisNumber") );
				transferMap.put("subIssueAmount",  "3000");
				transferMap.put("contractFilePath", contractFilePath);	// 발행 후 양도증명서 경로
				transferMap.put("source", contractFilePath2);			// 발행 전 양도증명서 원본파일 경로
				
				LOGGER.debug("===============before 양도증명서 경로 :: " + contractFilePath2);
				LOGGER.debug("===============after 양도증명서 경로 :: " + contractFilePath);
				
				LOGGER.debug("===============transferMap :: "+transferMap);
				
				
				// 수입인지 발행 호출.
				String jsonStr_stampResult = Util.curl(Globals.URL_API_TOOLKITISSUECHANGEEXAMPLE, transferMap);
				
				LOGGER.debug("===============jsonStr_stampResult :: "+jsonStr_stampResult);
				
				Document doc = Jsoup.parseBodyFragment(jsonStr_stampResult);
				doc.removeAttr("head");
				Element body = doc.body();
				String tmp = body.text();
				
				tmp = tmp.substring(tmp.indexOf("{"), tmp.lastIndexOf("}")+1);
				tmp = tmp.replaceAll("=", ":");
				
				Map<String, Object> resultStampMap = Util.getMapFromJsonString(tmp);
				
				LOGGER.debug("수입인지 발행 호출 후 resMap	:::" + resultStampMap);
				
				String resultCode = (String)resultStampMap.get("resultCode");
				
				if("900".equalsIgnoreCase(resultCode)) {
					// 수입인지 발행 결과코드가 900(정상)이면 사용한 계약번호 구매금액 업데이트
					TOMapper.updateToEtcInfos(etcInfosMap);
				} else {
					throw new Exception("수입인지 발행 중 오류가 발생했습니다. 다시 시도해 주세요");
				}
				
				// 임시. 수입인지 발행 관련 항목 화면 return
				model.addAttribute("resultStampMap", resultStampMap);
				model.addAttribute("resultCode", resultCode);
				
				
			} else {
				throw new Exception("수입인지 구매 금액이 발행금액보다 작습니다. 수입인지 구매 후 다시 시도해 주세요");
			}
			
			
			/*************************************************************************************************
			 * 																								*
			 * 											TO_DO												*
			 * 										TS 이전신청전문 발송											*
			 * 								(TS 호출 테스트는 1월초 가능 req 값만 정의해두기)								*
			 * 																								*
			 *************************************************************************************************/
			
			
			// 이전신청 전문 발송 오류 시 Stage = "6" (고객미결제 후, 오류로 이전신청전문 미발송 상태)
			// 이전신청 전문 발송 후 응답값으로 고객정보 오류 외 오류코드가 올 경우 Stage = "7" (고객미결제, 이전신청전문 발송 후 기타오류코드 응답받은 상태 고객정보오류 외 전문발송오류, 또는 기타 처리불가 상태오류 등 기타 오류 시 상태값 추가 필요)
			// 이전신청 전문 발송 후 응답값으로 고객정보 오류가 올 경우 Stage = "9" (고객미결제, 이전신청전문 수신값으로 고객정보 오류코드 온 상태.)
			// 이전신청전문 발송 후 응답값 미수신 상태 시 Stage = "8" ==> 응답값은 바로 오므로.. timeOut 오류 발생 시 8로 처리 후 종료. (고객미결제, 이전신청전문 발송 후 응답값 미수신 상태)
			// 정상 응답이 떨어질 경우 Stage = "10"	// 고객미결제 비용미확정 (TS확정비용 미수신 상태)
			
			// 전문 응답값 상태 코드가 정상이 아닐 경우 소유권이전 코드관리(TO_TRANSFER_CODE_MNG) 테이블에서 해당 상태값 조회
			// 재인증 수행을 하지 않기 위해 고객정보 오류 상태일 때 소유권이전 idx 값을 화면에서 넘겨줌 ===> 고객이 양도/양수인 정보 재입력 후 카카오페이 인증 호출 시 화면에서 idx를 같이 보내야함. 
			// (idx로 소유권이전 인증상태 확인 후 최초1회 인증 이후라면 다시 인증없이 ts 이전신청 전문 발송 처리)
//			paramMap.put("rstCd", rstCd);
//			Map<String, Object> codeMap = TOMapper.selectTsCode(paramMap);
//			String errCd = (String) codeMap.get("ErrCode");
//			String ErrTxt = (String) codeMap.get("ErrTxt");
			
//			model.addAttribute("rstCd", errCd);
//			model.addAttribute("ErrTxt", ErrTxt);

			
			
			// 2021.01.22 TS 전문발송 미정의 상태이므로, 우선 TS정상응답이 왔다고 생각하고 이후 프로세스 진행하도록 구현.
			
			paramMap.put("Stage", Stage);
			paramMap.put("updateTsDtYn", "Y");
			paramMap.put("ContractImage", contractFilePath);
			
			// 소유권이전 상태값 update
			TOMapper.updateToTransferOwnerStage(paramMap);
			model.addAttribute("result", paramMap);	// TS 전문응답값 화면전송
			
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
		
		return jsonview;
	}




//	5. 이전비용 조회
	@RequestMapping(value = "/TOM_61/mobile/transferPrice.do")
	public View selectTransferPriceJson(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			toService.insertTO_COST(mocaMap, model);
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}


	
//	6. 소유권이전 취소
	@RequestMapping(value = "/TOM_60/mobile/cancelTransferOwner.do")
	public View cancelTransferOwner(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			String idx = (String) paramMap.get("idx");
			String StageGubun = (String) paramMap.get("Stage");
			
			
			
			String rePayResYn = "N";					// 응답호출여부(고객환불시에는 송금이체 응답여부를 호출해야함) 
			
			int currentStage = 0;
			String Stage = "26";	// 소유권이전 고객취소
			if(StageGubun != null) {
				Stage = StageGubun;//126 소유권이전 운영자취소
			}
			
			// 소유권이전 현재 상태값 조회(left outer join TO_USER_PAYMENT_INFO 고객결제정보)
			Map<String, Object> trnsOwner = TOMapper.selectToTransferOwner(paramMap);
			
			int tempStage = (int) trnsOwner.get("Stage");
			if(tempStage > 0) {
				currentStage = tempStage;
			}
			
			// 현재 상태가 결제준비중 이상 상태라면 취소 불가능
			if(currentStage == 26) {
				throw new Exception("이미취소되었습니다.[Stage"+currentStage+"]");		
			}else if(currentStage != 15 && currentStage != 24 && currentStage > 13) {
				throw new Exception("취소가 불가능한 상태입니다.[Stage"+currentStage+"]");
			} else {
				// 고객 결제 데이터가 있다면 환불처리
				int rtnPrice = Integer.parseInt((String) trnsOwner.get("CarbangBank_Price"));
				
				if(rtnPrice > 0) {
					Map<String, Object> payReqMap = new HashMap<String, Object>();
					
					SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
					String reqDt = sdf.format(new Date());
					payReqMap.put("reqDt", reqDt);		// 요청일자
					
					payReqMap.put("Pay_type", "3");													// 결제구분 (1: 고객-카방, 2: 카방-공단, 3: 카방-고객)
					payReqMap.put("TransferOwnerIndex", paramMap.get("idx"));
					
					Map bankInfo = TOMapper.selectCarbangBankInfo(paramMap);
					payReqMap.put("bankCd", bankInfo.get("bankCd"));													// 출금은행코드
					payReqMap.put("bankNm", bankInfo.get("bankNm"));												// 출금은행명
					payReqMap.put("accountNo", bankInfo.get("accountNo"));									// 출금은행계좌
					payReqMap.put("bankOwner", bankInfo.get("bankOwner"));											// 출금계좌예금주
					
					
					
					
					payReqMap.put("bank_deposit_owner", trnsOwner.get("Customer_Bank_Owner"));		// 입금계좌주
					payReqMap.put("bank_deposit_cd", trnsOwner.get("Customer_Bank_Cd"));			// 입금은행코드
					payReqMap.put("bank_deposit_name", trnsOwner.get("Customer_Bank_Name"));		// 입금계좌명
					payReqMap.put("bank_deposit_account", trnsOwner.get("Customer_Account"));		// 입금계좌번호
					
					
					
					payReqMap.put("traceNo", "");													// 납부자번호 (비동기 전문수신이므로 납부자번호 없음. 추후 넣을 수 있는지 확인)
					payReqMap.put("userIdx", "admin");												// 사용자id
					payReqMap.put("payAmount", rtnPrice);											// 출금금액
					payReqMap.put("payComnt", "고객취소환급");											// 출금통장적요
					payReqMap.put("depositComnt", "고객취소환급");										// 입금통장적요
					
					// 결제 공통부 전문을 생성한다.
					LOGGER.debug("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
					
					payReqMap.put("sendType", "7"); //송금이체
					String cmmStr = toService.setKsnetCmmArea(payReqMap);
					LOGGER.debug(cmmStr);
					LOGGER.debug("공통부 길이"+cmmStr.length());
					
					// 계좌등록 개별부 전문을 생성한다.
					String individualStr = toService.setKsnetRemittanceArea(payReqMap);
					LOGGER.debug(individualStr);
					LOGGER.debug("개별부 길이"+individualStr.length());
					LOGGER.debug("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
					
					String fullMsg = cmmStr + individualStr;
					LOGGER.debug("전체전문 길이"+fullMsg.length());
					
					// 전문 테이블 insert를 위한 값 set
					payReqMap.put("compCode", "CARBANG1");	// 송금업체코드
					payReqMap.put("msgCode", "0100100");	// 송금이체
					payReqMap.put("sendMsg", fullMsg);		// 요청전문
					
					//[결제1:이전취소환불처리] 즉시이체 전문 insert
					int cnt = toService.insertTradeRequestBin(payReqMap);
					if(cnt > 0) {
						// ksnet 데몬이 실시간 요청을 확인하여 응답값을 업데이트 해주지만, 
						// 한 서비스 내에서 insert->update 체크 시 너무 여러번 조회를 하여 lock이 발생할 수 있어 전문insert/전문업데이트 조회를 서비스를 나눴음
						paramMap.putAll(payReqMap);
						paramMap.put("reply", "0000");
						model.addAttribute("resMap", paramMap);
						rePayResYn = "Y";
					}
					if("126".equals(StageGubun)) {
						payReqMap.put("payComnt", "운영자취소환급");											// 출금통장적요
						payReqMap.put("depositComnt", "운영자취소환급");										// 입금통장적요
						boolean flag = false;
						for(int i=0; i < 10; i++) {
							Map<String, Object> resMap = TOMapper.selectTradeRequestBin(payReqMap);
							if(payReqMap.get("TransferOwnerIdx") != null && "".equals(payReqMap.get("TransferOwnerIdx").toString())) {
								payReqMap.put("idx", payReqMap.get("TransferOwnerIdx"));
							}
							String rcvFlag = (String) resMap.get("RECV_FLAG"); // 응답구분 (Y:응답완료, F:실패, N:응답대기중)
							model.addAttribute("rcvFlag", rcvFlag);
							if("Y".equals(rcvFlag)) {
								flag = true;
								String resStr = (String) resMap.get("RECV_MSG"); 	// 응답전문내용
								String resCd = resStr.substring(51, 55);			// 공통부 은행응답코드
								LOGGER.debug("resCd	::: "+resCd);
								payReqMap.put("resCd", resCd);
								model.addAttribute("resCd", resCd);
								// 등록이 정상 처리가 됐으면 고객결제 히스토리정보 테이블 insert
								if("0000".equals(resCd)) {
									paramMap.put("Pay_type", "3");// 결제구분 (1: 고객-카방, 2: 카방-공단, 3: 카방-고객)
									payReqMap.put("Bank_Deposit_Account", trnsOwner.get("Customer_Account"));// 입금계좌번호
									TOMapper.insertToPaymentHistory(payReqMap);
								} else {
									Stage = "24";	// 고객결제오류
								}
								break;
							} else if("F".equals(rcvFlag) || "T".equals(rcvFlag)) {
								flag = true;
								Stage = "24";	// 고객결제오류
								break;
							}
							Thread.sleep(2000);
						}
						paramMap.put("Stage", "226"); //운영자취소로 환급될때
					}else {
						paramMap.put("Stage", "17"); //고객취소로 환급될때
					}
					// 소유권이전 상태값 업데이트
					TOMapper.updateToTransferOwnerStage(paramMap);
				} else {
					paramMap.put("Stage", Stage);
					// 소유권이전 상태값 업데이트
					TOMapper.updateToTransferOwnerStage(paramMap);
				}
				model.addAttribute("rePayResYn", rePayResYn);
			}
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
	// 소유권이전취소 환불 응답
	@RequestMapping(value = "/TOM_81/mobile/receiveCancelTransferOwner.do")
	public View receiveCancelTransferOwner(@RequestParam Map<String, Object> mocaMap, HttpServletRequest request, ModelMap model) throws Exception {
		
		try {
				
			boolean flag = false;
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			ToUserVO userVo = (ToUserVO)request.getSession().getAttribute("userInfo");
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			
			paramMap.put("TransferOwnerIdx", paramMap.get("idx"));
			paramMap.put("Pay_type", "3");
			paramMap.put("bankNm", "케이뱅크");												// 출금은행명
			paramMap.put("bankCd", "089");													// 출금은행코드
			paramMap.put("accountNo", "70110000000522");									// 출금은행계좌
			paramMap.put("bankOwner", "(주)카방");											// 출금계좌예금주
			paramMap.put("bank_deposit_owner", paramMap.get("Customer_Bank_Owner"));		// 입금계좌주
			paramMap.put("bank_deposit_cd", paramMap.get("Customer_Bank_Cd"));				// 입금은행코드
			paramMap.put("bank_deposit_name", paramMap.get("Customer_Bank_Name"));			// 입금계좌명
			paramMap.put("bank_deposit_account", paramMap.get("Customer_Account"));			// 입금계좌번호
			paramMap.put("traceNo", "");													// 납부자번호 (비동기 전문수신이므로 납부자번호 없음. 추후 넣을 수 있는지 확인)
			paramMap.put("userIdx", "admin");												// 사용자id
			paramMap.put("payAmount", paramMap.get("payAmount"));							// 출금금액
			paramMap.put("payComnt", "고객취소환급");											// 출금통장적요
			paramMap.put("depositComnt", "고객취소환급");										// 입금통장적요
			
			
			String Stage = "26";	// 소유권이전 고객취소
			
			Map<String, Object> resMap = TOMapper.selectTradeRequestBin(paramMap);
				
			String rcvFlag = (String) resMap.get("RECV_FLAG"); // 응답구분
			
			if("Y".equals(rcvFlag)) {
				flag = true;
				
				String resStr = (String) resMap.get("RECV_MSG"); 	// 응답전문내용
				String resCd = resStr.substring(51, 55);			// 공통부 은행응답코드 
				
				LOGGER.debug("resCd	::: "+resCd);
				model.addAttribute("resCd", resCd);
				
				// 등록이 정상 처리가 됐으면 고객결제정보 테이블 insert
				if("0000".equals(resCd)) {
					TOMapper.insertToPaymentHistory(paramMap);
					Stage = "17";		// 환급(취소)	17	고객취소 전체환급
					model.addAttribute("resMsg", "취소 후 환급처리가 완료되었습니다.");
				} else {
					Stage = "22";	// 환급오류	
				}
			} else if("F".equals(rcvFlag) || "T".equals(rcvFlag)) {	// fale or timeout
				flag = true;
				Stage = "22";	// 환급오류 
			}
				
			model.addAttribute("rcvFlag", rcvFlag);
			
			if(!"N".equals(rcvFlag)) {
				paramMap.put("Stage", Stage);
				// 소유권이전 상태값 업데이트
				TOMapper.updateToTransferOwnerStage(paramMap);
			}
			
		} catch (Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
		
		return jsonview;
		
	}
	
//[TS에서받기]
//[스케쥴]
//	7. TS 비용확정 전문 수신
//	- 전문수신 후 소유권이전 금액정보(TO_TRANSFEROWNER_COST) 데이터 업데이트
//	- 전문수신 후 소유권이전 상태 업데이트
	@RequestMapping(value = "/mobile/reciveTransferOwnerPriceTs.do")
	public void reciveTransferOwnerPriceTs(HttpServletRequest req, HttpServletResponse res,String _jsp_xml) throws Exception {
		try {
			
			toService.exeTsStep1(req, _jsp_xml);
		}catch(Exception e) {
			e.printStackTrace();
		}
	}
//	8. ts 이전요청결과 전문 수신
//		- 전문수신 후 소유권이전 상태 업데이트
	@RequestMapping(value = "/mobile/reciveTransferOwnerRstTs.do")
	public void reciveTransferOwnerRstTs(HttpServletRequest req, HttpServletResponse res) throws Exception {

	}

//	9. ts 이전요청결과 조회
//		- 사용하지 않을 것 같지만 우선 구현해둘 예정. 이전신청 결과 전문 수신과 별개로 현재 상태 조회를 위해 ts 호출.
	@RequestMapping(value = "/mobile/getTransferOwnerRstTs.do")
	public View getTransferOwnerRstTs(HttpServletRequest req, HttpServletResponse res) throws Exception {
		try {
			
			/*************************************************************************************************
			 * 																								*
			 * 											TO_DO												*
			 * 									ts 이전요청결과 조회 전문발송											*
			 * 																								*
			 *************************************************************************************************/
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return jsonview;
	}
	
	/************************************************ 소유권이전 등록/수정 끝 ************************************************/
	
	
	
	/************************************************ 결제 시작 ************************************************/
	
//	------------------- 제외 시작 -------------------
//	* 1원송금 진행 (제외처리. ars인증과 1원송금 인증 중 하나만 선택하는 건데 개인소유권 이전에서는 ars 인증 처리를 진행하기로 함)
//		>> 1원송금 시 출금이체. 집금이체 전문 호출하는건지 (0100/501)
//		>> 그렇다면, 출금계좌는 카방, 입금계좌는 고객이 되는건지 확인요청 
//		>> 1원송금 시 입금통장 적요에 인증번호 채번하여 보내야함.
//		>> 인증번호 채번은 그냥 랜덤숫자인지 확인.
//		>> 채번한 번호는 세션에 담아두기
//	* 1원송금 확인 (제외처리. ars인증과 1원송금 인증 중 하나만 선택하는 건데 개인소유권 이전에서는 ars 인증 처리를 진행하기로 함)
//		>> 2에서 입금내용에 보낸 인증번호 화면에서 입력
//		>> 입력한 번호와 세션의 번호 확인
//	------------------- 제외 끝 -------------------	
	
	
	
	
//	결제 비밀번호 입력(서비스 대상 아님. 결제계좌 등록 완료 시 고객 결제정보에서 한번에 insert)
//	생성대상 테이블 : 고객 결제정보, 고객/카방/환불 결제 히스토리 테이블	

//	=== 계좌등록 시작 ===
//	1. 계좌인증(ARS FCS계좌인증 모듈 호출)
	@RequestMapping(value = "/TOM_68/mobile/accountAuth.do")
	public View accountAuth(@RequestParam Map<String, Object> mocaMap, ModelMap model, HttpServletRequest request) throws Exception {
		
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			
			// 테스트계에서는 테스트계좌 생년월일이 필요하므로 임시로 화면에서 보냄.
			// 추후 운영 반영시에는 userVo에서 로그인 사용자 생년월일을 가지고 계좌인증을 진행함.
			String id_no = (String) paramMap.get("id_no");

			if(StringUtils.isEmpty(id_no)) {
				ToUserVO userVo = (ToUserVO)request.getSession().getAttribute("userInfo");
				id_no = userVo.getBirthDate().replaceAll("-", "");
				id_no = id_no.substring(2,id_no.length());
				paramMap.put("id_no", id_no);			// 신원확인번호 6자리
			}
			
			// ================================= 임시 조회용 값 set 시작 ================================= //
			// 은행별로 실계좌 테스트가 가능 여부가 다름. 우리은행쪽 실계좌로는 테스트 불가했으며 ksnet측에 연락하여 넘겨받은 계좌로 정상동작 확인. 
			// 아래 테스트 계좌인 신한은행은 실계좌로도 테스트 가능함
			if(StringUtils.isEmpty((String)paramMap.get("bank_cd"))) {
/*				paramMap.put("bank_cd", "088");				// 은행코드(신한)
				paramMap.put("acct_no", "110457699600");	// 계좌번호
				paramMap.put("bankOwner", "김유리");	// 계좌번호
*/			}
			
			// ================================= 임시 조회용 값 set 끝 ================================= //
			
			Map<String, String> accountResMap = TOUtil.ksNetAccountAuth(paramMap);
			String reply = accountResMap.get("reply");
			String reqBankOwner = (String) paramMap.get("bankOwner");
			String resBankOwner = accountResMap.get("name");

			if("0000".equals(reply) && !resBankOwner.equals(reqBankOwner)) {
				accountResMap.put("reply", "9999");
				accountResMap.put("reply_msg", "예금주가 다릅니다. 다시 확인해주세요.");
			}
			
			model.addAttribute("accountResMap", accountResMap); 
			
		} catch (Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
		
		return jsonview;
	}
	
//	2. 본인인증 요청(ARS 본인인증 모듈호출)
//		>> ARS 자동이체동의 (이통사인증 + 점유) 모듈 중 1 이통사 인증요청 호출
//		>> 인증 성공 시 (reply : 0000) 사용자가 ars에 입력할 번호 채번 및 화면리턴
	@RequestMapping(value = "/TOM_74/mobile/verifyOneself.do")
	public View verifyOneself(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			
			// ================================= 임시 조회용 값 set 시작 ================================= //
			if(StringUtils.isEmpty((String)paramMap.get("phoneno"))) {
				paramMap.put("phoneno",     "01026774305");	// 휴대폰번호
				paramMap.put("birthday",     "19861107");	// 생년월일(YYYYMMDD)
				paramMap.put("custnm",     "김유리");			// 고객명
				paramMap.put("nation",     "1");			// 국적(1:내국인, 2:외국인)
				paramMap.put("gender",     "2");			// 성별(1: 남자, 2: 여자)
				paramMap.put("telecd",     "01");			// 통신사코드(01:SKT, 02:KT, 03:LGU, 04:SKT알뜰폰, 05:KT알뜰폰,06:LGU알뜰폰
			}
			// ================================= 임시 조회용 값 set 끝 ================================= //
			
			Map<String, String> verifyResMap = TOUtil.ksNetverifyOneself(paramMap);
			model.addAttribute("verifyResMap", verifyResMap); 
			
		} catch (Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
		
		return jsonview;
	}
	
//	3. ARS 자동이체 동의 call
//		>> ARS 자동이체동의 (이통사인증 + 점유) 모듈 중 2 ARS점유확인요청 호출
//		>> 해당 서비스 호출 시 파라미터로 넘어온 전화번호로 고객에게 ARS call
	@RequestMapping(value = "/TOM_79/mobile/reqArsCall.do")
	public View reqArsCall(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			
			// ================================= 임시 조회용 값 set 시작 ================================= //
			if(StringUtils.isEmpty((String)paramMap.get("phoneno"))) {
/*				paramMap.put("phoneno",    "01026774305");		// 휴대폰번호
				paramMap.put("birthday",   "19861107");			// 생년월일(YYYYMMDD)
				paramMap.put("custnm",     "김유리");				// 고객명
				paramMap.put("nation",     "1");				// 국적(1:내국인, 2:외국인)
				paramMap.put("gender",     "2");				// 성별(1: 남자, 2: 여자)
				paramMap.put("telecd",     "01");				// 통신사코드(01:SKT, 02:KT, 03:LGU, 04:SKT알뜰폰, 05:KT알뜰폰,06:LGU알뜰폰
				paramMap.put("banknm",     "신한은행");			// 자동이체 은행명
				paramMap.put("acctno",     "110457699600");		// 자동이체 계좌번호
*/			}
			
			// 임시. 테스트값 set(처리일련번호, ars입력 인증번호는 이통사 인증 후 넘어오는 값이므로 따로 분기. 화면에서는 다 보내야함)
//			paramMap.put("traceNo",    paramMap.get("traceNo"));		// 이통사 인증요청 응답값
//			paramMap.put("auth_numb",    paramMap.get("auth_numb"));	// 사용자가 입력할 인증번호(4자리). 이통사 인증요청 응답값

			// ================================= 임시 조회용 값 set 끝 ================================= //
			
			Map<String, String> arsResmap = TOUtil.ksNetAcceptStandingOrder(paramMap);
			model.addAttribute("arsResmap", arsResmap); 
			
		} catch (Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
		
		return jsonview;
	}
	
	
//	
//	4. 간편결제 계좌등록 요청
//		>> 출금이체 계좌 등록 전문 호출 (0600/501) KSNET 10페이지 참조
//		>> 고객 결제정보 테이블 INSERT(테이블 생성 필요)
//		>> 등록된 결제계좌 목록 화면 리턴(개인소유권이전 테이블 입력된 정보)
	@RequestMapping(value = "/TOM_79/mobile/savePaymentAccount.do")
	public View savePaymentAccount(@RequestParam Map<String, Object> mocaMap, ModelMap model, HttpServletRequest request) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			
			ToUserVO userVo = (ToUserVO)request.getSession().getAttribute("userInfo");
//			paramMap.put("userIndex", userVo.getIdx()); // 임시 주석처리.
			
			// 추후삭제 예정 시작
			if(userVo == null) {
				
				paramMap.put("userIndex", "58");
			} else {
				paramMap.put("userIndex", userVo.getIdx());
			}
			// 추후삭제 예정 끝
			
			SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
			String reqDt = sdf.format(new Date());
			paramMap.put("reqDt", reqDt);		// 요청일자
			
			// ================================= 임시 조회용 값 set 시작 ================================= //
			/*if(StringUtils.isEmpty((String) paramMap.get("bankCd"))) {
				paramMap.put("bankOwner", "김유리");			// 예금주
				paramMap.put("bankNm", "신한은행");			// 은행명
				paramMap.put("bankCd", "088");				// 은행코드(신한)
				paramMap.put("accountNo", "110457699600");	// 계좌번호
				paramMap.put("birthday", "19831130");		// 생년월일
				paramMap.put("Pay_Password", "111111");		// 결제비밀번호
			}*/
			
			// 아래 항목은 get 방식으로 직접 넣어야함(서비스 테스트 에서만. 화면에서는 그냥 보내면됨)
//			paramMap.put("traceNo", "207684000018");
			// ================================= 임시 조회용 값 set 끝 ================================= //
			
			String idNo = (String) paramMap.get("birthday");
			idNo = idNo.substring(2, idNo.length());
			paramMap.put("idNo", idNo);			// 신원확인번호 6자리
			
			// 결제 공통부 전문을 생성한다.
			LOGGER.debug("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");

			paramMap.put("sendType", "2"); //출금이체 계좌등록 (ARS)
			String cmmStr = toService.setKsnetCmmArea(paramMap);
			LOGGER.debug(cmmStr);
			LOGGER.debug("공통부 길이"+cmmStr.length());

			// 계좌등록 개별부 전문을 생성한다.
			String individualStr = toService.setKsnetAccountSignArea(paramMap);
			LOGGER.debug(individualStr);
			LOGGER.debug("개별부 길이"+individualStr.length());
			LOGGER.debug("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
			
			String fullMsg = cmmStr + individualStr;
			LOGGER.debug("전체전문 길이"+fullMsg.length());
			
			
			// 전문 테이블 insert를 위한 값 set
			paramMap.put("compCode", "CARBANG1");	// 업체코드
			paramMap.put("msgCode", "0600501");		// 전문구분 (출금이체계좌등록 ARS이용업체 요청)
			paramMap.put("sendMsg", fullMsg);		// 요청전문
			
			// 간편결제_계좌등록 전문 insert
			
			//paramMap.put("CALLER", "savePaymentAccount(간편결제 계좌등록 요청)");
			//paramMap.put("SERVICE","savePaymentAccountAfter");
			//[결제4:간편결제계좌등록]
			int cnt = toService.insertTradeRequestBin(paramMap);
			if(cnt > 0) {
				paramMap.put("reply", "0000");
				model.addAttribute("resMap", paramMap);
			}
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
		
		return jsonview;
	}
	
//	5. 간편결제 계좌등록 응답
//		>> 요청 후 ksnet데몬이 확인 후 전문 테이블 update 시간이 있으므로 (화면)요청->(서비스)응답코드->(화면)응답조회 방식으로 변경
//		>> 화면에서 TOM_79/mobile/savePaymentAccount.do 응답값을 그대로 parameter로 보내야 함
		@RequestMapping(value = "/TOM_79/mobile/savePaymentAccountRes.do")
		public View savePaymentAccountRes(@RequestParam Map<String, Object> mocaMap, HttpServletRequest request, ModelMap model) throws Exception {
			try {
				boolean flag = false;
				Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
				ToUserVO userVo = (ToUserVO)request.getSession().getAttribute("userInfo");
				
				// 서비스 테스트용 구문 추가
				if(MapUtils.isEmpty(paramMap)) {
					paramMap = mocaMap;
				}
				paramMap.put("userIndex", userVo.getIdx());
				paramMap.put("compCode", "CARBANG1");
				
				// ================================= 임시 조회용 값 set 시작 ================================= //
				if(StringUtils.isEmpty((String) paramMap.get("bankCd"))) {
/*					paramMap.put("bankCd", "088");
					paramMap.put("birthday", "19831130");
					paramMap.put("bankNm", "신한은행");
					paramMap.put("accountNo", "110457699600");
					paramMap.put("bankOwner", "김유리");
					paramMap.put("Pay_Password", "111111");*/
				}
				
				// 아래 두 항목은 get 방식으로 직접 넣어야함(서비스 테스트 에서만. 화면에서는 그냥 보내면됨)
//				paramMap.put("reqDt", "20210113");
//				paramMap.put("seqNo", "000001");
//				paramMap.put("traceNo", "207684000018");
//				paramMap.put("TransferOwnerIndex", "");
				// ================================= 임시 조회용 값 set 끝 ================================= //
				
				// 화면 응답 요청 후 아직 전문테이블 업데이트가 안됐을 경우, 응답값이 올때 까지 반복. (실시간이라 오래걸리진 않을듯) ---> 화면에서 반복하도록 변경
				for(int i=0; i  < 10; i++) {
					Map<String, Object> resMap = TOMapper.selectTradeRequestBin(paramMap);
					
					String rcvFlag = (String) resMap.get("RECV_FLAG"); // 응답구분
					if("Y".equals(rcvFlag)) {
						flag = true;
						
						String resStr = (String) resMap.get("RECV_MSG"); 	// 응답전문내용
						String resCd = resStr.substring(51, 55);			// 공통부 은행응답코드 
						String resYn = resStr.substring(143, 144);			// 처리여부  
						String resMsg = resStr.substring(144, 148);			// 불능코드
						
						LOGGER.debug("resCd	::: "+resCd);
						
						// 등록이 정상 처리가 됐으면 고객결제정보 테이블 insert
						if("0000".equals(resCd)) {
							TOMapper.insertToUserPaymentInfo(paramMap);
						}
						model.addAttribute("resCd", resCd);
						model.addAttribute("resYn", resYn);
						model.addAttribute("resMsg", resMsg);
						model.addAttribute("rcvFlag", rcvFlag);
						break;
					} else if("F".equals(rcvFlag) || "T".equals(rcvFlag)) {
						model.addAttribute("rcvFlag", rcvFlag);
						throw new Exception("계좌등록 중 오류가 발생했습니다. 다시 시도해 주세요");
					} else {
						Thread.sleep(3000);
					}
				}
			}catch(Exception e) {
				e.printStackTrace();
				model.addAttribute("error", e.getMessage());
			}
			
			return jsonview;
		}
		
//	=== 계좌등록 끝 ===
//	
//	5. 출금이체 요청
//		>> 출금이체, 집금이체 전문 호출
//		>> 결제 히스토리 테이블 insert 처리
	@RequestMapping(value = "/TOM_81/mobile/sendPaymentRequest.do")
	public View sendPaymentRequest(@RequestParam Map<String, Object> mocaMap, HttpServletRequest request, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			ToUserVO userVo = (ToUserVO)request.getSession().getAttribute("userInfo");
			
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			
			paramMap.put("userIdx", userVo.getIdx());
			
			String Pay_Password = (String) paramMap.get("Pay_Password");
			if(StringUtils.isEmpty(Pay_Password)) {
				throw new Exception("결제비밀번호가 없습니다. 결제비밀번호 입력 후 다시 시도해주세요");
			}
			
			// 입력한 결제 비밀번호가 맞는지 확인 (출금이체 요청 시 화면에서 TraceNo를 보내야함)
			List<Map<String, Object>> accountList = (List<Map<String, Object>>) TOMapper.selectToUserPaymentInfo(paramMap);
			
			if(accountList.size() == 0){
				throw new Exception("등록된 결제계좌가 없습니다. 다시 시도해주세요");
			}
			
			Map<String, Object> accountInfo = accountList.get(0);
			String Pay_Password2 = (String) accountInfo.get("Pay_Password");
			
			if(Pay_Password.equals(Pay_Password2)) {
				SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
				String reqDt = sdf.format(new Date());
				paramMap.put("reqDt", reqDt);		// 요청일자
				
				// ================================= 임시 조회용 값 set 시작 ================================= //
				if(StringUtils.isEmpty((String) paramMap.get("bankCd"))) {
/*					paramMap.put("bankOwner", "김유리");			// 출금예금주
					paramMap.put("bankNm", "신한은행");			// 출금은행명
					paramMap.put("bankCd", "088");				// 출금은행코드(신한)
					paramMap.put("accountNo", "110457699600");	// 출금계좌번호
					paramMap.put("payAmount", "3210000");			// 출금금액
					paramMap.put("birthday", "19831130");		// 생년월일
*///					paramMap.put("TransferOwnerIdx", "56");		// 소유권이전IDX
				}
				// 아래 항목은 get 방식으로 직접 넣어야함(서비스 테스트 에서만. 화면에서는 그냥 보내면됨)
//				paramMap.put("traceNo", "207684000018");
				// ================================= 임시 조회용 값 set 끝 ================================= //
				
				String idNo = (String) paramMap.get("birthday");
				idNo = idNo.substring(2, idNo.length());
				paramMap.put("idNo", idNo);			// 신원확인번호 6자리
				
				paramMap.put("payComnt", "소유권이전비용");			// 출금통장적요
				paramMap.put("depositComnt", "소유권이전비용");		// 입금통장적요
				
				
				// 결제 공통부 전문을 생성한다.
				LOGGER.debug("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");

				paramMap.put("sendType", "3"); //출금이체요청
				String cmmStr = toService.setKsnetCmmArea(paramMap);
				LOGGER.debug(cmmStr);
				LOGGER.debug("공통부 길이"+cmmStr.length());

				// 계좌등록 개별부 전문을 생성한다.
				String individualStr = toService.setKsnetPaymentArea(paramMap);
				
				LOGGER.debug(individualStr);
				LOGGER.debug("개별부 길이"+individualStr.length());
				LOGGER.debug("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
				
				String fullMsg = cmmStr + individualStr;
				LOGGER.debug("전체전문 길이"+fullMsg.length());
				
				// 전문 테이블 insert를 위한 값 set
				paramMap.put("compCode", "CARBANG1");	// 업체코드
				paramMap.put("msgCode", "0100501");		// 전문구분 (출금이체계좌등록 ARS이용업체 요청)
				paramMap.put("sendMsg", fullMsg);		// 요청전문
				
				//[결제5:이전비실결제,화면에서비번입력후결제,화면폴링]
				int cnt = toService.insertTradeRequestBin(paramMap);
				if(cnt > 0) {
					// ksnet 데몬이 실시간 요청을 확인하여 응답값을 업데이트 해주지만, 
					// 한 서비스 내에서 insert->update 체크 시 너무 여러번 조회를 하여 lock이 발생할 수 있어 전문insert/전문업데이트 조회를 서비스를 나눴음
					paramMap.put("reply", "0000");
					model.addAttribute("resMap", paramMap);
				}
			} else {
				throw new Exception("결제 비밀번호가 다릅니다. 다시 확인해주세요.");
			}
		} catch (Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage()); 
		}
		
		return jsonview;
	}
	
//	5-2. 출금이체 응답확인
//	>> 출금이체, 집금이체 전문 호출응답값 조회
//	>> 결제 히스토리 테이블 insert 처리
	@RequestMapping(value = "/TOM_81/mobile/receivePaymentRequest.do")
	public View receivePaymentRequest(@RequestParam Map<String, Object> mocaMap, HttpServletRequest request, ModelMap model) throws Exception {
		
		try {
			boolean flag = false;
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			
			
			ToUserVO userVo = (ToUserVO)request.getSession().getAttribute("userInfo");
			paramMap.put("userIdx", userVo.getIdx());
			paramMap.put("compCode", "CARBANG1");
			paramMap.put("payComnt", "소유권이전비용");			// 출금통장적요
			paramMap.put("depositComnt", "소유권이전비용");		// 입금통장적요
			paramMap.put("bank_deposit_account", "70110000000522");			
			paramMap.put("bank_deposit_owner", "(주)카방");			
			paramMap.put("bank_deposit_cd", "089");			
			paramMap.put("bank_deposit_name", "케이뱅크");			
			
			
			String Stage = "15";//공단미입금 비용비확정 
			
			// 화면 응답 요청 후 아직 전문테이블 업데이트가 안됐을 경우, 응답값이 올때 까지 반복. (실시간이라 오래걸리진 않을듯)
//			while (flag == false) {
				LOGGER.debug("/TOM_81/mobile/receivePaymentRequest.do >>> "+"paramMap:"+paramMap);
				Map<String, Object> resMap = TOMapper.selectTradeRequestBin(paramMap);
				LOGGER.debug("/TOM_81/mobile/receivePaymentRequest.do >>> "+"resMap:"+resMap);
				paramMap.put("idx", paramMap.get("TransferOwnerIdx"));
				
				String rcvFlag = (String) resMap.get("RECV_FLAG"); // 응답구분 (Y:응답완료, F:실패, N:응답대기중)
				if("Y".equals(rcvFlag)) {
					flag = true;
					
					String resStr = (String) resMap.get("RECV_MSG"); 	// 응답전문내용
					String resCd = resStr.substring(51, 55);			// 공통부 은행응답코드
					
					LOGGER.debug("resCd	::: "+resCd);
					paramMap.put("resCd", resCd);
					model.addAttribute("resCd", resCd);
					
					// 등록이 정상 처리가 됐으면 고객결제 히스토리정보 테이블 insert
					if("0000".equals(resCd)) {
						paramMap.put("Pay_type", "1"); 				// 결제구분 (1: 고객-카방, 2: 카방-공단, 3: 카방-고객)
						paramMap.put("Bank_Deposit_Account", ""); 	// 입금계좌번호
						
						TOMapper.insertToPaymentHistory(paramMap);
						
					} else {
						Stage = "24";	// 고객결제오류
					}
				} else if("F".equals(rcvFlag) || "T".equals(rcvFlag)) {
//					throw new Exception("계좌이체 요청중 오류가 발생했습니다. 다시 시도해 주세요");
					flag = true;
					Stage = "24";	// 고객결제오류
				}
				
				model.addAttribute("rcvFlag", rcvFlag);
//			}
			
				
			if(!"N".equals(rcvFlag)) {
				// 소유권이전 상태 업데이트
				paramMap.put("Stage", Stage); 
				TOMapper.updateToTransferOwnerStage(paramMap);			// 소유권이전 상태값 업데이트
				
				
				// 이전 예상 완료일 조회
				paramMap.put("idx", paramMap.get("TransferOwnerIdx"));
				String transferComDate = TOMapper.selectCompletDt(paramMap);
				paramMap.put("transferComDate", transferComDate);
				
				model.addAttribute("resMap", paramMap);
			}	
			
		} catch (Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
		
		return jsonview;
		
	}
		
//	6.간편결제 등록 계좌 목록
	@RequestMapping(value = "/TOM_81/mobile/AccountList.do")
	public View selectAccountList(@RequestParam Map<String, Object> mocaMap, HttpServletRequest request, ModelMap model) throws Exception {
		try { 
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			ToUserVO userVo = (ToUserVO)request.getSession().getAttribute("userInfo");
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			paramMap.put("userIdx", userVo.getIdx());
			
			List<Map<String, Object>> accountList = (List<Map<String, Object>>) TOMapper.selectToUserPaymentInfo(paramMap);
			model.addAttribute("accountList", accountList); 
			
		} catch (Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
		return jsonview;
		
	}

//	7.간편결제 계좌 은행목록
	@RequestMapping(value = "/TOM_67/mobile/bankList.do")
	public View selectBankList(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			
			List<Map<String, Object>> bankList = (List<Map<String, Object>>) TOMapper.selectBankList(paramMap);
			model.addAttribute("bankList", bankList); 
			
		} catch (Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
		return jsonview;
	}
	
	
	
	
	
	
	
	
	
	
	
	
			/*************************************************************************************************
			 * 																								*
			 * 											TO_DO												*
			 * 									간편결제_계좌등록 전문 insert										*
			 * 																								*
			 *************************************************************************************************/
	
	
//	3. 간편결제_계좌등록_은행선택 (화면 하드코딩하면 될듯. 서비스 대상 제외)
//	간편결제_결제하기 // 이전비용 간편결제(간편결제_결제하기 전문호출)... 단 출금계좌가 고객, 입금계좌가 카방
//	- 3가지 프로세스를 한번에 처리할거임
//	- inqType (1 : 고객-카방결제(출금계좌가 고객, 입금계좌가 카방), 2 : 확정비용 카방-공단결제, 3: 카방-고객 환불(단 출금계좌가 카방, 입금계좌가 고객) )
//	- 결제 후 소유권이전 상태 업데이트
//	- 결제전문 호출부는 따로 빼기
//	결제완료 시점에 이전예정일 return이전신청 완료(= 이전신청 완료 예정일 return)
	
	/************************************************ 결제 끝 ************************************************/
	
	
	

	
	
	
	
	
	
	/**************************************************** 서비스 작성 예정 시작 ****************************************************/
	// 자동차등록원부 값set
	public Map<String, Object> setToVehicleRst(Map<String, Object> resMap) throws Exception{
		
		Map<String, Object> rtnMap = new HashMap<String, Object>();
		
		String RegNumber 					= (String) resMap.get("CAR_REGNO");					// (갑부)자동차등록번호
		String SpecMgmtNumber 				= (String) resMap.get("ADM_REGNO");					// (갑부)제원관리번호
		String CanceledDate 				= (String) resMap.get("ERASE_DATE");				// (갑부)말소등록일
		String Name 						= (String) resMap.get("CAR_NAME");					// (갑부)차명
		String Type 						= (String) resMap.get("CAR_TYPE");					// (갑부)차종
		String ChassisNumber 				= (String) resMap.get("CAR_VINARY_NO");				// (갑부)차대번호
		String MoverType 					= (String) resMap.get("MOVER_TYPE");				// (갑부)원동기형식
		String Purpose 						= (String) resMap.get("USE");						// (갑부)용도
		String ModelYear 					= (String) resMap.get("MODEL_YEAR");				// (갑부)모델연도
		String Color 						= (String) resMap.get("COLOR");						// (갑부)색상
		String SourceDivision 				= (String) resMap.get("SOURCE_GB");					// (갑부)출처 구분
		String FirstRegDate 				= (String) resMap.get("FIRST_REG_DATE");			// (갑부)최초 등록일
		String DetailType 					= (String) resMap.get("DETAIL_TYPE");				// (갑부)세부유형
		String ProductDate 					= (String) resMap.get("PRODUCT_DATE");				// (갑부)제작연월일
		String LastOwner 					= (String) resMap.get("LAST_OWNER");				// (갑부)최종 소유자
		String PersonalRegNumber 			= (String) resMap.get("REGNO");						// (갑부)주민(법인)등록번호
		String PrimaryUseLocation 			= (String) resMap.get("LOCATE_USE");				// (갑부)사용본거지 (차고지)
		String InspectionExpireDate 		= (String) resMap.get("CHECK_EXP_DATE");			// (갑부)검사 유효기간
		String ConfirmDate 					= (String) resMap.get("CONFIRM_DATE");				// (갑부)등록사항확인일
		String CloseDate 					= (String) resMap.get("CLOSE_DATE");				// (갑부)폐쇄일
		String PrintName 					= (String) resMap.get("PRINT_NAME");				// (갑부)출력물 파일명
		String SeizeCollateralEntrustYn 	= (String) resMap.get("SeizeCollateralEntrustYn");	// 압류저당촉탁여부
		String PassYn 						= (String) resMap.get("PassYn");					// 정상여부
		String InputOwner 					= (String) resMap.get("InputOwner");				// (입력)자동차 소유자명
		String InputRegNumber 				= (String) resMap.get("InputRegNumber");			//(입력)자동차 차량번호
		String ReqId 						= (String) resMap.get("ReqId");						//신청자ID
		String ReqMobilePhone 				= (String) resMap.get("ReqMobilePhone");			//신청자휴대폰번호
		String RegType 						= (String) resMap.get("RegType");					// 등록구분(1:APP, 2:관리자)
		String ErrType 						= (String) resMap.get("ErrType");					// 오류대상구분(1:쿠콘,2:카방)
		String ResultCd 					= (String) resMap.get("RESULT_CD");					// 쿠콘 결과코드
		String ResultMg 					= (String) resMap.get("RESULT_MG");					// 쿠콘 결과메시지
		
		rtnMap.put("RegNumber", RegNumber);
		rtnMap.put("SpecMgmtNumber", SpecMgmtNumber);
		rtnMap.put("CanceledDate", CanceledDate);
		rtnMap.put("Name", Name);
		rtnMap.put("Type", Type);
		rtnMap.put("ChassisNumber", ChassisNumber);
		rtnMap.put("MoverType", MoverType);
		rtnMap.put("Purpose", Purpose);
		rtnMap.put("ModelYear", ModelYear);
		rtnMap.put("Color", Color);
		rtnMap.put("SourceDivision", SourceDivision);
		rtnMap.put("FirstRegDate", FirstRegDate);
		rtnMap.put("DetailType", DetailType);
		rtnMap.put("ProductDate", ProductDate);
		rtnMap.put("LastOwner", LastOwner);
		rtnMap.put("PersonalRegNumber", PersonalRegNumber);
		rtnMap.put("PrimaryUseLocation", PrimaryUseLocation);
		rtnMap.put("InspectionExpireDate", InspectionExpireDate);
		rtnMap.put("ConfirmDate", ConfirmDate);
		rtnMap.put("CloseDate", CloseDate);
		rtnMap.put("PrintName", PrintName);
		rtnMap.put("SeizeCollateralEntrustYn", SeizeCollateralEntrustYn);
		rtnMap.put("PassYn", PassYn);
		rtnMap.put("InputOwner", InputOwner);
		rtnMap.put("InputRegNumber", InputRegNumber);
		rtnMap.put("ReqId", ReqId);
		rtnMap.put("ReqMobilePhone", ReqMobilePhone);
		rtnMap.put("RegType", RegType);
		rtnMap.put("ErrType", ErrType);
		rtnMap.put("ResultCd", ResultCd);
		rtnMap.put("ResultMg", ResultMg);
		
		
		return rtnMap;
		
	}
	// 자동차등록원부 갑지 값set
	public List<Map<String, Object>> setToVehicleRstMaster(Map<String, Object> resMap) throws Exception{
		List<Map<String, Object>> rtnList = new ArrayList<Map<String, Object>>();
		Map<String, Object> rtnMap = null;
		
		List<Map<String, Object>> masterDetailList = (List<Map<String, Object>>) resMap.get("RESP_OWNER_DATA_INFO");		// 갑부상세
		
		String RegistrationIndex 	= (String) resMap.get("idx");	// 자동차등록원부id
		String MainNumber		 	= "";
		String SubNumber 			= "";
		String PersonalRegNumber 	= "";
		String RegistrationDate 	= "";
		String ReceiptNumber 		= "";
		String MainCheck 			= "";
		String DetailDescription 	= "";
		
		for(Map<String, Object> mMap : masterDetailList) {
			rtnMap = new HashMap<String, Object>();
			
			MainNumber		 	= (String) mMap.get("MAIN_NO");			// 순위번호-주등록
			SubNumber 			= (String) mMap.get("SUB_NO");			// 순위번호-부기등록
			PersonalRegNumber 	= (String) mMap.get("DETAIL_REG_NO");	// 주민(법인)등록번호
			RegistrationDate 	= (String) mMap.get("DETAIL_REGDATE");	// 등록일
			ReceiptNumber 		= (String) mMap.get("RECEIPT_NO");		// 접수번호
			MainCheck 			= (String) mMap.get("MAIN_CHK");		// 항목코드 (1: 정상  / 1 외 : 상환)
			DetailDescription 	= (String) mMap.get("GDETAIL_TEXT");	// 사항란
			
			if(StringUtils.isEmpty(MainCheck)) {
				MainCheck = null;
			}
			
			rtnMap.put("RegistrationIndex", RegistrationIndex);
			rtnMap.put("MainNumber", MainNumber);
			rtnMap.put("SubNumber", SubNumber);
			rtnMap.put("PersonalRegNumber", PersonalRegNumber);
			rtnMap.put("RegistrationDate", RegistrationDate);
			rtnMap.put("ReceiptNumber", ReceiptNumber);
			rtnMap.put("MainCheck", MainCheck);
			rtnMap.put("DetailDescription", DetailDescription);
			
			rtnList.add(rtnMap);
		} 
		
		return rtnList;
	}
	
	// 자동차등록원부 을지 값set
	public List<Map<String, Object>> setToVehicleRstSlave(Map<String, Object> resMap) throws Exception{
		List<Map<String, Object>> rtnList = new ArrayList<Map<String, Object>>();
		Map<String, Object> rtnMap = null;
		
		List<Map<String, Object>> slaveDetailList = (List<Map<String, Object>>) resMap.get("RESP_MORTGAGE_DATA_INFO");	// 을부상세
		
		String RegistrationIndex 	= (String) resMap.get("idx");	// 자동차등록원부id
		String ebNo = "";
		String MortgageNumber = "";
		String MortgageName = "";
		String MortgageAddress = "";
		String MortgagorName = "";
		String MortgagorAddress = "";
		String DebtorName = "";
		String DebtorAddress = "";
		String BondAmount = "";
		String MortgageRegDate = "";
		String MortgageCancelDate = "";
		String MortgageClose = "";
		
		for(Map<String, Object> sMap : slaveDetailList) {
			rtnMap = new HashMap<String, Object>();
			
			ebNo 				= (String) sMap.get("EB_NO");			// 을부번호
			MortgageNumber 		= (String) sMap.get("MORTGAGE_NO");		// 저당권설정 접수번호
			MortgageName 		= (String) sMap.get("MORTGAGEE_NAME");	// 저당권자 성명(명칭)
			MortgageAddress 	= (String) sMap.get("MORTGAGEE_ADDR");	// 저당권자 주소
			MortgagorName 		= (String) sMap.get("MORTGAGOR_NAME");	// 저당권설정자 성명(명칭)
			MortgagorAddress 	= (String) sMap.get("MORTGAGOR_ADDR");	// 저당권설정자 주소
			DebtorName 			= (String) sMap.get("DEBTOR_NAME");		// 채무자 성명
			DebtorAddress 		= (String) sMap.get("DEBTOR_ADDR");		// 채무자 주소
			BondAmount 			= (String) sMap.get("BOND_AMOUNT");		// 채권가액
			MortgageRegDate 	= (String) sMap.get("MORTGAGE_DATE");	// 저당권설정일
			MortgageCancelDate 	= (String) sMap.get("MORTGAGE_ERASE");	// 저당권말소일
			MortgageClose 		= (String) sMap.get("MORTGAGE_CLOSE");	// 폐쇄연월일
			
			rtnMap.put("RegistrationIndex", RegistrationIndex);
			rtnMap.put("ebNo", ebNo);
			rtnMap.put("MortgageNumber", MortgageNumber);
			rtnMap.put("MortgageName", MortgageName);
			rtnMap.put("MortgageAddress", MortgageAddress);
			rtnMap.put("MortgagorName", MortgagorName);
			rtnMap.put("MortgagorAddress", MortgagorAddress);
			rtnMap.put("DebtorName", DebtorName);
			rtnMap.put("DebtorAddress", DebtorAddress);
			rtnMap.put("BondAmount", BondAmount);
			rtnMap.put("MortgageRegDate", MortgageRegDate);
			rtnMap.put("MortgageCancelDate", MortgageCancelDate);
			rtnMap.put("MortgageClose", MortgageClose);
			
			rtnList.add(rtnMap);
		}
		
		return rtnList;
	}
	
	// 정규식을 통해 자동차등록원부 갑지 사항란 압류촉탁 항목 파싱
	public Map<String, Object> getSeizeDetail(String detailTxt) {
		Map<String, Object> rtnMap = new HashMap<String, Object>();
		String type = "";
		String[] arrPtnStr = {
				"구분\\:(\\D*\\s)"
				, "촉탁기관 \\: (.*)(구분\\:)"
				, "압류관리번호\\:([a-z0-9-]*)"
				, "압류내역 \\: (.*)(촉탁일자 \\:)"
				, "촉탁일자 \\: (.*)"
		};
		
		for(int i = 0; i < arrPtnStr.length; i++) {
			if(i == 0) type = "seizeType";		// 구분 
			if(i == 1) type = "seizeOrg"; 		// 촉탁기관
			if(i == 2) type = "seizeNum"; 		//압류관리번호
			if(i == 3) type = "seizeHis"; 		//압류내역
			if(i == 4) type = "seizeDate";		//촉탁일자
			
			String value = this.comfileTxt(arrPtnStr[i], detailTxt);
			
			// 촉탁기관일 경우 연락처 파싱
			if(i == 1) {
				String phonePtn = "(\\d{1}|02|0505|0502|0506|0\\d{1,2})-?(\\d{3,4})-?(\\d{4})";
				Pattern tempPtn = Pattern.compile(phonePtn);
				Matcher tempM = tempPtn.matcher(value);
				String seizePhone = "";
				
				if(tempM.find()) {
					seizePhone += tempM.group(1);
					seizePhone += tempM.group(2);
					seizePhone += tempM.group(3);
				}
				
				
				value = value.replaceAll(phonePtn, "");
				value = value.replaceAll("\\(", "");
				value = value.replaceAll("\\)", "");
				value = value.replaceAll("☎", "");
				value = value.replaceAll("tel:", "");
				value = value.trim();
				
				rtnMap.put("seizePhone", seizePhone);	// 압류/촉탁기관 연락처
			}
			rtnMap.put(type, value);
		}
		
		return rtnMap;
	}
	
	public String comfileTxt(String ptnStr, String targetStr) {
		String rtnStr = "";
		
		Pattern p = Pattern.compile(ptnStr);
		Matcher m = p.matcher(targetStr);
		
		if(m.find()) {
			rtnStr = m.group(1);
		}
		return rtnStr;
	}
	
	
	
	
	
	// 카카오페이 인증 결과를 파싱한다
	private Map<String, Object> getKakaopayResultMap(String kakaoResJsonStr) {
		Map<String,Object> rtnmap = null;
		
		Gson gson = new Gson();
		Map<String,Object> parseMap = new HashMap<String,Object>();  
		parseMap = (Map<String,Object>) gson.fromJson(kakaoResJsonStr, Map.class);
		Map<String,Object> parseResult = (Map<String,Object>) parseMap.get("data");
		
		if(parseResult == null) {
			rtnmap = parseMap;
		} else {
			rtnmap = parseResult;
		}
		
		return rtnmap;
	}
	

	/**************************************************** 서비스 작성 예정 끝 ****************************************************/
	
	
	
	
	
	
	
	
	

//	@Autowired
//	TODB13_124_14_79Mapper tODB13_124_14_79Mapper;//(구) 관리자사이트 맵퍼
	
	/*
	 * 양도증명서를 데이터바인딩하여 이미지를 만들고  PDF를 만든다.
	 * 테스트용
	 */
	@RequestMapping(value = "/TO/common/makeYangdo.do")
	public View makeYangdo(@RequestParam Map mocaMap, 
			HttpServletRequest request,HttpServletResponse response,
			ModelMap model) throws Exception{
			Map param = new HashMap();
			param.put("receiptNo", "9092091029384:500:420");
			param.put("receptDt", "2020년 11월 10일:1450:420");
			
			param.put("mesuNm", "김세창:690:530");
			param.put("mesuPhone", "010-9116-8080:690:601");
			param.put("mesuJumin", "771008-1987654:1840:530");
			param.put("mesuAddr", "경기도 고양시 식사동 388-09 삼성아파트 108동 107호:690:671");
			
			param.put("medoNm", "유상인:690:752");
			param.put("medoPhone", "010-8090-1121:690:822");
			param.put("medoJumin", "801008-1987654:1840:752");
			param.put("medoAddr", "서울시 동대문구 식사동 388-09 삼성아파트 108동 107호:690:894");
	
			param.put("left1", "유상인:782:974");
			param.put("left2", "010-8090-1121:690:1045");
			param.put("left3", "801008-1987654:690:1120");
			param.put("left4", "2020년0 04월 16일:750:1190");
			
			param.put("right1", "유상인:1754:974");
			param.put("right2", "010-8090-1121:1640:1045");
			param.put("right3", "801008-1987654:1720:1120");
			param.put("right4", "46:1700:1190");
			
			param.put("year", "2020:1640:2330");
			param.put("month", "11:1900:2330");
			param.put("day", "16:2100:2330");
			
			param.put("mesuNm2", "김세창:460:2403");
			param.put("medoNm2", "유상인:1520:2403");
			String fileDir = "/home/ubuntu/TO/apache-tomcat-9.0.39/webapps/to/images/carbang/";
			Map fileNames = TOUtil.makeYangdoDoc(param);
			model.addAttribute("pdf", ((String)fileNames.get("pdf")).replaceAll("/home/ubuntu/TO/apache-tomcat-9.0.39/webapps/to/", "http://dev-mycar.carbang365.co.kr:9090/to/"));
			model.addAttribute("image", ((String)fileNames.get("image")).replaceAll("/home/ubuntu/TO/apache-tomcat-9.0.39/webapps/to/", "http://dev-mycar.carbang365.co.kr:9090/to/"));
        return jsonview;
	};
	
	/*
	 * app으로 푸시메세지를 발송합니다.
	 */
	@RequestMapping(value = "/TO/common/exeAppPush.do")
	public View exeAppPush(@RequestParam Map mocaMap, 
			HttpServletRequest request,HttpServletResponse response,
			ModelMap model) throws Exception{
			Map param = new HashMap();
			param.put("notification.title","푸시테스트제목");
			param.put("notification.body","푸시내용입니다.");
			param.put("to","d9PZ05Yt13c:APA91bE6uFrbtwpuIlpzbMT4mBsz8fgLph-vZT9KsumsVjKolCTMoJkzGxiNA8fXn3pzhSeOKw67EWn6KHqYrA_nO-E4IybruevLCbbhZhWNpmRbPPS3dufGwbphfun6lv8p2BTl2xlI");
			TOUtil.exeAppPush(param);
	        return jsonview;
    }
	
	/*
	 * cooCon 자동차등록원부조회
	 */
	@RequestMapping(value = "/TO/common/callCoocon.do")
	public View callCoocon(@RequestParam Map mocaMap, 
			HttpServletRequest request,HttpServletResponse response,
			ModelMap model) throws Exception{
			try {
				Map map = U.getBodyNoSess(mocaMap);
				String CAR_NUM = "126마5185";
				String OWNER_NAME = "배경순";
				if(map.get("CAR_NUM") != null) {
					CAR_NUM = (String)map.get("CAR_NUM");
				}
				if(map.get("OWNER_NAME") != null) {
					OWNER_NAME = (String)map.get("OWNER_NAME");
				}
				Map param = TOUtil.getPreRequestForCoocon();
				param.put("CAR_NUM", CAR_NUM);//"126마5185"
				param.put("OWNER_NAME", OWNER_NAME);//"배경순"
				Map result = TOUtil.call(param);
				model.addAttribute("result", result);
				//model.addAttribute("list", adcService.reportCateBig(map));
			}catch(Exception e) {
				e.printStackTrace();
			}
			/*
			List list_select_ets_infos = tODB13_124_14_79Mapper.selectEtsInfos(new HashMap());
			model.addAttribute("list", list_select_ets_infos);
			
			List list_AdmMngDetail = tOMapper.selectAdmMngDetail(mocaMap);
			model.addAttribute("list2", list_AdmMngDetail);
			*/
	        return jsonview;
    }

	/*
	 * cooCon 자동차등록원부조회
	 */
	@RequestMapping(value = "/TO/common/db.do")
	public View db(@RequestParam Map mocaMap, 
			HttpServletRequest request,HttpServletResponse response,
			ModelMap model) throws Exception{
		
//			List list_select_ets_infos = tODB13_124_14_79Mapper.selectEtsInfos(new HashMap());
//			model.addAttribute("list", list_select_ets_infos);
			
			//List list_AdmMngDetail = tOMapper.selectAdmMngDetail(mocaMap);
			//model.addAttribute("list2", list_AdmMngDetail);
	        return jsonview;
    }
	
	
	/*
	 * seed 암,복호화 테스트(KISA_SEED_ECB)
	 */
	@RequestMapping(value = "/TO/common/seed.do")
	public View seed(@RequestParam Map mocaMap, 
			HttpServletRequest request,HttpServletResponse response,
			ModelMap model) throws Exception{
			Map m = new HashMap();
			m.put("Decrypt",Util.TOKISA_SEED_ECB.Decrypt("50AEB7DC520D6F3869AC1CD42D96C405"));
			m.put("Encrypt", Util.TOKISA_SEED_ECB.Encrypt("01049469322"));
			model.addAttribute("m", m);
	        return jsonview;
    }
	
	/*
	 * raon usim 인증테스트
	 */
	@RequestMapping(value = "/TO/common/usim.do")
	public View usim(@RequestParam Map mocaMap, 
			HttpServletRequest request,HttpServletResponse response,
			ModelMap model) throws Exception{
		
			Map paramMap = U.getBodyNoSess(mocaMap); 
			String teleType = (String)paramMap.get("teleType");
			String ctn = (String)paramMap.get("ctn");
			String bday = (String)paramMap.get("bday");
			String name = (String)paramMap.get("name");
			String sex = (String)paramMap.get("sex");
			LOGGER.debug("to api call : "+teleType+","+ctn);
			
			CloseableHttpClient http = HttpClients.createDefault();
			StringBuffer result = new StringBuffer();
			try{
				HttpPost post = new HttpPost(Globals.URL_USIM);
			    post.setHeader("Content-Type",Globals.CONTENTTYPE_USIM);
				List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
				urlParameters.add(new BasicNameValuePair("header", "{}"));
				urlParameters.add(new BasicNameValuePair("body", "{\"teleType\":\""+teleType+"\",\"ctn\":\""+ctn+"\",\"bday\":\""+bday+"\",\"name\":\""+name+"\",\"sex\":\""+sex+"\"}"));
				HttpEntity postParams = new UrlEncodedFormEntity(urlParameters,"UTF-8");
				post.setEntity(postParams);
			    
			    CloseableHttpResponse httpResponse = http.execute(post);
			    try{
			        HttpEntity res = httpResponse.getEntity();
			        BufferedReader br = new BufferedReader(new InputStreamReader(res.getContent(), Charset.forName("UTF-8")));
			        String buffer = null;
			        while( (buffer = br.readLine())!=null ){
			            result.append(buffer).append("\r\n");
			        }
			    }catch(Exception e) {
			    	e.printStackTrace();              
			    }finally{
			    	if(httpResponse != null){
			    		httpResponse.close();
			    	}
			    }
			}catch(Exception e) {
				e.printStackTrace();   
			}finally{
				if(http != null){
					http.close();
				}
			}
			model.addAttribute("response", result.toString());
	        return jsonview;
    }
	
	/*
	 * raon usim 인증테스트
	 */
	@RequestMapping(value = "/TO/common/usimApi.do")
	public View usimApi(@RequestParam Map mocaMap, 
			HttpServletRequest request,HttpServletResponse response,
			ModelMap model) throws Exception{
		
			Map paramMap = U.getBodyNoSess(mocaMap); 
			String teleType = (String)paramMap.get("teleType");
			String ctn = (String)paramMap.get("ctn");
			String bday = (String)paramMap.get("bday");
			String name = (String)paramMap.get("name");
			String sex = (String)paramMap.get("sex");
			LOGGER.debug("TcertClientServer.sendAuthMsg : "+teleType+","+ctn);
			
			Map m = TOUtil.TcertClientServer.sendAuthMsg(teleType,ctn,bday,name,sex);
			LOGGER.debug("usim : "+m);
			model.addAttribute("response", m); 
	        return jsonview;
    }

	/*
	 * 서신평 API
	 */
	@RequestMapping(value = "/TO/mobile/sci.do")
	public View sci(@RequestParam Map mocaMap, HttpServletRequest request, HttpServletResponse response, ModelMap model)
			throws Exception {
		Map m = new HashMap();
		LOGGER.debug("OK sci");
		model.addAttribute("m", m);
		return jsonview;
	}

	/*
	 * 서신평 API
	 */
	@RequestMapping(value = "/TO/mobile/excelUploadView.do")
	public String excelUploadView(@RequestParam Map mocaMap, HttpServletRequest request, HttpServletResponse response,
			ModelMap model) throws Exception {
		Map m = new HashMap();
		LOGGER.debug("OK sci");
		model.addAttribute("m", m);

		return "excelUploadTest";
	}

	/*
	 * 서신평 API
	 */
/*	@RequestMapping(value = "/TO/mobile/excelUpload.do")
	public View excelUpload(@RequestParam Map mocaMap, HttpServletRequest request, HttpServletResponse response,
			@RequestParam("file") MultipartFile[] files, ModelMap model) throws Exception {

		long beforeTime = System.currentTimeMillis();

		Map m = new HashMap();

		LOGGER.debug("OK sci : ");

		List<Map> resultList = new ArrayList<>();

		Map info = new HashMap();
		info.put("RECEIPT_SERVER_DIR", "C:\\excelTest\\");

		String filePath = TestExcel.fileUpload(request, files[0], info, "EXCEL");

		long afterTime = System.currentTimeMillis();
		long secDiffTime = (afterTime - beforeTime) / 1000;
		LOGGER.debug("시간차이(m) : " + secDiffTime);

		long beforeTime2 = System.currentTimeMillis();

		Map colum = new HashMap();
		TestExcel.procXlsx(resultList, "2", colum, filePath);

		model.addAttribute("m", m);

		long afterTime2 = System.currentTimeMillis();
		long secDiffTime2 = (afterTime2 - beforeTime2) / 1000;
		LOGGER.debug("시간차이2(m) : " + secDiffTime2);

		return jsonview;
	}*/

	@RequestMapping(value = "/TO/mobile/sampleView.do")
	public String sampleView(@RequestParam Map mocaMap, HttpServletRequest request, HttpServletResponse response,
			ModelMap model) throws Exception {
		//날짜 생성   
        Calendar today = Calendar.getInstance();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        String day = sdf.format(today.getTime());
        
		String id       = Globals.ID;                               // 본인실명확인 회원사 아이디
	    String srvNo    = Globals.SRVNO;                             // 본인실명확인 서비스번호
	    String reqNum   = Globals.REQNUM;                           // 본인실명확인 요청번호 (sample 페이지와 result 페이지가  동일하지 않으면 결과페이지 복호화 시 에러)
		String exVar    = Globals.EXVAR;                                       // 복호화용 임시필드
	    String retUrl   = Globals.RETURL;                           // 본인실명확인 결과수신 URL
	    
		String certDate	= day;                         // 본인실명확인 요청시간
		String certGb	= Globals.CERTGB;                           // 본인실명확인 본인확인 인증수단(휴대폰)
		String addVar	= "";                           // 본인실명확인 추가 파라메터
		//01. 암호화 모듈 선언
		com.sci.v2.pccv2.secu.SciSecuManager seed  = new com.sci.v2.pccv2.secu.SciSecuManager();

		//02. 1차 암호화
		String encStr = "";
		String reqInfo      = id+"^"+srvNo+"^"+reqNum+"^"+certDate+"^"+certGb+"^"+addVar+"^"+exVar;  // 데이터 암호화

		seed.setInfoPublic(id,Globals.INFOPUBLIC); // 회원사 ID 및 PWD 셋팅 패스워드는 16자리 필수 영문 무관

		encStr               = seed.getEncPublic(reqInfo);

		//03. 위변조 검증 값 생성
		com.sci.v2.pccv2.secu.hmac.SciHmac hmac = new com.sci.v2.pccv2.secu.hmac.SciHmac();
		String hmacMsg  = seed.getEncReq(encStr,"HMAC");

		//03. 2차 암호화
		reqInfo  = seed.getEncPublic(encStr + "^" + hmacMsg + "^" + "0000000000000000");  //2차암호화

		//04. 회원사 ID 처리를 위한 암호화
		reqInfo = seed.EncPublic(reqInfo + "^" + id + "^"  + "00000000");
		
		model.addAttribute("reqInfo", reqInfo);
		model.addAttribute("retUrl", retUrl);

		return "TOM_05";
		//return jsonview;
	};
	
	
	@RequestMapping(value = "/TO/mobile/siren24GetInfo.do")
	public View siren24GetInfo(@RequestParam Map mocaMap, HttpServletRequest request, HttpServletResponse response,
			ModelMap model) throws Exception {
		//날짜 생성   
        Calendar today = Calendar.getInstance();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        String day = sdf.format(today.getTime());
        
		String id       = Globals.ID;                               // 본인실명확인 회원사 아이디
	    String srvNo    = Globals.SRVNO;                             // 본인실명확인 서비스번호
	    String reqNum   = Globals.REQNUM;                           // 본인실명확인 요청번호 (sample 페이지와 result 페이지가  동일하지 않으면 결과페이지 복호화 시 에러)
		String exVar    = Globals.EXVAR;                                       // 복호화용 임시필드
	    String retUrl   = Globals.RETURL;                           // 본인실명확인 결과수신 URL
		String certDate	= day;                         // 본인실명확인 요청시간
		String certGb	= Globals.CERTGB;                           // 본인실명확인 본인확인 인증수단(휴대폰)
		String addVar	= "";                           // 본인실명확인 추가 파라메터
		//01. 암호화 모듈 선언
		com.sci.v2.pccv2.secu.SciSecuManager seed  = new com.sci.v2.pccv2.secu.SciSecuManager();

		//02. 1차 암호화
		String encStr = "";
		String reqInfo      = id+"^"+srvNo+"^"+reqNum+"^"+certDate+"^"+certGb+"^"+addVar+"^"+exVar;  // 데이터 암호화

		seed.setInfoPublic(id,Globals.INFOPUBLIC); // 회원사 ID 및 PWD 셋팅 패스워드는 16자리 필수 영문 무관

		encStr               = seed.getEncPublic(reqInfo);

		//03. 위변조 검증 값 생성
		com.sci.v2.pccv2.secu.hmac.SciHmac hmac = new com.sci.v2.pccv2.secu.hmac.SciHmac();
		String hmacMsg  = seed.getEncReq(encStr,"HMAC");

		//03. 2차 암호화
		reqInfo  = seed.getEncPublic(encStr + "^" + hmacMsg + "^" + "0000000000000000");  //2차암호화

		//04. 회원사 ID 처리를 위한 암호화
		reqInfo = seed.EncPublic(reqInfo + "^" + id + "^"  + "00000000");
		
		model.addAttribute("reqInfo", reqInfo);
		model.addAttribute("retUrl", retUrl);

		return jsonview;
	};

	@RequestMapping(value = "/TO/mobile/sampleReturnView.do")
	public String sampleReturnView(@RequestParam Map mocaMap,
			HttpServletRequest request,HttpServletResponse response,
			@RequestParam String retInfo,
			ModelMap model) throws Exception{
		
		// 변수 --------------------------------------------------------------------------------															// 결과정보

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
			LOGGER.debug("HMAC 확인이 필요합니다.");
		}
		
		// 복호화 및 위/변조 검증 ---------------------------------------------------------------
		retInfo  = sciSecuMg.getDec(encPara, reqNum);

        String[] aRetInfo = retInfo.split("\\^");
		
        
		
		LOGGER.debug("!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
		for(String v : aRetInfo) {
			LOGGER.debug(v);
		}
		LOGGER.debug("!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
			
        return "TOM_11";
    }
	
	
	//양도증명서 URL만들기
	@RequestMapping(value = "/TO/common/makeYangdoURL.do")
	public void makeYangdoURL(@RequestParam Map mocaMap, 
			HttpServletRequest request,HttpServletResponse response,
			ModelMap model) throws Exception{
		OutputStream out = null;
		BufferedInputStream fin = null;
		BufferedOutputStream outs = null;
        try {
        	String idx = (String)mocaMap.get("idx");
        	//idx = "71";
			String yangdo_origin_path = Util.getYangdouOriFileNameFullPath(idx, null);	// 양도증명서 원본파일 경로
			String yangdo_stamp_path = Util.getYangdouStampFileNameFullPath(idx, null);	// 양도증명서 스탬프 찍힌 버전 경로
			//yangdo_origin_path = yangdo_origin_path.replaceAll("/home", "c:/home");
			//yangdo_stamp_path = yangdo_stamp_path.replaceAll("/home", "c:/home");
			LOGGER.debug(">>yangdo_origin_file>>>>>>>>>"+yangdo_origin_path);
			File yangdo_origin_file = new File(yangdo_origin_path);
			File yangdo_stamp_file = new File(yangdo_stamp_path);
			
			File targetFile = null;
			if(yangdo_stamp_file.exists()) {
				targetFile = yangdo_stamp_file;
			}else if(yangdo_origin_file.exists()) {
				targetFile = yangdo_origin_file;	
			}
			if(targetFile != null) {
				response.setContentType("application/octet-stream; charset=utf-8");
				response.setContentLength((int) targetFile.length());
				String browser = Util.getBrowser(request);
				String disposition = Util.getDisposition("yangdodoc"+idx+".pdf", browser);
				response.setHeader("Content-Disposition", disposition);
				response.setHeader("Content-Transfer-Encoding", "binary");
				
				byte[] b = new byte[2048]; //buffer size 2K.
				LOGGER.debug(">>filePath>>"+targetFile.getCanonicalPath());
				fin = new BufferedInputStream(new FileInputStream(targetFile.getCanonicalPath()));
			    outs = new BufferedOutputStream(response.getOutputStream());
			    int read = 0;

				while ((read = fin.read(b)) != -1) {
				    outs.write(b, 0, read);
				}
				outs.flush();
				outs.close();
				
			}
        } catch (Exception ex) {
        	ex.printStackTrace();
        } finally {
            try {
                if(outs != null) {
                	outs.close();
                }
                if(fin != null) {
                	fin.close();
                }
            } catch (IOException ex2) {
            	ex2.printStackTrace();
            }
        }
	};	
	
	
	//양도증명서 있는지확인하기
	@RequestMapping(value = "/TO/common/findYangdoURL.do")
	public View findYangdoURL(@RequestParam Map mocaMap, 
			HttpServletRequest request,HttpServletResponse response,
			ModelMap model) throws Exception{
		OutputStream out = null;
		BufferedInputStream fin = null;
		BufferedOutputStream outs = null;
        try {
        	
        	Map map = U.getBodyNoSess(mocaMap);
        	String idx = (String)map.get("idx");
        	//idx = "71";
			String yangdo_origin_path = Util.getYangdouOriFileNameFullPath(idx, null);	// 양도증명서 원본파일 경로
			String yangdo_stamp_path = Util.getYangdouStampFileNameFullPath(idx, null);	// 양도증명서 스탬프 찍힌 버전 경로
			//yangdo_origin_path = yangdo_origin_path.replaceAll("/home", "c:/home");
			//yangdo_stamp_path = yangdo_stamp_path.replaceAll("/home", "c:/home");
			LOGGER.debug(">>yangdo_origin_file>>>>>>>>>"+yangdo_origin_path);
			File yangdo_origin_file = new File(yangdo_origin_path);
			File yangdo_stamp_file = new File(yangdo_stamp_path);
			
			File targetFile = null;
			if(yangdo_stamp_file.exists()) {
				targetFile = yangdo_stamp_file;
			}else if(yangdo_origin_file.exists()) {
				targetFile = yangdo_origin_file;	
			}
			if(targetFile != null) {
				model.addAttribute("fileYN", "Y");
			}else {
				model.addAttribute("fileYN", "N");
			}
        } catch (Exception ex) {
        	ex.printStackTrace();
        	model.addAttribute("error", ex.getMessage());
        } finally {
            try {
                if(outs != null) {
                	outs.close();
                }
                if(fin != null) {
                	fin.close();
                }
            } catch (IOException ex2) {
            	ex2.printStackTrace();
            }
            return jsonview;
        }
	};	
	
	

	@RequestMapping(value = "/TOM_04/selectTermsContents.do")
	public View getTermsOne(@RequestParam Map mocaMap, 
			HttpServletRequest request,HttpServletResponse response,
			ModelMap model) throws Exception{
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			model.addAttribute("map", TOMapper.selectTermsContents(paramMap));
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	};	
	
	@RequestMapping(value = "/TOM_01/selectGonggis.do")
	public View getGonggis(@RequestParam Map mocaMap, 
			HttpServletRequest request,HttpServletResponse response,
			ModelMap model) throws Exception{
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			model.addAttribute("list", TOMapper.selectGonggis(paramMap));
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	};	
	
	@RequestMapping(value = "/TOM_02/SecretKeyTemp.do")
	public View SecretKeyTemp(HttpServletRequest req
			, HttpServletResponse res
			, @RequestParam Map <String, Object> mocaMap
			, ModelMap model) throws Exception {
		
		try {
			Map paramMap = U.getBodyNoSess(mocaMap);  
			// 소셜로그인 id, 소셜로그인 타입 필요 (id : 소셜로그인id, loginType : 1:카카오, 2:네이버, 3:페이스북)
			String loginType = (String) paramMap.get("loginType");	// 1:카카오, 2:네이버, 3:페이스북
			String id = (String) paramMap.get("id");				// 소셜로그인 id
			String SecretKey = (String) paramMap.get("SecretKey");				// 소셜로그인 id
			
			String resultCd = "";
			String resultMsg = "";
			ToUserVO userVoIsLeaveYn = TOMapper.selectToUsersLeaveYn(paramMap); 
			ToUserVO userVo = TOMapper.selectToUsersDetailBySecretKeyTemp(paramMap); 
			req.getSession().setAttribute("userInfo", userVo);
			if("Y".equals(userVoIsLeaveYn.getLeaveYn())) {
				resultCd = "0002";	// 탈퇴 회원
				resultMsg = "탈퇴 회원입니다.";
			}else if(userVo == null) {
				resultCd = "0001";	// 미가입 회원
				resultMsg = "보안번호 오류입니다.";
			} else {
				// 로그인 사용자정보 session set
				// 필요 시 추후 Interceptor 설정으로 로그인 유효성 체크 해야함
				HttpSession session = req.getSession();
				session.setAttribute("userInfo", userVo);
				resultCd = "0000";
				resultMsg = "로그인 성공";
			}
			model.addAttribute("resultCd", resultCd);
			model.addAttribute("resultMsg", resultMsg);
			model.addAttribute("userInfo", userVo);
		}catch(Exception e) {
			e.printStackTrace();
		}
        return jsonview;
	};		



	@RequestMapping(value = "/TOM_19/recreatePassword.do")
	public View recreatePassword(@RequestParam Map mocaMap, 
			HttpServletRequest request,HttpServletResponse response,
			ModelMap model) throws Exception{
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap); 
			Map userInfo = TOMapper.selectUserPhoneEmail(paramMap);
			if(userInfo != null) {
				String Mobile_Phone = (String)userInfo.get("Mobile_Phone");
				String password = Util.generateAuthNo4();
				paramMap.put("Mobile_Phone", Mobile_Phone);
				paramMap.put("SecretKeyTemp", password);
				TOMapper.updateSecretKeyTemp(paramMap);
				model.addAttribute("Mobile_Phone", Mobile_Phone);
				Util.biz_talk_api_secretKey(paramMap);
			}
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	};	
		
	@RequestMapping(value = "/TOM_02/updatePassword.do")
	public View updatePassword(@RequestParam Map mocaMap, 
			HttpServletRequest request,HttpServletResponse response,
			ModelMap model) throws Exception{
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap); 
			model.addAttribute("cnt", TOMapper.updateSecretKey(paramMap));
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	};	
	
	@RequestMapping(value = "/TOM_83/selecIsTimeOn.do")
	public View selecIsTimeOn(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			Map<String, Object> mapTimeCheck = TOMapper.selecIsTimeOn(paramMap);
			model.addAttribute("mapTimeCheck", mapTimeCheck);
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
		return jsonview;
	};
	
	@RequestMapping(value = "/TOM_39/selecIsTimeOnForTORequest.do")
	public View selecIsTimeOnForTORequest(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			Map<String, Object> mapTimeCheck = TOMapper.selecIsTimeOnForTORequest(paramMap);
			model.addAttribute("mapTimeCheck", mapTimeCheck);
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
		return jsonview;
	};

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//개인간 소유권 이전 채널 관리
	//이전채널 설정 목록 조회
	@RequestMapping(value = "/TO_017/selectTrfnChnlList.do")
	public View selectTrfnChnlList(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		LOGGER.debug("[TOController] selectTrfnChnlList is started ");
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			
			model.addAttribute("tfrnChnlList", TOMapper.selectTrfnChnlList(paramMap));
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
		
		LOGGER.debug("[TOController] selectTrfnChnlList is ended ");
		
        return jsonview;
	}

	// 이전채널 입력/수정/삭제 처리
    @RequestMapping(value="/TO_017/modifyTfrnChnlList.do")
	public View modifyTfrnChnlList (@RequestParam Map <String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			toService.modifyTfrnChnlList(mocaMap, model);
			model.addAttribute("message", "성공적으로 저장하였습니다");
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
		return jsonview;   	
    }

	/**
	 * 개인간 소유권 이전 채널을 조회한다.
	 *
	 * @param paramMap Map
	 * @return tfrnChnlCd String 이전채널 코드
	 */
	// 조건에 맞는 이전채널 코드 조회
    @RequestMapping(value="/TO/common/getTfrnChnlCd.do")
	public View getTfrnChnlCd (@RequestParam Map <String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			
			// 차량유형 체크
			if(paramMap.get("vhclTypNm") == null || "".equals(paramMap.get("vhclTypNm"))) {
				model.addAttribute("error", "차량유형 Param이 없습니다.");
				return jsonview;
			}
			// 감면대상여부 체크
			if(paramMap.get("tfrnChnlDvFiltYn") == null || "".equals(paramMap.get("tfrnChnlDvFiltYn"))) {
				model.addAttribute("error", "친환경 감면대상 여부 Param 이 없습니다.");
				return jsonview;
			}
			
			Map<String, Object> tMap = new HashMap<String, Object>();
			//차량유형코드
			tMap.put("codeId", "PSN001");
			tMap.put("codeNm", paramMap.get("vhclTypNm"));
			String vhclTypCd = TOMapper.selectComCdByName(tMap);
			if(vhclTypCd == null) {
				model.addAttribute("error", "이전채널을 조회 할 수 없습니다.");
				return jsonview;
			}
			paramMap.put("vhclTypCd", TOMapper.selectComCdByName(tMap));
			//친환경 감면대상코드
			if("Y".equals(paramMap.get("tfrnChnlDvFiltYn")))
				paramMap.put("tfrnChnlDvFiltCd", "02");			// 친환경감면대상
			else
				paramMap.put("tfrnChnlDvFiltCd", "01");			// 일반
 			
			model.addAttribute("tfrnChnlCd", TOMapper.selectTrfnChnlCd(paramMap));
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
    }
    
	/**
	 * 통합 납부 영수증 목록을 조회한다.
	 *
	 * @param paramMap Map
	 * @return tfrnChnlCd String 이전채널 코드
	 */
	@RequestMapping(value = "/TO_018/selectUnfyPayVouList.do")
	public View selectUnfyPayVouList(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		LOGGER.debug("[TOController] selectUnfyPayVouList is started ");
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			
			model.addAttribute("unfyPayVouList", TOMapper.selectUnfyPayVouList(paramMap));
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
		
		LOGGER.debug("[TOController] selectTrfnChnlList is ended ");
		
        return jsonview;
	}
	
	/**
	 * 통합 납부 영수증 건별 매핑
	 * @param : paramMap Map
	 * @return 
	 *
	 */
	@RequestMapping(value = "/TO_018/procUnfyPayVou.do")
	public View procUnfyPayVou(@RequestParam Map mocaMap, 
			HttpServletRequest request,HttpServletResponse response,
			ModelMap model) throws Exception{

		try {
			toService.TO_018_procUnfyPayVou(mocaMap, model);
			model.addAttribute("message", "성공적으로 등록 하였습니다");
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
		
        return jsonview;
	}	
    
	/**
	 * 제조사 차량가격 조회 ( 현대/기아차 만 가능 )
	 * @param : vhidNo 차대번호
	 * @return map
	 * 		"vhidNo", 			// 차대번호 (String)
	 *		"sclssNm", 			// 소분류명 (String)
	 *		"basePrc", 			// 기본가격 (Decimal)
	 *		"salePrc", 			// 차량가격 (Decimal)
	 *		"mdlNm" 			// 모델명   (String)
	 */
	@RequestMapping(value = "/TO/common/inqPrcFromMfco.do")
	public View inqPrcFromMfco(@RequestParam Map mocaMap, 
			HttpServletRequest request,HttpServletResponse response,
			ModelMap model) throws Exception{

		Map paramMap = U.getBodyNoSess(mocaMap);
		
		String vhidNo = (String)paramMap.get("vhidNo");
		
		Map resMap = toService.inqPrcFromMfco(vhidNo);
		LOGGER.debug("resMap = " + resMap);
		model.addAttribute("response", resMap);
		
        return jsonview;
	}
	
	@RequestMapping(value = "/TOM_47/mobile/typeSelect.do")
	public View typeSelect(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			
			model.addAttribute("vhclTypCd", TOMapper.carTypeSelect(paramMap));
			model.addAttribute("tfrnChnlDvFiltCd", TOMapper.ecoTypeSelect(paramMap));
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
	//게시판 조회  
	@RequestMapping(value = "/EFC_BOARD/selectBoardList.do")
	public View selectBoardList(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			paramMap.put("BOARD_CONT", U.strToArr((String)paramMap.get("BOARD_CONT")," "));
			
			//if("WS".equals((String)paramMap.get("BOARD_TYPE")) || "NOTICE".equals((String)paramMap.get("BOARD_TYPE"))) {
			//	paramMap.put("BOARD_TABLE", "MT_BOARD");
			//	paramMap.put("BOARD_FILE_TABLE", "MT_BOARDFILE");
			//}else if("ERP".equals((String)paramMap.get("BOARD_TYPE")) || "SUPPORT".equals((String)paramMap.get("BOARD_TYPE"))){
				paramMap.put("BOARD_TABLE", "MT_BOARD_ERP");
				paramMap.put("BOARD_FILE_TABLE", "MT_BOARDFILE_ERP");
			//}
			
			model.addAttribute("selectBoardList", TOMapper.selectBoardList(paramMap)); //조회
			Map map = new HashMap(); 
			List list = TOMapper.selectBoardStatusCnt(paramMap);
			for(int i=0; i < list.size(); i++) {
				Map row = (Map)list.get(i);
				String type = String.valueOf(row.get("BOARD_SUPPORT"));
				String cnt = String.valueOf(row.get("CNT"));
				map.put(type, cnt);
			}
			model.addAttribute("selectBoardStatusCnt", map); //접수상태
			
			
			
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
	//게시판 조회  numList
	@RequestMapping(value = "/EFC_BOARD/selectBoardNumList.do")
	public View selectBoardNumList(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			paramMap.put("BOARD_CONT", U.strToArr((String)paramMap.get("BOARD_CONT")," "));
			//if("WS".equals((String)paramMap.get("BOARD_TYPE")) || "NOTICE".equals((String)paramMap.get("BOARD_TYPE"))) {
			//	paramMap.put("BOARD_TABLE", "MT_BOARD");
			//	paramMap.put("BOARD_FILE_TABLE", "MT_BOARDFILE");
			//}else if("ERP".equals((String)paramMap.get("BOARD_TYPE")) || "SUPPORT".equals((String)paramMap.get("BOARD_TYPE"))){
				paramMap.put("BOARD_TABLE", "MT_BOARD_ERP");
				paramMap.put("BOARD_FILE_TABLE", "MT_BOARDFILE_ERP");
			//}
			model.addAttribute("selectBoardList", TOMapper.selectBoardNumList(paramMap));//페이징 조회
			Map map = new HashMap(); 
			List list = TOMapper.selectBoardStatusCnt(paramMap);
			for(int i=0; i < list.size(); i++) {
				Map row = (Map)list.get(i);
				String type = String.valueOf(row.get("BOARD_SUPPORT"));
				String cnt = String.valueOf(row.get("CNT"));
				map.put(type, cnt);
			}
			
			model.addAttribute("selectBoardStatusCnt", map); //접수상태
			model.addAttribute("selectBoardTotCnt", TOMapper.selectBoardTotCnt(paramMap).get("TOTCNT")); //총건수
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
	//게시글 작성
	@RequestMapping(value = "/EFC_BOARD/insertBoard.do")
	public View insertBoard(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			//if("WS".equals((String)paramMap.get("BOARD_TYPE")) || "NOTICE".equals((String)paramMap.get("BOARD_TYPE"))) {
			//	paramMap.put("BOARD_TABLE", "MT_BOARD");
			//	paramMap.put("BOARD_FILE_TABLE", "MT_BOARDFILE");
			//	paramMap.put("BOARD_HIS_TABLE", "MT_BOARDHIS");
			//}else if("ERP".equals((String)paramMap.get("BOARD_TYPE")) || "SUPPORT".equals((String)paramMap.get("BOARD_TYPE"))){
				paramMap.put("BOARD_TABLE", "MT_BOARD_ERP");
				paramMap.put("BOARD_FILE_TABLE", "MT_BOARDFILE_ERP");
				paramMap.put("BOARD_HIS_TABLE", "MT_BOARDHIS_ERP");
			//}
			
			model.addAttribute("cnt", TOMapper.insertBoard(paramMap));
			
			
			if(paramMap.get("BOARD_PIDX") == null) {
				paramMap.put("BOARD_PIDX", paramMap.get("BOARD_IDX"));
				TOMapper.updateBoardInfo(paramMap);
			}else if(paramMap.get("BOARD_PIDX") != null && paramMap.get("BOARD_PIDX") != paramMap.get("BOARD_IDX")) {
				TOMapper.updateBoardDate(paramMap);
			}
			paramMap.put("status", "C");TOMapper.insertBoardHis(paramMap);
	    	List list = (List)paramMap.get("fileList"); //자바스크립트에서 받아온 값을 자바언어구조로 바꿈
	    	for(int i=0;i < list.size() ;i++) {
        		Map row = (Map)list.get(i);
        		row.put("BOARD_IDX", paramMap.get("BOARD_IDX"));
        		
    			//if("WS".equals((String)paramMap.get("BOARD_TYPE")) || "NOTICE".equals((String)paramMap.get("BOARD_TYPE"))) {
    			//	row.put("BOARD_TABLE", "MT_BOARD");
    			//	row.put("BOARD_FILE_TABLE", "MT_BOARDFILE");
    			//	row.put("BOARD_HIS_TABLE", "MT_BOARDHIS");
    			//}else if("ERP".equals((String)paramMap.get("BOARD_TYPE")) || "SUPPORT".equals((String)paramMap.get("BOARD_TYPE"))){
    				row.put("BOARD_TABLE", "MT_BOARD_ERP");
    				row.put("BOARD_FILE_TABLE", "MT_BOARDFILE_ERP");
    				row.put("BOARD_HIS_TABLE", "MT_BOARDHIS_ERP");
    			//}
            	if("C".equalsIgnoreCase(U.getStatus(row)) ) {
        			TOMapper.insertBoardFile(row);
            	}
        	}
        	
	    	
	    	Map map = new HashMap();
	    	String _writer = paramMap.get("BOARD_WRITER").toString();
	    	if(_writer.equals("superadmin")){
	    		map.put("PROP_KEY","superadmin이쓴거를받을수신자");
	    	}else if(_writer.equals("hjsung")) {
	    		map.put("PROP_KEY","hjsung이쓴거를받을수신자");
	    	}else {
	    		map.put("PROP_KEY","업무게시판수신자");
	    	}
	    	
	    	String BOARD_CONT = paramMap.get("GET_CONT_TXT").toString();
	    	System.out.println("원본BOARD_CONT~~~~~~~~~~~>>>"+BOARD_CONT);
	    	BOARD_CONT = BOARD_CONT.replaceAll("(?ism)(\\<.*?\\>)","").replaceAll("(?ism)(\\&.*?\\;)","").replaceAll("(?ism)[^a-zA-Z0-9 ㄱ-ㅎㅏ-ㅣ가-힣]","");
			System.out.println("변경BOARD_CONT~~~~~~~~~~~>>>"+BOARD_CONT);
	    	List EFGPRPOP_list = mocaEFLService.selectList_EFGPROP(map);
	    	if(EFGPRPOP_list != null && EFGPRPOP_list.size() > 0){
	    		Map phonenumber = (Map)EFGPRPOP_list.get(0);
		    	API.sendSms(
		    			"[teammoca발신]\n"+BOARD_CONT,
		    			phonenumber.get("PROP_VALUE").toString(),
		    			paramMap.get("BOARD_WRITER").toString()
		    	);
	    	}
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
	//게시판 답변카운트
		@RequestMapping(value = "/EFC_BOARD/updateReplyCnt.do")
		public View updateReplyCnt(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
			
			try {
				Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
				//if("WS".equals((String)paramMap.get("BOARD_TYPE")) || "NOTICE".equals((String)paramMap.get("BOARD_TYPE"))) {
				//	paramMap.put("BOARD_TABLE", "MT_BOARD");
				//	paramMap.put("BOARD_FILE_TABLE", "MT_BOARDFILE");
				//}else if("ERP".equals((String)paramMap.get("BOARD_TYPE")) || "SUPPORT".equals((String)paramMap.get("BOARD_TYPE"))){
					paramMap.put("BOARD_TABLE", "MT_BOARD_ERP");
					paramMap.put("BOARD_FILE_TABLE", "MT_BOARDFILE_ERP");
				//}
				
				int cnt = TOMapper.updateReplyCnt(paramMap);
				model.addAttribute("cnt", cnt);		
			}catch(Exception e) {
				e.printStackTrace();
				model.addAttribute("error", e.getMessage());
			}
	        return jsonview;
		}
	
	//게시판 답변 조회  
	@RequestMapping(value = "/EFC_BOARD/selectBoardReply.do")
	public View selectBoardReplyList(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			
			//if("WS".equals((String)paramMap.get("BOARD_TYPE")) || "NOTICE".equals((String)paramMap.get("BOARD_TYPE"))) {
			//	paramMap.put("BOARD_TABLE", "MT_BOARD");
			//	paramMap.put("BOARD_FILE_TABLE", "MT_BOARDFILE");
			//}else if("ERP".equals((String)paramMap.get("BOARD_TYPE")) || "SUPPORT".equals((String)paramMap.get("BOARD_TYPE"))){
				paramMap.put("BOARD_TABLE", "MT_BOARD_ERP");
				paramMap.put("BOARD_FILE_TABLE", "MT_BOARDFILE_ERP");
			//}
			
			model.addAttribute("selectBoardReply", TOMapper.selectBoardReply(paramMap));
			
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
	//게시판 상세조회  
	@RequestMapping(value = "/EFC_BOARD/selectBoardInfo.do")
	public View selectBoardInfo(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			
			//if("WS".equals((String)paramMap.get("BOARD_TYPE")) || "NOTICE".equals((String)paramMap.get("BOARD_TYPE"))) {
			//	paramMap.put("BOARD_TABLE", "MT_BOARD");
			//	paramMap.put("BOARD_FILE_TABLE", "MT_BOARDFILE");
				
			//}else if("ERP".equals((String)paramMap.get("BOARD_TYPE")) || "SUPPORT".equals((String)paramMap.get("BOARD_TYPE"))){
				paramMap.put("BOARD_TABLE", "MT_BOARD_ERP");
				paramMap.put("BOARD_FILE_TABLE", "MT_BOARDFILE_ERP");
			//}
			
			model.addAttribute("selectBoardInfo", TOMapper.selectBoardInfo(paramMap));
			model.addAttribute("selectBoardFileList", TOMapper.selectBoardFileList(paramMap));
			
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	//게시판 수정
	@RequestMapping(value = "/EFC_BOARD/updateBoard.do")
	public View UpdateBoardInfo(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			
			//if("WS".equals((String)paramMap.get("BOARD_TYPE")) || "NOTICE".equals((String)paramMap.get("BOARD_TYPE"))) {
			//	paramMap.put("BOARD_TABLE", "MT_BOARD");
			//	paramMap.put("BOARD_FILE_TABLE", "MT_BOARDFILE");
			//	paramMap.put("BOARD_HIS_TABLE", "MT_BOARDHIS");
			//}else if("ERP".equals((String)paramMap.get("BOARD_TYPE")) || "SUPPORT".equals((String)paramMap.get("BOARD_TYPE"))){
				paramMap.put("BOARD_TABLE", "MT_BOARD_ERP");
				paramMap.put("BOARD_FILE_TABLE", "MT_BOARDFILE_ERP");
				paramMap.put("BOARD_HIS_TABLE", "MT_BOARDHIS_ERP");
			//}
			
			int cnt = TOMapper.updateBoardInfo(paramMap);
			String BOARD_DELYN = (String) paramMap.get("BOARD_DELYN");
			if("Y".equals(BOARD_DELYN)) {
				paramMap.put("status", "D");
			}else {
				paramMap.put("status", "U");
				List list = (List)paramMap.get("fileList"); //자바스크립트에서 받아온 값을 자바언어구조로 바꿈
				if(list != null) {
					model.addAttribute("cnt", TOMapper.deleteBoardFileList(paramMap));
					for(int i=0;i < list.size() ;i++) {
		        		Map row = (Map)list.get(i);
		        		row.put("BOARD_IDX", paramMap.get("BOARD_IDX"));
		        		
		    			//if("WS".equals((String)paramMap.get("BOARD_TYPE")) || "NOTICE".equals((String)paramMap.get("BOARD_TYPE"))) {
		    			//	row.put("BOARD_TABLE", "MT_BOARD");
		    			//	row.put("BOARD_FILE_TABLE", "MT_BOARDFILE");
		    			//	row.put("BOARD_HIS_TABLE", "MT_BOARDHIS");
		    			//}else if("ERP".equals((String)paramMap.get("BOARD_TYPE")) || "SUPPORT".equals((String)paramMap.get("BOARD_TYPE"))){
		    				row.put("BOARD_TABLE", "MT_BOARD_ERP");
		    				row.put("BOARD_FILE_TABLE", "MT_BOARDFILE_ERP");
		    				row.put("BOARD_HIS_TABLE", "MT_BOARDHIS_ERP");
		    			//}
		            	if("C".equalsIgnoreCase(U.getStatus(row)) ) {
		        			TOMapper.insertBoardFile(row);
		            	}
		        	}
				}
				if(paramMap.get("BOARD_PIDX") != null && paramMap.get("BOARD_PIDX") != paramMap.get("BOARD_IDX")) {
					TOMapper.updateBoardDate(paramMap);
				}
			}
			TOMapper.insertBoardHis(paramMap);
			model.addAttribute("cnt", cnt);		
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
	//게시판 자동수정
	@RequestMapping(value = "/EFC_BOARD/updateBoardAuto.do")
	public View updateBoardAuto(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			
			//if("WS".equals((String)paramMap.get("BOARD_TYPE")) || "NOTICE".equals((String)paramMap.get("BOARD_TYPE"))) {
			//	paramMap.put("BOARD_TABLE", "MT_BOARD");
			//	paramMap.put("BOARD_FILE_TABLE", "MT_BOARDFILE");
			//	paramMap.put("BOARD_HIS_TABLE", "MT_BOARDHIS");
			//}else if("ERP".equals((String)paramMap.get("BOARD_TYPE")) || "SUPPORT".equals((String)paramMap.get("BOARD_TYPE"))){
				paramMap.put("BOARD_TABLE", "MT_BOARD_ERP");
				paramMap.put("BOARD_FILE_TABLE", "MT_BOARDFILE_ERP");
			//}
			
			int cnt = TOMapper.updateBoardInfo(paramMap);
			String BOARD_DELYN = (String) paramMap.get("BOARD_DELYN");
			if("Y".equals(BOARD_DELYN)) {
				paramMap.put("status", "D");
			}else {
				paramMap.put("status", "U");
				List list = (List)paramMap.get("fileList"); //자바스크립트에서 받아온 값을 자바언어구조로 바꿈
				if(list != null) {
					//model.addAttribute("cnt", TOMapper.deleteBoardFileList(paramMap));
					for(int i=0;i < list.size() ;i++) {
		        		Map row = (Map)list.get(i);
		        		row.put("BOARD_IDX", paramMap.get("BOARD_IDX"));
		        		
		    				row.put("BOARD_TABLE", "MT_BOARD_ERP");
		    				row.put("BOARD_FILE_TABLE", "MT_BOARDFILE_ERP");
		    			//}
		            	if("C".equalsIgnoreCase(U.getStatus(row)) ) {
		        			TOMapper.insertBoardFile(row);
		            	}
		        	}
				}
				if(paramMap.get("BOARD_PIDX") != null && paramMap.get("BOARD_PIDX") != paramMap.get("BOARD_IDX")) {
					TOMapper.updateBoardDate(paramMap);
				}
			}
			model.addAttribute("cnt", cnt);		
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
		
	//게시판 단건물리삭제(관리자삭제)
	@RequestMapping(value = "/EFC_BOARD/deleteBoard.do")
	public View deleteBoard(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			//if("WS".equals((String)paramMap.get("BOARD_TYPE")) || "NOTICE".equals((String)paramMap.get("BOARD_TYPE"))) {
			//	paramMap.put("BOARD_TABLE", "MT_BOARD");
			//	paramMap.put("BOARD_FILE_TABLE", "MT_BOARDFILE");
			//	paramMap.put("BOARD_HIS_TABLE", "MT_BOARDHIS");
				
			//}else if("ERP".equals((String)paramMap.get("BOARD_TYPE")) || "SUPPORT".equals((String)paramMap.get("BOARD_TYPE"))){
				paramMap.put("BOARD_TABLE", "MT_BOARD_ERP");
				paramMap.put("BOARD_FILE_TABLE", "MT_BOARDFILE_ERP");
				paramMap.put("BOARD_HIS_TABLE", "MT_BOARDHIS_ERP");
			//}
			paramMap.put("status", "AD");TOMapper.insertBoardHis(paramMap);
			model.addAttribute("cnt", TOMapper.deleteBoard(paramMap));
			TOMapper.updateReplyCnt(paramMap);
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
	//게시판 리스트물리삭제(관리자삭제)
	@RequestMapping(value = "/EFC_BOARD/deleteBoardList.do")
	public View deleteBoardList(@RequestParam Map param, 
			@RequestParam Map <String, Object> mocaMap,
			ModelMap model) throws Exception {
		if(!U.preCheck(model)) {return jsonview;}
		
    	Map bodyMap = U.getBody(mocaMap);
    	
    	
    	
    	List list = (List)bodyMap.get("paramList"); //자바스크립트에서 받아온 값을 자바언어구조로 바꿈
    	try {
    		//여기
        	for(int i=0;i < list.size() ;i++) {
        		Map row = (Map)list.get(i);
        			/*
	        		if("WS".equals((String)bodyMap.get("BOARD_TYPE")) || "NOTICE".equals((String)bodyMap.get("BOARD_TYPE"))) {
	            		row.put("BOARD_TABLE", "MT_BOARD");
	            		row.put("BOARD_HIS_TABLE", "MT_BOARDHIS");
	        		}else if("ERP".equals((String)bodyMap.get("BOARD_TYPE")) || "SUPPORT".equals((String)bodyMap.get("BOARD_TYPE"))){
	        			row.put("BOARD_TABLE", "MT_BOARD_ERP");
	        			row.put("BOARD_HIS_TABLE", "MT_BOARDHIS_ERP");
	        		}
	        		*/
        		
	        		row.put("BOARD_TABLE", "MT_BOARD_ERP");
	        		row.put("BOARD_FILE_TABLE", "MT_BOARDFILE_ERP");
					row.put("BOARD_HIS_TABLE", "MT_BOARDHIS_ERP");
        			row.put("status", "AD");TOMapper.insertBoardHis(row);
        			model.addAttribute("cnt", TOMapper.deleteBoard(row));
        	}
        	
    	}catch(Exception e) {
    		e.printStackTrace();
    	}
        return jsonview;
	}
	
	//게시판 단건논리삭제(DELYN)
	@RequestMapping(value = "/EFC_BOARD/deleteStatusBoard.do")
	public View deleteStatusBoard(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			//if("WS".equals((String)paramMap.get("BOARD_TYPE")) || "NOTICE".equals((String)paramMap.get("BOARD_TYPE"))) {
			//	paramMap.put("BOARD_TABLE", "MT_BOARD");
			//	paramMap.put("BOARD_FILE_TABLE", "MT_BOARDFILE");
			//	paramMap.put("BOARD_HIS_TABLE", "MT_BOARDHIS");
				
			//}else if("ERP".equals((String)paramMap.get("BOARD_TYPE")) || "SUPPORT".equals((String)paramMap.get("BOARD_TYPE"))){
				paramMap.put("BOARD_TABLE", "MT_BOARD_ERP");
				paramMap.put("BOARD_FILE_TABLE", "MT_BOARDFILE_ERP");
				paramMap.put("BOARD_HIS_TABLE", "MT_BOARDHIS_ERP");
			//}
			paramMap.put("status", "D");TOMapper.insertBoardHis(paramMap);
			model.addAttribute("cnt", TOMapper.deleteStatusBoard(paramMap));
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
	//게시판 리스트논리삭제(DELYN)
	@RequestMapping(value = "/EFC_BOARD/deleteStatusBoardList.do")
	public View updateDeleteBoardList(@RequestParam Map param, 
			@RequestParam Map <String, Object> mocaMap,
			ModelMap model) throws Exception {
		if(!U.preCheck(model)) {return jsonview;}
		
    	Map bodyMap = U.getBody(mocaMap);
    	List list = (List)bodyMap.get("paramList"); //자바스크립트에서 받아온 값을 자바언어구조로 바꿈
    	try {
        	for(int i=0;i < list.size() ;i++) {
        		Map row = (Map)list.get(i);
        		//row.put("CORP_CD", bodyMap.get("CORP_CD"));
        		//row.put("SYS_CD", bodyMap.get("SYS_CD"));

            	//if("U".equalsIgnoreCase(U.getStatus(row)) ) {
        		/*
	        		if("WS".equals((String)bodyMap.get("BOARD_TYPE")) || "NOTICE".equals((String)bodyMap.get("BOARD_TYPE"))) {
	        			row.put("BOARD_TABLE", "MT_BOARD");
	        			row.put("BOARD_HIS_TABLE", "MT_BOARDHIS");
	        		}else if("ERP".equals((String)bodyMap.get("BOARD_TYPE")) || "SUPPORT".equals((String)bodyMap.get("BOARD_TYPE"))){
	        			row.put("BOARD_TABLE", "MT_BOARD_ERP");
	        			row.put("BOARD_HIS_TABLE", "MT_BOARDHIS_ERP");
	        		}
	        	*/
	        		row.put("BOARD_TABLE", "MT_BOARD_ERP");
	        		row.put("BOARD_FILE_TABLE", "MT_BOARDFILE_ERP");
	        		row.put("BOARD_HIS_TABLE", "MT_BOARDHIS_ERP");
        			row.put("status", "MD");TOMapper.insertBoardHis(row);
            		model.addAttribute("cnt", TOMapper.deleteStatusBoard(row));
            	//}
        	}
    	}catch(Exception e) {
    		e.printStackTrace();
    	}
        return jsonview;
	}
	
	//게시글 이력작성
	@RequestMapping(value = "/EFC_BOARD/insertBoardHis.do")
	public View insertBoardHis(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			if("ERP".equals((String)paramMap.get("BOARD_TYPE"))) {
				paramMap.put("BOARD_HIS_TABLE", "MT_BOARDHIS_ERP");
			}else {
				paramMap.put("BOARD_HIS_TABLE", "MT_BOARDHIS");
			}
			model.addAttribute("cnt", TOMapper.insertBoardHis(paramMap));
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
		
	//게시판이력 조회  
	@RequestMapping(value = "/EFC_BOARD_HIS/selectBoardHisList.do")
	public View selectBoardHisList(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			if("ERP".equals((String)paramMap.get("BOARD_TYPE"))) {
				paramMap.put("BOARD_HIS_TABLE", "MT_BOARDHIS_ERP");
			}else {
				paramMap.put("BOARD_HIS_TABLE", "MT_BOARDHIS");
			}
			
			model.addAttribute("selectBoardHisList", TOMapper.selectBoardHisList(paramMap));
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
	//게시판이력 상세조회  
	@RequestMapping(value = "/EFC_BOARD_HIS/selectBoardHisInfo.do")
	public View selectBoardHisInfo(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			//if("WS".equals((String)paramMap.get("BOARD_TYPE")) || "NOTICE".equals((String)paramMap.get("BOARD_TYPE"))) {
			//	paramMap.put("BOARD_TABLE", "MT_BOARD");
			//	paramMap.put("BOARD_FILE_TABLE", "MT_BOARDFILE");
			//	paramMap.put("BOARD_HIS_TABLE", "MT_BOARDHIS");
			//}else if("ERP".equals((String)paramMap.get("BOARD_TYPE")) || "SUPPORT".equals((String)paramMap.get("BOARD_TYPE"))){
				paramMap.put("BOARD_TABLE", "MT_BOARD_ERP");
				paramMap.put("BOARD_FILE_TABLE", "MT_BOARDFILE_ERP");
				paramMap.put("BOARD_HIS_TABLE", "MT_BOARDHIS_ERP");
			//}
			model.addAttribute("selectBoardHisInfo", TOMapper.selectBoardHisInfo(paramMap));
			model.addAttribute("selectBoardFileList", TOMapper.selectBoardFileList(paramMap));
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
	//게시판파일업로드 조회  
	@RequestMapping(value = "/EFC_BOARD/selectBoardFileList.do")
	public View selectBoardFileList(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			//if("WS".equals((String)paramMap.get("BOARD_TYPE")) || "NOTICE".equals((String)paramMap.get("BOARD_TYPE"))) {
			//	paramMap.put("BOARD_TABLE", "MT_BOARD");
			//	paramMap.put("BOARD_FILE_TABLE", "MT_BOARDFILE");
			//}else if("ERP".equals((String)paramMap.get("BOARD_TYPE")) || "SUPPORT".equals((String)paramMap.get("BOARD_TYPE"))){
				paramMap.put("BOARD_TABLE", "MT_BOARD_ERP");
				paramMap.put("BOARD_HIS_TABLE", "MT_BOARDHIS_ERP");
			//}
			model.addAttribute("selectBoardFileList", TOMapper.selectBoardFileList(paramMap));
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
	//게시판 접수
	@RequestMapping(value = "/EFC_BOARD/receiptBoard.do")
	public View receiptBoard(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			//if("WS".equals((String)paramMap.get("BOARD_TYPE")) || "NOTICE".equals((String)paramMap.get("BOARD_TYPE"))) {
			//	paramMap.put("BOARD_TABLE", "MT_BOARD");
			//	paramMap.put("BOARD_FILE_TABLE", "MT_BOARDFILE");
			//}else if("ERP".equals((String)paramMap.get("BOARD_TYPE")) || "SUPPORT".equals((String)paramMap.get("BOARD_TYPE"))){
				paramMap.put("BOARD_TABLE", "MT_BOARD_ERP");
				paramMap.put("BOARD_HIS_TABLE", "MT_BOARDHIS_ERP");
			//}
			
			model.addAttribute("cnt", TOMapper.receiptBoard(paramMap));
			paramMap.put("status", "U");TOMapper.insertBoardHis(paramMap);
			
			String _BOARD_SUPPORT = paramMap.get("BOARD_SUPPORT").toString();
			String _BOARD_WRITERPHONE = paramMap.get("BOARD_WRITERPHONE").toString();
			String BOARD_CONT = paramMap.get("BOARD_CONT").toString();
			if(BOARD_CONT.length() > 20) {
				BOARD_CONT = BOARD_CONT.substring(0,20);
			}		
					
			if(_BOARD_SUPPORT.equals("Y") && _BOARD_WRITERPHONE != null){
				//완료일경우만 
		    	API.sendSms(
		    			"[teammoca발신]\n"+BOARD_CONT+"...요청건이 완료되었습니다.",
		    			_BOARD_WRITERPHONE,
		    			paramMap.get("BOARD_WRITER").toString()
		    	);
			};
			Map map = new HashMap();
	    	map.put("PROP_KEY","업무게시판수신자");
	    	String sendPhoneNum = "01090789322,01091168072";
			List EFGPRPOP_list = mocaEFLService.selectList_EFGPROP(map);
			String BOARD_STATUS = "";
			if(_BOARD_SUPPORT.equals("Y")){
				BOARD_STATUS = "완료";
			}else if(_BOARD_SUPPORT.equals("B")) {
				BOARD_STATUS = "반려";
			}else if(_BOARD_SUPPORT.equals("R")) {
				BOARD_STATUS = "접수";
			}
			
			System.out.println("EFGPRPOP_list~~~~~~~~~~~>>>>"+EFGPRPOP_list);
			if(EFGPRPOP_list != null && EFGPRPOP_list.size() > 0){
	    		Map phonenumber = (Map)EFGPRPOP_list.get(0);
		    	API.sendSms(
		    			"[teammoca발신]\n"+BOARD_CONT+"...요청건이 "+BOARD_STATUS+"되었습니다.",
		    			sendPhoneNum,
		    			paramMap.get("BOARD_WRITER").toString()
		    	);
	    	}
			
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
	//스케줄러 조회  
	@RequestMapping(value = "/EFC_SCHEDULER/selectScheduleList.do")
	public View selectScheduleList(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			List list = TOMapper.selectScheduleList(paramMap);
			model.addAttribute("selectScheduleList",list);
			System.out.println(list);
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
	//스케줄러 작성
	@RequestMapping(value = "/EFC_SCHEDULER/insertSchedule.do")
	public View insertSchedule(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			model.addAttribute("cnt", TOMapper.insertSchedule(paramMap));

		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
	//스케줄러 상세조회  
	@RequestMapping(value = "/EFC_SCHEDULER/selectScheduleInfo.do")
	public View selectScheduleInfo(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			model.addAttribute("selectScheduleInfo", TOMapper.selectScheduleInfo(paramMap));
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
	//스케줄러 수정
	@RequestMapping(value = "/EFC_SCHEDULER/updateScheduleInfo.do")
	public View updateScheduleInfo(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			int cnt = TOMapper.updateScheduleInfo(paramMap);
			model.addAttribute("cnt", cnt);		
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
	//스케줄러 삭제(DELYN)
	@RequestMapping(value = "/EFC_SCHEDULER/deleteScheduleInfo.do")
	public View deleteScheduleInfo(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			model.addAttribute("cnt", TOMapper.deleteScheduleInfo(paramMap));
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
//	6. 회원가입
//	- inqType 1: 신규가입, 2: 탈퇴 후 재가입(탈퇴는 관리자에서 처리함)
	@RequestMapping(value = {"/main/insertUserInfo.do"})
	public View insertUserInfo(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			int cnt = 0;
			//cnt = TOMapper.insertMocaUsers(paramMap);
			model.addAttribute("cnt", cnt);
			
			
    		UserManageVO userManageVO = new UserManageVO();
    		userManageVO.setEmplyrId((String)paramMap.get("USER_KAKAO_ID"));
    		userManageVO.setEmplyrNm((String)paramMap.get("USER_NAME"));
    		userManageVO.setOrgnztId("social");
    		userManageVO.setEmplyrSttusCode("P");
    		userManageVO.setAuthorCode("ROLE_HOMEPAGE");
    		userManageVO.setPassword((String)paramMap.get("USER_KAKAO_ID"));
			String pass = EgovFileScrty.encryptPassword(userManageVO.getPassword(), userManageVO.getEmplyrId());
			userManageVO.setPassword(pass);
    		
			userManageService.insertUser(userManageVO);
			System.out.println("userManageVO~~~~~~>>>>"+userManageVO);
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
	    return jsonview;
	};
	
	//모카사용자 조회  
	@RequestMapping(value = "/main/selectMocaUserInfo.do")
	public View selectMocaUserInfo(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			model.addAttribute("selectMocaUserInfo", TOMapper.selectMocaUserInfo(paramMap));
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
	//소셜로그인시 메세지
	@RequestMapping(value = "/main/sendSmsLoginInfo.do")
	public View sendSmsLoginInfo(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			
			Map map = new HashMap();
	    	map.put("PROP_KEY","업무게시판수신자");
	    	
	    	List EFGPRPOP_list = mocaEFLService.selectList_EFGPROP(map);
	    	if(EFGPRPOP_list != null && EFGPRPOP_list.size() > 0){
	    		Map phonenumber = (Map)EFGPRPOP_list.get(0);
		    	API.sendSms(
		    			(String)paramMap.get("USER_NAME")+"님이 소셜로그인 하셨습니다.",
		    			phonenumber.get("PROP_VALUE").toString(),
		    			(String)paramMap.get("USER_NAME")
		    	);
	    	}
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
	//TEST 조회  
	@RequestMapping(value = "/MT_TEST/selectTestList.do")
	public View selectTestList(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			List list = TOMapper.selectTestList(paramMap);
			model.addAttribute("selectTestList",list);
			System.out.println(list);
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	//TEST numlist조회  
	@RequestMapping(value = "/MT_TEST/selectTestNumList.do")
	public View selectTestNumList(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			List list = TOMapper.selectTestNumList(paramMap);
			model.addAttribute("selectTestNumList",list);
			model.addAttribute("selectTestNumList_totCnt", TOMapper.selectTestNumList_totCnt(paramMap).get("TOTCNT")); //총건수
			
			System.out.println(list);
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
	//임대관리_건물리스트 조회  
	@RequestMapping(value = "/RM_BUILDING/selectBuildingList.do")
	public View selectBuildingList(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			if("all".equals((String)paramMap.get("SELECT_TYPE"))) {
				List list = TOMapper.selectBuildingList(paramMap);
				model.addAttribute("selectBuildingList",list);
				System.out.println(list);
			}else if("combo".equals((String)paramMap.get("SELECT_TYPE"))) {
				List list = TOMapper.selectBuildingComboList(paramMap);
				model.addAttribute("selectBuildingComboList",list);
				System.out.println(list);
			}
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
	//임대관리_방리스트 조회  
	@RequestMapping(value = "/RM_ROOM/selectRoomList.do")
	public View selectRoomList(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			if("all".equals((String)paramMap.get("SELECT_TYPE"))) {
				List list = TOMapper.selectRoomList(paramMap);
				model.addAttribute("selectRoomList",list);
				System.out.println(list);
			}else if("combo".equals((String)paramMap.get("SELECT_TYPE"))) {
				List list = TOMapper.selectRoomComboList(paramMap);
				model.addAttribute("selectRoomComboList",list);
				System.out.println(list);
			}
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
	//임대관리_계약리스트 조회  
	@RequestMapping(value = "/RM_CONTRACT/selectContractList.do")
	public View selectContractList(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			List list = TOMapper.selectContractList(paramMap);
			model.addAttribute("selectContractList",list);
			System.out.println(list);
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
	//게시판파일업로드 조회  
	@RequestMapping(value = "/RM_CONTFILE/selectContFileList.do")
	public View selectContFileList(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			//paramMap.put("BOARD_TABLE", "RM_CONTRACT");
			model.addAttribute("selectContFileList", TOMapper.selectContFileList(paramMap));
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
	//게시판 상세조회  
	@RequestMapping(value = "/RM_CONTRACT/selectContractInfo.do")
	public View selectContractInfo(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			if(MapUtils.isEmpty(paramMap)) {
				paramMap = mocaMap;
			}
			
			model.addAttribute("selectContractInfo", TOMapper.selectContractInfo(paramMap));
			//model.addAttribute("selectBoardFileList", TOMapper.selectBoardFileList(paramMap));
			
			
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	//계약 작성
	@RequestMapping(value = "/RM_CONTRACT/insertContract.do")
	public View insertContract(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			//paramMap.put("BOARD_HIS_TABLE", "MT_BOARDHIS");
			model.addAttribute("cnt", TOMapper.insertContract(paramMap));
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
	
	//메인 티스토리 조회  
	@RequestMapping(value = "/main/selectTistroyList.do")
	public View selectTistroyList(@RequestParam Map<String, Object> mocaMap, ModelMap model) throws Exception {
		try {
			Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
			// 서비스 테스트용 구문 추가
			URL url = new URL("https://teammoca.tistory.com");
			URLConnection conn = url.openConnection();
			InputStream is = conn.getInputStream();
			Scanner scan = new Scanner(is);
			StringBuffer sb = new StringBuffer();
			while(scan.hasNext())
			{
				sb.append(scan.nextLine()+"\n");
				
			}
			String s = sb.toString();
			s = s.replaceAll("<a href=\"/", "<a target=\"_blank\" href=\"https://teammoca.tistory.com/");
			List list = new ArrayList();
			String ptnStr = "<div\\s+class=\"post-item\">.*?</div>";
			Pattern p = Pattern.compile(ptnStr,Pattern.CASE_INSENSITIVE | Pattern.DOTALL );
			Matcher m = p.matcher(s);
			int i=0;
			while(m.find()) {
				list.add(m.group());
				i++;
			}
			System.out.println("list.size:"+list.size());
			System.out.println("list:"+list);
			scan.close();
			
			model.addAttribute("selectTistroyList",list);
		}catch(Exception e) {
			e.printStackTrace();
			model.addAttribute("error", e.getMessage());
		}
        return jsonview;
	}
}