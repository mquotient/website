var sectionHeight = 600;

function resizePages() {
	var h = $(window).height();
	sectionHeight  =  h < 600 ? 600 : h;
	
	// Each sections height
	$('section#cover').css('height',sectionHeight);
	$('section').css('min-height',sectionHeight);
	$('.wrapper:not(:last-child)').each(function () {
		$(this).css('min-height',$(this).closest('section').height() - 100);
	});

	$('.wrapper:last-child').each(function () {
		$(this).css('min-height',$(this).closest('section').height());
	});

	// Home Page height adjust
	var bodyFontSize = $('body').css('font-size').slice(0,2),
		mquotientFontSize = bodyFontSize * 8;
	$('#covercontainer h1').css('padding-top',sectionHeight/2 - (mquotientFontSize * 1.3));
	$('#covercontainer .navcontainer').css('padding-top',sectionHeight / 2 + 10);


	// Make map full of height
	var $contactUsContainer = $('#contactuscontainer');
	$('#map').height($('#map').height() + $contactUsContainer.parent().height() - $contactUsContainer.height());
}

$(window).load(function() {
	// Make content of each section vertically center

	if(navigator.appName.indexOf("Internet Explorer") == -1) {
		$('.card').height($('.custom-profile-image').height());

		// IE tag Hacks are not working
		var styleForNonIE = '.flip {' +
		'      -webkit-perspective: 800;' +
		'      -moz-perspective: 800;' +
		'      -ms-perspective: 800;' +
		'      -o-perspective: 800;' +
		'      perspective: 800;' +
		'      position: relative;' +
		'    }' +
		'    .flip .card.flipped {' +
		'      -webkit-transform: rotatey(-180deg);' +
		'      -moz-transform: rotatey(-180deg);' +
		'      -ms-transform: rotatey(-180deg);' +
		'      -o-transform: rotatey(-180deg);' +
		'      transform: rotatey(-180deg);' +
		'    }' +
		'    .flip .card {' +
		'        width: 100%;' +
		'        height: 100%;' +
		'        -webkit-transform-style: preserve-3d;' +
		'        -moz-transform-style: preserve-3d;' +
		'        -ms-transform-style: preserve-3d;' +
		'        -o-transform-style: preserve-3d;' +
		'        transform-style: preserve-3d;' +
		'        -webkit-transition: 0.5s;' +
		'        -moz-transition: 0.5s;' +
		'        -ms-transition: 0.5s;' +
		'        -o-transition: 0.5s;' +
		'        transition: 0.5s;' +
		'    }' +
		'    .flip .card .face {' +
		'      width: 100%;' +
		'      height: 100%;' +
		'      position: absolute;' +
		'      -webkit-backface-visibility: hidden ;' +
		'      -moz-backface-visibility: hidden ;' +
		'      -ms-backface-visibility: hidden ;' +
		'      -o-backface-visibility: hidden ;' +
		'      backface-visibility: hidden ;' +
		'      z-index: 2;' +
		'    }' +
		'    .flip .card .front {' +
		'      position: absolute;' +
		'      z-index: 1;' +
		'        color: white;' +
		'        cursor: pointer;' +
		'    }' +
		'    .flip .card .back {' +
		'      -webkit-transform: rotatey(-180deg);' +
		'      -moz-transform: rotatey(-180deg);' +
		'      -ms-transform: rotatey(-180deg);' +
		'      -o-transform: rotatey(-180deg);' +
		'      transform: rotatey(-180deg);' +
		'      color: black;' +
		'      cursor: pointer;' +
		'    }';

    	$('.fixCss').append(styleForNonIE);
	}

	$('section:not(:first,:last, #team, #about)').each(function(){
		var remainingSpace = $('#' + this.id + ' .wrapper').height() - $('#' + this.id + 'container').height(),
			marginTop = remainingSpace / 2;

			$('#' + this.id + 'container').css('margin-top', marginTop + 'px');
	});

});

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
		if($(this).hasClass('nav-item')) {
			hideMenu();
		}

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

	var $navItem = $('.nav-item');

	function hideMenu() {
		$navItem.each(function () {
			$(this).removeClass('shown');
		});
		$("#floating-menu .menu-btn").removeClass('shown');
	}

	function showMenu() {
		$navItem.each(function () {
			$(this).addClass('shown');
		});
		$("#floating-menu .menu-btn").addClass('shown');
	}

	menuBtn = document.getElementById("menu-btn");
	menuBtn.onclick = function() {
		if($navItem.first().hasClass('shown')) {
			hideMenu();
		}
		else {
			showMenu();			
		}
	}

	//resize
	$(window).resize(function(e) {
		resizePages();
	});

	resizePages();

	//scroll
	$(window).scroll(_.throttle(function(e){
        var top = $(document).scrollTop();
		var wHeight = Math.max(640,$(window).height());
		// Shift navigation element to top
		if(top >= (sectionHeight / 2 + $('.navcontainer').height())) {
			

			if($(window).width() <= 768) {
				$("#floating-menu").fadeIn();
			}
			else {
				$('#footer').css({
					opacity: 1,
					top: 0
				});
			}
		}
		else {
			if($(window).width() <= 768) {
				$("#floating-menu").fadeOut();
			}
			else {
				$('#footer').css({
					opacity: 0,
					top: -30
				});
			}			
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
    }, 100));

	if($(window).width() <= 768) {
		$("#floating-menu").hide();
	}
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

	var contentString = '<div>'+
		'<address>' +
		'	<strong><span class="m">m</span><span class="q">quotient</span></strong>' +
		'	<br>' +
		'	407/ Building 2, ' +
		'	<br>' +
		'	Gera Gardens Condominium,' +
		'	<br>' +
		'	7-A Koregaon Park,' +
		'	<br>' +
		'	North Main Road, ' +
		'	<br>' +
		'	Pune - 411001' +
		'	<br>' +
		'	Landmark: St. Mira College' +
		'	<br>' +
		'	<span>P:</span>' +
		'	+ 91 (020) 4120 4763' +
		'	<br>' +
		'	<a target="_blank" href="http://maps.google.com/maps?ll=18.535611,73.885682&amp;z=18&amp;t=m&amp;hl=en&amp;mapclient=apiv3" title="Click to see this area on Google Maps"><i class="icon-map-marker" style="vertical-align: sub;margin-left: -3px;"></i> View it on Map </a>' +
		'</address>' +
		'</div>';

	var infowindow = new google.maps.InfoWindow({
		content: contentString
	});

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.open(map,marker);
	});

	google.maps.event.addListenerOnce(map, 'idle', function(){
		$('.gmnoprint:last').remove();
		$('.gmnoprint:first').remove();
		$('.gmnoprint:first').remove();
	});
}

function loadScript() {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAFWFw3Rdf7fBuvwo4DTUV2DcTD5W7tBWc&sensor=true&callback=initialize";
  document.body.appendChild(script);
}

window.onload = loadScript;
