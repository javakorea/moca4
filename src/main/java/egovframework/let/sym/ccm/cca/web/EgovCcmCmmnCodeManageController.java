package egovframework.let.sym.ccm.cca.web;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.View;
import org.springmodules.validation.commons.DefaultBeanValidator;

import egovframework.com.cmm.LoginVO;
import egovframework.com.cmm.service.CmmnDetailCode;
import egovframework.let.sym.ccm.cca.service.CmmnCode;
import egovframework.let.sym.ccm.cca.service.CmmnCodeVO;
import egovframework.let.sym.ccm.cca.service.EgovCcmCmmnCodeManageService;
import egovframework.let.sym.ccm.ccc.service.CmmnClCodeVO;
import egovframework.let.sym.ccm.ccc.service.EgovCcmCmmnClCodeManageService;
import egovframework.let.sym.ccm.cde.service.EgovCcmCmmnDetailCodeManageService;
import egovframework.rte.fdl.property.EgovPropertyService;
import egovframework.rte.ptl.mvc.tags.ui.pagination.PaginationInfo;
import mocaframework.com.cmm.U;

/**
 *
 * 공통코드에 관한 요청을 받아 서비스 클래스로 요청을 전달하고 서비스클래스에서 처리한 결과를 웹 화면으로 전달을 위한 Controller를 정의한다
 * @author 공통서비스 개발팀 이중호
 * @since 2009.04.01
 * @version 1.0
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      수정자           수정내용
 *  -------    --------    ---------------------------
 *   2009.04.01  이중호          최초 생성
 *   2011.08.31  JJY            경량환경 템플릿 커스터마이징버전 생성
 *
 * </pre>
 */
@Controller
public class EgovCcmCmmnCodeManageController {
	@Resource(name = "CmmnDetailCodeManageService")
    private EgovCcmCmmnDetailCodeManageService cmmnDetailCodeManageService;
	
	@Resource(name = "CmmnCodeManageService")
    private EgovCcmCmmnCodeManageService cmmnCodeManageService;

	@Resource(name = "CmmnClCodeManageService")
    private EgovCcmCmmnClCodeManageService cmmnClCodeManageService;

    /** EgovPropertyService */
    @Resource(name = "propertiesService")
    protected EgovPropertyService propertiesService;

	@Autowired
	private DefaultBeanValidator beanValidator;

	@Autowired
    private View jsonview;	
	/**
	 * 공통코드를 삭제한다.
	 * @param loginVO
	 * @param cmmnCode
	 * @param model
	 * @return "forward:/sym/ccm/cca/EgovCcmCmmnCodeList.do"
	 * @throws Exception
	 */
    @RequestMapping(value="/sym/ccm/cca/EgovCcmCmmnCodeRemove.do")
	public String deleteCmmnCode (@ModelAttribute("loginVO") LoginVO loginVO
			, CmmnCode cmmnCode
			, ModelMap model
			) throws Exception {
    	cmmnCodeManageService.deleteCmmnCode(cmmnCode);
        return "forward:/sym/ccm/cca/EgovCcmCmmnCodeList.do";
	}

