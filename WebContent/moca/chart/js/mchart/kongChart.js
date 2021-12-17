HChart = function(_container) {
	var M = this;
	this.container = _container;
	this.mainCanvas = document.createElement("canvas");
	this.mainCanvasBuffer = document.createElement("canvas");
	this.mainCanvasMidBuffer = document.createElement("canvas");
	this.img = new Image();
	this.container.append(this.mainCanvas);

	if (this.mainCanvas.addEventListener) {
		this.mainCanvas.addEventListener('mousemove'	, 	function(event) {HChart.prototype.drawCrossLinesPc(M,event);}, false);
		this.mainCanvas.addEventListener('click'	, 	function(event) {HChart.prototype.btnSave(M,event);}, false);
	}
	else {
		this.mainCanvas.attachEvent("mousemove", function(event) {HChart.prototype.drawCrossLinesPc(M,event);});
		this.mainCanvas.attachEvent("click", function(event) {HChart.prototype.btnSave(M,event);});
	}

	this.defaultColours = [
		                {red: 210,green: 206,blue: 233},
		                {red: 185,green: 176,blue: 239},
		                {red: 142,green: 123,blue: 202},
		                {red: 122,green: 77,blue: 255},
		                {red: 101,green: 62,blue: 189},
		                {red: 76,green: 28,blue: 228},
		                {red: 49,green: 5,blue: 206}
		                ];
	this.lineColours = [
		'rgba(86,148,216,1)',
		'rgba(255,128,0,1)',
		'rgba(150,150,150,1)',
		'rgba(10,187,35,1)',
		'rgba(231,158,228,1)',
		
		'rgba(223,219,166,1)',
		'rgba(231,168,158,1)',
		'rgba(173,216,216,1)',
		'rgba(0,128,128,1)'
	];
		
	this.defaultOption = {
		background_color:'rgba(255,255,255,1)',//디폴트힌색
		axis_stroke_color:'rgba(0,0,0,0.5)',//디폴트검정에 알파0.5
		center_fill_color:'rgba(255,255,255,1)',
		color:'rgba(1,1,1,1)',
		pivot_mode:'XY'/* bottom:left*/,
		font_size:11,
		font_name:'Arial',
		font_color:'rgba(192,97,69,1)',
		font_weight:'normal',
		bottom_legend_box_height:40,
		bottom_legend_box_top_margin:5,
		bottom_legend_box_bottom_margin:5,
		left_legend_box_width:12,
		left_legend_box_left_margin:5,
		left_legend_box_right_margin:5,
		top_margin:40,
		right_margin:20,
		mark_width:5,
		mark_then_gep:2,
		gep_space:2,
		gradientBoxWidth:20,
		gradientBoxHeight:30,
		colours:this.defaultColours,
		unitLabel_3thVal:' ',
		gradientLegendShow:false,
		gridShowH:true,
		gridShowV:false,
		dotShow:true,
		crossLineShow:true,
		groupbyLineDepth:3,
		showTopBorder:true,
		showLeftBorder:false,
		showRightBorder:false,
		
		showLeftOutBorder:false,
		showRightOutBorder:false,
		showTopOutBorder:false,
		showBottomOutBorder:false,
		
		legendBottomGep:10,
		legendItemBoxWidth:10,
		axisTitleFont:'11px Arial',
		tooltip_and_box_gep:4,
		legendBoxShow:false,
		crossLineShow_hori:true,
		//toFixedY:,
		//toFixedX:0,
		commonTextColor:'rgba(120,120,120,1)',
		legendPosition:'top',//'top','bottom'
		axisLineColor:'rgba(20,20,20,1)',
		textFont:'bold 11px Arial',     // 그래프 폰트
		commonFont:'normal 11px Arial',
		titleFont:'bold 11px Arial',
		mainTitleFont:'bold 18px Arial',		
		leftLabelMaxWidthXYAddGep:10,
		textStrokeColor:'rgba(100,128,0,1)',
		tooltipTextColor:'rgba(55,101,114,1)',
		bottom_title_align:'right',
		minmaxset:false,
		valueShowPosition:'top',
		//legendPositionH:'titleRight',
		legendPositionH:'right',
		tooltipStyle:'inbox',
		showToolTipChartType:false,
		legendFont:'12px Arial',
		valueShow:true,
		chartTitleAlign:'left',	
		chartTitlePosition:'boxOut',		
		valueShowFont:'8px Arial',
		tooltipFont:'12px Arial',
		rpTooltipColor:'rgba(255,255,255,0.8)',
		rpTooltipBorderColor:'rgba(103,128,133,0.8)',			
		rpTooltipTitleBgColor:'rgba(140,140,140,0.8)',	
		rpTooltipTitleTxtColor:'rgba(255,255,255,1)',
		rpTooltipTxtColor:'rgba(140,140,140,1)',
		xLabelStartGep:14,
		yAxisMarkShow:true,
		mainTitleShow:true,
		xAxisMarkShow:true,
		useSave:true,
		guideLineShow:true,
		cutPie:true,
		rpTooltipBorderShow:true

	};
	this.option = {};
	
	var colorMax = 4;
};
HChart.prototype.drawCrossLinesPc = function(M,_event) {
	if(M.o()['type'] == 'pie' || M.o()['type'] == 'doughnut'){
		HChart.prototype.drawCrossLinesPie(M,_event);
	}else if(M.o()['type'] == 'radial'){
	
	}else{
		HChart.prototype.drawCrossLines(M,_event);
	}
	_event.preventDefault();
	_event.stopPropagation();
	_event.stopImmediatePropagation();
	return false;
}
HChart.prototype.getSColor = function(M,_seriesIndex) {
	var s_color 		= M.o()['series'][_seriesIndex].s_color;
	if(s_color == null){
		s_color = M.lineColours[_seriesIndex];
	}
	return s_color;
}
HChart.prototype.getSpColor = function(M,_seriesIndex) {
	var s_shapeColor 		= M.o()['series'][_seriesIndex].s_shapeColor;
	if(s_shapeColor == null){
		s_shapeColor = M.lineColours[_seriesIndex];
	}
	return s_shapeColor;
}


HChart.prototype.btnSave = function(M,_event) {

	var lastX = (_event.offsetX || (_event.pageX - M.mainCanvas.offsetLeft));
	var lastY = _event.offsetY || (_event.pageY - M.mainCanvas.offsetTop);	

	if( (M.getBottomAxisWidth()+M.getLeftAxisWidth()) < lastX 
			&& lastX < (M.getBottomAxisWidth()+M.getLeftAxisWidth()+M.img.width) ){
		if(M.o()['top_margin'] < lastY
				&& lastY < M.o()['top_margin']+M.img.height){
			
			try{
				var tt = M.o()['chartTitle'];
				var tt_filename='';
				if(tt == null){		
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
					var d7 = tt_filename = 'chart_'+String(year) + String(month) + String(day)+'_'+String(hour) + String(min) + String(second);
					tt_filename = d7;
				}else{						
					tt_filename = tt;
				}
				tt_filename += ".png";
					
				var canvas = M.mainCanvas;
				var imgData    = canvas.toDataURL("image/png");
				var v_href = imgData.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
				var agent = navigator.userAgent.toLowerCase();
				if(agent.indexOf('chrome') != -1){
					var link = document.createElement('a');
					link.setAttribute('download', tt_filename);
					link.setAttribute('href', v_href);
					link.click();
				}else {
					imgData = atob(imgData.split(',')[1]);
					var len = imgData.length;
					var buf = new ArrayBuffer(len);             // 비트를 담을 버퍼를 만든다.
					var view = new Uint8Array(buf);             // 버퍼를 8bit Unsigned Int로 담는다.
					var blob;
					var i;
					for (i=0; i<len; i++) {
					  view[i] = imgData.charCodeAt(i) & 0xff; // 비트 마스킹을 통해 msb를 보호한다.
					}
					// Blob 객체를 image/png 타입으로 생성한다. (application/octet-stream도 가능)
					blob = new Blob([view], {type: 'image/png'});
					
					
					window.navigator.msSaveOrOpenBlob(blob, tt_filename);
				}
			}catch(e){
				console.dir(e);
			}
		}

	}else{
		//범례클릭처리
		var lao = M.o()['legendArrObj'];
		if(lao != null){
			for(var g=0; g < lao.dataArr.length; g++){
				var legend = lao.dataArr[g];

				if(M.hitTestLegend(legend, lastX, lastY))
				{
					if(sessionStorage.getItem(M.o()['id']+'_'+'drawLegend'+g) == 'false'){
						sessionStorage.setItem(M.o()['id']+'_'+'drawLegend'+g,'true');	
						M.o()['series'][g].s_draw = true;
					}else{
						sessionStorage.setItem(M.o()['id']+'_'+'drawLegend'+g,'false');	
						M.o()['series'][g].s_draw = false;
					}		
					M.mainCanvas.style.cursor = 'pointer';
					var legendArrObj = M.o()['legendArrObj'];

					M.fillRect(
							'rgba(255,255,255,1)',
							'1',
							legendArrObj.x-1,
							legendArrObj.y-legendArrObj.height-1,
							legendArrObj.width+2,
							legendArrObj.height+2,
							M.mainCanvasBufferCtx
							);			
					M.drawLegend2(g);			
				}else{
					if(sessionStorage.getItem(M.o()['id']+'_'+'drawLegend'+g) == null){
						sessionStorage.setItem(M.o()['id']+'_'+'drawLegend'+g,'true');
						M.o()['series'][g].draw = 'true';					
					}								
				}
			}	


				
			M.drawBackground();	
			M.drawYAxis();//|
			M.drawYAxisR();// |	
			if(M.o()['xAxisMarkShow']){
				M.drawXAxis();
			}
			M.drawSeries();
			if(M.o()['mainTitleShow']){
				M.drawMainTitle();	
			}
			if(M.o()['legendShow'] != false){
				M.drawBottomTitle();
			}
			if(M.o()['gradientLegendShow']){
				M.drawGradient();
			}
			M.drawLines();//|
				
			M.mainCanvasMidBufferCtx.clearRect(0, 0, M.mainCanvasMidBuffer.width, M.mainCanvasMidBuffer.height);
			M.mainCanvasMidBufferCtx.drawImage(M.mainCanvasBuffer,0,0);				
			M.mainCanvasCtx.clearRect(0, 0, M.mainCanvas.width, M.mainCanvas.height);
			M.mainCanvasCtx.drawImage(M.mainCanvasMidBuffer,0,0);	
		}
	
	}
	_event.preventDefault();
	_event.stopPropagation();
	_event.stopImmediatePropagation();
	return false;
};
HChart.prototype.drawCrossLinesMobile = function(M,_touchEvent) {
	//
	HChart.prototype.drawCrossLines(M,_touchEvent.targetTouches[0]);
	_touchEvent.preventDefault();
	_touchEvent.stopPropagation();
	_touchEvent.stopImmediatePropagation();
	return false;
};

HChart.prototype.hitTestLegend = function(Obj,mouseX,mouseY) {
	if(((mouseX > Obj.x) && (mouseX < (Obj.x + Obj.width))) && ((mouseY < Obj.y) && (mouseY > (Obj.y - Obj.height))))
		return true;
	else
		return false;
};
HChart.prototype.drawCrossLines = function(M,_event) {
	if(!M.o()['goDraw']){
		return;
	}
	var lastX = (_event.offsetX || (_event.pageX - M.mainCanvas.offsetLeft));
	var lastY = _event.offsetY || (_event.pageY - M.mainCanvas.offsetTop);	
	var mouseLastY = lastY;	
	M.mainCanvasMidBufferCtx.clearRect(0, 0, M.mainCanvasMidBuffer.width, M.mainCanvasMidBuffer.height);
	M.mainCanvasMidBufferCtx.drawImage(M.mainCanvasBuffer,0,0);
	if(M.o()['pivot_mode'] == 'XY'){		
			//vertical draw!
			if(M.getLeftAxisWidth() < lastX && lastX < (M.getLeftAxisWidth()+M.getBottomAxisWidth())){				
				var ex = lastX;
				var point;
				if(M.o()['xrange_axis']){
					point = M.getMagneticX_range(ex);
					var mx;
					if(point != null){
						mx = point['physical'];
						if(M.o()['crossLineShow']){
							M.drawLine(M.o()['axis_stroke_color'],1,
									M.f(mx),
									M.f(M.o()['top_margin']),
									M.f(mx),
									M.f(M.o()['top_margin']+M.getLeftAxisHeight()),
									
									M.mainCanvasMidBufferCtx);
						}
						
					}
					var y_icon = 0;
					if(M.o()['tooltipStyle']== 'inbox'){	
						y_icon = M.o()['top_margin']+M.o()['tooltip_and_box_gep']+12;
					}else{
						y_icon = M.o()['top_margin']-M.o()['tooltip_and_box_gep'];								
					}

					
					var by;
					var v;

					if(M.o()['tooltipShow'] != false){

						if(M.o()['rpTooltipUse']){	
							
							if(point != null){								
								v = point['value'];
								var arr = point['arrayData'];
								if(arr != null){

									var lastYArrayAbs = [];
									var lastYObject = {};
									var lastYObjectV = {};
									var lastYObjectLY = {};
									var lastThisData = {};
									for(var k=0;k < arr.length; k++){
										v = arr[k][1];

										var bar_width = 120;
										var bar_height = 25+M.o()['series'].length*25;
										var bar_title_height = 30;
										lastY = M.toPhysicalVal_L_Y(
											v,
											M.o()['series'][M.o()['minmax']['xCntMaxSIndex']]['s_min'],
											M.o()['series'][M.o()['minmax']['xCntMaxSIndex']]['s_max']);
	
										var x1 = M.getLeftAxisWidth();
										var x2 = M.getLeftAxisWidth()+M.getBottomAxisWidth();
										var y1 = M.o()['top_margin'];
										var y2 = M.o()['top_margin']+M.getLeftAxisHeight();
										var cx = x1+((x2-x1)/2);
										var cy = y1+((y2-y1)/2);
										var bgep = 4;
										var bx;
										
										if((lastX > cx || lastX == cx) && (lastY < cy || lastY == cy)){//1
											bx = mx-bar_width-bgep;
											by = lastY+bgep;										
										}else if((lastX < cx || lastX == cx) && (lastY < cy || lastY == cy)){//2
											bx = mx+bgep;
											by = lastY+bgep;
										}else if((lastX < cx || lastX == cx) && (lastY > cy || lastY == cy)){//3
											bx = mx+bgep;
											by = lastY-bar_height-bgep;		
										}else if((lastX > cx || lastX == cx) && (lastY > cy || lastY == cy)){//4
											bx = mx-bar_width-bgep;
											by = lastY-bar_height-bgep;										
										}
										var a = Math.abs(lastY-mouseLastY);
										lastYArrayAbs.push(a);
										lastYObject[a] = by;
										lastYObjectV[a] = v;
										lastYObjectLY[a] = lastY;
										lastThisData[a] = arr[k];
										
									}//for(var k=0;k < arr.length; k++){	
									if(lastYObject != null){
										lastYArrayAbs.sort(function(a,b){											
											return a-b;
										});
										by = lastYObject[lastYArrayAbs[0]];
										v  = lastYObjectV[lastYArrayAbs[0]];
										lastY = lastYObjectLY[lastYArrayAbs[0]];
										thisData = lastThisData[lastYArrayAbs[0]];

										point["value"] = v;
									}
									
									
									/////////////////////////////////////////////////////////////////////////////////////////////
									var coord = {'x':'','y':''};
									
									if(typeof point != 'undefined' && point != null){
										coord['x'] = point['logical'];
										coord['y'] = M.toLogicalVal_L_Y(
												lastY,
												M.o()['series'][M.o()['minmax']['xCntMaxSIndex']]['s_min'],
												M.o()['series'][M.o()['minmax']['xCntMaxSIndex']]['s_max']).toFixed(2);	
										try{
											var xLabel = '';
											if(M.o()['xrange_axis_label_mapping']){
												if(M.o()['xrange_axis_label_map'][point['logical']] != null){
													xLabel = M.o()['xrange_axis_label_map'][point['logical']];
												}else{
													xLabel = "";
												}
											}else{
												xLabel = M.comma(point['logical']);								
											}
											if((point['value'] != null) && (point['label'] != null)){

												coord_text = M.o()['unitLabel_Hori']+' '+xLabel+' '+M.o()['xunit']+' ('+M.o()['unitLabel_Verti']+M.comma(point['value'])+' '+point['s_unit']+','+point['label']+') ';
											}else if(point['value'] != null){

												coord_text = M.o()['unitLabel_Hori']+' '+xLabel+' '+M.o()['xunit']+' ('+M.o()['unitLabel_Verti']+M.comma(point['value'])+' '+point['s_unit']+') ';
											}else{

												coord_text = M.o()['unitLabel_Hori']+' '+xLabel+' '+M.o()['xunit']+' ';					
											}	
											coord_text_x = xLabel+' '+M.o()['xunit'];
											coord_text_y = ' '+M.comma(point['value'])+' '+point['s_unit'];		
											var tmp1 = M.mainCanvasMidBufferCtx.measureText((M.o()['unitLabel_Hori']+' : '+ coord_text_x)).width;
											var tmp2 = M.mainCanvasMidBufferCtx.measureText((M.o()['unitLabel_Verti']+' : '+ coord_text_y)).width;
											var boxWidthMax = -9999999;
											if(tmp1 > tmp2){
												boxWidthMax = tmp1;
												
											}else{
												boxWidthMax = tmp2;
												
											}
											bar_width = boxWidthMax+4+4;
											if((lastX > cx || lastX == cx) && (lastY < cy || lastY == cy)){//1
												bx = mx-bar_width-bgep;
																					
											}else if((lastX < cx || lastX == cx) && (lastY < cy || lastY == cy)){//2
												bx = mx+bgep;
												
											}else if((lastX < cx || lastX == cx) && (lastY > cy || lastY == cy)){//3
												bx = mx+bgep;
												
											}else if((lastX > cx || lastX == cx) && (lastY > cy || lastY == cy)){//4
												bx = mx-bar_width-bgep;
																				
											}
										

		
										}catch(e){
											console.log(e);
										}
										
									}else{
										coord_text = '';
									}
									

									/////////////////////////////////////////////////////////////////////////////////////////////		
											
											
									M.drawRect(
											M.o()['rpTooltipBorderColor'],
											1,
											M.f(bx),
											M.f(by),
											bar_width,bar_height,
											M.mainCanvasMidBufferCtx
											);

									M.fillRect(
											M.o()['rpTooltipColor'],
											1,
											M.f(bx),
											M.f(by),
											bar_width,bar_height,
											M.mainCanvasMidBufferCtx
											);
									M.fillRect(
											M.o()['rpTooltipTitleBgColor'],
											1,
											M.f(bx),
											M.f(by),
											bar_width,bar_title_height,
											M.mainCanvasMidBufferCtx
											);											

									M.mainCanvasMidBufferCtx.font = M.o()['tooltipFont'];
									M.mainCanvasMidBufferCtx.fillStyle = M.o()['rpTooltipTitleTxtColor'];
									M.mainCanvasMidBufferCtx.fillText(M.o()['unitLabel_Hori']+' : '+ coord_text_x,
											M.f(bx)+4,
											M.f(by)+16
											);												
									M.mainCanvasMidBufferCtx.font = M.o()['tooltipFont'];
									M.mainCanvasMidBufferCtx.fillStyle = M.o()['rpTooltipTxtColor'];
									M.mainCanvasMidBufferCtx.fillText(M.o()['unitLabel_Verti']+' : '+ coord_text_y,
											M.f(bx)+4,
											M.f(by)+45
											)

									
									
									
									
								}
								
								
									
											
											
							}
	
						}//if(M.o()['rpTooltipUse']){
						else{
							
							
							/////////////////////////////////////////////////////////////////////////////////////////////

							if(typeof point != 'undefined' && point != null){
								try{
									var xLabel = '';
									if(M.o()['xrange_axis_label_mapping']){
										if(M.o()['xrange_axis_label_map'][point['logical']] != null){
											xLabel = M.o()['xrange_axis_label_map'][point['logical']];
										}else{
											xLabel = "";
										}
									}else{
										xLabel = M.comma(point['logical']);								
									}
									if((point['value'] != null) && (point['label'] != null)){

										coord_text = M.o()['unitLabel_Hori']+' '+xLabel+' '+M.o()['xunit']+' ('+M.o()['unitLabel_Verti']+M.comma(point['value'])+' '+point['s_unit']+','+point['label']+') ';
									}else if(point['value'] != null){

										coord_text = M.o()['unitLabel_Hori']+' '+xLabel+' '+M.o()['xunit']+' ('+M.o()['unitLabel_Verti']+M.comma(point['value'])+' '+point['s_unit']+') ';
									}else{

										coord_text = M.o()['unitLabel_Hori']+' '+xLabel+' '+M.o()['xunit']+' ';					
									}	

								}catch(e){
									console.log(e);
								}
								
							}else{
								coord_text = '';
							}
							/////////////////////////////////////////////////////////////////////////////////////////////	
							
						}

						
						
						/*좌상단툴팁*/	
						if(coord_text != 'undefined' && typeof coord_text != 'undefined'){
							M.mainCanvasMidBufferCtx.font = M.o()['tooltipFont'];
							M.mainCanvasMidBufferCtx.fillStyle = M.o()['commonTextColor'];
							M.mainCanvasMidBufferCtx.fillText(coord_text,
									M.f(M.getLeftAxisWidth()),
									y_icon
									);		
						}

						
					}
	
					//horizontal draw!
					if(M.o()['top_margin'] < lastY && lastY < (M.o()['top_margin']+M.getLeftAxisHeight())){
						if(M.o()['crossLineShow']){	
							if(point != null){	
								/*
								var v = point['value'];
								if(by != null){
									lastY = by;									
								}else{
									lastY = M.toPhysicalVal_L_Y(
										v,
										M.o()['series'][M.o()['minmax']['xCntMaxSIndex']]['s_min'],
										M.o()['series'][M.o()['minmax']['xCntMaxSIndex']]['s_max']);
								}
								*/
								if(M.o()['crossLineShow_hori']){
									M.drawLine(M.o()['axis_stroke_color'],1,
											M.f(M.getLeftAxisWidth()),
											M.f(lastY),
											M.f(M.getLeftAxisWidth()+M.getBottomAxisWidth()),
											M.f(lastY),
											
											M.mainCanvasMidBufferCtx);
								}		
							}
	
						}
						
					}	

			
					M.mainCanvasCtx.clearRect(0, 0, M.mainCanvas.width, M.mainCanvas.height);
					M.mainCanvasCtx.drawImage(M.mainCanvasMidBuffer,0,0);	
				}else{
					point = M.getMagneticX(ex);
					var lao = M.o()['legendArrObj'];
					if(lao != null){
						for(var g=0; g < lao.dataArr.length; g++){
							var legend = lao.dataArr[g];

							if(M.hitTestLegend(legend, lastX, lastY))
							{
								M.mainCanvas.style.cursor = 'pointer';
								var legendArrObj = M.o()['legendArrObj'];
								M.fillRect(
										'rgba(255,255,255,1)',
										'1',
										legendArrObj.x-1,
										legendArrObj.y-legendArrObj.height-1,
										legendArrObj.width+2,
										legendArrObj.height+2,
										M.mainCanvasBufferCtx
										);							
								M.drawLegend2(g);
								point = null;		
								break;
							}else{
								M.mainCanvas.style.cursor = 'default';
							}
						}	
					}

					

					if(point != null){
						var mx = point['physical'];
						var x_label_start = M.f(M.getLeftAxisWidth());
						var x_label_r_start = M.f(M.getLeftAxisWidth()+M.getBottomAxisWidth());
						var v = 0;
						var space = 5;
						var y_icon;
			
						if(M.o()['tooltipStyle']== 'inbox'){	
							y_icon = M.o()['top_margin']+M.o()['tooltip_and_box_gep']+12;
						}else{
							y_icon = M.o()['top_margin']-M.o()['tooltip_and_box_gep'];								
						}
						

									
						var y_icon_gep = y_icon-M.option['font_size']-space;
						var bar_height = y_icon_gep/2;
						M.mainCanvasMidBufferCtx.font = M.option['tooltipFont'];
						var coord_text = '';
						var coord_text_y = '';
						var z=0;
						var z_real=0;
						var maxBoxWidth = -999999;
						var z0 =0;
						$.each(point, function(key, obj) { 
							var s_name = M.o()['series'][z0].s_name;
							var tmp = M.o()['unitLabel_Hori']+obj['label'];
							var tmp3 = s_name+' : '+ obj['value'];						
							if(z0 == 0){
								var tmp2 = M.mainCanvasMidBufferCtx.measureText(tmp).width;
								if(tmp2 > maxBoxWidth){
									maxBoxWidth = tmp2;
								}	
							}


							var tmp4 = M.mainCanvasMidBufferCtx.measureText(tmp3).width+10;
							if(tmp4 > maxBoxWidth){
								maxBoxWidth = tmp4;
							}	
								
							z0++;
						});
						maxBoxWidth += 10;
						maxBoxWidth += 16;

						var si = 1;
						var sCnt = 0;

						for(var f=0; f < M.o()['series'].length; f++){
							
							if(M.o()['series'][f].s_draw){
								sCnt++;												
							}
							
						}						
						$.each(point, function(key, obj) { 
							var s_draw 			= M.o()['series'][z].s_draw;
							
							if(s_draw){
								var s_data 			= M.o()['series'][z].s_data;

								var s_color 		= M.getSColor(M,z);
								var s_shapeColor 	= M.getSpColor(M,z);
								
								var s_lineWidth 	= M.o()['series'][z].s_lineWidth; 
								var s_shape 		= M.o()['series'][z].s_shape;
								
								var s_sizeDefault 	= M.o()['series'][z].s_sizeDefault;
								
								var s_chartType 	= M.o()['series'][z].s_chartType;
								var s_name 			= M.o()['series'][z].s_name;
								var s_axis 			= M.o()['series'][z].s_axis;
								var s_unit 			= M.o()['series'][z].s_unit;
								var s_colors 		= M.o()['series'][z].s_colors;
		
								if(mx == null){
									mx = obj['physical'];
								}
								if(M.o()['tooltipShow'] != false){
									if(v == 0){
										if(coord_text == ''){
											//coord_text += M.o()['unitLabel_Hori']+':'+point[key]['label'];
											coord_text = M.o()['unitLabel_Hori']+':'+point[key]['label'];

												M.mainCanvasMidBufferCtx.fillStyle = M.o()['commonTextColor'];
												M.mainCanvasMidBufferCtx.font = M.o()['tooltipFont'];
												M.mainCanvasMidBufferCtx.fillText(coord_text,
														x_label_start,
														y_icon
														);				
												x_label_start = x_label_start+ M.mainCanvasMidBufferCtx.measureText(coord_text).width+space;	



										}	
									}
								}
								si++;
								var coord = {'x':'','y':''};
								var x_tooltip_start;

								if(typeof obj != 'undefined' && obj != null){
									if(obj['value'] != null){
											
											M.mainCanvasMidBufferCtx.font = M.o()['tooltipFont'];
											M.mainCanvasMidBufferCtx.fillStyle = M.o()['commonTextColor'];
											if(obj['axis'] == 'R'){
											}else{
												x_tooltip_start = x_label_start;							
											};
											var ov;
											if(M.o()['toFixedY'] != null){
												ov = parseFloat(obj['value']).toFixed(M.o()['toFixedY']);
											}else{
												ov = obj['value'];
											}
											
											
											if(!M.o()['x_label_extension']){
		
												if(M.o()['xrange_axis']){
													coord_text = '['+obj['logical']+':'+obj['physical']+' '+ov+obj['unit']+']';
												}else{
													coord_text = '['+obj['name']+':'+M.comma(ov)+obj['unit']+']';
												};
		
											}else{
												if(M.o()['xrange_axis']){
													//라벨제거
													//coord_text = obj['label']+'['+obj['logical']+':'+obj['physical']+' '+ov+obj['unit']+']      ';
													coord_text = '['+obj['logical']+':'+obj['physical']+' '+ov+obj['unit']+']      ';
												}else{
													if(si == 2){//첫번째 인덱스
														//coord_text = obj['label']+'   ['+obj['name']+':'+M.comma(ov)+obj['unit']+']      ';
														coord_text = '['+obj['name']+':'+M.comma(ov)+obj['unit']+']  ';
														
													}else{
														coord_text = '['+obj['name']+':'+M.comma(ov)+obj['unit']+']  ';
														
													}
													
												};
											}


											coord_text_x = obj['label']+' ';
											coord_text_y = ' '+M.comma(obj['value'])+'';												
											var width_text = M.mainCanvasMidBufferCtx.measureText(coord_text).width;
											if(obj['axis'] == 'R'){
												x_label_r_start = x_label_r_start- width_text;
												x_tooltip_start = x_label_r_start;
											}else{
											};
											var bar_width = width_text/2;
											

											var s_color = M.getSColor(M,v);
											var s_colors = M.o()['series'][v].s_colors;
											if(s_color == null || s_color == ''){
												s_color = M.o()['colorList'][v];
											}				
											var txtStartPos = x_tooltip_start;
										
										

											var tooltipY = 0;

											if(M.o()['tooltipStyle']== 'inbox'){	
												tooltipY = M.o()['top_margin']+M.o()['tooltip_and_box_gep']+12;
											}else{
												tooltipY = M.o()['top_margin']-M.o()['tooltip_and_box_gep'];									
											}
											if(M.o()['tooltipShow'] != false){
												M.mainCanvasMidBufferCtx.font = M.o()['tooltipFont'];
												M.mainCanvasMidBufferCtx.fillText(coord_text,
														txtStartPos,
														tooltipY
														);	
											}
										/////////////////////////////////////////////////////////////////////////////	
						
											if(M.o()['rpTooltipUse']){	
												var bar_width = maxBoxWidth;
												var bar_title_height = 30;
												var seriesGep = M.o()['gep_space'] + M.getFontHeight(M.o()['legendFont']);


												var bar_height = bar_title_height+(sCnt+2)*seriesGep;
										
												var x1 = M.getLeftAxisWidth();
												var x2 = M.getLeftAxisWidth()+M.getBottomAxisWidth();
												var y1 = M.o()['top_margin'];
												var y2 = M.o()['top_margin']+M.getLeftAxisHeight();
												var cx = x1+((x2-x1)/2);
												var cy = y1+((y2-y1)/2);
												var bgep = 4;

												var bx;
												var by;
												if((lastX > cx || lastX == cx) && (lastY < cy || lastY == cy)){//1
													bx = mx-bar_width-bgep;
													by = lastY+bgep;										
												}else if((lastX < cx || lastX == cx) && (lastY < cy || lastY == cy)){//2
													bx = mx+bgep;
													by = lastY+bgep;
												}else if((lastX < cx || lastX == cx) && (lastY > cy || lastY == cy)){//3
													bx = mx+bgep;
													by = lastY-bar_height-bgep;		
												}else if((lastX > cx || lastX == cx) && (lastY > cy || lastY == cy)){//4
													bx = mx-bar_width-bgep;
													by = lastY-bar_height-bgep;										
												}
												if(z_real == 0){
													M.drawRect(
															M.o()['rpTooltipBorderColor'],
															1,
															M.f(bx),
															M.f(by),
															bar_width,bar_height+6,
															M.mainCanvasMidBufferCtx
															);

													M.fillRect(
															M.o()['rpTooltipColor'],
															1,
															M.f(bx),
															M.f(by),
															bar_width,bar_height+6,
															M.mainCanvasMidBufferCtx
															);
													M.fillRect(
															M.o()['rpTooltipTitleBgColor'],
															1,
															M.f(bx),
															M.f(by),
															bar_width,bar_title_height-6,
															M.mainCanvasMidBufferCtx
															);											
												}		
												var gg = 16;	

												M.mainCanvasMidBufferCtx.font = M.o()['tooltipFont'];
												M.mainCanvasMidBufferCtx.fillStyle = M.o()['rpTooltipTitleTxtColor'];
												M.mainCanvasMidBufferCtx.fillText(M.o()['unitLabel_Hori']+' : '+ coord_text_x,
														M.f(bx)+4,
														M.f(by)+gg
														);				
												var _y1 = M.f(by)+32+(z_real+1)*gg;
												var x_position = M.f(bx)+4;
												var tooltip = true;
												var boxHeight = M.getFontHeight(M.o()['legendFont']);

												M.drawLegend(
													s_color,
													s_shapeColor,					
													x_position+boxHeight,
													M.o()['gep_space'],
													_y1-16,
													s_sizeDefault,
													'',
													s_sizeDefault,
													s_shape,
													s_chartType,
													s_lineWidth,
													s_colors,
													M.mainCanvasMidBufferCtx,
													tooltip,
													obj['j'],
													z,M.o()['series'].length,null);												
												M.mainCanvasMidBufferCtx.font = M.o()['tooltipFont'];
												M.mainCanvasMidBufferCtx.fillStyle = M.o()['rpTooltipTxtColor'];
												var tmpLabel = coord_text_y;
												coord_text_y = coord_text_y.replace(/\,/g,'');
												if(coord_text_y != null && typeof coord_text_y != 'undefined'){
													if(parseFloat(coord_text_y) == parseInt(coord_text_y)){
														coord_text_y = parseInt(coord_text_y);
													}else{
														coord_text_y = parseFloat(coord_text_y).toFixed(M.o()['toFixedY']);
													}
												}
												
												M.mainCanvasMidBufferCtx.fillText(s_name+' : '+tmpLabel ,
														x_position+16,
														_y1
														)	
												



											}	
										//}									
										/////////////////////////////////////////////////////////////////////////////
										
										if(M.o()['showToolTipChartType']){		
													
											if(obj['chartType'] == 'bar'){
												try{
													if(M.o()['randomColorUse']){
														var arr = M.o()['randomColor'];
														var ar = arr.length;
														var na = (point[key]['j']+1)%(ar);
														var randomColor = M.o()['randomColor'][na];
														var randomColorText = 'rgba('+randomColor.red+','+randomColor.green+','+randomColor.blue+',1)';	
														s_color = randomColorText;
													}

													var jIndex = obj['j'];
													var nowColor;
													var nowBorderColor;
													var j2 = 0;
													if(s_colors == null){
														nowColor = s_color;
													}else{
														if(jIndex%(5*s_colors.length) == 0){
															j2 = 0;
														}else{
															j2 = parseInt(jIndex%(5*s_colors.length));
														}

														nowColor = 'rgba('+s_colors[jIndex%s_colors.length]+','+(1-parseInt(j2/s_colors.length)*0.2)+')';
														nowBorderColor = 'rgba('+s_colors[jIndex%s_colors.length]+','+(1)+')'; 
													}
													M.drawRect(
															nowBorderColor,
															1,
															txtStartPos,
															y_icon_gep-bar_height,
															bar_width,bar_height,
															M.mainCanvasMidBufferCtx
															);

													M.fillRect(
															nowColor,
															1,
															txtStartPos,
															y_icon_gep-bar_height,
															bar_width,bar_height,
															M.mainCanvasMidBufferCtx
															);
															
												}catch(e){
													console.dir(e);
												}
												
												
											}else{
												try{
													
													M.mainCanvasMidBufferCtx.font = M.o()['commonFont'];
													//꺽은Line 툴팁!
													M.drawLine(M.o()['series'][v].s_color,obj['lineWidth'],
															x_tooltip_start+bar_width/4,
															y_icon_gep,
															x_tooltip_start+ width_text/4,
															y_icon_gep-bar_height/2,
															M.mainCanvasMidBufferCtx);	
													M.drawLine(M.o()['series'][v].s_color,obj['lineWidth'],
															x_tooltip_start+ width_text/4,
															y_icon_gep-bar_height/2,
															x_tooltip_start+ width_text/4 +bar_width/4,
															y_icon_gep,
															M.mainCanvasMidBufferCtx);	
													M.drawLine(M.o()['series'][v].s_color,obj['lineWidth'],
															x_tooltip_start+ width_text/4 +bar_width/4,
															y_icon_gep,
															x_tooltip_start+ width_text/4+ width_text/4 +bar_width/4,
															y_icon_gep-bar_height/4,
															M.mainCanvasMidBufferCtx);														
												}catch(e){
													console.dir(e);
												}
												
											}
										}
										if(obj['axis'] == 'R'){
										}else{
											x_label_start = x_label_start+ M.mainCanvasMidBufferCtx.measureText(coord_text).width;						
										}								
										
										
									}else{
										coord_text = '';	
									}
									
								}else{
									coord_text = '';
								}
								z_real++;
							}
							z++;v++;
							
						});
						
						if(M.o()['crossLineShow']){
							
							M.drawLine(M.o()['axis_stroke_color'],1,
									M.f(mx),M.f(M.o()['top_margin'])+M.getMarkGepLeft(),
									M.f(mx),M.f(M.o()['top_margin']+M.getLeftAxisHeight()),
									M.mainCanvasMidBufferCtx);
						}	
						
					}
				}					
				}
				
				
			if(point != null){
			}
			//horizontal draw!
		
			
			M.mainCanvasCtx.clearRect(0, 0, M.mainCanvas.width, M.mainCanvas.height);
			M.mainCanvasCtx.drawImage(M.mainCanvasMidBuffer,0,0);
	}else{
		
		//vertical draw!
		if(M.o()['top_margin'] < lastY && lastY < (M.o()['top_margin']+M.getLeftAxisHeight())){
			var ex = lastY;
			var point = M.getMagneticX(ex);
			if(point != null){
				var mx = point['physical'];
				if(M.o()['crossLineShow']){
					M.drawLine(M.o()['axis_stroke_color'],1,M.f(M.getLeftAxisWidth()),M.f(mx),M.f(M.getLeftAxisWidth()+M.getBottomAxisWidth()),M.f(mx),M.mainCanvasMidBufferCtx);
				}
			}
		}
		if(M.getLeftAxisWidth() < _event.pageX && _event.pageX < (M.getLeftAxisWidth()+M.getBottomAxisWidth())){
			if(mx != null){
				if(M.o()['crossLineShow']){
					M.drawLine(M.o()['axis_stroke_color'],1,M.f(lastX),M.f(M.o()['top_margin']),M.f(lastX),M.f(M.o()['top_margin']+M.getLeftAxisHeight()),M.mainCanvasMidBufferCtx);	
				}
			}
				
		}
		
		var coord = {'x':'','y':''};
		var coord_text = '';
		if(typeof point != 'undefined' && point != null){
			coord['x'] = parseInt(M.f(point['logical']));
			coord['y'] = M.toLogicalVal_B(lastX).toFixed(2);			
			coord_text = '( '+coord['x']+" , "+coord['y']+' )';
		}else{
			coord_text = '';
		}
		M.mainCanvasMidBufferCtx.fillStyle = M.o()['color'];		
		M.mainCanvasMidBufferCtx.font = M.o()['tooltipFont'];
		M.mainCanvasMidBufferCtx.fillText(coord_text,
				M.f(M.getLeftAxisWidth()),
				M.o()['top_margin']-M.o()['mark_then_gep']
				);			
		M.mainCanvasCtx.clearRect(0, 0, M.mainCanvas.width, M.mainCanvas.height);
		M.mainCanvasCtx.drawImage(M.mainCanvasMidBuffer,0,0);	
		
	}		
};

