package egovframework.let.main.web;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import egovframework.com.cmm.LoginVO;
import egovframework.let.cop.bbs.service.BoardVO;
import egovframework.let.cop.bbs.service.EgovBBSManageService;
import egovframework.let.sym.mnu.mcm.service.EgovMenuCreateManageService;
import egovframework.let.sym.mnu.mcm.service.MenuCreatVO;
import egovframework.let.sym.mnu.mpm.service.EgovMenuManageService;
import egovframework.let.sym.mnu.mpm.service.MenuManageVO;
import egovframework.let.uss.umt.service.EgovUserManageService;
import egovframework.let.uss.umt.service.UserDefaultVO;
import egovframework.rte.fdl.security.userdetails.util.EgovUserDetailsHelper;
import egovframework.rte.ptl.mvc.tags.ui.pagination.PaginationInfo;

/**
 * 템플릿 메인 페이지 컨트롤러 클래스(Sample 소스)
 * @author 실행환경 개발팀 JJY
 * @since 2011.08.31
 * @version 1.0
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      수정자           수정내용
 *  -------    --------    ---------------------------
 *   2011.08.31  JJY            최초 생성
 *
 * </pre>
 */
@Controller
public class EgovMainController {

	/**
	 * EgovBBSManageService
	 */
	@Resource(name = "EgovBBSManageService")
    private EgovBBSManageService bbsMngService;

	/** EgovMenuManageService */
	@Resource(name = "meunManageService")
    private EgovMenuManageService menuManageService;
	
	/** userManageService */
	@Resource(name = "userManageService")
	private EgovUserManageService userManageService;

	/** EgovMenuManageService */
	@Resource(name = "meunCreateManageService")
	private EgovMenuCreateManageService menuCreateManageService;
	/**
	 * 메인 페이지에서 각 업무 화면으로 연계하는 기능을 제공한다.
	 *
	 * @param request
	 * @param commandMap
	 * @exception Exception Exception
	 */
	@RequestMapping(value = "/cmm/forwardPage.do")
	public String forwardPageWithMenuNo(HttpServletRequest request, @RequestParam Map<String, Object> commandMap)
	  throws Exception{
		return "";
	}

	/**
	 * 템플릿 메인 페이지 조회
	 * @return 메인페이지 정보 Map [key : 항목명]
	 *
	 * @param request
	 * @param model
	 * @exception Exception Exception
	 */
	@RequestMapping(value = "/cmm/main/mainPage.do")
	public String getMgtMainPage(HttpServletRequest request, ModelMap model)
	  throws Exception{

		// 공지사항 메인 컨텐츠 조회 시작 ---------------------------------
		BoardVO boardVO = new BoardVO();
		boardVO.setPageUnit(10);
		boardVO.setPageSize(10);
		boardVO.setBbsId("BBSMSTR_AAAAAAAAAAAA");

		PaginationInfo paginationInfo = new PaginationInfo();

		paginationInfo.setCurrentPageNo(boardVO.getPageIndex());
		paginationInfo.setRecordCountPerPage(boardVO.getPageUnit());
		paginationInfo.setPageSize(boardVO.getPageSize());

		boardVO.setFirstIndex(paginationInfo.getFirstRecordIndex());
		boardVO.setLastIndex(paginationInfo.getLastRecordIndex());
		boardVO.setRecordCountPerPage(paginationInfo.getRecordCountPerPage());

		Map<String, Object> map = bbsMngService.selectBoardArticles(boardVO, "BBSA02");
		model.addAttribute("notiList", map.get("resultList"));


		// 공지사항 메인컨텐츠 조회 끝 -----------------------------------

		// 업무게시판 메인 컨텐츠 조회 시작 -------------------------------
		boardVO.setPageUnit(5);
		boardVO.setPageSize(10);
		boardVO.setBbsId("BBSMSTR_CCCCCCCCCCCC");

		paginationInfo.setCurrentPageNo(boardVO.getPageIndex());
		paginationInfo.setRecordCountPerPage(boardVO.getPageUnit());
		paginationInfo.setPageSize(boardVO.getPageSize());

		boardVO.setFirstIndex(paginationInfo.getFirstRecordIndex());
		boardVO.setLastIndex(paginationInfo.getLastRecordIndex());
		boardVO.setRecordCountPerPage(paginationInfo.getRecordCountPerPage());

		model.addAttribute("bbsList", bbsMngService.selectBoardArticles(boardVO, "BBSA02").get("resultList"));

		// 업무게시판 메인컨텐츠 조회 끝 -----------------------------------

		return "main/EgovMainView";
	}

	
	/**
	 * 템플릿 메인 페이지 조회
	 * @return 메인페이지 정보 Map [key : 항목명]
	 *
	 * @param request
	 * @param model
	 * @exception Exception Exception
	 */
	@RequestMapping(value = "/cmm/main/mainPageHtml.do")
	public String mainPageHtml(HttpServletRequest request, ModelMap model,
			@ModelAttribute("loginVO") LoginVO loginVO)
	  throws Exception{
		UserDefaultVO userSearchVO = new UserDefaultVO();
		Class cls = EgovUserDetailsHelper.getAuthenticatedUser().getClass();
		String clsName = cls.getName();
		LoginVO vo = (LoginVO)EgovUserDetailsHelper.getAuthenticatedUser();
		userSearchVO.setSearchCondition("0");
		userSearchVO.setSearchKeyword(vo.getId());
		List list = userManageService.selectUserList(userSearchVO);
		if(list != null && list.size() > 0) {
			Map row = (Map)list.get(0);
			//authorCode=ROLE_USER_MEMBER
			String authorCode = (String)row.get("authorCode");
			MenuCreatVO menuCreatVO = new MenuCreatVO();
			menuCreatVO.setAuthorCode(authorCode);
			model.addAttribute("menuList", menuCreateManageService.selectMenuByAuth(menuCreatVO));
			model.addAttribute("authorCode", authorCode);
			
		}
		return "main/EgovMainViewHtml";
	}
	
