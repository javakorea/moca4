package egovframework.FileLink.service.impl;

import org.springframework.stereotype.Service;

import egovframework.FileLink.common.FileLink;
import egovframework.FileLink.service.FileService;

/**
 * @Class Name : EgovCmmUseServiceImpl.java
 * @Description : 공통코드등 전체 업무에서 공용해서 사용해야 하는 서비스를 정의하기위한 서비스 구현 클래스
 * @Modification Information
 *
 *    수정일       수정자         수정내용
 *    -------        -------     -------------------
 *    2009. 3. 11.     이삼섭
 *
 * @author 공통 서비스 개발팀 이삼섭
 * @since 2009. 3. 11.
 * @version
 * @see
 *
 */
@Service("FileLinkService")
public class FileServiceImpl implements FileService  {

	@Override
	public void fileDownload(String urlPath,String localPath) throws Exception {
		// TODO Auto-generated method stub
		FileLink fileLink = new FileLink();
		
		fileLink.setUrlFileSave(urlPath, localPath);
	}

	
}
