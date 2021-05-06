package egovframework.FileLink.service;

import java.io.Serializable;


@SuppressWarnings("serial")
public class FileVO implements Serializable {

	private int fileSeq; // 파일 번호
    private String fileName; // 파일 명
    private String fileMemo; // 파일 정보
    private String fileType; // 파일 타입
    private int fileSize; // 파일 사이즈
    private String filePath; // 업로드 된 파일 경로
    private String filePathOrg; // 실제 파일 경로 : URL 정보
    private int isOpen; // 공개여부
    private String createDate; // 생성일자
    private String createId; // 생성자 아이디
     
    public String toString(){
        StringBuffer sb = new StringBuffer();
        sb.append("### FileBean.toString() ###");
        sb.append(" fileSeq :"+ this.fileSeq);
        sb.append(" fileName :"+ this.fileName);
        sb.append(" fileMemo :"+ this.fileMemo);
        sb.append(" fileType :"+ this.fileType);
        sb.append(" fileSize :"+ this.fileSize);
        sb.append(" filePath :"+ this.filePath);
        sb.append(" filePathOrg :"+ this.filePathOrg);
        sb.append(" isOpen :"+ this.isOpen);
        sb.append(" createDate :"+ this.createDate);
        sb.append(" createId :"+ this.createId);
        return sb.toString();
    }
     
    public String getFilePathOrg() {
        return filePathOrg;
    }
 
    public void setFilePathOrg(String filePathOrg) {
        this.filePathOrg = filePathOrg;
    }
 
    public String getCreateId() {
        return createId;
    }
 
    public void setCreateId(String createId) {
        this.createId = createId;
    }
 
    public int getFileSeq() {
        return fileSeq;
    }
 
    public void setFileSeq(int fileSeq) {
        this.fileSeq = fileSeq;
    }
 
    public String getFileName() {
        return fileName;
    }
 
    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
 
    public String getFileMemo() {
        return fileMemo;
    }
 
    public void setFileMemo(String fileMemo) {
        this.fileMemo = fileMemo;
    }
 
    public String getFileType() {
        return fileType;
    }
 
    public void setFileType(String fileType) {
        this.fileType = fileType;
    }
 
    public int getFileSize() {
        return fileSize;
    }
 
    public void setFileSize(int fileSize) {
        this.fileSize = fileSize;
    }
 
    public String getFilePath() {
        return filePath;
    }
 
    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }
 
    public int getIsOpen() {
        return isOpen;
    }
 
    public void setIsOpen(int isOpen) {
        this.isOpen = isOpen;
    }
 
    public String getCreateDate() {
        return createDate;
    }
 
    public void setCreateDate(String createDate) {
        this.createDate = createDate;
    }
	
}
