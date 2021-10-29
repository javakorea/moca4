package mocaframework.com.cmm.service.impl;

import java.io.FileInputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import egovframework.com.cmm.service.EgovProperties;
import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import egovframework.rte.fdl.property.EgovPropertyService;
import mocaframework.com.cmm.U;
import mocaframework.com.cmm.service.MocaEFLService;

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
@Service("mocaEFLService")
public class MocaEFLServiceImpl extends EgovAbstractServiceImpl implements MocaEFLService {

	/** mocaEFLDAO */
	@Resource(name="mocaEFLDAO")
	private MocaEFLDAO mocaEFLDAO;
	
	
    @Resource(name = "propertiesService")
    protected EgovPropertyService propertyService;
    
    
    
    
	public List selectList_EFL_RECP(Map map) throws Exception {
		return mocaEFLDAO.selectList_EFL_RECP(map);
	}
	public List selectList_EFL_MAIL(Map map) throws Exception {
		return mocaEFLDAO.selectList_EFL_MAIL(map);
	}
	public Object insertList_EFL_RECP(Map map) throws Exception {
		return mocaEFLDAO.insertList_EFL_RECP(map);
	}
	public Object updateList_EFL_RECP(Map map) throws Exception {
		return mocaEFLDAO.updateList_EFL_RECP(map);
	}	
	public Object deleteList_EFL_RECP(Map map) throws Exception {
		return mocaEFLDAO.deleteList_EFL_RECP(map);
	}
	public List selectList_EFL_RECP_H(Map map) throws Exception {
		return mocaEFLDAO.selectList_EFL_RECP_H(map);
	}	
	public Object insertList_EFL_RECP_H(Map map) throws Exception {
		return mocaEFLDAO.insertList_EFL_RECP_H(map);
	}
	
	public List selectList_EFC_CORP(Map map) throws Exception {
		return mocaEFLDAO.selectList_EFC_CORP(map);
	}	
	

	

	public List selectList_JOIN_POPU(Map map) throws Exception {
		return mocaEFLDAO.selectList_JOIN_POPU(map);
	}	
	
	public Object deleteList_EFL_MSCA(Map map) throws Exception {
		return mocaEFLDAO.deleteList_EFL_MSCA(map);
	}			
	public Object insertList_EFL_MSCA(Map map) throws Exception {
		return mocaEFLDAO.insertList_EFL_MSCA(map);
	}
	public Object insertList_EFGCA_POPU_M(Map map) throws Exception {
		return mocaEFLDAO.insertList_EFGCA_POPU_M(map);
	}
	
	
	public Object updateList_EFL_MSCA(Map map) throws Exception {
		return mocaEFLDAO.updateList_EFL_MSCA(map);
	}
	public List selectList_EFL_MSCA(Map map) throws Exception {
		return mocaEFLDAO.selectList_EFL_MSCA(map);
	}
	public List selectList_EFL_CAFL(Map map) throws Exception {
		return mocaEFLDAO.selectList_EFL_CAFL(map);
	}
	public List selectList_EFL_CAFL_TREE(Map map) throws Exception {
		return mocaEFLDAO.selectList_EFL_CAFL_TREE(map);
	}
	
	
	
	public List selectList_EFL_OUTS(Map map) throws Exception {
		return mocaEFLDAO.selectList_EFL_OUTS(map);
	}	
	
	
	
	
	public Object deleteAll_EFL_MSCA(Map map) throws Exception {
		return mocaEFLDAO.deleteAll_EFL_MSCA(map);
	}
	public Object deleteAll_EFGCA_POPU_M(Map map) throws Exception {
		return mocaEFLDAO.deleteAll_EFGCA_POPU_M(map);
	}
	public Map selectOne_EFL_CAFL(Map map) throws Exception {
		return mocaEFLDAO.selectOne_EFL_CAFL(map);
	}
	public Map getFullPath(Map map) throws Exception {
		Map popuMap = selectOne_EFL_CAFL(map);
		//String FILE_ID = (String)map.get("FILE_ID");
		Map re = new HashMap();
		re.put("PATH", (String)popuMap.get("PATH"));
		re.put("FILE_NM", (String)popuMap.get("FILE_NM"));
		re.put("FILE_EXTEN", (String)popuMap.get("FILE_EXTEN"));
		re.put("FILE_ID", (String)popuMap.get("FILE_ID"));
		re.put("MEATA_HASH", (String)popuMap.get("MEATA_HASH"));
		return re;
	}
	public List selectProperties(Map map) throws Exception {
		return mocaEFLDAO.selectProperties(map);
	}
	public Object insertList_EFL_CAFL_DOWN_H(Map map) throws Exception {
		return mocaEFLDAO.insertList_EFL_CAFL_DOWN_H(map);
	}
	
	
	public Map selectOne_EFC_POPU(Map map) throws Exception {
		return mocaEFLDAO.selectOne_EFC_POPU(map);
	}
	public Map selectOne_EFC_FILE(Map map) throws Exception {
		return mocaEFLDAO.selectOne_EFC_FILE(map);
	}
	public List selectList_EFG_DOWN_H(Map map) throws Exception {
		return mocaEFLDAO.selectList_EFG_DOWN_H(map);
	}
	
	
	
	
	public List selectList_EFC_POPU_EXT(Map map) throws Exception {
		return mocaEFLDAO.selectList_EFC_POPU_EXT(map);
	}
	public Object deleteAll_EFC_POPU_EXT(Map map) throws Exception {
		return mocaEFLDAO.deleteAll_EFC_POPU_EXT(map);
	}
	public Object deleteList_EFC_POPU_EXT(Map map) throws Exception {
		return mocaEFLDAO.deleteList_EFC_POPU_EXT(map);
	}
	public Object updateList_EFC_POPU_EXT(Map map) throws Exception {
		return mocaEFLDAO.updateList_EFC_POPU_EXT(map);
	}
	public Object insertList_EFC_POPU_EXT(Map map) throws Exception {
		return mocaEFLDAO.insert_EFGPOPU_EXT(map);
	}
	

	
	public List selectList_EFC_SYST(Map map) throws Exception {
		return mocaEFLDAO.selectList_EFC_SYST(map);
	}
	//여기

