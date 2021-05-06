package mocaframework.com.cmm;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Component;
import org.springframework.ui.ModelMap;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;

import egovframework.com.cmm.LoginVO;
import egovframework.com.cmm.service.EgovProperties;
import egovframework.rte.fdl.security.userdetails.util.EgovUserDetailsHelper;

@Component
public class U {

	public static Map getEdiScope(Map<String, Object> commandMap,String scope) {
		Map<String,Object> map = new HashMap<String,Object>();
		try {
			LoginVO user = (LoginVO) EgovUserDetailsHelper.getAuthenticatedUser();
			Gson gson = new Gson(); 
	    	String json = commandMap.get(scope).toString();
	    	map = (Map<String,Object>) gson.fromJson(json, map.getClass());
	    	map.put("SESS_USERID", user.getId());
	    	map.put("SESS_USERNM", user.getName());
	    	
	    	String headerString = (String)commandMap.get("header");
	    	Map headerMap = new HashMap<String,Object>();
	    	headerMap = (Map<String,Object>) gson.fromJson(headerString, headerMap.getClass());
			map.put("SESS_TRANID", (String)headerMap.get("TRANID"));
		}catch(Exception e) {
			e.printStackTrace();
		}

    	return map;
	}

	public static Map getEdiScopeNoSess(Map<String, Object> commandMap,String scope) {
		Map<String,Object> map = new HashMap<String,Object>();
		try {
			Gson gson = new Gson(); 
/*			if(scope != null && commandMap.get(scope) != null) {
		    	String json = commandMap.get(scope).toString();
		    	map = (Map<String,Object>) gson.fromJson(json, map.getClass());
		    	map.put("SESS_USERID", commandMap.get("user_id"));
		    	map.put("SESS_USERNM", commandMap.get("user_id"));
		    	System.out.println("bodyMap:"+map);
		    	
		    	String headerString = (String)commandMap.get("header");
		    	Map headerMap = new HashMap<String,Object>();
		    	headerMap = (Map<String,Object>) gson.fromJson(headerString, headerMap.getClass());
				map.put("SESS_TRANID", (String)headerMap.get("TRANID"));
			}else {*/
			System.out.println("*****************"+EgovUserDetailsHelper.getAuthenticatedUser());
				String cName = EgovUserDetailsHelper.getAuthenticatedUser().getClass().getName();
				if(cName.equalsIgnoreCase("java.lang.String")) {
					if(commandMap.get(scope) != null) {
				    	String json = commandMap.get(scope).toString();
				    	Gson gson2 = new Gson(); 
				    	map = (Map<String,Object>) gson2.fromJson(json, map.getClass());
					}else {
						map = commandMap;
					}
				}else {
					LoginVO user = (LoginVO) EgovUserDetailsHelper.getAuthenticatedUser();
					if(user != null && user.getId() != null && !user.getId().equals("")) {
						Gson gson2 = new Gson(); 
						if(commandMap.get(scope) != null) {
					    	String json = commandMap.get(scope).toString();
					    	map = (Map<String,Object>) gson2.fromJson(json, map.getClass());
						}else {
							map = commandMap;
						}
				    	map.put("SESS_USERID", user.getId());
				    	map.put("SESS_USERNM", user.getName());
					}
					
				}
				
				String id = (String)map.get("ID");
				String loginType = (String)map.get("LOGIN_TYPE");
				if(id != null &&  map.get("id") == null) {
					map.put("id", id);
				}
				if(loginType != null &&  map.get("loginType") == null) {
					map.put("loginType", loginType);
				}				
				
				
				System.out.println("mapmapmap:"+map);

			//} 
		}catch(Exception e) {
			e.printStackTrace();
		}

    	return map;
	}
	
	public static Map getBody(Map<String, Object> commandMap) {
		System.out.println("commandMap:"+commandMap);
		return getEdiScope(commandMap,"body");
	} 
	public static Map getBodyNoSess(Map<String, Object> commandMap) {
		System.out.println("commandMap:"+commandMap);
		return getEdiScopeNoSess(commandMap,"body");
	} 
	public static String getStatus(Map<String, Object> row) {
		Map _system = (Map)row.get("_system");
		return (String)_system.get("status");
	} 
	
