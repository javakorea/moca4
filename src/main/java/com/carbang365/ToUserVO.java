package com.carbang365;

public class ToUserVO {
	
	private String idx = "";                              //	고객id
	private String idKakao = "";						  //	카카오ID
	private String idNaver = "";                          //	네이버ID
	private String idFacebook = "";                       //	페이스북ID
	private String password = "";                         //	자동로그인에 사용되는 임시 비밀번호 보관, 수동 로그인시 랜덤 생성된 비밀번호 재할당
	private String email = "";                            //	고객이메일
	private String name = "";                             //	고객명
	private String sex = "";                              //	[성별] 1 : 남성 / 2 : 여성
	private String birthDate = "";                        //	생년월일
	private String mobilePhone = "";                      //	휴대폰번호
	private String mobileCarrierMajor = "";               //	[이동통신사] 1 : SKT / 2 : KT / 3 : LG / 4: 알뜰폰(추가) / 0 : 마이그레이션 사용자 중 통신사 정보가 없는 사용자 
	private String homeAddress = "";                      //	집주소
	private String homePhone = "";                        //	집전화번호
	private String jobName = "";                          //	직업명
	private String jobCompany = "";                       //	회사명
	private String jobAddress = "";                       //	회사주소
	private String jobPhone = "";                         //	회사전화번호
	private String profileImage = "";                     //	프로필이미지
	private String profileCertification = "";             //
	private String profileTemporaryCertification = "";    //
	private String fCMToken = "";                         //	푸쉬 알림 발송용 Firebase Token
	private String deviceID = "";                         //	휴대폰ID(휴대폰UUID인지 확인..)
	private String osType = "";                           //	[OS 종류] 1 : 안드로이드 / 2 : iOS
	private String enabled = "";                          //	[차단 사용자 설정] 0 : 로그인 차단 / 2 : 로그인 가능
	private String loginTokenRefreshTime = "";            //	임시 로그인 비밀번호 사용가능 기간 (현재 미사용, 추후 상황에 따라 적용 예정)
	private String loginTime = "";                        //	[최종 로그인 시간]
	private String loginCount = "";                       //	[총 로그인 횟수]
	private String secretKey = "";                        //	사용자 인증정보 암호화 키 (여기에 보안번호 들어가면 될듯)
	private String registerTime = "";                     //	등록일시
	private String updateTime = "";                       //	수정일시
	                                                       
	/* 개인소유권이전 추가항목 */                          		   
	private String corRstrNumber = "";                     //	법인등록번호
	private String leaveYn = "";                           //	적용유무(탈퇴여부)(Y:탈퇴)
	private String leaveTime = "";                         //	탈퇴일
	private String leaveReqId = "";						   //	탈퇴신청자
	private String joinType = "";						   //	가입구분(1:개인소유권이전, 2:카방) 추후 고객정보 통합관리를 위함. 현재는 app 가입시 다 1
	
	private String loginFailCount = "0";				   //   로그인실패회수
	
