/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function( config ) {
	/*
	// * toolbar default
	// Toolbar configuration generated automatically by the editor based on config.toolbarGroups.
	config.toolbar = [
		{ name: 'document', groups: [ 'mode', 'document', 'doctools' ], items: [ 'Source', '-', 'Save', 'NewPage', 'ExportPdf', 'Preview', 'Print', '-', 'Templates' ] },
		{ name: 'clipboard', groups: [ 'clipboard', 'undo' ], items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
		{ name: 'editing', groups: [ 'find', 'selection', 'spellchecker' ], items: [ 'Find', 'Replace', '-', 'SelectAll', '-', 'Scayt' ] },
		{ name: 'forms', items: [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField' ] },
		'/',
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat' ] },
		{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ], items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language' ] },
		{ name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
		{ name: 'insert', items: [ 'Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe' ] },
		'/',
		{ name: 'styles', items: [ 'Styles', 'Format', 'Font', 'FontSize' ] },
		{ name: 'colors', items: [ 'TextColor', 'BGColor' ] },
		{ name: 'tools', items: [ 'Maximize', 'ShowBlocks' ] },
		{ name: 'others', items: [ '-' ] },
		{ name: 'about', items: [ 'About' ] }
	];
	*/
	config.toolbar = [{
        name: 'document',
        items: ['Source']
      },
      {
          name: 'basicstyles',
          items: ['Bold', 'Underline',  'Indent']
      },
      { 
      	name: 'styles', 
      	items: [ 'Font', 'FontSize'] 
      },
      { 
    	name: 'colors',
    	items: [ 'TextColor', 'BGColor' ] 
      },
      {
        name: 'insert',
        items: ['Table','Image','Link']
      },
      { 
    	name: 'paragraph', 
    	items: [ 'NumberedList', 'BulletedList',] 
      }
    ];
	// Toolbar groups configuration.
	config.toolbarGroups = [
		{ name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
		{ name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
		{ name: 'editing', groups: [ 'find', 'selection', 'spellchecker' ] },
		{ name: 'forms' },
		'/',
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
		{ name: 'links' },
		{ name: 'insert' },
		'/',
		{ name: 'styles' },
		{ name: 'colors' },
		{ name: 'tools' },
		{ name: 'others' },
		{ name: 'about' }
	];
	
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	config.uiColor = '#ababab';
	
	config.font_names	 = '굴림;궁서;돋움;바탕;Arial;Comic Sans MS;Courier New;Tahoma;Times New Roman;Verdana' ; 
	config.fullPage = false;   //true이면 html태그 까지 보임 false이면 에디터 부분 태그만 보임(html로 보기 시에)
	config.enterMode = CKEDITOR.ENTER_BR; //엔터시 입력되는 태그 BR P DIV 세 종류가 있습니다.
	config.fontSize_sizes = '8/8px;9/9px;10/10px;11/11px;12/12px;14/14px;16/16px;18/18px;20/20px;22/22px;24/24px;26/26px;28/28px;36/36px;48/48px;72/72px' ; //폰트 사이즈 설정입니다.
	config.startupFocus = false; //시작시 editor에 포커스 가는 여부 입니다. 마지막에 그린 에디터로 갑니다.
	
	//config.skin ="moono";
	
	config.allowedContent = true;
	config.pasteFromWordPromptCleanup = true;
	config.pasteFromWordRemoveFontStyles = false;
	config.pasteFromWordRemoveStyles = false;
	
	config.extraPlugins = 'pastefromexcel,pastefromword,resize,colordialog,tableresize,imageresizerowandcolumn';
	config.resize_dir = 'vertical';// both || vertical || horizontal
	config.toolbarStartupExpanded = false; // 툴바 접기
	 
	
	/*이미지업로드추가*/
	config.filebrowserUploadUrl      = '/to/moca/ckEditor/imageUpload.do?type=Files',
	config.filebrowserImageUploadUrl = '/to/moca/ckEditor/imageUpload.do?type=Images',
	config.filebrowserUploadMethod='form'; //파일 오류났을때 alert띄워줌
};
