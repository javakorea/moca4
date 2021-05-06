package com.carbang365;

import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.net.HttpURLConnection;
import java.net.Socket;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import egovframework.com.cmm.service.Globals;
import egovframework.let.sym.ccm.zip.web.EgovCcmZipManageController;
import egovframework.let.utl.fcc.service.EgovStringUtil;
import mocaframework.com.cmm.Curl;
import mocaframework.com.cmm.Image;
import mocaframework.com.cmm.PDFConverter;
import mocaframework.com.cmm.Util;
import tcert.crypto.AesAt;

public class TOUtil {
	private static final Logger LOGGER = LoggerFactory.getLogger(TOUtil.class);
	
	public static String setPercentToRate(Map<String, Object> acquistionPrice,String _key) throws Exception{
		String Acquisition_taxRate_str = "";
		try {
			BigDecimal Acquisition_taxRate = new BigDecimal((String) acquistionPrice.get(_key));
			Acquisition_taxRate = Acquisition_taxRate.divide(new BigDecimal("100"));
			Acquisition_taxRate_str = Acquisition_taxRate.toPlainString();
		}catch(NumberFormatException e) {
			Acquisition_taxRate_str = (String) acquistionPrice.get(_key);
		}
		acquistionPrice.put(_key, Acquisition_taxRate_str);
		return Acquisition_taxRate_str;
	}
	
	public static void setIntValue(Map<String, Object> acquistionPrice,String _key)  throws Exception{
		try {
			String ReductionPrice1 = (String) acquistionPrice.get(_key);
			Integer.parseInt(ReductionPrice1);
		}catch(NumberFormatException e) {
			acquistionPrice.put(_key, null);
		}
	}

	public static void setDateValue(Map<String, Object> acquistionPrice,String _key)  throws Exception{
		try {
			String LimitDate1 = (String) acquistionPrice.get(_key);
			acquistionPrice.put(_key, LimitDate1.replaceAll("-", ""));
		}catch(NumberFormatException e) {
			acquistionPrice.put(_key, null);
		}
	}
	
	public static String getPercentValue(Map<String, Object> acquistionPrice,String _key) {
		String Acquisition_taxRate_str = "";
		try {
			BigDecimal Acquisition_taxRate = new BigDecimal((String) acquistionPrice.get(_key));
			Acquisition_taxRate = Acquisition_taxRate.multiply(new BigDecimal(100)).stripTrailingZeros();
			Acquisition_taxRate_str = Acquisition_taxRate.toPlainString() + "%";
		}catch(Exception e) {
			if(acquistionPrice.get(_key) == null) {
				Acquisition_taxRate_str = "";
			}else {
				Acquisition_taxRate_str = (String)acquistionPrice.get(_key);
			}
		}
		acquistionPrice.put(_key, Acquisition_taxRate_str);
		return Acquisition_taxRate_str;
	}
	
	
//	static String COOCON_COMMON_URL="https://dev2.coocon.co.kr:8443/sol/gateway/scrap_wapi_1300.jsp";
//	static String CARBANG_COMMON_URL="http://ex.carbang365.com/api/MyCar/TransferOwner_FetchRegistrationInfo.php";
//	static String COOCON_COMMON_API_KEY="DpUUQJ6hX1QsVT7ftxZm";
//	static String COOCON_COMMON_API_ID="1338";
//	static String COOCON_COMMON_REQ_KEY="REQ_DATA";
//	static String COOCON_REQ_DATA_WORKTYPE="A";
////	static String COOCON_REQ_DATA_CAR_NUM="41소7390";	// 하드코딩 항목 제거 2021.01.13 
////	static String COOCON_REQ_DATA_OWNER_NAME="성백근";	// 하드코딩 항목 제거 2021.01.13
//	static String COOCON_REQ_DATA_PRINT_YN="0";
//	
//	// 카카오페이 인증을 위한 정보(20.12.29)
//	// api 서버 접근이 안되므로 개발계를 바라보도록 변경(21.01.22)
//	static String KAKAOPAY_REQ_URL = "http://dev-mycar.carbang365.co.kr:9090/to/jsp/kakao_request_210_api.jsp";
//	static String KAKAOPAY_STATUS_URL = "http://dev-mycar.carbang365.co.kr:9090/to/jsp/kakao_doc_status_api.jsp";
//	static String KAKAOPAY_VERIFY_URL = "http://dev-mycar.carbang365.co.kr:9090/to/jsp/kakao_verify_api.jsp";
//	static String CONTENT_TYPE = "application/x-www-form-urlencoded;charset=utf-8";
//	
//	// 결제 ARS 호출
//	static String KSNET_DEV_ACCOUNT_REQ_URL = "https://cmsarstest.ksnet.co.kr/ksnet/auth/account";	// FCS 계좌인증(개발)
//	static String KSNET_DEV_REQ_URL = "https://cmsarstest.ksnet.co.kr/ksnet/auth/ars";				// ARS자동이체동의(개발)
//	
//	static String KSNET_PROD_ACCOUNT_REQ_URL = "https://cmsars.ksnet.co.kr/ksnet/auth/account";		// FCS 계좌인증(운영)
//	static String KSNET_PROD_REQ_URL = "https://cmsars.ksnet.co.kr/ksnet/auth/ars";					// ARS자동이체동의(운영)
//
//	static String KSNET_FCS_COMPANY_CD = "FCS04896";					// 계좌인증(FCS) 업체코드
//	static String KSNET_ARS_COMPANY_CD = "CARBANG1";					// ARS 업체코드
//	static String KSNET_ARS_AUTH_KEY = "WuXip1AqhyD1wZxqPSAg";			// ARS 인증키
	
	
	
	
    public static Map getPreRequestForCoocon() {
		//String _propertyName = "carbangLink";
		//Map p = P.get("carbangLink");
		//LOGGER.debug(_propertyName+":"+p);
		Map reqMap = new HashMap();
		reqMap.put("API_KEY", Globals.COOCON_COMMON_API_KEY);
		reqMap.put("API_ID", Globals.COOCON_COMMON_API_ID);
		reqMap.put("WORKTYPE", Globals.COOCON_REQ_DATA_WORKTYPE);
//		reqMap.put("CAR_NUM", COOCON_REQ_DATA_CAR_NUM);			// 하드코딩 항목 제거 2021.01.13 
//		reqMap.put("OWNER_NAME", COOCON_REQ_DATA_OWNER_NAME);	// 하드코딩 항목 제거 2021.01.13 
		reqMap.put("PRINT_YN", Globals.COOCON_REQ_DATA_PRINT_YN);
		return reqMap;
    };
    
