package mocaframework.com.cmm;

import java.io.BufferedOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLEncoder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;

public class FtpU {
    public static void connect(java.util.Map m,HttpServletRequest request,HttpServletResponse response) throws Exception{
    	/*
			list:[{FILE_REAL_NM=재생 에너지 - 친환경 ETF.pdf, FILE_NM=6E1399644F8E17EBFEAE9D5118C0777C6B90EDE9276EAA5D9E8E8F269742F1C0.PDF, FILE_PATH=\InfoMax\8020\0, file_cd=20200807201330}]
			server : neodiansoft.iptime.org
			port : 21
			data path : \\InfoMax_8020
			id/pw : ftp_web / ftpweb0124
			privilege : only READ
		*/
    	System.out.println("ftp FILE_PATH.."+U.d((String)m.get("FILE_PATH")));
    	System.out.println("ftp FILE_NM.."+U.d((String)m.get("FILE_NM")));
    	System.out.println("ftp FILE_REAL_NM.."+U.d((String)m.get("FILE_REAL_NM")));
        String server = "neodiansoft.iptime.org";
        int port = 21;//ftp포트
        String user = "ftp_web";
        String pass = "ftpweb0124";
 
        FTPClient ftpClient = new FTPClient();
        OutputStream outputStream2 = null;
        InputStream inputStream = null;
        try {
            ftpClient.connect(server, port);
            ftpClient.login(user, pass);
            ftpClient.enterLocalPassiveMode();
            ftpClient.setFileType(FTP.BINARY_FILE_TYPE);
            String file_path = (U.d((String)m.get("FILE_PATH"))).replaceAll("\\\\","/");
            file_path = file_path.replaceAll("/InfoMax/8020", "/InfoMax_8020");
            String remoteFile = file_path+"/"+U.d((String)m.get("FILE_NM"));//원격 다운받을 파일명
            
            //File downloadFile = new File("C:\\temp\\"+(String)m.get("FILE_REAL_NM"));//다운받을 파일명
            boolean success = false;
            //boolean success = ftpClient.retrieveFile(remoteFile, outputStream);
            //System.out.println("ftp success:"+success);
            //outputStream.close();
           // if (success) {
            
            
            
            
            
            
            	setDisposition(U.d((String)m.get("FILE_REAL_NM")), request, response);

                 outputStream2 = new BufferedOutputStream(response.getOutputStream());
                 inputStream = ftpClient.retrieveFileStream(remoteFile);
                 byte[] bytesArray = new byte[4096];
                 int bytesRead = -1;
                 while ((bytesRead = inputStream.read(bytesArray)) != -1) {
                     outputStream2.write(bytesArray, 0, bytesRead);
                 }
      
                 success = ftpClient.completePendingCommand();
                 outputStream2.close();
                 inputStream.close();
                 


    	 
                System.out.println("파일을 다운로드 받았습니다..");
        } catch (Exception ex) {
            System.out.println("던짐2");
            throw ex;
        } finally {
            try {
                if (ftpClient.isConnected()) {
                    ftpClient.disconnect();
                }
                if(outputStream2 != null) {
                	 outputStream2.close();
                }
                if(inputStream != null) {
                	inputStream.close();
               }               
            } catch (IOException ex2) {
            	ex2.printStackTrace();
            }
            
        }
    }
    
    
    public static void setDisposition(String filename, HttpServletRequest request,HttpServletResponse response) throws Exception {
        String browser = getBrowser(request);
        String dispositionPrefix = "attachment; filename=";
        String encodedFilename = null;

        if (browser.equals("MSIE")) {
            encodedFilename = URLEncoder.encode(filename, "UTF-8").replaceAll(
            "\\+", "%20");
        } else if (browser.equals("Firefox")) {
            encodedFilename = "\""
            + new String(filename.getBytes("UTF-8"), "8859_1") + "\"";
        } else if (browser.equals("Opera")) {
            encodedFilename = "\""
            + new String(filename.getBytes("UTF-8"), "8859_1") + "\"";
        } else if (browser.equals("Chrome")) {
            encodedFilename = URLEncoder.encode(filename, "UTF-8").replaceAll(
            "\\+", "%20");
            /*
            StringBuffer sb = new StringBuffer();
            for (int i = 0; i < filename.length(); i++) {
	            char c = filename.charAt(i);
	            if (c > '~') {
	                sb.append(URLEncoder.encode("" + c, "UTF-8"));
	            } else {
	                sb.append(c);
	            }
            }
            encodedFilename = sb.toString();
            */
        } else {
            throw new IOException("Not supported browser");
        }

        response.setHeader("Content-Disposition", dispositionPrefix
        + encodedFilename);

        if ("Opera".equals(browser)) {
            response.setContentType("application/octet-stream;charset=UTF-8");
        }
    }

    public static String getBrowser(HttpServletRequest request) {
        String header = request.getHeader("User-Agent");
        if (header.indexOf("MSIE") > -1) {
             return "MSIE";
        } else if (header.indexOf("Chrome") > -1) {
             return "Chrome";
        } else if (header.indexOf("Opera") > -1) {
             return "Opera";
        } else if (header.indexOf("Firefox") > -1) {
             return "Firefox";
        } else if (header.indexOf("Mozilla") > -1) {
             if (header.indexOf("Firefox") > -1) {
                  return "Firefox";
             }else{
                  return "MSIE";
             }
        }
        return "MSIE";
   }


	
	
}
