package egovframework.batch.service.impl;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Repository;

import egovframework.com.cmm.service.impl.EgovComAbstractDAO;

/**
 * @Class Name : BatchFileDAO.java
 * @Description : 배치로 파일정보 DB 저장
 * @Modification Information
 *
 *    수정일       수정자         수정내용
 *    -------        -------     -------------------
 *    2019. 10. 13.     권태균
 *
 * @author 권태균
 * @since 2019. 10. 13.
 * @version
 * @see
 *
 */
@Repository("batchFileDAO")
public class BatchFileDAO extends EgovComAbstractDAO {

	/**
	 * 배치 파일 정보 저장
	 *
	 * @param vo
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public void insertFileInfo(HashMap<String, Object> vo) throws Exception {
		Object re = insert("batchFileDAO.insertFileInfo", vo);
			insert("batchFileDAO.insertFileInfo_h", vo);
	}

	@SuppressWarnings("unchecked")
	public void updateFileInfo(HashMap<String, Object> vo) throws Exception {
		Object re = update("batchFileDAO.updateFileInfo", vo);
			insert("batchFileDAO.insertFileInfo_h", vo);
	}
	
	@SuppressWarnings("unchecked")
	public void writeErrorLog(Map map) throws Exception {
			insert("batchFileDAO.insertErrorLog", map);
	}
	
	
	
	
	
}
