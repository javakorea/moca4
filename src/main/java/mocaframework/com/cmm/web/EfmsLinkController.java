package mocaframework.com.cmm.web;

import java.util.Map;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.View;

import egovframework.FileLink.service.FileService;

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
public class EfmsLinkController {
	@Resource(name = "FileLinkService")
	private FileService fileService;

	
	@Autowired
    private View jsonview;
	/**
	 * 사용자목록을 조회한다. (pageing)
	 * @param userSearchVO 검색조건정보
	 * @param model 화면모델
	 * @return cmm/uss/umt/EgovUserManage
	 * @throws Exception
	 */
	@RequestMapping(value = "/fileLink/fileDownload.do")
	public View fileDownload(@RequestParam Map param, ModelMap model) throws Exception {
		
		String fileUrl = (String)param.get("fileUrl");
		String localPath = (String)param.get("localPath");

		String fileNm = fileUrl.substring(fileUrl.lastIndexOf("/"), fileUrl.length());
		
		System.out.println("!!!!!!!!!!!!!!!");
		System.out.println(fileUrl);
		System.out.println(localPath);
		System.out.println("!!!!!!!!!!!!!!!");

		fileService.fileDownload(fileUrl, localPath);
        
        return jsonview;
	}	

	@RequestMapping(value = "/fileLink/TestfileDownloadView.do")
	public String selectUserList(@RequestParam Map param, ModelMap model) throws Exception {

        
        return "fileLink/sampleView";
	}	
}