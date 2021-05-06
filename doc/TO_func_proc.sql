-- --------------------------------------------------------
-- 호스트:                          dev-api.carbang365.com
-- 서버 버전:                        5.7.33-0ubuntu0.18.04.1 - (Ubuntu)
-- 서버 OS:                        Linux
-- HeidiSQL 버전:                  10.1.0.5464
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- CarBang_New 데이터베이스 구조 내보내기
CREATE DATABASE IF NOT EXISTS `CarBang_New` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `CarBang_New`;

-- 함수 CarBang_New.TO_BondInfo_PurchasePrice_Cutoff 구조 내보내기
DELIMITER //
CREATE DEFINER=`carbang_new`@`%` FUNCTION `TO_BondInfo_PurchasePrice_Cutoff`(
	`IN_BondPurchasePrice` INTEGER,
	`IN_CutOffType` TINYINT


) RETURNS int(11)
BEGIN
	
	

	
    DECLARE SV_BondPurchase_Price_Original INTEGER DEFAULT 0;

    
    CASE
		
		WHEN IN_CutOffType = 1 #절사없음
        THEN SET SV_BondPurchase_Price_Original = IN_BondPurchasePrice;
        
        WHEN IN_CutOffType = 3 #5000원 미만 절사
		THEN SET SV_BondPurchase_Price_Original = IN_BondPurchasePrice - IN_BondPurchasePrice % 5000;
		      
        WHEN IN_CutOffType = 4 #10000원 미만 절사
		THEN SET SV_BondPurchase_Price_Original = IN_BondPurchasePrice - IN_BondPurchasePrice % 10000;
		
		WHEN IN_CutOffType = 2 #3: 최저매입금액 5천원(2,500원 미만 0원적용[0-2499], 5,000원 적용[2500-7499], 10,000원적용[7500-9999]			
        THEN SET SV_BondPurchase_Price_Original = IN_BondPurchasePrice - IN_BondPurchasePrice % 2500;
        SET SV_BondPurchase_Price_Original =
        if(truncate(IN_BondPurchasePrice/2500%2,0)>0,IN_BondPurchasePrice+2500-(IN_BondPurchasePrice+2500)%5000,
        IN_BondPurchasePrice-IN_BondPurchasePrice%5000);        
        
	END CASE;
    
    RETURN SV_BondPurchase_Price_Original;
END//
DELIMITER ;

-- 함수 CarBang_New.TO_GetElapsedMonth 구조 내보내기
DELIMITER //
CREATE DEFINER=`carbang_new`@`%` FUNCTION `TO_GetElapsedMonth`(
	`IN_PastDate` Date


) RETURNS int(11)
BEGIN

	
    
    
    
    DECLARE SV_ElapsedYear INTEGER;
    
	DECLARE SV_ElapsedMonth INTEGER;
    
    DECLARE SV_TotalElapsedMonth INTEGER;
    
    
    
	select if(year(now())=year(IN_PastDate),0,year(now())-year(IN_PastDate)-1),
	if(year(now())=year(IN_PastDate),month(now())-month(IN_PastDate)+1,12-month(IN_PastDate)+1+month(now()))
    into SV_ElapsedYear, SV_ElapsedMonth;
	
    
    SET SV_TotalElapsedMonth = SV_ElapsedYear * 12 + SV_ElapsedMonth;
    
    return SV_TotalElapsedMonth;
END//
DELIMITER ;

-- 함수 CarBang_New.TO_GetFuelType 구조 내보내기
DELIMITER //
CREATE DEFINER=`carbang_new`@`%` FUNCTION `TO_GetFuelType`(
	`IN_FuelString` varchar(32) CHARACTER SET UTF8,
	`IN_Purpose` INTEGER

) RETURNS int(11)
BEGIN
	
    DECLARE FuelType TINYINT DEFAULT 0;

	CASE 
		WHEN IN_Purpose = 1
        THEN select Type_RemainingRate into FuelType from Rawdata_Vehicle_FuelType where `Name` = IN_FuelString;
		WHEN IN_Purpose = 2
        THEN select Type_RealFuelRatio into FuelType from Rawdata_Vehicle_FuelType where `Name` = IN_FuelString;
	END CASE;
    
    RETURN FuelType;
END//
DELIMITER ;

