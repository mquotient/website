var sectionHeight = 600;

function resizePages() {
	var h = $(window).height();
	sectionHeight  =  h < 600 ? 600 : h;
	
	// Each sections height
	$('section#cover').css('height',sectionHeight);
	$('section').css('min-height',sectionHeight);
	$('.wrapper').each(function () {
		$(this).css('min-height',$(this).closest('section').height() - 100);
	});

	// Home Page height adjust
	var bodyFontSize = $('body').css('font-size').slice(0,2),
		mquotientFontSize = bodyFontSize * 8;
	$('#covercontainer h1').css('padding-top',sectionHeight/2 - (mquotientFontSize * 1.3));
	$('#covercontainer .navcontainer').css('padding-top',sectionHeight/2 + 10);

	// Flip Images height and width
	$('.front .pad').each(function () {
		var $frontPad = $(this),
			$backPad = $(this).closest('.panel').find('.back .pad');
		if($frontPad.height() > $backPad.height()) {
			$backPad.height($frontPad.height());
			$(this).closest('.custom-profile').height($frontPad.height());
		}
		else {
			$frontPad.height($backPad.height());
			$(this).closest('.custom-profile').height($backPad.height());
		}
	});

	// Contact Us adjustment for bigger screen
	if($(window).width() >= 768) {
		$('.span8.custom-span').height($('.span4.custom-span').height()-32);
	}
}


$(document).ready(function() {

	var scrollElement = 'html, body';
	$('html, body').each(function () {
		var initScrollTop = $(this).attr('scrollTop');
		$(this).attr('scrollTop', initScrollTop + 1);
		if ($(this).attr('scrollTop') == initScrollTop + 1) {
			scrollElement = this.nodeName.toLowerCase();
			$(this).attr('scrollTop', initScrollTop);
			return false;
		}    
	});
	$(".down a, .goTo").click(function(event) {
		event.preventDefault();
		
		var $this = $(this),
		target = this.hash,
		$target = $(target);
		
		$(scrollElement).stop().animate({
			'scrollTop': $target.offset().top
		}, 300, 'swing', function() {
			window.location.hash = target;
		});
	});

	//resize
	$(window).resize(_.throttle(function(e) {
		resizePages();
	}));

	resizePages();

	//scroll
	$(window).scroll(_.throttle(function(e){
        var top = $(document).scrollTop();
		var wHeight = Math.max(640,$(window).height());
		// Shift navigation element to top
		if(top >= (sectionHeight / 2 + $('.navcontainer').height())) {
			$('#footer').css({
				opacity: 1,
				top: 0
			});
		}
		else {
			$('#footer').css({
				opacity: 0,
				top: -30
			});
		}

		$('section:not(:last)').each(function () {
			if((pageYOffset + 200) >= this.offsetTop && (pageYOffset + 200) < $(this).next()[0].offsetTop) {
				var self = this;
				$('#footer li a:not(:first)').each(function(){
					if($(this).data('id') == self.id) {
						$('#footer .active').removeClass('active').parent().removeClass('active');	
						$(this).addClass('active').parent().addClass('active');	
					}
				});
			}
		});

		if((pageYOffset + 200) > $('section:last')[0].offsetTop) {
			$('#footer .active').removeClass('active').parent().removeClass('active');	
			$('#footer a:last').addClass('active').parent().addClass('active');	
		}
    }, 300));
});

// Load Google Maps
function initialize() {
	var ourLocation = new google.maps.LatLng(18.53585,73.885988);
	var mapOptions = {
		zoom: 13,
		center: ourLocation,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	var map = new google.maps.Map(document.getElementById("map"), mapOptions);
	
	var marker = new google.maps.Marker({
		map:map,
		position: ourLocation
	});
}

function loadScript() {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAFWFw3Rdf7fBuvwo4DTUV2DcTD5W7tBWc&sensor=true&callback=initialize";
  document.body.appendChild(script);
}

window.onload = loadScript;