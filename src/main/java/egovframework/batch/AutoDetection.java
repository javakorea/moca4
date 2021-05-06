package egovframework.batch;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;

import javax.annotation.Resource;

import org.apache.tika.exception.TikaException;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.parser.Parser;
import org.apache.tika.sax.BodyContentHandler;
import org.xml.sax.SAXException;

import egovframework.batch.service.impl.BatchFileDAO;

public class AutoDetection {
	@Resource(name = "batchFileDAO")
	private BatchFileDAO batchFileDAO;

	public void extractFromFile(final Parser parser, final String oriPath, final String copyPath)
			throws Exception {
		long start = System.currentTimeMillis();
		BodyContentHandler handler = new BodyContentHandler(10000000);
		Metadata metadata = new Metadata();
		// InputStream content = AutoDetection.class.getResourceAsStream(fileName);

		// 폴더 경로 파일 읽기
		String path = oriPath;
		File dirFile = new File(path);
		File[] fileList = dirFile.listFiles();
		for (File tempFile : fileList) {
			if (tempFile.isFile()) {
				String tempPath = tempFile.getParent();
				String tempFileName = tempFile.getName();
				System.out.println("Path=" + tempPath);
				System.out.println("FileName=" + tempFileName);
				/*** Do something withd tempPath and temp FileName ^^; ***/
				
				//법인코드^^시스템코드^^모집단코드^^생산기간구분코드^^생산일^^생산부서명(부서코드)^^생산자명(ID)^^^^^^기타사항.확장자
				//데이터 매핑 관련 수정필요
				HashMap<String, Object> fnDataMap = new HashMap<>();
				
				String[] dataArray = tempFileName.split("[^^]");
				System.out.println(dataArray.length);
				String[] dataNmArray = {"corpId","sysCd","gCd","mfTermCd","mfDt","mfDeptCd","mfId","mfSpare1","mfSpare2","etc"};
				fnDataMap.put("FILE_ID", tempFileName);
				System.out.println(tempFileName.split("[^^]")[0]);
				/*for(int n =0 ; n < dataArray.length ; n++) {
					fnDataMap.put(dataNmArray[n], dataArray[n]);
				}*/

				
				FileInputStream fileStream = new FileInputStream(tempPath+"/"+tempFileName);
			    InputStream content = fileStream;
			    parser.parse(content, handler, metadata, new ParseContext());
			    for (String name : metadata.names()) {
			        System.out.println(name + ":\t" + metadata.get(name));
			    }
			    
			    fileStream.close();
				System.out.println(String.format(
				        "------------ Processing took %s millis\n\n",
				        System.currentTimeMillis() - start));
				System.out.println("------------ content of document\n" + handler.toString());
				
				System.out.println("!!!!!!!!!!!!!!!!!hash value");
				
				String fileHashCode = FileFnc.extractFileHashSHA256(tempPath+"/"+tempFileName);

				System.out.println(fileHashCode);

				System.out.println("!!!!!!!!!!!!!!!!!hash value");
				
				fnDataMap.put("meataHash", fileHashCode); 
				
				System.out.println(fnDataMap);
				
				batchFileDAO.insertFileInfo(fnDataMap);
			}
		}

		//파일 정보 저장 후 파일 이동
		File folder1 = new File(oriPath);
		File folder2 = new File(copyPath);
		
		FileFnc.copy(folder1, folder2);
		FileFnc.delete(oriPath);
		
		//TEST DB INSERT
		/*DbClass dbClass = new DbClass();
		
		dbClass.fileInsert();*/
	}
}