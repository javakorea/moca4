package mocaframework.com.cmm;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.config.RequestConfig.Builder;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.carbang365.TOController;
import com.google.gson.Gson;


public class Curl {
	//static Logger logger = Logger.getLogger("Curl");
	private static final Logger logger = LoggerFactory.getLogger(Curl.class);
	
    private String url;
    private MultipartEntityBuilder params;
    private static final String DEFAULT_ENCODING = "UTF-8";
	    
	    /**
	     * @param url 접속할 url
	     */
	    public Curl(){
	    }
	    public Curl(String url){
	        this.url = url;
	        params = MultipartEntityBuilder.create();
	    }    
	    public static void main(String[] args) throws Exception {
	     

	    }
	   
	    /**
	     * Map 객체에 파라미터명과 파라미터값을 설정해서 한번에 전달
	     * @param Map객체, 파라메터들은 UTF-8로 인코딩 됨
	     * @return
	     */
	    public Curl addParam(Map<String, Object> param){
	        return addParam(param, DEFAULT_ENCODING);
	    }
	    
	    /**
	     * Map 객체에 담겨진 파라미터값의 타입에 따라 적절한 addParam()을 호출한다.
	     * @param Map객체
	     * @param encoding charset
	     * @return
	     */
	    public Curl addParam(Map<String, Object> param, String encoding){
	        for( Map.Entry<String, Object> e : param.entrySet() ){
	            if (e.getValue() instanceof File) {
	                addParam(e.getKey(), (File)e.getValue(), encoding);
	            }else{
	                addParam(e.getKey(), (String)e.getValue(), encoding);
	            }
	        }
	        return this;
	    }
	    
	    /**
	     * 문자열 파라미터를 추가한다.
	     * @param name 파라미터 명
	     * @param value 파라미터 값
	     * @return
	     */
	    public Curl addParam(String name, String value){
	        return addParam(name, value, DEFAULT_ENCODING);
	    }
	    
	    public Curl addParam(String name, String value, String encoding){
	        params.addPart(name, new StringBody(value, ContentType.create("text/plain", encoding)));
	        
	        return this;
	    }
	    
	    /**
	     * 업로드할 파일 파라미터를 추가한다.
	     * @param name 파라미터 명
	     * @param file 파일
	     * @return
	     */
	    public Curl addParam(String name, File file){
	        return addParam(name, file, DEFAULT_ENCODING);
	    }
	    
	    public Curl addParam(String name, File file, String encoding){
	        if( file.exists() ){
	            try{
	                params.addPart( name, 
	                                        new FileBody(file, ContentType.create("application/octet-stream"),
	                                        URLEncoder.encode(file.getName(), encoding)));
	            }catch( Exception ex ){ ex.printStackTrace(); }
	            
	        }
	        return this;
	    }
	 
	    /**
	     * 타겟 URL로 POST 요청을 보낸다.
	     * @return 요청결과
	     * @throws Exception
	     */
	    public String submit() throws Exception{
	        CloseableHttpClient http = HttpClients.createDefault();
	        StringBuffer result = new StringBuffer(); 
	        try{
	            HttpPost post = new HttpPost(url);
	            logger.info(params.build().toString());
	            post.setEntity(params.build());
	            
	            /*************  타켓 URL로 POST 요청 **************/
	            CloseableHttpResponse response = http.execute(post);
	            try{
	                HttpEntity res = response.getEntity();
	                BufferedReader br = new BufferedReader(new InputStreamReader(res.getContent(), Charset.forName("UTF-8")));
	                
	                String buffer = null;
	                while( (buffer = br.readLine())!=null ){
	                    result.append(buffer).append("\r\n");
	                }
		        }catch(Exception e) {
		        	logger.error(e.toString());	                
	            }finally{
	                response.close();
	            }
	        }catch(Exception e) {
	        	logger.error(e.toString());
	        }finally{
	            http.close();
	        }
	 
	        return result.toString();
	    }
	    
	    public String submitJson(HttpEntity stringEntity) throws Exception{
	        CloseableHttpClient http = HttpClients.createDefault();
	        StringBuffer result = new StringBuffer();
	        try{
	            HttpPost post = new HttpPost(url);
	            post.setEntity(stringEntity);
	            post.setHeader("Accept", "application/json");
	            post.setHeader("Connection", "keep-alive");
	            post.setHeader("Content-Type", "application/json");
	            
	            

	            
	            /*************  타켓 URL로 POST 요청 **************/
	            CloseableHttpResponse response = http.execute(post);
	            try{
	                HttpEntity res = response.getEntity();
	                BufferedReader br = new BufferedReader(new InputStreamReader(res.getContent(), Charset.forName("UTF-8")));
	                
	                String buffer = null;
	                while( (buffer = br.readLine())!=null ){
	                    result.append(buffer).append("\r\n");
	                }
		        }catch(Exception e) {
		        	logger.error(e.toString());	                
	            }finally{
	                response.close();
	            }
	        }catch(Exception e) {
	        	logger.error(e.toString());
	        }finally{
	            http.close();
	        }
	 
	        return result.toString();
	    }
	    
	    
	    public void multipartSubmit() {

	    }


		public String callHttp(Map p) {
			String re = "";
			CloseableHttpClient httpclient = HttpClients.createDefault();
		    try {
		        Builder builder = RequestConfig.custom();
		        builder.setConnectTimeout(50000);
		        builder.setSocketTimeout(50000);
		        builder.setStaleConnectionCheckEnabled(false);
		        RequestConfig config = builder.build();
	            HttpPost httpPost = new HttpPost((String)p.get("url"));
	            ArrayList<NameValuePair> postParams = new ArrayList<NameValuePair>();
	            postParams.add(new BasicNameValuePair((String)p.get("key"), (String)p.get("param")));
	            httpPost.setEntity(new UrlEncodedFormEntity(postParams));
	            httpPost.setConfig(config);
	            CloseableHttpResponse response = httpclient.execute(httpPost);
	             
                HttpEntity res = response.getEntity();
                BufferedReader br = new BufferedReader(new InputStreamReader(res.getContent(), Charset.forName("UTF-8")));
                StringBuffer result = new StringBuffer();
                String buffer = null;
                while( (buffer = br.readLine())!=null ){
                    result.append(buffer).append("\r\n");
                }
                re = result.toString();
		    } catch(Exception e) {
		        e.printStackTrace();
		        logger.error(e.getMessage());
	        } finally {
	        	try {
	        		httpclient.close();
	        	}catch(Exception e) {
			        e.printStackTrace();
			        logger.error(e.getMessage());
		        }
	        }
		    return re;
		}
} 