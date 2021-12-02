package mocaframework.com.cmm.web;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import javax.annotation.Resource;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.collections.MapUtils;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.View;
import org.springmodules.validation.commons.DefaultBeanValidator;

import com.fasterxml.jackson.databind.ObjectMapper;

import egovframework.batch.service.BatchService;
import egovframework.com.cmm.EgovMessageSource;
import egovframework.com.cmm.LoginVO;
import egovframework.com.cmm.service.EgovCmmUseService;
import egovframework.com.cmm.service.EgovProperties;
import egovframework.let.sec.ram.service.EgovAuthorManageService;
import egovframework.let.sym.ccm.cca.service.CmmnCodeVO;
import egovframework.let.uss.umt.service.EgovUserManageService;
import egovframework.rte.fdl.property.EgovPropertyService;
import egovframework.rte.fdl.security.userdetails.util.EgovUserDetailsHelper;
import mocaframework.com.cmm.Big;
import mocaframework.com.cmm.DownloadView;
import mocaframework.com.cmm.U;
import mocaframework.com.cmm.Util;
import mocaframework.com.cmm.service.MocaEFLService;

/**
 * 공통유틸리티성 작업을 위한 Controller 클래스
 * @author TEAM MOCA KSC
 * @since 2019.09.18
 * @version 1.0
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      수정자          수정내용
 *  -------    --------    ---------------------------
 *  2019.09.18  KSC            최초 생성
 *
 *  </pre>
 */
@Controller
public class EfmsEFLController {
	
	@Resource(name = "egovAuthorManageService")
	private EgovAuthorManageService egovAuthorManageService;

	/** userManageService */
	@Resource(name = "userManageService")
	private EgovUserManageService userManageService;
	
	/** EgovMessageSource */
	@Resource(name = "egovMessageSource")
	EgovMessageSource egovMessageSource;
	
	/** cmmUseService */
	@Resource(name = "EgovCmmUseService")
	private EgovCmmUseService cmmUseService;

	
	/** EgovPropertyService */
	@Resource(name = "propertiesService")
	protected EgovPropertyService propertiesService;

	/** DefaultBeanValidator beanValidator */
	@Autowired
	private DefaultBeanValidator beanValidator;
	
	/** cmmUseService */
	@Resource(name = "mocaEFLService")
	private MocaEFLService mocaEFLService;
	
	@Resource(name = "fileBatchService")
	private BatchService fileBatchService;	
	
	
	
	
	@Autowired
    private View jsonview;
	/**
	 * 파일리스트 조회
	 * @param userSearchVO 검색조건정보
	 * @param model 화면모델
	 * @return cmm/uss/umt/EgovUserManage
	 * @throws Exception
	 */ 
	@RequestMapping(value = "/efms/EFL_RECP/list_json.do")
	public View EFL_RECP_list_json(@RequestParam Map param, 
			@RequestParam Map <String, Object> mocaMap,
			ModelMap model) throws Exception {
		if(!U.preCheck(model)) {return jsonview;}
		
		try {
			Map map = U.getBody(mocaMap);
			model.addAttribute("list", mocaEFLService.selectList_EFL_RECP(map));
		}catch(Exception e) {
			e.printStackTrace();
		}

        return jsonview;
	}	
	
	@RequestMapping(value = "/efms/EFL_RECP/modify_json.do")
	public View EFL_RECP_modify_json(@RequestParam Map param, 
			@RequestParam Map <String, Object> mocaMap,
			ModelMap model) throws Exception {
		if(!U.preCheck(model)) {return jsonview;}
		LoginVO user = (LoginVO) EgovUserDetailsHelper.getAuthenticatedUser();
		
    	Map bodyMap = U.getBody(mocaMap);
    	List list = (List)bodyMap.get("paramList");
    	try {
    		
        	//list[{status=C, userId=1, userNm=2, groupId=, moblphonNo=3, uniqId=, sttus=A, emailAdres=4, sbscrbDe=}]
        	//삭제대상을 먼저삭제해야 insert시 문제가 없다.
    		
        	for(int i=0;i < list.size() ;i++) {
        		Map row = (Map)list.get(i);
        		String checkedIdForDel = (String)row.get("FILE_ID") ;
            	if("D".equalsIgnoreCase(U.getStatus(row)) ) {
            		mocaEFLService.deleteList_EFL_RECP(row);
            	}
        	}
        	
        	for(int i=0;i < list.size() ;i++) {
        		Map row = (Map)list.get(i);
        		row.put("LAST_UPDUSR_ID", user.getId());
            	if("C".equalsIgnoreCase(U.getStatus(row)) ) {
            		mocaEFLService.insertList_EFL_RECP(row);
            	}else if("U".equalsIgnoreCase(U.getStatus(row)) ) {
        			//업무사용자 수정시 히스토리 정보를 등록한다.
        			mocaEFLService.insertList_EFL_RECP_H(row);
        			mocaEFLService.updateList_EFL_RECP(row);
            	}
        	}
    		
    	}catch(Exception e) {
    		e.printStackTrace();
    	}

        return jsonview;    
	}		
	
	
	@RequestMapping(value = "/efms/EFL_RECP/list_h_json.do")
	public View EFL_RECP_list_h_json(@RequestParam Map param, 
			@RequestParam Map <String, Object> mocaMap,
			ModelMap model) throws Exception {
		if(!U.preCheck(model)) {return jsonview;}
		
		Map map = U.getBody(mocaMap);
		String FILE_ID = (String)map.get("FILE_ID");
		model.addAttribute("list", mocaEFLService.selectList_EFL_RECP_H(map));
        return jsonview;
	}		
	
	/**
	 * 법인 조회
	 * @param userSearchVO 검색조건정보
	 * @param model 화면모델
	 * @return cmm/uss/umt/EgovUserManage
	 * @throws Exception
	 */ 
	@RequestMapping(value = "/efms/EFC_CORP/list_json.do")
	public View EFL_CORP_list_json(@RequestParam Map param, 
			@RequestParam Map <String, Object> mocaMap,
			ModelMap model) throws Exception {
		if(!U.preCheck(model)) {return jsonview;}
		
		Map map = U.getBody(mocaMap);
		model.addAttribute("list", mocaEFLService.selectList_EFC_CORP(map));
        return jsonview;
	};	
	@RequestMapping(value = "/efms/EFC_CORP/list_nosess_json.do")
	public View EFC_CORP_list_nosess_json(@RequestParam Map param, 
			@RequestParam Map <String, Object> mocaMap,
			ModelMap model) throws Exception {
		Map map = U.getBodyNoSess(mocaMap);
		model.addAttribute("list", mocaEFLService.selectList_EFC_CORP(map));
        return jsonview;
	};		
	
	
	
	@RequestMapping(value = "/efms/EFC_CORP/modify_json.do")
	public View EFC_CORP_modify_json(@RequestParam Map param, 
			@RequestParam Map <String, Object> mocaMap,
			ModelMap model) throws Exception {
		if(!U.preCheck(model)) {return jsonview;}
		
    	Map bodyMap = U.getBody(mocaMap);
    	List list = (List)bodyMap.get("paramList");
    	try {
        	//삭제대상을 먼저삭제해야 insert시 문제가 없다.
        	for(int i=0;i < list.size() ;i++) {
        		Map row = (Map)list.get(i);
        		//row.put("CORP_CD", bodyMap.get("CORP_CD"));
        		//row.put("SYS_CD", bodyMap.get("SYS_CD"));

            	if("D".equalsIgnoreCase(U.getStatus(row)) ) {
            		mocaEFLService.deleteList_EFC_CORP(row);
            	}
        	}
        	for(int i=0;i < list.size() ;i++) {
        		Map row = (Map)list.get(i);
        		//row.put("CORP_CD", bodyMap.get("CORP_CD"));
        		//row.put("SYS_CD", bodyMap.get("SYS_CD"));

            	if("C".equalsIgnoreCase(U.getStatus(row)) ) {
            		mocaEFLService.insertOne_EFGCORP(row);
            	}else if("U".equalsIgnoreCase(U.getStatus(row)) ) {
        			//업무사용자 수정시 히스토리 정보를 등록한다.
        			mocaEFLService.updateList_EFGCORP(row);
            	}
        	}
    	}catch(Exception e) {
    		e.printStackTrace();
    	}
        return jsonview;
	}		
	/**
	 * 시스템목록 조회
	 * @param userSearchVO 검색조건정보
	 * @param model 화면모델
	 * @return cmm/uss/umt/EgovUserManage
	 * @throws Exception
	 */ 
	@RequestMapping(value = "/efms/EFC_SYST/list_json.do")
	public View EFC_SYST_list_json(@RequestParam Map param, 
			@RequestParam Map <String, Object> mocaMap,
			ModelMap model) throws Exception {
		if(!U.preCheck(model)) {return jsonview;}
		
		Map map = U.getBody(mocaMap);
		model.addAttribute("list", mocaEFLService.selectList_EFC_SYST(map));
        return jsonview;
	}	
	
