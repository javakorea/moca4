<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ page import="java.io.*,java.nio.charset.*,java.util.*,org.apache.logging.log4j.*,com.google.gson.*,com.carbang365.*,egovframework.com.cmm.service.Globals" %>
<%@ page import="org.apache.http.*,org.apache.http.client.config.*,org.apache.http.client.entity.*,org.apache.http.client.methods.*" %>
<%@ page import="org.apache.http.entity.*,org.apache.http.entity.mime.*,org.apache.http.impl.client.*,org.apache.http.message.*" %>
<%!
	String url = Globals.KAKAO_VERIFY_API_URL;
	String Authorization = "Bearer "+Globals.MNDT_AHRZT;
	String ContentType = Globals.KAKAO_VERIFY_API_CONTENTTYPE;
%><%
	String tx_id = request.getParameter("tx_id");
	CloseableHttpClient http = HttpClients.createDefault();
	StringBuffer result = new StringBuffer();
	try{
	    HttpGet post = new HttpGet(url+tx_id);
	    post.setHeader("Authorization", Authorization);
	    post.setHeader("Content-Type", ContentType);
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
	/*
	org.springframework.web.context.WebApplicationContext wac = org.springframework.web.context.support.WebApplicationContextUtils.getWebApplicationContext(((HttpServletRequest) request).getSession().getServletContext());
	TOMapper tOMapper = (TOMapper)wac.getBean("TOMapper");
	Map param = new HashMap();
	param.put("id", "1535978228");
	param.put("loginType", "1");
	ToUserVO userVo = tOMapper.selectToUsersDetail(param);
	*/
%><%=result%>