	/**
	 * 공통코드를 등록한다.
	 * @param loginVO
	 * @param cmmnCode
	 * @param bindingResult
	 * @param model
	 * @return "/cmm/sym/ccm/EgovCcmCmmnCodeRegist"
	 * @throws Exception
	 */
    @RequestMapping(value="/sym/ccm/cca/EgovCcmCmmnCodeRegist.do")
	public String insertCmmnCode (@ModelAttribute("loginVO") LoginVO loginVO
			, @ModelAttribute("cmmnCode") CmmnCode cmmnCode
			, BindingResult bindingResult
			, ModelMap model
			) throws Exception {
    	if   (cmmnCode.getClCode() == null
    		||cmmnCode.getClCode().equals("")) {

    		CmmnClCodeVO searchVO;
    		searchVO = new CmmnClCodeVO();
    		searchVO.setRecordCountPerPage(999999);
    		searchVO.setFirstIndex(0);
    		searchVO.setSearchCondition("CodeList");
            model.addAttribute("cmmnClCode", cmmnClCodeManageService.selectCmmnClCodeList(searchVO));

    		return "/cmm/sym/ccm/EgovCcmCmmnCodeRegist";
    	}

        beanValidator.validate(cmmnCode, bindingResult);
		if (bindingResult.hasErrors()){
    		CmmnClCodeVO searchVO;
    		searchVO = new CmmnClCodeVO();
    		searchVO.setRecordCountPerPage(999999);
    		searchVO.setFirstIndex(0);
    		searchVO.setSearchCondition("CodeList");
            model.addAttribute("cmmnClCode", cmmnClCodeManageService.selectCmmnClCodeList(searchVO));

            return "/cmm/sym/ccm/EgovCcmCmmnCodeRegist";
		}

    	cmmnCode.setFrstRegisterId(loginVO.getUniqId());
    	cmmnCodeManageService.insertCmmnCode(cmmnCode);
        return "forward:/sym/ccm/cca/EgovCcmCmmnCodeList.do";
    }

	/**
	 * 공통코드 상세항목을 조회한다.
	 * @param loginVO
	 * @param cmmnCode
	 * @param model
	 * @return "cmm/sym/ccm/EgovCcmCmmnCodeDetail"
	 * @throws Exception
	 */
	@RequestMapping(value="/sym/ccm/cca/EgovCcmCmmnCodeDetail.do")
 	public String selectCmmnCodeDetail (@ModelAttribute("loginVO") LoginVO loginVO
 			, CmmnCode cmmnCode
 			, ModelMap model
 			) throws Exception {
		CmmnCode vo =cmmnCodeManageService.selectCmmnCodeDetail(cmmnCode);
		model.addAttribute("result", vo);

		return "cmm/sym/ccm/EgovCcmCmmnCodeDetail";
	}

    /**
	 * 공통코드 목록을 조회한다.
     * @param loginVO
     * @param searchVO
     * @param model
     * @return "/cmm/sym/ccm/EgovCcmCmmnCodeList"
     * @throws Exception
     */
    @RequestMapping(value="/sym/ccm/cca/EgovCcmCmmnCodeList.do")
	public String selectCmmnCodeList (@ModelAttribute("loginVO") LoginVO loginVO
			, @ModelAttribute("searchVO") CmmnCodeVO searchVO
			, ModelMap model
			) throws Exception {
    	/** EgovPropertyService.sample */
    	searchVO.setPageUnit(propertiesService.getInt("pageUnit"));
    	searchVO.setPageSize(propertiesService.getInt("pageSize"));

    	/** pageing */
    	PaginationInfo paginationInfo = new PaginationInfo();
		paginationInfo.setCurrentPageNo(searchVO.getPageIndex());
		paginationInfo.setRecordCountPerPage(searchVO.getPageUnit());
		paginationInfo.setPageSize(searchVO.getPageSize());

		searchVO.setFirstIndex(paginationInfo.getFirstRecordIndex());
		searchVO.setLastIndex(paginationInfo.getLastRecordIndex());
		searchVO.setRecordCountPerPage(paginationInfo.getRecordCountPerPage());

        model.addAttribute("resultList", cmmnCodeManageService.selectCmmnCodeList(searchVO));

        int totCnt =cmmnCodeManageService.selectCmmnCodeListTotCnt(searchVO);
		paginationInfo.setTotalRecordCount(totCnt);
        model.addAttribute("paginationInfo", paginationInfo);

        return "/cmm/sym/ccm/EgovCcmCmmnCodeList";
	}


    
    