	@RequestMapping(value = "/efms/EFC_SYST/list_nosess_json.do")
	public View EFC_SYST_list_nosess_json(@RequestParam Map param, 
			@RequestParam Map <String, Object> mocaMap,
			ModelMap model) throws Exception {
		Map map = U.getBodyNoSess(mocaMap);
		model.addAttribute("list", mocaEFLService.selectList_EFC_SYST(map));
        return jsonview;
	}	
	@RequestMapping(value = "/efms/EFC_SYST/modify_json.do")
	public View EFC_SYST_modify_json(@RequestParam Map param, 
			@RequestParam Map <String, Object> mocaMap,
			ModelMap model) throws Exception {
		if(!U.preCheck(model)) {return jsonview;}
		
    	Map bodyMap = U.getBody(mocaMap);
    	List list = (List)bodyMap.get("paramList");
    	try {
        	//삭제대상을 먼저삭제해야 insert시 문제가 없다.
        	for(int i=0;i < list.size() ;i++) {
        		Map row = (Map)list.get(i);
        		//row.put("CORP_CD", bodyMap.get("CORP_CD"));
        		//row.put("SYS_CD", bodyMap.get("SYS_CD"));

            	if("D".equalsIgnoreCase(U.getStatus(row)) ) {
            		mocaEFLService.deleteList_EFGSYST(row);
            	}
        	}
        	for(int i=0;i < list.size() ;i++) {
        		Map row = (Map)list.get(i);
        		//row.put("CORP_CD", bodyMap.get("CORP_CD"));
        		//row.put("SYS_CD", bodyMap.get("SYS_CD"));

            	if("C".equalsIgnoreCase(U.getStatus(row)) ) {
            		mocaEFLService.insertOne_EFGSYST(row);
            	}else if("U".equalsIgnoreCase(U.getStatus(row)) ) {
        			//업무사용자 수정시 히스토리 정보를 등록한다.
        			mocaEFLService.updateList_EFGSYST(row);
            	}
        	}
    	}catch(Exception e) {
    		e.printStackTrace();
    	}
        return jsonview;
	}		
	/**
	 * 모집단 목록 조회
	 * @param userSearchVO 검색조건정보
	 * @param model 화면모델
	 * @return cmm/uss/umt/EgovUserManage
	 * @throws Exception
	 */ 
	@RequestMapping(value = "/efms/EFC_POPU/list_json.do")
	public View EFC_POPU_list_json(@RequestParam Map param, 
			@RequestParam Map <String, Object> mocaMap,
			ModelMap model) throws Exception {
		if(!U.preCheck(model)) {return jsonview;}
		
		Map map = U.getBody(mocaMap);
		model.addAttribute("list", mocaEFLService.selectList_EFC_POPU(map));
        return jsonview;
	}	
	@RequestMapping(value = "/efms/EFC_POPU/list_nosess_json.do")
	public View list_nosess_json(@RequestParam Map param, 
			@RequestParam Map <String, Object> mocaMap,
			ModelMap model) throws Exception {
		Map map = U.getBodyNoSess(mocaMap);
		model.addAttribute("list", mocaEFLService.selectList_EFC_POPU(map));
        return jsonview;
	}	
	@RequestMapping(value = "/efms/EFC_JOIN_POPU/list_json.do")
	public View EFC_JOIN_POPU_list_json(@RequestParam Map param, 
			@RequestParam Map <String, Object> mocaMap,
			ModelMap model) throws Exception {
		if(!U.preCheck(model)) {return jsonview;}
		
		Map bodyMap = U.getBody(mocaMap);
		String MP = (String)bodyMap.get("MP_CD");
    	String SP = (String)bodyMap.get("SP_CD");
    	String AC = (String)bodyMap.get("AC_CD");
    	String R = (String)bodyMap.get("R_CD");
    	String CA = (String)bodyMap.get("CA_CD");
    	
		model.addAttribute("list", mocaEFLService.selectList_JOIN_POPU(bodyMap));
        return jsonview;
	}	
	
	@RequestMapping(value = "/efms/add.do", method = RequestMethod.POST)
//  인자로 MulfiPartFile 객체, MultipartHttpServletRequest 객체, 업로드 하려는 도메인 클래스를 받는다
    public View reAddProCtrl(@RequestParam("uploadFile") MultipartFile uploadFile,
                                    MultipartHttpServletRequest request,ModelMap model) {

		
        try {
            //System.out.println("RewardController reAddProCtrl uploadFile : " + uploadFile);
            
//          UtilFile 객체 생성
            
//          파일 업로드 결과값을 path로 받아온다(이미 fileUpload() 메소드에서 해당 경로에 업로드는 끝났음)
            String uploadPath = U.fileUpload(request, uploadFile, null,"ADD");
            
//          해당 경로만 받아 db에 저장
            //int n = rewardService.reAddServ(uploadPath, null);
            
            //System.out.println("RewardController reAddProCtrl uploadPath : " + uploadPath);
            Map mp = new HashMap();
            mp.put("uploadPath", uploadPath);
            
    		model.addAttribute("result", mp);  
        	
        }catch(Exception e) {
        	e.printStackTrace();
        }

        return jsonview;
    }

	
	
	
	@RequestMapping(value = "/efms/receipt.do")
	public View receipt(HttpServletRequest request,
			@RequestParam("mediaFile") MultipartFile[] files,//한개씩만 전송예정!
			ModelMap model) {
		Map exceptionMap = new HashMap();
		exceptionInit(request, exceptionMap);
		//System.out.println("접수들어옴:"+files.length);
		try {
		    Map mapvo = new HashMap();
			Map param = requestToMap(request, mapvo);
			String fileKey = (String)mapvo.get("fileKey");
			String uploadPath = (String)mapvo.get("uploadPath");
			String[] arr0 = (String[])param.get("fileInfo");
			//for(int i=0; i < files.length; i++) {//한개씩만 전송예정!
			if(files != null && files.length > 0) {
				MultipartFile uploadFile= files[0];
				String fileNm = uploadFile.getOriginalFilename();
				//System.out.println("------------------------------>fileNm:"+fileNm);
				String info = arr0[0];
				//System.out.println("------------------------------>info:"+info);
				String[] infoArr = info.split("@@");
				String key3 = infoArr[6];//POPU_CD
				String fileName = infoArr[2];
				String lastModified = infoArr[7];

				Map map = setEmail(exceptionMap, mapvo);
				Map pathInfo = getUploadPath(request, uploadFile, key3, map);
				String input = (String)pathInfo.get("SEPA");
				String CREATE_DT_TYPE = (String)pathInfo.get("CREATE_DT_TYPE");
				uploadPath = (String)pathInfo.get("uploadPath");
				
				if(infoArr[5].equals(egovframework.batch.FileFnc.extractFileHashSHA256(uploadPath))) {///////////////////////////////////////////////////////////해시비교
					mapvo.put("uploadPath", uploadPath);
					mapvo.put("fileNm", fileNm);
					mapvo.put("lastModified", lastModified);
					mapvo.put("fileMetaMap", U.getPatternMap(fileName, input,CREATE_DT_TYPE,lastModified));
					fileBatchService.receipt(mapvo);
				}
			}else if(fileKey != null) {//무파일 접수!!!
				String fileNm =(String)mapvo.get("fileNm");
				String info = arr0[0];
				//System.out.println("info:"+info);
				String[] infoArr = info.split("@@");
				String key3 = infoArr[6];//POPU_CD
				String fileName = infoArr[2];
				String lastModified = infoArr[7];
				//System.out.println(fileKey+" 접수fileNm:"+fileNm);
				//System.out.println(fileKey+ "접수fileName:"+fileName);
				Map map = setEmail(exceptionMap, mapvo);
				map.put("POPU_CD", key3);
				Map pathInfo = mocaEFLService.selectOne_EFC_POPU(map);
				String input = (String)pathInfo.get("SEPA");
				String CREATE_DT_TYPE = (String)pathInfo.get("CREATE_DT_TYPE");
				pathInfo.put("uploadPath", uploadPath);
				//System.out.println("로컬해시:"+infoArr[5]);
				//System.out.println("서버해시:"+egovframework.batch.FileFnc.extractFileHashSHA256(uploadPath));
				//System.out.println("uploadPath:"+uploadPath);
				File lastFile = new File(uploadPath);
				String p = lastFile.getParent();
				//System.out.println("p:"+p);
				File p_f = new File(p);
				if(!p_f.exists()) {
					p_f.mkdirs();
				}
				lastFile.length();
				if(infoArr[5].equals(egovframework.batch.FileFnc.extractFileHashSHA256(uploadPath))) {///////////////////////////////////////////////////////////해시비교
					mapvo.put("uploadPath", uploadPath);
					mapvo.put("fileNm", fileNm);
					mapvo.put("lastModified", lastModified);
					mapvo.put("fileMetaMap", U.getPatternMap(fileName, input,CREATE_DT_TYPE,lastModified));
					
					//System.out.println("접수합니다:"+mapvo);
					fileBatchService.receipt(mapvo);
				}else {
					//System.out.println("해시불일치:"+fileKey+" 접수fileNm:"+fileNm);
					
					
				}
			}
		}catch(Exception e) {
			writeErrorLog(exceptionMap, e);
		}
	    return jsonview; 
    }

	@RequestMapping(value = "/efms/receipt_bigfile_upload.do")
	public View receipt_bigfile_upload(HttpServletRequest request,
			@RequestParam("mediaFile") MultipartFile[] files,//한개씩만 전송예정!
			ModelMap model) {
		
		Map exceptionMap = new HashMap();
		exceptionInit(request, exceptionMap);
		try {
		    Map mapvo = new HashMap();
			Map param = requestToMap(request, mapvo);
			//System.out.println("-mapvo-->"+mapvo);
			//System.out.println("-param-->"+param);
			if(files != null && files.length > 0) {
				MultipartFile uploadFile= files[0];
				String fileNm = uploadFile.getOriginalFilename();
				//System.out.println("-fileNm-->"+fileNm);
				Map map = new HashMap();
				map.put("CORP_CD", mapvo.get("CORP_CD"));
				map.put("SYS_CD", mapvo.get("SYS_CD"));
				map.put("POPU_CD", mapvo.get("POPU_CD"));
				Map pathInfo = mocaEFLService.selectOne_EFC_POPU(map);
				String RECEIPT_SERVER_DIR = getRecipt_server_dir(pathInfo);
				String RECEIPT_SERVER_BIG_DIR =  RECEIPT_SERVER_DIR.replaceAll("/receipt/", "/receipt_bigsize/");
				File f = new File(RECEIPT_SERVER_BIG_DIR);
				if(!f.exists()) {
					f.mkdirs();
				}
				

				pathInfo.put("RECEIPT_SERVER_DIR", RECEIPT_SERVER_BIG_DIR);
				String uploadPath = U.fileUploadBig(request, uploadFile, pathInfo,mapvo.get("POPU_CD").toString());///home/user/mocajsp/receipt_bigsize/001S01P01/001/S01/TRID20191219194346384_10._tmp
				String trid = (String)mapvo.get("trid");
				String total = (String)mapvo.get("total");
				int total_int = Integer.parseInt(total)-1;
				String fileName = (trid+"_"+total_int+"._tmp");
				
				if(uploadPath.endsWith(fileName) ) {
					//모든조각이 업로도됨!
					String dir = uploadPath.replaceAll("/"+fileName, "");
					////System.out.println("dir1:"+dir);
					//dir = dir.replaceAll("receipt_bigsize", "receipt");
					////System.out.println("dir2:"+dir);
					String newName = System.currentTimeMillis()+"";
					uploadPath = Big.combineFile(newName, dir,trid,Integer.parseInt(total));
					model.addAttribute("newName", newName);
					model.addAttribute("uploadPath", uploadPath);
				}
			}
		}catch(Exception e) {
			writeErrorLog(exceptionMap, e);
		}
	    return jsonview; 
    }

