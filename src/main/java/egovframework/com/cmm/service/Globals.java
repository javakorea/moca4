package egovframework.com.cmm.service;

/**
 *  Class Name : Globals.java
 *  Description : 시스템 구동 시 프로퍼티를 통해 사용될 전역변수를 정의한다.
 *  Modification Information
 * 
 *     수정일         수정자                   수정내용
 *   -------    --------    ---------------------------
 *   2009.01.19    박지욱          최초 생성
 *
 *  @author 공통 서비스 개발팀 박지욱
 *  @since 2009. 01. 19
 *  @version 1.0
 *  @see 
 * 
 */

public class Globals {
    //파일 업로드 원 파일명
	public static final String ORIGIN_FILE_NM = "originalFileName";
	//파일 확장자
	public static final String FILE_EXT = "fileExtension";
	//파일크기
	public static final String FILE_SIZE = "fileSize";
	//업로드된 파일명
	public static final String UPLOAD_FILE_NM = "uploadFileName";
	//파일경로
	public static final String FILE_PATH = "filePath";
	
	// Shell File Path
	public static final String SHELL_FILE_PATH = "/bin/sh";
	// OS_TYPE
	public static final String OS_TYPE = EgovProperties.getProperty("Globals.OsType");
	
	/////////////////////////////////////////////////////////////////////
	// TO Properties
	
	//인증
	public static final String URL_USIM = EgovProperties.getProperty("Globals.url_usim");
	public static final String CONTENTTYPE_USIM = EgovProperties.getProperty("Globals.ContentType_usim");
	
	public static final String URL_API_NEWISSUECFRMPAYLISTEXAMPLE = EgovProperties.getProperty("Globals.url_api_NewIssueCfrmPayListExample");
	public static final String URL_API_TOOLKITISSUECHANGEEXAMPLE = EgovProperties.getProperty("Globals.url_api_ToolkitIssueChangeExample");
	public static final String URL_API_TOOLKITISSUEPURCHARSEURLEXAMPLE = EgovProperties.getProperty("Globals.url_api_ToolkitIssuePurcharseUrlExample");
	
	
	public static final String MNDT_AHRZT = EgovProperties.getProperty("Globals.MNDT_AHRZT");
	public static final String CHARGER_ID = EgovProperties.getProperty("Globals.CHARGER_ID");
	public static final String CHARGER_NM = EgovProperties.getProperty("Globals.CHARGER_NM");
	public static final String CHARGER_IP_ADRES = EgovProperties.getProperty("Globals.CHARGER_IP_ADRES");
	public static final String BIZRNO = EgovProperties.getProperty("Globals.BIZRNO");
	public static final String CNTC_INSTT_CODE = EgovProperties.getProperty("Globals.CNTC_INSTT_CODE");
	public static final String CNTC_INFO_CODE = EgovProperties.getProperty("Globals.CNTC_INFO_CODE");
	public static final String TAXT_SE_CODE = EgovProperties.getProperty("Globals.TAXT_SE_CODE");
	
	public static final String TRNSFR_CHANNEL = EgovProperties.getProperty("Globals.TRNSFR_CHANNEL");
	public static final String PAY_TRGET_GUBUN = EgovProperties.getProperty("Globals.PAY_TRGET_GUBUN");
	public static final String ORGNZT_CODE = EgovProperties.getProperty("Globals.ORGNZT_CODE");

	//카카오페이 인증 호출
	public static final String EXPIRES_IN = EgovProperties.getProperty("Globals.expires_in");
	
	//양도증명서 원본 파일경로
	public static final String CONTRACTFILEPATH = EgovProperties.getProperty("Globals.contractFilePath");
	public static final String CONTRACTFILEPATHFROMWEBROOT = EgovProperties.getProperty("Globals.contractFilePathFromWebRoot");
	public static final String CONTRACTSTAMPPATH = EgovProperties.getProperty("Globals.contractStampPath");
	
	//양도증명서 PDF원본만들기
	public static final String URL_API_YANGDOU_PDF_GEN_API = EgovProperties.getProperty("Globals.url_api_yangdou_pdf_gen_api");
	public static final String URL_BIZ_TALK = EgovProperties.getProperty("Globals.url_biz_talk");
	public static final String CONTENTTYPE_BIZ_TALK = EgovProperties.getProperty("Globals.ContentType_biz_talk");
	public static final String URL_BIZ = EgovProperties.getProperty("Globals.url_biz");
	public static final String URL2_BIZ = EgovProperties.getProperty("Globals.url2_biz");
	public static final String URL3_BIZ = EgovProperties.getProperty("Globals.url3_biz");
	public static final String BIZTALK_BSID_BIZ = EgovProperties.getProperty("Globals.BIZTALK_BSID_biz");
	public static final String BIZTALK_BSPW_BIZ = EgovProperties.getProperty("Globals.BIZTALK_BSPW_biz");
	public static final String CONTENTTYPE_BIZ = EgovProperties.getProperty("Globals.ContentType_biz");
	public static final String BIZTALK_SENDERKEY = EgovProperties.getProperty("Globals.BIZTALK_senderKey");
	public static final String BIZTALK_COUNTRYCODE = EgovProperties.getProperty("Globals.BIZTALK_countryCode");
	public static final String BIZTALK_TEMPLETCODE_TO_DONE = EgovProperties.getProperty("Globals.BIZTALK_templetCode_to_done");

	public static final String BIZTALK_TEMPLETCODE_TO_SECRETKEY = EgovProperties.getProperty("Globals.BIZTALK_templetCode_to_secretKey");

