package mocaframework.com.cmm.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.View;

import com.fasterxml.jackson.databind.ObjectMapper;

import egovframework.rte.fdl.property.EgovPropertyService;

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
public class EfmsComUtlController {

	/** EgovPropertyService */
	@Resource(name = "propertiesService")
	protected EgovPropertyService propertiesService;

	@Autowired
    private View jsonview;
	
	/**
	 * grid sample data
	 */
	@RequestMapping(value = "/grid_data_json.do")
	public View grid_data(@RequestParam Map param, ModelMap map) {
		List list = new ArrayList();
		for(int i=0; i < 100; i++) {
			Map row = new HashMap();
			row.put("name","김세창"+i);
			row.put("height","180cm");
			row.put("weight","75kg");
			row.put("age","048");
			row.put("nation","00K");
			row.put("position","대표");
			list.add(row);
		}
        map.addAttribute("list", list);
        return jsonview;
	}
	
	/**
	 * 공통코드
	 */
/*	@RequestMapping(value = "/code_json.do")	
	public View getCode(@RequestParam Map param, ModelMap map) {
		Map resultMap = new HashMap();
		try {
			ObjectMapper mapper = new ObjectMapper(); 

			Map<String, Object> bodyObj = new HashMap<String, Object>(); 
			bodyObj = mapper.readValue(param.get("body").toString(), HashMap.class); 
			Map configMap = (Map)bodyObj.get("config");//:{grd_1.age={code=age, allOption={label=-선택-, value=}}, grd_1.nation={code=nation, allOption={label=*, value=}}, cmb_1={code=nation, allOption={label=전체, value=}}}
			Set st = configMap.keySet();
			Iterator it = st.iterator();
			while(it.hasNext()) {
				Object key = it.next();
				Map value = (Map)configMap.get(key);
				String code = (String)value.get("code");
				List codeList = getCode(code);
				resultMap.put(key, codeList);
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
        map.addAttribute("map", resultMap);
        return jsonview;
	}*/
	
	/**
	 * 공통코드
	 */
	public List getCode(String code) {
		List list = new ArrayList();
		if("age".equalsIgnoreCase(code)  ) {
			for(int i=0; i < 100; i++) {
				Map row = new HashMap();
				row.put("cd", i+"");
				row.put("nm", i+"세");
				list.add(row);
			}
		}else if("nation".equalsIgnoreCase(code)  ) {
			Map row = new HashMap();
			row.put("cd", "00K");
			row.put("nm", "한국");
			list.add(row);
			row = new HashMap();
			row.put("cd", "00B");
			row.put("nm", "영국");			
			list.add(row);
			row = new HashMap();
			row.put("cd", "00A");
			row.put("nm", "미국");			
			list.add(row);			
		}
		return list;
	}

}