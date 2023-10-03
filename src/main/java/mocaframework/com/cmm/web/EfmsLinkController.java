package mocaframework.com.cmm.web;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.util.store.FileDataStoreFactory;

/**
 * 공통유틸리티성 작업을 위한 Controller 클래스
 * @author TEAM MOCA KSC
 * @since 2019.09.18
 * @version 1.0
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      수정자          수정내용
 *  -------    --------    ---------------------------
 *  2019.09.18  KSC            최초 생성
 *
 *  </pre>
 */
@Controller
public class EfmsLinkController {

	
    private static final String APPLICATION_NAME = "teammoca";
    private static final String TOKENS_DIRECTORY_PATH = "tokens";

    /**
     * Global instance of the scopes required by this quickstart.
     * If modifying these scopes, delete your previously saved tokens/ folder.
     */
    private static final String CREDENTIALS_FILE_PATH = "/client_secret_191058282154-kmn71d0j1fqnstu9joe2od2rvbhm7hot.apps.googleusercontent.com.json";

	@RequestMapping(value = "/googleapi/response.do")
	public String googleapi_response(@RequestParam Map param,HttpServletRequest request, ModelMap model) throws Exception {
        System.out.println("response.do---------------------------request.getParameterMap():"+request.getParameterMap());
        Map m = request.getParameterMap();
        Set st = m.keySet();
        Iterator it = st.iterator();
        while(it.hasNext()) {
        	String key = it.next().toString();
        	System.out.println(key+":::"+m.get(key));
        }        
        return "googleapi/response";
	}	
		
	@RequestMapping(value = "/Callback")
	public String Callback(@RequestParam Map param,HttpServletRequest request, ModelMap model) throws Exception {
        System.out.println("Callback---------------------------request.getParameterMap():"+request.getParameterMap());
        Map m = request.getParameterMap();
        Set st = m.keySet();
        Iterator it = st.iterator();
        while(it.hasNext()) {
        	String key = it.next().toString();
        	System.out.println(key+":::"+m.get(key));
        }        
        return "googleapi/response";
	}		
	
	
	
	
	
}