	public Object deleteList_EFGSYST(Map map) throws Exception {
		return mocaEFLDAO.deleteList_EFGSYST(map);
	}
	public Object updateList_EFC_SYST(Map map) throws Exception {
		return mocaEFLDAO.updateList_EFC_POPU_EXT(map);
	}
	public Object insertList_EFC_SYST(Map map) throws Exception {
		return mocaEFLDAO.insert_EFGPOPU_EXT(map);
	}
	
	public Object deleteList_EFC_CORP(Map map) throws Exception {
		return mocaEFLDAO.deleteList_EFC_CORP(map);
	}
	public Object updateList_EFC_CORP(Map map) throws Exception {
		return mocaEFLDAO.updateList_EFC_POPU_EXT(map);
	}
	public Object insertList_EFC_CORP(Map map) throws Exception {
		return mocaEFLDAO.insert_EFGPOPU_EXT(map);
	}
	
	public List selectList_EFC_POPU(Map map) throws Exception {
		return mocaEFLDAO.selectList_EFC_POPU(map);
	}
	public Object deleteAll_EFC_POPU(Map map) throws Exception {
		return mocaEFLDAO.deleteAll_EFC_POPU(map);
	}
	public Object deleteList_EFC_POPU(Map map) throws Exception {
		return mocaEFLDAO.deleteList_EFC_POPU(map);
	}
	public Object updateList_EFC_POPU(Map map) throws Exception {
		return mocaEFLDAO.updateList_EFC_POPU(map);
	}
	public Object insertList_EFC_POPU(Map map) throws Exception {
		return mocaEFLDAO.insert_EFGPOPU(map);
	}
	
	
	
	public List select_01STEP_EFGFILES(Map map) throws Exception {
		return mocaEFLDAO.select_01STEP_EFGFILES(map);
	}
	
	public Object insertOne_EFGSYST(Map map) throws Exception {
		return mocaEFLDAO.insertOne_EFGSYST(map);
	}
	public Object updateList_EFGSYST(Map map) throws Exception {
		return mocaEFLDAO.updateList_EFGSYST(map);
	}	
	public Object insertOne_EFGCORP(Map map) throws Exception {
		return mocaEFLDAO.insertOne_EFGCORP(map);
	}
	public Object updateList_EFGCORP(Map map) throws Exception {
		return mocaEFLDAO.updateList_EFGCORP(map);
	}	
	
	public Object insertOne_EFGULOG(Map map) throws Exception {
		return mocaEFLDAO.insertOne_EFGULOG(map);
	}	
	
	public Object deleteList_EFGPROP(Map map) throws Exception {
		return mocaEFLDAO.deleteList_EFGPROP(map);
	
	}
	public Object insertOne_EFGPROP(Map map) throws Exception {
		return mocaEFLDAO.insertOne_EFGPROP(map);
	}
	public Object updateList_EFGPROP(Map map) throws Exception {
		return mocaEFLDAO.updateList_EFGPROP(map);
	}
	public List selectList_EFGPROP(Map map) throws Exception {
		return mocaEFLDAO.selectList_EFGPROP(map);
	}	
	
	
	
	
	public List selectList_MAIN_SYST(Map map) throws Exception {
		return mocaEFLDAO.selectList_MAIN_SYST(map);
	}
	public List selectList_MAIN_CNT(Map map) throws Exception {
		return mocaEFLDAO.selectList_MAIN_CNT(map);
	}	
	public List selectList_EFGULOG(Map map) throws Exception {
		return mocaEFLDAO.selectList_EFGULOG(map);
	}	
	public Map selectTotalCnt_EFGULOG(Map map) throws Exception {
		return mocaEFLDAO.selectTotalCnt_EFGULOG(map); 
	}
	public List selectNumList_EFGULOG(Map map) throws Exception {
		return mocaEFLDAO.selectNumList_EFGULOG(map);
	}
	public Map selectOne_EFGCA(Map map) throws Exception {
		return mocaEFLDAO.selectOne_EFGCA(map); 
	}
	public List selectList_EFGCA(Map map) throws Exception {
		return mocaEFLDAO.selectList_EFGCA(map); 
	}	
	public Map selectOne_EFGSYST(Map map) throws Exception {
		return mocaEFLDAO.selectOne_EFGSYST(map);
	}		
	
	/*
	 * InternetAddress
	 * title
	 * 
	 * (non-Javadoc)
	 * @see mocaframework.com.cmm.service.MocaEFLService#mailSend(java.util.Map)
	 */
	public void mailSend(Map map) throws Exception {
		String smtpPassword = EgovProperties.getPathProperty("Globals.smtpPassword");
		map.put("password", smtpPassword);
		Map row = new HashMap();
		row.put("PROP_KEY", "mail.");
		List list = mocaEFLDAO.selectList_EFGPROP(row);
		for(int i=0; i < list.size(); i++) {
			Map aRow = (Map)list.get(i);
			String key = (String)aRow.get("PROP_KEY");
			String value = (String)aRow.get("PROP_VALUE");
			if(value != null) {
				map.put(key.trim(), value.trim());
			}else {
				map.put(key.trim(), "");
			}
			
		}
		
		U.mailSend(map);
	}	
}