    public static Map getResponse(Map map) {
		Curl curl = new Curl();
		Gson gsonObj = new Gson();
		Map temp = (Map)map.get("param");
		LOGGER.debug("temp:"+temp);
		Map encodedMap = new HashMap();
		try {
			Set st = temp.keySet();
			Iterator iter = st.iterator();
			while(iter.hasNext()) {
				String key = (String)iter.next();
				String value = URLEncoder.encode((String)temp.get(key), StandardCharsets.UTF_8.toString());
				encodedMap.put(key, value);
			}
			String jsonStr = gsonObj.toJson(encodedMap);
			LOGGER.debug("toJson:"+jsonStr);
			map.put("param", jsonStr);
		}catch(Exception e) {
			e.printStackTrace();
		}
		String result =curl. callHttp(map);
		Map remap = gsonObj.fromJson(result, Map.class);
		return remap;
    };
    
    // 차량분석 카방 api response
    public static Map getCarbangResponse(Map map) throws Exception{
    	Curl curl = new Curl();
    	Gson gsonObj = new Gson();
    	Map temp = (Map)map.get("param");
    	LOGGER.debug("temp:"+temp);
    	Map encodedMap = new HashMap();
    	try {
    		Set st = temp.keySet();
    		Iterator iter = st.iterator();
    		while(iter.hasNext()) {
    			String key = (String)iter.next();
    			String value = URLEncoder.encode((String)temp.get(key), StandardCharsets.UTF_8.toString());
    			encodedMap.put(key, value);
    		}
    		String jsonStr = gsonObj.toJson(encodedMap);
    		LOGGER.debug("toJson:"+jsonStr);
    		map.put("param", jsonStr);
    	}catch(Exception e) {
    		e.printStackTrace();
    	}

    	String result = Util.curl(Globals.CARBANG_COMMON_URL, map);
    	
    	LOGGER.debug("=======================================================");
    	LOGGER.debug("차량분석 request ::: "+ map);
    	LOGGER.debug("차량분석 result ::: "+ result);
    	LOGGER.debug("=======================================================");

    	Map remap = gsonObj.fromJson(result, Map.class);
    	return remap;
    };
    
    public static Map call(Map param) {
		//String _propertyName = "carbangLink";
		//Map p = P.get("carbangLink");
		
		Map map = new HashMap();
		map.put("url", Globals.COOCON_COMMON_URL);
		map.put("key", Globals.COOCON_COMMON_REQ_KEY);
		map.put("param", param);
		
		Map result = getResponse(map);
		return result;
    };
    
    // 차량분석 카방 api 호출
    public static Map carbangCall(Map param) throws Exception{
    	Map map = new HashMap();
    	
//    	쿠콘 인증키는 carbang api에서 이미 가지고 있으므로 따로 set 해줄 필요 없음
//    	map.put("url", CARBANG_COMMON_URL);
//    	map.put("key", COOCON_COMMON_REQ_KEY);
    	map.put("param", param);
    	
    	Map result = getCarbangResponse(map);
    	return result;
    };
    
    
    public static Map makeYangdoDoc(Map param) throws Exception{
    	String fileDir = "/home/ubuntu/TO/apache-tomcat-9.0.39/webapps/to/images/carbang/";
    	PDFConverter pdfConverter = new PDFConverter();
		LOGGER.debug("START TOLink makeYangdoDoc");
		String fileNm = Image.imgAddText("/home/ubuntu/TO/apache-tomcat-9.0.39/webapps/to/images/carbang/cert.png", fileDir,param);
		Map m = pdfConverter.convertJPGFileToPDFFile(fileDir, fileNm);
		return m;
    }

