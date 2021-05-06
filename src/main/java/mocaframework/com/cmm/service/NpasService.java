package mocaframework.com.cmm.service;
import java.util.List;
import java.util.Map;

/**
 * 사용자관리에 관한 인터페이스클래스를 정의한다.
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
public interface NpasService  {
	public List selectList_npreport(Map map) throws Exception ;
	
	public Object updateList_npreport(Map map) throws Exception ;
	
	public Object insertList_npreport(Map map) throws Exception ;

	public Object deleteList_npreport(Map map) throws Exception ;

	public List report_cate_big(Map map) throws Exception ;

	public List report_cate_small(Map map) throws Exception ;
}