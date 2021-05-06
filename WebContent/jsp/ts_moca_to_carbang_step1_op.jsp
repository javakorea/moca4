<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ page import="java.io.*,java.nio.charset.*,java.util.*,org.apache.logging.log4j.*,com.google.gson.*,com.carbang365.*" %>
<%@ page import="org.apache.http.*,org.apache.http.client.config.*,org.apache.http.client.entity.*,org.apache.http.client.methods.*" %>
<%@ page import="org.apache.http.entity.*,org.apache.http.entity.mime.*,org.apache.http.impl.client.*,org.apache.http.message.*" %>
<%!
	String url = "http://58.126.157.173/ts/api/transfer_status_request";
	String ContentType = "application/x-www-form-urlencoded;charset=utf-8";
%>
<%
	System.out.println("------------------------------------------------------->statusSTEPA");
	CloseableHttpClient http = HttpClients.createDefault();
	StringBuffer result = new StringBuffer();
	try{
        String xml_string_to_send = request.getParameter("xml");
        System.out.println("------------------------------------------------------->status STEPB"+xml_string_to_send);
        if(xml_string_to_send == null){
            xml_string_to_send += "<?xml version=\"1.0\" encoding=\"utf-8\"?>"+"\n";
            xml_string_to_send += "<contents>"+"\n";
            xml_string_to_send += "<CNTC_INFO_CODE>DC1_AC1_02</CNTC_INFO_CODE>"+"\n";
            xml_string_to_send += "<CHARGER_ID>1535978228</CHARGER_ID>"+"\n";
            xml_string_to_send += "<CHARGER_NM></CHARGER_NM>"+"\n";
            xml_string_to_send += "<CHARGER_IP_ADRES>192.168.0.1</CHARGER_IP_ADRES>"+"\n";
            xml_string_to_send += "<CNTC_INSTT_CODE>CARBANGAPP</CNTC_INSTT_CODE>"+"\n";
            xml_string_to_send += "<REQST_RCEPT_NO>124</REQST_RCEPT_NO>"+"\n";//<------------------------------------idx
            xml_string_to_send += "<CVPL_REQST_NO>1100</CVPL_REQST_NO>"+"\n";
            xml_string_to_send += "</contents>";
        }
        
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
	    	System.out.println("------------------------------------------------------->status STEPD");
	    	e.printStackTrace();  
			result = new StringBuffer();
	    	result.append("error"+e.getMessage());
	    }finally{
	    	if(httpResponse != null){
	    		httpResponse.close();
	    	}
	    }
	}catch(Exception e) {
		System.out.println("------------------------------------------------------->status STEPE");
		e.printStackTrace();   
		result = new StringBuffer();
    	result.append("error"+e.getMessage());
	}finally{
		if(http != null){
			http.close();
		}
	}
	System.out.println("------------------------------------------------------->status STEPF");
%>
<%--=result.toString().replaceAll("<\\?xml.*?>","").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\\n", "<br>") --%>
<%=result.toString()%>