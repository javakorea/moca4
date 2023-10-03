package mocaframework.com.cmm;

import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class M {

	public static void main(String[] args) throws Exception {
		// TODO Auto-generated method stub
/*		Curl curl = new Curl();
		Map map = new HashMap();
		map.put("url", "https://teammoca.tistory.com/");
		String result =Util.curl("https://teammoca.tistory.com/",new HashMap());
		System.out.println("result:"+result);*/
		
		
		//HttpEntity entity = builder.build();
		
/*		HttpClient client = HttpClients.createDefault();
		HttpPost post = new HttpPost("https://teammoca.tistory.com/");
		//post.setEntity(entity);
		
		HttpResponse res = client.execute(post);
		
		String result = "";
		if(res != null){
			BufferedReader in = new BufferedReader(new InputStreamReader(res.getEntity().getContent(), "UTF-8"));
			String buffer = null;
			while((buffer = in.readLine())!=null){
				result += buffer;
			}
			in.close();
		}
		System.out.println("result2:"+result);*/
		
		
		URL url = new URL("https://teammoca.tistory.com");
		URLConnection conn = url.openConnection();
		InputStream is = conn.getInputStream();
		Scanner scan = new Scanner(is);
		StringBuffer sb = new StringBuffer();
		while(scan.hasNext())
		{
			sb.append(scan.nextLine()+"\n");
			
		}
		String s = sb.toString();
		s = s.replaceAll("<a href=\"/", "<a target=\"_blank\" href=\"https://teammoca.tistory.com/\"");
		List list = new ArrayList();
		String ptnStr = "<div\\s+class=\"post-item\">.*?</div>";
		Pattern p = Pattern.compile(ptnStr,Pattern.CASE_INSENSITIVE | Pattern.DOTALL );
		Matcher m = p.matcher(s);
		int i=0;
		while(m.find()) {
			list.add(m.group());
			i++;
		}
		System.out.println("list.size:"+list.size());
		System.out.println("list:"+list);
		scan.close();
	}

}
