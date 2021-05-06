package mocaframework.com.cmm.web;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.View;
import org.springmodules.validation.commons.DefaultBeanValidator;

import com.fasterxml.jackson.databind.ObjectMapper;

import egovframework.com.cmm.ComDefaultCodeVO;
import egovframework.com.cmm.EgovMessageSource;
import egovframework.com.cmm.service.CmmnDetailCode;
import egovframework.com.cmm.service.EgovCmmUseService;
import egovframework.let.sec.ram.service.AuthorManageVO;
import egovframework.let.sec.ram.service.EgovAuthorManageService;
import egovframework.let.uss.umt.service.EgovUserManageService;
import egovframework.let.uss.umt.service.UserDefaultVO;
import egovframework.rte.fdl.property.EgovPropertyService;
import egovframework.rte.fdl.security.userdetails.util.EgovUserDetailsHelper;
import egovframework.rte.ptl.mvc.tags.ui.pagination.PaginationInfo;
import mocaframework.com.cmm.U;

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
public class EfmsEFCController {
	
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
	
	@Autowired
    private View jsonview;
	
	

	private final String API_URL = "https://fcm.googleapis.com/v1/projects/tourcash-13092/messages;send";
	@RequestMapping(value = "/uss/umt/user/fcmTest.do")
    public void fcmTest() throws Exception {
		/*List<MobileTokenVO> tokenList = fcmService.loadFCMInfoList(vo); 
        
        String token = tokenList.get(count).getDEVICE_ID();*/
        
        final String apiKey = "AAAAz50CDe0:APA91bENoi9dCR4bRDnWcp39o_oi56SSu86rQKIacR2BgB9ntqybaDpcwuhLYcJlkDBA8BZdMah5bV7WB3wiLQQOUD2eNMWrFOPYGAnLVHLLISOfc0dIGxizfUWQwYeOMAe7CLXiZE8B";//"파이어 베이스의 서버 API키를 여기에 넣는다";
        URL url = new URL("https://fcm.googleapis.com/fcm/send");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setDoOutput(true);
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setRequestProperty("Authorization", "key=" + apiKey);

        conn.setDoOutput(true);
        
        //String userId =(String) request.getSession().getAttribute("ssUserId");

        // 이렇게 보내면 주제를 ALL로 지정해놓은 모든 사람들한테 알림을 날려준다.
        String input = "{\"notification\" : {\"title\" : \"여기다 제목 넣기 \", \"body\" : \"여기다 내용 넣기\"}, \"to\":\"/topics/ALL\"}";
        
        // 이걸로 보내면 특정 토큰을 가지고있는 어플에만 알림을 날려준다  위에 둘중에 한개 골라서 날려주자
        //String input = "{\"notification\" : {\"title\" : \" 여기다 제목넣기 \", \"body\" : \"여기다 내용 넣기\"}, \"to\":\" 여기가 받을 사람 토큰  \"}";

        OutputStream os = conn.getOutputStream();
        
        // 서버에서 날려서 한글 깨지는 사람은 아래처럼  UTF-8로 인코딩해서 날려주자
        os.write(input.getBytes("UTF-8"));
        os.flush();
        os.close();

        int responseCode = conn.getResponseCode();
        System.out.println("\nSending 'POST' request to URL : " + url);
        System.out.println("Post parameters : " + input);
        System.out.println("Response Code : " + responseCode);
        
        BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        String inputLine;
        StringBuffer response = new StringBuffer();

        while ((inputLine = in.readLine()) != null) {
            response.append(inputLine);
        }
        in.close();
        // print result
        System.out.println(response.toString());



    }
	
	
	public static void main(String[] args) throws Exception{
        final String apiKey = "AAAAz50CDe0:APA91bENoi9dCR4bRDnWcp39o_oi56SSu86rQKIacR2BgB9ntqybaDpcwuhLYcJlkDBA8BZdMah5bV7WB3wiLQQOUD2eNMWrFOPYGAnLVHLLISOfc0dIGxizfUWQwYeOMAe7CLXiZE8B";//"파이어 베이스의 서버 API키를 여기에 넣는다";
        URL url = new URL("https://fcm.googleapis.com/fcm/send");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setDoOutput(true);
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setRequestProperty("Authorization", "key=" + apiKey);

        conn.setDoOutput(true);
        
        //String userId =(String) request.getSession().getAttribute("ssUserId");

        // 이렇게 보내면 주제를 ALL로 지정해놓은 모든 사람들한테 알림을 날려준다.
        String input = "{\"notification\" : {\"title\" : \"여기다 제목 넣기 \", \"body\" : \"여기다 내용 넣기\"}, \"to\":\"/topics/ALL\"}";
        
        // 이걸로 보내면 특정 토큰을 가지고있는 어플에만 알림을 날려준다  위에 둘중에 한개 골라서 날려주자
        //String input = "{\"notification\" : {\"title\" : \" 여기다 제목넣기 \", \"body\" : \"여기다 내용 넣기\"}, \"to\":\" 여기가 받을 사람 토큰  \"}";

        OutputStream os = conn.getOutputStream();
        
        // 서버에서 날려서 한글 깨지는 사람은 아래처럼  UTF-8로 인코딩해서 날려주자
        os.write(input.getBytes("UTF-8"));
        os.flush();
        os.close();

        int responseCode = conn.getResponseCode();
        System.out.println("\nSending 'POST' request to URL : " + url);
        System.out.println("Post parameters : " + input);
        System.out.println("Response Code : " + responseCode);
        
        BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        String inputLine;
        StringBuffer response = new StringBuffer();

        while ((inputLine = in.readLine()) != null) {
            response.append(inputLine);
        }
        in.close();
        // print result
        System.out.println(response.toString());
		
		
		
	}
	@RequestMapping(value = "/uss/umt/user/EgovUserManage2_json.do")
	public View selectUserList2(@RequestParam Map mocaMap, 
			@ModelAttribute("authorManageVO") AuthorManageVO authorManageVO,
			ModelMap model) {
		try {
			Map map = U.getBodyNoSess(mocaMap);
			String userId = (String)map.get("userId");
			String userNm = (String)map.get("userNm"); 
	        
	        
	        final String apiKey = "AAAAz50CDe0:APA91bENoi9dCR4bRDnWcp39o_oi56SSu86rQKIacR2BgB9ntqybaDpcwuhLYcJlkDBA8BZdMah5bV7WB3wiLQQOUD2eNMWrFOPYGAnLVHLLISOfc0dIGxizfUWQwYeOMAe7CLXiZE8B";//"파이어 베이스의 서버 API키를 여기에 넣는다";
	        URL url = new URL("https://fcm.googleapis.com/fcm/send");
	        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
	        conn.setDoOutput(true);
	        conn.setRequestMethod("POST");
	        conn.setRequestProperty("Content-Type", "application/json");
	        conn.setRequestProperty("Authorization", "key=" + apiKey);

	        conn.setDoOutput(true);
	        
	        //String userId =(String) request.getSession().getAttribute("ssUserId");

	        // 이렇게 보내면 주제를 ALL로 지정해놓은 모든 사람들한테 알림을 날려준다.
	        String input = "{\"notification\" : {\"title\" : \"여기다 제목 넣기 \", \"body\" : \"여기다 내용 넣기\"}, \"to\":\"/topics/ALL\"}";
	        
	        // 이걸로 보내면 특정 토큰을 가지고있는 어플에만 알림을 날려준다  위에 둘중에 한개 골라서 날려주자
	        //String input = "{\"notification\" : {\"title\" : \" 여기다 제목넣기 \", \"body\" : \"여기다 내용 넣기\"}, \"to\":\" 여기가 받을 사람 토큰  \"}";

	        OutputStream os = conn.getOutputStream();
	        
	        // 서버에서 날려서 한글 깨지는 사람은 아래처럼  UTF-8로 인코딩해서 날려주자
	        os.write(input.getBytes("UTF-8"));
	        os.flush();
	        os.close();

	        int responseCode = conn.getResponseCode();
	        System.out.println("\nSending 'POST' request to URL : " + url);
	        System.out.println("Post parameters : " + input);
	        System.out.println("Response Code : " + responseCode);
	        
	        BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
	        String inputLine;
	        StringBuffer response = new StringBuffer();

	        while ((inputLine = in.readLine()) != null) {
	            response.append(inputLine);
	        }
	        in.close();
	        // print result
	        System.out.println(response.toString());
			
		}catch(Exception e) {
			e.printStackTrace();
		}

        return jsonview;
	}	
	
	
	/**
	 * 사용자목록을 조회한다. (pageing)
	 * @param userSearchVO 검색조건정보
	 * @param model 화면모델
	 * @return cmm/uss/umt/EgovUserManage
	 * @throws Exception
	 */
	@RequestMapping(value = "/uss/umt/user/EgovUserManage_json.do")
	public View selectUserList(@RequestParam Map mocaMap, 
			@ModelAttribute("authorManageVO") AuthorManageVO authorManageVO,
			ModelMap model) throws Exception {
		Map map = U.getBody(mocaMap);
		String userId = (String)map.get("userId");
		String userNm = (String)map.get("userNm");
		
		
		// 미인증 사용자에 대한 보안처리
/*		Boolean isAuthenticated = EgovUserDetailsHelper.isAuthenticated();
    	if(!isAuthenticated) {
    		model.addAttribute("message", egovMessageSource.getMessage("fail.common.login"));
        	return null;
    	}*/
    	UserDefaultVO userSearchVO = new UserDefaultVO();
    	userSearchVO.setUserId(userId);
    	userSearchVO.setUserNm(userNm);
		model.addAttribute("list", userManageService.selectUserList(userSearchVO));
		
		
    	authorManageVO.setAuthorManageList(egovAuthorManageService.selectAuthorAllList(authorManageVO));
        model.addAttribute("authorManageList", authorManageVO.getAuthorManageList());
        
        return jsonview;
	}	
	