HChart.prototype.getMagneticX_range = function(_ex) {

	var reObj = {};
	var ex_logical;//마우스가 위치한곳의 X
	var x_1_plus_size;//x_1의 X+size
	var ex_logical_start;//마우스가 위치한곳의 X
	if(this.o()['pivot_mode'] == 'XY'){
		ex_logical = this.toLogicalVal_B_X(_ex);
	}else{
		ex_logical = this.toLogicalVal_L(_ex);
	}
	var x;
	for(var i=0;i< this.o()['series'].length; i++){
		var s_data 			= this.o()['series'][i].s_data;
		var s_unit 			= this.o()['series'][i].s_unit;
		var s_map 			= this.o()['series'][i].s_map;
		if(s_map == null){
			s_map = {};
		}
		reObj['s_unit'] 	= s_unit;
		var s_sizeDefault;
		if(ex_logical_start == null){
			s_sizeDefault = this.o()['series'][i].s_sizeDefault;
			ex_logical_start = this.toLogicalVal_B_X(_ex);
		}

		for(var j=0;j < s_data.length; j++){
			//-36.50/2016-02-10 12:30:00/824
			x 		= parseFloat(s_data[j][0]);
			var x_label = s_data[j][2];
			var y_value = s_data[j][1];

			var x_1;
			var x_1_label;
			var y_1_yalue;
			var arrayData;
			if(j == (s_data.length-1)){//마지막데이터확인중이면
				//x_1 	= x*2;//수정from
				x_1 	= parseFloat(s_data[j][0]);//수정to
				x_1_label 	= s_data[j][2];
				y_1_yalue 	= s_data[j][1];				
			}else{
				x_1 	= parseFloat(s_data[j+1][0]);	
				x_1_label 	= s_data[j+1][2];
				y_1_yalue 	= s_data[j+1][1];
			}
					
			x_1_plus_size = this.toPhysicalVal_B_X(x_1)+parseFloat(s_sizeDefault);
			//x_minus_size = this.toPhysicalVal_B_X(x)-parseFloat(s_sizeDefault);
			var x_val_mid = ((x+x_1)/2);
			var x_mid 	= x_val_mid;

			if(
					((x < ex_logical_start || x == ex_logical_start) && (ex_logical_start < x_1))
			
			){
				var physic;
				if(
						 (ex_logical_start < x_mid || ex_logical_start == x_mid)
				){
					if(this.o()['pivot_mode'] == 'XY'){
						physic = this.toPhysicalVal_B_X(x);
					}else{
						physic = this.toPhysicalVal_L(x);
					}
					reObj['logical'] = x;
					reObj['label'] = x_label;
					reObj['value'] = y_value;
					reObj['arrayData'] = s_map[x];
				}else{
					if(this.o()['pivot_mode'] == 'XY'){
						physic = this.toPhysicalVal_B_X(x_1);
					}else{
						physic = this.toPhysicalVal_L(x_1);
					}		
					reObj['logical'] = x_1;
					reObj['label'] = x_1_label;
					reObj['value'] = y_1_yalue;
					reObj['arrayData'] = s_map[x_1];					
				}	
				
				reObj['physical'] = physic;

				return reObj;
			}else 			if(
					((x > ex_logical_start || x == ex_logical_start) && (ex_logical_start > x_1))							
			){
				/* minus xAxis */
				var physic;
				if(
						 (ex_logical_start > x_mid || ex_logical_start == x_mid)
				){
					if(this.o()['pivot_mode'] == 'XY'){
						physic = this.toPhysicalVal_B_X(x);
					}else{
						physic = this.toPhysicalVal_L(x);
					}
					reObj['logical'] = x;
				}else{
					if(this.o()['pivot_mode'] == 'XY'){
						physic = this.toPhysicalVal_B_X(x_1);
					}else{
						physic = this.toPhysicalVal_L(x_1);
					}		
					reObj['logical'] = x_1;
				}
				
				reObj['physical'] = physic;
	
				return reObj;
			}else if(
					(x_1 == ex_logical_start)
			){//왼쪽 끝좌표선택하기

				//ex_logical_start > x_1
				if(this.o()['pivot_mode'] == 'XY'){
					physic = this.toPhysicalVal_B_X(x_1);
				}else{
					physic = this.toPhysicalVal_L(x_1);
				}
				reObj['label'] = x_label;
				reObj['logical'] = x_1;
				reObj['physical'] = physic;
				//reObj['value'] = y_value;//2017.04.24 scatter update
				reObj['value'] = y_1_yalue;//2017.04.24 scatter update
				reObj['arrayData'] = s_map[x_1];//2017.04.24 scatter update

	
				
				return reObj;
				
	
				
			}else if(
					(x > ex_logical_start )
			){//왼쪽 끝좌표선택하기
		
				//ex_logical_start > x_1
				if(this.o()['pivot_mode'] == 'XY'){
					physic = this.toPhysicalVal_B_X(x);
				}else{
					physic = this.toPhysicalVal_L(x);
				}
				reObj['label'] = x_label;
				reObj['logical'] = x;
				reObj['physical'] = physic;
				reObj['value'] = y_value;
				reObj['arrayData'] = s_map[x];
				return reObj;
			
			}else if(
					(x == x_1 && (this.toLogicalVal_B_X(x_1_plus_size) > ex_logical_start))
			){	
	
				if(this.o()['pivot_mode'] == 'XY'){
					physic = this.toPhysicalVal_B_X(x_1);
				}else{
					physic = this.toPhysicalVal_L(x_1);
				}
				reObj['label'] = x_label;
				reObj['logical'] = x_1;
				reObj['physical'] = physic;
				reObj['value'] = y_value;
				reObj['arrayData'] = s_map[x_1];
				return reObj;		

			}else{

			}
		}
	}
	return null;
};


HChart.prototype.getMagneticX = function(_ex) {
	var markGep = this.getMarkGepBottom();
	
	var x;
	var startx_axis = this.getLeftAxisWidth();
	var startx 	= this.getBottomAxisMarkStart();
	var endx_axis = this.getBottomAxisWidthStart()+this.getBottomAxisWidth();
	if(startx_axis < _ex < endx_axis){
			var s_data 			= this.o()['series'][0].s_data;
			var j = parseInt((_ex-startx)/markGep);
			var xval_range_start = startx+j*markGep-(markGep/2);
			var xval = startx+j*markGep;
			var xval_range_end 	 = startx+j*markGep+(markGep/2);

			if(xval_range_start < _ex 
				&& _ex < xval_range_end){
				
				var aPointSeriesMap = {};
				for(var i=0;i< this.o()['series'].length; i++){
					var data 			= this.o()['series'][i].s_data;
					var s_name 			= this.o()['series'][i].s_name;
					var reObj = {};
					reObj['name'] 		= s_name;
					if(data[j][2] == null){
						reObj['label'] 		= data[j][0];	
					}else{
						reObj['label'] 		= data[j][0]+':'+data[j][2];	
					}
					reObj['j'] 		= j;
					reObj['value'] 		= data[j][1];
					reObj['logical'] 	= xval;
					reObj['physical'] 	= xval;
					reObj['chartType'] 	= this.o()['series'][i].s_chartType;	
					reObj['lineWidth'] 	= this.o()['series'][i].s_lineWidth;
					reObj['axis'] 		= this.o()['series'][i].s_axis;
					if(this.o()['series'][i].s_unit != null){
						reObj['unit'] 		= this.o()['series'][i].s_unit;
					}
					aPointSeriesMap[s_name] = reObj;
				}
				return aPointSeriesMap;
			}
			
			var reObj = {};
			j = parseInt((_ex-startx)/markGep)+1;//다음 막대의 전반부일때
			xval_range_start = startx+j*markGep-(markGep/2);
			xval = startx+j*markGep;
			xval_range_end 	 = startx+j*markGep+(markGep/2);

			if(xval_range_start < _ex 
				&& _ex < xval_range_end){
				var aPointSeriesMap = {};
				for(var i=0;i< this.o()['series'].length; i++){
					var data 			= this.o()['series'][i].s_data;
					var s_name 			= this.o()['series'][i].s_name;
					var reObj = {};
					reObj['name'] 		= s_name;
					try{
						if(data[j] != null){
							if(data[j][2] == null){
								reObj['label'] 		= data[j][0];	
							}else{
								reObj['label'] 		= data[j][0]+':'+data[j][2];	
							}
							reObj['j'] 		= j;
							reObj['value'] 		= data[j][1];
							reObj['logical'] 	= xval;
							reObj['physical'] 	= xval;			
							reObj['chartType'] 	= this.o()['series'][i].s_chartType;	
							reObj['lineWidth'] 	= this.o()['series'][i].s_lineWidth;
							reObj['axis'] 		= this.o()['series'][i].s_axis;
							reObj['unit'] 		= this.o()['series'][i].s_unit;					
							aPointSeriesMap[s_name] = reObj;	
						}
					}catch(e){
						console.dir('================');
						console.dir(data[j]);
						console.dir(e);
						break;
					}

				}

				return aPointSeriesMap;				
			}			
	}
	return null;
};

HChart.prototype.init = function(_option) {
	
	this.mainCanvasCtx = this.mainCanvas.getContext("2d");
	this.mainCanvasBufferCtx = this.mainCanvasBuffer.getContext("2d");
	this.mainCanvasMidBufferCtx = this.mainCanvasMidBuffer.getContext("2d");
	
	this.resize();
	
	this.mainCanvasBufferCtx.clearRect(0,0,this.mainCanvas.width,this.mainCanvas.height);
	
	

	
	if(_option.series != null && _option.series.length > 0 && _option.series[0]['s_y_mark_cnt'] != null){
		_option.y_mark_cnt 				= _option.series[0]['s_y_mark_cnt'];	
	}
	if(_option['yAxisCalcMethod'] != 'manual' && _option['minmaxset'] != true){

		if(_option['bothYAxis']){
			var _s_y_mark_cnt = null;
			for(var i=0;i < _option.series.length; i++){
				var _s_max = -9999999999;
				var _s_min = 9999999999;
			
				var aMax = _option.series[i]['s_max'];
				if(aMax > _s_max){
					_s_max = aMax;
				}
				var aMin = _option.series[i]['s_min'];
				if(aMin < _s_min){
					_s_min = aMin;
				}		
				if(_s_max != -9999999999 && _s_min != 9999999999){
					var o2 = chartUtil.getMax(_s_max,_s_min);	


					_option.series[i]['s_max'] = o2['reMax'];
					_option.series[i]['s_min'] = o2['reMin'];
					if(_s_y_mark_cnt == null){
						_option['y_mark_cnt'] = o2['divNum'];
						_s_y_mark_cnt = _option['y_mark_cnt'];						

					}else{
						_option['y_mark_cnt'] = _s_y_mark_cnt;
					}
					_option.series[i]['y_mark_cnt'] = _s_y_mark_cnt;

					if(_option.series[i]['s_axis'] != 'R'){
						if(_option.min == null){
							var m = o2['reMax']-o2['reMin'];
							var addVal = m/_option['y_mark_cnt'];
							_option.series[i]['s_min'] -= addVal;//최소값늘리고
							_option['y_mark_cnt'] +=1;
						}else{						
							_option.series[i]['s_min'] = _option.min;
						}							
					}else{
						if(_option.min_R == null){
							var m = o2['reMax']-o2['reMin'];
							var addVal = m/_option['y_mark_cnt'];
							_option.series[i]['s_min'] -= addVal;//최소값늘리고
							if(_option['y_mark_cnt'] == null){
								_option['y_mark_cnt'] +=1;
							}
						}else{						
							_option.series[i]['s_min'] = _option.min_R;
						}											
					}


						
		
					_option['minmaxset'] = true;

				}else{		
					
					this.setOption(_option);
					return;
				}				
			}

			
		}else{
			var _s_max = -9999999999;
			var _s_min = 9999999999;
			var _s_y_mark_cnt = 1;
			for(var i=0;i < _option.series.length; i++){
				var aMax = _option.series[i]['s_max'];
				if(aMax > _s_max){
					_s_max = aMax;
				}
				var aMin = _option.series[i]['s_min'];
				if(aMin < _s_min){
					_s_min = aMin;
				}		
			}
			if(_s_max != -9999999999 && _s_min != 9999999999){
					
				var o2;
				if(_option.min == null){
					o2 = chartUtil.getMax(_s_max,_s_min);
				}else{
					o2 = chartUtil.getMax(_s_max,_option.min);
				}

				for(var i=0;i < _option.series.length; i++){
					_option.series[i]['s_max'] = o2['reMax'];

					_option.series[i]['s_min'] = o2['reMin'];
					_option['y_mark_cnt'] = o2['divNum'];
					if(_option.min == null){
						var m = o2['reMax']-o2['reMin'];
						var addVal = m/_option['y_mark_cnt'];
						_option.series[i]['s_min'] -= addVal;//최소값늘리고
						_option['y_mark_cnt'] +=1;
					}else{
						_option.series[i]['s_min'] = _option.min;
					}	
						
				}			
				_option['minmaxset'] = true;
				
			}else{		
				this.setOption(_option);
				return;
			}
			
			
		}


		
		
	}

	if(_option['barVertical']){
		for(var i=0;i< _option.series.length; i++){
			if(_option.series[i]['s_min'] < 0){
				_option.series[i]['s_min'] = 0;
			}	
		}	
	}

	this.setOption(_option);

	

	this.option['font'] = this.option['font_weight']+ ' ' +this.option['font_size']+'px '+this.option['font_name'];
	this.mainCanvasBufferCtx.font = this.option['font'];
	if(this.o()['type'] == 'pie' || this.o()['type'] == 'doughnut' || this.o()['type'] == 'radial'){
		this.o()['bottomLabelMaxHeight'] = 0;//11 바닥여백없애기1
		this.o()['bottom_legend_box_height'] = 0;//40 바닥여백없애기2
		this.o()['bottom_legend_box_top_margin'] = 0;//5 바닥여백없애기3
		this.o()['bottom_legend_box_bottom_margin'] = 0;//5 바닥여백없애기4
		this.o()['top_margin'] = 20;//상단여백줄이기

		
	}
	
	this.o()['leftLabelMaxWidth']  		= this.mainCanvasBufferCtx.measureText(this.o()['minmax']['xLabelMax']).width;
	var maxStr= this.o()['series'][0].s_max+'';

	if(this.o()['leftLabelMaxWidthXY'] == null){
		this.o()['leftLabelMaxWidthXY']  		= this.mainCanvasBufferCtx.measureText(maxStr).width+this.o()['leftLabelMaxWidthXYAddGep'];
	}
	

	this.o()['fontHeight'] 				= this.o()['font_size'];
	this.o()['leftLabelMaxHeight'] 		= this.o()['fontHeight'];
	this.o()['bottomLabelMaxWidth']  	= this.mainCanvasBufferCtx.measureText(this.comma(this.o()['minmax']['max'])).width;
	this.o()['bottomLabelMaxHeight']  	= this.o()['fontHeight'];
	this.o()['leftAxisWidth'] 			= this.o()['leftLabelMaxWidth'];
										+ 	this.o()['left_legend_box_width']
										+ 	this.o()['left_legend_box_left_margin']
										+ 	this.o()['left_legend_box_right_margin'];
	
	this.o()['bottomAxisHeight'] 		= this.o()['bottomLabelMaxHeight']
										+ 	this.o()['bottom_legend_box_height']
										+ 	this.o()['bottom_legend_box_top_margin']
										+ 	this.o()['bottom_legend_box_bottom_margin'];
	
//////////////////////////////방사형옵션 start////////////////////////	
	/*
	var xm;
	var ym;
	xm = (this.mainCanvas.width- this.o()['right_margin']-this.getLeftAxisWidthPerAxis())/2;

	ym = this.getLeftAxisHeight()/2-25;
	if(xm > ym){
		this.o()['radius'] = ym;		
	}else{
		
		this.o()['radius'] = ym;	
	}
	*/
	
	var circleR = 0;
	if(!this.o()['guideLineShow']){
		if(this.mainCanvasMidBuffer.width > this.mainCanvasMidBuffer.height){
			circleR = this.mainCanvasMidBuffer.height/2-10;
		}else{
			circleR = this.mainCanvasMidBuffer.width/2-10;
		}
	}else{
		if(this.mainCanvasMidBuffer.width > this.mainCanvasMidBuffer.height){
			circleR = this.mainCanvasMidBuffer.height/2;
		}else{
			circleR = this.mainCanvasMidBuffer.width/2;
		}	

		
	}
	var mr = this.o()['mininal_rate'];
	if(this.o()['guideLineShow']){
		if(mr == null){
			mr = 2;
		}
		circleR -= circleR/mr;	
	}else{
		if(mr == null){
			mr = 7;
		}
		circleR -= circleR/mr;			
	}
	this.o()['radius'] = circleR;

	//this.o()['centerX']					= this.f(this.getLeftAxisWidth()+this.getBottomAxisWidth()/2);
	this.o()['centerX']					= this.f(this.mainCanvas.width/2);
	//this.o()['centerY']					= this.f(this.getLeftAxisHeight()+this.o()['top_margin']-this.getLeftAxisHeight()/2+this.o()['mark_width']/2);
	this.o()['centerY']					= this.f(this.mainCanvas.height/2);
	
	
						
	this.o()['valueSum']				= null;
//////////////////////////////방사형옵션 end////////////////////////
	
	if(this.o()['colorObj'] == null){
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
		var colourGradientObject 		= new ColourGradient(0, 255, colours);
		this.o()['colorObj']	= colourGradientObject;	
	}
	if(this.o()['colorType'] == null){
		this.o()['colorList'] = this.o()['colorObj'].getColorList('all');	
	}else if(this.o()['colorType'] == 'light'){
		this.o()['colorList'] = this.o()['colorObj'].getColorList('light');
	}else if(this.o()['colorType'] == 'dark'){
		this.o()['colorList'] = this.o()['colorObj'].getColorList('dark');		
	}else{
		this.o()['colorList'] = this.o()['colorObj'].getColorList('all');	
	}
	this.o()['colorList'] = this.o()['colorList'].concat(this.o()['colorList']);

	var colorsRandom = [
			{red: 0,green: 0,blue: 0},
			{red: 1,green: 97,blue: 183},
			{red: 12,green: 171,blue: 193},
			{red: 10,green: 187,blue: 35},
			{red: 113,green: 198,blue: 7},
			{red: 232,green: 244,blue: 20},
			{red: 255,green: 167,blue: 33},
			{red: 234,green: 101,blue: 0},
			{red: 100,green: 128,blue: 0},
			{red: 55,green: 101,blue: 114}
	];
	
	this.o()['randomColor'] = colorsRandom;

};

HChart.prototype.resize = function() {
	var M = this;
	var cw = this.container.width();
	var ch = this.container.height();
	this.mainCanvas.width = cw;
	this.mainCanvas.height = ch;
	this.mainCanvasBuffer.width = this.mainCanvas.width;
	this.mainCanvasBuffer.height = this.mainCanvas.height;
	this.mainCanvasMidBuffer.width = this.mainCanvas.width;
	this.mainCanvasMidBuffer.height = this.mainCanvas.height;
};

HChart.prototype.redraw = function(_option,_param1) {
	this.resize();
    var goDraw = false;
	if(_option['series'].length > 0){
		var s_data = _option['series'][0].s_data;
		var s_draw = _option['series'][0].s_draw;
		//if(s_data != null && s_data.length > 0 && s_draw){
		if(s_data != null && s_data.length > 0){	
			goDraw = true;
			_option['goDraw'] = goDraw;
		}else{
			_option['goDraw'] = false;
		}			
	}else{
		_option['goDraw'] = false;
	}

	this.init(_option);
	try{
	    var ctx=this.mainCanvasBufferCtx;
	    var m = this;

		

		if(goDraw){
			if(m.o()['useSave']){
				m.img.onload=function(){
					try{
						var img_resource_map1 = m.o()['img_resource_map1'];
						var img_resource_obj1 = {};
						if(img_resource_map1 != null){
							img_resource_map1.keys;
							for(var key in img_resource_map1){
								var val = img_resource_map1[key];
								var img_tmp = new Image();
								img_tmp.src = imgDir+val;
								img_tmp.id = key;
								img_tmp.onload=function(){
									img_resource_obj1[this.id] = this;
									if(img_resource_map1.length == img_resource_obj1.length){
										m.o()['img_resource_obj1'] = img_resource_obj1;
										m.drawStart(_param1,ctx);
									}					
								};							
							}

						}else{
							m.drawStart(_param1,ctx);
						}

					}catch(e){
						console.log(e);
					}
				};
				m.img.src=imgDir+"common/btn_gcm_save.png";	
			}else{
				try{
					var img_resource_map1 = m.o()['img_resource_map1'];
					var img_resource_obj1 = {};
					if(img_resource_map1 != null){
						img_resource_map1.keys;
						for(var key in img_resource_map1){
							var val = img_resource_map1[key];
							var img_tmp = new Image();
							img_tmp.src = imgDir+val;
							img_tmp.id = key;
							img_tmp.onload=function(){
								img_resource_obj1[this.id] = this;
								if(img_resource_map1.length == img_resource_obj1.length){
									m.o()['img_resource_obj1'] = img_resource_obj1;
									m.drawStart(_param1,ctx);
								}					
							};							
						}

					}else{
						m.drawStart(_param1,ctx);
					}

				}catch(e){
					console.log(e);
				}
			
			}

		}else{
			m.draw(null,null,false);
			ctx.globalAlpha = m.o()['globalAlpha'];
			ctx.globalAlpha = 1;	        
	    	m.mainCanvasMidBufferCtx.clearRect(0, 0, m.mainCanvasMidBuffer.width, m.mainCanvasMidBuffer.height);
	    	m.mainCanvasMidBufferCtx.drawImage(m.mainCanvasBuffer,0,0);
	    	m.mainCanvasCtx.clearRect(0, 0, m.mainCanvas.width,m.mainCanvas.height);
	    	m.mainCanvasCtx.drawImage(m.mainCanvasMidBuffer,0,0);	
			//m.mainCanvasBufferCtx.globalCompositeOperation = 'destination-over';
		}
	}catch(e){
		console.dir(e);
	}
};
HChart.prototype.drawStart = function(_param1,ctx) {
	this.draw(_param1);
	ctx.globalAlpha = this.o()['globalAlpha'];
	/*		
	this.drawRect(
			'rgba(70,70,70,1)',
			1,
			this.getBottomAxisWidth()+this.getLeftAxisWidth()+1,
			this.o()['top_margin'],
			this.img.width,
			this.img.height,
			ctx
			);	
	*/		

	ctx.drawImage(this.img,0,0,this.img.width,this.img.height,
			this.getBottomAxisWidth()+this.getLeftAxisWidth()+1,this.o()['top_margin'],
			this.img.width,this.img.height);

	ctx.globalAlpha = 1;	        
	this.mainCanvasMidBufferCtx.clearRect(0, 0, this.mainCanvasMidBuffer.width, this.mainCanvasMidBuffer.height);
	this.mainCanvasMidBufferCtx.drawImage(this.mainCanvasBuffer,0,0);
	this.mainCanvasCtx.clearRect(0, 0, this.mainCanvas.width,this.mainCanvas.height);
	this.mainCanvasCtx.drawImage(this.mainCanvasMidBuffer,0,0);
};


								
								