-- 함수 CarBang_New.TO_GetSerialNumber 구조 내보내기
DELIMITER //
CREATE DEFINER=`carbang_new`@`%` FUNCTION `TO_GetSerialNumber`() RETURNS varchar(32) CHARSET utf8
BEGIN

	declare SV_SerialNumber_Sequence integer;
    declare SV_SerialNumber_First varchar(8) CHARSET utf8;
    declare SV_SerialNumber_Second varchar(8) CHARSET utf8;
    declare SV_SerialNumber_Third varchar(8) CHARSET utf8;
    declare SV_SerialNumber_Fourth varchar(8) CHARSET utf8;
    declare SV_SerialNumber_Fifth varchar(8) CHARSET utf8;
    

	select if(SerialNumber_Date=date(now()),SerialNumber_Sequence+1,1)
    into SV_SerialNumber_Sequence from OptData_SystemVariable;
    
    IF SV_SerialNumber_Sequence = 1
    THEN update OptData_SystemVariable set SerialNumber_Date = now(), SerialNumber_Sequence = 1;
    ELSE update OptData_SystemVariable set SerialNumber_Sequence = SerialNumber_Sequence+1;
    END IF;
    
    set SV_SerialNumber_First = date_format(now(),'%y%m%d');
    set SV_SerialNumber_Second = lpad(truncate(rand()*1000000,0),6,'0');
    set SV_SerialNumber_Third = lpad(SV_SerialNumber_Sequence,5,'0');
    set SV_SerialNumber_Fourth = truncate(rand()*10,0);
    set SV_SerialNumber_Fifth = (substr(SV_SerialNumber_Second,1,1)
								+ substr(SV_SerialNumber_Second,2,1)
                                + substr(SV_SerialNumber_Second,3,1)
                                + substr(SV_SerialNumber_Second,4,1)
                                + substr(SV_SerialNumber_Second,5,1)
                                + substr(SV_SerialNumber_Second,6,1)
                                + cast(SV_SerialNumber_Third as unsigned))
                                * SV_SerialNumber_Fourth
                                % 10;

	return concat(SV_SerialNumber_First,'-',SV_SerialNumber_Second,'-',SV_SerialNumber_Third,
	'-',SV_SerialNumber_Fourth,SV_SerialNumber_Fifth);

END//
DELIMITER ;

-- 함수 CarBang_New.TO_GetStage 구조 내보내기
DELIMITER //
CREATE DEFINER=`carbang_new`@`%` FUNCTION `TO_GetStage`(
	`IN_Stage` integer



) RETURNS varchar(100) CHARSET utf8
BEGIN

    
	DECLARE SV_StageTxt VARCHAR(100) CHARACTER SET UTF8  DEFAULT '';

   CASE
		WHEN IN_Stage = 1
		THEN SET SV_StageTxt = '인증진행중 (양수/양도인 미인증)';
		
		WHEN IN_Stage = 2
		THEN SET SV_StageTxt = '인증진행중(양수인미인증)';
		
		WHEN IN_Stage = 3
		THEN SET SV_StageTxt = '인증진행중(양도인미인증)';
		
		WHEN IN_Stage = 4
		THEN SET SV_StageTxt = '인증진행중(인증준비중)';
		
		WHEN IN_Stage = 5
		THEN SET SV_StageTxt = '인증오류 ';
		
		WHEN IN_Stage = 6
		THEN SET SV_StageTxt = '이전신청대기중';
		
		WHEN IN_Stage = 7
		THEN SET SV_StageTxt = '이전신청 오류';
		
		WHEN IN_Stage = 8
		THEN SET SV_StageTxt = '고객정보확인신청중';
		
		WHEN IN_Stage = 9
		THEN SET SV_StageTxt = '고객정보오류';
		
		WHEN IN_Stage = 10
		THEN SET SV_StageTxt = '고객미결제 비용미확정';
		
		WHEN IN_Stage = 11
		THEN SET SV_StageTxt = '고객미결제 비용확정';
		
		WHEN IN_Stage = 12
		THEN SET SV_StageTxt = '고객미결제';
		
		WHEN IN_Stage = 13
		THEN SET SV_StageTxt = '결제준비중';
		
		WHEN IN_Stage = 14
		THEN SET SV_StageTxt = '공단입금 비용확정';
		
		WHEN IN_Stage = 15
		THEN SET SV_StageTxt = '공단입금 비용미확정';
		
		WHEN IN_Stage = 16
		THEN SET SV_StageTxt = '이전등록미완료';
		
		WHEN IN_Stage = 17
		THEN SET SV_StageTxt = '환급(취소)';
		
		WHEN IN_Stage = 18
		THEN SET SV_StageTxt = '환급(완료)';
		
		WHEN IN_Stage = 19
		THEN SET SV_StageTxt = '환급(없음)';
		
		WHEN IN_Stage = 20
		THEN SET SV_StageTxt = '고객입금부족';
		
		WHEN IN_Stage = 21
		THEN SET SV_StageTxt = '카방계좌부족';
		
		WHEN IN_Stage = 22
		THEN SET SV_StageTxt = '환급오류(에러코드)';
		
		WHEN IN_Stage = 23
		THEN SET SV_StageTxt = '준비중';
		
		WHEN IN_Stage = 24
		THEN SET SV_StageTxt = '고객결제오류';
		
		WHEN IN_Stage = 25
		THEN SET SV_StageTxt = '공단결제오류';
		
		WHEN IN_Stage = 26
		THEN SET SV_StageTxt = '고객취소';
		
		WHEN IN_Stage = 27
		THEN SET SV_StageTxt = '이전신청완료';		
		
		WHEN IN_Stage = 226
		THEN SET SV_StageTxt = '운영자취소로인한 환급';	
		
		WHEN IN_Stage = 126
		THEN SET SV_StageTxt = '운영자취소';	
		
		WHEN IN_Stage = 112
		THEN SET SV_StageTxt = '이전신청오류';

		WHEN IN_Stage = 113
		THEN SET SV_StageTxt = '이전등록오류';

		WHEN IN_Stage = 212
		THEN SET SV_StageTxt = '이전등록오류(인증후)';
		
		WHEN IN_Stage = 28
		THEN SET SV_StageTxt = '미입금상태에서민원신청송신받음';
		
		WHEN IN_Stage = 128
		THEN SET SV_StageTxt = '공단미입금상태에서서민원신청송신';
		
		ELSE SET SV_StageTxt = '-';		
	
	END CASE; 
	
	RETURN SV_StageTxt;
	
