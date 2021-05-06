package mocaframework.com.cmm;

import java.io.File;
import java.io.FileReader;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

//import org.apache.log4j.Logger;
 
public class P {
  private static HashMap<String, Properties> propses;
  private static final Logger logger = LoggerFactory.getLogger(P.class);
  //static Logger logger = Logger.getLogger("Pp");
  
  public static Map get(String prop){
	  if(propses == null) {
		  if(load(prop) == true){
			  return propses.get(prop);
		  }
		  return null;
	  }else {
		  return propses.get(prop);
	  }
  }
  
  public static String get(String prop, String key){
    if(load(prop) == true){
      return propses.get(prop).getProperty(key);
    }
    else{
      return "";
    }
  }
   
  /**
   * Properties 가 적재되어 있는지 확인
   * 적재되어 있지 않다면 적재함.
   * properties 파일이 없을 경우 false return.
   *
   * @param prop
   * @return
   */
  private static boolean load(String prop){
   
    // 초기화
    if(propses == null){ init(); }
     
    if(propses.containsKey(prop)){ return true; }
    else{
      try{
    	  File f = new File(prop+".properties");
    	  System.out.println("f:"+f.getCanonicalPath());
          FileReader resources= new FileReader(prop+".properties");
          Properties props = new Properties();
          props.load(resources);
          propses.put(prop, props);
          return true;         
      } catch(Exception e){
    	  e.printStackTrace();
    	  return false;
      }
    }
  }
   
  /**
   * 초기화 
   */
  private static void init(){
    propses = new HashMap<String, Properties>();
  }
}