	private String getRecipt_server_dir(Map pathInfo) {
		String RECEIPT_SERVER_DIR = (String)pathInfo.get("RECEIPT_SERVER_DIR");
		if(RECEIPT_SERVER_DIR == null || "".equals(RECEIPT_SERVER_DIR.trim())) {
			RECEIPT_SERVER_DIR = EgovProperties.getPathProperty("Globals.receiptDir");
		}
		RECEIPT_SERVER_DIR = RECEIPT_SERVER_DIR+"/"+(String)pathInfo.get("POPU_CD");
		return RECEIPT_SERVER_DIR;
	}
	
	
	private Map getUploadPath(HttpServletRequest request, MultipartFile uploadFile, String key3, Map map)
			throws Exception {
		map.put("POPU_CD", key3);
		Map pathInfo = mocaEFLService.selectOne_EFC_POPU(map);
		String input = (String)pathInfo.get("SEPA");
		String CREATE_DT_TYPE = (String)pathInfo.get("CREATE_DT_TYPE");
		String uploadPath = U.fileUpload(request, uploadFile, pathInfo,key3);////////////////////////////////////////////////////////////////////////////
		pathInfo.put("uploadPath", uploadPath);
		return pathInfo;
	}

	private Map setEmail(Map exceptionMap,Map mapvo) throws Exception {
		String key1 = (String)mapvo.get("corpCd");
		String key2 = (String)mapvo.get("sysCd");
		Map map = new HashMap();
		map.put("CORP_CD", key1);
		map.put("SYS_CD", key2);

		Map emailMap = mocaEFLService.selectOne_EFGSYST(map);
		String emails = (String)emailMap.get("EMAIL");
		String[] array = emails.split(",");
		exceptionMap.put("EMAILS", emails);
		exceptionMap.put("InternetAddress", array);
		return map;
	}

	private void writeErrorLog(Map exceptionMap, Exception e) {
		StringWriter sw = new StringWriter(); 
		e.printStackTrace(new PrintWriter(sw)); 
		String exceptionAsString = sw.toString(); 
		exceptionMap.put("EXCEPTION", exceptionAsString);
		exceptionMap.put("text", (String)exceptionMap.get("PARAMETERMAP")+"<br>"+exceptionAsString);
		try {
			fileBatchService.writeErrorLog(exceptionMap);
		}catch(Exception e2) {
			e2.printStackTrace();
		}
	}

	private Map requestToMap(HttpServletRequest request, Map mapvo) {
		//InternetAddress
		mapvo.put("remoteHost", request.getRemoteHost());
		mapvo.put("remoteAddr", request.getRemoteAddr());
		mapvo.put("remotePort", request.getRemotePort());
		Map param = request.getParameterMap();
		Set st = param.keySet();
		Iterator it = st.iterator();
		while(it.hasNext()) {
			Object key = it.next();
			String[] arr = (String[])param.get(key);
			//if("fileInfo".equalsIgnoreCase((String)key)) {
			//	mapvo.put(key, Arrays.asList(arr));   
			//}else {
				mapvo.put(key, arr[0]);
			//}
		}
		Enumeration enu = request.getHeaderNames();
		while(enu.hasMoreElements()) {
			String headerKey = (String)enu.nextElement();
			if(!"content-type".equalsIgnoreCase(headerKey)) {
		    	String value = (String)request.getHeader((String)headerKey);
		    	mapvo.put(headerKey, value);
			}
		}
		return param;
	}

	private void exceptionInit(HttpServletRequest request, Map exceptionMap) {
		exceptionMap.put("REMOTE_HOST", request.getRemoteHost());
		exceptionMap.put("REMOTE_ADDR", request.getRemoteAddr());
		exceptionMap.put("REMOTE_PORT", request.getRemotePort());
		String s = "parameter";
		if(request.getParameterMap() != null) {
			Map mp = request.getParameterMap();
			Set st = mp.keySet();
			Iterator iter = st.iterator();
			while(iter.hasNext()) {
				Object key = iter.next();
				Object isArr = mp.get(key);
				Class cls = isArr.getClass();
				if("[Ljava.lang.String;".equals(cls.getName())) {
					String[] arr = (String[])isArr;
					List l = Arrays.asList(arr);
					s += ","+key+":"+l;
					
				}
			}
			exceptionMap.put("PARAMETERMAP", s);
		}
		exceptionMap.put("X_FORWARDED_FOR", request.getHeader("x-forwarded-for"));
		exceptionMap.put("REQUEST_URL", request.getRequestURL().toString());
		exceptionMap.put("REQUEST_URI", request.getRequestURI()+"");
		exceptionMap.put("title", "[EFMS:"+(String)exceptionMap.get("REQUEST_URL")+":ERROR]");
	}

   
	@RequestMapping(value = "/efms/fileChange.do")
	public View fileChange(HttpServletRequest request,
			@RequestParam("file") MultipartFile[] files,
			ModelMap model) {

		try {
			MultipartFile uploadFile= files[0];
			String json = request.getParameter("data");
			Map<String, Object> map = U.getMap(json);
			
			Map map2 = new HashMap();
			map2.put("FILE_ID",	(String)map.get("FILE_ID") );
			Map pathInfo = mocaEFLService.selectOne_EFC_FILE(map2);
			
			Map map3 = new HashMap();
			String PATH = (String)pathInfo.get("PATH");
			int lindex = PATH.lastIndexOf("/");
			String RECEIPT_SERVER_DIR = PATH.substring(0,lindex);
			String FILE_ID = PATH.substring(lindex+1);
			map3.put("RECEIPT_SERVER_DIR",	RECEIPT_SERVER_DIR);
			map3.put("CORP_CD",	(String)pathInfo.get("CORP_CD") );
			map3.put("SYS_CD",	(String)pathInfo.get("SYS_CD") );
			String uploadPath = U.fileUpload(request, uploadFile, map3,null);
		}catch(Exception e) {
			e.printStackTrace();
		}

	    return jsonview; 
    }
	
/*	@RequestMapping(value = "/fileUpload") // method = RequestMethod.GET 
	public Map fileUpload(HttpServletRequest req, HttpServletResponse rep) { 
		//파일이 저장될 path 설정 String path = "c://aaa"; Map returnObject = new HashMap(); try { // MultipartHttpServletRequest 생성 MultipartHttpServletRequest mhsr = (MultipartHttpServletRequest) req; Iterator iter = mhsr.getFileNames(); MultipartFile mfile = null; String fieldName = ""; List resultList = new ArrayList(); // 디레토리가 없다면 생성 File dir = new File(path); if (!dir.isDirectory()) { dir.mkdirs(); } // 값이 나올때까지 while (iter.hasNext()) { fieldName = iter.next(); // 내용을 가져와서 mfile = mhsr.getFile(fieldName); String origName; origName = new String(mfile.getOriginalFilename().getBytes("8859_1"), "UTF-8"); //한글꺠짐 방지 // 파일명이 없다면 if ("".equals(origName)) { continue; } // 파일 명 변경(uuid로 암호화) String ext = origName.substring(origName.lastIndexOf('.')); // 확장자 String saveFileName = getUuid() + ext; // 설정한 path에 파일저장 File serverFile = new File(path + File.separator + saveFileName); mfile.transferTo(serverFile); Map file = new HashMap(); file.put("origName", origName); file.put("sfile", serverFile); resultList.add(file); } returnObject.put("files", resultList); returnObject.put("params", mhsr.getParameterMap()); } catch (UnsupportedEncodingException e) { // TODO Auto-generated catch block e.printStackTrace(); }catch (IllegalStateException e) { // TODO Auto-generated catch block e.printStackTrace(); } catch (IOException e) { // TODO Auto-generated catch block e.printStackTrace(); } return null; } //uuid생성 public static String getUuid() { return UUID.randomUUID().toString().replaceAll("-", ""); }
	}
*/
		
	@RequestMapping(value = "/efms/EFL_MSCA/modify_json.do")
	public View EFL_MSCA_modify_json(@RequestParam Map param, 
			@RequestParam Map <String, Object> mocaMap,
			ModelMap model) throws Exception {
		if(!U.preCheck(model)) {return jsonview;}
		
    	Map bodyMap = U.getBody(mocaMap);
    	List list = (List)bodyMap.get("paramList");
    	try {
        	//삭제대상을 먼저삭제해야 insert시 문제가 없다.
        	for(int i=0;i < list.size() ;i++) {
        		Map row = (Map)list.get(i);
            	if("D".equalsIgnoreCase(U.getStatus(row)) ) {
            		mocaEFLService.deleteList_EFL_MSCA(row);
            	}
        	}
        	
        	for(int i=0;i < list.size() ;i++) {
        		Map row = (Map)list.get(i);
            	if("C".equalsIgnoreCase(U.getStatus(row)) ) {
            		mocaEFLService.insertList_EFL_MSCA(row);
            	}else if("U".equalsIgnoreCase(U.getStatus(row)) ) {
        			mocaEFLService.updateList_EFL_MSCA(row);
            	}
        	}
    		
    	}catch(Exception e) {
    		e.printStackTrace();
    	}

        return jsonview;    
	};
	
	
	
