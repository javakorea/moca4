$(document).ready(function(){
	navAnimate(); //상단메뉴
	sideMenu(); //사이드메뉴
	lnbToggle(); // 슬라이드 토글버튼
	lnbNav();
});


//상단메뉴
function navAnimate() {
	var nav = $("nav");
	var line = $("<div />").addClass("line");

	line.appendTo(nav);

	var active = nav.find(".active");
	var pos = 0;
	var wid = 0;

	if(active.length) {
	  pos = active.position().left;
	  wid = active.width();
	  line.css({
		left: pos,
		width: wid
	  });
	}
	
	$(document).on("click", "nav ul li button", function(e) {
	  e.preventDefault();
	  if(!$(this).parent().hasClass("active") && !nav.hasClass("animate")) {
		
		//nav.addClass("animate");

		var _this = $(this);

		nav.find("ul li").removeClass("active");

		var position = _this.parent().position();
		var width = _this.parent().width();

		if(position.left >= pos) {
		  line.animate({
			width: ((position.left - pos) + width)
		  }, 0, function() {
			line.animate({
			  width: width,
			  left: position.left
			}, 0, function() {
			  nav.removeClass("animate");
			});
			_this.parent().addClass("active");
		  });
		} else {
		  line.animate({
			left: position.left,
			width: ((pos - position.left) + wid)
		  }, 0, function() {
			line.animate({
			  width: width
			}, 0, function() {
			  nav.removeClass("animate");
			});
			_this.parent().addClass("active");
		  });
		}

		pos = position.left;
		wid = width;
	  }
	});
}

// 사이드메뉴
function sideMenu() {
	
	$(document).on("click", ".moca_aside ul li", function() {

	}); 
}

// 슬라이드 토글버튼
function lnbToggle() {
	$('.moca_lnb_toggle').on('click', function() {
		if ($('.moca_container').hasClass('on')) {
			$('.moca_container').removeClass('on');
			$('.moca_header').removeClass('on');
			$('.moca_aside').removeClass('on');
			$('.moca_lnb_toggle > i').removeClass('fa-arrow-right');
			$('.moca_lnb_toggle > i').addClass('fa-arrow-left');
		} else {
			$('.moca_container').addClass('on');
			$('.moca_header').addClass('on');
			$('.moca_aside').addClass('on');
			$('.moca_lnb_toggle > i').removeClass('fa-arrow-left');
			$('.moca_lnb_toggle > i').addClass('fa-arrow-right');
		}
	});
}

// 사이드메뉴 네비게이션
function lnbNav() {
	$('.moca_tree.workmenu li').has('ul').addClass('hasChild');

	$('.moca_tree.workmenu li.hasChild.on > .moca_tree_tbx').next('ul').show();
	$('.moca_tree.workmenu li.hasChild > .moca_tree_tbx').on('click', function(){
		$(this).parent().toggleClass('on');
		$(this).next('ul').slideToggle('fast');
	});


	$('.moca_tree.workmenu li').not(':has("ul")').addClass('noChild');

	$('.moca_tree.workmenu li.noChild.on > .moca_tree_tbx').next('ul').show();
	$('.moca_tree.workmenu li.hasChild .moca_tree_tbx').on('click', function(){
		$('.moca_tree.workmenu li').removeClass('currnet');
		$(this).parent().addClass('currnet');
	});
}