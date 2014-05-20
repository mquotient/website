var sectionHeight = 600;

function resizePages() {
	var h = $(window).height();
	sectionHeight  =  h < 600 ? 600 : h;

	// Each sections height
	$('section#cover').css('height', sectionHeight);
	$('section').css('min-height', sectionHeight);
	$('.wrapper:not(:last-child)').each(function () {
		$(this).css('min-height', $(this).closest('section').height() - 100);
	});

	$('.wrapper:last-child').each(function () {
		$(this).css('min-height', $(this).closest('section').height());
	});

	// Home Page height adjust
	var bodyFontSize = $('body').css('font-size').slice(0, 2);
	var mquotientFontSize = bodyFontSize * 8;
	$('#covercontainer h1').css('padding-top', sectionHeight / 2 - (mquotientFontSize * 1.3));
	$('#covercontainer .navcontainer').css('padding-top', sectionHeight / 2 + 10);


	// Make map full of height
	var $contactUsContainer = $('#contactuscontainer');
	$('#map').height($('#map').height() + $contactUsContainer.parent().height() - $contactUsContainer.height());
}

$(window).load(function () {
	$('section:not(:first,:last, #team, #about)').each(function () {
		var remainingSpace = $('#' + this.id + ' .wrapper').height() - $('#' + this.id + 'container').height(),
			marginTop = remainingSpace / 2;

		$('#' + this.id + 'container').css('margin-top', marginTop + 'px');
	});

});

$(document).ready(function () {
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
	$(".down a, .goTo").click(function (event) {
		if ($(this).hasClass('nav-item')) {
			hideMenu();
		}

		event.preventDefault();

		var target = this.hash,
			$target = $(target);

		$(scrollElement).stop().animate({
			'scrollTop': $target.offset().top
		}, 300, 'swing', function () {
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

	var menuBtn = document.getElementById("menu-btn");

	menuBtn.onclick = function () {
		if ($navItem.first().hasClass('shown')) {
			hideMenu();
		}
		else {
			showMenu();
		}
	};

	//resize
	$(window).resize(function () {
		resizePages();
	});

	resizePages();

	//scroll
	$(window).scroll(_.throttle(function () {
        var top = $(document).scrollTop();
		// Shift navigation element to top
		if (top >= (sectionHeight / 2 + $('.navcontainer').height())) {
			if ($(window).width() <= 768) {
				$("#floating-menu").fadeIn();
			} else {
				$('#menu').css({
					opacity: 1,
					top: -1
				});
			}
		}
		else {
			if ($(window).width() <= 768) {
				$("#floating-menu").fadeOut();
			}
			else {
				$('#menu').css({
					opacity: 0,
					top: -30
				});
			}
		}

		$('section:not(:last)').each(function () {
			if ((pageYOffset + 200) >= this.offsetTop && (pageYOffset + 200) < $(this).next()[0].offsetTop) {
				var self = this;
				$('#menu li a:not(:first)').each(function () {
					if ($(this).data('id') == self.id) {
						$('#menu .active').removeClass('active').parent().removeClass('active');
						$(this).addClass('active').parent().addClass('active');
					}
				});
			}
		});

		if ((pageYOffset + 200) > $('section:last')[0].offsetTop) {
			$('#menu .active').removeClass('active').parent().removeClass('active');
			$('#menu a[data-id="contactus"]').addClass('active').parent().addClass('active');
		}
    }, 100));

	if ($(window).width() <= 768) {
		$("#floating-menu").hide();
	}
});

// Load Google Maps
function initializeMaps() {
	var ourLocation = new google.maps.LatLng(18.53585, 73.885988);
	var mapOptions = {
		zoom: 13,
		center: ourLocation,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("map"), mapOptions);

	var marker = new google.maps.Marker({
		map: map,
		position: ourLocation
	});

	var contentString = $("#googleMapsTemplate").html();

	var infowindow = new google.maps.InfoWindow({
		content: contentString
	});

	google.maps.event.addListener(marker, 'click', function () {
		infowindow.open(map, marker);
	});

	google.maps.event.addListenerOnce(map, 'idle', function () {
		$('.gmnoprint:last').remove();
		$('.gmnoprint:first').remove();
		$('.gmnoprint:first').remove();
	});
}

function loadMaps() {
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAFWFw3Rdf7fBuvwo4DTUV2DcTD5W7tBWc&sensor=true&callback=initializeMaps";
	document.body.appendChild(script);
}

window.onload = loadMaps;
