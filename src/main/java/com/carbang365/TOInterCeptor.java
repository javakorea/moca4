package com.carbang365;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import egovframework.com.cmm.LoginVO;

public class TOInterCeptor extends HandlerInterceptorAdapter {
	private static final Logger LOGGER = LoggerFactory.getLogger(TOInterCeptor.class);
	boolean testMode = true;
	@Autowired
	TOMapper TOMapper;

	@Autowired
	TOServiceImpl toService;
	 
	List<String> urls;
	 
	 public void setUrls(List urls) {
	  this.urls = urls;
	 }
	 
	@Override
	 public boolean preHandle(HttpServletRequest request,
	   HttpServletResponse response, Object handler) throws Exception {
			String uri = request.getRequestURI();
			String context = request.getContextPath();
			uri = uri.replaceAll(context, "");
			LOGGER.debug(">>> preHandle <<<");
			LOGGER.debug("request.context : "+context);
			LOGGER.debug("request.getRequestURI :"+uri);
			ToUserVO userVo = (ToUserVO)request.getSession().getAttribute("userInfo");
			LoginVO LoginVO = (LoginVO)request.getSession().getAttribute("LoginVO");
			if(LoginVO != null) {
				return true;
			}
			if(userVo != null) {
				Map paramMap = new HashMap();
				paramMap.put("idx", userVo.getIdx());
				LOGGER.debug(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>paramMap>>>>>>>>>>>>>>>>>>>>>"+paramMap);
				ToUserVO userVoIsLeaveYn = TOMapper.selectToUsersLeaveYn(paramMap); 
				if("Y".equalsIgnoreCase(userVoIsLeaveYn.getLeaveYn()) ) {
					LOGGER.debug("탈퇴회원:>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>paramMap>>>>>>>>>>>>>>>>>>>>>"+paramMap);
					request.getSession().invalidate();
					response.setContentType("application/json");
					response.setCharacterEncoding("UTF-8");
					String urls_string = urls.toString();
					if(urls_string.indexOf(uri) > -1) {
						LOGGER.debug("허용URL:>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+urls_string+">>>>>>>>>>>>>>>>>>>>>"+uri);
						response.getWriter().write("{\"allow\":\"true\"}");
					}else {
						LOGGER.debug("차단URL:>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+urls_string+">>>>>>>>>>>>>>>>>>>>>"+uri);
						response.getWriter().write("{\"allow\":\"false\"}");
					}
					return false;
				}else {
					LOGGER.debug("회원:>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>["+userVoIsLeaveYn.getLeaveYn()+"]");
				}
				LOGGER.debug(">>>>>>>>>>>>>>>>>>>>>>userVoIsLeaveYn>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+userVoIsLeaveYn);
				LOGGER.debug(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
				LOGGER.debug(">>>>>>>>>>>>>>>>>>>>>>>>urls2>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+urls);
				LOGGER.debug(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
				LOGGER.debug(">>>>>>>>>>>>>>>>>>>>>>>>>>userVo>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+userVo);
			}else {
				LOGGER.debug(">>>userVo is null");
			}
		  return true;
	 }
	
	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {
		LOGGER.debug("TO interceptor postHandle ~~");
	}

}