HChart.prototype.getDefaultOption = function() {
	return this.defaultOption;
};
HChart.prototype.setDefaultOption = function(_defaultOption) {
	this.defaultOption = _defaultOption;
};
HChart.prototype.setOption = function(_option) {
	var OPTOBJ = this;
	$.each( _option, function( key, value ) {
		if(typeof value != 'object'){
				if(typeof value == 'undefined'){
				}else{
					try{
						if(typeof value == 'string'){
							OPTOBJ.option[key] = value;
						}else if(typeof value == 'number'){
							OPTOBJ.option[key] = value;
						}else if(typeof value == 'boolean'){
							//this.use_right_axis_only
							OPTOBJ.option[key] = JSON.parse(value);
						}
					}catch(e){
						alert('option error!');
						if(window.console != null) console.dir(e);
					}
				}
		}else{
			OPTOBJ.option[key] = value;
		}
	});
	OPTOBJ.setMinMax();
	/*
	if(window.console != null) console.dir('[OPTION]------------------------------------');
	if(window.console != null) console.dir(this.o());
	*/
};
HChart.prototype.o = function() {
	return this.option;
};

HChart.prototype.createOption = function() {
	return jQuery.extend(true, {}, this.getDefaultOption());
};

//HChart.prototype.draw = function(_option,_param1) {
HChart.prototype.draw = function(_option,_param1,_isDraw) {
	if(_isDraw == null){
		_isDraw = true;
	}
	if(_isDraw){
		
		if(this.o()['type'] == 'pie' || this.o()['type'] == 'doughnut'){		
			this.drawBackground();
			this.drawMainTitleRadial();	
			if(_param1 != null){
				this.drawSeriesPie(_param1);
			}else{
				this.drawSeriesPie();
			}
				
		}else if(this.o()['type'] == 'radial'){		
			this.drawSeriesRadial();			
		}else{
			this.drawBackground();	
			this.drawYAxis();//|
			this.drawYAxisR();// |	
			if(this.o()['xAxisMarkShow']){
				this.drawXAxis();
			}
			this.drawSeries();
			if(this.o()['mainTitleShow']){
				this.drawMainTitle();	
			}
			if(this.o()['legendShow'] != false){
				this.drawBottomTitle();
			}
			if(this.o()['gradientLegendShow']){
				this.drawGradient();
			}
			this.drawLines();//|
		}	
		
		
	}else{

		this.mainCanvasBufferCtx.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
		this.mainCanvasBufferCtx.fillStyle = 'rgba(255,255,255,1)';
		this.mainCanvasBufferCtx.fillRect(0,0,this.mainCanvas.width, this.mainCanvas.height);
		this.drawNoData();
	}

};
HChart.prototype.drawNoData = function() {
		var str = 'no data!';
		var str_size = this.mainCanvasBufferCtx.measureText(str).width;
		this.mainCanvasBufferCtx.fillStyle = 'rgba(0,0,0,1)';
		this.mainCanvasBufferCtx.fillText(str,
				(this.mainCanvas.width-str_size)/2,
				(this.mainCanvas.height-11)/2
				);		
};
HChart.prototype.drawMainTitle = function(_option) {
	if(this.o()['chartTitle'] != null){
		this.mainCanvasBufferCtx.font 	= this.o()['mainTitleFont'];
		this.mainCanvasBufferCtx.fillStyle = this.o()['commonTextColor'];
		var x = 0;
		if(this.o()['chartTitleAlign'] == 'left'){
			x = this.f(this.getBottomAxisWidthStart());
		}else{
			x = this.f((this.getBottomAxisWidthStart()+this.getBottomAxisWidth()/2)-this.mainCanvasBufferCtx.measureText(this.o()['chartTitle']).width/2);
		}

		var y = 0;
		if(this.o()['chartTitlePosition'] == 'boxOut'){
			y = this.o()['top_margin']-this.o()['mark_then_gep'];
		}else{
			y = this.o()['top_margin']+this.o()['fontHeight']+this.o()['mark_then_gep'];
		}		
		
		if(this.o()['chartTitleVAlign'] == 'bottom'){
			var _height1 = this.mainCanvas.height;		
			y = _height1-(this.o()['fontHeight']+this.o()['mark_then_gep']);
		}
		
		this.mainCanvasBufferCtx.fillText(this.o()['chartTitle'],
				x,
				y
				);		
	}
};
HChart.prototype.getMainTitleWidth = function(_option) {
	if(this.o()['chartTitle'] != null){
		this.mainCanvasBufferCtx.font 	= this.o()['mainTitleFont'];	
		return this.mainCanvasBufferCtx.measureText(this.o()['chartTitle']).width+20;
	}else{
		return 0;
	}
};
HChart.prototype.getMainTitleObj = function(_option) {
	var mainTitleObj = new Object();
	mainTitleObj.x = this.f(this.getLeftAxisWidth());
	mainTitleObj.y = this.o()['top_margin'];	
	if(this.o()['chartTitle'] != null){
		this.mainCanvasBufferCtx.font 	= this.o()['mainTitleFont'];
		mainTitleObj.width  = this.mainCanvasBufferCtx.measureText(this.o()['chartTitle']).width;
		mainTitleObj.height = parseFloat(this.getFontHeight(this.o()['mainTitleFont']));
		return mainTitleObj;
	}else{
		mainTitleObj.width = 0;
		mainTitleObj.height = 0;
		return mainTitleObj;
	}
};

HChart.prototype.drawMainTitleRadial = function(_option) {
	this.mainCanvasBufferCtx.fillStyle = this.o()['color'];
	this.mainCanvasBufferCtx.fillText(this.o()['unitLabel_3thVal'],
			this.getLeftAxisWidth(),
			this.o()['top_margin']
			);	
	if(this.o()['chartTitle'] != null){
			this.mainCanvasBufferCtx.font = this.o()['titleFont'];
			this.mainCanvasBufferCtx.fillStyle = this.o()['titleColor'];
			this.mainCanvasBufferCtx.fillText(this.o()['chartTitle'],
			this.f(this.getBottomAxisWidth()-this.mainCanvasBufferCtx.measureText(this.o()['chartTitle']).width/2),
			this.o()['top_margin']-this.o()['fontHeight']-this.o()['mark_then_gep']
			);
	}		
	
};
HChart.prototype.createLegendArrObj = function() {
	var legendArrObj = new Object();
	var legendArr = new Array();
	legendArrObj.titleRightMargin = 10;
	legendArrObj.txtVertiMargin = 2;
	legendArrObj.perLegendGep =4;
	
	var mainTitleObj = this.getMainTitleObj();
	this.mainCanvasBufferCtx.font = this.o()['legendFont'];
	var preItem = null;
	var _width = 0;
	var _height = 0;

	var _x1 = this.getLeftAxisWidth();
	var _width1 = this.getBottomAxisWidth();
	var _legend_range = _width1;

	var availableLegendWidth = _legend_range - (mainTitleObj.width+legendArrObj.titleRightMargin);
	var _row1Cnt = 0;
	for(var i=0; i<this.o()['series'].length; i++){
		var legendItem = new Object();
		legendItem.iconLabelGep = 2;
		var s_name 			= this.o()['series'][i].s_name;
		var s_chartType 	= this.o()['series'][i].s_chartType;

		var preStartX = 0;
		if(preItem){
			preStartX = preItem.x+preItem.width;		
		}else{
			if(mainTitleObj.width == 0){
				preStartX = this.f(this.getLeftAxisWidth());				
			}else{
				preStartX = this.f(this.getLeftAxisWidth())+mainTitleObj.width+legendArrObj.titleRightMargin;	
				legendArrObj.x = preStartX; 
			}

		}			

		legendItem.x = preStartX;
		legendItem.y =  mainTitleObj.y-legendArrObj.txtVertiMargin;	
		
		var labelObj = new Object();
		labelObj.height 	= parseFloat(this.getFontHeight(this.o()['legendFont']));
		labelObj.name 		= s_name;
		labelObj.width 		= this.mainCanvasBufferCtx.measureText(s_name).width;
		
		var iconObj = new Object();
		iconObj.width 		= labelObj.height;
		iconObj.height 		= iconObj.width;
		
		iconObj.shape 	= this.o()['series'][i].s_shape;
		if(preItem){
			iconObj.x = legendItem.x;				
		}else{
			iconObj.x = legendItem.x;
		}		
		
		iconObj.y = legendItem.y;
		legendArrObj.y = iconObj.y; 
		iconObj.fillColor = this.getSColor(this,i);
		iconObj.borderWidth = 1;
		

		labelObj.x = iconObj.x+iconObj.width+legendItem.iconLabelGep;	


		labelObj.y = 0;
		labelObj.strokeColor = this.o()['commonTextColor'];	
		

		legendItem.width = iconObj.width+labelObj.width+legendItem.iconLabelGep+legendArrObj.perLegendGep;
		legendItem.height = labelObj.height;


		legendArr[i] = legendItem;
		
		_width += legendItem.width;
		_height = legendItem.height;
		if(_width > availableLegendWidth){
			//해당 legend 2단으로 위치 재조정
			if(_row1Cnt == 0){
				_row1Cnt = i-1;
				if(mainTitleObj.width == 0){
					preStartX = this.f(this.getLeftAxisWidth());				
				}else{
					preStartX = this.f(this.getLeftAxisWidth())+mainTitleObj.width+legendArrObj.titleRightMargin;	
					legendArrObj.x = preStartX; 
				}	
				//legendArrObj.y -= iconObj.height; //2단이 되도 y는 우측아래기준이므로 불변이어야함
			}else{
				preStartX = preItem.x+preItem.width;
			}		
			legendItem.x = preStartX;
			legendItem.y =  mainTitleObj.y-legendArrObj.txtVertiMargin-iconObj.height-2;	
			iconObj.y -= iconObj.height;
			labelObj.y -= iconObj.height;			
			
			iconObj.x = legendItem.x;	
			labelObj.x = iconObj.x+iconObj.width+legendItem.iconLabelGep;
		}else{

			
		}

		legendItem.icon = iconObj;
		legendItem.label = labelObj;		
		preItem = legendItem;
	}	
	legendArrObj.dataArr = legendArr;
	legendArrObj.width = _width;
	legendArrObj.height = _height;
	if(_row1Cnt != 0){
		legendArrObj.height = _height*2+2;	//2단만 지원하므로	
	}
	legendArrObj.row1Cnt = _row1Cnt;
	return legendArrObj;
};
HChart.prototype.drawLegend2 = function(_selectdIdx) {	
	var legendArrObj;
	if(legendArrObj == null){
		legendArrObj = this.createLegendArrObj();
		this.o()['legendArrObj'] = legendArrObj;
	}

	var _x1 = this.getLeftAxisWidth();
	var _width1 = this.getBottomAxisWidth();
	var _legend_range = _x1 + _width1;
	var mainTitleObj = this.getMainTitleObj();
	var availableLegendWidth = _legend_range - (mainTitleObj.width+legendArrObj.titleRightMargin);

	
	for(var i=0;i< legendArrObj.dataArr.length; i++){
		var obj = legendArrObj.dataArr[i];
		if(_selectdIdx == i){
			obj.label.strokeColor = 'rgba(200,200,200,1)';		
		}
		var iconColor = '';
		if(sessionStorage.getItem(this.o()['id']+'_'+'drawLegend'+i) == 'false'){
			iconColor = 'rgba(200,200,200,1)';
		}else{
			iconColor = obj.icon.fillColor;
		}
		var iconBorderColor = '';
		if(sessionStorage.getItem(this.o()['id']+'_'+'drawLegend'+i) == 'false'){
			iconBorderColor = 'rgba(200,200,200,1)';
		}else{
			iconBorderColor = obj.label.strokeColor;
		}
		var textColor = '';
		if(sessionStorage.getItem(this.o()['id']+'_'+'drawLegend'+i) == 'false'){
			textColor = 'rgba(200,200,200,1)';
		}else{
			textColor = obj.label.strokeColor;
		}		


		if(obj.icon.shape == 'rect'){
			this.fillRect(
					iconColor,
					obj.icon.borderWidth,
					obj.icon.x,
					obj.y-obj.icon.height,
					obj.icon.width,
					obj.icon.height,
					this.mainCanvasBufferCtx
					);
			this.drawRect(
					iconBorderColor,
					obj.icon.borderWidth,
					obj.icon.x,
					obj.y-obj.icon.height,
					obj.icon.width,
					obj.icon.height,
					this.mainCanvasBufferCtx
					);		
		}else{
			this.drawArc4(
					iconBorderColor,
					iconColor,
					obj.icon.borderWidth,
					obj.icon.x+obj.icon.height/2,
					obj.y-obj.icon.height/2,
					obj.icon.width/2,
					null,
					null,
					this.mainCanvasBufferCtx);
		}
	


		this.mainCanvasBufferCtx.font = this.o()['legendFont'];	
		this.mainCanvasBufferCtx.fillStyle = obj.label.strokeColor;
		this.mainCanvasBufferCtx.fillText(
			obj.label.name,
			obj.label.x,
			obj.y
		);			
	}
};
HChart.prototype.drawBottomTitle = function(_option) {		
	try{
		var legendWidth = 100;
		var l_count = 0;
		var r_count = 0;
		var s_legendWidth = 0;
		var ln = this.o()['series'].length;
		if(ln > this.o()['legendMaxCount']){
			ln = this.o()['legendMaxCount'];
		}
		var gep = this.o()['gep_space']*3;
		var x_position_r;
		var x_position_l =0 ;
		var x_position;
		var boxWidthPreL = 0;
		var boxWidthPreR = 0;
		
		var x_tooltip_l_start;
		
		
		if(this.o()['legendPositionH'] == 'right'){
			x_tooltip_l_start = this.f(this.getLeftAxisWidth()+this.getBottomAxisWidth());
		}else{
			x_tooltip_l_start = this.f(this.getLeftAxisWidth());	
		}	
		/*
		if(this.o()['legendPosition'] == 'top'){
			x_tooltip_l_start += gep;
		}
		*/
		if(this.o()['legendPositionH'] == 'right'){
			x_tooltip_l_start -= gep;		
		}else if(this.o()['legendPosition'] == 'top'){
			x_tooltip_l_start += gep;
		}
		x_position_l = x_tooltip_l_start;//저장아이콘피해서.
		var reObj = {};
		reObj['x_position_l'] = x_position_l;
		reObj['gep'] = gep;

		if(this.o()['legendPositionH'] == 'right'){
			for(var i=ln-1;i > -1; i--){
				reObj = this.drawLegendProcess(i,ln,null,reObj);
				if(reObj['s_axis'] == 'R'){
					r_count++;
				}else{
					l_count++;
				}				
			}//for	top right
		}else if(this.o()['legendPositionH'] == 'titleRight'){
			var mtWidth = this.getMainTitleWidth();

			reObj['x_position_l'] = x_position_l+mtWidth;	
			for(var i=0;i< ln; i++){	
				reObj = this.drawLegendProcess(i,ln,mtWidth,reObj);					
				if(reObj['s_axis'] == 'R'){
					r_count++;
				}else{
					l_count++;
				}				
			}//for	top right
		}else if(this.o()['legendPositionH'] == 'titleRight2'){
			this.drawLegend2();
		}else{
			for(var i=0;i< ln; i++){
				reObj = this.drawLegendProcess(i,ln,null,reObj);				
				if(reObj['s_axis'] == 'R'){
					r_count++;
				}else{
					l_count++;
				}				
			}//for	top right
		}
		//차트테두리
		var _x1 = 0;
		var _y1 = 0;
		var _width1 = this.mainCanvas.width;
		var _height1 = this.mainCanvas.height;
		//TOP

		if(this.o()['showTopOutBorder']){
			this.drawLine(this.o()['chart_border_stroke_color'],1,
					_x1,_y1,
					_x1+_width1,_y1);	
		}
		//BOTTOM
		if(this.o()['showBottomOutBorder']){			
			this.drawLine(this.o()['chart_border_stroke_color'],1,
					_x1,_y1+_height1-1,
					_x1+_width1,_y1+_height1-1);
		}
		//RIGHT
		if(this.o()['showRightOutBorder']){	
			this.drawLine(this.o()['chart_border_stroke_color'],1,
					_x1+_width1-1,_y1,
					_x1+_width1-1,_y1+_height1);
		}		
		//LEFT	
		if(this.o()['showLeftOutBorder']){		
			this.drawLine(this.o()['chart_border_stroke_color'],1,
					_x1,_y1-1,
					_x1,_y1+_height1-1);
		}
	}catch(e){
		console.dir(e);
	}

};
HChart.prototype.drawLegendProcess = function(i,ln,_mtWidth,reObj){	
	x_position_l = reObj['x_position_l'];
	gep =  reObj['gep'];
	
	var returnObj = {};
	var s_data 			= this.o()['series'][i].s_data;
	var s_color 		= this.getSColor(this,i);


	if(s_color == null || s_color == ''){
		s_color = this.o()['colorList'][i];
	}
	
	var s_lineWidth 	= this.o()['series'][i].s_lineWidth; 
	var s_shape 		= this.o()['series'][i].s_shape;
	var s_sizeDefault 	= this.o()['series'][i].s_sizeDefault;
	var s_shapeColor 	= this.getSpColor(this,i);
	var s_chartType 	= this.o()['series'][i].s_chartType;
	
	var s_name 			= this.o()['series'][i].s_name;
	var s_axis 			= this.o()['series'][i].s_axis;

	var s_unit 			= this.o()['series'][i].s_unit;
	var s_colors 		= this.o()['series'][i].s_colors;
	var s_sizeDefaultFix = 2;
	var x_tooltip_start;

	var coord_text = s_name;

	this.mainCanvasBufferCtx.font = this.o()['legendFont'];
	var legendWidth = this.mainCanvasBufferCtx.measureText(coord_text).width;

	var boxWidth = legendWidth+this.getFontHeight(this.o()['legendFont']);//gep은 좌,우,센터
	//var boxWidth = legendWidth;

	//this.o()['legendPositionH']
	
	//var x_position_l=0;



	if(this.o()['legendPositionH'] == 'right'){
		//boxWidthPreL = boxWidth+gep;
		//x_position_l = x_position_l- (boxWidthPreL+gep);
		boxWidthPreL = boxWidth+gep;
		x_position_l = x_position_l- (legendWidth);		
	}else{
		
		if(i==0){
			boxWidthPreL = 0;	
		}else{
			boxWidthPreL = this.getFontHeight(this.o()['legendFont'])+gep;		
		}
		x_position_l = x_position_l+ (boxWidthPreL);		
		
	}

	x_position = x_position_l;

	var _y1;
	var legend_height_start = this.mainCanvas.height-this.o()['legendBottomGep']-20;
	if(this.o()['legendPosition'] == 'top'){
		_y1 = this.o()['top_margin'];
	}else{
		_y1 = legend_height_start;
	}		
	if(_mtWidth != null || this.o()['legendPositionH'] == 'right'){
		_y1 = this.o()['top_margin']-this.getFontHeight(this.o()['legendFont'])-8;
	}

	var re_x_position = this.drawLegend(
			s_color,
			s_shapeColor,					
			x_position,
			this.o()['gep_space'],
			_y1,
			boxWidth,
			coord_text,
			s_sizeDefaultFix,
			s_shape,
			s_chartType,
			s_lineWidth,
			s_colors,
			null,
			null,
			null,
			i,ln,s_data.length
			);
	
	if(this.o()['legendPositionH'] != 'right'){
		reObj['x_position_l'] = re_x_position+boxWidth+gep;
	}else{
		reObj['x_position_l'] = re_x_position-gep;	
	}

	reObj['s_axis'] = s_axis;
	return reObj;
};
HChart.prototype.drawLegend = function(
										s_color,
										s_shapeColor,
										x_position,
										gep,
										_y1,
										boxWidth,
										coord_text,
										s_sizeDefault,
										s_shape,
										s_chartType,
										s_lineWidth,
										s_colors,
										_ctx,
										_mode,
										_zIndex,
										_seriesIndex,_allSeriesCnt,dataLength) {
	if(_ctx == null){
		_ctx = this.mainCanvasBufferCtx;
	}								
											
											
					
	var boxTop = _y1+gep+2;
	var boxHeight = this.getFontHeight(this.o()['legendFont']);	
	var arcStartX = x_position+boxHeight+gep*2;		

	var boxGep;
	var txtStart = arcStartX;

	if((s_chartType == 'line' || s_chartType == 'scatter') && s_shape == 'circle'){
		boxGep = boxHeight/2;
		_ctx.font = this.o()['legendFont'];
		_ctx.fillStyle = this.o()['color'];
		//범례명
		_ctx.fillText(coord_text,
				x_position,
				boxTop+boxHeight
				);	
	
		x_position -= (gep+boxHeight);		
		this.drawArc4(
				s_color,
				s_shapeColor,
				s_lineWidth,
				x_position+boxHeight/2,
				_y1+boxHeight,
				boxHeight/2,
				null,
				null,
				_ctx);
			
	}else if(s_chartType == 'bar' || s_shape == 'rect'){
		boxGep = boxHeight;
		//var txtWidth = this.mainCanvasBufferCtx.measureText(coord_text).width;
		//x_position -= txtWidth;
		_ctx.font = this.o()['legendFont'];
		_ctx.fillStyle = this.o()['color'];
		//범례명
		_ctx.fillText(coord_text,
				x_position,
				boxTop+boxHeight
				);	
		x_position -= gep;		
				
		if(s_colors != null){
			
			//x_position -= txtWidth;

			if(_mode){
				var colorIndex = _zIndex%s_colors.length;
				for(var j=0;j < s_colors.length; j++){	
					if(j == colorIndex){
						var x1;
						var x2;
						if(this.o()['legendPositionH'] == 'titleRight'){
							x1 = x_position;
							x2 = x_position+boxHeight;
						}else{
							x1 = x_position+boxHeight/2;
							x2 = x_position;				
						}
						
						var alpha = 0;
						if(this.o()['colorDirection'] == 'left'){							
							alpha = ((1/_allSeriesCnt)+_seriesIndex*(1/_allSeriesCnt));
						}else{
							alpha = (1-_seriesIndex*(1/_allSeriesCnt));
						}
						this.drawLine(
								'rgba('+s_colors[j]+','+alpha+')',
								5,
								x1,
								_y1+gep+2+(12+4)/2,
								x2,
								_y1+gep+2+(12+4)/2,
								_ctx
								);
						if(j == s_colors.length-1){
				
						}else{
							x_position = x_position+boxHeight;			
						}					
						
					}
			
				}	
			}else{	
				//for(var j=0;j < s_colors.length; j++){
				var sLegendStart = s_colors.length-1;
				if(dataLength < s_colors.length){
					sLegendStart = dataLength-1;
				}
				for(var j=sLegendStart;j > -1; j--){	
						var x1;
						var x2;
						if(this.o()['legendPositionH'] == 'titleRight'){
							x1 = x_position-boxHeight/4/2;
							x2 = x_position+boxHeight/4;
						}else{
							//x1 = x_position+boxHeight/4/2;
							//x2 = x_position-boxHeight/4;	
							//라인으로 그리므로 우에서 좌로 그릴수있다.
							x1 = x_position;
							x2 = x_position-boxHeight;							
						}
						
						//_seriesIndex,_allSeriesCnt
						var alpha = 0;
						if(this.o()['colorDirection'] == 'left'){							
							alpha = ((1/_allSeriesCnt)+_seriesIndex*(1/_allSeriesCnt));
						}else{
							alpha = (1-_seriesIndex*(1/_allSeriesCnt));
						}
									
						this.drawLine(
								//'rgba('+s_colors[j]+','+(1)+')',
								'rgba('+s_colors[j]+','+alpha+')',
								5,
								x1,
								_y1+gep+2+(12+4)/2,
								x2,
								_y1+gep+2+(12+4)/2,
								_ctx
								);
								
						/*		
						if(j == s_colors.length-1){
				
						}else{
							x_position = x_position+boxHeight/4;			
						}
						*/
						x_position = x_position-boxHeight;
				}
			}
			arcStartX = x_position+boxGep+gep*2;	
			txtStart = arcStartX;
		}else{
			x_position -= boxHeight;
			if(!this.o()['randomColorUse']){
				var appColor = s_color;
				if(s_chartType == 'scatter'){
					appColor = s_shapeColor;
				}else{
					appColor = s_color;				
				}
				this.fillRect(
						appColor,
						1,
						x_position,
						_y1+boxHeight/2,
						boxHeight,
						boxHeight,
						_ctx
						);						
			}
			
			this.drawRect(
					'rgba(70,70,70,1)',
					1,
					x_position,
					_y1+boxHeight/2,
					boxHeight,
					boxHeight,
					_ctx
					);				
		}
	}


			
	if(this.o()['legendBoxShow']){			
		this.drawRect(
				s_color,
				1,
				x_position,
				boxTop,
				boxWidth,
				boxHeight+gep,
				_ctx
				);
	}		
	return x_position;
};

HChart.prototype.drawGradient = function(_option) {
	var colours = this.o()['colours'];
	var zmin = this.o()['zmin'];
	var zmax = this.o()['zmax'];
	var gep = (zmax - zmin)/colours.length;
	var i=0;
	
	var dVal = this.o()['dividCnt'];
	var dividTxtPer = this.o()['dividTxtPer'];
	
	var div = (zmax - zmin)/dVal;
	var boxHeight = this.o()['gradientBoxHeight'];
	boxHeight = (boxHeight*colours.length)/dVal;
	
	for(var v=zmin,i=0 ; v < zmax ; v=v+div,i++){
		var color = this.o()['colorObj'].getColour(v);
		var boxWidth  = this.o()['gradientBoxWidth'];

		var colorText = 'rgba('+color.red+','+color.green+','+color.blue+',1)';
		this.fillRect(
				colorText,
				1,
				this.getBottomAxisWidthEnd(),
				((this.getLeftAxisHeight()+this.o()['top_margin'])-boxHeight*i)-boxHeight,
				20,
				boxHeight
				);
				//console.log(parseInt(i) / 2);
		if(parseInt(i) % dividTxtPer == 0){
				if(v != zmin && Math.ceil(v) != zmax){
					this.mainCanvasBufferCtx.fillStyle = 'rgba(0,0,0,1)';
					this.mainCanvasBufferCtx.fillText((zmin+(div*(i))).toFixed(this.o()['toFixedZ']),
					this.getBottomAxisWidthEnd()+boxWidth+2,
					((this.getLeftAxisHeight()+this.o()['top_margin'])-boxHeight*i)+4
					);	
				}
		}		

	}
	this.mainCanvasBufferCtx.fillStyle = 'rgba(0,0,0,1)';
	this.mainCanvasBufferCtx.fillText(this.o()['unitLabel_3thVal'],
			this.getBottomAxisWidthEnd()+3,
			((this.getLeftAxisHeight()+this.o()['top_margin'])-boxHeight*(i))-20
			);	
	

};




