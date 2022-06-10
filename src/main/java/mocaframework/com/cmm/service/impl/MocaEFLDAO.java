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
@Repository("mocaEFLDAO")
public class MocaEFLDAO extends EgovAbstractDAO{
	public List<?> selectList_EFL_RECP(Map map){
        return list("mocaEFLDAO.selectList_EFL_RECP", map);
    }
	public List<?> selectList_EFL_MAIL(Map map){
        return list("mocaEFLDAO.selectList_EFL_MAIL", map);
    }
	public Object insertList_EFL_RECP(Map map){
        return insert("mocaEFLDAO.insertList_EFL_RECP", map);
    }	
	public Object updateList_EFL_RECP(Map map){
        return update("mocaEFLDAO.updateList_EFL_RECP", map);
    }		
	public Object deleteList_EFL_RECP(Map map){
        return delete("mocaEFLDAO.deleteList_EFL_RECP", map);
    }	
	public Object deleteList_EFL_MSCA(Map map){
        return delete("mocaEFLDAO.deleteList_EFL_MSCA", map);
    }	
	public List<?> selectList_EFL_RECP_H(Map map){
        return list("mocaEFLDAO.selectList_EFL_RECP_H", map);
    }
	
	public Object insertList_EFL_RECP_H(Map map){
		Object obj = map.get("META_LAST_MODIFIED");
		if(obj != null) {
			String cName = obj.getClass().getName();
			if("java.lang.Double".equals(cName)) {
				Double META_LAST_MODIFIED_long = (Double)map.get("META_LAST_MODIFIED");
				map.put("META_LAST_MODIFIED", U.longToDate(META_LAST_MODIFIED_long));
			}
		}

		Object obj2 = map.get("META_CREATION_DATE");
		if(obj2 != null) {
			String cName2 = obj2.getClass().getName();
			if("java.lang.Double".equals(cName2)) {
				Double META_CREATION_DATE_long = (Double)map.get("META_CREATION_DATE");
				map.put("META_CREATION_DATE", U.longToDate(META_CREATION_DATE_long));
			}	
		}

        return insert("mocaEFLDAO.insertList_EFL_RECP_H", map);
    }	
	
	public List<?> selectList_EFC_CORP(Map map){
        return list("mocaEFLDAO.selectList_EFC_CORP", map);
    }
	
	public List<?> selectList_EFC_SYST(Map map){
        return list("mocaEFLDAO.selectList_EFC_SYST", map);
    }
	
	public List<?> selectList_JOIN_POPU(Map map){
        return list("mocaEFLDAO.selectList_JOIN_POPU", map);
    }
	
	
	public Object insertList_EFL_MSCA(Map map){
        return insert("mocaEFLDAO.insertList_EFL_MSCA", map);
    }	
	public Object insertList_EFGCA_POPU_M(Map map){
        return insert("mocaEFLDAO.insertList_EFGCA_POPU_M", map);
    }		
	public Object insertList_EFL_CAFL_DOWN_H(Map map){
        return insert("mocaEFLDAO.insertList_EFL_CAFL_DOWN_H", map);
    }			
	
	
	
	public Object updateList_EFL_MSCA(Map map){
        return insert("mocaEFLDAO.updateList_EFL_MSCA", map);
    }	
	public List<?> selectList_EFL_MSCA(Map map){
        return list("mocaEFLDAO.selectList_EFL_MSCA", map);
    }
	public Object deleteAll_EFL_MSCA(Map map){
        return delete("mocaEFLDAO.deleteAll_EFL_MSCA", map);
    }	
	public Object deleteAll_EFGCA_POPU_M(Map map){
        return delete("mocaEFLDAO.deleteAll_EFGCA_POPU_M", map);
    }	
	public List<?> selectList_EFL_CAFL(Map map){
        return list("mocaEFLDAO.selectList_EFL_CAFL", map);
    }	
	public List<?> selectList_EFL_CAFL_TREE(Map map){
        return list("mocaEFLDAO.selectList_CA_TREE", map);
    }		
	
	
	
	public List<?> selectList_EFL_OUTS(Map map){
        return list("mocaEFLDAO.selectList_EFL_OUTS", map);
    }	
	
	public Map selectOne_EFL_CAFL(Map map){
        return (Map)select("mocaEFLDAO.selectOne_EFL_CAFL", map);
    }	
	public List<?> selectProperties(Map map){
        return list("mocaEFLDAO.selectProperties", map);
    }	
	
	public Map selectOne_EFC_POPU(Map map){
        return (Map)select("mocaEFLDAO.selectOne_EFC_POPU", map);
    }	
	public Map selectOne_EFC_FILE(Map map){
        return (Map)select("mocaEFLDAO.selectOne_EFC_FILE", map);
    }		
	
	
	
	
	
