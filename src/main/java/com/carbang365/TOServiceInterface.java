package com.carbang365;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.View;

public interface TOServiceInterface  {
	public String insertMemoJson(Map<String, Object> mocaMap, ModelMap model) throws Exception;
	public String TO_006_updateAcquistionPrice(Map<String, Object> mocaMap, ModelMap model) throws Exception;
	public int excelUp(String filePath,Map paramMap,ModelMap model) throws Exception;
	public int TO_005_updateVehicleRate(Map<String, Object> mocaMap, ModelMap model) throws Exception;
	public int TO_010_updateTransferCostMng(Map<String, Object> mocaMap, ModelMap model) throws Exception;
	public int TO_012_updateEnable() throws Exception;
	public int insertTradeRequestBin(Map<String, Object> paramMap) throws Exception;
	public String insertToPaymentHistory(Map<String, Object> payReqMap) throws Exception;
	//public void selectListForInsertTradeRequest() throws Exception;
	public void reciveTransferOwnerPriceTsAfter() throws Exception;
	public void sendKakaoCert(Map<String, Object> mocaMap, ModelMap model,HttpServletRequest request) throws Exception;
	public void exeTsStep1(HttpServletRequest req, String _jsp_xml) throws Exception, InterruptedException;
	public void insertTO_COST(Map<String, Object> mocaMap, ModelMap model) throws Exception;
	
	//20210421 이전채널 입력/수정/삭제 처리
	public void modifyTfrnChnlList(Map<String, Object> mocaMap, ModelMap model) throws Exception;
	
	//20210428 제조사 차량가격 조회
	public Map<String, Object> inqPrcFromMfco(String vhidNo) throws Exception;
	
	//20210503 통합 납부영수증 매핑
	public String TO_018_procUnfyPayVou(Map<String, Object> mocaMap, ModelMap model) throws Exception;
	
	//스케줄러 내일일정 sms보내기
	public void batchTomorrowScheduleAlarmSms() throws Exception;
	
	//스케줄러 내일일정 sms보내기
	public void batchStockAlarmSms() throws Exception;
}