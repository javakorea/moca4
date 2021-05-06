package egovframework.batch.service.impl;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.parser.Parser;
import org.apache.tika.sax.BodyContentHandler;
import org.springframework.stereotype.Service;

import egovframework.batch.AutoDetection;
import egovframework.batch.FileFnc;
import egovframework.batch.service.BatchService;
import mocaframework.com.cmm.U;
import mocaframework.com.cmm.service.MocaEFLService;

@Service("fileBatchService")
public class BatchServiceImpl implements BatchService{	
	/**
	 * 테스트용 주기적으로 실행된 메소드 이다.
	 */
	@Resource(name = "batchFileDAO")
	private BatchFileDAO batchFileDAO;
	
	/** cmmUseService */
	@Resource(name = "mocaEFLService")
	private MocaEFLService mocaEFLService;
	

	@Override
	public void receipt(Map mapvo) throws Exception{
		Parser parser = new AutoDetectParser();
        long start = System.currentTimeMillis();
		BodyContentHandler handler = new BodyContentHandler(10000000);
		Metadata metadata = new Metadata();
		String info = (String)mapvo.get("fileInfo");
		String path = (String)mapvo.get("uploadPath");
		String name = (String)mapvo.get("fileNm");
		Map fileMetaMap = (Map)mapvo.get("fileMetaMap");
		long metaLastModified = Long.parseLong((String)mapvo.get("lastModified"));
		
		String[] infoArr = info.split("@@");
		File tempFile = new File(path);
		if (tempFile.isFile()) {
			String sizeLong = infoArr[0];
			String sizeLabel = infoArr[1];
			String fileNameForClient = infoArr[2];
			String filePathForClient = infoArr[3];
			String extenForClient = infoArr[4];
			String fileHashCodeForClient = infoArr[5];
			String popuCd = infoArr[6];
			
			//데이터 매핑 관련 수정필요
			HashMap<String, Object> fnDataMap = new HashMap<>();
			fnDataMap.put("trId", mapvo.get("trId"));
			fnDataMap.put("corpCd", mapvo.get("corpCd"));
			fnDataMap.put("sysCd", mapvo.get("sysCd"));
			fnDataMap.put("gCd", popuCd);

			fnDataMap.put("fileId", tempFile.getName());
			fnDataMap.put("fileNm",fileNameForClient);

			fnDataMap.put("etc", mapvo.get("etc"));
			fnDataMap.put("meataHash", fileHashCodeForClient); 
			fnDataMap.put("fileExten", extenForClient); 
			fnDataMap.put("fileSize", sizeLabel); 
			fnDataMap.put("lastUpdusrId", "batchadmin"); 
			fnDataMap.put("frstRegisterId", "batchadmin");
			fnDataMap.put("nowStep", "01");
			fnDataMap.put("path", path);
			fnDataMap.put("metaLastModified", U.longToDate(metaLastModified));
			
			
			fnDataMap.put("C0", (String)fileMetaMap.get("C0"));
			fnDataMap.put("C1", (String)fileMetaMap.get("C1"));
			fnDataMap.put("C2", (String)fileMetaMap.get("C2"));
			fnDataMap.put("C3", (String)fileMetaMap.get("C3"));
			fnDataMap.put("C4", (String)fileMetaMap.get("C4"));
			fnDataMap.put("C5", (String)fileMetaMap.get("C5"));
			fnDataMap.put("C6", (String)fileMetaMap.get("C6"));
			fnDataMap.put("C7", (String)fileMetaMap.get("C7"));
			fnDataMap.put("C8", (String)fileMetaMap.get("C8"));
			fnDataMap.put("C9", (String)fileMetaMap.get("C9"));
			
			
			fnDataMap.put("C0_NM", (String)fileMetaMap.get("C0_NM"));
			fnDataMap.put("C1_NM", (String)fileMetaMap.get("C1_NM"));
			fnDataMap.put("C2_NM", (String)fileMetaMap.get("C2_NM"));
			fnDataMap.put("C3_NM", (String)fileMetaMap.get("C3_NM"));
			fnDataMap.put("C4_NM", (String)fileMetaMap.get("C4_NM"));
			fnDataMap.put("C5_NM", (String)fileMetaMap.get("C5_NM"));
			fnDataMap.put("C6_NM", (String)fileMetaMap.get("C6_NM"));
			fnDataMap.put("C7_NM", (String)fileMetaMap.get("C7_NM"));
			fnDataMap.put("C8_NM", (String)fileMetaMap.get("C8_NM"));
			fnDataMap.put("C9_NM", (String)fileMetaMap.get("C9_NM"));
			
			System.out.println("====================================="+fnDataMap);
			fnDataMap.put("metaCreationDate", (String)fileMetaMap.get("META_CREATION_DATE"));
			batchFileDAO.insertFileInfo(fnDataMap);
			}
	}
	
	@Override
	public void regist() throws Exception{
/*		try {
			List list01 = mocaEFLService.select_01STEP_EFGFILES(new HashMap());
			for(int i=0; i< list01.size(); i++) {
				Map row = (Map)list01.get(i);
				String path = (String)row.get("PATH");
				String REGIST_SERVER_DIR = (String)row.get("REGIST_SERVER_DIR");
				String oriPath = path;
				//파일 정보 저장 후 파일 이동
				if(oriPath != null) {
					File folder1 = new File(oriPath);
					File folder2 = new File(REGIST_SERVER_DIR);
					if(!folder2.exists()) {
						folder2.mkdirs();
					}

					
					HashMap<String, Object> fnDataMap = new HashMap<>();
					fnDataMap.put("trId", row.get("TR_ID"));
					fnDataMap.put("corpCd", row.get("CORP_CD"));
					fnDataMap.put("sysCd", row.get("SYS_CD"));
					fnDataMap.put("gCd", row.get("POPU_CD"));
					fnDataMap.put("fileId", (String)row.get("FILE_ID"));
					fnDataMap.put("fileNm",(String)row.get("FILE_NM"));
					fnDataMap.put("etc", (String)row.get("FILE_NM"));
					fnDataMap.put("meataHash", (String)row.get("MEATA_HASH")); 
					fnDataMap.put("fileExten", (String)row.get("FILE_EXTEN")); 
					fnDataMap.put("fileSize", (String)row.get("FILE_SIZE")); 
					fnDataMap.put("lastUpdusrId", "batchadmin"); 
					fnDataMap.put("frstRegisterId", "batchadmin");
					fnDataMap.put("nowStep", "02");
					fnDataMap.put("path", oriPath.replaceAll("receipt", "regist"));
					//fnDataMap.put("metaLastModified",(String)row.get("META_LAST_MODIFIED"));
					
					fnDataMap.put("NOWSTEP", "02");
					fnDataMap.put("NOW_STEP", "02");
					fnDataMap.put("FILE_ID", (String)row.get("FILE_ID"));
					
					batchFileDAO.updateFileInfo(fnDataMap);
					//FileFnc.copy(folder1, folder2);
					//FileFnc.copyFile2(folder1, folder2,true);
					//FileFnc.delete(oriPath);
				}

			}
		}catch(Exception e) {
			e.printStackTrace();
		}*/

	}
	
	
	@Override
	public void writeErrorLog(Map map) throws Exception{
		batchFileDAO.writeErrorLog(map);
		mocaEFLService.mailSend(map);
	}
	
	
	
	
}