	public List<?> selectList_EFG_DOWN_H(Map map){
        return list("mocaEFLDAO.selectList_EFG_DOWN_H", map);
    }	
	
	
	public List<?> selectList_EFC_POPU_EXT(Map map){
        return list("mocaEFLDAO.selectList_EFGPOPU_EXT", map);
    }		
	public Object deleteList_EFC_POPU_EXT(Map map){
        return delete("mocaEFLDAO.delete_EFGPOPU_EXT", map);
    }	
	public Object deleteAll_EFC_POPU_EXT(Map map){
        return delete("mocaEFLDAO.deleteAll_EFGPOPU_EXT", map);
    }		
	public Object updateList_EFC_POPU_EXT(Map map){
        return insert("mocaEFLDAO.updateAll_EFGPOPU_EXT", map);
    }	
	public Object insert_EFGPOPU_EXT(Map map){
        return insert("mocaEFLDAO.insert_EFGPOPU_EXT", map);
    }	
	
	public List<?> selectList_EFC_POPU(Map map){
        return list("mocaEFLDAO.selectList_EFC_POPU", map);
    }		
	public Object deleteList_EFC_POPU(Map map){
        return delete("mocaEFLDAO.delete_EFGPOPU", map);
    }	
	public Object deleteAll_EFC_POPU(Map map){
        return delete("mocaEFLDAO.deleteAll_EFGPOPU", map);
    }		
	public Object updateList_EFC_POPU(Map map){
        return insert("mocaEFLDAO.updateAll_EFGPOPU", map);
    }	
	public Object insert_EFGPOPU(Map map){
        return insert("mocaEFLDAO.insert_EFGPOPU", map);
    }	
	
	public List<?> select_01STEP_EFGFILES(Map map){
        return list("mocaEFLDAO.select_01STEP_EFGFILES", map);
    }		
	
	
	

	public Object deleteList_EFGSYST(Map map){
        return delete("mocaEFLDAO.deleteList_EFGSYST", map);
    }	
	public Object deleteList_EFC_CORP(Map map){
        return delete("mocaEFLDAO.deleteList_EFC_CORP", map);
    }	
	
	public Object insertOne_EFGSYST(Map map){
        return insert("mocaEFLDAO.insertOne_EFGSYST", map);
    }	
	public Object insertOne_referer(Map map){
        return insert("mocaEFLDAO.insertOne_referer", map);
    }	
	public List<?> selectList_referrer(Map map){
        return list("mocaEFLDAO.selectList_referrer", map);
    }
	
	
	
	
	public Object updateList_EFGSYST(Map map){
        return insert("mocaEFLDAO.updateList_EFGSYST", map);
    }	
	public Object insertOne_EFGCORP(Map map){
        return insert("mocaEFLDAO.insertOne_EFGCORP", map);
    }	
	
	public Object updateList_EFGCORP(Map map){
        return insert("mocaEFLDAO.updateList_EFGCORP", map);
    }	
	
	public Object insertOne_EFGULOG(Map map){
        return insert("mocaEFLDAO.insertOne_EFGULOG", map);
    }		
	
	public Object deleteList_EFGPROP(Map map){
        return delete("mocaEFLDAO.deleteList_EFGPROP", map);
    }	
	
	public Object insertOne_EFGPROP(Map map){
        return insert("mocaEFLDAO.insertOne_EFGPROP", map);
    }	
	
	public Object updateList_EFGPROP(Map map){
        return insert("mocaEFLDAO.updateList_EFGPROP", map);
    }	
	
	public List<?> selectList_EFGPROP(Map map){
        return list("mocaEFLDAO.selectList_EFGPROP", map);
    }
		
	
	public List<?> selectList_MAIN_SYST(Map map){
        return list("mocaEFLDAO.select_MAIN_SYST", map);
    }		
	public List<?> selectList_MAIN_CNT(Map map){
        return list("mocaEFLDAO.select_MAIN_CNT", map);
    }
	public List<?> selectList_EFGULOG(Map map){
        return list("mocaEFLDAO.selectList_EFGULOG", map);
    }
	public Map selectTotalCnt_EFGULOG(Map map){
        return (Map)select("mocaEFLDAO.selectTotalCnt_EFGULOG", map);
    }
	
	public List<?> selectNumList_EFGULOG(Map map){
        return list("mocaEFLDAO.selectNumList_EFGULOG", map);
    }
	public Map selectOne_EFGSYST(Map map){
        return (Map)select("mocaEFLDAO.selectOne_EFGSYST", map);
    }	
	public Map selectOne_EFGCA(Map map){
        return (Map)select("mocaEFLDAO.selectOne_EFGCA", map);
    }	
	public List<?> selectList_EFGCA(Map map){
        return list("mocaEFLDAO.selectOne_EFGCA", map);
    }		
	
	
	
}