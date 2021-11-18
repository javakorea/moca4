package egovframework.let.uat.uia.web;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import javax.servlet.http.HttpServletResponse;

import org.springframework.context.ApplicationContext;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.context.support.WebApplicationContextUtils;

import egovframework.com.cmm.EgovMessageSource;
import egovframework.com.cmm.LoginVO;
import egovframework.let.uat.uap.service.EgovLoginPolicyService;
import egovframework.let.uat.uap.service.LoginPolicyVO;
import egovframework.let.uat.uia.service.EgovLoginService;
import egovframework.let.utl.sim.service.EgovClntInfo;
import egovframework.rte.fdl.cmmn.trace.LeaveaTrace;
import egovframework.rte.fdl.property.EgovPropertyService;
import egovframework.rte.fdl.security.userdetails.util.EgovUserDetailsHelper;
import mocaframework.com.cmm.service.MocaEFLService;


/**
 * 일반 로그인, 인증서 로그인을 처리하는 컨트롤러 클래스
 * @author 공통서비스 개발팀 박지욱
 * @since 2009.03.06
 * @version 1.0
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      수정자          수정내용
 *  -------    --------    ---------------------------
 *  2009.03.06  박지욱          최초 생성
 *  2011.08.31  JJY            경량환경 템플릿 커스터마이징버전 생성
 *
 *  </pre>
 */
@Controller
public class EgovLoginController {
	@Resource(name = "mocaEFLService")
	private MocaEFLService mocaEFLService;
	
	/** EgovLoginService */
	@Resource(name = "loginService")
	private EgovLoginService loginService;

	/** EgovMessageSource */
	@Resource(name = "egovMessageSource")
	EgovMessageSource egovMessageSource;

	/** EgovLoginPolicyService */
	@Resource(name = "egovLoginPolicyService")
	EgovLoginPolicyService egovLoginPolicyService;

	/** EgovPropertyService */
	@Resource(name = "propertiesService")
	protected EgovPropertyService propertiesService;

	/** TRACE */
	@Resource(name = "leaveaTrace")
	LeaveaTrace leaveaTrace;

	/**
	 * 로그인 화면으로 들어간다
	 * @param vo - 로그인후 이동할 URL이 담긴 LoginVO
	 * @return 로그인 페이지
	 * @exception Exception
	 */
	@RequestMapping(value = "/uat/uia/egovLoginUsr.do")
	public String loginUsrView(@ModelAttribute("loginVO") LoginVO loginVO, HttpServletRequest request, HttpServletResponse response, ModelMap model) throws Exception {
		return "uat/uia/EgovLoginUsr";
	}

