<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ page import="java.io.*,java.nio.charset.*,java.util.*,org.apache.logging.log4j.*,com.google.gson.*,com.carbang365.*" %>
<%@ page import="org.apache.http.*,org.apache.http.client.config.*,org.apache.http.client.entity.*,org.apache.http.client.methods.*" %>
<%@ page import="org.apache.http.entity.*,org.apache.http.entity.mime.*,org.apache.http.impl.client.*,org.apache.http.message.*" %>
<%!
	String url = "http://58.126.157.173/ts/api/transfer_status_request";
	String ContentType = "application/x-www-form-urlencoded;charset=utf-8";
%>
<%
	CloseableHttpClient http = HttpClients.createDefault();
	StringBuffer result = new StringBuffer();
	try{
        String xml_string_to_send = request.getParameter("xml");
        System.out.println("------------------------------------------------------->status STEPB"+xml_string_to_send);
		HttpPost post = new HttpPost(url);
	    post.setHeader("Content-Type", ContentType);
		List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
		urlParameters.add(new BasicNameValuePair("xml", xml_string_to_send));
	
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
	        System.out.println("------------------------------------------------------->status STEPC"+result);
	    }catch(Exception e) {
	    	e.printStackTrace();  
			result = new StringBuffer();
	    	result.append("error"+e.getMessage());
	    }finally{
	    	if(httpResponse != null){
	    		httpResponse.close();
	    	}
	    }
	}catch(Exception e) {
		e.printStackTrace();   
		result = new StringBuffer();
    	result.append("error"+e.getMessage());
	}finally{
		if(http != null){
			http.close();
		}
	}
%>
<%--=result.toString().replaceAll("<\\?xml.*?>","").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\\n", "<br>") --%>
<%=result.toString()%>