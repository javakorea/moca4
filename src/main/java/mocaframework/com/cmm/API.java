package mocaframework.com.cmm;

import java.io.InputStreamReader;
import java.io.BufferedReader;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.client.HttpClient;
import org.apache.http.HttpEntity;
import java.net.URLEncoder;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.content.FileBody;
import java.io.File;
import java.util.Iterator;
import java.nio.charset.Charset;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import java.util.HashMap;
import java.util.Map;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.message.BasicNameValuePair;
import java.util.ArrayList;
import org.apache.http.NameValuePair;
import java.util.List;


public class API {
	public static String sendSms(String _msg,String _receiver,String _receiverNm){
		try{
			
			final String encodingType = "utf-8";
			final String boundary = "____boundary____";
			
			/**************** 문자전송하기 예제 ******************/
			/* "result_code":결과코드,"message":결과문구, */
			/* "msg_id":메세지ID,"error_cnt":에러갯수,"success_cnt":성공갯수 */
			/* 동일내용 > 전송용 입니다.  
			/******************** 인증정보 ********************/
			String sms_url = "https://apis.aligo.in/send/"; // 전송요청 URL
			
			Map<String, String> sms = new HashMap<String, String>();
			
			sms.put("user_id", "teammoca"); // SMS 아이디
			sms.put("key", "eue471wfrhjgj9ajn4cdrjeabmlu6nyp"); //인증키
			
			/******************** 인증정보 ********************/
			
			/******************** 전송정보 ********************/
			sms.put("msg", _msg); // 메세지 내용
			sms.put("receiver", _receiver); // 수신번호
			sms.put("destination", _receiver+"|"+_receiverNm); // 수신인 %고객명% 치환 
			sms.put("sender", "01090789322"); // 발신번호
			sms.put("rdate", ""); // 예약일자 - 20161004 : 2016-10-04일기준
			sms.put("rtime", ""); // 예약시간 - 1930 : 오후 7시30분
			sms.put("testmode_yn", "N"); // Y 인경우 실제문자 전송X , 자동취소(환불) 처리
			//sms.put("title", "제목입력"); //  LMS, MMS 제목 (미입력시 본문중 44Byte 또는 엔터 구분자 첫라인)
			sms.put("msg_type", "SMS"); //  sms
			
			String image = "";
			//image = "/tmp/pic_57f358af08cf7_sms_.jpg"; // MMS 이미지 파일 위치
			
			/******************** 전송정보 ********************/
			
			MultipartEntityBuilder builder = MultipartEntityBuilder.create();
			
			builder.setBoundary(boundary);
			builder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);
			builder.setCharset(Charset.forName(encodingType));
			
			for(Iterator<String> i = sms.keySet().iterator(); i.hasNext();){
				String key = i.next();
				builder.addTextBody(key, sms.get(key)
						, ContentType.create("Multipart/related", encodingType));
			}
			
			File imageFile = new File(image);
			if(image!=null && image.length()>0 && imageFile.exists()){
		
				builder.addPart("image",
						new FileBody(imageFile, ContentType.create("application/octet-stream"),
								URLEncoder.encode(imageFile.getName(), encodingType)));
			}
			
			HttpEntity entity = builder.build();
			
			HttpClient client = HttpClients.createDefault();
			HttpPost post = new HttpPost(sms_url);
			post.setEntity(entity);
			
			HttpResponse res = client.execute(post);
			
			String result = "";
			if(res != null){
				BufferedReader in = new BufferedReader(new InputStreamReader(res.getEntity().getContent(), encodingType));
				String buffer = null;
				while((buffer = in.readLine())!=null){
					result += buffer;
				}
				in.close();
			}
			//out.print(result);
			return result;
		}catch(Exception e){
			//out.print(e.getMessage());
			e.printStackTrace();
			return e.getMessage();
		}	
	
	}
	
	
	public static String sendCheckYn(String _msg,String _receiver,String _receiverNm){
		try{

			final String encodingType = "utf-8";
				
			/*************  문자전송 결과 상세보기 *****************/
			/** SMS_CNT / LMS_CNT / MMS_CNT : 전송유형별 잔여건수 ***/
			/******************** 인증정보 ********************/
			String sms_url = "https://apis.aligo.in/sms_list/"; // 전송요청 URL
			
			List<NameValuePair> sms = new ArrayList<NameValuePair>();
			
			sms.add(new BasicNameValuePair("user_id", "")); // SMS 아이디 
			sms.add(new BasicNameValuePair("key", "")); //인증키
			/******************** 인증정보 ********************/
			
			sms.add(new BasicNameValuePair("mid", "39003")); // 메세지ID
			sms.add(new BasicNameValuePair("page", "0")); //조회 시작번호1
			sms.add(new BasicNameValuePair("page_size", "10")); //출력 갯수
			
			HttpClient client = HttpClients.createDefault();
			HttpPost post = new HttpPost(sms_url);
			post.setEntity(new UrlEncodedFormEntity(sms, encodingType));
			
			HttpResponse res = client.execute(post);
			
			String result = "";
			if(res != null){
				BufferedReader in = new BufferedReader(new InputStreamReader(res.getEntity().getContent(), encodingType));
				String buffer = null;
				while((buffer = in.readLine())!=null){
					result += buffer;
				}
				in.close();
			}
			
			//out.print(result);
			return result;
		}catch(Exception e){
			//out.print(e.getMessage());
			e.printStackTrace();
			return e.getMessage();
		}
	}
	
	
}
