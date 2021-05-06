<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ page import="java.io.*,java.nio.charset.*,java.util.*,org.apache.logging.log4j.*,com.google.gson.*,com.carbang365.*,egovframework.com.cmm.service.Globals" %>
<%@ page import="org.apache.http.*,org.apache.http.client.config.*,org.apache.http.client.entity.*,org.apache.http.client.methods.*" %>
<%@ page import="org.apache.http.entity.*,org.apache.http.entity.mime.*,org.apache.http.impl.client.*,org.apache.http.message.*" %>
<%!
	String url = Globals.KAKAO_REQUEST_210_API_URL;
	String Authorization = "Bearer "+Globals.MNDT_AHRZT;
	String ContentType = Globals.KAKAO_REQUEST_210_API_CONTENTTYPE;
%>
<%
	String phone_no= request.getParameter("phone_no");
	String name= request.getParameter("name");
	String birthday= request.getParameter("birthday");
	String expires_in= request.getParameter("expires_in");
	String call_center_no= request.getParameter("call_center_no");
	String title= request.getParameter("title");
	String markdown_use= request.getParameter("markdown_use");
	String data= request.getParameter("data");

	CloseableHttpClient http = HttpClients.createDefault();
	StringBuffer result = new StringBuffer();
	try{
		HttpPost post = new HttpPost(url);
	    post.setHeader("Authorization", Authorization);
	    post.setHeader("Content-Type", ContentType);

		List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
		urlParameters.add(new BasicNameValuePair("phone_no", phone_no));
		urlParameters.add(new BasicNameValuePair("name", name));
		urlParameters.add(new BasicNameValuePair("birthday", birthday));
		urlParameters.add(new BasicNameValuePair("expires_in", expires_in));
		urlParameters.add(new BasicNameValuePair("call_center_no", call_center_no));
		urlParameters.add(new BasicNameValuePair("title", title));
		urlParameters.add(new BasicNameValuePair("markdown_use", markdown_use));
		urlParameters.add(new BasicNameValuePair("publish_certified_electronic_doc", "Y"));
		urlParameters.add(new BasicNameValuePair("data", data));

		HttpEntity postParams = new UrlEncodedFormEntity(urlParameters,"UTF-8");
		post.setEntity(postParams);
	    
	    CloseableHttpResponse httpResponse = http.execute(post);
	    try{
	        HttpEntity res = httpResponse.getEntity();
	        BufferedReader br = new BufferedReader(new InputStreamReader(res.getContent(), Charset.forName("UTF-8")));
	        String buffer = null;
	        while( (buffer = br.readLine())!=null ){
	            result.append(buffer).append("\r\n");
	        }
	    }catch(Exception e) {
	    	e.printStackTrace();              
	    }finally{
	    	if(httpResponse != null){
	    		httpResponse.close();
	    	}
	    }
	}catch(Exception e) {
		e.printStackTrace();   
	}finally{
		if(http != null){
			http.close();
		}
	}
	
%>
<%=result%>