package com.carbang365;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface TOMapper {
    // 2020.11.16 추가
    // 운영관리 조회
    public List<Map<String, Object>> selectAdmMngList(Map<String, Object> map);
    // 운영관리 각 항목 count
    public List<Map<String, Object>> selectAdmMngListCnt();
    //차량조회 오류코드리스트
    public List<Map<String, Object>> selectCarSearchErrTypeCodeList();
    
    
    
    // 소유권이전요청 상세(운영관리상세팝업)
    public Map <String, Object> selectToTransferOwner(Map<String, Object> map);


    
    
    //TS인증결과조회
    public List<Map<String, Object>> selectToTransferownerTsHis(Map<String, Object> map);
    
    
    
    
    //TS에전달할파라미터수집용
    public Map <String, Object> selectToInfoForTs(Map<String, Object> map);
    
    
    
    // 차량정보 전체보기 팝업
    public Map <String, Object> selectCarInfoDetail(Map<String, Object> map);
    // 자동차등록원부 갑지 목록
    public List<Map <String, Object>> selectCarInfoMaster(Map<String, Object> map);
    // 자동차등록원부 을지 목록
    public List<Map <String, Object>> selectCarInfoSlave(Map<String, Object> map);
    // 영수증 조회(운영관리상세팝업 영수증 클릭)
    public Map<String, Object> selectReceiptInfo(Map<String, Object> map);
    // BizTalk+영수증
    public Map<String, Object> selectBiztalkInfo(Map<String, Object> map); 
    
    
    // 양도증명서 조회
    public List<Map<String, Object>> selectcarCertificateInfo(Map<String, Object> map);
    // 오류내용 조회
    public List<Map<String, Object>> selectcarvehicleErrTxt(Map<String, Object> map);
    // 메모목록 조회
    public List<Map<String, Object>> selectMemoList(Map<String, Object> map);
    // 메모 등록
    public int insertMemo(Map<String, Object> map);
    // 메모 삭제
    public int deleteMemo(Map<String, Object> map);
    // 차량분석오류, 등록원부 조회
    public List<Map<String, Object>> selectCarAnalysis(Map<String, Object> map);
    //쿠콘 자동차등록원부 저장
    public int insertToVehicleRegistration(Map<String, Object> map);
    //쿠콘 자동차등록원부 업데이트
    public int updateToVehicleRegistration(Map<String, Object> map);
    //쿠콘 자동차등록원부 오류 시 업데이트
    public int updateToVehicleRegistrationErr(Map<String, Object> map);
    //쿠콘 자동차등록원부 갑지 저장
    public int insertToVehicleRstMaster(Map<String, Object> map);
    //쿠콘 자동차등록원부 을지 저장
    public int insertToVehicleRstSlave(Map<String, Object> map);
    
    // 지역별 채권율 목록조회
    public List<Map<String, Object>> selectRgonBondList(Map<String, Object> map);
    // 지역별 채권율 목록조회(전기수소)
    public List<Map<String, Object>> selectRgonBondListByElec(Map<String, Object> map);
    // 지역별 채권 할인율 목록조회
    public List<Map<String, Object>> selectRgonBondDiscountList(Map<String, Object> map);
    // 지역별 채권 할인율 목록조회(전기수소)
    public List<Map<String, Object>> selectRgonBondDiscountListByElec(Map<String, Object> map);
    // 지역 목록 조회
    public List<Map<String, Object>> selectToRawdataDistrictMajor();
    // 지역별 채권율 구분관리 조회
    public List<Map<String, Object>> selectToRawdataBondBasisvaluetype();
    
    // 지역별 채권율 업데이트
    public int updateRgonBondList(Map<String, Object> map);
    // 지역별 채권율 업데이트(전기수소)
    public int updateRgonBondListByElec(Map<String, Object> map);
    // 지역별 채권 할인율 업데이트
    public int updateRgonBondDiscountList(Map<String, Object> map);
    // 지역별 채권 할인율 업데이트(전기수소)
    public int updateRgonBondDiscountListByElec(Map<String, Object> map);
    // 지역별 채권율 구분관리 업데이트
    public int updateToRawdataBondBasisvaluetype(Map<String, Object> map);
    
    // 시가표준액 조회
    public List<Map<String, Object>> selectStndCarPriceList(Map<String, Object> map);
    // 시가표준액 저장 (삭제. DB클라이언트 프로그램에서 직접 엑셀 업로드 처리)
    public int updateStndCarPriceList(Map<String, Object> map);
    // 시가표준액 각 항목 count
    public List<Map<String, Object>> selectStndCarPriceListCnt();
    // 시가표준액 삭제
    public int deleteStndCarPriceList(Map<String, Object> map);
    
    
    
    // 일별채권단가조회
    public List<Map<String, Object>> selectBondPriceInfo(Map<String, Object> map);
    // 일별채권추가적용금액조회
    public List<Map<String, Object>> selectBondAddPriceInfo(Map<String, Object> map);
    // 일별 채권단가 수정
    public int updateBondPrice(Map<String, Object> map);
    // 일별 채권단가 추가적용금액 수정
    public int updateAddBondPrice(Map<String, Object> map);
    // TS차량 DB관리 목록조회
    public List<Map<String, Object>> selectTsCarDbMngList(Map<String, Object> map);
    // TS차량 DB관리 각 항목 count
    public List<Map<String, Object>> selectTsCarDbMngListCnt();
    // TS차량 DB관리 상세조회
    public Map<String, Object> selectTsCarDbMngDetail(Map<String, Object> map);
    // TS차량 DB관리 친환경차 유무 업데이트
    public int updateTsCarDbMng(Map<String, Object> map);
    //TS차량 DB관리 저장 (삭제. DB클라이언트 프로그램에서 직접 엑셀 업로드 처리)
    //public int updateTsCarDbMngList(Map<String, Object> map);
    // 약관목록/상세 조회
    public List<Map<String, Object>> selectTermsInfo(Map<String, Object> map);
    public List<Map<String, Object>> selectGonggiInfo(Map<String, Object> map);
    // 약관등록
    public int isnertTerm(Map<String, Object> map);
    public int isnertGonggi(Map<String, Object> map);
    
    // 약관 적용여부 일괄 미적용 처리
    public int deleteTermsEnable(Map<String, Object> map);
    public int deleteTermsSelected(Map<String, Object> map);
    // 약관 적용 수정
    public int updateTermsEnable(Map<String, Object> map);
    
    public int updateTerms(Map<String, Object> map);
    public int updateGonggi(Map<String, Object> map);
    // 금융기관DB 목록/상세조회
    public List<Map<String, Object>> selectFincialDbList(Map<String, Object> map);
    // 금융기관DB 저장
    public int insertFincialDbInfo(Map<String, Object> map);
    public int updateFincial(Map<String, Object> map);
    
    // 금융기관DB 삭제
    public int deleteFincialDbInfo(Map<String, Object> map);
    // 의뢰시간 조회
    public List<Map<String, Object>> selectAskDateInfo();
    // 의뢰시간 저장
    public int updateAskDateInfo(Map<String, Object> map);
    // 소유권이전코드관리 목록조회
    public List<Map<String, Object>> selectToCodeList(Map<String, Object> map);
    // 소유권이전코드별 이전가능여부 업데이트
//    public int updateToCodeList(Map<String, Object> map);
    // 소유권이전 코드등록
    public int insertToCodeList(Map<String, Object> map);
    // 소유권이전 코드 전체삭제
    public int deleteToCodeList();
    // 이전신청 예상완료일 조회
    public String selectCompletDt(Map<String, Object> map);
    
    
    // 차량시세 조회 프로시저 호출 (사용하지 않음)
    //public Map<String, Object> callTOGetUsedCarRemainingPriceByKcar(Map<String, Object> map);
    // 차량시세 조회(하한가) << 프로시저 호출하지 않고 to_be에서 새롭게 계산하는 방식을 적용 (기준가격*(감가율+추가적용율)) : 시세계산용 하한가
    public Map<String, Object> selectRemainingPrice(Map<String, Object> map);
    
    // 차량시세 중간가/상한가 조회
    public Map<String, Object> selectGetAddRatio(Map<String, Object> map);
    // 차량 감가적용율 목록
    public List<Map<String, Object>> selectOriRateListList(Map<String, Object> map);
    // 차량 시세 추가적용율 목록
    public List<Map<String, Object>> selectAddRateList(Map<String, Object> map);
    // 차량시세적용율(감가율+추가적용율)
    public List<Map<String, Object>> selectTotalRateList(Map<String, Object> map);
    
    //결제마감시간체크
    public Map<String, Object> selecIsTimeOn(Map<String, Object> map);
    //소유권이전신청버튼 의뢰시간 IsTimeOn
    public Map<String, Object> selecIsTimeOnForTORequest(Map<String, Object> map);   
    //TS전문이력
    public int insertTsHis(Map<String, Object> map); 
    public int updateToForTs(Map<String, Object> map);
    
    // 차량 감가적용율 삭제
    public int deleteOriRate(Map<String, Object> map);
    // 차량 시세 추가적용율 삭제
    public int  deleteAddRate(Map<String, Object> map);
    // 차량 감가적용율 저장
    public int insertOriRate(Map<String, Object> map);
    // 차량 시세 추가적용율 저장
    public int  insertAddRate(Map<String, Object> map);
    // 차량 중간/상한가 비율 수정
    public int  updateAddRatePercent(Map<String, Object> map);
    //취득세율 및 감면금액 조회
    public List<Map<String, Object>> selectAcquistionPrice(Map<String, Object> map);
    //취득세율 삭제
    public int deleteAcquistionTax(Map<String, Object> map);
    // 감면금액 삭제
    public int deleteAcquistionReducePrice(Map<String, Object> map);
    //취득세율 저장
    public int insertAcquistionTax(Map<String, Object> map);
    // 기본감면금액 저장
    public int insertAcquistionReducePrice(Map<String, Object> map);
    // 친환경감면금액 저장
    public int insertAcquistionReducePriceEco(Map<String, Object> map);
    // 은행목록조회
    public List<Map<String, Object>> selectBankList(Map<String, Object> map);
    // 비용관리 조회
    public List<Map<String, Object>> selectToTransferCostMng();
    // 비용관리 삭제
    public int deleteToTransferCostMng();
    // 비용관리 저장
    public int insertToTransferCostMng(Map<String, Object> map);
    // 원단위 절사가 적용된 금액을 구한다 (BondInfo_PurchasePrice_Cutoff 함수호출)
    public BigDecimal getBondInfoPurchasePriceCutoff(Map<String, Object> map);
    
    // 매출관리
    public List<Map<String, Object>> selectSalesMngList(Map<String, Object> map);
    
    
    /**************************************************************************************************************************
	 * 																														  *
	 * 														모바일 추가														  *
	 * 																														  *
	 **************************************************************************************************************************/
    
    // 회원목록조회
    public List<ToUserVO> selectToUsersList(Map<String, Object> map);
    // 회원상세조회
    public ToUserVO selectToUsersDetail(Map<String, Object> map);
    // 회원상세조회(보안번호로)
    public ToUserVO selectToUsersDetailBySecretKey(Map<String, Object> map);    
    
    // 탈퇴 사용자 회원가입
    public int updateToUsers(Map<String, Object> map);
    // 회원탈퇴
    public int updateToUsersLeaveYn(Map<String, Object> map);
    // 약관조회
    public List<Map<String, Object>> selectTermsList(Map<String, Object> map);
    
    // 소유권이전 insert
    public int insertToTransferOwner(Map<String, Object> map);
    // 소유권이전 판매자정보 insert
    public int insertToTransferOwnerSeller(Map<String, Object> map);
    // 소유권이전 구매자정보 insert
    public int insertToTransferOwnerBuyer(Map<String, Object> map);
    // 소유권이전 상태값 update
    public int updateToTransferOwnerStage(Map<String, Object> map);
    public int updateToTransferOwnerCVPL_REQST_NO(Map<String, Object> map);
    
    
    // 소유권이전 판매자 인증정보 update 
    public int updateToTransferOwnerSeller(Map<String, Object> map);
    // 소유권이전 구매자 인증정보 update
    public int updateToTransferOwnerBuyer(Map<String, Object> map);
    // 고객결제정보 조회
    public Map<String, Object> selectUserPayment(Map<String, Object> map);
    // TS확정비용 insert
    public int insertTransferCostTs(Map<String, Object> map);
    public int deleteCostTs(Map<String, Object> map);
    
    // 수입인지 미사용 계약번호 조회 
    public Map<String, Object> selectToEtcInfos();
    // 수입인지 사용 계약번호 구매금액 업데이트 
    public int updateToEtcInfos(Map<String, Object> map);
    
    // 소유권이전요청 조회
    public Map<String, Object> selectToTransferOwnerDetail(Map<String, Object> map);
    // 소유권이전요청 판매자정보 조회
    public Map<String, Object> selectToTransferOwnerSellerDetail(Map<String, Object> map);
    // 소유권이전요청 구매자정보 조회
    public Map<String, Object> selectToTransferOwnerBuyerDetail(Map<String, Object> map);
    // 소유권이전요청 삭제
    public Map<String, Object> deleteToTransferOwnerDetail(Map<String, Object> map);
    // 소유권이전요청 판매자정보 삭제
    public Map<String, Object> deleteToTransferOwnerSellerDetail(Map<String, Object> map);
    // 소유권이전요청 구매자정보 삭제
    public Map<String, Object> deleteToTransferOwnerBuyerDetail(Map<String, Object> map);
    // 소유권이전요청 copy insert
    public Map<String, Object> insertToTransferOwnerCopy(Map<String, Object> map);
    // 소유권이전요청 판매자정보 copy insert
    public Map<String, Object> insertToTransferOwnerSellerCopy(Map<String, Object> map);
    // 소유권이전요청 구매자정보 copy insert
    public Map<String, Object> insertToTransferOwnerBuyerCopy(Map<String, Object> map);
   
    // 결제전문 테이블 전문번호 조회 (임시로 주석처리. 추후 개발db 합치면 주석해제)
    public String selectTradeReqBinSeq();
    
    // 결제전문 테이블 insert (임시로 주석처리. 추후 개발db 합치면 주석해제)
    public int insertTradeRequestBin(Map<String, Object> map);
    public int insertTradeRequestBinForTO(Map<String, Object> map);
    
    // 결제전문 응답값 조회 (임시로 주석처리. 추후 개발db 합치면 주석해제)
    public Map<String, Object> selectTradeRequestBin(Map<String, Object> map);
    
    // 고객결제정보 저장
    public int insertToUserPaymentInfo(Map<String, Object> map);
    // 고객결제정보 조회
    public List<Map<String, Object>> selectToUserPaymentInfo(Map<String, Object> map);
    // 결제 히스토리 insert
    public int insertToPaymentHistory(Map<String, Object> map);
    /***************************************** 이전계산 시작 *****************************************/
    // 지역에 따른 채권걔산방법 구분조회 
    public String selectToBondBasisValueType(Map<String, Object> map);
    // 이전비용계산 수수료 조회
    public Map<String, Object> selectToTransferCostPrice(Map<String, Object> map);
    // 현재시간에 따라 추가율 적용/미적용 된 일별 채권단가 조회
    public Map<String, Object> selectToUpriceByTime(Map<String, Object> map);
    // 지역별 채권율 계산 타입/적용값조회(금액/율)
    public Map<String, Object> selectBondPurchaseTypeValue(Map<String, Object> map);
    // 지역별 채권율 할인 타입/적용값조회(금액/율)
    public Map<String, Object> selectBondDiscountTypeValue(Map<String, Object> map);
    // 이전비 계산용 취득세/감면비율 조회
    public Map<String, Object> selectAcquistionPriceByTransfer(Map<String, Object> map);
    
    //카방계좌정보구하기
    public Map<String, Object> selectCarbangBankInfo(Map<String, Object> map);
    
    
    // 소유권이전 금액정보 insert
    public int insertToTransferownerCost(Map<String, Object> map);
    public int deleteTransferownerCost(Map<String, Object> map);
    
    
    // 소유권이전 금액정보 고객추가금액 UPDATE
    public int updateToTransferownerCost(Map<String, Object> map);
    /***************************************** 이전계산 끝 *****************************************/
    //AutoIncrement구하기
    public String selectAutoIncrement(Map<String, Object> map);
    //TS비용확정후 입금한내역에대한 결과확인
    public List<Map<String, Object>> selectListForInsertTradeRequest(Map<String, Object> map);
    //TS비용확정후 입금한내역에대한 결과처리완료업데이트
    public int updateResultForTOTradeRequestBin(Map<String, Object> map);
    //TS이전결과후 환불한내역에대한 결과처리완료업데이트
    public List<Map<String, Object>> selectListTransferOwnerRstTs(Map<String, Object> map);
    
    //1100 스켄쥴러 이전신청
    public List<Map<String, Object>> selectFor1100(Map<String, Object> map);
    public List<Map<String, Object>> reExeTs1100(Map<String, Object> map);
    
    //9100 스켄쥴러 인증여부체크
    public List<Map<String, Object>> checkCert(Map<String, Object> map);
    public Map<String, Object> checkSellerBuyer(Map<String, Object> map);
    
    public int update_TO_TRANSFEROWNER_BUYER(Map<String, Object> map);
    public int update_TO_TRANSFEROWNER_SELLER(Map<String, Object> map);
    public List<Map<String, Object>> selectForUpdateTermsEnable(Map<String, Object> map);
    
    public List<Map<String, Object>> selectTermsUpCds(Map<String, Object> map);
    public Map<String, Object> selectTermsContents(Map<String, Object> map);
    public List<Map<String, Object>> selectGonggis(Map<String, Object> map);
    
    //보안번호찾기용 email,phone가져오기
    public Map <String, Object> selectUserPhoneEmail(Map<String, Object> map);   
    
    //보안번호초기화업데이트
    public int updateSecretKeyTemp(Map<String, Object> map);
    public int updateSecretKey(Map<String, Object> map);
	
    //보안번호실패회수업데이트
    public int updateLoginFailCount(Map<String, Object> map);
    
	public ToUserVO selectToUsersDetailBySecretKeyTemp(Map<String, Object> map);    
    // 탈퇴여부판단
	public ToUserVO selectToUsersLeaveYn(Map<String, Object> map);   
    
    // 20210421 개인간 소유권 이전 채널 조회
	public List<Map<String, Object>> selectTrfnChnlList(Map<String, Object> map);
	
    // 20210421 개인간 소유권 이전 채널 입력
	public int insertTrfnChnl(Map<String, Object> map);
	
    // 20210421 개인간 소유권 이전 채널 업데이트
	public int updateTrfnChnl(Map<String, Object> map);
	
    // 20210421 개인간 소유권 이전 채널 삭제
	public int deleteTrfnChnl(Map<String, Object> map);
	
    // 20210423 개인간 소유권 이전 채널 조회 from 차량 분석결과
	public String selectTrfnChnlCd(Map<String, Object> map);
	
	// 20210428 차량 제조사 가격 관리 기본 입력
	public int insertMfcoPrcMgntBase(Map<String, Object> map);
	
	// 20210428 차량 제조사 옵션가격 내역 입력
	public int insertMfcoOptPrcPtcl(Map<String, Object> map);
	
	// 20210428 차량 제조사 가격 정보 조회
	public Map<String, Object> selectVhclMfcoPrcMgntBase(Map<String, Object> map);
	
	// 20210503 통합 납부 영수증 목록 조회
	public Map<String, Object> selectUnfyPayVouList(Map<String, Object> map);
	
	// 20210504 통합 납부영수증 매핑 대상 소유권 이전신청 목록 조회
	public List<Map<String, Object>> selectUnfyPayVouMappingList(Map<String, Object> map);
	
	// 20210504 통합 납부영수증 관리 입력
	public int insertToUnfyPayVouMgntBase(Map<String, Object> map);
	
	// 20210506 소유권이전 테이블의 통합 납부영수증 관리번호 업데이트
	public int updateUnfyPayVouMngNo(Map<String, Object> map);
	
	// 20210506 코드몀으로 공통코드 조회
	public String selectComCdByName(Map<String, Object> map);
	
    // 경로 결정을 위한  차종 조회
    public Map <String, Object> carTypeSelect(Map<String, Object> map);    
    // 경로 결정을 위한  친환경 조회
    public Map <String, Object> ecoTypeSelect(Map<String, Object> map);
    
 	// 게시판조회
	public List<Map<String, Object>> selectBoardList(Map<String, Object> map);
	// 게시판 총건수조회
	public Map<String, Object> selectBoardTotCnt(Map<String, Object> map);
	// 게시판조회 numList
	public List<Map<String, Object>> selectBoardNumList(Map<String, Object> map);
	// 게시판상태 Count
	public List<Map<String, Object>> selectBoardStatusCnt(Map<String, Object> map);
	// 게시판답변 Count
	public int updateReplyCnt(Map<String, Object> map);
	// 게시판답변조회
	public List<Map<String, Object>> selectBoardReply(Map<String, Object> map);
	// 게시글등록
	public int insertBoard(Map<String, Object> map);
	// 게시글수정
	public int updateBoardInfo(Map<String, Object> map);
	// 게시글물리삭제(관리자삭제)
	public int deleteBoard(Map<String, Object> map);
	// 게시글논리삭제
	public int deleteStatusBoard(Map<String, Object> map);
	// 게시물단건조회
	public Map <String, Object> selectBoardInfo(Map<String, Object> map); 
	// 게시글이력등록
	public int insertBoardHis(Map<String, Object> map);
	// 게시판이력조회
	public List<Map<String, Object>> selectBoardHisList(Map<String, Object> map);
	// 게시물단건이력조회
	public Map <String, Object> selectBoardHisInfo(Map<String, Object> map); 
	// 게시판파일업로드조회
	public List<Map<String, Object>> selectBoardFileList(Map<String, Object> map);
	// 게시글파일업로드
	public int insertBoardFile(Map<String, Object> map);
	// 게시글파일삭제
	public int deleteBoardFileList(Map<String, Object> map);
	// 게시글접수
	public int receiptBoard(Map<String, Object> map);
	// 게시글수정일시
	public int updateBoardDate(Map<String, Object> map);
		
	// 스케줄러 조회
	public List<Map<String, Object>> selectScheduleList(Map<String, Object> map);
	// 스케줄러 등록
	public int insertSchedule(Map<String, Object> map);
	// 스케줄러단건조회
	public Map <String, Object> selectScheduleInfo(Map<String, Object> map);
	// 스케줄러 수정
	public int updateScheduleInfo(Map<String, Object> map);
	// 게시글논리삭제
	public int deleteScheduleInfo(Map<String, Object> map);
	
	// 스케줄러 일정알림 조회(3일전 미리조회)
	public List<Map<String, Object>> selectThreeDaysSchedule(Map<String, Object> map);
	// 내일 스케줄 조회
	public List<Map<String, Object>> selectTomorrowSchedule(Map<String, Object> map);
	// 내일 스케줄 sms 보내기 yn
	public int updateScheduleSendSmsYn(Map<String, Object> map);
	
	// 미가입 사용자 회원가입
    public int insertMocaUsers(Map<String, Object> map);
    // 홈페이지사용자조회
 	public Map <String, Object> selectMocaUserInfo(Map<String, Object> map);
 	
 	// test 조회
 	public List<Map<String, Object>> selectTestList(Map<String, Object> map);
 	
 	// test numlist조회
  	public List<Map<String, Object>> selectTestNumList(Map<String, Object> map);
  	// test 총건수조회
 	public Map<String, Object> selectTestNumList_totCnt(Map<String, Object> map);
 	
  	// 임대관리_건물 조회
   	public List<Map<String, Object>> selectBuildingList(Map<String, Object> map);
   	// 임대관리_건물(콤보박스용) 조회
   	public List<Map<String, Object>> selectBuildingComboList(Map<String, Object> map);
   	// 임대관리_방 조회
   	public List<Map<String, Object>> selectRoomList(Map<String, Object> map);
   	// 임대관리_방(콤보박스용) 조회
    public List<Map<String, Object>> selectRoomComboList(Map<String, Object> map);
   	// 임대관리_계약 조회
   	public List<Map<String, Object>> selectContractList(Map<String, Object> map);
   	// 임대관리_파일조회
 	public List<Map<String, Object>> selectContFileList(Map<String, Object> map);
 	// 임대관리_계약 등록
 	public int insertContract(Map<String, Object> map);
}