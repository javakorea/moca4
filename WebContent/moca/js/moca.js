/* Moca library */
function Moca(){
/*  if(location.host.indexOf('localhost') == -1 && mocaConfig.license.split("961baa70d758b7d5fb731cd55929c746f94818f52f9c040f80aaeab817f3ec9c3bb80ce19879542f17e6683237485c419e80bd73f262c5f927da0f4cd580f841")[0] != hex_sha512(location.host).toString()){
        alert('license is not valid!');
        return;
    }*/
    this.processMap = {};
    if(!(this instanceof Moca)){
        return new Moca();
    }
    this.display = {
        "YYYY-MM-DD":function(_value){
            var _val = $m.trim(_value);
            _val = _val.replace(/-/,'');
            if(_val.length > 7){
                var _val1 = _val.substring(0,4);
                var _val2 = _val.substring(4,6);
                var _val3 = _val.substring(6,8);
                _val = _val1+'-'+_val2+'-'+_val3;
            }
            return _val;
        }
    }
    this._domain = location.origin;
    this._contextRoot = mocaConfig._contextRoot;
    this.testMode = false;
    this.pageId = '';
    this.srcId = '';
    this.messages = [];
    this.messagesMap = {};
    this.header = {
            "th_tr_tcd":"S","th_if_tcd":"0","th_sys_tcd":"D",
            "guid":"CUI20190719123949390020605030104",
            "th_dum_tr_tcd":"0","th_btn_auth_tcd":"R","mda_tcd":"011",
            "th_tr_id":"PBCQ8001","th_cont_tr_tcd":"1","th_qry_c":"10",
            "onln_user_id":"hjsol","cont_trkey":[],
            "blng_dept_cod":"100","th_scr_no":"LOGIN000"
    };
    this.ticking = false;
    this.resizeCursor = 'e-resize';
    this.resizePadding = '2';
    this.codeCd = 'code';
    this.codeNm = 'codeNm';
    this.rowSelectedColor = '#434e5f';
    this.curColForResize;
    this.resizingbarDiv;
    this.resizingbarDivOffsetLeft;
    this.callbacks = {};
    this.data = {};
    var ___m = this;
    document.addEventListener('click', function (e) {
        ___m.filterClose(e.srcElement);
        ___m.calendarClose(e.srcElement);
        ___m.multicalendarClose(e.srcElement);
    });
    document.addEventListener('focus', function (e) {
        console.log(this,e);
    });
    
    $(window).bind('resize', function() {
        $m.redrawGrid();
    });
    
    Moca.prototype.filterClose = function(_o){
        $('.itemTable').css('display','none');
    };
    document.addEventListener('mousemove', function (e) {
        
        if($(e.srcElement).hasClass('moca_tree_tbx')){
            //트리이동일경우만 이벤트전파허용 drag는 이벤트 전파되야함
            
        }else{
            //e.preventDefault();//팝업 드레그하여 블록 씌우기
            
        }
        if (___m.curColForResize) {
            var offsetWidth = e.clientX - ___m.curColForResize.curColXForResize;
            var reWidth = ___m.curColForResize.aWidth +offsetWidth;
            $(___m.curColForResize).width(reWidth);
        }else if (___m.resizingbarDiv) {
            ___m.showDashed(e.clientX);
            document.body.style.cursor = ___m.resizeCursor;
            e.preventDefault();
        }
    });
    
    
    document.addEventListener('mouseup', function (e) { 
        if(___m.curColForResize != null && ___m.curColForResize.tagName == 'TH'){
            //console.log('document mouseup ___m.curColForResize',___m.curColForResize);
            var fromWidth = ___m.curColForResize.curColXForResize;  
            var toWidth = event.clientX;
            var wid = toWidth - fromWidth;
            var colIndex = ___m.curColForResize.colIndex;
            
            var aTable = $(___m.curColForResize).parent().parent().parent();
            //$('.moca_grid_body').children()[0];
            var colArray = $(aTable).find('col');
            for(var i=0; i < colArray.length; i++){
                var row = colArray[i];
                if(i == colIndex){
                    var w = $(row).css('width').replace(/px/g,'');
                    var reWidth = parseFloat(w)+wid;
                    $(row).css('width',reWidth);
                    break;
                }
            }
            
            ///////////////////////////////////////////////////
            $m.hideDashed();
        }else if (___m.resizingbarDiv) {
            var leftMdi     = ___m.resizingbarDiv.previousElementSibling;
            var rightMdi    = ___m.resizingbarDiv.nextElementSibling;
            var offsetStart = ___m.resizingbarDivOffsetLeft;
            var reWidthPercent = e.screenX;
            var mdiLeftGep = offsetStart -reWidthPercent;
            var currentMdiLeft = Number($(leftMdi).css('width').replace('px',''));
            var currentMdiRight = Number($(rightMdi).css('width').replace('px',''));
            var reCurrentMdiLeft = currentMdiLeft - mdiLeftGep;
            var reCurrentMdiRight = currentMdiRight + mdiLeftGep;
            $(leftMdi).css('width',(reCurrentMdiLeft)+"px");
            $(rightMdi).css('width',(reCurrentMdiRight)+"px");
            ___m.resizingbarDiv = null;
            document.body.style.cursor = '';
            $m.hideDashed();
            e.preventDefault();
        }
        
        //달력닫기처리
        /*
        var _se = event.srcElement;
        var _onclick = _se.getAttribute("onclick");
        var _type = _se.getAttribute("type");
        var _class = _se.getAttribute("class");
        if(_onclick != "$m.fn_inputCal(this);" && sampleCalendar && _type != 'button' && _class != null && !_class.startsWith('moca_calendar')){
            sampleCalendar.calendarVariableResset();
        }
        */
    });
    
};


/**
 * @target 날짜 관련 공통 함수
 */

/**
 * @type dateLib
 */
var dateLib = {};
dateLib.years;
/**
 * 오늘 날짜(년월일시분초)를 YYYYMMDDHH24MISS 포맷의 문자열로 반환한다.
 * 
 * @date 2014. 12. 10.
 * @memberOf dateLib
 * @return <String> YYYYMMDDHH24MISS
 */
dateLib.getDate = function() {

    var today = new Date();
    var year = today.getFullYear();
    var month = (today.getMonth() + 1);
    var day = today.getDate();
    var hour = today.getHours();
    var min = today.getMinutes();
    var second = today.getSeconds();
    var millisecond = today.getMilliseconds();

    if (parseInt(month) < 10)
        month = "0" + month;
    if (parseInt(day) < 10)
        day = "0" + day;
    if (parseInt(hour) < 10)
        hour = "0" + hour;
    if (parseInt(min) < 10)
        min = "0" + min;
    if (parseInt(second) < 10)
        second = "0" + second;
    if (parseInt(millisecond) < 10) {
        millisecond = "00" + millisecond;
    } else {
        if (parseInt(millisecond) < 100)
            millisecond = "0" + millisecond;
    }

    return String(year) + String(month) + String(day) + String(hour) + String(min) + String(second);
};

/**
 * 날짜형 변수로 변환한다. (yyyyMMdd)
 * 
 * @date 2014. 12. 10.
 * @memberOf dateLib
 * @param <String> pdate 날짜
 * @param <String> flag 구분자(/, .)
 * @return <String> 날짜형 변수
 * @example 
 * dateLib.makeDateFormat("20120719", "/") ==> 2012/07/19
 */
dateLib.makeDateFormat = function(pdate, flag) {
    var yy = "", mm = "", dd = "", yymmdd;
    var ar;
    if (pdate.indexOf(".") > -1) { // yyyy.mm.dd
        ar = pdate.split(".");
        yy = ar[0];
        mm = ar[1];
        dd = ar[2];
        if (mm < 10)
            mm = "0" + mm;
        if (dd < 10)
            dd = "0" + dd;
    } else if (pdate.indexOf("-") > -1) { // yyyy-mm-dd
        ar = pdate.split("-");
        yy = ar[0];
        mm = ar[1];
        dd = ar[2];
        if (mm < 10)
            mm = "0" + mm;
        if (dd < 10)
            dd = "0" + dd;
    } else if (pdate.length == 8) {
        yy = pdate.substr(0, 4);
        mm = pdate.substr(4, 2);
        dd = pdate.substr(6, 2);
    }
    var p = "/";
    if ((typeof flag != "undefined" && flag != "" && flag != null)) {
        p = flag;
    }

    yymmdd = yy + p + mm + p + dd;
    // yymmdd = new Date(yymmdd);

    return yymmdd;
};

/**
 * 특정일자에 날짜를 더한다.
 * 
 * @date 2014. 12. 10.
 * @memberOf dateLib
 * @param <String> 년월일 (yyyyMMdd)
 * @param <Number> arg 더할 날짜
 * @return YYYYMMDD
 */
dateLib.addDay = function(pYmd, offset) {

    var yyyy = pYmd.substr(0, 4);
    var mm = eval(pYmd.substr(4, 2) + "- 1");
    var dd = pYmd.substr(6, 2);

    var dt3 = new Date(yyyy, mm, eval(dd + '+' + offset));

    yyyy = dt3.getFullYear();

    mm = (dt3.getMonth() + 1) < 10 ? "0" + (dt3.getMonth() + 1) : (dt3.getMonth() + 1);
    dd = dt3.getDate() < 10 ? "0" + dt3.getDate() : dt3.getDate();

    return "" + yyyy + "" + mm + "" + dd;
};

/**
 * 오늘 일자에 날짜를 던한다.
 * 
 * @date 2014. 12. 10.
 * @memberOf dateLib
 * @param <Number> arg 더할 날짜
 * @return YYYYMMDD
 */
dateLib.addToDay = function(arg) {

    var sz_ymd;
    if (arg == "")
        arg = 0;

    var date = new Date();
    date.setFullYear(date.getFullYear());// y년을 더함
    date.setMonth(date.getMonth());// m월을 더함
    date.setDate(date.getDate() + arg);// d일을 더함

    sz_ymd = "" + date.getFullYear();

    if (date.getMonth() < 9) {
        sz_ymd += "0" + (date.getMonth() + 1);
    } else {
        sz_ymd += (date.getMonth() + 1);
    }
    if (date.getDate() < 10) {
        sz_ymd += "0" + date.getDate();
    } else {
        sz_ymd += "" + date.getDate();
    }
    return sz_ymd;
};

dateLib.addMonth = function(to_y,to_m,to_d,_addMonth) {

    var sz_ymd;

    var date = new Date();
    date.setFullYear(parseInt(to_y));// y년을 더함
    date.setMonth(parseInt(to_m)-1+_addMonth);// m월을 더함
    date.setDate(parseInt(to_d));// d일을 더함

    sz_ymd = "" + date.getFullYear();

    if (date.getMonth() < 9) {
        sz_ymd += "0" + (date.getMonth() + 1);
    } else {
        sz_ymd += (date.getMonth() + 1);
    }
    if (date.getDate() < 10) {
        sz_ymd += "0" + date.getDate();
    } else {
        sz_ymd += "" + date.getDate();
    }
    return sz_ymd;
};

/**
 * 오늘날짜에서 년/월/일을 자유롭게 더하고 뺀 결과를 문자열로 반환한다.
 * 
 * @date 2014. 12. 10.
 * @memberOf dateLib
 * @param year 가감할년수
 * @param month 가감할월수
 * @param day 가감할일수
 * @return YYYYMMDD
 */
dateLib.calcToday = function(year, month, day) {
    var sz_ymd;
    if (year == "")
        year = 0;
    if (month == "")
        month = 0;
    if (day == "")
        day = 0;

    var date = new Date();
    date.setFullYear(date.getFullYear() + year);// y년을 더함
    date.setMonth(date.getMonth() + month);// m월을 더함
    date.setDate(date.getDate() + day);// d일을 더함

    sz_ymd = "" + date.getFullYear();

    if (date.getMonth() < 9) {
        sz_ymd += "0" + (date.getMonth() + 1);
    } else {
        sz_ymd += (date.getMonth() + 1);
    }
    if (date.getDate() < 10) {
        sz_ymd += "0" + date.getDate();
    } else {
        sz_ymd += "" + date.getDate();
    }
    return sz_ymd;
};


/**
 * 두 개의 날짜를 비교한다.
 * 
 * @date 2014. 12. 10.
 * @memberOf dateLib
 * @param <String> fromDate 시작일자
 * @param <String> toDate 종료일자
 * @description fromDate 가 toDate 보다 큰지 체크
 * @example dateLib.compareDate( "20110204", "20110305" )
 * @return <String> 9 : 비교 조건부족, 0 : 오류, 1 : 정상
 */
dateLib.compareDate = function(fromDate, toDate) {
    var flag = "9";
    if (fromDate != "" && toDate != "") {
        if (fromDate > toDate)
            flag = "0";
        else
            flag = "1";
    }
    return flag;
};

/**
 * 두 날짜 사이의 차일을 리턴한다
 * 
 * @date 2014. 12. 10.
 * @memberOf dateLib
 * @param <String> fromdate 시작날짜
 * @param <String> todate 종료날짜
 * @return 종료날짜에서 시작날짜의 차일
 * @example dateLib.minusDates("20120102", "20121201")
 */
dateLib.minusDates = function(fromdate, todate) {

    var tmpFromDate = new Date(parseInt(Number(fromdate.substring(0, 4))), parseInt(Number(fromdate.substring(4, 6))) - 1, parseInt(Number(fromdate
            .substring(6))));
    var tmpNextDate = new Date(parseInt(Number(todate.substring(0, 4))), parseInt(Number(todate.substring(4, 6))) - 1, parseInt(Number(todate.substring(6))));
    var days = (tmpNextDate - tmpFromDate) / (3600 * 24 * 1000);

    return days;
};

/**
 * 입력받은 from월로부터 입력to월까지 개월 수를 반환한다.
 * 
 * @date 2014. 12. 10.
 * @memberOf dateLib
 * @param <String> fMonth 시작월
 * @param <String> tMonth 종료월
 * @return <number> 개월 수
 * @example dateLib.getMonthTerm("201102", "201303")
 */
dateLib.getMonthTerm = function(fMonth, tMonth) {
    var iMonth = 0; // 계산된 개월수
    var iYear = 0; // 계산된 년도
    var rMonth = 0; // 반환할 개월수

    if (parseInt(fMonth) <= parseInt(tMonth)) {
        iYear = parseInt(tMonth.substr(0, 4)) - parseInt(fMonth.substr(0, 4));
        iMonth = parseInt(tMonth.substr(4, 2), 10) - parseInt(fMonth.substr(4, 2), 10);
        rMonth = (12 * iYear) + iMonth + 1;
        return rMonth;
    } else {
        return 0;
    }
};

/**
 * 입력받은 fromQuarter로부터 입력toQuarter까지 Quarter수반환하기
 * 
 * @date 2014. 12. 10.
 * @memberOf dateLib
 * @param <String> fQuarter 시작 Quarter
 * @param <String> tQuerter 종료 Quarter
 * @return 총 Quarter 수
 * @example dateLib.getQuarterTerm( "20111", "20132" )
 */
dateLib.getQuarterTerm = function(fQuarter, tQuarter) {
    var iQuarter = 0; // 계산된 Quarter수
    var iYear = 0; // 계산된 년도
    var rQuarter = 0; // 반환할 Quarter수

    if (parseInt(fQuarter) <= parseInt(tQuarter)) {
        iYear = parseInt(tQuarter.substr(0, 4)) - parseInt(fQuarter.substr(0, 4));
        iQuarter = parseInt(tQuarter.substr(4, 1), 10) - parseInt(fQuarter.substr(4, 1), 10);
        rQuarter = (4 * iYear) + iQuarter + 1;
        return rQuarter;
    } else {
        return 0;
    }
};

/**
 * 날짜형식 체크한다. (yyyyMMdd)
 * 
 * @date 2014. 12. 10.
 * @memberOf dateLib
 * @param <String> str 날짜
 * @return 정상이면 true, 그외는 false
 * @example dateLib.isDate("20120719")
 */
dateLib.isDate = function(str) {
    var year_data = "";
    var month_data = "";
    var date_data = "";
    var i;

    str = objString.prototype.replaceAll(str, "/", "");
    str = objString.prototype.replaceAll(str, "-", "");
    str = objString.prototype.replaceAll(str, ".", "");
    if (str.length != 8)
        return false;

    for (i = 0; i < 8; i++) {
        var c = str.charAt(i);
        if (c < '0' || c > '9') {
            return false;
        }
        if (i < 4)
            year_data += c;
        else if (i >= 4 && i < 6)
            month_data += c;
        else if (i >= 6)
            date_data += c;
    }

    var mnthst = month_data;
    var mnth = parseInt(mnthst, 10);
    var dy = parseInt(date_data, 10);

    if (mnth < 1 || mnth > 12 || dy < 1 || dy > 31) {
        return false;
    }

    if (mnth != 2) {
        if (mnth == 4 || mnth == 6 || mnth == 9 || mnth == 11) {
            if (dy > 30) {
                return false;
            }
        } else if (mnth == 1 || mnth == 3 || mnth == 5 || mnth == 7 || mnth == 8 || mnth == 10 || mnth == 12) {
            if (dy > 31) {
                return false;
            }
        }
    } else {
        var yr1 = parseInt(year_data);
        var maxdy;
        if ((yr1 % 400 == 0) || ((yr1 % 4 == 0) && (yr1 % 100 != 0))) {
            maxdy = 29;
        } else {
            maxdy = 28;
        }

        if (dy > maxdy) {
            return false;
        }
    }
    return true;
};
dateLib.getQuarter = function(__now_month) {
    var _now_month = parseInt(__now_month);
    if(_now_month > 0 && _now_month < 4){
        return "1";
    }else if(_now_month > 3 && _now_month < 7){
        return "2";
    }else if(_now_month > 6 && _now_month < 10){
        return "3";
    }else if(_now_month > 9 && _now_month < 13){
        return "4";
    }else{
        return "";
    }
};
/* ==========================================================================================
 * 해당 프로젝트에서 새로 만든 메소드들을 정의한다.
 * ========================================================================================== */

dateLib.getToday = function(_sepa) {

    var today = new Date();
    var year = today.getFullYear();
    var month = (today.getMonth() + 1);
    var day = today.getDate();
 
    if (parseInt(month) < 10)
        month = "0" + month;
    if (parseInt(day) < 10)
        day = "0" + day;

    var todayStr = '';
    if(_sepa != null){
        todayStr = String(year) + _sepa + String(month) + _sepa + String(day);
    }else{
        todayStr = String(year) + String(month) + String(day);
    }
    return todayStr;
};


dateLib.addDayFormat = function(pYmd, offset,_deli) {
    if(_deli == null){
        _deli = '';
    }
    var yyyy = pYmd.substr(0, 4);
    var mm = comLib.gfn_toTwoChar(eval(pYmd.substr(4, 2) + "- 1"));
    var dd = comLib.gfn_toTwoChar(pYmd.substr(6, 2));

    var dt3 = new Date(yyyy, mm, eval(dd + '+' + offset));

    yyyy = dt3.getFullYear();

    mm = (dt3.getMonth() + 1) < 10 ? "0" + (dt3.getMonth() + 1) : (dt3.getMonth() + 1);
    dd = dt3.getDate() < 10 ? "0" + dt3.getDate() : dt3.getDate();

    return yyyy + _deli + mm + _deli + dd;
};



dateLib.getWeekTerm = function(pYmd,_isStart) {
    var yyyy = pYmd.substr(0, 4);
    var mm = eval(pYmd.substr(4, 2) + "- 1");
    var dd = pYmd.substr(6, 2);
    var dt3 = new Date(yyyy, mm, eval(dd));
    var startEndDate;
    if(_isStart){
        var dy = dt3.getDay();
        startEndDate = dateLib.addDayFormat (pYmd, -dy,'');
    }else{
        var dy = dt3.getDay();
        startEndDate = dateLib.addDayFormat (pYmd, +(6-dy),'');
    }
    return startEndDate;
};
dateLib.getFirstDayOfMonth = function(pYmd) {
    var yyyy = pYmd.substr(0, 4);
    var mm = eval(pYmd.substr(4, 2));
    if (parseInt(mm) < 10)
        mm = "0" + mm;
    return yyyy+mm+"01";
};
dateLib.getLastDayOfMonth = function(pYmd) {
    var yyyy = pYmd.substr(0, 4);
    var mm = eval(pYmd.substr(4, 2));
    if (parseInt(mm) < 10)
        mm = "0" + mm;
  
    var dt3 = new Date(yyyy, mm, 0);
    return yyyy+mm+dt3.getDate();
};
dateLib.getQuarterTerm = function(pYmd) {
    var termObj = {};
    var yyyy = pYmd.substr(0, 4);
    var mm = eval(pYmd.substr(4, 2));   
    var _now_month = parseInt(mm);
    if(_now_month > 0 && _now_month < 4){
        firtstDay = dateLib.getFirstDayOfMonth(yyyy+"0101");
        lastDay = dateLib.getLastDayOfMonth(yyyy+"0301");
    }else if(_now_month > 3 && _now_month < 7){
        firtstDay = dateLib.getFirstDayOfMonth(yyyy+"0401");
        lastDay = dateLib.getLastDayOfMonth(yyyy+"0601");
    }else if(_now_month > 6 && _now_month < 10){
        firtstDay = dateLib.getFirstDayOfMonth(yyyy+"0701");
        lastDay = dateLib.getLastDayOfMonth(yyyy+"0901");
    }else if(_now_month > 9 && _now_month < 13){
        firtstDay = dateLib.getFirstDayOfMonth(yyyy+"1001");
        lastDay = dateLib.getLastDayOfMonth(yyyy+"1201");
    }
    termObj['from'] = firtstDay;
    termObj['to'] = lastDay;
    
    return termObj;
};
dateLib.getFirstDayOfYear = function(pYmd) {
    var yyyy = pYmd.substr(0, 4);
    return yyyy+"01"+"01";
};
dateLib.getLastDayOfYear = function(pYmd) {
    var yyyy = pYmd.substr(0, 4);
    return yyyy+"12"+"31";
};
dateLib.getYears = function(dataListID) {
    if(sessionStorage["g_years_dataList"] == null){
        var years = WebSquare.util.getComponentById(dataListID); 
        var minYear = WebSquare.core.getConfiguration("/WebSquare/calendar/minYear/@value");
        var maxYear = WebSquare.core.getConfiguration("/WebSquare/calendar/maxYear/@value");
        var minYear_int = parseInt(minYear)+100;
        var maxYear_int = parseInt(maxYear)-850;
        for(var i=minYear_int,j=0;i < maxYear_int+1; i++,j++){
            years.insertData( j, [i+"",i+""] );
        };      
        console.dir(years);
        sessionStorage["g_years_dataList"] = JSON.stringify(years);
    }
    return sessionStorage["g_years_dataList"];
};


dateLib.getDay = function(_dayVal,_lang) {
    if(_dayVal == 0){
        if(_lang == 'han'){
            return "일요일";
        }else if(_lang == 'eng'){
            return "SUN";
        }else{
            return _dayVal;         
        }
    }else if(_dayVal == 1){
        if(_lang == 'han'){
            return "월요일";
        }else if(_lang == 'eng'){
            return "MON";
        }else{
            return _dayVal;         
        }
    }else if(_dayVal == 2){
        if(_lang == 'han'){
            return "화요일";
        }else if(_lang == 'eng'){
            return "TUE";
        }else{
            return _dayVal;         
        }
    }else if(_dayVal == 3){
        if(_lang == 'han'){
            return "수요일";
        }else if(_lang == 'eng'){
            return "WED";
        }else{
            return _dayVal;         
        }
    }else if(_dayVal == 4){
        if(_lang == 'han'){
            return "목요일";
        }else if(_lang == 'eng'){
            return "THU";
        }else{
            return _dayVal;         
        }
    }else if(_dayVal == 5){
        if(_lang == 'han'){
            return "금요일";
        }else if(_lang == 'eng'){
            return "FRI";
        }else{
            return _dayVal;         
        }
    }else if(_dayVal == 6){
        if(_lang == 'han'){
            return "토요일";
        }else if(_lang == 'eng'){
            return "SAT";
        }else{
            return _dayVal;         
        }
    }else{
        return _dayVal; 
    }
};


/**
 * 오늘 날짜(년월일)를 YYYYMMDD포맷의 문자열로 반환한다.
 * 
 * @date 2017. 06. 02.
 * @memberOf dateLib
 * @return <String> YYYYMMDD
 */
dateLib.getSysDate = function() {
    var param = {};
    var obj;
    $.ajax({
        type : 'POST',
        url : "/cmnCd/selectToday.do",
        dataType : "json",
        data : param,
        contentType : 'application/x-www-form-urlencoded;charset=utf-8',
        async : false,
        success : function (result) {
            var today = result.today;
            console.dir('---------------');
            console.dir(today);
            obj = today;
        },
        error : function (request, error) {}
    });
    return obj;
};


Moca.prototype.calendarClose = function(_o){
    var _id = sampleCalendar.calId;
    if((!$(_o).hasClass('moca_ica_btn') && _id != null && $.trim(_id) != "" && $(_o).closest('.moca_calendar').length != 1) ){
        $('.moca_calendar').remove();
        sampleCalendar.calId = null;
    }else if($(_o).hasClass('moca_ica_btn') && _id != null && $.trim(_id) != ""){
        $('.moca_calendar').remove();
        sampleCalendar.calId = null;
    }
};

Moca.prototype.multicalendarClose = function(_o){
    var _id = multiCalendar.calId;
    if((!$(_o).hasClass('moca_ica_btn') && _id != null && $.trim(_id) != "" && $(_o).closest('.moca_calendar_fromto').length != 1) ){
        $('.moca_calendar_fromto').remove();
        multiCalendar.calId = null;
    }else if($(_o).hasClass('moca_ica_btn') && _id != null && $.trim(_id) != ""){
        $('.moca_calendar_fromto').remove();
        multiCalendar.calId = null;
    }
};







Moca.prototype.sFunction = function(yscroll) { 
    if(yscroll==null){
        return;
    }
    
      //if (!$m.ticking) {
          //$m.ticking = true;
          //window.requestAnimationFrame(function() {
                $m.pageId = $(yscroll).attr("pageid");
                $m.srcId = $(yscroll).attr("srcid");
                //var _grd = document.getElementById(yscroll.getAttribute("componentid"));
                var _grdId = yscroll.getAttribute("componentid");
                var _grd = $m.getObj(_grdId,null,$m.pageId,$m.srcId);
                var onScrollEnd = _grd.getAttribute('onScrollEnd');
                var _default_cell_height = $m.getCellHeight(_grd);


      
                var topPosition = yscroll.scrollTop;
                var startIdx = parseInt(topPosition/_default_cell_height); 
                var remainder= parseInt(topPosition%_default_cell_height); 
                var yscrollIdx = _grd.getAttribute("yscrollIdx");
                if(yscrollIdx == null) yscrollIdx = 0;
                //if(yscrollIdx != startIdx){//확장시에 index가 같아도 다시 그리도록!
                    $m.setVirtualScroll(_grd);
                    
                //}
                //$m.ticking = false;
                var isEnd = false;
                

                //세로스크롤처리
				var _offsetHeight = yscroll.offsetHeight;
				var _scrollHeight = yscroll.scrollHeight;
				var _scrollTop = yscroll.scrollTop;
				if(_offsetHeight > _scrollHeight){
					_scrollHeight = _offsetHeight;
				}
				//console.log('remainder'+remainder);
                if ((yscroll.offsetHeight != _scrollHeight) && yscroll.offsetHeight + yscroll.scrollTop >= _scrollHeight && remainder > 0) {
                    isEnd = true;
                    $m.genTbody(_grd,_grd.list,startIdx+1,false);//0번째라인이 일부를 보여줄수없으므로 마지막한라인더 보여줘야 다 보여줄수있음
                }else{
                	$m.genTbody(_grd,_grd.list,startIdx,false);//마지막스크롤이 아니면 정상적인 인덱스로 보여줘야함
                }
                    
                if(isEnd){
                    var func = eval(onScrollEnd);
                    if(func != null){
                        func(function(){
                            var topPosition = yscroll.scrollTop;
                            var startIdx = parseInt(Math.ceil(topPosition/_default_cell_height)); 
                            var yscrollIdx = _grd.getAttribute("yscrollIdx");
                            if(yscrollIdx == null) yscrollIdx = 0;
                            
                            $m.setVirtualScroll(_grd);
                            $m.genTbody(_grd,_grd.list,startIdx+1,true);////0번째라인이 일부를 보여줄수없으므로 마지막한라인더 보여줘야 다 보여줄수있음
                        });
                    }
                }

          //});
     // }
};

Moca.prototype.wFunction = function(yscroll) {
    //var _grd = document.getElementById(yscroll.getAttribute("componentid"));
    
    var _grd = $m.getObj(yscroll.getAttribute("componentid"));
    var _default_cell_height = $m.getCellHeight(_grd);
    var val  =0;
    if (event.deltaY < 0) {
        val = yscroll.scrollTop - _default_cell_height;
    }else{
        val = yscroll.scrollTop + _default_cell_height;
    }
    try{
        //yscroll.scrollTo(0,val);//IE 비호환API
        yscroll.scrollTop = val;
    }catch(e){
        console.log('wFunction error:',e);
    }
};

Moca.prototype.genRows = function(_row,_row_pre,_row_next,_grd,_mode,_startIndex,_nowIndex,_beforeAfter) {
    if(_row["_system"] == null){
        _row["_system"] = {status: "", expand: "true", realIndex: _nowIndex+""};
    }else{
        _row["_system"]["realIndex"] = _nowIndex+"";
    }
    
    var row  = "<tr realRowIndex='"+_nowIndex+"'>";
    var tdCnt = $(_grd).find('table').find('th').length;
    var ks = Object.keys(_grd.cellInfo);
    var cellCnt = ks.length;
    var cellHeight = _grd.getAttribute('default_cell_height');
    if(cellHeight == null){
        console.log('grid('+_grd.id+')에 default_cell_height가 지정되지않았습니다. 26px로 지정합니다.');
        cellHeight = "26px";
    }
    var ch = parseFloat(cellHeight.replace(/px/g,''))-2;
    if(Array.isArray(_row)){
        for(var i=0,j=cellCnt;i < j; i++){          
            var cell = _row[i]+"";
            var cellTd = _grd.cellInfo[i];
            if(cell == null || cell == "null"){
                cell = "";
            }
            cell = cell.replace(/<(\/)?br(\/)?>/gi,'&lt;br&gt;');
            row += '<td headers="col3" id="td'+i+'" celltype="input" style="height:'+cellHeight+'"><input type="text" class="moca_input" style="height:'+ch+'px" value="'+cell+'"></td>';
        }
    }else{
        
        for(var i=0,j=ks.length;i < j; i++){
            var key = ks[i];
            var cell;
            if(key == "status"){
                if(_row["_system"][key] != null){
                    cell = _row["_system"][key]+"";
                }else{
                    cell = "";
                }
            }else{
                if(_row[key] != null){
                    cell = _row[key]+"";
                }else{
                    cell = "";
                }
            }
            

            var cellTd = _grd.cellInfo[key];
            var readOnly = undefined;
            var _celltype = undefined;
            var _id = undefined;
            var _class = undefined;
            var _name = undefined;
            var _toolTip = undefined;
            var _displayFormat = undefined;
            
            var _keyMask = undefined;
            var _displayFunction = undefined;
            var _displayFunctionApply;
            var _disabledFunction = undefined;
            
            var _align = undefined;
            var addRowEditable = undefined;
            var _style = undefined;
            var _required = undefined;
            var _popupUrl = undefined;
            var _popupData = undefined;
            var _levelId = undefined;
            var _labelId = undefined;
            var _maxLength;
            var _editorMode = undefined;
            if(cellTd == null){
                cell = "";
            }else if(cellTd != null){
                cell = cell.replace(/<(\/)?br(\/)?>/gi,'&lt;br&gt;');
                readOnly = cellTd.getAttribute("readOnly");
                _celltype = cellTd.getAttribute("celltype");
                _id = cellTd.getAttribute("id");
                (cellTd.getAttribute("class") != null?_class = cellTd.getAttribute("class"):_class="");
                _name = cellTd.getAttribute("name");
                _toolTip = cellTd.getAttribute("toolTip");
                _displayFormat = cellTd.getAttribute("displayFormat");
                _keyMask = cellTd.getAttribute("keyMask");
                _displayFunction = cellTd.getAttribute("displayFunction");
                _disabledFunction = cellTd.getAttribute("disabledFunction");
                _displayFunctionApply = cellTd.getAttribute("displayFunctionApply");
                _maxLength = cellTd.getAttribute("maxLength");
                _editorMode = cellTd.getAttribute("editorMode");
                _addRowEditable = cellTd.getAttribute("addRowEditable");
                _align = cellTd.getAttribute("align");
                
                
                _style = cellTd.getAttribute("style");
                var aCol = $(_grd).find('.moca_grid_body colgroup').find('col[columnkey='+_id+']');
    	        if($m.getDevice() == "pc"){
    	        	$m.moblePcHide(aCol[0],"hide");
    	        	if(aCol.attr("hide") == "true"){
    	        		_style = _style.replace("display: table-cell","display: none");
    	        	}else{
    	        		_style = _style.replace("display: none","display: table-cell");
    	        	}
    	        }else{
    	        	$m.moblePcHide(aCol[0],"mobileHide");
    	        	if(aCol.attr("mobileHide") == "true"){
    	        		_style = _style.replace("display: table-cell","display: none");
    	        	}else{
    	        		_style = _style.replace("display: none","display: table-cell");
    	        	}
    	        }
    			
    	        
    	        
    	        
                _required = cellTd.getAttribute("required");
                

                _popupUrl = cellTd.getAttribute("popupUrl");
                _popupData = cellTd.getAttribute("popupData");
                
                _callFunction = cellTd.getAttribute("callFunction");
                
                _levelId = cellTd.getAttribute("levelId");
                _labelId = cellTd.getAttribute("labelId");
            }
            
            var _keyMaskStr = '';
            if(_keyMask != null){
                _keyMaskStr = _keyMask;
            }
            
            var _level = '';
            if(_levelId != null){
                _level = _row[_levelId]+"";
            }
            var _label = '';
            if(_labelId != null){
                _label = _row[_labelId];
            }           
            
            if(_row["_system"]["status"] == 'C' && key != 'status' && _addRowEditable != "false"){
                readOnly = "false";
                _toolTip = "false";
            }
            
            
            if(_grd.list[_nowIndex]["_system"][_id]){
                if(_grd.list[_nowIndex]["_system"][_id]['readonly'] != null){
                    readOnly = _grd.list[_nowIndex]["_system"][_id]['readonly'];
                }
            }

            
            
            if(_celltype == 'select'){
                row += '<td id="'+_id+'" class="'+_class+'" name="'+_name+'" toolTip="'+_toolTip+'" celltype="'+_celltype+'" displayFormat="'+_displayFormat+'" keyMask="'+_keyMask+'" displayFunction="'+_displayFunction+'" readOnly="'+readOnly+'"  style="'+_style+'"  >';
                if($(_grd)[0][_id] != null){
                    var arr = $(_grd)[0][_id].list;
                    if(arr == null){
                        arr = [];
                    }
                    var codeOpt = $(_grd)[0][_id].codeOpt;
                    var _allOpt;
                    if(codeOpt != null){
                        _allOpt = codeOpt.allOption;
                    }
                    
                    _grd[_id]["map"] = $m.listToMap(arr,codeOpt);
                    
                    var _metaInfo;
                    if(codeOpt != null){
                        _metaInfo = codeOpt.metaInfo;
                    }
                    
                    var _codeCd = $m.codeCd;
                    var _codeNm = $m.codeNm;
                    if(_metaInfo != null){
                        _codeCd = _metaInfo.codeCd;
                        _codeNm = _metaInfo.codeNm;
                    }
                    var cd = '';
                    var nm = '';
                    var label = '';
                    
                    var selectTag = "";
                    var isAllOpt = false;
                    if(_allOpt != null){
                    	var _reLabel = '';
                    	if(_allOpt.displayFormat != null && _allOpt.displayFormat != 'null'){
                            _reLabel = _allOpt.displayFormat.replace('[value]',_allOpt.value).replace('[label]',_allOpt.label);
                        }else{
                            _reLabel = _allOpt.label;
                        }
                        selectTag   = '<input type="text" class="moca_select" style="background-color:pink" readonly value="'+_reLabel+'" onfocus="$m.openSelect(this)" >';
                        cd = _allOpt.value;
                        nm = _allOpt.label;
                        label = _reLabel;
                        isAllOpt = true;
                    }
                    var selectFlag = false;
                    for(var c_d = 0, c_d_l= arr.length; c_d < c_d_l; c_d++){
                        var aData = arr[c_d];
                        var _reLabel = '';
                        var _cd = aData[_codeCd];
                        var _nm = aData[_codeNm];
                        
                        
                        if(_displayFormat != null && _displayFormat != 'null'){
                            _reLabel = _displayFormat.replace('[value]',_cd).replace('[label]',_nm);
                        }else{
                            _reLabel = _nm;
                        }
                        
                  
                        if(cell == aData[_codeCd]){
                            selectFlag = true;
                            selectTag   = $m.getInputSelectTag(_reLabel,_required);
                            cd = _cd;
                            nm = _nm;
                            label = _reLabel;

                            break;
                        }
                        
                    }   
                    
                    if(!selectFlag){
                        selectTag   = $m.getInputSelectTag("-선택-",_required);
                        if(!isAllOpt){
                            cd = "";
                            nm = "-선택-";
                            label = nm;
                        }
                    }
                    
                    if(readOnly == "true"){
                        row += label;
                    }else{
                        row += $m.getSelectDivTagForCombo(label,_required,cd,nm,ch);
                        row += selectTag;
                    }
                }
                row += '</div></td>';
            }else if(_celltype == 'input'){
                var _reLabel = '';
                try{
                    if(_displayFunction != null && eval(_displayFunction) != null){
                        _reLabel = eval(_displayFunction)(cell,_grd,_row["_system"]["realIndex"],_id);  
                    }else{
                        _reLabel = cell;    
                    }
                    
                }catch(e){
                    console.log("1009:"+e);
                }

                var _inTag = '';
                var _renderingDiv = $(_grd).attr('rendering_div');
                if(_renderingDiv){
                	if(readOnly == "true"){
                        _inTag = '<div>'+_reLabel+'</div>';
                    }else{
						var _req = '';
                        if(_required == 'true'){
							_req = ' req';	
                        }
                        _inTag = '<div type="input" class="moca_input'+_req+'">'+_reLabel+'</div>';
                    }
                }else{
                	if(readOnly == "true"){
                        _inTag = '<div>'+_reLabel+'</div>';
                    }else{
                        if(_required == 'true'){
                            _inTag = '<input type="text" maxLength="'+$m.trim(_maxLength)+'" onblur="$m.setValue(this,this.value,\''+_keyMaskStr+'\');" onkeydown="$m.keydown(this,this.value,\''+_keyMaskStr+'\');" displayFunction=\''+_displayFunction+'\'  displayFunctionApply=\''+_displayFunctionApply+'\' class="moca_input req" style="'+_style+'" value="'+_reLabel+'" onkeyup="$m._uptData(this)" onfocus="$m._evt_selectFocus(this)">';
                        }else{
                            _inTag = '<input type="text" maxLength="'+$m.trim(_maxLength)+'" onblur="$m.setValue(this,this.value,\''+_keyMaskStr+'\');" onkeydown="$m.keydown(this,this.value,\''+_keyMaskStr+'\');" displayFunction=\''+_displayFunction+'\'  displayFunctionApply=\''+_displayFunctionApply+'\' class="moca_input" style="'+_style+'" value="'+_reLabel+'" onkeyup="$m._uptData(this)" onfocus="$m._evt_selectFocus(this)">';
                        }
                    }
                }
                
                
                
                row += '<td id="'+_id+'" class="'+_class+'" name="'+_name+'"  toolTip="'+_toolTip+'" celltype="'+_celltype+'" displayFunction=\''+_displayFunction+'\'  displayFunctionApply=\''+_displayFunctionApply+'\' editorMode="'+_editorMode+'" style="'+_style+'"  readOnly="'+readOnly+'" onclick="$m.defaultCellClick(this)">'+_inTag+'</td>';
            }else if(_celltype == 'inputButton'){
                var _reLabel = '';
                if(_displayFunction != null && eval(_displayFunction) != null){
                    _reLabel = eval(_displayFunction)(cell);        
                }else{
                    _reLabel = cell;        
                }
                var _inTag = '';
                var _renderingDiv = $(_grd).attr('rendering_div');
                
                if(readOnly == "true"){
                    _inTag = _reLabel;
                }else{
                    if(_required == 'true'){
                        _inTag = '<div class="moca_ibn req">';
                        if(_renderingDiv){
                        	_inTag += '<div type="text" class="moca_input" readonly style="'+_style+'" value="'+_reLabel+'" onkeyup="$m._uptData(this)" onfocus="$m._evt_selectFocus(this)">'+_reLabel+'</div>';
                        }else{
                        	_inTag += '<input type="text" class="moca_input" readonly style="'+_style+'" value="'+_reLabel+'" onkeyup="$m._uptData(this)" onfocus="$m._evt_selectFocus(this)">';
                        }
                    }else{
                        _inTag = '<div class="moca_ibn">';
                        if(_renderingDiv){
                        	_inTag += '<div type="text" class="moca_input" readonly  style="'+_style+'" value="'+_reLabel+'" onkeyup="$m._uptData(this)" onfocus="$m._evt_selectFocus(this)">'+_reLabel+'</div>';
                        }else{
                        	_inTag += '<input type="text" class="moca_input" readonly  style="'+_style+'" value="'+_reLabel+'" onkeyup="$m._uptData(this)" onfocus="$m._evt_selectFocus(this)">';
                        }
                        
                    }
                    if($m.trim(_callFunction) != ''){
                        _inTag += '<button type="button" class="moca_ibn_btn" onclick="'+_callFunction+'(this)" onfocus="$m._evt_selectFocus(this)">검색</button></div>';
                    }
                    
                }
                row += '<td id="'+_id+'" class="'+_class+'" name="'+_name+'"  toolTip="'+_toolTip+'" celltype="'+_celltype+'" style="'+_style+'"  readOnly="'+readOnly+'">'+_inTag+'</td>';
            }else if(_celltype == 'button'){
                var btnLabel = cellTd.getAttribute("btnLabel");
                var _reLabel = '';
                
                var isDisabled = "";
                var _isdis = false;
                
                try{
                    if(_disabledFunction != null && eval(_disabledFunction) != null){
                        _isdis = eval(_disabledFunction)(cell,_grd,_row["_system"]["realIndex"]);
                        if(_isdis){
                            isDisabled = "disabled"
                        }
                    }
                    _reLabel = cell;        
                }catch(e){
                    console.log("1132:"+e);
                }
                var _inTag = '';
                if(readOnly == "true"){
                    _inTag = _reLabel;
                }else{
                    if($m.trim(_callFunction) != ''){
                        _inTag = '<div class="grid_btn">';
                        _inTag += '<button type="button" onclick="'+_callFunction+'(this,\''+_nowIndex+'\',\''+_id+'\')" onfocus="$m._evt_selectFocus(this)" '+isDisabled+'>'+btnLabel+'</button>';
                        _inTag += '</div>';
                    }
                }
                row += '<td id="'+_id+'" class="'+_class+'" name="'+_name+'"  toolTip="'+_toolTip+'" celltype="'+_celltype+'" style="'+_style+'"  readOnly="'+readOnly+'"  disabledFunction="'+_disabledFunction+'">'+_inTag+'</td>';               
            }else if(_celltype == 'tree'){
                var _inTag = '';
                if($.trim(_label) != ''){
                    var icon_folder;
                    var preLevel = (_row_pre != null)? _row_pre[_levelId]:0;
                    var nextLevel = (_row_next != null)? _row_next[_levelId]:0;
                    /*
                    if((_level > preLevel && _level == nextLevel)){
                        console.log("~1",_row);
                    }else if(_level > nextLevel){
                        console.log("~2",_row);
                    }else if((_row_pre != null && _row_pre["_system"]["isLeaf"] == "true" && _level == preLevel)){
                        
                        console.log("~3",_row);
                    }else if((_row_pre != null && _row_pre["_system"]["isLeaf"] == "true" && _level == preLevel && _level == nextLevel)){
                        console.log("~4",_row);
                    }*/ 
                    if( (_level > preLevel && _level == nextLevel) || _level > nextLevel || (_row_pre != null && _row_pre["_system"]["isLeaf"] == "true" && _level == preLevel)
                            || (_row_pre != null && _row_pre["_system"]["isLeaf"] == "true" && _level == preLevel && _level == nextLevel)){
                        icon_folder = 'moca_grid_leaf';                 
                        _row["_system"]["isLeaf"] = "true";
                    }else{
                        var isExp;
                        var usetree = _grd.getAttribute("usetree");
                        if(usetree == "true"){
                            isExp = _row["_system"]["expand"];
                        }else{
                            isExp = "true";
                        }
                        if(isExp == "false"){
                            icon_folder = 'moca_grid_plus';
                        }else{
                            icon_folder = 'moca_grid_minus';
                        }
                        _row["_system"]["isLeaf"] = "false";
                    }
                    var line = '';
                    if(_level == 1){
                        line = '';
                    }else if(_level == 2){
                        if(_row["_system"]["isLeaf"] == "true"){
                            line = '<div class="moca_grid_last"></div>';
                        }else{
                            line = '<div class="moca_grid_midddle"></div>';
                        }
                    }else {
                        var lineNum = _level-2;
                        for(var i2=0; i2 < lineNum; i2++){
                            line += '<div class="moca_grid_line"></div>';
                        }
                        if(_row["_system"]["isLeaf"] == "true"){
                            line += '<div class="moca_grid_last"></div>';
                        }else{
                            line += '<div class="moca_grid_midddle"></div>';
                        }                   
                    }
                    var ct_nm = '';
                    if(_level == 1 && cellTd.getAttribute("depth1IconClass") != null){
                        ct_nm = '<span class="category '+cellTd.getAttribute("depth1IconClass")+'">'+cellTd.getAttribute("depth1IconClass")+'</span>';
                    }else if(_level == 2 && cellTd.getAttribute("depth2IconClass") != null){
                        ct_nm = '<span class="category '+cellTd.getAttribute("depth2IconClass")+'">'+cellTd.getAttribute("depth2IconClass")+'</span>';
                    }else if(_level == 3 && cellTd.getAttribute("depth3IconClass") != null){
                        ct_nm = '<span class="category '+cellTd.getAttribute("depth3IconClass")+'">'+cellTd.getAttribute("depth3IconClass")+'</span>';      
                    }else if(_level == 4 && cellTd.getAttribute("depth4IconClass") != null){
                        ct_nm = '<span class="category '+cellTd.getAttribute("depth4IconClass")+'">'+cellTd.getAttribute("depth4IconClass")+'</span>';
                    }else if(_level == 5 && cellTd.getAttribute("depth2IconClass") != null){
                        ct_nm = '<span class="category '+cellTd.getAttribute("depth5IconClass")+'">'+cellTd.getAttribute("depth5IconClass")+'</span>';  
                    }
                    
                    _inTag += '<span>'+line+'<div class="'+icon_folder+'" onclick="$m.grid_expand(this);"></div>'+ct_nm+'<label>'+_label+'</label></span>';
                }else{
                    _inTag += '';
                }
                row += '<td id="'+_id+'" class="'+_class+'" name="'+_name+'"  toolTip="'+_toolTip+'" celltype="'+_celltype+'" style="'+_style+'"  readOnly="'+readOnly+'" class="tal">'+_inTag+'</td>';
            }else if(_celltype == 'checkbox'){
                var _trueValue = cellTd.getAttribute("trueValue");
                var _falseValue = cellTd.getAttribute("falseValue");
                var _reLabel = '';
                var isDisabled = "";
                var _isdis = false;
                try{
                    if(_disabledFunction != null && eval(_disabledFunction) != null){
                        _isdis = eval(_disabledFunction)(cell,_grd,_row["_system"]["realIndex"]);
                        if(_isdis){
                            isDisabled = "disabled"
                        }
                    }
                    _reLabel = cell;        
                }catch(e){
                    console.log("1090:"+e);
                }

                var _inTag = '';
                var isChecked = "";
                
                if(_reLabel == _trueValue){
                    isChecked = "checked";
                }
                if(readOnly == "true"){
                    _inTag = _reLabel;
                }else{
                    _inTag = '<div class="moca_checkbox_grid">';
                    _inTag += '<input type="checkbox" class="moca_checkbox_input" name="cbx" id="cbx_'+$m.pageId+'_'+$m.srcId+'_'+_grd.id+'_'+_nowIndex+'" grd_id='+_grd.id+'  value="'+_trueValue+'"   '+isChecked+' '+isDisabled+' >';
                    _inTag += '<label class="moca_checkbox_label" for="cbx_'+$m.pageId+'_'+$m.srcId+'_'+_grd.id+'_'+_nowIndex+'"  >label</label>';
                    _inTag += '</div>';
                }
                row += '<td id="'+_id+'" class="'+_class+'" name="'+_name+'"  toolTip="'+_toolTip+'" celltype="'+_celltype+'" style="'+_style+'"  readOnly="'+readOnly+'" trueValue="'+_trueValue+'" falseValue="'+_falseValue+'"  disabledFunction="'+_disabledFunction+'" onclick="$m.defaultCellClick(this);" >'+_inTag+'</td>';
            }else if(_celltype == 'radio'){
                var _reLabel = '';
                var isDisabled = "";
                var _isdis = false;
                try{
                    if(_disabledFunction != null && eval(_disabledFunction) != null){
                        _isdis = eval(_disabledFunction)(cell,_grd,_row["_system"]["realIndex"]);
                        if(_isdis){
                            isDisabled = "disabled"
                        }
                    }
                    _reLabel = cell;        
                }catch(e){
                    console.log("1090:"+e);
                }
                var _inTag = '';
                var isChecked = "";
                
                
                if(readOnly == "true"){
                    _inTag = _reLabel;
                }else{
                    _inTag = '<div class="moca_radio_grid">';
                    var _rdoArr = JSON.parse(cellTd.getAttribute("itemset"));
                    for(var r=0;r<_rdoArr.length;r++){
                    	if(_row["TEST_YN"]==_rdoArr[r].value){
                       	 isChecked = "checked";
                       }else{
                    	   isChecked = "";
                       }
                    	_inTag += '<input type="radio" class="mocaRadio" name="rdo_'+"_"+$m.pageId+'_'+_grd.id+'_'+_nowIndex+'" id="rdo_'+r+"_"+$m.pageId+'_'+_grd.id+'_'+_nowIndex+_rdoArr[r].value+'" grd_id='+_grd.id+'  value="'+_rdoArr[r].value+'"   '+isChecked+' '+isDisabled+' >';
                         _inTag += '<label class="moca_radio_label" for="rdo_'+"_"+$m.pageId+'_'+_grd.id+'_'+_nowIndex+_rdoArr[r].value+'"  >'+_rdoArr[r].label+'</label>';
                	}
                    _inTag += '</div>';
                }
                row += '<td id="'+_id+'" class="'+_class+'" name="'+_name+'"  toolTip="'+_toolTip+'" celltype="'+_celltype+'" style="'+_style+'"  readOnly="'+readOnly+'" trueValue="'+_trueValue+'" falseValue="'+_falseValue+'"  disabledFunction="'+_disabledFunction+'" onclick="$m.defaultCellClick(this);" >'+_inTag+'</td>';
            }
        }
    }
    row += "</tr>";
    return row;     
};

Moca.prototype.getCellHeight = function(_grd) {
    var _default_cell_height = _grd.getAttribute("default_cell_height");
    if(_default_cell_height == null){
        _default_cell_height = mocaConfig.grid.default_cell_height;
    }
    _default_cell_height = parseFloat(_default_cell_height.replace(/px/g,''))+1;
    return _default_cell_height;
};

Moca.prototype.drawGrid = function(_grdId,_list,_pageId,_srcId){
    $m.drawGrid_inside(_grdId,_list,_list,_pageId,_srcId);
};

Moca.prototype.drawGrid_inside = function(_grdId,_list,_orilist,_pageId,_srcId,_response){
    var _grd;
    if(typeof _grdId == 'string'){
        _grd = $m.getObj(_grdId,null,_pageId,_srcId);
    }else{
        _grd = _grdId;
        _grdId = _grdId.id;
    }
    _srcId = _grd.getAttribute("srcid");
    $m[_srcId].filterRemoveAll(_grd);
    _grd.list = _list;
    if(_grd.list != null){
    	if($m.getAttrObj(_grd,'paging').type != 'numberList'){
    		$m[_srcId].setTotalCnt(_grd,this.comma(_grd.list.length));
    	}else if(_response != null){
			var _totalCnt =_response[$m.getAttrObj(_grd,'paging').totalCntKey];
    		$m[_srcId].setTotalCnt(_grd,_totalCnt);
    	}
        if(_orilist != null){
            _grd.ori_list =  _orilist.clone();
            //_grd.ori_list =  _orilist;
        }
        ////////////////////////////////////////////////////////////////// filter 구성 start
        var list = _list;
        var jq_grd_2 = _grd;
        var ks = Object.keys(jq_grd_2.cellInfo);

        var filterArr = [];
        var filterThArr = [];
        var thArray = $(jq_grd_2).find('thead:first th[filterableId]');
        for(var i=0; i < thArray.length; i++){
            var aTh = thArray[i];
            var filterableId = aTh.getAttribute("filterableId");
            filterArr.push(filterableId);
            filterThArr.push(aTh.id);
            if(jq_grd_2[filterableId] == null){
                jq_grd_2[filterableId] = {};
            }
            jq_grd_2[filterableId]['filterableMap'] = {};
        }
        /*
         * full loop area !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
         */
        for(var i=0; i < list.length; i++){
            var row = list[i];
            row["_system"]["realIndex"] = i;
            for(var k=0; k < filterArr.length; k++){
                var tdId = filterArr[k];
                var tdValue = row[tdId];
                jq_grd_2[tdId]['filterableMap'][tdValue] = ($m.getNumber(jq_grd_2[tdId]['filterableMap'][tdValue])+1);
                if(i == list.length-1){
                    jq_grd_2[tdId]['filterableMap'] = $m.sortObject(jq_grd_2[tdId]['filterableMap']);
                    jq_grd_2[tdId]['countableMap'] = {};
                    var m = jq_grd_2[tdId].filterableMap;
                    var keys = Object.keys(m);
                    for(var j=0; j < keys.length; j++){
                        var key = keys[j];
                        var val = "";
                        if(m != null){
                            val = m[key];
                        }
                        var reKey = "("+val+"건)"+" "+key;
                        jq_grd_2[tdId]['countableMap'][reKey] = key+" "+"("+$m.comma(val)+"건)";
                    }
                    jq_grd_2[tdId]['countableMap'] = $m.sortObjectNumString(jq_grd_2[tdId]['countableMap']);
                    var keys = Object.keys(jq_grd_2[tdId]['countableMap']);
                    for(var j=0; j < keys.length; j++){
                        var key = keys[j];
                        var val = "";
                        if(m != null){
                            val = m[key];
                        }
                        jq_grd_2[tdId]['countableMap'][key] = (j+1)+"."+key;
                    }   
                    
                    
                    jq_grd_2[tdId]['alphabeticalMap'] = jq_grd_2[tdId]['filterableMap'];
                    jq_grd_2[tdId].filterType = 'alphabeticalMap';
                }
            }
        }
        
        for(var i=0; i < filterArr.length; i++){
            var tdId = filterArr[i];
            var thId = filterThArr[i];
            var m = jq_grd_2[tdId].filterableMap;
            var keys = Object.keys(jq_grd_2[tdId]['filterableMap']);
            for(var j=0; j < keys.length; j++){
                var key = keys[j];
                var val = "";
                if(m != null){
                    val = m[key];
                }
                
                jq_grd_2[tdId]['filterableMap'][key] = (j+1)+"."+key+" "+"("+$m.comma(val)+"건)";
            }
            
            $(jq_grd_2).find(".itemTable[thid="+thId+"]").remove();
            $(jq_grd_2)[0].filter = null;
        }
        
    //////////////////////////////////////////////////////////////////filter 구성 end
        this.setVirtualScroll(_grd);
        this.genTbody(_grd,_list,0);
        
    }

};

Moca.prototype.setVirtualScroll = function(_grd){
    //var headerCellCnt = 1+$(_grd).find('thead>tr').length;
    var _default_cell_height =  this.getCellHeight(_grd);
    var fullHeight = _default_cell_height *_grd.list.length + ($(_grd).find('thead').height()); 
    /////////////////////////////////////////////////////////////////////
    var div = $(_grd).find('.moca_grid_body')[0];
    if(div.scrollWidth > div.clientWidth && $m.getDevice() != 'mobile'){
    	//세로스크롤이 +1개 추가되도록해줌.
    	fullHeight = fullHeight+_default_cell_height;
    }
/////////////////////////////////////////////////////////////////////
    $(_grd).find('#'+_grd.id+'_grid_height').css('height',fullHeight);
};


Moca.prototype.tree_dragstart = function(){
    var node = event.srcElement;
    var treeId = node.getAttribute("treeId");
    var nodeId = node.getAttribute("id");
    $('#'+treeId).attr('srcnodeid',nodeId);
    var startPosition = event.clientY;
    $('#'+treeId).attr('startposition',startPosition);
};

Moca.prototype.tree_mousedown = function (){
    event.stopPropagation();
    event.stopImmediatePropagation();
    var node = event.srcElement;
    
    var basis = $(node).parent().parent();
    basis.parent().children().removeClass('active');
    basis.addClass('active');

    
    var targetNode;
    if(node.tagName == 'SPAN'){
        targetNode = node.parentElement;
    }else if(node.tagName == 'LI'){
        targetNode = node;
    }
    
    if(node.parentElement.getAttribute("treeid") != 'tree1'){
        $("[srcid=lnb]>ul>li:not('[id="+basis.attr('id')+"]')").removeClass("moca_tree_open");
        $("[id="+basis.attr('id')+"]").addClass("moca_tree_open");
        
        $('[menucd]').removeClass('active');
        $('[menucd='+basis.attr('id').replace('li','')+']').addClass('active');
        
        
/*      if($("[srcid=lnb]>ul>li[id="+basis.attr('id')+"]").hasClass("moca_tree_open")){
            $("[srcid=lnb]>ul>li[id="+basis.attr('id')+"]").removeClass("moca_tree_open");
        }else{
            $("[srcid=lnb]>ul>li[id="+basis.attr('id')+"]").addClass("moca_tree_open");
        }
        */
    }
/*  if(targetNode != null){
        var treeId = targetNode.getAttribute("treeId");
        var nodeId = targetNode.getAttribute("id");
        

        
        
        
        var activeId = $('#'+treeId).attr('activeId');
        $('#'+activeId).removeClass("active");
        $('#'+treeId).attr('activeId',nodeId);
        $(targetNode).addClass('active');
        return false;
    }else{
        //console.log('mousedown error',node.tagName,node);
    }
    */
};



Moca.prototype.tree_plusMinus = function(){
/*  
    event.stopPropagation();
    event.stopImmediatePropagation();
    var liObj = $(event.srcElement).closest('li');
    if(liObj.hasClass('moca_tree_open')){
        liObj.removeClass('moca_tree_open');
    }else{
        liObj.addClass('moca_tree_open');
    }
    event.preventDefault();
    return false;*/
};

Moca.prototype.tree_del = function(){
    event.stopPropagation();
    event.stopImmediatePropagation();
    var node = event.srcElement;
    var txt = $(node.parentElement).find('>div>.moca_checkbox_label').text();
    if(confirm('노드("'+txt+'")와 하위노드들을 모두 삭제하시겠습니까?')){
        $(node.parentElement).remove();
        return false;
    }
    event.preventDefault();
    return false;
};




Moca.prototype.tree_dragover = function(){
    var _obj = event.currentTarget;
    event.preventDefault();
    return false;
};
Moca.prototype.tree_drop = function(){
    var node = event.srcElement;
    var targetNode;
    if(node.tagName == 'SPAN'){
        targetNode = node.parentElement;
    }else if(node.tagName == 'LI'){
        targetNode = node;
    }
    if(targetNode != null){
        var treeId = targetNode.getAttribute("treeId");
        var nodeId = targetNode.getAttribute("id");
        var levelTarget = targetNode.getAttribute("level");
        var srcnodeid = $('#'+treeId).attr('srcnodeid');
        var srcNode = $('#'+srcnodeid)[0];
        var levelSrc = srcNode.getAttribute('level');
        
        
        var endposition = parseFloat(event.clientY);
        var startposition = parseFloat($('#'+treeId).attr('startposition'));
        //$('#'+treeId).attr('startposition','');
        var target;
        var preSrcNode = srcNode.parentElement;
        if(levelTarget == levelSrc){
            target = targetNode;
            if(startposition < endposition){
                //src를 target아래로 붙임
                target.insertAdjacentElement('afterend',srcNode);
            }else{
                //src를 target위로 붙임
                target.insertAdjacentElement('beforebegin',srcNode);
            }
        }else{
            target = $(targetNode).find('ul')[0];
            target.appendChild(srcNode);
            
            expendBtn = $(targetNode).find('.moca_tree_btn')[0];
            $(expendBtn).css('display','');
            $(targetNode).removeClass('leaf');
            $(targetNode).addClass('moca_tree_open');
        }
        if($(preSrcNode).children().length == 0){
            $($(preSrcNode.parentElement).find('.moca_tree_btn')).css('display','none');
            $(preSrcNode.parentElement).addClass('leaf');
        }
    }else{
        //console.log('com_drop error',node.tagName,node);
    }
    



};

Moca.prototype.tree_mm = function(_list,_level,_cnt,_pcode){
    ['make menu!'];
    for(var i=0;i < _cnt; i++){
        var r = {cd:_pcode+"_"+_level+"_"+i,nm:'',level:_level};
        r.nm = "메뉴"+r.cd;
        _list.push(r);
    }
    return _list;
};

Moca.prototype.tree_mt = function(_treeId,data,menuObjs){
    ['make tree!'];
    var html = this.tree_mt_loop(_treeId,data,menuObjs);
    $('#'+_treeId).html(html);
};


Moca.prototype.tree_check = function(_treeId,data,menuObjs){
    ['하위체크'];
    var node = event.srcElement;
    $(node.parentElement.parentElement).find('.moca_checkbox_input').attr('checked',node.checked);
};
Moca.prototype.scopes = function(){
    
    
};
Moca.prototype.tree_click = function(_clickedMenuId,_mdiId){
    ['메뉴클릭'];
    var _mdi2 = $('#mdi_2',parent.document).is(':visible');
    if(!_mdi2){_mdiId = 'mdi_1'}
    
    var node = $('#'+_clickedMenuId,parent.document).find('SPAN')[0];
    var _clickedNode = $('#'+_clickedMenuId,parent.document)[0];
    
    
    //basis.addClass('active');
    $('[menucd]',parent.document).removeClass('active');
    $('[menucd='+_clickedMenuId.replace('li','')+']',parent.document).addClass('active');
    if(node.tagName == 'SPAN' && $(node,parent.document).hasClass("moca_tree_tbx") && $(_clickedNode,parent.document).hasClass('leaf')){
        var basis = $('#'+_clickedMenuId,parent.document);
        basis.parent().children().removeClass('active');
        basis.addClass('active');
        var _type = node.getAttribute("type");
        var _url = $.trim(node.getAttribute("url"));
        
        var _label = $(node,parent.document).contents().eq(0).text();
        var _fileName = $m.getFileNameFromUrl(_url);
        var _srcId = _fileName.substring(0,_fileName.indexOf('.'));
        

        
        if(_type == 'windowPopup'){
            var url_head = _url.substring(0,_url.lastIndexOf('?')+1);
            var _params = _url.substring(_url.lastIndexOf('?')+1);
            var paramArray = _params.split('&');
            var re_params = '';
            for(var i=0; i < paramArray.length; i++){
                var keyVal = paramArray[i].split('=');
                re_params = re_params + keyVal[0]+'='+$m.encode(keyVal[1])+"&";
            }
            _url = url_head+re_params;
            
            $m.openPop({width:1000,height:600,url:$m._contextRoot+_url,id:_label});
        }else{
            //모바일에서 메뉴클릭시 
            if($m.getDevice() != 'pc'){
            	$('.moca_container').addClass('on')
                $('.moca_header').addClass('on');
                $('.moca_aside').addClass('on');
            }
            
        	$m.openMdi($m._contextRoot+_url,_srcId,_label,_clickedMenuId,_mdiId);
            
        }
        
    }else{
        var basis = $(_clickedNode)
        basis.parent().children().removeClass('active');
        basis.addClass('active');
    }
};
Moca.prototype.leafMenuOver = function(_clickedMenuId,_mdiId,areaObj){
    ['leaf메뉴에마우스올렸을때'];
    var arr = $('.mdi_choice');
    if($('#mdi_2').is(':visible')){
        //멀티
        for(var i=0; i < arr.length; i++){
            var _target = $(arr[i]);
            var _target_i = _target.find('i');
            var _target_p = _target.parent();
            var backgroundColorStr = _target.css('background');
            if(backgroundColorStr){
                _target.css('background','');
                _target_i.removeClass('left');
                _target_i.removeClass('right');
                _target_p.removeClass('hover');
            }
        }
        if(_mdiId == 'mdi_1'){
            $(areaObj).css('background','linear-gradient(to right, rgb(0 45 85), rgb(255, 255, 255,0))');
            $(areaObj).find('i').addClass('left');
        }else{
            $(areaObj).css('background','linear-gradient(to left, rgb(0 45 85), rgb(255, 255, 255,0))');
            $(areaObj).find('i').addClass('right');
        }
    }else{
        for(var i=0; i < arr.length; i++){
            var _target = $(arr[i]);
            var _target_i = _target.find('i');
            var _target_p = _target.parent();
            var backgroundColorStr = _target.css('background');
            if(backgroundColorStr){
                _target.css('background','');
                _target_i.removeClass('left');
                _target_i.removeClass('right');
                _target_p.removeClass('hover');
            }
            
        }
        $(areaObj).parent().addClass('hover');
    }
};



Moca.prototype.encode = function(_txt) {
    ['encode for hangul'];  
    return encodeURIComponent(encodeURIComponent(_txt));
};
Moca.prototype.decode = function(_txt) {
    ['decode for hangul'];  
    return decodeURIComponent(decodeURIComponent(_txt));
};


Moca.prototype.url_to_srcId = function(_url){
    ['from url to srcId'];
    var _fileName = $m.getFileNameFromUrl(_url);
    var _srcId = _fileName.substring(0,_fileName.indexOf('.'));
    return _srcId;
};


Moca.prototype.openMdi = function(_url,_srcId,_label,_clickedMenuId,_mdiId){
    ['_url MDI로 열기 '];
        var o = {type:"MDI"};
        o.url = _url;
        o.srcId = _srcId;
        o.label = _label;
        o.clickedMenuId = _clickedMenuId;
        if(_mdiId == null){
            _mdiId = "mdi_1"
        }
        o.mdiId = _mdiId;
        //오픈전에 닫아야 할것들 닫기
        var arr = $('#'+_mdiId+' .moca_tab_ul>li');
        for(var i=0;i < arr.length; i++){
            var aTab = arr[i];
            var aUrl = $(aTab).attr('tab_url');
            if(aUrl == _url){
                var _tab_id = $m.setPageArea(aTab);
                arr.removeClass("active");
                $(aTab).addClass('active');//탭액티브
                $(aTab).closest('.moca_tab_listarea').scrollLeft($(aTab).offset().left);
                $('#'+_mdiId+' .moca_tab_body').css('display','none');
                var contDiv = $('#'+_mdiId+' .moca_tab_body').parent().find('div[id*="'+_tab_id+'"]');
                contDiv.css('display','block');
                return false;
            }
        }
    
        if(_url != null && _url != ''){
            //var loadingId = $m.loading();
            if(_label != null && $.trim(_label) != '' && $m.getCORP_CD() != null){ 
                $m.userLogInsert({URL:_url,SRCID:_srcId,LABEL:'',MENU_NM:_label});
            }
            var arr0 = _url.split('?');
            var arr;
            if(arr0 != null && arr0.length > 1){
            	arr = arr0[1].split('&');
            	arr.push('label='+_label);
            	for(i=0; i<arr.length;i++){
            	    if($m.trim(arr[i]) == ''){
            	        arr.splice(i);
            	    } 
            	};
            	o.paramArr = arr;
            }
            
            $.ajax({
               type:"GET",
               url:_url,
               async: false,               
               dataType : "html",
               data : {
                   "header" : $m.header,
                   "body" : {aaa:'111',bbb:'222'},
                   "message" : {}
               },
               success : function(data) {
                   o.data = data;
                   var mdiObj = $m.rendering(o);
                   var tabId = $(mdiObj).attr("tab_id");
                   var thisTabObj = $(mdiObj).parent().find('.moca_tab_head li[tab_id="'+tabId+'"]');
                   if(thisTabObj.length > 0){
                	   var thisTabObjLeft = thisTabObj.offset().left;
                	   $(mdiObj).parent().find('.moca_tab_listarea').scrollLeft(thisTabObjLeft+100);
                   }
                  
                   
                   mdiObj.parent = {data:{}};
                   if(o.paramArr != null){
	                   for(var i=0; i < o.paramArr.length; i++){
						 	var paramone = o.paramArr[i];
						 	var arrone = paramone.split('=');
							mdiObj.parent.data[arrone[0]] = arrone[1];
					   }
                   }
                   
                   $m.setPageHeader($(mdiObj).find('#titbox'),o.label);
                   $m.callReady(mdiObj);
               },
               complete : function(data) {
                  // $m.loading(loadingId);
               },
               error : function(xhr, status, error) {
                   console.log(xhr, status, error);
               }
            });
        }
};

Moca.prototype.moca_mdi_click = function(_liObj){
    ['mdi tab click event'];
    var _mdiId = _liObj.closest('.moca_mdi').id;
    $('#'+_mdiId+' .moca_tab_body').css('display','none');
    //$('.moca_tab_ul').find('.active').removeClass('active');
    
    if($(_liObj).hasClass("moca_tab_list")){
        $($(_liObj).parent().find(".active")[0]).removeClass("active");
        $(_liObj).addClass("active");
        var _tab_id = $m.setPageArea(_liObj);
        var _src_id ;
        if($m[_tab_id] != null){
        	 _src_id = $m[_tab_id].srcId;
        }
       
        var arr = $('#'+_mdiId+' .moca_tab_body');
        var contDiv = $('#'+_mdiId+' .moca_tab_body').parent().find('div[id*="'+_tab_id+'"]');
        for(var i=0;i < arr.length; i++){
            var _row = arr[i];
            if(contDiv[0] === _row){
            	if($m[_tab_id] != $m[_src_id]){
            		$m[_src_id] = $m[_tab_id];
            	}
                $(_row).css('display','block');
            }else{
                $(_row).css('display','none');
            }
        }
    }   
};

Moca.prototype.setPageArea = function(_pageObj){
    ['페이지영역을 세팅함'];
    var _tab_id = _pageObj.getAttribute("tab_id");//MDI_201901091611497970040306010502
    var _tab_url = _pageObj.getAttribute("tab_url");//./xxx/xxx.html
    var _src_id = $m.url_to_srcId(_tab_url);
    $m.pageId = _tab_id;
    $m.srcId = _src_id;
    return _tab_id;
};


Moca.prototype.goMain = function(){
    ['메인으로가기버튼'];
    $('.moca_tab_body').css('display','none');
    $('.moca_tab_ul').find('.active').removeClass('active');
    $('#moca_main.moca_tab_body').css('display','block');   
};


Moca.prototype.dragStart_mdi = function(thisMdiLi){
    ['드레그시작'];
    var parentNode = event.target;
    event.dataTransfer.setDragImage(parentNode,0,0);  
    event.dataTransfer.setData("mdi_tab_id",thisMdiLi.id);
};

Moca.prototype.dragOver_mdi = function(thisMdiLi){
    ['드레그시작'];
    console.log('dragOver_mdi');
    event.preventDefault();
};

Moca.prototype.drop_mdi = function(thisMdiLi){
    ['드롭'];
    //moca_tab_ul
    var _mdi_tab_id = event.dataTransfer.getData("mdi_tab_id");
    var sourceLi = $('#'+_mdi_tab_id)[0];
    $(thisMdiLi).find('.moca_tab_ul').append($('#'+_mdi_tab_id));
    var contentId = _mdi_tab_id.replace(/(.*?)_li$/g,'$1')+"_dv";var targetDiv = $(thisMdiLi).closest('.moca_mdi');targetDiv.append($('#'+contentId));
    
    
    $m.moca_mdi_click(sourceLi);
    
    
    
    
    
    
    

    
    
    
    
    var _preMdiId;
    if('mdi_1' == targetDiv[0].id){
        _preMdiId = "mdi_2";
    }else{
        _preMdiId = "mdi_1";
    }
    
    var arr = $('#'+_preMdiId+' .moca_tab_ul>li');
    for(var i=0;i < arr.length; i++){
        var aTab = arr[i];
        if(i == 0){
            var _tab_id = $m.setPageArea(aTab);
            arr.removeClass("active");
            $(aTab).addClass('active');//탭액티브
            $('#'+_preMdiId+' .moca_tab_body').css('display','none');
            var contDiv = $('#'+_preMdiId+' .moca_tab_body').parent().find('div[id*="'+_tab_id+'"]');
            contDiv.css('display','block');
            return;
        }
    }
    
    
    
    var arr = $('#'+_preMdiId+' .moca_tab_body');
    for(var i=0;i < arr.length; i++){
        var _row = arr[i];
        if(i==1){
            $m.moca_mdi_click(_row);
            $(_row).css('display','block');
        }else{
            $(_row).css('display','none');
        }
    }
    
    
    //thisMdiLi
};
Moca.prototype.tree_addTab = function(_label,_tabId,_url,_mdiId){
    ['tree_addTab'];
    var tabHtml = '<li draggable="true" ondragstart="$m.dragStart_mdi(this)" class="moca_tab_list active" tab_url="'+_url+'" tab_label="'+_label+'" tab_id="'+_tabId+'" id="'+_tabId+'_li" onclick="$m.moca_mdi_click(this);">';
   
    tabHtml += '<span class="moca_tab_mark"></span>';
   

    tabHtml += '<button type="button" role="tab" aria-controls="moca_tab_bridge1" class="moca_tab_label">'+_label+'</button>';
    tabHtml += '<button type="button" class="moca_tab_close" onclick="$m.tabClose(this)">닫기</button>';
    tabHtml += '<div class="tab_bg_area">';
    tabHtml +='<svg viewBox="0 0 15 31" class="tab_svg"><use xlink:href="#tab-shape"></use></svg>\n';
    tabHtml += '<span class="tab_bg"></span>';
    tabHtml +='<svg viewBox="0 0 40 31" class="tab_svg right"><use xlink:href="#tab-shape2"></use></svg>\n';
    tabHtml += '</div>';
    tabHtml += '</li>';
    var _html = $('#'+_mdiId+' .moca_tab_ul').html();
    var _full_html = _html.replace(/active/g,'')+tabHtml;
    $('#'+_mdiId+' .moca_tab_ul').html(_full_html); 
    if($m.getDevice() == 'pc'){
    	if($('#'+_mdiId+' .moca_tab_close:last').length != 0){
            ($('#'+_mdiId+' .moca_tab_allclose').offset().left - $('#'+_mdiId+' .moca_tab_close:last').offset().left <= 100)? $('#'+_mdiId+' .moca_tab_ul').addClass('tabWidth') : $('#'+_mdiId+' .moca_tab_ul').removeClass('tabWidth');
        }
    }
    
};

Moca.prototype.tabClose = function(_liCloseButtonObj,_compulsion){
    ['탭닫기'];
    if($m.trim(_compulsion) == '' ){
    	$m.confirm('현재 화면을 닫으시겠습니까?',function(result){
            if(result == 'Y'){
                var _tab_id = $(_liCloseButtonObj).closest("[tab_id]").attr("tab_id");
                var _mdiId = $(_liCloseButtonObj).closest('.moca_mdi').attr('id');
                var t = $('*[tab_id='+_tab_id+']');
                $m[_tab_id]=null;
                $('*[tab_id='+_tab_id+']').remove();
                $(_liCloseButtonObj).parent().remove();
                if(t.hasClass("active")){
                    //액티브상태에서 닫혔을때만 아래 적용
                    $('#'+_mdiId+' .moca_tab_ul>li:last-child').addClass('active');//탭액티브
                    $('#'+_mdiId+' .moca_tab_body').last().css('display','block');//컨텐츠액티브      
                }
                
                $('.moca_tab_ul').removeClass('tabWidth'); //탭메뉴리사이징
                if($m.getDevice() == 'pc'){
                	if($('#'+_mdiId+' .moca_tab_close:last').length != 0){
                        ($('#'+_mdiId+' .moca_tab_allclose').offset().left - $('#'+_mdiId+' .moca_tab_close:last').offset().left <= 100)? $('#'+_mdiId+' .moca_tab_ul').addClass('tabWidth') : $('#'+_mdiId+' .moca_tab_ul').removeClass('tabWidth');
                    }
                }
                
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                return false;
            }
        });
    }else if($m.trim(_compulsion) =='compulsion'){
    	var _tab_id = $(_liCloseButtonObj).closest("[tab_id]").attr("tab_id");
        var _mdiId = $(_liCloseButtonObj).closest('.moca_mdi').attr('id');
        var t = $('*[tab_id='+_tab_id+']');
        $m[_tab_id]=null;
        $('*[tab_id='+_tab_id+']').remove();
        $(_liCloseButtonObj).parent().remove();
        if(t.hasClass("active")){
            //액티브상태에서 닫혔을때만 아래 적용
            $('#'+_mdiId+' .moca_tab_ul>li:last-child').addClass('active');//탭액티브
            $('#'+_mdiId+' .moca_tab_body').last().css('display','block');//컨텐츠액티브      
        }
        
        $('.moca_tab_ul').removeClass('tabWidth'); //탭메뉴리사이징
        if($m.getDevice() == 'pc'){
        	if($('#'+_mdiId+' .moca_tab_close:last').length != 0){
                ($('#'+_mdiId+' .moca_tab_allclose').offset().left - $('#'+_mdiId+' .moca_tab_close:last').offset().left <= 100)? $('#'+_mdiId+' .moca_tab_ul').addClass('tabWidth') : $('#'+_mdiId+' .moca_tab_ul').removeClass('tabWidth');
            }
        }
        
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        return false;
    }
    

};

Moca.prototype.all_tab_close = function(_liCloseButtonObj){
    ['탭닫기']; 
    var _mdiId = _liCloseButtonObj.closest('.moca_mdi').id;
    $m.confirm('모든 화면을 닫으시겠습니까?',function(result){
        if(result == 'Y'){
        	//$m[_tab_id]=null;
        	var _li = $('#'+_mdiId+' .moca_tab_ul>li');
        	for(var i=0; i<_li.length; i++){
        		$m[$(_li[i]).attr('tab_id')] = null;
        	}
        	
        	_li.remove();//탭액티브
            $('#'+_mdiId+' .moca_tab_body[id!=moca_main]').remove();//컨텐츠액티브
            $('#'+_mdiId+' .moca_tab_body[id=moca_main]').css('display','block');
            $('#'+_mdiId+' .moca_tab_ul').removeClass('tabWidth'); //탭메뉴리사이징
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            return false;
        }
    });
};




Moca.prototype.tree_mt_loop = function(_treeId,_data,menuObjs){
    ['make tree loop!'];
    var treeHtml = '<ul>';
    for(var i=0;i < _data.length; i++){
        var row = _data[i];
        var data = menuObjs[row.cd];
        var subHtml = '';
        var openClass = "moca_tree_open";
        var leafClass = "leaf";
        var leefStyle = '';
        if(data !=null && data.length > 0){
            subHtml += this.tree_mt_loop(_treeId,data,menuObjs);
            if(row.open_close == "open"){
                openClass = "moca_tree_open";
            }else{
                openClass = "";
            }
            leafClass = "";
        }else{
            openClass = "";
            leefStyle = 'display:none';
            leafClass = 'leaf';
        }
        var url = '';
        if(row.url != null){
            url = row.url;
        }
        var icon = '';
        if(row.icon != null){
            icon = row.icon;
        }

        //treeHtml += '<li id="li'+row.cd+'" class="'+openClass+' '+leafClass+'" ondrop="$m.tree_drop(this);" ondragstart="$m.tree_dragstart(this);"  ondragover="$m.tree_dragover(this);" onmousedown="$m.tree_mousedown(this);" onclick="$m.tree_click(\'li'+row.cd+'\');" draggable="true" treeId="'+_treeId+'"  level="'+row.level+'">';
        treeHtml += '<li id="li'+row.cd+'" class="'+openClass+' '+leafClass+'" onmousedown="$m.tree_mousedown(this);"  treeId="'+_treeId+'"  level="'+row.level+'">';
        treeHtml += '<div class="mdi_choice w50" onclick="$m.tree_click(\'li'+row.cd+'\',\'mdi_1\');" onmouseover="$m.leafMenuOver(\'li'+row.cd+'\',\'mdi_1\',this);"><i></i></div>';
        treeHtml += '<div class="mdi_choice w50" onclick="$m.tree_click(\'li'+row.cd+'\',\'mdi_2\');" onmouseover="$m.leafMenuOver(\'li'+row.cd+'\',\'mdi_2\',this);"><i></i></div>';
        treeHtml += '<div class="moca_checkbox_tree"  >';
        treeHtml += '<input type="checkbox" id="mnu'+row.cd+'"  class="moca_checkbox_input" onclick="$m.tree_check(this);"><label for="mnu'+row.cd+'"  class="moca_checkbox_label">'+row.nm+'</label>';
        treeHtml += '</div>';

        if($m.trim(row.url) != ''){
            treeHtml += '<span class="moca_tree_tbx" url="'+url+'" fromDate="'+row.fromDate+'" toDate="'+row.toDate+'" type="'+row.type+'" label="'+row.nm+'">'+row.nm;
            treeHtml += '<button type="button" class="moca_tree_btn" onclick="$m.tree_plusMinus(this);" style="'+leefStyle+'">+</button>'+'</span>';
            
        }else{
            treeHtml += '<span class="moca_tree_tbx" url="'+url+'" fromDate="'+row.fromDate+'" toDate="'+row.toDate+'" type="'+row.type+'" label="'+row.nm+'" style="background-image:url('+icon+');">'+row.nm;
            treeHtml += '<button type="button" class="moca_tree_btn" onclick="$m.tree_plusMinus(this);" style="'+leefStyle+'">+</button>'+'</span>';
        }
        treeHtml += '<button type="button" class="tvw_btn_close" onclick="$m.tree_del(this);" >삭제</button>';
        if(data !=null){
            treeHtml += subHtml;
        }else{
            treeHtml += '<ul></ul>';
        }
        treeHtml += '</li>';
    }
    treeHtml += '</ul>';
    return treeHtml;
};

Moca.prototype.getCellWidth = function(aTh){
    ['그리드쎌의폭'];
    var aWidth = parseFloat($(aTh).width());
    var pLeft = parseFloat($(aTh).css('padding-left').replace(/px/g,''));
    var pRight = parseFloat($(aTh).css('padding-right').replace(/px/g,''));
    var bLeft = parseFloat($(aTh).css('border-left').split(' ')[0].replace(/px/g,''));
    var bRight = parseFloat($(aTh).css('border-Right').split(' ')[0].replace(/px/g,''));    
    aWidth = aWidth+pLeft+pRight+bLeft+bRight;
    return aWidth;
};

Moca.prototype.grid_checkBorder = function(_thisObj){
    ['컬럼확장을 위한 경계체크'];
    var aTh = event.srcElement;
    
    if(!$(aTh).hasClass("moca_grid_sort_btn")){
        if(aTh.tagName == 'SPAN' || $(aTh).hasClass("moca_grid_sort_btn")){
            aTh = $(aTh).parent().parent()[0];
        }else if($(aTh).hasClass("moca_grid_sort_box")){
            aTh = $(aTh).parent()[0];   
        }
        var offx = parseFloat(event.offsetX);
        if(aTh != null){
            if (this.curColForResize == null) {
                if(aTh.tagName == 'TH'){
                    var pLeft = parseFloat($(aTh).position().left);
                    var aWidth = this.getCellWidth(aTh);
                    
                    if(offx < this.resizePadding){
                        if(aTh.previousElementSibling != null){
                            aTh.style.cursor=this.resizeCursor;
                            $(aTh).find('div').css('cursor',this.resizeCursor);
                            $(aTh).find('button').css('cursor',this.resizeCursor);
                        }
                    }else if(offx > (aWidth-(this.resizePadding))){ 
                        if(aTh.nextElementSibling != null){
                            aTh.style.cursor=this.resizeCursor;
                            $(aTh).find('div').css('cursor',this.resizeCursor);
                            $(aTh).find('button').css('cursor',this.resizeCursor);
                        }           
                    }else{
                        aTh.style.cursor='';
                        $(aTh).find('div').css('cursor','');
                        $(aTh).find('button').css('cursor','');
                    }
                    
                }else{
                    aTh.style.cursor='';
                    $(aTh).find('div').css('cursor','');
                    $(aTh).find('button').css('cursor','');
                }

            }else{
                aTh.style.cursor=this.resizeCursor;
                $(aTh).find('div').css('cursor',this.resizeCursor);
                $(aTh).find('button').css('cursor',this.resizeCursor);
                $m.showDashed(event.clientX);
            }
        }
        //event.preventDefault();
        
    }
    

};

Moca.prototype.grid_colDown = function(_thead_tr_obj){
    ['컬럼확장을 위한 경계체크'];
    if(event.target.parentElement != event.currentTarget){
        return;
    }
    
    var aTh = event.srcElement;
    if(!$(aTh).hasClass("moca_grid_sort_btn")){
        if(aTh.tagName == 'SPAN' || $(aTh).hasClass("moca_grid_sort_btn")){
            aTh = $(aTh).parent().parent()[0];
        }else if($(aTh).hasClass("moca_grid_sort_box")){
            aTh = $(aTh).parent()[0];   
        }
        
        var pLeft = parseFloat($(aTh).position().left);
        var aWidth = this.getCellWidth(aTh);
        var offx = parseFloat(event.offsetX);

        var isResizeArea = false;
        if(offx < this.resizePadding ){
            //앞td
            aTh = event.srcElement.previousElementSibling;
            if(aTh == null){
                aTh = event.srcElement;
            }
            isResizeArea = true;
        }else if(offx > (aWidth-(this.resizePadding))){ 
            if(aTh.nextElementSibling != null){
                aTh = event.srcElement;
            }   
            isResizeArea = true;
        }
        if(isResizeArea){
            this.curColForResize = aTh;
            this.curColForResize.curColXForResize = event.clientX;
            this.curColForResize.aWidth = aWidth;   
            var arr = $(aTh.parentElement).children();
            for(var k=0,l=arr.length; k < l; k++){
                var r = arr[k];
                if(r == aTh){
                    this.curColForResize.colIndex = k;
                }
            }
            $m.showDashed(event.clientX);
        }
    }
};

Moca.prototype.showDashed = function(_eventx){
    ['컬럼확장시 나오는 라인표시'];
    var rex = _eventx;
    if(rex == null){
        rex = event.clientX;
    }
    $("#lin_dashed").css('display','block');
    $("#lin_dashed").css('z-index',9999);
    $("#lin_dashed").css('position','fixed');
    $("#lin_dashed").css('left',rex+'px');
};

Moca.prototype.hideDashed = function(){
    ['컬럼확장시 나오는 라인표시'];
    this.curColForResize = null;
    $("#lin_dashed").css('display','none');
};

Moca.prototype.zoomInput = function(_thisObj,_grd,_message,_callback){
    ['alert messagebox'];   
    var messageboxId = "MESSAGE_"+this.now()+this.shuffleRandom(6);
    this.callbacks[messageboxId] = _callback;
    var alert_html = '';
    var _pageId = $(_grd).attr('pageid');
    var _srcId = $(_grd).attr('srcid');
    //alert_html += '<div class="moca_messagebox_modal" style="display:block" id='+messageboxId+'>';
    alert_html += '<div class="moca_messagebox zoom">';
    alert_html += '<div class="moca_messagebox_grp">';
    alert_html += '<h2 class="moca_messagebox_title"></h2>';
    alert_html += '<div class="moca_message mt0">';
    alert_html += '<div id="zoom_'+_thisObj.id+'" contenteditable="true" class="moca_textarea">';
    alert_html += _message;
    alert_html += '</div>';
    alert_html += '</div>';
    alert_html += '<div class="moca_btnbox">';
    alert_html += '<button type="button" class="moca_btn_confirm" onclick="$m.alertok(\''+messageboxId+'\',\''+_thisObj.id+'\',$m.'+_srcId+'.getObj(\'zoom_'+_thisObj.id+'\'),$m.'+_srcId+'.getObj(\''+_grd.id+'\'));">확인</button>';
    alert_html += '<button type="button" class="moca_btn_confirm" style="background:#929292"onclick="$m.alertesc(\''+messageboxId+'\');">취소</button>';
    alert_html += '</div>';
    alert_html += '</div>';
    alert_html += '</div>';
    //alert_html += '</div>';
    var tmp = document.createElement( 'div' );
    tmp.setAttribute("id",messageboxId);
    tmp.setAttribute("class","moca_messagebox_modal");
    tmp.innerHTML = alert_html;
   // document.body.appendChild(tmp);
    _grd.appendChild(tmp);
    //document.body.innerHTML += alert_html;
};



Moca.prototype.alert = function(_message,_callback){
    ['alert messagebox'];   
    var messageboxId = "MESSAGE_"+this.now()+this.shuffleRandom(6);
    this.callbacks[messageboxId] = _callback;
    var alert_html = '';
    //alert_html += '<div class="moca_messagebox_modal" style="display:block" id='+messageboxId+'>';
    alert_html += '<div class="moca_messagebox alert">';
    alert_html += '<div class="moca_messagebox_grp">';
    alert_html += '<div class="ico"></div>';
    alert_html += '<h2 class="moca_messagebox_title"></h2>';
    alert_html += '<div class="moca_message">';
    alert_html += '<p>'+_message+'</p>';
    alert_html += '</div>';
    alert_html += '<div class="moca_btnbox">';
    alert_html += '<button type="button" class="moca_btn_confirm" onclick="$m.alertok(\''+messageboxId+'\');">확인</button>';
    alert_html += '</div>';
    alert_html += '</div>';
    alert_html += '</div>';
    //alert_html += '</div>';
    
    
    var tmp = document.createElement( 'div' );
    tmp.setAttribute("id",messageboxId);
    tmp.setAttribute("class","moca_messagebox_modal");
    tmp.innerHTML = alert_html;
    document.body.appendChild(tmp);
    //document.body.innerHTML += alert_html;
};

Moca.prototype.malert = function(_message1,_message2,_callback){
    ['single page alert messagebox'];   
    var messageboxId = "MESSAGE_"+this.now()+this.shuffleRandom(6);
    this.callbacks[messageboxId] = _callback;
    var alert_html = '';
    alert_html += '<div class="pop_msg type1">';
    alert_html += '<div class="pop_cont">';
    if($m.trim(_message1) != ''){
        alert_html += '<strong>'+_message1+'</strong>';
    }
    if($m.trim(_message2) != ''){
        alert_html += '<span>'+_message2+'</span>';
    }
    alert_html += '</div>';
    alert_html += '<div class="btnbox">';
    alert_html += '<div class="rta">';
    alert_html += '<button class="btn_cm" type="button"  onclick="$m.alertok(\''+messageboxId+'\');">확인</button>';
    alert_html += '</div>';
    alert_html += '</div>';
    alert_html += '</div>';
    var tmp = document.createElement( 'div' );
    tmp.setAttribute("id",messageboxId);
    tmp.setAttribute("class","_modal");
    tmp.innerHTML = alert_html;
    document.body.appendChild(tmp);
};


Moca.prototype.mresult = function(_message1,_message2,_callback){
    ['check icon, confirm large button'];   
    var messageboxId = "MESSAGE_"+this.now()+this.shuffleRandom(6);
    this.callbacks[messageboxId] = _callback;
    var alert_html = '';
    alert_html += '<div class="pop_msg pb15">';
    alert_html += '<i class="confirm"></i>';
    alert_html += '<div class="pop_cont">';
    if($m.trim(_message1) != ''){
        alert_html += '<strong>'+_message1+'</strong>';
    }
    if($m.trim(_message2) != ''){
        alert_html += '<span class="dd">'+_message2+'</span>';
    }
    alert_html += '</div>';
    alert_html += '<button class="btn_go mt30" type="button"  onclick="$m.alertok(\''+messageboxId+'\');">확인</button>';
    alert_html += '</div>';
    var tmp = document.createElement( 'div' );
    tmp.setAttribute("id",messageboxId);
    tmp.setAttribute("class","_modal");
    tmp.innerHTML = alert_html;
    document.body.appendChild(tmp);
};

Moca.prototype.mvalid = function(_message1,_message2,_message3,_callback){
    ['mvalid']; 
    var messageboxId = "MESSAGE_"+this.now()+this.shuffleRandom(6);
    this.callbacks[messageboxId] = _callback;
    var alert_html = '';
    alert_html += '<div class="pop_msg type2">';
    alert_html += '<div class="dfbox">'+_message1+'</div>';
    alert_html += '<div class="">';
    alert_html += '<ul class="if_bx">';
    alert_html += _message2;
    alert_html += '</ul>';
    alert_html += '</div>';
    if(_message3 != null){
        alert_html += '<p class="tip tac mt20">'+_message3+'</p>';
    }
    alert_html += '<button class="btn_close" type="button"  onclick="$m.alertok(\''+messageboxId+'\');">다시입력하기</button>';
    alert_html += '</div>';
    var tmp = document.createElement( 'div' );
    tmp.setAttribute("id",messageboxId);
    tmp.setAttribute("class","_modal");
    tmp.innerHTML = alert_html;
    document.body.appendChild(tmp);
};

//$m.minfo(_msg,'',null,location.origin+"/to/m/TOM_04.html?idx="+_idx);
Moca.prototype.minfo = function(_message1,_message2,_callback,_url){
    ['check icon, confirm large button'];   
    var messageboxId = "MESSAGE_"+this.now()+this.shuffleRandom(6);
    this.callbacks[messageboxId] = _callback;
    var alert_html = '';
    alert_html += '<div class="pop_msg pb15 type2 iframe">';
    alert_html += '<div class="dfbox">';
    alert_html += '<h3>'+_message1+'</h3>';
    alert_html += '</div>';
    alert_html += '<div class="pop_cont">';
    alert_html += '<iframe src=\''+_url+'\'>';
    alert_html += '</iframe>';
    alert_html += '</div>';
    alert_html += '<button class="btn_go mt15" type="button"  onclick="$m.alertok(\''+messageboxId+'\');">확인</button>';
    alert_html += '</div>';
    var tmp = document.createElement( 'div' );
    tmp.setAttribute("id",messageboxId);
    tmp.setAttribute("class","_modal");
    tmp.innerHTML = alert_html;
    document.body.appendChild(tmp);
};

//$m.mpopup("약관변경공지",'',null,location.origin+"/to/m/TOM_01.html?idx=1");
Moca.prototype.mpopup = function(_message1,_message2,_callback,_url){
    ['mobile popup'];   
    var messageboxId = "MESSAGE_"+this.now()+this.shuffleRandom(6);
    this.callbacks[messageboxId] = _callback;
    var alert_html = '';
    alert_html += '<div class="pop_msg pb15 type2 mpopup iframe">';
    alert_html += '<div class="dfbox">';
    alert_html += '<h3>'+_message1+'</h3>';
    alert_html += '<button type="button" id="btn_popClose" class="btn_close" onclick="$m.mpopClose(this,\''+messageboxId+'\');">닫기</button>';
    alert_html += '</div>';
    alert_html += '<div class="pop_cont">';
    alert_html += '<iframe src=\''+_url+'\'>';
    alert_html += '</iframe>';
    alert_html += '</div>';
    alert_html += '<div class="ftbox">';
    alert_html += '<div class="fl" onclick="$m.mpopNotViewToday(this,\''+messageboxId+'\')">';
    alert_html += '<button type="button" id="btn_notViewToday" class="" >오늘 하루 보지 않기</button>';
    alert_html += '</div>';
    alert_html += '<i class="fl"></i>';
    alert_html += '<div class="fr" onclick="$m.mpopClose(this,\''+messageboxId+'\');">';
    alert_html += '<button type="button" id="btn_popClose2" class="" >닫기</button>';
    alert_html += '</div>';
    alert_html += '</div>';
    alert_html += '</div>';
    var tmp = document.createElement( 'div' );
    tmp.setAttribute("id",messageboxId);
    tmp.setAttribute("class","_modal");
    tmp.innerHTML = alert_html;
    document.body.appendChild(tmp);
};

Moca.prototype.mpopNotViewToday = function(_thisObj,_messageboxId){
    ['모카팝업 오늘 하루 보지 않기'];
    $m.setLs("notViewToday",$m.now());
    $m.mpopClose(this,_messageboxId);
};

Moca.prototype.merror = function(_message1,_message2,_callback){
    ['error icon, confirm large button'];   
    var messageboxId = "MESSAGE_"+this.now()+this.shuffleRandom(6);
    this.callbacks[messageboxId] = _callback;
    var alert_html = '';
    alert_html += '<div class="pop_msg pb15">';
    alert_html += '<i class="error"></i>';
    alert_html += '<div class="pop_cont">';
    if($m.trim(_message1) != ''){
        alert_html += '<strong>'+_message1+'</strong>';
    }
    if($m.trim(_message2) != ''){
        alert_html += '<span class="dd">'+_message2+'</span>';
    }
    alert_html += '</div>';
    alert_html += '<button class="btn_go mt30" type="button"  onclick="$m.alertok(\''+messageboxId+'\');">확인</button>';
    alert_html += '</div>';
    var tmp = document.createElement( 'div' );
    tmp.setAttribute("id",messageboxId);
    tmp.setAttribute("class","_modal");
    tmp.innerHTML = alert_html;
    document.body.appendChild(tmp);
};

Moca.prototype.merrorBig = function(_message0,_message1,_message2,_btnLabel,_callback){
    ['errormessage, error icon, confirm large button']; 
    var messageboxId = "MESSAGE_"+this.now()+this.shuffleRandom(6);
    this.callbacks[messageboxId] = _callback;
    var alert_html = '';
    alert_html += '<div class="pop_msg big pb15">';
    alert_html += '<div class="top_txt">';
    alert_html += '<p>';
    alert_html += _message0;
    alert_html += '</p>';
    alert_html += '</div>';
    alert_html += '<div class="c_msg">';
    alert_html += '<i class="no"></i>';
    alert_html += '<div class="cont">';
    if($m.trim(_message1) != ''){
        alert_html += '<strong>'+_message1+'</strong>';
    }
    if($m.trim(_message2) != ''){
        alert_html += '<span class="dd">'+_message2+'</span>';
    }
    alert_html += '</div>';
    alert_html += '</div>';
    alert_html += '<button class="btn_go mt30" type="button"  onclick="$m.alertok(\''+messageboxId+'\');">'+_btnLabel+'</button>';
    alert_html += '</div>';
    var tmp = document.createElement( 'div' );
    tmp.setAttribute("id",messageboxId);
    tmp.setAttribute("class","_modal");
    tmp.innerHTML = alert_html;
    document.body.appendChild(tmp);
};

Moca.prototype.minfoBottom = function(_message1,_message2,_callback){
    ['error text, confirm large button'];   
    var messageboxId = "MESSAGE_"+this.now()+this.shuffleRandom(6);
    this.callbacks[messageboxId] = _callback;
    var alert_html = '';
    alert_html += '<div class="pop_msg btm type2 pb20 pop_show">';
    alert_html += '<div class="dfbox">';
    alert_html += '<h3>'+_message1+'</h3>';
    alert_html += '</div>';
    alert_html += '<div>';
    if($m.trim(_message2) != ''){
        alert_html += '<p class="fs14">'+_message2+'</p>';
    }
    alert_html += '</div>';
    alert_html += '<button class="btn_go mt30" type="button"  onclick="$m.alertok(\''+messageboxId+'\');">확인</button>';
    alert_html += '</div>';
    var tmp = document.createElement( 'div' );
    tmp.setAttribute("id",messageboxId);
    tmp.setAttribute("class","_modal");
    tmp.innerHTML = alert_html;
    document.body.appendChild(tmp);
};

Moca.prototype.confirm = function(_message,_callback){
    ['confirm messagebox']; 
    var messageboxId = "MESSAGE_"+this.now()+this.shuffleRandom(6);
    this.callbacks[messageboxId] = _callback;
    var confirm_html = '';
    //confirm_html += '<div class="moca_messagebox_modal" style="display:block" id='+messageboxId+'>                  ';
    confirm_html += '   <div class="moca_messagebox confirm">                                   ';
    confirm_html += '       <div class="moca_messagebox_grp">                                   ';
    confirm_html += '           <div class="ico"></div>                                         ';
    confirm_html += '           <h2 class="moca_messagebox_title"></h2>                  ';
    confirm_html += '           <div class="moca_message">                                      ';
    confirm_html += '               <p>'+_message+'</p>                                      ';
    confirm_html += '           </div>                                                          ';
    confirm_html += '           <div class="moca_btnbox">                                       ';
    confirm_html += '               <button type="button" class="moca_btn_confirm" onclick="$m.confirmyn(\''+messageboxId+'\',\'Y\');">확인</button>  ';
    confirm_html += '               <button type="button" class="moca_btn_cancel" onclick="$m.confirmyn(\''+messageboxId+'\',\'N\');">취소</button>   ';
    confirm_html += '           </div>                                                          ';
    confirm_html += '       </div>                                                              ';
    confirm_html += '   </div>                                                                  ';
    //confirm_html += '</div>                                                                     ';
    //document.body.innerHTML += confirm_html;
    
    var tmp = document.createElement( 'div' );
    tmp.setAttribute("id",messageboxId);
    tmp.setAttribute("class","moca_messagebox_modal");
    tmp.innerHTML = confirm_html;
    document.body.appendChild(tmp);
};



Moca.prototype.mconfirm = function(_message1,_message2,_callback,_label1,_label2){
    ['single page alert messagebox'];   
    var messageboxId = "MESSAGE_"+this.now()+this.shuffleRandom(6);
    this.callbacks[messageboxId] = _callback;
    var alert_html = '';
    alert_html += '<div class="pop_msg type1">';
    alert_html += '<div class="pop_cont">';
    if($m.trim(_message1) != ''){
        alert_html += '<strong>'+_message1+'</strong>';
    }
    if($m.trim(_message2) != ''){
        alert_html += '<span>'+_message2+'</span>';
    }
    alert_html += '</div>';
    alert_html += '<div class="btnbox">';
    alert_html += '<div class="rta">';

    var label1 = '취소';
    if(_label1 != null){
        label1 = _label1;
    }
    
    var label2 = '확인';
    if(_label2 != null){
        label2 = _label2;
    }
    
    alert_html += '             <button type="button" class="btn_df" onclick="$m.confirmyn(\''+messageboxId+'\',\'N\');">'+label1+'</button>   ';
    alert_html += '             <button type="button" class="btn_cm" onclick="$m.confirmyn(\''+messageboxId+'\',\'Y\');">'+label2+'</button>  ';
    
    //alert_html += '<button class="btn_cm" type="button"  onclick="$m.alertok(\''+messageboxId+'\');">확인</button>';
    alert_html += '</div>';
    alert_html += '</div>';
    alert_html += '</div>';
    var tmp = document.createElement( 'div' );
    tmp.setAttribute("id",messageboxId);
    tmp.setAttribute("class","_modal");
    tmp.innerHTML = alert_html;
    document.body.appendChild(tmp);
};



Moca.prototype.question = function(_message,_callback,m1,m2,m3){
    ['confirm messagebox']; 
    var messageboxId = "MESSAGE_"+this.now()+this.shuffleRandom(6);
    this.callbacks[messageboxId] = _callback;
    var confirm_html = '';
    //confirm_html += '<div class="moca_messagebox_modal" style="display:block" id='+messageboxId+'>                  ';
    confirm_html += '   <div class="moca_messagebox question" style="max-width:800px">                                   ';
    confirm_html += '       <div class="moca_messagebox_grp">                                   ';
    confirm_html += '           <div class="ico"></div>                                         ';
    confirm_html += '           <h2 class="moca_messagebox_title"></h2>                  ';
    confirm_html += '           <div class="moca_message">                                      ';
    confirm_html += '               <p>'+_message+'</p>                                      ';
    confirm_html += '           </div>                                                          ';
    confirm_html += '           <div class="moca_btnbox">                                       ';
    
    confirm_html += '               <button type="button" class="moca_btn_confirm" onclick="$m.question123(\''+messageboxId+'\',\'1\');">'+m1+'</button>  ';
    confirm_html += '               <button type="button" class="moca_btn_confirm" onclick="$m.question123(\''+messageboxId+'\',\'2\');">'+m2+'</button>  ';
    confirm_html += '               <button type="button" class="moca_btn_cancel" onclick="$m.question123(\''+messageboxId+'\',\'3\');">'+m3+'</button>   ';
    confirm_html += '           </div>                                                          ';
    confirm_html += '       </div>                                                              ';
    confirm_html += '   </div>                                                                  ';
    //confirm_html += '</div>                                                                     ';
    //document.body.innerHTML += confirm_html;
    
    var tmp = document.createElement( 'div' );
    tmp.setAttribute("id",messageboxId);
    tmp.setAttribute("class","moca_messagebox_modal");
    tmp.innerHTML = confirm_html;
    document.body.appendChild(tmp);
    
};


Moca.prototype.error = function(_message,_callback){
    ['error messagebox'];   
    var messageboxId = "MESSAGE_"+this.now()+this.shuffleRandom(6);
    this.callbacks[messageboxId] = _callback;
    var error_html = '';
    //error_html +='<div class="moca_messagebox_modal" style="display:block" id='+messageboxId+'>               '; 
    error_html +='  <div class="moca_messagebox error">                                   ';
    error_html +='      <div class="moca_messagebox_grp">                                 ';
    error_html +='          <div class="ico"></div>                                       ';
    error_html +='          <h2 class="moca_messagebox_title"></h2>                  ';
    error_html +='          <div class="moca_message">                                    ';
    error_html +='              <p>'+_message+'</p>                                          ';
    error_html +='          </div>                                                        ';
    error_html +='          <div class="moca_btnbox">                                     ';
    error_html +='              <button type="button" class="moca_btn_confirm" onclick="$m.errorok(\''+messageboxId+'\');">확인</button>';
    error_html +='          </div>                                                        ';
    error_html +='      </div>                                                            ';
    error_html +='  </div>                                                                ';
    //error_html +='</div>                                                                  ';
    //document.body.innerHTML += error_html;
    
    var tmp = document.createElement( 'div' );
    tmp.setAttribute("id",messageboxId);
    tmp.setAttribute("class","moca_messagebox_modal");
    tmp.innerHTML = error_html;
    document.body.appendChild(tmp); 
};

Moca.prototype.shuffleRandom = function(n) {
    ['난수생성'];
    var ar = new Array();
    var temp;
    var rnum;
   
    //전달받은 매개변수 n만큼 배열 생성 ( 1~n )
    for(var i=1; i<=n; i++){
        ar.push(i);
    }

    //값을 서로 섞기
    for(var i=0; i< ar.length ; i++)
    {
        rnum = Math.floor(Math.random() *n); //난수발생
        temp = ar[i];
        ar[i] = this.toTwoChar(ar[rnum]);
        ar[rnum] = this.toTwoChar(temp);
    }
    return JSON.stringify(ar).replace(/\,|\"|\[|\]/g,'');
};

Moca.prototype.toTwoChar = function(value) {
    ['1자리숫자를 앞에 0을 붙여 2자리 숫자로 만듬'];
    var tmp = value+'';
    if(tmp.length == 1){
        tmp = '0'+tmp;
    }
    return tmp;
};

Moca.prototype.now = function(_d) {
    ['현재시간을 밀리세컨드까지 숫자로만 붙여서가져옴'];
    var d;
    if(_d == null){
        d = new Date();
    }else{
        d = _d;
    }
    var nowtime = d.getFullYear();
    nowtime += this.toTwoChar(d.getMonth()+1);
    nowtime += this.toTwoChar(d.getDate());
    nowtime += this.toTwoChar(d.getHours());
    nowtime += this.toTwoChar(d.getMinutes());
    nowtime += this.toTwoChar(d.getSeconds());
    nowtime += d.getMilliseconds();
    nowtime += d.getDay();
    return nowtime;
};

Moca.prototype.dateFormat = function(_datatimeNumber) {
    ['숫자를 날짜시간형태의 포멧팅'];
    return _datatimeNumber.substring(0,4)+"-"+_datatimeNumber.substring(4,6)+"-"+_datatimeNumber.substring(6,8)+" "+_datatimeNumber.substring(8,10)+":"+_datatimeNumber.substring(10,12)+":"+_datatimeNumber.substring(12,14);
};


Moca.prototype.alertok = function(_messageboxId,_tdId,_textAreaObj,_grd) {
    ['현재 alert창을 닫음'];
	if($m.trim(_tdId) !=''){
		var _srcId = $(_grd).attr('srcid');
	    var _realRow = $(_grd).attr("selectedRealRowIndex");
	    var _returnValue = $(_textAreaObj).html();
		$m[_srcId].setCellData(_grd,_realRow,_tdId,_returnValue);
	}
	
	
    $('#'+_messageboxId).remove();
    if(this.callbacks[_messageboxId]){
        this.callbacks[_messageboxId](_returnValue);
        delete this.callbacks[_messageboxId];
    }
};

Moca.prototype.alertesc = function(_messageboxId,returnValue) {
    ['현재 confirm창을 닫음'];
    $('#'+_messageboxId).remove();
    if(this.callbacks[_messageboxId]){
        this.callbacks[_messageboxId](returnValue);
        delete this.callbacks[_messageboxId];
    }
};

Moca.prototype.confirmyn = function(_messageboxId,returnValue) {
    ['현재 confirm창을 닫음'];
    $('#'+_messageboxId).remove();
    if(this.callbacks[_messageboxId]){
        this.callbacks[_messageboxId](returnValue);
        delete this.callbacks[_messageboxId];
    }
};

Moca.prototype.question123 = function(_messageboxId,returnValue) {
    ['현재 confirm창을 닫음'];
    $('#'+_messageboxId).remove();
    if(this.callbacks[_messageboxId]){
        this.callbacks[_messageboxId](returnValue);
        delete this.callbacks[_messageboxId];
    }
};


Moca.prototype.errorok = function(_messageboxId) {
    ['현재 error창을 닫음'];
    $('#'+_messageboxId).remove();
    if(this.callbacks[_messageboxId]){
        this.callbacks[_messageboxId]();
        delete this.callbacks[_messageboxId];
    }
};


Moca.prototype.loading = function(_loadingId,_time,_thisObj,_loadingInfo){
    ['로딩']; 
    if(_loadingId != null){
        var t = 200;
        if(_time != null){
            t = _time;
        }
        setTimeout(function(){
            $('#'+_loadingId).remove();
        },t);
    }else{
        
        var messageboxId = "LOADING_"+this.now()+this.shuffleRandom(6);
        var error_html = '';
        var clsName = "moca_modal";
        if(_loadingInfo != null && _loadingInfo.type == 'mobile'){
            error_html +='<div class="progress_msg"><i class="load_img"></i><div class="pop_cont">'+_loadingInfo.content+'</div></div>';
            clsName = _loadingInfo.className;
        }else if(_loadingInfo != null && _loadingInfo.type == 'pc'){
            error_html +='<div class="progress_msg_pc"><i class="load_img"></i><div class="pop_cont">'+_loadingInfo.content+'</div></div>';
        }else{
            error_html +='<div class="moca_progress type1"><div class="loader"></div></div>'; 
        }
        if($m.trim(clsName) == '' ){
            clsName = "moca_modal";
        }
        
        var tmp = document.createElement( 'div' );
        tmp.setAttribute("id",messageboxId);
        tmp.setAttribute("class",clsName);
        var calHtml = '';
        tmp.innerHTML = error_html;
        if(_thisObj != null && _thisObj.pageId != null && _thisObj.pageId.indexOf('HTML') != 0){
            if(_thisObj.pageId.startsWith("POPUP")){
                $('div[pageid="'+_thisObj.pageId+'"][srcid="'+_thisObj.srcId+'"].moca_popup').append(tmp);
            }else{
                $('div[pageid="'+_thisObj.pageId+'"][srcid="'+_thisObj.srcId+'"].moca_tab_panel[role=mdipanel]').append(tmp);
            }
        }else{
            document.body.appendChild(tmp);
        }
        return messageboxId;
    }
    
    
    
    
    
    
    


};

Moca.prototype.loading2 = function(_loadingId,_time,_messageTag){
    ['로딩2'];    
    if(_loadingId != null){
        var t = 200;
        if(_time != null){
            t = _time;
        }
        setTimeout(function(){
            $('#'+_loadingId).remove();
        },t);
    }else{
        var messageboxId = "LOADING_"+this.now()+this.shuffleRandom(6);
        var error_html = '';
        if(_messageTag == null){
            _messageTag = '<div class="moca_mattrix type1"><div class="loader"></div><span class="blink">대상파일 위변조여부 <br>검사중입니다.<br> 잠시만 기다려 주세요.</span></div>'; 
        }
        error_html +=_messageTag; 
        
        var tmp = document.createElement( 'div' );
        tmp.setAttribute("id",messageboxId);
        tmp.setAttribute("class","moca_modal");
        var calHtml = '';
        tmp.innerHTML = error_html;
        document.body.appendChild(tmp);
        return messageboxId;
    }
};

Moca.prototype.fn_inputCal = function(_thisObj) {
    ['input calendar열기'];
    event.stopPropagation();
    if(sampleCalendar.calId == null){
        var val = _thisObj.previousSibling.value;
        var typeIdx = 0;
        var calViewFormat = $(_thisObj).parent().attr("displayformat");
        if(calViewFormat == "####"){
            typeIdx = 2
        }else if(calViewFormat == "####-##"){
            typeIdx = 1
        }else {
            typeIdx = 0
        }
        sampleCalendar.init(val,_thisObj, typeIdx);
    }else{
    	$(_thisObj).parent().find('.moca_calendar').remove();
        sampleCalendar.calId = null;
    }
};

Moca.prototype.fn_inputMultiCal = function(_thisObj) {
    ['[권태균] input MultiCalendar열기'];
    event.stopPropagation();
    var calTag = $(_thisObj).parent().parent();
    var opt = {};
    var val1 = $(_thisObj).siblings("input").eq(0).val();
    var val2 = $(_thisObj).siblings("input").eq(1).val();
    
    if(multiCalendar.calId == null){
        multiCalendar.calId = calTag.attr("id");
    //if(val1 != null || val2 != null){
        var typeIdx = 0;
        var calViewFormat = calTag.attr("displayformat");
        if(calViewFormat == "####"){
            typeIdx = 2
        }else if(calViewFormat == "####-##"){
            typeIdx = 1
        }else {
            typeIdx = 0
        }
        var selecterItem = calTag.attr("selecterItem");
        var defaultValue = calTag.attr("defaultValue");
        var maxTermByMonth = calTag.attr("maxTermByMonth");
        var maxTermByDay = calTag.attr("maxTermByDay");
        var maxTermByYear = calTag.attr("maxTermByYear");
        
        opt['from'] = val1;
        opt['to'] = val2;
        opt['calType'] = typeIdx;
        opt['thisObj'] = _thisObj;
        opt['selecterItem'] = selecterItem;
        opt['defaultValue'] = defaultValue;
        opt['maxTermByMonth'] = Number(maxTermByMonth);
        opt['maxTermByDay'] = Number(maxTermByDay);
        opt['maxTermByYear'] = Number(maxTermByYear);
        opt['target'] = $(_thisObj).closest('div[type="inputMultiCalendar"]');
        multiCalendar.init(opt);
    }else{
        $('.moca_calendar_fromto').remove();
        multiCalendar.calId = null;
    }
};


Moca.prototype.iptCalSelect = function(_iptCalId,_iptId,_dt) {
    ['input calendar열기'];
    if(_dt != null){
        _iptId.value = this.getDisplayFormat_value(_iptId.parentElement,_dt); 
    }
    this.closeCalendar($('#'+_iptCalId.id));
    console.log('~~~>iptCalSelect');
};

Moca.prototype.closeCalendar = function(_obj) {
    ['[권태균] 달력닫기'];
    _obj.remove();
    sampleCalendar.calendarVariableResset();
};

Moca.prototype.closeMultiCalendar = function(_obj) {
    ['[권태균] 멀티달력닫기'];
    _obj.remove();
    multiCalendar.calendarVariableResset();
    multiCalendar.calId = null;
};

Moca.prototype.getDisplayFormat_value = function(_obj,_dt) {
    ['input calendar열기'];
    if(_dt == null){
        return "";
    }
    _dt = (_dt+'').replace(/-/g,'');
    var _displayFormat = _obj.getAttribute("displayFormat");
    var displayFunction = _obj.getAttribute("displayFunction");
    if(_displayFormat != null){
        var arr = _displayFormat.split('-');
        var rx_str = ""; 
        for(var k=0; k < arr.length; k++){
            var row = arr[k];
            var leng = row.length;
            rx_str +="(.{"+leng+"})";
        }
        var rx = new RegExp(rx_str,"gi");
        return String(_dt).replace(rx,'$1-$2-$3');
    }else if(displayFunction != null){
        return eval(displayFunction)(_dt);
    }else{
        return _dt;
    }
    
};


Moca.prototype.getContents = function(data,_url,_type,_popupid,_title,_includeObj,_mode) {
    ['getContents'];
       if(_type == 'POP'){
            var o = {type:_type};
            o.url = _url;
            o.srcId = _url.replace(/(.*?)(\/)([^\/]*?)(\.[^\/]*?$)/g,'$3');;
            o.label = _title;
            o.popupId = _popupid;
            //o.clickedMenuId = _clickedMenuId;
            o.data = data;
            
            
        
        	o.title = _title;
            o.top = '0';
            o.left = '0';
            o.width = '100%';
            o.height = '100%';

                
                
                
            var mdiObj = $m.rendering(o);
            $m.callReady(mdiObj);
       }else if(_type == 'HTML'){
            var o = {type:_type};
            o.url = _url;
            o.srcId = _url.replace(/(.*?)(\/)([^\/]*?)(\.[^\/]*?$)/g,'$3');;
            o.label = _title;
            o.data = data;
            var htmlObj = $m.rendering(o);
            //$m.callReady(htmlObj);
            return htmlObj;
       }else{
           if(_mode != '혼합모드'){
               data = data.replace(/<link(.*?)>|<meta(.*?)>/gi,'');
               data = data.replace(/<\!DOCTYPE html>/gi,'');
               data = data.replace(/<html(.*?)>|<\/html>|<body(.*?)>|<\/body>|<head>|<\/head>/gi,'');
               data = data.replace(/<title(.*?)>(.*?)<\/title>/gi,'');
               data = data.replace(/<script(.*?)><\/script>/gi,'');
           }

           var _fileName = $m.getFileNameFromUrl(_url);
           if(_fileName == null || _fileName == ''){
               _fileName = 'index.html';
           } 
           var _srcId = _fileName.substring(0,_fileName.indexOf('.'));
           $m.pageId = _type+"_"+$m.now()+$m.shuffleRandom(6);
           $m.srcId = _srcId; 
           data = data.replace(/class="moca_tab_panel"/gi,'class="moca_tab_panel" id="'+$m.pageId+'" ');
           data = $m.addPageId(data,$m.pageId,_srcId);
           data = $m.injectionPageObj(data,$m.pageId,_srcId,_mode); 
           var _json_data = '';
           if(_includeObj != null){
               _json_data = _includeObj.getAttribute("data");
           }
           data = data.replace(/moca\.init\s*\(/gi,"$m.init('"+$m.pageId+"','"+$m.srcId+"','"+_url+"','"+_json_data+"', ");
       }
       
       
       return data;
};

Moca.prototype.renderInputCalendar = function(_divObj) {
    ['renderInputCalendar'];
    var _id = _divObj.id;
    var displayFormat = _divObj.getAttribute("displayFormat");
    var type = _divObj.getAttribute("type");
    var _html = '';
    
    var defaultValue = _divObj.getAttribute("defaultValue");
    if($m.trim(defaultValue) == ''){
        defaultValue = "오늘";
    }
    var ondateSelected = _divObj.getAttribute("ondateSelected");    
    
    var value = "";
    value = $m.getFromToByOption(defaultValue).from;
    //var v = $m.getDisplayFormat_value(_comp,_value);
    _html += '<input type="text" class="moca_input" id="'+('sub_'+_id)+'" ondateSelected="'+ondateSelected+'" displayFormat="'+displayFormat+'" value="'+value+'" compType="'+type+'" onblur="$m.setValue(this,this.value);"  onkeydown="$m.keydown(this,this.value);">';
    _html += '<button type="button" class="moca_ica_btn"onclick="$m.fn_inputCal(this);">달력선택</button>';
    _divObj.innerHTML = _html;
};

Moca.prototype.setCalByRadio = function(_thisObj) {
    ['setCalByRadio'];
    var objIndexText = $(_thisObj).parent().find('label').text();
    //getFromToByOption = function(objIndexText,_to_date)
    var calObj =  $(_thisObj).closest("[type='inputMultiCalendar']")[0];
    var reFromTo = $m.getFromToByOption(objIndexText,$(calObj).find('input')[1].value);
    
    $(calObj).find('input')[0].value = $m.getDisplayFormat_value(calObj,reFromTo.from);
    $(calObj).find('input')[1].value = $m.getDisplayFormat_value(calObj,reFromTo.to);
};

Moca.prototype.renderInputMultiCalendar = function(_divObj,_srcId) {
    ['[권태균]renderInputMultiCalendar'];
    var _id = _divObj.id+"_"+_divObj.getAttribute("pageid");
    var _maxLength = '';
    var _style = '';
    var _width = '';
    var _class ='';
    
    var _displayformat = $(_divObj).attr('displayformat');
    if(_displayformat == '####-##-##'){
    	_style ="width:205px;"
    	_maxLength = 'maxlength="10"';
    }else if(_displayformat == '####-##-## ##:##'){
    	$(_divObj).addClass('ipt_hhmmss');
    	_class="ica_ipt";
    }
    
    var _html = '';
    _html += '<div id="'+('sub_'+_id)+'" style="'+_style+'" class="'+_class+'">';
    _html += '  <input type="text" class="moca_input"  style="width:calc(50% - 15px)"  value="" '+_maxLength+'>';
    _html += '  <i style="position:relative; left:-1px">~</i>';
    _html += '  <input type="text" class="moca_input"  style="width:calc(50% - 15px)"  value="" '+_maxLength+'>';
    _html += '  <button type="button" class="moca_ica_btn"onclick="$m.fn_inputMultiCal(this);">달력선택</button>';
    _html += '</div>';
    //_divObj.innerHTML = _html;
    var defaultValue = _divObj.getAttribute("defaultValue");
    if(defaultValue == null){
        defaultValue = "오늘";
    }
    
    var _showRadioOption = _divObj.getAttribute('showRadioOption');
    if(_showRadioOption == "true"){
        var _itemset = _divObj.getAttribute('selecterItem');
        var _itemsetArray = _itemset.split(',');
        _html +='<div class="moca_ica_radio ml5 fl">'
        for(var i=0; i < _itemsetArray.length; i++){
            var obj = {};
            obj.label = _itemsetArray[i];
            var checkedStr = '';
            
            if(i == 0){
                checkedStr = 'checked';
                obj.value = 1;
            }else if(obj.label == defaultValue){
                checkedStr = 'checked';
                obj.value = 1;
            }else{
                obj.value = 0;      
            }
            
            _html += '<div class="fl"><input type="radio" class="moca_radio_input" name="'+_id+'" id="'+_id+'_'+i+'" value="'+obj.value+'" '+checkedStr+' onclick="$m.setCalByRadio(this)">';
            _html += '<label class="moca_radio_label mr5" for="'+_id+'_'+i+'">'+obj.label+'</label>';
            _html += '</input></div>';
        }
        _html +='</div>'
    }

    _divObj.innerHTML = _html;

    var initJson = $m[_srcId].getFromTo(defaultValue);
    
    //$('#ipc_3 input')[0].value,to:$('#ipc_3 input')[1].value
    $m.setMultiCalendar(_divObj,initJson);
    $m.setFromToByMenuId(_id,$m.menuId,_srcId);
};

Moca.prototype.setMultiCalendar = function(_divObj,initJson) {
    ['setMultiCalendar setValue'];
    var inputs = $(_divObj).find('input');
    inputs[0].value = initJson.from;
    inputs[1].value = initJson.to;
};


Moca.prototype.renderCombo = function(_divObj,_val,_gubun,_pageId,_srcId) {
    ['renderCombo'];
    var _list= _divObj['list'];
    var _codeOpt= _divObj['codeOpt'];
    if(_codeOpt == null){
        _codeOpt = {};
    }
    var __srcid = _srcId;
    if(__srcid == null){
    	__srcid = $(_divObj).attr('srcid');
    }
    if(_list == null){
        var _id = _divObj.id;
        var _label = _divObj.getAttribute("label");
        var _listStr = _divObj.getAttribute('itemset');
        if(_listStr != null){
            var _listObj = JSON.parse(_listStr);
            _divObj['list'] = _listObj;
            _list = _divObj['list'];
            _gubun = 'normal';
        }
        var _codeOptStr = _divObj.getAttribute("codeOpt");
        if(_codeOptStr != null){
            var __codeOpt = JSON.parse(_codeOptStr);
            _divObj['codeOpt'] = __codeOpt;
            _codeOpt =_divObj['codeOpt'];
            _gubun = 'normal';
        }
    }
    if(_list != null){
        var _grdId = _divObj.id;
        var _displayFormat = _divObj.getAttribute('displayFormat');
        var _onchange = _divObj.getAttribute('onchange');
        var _inneronchange = _divObj.getAttribute('inneronchange');
        var _readonly = _divObj.getAttribute('readonly');
        if(_readonly){_divObj.setAttribute('readonly',_readonly)};
        if($m.trim(_inneronchange) != ''){
            _onchange = _inneronchange;
        }
        var _html = '';
        if(_gubun == 'normal'){
            _html += $m.getSelectTagForNormal(_grdId,_onchange,_pageId,_srcId);
        }else{
            _html += $m.getSelectTagForCombo(_grdId,_pageId,_srcId);
        }
        var cdKey = _divObj.getAttribute('cdField');
        var nmKey = _divObj.getAttribute('nmField');
        if(cdKey == null){
            cdKey = "cd";
        }
        if(nmKey == null){
            nmKey = "nm";
        }       
        
        var _allOpt = _codeOpt['allOption']; 
        var _selectedValue = _codeOpt['selectedValue']; 
        if(_selectedValue != null){
            _val = _selectedValue;
        }
        
        
        if(_allOpt != null){
            var _reLabel = '';
            var _value = '';
            if(_displayFormat != null && _displayFormat != 'null' && _allOpt != null && _allOpt.value != ''){
                _reLabel = _displayFormat.replace('[value]',_allOpt.value).replace('[label]',_allOpt.label);
            }else{
                _reLabel = _allOpt.label;
            }
            _html += '<option value="'+_allOpt.value+'" selected>'+_reLabel+'</option>';
        }
        
        
        var codeToLabelMap = {};
        var codeToDispLabelMap = {};
        var _inputLeng = $(_divObj).find('input').length;
        
        for(var i=0; i < _list.length; i++){
            var row = _list[i];
            var cd = row[cdKey];
            var nm = row[nmKey];
            var _checked = row.checked;
            var selectedStr = '';
            if(_checked == 'true'){
                selectedStr = 'selected';
            }
            if(_inputLeng > 0 && $(_divObj).attr('code') == cd){
            	selectedStr = 'selected';
            }
            var _reLabel = '';
            var _value = '';
            if(_displayFormat != null && _displayFormat != 'null' && cd != ''){
                _reLabel = _displayFormat.replace('[value]',cd).replace('[label]',nm);
            }else{
                _reLabel = nm;
            }
            
            if(cd == _val){
                selectedStr = 'selected';
            }
            _html += '<option value="'+cd+'" '+selectedStr+'>'+_reLabel+'</option>';
            codeToLabelMap[cd] = nm;
            codeToDispLabelMap[cd] = _reLabel;
        }
        _divObj['codeToLabelMap'] = codeToLabelMap;
        _divObj['codeToDispLabelMap'] = codeToDispLabelMap;
        _html += '</select>';
        $(_divObj).attr('code',$m.getValue(_divObj));
   	 	$(_divObj).attr('label',$m[__srcid].getComboLabel(_grdId));
        if(_readonly){
        	_divObj.innerHTML = '<input class="moca_input" type="text" readonly value="'+_divObj['codeToDispLabelMap'][$m.getValue(_divObj)]+'">';
        	//_divObj.innerHTML = _divObj['codeToDispLabelMap'][$m.getValue(_divObj)];
        }else{
        	_divObj.innerHTML = _html;
        }
        
    }
};
Moca.prototype.searchComboClick = function(thisObj) {
    var scmb = $(thisObj).closest('[type=searchCombo]');
    var div = scmb.find('.searchCmbTable');
    if(div.is(':visible')){
        div.hide();
    }else{
        div.show();
        var scmbObj = scmb[0];
        var v = scmb.attr('value');
        
        if(scmbObj.prevli != null){
            $(scmbObj.prevli).removeClass('on');
        }
        scmbObj.prevli = div.find('li[value='+v+']');
        $(scmbObj.prevli).addClass('on');
    }
};
Moca.prototype.searchComboSelectedClick = function(thisObj) {
    var v = event.srcElement.getAttribute("value");
    var t = event.srcElement.innerHTML;
    var scmb = $(thisObj).closest('[type=searchCombo]');
    var prev_v = scmb.attr('value');
    var text_v = scmb.attr('text');
    if(prev_v != v && scmb[0].inneronchange){
        eval(scmb[0].inneronchange)(prev_v,text_v,v,t);
    }
    scmb.attr('value',v);
    scmb.attr('text',t);
    var ipt = scmb.find('.moca_input');
    ipt.val(t);
    var div = scmb.find('.searchCmbTable');
    if(div.is(':visible')){
        div.hide();
    }else{
        div.show();
    }
};
Moca.prototype.searchComboSelectedMouseover = function(thisObj) {
    var scmb = $(thisObj).closest('[type=searchCombo]');
    var scmbObj = scmb[0];
    if(scmbObj.prevli != null){
        $(scmbObj.prevli).removeClass('on');
    }
    scmbObj.prevli = event.srcElement;
    $(scmbObj.prevli).addClass('on');
};
Moca.prototype.searchComboBlur = function(thisObj) {
    setTimeout(function(){
        var _type = $(thisObj).attr("type");
        var scmb;
        if(_type == 'searchCombo'){
            scmb = $(thisObj);
        }else{
            scmb = $(thisObj).closest('[type=searchCombo]');
        }
        var v = scmb.attr('value');
        var t = scmb.attr('text');
        
        var scmbObj = scmb[0];
        var div = scmb.find('.searchCmbTable');
        if(scmbObj.prevli != null){
            $(scmbObj.prevli).removeClass('on');
        }
        scmbObj.prevli = div.find('li[value='+v+']');
        $(scmbObj.prevli).addClass('on');
        t = scmbObj.prevli.html();
        scmb.attr('text',t);
        var ipt = scmb.find('.moca_select');
        ipt.val(t);
        
        div.hide();
    },200);
};

Moca.prototype.searchComboSetter = function(thisObj) {
    var _type = $(thisObj).attr("type");
    var scmb;
    if(_type == 'searchCombo'){
        scmb = $(thisObj);
    }else{
        scmb = $(thisObj).closest('[type=searchCombo]');
    }
    var v = scmb.attr('value');
    var t = scmb.attr('text');
    
    var scmbObj = scmb[0];
    var div = scmb.find('.searchCmbTable');
    if(scmbObj.prevli != null){
        $(scmbObj.prevli).removeClass('on');
    }
    scmbObj.prevli = div.find('li[value='+v+']');
    $(scmbObj.prevli).addClass('on');
    t = scmbObj.prevli.html();
    scmb.attr('text',t);
    var ipt = scmb.find('.moca_select');
    ipt.val(t);
    
    div.hide();
};


Moca.prototype.searchComboFocus = function(thisObj) {
    var scmb = $(thisObj).closest('[type=searchCombo]');
    var scmbObj = scmb[0];
    if(scmbObj.text != ''){
        var filterDiv = $(thisObj).closest('div.filterheader').next();
        filterDiv.find('li').css('display','');
        filterDiv.find('li:not(:contains("'+thisObj.value+'"))').css('display','none');
    }else{
        var div = scmb.find('.searchCmbTable');
        div.show();
    }
};


Moca.prototype.searchComboFilter = function(thisObj) {
    ['콤보내찾기'];
    try{
        var scmb = $(thisObj).closest('[type=searchCombo]');
        var div = scmb.find('.searchCmbTable');
        div.show();
        var filterDiv = $(thisObj).closest('div.filterheader').next();
        var lis = filterDiv.find('li');
        lis.css('display','');
        if(thisObj.value != ''){
            filterDiv.find('li:not(:contains("'+thisObj.value+'"))').hide();
        }
        var lis_visible = filterDiv.find('li:visible');
        if(lis_visible.length > 0){
            var v = lis_visible[0].getAttribute("value");
            var t = lis_visible[0].innerHTML;
            scmb.attr('value',v);
            scmb.attr('text',t);
            var ipt = scmb.find('.moca_select');
            ipt.val(t);
            var div = scmb.find('.searchCmbTable');
            div.show();
        }else{
            var div = scmb.find('.searchCmbTable');
            div.hide();
        }
    }catch(e){
        alert(e);
    }
};

Moca.prototype.searchComboFullShow = function(thisObj) {
    ['콤보전체보이기'];
    var scmb = $(thisObj).closest('[type=searchCombo]');
    var filterDiv = $(thisObj).closest('div.filterheader').next();
    var lis = filterDiv.find('li');
    lis.css('display','');
    var div = scmb.find('.searchCmbTable');
    div.width(scmb.width());
    if(div.is(':visible')){
        div.hide();
    }else{
        div.show();
    }
};


Moca.prototype.swaipClickScroll = function(thisObj) {
    ['swaipScroll'];
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click",true,true,window,0,0,0,0,0,false,false,false,false,0,null);
    event.target.style.display = 'none';
    var cb = document.elementFromPoint(event.x,event.y);
    cb.dispatchEvent(evt);
    if($(cb).prop('tagName') !='INPUT' || $(cb).parent()[0].tagName != 'TD'){
    	   event.target.style.display = 'block';
    }
 
    
};

Moca.prototype.swaipDblScroll = function(thisObj) {
    ['swaipDblScroll'];
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("dblclick",true,true,window,0,0,0,0,0,false,false,false,false,0,null);
    event.target.style.display = 'none';
    var cb = document.elementFromPoint(event.x,event.y);
    cb.dispatchEvent(evt);
    event.target.style.display = 'block';
};





Moca.prototype.renderSearchCombo = function(_divObj,_val,_gubun,_pageId,_srcId) {
    ['renderSearchCombo'];
    var _list= _divObj['list'];
    var _codeOpt= _divObj['codeOpt'];
    if(_codeOpt == null){
        _codeOpt = {};
    }
    
    if(_list == null){
        var _id = _divObj.id;
        var _label = _divObj.getAttribute("label");
        var _listStr = _divObj.getAttribute('itemset');
        if(_listStr != null){
            var _listObj = JSON.parse(_listStr);
            _divObj['list'] = _listObj;
            _list = _divObj['list'];
            _gubun = 'normal';
        }
        var _codeOptStr = _divObj.getAttribute("codeOpt");
        if(_codeOptStr != null){
            var __codeOpt = JSON.parse(_codeOptStr);
            _divObj['codeOpt'] = __codeOpt;
            _codeOpt =_divObj['codeOpt'];
            _gubun = 'normal';
        }
    }
    if(_list != null){
        var _grdId = _divObj.id;
        var _displayFormat = _divObj.getAttribute('displayFormat');
        var _onchange = _divObj.getAttribute('onchange');
        var _readOnly = _divObj.getAttribute('readOnly');
        
        
        
        var _inneronchange = _divObj.getAttribute('inneronchange');
        if($m.trim(_inneronchange) != ''){
            _inneronchange = _inneronchange.replace(/\(.*?\)/,'');
            _divObj.inneronchange = _inneronchange;
        }
        var _html = '';
        _html += '<div class="filterheader">';
        if(_readOnly == "true"){
            _html += '  <input type="text" class="moca_input" style="" readonly value="" >';            
        }else{
            _html += '  <input type="text" class="moca_input" style="" value="" onkeyup="$m.searchComboFilter(this)" placeholder="검색어를 입력하세요" onclick="$m.searchComboClick(this)" onblur="$m.searchComboBlur(this)" onfocus="$m.searchComboFocus(this)">';
            _html += '  <button class="btn_cmb" onclick="$m.searchComboFullShow(this)"></button>';
        }
        _html += '</div>';
        _html += '<div class="searchCmbTable" style="display:none">';
        _html += '<ul top_position="348" style="max-height: 497px;" onclick="$m.searchComboSelectedClick(this)" onmouseover="$m.searchComboSelectedMouseover(this)">';
        
        var cdKey = _divObj.getAttribute('cdField');
        var nmKey = _divObj.getAttribute('nmField');
        if(cdKey == null){
            cdKey = "cd";
        }
        if(nmKey == null){
            nmKey = "nm";
        }       
        
        var _allOpt = _codeOpt['allOption']; 
        var _selectedValue = _codeOpt['selectedValue']; 
        if(_selectedValue != null){
            _val = _selectedValue;
        }
        
        
        if(_allOpt != null){
            var _reLabel = '';
            var _value = '';
            if(_displayFormat != null && _displayFormat != 'null' && _allOpt != null && _allOpt.value != ''){
                _reLabel = _displayFormat.replace('[value]',_allOpt.value).replace('[label]',_allOpt.label);
            }else{
                _reLabel = _allOpt.label;
            }
            _html += '<li class="" value="'+_allOpt.value+'" selected>'+_reLabel+'</li>';
        }
        
        
        var codeToLabelMap = {};
        var codeToDispLabelMap = {};
        for(var i=0; i < _list.length; i++){
            var row = _list[i];
            var cd = row[cdKey];
            var nm = row[nmKey];
            var _checked = row.checked;
            var selectedStr = '';
            if(_checked == 'true'){
                selectedStr = 'selected';
            }
            var _reLabel = '';
            var _value = '';
            if(_displayFormat != null && _displayFormat != 'null' && cd != ''){
                _reLabel = _displayFormat.replace('[value]',cd).replace('[label]',nm);
            }else{
                _reLabel = nm;
            }
            
            
            if(cd == _val){
                selectedStr = 'selected';
            }
            _html += '<li class="" value="'+cd+'" '+selectedStr+'>'+_reLabel+'</li>';
            codeToLabelMap[cd] = nm;
            codeToDispLabelMap[cd] = _reLabel;          
        }
        _divObj['codeToLabelMap'] = codeToLabelMap;
        _divObj['codeToDispLabelMap'] = codeToDispLabelMap;     
        _html += '</ul></div>';
        _divObj.innerHTML = _html;
    }
};


Moca.prototype.renderCheckbox = function(_divObj,_val,_gubun) {
    ['render Checkbox'];
    var _id = 'sub_'+_divObj.getAttribute("id");
    var _label = _divObj.getAttribute("label");
    var _onclick = "on_" +_divObj.getAttribute("id");
    var _html = '';
    _html += '<input type="checkbox" class="moca_checkbox_input" name="'+_id+'" id="'+_id+'">';
    _html += '<label class="moca_checkbox_label" for="'+_id+'" onclick="$m.'+_onclick+'(this)">'+_label+'</label>';
    _divObj.innerHTML = _html;
};





Moca.prototype.renderGrid = function(_divObj) {
    ['renderGrid'];
    var _id = _divObj.id;
    var pageid = _divObj.getAttribute("pageid");
    var srcid = _divObj.getAttribute("srcid");
    $m.getObj(_id,null,pageid,srcid);//id중복체크
    
    var _default_cell_height = _divObj.getAttribute("default_cell_height");
    var _label = _divObj.getAttribute("label");
    var _subLabel = _divObj.getAttribute("subLabel");
    var _toolbar = $(_divObj).hasClass("toolbar");
//  var _paging = $(_divObj).hasClass("paging");
    var _header_body = _divObj.innerHTML;
    var _rowSelectedColor = _divObj.getAttribute("rowSelectedColor");
    var _onRowSelectedFunc = _divObj.getAttribute("onRowSelected");
    var _onDblClickFunc = _divObj.getAttribute("onDblClick");
    var _onBeforeClick = _divObj.getAttribute("onBeforeClick");
    var _onAfterClick = _divObj.getAttribute("onAfterClick");
    
    
    var toolbar_search_size = _divObj.getAttribute("toolbar_search_size");
    var toolbar_col_showhide = _divObj.getAttribute("toolbar_col_showhide");
    var toolbar_detail = _divObj.getAttribute("toolbar_detail");
    var toolbar_exup = _divObj.getAttribute("toolbar_exup");
    var toolbar_exdn = _divObj.getAttribute("toolbar_exdn");
    var toolbar_addrow = _divObj.getAttribute("toolbar_addrow");
    var toolbar_delrow = _divObj.getAttribute("toolbar_delrow");
    var toolbar_nextbtn = _divObj.getAttribute("toolbar_nextbtn");
    var toolbar_full = _divObj.getAttribute("toolbar_full");
    var toolbar_dblclick = _divObj.getAttribute("toolbar_dblclick");
    var toolbar_fold = _divObj.getAttribute("toolbar_fold");
    
    if($m.getDevice() == 'pc'){
    	if(_divObj.getAttribute('toolbar_common_btns_pc')){
        	var _commBtnsStr = _divObj.getAttribute('toolbar_common_btns_pc');
        	var _commBtnsObj = JSON.parse(_commBtnsStr);
        	if(_commBtnsObj.detail == 'true' || _commBtnsObj.detail == 'dblclick'){
        		toolbar_detail = _commBtnsObj.detail;
        	}
        	if(_commBtnsObj.exup == 'true'){toolbar_exup = _commBtnsObj.exup;}
        	if(_commBtnsObj.exdn == 'true'){toolbar_exdn = _commBtnsObj.exdn;}
        	if(_commBtnsObj.addrow == 'true'){toolbar_addrow = _commBtnsObj.addrow;}
        	if(_commBtnsObj.delrow == 'true'){toolbar_delrow = _commBtnsObj.delrow;}
        	if(_commBtnsObj.full == 'true'){toolbar_full = _commBtnsObj.full;}
        	if(_commBtnsObj.dblclick == 'true'){toolbar_dblclick = _commBtnsObj.dblclick;}
    	}
    	
    	if(mocaConfig.grid.toolbar_common_btns_pc){
        	if(mocaConfig.grid.toolbar_common_btns_pc.priority == 'config'){
        		var _commBtnsStr = mocaConfig.grid.toolbar_common_btns_pc.attr;
            	var _commBtnsObj = JSON.parse(_commBtnsStr);      		
            	if(_commBtnsObj.detail) toolbar_detail = _commBtnsObj.detail;
            	if(_commBtnsObj.exup) toolbar_exup = _commBtnsObj.exup;
            	if(_commBtnsObj.exdn) toolbar_exdn = _commBtnsObj.exdn;
            	if(_commBtnsObj.addrow) toolbar_addrow = _commBtnsObj.addrow;
            	if(_commBtnsObj.delrow) toolbar_delrow = _commBtnsObj.delrow;
            	if(_commBtnsObj.full) toolbar_full = _commBtnsObj.full;
            	if(_commBtnsObj.dblclick) toolbar_dblclick = _commBtnsObj.dblclick;
        	}
    	}
    }else{
    	if(_divObj.getAttribute('toolbar_common_btns_mobile')){
        	var _commBtnsStr = _divObj.getAttribute('toolbar_common_btns_mobile');
        	var _commBtnsObj = JSON.parse(_commBtnsStr);
        	
        	if(_commBtnsObj.detail == 'true' || _commBtnsObj.detail == 'dblclick'){
        		toolbar_detail = _commBtnsObj.detail;
        	}else if(_commBtnsObj.detail == 'dblclick'){
        		toolbar_dblclick = _commBtnsObj.dblclick;
        	}
        	if(_commBtnsObj.exup == 'true'){toolbar_exup = _commBtnsObj.exup;}
        	if(_commBtnsObj.exdn == 'true'){toolbar_exdn = _commBtnsObj.exdn;}
        	if(_commBtnsObj.addrow == 'true'){toolbar_addrow = _commBtnsObj.addrow;}
        	if(_commBtnsObj.delrow == 'true'){toolbar_delrow = _commBtnsObj.delrow;}
        	if(_commBtnsObj.full == 'true'){toolbar_full = _commBtnsObj.full;}
        	if(_commBtnsObj.dblclick == 'true'){toolbar_dblclick = _commBtnsObj.dblclick;}
        	
    	}
    	
    	if(mocaConfig.grid.toolbar_common_btns_mobile){
        	if(mocaConfig.grid.toolbar_common_btns_mobile.priority == 'config'){
            	var _commBtnsStr = mocaConfig.grid.toolbar_common_btns_mobile.attr;
            	var _commBtnsObj = JSON.parse(_commBtnsStr);      		
            	if(_commBtnsObj.detail) toolbar_detail = _commBtnsObj.detail;
            	if(_commBtnsObj.exup) toolbar_exup = _commBtnsObj.exup;
            	if(_commBtnsObj.exdn) toolbar_exdn = _commBtnsObj.exdn;
            	if(_commBtnsObj.addrow) toolbar_addrow = _commBtnsObj.addrow;
            	if(_commBtnsObj.delrow) toolbar_delrow = _commBtnsObj.delrow;
            	if(_commBtnsObj.full) toolbar_full = _commBtnsObj.full;
            	if(_commBtnsObj.dblclick) toolbar_dblclick = _commBtnsObj.dblclick;
        	}
    	}
    }

    var paging = (_divObj.getAttribute('paging') != null)? JSON.parse(_divObj.getAttribute('paging')):{};
    var _html = '';
    if(_toolbar){
        _html += '<div class="moca_grid_toolbar" grdkey="'+_id+'" default_cell_height="'+_default_cell_height+'" >';
        _html += '<div class="lta" grdkey="'+_id+'">';
        if(_label != null){
            _html += '<div class="grid_title" grdkey="'+_id+'">';               
            _html += _label;                            
            _html += '</div>';
        } 
        if(_subLabel != null){
            _html += '<div class="moca_table_title" grdkey="'+_id+'">';             
            _html += '<i class="fas fa-angle-right"></i>'+'<span>'+_subLabel+'</span>';                         
            _html += '</div>';
        } 
        _html += '<div class="mr5 grid_total" grdkey="'+_id+'">';
        if(paging.type == 'numberList'){
        	 _html += '<span>총<em class="txt_blue ml2"></em>건</span>';
        }else{
        	if(_label != null || _subLabel != null){
                _html += '<span><em class="txt_blue"></em>건</span>';
            }else{
                _html += '<span>Fetch : <em class="txt_blue"></em>건</span>';            
            }
        }
        
        _html += '</div>';
        var attArray = _divObj.getAttributeNames();
        for(var k=0; k <attArray.length; k++){
            var attrName = attArray[k];
            var attValue = _divObj.getAttribute(attrName);
            if($.trim(attValue) != null && $.trim(attValue) != '') {
                try{
                    var x1Obj = JSON.parse(attValue);
                    if(x1Obj.position == 'left'){
                        if(attrName.indexOf('toolbar_grid_checkbox') > -1){
                            _html += $m.renderGridToolbarCheckbox(x1Obj);
                        }else if(attrName.indexOf('toolbar_grid_input') > -1){
                            _html += $m.renderGridToolbarInput(x1Obj);
                        }else if(attrName.indexOf('toolbar_grid_button') > -1){
                            _html += $m.renderGridToolbarButton(x1Obj,_divObj.id);
                        }else if(attrName.indexOf('toolbar_grid_label_span') > -1){
                            _html += $m.renderGridToolbarLabelSpan(x1Obj);
                        }else if(attrName.indexOf('toolbar_grid_label_input') > -1){
                            _html += $m.renderGridToolbarLabelInput(x1Obj);
                        }else if(attrName.indexOf('toolbar_grid_label_combo') > -1){
                            _html += $m.renderGridToolbarLabelCombo(x1Obj,_divObj.id);
                        }else if(attrName.indexOf('toolbar_grid_combo') > -1){
                            _html += $m.renderGridToolbarCombo(x1Obj,_divObj.id);
                        }else if(attrName.indexOf('toolbar_grid_label') > -1){
                            _html += $m.renderGridToolbarLabel(x1Obj);
                        }else if(attrName.indexOf('toolbar_grid_radio') > -1){
                            _html += $m.renderGridToolbarRadio(x1Obj);
                        }
                        
                        
                        
                    }
                }catch(e){
                    
                }
            }
        }
        
        if(toolbar_search_size == "true") {
            _html += '<div class="moca_combo" style="width:60px" grdkey="'+_id+'">';
            _html += '<select class="moca_select" id="_grid_count_per_page">';
            _html += '<option value="800" selected>800건</option>';  
            _html += '<option value="20">20건</option>';     
            _html += '<option value="50">50건</option>';
            _html += '<option value="100">100건</option>';
            _html += '<option value="400">400건</option>';
            _html += '</select>';
            _html += '</div>';
        }


        _html += '</div>';
        _html += '<div class="rta" grdkey="'+_id+'">';

        if(toolbar_col_showhide == "true") _html += '<button type="button" id="'+_id+'_col_showhide" class="button col_showhide" title="컬럼숨기기" grdkey="'+_id+'" onclick="$m._col_showhide(this)"></button>';
        
        if(toolbar_detail == "true") _html += '<button type="button" id="'+_id+'_btn_detail" class="button grid_detail" title="디테일뷰" grdkey="'+_id+'" onclick="$m._detailview(this)"></button>';
        else if(toolbar_detail == "dblclick") _html += '<button type="button" id="'+_id+'_btn_detail" class="button grid_detail" title="디테일뷰" grdkey="'+_id+'" onclick="'+_onDblClickFunc+'(this)"></button>';
        
        if(toolbar_exup == "true") _html += '<button type="button" id="'+_id+'_btn_exup" class="button excel_up" title="엑셀업로드" grdkey="'+_id+'" onclick="$m._excel_up(this)"></button>';
        if(toolbar_exdn == "true") _html += '<button type="button" id="'+_id+'_btn_exdn" class="button excel_dn" title="엑셀다운로드" grdkey="'+_id+'" onclick="$m._excel_down(this)"></button>';
        if(toolbar_addrow == "true") _html += '<button type="button" id="'+_id+'_btn_addrow" class="button add_row" title="행추가" grdkey="'+_id+'" onclick="$m._row_add(this)"></button>';
        if(toolbar_delrow == "true") _html += '<button type="button" id="'+_id+'_btn_delrow" class="button del_row" title="행삭제" grdkey="'+_id+'" onclick="$m._row_del(this)"></button>';
        if(toolbar_nextbtn == "true") _html += '<button type="button" id="'+_id+'_btn_nextbtn" class="button read_next" title="다음" grdkey="'+_id+'" onclick="$m._next(this)"></button>';
        if(toolbar_full == "true") _html += '<button type="button" id="'+_id+'_btn_full" class="button grid_full" title="그리드 전체화면"  grdkey="'+_id+'" onclick="$m._fullScreenGrid(this)"></button>';
        if(toolbar_dblclick == "true") _html += '<button type="button" id="'+_id+'_btn_dblclick" class="button grid_dblclick" title="그리드 더블클릭"  grdkey="'+_id+'" onclick="'+_onDblClickFunc+'(this)"></button>';
        if(toolbar_fold == "true") _html += '<button type="button" id="'+_id+'_btn_fold" class="button grid_fold" title="그리드 접기"  grdkey="'+_id+'" onclick="$m._foldGrid(this)"></button>';
        
        for(var k=0; k <attArray.length; k++){
            var attrName = attArray[k];
            var attValue = _divObj.getAttribute(attrName);
            if($.trim(attValue) != null && $.trim(attValue) != '') {
                try{
                    var x1Obj = JSON.parse(attValue);
                    if(x1Obj.position == 'right'){
                        if(attrName.indexOf('toolbar_grid_checkbox') > -1){
                            _html += $m.renderGridToolbarCheckbox(x1Obj);
                        }else if(attrName.indexOf('toolbar_grid_input') > -1){
                            _html += $m.renderGridToolbarInput(x1Obj);
                        }else if(attrName.indexOf('toolbar_grid_button') > -1){
                            _html += $m.renderGridToolbarButton(x1Obj,_divObj.id);
                        }else if(attrName.indexOf('toolbar_grid_label_span') > -1){
                            _html += $m.renderGridToolbarLabelSpan(x1Obj);
                        }else if(attrName.indexOf('toolbar_grid_label_input') > -1){
                            _html += $m.renderGridToolbarLabelInput(x1Obj);
                        }else if(attrName.indexOf('toolbar_grid_label_combo') > -1){
                            _html += $m.renderGridToolbarLabelCombo(x1Obj,_divObj.id);
                        }else if(attrName.indexOf('toolbar_grid_combo') > -1){
                            _html += $m.renderGridToolbarCombo(x1Obj,_divObj.id);
                        }else if(attrName.indexOf('toolbar_grid_label') > -1){
                            _html += $m.renderGridToolbarLabel(x1Obj);
                        }else if(attrName.indexOf('toolbar_grid_radio') > -1){
                            _html += $m.renderGridToolbarRadio(x1Obj);
                        }
                    }
                }catch(e){
                    
                }

            }
        }
        
        
        
        _html += '</div>';
        _html += '</div>';

        

    }
    
    var __onclick = '';
    var __ondblclick = '';
    var __swipeStyle = '';
    if($m.getDevice() != 'pc'){
    	__onclick = 'onclick="$m.swaipClickScroll(this)"';
    	__ondblclick = 'ondblclick="$m.swaipDblScroll(this)"';
    	__swipeStyle = 'width: 100%; left: 0px;';
    }    
    
    _html += '<div class="moca_grid_list fauto" default_cell_height="'+_default_cell_height+'" grdkey="'+_id+'">';
        _html += '<div class="moca_grid_body" style="right:18px;">';
        _html += _header_body;
        _html += '</div>';
        _html += '<div id="'+_id+'_moca_scroll_y" componentid="'+_id+'" class="moca_scrollY_type1" '+__onclick+' '+__ondblclick+' onscroll="$m.sFunction(this);" style="'+__swipeStyle+'">';
        _html += '<div id="'+_id+'_grid_height" style="height: 0px; position: absolute; top: 0px; left: 0px; width: 18px;"></div>';
        _html += '</div>';
        _html += '<div id="lin_dashed" style="position:absolute; top:0px; bottom:0px; border-left:1px dashed #000; z-index:100; height:100%; left:340px;display:none"></div>';
    _html += '</div>';
    
    
    if(paging.type == 'numberList'){
        _html += '<div class="moca_grid_paging" id="grid_paging">';
        _html += '<button type="button" class="first" onclick="$m.pagingFirst(this)"><span>첫 페이지로 이동</span></button>';
        _html += '<button type="button" class="prev" onclick="$m.pagingPrev(this)"><span>이전페이지로 이동</span></button>';
        _html += '<span class="num" id="numGrp">';
        _html += '</span>';
        _html += '<button type="button" class="next" onclick="$m.pagingNext(this)"><span>다음페이지로 이동</span></button>';
        _html += '<button type="button" class="last" onclick="$m.pagingLast(this)"><span>마지막 페이지로 이동</span></button>';
        _html += '</div>';
    }
    
    _html +='   <div class="gridDetail_body" style="display:none" grdkey="'+_id+'"> ';
    _html +='       <div class="moca_grid_toolbar_detail"> ';
    _html +='           <div class="rta"> ';
    _html +='               <button type="button" id="btn_colTh1" class="button colTh1" style="" title="그리드th1단"  onclick="$m._detailView1(this)"></button> ';
    _html +='               <button type="button" id="btn_colTh2" class="button colTh2" style="" title="그리드th2단"  onclick="$m._detailView2(this)"></button> ';
    if($m.getDevice() != "mobile"){
    	_html +='           <button type="button" id="btn_colTh3" class="button colTh3" style="" title="그리드th3단"  onclick="$m._detailView3(this)"></button>'; 
    }
    _html +='               <button type="button" id="" class="button grid_detail_close" style="" title="" onclick="$m._detailViewClose(this)"></button>';
    _html +='           </div> ';   
    _html +='       </div> ';
    _html +='       <table class="gridDetail mb5" id="gridDetail1"> ';
    _html +='           <tr> ';
    _html +='               <th>제목'+_id+'</th> ';
    _html +='               <td><div contenteditable="true" placeholder=""></div></td> ';
    _html +='           </tr> ';

    _html +='       </table> ';
    _html +='       <table class="gridDetail mb5" id="gridDetail2" > ';
    _html +='           <tr> ';
    _html +='               <th>제목1</th> ';
    _html +='               <td><div contenteditable="true" placeholder=""></div></td> ';
    _html +='               <th>제목2</th> ';
    _html +='               <td><div contenteditable="true" placeholder=""></div></td> ';
    _html +='           </tr> ';
    _html +='           <tr> ';
    _html +='               <th>제목3</th> ';
    _html +='               <td><div contenteditable="true" placeholder=""></div></td> ';
    _html +='               <th>제목4</th> ';
    _html +='               <td><div contenteditable="true" placeholder=""></div></td> ';
    _html +='           </tr> ';        
    _html +='           <tr> ';
    _html +='               <th>제목5</th> ';
    _html +='               <td><div contenteditable="true" placeholder=""></div></td> ';
    _html +='               <th>제목6</th> ';
    _html +='               <td><div contenteditable="true" placeholder=""></div></td> ';
    _html +='           </tr> ';        
    _html +='       </table> ';
    _html +='       <table class="gridDetail mb5" id="gridDetail3"> ';
    _html +='           <tr> ';
    _html +='               <th>제목1</th> ';
    _html +='               <td><div contenteditable="true" placeholder=""></div></td> ';
    _html +='               <th>제목2</th> ';
    _html +='               <td><div contenteditable="true" placeholder=""></div></td> ';
    _html +='               <th>제목3</th> ';
    _html +='               <td><div contenteditable="true" placeholder=""></div></td> ';
    _html +='           </tr> ';
    _html +='           <tr> ';
    _html +='               <th>제목4</th> ';
    _html +='               <td><div contenteditable="true" placeholder=""></div></td> ';
    _html +='               <th>제목5</th> ';
    _html +='               <td><div contenteditable="true" placeholder=""></div></td> ';
    _html +='               <th>제목6</th> ';
    _html +='               <td><div contenteditable="true" placeholder=""></div></td> ';
    _html +='           </tr> ';
    _html +='       </table> ';
    _html +='   </div> ';
    
    
    
    
    _html +='   <div id="col_showhide" class="PopColgroup p5" style="display:none" onclick="$m.preven(this)">';
    _html +='       <div class="groupListHeader">';
    _html +='           <div class="fr">';
    _html +='               <button type="button" class="button btn_save"  onclick="$m._col_showhideApply(this)"><span>적용</span></button>';
    _html +='               <button type="button" class="button btn_close" style="" title="" onclick="$m._col_showhideClose(this)"></button>';
    _html +='           </div>';
    _html +='       </div>';    
    _html +='       <div class="ly_column col_2">';
    _html +='           <div class="ly_col_cont">';
    _html +='               <table class="groupListSet">';
    _html +='                   <colgroup>';
    _html +='                   <col>';
    _html +='                   <col style="width:37px">';
    _html +='                   </colgroup>';
    _html +='                   <tr>';
    _html +='                       <td><div class="moca_ibn"><input type="text" class="moca_input" style="" id="grpNm_'+_id+'" placeholder="그룹명을 입력해주세요"><input type="color" class="moca_input_color"></div></td>';
    _html +='                       <td><button type="button" class="button btn_plus" onclick="$m.createColGroup(this)"><i class="fas fa-plus"></i></button></td>';
    _html +='                   </tr>';
    _html +='               </table>';
    _html +='               <table class="groupList mb5">';
    _html +='               </table>';
    _html +='           </div>';
    _html +='       </div>';
    _html +='       <div class="ly_column col_8">';
    _html +='           <div class="ly_col_cont">';
    _html +='               <div class="ly_col_cont">';
    _html +='                   <h3 class="txt_red p10">*그룹으로 묶을 컬럼을 선택해주세요</h3>';
    _html +='                   <ul class="groupColList pl10">';
    _html +='                   </ul>';
    _html +='               </div>';
    _html +='           </div>';
    _html +='       </div>';
    _html +='   </div>';

    _html = $m.addPageId(_html,pageid,srcid);
    _divObj.innerHTML = _html;
    _divObj.onRowSelectedFunction = function(){
        var tdObj;
        if(event.srcElement.tagName == 'TD'){
            tdObj = event.srcElement;
        }else if(event.srcElement.parentElement != null && event.srcElement.parentElement.parentElement != null && event.srcElement.parentElement.parentElement.tagName == 'TD'){
            tdObj = event.srcElement.parentElement.parentElement;   
        }else if(event.srcElement.parentElement != null && event.srcElement.parentElement.tagName == 'TD'){
            tdObj = event.srcElement.parentElement; 
        }
        //event.srcElement.parentElement.parentElement 트리일 경우.
        if(tdObj != null && tdObj.tagName == 'TD'){
            $m._setSelectRowIndex(tdObj);
            $m._setRowSelection(this,tdObj);
            
            var onRowSelectedFunc = _divObj.getAttribute("onRowSelected");
            if(onRowSelectedFunc != undefined){
                var _realIndex = _divObj.getAttribute("selectedRealRowIndex");
                $m.pageId = this.getAttribute("pageId");
                $m.srcId =  this.getAttribute("srcId");
                eval(onRowSelectedFunc)(_divObj,_realIndex,tdObj,this);
            }
        }
        
    };
    
    $(_divObj).bind('click',_divObj.onRowSelectedFunction);
    
    var _cellMap = {};
    var _cellIndex = {};
    var colArray = $(_divObj).find('colgroup:first col');
    var _cellArr = $(_divObj).find('tbody:first td');
    var thArray = $(_divObj).find('thead:first th[id]');
    var _thMap = {};
    for(var i=0; i < thArray.length; i++){
        var thObj = thArray[i];
        _thMap[thObj.id] = thObj;
    }
    

    for(var i=0; i < colArray.length; i++){
        var aCol = colArray[i];
        if($m.getDevice() == "pc"){
        	$m.moblePcHide(aCol,"hide");
        }else{
        	$m.moblePcHide(aCol,"mobileHide");
        }
        
        var aTh = _thMap[aCol.getAttribute("thid")];
        if(aTh == null){
            aTh = thArray[i];
        }
        var aTd = _cellArr[i];
        _cellMap[aTd.id] = aTd;
        _cellIndex[aTd.id] = i;
        var required = aTd.getAttribute("required");
        var celltype = aTd.getAttribute("celltype");
        if(celltype == 'tree'){
            _divObj.setAttribute("usetree","true");
            _divObj.setAttribute("treetdid",aTd.id);
        }
        if(required == 'true'){
            $(aTh).addClass('req');
        }
        if(aTh != null){
            var before = aTh.innerHTML;
            var _after = '';
            var thCelltype = aTh.getAttribute("celltype");
            if(thCelltype == 'checkbox'){
                $(aTh).off("click").on("click",$m.cellAllCheck);
                _after = '<div class="moca_checkbox_grid" >';
                _after += '<input type="checkbox" class="moca_checkbox_input allcheck" name="cbxAll" id="cbx_'+$m.pageId+'_'+$m.srcId+'_'+_id+'" grd_id='+_id+'>';
                _after += '<label class="moca_checkbox_label" for="cbx_'+$m.pageId+'_'+$m.srcId+'_'+_id+'"  >label</label>';
                _after += '</div>';
            }else{
                _after += '<div class="moca_grid_sort_box">';
                _after += '<span>'+before+'</span>';
            }
            
            var sortable = aTh.getAttribute("sortable");
            if(sortable == "true"){
                _after += '<button class="moca_grid_sort_btn sort_none"  onclick="$m.doSort(this)">정렬취소</button>';
            }
            
            var filterable = aTh.getAttribute("filterable");
            if(filterable == "true"){
                _after += '<button class="moca_grid_filter_btn" onclick="$m.doFilter(this)" ondblclick="$m.doFilterDblclick(this)">필터</button><i onclick="$m.filterRemoveAllConfirm(this);"></i>';
            }   
            
            //sort_none , sort_asc , sort_desc
            aTh.innerHTML = _after;
            aTh.innerHTML = aTh.innerHTML+'<div class="groupbar"></div>';
        }

        
        
    }
    _divObj.cellInfo = _cellMap;
    _divObj.cellArr = _cellArr;
    _divObj.cellIndex = _cellIndex;
    $m._col_showhideExe(_divObj);
    _divObj.list = [];
    $(_divObj).find('tbody:first').html('');
    
    $(_divObj).find('thead:first>tr').bind('mousedown',function(e){
        /*
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        */
        $m.grid_colDown(this);
        return false;       
    });
    
    $(_divObj).find('thead:first th[id]').bind('dblclick',$m.doSort); 

    var _default_cell_height =  this.getCellHeight(_divObj);
    var headerCellCnt = $(_divObj).find('thead').children().length;
    var viewRowsMaxCnt = ($(_divObj).find('.moca_grid_body').height()-$(_divObj).find('thead').height()) /_default_cell_height;
    _divObj.viewRowsMaxCnt = Math.round(viewRowsMaxCnt);
};


Moca.prototype.moblePcHide = function(aCol,_mobleOrPc){
    if($(aCol).attr(_mobleOrPc) == "true"){
    	var ori_width = $(aCol).width();
    	if(ori_width == null){
    		$(aCol).attr("oriWidth",ori_width);
    	}
    	//$(aCol).css("width","0");
    	//$(aCol).attr("width","0");
    	
    	var mWidth = $(aCol).css("min-width");
    	if(mWidth != null && mWidth != "0"){
    		$(aCol).css("min-width","0");
    		$(aCol).attr("oriMinWidth",mWidth);
    	}

    	var columnKey = $(aCol).attr("columnKey");
    	var thKey = $(aCol).attr("thKey");
    	var ths = $(aCol).closest("table").find("th[id="+thKey+"]");
    	ths.css('display','none');
    	var tds = $(aCol).closest("table").find("td[id="+columnKey+"]");
    	tds.css('display','none');
    	$(aCol).css('display','none');
        
    }else{
    	var ori_width = $(aCol).width();
    	var mWidth = $(aCol).css("min-width");
    	mWidth = (mWidth != null) ?mWidth.replace('px',''):mWidth;
    	
    	if(mWidth != null && mWidth == "0"){
    		var oriMinWidth = $(aCol).attr("oriMinWidth");
    		$(aCol).css("min-width",oriMinWidth);
    	};
    	
		if(mWidth == null && ori_width != null){
    		$(aCol).css("width",ori_width);
    	}
    	var columnKey = $(aCol).attr("columnKey");
    	var thKey = $(aCol).attr("thKey");
    	var ths = $(aCol).closest("table").find("th[id="+thKey+"]");
    	//ths.css('display','table-column');
    	ths.css('display','table-cell');
    	
    	
    	
    	var tds = $(aCol).closest("table").find("td[id="+columnKey+"]");
    	//tds.css('display','table-column');
        tds.css('display','table-cell');
       
        
        
    }
    
};


Moca.prototype.doSort = function(thisObj) {
    var p;
    var o;
    var h;
    if(thisObj != null && thisObj.type != 'dblclick'){
        p = thisObj;
        o = $(thisObj);
        h = $(thisObj).closest('th')[0];
    }else{
        p = this;
        o = $(p).find('.moca_grid_sort_btn');
        h = p;
    }
    var grdo = $m.getTypeObj(p)[0];
    $m.stopEvent(event);
    var _divObj = grdo;
    
    var colArray = $(_divObj).find('colgroup:first col');
    
    var thArray = $(_divObj).find('thead th[id]');
    var _thMap = {};
    for(var i=0; i < thArray.length; i++){
        var thObj = thArray[i];
        _thMap[thObj.id] = thObj;
    }
    var _idx = 0;
    for(var i=0; i < colArray.length; i++){
        var aCol = colArray[i];
        var aTh = _thMap[aCol.getAttribute("thid")];
        if(aTh == null){
            aTh = thArray[i];
        }
        var _id = aTh.id;
        if(_id == h.id){
            _idx = i;
            break;
        }
    }
    
    var ks = Object.keys(_divObj.cellInfo);
    var colid = ks[_idx];
    
    
    var dataArray = grdo.list;
    
    var returnArray;
    if(o.hasClass('sort_none')){
        //원본에서 sort시작시점! 서 원본상태를 clone을 떠둠!
        //grdo.sort_ori_list = dataArray.clone();
        grdo.sort_ori_list = dataArray;
    }

    if(o.hasClass('sort_none')){
        //오름차순 다 나 가
        returnArray = $m.arrayOrderFnc(dataArray,[colid], ["asc"]);
        grdo.list = returnArray;
        
        $m.drawGrid_inside(grdo, returnArray);
        o.removeClass("sort_none");
        o.addClass("sort_asc");                 
    }else if(o.hasClass('sort_asc')){
        //내림차순 가 나 다
        returnArray = $m.arrayOrderFnc(dataArray,[colid], ["desc"]);
        grdo.list = returnArray;
        $m.drawGrid_inside(grdo, returnArray);
        o.removeClass("sort_asc");
        o.addClass("sort_desc");
    }else if(o.hasClass('sort_desc')){
        //원래대로
        returnArray = grdo.sort_ori_list;
        grdo.list = returnArray;
        $m.drawGrid_inside(grdo, returnArray);    
        o.removeClass("sort_desc");
        o.addClass("sort_none");                    
    }
    $m.redrawGrid(grdo);//스크롤포시션 유지되면서 sort됨
    return false;       
};

Moca.prototype.init = function(_tabId,_srcId,_url,_json_data,_callback) {
    [''];
    
    if(_tabId != null){
        var _tabObj;
        
        if(_tabId.startsWith("POP_")){
            _tabObj = $("div[tab_id="+_tabId+"]");
        }else if(_tabId.startsWith("MDI_")){
            _tabObj = $("div[tab_id="+_tabId+"]");
        }else if(_tabId.startsWith("TAB_")){
            _tabObj = $("div[tab_id="+_tabId+"]");
        }else{
            _tabObj = $("div[id="+_tabId+"]");
            $m.srcId = _srcId;
        }
        
        
        var arr = _tabObj.find('[type=include]');
        var param;
        for(var i=0; i < arr.length; i++){
            var aTag = arr[i];
            $m.renderinclude(aTag);
        };
        

        var arr = _tabObj.find('[type=tab][pageid='+_tabObj.attr('tab_id')+']');
        for(var i=0; i < arr.length; i++){
            var aTag = arr[i];
            
            $m.renderTab(aTag);
        };
        
        var arr = _tabObj.find('div[type=form][pageid='+_tabObj.attr('tab_id')+']');
        for(var i=0; i < arr.length; i++){
            var aTag = arr[i];
            $m.renderForm(aTag);
        };  
        
        
        var arr = _tabObj.find('div[type=inputCalendar][pageid='+_tabObj.attr('tab_id')+']');
        for(var i=0; i < arr.length; i++){
            var aTag = arr[i];
            $m.renderInputCalendar(aTag);
        };
        
        var arr = _tabObj.find('div[type=inputMultiCalendar][pageid='+_tabObj.attr('tab_id')+']');
        for(var i=0; i < arr.length; i++){
            var aTag = arr[i];
            $m.renderInputMultiCalendar(aTag,_srcId);
        };
        
        var arr = _tabObj.find('div[type=combo][pageid='+_tabObj.attr('tab_id')+']');
        for(var i=0; i < arr.length; i++){
            var aTag = arr[i];
            $m.renderCombo(aTag);
        };  
        var arr = _tabObj.find('div[type=searchCombo][pageid='+_tabObj.attr('tab_id')+']');
        for(var i=0; i < arr.length; i++){
            var aTag = arr[i];
            $m.renderSearchCombo(aTag);
        };  
        
        
        
        var arr = _tabObj.find('div[type=grid][pageid='+_tabObj.attr('tab_id')+']');
        if(arr.length > 0){
            
        }

        for(var i=0; i < arr.length; i++){
            var aTag = arr[i];
            $m.renderGrid(aTag);
        };  
        
        var arr = _tabObj.find('div[type=checkbox][pageid='+_tabObj.attr('tab_id')+']');
        for(var i=0; i < arr.length; i++){
            var aTag = arr[i];
            $m.renderCheckbox(aTag);
        };  
        var arr = _tabObj.find('div[type=checkboxGroup][pageid='+_tabObj.attr('tab_id')+']');
        for(var i=0; i < arr.length; i++){
            var aTag = arr[i];
            $m.renderCheckboxGroup(aTag);
        };  

        var arr = _tabObj.find('div[type=table][pageid='+_tabObj.attr('tab_id')+']');
        for(var i=0; i < arr.length; i++){
            var aTag = arr[i];
            $m.renderTable(aTag);
        };  


        
        var arr = _tabObj.find('div[type=radio][pageid='+_tabObj.attr('tab_id')+']');
        for(var i=0; i < arr.length; i++){
            var aTag = arr[i];
            $m.renderRadio(aTag);
        };
        
        var arr = _tabObj.find('div[type=input][pageid='+_tabObj.attr('tab_id')+']');
        for(var i=0; i < arr.length; i++){
            var aTag = arr[i];
            $m.renderMocaInput(aTag);
        };  
        
        var arr = _tabObj.find('div[type=inputButton][pageid='+_tabObj.attr('tab_id')+']');
        for(var i=0; i < arr.length; i++){
            var aTag = arr[i];
            $m.renderMocaInputButton(aTag);
        };  
            
        var arr = _tabObj.find('div[type=button][pageid='+_tabObj.attr('tab_id')+']');
        for(var i=0; i < arr.length; i++){
            var aTag = arr[i];
            $m.renderMocaButton(aTag);
        };  
                
        var arr = _tabObj.find('div[mobileHide=true][pageid='+_tabObj.attr('tab_id')+']');
        for(var i=0; i < arr.length; i++){
            var aTag = arr[i];
            $m.renderMocaDiv(aTag);
        };    
        
    }

    if(_callback != null){
        setTimeout(_callback(_tabId,_srcId,_url),1);
    }
    
};


Moca.prototype.exe = function(_sObj,thisObj) {
    var loadingId;
     if(_sObj.loadingbar != false){
         var loadingInfo = _sObj.loadingInfo;
         if(_sObj.loadingbarScope == 'wrap'){
             loadingId = $m.loading(null,null,thisObj,loadingInfo);
         }else{
             loadingId = $m.loading(null,null,thisObj,loadingInfo);
         }
     }
     var _dataType = 'JSON';
     if(_sObj.dataType != null || $m.trim(_sObj.dataType) != ""){
         _dataType = _sObj.dataType;
     }
     var _type = 'POST';
     if(_sObj.type != null || $m.trim(_sObj.type) != ""){
         _type = _sObj.type;
     }
     
     _sObj.data.header.TRANID = "TRAN_"+$m.now()+$m.shuffleRandom(6);
     var _data = {};
     if(_sObj.data != null){
         _data = {header:JSON.stringify(_sObj.data.header),body:JSON.stringify(_sObj.data.body)};
     }
     
     var _thisSrcId;
     var _thisPageId;
     if(_sObj.pageId != null){
         _thisSrcId = _sObj.srcId;
         _thisPageId = _sObj.pageId;
     }else if(thisObj != null){
         _thisSrcId = thisObj.srcId;
         _thisPageId = thisObj.pageId;
         _sObj.srcId =  thisObj.srcId;
         _sObj.pageId =  thisObj.pageId;
     }else{
         _thisSrcId = this.srcId;
         _thisPageId = this.pageId;
         _sObj.srcId =  this.srcId;
         _sObj.pageId =  this.pageId;
     }
     if(_sObj.showStatus != false){
         $m.writeMessage({srcId:_sObj.srcId,pageId:_sObj.pageId,message:"진행중",url:_sObj.url });
     }
     
     
     if(_sObj.abort != false){
         if($m.processMap[_sObj.url] != null){
             $m.processMap[_sObj.url].abort();
         }
     }

     
     var process = $.ajax({
           type:_type,
           url:_sObj.url,
           dataType:_dataType,
           data:_data,
           success : function(result) {
               if(result.allow != null && result.allow != 'true'){
                   mocaConfig.callback_alowLeaveMember();
                   return;
               }
               if(_sObj.showStatus != false){
                   $m.writeMessage({srcId:_sObj.srcId,pageId:_sObj.pageId,message:"완료",url:_sObj.url});
               }
               
               if(typeof result == 'object'){
                   if(result["map"] != null && result["map"]["ERROR"] == "NOLOGIN"){
                       alert("SESSION EXPIRED! MOVE TO LOGINPAGE!");
                       top.location.href = $m._contextRoot+'/uat/uia/egovLoginUsr.do';
                       return;
                   }else if(result["map"] != null && result["map"]["ERROR"] == 'NOAUTH'){
                       alert("권한이 없습니다!");
                       return;
                   }
               }
               if(typeof result == 'string'){
                   var resultJson;
                   resultJson = JSON.parse(result);
                   if(resultJson.message == "NO_SESSION"){
                       top.location.href = $m._contextRoot+'/uat/uia/egovLoginUsr.do';
                       return;
                   }
               }
               if(_sObj.loadingbar != false){
               $m.loading(loadingId,0,thisObj);
               }
               if(_sObj.callback){
                   setTimeout(_sObj.callback(result),100);
               }
           }, 
           complete : function(data) {
           },
           error : function(xhr, status, error) {
               console.log(xhr, status, error);
               $('._modal').hide();
               $('._modal').remove();
               
               if(loadingId != null){
                   $m.loading(loadingId,0,thisObj);
               }
           }
     });
     $m.processMap[_sObj.url] = process;
};


Moca.prototype.listToMap = function(_list,_option,filterableId) {
    var re = {};
    if(_option != null){
        var _code = '';
        var _name = '';
        if(_option.metaInfo != null){
            _code = _option.metaInfo.codeCd;
            _name = _option.metaInfo.codeNm;
        }
        for(var i=0,j=_list.length; i < j; i++){
            var row = _list[i];
            if(_code == ''){
                re[row.code] = row.codeNm;
            }else{
                re[row[_code]] = row[_name];
            }
        }
    }else{
        for(var i=0,j=_list.length; i < j; i++){
            var row = _list[i];
            var value = row[filterableId];
            re[value] = value;
        }
    }

    return re;
};


Moca.prototype.code = function(_config,_callback,_url,_pageId,_srcId) {
    ['common code binder'];
    var u;
    if(_url != null){
        u = _url;
    }else{
        u = this._domain+this._contextRoot+"/code_json.do";
    }
    var exeObj = $m;
    if(_pageId != null){
        exeObj = $m[_srcId];
    }
    exeObj.exe({
        url : u,
        async: false,
        loadingbar:false,
        data : {
            "header" : $m.header,
            "body" : {"config":_config}
        },          
        callback : function(_response){
            var response = $m.getRes(_response).map;
            var ks = Object.keys(_config);
            for(var i=0; i < ks.length; i++){
                var compId = ks[i];
                if(!compId.startsWith("data___")){
                    var v = _config[compId];
                    var l = response[compId];
                    var cid = compId;
                    var gridAndCellArr = cid.split('.');
                    if(gridAndCellArr.length == 1){
                        //일반
                        var compId = gridAndCellArr[0];
                        var compObj = $m.getObj(compId,null,_pageId,_srcId);
                        if(compObj != null ){//&& compObj['list'] == null
                            compObj['list'] = l;
                            compObj['codeOpt'] = v;
                            if(compObj.getAttribute("type") == "searchCombo"){
                                $m.renderSearchCombo(compObj,null,'normal',_pageId,_srcId);
                            }else if(compObj.getAttribute("type") == "combo"){
                                $m.renderCombo(compObj,null,'normal',_pageId,_srcId);
                            }
                        }                   
                    }else{
                        //그리드
                        var gridId = gridAndCellArr[0];
                        var cellId = gridAndCellArr[1];
                        var g_obj = $m.getObj(gridId,null,_pageId,_srcId);
                        if(g_obj[cellId] == null){
                            g_obj[cellId] = {};
                        } 
                        g_obj[cellId]['list'] = l;
                        g_obj[cellId]['codeOpt'] = v;
                        g_obj[cellId]['map'] = $m.listToMap(l,v);
                    }
                }else{
                    
                    
                }
            }
            if(_callback != null){
                _callback(response);
            }
        }
    });
};


//http://localhost:9090/to/moca/web/viewer.html?file=/to/TO_73__complete.pdf
Moca.prototype.openPdfViewer = function(_opt){
    var params = _opt.param;
    var paramArray = Object.keys(params);
    var re_params = '';
    for(var i=0; i < paramArray.length; i++){
        var key = paramArray[i];
        var val = params[key];
        re_params = re_params + key+'='+$m.encode(val);
        if(i != paramArray.length-1){
            re_params = re_params +"&";
        }else{
            re_params = re_params +"&user_id="+$m.getSession("USER_ID");
        }
    }
    var _srcId = $m._contextRoot+ "/moca/web/viewer.html";
    $m.userLogInsert({URL:_opt.url,SRCID:_opt.id,LABEL:_opt.param.FILE_REAL_NM,MENU_NM:_opt.title});
    var _url = _opt.url+"?__popid="+_opt.id+"&__title="+$m.encode(_opt.title)+"&"+re_params;
    _opt.url = _srcId+"?file="+ encodeURIComponent(_url + "#" + "moca");
    $m.openWindowPopup(_opt);
};


Moca.prototype.popClose = function(_popupId,_json){
    ['모카팝업 닫기'];
    //if(top.name.startsWith("POPUP"))
    if(opener && $('#'+_popupId).attr('id') == parent.name){
    	if(opener.$m.callbacks[_popupId]){
	        eval(opener.$m.callbacks[_popupId])(_json);
	        delete opener.$m.callbacks[_popupId];
	        delete opener.$m.data[_popupId];
	    }
    	opener.$m.popClose(_popupId);
    	self.close();
    }else{
    	if(!$('#'+_popupId).prev().hasClass('moca_popup')){
    		$('body').css('overflow','');
    	}
    	$('#'+_popupId).remove();
    	
    	if($('.moca_tab_list.active').length > 0){
	        var activeObj = $('.moca_tab_list.active')[0];
	        var _tab_id = activeObj.getAttribute("tab_id");//MDI_201901091611497970040306010502
	        var _tab_url = activeObj.getAttribute("tab_url");//MDI_201901091611497970040306010502
	        var _src_id = $m.url_to_srcId(_tab_url);
	        $m.pageId = _tab_id;
	        $m.srcId = _src_id;
	    }else{
	        $m.pageId = $("div[type=grid]").attr("pageid");
	        $m.srcId = $("div[type=grid]").attr("srcid");
	    }
	    if(this.callbacks[_popupId]){
	        eval(this.callbacks[_popupId])(_json);
	        delete this.callbacks[_popupId];
	        delete this.data[_popupId];
	    }
    };
};

Moca.prototype.popRefresh = function(_popupId,_json){
	$m.closeGubun = 'change';
	location.reload();
};
Moca.prototype.popChange = function(_popupId,_json){
    ['모카팝업타입전환'];
    /*
    $('#'+_popupId).remove();
    if($('.moca_tab_list.active').length > 0){
        var activeObj = $('.moca_tab_list.active')[0];
        var _tab_id = activeObj.getAttribute("tab_id");//MDI_201901091611497970040306010502
        var _tab_url = activeObj.getAttribute("tab_url");//MDI_201901091611497970040306010502
        var _src_id = $m.url_to_srcId(_tab_url);
        $m.pageId = _tab_id;
        $m.srcId = _src_id;
    }else{
        $m.pageId = $("div[type=grid]").attr("pageid");
        $m.srcId = $("div[type=grid]").attr("srcid");
    }
    if(this.callbacks[_popupId]){
        eval(this.callbacks[_popupId])(_json);
        delete this.callbacks[_popupId];
        delete this.data[_popupId];
    }*/
    //
    
    if($('#'+_popupId+' > .moca_popup.POP').length > 0){
		$('#'+_popupId,opener.document).show();    
	    $m.closeGubun = 'change';
	    self.close();
	    
    }else{
    	var _pop = $('#'+_popupId+'>div.moca_popup');
	    var _w = _pop.css('width').replace(/px/g,'');
	    var _h = _pop.css('height').replace(/px/g,''); 
	    var _title =_pop[0].option.title;
	    var __srcid = _pop.attr('srcid');
	    
	    var __param = $m[__srcid].args.parent.data;
	    var __url = "/uat/uia/actionMain_link.do?mcsrc="+$('#'+_popupId).attr('src');
	    
	    if(_json != null){
	    	__url = _json.uri+"?mcsrc="+$('#'+_popupId).attr('src');
	    }
	    
	    var _id = $m.openWindowPopup({
	        id: _popupId,
	        method:"post",
	        title: _title,
	        width:Number(_w)+16, 
	        height:Number(_h)+80,
	        url : __url,
	        fullscreen : 'no',
	        param : __param
	    });
    }
};

Moca.prototype.editorPopChange = function(_popupId,_editorId,_json){
	
	var _pop = $('#'+_popupId+'>div.moca_popup');
    var _w = _pop.css('width').replace(/px/g,'');
    var _h = _pop.css('height').replace(/px/g,''); 
    var _title =_pop[0].option.title;
    var __srcid = _pop.attr('srcid');
    
    $m[__srcid].args.parent.data.editorType="readonly";
    $m[__srcid].args.parent.data.editorContents = $m.encode(CKEDITOR.instances[_editorId].getData());
    var __param = $m[__srcid].args.parent.data;
    var __editorUrl = '/moca/comp/COMP_EDIT.html';
    var __url = "/uat/uia/actionMain_link.do?mcsrc="+__editorUrl;
    if(_json != null){
    	__url = _json.uri+"?mcsrc="+__editorUrl;
    }
    
	var _id = $m.openWindowPopup({
        id: _popupId,
        method:"post",
        title: _title,
        width:Number(_w)+16, 
        height:Number(_h)+80,
        url : __url,
        fullscreen : 'no',
        param : __param
    });
}

Moca.prototype.mdiChange = function(_popupId,_json){
    ['모카mdi타입전환'];
    if($('#'+_popupId+'.moca_tab_body').length > 0){
		$('#'+_popupId,opener.document).show();    
	    $m.closeGubun = 'change';
	    self.close();
	    
    }else{
		var _pop = $('#'+_popupId+'_dv.moca_tab_body');
    	var _mdiId =_pop.attr('mdi_id');
    	var _src = _pop.attr('src');
    	var _tab = _pop.parent().find('ul li[tab_id='+_pop.attr('mdi_id')+']');
    	var _title = _tab.attr('tab_label');
	    var _w = '1400';
	    var _h = '600'; 
	    var __srcid = _pop.find('.moca_tab_panel').attr('srcid');
	    var __param = $m[__srcid].args.parent.data;
	    var __url = "/uat/uia/actionMain_link.do?mcsrc="+_src;
	    var _id = $m.openWindowPopup({
	        id: _popupId,
	        method:"post",
	        title: _title,
	        width:Number(_w)+16, 
	        height:Number(_h)+80,
	        url : __url,
	        fullscreen : 'no',
	        param : __param
	    });
    	
    }
    
        
};


Moca.prototype.popUnload = function(){
    ['popUnload'];
	if($m.closeGubun != 'change'){
		$m.popClose(param['__popid'],null);
	}else{
		$m.closeGubun = '';
	}
};

Moca.prototype.mpopClose = function(_thisObj,_messageboxId){
    ['모카팝업 닫기'];
    $('._modal').remove();
    if(this.callbacks[_messageboxId] != null){
        this.callbacks[_messageboxId]();
    }
};

Moca.prototype.getSrcId = function(_thisObj){
	['모카getSrcId'];
	return $(_thisObj).attr('srcid');
};

Moca.prototype.getObj = function(_objId,_tag,_pageId,_srcId){
    ['고유한 obj찾기'];
    var re;
    if(_tag == null){
        if(_pageId != null){
            re = $('div[id='+_objId+']').filter('[pageId="'+_pageId+'"][srcId="'+_srcId+'"]');
        }else if(this.pageId != null){
            re = $('div[id='+_objId+']').filter('[pageId="'+this.pageId+'"][srcId="'+this.srcId+'"]');
        }else if($m.pageId != null){
                re = $('div[id='+_objId+']').filter('[pageId="'+$m.pageId+'"][srcId="'+$m.srcId+'"]');
        }else{
            re = $('div[id='+_objId+']');
        }
    }else{
        if(_pageId != null){
            re = $(_tag+'[id='+_objId+']').filter('[pageId="'+_pageId+'"][srcId="'+_srcId+'"]');
        }else if(this.pageId != null){
            re = $(_tag+'[id='+_objId+']').filter('[pageId="'+this.pageId+'"][srcId="'+this.srcId+'"]');
        }else if($m.pageId != null){
            re = $(_tag+'[id='+_objId+']').filter('[pageId="'+$m.pageId+'"][srcId="'+$m.srcId+'"]');
        }else{
            re = $(_tag+'[id='+_objId+']');
        }       
    }
    
    if(re != null && re.length > 0){
        re[0].getCheckbox = function(_checkboxId) {
            ['grid toolbar내에 있는 checkbox의 정보가져오기'];
            var cObj = $(this).find('#'+_checkboxId)[0];
            if(cObj != null){
                return {id:_checkboxId,checked:cObj.checked,value:cObj.value};
            }else{
                return null;
            }
        };
        re[0].getInput = function(_inputId) {
            ['grid toolbar내에 있는input의 정보가져오기'];
            var cObj = $(this).find('#'+_inputId)[0];
            if(cObj != null){
                return {id:_inputId,value:cObj.value};
            }else{
                return null;
            }
        };
        
        if(re.length > 1){
            alert('중복된 아이디가 있습니다. ID('+_objId+')를 변경해주세요');
        }
        return re[0];
    }else{
        return null;
    }
};



Moca.prototype.addPageId = function(data,_pageId,_srcId){
    ['pageId, scrId추가하기'];
    if(_pageId != null){
        return data.replace(/(<[^<]*?)id\s*?=\s*?(\'|\")(.*?)(\'|\")([^<]*?>)/g,'$1 id="$3" pageId="'+_pageId+'" srcId="'+_srcId+'" $5'); 
    }else{
        return data.replace(/(<[^<]*?)id\s*?=\s*?(\'|\")(.*?)(\'|\")([^<]*?>)/g,'$1 id="$3" pageId="'+$m.pageId+'" srcId="'+$m.srcId+'" $5'); 
    }
    //return data.replace(/id\s*?=\s*?(\'|\")(.*?)(\'|\")/g,'id="$2" pageId="'+$m.pageId+'" srcId="'+$m.srcId+'" '); 
};
Moca.prototype.openSelect = function(_thisObj){
    ['grid cell selectbox동적열기'];
    var grd = _thisObj.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
    var cellTd = _thisObj.parentElement.parentElement;
    var _displayFormat = cellTd.getAttribute("displayFormat");
    var _displayFunction = cellTd.getAttribute("displayFunction");
    
    var colid = _thisObj.parentElement.parentElement.id;
    
    var _tbody = $(_thisObj).parent().parent().parent().parent();
    var _thisTr = $(_thisObj).parent().parent().parent();
    var rowIndex = _tbody.children().index(_thisTr);
    
    var _index = rowIndex;
    var _realIndex = -1;
    var _startIndex = grd.getAttribute("yscrollIdx");
    if(_startIndex > -1){
        _realIndex = rowIndex +parseInt(_startIndex);
    }
    grd.setAttribute("selectedRealRowIndex",_realIndex);
    //grd.setAttribute("selectedRowIndex",rowIndex);
    
    
    var realRowIndex = grd.getAttribute("selectedRealRowIndex");
    //var rowIndex = grd.getAttribute("selectedRowIndex");
    //var rowIndex = $(_thisObj).parent().children().index($(_thisObj));
    var combo_div = _thisObj.parentElement;
    var _html = '';
    _html += $m.getSelectTagForCombo(grd.id); 
    
    var selectList = grd[_thisObj.parentElement.parentElement.id];
    var list = selectList.list;
    var codeOpt = selectList.codeOpt;
    var _metaInfo = codeOpt.metaInfo;
    var _codeCd = $m.codeCd;
    var _codeNm = $m.codeNm;
    if(_metaInfo != null){
        _codeCd = _metaInfo.codeCd;
        _codeNm = _metaInfo.codeNm;
    }
    var thiscd = _thisObj.parentElement.getAttribute("cd");
    
    if(codeOpt.allOption != null){
        var nm = codeOpt.allOption.label;
        var cd = codeOpt.allOption.value;
        var label;
        if(_displayFormat != null && _displayFormat != 'null' && _allOpt != null && _allOpt.value != ''){
            label = _displayFormat.replace('[value]',cd).replace('[label]',nm);
        }else{
            label = nm;
        }
        
        var _selected = "";
        if(thiscd == cd){
            _selected = "selected";
        }       
        _html += '<option value="'+cd+'" '+_selected+'>'+label+'</option>';
    }
    
    for(var i=0; i < list.length; i++){
        var json = list[i];
        
        var label;
        if(_displayFormat != null && _displayFormat != 'null' && json[_codeCd] != ''){
            label = _displayFormat.replace('[value]',json[_codeCd]).replace('[label]',json[_codeNm]);
        }else{
            label = json[_codeNm];
        }
        var _selected = "";
        if(thiscd == json[_codeCd]){
            _selected = "selected";
        }
        _html += '<option value="'+json[_codeCd]+'" '+_selected+'>'+label+'</option>';
    }
    _html += '</select>';
    combo_div.innerHTML = _html;
    $m.setCellData(grd,realRowIndex,colid,combo_div.children[0].value);
    $m._selectFocus(combo_div);
};
Moca.prototype.closeSelect = function(_thisObj){
    ['grid cell selectbox동적닫기'];
    setTimeout(function(){
        try{
            var combo_div = _thisObj.parentElement;
            combo_div.innerHTML = $m.getInputSelectTag(combo_div.getAttribute("label"));
        }catch(e){
            //thisObj가 사라졌을때(input으로 바뀔수있음 예외가 발생
        }
    },200);
};
Moca.prototype.gridCell_selectChange = function(_thisObj){
    ['grid cell selectbox change!'];
    var colid = _thisObj.parentElement.parentElement.id;
    var _tbody = $(_thisObj).parent().parent().parent().parent();
    var grd = _tbody.parent().parent().parent().parent()[0];
    var _thisTr = $(_thisObj).parent().parent().parent();
    var _onSelectChanged = $(grd).attr("onSelectChanged");
    

    var realRowIndex = grd.getAttribute("selectedRealRowIndex");
    //var rowIndex = grd.getAttribute("selectedRowIndex");  
    
    var comboObj = _thisObj.parentElement;
    var beforeCd = comboObj.getAttribute("cd");
    var beforeNm = comboObj.getAttribute("nm"); 
    var label = $(_thisObj).find('option[value=\''+_thisObj.value+'\']').html();
    comboObj.setAttribute("cd",_thisObj.value);
    comboObj.setAttribute("nm",$.trim(label.replace(_thisObj.value,'')));
    comboObj.setAttribute("label",label);
    
    var combo_div = _thisObj.parentElement;
    combo_div.innerHTML = $m.getInputSelectTag(label);
    $m.setCellData(grd,realRowIndex,colid,combo_div.getAttribute('cd'));
    
    if($m.trim(_onSelectChanged) != '' ){
        eval(_onSelectChanged)(realRowIndex,colid,beforeCd,beforeNm,_thisObj.value,label);
    }
};

Moca.prototype.getCellData = function(grd,rowIndex,colid,_pageId,_srcId){
    ['grid cell getCellData'];
    if(colid == 'status'){
        return grd.list[parseInt(rowIndex)]["_system"][colid];
    }else{
        return grd.list[parseInt(rowIndex)][colid];
    }
};

Moca.prototype.getCellViewData = function(grd,rowIndex,colid,_pageId,_srcId){
    ['grid cell getCellData'];
    if(colid == 'status'){
        return grd.list[parseInt(rowIndex)]["_system"][colid];
    }else{
        var val = grd.list[parseInt(rowIndex)][colid];
        if(grd[colid].map != null){
            return grd[colid].map[val];
        }else{
            return val;
        }
    }
};

Moca.prototype.getCellOriData = function(grd,rowIndex,colid){
    ['grid cell getCellOriData'];
    if(colid == 'status'){
        return grd.ori_list[parseInt(rowIndex)]["_system"][colid];
    }else{
        return grd.ori_list[parseInt(rowIndex)][colid];
    }
};




Moca.prototype.arrayOrderFnc = function(dataArray, orderArray, type){
    let returnArray = [];

    let orderArraySize = 0;
    let orderArraySizeMax = orderArray.length;
    
    let subOrderCallBoolean = false;
    
    //1차 정렬
    returnArray = $m.orderFnc(dataArray, orderArray[0], type[0]);
        
    
    //동일한 값이 있고 기준 컬럼 배열이 2개 이상일때 실행
    //중복 데이터 정렬용 배열 생성 sameDataArray
    //if(subOrderCallBoolean && orderArraySizeMax >= 2){
    if(orderArraySizeMax >= 2){
        //2차 정렬
        $m.subOrderFnc(returnArray, orderArray, type);
        
    }
    
    return returnArray;
}

Moca.prototype.orderFnc = function(dataArray, orderStr, type){
    let returnArray = [];
    
    $.each(dataArray,function(index1, item1){
        let tempCheckData = dataArray[index1][orderStr];
        let orderIndex  = 0;
        
        $.each(returnArray,function(index2, item2){
            let tempData = returnArray[index2][orderStr];
            if(tempData == undefined){
                tempData = null;
            }
            if(tempCheckData == undefined){
                tempCheckData = null;
            }
            if(tempCheckData > tempData){
                orderIndex = index2 + 1;
            }
        });
        
        returnArray.splice(orderIndex, 0, dataArray[index1]);
    });
    
    if(type == "desc"){
        returnArray = returnArray.reverse();
    }
    
    return returnArray;
}

Moca.prototype.subOrderFnc = function(returnArray, orderArray, type){
    
    for(let orderIndex = 1 ; orderIndex < orderArray.length ; orderIndex++){
        
        let sameDataArray = [];
        let tempDataArray = [];
        let samDataStrArray  = [];  //정렬기준별 동일 데이터 임시저장용 배열
        
        for(let n =0;n < returnArray.length -1 ; n ++){
            
            let checkBoolean = false;
            let nowStrArray = [];
            let nextStrArray = [];
            
            for(let checkIndex =0 ; checkIndex < orderIndex; checkIndex++){
                nowStrArray.push(returnArray[n][orderArray[checkIndex]]);
                nextStrArray.push(returnArray[n+1][orderArray[checkIndex]]);
            }
            
            //기준컬럼 값이 같은 데이터만 확인
            for(let n1=0 ; n1 < nowStrArray.length; n1++){
                if(nowStrArray[n1] == nextStrArray[n1]){
                    checkBoolean = true;
                }else{
                    checkBoolean = false;
                    break;
                }
            }
            //마지막 기준 컬럼 값이 같은지 체크
            if(checkBoolean && nowStrArray[nowStrArray.length - 1] == nextStrArray[nextStrArray.length - 1]){
                samDataStrArray = nowStrArray;
                
                tempDataArray.push(returnArray[n]);
            }else{
                if(samDataStrArray.length > 0){
                    tempDataArray.push(returnArray[n]);
                    
                    let tempMap = {
                            matchData : samDataStrArray,
                            data : tempDataArray
                    } 
                    
                    sameDataArray.push(tempMap);
                    
                    samDataStrArray = [];
                    tempDataArray = [];
                }
    
            }
            
            if(returnArray.length - 2 == n && tempDataArray.length > 0){
                tempDataArray.push(returnArray[n+1]);
                
                let tempMap = {
                        matchData : samDataStrArray,
                        data : tempDataArray
                } 
                
                sameDataArray.push(tempMap);
            }
        
        }
        
        //재정렬할 데이터가 있으면 해당 배열 개수만큼 재정렬후 입력
    
        $.each(sameDataArray,function(index3, item3){
            let matchDataArray = sameDataArray[index3].matchData;
            let tempArray = $m.orderFnc(sameDataArray[index3].data, orderArray[orderIndex], type[orderIndex]);
            let checkBoolean = false;
            
            for(let n =0 ; n < returnArray.length ;n++){
                let nowDataArray = [];

                //현재 orderIndex 만큼 돌며 해당 컬럼에 매칭되는 데이터 저장
                for(let subOrderIndex =0 ; subOrderIndex <= orderIndex; subOrderIndex++){
                    nowDataArray.push(returnArray[n][orderArray[subOrderIndex]]);                
                }
                
                //기준컬럼 값이 같은 데이터만 확인
                for(let n1=0 ; n1 < matchDataArray.length; n1++){
                    if(matchDataArray[n1] == nowDataArray[n1]){
                        checkBoolean = true;
                    }else{
                        checkBoolean = false;
                        break;
                    }
                }
                //마지막 기준 컬럼 값이 같은지 체크
                if(checkBoolean && matchDataArray[matchDataArray.length - 1] == nowDataArray[matchDataArray.length - 1]){
                    //같은 값 만큼 배열 지우고 갯수만큼 다시 넣음
                    returnArray.splice(n, tempArray.length);
                
                    $.each(tempArray,function(index4, item4){
                        returnArray.splice(n + index4, 0, item4);
                    });
                    
                    break;
                }
            }
            
            
        });
    }
}

Moca.prototype._fullScreenGrid = function(_thisObj){
    var _pageid = $(_thisObj).attr("pageid");
    var _srcid = $(_thisObj).attr("srcid");

    var g = _thisObj.parentElement.parentElement.parentElement;
    var g_jq = $(g);
    var b_jq = $(_thisObj);
    var fs = _thisObj.getAttribute('full_screen');
    if(fs == null || fs == "false" ){
        _thisObj.setAttribute("full_screen","true");
        //_thisObj.setAttribute("tmp_position",g_jq.css('position'));
        //_thisObj.setAttribute("tmp_top",g_jq.css('top'));
        //_thisObj.setAttribute("tmp_left",g_jq.css('left'));
        //_thisObj.setAttribute("tmp_width",g_jq.css('width'));
        //_thisObj.setAttribute("tmp_height",g_jq.css('height'));
        //_thisObj.setAttribute("tmp_z-index",g_jq.css('z-index'));
        //g_jq.css('position','fixed');
        //g_jq.css('top','0px');
        //g_jq.css('left','0px');
        //g_jq.css('z-index','9999');
        var _height = g_jq.css('height');
        g_jq[0].height = _height;
        g_jq.addClass("overlayer");
        b_jq.removeClass("grid_full");
        b_jq.addClass("grid_default");  
        
        
        g_jq.css('height','');
    }else{
        _thisObj.setAttribute("full_screen","false");   
        //g_jq.css('position',_thisObj.getAttribute("tmp_position"));
        //g_jq.css('top',_thisObj.getAttribute("tmp_top"));
        //g_jq.css('left',_thisObj.getAttribute("tmp_left"));
        //g_jq.css('z-index',_thisObj.getAttribute("tmp_z-index"));
        g_jq.removeClass("overlayer");
        b_jq.removeClass("grid_default");
        b_jq.addClass("grid_full"); 
        //if(g_jq.attr('pageid').startsWith('POPUP')){
            if(g_jq[0].height != null){
                g_jq.css('height',g_jq[0].height);
            }
        //}
    }
    
    
    var grdkey = _thisObj.getAttribute("grdkey");
    var yscrollObj = $('.moca_scrollY_type1[id='+grdkey+'_moca_scroll_y][pageid='+_pageid+'][srcid='+_srcid+']');
    $m.sFunction(yscrollObj[0]);
};

Moca.prototype.isShowFoldBtn = function(_foldBtnObj){
	if(_foldBtnObj.hasClass("grid_fold")){
		return false;
	}else{
		return true;
	}
};

Moca.prototype._foldGrid = function(_thisObj){
	var g_jq = $(_thisObj).closest('div[type="grid"]');
    var b_jq = $(_thisObj);
    var _onFoldClick = g_jq.attr("onFoldClick");
    $m._foldGrid_common(b_jq,g_jq);
    if($m.trim(_onFoldClick) != ''){
    	eval(_onFoldClick)(b_jq,g_jq);
    };
};

Moca.prototype._foldGrid_common = function(_foldBtnObj,_grdObj){
    var g_jq = _grdObj;
    var b_jq = _foldBtnObj;
    if(g_jq.find('.moca_grid_list').is(":visible")){
        b_jq.siblings().hide();
        b_jq.removeClass('grid_unfold');
        b_jq.addClass('grid_fold');
        g_jq.addClass('fold');
        g_jq.find('.moca_grid_list').hide();
    }else{
        b_jq.siblings().show();
        b_jq.removeClass('grid_fold');
        b_jq.addClass('grid_unfold');
        g_jq.removeClass('fold');
        g_jq.find('.moca_grid_list').show();
        $m.redrawGrid(g_jq[0]);
    }
};

Moca.prototype.getGridObj = function(_grdObj,_id){
	return _grdObj.find('#'+_id);
};

Moca.prototype.redrawGrid = function(_grd){
    /*
    var cntObj = $(_grd).find('.grid_total .txt_blue');
    if(_grd.ori_list.length != _grd.list.length){
        cntObj.html('<b style="color:red">'+$m.comma(_grd.list.length)+'</b>'+'/'+$m.comma(_grd.ori_list.length));
    }else{
        cntObj.html($m.comma(_grd.ori_list.length));
    }
    */
    
    $('.itemTable').remove();//필터창 열린게 있으면 닫기
    if(_grd == null){
        //setTimeout(function(){
            var yscrollArr = $('.moca_scrollY_type1[pageid='+$m.pageId+'][srcid='+$m.srcId+']');
            for(var i=0,j=yscrollArr.length; i < j; i++){
                $m.sFunction(yscrollArr[i]);
            }
        //},100);
    }else{
        var yscrollObj = $(_grd).find('.moca_scrollY_type1')[0];
        //setTimeout(function(){
            $m.sFunction(yscrollObj);
        //},100);
    }
};

Moca.prototype.getRes = function(_response){
    ['응답객체를 리턴타입에 맞게 변환']
    if(typeof _response == 'string'){
        return JSON.parse(_response);
    }else {
        return _response;
    }
};

Moca.prototype.getResList = function(_response,_list,_status){
    ['응답객체list를 리턴타입에 맞게 변환']
    var res;
    if(typeof _response == 'string'){
        res =  JSON.parse(_response);
    }else {
        res =  _response;
    }
    
    var str;
    if(typeof _list == 'object'){
        str = JSON.stringify(_list);
    }else{
        str = JSON.stringify(res[_list]);
    }
    
    if(_status == null){
        _status = "";
    }
    if(str != null){
        str = str.replace(/\{\"/g,'{"_system":{"status":"'+_status+'","expand":"true"},"');
        res = JSON.parse(str);

        return res;
    }else{
        return null;
    }

};

Moca.prototype.toMillDate = function(_millisecond){
    ['밀리세컨드를 날짜시간으로 ']
    if(_millisecond != undefined && $.trim(_millisecond) != ""){
        var d = new Date(parseInt(_millisecond));
        return $m.dateFormat($m.now(d));
    }else{
        return '';
    }
};

Moca.prototype.toFormatYYYYMMDDByDash = function(_YYYYMMDD){
    ['년월일을 구분자를 넣어서']
    var _gubun = "-";
    if(_YYYYMMDD != null && _YYYYMMDD.length == 8){
        return _YYYYMMDD.replace(/([0-9]{4})([0-9]{2})([0-9]{2})/g,'$1'+_gubun+'$2'+_gubun+'$3');
    }else{
        return _YYYYMMDD;
    }
};

Moca.prototype._row_add = function(_thisObj){
    ['행추가'] 
    var g_jq = $m.getTypeObj(_thisObj);
    var grd = g_jq[0];
    var b_jq = $(_thisObj);
    var grdkey = _thisObj.getAttribute("grdkey");
    var aRow = {"_system":{"status":""}};
    var ks = Object.keys(grd.cellInfo);
    for(var i=0,j=ks.length;i < j; i++){
        var key = ks[i];
        if(key == 'status'){
            aRow["_system"][key] = 'C';
        }else{
            aRow[key] = '';
        }
    }
    if(grd.list == null){
        grd.list = [];
    }
    grd.list.unshift(aRow); 
    $m[grd.getAttribute('srcId')].drawGrid(grd,grd.list);
    var rowForFocus = $(grd).find('tbody:first').children()[0];
    if(rowForFocus != null){
        $m._setSelectRowIndex(rowForFocus);
        $m._setRowSelection(grd);
    }
};

Moca.prototype._row_del = function(_thisObj){
    ['행삭제']
    var _type = $m.getType(_thisObj); 
    var g = $m.getTypeObj(_thisObj)[0];
    var toolbar_delrow_imd = g.getAttribute("toolbar_delrow_imd");
    //var selectedRowIndex = g.getAttribute("selectedRowIndex");
    var selectedRealRowIndex = g.getAttribute("selectedRealRowIndex");
    //var targetRow = $(g).find('tbody>tr:eq('+selectedRowIndex+')');
    var status = g.list[selectedRealRowIndex]["_system"]['status'];
    if(status == 'C' || toolbar_delrow_imd == 'true'){
        $m.removeRow(g,selectedRealRowIndex); 
    }else if(status == 'D'){    
        $m.setCellData(g,selectedRealRowIndex,'status','');       
    }else{
        $m.setCellData(g,selectedRealRowIndex,'status','D');
    }
};

Moca.prototype.getSelectedRowJson = function(_gridId,_pageId,_srcId){
    ['getRowJson']
    var _grd = $m.getObj(_gridId,null,_pageId,_srcId);
    var selectedRealRowIndex = _grd.getAttribute("selectedRealRowIndex");
    var _json = _grd.list[selectedRealRowIndex];
    return _json;
};
Moca.prototype.setCellData = function(_grd,_realRowIndex,_colId,_data){
    ['grid setCellData']
    if(_colId == 'status'){
        _grd.list[_realRowIndex]["_system"][_colId] = _data;    
    }else{
        _grd.list[_realRowIndex][_colId] = _data;   
    }
    var targetRow = $(_grd).find('tbody:first>tr[realrowindex='+_realRowIndex+']');
    var _renderingDiv = $(_grd).attr('rendering_div');
            
    if(_grd.cellInfo[_colId] != null){
        var celltype = _grd.cellInfo[_colId].getAttribute('celltype');
        if(celltype == 'inputButton'){
        	if(_renderingDiv){
        		$(targetRow).find('td[id='+_colId+'] div[type="text"]').attr('value',_grd.list[_realRowIndex][_colId]);
        		$(targetRow).find('td[id='+_colId+'] div[type="text"]').html(_grd.list[_realRowIndex][_colId]);
        		
            }else{
            	$(targetRow).find('td[id='+_colId+'] input').val(_grd.list[_realRowIndex][_colId]);
            }
            
        }else if(celltype == 'input'){
			var iptObj = $(targetRow).find('td[id='+_colId+'] input');
			if(_renderingDiv){
				if($(targetRow).find('td[id='+_colId+']').attr('readonly') == 'true'){
					//$( _grd.cellInfo[_colId]).html(_data);
					$(targetRow).find('td[id='+_colId+'] div').html(_data);
				}else{
					iptObj = $(targetRow).find('td[id='+_colId+'] div[type="input"]');
					iptObj.attr('value',_data);
					var _iptTag = iptObj.find('input');
					var _displayFunctionApply = $(targetRow).find('td[id='+_colId+']').attr('displayFunctionApply');
					var _editormode = $(targetRow).find('td[id='+_colId+']').attr('editormode');
					if(_editormode == 'true' || $m.getDevice() == 'mobile'){
						iptObj.html(_data);
					}else if(_displayFunctionApply == 'realtime' && _iptTag != ''){
						_iptTag.val(_data);
					}
				}
        		
            }else{
				if(iptObj.length > 0){
	                iptObj.val(_data);
	            }else{
	                $(targetRow).find('td[id='+_colId+']').html(_data);
	            }
			}
            
            
        }
    }


    var oriVal = $m.getCellOriData(_grd,_realRowIndex,_colId);
    if(oriVal == undefined){
        oriVal = "";
    }
    if(_data == null || _data == "null"){
        _data = "";
    }
    if( !(_data == "0" && oriVal == "")  && oriVal != _data ){
        var status_now = $m.getCellData(_grd,_realRowIndex,'status');
        if(status_now !='C'){
            if(_colId == "status"){
                _grd.list[_realRowIndex]["_system"]['status'] = _data;
                $(targetRow).find('td[id=status]').html(_data);
            }else{
                _grd.list[_realRowIndex]["_system"]['status'] = 'U';
                $(targetRow).find('td[id=status]').html('U');   
            }

        }
    }else{
        var status_now = $m.getCellData(_grd,_realRowIndex,'status');
        if(status_now !='C'){
            var cellArray = Object.keys(_grd.cellInfo);
            var flag = true;
            for(var i=0; i < cellArray.length; i++){
                var cl = cellArray[i];
                if(cl != 'status'){
                    oriVal = _grd.ori_list[_realRowIndex][cl];
                    currentVal = _grd.list[_realRowIndex][cl];
                    if(oriVal == undefined){
                        oriVal = "";
                    }
                    if(currentVal == null || currentVal == "null"){
                        currentVal = "";
                    }
                    if(           !(currentVal == "0" && oriVal == "")  && oriVal != currentVal   ){
                        flag = false;
                        break;
                    }
                }
            }           
            if(flag){
                _grd.list[_realRowIndex]["_system"]['status'] = '';
                $(targetRow).find('td[id=status]').html('');
            }
        }
        
    }
};

Moca.prototype.removeRow = function(_grd,_rowIndex){
    ['grid removeRow']
    _grd.list.splice(_rowIndex,1);
    if(_grd.list.length > 0){
        _grd.setAttribute("selectedRealRowIndex","0");
    }else{
        _grd.setAttribute("selectedRealRowIndex","");
    }
    //새로그려야함. 데이터 정합성을 위해
    $m.grid_redraw(_grd);
};


Moca.prototype._uptData = function(_thisObj){
    ['에디팅데이터 실시간 dataList에 반영'];
    //event.preventDefault();
    $m._selectFocus(_thisObj);
    var grd = $(_thisObj).closest('div[type=grid]')[0];
    var _thisTd = $(_thisObj).closest('td');
    var colid = $(_thisObj).closest('td')[0].id;
    var _tbody = $(_thisObj).closest('tbody');
    var _thisTr = $(_thisObj).closest('tr');
    var rowIndex = _tbody.children().index(_thisTr);
    var realRowIndex = grd.getAttribute("selectedRealRowIndex");
    var _thisEvtObj;
    if(_thisObj.tagName == "TD"){
        $m._selectFocus(_thisObj);
        var chkbox = $(_thisObj).find(".moca_checkbox_grid>input");
        if(chkbox.length > 0){
            _thisObj = chkbox[0];
            if($(_thisObj).prop("checked")){
                $(_thisObj).prop("checked",false);
            }else{
                $(_thisObj).prop("checked",true);
            }
        }
        var rdobox = $(_thisObj).find(".moca_radio_grid>input");
        if(rdobox.length > 0){
            _thisEvtObj = event.srcElement;
            //$(_thisEvtObj).parent().find('input[checked]').attr('checked',false);
            /*
            if($(_thisEvtObj).prop("checked")){
                $(_thisObj).prop("checked",true);
            }else{
                $(_thisObj).prop("checked",false);
            }
            */
        }
    }
    if(_thisObj.type == 'checkbox'){
        //grd.ori_list[parseInt(rowIndex)][colid];
        var allCheckbox = $(grd).find('input[name=cbxAll]');
        var arr_all = $(grd).find('td input[type=checkbox]');
        var arr_checked = $(grd).find('td input[type=checkbox]:checked');
        if(arr_all.length == arr_checked.length){
            allCheckbox.prop('checked',true);
            allCheckbox.prop('indeterminate',false);
        }else if(arr_all.length == 0){
            allCheckbox.prop('checked',false);
            allCheckbox.prop('indeterminate',false);
        }else{
            allCheckbox.prop('checked',false);
            if(arr_checked.length == 0){
                allCheckbox.prop('indeterminate',false);
            }else{
                allCheckbox.prop('indeterminate',true);
            }
        }
        
        if(_thisObj.checked){
            var v = _thisTd[0].getAttribute("trueValue");
            if(v == null){
                v = "true";
            }
            $m.setCellData(grd,realRowIndex,colid,v);
        }else{
            var v = _thisTd[0].getAttribute("falseValue");
            $m.setCellData(grd,realRowIndex,colid,v);
        }
    }else if(_thisEvtObj!=null && _thisEvtObj.type == 'radio'){
    	if(_thisEvtObj.checked){
    		_value = $(_thisEvtObj)[0].value;
    		$m.setCellData(grd,realRowIndex,colid,_value);
    	}
    }else if($(_thisEvtObj).prev().length > 0 && $(_thisEvtObj).prev()[0].type == 'radio'){
    	var r = $(_thisEvtObj).prev()[0];
    	if(r.checked){
    		_value = $(r)[0].value;
    		$m.setCellData(grd,realRowIndex,colid,_value);
    	}    	
    }else if(_thisObj.tagName == 'TD'){
        if($(_thisObj).find('input').length > 0){
            _value = $(_thisObj).find('input').attr('value');
            $m.setCellData(grd,realRowIndex,colid,_value);
        }else{
            _value = $(_thisObj).html();
        }
    }else{
        var displayfunctionValue = $(_thisObj).attr('displayfunction');
        var displayFunctionApplyValue = $(_thisObj).attr('displayFunctionApply');
        if($m.trim(displayfunctionValue) != '' && $m.trim(displayFunctionApplyValue) == 'realtime'){
            var reValue = eval(displayfunctionValue)(_thisObj.value);
           
            //일단데이터(input)
            $m.setCellData(grd,realRowIndex,colid,reValue);
        }else{
            //일단데이터(input)
            $m.setCellData(grd,realRowIndex,colid,_thisObj.value);
        }
    }
};
Moca.prototype._evt_selectFocus = function(_thisObj){
    ['focus이벤트에서 포커스배경색주기'];
    $m._selectFocus(event.srcElement.parentElement);
};


Moca.prototype._selectFocus = function(_thisObj){
    ['row select 표시'];
    var isTd = _thisObj;
    if(isTd.tagName == 'TD'){
        //input경우
        var grd = $(_thisObj).closest('div[type="grid"]')[0];
        if(grd == null){
            grd = $("#"+_tdObj.id).closest('div[type="grid"]')[0];
        }
        $m._setSelectRowIndex(isTd);
        $m._setRowSelection(grd);
    }else {
        //select경우
        isTd = _thisObj.parentElement;
        if(isTd.tagName == 'TD'){
            var grd = $(_thisObj).closest('div[type="grid"]')[0];
            if(grd == null){
                grd = $("#"+_tdObj.id).closest('div[type="grid"]')[0];
            }           
            var type = grd.getAttribute("type");
            if(type == 'grid'){
                $m._setSelectRowIndex(isTd);
                $m._setRowSelection(grd);
            }
        }
    }
};

Moca.prototype._setSelectRowIndex = function(_tdObj){
    ['row select Index구하기'];
    var tr;
    if(_tdObj.tagName == 'TR'){
        tr = _tdObj;
    }else if(_tdObj.tagName == 'TD'){
        tr = _tdObj.parentElement;
    }
    var tbody = tr.parentElement;
    var grd = $(_tdObj).closest('div[type="grid"]')[0];
    if(grd == null){
        grd = $("#"+_tdObj.id).closest('div[type="grid"]')[0];
    }
    var realrowindex = tr.getAttribute("realrowindex");
    grd.setAttribute("selectedRealRowIndex",realrowindex);
};

Moca.prototype._setRowSelection = function(grd,_tdObj){ 
    ['row select 표시'];
    var _realIndex = grd.getAttribute("selectedRealRowIndex");
    if($m.trim(_realIndex) != ''){
        var foundedRow = $(grd).find('tbody:first>tr[realrowindex='+_realIndex+']');
        var selectedRow;
        if(foundedRow.length == 1){
            selectedRow = foundedRow[0];
        }
        if(selectedRow != null){
        	var _bgcolor = $m.rowSelectedColor;
        	if($m.trim(grd.getAttribute("rowselectedcolor")) != ''){
        		_bgcolor = grd.getAttribute("rowselectedcolor");
        	}
        	
            $(grd).find('tbody:first').children().children().css('background-color','').css('color','');
            $(selectedRow).children().css('background-color',_bgcolor).css('color','#FFF');
        }
    }
};


Moca.prototype.getFilteredList = function(_grdId,key,_val,isNot,_pageId,_srcId){
    ['응답객체를 리턴타입에 맞게 변환']
    var _grd;
    if(typeof _grdId == 'string'){
        _grd = $m.getObj(_grdId,null,_pageId,_srcId);
    }else{
        _grd = _grdId;
    }
    var val = _val.split(',');
    var reObj =  _grd.list.filter(function(jsonObj){
              for(var i=0; i < val.length; i++){
                var arrKey = val[i];
                if (key == 'status'){
                    if(isNot == 'NOT'){
                        if(jsonObj["_system"][key] != arrKey){
                            return true;
                        }
                    }else{
                        if(jsonObj["_system"][key] == arrKey){
                            return true;
                        }
                    }
                }else{
                    if(isNot == 'NOT'){
                        if(jsonObj[key] != arrKey){
                            return true;
                        }
                    }else{
                        if(jsonObj[key] == arrKey){
                            return true;
                        }
                    }
                }
              }
              return false;
            }
    );
    return reObj;
};

Moca.prototype.getFilteredListForFilter = function(_list,key,_val){
    ['응답객체를 리턴타입에 맞게 변환']
    var val = _val.split(',');
    var reObj =  _list.filter(function(jsonObj){
        if (_val.indexOf(jsonObj[key]) > -1){
            return true;
        }
        return false;
    });
    
    return reObj;
};

Moca.prototype.validate = function(__grdId,_key,_val,_pageId,srcId){
    ['응답객체를 리턴타입에 맞게 변환']
    var _grdIdArr = __grdId.split(',');
    var isExist = false;
    for(var g=0; g < _grdIdArr.length; g++){
        var _grdId = _grdIdArr[g];
        var _grd = $m.getObj(_grdId,null,_pageId,srcId);
        var reObj =  _grd.list;
        for(let i =0; i < reObj.length; i++){
            let row = reObj[i]; 
            if(row["_system"][_key] != null && row["_system"][_key].length != 0 && _val.indexOf(row["_system"][_key]) > -1 ){
                isExist = true;
                var ks = Object.keys(_grd.cellInfo);
                for(let j=0,k=ks.length;j < k; j++){
                    var key = ks[j];
                    var required = _grd.cellInfo[key].getAttribute("required");
                    if(required == "true"){
                        
                        if($.trim(row[key]) === '' || row[key] == undefined){
                            $m.alert(key+'는 필수입력항목입니다!',function(){$m.setFocus(_grd,i,key);});
                            return false;
                        }
                    }           
                    
                }
            }
        }
    }
    if(!isExist){
        $m.alert('처리할 대상이 없습니다.');
        //isExist = true;
    }
    return isExist;
};

Moca.prototype.setFocus = function(_grdObj,_rowIndex,_colId){
    ['grid cell에 포커스주기']
    $($(_grdObj).find("tbody:first>tr")[_rowIndex]).find('td[id='+_colId+']').find('input,select').focus();
};


Moca.prototype.cell_check = function(_thisObj){
    ['grid cell_check']
    var trObj;
    if(_thisObj.tagName == 'TR'){
        trObj = _thisObj;
    }else{
        trObj = _thisObj.parentElement.parentElement.parentElement;
    }
    var realRowInfo = $m.getRealRowInfo(trObj);
    var _realIndex = realRowInfo.realRowIndex;
    var _grd = realRowInfo.grd;
    $m.grid_expand_loop(_grd,_realIndex,null,1);  
    $m.grid_redraw(_grd);
};

Moca.prototype.grid_redraw = function(_grd){
    ['grid_redraw']
    $m.sFunction($(_grd).find('.moca_scrollY_type1')[0]);
};


Moca.prototype.getIsLeaf = function(_grd,i,childRow,_levelId){
    ['grid_hide']
    var isLeaf = childRow["_system"]["isLeaf"];
    var _row_pre = _grd.list[i-1];
    var _row_next = _grd.list[i+1];
    var _level = (childRow != null)? childRow[_levelId]:0;
    var preLevel = (_row_pre != null)? _row_pre[_levelId]:0;
    var nextLevel = (_row_next != null)? _row_next[_levelId]:0;
    if( (_level > preLevel && _level == nextLevel) || _level > nextLevel || (_row_pre != null && _row_pre["_system"]["isLeaf"] == "true" && _level == preLevel)
            || (_row_pre != null && _row_pre["_system"]["isLeaf"] == "true" && _level == preLevel && _level == nextLevel)){
        childRow["_system"]["isLeaf"] = "true";
    }else{
        childRow["_system"]["isLeaf"] = "false";                    
    }
    isLeaf = childRow["_system"]["isLeaf"];
    return isLeaf;
};

Moca.prototype.get_tree_info = function(_grd){
    ['get_tree_info']
    var _nodeId = _grd.cellInfo.treeDepth.getAttribute("nodeId");
    var _levelId = _grd.cellInfo.treeDepth.getAttribute("levelid");
    var _parentNodeId = _grd.cellInfo.treeDepth.getAttribute("parentNodeId");
    return {nodeId:_nodeId,levelId:_levelId,parentNodeId:_parentNodeId};
};

Moca.prototype.nowRow_info = function(_grd,_realIndex,tro){
    ['nowRow_info']
    var nowRow = _grd.list[_realIndex];
    var _nowKeyValue = nowRow[tro.nodeId];
    var _parentKeyValue = nowRow[tro.parentNodeId];
    return {now:nowRow,nk:_nowKeyValue,pk:_parentKeyValue};
};


Moca.prototype.isExpaned = function(_isExpaned,nowRow){
    ['nowRow_info']
    var isExpaned;
    if(_isExpaned){
        isExpaned = _isExpaned;
    }else{
        isExpaned = nowRow["_system"]["expand"];
    }
    $m.grid_show_hide(isExpaned,_isExpaned,nowRow);
    return isExpaned;
};

Moca.prototype.grid_show_hide = function(isExpaned,_isExpaned,nowRow){
    ['grid_show']
    if(isExpaned == "true"){
        if(_isExpaned != null){
            //nowRow["_system"]["display"] = "hide";
        }else{
            nowRow["_system"]["expand"] = "false";  
        }
    }else{
        if(_isExpaned != null){
            //nowRow["_system"]["display"] = "show";
        }else{
            nowRow["_system"]["expand"] = "true";
        }   
    }

};
Moca.prototype.grid_expand = function(_thisObj){
    ['grid_tree expand']
    var trObj;
    if(_thisObj.tagName == 'TR'){
        trObj = _thisObj;
    }else{
        //trObj = _thisObj.parentElement.parentElement.parentElement;
        trObj = $(_thisObj).closest('tr')[0];
    }
    var realRowInfo = $m.getRealRowInfo(trObj);
    var _realIndex = realRowInfo.realRowIndex;
    var _grd = realRowInfo.grd;
    $m.grid_expand_loop(_grd,_realIndex,null,1);  
    $m.grid_redraw(_grd);
};

Moca.prototype.grid_child_show_hide = function(isExpaned,childRow,parent_expand,parent_display){
    ['grid_child_show_hide']
    if(isExpaned == "true"){//열려있다->닫는기능
        childRow["_system"]["display"] = "hide";
    }else{
        if(parent_expand == "false"){//부모가접혀있으면
            childRow["_system"]["display"] = "hide";
        }else{
            if(parent_display == "hide"){
                childRow["_system"]["display"] = "hide";
            }else{
                childRow["_system"]["display"] = "show";
            }
        }
        
    }
};
Moca.prototype.grid_expand_loop = function(_grd,_realIndex,_isExpaned,_depth){
    ['grid_tree grid_expand_loop']
    var re = {};
    var tro = $m.get_tree_info(_grd);
    var nro = $m.nowRow_info(_grd,_realIndex,tro);
    var isExpaned= $m.isExpaned(_isExpaned,nro.now);
    var parent_display = nro.now["_system"]["display"];
    var parent_expand = nro.now["_system"]["expand"];
    
    var returnCnt = 0;
    var returnCntAppend = 0;
    var last_i = _realIndex+1;
    for(var i=last_i; i < _grd.list.length; ){
        var childRow = _grd.list[i];
        if(childRow[tro.parentNodeId] == nro.nk){
            $m.grid_child_show_hide(isExpaned,childRow,parent_expand,parent_display);
            returnCnt++;
            if($m.getIsLeaf(_grd,i,childRow,tro.levelId) != "true"){//폴더
                var reObj = $m.grid_expand_loop(_grd,i,isExpaned,_depth+1);
                returnCnt += reObj.returnCnt;
                i = reObj.i;
                last_i = i;
            }else{//Leaf
                i++;
                last_i = i;
            }
        }else{
            last_i = i;
            break;
        }
    }
    returnCntAppend += returnCnt;//폴더일때만 리턴됨?
    re.returnCnt = returnCnt;
    re.returnCntAppend = returnCntAppend;
    re.i = last_i;
    return re;
};

Moca.prototype.genTbody = function(_grd,_list,_idx,isEnd) {
    var dataLeng = _list.length;
    var idx = 0;
    if(_idx != null){
        idx = _idx;
    }
    _grd.setAttribute("yscrollIdx",idx);
    var usetree = _grd.getAttribute("usetree");
    var treetdid = _grd.getAttribute("treetdid");
    var _default_cell_height =  this.getCellHeight(_grd);
    var headerCellCnt = $(_grd).find('thead').children().length;
    var viewRowsMaxCnt = ($(_grd).find('.moca_grid_body').height()-$(_grd).find('thead').height()) /_default_cell_height;
    viewRowsMaxCnt = Math.round(viewRowsMaxCnt);
    
    if(viewRowsMaxCnt < 1){
        viewRowsMaxCnt = _grd.viewRowsMaxCnt;
    }
    if(isEnd){
        idx = dataLeng - Math.floor(viewRowsMaxCnt);
    }else{
    	if(dataLeng != viewRowsMaxCnt){
    		viewRowsMaxCnt++;//tree에서 넥스트tr를 미리보기위해 필요
    	}
    }
    if(idx < 0){
        idx = 0;
    }
    var viewRowsMaxNow = dataLeng;
    if(dataLeng < (viewRowsMaxCnt + idx)){
        viewRowsMaxNow = dataLeng;
    }else{
        viewRowsMaxNow = (viewRowsMaxCnt + idx);
    }
    var tbody  = "";
    
    for(var i=idx,j=viewRowsMaxNow;i < j; i++){
        var row = _list[i];
        var row_next;
        if(i+1 < j){
            row_next = _list[i+1];
        }else{
            row_next;
        }
        var row_pre;
        if(i-1 > 0){
            row_pre = _list[i-1];
        }else{
            row_pre;
        }       
        
        var isExp = "true";
        var showHide = "show";
        if(usetree == "true"){
            isExp = row["_system"]["expand"];
            showHide = row["_system"]["display"];
            if(showHide == null){
                showHide = "show";
            }
        }
        var _aTr = this.genRows(row,row_pre,row_next,_grd,null,idx,i,"before");
        if(showHide == "hide"){
            j++;
            if(j > dataLeng){
                j = dataLeng;
            }
            continue;
        }else{
            tbody += _aTr;
        }
    }
    
    $(_grd).find('tbody:first').html(tbody);
	for(var i=idx,j=viewRowsMaxNow;i < j; i++){
        this.genRows(row,row_pre,row_next,_grd,null,idx,i,"after");
    }
    
    $m._col_showhideExe(_grd);
    $m._setRowSelection(_grd);
    
    var _onDblClickFunc = _grd.getAttribute("onDblClick");
    if($m.trim(_onDblClickFunc) != ''){
        $(_grd).off('dblclick','tr');
        $(_grd).on('dblclick','tr', function(e) {
        	
            var nowGrd = e.delegateTarget;
            var rowIndex = e.currentTarget.getAttribute('realrowindex');
            if(event.srcElement.tagName == 'DIV'){
                var colId = $(event.srcElement).closest('td').attr('id');
            }else if(event.srcElement.tagName == 'TD'){
                var colId = event.srcElement.id;
            }
            
            var colIndex = $(e.currentTarget).find('td[id='+colId+']').index();
            var _onDblClickFunc = nowGrd.getAttribute("onDblClick");
            eval(_onDblClickFunc)(nowGrd,rowIndex,colIndex,colId);
        });
    }
    
    if($._data(_grd,"events") == null || $._data(_grd,"events").mouseover == null || $._data(_grd,"events").mouseover.length < 1){
        $(_grd).on('mouseenter','td', function(e) {
            if(this.innerText != null && this.innerText != '' && this.getAttribute("tooltip") == "true"){
                var obj = $('.moca_grid_tooltip');
                obj.css('position','fixed');
                obj.html(this.innerText);
                var tdWidth = $(obj).width()+20;
                var posi = event.clientX;
                var s = $(window).width()/2;
                if(posi < s){
                    posi = posi + 20;
                }else{
                    posi = posi -tdWidth;
                }
                var tdHeight = $(this).height();
                var posiY = event.clientY;
                var posiY_max = document.body.clientHeight-tdHeight-20;
                if(posiY > posiY_max){
                    posiY = posiY_max;
                }
                obj.css('top',posiY+'px').css('left',posi+'px').css('display','block');
            }
        }).on("mouseleave", "tbody:first", function(e) {
            $('.moca_grid_tooltip').css('display','none');
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    return false;
        }).on("wheel", "tbody:first", function(e) {
            if(e.currentTarget.tagName == 'TBODY'){
                var grd = $(e.currentTarget).closest("[type=grid]");
                $m.pageId = grd.attr('pageId');
                $m.srcId = grd.attr('srcid');
            }
            $m.wFunction($m.getObj(_grd.id+"_moca_scroll_y"));          
        }).on("mousemove", "table", function(e) {
            $m.grid_checkBorder(this);
            //e.preventDefault();
            //e.stopPropagation();
            //e.stopImmediatePropagation();
            //return false;
        });

    }
    //$m.sFunction(this);
    //다그리고난후에 색칠함!
    var rowBgColorFunctionStr = _grd.getAttribute("rowBgColorFunction");
    if(rowBgColorFunctionStr != null){
        var rowBgColorFunctionObj = eval(rowBgColorFunctionStr);
        rowBgColorFunctionObj();    
    }
};

Moca.prototype.getRealRowInfo = function(trObj){
    ['get getRealRowInfo from row']
    var tbodyObj = trObj.parentElement;
    var grd = tbodyObj.parentElement.parentElement.parentElement.parentElement;
    var rowIndex = $(tbodyObj).children().index(trObj);
    
    var _realIndex = -1;
    var _startIndex = grd.getAttribute("yscrollIdx");
    if(_startIndex > -1){
        _realIndex = rowIndex +parseInt(_startIndex);
    }
    grd.setAttribute("selectedRealRowIndex",_realIndex);
    //grd.setAttribute("selectedRowIndex",rowIndex);
    return {'realRowIndex':parseInt(trObj.getAttribute("realRowIndex")),'grd':grd};
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//태그정의
Moca.prototype.getInputSelectTag = function(_label,_req){
    ['getInputSelectTag for grid cell'];
    if(_req == "true"){
        _req = "req";
    }else{
        _req = "";  
    }
    var selectTag = '<input type="text" class="moca_select '+_req+'" readonly value="'+_label+'" onclick="$m.openSelect(this)" >';//onfocus="$m._evt_selectFocus(this)"
    return selectTag;
};
Moca.prototype.getSelectDivTagForCombo = function(_label,_req,_cd,_nm,_height){
    ['getSelectDivTagForCombo for grid cell'];
    if(_req == "true"){
        _req = "req";
    }else{
        _req = "";  
    }   
    var combo_div = '<div class="moca_combo '+_req+'" style="height:'+_height+'px" cd="'+_cd+'" nm="'+_nm+'" label="'+_label+'">';
    return combo_div;
};
Moca.prototype.getSelectTagForCombo = function(_id){
    ['getSelectTagForCombo for grid cell'];
    var selectTag = '<select name="sel_tree1" id="'+('sub_'+_id)+'" class="moca_select"  onchange="$m.gridCell_selectChange(this)" onblur="$m.closeSelect(this)" >';
    return selectTag;
};

Moca.prototype.getSelectTagForNormal = function(_id,_onchange){
    ['getSelectTagForCombo'];
    var _onchange_str = "";
    if(_onchange != null){
        _onchange = _onchange.replace(/\(this\)/g,'');
    }
    _onchange_str = 'onchange="$m.defaultOnChange(this,\''+_onchange+'\')"';
    var selectTag = '<select name="sel_tree1" id="'+('sub_'+_id)+'" class="moca_select" '+_onchange_str+' >';
    return selectTag;
};

Moca.prototype.defaultOnChange = function(_thisSelectObj,_onchangeFunction){
    ['현재선택된값을 div에 저장함'];
    var cd = _thisSelectObj.selectedOptions[0].value;
    var nm = _thisSelectObj.selectedOptions[0].text;
    $(_thisSelectObj.parentElement).attr('code',cd);
    $(_thisSelectObj.parentElement).attr('label',nm);
    if($m.trim(_onchangeFunction) != ''){
    	eval(_onchangeFunction)(_thisSelectObj);
    }
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var sampleCalendar ={
        init : function(_dt,_thisObj,typeIdx){
            sampleCalendar.calId = 'open';
            sampleCalendar.calendarVariable.type = typeIdx;
            
            sampleCalendar.calendarVariable.returnDateType = typeIdx;
            
            var d = new Date();
            var nowtime = d.getFullYear();
            nowtime += comLib.gfn_toTwoChar(d.getDate());
            nowtime += comLib.gfn_toTwoChar(d.getMonth()+1);
            nowtime += comLib.gfn_toTwoChar(d.getHours());
            nowtime += comLib.gfn_toTwoChar(d.getMinutes());
            nowtime += comLib.gfn_toTwoChar(d.getSeconds());
            nowtime += d.getMilliseconds();
            nowtime += d.getDay();
            
            var messageboxId = "INPUTCAL_"+nowtime;
            sampleCalendar.calendarVariable.id = messageboxId;
            var tmp = document.createElement( 'div' );
            
            tmp.setAttribute("id",messageboxId);
            tmp.setAttribute("class","moca_calendar");
            tmp.setAttribute("role","calendar");
            
            var calHtml = '';
            //calHtml +='                   <div class="moca_calendar" role="calendar" id="'+messageboxId+'">                                                                                                                                      ';
            calHtml +='                     <div class="moca_calendar_header">                                                                                                                                           ';
            calHtml +='                         <button type="button" class="moca_calendar_btn_prev" calendarId="' + messageboxId + '">이전</button>                                                                                                ';
            calHtml +='                             <button type="button" class="moca_calendar_dynamic" calendarId="' + messageboxId + '">                                                                                                              ';
            calHtml +='                                 <span class="moca_calendar_year">2019년</span>                                                                                                                   ';  
            calHtml +='                                 <span class="moca_calendar_month">8월</span>                                                                                                                     ';
            calHtml +='                             </button>                                                                                                                                                           ';
            calHtml +='                         <button type="button" class="moca_calendar_btn_next" calendarId="' + messageboxId + '">다음</button>                                                                                                      ';
            calHtml +='                     </div>                                                                                                                                                                       ';
            calHtml +='                     <div class="moca_calendar_body">                                                                                                                                             ';
            
            //달력 layout 추가
            calHtml += sampleCalendar.calendarLayout(sampleCalendar.calendarVariable.type);
                
            calHtml +='                     </div>                                                                                                                                                                       ';
            calHtml +='                     <div class="moca_calendar_footer">                                                                                                                                           ';
            calHtml +='                         <div class="lta">                                                                                                                                                        ';
            calHtml +='                             <button class="moca_calendar_btn_today" calendarId="' + messageboxId + '">오늘</button>                                                                                                                 ';
            calHtml +='                         </div>                                                                                                                                                                   ';
            calHtml +='                         <div class="rta">                                                                                                                                                        ';
            calHtml +='                             <button class="moca_calendar_btn_cancel">취소</button>                                                                                                                ';
            calHtml +='                         </div>                                                                                                                                                                   ';
            calHtml +='                     </div>                                                                                                                                                                       ';
            //calHtml +='                   </div>                                                                                                                                                                           ';
            tmp.innerHTML = calHtml;
            $(_thisObj).closest('div[type="inputCalendar"]').append(tmp);
            //document.body.appendChild(tmp);
            
            sampleCalendar.calendarVariable.obj = $('#' +messageboxId);
                    
            //document.body.innerHTML += calHtml;
            var _t = $(_thisObj).prev().offset().top;
            var _l = $(_thisObj).prev().offset().left;
            var _h = $(_thisObj).prev().height();
            //$('#'+messageboxId).css('top',(_t+_h)).css('left',_l);
            
            sampleCalendar.calendarVariable.putObj = $(_thisObj).prev();
            //sampleCalendar.iptId = $(_thisObj).prev().attr('id');

            if($m.getDevice() != "pc"){
            	$(tmp).addClass('vertical');
            	var _width = $(tmp).width();
            	var _height = $(tmp).height();
                var top = (document.body.offsetHeight/2) - (parseInt(_height)/2) + $(document).scrollTop();
                var left = (document.body.offsetWidth/2) - (parseInt(_width)/2) + $(document).scrollLeft();
                _t = top;
                _l = left;
                $(tmp).css('position','fixed');
                $(tmp).css('top',(_t)).css('left',_l);
            }
            
            //_thisObj
            let tempId = $('#'+messageboxId).find(".moca_calendar_btn_prev").attr("calendarId");

            if(_dt == null || comLib.gfn_trim(_dt) == ""){
                var now = new Date();
                var y = now.getFullYear();
                var m = comLib.gfn_toTwoChar(now.getMonth()+1);
                var d = comLib.gfn_toTwoChar(now.getDate());
                
                sampleCalendar.calendarVariable.dateArray.year = y;
                sampleCalendar.calendarVariable.dateArray.month = m;
                sampleCalendar.calendarVariable.dateArray.date = d;

            }else{
                let tempArr = _dt.split('-');
                
                let y = tempArr[0];
                let m = tempArr[1];
                let d = tempArr[2];
                
                sampleCalendar.calendarVariable.dateArray.year = y;
                sampleCalendar.calendarVariable.dateArray.month = m;
                sampleCalendar.calendarVariable.dateArray.date = d;
                
                sampleCalendar.calendarVariable.selectDay = _dt;
                
                
            }
            
            sampleCalendar.dateViewSetting($('#'+sampleCalendar.calendarVariable.id).find(".moca_calendar_btn_prev"), sampleCalendar.calendarVariable);
                
            sampleCalendar.initEvent(sampleCalendar.calendarVariable.id);
        },
        calendarVariable :{
            id : "",
            obj : "",
            putObj : "",
            selectDay : "",
            dateArray : {
                year : "",
                month : "",
                date : "",
            },
            type : 0,
            //type
            /*  0 : 날짜 선택형
             *  1 : 달 선택형
             *  2 : 년 선택형
             */
            returnDateType : 0,
            /*  0 : 날짜 선택형
             *  1 : 달 선택형
             *  2 : 년 선택형
             */
        },
        calendarVariableResset : function(){
            sampleCalendar.calendarVariable.id = "";
            sampleCalendar.calendarVariable.obj = "";
            sampleCalendar.calendarVariable.putObj = "";
            sampleCalendar.calendarVariable.selectDay = "";
            sampleCalendar.calendarVariable.dateArray.year = "";
            sampleCalendar.calendarVariable.dateArray.month = "";
            sampleCalendar.calendarVariable.dateArray.date = "",
            sampleCalendar.calendarVariable.type = 0;
        },
        dateSetting : function(calendarVariable, callBackFunc,callBackFunc2, objIndex){
            //callBackFunc : 날짜 화면에 세팅하는 함수
            let calObj = calendarVariable.obj;
            //let _dt   = calendarVariable.dateArray.year + calendarVariable.dateArray.month + calendarVariable.dateArray.date;
            let type = calendarVariable.type;
            //type
            /*  0 : 날짜 선택형
             *  1 : 달 선택형
             *  2 : 년 선택형
             */
            //기본 레이아웃 세팅
            calObj.find(".moca_calendar_body").html("");
            
            calObj.find(".moca_calendar_body").html(sampleCalendar.calendarLayout(calendarVariable.type));
            
            let tempId = sampleCalendar.calId;
            
            //날짜 확인후 없으면 날짜값 체워서 리턴
            //_dt = callBackFunc(_dt,index);
            
            let _dt_year = calendarVariable.dateArray.year;
            let _dt_month = calendarVariable.dateArray.month;
            let _dt_day = calendarVariable.dateArray.date;
            
            switch (type) {
              case 0 :
                
                var calendarDateStr = _dt_year + _dt_month + "01";
                var monthDayCnt = comLib.gfn_getLastDayOfMonth(calendarDateStr);
                var beforMonthDayCnt = comLib.gfn_getLastDayOfMonth(comLib.gfn_addMonth(calendarDateStr,1,"-"));
                
                var weekNo = comLib.gfn_getWeek(calendarDateStr);
                
                var calendarHtml = "";
                var dayCnt = 1;
                var overDayCnt = 1;
                
                calObj.find("tbody:first").children("tr").each(function(index1, item1){
                    $(this).children("td").each(function(index2, item2){
                        let calendarTdHtml = "";

                        $(this).removeClass();
                        $(this).removeAttr();
                        
                        if(index1 == 0){
                            //전달 일자 출력

                            if(index2 < weekNo){
                                calendarTdHtml = beforMonthDayCnt - (weekNo - index2 - 1);
                                $(this).attr("index",beforMonthDayCnt - (weekNo - index2 - 1));
                                $(this).attr("aria-hidden",true);
                                $(this).addClass('moca_calendar_holiday moca_calendar_date_disabled moca_calendar_date_prev_month');
                                
                                
                            }else{// 이번달 일자 출력
                                //일요일 일때
                                if(index2 == 0){
                                    $(this).addClass('moca_calendar_holiday');
                                }
                                //calendarTdHtml = '<button aria-pressed="false" type="button"  onclick="$m.iptCalSelect('+calendarVariable.id+','+calendarVariable.putObj+','+(_dt_yaer + _dt_month + comLib.gfn_toTwoChar(dayCnt))+')" >' + dayCnt + '</button>';
                                calendarTdHtml = '<button aria-pressed="false" type="button" >' + dayCnt + '</button>';
                                $(this).attr("index",dayCnt);
                                dayCnt++;
                                
                            }
        
                        }else{
                            
                            if(dayCnt <= monthDayCnt){
                                if(index2 == 0){
                                    $(this).addClass('moca_calendar_holiday');
                                }
                                //calendarTdHtml = '<button aria-pressed="false" type="button" onclick="$m.iptCalSelect('+calendarVariable.id+','+calendarVariable.putObj+','+(_dt_yaer + _dt_month + comLib.gfn_toTwoChar(dayCnt))+')" >' + dayCnt + '</button>';
                                calendarTdHtml = '<button aria-pressed="false" type="button" >' + dayCnt + '</button>';
                                $(this).attr("index",dayCnt);
                                dayCnt++;

                            }else{
                                calendarTdHtml = overDayCnt;
                                $(this).attr("index",overDayCnt);
                                $(this).addClass('moca_calendar_date_disabled moca_calendar_date_next_month');
                                $(this).attr("aria-hidden",true);
                                
                                overDayCnt++;
                            }
                            
                        }
        
                        $(this).html(calendarTdHtml);
                    });
                });

                break;
              case 1 :
                  //기본 레이아웃 상태로 나오면 됨     
                  
                  
                  break;
              case 2 :
                  //년도 데이터로 수정
                  calObj.find(".moca_calendar_body").find("button").each(function(index1, item1){
                      $(this).parent().attr("index", Number(_dt_year) + Number(index1) - 11);
                      $(this).text(Number(_dt_year) + Number(index1) - 11);
                  });
                  
                  break;
            }
            
            sampleCalendar.calendarMonthYearBtnEventSetting(calendarVariable,callBackFunc,callBackFunc2, objIndex);
            
            
            sampleCalendar.toDaySetting(calendarVariable);
            
        },
        toDaySetting : function(calendarVariable){
            var now = new Date();
            
            let year= now.getFullYear();
            let mon = comLib.gfn_toTwoChar((now.getMonth()+1));
            let day = comLib.gfn_toTwoChar(now.getDate());
            
            let y = "";
            let m = "";
            let d = "";
            
            if(calendarVariable.selectDay != ""){
                let tempArr = calendarVariable.selectDay.split('-');
                
                y = tempArr[0];
                m = tempArr[1];
                d = tempArr[2];
            }
            
            
            let tempType = calendarVariable.type;
            
            switch (calendarVariable.type) {
                case 0 :

                    if(calendarVariable.dateArray.year == year && calendarVariable.dateArray.month == mon){
                        $(calendarVariable.obj).find("td[index="+day+"]").addClass("moca_calendar_today");

                    }
                    
                    if(calendarVariable.dateArray.year == y && calendarVariable.dateArray.month == m){
                        $(calendarVariable.obj).find("td[index="+Number(d)+"]").addClass("moca_calendar_selected");

                    }
                    break;
                case 1 :
                    if(calendarVariable.dateArray.year == year){
                        var today = Number(calendarVariable.dateArray.date);
                        $(calendarVariable.obj).find("li").each(function(index2, item2){
                            let tempMonthVal =  comLib.gfn_toTwoChar($(this).find("button").text());
                            
                            if(tempMonthVal == mon){
                                $(this).addClass("active");
                            }
                        });

                    }
                    break;
                case 2 :
                    var today = Number(calendarVariable.dateArray.date);
                    $(calendarVariable.obj).find("li").each(function(index2, item2){
                        let tempYearVal = $(this).find("button").text();

                        if(tempYearVal == year){
                            $(this).addClass("active");
                        }
                    });

                    
                break;
            }
            
        },
        dateViewSetting : function(that, calendarVariable){
            //type
            /*  0 : 날짜 선택형
             *  1 : 달 선택형
             *  2 : 년 선택형
             */
            switch (calendarVariable.type) {
              case 0 :
                  $(that).siblings(".moca_calendar_dynamic").find(".moca_calendar_month").data("month",calendarVariable.dateArray.month);
                  $(that).siblings(".moca_calendar_dynamic").find(".moca_calendar_year").data("year", calendarVariable.dateArray.year);
                  $(that).siblings(".moca_calendar_dynamic").find(".moca_calendar_month ").text(Number(calendarVariable.dateArray.month)+"월");
                  $(that).siblings(".moca_calendar_dynamic").find(".moca_calendar_year").text(calendarVariable.dateArray.year+"년" );
                  break;
              case 1 :
                  $(that).siblings(".moca_calendar_dynamic").find(".moca_calendar_month").data("month",calendarVariable.dateArray.month);
                  $(that).siblings(".moca_calendar_dynamic").find(".moca_calendar_year").data("year", calendarVariable.dateArray.year);
                  $(that).siblings(".moca_calendar_dynamic").find(".moca_calendar_month ").text("");
                  $(that).siblings(".moca_calendar_dynamic").find(".moca_calendar_year").text(calendarVariable.dateArray.year+"년" );
                  break;
              case 2 :
                  $(that).siblings(".moca_calendar_dynamic").find(".moca_calendar_month").data("month",calendarVariable.dateArray.month);
                  $(that).siblings(".moca_calendar_dynamic").find(".moca_calendar_year").data("year", calendarVariable.dateArray.year);
                  $(that).siblings(".moca_calendar_dynamic").find(".moca_calendar_month ").text("");
                  $(that).siblings(".moca_calendar_dynamic").find(".moca_calendar_year").text(Number(Number(calendarVariable.dateArray.year)-11) +"년 - " +calendarVariable.dateArray.year+"년" );
                  break;
            }
            sampleCalendar.dateSetting(sampleCalendar.calendarVariable,sampleCalendar.dateViewSetting, sampleCalendar.calendarDateBtnEventSetting);
        },
        initEvent : function(calendarId){
            //다음달
            $("#"+calendarId).find(".moca_calendar_btn_next").off("click").on("click",function(){
                event.stopPropagation();
                
                let monthStr = Number(sampleCalendar.calendarVariable.dateArray.month);
                let yearStr = Number(sampleCalendar.calendarVariable.dateArray.year);
                
                switch (sampleCalendar.calendarVariable.type) {
                    case 0 :
                        monthStr += 1;
                        if(monthStr > 12){
                            monthStr = 1;
                            yearStr = Number(yearStr)+1;
                        }           

                      break;
                    case 1 :
                        //다음년도
                        //yearStr = Number(yearStr)+ 1;
                        yearStr += 1;
                        break;
                    case 2 :
                        //12년 후
                        yearStr = Number(yearStr) + 12;
                        break;
                }
                
                //날짜 저장
                sampleCalendar.calendarVariable.dateArray.year =    yearStr;
                sampleCalendar.calendarVariable.dateArray.month = monthStr;
                
                sampleCalendar.dateViewSetting(this,sampleCalendar.calendarVariable);
            });
            //이전달
            $("#"+calendarId).find(".moca_calendar_btn_prev").off("click").on("click",function(){
                event.stopPropagation();
                

                let monthStr = Number(sampleCalendar.calendarVariable.dateArray.month);
                let yearStr = Number(sampleCalendar.calendarVariable.dateArray.year);
                switch (sampleCalendar.calendarVariable.type) {
                    case 0 :
                        monthStr -= 1;
                        if(monthStr < 1){
                            monthStr = 12;
                            yearStr = Number(yearStr)-1;
                        }           

                      break;
                    case 1 :
                        //다음년도
                        //yearStr = Number(yearStr) - 1;
                        yearStr -=  1;

                        break;
                    case 2 :
                        //12년 후
                        yearStr = Number(yearStr)- 12;
                        break;
                }
                
                //날짜 저장
                sampleCalendar.calendarVariable.dateArray.year =    yearStr;
                sampleCalendar.calendarVariable.dateArray.month = monthStr;
                
                sampleCalendar.dateViewSetting(this,sampleCalendar.calendarVariable);
            });
            
            
            //날짜 뷰
            $("#"+calendarId).find(".moca_calendar_dynamic").off("click").on("click",function(){
                event.stopPropagation();
                let tempType = sampleCalendar.calendarVariable.type;
                
                if(tempType < 2){
                    tempType++;
                    
                    sampleCalendar.calendarVariable.type = tempType;
                    
                    let tempId = $(this).attr("calendarId");
                    sampleCalendar.dateViewSetting($('#'+tempId).find(".moca_calendar_btn_prev"), sampleCalendar.calendarVariable);
                }
                
                
            });
            //오늘
            $("#"+calendarId).find(".moca_calendar_btn_today").off("click").on("click",function(){
                event.stopPropagation();
                var now = new Date();
                let tempId = $(this).attr("calendarId");
                
                sampleCalendar.calendarVariable.type = 0;

                sampleCalendar.calendarVariable.dateArray.year = now.getFullYear();
                sampleCalendar.calendarVariable.dateArray.month = comLib.gfn_toTwoChar(now.getMonth()+1);
                
                sampleCalendar.dateViewSetting($("#"+tempId).find(".moca_calendar_btn_prev"), sampleCalendar.calendarVariable);
                sampleCalendar.calendarDateBtnEventSetting(sampleCalendar.calendarVariable,now.getDate(), null);
                sampleCalendar.calId = null;    
            });
            //취소
           
            $("#"+calendarId).find(".moca_calendar_btn_cancel").off("click").on("click",function(_thisobj){
                event.stopPropagation();
                var _calId = $(this).closest('div[role="calendar"]').attr('id');
                $m.closeCalendar($('#'+_calId));
                //$m.closeMultiCalendar($('#'+calendarId));
            })
        },
        calendarLayout : function (type){
            let layoutHtml = "";
            //type
            /*  0 : 날짜 선택형
             *  1 : 달 선택형
             *  2 : 년 선택형
             */
            switch (type) {
              case 0 :
                  layoutHtml +='                            <table cellpadding="0" cellspacing="0" >                                                                                                                                 ';
                  layoutHtml +='                                <caption>원하는 날짜를 선택하는 달력 목록</caption>                                                                                                                           ';
                    layoutHtml +='                              <thead>                                                                                                                                                              ';
                    layoutHtml +='                                  <tr>                                                                                                                                                             ';
                    layoutHtml +='                                      <th id="sun" class="sun" scope="col">일</th>                                                                                                                  ';
                    layoutHtml +='                                      <th id="mon" class="mon" scope="col">월</th>                                                                                                                  ';
                    layoutHtml +='                                      <th id="tue" class="tue" scope="col">화</th>                                                                                                                  ';
                    layoutHtml +='                                      <th id="wed" class="wed" scope="col">수</th>                                                                                                                  ';
                    layoutHtml +='                                      <th id="thu" class="thu" scope="col">목</th>                                                                                                                  ';
                    layoutHtml +='                                      <th id="fri" class="fri" scope="col">금</th>                                                                                                                  ';
                    layoutHtml +='                                      <th id="sat" class="sat" scope="col">토</th>                                                                                                                  ';
                    layoutHtml +='                                  </tr>                                                                                                                                                            ';
                    layoutHtml +='                              </thead>                                                                                                                                                             ';
                    layoutHtml +='                              <tbody id="calendarBody">                                                                                                                                            ';
                    layoutHtml +='                                  <tr>                                                                                                                                                             ';
                    layoutHtml +='                                      <td index="30" class="moca_calendar_holiday moca_calendar_date_disabled moca_calendar_date_prev_month" aria-hidden="true">30</td>                            ';
                    layoutHtml +='                                      <td index="1"><button aria-pressed="false" type="button"></button></td>                                                                                      ';
                    layoutHtml +='                                      <td index="2"><button aria-pressed="false" type="button"></button></td>                                                                                      ';
                    layoutHtml +='                                      <td index="3"><button aria-pressed="false" type="button"></button></td>                                                                                      ';
                    layoutHtml +='                                      <td index="4"><button aria-pressed="false" type="button"></button></td>                                                                                      ';
                    layoutHtml +='                                      <td index="5"><button aria-pressed="false" type="button"></button></td>                                                                                      ';
                    layoutHtml +='                                      <td index="6"><button aria-pressed="false" type="button"></button></td>                                                                                      ';
                    layoutHtml +='                                  </tr>                                                                                                                                                            ';
                    layoutHtml +='                                  <tr>                                                                                                                                                             ';
                    layoutHtml +='                                      <td class="moca_calendar_holiday" index="7"><button aria-pressed="false" type="button">7</button></td>                                                       ';
                    layoutHtml +='                                      <td index="8"><button aria-pressed="false" type="button"></button></td>                                                                                      ';
                    layoutHtml +='                                      <td index="9"><button aria-pressed="false" type="button"></button></td>                                                                                      ';
                    layoutHtml +='                                      <td index="10"><button aria-pressed="false" type="button"></button></td>                                                                                     ';
                    layoutHtml +='                                      <td index="11"><button aria-pressed="false" type="button"></button></td>                                                                                     ';
                    layoutHtml +='                                      <td index="12"><button aria-pressed="false" type="button"></button></td>                                                                                     ';
                    layoutHtml +='                                      <td index="13"><button aria-pressed="false" type="button"></button></td>                                                                                     ';
                    layoutHtml +='                                  </tr>                                                                                                                                                            ';
                    layoutHtml +='                                  <tr>                                                                                                                                                             ';
                    layoutHtml +='                                      <td class="moca_calendar_holiday" index="14"><button aria-pressed="false" type="button">14</button></td>                                                     ';
                    layoutHtml +='                                      <td index="15"><button aria-pressed="false" type="button"></button></td>                                                                                     ';
                    layoutHtml +='                                      <td index="16"><button aria-pressed="false" type="button"></button></td>                                                                                     ';
                    layoutHtml +='                                      <td index="17"><button aria-pressed="false" type="button"></button></td>                                                                                     ';
                    layoutHtml +='                                      <td index="18"><button aria-pressed="false" type="button"></button></td>                                                                                     ';
                    layoutHtml +='                                      <td index="19"><button aria-pressed="false" type="button"></button></td>                                                                                     ';
                    layoutHtml +='                                      <td index="20"><button aria-pressed="false" type="button"></button></td>                                                                                     ';
                    layoutHtml +='                                  </tr>                                                                                                                                                            ';
                    layoutHtml +='                                  <tr>                                                                                                                                                             ';
                    layoutHtml +='                                      <td class="moca_calendar_holiday" index="21"><button aria-pressed="false" type="button">21</button></td>                                                     ';
                    layoutHtml +='                                      <td index="22"><button aria-pressed="false" type="button"></button></td>                                                                                     ';
                    layoutHtml +='                                      <td index="23"><button aria-pressed="false" type="button"></button></td>                                                                                     ';
                    layoutHtml +='                                      <td index="24"><button aria-pressed="false" type="button"></button></td>                                                                                     ';
                    layoutHtml +='                                      <td index="25"><button aria-pressed="false" type="button"></button></td>                                                                                     ';
                    layoutHtml +='                                      <td index="26"><button aria-pressed="false" type="button"></button></td>                                                                                     ';
                    layoutHtml +='                                      <td index="27"><button aria-pressed="false" type="button"></button></td>                                                                                     ';
                    layoutHtml +='                                  </tr>                                                                                                                                                            ';
                    layoutHtml +='                                  <tr>                                                                                                                                                             ';
                    layoutHtml +='                                      <td class="moca_calendar_holiday" index="28"><button aria-pressed="true" type="button" title="오늘">28</button></td>                      ';
                    layoutHtml +='                                      <td class="moca_calendar_selected" index="29"><button aria-pressed="false" type="button" title="선택일">29</button></td>                                       ';
                    layoutHtml +='                                      <td index="30"><button aria-pressed="false" type="button"></button></td>                                                                                     ';
                    layoutHtml +='                                      <td index="31"><button aria-pressed="false" type="button"></button></td>                                                                                     ';
                    layoutHtml +='                                      <td class="moca_calendar_date_disabled moca_calendar_date_next_month" index="1" aria-hidden="true"></td>                                                     ';
                    layoutHtml +='                                      <td class="moca_calendar_date_disabled moca_calendar_date_next_month" index="2" aria-hidden="true"></td>                                                     ';
                    layoutHtml +='                                      <td class="moca_calendar_date_disabled moca_calendar_date_next_month" index="3" aria-hidden="true"></td>                                                     ';
                    layoutHtml +='                                  </tr>                                                                                                                                                            ';
                    layoutHtml +='                                  <tr>                                                                                                                                                             ';
                    layoutHtml +='                                      <td class="moca_calendar_holiday moca_calendar_date_disabled moca_calendar_date_next_month" index="4" aria-hidden="true"></td>                               ';
                    layoutHtml +='                                      <td class="moca_calendar_date_disabled moca_calendar_date_next_month" index="5" aria-hidden="true"></td>                                                     ';
                    layoutHtml +='                                      <td class="moca_calendar_date_disabled moca_calendar_date_next_month" index="6" aria-hidden="true"></td>                                                     ';
                    layoutHtml +='                                      <td class="moca_calendar_date_disabled moca_calendar_date_next_month" index="7" aria-hidden="true"></td>                                                     ';
                    layoutHtml +='                                      <td class="moca_calendar_date_disabled moca_calendar_date_next_month" index="8" aria-hidden="true"></td>                                                     ';
                    layoutHtml +='                                      <td class="moca_calendar_date_disabled moca_calendar_date_next_month" index="9" aria-hidden="true"></td>                                                     ';
                    layoutHtml +='                                      <td class="moca_calendar_date_disabled moca_calendar_date_next_month" index="10" aria-hidden="true"></td>                                                    ';
                    layoutHtml +='                                  </tr>                                                                                                                                                            ';
                    layoutHtml +='                              </tbody>                                                                                                                                                             ';
                    layoutHtml +='                          </table>                                                                                                                                                                 ';
                  break;
              case 1 :
                  layoutHtml += '<ul class="moca_calendar_picgrp">';
                  layoutHtml += '       <li class="moca_calendar_item" index="1">';
                  layoutHtml += '           <button type="button">1</button>';
                  layoutHtml += '       </li>';
                  layoutHtml += '       <li class="moca_calendar_item" index="2">';
                  layoutHtml += '           <button type="button">2</button>';
                  layoutHtml += '       </li>';
                  layoutHtml += '       <li class="moca_calendar_item" index="3">';
                  layoutHtml += '           <button type="button">3</button>';
                  layoutHtml += '       </li>';
                  layoutHtml += '       <li class="moca_calendar_item" index="4">';
                  layoutHtml += '           <button type="button">4</button>';
                  layoutHtml += '       </li>';
                  layoutHtml += '       <li class="moca_calendar_item" index="5">';
                  layoutHtml += '           <button type="button">5</button>';
                  layoutHtml += '       </li>';
                  layoutHtml += '       <li class="moca_calendar_item" index="6">';
                  layoutHtml += '           <button type="button">6</button>';
                  layoutHtml += '       </li>';
                  layoutHtml += '       <li class="moca_calendar_item" index="7">';
                  layoutHtml += '           <button type="button">7</button>';
                  layoutHtml += '       </li>';
                  layoutHtml += '       <li class="moca_calendar_item" index="8">';
                  layoutHtml += '           <button type="button">8</button>';
                  layoutHtml += '       </li>';
                  layoutHtml += '       <li class="moca_calendar_item" index="9">';
                  layoutHtml += '           <button type="button">9</button>';
                  layoutHtml += '       </li>';
                  layoutHtml += '       <li class="moca_calendar_item" index="10">';
                  layoutHtml += '           <button type="button">10</button>';
                  layoutHtml += '       </li>';
                  layoutHtml += '       <li class="moca_calendar_item" index="11">';
                  layoutHtml += '           <button type="button">11</button>';
                  layoutHtml += '       </li>';
                  layoutHtml += '       <li class="moca_calendar_item" index="12">';
                  layoutHtml += '           <button type="button">12</button>';
                  layoutHtml += '       </li>';
                  layoutHtml += '</ul>';
                  break;
              case 2 :
                  layoutHtml += '<ul class="moca_calendar_picgrp">';
                  layoutHtml += '       <li class="moca_calendar_item">';
                  layoutHtml += '           <button type="button">1988</button>';
                  layoutHtml += '       </li>';
                  layoutHtml += '       <li class="moca_calendar_item">';
                  layoutHtml += '           <button type="button">1989</button>';
                  layoutHtml += '       </li>';
                  layoutHtml += '       <li class="moca_calendar_item">';
                  layoutHtml += '           <button type="button">1990</button>';
                  layoutHtml += '       </li>';
                  layoutHtml += '       <li class="moca_calendar_item">';
                  layoutHtml += '           <button type="button">1991</button>';
                  layoutHtml += '       </li>';
                  layoutHtml += '       <li class="moca_calendar_item">';
                  layoutHtml += '           <button type="button">1992</button>';
                  layoutHtml += '       </li>';
                  layoutHtml += '       <li class="moca_calendar_item">';
                  layoutHtml += '           <button type="button">1993</button>';
                  layoutHtml += '       </li>';
                  layoutHtml += '       <li class="moca_calendar_item">';
                  layoutHtml += '           <button type="button">1994</button>';
                  layoutHtml += '       </li>';
                  layoutHtml += '       <li class="moca_calendar_item">';
                  layoutHtml += '           <button type="button">1995</button>';
                  layoutHtml += '       </li>';
                  layoutHtml += '       <li class="moca_calendar_item">';
                  layoutHtml += '           <button type="button">1996</button>';
                  layoutHtml += '       </li>';
                  layoutHtml += '       <li class="moca_calendar_item">';
                  layoutHtml += '           <button type="button">1997</button>';
                  layoutHtml += '       </li>';
                  layoutHtml += '       <li class="moca_calendar_item">';
                  layoutHtml += '           <button type="button">1998</button>';
                  layoutHtml += '       </li>';
                  layoutHtml += '       <li class="moca_calendar_item">';
                  layoutHtml += '           <button type="button">1999</button>';
                  layoutHtml += '       </li>';
                  layoutHtml += '</ul>';
                  break;

            }
            
            return layoutHtml;
        },calendarMonthYearBtnEventSetting : function(calendarVariable, callBackFunc, callBackFunc2, objIndex){
            /*
             * callBackFunc : 화면 출력 날짜 수정 함수
             * callBackFunc2 : 일 달력 클릭 이벤트
             */ 
            if(calendarVariable.type == 0){
                $(calendarVariable.obj).find(".moca_calendar_body").find("table").find("td").off("click").on("click",function(){
                    event.stopPropagation();
                    //선택한 일자 리턴
                    callBackFunc2(calendarVariable,$(this).find("button").text(), objIndex);
                    sampleCalendar.calId = null;
                });
            }else{
                $(calendarVariable.obj).find(".moca_calendar_body").find("li").off("click").on("click",function(){
                    event.stopPropagation();
                    switch (calendarVariable.type) {
                        case 1 :
                            //월 달력일 때 이벤트 세팅
                            event.stopPropagation();
                            
                            //클릭한 월로 달력이동
                            calendarVariable.dateArray.month = comLib.gfn_toTwoChar($(this).text());

                            if(calendarVariable.returnDateType == 1){
                                callBackFunc($(calendarVariable.obj).find(".moca_calendar_btn_prev"), calendarVariable, objIndex);
                                //선택한 일자 리턴
                                callBackFunc2(calendarVariable,$(this).find("button").text(), objIndex);
                            }else{
                                calendarVariable.type -= 1;
                                
                                
                                
                                //다른 타입 달력으로 번경
                                callBackFunc($(calendarVariable.obj).find(".moca_calendar_btn_prev"), calendarVariable, objIndex);
                            }
                            break;
                        case 2 :
                            //년 달력일 때 이벤트 세팅
                            event.stopPropagation();
                            //클릭연 년으로 달력이동
                            calendarVariable.dateArray.year = $(this).text();
                            
                            if(calendarVariable.returnDateType == 2){
                                callBackFunc($(calendarVariable.obj).find(".moca_calendar_btn_prev"), calendarVariable, objIndex);
                                //선택한 일자 리턴
                                callBackFunc2(calendarVariable,$(this).find("button").text(), objIndex);
                            }else{
                                calendarVariable.type -= 1;
                                
                                //sampleCalendar.dateViewSetting($(calendarVariable.obj).find(".moca_calendar_btn_prev"), calendarVariable.dateArray.year, calendarVariable.dateArray.month);
                                callBackFunc($(calendarVariable.obj).find(".moca_calendar_btn_prev"), calendarVariable, objIndex);
                            }
                        break;
                    }           
                });
            }
        },calendarDateBtnEventSetting : function(calendarVariable,dateStr, objIndex){
            let returnDateVal = "";
            if(calendarVariable.returnDateType == 0){
                returnDateVal = (calendarVariable.dateArray.year+'').replace(/\s/g,'')+ "-" +comLib.gfn_toTwoChar($m.trim(calendarVariable.dateArray.month+"").replace(/\s/g,''))+ "-" +comLib.gfn_toTwoChar(dateStr+"".replace(/\s/g,''));
            }else if(calendarVariable.returnDateType == 1){
                returnDateVal = (calendarVariable.dateArray.year+'').replace(/\s/g,'')+ "-" +comLib.gfn_toTwoChar($m.trim(calendarVariable.dateArray.month+"").replace(/\s/g,'')); 
            }else{
                returnDateVal = (calendarVariable.dateArray.year+'').replace(/\s/g,'');
            }
            $(calendarVariable.putObj).val(returnDateVal);
            
            var ondateSelectedFuncStr = calendarVariable.putObj.closest("[type=inputCalendar]").attr('ondateSelected');
            if($m.trim(ondateSelectedFuncStr) != ''){
                eval(ondateSelectedFuncStr)(returnDateVal);
            }
            $m.closeCalendar($('#'+calendarVariable.id));
            sampleCalendar.calendarVariableResset();
        }
        ,calendarGoToday : function(calendarVariable,dateStr, objIndex){
            let returnDateVal = "";
            if(calendarVariable.returnDateType == 0){
                returnDateVal = (calendarVariable.dateArray.year+'').replace(/\s/g,'')+ "-" +comLib.gfn_toTwoChar($m.trim(calendarVariable.dateArray.month+"").replace(/\s/g,''))+ "-" +comLib.gfn_toTwoChar(dateStr+"".replace(/\s/g,''));
            }else if(calendarVariable.returnDateType == 1){
                returnDateVal = (calendarVariable.dateArray.year+'').replace(/\s/g,'')+ "-" +comLib.gfn_toTwoChar($m.trim(calendarVariable.dateArray.month+"").replace(/\s/g,'')); 
            }else{
                returnDateVal = (calendarVariable.dateArray.year+'').replace(/\s/g,'');
            }
            $(calendarVariable.putObj).val(returnDateVal);
            
            var ondateSelectedFuncStr = calendarVariable.putObj.closest("[type=inputCalendar]").attr('ondateSelected');
            if($m.trim(ondateSelectedFuncStr) != ''){
                eval(ondateSelectedFuncStr)(returnDateVal);
            }
        }
    }

    var comLib = {
            gfn_isDate8 : function (strValue){
                ['주어진 날짜YYYYMMDD가 8자리문자열인지 체크하는 함수'];
                if (comLib.gfn_length(strValue) != 8)
                {
                    return false;
                }
                else if (!comLib.gfn_isDate(strValue))
                {
                    return false;
                }
                return true;
            },
            gfn_isTime4 : function (strValue){
                ['주어진 시간 HHMM이 4자리문자열인지 체크하는 함수'];
                if (comLib.gfn_length(strValue) != 4)
                {
                    return false;
                }
                else if (!comLib.gfn_isTime(strValue))
                {
                    return false;
                }
                return true;
            },

            /**
             * @class 시간에 대한 형식 체크
             * @param {string} sTime   검사시간
             * @return {boolean} true/false 유효성반환 (시간형식이 아닐경우 FLASE)
             */
            gfn_isTime : function (sTime){
                var timeRegExp = /^([1-9]|[01][0-9]|2[0-3])([0-5][0-9])$/;
                return timeRegExp.test(sTime);
            },

            /**
             * @class 날짜에 대한 형식 체크
             * @param {string} sFdate   검사일자
             * @return {boolean} true/false 유효성반환 (날짜형식이 아닐경우 FLASE)
             */
            gfn_isDate : function (sDate){
                ['날짜가 유효한 형식인지 체크하는 함수'];
                var stringWrapper = new String(sDate);
                stringWrapper = stringWrapper.replace("/","").replace("/","");
                stringWrapper = stringWrapper.replace("-","").replace("-","");
                stringWrapper = stringWrapper.replace(".","").replace(".","");

                if( stringWrapper.toString().length !== 8 ) return false;

                var iMonth  = Math.floor(stringWrapper.slice(4,6), 10);
                var iDate   = Math.floor(stringWrapper.slice(6,8), 10);

                if( iMonth < 1 || iMonth > 12 ) return false;
                if( iDate < 1 || iDate > comLib.gfn_getLastDateNum(stringWrapper) ) return false;

                return true;
            },
            /**
             * @class 해당월의 마지막 날짜를 숫자로 구하기
             * @param sDate : yyyyMMdd형태의 날짜 ( 예 : "20161122" )
             * @return 마지막 날짜 숫자값 ( 예 : 30 , 실패 = -1)
             */
            gfn_getLastDateNum : function (sDate) {
                ['주어진 날짜YYYYMMDD 해당월의 마지막 날짜를 숫자로 리턴하는 함수'];
                var nMonth,nLastDate;

                if (comLib.gfn_isNull(sDate))
                {
                    return -1;
                }

                nMonth = parseInt(sDate.substr(4, 2), 10);
                if (nMonth == 1 || nMonth == 3 || nMonth == 5 || nMonth == 7 || nMonth == 8 || nMonth == 10 || nMonth == 12)
                {
                    nLastDate = 31;
                }
                else if (nMonth == 2)
                {
                    if (comLib.gfn_isLeapYear(sDate) == true)
                    {
                        nLastDate = 29;
                    }
                    else
                    {
                        nLastDate = 28;
                    }
                }
                else
                {
                    nLastDate = 30;
                }

                return nLastDate;
            },
            /*
             * 날짜연산
             * comLib.gfn_addDate('20190103', 30,'-');
             */
            gfn_addDate : function(dateString, offset,_gubun) {
                ['YYYYMMDD를 주고 일의 offset을 주면 +- 연산하는 함수'];
                function stringToDate(dateString) {
                    return new Date(parseInt(Number(dateString.substring(0,4))),
                                    parseInt(Number(dateString.substring(4,6)))-1,
                                    parseInt(Number(dateString.substring(6,8))));
                };
                var addDays = stringToDate(dateString);
                var day = parseInt(Number(offset));
                addDays.setDate(addDays.getDate() + day);
                var _g = '';
                if(_gubun != null){
                    _g = _gubun;
                }
                return addDays.getFullYear()+_g+ comLib.gfn_toTwoChar(addDays.getMonth() + 1)+_g+ comLib.gfn_toTwoChar(addDays.getDate());
            },

            /*
             * 월연산
             */
            gfn_addMonth : function(value, offset, type,_gubun){
                ['YYYYMMDD를 주고 월의 offset을 주면 +- 연산하는 함수'];
                var y = value.substr(0, 4);
                var m = value.substr(4, 2);
                var d = value.substr(6, 2);
                var m_m;
                if(type == "+"){
                    m_m = Math.floor((parseInt(m)+parseInt(offset))/12);
                }else if(type == "-") {
                    m_m = Math.floor((parseInt(m)-parseInt(offset))/12);
                }
                
                var m_n;
                if(type == "+"){
                    m_n = (parseInt(m)+parseInt(offset))%12;
                }else if(type == "-") {
                    m_n = (parseInt(m)-parseInt(offset))%12;
                }
                
                if(m_n == 0){
                    m_m = m_m-1;
                }else{
                    if(m_n < 0){
                        m = 12+m_n;
                    }else{
                        m = m_n;
                    }

                }
                y = parseInt(y)+m_m;
                m = comLib.gfn_toTwoChar(m);
                var d_new = comLib.gfn_getLastDayOfMonth(y+''+m);
                var d_last;
                if(parseInt(d) < (parseInt(d_new)+1)){
                    d_last = d;
                }else{
                    d_last = d_new;
                }

                var gubun = _gubun;
                if(gubun == null){
                    gubun = '';
                }

                return y+gubun+comLib.gfn_toTwoChar(m)+gubun+comLib.gfn_toTwoChar(d_last);
            },
            /*
             * 해당년월의 마지막일자
             */
            gfn_getLastDayOfMonth : function(value){
                ['일자를 기준으로 그달의 마지막 일자를 리턴하는 함수'];
                var nMonth, nLastDate;
                value = comLib.gfn_trim(value)+'';
                nMonth = parseInt(value.substr(4,2), 10);

                if ( typeof value == 'string' )
                {
                    nMonth = parseInt(value.substr(4,2), 10);
                }
                else
                {
                    nMonth = value.getMonth() + 1;
                }
                if( nMonth == 1 || nMonth == 3 || nMonth == 5 || nMonth == 7  || nMonth == 8 || nMonth == 10 || nMonth == 12 )
                {
                    nLastDate = 31;
                }
                else if( nMonth == 2 )
                {
                    if( comLib.gfn_isLeapYear(value) == true )
                    {
                        nLastDate = 29;
                    }
                    else
                    {
                        nLastDate = 28;
                    }
                }
                else
                {
                    nLastDate = 30;
                }

                return nLastDate;
            },
            gfn_isLeapYear : function(value){
                ['일자가 윤년에 해당되는지 여부를 판단하는 함수'];
                var result;
                var year;
                value = value+'';
                year = parseInt(value.substring(0,4), 10);

                if ((year % 4) == 0)
                {
                    if ((year % 100) != 0 || (year % 400) == 0){
                        result = true;
                    }
                    else
                    {
                        result = false;
                    }
                }
                else
                {
                    result = false;
                }

                return result;
            },
            gfn_isNull : function (Val){
                ['입력값 null 체크 함수'];

                if(Val =='undefined' || Val == null){
                    Val = '';
                }

                if(Val == ''){
                    return true;
                }else{
                    return false;
                }
            },
            /**
             * 문자열의 좌우측 공백을 제거
             * @param {String} sOrg   : 좌우측 공백문자 제거 대상 문자열
             * @param {String} sTrim  : 제거대상 문자열(default:" ")
             * @return {String}
             */
            gfn_trim : function (sOrg, sTrim){
                ['문자열의 좌우측 공백을 제거하는 함수'];
                var rtnVal = "";

                if (comLib.gfn_isNull(sOrg)) return rtnVal;

                if (comLib.gfn_isNull(sTrim)) sTrim = " ";

                rtnVal = comLib.gfn_rTrim(sOrg, sTrim);
                rtnVal = comLib.gfn_lTrim(rtnVal, sTrim);

                return rtnVal;
            },
            /**
             * 문자열의 좌측 공백을 제거
             * @param {String} sOrg   : 좌측 공백문자 제거 대상 문자열
             * @param {String} sTrim  : 제거대상 문자열(default:" ")
             * @return {String}
             */
            gfn_lTrim : function (sOrg, sTrim){
                ['문자열의 좌측 공백을 제거하는 함수'];
                var chk,pos;

                sOrg = new String(sOrg);

                if (comLib.gfn_isNull(sOrg))
                {
                    return "";
                }
                if (comLib.gfn_isNull(sTrim))
                {
                    sTrim = " ";
                }

                for (pos = 0; pos < sOrg.length; pos += sTrim.length)
                {
                    if (sOrg.substr(pos, sTrim.length) != sTrim)
                    {
                        break;
                    }
                }

                return sOrg.substr(pos);
            },

            /**
             * 문자열의 우측 공백을 제거
             * @param {String} sOrg   : 우측 공백문자 제거 대상 문자열
             * @param {String} sTrim  : 제거대상 문자열(default:" ")
             * @return {String}
             */
            gfn_rTrim : function (sOrg, sTrim){
                ['문자열의 우측 공백을 제거하는 함수'];
                var pos,nStart;

                sOrg = new String(sOrg);

                if (comLib.gfn_isNull(sOrg))
                {
                    return "";
                }
                if (comLib.gfn_isNull(sTrim))
                {
                    sTrim = " ";
                }

                for (pos = sOrg.length - sTrim.length; pos >= 0; pos -= sTrim.length)
                {
                    if (sOrg.substr(pos, sTrim.length) != sTrim)
                    {
                        break;
                    }
                }

                return sOrg.substr(0, pos + sTrim.length);
            },
            gfn_toTwoChar : function(value) {
                ['1자리숫자를 앞에 0을 붙여 2자리 숫자로 만듬'];
                var tmp = value+'';
                if(tmp.length == 1){
                    tmp = '0'+tmp;
                }
                return tmp;
            },
            gfn_getWeek : function(date){
                var week = new Array('일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일');
                var today = new Date(date.substring(0,4)+"-"+date.substring(4,6)+"-"+date.substring(6,8)).getDay();
                var todayLabel = week[today];
                return today;
            }
    }
//multiCalendar/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var multiCalendar ={
        init : function(_opt){
            multiCalendar.opt = _opt;
            var _dt1 = _opt.from;
            var _dt2 = _opt.to;
            var _thisObj = _opt.thisObj;
            var typeIdx = _opt.calType;
            var selecterItem = _opt.selecterItem;
            var defaultValue = _opt.defaultValue;
            if(selecterItem == null){
                selecterItem = "오늘,전일,금주,전주,당월,전월,당분기,전분기,당년,전년";
            }
            var selecterItemList = selecterItem.split(',');
            
            var maxTermByMonth = _opt.maxTermByMonth;
            var maxTermByDay = _opt.maxTermByDay;
            var maxTermByYear = _opt.maxTermByYear;
            
            if(_dt1.indexOf('-') == -1){
                _dt1 = _dt1.substring(0,4)+'-'+_dt1.substring(4,6)+'-'+_dt1.substring(6,8);
            }
            if(_dt2.indexOf('-') == -1){
                _dt2 = _dt2.substring(0,4)+'-'+_dt2.substring(4,6)+'-'+_dt2.substring(6,8);
            }
            multiCalendar.calId = 'open';
            multiCalendar.calendarVariable.calArray[0].type = typeIdx;
            multiCalendar.calendarVariable.calArray[1].type = typeIdx;
            
            multiCalendar.calendarVariable.calArray[0].returnDateType = typeIdx;
            multiCalendar.calendarVariable.calArray[1].returnDateType = typeIdx;
            
            var d = new Date();
            var nowtime = d.getFullYear();
            nowtime += comLib.gfn_toTwoChar(d.getDate());
            nowtime += comLib.gfn_toTwoChar(d.getMonth()+1);
            nowtime += comLib.gfn_toTwoChar(d.getHours());
            nowtime += comLib.gfn_toTwoChar(d.getMinutes());
            nowtime += comLib.gfn_toTwoChar(d.getSeconds());
            nowtime += d.getMilliseconds();
            nowtime += d.getDay();
            
            var messageboxId = "INPUTCAL_"+nowtime;
            multiCalendar.calendarVariable.calArray[0].id = messageboxId;
            multiCalendar.calendarVariable.calArray[1].id = messageboxId;
            
            var tmp = document.createElement( 'div' );
            tmp.setAttribute("id",messageboxId);
            tmp.setAttribute("class","moca_calendar_fromto");
            tmp.setAttribute("role","calendar");
            var calHtml = '';                                                                                                                                         
            //calHtml +='<div class="moca_calendar_fromto">';
            calHtml +='     <div class="moca_calendar_lta">';
            calHtml +='         <ul class="moca_calendar_list">';
            var si_leng = selecterItemList.length;
            if(si_leng > 10){
                si_leng = 10;
            }
            for(var j=0; j < si_leng; j++){
                var sitem = selecterItemList[j];
                calHtml +='             <li  ><button type="button">'+sitem+'</button></li>';
            }
            
            /*
            calHtml +='             <li  class="active"><button type="button">오늘</button></li>';
            calHtml +='             <li  ><button type="button">전일</button></li>';
            calHtml +='             <li  ><button type="button">금주</button></li>';
            calHtml +='             <li  ><button type="button">전주</button></li>';
            calHtml +='             <li  ><button type="button">당월</button></li>';
            calHtml +='             <li  ><button type="button">전월</button></li>';
            calHtml +='             <li  ><button type="button">당분기</button></li>';
            calHtml +='             <li  ><button type="button">전분기</button></li>';
            calHtml +='             <li  ><button type="button">당년</button></li>';
            calHtml +='             <li  ><button type="button">전년</button></li>';
            */
            
            
            calHtml +='         </ul>';
            calHtml +='         <div class="moca_calendar_footer">';
            calHtml +='             <button class="moca_calendar_btn_cancel">취소</button>';
            calHtml +='             <button class="moca_calendar_btn_ok">확인</button>';
            calHtml +='         </div>';            
            calHtml +='     </div>';
            calHtml +='     <div class="moca_calendar_rta">';
            calHtml +='         <div class="moca_calendar_row">';
            
            calHtml +='             <div class="moca_calendar_fl">';
            calHtml +='                 <div class="moca_calendar" role="calendar">';
            calHtml +='                     <div class="moca_calendar_header">                                                                                                                                           ';
            calHtml +='                         <button type="button" class="moca_calendar_btn_prev" calendarId="' + messageboxId + '">이전</button>                                                                                                ';
            calHtml +='                             <button type="button" class="moca_calendar_dynamic" calendarId="' + messageboxId + '">                                                                                                              ';
            calHtml +='                                 <span class="moca_calendar_year">2019년</span>                                                                                                                   ';  
            calHtml +='                                 <span class="moca_calendar_month">8월</span>                                                                                                                     ';
            calHtml +='                             </button>                                                                                                                                                           ';
            calHtml +='                         <button type="button" class="moca_calendar_btn_next" calendarId="' + messageboxId + '">다음</button>                                                                                                      ';
            calHtml +='                     </div>                                                                                                                                                                       ';
            calHtml +='                     <div class="moca_calendar_body">';
            //calHtml += multiCalendar.calendarLayout();
            calHtml +='                     </div>';
            calHtml +='                 </div>';
            calHtml +='                 <div class="calendar_ipt"><input type="text" class="moca_input" title="시작일" value="" readonly></div>';          
            calHtml +='             </div>';
            
            calHtml +='             <div class="moca_calendar_fl">';
            calHtml +='                 <div class="moca_calendar" role="calendar">';
            calHtml +='                     <div class="moca_calendar_header">                                                                                                                                           ';
            calHtml +='                         <button type="button" class="moca_calendar_btn_prev" calendarId="' + messageboxId + '">이전</button>                                                                                                ';
            calHtml +='                             <button type="button" class="moca_calendar_dynamic" calendarId="' + messageboxId + '">                                                                                                              ';
            calHtml +='                                 <span class="moca_calendar_year">2019년</span>                                                                                                                   ';  
            calHtml +='                                 <span class="moca_calendar_month">8월</span>                                                                                                                     ';
            calHtml +='                             </button>                                                                                                                                                           ';
            calHtml +='                         <button type="button" class="moca_calendar_btn_next" calendarId="' + messageboxId + '">다음</button>                                                                                                      ';
            calHtml +='                     </div>                                                                                                                                                                       ';
            calHtml +='                     <div class="moca_calendar_body">';
            //calHtml += multiCalendar.calendarLayout();
            calHtml +='                     </div>';
            calHtml +='                 </div>';
            calHtml +='                 <div class="calendar_ipt"><input type="text" class="moca_input" title="종료일" value="" readonly></div>';          
            calHtml +='             </div>';
            
            calHtml +='         </div>';
            calHtml +=' </div>';
                                                                                                                                                                                          
            tmp.innerHTML = calHtml;
           
            _opt.target.append(tmp);
            //document.body.appendChild(tmp);
            
            multiCalendar.calendarVariable.calArray[0].obj = $("#"+multiCalendar.calendarVariable.calArray[0].id).find(".moca_calendar_fl").eq(0);
            multiCalendar.calendarVariable.calArray[1].obj = $("#"+multiCalendar.calendarVariable.calArray[1].id).find(".moca_calendar_fl").eq(1);
            
            multiCalendar.calendarVariable.calArray[0].putObj = $("#"+multiCalendar.calendarVariable.calArray[0].id).find(".moca_calendar_fl").eq(0).find(".moca_input");
            multiCalendar.calendarVariable.calArray[1].putObj = $("#"+multiCalendar.calendarVariable.calArray[1].id).find(".moca_calendar_fl").eq(1).find(".moca_input");
                    
            
            multiCalendar.calendarVariable.calViewObj = $(_thisObj).parent();

            var _t = $(_thisObj).prev().offset().top;
            var _l = $(_thisObj).prev().prev().offset().left;
            var _h = $(_thisObj).prev().height();
            /*
            if($m.getDevice() == "pc"){
            	$('#'+messageboxId).css('top',0).css('left',_l);
            }
            */
            //console.log("dt1 : ["+ _dt1 +"] dt2 : ["+ _dt2+"]");
            let tempId = $('#'+messageboxId).find(".moca_calendar_btn_prev").attr("calendarId");
            $($(".moca_calendar_lta").find(".active").children()[0]).click();//디폴터날짜입력 2020-05-24
            //_thisObj
            if(_dt1 == null || comLib.gfn_trim(_dt1) == ""){
                var now = new Date();
                var y = now.getFullYear();
                var m = comLib.gfn_toTwoChar(now.getMonth()+1);
                var d = comLib.gfn_toTwoChar(now.getDate());

                multiCalendar.calendarVariable.calArray[0].dateArray.year = y;
                multiCalendar.calendarVariable.calArray[0].dateArray.month = m;
                multiCalendar.calendarVariable.calArray[0].dateArray.date = d;
                
                
                
            }else{
            	let tempArr = _dt1.split('-');
            	if(_dt1.indexOf(':') > -1){
            		tempArr = _dt1.split(/-| |:/);
            		let hour = tempArr[3];
                    let min = tempArr[4];
                    let sec = tempArr[5];
                    multiCalendar.calendarVariable.calArray[0].dateArray.hour = hour;
                    multiCalendar.calendarVariable.calArray[0].dateArray.minute = min;
                    multiCalendar.calendarVariable.calArray[0].dateArray.second = sec;
                    $(multiCalendar.calendarVariable.calArray[0].putObj).addClass('hhmmss');
                    var hhmmssInputHtml = '';
                    hhmmssInputHtml += '<div class="hhmmss_box">'
                    hhmmssInputHtml +='<select class="cmb_hhmmss hour tac mr3" value="'+hour+'">';
                    for(var h=0; h<24; h++){
                    	if(h == hour){
                    		hhmmssInputHtml +='<option value="'+$m.lpad(h,2,0)+'" selected>'+$m.lpad(h,2,0)+'시</option>';
                    	}else{
                    		hhmmssInputHtml +='<option value="'+$m.lpad(h,2,0)+'">'+$m.lpad(h,2,0)+'시</option>';
                    	}
                    }
                    hhmmssInputHtml +='</select>';
                    
                    hhmmssInputHtml +='<select class="cmb_hhmmss minute tac mr3" value="'+min+'">';
                    for(var h=0; h<60; h++){
                    	if(h == min){
                    		hhmmssInputHtml +='<option value="'+$m.lpad(h,2,0)+'" selected>'+$m.lpad(h,2,0)+'분</option>';
                    	}else{
                    		hhmmssInputHtml +='<option value="'+$m.lpad(h,2,0)+'">'+$m.lpad(h,2,0)+'분</option>';
                    	}
                    }
                    hhmmssInputHtml +='</select>';
                    
                    hhmmssInputHtml +='<select class="cmb_hhmmss second tac" value="'+sec+'">';
                    for(var s=0; s<60; s++){
                    	if(s == sec){
                    		hhmmssInputHtml +='<option value="'+$m.lpad(s,2,0)+'" selected>'+$m.lpad(s,2,0)+'초</option>';
                    	}else{
                    		hhmmssInputHtml +='<option value="'+$m.lpad(s,2,0)+'">'+$m.lpad(s,2,0)+'초</option>';
                    	}
                    }
                    hhmmssInputHtml +='</select>';
                    hhmmssInputHtml +='</div>';
                    $(multiCalendar.calendarVariable.calArray[0].putObj).parent().append(hhmmssInputHtml);
                    
            	}
                let y = tempArr[0];
                let m = tempArr[1];
                let d = tempArr[2];
                

                multiCalendar.calendarVariable.calArray[0].dateArray.year = y;
                multiCalendar.calendarVariable.calArray[0].dateArray.month = m;
                multiCalendar.calendarVariable.calArray[0].dateArray.date = d;
                
                multiCalendar.calendarVariable.calArray[0].selectDay = _dt1;
                
                //달력위 input 값 입력
                
                $(multiCalendar.calendarVariable.calArray[0].putObj).val(y+"-"+m+"-"+d);
                
            }
            
            if(_dt2 == null || comLib.gfn_trim(_dt2) == ""){
                var now = new Date();
                var y = now.getFullYear();
                var m = comLib.gfn_toTwoChar(now.getMonth()+1);
                var d = comLib.gfn_toTwoChar(now.getDate());
                
                multiCalendar.calendarVariable.calArray[1].dateArray.year = y;
                multiCalendar.calendarVariable.calArray[1].dateArray.month = m;
                multiCalendar.calendarVariable.calArray[1].dateArray.date = d;
                
                
            }else{
                let tempArr = _dt2.split('-');
                if(_dt2.indexOf(':') > -1){
            		tempArr = _dt2.split(/-| |:/);
            		let hour = tempArr[3];
                    let min = tempArr[4];
                    let sec = tempArr[5];
                    multiCalendar.calendarVariable.calArray[1].dateArray.hour = hour;
                    multiCalendar.calendarVariable.calArray[1].dateArray.minute = min;
                    multiCalendar.calendarVariable.calArray[1].dateArray.second = sec;
                    $(multiCalendar.calendarVariable.calArray[1].putObj).addClass('hhmmss');
                    var hhmmssInputHtml = '';
                    hhmmssInputHtml +='<select class="cmb_hhmmss hour tac mr3">';
                    for(var h=0; h<24; h++){
                    	if(h == hour){
                    		hhmmssInputHtml +='<option value="'+$m.lpad(h,2,0)+'" selected>'+$m.lpad(h,2,0)+'시</option>';
                    	}else{
                    		hhmmssInputHtml +='<option value="'+$m.lpad(h,2,0)+'">'+$m.lpad(h,2,0)+'시</option>';
                    	}
                    }
                    hhmmssInputHtml +='</select>';
                    
                    hhmmssInputHtml +='<select class="cmb_hhmmss minute tac mr3">';
                    for(var h=0; h<60; h++){
                    	if(h == min){
                    		hhmmssInputHtml +='<option value="'+$m.lpad(h,2,0)+'" selected>'+$m.lpad(h,2,0)+'분</option>';
                    	}else{
                    		hhmmssInputHtml +='<option value="'+$m.lpad(h,2,0)+'">'+$m.lpad(h,2,0)+'분</option>';
                    	}
                    }
                    hhmmssInputHtml +='</select>';
                    
                    hhmmssInputHtml +='<select class="cmb_hhmmss second tac">';
                    for(var s=0; s<60; s++){
                    	if(s == sec){
                    		hhmmssInputHtml +='<option value="'+$m.lpad(s,2,0)+'" selected>'+$m.lpad(s,2,0)+'초</option>';
                    	}else{
                    		hhmmssInputHtml +='<option value="'+$m.lpad(s,2,0)+'">'+$m.lpad(s,2,0)+'초</option>';
                    	}
                    	
                    }
                    hhmmssInputHtml +='</select>';
                    $(multiCalendar.calendarVariable.calArray[1].putObj).parent().append(hhmmssInputHtml);
            	}
                let y = tempArr[0];
                let m = tempArr[1];
                let d = tempArr[2];

                multiCalendar.calendarVariable.calArray[1].dateArray.year = y;
                multiCalendar.calendarVariable.calArray[1].dateArray.month = m;
                multiCalendar.calendarVariable.calArray[1].dateArray.date = d;
                
                multiCalendar.calendarVariable.calArray[1].selectDay = _dt2;
                
                $(multiCalendar.calendarVariable.calArray[1].putObj).val(y+"-"+m+"-"+d);
            }
            
            multiCalendar.dateViewSetting($(multiCalendar.calendarVariable.calArray[0].obj).find(".moca_calendar_btn_prev"), multiCalendar.calendarVariable.calArray[0],0);
            multiCalendar.dateViewSetting($(multiCalendar.calendarVariable.calArray[1].obj).find(".moca_calendar_btn_prev"), multiCalendar.calendarVariable.calArray[1],1);

            
            multiCalendar.initEvent(multiCalendar.calendarVariable.calArray[0].id);
            if($m.getDevice() != "pc"){
            	$(tmp).addClass('vertical');
            	var _width = $(tmp).width();
            	var _height = $(tmp).height();
                var top = (document.body.offsetHeight/2) - (parseInt(_height)/2) + $(document).scrollTop();
                var left = (document.body.offsetWidth/2) - (parseInt(_width)/2) + $(document).scrollLeft();
                _t = top;
                _l = left;
                $('#'+messageboxId).css('position','fixed');
                $('#'+messageboxId).css('top',(_t)).css('left',_l);
            }

        },
        calendarVariable : {
            calViewObj : "",
            calArray : [
                {
                    id : "",
                    obj : "",
                    putObj : "",
                    selectDay : "",
                    dateArray : {
                        year : "",
                        month : "",
                        date : "",
                        
                    },
                    type : 0,
                    returnDateType : 0
                },
                {
                    id : "",
                    obj : "",
                    putObj : "",
                    selectDay : "",
                    dateArray : {
                        year : "",
                        month : "",
                        date : "",
                        
                    },
                    type : 0,
                    returnDateType : 0
                }
                
            ],
            
        },
        calendarVariableResset : function(){
            multiCalendar.calendarVariable.calViewObj = "";
            
            multiCalendar.calendarVariable.calArray[0].id = "";
            multiCalendar.calendarVariable.calArray[0].obj = "";
            multiCalendar.calendarVariable.calArray[0].putObj = "";
            multiCalendar.calendarVariable.calArray[0].selectDay = "";
            multiCalendar.calendarVariable.calArray[0].dateArray.year = "";
            multiCalendar.calendarVariable.calArray[0].dateArray.month = "";
            multiCalendar.calendarVariable.calArray[0].dateArray.date = "",
            multiCalendar.calendarVariable.calArray[0].type = 0;
            
            multiCalendar.calendarVariable.calArray[1].id = "";
            multiCalendar.calendarVariable.calArray[1].obj = "";
            multiCalendar.calendarVariable.calArray[1].putObj = "";
            multiCalendar.calendarVariable.calArray[1].selectDay = "";
            multiCalendar.calendarVariable.calArray[1].dateArray.year = "";
            multiCalendar.calendarVariable.calArray[1].dateArray.month = "";
            multiCalendar.calendarVariable.calArray[1].dateArray.date = "",
            multiCalendar.calendarVariable.calArray[1].type = 0;
        },
        initEvent : function(calendarId){
            //다음달
            $("#"+calendarId).find(".moca_calendar_btn_next").off("click").on("click",function(){
                event.stopPropagation();
                let objIndex = $(this).parent().parent().parent().index();
                
                let monthStr = Number(multiCalendar.calendarVariable.calArray[objIndex].dateArray.month);
                let yearStr = Number(multiCalendar.calendarVariable.calArray[objIndex].dateArray.year);
                
                switch (multiCalendar.calendarVariable.calArray[objIndex].type) {
                    case 0 :
                        monthStr += 1;
                        if(monthStr > 12){
                            monthStr = 1;
                            yearStr = Number(yearStr)+1;
                        }           

                      break;
                    case 1 :
                        //다음년도
                        //yearStr = Number(yearStr)+ 1;
                        yearStr += 1;
                        break;
                    case 2 :
                        //12년 후
                        yearStr = Number(yearStr) + 12;
                        break;
                }
                
                multiCalendar.calendarVariable.calArray[objIndex].dateArray.year =  yearStr;
                multiCalendar.calendarVariable.calArray[objIndex].dateArray.month = comLib.gfn_toTwoChar(monthStr);
                
                multiCalendar.dateViewSetting(this,multiCalendar.calendarVariable.calArray[objIndex], objIndex);
            });
            //이전달
            $("#"+calendarId).find(".moca_calendar_btn_prev").off("click").on("click",function(){
                event.stopPropagation();
                let objIndex = $(this).parent().parent().parent().index();

                let monthStr = Number(multiCalendar.calendarVariable.calArray[objIndex].dateArray.month);
                let yearStr = Number(multiCalendar.calendarVariable.calArray[objIndex].dateArray.year);
                let dateStr = multiCalendar.calendarVariable.calArray[objIndex].dateArray.date;
                
                switch (multiCalendar.calendarVariable.calArray[objIndex].type) {
                    case 0 :
                        monthStr -= 1;
                        if(monthStr < 1){
                            monthStr = 12;
                            yearStr = Number(yearStr)-1;
                        }           

                      break;
                    case 1 :
                        //다음년도
                        //yearStr = Number(yearStr) - 1;
                        yearStr -=  1;

                        break;
                    case 2 :
                        //12년 후
                        yearStr = Number(yearStr)- 12;
                        break;
                }
                
                multiCalendar.calendarVariable.calArray[objIndex].dateArray.year =  yearStr;
                multiCalendar.calendarVariable.calArray[objIndex].dateArray.month = comLib.gfn_toTwoChar(monthStr);
                
                multiCalendar.dateViewSetting(this,multiCalendar.calendarVariable.calArray[objIndex], objIndex);
            });
            
            
            //날짜 뷰
            $("#"+calendarId).find(".moca_calendar_dynamic").off("click").on("click",function(){
                event.stopPropagation();
                let objIndex = $(this).parent().parent().parent().index();
                
                let tempType = multiCalendar.calendarVariable.calArray[objIndex].type;
                
                if(tempType < 2){
                    tempType++;
                    
                    multiCalendar.calendarVariable.calArray[objIndex].type = tempType;
            
                    //multiCalendar.dateViewSetting($("#"+tempId).find(".moca_calendar_fl").eq(objIndex).find(".moca_calendar_btn_next"), multiCalendar.dateArray[objIndex].year, multiCalendar.dateArray[objIndex].month,objIndex);
                    multiCalendar.dateViewSetting($(multiCalendar.calendarVariable.calArray[objIndex].obj).find(".moca_calendar_btn_prev"), multiCalendar.calendarVariable.calArray[objIndex],objIndex);
                    
                }
                
                
            });
            
            //좌측 메뉴
            $("#"+calendarId).find(".moca_calendar_lta").find("button").off("click").on("click",function(){
                if(event != null){
                    event.stopPropagation();
                }
                //let objIndex = $(this).parent().index();
                var objIndexText = this.innerText;
                
                $("#"+calendarId).find(".moca_calendar_lta").find("li").removeClass("active");
                $(this).parent().addClass("active");
                
                var reFromTo = $m.getFromToByOption(objIndexText);

                multiCalendar.calendarVariable.calArray[0].selectDay = reFromTo.from;
                multiCalendar.calendarVariable.calArray[1].selectDay =  reFromTo.to;
                
                //달력위 input 값 입력
                $(multiCalendar.calendarVariable.calArray[0].putObj).val(reFromTo.from);
                $(multiCalendar.calendarVariable.calArray[1].putObj).val(reFromTo.to);
                
                //날짜 저장
                multiCalendar.calendarVariable.calArray[0].dateArray.year =     reFromTo.yearStrL;
                multiCalendar.calendarVariable.calArray[0].dateArray.month = reFromTo.monthStrL;
                multiCalendar.calendarVariable.calArray[0].dateArray.date = reFromTo.dateStrL;
                
                multiCalendar.calendarVariable.calArray[1].dateArray.year =     reFromTo.yearStrR;
                multiCalendar.calendarVariable.calArray[1].dateArray.month = reFromTo.monthStrR;
                multiCalendar.calendarVariable.calArray[1].dateArray.date = reFromTo.dateStrR;
                
                multiCalendar.dateViewSetting($(multiCalendar.calendarVariable.calArray[0].obj).find(".moca_calendar_btn_prev"),multiCalendar.calendarVariable.calArray[0], 0);
                multiCalendar.dateViewSetting($(multiCalendar.calendarVariable.calArray[1].obj).find(".moca_calendar_btn_prev"),multiCalendar.calendarVariable.calArray[1], 1);
            });
            
            //최소 버튼
            $("#"+calendarId).find(".moca_calendar_btn_cancel").off("click").on("click",function(){
                event.stopPropagation();
                $m.closeMultiCalendar($('#'+calendarId));
            })

            //확인 버튼
            $("#"+calendarId).find(".moca_calendar_btn_ok").off("click").on("click",function(){
                event.stopPropagation();
                var fromDt = $(multiCalendar.calendarVariable.calArray[0].putObj).val();
                var tempFromDt = fromDt.split('-');
                if(tempFromDt.length == 3){
                    fromDt = tempFromDt[0]+'-'+comLib.gfn_toTwoChar(tempFromDt[1])+'-'+comLib.gfn_toTwoChar(tempFromDt[2]);
                }
                var toDt = $(multiCalendar.calendarVariable.calArray[1].putObj).val();
                var tempToDt = toDt.split('-');
                if(tempToDt.length == 3){
                    toDt = tempToDt[0]+'-'+comLib.gfn_toTwoChar(tempToDt[1])+'-'+comLib.gfn_toTwoChar(tempToDt[2]);
                }
                
                var fromString = fromDt.replace(/[^\d]/g,'');
                var fromYear = Number(fromString.substring(0,4));
                var fromMonth = Number(fromString.substring(4,6));
                var fromDay = Number(fromString.substring(6,8));
                
                var toString = toDt.replace(/[^\d]/g,'');
                var toYear = Number(toString.substring(0,4));
                var toMonth = Number(toString.substring(4,6));
                var toDay = Number(toString.substring(6,8));
                
                
                var mMonth = multiCalendar.opt.maxTermByMonth;
                var mDay = multiCalendar.opt.maxTermByDay;
                var mYear = multiCalendar.opt.maxTermByYear;
                
                if(mYear != null){
                    var sumYear = fromYear+mYear;
                    var sumFrom = sumYear+''+comLib.gfn_toTwoChar(fromMonth)+''+comLib.gfn_toTwoChar(fromDay);
                    if(Number(sumFrom) < Number(toString)){
                        alert('조회최대범위(년:'+mYear+')초과!');
                        return;
                    }
                }
                if(mMonth != null){
                    //var sumMonthDt = dateLib.addDayFormat (fromString,mMonth,'');
                    var sumMonthDt =dateLib.addMonth(fromYear,fromMonth,fromDay,mMonth);
                    if(Number(sumMonthDt) < Number(toString)){
                        alert('조회최대범위(월:'+mMonth+')초과!');
                        return;
                    }
                }   
                if(mDay != null){
                    var sumDayDt = dateLib.addDayFormat (fromString, mDay+1,'');
                    if(Number(sumDayDt) < Number(toString)){
                        alert('조회최대범위(일:'+mDay+')초과!');
                        return;
                    }
                }
                if(multiCalendar.opt.from.indexOf(':') > -1 && multiCalendar.opt.to.indexOf(':') > -1){
                	var fromHour=$m.lpad($($("#"+calendarId).find(".moca_calendar_fl")[0]).find('.cmb_hhmmss.hour').val(),2,0);
                	var fromMinute=$m.lpad($($("#"+calendarId).find(".moca_calendar_fl")[0]).find('.cmb_hhmmss.minute').val(),2,0);
                	var fromSecond=$m.lpad($($("#"+calendarId).find(".moca_calendar_fl")[0]).find('.cmb_hhmmss.second').val(),2,0);
                	var toHour=$m.lpad($($("#"+calendarId).find(".moca_calendar_fl")[1]).find('.cmb_hhmmss.hour').val(),2,0);
                	var toMinute=$m.lpad($($("#"+calendarId).find(".moca_calendar_fl")[1]).find('.cmb_hhmmss.minute').val(),2,0);
                	var toSecond=$m.lpad($($("#"+calendarId).find(".moca_calendar_fl")[1]).find('.cmb_hhmmss.second').val(),2,0);
                	fromDt = fromDt+" "+fromHour+":"+fromMinute+":"+fromSecond;
                	toDt = toDt+" "+toHour+":"+toMinute+":"+toSecond;
                }
                $(multiCalendar.calendarVariable.calViewObj).find("input").eq(0).val(fromDt);
                $(multiCalendar.calendarVariable.calViewObj).find("input").eq(1).val(toDt);
                $m.closeMultiCalendar($('#'+calendarId));
            })
        },
        dateViewSetting : function(that, calendarVariable ,objIndex){
            //type
            /*  0 : 날짜 선택형
             *  1 : 달 선택형
             *  2 : 년 선택형
             */

            switch (calendarVariable.type) {
              case 0 :
                  $(that).siblings(".moca_calendar_dynamic").find(".moca_calendar_month").data("month",calendarVariable.dateArray.month);
                  $(that).siblings(".moca_calendar_dynamic").find(".moca_calendar_year").data("year", calendarVariable.dateArray.year);
                  $(that).siblings(".moca_calendar_dynamic").find(".moca_calendar_month").text(Number(calendarVariable.dateArray.month)+"월");
                  $(that).siblings(".moca_calendar_dynamic").find(".moca_calendar_year").text(calendarVariable.dateArray.year+"년" );
                  break;
              case 1 :
                  $(that).siblings(".moca_calendar_dynamic").find(".moca_calendar_month").data("month",calendarVariable.dateArray.month);
                  $(that).siblings(".moca_calendar_dynamic").find(".moca_calendar_year").data("year", calendarVariable.dateArray.year);
                  $(that).siblings(".moca_calendar_dynamic").find(".moca_calendar_month").text("");
                  $(that).siblings(".moca_calendar_dynamic").find(".moca_calendar_year").text(calendarVariable.dateArray.year+"년" );
                  break;
              case 2 :
                  $(that).siblings(".moca_calendar_dynamic").find(".moca_calendar_month").data("month",calendarVariable.dateArray.month);
                  $(that).siblings(".moca_calendar_dynamic").find(".moca_calendar_year").data("year", calendarVariable.dateArray.year);
                  $(that).siblings(".moca_calendar_dynamic").find(".moca_calendar_month").text("");
                  $(that).siblings(".moca_calendar_dynamic").find(".moca_calendar_year").text(Number(Number(calendarVariable.dateArray.year)-11) +"년 - " +calendarVariable.dateArray.year+"년" );
                  break;
            }
            
            sampleCalendar.dateSetting(multiCalendar.calendarVariable.calArray[objIndex],multiCalendar.dateViewSetting, multiCalendar.calendarDateBtnEventSetting, objIndex);
            
            
        },calendarDateBtnEventSetting : function(calendarVariable,dateStr, objIndex){
        	if(dateStr == '' || dateStr == null) return;
            //document.getElementById(calendarVariable.putId).value = $m.getDisplayFormat_value(document.getElementById(calendarVariable.putObj).parentElement,calendarVariable.dateArray.year+calendarVariable.dateArray.month+ comLib.gfn_toTwoChar(dateStr));
            let returnDateVal = "";
            if(calendarVariable.returnDateType == 0){
                calendarVariable.dateArray.date = $.trim(comLib.gfn_toTwoChar(dateStr));
                returnDateVal = $.trim(calendarVariable.dateArray.year)+ "-" +$.trim(calendarVariable.dateArray.month)+ "-" +$.trim(comLib.gfn_toTwoChar(dateStr));
            }else if(calendarVariable.returnDateType == 1){
                calendarVariable.dateArray.month = $.trim(comLib.gfn_toTwoChar(dateStr));
                returnDateVal = $.trim(calendarVariable.dateArray.year)+ "-" +$.trim(calendarVariable.dateArray.month);
            }else{
                calendarVariable.dateArray.year = $.trim(comLib.gfn_toTwoChar(dateStr));
                returnDateVal = $.trim(calendarVariable.dateArray.year);
            }
            $(calendarVariable.putObj).val(returnDateVal);
            
            multiCalendar.calendarVariable.calArray[objIndex].selectDay = calendarVariable.dateArray.year+ "-" +calendarVariable.dateArray.month+ "-" + calendarVariable.dateArray.date;
            
            //멀티 달력에서는 일자 선택시 바로 닫히지 않기 때문에 선택일짜 다시 세팅
            switch (calendarVariable.type) {
            case 0 :
                $(calendarVariable.obj).find("td").removeClass("moca_calendar_selected");
                $(calendarVariable.obj).find("td[index="+Number(calendarVariable.dateArray.date)+"]").addClass("moca_calendar_selected");
                break;
            case 1 :
                $(calendarVariable.obj).find("li").removeClass("active");
                $(calendarVariable.obj).find("li[index="+Number(calendarVariable.dateArray.month)+"]").addClass("active");
                break;
            case 2 :
                $(calendarVariable.obj).find("li").removeClass("active");
                $(calendarVariable.obj).find("li[index="+Number(calendarVariable.dateArray.year)+"]").addClass("active");
                break;
        }
            
            //console.log("["+objIndex+"]"+multiCalendar.calendarVariable.calArray[objIndex].selectDay);
            //$m.closeCalendar($('#'+calendarVariable.id));
        }
    }


Moca.prototype.doFilterForSingle = function(_thisObj,_e,grd) {
    //첫적용
    $m.stopEvent(_e);
    var o = $(_thisObj).closest('TH');
    var _id = o.attr('id');
    var itemTable = $(_thisObj).closest('.moca_grid_body').find(".itemTable[thid="+_id+"]");

    
    //if(itemTable.length == 0){
    //onScroll이벤트로 인해 오픈할때마다 새로그림
    if(true){
        var offsetBasisObj = $(_thisObj).closest('.moca_grid_body');
        var offsetBasisOffset = offsetBasisObj.offset();
        var reWidth = o.width();
        var reJson = o.offset();
        var reHeight = o.height();
        //var grd = $(_thisObj).closest('div[type=grid]');
        //if(grd[0].nowlist == null){
            //grd[0].nowlist = grd[0].list.clone();
            grd[0].nowlist = grd[0].list;
        //}
        
        var td = grd[0].cellInfo[o.attr("filterableId")];
        var _displayFormat = td.getAttribute("displayFormat");
        var _celltype = td.getAttribute("celltype");
    
        var column_map = grd[0][o.attr("filterableId")]['map'];
        if(column_map == null){
            column_map = {};
        }
        //var _filterMap = $m.groupBy(grd[0].nowlist,o.attr("filterableId"));
        var _filterMap_cdNm = grd[0][o.attr("filterableId")]['filterableMap'];
        var _filterMap = {};
        var kks = Object.keys(_filterMap_cdNm);
        for(var i=0; i < kks.length; i++){
            var _k = kks[i];
            _filterMap[_k] = '';
        }
            
        var _itemTable = '';
        var filter;
        if(grd[0].filter != null){
            filter = grd[0].filter[_id];
        }else{
            grd[0]['filter'] = {};  
        }

        var ks = Object.keys(_filterMap);
        var isAllChecked = 'checked';
        for(var i=0; i < ks.length; i++){
            var k = ks[i];
            var _cd = k;
            _cd = _cd.replace(/\(.*?\) (.*?)$/g,'$1');
            var _nm = _filterMap_cdNm[k];
            
    
            var _reLabel = _nm;
            _reLabel = $m.trim(_reLabel);

            if(filter != null && filter.indexOf(_cd) > -1){
                checkedStr = "checked";
            }else if(filter == null){
                checkedStr = "checked";
            }else{
                isAllChecked = '';
                checkedStr = '';
            }
            
            if(checkedStr == "checked"){
                _itemTable += '<li class="on">';
            }else{
                _itemTable += '<li>';   
            }
            
            _itemTable += '<input type="checkbox" id="filterableCheck_'+_id+'_'+_cd+'" name="filterableCheck_'+_id+'" value="'+_cd+'" '+checkedStr+'>';
            _itemTable += '<label type="checkbox" for="filterableCheck_'+_id+'_'+_cd+'" >'+_reLabel+'</label>'; 
            _itemTable += '</li>';
        }
        
        
        var _all = '';
        _all += '<div class="filterheader">';   
        _all += '<span>';
        _all += '<input type="checkbox" id="all_filterableCheck_'+_id+'" name="all_filterableCheck_'+_id+'" '+isAllChecked+' class="allcheck">';
        _all += '<label type="checkbox" for="all_filterableCheck_'+_id+'"  ></label>';
        _all += '</span>';
        _all += '<div class="fr">';
        if(grd[0][o.attr("filterableId")].filterType != 'countableMap'){
            _all += '<button type="button" class="moca_ibn_btn mr3" onclick="$m.filterSort(this,\''+_id+'\',\''+o.attr("filterableId")+'\')" style="">건수순</button>';
        }else{
            _all += '<button type="button" class="moca_ibn_btn mr3" onclick="$m.filterAlpha(this,\''+_id+'\',\''+o.attr("filterableId")+'\')" style="">가나다순</button>';
        }
        _all += '<button type="button" class="moca_ibn_btn mr3" onclick="$m.filterApply(this,\''+_id+'\',\''+o.attr("filterableId")+'\')" style="">적용</button>'; 
        _all += '<button type="button" class="moca_ibn_btn mr3 bd0" onclick="$m.expand(this,\''+_id+'\',\''+o.attr("filterableId")+'\')" style=""><i class="fas fa-angle-double-down"></i></button>';
        _all += '</div>';
        _all += '<input type="text" class="moca_input req" style="" value="" onkeyup="$m.realtimeSearch(this)" placeholder="검색어를 입력하세요">';
        _all += '</div>';
        
        _itemTable = _all+'<ul>'+_itemTable+'</ul>';            
        var tmp = document.createElement( 'div' );
        tmp.setAttribute("thid",o.attr('id'));
        tmp.setAttribute("class","itemTable");
        tmp.innerHTML = _itemTable;         
        $m.filterClose();
        $(_thisObj).closest('.moca_grid_body').append(tmp);
        grd[0].itemTable = itemTable;
        
        itemTable = $(_thisObj).closest('.moca_grid_body').find(".itemTable[thid="+o.attr('id')+"]");
        $(itemTable).find("input[type=checkbox][name=all_filterableCheck_"+_id+"]").off('click').on('click',function(){
            var arrJq =  $(this).closest('div').next().find('input[type=checkbox]');
            if(this.checked){
                arrJq.prop('checked',true);
                arrJq.closest('li').addClass('on');
            }else{
                arrJq.prop('checked',false);
                arrJq.closest('li').removeClass('on');
            }
        });     

        $(itemTable).find("input[type=checkbox][name=filterableCheck_"+_id+"]").off('click').on('click',function(){
            var ul = $(this).closest('ul');
            var arr_all = ul.find('input[type=checkbox]')
            var arr_checked = ul.find('input[type=checkbox]:checked');
            
            var allCheckbox = ul.prev().find("input[type=checkbox][name=all_filterableCheck_"+_id+"]");
            
            if(arr_all.length == arr_checked.length){
                allCheckbox.prop('checked',true);
                allCheckbox.prop('indeterminate',false);
            }else if(arr_all.length == 0){
                allCheckbox.prop('checked',false);
                allCheckbox.prop('indeterminate',false);
            }else{
                allCheckbox.prop('checked',false);
                if(arr_checked.length == 0){
                    allCheckbox.prop('indeterminate',false);
                }else{
                    allCheckbox.prop('indeterminate',true);
                }
            }
            $m.filterSetColor(this);
        });
        
        
        itemTable.css('position','fixed');
        itemTable.width(reWidth+8);
        itemTable.css('top',(offsetBasisObj.scrollTop()+reJson.top+parseInt(reHeight))+'px');
        itemTable.css('left',(offsetBasisObj.scrollLeft()+reJson.left)+'px');
        itemTable.css('z-index','6200');
        
        
        var ul = itemTable.find('.filterheader').next();
        var arr_all = ul.find('input[type=checkbox]')
        var arr_checked = ul.find('input[type=checkbox]:checked');
        
        var allCheckbox = ul.prev().find("input[type=checkbox][name=all_filterableCheck_"+_id+"]");
        
        if(arr_all.length == arr_checked.length){
            allCheckbox.prop('checked',true);
            allCheckbox.prop('indeterminate',false);
        }else if(arr_all.length == 0){
            allCheckbox.prop('checked',false);
            allCheckbox.prop('indeterminate',false);
        }else{
            allCheckbox.prop('checked',false);
            allCheckbox.prop('indeterminate',true);
        }
        
        $(itemTable).find('i').removeClass('fa-angle-double-down');
        $(itemTable).find('i').addClass('fa-angle-double-up');
        var grd = grd[0];
        var ul = $(itemTable).find('div.filterheader').next();
        var ul_top = ul.offset().top;
        var top_position = ul.attr("top_position");
        
        if(top_position == null){
            ul.attr("top_position",ul_top);
        }
        var h = $(grd).offset().top + $(grd).height() - Number(ul.attr("top_position"))-5;
        $(itemTable).find('div.filterheader').next().css('max-height',h+'px');
        
        
        //$('.itemTable').css('opacity',0.9);           
    }else{
        if(itemTable.css('display') != 'none'){
            itemTable.css('display','none');
        }else{
            $m.filterClose();
            itemTable.css('display','block');
        }
    }
    itemTable.off("click").on('click',function(){
        $m.stopEvent(event);
    });
}

Moca.prototype.doFilter = function(_thisObj) {
    if(typeof _thisObj == 'string'){
        //header Id로 넘어올때
        _thisObj = $('#'+_thisObj).find('.moca_grid_filter_btn')[0];
    }
    var grd = $(_thisObj).closest('div[type=grid]');
    var o = $(_thisObj).closest('TH');
    var _headerId = o.attr('id');
    //선택한 필터가 최종필터가 아닐때!
    
    if(grd[0].appliedFilterMap != null && grd[0].appliedFilterMap[_headerId] != null && (grd[0].appliedFilterMap[_headerId].idx < grd[0].appliedFilterArr.length)){
        $m.filterRemoveAll(grd);
        //$m.drawGrid(grd[0].id, grd[0].ori_list);
    }
    
    var myIdx;
    if(grd[0]['filterIdx'] != null){
        myIdx = grd[0]['filterIdx'][_headerId];
    }
    //if(grd[0]['filterMaxIdx'] == null){//멀티필터시필요
    if(true){
        $m.doFilterForSingle(_thisObj,event,grd);
    }else{
        //alert('_headerId'+_headerId+','+myIdx)
        if(myIdx != null){
            $m.doFilterForSingle(_thisObj,event,grd);
        }else{
            $m.question('멀티필터로 적용하시겠습니까?',function(result){
                if(result != '3'){
                    if(result == '1'){
                        var list = grd[0].list;
                        var jq_grd_2 = grd[0];
                        var ks = Object.keys(jq_grd_2.cellInfo);
                        var filterArr = [];
                        var filterThArr = [];
                        var thArray = $(jq_grd_2).find('thead:first th[filterableId]');
                        for(var i=0; i < thArray.length; i++){
                            var aTh = thArray[i];
                            var filterableId = aTh.getAttribute("filterableId");
                            filterArr.push(filterableId);
                            filterThArr.push(aTh.id);
                            if(jq_grd_2[filterableId] == null){
                                jq_grd_2[filterableId] = {};
                            }
                            jq_grd_2[filterableId]['filterableMap'] = {};
                        }
                        /*
                         * full loop area !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                         */
                        for(var i=0; i < list.length; i++){
                            var row = list[i];
                            row["_system"]["realIndex"] = i;
                            for(var k=0; k < filterArr.length; k++){
                                var tdId = filterArr[k];
                                var tdValue = row[tdId];
                                jq_grd_2[tdId]['filterableMap'][tdValue] = ($m.getNumber(jq_grd_2[tdId]['filterableMap'][tdValue])+1);
                                if(i == list.length-1){
                                    jq_grd_2[tdId]['filterableMap'] = $m.sortObject(jq_grd_2[tdId]['filterableMap']);
                                    jq_grd_2[tdId]['countableMap'] = {};
                                    var m = jq_grd_2[tdId].filterableMap;
                                    var keys = Object.keys(m);
                                    for(var j=0; j < keys.length; j++){
                                        var key = keys[j];
                                        var val = "";
                                        if(m != null){
                                            val = m[key];
                                        }
                                        var reKey = "("+val+"건)"+" "+key;
                                        jq_grd_2[tdId]['countableMap'][reKey] = key+" "+"("+$m.comma(val)+"건)";
                                    }
                                    jq_grd_2[tdId]['countableMap'] = $m.sortObjectNumString(jq_grd_2[tdId]['countableMap']);
                                    var keys = Object.keys(jq_grd_2[tdId]['countableMap']);
                                    for(var j=0; j < keys.length; j++){
                                        var key = keys[j];
                                        var val = "";
                                        if(m != null){
                                            val = m[key];
                                        }
                                        jq_grd_2[tdId]['countableMap'][key] = (j+1)+"."+key;
                                    }   
                                    
                                    
                                    jq_grd_2[tdId]['alphabeticalMap'] = jq_grd_2[tdId]['filterableMap'];
                                    jq_grd_2[tdId].filterType = 'alphabeticalMap';
                                }
                            }
                        }
                        
                        for(var i=0; i < filterArr.length; i++){
                            var tdId = filterArr[i];
                            var thId = filterThArr[i];
                            var m = jq_grd_2[tdId].filterableMap;
                            var keys = Object.keys(jq_grd_2[tdId]['filterableMap']);
                            for(var j=0; j < keys.length; j++){
                                var key = keys[j];
                                var val = "";
                                if(m != null){
                                    val = m[key];
                                }
                                
                                jq_grd_2[tdId]['filterableMap'][key] = (j+1)+"."+key+" "+"("+$m.comma(val)+"건)";
                            }
                            
                            $(jq_grd_2).find(".itemTable[thid="+thId+"]").remove();
                            $(jq_grd_2)[0].filter = null;
                        }
                        
                    //////////////////////////////////////////////////////////////////filter 구성 end
                        $m.doFilterForSingle(_thisObj,event,grd);
                        
                        
                    }else if(result == '2'){
                        $m.filterRemoveAll(grd);
                        $m.drawGrid(grd[0].id, grd[0].ori_list);
                        $m.doFilterForSingle(_thisObj,event,grd);
                    }
                }
            },
            "멀티필터로적용",
            "단일필터로적용",
            "취소");
        }
    }
}

Moca.prototype.filterSort = function(thisObj,_headerId,_tdId) {
    ['건수순으로 소트']
    var grd = $(thisObj).closest('div[type=grid]')[0];
    var cm = grd[_tdId]['countableMap'];
    grd[_tdId]['filterableMap'] = cm;
    grd[_tdId].filterType = 'countableMap';
    $m.filterClose();
    $('.itemTable').remove();
    $m.doFilter(_headerId);
};
Moca.prototype.filterAlpha = function(thisObj,_headerId,_tdId) {
    ['알파벳순으로 소트']
    var grd = $(thisObj).closest('div[type=grid]')[0];
    var am = grd[_tdId]['alphabeticalMap'];
    grd[_tdId]['filterableMap'] = am;
    grd[_tdId].filterType = 'alphabeticalMap';
    $m.filterClose();
    $('.itemTable').remove();
    $m.doFilter(_headerId);
};

Moca.prototype.filterApply = function(thisObj,_headerId,_tdId) {
    ['멀티소트구현']
    var grd = $(thisObj).closest('div[type=grid]')[0];
    if(grd.appliedFilterArr  == null){
        grd.appliedFilterArr = [];
    }
    if(grd.appliedFilterMap  == null){
        grd.appliedFilterMap = {}; 
    }
    if(grd['filterFull']  == null){
        grd['filterFull'] = {}; 
    }   

    grd['filter'][_headerId] = $(thisObj).closest('div.filterheader').next().find('li:not([style*="display: none"])').find('input[type=checkbox]:checked').map(function (idx, ele) {return $(ele).val();}).get().join(", ");
    grd['filterFull'][_headerId] = $(thisObj).closest('div.filterheader').next().find('li').find('input[type=checkbox]').map(function (idx, ele) {return $(ele).val();}).get().join(", ");
    
    var loopLeng = 0;
    if(grd.appliedFilterMap[_headerId] == null){
        loopLeng = grd.appliedFilterArr.length;
    }else{
        loopLeng = grd.appliedFilterArr.length-1;//이미선택된 마지막 필터를 수정할때
    }
    for(var i=0; i < loopLeng; i++){
        var hId = grd.appliedFilterArr[i];
        var map = grd.appliedFilterMap[hId];
        grd.list = $m.getFilteredListForFilter(grd.ori_list,map.tdId,map.checkedString);
    }
    
    var applyNumber = 1;
    var __list;
    if(grd.appliedFilterMap[_headerId] == null){
        grd.appliedFilterArr.push(_headerId);
    }
    if(grd['filterMaxIdx'] != null){
        if(grd['filterIdx'][_headerId] == null){
            applyNumber = ++grd['filterMaxIdx'];
        }else{
            applyNumber = grd['filterMaxIdx'];
        }
        if(applyNumber == 1){
            __list = grd.ori_list;
        }else{
            //__list = grd.list;//멀티필터시필요
            __list = grd.ori_list;
        }
    }else{
        __list = grd.ori_list;
    }
    grd.list = $m.getFilteredListForFilter(__list,_tdId,grd['filter'][_headerId]);
    grd.appliedFilterMap[_headerId] = {'idx':applyNumber,'checkedString':grd['filter'][_headerId],'tdId':_tdId,'allCheckedString':grd['filterFull'][_headerId]};
    grd['filterMaxIdx'] = grd.appliedFilterMap[_headerId].idx;
    grd['filterIdx'] = {};
    grd['filterIdx'][_headerId] = grd.appliedFilterMap[_headerId].idx;
    
    /*
    var hObj = $('#'+_headerId);
    hObj.find('.moca_grid_filter_btn').addClass('multi');
    hObj.find('i').text(grd.appliedFilterMap[_headerId].idx);
    *///멀티필터시필요
    $m.redrawGrid(grd);
    if(grd.list.length != grd.ori_list.length){
        var cnt = '<b class="txt_red">'+$m.comma(grd.list.length)+'</b>'+'/'+$m.comma(grd.ori_list.length);
        $m[grd.getAttribute("srcid")].setTotalCnt(grd,cnt);
    }else{
        var cnt = grd.ori_list.length;
        $m[grd.getAttribute("srcid")].setTotalCnt(grd,cnt);       
    }
}

Moca.prototype.doFilterDblclick = function() {
    $m.stopEvent(event);
}

Moca.prototype.stopEvent = function(_evt) {
    _evt.stopPropagation();
    _evt.stopImmediatePropagation();
}


Moca.prototype.groupBy = function(_list, _colId) {
    var map = {};
    for(var i=0; i < _list.length; i++){
        map[_list[i][_colId]] = '';
    }
    return map;
}

Moca.prototype._excel_up = function(_thisObj) {
    var _type = $m.getType(_thisObj); 
    var grd = $m.getTypeObj(_thisObj);
    var _excel_start_index = grd.attr('excel_start_index');
    if(_excel_start_index == null){
        _excel_start_index = "1";
    }
    var arr = Object.keys(grd[0].cellInfo);
    var _jsonMap = {};
    for(var i=0;i < arr.length; i++){
        var key = arr[i];
        var cell = grd[0].cellInfo[key];
        var excelIndex = cell.getAttribute("excelIndex");
        if(excelIndex != null){
            _jsonMap[excelIndex] = key;
        }
    }
    $m.popup({
        type:"POPUP",
        modal:"false",
        url:'/moca/comp/COMP_EXUP.html',
        title:"엑셀업로드",
        callback:$m[grd[0].getAttribute("srcid")]._excelCallback,
        data:{
            mapper:_jsonMap,
            grdId:grd[0].id,
            pageId:grd[0].getAttribute("pageid"),
            srcId:grd[0].getAttribute("srcid"),
            excel_start_index:_excel_start_index,
            scopeId:grd[0].getAttribute("pageid")
        }
    });
}

Moca.prototype._excel_down = function(_thisObj) {
    ['Ajax버전의 파일다운로드 함수'];
    var _type = $m.getType(_thisObj)
    var grd = $m.getTypeObj(_thisObj)
    var cellInfo = {};
    var ks = Object.keys(grd[0].cellInfo);
    var _keyNmArr =[];
    for(var i=0,j=ks.length;i < j; i++){
        var key = ks[i];
        var cellTd = grd[0].cellInfo[key];
        if(cellTd.getAttribute("excelIndex")){
        	if(cellTd.getAttribute("celltype")=="select" && grd.attr("exdn_withLabel") != 'false'){
        		var _keynm = key+"_nm";
        		cellInfo[key] = cellTd.getAttribute("name");
        		var _keyJson = {
        			"_keycd":key,
        			"_keynm":cellTd.getAttribute("name")+"_NAME"
        		};
        		_keyNmArr.push(_keyJson);
        	}else{
        		 cellInfo[key] = cellTd.getAttribute("name");
        	}
        }
        
        /*
        var isDisplayNone = grd.find('td[id='+cellTd.id+']').css('display');
        if(isDisplayNone != 'none'){
            cellInfo[key] = cellTd.getAttribute("name");
        }
        */
    }
    for(var k=0;k<_keyNmArr.length;k++){
    	var _label = _keyNmArr[k]._keycd+"_nm";
    	cellInfo[_label] = _keyNmArr[k]._keynm;
    }
   
    
    var aTd;
    var _nm;
    var _cd;
    var _selectArr = [];
    for(var bb=0; bb<ks.length; bb++){
    	aTd = grd[0].cellInfo[ks[bb]];
    	if($(aTd).attr("celltype") == "select"){
    		_selectArr.push(aTd);
    	}
    }
    if(_selectArr.length > 0 && grd.attr("exdn_withLabel") != 'false'){
    	grd[0].excelList = grd[0].list.clone();
    	 for(var i = 0; i<grd[0].excelList.length;i++){
    		 for(var ii=0; ii<_selectArr.length; ii++){
    			 aTd = _selectArr[ii];
    			 _cd = grd[0].excelList[i][aTd.id];
    	 		 var _idnm = aTd.id+"_nm";
    	         var codeOpt = grd[0][aTd.id].codeOpt;
    	         _nm = grd[0][aTd.id]["map"][_cd];
    	         grd[0].excelList[i][_idnm]=_nm;
    		 }
    		
    	 }
    }
   
    var list = grd[0].list.clone();
    if(grd[0].excelList != null){
    	list = grd[0].excelList;
    }
    if(list.length == 0){
    	 $m.alert("다운로드할 데이터가 없습니다.");
    	 return;
    }
    var _parammap = {};
    _parammap['cellInfo'] = cellInfo;
    _parammap['list'] = list;
    
    var array = list;
    var str = '';
    var line_h = '';
    function escapeVal(v) {
        return '"' + v.replace('"', '""') + '"';
    }
    for (var hkey in cellInfo) {
        var v = cellInfo[hkey]+"";
        if(v == null || v == 'null'){
            v = "";
        }
        line_h += v + ",";
    }
    line_h.slice(0,line_h.Length-1);
    str += line_h + '\r\n';
    
    for (var i = 0; i < array.length; i++) {
                var line = '';
                
                for (var hkey in cellInfo) {
                    var v = array[i][hkey]+"";
                    
                    if(v == null || v == 'null' || v == 'undefined'){
                        v = "";
                    }else{
                        if(v.length == 13 && $.isNumeric(v) && hkey != "FILE_ID"){
                            v = $m.longToDate(v);
                        }else if(hkey == "FILE_ID"){
                            v = ""+v+"_";
                        }
                        v = escapeVal(v);
                    }
                    line += v + ",";
                }
                
                line.slice(0,line.Length-1);
                str += line + '\r\n';
    }
    var ReportTitle= grd.attr('label');
    var fileName = grd.closest('.moca_tab_panel').find('#sreenNm').text()+"_";
    fileName += ReportTitle.replace(/ /g,"_");   
    fileName = fileName + ".csv";


    if(navigator.appVersion.toString().indexOf('.NET') > 0){
        var xData = new Blob(["\ufeff"+str], { type: 'text/csv' });
        window.navigator.msSaveBlob(xData,fileName);
    }else{
        var xData = new Blob(["\ufeff"+str], { type: 'text/csv' });
        var uri = URL.createObjectURL(xData);

        var link = document.createElement("a");    
        link.href = uri;
        link.style = "visibility:hidden";
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    

/*
    var downloadUrl = "/efms/EFL_CAFL/exceldownload.do";
    
    var xhttp = new XMLHttpRequest();
    var loadingId = $m.loading();
    
    xhttp.onreadystatechange = function(){
        
        if(xhttp.readyState == 4 && xhttp.status == 200){
            $m.loading(loadingId,0);
            var cd = xhttp.getResponseHeader('content-disposition');
            var ar = cd.split(';');
            var fNameParam = ar[1];
            var ar2 = fNameParam.split('=');
            var fileName = ar2[1];
            var _fileName = decodeURIComponent(fileName);
            fileName = _fileName.replace(/\"/g,'');
            if($m.isChrome()){
                var a = document.createElement('a');
                a.id = 'tmpDownload';
                a.href = window.URL.createObjectURL(xhttp.response);
                a.download = fileName;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
            }else{
                window.navigator.msSaveOrOpenBlob(xhttp.response,_fileName);
            }

        }else if(xhttp.readyState == 4 && xhttp.status == 500){
            $m.loading(loadingId,0);
            var blob = new Blob([this.response],{type:'application/json'});
            var fileReader = new window.FileReader();
            fileReader.readAsText(blob);
            fileReader.onloadend = function(){
                var msg = JSON.parse(fileReader.result)['msg'];
                alert(msg);
                return false;
            }
            //{"statCd":-1,"msg":"파일이 존재하지 않습니다.","reason":"Internal Server Error","path":"/co/coc/FileUpload/downloadFile.do","locale":"ko"}
        }
    };
    xhttp.onerror = function(){
    };
    xhttp.open("POST",downloadUrl);
    //xhttp.setRequestHeader("Content-Type","application/json;charset=UTF-8");
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.responseType = 'blob';
    setTimeout(function(){
        if(typeof _parammap == 'object'){
            xhttp.send("body="+JSON.stringify(_parammap)+"&header="+JSON.stringify({TRANID:"TRAN_"+$m.now()+$m.shuffleRandom(6)}));
        }else{
            xhttp.send(_parammap);
        }
    },1000);
*/
    
    
}


Moca.prototype._detailview = function(_thisObj) {
    $m._detailView1(_thisObj);
    $(".button.colTh1").addClass('on');
}

Moca.prototype._col_showhide = function(_thisObj) {
    var tags = '';
    var renderType = _thisObj.getAttribute("renderType");
    var grd;
    if(renderType == null){
        grd = $(_thisObj).closest("div[type=grid]");
    }else{
        grd = $(_thisObj).closest("div[type="+renderType+"]");
    }
    
    var _srcId =grd.attr('srcId');
    var _compId =grd.attr('id');
    var name = "그룹없음";
    var colGroupObj = $m.getLocalStorage(_srcId,_compId,'colGroup');
    if(colGroupObj[name] == null){
        colGroupObj[name] = {colorCd:"#FFF"};
        colGroupObj[name].checkList = {};
        var map = grd[0].cellInfo;
        var keyArray = Object.keys(map);
        for(var i=0; i < keyArray.length; i++){
            var k = keyArray[i];
            if($m.trim(k) != ''){
                var _label = '';
                if(renderType == null){
                    _label = +map[k].getAttribute('name');
                }else{
                    _label = +map[k].innerText; 
                }
                
                tags += '<li class="p10 pr20">';
                tags += '<input type="checkbox" class="grpCheckbox" name="cbx" id="cbx_'+k+'" onclick="$m.grpCheckboxClick(this)" groupId="'+"그룹없음"+'" columnId="'+k+'" >';
                tags += '<label for="cbx_'+k+'" class="mr10"><span class="cbx"></span>'+_label+'('+k+')'+'</label>';
                tags += '<div class="moca_radio" >';
                tags += '<input type="radio" name="radio_'+k+'" id="radio_'+k+'_1" onclick="$m.columnShowHideRadioClick(this)" value="1" checked >';
                tags += '<label for="radio_'+k+'_1">보이기</label>';
                tags += '<input type="radio" name="radio_'+k+'" id="radio_'+k+'_2" onclick="$m.columnShowHideRadioClick(this)" value="0">';
                tags += '<label for="radio_'+k+'_2">숨기기</label>';
                tags += '</div>';
                tags += '</li>';
                colGroupObj[name].checkList[k] = '1';
            }
        }
        $m.setLocalStorage(_srcId,_compId,'colGroup',colGroupObj);
    }else{
        var checkListMap = colGroupObj[name].checkList;
        var map = grd[0].cellInfo;
        var keyArray = Object.keys(map);
        for(var i=0; i < keyArray.length; i++){
            var k = keyArray[i];
            if($m.trim(k) != ''){
                var _label = '';
                if(renderType == null){
                    _label = map[k].getAttribute('name');
                }else{
                    _label = map[k].innerText; 
                }
    
                var v = checkListMap[k];
                tags += '<li class="p10 pr20">';
                tags += '<input type="checkbox" class="grpCheckbox" name="cbx" id="cbx_'+k+'" onclick="$m.grpCheckboxClick(this)" groupId="'+"그룹없음"+'" columnId="'+k+'" >';
                tags += '<label for="cbx_'+k+'" class="mr10"><span class="cbx"></span>'+_label+'('+k+')'+'</label>';
                tags += '<div class="moca_radio" >';
                
                if(v != '0'){
                    tags += '<input type="radio" name="radio_'+k+'" id="radio_'+k+'_1" onclick="$m.columnShowHideRadioClick(this)" value="1" checked >';
                    tags += '<label for="radio_'+k+'_1">보이기</label>';
                    tags += '<input type="radio" name="radio_'+k+'" id="radio_'+k+'_2" onclick="$m.columnShowHideRadioClick(this)" value="0">';
                    tags += '<label for="radio_'+k+'_2">숨기기</label>';
                }else{
                    tags += '<input type="radio" name="radio_'+k+'" id="radio_'+k+'_1" onclick="$m.columnShowHideRadioClick(this)" value="1">';
                    tags += '<label for="radio_'+k+'_1">보이기</label>';
                    tags += '<input type="radio" name="radio_'+k+'" id="radio_'+k+'_2" onclick="$m.columnShowHideRadioClick(this)" value="0" checked>';
                    tags += '<label for="radio_'+k+'_2">숨기기</label>';
                }
    
                tags += '</div>';
                tags += '</li>';
                colGroupObj[name].checkList[k] = '1';
            }
        }
    }
    
    grd.find('.groupColList').html(tags);
    grd.find('#col_showhide').css('display','block');
    $m.listColGroup(grd.find('.btn_plus')[0]);
}


Moca.prototype._detailViewClose = function(_thisObj) {
    $m._detailViewContentCopy(_thisObj);
    var _type = $m.getType(_thisObj)
    var _grid = $m.getTypeObj(_thisObj)
    var dbody = _grid.find(".gridDetail_body");
    dbody.css('display','none');
}

Moca.prototype._col_showhideClose = function(_thisObj) {
    var _type = $m.getType(_thisObj); 
    var _grid = $m.getTypeObj(_thisObj);
    _grid.find('#col_showhide').css('display','none');
}


Moca.prototype._detailViewContentCopy = function(_thisObj) {
    var _gridDetailNum = 'gridDetail1';
    $(".button.colTh1").removeClass('on');
    $(".button.colTh2").removeClass('on');
    $(".button.colTh3").removeClass('on');
    if($(_thisObj).hasClass("colTh1")){
        $(".button.colTh1").addClass('on');
    }else if($(_thisObj).hasClass("colTh2")){
        $(".button.colTh2").addClass('on');
    }else if($(_thisObj).hasClass("colTh3")){
        $(".button.colTh3").addClass('on');
    }
    var _type = $m.getType(_thisObj); 
    var _grid = $m.getTypeObj(_thisObj);
    var selectedDetailView = _grid.attr('selectedDetailView');
    if(selectedDetailView != null){
        _gridDetailNum = 'gridDetail'+selectedDetailView;
        var dbody = _grid.find(".gridDetail_body");
        var _array = dbody.find('#'+_gridDetailNum).find('td');
        for(var i=0; i<_array.length; i++){
            var aTd = _array[i];
            var aTr = $(aTd).closest("tr");
            var aDiv = $(aTd).find('div[contenteditable=true]');
            if(aDiv.length > 0){
                //찾았으면
                var cont = aDiv.html();
                cont = cont.replace(/<\/div>/g,'').replace(/<div>|<br>/g,'\\n');
                var realRowIndex = aTr.attr('realrowindex');
                var colid = $(aTd).prev().find('label').attr("id");
                var grd = _grid[0];
                $m.setCellData(grd,realRowIndex,colid,cont);
            }
            
        }
    }else{
        console.log('selectedDetailView',selectedDetailView);
    }
}

Moca.prototype._detailView1 = function(_thisObj) {
    var _type = $m.getType(_thisObj); 
    var grd = $m.getTypeObj(_thisObj);
    $m._detailViewContentCopy(_thisObj);
    grd.attr('selectedDetailView',1);
    var selectedRealRowIndex = grd[0].getAttribute("selectedRealRowIndex");
    if(selectedRealRowIndex != null){
        var foundedRow = grd.find('tbody:first>tr[realrowindex='+selectedRealRowIndex+']');
        var tdArr = foundedRow.find('td');
        $m.removeCol(tdArr);
        var _html = '';
        for(var i=0;i < tdArr.length; i++){
            var aTd = tdArr[i];
            _html +='           <tr realrowindex='+selectedRealRowIndex+'> ';
            _html += $m._detailViewMakeTd(aTd);
            _html +='           </tr> ';
        }
        
        grd.find('#gridDetail2').html('');
        grd.find('#gridDetail3').html('');
        grd.find('#gridDetail1').html(_html);
        $(_thisObj).closest("div[type="+_type+"]").find(".gridDetail_body").css('display','block'); 
    }else{
        $m.alert("상세보기할 행을 선택하세요!");
    }

}

Moca.prototype.removeCol = function(tdArr) {
    for(var i=(tdArr.length-1);i > -1; i--){
        var aTd = tdArr[i];
        var name = aTd.getAttribute("name");
        if(name == '선택' || name == '상태'){
            tdArr.splice(i, 1);
        }
    }
}

Moca.prototype._detailViewMakeTd = function(aTd) {
    var _html = '';
    var isContentEditable = false;
    var contents = '';
    if($(aTd).find('input').length > 0){
        isContentEditable = true;
        contents = $(aTd).find('input').val().replace(/\\n|\n/g,'<br>');
    }else{
        contents = aTd.innerHTML.replace(/\\n|\n/g,'<br>')
    }
    _html +='               <th><label id='+aTd.getAttribute("id")+'>'+aTd.getAttribute("name")+'</label></th> ';
    _html +='               <td><div contenteditable="'+isContentEditable+'" placeholder="">'+contents+'</div></td> ';
    return _html;
};

Moca.prototype._detailView2 = function(_thisObj) {
    var _type = $m.getType(_thisObj); 
    var grd = $m.getTypeObj(_thisObj);
    $m._detailViewContentCopy(_thisObj);
    grd.attr('selectedDetailView',2);
    
    var selectedRealRowIndex = grd[0].getAttribute("selectedRealRowIndex");
    var foundedRow = grd.find('tbody:first>tr[realrowindex='+selectedRealRowIndex+']');
    var tdArr = foundedRow.find('td');
    $m.removeCol(tdArr);
    var _html = '';
    
    for(var i=0;i < tdArr.length;){
        _html +='           <tr realrowindex='+selectedRealRowIndex+'> ';
        
        var aTd = tdArr[i];
        _html += $m._detailViewMakeTd(aTd);
        if(i+1 < tdArr.length){
            var aTd = tdArr[i+1];

            _html += $m._detailViewMakeTd(aTd);
        }else{
            _html +='               <th><label></label></th> ';
            _html +='               <td></td> ';
        }
        _html +='           </tr> ';
        i = i+2;
    }
    grd.find('#gridDetail1').html('');
    grd.find('#gridDetail3').html('');  
    grd.find('#gridDetail2').html(_html);
    $(_thisObj).closest("div[type="+_type+"]").find(".gridDetail_body").css('display','block'); 
}
Moca.prototype._detailView3 = function(_thisObj) {
    var _type = $m.getType(_thisObj); 
    var grd = $m.getTypeObj(_thisObj);
    $m._detailViewContentCopy(_thisObj);
    grd.attr('selectedDetailView',3);
    var selectedRealRowIndex = grd[0].getAttribute("selectedRealRowIndex");
    var foundedRow = grd.find('tbody:first>tr[realrowindex='+selectedRealRowIndex+']');
    var tdArr = foundedRow.find('td');
    $m.removeCol(tdArr);
    var _html = '';
    for(var i=0;i < tdArr.length;){
        _html +='           <tr realrowindex='+selectedRealRowIndex+'> ';
        
        var aTd = tdArr[i];
        _html += $m._detailViewMakeTd(aTd);
        i = i+1;
        if(i < tdArr.length){
            var aTd = tdArr[i];
            _html += $m._detailViewMakeTd(aTd);
        }else{
            _html +='               <th><label></label></th> ';
            _html +='               <td></td> ';
            _html +='               <th><label></label></th> ';
            _html +='               <td></td> ';    
            break;
        }
        i = i+1;
        if(i < tdArr.length){
                var aTd = tdArr[i];
                _html += $m._detailViewMakeTd(aTd);
        }else{
            _html +='               <th><label></label></th> ';
            _html +='               <td></td> ';
            break;
        }
        _html +='           </tr> ';
        i = i+1;
    }
    grd.find('#gridDetail1').html('');
    grd.find('#gridDetail2').html('');      
    grd.find('#gridDetail3').html(_html);
    $(_thisObj).closest("div[type="+_type+"]").find(".gridDetail_body").css('display','block');     
    
}
Moca.prototype.longToDate = function(_longValue) {
    if(_longValue != null && $.trim(_longValue) != ''){
        var d = new Date(parseInt(_longValue));
        var nowtime = d.getFullYear()+"-";
        nowtime += comLib.gfn_toTwoChar(d.getMonth()+1)+"-";
        nowtime += comLib.gfn_toTwoChar(d.getDate())+" ";
        nowtime += comLib.gfn_toTwoChar(d.getHours())+":";
        nowtime += comLib.gfn_toTwoChar(d.getMinutes())+":";
        nowtime += comLib.gfn_toTwoChar(d.getSeconds());
        return nowtime;     
    }else{
        return "";
    }
}

Moca.prototype.isNull = function(_val) {
    ['입력값 null 체크 함수'];
    _val = $.trim(_val);
    if(_val =='undefined' || _val == "null" || _val == null || _val == undefined ){
        _val = '';
    }

    if(_val == ''){
        return true;
    }else{
        return false;
    }
}

Moca.prototype.trim = function(_val) {
    ['입력값 null 체크 함수'];
    if(_val == null || _val == undefined ){
        _val = '';
    }else if((typeof _val == 'string' &&  (_val.trim() == 'undefined' || _val.trim() == "null"))){
        _val = '';
    }else{
        _val = (_val+'').trim();
    }
    return _val;
}

Moca.prototype.menuSearch = function(_thisObj) {
    ['메뉴찾기'];
    var str = JSON.stringify($m.menuObjs_ori);
    var reg = new RegExp("\{((?!"+_thisObj.value+")[^{])+?\},*","ig");
    str =str.replace(reg,'');
    str =str.replace(/\,\]/g,']');
    $m.menuObjs = JSON.parse(str);
    if(_thisObj.value != null && $.trim(_thisObj.value) != '' && $m.menu != null){
        for(var i=0; i < $m.menu.length; i++){
            var o = $m.menu[i];
            o['open_close'] = 'open';
        }
    }else{
        for(var i=0; i < $m.menu.length; i++){
            var o = $m.menu[i];
            if(i == 0){
                o['open_close'] = 'open';
            }else{
                o['open_close'] = 'close';
            }
            
        }
    }
    $m.tree_mt("tree1",$m.menu,$m.menuObjs);
}

Moca.prototype.getParameter = function(arguments) {
    ['팝업파라미터구하기'];
    return $m.data[arguments[0]];
}


Moca.prototype.fileDownloadAjax = function(_opt) {
    ['Ajax버전의 파일다운로드 함수'];
    var _parammap = _opt['param'];
    var downloadUrl = _opt['url'];
    var _errorMessage = _opt['errorMessage'];
    var _messageTag = _opt['progressTag'];
    var _pageId = _opt.pageId;
    var _srcId = _opt.srcId;
    
    if(downloadUrl == null){
        downloadUrl = "/efms/EFL_CAFL/download.do";
    }
    var xhttp = new XMLHttpRequest();
    //var loadingId = $m.loading2(null,null,_messageTag);
    $m.writeMessage({srcId:_srcId,pageId:_pageId,message:"진행중",url:downloadUrl });
    xhttp.onreadystatechange = function(){
        if(xhttp.readyState == 4 && xhttp.status == 200){
            //$m.loading(loadingId,0);
            $m.userLogInsert({URL:_opt.url,SRCID:_opt.id,LABEL:_opt.param.FILE_REAL_NM,MENU_NM:_opt.title});
            $m.writeMessage({srcId:_srcId,pageId:_pageId,message:"완료",url:downloadUrl});
            
            var cd = xhttp.getResponseHeader('content-disposition');
            if(cd == null){
                $m.alert(_errorMessage);
                return;
            }
            var ar = cd.split(';');
            var fNameParam = ar[1];
            var ar2 = fNameParam.split('=');
            var fileName = ar2[1];
            var _fileName = decodeURIComponent(fileName);
            fileName = _fileName.replace(/\"/g,'');
            if($m.isChrome()){
                var a = document.createElement('a');
                a.id = 'tmpDownload';
                a.href = window.URL.createObjectURL(xhttp.response);
                a.download = fileName;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
            }else{
                window.navigator.msSaveOrOpenBlob(xhttp.response,_fileName);
            }

        }else if(xhttp.readyState == 4 && xhttp.status == 500){
            //$m.loading(loadingId,0);
            var blob = new Blob([this.response],{type:'application/json'});
            var fileReader = new window.FileReader();
            fileReader.readAsText(blob);
            fileReader.onloadend = function(){
                var msg = JSON.parse(fileReader.result)['msg'];
                alert(msg);
                return false;
            }
            //{"statCd":-1,"msg":"파일이 존재하지 않습니다.","reason":"Internal Server Error","path":"/co/coc/FileUpload/downloadFile.do","locale":"ko"}
        }
    };
    xhttp.onerror = function(){
        //$m.loading(loadingId,0);
        $m.writeMessage({srcId:_srcId,pageId:_pageId,message:"오류",url:downloadUrl});
        if(this.response != null){
            var blob = new Blob([this.response],{type:'application/json'});
            var fileReader = new window.FileReader();
            fileReader.readAsText(blob);
            fileReader.onloadend = function(){
                var msg = JSON.parse(fileReader.result)['msg'];
                alert('6576:'+msg);
                return false;
            }
        }
    };
    xhttp.open("POST",downloadUrl);
    //xhttp.setRequestHeader("Content-Type","application/json;charset=UTF-8");
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.responseType = 'blob';
        if(typeof _parammap == 'object'){
            xhttp.send("body="+JSON.stringify(_parammap)+"&header="+JSON.stringify({TRANID:"TRAN_"+$m.now()+$m.shuffleRandom(6)}));
        }else{
            xhttp.send(_parammap);
        }

};

Moca.prototype.isChrome = function () {
    ['현재 브라우저가 크롬인지 아닌지 판단하는 함수'];
    var a = navigator.userAgent;
    if(a != null && a.indexOf('Chrome') > -1){
        return true;
    }else{
        return false;
    }
};





//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
String.prototype.startsWith = function(searchString, position) {
    position = position || 0;
    return this.indexOf(searchString, position) === position;
};

Array.prototype.clone = function() {
    /*
    if(this.length < 500000){
        return JSON.parse(JSON.stringify(this));
    }else{
        var arr1 = this.slice(0,500000);arr1 = JSON.parse(JSON.stringify(arr1));
        var arr2 = this.slice(500001,this.length);arr2 = JSON.parse(JSON.stringify(arr2));
        return arr1.concat(arr2);
    }*/
    return JSON.parse(JSON.stringify(this));
    
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Moca.prototype.setCORP_CD = function(CORP_CD){
    sessionStorage['CORP_CD'] = CORP_CD;
};

Moca.prototype.getCORP_CD = function(){
    return sessionStorage['CORP_CD'];
};

Moca.prototype.setSession = function(_key,_val){
    sessionStorage[_key] = _val;
};

Moca.prototype.getSession = function(_key){
    return sessionStorage[_key];
};


Moca.prototype.getCORP_CD = function(){
    return sessionStorage['CORP_CD'];
};

Moca.prototype.getCombo = function(_id){
    return $($m.getObj(_id)).find('select').val();
};
Moca.prototype.getSearchCombo = function(_id){
    var jobj = $($m.getObj(_id));
    return {value:jobj.attr("value"),text:jobj.attr("text")};
};
Moca.prototype.getCombo = function(_id){
    return $($m.getObj(_id)).find('select').val();
};
Moca.prototype.getComboLabel = function(_id){
    var o = $($m.getObj(_id)).find('select');
    var v = o.val();
    var l = o.find('option[value='+v+']').text();
    return l;
};

Moca.prototype.getCheckbox = function(_id){
    var obj = {};
    obj.label = $($m.getObj(_id)).find('input[type=checkbox]').next().text();
    obj.checked = $($m.getObj(_id)).find('input[type=checkbox]').is(':checked');
    if(obj.checked){
        obj.value = 1;
    }else{
        obj.value = 0;
    }
    return obj;
};


Moca.prototype.getInput = function(_id){
    return $m.getObj(_id,"input").value;
};

Moca.prototype.getFrom = function(_id){
    return $($m.getObj(_id)).find('input')[0].value;
};
Moca.prototype.getTo = function(_id){
    return $($m.getObj(_id)).find('input')[1].value;
};

Moca.prototype.setFrom = function(_id,_val){
    $($m.getObj(_id)).find('input')[0].value = _val;
};
Moca.prototype.setTo = function(_id,_val){
    $($m.getObj(_id)).find('input')[1].value = _val;
};

Moca.prototype.setFromToByMenuId = function(_id,_menuId,_srcId){
    var o = $('#'+_menuId);
    var calObj = $m[_srcId].getObj(_id);
    if(o.length > 0 && calObj != null){ 
        var node = o.find('SPAN')[0];
        var _toDate = $.trim(node.getAttribute("toDate"));
        if($m.trim(_toDate) != '' && $m.trim(_toDate) != 'undefined'){
            if(isNaN(_toDate.replace(/-/g,''))){
                var _toObj = $m.getFromToByOption(_toDate);
                if(!isNaN(_toObj.to.replace(/-/g,''))){
                    _toDate = _toObj.to;
                }else{
                    _toDate = '';
                }
            }
            if(_toDate != '' && _toDate != null){
                if(calObj != null){
                    $(calObj).find('input')[1].value = _toDate;
                }
            }
        }
        
        var _fromDate = $.trim(node.getAttribute("fromDate"));
        if($m.trim(_fromDate) != '' && $m.trim(_fromDate) != 'undefined'){
            if(isNaN(_fromDate.replace(/-/g,''))){
                var _fromObj = $m.getFromToByOption(_fromDate,_toDate);
                
                if(!isNaN(_fromObj.from.replace(/-/g,''))){
                    _fromDate = _fromObj.from;
                }else{
                    _fromDate = '';
                }
            }
            
            if(calObj != null){
                $(calObj).find('input')[0].value = $m.getDisplayFormat_value(calObj,_fromDate);
            }
        }
    }
};


Moca.prototype.getRandomArray = function(_list,_cnt){ 
    var returnArray = [];
    if(_list != null && _cnt >_list.length){
        return returnArray;
    }else{
        var __list = _list.clone();
        //var __list = _list;
        for(var i=0; i < _cnt; i++){
            var idx = Math.floor(Math.random() * (__list.length-1));
            var row = __list.splice(idx, 1);
            returnArray.push(row[0]["_system"]["realIndex"]);
        }
        return returnArray;
    }
};
Moca.prototype.default_keyup = function(_thisInputObj){ 
    if(event.keyCode == 13){
        var searchBtn = $(_thisInputObj).closest(".moca_shbox").find(".btn_sc");
        searchBtn.click();
    }
};

Moca.prototype.bindCombo = function(compId,codeOpt,_list){ 
    var compObj = $m.getObj(compId);
    compObj['list'] = _list;
    compObj['codeOpt'] = codeOpt;
    $m.renderCombo(compObj,null,'normal',null);
};

Moca.prototype.bindCell = function(grdId,cellId,codeOpt,_list){ 
    var g_obj = $m.getObj(grdId);
    if(g_obj[cellId] == undefined){
        g_obj[cellId] = {};
        g_obj[cellId]['codeOpt'] = codeOpt;
    } 
    g_obj[cellId]['list'] = _list;
    g_obj[cellId]['map'] = $m.listToMap(g_obj[cellId]['list'],g_obj[cellId]['codeOpt']);
};
Moca.prototype.comma = function(__num){ 
    var _num = '';
    if(__num != null){
        _num = (__num+'').replace(/,/g,'');
    }else{
        _num = '';
    }
    try{
        
        Number(_num);
    }catch(e){
        return _num;
    }
    
    
    if(_num == null || $.trim(_num) == ''){
        _num = '';
    }
    if(isNaN(_num+'')){
        return _num;
    }
    var temp = _num+"";
    var leng = temp.length;
    var re = '';
    for(var i=leng-1,j=0; i > -1; i--,j++){
        if(j !=0 && j%3 == 0){
            re = temp.charAt(i)+","+re;
        }else{
            re = temp.charAt(i)+re;
        }
        
    }
    return re;
    
};


Moca.prototype.comma_df = function(_value,_grd,_rowIndex){ 
    return _value;
    
};





Moca.prototype.closePopup = function(_thisObj){ 
    ["팝업닫기!"]
    var popupObj;
    if(typeof _thisObj == 'string'){
        //인자가 popupID인 경우
        popupObj = $('#'+_thisObj)[0];
    }else{
        popupObj = $(_thisObj).parent().parent().parent()[0];
    }
    if(popupObj != null && $(popupObj).length > 0){
        if(popupObj.option.scopeId != null){
            $m.pageId = popupObj.option.scopeId;
            $m.srcId = $('div[pageid='+$m.pageId+'].moca_tab_panel').attr('srcid');
            popupObj.option.mdiObj.removeChild(popupObj); 
        }else{
            document.body.removeChild(popupObj);
        }
    }
};

Moca.prototype.popupMove = function(e){ 
    ["팝업이동!"]
    event.preventDefault();
    var thisObj = document.nowPopup;
    if(thisObj.option.scopeId != null && thisObj.option.scopeId.startsWith('MDI')){
    	
        var openerObj = $('#mdi_1')[0];
        if(opener && $(thisObj).attr('pageid') != parent.name){
        	openerObj = $('#'+parent.name)[0];
        }
        var oTop = openerObj.offsetTop;
        var oLeft = openerObj.offsetLeft;
        
        
        var mouseX = e.pageX;
        var divX = Number($(thisObj).css('left').replace(/px/g,''));
        var _gepX = mouseX-(divX+oLeft);
        if(thisObj.gepX == null){
            thisObj.gepX = _gepX;
        }
        var _x = mouseX-thisObj.gepX-oLeft;
        $(thisObj).css('left',_x);

        var mouseY = e.pageY;
        var divY = Number($(thisObj).css('top').replace(/px/g,''));  
        var _gepY = mouseY-(divY+oTop);
        if(thisObj.gepY == null){
            thisObj.gepY = _gepY;
        }
        var _y = mouseY-thisObj.gepY-oTop;
        $(thisObj).css('top',_y);   
        //console.log($(thisObj).css('left'),$(thisObj).css('top'));
    }else{
        var mouseX = e.pageX;
        var divX = $(thisObj).offset().left;
        var _gepX = mouseX-divX;
        if(thisObj.gepX == null){
            thisObj.gepX = _gepX;
        }
        var _x = mouseX-thisObj.gepX;
        var outline_gep = 10;
        var _x_max = $(window).width()+$('body').scrollLeft() - $(thisObj).width()-outline_gep;//window창의 outline좌우의 합
/*
        if(_x > _x_max+2){
            _x = _x_max;
            document.removeEventListener('mousemove',$m.popupMove,false);
            thisObj.gepX = null;
            thisObj.gepY = null;
        }else if(_x > _x_max){
            _x = _x_max;
        }else if(_x < -2+$('body').scrollLeft()){
            _x = 0+$('body').scrollLeft();
            document.removeEventListener('mousemove',$m.popupMove,false);
            thisObj.gepX = null;
            thisObj.gepY = null;
        }else if(_x < 0+$('body').scrollLeft()){
            _x = 0+$('body').scrollLeft();
        }
*/
        if(_x > _x_max){
            _x = _x_max;
        }else if(_x < 0+$('body').scrollLeft()){
            _x = 0+$('body').scrollLeft();
        }
         
        $(thisObj).css('left',_x);
        
        var mouseY = e.pageY;
        var divY = $(thisObj).offset().top;   
        var _gepY = mouseY-divY;
        if(thisObj.gepY == null){
            thisObj.gepY = _gepY;
        }
        var _y = mouseY-thisObj.gepY;
        var _y_max = $(window).height()+$('body').scrollTop() - $(thisObj).height()-outline_gep*3;//window창의 outline좌우의 합
/*
        if(_y > _y_max+2){
            _y = _y_max;
            document.removeEventListener('mousemove',$m.popupMove,false);
            thisObj.gepX = null;
            thisObj.gepY = null;    
        }else if(_y > _y_max){
            _y = _y_max;
        }else if(_y < -2){
            _y = 0;
            document.removeEventListener('mousemove',$m.popupMove,false);
            thisObj.gepX = null;
            thisObj.gepY = null;
        }else if(_y < 0){
            _y = 0;
        }
*/
        if(_y > _y_max){
            _y = _y_max;
        }else if(_y < 0){
            _y = 0;
        }

        
        $(thisObj).css('position','fixed'); 
        
        $(thisObj).css('top',_y);   
    }
    
};


Moca.prototype.https = function(_path,_pass,_domain,_port){ 
    ['make keystore 실행예제 : $m.https("C:/Temp/","test","localhost","8445");'];
    var returnStr = '';
    returnStr += '\n';
    returnStr += '1단계 개인키생성' + '\n';
    returnStr += 'genrsa -out ' +_path+'private.key 2048' + '\n';
    
    returnStr += '\n';
    returnStr += '2단계 공개키생성' + '\n';
    returnStr += 'rsa -in '+_path+'private.key -pubout -out '+_path+'public.key' + '\n';
    
    returnStr += '\n';
    returnStr += '3단계 인증요청서생성(엔터4번치고 COMMON NAME 물어볼때만 "localhost" 입력필수 아주중요)' + '\n';
    returnStr += 'req -new -key '+_path+'private.key -config ./openssl.cnf -out '+_path+'private.csr'+'\n';
    returnStr += '엔터5번치고' + '\n';
    returnStr += _domain + '\n';
    returnStr += '끝까지 엔터' + '\n';

    returnStr += '\n';
    returnStr += '4단계 사설key생성' + '\n';
    returnStr += 'genrsa -aes256 -out '+_path+'rootCA.key 2048' + '\n';
    returnStr += _pass + '\n';
    returnStr += _pass + '\n';
    
    returnStr += '\n';
    returnStr += '5단계 사설pem생성' + '\n';
    returnStr += 'req -x509 -new -nodes -key '+_path+'rootCA.key -days 3650 -config ./openssl.cnf -out '+_path+'rootCA.pem' + '\n';
    returnStr += _pass + '\n';
    returnStr += '끝까지 계속엔터' + '\n';

    returnStr += '\n';
    returnStr += '6단계 CRT생성' + '\n';    
    returnStr += 'x509 -req -in '+_path+'private.csr -CA '+_path+'rootCA.pem -CAkey '+_path+'rootCA.key -CAcreateserial -out '+_path+'private.crt -days 3650' + '\n';
    returnStr += _pass + '\n';
    
    returnStr += '\n';
    returnStr += '7단계 keystore생성' + '\n';       
    returnStr += 'pkcs12 -export -in '+_path+'private.crt -inkey '+_path+'private.key -out '+_path+'.keystore -name tomcat' + '\n';
    returnStr += _pass + '\n';
    returnStr += _pass + '\n';
    
    
    returnStr += '\n';
    returnStr += '8단계 tomcat server.xml에 추가할 https Connector태그' + '\n';
    returnStr += '<Connector port="'+_port+'" protocol="org.apache.coyote.http11.Http11NioProtocol" maxThreads="150" SSLEnabled="true" scheme="https" secure="true" clientAuth="false" sslProtocol="TLS" keystorePass="'+_pass+'" keystoreFile="'+_path+'.keystore" />' + '\n';


    return returnStr;
    
};

Moca.prototype.fn_display_rownum = function(_value,_grd,_rowIndex){ 
    ['순번 ']
    return $m.comma(Number(_rowIndex)+1)+"";
};
Moca.prototype.setter_pageId = function(_pageId,_srcId,_functionName,thisObj){ 
    ['순번 ']
    $m.pageId = _pageId;
    $m.srcId = _srcId;
    eval(_functionName)(thisObj);
};
Moca.prototype.getNumber = function(_value){ 
    ['string을 숫자로 변환하기']
   if (isNaN(_value)) {
         return 0;
   }else{
       return Number(_value);
   }
};

Moca.prototype.sortObject = function(o){
    ['object를 키 이름으로 정렬하여 반환']
    var sorted = {},
    key, a = [];
    // 키이름을 추출하여 배열에 집어넣음
    for (key in o) {
        if (o.hasOwnProperty(key)) a.push(key);
    }
    // 키이름 배열을 정렬
    a.sort();
    // 정렬된 키이름 배열을 이용하여 object 재구성
    for (key=0; key<a.length; key++) {
        sorted[a[key]] = o[a[key]];
    }
    return sorted;
};

Moca.prototype.sortObjectNumString = function(o){
    ['object를 키 이름으로 정렬하여 반환']
    
    var collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
    var myArray = Object.keys(o);
    myArray.sort(collator.compare);
    myArray.reverse();
    var reMap = {};
    for(var i=0; i < myArray.length; i++){
        var key = myArray[i];
        var val = o[key];
        reMap[key] = val;
    }
    
    return reMap;
};

Moca.prototype.filterRemoveAllConfirm = function(_thisObj){
    ['현재 그리드의 모든 필터를 제거를 물어봅니다.']
    $m.confirm('현재 그리드의 모든 필터를 제거하시겠습니까?',function(result){
        if(result == 'Y'){
            var grd = $(_thisObj).closest('div[type=grid]');
            $m.filterRemoveAll(grd);
            $m.drawGrid(grd[0].id, grd[0].ori_list);
        }
    });
};

Moca.prototype.filterRemoveAll = function(grd,_pageId,_srcId){
    ['현재 그리드의 모든 필터를 제거합니다.']
    if(grd.length == null){
        grd = $(grd);
    }
    grd[0].appliedFilterMap = null;
    grd[0].appliedFilterArr = null;
    delete grd[0]['filterMaxIdx'];
    grd[0]['filterIdx'] = {};
    grd[0].filter = {};
    var thArray = grd.find('thead:first th[filterableId]');
    for(var i=0; i < thArray.length; i++){
        var aTh = thArray[i];
        var hObj = $('#'+aTh.id);
        var filterableId = aTh.getAttribute("filterableId");
        hObj.find('.moca_grid_filter_btn').removeClass('multi');
        hObj.find('i').text('');
        if(i == thArray.length-1){
            grd[0].filterMaxIdx = null;
        }
    }
};


Moca.prototype.filterSetColor = function(_thisObj){
    ['현재 그리드의 모든 필터를 제거합니다.']
    if(_thisObj.checked){
        if(!$(_thisObj).closest('li').hasClass('on')){
            $(_thisObj).closest('li').addClass('on');
        }
    }else{
        $(_thisObj).closest('li').removeClass('on');
    }
};

Moca.prototype.expand = function(thisObj,_headerId,_tdId){
    ['필터펼치기']
    if($(thisObj).find('i').hasClass('fa-angle-double-down')){
        $(thisObj).find('i').removeClass('fa-angle-double-down');
        $(thisObj).find('i').addClass('fa-angle-double-up');
        var grd = $(thisObj).closest('div[type=grid]')[0];
        var d = $(thisObj).closest('div.filterheader').next();
        var h = $(grd).offset().top + $(grd).height() - d.offset().top;
        $(thisObj).closest('div.filterheader').next().css('max-height',h+'px');
    }else{
        $(thisObj).find('i').removeClass('fa-angle-double-up');
        $(thisObj).find('i').addClass('fa-angle-double-down');
        $(thisObj).closest('div.filterheader').next().css('max-height','89px');
    }
    
};



Moca.prototype.realtimeSearch = function(_thisObj) {
    ['필터찾기'];
    var filterDiv = $(_thisObj).closest('div.filterheader').next();
    filterDiv.find('li').css('display','');
    filterDiv.find('li:not(:contains("'+_thisObj.value+'"))').css('display','none');
};

Moca.prototype.writeMessage = function(_obj) {
    ['메세지보이기'];
    if(_obj != null){
    	_obj.url = _obj.url.replace(/http[s]*\:\/\/([^/])*\:?[0-9]*/g,'');
        if(_obj.url.indexOf(mocaConfig.userLogUrl) == -1){
            if($m.messages.length > 20){
                $m.messages.splice(0, 10);
            }
            
            for(var i=0; i < $m.messages.length; i++){
                var o = $m.messages[i];
                if(_obj.srcId+'__'+_obj.url == o.srcId+'__'+o.url){
                    $m.messages.splice(i, 1);
                }
            }
            
            /*
            if($m.messages.length > 2){
                for(var i=0; i < $m.messages.length; i++){
                    var o = $m.messages[i];
                    if(o.message == '완료'){
                        $m.messages.splice(i, 1);
                        break;
                    }
                    if(i == $m.messages.length -1){
                        $m.messages.splice(i, 1);
                    }
                }
                
            }
            */
            $m.messages.push(_obj);
            //$m.messagesMap[_obj.srcId+'__'+_obj.url+'__'+_obj.message] = _obj;
        }
        
        var ta = $('.toast_msg > .toast_area');
        ta.html('');
        var leng = $m.messages.length;
        for(var i=leng-1; i > -1; i--){
            var o = $m.messages[i];
            var tag = '';
            if(o.message == '진행중'){
                tag = "<i class='fas ico_progress blinking ml10'>"+o.message+"</i>"+"["+o.srcId+":"+o.url+"]";
            }else if(o.message == '완료'){
                tag = "<i class='fas fa-check-circle ico_success ml10'>"+o.message+"</i>"+"["+o.srcId+":"+o.url+"]";
            }else{
                tag = "<i class='fas fa-exclamation-triangle ico_error ml10'>"+o.message+"</i>"+"["+o.srcId+":"+o.url+"]";
            }
            if(i == leng-1){
                tag = "<b>"+tag+"</b>";
            }
            ta.html(ta.html()+tag);
        }
    }
}

Moca.prototype.createColGroup = function(_thisObj) {
    ['컬럼그룹추가'];
    var _type = $m.getType(_thisObj); 
    var td = $(_thisObj).closest('td').prev();
    var ipt = td.find('.moca_input');
    var groupNm = ipt.val();
    if(groupNm == null || groupNm == ''){
        alert('그룹명을 입력하세요!');
        ipt.focus();
        return;
    }
    
    var resultArr = $(_thisObj).closest('.ly_col_cont').find('.groupList a:contains("'+groupNm+'")');
    if(resultArr != null && resultArr.length > 0){
        alert('이미있는 그룹명입니다. 다른 그룹명을 입력하세요!');
        ipt.focus();
        return;
    }
    var colorCd = td.find('.moca_input_color').val();
    var g_jq = $(_thisObj).closest("div[type="+_type+"]");
    var _srcId =g_jq.attr('srcId');
    var _compId =g_jq.attr('id');
    var colGroupObj = $m.getLocalStorage(_srcId,_compId,'colGroup');
    if(colGroupObj == null) colGroupObj = {};
    colGroupObj[groupNm] = {colorCd:colorCd};
    $m.setLocalStorage(_srcId,_compId,'colGroup',colGroupObj);
    $m.listColGroup(_thisObj);
}

Moca.prototype.listColGroup = function(_thisObj) {
    ['컬럼그룹리스트'];
    var _type = $m.getType(_thisObj); 
    var td = $(_thisObj).closest('td').prev();
    var groupNm = td.find('.moca_input').val();
    var colorCd = td.find('.moca_input_color').val();
    var g_jq = $(_thisObj).closest("div[type="+_type+"]");
    var _srcId =g_jq.attr('srcId');
    var _compId =g_jq.attr('id');
    var colCheckList = g_jq.find(".groupColList");
    var colGroupObj = $m.getLocalStorage(_srcId,_compId,'colGroup');
    var nogroup = colGroupObj["그룹없음"];
    delete colGroupObj["그룹없음"];
    
    
    var keys = Object.keys(colGroupObj);
    var _html = '';
    keys.splice(0, 0,"그룹없음");
    for(var i=0; i < keys.length; i++){
        var key = keys[i];
        var valueObj = colGroupObj[key];
        if(key == "그룹없음"){
            valueObj = nogroup;
        }
        _html +='                   <tr>';
        _html +='                       <td onclick="$m._col_groupSelected(this)">';
        _html +='                           <span class="color" style="background-color:'+valueObj.colorCd+'"></span>';
        _html +='                           <a class="title fl">'+key+'</a>';
        if(key != '그룹없음'){
            
            _html +='                           <div class="fr">';
            _html +='                               <div class="moca_radio mr5">';
            if(valueObj.showHide != '0'){
                _html +='                                   <input type="radio" name="radio_'+key+'" id="radio_'+key+'_1" checked  value="1"  onclick="$m.grpRadioClick(this)" >';
                _html +='                                   <label for="radio_'+key+'_1">보이기</label>';
                _html +='                                   <input type="radio" name="radio_'+key+'" id="radio_'+key+'_2"  value="0"  onclick="$m.grpRadioClick(this)" >';
                _html +='                                   <label for="radio_'+key+'_2">숨기기</label>';
            }else{
                _html +='                                   <input type="radio" name="radio_'+key+'" id="radio_'+key+'_1"   value="1"  onclick="$m.grpRadioClick(this)" >';
                _html +='                                   <label for="radio_'+key+'_1">보이기</label>';
                _html +='                                   <input type="radio" name="radio_'+key+'" id="radio_'+key+'_2" checked  value="0"  onclick="$m.grpRadioClick(this)" >';
                _html +='                                   <label for="radio_'+key+'_2">숨기기</label>';  
            }
            _html +='                               </div>';
            _html +='                               <button type="button" class="button btn_close2" style="" title="" onclick="$m._col_groupClose(this,\''+_srcId+'\',\''+_compId+'\',\''+key+'\')"></button>';
            _html +='                           </div>';    
        }
        _html +='                       </td>';
        _html +='                   </tr>';

        if(valueObj.checkList != null){
            var arr = Object.keys(valueObj.checkList);
            if(arr != null){
                for(var k=0; k < arr.length; k++){
                    if($m.trim(arr[k]) != ''){
                        var aCheck = colCheckList.find('[type=checkbox][columnId='+arr[k]+']');
                        aCheck.attr('groupId',key);
                        if(key != '그룹없음'){
                            aCheck.attr('checked',true);
                        }
                        var spanObj = aCheck.next().find('span');
                        spanObj.css('background-color',valueObj.colorCd).css('background-position', '2px -14px');
                    }
                }
            }
        }

    }
    $(_thisObj).closest('table').next().html(_html);
    var grpList = g_jq.find(".groupList");
    $m._col_groupSelected(grpList.find('td:first'));
    
    
    var groupListon = grpList.find('.on');
    var color = groupListon.find('.color').css('background-color');
    var name = groupListon.find('a').html();
    if(name == '그룹없음'){
        colCheckList.find('[type=checkbox][groupid!="그룹없음"]').closest('li').css('display','none');
        colCheckList.find('[type=checkbox]').css('display','none');
        colCheckList.find('[type=checkbox]').next().find('span').css('display','none');
    }else{
        colCheckList.find('[type=checkbox][groupid!="그룹없음"]').closest('li').css('display','inline-block');
        colCheckList.find('[type=checkbox]').css('display','inline-block'); 
        colCheckList.find('[type=checkbox]').next().find('span').css('display','inline-block');     
    }
}



Moca.prototype.setLocalStorage = function(_srcId,_compId,_groupKey,_Obj){
    var sessionKey = $m.getCORP_CD()+'/'+$m.getSession("USER_ID");
    var compKey = _srcId+'/'+_compId;
    var st_key = sessionKey+'___'+compKey+'___'+_groupKey;
    localStorage[st_key] = JSON.stringify(_Obj);
};

Moca.prototype.getLocalStorage = function(_srcId,_compId,_groupKey,_key){
    var sessionKey = $m.getCORP_CD()+'/'+$m.getSession("USER_ID");
    var compKey = _srcId+'/'+_compId;
    var st_key = sessionKey+'___'+compKey+'___'+_groupKey;
    var compOption = localStorage[st_key];
    if(compOption == null){
        compOption = '{}';
    }
    compOption = JSON.parse(compOption);
    if(_key != null){
        return compOption[_key];
    }else{
        return compOption;  
    }

};

Moca.prototype.removeLocalStorage = function(_srcId,_compId,_groupKey,_key){
    var sessionKey = $m.getCORP_CD()+'/'+$m.getSession("USER_ID");
    var compKey = _srcId+'/'+_compId;
    var st_key = sessionKey+'___'+compKey+'___'+_groupKey;
    delete localStorage[st_key];
};

Moca.prototype._col_groupClose = function(_thisObj,_srcId,_compId,key) {
    var _type = $m.getType(_thisObj); 
    var _groupKey = 'colGroup';
    var _Obj = $m.getLocalStorage(_srcId,_compId,'colGroup');
    delete _Obj[key];
    $m.setLocalStorage(_srcId,_compId,_groupKey,_Obj);
    $m.listColGroup($m.getTypeObj(_thisObj).find('.btn_plus')[0]);
};

Moca.prototype._col_groupSelected = function(_thisObj) {
    var _type = $m.getType(_thisObj); 
    var t = $(_thisObj).closest('table');
    if(t != null){
        t.find('.on').removeClass('on');
    }
    $(_thisObj).addClass('on');
    var name = $(_thisObj).find('a').html();
    var g_jq = $m.getTypeObj(_thisObj);
    var _srcId =g_jq.attr('srcId');
    var _compId =g_jq.attr('id');
    var colCheckList = g_jq.find(".groupColList");
    var _Obj = $m.getLocalStorage(_srcId,_compId,'colGroup');
    
    if(name == '그룹없음'){
        colCheckList.find('[type=checkbox][groupid!="그룹없음"]').closest('li').css('display','none');
        colCheckList.find('[type=checkbox]').css('display','none');
        colCheckList.find('[type=checkbox]').next().find('span').css('display','none');
        colCheckList.find('.moca_radio').css('display','inline-block');
        //var _groupKey = 'colGroup';
    }else{
        colCheckList.find('[type=checkbox][groupid!="그룹없음"]').closest('li').css('display','inline-block');
        colCheckList.find('[type=checkbox]').css('display','inline-block'); 
        colCheckList.find('[type=checkbox]').next().find('span').css('display','inline-block'); 
        colCheckList.find('.moca_radio').css('display','none');
    }
    if($(_thisObj).find('[type=radio]')[0] != null){
        var showHide = ($(_thisObj).find('[type=radio]')[0].checked == true)? "1":"0";//1 or 0
        if(_Obj[name] != null){
            var checkList = _Obj[name].checkList;
            if(checkList != null){
                var ks = Object.keys(checkList);
                for(var i=0;i < ks.length; i++){
                    var key = ks[i];
                    checkList[key] = showHide;
                }
            }
            $m.setLocalStorage(_srcId,_compId,'colGroup',_Obj);
        }
    }
};

Moca.prototype.grpCheckboxClick = function(_thisObj) {
    //var chkObj = $(_thisObj).next().next().find('[type=radio]')[0];
    //var showHide = chkObj.value;//1 or 0
    var _type = $m.getType(_thisObj); 
    var g_jq = $m.getTypeObj(_thisObj);
    var _srcId =g_jq.attr('srcId');
    var _compId =g_jq.attr('id');
    var groupListon = $(_thisObj).closest("#col_showhide").find('.groupList').find('.on');
    var color = groupListon.find('.color').css('background-color');
    var name = groupListon.find('a').html();
    var showHide = (groupListon.find('[type=radio]')[0].checked == true)? "1":"0";//1 or 0
    var columnId = $(_thisObj).attr("columnId");
    
    if(_thisObj.checked){
        $(_thisObj).closest('li').find('.cbx').css('background-color',color).css('background-position', '2px -14px');
        $(_thisObj).attr('groupId',name);
        //var checkedArray = $(_thisObj).closest(".groupColList").find('[type=checkbox][groupId=\''+name+'\']:checked');
        var colGroupObj = $m.getLocalStorage(_srcId,_compId,'colGroup');
        if(colGroupObj[name].checkList == null){
            colGroupObj[name].checkList = {};
        }
        colGroupObj[name].checkList[columnId] = showHide;
        $m.setLocalStorage(_srcId,_compId,'colGroup',colGroupObj);
    }else{
        var name = _thisObj.getAttribute('groupId');
        var colGroupObj = $m.getLocalStorage(_srcId,_compId,'colGroup');
        delete colGroupObj[name].checkList[columnId];
        $m.setLocalStorage(_srcId,_compId,'colGroup',colGroupObj);
        
        $(_thisObj).closest('li').find('.cbx').css('background-color','').css('background-position', '3px 2px');
        $(_thisObj).attr('groupId','그룹없음');
    }   
};

Moca.prototype.grpRadioClick = function(_thisObj) {
    var _type = $m.getTypeObj(_thisObj); 
    var showHide = _thisObj.value;//1 or 0
    var g_jq = $m.getTypeObj(_thisObj);
    var _srcId =g_jq.attr('srcId');
    var _compId =g_jq.attr('id');
    var name = $(_thisObj).closest("td").find('a').text();
    var colGroupObj = $m.getLocalStorage(_srcId,_compId,'colGroup');
    colGroupObj[name].showHide = showHide;
    $m.setLocalStorage(_srcId,_compId,'colGroup',colGroupObj);
};

Moca.prototype.columnShowHideRadioClick = function(_thisObj) {
    var _type = $m.getType(_thisObj); 
    var showHide = _thisObj.value;//1 or 0
    var g_jq = $m.getTypeObj(_thisObj); 
    var _srcId =g_jq.attr('srcId');
    var _compId =g_jq.attr('id');
    var groupListon = $(_thisObj).closest("#col_showhide").find('.groupList').find('.on');
    var chkObj = $(_thisObj).closest("li").find('[type=checkbox]')[0];
    var name = $(chkObj).attr('groupId');
    var columnid = $(chkObj).attr('columnid');
    var colGroupObj = $m.getLocalStorage(_srcId,_compId,'colGroup');
    colGroupObj[name].checkList[columnid] = showHide;
    
    $m.setLocalStorage(_srcId,_compId,'colGroup',colGroupObj);
};

Moca.prototype._col_showhideApply = function(_thisObj) {
    var _type = $m.getType(_thisObj); 
    var _gridOrTable = $m.getTypeObj(_thisObj)[0];
    $m._col_showhideExe(_gridOrTable);
    $m._col_showhideClose(_thisObj);
}

Moca.prototype._col_showhideExe = function(_grid) {
	/*
    var _type = _grid.getAttribute("type");
    var _grid_j = $(_grid);
    var _srcId =_grid_j.attr('srcId');
    var _compId =_grid_j.attr('id');
    
    var name = "그룹없음";
    var colGroupObj = $m.getLocalStorage(_srcId,_compId,'colGroup');
    if(colGroupObj[name] == null){
        colGroupObj[name] = {colorCd:"#ced7dc"};
        colGroupObj[name].checkList = {};
        var map = _grid_j[0].cellInfo;
        var keyArray = Object.keys(map);
        for(var i=0; i < keyArray.length; i++){
            var k = keyArray[i];
            colGroupObj[name].checkList[k] = '1';
        }
        $m.setLocalStorage(_srcId,_compId,'colGroup',colGroupObj);
    }
    _grid_j.find('th .groupbar').css('background-color','');//td 그룹색 초기화.
    
    var colGroupObj = $m.getLocalStorage(_srcId,_compId,'colGroup');
    var nogroup = colGroupObj["그룹없음"];
    delete colGroupObj["그룹없음"]; 
    var groupArray = Object.keys(colGroupObj);
    groupArray.splice(0, 0,"그룹없음");
    for(var i=0; i < groupArray.length; i++){
        var aGroupName = groupArray[i]; 
        var columns;
        if(aGroupName == "그룹없음"){
            columns = nogroup;
        }else{
            columns = colGroupObj[aGroupName];
        }
        var map = columns.checkList;
        if(map != null){
            var columnArray = Object.keys(map);
            for(var j=0; j < columnArray.length; j++){
                var aColName = columnArray[j]; 
                var showHide = map[aColName];
                var idx = _grid.cellIndex[aColName];
                var allCol = $($(_grid_j.find('table')[0]).find('colgroup').children()[idx]);
                if(_type == 'grid'){
                    try{
                        var allThTd = $(_grid_j.find('table')[0]).find('tr > *:nth-child('+(idx+1)+')');
                        if(showHide == "0"){
                            allCol.css('display','none');
                            allThTd.css('display','none');
                        }else{
                            allCol.css('display','table-column');
                            allThTd.css('display','table-cell');
                            if(aGroupName != "그룹없음"){
                                _grid_j.find('tr > th:nth-child('+(idx+1)+') .groupbar').css('background',columns.colorCd);
                            }else{
                                _grid_j.find('tr > th:nth-child('+(idx+1)+')').css('background-color','');
                            }
                        }   
                    }catch(e){
                        $m.removeLocalStorage(_srcId,_compId,'colGroup');
                    }
    
                }else if(_type == 'table'){
                    var targetCol = allCol;
                    if(showHide == "0"){
                        $m.columnHide(_compId,targetCol,aColName);
                    }else{
                        $m.columnShow(_compId,targetCol,aColName);
                    }   
                }

            }
        }

    }
    */
};

Moca.prototype.columnHide = function(_compId,targetCol,aColId) {
    var o = $('#'+_compId)[0];
    if(o.map == null){
        o.map = {};
    }
    var arr = $('#'+_compId+' .moca_table_cont').find('td,th');
    for(var i=0; i < arr.length; i++){
        var aTd = arr[i];
        if($(aTd).attr('ori_width') == null){
            $(aTd).attr('ori_width',$(aTd).width());
        }
        $(aTd).css('text-overflow','ellipsis');
        $(aTd).css('overflow','hidden');
        $(aTd).css('white-space','nowrap');
    }
    if($(targetCol).attr('ori_width') == null){
        $(targetCol).attr('ori_width',$(targetCol).width());
    }
    

    var arr = $('#'+_compId+' .moca_table_cont').find('td,th');
    for(var i=0; i < arr.length; i++){
        var aTd = arr[i];
        if($(aTd).width() < 5){
            o.map[aTd.id]  = aTd;
        }
    }
    
    $(targetCol).css('width','1px');
    var arr = $('#'+_compId+' .moca_table_cont').find('td,th');
    for(var i=0; i < arr.length; i++){
        var aTd = arr[i];
        if(o.map[aTd.id] == null && $(aTd).width() < 5){
            $(aTd).css('visibility','hidden');
            $(aTd).css('width','0px');
            $(aTd).attr('hid',aColId);
        }
    }
    $(targetCol).css('width','0px');
};


Moca.prototype.columnShow = function(_compId,targetCol,aColId) {
    var o = $('#'+_compId)[0];
    if(o.map == null){
        o.map = {};
    }
    if($m.trim($(targetCol).attr('ori_width')) != ''){
        $(targetCol).css('width',$(targetCol).attr('ori_width'));
    }
    if($m.trim(aColId) != ''){
        var arr = $('#'+_compId+' .moca_table_cont').find("[hid="+aColId+"]");
        for(var i=0; i < arr.length; i++){
            var aTd = arr[i];
            $(aTd).css('visibility','');
            $(aTd).css('width',$(aTd).attr('ori_width'));
            $(aTd).attr('hid','');
            delete o.map[aTd.id];
        }
    }

};

Moca.prototype.renderGridToolbarCheckbox = function(x1Obj) {
    ['grid toolbar내 checkbox만들기'];
    var _html = '';
    if(x1Obj.checked == 'true'){
        x1Obj.checkedStr = 'checked';
    }else{
        x1Obj.checkedStr = '';
    }
    if(x1Obj.onclick != null && x1Obj.onclick != ''){
        x1Obj.onclickStr = 'onclick="$m.setter_pageId(\''+$m.pageId+'\',\''+$m.srcId+'\',\''+x1Obj.onclick+'\',this)"'; 
    }else{
        x1Obj.onclickStr = '';
    }
    if(x1Obj.addClass == null){
        x1Obj.addClassStr = '';
    }else{
        x1Obj.addClassStr = x1Obj.addClass;
    }
    _html += '<div type="gridCheckbox" class="'+x1Obj.addClassStr+'">';
    _html += '<input type="checkbox" class="moca_checkbox_input" id="'+x1Obj.id+'" name="'+x1Obj.id+'" value="'+x1Obj.value+'" '+x1Obj.checkedStr+' '+x1Obj.onclickStr+'>';
    _html += '<label type="checkbox" class="moca_checkbox_label" for="'+x1Obj.id+'" >'+x1Obj.label+'</label>'; 
    _html += '</div>';
    
    return _html;
};


Moca.prototype.renderGridToolbarInput = function(x1Obj) {
    ['grid toolbar내 input만들기'];
    var _html = '';
    if(x1Obj.addClass == null){
        x1Obj.addClassStr = '';
    }else{
        x1Obj.addClassStr = x1Obj.addClass;
    }
    _html += '<div type="gridInput" class="'+x1Obj.addClassStr+'">';
    _html += '<input type="text" class="" id="'+x1Obj.id+'" name="'+x1Obj.id+'" value="'+x1Obj.value+'" style="width:'+x1Obj.width+'">';
    _html += '</div>';
    return _html;
};

Moca.prototype.renderGridToolbarButton = function(x1Obj,_id) {
    ['grid toolbar내 button만들기'];
    var _html = '';
    if(x1Obj.addClass == null){
        x1Obj.addClassStr = '';
    }else{
        x1Obj.addClassStr = x1Obj.addClass;
    }
    var _innerStyle = '';
    if(x1Obj.innerStyle != null){
        _innerStyle = x1Obj.innerStyle;
    }
    var _disabled = '';
    var tmp_disabled = '';
    var tmp_disabled_style = '';
    var _btnid = '';
    tmp_disabled = x1Obj.innerDisabled;
    if($m.isTrue(tmp_disabled)){
        _disabled = "disabled";
        _innerStyle += ";background:#aaa;";
    }
    if(x1Obj.id != null){
       _btnid = x1Obj.id;
    }
    if($m.getDevice() != 'pc' && x1Obj.mobileHide == "true"){
    	_html += '<div class="grid_btn '+x1Obj.addClassStr+'" grdkey="'+_id+'" style="display:none">';
    }else{
    	_html += '<div class="grid_btn '+x1Obj.addClassStr+'" grdkey="'+_id+'">';
    } 
    
    _html += '<button type="button" id="'+_btnid+'" style="'+_innerStyle+'" onclick="'+x1Obj.onclick+'(this)" '+_disabled+' >'+x1Obj.label+'</button>';
    _html += '</div>';
    return _html;
};

Moca.prototype.renderGridToolbarLabelSpan = function(x1Obj) {
    ['grid toolbar내 LabelSpan만들기'];
    var _html = '';
    if(x1Obj.checked == 'true'){
        x1Obj.checkedStr = 'checked';
    }else{
        x1Obj.checkedStr = '';
    }
    //if(x1Obj.onclick != null && x1Obj.onclick != ''){
        //x1Obj.onclickStr = 'onclick="$m.setter_pageId(\''+$m.pageId+'\',\''+$m.srcId+'\',\''+x1Obj.onclick+'\',this)"'; 
    //}else{
        x1Obj.onclickStr = '';
    //}
    if(x1Obj.addClass == null){
        x1Obj.addClassStr = '';
    }else{
        x1Obj.addClassStr = x1Obj.addClass;
    }
    
    if(x1Obj.valueClass == null){
        x1Obj.valueClassStr = '';
    }else{
        x1Obj.valueClassStr = x1Obj.valueClass;
    }
    if(x1Obj.unit == null){
        x1Obj.unitStr = '';
    }else{
        x1Obj.unitStr = x1Obj.unit;
    }
    /*
    if(x1Obj.conditionParam == null){
    	 x1Obj.conditionParamStr = '';
    }else{
    	 x1Obj.conditionParamStr =  eval(x1Obj.conditionParam);
    }
    if(x1Obj.expression == null){
    	 x1Obj.expressionStr = '';
    }else{
    	 x1Obj.expressionStr = eval(x1Obj.expression);
    }*/
    if($m.getDevice() != 'pc' && x1Obj.mobileHide == "true"){
    	_html += '<div class="grid_label_span'+x1Obj.addClassStr+'" style="display:none">';
    }else{
    	_html += '<div class="grid_label_span '+x1Obj.addClassStr+'" grdkey="'+x1Obj.id+'">';
    }
    _html += '<span class="label">'+x1Obj.label+'</span>';
    _html += '<span id="'+x1Obj.id+'" class="'+x1Obj.valueClassStr+'" name="'+x1Obj.id+'" >'+x1Obj.value+'</span>';
    _html += '<span>'+x1Obj.unitStr+'</span>';
    _html += '</div>';
    return _html;
};

Moca.prototype.renderGridToolbarLabel = function(x1Obj) {
    ['grid toolbar내 Label만들기'];
    var _html = '';
    if(x1Obj.checked == 'true'){
        x1Obj.checkedStr = 'checked';
    }else{
        x1Obj.checkedStr = '';
    }
    //if(x1Obj.onclick != null && x1Obj.onclick != ''){
        //x1Obj.onclickStr = 'onclick="$m.setter_pageId(\''+$m.pageId+'\',\''+$m.srcId+'\',\''+x1Obj.onclick+'\',this)"'; 
    //}else{
        x1Obj.onclickStr = '';
    //}
    if(x1Obj.addClass == null){
        x1Obj.addClassStr = '';
    }else{
        x1Obj.addClassStr = x1Obj.addClass;
    }
    _html += '<div class="grid_label_span  '+x1Obj.addClassStr+'">';
    _html += '<span class="label" id="'+x1Obj.id+'" name="'+x1Obj.id+'" >'+x1Obj.label+'</span>';
    _html += '</div>';
    return _html;
};


Moca.prototype.renderGridToolbarLabelInput = function(x1Obj) {
    ['grid toolbar내 LabelInput만들기'];
    var _html = '';
    if(x1Obj.checked == 'true'){
        x1Obj.checkedStr = 'checked';
    }else{
        x1Obj.checkedStr = '';
    }
    //if(x1Obj.onclick != null && x1Obj.onclick != ''){
        //x1Obj.onclickStr = 'onclick="$m.setter_pageId(\''+$m.pageId+'\',\''+$m.srcId+'\',\''+x1Obj.onclick+'\',this)"'; 
    //}else{
        x1Obj.onclickStr = '';
    //}
    if(x1Obj.addClass == null){
        x1Obj.addClassStr = '';
    }else{
        x1Obj.addClassStr = x1Obj.addClass;
    }
    _html += '<div class="grid_label_span '+x1Obj.addClassStr+'">';
    _html += '<span class="label">'+x1Obj.label+'</span>';
    _html += '  <input class="moca_input" type="text" id="'+x1Obj.id+'" name="'+x1Obj.id+'" value="'+x1Obj.value+'" style="width:'+x1Obj.width+'">';
    _html += '</div>';
    return _html;
};


Moca.prototype.renderGridToolbarCombo = function(x1Obj,_id) {
    ['grid toolbar내 LabelInput만들기'];
    var _html = '';
    if(x1Obj.checked == 'true'){
        x1Obj.checkedStr = 'checked';
    }else{
        x1Obj.checkedStr = '';
    }
    //if(x1Obj.onclick != null && x1Obj.onclick != ''){
        //x1Obj.onclickStr = 'onclick="$m.setter_pageId(\''+$m.pageId+'\',\''+$m.srcId+'\',\''+x1Obj.onclick+'\',this)"'; 
    //}else{
        x1Obj.onclickStr = '';
    //}
    if(x1Obj.addClass == null){
        x1Obj.addClassStr = '';
    }else{
        x1Obj.addClassStr = x1Obj.addClass;
    }
    /*
    _html += '<div class="grid_label_span">';
    _html += '<span class="label">'+x1Obj.label+'</span>';
    _html += '  <input type="text" id="'+x1Obj.id+'" name="'+x1Obj.id+'" value="'+x1Obj.value+'" style="width:'+x1Obj.width+'">';
    _html += '</div>';
    */
    _html += '<div class="moca_combo '+x1Obj.addClassStr+'" style="width:'+x1Obj.width+'" grdkey="'+_id+'">';
    _html += '<select class="moca_select" id="'+x1Obj.id+'">';
    _html += '  <option value="800" selected>800건</option>';    
    _html += '  <option value="20">20건</option>';       
    _html += '  <option value="50">50건</option>';
    _html += '  <option value="100">100건</option>';
    _html += '  <option value="400">400건</option>';
    _html += '</select>';
    _html += '</div>';
    return _html;
};


Moca.prototype.renderGridToolbarLabelCombo = function(x1Obj,_id) {
    ['grid toolbar내 LabelCombo만들기'];
    var _html = '';
    if(x1Obj.checked == 'true'){
        x1Obj.checkedStr = 'checked';
    }else{
        x1Obj.checkedStr = '';
    }
    //if(x1Obj.onclick != null && x1Obj.onclick != ''){
        //x1Obj.onclickStr = 'onclick="$m.setter_pageId(\''+$m.pageId+'\',\''+$m.srcId+'\',\''+x1Obj.onclick+'\',this)"'; 
    //}else{
        x1Obj.onclickStr = '';
    //}
    if(x1Obj.addClass == null){
        x1Obj.addClassStr = '';
    }else{
        x1Obj.addClassStr = x1Obj.addClass;
    }
    
    _html += '<div class="grid_label_span  '+x1Obj.addClassStr+'">';
    _html += '<span class="label">'+x1Obj.label+'</span>';
    _html += '<div class="moca_combo" style="width:'+x1Obj.width+';display:inline-block" grdkey="'+_id+'">';
    _html += '<select class="moca_select" id="'+x1Obj.id+'">';
    _html += '  <option value="800" selected>800건</option>';    
    _html += '  <option value="20">20건</option>';       
    _html += '  <option value="50">50건</option>';
    _html += '  <option value="100">100건</option>';
    _html += '  <option value="400">400건</option>';
    _html += '</select>';
    _html += '</div>';
    _html += '</div>';
    return _html;
};

Moca.prototype.renderGridToolbarRadio = function(x1Obj,_id) {
    ['grid toolbar내 Radio만들기'];
    var _html = '';

    if(x1Obj.onclick != null && x1Obj.onclick != ''){
        x1Obj.onclickStr = 'onclick="'+x1Obj.onclick+'(\''+$m.pageId+'\',\''+$m.srcId+'\',this)"'; 
    }else{
        x1Obj.onclickStr = '';
    }
    if(x1Obj.addClass == null){
        x1Obj.addClassStr = '';
    }else{
        x1Obj.addClassStr = x1Obj.addClass;
    }

    
    _html += '<div class="moca_radio mt7 '+x1Obj.addClassStr+'"  id="'+x1Obj.id+'">';
    var arr = x1Obj.value;
    for(var i=0; i < arr.length; i++){
        var obj = arr[i];
        if(obj.checked == null){
            obj.checkedStr = '';
        }else{
            obj.checkedStr = "checked";
        }
        
        
        _html += '<input type="radio" class="moca_radio_input" name="radio_'+x1Obj.id+'" id="radio_'+x1Obj.id+'_'+i+'" '+x1Obj.onclickStr +' value="'+obj.value+'" '+obj.checkedStr+' >';
        _html += '<label class="moca_radio_label mr4" for="radio_'+x1Obj.id+'_'+i+'">'+obj.label+'</label>';
    }
    _html += '</div>'
    return _html;
};

    

Moca.prototype.preven = function(_thisObj) {
    event.stopPropagation();
    
}

Moca.prototype.adjustFixedHeadHeight = function(_tableId) {
    ['fixedColumn Table용 thead 높이 맞추기'];
    var table_cont = $('#'+_tableId).find('.moca_table_cont');
    var h = $(table_cont[1]).find('thead').height();
    var thPaddingBorder = parseFloat($(table_cont[1]).find('thead th').css('padding').replace(/px/g,''))*2+parseFloat($(table_cont[1]).find('thead th').css('border-bottom').replace(/px/g,''));
    $(table_cont[0]).find('thead th').height((h-thPaddingBorder));
}



Moca.prototype.renderTable = function(_divObj) {
    ['renderTable'];
    var _id = _divObj.id;
    var _type = _divObj.getAttribute('type');
    var pageid = _divObj.getAttribute("pageid");
    var srcid = _divObj.getAttribute("srcid");
    $m.getObj(_id,null,pageid,srcid);//id중복체크
    
    var _default_cell_height = _divObj.getAttribute("default_cell_height");
    var _label = _divObj.getAttribute("label");
    var _subLabel = _divObj.getAttribute("subLabel");
    var _toolbar = $(_divObj).hasClass("toolbar");
    var _paging = $(_divObj).hasClass("paging");
    var _header_body = _divObj.innerHTML;
    var _rowSelectedColor = _divObj.getAttribute("rowSelectedColor");
    var _onRowSelectedFunc = _divObj.getAttribute("onRowSelected");
    
    var toolbar_search_size = _divObj.getAttribute("toolbar_search_size");
    var toolbar_col_showhide = _divObj.getAttribute("toolbar_col_showhide");
    var toolbar_detail = _divObj.getAttribute("toolbar_detail");
    var toolbar_exup = _divObj.getAttribute("toolbar_exup");
    var toolbar_exdn = _divObj.getAttribute("toolbar_exdn");
    var toolbar_nextbtn = _divObj.getAttribute("toolbar_nextbtn");
    var toolbar_full = _divObj.getAttribute("toolbar_full");

    var _html = '';
    if(_toolbar){
        _html += '<div class="moca_table_toolbar" grdkey="'+_id+'" default_cell_height="'+_default_cell_height+'" >';
        _html += '<div class="lta" grdkey="'+_id+'">';
        if(_label != null){
            _html += '<div class="moca_table_title" grdkey="'+_id+'">';             
            _html += '<span>'+_label+'</span>';                         
            _html += '</div>';
        } 
        
        if(_subLabel != null){
            _html += '<div class="moca_table_title" grdkey="'+_id+'">';             
            _html += '<i class="fas fa-angle-right"></i>'+'<span>'+_subLabel+'</span>';                         
            _html += '</div>';
        } 

        
        var attArray = _divObj.getAttributeNames();
        
        for(var k=0; k <attArray.length; k++){
            var attrName = attArray[k];
            var attValue = _divObj.getAttribute(attrName);
            if($.trim(attValue) != null && $.trim(attValue) != '') {
                try{
                    var x1Obj = JSON.parse(attValue);
                    if(x1Obj.position == 'left'){
                        if(attrName.indexOf('toolbar_grid_checkbox') > -1){
                            _html += $m.renderGridToolbarCheckbox(x1Obj);
                        }else if(attrName.indexOf('toolbar_grid_input') > -1){
                            _html += $m.renderGridToolbarInput(x1Obj);
                        }else if(attrName.indexOf('toolbar_grid_button') > -1){
                            _html += $m.renderGridToolbarButton(x1Obj,_divObj.id);
                        }else if(attrName.indexOf('toolbar_grid_label_span') > -1){
                            _html += $m.renderGridToolbarLabelSpan(x1Obj);
                        }else if(attrName.indexOf('toolbar_grid_label_input') > -1){
                            _html += $m.renderGridToolbarLabelInput(x1Obj);
                        }else if(attrName.indexOf('toolbar_grid_label_combo') > -1){
                            _html += $m.renderGridToolbarLabelCombo(x1Obj,_divObj.id);
                        }else if(attrName.indexOf('toolbar_grid_combo') > -1){
                            _html += $m.renderGridToolbarCombo(x1Obj,_divObj.id);
                        }else if(attrName.indexOf('toolbar_grid_label') > -1){
                            _html += $m.renderGridToolbarLabel(x1Obj);
                        }else if(attrName.indexOf('toolbar_grid_radio') > -1){
                            _html += $m.renderGridToolbarRadio(x1Obj);
                        }
                    }
                }catch(e){
                    
                }
            }
        }
        
        if(toolbar_search_size == "true") {
        }


        _html += '</div>';
        
        
        

    
    
    
        _html += '<div class="rta" grdkey="'+_id+'">';

        if(toolbar_col_showhide == "true") _html += '<button type="button" id="'+_id+'_col_showhide" class="button col_showhide" title="컬럼숨기기" grdkey="'+_id+'" onclick="$m._col_showhide(this)" renderType="'+_type+'"></button>';
        if(toolbar_detail == "true") _html += '<button type="button" id="'+_id+'_btn_detail" class="button grid_detail" title="디테일뷰" grdkey="'+_id+'" onclick="$m._detailview(this)" renderType="'+_type+'"></button>';
        if(toolbar_exup == "true") _html += '<button type="button" id="'+_id+'_btn_exup" class="button excel_up" title="엑셀업로드" grdkey="'+_id+'" onclick="$m._excel_up(this)" renderType="'+_type+'"></button>';
        if(toolbar_exdn == "true") _html += '<button type="button" id="'+_id+'_btn_exdn" class="button excel_dn" title="엑셀다운로드" grdkey="'+_id+'" onclick="$m._excel_down(this)" renderType="'+_type+'"></button>';
        if(toolbar_nextbtn == "true") _html += '<button type="button" id="'+_id+'_btn_nextbtn" class="button read_next" title="다음" grdkey="'+_id+'" onclick="$m._next(this)" renderType="'+_type+'"></button>';
        if(toolbar_full == "true") _html += '<button type="button" id="'+_id+'_btn_full" class="button grid_full" title="그리드 전체화면"  grdkey="'+_id+'" onclick="$m._fullScreenGrid(this)" renderType="'+_type+'"></button>';
        if(toolbar_fold == "true") _html += '<button type="button"id="'+_id+'_btn_fold" class="button grid_fold" title="그리드 접기"  grdkey="'+_id+'" onclick="$m._foldGrid(this)" renderType="'+_type+'"></button>';
        
        
        for(var k=0; k <attArray.length; k++){
            var attrName = attArray[k];
            var attValue = _divObj.getAttribute(attrName);
            if($.trim(attValue) != null && $.trim(attValue) != '') {
                try{
                    var x1Obj = JSON.parse(attValue);
                    if(x1Obj.position == 'right'){
                        if(attrName.indexOf('toolbar_grid_checkbox') > -1){
                            _html += $m.renderGridToolbarCheckbox(x1Obj);
                        }else if(attrName.indexOf('toolbar_grid_input') > -1){
                            _html += $m.renderGridToolbarInput(x1Obj);
                        }else if(attrName.indexOf('toolbar_grid_button') > -1){
                            _html += $m.renderGridToolbarButton(x1Obj,_divObj.id);
                        }else if(attrName.indexOf('toolbar_grid_label_span') > -1){
                            _html += $m.renderGridToolbarLabelSpan(x1Obj);
                        }else if(attrName.indexOf('toolbar_grid_label_input') > -1){
                            _html += $m.renderGridToolbarLabelInput(x1Obj);
                        }else if(attrName.indexOf('toolbar_grid_label_combo') > -1){
                            _html += $m.renderGridToolbarLabelCombo(x1Obj,_divObj.id);
                        }else if(attrName.indexOf('toolbar_grid_combo') > -1){
                            _html += $m.renderGridToolbarCombo(x1Obj,_divObj.id);
                        }else if(attrName.indexOf('toolbar_grid_label') > -1){
                            _html += $m.renderGridToolbarLabel(x1Obj);
                        }else if(attrName.indexOf('toolbar_grid_radio') > -1){
                            _html += $m.renderGridToolbarRadio(x1Obj);
                        }
                    }
                }catch(e){
                    
                }

            }
        }
        
        
        
        _html += '</div>';
        _html += '</div>';

        
        _html += '<div class="moca_table_list" default_cell_height="'+_default_cell_height+'" grdkey="'+_id+'">';
        _html += '<div class="moca_table_body">';
        _html += _header_body;
        _html += '</div>';

        _html += '<div id="lin_dashed" style="position:absolute; top:0px; bottom:0px; border-left:1px dashed #000; z-index:100; height:100%; left:340px;display:none"></div>';
        _html += '</div>';
        
        if(_paging){
            _html += '<div class="moca_grid_paging">';
            _html += '<button type="button" class="first"><span>첫 페이지로 이동</span></button>';
            _html += '<button type="button" class="prev"><span>이전페이지로 이동</span></button>';
            _html += '<span class="num">';
            _html += '<button type="button" class="on" title="현재위치">1</button>';
            _html += '<button type="button">2</button>';
            _html += '<button type="button">3</button>';
            _html += '<button type="button">4</button>';
            _html += '<button type="button">5</button>';
            _html += '<button type="button">6</button>';
            _html += '<button type="button">7</button>';
            _html += '<button type="button">8</button>';
            _html += '<button type="button">9</button>';
            _html += '<button type="button">10</button>';
            _html += '</span>';
            _html += '<button type="button" class="next"><span>다음페이지로 이동</span></button>';
            _html += '<button type="button" class="last"><span>마지막 페이지로 이동</span></button>';
            _html += '</div>';
        }
        
        _html +='   <div class="gridDetail_body" style="display:none" grdkey="'+_id+'"> ';
        _html +='       <div class="moca_grid_toolbar_detail"> ';
        _html +='           <div class="rta"> ';
        _html +='               <button type="button" id="btn_colTh1" class="button colTh1" style="" title="그리드th1단"  onclick="$m._detailView1(this)"></button> ';
        _html +='               <button type="button" id="btn_colTh2" class="button colTh2" style="" title="그리드th2단"  onclick="$m._detailView2(this)"></button> ';
        if($m.getDevice() != "mobile"){
        	_html +='           <button type="button" id="btn_colTh3" class="button colTh3" style="" title="그리드th3단"  onclick="$m._detailView3(this)"></button>'; 
        }
        _html +='               <button type="button" id="" class="button grid_detail_close" style="" title="" onclick="$m._detailViewClose(this)"></button>';
        _html +='           </div> ';   
        _html +='       </div> ';
        _html +='       <table class="gridDetail mb5" id="gridDetail1"> ';
        _html +='           <tr> ';
        _html +='               <th>제목'+_id+'</th> ';
        _html +='               <td><div contenteditable="true" placeholder=""></div></td> ';
        _html +='           </tr> ';

        _html +='       </table> ';
        _html +='       <table class="gridDetail mb5" id="gridDetail2" > ';
        _html +='           <tr> ';
        _html +='               <th>제목1</th> ';
        _html +='               <td><div contenteditable="true" placeholder=""></div></td> ';
        _html +='               <th>제목2</th> ';
        _html +='               <td><div contenteditable="true" placeholder=""></div></td> ';
        _html +='           </tr> ';
        _html +='           <tr> ';
        _html +='               <th>제목3</th> ';
        _html +='               <td><div contenteditable="true" placeholder=""></div></td> ';
        _html +='               <th>제목4</th> ';
        _html +='               <td><div contenteditable="true" placeholder=""></div></td> ';
        _html +='           </tr> ';        
        _html +='           <tr> ';
        _html +='               <th>제목5</th> ';
        _html +='               <td><div contenteditable="true" placeholder=""></div></td> ';
        _html +='               <th>제목6</th> ';
        _html +='               <td><div contenteditable="true" placeholder=""></div></td> ';
        _html +='           </tr> ';        
        _html +='       </table> ';
        _html +='       <table class="gridDetail mb5" id="gridDetail3"> ';
        _html +='           <tr> ';
        _html +='               <th>제목1</th> ';
        _html +='               <td><div contenteditable="true" placeholder=""></div></td> ';
        _html +='               <th>제목2</th> ';
        _html +='               <td><div contenteditable="true" placeholder=""></div></td> ';
        _html +='               <th>제목3</th> ';
        _html +='               <td><div contenteditable="true" placeholder=""></div></td> ';
        _html +='           </tr> ';
        _html +='           <tr> ';
        _html +='               <th>제목4</th> ';
        _html +='               <td><div contenteditable="true" placeholder=""></div></td> ';
        _html +='               <th>제목5</th> ';
        _html +='               <td><div contenteditable="true" placeholder=""></div></td> ';
        _html +='               <th>제목6</th> ';
        _html +='               <td><div contenteditable="true" placeholder=""></div></td> ';
        _html +='           </tr> ';
        _html +='       </table> ';
        _html +='   </div> ';
        
        
        
        
        _html +='   <div id="col_showhide" class="PopColgroup p5" style="display:none" onclick="$m.preven(this)">';
        _html +='       <div class="groupListHeader">';
        _html +='           <div class="fr">';
        _html +='               <button type="button" class="button btn_save"  onclick="$m._col_showhideApply(this)"><span>적용</span></button>';
        _html +='               <button type="button" class="button btn_close" style="" title="" onclick="$m._col_showhideClose(this)"></button>';
        _html +='           </div>';
        _html +='       </div>';    
        _html +='       <div class="ly_column col_2">';
        _html +='           <div class="ly_col_cont">';
        _html +='               <table class="groupListSet">';
        _html +='                   <colgroup>';
        _html +='                   <col>';
        _html +='                   <col style="width:37px">';
        _html +='                   </colgroup>';
        _html +='                   <tr>';
        _html +='                       <td><div class="moca_ibn"><input type="text" class="moca_input" style="" id="grpNm_'+_id+'" placeholder="그룹명을 입력해주세요"><input type="color" class="moca_input_color"></div></td>';
        _html +='                       <td><button type="button" class="button btn_plus" onclick="$m.createColGroup(this)"><i class="fas fa-plus"></i></button></td>';
        _html +='                   </tr>';
        _html +='               </table>';
        _html +='               <table class="groupList mb5">';
        _html +='               </table>';
        _html +='           </div>';
        _html +='       </div>';
        _html +='       <div class="ly_column col_8">';
        _html +='           <div class="ly_col_cont">';
        _html +='               <div class="ly_col_cont">';
        _html +='                   <h3 class="txt_red p10">*그룹으로 묶을 컬럼을 선택해주세요</h3>';
        _html +='                   <ul class="groupColList pl10">';
        _html +='                   </ul>';
        _html +='               </div>';
        _html +='           </div>';
        _html +='       </div>';
        _html +='   </div>';

        
        _html = $m.addPageId(_html,pageid,srcid);
        _divObj.innerHTML = _html;
        $m.genTableRows(_divObj);
    
    }
    
};
Moca.prototype.genTableRows = function(_divObj) {
    try{
        var colgroup = $(_divObj).find('.moca_table_cont').find('colgroup');
        var colArray =colgroup.find('col');
        var all_col_str = '';
        if(colArray != null && colArray.length > 0){
            for(var i=0; i < colArray.length; i++){
                var aCol = colArray[i];
                var _type = $(aCol).attr('type');//dynamic(cnt=108)
                if(_type != null){
                    var _cnt = _type.replace(/(dynamic\(cnt=)([0-9]*)(\))/g,'$2');
                    var _cnt_int = Number(_cnt);
                    aCol.removeAttribute("type");
                    var aCol_str = aCol.outerHTML;
                    var full = '';
                    for(var jj=0; jj < _cnt_int; jj++){
                        full += aCol_str+'\n';
                    }
                    all_col_str += full;
                }else{
                    all_col_str += aCol.outerHTML;
                }
            }
            colgroup[0].innerHTML = all_col_str;
        }
        var trArray = $(_divObj).find('.moca_table_cont').find('tbody tr');
        for(var i=0; i < trArray.length; i++){
            var aRow = trArray[i];
            var td_j =$(aRow).find('td,th');
            var all_col_str = '';
            if(td_j != null && td_j.length > 0){
                for(var ii=0; ii < td_j.length; ii++){
                    var aTd = td_j[ii];
                    var _type = $(aTd).attr('type');//dynamic(cnt=108)
                    if(_type != null){
                        var _cnt = _type.replace(/(dynamic\(cnt=)([0-9]*)(\))/g,'$2');
                        var _cnt_int = Number(_cnt);
                        aTd.removeAttribute("type");
                        aTd.setAttribute('id','td_row_col');
                        var aTd_str = aTd.outerHTML;
                        var full = '';
                        for(var jj=0; jj < _cnt_int; jj++){
                            var aTd_str_done = aTd_str.replace(/(td_)(row)(_)(col)/g,'$1'+ii+'$3'+jj);
                            full += aTd_str_done+'\n';
                        }
                        all_col_str +=full;
                    }else{
                        aTd.setAttribute('id','td_'+ii+'_'+jj);
                        all_col_str +=aTd.outerHTML+'\n';
                    }
                }
                aRow.innerHTML = all_col_str;
            }
        
            
            var allTd = $(aRow).find('td');
            for(var j=0;j < allTd.length; j++){
                var aTd = allTd[j];
                var _celltype= aTd.getAttribute("celltype");
                if(_celltype == 'input'){
                    aTd.setAttribute('id','table_td_'+i+'__'+j);
                    aTd.innerHTML = '<input type="text" class="moca_input" style="" id="table_input_'+i+'__'+j+'">';
                }else if(_celltype == 'select'){
                    
                }
            } 
        }
        
        var thead_trArray = $(_divObj).find('.moca_table_cont').find('thead tr');
        if(thead_trArray.length > 0){
            var aHeadRow = thead_trArray[0];
            var th_j =$(aHeadRow).find('td,th');

            if(th_j != null && th_j.length > 0){
                var _cellMap = {};
                var _cellIndex = {};
                for(var ii=0; ii < th_j.length; ii++){
                    var aTh = th_j[ii];
                    _cellMap[aTh.id] = aTh;
                    _cellIndex[aTh.id] = ii;
                }
                _divObj.cellInfo = _cellMap;
                _divObj.cellIndex = _cellIndex;
                $m._col_showhideExe(_divObj);
            }
        }
    }catch(e){
        alert(e);
    }

};


Moca.prototype.renderForm = function(_divObj) {
    ['renderForm'];
    var _id = _divObj.id;
    var _oncellclick = _divObj.getAttribute("oncellclick");
    var _showRowSelection = _divObj.getAttribute("showRowSelection");
    if(_showRowSelection != 'false'){
        if($m.trim(_oncellclick) != ''){
            $(_divObj).bind('click',eval(_oncellclick));
        }else{
            $(_divObj).bind('click',$m.onRowClick);
        }
    }
    
    var _pageId = _divObj.getAttribute("pageid");
    var _srcId = _divObj.getAttribute("srcid");
    $m.getObj(_id,null,_pageId,_srcId);//id중복체크
    var _header_body = _divObj.innerHTML;
    var _html = '';
    
    var _label = _divObj.getAttribute("label");
    var _subLabel = _divObj.getAttribute("subLabel");
    
    if(_label != null){
        _html += '<div class="moca_table_title fl" pageId="'+_pageId+'" srcId="'+_srcId+'">';
        _html += '	<span>'+_label+'</span>';
        _html += '</div>';
    } 
    
    if(_subLabel != null){
    	_html += '<div class="moca_table_title fl" pageId="'+_pageId+'" srcId="'+_srcId+'">';
        _html += '  <i class="fas fa-angle-right"></i>'+'<span>'+_subLabel+'</span>';
        _html += '</div>';
    } 
    
    var _toolbar = $(_divObj).hasClass("toolbar");
    if(_toolbar){
        _html += '<div class="moca_addtion_area" pageId="'+_pageId+'" srcId="'+_srcId+'">';
        _html += '<div class="lta"></div>';
        _html += '<div class="rta"></div>';
        _html += '</div>';
        _html += _header_body;

        _html = $m.addPageId(_html,_pageId,_srcId);
        _divObj.innerHTML = _html;
        $m.genFormRows(_divObj);
        $m.setAdditionTag(_divObj);
    }
    _divObj.setLabel = function(_label){
        $(_divObj).find('.moca_table_title>span').html(_label);
    }
};

Moca.prototype.genFormRows = function(_divObj) {
    /*
    var trArray = $(_divObj).find('tbody tr');
    for(var i=0; i < trArray.length; i++){
        var aRow = trArray[i];
        var allTd = $(aRow).find('td');
        for(var j=0;j < allTd.length; j++){
            var aTd = allTd[j];
            var _celltype= aTd.getAttribute("celltype");
            if(_celltype == 'input'){
                aTd.setAttribute('id','table_td_'+i+'__'+j);
                aTd.innerHTML = '<input type="text" class="moca_input" style="" id="table_input_'+i+'__'+j+'">';
            }else if(_celltype == 'select'){
                
            }
        }
    }
    
    
    <div class="moca_radio mt5 " id="radio1">
    <input type="radio" class="moca_radio_input" name="radio_radio1" id="radio_radio1_0" 
    onclick="$m.NP_REPORT.fn_research('MDI_202001092100525082050406020103','BA_12',this)" value="1" checked="">
    <label class="moca_radio_label mr4" for="radio_radio1_0">보기</label>
    <input type="radio" class="moca_radio_input" name="radio_radio1" id="radio_radio1_1" onclick="$m.NP_REPORT.fn_research('MDI_202001092100525082050406020103','BA_12',this)" value="0">
    <label class="moca_radio_label mr4" for="radio_radio1_1">안보기</label>
    </div>
    */
    
};

Moca.prototype.renderRadio = function(_divObj,_val,_gubun) {
    ['renderRadio'];
    var _id = _divObj.id+"_"+_divObj.getAttribute('pageid'); 
    var _itemset = _divObj.getAttribute('itemset');
    var _disabled = _divObj.getAttribute('disabled');
    var innerOnclickStr = '';
    var innerOnclick = _divObj.getAttribute('innerOnclick');
    if(innerOnclick != null){
        innerOnclickStr = " onclick='"+innerOnclick+"(this)' ";
    }
    var disabledStr ='';
    if(_disabled == 'true'){
    	disabledStr = 'disabled';
    }
    var _itemsetArray = JSON.parse(_itemset);
    var _html = '';
    for(var i=0; i < _itemsetArray.length; i++){
        var obj = _itemsetArray[i];
        var checkedStr = '';
        if(obj.checked == 'true'){
            checkedStr = 'checked';
        }
        _html += '<input type="radio" name="'+_id+'" id="'+_id+'_'+i+'" value="'+obj.value+'" '+checkedStr+'  '+disabledStr+'  '+innerOnclickStr+'>';
        _html += '<label class="mr15" for="'+_id+'_'+i+'">'+obj.label+'</label>';
        _html += '</input>';
    }
    _divObj.innerHTML = _html;

};

Moca.prototype.renderCheckboxGroup = function(_divObj,_val,_gubun,_metaObj,_checkedInfo) {
    ['render CheckboxGroup'];
    $(_divObj).addClass('checkboxGroup');
    var _id = _divObj.getAttribute("id");
   
        
    var _direction = _divObj.getAttribute('direction');
    if(_direction == 'vertical'){
        $(_divObj).addClass('vertical');
    }
    var _itemset = _divObj.getAttribute('itemset');
    var _itemsetArray = JSON.parse(_itemset);

    var _html = '';
    var _onclick = '';
    var _pageId= $(_divObj).attr('pageid');
    var _disabledStr= '';
    if($(_divObj).attr('disabled')){
    	_disabledStr = 'disabled';
    }
    	
    for(var i=0; i < _itemsetArray.length; i++){
        var obj = _itemsetArray[i];
        var checkedStr = '';
        if(obj.checked){
          checkedStr = 'checked';
        }else if(_metaObj.checked){
          checkedStr = 'checked';
        }
        
        var onclickStr = '';
        if(obj.onclick){
        	onclickStr = 'onclick="'+obj.onclick+'(this)"';
        }
        if(_metaObj != null){
          obj.label = obj[_metaObj.label];
          obj.value = obj[_metaObj.value];
        }
        if(_checkedInfo != null && $m.trim(_checkedInfo[obj.value]) == 'checked'){
          checkedStr = 'checked';
        }else if(_checkedInfo != null && $m.trim(_checkedInfo[obj.value]) == 'unchecked'){
          checkedStr = '';
        }   
        
        _html += '<input type="checkbox" class="moca_checkbox_input" name="'+_id+'" id="'+_pageId+'_'+_id+'_'+i+'" '+checkedStr+' '+_disabledStr+' value="'+obj.value+'">';
        _html += '<label class="moca_checkbox_label mr15" for="'+_pageId+'_'+_id+'_'+i+'" '+onclickStr+'>'+obj.label+'</label>';
    }
    _divObj.innerHTML = _html;
};

Moca.prototype.rendering = function(o,_aTag) {
    var _url = o.url;
    var _srcId = o.srcId;
    var _label = o.label;
    var _clickedMenuId = o.clickedMenuId;
    var _mdiId = o.mdiId;
    var htmlContents = o.htmlContents;
    if(htmlContents == null){
        htmlContents = o.data;
    }
    var _tabId = o.type+"_"+$m.now()+$m.shuffleRandom(6);
    if(o.type == 'MDI' && $m.trim(_label) != ''){
           $m.tree_addTab(_label,_tabId,_url,_mdiId);  
    }else{
        //$('#__popup').html('<div id="'+o.popupId+'" pageid="'+_tabId+'" srcid="'+_srcId+'" class="moca_tab moca_mdi">');
        
    }
    htmlContents = htmlContents.replace(/<link(.*?)>|<meta(.*?)>/gi,'');
    htmlContents = htmlContents.replace(/<\!DOCTYPE html>/gi,'');
    htmlContents = htmlContents.replace(/<html(.*?)>|<\/html>|<body(.*?)>|<\/body>|<head(.*?)>|<\/head>/gi,'');
    htmlContents = htmlContents.replace(/<script(.*?)><\/script>/g,'');
    htmlContents = htmlContents.replace(/<title(.*?)>(.*?)<\/title>/gi,'');
	if($m.trim(o.popupId) != ''){
		_tabId = o.popupId;
	}
    $m.pageId = _tabId;
    $m.srcId = _srcId;
    if($m.trim(_clickedMenuId) != ''){
        $m.menuId = _clickedMenuId;
    }
    
    htmlContents = $m.addPageId(htmlContents,_tabId,_srcId);
    htmlContents = $m.injectionPageObj(htmlContents,_tabId,_srcId);
    var contDiv = document.createElement("div");
    contDiv.data = o.data;
    if(o.type == 'MDI'){
        $(contDiv).attr("mdi_id",_tabId);
    }
    $(contDiv).attr("tab_id",_tabId);
    if(_label != null && _label != ''){
           $(contDiv).attr("id",_tabId+"_dv");
    }else{
           $(contDiv).attr("id","moca_main");
    }
    $(contDiv).attr("src",_url);
    if(o.type == 'MDI'){ 
        $(contDiv).addClass('moca_tab_body');
        $(contDiv).html(htmlContents);
        $('#'+_mdiId+'.moca_tab').append(contDiv);
    /*
    }else if(o.type == 'POP'){
        $(contDiv).addClass('moca_tab_body');
        $(contDiv).html(htmlContents);
        $('#__popup').append(contDiv);
    */
    }else if(o.type == 'HTML'){
        $(contDiv).addClass('moca_tab_body');
        $(contDiv).html(htmlContents);
        $('#__body').append(contDiv);
    }else if(o.type == 'TAB'){
        $(contDiv).addClass('moca_layer_tab_cont');
        $(contDiv).addClass('flex');
        $(contDiv).html(htmlContents);
        
        $(_aTag).append(contDiv);
    }else if(o.type == 'POPUP' || o.type == 'POP'){
        $m.callbacks[_tabId] = o.callback;
        var cont = '';
        if(o.modal != false && o.modal != 'false'){
            cont += '<div id="modal" class="moca_popup_modal" style="display:block"></div>';
            $('body').css('overflow','hidden');
        }
        var _pid = '';
        if($m.trim(o.id) != '' ){
            _pid = o.id;
        }else{
            _pid = _tabId;
        }
        var ow = o.width;if(String(ow).indexOf('%') == -1){ow += 'px';};
        var oh = o.height;if(String(oh).indexOf('%') == -1){oh += 'px';};
        var dodotop = o.top;
        cont += '<div id="'+_pid+'" pageid="'+_tabId+'" srcid="'+$m.srcId+'" class="moca_popup '+o.type+'" style="left:'+o.left+'px;top:'+o.top+'px;width:'+ow+';height:'+oh+'">';
        cont += '   <div class="moca_popup_header">';
        cont += '       <h2 class="moca_popup_title">'+o.title+'('+$m.srcId+')'+'</h2>';
        cont += '       <div class="moca_popup_control">';
        cont += '          <button type="button" id="btn_popRefresh" class="moca_popup_btn_refresh" onclick="$m.popRefresh(\''+_tabId+'\');">새로고침</button>';
        cont += '          <button type="button" id="btn_popChange" class="moca_popup_btn_change" onclick="$m.popChange(\''+_tabId+'\');">변경</button>';
        cont += '		   <button type="button" id="btn_popClose" class="moca_popup_btn_close" onclick="$m.popClose(\''+_tabId+'\');">닫기</button></div>';
        cont += '   </div>';
        cont += '   <div class="moca_popup_body">';
        cont += '       <div class="moca_popup_content">';
        cont +=         htmlContents;
        cont += '       </div>';
        cont += '   </div>';
        
        if(o.modal != false && o.modal != 'false'){
            cont += '</div>';
        }
        //$(contDiv).html(cont);
        var tmp = document.createElement( 'div' );
        tmp.setAttribute("id",_tabId);
        tmp.setAttribute("src",_url);
        if(o.scopeId != null){
            if(o.scopeId.indexOf('POPUP') > -1){
                $('div[id="'+o.scopeId+'"][tab_id='+o.scopeId+']').append(tmp);
            }else if(o.scopeId.indexOf('TAB') > -1){    
                $($('div[pageid="'+o.scopeId+'"]')[0]).closest('[mdi_id]').append(tmp);
            }else{
                $('div[pageid="'+o.scopeId+'"].moca_tab_panel[role=mdipanel]').append(tmp);
            }
        }else{
            document.body.appendChild(tmp);
        }
        
        
       // 형제 클래스가 팝업클래스 갖고있으면 
       //// if(o.scopeId.startsWith('POPUP'))
        if($(tmp).prev().hasClass('moca_popup')){
        	
        	var gep = 0;//중복팝업시 계단형구현에 필요함
        	var gep_top = 0;
        	width = o.width;
        	height = o.height;
        	                             
        	if(document.body.clientHeight <  height){
        		height = document.body.clientHeight;
        	}
        	if(document.body.clientWidth <  width){
        		width = document.body.clientWidth;
        	}           
        	if($m.getDevice() != 'pc'){
        		height = document.body.clientHeight;
        	}

        	var _top = (document.body.offsetHeight/2) - (parseInt(height)/2) + $(document).scrollTop()+gep_top;
        	//defaultTop = $('div[pageid="'+o.scopeId+'"].moca_tab_panel[role=mdipanel]').offset().top;
        	$(tmp).css("top", _top+"px");
        	$(tmp).css("position","fixed");
        	$(tmp).css("z-index","6011");
        };
       
    	$(tmp).html(cont);
        
        $(tmp).attr("tab_id",_tabId);
        
        var moca_popup = $(tmp).find('#'+_pid)[0];
      // var moca_popup = $(tmp)[0];
        
        
        moca_popup.option = o;
        moca_popup.addEventListener('mousedown', function (e) {
        	if(o.modal != false && o.modal != 'false'){//모달일경우에는 팝업 움직이지못하게
        		return;
        	}
            document.nowPopup = this;
            if($(e.srcElement).hasClass('moca_popup_header')){
                e.preventDefault(); //이게 들어가면 팝업에 글자가 블록이 안씌워짐
            }
            if($(e.srcElement).hasClass('moca_popup') || $(e.srcElement).hasClass('moca_popup_header') || $(".moca_popup_header").find($(e.srcElement)).length > 0){
                //if(_option.scope == 'mdi'){
                //  mdiObj.addEventListener('mousemove',$m.popupMove,false);
                //}else{
                if(!$(document.nowPopup).hasClass('max')){
                    document.addEventListener('mousemove',$m.popupMove,false);
                }
                    
                //}
            }
        });
        moca_popup.addEventListener('dblclick', function (e) {
            document.nowPopup = this;
            document.nowPopup.option = o;
            if($(e.srcElement).hasClass('moca_popup_header')){
                e.preventDefault(); //이게 들어가면 팝업에 글자가 블록이 안씌워짐
            }
            if($(e.srcElement).hasClass('moca_popup') || $(e.srcElement).hasClass('moca_popup_header') || $(".moca_popup_header").find($(e.srcElement)).length > 0){
                
                var thisObj = document.nowPopup;
                var positionInfo = thisObj.position;
                if(positionInfo == null){
                    positionInfo = {};
                }
                var position = $(thisObj).css('position');
                if(position != 'fixed'){
                    var top = $(thisObj).css('top');
                    var left = $(thisObj).css('left');
                    var width = $(thisObj).css('width');
                    var height = $(thisObj).css('height');
                    positionInfo.position = position;
                    positionInfo.top = top;
                    positionInfo.left = left;
                    positionInfo.width = width;
                    positionInfo.height = height;
                    document.nowPopup.position = positionInfo;
                    $(thisObj).css('position','fixed');
                    $(thisObj).css('top','0');
                    $(thisObj).css('left','0');
                    $(thisObj).css('width','100%');
                    $(thisObj).css('height','100%');
                    document.removeEventListener('mousemove',$m.popupMove,false);
                    this.gepX = null;
                    this.getY = null;
                    this.move = 0;
                    $(thisObj).addClass('max');
                }else{
                    $(thisObj).css('position',positionInfo.position);
                    $(thisObj).css('top',positionInfo.top);
                    $(thisObj).css('left',positionInfo.left);
                    $(thisObj).css('width',positionInfo.width);
                    $(thisObj).css('height',positionInfo.height);
                    $(thisObj).removeClass('max');
                }
            }
        });
        moca_popup.addEventListener('mouseup', function (e) {
            //if($(e.srcElement).hasClass('moca_popup') || $(e.srcElement).hasClass('moca_popup_header') || $(".moca_popup_header").find($(e.srcElement)).length > 0){
                document.removeEventListener('mousemove',$m.popupMove,false);
                this.gepX = null;
                this.getY = null;
                this.move = 0;
                //e.preventDefault(); //이게 들어가면 팝업에 글자가 블록상태에서 해지가 안됨
            //}
        }); 
        moca_popup.addEventListener('mouseover', function (e) {
            //e.preventDefault(); 
            //e.stopPropagation();
            //e.stopImmediatePropagation();
            
            //this.style.cursor = 'pointer';
        });     
            
        
        
    }
    
    if($m[_srcId] == null){
        return;
    }
    //console.log(_srcId,'rendering $m[_srcId]-',$m[_srcId]);
    $m[_srcId].pageId = _tabId;
    $m[_srcId].srcId = _srcId;
    $m[_srcId].getObj = function(_objId,_tag,__pageId,__srcId){
            ['고유한 obj찾기'];
            var _pageId;
            var _srcId;
            if(__pageId == null){
                _pageId = this.pageId;
            }else{
                _pageId = __pageId;
            }
            if(__srcId == null){
                _srcId = this.srcId;
            }else{
                _srcId = __srcId;
            }
            
            var re;
            if(_tag == null){
                if(_pageId != null){
                    if(_pageId.startsWith('HTML')){
                        re = $('div[id='+_objId+']');
                    }else{
                        re = $('div[id='+_objId+']').filter('[pageId="'+_pageId+'"][srcId="'+_srcId+'"]');
                        if(re.length == 0){
                            re = $('[pageId='+_pageId+']').find('[id='+_objId+']');
                        }
                    }
                }else if($m.pageId != null){
                        re = $('div[id='+_objId+']').filter('[pageId="'+$m.pageId+'"][srcId="'+$m.srcId+'"]');
                }else{
                    re = $('div[id='+_objId+']');
                }
            }else{
                if(_pageId != null){
                    re = $(_tag+'[id='+_objId+']').filter('[pageId="'+_pageId+'"][srcId="'+_srcId+'"]');
                    if(re.length == 0){
                        re = $('[pageId='+_pageId+']').find('[id='+_objId+']');
                    }
                }else if($m.pageId != null){
                    re = $(_tag+'[id='+_objId+']').filter('[pageId="'+$m.pageId+'"][srcId="'+$m.srcId+'"]');
                }else{
                    re = $(_tag+'[id='+_objId+']');
                }       
            }
            
            if(re != null && re.length > 0){
                
                re[0].getCheckbox = function(_checkboxId) {
                    ['grid toolbar내에 있는 checkbox의 정보가져오기'];
                    var cObj = $(this).find('#'+_checkboxId)[0];
                    return {id:_checkboxId,checked:cObj.checked,value:cObj.value};
                };
                re[0].getInput = function(_inputId) {
                    ['grid toolbar내에 있는input의 정보가져오기'];
                    var cObj = $(this).find('#'+_inputId)[0];
                    return {id:_inputId,value:cObj.value};
                };
                
                
                return re[0];
            }else{
                return null;
            }
    };
    
    $m[_srcId].getFormObj = function(_formId,_compId,_formIndex){
		var _formObj = $m[_srcId].getObj(_formId);
		if($m.trim($(_formObj).attr('tdType'))!=''){
			return $($(_formObj).find('div[type="tr"]')[_formIndex -1]).find('#'+_compId)[0];
		}else{
			return $($(_formObj).find('tbody tr')[_formIndex -1]).find('#'+_compId)[0];
		}
		
	};
        
    $m[_srcId].getInput = function(_id){
    	return $m.getObj(_id,"input",this.pageId,this.srcId).value;
    };
    
    $m[_srcId].getFromTo = function(selecterItem,_to_date){
        return $m.getFromToByOption(selecterItem,_to_date,this.pageId,this.srcId);
    };
    
    
    $m[_srcId].getFrom = function(_id){
        //console.log(_id,null,this._pageId,this._srcId,'input');
        return $($m.getObj(_id,null,this.pageId,this.srcId)).find('input')[0].value;
    };
    $m[_srcId].getTo = function(_id){
        return $($m.getObj(_id,null,this.pageId,this.srcId)).find('input')[1].value;
    };
    $m[_srcId].setFrom = function(_id,_val){
    	var _maxlength = $($m.getObj(_id,null,this.pageId,this.srcId)).find('input').attr('maxlength');
    	if($m.trim(_maxlength) != ''){
    		_val = _val.substring(0,_maxlength);
    	}
        $($m.getObj(_id,null,this.pageId,this.srcId)).find('input')[0].value = _val;
    };
    $m[_srcId].setTo = function(_id,_val){
    	var _maxlength = $($m.getObj(_id,null,this.pageId,this.srcId)).find('input').attr('maxlength');
    	if($m.trim(_maxlength) != ''){
    		_val = _val.substring(0,_maxlength);
    	}
        $($m.getObj(_id,null,this.pageId,this.srcId)).find('input')[1].value = _val;
    };
    
    $m[_srcId].getCombo = function(_id){
    	if(typeof _id !="object"){
			var o = $($m.getObj(_id,null,this.pageId,this.srcId));
		}else{
			var o = $(_id);
		}
		if(o.attr('readonly')){
			return o.attr('code');
		}else{
			o = o.find('select');
			return o.val();
		}
    };
    $m[_srcId].getSearchCombo = function(_id){
        var jobj = $($m.getObj(_id,null,this.pageId,this.srcId));
        return {value:jobj.attr("value"),text:jobj.attr("text")};
    };
    $m[_srcId].setSearchCombo = function(_id,_value){
        var thisObj = $m.getObj(_id,null,this.pageId,this.srcId);
        var o = $(thisObj);
        o.attr('value',_value);
        $m.searchComboSetter(thisObj);
        return o;
    };
    $m[_srcId].getComboLabel = function(_id){
    	if(typeof _id !="object"){
			var o = $($m.getObj(_id,null,this.pageId,this.srcId));
		}else{
			var o = $(_id);
		}
		if(o.attr('readonly') && o.find('input').length > 0){
			var l = o.attr('label');
		}else{
			o = o.find('select');
			var v = o.val();
			var l = o.find('option[value=\"'+v+'\"]').text();
		}
		return l;
		/*
        if($m.getObj(_id,null,this.pageId,this.srcId) != null){
            var o = $($m.getObj(_id,null,this.pageId,this.srcId)).find('select');
            var v = o.val();
            var l = o.find('option[value='+v+']').text();
            return l;
        }else{
            console.error("ID:"+_id+"를 "+this.srcId+"에서"+"찾을수 없습니다.");
            return "";
        }
        */
    };
    
    $m[_srcId].getCheckbox = function(_id){
        var obj = {};
        obj.label = $($m.getObj(_id,null,this.pageId,this.srcId)).find('input[type=checkbox]').next().text();
        obj.checked = $($m.getObj(_id,null,this.pageId,this.srcId)).find('input[type=checkbox]').is(':checked');
        if(obj.checked){
            obj.value = 1;
        }else{
            obj.value = 0;
        }
        return obj;
    };
    $m[_srcId].drawGrid = function(_grdId,_list,_response){
        $m.drawGrid_inside(_grdId,_list,_list,this.pageId,this.srcId,_response);
        if(typeof _grdId == 'object'){
            $m.getObj(_grdId.id+"_moca_scroll_y",null,this.pageId,this.srcId).scrollTop = 0; 
        }else{
            $m.getObj(_grdId+"_moca_scroll_y",null,this.pageId,this.srcId).scrollTop = 0; 
        }
        
    };
    $m[_srcId].bindCombo = function(compId,codeOpt,_list){
        var compObj;
        if(compId.indexOf('.') > 0){
            var arr = compId.split('.');
            var g_obj = $m[this.srcId].getObj(arr[0]);
            if(g_obj[arr[1]] == null){
                g_obj[arr[1]] = {};
            }
            compObj = g_obj[arr[1]];
            compObj['list'] = _list;
            compObj['codeOpt'] = codeOpt;
        }else{
            compObj = $m[this.srcId].getObj(compId,null,this.pageId,this.srcId);
            compObj['list'] = _list;
            compObj['codeOpt'] = codeOpt;
            $m.renderCombo(compObj,null,'normal');
        }
    };

    $m[_srcId].bindCell = function(grdId,cellId,codeOpt,_list){ 
        var g_obj = $m.getObj(grdId,null,this.pageId,this.srcId);
        if(g_obj[cellId] == undefined){
            g_obj[cellId] = {};
            g_obj[cellId]['codeOpt'] = codeOpt;
        } 
        g_obj[cellId]['list'] = _list;
        g_obj[cellId]['map'] = $m.listToMap(g_obj[cellId]['list'],g_obj[cellId]['codeOpt']);
    };
    
    $m[_srcId].exe = function(_sObj) {
        $m.exe(_sObj,this);
    };
    
    $m[_srcId].fileDownloadAjax = function(_sObj) {
        _sObj.pageId = this.pageId;
        _sObj.srcId = this.srcId;
        $m.fileDownloadAjax(_sObj);
    };  
    
    $m[_srcId].openPdfViewer = function(_sObj) {
        _sObj.pageId = this.pageId;
        _sObj.srcId = this.srcId;
        $m.openPdfViewer(_sObj);
    };  
    
    $m[_srcId].code = function(_config,_callback,_url) {
        $m.code(_config,_callback,_url,this.pageId,this.srcId);
    };  
    
    $m[_srcId].validate = function(__grdId,_key,_val) {
        return $m.validate(__grdId,_key,_val,this.pageId,this.srcId);
    };  
        
    
    $m[_srcId].getFilteredList = function(_grdId,key,_val,isNot){
        return $m.getFilteredList(_grdId,key,_val,isNot,this.pageId,this.srcId);  
    }
    
    $m[_srcId].getResList = function(_response,_list,_status){
        return $m.getResList(_response,_list,_status,this.pageId,this.srcId); 
    }

    $m[_srcId].setCellData = function(_grd,_realRowIndex,_colId,_data){
        return $m.setCellData(_grd,_realRowIndex,_colId,_data,this.pageId,this.srcId);    
    }
    
    $m[_srcId].getCellData = function(grd,rowIndex,colid){
        return $m.getCellData(grd,rowIndex,colid,this.pageId,this.srcId); 
    }
    $m[_srcId].getCellViewData = function(grd,rowIndex,colid){
        return $m.getCellViewData(grd,rowIndex,colid,this.pageId,this.srcId); 
    }
    
    $m[_srcId].renderCombo = function(_divObj,_val,_gubun){
        return $m.renderCombo(_divObj,_val,_gubun,this.pageId,this.srcId);    
    }    
    
    $m[_srcId].getSelectedRowJson = function(_gridId){
        return $m.getSelectedRowJson(_gridId,this.pageId,this.srcId); 
    }   
    
    $m[_srcId].alert = function(_message,_callback){
        return $m.alert(_message,_callback,this.pageId,this.srcId);   
    }
    
    $m[_srcId].confirm = function(_message,_callback){
        return $m.confirm(_message,_callback,this.pageId,this.srcId); 
    }
    
    $m[_srcId].filterRemoveAll = function(grd){
        return $m.filterRemoveAll(grd,this.pageId,this.srcId);    
    }
    
    $m[_srcId].redrawGrid = function(grd){
        return $m.redrawGrid(grd,this.pageId,this.srcId); 
    }
    
    $m[_srcId].closePopup = function(_thisObj){
        return $m.closePopup(_thisObj,this.pageId,this.srcId);    
    }
    
    $m[_srcId].setTotalCnt = function(_grd,cnt){
        var grd;
        if(typeof _grd == 'string'){
            grd = $m.getObj(_grd,null,this.pageId,this.srcId);
        }else{
            grd = _grd;
        }
        grd.totalCnt = cnt;
        if($m.getAttrObj(grd,'paging').type == 'numberList'){
        	$m[_srcId].setNumberListCnt(grd,cnt);
        }
        return $(grd).find('.grid_total .txt_blue').html($m.comma(cnt));
        
    }
    
    $m[_srcId].getTotalCnt = function(_grd){
        var grd;
        if(typeof _grd == 'string'){
            grd = $m.getObj(_grd,null,this.pageId,this.srcId);
        }else{
            grd = _grd;
        }
        return $(grd).find('.grid_total .txt_blue').text().replace(/,/g,'');
    };
    
    $m.getAttrObj = function(_grdObj,_attr){
    	var attrObj = (_grdObj.getAttribute(_attr) != null)? JSON.parse(_grdObj.getAttribute(_attr)):{};
    	return attrObj;
    };
    
    $m.currentPage = function(_pageButtonOrGridObj){
    	if(_pageButtonOrGridObj == null || _pageButtonOrGridObj.currentPage == null){
    		return 1;
    	}else{
    		return _pageButtonOrGridObj.currentPage;
    	}
    };

    $m.pagingFirst =  function(_pageButtonObj){
    	var grd = $(_pageButtonObj).closest('[type=grid]')[0];
    	var lastPage = $m.getNumListCnt(grd);
    	var _prevP = Number($(grd).find('.moca_grid_paging > .num > button.on').text());
		if(_prevP == 1){
			return;
		}else{
			var _onPageClick = $m.getAttrObj(grd,'paging').onPageClick;
			$m.onPageClick(_pageButtonObj,1,_onPageClick);
		}
    }
    
    $m.pagingPrev =  function(_pageButtonObj){
    	var grd = $(_pageButtonObj).closest('[type=grid]')[0];
		var _prevP = Number($(grd).find('.moca_grid_paging > .num > button.on').text());
		
		if(_prevP == 1){
			return;
		}else{
			var _currentP = _prevP-1;
			grd.currentPage = _currentP;
			var _onPageClick = $m.getAttrObj(grd,'paging').onPageClick;
			$m.onPageClick(_pageButtonObj,grd.currentPage,_onPageClick);
		}
    }
    
    $m.pagingNext =  function(_pageButtonObj){
    	var grd = $(_pageButtonObj).closest('[type=grid]')[0];
    	var lastPage = $m.getNumListCnt(grd);
		var _prevP = Number($(grd).find('.moca_grid_paging > .num > button.on').text());
		
		if(_prevP == lastPage){
			return;
		}else{
			var _currentP = _prevP+1;
			grd.currentPage = _currentP;
			var _onPageClick = $m.getAttrObj(grd,'paging').onPageClick;
			$m.onPageClick(_pageButtonObj,grd.currentPage,_onPageClick);
		}
    }
    $m.pagingLast =  function(_pageButtonObj){
    	var grd = $(_pageButtonObj).closest('[type=grid]')[0];
    	var lastPage = $m.getNumListCnt(grd);
    	var _prevP = Number($(grd).find('.moca_grid_paging > .num > button.on').text());
		if(_prevP == lastPage){
			return;
		}else{
			var _onPageClick = $m.getAttrObj(grd,'paging').onPageClick;
			$m.onPageClick(_pageButtonObj,lastPage,_onPageClick);
		}
    }
    $m.getLimitFrom = function(_grd){
    	return String(($m.currentPage(_grd)-1)*parseInt($m.getAttrObj(_grd,'paging').listCntPerPage));
    }
    
    $m.getLimitPerPage = function(_grd){
    	return $m.getAttrObj(_grd,'paging').listCntPerPage;
    }
    
    $m[_srcId].setNumberListCnt = function(_grd,cnt){
        var grd;
        if(typeof _grd == 'string'){
            grd = $m.getObj(_grd,null,this.pageId,this.srcId);
        }else{
            grd = _grd;
        }
        var numListCnt = $m.getNumListCnt(grd); //3 
        var _onPageClick = $m.getAttrObj(grd,'paging').onPageClick;
        var _pageGroupItemMax = Number($m.getAttrObj(grd,'paging').pageGroupItemMax);
        var _showItemCnt;
        if(_pageGroupItemMax < numListCnt){
        	//총리스트목록 - 보여질목록아이템갯수 0보다 크면 보여질아이템갯수로 보여주고 아닐경우 총리스트목록을보여준다.
        	// var _showItemCnt = Math.ceil(numListCnt/_pagingItemCnt)+1;//3/2
        	 _showItemCnt = _pageGroupItemMax;//3/2  
        }else{
        	 _showItemCnt = numListCnt;
        }
        var a = $(_grd).find('.moca_grid_paging > .num');
        var aTag = '';
        var currentPage  = $m.currentPage(_grd);
        
        if(currentPage == null){
    		currentPage = 1;
    	}

        var startPage = 0;
        if(currentPage%_showItemCnt == 0){
        	startPage = parseInt(currentPage/_showItemCnt-1)*_showItemCnt+1;
        }else{
        	startPage = parseInt(currentPage/_showItemCnt)*_showItemCnt+1;
        }
        
        var lastPage = $m.getNumListCnt(grd);
		for(var i=startPage; i < startPage+_showItemCnt; i++){ 
        	var classon = '';
        	if(currentPage == i){
        		classon = 'class="on" title="현재위치"';
        	}
        	aTag += '<button type=\"button\" '+classon+' onclick=\"$m.onPageClick(this,'+i+','+_onPageClick+')\" >'+i+'</button>';
        	if(i == lastPage){
         		break;
         	}
        };
    	
        return a.html(aTag);
    }
    
    $m.getNumListCnt = function(grd){
    	var numListCnt = Math.ceil(grd.totalCnt/$m.getAttrObj(grd,'paging').listCntPerPage);
    	return numListCnt;
    };    
    
    $m.onPageClick = function(_thisPageBtnObj,pageNum,onPageClickFunctionStr){
    	/*
		$m.eTarget = event.target;
		$m.pageBefore = $m.currentPage(_thisPageBtnObj);
        */	
    	var beforePage = $m.currentPage(_thisPageBtnObj);
    	var currentPage = pageNum;
    	var grd = $(_thisPageBtnObj).closest("[type=grid]")[0];
    	grd.currentPage = currentPage;
    	eval(onPageClickFunctionStr)(pageNum);
    	
    	if(beforePage < currentPage){
    		//페이지그룹이 넘어가는경우 우측
    	}else{
        	$(_thisPageBtnObj).parent().find('.on');
        	$(_thisPageBtnObj).parent().find('.on').removeClass('on');
        	$(_thisPageBtnObj).addClass('on');
    	}
    };
    
    $m[_srcId].getRadio = function(_id){
        var c = $($m.getObj(_id,null,this.pageId,this.srcId)).find('input[type=radio]:checked');
        var obj = {};
        obj.label = c.next().text();
        obj.value = c.val();
        return obj;
    };
    
    $m[_srcId].setFormValue = function(_formId,_targetId,_value){
        //var o = $('#'+_formId+' td[ID="'+_targetId+'"]');
        var o = $('#'+_formId+' [ID="'+_targetId+'"]');
        if(o != null && o.length > 0){
            if(o[0].tagName == "SPAN"){
                o.html(_value);
            }else if(o[0].tagName == 'TD'){
                $m.setValue(o.children().first(),_value);
            }else{
                $m.setValue(o,_value);
            }
        }else{
            
            console.log('-------------->form:target:value',_formId,_targetId,_value);
        }

    };
    $m[_srcId].setTableCellValue = function(_tableId,_id,_index,_value){
        var __comp = $($('table[id='+_tableId+'][pageid='+this.pageId+'] div[id='+_id+']')[_index]);
        var _comp;
        if(__comp.find){
            _comp = __comp[0];
        }else{
            _comp = __comp;
        }
        if('inputCalendar' == $(_comp).attr('type')){
            var v = $m.getDisplayFormat_value(_comp,_value);
            $(_comp).find('input[type=text]').val(v);
        }else if('combo' == $(_comp).attr('type')){
            var v = $m.getDisplayFormat_value(_comp,_value);
            $(_comp).find('select>option[value='+_value+']').prop("selected",true);
        }else{
            $(_comp).find('input[type=text]').val(_value);
        }
        var df = $(_comp).attr('displayFunction');
        if(df){
            var reValue = eval(df)(_value);
            $(_comp).find('input[type=text]').val(reValue);
        }
    };
    $m[_srcId].setTableCellAttribute = function(_tableId,_id,_index,_attrKey,_value){
        var __comp = $($('table[id='+_tableId+'][pageid='+this.pageId+'] div[id='+_id+']')[_index]);
        var _comp;
        if(__comp.find){
            _comp = __comp[0];
        }else{
            _comp = __comp;
        }
        $(_comp).attr(_attrKey,_value);
    };
    $m[_srcId].show = function(_id){
        $('[id='+_id+'][pageid='+this.pageId+']').css("visibility","visible");
    };

    $m[_srcId].show = function(_id){
        $('[id='+_id+'][pageid='+this.pageId+']').css("visibility","visible");
    };
    
    $m[_srcId].radioRedraw = function(_radioCompId,arrString){
        var rdoComp_jq = $('[id='+_radioCompId+'][pageid='+this.pageId+']');
        rdoComp_jq.attr('itemset',arrString);
        $m.renderRadio(rdoComp_jq[0]);
        return rdoComp_jq.find('input:checked').val();
    };
    
    
    if(o.type == 'MDI' && $m.trim(_label) != ''){
        $('li[tab_id='+_tabId+']').click();
    }
    $m.init(_tabId,_srcId);
    return contDiv;
};



Moca.prototype.getType = function(_thisObj) {
    var _type = '';
    if(_thisObj != null){
        if(_thisObj.find){
            _type = _thisObj.closest('div[type]').attr('type'); 
        }else{
            _type = $(_thisObj).closest("div[type]").attr('type'); 
        }
    }
    return _type;
};

Moca.prototype.getTypeObj = function(_thisObj) {
    var _obj = '';
    if(_thisObj != null){
        if(_thisObj.find){
            _obj = _thisObj.closest('div[type]'); 
        }else{
            _obj = $(_thisObj).closest("div[type]"); 
        }
    }
    return _obj;
};
Moca.prototype.renderinclude = function(aTag) {
    ['renderinclude'];
    var _url = $(aTag).attr('src');
    $.ajax({
           type:"GET",
           url:$m._contextRoot+_url+"?"+new Date().getTime(),
           async: false,
           dataType : "text",
           data : {
               "header" : $m.header,
               "body" : {},
               "message" : {}
           },
           success : function(data) {
               if(aTag.id == '__popup'){
                   $m.getContents(data,_url,"POP",aTag.getAttribute("popupid"),aTag.getAttribute("popuptitle"));
               }else{
                   $(aTag).html($m.getContents(data,_url,"CMN",null,null,aTag));
                   $m.callReady(aTag);
               }
           },
           complete : function(data) {
           },
           error : function(xhr, status, error) {
               console.log(xhr, status, error);
           }
    });
};

Moca.prototype.setPageHeader = function(aTag,_label) {
	aTag = aTag[0];
	if(aTag == null){return;}
	if(aTag.id == 'titbox' && _label != null){
		var aTagObj = JSON.parse($(aTag).attr('data'));
		var _parentMenu = $(parent.document).find('#tree1 .moca_tree_tbx[label="'+_label+'"]').closest('.moca_tree_open').find('.moca_tree_tbx').attr('label');
		
		aTagObj['sreenNm'] = _label;
		if($m.trim(_parentMenu) != ''){
			aTagObj['sreenPath'] = _parentMenu+','+_label;
		}else{
			aTagObj['sreenPath'] = _label;
		}
		
		$(aTag).attr('data',JSON.stringify(aTagObj));
	}
	
	$m.renderinclude(aTag);
	
}


Moca.prototype.getFileNameFromUrl = function(_url) {
	var arr = _url.split('?');
	var _fileName = arr[0].substring(arr[0].lastIndexOf('/')+1);
	return _fileName;
};

Moca.prototype.callReady = function(aTag) {
       if(aTag == null){
           return;
       }
       var _url = aTag.getAttribute("src");
       var _fileName = $m.getFileNameFromUrl(_url);
       var _srcId = _fileName.substring(0,_fileName.indexOf('.'));
       var _argsObj = {};
       if(aTag.parent == null){
       		_argsObj.parent = aTag;
       }else{
       		_argsObj = aTag;
       }
       if($(aTag).attr('tab_id') != null && !$(aTag).attr('tab_id').startsWith('POPUP') && aTag.id != "moca_main"){//single page case
    	   if(opener && $('#'+$(aTag).attr('tab_id')+'_dv',opener.document).length > 0){
	   		    var srcid = $('#'+$(aTag).attr('tab_id')+'_dv',opener.document).find('[srcid]').attr('srcid');
	          		$m[srcid].args = JSON.parse(JSON.stringify(opener.$m[srcid].args));
	          		_argsObj = $m[srcid].args;
	   	   }
	    	   
    	   $m[_srcId].args = _argsObj;
           $m[_srcId].___ready(_argsObj);
           var _pageId = $m[_srcId].pageId;
           $m[_pageId] =  $m[_srcId];
       }else if($(aTag).attr('tab_id') != null && $(aTag).attr('tab_id').startsWith('POPUP')){//popup case
    	   if(opener && parent.name == $m[_srcId].pageId ){
    		   if( _srcId != 'COMP_EDIT'){
    			   var srcid = $('#'+$(aTag).attr('tab_id'),opener.document).find('[srcid]').attr('srcid');
              		$m[srcid].args = JSON.parse(JSON.stringify(opener.$m[srcid].args));
              		_argsObj = $m[srcid].args; 
    		   }else{
    			   var srcid = $('#'+$(aTag).attr('tab_id'),opener.document).find('[srcid]').attr('srcid');
           			$m[_srcId].args = JSON.parse(JSON.stringify(opener.$m[srcid].args));
	          		_argsObj = $m[_srcId].args;
           		}
    	   }
    	   $m[_srcId].args = _argsObj;	
           $m[_srcId].___ready(_argsObj);
           var _pageId = $m[_srcId].pageId;
           $m[_pageId] =  $m[_srcId];
       }else if($(aTag).attr('tab_id') == null && aTag.id != "moca_main"){//popup case
    	   $m[_srcId].args = _argsObj;
           $m[_srcId].___ready(_argsObj);
       }
};

Moca.prototype.injectionPageObj = function(data,_pageId,_srcId,_mode) { 
    if(_mode == '혼합모드'){
        data =data.replace(/.*new Moca().*/g,''); 
       
        return data = data.replace(/<script>/gi,'<script>var $m = new Moca();'+'$m.'+_srcId+'={"pageId":"'+_pageId+'","srcId":"'+_srcId+'"};'); 
    }else{
        return data = data.replace(/<script(.*?)>/gi,'<script>'+'$m.'+_srcId+'={"pageId":"'+_pageId+'","srcId":"'+_srcId+'"};'); 
    }
    
};

Moca.prototype.getIncludeScope = function(includeObj,thisObj) { 
    return includeObj.find('[pageId='+thisObj.pageId+'][role=includeContents]');
};

/*
    $m.userLogInsert({URL:_url,SRCID:_srcId,LABEL:_label,MENU_NM:_label});
 */
Moca.prototype.userLogInsert = function(_info) { 
    if(mocaConfig.userLogInsert != false){
        if($m.trim(_info.LABEL) == ''){
            _info.LABEL = _info.URL;
        }
        $m.exe({
            url : $m._domain+mocaConfig.userLogUrl,
            loadingbar:false,
            data : {
                "header" : $m.header,
                "body" : {
                    "CORP_CD":$m.getCORP_CD(),
                    "USER_ID":$m.getSession("USER_ID"),
                    "URL":_info.URL,
                    "SRCID":_info.SRCID,
                    "LABEL":_info.LABEL,
                    "MENU_NM":_info.MENU_NM
                }
            },      
            callback : function(){

            }
        });
    }
};

Moca.prototype.getFromToByOption = function(objIndexText,_to_date) { 
    if(_to_date != null){
        _to_date = _to_date.replace(/-/g,'');
    }
    
    let now = new Date();
    let y = now.getFullYear();
    let m = comLib.gfn_toTwoChar(now.getMonth()+1);
    let d = comLib.gfn_toTwoChar(now.getDate());
    let dateStrL = "";
    let monthStrL = "";
    let yearStrL = "";
    
    let dateStrR = "";
    let monthStrR = "";
    let yearStrR = "";
    
    let today = dateLib.getToday();
    let yesterday = dateLib.addDayFormat (dateLib.getToday(), -1,'');
    let preWeekBasisDt = dateLib.addDayFormat (today, -7,'');
    
    let startDt = "";
    let endDt = "";
    
    let tempDay = "";
    
    switch (objIndexText) {
    case '오늘' :
        yearStrL = today.substring(0,4);
        monthStrL = today.substring(4,6);
        dateStrL = today.substring(6,8);
        yearStrR = today.substring(0,4);
        monthStrR = today.substring(4,6);       
        dateStrR = today.substring(6,8);
        break;
    case '전일' :
        yearStrL = yesterday.substring(0,4);
        monthStrL = yesterday.substring(4,6);
        dateStrL = yesterday.substring(6,8);
        yearStrR = yesterday.substring(0,4);
        monthStrR = yesterday.substring(4,6);
        dateStrR = yesterday.substring(6,8);
        break;
    case '금주' :
        startDt = dateLib.getWeekTerm(today,true);
        endDt = dateLib.getWeekTerm(today,false);
        yearStrL = startDt.substring(0,4);
        monthStrL = startDt.substring(4,6);
        dateStrL = startDt.substring(6,8);
        yearStrR = endDt.substring(0,4);
        monthStrR = endDt.substring(4,6);   
        dateStrR = endDt.substring(6,8);
      break;
    case '전주' :
        startDt = dateLib.getWeekTerm(preWeekBasisDt,true);
        endDt = dateLib.getWeekTerm(preWeekBasisDt,false);
        yearStrL = startDt.substring(0,4);
        monthStrL = startDt.substring(4,6);
        dateStrL = startDt.substring(6,8);
        yearStrR = endDt.substring(0,4);
        monthStrR = endDt.substring(4,6);
        dateStrR = endDt.substring(6,8);
      break;
    case '당월' :
        startDt = dateLib.getFirstDayOfMonth(today);
        endDt = dateLib.getLastDayOfMonth(today);
        yearStrL = startDt.substring(0,4);
        monthStrL = startDt.substring(4,6);
        dateStrL = startDt.substring(6,8);
        yearStrR = endDt.substring(0,4);
        monthStrR = endDt.substring(4,6);
        dateStrR = endDt.substring(6,8);
      break;
    case '전월' :
        tempDay = dateLib.addDayFormat(dateLib.getFirstDayOfMonth(today), -1,'');
        startDt = dateLib.getFirstDayOfMonth(tempDay);
        endDt = dateLib.getLastDayOfMonth(tempDay);
        yearStrL = startDt.substring(0,4);
        monthStrL = startDt.substring(4,6);
        dateStrL = startDt.substring(6,8);
        yearStrR = endDt.substring(0,4);
        monthStrR = endDt.substring(4,6);
        dateStrR = endDt.substring(6,8);        
      break;
    case '당분기' :
        tempDay = dateLib.getQuarterTerm(today);
        startDt = tempDay['from'];
        endDt = tempDay['to'];
        yearStrL = startDt.substring(0,4);
        monthStrL = startDt.substring(4,6);
        dateStrL = startDt.substring(6,8);
        yearStrR = endDt.substring(0,4);
        monthStrR = endDt.substring(4,6);
        dateStrR = endDt.substring(6,8);        
      break;
    case '전분기' :
        tempDay = dateLib.getQuarterTerm(dateLib.addDayFormat (dateLib.getQuarterTerm(today)['from'], -1,''));
        startDt = tempDay['from'];
        endDt = tempDay['to'];
        yearStrL = startDt.substring(0,4);
        monthStrL = startDt.substring(4,6);
        dateStrL = startDt.substring(6,8);
        yearStrR = endDt.substring(0,4);
        monthStrR = endDt.substring(4,6);
        dateStrR = endDt.substring(6,8);    
      break;
    case '당년' :
        startDt = dateLib.getFirstDayOfYear(today);
        endDt = dateLib.getLastDayOfYear(today);
        yearStrL = startDt.substring(0,4);
        monthStrL = startDt.substring(4,6);
        dateStrL = startDt.substring(6,8);
        yearStrR = endDt.substring(0,4);
        monthStrR = endDt.substring(4,6);
        dateStrR = endDt.substring(6,8);    
      break;
    case '전년' :
        tempDay = dateLib.addDayFormat (dateLib.getFirstDayOfYear(today), -1,'');
        startDt = dateLib.getFirstDayOfYear(tempDay);
        endDt = dateLib.getLastDayOfYear(tempDay);
        yearStrL = startDt.substring(0,4);
        monthStrL = startDt.substring(4,6);
        dateStrL = startDt.substring(6,8);
        yearStrR = endDt.substring(0,4);
        monthStrR = endDt.substring(4,6);
        dateStrR = endDt.substring(6,8);
      break;
    }

    if(objIndexText.indexOf('년전') > 0){
        var year_str = objIndexText.replace(/(^\d+).*?$/g,'$1');
        var year_num =  -(Number(year_str)*12);
        if(_to_date == null){
            endDt = multiCalendar.calendarVariable.calArray[1].dateArray.year+multiCalendar.calendarVariable.calArray[1].dateArray.month+multiCalendar.calendarVariable.calArray[1].dateArray.date;
        }else{
            endDt = _to_date;
        }       
        
        if(endDt == ''){
            yearStrR =  today.substring(0,4);
            monthStrR = today.substring(4,6);   
            dateStrR = today.substring(6,8);
        }else{
            endDt = endDt.replace(/-/g,'');
            yearStrR = endDt.substring(0,4);
            monthStrR = endDt.substring(4,6);
            dateStrR = endDt.substring(6,8);
        }
    
        tempDay = dateLib.addMonth(yearStrR,monthStrR,dateStrR,year_num);
        startDt = tempDay;
        yearStrL = startDt.substring(0,4);
        monthStrL = startDt.substring(4,6);
        dateStrL = startDt.substring(6,8);
    }else if(objIndexText.indexOf('개월') > 0){
        var month_str = objIndexText.replace(/(^\d+).*?$/g,'$1');
        var month_num =  -Number(month_str);
        if(_to_date == null){
            endDt = multiCalendar.calendarVariable.calArray[1].dateArray.year+multiCalendar.calendarVariable.calArray[1].dateArray.month+multiCalendar.calendarVariable.calArray[1].dateArray.date;
        }else{
            endDt = _to_date;
        }
        if(endDt == ''){
            yearStrR =  today.substring(0,4);
            monthStrR = today.substring(4,6);   
            dateStrR = today.substring(6,8);
        }else{
            endDt = endDt.replace(/-/g,'');
            yearStrR = endDt.substring(0,4);
            monthStrR = endDt.substring(4,6);
            dateStrR = endDt.substring(6,8);
        }
        
        tempDay = dateLib.addMonth(yearStrR,monthStrR,dateStrR,month_num);
        startDt = tempDay;
        yearStrL = startDt.substring(0,4);
        monthStrL = startDt.substring(4,6);
        dateStrL = startDt.substring(6,8);
    }else if(objIndexText.indexOf('일전') > 0){
        var day_str = objIndexText.replace(/(^\d+).*?$/g,'$1');
        var day_num =  -Number(day_str);
        if(_to_date == null){
            endDt = multiCalendar.calendarVariable.calArray[1].dateArray.year+multiCalendar.calendarVariable.calArray[1].dateArray.month+multiCalendar.calendarVariable.calArray[1].dateArray.date;
        }else{
            endDt = _to_date;
        }
        if(endDt == ''){
            yearStrR =  today.substring(0,4);
            monthStrR = today.substring(4,6);   
            dateStrR = today.substring(6,8);
        }else{
            endDt = endDt.replace(/-/g,'');
            yearStrR = endDt.substring(0,4);
            monthStrR = endDt.substring(4,6);
            dateStrR = endDt.substring(6,8);
        }

        tempDay = dateLib.addDayFormat (yearStrR+monthStrR+dateStrR, day_num);
        startDt = tempDay;
        yearStrL = startDt.substring(0,4);
        monthStrL = startDt.substring(4,6);
        dateStrL = startDt.substring(6,8);
    }else if(objIndexText.indexOf('일후') > 0){
        var day_str = objIndexText.replace(/(^\d+).*?$/g,'$1');
        var day_num =  Number(day_str);
        if(_to_date == null){
            startDt = multiCalendar.calendarVariable.calArray[0].dateArray.year+multiCalendar.calendarVariable.calArray[0].dateArray.month+multiCalendar.calendarVariable.calArray[0].dateArray.date;
        }else{
            startDt = _to_date;
        }
        if(startDt == ''){
            yearStrL =  today.substring(0,4);
            monthStrL = today.substring(4,6);   
            dateStrL = today.substring(6,8);
        }else{
            endDt = startDt.replace(/-/g,'');
            yearStrL = startDt.substring(0,4);
            monthStrL = startDt.substring(4,6);
            dateStrL = startDt.substring(6,8);
        }

        tempDay = dateLib.addDayFormat (yearStrL+monthStrL+dateStrL, day_num);
        endDt= tempDay;
        yearStrR = endDt.substring(0,4);
        monthStrR = endDt.substring(4,6);
        dateStrR = endDt.substring(6,8);
    }
    var reObj ={};
    reObj["yearStrL"] = yearStrL;
    reObj["monthStrL"] = monthStrL;
    reObj["dateStrL"] = dateStrL;
    
    reObj["yearStrR"] = yearStrR;
    reObj["monthStrR"] = monthStrR;
    reObj["dateStrR"] = dateStrR;
    
    var df = "-";
    reObj["from"] = yearStrL+ df +monthStrL+ df + dateStrL;
    reObj["to"] = yearStrR+ df +monthStrR+ df + dateStrR;
    return reObj;
};

Moca.prototype.getContent = function(_url,_callback) { 
    var re_proccess = $.ajax({
           type:"GET",
           url:_url,
           async: true,
           dataType : "text",
           data : {
           },
           success : function(data){
               return _callback(data);
           },
           complete : function(data) {
           },
           error : function(xhr, status, error) {
               console.log(xhr, status, error);
           }
        });
    return re_proccess;
};

Moca.prototype.tabSubClick = function(_funcStr,_rowIndex,_thisObj) { 
    var _tabListStr = $(_thisObj).closest('div[type=tab]').attr("list");
    var _tabList = JSON.parse(_tabListStr);
    var srcFullId = _tabList[(_rowIndex-1)].src;
    var srcId = srcFullId.replace(/\/html\/TO\//g,"").replace(/\.html/g,"");
    eval(_funcStr)(_tabList[_rowIndex-1].id,_rowIndex,_thisObj);
};

Moca.prototype.renderTab = function(aTag) { 
    var listStr = aTag.getAttribute("list");
    aTag.addEventListener('click', $m.tabClick);
        
    var onTabHeaderclickFunctionStr = aTag.getAttribute("onTabHeaderclick");
    
    var list = JSON.parse(listStr);
    var tabConts = '';
    tabConts +='                <div class="moca_layer_tab_head" >\n';
    tabConts +='                    <div class="moca_layer_tab_listarea">\n';
    tabConts +='                        <div class="moca_layer_tab_scroll">\n';
    tabConts +='                            <ul role="tablist" class="moca_layer_tab_ul">\n';
    
    var activeIndex = 0;
    for(var i=0; i < list.length; i++){
        var row = list[i];
        var active = '';
        if(row.active == 'true' || row.active == true){
            active = 'active';
            activeIndex = (i+1);
        }
        //onclick="$m.tabSubClick(\''+onTabHeaderclickFunctionStr+'\',\''+(i+1)+'\',this)"
        tabConts +='<li class="moca_layer_tab_list '+active+'" id="'+row.id+'" index="'+(i+1)+'"  >\n';
        tabConts +=' <button type="button" role="tab" aria-controls="moca_tab_bridge1"><span>'+row.label+'</span><i class="tab_badge" ></i></button>\n';
        tabConts +=' <span class="tab_bg"></span>';
        tabConts +='</li>\n';
    }
    tabConts +='                            </ul>\n';
    tabConts +='                        </div>\n';
    tabConts +='                    </div>\n';
    tabConts +='                <div class="moca_layer_tab_control">\n';
    tabConts +='					<button type="button" class="moca_tab_top" onclick="$m.changeTabPosition(this);" title="탭상하변경" id="btn_layerTab_bottom">탭상하변경</button>\n';
    tabConts +='				</div>\n';
    tabConts +='                </div>\n';
    
    tabConts +='                <div class="moca_layer_tab_body">\n';
    
    for(var i=0; i < list.length; i++){
        var row = list[i];
        var active = '';
        if(row.active == 'true' || row.active == true){
            active = 'active';
        }
            
        tabConts +='<div type="tabContent" contentId="'+row.id+'" class="moca_layer_tab_panel" role="tabpanel" aria-labelledby="탭1" aria-hidden="false" style="display:none" index="'+(i+1)+'">\n';
        tabConts +='</div>\n';
    }
    tabConts +='                </div>\n';
    $(aTag).html(tabConts);
    
    var tabComp = aTag;
    $m.showTabContent(tabComp,activeIndex);
    return aTag;
};
Moca.prototype.tabClick = function(thisObj) {
    ['tab기본선택이벤트'];
    var o = thisObj.srcElement;
    if($(o).parent().hasClass("moca_layer_tab_list") || $(o).parent().parent().hasClass("moca_layer_tab_list")){
        var tabCompDiv = $(o).closest('[type=tab]')[0];
        $(o).closest('ul').find('li').removeClass('active');
        $(o).closest('li').addClass('active');
        var activeIndex = $(o).closest('li').attr('index');
        if(tabCompDiv.getAttribute("onTabHeaderclick")){
            $m.showTabContent(tabCompDiv,activeIndex,true);
        }else{
            $m.showTabContent(tabCompDiv,activeIndex);
        }
        
    }
};
Moca.prototype.showTabContent = function(_tabCompDiv,activeIndex,_isEventExe) {
    ['tab기본선택이벤트'];
    var listStr = _tabCompDiv.getAttribute("list");
    var list = JSON.parse(listStr);
    var  cTag = $(_tabCompDiv).find('[type=tabContent][index='+activeIndex+']')[0];
    cTag.setAttribute('src',list[(activeIndex-1)].src);
    $(_tabCompDiv).find('[type=tabContent]').css('display','none');
    $(cTag).css('display','block');
    cTag.innerHTML = '';
    if(cTag.innerText == ''){
        if(_isEventExe){
            var pro = Promise.resolve();
            pro = pro.then(function(){
                return new Promise(function(resolve,reject){
                    $m.getTabContents(cTag,resolve);
                });
            });
            pro = pro.then(function(){
                eval(_tabCompDiv.getAttribute("onTabHeaderclick"))(list[activeIndex-1].id,activeIndex,null);
            });
            return pro;
        }else{
            $m.getTabContents(cTag);
        }
    }
};
Moca.prototype.getTabContents = function(_aTag,_resolve){
    ['tab에들어가는src를가져옵니다.'];
    var aTag = _aTag;
    var _url = $(aTag).attr('src');
    $.ajax({
       type:"GET",
       url:$m._contextRoot+_url,
       async: false,
       dataType : "text",
       data : {
           "header" : $m.header,
           "body" : {},
           "message" : {}
       },
       success : function(data) {
            data = $m.getContents(data,_url,"CMN",aTag);
            var o = {type:"TAB"};
            o.url = _url;
            o.srcId = $m.url_to_srcId(_url);
            o.label = o.srcId;
            o.data = data;
            var mdiObj = $m.rendering(o,aTag);
            $m.callReady(mdiObj);
            
            if(_resolve){
                _resolve();
            }
       },
       complete : function(data) {
       },
       error : function(xhr, status, error) {
           console.log(xhr, status, error);
       }
    });
};

Moca.prototype.popup = function(_option,thisObj) {
    ['레이어 팝업오픈'];
    if($('#'+_option.id+'[pageid='+this.pageId+']').length > 0 && _option.scopeId.startsWith('MDI')){
        return;
    }
    if(self !== top){
    	//iframe
    	_option.scopeId = parent.$m.pageId;
    	parent.$m.popup(_option,thisObj);
    	return;
	}
    $.ajax({
           type:"GET",
           url:$m._contextRoot+_option.url,
           async: false,               
           dataType : "html",
           data : {
               "header" : $m.header,
               "body" : _option.data,
               "message" : {}
           },
           success : function(_htmlContents) {
                //var popupId = "POPUP_"+$m.now()+$m.shuffleRandom(6);
                //$m.callbacks[popupId] = _option.callback;
                //$m.data[popupId] = _option.data;
                var pattern = /<head.*?meta_width=(.*).*?meta_height=(.*).*?\\?>/gi;
                var width= 0;
                var height = 0;
                var gep = 0;//중복팝업시 계단형구현에 필요함
                var gep_top = 0;
                if (pattern.test(_htmlContents)) {
                    var _width = RegExp.$1;
                    var _height = RegExp.$2;
                    width = _width.replace(/\"|\'|(px)|\s/gi,'');
                    height = _height.replace(/\"|\'|(px)|\s/gi,'');
                }else{
                    width = _option.width;
                    height = _option.height;
                }
                
                if(document.body.clientHeight <  height){
                    height = document.body.clientHeight;
                }
                if(document.body.clientWidth <  width){
                    width = document.body.clientWidth;
                }           
                if($m.getDevice() != 'pc'){
                	height = document.body.clientHeight;
                }
                
                var top = (document.body.offsetHeight/2) - (parseInt(height)/2) + $(document).scrollTop()+gep_top;
                var defaultTop = 0;
                if(_option.scopeId != null){
                    
                    if(_option.scopeId != null && _option.scopeId.indexOf('POPUP') > -1){
                        top = 0;
                        //if(top < 0){
                        //  top = 0;
                        //}
                    }else if(_option.scopeId != null && _option.scopeId.indexOf('TAB') > -1){
                        defaultTop = $($('div[pageid="'+_option.scopeId+'"]')[0]).closest('[mdi_id]').offset().top;
                        top -= defaultTop;
                        //if(top < 0){
                        //  top = 0;
                        //}                     
                    }else{
                        defaultTop = $('div[pageid="'+_option.scopeId+'"].moca_tab_panel[role=mdipanel]').offset().top;
                        top -= defaultTop;
                        //if(top < 0){
                        //  top = -defaultTop;
                        //}
                    }
                }
                
                if(top < 0 && Math.abs(top) < defaultTop){
                    top += -25;
                }
                //if(top < 0){
                //  top = -defaultTop;
                //}
                
                var left = (document.body.offsetWidth/2) - (parseInt(width)/2) + $(document).scrollLeft()+gep;
                if(_option.scopeId != null){
                    if(_option.scopeId.indexOf('POPUP') > -1){
                        left -= $('div[id="'+_option.scopeId+'"][tab_id='+_option.scopeId+']').offset().left;
                    }else if(_option.scopeId != null && _option.scopeId.indexOf('TAB') > -1){
                        left -= $($('div[pageid="'+_option.scopeId+'"]')[0]).closest('[mdi_id]').offset().left;
                    }else{
                        left -= $('div[pageid="'+_option.scopeId+'"].moca_tab_panel[role=mdipanel]').offset().left;
                    }
                }
                //left += "px" ;
                
                //top = top.replace(/\"|\'|(px)|\s/gi,'');
                //left = left.replace(/\"|\'|(px)|\s/gi,'');
                
                var o = _option;
                o.srcId = $m.url_to_srcId(_option.url);
                o.htmlContents = _htmlContents;
                o.top = top;
                o.left = left;
                o.width = width;
                o.height = height;
                o.scopeId = _option.scopeId;
                var popObj = $m.rendering(o);
                
                $('.moca_input:first').focus();
                $('.moca_input:first').blur();
                
                var _pageid = $(popObj).attr('tab_id');
                if($('div[pageid="'+_pageid+'"].moca_titbox').length > 0){
                	$m.setPageHeader($('div[pageid="'+_pageid+'"].moca_titbox'), o.title);
                }
                $m.callReady(popObj);
           },
           complete : function(data) {
              // $m.loading(loadingId);
           },
           error : function(xhr, status, error) {
               console.log(xhr, status, error);
           }
        });
};



Moca.prototype.openWindowPopup = function(_opt){
    ['윈도우 팝업오픈'];
    var width;
    if(_opt.width != null){
        width = (_opt.width+'').replace(/px/ig,'');
    }
    var height;
    if(_opt.height != null){
        height = (_opt.height+'').replace(/px/ig,'');
    }   
    if(_opt.fullscreen == 'yes'){
        width = screen.availWidth;
    }
    if(_opt.fullscreen == 'yes'){
        height = screen.availHeight;
    }
    var w;
    if(width == null){
        w = 1280;
    }else{
        w = width;
    }
    var h;
    if(height == null){
        h = 800;
    }else{
        h = height;
    }
    h = h-80;
    w = w-16;
    var left    = (screen.availWidth/2)-(w/2)-20;
    var top     = (screen.availHeight/2)-(h/2); 
    top = top -34;//타이블바 만큼 보정
    var params = _opt.param;
    if(_opt.method == 'post'){
    	params["__title"] = _opt.title;
    	params["__popid"] = _opt.id;
    	params["user_id"] = $m.getSession("USER_ID");
    }
    var paramArray = Object.keys(params);
    var re_params = '';
    for(var i=0; i < paramArray.length; i++){
        var key = paramArray[i];
        var val = params[key];
        re_params = re_params + key+'='+$m.encode(val);
        if(i != paramArray.length-1){
            re_params = re_params +"&";
        }else{
            re_params = re_params +"&user_id="+$m.getSession("USER_ID");
        }
    }
    var addFlag = '';
    if(_opt.url.indexOf('?') > -1){
    	addFlag = '&';
    }else{
    	addFlag = '?';
    }
    var _url = _opt.url+addFlag+"__popid="+_opt.id+"&__title="+$m.encode(_opt.title);
    //var url = _opt.url+addFlag+"__popid="+_opt.id+"&__title="+$m.encode(_opt.title)+"&"+re_params;
    var reid = '';
    try{
	    if(_opt.method == 'post'){
	    	reid = window.open('',_opt.id,"width="+w+",height="+h+",toolbar=no,status=yes,"+"left="+left+",top="+top);
	    	$m.submit(_url,params,_opt.id);
	    }else{
	    	reid = window.open(_url,_opt.id,"width="+w+",height="+h+",toolbar=no,status=yes,"+"left="+left+",top="+top);
	    }
    }catch(e){
    	alert(e);
    }
    return reid;
};



Moca.prototype.setAdditionTag = function(_p) {
    ['component내 addition area넣기'];
    try{
        var p;
        if(!_p.attr){
            p = $(_p);
        }   
        var addition = JSON.parse(p.attr("addition"));
        var additionObj = $m.getAdditionTag(addition,p.attr('pageid'),p.attr('srcid'));
        p.find('.moca_addtion_area>.lta').html(additionObj.left);
        p.find('.moca_addtion_area>.rta').html(additionObj.right);
    }catch(e){
    };
};

Moca.prototype.getAdditionTag = function(_additionArr,pageid,srcid) {
    ['Addition내 component넣기'];
    var _html_left = '';
    var _html_right = '';
    for(var i=0; i < _additionArr.length; i++){
        var aAddition = _additionArr[i];
        var aTag_html = '';
        if(aAddition.type == 'button'){
            aTag_html = $m.renderMocaButton(aAddition);
        }else if(aAddition.type == 'label'){
            aTag_html = $m.renderMocaLabel(aAddition);
        }else if(aAddition.type == 'input'){
            aTag_html = $m.renderMocaInput(aAddition);
        }else if(aAddition.type == 'combo'){
            aTag_html = $m.renderMocaCombo(aAddition,pageid,srcid);
        }
        
        if(aAddition.position == 'left'){
            _html_left += aTag_html;
        }else{
            _html_right += aTag_html;
        }
    };
    return {left:_html_left,right:_html_right};
};


Moca.prototype.renderMocaButton = function(o) {
    ['MocaButton만들기'];
    var _id = '';
    var _value = '';
    var _readonly = '';
    var _innerStyle = '';
    var _innerClass = '';
    var _label = '';
    var _disabled = '';
    if(o.tagName == 'DIV'){
        _value = $m.nul(o.getAttribute("value"));
        _label = $m.nul(o.getAttribute("label"));
        _id = $m.nul(o.getAttribute("id"));
        _innerStyle = $m.nul(o.getAttribute("innerStyle"));
        _innerClass = $m.nul(o.getAttribute("innerClass"));
        var tmp_disabled = $m.nul(o.getAttribute("innerDisabled"));
        if($m.isTrue(tmp_disabled)){
            _disabled = "disabled";
            _innerStyle += ";background:#aaa;";
        }
        
        var _tmp = $m.nul(o.getAttribute("readonly"));
        if($m.isTrue(_tmp)){
            _readonly = "readonly";
        }else{
            _readonly = "";
        }
        _onclick = $m.nul(o.getAttribute("onclick"));
        var _html = '';
        var _onclickStr ='';
        if($m.trim(_onclick) != ''){
        	_onclickStr = 'onclick="'+_onclick+'"';
        	o.removeAttribute("onclick");
        }
        _html += '<button id="button_'+$m.nul(_id)+'"  style="'+_innerStyle+'" class="'+_innerClass+'" '+_disabled+' '+_onclickStr+'>'+$m.nul(_label)+'</button>';
        o.innerHTML = _html;
    }else{
        _value = $m.nul(o.value); 
        _label = $m.nul(o.label);
        _id = $m.nul(o.id);
        _innerStyle = $m.nul(o.innerStyle);
        _innerClass = $m.nul(o.innerClass);
        var tmp_disabled = $m.nul(o.innerDisabled);
        if($m.isTrue(tmp_disabled)){
            _disabled = "disabled";
            _innerStyle += ";background:#aaa;";
        }
        
        
        var _tmp = $m.nul(o.readonly);    
        if($m.isTrue(_tmp)){
            _readonly = "readonly";
        }else{
            _readonly = "";
        }
        
        var _html = '';
        _html += '<div id="'+$m.nul(o.id)+'"  class="mocaButton '+$m.nul(o.addClass)+'" onclick="'+$m.nul(o.onclick)+'(this)" style="'+$m.nul(o.style)+'">';
        _html += '<button id="button_'+$m.nul(o.id)+'"  style="'+_innerStyle+'" class="'+_innerClass+'" '+_disabled+' >'+$m.nul(o.label)+'</button>';
        _html += '</div>';
        
        return _html;
    }
};



Moca.prototype.renderMocaDiv = function(o) {
    ['Div숨기기'];
    var _mobileHide = '';
    if(o.tagName == 'DIV'){
        _mobileHide = $m.nul(o.getAttribute("mobileHide"));
        if($m.getDevice()=='mobile'){
        	 o.style.display = 'none';
        }
       
    }
};

Moca.prototype.setDisabled = function(o,_value) {
    ['컴포넌트 비활성화설정'];
    if(o != null){
        if(o.tagName == 'DIV'){
            var tmp  = $(o).find('button');
            if(tmp != null && tmp.length > 0){
                o = tmp[0];
            }
        }
        if($m.isTrue(_value)){
        	o.setAttribute("disabled",true);
            $(o).css('background','#aaa');
            if($(o).parent().attr('type') == 'button'){
            	$(o).parent().removeClass('disabled');
                $(o).parent().addClass('disabled');
            }
            
        }else{
            o.removeAttribute("disabled");
            $(o).css('background','');
            if($(o).parent().attr('type') == 'button'){
                 $(o).parent().removeClass('disabled');
            }
           
        }
    }
};
Moca.prototype.setButtonLabel = function(o,_value) {
    ['버튼 라벨 지정'];
    if(o != null){
        o.innerHTML = _value;
    }
};

Moca.prototype.isTrue = function(_value) { 
    ['true여부'];
    var tmp = '';
    tmp += _value;
    if(tmp == 'true'){
        return true;
    }else{
        return false;
    }
};


Moca.prototype.renderMocaLabel = function(o) {
    ['MocaLabel만들기'];
    var _html = '';
    _html += '<div class="mocaLabel '+$m.nul(o.addClass)+'" onclick="'+$m.nul(o.onclick)+'(this)" style="'+$m.nul(o.style)+'">';
    _html += '<span class="label">'+$m.nul(o.value)+'</span>';
    _html += '</div>';
    return _html;
};

Moca.prototype.renderMocaInput = function(o) {
    ['MocaInput만들기'];
    var _id = '';
    var _value = '';
    var _readonly = '';
    var _innerStyle = '';
    var _innerClass = '';
    var _onInnerClick = '';
    var _innerDisabled = '';
    var _disabled = '';
    var _innerOnblur = '';
    var _displayFunction = '';
    var _keyMask = '';
    var _maxLength = '';
    var _mobileHide = '';
    var _displayfunctionapply = '';
    if(o.tagName == 'DIV'){
        _value = $m.nul(o.getAttribute("value"));
        _id = $m.nul(o.getAttribute("id"));
        _innerStyle = $m.nul(o.getAttribute("innerStyle"));
        _innerClass = $m.nul(o.getAttribute("innerClass"));
        _onInnerClick = $m.nul(o.getAttribute("onInnerClick"));
        _innerDisabled = $m.nul(o.getAttribute("innerDisabled"));
        _innerOnblur = $m.nul(o.getAttribute("innerOnblur"));
        _displayFunction = $m.nul(o.getAttribute("displayFunction"));
        _keyMask = $m.nul(o.getAttribute("keyMask"));
        _maxLength = $m.nul(o.getAttribute("maxLength"));
        _mobileHide = $m.nul(o.getAttribute("mobileHide"));
        _displayfunctionapply = $m.nul(o.getAttribute("displayfunctionapply"));
        var _keyMaskStr = '';
        if($m.trim(_keyMask) != ''){
            _keyMaskStr = _keyMask;
        }
        var _maxLengthStr = '';
        if($m.trim(_maxLength) != ''){
            _maxLengthStr = " maxlength=\""+_maxLength+"\" ";
        }       
        var _tmp = $m.nul(o.getAttribute("readonly"));
        if(_tmp == "true"){
            _readonly = "readonly";
        }else{
            _readonly = "";
        }
        if(_innerDisabled == "true"){
            _disabled = "disabled";
        }else{
            _disabled = "";
        }
        
        var _event="onblur";
        if(_displayfunctionapply == 'realtime'){
        	_event="onkeyup";
        }
        var _html = '';
        _html += '<input type="text" '+_maxLengthStr+' '+_event+'="$m.setValue(this,this.value,\''+_keyMaskStr+'\');'+_innerOnblur+'"  onkeydown="$m.keydown(this,this.value,\''+_keyMaskStr+'\');" style="'+_innerStyle+'" class="'+_innerClass+'" id="input_'+_id+'" displayFunction="'+_displayFunction+'"  autocomplete="off" value="'+_value+'" '+_readonly+' onclick="'+_onInnerClick+'"  '+_disabled+'>';
        o.innerHTML = _html;
    }else{
        _value = $m.nul(o.value); 
        _id = $m.nul(o.id);
        _innerStyle = $m.nul(o.innerStyle);
        _innerClass = $m.nul(o.innerClass);
        var _tmp = $m.nul(o.readonly);    
        if(_tmp == "true"){
            _readonly = "readonly";
        }else{
            _readonly = "";
        }
        
        var _html = '';
        _html += '<div id="'+$m.nul(o.id)+'" class="mocaInput '+$m.nul(o.addClass)+'" onclick="'+$m.nul(o.onclick)+'(this)" style="'+$m.nul(o.style)+'">';
        _html += '<input type="text"  style="'+_innerStyle+'" class="'+_innerClass+'"  id="input_'+$m.nul(o.id)+'" autocomplete="off" value="'+_value+'" '+_readonly+'>';
        _html += '</div>';
        return _html;
    }
};

Moca.prototype.renderMocaInputButton = function(o) {
    ['MocaInputButton만들기'];
    var _id = '';
    var _value = '';
    var _readonly = '';
    var _required = '';
    var _style = '';
    var _callFunction = '';
    var _innerStyle = '';
    var _innerClass = '';
    if(o.tagName == 'DIV'){
        _value = $m.nul(o.getAttribute("value"));
        _id = $m.nul(o.getAttribute("id"));
        _required = $m.nul(o.getAttribute("required"));
        _style = $m.nul(o.getAttribute("style"));
        _callFunction = $m.nul(o.getAttribute("callFunction"));
        _innerStyle = $m.nul(o.getAttribute("innerStyle"));
        _innerClass = $m.nul(o.getAttribute("innerClass"));
        var _tmp = $m.nul(o.getAttribute("readonly"));
        if(_tmp == "true"){
            _readonly = "readonly";
        }else{
            _readonly = "";
        }
        var _html = '';
        
        
        if(_required == 'true'){
            $(o).addClass("req");
        }
        _html += '<input type="text" style="'+_innerStyle+'" class="'+_innerClass+'"  id="input_'+_id+'" autocomplete="off" value="'+_value+'" '+_readonly+'>';
        if($m.trim(_callFunction) != ''){
            _html += '<button type="button" onclick="'+_callFunction+'(this)">검색</button>';
        }
        o.innerHTML = _html;
    }else{
        _value = $m.nul(o.value); 
        _id = $m.nul(o.id);
        _required = $m.nul(o.required);
        _style = $m.nul(o.style);
        _callFunction = $m.nul(o.callFunction);
        var _tmp = $m.nul(o.readonly);    
        if(_tmp == "true"){
            _readonly = "readonly";
        }else{
            _readonly = "";
        }
        
        var _html = '';
        _html += '<div id="'+_id+'" class="mocaInputButton '+$m.nul(o.addClass)+'" onclick="'+$m.nul(o.onclick)+'(this)" style="'+_style+'">';
        _html += '<input type="text" style="'+_innerStyle+'" class="'+_innerClass+'"  id="input_'+_id+'" autocomplete="off" value="'+_value+'" '+_readonly+'>';
        if($m.trim(_callFunction) != ''){
            _html += '<button type="button" onclick="'+_callFunction+'(this)">검색</button>';
        }
        _html += '</div>';
        return _html;
    }
};

Moca.prototype.renderMocaCombo = function(o,pageid,srcid) {
    ['renderMocaCombo'];
    var _id = '';
    var _value = '';
    var _readonly = '';
    var _required = '';
    var _style = '';
    var _callFunction = '';
    var _innerStyle = '';
    var _innerClass = '';   
    var _itemset = '';
    var _cdField = '';
    var _nmField = '';
    var _displayFormat = '';
    var _onchange = '';
    var _allOption = '';
    var _list = [];
    var _value = '';
    var _allOpt = {};
    var _width = '';
    var _innerOnchange = '';
    try{
        _value = $m.nul(o.value);
        _id = $m.nul(o.id);
        _required = $m.nul(o.required);
        _style = $m.nul(o.style);
        _callFunction = $m.nul(o.callFunction);
        _innerStyle = $m.nul(o.innerStyle);
        _innerClass = $m.nul(o.innerClass);
        _innerOnchange = $m.nul(o.inneronchange);
        
        _itemset = $m.nul(o.itemset);
        
        if($m.nul(_itemset) != ''){
            _list = JSON.parse(_itemset);
        }       
        
        _cdField = $m.nul(o.cdField);
        _nmField = $m.nul(o.nmField);
        var _tmp = $m.nul(o.readonly);
        if(_tmp == "true"){
            _readonly = "readonly";
        }else{
            _readonly = "";
        }
        _width = $m.nul(o.width);
        _displayFormat = $m.nul(o.displayFormat);
        _onchange = $m.nul(o.onchange);
        _allOption = $m.nul(o.allOption);
        if($m.nul(_allOption) != ''){
            _allOpt = JSON.parse(_allOption);
        }
        _value = $m.nul(o.value);
        var _codeOpt= o;
        if(_codeOpt == null){
            _codeOpt = {};
        }
        var _divObj = o;
        var _grdId = o.id;
        var _html = '';
        _html += '<div type="combo" id="'+_id+'" class="moca_combo" style="width:'+_width.replace(/px/g,'')+'px" pageid="'+pageid+'" srcid="'+srcid+'" cdField="'+_cdField+'" nmField="'+_nmField+'" displayFormat="'+_displayFormat+'">';
        
        
        
        var _onchange_str = "";
        if(_onchange != null){
            _onchange_str = 'onchange="'+_onchange+'(this)"';
        }
        
        if($m.trim(_innerOnchange) != ''){
            _onchange_str = 'onchange="'+_innerOnchange+'"';
        }
        _html += '<select name="sel_tree1" id="'+('sub_'+_id)+'" class="moca_select" '+_onchange_str+' >';
        
        var cdKey = _cdField;
        var nmKey = _nmField;
        if(cdKey == null){
            cdKey = "cd";
        }
        if(nmKey == null){
            nmKey = "nm";
        }       
        if(_allOpt != null){
            var _reLabel = '';
            var _value = '';
            if(_displayFormat != null && _displayFormat != 'null'){
                _reLabel = _displayFormat.replace('[value]',_allOpt.value).replace('[label]',_allOpt.label);
            }else{
                _reLabel = _allOpt.label;
            }
            _html += '<option value="'+_allOpt.value+'" selected>'+_reLabel+'</option>';
        }
        
        for(var i=0; i < _list.length; i++){
            var row = _list[i];
            var cd = row[cdKey];
            var nm = row[nmKey];
            var _checked = row.checked;
            var selectedStr = '';
            if(_checked == 'true'){
                selectedStr = 'selected';
            }
            var _reLabel = '';
            var _value = '';
            if(_displayFormat != null && _displayFormat != 'null'){
                _reLabel = _displayFormat.replace('[value]',cd).replace('[label]',nm);
            }else{
                _reLabel = nm;
            }
            if(cd == _value){
                selectedStr = 'selected';
            }
            _html += '<option value="'+cd+'" '+selectedStr+'>'+_reLabel+'</option>';
        }
        
        _html += '</select>';
        _html += '</div>';
    }catch(e){
        alert('Moca.prototype.renderMocaCombo:'+e);
    }

    return _html;
};

Moca.prototype.nul = function(_str,_tobe) {
    ['널을 빈문자로 바꾸기 '];
    var str = '';
    if(_str == null || _str=='undefined'){
        if(_tobe != null){
            str = _tobe;        
        }else{
            str =  '';
        }
    }else{
        str = _str;
    }
    return str;
};


Moca.prototype.telFormat = function(_str) {
    ['전화번호-넣기 숫자로넣으면 안됨'];
    var a = _str+'';
    a = a.replace(/-/g,'');
    if(a.length == 8){
        a = a.replace(/(^\d{4})(\d{4}$)/g,'$1-$2');
    }else if(a.startsWith("02")){
        a = a.replace(/(02)(\d+)(\d{4}$)/g,'$1-$2-$3');
    }else if(a.startsWith("+82")){
        a = a.replace(/(\+82)(\d+)(\d{4})(\d{4}$)/g,'$1-$2-$3-$4');
    }else{
        a = a.replace(/(\d{3})(\d+)(\d{4}$)/g,'$1-$2-$3');
    };
    return a;
};

Moca.prototype.cellPhone = function(x) {
    ['휴대전화11자리숫자,-2개포함총13자리'];
  x = x.replace(/[^0-9]/g,'');   // 입력값이 숫자가 아니면 공백
  x = x.replace(/-/g,'');          // -값 공백처리
  if(x.length > 10){
    var a = x.substring(0,3);
    var b = x.substring(3,7);
    var c = x.substring(7,11);
    return a+"-"+b+"-"+c;
  }else{
    return x;
  }
};

Moca.prototype.submit = function(_url,_param,_target) {
	$('.postToWin').remove();

    var form = document.createElement("form");
    form.setAttribute("class", "postToWin");
    form.setAttribute("style", "display:none");
    form.setAttribute("charset", "UTF-8");
    form.setAttribute("method", "Post");  //Post 방식
    form.setAttribute("action", _url); //요청 보낼 주소
    if(_target != null){
        form.setAttribute("target", _target); //요청 보낼 주소
    }else{
        form.setAttribute("target", "_hiddenIframe"); //요청 보낼 주소
    }
    var hiddenIframe = document.createElement("iframe");
    hiddenIframe.setAttribute("id","_hiddenIframe");
    hiddenIframe.setAttribute("class", "postToWin");
    hiddenIframe.setAttribute("style", "display:none");
    document.body.appendChild(hiddenIframe);
    var paramKeysArr = Object.keys(_param);
    for(var i=0; i < paramKeysArr.length; i++){
        var key = paramKeysArr[i];
        var val = _param[key];
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", val);
        form.appendChild(hiddenField);
    }
    
    
    
    document.body.appendChild(form);
    form.submit(); 
};

Moca.prototype.compClear =  function(thisObj){
    var pv = $(thisObj).prev();
    pv.val('');
    pv.focus();
};

Moca.prototype.getBirthDay8 =  function(__fullJumin){
    var _fullJumin = __fullJumin.replace(/-/g,'');
    var gubun = _fullJumin.charAt(6);
    if(gubun == '1' || gubun == '2'){
        return "19"+_fullJumin.substring(0,6);
    }else{
        return "20"+_fullJumin.substring(0,6);  
    }
};

Moca.prototype.setDivTag =  function(__comp,__value,_keyMask){
	$m.setValue(__comp,__value,_keyMask);
	$(__comp).parent().html(__value);
}
Moca.prototype.setValue =  function(__comp,__value,_keyMask){
    var _value;
    var _comp;
    if(__comp instanceof $){
        _comp = __comp[0];
    }else{
        _comp = __comp;
    }
    if(__comp != null && __value == null){ 
        _value = $m.trim(__comp.value);
    }else{
        _value = __value;   
    }
    if('inputCalendar' == $(_comp).attr('type') || 'inputCalendar' == $(_comp).attr('compType')){
        var v = $m.getDisplayFormat_value(_comp,_value);
        
        if(_comp != null && _comp.tagName == 'INPUT'){
            $(_comp).val(v);
        }else{
            $(_comp).find('input[type=text]').val(v);
        }
        
        var df = $(_comp).attr('displayFunction');
        
        if(df){
            var reValue='';
            try{
                reValue = eval(df)(_value);
            }catch(e){
                reValue = _value;
            }
            if(_comp.tagName == 'INPUT'){
                $(_comp).val(reValue);
            }else{
                $(_comp).find('input[type=text]').val(reValue);
            }
        }
    }else if('combo' == $(_comp).attr('type') || 'combo' == $(_comp).attr('compType')){
        var v = $m.getDisplayFormat_value(_comp,_value);
        try{
	        if($(_comp).attr('readonly')){
	        	if($m.trim(v) != '' && _comp.codeToDispLabelMap[v] != null &&_comp.codeToDispLabelMap[v].length > 0){
	        		$(_comp).attr('code',v);
	        		$(_comp).attr('label',_comp.codeToLabelMap[v]);
	        		$(_comp).find('input[type=text]').val(_comp.codeToDispLabelMap[v]);
	        	}
	        }else{
	        	$(_comp).find('select>option[value="'+_value+'"]').prop("selected",true);
	        }
        }catch(e){
            console.log(e);
        }
    }else if('searchCombo' == $(_comp).attr('type')){
        var v = _comp.codeToDispLabelMap[_value];
        try{
            $(_comp).attr('value',_value);
            $(_comp).attr('text',v);
            var ipt = $(_comp).find('.moca_input');
            ipt.val(v);
        }catch(e){
            console.log(e);
        }       
    }else if('radio' == $(_comp).attr('type') || 'radio' == $(_comp).attr('compType')){
        __value = $m.trim(__value);
        $(_comp).find('input[value='+__value+']').prop('checked', true); 
    }else if('color' == $(_comp).attr('type') || 'color' == $(_comp).attr('compType')){
    	_value = String(_value);
    	//$(_comp).find('input[type=color]').val(_value);
    	$(_comp).val(_value);
    	
    }else{
    	var df =  $(_comp).attr('displayFunction');
    	if($(_comp).prop('tagName') == 'INPUT' && $m.getDevice() == 'mobile' ){
    		var _grd = $(_comp).closest('div[type="grid"]');
    		if(_grd.length > 0){
    			var _scrollY = _grd.find('#'+_grd[0].id+'_moca_scroll_y');
        		if(!_scrollY.is(':visible')){
        			_scrollY.css('display','block')
        		}
    		}
    	}
    	if($(_comp).attr('type') == 'input'){
    		
    		_comp = $(_comp).find('input[type=text]')[0];
    	}
    	if(df =='null'){
        	df = '';
        }
        if($m.trim(df)!=''){
            var reValue='';
            try{
            	if($(_comp).parent()[0].displayChar != null){
            		_value = String(_value).replaceAll($(_comp).parent()[0].displayChar,'');
            	}else{
            		_value = String(_value);
            	}
                reValue = eval(df)(_value);
                if(reValue.length < _value.length){
                    reValue = _value;
                }
            }catch(e){
                reValue = _value;
            }
        }else{
            reValue = _value;
        }
        reValue = String(reValue);
        _value = String(_value);
        if(reValue.length != _value.length ){
        	for(var k=0; k < reValue.length; k++){
        		var aChar = reValue.charAt(k);
        		var reValue2 = reValue.replaceAll(aChar,'');
        		if(reValue2 == _value){
        			if($(_comp).parent() != null && $(_comp).parent().length > 0){
            			$(_comp).parent()[0].displayChar = aChar;
            			break;
        			}
        		}
        	}
        }
        if(_comp != null && _comp.tagName == 'INPUT'){
        	if($(_comp).parent() != null && $(_comp).parent().length > 0){
        		$(_comp).parent()[0].originalValue = $m.trim(_value);
        	}
        	$(_comp).attr('value',$m.displayKeyMask(reValue,_keyMask));
            $(_comp).val($m.displayKeyMask(reValue,_keyMask));
        }else{
            $(_comp).find('input[type=text]').val(reValue);
        }
    }
};
Moca.prototype.dateFormat =  function(_date){
    return _date.replace(/(\d{4})(\d{2})(\d{2})/g,'$1-$2-$3');
}
Moca.prototype.setFocus =  function(__comp){
    return $m.getValue(__comp,null,null,null,true);
}
Moca.prototype.getValue =  function(__comp,_id,_index,_data,_isFocus){
    var _comp;
    if(__comp == null){
        //console.log('getValue of null',_id,_index,_data);
        return;
    }
    if(__comp.find){
        _comp = __comp[0];
    }else{
        _comp = __comp;
    }
    if('inputCalendar' == $(_comp).attr('type')){
        if(_isFocus){
            return $(_comp).find('input[type=text]').focus();
        }else{
            return $(_comp).find('input[type=text]').val();
        }
        
        //var v = $m.getDisplayFormat_value(_comp,_value);
        //$(_comp).find('input[type=text]').val(v);
    }else if('combo' == $(_comp).attr('type')){
        //var v = $m.getDisplayFormat_value(_comp,_value);
        //try{
        //  $(_comp).find('select>option[value="'+_value+'"]').prop("selected",true);
        //}catch(e){
        //  console.log(e);
        //}
    	if(_isFocus){
			return $(_comp).find('select').focus();
		}else{
			var _readonly = $(_comp).attr('readonly');
			if(_readonly &&  $(_comp).find('input').length > 0){
				return $(_comp).attr('code');
			}else{
				return $(_comp).find('select').val();
			}
			
		}
    }else if('color' == $(_comp).attr('type')){
    	return $(_comp).val();
    }else{
        if(_isFocus){
            return $(_comp).find('input[type=text]').focus();
      	}else{
            if($m.trim($(_comp).find('input[type=text]').val()) != ''){
            	if($m.trim(_comp.originalValue) == ''){
            		_comp.originalValue = $m.trim($(_comp).find('input[type=text]').val());
            	}
                return _comp.originalValue;
            }else{
                return '';
            }
        }
    }
};


Moca.prototype.onRowClick = function(){
    var trIndex = $(event.srcElement).closest('table').find('tbody tr').index($(event.srcElement).closest('tr'));
    if(trIndex > -1){
        var thisObj = event.currentTarget;
        
        if(thisObj.prevRow != null){
            thisObj.prevRow.css('border-color','');
            thisObj.prevRow.css('border-style','');
            thisObj.prevRow.css('border-width','');
            thisObj.prevRow.css('color','');
        }
        if(thisObj.prevRow2 != null){
            thisObj.prevRow2.css('background-color','');
            thisObj.prevRow2.css('color','');
        }
        var nowRow = $(event.srcElement).closest('tr').find('td');
        nowRow.css('border-color','rgb(243, 169, 94)');
        nowRow.css('border-style','solid');
        nowRow.css('border-width','1px');
        //nowRow.css('color','rgb(255, 255, 255)');
        
        var nowRow2 = $(event.srcElement).closest('tr').find('th:not([rowspan])');
        nowRow2.css('background-color','rgb(243, 169, 94)');
        nowRow2.css('color','rgb(255, 255, 255)');
        
        thisObj.prevRow = nowRow;
        thisObj.prevRow2 = nowRow2;
    }

};

Moca.prototype.show = function(_id){
    $('#'+_id).css("visibility","visible");
};

Moca.prototype.setAs = function(_key,_val){
    $m.setLs(_key,_val);
    $m.setSs(_key,_val);
};
Moca.prototype.setSs = function(_key,_val){
    if($m.trim(_val) == ''){
        _val = '';
    }
    if(typeof _val == 'object'){
        try{
            _val = JSON.stringify(_val);
        }catch(e){
        }
    }else{
        _val = _val+'';
    }
    sessionStorage.setItem(_key,_val);
};
Moca.prototype.getSs = function(_key){
    var _val = sessionStorage.getItem(_key);
    var reObj;
    try{
        if(_val !=null && _val.startsWith("{")){
            reObj = JSON.parse(_val);
        }else{
            reObj = _val;
        }
        return reObj;
    }catch(e){
        reObj = _val+"";
        return reObj;
    }
};
Moca.prototype.removeSs = function(_key){
    sessionStorage.removeItem(_key);
};


Moca.prototype.setLs = function(_key,_val){
    if($m.trim(_val) == ''){
        _val = '';
    }
    if(typeof _val == 'object'){
        try{
            _val = JSON.stringify(_val);
        }catch(e){
        }
    }else{
        _val = _val+'';
    }
    localStorage.setItem(_key,_val);
};
Moca.prototype.getLs = function(_key){
    var _val = localStorage.getItem(_key);
    var reObj;
    try{
        reObj = JSON.parse(_val);
        return reObj;
    }catch(e){
        reObj = _val;
        return reObj;
    }
};
Moca.prototype.removeLs = function(_key){
    localStorage.removeItem(_key);
};
Moca.prototype.removeAs = function(_key){
    localStorage.removeItem(_key);
    sessionStorage.removeItem(_key);
};
Moca.prototype.clearAs = function(){
    localStorage.clear();
    sessionStorage.clear();
};
Moca.prototype.clearLs = function(){
    localStorage.clear();
};
Moca.prototype.clearSs = function(){
    sessionStorage.clear();
};
Moca.prototype.percent = function(_value){
    var _val = $m.trim(_value);
    if(_val != ''){
        _val = _val.replace(/%/g,'');
        _val = _val.replace(/(\d+)(\.+)(\d+$)/g,'$1___$3');
        _val = _val.replace(/\./g,'');
        _val = _val.replace(/___/g,'.');
        if(_val.endsWith('%')){
            _val = _val.replace(/%/,'');
        }
        _val = $m.trim(_val);
        if(_val != ''){
            _val = _val+'%';
        }
        return _val;
    }else{
        return _val;
    }
};
Moca.prototype.float = function(_value){
    var _val = $m.trim(_value);
    if(_val != ''){
        _val = _val.replace(/%/g,'');
        _val = _val.replace(/(\d+)(\.+)(\d+$)/g,'$1___$3');
        _val = _val.replace(/\./g,'');
        _val = _val.replace(/___/g,'.');
        _val = $m.trim(_val);
        return _val;
    }else{
        return _val;
    }
};
Moca.prototype.getHHList = function(){
    var _HH = [];
    for(var i=0; i < 25; i++){
        var v = comLib.gfn_toTwoChar(i);
        var obj = {cd:v,nm:v+'시'};
        _HH.push(obj);
    }
    return _HH;
};
Moca.prototype.getMMList = function(){
    var _MM = [];
    for(var i=0; i < 60; i++){
        var v = comLib.gfn_toTwoChar(i);
        var obj = {cd:v,nm:v+'분'};
        _MM.push(obj);
    }
    return _MM;
};

Moca.prototype.getSelectedTabIndex = function(_obj){
    return Number($(_obj).find('li.active').attr('index'))-1;
};

Moca.prototype.getSelectedTabId = function(_obj){
    return $(_obj).find('li.active').attr('id');
};

Moca.prototype.getTimeDiff = function(nowDateTimeLong,startDateTimeLong){
    datetime1 = new Date(nowDateTimeLong);
    datetime2 = new Date(startDateTimeLong);
    var one_day = 1000*60;
    var defDate = (datetime1.getTime()-datetime2.getTime()) / one_day;
    return defDate;
};
    
Moca.prototype.getParameter = function(_key){
    var paramStr = location.search.replace(/\?/g,'');
    var arr = paramStr.split('&');
    var obj = {};
    for(var i=0; i < arr.length; i++){
        var keyAndVal = arr[i];
        var arr2 = keyAndVal.split('=');
        if(arr2 != null && arr2.length == 2){
            obj[$m.trim(arr2[0])] = $m.trim(arr2[1]);
        }
    }
    return obj[_key];
};

Moca.prototype.getTimeoutLeftTime = function(startDateTimeLong,_MaxHour){
    var deadLine = parseFloat(startDateTimeLong) + parseFloat(_MaxHour)*60*60*1000;
    var nowTimeLine = (new Date()).getTime();
    var leftTime = deadLine-nowTimeLine; 
    if(leftTime < 1){
        return "TIMEOUT";
    }else{
        var day = parseInt(leftTime/(24*60*60*1000));
        var day_left = leftTime%(24*60*60*1000);
        var hour = parseInt(day_left/(60*60*1000));
        var hour_left = day_left%(60*60*1000);
        var min = parseInt(hour_left/(60*1000));
        var min_left = hour_left%(60*1000); 
        var sec = parseInt(min_left/(1000));
        var sec_left = min_left%(1000);     
        return comLib.gfn_toTwoChar(hour)+"시간"+comLib.gfn_toTwoChar(min)+"분"+comLib.gfn_toTwoChar(sec)+"초";
    }
};

Moca.prototype.displayKeyMask = function(_value,_keyMask){
    if(_keyMask != null && _keyMask.indexOf('onlyNumber') > -1){
        return _value.replace(/-/g,'');
    }else{
        return _value;
    }
};



//addEvent="enterSearchEvt|onlyMoneyEvt"
Moca.prototype.keydown = function(_comp,_value,_keyMask){
    var keyMask = $m.trim(_keyMask);
    if(event.key == 'Enter'){
    	$m.setValue(_comp,_value);
        if(keyMask.indexOf('enterSearch') > -1){
            $m.default_keyup(event.srcElement);
        }else{
            _comp.blur();
            if($(_comp).closest('td').next().length > 0){
                $(_comp).closest('td').next().find('input').focus().select();
            }else{
                $(_comp).closest('tr').next().find('td:nth(0) input').focus().select();
            }
        }
    }else{
        //자연수
        if(keyMask.indexOf('onlyNumber') > -1){
            if($m.isBasisKey(event.keyCode)){
                return true;
            }else if(event.keyCode == 188){ 
                //(,)쉼표차단
                event.preventDefault();return false;
            }else if(event.shiftKey && event.keyCode > 47 && event.keyCode < 58){   
                //특수문자차단
                event.preventDefault();return false;    
            }else if(event.keyCode > 47 && event.keyCode < 58){
                //숫자 허용
                return true;
            }else if(event.keyCode > 95 && event.keyCode < 106){
                //키패드숫자 허용
                return true;        
            }else if(event.keyCode == 109 || event.keyCode == 189){ 
                //마이너스(-) 차단
                event.preventDefault();return false;    
            }else if(event.keyCode == 110 || event.keyCode == 190){ 
                //.(쩜) 차단
                event.preventDefault();return false;    
            }else if(event.keyCode > 64 && event.keyCode < 91){
                //소문자 차단
                event.preventDefault();return false;
            }else if(event.keyCode == 229){
                //한글 차단
                event.preventDefault(); 
                var o = event.srcElement;
                setTimeout(function(){
                    o.value = o.value.replace(/[\ㄱ-ㅎ ㅏ-ㅣ 가-힣]/g,'');
                },1);
                return false;
            }else{
                console.log('onlyNumber 기타차단됨--->',event.keyCode);
                //기타 차단
                event.preventDefault(); 
                //특수문자차단추가수행
                /*
                var o = event.srcElement;
                setTimeout(function(){
                    var replaceChar = /[~!@\#$%^&*\()\-=+_'\;<>\/.\`:\"\\,\[\]?|{}]/gi;
                    var replaceNotFullKorean = /[ㄱ-ㅎㅏ-ㅣ]/gi;
                    o.value = o.value.replace(replaceChar,'');
                    o.value = o.value.replace(replaceNotFullKorean,'');
                },1);   
                */          
                return false;
            }
        }else if(keyMask.indexOf('onlyMoney') > -1){
            if($m.isBasisKey(event.keyCode)){
                //편집을 위한 기본적인 허용키
                return true;
            }else if(event.keyCode == 188){ 
                //(,)쉼표허용
                return true;
            }else if(event.shiftKey && event.keyCode > 47 && event.keyCode < 58){   
                //특수문자차단
                event.preventDefault();
                return false;
            }else if(event.keyCode == 109 || event.keyCode == 189){ 
                //마이너스(-) 허용
                return true;
            }else if(event.keyCode > 47 && event.keyCode < 58){
                //숫자 허용
                return true;
            }else if(event.keyCode > 95 && event.keyCode < 106){
                //키패드숫자 허용
                return true;                
            }else if(event.keyCode > 64 && event.keyCode < 91){
                //소문자 차단
                event.preventDefault();
                return false;
            }else if(event.keyCode == 229){
                //한글 차단
                event.preventDefault(); 
                var o = event.srcElement;
                setTimeout(function(){
                    o.value = o.value.replace(/[\ㄱ-ㅎ ㅏ-ㅣ 가-힣]/g,'');
                },1);
                return false;
            }else{
                console.log('onlyMoney 기타차단됨--->',event.keyCode);
                //기타 차단
                event.preventDefault(); 
                //특수문자차단추가수행
                var o = event.srcElement;
                setTimeout(function(){
                    var replaceChar = /[~!@\#$%^&*\()\-=+_'\;<>\/.\`:\"\\,\[\]?|{}]/gi;
                    var replaceNotFullKorean = /[ㄱ-ㅎㅏ-ㅣ]/gi;
                    o.value = o.value.replace(replaceChar,'');
                    o.value = o.value.replace(replaceNotFullKorean,'');
                },1);
                return false;
            }
        }else if(keyMask.indexOf('onlyPhone') > -1){
            if($m.isBasisKey(event.keyCode)){
                //편집을 위한 기본적인 허용키
                return true;
            }else if(event.keyCode == 188){ 
                //(,)쉼표차단
                event.preventDefault();
                return false;
            }else if(event.shiftKey && event.keyCode > 47 && event.keyCode < 58){   
                //특수문자차단
                event.preventDefault();
                return false;
            }else if(event.keyCode == 109 || event.keyCode == 189){ 
                //마이너스(-) 허용
                return true;
            }else if(event.keyCode > 47 && event.keyCode < 58){
                //숫자 허용
                return true;
            }else if(event.keyCode > 95 && event.keyCode < 106){
                //키패드숫자 허용
                return true;                
            }else if(event.keyCode > 64 && event.keyCode < 91){
                //소문자 차단
                event.preventDefault();
                return false;
            }else if(event.keyCode == 229){
                //한글 차단
                event.preventDefault(); 
                var o = event.srcElement;
                setTimeout(function(){
                    o.value = o.value.replace(/[\ㄱ-ㅎ ㅏ-ㅣ 가-힣]/g,'');
                },1);
                return false;
            }else{
                console.log('onlyPhone 기타차단됨--->',event.keyCode);
                //기타 차단
                event.preventDefault(); 
                //특수문자차단추가수행
                var o = event.srcElement;
                setTimeout(function(){
                    var replaceChar = /[~!@\#$%^&*\()\-=+_'\;<>\/.\`:\"\\,\[\]?|{}]/gi;
                    var replaceNotFullKorean = /[ㄱ-ㅎㅏ-ㅣ]/gi;
                    o.value = o.value.replace(replaceChar,'');
                    o.value = o.value.replace(replaceNotFullKorean,'');
                },1);
                return false;
            }
        }else if(keyMask.indexOf('onlyFloat') > -1){
            if($m.isBasisKey(event.keyCode)){
                //편집을 위한 기본적인 허용키
                return true;
            }else if(event.keyCode == 188){ 
                //(,)쉼표차단
                event.preventDefault();
                return false;
            }else if(event.shiftKey && event.keyCode > 47 && event.keyCode < 58){   
                //특수문자차단
                event.preventDefault();
                return false;
            }else if(event.keyCode == 109 || event.keyCode == 189){ 
                //마이너스(-) 차단
                event.preventDefault();
                return false;
            }else if(event.keyCode == 110 || event.keyCode == 190){ 
                //.(쩜) 허용
                return true;
            }else if(event.keyCode > 47 && event.keyCode < 58){
                //숫자 허용
                return true;
            }else if(event.keyCode > 95 && event.keyCode < 106){
                //키패드숫자 허용
                return true;                
            }else if(event.keyCode > 64 && event.keyCode < 91){
                //소문자 차단
                event.preventDefault();
                return false;
            }else if(event.keyCode == 229){
                //한글 차단
                event.preventDefault(); 
                var o = event.srcElement;
                setTimeout(function(){
                    o.value = o.value.replace(/[\ㄱ-ㅎ ㅏ-ㅣ 가-힣]/g,'');
                },1);
                return false;
            }else{
                console.log('onlyFloat 기타차단됨--->',event.keyCode);
                //기타 차단
                event.preventDefault(); 
                //특수문자차단추가수행
                /*
                var o = event.srcElement;
                setTimeout(function(){
                    var replaceChar = /[~!@\#$%^&*\()\-=+_'\;<>\/.\`:\"\\,\[\]?|{}]/gi;
                    var replaceNotFullKorean = /[ㄱ-ㅎㅏ-ㅣ]/gi;
                    o.value = o.value.replace(replaceChar,'');
                    o.value = o.value.replace(replaceNotFullKorean,'');
                },1);
                */
                return false;
            }
        }else if(keyMask.indexOf('onlyPercent') > -1){
            console.log(event.keyCode);
            if($m.isBasisKey(event.keyCode)){
                //편집을 위한 기본적인 허용키
                return true;
            }else if(event.keyCode == 188){ 
                //(,)쉼표차단
                event.preventDefault();
                return false;
            }else if(event.shiftKey && event.keyCode == 53){    
                //% 허용
                return true;
            }else if(event.shiftKey && event.keyCode > 47 && event.keyCode < 58){   
                //특수문자차단
                event.preventDefault();
                return false;
            }else if(event.keyCode == 109 || event.keyCode == 189){ 
                //마이너스(-) 허용
                return true;
            }else if(event.keyCode == 110 || event.keyCode == 190){ 
                //.(쩜) 허용
                return true;
            }else if(event.keyCode > 47 && event.keyCode < 58){
                //숫자 허용
                return true;
            }else if(event.keyCode > 95 && event.keyCode < 106){
                //키패드숫자 허용
                return true;                
            }else if(event.keyCode > 64 && event.keyCode < 91){
                //소문자 차단
                event.preventDefault();
                return false;
            }else if(event.keyCode == 229){
                //한글 차단
                event.preventDefault(); 
                var o = event.srcElement;
                setTimeout(function(){
                    o.value = o.value.replace(/[\ㄱ-ㅎ ㅏ-ㅣ 가-힣]/g,'');
                },1);
                return false;
            }else{
                console.log('onlyPercent 기타차단됨--->',event.keyCode);
                //기타 차단
                event.preventDefault(); 
                //특수문자차단추가수행
                /*
                var o = event.srcElement;
                setTimeout(function(){
                    var replaceChar = /[~!@\#$%^&*\()\-=+_'\;<>\/.\`:\"\\,\[\]?|{}]/gi;
                    var replaceNotFullKorean = /[ㄱ-ㅎㅏ-ㅣ]/gi;
                    o.value = o.value.replace(replaceChar,'');
                    o.value = o.value.replace(replaceNotFullKorean,'');
                },1);
                */
                return false;
            }
        }
    }
};


Moca.prototype.isBasisKey = function(_kc){
    if(_kc == 18 || _kc == 8){
        //<-  허용
    }else if(_kc == 37 || _kc == 39){
        //<  > 허용
    }else if(_kc == 16){
        //shift 허용
    }else if(_kc == 17){
        //ctrl 허용
    }else if(_kc == 46){
        //delete 허용
    }else if(_kc == 46){
        //delete 허용 
    }else if(_kc == 36){
        //home 허용
    }else if(_kc == 35){
        //end 허용
    }else if(_kc == 9){
        //tab허용 
    }else if(event.ctrlKey && (event.keyCode == 67 || event.keyCode == 86 || event.keyCode == 65)){
        //ctrl+ C,V,A 허용
    }else{
        return false;
    }
    return true;
};

Moca.prototype.openAddrPopup = function(_thisObj,_callback,_closeCallback,_type){
    if(daum != null){
        var element_wrap = document.getElementById("wrap");
        // wrap 레이어가 off된 상태라면 다음 우편번호 레이어를 open 한다.
        if(jQuery("#wrap").css("display") == "none") {
            new daum.Postcode({
                oncomplete:function(data) {
                	 console.log(data);
                    if(_type != 'POP'){
                    	 _callback(_thisObj,data);
                    	offDaumZipAddress();
                    }else{
                    	_popupId = $(_thisObj.parent).attr('tab_id');
                    	$m.popClose(_popupId,data);
                    }
                }
                , shorthand : false
                // 사용자가 값을 주소를 선택해서 레이어를 닫을 경우
                // 다음 주소록 레이어를 완전히 종료 시킨다.
                , onclose:function(state) {
                    if(state === "COMPLETE_CLOSE") {
                            _closeCallback();
                        // 콜백함수를 실행하여 슬라이드 업 기능이 실행 완료후 작업을 진행한다.
                        //offDaumZipAddress(function() {
                            if(_type != 'POP'){
	                           	 element_wrap.style.display = "none";
	                       	}
                        //});
                    }
                }
                , onresize: function(size) {
                    //alert(JSON.stringify(size));
                    //
                        //size는 우편번호 찾기 화면의 크기 데이터 객체이며, 상세 설명은 아래 목록에서 확인하실 수 있습니다.
                }
            }).embed(element_wrap);
            if(_type != 'POP'){
            	// 슬라이드 다운 기능을 이용해 레이어 창을 오픈한다.
                jQuery("#wrap").slideDown();
        	}else{
        		jQuery("#wrap").show();
        	}
        } else {
            
            if(_type != 'POP'){
            	// 콜백함수를 실행하여 슬라이드 업 기능이 실행 완료후 작업을 진행한다.
            	offDaumZipAddress(function() {
                    element_wrap.style.display = "none";
                    return false;
                });
            }else{
            	
            }
        }
        setTimeout(function(){
            try{
                if(window.BRIDGE != null){
                    BRIDGE.showKeyPad();
                }
            }catch(e){
            }
        },100);
    }
};
Moca.prototype.mbl_showKeyPad = function(){
    try{
        if(window.BRIDGE != null){
            BRIDGE.showKeyPad();
        }
    }catch(e){};
};

Moca.prototype.setCheckByNameIndex = function(){
    if(arguments.length == 3){
        $($("[name='"+arguments[0]+"']")[arguments[1]]).prop('checked',arguments[2]);
    }else{
        alert('setCheckByNameIndex:(name,index,trueFalse) 형식으로 호출하세요');
    }
};
Moca.prototype.setCheckByNameValue = function(){
    if(arguments.length == 3){
        $("[name='"+arguments[0]+"'][value="+arguments[1]+"]").prop('checked',arguments[2]);
    }else{
        alert('setCheckByNameValue:(name,value,trueFalse) 형식으로 호출하세요');
    }
};
Moca.prototype.setCheckById = function(){
    if(arguments.length == 2){
        $("[id='"+arguments[0]+"']").prop('checked',arguments[1]);
    }else{
        alert('setCheckByNameIndex:(id,trueFalse) 형식으로 호출하세요');
    }
};
Moca.prototype.setCheckByClass = function(){
    if(arguments.length == 2){
        $("."+arguments[0]).prop('checked',arguments[1]);
    }else{
        alert('setCheckByClass:(className,trueFalse) 형식으로 호출하세요');
    }
};
Moca.prototype.setValueById = function(){
    if(arguments.length == 2){
        $("[id='"+arguments[0]+"']").val(arguments[1]);
    }else{
        alert('setValueById:(id,value) 형식으로 호출하세요');
    }
};
Moca.prototype.isCheckedByObj = function(){
    if(arguments.length == 1){
        if(arguments[0].tagName == 'LABEL'){
            return $($(arguments[0]).parent().children()[0]).is(':checked');
        }else{
            return $(arguments[0]).is(':checked');
        }
    }else{
        alert('isCheckedByObj:(obj) 형식으로 호출하세요');
    }
};
Moca.prototype.isCheckedById = function(){
    if(arguments.length == 1){
        return $("[id='"+arguments[0]+"']").is(':checked');
    }else{
        alert('isCheckedById:(id) 형식으로 호출하세요');
    }
};
Moca.prototype.getValueById = function(){
    if(arguments.length == 1){
        return $("[id='"+arguments[0]+"']").val();
    }else{
        alert('getValueById:(id) 형식으로 호출하세요');
    }
};
Moca.prototype.getValueByCheckedName = function(){
    if(arguments.length == 1){
        return $("[name='"+arguments[0]+"']:checked").val();
    }else{
        alert('getValueByCheckedName:(id) 형식으로 호출하세요');
    }
};
Moca.prototype.isAllCheckedByClass = function(){
    if(arguments.length == 1){
        return ($("."+arguments[0]+":checked").length == $("."+arguments[0]).length);
    }else{
        alert('isAllCheckedByClass:(className) 형식으로 호출하세요');
    }
};
Moca.prototype.setHistory = function(_pageKey,_obj){
    $m.setLs(_pageKey,_obj);
    if(_pageKey == 'TOM_40'){
        $m.removeAs('TOM_42');$m.removeAs('TOM_47');$m.removeAs('TOM_52');$m.removeAs('TOM_61');$m.removeAs('TOM_63');$m.removeAs('TOM_64');$m.removeAs('TOM_67');
        $m.removeAs('TOM_63');$m.removeAs('TOM_64');$m.removeAs('TOM_67');$m.removeAs('TOM_69');$m.removeAs('TOM_75');$m.removeAs('TOM_80');
        $m.removeAs('TOM_81');$m.removeAs('TOM_82');$m.removeAs('TOM_83');
    }else if(_pageKey == 'TOM_42'){
        $m.removeAs('TOM_47');$m.removeAs('TOM_52');$m.removeAs('TOM_61');$m.removeAs('TOM_63');$m.removeAs('TOM_64');$m.removeAs('TOM_67');
        $m.removeAs('TOM_63');$m.removeAs('TOM_64');$m.removeAs('TOM_67');$m.removeAs('TOM_69');$m.removeAs('TOM_75');$m.removeAs('TOM_80');
        $m.removeAs('TOM_81');$m.removeAs('TOM_82');$m.removeAs('TOM_83');
    }else if(_pageKey == 'TOM_47'){
        $m.removeAs('TOM_52');$m.removeAs('TOM_61');$m.removeAs('TOM_63');$m.removeAs('TOM_64');$m.removeAs('TOM_67');
        $m.removeAs('TOM_63');$m.removeAs('TOM_64');$m.removeAs('TOM_67');$m.removeAs('TOM_69');$m.removeAs('TOM_75');$m.removeAs('TOM_80');
        $m.removeAs('TOM_81');$m.removeAs('TOM_82');$m.removeAs('TOM_83');
    }else if(_pageKey == 'TOM_52'){
        $m.removeAs('TOM_61');$m.removeAs('TOM_63');$m.removeAs('TOM_64');$m.removeAs('TOM_67');
        $m.removeAs('TOM_63');$m.removeAs('TOM_64');$m.removeAs('TOM_67');$m.removeAs('TOM_69');$m.removeAs('TOM_75');$m.removeAs('TOM_80');
        $m.removeAs('TOM_81');$m.removeAs('TOM_82');$m.removeAs('TOM_83');
    }else if(_pageKey == 'TOM_61'){//이전비계산
        $m.removeAs('TOM_63');$m.removeAs('TOM_64');$m.removeAs('TOM_67');$m.removeAs('TOM_69');$m.removeAs('TOM_75');$m.removeAs('TOM_80');
                                                                    }else if(_pageKey == 'TOM_63'){//계좌등록등록계좌없어등록안내
                                                                        $m.removeAs('TOM_64');$m.removeAs('TOM_67');$m.removeAs('TOM_69');$m.removeAs('TOM_75');$m.removeAs('TOM_80');
                                                                    }else if(_pageKey == 'TOM_64'){//계좌등록결제비밀번호설정
                                                                        $m.removeAs('TOM_67');$m.removeAs('TOM_69');$m.removeAs('TOM_75');$m.removeAs('TOM_80');
                                                                        $m.removeAs('TOM_81');$m.removeAs('TOM_82');$m.removeAs('TOM_83');
                                                                    }else if(_pageKey == 'TOM_67'){//계좌등록은행선택
                                                                        $m.removeAs('TOM_69');$m.removeAs('TOM_75');$m.removeAs('TOM_80');
                                                                        $m.removeAs('TOM_81');$m.removeAs('TOM_82');$m.removeAs('TOM_83');
                                                                    }else if(_pageKey == 'TOM_69'){//계좌등록정보입력
                                                                        $m.removeAs('TOM_75');$m.removeAs('TOM_80');
                                                                        $m.removeAs('TOM_81');$m.removeAs('TOM_82');$m.removeAs('TOM_83');
                                                                    }else if(_pageKey == 'TOM_75'){//계좌등록본인인증
                                                                        $m.removeAs('TOM_80');
                                                                        $m.removeAs('TOM_81');$m.removeAs('TOM_82');$m.removeAs('TOM_83');
                                                                    }else if(_pageKey == 'TOM_80'){//계좌등록전화인증

    }else if(_pageKey == 'TOM_81'){//결제계좌선택
        $m.removeAs('TOM_63');$m.removeAs('TOM_64');$m.removeAs('TOM_67');$m.removeAs('TOM_69');$m.removeAs('TOM_75');$m.removeAs('TOM_80');
        $m.removeAs('TOM_82');$m.removeAs('TOM_83');
    }else if(_pageKey == 'TOM_82'){//결제금액확인
        $m.removeAs('TOM_63');$m.removeAs('TOM_64');$m.removeAs('TOM_67');$m.removeAs('TOM_69');$m.removeAs('TOM_75');$m.removeAs('TOM_80');
        $m.removeAs('TOM_83');
    }else if(_pageKey == 'TOM_83'){//결제비밀번호입력
        $m.removeAs('TOM_63');$m.removeAs('TOM_64');$m.removeAs('TOM_67');$m.removeAs('TOM_69');$m.removeAs('TOM_75');$m.removeAs('TOM_80');
    }
};

Moca.prototype.getStep = function(){
    var obj = {moveStep:"",moveTitle:""};
    
    var TOM_40 = $m.getLs('TOM_40');//////////////////////////////////////////////////////////////40
    if(TOM_40 != null) {
        obj.moveStep = 'TOM_40.html';
        obj.moveTitle = TOM_40.title;
        var carDetailInfo = $m.getLs("carDetailInfo");
        $m.setSs("carDetailInfo",carDetailInfo);
        $m.setSs("coocon_data_REGNO1",$m.getLs("coocon_data_REGNO1"));
        $m.setSs("coocon_data_REGNO2",$m.getLs("coocon_data_REGNO2"));
        $m.setSs("coocon_data",$m.getLs("coocon_data"));
        $m.setSs("coocon_data_LAST_OWNER",$m.getLs("coocon_data_LAST_OWNER"));
    }else{
        return obj;
    }
    
    var TOM_42 = $m.getLs('TOM_42');//////////////////////////////////////////////////////////////42
    if(TOM_42 != null) {
        obj.moveStep = 'TOM_42.html';
        obj.moveTitle = TOM_42.title;
        var won = $m.getLs("won");
        $m.setSs("won",won);
    }else{
        return obj;
    }
    
    var TOM_47 = $m.getLs('TOM_47');//////////////////////////////////////////////////////////////47
    if(TOM_47 != null) {
        obj.moveStep = 'TOM_47.html';
        obj.moveTitle = TOM_47.title;
        var ysInfo = $m.getLs("ysInfo");
        $m.setSs("ysInfo",ysInfo);
    }else{
        return obj;
    }
    
    var TOM_52 = $m.getLs('TOM_52');//////////////////////////////////////////////////////////////52
    if(TOM_52 != null) {
        obj.moveStep = 'TOM_52.html';
        obj.moveTitle = TOM_52.title;
        var tx_id_ys = $m.getLs("response.data.tx_id_ys");
        var tx_id_yd = $m.getLs("response.data.tx_id_yd");
        var certStartTime = $m.getLs("certStartTime");
        var transferownerId = $m.getLs("transferownerId");
        var verify_ys_done = $m.getLs("verify_ys_done");
        var verify_yd_done = $m.getLs("verify_yd_done");
        
        $m.setSs("response.data.tx_id_ys",tx_id_ys);
        $m.setSs("response.data.tx_id_yd",tx_id_yd);
        $m.setSs("certStartTime",certStartTime);
        $m.setSs("transferownerId",transferownerId);
        if(verify_ys_done != null) $m.setSs("verify_ys_done",verify_ys_done);
        if(verify_yd_done != null) $m.setSs("verify_yd_done",verify_yd_done);
    }else{
        return obj;
    }   
    
    var TOM_61 = $m.getLs('TOM_61');//////////////////////////////////////////////////////////////61
    if(TOM_61 != null) {
        obj.moveStep = 'TOM_61.html';
        obj.moveTitle = TOM_61.title;
        var total_TransferOwner_Price = $m.getLs("total_TransferOwner_Price");
        if(total_TransferOwner_Price != null) $m.setSs("total_TransferOwner_Price",total_TransferOwner_Price);
    }else{
        return obj;
    }   
                                            
                                            var TOM_81 = $m.getLs('TOM_81');//////////////////////////////////////////////////////////////81
                                            var TOM_67 = $m.getLs('TOM_67');//////////////////////////////////////////////////////////////67
                                            
                                            
                                            if(TOM_81 != null && TOM_67 == null) {
                                                obj.moveStep = 'TOM_81.html';
                                                obj.moveTitle = TOM_81.title;
                                                var total_TransferOwner_Price = $m.getLs("total_TransferOwner_Price");
                                                if(total_TransferOwner_Price != null) $m.setSs("total_TransferOwner_Price",total_TransferOwner_Price);
                                            }else if(TOM_67 != null) {
                                                obj.moveStep = 'TOM_67.html';
                                                obj.moveTitle = TOM_67.title;
                                                var Pay_Password_Re = $m.getLs('Pay_Password_Re');
                                                if(Pay_Password_Re != null) $m.setSs("Pay_Password_Re",Pay_Password_Re);
                                                
                                                
                                                var TOM_69 = $m.getLs('TOM_69');//////////////////////////////////////////////////////////////69
                                                if(TOM_69 != null) {
                                                    obj.moveStep = 'TOM_69.html';
                                                    obj.moveTitle = TOM_69.title;
                                                    
                                                    var BankNm = $m.getLs('BankNm');
                                                    if(BankNm != null) $m.setSs("BankNm",BankNm);
                                                    var BankCd = $m.getLs('BankCd');
                                                    if(BankCd != null) $m.setSs("BankCd",BankCd);                                         
                                                }else{
                                                    return obj;
                                                }
                                                var TOM_75 = $m.getLs('TOM_75');//////////////////////////////////////////////////////////////75본인인증
                                                if(TOM_75 != null) {
                                                    obj.moveStep = 'TOM_75.html';
                                                    obj.moveTitle = TOM_75.title;
                                                    
                                                    var acct_no = $m.getLs('acct_no');
                                                    if(acct_no != null) $m.setSs("acct_no",acct_no);
                                                    var bankOwner = $m.getLs('bankOwner');
                                                    if(bankOwner != null) $m.setSs("bankOwner",bankOwner);                                            
                                                }else{
                                                    return obj;
                                                }
                                                var TOM_80 = $m.getLs('TOM_80');//////////////////////////////////////////////////////////////80,전화인증
                                                if(TOM_80 != null) {
                                                    obj.moveStep = 'TOM_80.html';
                                                    obj.moveTitle = TOM_80.title;
                                                    
                                                    var userPayInfo = $m.getLs('userPayInfo');
                                                    if(userPayInfo != null) $m.setSs("userPayInfo",userPayInfo);
                                                    var verifyResMap = $m.getLs('verifyResMap');
                                                    if(verifyResMap != null) $m.setSs("verifyResMap",verifyResMap);
                                                    var arsResmap = $m.getLs('arsResmap');
                                                    if(arsResmap != null) $m.setSs("arsResmap",arsResmap);
                                                    
                                                }else{
                                                    return obj;
                                                }
                                                
                                            }else{
                                                return obj;
                                            }
                                            
    

    
    var TOM_81 = $m.getLs('TOM_81');//////////////////////////////////////////////////////////////81
    if(TOM_81 != null) {
        obj.moveStep = 'TOM_81.html';
        obj.moveTitle = TOM_81.title;
        var total_TransferOwner_Price = $m.getLs("total_TransferOwner_Price");
        if(total_TransferOwner_Price != null) $m.setSs("total_TransferOwner_Price",total_TransferOwner_Price);
    }else{
        return obj;
    }   
    
    var TOM_82 = $m.getLs('TOM_82');//////////////////////////////////////////////////////////////82
    if(TOM_82 != null) {
        obj.moveStep = 'TOM_82.html';
        obj.moveTitle = TOM_82.title;
        var userPayInfo = $m.getLs("userPayInfo");
        if(userPayInfo != null) $m.setSs("userPayInfo",userPayInfo);
        var TOM_81 = $m.getLs("TOM_81");
        if(TOM_81 != null) $m.setSs("TOM_81",TOM_81);     
    }else{
        return obj;
    }   
    
    var TOM_83 = $m.getLs('TOM_83');//////////////////////////////////////////////////////////////83
    if(TOM_83 != null) {
        obj.moveStep = 'TOM_83.html';
        obj.moveTitle = TOM_83.title;
        
        var requestPay = $m.getLs("requestPay");
        if(requestPay != null) $m.setSs("requestPay",requestPay);
        var transferComDate = $m.getLs("transferComDate");
        if(transferComDate != null) $m.setSs("transferComDate",transferComDate);
    }else{
        return obj;
    }   
    

                                        
    return obj;
};


function offDaumZipAddress() {
    // 슬라이드 업 기능을 이용해 레이어 창을 닫는다.
    jQuery("#wrap").slideUp();
 
}

Moca.prototype.priceConvertKorean = function(num){
    num = (num+'').replace(/,/g,'');
    var x = new Array("","일","이","삼","사","오","육","칠","팔","구","십"); 
    var y = new Array("","십","백","천","","십","백","천","","십","백","천","","십","백","천"); 
    var han = ""; 
    var str = ""; 
    var result = ""; 
 
    for(i=0; i<num.length; i++) {                
        str = ""; 
        han = x[num.charAt(num.length-(i+1))]; 
        if(han != "") str += han+y[i]; 
        if(i == 4) str += "만"; 
        if(i == 8) str += "억"; 
        if(i == 12) str += "조";
        if(i == 16) str += "경"; 
        
        result = str + result; 
    }
 
    if(num != 0) result = result + "원";
    return result; 
};

//onkeyup="$m.phoneWithDash(this)" onblur="$m.phoneWithDash(this)" maxLength="13"
Moca.prototype.phoneWithDash = function(_this){
  var x = _this.value;
  x = x.replace(/[^0-9]/g,'');   // 입력값이 숫자가 아니면 공백
  x = x.replace(/-/g,'');          // -값 공백처리
  if(x.length > 10){
      var a = x.substring(0,3);
      var b =x.substring(3,7);
      var c =x.substring(7,11);
      $(_this).val(a+"-"+b+"-"+c);  
  }
};



Moca.prototype.phoneWithDashFormatter = function(x){
    if(x == null){
        return "";
    }
    x = x.replace(/[^0-9]/g,'');   // 입력값이 숫자가 아니면 공백
    x = x.replace(/-/g,'');          // -값 공백처리
    if(x.length > 10){
        var a = x.substring(0,3);
        var b =x.substring(3,7);
        var c =x.substring(7,11);
        return a+"-"+b+"-"+c;
    }else{
        return x;
    }
};  


/**
 * 좌측문자열채우기
 * @params
 *  - padLen : 최대 채우고자 하는 길이
 *  - padStr : 채우고자하는 문자(char)
 */
Moca.prototype.lpad = function(_this,padLen, padStr) {
    var str = _this+'';
    if (padStr.length > padLen) {
        console.log("오류 : 채우고자 하는 문자열이 요청 길이보다 큽니다");
        return str + "";
    }
    while (str.length < padLen)
        str = padStr + str;
    str = str.length >= padLen ? str.substring(0, padLen) : str;
    return str;
};

/**
 * 우측문자열채우기
 * @params
 *  - padLen : 최대 채우고자 하는 길이
 *  - padStr : 채우고자하는 문자(char)
 */
Moca.prototype.rpad = function(_this,padLen, padStr) {
    var str = _this+'';
    if (padStr.length > padLen) {
        console.log("오류 : 채우고자 하는 문자열이 요청 길이보다 큽니다");
        return str + "";
    }
    while (str.length < padLen)
        str += padStr;
    str = str.length >= padLen ? str.substring(0, padLen) : str;
    return str;
};

Moca.prototype.setReadOnly = function(_mocaInputObj,_trueFalse){
    if($(_mocaInputObj).attr('type') == 'searchCombo'){
        $(_mocaInputObj).attr('readOnly',_trueFalse);
        $m.renderSearchCombo(_mocaInputObj,null,'normal',_mocaInputObj.getAttribute("pageid"),_mocaInputObj.getAttribute("srcId"));
        $m.setValue(_mocaInputObj,$(_mocaInputObj).attr("value"));
    }else if($(_mocaInputObj).attr('type') == 'combo'){
        $(_mocaInputObj).attr('readOnly',_trueFalse);
        $m.renderCombo(_mocaInputObj,null,'normal',_mocaInputObj.getAttribute("pageid"),_mocaInputObj.getAttribute("srcId"));
        $m.setValue(_mocaInputObj,$(_mocaInputObj).attr("value"));
    }else if($(_mocaInputObj).attr('type') == 'radio' || $(_mocaInputObj).hasClass('moca_radio')){
        $(_mocaInputObj).attr('readOnly',_trueFalse);
        var _radioObj = $(_mocaInputObj).find('input[type=radio]');
        for(var i=0; i<_radioObj.length; i++){
        	$(_mocaInputObj).find('input[type=radio]')[i].setAttribute("disabled",true);
        }
        
    }else{
        var _mocaObj ;
        if($(_mocaInputObj).attr('type') == 'input' || $(_mocaInputObj).attr('celltype') == 'input' ){
            _mocaObj = $(_mocaInputObj).find('input')[0];
        }else{
            _mocaObj = _mocaInputObj;
        }
        if(_trueFalse){
            _mocaInputObj.setAttribute("readonly",true);
            _mocaObj.setAttribute("readonly",true);
        }else{
        	
            _mocaInputObj.removeAttribute("readonly");
            if(_mocaObj != null) _mocaObj.removeAttribute("readonly");
        }
    }
};


Moca.prototype.show = function(_mocaInputObj){
   $(_mocaInputObj).show();
};


Moca.prototype.hide = function(_mocaInputObj){
    $(_mocaInputObj).hide();
};


Moca.prototype.getCheckedData = function(_grd,_colId){
    var trueVal = _grd.cellInfo[_colId].getAttribute("truevalue");
    var reArray = [];
    for(var i=0; i < _grd.list.length; i++){
        if($($(_grd).find('td[id='+_colId+']')[i]).find('input').is(':disabled') == false){
            var row = _grd.list[i];
            var v = row[_colId];
            if(trueVal == v){
                reArray.push(row);
            }
        }
    }
    return reArray;
};

Moca.prototype.cellAllCheck = function(_thisObj){
   event.preventDefault();
   var tdId = $(this).attr("targetid");
   var isChecked = $(this).find('input').is(':checked');  
   if(isChecked){
       $(this).find('input').prop("checked",false);
       var grd = this.closest('div[type=grid]');
       var _list = grd.list;
       for(var i=0; i < _list.length; i++){
           var row = _list[i];
           row._system.status ='';
           row[tdId] = $(grd.cellInfo[tdId]).attr("falsevalue");
       }
   }else{
       $(this).find('input').prop("checked",true);
       $(this).find('input').prop('indeterminate',false);
       var grd = this.closest('div[type=grid]');
       var _list = grd.list;
       for(var i=0; i < _list.length; i++){
           var row = _list[i];
           if($($(grd).find('td[id='+tdId+']')[i]).find('input').is(':disabled') == false){
        	   row._system.status ='U';
               row[tdId] = $(grd.cellInfo[tdId]).attr("truevalue");
           }
       }
   }
   $m[$(grd).attr("srcid")].redrawGrid(grd);
};

Moca.prototype.setCheckboxGroupList = function(obj,_checkGroupList,metaObj,checkedInfo){
    obj.setAttribute('itemset',JSON.stringify(_checkGroupList));
    $m.renderCheckboxGroup(obj,null,null,metaObj,checkedInfo);
};


Moca.prototype.getCheckboxGroupCheckedList = function(obj){
    var returnArr = [];
    var arr = $(obj).find('[type=checkbox]:checked');
    for(var i=0;i < arr.length; i++){
        var aCheck = arr[i];
        returnArr.push(aCheck.value);
    }
    return returnArr;
};

Moca.prototype.getLabel = function(_thisObj){
    var _label;
    if($(_thisObj).attr('class') == 'label'){
        _label = $(_thisObj).text();
    }else{
        _label = $(_thisObj).prev().text();
    }
    return _label;
};

Moca.prototype.setLabel = function(_thisObj,_value){
    var _label = $(_thisObj).prev().text();
    
    if($(_thisObj).attr('class') == 'label'){
        _label = $(_thisObj).text(_value);
    }else{
        _label = $(_thisObj).prev().text(_value);
    }
    
    return _label;
};

Moca.prototype.getLabelValue = function(_thisObj){
    var _labelVal;
    if(_thisObj.tagName == 'INPUT'){
        _labelVal = $(_thisObj).val();
    }else{
        _labelVal = $(_thisObj).text();
    }
    return _labelVal;
};

Moca.prototype.setLabelValue = function(_thisObj,_value){
    var _labelVal;
    if(_thisObj.tagName == 'INPUT'){
        _labelVal = $(_thisObj).val(_value);
    }else{
        _labelVal = $(_thisObj).text(_value);
    }
};

Moca.prototype.defaultCellClick = function(_thisObj){
	//event.preventDefault();
    if($(_thisObj).attr('celltype') == 'input' && $(_thisObj).find('input').length > 0){
        return  ;
    }
    if($(_thisObj).attr('celltype') == 'input' && $(_thisObj).find('div[type="input"]').length > 0){
    	var _divObj = $(_thisObj).find('div[type="input"]');
    	var _value = _divObj.html();
    	var _grd = _thisObj.closest('div[type="grid"]');
		var _keyMask ='';
		var cellTd = _thisObj;
		var _keyMaskStr = '';
		var _editorMode;
		_editorMode =$m.trim(cellTd.getAttribute('editormode'));
		_keyMask = $m.trim(cellTd.getAttribute("keyMask"));
		_displayfunction = $m.trim(cellTd.getAttribute("displayfunction"));
		_displayfunctionapply = $m.trim(cellTd.getAttribute("displayfunctionapply"));
		if(_keyMask != null){
			_keyMaskStr = _keyMask;
		}
		if($m.getDevice() == "mobile"){
			if($.trim(_editorMode) != ''){
				//$m.zoomInput(_thisObj,_grd,_value);
				var _thNm = $($(_grd).find('thead th')[_thisObj.cellIndex]).text();
				$m.popup({
			        type:"POPUP",
			        modal:"true",
			        url:'/moca/comp/COMP_EDIT.html',
			        title:_thNm,
			        //callback:$m[grd.getAttribute("srcid")]._excelCallback,
			        data:{
			        	value:_value,
			            grdId:_grd.id,
			            tdId:_thisObj.id,
			            pageId:_grd.getAttribute("pageid"),
			            srcId:_grd.getAttribute("srcid"),
			            scopeId:_grd.getAttribute("pageid")
			        }
			    });
			}else{
				$m.zoomInput(_thisObj,_grd,_value);
			}
		}else{
			var _value = _divObj.html();
			if($.trim(_editorMode) != ''){
				//$m.zoomInput(_thisObj,_grd,_value);
				var _thNm = $($(_grd).find('thead th')[_thisObj.cellIndex]).text();
				$m.popup({
			        type:"POPUP",
			        modal:"true",
			        url:'/moca/comp/COMP_EDIT.html',
			        title:_thNm,
			        //callback:$m[grd.getAttribute("srcid")]._excelCallback,
			        data:{
			        	value:_value,
			            grdId:_grd.id,
			            tdId:_thisObj.id,
			            pageId:_grd.getAttribute("pageid"),
			            srcId:_grd.getAttribute("srcid"),
			            scopeId:_grd.getAttribute("pageid")
			        }
			    });
			}else{
				 
				$(_divObj).html("<input type='text' onkeyup=\"$m._uptData(this)\" displayFunction=\'"+_displayfunction+"\'  displayFunctionApply=\'"+_displayfunctionapply+"\' onblur=\"$m.setDivTag(this,this.value,\'"+_keyMaskStr+"\');\"  value='"+_value+"'/>");
			}
		}
    }

    var grd = $(_thisObj).closest('div[type=grid]')[0];
    $m.nowGrd = grd;
    
    var selectedRealRowIndex = $m.nowGrd.getAttribute("selectedRealRowIndex");
    
    var _thisTd = $(_thisObj).closest('td');
    var colId = $(_thisObj).closest('td')[0].id;
	$m.nowColId = colId;
    var _tbody = $(_thisObj).closest('tbody');
    var _thisTr = $(_thisObj).closest('tr');
    var realRowIndex = Number(_thisTr.attr("realrowindex"));
    var rowIndex = _tbody.children().index(_thisTr);
    var selectedRealRowIndex = grd.getAttribute("selectedRealRowIndex");
    var onBeforeClickStr = grd.getAttribute("onBeforeClick");
    var onAfterClickStr = grd.getAttribute("onAfterClick");
    var pro = Promise.resolve();
    if(onBeforeClickStr != "" && onBeforeClickStr != null){
        pro = pro.then(function(re){
            return eval(onBeforeClickStr)(grd,realRowIndex,colId);
        });
    }
    pro = pro.then(function(re){
    	return $m._uptData(_thisObj);
    });
    if(onAfterClickStr != "" && onAfterClickStr != null){
        pro = pro.then(function(re){
            return eval(onAfterClickStr)(grd,realRowIndex,colId);
        });
    }   
    return pro;
};

Moca.prototype.setCellReadOnly = function(_grd,_realRowIndex,_colId,_trueFalse){
    ['grid setCellReadOnly']
    var key = _colId;
   
    var cellTd = _grd.cellInfo[key];//코딩소스의 정보
    var _celltype = cellTd.getAttribute("celltype");
    var _displayFunction = cellTd.getAttribute("displayFunction");
    var _required = cellTd.getAttribute("required");
    var _keyMaskStr = cellTd.getAttribute("keyMask");
    var _style = cellTd.getAttribute("style");
    var targetRow = $(_grd).find('tbody:first>tr[realrowindex='+_realRowIndex+']');
    //cellTd.setAttribute("readOnly",_trueFalse);//컬럼단위로 변경해버림
    if(_grd.list[_realRowIndex]["_system"][_colId] == null){
        _grd.list[_realRowIndex]["_system"][_colId] = {};
    }
    _grd.list[_realRowIndex]["_system"][_colId]['readonly'] = _trueFalse;
    var _reLabel = '';
    if(_celltype == 'input'){
    	var _cellData = $m.getCellData(_grd,_realRowIndex,_colId);
        try{
            if(_displayFunction != null && eval(_displayFunction) != null){
                _reLabel = eval(_displayFunction)(_cellData,_grd,_realRowIndex);        
            }else{
                _reLabel = _cellData;       
            }
        }catch(e){
            console.log("12829:"+e);
        }
        var _inTag = '';
        
        var _renderingDiv = $(_grd).attr('rendering_div');
        if(_renderingDiv){
        	if(_trueFalse){
                _inTag = _reLabel;
            }else{
                if(_required == 'true'){
                    _inTag = '<div type="text" onblur="$m.setDivTag(this,this.value,\''+_keyMaskStr+'\');" onkeydown="$m.keydown(this,this.value,\''+_keyMaskStr+'\');" displayFunction=\''+_displayFunction+'\'  class="moca_input req" style="'+_style+'" value="'+_reLabel+'" onkeyup="$m._uptData(this)" onfocus="$m._evt_selectFocus(this)">'+_reLabel+'</div>';
                }else{
                    _inTag = '<div type="text" onblur="$m.setDivTag(this,this.value,\''+_keyMaskStr+'\');" onkeydown="$m.keydown(this,this.value,\''+_keyMaskStr+'\');" displayFunction=\''+_displayFunction+'\'  class="moca_input" style="'+_style+'" value="'+_reLabel+'" onkeyup="$m._uptData(this)" onfocus="$m._evt_selectFocus(this)">'+_reLabel+'</div>';
                }
            }
        }else{
            if(_trueFalse){
                _inTag = _reLabel;
            }else{
                
                if(_required == 'true'){
                    _inTag = '<input type="text" onblur="$m.setValue(this,this.value,\''+_keyMaskStr+'\');" onkeydown="$m.keydown(this,this.value,\''+_keyMaskStr+'\');" displayFunction=\''+_displayFunction+'\'  class="moca_input req" style="'+_style+'" value="'+_reLabel+'" onkeyup="$m._uptData(this)" onfocus="$m._evt_selectFocus(this)">';
                }else{
                    _inTag = '<input type="text" onblur="$m.setValue(this,this.value,\''+_keyMaskStr+'\');" onkeydown="$m.keydown(this,this.value,\''+_keyMaskStr+'\');" displayFunction=\''+_displayFunction+'\'  class="moca_input" style="'+_style+'" value="'+_reLabel+'" onkeyup="$m._uptData(this)" onfocus="$m._evt_selectFocus(this)">';
                }
            }
        }
        
        
    }else if(_celltype == 'select'){
        var _displayFormat  = cellTd.getAttribute("displayFormat");
    	var arr = $(_grd)[0][_colId].list;
        if(arr == null){
            arr = [];
        }
        if(_displayFormat != null && _displayFormat != 'null'){
	        _cd = _grd.list[_realRowIndex][_colId];
	        _nm = _grd[_colId].map[_grd.list[_realRowIndex][_colId]];
	        _reLabel = _displayFormat.replace('[value]',_cd).replace('[label]',_nm);
        }else{
        	 _reLabel = _nm;
        }
        var _inTag = '';
        if(_trueFalse){
            _inTag = _reLabel;
        }else{
            var cellHeight = _grd.getAttribute('default_cell_height');
            if(cellHeight == null){
                console.log('grid('+_grd.id+')에 default_cell_height가 지정되지않았습니다. 26px로 지정합니다.');
                cellHeight = "26px";
            }
            var ch = parseFloat(cellHeight.replace(/px/g,''))-2;
            
            cd = _grd.list[_realRowIndex][_colId];
            nm = _grd[_colId].map[_grd.list[_realRowIndex][_colId]];
            label = _displayFormat.replace('[value]',_cd).replace('[label]',_nm);
            _inTag = $m.getSelectDivTagForCombo(label,_required,cd,nm,ch);
            _inTag += $m.getInputSelectTag(label,_required);
            _inTag += "</div>";
            
        }
    }
    
    $(targetRow).find('td[id='+_colId+']').attr('readonly',_trueFalse);
    $(targetRow).find('td[id='+_colId+']').html(_inTag);
};

Moca.prototype.resizingbar_down = function(_resizingbarDiv){
    ['resizingbar_down']
    this.resizingbarDiv = _resizingbarDiv;
    this.resizingbarDivOffsetLeft = event.screenX;
};

Moca.prototype.changeMdi = function(_ButtonObj){
    ['changeMdi'];
    
    if($('.mdibox').find('#mdi_2').parent().is(':visible')){
        //multi상태
        $(_ButtonObj).removeClass('moca_tab_merge');
        $(_ButtonObj).addClass('moca_tab_division');
        
        $('.mdibox').find('.resizingbar').hide();
        $('.mdibox').find('#mdi_2').parent().hide();
    }else{
        //single상태
        $(_ButtonObj).removeClass('moca_tab_division');
        $(_ButtonObj).addClass('moca_tab_merge');
        
        $('.mdibox').find('.resizingbar').show();
        $('.mdibox').find('#mdi_2').parent().show();
    }
};

Moca.prototype.changeTabPosition = function(_ButtonObj){
    ['changeMdiTab'];
    if(_ButtonObj.id == 'btn_mdiTab_bottom'){
    	if($('.mdibox').attr('tabposition') == 'bottom'){
        	$('.mdibox').attr('tabposition','top');
        	$(_ButtonObj).addClass('moca_tab_bottom');
        	$(_ButtonObj).removeClass('moca_tab_top');
        	$('.moca_aside').removeClass('bottom');
        }else{
        	$('.mdibox').attr('tabposition','bottom');
        	$(_ButtonObj).addClass('moca_tab_top');
        	$(_ButtonObj).removeClass('moca_tab_bottom');
        	$('.moca_aside').addClass('bottom');
        }
    }else{
    	if($(_ButtonObj).closest('div[type="tab"]').attr('tabposition') == 'bottom'){
    		$(_ButtonObj).closest('div[type="tab"]').attr('tabposition','top');
    		$(_ButtonObj).addClass('moca_tab_bottom');
        	$(_ButtonObj).removeClass('moca_tab_top');
    	}else{
    		$(_ButtonObj).closest('div[type="tab"]').attr('tabposition','bottom');
    		$(_ButtonObj).addClass('moca_tab_top');
        	$(_ButtonObj).removeClass('moca_tab_bottom');
    	}
    	
    }
};

Moca.prototype.toSingleMdi = function(_liCloseButtonObj){
    ['toSingleMdi']; 
    $('.mdibox').find('.resizingbar').css('display','none');
    $('.mdibox').find('#mdi_2').parent().css('display','none');
};

Moca.prototype.getDevice = function(){
    ['toSingleMdi']; 
    var sw = screen.width;
    if(sw < 1280){
    	
    	/*
    	if($('head').find('meta[name=viewport]').length == 0){
    		var h = $('head').html();
    		var viewpt = '<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">';
    		$('head').html(viewpt+"/n"+h);
    	}
    	*/
    	
    	
    	
    	return "mobile";
    }else{
    	return "pc";
    }
};


Moca.prototype.resizeContsImg = function(_contents){
    ['resizeContsImg']; 
    var recont = _contents;
    var arr = _contents.match(/(width\:\s*)([0-9]*)(px)/g);
	if(arr != null && arr.length > 0){
		for(var i=0; i < arr.length; i++){
			var aWidth = arr[i];
			var arr2 = aWidth.split(':');
			var v = arr2[1];
			v = $m.trim(v);
			v = v.replace(/px/g,'');
			if(Number(v) > 1600){
				//강제사이즈조정 width:100%,height제거
				recont = recont.replace(/(.*imageDownload\.do.*?)(width\:\s*)([0-9]*)(px)/g,'$1$2'+'100%').replace(/height\:\s*[0-9]+px;{0,1}/g,'');
			}
		}
	}
	return recont;
};

Moca.prototype.fullToMocaDT = function(_dt){
    ['fullToMocaDT "2021-10-06  00:00:00"']; 
    var arr = _dt.split(' ');
    var _time = arr[arr.length-1];
    var _timeChange = "23:59:59";
    var _redt = comLib.gfn_addDate(arr[0].replace(/\-/g,''), -1,'-')+' '+_timeChange;
    return _redt;
};

Moca.prototype.mocaToFullDT = function(_dt){
    ['mocaToFullDT'];
    
    var arr = _dt.split(' ');
    var _time = arr[arr.length-1];
    var _redt = comLib.gfn_addDate(arr[0].replace(/\-/g,''), 1,'-')+' '+_time;
    return _redt;
};

Moca.prototype.dateToString  = function(date){
	['yyyyMMddhhmmss, 월:MM,일:dd 시분:hh:mm'];
    var year = date.getFullYear().toString();

    var month = date.getMonth() + 1;
    month = month < 10 ? '0' + month.toString() : month.toString();

    var day = date.getDate();
    day = day < 10 ? '0' + day.toString() : day.toString();

    var hour = date.getHours();
    hour = hour < 10 ? '0' + hour.toString() : hour.toString();

    var minites = date.getMinutes();
    minites = minites < 10 ? '0' + minites.toString() : minites.toString();

    var seconds = date.getSeconds();
    seconds = seconds < 10 ? '0' + seconds.toString() : seconds.toString();

	var returnObj = {};
	returnObj["year"] = year;
	returnObj["month"] = month;
	returnObj["day"] = day;
	returnObj["hour"] = hour;
	returnObj["minites"] = minites;
	returnObj["seconds"] = seconds;
	returnObj["seconds"] = seconds;
	returnObj["full"] = year + month + day+ hour+ minites+ seconds;
	returnObj["fullFormat"] = year +'-'+ month +'-'+ day+' ' + hour+':' + minites+':' + seconds;
	
	returnObj["년"] = year;
	returnObj["월"] = month;
	returnObj["일"] = day;
	returnObj["시"] = hour;
	returnObj["분"] = minites;
	returnObj["초"] = seconds;
	returnObj["시:분"] = hour+":"+minites;
	
	
	
    return returnObj;
};
//--------------------------------------------------------------------------
Moca.prototype.lunar = {};
	/*  음력 달력 배열
	음력은 모든 달이 29일 ~ 30일 으로만 이루어짐
	음력에도 윤달이 있을 경우 2월에 1일이 추가되는 식이 아니라
	한달이 추가되어짐
	1-> 29일, 2->30일
	3, 4, 5, 6은 윤달이 추가로 생성됨
	3-> 29일 + 윤29일, 4-> 29일 + 윤30일
	5-> 30일 + 윤29일, 6-> 30일 + 윤30일
	*/
Moca.prototype.lunar.LUNAR_LAST_YEAR = 1939;
Moca.prototype.lunar.lunarMonthTable = [
	[2, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 2],   /* 양력 1940년 1월은 음력 1939년에 있음 그래서 시작년도는 1939년*/
	[2, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1],
	[2, 2, 1, 2, 2, 4, 1, 1, 2, 1, 2, 1],   /* 1941 */
	[2, 1, 2, 2, 1, 2, 2, 1, 2, 1, 1, 2],
	[1, 2, 1, 2, 1, 2, 2, 1, 2, 2, 1, 2],
	[1, 1, 2, 4, 1, 2, 1, 2, 2, 1, 2, 2],
	[1, 1, 2, 1, 1, 2, 1, 2, 2, 2, 1, 2],
	[2, 1, 1, 2, 1, 1, 2, 1, 2, 2, 1, 2],
	[2, 5, 1, 2, 1, 1, 2, 1, 2, 1, 2, 2],
	[2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2],
	[2, 2, 1, 2, 1, 2, 3, 2, 1, 2, 1, 2],
	[2, 1, 2, 2, 1, 2, 1, 1, 2, 1, 2, 1],
	[2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2],   /* 1951 */
	[1, 2, 1, 2, 4, 2, 1, 2, 1, 2, 1, 2],
	[1, 2, 1, 1, 2, 2, 1, 2, 2, 1, 2, 2],
	[1, 1, 2, 1, 1, 2, 1, 2, 2, 1, 2, 2],
	[2, 1, 4, 1, 1, 2, 1, 2, 1, 2, 2, 2],
	[1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 2],
	[2, 1, 2, 1, 2, 1, 1, 5, 2, 1, 2, 2],
	[1, 2, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2],
	[1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
	[2, 1, 2, 1, 2, 5, 2, 1, 2, 1, 2, 1],
	[2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2],   /* 1961 */
	[1, 2, 1, 1, 2, 1, 2, 2, 1, 2, 2, 1],
	[2, 1, 2, 3, 2, 1, 2, 1, 2, 2, 2, 1],
	[2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 2, 2],
	[1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 2, 2],
	[1, 2, 5, 2, 1, 1, 2, 1, 1, 2, 2, 1],
	[2, 2, 1, 2, 2, 1, 1, 2, 1, 2, 1, 2],
	[1, 2, 2, 1, 2, 1, 5, 2, 1, 2, 1, 2],
	[1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1],
	[2, 1, 1, 2, 2, 1, 2, 1, 2, 2, 1, 2],
	[1, 2, 1, 1, 5, 2, 1, 2, 2, 2, 1, 2],   /* 1971 */
	[1, 2, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1],
	[2, 1, 2, 1, 1, 2, 1, 1, 2, 2, 2, 1],
	[2, 2, 1, 5, 1, 2, 1, 1, 2, 2, 1, 2],
	[2, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2],
	[2, 2, 1, 2, 1, 2, 1, 5, 2, 1, 1, 2],
	[2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 1],
	[2, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1],
	[2, 1, 1, 2, 1, 6, 1, 2, 2, 1, 2, 1],
	[2, 1, 1, 2, 1, 2, 1, 2, 2, 1, 2, 2],
	[1, 2, 1, 1, 2, 1, 1, 2, 2, 1, 2, 2],   /* 1981 */
	[2, 1, 2, 3, 2, 1, 1, 2, 2, 1, 2, 2],
	[2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 2],
	[2, 1, 2, 2, 1, 1, 2, 1, 1, 5, 2, 2],
	[1, 2, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2],
	[1, 2, 2, 1, 2, 2, 1, 2, 1, 2, 1, 1],
	[2, 1, 2, 2, 1, 5, 2, 2, 1, 2, 1, 2],
	[1, 1, 2, 1, 2, 1, 2, 2, 1, 2, 2, 1],
	[2, 1, 1, 2, 1, 2, 1, 2, 2, 1, 2, 2],
	[1, 2, 1, 1, 5, 1, 2, 1, 2, 2, 2, 2],
	[1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 2, 2],   /* 1991 */
	[1, 2, 2, 1, 1, 2, 1, 1, 2, 1, 2, 2],
	[1, 2, 5, 2, 1, 2, 1, 1, 2, 1, 2, 1],
	[2, 2, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2],
	[1, 2, 2, 1, 2, 2, 1, 5, 2, 1, 1, 2],
	[1, 2, 1, 2, 2, 1, 2, 1, 2, 2, 1, 2],
	[1, 1, 2, 1, 2, 1, 2, 2, 1, 2, 2, 1],
	[2, 1, 1, 2, 3, 2, 2, 1, 2, 2, 2, 1],
	[2, 1, 1, 2, 1, 1, 2, 1, 2, 2, 2, 1],
	[2, 2, 1, 1, 2, 1, 1, 2, 1, 2, 2, 1],
	[2, 2, 2, 3, 2, 1, 1, 2, 1, 2, 1, 2],   /* 2001 */
	[2, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1],
	[2, 2, 1, 2, 2, 1, 2, 1, 1, 2, 1, 2],
	[1, 5, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2],
	[1, 2, 1, 2, 1, 2, 2, 1, 2, 2, 1, 1],
	[2, 1, 2, 1, 2, 1, 5, 2, 2, 1, 2, 2],
	[1, 1, 2, 1, 1, 2, 1, 2, 2, 2, 1, 2],
	[2, 1, 1, 2, 1, 1, 2, 1, 2, 2, 1, 2],
	[2, 2, 1, 1, 5, 1, 2, 1, 2, 1, 2, 2],
	[2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2],
	[2, 1, 2, 2, 1, 2, 1, 1, 2, 1, 2, 1],   /* 2011 */
	[2, 1, 6, 2, 1, 2, 1, 1, 2, 1, 2, 1],
	[2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2],
	[1, 2, 1, 2, 1, 2, 1, 2, 5, 2, 1, 2],
	[1, 2, 1, 1, 2, 1, 2, 2, 2, 1, 2, 1],
	[2, 1, 2, 1, 1, 2, 1, 2, 2, 1, 2, 2],
	[2, 1, 1, 2, 3, 2, 1, 2, 1, 2, 2, 2],
	[1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 2],
	[2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2],
	[2, 1, 2, 5, 2, 1, 1, 2, 1, 2, 1, 2],
	[1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],   /* 2021 */
	[2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2],
	[1, 5, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2],
	[1, 2, 1, 1, 2, 1, 2, 2, 1, 2, 2, 1],
	[2, 1, 2, 1, 1, 5, 2, 1, 2, 2, 2, 1],
	[2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 2, 2],
	[1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 2, 2],
	[1, 2, 2, 1, 5, 1, 2, 1, 1, 2, 2, 1],
	[2, 2, 1, 2, 2, 1, 1, 2, 1, 1, 2, 2],
	[1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1],
	[2, 1, 5, 2, 1, 2, 2, 1, 2, 1, 2, 1],   /* 2031 */
	[2, 1, 1, 2, 1, 2, 2, 1, 2, 2, 1, 2],
	[1, 2, 1, 1, 2, 1, 2, 1, 2, 2, 5, 2],
	[1, 2, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1],
	[2, 1, 2, 1, 1, 2, 1, 1, 2, 2, 1, 2],
	[2, 2, 1, 2, 1, 4, 1, 1, 2, 2, 1, 2],
	[2, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2],
	[2, 2, 1, 2, 1, 2, 1, 2, 1, 1, 2, 1],
	[2, 2, 1, 2, 5, 2, 1, 2, 1, 2, 1, 1],
	[2, 1, 2, 2, 1, 2, 2, 1, 2, 1, 2, 1],
	[2, 1, 1, 2, 1, 2, 2, 1, 2, 2, 1, 2],   /* 2041 */
	[1, 5, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2],
	[1, 2, 1, 1, 2, 1, 1, 2, 2, 1, 2, 2]];

// 음력 계산을 위한 객체
Moca.prototype.lunar.myDate = function(year, month, day, leapMonth) {
	this.year = year;
	this.month = month;
	this.day = day;
	this.leapMonth = leapMonth;
}

// 양력을 음력으로 계산
Moca.prototype.lunar.lunarCalc = function(year, month, day, type, leapmonth) {
	var solYear, solMonth, solDay;
	var lunYear, lunMonth, lunDay;

	
	LUNAR_LAST_YEAR = $m.lunar.LUNAR_LAST_YEAR;
	lunarMonthTable =  $m.lunar.lunarMonthTable;
	myDate = $m.lunar.myDate;
	// lunLeapMonth는 음력의 윤달인지 아닌지를 확인하기위한 변수
	// 1일 경우 윤달이고 0일 경우 음달
	var lunLeapMonth, lunMonthDay;
	var i, lunIndex;

	var solMonthDay = [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	/* range check */
	if (year < 1940 || year > 2040) {
	    alert('1940년부터 2040년까지만 지원합니다');
	    return;
	}

	/* 속도 개선을 위해 기준 일자를 여러개로 한다 */
	if (year >= 2000) {
	    /* 기준일자 양력 2000년 1월 1일 (음력 1999년 11월 25일) */
	    solYear = 2000;
	    solMonth = 1;
	    solDay = 1;
	    lunYear = 1999;
	    lunMonth = 11;
	    lunDay = 25;
	    lunLeapMonth = 0;

	    solMonthDay[1] = 29;    /* 2000 년 2월 28일 */
	    lunMonthDay = 30;   /* 1999년 11월 */
	}
	else if (year >= 1970) {
	    /* 기준일자 양력 1970년 1월 1일 (음력 1969년 11월 24일) */
	    solYear = 1970;
	    solMonth = 1;
	    solDay = 1;
	    lunYear = 1969;
	    lunMonth = 11;
	    lunDay = 24;
	    lunLeapMonth = 0;

	    solMonthDay[1] = 28;    /* 1970 년 2월 28일 */
	    lunMonthDay = 30;   /* 1969년 11월 */
	}
	else {
	    /* 기준일자 양력 1940년 1월 1일 (음력 1939년 11월 22일) */
	    solYear = 1940;
	    solMonth = 1;
	    solDay = 1;
	    lunYear = 1939;
	    lunMonth = 11;
	    lunDay = 22;
	    lunLeapMonth = 0;

	    solMonthDay[1] = 29;    /* 1940 년 2월 28일 */
	    lunMonthDay = 29;   /* 1939년 11월 */
	}

	lunIndex = lunYear - LUNAR_LAST_YEAR;

	// type이 1일때는 입력받은 양력 값에 대한 음력값을 반환
	// 2일 때는 입력받은 음력 값에 대한 양력값을 반환
	// 반복문이 돌면서 양력 값들과 음력 값들을 1일 씩 증가시키고
	// 입력받은 날짜값과 양력 값이 일치할 때 음력값을 반환함
	while (true) {
	    if (type == 1 &&
	        year == solYear &&
	        month == solMonth &&
	        day == solDay) {
	        return new myDate(lunYear, lunMonth, lunDay, lunLeapMonth);
	    }
	    else if (type == 2 &&
	        year == lunYear &&
	        month == lunMonth &&
	        day == lunDay &&
	        leapmonth == lunLeapMonth) {
	        return new myDate(solYear, solMonth, solDay, 0);
	    }

	    // 양력의 마지막 날일 경우 년도를 증가시키고 나머지 초기화
	    if (solMonth == 12 && solDay == 31) {
	        solYear++;
	        solMonth = 1;
	        solDay = 1;

	        // 윤년일 시 2월달의 총 일수를 1일 증가
	        if (solYear % 400 == 0)
	            solMonthDay[1] = 29;
	        else if (solYear % 100 == 0)
	            solMonthDay[1] = 28;
	        else if (solYear % 4 == 0)
	            solMonthDay[1] = 29;
	        else
	            solMonthDay[1] = 28;

	    }
	    // 현재 날짜가 달의 마지막 날짜를 가리키고 있을 시 달을 증가시키고 날짜 1로 초기화
	    else if (solMonthDay[solMonth - 1] == solDay) {
	        solMonth++;
	        solDay = 1;
	    }
	    else
	        solDay++;

	    // 음력의 마지막 날인 경우 년도를 증가시키고 달과 일수를 초기화
	    if (lunMonth == 12 &&
	        ((lunarMonthTable[lunIndex][lunMonth - 1] == 1 && lunDay == 29) ||
	            (lunarMonthTable[lunIndex][lunMonth - 1] == 2 && lunDay == 30))) {
	        lunYear++;
	        lunMonth = 1;
	        lunDay = 1;

	        if (lunYear > 2043) {
	            alert("입력하신 달은 없습니다.");
	            break;
	        }

	        // 년도가 바꼈으니 index값 수정
	        lunIndex = lunYear - LUNAR_LAST_YEAR;

	        // 음력의 1월에는 1 or 2만 있으므로 1과 2만 비교하면됨
	        if (lunarMonthTable[lunIndex][lunMonth - 1] == 1)
	            lunMonthDay = 29;
	        else if (lunarMonthTable[lunIndex][lunMonth - 1] == 2)
	            lunMonthDay = 30;
	    }
	    // 현재날짜가 이번달의 마지막날짜와 일치할 경우
	    else if (lunDay == lunMonthDay) {

	        // 윤달인데 윤달계산을 안했을 경우 달의 숫자는 증가시키면 안됨
	        if (lunarMonthTable[lunIndex][lunMonth - 1] >= 3
	            && lunLeapMonth == 0) {
	            lunDay = 1;
	            lunLeapMonth = 1;
	        }
	        // 음달이거나 윤달을 계산 했을 겨우 달을 증가시키고 lunLeapMonth값 초기화
	        else {
	            lunMonth++;
	            lunDay = 1;
	            lunLeapMonth = 0;
	        }

	        // 음력의 달에 맞는 마지막날짜 초기화
	        if (lunarMonthTable[lunIndex][lunMonth - 1] == 1)
	            lunMonthDay = 29;
	        else if (lunarMonthTable[lunIndex][lunMonth - 1] == 2)
	            lunMonthDay = 30;
	        else if (lunarMonthTable[lunIndex][lunMonth - 1] == 3)
	            lunMonthDay = 29;
	        else if (lunarMonthTable[lunIndex][lunMonth - 1] == 4 &&
	            lunLeapMonth == 0)
	            lunMonthDay = 29;
	        else if (lunarMonthTable[lunIndex][lunMonth - 1] == 4 &&
	            lunLeapMonth == 1)
	            lunMonthDay = 30;
	        else if (lunarMonthTable[lunIndex][lunMonth - 1] == 5 &&
	            lunLeapMonth == 0)
	            lunMonthDay = 30;
	        else if (lunarMonthTable[lunIndex][lunMonth - 1] == 5 &&
	            lunLeapMonth == 1)
	            lunMonthDay = 29;
	        else if (lunarMonthTable[lunIndex][lunMonth - 1] == 6)
	            lunMonthDay = 30;
	    }
	    else
	        lunDay++;
	}
}

// 양력을 음력날짜로 변환
Moca.prototype.lunar.solarToLunar = function(solYear, solMonth, solDay, type) {
	// 날짜 형식이 안맞을 경우 공백 반환
	if (!solYear || solYear == 0 ||
	    !solMonth || solMonth == 0 ||
	    !solDay || solDay == 0) {
	    return "";
	}

	// 양력의 달마다의 일수
	var solMonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	// 윤년일 시 2월에 1일 추가
	if (solYear % 400 == 0 || (solYear % 4 == 0 && solYear % 100 != 0)) solMonthDays[1] += 1;


	if (solMonth < 1 || solMonth > 12 ||
	    solDay < 1 || solDay > solMonthDays[solMonth - 1]) {

	    return "";
	}

	/* 양력/음력 변환 */
	var date = $m.lunar.lunarCalc(solYear, solMonth, solDay, 1);
	if(type == "short"){
		return "음 " + date.month + "." + date.day;
	}else{
		return "음력 " + date.year + "년 " + (date.leapMonth ? "(윤)" : "") + date.month + "월 " + date.day + "일";
	}
	
};
		


//----------------------------------------------------------------------------------------------------

$(document).ready(function() {
    var arr = $('[type=include]');
    if(arr.length > 0){
        for(var i=0; i < arr.length; i++){
            var aTag = arr[i];
            var _url = $(aTag).attr('src');
            //console.log("_url start:"+_url);
            $.ajax({
               type:"GET",
               url:_url+"?"+new Date().getTime(),
               async: false,
               dataType : "text",
               data : {
                   "header" : $m.header,
                   "body" : {},
                   "message" : {}
               },
               success : function(data) {
                   //console.log("_url end:"+aTag.id);
                   var data;
                   if(aTag.id == '__popup'){
                       //console.log("(__popup)include1"+aTag.id);
                       $m.getContents(data,_url,"POP",aTag.getAttribute("popupid"),aTag.getAttribute("popuptitle"));
                   }else if(aTag.id == '__body'){
                       //console.log("(__body)include2-1"+aTag.id);
                       data = $m.getContents(data,_url,"HTML",aTag);
                       //$(aTag).html(data);
                       //console.log("(__body)include2-2"+aTag.id);
                       $m.callReady(aTag);
                       //console.log("(__body)include2-3"+aTag.id);
                   }else if(aTag.id == '__iframe'){
                       //console.log("(else)include3"+aTag.id);
                       data = $m.getContents(data,_url,"IFRAME",aTag);
                       $(aTag).html(data);
                       //console.log("(else)include3-1"+aTag.id);
                   }else{
                       //console.log("(else)include3"+aTag.id);
                       data = $m.getContents(data,_url,"CMN",aTag);
                       $(aTag).html(data);
                       //console.log("(else)include3-1"+aTag.id);
                   }
               },
               complete : function(data) {
               },
               error : function(xhr, status, error) {
                   console.log(xhr, status, error);
               }
            });
        };
    }
});