	@RequestMapping(value = "/cmm/main/StandalonePopup.do")
	public String StandalonePopup(HttpServletRequest request, HttpServletResponse response,ModelMap model)
	  throws Exception{
		
		String mcsrc = request.getParameter("mcsrc");
		request.setAttribute("mcsrc", mcsrc);
		response.setHeader("X-Frame-Options", "ALLOW-FROM http://220.78.29.171:8080");
		return "main/StandalonePopup";
	}
	/**
     * Head메뉴를 조회한다.
     * @param menuManageVO MenuManageVO
     * @return 출력페이지정보 "main_headG", "main_head"
     * @exception Exception
     */
    @RequestMapping(value="/sym/mms/EgovMainMenuHead.do")
    public String selectMainMenuHead(
    		@ModelAttribute("menuManageVO") MenuManageVO menuManageVO,
    		ModelMap model)
            throws Exception {

    	LoginVO user =
    		EgovUserDetailsHelper.isAuthenticated()? (LoginVO)EgovUserDetailsHelper.getAuthenticatedUser():null;

    	if(EgovUserDetailsHelper.isAuthenticated() && user!=null){
    		menuManageVO.setTmp_Id(user.getId());
        	menuManageVO.setTmp_Password(user.getPassword());
        	menuManageVO.setTmp_UserSe(user.getUserSe());
        	menuManageVO.setTmp_Name(user.getName());
        	menuManageVO.setTmp_Email(user.getEmail());
        	menuManageVO.setTmp_OrgnztId(user.getOrgnztId());
        	menuManageVO.setTmp_UniqId(user.getUniqId());
    		model.addAttribute("list_headmenu", menuManageService.selectMainMenuHead(menuManageVO));
    		model.addAttribute("list_menulist", menuManageService.selectMainMenuLeft(menuManageVO));
    	}else{
    		//model.addAttribute("list_headmenu", menuManageService.selectMainMenuHeadAnonymous(menuManageVO));
    		//model.addAttribute("list_menulist", menuManageService.selectMainMenuLeftAnonymous(menuManageVO));
    	}
        return "main/inc/EgovIncTopnav"; // 내부업무의 상단메뉴 화면
    }


    /**
     * 좌측메뉴를 조회한다.
     * @param menuManageVO MenuManageVO
     * @param vStartP      String
     * @return 출력페이지정보 "main_left"
     * @exception Exception
     */
    @RequestMapping(value="/sym/mms/EgovMainMenuLeft.do")
    public String selectMainMenuLeft(
    		ModelMap model)
            throws Exception {

    	//LoginVO user = EgovUserDetailsHelper.isAuthenticated()? (LoginVO)EgovUserDetailsHelper.getAuthenticatedUser():null;
    	//LoginVO user = (LoginVO)EgovUserDetailsHelper.getAuthenticatedUser();
    	if(EgovUserDetailsHelper.isAuthenticated()){
    		//인증된 경우 처리할 사항 추가 ...
    		model.addAttribute("lastLogoutDateTime", "로그아웃 타임: 2011-11-10 11:30");
    		//최근 로그아웃 시간 등에 대한 확보 후 메인 컨텐츠로 활용
    	}

      	return "main/inc/EgovIncLeftmenu";
    }

}