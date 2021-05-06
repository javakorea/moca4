package egovframework.batch;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class FileFnc {
	public static void copy(File sourceF, File targetF) {
		File[] target_file = sourceF.listFiles();
		for (File file : target_file) {
			File temp = new File(targetF.getAbsolutePath() + File.separator + file.getName());
			if (file.isDirectory()) {
				temp.mkdir();
				copy(file, temp);
			} else {
				FileInputStream fis = null;
				FileOutputStream fos = null;
				try {
					fis = new FileInputStream(file);
					fos = new FileOutputStream(temp);
					byte[] b = new byte[4096];
					int cnt = 0;
					while ((cnt = fis.read(b)) != -1) {
						fos.write(b, 0, cnt);
					}
				} catch (Exception e) {
					e.printStackTrace();
				} finally {
					try {
						fis.close();
						fos.close();
					} catch (IOException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}

				}
			}
		}
	}

	public static void delete(String path) {

		System.out.println("delete Path : " + path);
		File folder = new File(path);
		try {
			
			if (folder.exists()) {
				File[] folder_list = folder.listFiles();
				System.out.println(folder_list.length);
				for (int i = 0; i < folder_list.length; i++) {
					if (folder_list[i].isFile()) {
						System.out.println("1 :["+folder_list[i].getPath()+"]");
						;
						if(folder_list[i].delete()){ 
							System.out.println("파일삭제 성공"); 
						}else{ 
							System.out.println("파일삭제 실패"); 
						}

					} else {
						System.out.println("2 :["+folder_list[i].getPath()+"]");
						delete(folder_list[i].getPath());
					}
					folder_list[i].delete();
				}
			}
		} catch (Exception e) {
			e.getStackTrace();
		}
	}
	
	public static String extractStringHashSHA256(String str){
        String SHA = "";
        try{
            MessageDigest sh = MessageDigest.getInstance("SHA-256");
            sh.update(str.getBytes());
            byte byteData[] = sh.digest();
            StringBuffer sb = new StringBuffer();
            for(int i = 0 ; i < byteData.length ; i++){
                sb.append(Integer.toString((byteData[i]&0xff) + 0x100, 16).substring(1));
            }
            SHA = sb.toString();
             
        }catch(NoSuchAlgorithmException e){
            e.printStackTrace();
            SHA = null;
        }
        return SHA;
    }
     
    public static String extractFileHashSHA256(String filename) throws Exception {
         
        String SHA = "";
        int buff = 16384;
        try {
            RandomAccessFile file = new RandomAccessFile(filename, "r");
 
            MessageDigest hashSum = MessageDigest.getInstance("SHA-256");
 
            byte[] buffer = new byte[buff];
            byte[] partialHash = null;
 
            long read = 0;
 
            // calculate the hash of the hole file for the test
            long offset = file.length();
            int unitsize;
            while (read < offset) {
                unitsize = (int) (((offset - read) >= buff) ? buff : (offset - read));
                file.read(buffer, 0, unitsize);
 
                hashSum.update(buffer, 0, unitsize);
 
                read += unitsize;
            }
 
            file.close();
            partialHash = new byte[hashSum.getDigestLength()];
            partialHash = hashSum.digest();
             
            StringBuffer sb = new StringBuffer();
            for(int i = 0 ; i < partialHash.length ; i++){
                sb.append(Integer.toString((partialHash[i]&0xff) + 0x100, 16).substring(1));
            }
            SHA = sb.toString();
 
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
         
        return SHA;
    }
    
    
    
	public static void copy2(File sourceF, File targetF, boolean delete) {
		File[] target_file = sourceF.listFiles();
		for (File file : target_file) {
			File temp = new File(targetF.getAbsolutePath() + File.separator + file.getName());
			if (file.isDirectory()) {
				temp.mkdir();
				copy2(file, temp, delete);
			} else {
				FileInputStream fis = null;
				FileOutputStream fos = null;
				try {
					fis = new FileInputStream(file);
					fos = new FileOutputStream(temp);
					byte[] b = new byte[4096];
					int cnt = 0;
					while ((cnt = fis.read(b)) != -1) {
						fos.write(b, 0, cnt);
					}
				} catch (Exception e) {
					e.printStackTrace();
				} finally {
					try {
						fis.close();
						fos.close();
						if(file != null) {
							//file.delete();
						}
					} catch (IOException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}

				}
			}
		}
	}

	public static void copyFile2(File sourceFile, File targetF, boolean delete) {
			String apath = targetF.getAbsolutePath();
			File temp = new File(targetF.getAbsolutePath() + File.separator + sourceFile.getName());
			if (sourceFile.isDirectory()) {
				temp.mkdirs();
				copyFile2(sourceFile, temp, delete);
			} else {
				FileInputStream fis = null;
				FileOutputStream fos = null;
				try {
					fis = new FileInputStream(sourceFile);
					fos = new FileOutputStream(temp);
					byte[] b = new byte[4096];
					int cnt = 0;
					while ((cnt = fis.read(b)) != -1) {
						fos.write(b, 0, cnt);
					}
				} catch (FileNotFoundException fnfe) {
					fnfe.printStackTrace();
				} catch (Exception e) {
					e.printStackTrace();	

				} finally {
					try {
						fis.close();
						fos.close();
						if(sourceFile != null) {
							sourceFile.delete();
						}
					} catch (IOException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
	}

	
	public static void delete2(String path) {

		System.out.println("delete Path : " + path);
		File folder = new File(path);
		try {
			
			if (folder.exists()) {
				File[] folder_list = folder.listFiles();
				System.out.println(folder_list.length);
				for (int i = 0; i < folder_list.length; i++) {
					if (folder_list[i].isFile()) {
						System.out.println("1 :["+folder_list[i].getPath()+"]");
						;
						if(folder_list[i].delete()){ 
							System.out.println("파일삭제 성공"); 
						}else{ 
							System.out.println("파일삭제 실패"); 
						}

					} else {
						System.out.println("2 :["+folder_list[i].getPath()+"]");
						delete2(folder_list[i].getPath());
					}
					folder_list[i].delete();
				}
			}
		} catch (Exception e) {
			e.getStackTrace();
		}
	}

}