	public static String apiKey = "AAAAz50CDe0:APA91bENoi9dCR4bRDnWcp39o_oi56SSu86rQKIacR2BgB9ntqybaDpcwuhLYcJlkDBA8BZdMah5bV7WB3wiLQQOUD2eNMWrFOPYGAnLVHLLISOfc0dIGxizfUWQwYeOMAe7CLXiZE8B";
	public static String push_url = "https://fcm.googleapis.com/fcm/send";
	public static String exeAppPush(Map param) throws Exception{
/*		테스트URL -----------> http://localhost:8080/to/TO/mobile/push.do */
		//Map map = U.getBodyNoSess(mocaMap);
		 	URL url = new URL(push_url);
	        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
	        conn.setDoOutput(true);
	        conn.setRequestMethod("POST");
	        conn.setRequestProperty("Content-Type", "application/json");
	        conn.setRequestProperty("Authorization", "key=" + apiKey);
	        conn.setDoOutput(true);
	        // 이렇게 보내면 주제를 ALL로 지정해놓은 모든 사람들한테 알림을 날려준다.
	        //String input = "{\"notification\" : {\"title\" : \"여기다 제목 넣기 \", \"body\" : \"여기다 내용 넣기\"}, \"to\":\"/topics/ALL\"}";
	       
	        // 이걸로 보내면 특정 토큰을 가지고있는 어플에만 알림을 날려준다  위에 둘중에 한개 골라서 날려주자
	        String input = 
	        		  "{"
	        		+ "\"notification\" : {"
	        				+ "\"title\" : \""+param.get("notification.title")+"\", "
	        				+ "\"body\" : \""+param.get("notification.body")+"\""
	        		+ "}, "
	        		+ "\"to\":\""+param.get("to")+"\""
	        		+ "}";
	
	        OutputStream os = conn.getOutputStream();
	       
	        // 서버에서 날려서 한글 깨지는 사람은 아래처럼  UTF-8로 인코딩해서 날려주자
	        os.write(input.getBytes("UTF-8"));
	        os.flush();
	        os.close();
	
	        int responseCode = conn.getResponseCode();
	        LOGGER.debug("\nSending 'POST' request to URL : " + url);
	        LOGGER.debug("Post parameters : " + input);
	        LOGGER.debug("Response Code : " + responseCode);
	       
	        BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
	        String inputLine;
	        StringBuffer buffer = new StringBuffer();
	
	        while ((inputLine = in.readLine()) != null) {
	        	buffer.append(inputLine);
	        }
	        in.close();
	        // print result
	        LOGGER.debug(buffer.toString());
	        return buffer.toString();
    }
	
