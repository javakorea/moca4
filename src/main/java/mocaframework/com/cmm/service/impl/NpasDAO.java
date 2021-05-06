package mocaframework.com.cmm.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import egovframework.rte.psl.dataaccess.EgovAbstractDAO;
import mocaframework.com.cmm.U;

/**
 * 사용자관리에 관한 데이터 접근 클래스를 정의한다.
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
@Repository("NpasDAO")
public class NpasDAO extends EgovAbstractDAO{
	public List<?> selectList_npreport(Map map){
        return list("NpasDAO.selectList_npreport", map);
    }
	
	public Object updateList_npreport(Map map){
        return update("NpasDAO.updateList_npreport", map);
    }
	
	public Object insertList_npreport(Map map){
        return insert("NpasDAO.insertList_npreport", map);
    }	

	public Object deleteList_npreport(Map map){
        return delete("NpasDAO.deleteList_npreport", map);
    }

	public List<?> report_cate_big(Map map){
        return list("NpasDAO.report_cate_big", map);
    }

	public List<?> report_cate_small(Map map){
        return list("NpasDAO.report_cate_small", map);
    }
}