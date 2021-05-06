package mocaframework.com.cmm;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

public class Big {

	public static void main(String[] args) {
        try{
            //파일을 분할하여 저장한다(100메가)
            //splitFile("C:\\\\Temp_n\\\\",1024*1024*1*100, "C:\\\\Temp\\\\20190103_349_ACB2019_12_08_팀모카.zip","part");
            
            
            
            
            //분할된 파일을 합친다
            //combineFile("20190103_349_ACB2019_12_08_팀모카.zip", "C:\\\\Temp_n\\\\","part");
	     }catch(Exception e){
	            e.printStackTrace();
	     }
	}
	
	public static int splitFile(String nFilePath, int maxFileSize,File file,String nFileName){
		FileInputStream fi = null;
		FileOutputStream fo = null;
		int fileIdx = 0;
        try {
        	   fi = new FileInputStream(file);
               int readCnt = 0;
               int totCnt = 0;
               
               BufferedInputStream bfi = new BufferedInputStream(fi);
               byte[] readBuffer = new byte[2048];
               File nFile = new File(nFilePath + nFileName+"_"+"0"+"._tmp");
               fo = new FileOutputStream(nFile);
               do {
                      readCnt = bfi.read(readBuffer);
                      if(readCnt == -1){
                            break;
                      }
                      fo.write(readBuffer,0,readCnt);
                      totCnt += readCnt;
                      if(totCnt%maxFileSize==0){
                            fo.flush();
                            fo.close();
                            File nfile = new File(nFilePath+ nFileName+"_"+(++fileIdx)+"._tmp");
                            fo = new FileOutputStream(nfile);
                      }

               } while (true);
        } catch (Exception e) {
               e.printStackTrace();
        }finally {
        	if(fi != null) {
        		try {
        			fi.close();
        		}catch(Exception ex_fi) {
        			
        		}
        	}
        	if(fo != null) {
        		try {
        			fo.flush();
        			fo.close();
        		}catch(Exception ex_fi) {
        			
        		}
        	}  
        	System.out.println("##########분할완료##########");
        }
        return (fileIdx+1);
  }
	
	
  public static void splitFile(String nFilePath, int maxFileSize,String filePath,String nFileName){
		File file = new File(filePath);
		splitFile(nFilePath, maxFileSize,file,nFileName);
  }



  public static String combineFile(String oriFileName, String nFilePath,String nFileName,int cnt) {
	  	FileOutputStream nFo = null;
        File nFiles = new File(nFilePath);
        System.out.println("합치기시작->nFilePath:"+nFilePath);
        String targetFile = nFilePath.replaceAll("receipt_bigsize", "receipt")+"/"+oriFileName;
        
		File r = new File(nFilePath.replaceAll("receipt_bigsize", "receipt"));
		if(!r.exists()) {
			r.mkdirs();
		}
		
		
        FileInputStream nFi=null;
        File _targetFile = new File(targetFile);
        
        
        try {

            File[] files = nFiles.listFiles();
            nFo = new FileOutputStream(targetFile);
            System.out.println("합치기시작->cnt:"+cnt);
            
            for(int i=0;i<cnt;i++){
            	  
                   nFi = new FileInputStream(nFilePath+"/"+nFileName+"_"+i+"._tmp");
                   byte[] buf = new byte[2048];
                   int readCnt = 0;
                   while((readCnt =  nFi.read(buf)) >-1){
                	   nFo.write(buf,0,readCnt);
                   }
                   nFi.close();
                   File aFile = new File(nFilePath+"/"+nFileName+"_"+i+"._tmp");
                   aFile.delete();
            }
        }catch(Exception e) {
        	e.printStackTrace();
        }finally {
        	if(nFi != null) {
        		try {
        			nFi.close();
        		}catch(Exception e) {
        			e.printStackTrace();
        		}
        	}
        	if(nFo != null) {
        		try {
        			nFo.flush();
        			nFo.close();
        		}catch(Exception e) {
        			e.printStackTrace();
        		}
        	}
        }
        System.out.println("##########합치기완료##########"+targetFile);
        return targetFile;
  }
  
  
}
