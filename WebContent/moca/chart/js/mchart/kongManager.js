var imgDir = 'images/';

var mainMap = {
};
var chartMap = {
};
function winresize(){
	$.each(mainMap,function(key,val){
		if(mainMap[key] != null){
			mainMap[key].redraw(chartMap[key]);
		}
	});
};

/*
 * 		var wsAdapter = {};
		wsAdapter['ref'] = "data:dltBrdgHdqrAsetWrthPrssList";
		wsAdapter['seriesColumns'] = "[['ctniRslt','ctniMgmtGoal','ctniAvg']]";
		wsAdapter['labelNode'] = "clss";
		var series = getWebSquareSeries(wsAdapter);
 */
function getWebSquareSeries(_wsObject){
	var array = [];
	try{
		var ref = _wsObject['ref'];
		var seriesColumns = _wsObject['seriesColumns'];
		var labelNode = _wsObject['labelNode'];
		var seriesColumnsObject = eval(seriesColumns);
		var refArr = ref.split(':');
		var dataList = eval(refArr[1]);
		var jsonArr = dataList.getAllJSON();
		for(var j=0;j < seriesColumnsObject[0].length; j++){
			array[j] = [];
		}
		for(var i=0;i < jsonArr.length; i++){
			var aJsonRowSeries = jsonArr[i];
			var seriesObject = seriesColumnsObject[0];
			for(var j=0;j < seriesObject.length; j++){
				var aArr = [aJsonRowSeries[labelNode], aJsonRowSeries[seriesObject[j]]];
				array[j].push(aArr);
			}
		}
	}catch(e){
		console.dir(e);
	}

	return array;
};


function createChart(_id){
	if(mainMap[_id] == null){
		mainMap[_id]  = new HChart($('#'+_id));
		chartMap[_id] = null;
	}

	return mainMap[_id];
};
function createOption(_chart,_chartId){
	var opt = _chart.createOption();
	opt['id'] = _chartId;
	chartMap[_chartId] = opt;
	chartMap[_chartId].series = [];
	return chartMap[_chartId];
};
function createSeries(_s_name,_s_chartType,_data,
		_max,_min,_divNum){
	var fObj1 = null;

	if(Array.isArray(_data)){
		fObj1 = chartUtil.formatData_profile2(_data,false,_max,_min,_divNum);

	}else{
		fObj1 = _data;

	}


	var a = {
		s_name:_s_name,
		s_data:fObj1['reArr'],
		s_map:fObj1['reMap'],
		//s_color:'rgba(255,201,14,1)',
		s_lineWidth:'1',
		s_sizeMin:1,
		s_sizeDefault:3,
		s_chartType:_s_chartType,
		s_shape:'rect',
		//s_shapeColor:'rgba(0,128,192,1)',
		s_draw:true,
		s_min:fObj1['miny'],
		s_max:fObj1['maxy'],
		s_y_mark_cnt:fObj1['y_mark_cnt'],
		s_axis:'L',
		s_unit:'건'				 	    
	};

	return a;
};

	var colours = [{red: 0,green: 0,blue: 0},
	                {red: 1,green: 97,blue: 183},
	                {red: 12,green: 171,blue: 193},
	                {red: 10,green: 187,blue: 35},
	                {red: 113,green: 198,blue: 7},
	                {red: 232,green: 244,blue: 20},
	                {red: 255,green: 167,blue: 33},
	                {red: 234,green: 101,blue: 0},
	                {red: 255,green: 255,blue: 255}
	                ];
	                
		var lineColours = [
			{red: 86,green: 148,blue: 216},
			{red: 255,green: 128,blue: 0},
			{red: 150,green: 150,blue: 150},
			{red: 10,green: 187,blue: 35},
			{red: 231,green: 158,blue: 228},
			{red: 223,green: 219,blue: 166},
			{red: 231,green: 168,blue: 158},
			{red: 173,green: 216,blue: 216},
			{red: 0,green: 128,blue: 128}
		];
		var lineStyles = ['dash',
	                'common',
	                'common',
	                'dash',
	                'common',
	                'common',
	                'dash',
	                'common',
	                'common'
	                ];	                
		var lineDeeps = ['1',
	                '3',
	                '1',
	                '2',
	                '2',
	                '2',
	                '3',
	                '3',
	                '3'
	                ];	  
$(window).resize(winresize);