	@RequestMapping(value = "/efms/EFL_MSCA/modify_json_for_grd_2.do")
	public View EFL_MSCA_modify_json_for_grd_2(@RequestParam Map param, 
			@RequestParam Map <String, Object> mocaMap,
			ModelMap model) throws Exception {
		if(!U.preCheck(model)) {return jsonview;}
		
    	Map bodyMap = U.getBody(mocaMap);
    	List list = (List)bodyMap.get("paramList");//체크된 모집단리스트


    	try {
        	List caList = mocaEFLService.selectList_EFGCA(bodyMap); 
        	for(int k=0; k < caList.size(); k++) {
        		Map caRow = (Map)caList.get(k);
            	String MP = (String)caRow.get("MP_CD");
            	String SP = (String)caRow.get("SP_CD");
            	String AC = (String)caRow.get("AC_CD");
            	String R = (String)caRow.get("R_CD");
            	String CA = (String)caRow.get("CA_CD");
        		mocaEFLService.deleteAll_EFGCA_POPU_M(caRow);
            	for(int i=0;i < list.size() ;i++) {
            		Map row = (Map)list.get(i);
            		row.put("MP_CD", MP);
            		row.put("SP_CD", SP);
            		row.put("AC_CD", AC);
            		row.put("R_CD", R);
            		row.put("CA_CD", CA);
            		mocaEFLService.insertList_EFGCA_POPU_M(row);
            	}
        	}

    	}catch(Exception e) {
    		e.printStackTrace();
    	}
        return jsonview;    
	};
		
	
	
	@RequestMapping(value = "/efms/EFL_MSCA/list_json.do")
	public View EFL_MSCA_list_json(@RequestParam Map param, 
			@RequestParam Map <String, Object> mocaMap,
			ModelMap model) throws Exception {
		if(!U.preCheck(model)) {return jsonview;}
		
		Map map = U.getBody(mocaMap);
		model.addAttribute("list", mocaEFLService.selectList_EFL_MSCA(map));
        return jsonview;
	}	

	@RequestMapping(value = "/efms/EFL_MSCA/modify_json_after_all_delete.do")
	public View EFL_MSCA_modify_json_after_all_deletes(@RequestParam Map param, 
			@RequestParam Map <String, Object> mocaMap,
			ModelMap model) throws Exception {
		if(!U.preCheck(model)) {return jsonview;}
		
		try {
			Map bodyMap = U.getBody(mocaMap);
			mocaEFLService.deleteAll_EFL_MSCA(bodyMap);
	    	List list = (List)bodyMap.get("paramList");
	    	try {

	        	for(int i=0;i < list.size() ;i++) {
	        		Map row = (Map)list.get(i);
	            	if("C".equalsIgnoreCase(U.getStatus(row)) ) {
	            		mocaEFLService.insertList_EFL_MSCA(row);
	            	}else if("U".equalsIgnoreCase(U.getStatus(row)) ) {
	        			mocaEFLService.updateList_EFL_MSCA(row);
	            	}
	        	}
	    		
	    	}catch(Exception e) {
	    		e.printStackTrace();
	    	}

			
		}catch(Exception e) {
			e.printStackTrace();
		}

        return jsonview;
	}
	
	@RequestMapping(value = "/efms/EFL_CAFL/list_json.do")
	public View EFL_CAFL_list_json(@RequestParam Map param, 
			@RequestParam Map <String, Object> mocaMap,
			ModelMap model) throws Exception {
		if(!U.preCheck(model)) {return jsonview;}
		
		Map map = U.getBody(mocaMap);
		String cd = (String)map.get("CD");
		String[] arr = cd.split("__");
		if(arr != null) {
			if(arr.length > 0) {
				map.put("MP_CD", arr[0]);
			}
			if(arr.length > 1) {
				map.put("SP_CD", arr[1]);
			}
			if(arr.length > 2) {
				map.put("AC_CD", arr[2]);
			}
			if(arr.length > 3) {
				map.put("R_CD", arr[3]);
			}
			if(arr.length > 4) {
				map.put("CA_CD", arr[4]);
			}
		}
		model.addAttribute("list", mocaEFLService.selectList_EFL_CAFL(map));
        return jsonview;
	}	
	@RequestMapping(value = "/efms/EFL_CAFL/list_nosess_json.do")
	public View EFL_CAFL_list_nosess_json(@RequestParam Map param, 
			@RequestParam Map <String, Object> mocaMap,
			ModelMap model) throws Exception {
		
		Map map = U.getBodyNoSess(mocaMap);
		model.addAttribute("list", mocaEFLService.selectList_EFL_CAFL(map));
        return jsonview;
	}	
	
	
	
	@RequestMapping(value = "/efms/EFL_CAFL/list_tree_json.do")
	public View EFL_CAFL_list_tree_json(@RequestParam Map param, 
			@RequestParam Map <String, Object> mocaMap,
			ModelMap model) throws Exception {
		if(!U.preCheck(model)) {return jsonview;}
		
		Map map = U.getBody(mocaMap);
		model.addAttribute("list", mocaEFLService.selectList_EFL_CAFL_TREE(map));
        return jsonview;
	}	
	@RequestMapping(value = "/efms/EFL_CAFL/list_tree_nosess_json.do")
	public View EFL_CAFL_list_tree_nosess_json(@RequestParam Map param, 
			@RequestParam Map <String, Object> mocaMap,
			ModelMap model) throws Exception {

		Map map = U.getBodyNoSess(mocaMap);
		model.addAttribute("list", mocaEFLService.selectList_EFL_CAFL_TREE(map));
        return jsonview;
	}	
	
	
	
	@RequestMapping(value = "/efms/EFL_OUTS/list_json.do")
	public View EFL_OUTS_list_json(@RequestParam Map param, 
			@RequestParam Map <String, Object> mocaMap,
			ModelMap model) throws Exception {
		if(!U.preCheck(model)) {return jsonview;}
		
		Map map = U.getBody(mocaMap);
		model.addAttribute("list", mocaEFLService.selectList_EFL_OUTS(map));
        return jsonview;
	}	
	