HChart.prototype.drawSeries = function() {
	var pmode  = this.o()['pivot_mode'];
	if(pmode == 'XY'){
		var xCntMax = this.o()['minmax']['xCntMax'];
		var markCount = this.getMarkCountLeft();
		var barSeriesCount = 0;
		
		if(this.o()['barVertical']){
			for(var m=0;m< 1; m++){
			var _s_data 		= this.o()['series'][m].s_data;
			var s_chartType 	= this.o()['series'][m].s_chartType;
			if(s_chartType == 'bar'){
				var lastExistY = '';
				var sLabelPrintYn = false;
				var startx 	= this.getBottomAxisMarkStart();
				var markGep = this.getMarkGepBottom();
				for(var j=0,k=startx;j < _s_data.length; k+=markGep,j++){
					var height_keep=null;
					
					for(var i=0;i< this.o()['series'].length; i++){
						var s_data 			= this.o()['series'][i].s_data;
						var s_color 		= this.getSColor(this,i);
						var s_lineWidth 	= this.o()['series'][i].s_lineWidth; 
						var s_shape 		= this.o()['series'][i].s_shape;
						var s_sizeDefault 	= this.o()['series'][i].s_sizeDefault;
						var s_shapeColor 	= this.getSpColor(this,i);
						var s_chartType 	= this.o()['series'][i].s_chartType;


						var y = s_data[j][1];
						var xlabel = s_data[j][2];
						if(y != null && typeof y != 'undefined'){
							var px = k;								
							var py = this.toPhysicalVal_L_Y(y,this.o()['series'][i]['s_min'],this.o()['series'][i]['s_max']);
				
							lastExistY = py;
							var rectWidth = markGep/2;
							var rectWidthForSeries = rectWidth;
							var _x1 = px-rectWidth/2;//startx_axis 
							var _y1 = py;
							var _width1 = rectWidthForSeries;
							var _height1;
							if(height_keep == null){
								height_keep = _y1;
								_height1 = this.getLeftAxisHeight() + this.o()['top_margin'] - _y1-1;
							}else{
								_height1 = this.getLeftAxisHeight() + this.o()['top_margin'] - _y1-1;
								height_keep = height_keep -_height1-1;
							}

							if(s_color == null || s_color == ''){
								s_color = this.o()['colorList'][i];
							}
							this.drawRect(
									s_color,
									1,_x1,height_keep,_width1,_height1);
							this.fillRect(
									s_color,
									1,_x1,height_keep,_width1,_height1);

							if(!sLabelPrintYn){								
								if(typeof this.o()['series'][i]['unitLabel_Hori'] != 'undefined'){
									this.mainCanvasBufferCtx.fillStyle = this.o()['series'][i]['unitLabel_Hori_txtColor'];
									this.mainCanvasBufferCtx.fillText(this.o()['series'][i]['unitLabel_Hori'],
											this.f(px-this.mainCanvasBufferCtx.measureText(this.o()['series'][i]['unitLabel_Hori']).width),
											py
											);				
									sLabelPrintYn = true;
								}	
															
							}
							startx_axis = px; 
							starty = py;	
						}else{
							if(!sLabelPrintYn){
									if(typeof this.o()['series'][i]['unitLabel_Hori'] != 'undefined' && lastExistY != ''){
										this.mainCanvasBufferCtx.fillStyle = this.o()['color'];
										this.mainCanvasBufferCtx.fillText(this.o()['series'][i]['unitLabel_Hori'],
												this.f(px-this.mainCanvasBufferCtx.measureText(this.o()['series'][i]['unitLabel_Hori']).width),
												lastExistY
												);							
										sLabelPrintYn = true;		
									}	
							}
							startx_axis = null; 
							starty = null;				
						}
					}//for(var i=0;i< this.o()['series'].length; i++){
				}//step1 end
			/*}*/					
			}
				
		}
			
		}else{
			//BAR옆으로 그리기!!!
			//BAR차트만 개수세기
			
			for(var i=0;i< this.o()['series'].length; i++){
				var s_chartType 	= this.o()['series'][i].s_chartType;
				if(s_chartType == 'bar'){
					barSeriesCount++;
				}
			}
			
			//Bar차트만 시리즈로 그리기
			var drawTipArr = [];
			for(var i=0;i< this.o()['series'].length; i++){
				//여기1
				if(sessionStorage.getItem(this.o()['id']+'_'+'drawLegend'+i) == 'true' || (sessionStorage.getItem(this.o()['id']+'_'+'drawLegend'+i) == null && this.o()['series'][i].s_draw)){
					this.o()['series'][i].s_draw = true;
					var s_data 			= this.o()['series'][i].s_data;
					var s_color 		= this.getSColor(this,i);
					var s_lineWidth 	= this.o()['series'][i].s_lineWidth; 
					var s_shape 		= this.o()['series'][i].s_shape;
					var s_sizeDefault 	= this.o()['series'][i].s_sizeDefault;
					var s_shapeColor 	= this.getSpColor(this,i);
					var s_colors 		= this.o()['series'][i].s_colors;
					var s_chartType 	= this.o()['series'][i].s_chartType;
					if(s_chartType == 'bar'){
						
						var lastExistY = '';
						var sLabelPrintYn = false;
						var startx 	= this.getBottomAxisMarkStart();
						var markGep = this.getMarkGepBottom();
						var bargep;
						var j2 = 0;
						
						for(var j=0,k=startx;j < s_data.length; k+=markGep,j++){
							var y = s_data[j][1];
							var xlabel = s_data[j][2];
							if(y != null && typeof y != 'undefined'){
								var px = k;	
								var py = this.toPhysicalVal_L_Y(y,this.o()['series'][i]['s_min'],this.o()['series'][i]['s_max']);
								lastExistY = py;							
								var rectWidth = markGep/2;
								bargep = rectWidth/10;
								var rectWidthForSeries = (rectWidth-bargep*(barSeriesCount-1))/barSeriesCount;
								var _x1;//startx_axis 
								if(i == 0){
									_x1 = px-(rectWidth)/2+i*rectWidthForSeries;//gep없이 시작 
								}else{
									_x1 = px-(rectWidth)/2+i*(rectWidthForSeries+bargep);//gep만큼 띄우면서 연결
								}
								
								var _y1 = py;
								var _width1 = rectWidthForSeries;
								var lineDeepVal;//라인시작에의한 보정값
								lineDeepVal = -1;
								_y1 += 1;
								var _height1 = this.getLeftAxisHeight() + this.o()['top_margin'] - _y1+lineDeepVal;

								if(this.o()['gradientColorUse']){
									var gradiColor = this.o()['colorObj'].getColour(j);							
									var gradiColorText = 'rgba('+gradiColor.red+','+gradiColor.green+','+gradiColor.blue+',1)';	
									s_color = gradiColorText;
								}else if(this.o()['randomColorUse']){
									var arr = this.o()['randomColor'];
									var ar = arr.length;
									var na = (j+1)%(ar);
									var randomColor = this.o()['randomColor'][na];
									var randomColorText = 'rgba('+randomColor.red+','+randomColor.green+','+randomColor.blue+',1)';	
									s_color = randomColorText;
								}
								
								var nowColor;
								var nowBorderColor;
								if(s_colors == null){
									nowColor = s_color;
								}else{
									if(j%(5*s_colors.length) == 0){
										j2 = 0;
									}
									var alpha = 0;
									if(this.o()['colorDirection'] == 'left'){
										alpha = (((1/barSeriesCount)+parseInt(j2/s_colors.length)*0.2)+(i*(1/barSeriesCount)));
									}else{
										alpha = ((1-parseInt(j2/s_colors.length)*0.2)-(i*(1/barSeriesCount)));
									}
									
									nowColor = 'rgba('+s_colors[j%s_colors.length]+','+alpha+')';
									nowBorderColor = 'rgba('+s_colors[j%s_colors.length]+','+(1-(i*(1/barSeriesCount)))+')'; 
									j2++;
								}
								
								if(this.o()['valueGroupCnt'] > 0){
									if(j%this.o()['valueGroupCnt'] == 0){
										var endx = _width1*2+markGep/2;
										var _x1_end = this.getLeftAxisWidth()+this.getBottomAxisWidth();

				
										if((_x1+endx) > _x1_end){
											endx = _width1+markGep/2;
										}
										this.drawRect(
												nowBorderColor,
												1,_x1,_y1,endx,_height1);
			
									}							
								}else{
									this.drawRect(
											nowBorderColor,
											1,_x1,_y1,_width1,_height1);
									this.fillRect(
											nowColor,
											1,_x1,_y1,_width1,_height1);
									if(this.o()['x_label_extension']){
										//여기를 풀면 진해지고, bar2개 시리즈 커버됨
										var tipLinePos;
										if(barSeriesCount > 1){
											tipLinePos = px;
											var yyMax = -9999999999;
											for(var ii=0;ii< this.o()['series'].length; ii++){
												var s_data_tmp 	= this.o()['series'][ii].s_data;
												var yy = s_data_tmp[j][1];
												if(yy > yyMax){
													yyMax = yy;
												}										
											}		

											if(yyMax == y && drawTipArr[j] == null){
											//if(i == (this.o()['series'].length-1)){
												this.mainCanvasBufferCtx.font = this.o()['tooltipFont'];
												this.mainCanvasBufferCtx.fillStyle = this.o()['tooltipTextColor'];
												this.drawTipLine (this.o()['tooltipTextColor'],45,tipLinePos,_y1,_width1,30,xlabel,'center');
												drawTipArr[j] = true;												
											}
										}else{
											tipLinePos = _x1;
											this.mainCanvasBufferCtx.font = this.o()['tooltipFont'];
											this.mainCanvasBufferCtx.fillStyle = this.o()['tooltipTextColor'];
											this.drawTipLine (this.o()['tooltipTextColor'],45,tipLinePos,_y1,_width1,30,xlabel);
										}
										

									}										
								}


										
								if(!sLabelPrintYn){								
									if(typeof this.o()['series'][i]['unitLabel_Hori'] != 'undefined'){
										this.mainCanvasBufferCtx.fillStyle = this.o()['series'][i]['unitLabel_Hori_txtColor'];
										this.mainCanvasBufferCtx.fillText(this.o()['series'][i]['unitLabel_Hori'],
												this.f(px-this.mainCanvasBufferCtx.measureText(this.o()['series'][i]['unitLabel_Hori']).width),
												py
												);				
										sLabelPrintYn = true;
									}	
								}
								startx_axis = px; 
								starty = py;	
							}else{
								if(!sLabelPrintYn){
										if(typeof this.o()['series'][i]['unitLabel_Hori'] != 'undefined' && lastExistY != ''){
											this.mainCanvasBufferCtx.fillStyle = this.o()['color'];
											this.mainCanvasBufferCtx.fillText(this.o()['series'][i]['unitLabel_Hori'],
													this.f(px-this.mainCanvasBufferCtx.measureText(this.o()['series'][i]['unitLabel_Hori']).width),
													lastExistY
													);							
											sLabelPrintYn = true;
										}	
								}
								startx_axis = null; 
								starty = null;				
							}
						}//step1 end
					/*}*/					
					}

				}//draw is true
				else{
					this.o()['series'][i].s_draw = false;
				}
				//여기2
			}
		}

		
		//기타유형그리기
		for(var i=0;i< this.o()['series'].length; i++){
			//여기요1
			if(sessionStorage.getItem(this.o()['id']+'_'+'drawLegend'+i) == 'true' || (sessionStorage.getItem(this.o()['id']+'_'+'drawLegend'+i) == null && this.o()['series'][i].s_draw)){
				this.o()['series'][i].s_draw = true;
			var s_data 			= this.o()['series'][i].s_data;
			var s_color 		= this.getSColor(this,i);
			var s_lineWidth 	= this.o()['series'][i].s_lineWidth; 
			var s_shape 		= this.o()['series'][i].s_shape;
			var s_sizeDefault 	= this.o()['series'][i].s_sizeDefault;
			var s_shapeColor 	= this.getSpColor(this,i);
			var s_chartType 	= this.o()['series'][i].s_chartType;
			var s_lineLinkable 	= this.o()['series'][i].s_lineLinkable;
			var s_lineType 		= this.o()['series'][i].s_lineType;
			var s_rotate 		= this.o()['series'][i].s_rotate;
						
			var s_chartType_origin = s_chartType;
			if(s_chartType == 'ndSpline'){
				if(this.o()['gepApply']){
					s_chartType = 'scatter';									
				}else{
					s_chartType = 'line';
				}
				s_chartType = 'line';
			}


			if(s_chartType == 'image'){

				var lastExistY = '';
				var sLabelPrintYn = false;
				var startx 	= this.getBottomAxisMarkStart();
				var markGep = this.getMarkGepBottom();
				var startx_axis = null;
				var starty = null;
				for(var j=0,k=startx;j < s_data.length; k+=markGep,j++){
					var x = s_data[j][0];
					var y = s_data[j][1];
					var xlabel = s_data[j][2];

					if(y != null && typeof y != 'undefined'){						
						var px;	
						if(this.o()['xrange_axis']){
							var px = this.toPhysicalVal_B_X(x);	
						}else{
							var px = k;	
						}
						
						var py = this.toPhysicalVal_L_Y(y,this.o()['series'][i]['s_min'],this.o()['series'][i]['s_max']);
						lastExistY = py;
						
						var rectWidth = markGep-(markGep/s_data.length);
						var _x1 = px-rectWidth/2;//startx_axis 
						var _y1 = py;
						var _width1 = rectWidth;
						var _height1 = this.getLeftAxisHeight() + this.o()['top_margin'] - _y1-1;
						var color = this.o()['colorObj'].getColour(_x1%255);
						var colorText = 'rgba('+color.red+','+color.green+','+color.blue+',1)';
						startx_axis = px; 
						starty = py;	

						var img_map1 = this.o()['img_resource_obj1'];
						var imgObj;
						if(s_rotate){
							imgObj = img_map1['rotateImg'];
							
						}else{
							imgObj = img_map1[y+''];											
						}						
						if(startx_axis != null && imgObj != null){
/*
							var dh = 0;
							if(imgObj.height > this.getLeftAxisHeight()){
								dh = this.getLeftAxisHeight();
							}else{
								dh = imgObj.height;
							}
							var da = 0;
							if(imgObj.width > dh){
								da = dh;
							}else{
								da = imgObj.width;
							}
*/
							if(s_rotate){
								this.drawImg(
										imgObj,
										startx_axis-markGep/2/2,
										this.getLeftAxisHeight()/2 + this.o()['top_margin']-markGep/2/2,
										y,
										markGep/2,
										markGep/2
										);	
							}else{
								this.mainCanvasBufferCtx.drawImage(imgObj,
										startx_axis-markGep/2,
										this.o()['top_margin']+1 +((this.getLeftAxisHeight()-markGep)/2),
										markGep,
										markGep
										);	
							}
						}

			

					}else{
						if(!sLabelPrintYn){
								if(typeof this.o()['series'][i]['unitLabel_Hori'] != 'undefined' && lastExistY != ''){
									this.mainCanvasBufferCtx.fillStyle = this.o()['color'];
									this.mainCanvasBufferCtx.fillText(this.o()['series'][i]['unitLabel_Hori'],
											this.f(px-this.mainCanvasBufferCtx.measureText(this.o()['series'][i]['unitLabel_Hori']).width),
											lastExistY
											);							
									sLabelPrintYn = true;		
								}	
						}
						if(!s_lineLinkable){
							startx_axis = null; 
							starty = null;		
						}
									
					}
				}//step1 end
				
			}else if(s_chartType == 'area'){
				var lastExistY = '';
				var sLabelPrintYn = false;
				var startx 	= this.getBottomAxisMarkStart();
				var markGep = this.getMarkGepBottom();
				var startx_axis = null;
				var starty = null;
				

				
				var initHeight = this.getLeftAxisHeight()+this.o()['top_margin'];
				startx_axis = this.getLeftAxisWidth(); 
				starty = initHeight;		

				this.mainCanvasBufferCtx.strokeStyle = s_color;
				this.mainCanvasBufferCtx.beginPath();			
				this.mainCanvasBufferCtx.moveTo(startx_axis,starty);
		
				for(var j=0,k=startx;j < s_data.length; k+=markGep,j++){
					var x = s_data[j][0];
					var y = s_data[j][1];
					var xlabel = s_data[j][2];
					if(y != null && typeof y != 'undefined'){
						
						var px;	
						if(this.o()['xrange_axis']){
							var px = this.toPhysicalVal_B_X(x);	
						}else{
							var px = k;	
						}
						var py = this.toPhysicalVal_L_Y(y,this.o()['series'][i]['s_min'],this.o()['series'][i]['s_max']);
						lastExistY = py;
						
						var rectWidth = markGep-(markGep/s_data.length);
						var _x1 = px-rectWidth/2;//startx_axis 
						var _y1 = py;
						var _width1 = rectWidth;
						var _height1 = this.getLeftAxisHeight() + this.o()['top_margin'] - _y1-1;
						var color = this.o()['colorObj'].getColour(_x1%255);
						var colorText = 'rgba('+color.red+','+color.green+','+color.blue+',1)';
						//if(j != 0 && startx_axis != null){
						if(true){
							if(s_lineType == 'dash'){
								this.mainCanvasBufferCtx.setLineDash([2,3]);
							}
							/*	
							this.drawLine(s_color,s_lineWidth,
									startx_axis,starty,px,py);
							*/		
	
							var _ctx = this.mainCanvasBufferCtx;
							

							try{
								_ctx.translate(0.5, 0.5);
								_ctx.lineWidth = s_lineWidth;
							}catch(e){
								if(window.console != null) console.dir(e);
							}

							_ctx.lineTo(px,py);
							try{
								_ctx.translate(-0.5, -0.5);
							}catch(e){
								console.dir(e);
							}	

				



	
							if(s_lineType == 'dash'){
								this.mainCanvasBufferCtx.setLineDash([]);
							}								
						}else if(!sLabelPrintYn){								
							if(typeof this.o()['series'][i]['unitLabel_Hori'] != 'undefined'){
								this.mainCanvasBufferCtx.fillStyle = this.o()['series'][i]['unitLabel_Hori_txtColor'];
								this.mainCanvasBufferCtx.fillText(this.o()['series'][i]['unitLabel_Hori'],
										this.f(px-this.mainCanvasBufferCtx.measureText(this.o()['series'][i]['unitLabel_Hori']).width),
										py
										);
								sLabelPrintYn = true;
							}	
						}
						
	
						if(this.o()['valueShow']){
							//if(this.o()['value_show_min_hide'] && y == this.o()['series'][i]['s_min']){
								if(s_chartType_origin != 'ndSpline'){
									var txtWidth = this.mainCanvasBufferCtx.measureText(y).width;
									if(txtWidth < markGep){
										var px_start = px- txtWidth/2;
										var vsX;
										var vsY;
										if(this.o()['valueShowPosition'] == 'top'){
											vsX = px_start;
											vsY = py-6;								
										}else{
											vsX = px_start;
											vsY = py+12;		
										}	
										this.mainCanvasBufferCtx.font = this.o()['valueShowFont'];
										this.mainCanvasBufferCtx.fillStyle = this.o()['series'][i]['s_color'];
										this.mainCanvasBufferCtx.fillText(this.comma(y),
												vsX,
												vsY
												);					
									}								
								}
							//}	
						};	
						startx_axis = px; 
						starty = py;	
					}else{
						if(!sLabelPrintYn){
								if(typeof this.o()['series'][i]['unitLabel_Hori'] != 'undefined' && lastExistY != ''){
									this.mainCanvasBufferCtx.fillStyle = this.o()['color'];
									this.mainCanvasBufferCtx.fillText(this.o()['series'][i]['unitLabel_Hori'],
											this.f(px-this.mainCanvasBufferCtx.measureText(this.o()['series'][i]['unitLabel_Hori']).width),
											lastExistY
											);							
									sLabelPrintYn = true;		
								}	
						}
						if(!s_lineLinkable){
							startx_axis = null; 
							starty = null;		
						}
									
					}
				}//step1 end	

				try{
					this.mainCanvasBufferCtx.translate(0.5, 0.5);
				}catch(e){
					if(window.console != null) console.dir(e);
				}
				var endXPosition  = this.getLeftAxisWidth()+this.getBottomAxisWidth();
				this.mainCanvasBufferCtx.lineTo(endXPosition,initHeight);
				try{
					this.mainCanvasBufferCtx.translate(-0.5, -0.5);
				}catch(e){
					console.dir(e);
				}					
				this.mainCanvasBufferCtx.fill();
				try{
					this.mainCanvasBufferCtx.translate(-0.5, -0.5);
				}catch(e){
					console.dir(e);
				}
				this.mainCanvasBufferCtx.closePath();	
			
			}else if(s_chartType == 'spline'){

			}else if(s_chartType == 'scatter'){
				var lastExistY = '';
				var sLabelPrintYn = false;
				
				for(var j=0;j < s_data.length; j++){
					var x = s_data[j][0];
					var y = s_data[j][1];
					
					if(y != null && typeof y != 'undefined'){
						
						var px = this.toPhysicalVal_B_X(x);							
						var py = this.toPhysicalVal_L_Y(y,this.o()['series'][i]['s_min'],this.o()['series'][i]['s_max']);
						lastExistY = py;
						
						if(this.o()['dotShow']){
							
							if(s_shape == 'circle' || s_shape == 'arcs'){
								this.drawArc(
										s_shapeColor,
										s_sizeDefault,
										px,
										py,
										s_sizeDefault);	
								
							}else if(s_shape == 'rectangle' || s_shape == 'rect'){
								this.fillRect(
											s_shapeColor,
											s_sizeDefault,
											px-s_sizeDefault/2,
											py-s_sizeDefault/2,
											s_sizeDefault,
											s_sizeDefault
										);
							}
						}	

						startx_axis = px; 
						starty = py;	
						
					}else{
						
						if(!sLabelPrintYn){
								if(typeof this.o()['series'][i]['unitLabel_Hori'] != 'undefined' && lastExistY != ''){
									this.mainCanvasBufferCtx.fillStyle = this.o()['color'];
									this.mainCanvasBufferCtx.fillText(this.o()['series'][i]['unitLabel_Hori'],
											this.f(px-this.mainCanvasBufferCtx.measureText(this.o()['series'][i]['unitLabel_Hori']).width),
											lastExistY
											);	
									sLabelPrintYn = true;		
								}	
						}
						startx_axis = null; 
						starty = null;				
					}
				}
			}else if(s_chartType == 'line'){
				var lastExistY = '';
				var sLabelPrintYn = false;
				var startx 	= this.getBottomAxisMarkStart();
				var markGep = this.getMarkGepBottom();
				var startx_axis = null;
				var starty = null;
				for(var j=0,k=startx;j < s_data.length; k+=markGep,j++){
					var x = s_data[j][0];
					var y = s_data[j][1];
					var xlabel = s_data[j][2];
					if(y != null && typeof y != 'undefined'){
						
						var px;	
						if(this.o()['xrange_axis']){
							var px = this.toPhysicalVal_B_X(x);	
						}else{
							var px = k;	
						}
						var py = this.toPhysicalVal_L_Y(y,this.o()['series'][i]['s_min'],this.o()['series'][i]['s_max']);
						lastExistY = py;
						
						var rectWidth = markGep-(markGep/s_data.length);
						var _x1 = px-rectWidth/2;//startx_axis 
						var _y1 = py;
						var _width1 = rectWidth;
						var _height1 = this.getLeftAxisHeight() + this.o()['top_margin'] - _y1-1;
						var color = this.o()['colorObj'].getColour(_x1%255);
						var colorText = 'rgba('+color.red+','+color.green+','+color.blue+',1)';
						if(j != 0 && startx_axis != null){
							if(s_lineType == 'dash'){
								this.mainCanvasBufferCtx.setLineDash([2,3]);
							}
							this.drawLine(s_color,s_lineWidth,
									startx_axis,starty,px,py);
							if(s_lineType == 'dash'){
								this.mainCanvasBufferCtx.setLineDash([]);
							}								
						}else if(!sLabelPrintYn){								
							if(typeof this.o()['series'][i]['unitLabel_Hori'] != 'undefined'){
								this.mainCanvasBufferCtx.fillStyle = this.o()['series'][i]['unitLabel_Hori_txtColor'];
								this.mainCanvasBufferCtx.fillText(this.o()['series'][i]['unitLabel_Hori'],
										this.f(px-this.mainCanvasBufferCtx.measureText(this.o()['series'][i]['unitLabel_Hori']).width),
										py
										);
								sLabelPrintYn = true;
							}	
						}
						
						if(this.o()['dotShow']){
							
							if(s_shape == 'circle'){
								if(
										(typeof y == 'string' && y != '' && y != null)
										||
										(typeof y == 'number' && y != null)
										){
									if(j > 0){
										//첫번째점은 찍지않음
										this.drawArc4(
												s_color,
												s_shapeColor,
												1,
												startx_axis,
												starty,
												s_sizeDefault);		
									}

									this.drawArc4(
											s_color,
											s_shapeColor,
											1,
											px,
											py,
											s_sizeDefault);	
											
								}

							}else if(s_shape == 'rectangle' || s_shape == 'rect'){
								var r2 = s_sizeDefault*2;
								if(j > 0){
									//첫번째점은 찍지않음
									this.fillRect(
											s_shapeColor,
											1,
											startx_axis-r2/2,
											starty-r2/2,
											r2,
											r2
											);		
								}									
	
								this.fillRect(
										s_shapeColor,
										1,
										px-r2/2,
										py-r2/2,
										r2,
										r2
										);
									
							}
						};
						if(this.o()['valueShow']){
							//if(this.o()['value_show_min_hide'] && y == this.o()['series'][i]['s_min']){
								if(s_chartType_origin != 'ndSpline'){
									var txtWidth = this.mainCanvasBufferCtx.measureText(y).width;
									if(txtWidth < markGep){
										var px_start = px- txtWidth/2;
										var vsX;
										var vsY;
										if(this.o()['valueShowPosition'] == 'top'){
											vsX = px_start;
											vsY = py-6;								
										}else{
											vsX = px_start;
											vsY = py+12;		
										}	
										this.mainCanvasBufferCtx.font = this.o()['valueShowFont'];
										this.mainCanvasBufferCtx.fillStyle = this.o()['series'][i]['s_color'];
										this.mainCanvasBufferCtx.fillText(this.comma(y),
												vsX,
												vsY
												);					
									}								
								}
							//}	
						};	
						startx_axis = px; 
						starty = py;	
					}else{
						if(!sLabelPrintYn){
								if(typeof this.o()['series'][i]['unitLabel_Hori'] != 'undefined' && lastExistY != ''){
									this.mainCanvasBufferCtx.fillStyle = this.o()['color'];
									this.mainCanvasBufferCtx.fillText(this.o()['series'][i]['unitLabel_Hori'],
											this.f(px-this.mainCanvasBufferCtx.measureText(this.o()['series'][i]['unitLabel_Hori']).width),
											lastExistY
											);							
									sLabelPrintYn = true;		
								}	
						}
						if(!s_lineLinkable){
							startx_axis = null; 
							starty = null;		
						}
									
					}
				}//step1 end
			}else if(barSeriesCount == 1 && s_chartType == 'bar'){
				var lastExistY = '';
				var sLabelPrintYn = false;
				var startx 	= this.getBottomAxisMarkStart();
				var markGep = this.getMarkGepBottom();
				for(var j=0,k=startx;j < s_data.length; k+=markGep,j++){
					//var x = s_data[j][0];
					var y = s_data[j][1];
					var xlabel = s_data[j][2];
					if(y != null && typeof y != 'undefined'){
						var px = k;	
						var py = this.toPhysicalVal_L_Y(y,this.o()['series'][i]['s_min'],this.o()['series'][i]['s_max']);
						lastExistY = py;
						if(this.o()['dotShow']){
						}	

						var rectWidth = markGep/2;
						var _x1 = px-rectWidth/2;//startx_axis 
						var _y1 = py;
						var _width1 = rectWidth;
						var _height1 = this.getLeftAxisHeight() + this.o()['top_margin'] - _y1-1;						

						if(this.o()['valueShow']){
							if(this.o()['value_show_min_hide'] && y == this.o()['min']){
								
							}else{
								
								if(this.o()['valueGroupCnt'] > 0){
									if(j%this.o()['valueGroupCnt'] == 0){
										var txtWidth = this.mainCanvasBufferCtx.measureText(y).width;

										if(txtWidth < markGep){
											
											var px_start = px- txtWidth/2+markGep/2;
											var vsX;
											var vsY;
											

											if(this.o()['valueShowPosition'] == 'top'){
												vsX = px_start;
												vsY = py-s_sizeDefault;								
											}else{
												vsX = px_start;
												vsY = py+12;		
											}		


											var endx = _width1*2+markGep/2;
											var _x1_end = this.getLeftAxisWidth()+this.getBottomAxisWidth();

					
											if((_x1+endx) > _x1_end){
												vsX = vsX-markGep/2/2;
											}
											
											this.mainCanvasBufferCtx.font = this.o()['valueShowFont'];
											this.mainCanvasBufferCtx.fillStyle = this.o()['series'][i]['s_color'];							
											this.mainCanvasBufferCtx.fillText(this.comma(y),
													vsX,
													vsY
													);
										}		
									}

								}else{
									var txtWidth = this.mainCanvasBufferCtx.measureText(y).width;
									if(txtWidth < markGep){
										
										var px_start = px- txtWidth/2;
										var vsX;
										var vsY;
										if(this.o()['valueShowPosition'] == 'top'){
											vsX = px_start;
											vsY = py-s_sizeDefault;								
										}else{
											vsX = px_start;
											vsY = py+12;		
										}						
										this.mainCanvasBufferCtx.font = this.o()['valueShowFont'];
										this.mainCanvasBufferCtx.fillStyle = this.o()['series'][i]['s_color'];							
										this.mainCanvasBufferCtx.fillText(this.comma(y),
												vsX,
												vsY
												);
									}	
								}

							
							
							}
						}
					
						var color = this.o()['colorObj'].getColour(_x1%255);
						var colorText = 'rgba('+color.red+','+color.green+','+color.blue+',1)';
									
						if(!sLabelPrintYn){								
							if(typeof this.o()['series'][i]['unitLabel_Hori'] != 'undefined'){
								this.mainCanvasBufferCtx.fillStyle = this.o()['series'][i]['unitLabel_Hori_txtColor'];
								this.mainCanvasBufferCtx.fillText(this.o()['series'][i]['unitLabel_Hori'],
										this.f(px-this.mainCanvasBufferCtx.measureText(this.o()['series'][i]['unitLabel_Hori']).width),
										py
										);				
								sLabelPrintYn = true;
							}	
														
						}
						startx_axis = px; 
						starty = py;	
					}else{
						if(!sLabelPrintYn){
								if(typeof this.o()['series'][i]['unitLabel_Hori'] != 'undefined' && lastExistY != ''){
									this.mainCanvasBufferCtx.fillStyle = this.o()['color'];
									this.mainCanvasBufferCtx.fillText(this.o()['series'][i]['unitLabel_Hori'],
											this.f(px-this.mainCanvasBufferCtx.measureText(this.o()['series'][i]['unitLabel_Hori']).width),
											lastExistY
											);							
									sLabelPrintYn = true;		
								}	
						}
						startx_axis = null; 
						starty = null;				
					}
				}//step1 end
				lastExistY = '';
				sLabelPrintYn = false;
				startx 	= this.getBottomAxisMarkStart();
				markGep = this.getMarkGepBottom();
				for(var j=0,k=startx;j < s_data.length; k+=markGep,j++){

					var y = s_data[j][1];
					var xlabel = s_data[j][2];
					if(y != null && typeof y != 'undefined'){

						var px = k;	
						var py = this.toPhysicalVal_L_Y(y,this.o()['series'][i]['s_min'],this.o()['series'][i]['s_max']);
						lastExistY = py;
						if(this.o()['dotShow']){
						}	
							s_sizeDefault = markGep-(markGep/s_data.length);
							var _x1 = px-s_sizeDefault/2;//startx_axis 
							var _y1 = py;
							var _width1 = s_sizeDefault;
							var _height1 = this.getLeftAxisHeight() + this.o()['top_margin'] - _y1-1;
							var color = this.o()['colorObj'].getColour(_x1%255);
							var colorText = 'rgba('+color.red+','+color.green+','+color.blue+',1)';
							
							
							var xLabelWidth = this.mainCanvasBufferCtx.measureText(xlabel).width;
							var diNum = Math.floor((xLabelWidth)/markGep*2);
							
							if(this.o()['x_label_extension'] && diNum < 9){
								this.mainCanvasBufferCtx.font = this.o()['tooltipFont'];
								this.mainCanvasBufferCtx.fillStyle = this.o()['tooltipTextColor'];
								this.drawTipLine (this.o()['tooltipTextColor'],45,_x1,_y1,_width1,30,xlabel);
							}
						startx_axis = px; 
						starty = py;	
					}else{
						startx_axis = null; 
						starty = null;				
					}
				}//step2 end	
			/*}*/					
			}else if(s_chartType == 'metrix'){
					var startx_axis;
					var starty;					
					var s_data 			= this.o()['series'][i].s_data;
					var s_color 		= this.getSColor(this,i);
					var s_lineWidth 	= this.o()['series'][i].s_lineWidth; 
					var s_shape 		= this.o()['series'][i].s_shape;
					var s_sizeDefault 	= this.o()['series'][i].s_sizeDefault;
					var s_shapeColor 	= this.getSpColor(this,i);

					var prePonit = {};
					for(var j=0;j < s_data.length; j++){
						var x = s_data[j][0];
						var y1 = s_data[j][4];
						var y2 = s_data[j][5];
						
						var label = s_data[j][2];
			
						if(typeof y1 != 'undefined' && y1 != null  ){
							
							var px = this.toPhysicalVal_B_X(x);
							var py = this.toPhysicalVal_L_Y(y,this.o()['series'][i]['s_min'],this.o()['series'][i]['s_max']);
							

							if(s_shape == 'arrow'){
								var color = this.o()['colorObj'].getColour(y2);
								var colorText = 'rgba('+color.red+','+color.green+','+color.blue+',1)';
								if(typeof y1 != 'undefined'){
									this.drawArrow(px,py,y1,5,8,colorText);
								}
							}else if(s_shape == 'windflag'){
									var colorText = 'rgba(62,52,192,1)';
									if(typeof y2 != 'undefined'){
										this.drawWindflag(px,py,y1,8,20,colorText,y2,this.o()['windflag_unit']);//y2:占쎈씮��
									}
							}else if(s_shape == 'circle'){
								var color = this.o()['colorObj'].getColour(y1);
								var colorText = 'rgba('+color.red+','+color.green+','+color.blue+',3)';
								if(typeof y1 != 'undefined'){
									this.drawArc(
											colorText,
											1,
											px,
											py,
											s_sizeDefault);		
								}
							}else if(s_shape == 'rectangle'){

								var color = this.o()['colorObj'].getColour(y1);
								var colorText = 'rgba('+color.red+','+color.green+','+color.blue+',1)';
								var starty = this.getLeftAxisHeight()+this.o()['top_margin'];
								if((py-s_sizeDefault/2 + s_sizeDefault*24) < starty ){
									if(typeof y1 != 'undefined'){
										this.fillRect(
												colorText,
												1,
												px-s_sizeDefault/2,
												py-s_sizeDefault/2,
												s_sizeDefault*2,
												s_sizeDefault*24
												);	
									}
								}

							}

							startx_axis = px; 
							starty = py;			
							
						}
					}
			}
		
		}else{
			this.o()['series'][i].s_draw = false;
		}
		//여기요2
		
		}
	}else{
		var xCntMax = this.o()['minmax']['xCntMax'];
		var markCount = this.getMarkCountLeft();
		for(var i=0;i< this.o()['series'].length; i++){
			var s_data 			= this.o()['series'][i].s_data;
			var s_color 		= this.getSColor(this,i);
			var s_lineWidth 	= this.o()['series'][i].s_lineWidth; 
			var s_shape 		= this.o()['series'][i].s_shape;
			var s_sizeDefault 	= this.o()['series'][i].s_sizeDefault;
			var s_shapeColor 	= this.getSpColor(this,i);
			var prePonit = {};
			for(var j=0;j < s_data.length; j++){
				var x = s_data[j][0];
				var y = s_data[j][1];

				var py = this.toPhysicalVal_B(y);
				var px = this.toPhysicalVal_L(x);

				if(j > 1 && j < s_data.length-1){
					this.CatmullRomSplines(s_color,s_lineWidth,
							{'_x':this.toPhysicalVal_B(s_data[j-2][1]),'_y':this.toPhysicalVal_L(s_data[j-2][0])},
							{'_x':this.toPhysicalVal_B(s_data[j-1][1]),'_y':this.toPhysicalVal_L(s_data[j-1][0])},
							{'_x':this.toPhysicalVal_B(s_data[j][1]),'_y':this.toPhysicalVal_L(s_data[j][0])},
							{'_x':this.toPhysicalVal_B(s_data[j+1][1]),'_y':this.toPhysicalVal_L(s_data[j+1][0])}
							);
				}else if(j == 1){
					this.CatmullRomSplines(s_color,s_lineWidth,
							{'_x':this.toPhysicalVal_B(s_data[j-1][1]),'_y':this.toPhysicalVal_L(s_data[j-1][0])},
							{'_x':this.toPhysicalVal_B(s_data[j-1][1]),'_y':this.toPhysicalVal_L(s_data[j-1][0])},
							{'_x':this.toPhysicalVal_B(s_data[j][1]),'_y':this.toPhysicalVal_L(s_data[j][0])},
							{'_x':this.toPhysicalVal_B(s_data[j+1][1]),'_y':this.toPhysicalVal_L(s_data[j+1][0])}
							);
				}else if(j == s_data.length-1){
					this.CatmullRomSplines(s_color,s_lineWidth,
							{'_x':this.toPhysicalVal_B(s_data[j-2][1]),'_y':this.toPhysicalVal_L(s_data[j-2][0])},
							{'_x':this.toPhysicalVal_B(s_data[j-1][1]),'_y':this.toPhysicalVal_L(s_data[j-1][0])},
							{'_x':this.toPhysicalVal_B(s_data[j][1]),'_y':this.toPhysicalVal_L(s_data[j][0])},
							{'_x':this.toPhysicalVal_B(s_data[j][1]),'_y':this.toPhysicalVal_L(s_data[j][0])}
							);
				}
				prePonit['_x'] = py;
				prePonit['_y'] = px;

			}
		}
		for(var i=0;i< this.o()['series'].length; i++){
			var s_data = this.o()['series'][i].s_data;
			var s_color = this.getSColor(this,i);
			var s_lineWidth = this.o()['series'][i].s_lineWidth; 
			var s_shape = this.o()['series'][i].s_shape;
			var s_sizeDefault = this.o()['series'][i].s_sizeDefault;
			var s_shapeColor = this.getSpColor(this,i);
			var prePonit = {};
			for(var j=0;j < s_data.length; j++){
				var x = s_data[j][0];
				var y = s_data[j][1];

				var py = this.toPhysicalVal_B(y);
				var px = this.toPhysicalVal_L(x);
				if(this.o()['dotShow']){
					if(s_shape == 'circle'){
						this.drawArc(
								s_shapeColor,
								1,
								py,
								px,
								s_sizeDefault);	
						
					}else if(s_shape == 'rectangle'){
						this.fillRect(
								s_shapeColor,
								1,
								py-s_sizeDefault/2,
								px-s_sizeDefault/2,
								s_sizeDefault,
								s_sizeDefault
								);
					}
				}
			}
		}

	}
};
HChart.prototype.drawBackground = function() {
	this.mainCanvasBufferCtx.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
	this.mainCanvasBufferCtx.fillStyle = this.o()['background_color'];
	this.mainCanvasBufferCtx.fillRect(0,0,this.mainCanvas.width, this.mainCanvas.height);
};
HChart.prototype.drawXAxis = function() {

	
	
	var textLang = this.mainCanvasBufferCtx.measureText(this.o()['unitLabel_Hori']).width;
	this.mainCanvasBufferCtx.fillStyle = this.o()['titleColor'];
	var legend_height_start = this.mainCanvas.height-this.o()['legendBottomGep']-20;

	this.mainCanvasBufferCtx.font = 'bold'+' '+this.o()['axisTitleFont'];
	var ttStart = 0;
	if(this.o()['bottom_title_align'] == 'center'){
		ttStart = this.f(this.getLeftAxisWidth() +  (this.getBottomAxisWidth()-textLang)/2);
	}else{
		ttStart = this.f(this.getLeftAxisWidth() +  (this.getBottomAxisWidth()-textLang));
	}
	this.mainCanvasBufferCtx.fillText(this.o()['unitLabel_Hori'],
			ttStart,
			legend_height_start+this.o()['gep_space']+2+12
			);	
	
	var pmode  = this.o()['pivot_mode'];
	this.mainCanvasBufferCtx.font = this.o()['titleFont'];
	if(pmode == 'XY'){
		if(this.o()['xrange_axis']){
			var startx_axis = this.getLeftAxisWidth();
			var starty = this.getLeftAxisHeight()+this.o()['top_margin'];
			var endx_axis = this.getBottomAxisWidthStart()+this.getBottomAxisWidth();
			var endy = starty;
			
			var startx 	= this.getBottomAxisMarkStart();
			var endx 	= this.getBottomAxisMarkEnd();
			this.drawLine(this.o()['axis_stroke_color'],1,
					startx_axis,starty,endx_axis,endy);
			var markGep = this.getMarkGepBottom();

			for(var i=startx; i < endx+1; i+=markGep) {
				var x = i;
				var y = starty;
				var x_val = 0;
				
				if(this.o()['toFixedX'] != 0){
					x_val = this.toLogicalVal_B_X(x).toFixed(this.o()['toFixedY']);
				}else{
					x_val = this.toLogicalVal_B_X(x);
				};
				
				var xval = this.f(x_val);
				
				var x_label = this.comma(xval+'');
				
				if(this.o()['xrange_axis_label_mapping']){
					if(this.o()['xrange_axis_label_map'][x_label] != null){
						x_label = this.o()['xrange_axis_label_map'][x_label];
					}else{
						x_label = "";
					}
				}
				this.drawLine(this.o()['axis_stroke_color'],1,this.f(x),starty,this.f(x),this.f(starty+this.o()['mark_then_gep']));
				if(this.o()['gridShowV']){
					this.drawDLine_V(this.o()['axis_stroke_color'],1,this.f(x),starty,this.f(x),this.f(starty-this.getLeftAxisHeight()),2);
				}
				
				this.mainCanvasBufferCtx.fillStyle = this.o()['commonTextColor'];
				this.mainCanvasBufferCtx.font = this.o()['axisTitleFont'];
				var labelWidth = this.mainCanvasBufferCtx.measureText(x_label).width;
			
				this.mainCanvasBufferCtx.fillText(x_label,
						this.f(x-labelWidth/2),
						this.f(y+this.o()['leftLabelMaxHeight']+this.o()['mark_then_gep'])
						);
				
				if(typeof this.o()['startDateTime'] != 'undefined' && this.o()['startDateTime'] != null){
					var calcStrObj = chartUtil.calcDate(this.o()['startDateTime'],xval);
					var calcStr = calcStrObj['day']+' '+calcStrObj['hour']+':'+calcStrObj['min'];
					this.mainCanvasBufferCtx.fillText(calcStr,
							this.f(x-this.mainCanvasBufferCtx.measureText(calcStr).width/2),
							this.f(y+this.o()['mark_width']+(this.o()['mark_then_gep']+this.o()['leftLabelMaxHeight'])*2)
							);		
				}
								
			}
			
		}else{
			var startx_axis = this.getLeftAxisWidth();
			var starty = this.getLeftAxisHeight()+this.o()['top_margin'];
			var endx_axis = this.getBottomAxisWidthStart()+this.getBottomAxisWidth();
			var endy = starty;
			
			var startx 	= this.getBottomAxisMarkStart();
			var endx 	= this.getBottomAxisMarkEnd();

			var markGep = this.getMarkGepBottom();
			var xmap = {};
			
			
			if(this.o()['xAxisPosition'] == 'top'){
				starty = this.o()['top_margin'];
				endy = starty;
			}else{
				
				
				
			}
			this.drawLine(this.o()['axis_stroke_color'],1,
					startx_axis,starty,endx_axis,endy);
			
			
			
			var tWidthMax = -999999999;
			for(var i=startx,j=0; i < endx+1; i+=markGep,j++) {
				var s_data = this.o()['series'][0].s_data;
				var x_text_label
				if(s_data[j] == null){
					x_text_label = ""; 
				}else{
					x_text_label = s_data[j][0];
				}

				var x = i;
				var y = starty;
				var x_val = 0;
				x_val = x_text_label;
				var tWidth = this.mainCanvasBufferCtx.measureText(x_text_label).width;
				if(tWidth > tWidthMax){
					tWidthMax = tWidth;
				}
				if(typeof x_val == 'number' ||    (typeof x_val == 'string' && x_val != '')){
					if(xmap[x_val] != null){
						xmap[x_val] = parseInt(xmap[x_val])+1; 
					}else {
						xmap[x_val] = 1;
					}	
				}
			}
			//여기서부터 X그룹핑
			var groupByMinus = 1;
			var s_data_length = this.o()['series'][0].s_data.length;

			var startx_axis = this.getLeftAxisWidth();
			var endx_axis = this.getBottomAxisWidthStart()+this.getBottomAxisWidth();
			var xWidth = endx_axis - startx_axis;
			var gepApply = false;
			if(Math.ceil(s_data_length/xWidth) > 1){
				gepApply = true;
				
			}
			this.o()['gepApply'] = gepApply;
			var displayMarkGep = (Math.ceil(s_data_length/xWidth)+tWidthMax)*Math.ceil(1/markGep);
			
			//ndSpline
			
			for(var i=startx,j=0,k=0; i < endx+1; i+=markGep,j++) {
				var s_data = this.o()['series'][0].s_data;
				var x_text_label
				if(s_data[j] == null){
					x_text_label = ""; 
				}else{
					x_text_label = s_data[j][0];
				}
				 
				var x = i;
				var y = starty;
				var x_val = 0;

				x_val = x_text_label;
				//x_val = tWidthMax;
				
				

				var x_label = x_val;
				var groupbyNum = xmap[x_label];

				var halfWidth = this.mainCanvasBufferCtx.measureText(x_label).width/2;
				

				
				
				
				
				if(this.o()['draw2DepthXAxis']){
					if(s_data[j] == null){
						x_text_label = ""; 
					}else{
						x_text_label = s_data[j][2];
					}					
					
					x_val = x_text_label;
					var x_label = x_val;
					var groupbyNum = xmap[x_label];
					var halfWidth = this.mainCanvasBufferCtx.measureText(x_label).width/2;
				
					//1단x축
					var lineY = this.f(y);
					var labelWidth = this.mainCanvasBufferCtx.measureText(x_label).width;
					var markYPoint;
					if(this.o()['xAxisPosition'] == 'top'){
						markYPoint = lineY-this.o()['mark_width']/2;
					}else{
						markYPoint = lineY+this.o()['mark_width']/2;
					}
					if(gepApply){
					}else{
						displayMarkGep = parseInt(tWidthMax/markGep)+1;
					}
					this.mainCanvasBufferCtx.font = this.o()['axisTitleFont'];
					this.mainCanvasBufferCtx.fillStyle = this.o()['commonTextColor'];
					var textY = 0;

					
					if(this.o()['xAxisPosition'] == 'top'){
						textY = this.f(lineY-this.option['font_size']+5);
					}else{
						textY = this.f(lineY+this.option['font_size']+2);
					}
					this.mainCanvasBufferCtx.fillText(x_label,
							this.f(x-halfWidth),
							textY
							);		
					this.drawLine(this.o()['axis_stroke_color'],1,
							this.f(x),lineY,
							this.f(x),markYPoint);	
					k++;

					
					//2단 group x축
					if(s_data[j] == null){
						x_text_label = ""; 
					}else{
						x_text_label = s_data[j][0];
					}					
					
					x_val = x_text_label;
					var x_label = x_val;
					var groupbyNum = xmap[x_label];
					var halfWidth = this.mainCanvasBufferCtx.measureText(x_label).width/2;					
					if(groupbyNum == 1){
						var lineY = this.f(y);
						var labelWidth = this.mainCanvasBufferCtx.measureText(x_label).width;
						var markYPoint;
						if(this.o()['xAxisPosition'] == 'top'){
							markYPoint = lineY-this.o()['mark_width']/2;
						}else{
							markYPoint = lineY+this.o()['mark_width']/2;
						}
						
						if(gepApply){
						}else{
							displayMarkGep = parseInt(tWidthMax/markGep)+1;
						}

						if(!this.o()['x_label_extension'] &&   markGep < labelWidth && j%displayMarkGep == 0){

							this.mainCanvasBufferCtx.font = this.o()['axisTitleFont'];
							this.mainCanvasBufferCtx.fillStyle = this.o()['commonTextColor'];
							var textY = 0;
							if(k%2 == 0){
								textY = this.f(lineY+this.option['font_size']*2+2);
								markYPoint = markYPoint+this.option['font_size']; 
							}else{
								textY = this.f(lineY+this.option['font_size']+2);
							}						
							this.mainCanvasBufferCtx.fillText(x_label,
									this.f(x-halfWidth),
									textY
									);		
							this.drawLine(this.o()['axis_stroke_color'],1,
									this.f(x),lineY,
									this.f(x),markYPoint);	
							k++;
						}else if(!this.o()['x_label_extension'] && markGep > labelWidth){

							this.mainCanvasBufferCtx.font = this.o()['axisTitleFont'];
							this.mainCanvasBufferCtx.fillStyle = this.o()['commonTextColor'];
							var textY = 0;
							if(j%2 == 0){
								textY = this.f(lineY+this.option['font_size']*2+2);
								markYPoint = lineY+this.o()['mark_width']/2+this.option['font_size']; 
							}else{
								textY = this.f(lineY+this.option['font_size']+2);
							}
							this.mainCanvasBufferCtx.fillText(x_label,
									this.f(x-halfWidth),
									textY
									);	
							this.drawLine(this.o()['axis_stroke_color'],1,
									this.f(x),lineY,
									this.f(x),markYPoint);		

						}else if(this.o()['x_label_extension']){
							this.mainCanvasBufferCtx.font = this.o()['axisTitleFont'];
							this.mainCanvasBufferCtx.fillStyle = this.o()['commonTextColor'];
							var textY = this.f(lineY+this.option['font_size']+2);
							this.mainCanvasBufferCtx.fillText(x_label,
									this.f(x-halfWidth),
									textY
									);	
							this.drawLine(this.o()['axis_stroke_color'],1,
									this.f(x),lineY,
									this.f(x),markYPoint);	
			
						}else{

						}

					}else if(groupByMinus == 1){
						groupByMinus = groupbyNum;
						var lineY = this.f(y+this.o()['mark_width']+this.o()['mark_then_gep']+this.o()['leftLabelMaxHeight']);						
						if(this.o()['xAxisPosition'] == 'top'){
							lineY = this.f(y-this.o()['mark_width']-this.o()['mark_then_gep']-this.o()['leftLabelMaxHeight']);	
						}else{
							lineY = this.f(y+this.o()['mark_width']+this.o()['mark_then_gep']+this.o()['leftLabelMaxHeight']);	
						}						
						//그룹라인긋기
						this.drawLine(this.o()['axis_stroke_color'],this.f(this.o()['groupbyLineDepth']),
								this.f(x),this.f(lineY),
								this.f(x+markGep*(groupbyNum-1)),this.f(lineY));
								
								
						var lineW = this.f(x+halfWidth+markGep*(groupbyNum-1)) - this.f(x-halfWidth);
						this.mainCanvasBufferCtx.font = this.o()['axisTitleFont'];
						this.mainCanvasBufferCtx.fillStyle = this.o()['commonTextColor'];
						if(this.o()['xAxisPosition'] == 'top'){
							this.mainCanvasBufferCtx.fillText(x_label,
									this.f(x-halfWidth*2+lineW/2),
									this.f(lineY)-this.option['font_size']+2
									);	
						}else{
							this.mainCanvasBufferCtx.fillText(x_label,
									this.f(x-halfWidth*2+lineW/2),
									this.f(lineY)+this.option['font_size']+2
									);	
						}

								
					}else{
						groupByMinus--;
					}					
				}else{
					
					/*일반차트*/
					if(groupbyNum == 1){
						var lineY = this.f(y);
						var labelWidth = this.mainCanvasBufferCtx.measureText(x_label).width;
						var markYPoint = lineY+this.o()['mark_width']/2;
						if(gepApply){
						}else{
							displayMarkGep = parseInt(tWidthMax/markGep)+1;
						}

						if(!this.o()['x_label_extension'] &&   markGep < labelWidth && j%displayMarkGep == 0){

							this.mainCanvasBufferCtx.font = this.o()['axisTitleFont'];
							this.mainCanvasBufferCtx.fillStyle = this.o()['commonTextColor'];
							var textY = 0;
							if(k%2 == 0){
								textY = this.f(lineY+this.option['font_size']*2+2);
								markYPoint = markYPoint+this.option['font_size']; 
							}else{
								textY = this.f(lineY+this.option['font_size']+2);
							}						
							this.mainCanvasBufferCtx.fillText(x_label,
									this.f(x-halfWidth),
									textY
									);		
							this.drawLine(this.o()['axis_stroke_color'],1,
									this.f(x),lineY,
									this.f(x),markYPoint);	
							k++;
						}else if(!this.o()['x_label_extension'] && markGep > labelWidth){

							this.mainCanvasBufferCtx.font = this.o()['axisTitleFont'];
							this.mainCanvasBufferCtx.fillStyle = this.o()['commonTextColor'];
							var textY = 0;
							if(j%2 == 0){
								textY = this.f(lineY+this.option['font_size']*2+2);
								markYPoint = lineY+this.o()['mark_width']/2+this.option['font_size']; 
							}else{
								textY = this.f(lineY+this.option['font_size']+2);
							}
							this.mainCanvasBufferCtx.fillText(x_label,
									this.f(x-halfWidth),
									textY
									);	
							this.drawLine(this.o()['axis_stroke_color'],1,
									this.f(x),lineY,
									this.f(x),markYPoint);		

						}else if(this.o()['x_label_extension']){
							this.mainCanvasBufferCtx.font = this.o()['axisTitleFont'];
							this.mainCanvasBufferCtx.fillStyle = this.o()['commonTextColor'];
							var textY = this.f(lineY+this.option['font_size']+2);
							this.mainCanvasBufferCtx.fillText(x_label,
									this.f(x-halfWidth),
									textY
									);	
							this.drawLine(this.o()['axis_stroke_color'],1,
									this.f(x),lineY,
									this.f(x),markYPoint);	
			
						}else{

						}

					}else if(groupByMinus == 1){

						groupByMinus = groupbyNum;
						var lineY = this.f(y+this.o()['mark_width']+this.o()['mark_then_gep']+this.o()['leftLabelMaxHeight']);
						
						//그룹라인긋기
						this.drawLine(this.o()['axis_stroke_color'],this.f(this.o()['groupbyLineDepth']),
								this.f(x),this.f(lineY),
								this.f(x+markGep*(groupbyNum-1)),this.f(lineY));
								
								
						var lineW = this.f(x+halfWidth+markGep*(groupbyNum-1)) - this.f(x-halfWidth);
						this.mainCanvasBufferCtx.font = this.o()['axisTitleFont'];
						this.mainCanvasBufferCtx.fillStyle = this.o()['commonTextColor'];
						this.mainCanvasBufferCtx.fillText(x_label,
								this.f(x-halfWidth*2+lineW/2),
								this.f(lineY)+this.option['font_size']+2
								);	
								
					}else{
						groupByMinus--;
					}
					
					
					
					
					
					
					
					
				}
				
				
				
				
				
				
				
				
			}	
		}
	}else{		
		var xCntMax = this.o()['minmax']['xCntMax'];
		var markCount = this.getMarkCountLeft();
		var data = this.o()['series'][this.o()['minmax']['xCntMaxSIndex']].s_data;
		var startx 	= this.getLeftAxisMarkStart();
		var endx 	= this.getLeftAxisMarkEnd();
		var markGep = this.getMarkGepLeft();
		
		var x 		= this.getLeftAxisWidth();
		var j=0;
		var y;
		if(markGep > 0){
			for(var i= 0; (y = (startx-(i*markGep))) > endx-1; i++) {
					var p_y = null;
					if(this.o()['toFixedY'] != 0){
						p_y = this.toLogicalVal_L(y).toFixed(this.o()['toFixedX']);
					}else{
						p_y = this.toLogicalVal_L(y);
					}
					var i_label = this.comma(p_y);
					this.drawLine(this.o()['axis_stroke_color'],1,this.f(x),this.f(y),this.f(x-this.o()['mark_width']),this.f(y));
					if(this.o()['gridShowH']){
						this.drawDLine_H(this.o()['axis_stroke_color'],1,
								this.f(x),
								this.f(y),
								this.f(x+this.getBottomAxisWidth()),
								this.f(y),
								2);
					}
					this.mainCanvasBufferCtx.fillStyle = this.o()['color'];
					this.mainCanvasBufferCtx.fillText(i_label,
							x-this.o()['mark_width']-(this.mainCanvasBufferCtx.measureText(p_y).width+this.o()['gep_space']),
							y+this.o()['leftLabelMaxHeight']/2);	
					j++;
			}	
		}			
	}
};