	/**
	 * 공통코드를 수정한다.
	 * @param loginVO
	 * @param cmmnCode
	 * @param bindingResult
	 * @param commandMap
	 * @param model
	 * @return "/cmm/sym/ccm/EgovCcmCmmnCodeModify"
	 * @throws Exception
	 */
    @RequestMapping(value="/sym/ccm/cca/EgovCcmCmmnCodeModify.do")
	public String updateCmmnCode (@ModelAttribute("loginVO") LoginVO loginVO
			, @ModelAttribute("cmmnCode") CmmnCode cmmnCode
			, BindingResult bindingResult
			, @RequestParam Map <String, Object> commandMap
			, ModelMap model
			) throws Exception {
		String sCmd = commandMap.get("cmd") == null ? "" : (String)commandMap.get("cmd");
    	if (sCmd.equals("")) {
    		CmmnCode vo =cmmnCodeManageService.selectCmmnCodeDetail(cmmnCode);
    		model.addAttribute("cmmnCode", vo);

    		return "/cmm/sym/ccm/EgovCcmCmmnCodeModify";
    	} else if (sCmd.equals("Modify")) {
            beanValidator.validate(cmmnCode, bindingResult);
    		if (bindingResult.hasErrors()){
        		CmmnCode vo =cmmnCodeManageService.selectCmmnCodeDetail(cmmnCode);
        		model.addAttribute("cmmnCode", vo);

        		return "/cmm/sym/ccm/EgovCcmCmmnCodeModify";
    		}

    		cmmnCode.setLastUpdusrId(loginVO.getUniqId());
	    	cmmnCodeManageService.updateCmmnCode(cmmnCode);
	        return "forward:/sym/ccm/cca/EgovCcmCmmnCodeList.do";
    	} else {
    		return "forward:/sym/ccm/cca/EgovCcmCmmnCodeList.do";
    	}
    }
    
    
    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // JSON /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    @RequestMapping(value="/sym/ccm/cca/EgovCcmCmmnCodeList_json.do")
	public View EgovCcmCmmnCodeList_json (@ModelAttribute("loginVO") LoginVO loginVO
			, @ModelAttribute("searchVO") CmmnCodeVO searchVO
			, ModelMap model
			, @RequestParam Map <String, Object> commandMap
			) throws Exception {
    	Map bodyMap = U.getBody(commandMap);
    	
    	String searchKeyword = (String)bodyMap.get("searchKeyword");
    	searchVO.setSearchKeyword(searchKeyword);
    	searchVO.setSearchCondition("2");
    	
    	
/*		PaginationInfo paginationInfo = new PaginationInfo();
		paginationInfo.setCurrentPageNo(1);
		paginationInfo.setRecordCountPerPage(20);
		paginationInfo.setPageSize(10);
		searchVO.setFirstIndex(0);
		searchVO.setLastIndex(19);
		searchVO.setRecordCountPerPage(20);*/

        //model.addAttribute("resultList", cmmnCodeManageService.selectCmmnCodeList(searchVO));
        
        //int totCnt =cmmnCodeManageService.selectCmmnCodeListTotCnt(searchVO);
		//paginationInfo.setTotalRecordCount(totCnt);
        //model.addAttribute("paginationInfo", paginationInfo);
		model.addAttribute("list", cmmnCodeManageService.selectCmmnCodeList(searchVO));
        return jsonview;
	}
    