	@RequestMapping(value = "/efms/EFL_CAFL/download_nosess.do")
	public void download_nosess(@RequestParam Map param, 
			@RequestParam Map <String, Object> mocaMap_back,
			HttpServletRequest request,HttpServletResponse response,
			ModelMap model) {
		
		try {
			String body= request.getParameter("body");
			String header= request.getParameter("header");
			Map mocaMap = new HashMap();
			mocaMap.put("body", body);
			mocaMap.put("header", header);
			//////////////////////////////////////////////////////////////////////////
			Map map = U.getBodyNoSess(mocaMap);
			//System.out.println("여기객체를 확인하고싶어요->"+map);
			String referer1 = request.getHeader("referer");
			referer1 = referer1.replaceAll("&", "amp;");
			if(false) {
				map.put("ISSUCCESS", "FAIL");
				mocaEFLService.insertList_EFL_CAFL_DOWN_H(map);
				String message = "[부적격]비상적인접근입니다. 다운로드될수 없습니다!";
				
				ServletOutputStream out = response.getOutputStream();
				response.setContentType("text/html; charset=utf-8");
				out.write(message.getBytes());
				out.flush();
				out.close();
			}else {
				String FILE_ID = (String)map.get("FILE_ID");
				DownloadView fileDown = new DownloadView(); //파일다운로드 객체생성
				Map popuMap = mocaEFLService.selectOne_EFL_CAFL(map);
				//System.out.println("map->"+map);
				//map->{MF_SPARE1=임시1, FILE_SIZE=73.0KB, MF_DEPT_NM=null, MF_SPARE2=임시2, _system={status=U, expand=true, realIndex=0.0}, SESS_USERID=admin, CHK=1, R_CD=R76, NOW_STEP=01, AC_NM=프로그램 개발, FRST_REGISTER_ID=batchadmin, FRST_REGIST_PNTTM=1.573590207E12, SP_NM=프로그램개발, META_CONTENT_TYPE=null, SYS_CD=S01, MP_CD=M10, MF_ID=TRID20191113052329943__2.JPG, MEATA_HASH=f0e3858e38845b5f170d5de35e3c189535bc786352d433ea8d6d6f60781fb9b0, MF_TERM_CD=H01, META_AUTHOR=null, MEATA_TITLE=null, LAST_UPDT_PNTTM=1.573590207E12, META_CREATION_DATE=null, LAST_UPDUSR_ID=batchadmin, SESS_USERNM=관리자, MF_DEPT_CD=영업부(001), MF_DT=20191225, FILE_ID=TRID20191113052329943__2.JPG, POPU_CD=001S01P01, AC_CD=AC50, CA_CD=C-10-01-03, CORP_CD=001, SP_CD=SUB23, ETC=null, FILE_EXTEN=JPG, MP_NM=IT프로세스, MF_NM=null, META_LAST_MODIFIED=null, SESS_TRANID=TRAN_201922111324297905040502010603}

				//모집단조회해서 파일위치확인
				//다운로드history tranid로 저장
				Map fileInfoMap = mocaEFLService.getFullPath(map); 
		
				//LoginVO user = (LoginVO) EgovUserDetailsHelper.getAuthenticatedUser();
				String icproId = (String)map.get("icproId");
				map.put("CHANNEL", "EFMS_WEB");
				map.put("LAST_UPDUSR_ID", icproId);
				map.put("LAST_UPDUSR_NM", icproId);
				map.put("REFERER", referer1);
				map = fileDown.filDown(request, response,(String)fileInfoMap.get("PATH"),(String)fileInfoMap.get("FILE_NM"),(String)popuMap.get("MEATA_HASH"),(String)popuMap.get("FILE_ID"),map); //파일다운로드 
				if("SUCCESS".equals((String)map.get("ISSUCCESS")) ) {
					File file = new File( (String)fileInfoMap.get("PATH"));
					response.setContentType("application/octet-stream; charset=utf-8");
					response.setContentLength((int) file.length());
					String browser = getBrowser(request);
					String disposition = getDisposition((String)fileInfoMap.get("FILE_NM"), browser);
					response.setHeader("Content-Disposition", disposition);
					response.setHeader("Content-Transfer-Encoding", "binary");
					OutputStream out = response.getOutputStream();
					FileInputStream fis = null;
					fis = new FileInputStream(file);
					FileCopyUtils.copy(fis, out);
					mocaEFLService.insertList_EFL_CAFL_DOWN_H(map);
					if (fis != null)
						fis.close();
					out.flush();
					out.close();
				}else {
					map.put("ISSUCCESS", "FAIL");
					mocaEFLService.insertList_EFL_CAFL_DOWN_H(map);
					String message = "[부적격]파일이 위,변조 되어 다운로드될수 없습니다!";
					
					ServletOutputStream out = response.getOutputStream();
					response.setContentType("text/html; charset=utf-8");
					out.write(message.getBytes());
					out.flush();
					out.close();
				}
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
	}	
	
	
	@RequestMapping(value = "/efms/EFL_CAFL/download.do")
	public void EFL_CAFL_download(@RequestParam Map param, 
			@RequestParam Map <String, Object> mocaMap_back,
			HttpServletRequest request,HttpServletResponse response,
			ModelMap model) {
		if(!U.preCheck(model)) {return ;}
		
		try {
			String body= request.getParameter("body");
			String header= request.getParameter("header");
			Map mocaMap = new HashMap();
			mocaMap.put("body", body);
			mocaMap.put("header", header);
			//////////////////////////////////////////////////////////////////////////
			Map map = U.getBody(mocaMap);
			String referer1 = request.getHeader("referer");
			referer1 = referer1.replaceAll("&", "amp;");
			if(false) {
				map.put("ISSUCCESS", "FAIL");
				mocaEFLService.insertList_EFL_CAFL_DOWN_H(map);
				String message = "[부적격]비상적인접근입니다. 다운로드될수 없습니다!";
				
				ServletOutputStream out = response.getOutputStream();
				response.setContentType("text/html; charset=utf-8");
				out.write(message.getBytes());
				out.flush();
				out.close();
			}else {
				String FILE_ID = (String)map.get("FILE_ID");
				DownloadView fileDown = new DownloadView(); //파일다운로드 객체생성
				Map popuMap = mocaEFLService.selectOne_EFL_CAFL(map);
				//System.out.println("map->"+map);
				//map->{MF_SPARE1=임시1, FILE_SIZE=73.0KB, MF_DEPT_NM=null, MF_SPARE2=임시2, _system={status=U, expand=true, realIndex=0.0}, SESS_USERID=admin, CHK=1, R_CD=R76, NOW_STEP=01, AC_NM=프로그램 개발, FRST_REGISTER_ID=batchadmin, FRST_REGIST_PNTTM=1.573590207E12, SP_NM=프로그램개발, META_CONTENT_TYPE=null, SYS_CD=S01, MP_CD=M10, MF_ID=TRID20191113052329943__2.JPG, MEATA_HASH=f0e3858e38845b5f170d5de35e3c189535bc786352d433ea8d6d6f60781fb9b0, MF_TERM_CD=H01, META_AUTHOR=null, MEATA_TITLE=null, LAST_UPDT_PNTTM=1.573590207E12, META_CREATION_DATE=null, LAST_UPDUSR_ID=batchadmin, SESS_USERNM=관리자, MF_DEPT_CD=영업부(001), MF_DT=20191225, FILE_ID=TRID20191113052329943__2.JPG, POPU_CD=001S01P01, AC_CD=AC50, CA_CD=C-10-01-03, CORP_CD=001, SP_CD=SUB23, ETC=null, FILE_EXTEN=JPG, MP_NM=IT프로세스, MF_NM=null, META_LAST_MODIFIED=null, SESS_TRANID=TRAN_201922111324297905040502010603}

				//모집단조회해서 파일위치확인
				//다운로드history tranid로 저장
				Map fileInfoMap = mocaEFLService.getFullPath(map); 
		
				LoginVO user = (LoginVO) EgovUserDetailsHelper.getAuthenticatedUser();
				map.put("CHANNEL", "EFMS_WEB");
				map.put("LAST_UPDUSR_ID", user.getId());
				map.put("LAST_UPDUSR_NM", user.getName());
				map.put("REFERER", referer1);
				map = fileDown.filDown(request, response,(String)fileInfoMap.get("PATH"),(String)fileInfoMap.get("FILE_NM"),(String)popuMap.get("MEATA_HASH"),(String)popuMap.get("FILE_ID"),map); //파일다운로드 
				if("SUCCESS".equals((String)map.get("ISSUCCESS")) ) {
					File file = new File( (String)fileInfoMap.get("PATH"));
					response.setContentType("application/octet-stream; charset=utf-8");
					response.setContentLength((int) file.length());
					String browser = getBrowser(request);
					String disposition = getDisposition((String)fileInfoMap.get("FILE_NM"), browser);
					response.setHeader("Content-Disposition", disposition);
					response.setHeader("Content-Transfer-Encoding", "binary");
					OutputStream out = response.getOutputStream();
					FileInputStream fis = null;
					fis = new FileInputStream(file);
					FileCopyUtils.copy(fis, out);
					mocaEFLService.insertList_EFL_CAFL_DOWN_H(map);
					if (fis != null)
						fis.close();
					out.flush();
					out.close();
				}else {
					map.put("ISSUCCESS", "FAIL");
					mocaEFLService.insertList_EFL_CAFL_DOWN_H(map);
					String message = "[부적격]파일이 위,변조 되어 다운로드될수 없습니다!";
					
					ServletOutputStream out = response.getOutputStream();
					response.setContentType("text/html; charset=utf-8");
					out.write(message.getBytes());
					out.flush();
					out.close();
				}
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
	}	
	
	@RequestMapping(value = "/efms/EFL_CAFL/download_byurl.do")
	public void EFL_CAFL_download_byurl(@RequestParam Map param, 
			@RequestParam Map <String, Object> mocaMap_back,
			HttpServletRequest request,HttpServletResponse response,
			ModelMap model) {

		
		try {
			String file_id= request.getParameter("file_id");
			String channel= request.getParameter("channel");
			String tran_id = UUID.randomUUID().toString();
			String user_id= request.getParameter("user_id");
			
			String full_nm= request.getParameter("full_nm");
			full_nm = URLDecoder.decode(full_nm, "UTF-8");
			String full_cd= request.getParameter("full_cd");
			String[] full_nm_arr = full_nm.split("__");
			String[] full_cd_arr = full_cd.split("__");
			
			
			String referer1 = request.getHeader("referer");
			//referer1 = referer1.replaceAll("&", "amp;");
			////System.out.println("referer1>"+referer1+">");
			Map map = new HashMap();
			map.put("CHANNEL", channel);
			map.put("FILE_ID", file_id);
			map.put("TR_ID", tran_id);
			map.put("LAST_UPDUSR_ID", user_id);
			map.put("LAST_UPDUSR_NM", user_id);
			map.put("REFERER", referer1);
			
			if(full_cd_arr != null && full_cd_arr.length > 4) {
				map.put("MP_CD", full_cd_arr[0]);
				map.put("SP_CD", full_cd_arr[1]);
				map.put("AC_CD", full_cd_arr[2]);
				map.put("R_CD", full_cd_arr[3]);
				map.put("CA_CD", full_cd_arr[4]);	
			}
			if(full_nm_arr != null && full_nm_arr.length > 4) {
				map.put("MP_NM", U.d(full_nm_arr[0]));
				map.put("SP_NM", U.d(full_nm_arr[1]));
				map.put("AC_NM", U.d(full_nm_arr[2]));
				map.put("R_NM", U.d(full_nm_arr[3]));
				map.put("CA_NM", U.d(full_nm_arr[4]));	
			}

			
			if(false) {
				map.put("ISSUCCESS", "FAIL");
				mocaEFLService.insertList_EFL_CAFL_DOWN_H(map);
				String message = "[부적격]비상적인접근입니다. 다운로드될수 없습니다!";
				
				ServletOutputStream out = response.getOutputStream();
				response.setContentType("text/html; charset=utf-8");
				out.write(message.getBytes());
				out.flush();
				out.close();
			}else {
				Map popuMap = mocaEFLService.selectOne_EFL_CAFL(map);
				
				DownloadView fileDown = new DownloadView(); //파일다운로드 객체생성
				Map fileInfoMap = mocaEFLService.getFullPath(map);
				map = fileDown.filDown(request, response,(String)fileInfoMap.get("PATH"),(String)fileInfoMap.get("FILE_NM"),(String)popuMap.get("MEATA_HASH"),(String)popuMap.get("FILE_ID"),map); //파일다운로드 
				if("SUCCESS".equals((String)map.get("ISSUCCESS")) ) {
					File file = new File( (String)fileInfoMap.get("PATH"));
					response.setContentType("application/octet-stream; charset=utf-8");
					response.setContentLength((int) file.length());
					String browser = getBrowser(request);
					String disposition = getDisposition((String)fileInfoMap.get("FILE_NM"), browser);
					response.setHeader("Content-Disposition", disposition);
					response.setHeader("Content-Transfer-Encoding", "binary");
					OutputStream out = response.getOutputStream();
					FileInputStream fis = null;
					fis = new FileInputStream(file);
					FileCopyUtils.copy(fis, out);
					mocaEFLService.insertList_EFL_CAFL_DOWN_H(map);
					if (fis != null)
						fis.close();
					out.flush();
					out.close();
				}else {
					map.put("ISSUCCESS", "FAIL");
					mocaEFLService.insertList_EFL_CAFL_DOWN_H(map);
					String message = "[부적격]파일이 위,변조 되어 다운로드될수 없습니다!";
					
					ServletOutputStream out = response.getOutputStream();
					response.setContentType("text/html; charset=utf-8");
					out.write(message.getBytes());
					out.flush();
					out.close();
				}
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
	}	
	
	@RequestMapping(value = "/efms/EFL_CAFL/exceldownload.do")
	public void EFL_CAFL_exceldownload(@RequestParam Map param, 
			@RequestParam Map <String, Object> mocaMap_back,
			HttpServletRequest request,HttpServletResponse response,
			ModelMap model) {
		if(!U.preCheck(model)) {return ;}
		
		try {
			String body= request.getParameter("body");
			String header= request.getParameter("header");
			Map mocaMap = new HashMap();
			mocaMap.put("body", body);
			mocaMap.put("header", header);
			//////////////////////////////////////////////////////////////////////////
			Map map = U.getBodyNoSess(mocaMap);
			Map cellInfo = (Map)map.get("cellInfo");
			List list = (List)map.get("list");


		    // 워크북 생성 ///////////////////////////////////////////////////////////////////////////////////

	        Locale locale = new Locale("ko", "KR");
	        String workbookName = "down";
	        
	        // 겹치는 파일 이름 중복을 피하기 위해 시간을 이용해서 파일 이름에 추
	        Date date = new Date();
	        SimpleDateFormat dayformat = new SimpleDateFormat("yyyyMMdd", locale);
	        SimpleDateFormat hourformat = new SimpleDateFormat("hhmmss", locale);
	        String day = dayformat.format(date);
	        String hour = hourformat.format(date);
	        String fileName = workbookName + "_" + day + "_" + hour + ".xlsx";         
	        
	        // 여기서부터는 각 브라우저에 따른 파일이름 인코딩작업
	        String browser = request.getHeader("User-Agent");
	        if (browser.indexOf("MSIE") > -1) {
	            fileName = URLEncoder.encode(fileName, "UTF-8").replaceAll("\\+", "%20");
	        } else if (browser.indexOf("Trident") > -1) {       // IE11
	            fileName = URLEncoder.encode(fileName, "UTF-8").replaceAll("\\+", "%20");
	        } else if (browser.indexOf("Firefox") > -1) {
	            fileName = "\"" + new String(fileName.getBytes("UTF-8"), "8859_1") + "\"";
	        } else if (browser.indexOf("Opera") > -1) {
	            fileName = "\"" + new String(fileName.getBytes("UTF-8"), "8859_1") + "\"";
	        } else if (browser.indexOf("Chrome") > -1) {
	            StringBuffer sb = new StringBuffer();
	            for (int i = 0; i < fileName.length(); i++) {
	               char c = fileName.charAt(i);
	               if (c > '~') {
	                     sb.append(URLEncoder.encode("" + c, "UTF-8"));
	                       } else {
	                             sb.append(c);
	                       }
	                }
	                fileName = sb.toString();
	        } else if (browser.indexOf("Safari") > -1){
	            fileName = "\"" + new String(fileName.getBytes("UTF-8"), "8859_1")+ "\"";
	        } else {
	             fileName = "\"" + new String(fileName.getBytes("UTF-8"), "8859_1")+ "\"";
	        }
	        
	        response.setContentType("application/download;charset=utf-8");
	        response.setHeader("Content-Disposition", "attachment; filename=\"" + fileName + "\";");
	        response.setHeader("Content-Transfer-Encoding", "binary");
	        
	       OutputStream os = null;
	       SXSSFWorkbook workbook = null;
	       
	       try {
	           workbook = makeSimpleFruitExcelWorkbook(cellInfo,list);
	           
	           os = response.getOutputStream();
	           
	           // 파일생성
	           workbook.write(os);
	       }catch (Exception e) {
	           e.printStackTrace();
	       } finally {
	           if(workbook != null) {
	               try {
	                   workbook.close();
	               } catch (Exception e) {
	                   e.printStackTrace();
	               }
	           }
	           
	           if(os != null) {
	               try {
	                   os.close();
	               } catch (Exception e) {
	                   e.printStackTrace();
	               }
	           }
	       }
		}catch(Exception e2) {
			e2.printStackTrace();
		}
	}	
	
	/**
     * 과일 리스트를 간단한 엑셀 워크북 객체로 생성
     * @param list
     * @return 생성된 워크북
     */
    public SXSSFWorkbook makeSimpleFruitExcelWorkbook(Map cellInfo,List list) {
        SXSSFWorkbook workbook = new SXSSFWorkbook();
        // 시트 생성
        Sheet sheet = workbook.createSheet("과일표");
        
        // 헤더 행 생
        Row headerRow = sheet.createRow(0);
        CellStyle style = workbook.createCellStyle();
        style.setFillForegroundColor(HSSFColor.SKY_BLUE.index); 
        style.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
        style.setAlignment(CellStyle.ALIGN_CENTER);
        //headerRow.setRowStyle(style);
        Set st = cellInfo.keySet();
        Iterator iter = st.iterator();
        int j=0;
        while(iter.hasNext()) {
        	String key = (String)iter.next();
        	if("status".equalsIgnoreCase(key) || "CHK".equalsIgnoreCase(key)) {
        		continue;
        	}
        	String title = (String)cellInfo.get(key);
        	sheet.setColumnWidth(j, 7000);
            Cell headerCell = headerRow.createCell(j++);
            headerCell.setCellValue(title);
            headerCell.setCellStyle(style);
        }
        // 과일표 내용 행 및 셀 생성
        Row bodyRow = null;
        Cell bodyCell = null;
        for(int i=0; i<list.size(); i++) {
            Map row = (Map)list.get(i);
            if(row == null) {
            	break;
            }
            // 행 생성
            bodyRow = sheet.createRow(i+1);
            Iterator iter2 = st.iterator();
            int jj=0;
            while(iter2.hasNext()) {
            	
            	String key = (String)iter2.next();
            	if("status".equalsIgnoreCase(key) || "CHK".equalsIgnoreCase(key)) {
            		continue;
            	}

            	String title = (String)cellInfo.get(key);
                bodyCell = bodyRow.createCell(jj++);
                if(row.get(key) != null) {
                	String value = "";
                	Object o = row.get(key);
                	Class cl = o.getClass();
                	if(cl.getName().equals("java.lang.Double")) {
                		value = U.longToDate((double)row.get(key) );
                	}else {
                		value = row.get(key).toString();
                	}
                	bodyCell.setCellValue(value);
                }
            }
        }
        
        return workbook;
    }
    //body->status
    //body->CHK
	
	@RequestMapping(value = "/efms/client/properties.do")
	public View client_properties(@RequestParam Map param, 
			@RequestParam Map <String, Object> mocaMap_back,
			HttpServletRequest request,HttpServletResponse response,
			ModelMap model) {
		
		try {
			String corpCd= request.getParameter("corpCd");
			String sysCd= request.getParameter("sysCd");
			Map mocaMap = new HashMap();
			mocaMap.put("corpCd", corpCd);
			mocaMap.put("sysCd", sysCd);
			List popuList = mocaEFLService.selectProperties(mocaMap);
			model.addAttribute("properties",popuList);
		}catch(Exception e) {
			e.printStackTrace();
		}
		return jsonview;
	}	
	
	
	@RequestMapping(value = "/efms/EFL_MAIL/list_json.do")
	public View EFL_MAIL_list_json(@RequestParam Map param, 
			@RequestParam Map <String, Object> mocaMap,
			ModelMap model) throws Exception {
		if(!U.preCheck(model)) {return jsonview;}
		
		Map map = U.getBody(mocaMap);
		model.addAttribute("list", mocaEFLService.selectList_EFL_MAIL(map));
        return jsonview;
	}	
	
	
	
	
	private String getBrowser(HttpServletRequest request) {
		String header = request.getHeader("User-Agent");
		if (header.indexOf("MSIE") > -1 || header.indexOf("Trident") > -1)
			return "MSIE";
		else if (header.indexOf("Chrome") > -1)
			return "Chrome";
		else if (header.indexOf("Opera") > -1)
			return "Opera";
		return "Firefox";
	}

	private String getDisposition(String filename, String browser)
			throws UnsupportedEncodingException {
		String dispositionPrefix = "attachment;filename=";
		String encodedFilename = null;
		if (browser.equals("MSIE")) {
			encodedFilename = URLEncoder.encode(filename, "UTF-8").replaceAll(
					"\\+", "%20");
		} else if (browser.equals("Firefox")) {
			encodedFilename = "\""
					+ new String(filename.getBytes("UTF-8"), "8859_1") + "\"";
		} else if (browser.equals("Opera")) {
			encodedFilename = "\""
					+ new String(filename.getBytes("UTF-8"), "8859_1") + "\"";
		} else if (browser.equals("Chrome")) {
			StringBuffer sb = new StringBuffer();
			for (int i = 0; i < filename.length(); i++) {
				char c = filename.charAt(i);
				if (c > '~') {
					sb.append(URLEncoder.encode("" + c, "UTF-8"));
				} else {
					sb.append(c);
				}
			}
			encodedFilename = sb.toString();
		}
		return dispositionPrefix + encodedFilename;
	}
		
	@RequestMapping(value = "/efms/EFL_OUTU/list_json.do")
	public View EFL_OUTU_list_json(@RequestParam Map param, 
			@RequestParam Map <String, Object> mocaMap,
			ModelMap model) throws Exception {
		if(!U.preCheck(model)) {return jsonview;}
		
		Map map = U.getBody(mocaMap);
		model.addAttribute("list", mocaEFLService.selectList_EFG_DOWN_H(map));
        return jsonview;
	}	
	
    @RequestMapping(value="/efms/EFC_POPU_EXT/list_ext_json.do")
	public View EFC_POPU_EXT_list_ext_json (@ModelAttribute("loginVO") LoginVO loginVO
			, @ModelAttribute("searchVO") CmmnCodeVO searchVO
			, ModelMap model
			, @RequestParam Map <String, Object> commandMap
			) throws Exception {
		if(!U.preCheck(model)) {return jsonview;}
		
    	try {
    		Map bodyMap = U.getBody(commandMap);
    		model.addAttribute("list", mocaEFLService.selectList_EFC_POPU_EXT(bodyMap));
    	}catch(Exception e) {
    		e.printStackTrace();
    	}
		
        return jsonview;
	};
    
	@RequestMapping(value = "/efms/EFC_POPU/modify_json.do")
	public View EFC_POPU_modify_json(@RequestParam Map param, 
			@RequestParam Map <String, Object> mocaMap,
			ModelMap model) throws Exception {
		if(!U.preCheck(model)) {return jsonview;}
		
    	Map bodyMap = U.getBody(mocaMap);
    	List list = (List)bodyMap.get("paramList");
    	try {
        	//삭제대상을 먼저삭제해야 insert시 문제가 없다.
        	for(int i=0;i < list.size() ;i++) {
        		Map row = (Map)list.get(i);
        		row.put("CORP_CD", bodyMap.get("CORP_CD"));
            	if("D".equalsIgnoreCase(U.getStatus(row)) ) {
            		mocaEFLService.deleteList_EFC_POPU(row);
            		mocaEFLService.deleteList_EFC_POPU_EXT(row);
            	}
        	}
        	for(int i=0;i < list.size() ;i++) {
        		Map row = (Map)list.get(i);
        		row.put("CORP_CD", bodyMap.get("CORP_CD"));
            	if("C".equalsIgnoreCase(U.getStatus(row)) ) {
            		mocaEFLService.insertList_EFC_POPU(row);
            	}else if("U".equalsIgnoreCase(U.getStatus(row)) ) {
        			//업무사용자 수정시 히스토리 정보를 등록한다.
            		mocaEFLService.updateList_EFC_POPU(row);
            	}
        	}
    	}catch(Exception e) {
    		e.printStackTrace();
    	}
        return jsonview;    
	}


	@RequestMapping(value = "/efms/EFC_POPU_EXT/modify_json.do")
	public View EFC_POPU_EXT_modify_json(@RequestParam Map param, 
			@RequestParam Map <String, Object> mocaMap,
			ModelMap model) throws Exception {
		if(!U.preCheck(model)) {return jsonview;}
		
    	Map bodyMap = U.getBody(mocaMap);
    	List list = (List)bodyMap.get("paramList");
    	try {
        	//삭제대상을 먼저삭제해야 insert시 문제가 없다.
        	for(int i=0;i < list.size() ;i++) {
        		Map row = (Map)list.get(i);
        		row.put("CORP_CD", bodyMap.get("CORP_CD"));
        		row.put("SYS_CD", bodyMap.get("SYS_CD"));
        		row.put("POPU_CD", bodyMap.get("POPU_CD"));
            	if("D".equalsIgnoreCase(U.getStatus(row)) ) {
            		mocaEFLService.deleteList_EFC_POPU_EXT(row);
            	}
        	}
        	for(int i=0;i < list.size() ;i++) {
        		Map row = (Map)list.get(i);
        		row.put("CORP_CD", bodyMap.get("CORP_CD"));
        		row.put("SYS_CD", bodyMap.get("SYS_CD"));
        		row.put("POPU_CD", bodyMap.get("POPU_CD"));
            	if("C".equalsIgnoreCase(U.getStatus(row)) ) {
            		mocaEFLService.insertList_EFC_POPU_EXT(row);
            	}else if("U".equalsIgnoreCase(U.getStatus(row)) ) {
        			//업무사용자 수정시 히스토리 정보를 등록한다.
        			mocaEFLService.updateList_EFC_POPU_EXT(row);
            	}
        	}
    	}catch(Exception e) {
    		e.printStackTrace();
    	}
        return jsonview;    
	}	
	@RequestMapping(value = "/efms/EFC_ULOG/insert_json.do")
	public View EFC_POPU_EXT_insert_json(@RequestParam Map param, 
			@RequestParam Map <String, Object> mocaMap,
			ModelMap model) throws Exception {

		
    	Map bodyMap = U.getBody(mocaMap);
    	try {
    		mocaEFLService.insertOne_EFGULOG(bodyMap);
    	}catch(Exception e) {
    		e.printStackTrace();
    	}
        return jsonview;    
	}	
	
	
	
	/**
	 * 시스템설정
	 */ 

	
	@RequestMapping(value = "/efms/EFGPROP/list_json.do")
	public View EFGPROP_list_json(@RequestParam Map param, 
			@RequestParam Map <String, Object> mocaMap,
			ModelMap model) throws Exception {
		
		Map<String, Object> paramMap = U.getBodyNoSess(mocaMap);
		// 서비스 테스트용 구문 추가
		if(MapUtils.isEmpty(paramMap)) {
			paramMap = mocaMap;
		}
		
		//if(!U.preCheck(model)) {return jsonview;}
		
		try {
			Map map = U.getBody(mocaMap);
			model.addAttribute("list", mocaEFLService.selectList_EFGPROP(map));
			
		}catch(Exception e) {
			e.printStackTrace();
		}
        return jsonview;
	}
	@RequestMapping(value = "/efms/EFGPROP/modify_json.do")
	public View EFGPROP_modify_json(@RequestParam Map param, 
			@RequestParam Map <String, Object> mocaMap,
			ModelMap model) throws Exception {
		if(!U.preCheck(model)) {return jsonview;}
		
    	Map bodyMap = U.getBody(mocaMap);
    	List list = (List)bodyMap.get("paramList");
    	try {
        	//삭제대상을 먼저삭제해야 insert시 문제가 없다.
        	for(int i=0;i < list.size() ;i++) {
        		Map row = (Map)list.get(i);
        		//row.put("CORP_CD", bodyMap.get("CORP_CD"));
        		//row.put("SYS_CD", bodyMap.get("SYS_CD"));

            	if("D".equalsIgnoreCase(U.getStatus(row)) ) {
            		mocaEFLService.deleteList_EFGPROP(row);
            	}
        	}
        	for(int i=0;i < list.size() ;i++) {
        		Map row = (Map)list.get(i);
        		//row.put("CORP_CD", bodyMap.get("CORP_CD"));
        		//row.put("SYS_CD", bodyMap.get("SYS_CD"));

            	if("C".equalsIgnoreCase(U.getStatus(row)) ) {
            		mocaEFLService.insertOne_EFGPROP(row);
            	}else if("U".equalsIgnoreCase(U.getStatus(row)) ) {
        			//업무사용자 수정시 히스토리 정보를 등록한다.
        			mocaEFLService.updateList_EFGPROP(row);
            	}
        	}
    	}catch(Exception e) {
    		e.printStackTrace();
    	}
        return jsonview;
	}	
	
	@RequestMapping(value="/efms/Main/list_syst_json.do")
	public View Main_list_syst_json (@ModelAttribute("loginVO") LoginVO loginVO
			, @ModelAttribute("searchVO") CmmnCodeVO searchVO
			, ModelMap model
			, @RequestParam Map <String, Object> commandMap
			) throws Exception {
		if(!U.preCheck(model)) {return jsonview;}
		
    	try {
    		Map bodyMap = U.getBody(commandMap);
    		model.addAttribute("list", mocaEFLService.selectList_MAIN_SYST(bodyMap));
    	}catch(Exception e) {
    		e.printStackTrace();
    	}
		
        return jsonview;
	};
    
    @RequestMapping(value="/efms/Main/list_cnt_json.do")
	public View Main_list_cnt_json (@ModelAttribute("loginVO") LoginVO loginVO
			, @ModelAttribute("searchVO") CmmnCodeVO searchVO
			, ModelMap model
			, @RequestParam Map <String, Object> commandMap
			) throws Exception {
		if(!U.preCheck(model)) {return jsonview;}
    	try {
    		Map bodyMap = U.getBody(commandMap);
    		model.addAttribute("list", mocaEFLService.selectList_MAIN_CNT(bodyMap));
    		model.addAttribute("map", bodyMap);
    	}catch(Exception e) {
    		e.printStackTrace();
    	}
		
        return jsonview;
	};
	@RequestMapping(value = "/efms/EFC_ULOG/list_json.do")
	public View EFC_ULOG_list_json(@RequestParam Map param, 
			@RequestParam Map <String, Object> mocaMap,
			ModelMap model) throws Exception {

		try {
			Map map = U.getBody(mocaMap);
			model.addAttribute("list", mocaEFLService.selectNumList_EFGULOG(map));
			model.addAttribute("selectTotalCnt_EFGULOG", mocaEFLService.selectTotalCnt_EFGULOG(map).get("TOTCNT")); //총건수
		}catch(Exception e) {
			e.printStackTrace();
		}
        return jsonview;
	}
	
	
	@RequestMapping(value = "/efms/ICPRO/exist.do", method = RequestMethod.GET)
	@ResponseBody
	public String ICPRO_exist_jsonp(@RequestParam Map param, 
			@RequestParam Map <String, Object> mocaMap,
			HttpServletResponse response, HttpServletRequest request,
			ModelMap model) throws Exception {
		
		String result = "false";
		String callback = request.getParameter("callback");
		String full_cd = request.getParameter("full_cd");
		try {
			//System.out.println("callback:"+callback);
			//System.out.println("full_cd:"+full_cd);
			String[] arr = full_cd.split("@@");
			Map map = new HashMap();
			if(arr.length == 5) {
				map.put("MP_CD", arr[0]);
				map.put("SP_CD", arr[1]);
				map.put("AC_CD", arr[2]);
				map.put("R_CD", arr[3]);
				map.put("CA_CD", arr[4]);
			}
			Map row = mocaEFLService.selectOne_EFGCA(map);
			if(row == null) {
				model.addAttribute("result", "false");
				result = "false";
			}else {
				model.addAttribute("result", "true");
				result = "true";
			}
			Map reMap = new HashMap();
            ObjectMapper mapper = new ObjectMapper();
            reMap.put("result", result);
            result = mapper.writeValueAsString(reMap);
		}catch(Exception e) {
			e.printStackTrace();
		}
		return callback+"("+result+")";
	}
	

	@RequestMapping(value = "/moca/fileUpload.do")
	public View add(HttpServletRequest request,
			@RequestParam("file") MultipartFile[] files,
			ModelMap model) throws Exception {
		if(!U.preCheck(model)) {return jsonview;}
		try {
			String json = request.getParameter("data");
			Map<String, Object> _map = U.getMap(json);
			Map parentMap = (Map)_map.get("parent");
			Map map = (Map)parentMap.get("data");
			//System.out.println(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
			//System.out.println(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>param:"+map);
			//System.out.println(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
			
			
			
			
			
			MultipartFile uploadFile= files[0];
			Map info = new HashMap();
			info.put("RECEIPT_SERVER_DIR",EgovProperties.getPathProperty("Globals.fileUploadDir"));
			if(map.get("subDir") != null) {
				info.put("subDir",(String)map.get("subDir"));
			}
			String uploadPath = U.fileUpload(request, uploadFile, info,"EXCEL");
			File ff = new File(uploadPath);
			String cp = ff.getCanonicalPath();
			String nm = ff.getName();
			String onm = (String)info.get("originalFilename");

			
			Map resultMap = map;
			resultMap.put("uploadDir", (String)info.get("RECEIPT_SERVER_DIR"));
			resultMap.put("subDir", (String)map.get("subDir"));
			resultMap.put("originalFilename", (String)info.get("originalFilename"));
			resultMap.put("physicalFilename", nm);
			resultMap.put("physicalFilepath", cp);
			resultMap.put("fileLength", ff.length());
			resultMap.put("fileSize", byteCalculation(ff.length()+""));
			model.addAttribute("result", resultMap);
		}catch(Exception e) {
			e.printStackTrace();
		}
	    return jsonview; 
    };	
    
    public String byteCalculation(String bytes) {
        String retFormat = "0";
       Double size = Double.parseDouble(bytes);

        String[] s = { "bytes", "KB", "MB", "GB", "TB", "PB" };
        

        if (bytes != "0") {
              int idx = (int) Math.floor(Math.log(size) / Math.log(1024));
              DecimalFormat df = new DecimalFormat("#,###.##");
              double ret = ((size / Math.pow(1024, Math.floor(idx))));
              retFormat = df.format(ret) + " " + s[idx];
         } else {
              retFormat += " " + s[0];
         }

         return retFormat;
    }

    
    
	//양도증명서 URL만들기
	@RequestMapping(value = "/moca/fileDownload.do")
	public void moca_fileDownload(@RequestParam Map mocaMap, 
			HttpServletRequest request,HttpServletResponse response,
			ModelMap model) throws Exception{
		OutputStream out = null;
		BufferedInputStream fin = null;
		BufferedOutputStream outs = null;
        try {
        	Map paramMap = U.getBodyNoSess(mocaMap); 
        	String originalFilename = (String)paramMap.get("originalFilename");
        	String physicalFilename = (String)paramMap.get("physicalFilename");
        	String subDir = (String)paramMap.get("subDir");
        	String fileUploadDir = EgovProperties.getPathProperty("Globals.fileUploadDir");
    		if(!fileUploadDir.endsWith("/")) {
    			fileUploadDir += "/";
    		}
			
			if(subDir == null || "".equalsIgnoreCase(subDir)) {
			}else {
				fileUploadDir += subDir;
			}
    		if(!fileUploadDir.endsWith("/")) {
    			fileUploadDir += "/";
    		}
    		fileUploadDir += physicalFilename;
    		String fullPath = fileUploadDir;
    		//System.out.println(">>>>>>>>>>>>>file download path>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+fullPath);
			File targetFile = new File(fullPath);
			if(targetFile != null) {
				response.setContentType("application/octet-stream; charset=utf-8");
				response.setContentLength((int) targetFile.length());
				String browser = Util.getBrowser(request);
				String disposition = Util.getDisposition(originalFilename, browser);
				response.setHeader("Content-Disposition", disposition);
				response.setHeader("Content-Transfer-Encoding", "binary");
				byte[] b = new byte[2048]; //buffer size 2K.
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
    
	
	
	
	
	
	
	
	@RequestMapping(value = "/moca/ckEditor/imageUpload.do")
	public View moca_ckEditor_imageUpload_temp(HttpServletRequest request,
			@RequestParam("file") MultipartFile[] files,
			ModelMap model) throws Exception {
		if(!U.preCheck(model)) {return jsonview;}
		try {
			MultipartFile uploadFile= files[0];
			Map info = new HashMap();
			info.put("RECEIPT_SERVER_DIR",EgovProperties.getPathProperty("Globals.fileUploadDir"));
			String uploadPath = U.fileUpload(request, uploadFile, info,"EXCEL");
			File ff = new File(uploadPath);
			String cp = ff.getCanonicalPath();
			String nm = ff.getName();
			String onm = (String)info.get("originalFilename");

			
			Map resultMap = new HashMap();
			resultMap.put("uploadDir", (String)info.get("RECEIPT_SERVER_DIR"));
			resultMap.put("originalFilename", (String)info.get("originalFilename"));
			resultMap.put("physicalFilename", nm);
			resultMap.put("physicalFilepath", cp);
			resultMap.put("fileLength", ff.length());
			resultMap.put("fileSize", byteCalculation(ff.length()+""));
			model.addAttribute("result", resultMap);
		}catch(Exception e) {
			e.printStackTrace();
		}
	    return jsonview; 
    };	
    
    
    
    
    /**
     * 이미지 업로드
     * @param request
     * @param response
     * @param upload
     */
    @RequestMapping(value = "/moca/ckEditor/imageUpload.do", method = RequestMethod.POST)
    public void moca_ckEditor_imageUpload(HttpServletRequest request, HttpServletResponse response, @RequestParam MultipartFile upload) {
     
        OutputStream out = null;
        PrintWriter printWriter = null;
        response.setCharacterEncoding("utf-8");
        response.setContentType("text/html;charset=utf-8");
     
        try{
        	String subDir = EgovProperties.getPathProperty("Globals.ckeditorImgUpload");
        	
        	String rootPath = request.getServletContext().getRealPath("/");
        	String cPath = request.getContextPath();
        	String rurl = request.getRequestURL().toString();
        	int startPosition = rurl.indexOf(cPath);
        	String urlHead = rurl.substring(0,startPosition);
        	//System.out.println("rootPath"+rootPath);
        	
            String fileName = System.currentTimeMillis()+upload.getOriginalFilename();
            byte[] bytes = upload.getBytes();
            String dirPath = rootPath + subDir;
            File dirFile = new File(dirPath);
            if(!dirFile.exists()) {
            	dirFile.mkdirs();
            }
           
            String uploadPath = subDir+fileName;//저장경로
            out = new FileOutputStream(new File(uploadPath));
            out.write(bytes);
            String callback = request.getParameter("CKEditorFuncNum");
     
            printWriter = response.getWriter();
            //System.out.println("url"+urlHead+cPath+subDir+fileName);
            String fileUrl = urlHead+cPath+"/moca/imageDownload.do?fileName="+fileName;//url경로
            printWriter.println("<script type='text/javascript'>window.parent.CKEDITOR.tools.callFunction("
                    + callback
                    + ",'"
                    + fileUrl
                    + "','이미지를 업로드 하였습니다.'"
                    + ")</script>");
            printWriter.flush();
     
        }catch(IOException e){
            e.printStackTrace();
        } finally {
            try {
                if (out != null) {
                    out.close();
                }
                if (printWriter != null) {
                    printWriter.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
     
        return;
    }

    @RequestMapping(value = "/moca/imageDownload.do")
	public void moca_imageDownload(@RequestParam Map mocaMap, 
			HttpServletRequest request,HttpServletResponse response,
			ModelMap model) throws Exception{
		OutputStream out = null;
		BufferedInputStream fin = null;
		BufferedOutputStream outs = null;
        try {
        	Map paramMap = U.getBodyNoSess(mocaMap); 
        	//String originalFilename = (String)paramMap.get("originalFilename");
        	String physicalFilename = (String)request.getParameter("fileName");
        		
        	String subDir = (String)paramMap.get("subDir");
        	String fileUploadDir = EgovProperties.getPathProperty("Globals.ckeditorImgUpload");
    		if(!fileUploadDir.endsWith("/")) {
    			fileUploadDir += "/";
    		}

    		fileUploadDir += physicalFilename;
    		String fullPath = fileUploadDir;
    		//System.out.println(">>>>>>>>>>>>>file download path>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+fullPath);
			File targetFile = new File(fullPath);
			if(targetFile != null) {
				response.setContentType("application/octet-stream; charset=utf-8");
				response.setContentLength((int) targetFile.length());
				String browser = Util.getBrowser(request);
				String disposition = Util.getDisposition(physicalFilename, browser);
				response.setHeader("Content-Disposition", disposition);
				response.setHeader("Content-Transfer-Encoding", "binary");
				byte[] b = new byte[2048]; //buffer size 2K.
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
    
    
}