HChart.prototype.drawDLine_H = function(_color,_lineWidth,_x1,_y1,_x2,_y2,_depth) {
	for(var i=_x1; i < _x2; i=i+_depth*2 ){
		this.drawLine(_color,_lineWidth,i,_y1,i+_depth,_y2);	
	}
}

HChart.prototype.drawDLine_V = function(_color,_lineWidth,_x1,_y1,_x2,_y2,_depth) {
	for(var i=_y1; i > _y2+_depth; i=i-_depth*2 ){
		this.drawLine(_color,_lineWidth,_x1,i,_x2,i-_depth);	
	}
}

HChart.prototype.getFontHeight = function(_font) {
	var re = 11;
	if(_font != null){
		var _arr = _font.split(' ');
		if(_arr != null){
			for(var i=0;i < _arr.length;i++){
				var tt = _arr[i];
				if(tt.indexOf('px') > 0){
					var fontHeight = tt.replace('px','');
					re = new Number(fontHeight);
					break;
				}				
			}	
		}
	}
	return re;
}

				
				
				
HChart.prototype.drawText = function(x,y,_color,_degree,_text) {
	var gep = 4;
	this.mainCanvasBufferCtx.translate(x,(y-gep));
	this.mainCanvasBufferCtx.lineWidth = 1;
	this.mainCanvasBufferCtx.rotate(_degree*(Math.PI/180));
		this.mainCanvasBufferCtx.beginPath();
			this.mainCanvasBufferCtx.fillStyle = _color;
			this.mainCanvasBufferCtx.strokeStyle = _color;
			
	
		    this.mainCanvasBufferCtx.fillStyle = this.o()['color'];
		    this.mainCanvasBufferCtx.fillText(_text,0,0);
		    
			this.mainCanvasBufferCtx.stroke();	
		this.mainCanvasBufferCtx.closePath();
	this.mainCanvasBufferCtx.rotate(-_degree*(Math.PI/180));
	this.mainCanvasBufferCtx.translate(-x, -(y-gep));    
}

HChart.prototype.drawImg = function(_img,x,y,_degree,_width,_height) {
	this.mainCanvasBufferCtx.save();
	this.mainCanvasBufferCtx.translate(x+_width/2,y+_height/2);
	this.mainCanvasBufferCtx.rotate(_degree*(Math.PI/180));
	//this.mainCanvasBufferCtx.beginPath();
	
	this.mainCanvasBufferCtx.drawImage(_img,
		0-_width/2,
		0-_height/2,
		_width,_height
		);	
	/*
	this.mainCanvasBufferCtx.strokeRect(
			0,
			0,
			1,1
			);			
	*/		
	//this.mainCanvasBufferCtx.closePath();	
	this.mainCanvasBufferCtx.rotate(-_degree*(Math.PI/180));	
	this.mainCanvasBufferCtx.translate(-(x+_width/2),-(y+_height/2));
	this.mainCanvasBufferCtx.restore();
}

HChart.prototype.getRYAxisWidth = function() {
	var axisLeng = this.o()['series'].length;
	for(var k=0;k<axisLeng;k++){	
		if(this.o()['series'][k]['s_axis'] == 'R'){
			var startx 	= this.getLeftAxisMarkStart();
			var endx 	= this.getLeftAxisMarkEnd();
			var markGep = this.getMarkGepLeft();
			var markLogicalGep = this.getMarkLogicalGepLeft(this.o()['series'][k]['s_min'],this.o()['series'][k]['s_max']);
			var x 		= this.getBottomAxisWidth()+this.getLeftAxisWidth();
			var j=0;
			var y;

			if(markGep < 0){
				break;
			}
			var startLogical = this.o()['series'][k]['s_min'];
			for(var i= 0; (y = (startx-(i*markGep))) > endx-1; i++) {
						var p_y = startLogical+i*markLogicalGep;
						var i_label;
						if(this.o()['toFixedY'] != 0){
							i_label = this.comma(chartUtil.getFixedNum(p_y,this.o()['toFixedY']));
						}else{
							i_label = this.comma(p_y);
						};
						
						
						var rmaxLabelCompareWidth = this.mainCanvasBufferCtx.measureText(i_label).width;

						if(this.o()['rightLabelMaxWidthXY'] == null || rmaxLabelCompareWidth > this.o()['rightLabelMaxWidthXY']){

							this.o()['rightLabelMaxWidthXY'] = rmaxLabelCompareWidth;

						}
						j++;	

			}	
		}
	}
};

HChart.prototype.drawLines = function() {
	var drawLinesArray = this.o()['drawLines'];
	var x1 = this.getLeftAxisWidth();
	var x2 = x1+this.getBottomAxisWidth();
	if(drawLinesArray != null){
		for(var i=0; i < drawLinesArray.length; i++){
			var y = drawLinesArray[i];
			var color = this.o()['drawLineColors'][i];
			var depth = this.o()['drawLineDepths'][i];
			var txt = this.o()['drawLineTexts'][i];	
			var txtPos = this.o()['drawLineTextsPosition'][i];
			var lineStyle = this.o()['drawLineStyles'][i];
			var lineDotGep = this.o()['drawLineDotGep'][i];
			
			var py = this.toPhysicalVal_L_Y(y,this.o()['series'][0]['s_min'],this.o()['series'][0]['s_max']);
			
			if(lineStyle == 'dot'){
				this.drawDLine_H(color,depth,
						this.f(x1),
						this.f(py),
						this.f(x2),
						this.f(py),
						lineDotGep);
			}else{
				this.drawLine(color,depth,
						x1,py,
						x2,py);
			}


										

			this.mainCanvasBufferCtx.font = this.o()['commonFont'];		
			var txtPosY = py;

			if(txtPos == 'bottom'){
				txtPosY = txtPosY + 15;
			}
			
			
			
			this.drawText(
					x1
					,txtPosY
					,color
					,0,txt);					
		}	
	}
}