	/**
	 * 일반(스프링 시큐리티) 로그인을 처리한다
	 * @param vo - 아이디, 비밀번호가 담긴 LoginVO
	 * @param request - 세션처리를 위한 HttpServletRequest
	 * @return result - 로그인결과(세션정보)
	 * @exception Exception
	 */
	@RequestMapping(value = "/uat/uia/actionSecurityLogin.do")
	public String actionSecurityLogin(@ModelAttribute("loginVO") LoginVO loginVO, HttpServletResponse response, HttpServletRequest request, ModelMap model) throws Exception {
		// 접속IP
		String userIp = EgovClntInfo.getClntIP(request);
		//ajax처리
		if(loginVO.getUserSe() == null) {
			model.addAttribute("message", egovMessageSource.getMessage("fail.common.login"));
			return "uat/uia/EgovLoginUsr_redirect";
		}
		
		String CORP_CD = request.getParameter("CORP_CD");

		// 1. 일반 로그인 처리
		loginVO.setCORP_CD(CORP_CD);
		LoginVO resultVO = loginService.actionLogin(loginVO);
		resultVO.setCORP_CD(CORP_CD);
		boolean loginPolicyYn = true;

		LoginPolicyVO loginPolicyVO = new LoginPolicyVO();
		loginPolicyVO.setEmplyrId(resultVO.getId());
		loginPolicyVO = egovLoginPolicyService.selectLoginPolicy(loginPolicyVO);

		if (loginPolicyVO == null) {
			loginPolicyYn = true;
		} else {
			if (loginPolicyVO.getLmttAt().equals("Y")) {
				if (!userIp.equals(loginPolicyVO.getIpInfo())) {
					loginPolicyYn = false;
				}
			}
		}
		System.out.println("loginVO:"+loginVO);
		System.out.println("====================================================================");
		System.out.println("loginPolicyYn:"+loginPolicyYn);
		
		String corpCd = resultVO.getCORP_CD();
		System.out.println("===CORP_CD:"+CORP_CD);
		
		
		String endDate = resultVO.getEndDate();
		System.out.println("===endDate:"+endDate);
		if(endDate != null && endDate.length() > 9) {
			endDate = endDate.substring(0,10);
			endDate = endDate.replaceAll("-", "");
		}else {
			endDate = "99999999";
		}
		
		
		SimpleDateFormat format1 = new SimpleDateFormat ("yyyyMMdd");
		Date time = new Date();
		String today = format1.format(time);
		System.out.println(today+"===================================================================="+endDate);
		if(Integer.parseInt(today) > Integer.parseInt(endDate)) {
			model.addAttribute("message", "사용만기일이 지나 접속할수 없습니다. 관리자에게 문의 바랍니다.");
			return "uat/uia/EgovLoginUsr";
		}

		
    	System.out.println("===============getEndDate:"+loginVO.getEndDate());
    	//2020-07-21 13:49:22.0
    	
    	
		if (resultVO != null && resultVO.getId() != null && !resultVO.getId().equals("") && loginPolicyYn) {

			// 2. spring security 연동
			request.getSession().setAttribute("LoginVO", resultVO);
		        Map bodyMap = new HashMap();
				bodyMap.put("CORP_CD",resultVO.getCORP_CD());
				bodyMap.put("USER_ID",resultVO.getId());
				bodyMap.put("MENU_NM","로그인");
				bodyMap.put("MENU_NO","");
				bodyMap.put("URL","/uat/uia/actionMain.do");
				bodyMap.put("SRCID","/WEB-INF/jsp/uat/uia/EgovLoginUsr.jsp");
				bodyMap.put("LABEL","로그인:/egovframework/let/uat/uia/web/EgovLoginController.java");
		    	mocaEFLService.insertOne_EFGULOG(bodyMap);

			
	    	

			UsernamePasswordAuthenticationFilter springSecurity = null;

			ApplicationContext act = WebApplicationContextUtils.getRequiredWebApplicationContext(request.getSession().getServletContext());
						
			Map<String, UsernamePasswordAuthenticationFilter> beans = act.getBeansOfType(UsernamePasswordAuthenticationFilter.class);
			if (beans.size() > 0) {
				
				springSecurity = (UsernamePasswordAuthenticationFilter) beans.values().toArray()[0];
				springSecurity.setUsernameParameter("egov_security_username");
				springSecurity.setPasswordParameter("egov_security_password");
				springSecurity.setRequiresAuthenticationRequestMatcher(new AntPathRequestMatcher(request.getServletContext().getContextPath() +"/egov_security_login", "POST"));
			} else {
				throw new IllegalStateException("No AuthenticationProcessingFilter");
			}
			springSecurity.doFilter(new RequestWrapperForSecurity(request, resultVO.getUserSe()+ resultVO.getId(), resultVO.getUniqId()), response, null);
			return "forward:/uat/uia/actionMain.do"; // 성공 시 페이지.. (redirect 불가)

		} else {
			model.addAttribute("message", egovMessageSource.getMessage("fail.common.login"));
			return "uat/uia/EgovLoginUsr";
		}
	}

	
	/**
	 * 로그인 후 메인화면으로 들어간다
	 * @param
	 * @return 로그인 페이지
	 * @exception Exception
	 */
	@RequestMapping(value = "/uat/uia/actionMain.do")
	public String actionMain(HttpServletResponse response, HttpServletRequest request, ModelMap model) throws Exception {
		String mcsrc = request.getParameter("mcsrc");
		// 1. Spring Security 사용자권한 처리
		Boolean isAuthenticated = EgovUserDetailsHelper.isAuthenticated();
		if (!isAuthenticated) {
			//model.addAttribute("message", egovMessageSource.getMessage("fail.common.login"));
			return "uat/uia/EgovLoginUsr";
		}

		// 2. 메인 페이지 이동
		if(mcsrc != null) {
			return "forward:/cmm/main/StandalonePopup.do?mcsrc="+mcsrc;
		}else {
			return "forward:/cmm/main/mainPageHtml.do?mcsrc="+mcsrc;
		}
	}
	@RequestMapping(value = "/admin.do")
	public String admin(HttpServletResponse response, HttpServletRequest request, ModelMap model) throws Exception {
		String mcsrc = request.getParameter("mcsrc");
		// 1. Spring Security 사용자권한 처리
		Boolean isAuthenticated = EgovUserDetailsHelper.isAuthenticated();
		if (!isAuthenticated) {
			//model.addAttribute("message", egovMessageSource.getMessage("fail.common.login"));
			return "/uat/uia/EgovLoginUsr";
		}

		// 2. 메인 페이지 이동
		if(mcsrc != null) {
			return "forward:/cmm/main/StandalonePopup.do?mcsrc="+mcsrc;
		}else {
			return "forward:/cmm/main/mainPageHtml.do?mcsrc="+mcsrc;
		}
	}
	@RequestMapping(value = "/uat/uia/actionMain_link.do")
	public String actionMain_link(HttpServletResponse response, HttpServletRequest request, ModelMap model) throws Exception {
		String mcsrc = request.getParameter("mcsrc");
		String user_id = request.getParameter("user_id");
		/*
		String user_password = request.getParameter("user_password");
		response.setHeader("X-Frame-Options", "ALLOW-FROM http://220.78.29.171:8080");
		//if("admin".equalsIgnoreCase(user_id) && "JfQ7FIatlaE5jj7rPYO8QBABX8yb7bNbQy4AKY1QIfc=".equals(user_password) ) {
		if("JfQ7FIatlaE5jj7rPYO8QBABX8yb7bNbQy4AKY1QIfc=".equals(user_password) ) {
			return "forward:/cmm/main/StandalonePopup.do?mcsrc="+mcsrc;
		}else {
			return null;
		}*/
		
		return "forward:/cmm/main/StandalonePopup.do?mcsrc="+mcsrc;
	}
	
	/**
	 * 로그아웃한다.
	 * @return String
	 * @exception Exception
	 */
	@RequestMapping(value = "/uat/uia/actionLogout.do")
	public String actionLogout(HttpServletRequest request, ModelMap model) throws Exception {
		request.getSession().setAttribute("LoginVO", null);
		request.getSession().invalidate();
		//return "redirect:/egov_security_logout";
		return "redirect:/uat/uia/actionMain.do";
	}
}

class RequestWrapperForSecurity extends HttpServletRequestWrapper {
	private String username = null;
	private String password = null;

	public RequestWrapperForSecurity(HttpServletRequest request, String username, String password) {
		super(request);

		this.username = username;
		this.password = password;
	}
	
	@Override
	public String getServletPath() {		
		return ((HttpServletRequest) super.getRequest()).getContextPath() + "/egov_security_login";
	}

	@Override
	public String getRequestURI() {		
		return ((HttpServletRequest) super.getRequest()).getContextPath() + "/egov_security_login";
	}

	@Override
	public String getParameter(String name) {
		if (name.equals("egov_security_username")) {
			return username;
		}

		if (name.equals("egov_security_password")) {
			return password;
		}

		return super.getParameter(name);
	}
}