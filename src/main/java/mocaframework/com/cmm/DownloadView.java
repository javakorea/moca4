package mocaframework.com.cmm;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import egovframework.batch.FileFnc;

public class DownloadView {
	
	public Map filDown(HttpServletRequest request,
			HttpServletResponse response, String filePath,
			String viewFileNm,String FILE_HASH, String FILE_ID, Map map) throws Exception {
		File file = new File( filePath);
		if (file.exists() && file.isFile()) {
			String s1 = FILE_HASH;
			String s2 = FileFnc.extractFileHashSHA256(filePath);
			System.out.println("s1:"+s1);
			System.out.println("s2:"+s2);
			if(s1.equals("")) {
				map.put("ISSUCCESS", "SUCCESS");
			}else if(s1 != null && s1.equalsIgnoreCase(s2)) {
				map.put("ISSUCCESS", "SUCCESS");
			}else {
				map.put("ISSUCCESS", "FAIL");
			}
		}else {
			map.put("ISSUCCESS", "NOT_EXISTS");
		}
		return map;
	}

	private String getBrowser(HttpServletRequest request) {
		String header = request.getHeader("User-Agent");
		if (header.indexOf("MSIE") > -1 || header.indexOf("Trident") > -1)
			return "MSIE";
		else if (header.indexOf("Chrome") > -1)
			return "Chrome";
		else if (header.indexOf("Opera") > -1)
			return "Opera";
		return "Firefox";
	}

	private String getDisposition(String filename, String browser)
			throws UnsupportedEncodingException {
		String dispositionPrefix = "attachment;filename=";
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
		}
		return dispositionPrefix + encodedFilename;
	}
}