HChart.prototype.drawYAxis = function() {
	
	if(!this.o()['multiYAxis']){
		var labelLeng = this.mainCanvasBufferCtx.measureText(this.o()['unitLabel_Verti']).width+this.o()['gep_space'];
		this.mainCanvasBufferCtx.fillStyle = this.o()['color'];
		try{
			this.drawText(this.o()['xLabelStartGep'],
					((this.o()['top_margin']+this.getLeftAxisHeight())-(this.getLeftAxisHeight()-labelLeng)/2)
					,this.o()['color']
					,-90,this.o()['unitLabel_Verti']);		
		}catch(e){
			console.dir(e);
		}
	}
	
	var yAxisMarkShow  = this.o()['yAxisMarkShow'];
	var pmode  = this.o()['pivot_mode'];
	
	if(!yAxisMarkShow){
			var _x1 = this.getLeftAxisWidth();
			var _y1 = this.o()['top_margin'];
			var _width1  = this.getBottomAxisWidth();
			var _height1 = this.getLeftAxisHeight();
			this.drawRect(
					this.o()['axis_stroke_color'],
					1,_x1,_y1,_width1,_height1);
			this.fillRect(
					this.o()['center_fill_color'],
					1,_x1,_y1,_width1,_height1);
			
	}else{	
		if(pmode == 'XY'){
			
			var axisLeng = 1;
			if(this.o()['multiYAxis']){
				axisLeng = this.o()['series'].length;
			}else{
				axisLeng = 1;
			}
			this.mainCanvasBufferCtx.font = this.o()['commonFont'];
			this.getRYAxisWidth();
			for(var k=0;k<axisLeng;k++){	
				
				var startx 	= this.getLeftAxisMarkStart();
				var endx 	= this.getLeftAxisMarkEnd();
				var markGep = this.getMarkGepLeft();			

				var markLogicalGep = this.getMarkLogicalGepLeft(this.o()['series'][k]['s_min'],this.o()['series'][k]['s_max']);
				var cha = this.o()['series'][k]['s_max'] - this.o()['series'][k]['s_min'];
				var startLogical = this.o()['series'][k]['s_min'];
				var maxCharLength = (this.o()['series'][k]['s_max']+'').length;
				if(markGep < 0){
					break;
				}
				for(var i= 0; (y = (startx-(i*markGep))) > endx-1; i++) {
						var p_y = startLogical+i*markLogicalGep;
						var i_label;
						try{
							var fy = parseInt(this.o()['toFixedY']);
							if(fy > -1){
								if(cha < 1){
									this.o()['toFixedY'] = maxCharLength;
									i_label = p_y.toFixed(maxCharLength);
								}else{
									if(parseInt(p_y)+'' == p_y+''){
										i_label = this.comma(p_y);
									}else{
										i_label = this.comma(chartUtil.getFixedNum(p_y,this.o()['toFixedY']));
									}
								}
				
							}else{
								if(parseInt(p_y) == p_y){
									i_label = this.comma(p_y);
								}else{
									i_label = this.comma(chartUtil.getFixedNum(p_y,2));
								}
							}
						}catch(e){
							if(parseInt(p_y)+'' == p_y+''){
								i_label = this.comma(p_y);
							}else{
								i_label = this.comma(chartUtil.getFixedNum(p_y,2));
							}
						};

						maxLabelCompareWidth = this.mainCanvasBufferCtx.measureText(i_label).width;
						if(maxLabelCompareWidth > this.o()['leftLabelMaxWidthXY']){
							this.o()['leftLabelMaxWidthXY'] = maxLabelCompareWidth;
						}

								
						j++;
				}	

				var _x1 = this.getLeftAxisWidth();
				var _y1 = this.o()['top_margin'];
				var _width1 = this.getBottomAxisWidth();
				var _height1 = this.getLeftAxisHeight();	
				//TOP
				if(this.o()['showTopBorder']){
					this.drawLine(this.o()['axisLineColor'],1,
							_x1,_y1,
							_x1+_width1,_y1);	
				}
				//BOTTOM
				this.drawLine(this.o()['axisLineColor'],1,
						_x1,_y1+_height1,
						_x1+_width1,_y1+_height1);
				//RIGHT
				if(this.o()['showRightBorder']){
					this.drawLine(this.o()['axisLineColor'],1,
							_x1+_width1,_y1,
							_x1+_width1,_y1+_height1);
				}
				//LEFT	
				if(this.o()['showLeftBorder']){
					this.drawLine(this.o()['axisLineColor'],1,
							_x1,_y1,
							_x1,_y1+_height1);	
				}
				this.fillRect(
						this.o()['center_fill_color'],
						1,_x1,_y1,_width1,_height1);
					
				var x = this.getLeftAxisWidth()-k*this.getLeftAxisWidthPerAxis();
				var j=0;
				var y;
				//axis line theckness
				if(this.o()['multiYAxis']){
					this.drawLine(this.o()['series'][k]['s_color'],3,x,_y1,x,_y1+_height1);
					this.mainCanvasBufferCtx.fillStyle = this.o()['commonTextColor'];
					this.mainCanvasBufferCtx.fillText(this.o()['series'][k]['unitLabel_Verti'],
							x-this.mainCanvasBufferCtx.measureText(this.o()['series'][k]['unitLabel_Verti']).width-this.o()['gep_space'],
							_y1);	
				}	
				if(markGep < 0){
					break;
				}			
				for(var i= 0; (y = (startx-(i*markGep))) > endx-1; i++) {
						var p_y = startLogical+i*markLogicalGep;
						var i_label;
						try{
							var fy = parseInt(this.o()['toFixedY']);
							if(fy > -1){
								if(cha < 1){
									i_label = p_y.toFixed(maxCharLength);
								}else{
									if(parseInt(p_y)+'' == p_y+''){
										i_label = this.comma(p_y);
									}else{
										i_label = this.comma(chartUtil.getFixedNum(p_y,this.o()['toFixedY']));
									}
								}		
							}else{
								if(parseInt(p_y) == p_y){
									i_label = this.comma(p_y);
								}else{
									i_label = this.comma(chartUtil.getFixedNum(p_y,2));
								}
							}
						}catch(e){
							if(parseInt(p_y)+'' == p_y+''){
								i_label = this.comma(p_y);
							}else{
								i_label = this.comma(chartUtil.getFixedNum(p_y,2));
							}
						};

						maxLabelCompareWidth = this.mainCanvasBufferCtx.measureText(i_label).width;
						if(maxLabelCompareWidth > this.o()['leftLabelMaxWidthXY']){
							this.o()['leftLabelMaxWidthXY'] = maxLabelCompareWidth;
						}

						this.drawLine(this.o()['axis_stroke_color'],1,
								this.f(x),this.f(y),
								this.f(x-this.o()['mark_width']),this.f(y));
						
						if(k == 0){
							if(this.o()['gridShowH']){
								
								this.drawDLine_H(this.o()['axis_stroke_color'],1,
										this.f(x),
										this.f(y),
										this.f(x+this.getBottomAxisWidth()),
										this.f(y),
										2);
								
							}
						}
						
						this.mainCanvasBufferCtx.font 	= this.o()['axisTitleFont'];
						this.mainCanvasBufferCtx.fillStyle = this.o()['commonTextColor'];
						this.mainCanvasBufferCtx.fillText(i_label,
								x-this.o()['mark_width']-(maxLabelCompareWidth+this.o()['gep_space']),
								y+this.o()['leftLabelMaxHeight']/2);

						
								
						j++;
				}			
			}
		}else{
			var _x1 = this.getLeftAxisWidth();
			var _y1 = this.o()['top_margin'];
			var _width1  = this.getBottomAxisWidth();
			var _height1 = this.getLeftAxisHeight();
			this.drawRect(
					this.o()['axis_stroke_color'],
					1,_x1,_y1,_width1,_height1);
			this.fillRect(
					this.o()['center_fill_color'],
					1,_x1,_y1,_width1,_height1);
			
			
			var startx_axis = this.getLeftAxisWidth();
			var starty = this.getLeftAxisHeight()+this.o()['top_margin'];
			var endx_axis = this.getBottomAxisWidthStart()+this.getBottomAxisWidth();
			var endy = starty;
			
			var startx 	= this.getBottomAxisMarkStart();
			var endx 	= this.getBottomAxisMarkEnd();
			this.drawLine(this.o()['axis_stroke_color'],1,
					startx_axis,starty,endx_axis,endy);
			var markGep = this.getMarkGepBottom();
			for(var i=startx; i < endx+1; i+=markGep) {
				var x = i;
				var y = starty;
				var x_val = this.toLogicalVal_B(x).toFixed(2);
				var x_label = this.comma(x_val+'');
				this.drawLine(this.o()['axis_stroke_color'],1,x,starty,x,starty+this.o()['mark_width']);
				if(this.o()['gridShowV']){
					this.drawDLine_V(this.o()['axis_stroke_color'],1,x,starty,x,starty-this.getLeftAxisHeight(),2);
				}
				this.mainCanvasBufferCtx.fillStyle = this.o()['color'];
				this.mainCanvasBufferCtx.fillText(x_label,
				x-this.mainCanvasBufferCtx.measureText(x_label).width/2,
				y+this.o()['mark_width']+this.o()['mark_then_gep']+this.o()['leftLabelMaxHeight']);
			}
			
		}
	}	
};
HChart.prototype.drawYAxisR = function() {
	if(!this.o()['multiYAxis']){

		if(typeof this.o()['unitLabel_Verti_R'] != 'undefined'){
			var labelLeng = this.mainCanvasBufferCtx.measureText(this.o()['unitLabel_Verti']).width+this.o()['gep_space'];
			this.mainCanvasBufferCtx.fillStyle = this.o()['color'];
			try{
				this.drawText(this.mainCanvas.width-this.o()['fontHeight']-this.o()['gep_space'],
						((this.o()['top_margin']+this.getLeftAxisHeight())-(this.getLeftAxisHeight()-labelLeng)/2)-labelLeng
						,this.o()['color']
						,-270,this.o()['unitLabel_Verti_R']);		
			}catch(e){
				console.dir(e);
			}
		}
		
		


			
	}
	
	var pmode  = this.o()['pivot_mode'];
	if(pmode == 'XY'){
		
		var _x1 = this.getLeftAxisWidth();
		var _y1 = this.o()['top_margin'];
		var _width1 = this.getBottomAxisWidth();
		var _height1 = this.getLeftAxisHeight();

		var axisLeng = 1;
		if(this.o()['multiYAxis']){
			axisLeng = this.o()['series'].length;
		}else if(this.o()['bothYAxis']){
			axisLeng = this.o()['series'].length;
		}else{
			axisLeng = 1;		
		}
		for(var k=0;k<axisLeng;k++){	
			if(this.o()['series'][k]['s_axis'] == 'R'){
				var xCntMax = this.o()['minmax']['xCntMax'];
				var markCount = this.getMarkCountLeft();
				var data;
				if(this.o()['multiYAxis']){
					data = this.o()['series'][k].s_data;
				}else{
					if(typeof this.o()['minmax']['xCntMaxSIndex'] == 'undefined'){
						data = this.o()['series'][0].s_data;
					}else{
						data = this.o()['series'][this.o()['minmax']['xCntMaxSIndex']].s_data;
					}
				}

				var startx 	= this.getLeftAxisMarkStart();
				var endx 	= this.getLeftAxisMarkEnd();
				var markGep = this.getMarkGepLeft();
				var markLogicalGep = this.getMarkLogicalGepLeft(this.o()['series'][k]['s_min'],this.o()['series'][k]['s_max']);

				var x 		= this.getBottomAxisWidth()+this.getLeftAxisWidth();
				var j=0;
				var y;
				//axis line theckness
				if(this.o()['multiYAxis']){
					this.drawLine(this.o()['series'][k]['s_color'],3,x,_y1,x,_y1+_height1);
					this.mainCanvasBufferCtx.font 	= this.o()['axisTitleFont'];
					this.mainCanvasBufferCtx.fillStyle = this.o()['commonTextColor'];					
					this.mainCanvasBufferCtx.fillText(this.o()['series'][k]['unitLabel_Verti'],
							x-this.mainCanvasBufferCtx.measureText(this.o()['series'][k]['unitLabel_Verti']).width-this.o()['gep_space'],
							_y1);	
				}

				var startLogical = this.o()['series'][k]['s_min'];
				if(markGep < 0){
					break;
				}
				for(var i= 0; (y = (startx-(i*markGep))) > endx-1; i++) {
							var p_y = startLogical+i*markLogicalGep;
							var i_label;
							if(this.o()['toFixedY'] != 0){
								i_label = this.comma(chartUtil.getFixedNum(p_y,this.o()['toFixedY']));
							}else{
								i_label = this.comma(p_y);
							};
							this.drawLine(this.o()['axis_stroke_color'],1,
									this.f(x),this.f(y),
									this.f(x+this.o()['mark_width']),this.f(y));
							if(k == 0){
								if(this.o()['gridShowH']){
									/*
									this.drawDLine_H(this.o()['axis_stroke_color'],1,
											this.f(x),
											this.f(y),
											this.f(x+this.getBottomAxisWidth()),
											this.f(y),
											2);
									*/		
								}
							}
							this.mainCanvasBufferCtx.font 	= this.o()['axisTitleFont'];
							this.mainCanvasBufferCtx.fillStyle = this.o()['commonTextColor'];							
							this.mainCanvasBufferCtx.fillText(i_label,
									x+this.o()['mark_width']+this.o()['gep_space'],
									y+this.o()['leftLabelMaxHeight']/2);	
							j++;	
	
				}	
			}
		}
	}else{
		var _x1 = this.getLeftAxisWidth();
		var _y1 = this.o()['top_margin'];
		var _width1  = this.getBottomAxisWidth();
		var _height1 = this.getLeftAxisHeight();
		this.drawRect(
				this.o()['axis_stroke_color'],
				1,_x1,_y1,_width1,_height1);
		this.fillRect(
				this.o()['center_fill_color'],
				1,_x1,_y1,_width1,_height1);
		
		
		var startx_axis = this.getLeftAxisWidth();
		var starty = this.getLeftAxisHeight()+this.o()['top_margin'];
		var endx_axis = this.getBottomAxisWidthStart()+this.getBottomAxisWidth();
		var endy = starty;
		
		var startx 	= this.getBottomAxisMarkStart();
		var endx 	= this.getBottomAxisMarkEnd();
		this.drawLine(this.o()['axis_stroke_color'],1,
				startx_axis,starty,endx_axis,endy);
		var markGep = this.getMarkGepBottom();
		for(var i=startx; i < endx+1; i+=markGep) {
			var x = i;
			var y = starty;
			var x_val = this.toLogicalVal_B(x).toFixed(2);
			var x_label = this.comma(x_val+'');
			this.drawLine(this.o()['axis_stroke_color'],1,x,starty,x,starty+this.o()['mark_width']);
			if(this.o()['gridShowV']){
				this.drawDLine_V(this.o()['axis_stroke_color'],1,x,starty,x,starty-this.getLeftAxisHeight(),2);
			}
			this.mainCanvasBufferCtx.fillStyle = this.o()['color'];
			this.mainCanvasBufferCtx.fillText(x_label,
			x-this.mainCanvasBufferCtx.measureText(x_label).width/2,
			y+this.o()['mark_width']+this.o()['mark_then_gep']+this.o()['leftLabelMaxHeight']);
		}
		
	}
};
HChart.prototype.setMinMax = function() {
	var minmaxObj = this.o()['minmax'];
		var series = this.o()['series'];
		var min;
		var max;
		var xCntMin;
		var xCntMax;
		var xCntMaxSIndex;
		var xLabelMax='';
		for(var i=0; i < series.length; i++){
			if(i == 0){
				xCntMin 		= series[i].s_data.length;
				xCntMax 		= xCntMin;
				xCntMaxSIndex 	= i;
			}else{
				if(xCntMin >  series[i].s_data.length){
					min =  series[i].s_data.length;	
				}else if(xCntMax <  series[i].s_data.length){
					max =  series[i].s_data.length;	
					xCntMaxSIndex 	= i;
				}			
			}
			for(var j=0; j < series[i].s_data.length; j++){
				if(i == 0 && j == 0){
					min 			= series[i].s_data[j][1];
					max 			= min;
					xLabelMax 		= series[i].s_data[j][0]+'';
				}else{
					if(min >  series[i].s_data[j][1]){
						min =  series[i].s_data[j][1];	
					}else if(max <  series[i].s_data[j][1]){
						max =  series[i].s_data[j][1];				
					}
					if(xLabelMax.length < (series[i].s_data[j][0]+'').length){
						xLabelMax = (series[i].s_data[j][0]+'');
					}
				}
			}
		}
		if(this.o()['max'] != null){
			max = this.o()['max'];
		}
		if(this.o()['min'] != null){
			min = this.o()['min'];
		}
		var reMinMaxObj = {
				'min':min,
				'max':max,
				'xCntMin':xCntMin,
				'xCntMax':xCntMax,
				'xCntMaxSIndex':xCntMaxSIndex,
				'xLabelMax':xLabelMax
				};
		this.o()['minmax'] = reMinMaxObj;
	return this.o()['minmax'];
};
HChart.prototype.comma = function(n) {
	var k = parseFloat(n);
	if(n == k){
		var reg = /(^[+-]?\d+)(\d{3})/;   
		n += '';                          

		while (reg.test(n))
	    n = n.replace(reg, '$1' + ',' + '$2');
	}
	return n;
};


HChart.prototype.drawLine = function(_color,_lineWidth,_x1,_y1,_x2,_y2,_ctx) {
	if(_ctx == null){
		_ctx = this.mainCanvasBufferCtx;
	}
	_ctx.strokeStyle = _color;
	_ctx.beginPath();
	try{
		_ctx.translate(0.5, 0.5);
		_ctx.lineWidth = _lineWidth;
	}catch(e){
		if(window.console != null) console.dir(e);
	}
	_ctx.moveTo(_x1,_y1);
	_ctx.lineTo(_x2,_y2);
	_ctx.stroke();
	try{
		_ctx.translate(-0.5, -0.5);
	}catch(e){
		console.dir(e);
	}
	_ctx.closePath();
};
HChart.prototype.drawArc = function(_color,_lineWidth,_x1,_y1,_r) {
	
	this.mainCanvasBufferCtx.strokeStyle = _color;
	this.mainCanvasBufferCtx.fillStyle = _color;
	this.mainCanvasBufferCtx.beginPath();
	try{
		this.mainCanvasBufferCtx.translate(0.5, 0.5);
		this.mainCanvasBufferCtx.lineWidth = _lineWidth;
	}catch(e){
		if(window.console != null) console.dir(e);
	}
	this.mainCanvasBufferCtx.arc(_x1, _y1,_r, 0, 2 * Math.PI, false);
	this.mainCanvasBufferCtx.fill();
	try{
		this.mainCanvasBufferCtx.translate(-0.5, -0.5);
	}catch(e){
		if(window.console != null) console.dir(e);
	}
	this.mainCanvasBufferCtx.stroke();
	this.mainCanvasBufferCtx.closePath();
};

HChart.prototype.drawTipLine = function(_color,_degree,_x,_y,_width,height,_label,_option) {
	var x = _x + _width/2;
	if(_option != null){
		x = _x;
	}
	var y = _y - 20;
    //-------------------------------------------------- /
    this.mainCanvasBufferCtx.translate(x,y);
	this.mainCanvasBufferCtx.lineWidth = 1;
    this.mainCanvasBufferCtx.rotate(_degree*(Math.PI/180));
		this.mainCanvasBufferCtx.beginPath();
			var flag_gep = parseFloat(height/16);
			var base_height = (0 - height);
			this.mainCanvasBufferCtx.fillStyle = _color;
			this.mainCanvasBufferCtx.strokeStyle = _color;
			this.mainCanvasBufferCtx.moveTo(0, 0);
			this.mainCanvasBufferCtx.lineTo(0, base_height);

			this.mainCanvasBufferCtx.stroke();	
		this.mainCanvasBufferCtx.closePath();
    this.mainCanvasBufferCtx.rotate(-_degree*(Math.PI/180));
    this.mainCanvasBufferCtx.translate(-x, -y);
    
    _degree -= 90;
    //--------------------------------------------------TEXT1
    var gep = 4;
    var tt = _label.split('(');
    this.mainCanvasBufferCtx.translate(x,(y-gep));
    //this.mainCanvasBufferCtx.font = '12px a';
	this.mainCanvasBufferCtx.lineWidth = 1;
    this.mainCanvasBufferCtx.rotate(_degree*(Math.PI/180));
		this.mainCanvasBufferCtx.beginPath();
			var flag_gep = parseFloat(height/16);
			var base_height = (0 - height);
			this.mainCanvasBufferCtx.fillStyle = _color;
			this.mainCanvasBufferCtx.strokeStyle = _color;
			
		    this.mainCanvasBufferCtx.fillText(tt[0],0,0);
		    
			this.mainCanvasBufferCtx.stroke();	
		this.mainCanvasBufferCtx.closePath();
    this.mainCanvasBufferCtx.rotate(-_degree*(Math.PI/180));
    this.mainCanvasBufferCtx.translate(-x, -(y-gep));    

    //--------------------------------------------------TEXT2(...)
	if(tt[1] != null){
		var gep = -6;
		var xgep = 10;
		var tt = _label.split('(');
		this.mainCanvasBufferCtx.translate((x+xgep),(y-gep));
		//this.mainCanvasBufferCtx.font = '12px a';
		this.mainCanvasBufferCtx.lineWidth = 1;
		this.mainCanvasBufferCtx.rotate(_degree*(Math.PI/180));
			this.mainCanvasBufferCtx.beginPath();
				var flag_gep = parseFloat(height/16);
				var base_height = (0 - height);
				this.mainCanvasBufferCtx.fillStyle = _color;
				this.mainCanvasBufferCtx.strokeStyle = _color;
				
				this.mainCanvasBufferCtx.fillText('('+tt[1],0,0);
				
				this.mainCanvasBufferCtx.stroke();	
			this.mainCanvasBufferCtx.closePath();
		this.mainCanvasBufferCtx.rotate(-_degree*(Math.PI/180));
		this.mainCanvasBufferCtx.translate(-(x+xgep), -(y-gep)); 
    }
    //-------------------------------------------------- |
    this.mainCanvasBufferCtx.translate(x,_y);
	this.mainCanvasBufferCtx.lineWidth = 1;
		this.mainCanvasBufferCtx.beginPath();
			var flag_gep = parseFloat(height/16);
			var base_height = -(_y - y);
			this.mainCanvasBufferCtx.fillStyle = _color;
			this.mainCanvasBufferCtx.strokeStyle = _color;
			this.mainCanvasBufferCtx.moveTo(0, 0);
			this.mainCanvasBufferCtx.lineTo(0, base_height);
			this.mainCanvasBufferCtx.stroke();	
		this.mainCanvasBufferCtx.closePath();
    this.mainCanvasBufferCtx.translate(-x, -_y);  
    

    

};



HChart.prototype.drawRect = function(_color,_lineWidth,_x1,_y1,_x2,_y2,_midCtx) {
	if(_midCtx == null){
		_midCtx = this.mainCanvasBufferCtx;
	}
	_midCtx.strokeStyle = _color;
	_midCtx.beginPath();
	try{
		_midCtx.translate(0.5, 0.5);
		_midCtx.lineWidth = _lineWidth;
	}catch(e){
		if(window.console != null) console.dir(e);
	}
	_midCtx.strokeRect(_x1,_y1,_x2,_y2);
	try{
		_midCtx.translate(-0.5, -0.5);
	}catch(e){
		if(window.console != null) console.dir(e);
	}
	_midCtx.closePath();
};


HChart.prototype.fillRect = function(_fill_color,_lineWidth,_x1,_y1,_x2,_y2,_midCtx) {
	if(_midCtx == null){
		_midCtx = this.mainCanvasBufferCtx;
	}	
	_midCtx.fillStyle = _fill_color;
	_midCtx.beginPath();
	try{
		_midCtx.translate(0.5, 0.5);
		_midCtx.lineWidth = _lineWidth;
	}catch(e){
		if(window.console != null) console.dir(e);
	}
	_midCtx.fillRect(_x1,_y1,_x2,_y2);
	try{
		_midCtx.translate(-0.5, -0.5);
	}catch(e){
		if(window.console != null) console.dir(e);
	}
	_midCtx.closePath();
};
HChart.prototype.getLeftAxisHeight = function() {
	return this.mainCanvas.height 
	- this.o()['bottomLabelMaxHeight']//11
	- this.o()['bottom_legend_box_height']//40
	- this.o()['bottom_legend_box_top_margin']//5
	- this.o()['bottom_legend_box_bottom_margin']//5
	- this.o()['top_margin'];
};

HChart.prototype.getLeftAxisHeightMaxVal = function() {
	return (this.getMarkCountLeft())*this.getMarkGepLeft();
};

HChart.prototype.getLeftAxisWidth = function() {
	var lWidth;
	if(this.o()['pivot_mode'] == 'XY'){
		lWidth = this.getLeftAxisWidthPerAxis();
		if(this.o()['multiYAxis']){
			lWidth *= this.o()['series'].length;
		}else{
			lWidth *= 1;
		}		
	}else{
		lWidth = this.getLeftAxisWidthPerSeries();	
	}
	//lWidth += this.o()['xLabelStartGep'];
	lWidth += this.o()['gep_space'];
	return lWidth;
};
HChart.prototype.getRightAxisWidth = function() {
	var rWidth;
	if(this.o()['pivot_mode'] == 'XY'){
		rWidth = this.getRightAxisWidthPerAxis();
		
		if(this.o()['multiYAxis']){
			rWidth *= this.o()['series'].length;
		}else{
			rWidth *= 1;
		}		
		
	}else{
		rWidth = this.getLeftAxisWidthPerSeries();	
	}
	return rWidth;
};

HChart.prototype.getLeftAxisWidthPerSeries = function() {
	var lWidth = (this.o()['leftLabelMaxWidth']
	+ 	this.o()['left_legend_box_width']
	+ 	this.o()['left_legend_box_left_margin']
	+ 	this.o()['left_legend_box_right_margin']
	+ 	this.o()['gep_space']);
	
	
	return lWidth;
};

HChart.prototype.getLeftAxisWidthPerAxis = function() {
	var lWidth = (this.o()['leftLabelMaxWidthXY']
	+ 	this.o()['left_legend_box_width']
	+ 	this.o()['left_legend_box_left_margin']
	+ 	this.o()['left_legend_box_right_margin']
	+ 	this.o()['gep_space']);
	return lWidth;
};
HChart.prototype.getRightAxisWidthPerAxis = function() {
	var lWidth = (this.o()['leftLabelMaxWidthXY']
	+ 	this.o()['left_legend_box_width']
	+ 	this.o()['left_legend_box_left_margin']
	+ 	this.o()['left_legend_box_right_margin']
	+ 	this.o()['gep_space']);
	
	return lWidth;
};
HChart.prototype.getBottomAxisHeight = function() {
	return this.mainCanvas.height 
	- this.getLeftAxisHeight();
};
HChart.prototype.getBottomAxisWidth = function() {
	return this.getBottomAxisWidthEnd()
	- this.getBottomAxisWidthStart();
};

HChart.prototype.getBottomAxisWidthStart = function() {
	return this.getLeftAxisWidth();
};
HChart.prototype.getBottomAxisWidthEnd = function() {
	var a = this.o()['rightLabelMaxWidthXY'];
	if(a != null){
		return this.mainCanvas.width- this.o()['right_margin']- this.o()['fontHeight']-a; 	
	}else{
		return this.mainCanvas.width- this.o()['right_margin']- this.o()['fontHeight']; 	
	}

};
HChart.prototype.getLeftAxisWidthEnd = function() {
	return this.mainCanvas.width- this.o()['right_margin']; 
};

HChart.prototype.getBottomAxisMarkStart = function() {
	return this.getLeftAxisWidth()+this.getMarkGepBottom();
};
HChart.prototype.getBottomAxisMarkEnd = function() {
	return	this.getBottomAxisMarkStart()+this.getMarkGepBottom()*this.getMarkCountBottom(); 
};

HChart.prototype.getLeftAxisMarkStart = function() {
	return this.getLeftAxisHeight()+this.o()['top_margin'];
};
HChart.prototype.getLeftAxisMarkEnd = function() {
	return	this.getLeftAxisMarkStart()-this.f(this.getLeftAxisHeightMaxVal());
};


HChart.prototype.getMarkCountBottom = function() {
	
	if(this.o()['pivot_mode'] == 'XY'){
		if(this.o()['xrange_axis']){
			return this.o()['xrange_count'];	
		}else{
			var cnt = 0;
			var s_data = [];
			
			for(var i=0;i< this.o()['series'].length; i++){
				var s_data_tmp = this.o()['series'][i].s_data;
				if(s_data_tmp != null && s_data_tmp.length > s_data.length){
					cnt = s_data_tmp.length;
				}else{
				}
			}	
			return cnt;	
		}

	}else{
		return this.o()['y_mark_cnt'];
	}
	
	
	
	
};
HChart.prototype.getMarkCountLeft = function() {
	return this.o()['y_mark_cnt'];
};
HChart.prototype.getMarkGepBottom = function() {
	var targetWidth = this.getBottomAxisWidthEnd()-this.getBottomAxisWidthStart();
	var gep;
	if(this.o()['xrange_axis']){
		gep = targetWidth/(this.getMarkCountBottom()+2);//range형 x축일때
	}else{
		gep = targetWidth/(this.getMarkCountBottom()+1);//개별 x축일때
	}
	
	return gep;
};

HChart.prototype.getMarkGepLeft = function() {
	var targetWidth = this.getLeftAxisHeightStart() - this.getLeftAxisHeightEnd();
	var gep = targetWidth/(this.getMarkCountLeft()+1);
	return gep;
};
HChart.prototype.getMarkLogicalGepLeft = function(_min,_max) {
	var gep = (_max-_min)/(this.getMarkCountLeft());
	return gep;
};
HChart.prototype.getLeftAxisHeightEnd = function() {
	return this.o()['top_margin'];
};
HChart.prototype.getLeftAxisHeightStart = function() {
	return this.getLeftAxisHeight()+this.o()['top_margin'];
};
HChart.prototype.toPhysicalVal_L = function(_LogicalVal) {
	var max = this.o()['xmax'];
	var min = this.o()['xmin'];
	
	return ((this.o()['top_margin']+this.getMarkGepLeft())+(this.getLeftAxisHeightMaxVal()))-((_LogicalVal-min)/(max-min))*(this.getLeftAxisHeightMaxVal());
};
HChart.prototype.toPhysicalVal_L_Y = function(_LogicalVal,_min,_max) {
	var max;	
	var min;
	if(_min == null){
		min = this.o()['minmax']['min'];
	}else{
		min = _min;
	}
	if(_max == null){
		max = this.o()['minmax']['max'];
	}else{
		max = _max;
	}
	return (((this.o()['top_margin']+this.getMarkGepLeft())+(this.getLeftAxisHeightMaxVal()))-((_LogicalVal-min)/(max-min))*(this.getLeftAxisHeightMaxVal()));
};
HChart.prototype.toLogicalVal_L = function(_PhysicalVal) {
	var max = this.o()['xmax'];
	var min = this.o()['xmin'];
	
	return min+this.f(this.f(this.f(this.getLeftAxisMarkStart()-_PhysicalVal)/this.f(this.getLeftAxisMarkStart()-this.getLeftAxisMarkEnd())))*(max-min);
};
HChart.prototype.toLogicalVal_L_Y = function(_PhysicalVal,_min,_max) {
	var max;	
	var min;
	if(_min == null){
		min = this.o()['minmax']['min'];
	}else{
		min = _min;
	}
	if(_max == null){
		max = this.o()['minmax']['max'];
	}else{
		max = _max;
	}
	return min+(((this.getLeftAxisMarkStart()-_PhysicalVal)/(this.getLeftAxisMarkStart()-this.getLeftAxisMarkEnd())))*(max-min);
};

HChart.prototype.drawArrow = function(x,y,_degree,width,height,_color) {
	this.mainCanvasBufferCtx.fillStyle = _color;
    this.mainCanvasBufferCtx.translate(x,y);
	this.mainCanvasBufferCtx.lineWidth = 1;
    this.mainCanvasBufferCtx.rotate(_degree*Math.PI/180);
	this.mainCanvasBufferCtx.beginPath();
	this.mainCanvasBufferCtx.moveTo(0, 0);
	this.mainCanvasBufferCtx.lineTo(0 + width / 2, 0 - height);
	this.mainCanvasBufferCtx.lineTo(0.5, 0 - height);
	this.mainCanvasBufferCtx.lineTo(0.5, 0 - height*2);
	this.mainCanvasBufferCtx.lineTo(-0.5, 0 - height*2);
	this.mainCanvasBufferCtx.lineTo(-0.5, 0 - height);
	this.mainCanvasBufferCtx.lineTo(0 - width / 2, 0 - height);
	this.mainCanvasBufferCtx.closePath();
	this.mainCanvasBufferCtx.rotate(-_degree*Math.PI/180);
    this.mainCanvasBufferCtx.translate(-x, -y);
    this.mainCanvasBufferCtx.fill();
	
}

HChart.prototype.fillTri = function(_x,_y,_gep,_slope,_fillColor,_strokeColor) {
	if(_fillColor != null){
		this.mainCanvasBufferCtx.fillStyle = _fillColor; 	
	}else{
		this.mainCanvasBufferCtx.fillStyle = this.o()['windFlagColor']; 
	}
	if(_strokeColor != null){
		this.mainCanvasBufferCtx.strokeStyle = _strokeColor; 	
	}else{
		this.mainCanvasBufferCtx.strokeStyle = this.o()['windFlagColor']; 
	}
	this.mainCanvasBufferCtx.lineTo(0,_y);
	this.mainCanvasBufferCtx.lineTo(0 + _x, _y + (_gep-_slope));//疫꿸퀣�길묾占퐏ubLeng)�쒙옙餓ο옙
	this.mainCanvasBufferCtx.lineTo(0, _y + _gep*2);
	this.mainCanvasBufferCtx.fill();
}


HChart.prototype.toPhysicalVal_B = function(_LogicalVal) {
	var max = this.o()['minmax']['max'];
	var min = this.o()['minmax']['min'];
	return (this.getBottomAxisMarkStart()+(((_LogicalVal-min)/(max-min)))*(this.getBottomAxisMarkEnd()-this.getBottomAxisMarkStart()));
};
HChart.prototype.toPhysicalVal_B_X = function(_LogicalVal) {
	var max = this.o()['xmax'];
	var min = this.o()['xmin'];
	return (this.getBottomAxisMarkStart()+(((_LogicalVal-min)/(max-min)))*(this.getBottomAxisMarkEnd()-this.getBottomAxisMarkStart()));
};
HChart.prototype.toLogicalVal_B = function(_PhysicalVal) {
	var max = this.o()['minmax']['max'];
	var min = this.o()['minmax']['min'];
	return this.f(min+((this.f(_PhysicalVal-this.getBottomAxisMarkStart())/this.f(this.getBottomAxisMarkEnd()-this.getBottomAxisMarkStart())))*this.f(max-min));
};
HChart.prototype.toLogicalVal_B_X = function(_PhysicalVal) {
	var max = this.o()['xmax'];
	var min = this.o()['xmin'];
	return this.f(min+((_PhysicalVal-this.getBottomAxisMarkStart())/(this.getBottomAxisMarkEnd()-this.getBottomAxisMarkStart()))*(max-min));
};