	// 카카오페이 인증 호출 TOLink로 이동(20.12.29)
	public static StringBuffer sendKakaoCert(Map paramMap) {
		
		CloseableHttpClient http = HttpClients.createDefault();
		StringBuffer result = new StringBuffer();
		try{
			HttpPost post = new HttpPost(Globals.KAKAOPAY_REQ_URL);
		    post.setHeader("Content-Type", Globals.CONTENT_TYPE);
		
			List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
			urlParameters.add(new BasicNameValuePair("phone_no", (String)paramMap.get("phone_no")));
			urlParameters.add(new BasicNameValuePair("name", (String)paramMap.get("name") ));
			urlParameters.add(new BasicNameValuePair("birthday",  (String)paramMap.get("birthday")  ));
			urlParameters.add(new BasicNameValuePair("expires_in", (String)paramMap.get("expires_in")   ));
			urlParameters.add(new BasicNameValuePair("call_center_no", (String)paramMap.get("call_center_no")  ));
			urlParameters.add(new BasicNameValuePair("title", (String)paramMap.get("title")  ));
			urlParameters.add(new BasicNameValuePair("markdown_use", (String)paramMap.get("markdown_use") ));
			urlParameters.add(new BasicNameValuePair("data", (String)paramMap.get("data")   ));
		
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
				try {
					http.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		LOGGER.debug("sendKakaoCert resultresultresult:"+result);
		
		return result;
	}
	
	// 카카오페이 인증상태 조회 TOLink로 이동(20.12.29)
	public static StringBuffer getKakaoCertStatus(Map paramMap) {
		String tx_id = (String)paramMap.get("tx_id");
		StringBuffer result = new StringBuffer();
		if(tx_id != null && !"".equals(tx_id)) {
			CloseableHttpClient http = HttpClients.createDefault();
			try{
			    HttpGet post = new HttpGet(Globals.KAKAOPAY_STATUS_URL+"?tx_id="+tx_id);
			    post.setHeader("Content-Type", Globals.CONTENT_TYPE);
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
					try {
						http.close();
					} catch (IOException e) {
						e.printStackTrace();
					}
				}
			}
		}else {
			result.append("{"+"}");
		}
		return result;
	}

	// 카카오페이 검증 조회 TOLink로 이동(21.01.26)
	public static StringBuffer getKakaoCertVefify(Map paramMap) {
		String tx_id = (String)paramMap.get("tx_id");
		LOGGER.debug("-----getKakaoCertVefify------------------------------->tx_id:"+tx_id);
		CloseableHttpClient http = HttpClients.createDefault();
		StringBuffer result = new StringBuffer();
		try{
			HttpGet post = new HttpGet(Globals.KAKAOPAY_VERIFY_URL+"?tx_id="+tx_id);
			post.setHeader("Content-Type", Globals.CONTENT_TYPE);
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
				try {
					http.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		
		LOGGER.debug("getKakaoCertVefify resultresultresult:"+result);
		
		return result;
	}
	
	// FCS 계좌인증
	public static Map<String, String> ksNetAccountAuth(Map<String, Object> paramMap) {
		Map<String, String> rtnMap = null;
		try{
			// 일련번호 random 생성
			String seq_no = ""; 
			Random random = new Random();
			for(int i = 0; i < 6; i++) {
				int randomInt = random.nextInt(10);
				seq_no += String.valueOf(randomInt);
			}
			
			JSONObject jsonReq = new JSONObject();
			JSONArray jsonArray = new JSONArray();
			JSONObject jsonReqData = new JSONObject();
			
			//인증키
            jsonReq.put("auth_key",     Globals.KSNET_ARS_AUTH_KEY);

			//요청 데이터
			jsonReqData.put("fcs_cd",     Globals.KSNET_FCS_COMPANY_CD);		// 계좌인증 업체코드
			jsonReqData.put("seq_no",     seq_no);						// 일련번호(6, 필수) unique
			jsonReqData.put("bank_cd",     paramMap.get("bank_cd"));	// 은행코드 
			jsonReqData.put("acct_no",     paramMap.get("acct_no"));	// 계좌번호
			jsonReqData.put("acct_nm",     paramMap.get("acct_nm"));	// 예금주명
			jsonReqData.put("id_no",     paramMap.get("id_no"));		// 신원확인번호(개인 YYMMDD)
			jsonReqData.put("amount",     "0");							// 금액. 가상계좌 조회 시 사용. 필수아님
//			jsonReqData.put("auth_type",     "99");						// 인터페이스 레이아웃엔 없으나, 요청예시에 있어 임의로 넣어봄. (실계좌를 넣어도 계좌오류가 계속나서ㅡㅡ; 임시로 넣어봄) 
			
			jsonArray.add(jsonReqData);
			jsonReq.put("reqdata", jsonArray);
	
			LOGGER.debug( "REQ DATA:" +  jsonReq.toString() );

            JSONObject jsonResp = new RequestProc().sendPacket(Globals.KSNET_ACCOUNT_REQ_URL, jsonReq);

            LOGGER.debug( "RESP DATA:" +  jsonResp.toString() );
            
            Gson gson = new Gson();
            rtnMap = (Map<String, String>) gson.fromJson(jsonResp.toJSONString(), Map.class);
            
		}catch(Exception e) {
			e.printStackTrace();   
		}
		
		return rtnMap;
	}
	
	// ARS 본인인증(이통사 인증)
	public static Map<String, String> ksNetverifyOneself(Map<String, Object> paramMap) {
		Map<String, String> rtnMap = null;
		try{
			
			//이통사 인증
			JSONObject jsonReq = new JSONObject();
			JSONArray jsonArray = new JSONArray();
			JSONObject jsonReqData = new JSONObject();
			
			// 인증키
            jsonReq.put("auth_key",     Globals.KSNET_ARS_AUTH_KEY);			// ARS 인증키
			
            // 요청데이터
            jsonReqData.put("compcode",    Globals.KSNET_ARS_COMPANY_CD);		// ARS업체코드
            jsonReqData.put("service",     "0002");						// 서비스분류(0002: 자동이체 동의)
			jsonReqData.put("svc_type",    "01");						// 기능분류(01: 소유)
            
            jsonReqData.put("phoneno",     paramMap.get("phoneno"));	// 휴대폰번호
			jsonReqData.put("birthday",    paramMap.get("birthday"));	// 생년월일(YYYYMMDD)
			jsonReqData.put("custnm",      paramMap.get("custnm"));		// 고객명
			jsonReqData.put("nation",      paramMap.get("nation"));		// 국적(1:내국인, 2:외국인)
			jsonReqData.put("gender",      paramMap.get("gender"));		// 성별(1: 남자, 2: 여자)
			jsonReqData.put("telecd",      paramMap.get("telecd"));		// 통신사코드(01:SKT, 02:KT, 03:LGU, 04:SKT알뜰폰, 05:KT알뜰폰,06:LGU알뜰폰
			
			jsonArray.add(jsonReqData);
			jsonReq.put("reqdata", jsonArray);

			LOGGER.debug( "REQ DATA:" +  jsonReq.toString() );

	        JSONObject jsonResp = new RequestProc().sendPacket(Globals.KSNET_REQ_URL, jsonReq);
	        
	        LOGGER.debug( "RESP DATA:" +  jsonResp.toString() );
	        
	        Gson gson = new Gson();
            rtnMap = (Map<String, String>) gson.fromJson(jsonResp.toJSONString(), Map.class);

			
		}catch(Exception e) {
			e.printStackTrace();   
		}
		
		return rtnMap;
	}
	
	// ARS 자동이체 동의 call
	public static Map<String, String> ksNetAcceptStandingOrder(Map<String, Object> paramMap) {
		Map<String, String> rtnMap = null;
		try{
			
			//이통사 인증
			JSONObject jsonReq = new JSONObject();
			JSONArray jsonArray = new JSONArray();
			JSONObject jsonReqData = new JSONObject();
			
			// 인증키
			jsonReq.put("auth_key",     Globals.KSNET_ARS_AUTH_KEY);			// ARS 인증키
			
			// 요청데이터
			jsonReqData.put("compcode",   Globals.KSNET_ARS_COMPANY_CD);		// ARS업체코드
			jsonReqData.put("service",    "0002");						// 서비스분류(0002: 자동이체 동의)
			jsonReqData.put("svc_type",   "02");						// 기능분류(01: 점유)
			jsonReqData.put("usedrecord", "Y");							// 녹취파일 사용여부
			
			jsonReqData.put("phoneno",    paramMap.get("phoneno"));		// 휴대폰번호
			jsonReqData.put("birthday",   paramMap.get("birthday"));	// 생년월일(YYYYMMDD)
			jsonReqData.put("custnm",     paramMap.get("custnm"));		// 고객명
			jsonReqData.put("nation",     paramMap.get("nation"));		// 국적(1:내국인, 2:외국인)
			jsonReqData.put("gender",     paramMap.get("gender"));		// 성별(1: 남자, 2: 여자)
			jsonReqData.put("telecd",     paramMap.get("telecd"));		// 통신사코드(01:SKT, 02:KT, 03:LGU, 04:SKT알뜰폰, 05:KT알뜰폰,06:LGU알뜰폰
			jsonReqData.put("banknm",     paramMap.get("banknm"));		// 자동이체 은행명
			jsonReqData.put("acctno",     paramMap.get("acctno"));		// 자동이체 계좌번호
			jsonReqData.put("traceno",    paramMap.get("traceNo"));		// 이통사 인증요청 응답값
			jsonReqData.put("authno",    paramMap.get("auth_numb"));	// 사용자가 입력할 인증번호(4자리). 이통사 인증요청 응답값
			
			
			jsonArray.add(jsonReqData);
			jsonReq.put("reqdata", jsonArray);
			
			LOGGER.debug( "REQ DATA:" +  jsonReq.toString() );
			
			JSONObject jsonResp = new RequestProc().sendPacket(Globals.KSNET_REQ_URL, jsonReq);
			
			LOGGER.debug( "RESP DATA:" +  jsonResp.toString() );
			
			Gson gson = new Gson();
			rtnMap = (Map<String, String>) gson.fromJson(jsonResp.toJSONString(), Map.class);
			
			
		}catch(Exception e) {
			e.printStackTrace();   
		}
		
		return rtnMap;
	}
	
	public static final class RequestProc
	{
	    
	    public JSONObject sendPacket(String url, JSONObject json_obj)
	    {
	    	
	        String              strJSONObject       = this.excute(url, json_obj);
	        JSONObject          jsonObject          = this.str2JSONObject(strJSONObject);

	        return jsonObject;
	    }
	    
	    private String excute(String url, JSONObject json_obj)
	    {
	        HttpClient client = new DefaultHttpClient();
	        StringBuffer returnData = new StringBuffer();
	        BufferedReader rd = null;
	        int soketTimeout = Integer.valueOf(180);
	        
	        List<NameValuePair> params = new ArrayList<NameValuePair>();
	        params.add(new BasicNameValuePair("JSONData", json_obj.toString()));
	        
	      
	        try
	        {
	            client.getParams().setParameter("http.socket.timeout", new Integer(soketTimeout * 1000));
	            client.getParams().setParameter("http.protocol.content-charset", "UTF-8");

	            HttpPost post = new HttpPost(url);
	            post.setEntity(new UrlEncodedFormEntity(params, "UTF-8"));

	            HttpResponse response = client.execute(post);

	            rd = new BufferedReader(new InputStreamReader(response.getEntity().getContent(), "UTF-8"));

	            String line = "";
	            while ((line = rd.readLine()) != null)
	            {
	                returnData.append(line);
	            }
	            rd.close();
	        }
	        catch (Exception e)
	        {
	            e.printStackTrace();

	            return null;
	        }
	        finally
	        {
	            if (rd != null)
	                try
	                {
	                    rd.close();
	                }
	                catch (IOException e)
	                {
	                    e.printStackTrace();
	                }
	            client.getConnectionManager().shutdown();
	        }
	        return returnData.toString();
	    }


	    private JSONObject str2JSONObject(String strJSONObject)
	    {
	        JSONObject json = null;

	        try
	        {
	            JSONParser parser = new JSONParser();
			//LOGGER.debug("DEBUG : json:"+strJSONObject);
	            json = (JSONObject) parser.parse(strJSONObject);
	        }
	        catch (ParseException e)
	        {
	            e.printStackTrace();
	        }
	        return json;
	    }
	}
	
	
	
	/**
	 * @설명 간편인증 메시지를 어댑터로 전송한 후 응답메시지까지 수신한다.
	 * @author YKLEE 
	 */
	public final static class TcertClientServer {
		// 어댑터 서버 정보 [TB:219.240.37.156, 상용:219.240.37.188]
		public static String ip = "219.240.37.188";
		public static int port = 7026;
		// 요청 파라미터
		public static int teleType 		= 1;
		public static String cust_id 	= "99996FE3C53A84997CA7";
		public static String svc_id		= "EECC816E4AD3A8126673";
		public static String ctn		= "01012344321";
		public static String bday		= "19900101";
		public static String sex		= "1";
		public static String name		= "홍길동";
		public static String privacy_sharing_agree_yn 		= "Y";
		public static String third_party_provision_agree_yn = "Y";
		// 암복호화 관련 [라온으로부터 발급 받아야 함 - 16자리 문자열]
		public static String encKey 	= "ZLGHEIQ20ZLD10D2";
		public static String encIv 		= "D2KJZ5NPQWOIE9IL";
		public static void main(String args[]) {
			try {
				
				// 간편인증 메시지 전송
				//sendAuthMsg();
							
			} catch (Exception e) {
				LOGGER.debug("간편인증 메시지 전송 실패 - " + e.getMessage());
			}
		}
		
		/**
		  * <pre>
		  * 간편인증 요청 메시지 전송 후 응답 메시지 수신
		  * </pre>
		  * <pre>
		  * <b>Parameters:</b>
		  * ▶
		  * ▶
		  * </pre>
		  * <pre>
		  * <b>Returns:</b>
		  * 
		  * </pre>
		  * @author YKLEE
		  */
		public static Map sendAuthMsg(String teleType,String ctn,String bday,String name,String sex) {
			Map re = new HashMap();
			DataOutputStream dOut 	= null;
			DataInputStream dIn 	= null;
			Socket socket = null;
			try {
				LOGGER.debug("sendAuthMsgsendAuthMsgsendAuthMsgsendAuthMsg");
				socket = new Socket(ip, port);
				
				dOut 	= new DataOutputStream(socket.getOutputStream());
				dIn 	= new DataInputStream(socket.getInputStream());
				
				byte[] reqMsgByteArr = makeAuthmsg(teleType,ctn,bday,name,sex);		
							
				printDumpMsg(reqMsgByteArr);
				//re.put("request", printDumpMsg(reqMsgByteArr));
				
				dOut.write(reqMsgByteArr);		
				LOGGER.debug("간편인증 TCP 메시지 전송 성공");
				
				byte[] buffer = new byte[1024];
				byte[] rspMsgByteArr = new byte[TcertConstant.TCERT_TCP_RSP_MSG_SIZE_TOTAL + 4];
				
				while(true){			
					int count = dIn.read(buffer);
					LOGGER.debug(""+count);
					if(count == TcertConstant.TCERT_TCP_RSP_MSG_SIZE_TOTAL+4){	
						break;
					}
				}
				
				System.arraycopy(buffer, 0, rspMsgByteArr, 0, TcertConstant.TCERT_TCP_RSP_MSG_SIZE_TOTAL+4);
				LOGGER.debug("간편인증 HTTP 응답 메시지 수신 성공");
				LOGGER.debug("0--------------------------------->"+new String(rspMsgByteArr));
				LOGGER.debug("rspMsgByteArr.length--------------------------------->"+rspMsgByteArr.length);
				
				/*
				  $rsp_cust_id = substr($rspArr, 4, 20);
				  $rsp_svc_id = substr($rspArr, 24, 20);
				  $rsp_tr_id = substr($rspArr, 44, 20);
				  $rsp_req_date = substr($rspArr, 64, 14);
				  $rsp_result_code = substr($rspArr, 78, 4);
				  $rsp_result_msg = substr($rspArr, 82, 100);
				  $rsp_auth_yn = substr($rspArr, 182, 1);
			    */
				byte[] rsp_cust_id = Arrays.copyOfRange(rspMsgByteArr, 4, 24);LOGGER.debug("1--rsp_cust_id------------------------------->"+new String(rsp_cust_id));
				byte[] rsp_svc_id = Arrays.copyOfRange(rspMsgByteArr, 24, 44);LOGGER.debug("2--rsp_svc_id------------------------------->"+new String(rsp_svc_id));
				byte[] rsp_tr_id = Arrays.copyOfRange(rspMsgByteArr, 44, 64);LOGGER.debug("3--rsp_tr_id------------------------------->"+new String(rsp_tr_id));
				byte[] rsp_req_date = Arrays.copyOfRange(rspMsgByteArr, 64, 78);LOGGER.debug("4--rsp_req_date------------------------------->"+new String(rsp_req_date));
				byte[] rsp_result_code = Arrays.copyOfRange(rspMsgByteArr, 78, 82);LOGGER.debug("5--rsp_result_code------------------------------->"+new String(rsp_result_code));
				byte[] rsp_result_msg = Arrays.copyOfRange(rspMsgByteArr, 82, 182);LOGGER.debug("6--rsp_result_msg------------------------------->"+new String(rsp_result_msg));
				byte[] rsp_auth_yn = Arrays.copyOfRange(rspMsgByteArr, 182, 183);LOGGER.debug("7--rsp_auth_yn------------------------------->"+new String(rsp_auth_yn));
				
				
				printDumpMsg(rspMsgByteArr);	
				//re.put("response", new String(rspMsgByteArr));
				
				re.put("cust_id", new String(rsp_cust_id));
				re.put("svc_id", new String(rsp_svc_id));
				re.put("tr_id", new String(rsp_tr_id));
				re.put("req_date", new String(rsp_req_date));
				re.put("result_code", new String(rsp_result_code));
				re.put("result_msg", new String(rsp_result_msg));
				re.put("auth_yn", new String(rsp_auth_yn));
			}catch(Exception e) {
				e.printStackTrace();
				re.put("error", e.getMessage());
			}finally {
				try {
					if(dOut != null) {
						dOut.close();
					}
					if(dIn != null) {
						dIn.close();
					}
					if(socket != null) {
						socket.close();
					}
				}catch(Exception e2) {
					
				}
			}
			return re;
			
		}
		
		/**
		  * <pre>
		  * byte 메시지 로그 출력(hex) 출력
		  * </pre>
		  * <pre>
		  * <b>Parameters:</b>
		  * ▶ byte[] bMsg : 바이트 메시지
		  * ▶
		  * </pre>
		  * <pre>
		  * <b>Returns:</b>
		  * 
		  * </pre>
		  * @author YKLEE
		  */
		public static String printDumpMsg(byte[] bMsg){
			
			int DUMP_COLUMN_WIDTH = 16;
			
			byte[] bPutBuf = new byte[128];
			int i, column=0, nLen = bMsg.length;
			String sTemp="", sTemp2="";
			
			String str_dump = "\n";
			String str_hex = "";	// hex 예> 0x0000 

			for(i=0; i < nLen; i++){
				
				column = i % DUMP_COLUMN_WIDTH;

				/* print the number of low before the first column */
				if(column == 0) {
					
					str_hex = Integer.toHexString(i).toUpperCase();
					
					if(str_hex.length() < 4) {
						str_hex = ((str_hex.length() == 3) ? "0":(str_hex.length() == 2) ? "00": "000") + str_hex;
					}else if(str_hex.length() > 4) {
						str_hex = str_hex.substring(str_hex.length()-4);
					}
					
					str_hex = "0x" + str_hex + " | ";
													
					str_dump = str_dump + str_hex;
					
				}

				/* print hexa code value */
				sTemp = Integer.toHexString(bMsg[i]).toUpperCase();
				
				if(sTemp.length() == 1) {
					sTemp = "0" + sTemp;
				} else if(sTemp.length() > 2) {
					sTemp = sTemp.substring(sTemp.length() - 2);
				}
				
				sTemp += " ";		
				
				if(column != 0 && (column % 4) == 0) sTemp = " " + sTemp;

				str_dump += sTemp;

				/* print ascii value */
				if(bMsg[i] == 0) {
					bPutBuf[column] = (byte)46;		// '.'
				} else {
					bPutBuf[column] = (bMsg[i] >= 33 && bMsg[i] <= 126) ? bMsg[i]: (byte)95;		// '_'
				}	

				/* print ascii value */
				if(column==(DUMP_COLUMN_WIDTH-1)) {
					
					bPutBuf[column+1] = 0;
					
					sTemp = new String(bPutBuf,0,column+1);
					sTemp = "| " + sTemp + "\n";
					
					str_dump += sTemp;
									
				} else if(i==(nLen-1)) {
					
					sTemp = new String(bPutBuf,0,column+1);

					sTemp2 = "";

					for(int j=0;j<(DUMP_COLUMN_WIDTH-column-1);j++) {
						if(column+1 != 0)
						   if(((column+1+j) % 4) == 0)
							  sTemp2 = " " + sTemp2;

						sTemp2 += "   ";
						
					}
					
					sTemp = sTemp2 + "| " + sTemp + "\n";
													
					str_dump += sTemp;
					
				}
			}
			
			return str_dump;
			
		}

		/**
		  * <pre>
		  * 간편인증 요청 byte 메시지 생성
		  * </pre>
		  * <pre>
		  * <b>Parameters:</b>
		  * </pre>
		  * <pre>
		  * <b>Returns:</b>
		  * 
		  * </pre>
		  * @author YKLEE
		  */
		public static byte[] makeAuthmsg(String teleType,String ctn,String bday,String name,String sex) throws Exception {
			
			byte[] msgByteArr = new byte[ TcertConstant.TCERT_TCP_MSG_SIZE_AUTH + 4];
			
			for (int i=0; i < msgByteArr.length; i ++) {
				msgByteArr[i] = ' ';
			}
			
			AuthMsgVO msgVO = new AuthMsgVO();
			
			int msgSize = 0;
			
			msgVO.setCust_id(cust_id);
			msgVO.setSvc_id(svc_id);
			msgVO.setTr_id(nextKey(20));
			msgVO.setReq_date( new java.text.SimpleDateFormat("yyyyMMddHHmmss").format(new java.util.Date()) ); 
			msgVO.setTele_type(teleType + "");
			msgVO.setAuth_type("1");
			msgVO.setCtn(encryptMsg(ctn));
			msgVO.setBday(encryptMsg(bday));
			msgVO.setSex(encryptMsg(sex));
			msgVO.setName(encryptMsg(name));
			msgVO.setPrivacy_sharing_agree_yn(privacy_sharing_agree_yn);
			msgVO.setThird_party_provision_agree_yn(third_party_provision_agree_yn);
				
			LOGGER.debug("msgVO : " + msgVO);
			
			// 0. 메시지 길이
			System.arraycopy("0388".getBytes(), 0, msgByteArr, 0, 4);
			msgSize += 4;
							
			// 1. 고객ID
			if (msgVO.getCust_id() != null) {
				System.arraycopy(msgVO.getCust_id().getBytes(), 0, msgByteArr, msgSize, msgVO.getCust_id().getBytes().length);
			} 
			msgSize += 20;
					
			// 2.서비스ID
			if (msgVO.getSvc_id() != null) {
				System.arraycopy(msgVO.getSvc_id().getBytes(), 0, msgByteArr, msgSize, msgVO.getSvc_id().getBytes().length);
			}
			msgSize += 20;
			
			// 3.거래번호
			if (msgVO.getTr_id() != null) {
				System.arraycopy(msgVO.getTr_id().getBytes(), 0, msgByteArr, msgSize, msgVO.getTr_id().getBytes().length);
			}
			msgSize += 20;
			
			// 4.요청일시
			if (msgVO.getReq_date() != null) {
				System.arraycopy(msgVO.getReq_date().getBytes(), 0, msgByteArr, msgSize, msgVO.getReq_date().getBytes().length);
			}
			msgSize += 14;
					
			// 5.통신사구분
			if (msgVO.getTele_type() != null) {
				System.arraycopy(msgVO.getTele_type().getBytes(), 0, msgByteArr, msgSize, msgVO.getTele_type().getBytes().length);
			}
			msgSize += 1;	
			
			// 6.인증타입
			if (msgVO.getAuth_type() != null) {
				System.arraycopy(msgVO.getAuth_type().getBytes(), 0, msgByteArr, msgSize, msgVO.getAuth_type().getBytes().length);
			}
			msgSize += 1;		
			
			// 7.전화번호
			if (msgVO.getCtn() != null) {
				System.arraycopy(msgVO.getCtn().getBytes("utf-8"), 0, msgByteArr, msgSize, msgVO.getCtn().getBytes().length);
			}
			
			msgSize += 28;	
			
			// 8.USIM 일련번호
			msgSize += 52;
			
			// 9.망 식별번호
			msgSize += 28;
			
			// 10.단말 일련번호
			msgSize += 28;
			
			// 11.단말OS
			msgSize += 1;	
			
			// 12.생년월일
			if (msgVO.getBday() != null) {
				System.arraycopy(msgVO.getBday().getBytes(), 0, msgByteArr, msgSize, msgVO.getBday().getBytes().length);
			}
			
			msgSize += 22;	
			
			// 13.성별
			if (msgVO.getSex() != null) {
				System.arraycopy(msgVO.getSex().getBytes(), 0, msgByteArr, msgSize, msgVO.getSex().getBytes().length);
			}
			
			msgSize += 22;		
			
			// 14.성명
			if (msgVO.getName() != null) {
				System.arraycopy(msgVO.getName().getBytes("utf-8"), 0, msgByteArr, msgSize, msgVO.getName().getBytes("utf-8").length);
			}
			
			msgSize += 128;
			
			// 15.개인정보 이용 동의 여부
			if (msgVO.getPrivacy_sharing_agree_yn() != null) {
				System.arraycopy(msgVO.getPrivacy_sharing_agree_yn().getBytes(), 0, msgByteArr, msgSize, msgVO.getPrivacy_sharing_agree_yn().getBytes().length);
			}
			
			msgSize += 1;
			LOGGER.debug("222");
			// 16.개인정보 제3자 제공 동의 여부
			if (msgVO.getThird_party_provision_agree_yn() != null) {
				System.arraycopy(msgVO.getThird_party_provision_agree_yn().getBytes(), 0, msgByteArr, msgSize, msgVO.getThird_party_provision_agree_yn().getBytes().length);
			}
			
			msgSize += 1;
						
			return msgByteArr;
			
		}
		
		/**
		  * <pre>
		  * 랜덤 키 생성
		  * </pre>
		  * <pre>
		  * <b>Parameters:</b>
		  * ▶ int keySize : 키 사이즈
		  * </pre>
		  * <pre>
		  * <b>Returns:</b>
		  * 
		  * </pre>
		  * @author YKLEE
		  */
		public static String nextKey(int keySize) {
			
			long time = System.currentTimeMillis();
			long s1 = new SecureRandom().nextLong();
			long s2 = new SecureRandom().nextLong();
			long s3 = new SecureRandom().nextLong();
		
			String temp = Long.toHexString(((time & s1) | s2) ^ s3).toUpperCase();
					
			for ( int i=temp.length(); i< keySize; i++ )
				temp += new SecureRandom().nextInt(10);	
			
			return temp; 
			
		}	
		
		/**
		  * <pre>
		  * AES128 으로 암호화한다.
		  * </pre>
		  * <pre>
		  * <b>Parameters:</b>
		  * ▶
		  * ▶
		  * </pre>
		  * <pre>
		  * <b>Returns:</b>
		  * 
		  * </pre>
		  * @author YKLEE
		  */
		public static String encryptMsg(String msg) throws Exception {
			
			AesAt aes128At = new AesAt(encKey.getBytes(), encIv.getBytes());
			aes128At.InitCiphers();
			
			return aes128At.encrypt(msg, "utf-8");
			
		}
		
	};
	
	public final static class TcertConstant {

		public static final int TCERT_TCP_MSG_SIZE_AUTH = 388;
		public static final int TCERT_TCP_RSP_MSG_SIZE_TOTAL = 179;
		
	};

	
	
	
	public static String encrypt(Map paramMap,String key,String reKey) {
		if(paramMap.get(key) == null) {
			return null;
		}else {
			String val = paramMap.get(key).toString();
			val = Util.TOKISA_SEED_ECB.Encrypt(val);
			if(reKey != null) {
				paramMap.put(reKey, val);
			}else {
				paramMap.put(key, val);
			}
			return val;
		}
	};
	public static String decrypt(Map paramMap,String key,String reKey) {
		if(paramMap.get(key) == null) {
			return null;
		}else {
			LOGGER.debug("decryptdecryptdecryptdecryptdecrypt>>>"+paramMap.get(key));
			String val = paramMap.get(key).toString();
			val = Util.TOKISA_SEED_ECB.Decrypt(val);
			LOGGER.debug("valvalvalval decryptdecryptdecryptdecryptdecrypt>>>"+val);
			if(reKey != null) {
				paramMap.put(reKey, val);
			}else {
				paramMap.put(key, val);
			}
			return val;
		}
	};
	
}
