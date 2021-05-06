<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ page import="java.io.*,java.nio.charset.*,java.util.*,org.apache.logging.log4j.*,com.google.gson.*,com.carbang365.*" %>
<%@ page import="org.apache.http.*,org.apache.http.client.config.*,org.apache.http.client.entity.*,org.apache.http.client.methods.*" %>
<%@ page import="org.apache.http.entity.*,org.apache.http.entity.mime.*,org.apache.http.impl.client.*,org.apache.http.message.*" %>
<%!
	String url = "http://58.126.157.173/ts/api/transfer_request";
	String ContentType = "application/x-www-form-urlencoded;charset=utf-8";
%>
<%
	System.out.println("------------------------------------------------------->STEPA");
	CloseableHttpClient http = HttpClients.createDefault();
	StringBuffer result = new StringBuffer();
	try{
        String xml_string_to_send = request.getParameter("xml");
        System.out.println("------------------------------------------------------->STEPB"+xml_string_to_send);
        if(xml_string_to_send == null){
            xml_string_to_send += "<?xml version=\"1.0\" encoding=\"utf-8\"?>"+"\n";
            xml_string_to_send += "<contents>"+"\n";
            xml_string_to_send += "<CNTC_INFO_CODE>DC1_AC1_02</CNTC_INFO_CODE>"+"\n";
            xml_string_to_send += "<CHARGER_ID>1535978228</CHARGER_ID>"+"\n";
            xml_string_to_send += "<CHARGER_NM>김세창</CHARGER_NM>"+"\n";
            xml_string_to_send += "<CHARGER_IP_ADRES>192.168.0.1</CHARGER_IP_ADRES>"+"\n";
            xml_string_to_send += "<CNTC_INSTT_CODE>CARBANGAPP</CNTC_INSTT_CODE>"+"\n";
            xml_string_to_send += "<BIZRNO>1280912345678</BIZRNO>"+"\n";
            xml_string_to_send += "<REQST_RCEPT_NO>124</REQST_RCEPT_NO>"+"\n";//<------------------------------------idx
            xml_string_to_send += "<REQST_SE_CODE>1100</REQST_SE_CODE>"+"\n";
            xml_string_to_send += "<APPLCNT_MPNUM>01091168072</APPLCNT_MPNUM>"+"\n";
            xml_string_to_send += "<APPLCNT_NM>김세창</APPLCNT_NM>"+"\n";
            xml_string_to_send += "<APPLCNT_MBER_REGIST_NO>7210071XXXXXX</APPLCNT_MBER_REGIST_NO>"+"\n";
            xml_string_to_send += "<ASGR_MPNUM>01091168072</ASGR_MPNUM>"+"\n";
            xml_string_to_send += "<ASGR_NM>김세창양도인</ASGR_NM>"+"\n";
            xml_string_to_send += "<ASGR_MBER_REGIST_NO>7210071XXXXXX</ASGR_MBER_REGIST_NO>"+"\n";
            xml_string_to_send += "<GRTE_MPNUM>01091168072</GRTE_MPNUM>"+"\n";
            xml_string_to_send += "<GRTE_NM>양수인김세창</GRTE_NM>"+"\n";
            xml_string_to_send += "<GRTE_MBER_REGIST_NO>7210071XXXXXX</GRTE_MBER_REGIST_NO>"+"\n";
            xml_string_to_send += "<VHRNO>41소7390</VHRNO>"+"\n";
            xml_string_to_send += "<TRVL_DSTNC>100</TRVL_DSTNC>"+"\n";
            xml_string_to_send += "<ACQS_AMOUNT>3000000</ACQS_AMOUNT>"+"\n";
            xml_string_to_send += "<TRNSFR_DE>20210228</TRNSFR_DE>"+"\n";
            xml_string_to_send += "<TRDE_CNTRCT_DE>20210228</TRDE_CNTRCT_DE>"+"\n";
            xml_string_to_send += "<CAR_DELY_DE>20210228</CAR_DELY_DE>"+"\n";
            xml_string_to_send += "<SELLER_RELATE_SE_CODE>2</SELLER_RELATE_SE_CODE>"+"\n";
            xml_string_to_send += "<PAY_TRGET_GUBUN>2</PAY_TRGET_GUBUN>"+"\n";
            xml_string_to_send += "<ORGNZT_CODE>6101</ORGNZT_CODE>"+"\n";
            xml_string_to_send += "<VIN>KMHFH41NBEA316620</VIN>"+"\n";
            xml_string_to_send += "<STMPTAX_ELCTRN_PAY_NO>0000000000123456789</STMPTAX_ELCTRN_PAY_NO>"+"\n";
            xml_string_to_send += "<MNDT_AHRZT></MNDT_AHRZT>"+"\n";
            xml_string_to_send += "<GRTE_AHRZT></GRTE_AHRZT>"+"\n";
            xml_string_to_send += "<ASGR_AHRZT></ASGR_AHRZT>"+"\n";
            xml_string_to_send += "<TAXT_SE_CODE>03</TAXT_SE_CODE>"+"\n";
            xml_string_to_send += "</contents>";
        }
        
		HttpPost post = new HttpPost(url);
	    post.setHeader("Content-Type", ContentType);
		List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
		urlParameters.add(new BasicNameValuePair("xml", xml_string_to_send));
	
		HttpEntity postParams = new UrlEncodedFormEntity(urlParameters,"UTF-8");
		post.setEntity(postParams);
		/*
		if(true){
			throw new Exception("이전신청오류발생");
		}
		*/
	    CloseableHttpResponse httpResponse = http.execute(post);
	    try{
	        HttpEntity res = httpResponse.getEntity();
	        BufferedReader br = new BufferedReader(new InputStreamReader(res.getContent(), Charset.forName("UTF-8")));
	        String buffer = null;
	        while( (buffer = br.readLine())!=null ){
	            result.append(buffer).append("\r\n");
	        }
	        System.out.println("------------------------------------------------------->STEPC"+result);
	    }catch(Exception e) {
	    	System.out.println("------------------------------------------------------->STEPD");
	    	e.printStackTrace();  
			result = new StringBuffer();
	    	result.append("error"+e.getMessage());
	    }finally{
	    	if(httpResponse != null){
	    		httpResponse.close();
	    	}
	    }
	}catch(Exception e) {
		System.out.println("------------------------------------------------------->STEPE");
		e.printStackTrace();   
		result = new StringBuffer();
    	result.append("error"+e.getMessage());
	}finally{
		if(http != null){
			http.close();
		}
	}
	System.out.println("------------------------------------------------------->STEPF["+result+"]");
%>
<%--=result.toString().replaceAll("<\\?xml.*?>","").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\\n", "<br>") --%>
<%=result.toString()%>