HChart.prototype.comma = function(n) {
	var k = parseFloat(n);
	if(n == k){
		var reg = /(^[+-]?\d+)(\d{3})/;   
		n += '';                          

		while (reg.test(n))
	    n = n.replace(reg, '$1' + ',' + '$2');
	}
	return n;
};

var T=Number('1e'+10);
HChart.prototype.f = function(_n) {
	return Math.round(_n);
};

HChart.prototype.CatmullRomSplines = function(_color,_lineWidth,p0, p1, p2, p3) {
	this.mainCanvasBufferCtx.strokeStyle = _color;
    if (p0 == null) {
            p0x = 0;
            p0y = 0;
    } else {
            p0x = p0._x;
            p0y = p0._y;
    }
    if(p3 == null){
            p3x = 0
            p3y = 0;
    }else{
            p3x = p3._x;
            p3y = p3._y;
    }

    p2x = p2._x;
    p2y = p2._y;
    p1x = p1._x;
    p1y = p1._y;


    var d = 5;
	this.mainCanvasBufferCtx.beginPath();
	try{
		this.mainCanvasBufferCtx.translate(0.5, 0.5);
		this.mainCanvasBufferCtx.lineWidth = _lineWidth;
	}catch(e){
		if(window.console != null) console.dir(e);
	}
    this.mainCanvasBufferCtx.moveTo(p1x, p1y);
    for (var i = 0; i<=d; i++) {
            var t = i/d;
            var t2 = t*t;
            var t3 = t2*t;
            var px = 0.5*((2*p1x)+(-p0x+p2x)*t+(2*p0x-5*p1x+4*p2x-p3x)*t2+(-p0x+3*p1x-3*p2x+p3x)*t3);
            var py = 0.5*((2*p1y)+(-p0y+p2y)*t+(2*p0y-5*p1y+4*p2y-p3y)*t2+(-p0y+3*p1y-3*p2y+p3y)*t3);
            this.mainCanvasBufferCtx.lineTo(px, py);
    }
	try{
		this.mainCanvasBufferCtx.translate(-0.5, -0.5);
	}catch(e){
		if(window.console != null) console.dir(e);
	}
	this.mainCanvasBufferCtx.stroke();
	this.mainCanvasBufferCtx.closePath(); 
    
};

HChart.prototype.drawSeriesPie = function(_cutLabel,_cutValue,_groupColor) {

	var pmode  = this.o()['pivot_mode'];
	if(pmode == 'XY'){
		var xCntMax = this.o()['minmax']['xCntMax'];

		var markCount = this.getMarkCountLeft();
		for(var i=0;i< this.o()['series'].length; i++){
			var s_data 			= this.o()['series'][i].s_data;
			var s_color 		= this.getSColor(this,i);
			var s_lineWidth 	= this.o()['series'][i].s_lineWidth; 
			var s_shape 		= this.o()['series'][i].s_shape;
			var s_sizeDefault 	= this.o()['series'][i].s_sizeDefault;
			var s_shapeColor 	= this.getSpColor(this,i);
			var s_chartType 	= this.o()['series'][i].s_chartType;
			var s_unit 			= this.o()['series'][i].s_unit;
			if(s_unit == null){
				s_unit = '';
			}

			
			if(s_chartType == 'spline'){
			}else if(s_chartType == 'line'){
					var markGepx = this.getMarkGepBottom();
					var markGepy = this.getMarkGepLeft();	
					var orix;
					var oriy;
					var startR =0;
					var startDgree =0;
					
					var circleR = this.o()['radius'];
				
					var tipLineSize = circleR+circleR*0.1;
					var valueSum = 0;
					var dataLen = s_data.length;
					var dataAttrLen = s_data.length;
					var maxJ = -9999999;
					var maxL = '';
					var cutValue;
					for(var j=0;j < dataLen; j++){
						if(j == 0){
							dataAttrLen = s_data[j].length;
						}
						var y = parseFloat(s_data[j][1]);
						valueSum += y;
						if(y > maxJ){
							maxJ = y;
							maxL = s_data[j][0];
						}
					}
					
					if(this.o()['valueSum'] == null){
						this.o()['valueSum'] = valueSum;
					}
					
					var basisx;
					var basisy;

					for(var j=0;j < dataLen; j++){
						//orix = this.f(this.getLeftAxisWidth()+this.getBottomAxisWidth()/2);
						orix = this.f(this.mainCanvas.width/2);
						//oriy = this.f(this.o()['top_margin']+this.getLeftAxisHeight()/2);
						oriy = this.f(this.mainCanvas.height/2);

						basisx = orix;
						basisy = oriy;
						//var x = parseFloat(s_data[j][4])-5;//u x축 -5는 축보정값
						var y = parseFloat(s_data[j][1]);//v y축
						if(y != 0){
							
							//var px = this.toPhysicalVal_B_X(x);
							var py = this.toPhysicalVal_L_Y(y,this.o()['series'][i]['s_min'],this.o()['series'][i]['s_max']);
							//(38/360) * Math.PI
							
							var result = Math.floor(Math.random() * 10000) + 1;
							var color = this.o()['colorObj'].getColour(result%200);
							
							var percent = (y/valueSum);
							var percent100 = percent*100;
							var dgree = percent*360;

							//var r2 = dgree/2;
							var nowDgree = startDgree+dgree/2;
							var radion = nowDgree*(Math.PI/180);

							var xVal = Math.cos(radion)*tipLineSize;
							var yPoint = Math.tan(radion)*(xVal);	
							var x2 = orix+xVal;
							var y2 = oriy-yPoint;
							colorText = this.o()['textStrokeColor'];
							this.mainCanvasBufferCtx.font = this.o()['textFont'];
							var itemText = s_data[j][0]+"("+y+s_unit+")";
						
							var cutPieGep = circleR/10;
							var tipLineW = tipLineSize/20;
							if(_cutValue == null){
								cutValue = maxJ;
								_cutLabel = maxL;							
							}else{
								cutValue = _cutValue;
							}

							if(!this.o()['cutPie']){
								_cutLabel = '';
								cutValue = -99999999999;
								_groupColor = null;
							}
							
							var ox = orix;
							var oy = oriy;
							//3시가 0도
							//
								if(nowDgree >= 0 && nowDgree <= 90){
									if((_cutLabel == s_data[j][0] && cutValue == s_data[j][1]) ||(_groupColor!=null && _groupColor == s_data[j][2]) ){
										ox += cutPieGep*Math.abs(Math.cos(radion));
										oy -= cutPieGep*Math.abs(Math.sin(radion));
									}	
									var x3 = x2+tipLineW;	
									if(this.o()['guideLineShow']){								
										this.drawLine(colorText,1,ox+cutPieGep*Math.abs(Math.cos(radion)),oy-cutPieGep*Math.abs(Math.sin(radion)),x2,y2);	
										this.drawLine(colorText,1,x2,y2,x3,y2);	
										this.mainCanvasBufferCtx.fillStyle = colorText;
										this.mainCanvasBufferCtx.fillText(itemText,x3,y2);
									}								
								}else if(nowDgree >= 90 && nowDgree <= 180){
									if((_cutLabel == s_data[j][0] && cutValue == s_data[j][1]) ||(_groupColor!=null && _groupColor == s_data[j][2]) ){
										ox -= cutPieGep*Math.abs(Math.cos(radion));
										oy -= cutPieGep*Math.abs(Math.sin(radion));
									}		
									var x3 = x2-tipLineW;
									
									if(this.o()['guideLineShow']){								
										this.drawLine(colorText,1,ox-cutPieGep*Math.abs(Math.cos(radion)),oy-cutPieGep*Math.abs(Math.sin(radion)),x2,y2);				
										this.drawLine(colorText,1,x3,y2,x2,y2);	
										this.mainCanvasBufferCtx.fillStyle = colorText;
										this.mainCanvasBufferCtx.fillText(itemText,x3-this.mainCanvasBufferCtx.measureText(itemText).width,y2);	
									}																	
								}else if(nowDgree >= 180 && nowDgree <= 270){						
									if((_cutLabel == s_data[j][0] && cutValue == s_data[j][1])  ||(_groupColor!=null && _groupColor == s_data[j][2]) ){
										ox -= cutPieGep*Math.abs(Math.cos(radion));
										oy += cutPieGep*Math.abs(Math.sin(radion));
									}								
									var x3 = x2-tipLineW;


									if(this.o()['guideLineShow']){								
										this.drawLine(colorText,1,ox-cutPieGep*Math.abs(Math.cos(radion)),oy+cutPieGep*Math.abs(Math.sin(radion)),x2,y2);				
										this.drawLine(colorText,1,x3,y2,x2,y2);
										this.mainCanvasBufferCtx.fillStyle = colorText;
										this.mainCanvasBufferCtx.fillText(itemText,x3-this.mainCanvasBufferCtx.measureText(itemText).width,y2);	
									}									
								}else {						
									if((_cutLabel == s_data[j][0] && cutValue == s_data[j][1])  ||(_groupColor!=null && _groupColor == s_data[j][2]) ){
										ox += cutPieGep*Math.abs(Math.cos(radion));
										oy += cutPieGep*Math.abs(Math.sin(radion));
									}								
									var x3 = x2+tipLineW;

									if(this.o()['guideLineShow']){								
										this.drawLine(colorText,1,ox+cutPieGep*Math.abs(Math.cos(radion)),oy+cutPieGep*Math.abs(Math.sin(radion)),x2,y2);				
										this.drawLine(colorText,1,x2,y2,x3,y2);
										this.mainCanvasBufferCtx.fillStyle = colorText;
										this.mainCanvasBufferCtx.fillText(itemText,x3,y2);	
									}								
								}
							//}
							startDgree = nowDgree+dgree/2;
							
							
							var targetRadian = (-Math.PI/180*dgree);
							
							var colorText;
							if(dataAttrLen == 3){
								colorText = s_data[j][2];
							}else{
								//colorText = 'rgba('+color.red+','+color.green+','+color.blue+',1)';
								colorText = this.o()['colorList'][j];
							}
							
							//Pie그리기
							this.drawArc2(
									s_color,
									colorText,
									1,
									ox,
									oy,
									circleR,
									startR,
									startR+targetRadian
									);		


							startR += targetRadian;						
							startx_axis = px; 
							starty = py;	
							
						}

						
					}
					if(this.o()['type'] == 'doughnut' ){
						this.mainCanvasBufferCtx.globalCompositeOperation = 'destination-out';
						this.drawArc3(
								'rgba(255,255,255,1)',
								1,
								basisx,
								basisy,
								circleR/2,
								0,
								2*Math.PI
								);
						this.mainCanvasBufferCtx.globalCompositeOperation = 'source-over';
					}
														
				/*}*/
			}
				
		}

		
		
		
	}else{
		var xCntMax = this.o()['minmax']['xCntMax'];
		var markCount = this.getMarkCountLeft();
		
		for(var i=0;i< this.o()['series'].length; i++){
			var s_data 			= this.o()['series'][i].s_data;
			var s_color 		= this.getSColor(this,i);
			var s_lineWidth 	= this.o()['series'][i].s_lineWidth; 
			var s_shape 		= this.o()['series'][i].s_shape;
			var s_sizeDefault 	= this.o()['series'][i].s_sizeDefault;
			var s_shapeColor 	= this.getSpColor(this,i);
			var s_unit 			= this.o()['series'][i].s_unit;
			if(s_unit == null){
				s_unit = '';
			}
			var prePonit = {};
			for(var j=0;j < s_data.length; j++){
				var x = s_data[j][0];
				var y = s_data[j][1];

				var py = this.toPhysicalVal_B(y);
				var px = this.toPhysicalVal_L(x);

				if(j > 1 && j < s_data.length-1){
					this.CatmullRomSplines(s_color,s_lineWidth,
							{'_x':this.toPhysicalVal_B(s_data[j-2][1]),'_y':this.toPhysicalVal_L(s_data[j-2][0])},
							{'_x':this.toPhysicalVal_B(s_data[j-1][1]),'_y':this.toPhysicalVal_L(s_data[j-1][0])},
							{'_x':this.toPhysicalVal_B(s_data[j][1]),'_y':this.toPhysicalVal_L(s_data[j][0])},
							{'_x':this.toPhysicalVal_B(s_data[j+1][1]),'_y':this.toPhysicalVal_L(s_data[j+1][0])}
							);
				}else if(j == 1){
					this.CatmullRomSplines(s_color,s_lineWidth,
							{'_x':this.toPhysicalVal_B(s_data[j-1][1]),'_y':this.toPhysicalVal_L(s_data[j-1][0])},
							{'_x':this.toPhysicalVal_B(s_data[j-1][1]),'_y':this.toPhysicalVal_L(s_data[j-1][0])},
							{'_x':this.toPhysicalVal_B(s_data[j][1]),'_y':this.toPhysicalVal_L(s_data[j][0])},
							{'_x':this.toPhysicalVal_B(s_data[j+1][1]),'_y':this.toPhysicalVal_L(s_data[j+1][0])}
							);
				}else if(j == s_data.length-1){
					this.CatmullRomSplines(s_color,s_lineWidth,
							{'_x':this.toPhysicalVal_B(s_data[j-2][1]),'_y':this.toPhysicalVal_L(s_data[j-2][0])},
							{'_x':this.toPhysicalVal_B(s_data[j-1][1]),'_y':this.toPhysicalVal_L(s_data[j-1][0])},
							{'_x':this.toPhysicalVal_B(s_data[j][1]),'_y':this.toPhysicalVal_L(s_data[j][0])},
							{'_x':this.toPhysicalVal_B(s_data[j][1]),'_y':this.toPhysicalVal_L(s_data[j][0])}
							);
				}
				

				prePonit['_x'] = py;
				prePonit['_y'] = px;

			}
		}
		
		
		for(var i=0;i< this.o()['series'].length; i++){
			var s_data = this.o()['series'][i].s_data;
			var s_color = this.getSColor(this,i);
			var s_lineWidth = this.o()['series'][i].s_lineWidth; 
			var s_shape = this.o()['series'][i].s_shape;
			var s_sizeDefault = this.o()['series'][i].s_sizeDefault;
			var s_shapeColor = this.getSpColor(this,i);
			var prePonit = {};
			for(var j=0;j < s_data.length; j++){
				var x = s_data[j][0];
				var y = s_data[j][1];

				var py = this.toPhysicalVal_B(y);
				var px = this.toPhysicalVal_L(x);

				if(s_shape == 'circle'){
					this.drawArc(
							s_shapeColor,
							1,
							py,
							px,
							s_sizeDefault);	
					
				}else if(s_shape == 'rectangle'){
					this.fillRect(
							s_shapeColor,
							1,
							py-s_sizeDefault/2,
							px-s_sizeDefault/2,
							s_sizeDefault,
							s_sizeDefault
							);
				}

			}
		}
	}
};
HChart.prototype.drawArc = function(_color,_lineWidth,_x1,_y1,_r,_startRadian,_endRadian) {
	var startRadian;
	var endRadian;
	if(_startRadian == null){
		startRadian = 0;
	}else{
		startRadian = _startRadian;		
	}
	if(_endRadian == null){
		endRadian = 2 * Math.PI;
	}else{
		endRadian = _endRadian;		
	}	
	this.mainCanvasBufferCtx.strokeStyle = _color;
	this.mainCanvasBufferCtx.beginPath();
	try{
		this.mainCanvasBufferCtx.translate(0.5, 0.5);
		this.mainCanvasBufferCtx.lineWidth = _lineWidth;
	}catch(e){
		if(window.console != null) console.dir(e);
	}
	this.mainCanvasBufferCtx.arc(_x1, _y1,_r, startRadian, endRadian, false);
	this.mainCanvasBufferCtx.fill();
	try{
		this.mainCanvasBufferCtx.translate(-0.5, -0.5);
	}catch(e){
		if(window.console != null) console.dir(e);
	}
	this.mainCanvasBufferCtx.stroke();
	this.mainCanvasBufferCtx.closePath();
};


HChart.prototype.drawArc2 = function(_lineColor,_color,_lineWidth,_x1,_y1,_r,_startRadian,_endRadian) {
	var startRadian;
	var endRadian;
	if(_startRadian == null){
		startRadian = 0;
	}else{
		startRadian = _startRadian;		
	}
	if(_endRadian == null){
		endRadian = 2 * Math.PI;
	}else{
		endRadian = _endRadian;		
	}	
	
	this.mainCanvasBufferCtx.shadowColor = 'rgba(158,158,158,1)';
	this.mainCanvasBufferCtx.shadowOffsetX = 3;
	this.mainCanvasBufferCtx.shadowOffsetY = 3;
	this.mainCanvasBufferCtx.shadowBlur = 0.5;
	
	
	this.mainCanvasBufferCtx.strokeStyle = _lineColor;
	this.mainCanvasBufferCtx.fillStyle = _color;
	this.mainCanvasBufferCtx.beginPath();
	this.mainCanvasBufferCtx.moveTo(_x1, _y1);
	this.mainCanvasBufferCtx.arc(_x1, _y1,_r, startRadian, endRadian, true);
	this.mainCanvasBufferCtx.closePath();
	this.mainCanvasBufferCtx.stroke();
	this.mainCanvasBufferCtx.fill();
	
	this.mainCanvasBufferCtx.shadowColor = 'red';
	this.mainCanvasBufferCtx.shadowOffsetX = 0;
	this.mainCanvasBufferCtx.shadowOffsetY = 0;
	this.mainCanvasBufferCtx.shadowBlur = 0;	
	
};

HChart.prototype.drawArc3 = function(_color,_lineWidth,_x1,_y1,_r,_startRadian,_endRadian) {
	var startRadian;
	var endRadian;
	if(_startRadian == null){
		startRadian = 0;
	}else{
		startRadian = _startRadian;		
	}
	if(_endRadian == null){
		endRadian = 2 * Math.PI;
	}else{
		endRadian = _endRadian;		
	}	

	this.mainCanvasBufferCtx.strokeStyle = _color;
	this.mainCanvasBufferCtx.fillStyle = _color;
	this.mainCanvasBufferCtx.beginPath();
	this.mainCanvasBufferCtx.moveTo(_x1, _y1);
	this.mainCanvasBufferCtx.arc(_x1, _y1,_r, startRadian, endRadian, true);
	this.mainCanvasBufferCtx.closePath();
	//this.mainCanvasBufferCtx.stroke();
	this.mainCanvasBufferCtx.fill();

	
};

HChart.prototype.clipArc3 = function(_color,_lineWidth,_x1,_y1,_r,_startRadian,_endRadian) {
	var startRadian;
	var endRadian;
	if(_startRadian == null){
		startRadian = 0;
	}else{
		startRadian = _startRadian;		
	}
	if(_endRadian == null){
		endRadian = 2 * Math.PI;
	}else{
		endRadian = _endRadian;		
	}	

	this.mainCanvasBufferCtx.strokeStyle = _color;
	this.mainCanvasBufferCtx.fillStyle = _color;
	this.mainCanvasBufferCtx.beginPath();
	this.mainCanvasBufferCtx.moveTo(_x1, _y1);
	this.mainCanvasBufferCtx.arc(_x1, _y1,_r, startRadian, endRadian, true);
	this.mainCanvasBufferCtx.clip();
  
	//this.mainCanvasBufferCtx.closePath();
	//this.mainCanvasBufferCtx.stroke();
	//this.mainCanvasBufferCtx.fill();

	
};

HChart.prototype.drawArc4 = function(_strokeColor,_fillColor,_lineWidth,_x1,_y1,_r,_startRadian,_endRadian,_ctx) {
	if(_ctx == null){
		_ctx = this.mainCanvasBufferCtx;
	}								
										
	var startRadian;
	var endRadian;
	if(_startRadian == null){
		startRadian = 0;
	}else{
		startRadian = _startRadian;		
	}
	if(_endRadian == null){
		endRadian = 2 * Math.PI;
	}else{
		endRadian = _endRadian;		
	}	

	_ctx.lineWidth = _lineWidth;
	_ctx.strokeStyle = _strokeColor;
	_ctx.fillStyle = _fillColor;
	_ctx.beginPath();
	_ctx.moveTo(_x1, _y1);
	_ctx.arc(_x1, _y1,_r, startRadian, endRadian, true);
	_ctx.closePath();
	_ctx.stroke();
	_ctx.fill();
};


HChart.prototype.drawCrossLinesPie = function(M,_event) {
	var lastX = (_event.offsetX || (_event.pageX - M.mainCanvas.offsetLeft));
	var lastY = _event.offsetY || (_event.pageY - M.mainCanvas.offsetTop);	
	
	M.mainCanvasMidBufferCtx.clearRect(0, 0, M.mainCanvasMidBuffer.width, M.mainCanvasMidBuffer.height);
	M.mainCanvasMidBufferCtx.drawImage(M.mainCanvasBuffer,0,0);
	if(M.o()['pivot_mode'] == 'XY'){
		//vertical draw!
		if(M.getLeftAxisWidth() < lastX && lastX < (M.getLeftAxisWidth()+M.getBottomAxisWidth())){
			var ex = lastX;
			//var point = M.getMagneticX(ex);
			//if(point != null){
				//var mx = point['physical'];
				if(M.o()['crossLineShow']){
					M.drawLine(M.o()['axis_stroke_color'],1,M.f(ex),M.f(M.o()['top_margin']),M.f(ex),M.f(M.o()['top_margin']+M.getLeftAxisHeight()),M.mainCanvasMidBufferCtx);
				}
			//}
		}
		//horizontal draw!
		if(M.o()['top_margin'] < lastY && lastY < (M.o()['top_margin']+M.getLeftAxisHeight())){
			if(M.o()['crossLineShow']){
				M.drawLine(M.o()['axis_stroke_color'],1,M.f(M.getLeftAxisWidth()),M.f(lastY),M.f(M.getLeftAxisWidth()+M.getBottomAxisWidth()),M.f(lastY),M.mainCanvasMidBufferCtx);
			}
		}
		
		//if(M.getLeftAxisWidth() < lastX && lastX < (M.getLeftAxisWidth()+M.getBottomAxisWidth())){
			//if(M.o()['top_margin'] < lastY && lastY < (M.o()['top_margin']+M.getLeftAxisHeight())){
		if(true){	
			if(true){
				//if(M.o()['type'] != 'doughnut' && M.o()['type'] != 'pie'){
					
					var coord = {'x':'','y':''};
					coord['y'] = -(lastY-M.o()['centerY']);	//y축이 아래로 갈수록 -,위로갈수로 + 이므로 (-)반대처리
					coord['x'] = lastX-M.o()['centerX'];
					//여기 파이포인터
					try{
						var xyVal = Math.pow(coord['x'],2)+Math.pow(coord['y'],2);
						var radiusVal =  Math.pow(M.o()['radius'],2);
						var degree;
						if(coord['x'] > -1 && coord['y'] > -1){
							degree = Math.atan(coord['y']/coord['x'])*(180/Math.PI);
						}else if(coord['x'] < 0 && coord['y'] > -1){
							degree = 90+(90+Math.atan(coord['y']/coord['x'])*(180/Math.PI));
						}else if(coord['x'] < 0 && coord['y'] < 0){
							degree = 180+Math.atan(coord['y']/coord['x'])*(180/Math.PI);
						}else if(coord['x'] > -1 && coord['y'] < 0){
							degree = 270+(90+Math.atan(coord['y']/coord['x'])*(180/Math.PI));
						}
						var tt = '';

						if(xyVal > radiusVal){
							tt = 'out';
							M.mainCanvas.style.cursor = 'default';
						}else{
							tt = 'in';
							M.mainCanvas.style.cursor = 'crosshair';
						}
						if(tt == 'in'){
							for(var i=0;i< M.o()['series'].length; i++){
								var s_data 			= M.o()['series'][i].s_data;
								var s_unit 			= M.o()['series'][i].s_unit;
								if(s_unit == null){
									s_unit = '';
								}
								var dataLen = s_data.length;
								var startDgree = 0;
								for(var j=0;j < dataLen; j++){
									var y = parseFloat(s_data[j][1]);
									var percent = (y/M.o()['valueSum']);
									var percent100 = percent*100;
									var dgree = percent*360;
									startDgree += dgree;
									if(startDgree > degree){
										M.drawBackground();
										M.drawMainTitleRadial();	
										if(s_data[j][2] != null){
							
											M.drawSeriesPie(s_data[j][0],s_data[j][1],s_data[j][2]);
										}else{
	
											M.drawSeriesPie(s_data[j][0],s_data[j][1]);
										}
										var ctx=M.mainCanvasBufferCtx;
										var m = M;
										ctx.drawImage(m.img,0,0,m.img.width,m.img.height,
										//m.getBottomAxisWidth()+m.getLeftAxisWidth()-m.img.width+1,m.o()['top_margin'],
										m.getBottomAxisWidth()+m.getLeftAxisWidth()+1,m.o()['top_margin'],
										m.img.width,m.img.height);

										
										coord_text = '['+s_data[j][0]+' , '+s_data[j][1]+ ' '+s_unit+' , '+percent100.toFixed(2)+'%]';
										if(M.o()['tooltipMinimize']){
											coord_text = ''+s_data[j][0]+','+s_data[j][1]+ ''+s_unit+','+percent100.toFixed(2)+'%';											
										}
										
										if(M.o()['tooltipShow']){	
											M.mainCanvasMidBufferCtx.font = M.o()['tooltipFont'];
											M.mainCanvasMidBufferCtx.fillStyle = M.o()['tooltipTextColor'];
											M.mainCanvasMidBufferCtx.fillText(coord_text,
												M.f(M.getLeftAxisWidth()),
												M.o()['top_margin']-M.o()['mark_then_gep']
												);
										}
	

										var txtWidth = M.mainCanvasBufferCtx.measureText(coord_text).width;			
										var bar_width = txtWidth+30;
										var bar_height =  30;
										if(M.o()['tooltipMinimize']){
											bar_width = txtWidth;
											bar_height =  12;
										}
										if(M.o()['rpTooltipUse']){	
											//여기 파이 사분면
											var bx_x = M.f(lastX);
											var bx_y = M.f(lastY);
											
											if(degree > 0 && degree < 90){
												bx_x -= bar_width;
												bx_y -= bar_height;		
											}else if(degree > 90 && degree < 180){
												bx_y -= bar_height;				
											}else if(degree > 180 && degree < 270){
												bx_y -= bar_height;			
											}else if(degree > 270 && degree < 360){
												bx_x -= bar_width;
												bx_y -= bar_height;		
											}
											var bx_x_t =bx_x+10;
											var bx_y_t =bx_y+20;
											if(M.o()['tooltipMinimize']){
												bx_y_t = bx_y+10;
												bx_x_t = bx_x;
												bar_width +=10;
											}		


											if(M.o()['rpTooltipBorderShow']){
												M.drawRect(
														M.o()['rpTooltipBorderColor'],
														1,
														bx_x,
														bx_y,
														bar_width,bar_height,
														M.mainCanvasMidBufferCtx
														);
											}		
											M.fillRect(
													M.o()['rpTooltipColor'],
													1,
													bx_x,
													bx_y,
													bar_width,bar_height,
													M.mainCanvasMidBufferCtx
													);
											M.mainCanvasMidBufferCtx.font = M.o()['tooltipFont'];
											M.mainCanvasMidBufferCtx.fillStyle = M.o()['tooltipTextColor'];
											M.mainCanvasMidBufferCtx.fillText(coord_text,
												bx_x_t,
												bx_y_t
												);														
										}
										
										break;
									}
								}
							}

						}

					}catch(e){
						console.error(e);
					}


			}
		}
		
		M.mainCanvasCtx.clearRect(0, 0, M.mainCanvas.width, M.mainCanvas.height);
		M.mainCanvasCtx.drawImage(M.mainCanvasMidBuffer,0,0);
	}else{
		//vertical draw!
		if(M.o()['top_margin'] < lastY && lastY < (M.o()['top_margin']+M.getLeftAxisHeight())){
			var ex = lastY;
			var point = M.getMagneticX(ex);
			if(point != null){
				var mx = point['physical'];
				M.drawLine(M.o()['axis_stroke_color'],1,M.f(M.getLeftAxisWidth()),M.f(mx),M.f(M.getLeftAxisWidth()+M.getBottomAxisWidth()),M.f(mx),M.mainCanvasMidBufferCtx);
			}
		}
		if(M.getLeftAxisWidth() < _event.pageX && _event.pageX < (M.getLeftAxisWidth()+M.getBottomAxisWidth())){
			if(mx != null)
				M.drawLine(M.o()['axis_stroke_color'],1,M.f(lastX),M.f(M.o()['top_margin']),M.f(lastX),M.f(M.o()['top_margin']+M.getLeftAxisHeight()),M.mainCanvasMidBufferCtx);
						
		}
		var coord = {'x':'','y':''};
		var coord_text = '';
		if(typeof point != 'undefined' && point != null){
			coord['x'] = parseInt(M.f(point['logical']));
			coord['y'] = M.toLogicalVal_B(lastX).toFixed(2);			
			coord_text = '( '+coord['x']+" , "+coord['y']+' )';
		}else{
			coord_text = '';
		}
		
		M.mainCanvasMidBufferCtx.font =  M.o()['tooltipFont'];
		M.mainCanvasMidBufferCtx.fillStyle = M.o()['color'];
		M.mainCanvasMidBufferCtx.fillText(coord_text,
				M.f(M.getLeftAxisWidth()),
				M.o()['top_margin']-M.o()['mark_then_gep']
				);	

		
		M.mainCanvasCtx.clearRect(0, 0, M.mainCanvas.width, M.mainCanvas.height);
		M.mainCanvasCtx.drawImage(M.mainCanvasMidBuffer,0,0);	
		
	}		
};

