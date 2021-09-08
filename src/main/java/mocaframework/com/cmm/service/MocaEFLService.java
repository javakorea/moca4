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
public interface MocaEFLService  {
	public List selectList_EFL_MAIL(Map map) throws Exception;
	public List selectList_EFL_RECP(Map map) throws Exception;
	public Object insertList_EFL_RECP(Map map) throws Exception;
	public Object deleteList_EFL_RECP(Map map) throws Exception;
	public Object updateList_EFL_RECP(Map map) throws Exception;	
	
	public List selectList_EFL_RECP_H(Map map) throws Exception;
	public Object insertList_EFL_RECP_H(Map map) throws Exception;
	public Map selectOne_EFC_FILE(Map map) throws Exception;
	
	public List selectList_EFC_CORP(Map map) throws Exception;
	public Object insertOne_EFGCORP(Map map) throws Exception;
	public Object updateList_EFGCORP(Map map) throws Exception;
	
	public Object deleteList_EFC_CORP(Map map) throws Exception;
	
	public List selectList_EFC_SYST(Map map) throws Exception;	
	public List selectList_JOIN_POPU(Map map) throws Exception;
	
	public Object deleteList_EFL_MSCA(Map map) throws Exception;
	public Object insertList_EFL_MSCA(Map map) throws Exception;
	public Object insertList_EFGCA_POPU_M(Map map) throws Exception;	
	
	public Object updateList_EFL_MSCA(Map map) throws Exception;
	public List selectList_EFL_MSCA(Map map) throws Exception;
	public Object deleteAll_EFL_MSCA(Map map) throws Exception;
	public Object deleteAll_EFGCA_POPU_M(Map map) throws Exception;
	
	public List selectList_EFL_CAFL(Map map) throws Exception;
	public List selectList_EFL_OUTS(Map map) throws Exception;
	
	public Map selectOne_EFL_CAFL(Map map) throws Exception;
	public Map getFullPath(Map map) throws Exception;
	public List selectProperties(Map map) throws Exception;
	
	public Map selectOne_EFC_POPU(Map map) throws Exception;
	public Object insertList_EFL_CAFL_DOWN_H(Map map) throws Exception;
	public List selectList_EFG_DOWN_H(Map map) throws Exception;
	
	public List selectList_EFC_POPU_EXT(Map map) throws Exception;
	public Object deleteAll_EFC_POPU_EXT(Map map) throws Exception;
	public Object deleteList_EFC_POPU_EXT(Map map) throws Exception;
	public Object updateList_EFC_POPU_EXT(Map map) throws Exception;
	public Object insertList_EFC_POPU_EXT(Map map) throws Exception;
	
	public List selectList_EFC_POPU(Map map) throws Exception;
	public Object deleteAll_EFC_POPU(Map map) throws Exception;
	public Object deleteList_EFC_POPU(Map map) throws Exception;
	public Object updateList_EFC_POPU(Map map) throws Exception;
	public Object insertList_EFC_POPU(Map map) throws Exception;
	public List select_01STEP_EFGFILES(Map map) throws Exception;
	
	public Object deleteList_EFGSYST(Map map) throws Exception;
	public Object insertOne_EFGSYST(Map map) throws Exception;
	public Object updateList_EFGSYST(Map map) throws Exception;
	public Object insertOne_EFGULOG(Map map) throws Exception;
	
	public Object deleteList_EFGPROP(Map map) throws Exception;
	public Object insertOne_EFGPROP(Map map) throws Exception;
	public Object updateList_EFGPROP(Map map) throws Exception;
	public List selectList_EFGPROP(Map map) throws Exception;
	
	public List selectList_MAIN_SYST(Map map) throws Exception;
	public List selectList_MAIN_CNT(Map map) throws Exception;
	public List selectList_EFGULOG(Map map) throws Exception;
	public Map selectTotalCnt_EFGULOG(Map map) throws Exception;
	public List selectNumList_EFGULOG(Map map) throws Exception;
	
	public void mailSend(Map map) throws Exception;
	public Map selectOne_EFGSYST(Map map) throws Exception;
	public Map selectOne_EFGCA(Map map) throws Exception;
	public List selectList_EFL_CAFL_TREE(Map map) throws Exception;
	public List selectList_EFGCA(Map map) throws Exception;
	
}