    @RequestMapping(value="/sym/ccm/cca/EgovCcmCmmnCodeMModify_json.do")
	public View EgovCcmCmmnCodeMModify_json (@ModelAttribute("loginVO") LoginVO loginVO
			, @ModelAttribute("cmmnDetailCode") CmmnDetailCode cmmnDetailCode
			, @ModelAttribute("cmmnCode") CmmnCode cmmnCode
			, BindingResult bindingResult
			, @RequestParam Map <String, Object> commandMap
			, ModelMap model
			) throws Exception {
    	Map bodyMap = U.getBody(commandMap);
    	List list = (List)bodyMap.get("paramList");

    	
    	//Master처리==========================================================================================================================================
    	//삭제대상을 먼저삭제해야 insert시 문제가 없다.
    	for(int i=0;i < list.size() ;i++) {
    		Map row = (Map)list.get(i);
    		cmmnCode.setClCode("LET");
    		cmmnCode.setCodeId((String)row.get("codeId"));
    		cmmnCode.setCodeIdNm((String)row.get("codeIdNm"));
    		cmmnCode.setLastUpdusrId(loginVO.getUniqId());
    		cmmnCode.setUseAt((String)row.get("useAt"));
        	cmmnCode.setFrstRegisterId(loginVO.getUniqId());
        	if("D".equalsIgnoreCase(U.getStatus(row)) ) {
        		cmmnCodeManageService.deleteCmmnCodePhysical(cmmnCode);
        	}
    	}
    	
    	
    	for(int i=0;i < list.size() ;i++) {
    		Map row = (Map)list.get(i);
    		cmmnCode.setClCode("LET");
    		cmmnCode.setCodeId((String)row.get("codeId"));
    		cmmnCode.setCodeIdNm((String)row.get("codeIdNm"));
    		cmmnCode.setLastUpdusrId(loginVO.getUniqId());
    		cmmnCode.setUseAt((String)row.get("useAt"));
        	cmmnCode.setFrstRegisterId(loginVO.getUniqId());
        	if("C".equalsIgnoreCase(U.getStatus(row)) ) {
        		cmmnCodeManageService.insertCmmnCode(cmmnCode);
        	}else if("U".equalsIgnoreCase(U.getStatus(row)) ) {
        		cmmnCodeManageService.updateCmmnCode(cmmnCode);
        	}
    	}
    	
    	
        return jsonview;    	
    };

    
    @RequestMapping(value="/sym/ccm/cca/EgovCcmCmmnCodeDModify_json.do")
	public View EgovCcmCmmnCodeDModify_json (@ModelAttribute("loginVO") LoginVO loginVO
			, @ModelAttribute("cmmnDetailCode") CmmnDetailCode cmmnDetailCode
			, @ModelAttribute("cmmnCode") CmmnCode cmmnCode
			, BindingResult bindingResult
			, @RequestParam Map <String, Object> commandMap
			, ModelMap model
			) throws Exception {
    	Map bodyMap = U.getBody(commandMap);

    	List list_D = (List)bodyMap.get("paramList_D");
    	String codeId = (String)bodyMap.get("codeId");
    	
    	
    	//Detail처리==========================================================================================================================================
    	//삭제대상을 먼저삭제해야 insert시 문제가 없다.
    	for(int i=0;i < list_D.size() ;i++) {
    		Map row = (Map)list_D.get(i);
    		cmmnDetailCode.setCode((String)row.get("code"));
    		cmmnDetailCode.setCodeNm((String)row.get("codeNm"));
    		cmmnDetailCode.setCodeId(codeId);
    		cmmnDetailCode.setLastUpdusrId(loginVO.getUniqId());
    		cmmnDetailCode.setUseAt((String)row.get("useAt"));    		
    		cmmnDetailCode.setFrstRegisterId(loginVO.getUniqId());
    		
    		if("D".equalsIgnoreCase(U.getStatus(row)) ) {
        		cmmnDetailCodeManageService.deleteCmmnDetailCodePhysic(cmmnDetailCode);
        	}
    	}
    	
    	
    	for(int i=0;i < list_D.size() ;i++) {
    		Map row = (Map)list_D.get(i);
    		cmmnDetailCode.setCode((String)row.get("code"));
    		cmmnDetailCode.setCodeNm((String)row.get("codeNm"));
    		cmmnDetailCode.setCodeId(codeId);
    		cmmnDetailCode.setLastUpdusrId(loginVO.getUniqId());
    		cmmnDetailCode.setUseAt((String)row.get("useAt"));    		
    		cmmnDetailCode.setFrstRegisterId(loginVO.getUniqId());
	    	
        	if("C".equalsIgnoreCase(U.getStatus(row)) ) {
        		cmmnDetailCodeManageService.insertCmmnDetailCode(cmmnDetailCode);
        	}else if("U".equalsIgnoreCase(U.getStatus(row)) ) {
    	    	cmmnDetailCodeManageService.updateCmmnDetailCode(cmmnDetailCode);        		
        	}
    	}
    	
    	
        return jsonview;    	
    };

    	
    	
}