END//
DELIMITER ;

-- 프로시저 CarBang_New.TO_GetUsedCarRemainingPriceByKcar 구조 내보내기
DELIMITER //
CREATE DEFINER=`carbang_new`@`%` PROCEDURE `TO_GetUsedCarRemainingPriceByKcar`(
	IN_VehicleName varchar(32) CHARACTER SET UTF8,
	IN_ReleasePrice integer,
	IN_SpecMgmtNumber varchar(32) CHARACTER SET UTF8,
	IN_ProductDate varchar(10) CHARACTER SET UTF8,
	IN_VehicleType varchar(8) CHARACTER SET UTF8,
    IN_Class varchar(8) CHARACTER SET UTF8,
    IN_CountryOrigin varchar(8) CHARACTER SET UTF8,
	IN_FuelType TINYINT
)
BEGIN

	# 차량 생산지 구분
    # TO_RAWDATA_VEHICLE_REMAININGRATE 테이블의 생산지 구분이 승합,화물이 통합 처리되어 있어 별도 변경 처리
	DECLARE SV_CountryOrigin varchar(8) CHARACTER SET UTF8;
	# 차량 경과일 보관 (차량 생산일 기준)	
	DECLARE TotalElapsedMonth INTEGER;
    DECLARE VehicleElapsedYear_Original INTEGER;
	DECLARE VehicleElapsedYear_Modified INTEGER;
	DECLARE VehicleElapsedMonth INTEGER;
	DECLARE VehicleElapsedDay INTEGER;
	# 경감율 시작비율
	DECLARE RemainingRatio_From FLOAT;
	# 경감율 종료비율
	DECLARE RemainingRatio_To FLOAT;
	# 경감율 시작-종료 비율차
    DECLARE RemainingRatio_Distance FLOAT;
	# 경감율 추가 적용값
    DECLARE RemainingRatio_Extra INTEGER;
	# 경감율 월별 적용값 (경감율 비율차/12)
    DECLARE RemainingRatio_Extra_SingleRatio FLOAT;
	# 경감율 최종 적용값
    DECLARE RemainingRatio_Extra_ApplyRatio FLOAT;
	# 차량 과세표준 금액
    DECLARE VehicleBasisPrice INTEGER;
	# 차량 잔존가액 (표준가)
    DECLARE VehicleReductedPrice INTEGER;
	# 차량 잔존금액 (카방 보정값)
    DECLARE UsedCarRemainingPrice INTEGER;

	
	# 생산지 문자열 할당
    IF IN_VehicleType = '승용'
    THEN SET SV_CountryOrigin = IN_CountryOrigin;
    ELSE SET SV_CountryOrigin = '통합';
    END IF;
	# 차량 전체 경과월수 할당
	SET TotalElapsedMonth = GetElapsedMonth(IN_ProductDate);
	# 차량 경과연월 할당
	select truncate(TotalElapsedMonth/12,0), TotalElapsedMonth%12,
    day(FROM_UNIXTIME(unix_timestamp(date(now()))-unix_timestamp(date(IN_ProductDate)),'%Y%m%d'))
	into VehicleElapsedYear_Original, VehicleElapsedMonth, VehicleElapsedDay;
	# 차량 경과연도 변환 할당 (20년 한도로 경감율이 산정되므로 값 전환)
    SET VehicleElapsedYear_Modified = if(VehicleElapsedYear_Original>20,20,VehicleElapsedYear_Original);
	# 경감율 시작비율 할당
    IF VehicleElapsedYear_Modified > 0
    THEN 
		select RemainingPriceRate into RemainingRatio_From from TO_RAWDATA_VEHICLE_REMAININGRATE
		where Purpose = '비영업용' and VehicleType = IN_VehicleType and CountryOrigin = SV_CountryOrigin
        and ElapsedYear = VehicleElapsedYear_Modified-1;
	ELSE SET RemainingRatio_From = 1;
    END IF;
    # 경감율 종료비율 할당
	select RemainingPriceRate into RemainingRatio_To from TO_RAWDATA_VEHICLE_REMAININGRATE
	where Purpose = '비영업용' and VehicleType = IN_VehicleType and CountryOrigin = SV_CountryOrigin
	and ElapsedYear = VehicleElapsedYear_Modified;
    
    SET RemainingRatio_Distance = RemainingRatio_From - RemainingRatio_To;
    
	select ExtraRate into RemainingRatio_Extra from TO_RAWDATA_VEHICLE_REMAININGRATE_EXTRA
	where ElapsedYear = VehicleElapsedYear_Modified and VehicleType = IN_VehicleType
    and CountryOrigin = IN_CountryOrigin and FuelType = IN_FuelType;
    
    SET RemainingRatio_Extra_SingleRatio = RemainingRatio_Distance / RemainingRatio_Extra;
    
    SET RemainingRatio_Extra_ApplyRatio = RemainingRatio_To + (RemainingRatio_Extra_SingleRatio * (12-VehicleElapsedMonth));
	
	# 차량가격 설정 (미입력시 과세표준금액 수집)
    IF IN_ReleasePrice > 0
    THEN SET VehicleBasisPrice = IN_ReleasePrice;
	ELSE SET VehicleBasisPrice = TO_GetUserVehiclePriceByKCar(IN_SpecMgmtNumber, IN_VehicleType, IN_CountryOrigin);
	END IF;
	# 차량 잔존가액 (표준가)
    SET VehicleReductedPrice = VehicleBasisPrice * RemainingRatio_To;
	# 차량 잔존금액 (카방 보정값)
    SET UsedCarRemainingPrice = truncate(VehicleBasisPrice * RemainingRatio_Extra_ApplyRatio,-4);
   
	select TotalElapsedMonth, VehicleElapsedYear_Original, VehicleElapsedMonth, VehicleElapsedDay,
    RemainingRatio_From, RemainingRatio_To, RemainingRatio_Distance, RemainingRatio_Extra,
    RemainingRatio_Extra_SingleRatio, RemainingRatio_Extra_ApplyRatio, VehicleBasisPrice,
    VehicleReductedPrice, UsedCarRemainingPrice;