	public String getIdx() {
		return idx;
	}
	public String getLoginFailCount() {
		return loginFailCount;
	}
	public void setLoginFailCount(String loginFailCount) {
		this.loginFailCount = loginFailCount;
	}
	public void setIdx(String idx) {
		this.idx = idx;
	}
	public String getIdKakao() {
		return idKakao;
	}
	public void setIdKakao(String idKakao) {
		this.idKakao = idKakao;
	}
	public String getIdNaver() {
		return idNaver;
	}
	public void setIdNaver(String idNaver) {
		this.idNaver = idNaver;
	}
	public String getIdFacebook() {
		return idFacebook;
	}
	public void setIdFacebook(String idFacebook) {
		this.idFacebook = idFacebook;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getSex() {
		return sex;
	}
	public void setSex(String sex) {
		this.sex = sex;
	}
	public String getBirthDate() {
		return birthDate;
	}
	public void setBirthDate(String birthDate) {
		this.birthDate = birthDate;
	}
	public String getMobilePhone() {
		return mobilePhone;
	}
	public void setMobilePhone(String mobilePhone) {
		this.mobilePhone = mobilePhone;
	}
	public String getMobileCarrierMajor() {
		return mobileCarrierMajor;
	}
	public void setMobileCarrierMajor(String mobileCarrierMajor) {
		this.mobileCarrierMajor = mobileCarrierMajor;
	}
	public String getHomeAddress() {
		return homeAddress;
	}
	public void setHomeAddress(String homeAddress) {
		this.homeAddress = homeAddress;
	}
	public String getHomePhone() {
		return homePhone;
	}
	public void setHomePhone(String homePhone) {
		this.homePhone = homePhone;
	}
	public String getJobName() {
		return jobName;
	}
	public void setJobName(String jobName) {
		this.jobName = jobName;
	}
	public String getJobCompany() {
		return jobCompany;
	}
	public void setJobCompany(String jobCompany) {
		this.jobCompany = jobCompany;
	}
	public String getJobAddress() {
		return jobAddress;
	}
	public void setJobAddress(String jobAddress) {
		this.jobAddress = jobAddress;
	}
	public String getJobPhone() {
		return jobPhone;
	}
	public void setJobPhone(String jobPhone) {
		this.jobPhone = jobPhone;
	}
	public String getProfileImage() {
		return profileImage;
	}
	public void setProfileImage(String profileImage) {
		this.profileImage = profileImage;
	}
	public String getProfileCertification() {
		return profileCertification;
	}
	public void setProfileCertification(String profileCertification) {
		this.profileCertification = profileCertification;
	}
	public String getProfileTemporaryCertification() {
		return profileTemporaryCertification;
	}
	public void setProfileTemporaryCertification(String profileTemporaryCertification) {
		this.profileTemporaryCertification = profileTemporaryCertification;
	}
	public String getfCMToken() {
		return fCMToken;
	}
	public void setfCMToken(String fCMToken) {
		this.fCMToken = fCMToken;
	}
	public String getDeviceID() {
		return deviceID;
	}
	public void setDeviceID(String deviceID) {
		this.deviceID = deviceID;
	}
	public String getOsType() {
		return osType;
	}
	public void setOsType(String osType) {
		this.osType = osType;
	}
	public String getEnabled() {
		return enabled;
	}
	public void setEnabled(String enabled) {
		this.enabled = enabled;
	}
	public String getLoginTokenRefreshTime() {
		return loginTokenRefreshTime;
	}
	public void setLoginTokenRefreshTime(String loginTokenRefreshTime) {
		this.loginTokenRefreshTime = loginTokenRefreshTime;
	}
	public String getLoginTime() {
		return loginTime;
	}
	public void setLoginTime(String loginTime) {
		this.loginTime = loginTime;
	}
	public String getLoginCount() {
		return loginCount;
	}
	public void setLoginCount(String loginCount) {
		this.loginCount = loginCount;
	}
	public String getSecretKey() {
		return secretKey;
	}
	public void setSecretKey(String secretKey) {
		this.secretKey = secretKey;
	}
	public String getRegisterTime() {
		return registerTime;
	}
	public void setRegisterTime(String registerTime) {
		this.registerTime = registerTime;
	}
	public String getUpdateTime() {
		return updateTime;
	}
	public void setUpdateTime(String updateTime) {
		this.updateTime = updateTime;
	}
	public String getCorRstrNumber() {
		return corRstrNumber;
	}
	public void setCorRstrNumber(String corRstrNumber) {
		this.corRstrNumber = corRstrNumber;
	}
	public String getLeaveYn() {
		return leaveYn;
	}
	public void setLeaveYn(String leaveYn) {
		this.leaveYn = leaveYn;
	}
	public String getLeaveTime() {
		return leaveTime;
	}
	public void setLeaveTime(String leaveTime) {
		this.leaveTime = leaveTime;
	}
	public String getLeaveReqId() {
		return leaveReqId;
	}
	public void setLeaveReqId(String leaveReqId) {
		this.leaveReqId = leaveReqId;
	}
	public String getJoinType() {
		return joinType;
	}
	public void setJoinType(String joinType) {
		this.joinType = joinType;
	}
	
	@Override
	public String toString() {
		return "ToUserVO [idx=" + idx + ", idKakao=" + idKakao + ", idNaver=" + idNaver + ", idFacebook=" + idFacebook
				+ ", password=" + password + ", email=" + email + ", name=" + name + ", sex=" + sex + ", birthDate="
				+ birthDate + ", mobilePhone=" + mobilePhone + ", mobileCarrierMajor=" + mobileCarrierMajor
				+ ", homeAddress=" + homeAddress + ", homePhone=" + homePhone + ", jobName=" + jobName + ", jobCompany="
				+ jobCompany + ", jobAddress=" + jobAddress + ", jobPhone=" + jobPhone + ", profileImage="
				+ profileImage + ", profileCertification=" + profileCertification + ", profileTemporaryCertification="
				+ profileTemporaryCertification + ", fCMToken=" + fCMToken + ", deviceID=" + deviceID + ", osType="
				+ osType + ", enabled=" + enabled + ", loginTokenRefreshTime=" + loginTokenRefreshTime + ", loginTime="
				+ loginTime + ", loginCount=" + loginCount + ", secretKey=" + secretKey + ", registerTime="
				+ registerTime + ", updateTime=" + updateTime + ", corRstrNumber=" + corRstrNumber + ", leaveYn="
				+ leaveYn + ", leaveTime=" + leaveTime + ", leaveReqId=" + leaveReqId + ", joinType=" + joinType + "]";
	}
	

}