HChart.prototype.drawSeriesRadial = function() {
	
	var pmode  = this.o()['pivot_mode'];
	var orix;
	var oriy;
	if(pmode == 'XY'){
	try{	
		var _x1 = this.getLeftAxisWidth();
		var _y1 = this.o()['top_margin'];
		var _width1 = this.getBottomAxisWidth();
		var _height1 = this.getLeftAxisHeight();
		var _axisLeng = null;
		if(_height1 < _width1){
			_axisLeng = _height1;			
		}else{
			_axisLeng = _width1;			
		}
		//orix = this.f(this.getLeftAxisWidth()+this.getBottomAxisWidth()/2);
		//oriy = this.f(this.o()['top_margin']+this.getLeftAxisHeight()/2);	

		orix = this.f(this.mainCanvas.width/2);
		oriy = this.f(this.mainCanvas.height/2);
						
		for(var a=0; a < this.o()['series'].length; a++){
			var data = this.o()['series'][a].s_data;
			var s_shapeColor = this.getSpColor(this,a);		
			var s_color = this.getSColor(this,a);
			var s_sizeDefault = this.o()['series'][a].s_sizeDefault;
			var dataLeng = data.length;
			var max = this.o()['series'][a].s_max;
			var y_mark_cnt = this.o()['y_mark_cnt'];
			var colorText = 'rgba(0,0,0,1)';
			var aMark = (_axisLeng/2)/y_mark_cnt;
			var aSectorDgree = 360/dataLeng;//부채꼴의 각
			var aSectorRadian = (aSectorDgree/180)*Math.PI;//부채꼴의 각

			for(var k=0;k<y_mark_cnt;k++){	
				var startk = k+1;
				var r = aMark*startk;
				var nowDgree = aSectorDgree*startk;

				this.mainCanvasBufferCtx.font = this.o()['commonFont'];
				
				var tt = ((max/y_mark_cnt)*startk)+'%';
				var txtWidth = this.mainCanvasBufferCtx.measureText(tt).width;			
				this.mainCanvasBufferCtx.fillText(tt,
					this.f(orix-2-txtWidth),this.f(oriy-r+10)	
				);
				this.mainCanvasBufferCtx.font = this.o()['titleFont'];

				
				var startx = null;
				var starty = null;
				var xArr = [];
				var yArr = [];
				var xArrP = [];
				var yArrP = [];			
				
				for(var k2=0;k2<dataLeng;k2++){	
					var nowDgree = aSectorDgree*k2;
					//12시에서 시계방향으로 회전
					if(nowDgree >= 0 && nowDgree <= 90){
						//1-4분면
						var y = Math.cos(nowDgree*(Math.PI/180))*r;
						var x = Math.sin(nowDgree*(Math.PI/180))*r;
						if(startk == y_mark_cnt){
							this.drawLine(this.o()['axis_stroke_color'],1,this.f(orix),this.f(oriy),this.f(orix+x),this.f(oriy-y));
							
							var py = (_axisLeng/2)*(data[k2][1]/max);
							var val_y = Math.cos(nowDgree*(Math.PI/180))*py;
							var val_x = Math.sin(nowDgree*(Math.PI/180))*py;						
							this.drawArc2(
								s_shapeColor,
								3,
								this.f(orix+val_x),
								this.f(oriy-val_y),
								s_sizeDefault);	
							xArrP.push(orix+val_x);	
							yArrP.push(oriy-val_y);	
							var txtWidth = this.mainCanvasBufferCtx.measureText(data[k2][0]).width;
							if(nowDgree == 0){
								this.mainCanvasBufferCtx.fillText(data[k2][0],
									this.f(orix+x-txtWidth/2),this.f(oriy-y-2)	
								);
							}else{
								this.mainCanvasBufferCtx.fillText(data[k2][0],
									this.f(orix+x),this.f(oriy-y)	
								);	
							}

						}
						
						xArr.push(this.f(orix+x));
						yArr.push(this.f(oriy-y));			
					}else if(nowDgree >= 90 && nowDgree <= 180){
						//4-4분면
						nowDgree = nowDgree-90;
						var x = Math.cos(nowDgree*(Math.PI/180))*r;
						var y = Math.sin(nowDgree*(Math.PI/180))*r;
						if(startk == y_mark_cnt){
							this.drawLine(this.o()['axis_stroke_color'],1,this.f(orix),this.f(oriy),this.f(orix+x),this.f(oriy+y));							

							var py = (_axisLeng/2)*(data[k2][1]/max);
							var val_x = Math.cos(nowDgree*(Math.PI/180))*py;
							var val_y = Math.sin(nowDgree*(Math.PI/180))*py;						
							this.drawArc2(
								s_shapeColor,
								3,
								this.f(orix+val_x),
								this.f(oriy+val_y),
								s_sizeDefault);	
							xArrP.push(orix+val_x);	
							yArrP.push(oriy+val_y);		
							var txtWidth = this.mainCanvasBufferCtx.measureText(data[k2][0]).width;
							if(nowDgree == 90){
								this.mainCanvasBufferCtx.fillText(data[k2][0],
									this.f(orix+x-txtWidth/2),this.f(oriy+y+12)	
								);
							}else{
								this.mainCanvasBufferCtx.fillText(data[k2][0],
									this.f(orix+x),this.f(oriy+y+6)	
								);
							}						
						}
						
						xArr.push(this.f(orix+x));
						yArr.push(this.f(oriy+y));					
					}else if(nowDgree >= 180 && nowDgree <= 270){
						//3-4분면
						nowDgree = nowDgree-180;	
						var y = Math.cos(nowDgree*(Math.PI/180))*r;
						var x = Math.sin(nowDgree*(Math.PI/180))*r;	
						if(startk == y_mark_cnt){
							this.drawLine(this.o()['axis_stroke_color'],1,this.f(orix),this.f(oriy),this.f(orix-x),this.f(oriy+y));	
							
							var py = (_axisLeng/2)*(data[k2][1]/max);
							var val_y = Math.cos(nowDgree*(Math.PI/180))*py;
							var val_x = Math.sin(nowDgree*(Math.PI/180))*py;						
							this.drawArc2(
								s_shapeColor,
								3,
								this.f(orix-val_x),
								this.f(oriy+val_y),
								s_sizeDefault);	
							xArrP.push(orix-val_x);	
							yArrP.push(oriy+val_y);		
							var txtWidth = this.mainCanvasBufferCtx.measureText(data[k2][0]).width;
							this.mainCanvasBufferCtx.fillText(data[k2][0],
								this.f(orix-x-txtWidth),this.f(oriy+y+6)	
							);
						}					
						
						xArr.push(this.f(orix-x));
						yArr.push(this.f(oriy+y));					
					}else {
						//2-4분면
						nowDgree = nowDgree-270;	
						var x = Math.cos(nowDgree*(Math.PI/180))*r;
						var y = Math.sin(nowDgree*(Math.PI/180))*r;	
						if(startk == y_mark_cnt){
							this.drawLine(this.o()['axis_stroke_color'],1,this.f(orix),this.f(oriy),this.f(orix-x),this.f(oriy-y));

							var py = (_axisLeng/2)*(data[k2][1]/max);

							var val_x = Math.cos(nowDgree*(Math.PI/180))*py;
							var val_y = Math.sin(nowDgree*(Math.PI/180))*py;						
							this.drawArc2(
								s_shapeColor,
								3,
								this.f(orix-val_x),
								this.f(oriy-val_y),
								s_sizeDefault);	
							xArrP.push(orix-val_x);	
							yArrP.push(oriy-val_y);	
							var txtWidth = this.mainCanvasBufferCtx.measureText(data[k2][0]).width;
							this.mainCanvasBufferCtx.fillText(data[k2][0],
								this.f(orix-x-txtWidth),this.f(oriy-y)	
							);
						}					
						
						xArr.push(this.f(orix-x));
						yArr.push(this.f(oriy-y));					
					}	
				}	
				
				for(var i=0;i < xArr.length; i++){
					if(i > 0){
						this.drawLine(this.o()['axis_stroke_color'],1,this.f(_x),this.f(_y),this.f(xArr[i]),this.f(yArr[i]));	
					}
					
					if(i == (xArr.length-1)){
						this.drawLine(this.o()['axis_stroke_color'],1,this.f(xArr[0]),this.f(yArr[0]),this.f(xArr[i]),this.f(yArr[i]));
					}
					var _x = xArr[i];
					var _y = yArr[i];			
				}


				this.drawShape(s_color,s_sizeDefault,xArrP,yArrP);
			}
		}
		
	}catch(e){
		console.dir(e);
	}	
	}else{

	}
	
};
HChart.prototype.drawShape = function(_color,_lineWidth,_xArr,_yArr,_ctx) {
	if(_ctx == null){
		_ctx = this.mainCanvasBufferCtx;
	}
	_ctx.strokeStyle = _color;
	_ctx.fillStyle = _color;
	_ctx.beginPath();
	
		try{
			_ctx.translate(0.5, 0.5);
			_ctx.lineWidth = _lineWidth;
		}catch(e){
			if(window.console != null) console.dir(e);
		}
		for(var i=0;i<_xArr.length; i++){
			if(i==0){
				_ctx.moveTo(_xArr[i],_yArr[i]);
			}else if(i > 0){			
				_ctx.lineTo(_xArr[i],_yArr[i]);
			}
			if(i == _xArr.length-1){
				_ctx.lineTo(_xArr[0],_yArr[0]);
			}
		}
		_ctx.stroke();
		_ctx.fill();
		try{
			_ctx.translate(-0.5, -0.5);
		}catch(e){
			console.dir(e);
		}	
	

	_ctx.closePath();
};
function getSampleData(min,inc,cnt,_isFullData){
	this.arr = [];
	var r = Math.random();
	var save = min;
	for(var i=0; i < cnt; i++){
		var tmp = Math.floor(Math.random() * (save));
		var result;

			result = save+ inc;

		var v = Math.floor(Math.random() * 8)+1;
		if(!_isFullData && i%parseInt(cnt/v) != 0){
			arr[i] = [i,result,0];
		}else{
			arr[i] = [i,result,1];
		}
		
		save = result;
	}
	return arr;
}  




ColourGradient = function(minValue, maxValue, rgbColourArray)
{
	
	this.getColorList = function (_type) {
		var dark = [

		            'rgba(225, 220, 2,1)',
             		'rgba(106, 167, 61,1)',
             		'rgba(210, 115, 189,1)',
             		'rgba(124, 201, 199,1)',
             		'rgba(201, 165, 124,1)',
             		'rgba(228, 7, 73,1)',
             		'rgba(150, 141, 184,1)',
             		'rgba(153, 170, 172,1)',
             		'rgba(255, 128,64,1)',
             		'rgba(183, 183, 183,1)'            		
             		];
		
     	var light = [
     	            'rgba(255, 102, 102,1)',
              		'rgba(102, 102, 255,1)',
              		'rgba(153, 255, 153,1)',
              		'rgba(255, 153, 255,1)',
              		'rgba(255, 204, 102,1)',
              		'rgba(204, 102, 153,1)',
              		'rgba(204, 255, 255,1)',
              		'rgba(255, 255, 153,1)',
              		'rgba(204, 204, 204,1)',
              		'rgba(204, 204, 051,1)'
              		];	
     	var all = light.concat(dark);  
		if(_type == 'dark'){
			return dark;
		}else if(_type == 'light'){
			return light;	
		}else{
			return all;
		}
	}

    this.getColour = function (value) {
        if (isNaN(value))
            return rgbColourArray[0];

        if (value < minValue || rgbColourArray.length == 1)
            return rgbColourArray[0];
        else if (value < minValue || value > maxValue || rgbColourArray.length == 1) {
            return rgbColourArray[rgbColourArray.length - 1];
        }

        var scaledValue = mapValueToZeroOneInterval(value, minValue, maxValue);

        return getPointOnColourRamp(scaledValue);
    };
	
	function getPointOnColourRamp(value)
	{
		var numberOfColours = rgbColourArray.length;
		var scaleWidth = 1 / (numberOfColours - 1);
		var index = (value / scaleWidth);
		var index = parseInt(index + "");
				
		index = index ==  (numberOfColours - 1) ? index - 1 : index;
		
		var rgb1 = rgbColourArray[index];
		var rgb2 = rgbColourArray[index + 1];
		
		if (rgb1 == void 0 || rgb2 == void 0)
			return rgbColourArray[0];
		
		var closestToOrigin, furthestFromOrigin;
		
		if (distanceFromRgbOrigin(rgb1) > distanceFromRgbOrigin(rgb2))
		{
			closestToOrigin = rgb2;
			furthestFromOrigin = rgb1;
		}
		else
		{
			closestToOrigin = rgb1;
			furthestFromOrigin = rgb2;
		}
		
		var t;
		
		if (closestToOrigin == rgb2)
			t = 1 - mapValueToZeroOneInterval(value, index * scaleWidth, (index + 1) * scaleWidth);
		else
			t = mapValueToZeroOneInterval(value, index * scaleWidth, (index + 1) * scaleWidth);
			
		var diff = [
			t * (furthestFromOrigin.red - closestToOrigin.red),
			t * (furthestFromOrigin.green - closestToOrigin.green), 
			t * (furthestFromOrigin.blue - closestToOrigin.blue)];
		
		var r = closestToOrigin.red + diff[0];
		var g = closestToOrigin.green + diff[1];
		var b = closestToOrigin.blue + diff[2];
		
		r = parseInt(r);
		g = parseInt(g);
		b = parseInt(b);
		
		var colr = {
			red:r,
			green:g,
			blue:b
		};
		
		return colr;
	}

	function distanceFromRgbOrigin(rgb)
	{
		return (rgb.red * rgb.red) + (rgb.green * rgb.green) + (rgb.blue * rgb.blue);
	}

	function mapValueToZeroOneInterval(value, minValue, maxValue)
	{
		if (minValue == maxValue) return 0;
		
		var factor = (value - minValue) / (maxValue - minValue);
		return factor;
	}
};



  	var chartUtil = {};
  	
 	chartUtil.getMax = function(maxValue,minValue,divNum) {

  		var reMax = -9999999;
		var reMin = 99999999999;
  		var mxmi = maxValue-minValue;
		if(divNum == null){
			//divNum = parseInt(mxmi/10)+1;
			
			
  			for(var i=1; i< 100; i++){
  				var v1 = Math.pow(10,i);
  				var na = mxmi%v1;
				var tp = parseInt(mxmi/v1);
				if(tp != 0){
					if(na == 0){
						divNum = tp;
					}else{
						divNum = tp+1;
					}
				}else{
					if(divNum == null){
						if(Math.abs(1-Math.abs(mxmi)) < 1){
							
							
						}else{
							divNum = mxmi;
						}
						
					}

					break;
				}				
			}
  		}else if(divNum != null && divNum < 6){
  			divNum = divNum;//default;
  		}
		

		
		

  		if(minValue == null){
  			minValue = 0;
  		}else{
  			reMin = minValue;//추가
  		}
  		
   		if(divNum != null && (minValue > 0 || minValue == 0)){
	  		var valByTen = 10*divNum;		

	  		if(mxmi < 1 || mxmi==1){
	  			reMax = maxValue;
			}else if(mxmi < 10){
	  			for(var i=1; i< 20; i++){
	  				var dn = i*divNum;
	  				var dn_next = (i+1)*divNum;	
	  				if( dn <= mxmi && mxmi <= dn_next ){
	  					reMax = dn_next;
	  					break;
	  				}	
	  			};
	  		}else{

	  			for(var i=1; i< 100; i++){
	  				var v1 = Math.pow(10,i);
	  				var v2 = Math.pow(10,i+1);
	  				var dn = v1*divNum;
	  				var dn_next = v2*divNum;

	  				if( mxmi <= dn_next ){
	  					reMax = (Math.floor(mxmi/dn)+1)*dn;

						if(mxmi%(divNum*v1)==0 && mxmi%(5*v1)==0 && mxmi < reMax){

							reMax = mxmi;
						}
						var d_v1 = Math.floor(minValue/v1);//추가
						reMin = d_v1*v1;//추가
						//reMax = mxmi+reMin;//추가
						
	  					break;
	  				}	
	  			};	
	  		}

	  		if(mxmi < 1 || mxmi ==1){
	  			reMax = 1; 			
	  		}else if(mxmi < divNum){
	  			reMax = divNum;
	  		}else if(reMax == -9999999){
				reMax = maxValue;
			}

			//reMin = reMax/divNum;

			reMax += reMin;
		}else if(mxmi < 1){
			reMax = maxValue;
			reMin = minValue;
  		}else {
		
  			var v = parseInt(maxValue/10);
  			if(v > 0){
  				//10이상100이하
  				var mulVal = Math.ceil(maxValue/10);
  				reMax = mulVal*10;
				var v2 = parseInt(minValue/10);
				if(v2 > 0){
					//10이상100이하
					var mulVal = Math.ceil(minValue/10);
					reMin = mulVal*10;
				}else{
					var mulVal = Math.floor(minValue/10);
					reMin = mulVal*10;					
				}

				
				var mm = reMax-reMin;
				if(mm == 10 && divNum == null){
					divNum = 5;//10이하이니 10이라치고 5등분을 디폴트로
				}	
			
  			}else{
  				var mulVal = Math.ceil(maxValue/1);
  				reMax = mulVal*1;
				var v2 = parseInt(minValue/1);
				if(v2 > 0){
					//10이상100이하
					var mulVal = Math.ceil(minValue/1);
					reMin = mulVal*1;
				}else{
					var mulVal = Math.floor(minValue/1);
					reMin = mulVal*1;	
				}

				
				var mm = reMax-reMin;
				if(mm == 10 && divNum == null){
					divNum = mm;//10이하이니 10이라치고 5등분을 디폴트로
				}	

				
			}
  			

  		}
		if(divNum == null){
			divNum = 4;
  		}
		var tmp = {'reMax':reMax,'divNum':divNum,'reMin':reMin};
  		return tmp;
  	};
	
 
	
	

  	chartUtil.getDate = function(_dt) {
		var reDate = {};
  	    var today;
  	    if(_dt == null){
  	    	today = new Date();
  	    }else{
  	    	today = _dt; 	
  	    }

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
  	  	reDate['year'] 		=  String(year);
  	  	reDate['month'] 	=  String(month);
  		reDate['day'] 		=  String(day);

  	  	reDate['hour'] 		=  String(hour);
  	  	reDate['min'] 		=  String(min);
  		reDate['second'] 	=  String(second);	

  	    return reDate;
  	};  	  	  	
  	
 	chartUtil.strToDate = function(hDt) {
 		var hDt2 = hDt.replace(/(.{10})\s{1}(.{8})/g,'$1T$2Z');
 		var dDate = new Date(hDt2);
 		var tz = dDate.getTime() + (dDate.getTimezoneOffset() * 60000) + (0 * 3600000);
 		dDate.setTime(tz);
 		return dDate;
 	}
	    
  	chartUtil.formatData = function(s1_data,_min) {
  		if(_min == null){
  			_min = 10;//10분
  		}  		

  		var markTimeGep = 6;//6시간
  		var gepMs = 60000*_min*6*markTimeGep;//10분*1시간,*6시간

  		var time = _min;
		var lastObject = s1_data[s1_data.length-1];
		var dDate = chartUtil.strToDate(lastObject[0]);
		var d = chartUtil.getDate(dDate);
		var reArr = [];
		var maxXindex = 0;
		var maxYValue = -99999;
		var minYValue = 99999;
		for(var i=(s1_data.length-1);i>-1;i--){
			var dDate2 = chartUtil.strToDate(s1_data[i][0]);
			var diff = Math.abs(dDate - dDate2);//10분이면 60만 600000 , 60초*1000= 60000ms , 10분이면 60만ms
			var v = diff/gepMs;//마이너스 몇시간인지를 구함
			if(maxXindex < v ){
				maxXindex = Math.ceil(v);
			}
			var v1 = (-v*markTimeGep).toFixed(2);
			var v2 = s1_data[i][1];
			reArr[i] = [v1,v2,s1_data[i][0]];//x좌표(인덱스)1,y값,x죄표(타임)2
			
			var _val = s1_data[i][1];
			if(maxYValue < _val ){
				maxYValue = _val;
			}
			if(minYValue > _val ){ 
				minYValue = _val;
			}		
		}
		var _tmp_v1 = parseInt(maxXindex);
		var _tmp_v2 = _tmp_v1+1;
	
		var _tmp_y_max = Math.ceil(maxYValue);
		var _tmp_y_min = Math.floor(minYValue);
		
		var dataInfo = {};
		dataInfo['maxYValue'] = maxYValue;
		dataInfo['minYValue'] = minYValue;
		dataInfo['_tmp_v2'] = _tmp_v1;
		dataInfo['_tmp_y_max'] = _tmp_y_max;
		dataInfo['_tmp_y_min'] = _tmp_y_min;
		dataInfo['d'] = d;
		dataInfo['reArr'] = reArr;
		
		return dataInfo;
		
  	}
  	
  	
  	chartUtil.formatData_profile = function(s1_data) {
		var reArr = [];
		var maxXindex = 0;
		var maxYValue = -99999;
		var minYValue = 99999;
		for(var i=(s1_data.length-1);i>-1;i--){
			var v1 = s1_data[i][0];
			var v2 = s1_data[i][1];
			reArr[i] = [v1,v2,v2];
			
			var _val = s1_data[i][1];
			if(maxYValue < _val ){
				maxYValue = _val;
			}
			if(minYValue > _val ){
				minYValue = _val;
			}			
			
		}
	
		var _tmp_y_max = Math.ceil(maxYValue);
		var _tmp_y_min = Math.floor(minYValue);
		
		var dataInfo = {};
		dataInfo['maxYValue'] = maxYValue;
		dataInfo['minYValue'] = minYValue;
		dataInfo['_tmp_y_max'] = _tmp_y_max;
		dataInfo['_tmp_y_min'] = _tmp_y_min;
		dataInfo['reArr'] = reArr;
		
		return dataInfo;
		
  	};
  	
  	
  	chartUtil.formatData_profile2 = function(s1_data,_xMinMax,_max,_min,_divNum,_xSortOption) {
		var dataInfo = {};
		if(_xSortOption){			
			s1_data = s1_data.sort(function(a,b){
				a = a[0];
				b = b[0];
				return a-b;
			});	

		}else{
				
		}
		if(_max != null && _min != null){
			dataInfo['maxy'] = _max;
			dataInfo['miny'] = _min;		
			dataInfo['reArr'] = s1_data;
			dataInfo['y_mark_cnt'] = _divNum;			
		}else{
			var reArr = [];
			var reMap = {};
			var maxXindex = 0;
			var maxYValue = -9999999999999;
			var minYValue = 9999999999999;
			if( _min != null){
				minYValue = _min;
			}
			var maxXValue = -9999999999999;
			var minXValue = 9999999999999;		

			for(var i=(s1_data.length-1);i>-1;i--){
				var v_x = s1_data[i][0];
				var v_y = s1_data[i][1];
				var v3 = s1_data[i][2];
				var v4 = s1_data[i][3];
				//reArr[i] = [v_x,v_y,v3,v4];
				var tmpArr = [v_x,v_y,v3,v4];
				var o = reMap[v_x];
				if(o == null){
					reMap[v_x] = [tmpArr];
				}else{
					o.push(tmpArr);
					reMap[v_x] = o;
				}				


				if(maxYValue < v_y ){
					maxYValue = v_y;
				}

				if(minYValue > v_y ){
					minYValue = v_y;
				}			
				if(_xMinMax){
					if(maxXValue < v_x ){
						maxXValue = v_x;
					}
					if(minXValue > v_x ){
						minXValue = v_x;
					}	
				}
			}
			var cha = (maxYValue - minYValue);
			var _tmp_y_max;
			var _tmp_y_min;
			if(cha == 0){
				_tmp_y_max = Math.ceil(maxYValue);
				if(_tmp_y_min < 0){
					_tmp_y_min = maxYValue+maxYValue;			
				}else{
					_tmp_y_min = maxYValue-maxYValue;				
				}			
				minYValue = _tmp_y_min;		
			}else if(cha < 1){
				_tmp_y_max = maxYValue;
				_tmp_y_min = minYValue;	
			}else{
				_tmp_y_max = Math.ceil(maxYValue);
				_tmp_y_min = Math.floor(minYValue);						
			}

	
			
			dataInfo['maxYValue'] = maxYValue;
			dataInfo['minYValue'] = minYValue;
			dataInfo['_tmp_y_max'] = _tmp_y_max;
			dataInfo['_tmp_y_min'] = _tmp_y_min;

			var reMin = Math.floor(minYValue/10)*10;
		
			if(_min != null){
				reMin = _min;
			}
		
			dataInfo['maxy'] = maxYValue;
			dataInfo['miny'] = reMin;
			dataInfo['reArr'] = s1_data;
			dataInfo['reMap'] = reMap;
	
			
		}
		return dataInfo;
  	};  		
  	
  	chartUtil.formatDataTotalTime = function(s1_data,_minute,_seriesArray) {
  		if(_minute == null){
  			_minute = 10;
  		}
		var lastObject = s1_data[s1_data.length-1];
		var dDate = chartUtil.strToDate(lastObject[0]);
		var d = chartUtil.getDate(dDate);
		var reArr = [];
		var maxXindex = 0;
		var maxYValue = -99999;
		var minYValue = 99999;

		var seriesMap = {};
		for(var i=0;i < _seriesArray.length; i++){
			seriesMap[_seriesArray[i]] = [];
		}
		var timeGep = 6;
		timeGep = (_minute/10)*6;

		for(var i=0;i < s1_data.length;i++){//formatData에서 역순으로 바꿀것이므로, 여기선 정순으로
			var dDate2 = chartUtil.strToDate(s1_data[i][0]);
			var seriesNm = s1_data[i][2];
			var aSeriesArr = seriesMap[seriesNm+''];
			if(aSeriesArr != null){
				var aArr = [];
				aArr[0] = s1_data[i][0];
				aArr[1] = s1_data[i][1];
				aSeriesArr[aSeriesArr.length] = aArr;
				seriesMap[seriesNm+''] = aSeriesArr; 
				var diff = Math.abs(dDate - dDate2);
				var v = diff/(_minute*60*60*6*100);//10분 -> 21600000
				if(maxXindex < v ){
					maxXindex = Math.ceil(v);
				}
				var v1 = (-v*timeGep).toFixed(2);
				var v2 = s1_data[i][1];
				reArr[i] = [v1,v2,s1_data[i][0]];
				
				var _val = s1_data[i][1];
				if(maxYValue < _val ){
					maxYValue = _val;
				}
				if(minYValue > _val ){
					minYValue = _val;
				}	
				
			}
		
			
		}
		var _tmp_v1 = parseInt(maxXindex);
		var _tmp_v2 = _tmp_v1+1;
	
		var _tmp_y_max = Math.ceil(maxYValue);
		var _tmp_y_min = Math.floor(minYValue);
		
		var dataInfo = {};
		dataInfo['maxYValue'] = maxYValue;
		dataInfo['minYValue'] = minYValue;
		dataInfo['_tmp_v2'] = _tmp_v1;
		dataInfo['_tmp_y_max'] = _tmp_y_max;
		dataInfo['_tmp_y_min'] = _tmp_y_min;
		dataInfo['d'] = d;
		dataInfo['reArr'] = reArr;
		dataInfo['seriesMap'] = seriesMap;		
		
		
		return dataInfo;
		
  	}
  	
  	
  	chartUtil.formatDataMetrix = function(s1_data,_colorValueIndex,_secGep) {
		var lastObject = s1_data[s1_data.length-1];
		var dDate = chartUtil.strToDate(lastObject[0]);
		var d = chartUtil.getDate(dDate);
		var reArr = [];
		var maxXindex = 0;
		var maxYValue = -99999;
		var minYValue = 99999;
		
		var msec = 0;
		var hur = 0;
		if(_secGep == null){
			hur = 6;//6시간
		}else{
			hur = _secGep;		
		}
		msec = hur*60*60*1000;
		for(var i=(s1_data.length-1);i>-1;i--){
			var dDate2 = chartUtil.strToDate(s1_data[i][0]);
			var diff = Math.abs(dDate - dDate2);//데이터의 간격?
			var v = diff/msec;
			if(maxXindex < v ){
				maxXindex = Math.ceil(v);
			}
			var v1 = (-v*hur).toFixed(2);
			var v2 = s1_data[i][_colorValueIndex];
			reArr[i] = [v1,v2,s1_data[i][0],s1_data[i][1],s1_data[i][2],s1_data[i][3]];
			
			var _val = s1_data[i][_colorValueIndex];
			if(maxYValue != null && maxYValue < _val ){
				maxYValue = _val;
			}
			if(_val != null && minYValue > _val ){
				minYValue = _val;
			}						
		}
		var _tmp_v1 = parseInt(maxXindex);
		var _tmp_v2 = _tmp_v1+1;
	
		var _tmp_y_max = Math.ceil(maxYValue);
		var _tmp_y_min = Math.floor(minYValue);
		
		var dataInfo = {};
		dataInfo['maxYValue'] = maxYValue;
		dataInfo['minYValue'] = minYValue;
		dataInfo['_tmp_v2'] = _tmp_v1;
		dataInfo['_tmp_y_max'] = _tmp_y_max;
		dataInfo['_tmp_y_min'] = _tmp_y_min;
		dataInfo['d'] = d;
		dataInfo['reArr'] = reArr;
		
		return dataInfo;
		
  	}  	
	
 	chartUtil.formatDataHodo = function(s1_data) {
		var max = -9999;
		var min = 9999;
		for(var i=(s1_data.length-1);i>-1;i--){
			var u = s1_data[i][4];
			var v = s1_data[i][5];
								
			if(u > max ){
				max = u;
			}
			if(u < min ){
				min = u;
			}	

			if(v > max ){
				max = v;
			}
			if(v < min ){
				min = v;
			}			
		}
		
		var dataInfo = {};
		dataInfo['max'] = max;
		dataInfo['min'] = min;
		dataInfo['reArr'] = s1_data;
		
		return dataInfo;		
  	}  	

 	chartUtil.formatDataWin3d = function(s1_data) {
		var max = -9999;
		var min = 9999;
		for(var i=(s1_data.length-1);i>-1;i--){
			var u = s1_data[i][4];
			var v = s1_data[i][5];
								
			if(u > max ){
				max = u;
			}
			if(u < min ){
				min = u;
			}	

			if(v > max ){
				max = v;
			}
			if(v < min ){
				min = v;
			}			
		}
		
		var dataInfo = {};
		dataInfo['max'] = max;
		dataInfo['min'] = min;
		dataInfo['reArr'] = s1_data;
		
		return dataInfo;		
  	}  	





 	chartUtil.calcDate = function(reDate,_hgep) {
 		var reDate2 = {};  		
 	  	var dt=new Date(reDate['year'],parseInt(reDate['month'])+1,reDate['day'],reDate['hour'],reDate['min'],reDate['second']);
 	  	dt.setHours(dt.getHours() + _hgep);

 	    var year 		= dt.getFullYear();
 	    var month 		= dt.getMonth()-1;
 	    var day 		= dt.getDate();
 	    var hour 		= dt.getHours();
 	    var min 		= dt.getMinutes();
 	    var second 		= dt.getSeconds();
 	    var millisecond = dt.getMilliseconds();

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
 	  	reDate2['year'] 	=  String(year);
 	  	reDate2['month'] 	=  String(month);
 		reDate2['day'] 		=  String(day);
 	  	reDate2['hour'] 	=  String(hour);
 	  	reDate2['min'] 		=  String(min);
 		reDate2['second'] 	=  String(second);	

 	    return reDate2; 
 	};  	
 	  
	chartUtil.getFixedNum = function(_val,_fix) {
		var fNum = _val.toFixed(_fix);
		var namugi = fNum%10;
		if(namugi == 0){
			return parseInt(fNum);
		}else{
			return fNum;
		}
 	};  	
 	  
	chartUtil.getNdData = function(meanArr,stdvArr,InpValCnt,seriesCnt) {
			var InpVal = 0;			
			var seriesArr = [];
			for(var i=0;i < InpValCnt; i++){
				InpVal = i+1;
				
				for(var j=0; j < seriesCnt; j++){
					var arr;
					if(seriesArr.length > j){
						arr = seriesArr[j];
					}else{
						arr = [];						
						seriesArr[j] = arr;
					}					
					var re = (		1/(stdvArr[j]*(Math.sqrt(2*Math.acos(-1))))    )*Math.exp(   -Math.pow((InpVal-meanArr[j]),2)/ (2*Math.pow(stdvArr[j],2))  );
					var row = [i,re];
					arr.push(row);				
				}
			}
			return seriesArr;
 	};  