/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function chart1(){
			var chartId = 'chart1';
			var chart1 = createChart(chartId);			
			var option = createOption(chart1,chartId);			
			var aSeries = createSeries('any sereis','bar',data1);	
			aSeries.s_color='rgba(242,159,6,1)';
			option.series.push(aSeries);

			option.unitLabel_Hori			= '<년>';
			option.unitLabel_Verti			= '        [발생건수]            ';
			option.chartTitle				= '<기수행된사후평가km당 민원발생 현황>';
			option.background_color = 'rgba(255,255,255,0)';
			option.center_fill_color = 'rgba(255,255,255,0)';
			
			
			var colours = [
			                {red: 242,green: 159,blue: 6},
			                {red: 254,green: 240,blue: 216}
			                ];					
			option.colours			= colours;
			var colourGradientObject = new ColourGradient(0,option.series[0]['s_data'].length, colours);
			option.colorObj			= colourGradientObject;
			option.gradientColorUse = true;
			chart1.redraw(option);
	};
	function chart2(){
			var chartId = 'chart2';
			var chart2 = createChart(chartId);			
			var option = createOption(chart2,chartId);					
			option.xrange_axis				= true;//x축이 범위형축
			option.xmin						= 0;//x축이 범위형축으로 구성될때 x축의 최소값
			option.xmax						= 10000;//x축이 범위형축으로 구성될때 x축의 최대값
			option.xrange_count				= 10;//x축이 범위형축으로 구성될때 x축의눈금개수	
			option.xunit					= 'km';//툴팁에 표시되는 X값의단위
			option.unitLabel_Hori			= '높이';
			option.unitLabel_Verti			= '온도';
			option.crossLineShow			= true;//수직선
			option.crossLineShow_hori		= true;//실시간선택라인 수평선 사용안함
			option.rpTooltipUse				= true;			
			option.rpTooltipColor			= 'rgba(255,255,255,0.8)';
			option.rpTooltipBorderColor		= 'rgba(103,128,133,0.8)';			
			option.rpTooltipTitleBgColor	= 'rgba(140,140,140,0.8)';	
			option.rpTooltipTitleTxtColor	= 'rgba(255,255,255,1)';
			option.rpTooltipTxtColor		= 'rgba(140,140,140,1)';
			option.chartTitle				= 'Sales Of Beer';	
			/*
			option.chartTitleAlign			= 'left';	
			option.chartTitlePosition		= 'boxOut';				
			option.mainTitleFont			= '18px Arial';	
			
			option.legendPosition			= "bottom";//범례의 수직선상위치	
			option.legendPositionH			= "left";//범례의 수평선상위치		

			option.showTopBorder			= true;
			option.showRightBorder			= false;
			option.showLeftBorder			= false;

			option.showToolTipChartType		= false;
			option.tooltipFont				= '12px Arial';
			option.valueShow				= true;			
			*/
			option.valueShowFont			= '12px Arial';
			
			var aSeries 	= createSeries('any sereis','scatter',data2);//3번,4번param->max=null,min=null주면 동적으로 구함
			aSeries.s_unit	='ºC';//툴팁에 표시될 Y값의단위
			aSeries.s_sizeDefault = 3;//점의 크기
			aSeries.s_shape='circle';//점의 모양
			aSeries.s_color='rgba(0,128,192,1)';//시리즈의 색상, (0,128,192)색은 블루

			option.series.push(aSeries);			
			chart2.redraw(option);
	};	
	function chart2_1(){
			var chartId = 'chart2_1';
			var chart = createChart(chartId);			
			var option = createOption(chart,chartId);					
			option.xrange_axis				= true;//x축이 범위형축
			option.xmin						= 0;//x축이 범위형축으로 구성될때 x축의 최소값
			option.xmax						= 30;//x축이 범위형축으로 구성될때 x축의 최대값
			option.xrange_count				= 10;//x축이 범위형축으로 구성될때 x축의눈금개수	
			option.xunit					= 'km';//툴팁에 표시되는 X값의단위
			option.unitLabel_Hori			= '높이';
			option.unitLabel_Verti			= '온도';
			option.crossLineShow			= true;//수직선
			option.crossLineShow_hori		= true;//실시간선택라인 수평선 사용안함

			option.rpTooltipUse				= true;			
			option.rpTooltipColor			= 'rgba(255,255,255,0.8)';
			option.rpTooltipBorderColor		= 'rgba(103,128,133,0.8)';			
			option.rpTooltipTitleBgColor	= 'rgba(140,140,140,0.8)';	
			option.rpTooltipTitleTxtColor	= 'rgba(255,255,255,1)';
			option.rpTooltipTxtColor		= 'rgba(140,140,140,1)';
			option.chartTitle				= 'Sales Of Beer';	
			/*
			option.chartTitleAlign			= 'left';	
			option.chartTitlePosition		= 'boxOut';				
			option.mainTitleFont			= '18px Arial';	
			
			option.legendPosition			= "bottom";//범례의 수직선상위치	
			option.legendPositionH			= "left";//범례의 수평선상위치		

			option.showTopBorder			= true;
			option.showRightBorder			= false;
			option.showLeftBorder			= false;

			option.showToolTipChartType		= false;
			option.tooltipFont				= '12px Arial';
			option.valueShow				= true;			
			*/
			option.valueShowFont			= '12px Arial';
			option.min						= 0;
			//option.s_y_mark_cnt				= 3;
			
			var aSeries 	= createSeries('any sereis','scatter',chartUtil.formatData_profile2(data2_1,false,null,0,3,true));//3번,4번param->max=null,min=null주면 동적으로 구함
			aSeries.s_unit	='ºC';//툴팁에 표시될 Y값의단위
			aSeries.s_sizeDefault = 3;//점의 크기
			aSeries.s_shape='circle';//점의 모양
			aSeries.s_color='rgba(237,28,36,0.8)';//시리즈의 색상, (0,128,192)색은 블루
			aSeries.s_shapeColor='rgba(237,28,36,1)';//시리즈의 색상, (0,128,192)색은 블루

			option.series.push(aSeries);			
			chart.redraw(option);
	};	
	function chart2_2(){
			var chartId = 'chart2_2';
			var chart = createChart(chartId);			
			var option = createOption(chart,chartId);					
			option.xrange_axis				= true;//x축이 범위형축
			option.xmin						= 0;//x축이 범위형축으로 구성될때 x축의 최소값
			option.xmax						= 50;//x축이 범위형축으로 구성될때 x축의 최대값
			option.xrange_count				= 10;//x축이 범위형축으로 구성될때 x축의눈금개수	
			option.xunit					= 'km';//툴팁에 표시되는 X값의단위
			option.unitLabel_Hori			= '높이';
			option.unitLabel_Verti			= '온도';
			option.crossLineShow			= true;//수직선
			option.crossLineShow_hori		= true;//실시간선택라인 수평선 사용안함

			option.rpTooltipUse				= true;			
			option.rpTooltipColor			= 'rgba(255,255,255,0.8)';
			option.rpTooltipBorderColor		= 'rgba(103,128,133,0.8)';			
			option.rpTooltipTitleBgColor	= 'rgba(140,140,140,0.8)';	
			option.rpTooltipTitleTxtColor	= 'rgba(255,255,255,1)';
			option.rpTooltipTxtColor		= 'rgba(140,140,140,1)';
			option.chartTitle				= 'Sales Of Beer';	

			option.valueShowFont			= '12px Arial';
			option.min						= 0;

			var aSeries 	= createSeries('any sereis','scatter',chartUtil.formatData_profile2(data2_2,false,null,null,null,true));//3번,4번param->max=null,min=null주면 동적으로 구함
			aSeries.s_unit	='ºC';//툴팁에 표시될 Y값의단위
			aSeries.s_sizeDefault = 3;//점의 크기
			aSeries.s_shape='circle';//점의 모양
			aSeries.s_color='rgba(34,177,76,0.8)';//시리즈의 색상, (0,128,192)색은 블루
			aSeries.s_shapeColor='rgba(34,177,76,1)';//시리즈의 색상, (0,128,192)색은 블루

			option.series.push(aSeries);			
			chart.redraw(option);
	};		
	function chart3(){
			var chartId = 'chart3';
			var chart3 = createChart(chartId);			
			var option = createOption(chart3,chartId);						
			option.xrange_axis				= false;//x축이 범위형축		
			option.xunit					= 'ºC';//툴팁에 표시되는 X값의단위
			option.unitLabel_Hori			= '온도';
			option.unitLabel_Verti			= 'Sales(In Usd)';
			option.chartTitle				= 'Sales Of Beer & Ice-cream';	
			option.min = 0;
			option.toFixedY					= 2;
			/*
			option.showTopBorder			= true;
			option.showRightBorder			= false;
			option.showLeftBorder			= false;	
			option.showToolTipChartType		= false;
			option.legendPosition			= 'top';
			option.legendPositionH			= 'titleRight';
			option.legendFont				= '12px Arial';	
			option.chartTitleAlign			= 'left';	
			option.chartTitlePosition		= 'boxOut';				
			option.mainTitleFont			= '18px Arial';	
			option.valueShow				= true;	
			*/
			var dataOpt = chartUtil.formatData_profile2(data3_2,false,null,null,null,true);

			var aSeries 	= createSeries('any sereis','line',dataOpt);//3번,4번param->max=null,min=null주면 동적으로 구함
			aSeries.s_unit	='개';//툴팁에 표시될 Y값의단위
			aSeries.s_sizeDefault = 3;//점의 크기
			aSeries.s_shape='circle';//점의 모양
			aSeries.s_color='rgba(0,128,192,1)';//시리즈의 색상, (0,128,192)색은 블루

			option.series.push(aSeries);			
			chart3.redraw(option);
			
	};
	function chart4(){
			var chartId = 'chart4';
			var chart4 = createChart(chartId);			
			var option = createOption(chart4,chartId);							
			option.xrange_axis				= false;//x축이 범위형축		
			option.xunit					= 'ºC';//툴팁에 표시되는 X값의단위
			option.unitLabel_Hori			= '온도';
			option.unitLabel_Verti			= 'Sales(In Usd)';
			option.chartTitle				= 'Sales Of Beer & Ice-cream';	
			option.crossLineShow_hori		= false;//실시간선택라인 수평선 사용안함			
			option.randomColorUse           = true;
			

			var aSeries 	= createSeries('any sereis','bar',data4);//3번,4번param->max=null,min=null주면 동적으로 구함
			aSeries.s_unit	='개';//툴팁에 표시될 Y값의단위

			aSeries.s_color='rgba(0,128,192,1)';//시리즈의 색상, (0,128,192)색은 블루

			option.series.push(aSeries);			
			chart4.redraw(option);
	};		
	function chart5(){
			var chartId = 'chart5';
			var chart5 = createChart(chartId);			
			var option = createOption(chart5,chartId);						
			option.xrange_axis				= false;//x축이 범위형축		
			option.xunit					= 'ºC';//툴팁에 표시되는 X값의단위
			option.unitLabel_Hori			= '월';
			option.unitLabel_Verti			= '수량';			
			option.chartTitle				= 'Sales Of Ice-cream';				
			option.rpTooltipUse				= true;		
			option.tooltipFont				= '12px Arial';
			option.legendPositionH			= 'titleRight2';		
			//var yMax = 5000;var yMin = -1000;//시리즈가 여러개일경우 자동 min,max 구하기가 부하가 걸릴수있으므로 명시적으로 지정하여 퍼포먼스를 향상시킴			
			/* 1번 시리즈 [주의 : createSeries사용시 이름이 반드시 달라야함!!!]*/
			var aSeries 	= createSeries('any sereis1','line',chartUtil.formatData_profile2(data5_1,false,null,null,null));//3번,4번argu->max=null,min=null주면 동적으로 구함
			aSeries.s_unit	='개';//툴팁에 표시될 Y값의단위
			aSeries.s_sizeDefault = 3;//점의 크기
			aSeries.s_shape='circle';//점의 모양
			//aSeries.s_color='rgba(86,148,216,1)';//시리즈의 색상, (0,128,192)색은 블루
			//aSeries.s_shapeColor='rgba(86,148,216,1)';
			aSeries.s_lineWidth=1;

			option.series.push(aSeries);			
			
			/* 2번 시리즈 [주의 : createSeries사용시 이름이 반드시 달라야함!!!]*/
			var aSeries 	= createSeries('any sereis2','line',chartUtil.formatData_profile2(data5_2,false,null,null,null));//3번,4번argu->max=null,min=null주면 동적으로 구함
			aSeries.s_unit	='개';//툴팁에 표시될 Y값의단위
			aSeries.s_sizeDefault = 3;//점의 크기(반지름)
			aSeries.s_shape='rect';//점의 모양
			//aSeries.s_color='rgba(231,158,228,1)';//시리즈의 색상, (0,128,192)색은 블루
			//aSeries.s_shapeColor='rgba(231,158,228,1)';
			aSeries.s_lineWidth=2;

			option.series.push(aSeries);

			/* 3번 시리즈 [주의 : createSeries사용시 이름이 반드시 달라야함!!!]*/
			var aSeries 	= createSeries('any sereis3','line',chartUtil.formatData_profile2(data5_3,false,null,null,null));//3번,4번argu->max=null,min=null주면 동적으로 구함
			aSeries.s_unit	='개';//툴팁에 표시될 Y값의단위
			aSeries.s_sizeDefault = 3;//점의 크기
			aSeries.s_shape='circle';//점의 모양
			//aSeries.s_color='rgba(173,216,216,1)';//시리즈의 색상, (0,128,192)색은 블루
			//aSeries.s_shapeColor='rgba(173,216,216,1)';
			aSeries.s_lineWidth=3;
			option.series.push(aSeries);	

			for(var i=0; i < 10; i++){
				var aSeries 	= createSeries('ser2'+i,'line',chartUtil.formatData_profile2(data5_3,false,null,null,null));//3번,4번argu->max=null,min=null주면 동적으로 구함
				aSeries.s_unit	='개';//툴팁에 표시될 Y값의단위
				aSeries.s_sizeDefault = 3%(i+1);//점의 크기
				aSeries.s_shape='circle';//점의 모양
				aSeries.s_lineWidth=3;
				option.series.push(aSeries);		
			}
			
			chart5.redraw(option);
	};	
	function chart6(){
			var chartId = 'chart6';
			var chart6 = createChart(chartId);			
			var option = createOption(chart6,chartId);				
			option.xrange_axis				= false;//x축이 범위형축		
			option.xunit					= 'ºC';//툴팁에 표시되는 X값의단위
			option.unitLabel_Hori			= '온도';
			option.unitLabel_Verti			= 'Sales(In Usd)';
			//중요
			option.unitLabel_Verti_R		= '명[인원수]';
			

			option.crossLineShow_hori		= false;//실시간선택라인 수평선 사용안함
			option.bothYAxis				= true;//오른쪽축과 왼쪽축을 함께사용함
			//option.right_margin				= 60;//오른쪽 축사용을 위해 지정함
			option.toFixedY					= 2;//Y1,Y2양쪽축 모두함께 적용 표시할 표수점자리수		
			
			
			option.chartTitle				= 'Sales Of Apple';	
			option.bottom_title_align		= 'center';//x축 타이틀 위치
			/*
			
			
			
			option.chartTitleAlign			= 'left';	
			option.chartTitlePosition		= 'boxOut';				
			option.mainTitleFont			= '18px Arial';			
			

			option.legendPosition			= 'top';
			option.legendPositionH			= 'right';
			option.legendFont				= '12px Arial';				

			option.showTopBorder			= true;
			option.showRightBorder			= false;
			option.showLeftBorder			= false;

			option.showToolTipChartType		= false;
			option.tooltipFont				= '12px Arial';
			option.valueShow				= true;			
			option.valueShowFont			= '8px Arial';
			*/
			
			
			option.min = 0;////////////////////////////////////왼쪽Y축의 min값
			option.min_R = 0;//////////////////////////////////오른쪽Y축의 min값
			/* 1번 시리즈 [주의 : createSeries사용시 이름이 반드시 달라야함!!!]*/
			var aSeries 	= createSeries('any sereis A','bar',data6_1);//3번,4번argu->max=null,min=null,divNum=null주면 동적으로 구함
			aSeries.s_unit	='개';//툴팁에 표시될 Y값의단위
			aSeries.s_sizeDefault = 1;//점의 크기
			aSeries.s_shape='circle';//점의 모양
			aSeries.s_color='rgba(86,148,216,1)';//시리즈의 색상, (0,128,192)색은 블루
			aSeries.s_shapeColor = aSeries.s_color;
			aSeries.s_lineWidth=1;
			option.series.push(aSeries);			
			
			
			/* 2번 시리즈 [주의 : createSeries사용시 이름이 반드시 달라야함!!!]*/
			var aSeries2 	= createSeries('any sereis B','line',data6_2);//3번,4번argu->max=null,min=null,divNum=null주면 동적으로 구함
			aSeries2.s_unit	='개';//툴팁에 표시될 Y값의단위
			aSeries2.s_sizeDefault = 2;//점의 크기
			aSeries2.s_shape='rect';//점의 모양
			aSeries2.s_color='rgba(231,158,228,1)';//시리즈의 색상, (0,128,192)색은 블루
			aSeries2.s_shapeColor = aSeries2.s_color;
			aSeries2.s_lineWidth=2;
			aSeries2.s_axis = 'R';

			
			option.series.push(aSeries2);


			
			chart6.redraw(option);
	};		
	function chart7(){
			var chartId = 'chart7';
			var chart7 = createChart(chartId);			
			var option = createOption(chart7,chartId);						
			option.xrange_axis				= false;//x축이 범위형축		
			option.xunit					= 'ºC';//툴팁에 표시되는 X값의단위
			option.unitLabel_Hori			= '온도';
			option.unitLabel_Verti			= 'Sales(In Usd)';
			option.unitLabel_Verti_R		= '명[인원수]';
			option.crossLineShow_hori		= false;//실시간선택라인 수평선 사용안함
			option.bothYAxis				= true;//오른쪽축과 왼쪽축을 함께사용함
			option.toFixedY					= 2;//Y1,Y2양쪽축 모두함께 적용 표시할 표수점자리수		
			
			option.chartTitle				= 'Qty of Member';
			option.min = 0;
			option.min_R = 0;
			/*
			option.chartTitleAlign			= 'left';	
			option.chartTitlePosition		= 'boxOut';				
			option.mainTitleFont			= '18px Arial';			
			

			option.legendPosition			= 'top';
			option.legendPositionH			= 'right';
			option.legendFont				= '12px Arial';				

			option.showTopBorder			= true;
			option.showRightBorder			= false;
			option.showLeftBorder			= false;

			option.showToolTipChartType		= false;
			option.tooltipFont				= '12px Arial';
			option.valueShow				= true;			
			option.valueShowFont			= '8px Arial';
			*/
			
			/* 1번 시리즈 [주의 : createSeries사용시 이름이 반드시 달라야함!!!]*/
			var aSeries 	= createSeries('any sereis A','bar',chartUtil.formatData_profile2(data7_1,false,null,0,null));//3번,4번argu->max=null,min=null,divNum=null주면 동적으로 구함
			aSeries.s_unit	='개';//툴팁에 표시될 Y값의단위
			aSeries.s_sizeDefault = 1;//점의 크기
			aSeries.s_shape='circle';//점의 모양
			aSeries.s_color='rgba(86,148,216,1)';//시리즈의 색상, (0,128,192)색은 블루
			option.series.push(aSeries);			
			
			
			/* 2번 시리즈 [주의 : createSeries사용시 이름이 반드시 달라야함!!!]*/
			var aSeries 	= createSeries('any sereis B','bar',chartUtil.formatData_profile2(data7_2,false,null,0,null));//3번,4번argu->max=null,min=null,divNum=null주면 동적으로 구함
			aSeries.s_unit	='개';//툴팁에 표시될 Y값의단위
			aSeries.s_sizeDefault = 2;//점의 크기
			aSeries.s_shape='rect';//점의 모양
			aSeries.s_color='rgba(231,158,228,1)';//시리즈의 색상, (0,128,192)색은 블루
			aSeries.s_unit='%';
			option.series.push(aSeries);

			
			/* 3번 시리즈 [주의 : createSeries사용시 이름이 반드시 달라야함!!!]*/
			var aSeries 	= createSeries('any sereis C','bar',chartUtil.formatData_profile2(data7_2,false,null,0,null));//3번,4번argu->max=null,min=null,divNum=null주면 동적으로 구함
			aSeries.s_unit	='개';//툴팁에 표시될 Y값의단위
			aSeries.s_sizeDefault = 2;//점의 크기
			aSeries.s_shape='rect';//점의 모양
			aSeries.s_color='rgba(173,216,216,1)';//시리즈의 색상, (0,128,192)색은 블루
			aSeries.s_unit='%';
			option.series.push(aSeries);	

			/* 4번 시리즈 [주의 : createSeries사용시 이름이 반드시 달라야함!!!]*/
			var aSeries2 	= createSeries('any sereis D','line',chartUtil.formatData_profile2(data7_3,false,null,0,null));//3번,4번argu->max=null,min=null,divNum=null주면 동적으로 구함
			aSeries2.s_unit	='개';//툴팁에 표시될 Y값의단위
			aSeries2.s_sizeDefault = 2;//점의 크기
			aSeries2.s_shape='rect';//점의 모양
			aSeries2.s_color='rgba(158,200,65,1)';//시리즈의 색상, (0,128,192)색은 블루
			aSeries2.s_shapeColor = aSeries2.s_color;
			aSeries2.s_lineWidth=2;
			aSeries2.s_axis = 'R';			
			option.series.push(aSeries2);	
			
			chart7.redraw(option);
	};
	function chart8(){
			var chartId = 'chart8';
			var chart8 = createChart(chartId);			
			var option = createOption(chart8,chartId);					
			option.x_label_extension		= true;
			option.unitLabel_Hori			= '<년>';
			option.unitLabel_Verti			= '    [관람자수]     ';

			
			option.chartTitle				= '< 개봉영화 흥행순위 >';	
			option.chartTitleVAlign 		= 'bottom';
			//option.legendPositionH			= 'titleRight';	
			/*
			option.chartTitleAlign			= 'left';	
			option.chartTitlePosition		= 'boxOut';				
			option.mainTitleFont			= '12px Arial';			
			

			option.legendPosition			= 'top';
			option.legendPositionH			= 'right';
			option.legendFont				= '12px Arial';				

			option.showTopBorder			= true;
			option.showRightBorder			= false;
			option.showLeftBorder			= false;

			option.showToolTipChartType		= false;
			option.tooltipFont				= '12px Arial';
			option.valueShow				= true;			
			option.valueShowFont			= '8px Arial';			
			*/

			var colors = ['182,192,118','118,192,187','186,119,191','193,140,117','215,211,96','211,99,130'];			

			
			/* 1번 시리즈 [주의 : createSeries사용시 이름이 반드시 달라야함!!!]*/
			var aSeries 	= createSeries('any sereis A','bar',data8);//3번,4번argu->max=null,min=null,divNum=null주면 동적으로 구함
			aSeries.s_unit	='개';//툴팁에 표시될 Y값의단위
			aSeries.s_sizeDefault = 1;//점의 크기
			aSeries.s_shape='circle';//점의 모양
			aSeries.s_colors = colors;
			aSeries.s_color='rgba(86,148,216,1)';//시리즈의 색상, (0,128,192)색은 블루
			option.series.push(aSeries);			
			
			
			chart8.redraw(option);
	};		
	function chart9(){
			var chartId = 'chart9';
			var chart9 = createChart(chartId);			
			var option = createOption(chart9,chartId);						
			option.xrange_axis				= false;//x축이 범위형축		
			option.xunit					= 'ºC';//툴팁에 표시되는 X값의단위
			option.unitLabel_Hori			= '온도';
			option.unitLabel_Verti			= 'Sales(In Usd)';

			option.crossLineShow_hori		= false;//실시간선택라인 수평선 사용안함
			option.min 						= 0;
			
			
			option.chartTitle				= 'Sales Of Show';	
			/*
			option.chartTitleAlign			= 'left';	
			option.chartTitlePosition		= 'boxOut';				
			option.mainTitleFont			= '18px Arial';			
			

			option.legendPosition			= 'top';
			option.legendPositionH			= 'right';
			option.legendFont				= '12px Arial';				

			option.showTopBorder			= true;
			option.showRightBorder			= false;
			option.showLeftBorder			= false;

			option.showToolTipChartType		= false;
			option.tooltipFont				= '12px Arial';
			option.valueShow				= true;			
			option.valueShowFont			= '8px Arial';	
			*/
			/* 1번 시리즈 [주의 : createSeries사용시 이름이 반드시 달라야함!!!]*/
			var aSeries1 	= createSeries('any sereis A','bar',data9_1);//3번,4번argu->max=null,min=null,divNum=null주면 동적으로 구함
			aSeries1.s_unit	='개';//툴팁에 표시될 Y값의단위
			aSeries1.s_sizeDefault = 1;//점의 크기
			aSeries1.s_shape='circle';//점의 모양
			aSeries1.s_color='rgba(100,128,0,1)';//시리즈의 색상, (0,128,192)색은 블루
			aSeries1.s_lineWidth=1;
			option.series.push(aSeries1);			
			

			/* 2번 시리즈 [주의 : createSeries사용시 이름이 반드시 달라야함!!!]*/
			var aSeries2 	= createSeries('any sereis B','line',data9_2);//3번,4번argu->max=null,min=null,divNum=null주면 동적으로 구함
			aSeries2.s_unit	='개';//툴팁에 표시될 Y값의단위
			aSeries2.s_sizeDefault = 2;//점의 크기
			aSeries2.s_shape='circle';//점의 모양
			aSeries2.s_shapeColor='rgba(255,255,255,1)';//점의색상
			aSeries2.s_color='rgba(231,158,228,1)';//시리즈의 색상, (0,128,192)색은 블루
			aSeries2.s_lineWidth=2;
			aSeries2.s_unit='%';
			aSeries2.s_max = aSeries1.s_max;
			aSeries2.s_min = aSeries1.s_min;
			option.series.push(aSeries2);


			
			chart9.redraw(option);
	};
	function chart10(){
			var chartId = 'chart10';
			var chart10 = createChart(chartId);			
			var option = createOption(chart10,chartId);	

			option.type= 'pie';
			//option.chartTitle= '> 주요지적사항';
			option.crossLineShow = false;
			option.tooltipShow = true;
			option.rpTooltipUse = true;	
			option.guideLineShow = true;
			option.mininal_rate = 2;//숫자가 클수록 작아진다.
			var series =
				 [
	 		 	    {s_name:'A상',s_data:data10
			 	    ,s_color:'rgba(55,101,114,1)',s_lineWidth:'1',s_sizeMin:1,s_sizeDefault:5
			 	    ,s_chartType:'line',s_shape:'rectangle',s_shapeColor:'rgba(100,128,0,1)'
			 	    ,s_draw:true,s_min:-50,s_max:50
			 	    ,s_unit:'건'}	 	   		 	     	    
				 ];
			option.series = series;
			chart10.redraw(option);
	};	
	
	function chart10_1(){
			var chartId = 'chart10_1';
			var chart10_1 = createChart(chartId);			
			var option = createOption(chart10_1,chartId);	

			option.type= 'pie';
			//option.chartTitle= '> 주요지적사항';
			option.crossLineShow = false;
			var series =
				 [
	 		 	    {s_name:'A상',s_data:data10_1
			 	    ,s_color:'rgba(231,158,228,1)',s_lineWidth:'1',s_sizeMin:1,s_sizeDefault:5
			 	    ,s_chartType:'line',s_shape:'rectangle',s_shapeColor:'rgba(100,128,0,1)'
			 	    ,s_draw:true,s_min:-50,s_max:50
			 	    ,s_unit:'건'}	 	   		 	     	    
				 ];
			option.series = series;
			chart10_1.redraw(option);
	};

	function chart10_2(){
			var chartId = 'chart10_2';
			var chart10 = createChart(chartId);			
			var option = createOption(chart10,chartId);	

			option.type= 'doughnut';
			//option.chartTitle= '> 주요지적사항';
			option.crossLineShow = false;
			option.tooltipShow = false;
			option.rpTooltipUse = true;	
			option.guideLineShow = false;		
			option.useSave = false;		
			option.cutPie = false;	
			option.tooltipMinimize = true;
			//option.mininal_rate = 1.5;//숫자가 작을수록 작아진다.
			option.rpTooltipColor = 'rgba(255,255,255,1)';		
			option.rpTooltipBorderShow = false;			
			var series =
				 [
	 		 	    {s_name:'A상',s_data:data10
			 	    ,s_color:'rgba(55,101,114,1)',s_lineWidth:'1',s_sizeMin:1,s_sizeDefault:5
			 	    ,s_chartType:'line',s_shape:'rectangle',s_shapeColor:'rgba(100,128,0,1)'
			 	    ,s_draw:true,s_min:-50,s_max:50
			 	    ,s_unit:'건'}	 	   		 	     	    
				 ];
			option.series = series;
			chart10.redraw(option);
	};	
	function chart10_3(){
			var chartId = 'chart10_3';
			var chart10 = createChart(chartId);			
			var option = createOption(chart10,chartId);	

			option.type= 'pie';
			//option.chartTitle= '> 주요지적사항';
			option.crossLineShow = false;
			option.tooltipShow = true;
			option.rpTooltipUse = true;	
			option.guideLineShow = true;
			option.mininal_rate = 2;//숫자가 클수록 작아진다.
			var series =
				 [
	 		 	    {s_name:'A상',s_data:data10_3
			 	    ,s_color:'rgba(55,101,114,1)',s_lineWidth:'1',s_sizeMin:1,s_sizeDefault:5
			 	    ,s_chartType:'line',s_shape:'rectangle',s_shapeColor:'rgba(100,128,0,1)'
			 	    ,s_draw:true,s_min:-50,s_max:50
			 	    ,s_unit:'건'}	 	   		 	     	    
				 ];
			option.series = series;
			chart10.redraw(option);
	};	
	
	function chart11(){
			var chartId = 'chart11';
			var chart11 = createChart(chartId);			
			var option = createOption(chart11,chartId);						
			option.xrange_axis				= false;//x축이 범위형축		
			option.xunit					= 'ºC';//툴팁에 표시되는 X값의단위
			option.unitLabel_Hori			= '온도';
			option.unitLabel_Verti			= 'Sales(In Usd)';

			option.crossLineShow_hori		= false;//실시간선택라인 수평선 사용안함
			option.toFixedY					= 2;//Y1,Y2양쪽축 모두함께 적용 표시할 표수점자리수	
			option.barVertical				= true;

			option.chartTitle				= 'Sales Of Pen';	
			/*
			option.chartTitleAlign			= 'left';	
			option.chartTitlePosition		= 'boxOut';				
			option.mainTitleFont			= '18px Arial';			
			

			option.legendPosition			= 'top';
			option.legendPositionH			= 'right';
			option.legendFont				= '12px Arial';				

			option.showTopBorder			= true;
			option.showRightBorder			= false;
			option.showLeftBorder			= false;

			option.showToolTipChartType		= false;
			option.tooltipFont				= '12px Arial';
			option.valueShow				= true;			
			option.valueShowFont			= '8px Arial';	
			*/
			var maxSum;
			var min;
			/* 1번 시리즈 [주의 : createSeries사용시 이름이 반드시 달라야함!!!]*/
			var aSeries1 	= createSeries('any sereis A','bar',chartUtil.formatData_profile2(data11_1,false,null,null,null));//3번,4번argu->max=null,min=null,divNum=null주면 동적으로 구함
			aSeries1.s_unit	='개';//툴팁에 표시될 Y값의단위
			aSeries1.s_sizeDefault = 1;//점의 크기
			aSeries1.s_shape='circle';//점의 모양
			aSeries1.s_color='rgba(86,148,216,1)';//시리즈의 색상, (0,128,192)색은 블루
			option.series.push(aSeries1);			
			maxSum = aSeries1.s_max;
			min = aSeries1.s_min;
			
			/* 2번 시리즈 [주의 : createSeries사용시 이름이 반드시 달라야함!!!]*/
			var aSeries2 	= createSeries('any sereis B','bar',chartUtil.formatData_profile2(data11_2,false,null,null,null));//3번,4번argu->max=null,min=null,divNum=null주면 동적으로 구함
			aSeries2.s_unit	='개';//툴팁에 표시될 Y값의단위
			aSeries2.s_sizeDefault = 2;//점의 크기
			aSeries2.s_shape='rect';//점의 모양
			aSeries2.s_color='rgba(231,158,228,1)';//시리즈의 색상, (0,128,192)색은 블루
			aSeries2.s_unit='%';
			option.series.push(aSeries2);
			maxSum += aSeries2.s_max;
			min = aSeries2.s_min;
			
			/* 3번 시리즈 [주의 : createSeries사용시 이름이 반드시 달라야함!!!]*/
			
			var aSeries3 	= createSeries('any sereis C','bar',chartUtil.formatData_profile2(data11_3,false,null,null,null));//3번,4번argu->max=null,min=null,divNum=null주면 동적으로 구함
			aSeries3.s_unit	='개';//툴팁에 표시될 Y값의단위
			aSeries3.s_sizeDefault = 2;//점의 크기
			aSeries3.s_shape='rect';//점의 모양
			aSeries3.s_color='rgba(173,216,216,1)';//시리즈의 색상, (0,128,192)색은 블루
			aSeries3.s_unit='%';
			option.series.push(aSeries3);			
			maxSum += aSeries3.s_max;
			min = aSeries3.s_min;
			
			
			aSeries1.s_max = maxSum;
			aSeries2.s_max = maxSum;
			aSeries3.s_max = maxSum;
			aSeries1.s_min = min;
			aSeries2.s_min = min;
			aSeries3.s_min = min;		
			chart11.redraw(option);
	};
	function chart12(){
			var fObj = chartUtil.formatDataHodo(data12);//*4는1일, *8은2일
			var chartId = 'chart12';
			var chart12 = createChart(chartId);			
			var option = createOption(chart12,chartId);	
			option.type						= 'doughnut';
			option.colorType = 'dark';
			option.crossLineShow = false;
			option.guideLineShow = true;
			option.background_color = 'rgba(255,255,255,0)';
			option.center_fill_color = 'rgba(255,255,255,0)';
			option.tooltipShow = true;
			option.rpTooltipUse = true;			
			var series =
				 [
	 		 	    {s_name:'A상',s_data:fObj['reArr']
			 	    ,s_color:'rgba(55,101,114,1)',s_lineWidth:'1',s_sizeMin:1,s_sizeDefault:5
			 	    ,s_chartType:'line',s_shape:'rectangle',s_shapeColor:'rgba(100,128,0,1)',s_draw:true,s_min:-50,s_max:50
			 	    ,s_unit:'건'}	 	   		 	     	    
				 ];
			option.series = series;
						
			chart12.redraw(option);

	};	
	function chart13(){
			var chartId = 'chart13';
			var chart13 = createChart(chartId);			
			var option = createOption(chart13,chartId);						
				
			option.xunit					= '년';//툴팁에 표시되는 X값의단위
			option.unitLabel_Hori			= '[년도]';
			option.unitLabel_Verti			= '[감가율]';
			//option.chartTitle				= 'Sales Of Beer & Ice-cream';	
			option.crossLineShow_hori		= false;//실시간선택라인 수평선 사용안함
			var _xmin =0;
			var _xmax =80;		
			option.xrange_axis				= true;//x축이 범위형축	
			option.xmin						= _xmin;
			option.xmax						= _xmax;			
			option.xrange_count             = (_xmax-_xmin)/5;	
			option.legendPosition			= 'top';//'top','bottom'

			var _min = 0;
			var _max = 50;
			option.y_mark_cnt					= 4;


			option.legendPositionH			= 'right';
			option.legendFont				= '12px Arial';				
/*
			option.gridShowH					= true;
			option.gridShowV					= false;
			
			option.chartTitleAlign			= 'left';	
			option.chartTitlePosition		= 'boxOut';				
			option.mainTitleFont			= '18px Arial';			
			


			

			option.showTopBorder			= true;
			option.showRightBorder			= false;
			option.showLeftBorder			= false;

			option.showToolTipChartType		= false;
			option.tooltipFont				= '12px Arial';
			option.valueShow				= true;			
			option.valueShowFont			= '8px Arial';				
			*/
			
			var seriesArr = data13;
			for(var g=0;g<seriesArr.length; g++){
					var data = chartUtil.formatData_profile2(seriesArr[g]);
					var _s_name = '';
					if(data['reArr'][0][3] != null){
						_s_name = data['reArr'][0][3];
					}
					var aSeries 	= createSeries(_s_name,'line',data);
					aSeries.s_unit	='개';//툴팁에 표시될 Y값의단위
					aSeries.s_sizeDefault = lineDeeps[g];//점의 크기
					aSeries.s_shape='circle';//점의 모양
					aSeries.s_color='rgba('+lineColours[g]['red']+','+lineColours[g]['green']+','+lineColours[g]['blue']+',1)';//시리즈의 색상
					aSeries.s_lineType=lineStyles[g];
					aSeries.s_lineWidth=lineDeeps[g];
					aSeries.s_shapeColor=aSeries.s_color;
					aSeries.s_lineLinkable=true;
					aSeries.s_min=_min;
					aSeries.s_max=_max;
					aSeries.s_y_mark_cnt=option.y_mark_cnt;

					option.series.push(aSeries);
			}			
			chart13.redraw(option);
	};	
	function chart13_1(){
			var chartId = 'chart13_1';
			var chart13_1 = createChart(chartId);			
			var option = createOption(chart13_1,chartId);						
				
			option.xunit					= '년';//툴팁에 표시되는 X값의단위
			option.unitLabel_Hori			= '[년도]';
			option.unitLabel_Verti			= '[감가율]';
			//option.chartTitle				= 'Sales Of Beer & Ice-cream';	
			option.crossLineShow_hori		= false;//실시간선택라인 수평선 사용안함
			var _xmin =0;
			var _xmax =80;		
			option.xrange_axis				= true;//x축이 범위형축	
			option.xmin						= _xmin;
			option.xmax						= _xmax;			
			option.xrange_count             = (_xmax-_xmin)/5;	
			option.legendPosition			= 'top';//'top','bottom'

			var _min =9999999999;
			var _max =-9999999999;
			option.y_mark_cnt					= 4;
			
	
			
			option.chartTitleAlign			= 'left';	
			option.chartTitlePosition		= 'boxOut';				
			option.mainTitleFont			= '18px Arial';			
			


			option.legendPositionH			= 'right';
			option.legendFont				= '12px Arial';				

			option.showTopBorder			= true;
			option.showRightBorder			= false;
			option.showLeftBorder			= false;

			option.showToolTipChartType		= false;
			option.tooltipFont				= '12px Arial';
			option.valueShow				= true;			
			option.valueShowFont			= '8px Arial';				
			
			var seriesArr = data13_1;
			for(var g=0;g<seriesArr.length; g++){
					var data = chartUtil.formatData_profile2(seriesArr[g]);
					if(_max < data['maxy']){
						_max = data['maxy'];
					}
					if(_min > data['miny']){
						_min = data['miny'];
					}					
					var _s_name = '';
					if(data['reArr'][0][3] != null){
						_s_name = data['reArr'][0][3];
					}
					var aSeries 	= createSeries(_s_name,'line',data);
					aSeries.s_unit	='개';//툴팁에 표시될 Y값의단위
					aSeries.s_sizeDefault = lineDeeps[g];//점의 크기
					aSeries.s_shape='circle';//점의 모양
					aSeries.s_color='rgba('+lineColours[g]['red']+','+lineColours[g]['green']+','+lineColours[g]['blue']+',1)';//시리즈의 색상
					aSeries.s_lineType=lineStyles[g];
					aSeries.s_lineWidth=lineDeeps[g];
					aSeries.s_shapeColor=aSeries.s_color;
					aSeries.s_lineLinkable=true;
					aSeries.s_min=_min;
					aSeries.s_max=_max;
					aSeries.s_y_mark_cnt=option.y_mark_cnt;

					option.series.push(aSeries);
			}
			for(var g=0;g<option.series.length; g++){
					option.series[g].s_min = _min;
					option.series[g].s_max = _max;
			}
			chart13_1.redraw(option);
	};	
	function chart14(){
			var chartId = 'chart14';
			var chart14 = createChart(chartId);			
			var option = createOption(chart14,chartId);				
				
			option.xunit					= '년';//툴팁에 표시되는 X값의단위
			option.unitLabel_Hori			= '[년도]';
			option.unitLabel_Verti			= '[감가율]';
			//option.chartTitle				= 'Sales Of Beer & Ice-cream';	
			option.crossLineShow_hori		= false;//실시간선택라인 수평선 사용안함
			var _xmin =0;
			var _xmax =80;		
			option.xrange_axis				= true;//x축이 범위형축
			option.xrange_axis_label_mapping= true;//범위형 x축에 해당범위값에 라벨을 맵핑해서 보여준다.
			option.xrange_axis_label_map    = {0:'A01',10:'A02',25:'K03',50:'Z04',70:'P05'};//범위형 x축에 해당범위값에 라벨을 맵핑해서 보여줄 대상 맵 오브젝트			
			option.xmin						= _xmin;
			option.xmax						= _xmax;			
			option.xrange_count             = (_xmax-_xmin)/5;	
			option.chartTitle				= 'Rate Of Year';
			option.legendPositionH			= 'titleRight';	
/*
			option.gridShowH					= true;
			option.gridShowV					= false;

			option.chartTitleAlign			= 'left';	
			option.chartTitlePosition		= 'boxOut';				
			option.mainTitleFont			= '18px Arial';			
			

			option.legendPosition			= 'top';
			option.legendPositionH			= 'right';
			option.legendFont				= '12px Arial';				

			option.showTopBorder			= true;
			option.showRightBorder			= false;
			option.showLeftBorder			= false;

			option.showToolTipChartType		= false;
			option.tooltipFont				= '12px Arial';
			option.valueShow				= true;			
			option.valueShowFont			= '8px Arial';		
*/
			var _min = 0;
			var _max = 50;
			option.y_mark_cnt					= 4;
			
			var seriesArr = data14;
			for(var g=0;g<seriesArr.length; g++){
					var data = chartUtil.formatData_profile2(seriesArr[g]);

					var _s_name = '';
					if(data['reArr'][0][3] != null){
						_s_name = data['reArr'][0][3];
					}
					var aSeries 	= createSeries(_s_name,'line',data);
					aSeries.s_unit	='';//툴팁에 표시될 Y값의단위
					aSeries.s_sizeDefault = lineDeeps[g];//점의 크기
					aSeries.s_shape='circle';//점의 모양
					aSeries.s_color='rgba('+lineColours[g]['red']+','+lineColours[g]['green']+','+lineColours[g]['blue']+',1)';//시리즈의 색상
					aSeries.s_lineType=lineStyles[g];
					aSeries.s_lineWidth=lineDeeps[g];
					aSeries.s_shapeColor=aSeries.s_color;
					aSeries.s_lineLinkable=true;
					aSeries.s_min=_min;
					aSeries.s_max=_max;
					aSeries.s_y_mark_cnt=option.y_mark_cnt;

					option.series.push(aSeries);
			}			
			chart14.redraw(option);
	};	
	function chart15(){
			//chart의 최소사이즈 height:150px;width:350px 로 설정했을때 최적환경
			var chart15 		= createChart('chart15');			
			var option 		= createOption(chart15,'chart15');						
				
			option.xunit					= '년';//툴팁에 표시되는 X값의단위
			option.unitLabel_Hori			= '[년도]';
			option.unitLabel_Verti			= '[감가율]';
			
			option.crossLineShow_hori		= false;//실시간선택라인 수평선 사용안함
	
			option.xrange_axis				= true;//x축이 범위형축
			option.xrange_axis_label_mapping= true;//범위형 x축에 해당범위값에 라벨을 맵핑해서 보여준다.
			option.xrange_axis_label_map    = {0:'A01',1:'A02',2:'K03',3:'Z04',4:'P05',5:'P06'};//범위형 x축에 해당범위값에 라벨을 맵핑해서 보여줄 대상 맵 오브젝트			

			////////////////////////////////////////////////////////////////////////////////////////////////////
			option.legendMaxCount			= 10;  //범례박스표시최대개수
			option.right_margin					= 6;//오른쪽여백 최소크기일땐 30셋팅할것 표준:40
			option.top_margin					= 16;//최소크기일땐 16셋팅할것 표준:40
			option.bottom_legend_box_height     = 24;//바닥여백 최소크기일땐 0셋팅할것 표준:30

			option.gridShowH					= true;
			option.gridShowV					= false;	
			////////////////////////////////////////////////////////////////////////////////////////////////////	
			option.chartTitle				= '';	
			option.legendPositionH			= 'right';
			/*
			option.chartTitleAlign			= 'left';	
			option.chartTitlePosition		= 'boxOut';				
			option.mainTitleFont			= '18px Arial';			
			

			option.legendPosition			= 'top';

			option.legendFont				= '12px Arial';				

			option.showTopBorder			= true;
			option.showRightBorder			= false;
			option.showLeftBorder			= false;

			option.showToolTipChartType		= false;
			option.tooltipFont				= '12px Arial';
			option.valueShow				= true;			
			option.valueShowFont			= '8px Arial';			
			*/	
			var _xmin =0;
			var _xmax =5;
			//var _min = 999999;//비율이므로 0%로 고정
			var _min = 0;
			//var _max = 1.3;	
			var _max = 1;
			//option.y_mark_cnt					= 4;
			option.min							= _min;
			option.max							= _max;
			option.xmin							= _xmin;
			option.xmax							= _xmax;	
			option.xrange_count             = (_xmax-_xmin);
			
			var seriesArr = data15;
			for(var g=0;g<seriesArr.length; g++){
				var data = chartUtil.formatData_profile2(seriesArr[g]);
				var _s_name = '';
				if(data['reArr'][0][3] != null){
					_s_name = data['reArr'][0][3];
				}
				var aSeries 	= createSeries(_s_name,'line',data);
				aSeries.s_unit	='';//툴팁에 표시될 Y값의단위
				aSeries.s_sizeDefault = 1;//점의 크기
				aSeries.s_shape='circle';//점의 모양
				aSeries.s_color='rgba('+lineColours[g]['red']+','+lineColours[g]['green']+','+lineColours[g]['blue']+',1)';//시리즈의 색상
				aSeries.s_lineType = lineStyles[g];
				aSeries.s_lineWidth = 1;
				aSeries.s_shapeColor = aSeries.s_color;
				aSeries.s_lineLinkable = true;
				aSeries.s_min = _min;
				aSeries.s_max = _max;
				//aSeries.s_y_mark_cnt=option.y_mark_cnt;

				option.series.push(aSeries);
			}			
			chart15.redraw(option);
	};

	function chart16(){
			var chartId = 'chart16';
			var chart16 = createChart(chartId);			
			var option = createOption(chart16,chartId);	

			option.type						= 'radial';

			

			option.yAxisCalcMethod			= 'manual';//min,max,mark_cnt를 자동계산하지않는다.!!!!
			option.y_mark_cnt				= 9;//눈금개수//option.yAxisCalcMethod			= 'manual';
			
			var series =
				 [
	 		 	    {
					s_name:'A상',
					s_data:data16,
			 	    s_color:'rgba(55,101,114,0.5)',
					s_lineWidth:'1',
					s_sizeMin:1,
					s_sizeDefault:1,
			 	    s_chartType:'radial',
					s_shape:'rectangle',
					s_shapeColor:'rgba(100,128,0,1)',
					s_min:-90,//option.yAxisCalcMethod			= 'manual';
					s_max:90,//option.yAxisCalcMethod			= 'manual';
			 	    s_unit:'건',
					s_draw:true,
					}	
					,
	 		 	    {
					s_name:'B상',
					s_data:data16_2,
			 	    s_color:'rgba(155,10,14,0.4)',
					s_lineWidth:'1',
					s_sizeMin:1,
					s_sizeDefault:1,
			 	    s_chartType:'radial',
					s_shape:'rectangle',
					s_shapeColor:'rgba(100,128,0,1)',
					s_min:-90,//option.yAxisCalcMethod			= 'manual';
					s_max:90,//option.yAxisCalcMethod			= 'manual';
			 	    s_unit:'건',
					s_draw:true,
					}					
				 ];
			option.series = series;
			chart16.redraw(option);
	};	
	function chart18(){
			var chartId = 'chart18';
			var chart18 = createChart(chartId);			
			var option = createOption(chart18,chartId);						
			option.xrange_axis				= false;//x축이 범위형축		
			option.xunit					= 'ºC';//툴팁에 표시되는 X값의단위
			option.unitLabel_Hori			= '온도';
			option.unitLabel_Verti			= 'Sales(In Usd)';
			option.chartTitle				= '[Sales Of Beer & Ice-cream]';	
			option.crossLineShow_hori		= false;//실시간선택라인 수평선 사용안함


			

			/* 1번 시리즈 [주의 : createSeries사용시 이름이 반드시 달라야함!!!]*///BAR가 간격을 잡아주므로 series구성시 line보다 반드시 먼저와야함.
			var aSeries1 	= createSeries('any sereis A','bar',data18_1_4);//3번,4번argu->max=null,min=null,divNum=null주면 동적으로 구함
			aSeries1.s_unit	='개';//툴팁에 표시될 Y값의단위
			aSeries1.s_sizeDefault = 1;//점의 크기
			aSeries1.s_shape='circle';//점의 모양
			aSeries1.s_color='rgba(100,128,0,1)';//시리즈의 색상, (0,128,192)색은 블루
			aSeries1.s_lineWidth=1;
			option.series.push(aSeries1);			
			

			
			chart18.redraw(option);
	};	
	function chart19(){
			/*
			var chartId = 'chart19';
			var chart19 = createChart(chartId);			
			var option = createOption(chart19,chartId);						

			var meanArr = [5000];
			var stdvArr = [2500];	
			//var InpValCnt = 9000;
			var InpValCnt = 1689;
			var seriesCnt = 1;			
			//var seriesArr = chartUtil.getNdData(meanArr,stdvArr,InpValCnt,seriesCnt);
			//console.dir(seriesArr);
			var arr = [[1,0.000941],[2,0.000959],[3,0.000978],[4,0.000998],[5,0.001017],[6,0.001037],[7,0.001058],[8,0.001079],[9,0.0011],[10,0.001121],[11,0.001143],[12,0.001165],[13,0.001188],[14,0.001211],[15,0.001235],[16,0.001258],[17,0.001283],[18,0.001307],[19,0.001333],[20,0.001358],[21,0.001384],[22,0.001411],[23,0.001438],[24,0.001465],[25,0.001493],[26,0.001521],[27,0.00155],[28,0.001579],[29,0.001609],[30,0.001639],[31,0.00167],[32,0.001702],[33,0.001734],[34,0.001766],[35,0.001799],[36,0.001832],[37,0.001866],[38,0.001901],[39,0.001936],[40,0.001972],[41,0.002008],[42,0.002045],[43,0.002083],[44,0.002121],[45,0.00216],[46,0.0022],[47,0.00224],[48,0.00228],[49,0.002322],[50,0.002364],[51,0.002407],[52,0.00245],[53,0.002494],[54,0.002539],[55,0.002585],[56,0.002631],[57,0.002678],[58,0.002726],[59,0.002774],[60,0.002824],[61,0.002874],[62,0.002925],[63,0.002976],[64,0.003029],[65,0.003082],[66,0.003136],[67,0.003191],[68,0.003247],[69,0.003303],[70,0.003361],[71,0.003419],[72,0.003479],[73,0.003539],[74,0.0036],[75,0.003662],[76,0.003725],[77,0.003789],[78,0.003854],[79,0.00392],[80,0.003987],[81,0.004055],[82,0.004123],[83,0.004193],[84,0.004264],[85,0.004336],[86,0.004409],[87,0.004483],[88,0.004559],[89,0.004635],[90,0.004712],[91,0.004791],[92,0.004871],[93,0.004951],[94,0.005033],[95,0.005117],[96,0.005201],[97,0.005287],[98,0.005373],[99,0.005461],[100,0.005551],[101,0.005641],[102,0.005733],[103,0.005826],[104,0.005921],[105,0.006016],[106,0.006113],[107,0.006212],[108,0.006312],[109,0.006413],[110,0.006515],[111,0.006619],[112,0.006725],[113,0.006831],[114,0.00694],[115,0.007049],[116,0.007161],[117,0.007273],[118,0.007388],[119,0.007503],[120,0.007621],[121,0.00774],[122,0.00786],[123,0.007982],[124,0.008106],[125,0.008231],[126,0.008358],[127,0.008487],[128,0.008617],[129,0.008749],[130,0.008883],[131,0.009018],[132,0.009155],[133,0.009294],[134,0.009435],[135,0.009577],[136,0.009722],[137,0.009868],[138,0.010016],[139,0.010166],[140,0.010317],[141,0.010471],[142,0.010627],[143,0.010784],[144,0.010944],[145,0.011105],[146,0.011268],[147,0.011434],[148,0.011601],[149,0.011771],[150,0.011942],[151,0.012116],[152,0.012291],[153,0.012469],[154,0.012649],[155,0.012831],[156,0.013015],[157,0.013202],[158,0.01339],[159,0.013581],[160,0.013774],[161,0.01397],[162,0.014167],[163,0.014367],[164,0.014569],[165,0.014774],[166,0.014981],[167,0.01519],[168,0.015402],[169,0.015616],[170,0.015832],[171,0.016051],[172,0.016272],[173,0.016496],[174,0.016723],[175,0.016951],[176,0.017183],[177,0.017417],[178,0.017653],[179,0.017892],[180,0.018134],[181,0.018378],[182,0.018625],[183,0.018875],[184,0.019127],[185,0.019382],[186,0.01964],[187,0.0199],[188,0.020163],[189,0.020429],[190,0.020698],[191,0.020969],[192,0.021244],[193,0.021521],[194,0.021801],[195,0.022084],[196,0.022369],[197,0.022658],[198,0.022949],[199,0.023244],[200,0.023541],[201,0.023842],[202,0.024145],[203,0.024452],[204,0.024761],[205,0.025074],[206,0.025389],[207,0.025708],[208,0.02603],[209,0.026355],[210,0.026682],[211,0.027014],[212,0.027348],[213,0.027685],[214,0.028026],[215,0.02837],[216,0.028717],[217,0.029067],[218,0.02942],[219,0.029777],[220,0.030137],[221,0.0305],[222,0.030867],[223,0.031237],[224,0.03161],[225,0.031986],[226,0.032366],[227,0.03275],[228,0.033136],[229,0.033526],[230,0.03392],[231,0.034317],[232,0.034717],[233,0.035121],[234,0.035528],[235,0.035939],[236,0.036353],[237,0.03677],[238,0.037191],[239,0.037616],[240,0.038044],[241,0.038476],[242,0.038911],[243,0.03935],[244,0.039792],[245,0.040238],[246,0.040687],[247,0.04114],[248,0.041597],[249,0.042057],[250,0.042521],[251,0.042988],[252,0.043459],[253,0.043934],[254,0.044412],[255,0.044894],[256,0.04538],[257,0.045869],[258,0.046362],[259,0.046858],[260,0.047359],[261,0.047862],[262,0.04837],[263,0.048881],[264,0.049396],[265,0.049915],[266,0.050437],[267,0.050963],[268,0.051492],[269,0.052025],[270,0.052562],[271,0.053103],[272,0.053647],[273,0.054195],[274,0.054747],[275,0.055302],[276,0.055861],[277,0.056424],[278,0.056991],[279,0.057561],[280,0.058134],[281,0.058712],[282,0.059293],[283,0.059877],[284,0.060466],[285,0.061058],[286,0.061653],[287,0.062253],[288,0.062856],[289,0.063462],[290,0.064072],[291,0.064686],[292,0.065303],[293,0.065924],[294,0.066549],[295,0.067177],[296,0.067808],[297,0.068444],[298,0.069082],[299,0.069724],[300,0.07037],[301,0.071019],[302,0.071672],[303,0.072328],[304,0.072988],[305,0.073651],[306,0.074317],[307,0.074987],[308,0.075661],[309,0.076337],[310,0.077017],[311,0.077701],[312,0.078387],[313,0.079077],[314,0.07977],[315,0.080467],[316,0.081167],[317,0.08187],[318,0.082576],[319,0.083285],[320,0.083998],[321,0.084713],[322,0.085432],[323,0.086154],[324,0.086879],[325,0.087607],[326,0.088338],[327,0.089072],[328,0.089808],[329,0.090548],[330,0.091291],[331,0.092037],[332,0.092785],[333,0.093536],[334,0.09429],[335,0.095047],[336,0.095806],[337,0.096569],[338,0.097333],[339,0.098101],[340,0.098871],[341,0.099644],[342,0.100419],[343,0.101196],[344,0.101976],[345,0.102759],[346,0.103544],[347,0.104331],[348,0.105121],[349,0.105912],[350,0.106706],[351,0.107503],[352,0.108301],[353,0.109101],[354,0.109904],[355,0.110709],[356,0.111515],[357,0.112324],[358,0.113134],[359,0.113946],[360,0.114761],[361,0.115576],[362,0.116394],[363,0.117213],[364,0.118034],[365,0.118857],[366,0.119681],[367,0.120506],[368,0.121333],[369,0.122162],[370,0.122992],[371,0.123823],[372,0.124655],[373,0.125489],[374,0.126323],[375,0.127159],[376,0.127996],[377,0.128834],[378,0.129673],[379,0.130512],[380,0.131353],[381,0.132194],[382,0.133036],[383,0.133879],[384,0.134722],[385,0.135566],[386,0.136411],[387,0.137256],[388,0.138101],[389,0.138947],[390,0.139792],[391,0.140639],[392,0.141485],[393,0.142331],[394,0.143178],[395,0.144024],[396,0.144871],[397,0.145717],[398,0.146563],[399,0.147409],[400,0.148255],[401,0.1491],[402,0.149945],[403,0.150789],[404,0.151633],[405,0.152476],[406,0.153318],[407,0.15416],[408,0.155001],[409,0.155841],[410,0.15668],[411,0.157518],[412,0.158355],[413,0.159191],[414,0.160026],[415,0.16086],[416,0.161692],[417,0.162523],[418,0.163352],[419,0.16418],[420,0.165006],[421,0.165831],[422,0.166654],[423,0.167475],[424,0.168294],[425,0.169112],[426,0.169927],[427,0.170741],[428,0.171552],[429,0.172361],[430,0.173168],[431,0.173973],[432,0.174775],[433,0.175574],[434,0.176372],[435,0.177166],[436,0.177958],[437,0.178748],[438,0.179534],[439,0.180318],[440,0.181099],[441,0.181876],[442,0.182651],[443,0.183423],[444,0.184191],[445,0.184956],[446,0.185718],[447,0.186477],[448,0.187232],[449,0.187983],[450,0.188731],[451,0.189475],[452,0.190216],[453,0.190953],[454,0.191686],[455,0.192414],[456,0.193139],[457,0.19386],[458,0.194577],[459,0.19529],[460,0.195998],[461,0.196702],[462,0.197402],[463,0.198097],[464,0.198788],[465,0.199474],[466,0.200156],[467,0.200833],[468,0.201505],[469,0.202172],[470,0.202835],[471,0.203492],[472,0.204144],[473,0.204792],[474,0.205434],[475,0.206071],[476,0.206703],[477,0.207329],[478,0.20795],[479,0.208566],[480,0.209176],[481,0.209781],[482,0.21038],[483,0.210973],[484,0.211561],[485,0.212142],[486,0.212718],[487,0.213288],[488,0.213853],[489,0.214411],[490,0.214963],[491,0.215509],[492,0.216048],[493,0.216582],[494,0.217109],[495,0.21763],[496,0.218144],[497,0.218653],[498,0.219154],[499,0.219649],[500,0.220138],[501,0.22062],[502,0.221095],[503,0.221563],[504,0.222025],[505,0.22248],[506,0.222928],[507,0.223369],[508,0.223803],[509,0.22423],[510,0.22465],[511,0.225063],[512,0.225469],[513,0.225868],[514,0.226259],[515,0.226643],[516,0.22702],[517,0.22739],[518,0.227752],[519,0.228107],[520,0.228454],[521,0.228794],[522,0.229127],[523,0.229452],[524,0.229769],[525,0.230079],[526,0.230381],[527,0.230675],[528,0.230962],[529,0.231241],[530,0.231512],[531,0.231775],[532,0.232031],[533,0.232278],[534,0.232518],[535,0.23275],[536,0.232974],[537,0.23319],[538,0.233398],[539,0.233599],[540,0.233791],[541,0.233975],[542,0.234151],[543,0.234319],[544,0.234479],[545,0.234631],[546,0.234774],[547,0.23491],[548,0.235037],[549,0.235156],[550,0.235268],[551,0.23537],[552,0.235465],[553,0.235552],[554,0.23563],[555,0.2357],[556,0.235762],[557,0.235816],[558,0.235861],[559,0.235898],[560,0.235927],[561,0.235948],[562,0.23596],[563,0.235964],[564,0.23596],[565,0.235948],[566,0.235927],[567,0.235898],[568,0.235861],[569,0.235816],[570,0.235762],[571,0.2357],[572,0.23563],[573,0.235552],[574,0.235465],[575,0.23537],[576,0.235268],[577,0.235156],[578,0.235037],[579,0.23491],[580,0.234774],[581,0.234631],[582,0.234479],[583,0.234319],[584,0.234151],[585,0.233975],[586,0.233791],[587,0.233599],[588,0.233398],[589,0.23319],[590,0.232974],[591,0.23275],[592,0.232518],[593,0.232278],[594,0.232031],[595,0.231775],[596,0.231512],[597,0.231241],[598,0.230962],[599,0.230675],[600,0.230381],[601,0.230079],[602,0.229769],[603,0.229452],[604,0.229127],[605,0.228794],[606,0.228454],[607,0.228107],[608,0.227752],[609,0.22739],[610,0.22702],[611,0.226643],[612,0.226259],[613,0.225868],[614,0.225469],[615,0.225063],[616,0.22465],[617,0.22423],[618,0.223803],[619,0.223369],[620,0.222928],[621,0.22248],[622,0.222025],[623,0.221563],[624,0.221095],[625,0.22062],[626,0.220138],[627,0.219649],[628,0.219154],[629,0.218653],[630,0.218144],[631,0.21763],[632,0.217109],[633,0.216582],[634,0.216048],[635,0.215509],[636,0.214963],[637,0.214411],[638,0.213853],[639,0.213288],[640,0.212718],[641,0.212142],[642,0.211561],[643,0.210973],[644,0.21038],[645,0.209781],[646,0.209176],[647,0.208566],[648,0.20795],[649,0.207329],[650,0.206703],[651,0.206071],[652,0.205434],[653,0.204792],[654,0.204144],[655,0.203492],[656,0.202835],[657,0.202172],[658,0.201505],[659,0.200833],[660,0.200156],[661,0.199474],[662,0.198788],[663,0.198097],[664,0.197402],[665,0.196702],[666,0.195998],[667,0.19529],[668,0.194577],[669,0.19386],[670,0.193139],[671,0.192414],[672,0.191686],[673,0.190953],[674,0.190216],[675,0.189475],[676,0.188731],[677,0.187983],[678,0.187232],[679,0.186477],[680,0.185718],[681,0.184956],[682,0.184191],[683,0.183423],[684,0.182651],[685,0.181876],[686,0.181099],[687,0.180318],[688,0.179534],[689,0.178748],[690,0.177958],[691,0.177166],[692,0.176372],[693,0.175574],[694,0.174775],[695,0.173973],[696,0.173168],[697,0.172361],[698,0.171552],[699,0.170741],[700,0.169927],[701,0.169112],[702,0.168294],[703,0.167475],[704,0.166654],[705,0.165831],[706,0.165006],[707,0.16418],[708,0.163352],[709,0.162523],[710,0.161692],[711,0.16086],[712,0.160026],[713,0.159191],[714,0.158355],[715,0.157518],[716,0.15668],[717,0.155841],[718,0.155001],[719,0.15416],[720,0.153318],[721,0.152476],[722,0.151633],[723,0.150789],[724,0.149945],[725,0.1491],[726,0.148255],[727,0.147409],[728,0.146563],[729,0.145717],[730,0.144871],[731,0.144024],[732,0.143178],[733,0.142331],[734,0.141485],[735,0.140639],[736,0.139792],[737,0.138947],[738,0.138101],[739,0.137256],[740,0.136411],[741,0.135566],[742,0.134722],[743,0.133879],[744,0.133036],[745,0.132194],[746,0.131353],[747,0.130512],[748,0.129673],[749,0.128834],[750,0.127996],[751,0.127159],[752,0.126323],[753,0.125489],[754,0.124655],[755,0.123823],[756,0.122992],[757,0.122162],[758,0.121333],[759,0.120506],[760,0.119681],[761,0.118857],[762,0.118034],[763,0.117213],[764,0.116394],[765,0.115576],[766,0.114761],[767,0.113946],[768,0.113134],[769,0.112324],[770,0.111515],[771,0.110709],[772,0.109904],[773,0.109101],[774,0.108301],[775,0.107503],[776,0.106706],[777,0.105912],[778,0.105121],[779,0.104331],[780,0.103544],[781,0.102759],[782,0.101976],[783,0.101196],[784,0.100419],[785,0.099644],[786,0.098871],[787,0.098101],[788,0.097333],[789,0.096569],[790,0.095806],[791,0.095047],[792,0.09429],[793,0.093536],[794,0.092785],[795,0.092037],[796,0.091291],[797,0.090548],[798,0.089808],[799,0.089072],[800,0.088338],[801,0.087607],[802,0.086879],[803,0.086154],[804,0.085432],[805,0.084713],[806,0.083998],[807,0.083285],[808,0.082576],[809,0.08187],[810,0.081167],[811,0.080467],[812,0.07977],[813,0.079077],[814,0.078387],[815,0.077701],[816,0.077017],[817,0.076337],[818,0.075661],[819,0.074987],[820,0.074317],[821,0.073651],[822,0.072988],[823,0.072328],[824,0.071672],[825,0.071019],[826,0.07037],[827,0.069724],[828,0.069082],[829,0.068444],[830,0.067808],[831,0.067177],[832,0.066549],[833,0.065924],[834,0.065303],[835,0.064686],[836,0.064072],[837,0.063462],[838,0.062856],[839,0.062253],[840,0.061653],[841,0.061058],[842,0.060466],[843,0.059877],[844,0.059293],[845,0.058712],[846,0.058134],[847,0.057561],[848,0.056991],[849,0.056424],[850,0.055861],[851,0.055302],[852,0.054747],[853,0.054195],[854,0.053647],[855,0.053103],[856,0.052562],[857,0.052025],[858,0.051492],[859,0.050963],[860,0.050437],[861,0.049915],[862,0.049396],[863,0.048881],[864,0.04837],[865,0.047862],[866,0.047359],[867,0.046858],[868,0.046362],[869,0.045869],[870,0.04538],[871,0.044894],[872,0.044412],[873,0.043934],[874,0.043459],[875,0.042988],[876,0.042521],[877,0.042057],[878,0.041597],[879,0.04114],[880,0.040687],[881,0.040238],[882,0.039792],[883,0.03935],[884,0.038911],[885,0.038476],[886,0.038044],[887,0.037616],[888,0.037191],[889,0.03677],[890,0.036353],[891,0.035939],[892,0.035528],[893,0.035121],[894,0.034717],[895,0.034317],[896,0.03392],[897,0.033526],[898,0.033136],[899,0.03275],[900,0.032366],[901,0.031986],[902,0.03161],[903,0.031237],[904,0.030867],[905,0.0305],[906,0.030137],[907,0.029777],[908,0.02942],[909,0.029067],[910,0.028717],[911,0.02837],[912,0.028026],[913,0.027685],[914,0.027348],[915,0.027014],[916,0.026682],[917,0.026355],[918,0.02603],[919,0.025708],[920,0.025389],[921,0.025074],[922,0.024761],[923,0.024452],[924,0.024145],[925,0.023842],[926,0.023541],[927,0.023244],[928,0.022949],[929,0.022658],[930,0.022369],[931,0.022084],[932,0.021801],[933,0.021521],[934,0.021244],[935,0.020969],[936,0.020698],[937,0.020429],[938,0.020163],[939,0.0199],[940,0.01964],[941,0.019382],[942,0.019127],[943,0.018875],[944,0.018625],[945,0.018378],[946,0.018134],[947,0.017892],[948,0.017653],[949,0.017417],[950,0.017183],[951,0.016951],[952,0.016723],[953,0.016496],[954,0.016272],[955,0.016051],[956,0.015832],[957,0.015616],[958,0.015402],[959,0.01519],[960,0.014981],[961,0.014774],[962,0.014569],[963,0.014367],[964,0.014167],[965,0.01397],[966,0.013774],[967,0.013581],[968,0.01339],[969,0.013202],[970,0.013015],[971,0.012831],[972,0.012649],[973,0.012469],[974,0.012291],[975,0.012116],[976,0.011942],[977,0.011771],[978,0.011601],[979,0.011434],[980,0.011268],[981,0.011105],[982,0.010944],[983,0.010784],[984,0.010627],[985,0.010471],[986,0.010317],[987,0.010166],[988,0.010016],[989,0.009868],[990,0.009722],[991,0.009577],[992,0.009435],[993,0.009294],[994,0.009155],[995,0.009018],[996,0.008883],[997,0.008749],[998,0.008617],[999,0.008487],[1000,0.008358],[1001,0.008231],[1002,0.008106],[1003,0.007982],[1004,0.00786],[1005,0.00774],[1006,0.007621],[1007,0.007503],[1008,0.007388],[1009,0.007273],[1010,0.007161],[1011,0.007049],[1012,0.00694],[1013,0.006831],[1014,0.006725],[1015,0.006619],[1016,0.006515],[1017,0.006413],[1018,0.006312],[1019,0.006212],[1020,0.006113],[1021,0.006016],[1022,0.005921],[1023,0.005826],[1024,0.005733],[1025,0.005641],[1026,0.005551],[1027,0.005461],[1028,0.005373],[1029,0.005287],[1030,0.005201],[1031,0.005117],[1032,0.005033],[1033,0.004951],[1034,0.004871],[1035,0.004791],[1036,0.004712],[1037,0.004635],[1038,0.004559],[1039,0.004483],[1040,0.004409],[1041,0.004336],[1042,0.004264],[1043,0.004193],[1044,0.004123],[1045,0.004055],[1046,0.003987],[1047,0.00392],[1048,0.003854],[1049,0.003789],[1050,0.003725],[1051,0.003662],[1052,0.0036],[1053,0.003539],[1054,0.003479],[1055,0.003419],[1056,0.003361],[1057,0.003303],[1058,0.003247],[1059,0.003191],[1060,0.003136],[1061,0.003082],[1062,0.003029],[1063,0.002976],[1064,0.002925],[1065,0.002874],[1066,0.002824],[1067,0.002774],[1068,0.002726],[1069,0.002678],[1070,0.002631],[1071,0.002585],[1072,0.002539],[1073,0.002494],[1074,0.00245],[1075,0.002407],[1076,0.002364],[1077,0.002322],[1078,0.00228],[1079,0.00224],[1080,0.0022],[1081,0.00216],[1082,0.002121],[1083,0.002083],[1084,0.002045],[1085,0.002008],[1086,0.001972],[1087,0.001936],[1088,0.001901],[1089,0.001866],[1090,0.001832],[1091,0.001799],[1092,0.001766],[1093,0.001734],[1094,0.001702],[1095,0.00167],[1096,0.001639],[1097,0.001609],[1098,0.001579],[1099,0.00155],[1100,0.001521],[1101,0.001493],[1102,0.001465],[1103,0.001438],[1104,0.001411],[1105,0.001384],[1106,0.001358],[1107,0.001333],[1108,0.001307],[1109,0.001283],[1110,0.001258],[1111,0.001235],[1112,0.001211],[1113,0.001188],[1114,0.001165],[1115,0.001143],[1116,0.001121],[1117,0.0011],[1118,0.001079],[1119,0.001058],[1120,0.001037],[1121,0.001017],[1122,0.000998],[1123,0.000978],[1124,0.000959],[1125,0.000941],[1126,0.000922],[1127,0.000904],[1128,0.000887],[1129,0.000869],[1130,0.000852],[1131,0.000836],[1132,0.000819],[1133,0.000803],[1134,0.000787],[1135,0.000771],[1136,0.000756],[1137,0.000741],[1138,0.000726],[1139,0.000712],[1140,0.000698],[1141,0.000684],[1142,0.00067],[1143,0.000657],[1144,0.000643],[1145,0.00063],[1146,0.000618],[1147,0.000605],[1148,0.000593],[1149,0.000581],[1150,0.000569],[1151,0.000558],[1152,0.000546],[1153,0.000535],[1154,0.000524],[1155,0.000513],[1156,0.000503],[1157,0.000493],[1158,0.000482],[1159,0.000472],[1160,0.000463],[1161,0.000453],[1162,0.000444],[1163,0.000435],[1164,0.000426],[1165,0.000417],[1166,0.000408],[1167,0.000399],[1168,0.000391],[1169,0.000383],[1170,0.000375],[1171,0.000367],[1172,0.000359],[1173,0.000352],[1174,0.000344],[1175,0.000337],[1176,0.00033],[1177,0.000323],[1178,0.000316],[1179,0.000309],[1180,0.000303],[1181,0.000296],[1182,0.00029],[1183,0.000284],[1184,0.000277],[1185,0.000272],[1186,0.000266],[1187,0.00026],[1188,0.000254],[1189,0.000249],[1190,0.000243],[1191,0.000238],[1192,0.000233],[1193,0.000228],[1194,0.000223],[1195,0.000218],[1196,0.000213],[1197,0.000209],[1198,0.000204],[1199,0.0002],[1200,0.000195],[1201,0.000191],[1202,0.000187],[1203,0.000182],[1204,0.000178],[1205,0.000174],[1206,0.000171],[1207,0.000167],[1208,0.000163],[1209,0.000159],[1210,0.000156],[1211,0.000152],[1212,0.000149],[1213,0.000146],[1214,0.000142],[1215,0.000139],[1216,0.000136],[1217,0.000133],[1218,0.00013],[1219,0.000127],[1220,0.000124],[1221,0.000121],[1222,0.000119],[1223,0.000116],[1224,0.000113],[1225,0.000111],[1226,0.000108],[1227,0.000106],[1228,0.000103],[1229,0.000101],[1230,0.000098],[1231,0.000096],[1232,0.000094],[1233,0.000092],[1234,0.00009],[1235,0.000088],[1236,0.000086],[1237,0.000084],[1238,0.000082],[1239,0.00008],[1240,0.000078],[1241,0.000076],[1242,0.000074],[1243,0.000072],[1244,0.000071],[1245,0.000069],[1246,0.000067],[1247,0.000066],[1248,0.000064],[1249,0.000063],[1250,0.000061],[1251,0.00006],[1252,0.000058],[1253,0.000057],[1254,0.000056],[1255,0.000054],[1256,0.000053],[1257,0.000052],[1258,0.000051],[1259,0.000049],[1260,0.000048],[1261,0.000047],[1262,0.000046],[1263,0.000045],[1264,0.000044],[1265,0.000043],[1266,0.000042],[1267,0.000041],[1268,0.00004],[1269,0.000039],[1270,0.000038],[1271,0.000037],[1272,0.000036],[1273,0.000035],[1274,0.000034],[1275,0.000033],[1276,0.000032],[1277,0.000032],[1278,0.000031],[1279,0.00003],[1280,0.000029],[1281,0.000029],[1282,0.000028],[1283,0.000027],[1284,0.000027],[1285,0.000026],[1286,0.000025],[1287,0.000025],[1288,0.000024],[1289,0.000023],[1290,0.000023],[1291,0.000022],[1292,0.000022],[1293,0.000021],[1294,0.000021],[1295,0.00002],[1296,0.00002],[1297,0.000019],[1298,0.000019],[1299,0.000018],[1300,0.000018],[1301,0.000017],[1302,0.000017],[1303,0.000016],[1304,0.000016],[1305,0.000016],[1306,0.000015],[1307,0.000015],[1308,0.000014],[1309,0.000014],[1310,0.000014],[1311,0.000013],[1312,0.000013],[1313,0.000013],[1314,0.000012],[1315,0.000012],[1316,0.000012],[1317,0.000011],[1318,0.000011],[1319,0.000011],[1320,0.00001],[1321,0.00001],[1322,0.00001],[1323,0.00001],[1324,0.000009],[1325,0.000009],[1326,0.000009],[1327,0.000009],[1328,0.000008],[1329,0.000008],[1330,0.000008],[1331,0.000008],[1332,0.000008],[1333,0.000007],[1334,0.000007],[1335,0.000007],[1336,0.000007],[1337,0.000007],[1338,0.000006],[1339,0.000006],[1340,0.000006],[1341,0.000006],[1342,0.000006],[1343,0.000006],[1344,0.000005],[1345,0.000005],[1346,0.000005],[1347,0.000005],[1348,0.000005],[1349,0.000005],[1350,0.000005],[1351,0.000005],[1352,0.000004],[1353,0.000004],[1354,0.000004],[1355,0.000004],[1356,0.000004],[1357,0.000004],[1358,0.000004],[1359,0.000004],[1360,0.000004],[1361,0.000003],[1362,0.000003],[1363,0.000003],[1364,0.000003],[1365,0.000003],[1366,0.000003],[1367,0.000003],[1368,0.000003],[1369,0.000003],[1370,0.000003],[1371,0.000003],[1372,0.000003],[1373,0.000002],[1374,0.000002],[1375,0.000002],[1376,0.000002],[1377,0.000002],[1378,0.000002],[1379,0.000002],[1380,0.000002],[1381,0.000002],[1382,0.000002],[1383,0.000002],[1384,0.000002],[1385,0.000002],[1386,0.000002],[1387,0.000002],[1388,0.000002],[1389,0.000002],[1390,0.000002],[1391,0.000001],[1392,0.000001],[1393,0.000001],[1394,0.000001],[1395,0.000001],[1396,0.000001],[1397,0.000001],[1398,0.000001],[1399,0.000001],[1400,0.000001],[1401,0.000001],[1402,0.000001],[1403,0.000001],[1404,0.000001],[1405,0.000001],[1406,0.000001],[1407,0.000001],[1408,0.000001],[1409,0.000001],[1410,0.000001],[1411,0.000001],[1412,0.000001],[1413,0.000001],[1414,0.000001],[1415,0.000001],[1416,0.000001],[1417,0.000001],[1418,0.000001],[1419,0.000001],[1420,0.000001],[1421,0.000001],[1422,0.000001],[1423,0.000001],[1424,0.000001],[1425,0.000001],[1426,0.000001],[1427,0.000001],[1428,0],[1429,0],[1430,0],[1431,0],[1432,0],[1433,0],[1434,0],[1435,0],[1436,0],[1437,0],[1438,0],[1439,0],[1440,0],[1441,0],[1442,0],[1443,0],[1444,0],[1445,0],[1446,0],[1447,0],[1448,0],[1449,0],[1450,0],[1451,0],[1452,0],[1453,0],[1454,0],[1455,0],[1456,0],[1457,0],[1458,0],[1459,0],[1460,0],[1461,0],[1462,0],[1463,0],[1464,0],[1465,0],[1466,0],[1467,0],[1468,0],[1469,0],[1470,0],[1471,0],[1472,0],[1473,0],[1474,0],[1475,0],[1476,0],[1477,0],[1478,0],[1479,0],[1480,0],[1481,0],[1482,0],[1483,0],[1484,0],[1485,0],[1486,0],[1487,0],[1488,0],[1489,0],[1490,0],[1491,0],[1492,0],[1493,0],[1494,0],[1495,0],[1496,0],[1497,0],[1498,0],[1499,0],[1500,0],[1501,0],[1502,0],[1503,0],[1504,0],[1505,0],[1506,0],[1507,0],[1508,0],[1509,0],[1510,0],[1511,0],[1512,0],[1513,0],[1514,0],[1515,0],[1516,0],[1517,0],[1518,0],[1519,0],[1520,0],[1521,0],[1522,0],[1523,0],[1524,0],[1525,0],[1526,0],[1527,0],[1528,0],[1529,0],[1530,0],[1531,0],[1532,0],[1533,0],[1534,0],[1535,0],[1536,0],[1537,0],[1538,0],[1539,0],[1540,0],[1541,0],[1542,0],[1543,0],[1544,0],[1545,0],[1546,0],[1547,0],[1548,0],[1549,0],[1550,0],[1551,0],[1552,0],[1553,0],[1554,0],[1555,0],[1556,0],[1557,0],[1558,0],[1559,0],[1560,0],[1561,0],[1562,0],[1563,0],[1564,0],[1565,0],[1566,0],[1567,0],[1568,0],[1569,0],[1570,0],[1571,0],[1572,0],[1573,0],[1574,0],[1575,0],[1576,0],[1577,0],[1578,0],[1579,0],[1580,0],[1581,0],[1582,0],[1583,0],[1584,0],[1585,0],[1586,0],[1587,0],[1588,0],[1589,0],[1590,0],[1591,0],[1592,0],[1593,0],[1594,0],[1595,0],[1596,0],[1597,0],[1598,0],[1599,0],[1600,0],[1601,0],[1602,0],[1603,0],[1604,0],[1605,0],[1606,0],[1607,0],[1608,0],[1609,0],[1610,0],[1611,0],[1612,0],[1613,0],[1614,0],[1615,0],[1616,0],[1617,0],[1618,0],[1619,0],[1620,0],[1621,0],[1622,0],[1623,0],[1624,0],[1625,0],[1626,0],[1627,0],[1628,0],[1629,0],[1630,0],[1631,0],[1632,0],[1633,0],[1634,0],[1635,0],[1636,0],[1637,0],[1638,0],[1639,0],[1640,0],[1641,0],[1642,0],[1643,0],[1644,0],[1645,0],[1646,0],[1647,0],[1648,0],[1649,0],[1650,0],[1651,0],[1652,0],[1653,0],[1654,0],[1655,0],[1656,0],[1657,0],[1658,0],[1659,0],[1660,0],[1661,0],[1662,0],[1663,0],[1664,0],[1665,0],[1666,0],[1667,0],[1668,0],[1669,0],[1670,0],[1671,0],[1672,0],[1673,0],[1674,0],[1675,0],[1676,0],[1677,0],[1678,0],[1679,0],[1680,0],[1681,0],[1682,0],[1683,0],[1684,0],[1685,0],[1686,0],[1687,0],[1688,0],[1689,0]];
			option.minmaxset =  true;
			option.min = 0;
			option.xmin						= 0;//x축이 범위형축으로 구성될때 x축의 최소값
			option.xmax						= InpValCnt;//x축이 범위형축으로 구성될때 x축의 최대값
			option.xunit					= 'km';//툴팁에 표시되는 X값의단위
			option.unitLabel_Hori			= '높이';
			option.unitLabel_Verti			= '온도';
			option.crossLineShow			= true;//수직선
			option.crossLineShow_hori		= true;//실시간선택라인 수평선 사용안함
			option.rpTooltipUse				= true;			
			option.chartTitle				= 'Sales Of Beer';
			option.toFixedY					= 2;
			//var aSeries 	= createSeries('any sereis1','ndSpline',chartUtil.formatData_profile2(seriesArr[0],false,0.00016,0,4));//3번,4번param->max=null,min=null주면 동적으로 구함
			var o = chartUtil.formatData_profile2(arr,false,null,null,null);
			console.dir(o);
			var aSeries 	= createSeries('any sereis1','ndSpline',chartUtil.formatData_profile2(arr,false,null,null,null));//3번,4번param->max=null,min=null주면 동적으로 구함
			aSeries.s_unit	='개';//툴팁에 표시될 Y값의단위
			aSeries.s_sizeDefault = 1;//점의 크기
			aSeries.s_shape='rect';//점의 모양
			aSeries.s_color='rgba(0,128,192,1)';//시리즈의 색상, (0,128,192)색은 블루
			option.series.push(aSeries);
						
			chart19.redraw(option);
			*/
			var arr = [[1,0.000941],[2,0.000959],[3,0.000978],[4,0.000998],[5,0.001017],[6,0.001037],[7,0.001058],[8,0.001079],[9,0.0011],[10,0.001121],[11,0.001143],[12,0.001165],[13,0.001188],[14,0.001211],[15,0.001235],[16,0.001258],[17,0.001283],[18,0.001307],[19,0.001333],[20,0.001358],[21,0.001384],[22,0.001411],[23,0.001438],[24,0.001465],[25,0.001493],[26,0.001521],[27,0.00155],[28,0.001579],[29,0.001609],[30,0.001639],[31,0.00167],[32,0.001702],[33,0.001734],[34,0.001766],[35,0.001799],[36,0.001832],[37,0.001866],[38,0.001901],[39,0.001936],[40,0.001972],[41,0.002008],[42,0.002045],[43,0.002083],[44,0.002121],[45,0.00216],[46,0.0022],[47,0.00224],[48,0.00228],[49,0.002322],[50,0.002364],[51,0.002407],[52,0.00245],[53,0.002494],[54,0.002539],[55,0.002585],[56,0.002631],[57,0.002678],[58,0.002726],[59,0.002774],[60,0.002824],[61,0.002874],[62,0.002925],[63,0.002976],[64,0.003029],[65,0.003082],[66,0.003136],[67,0.003191],[68,0.003247],[69,0.003303],[70,0.003361],[71,0.003419],[72,0.003479],[73,0.003539],[74,0.0036],[75,0.003662],[76,0.003725],[77,0.003789],[78,0.003854],[79,0.00392],[80,0.003987],[81,0.004055],[82,0.004123],[83,0.004193],[84,0.004264],[85,0.004336],[86,0.004409],[87,0.004483],[88,0.004559],[89,0.004635],[90,0.004712],[91,0.004791],[92,0.004871],[93,0.004951],[94,0.005033],[95,0.005117],[96,0.005201],[97,0.005287],[98,0.005373],[99,0.005461],[100,0.005551],[101,0.005641],[102,0.005733],[103,0.005826],[104,0.005921],[105,0.006016],[106,0.006113],[107,0.006212],[108,0.006312],[109,0.006413],[110,0.006515],[111,0.006619],[112,0.006725],[113,0.006831],[114,0.00694],[115,0.007049],[116,0.007161],[117,0.007273],[118,0.007388],[119,0.007503],[120,0.007621],[121,0.00774],[122,0.00786],[123,0.007982],[124,0.008106],[125,0.008231],[126,0.008358],[127,0.008487],[128,0.008617],[129,0.008749],[130,0.008883],[131,0.009018],[132,0.009155],[133,0.009294],[134,0.009435],[135,0.009577],[136,0.009722],[137,0.009868],[138,0.010016],[139,0.010166],[140,0.010317],[141,0.010471],[142,0.010627],[143,0.010784],[144,0.010944],[145,0.011105],[146,0.011268],[147,0.011434],[148,0.011601],[149,0.011771],[150,0.011942],[151,0.012116],[152,0.012291],[153,0.012469],[154,0.012649],[155,0.012831],[156,0.013015],[157,0.013202],[158,0.01339],[159,0.013581],[160,0.013774],[161,0.01397],[162,0.014167],[163,0.014367],[164,0.014569],[165,0.014774],[166,0.014981],[167,0.01519],[168,0.015402],[169,0.015616],[170,0.015832],[171,0.016051],[172,0.016272],[173,0.016496],[174,0.016723],[175,0.016951],[176,0.017183],[177,0.017417],[178,0.017653],[179,0.017892],[180,0.018134],[181,0.018378],[182,0.018625],[183,0.018875],[184,0.019127],[185,0.019382],[186,0.01964],[187,0.0199],[188,0.020163],[189,0.020429],[190,0.020698],[191,0.020969],[192,0.021244],[193,0.021521],[194,0.021801],[195,0.022084],[196,0.022369],[197,0.022658],[198,0.022949],[199,0.023244],[200,0.023541],[201,0.023842],[202,0.024145],[203,0.024452],[204,0.024761],[205,0.025074],[206,0.025389],[207,0.025708],[208,0.02603],[209,0.026355],[210,0.026682],[211,0.027014],[212,0.027348],[213,0.027685],[214,0.028026],[215,0.02837],[216,0.028717],[217,0.029067],[218,0.02942],[219,0.029777],[220,0.030137],[221,0.0305],[222,0.030867],[223,0.031237],[224,0.03161],[225,0.031986],[226,0.032366],[227,0.03275],[228,0.033136],[229,0.033526],[230,0.03392],[231,0.034317],[232,0.034717],[233,0.035121],[234,0.035528],[235,0.035939],[236,0.036353],[237,0.03677],[238,0.037191],[239,0.037616],[240,0.038044],[241,0.038476],[242,0.038911],[243,0.03935],[244,0.039792],[245,0.040238],[246,0.040687],[247,0.04114],[248,0.041597],[249,0.042057],[250,0.042521],[251,0.042988],[252,0.043459],[253,0.043934],[254,0.044412],[255,0.044894],[256,0.04538],[257,0.045869],[258,0.046362],[259,0.046858],[260,0.047359],[261,0.047862],[262,0.04837],[263,0.048881],[264,0.049396],[265,0.049915],[266,0.050437],[267,0.050963],[268,0.051492],[269,0.052025],[270,0.052562],[271,0.053103],[272,0.053647],[273,0.054195],[274,0.054747],[275,0.055302],[276,0.055861],[277,0.056424],[278,0.056991],[279,0.057561],[280,0.058134],[281,0.058712],[282,0.059293],[283,0.059877],[284,0.060466],[285,0.061058],[286,0.061653],[287,0.062253],[288,0.062856],[289,0.063462],[290,0.064072],[291,0.064686],[292,0.065303],[293,0.065924],[294,0.066549],[295,0.067177],[296,0.067808],[297,0.068444],[298,0.069082],[299,0.069724],[300,0.07037],[301,0.071019],[302,0.071672],[303,0.072328],[304,0.072988],[305,0.073651],[306,0.074317],[307,0.074987],[308,0.075661],[309,0.076337],[310,0.077017],[311,0.077701],[312,0.078387],[313,0.079077],[314,0.07977],[315,0.080467],[316,0.081167],[317,0.08187],[318,0.082576],[319,0.083285],[320,0.083998],[321,0.084713],[322,0.085432],[323,0.086154],[324,0.086879],[325,0.087607],[326,0.088338],[327,0.089072],[328,0.089808],[329,0.090548],[330,0.091291],[331,0.092037],[332,0.092785],[333,0.093536],[334,0.09429],[335,0.095047],[336,0.095806],[337,0.096569],[338,0.097333],[339,0.098101],[340,0.098871],[341,0.099644],[342,0.100419],[343,0.101196],[344,0.101976],[345,0.102759],[346,0.103544],[347,0.104331],[348,0.105121],[349,0.105912],[350,0.106706],[351,0.107503],[352,0.108301],[353,0.109101],[354,0.109904],[355,0.110709],[356,0.111515],[357,0.112324],[358,0.113134],[359,0.113946],[360,0.114761],[361,0.115576],[362,0.116394],[363,0.117213],[364,0.118034],[365,0.118857],[366,0.119681],[367,0.120506],[368,0.121333],[369,0.122162],[370,0.122992],[371,0.123823],[372,0.124655],[373,0.125489],[374,0.126323],[375,0.127159],[376,0.127996],[377,0.128834],[378,0.129673],[379,0.130512],[380,0.131353],[381,0.132194],[382,0.133036],[383,0.133879],[384,0.134722],[385,0.135566],[386,0.136411],[387,0.137256],[388,0.138101],[389,0.138947],[390,0.139792],[391,0.140639],[392,0.141485],[393,0.142331],[394,0.143178],[395,0.144024],[396,0.144871],[397,0.145717],[398,0.146563],[399,0.147409],[400,0.148255],[401,0.1491],[402,0.149945],[403,0.150789],[404,0.151633],[405,0.152476],[406,0.153318],[407,0.15416],[408,0.155001],[409,0.155841],[410,0.15668],[411,0.157518],[412,0.158355],[413,0.159191],[414,0.160026],[415,0.16086],[416,0.161692],[417,0.162523],[418,0.163352],[419,0.16418],[420,0.165006],[421,0.165831],[422,0.166654],[423,0.167475],[424,0.168294],[425,0.169112],[426,0.169927],[427,0.170741],[428,0.171552],[429,0.172361],[430,0.173168],[431,0.173973],[432,0.174775],[433,0.175574],[434,0.176372],[435,0.177166],[436,0.177958],[437,0.178748],[438,0.179534],[439,0.180318],[440,0.181099],[441,0.181876],[442,0.182651],[443,0.183423],[444,0.184191],[445,0.184956],[446,0.185718],[447,0.186477],[448,0.187232],[449,0.187983],[450,0.188731],[451,0.189475],[452,0.190216],[453,0.190953],[454,0.191686],[455,0.192414],[456,0.193139],[457,0.19386],[458,0.194577],[459,0.19529],[460,0.195998],[461,0.196702],[462,0.197402],[463,0.198097],[464,0.198788],[465,0.199474],[466,0.200156],[467,0.200833],[468,0.201505],[469,0.202172],[470,0.202835],[471,0.203492],[472,0.204144],[473,0.204792],[474,0.205434],[475,0.206071],[476,0.206703],[477,0.207329],[478,0.20795],[479,0.208566],[480,0.209176],[481,0.209781],[482,0.21038],[483,0.210973],[484,0.211561],[485,0.212142],[486,0.212718],[487,0.213288],[488,0.213853],[489,0.214411],[490,0.214963],[491,0.215509],[492,0.216048],[493,0.216582],[494,0.217109],[495,0.21763],[496,0.218144],[497,0.218653],[498,0.219154],[499,0.219649],[500,0.220138],[501,0.22062],[502,0.221095],[503,0.221563],[504,0.222025],[505,0.22248],[506,0.222928],[507,0.223369],[508,0.223803],[509,0.22423],[510,0.22465],[511,0.225063],[512,0.225469],[513,0.225868],[514,0.226259],[515,0.226643],[516,0.22702],[517,0.22739],[518,0.227752],[519,0.228107],[520,0.228454],[521,0.228794],[522,0.229127],[523,0.229452],[524,0.229769],[525,0.230079],[526,0.230381],[527,0.230675],[528,0.230962],[529,0.231241],[530,0.231512],[531,0.231775],[532,0.232031],[533,0.232278],[534,0.232518],[535,0.23275],[536,0.232974],[537,0.23319],[538,0.233398],[539,0.233599],[540,0.233791],[541,0.233975],[542,0.234151],[543,0.234319],[544,0.234479],[545,0.234631],[546,0.234774],[547,0.23491],[548,0.235037],[549,0.235156],[550,0.235268],[551,0.23537],[552,0.235465],[553,0.235552],[554,0.23563],[555,0.2357],[556,0.235762],[557,0.235816],[558,0.235861],[559,0.235898],[560,0.235927],[561,0.235948],[562,0.23596],[563,0.235964],[564,0.23596],[565,0.235948],[566,0.235927],[567,0.235898],[568,0.235861],[569,0.235816],[570,0.235762],[571,0.2357],[572,0.23563],[573,0.235552],[574,0.235465],[575,0.23537],[576,0.235268],[577,0.235156],[578,0.235037],[579,0.23491],[580,0.234774],[581,0.234631],[582,0.234479],[583,0.234319],[584,0.234151],[585,0.233975],[586,0.233791],[587,0.233599],[588,0.233398],[589,0.23319],[590,0.232974],[591,0.23275],[592,0.232518],[593,0.232278],[594,0.232031],[595,0.231775],[596,0.231512],[597,0.231241],[598,0.230962],[599,0.230675],[600,0.230381],[601,0.230079],[602,0.229769],[603,0.229452],[604,0.229127],[605,0.228794],[606,0.228454],[607,0.228107],[608,0.227752],[609,0.22739],[610,0.22702],[611,0.226643],[612,0.226259],[613,0.225868],[614,0.225469],[615,0.225063],[616,0.22465],[617,0.22423],[618,0.223803],[619,0.223369],[620,0.222928],[621,0.22248],[622,0.222025],[623,0.221563],[624,0.221095],[625,0.22062],[626,0.220138],[627,0.219649],[628,0.219154],[629,0.218653],[630,0.218144],[631,0.21763],[632,0.217109],[633,0.216582],[634,0.216048],[635,0.215509],[636,0.214963],[637,0.214411],[638,0.213853],[639,0.213288],[640,0.212718],[641,0.212142],[642,0.211561],[643,0.210973],[644,0.21038],[645,0.209781],[646,0.209176],[647,0.208566],[648,0.20795],[649,0.207329],[650,0.206703],[651,0.206071],[652,0.205434],[653,0.204792],[654,0.204144],[655,0.203492],[656,0.202835],[657,0.202172],[658,0.201505],[659,0.200833],[660,0.200156],[661,0.199474],[662,0.198788],[663,0.198097],[664,0.197402],[665,0.196702],[666,0.195998],[667,0.19529],[668,0.194577],[669,0.19386],[670,0.193139],[671,0.192414],[672,0.191686],[673,0.190953],[674,0.190216],[675,0.189475],[676,0.188731],[677,0.187983],[678,0.187232],[679,0.186477],[680,0.185718],[681,0.184956],[682,0.184191],[683,0.183423],[684,0.182651],[685,0.181876],[686,0.181099],[687,0.180318],[688,0.179534],[689,0.178748],[690,0.177958],[691,0.177166],[692,0.176372],[693,0.175574],[694,0.174775],[695,0.173973],[696,0.173168],[697,0.172361],[698,0.171552],[699,0.170741],[700,0.169927],[701,0.169112],[702,0.168294],[703,0.167475],[704,0.166654],[705,0.165831],[706,0.165006],[707,0.16418],[708,0.163352],[709,0.162523],[710,0.161692],[711,0.16086],[712,0.160026],[713,0.159191],[714,0.158355],[715,0.157518],[716,0.15668],[717,0.155841],[718,0.155001],[719,0.15416],[720,0.153318],[721,0.152476],[722,0.151633],[723,0.150789],[724,0.149945],[725,0.1491],[726,0.148255],[727,0.147409],[728,0.146563],[729,0.145717],[730,0.144871],[731,0.144024],[732,0.143178],[733,0.142331],[734,0.141485],[735,0.140639],[736,0.139792],[737,0.138947],[738,0.138101],[739,0.137256],[740,0.136411],[741,0.135566],[742,0.134722],[743,0.133879],[744,0.133036],[745,0.132194],[746,0.131353],[747,0.130512],[748,0.129673],[749,0.128834],[750,0.127996],[751,0.127159],[752,0.126323],[753,0.125489],[754,0.124655],[755,0.123823],[756,0.122992],[757,0.122162],[758,0.121333],[759,0.120506],[760,0.119681],[761,0.118857],[762,0.118034],[763,0.117213],[764,0.116394],[765,0.115576],[766,0.114761],[767,0.113946],[768,0.113134],[769,0.112324],[770,0.111515],[771,0.110709],[772,0.109904],[773,0.109101],[774,0.108301],[775,0.107503],[776,0.106706],[777,0.105912],[778,0.105121],[779,0.104331],[780,0.103544],[781,0.102759],[782,0.101976],[783,0.101196],[784,0.100419],[785,0.099644],[786,0.098871],[787,0.098101],[788,0.097333],[789,0.096569],[790,0.095806],[791,0.095047],[792,0.09429],[793,0.093536],[794,0.092785],[795,0.092037],[796,0.091291],[797,0.090548],[798,0.089808],[799,0.089072],[800,0.088338],[801,0.087607],[802,0.086879],[803,0.086154],[804,0.085432],[805,0.084713],[806,0.083998],[807,0.083285],[808,0.082576],[809,0.08187],[810,0.081167],[811,0.080467],[812,0.07977],[813,0.079077],[814,0.078387],[815,0.077701],[816,0.077017],[817,0.076337],[818,0.075661],[819,0.074987],[820,0.074317],[821,0.073651],[822,0.072988],[823,0.072328],[824,0.071672],[825,0.071019],[826,0.07037],[827,0.069724],[828,0.069082],[829,0.068444],[830,0.067808],[831,0.067177],[832,0.066549],[833,0.065924],[834,0.065303],[835,0.064686],[836,0.064072],[837,0.063462],[838,0.062856],[839,0.062253],[840,0.061653],[841,0.061058],[842,0.060466],[843,0.059877],[844,0.059293],[845,0.058712],[846,0.058134],[847,0.057561],[848,0.056991],[849,0.056424],[850,0.055861],[851,0.055302],[852,0.054747],[853,0.054195],[854,0.053647],[855,0.053103],[856,0.052562],[857,0.052025],[858,0.051492],[859,0.050963],[860,0.050437],[861,0.049915],[862,0.049396],[863,0.048881],[864,0.04837],[865,0.047862],[866,0.047359],[867,0.046858],[868,0.046362],[869,0.045869],[870,0.04538],[871,0.044894],[872,0.044412],[873,0.043934],[874,0.043459],[875,0.042988],[876,0.042521],[877,0.042057],[878,0.041597],[879,0.04114],[880,0.040687],[881,0.040238],[882,0.039792],[883,0.03935],[884,0.038911],[885,0.038476],[886,0.038044],[887,0.037616],[888,0.037191],[889,0.03677],[890,0.036353],[891,0.035939],[892,0.035528],[893,0.035121],[894,0.034717],[895,0.034317],[896,0.03392],[897,0.033526],[898,0.033136],[899,0.03275],[900,0.032366],[901,0.031986],[902,0.03161],[903,0.031237],[904,0.030867],[905,0.0305],[906,0.030137],[907,0.029777],[908,0.02942],[909,0.029067],[910,0.028717],[911,0.02837],[912,0.028026],[913,0.027685],[914,0.027348],[915,0.027014],[916,0.026682],[917,0.026355],[918,0.02603],[919,0.025708],[920,0.025389],[921,0.025074],[922,0.024761],[923,0.024452],[924,0.024145],[925,0.023842],[926,0.023541],[927,0.023244],[928,0.022949],[929,0.022658],[930,0.022369],[931,0.022084],[932,0.021801],[933,0.021521],[934,0.021244],[935,0.020969],[936,0.020698],[937,0.020429],[938,0.020163],[939,0.0199],[940,0.01964],[941,0.019382],[942,0.019127],[943,0.018875],[944,0.018625],[945,0.018378],[946,0.018134],[947,0.017892],[948,0.017653],[949,0.017417],[950,0.017183],[951,0.016951],[952,0.016723],[953,0.016496],[954,0.016272],[955,0.016051],[956,0.015832],[957,0.015616],[958,0.015402],[959,0.01519],[960,0.014981],[961,0.014774],[962,0.014569],[963,0.014367],[964,0.014167],[965,0.01397],[966,0.013774],[967,0.013581],[968,0.01339],[969,0.013202],[970,0.013015],[971,0.012831],[972,0.012649],[973,0.012469],[974,0.012291],[975,0.012116],[976,0.011942],[977,0.011771],[978,0.011601],[979,0.011434],[980,0.011268],[981,0.011105],[982,0.010944],[983,0.010784],[984,0.010627],[985,0.010471],[986,0.010317],[987,0.010166],[988,0.010016],[989,0.009868],[990,0.009722],[991,0.009577],[992,0.009435],[993,0.009294],[994,0.009155],[995,0.009018],[996,0.008883],[997,0.008749],[998,0.008617],[999,0.008487],[1000,0.008358],[1001,0.008231],[1002,0.008106],[1003,0.007982],[1004,0.00786],[1005,0.00774],[1006,0.007621],[1007,0.007503],[1008,0.007388],[1009,0.007273],[1010,0.007161],[1011,0.007049],[1012,0.00694],[1013,0.006831],[1014,0.006725],[1015,0.006619],[1016,0.006515],[1017,0.006413],[1018,0.006312],[1019,0.006212],[1020,0.006113],[1021,0.006016],[1022,0.005921],[1023,0.005826],[1024,0.005733],[1025,0.005641],[1026,0.005551],[1027,0.005461],[1028,0.005373],[1029,0.005287],[1030,0.005201],[1031,0.005117],[1032,0.005033],[1033,0.004951],[1034,0.004871],[1035,0.004791],[1036,0.004712],[1037,0.004635],[1038,0.004559],[1039,0.004483],[1040,0.004409],[1041,0.004336],[1042,0.004264],[1043,0.004193],[1044,0.004123],[1045,0.004055],[1046,0.003987],[1047,0.00392],[1048,0.003854],[1049,0.003789],[1050,0.003725],[1051,0.003662],[1052,0.0036],[1053,0.003539],[1054,0.003479],[1055,0.003419],[1056,0.003361],[1057,0.003303],[1058,0.003247],[1059,0.003191],[1060,0.003136],[1061,0.003082],[1062,0.003029],[1063,0.002976],[1064,0.002925],[1065,0.002874],[1066,0.002824],[1067,0.002774],[1068,0.002726],[1069,0.002678],[1070,0.002631],[1071,0.002585],[1072,0.002539],[1073,0.002494],[1074,0.00245],[1075,0.002407],[1076,0.002364],[1077,0.002322],[1078,0.00228],[1079,0.00224],[1080,0.0022],[1081,0.00216],[1082,0.002121],[1083,0.002083],[1084,0.002045],[1085,0.002008],[1086,0.001972],[1087,0.001936],[1088,0.001901],[1089,0.001866],[1090,0.001832],[1091,0.001799],[1092,0.001766],[1093,0.001734],[1094,0.001702],[1095,0.00167],[1096,0.001639],[1097,0.001609],[1098,0.001579],[1099,0.00155],[1100,0.001521],[1101,0.001493],[1102,0.001465],[1103,0.001438],[1104,0.001411],[1105,0.001384],[1106,0.001358],[1107,0.001333],[1108,0.001307],[1109,0.001283],[1110,0.001258],[1111,0.001235],[1112,0.001211],[1113,0.001188],[1114,0.001165],[1115,0.001143],[1116,0.001121],[1117,0.0011],[1118,0.001079],[1119,0.001058],[1120,0.001037],[1121,0.001017],[1122,0.000998],[1123,0.000978],[1124,0.000959],[1125,0.000941],[1126,0.000922],[1127,0.000904],[1128,0.000887],[1129,0.000869],[1130,0.000852],[1131,0.000836],[1132,0.000819],[1133,0.000803],[1134,0.000787],[1135,0.000771],[1136,0.000756],[1137,0.000741],[1138,0.000726],[1139,0.000712],[1140,0.000698],[1141,0.000684],[1142,0.00067],[1143,0.000657],[1144,0.000643],[1145,0.00063],[1146,0.000618],[1147,0.000605],[1148,0.000593],[1149,0.000581],[1150,0.000569],[1151,0.000558],[1152,0.000546],[1153,0.000535],[1154,0.000524],[1155,0.000513],[1156,0.000503],[1157,0.000493],[1158,0.000482],[1159,0.000472],[1160,0.000463],[1161,0.000453],[1162,0.000444],[1163,0.000435],[1164,0.000426],[1165,0.000417],[1166,0.000408],[1167,0.000399],[1168,0.000391],[1169,0.000383],[1170,0.000375],[1171,0.000367],[1172,0.000359],[1173,0.000352],[1174,0.000344],[1175,0.000337],[1176,0.00033],[1177,0.000323],[1178,0.000316],[1179,0.000309],[1180,0.000303],[1181,0.000296],[1182,0.00029],[1183,0.000284],[1184,0.000277],[1185,0.000272],[1186,0.000266],[1187,0.00026],[1188,0.000254],[1189,0.000249],[1190,0.000243],[1191,0.000238],[1192,0.000233],[1193,0.000228],[1194,0.000223],[1195,0.000218],[1196,0.000213],[1197,0.000209],[1198,0.000204],[1199,0.0002],[1200,0.000195],[1201,0.000191],[1202,0.000187],[1203,0.000182],[1204,0.000178],[1205,0.000174],[1206,0.000171],[1207,0.000167],[1208,0.000163],[1209,0.000159],[1210,0.000156],[1211,0.000152],[1212,0.000149],[1213,0.000146],[1214,0.000142],[1215,0.000139],[1216,0.000136],[1217,0.000133],[1218,0.00013],[1219,0.000127],[1220,0.000124],[1221,0.000121],[1222,0.000119],[1223,0.000116],[1224,0.000113],[1225,0.000111],[1226,0.000108],[1227,0.000106],[1228,0.000103],[1229,0.000101],[1230,0.000098],[1231,0.000096],[1232,0.000094],[1233,0.000092],[1234,0.00009],[1235,0.000088],[1236,0.000086],[1237,0.000084],[1238,0.000082],[1239,0.00008],[1240,0.000078],[1241,0.000076],[1242,0.000074],[1243,0.000072],[1244,0.000071],[1245,0.000069],[1246,0.000067],[1247,0.000066],[1248,0.000064],[1249,0.000063],[1250,0.000061],[1251,0.00006],[1252,0.000058],[1253,0.000057],[1254,0.000056],[1255,0.000054],[1256,0.000053],[1257,0.000052],[1258,0.000051],[1259,0.000049],[1260,0.000048],[1261,0.000047],[1262,0.000046],[1263,0.000045],[1264,0.000044],[1265,0.000043],[1266,0.000042],[1267,0.000041],[1268,0.00004],[1269,0.000039],[1270,0.000038],[1271,0.000037],[1272,0.000036],[1273,0.000035],[1274,0.000034],[1275,0.000033],[1276,0.000032],[1277,0.000032],[1278,0.000031],[1279,0.00003],[1280,0.000029],[1281,0.000029],[1282,0.000028],[1283,0.000027],[1284,0.000027],[1285,0.000026],[1286,0.000025],[1287,0.000025],[1288,0.000024],[1289,0.000023],[1290,0.000023],[1291,0.000022],[1292,0.000022],[1293,0.000021],[1294,0.000021],[1295,0.00002],[1296,0.00002],[1297,0.000019],[1298,0.000019],[1299,0.000018],[1300,0.000018],[1301,0.000017],[1302,0.000017],[1303,0.000016],[1304,0.000016],[1305,0.000016],[1306,0.000015],[1307,0.000015],[1308,0.000014],[1309,0.000014],[1310,0.000014],[1311,0.000013],[1312,0.000013],[1313,0.000013],[1314,0.000012],[1315,0.000012],[1316,0.000012],[1317,0.000011],[1318,0.000011],[1319,0.000011],[1320,0.00001],[1321,0.00001],[1322,0.00001],[1323,0.00001],[1324,0.000009],[1325,0.000009],[1326,0.000009],[1327,0.000009],[1328,0.000008],[1329,0.000008],[1330,0.000008],[1331,0.000008],[1332,0.000008],[1333,0.000007],[1334,0.000007],[1335,0.000007],[1336,0.000007],[1337,0.000007],[1338,0.000006],[1339,0.000006],[1340,0.000006],[1341,0.000006],[1342,0.000006],[1343,0.000006],[1344,0.000005],[1345,0.000005],[1346,0.000005],[1347,0.000005],[1348,0.000005],[1349,0.000005],[1350,0.000005],[1351,0.000005],[1352,0.000004],[1353,0.000004],[1354,0.000004],[1355,0.000004],[1356,0.000004],[1357,0.000004],[1358,0.000004],[1359,0.000004],[1360,0.000004],[1361,0.000003],[1362,0.000003],[1363,0.000003],[1364,0.000003],[1365,0.000003],[1366,0.000003],[1367,0.000003],[1368,0.000003],[1369,0.000003],[1370,0.000003],[1371,0.000003],[1372,0.000003],[1373,0.000002],[1374,0.000002],[1375,0.000002],[1376,0.000002],[1377,0.000002],[1378,0.000002],[1379,0.000002],[1380,0.000002],[1381,0.000002],[1382,0.000002],[1383,0.000002],[1384,0.000002],[1385,0.000002],[1386,0.000002],[1387,0.000002],[1388,0.000002],[1389,0.000002],[1390,0.000002],[1391,0.000001],[1392,0.000001],[1393,0.000001],[1394,0.000001],[1395,0.000001],[1396,0.000001],[1397,0.000001],[1398,0.000001],[1399,0.000001],[1400,0.000001],[1401,0.000001],[1402,0.000001],[1403,0.000001],[1404,0.000001],[1405,0.000001],[1406,0.000001],[1407,0.000001],[1408,0.000001],[1409,0.000001],[1410,0.000001],[1411,0.000001],[1412,0.000001],[1413,0.000001],[1414,0.000001],[1415,0.000001],[1416,0.000001],[1417,0.000001],[1418,0.000001],[1419,0.000001],[1420,0.000001],[1421,0.000001],[1422,0.000001],[1423,0.000001],[1424,0.000001],[1425,0.000001],[1426,0.000001],[1427,0.000001],[1428,0],[1429,0],[1430,0],[1431,0],[1432,0],[1433,0],[1434,0],[1435,0],[1436,0],[1437,0],[1438,0],[1439,0],[1440,0],[1441,0],[1442,0],[1443,0],[1444,0],[1445,0],[1446,0],[1447,0],[1448,0],[1449,0],[1450,0],[1451,0],[1452,0],[1453,0],[1454,0],[1455,0],[1456,0],[1457,0],[1458,0],[1459,0],[1460,0],[1461,0],[1462,0],[1463,0],[1464,0],[1465,0],[1466,0],[1467,0],[1468,0],[1469,0],[1470,0],[1471,0],[1472,0],[1473,0],[1474,0],[1475,0],[1476,0],[1477,0],[1478,0],[1479,0],[1480,0],[1481,0],[1482,0],[1483,0],[1484,0],[1485,0],[1486,0],[1487,0],[1488,0],[1489,0],[1490,0],[1491,0],[1492,0],[1493,0],[1494,0],[1495,0],[1496,0],[1497,0],[1498,0],[1499,0],[1500,0],[1501,0],[1502,0],[1503,0],[1504,0],[1505,0],[1506,0],[1507,0],[1508,0],[1509,0],[1510,0],[1511,0],[1512,0],[1513,0],[1514,0],[1515,0],[1516,0],[1517,0],[1518,0],[1519,0],[1520,0],[1521,0],[1522,0],[1523,0],[1524,0],[1525,0],[1526,0],[1527,0],[1528,0],[1529,0],[1530,0],[1531,0],[1532,0],[1533,0],[1534,0],[1535,0],[1536,0],[1537,0],[1538,0],[1539,0],[1540,0],[1541,0],[1542,0],[1543,0],[1544,0],[1545,0],[1546,0],[1547,0],[1548,0],[1549,0],[1550,0],[1551,0],[1552,0],[1553,0],[1554,0],[1555,0],[1556,0],[1557,0],[1558,0],[1559,0],[1560,0],[1561,0],[1562,0],[1563,0],[1564,0],[1565,0],[1566,0],[1567,0],[1568,0],[1569,0],[1570,0],[1571,0],[1572,0],[1573,0],[1574,0],[1575,0],[1576,0],[1577,0],[1578,0],[1579,0],[1580,0],[1581,0],[1582,0],[1583,0],[1584,0],[1585,0],[1586,0],[1587,0],[1588,0],[1589,0],[1590,0],[1591,0],[1592,0],[1593,0],[1594,0],[1595,0],[1596,0],[1597,0],[1598,0],[1599,0],[1600,0],[1601,0],[1602,0],[1603,0],[1604,0],[1605,0],[1606,0],[1607,0],[1608,0],[1609,0],[1610,0],[1611,0],[1612,0],[1613,0],[1614,0],[1615,0],[1616,0],[1617,0],[1618,0],[1619,0],[1620,0],[1621,0],[1622,0],[1623,0],[1624,0],[1625,0],[1626,0],[1627,0],[1628,0],[1629,0],[1630,0],[1631,0],[1632,0],[1633,0],[1634,0],[1635,0],[1636,0],[1637,0],[1638,0],[1639,0],[1640,0],[1641,0],[1642,0],[1643,0],[1644,0],[1645,0],[1646,0],[1647,0],[1648,0],[1649,0],[1650,0],[1651,0],[1652,0],[1653,0],[1654,0],[1655,0],[1656,0],[1657,0],[1658,0],[1659,0],[1660,0],[1661,0],[1662,0],[1663,0],[1664,0],[1665,0],[1666,0],[1667,0],[1668,0],[1669,0],[1670,0],[1671,0],[1672,0],[1673,0],[1674,0],[1675,0],[1676,0],[1677,0],[1678,0],[1679,0],[1680,0],[1681,0],[1682,0],[1683,0],[1684,0],[1685,0],[1686,0],[1687,0],[1688,0],[1689,0]];
			var chartId = 'chart19';
			var chart5 = createChart(chartId);			
			var option = createOption(chart5,chartId);	
			option.xrange_axis				= false;//x축이 범위형축		
			option.xunit					= '억원';//툴팁에 표시되는 X값의단위
			option.unitLabel_Hori			= '억원';
			option.unitLabel_Verti			= '(%)';
			option.chartTitle				= '[설계LCC 비용 및 확률분포 분석결과]';	
			option.crossLineShow_hori		= false;//실시간선택라인 수평선 사용안함
			option.min						= 0;
			option.rpTooltipUse				= true;	
			option.legendPositionH			= 'titleRight';
		

			//차트생성데이터
			
			

			
				var orplAltrtTitlNm ="111"; //원안대안명
				var series1 = [];

								
				//var yMax = 4000;var yMin = -1000;var divNum = 4;//시리즈가 여러개일경우 자동 min,max 구하기가 부하가 걸릴수있으므로 명시적으로 지정하여 퍼포먼스를 향상시킴			
				/* 1번 시리즈 [주의 : createSeries사용시 이름이 반드시 달라야함!!!]*/
				var oo = chartUtil.formatData_profile2(arr,false,null,null,null);
				console.dir(oo);
				var aSeries 	= createSeries(orplAltrtTitlNm,'ndSpline',oo);//3번,4번argu->max=null,min=null주면 동적으로 구함
				aSeries.s_unit	='%';//툴팁에 표시될 Y값의단위
				aSeries.s_sizeDefault = 0.1;//점의 크기
				aSeries.s_shape='rect';//점의 모양
				//aSeries.s_color='rgba(86,148,216,1)';//시리즈의 색상, (0,128,192)색은 블루
				//aSeries.s_shapeColor='rgba(86,148,216,1)';
				aSeries.s_lineWidth=2;

				option.series.push(aSeries);				

			chart5.redraw(option);
	};	
	
	function chart19_1(){
			var chartId = 'chart19_1';
			var chart = createChart(chartId);			
			var option = createOption(chart,chartId);
			
			var meanArr = [1411,1044,1577];
			var stdvArr = [705.5,522,788.5];	
			var InpValCnt = 3000;
			var seriesCnt = 3;			
			var seriesArr = chartUtil.getNdData(meanArr,stdvArr,InpValCnt,seriesCnt);
	
			option.minmaxset =  true;
			option.min = 0;
			option.toFixedY					= 2;
			option.xmin						= 0;//x축이 범위형축으로 구성될때 x축의 최소값
			option.xmax						= InpValCnt;//x축이 범위형축으로 구성될때 x축의 최대값
			option.xrange_count				= 10;//x축이 범위형축으로 구성될때 x축의눈금개수	
			option.xunit					= 'km';//툴팁에 표시되는 X값의단위
			option.unitLabel_Hori			= '높이';
			option.unitLabel_Verti			= '온도';
			option.crossLineShow			= true;//수직선
			option.crossLineShow_hori		= true;//실시간선택라인 수평선 사용안함
			option.rpTooltipUse				= true;			
			option.chartTitle				= 'Sales Of Beer';


			var aSeries 	= createSeries('any sereis1','scatter',chartUtil.formatData_profile2(seriesArr[0],false,0.00076426,0,4));//3번,4번param->max=null,min=null주면 동적으로 구함
			aSeries.s_unit	='개';//툴팁에 표시될 Y값의단위
			aSeries.s_sizeDefault = 1;//점의 크기
			aSeries.s_shape='rect';//점의 모양
			aSeries.s_color='rgba(0,128,192,1)';//시리즈의 색상, (0,128,192)색은 블루
			aSeries.s_shapeColor = aSeries.s_color;
			option.series.push(aSeries);
			
			var aSeries2 	= createSeries('any sereis2','scatter',chartUtil.formatData_profile2(seriesArr[1],false,0.00076426,0,4));//3번,4번param->max=null,min=null주면 동적으로 구함
			aSeries2.s_unit	='개';//툴팁에 표시될 Y값의단위
			aSeries2.s_sizeDefault = 3;//점의 크기
			aSeries2.s_shape='rect';//점의 모양
			aSeries2.s_color='rgba(0,240,192,1)';//시리즈의 색상, (0,128,192)색은 블루
			aSeries2.s_shapeColor = aSeries2.s_color;
			option.series.push(aSeries2);
			
			var aSeries3 	= createSeries('any sereis3','scatter',chartUtil.formatData_profile2(seriesArr[2],false,0.00076426,0,4));//3번,4번param->max=null,min=null주면 동적으로 구함
			aSeries3.s_unit	='개';//툴팁에 표시될 Y값의단위
			aSeries3.s_sizeDefault = 4;//점의 크기
			aSeries3.s_shape='rect';//점의 모양
			aSeries3.s_color='rgba(255,139,62,1)';//시리즈의 색상, (0,128,192)색은 블루
			aSeries3.s_shapeColor = aSeries3.s_color;
			option.series.push(aSeries3);
					
			chart.redraw(option);
			
	};		
	
	function chart19_2(){
			var chartId = 'chart19_2';
			var chart = createChart(chartId);			
			var option = createOption(chart,chartId);						

			var meanArr = [150];
			var stdvArr = [70.5];	
			var InpValCnt = 300;
			var seriesCnt = 1;			
			var seriesArr = chartUtil.getNdData(meanArr,stdvArr,InpValCnt,seriesCnt);

			option.minmaxset =  true;
			option.min = 0;
			option.xmin						= 0;//x축이 범위형축으로 구성될때 x축의 최소값
			option.xmax						= InpValCnt;//x축이 범위형축으로 구성될때 x축의 최대값
			option.toFixedY					= 2;
			option.xunit					= 'km';//툴팁에 표시되는 X값의단위
			option.unitLabel_Hori			= '높이';
			option.unitLabel_Verti			= '온도';
			option.crossLineShow			= true;//수직선
			option.crossLineShow_hori		= true;//실시간선택라인 수평선 사용안함
			option.rpTooltipUse				= true;	
			option.tooltipShow				= false;
			option.chartTitle				= 'Sales Of Beer';

			var aSeries 	= createSeries('any sereis1','ndSpline',chartUtil.formatData_profile2(seriesArr[0],false,0.0056,0,4));//3번,4번param->max=null,min=null주면 동적으로 구함
			aSeries.s_unit	='개';//툴팁에 표시될 Y값의단위
			aSeries.s_sizeDefault = 5;//점의 크기
			aSeries.s_shape='rect';//점의 모양
			aSeries.s_color='rgba(33,171,74,1)';//시리즈의 색상, (0,128,192)색은 블루
			aSeries.s_shapeColor = aSeries.s_color;
			option.series.push(aSeries);
						
			chart.redraw(option);			
	};	
	
	function chart19_3(){
			var chartId = 'chart19_3';
			var chart = createChart(chartId);			
			var option = createOption(chart,chartId);						
			
			var meanArr = [400];
			var stdvArr = [200.5];	
			var InpValCnt = 800;
			var seriesCnt = 1;			
			var seriesArr = chartUtil.getNdData(meanArr,stdvArr,InpValCnt,seriesCnt);
			
			option.minmaxset =  true;
			option.min = 0;
			option.xmin						= 0;//x축이 범위형축으로 구성될때 x축의 최소값
			option.xmax						= InpValCnt;//x축이 범위형축으로 구성될때 x축의 최대값
			option.toFixedY					= 2;
			option.xunit					= 'km';//툴팁에 표시되는 X값의단위
			option.unitLabel_Hori			= '높이';
			option.unitLabel_Verti			= '온도';
			option.crossLineShow			= true;//수직선
			option.crossLineShow_hori		= true;//실시간선택라인 수평선 사용안함
			option.rpTooltipUse				= true;			
			option.chartTitle				= 'Sales Of Beer';
			
			option.legendPosition			= 'top';
			option.legendPositionH			= 'titleRight';
			

			var aSeries 	= createSeries('any sereis1','ndSpline',chartUtil.formatData_profile2(seriesArr[0],false,0.002,option.min,4));//3번,4번param->max=null,min=null주면 동적으로 구함
			aSeries.s_unit	='개';//툴팁에 표시될 Y값의단위
			aSeries.s_sizeDefault = 1;//점의 크기
			aSeries.s_shape='rect';//점의 모양
			aSeries.s_color='rgba(189,0,0,1)';//시리즈의 색상, (0,128,192)색은 블루
			aSeries.s_shapeColor = aSeries.s_color;
			option.series.push(aSeries);
						
			chart.redraw(option);
			
	};		
	
	
	function chart20(){
			var chartId = 'chart20';
			var chart = createChart(chartId);			
			var option = createOption(chart,chartId);
			option.xrange_axis				= false;//x축이 범위형축		
			option.xunit					= '년';//툴팁에 표시되는 X값의단위
			option.unitLabel_Hori			= '주기';
			option.unitLabel_Verti			= '빈도수';
			option.unitLabel_Verti_R		= '정규분포확률';
			
			option.chartTitle				= '주기 빈도 분석';	
			option.crossLineShow_hori		= false;//실시간선택라인 수평선 사용안함
			option.min						= 0;
			option.min_R					= 0;
			option.rpTooltipUse				= true;	
			option.legendPositionH			= 'titleRight';
			option.bothYAxis = true;
			option.valueShow = true;
			option.value_show_min_hide = true;
			

			var aSeries 	= createSeries('주기 빈도수','bar',chartUtil.formatData_profile2(data20_1,false,null,null,null));//3번,4번param->max=null,min=null주면 동적으로 구함

			aSeries.s_unit	='원';//툴팁에 표시될 Y값의단위
			aSeries.s_sizeDefault = 3;//점의 크기
			aSeries.s_shape='circle';//점의 모양
			aSeries.s_color='rgba(0,128,192,1)';//시리즈의 색상, (0,128,192)색은 블루
			aSeries.s_lineWidth=1;
			option.series.push(aSeries);	
			

			var aSeries1 	= createSeries('주기 정규분포확률','ndSpline',chartUtil.formatData_profile2(data20_2,false,null,null,null));//3번,4번argu->max=null,min=null주면 동적으로 구함

			aSeries1.s_unit	='%';//툴팁에 표시될 Y값의단위
			aSeries1.s_sizeDefault = 0.1;//점의 크기
			aSeries1.s_shape='rect';//점의 모양
			aSeries1.s_axis = 'R';
			aSeries1.s_lineWidth=2;
			
			option.series.push(aSeries1);
			
			chart.redraw(option);
	};		
	function chart21(){
			var chartId = 'chart21';
			var chart1 = createChart(chartId);			
			var option = createOption(chart1,chartId);			
			option.xAxisMarkShow = true;
			option.yAxisMarkShow = false;
			option.mainTitleShow = false;
			option.legendShow = false;
			option.tooltipShow = false;
			option.crossLineShow = false;
			option.draw2DepthXAxis = true;
			option.bottomLabelMaxHeight = 0;
			option.bottom_legend_box_height = 0;
			option.bottom_legend_box_top_margin = 0;
			option.bottom_legend_box_bottom_margin = 0;
			option.xAxisPosition = 'top';	
			option.useSave = false;
			
			var aSeries = createSeries('any sereis','image',data21_1);	
			aSeries.s_color='rgba(242,159,6,1)';
			option.series.push(aSeries);
			
			option.unitLabel_Hori			= '<년>';
			option.unitLabel_Verti			= '날씨';
			option.chartTitle				= '<기수행된사후평가km당 민원발생 현황>';
	

			var img_map1 = {};
			img_map1['1'] = "gisang/5.gif";
			img_map1['2'] = "gisang/2.gif";
			img_map1['3'] = "gisang/3.gif";
			img_map1['4'] = "gisang/4.gif";
			option.img_resource_map1 = img_map1;
			
			var colours = [
			                {red: 242,green: 159,blue: 6},
			                {red: 254,green: 240,blue: 216}
			                ];					
			option.colours			= colours;
			var colourGradientObject = new ColourGradient(0,option.series[0]['s_data'].length, colours);
			option.colorObj			= colourGradientObject;
			option.gradientColorUse = true;
			chart1.redraw(option);
			return chart1;
	};	
	function chart21_2(chartObj){
			var chartId = 'chart21_2';
			var chart3 = createChart(chartId);			
			var option = createOption(chart3,chartId);
			option.xAxisMarkShow = false;
			option.yAxisMarkShow = false;
			option.mainTitleShow = false;
			option.legendShow = false;
			option.tooltipShow = false;
			option.crossLineShow = false;
			option.draw2DepthXAxis = true;
			option.bottomLabelMaxHeight = 0;
			option.bottom_legend_box_height = 0;
			option.bottom_legend_box_top_margin = 0;
			option.bottom_legend_box_bottom_margin = 0;
			option.xAxisPosition = 'top';
			option.leftLabelMaxWidthXY = chartObj.option['leftLabelMaxWidthXY'];
			option.top_margin = 0;
			option.valueShow = true;
			
			option.xrange_axis				= false;//x축이 범위형축		
			option.xunit					= 'ºC';//툴팁에 표시되는 X값의단위
			option.unitLabel_Hori			= '온도';
			option.unitLabel_Verti			= '기온(oC)';
			option.chartTitle				= 'Sales Of Beer & Ice-cream';	
			option.min = 0;
			option.toFixedY					= 2;
			option.useSave = false;
			/*
			option.showTopBorder			= true;
			option.showRightBorder			= false;
			option.showLeftBorder			= false;	
			option.showToolTipChartType		= false;
			option.legendPosition			= 'top';
			option.legendPositionH			= 'titleRight';
			option.legendFont				= '12px Arial';	
			option.chartTitleAlign			= 'left';	
			option.chartTitlePosition		= 'boxOut';				
			option.mainTitleFont			= '18px Arial';	
			option.valueShow				= true;	
			*/
			var aSeries 	= createSeries('any sereis','line',chartUtil.formatData_profile2(data21_2,false,null,null,null,true));//3번,4번param->max=null,min=null주면 동적으로 구함
			aSeries.s_unit	='개';//툴팁에 표시될 Y값의단위
			aSeries.s_sizeDefault = 3;//점의 크기
			aSeries.s_shape='circle';//점의 모양
			aSeries.s_color='rgba(0,128,192,1)';//시리즈의 색상, (0,128,192)색은 블루

			option.series.push(aSeries);			
			chart3.redraw(option);
	};	
	
	function chart21_3(chartObj){
			var chartId = 'chart21_3';
			var chart21_3 = createChart(chartId);			
			var option = createOption(chart21_3,chartId);			
			option.xAxisMarkShow = false;
			option.yAxisMarkShow = false;
			option.mainTitleShow = false;
			option.legendShow = false;
			option.tooltipShow = false;
			option.crossLineShow = false;
			option.draw2DepthXAxis = true;
			option.bottomLabelMaxHeight = 0;
			option.bottom_legend_box_height = 0;
			option.bottom_legend_box_top_margin = 0;
			option.bottom_legend_box_bottom_margin = 0;
			option.xAxisPosition = 'top';	
			option.leftLabelMaxWidthXY = chartObj.option['leftLabelMaxWidthXY'];
			option.top_margin = 0;
			option.valueGroupCnt = 2;
			option.useSave = false;

			
			var aSeries = createSeries('any sereis','bar',data21_3);	
			aSeries.s_color='rgba(242,159,6,1)';
			option.series.push(aSeries);
			option.unitLabel_Verti			= '6시간강수량(mm)';

			var colours = [
			                {red: 242,green: 159,blue: 6},
			                {red: 254,green: 240,blue: 216}
			                ];					
			option.colours			= colours;
			var colourGradientObject = new ColourGradient(0,option.series[0]['s_data'].length, colours);
			option.colorObj			= colourGradientObject;
			option.gradientColorUse = true;
			chart21_3.redraw(option);
	};	
	
	function chart21_4(chartObj){
			var chartId = 'chart21_4';
			var chart21_3 = createChart(chartId);			
			var option = createOption(chart21_3,chartId);

			option.xAxisMarkShow = false;
			option.yAxisMarkShow = false;
			option.mainTitleShow = false;
			option.legendShow = false;
			option.tooltipShow = false;
			option.crossLineShow = false;
			option.draw2DepthXAxis = true;
			option.bottomLabelMaxHeight = 0;
			option.bottom_legend_box_height = 0;
			option.bottom_legend_box_top_margin = 0;
			option.bottom_legend_box_bottom_margin = 0;
			option.xAxisPosition = 'top';
			option.leftLabelMaxWidthXY = chartObj.option['leftLabelMaxWidthXY'];
			option.top_margin = 0;
			option.valueShow = true;
			option.min = 0;
			option.useSave = false;
			
			option.xrange_axis				= false;//x축이 범위형축		
			option.unitLabel_Verti			= '강수확률(%)';

			option.crossLineShow_hori		= false;//실시간선택라인 수평선 사용안함			
			option.randomColorUse           = true;
			

			var aSeries 	= createSeries('any sereis','area',data21_4);//3번,4번param->max=null,min=null주면 동적으로 구함
			aSeries.s_unit	='개';//툴팁에 표시될 Y값의단위

			aSeries.s_color='rgba(0,128,192,1)';//시리즈의 색상, (0,128,192)색은 블루

			option.series.push(aSeries);			
			chart21_3.redraw(option);
	};		
	
	function chart21_5(chartObj){
			var chartId = 'chart21_5';
			var chart21_5 = createChart(chartId);			
			var option = createOption(chart21_5,chartId);			
			option.xAxisMarkShow = false;
			option.yAxisMarkShow = false;
			option.mainTitleShow = false;
			option.legendShow = false;
			option.tooltipShow = false;
			option.crossLineShow = false;
			option.draw2DepthXAxis = true;
			option.bottomLabelMaxHeight = 0;
			option.bottom_legend_box_height = 0;
			option.bottom_legend_box_top_margin = 0;
			option.bottom_legend_box_bottom_margin = 0;
			option.xAxisPosition = 'top';	
			option.leftLabelMaxWidthXY = chartObj.option['leftLabelMaxWidthXY'];
			option.top_margin = 0;
			option.valueGroupCnt = 2;
			option.min = -10;
			option.useSave = false;
			
			var aSeries = createSeries('any sereis','bar',data21_5);	
			aSeries.s_color='rgba(242,159,6,1)';
			option.series.push(aSeries);
			option.unitLabel_Verti			= '6시간신적설(csm)';

			var colours = [
			                {red: 0,green: 0,blue: 0},
			                {red: 255,green: 255,blue: 255}
			                ];					
			option.colours			= colours;
			var colourGradientObject = new ColourGradient(0,option.series[0]['s_data'].length, colours);
			option.colorObj			= colourGradientObject;
			option.gradientColorUse = true;
			chart21_5.redraw(option);
	};		
	
	function chart21_6(chartObj){
			var chartId = 'chart21_6';
			var chart21_6 = createChart(chartId);			
			var option = createOption(chart21_6,chartId);


			option.xAxisMarkShow = false;
			option.yAxisMarkShow = false;
			option.mainTitleShow = false;
			option.legendShow = false;
			option.tooltipShow = false;
			option.crossLineShow = false;
			option.draw2DepthXAxis = true;
			option.bottomLabelMaxHeight = 0;
			option.bottom_legend_box_height = 0;
			option.bottom_legend_box_top_margin = 0;
			option.bottom_legend_box_bottom_margin = 0;
			option.xAxisPosition = 'top';	
			option.leftLabelMaxWidthXY = chartObj.option['leftLabelMaxWidthXY'];
			option.top_margin = 0;
			option.useSave = false;
			
			
			option.xrange_axis				= false;//x축이 범위형축		
			option.xunit					= 'ºC';//툴팁에 표시되는 X값의단위
			option.unitLabel_Verti			= '습도(%)';
			option.chartTitle				= 'Sales Of Beer & Ice-cream';	
			option.crossLineShow_hori		= false;//실시간선택라인 수평선 사용안함			
			option.randomColorUse           = true;
			

			var aSeries 	= createSeries('any sereis','bar',data21_6);//3번,4번param->max=null,min=null주면 동적으로 구함
			aSeries.s_unit	='개';//툴팁에 표시될 Y값의단위

			aSeries.s_color='rgba(0,128,192,1)';//시리즈의 색상, (0,128,192)색은 블루

			option.series.push(aSeries);			
			chart21_6.redraw(option);
	};		
	function chart21_7(chartObj){
			var chartId = 'chart21_7';
			var chart21_7 = createChart(chartId);			
			var option = createOption(chart21_7,chartId);
			option.xAxisMarkShow = false;
			option.yAxisMarkShow = false;
			option.mainTitleShow = false;
			option.legendShow = false;
			option.tooltipShow = false;
			option.crossLineShow = false;
			option.draw2DepthXAxis = true;
			option.bottomLabelMaxHeight = 0;
			option.bottom_legend_box_height = 0;
			option.bottom_legend_box_top_margin = 0;
			option.bottom_legend_box_bottom_margin = 0;
			option.xAxisPosition = 'top';
			option.leftLabelMaxWidthXY = chartObj.option['leftLabelMaxWidthXY'];
			option.top_margin = 0;
			option.valueShow = true;
			option.useSave = false;
			
			option.xrange_axis				= false;//x축이 범위형축		
			option.xunit					= 'ºC';//툴팁에 표시되는 X값의단위
			option.unitLabel_Verti			= '풍속(m/s)';
			option.chartTitle				= 'Sales Of Beer & Ice-cream';	
			option.min = 0;
			option.toFixedY					= 2;

			var aSeries 	= createSeries('any sereis','line',chartUtil.formatData_profile2(data21_7,false,null,null,null,true));//3번,4번param->max=null,min=null주면 동적으로 구함
			aSeries.s_unit	='개';//툴팁에 표시될 Y값의단위
			aSeries.s_sizeDefault = 3;//점의 크기
			aSeries.s_shape='circle';//점의 모양
			aSeries.s_color='rgba(235,121,112,1)';//시리즈의 색상, (0,128,192)색은 블루
			aSeries.s_shapeColor = 'rgba(255,255,255,1)';

			option.series.push(aSeries);			
			chart21_7.redraw(option);
	};
	function chart21_8(chartObj){
			var chartId = 'chart21_8';
			var chart21_8 = createChart(chartId);			
			var option = createOption(chart21_8,chartId);			
			option.xAxisMarkShow = false;
			option.yAxisMarkShow = false;
			option.mainTitleShow = false;
			option.legendShow = false;
			option.tooltipShow = false;
			option.crossLineShow = false;
			option.draw2DepthXAxis = true;
			option.bottomLabelMaxHeight = 0;
			option.bottom_legend_box_height = 0;
			option.bottom_legend_box_top_margin = 0;
			option.bottom_legend_box_bottom_margin = 0;
			option.xAxisPosition = 'top';	
			option.leftLabelMaxWidthXY = chartObj.option['leftLabelMaxWidthXY'];
			option.top_margin = 0;
			option.useSave = false;
			option.unitLabel_Verti			= '풍향';
			
			var aSeries = createSeries('any sereis','image',data21_8);	
			aSeries.s_color='rgba(242,159,6,1)';
			aSeries.s_rotate = true;
			option.series.push(aSeries);

			

	

			var img_map1 = {};
			img_map1['rotateImg'] = "gisang/1.png";
			option.img_resource_map1 = img_map1;
			
			var colours = [
			                {red: 242,green: 159,blue: 6},
			                {red: 254,green: 240,blue: 216}
			                ];					
			option.colours			= colours;
			var colourGradientObject = new ColourGradient(0,option.series[0]['s_data'].length, colours);
			option.colorObj			= colourGradientObject;
			option.gradientColorUse = true;
			chart21_8.redraw(option);
	};		
	
	function chart22(chartObj){
			var chartId = 'chart22';
			var chart22 = createChart(chartId);			
			var option = createOption(chart22,chartId);

			option.xAxisMarkShow = true;
			option.yAxisMarkShow = true;
			option.mainTitleShow = true;
			option.legendShow = true;
			option.tooltipShow = true;
			option.crossLineShow = false;
			option.draw2DepthXAxis = true;

			option.xAxisPosition = 'bottom';

			option.valueShow = true;
			option.min = 0;
			option.useSave = true;
			
			option.xrange_axis				= false;//x축이 범위형축
			option.unitLabel_Hori			= '시간(일/시)';			
			option.unitLabel_Verti			= '강수확률(%)';

			option.crossLineShow_hori		= false;//실시간선택라인 수평선 사용안함			
			option.randomColorUse           = true;
			

			var aSeries 	= createSeries('any sereis','area',data21_4);//3번,4번param->max=null,min=null주면 동적으로 구함
			aSeries.s_unit	='개';//툴팁에 표시될 Y값의단위

			aSeries.s_color='rgba(0,128,192,1)';//시리즈의 색상, (0,128,192)색은 블루

			option.series.push(aSeries);			
			chart22.redraw(option);
	};		
	
	function chart23(){
			var chartId = 'chart23';
			var chart23 = createChart(chartId);			
			var option = createOption(chart23,chartId);					
			option.x_label_extension		= true;
			option.unitLabel_Hori			= '<년>';
			option.unitLabel_Verti			= '    [관람자수]     ';
			
			option.chartTitle				= '< 개봉영화 흥행순위 >';	
			option.chartTitleVAlign 		= 'bottom';
			option.legendShow = true;
			
			option.drawLines = [-40,-65];
			option.drawLineColors = ['rgba(86,148,216,1)','rgba(186,48,16,1)'];
			option.drawLineDepths = [5,2];
			option.drawLineTexts = ['<평균선>','<테스트>'];
			option.drawLineTextsPosition = ['top','bottom'];
			option.drawLineStyles = ['dot','normal'];
			option.drawLineDotGep = [5,0];
			var colors = ['182,192,118','118,192,187','186,119,191','193,140,117','215,211,96','211,99,130'];			

			option.showTopBorder = false;
			option.colorDirection = 'left';
			option.rpTooltipUse = true;	
			option.tooltipShow = false;
			
			/* 1번 시리즈 [주의 : createSeries사용시 이름이 반드시 달라야함!!!] */
			var aSeries 	= createSeries('anyA','bar',data23_1);//3번,4번argu->max=null,min=null,divNum=null주면 동적으로 구함
			aSeries.s_unit	='개';//툴팁에 표시될 Y값의단위
			aSeries.s_sizeDefault = 1;//점의 크기
			aSeries.s_shape='circle';//점의 모양
			aSeries.s_colors = colors;
			//aSeries.s_color='rgba(86,148,216,1)';//시리즈의 색상, (0,128,192)색은 블루
			option.series.push(aSeries);			
			
			
			/* 2번 시리즈 [주의 : createSeries사용시 이름이 반드시 달라야함!!!] */
			
			var aSeries 	= createSeries('anyB','bar',data23_2);//3번,4번argu->max=null,min=null,divNum=null주면 동적으로 구함
			aSeries.s_unit	='개';//툴팁에 표시될 Y값의단위
			aSeries.s_sizeDefault = 2;//점의 크기
			aSeries.s_shape='rect';//점의 모양
			aSeries.s_colors = colors;
			//aSeries.s_color='rgba(231,158,228,1)';//시리즈의 색상, (0,128,192)색은 블루
			option.series.push(aSeries);
			
			
			chart23.redraw(option);
	};		