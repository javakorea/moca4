class gridViewMgr {
	constructor(){
		//this.paramMap
		this.pageId = null;
		this.rowSelectedColor = '#434e5f';
	}

	/**
	 * createOZViewer
	 */
	renderGrid = function(_divObj) {
	    ['renderGrid'];
	    var _id = _divObj.id;
	    var pageid = _divObj.getAttribute("pageid");
	    var srcid = _divObj.getAttribute("srcid");
	    this.getObj(_id,null,pageid,srcid);//id중복체크
	    
	    var _default_cell_height = _divObj.getAttribute("default_cell_height");
	    var _label = _divObj.getAttribute("label");
	    var _subLabel = _divObj.getAttribute("subLabel");
		debugger;
	    var _toolbar =_divObj.classList.contains("toolbar");
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
	    
	    if(this.getDevice() == 'pc'){
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
	    	
	    	/*if(mocaConfig.grid.toolbar_common_btns_pc){
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
	    	}*/
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
				if (attValue?.trim()) {
	                try{
	                    var x1Obj = JSON.parse(attValue);
	                    if(x1Obj.position == 'left'){
	                        if(attrName.indexOf('toolbar_grid_checkbox') > -1){
	                            _html += this.renderGridToolbarCheckbox(x1Obj);
	                        }else if(attrName.indexOf('toolbar_grid_input') > -1){
	                            _html += this.renderGridToolbarInput(x1Obj);
	                        }else if(attrName.indexOf('toolbar_grid_button') > -1){
	                            _html += this.renderGridToolbarButton(x1Obj,_divObj.id);
	                        }else if(attrName.indexOf('toolbar_grid_label_span') > -1){
	                            _html += this.renderGridToolbarLabelSpan(x1Obj);
	                        }else if(attrName.indexOf('toolbar_grid_label_input') > -1){
	                            _html += this.renderGridToolbarLabelInput(x1Obj);
	                        }else if(attrName.indexOf('toolbar_grid_label_combo') > -1){
	                            _html += this.renderGridToolbarLabelCombo(x1Obj,_divObj.id);
	                        }else if(attrName.indexOf('toolbar_grid_combo') > -1){
	                            _html += this.renderGridToolbarCombo(x1Obj,_divObj.id);
	                        }else if(attrName.indexOf('toolbar_grid_label') > -1){
	                            _html += this.renderGridToolbarLabel(x1Obj);
	                        }else if(attrName.indexOf('toolbar_grid_radio') > -1){
	                            _html += this.renderGridToolbarRadio(x1Obj);
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
				if (attValue?.trim()) {
	                try{
	                    var x1Obj = JSON.parse(attValue);
	                    if(x1Obj.position == 'right'){
	                        if(attrName.indexOf('toolbar_grid_checkbox') > -1){
	                            _html += this.renderGridToolbarCheckbox(x1Obj);
	                        }else if(attrName.indexOf('toolbar_grid_input') > -1){
	                            _html += this.renderGridToolbarInput(x1Obj);
	                        }else if(attrName.indexOf('toolbar_grid_button') > -1){
	                            _html += this.renderGridToolbarButton(x1Obj,_divObj.id);
	                        }else if(attrName.indexOf('toolbar_grid_label_span') > -1){
	                            _html += this.renderGridToolbarLabelSpan(x1Obj);
	                        }else if(attrName.indexOf('toolbar_grid_label_input') > -1){
	                            _html += this.renderGridToolbarLabelInput(x1Obj);
	                        }else if(attrName.indexOf('toolbar_grid_label_combo') > -1){
	                            _html += this.renderGridToolbarLabelCombo(x1Obj,_divObj.id);
	                        }else if(attrName.indexOf('toolbar_grid_combo') > -1){
	                            _html += this.renderGridToolbarCombo(x1Obj,_divObj.id);
	                        }else if(attrName.indexOf('toolbar_grid_label') > -1){
	                            _html += this.renderGridToolbarLabel(x1Obj);
	                        }else if(attrName.indexOf('toolbar_grid_radio') > -1){
	                            _html += this.renderGridToolbarRadio(x1Obj);
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
	    if(this.getDevice() != 'pc'){
	    	__onclick = 'onclick="$m.swaipClickScroll(this)"';
	    	__ondblclick = 'ondblclick="$m.swaipDblScroll(this)"';
	    	__swipeStyle = 'width: 100%; left: 0px;';
	    }    
	    
	    _html += '<div class="moca_grid_list fauto" default_cell_height="'+_default_cell_height+'" grdkey="'+_id+'">';
	        _html += '<div class="moca_grid_body" style="right:18px;">';
	        _html += _header_body;
	        _html += '</div>';
	        _html += '<div id="'+_id+'_moca_scroll_y" componentid="'+_id+'" class="moca_scrollY_type1" '+__onclick+' '+__ondblclick+' onscroll="m.sFunction(this);" style="'+__swipeStyle+'">';
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
	    if(this.getDevice() != "mobile"){
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

	    //_html = $m.addPageId(_html,pageid,srcid);
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
	            this._setSelectRowIndex(tdObj);
	            this._setRowSelection(this,tdObj);
	            
	            var onRowSelectedFunc = _divObj.getAttribute("onRowSelected");
	            if(onRowSelectedFunc != undefined){
	                var _realIndex = _divObj.getAttribute("selectedRealRowIndex");
	                this.pageId = this.getAttribute("pageId");
	                this.srcId =  this.getAttribute("srcId");
	                eval(onRowSelectedFunc)(_divObj,_realIndex,tdObj,this);
	            }
	        }
	        
	    };
		
		_divObj.addEventListener('click', _divObj.onRowSelectedFunction);

		var _cellMap = {};
		var _cellIndex = {};

		// jQuery: $(_divObj).find('colgroup:first col');
		var colArray = _divObj.querySelectorAll('colgroup col');

		// jQuery: $(_divObj).find('tbody:first td');
		var _cellArr = _divObj.querySelectorAll('tbody td');

		// jQuery: $(_divObj).find('thead:first th[id]');
		var thArray = _divObj.querySelectorAll('thead th[id]');

		var _thMap = {};
		for (var i = 0; i < thArray.length; i++) {
		  var thObj = thArray[i];
		  _thMap[thObj.id] = thObj;
		}

		for (var i = 0; i < colArray.length; i++) {
		  var aCol = colArray[i];

		  var aTh = _thMap[aCol.getAttribute("thid")];
		  if (aTh == null) {
		    aTh = thArray[i] || null;
		  }

		  var aTd = _cellArr[i] || null;
		  if (aTd) {
		    _cellMap[aTd.id] = aTd;
		    _cellIndex[aTd.id] = i;

		    var required = aTd.getAttribute("required");
		    var celltype = aTd.getAttribute("celltype");

		    if (celltype == 'tree') {
		      _divObj.setAttribute("usetree", "true");
		      _divObj.setAttribute("treetdid", aTd.id);
		    }

		    if (required == 'true' && aTh) {
		      aTh.classList.add('req'); // $(aTh).addClass('req');
		    }
		  }

		  if (aTh != null) {
		    var before = aTh.innerHTML;
		    var _after = '';
		    var thCelltype = aTh.getAttribute("celltype");

		    if (thCelltype == 'checkbox') {
		      // $(aTh).off("click").on("click",$m.cellAllCheck);
		      if (aTh._mocaClickHandler) {
		        aTh.removeEventListener('click', aTh._mocaClickHandler);
		      }
		      aTh._mocaClickHandler = $m.cellAllCheck;
		      aTh.addEventListener('click', aTh._mocaClickHandler);

		      _after = '<div class="moca_checkbox_grid" >';
		      _after += '<input type="checkbox" class="moca_checkbox_input allcheck" name="cbxAll" ';
		      _after += 'id="cbx_' + $m.pageId + '_' + $m.srcId + '_' + _id + '" ';
		      _after += 'grd_id=' + _id + '>';
		      _after += '<label class="moca_checkbox_label" for="cbx_' + $m.pageId + '_' + $m.srcId + '_' + _id + '"  >label</label>';
		      _after += '</div>';
		    } else {
		      _after += '<div class="moca_grid_sort_box">';
		      _after += '<span>' + before + '</span>';
		    }

		    var sortable = aTh.getAttribute("sortable");
		    if (sortable == "true") {
		      // 기존 inline onclick 유지(완전 순수 JS로 바꾸려면 아래 주석 참고)
		      _after += '<button class="moca_grid_sort_btn sort_none" onclick="$m.doSort(this)">정렬취소</button>';
		    }

		    var filterable = aTh.getAttribute("filterable");
		    if (filterable == "true") {
		      _after += '<button class="moca_grid_filter_btn" onclick="$m.doFilter(this)" ondblclick="$m.doFilterDblclick(this)">필터</button>';
		      _after += '<i onclick="$m.filterRemoveAllConfirm(this);"></i>';
		    }

		    aTh.innerHTML = _after;
		    aTh.innerHTML = aTh.innerHTML + '<div class="groupbar"></div>';

		    // ✅ (선택) inline onclick를 완전 제거하고 싶으면:
		    // aTh.innerHTML로 넣은 뒤, aTh 안의 버튼들을 querySelector로 찾아 addEventListener로 붙이는 방식으로 바꿔야 함.
		  }
		}

		_divObj.cellInfo = _cellMap;
		_divObj.cellArr = _cellArr;
		_divObj.cellIndex = _cellIndex;

		//$m._col_showhideExe(_divObj);

		_divObj.list = [];

		// $(_divObj).find('tbody:first').html('');
		var tbodyFirst = _divObj.querySelector('tbody');
		if (tbodyFirst) tbodyFirst.innerHTML = '';

		// $(_divObj).find('thead:first>tr').bind('mousedown', function(e){ ... });
		var theadFirstTr = _divObj.querySelector('thead > tr');
		if (theadFirstTr) {
		  // 중복 바인딩 방지(원하면 제거 가능)
		  if (theadFirstTr._mocaMouseDownHandler) {
		    theadFirstTr.removeEventListener('mousedown', theadFirstTr._mocaMouseDownHandler);
		  }
		  theadFirstTr._mocaMouseDownHandler = function (e) {
		    //$m.grid_colDown(this);
		    e.preventDefault();
		    return false;
		  };
		  theadFirstTr.addEventListener('mousedown', theadFirstTr._mocaMouseDownHandler);
		}

		// $(_divObj).find('thead:first th[id]').bind('dblclick',$m.doSort);
		var ths = _divObj.querySelectorAll('thead th[id]');
		ths.forEach(function (th) {
		  if (th._mocaDblClickHandler) th.removeEventListener('dblclick', th._mocaDblClickHandler);
		  //th._mocaDblClickHandler = $m.doSort;
		  //th.addEventListener('dblclick', th._mocaDblClickHandler);
		});

		// 계산부
		var _default_cell_height = this.getCellHeight(_divObj);

		// headerCellCnt = $(_divObj).find('thead').children().length;
		var thead = _divObj.querySelector('thead');
		var headerCellCnt = thead ? thead.children.length : 0;

		// viewRowsMaxCnt = (bodyHeight - theadHeight) / cellHeight;
		var bodyEl = _divObj.querySelector('.moca_grid_body');
		var bodyHeight = bodyEl ? bodyEl.clientHeight : 0;
		var theadHeight = thead ? thead.getBoundingClientRect().height : 0;

		var viewRowsMaxCnt = 0;
		if (_default_cell_height) {
		  viewRowsMaxCnt = (bodyHeight - theadHeight) / _default_cell_height;
		}

		_divObj.viewRowsMaxCnt = Math.round(viewRowsMaxCnt);

	};
	
	

	renderGridToolbarCheckbox = function(x1Obj) {
	    ['grid toolbar내 checkbox만들기'];
	    var _html = '';
	    if(x1Obj.checked == 'true'){
	        x1Obj.checkedStr = 'checked';
	    }else{
	        x1Obj.checkedStr = '';
	    }
	    if(x1Obj.onclick != null && x1Obj.onclick != ''){
	        x1Obj.onclickStr = 'onclick="$m.setter_pageId(\''+this.pageId+'\',\''+this.srcId+'\',\''+x1Obj.onclick+'\',this)"'; 
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


	renderGridToolbarInput = function(x1Obj) {
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

	renderGridToolbarButton = function(x1Obj,_id) {
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
	    if(this.getDevice() != 'pc' && x1Obj.mobileHide == "true"){
	    	_html += '<div class="grid_btn '+x1Obj.addClassStr+'" grdkey="'+_id+'" style="display:none">';
	    }else{
	    	_html += '<div class="grid_btn '+x1Obj.addClassStr+'" grdkey="'+_id+'">';
	    } 
	    
	    _html += '<button type="button" id="'+_btnid+'" style="'+_innerStyle+'" onclick="'+x1Obj.onclick+'(this)" '+_disabled+' >'+x1Obj.label+'</button>';
	    _html += '</div>';
	    return _html;
	};

	renderGridToolbarLabelSpan = function(x1Obj) {
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
	    if(this.getDevice() != 'pc' && x1Obj.mobileHide == "true"){
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

	renderGridToolbarLabel = function(x1Obj) {
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


	renderGridToolbarLabelInput = function(x1Obj) {
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


	renderGridToolbarCombo = function(x1Obj,_id) {
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


	renderGridToolbarLabelCombo = function(x1Obj,_id) {
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

	renderGridToolbarRadio = function(x1Obj,_id) {
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

	getObj = function(_objId,_tag,_pageId,_srcId){
	    ['고유한 obj찾기'];
	    var re;
	    if(_tag == null){
	        if(_pageId != null){
	            re = document.querySelector(`div[id="${_objId}"][pageId="${_pageId}"]`);
	        }else if(this.pageId != null){
				re = document.querySelector(`div[id="${_objId}"][pageId="${this.pageId}"]`);
	        }else{
				re = document.querySelector(`div[id="${_objId}"]`);
	        }
	    }else{
	        if(_pageId != null){
				re = document.querySelector(`${_tag}[id="${_objId}"][pageId="${_pageId}"]`);
	        }else if(this.pageId != null){
	            re = document.querySelector(`${_tag}[id="${_objId}"][pageId="${this.pageId}"]`); 
	        }else{
				re = document.querySelector(`div[id="${_objId}"]`);
	        }       
	    }
		
		if (re != null) {

		  re.getCheckbox = function (_checkboxId) {
		    // grid toolbar 내 checkbox 정보 가져오기
		    const cObj = this.querySelector('#' + CSS.escape(_checkboxId));

		    if (cObj != null) {
		      return {
		        id: _checkboxId,
		        checked: cObj.checked,
		        value: cObj.value
		      };
		    } else {
		      return null;
		    }
		  };

		  re.getInput = function (_inputId) {
		    // grid toolbar 내 input 정보 가져오기
		    const cObj = this.querySelector('#' + CSS.escape(_inputId));

		    if (cObj != null) {
		      return {
		        id: _inputId,
		        value: cObj.value
		      };
		    } else {
		      return null;
		    }
		  };

		  if (re.length > 1) {
		    alert('중복된 아이디가 있습니다. ID(' + _objId + ')를 변경해주세요');
		  }

		  return re;

		} else {
		  return null;
		}
	};
	
	getAttrObj = function(_grdObj,_attr){
	   	var attrObj = (_grdObj.getAttribute(_attr) != null)? JSON.parse(_grdObj.getAttribute(_attr)):{};
	   	return attrObj;
   };
   
	_setSelectRowIndex = function(_tdObj){
	    ['row select Index구하기'];
		var tr;

		if (_tdObj.tagName === 'TR') {
		  tr = _tdObj;
		} else if (_tdObj.tagName === 'TD') {
		  tr = _tdObj.parentElement;
		}

		if (!tr) return;

		var tbody = tr.parentElement;

		// 1차: _tdObj 기준으로 grid 찾기
		var grd = _tdObj.closest('div[type="grid"]');

		// 2차: 못 찾았을 경우 id 기준으로 다시 시도
		if (!grd && _tdObj.id) {
		  var safeId = CSS.escape(_tdObj.id);
		  var elById = document.getElementById(_tdObj.id);
		  if (elById) {
		    grd = elById.closest('div[type="grid"]');
		  }
		}

		if (!grd) return;

		var realrowindex = tr.getAttribute('realrowindex');
		grd.setAttribute('selectedRealRowIndex', realrowindex);
		
	};
	
	_setRowSelection = function(grd,_tdObj){ 
	    ['row select 표시'];
		var _realIndex = grd.getAttribute("selectedRealRowIndex");

		if (_realIndex != null && String(_realIndex).trim() !== '') {

		  // tbody:first
		  var tbody = grd.querySelector('tbody');
		  if (!tbody) return;

		  // tbody:first > tr[realrowindex=...]
		  // (값에 특수문자 가능성 있으면 따옴표로 감싸는 게 안전)
		  var foundedRows = grd.querySelectorAll(`tbody > tr[realrowindex="${CSS.escape(String(_realIndex))}"]`);

		  var selectedRow = null;
		  if (foundedRows.length === 1) {
		    selectedRow = foundedRows[0];
		  }

		  if (selectedRow != null) {

		    // 기본 선택색
		    var _bgcolor = this.rowSelectedColor;

		    // grd의 rowselectedcolor 속성 우선
		    var attrColor = grd.getAttribute("rowselectedcolor");
		    if (attrColor != null && String(attrColor).trim() !== '') {
		      _bgcolor = attrColor;
		    }

		    // 기존 선택 스타일 초기화:
		    // $(grd).find('tbody:first').children().children().css(...)
		    // = tbody의 모든 tr의 모든 td/th에 대해 스타일 제거
		    tbody.querySelectorAll('tr > *').forEach(function (cell) {
		      cell.style.backgroundColor = '';
		      cell.style.color = '';
		    });

		    // 선택된 row의 모든 셀에 스타일 적용:
		    // $(selectedRow).children().css(...)
		    Array.from(selectedRow.children).forEach(function (cell) {
		      cell.style.backgroundColor = _bgcolor;
		      cell.style.color = '#FFF';
		    });
		  }
		}
	};
	
	getCellHeight = function(_grd) {
	    var _default_cell_height = _grd.getAttribute("default_cell_height");
	    if(_default_cell_height == null){
	        //_default_cell_height = mocaConfig.grid.default_cell_height;
			_default_cell_height = 26;
	    }
	    _default_cell_height = parseFloat(_default_cell_height.replace(/px/g,''))+1;
	    return _default_cell_height;
	};
	
	drawGrid = function(_grdId,_list,_response){
       this.drawGrid_inside(_grdId,_list,_list,this.pageId,this.srcId,_response);
       if(typeof _grdId == 'object'){
           this.getObj(_grdId.id+"_moca_scroll_y",null,this.pageId,this.srcId).scrollTop = 0; 
       }else{
           this.getObj(_grdId+"_moca_scroll_y",null,this.pageId,this.srcId).scrollTop = 0; 
       }
       
   };
   
   drawGrid_inside = function(_grdId,_list,_orilist,_pageId,_srcId,_response){
       var _grd;
       if(typeof _grdId == 'string'){
           _grd = this.getObj(_grdId,null,_pageId,_srcId);
       }else{
           _grd = _grdId;
           _grdId = _grdId.id;
       }
       _srcId = _grd.getAttribute("srcid");
       //$m[_srcId].filterRemoveAll(_grd);
       _grd.list = _list;
       if(_grd.list != null){
       	if(this.getAttrObj(_grd,'paging').type != 'numberList'){
       		this.setTotalCnt(_grd,this.comma(_grd.list.length));
       	}else if(_response != null){
   			var _totalCnt =_response[this.getAttrObj(_grd,'paging').totalCntKey];
       		this.setTotalCnt(_grd,_totalCnt);
       	}
           if(_orilist != null){
               _grd.ori_list =  [..._orilist];
           }
           ////////////////////////////////////////////////////////////////// filter 구성 start
           var list = _list;
           var jq_grd_2 = _grd;
           var ks = Object.keys(jq_grd_2.cellInfo);

           var filterArr = [];
           var filterThArr = [];
		   var thArray = jq_grd_2.querySelectorAll('thead th[filterableId]');
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
                   //jq_grd_2[tdId]['filterableMap'][tdValue] = ($m.getNumber(jq_grd_2[tdId]['filterableMap'][tdValue])+1);
                   if(i == list.length-1){
                       //jq_grd_2[tdId]['filterableMap'] = $m.sortObject(jq_grd_2[tdId]['filterableMap']);
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
                       //jq_grd_2[tdId]['countableMap'] = $m.sortObjectNumString(jq_grd_2[tdId]['countableMap']);
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
               
			   jq_grd_2.querySelectorAll(`.itemTable[thid="${CSS.escape(thId)}"]`).forEach(el => el.remove());
			   jq_grd_2.filter = null;

           }
           
       //////////////////////////////////////////////////////////////////filter 구성 end
           this.setVirtualScroll(_grd);
           this.genTbody(_grd,_list,0);
           
       }

   };
   
   genTbody = function (_grd, _list, _idx, isEnd) {
     var dataLeng = _list.length;
     var idx = 0;
     if (_idx != null) idx = _idx;

     _grd.setAttribute("yscrollIdx", idx);

     var usetree = _grd.getAttribute("usetree");
     var treetdid = _grd.getAttribute("treetdid");

     var _default_cell_height = this.getCellHeight(_grd);

     // jQuery: $(_grd).find('thead').children().length;
     var thead = _grd.querySelector("thead");
     var headerCellCnt = thead ? thead.children.length : 0;

     // jQuery: ($(_grd).find('.moca_grid_body').height() - $(_grd).find('thead').height()) / _default_cell_height;
     var bodyEl = _grd.querySelector(".moca_grid_body");
     var bodyH = bodyEl ? bodyEl.clientHeight : 0;
     var theadH = thead ? thead.getBoundingClientRect().height : 0;

     var viewRowsMaxCnt = 0;
     if (_default_cell_height) {
       viewRowsMaxCnt = (bodyH - theadH) / _default_cell_height;
       viewRowsMaxCnt = Math.round(viewRowsMaxCnt);
     }

     if (viewRowsMaxCnt < 1) {
       viewRowsMaxCnt = _grd.viewRowsMaxCnt;
     }

     if (isEnd) {
       idx = dataLeng - Math.floor(viewRowsMaxCnt);
     } else {
       if (dataLeng != viewRowsMaxCnt) {
         viewRowsMaxCnt++; // tree에서 넥스트tr 미리보기
       }
     }

     if (idx < 0) idx = 0;

     var viewRowsMaxNow = dataLeng;
     if (dataLeng < (viewRowsMaxCnt + idx)) viewRowsMaxNow = dataLeng;
     else viewRowsMaxNow = (viewRowsMaxCnt + idx);

     var tbodyHtml = "";

     for (var i = idx, j = viewRowsMaxNow; i < j; i++) {
       var row = _list[i];

       var row_next;
       if (i + 1 < j) row_next = _list[i + 1];

       var row_pre;
       if (i - 1 > 0) row_pre = _list[i - 1];

       var isExp = "true";
       var showHide = "show";

       if (usetree == "true") {
         isExp = row["_system"]["expand"];
         showHide = row["_system"]["display"];
         if (showHide == null) showHide = "show";
       }

       var _aTr = this.genRows(row, row_pre, row_next, _grd, null, idx, i, "before");

       if (showHide == "hide") {
         j++;
         if (j > dataLeng) j = dataLeng;
         continue;
       } else {
         tbodyHtml += _aTr;
       }
     }

     // jQuery: $(_grd).find('tbody:first').html(tbody);
     var tbody = _grd.querySelector("tbody");
     if (tbody) tbody.innerHTML = tbodyHtml;

     // after 처리 (원본 코드처럼 호출)
     for (var i2 = idx, j2 = viewRowsMaxNow; i2 < j2; i2++) {
       // 원본 코드도 row/row_pre/row_next 재계산 없이 호출하길래 동일하게 유지
       // (정확히 맞추려면 위에서처럼 다시 계산해 넘겨야 함)
       this.genRows(row, row_pre, row_next, _grd, null, idx, i2, "after");
     }

     //$m._col_showhideExe(_grd);
     this._setRowSelection(_grd);

     // ===== dblclick(tr) 위임: jQuery off/on 대체 =====
     var _onDblClickFunc = _grd.getAttribute("onDblClick");
     if ((_onDblClickFunc ?? "").trim() !== "") {
       // 중복 바인딩 방지
       if (_grd._mocaDblClickHandler) {
         _grd.removeEventListener("dblclick", _grd._mocaDblClickHandler);
       }

       _grd._mocaDblClickHandler = function (e) {
         var tr = e.target.closest("tr");
         if (!tr || !_grd.contains(tr)) return;

         var nowGrd = _grd;
         var rowIndex = tr.getAttribute("realrowindex");

         // event.srcElement 대신 e.target 사용
         var src = e.target;
         var td = null;

         if (src && src.tagName === "DIV") {
           td = src.closest("td");
         } else if (src && src.tagName === "TD") {
           td = src;
         } else {
           td = src ? src.closest("td") : null;
         }

         var colId = td ? td.id : null;
         if (!colId) return;

         // jQuery: $(e.currentTarget).find('td[id='+colId+']').index();
         var tdInRow = tr.querySelector(`#${CSS.escape(colId)}`);
         var colIndex = -1;
         if (tdInRow) colIndex = Array.prototype.indexOf.call(tr.children, tdInRow);

         var fnStr = nowGrd.getAttribute("onDblClick");
         if (!fnStr) return;

         // 기존 로직 유지: eval(fnStr)(...)
         eval(fnStr)(nowGrd, rowIndex, colIndex, colId);
       };

       _grd.addEventListener("dblclick", _grd._mocaDblClickHandler);
     }

     // ===== tooltip/hover/wheel/mousemove: jQuery 이벤트 위임 대체 =====
     // jQuery의 $._data(_grd,"events") 체크는 순수 JS에서 불가 → 플래그로 1회만 바인딩
     if (!_grd._mocaHoverBound) {
       _grd._mocaHoverBound = true;

       // mouseenter(td) 위임: mouseover로 구현
       _grd.addEventListener("mouseover", function (e) {
         var td = e.target.closest("td");
         if (!td || !_grd.contains(td)) return;

         // 실제로 td에 "진입"했을 때만(내부 이동 제외)
         if (e.relatedTarget && td.contains(e.relatedTarget)) return;

         if (td.innerText != null && td.innerText !== "" && td.getAttribute("tooltip") === "true") {
           var tooltip = document.querySelector(".moca_grid_tooltip");
           if (!tooltip) return;

           tooltip.style.position = "fixed";
           tooltip.innerHTML = td.innerText;

           var tdWidth = tooltip.getBoundingClientRect().width + 20;
           var posi = e.clientX;
           var s = window.innerWidth / 2;

           if (posi < s) posi = posi + 20;
           else posi = posi - tdWidth;

           var tdHeight = td.getBoundingClientRect().height;
           var posiY = e.clientY;
           var posiY_max = document.body.clientHeight - tdHeight - 20;
           if (posiY > posiY_max) posiY = posiY_max;

           tooltip.style.top = posiY + "px";
           tooltip.style.left = posi + "px";
           tooltip.style.display = "block";
         }
       });

       // mouseleave(tbody:first) 위임: mouseout로 구현
       _grd.addEventListener("mouseout", function (e) {
         var tbodyEl = e.target.closest("tbody");
         if (!tbodyEl || !_grd.contains(tbodyEl)) return;

         // tbody에서 완전히 나갈 때만
         if (e.relatedTarget && tbodyEl.contains(e.relatedTarget)) return;

         var tooltip = document.querySelector(".moca_grid_tooltip");
         if (tooltip) tooltip.style.display = "none";

         e.preventDefault();
         e.stopPropagation();
         return false;
       });

       // wheel(tbody:first)
       _grd.addEventListener("wheel", function (e) {
         var tbodyEl = e.target.closest("tbody");
         if (!tbodyEl || !_grd.contains(tbodyEl)) return;

         if (e.currentTarget && e.currentTarget.tagName === "TBODY") {
           // (여긴 원본 조건이 애매해서, 실제로는 아래처럼 grid 기준으로 처리하는 게 안전)
         }

         var grd = (e.target.closest("[type=grid]") || _grd);
         this.pageId = grd.getAttribute("pageId");
         this.srcId = grd.getAttribute("srcid");

         m.wFunction(m.getObj(_grd.id + "_moca_scroll_y"));
       }, { passive: true });

       // mousemove(table)
       _grd.addEventListener("mousemove", function (e) {
         var table = e.target.closest("table");
         if (!table || !_grd.contains(table)) return;
         //$m.grid_checkBorder(table);
       });
     }

     // 다 그리고 난 후 색칠
     var rowBgColorFunctionStr = _grd.getAttribute("rowBgColorFunction");
     if (rowBgColorFunctionStr != null) {
       var rowBgColorFunctionObj = eval(rowBgColorFunctionStr);
       rowBgColorFunctionObj();
     }
   };

   genRows = function (_row, _row_pre, _row_next, _grd, _mode, _startIndex, _nowIndex, _beforeAfter) {
     if (_row["_system"] == null) {
       _row["_system"] = { status: "", expand: "true", realIndex: _nowIndex + "" };
     } else {
       _row["_system"]["realIndex"] = _nowIndex + "";
     }

     var row = "<tr realRowIndex='" + _nowIndex + "'>";

     // jQuery: $(_grd).find('table').find('th').length;
     var tdCnt = _grd.querySelectorAll("table th").length;

     var ks = Object.keys(_grd.cellInfo);
     var cellCnt = ks.length;

     var cellHeight = _grd.getAttribute("default_cell_height");
     if (cellHeight == null) {
       console.log("grid(" + _grd.id + ")에 default_cell_height가 지정되지않았습니다. 26px로 지정합니다.");
       cellHeight = "26px";
     }

     var ch = parseFloat(String(cellHeight).replace(/px/g, "")) - 2;

     // ===== Array row =====
     if (Array.isArray(_row)) {
       for (var i = 0, j = cellCnt; i < j; i++) {
         var cell = (_row[i] + "");
         var cellTd = _grd.cellInfo[i];

         if (cell == null || cell == "null") cell = "";
         cell = cell.replace(/<(\/)?br(\/)?>/gi, "&lt;br&gt;");

         row += '<td headers="col3" id="td' + i + '" celltype="input" style="height:' + cellHeight + '">';
         row += '<input type="text" class="moca_input" style="height:' + ch + 'px" value="' + cell + '">';
         row += "</td>";
       }
     } else {
       // ===== Object row =====
       for (var i = 0, j = ks.length; i < j; i++) {
         var key = ks[i];
         var cell;

         if (key == "status") {
           cell = (_row["_system"][key] != null) ? (_row["_system"][key] + "") : "";
         } else {
           cell = (_row[key] != null) ? (_row[key] + "") : "";
         }

         var cellTd = _grd.cellInfo[key];

         var readOnly, _celltype, _id, _class, _name, _toolTip, _displayFormat;
         var _keyMask, _displayFunction, _displayFunctionApply, _disabledFunction;
         var _align, _addRowEditable, _style, _required, _popupUrl, _popupData;
         var _levelId, _labelId, _maxLength, _editorMode, _mobileWidth, _callFunction;

         if (cellTd == null) {
           cell = "";
         } else {
           cell = cell.replace(/<(\/)?br(\/)?>/gi, "&lt;br&gt;");

           readOnly = cellTd.getAttribute("readOnly");
           _celltype = cellTd.getAttribute("celltype");
           _id = cellTd.getAttribute("id");
           _class = (cellTd.getAttribute("class") != null) ? cellTd.getAttribute("class") : "";
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
           _style = cellTd.getAttribute("style") || "";

           // jQuery: $(_grd).find('.moca_grid_body colgroup').find('col[columnkey='+_id+']');
           var aCol = _grd.querySelector('.moca_grid_body colgroup col[columnkey="' + CSS.escape(_id) + '"]');

           if (aCol) {
             if (this.getDevice() == "pc") {
               //$m.moblePcHide(aCol, "hide");
               if (aCol.getAttribute("hide") == "true") {
                 _style = _style.replace("display: table-cell", "display: none");
               } else {
                 _style = _style.replace("display: none", "display: table-cell");
               }
             } else {
               //$m.moblePcHide(aCol, "mobileHide");
               if (aCol.getAttribute("mobileHide") == "true") {
                 _style = _style.replace("display: table-cell", "display: none");
               } else {
                 _style = _style.replace("display: none", "display: table-cell");
               }

               _mobileWidth = aCol.getAttribute("mobileWidth");
               if (_mobileWidth) {
                 aCol.setAttribute("style", "width:" + _mobileWidth);
               }
             }
           }

           _required = cellTd.getAttribute("required");
           _popupUrl = cellTd.getAttribute("popupUrl");
           _popupData = cellTd.getAttribute("popupData");
           _callFunction = cellTd.getAttribute("callFunction");
           _levelId = cellTd.getAttribute("levelId");
           _labelId = cellTd.getAttribute("labelId");
         }

         var _keyMaskStr = (_keyMask != null) ? _keyMask : "";

         var _level = "";
         if (_levelId != null) _level = (_row[_levelId] + "");

         var _label = "";
         if (_labelId != null) _label = _row[_labelId];

         if (_row["_system"]["status"] == "C" && key != "status" && _addRowEditable != "false") {
           readOnly = "false";
           _toolTip = "false";
         }

         if (_grd.list && _grd.list[_nowIndex] && _grd.list[_nowIndex]["_system"] && _id) {
           var sysCell = _grd.list[_nowIndex]["_system"][_id];
           if (sysCell && sysCell["readonly"] != null) readOnly = sysCell["readonly"];
         }

         // ===== select =====
         if (_celltype == "select") {
           row += '<td id="' + _id + '" class="' + _class + '" name="' + _name + '" toolTip="' + _toolTip + '" celltype="' + _celltype + '" displayFormat="' + _displayFormat + '" keyMask="' + _keyMask + '" displayFunction="' + _displayFunction + '" readOnly="' + readOnly + '"  style="' + _style + '"  >';

           if (_grd[_id] != null) {
             var arr = _grd[_id].list;
             if (arr == null) arr = [];

             var codeOpt = _grd[_id].codeOpt;
             var _allOpt;
             if (codeOpt != null) _allOpt = codeOpt.allOption;

             _grd[_id]["map"] = $m.listToMap(arr, codeOpt);

             var _metaInfo;
             if (codeOpt != null) _metaInfo = codeOpt.metaInfo;

             var _codeCd = $m.codeCd;
             var _codeNm = $m.codeNm;
             if (_metaInfo != null) {
               _codeCd = _metaInfo.codeCd;
               _codeNm = _metaInfo.codeNm;
             }

             var cd = "", nm = "", label = "";
             var selectTag = "";
             var isAllOpt = false;

             if (_allOpt != null) {
               var _reLabel = "";
               if (_allOpt.displayFormat != null && _allOpt.displayFormat != "null") {
                 _reLabel = _allOpt.displayFormat.replace("[value]", _allOpt.value).replace("[label]", _allOpt.label);
               } else {
                 _reLabel = _allOpt.label;
               }
               selectTag = '<input type="text" class="moca_select" style="background-color:pink" readonly value="' + _reLabel + '" onfocus="$m.openSelect(this)" >';
               cd = _allOpt.value;
               nm = _allOpt.label;
               label = _reLabel;
               isAllOpt = true;
             }

             var selectFlag = false;
             for (var c_d = 0, c_d_l = arr.length; c_d < c_d_l; c_d++) {
               var aData = arr[c_d];
               var _reLabel2 = "";
               var _cd = aData[_codeCd];
               var _nm = aData[_codeNm];

               if (_displayFormat != null && _displayFormat != "null") {
                 _reLabel2 = _displayFormat.replace("[value]", _cd).replace("[label]", _nm);
               } else {
                 _reLabel2 = _nm;
               }

               if (cell == aData[_codeCd]) {
                 selectFlag = true;
                 selectTag = $m.getInputSelectTag(_reLabel2, _required);
                 cd = _cd;
                 nm = _nm;
                 label = _reLabel2;
                 break;
               }
             }

             if (!selectFlag) {
               selectTag = $m.getInputSelectTag("-선택-", _required);
               if (!isAllOpt) {
                 cd = "";
                 nm = "-선택-";
                 label = nm;
               }
             }

             if (readOnly == "true") {
               row += label;
             } else {
               row += $m.getSelectDivTagForCombo(label, _required, cd, nm, ch);
               row += selectTag;
             }
           }

           row += "</div></td>";

         // ===== input =====
         } else if (_celltype == "input") {
           var _reLabel3 = "";
           try {
             if (_displayFunction != null && eval(_displayFunction) != null) {
               _reLabel3 = eval(_displayFunction)(cell, _grd, _row["_system"]["realIndex"], _id);
             } else {
               _reLabel3 = cell;
             }
           } catch (e) {
             console.log("1009:" + e);
           }

           var _inTag = "";
           // jQuery: $(_grd).attr('rendering_div');
           var _renderingDiv = _grd.getAttribute("rendering_div");

           if (_renderingDiv) {
             if (readOnly == "true") {
               _inTag = "<div>" + _reLabel3 + "</div>";
             } else {
               var _req2 = (_required == "true") ? " req" : "";
               _inTag = '<div type="input" class="moca_input' + _req2 + '">' + _reLabel3 + "</div>";
             }
           } else {
             if (readOnly == "true") {
               _inTag = "<div>" + _reLabel3 + "</div>";
             } else {
               var maxLen = String(_maxLength ?? "").trim();
               var cls = (_required == "true") ? "moca_input req" : "moca_input";
               _inTag =
                 '<input type="text" maxLength="' + maxLen + '"' +
                 ' onblur="$m.setValue(this,this.value,\'' + _keyMaskStr + '\');"' +
                 ' onkeydown="$m.keydown(this,this.value,\'' + _keyMaskStr + '\');"' +
                 " displayFunction='" + (_displayFunction || "") + "'" +
                 " displayFunctionApply='" + (_displayFunctionApply || "") + "'" +
                 ' class="' + cls + '"' +
                 ' style="' + _style + '"' +
                 ' value="' + _reLabel3 + '"' +
                 ' onkeyup="$m._uptData(this)" onfocus="$m._evt_selectFocus(this)">';
             }
           }

           row +=
             '<td id="' + _id + '" class="' + _class + '" name="' + _name + '"' +
             ' toolTip="' + _toolTip + '" celltype="' + _celltype + '"' +
             " displayFunction='" + (_displayFunction || "") + "'" +
             " displayFunctionApply='" + (_displayFunctionApply || "") + "'" +
             ' editorMode="' + (_editorMode || "") + '"' +
             ' style="' + _style + '"' +
             ' readOnly="' + readOnly + '"' +
             ' onclick="$m.defaultCellClick(this)">' +
             _inTag + "</td>";

         // ===== inputButton =====
         } else if (_celltype == "inputButton") {
           var _reLabel4 = "";
           if (_displayFunction != null && eval(_displayFunction) != null) _reLabel4 = eval(_displayFunction)(cell);
           else _reLabel4 = cell;

           var _inTag2 = "";
           var _renderingDiv2 = _grd.getAttribute("rendering_div");

           if (readOnly == "true") {
             _inTag2 = _reLabel4;
           } else {
             _inTag2 = (_required == "true") ? '<div class="moca_ibn req">' : '<div class="moca_ibn">';

             if (_renderingDiv2) {
               _inTag2 += '<div type="text" class="moca_input" readonly style="' + _style + '">' + _reLabel4 + "</div>";
             } else {
               _inTag2 += '<input type="text" class="moca_input" readonly style="' + _style + '" value="' + _reLabel4 + '" onkeyup="$m._uptData(this)" onfocus="$m._evt_selectFocus(this)">';
             }

             if (String(_callFunction ?? "").trim() !== "") {
               _inTag2 += '<button type="button" class="moca_ibn_btn" onclick="' + _callFunction + '(this)" onfocus="$m._evt_selectFocus(this)">검색</button></div>';
             } else {
               _inTag2 += "</div>";
             }
           }

           row += '<td id="' + _id + '" class="' + _class + '" name="' + _name + '"  toolTip="' + _toolTip + '" celltype="' + _celltype + '" style="' + _style + '"  readOnly="' + readOnly + '">' + _inTag2 + "</td>";

         // ===== button =====
         } else if (_celltype == "button") {
           var btnLabel = cellTd.getAttribute("btnLabel");
           var _reLabel5 = "";
           var isDisabled = "";
           var _isdis = false;

           try {
             if (_disabledFunction != null && eval(_disabledFunction) != null) {
               _isdis = eval(_disabledFunction)(cell, _grd, _row["_system"]["realIndex"]);
               if (_isdis) isDisabled = "disabled";
             }
             _reLabel5 = cell;
           } catch (e) {
             console.log("1132:" + e);
           }

           var _inTag3 = "";
           if (readOnly == "true") {
             _inTag3 = _reLabel5;
           } else {
             if (String(_callFunction ?? "").trim() !== "") {
               _inTag3 = '<div class="grid_btn">';
               _inTag3 += '<button type="button" onclick="' + _callFunction + '(this,\'' + _nowIndex + '\',\'' + _id + '\')" onfocus="$m._evt_selectFocus(this)" ' + isDisabled + ">" + btnLabel + "</button>";
               _inTag3 += "</div>";
             }
           }

           row += '<td id="' + _id + '" class="' + _class + '" name="' + _name + '"  toolTip="' + _toolTip + '" celltype="' + _celltype + '" style="' + _style + '"  readOnly="' + readOnly + '"  disabledFunction="' + _disabledFunction + '">' + _inTag3 + "</td>";

         // ===== tree =====
         } else if (_celltype == "tree") {
           var _inTag4 = "";
           if (String(_label ?? "").trim() !== "") {
             var icon_folder;
             var preLevel = (_row_pre != null) ? _row_pre[_levelId] : 0;
             var nextLevel = (_row_next != null) ? _row_next[_levelId] : 0;

             if (
               (_level > preLevel && _level == nextLevel) ||
               _level > nextLevel ||
               (_row_pre != null && _row_pre["_system"]["isLeaf"] == "true" && _level == preLevel) ||
               (_row_pre != null && _row_pre["_system"]["isLeaf"] == "true" && _level == preLevel && _level == nextLevel)
             ) {
               icon_folder = "moca_grid_leaf";
               _row["_system"]["isLeaf"] = "true";
             } else {
               var isExp;
               var usetree2 = _grd.getAttribute("usetree");
               if (usetree2 == "true") isExp = _row["_system"]["expand"];
               else isExp = "true";

               icon_folder = (isExp == "false") ? "moca_grid_plus" : "moca_grid_minus";
               _row["_system"]["isLeaf"] = "false";
             }

             var line = "";
             if (_level == 1) {
               line = "";
             } else if (_level == 2) {
               line = (_row["_system"]["isLeaf"] == "true") ? '<div class="moca_grid_last"></div>' : '<div class="moca_grid_midddle"></div>';
             } else {
               var lineNum = _level - 2;
               for (var i2 = 0; i2 < lineNum; i2++) line += '<div class="moca_grid_line"></div>';
               line += (_row["_system"]["isLeaf"] == "true") ? '<div class="moca_grid_last"></div>' : '<div class="moca_grid_midddle"></div>';
             }

             var ct_nm = "";
             if (_level == 1 && cellTd.getAttribute("depth1IconClass") != null) {
               ct_nm = '<span class="category ' + cellTd.getAttribute("depth1IconClass") + '">' + cellTd.getAttribute("depth1IconClass") + "</span>";
             } else if (_level == 2 && cellTd.getAttribute("depth2IconClass") != null) {
               ct_nm = '<span class="category ' + cellTd.getAttribute("depth2IconClass") + '">' + cellTd.getAttribute("depth2IconClass") + "</span>";
             } else if (_level == 3 && cellTd.getAttribute("depth3IconClass") != null) {
               ct_nm = '<span class="category ' + cellTd.getAttribute("depth3IconClass") + '">' + cellTd.getAttribute("depth3IconClass") + "</span>";
             } else if (_level == 4 && cellTd.getAttribute("depth4IconClass") != null) {
               ct_nm = '<span class="category ' + cellTd.getAttribute("depth4IconClass") + '">' + cellTd.getAttribute("depth4IconClass") + "</span>";
             } else if (_level == 5 && cellTd.getAttribute("depth2IconClass") != null) {
               ct_nm = '<span class="category ' + cellTd.getAttribute("depth5IconClass") + '">' + cellTd.getAttribute("depth5IconClass") + "</span>";
             }

             _inTag4 += '<span>' + line + '<div class="' + icon_folder + '" onclick="$m.grid_expand(this);"></div>' + ct_nm + "<label>" + _label + "</label></span>";
           }

           row += '<td id="' + _id + '" class="' + _class + '" name="' + _name + '"  toolTip="' + _toolTip + '" celltype="' + _celltype + '" style="' + _style + '"  readOnly="' + readOnly + '" class="tal">' + _inTag4 + "</td>";

         // ===== checkbox =====
         } else if (_celltype == "checkbox") {
           var _trueValue = cellTd.getAttribute("trueValue");
           var _falseValue = cellTd.getAttribute("falseValue");

           var _reLabel6 = "";
           var isDisabled2 = "";
           var _isdis2 = false;

           try {
             if (_disabledFunction != null && eval(_disabledFunction) != null) {
               _isdis2 = eval(_disabledFunction)(cell, _grd, _row["_system"]["realIndex"]);
               if (_isdis2) isDisabled2 = "disabled";
             }
             _reLabel6 = cell;
           } catch (e) {
             console.log("1090:" + e);
           }

           var isChecked = (_reLabel6 == _trueValue) ? "checked" : "";
           var _inTag5 = "";

           if (readOnly == "true") {
             _inTag5 = _reLabel6;
           } else {
             _inTag5 = '<div class="moca_checkbox_grid">';
             _inTag5 += '<input type="checkbox" class="moca_checkbox_input" name="cbx" id="cbx_' + $m.pageId + "_" + $m.srcId + "_" + _grd.id + "_" + _nowIndex + '" grd_id=' + _grd.id + ' value="' + _trueValue + '" ' + isChecked + " " + isDisabled2 + " >";
             _inTag5 += '<label class="moca_checkbox_label" for="cbx_' + $m.pageId + "_" + $m.srcId + "_" + _grd.id + "_" + _nowIndex + '"  >label</label>';
             _inTag5 += "</div>";
           }

           row += '<td id="' + _id + '" class="' + _class + '" name="' + _name + '"  toolTip="' + _toolTip + '" celltype="' + _celltype + '" style="' + _style + '"  readOnly="' + readOnly + '" trueValue="' + _trueValue + '" falseValue="' + _falseValue + '"  disabledFunction="' + _disabledFunction + '" onclick="$m.defaultCellClick(this);" >' + _inTag5 + "</td>";

         // ===== radio =====
         } else if (_celltype == "radio") {
           var _reLabel7 = "";
           var isDisabled3 = "";
           var _isdis3 = false;

           try {
             if (_disabledFunction != null && eval(_disabledFunction) != null) {
               _isdis3 = eval(_disabledFunction)(cell, _grd, _row["_system"]["realIndex"]);
               if (_isdis3) isDisabled3 = "disabled";
             }
             _reLabel7 = cell;
           } catch (e) {
             console.log("1090:" + e);
           }

           var _inTag6 = "";
           if (readOnly == "true") {
             _inTag6 = _reLabel7;
           } else {
             _inTag6 = '<div class="moca_radio_grid">';
             var _rdoArr = JSON.parse(cellTd.getAttribute("itemset"));
             for (var r = 0; r < _rdoArr.length; r++) {
               var isChecked2 = (_row["TEST_YN"] == _rdoArr[r].value) ? "checked" : "";
               _inTag6 += '<input type="radio" class="moca_radio" name="rdo__' + $m.pageId + "_" + _grd.id + "_" + _nowIndex + '" id="rdo_' + r + "_" + $m.pageId + "_" + _grd.id + "_" + _nowIndex + _rdoArr[r].value + '" grd_id=' + _grd.id + ' value="' + _rdoArr[r].value + '" ' + isChecked2 + " " + isDisabled3 + " >";
               _inTag6 += '<label class="moca_radio_label" for="rdo_' + r + "_" + $m.pageId + "_" + _grd.id + "_" + _nowIndex + _rdoArr[r].value + '"  >' + _rdoArr[r].label + "</label>";
             }
             _inTag6 += "</div>";
           }

           row += '<td id="' + _id + '" class="' + _class + '" name="' + _name + '"  toolTip="' + _toolTip + '" celltype="' + _celltype + '" style="' + _style + '"  readOnly="' + readOnly + '" disabledFunction="' + _disabledFunction + '" onclick="$m.defaultCellClick(this);" >' + _inTag6 + "</td>";
         }
       }
     }

     row += "</tr>";
     return row;
   };
	
   _setRowSelection = function(grd,_tdObj){ 
       ['row select 표시'];
	   var _realIndex = grd.getAttribute("selectedRealRowIndex");

	   if (_realIndex != null && String(_realIndex).trim() !== '') {
	     // tbody:first > tr[realrowindex=...]
	     var foundedRow = grd.querySelectorAll(
	       `tbody > tr[realrowindex="${CSS.escape(String(_realIndex))}"]`
	     );

	     var selectedRow = null;
	     if (foundedRow.length === 1) selectedRow = foundedRow[0];

	     if (selectedRow != null) {
	       var _bgcolor = this.rowSelectedColor;

	       var attrColor = grd.getAttribute("rowselectedcolor");
	       if (attrColor != null && String(attrColor).trim() !== '') {
	         _bgcolor = attrColor;
	       }

	       // 기존 색 초기화: tbody:first의 모든 tr의 모든 셀(td/th)
	       var tbody = grd.querySelector("tbody");
	       if (tbody) {
	         tbody.querySelectorAll("tr > *").forEach(function (cell) {
	           cell.style.backgroundColor = "";
	           cell.style.color = "";
	         });
	       }

	       // 선택된 row 색 적용
	       Array.from(selectedRow.children).forEach(function (cell) {
	         cell.style.backgroundColor = _bgcolor;
	         cell.style.color = "#FFF";
	       });
	     }
	   }

   };
   
   setTotalCnt = function(_grd,cnt){
          var grd;
          if(typeof _grd == 'string'){
              grd = this.getObj(_grd,null,this.pageId,this.srcId);
          }else{
              grd = _grd;
          }
          grd.totalCnt = cnt;
          /*if(this.getAttrObj(grd,'paging').type == 'numberList'){
          	$m[_srcId].setNumberListCnt(grd,cnt);
          }*/
		  const el = grd.querySelector('.grid_total .txt_blue');
		  if (el) {
		    el.innerHTML = this.comma(cnt);
		  }
      }
	  
	  comma = function(__num){ 
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
	      
	      
	      if(_num == null || _num.trim() == ''){
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
	  
	  setVirtualScroll = function(_grd){
	    var _default_cell_height = this.getCellHeight(_grd);

		// thead 높이
		var thead = _grd.querySelector('thead');
		var theadHeight = thead ? thead.getBoundingClientRect().height : 0;

		var fullHeight = _default_cell_height * _grd.list.length + theadHeight;

		// .moca_grid_body
		var div = _grd.querySelector('.moca_grid_body');
		if (div && div.scrollWidth > div.clientWidth && this.getDevice() !== 'mobile') {
		  // 세로 스크롤 +1 row 보정
		  fullHeight += _default_cell_height;
		}

		// 높이 적용
		var heightTarget = _grd.querySelector('#' + CSS.escape(_grd.id + '_grid_height'));
		if (heightTarget) {
		  heightTarget.style.height = fullHeight + 'px';
		}

	};
	
	sFunction = function(yscroll) { 
	    if(yscroll==null){
	        return;
	    }
	    
        this.pageId = yscroll.getAttribute("pageid");
        this.srcId = yscroll.getAttribute("srcid");
        var _grdId = yscroll.getAttribute("componentid");
        var _grd = this.getObj(_grdId,null,this.pageId,this.srcId);
        var onScrollEnd = _grd.getAttribute('onScrollEnd');
        var _default_cell_height = this.getCellHeight(_grd);


  
        var topPosition = yscroll.scrollTop;
        var startIdx = parseInt(topPosition/_default_cell_height); 
        var remainder= parseInt(topPosition%_default_cell_height); 
        var yscrollIdx = _grd.getAttribute("yscrollIdx");
        if(yscrollIdx == null) yscrollIdx = 0;
            this.setVirtualScroll(_grd);
            
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
            this.genTbody(_grd,_grd.list,startIdx+1,false);//0번째라인이 일부를 보여줄수없으므로 마지막한라인더 보여줘야 다 보여줄수있음
        }else{
        	this.genTbody(_grd,_grd.list,startIdx,false);//마지막스크롤이 아니면 정상적인 인덱스로 보여줘야함
        }
            
        if(isEnd){
            var func = eval(onScrollEnd);
            if(func != null){
                func(function(){
                    var topPosition = yscroll.scrollTop;
                    var startIdx = parseInt(Math.ceil(topPosition/_default_cell_height)); 
                    var yscrollIdx = _grd.getAttribute("yscrollIdx");
                    if(yscrollIdx == null) yscrollIdx = 0;
                    
                    this.setVirtualScroll(_grd);
                    this.genTbody(_grd,_grd.list,startIdx+1,true);////0번째라인이 일부를 보여줄수없으므로 마지막한라인더 보여줘야 다 보여줄수있음
                });
            }
        }

	};  
	
	wFunction = function(yscroll) {
	    //var _grd = document.getElementById(yscroll.getAttribute("componentid"));
	    
	    var _grd = this.getObj(yscroll.getAttribute("componentid"));
	    var _default_cell_height = this.getCellHeight(_grd);
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
	/*
	 * getDevice
	 */
	getDevice = function(){
	    ['toSingleMdi']; 
	    var sw = screen.width;
		var _m = 'pc';
		(sw < 1280)?_m="mobile":_m = "pc";
		return _m;
	};
}