	public static final String CABANG_URL_FOR_KAKAO_REQUEST_210_API_URL = EgovProperties.getProperty("Globals.cabang_url_for_kakao_request_210_api_url");
	public static final String CABANG_URL_FOR_KAKAO_REQUEST_210_API_CONTENTTYPE = EgovProperties.getProperty("Globals.cabang_url_for_kakao_request_210_api_ContentType");
	public static final String KAKAO_REQUEST_210_API_URL = EgovProperties.getProperty("Globals.kakao_request_210_api_url");
	public static final String KAKAO_REQUEST_210_API_CONTENTTYPE = EgovProperties.getProperty("Globals.kakao_request_210_api_ContentType");
	
	public static final String CABANG_URL_FOR_KAKAO_DOC_STATUS_API_URL = EgovProperties.getProperty("Globals.cabang_url_for_kakao_doc_status_api_url");
	public static final String CABANG_URL_FOR_KAKAO_DOC_STATUS_API_CONTENTTYPE = EgovProperties.getProperty("Globals.cabang_url_for_kakao_doc_status_api_ContentType");
	public static final String KAKAO_DOC_STATUS_API_URL = EgovProperties.getProperty("Globals.kakao_doc_status_api_url");
	public static final String KAKAO_DOC_STATUS_API_CONTENTTYPE = EgovProperties.getProperty("Globals.kakao_doc_status_api_ContentType");
	
	public static final String CABANG_URL_FOR_KAKAO_VERIFY_API_URL = EgovProperties.getProperty("Globals.cabang_url_for_kakao_verify_api_url");
	public static final String CABANG_URL_FOR_KAKAO_VERIFY_API_CONTENTTYPE = EgovProperties.getProperty("Globals.cabang_url_for_kakao_verify_api_ContentType");
	public static final String KAKAO_VERIFY_API_URL = EgovProperties.getProperty("Globals.kakao_verify_api_url");
	public static final String KAKAO_VERIFY_API_CONTENTTYPE = EgovProperties.getProperty("Globals.kakao_verify_api_ContentType");
	
	public static final String BIZTALK_templetCode_to_done = EgovProperties.getProperty("Globals.BIZTALK_templetCode_to_done");
	
	//본인실명확인 회원사 아이디
	public static final String ID = EgovProperties.getProperty("Globals.id");
	public static final String SRVNO = EgovProperties.getProperty("Globals.srvNo");
	public static final String REQNUM = EgovProperties.getProperty("Globals.reqNum");
	public static final String EXVAR = EgovProperties.getProperty("Globals.exVar");
	public static final String RETURL = EgovProperties.getProperty("Globals.retUrl");
	public static final String CERTGB = EgovProperties.getProperty("Globals.certGb");
	public static final String INFOPUBLIC = EgovProperties.getProperty("Globals.infoPublic");	
	
	//로그 Path
	public static final String LOG_PATH = EgovProperties.getProperty("Globals.logPath");
	
	// TOUtil 용 
	public static final String COOCON_COMMON_URL = EgovProperties.getProperty("Globals.cooconCommonUrl");
	public static final String CARBANG_COMMON_URL = EgovProperties.getProperty("Globals.carbangCommonUrl");
	public static final String COOCON_COMMON_API_KEY = EgovProperties.getProperty("Globals.cooconCommonApiKey");
	public static final String COOCON_COMMON_API_ID = EgovProperties.getProperty("Globals.cooconCommonApiId");
	public static final String COOCON_COMMON_REQ_KEY = EgovProperties.getProperty("Globals.cooconCommonReqKey");
	public static final String COOCON_REQ_DATA_WORKTYPE = EgovProperties.getProperty("Globals.cooconReqDataWorkType");
	public static final String COOCON_REQ_DATA_PRINT_YN = EgovProperties.getProperty("Globals.cooconReqDataPrintYn");

	// 카카오페이 인증을 위한 정보(20.12.29)
	// api 서버 접근이 안되므로 개발계를 바라보도록 변경(21.01.22)
	public static final String KAKAOPAY_REQ_URL = EgovProperties.getProperty("Globals.kakaopayReqUrl");
	public static final String KAKAOPAY_STATUS_URL = EgovProperties.getProperty("Globals.kakaopayStatusUrl");
	public static final String KAKAOPAY_VERIFY_URL = EgovProperties.getProperty("Globals.kakaopayVerifyUrl");
	public static final String CONTENT_TYPE = EgovProperties.getProperty("Globals.contentType");
	
	// 결제 ARS 호출
	public static final String KSNET_ACCOUNT_REQ_URL = EgovProperties.getProperty("Globals.ksnetAccountReqUrl");		// FCS 계좌인증
	public static final String KSNET_REQ_URL = EgovProperties.getProperty("Globals.ksnetReqUrl");						// ARS자동이체동의
	
	// 계좌인증(FCS) 업체코드
	public static final String KSNET_FCS_COMPANY_CD = EgovProperties.getProperty("Globals.ksnetFcsCompanyCd");
	// ARS 업체코드
	public static final String KSNET_ARS_COMPANY_CD = EgovProperties.getProperty("Globals.ksnetArsCompanyCd");
	// ARS 인증키
	public static final String KSNET_ARS_AUTH_KEY = EgovProperties.getProperty("Globals.ksnetArsAuthKey");
	
	// 카카오 Vision(OCR)
	public static final String KAKAO_VISION_URL = EgovProperties.getProperty("Globals.kakao_vision_url");
	public static final String KAKAO_VISION_API_KEY = EgovProperties.getProperty("Globals.kakao_vision_api_key");
	public static final String KAKAO_VISION_CONTENT_TYPE = EgovProperties.getProperty("Globals.kakao_vision_content_type");
	
	
}
