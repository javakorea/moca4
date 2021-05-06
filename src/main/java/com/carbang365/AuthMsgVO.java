package com.carbang365;

/*
 * usim인증에서 사용하는 vo입니다.
 */
public class AuthMsgVO {

	private String cust_id; 	// ��ID
	private String svc_id;		// ����ID
	private String tr_id;		// �ŷ���ȣ
	private String req_date;	// ��û�Ͻ�
	private String tele_type;	// ��Ż籸��
	private String auth_type;	// ����Ÿ��
	private String ctn;			// ��ȭ��ȣ
	private String uiccid;		// USIM �Ϸù�ȣ
	private String imsi;		// �� �ĺ���ȣ
	private String imei;		// �ܸ� �Ϸù�ȣ
	private String mos;			// �ܸ�OS
	private String bday;		// �������
	private String sex;			// ����
	private String name;		// ����
	private String privacy_sharing_agree_yn;		// �������� �̿� ���� ����
	private String third_party_provision_agree_yn;	// �������� ��3�� ���� ���� ����
	private String ci_yn; // CI ��û ����
	
	public String getCust_id() {
		return cust_id;
	}
	public void setCust_id(String cust_id) {
		this.cust_id = cust_id;
	}
	public String getSvc_id() {
		return svc_id;
	}
	public void setSvc_id(String svc_id) {
		this.svc_id = svc_id;
	}
	public String getTr_id() {
		return tr_id;
	}
	public void setTr_id(String tr_id) {
		this.tr_id = tr_id;
	}
	public String getTele_type() {
		return tele_type;
	}
	public void setTele_type(String tele_type) {
		this.tele_type = tele_type;
	}
	public String getAuth_type() {
		return auth_type;
	}
	public void setAuth_type(String auth_type) {
		this.auth_type = auth_type;
	}
	public String getCtn() {
		return ctn;
	}
	public void setCtn(String ctn) {
		this.ctn = ctn;
	}
	public String getUiccid() {
		return uiccid;
	}
	public void setUiccid(String uiccid) {
		this.uiccid = uiccid;
	}
	public String getImsi() {
		return imsi;
	}
	public void setImsi(String imsi) {
		this.imsi = imsi;
	}
	public String getImei() {
		return imei;
	}
	public void setImei(String imei) {
		this.imei = imei;
	}
	public String getMos() {
		return mos;
	}
	public void setMos(String mos) {
		this.mos = mos;
	}
	public String getBday() {
		return bday;
	}
	public void setBday(String bday) {
		this.bday = bday;
	}
	public String getSex() {
		return sex;
	}
	public void setSex(String sex) {
		this.sex = sex;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getPrivacy_sharing_agree_yn() {
		return privacy_sharing_agree_yn;
	}
	public void setPrivacy_sharing_agree_yn(String privacy_sharing_agree_yn) {
		this.privacy_sharing_agree_yn = privacy_sharing_agree_yn;
	}
	public String getThird_party_provision_agree_yn() {
		return third_party_provision_agree_yn;
	}
	public void setThird_party_provision_agree_yn(
			String third_party_provision_agree_yn) {
		this.third_party_provision_agree_yn = third_party_provision_agree_yn;
	}
	public String getReq_date() {
		return req_date;
	}
	public void setReq_date(String req_date) {
		this.req_date = req_date;
	}	
	public String getCi_yn() {
		return ci_yn;
	}
	public void setCi_yn(String ci_yn) {
		this.ci_yn = ci_yn;
	}
	
	public String toString() {
				
		return "cust_id[" + cust_id + "], svc_id[" + svc_id + "], tr_id[" + tr_id + "], req_date[" + req_date + "], tele_type[" + tele_type + "], "
			   + "auth_type[" + auth_type + "], ctn[" + ctn + "], uiccid[" + uiccid + "], imsi[" + imsi + "], " 
			   + "imei[" + imei + "], mos[" + mos + "], bday[" + bday + "], sex[" + sex + "], name[" + name + "], "
			   + "privacy_sharing_agree_yn[" + privacy_sharing_agree_yn + "], third_party_provision_agree_yn[" + third_party_provision_agree_yn + "]";
				
	}

}