END//
DELIMITER ;

-- 함수 CarBang_New.TO_GetUserVehiclePriceByKCar 구조 내보내기
DELIMITER //
CREATE DEFINER=`carbang_new`@`%` FUNCTION `TO_GetUserVehiclePriceByKCar`(
	IN_SpecMgmtNumber varchar(32) CHARACTER SET UTF8,
	IN_VehicleType varchar(8) CHARACTER SET UTF8,			
    IN_CountryOrigin varchar(8) CHARACTER SET UTF8			
) RETURNS int(11)
BEGIN

    
    DECLARE SameFormNameVehicleCount INTEGER DEFAULT 0;
	
    DECLARE VehiclePrice INTEGER DEFAULT 0;

	
	select count(*) into SameFormNameVehicleCount from TO_RAWDATA_VEHICLE_SPECIFICATION_TS as A
	inner join TO_RAWDATA_TAXBASE_BASISPRICE as B on A.FormName = B.FormName
	where A.SpecMgmtNumber = IN_SpecMgmtNumber and A.VehicleType = IN_VehicleType
    and B.CountryOrigin = IN_CountryOrigin;
        
	IF SameFormNameVehicleCount > 1
	THEN
		
		select B.Price into VehiclePrice from TO_RAWDATA_VEHICLE_SPECIFICATION_TS as A
		inner join TO_RAWDATA_TAXBASE_BASISPRICE as B on A.FormName = B.FormName
		where A.SpecMgmtNumber = IN_SpecMgmtNumber and A.VehicleType = IN_VehicleType
		and B.CountryOrigin = IN_CountryOrigin
        and replace(B.Name,' ','') = replace(A.Name,' ','') limit 1;
	ELSE
		
		select B.Price into VehiclePrice from TO_RAWDATA_VEHICLE_SPECIFICATION_TS as A
		inner join TO_RAWDATA_TAXBASE_BASISPRICE as B on A.FormName = B.FormName
		where A.SpecMgmtNumber = IN_SpecMgmtNumber and A.VehicleType = IN_VehicleType
		and B.CountryOrigin = IN_CountryOrigin;
	END IF;

	return VehiclePrice;
END//
DELIMITER ;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
