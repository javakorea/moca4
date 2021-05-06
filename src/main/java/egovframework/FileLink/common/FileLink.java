package egovframework.FileLink.common;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLDecoder;

import org.apache.tika.Tika;

import egovframework.FileLink.service.FileVO;

public class FileLink {
	final static int bufferSize = 1024;
	 
    /**
     * # URL 경로의 파일 다운로드
     */
    public static int fileUrlReadAndDownload(String fileUrl, String localFileName, String downloadDir) {
        OutputStream outStream = null;
        URLConnection uCon = null;
 
        InputStream is = null;
        int byteWritten = 0;
        try {
 
            URL Url;
            byte[] buf;
            int byteRead;
            Url = new URL(fileUrl);
                    outStream = new BufferedOutputStream(
             new FileOutputStream(downloadDir + File.separator + URLDecoder.decode(
             localFileName, "UTF-8")));
 
                    uCon = Url.openConnection();
                    is = uCon.getInputStream();
                    buf = new byte[bufferSize];
                    while ((byteRead = is.read(buf)) != -1) {
                        outStream.write(buf, 0, byteRead);
                        byteWritten += byteRead;
                    }
 
                    System.out.println("Download Successfully.");
                    System.out.println("File name : " + localFileName);
                    System.out.println("of bytes  : " + byteWritten);
                    System.out.println("-------Download End--------");
 
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                is.close();
                outStream.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return byteWritten;
    }
 
    /**
     * # 다운로드된 파일 정보를 Bean 클래스에 저장
     *  - DBMS에 저장및 정보 활용을 위함.
     */
    public static FileVO setUrlFileSave(String fileUrl, String downloadDir) throws Exception {
        FileVO fileBean = new FileVO();
        int fileSize = 0;
         
        int slashIndex = fileUrl.lastIndexOf('/');
        int periodIndex = fileUrl.lastIndexOf('.');
 
        // 파일 경로에서 마지막 파일명을 추출
        String fileName = fileUrl.substring(slashIndex + 1);
        String filePath = downloadDir+File.separator+fileName;
        
        File destdir = new File(downloadDir); //디렉토리 가져오기
        
        System.out.println(downloadDir);
        System.out.println(!destdir.exists());
        
        if(!destdir.exists()){
            destdir.mkdirs(); //디렉토리가 존재하지 않는다면 생성
        }
 
        if (periodIndex >= 1 && slashIndex >= 0
                && slashIndex < fileUrl.length() - 1) {
            fileSize = fileUrlReadAndDownload(fileUrl, fileName, downloadDir);
        }
 
        fileBean.setFileName(fileName);
        fileBean.setFilePath(filePath);
        fileBean.setFileSize(fileSize);
        String mimeType = null;
        Tika tika = new Tika(); // 파일의 Mime-Type 추출

         mimeType = tika.detect(new File(filePath));

        fileBean.setFileType(mimeType); // 파일 Mime-Type
         
        return fileBean;
    }
}
