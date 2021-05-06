package mocaframework.com.cmm.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import egovframework.rte.fdl.property.EgovPropertyService;
import mocaframework.com.cmm.service.NpasService;

/**
 * 사용자관리에 관한 비지니스 클래스를 정의한다.
 * @author 공통서비스 개발팀 조재영
 * @since 2009.04.10
 * @version 1.0
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      수정자           수정내용
 *  -------    --------    ---------------------------
 *   2009.04.10  조재영          최초 생성
 *   2011.08.31  JJY            경량환경 템플릿 커스터마이징버전 생성
 *
 * </pre>
 */
@Service("NpasService")
public class NpasServiceImpl extends EgovAbstractServiceImpl implements NpasService {

	/** mocaBDAO */
	@Resource(name="NpasDAO")
	private NpasDAO npasDAO;
	
    @Resource(name = "propertiesService")
    protected EgovPropertyService propertyService;
    
    
	public List selectList_npreport(Map map) throws Exception {
		return npasDAO.selectList_npreport(map);
	}

	public Object updateList_npreport(Map map) throws Exception {
		return npasDAO.updateList_npreport(map);
	}	
	
	public Object insertList_npreport(Map map) throws Exception {
		return npasDAO.insertList_npreport(map);
	}

	public Object deleteList_npreport(Map map) throws Exception {
		return npasDAO.deleteList_npreport(map);
	}

	public List report_cate_big(Map map) throws Exception {
		return npasDAO.report_cate_big(map);
	}
	
	public List report_cate_small(Map map) throws Exception {
		return npasDAO.report_cate_small(map);
	}

}