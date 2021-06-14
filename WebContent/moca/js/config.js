var config = {
	license: "5f27e7c91ac230c4590c61aef3d6516637ab17b126dc20a00db09ebc1212ae73ea33c1d9d258e1b2359aaae9a3b542ad3bab5609b6aaae30857d5b39bf405c78961baa70d758b7d5fb731cd55929c746f94818f52f9c040f80aaeab817f3ec9c3bb80ce19879542f17e6683237485c419e80bd73f262c5f927da0f4cd580f8417d6f2cf39188e5a302788a7d9be164449af58b6b05162fd9f8813c5c33e2ddd5a36a999cdf28465da370662b9ee8bcddef815e04de7a157c5c0985db2fdf9b3e",
	userLogUrl : "/to/efms/EFC_ULOG/insert_json.do",
	grid:{
		multifilter : false,
		default_cell_height : "26px" 
	},
	defaultMenuId : "li6030000",
	userLogInsert : false,
	isDevMode : function(){
		var h = location.host;
		if(h == "dev-mycar.carbang365.co.kr:9090" || h == "localhost:9090" ){
			return true;
		}else{
			return false;
		}
	},
	callback_alowLeaveMember : function(){
		moca.malert('탈퇴회원은 접근할수없습니다','',function(){
			location.href = moca._contextRoot;
		});
	},
	url_ts_cost: function(){
		if(config.isDevMode()){
			return "http://dev-mycar.carbang365.co.kr:9090/to/jsp/ts_carbang_to_moca_step1_api.jsp";
		}else{
			return "https://mycar.carbang365.co.kr:8443/to/jsp/ts_carbang_to_moca_step1_api.jsp";
		}
	},
	url_ts_result:function(){
		if(config.isDevMode()){
			return "http://dev-mycar.carbang365.co.kr:9090/to/jsp/ts_carbang_to_moca_step2_api.jsp";
		}else{
			return "https://mycar.carbang365.co.kr:8443/to/jsp/ts_carbang_to_moca_step2_api.jsp";
		}
	},
	getSocailLoginKakaoKey:function(){
		if(config.isDevMode()){
			return "ee62c7e428942f32c7ed8495c4b75fae";
		}else{
			return "ee62c7e428942f32c7ed8495c4b75fae";
		}
	},
	getSocailLoginFacebookKey:function(){
		if(config.isDevMode()){
			return "2829799543904413";
		}else{
			return "2829799543904413";
		}
	},	
	getSocailLoginNaverKey:function(){
		if(config.isDevMode()){
			return "Epxta39uWV_RSn_p6xxl";
		}else{
			return "Epxta39uWV_RSn_p6xxl";
		}
	},	
	getSocailLoginUrl:function(){
		if(config.isDevMode()){
			return "TOM_02.html";
		}else{
			return "TOM_02.html";
		}
	},	
	getSocailLoginSuccessUrl:function(){
		if(config.isDevMode()){
			return "http://dev-mycar.carbang365.co.kr:9090/to/m/TOM_25.html" ;
		}else{
			return "https://mycar.carbang365.co.kr:8443/to/m/TOM_25.html" ;
		}
	},	
	getSiren24:function(){
		if(config.isDevMode()){
			return "https://pcc.siren24.com/pcc_V3/jsp/pcc_V3_j10_v2.jsp" ;
		}else{
			return "https://pcc.siren24.com/pcc_V3/jsp/pcc_V3_j10_v2.jsp" ;
		}
	},	
	_contextRoot:"/to",
	_domain:location.origin
}