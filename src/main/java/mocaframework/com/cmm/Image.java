package mocaframework.com.cmm;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.font.FontRenderContext;
import java.awt.geom.Rectangle2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import javax.imageio.ImageIO;

public class Image {
	
	public static String imgAddText(String originPath,String resultPath,Map param) {
		long startTime = System.currentTimeMillis();
		print("start make new feed image---");
System.out.println("==============================================Image");
		String text = "aaa";

		// String text="가가가가가가가가가가가가가가가가가가가가가가가가가가가가가가";


		// 저장할 파일명 생성
		File folder = new File(resultPath);
		print("folder.exists()"+folder.exists());
		if(!folder.exists()) {
			folder.mkdirs();	
		}
		String fName = resultPath ;
		String fileFullPath = fName + ".jpg";

		File makeImage = new File( fileFullPath);

		print("saved New image name : " + makeImage.toString());

		// 문구 작성 할 이미지 불러오기

		File loadImage = new File(originPath);

		BufferedImage bi = null;

		try {

			bi = ImageIO.read(loadImage);

		} catch (IOException e) {

			print("이미지 불러오다가 에러 나쓔..ㅜㅜ");

			e.printStackTrace();

		}

		int imgWidth = bi.getWidth();

		int imgHeight = bi.getHeight();

		print("loadImage\nwidth : " + imgWidth + ", height : " + imgHeight);

		Graphics2D g2 = null;

		g2 = bi.createGraphics();

		// text에 적용할 폰트 생성, 아래 폰트는 시스템에 설치 되어 있어야 사용할 수 있음

		Font font = new Font("바탕체", 0, 14);

		// 가운데 정렬하기 위해, text의 width구하기

		FontRenderContext frc = new FontRenderContext(null, true, true);

		Rectangle2D r2 = font.getStringBounds(text, frc);

		int textWidth = (int) r2.getWidth();

		float paddingleft = 0;
		float paddingTop = 0;

		// 입력하는 문자의 가용 넓이

		int textWide = 439;

		paddingleft = 138*5;
		paddingTop = 20*26;

		print("textWidth : " + textWidth);

		print("paddingleft : " + paddingleft);
		print("paddingTop : " + paddingTop);
		// 폰트 색상 설정

		

		// 폰트 종류 설정

		g2.setFont(font);

		Set ks = param.keySet();
		Iterator it = ks.iterator();
		while(it.hasNext()) {
			String key = (String)it.next();
			// 이미지에 텍스트 사입. (text,x축,y축)
			String mesuNms = (String)param.get(key);
			String[] mesuNmArr = mesuNms.split(":");
			if(key.equals("total")) {
				g2.setColor(Color.WHITE);
			}else {
				g2.setColor(Color.black);
			}
			
			if(mesuNmArr.length > 3) {

				Rectangle2D r3 = font.getStringBounds(mesuNmArr[0], frc);
				int textWidth3 = (int) r3.getWidth();
				g2.drawString(mesuNmArr[0], Float.parseFloat(mesuNmArr[1])-Float.parseFloat(textWidth3+"") , Float.parseFloat(mesuNmArr[2]));
			}else {
				g2.drawString(mesuNmArr[0], Float.parseFloat(mesuNmArr[1]) , Float.parseFloat(mesuNmArr[2]));
			}
			
		}

		g2.dispose();

		try {

			ImageIO.write(bi, "jpg", makeImage);

		} catch (IOException e) {

			System.out.print("새로운 이미지 저장하다가 에러 나쓔..ㅜㅜ");

			e.printStackTrace();

		}

		print("text length : " + text.length());

		print("end make image");

		long endTime = System.currentTimeMillis();

		print("currentTimeMillis()형태\n시작시간 : " + startTime + ", 종료시간 : " + endTime);

		print("이미지 생성하는데 걸린 시간 [" + ((endTime - startTime) / 1000.0) + "]");
		
		return fName;
	}

	public static void print(String str) {
		System.out.print("\n" + str + "\n");
	}
}