	@RequestMapping(value = "/uss/umt/user/selectGroupIdDetail.do")
	public View selectGroupIdDetail(@RequestParam Map param, ModelMap model) throws Exception {
		ComDefaultCodeVO vo = new ComDefaultCodeVO();
		vo.setTableNm("LETTNORGNZTINFO");
		model.addAttribute("list", cmmUseService.selectGroupIdDetail(vo));
        return jsonview;
	}	
	
	@RequestMapping(value = "/uss/umt/user/selectOgrnztIdDetail.do")
	public View selectOgrnztIdDetail(@RequestParam Map param, ModelMap model) throws Exception {
		ComDefaultCodeVO vo = new ComDefaultCodeVO();
		//조직정보를 조회 - ORGNZT_ID정보
		vo.setTableNm("LETTNORGNZTINFO");
		model.addAttribute("list", cmmUseService.selectOgrnztIdDetail(vo));
        return jsonview;
	}	
	
	
	
	
	@RequestMapping(value = "/code_json.do")	
	public View getCode(@RequestParam Map param, ModelMap map) {
		Map resultMap = new HashMap();
		try {
			ObjectMapper mapper = new ObjectMapper(); 

			Map<String, Object> bodyObj = new HashMap<String, Object>(); 
			bodyObj = mapper.readValue(param.get("body").toString(), HashMap.class); 
			Map configMap = (Map)bodyObj.get("config");//:{grd_1.age={code=age, allOption={label=-선택-, value=}}, grd_1.nation={code=nation, allOption={label=*, value=}}, cmb_1={code=nation, allOption={label=전체, value=}}}
			Set st = configMap.keySet();
			Iterator it = st.iterator();
			while(it.hasNext()) {
				Object key = it.next();
				Map value = (Map)configMap.get(key);
				String code = (String)value.get("code");
				List codeList = getCode(code);
				resultMap.put(key, codeList);
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
        map.addAttribute("map", resultMap);
        return jsonview;
	}
	
	/**
	 * 공통코드
	 */
	public List<CmmnDetailCode> getCode(String code) throws Exception{
		List list = new ArrayList();
		//사용자상태코드를 코드정보로부터 조회
		ComDefaultCodeVO vo = new ComDefaultCodeVO();
		vo.setCodeId(code);
		return cmmUseService.selectCmmCodeDetailAdmin(vo);
	}

	
	
/*	public String selectUserList(@ModelAttribute("userSearchVO") UserDefaultVO userSearchVO, ModelMap model) throws Exception {

		// 미인증 사용자에 대한 보안처리
		Boolean isAuthenticated = EgovUserDetailsHelper.isAuthenticated();
    	if(!isAuthenticated) {
    		model.addAttribute("message", egovMessageSource.getMessage("fail.common.login"));
        	return "uat/uia/EgovLoginUsr";
    	}

		*//** EgovPropertyService *//*
		userSearchVO.setPageUnit(propertiesService.getInt("pageUnit"));
		userSearchVO.setPageSize(propertiesService.getInt("pageSize"));

		*//** pageing *//*
		PaginationInfo paginationInfo = new PaginationInfo();
		paginationInfo.setCurrentPageNo(userSearchVO.getPageIndex());
		paginationInfo.setRecordCountPerPage(userSearchVO.getPageUnit());
		paginationInfo.setPageSize(userSearchVO.getPageSize());

		userSearchVO.setFirstIndex(paginationInfo.getFirstRecordIndex());
		userSearchVO.setLastIndex(paginationInfo.getLastRecordIndex());
		userSearchVO.setRecordCountPerPage(paginationInfo.getRecordCountPerPage());

		model.addAttribute("resultList", userManageService.selectUserList(userSearchVO));

		int totCnt = userManageService.selectUserListTotCnt(userSearchVO);
		paginationInfo.setTotalRecordCount(totCnt);
		model.addAttribute("paginationInfo", paginationInfo);

		//사용자상태코드를 코드정보로부터 조회
		ComDefaultCodeVO vo = new ComDefaultCodeVO();
		vo.setCodeId("COM013");
		model.addAttribute("emplyrSttusCode_result", cmmUseService.selectCmmCodeDetail(vo));//사용자상태코드목록

		return "cmm/uss/umt/EgovUserManage";
	}
	
	*/

}