	public static String[] strToArr(String str,String sepa) {
		if(str == null || "".equals(str.trim())) {
			return null;
		}else {
			String strIssuer = str.trim();
			String[] arrIssuer = strIssuer.split(sepa);
			return arrIssuer;	
		}
	} 
	
	
	
	public static int getInt(Map<String, Object> row,String _key) {
		Object obj = row.get(_key);
		System.out.println("ob:"+obj+","+_key);
		if(obj != null) {
			Class cl = obj.getClass();
			String clName = cl.getName();
			if("java.lang.String".equalsIgnoreCase(clName)) {
				String s = (String)obj;
				s = s.trim();
				return Integer.parseInt((String)s); 
			}else {
				return ((Double)obj).intValue();
			}
			//(Integer.parseInt(row.get("menuNo").toString()) 
		}else {
			return 0;
		}
	} 	
	
//  프로젝트 내 지정된 경로에 파일을 저장하는 메소드
//  DB에는 업로드된 전체 경로명으로만 지정되기 때문에(업로드한 파일 자체는 경로에 저장됨)
//  fileUpload() 메소드에서 전체 경로를 리턴받아 DB에 경로 그대로 저장   
    public static String fileUploadBig(HttpServletRequest request,
                                        MultipartFile uploadFile, Map pathInfo,String popu_cd) {
        String path = "";
        String fileName = "";
        OutputStream out = null;
        PrintWriter printWriter = null;
        long lastModified = 0;
        try {
            fileName = uploadFile.getOriginalFilename();
            //String fileName2 = URLDecoder.decode(fileName, "UTF-8");
            byte[] bytes = uploadFile.getBytes();
            path = getSaveLocation(request, pathInfo,popu_cd);
            File f = new File(path);
			if(fileName.endsWith("_0._tmp")) {
		        File[] partFiles = f.listFiles();
		        if(partFiles != null) {
		            int partCnt = partFiles.length;
		            for(int i=(partCnt-1); i > -1; i--) {
		            	partFiles[i].delete();
		            }
		        }
			}
            File file = new File(path+fileName);
            lastModified = file.lastModified();
            pathInfo.put("lastModified", lastModified);
            out = new FileOutputStream(file);
            out.write(bytes);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (out != null) {
                    out.close();
                }
                if (printWriter != null) {
                    printWriter.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        
        return path + fileName;
    }
	
	
    
//  프로젝트 내 지정된 경로에 파일을 저장하는 메소드
//  DB에는 업로드된 전체 경로명으로만 지정되기 때문에(업로드한 파일 자체는 경로에 저장됨)
//  fileUpload() 메소드에서 전체 경로를 리턴받아 DB에 경로 그대로 저장   
    public static String fileUpload(HttpServletRequest request,
                                        MultipartFile uploadFile, Map pathInfo,String popu_cd) {
        String path = "";
        String fileName = "";
        OutputStream out = null;
        PrintWriter printWriter = null;
        long lastModified = 0;
        try {
            fileName = uploadFile.getOriginalFilename();
            pathInfo.put("originalFilename", fileName);
            //String fileName2 = URLDecoder.decode(fileName, "UTF-8");
            byte[] bytes = uploadFile.getBytes();
            path = getSaveLocation(request, pathInfo,popu_cd);
            File file = new File(path);
            lastModified = file.lastModified();
            pathInfo.put("lastModified", lastModified);
            fileName = System.currentTimeMillis()+"";
//          파일명이 중복으로 존재할 경우
            if (fileName != null && !fileName.equals("")) {
                if (file.exists()) {
//                    파일명 앞에 업로드 시간 초단위로 붙여 파일명 중복을 방지
                    //fileName = System.currentTimeMillis() + "_" + fileName;
                	fileName = System.currentTimeMillis()+"";
                    file = new File(path + fileName);
                }else {
                	file.mkdirs();//없으면 폴더만들기
                }
            }
            //System.out.println("UtilFile fileUpload final fileName : " + fileName);
            //System.out.println("UtilFile fileUpload file : " + file);
            out = new FileOutputStream(file);
            //System.out.println("UtilFile fileUpload out : " + out);
            out.write(bytes);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (out != null) {
                    out.close();
                }
                if (printWriter != null) {
                    printWriter.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        
        return path + fileName;
    }
    

    public static String getSaveLocation(HttpServletRequest request, Map obj, String popu_cd) {
    	String RECEIPT_SERVER_DIR = (String)obj.get("RECEIPT_SERVER_DIR");
    	Object subDir = obj.get("subDir");
    	//if(RECEIPT_SERVER_DIR == null || "".equals(RECEIPT_SERVER_DIR.trim())) {
    		if(RECEIPT_SERVER_DIR == null) {
    			RECEIPT_SERVER_DIR = EgovProperties.getPathProperty("Globals.excelDir").trim();	
    		}
    		if(!RECEIPT_SERVER_DIR.endsWith("/")) {
    			RECEIPT_SERVER_DIR += "/";
    		}
    		if(subDir != null) {
    			RECEIPT_SERVER_DIR += subDir.toString();
        		if(!RECEIPT_SERVER_DIR.endsWith("/")) {
        			RECEIPT_SERVER_DIR += "/";
        		}
    		}
    		
    	//}
    	File fileDir = new File(RECEIPT_SERVER_DIR);
    	if(!fileDir.exists()) {
    		fileDir.mkdirs();
    	}
    	String fullPath = "";
    	fullPath = RECEIPT_SERVER_DIR;
    	System.out.println(">>>>>>>>>>>>>>>>>>>> fullPath = RECEIPT_SERVER_DIR;"+fullPath);
        return fullPath;
    }

	public static Map<String, Object> getMap(String json) throws IOException, JsonParseException, JsonMappingException {
		ObjectMapper mapper = new ObjectMapper(); 
		Map<String, Object> map = new HashMap<String, Object>(); // convert JSON string to Map 
		map = mapper.readValue(json, new TypeReference<Map<String, Object>>(){});
		return map;
	}
	
	public static String longToDate(double l) {
		Date date1 = new Date((long)l); 
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		return dateFormat.format(date1);
	}
	
	public static String longToDate(String l) {
		Date date1 = new Date(Long.parseLong(l)); 
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		return dateFormat.format(date1);
	}	
	
	public static int mailSend(Map map) {
        String user = (String)map.get("mail.message.setFrom"); // 네이버일 경우 네이버 계정, gmail경우 gmail 계정
        String password = (String)map.get("password");   // 패스워드

        // SMTP 서버 정보를 설정한다.
        Properties prop = new Properties();
        prop.put("mail.smtp.host", (String)map.get("mail.smtp.host")); 
        prop.put("mail.smtp.port", (String)map.get("mail.smtp.port")); 
        prop.put("mail.smtp.auth", (String)map.get("mail.smtp.auth")); 

        Session session = Session.getDefaultInstance(prop, new javax.mail.Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(user, password);
            }
        });

        try {
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(user));

            String[] internetAddressArray =  (String[])map.get("InternetAddress");
            InternetAddress[] addArray = new InternetAddress[internetAddressArray.length]; 
            for(int i=0;i<internetAddressArray.length;i++) {
            	String mailAddr = internetAddressArray[i];
            	addArray[i] = new InternetAddress(mailAddr); 
            }
            message.addRecipients(Message.RecipientType.TO, addArray);
            //System.out.println("map==================="+map);
            // Subject
            String title = (String)map.get("title");
            //System.out.println("---------------------------------------------------------------------------"+title);
            message.setSubject(title); //메일 제목을 입력

            // Text
            String text = (String)map.get("text");
            message.setText(text);    //메일 내용을 입력

            // send the message
            Transport.send(message); ////전송
            return 1;
        } catch (AddressException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (MessagingException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }



        return 0;
	}
	
	
	/*
	 * 
	 * 	String fileName = "20190101_349_ACB2019_12_08_네오디안소프트.txt";
	 *  String input = "([0-9]{8})_([0-9]{3})_([^0-9]{3})([0-9 _]{10})^^C0,C1,C3,C4^^C4^^([0-9]{4})_([0-9]{2})_([0-9]{2})^^$1$2$3";
	 *  Map m = getPatternMap(fileName,input);
	 *  
	 *  result
	 *  metaMap : {C3=ACB, C4=2019_12_08, META_CREATION_DATE=20191208, C0=20190101, C1=349}
	 * 
	 */
	public static Map getPatternMap(String fileName,String input,String CREATE_DT_TYPE,String lastModified) {
		Map metaMap = new HashMap();
		try {
		    	if("01".equals(CREATE_DT_TYPE) ) {//파일최근수정일자
		    		System.out.println("case 1");
		    		metaMap.put("META_CREATION_DATE", U.longToDate(Long.parseLong(lastModified)));
		    	}else {
					String[] arr = input.split("\\^\\^");
					String regexString = arr[0];
					String bindString = arr[1];
					String META_CREATION_DATE = arr[2];
					String META_CREATION_DATE_regexString = arr[3];
					String META_CREATION_DATE_replaceFormat = arr[4];
					
				    Pattern pat = Pattern.compile(regexString); 
				    Matcher match = pat.matcher(fileName);
				    String[] columns = bindString.split(",");
				    int matchCount = 0;
				    while (match.find()) {
				    	int cnt = match.groupCount();
				    	for(int i=0; i < cnt; i++) {
				    		String value = match.group(i+1);
				    		String key = columns[i];
				    		String[] keyArr = key.split("__");
				    		metaMap.put(keyArr[0]+"_NM", keyArr[1]);
				    		metaMap.put(keyArr[0], value);
				    	}
				        matchCount++;
				    }
		    		String META_CREATION_DATE_str = (String)metaMap.get(META_CREATION_DATE);
		    		if(META_CREATION_DATE_str != null) {
		    			String META_CREATION_DATE_ = META_CREATION_DATE_str.replaceAll(META_CREATION_DATE_regexString, META_CREATION_DATE_replaceFormat);
			    		if(META_CREATION_DATE_ != null && !"".equals(META_CREATION_DATE_)) {//정규식추출
			    			metaMap.put("META_CREATION_DATE", U.getTime(META_CREATION_DATE_));
			    		}else {//정규식추출실패시
			    			metaMap.put("META_CREATION_DATE", U.longToDate(Long.parseLong(lastModified)));
			    		}
		    		}else {
		    			metaMap.put("META_CREATION_DATE", U.longToDate(Long.parseLong(lastModified)));
		    		}
		    	}
			
		}catch(Exception e) {
			e.printStackTrace();
		}


	    return metaMap;
	}
	

	public static String getTime(String yyyymmdd) {
		try {
			/*String date_s2 = yyyymmdd; 
			SimpleDateFormat dt2 = new SimpleDateFormat("yyyyymmdd"); 
			Date date2 = dt2.parse(date_s2);
			return date2.getTime();*/
			if(yyyymmdd != null && yyyymmdd.length() == 8) {
				return yyyymmdd.substring(0, 4)+"-"+yyyymmdd.substring(4, 6)+"-"+yyyymmdd.substring(6, 8)+" 00:00:00";
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
		return yyyymmdd;
	}

	
	public static boolean preCheck(ModelMap model) {
		Map re = new HashMap();
		Object o = EgovUserDetailsHelper.getAuthenticatedUser();
		
		if("java.lang.String".equals(o.getClass().getName())) {
			if(o.toString().equalsIgnoreCase("anonymousUser")) {
				re.put("ERROR", "NOLOGIN");
				model.addAttribute("map", re);
				return false;  
			}
		}
		Boolean isAuthenticated = EgovUserDetailsHelper.isAuthenticated();
		if(!isAuthenticated) {
			re.put("ERROR", "NOAUTH");
			model.addAttribute("map", re);
			return false; 		
		}
		return true;
	}	
	
	public static String d(String en_str) {
		String str = "";
		try {
			str = java.net.URLDecoder.decode(java.net.URLDecoder.decode(en_str,"UTF-8"),"UTF-8");
		}catch(Exception e) {
			e.printStackTrace();
		}
		return str;
	}	
		
	
	
	
}
