var scrollElement = 'html, body';
var minSectionHeight = 600;
var menuHeight = 60;
var downButtonHeight = 80;

function resizePages() {
	var h = $(window).height();
	minSectionHeight  =  h < minSectionHeight ? minSectionHeight : h;

	// Each sections height
	$('section#cover').css('height', minSectionHeight);
	$('section#cover .wrapper').css('min-height', minSectionHeight);

	$('section').css('min-height', minSectionHeight - menuHeight);
	$('.section .wrapper').each(function () {
		if (this.parentElement.id === "contactus") {
			// Map section wrapper
			$(this).css('min-height', minSectionHeight - menuHeight);
		} else {
			// Other section wrappers excluding cover page
			$(this).css('min-height', minSectionHeight - (downButtonHeight + menuHeight));
		}
	});

	// Height adjust on cover page
	var bodyFontSize = $('body').css('font-size').slice(0, 2);
	var mquotientFontSize = bodyFontSize * 8;
	$('#logo').css('padding-top', minSectionHeight / 2 - (mquotientFontSize * 1.3));
	$('#menu').css('top', minSectionHeight / 2 + 10);

	// Make map full of height
	var $contactUsContainer = $('#contactuscontainer');
	$('#map').height($('#map').height() + $contactUsContainer.parent().height() - $contactUsContainer.height());
}

function goToSection (url) {
	var sectionId = url.split("#")[1];

	if (!sectionId) return;

	var sectionTag = $('section#' + sectionId);
	sectionTag.removeClass('hide');
	var newTop = sectionTag.offset().top - 60;

	$(scrollElement).stop().animate({
		'scrollTop': newTop
	}, 300, 'swing', function () {
		window.location.hash = sectionId;
	});
}

$(window).scroll(_.throttle(function () {
    var top = $(document).scrollTop();
	// Shift navigation element to top
	if (top >= (minSectionHeight / 2)) {
		$("#menu").attr("active", "section");
	} else {
		$("#menu").removeAttr("active");
	}
}, 100));

$(document).ready(function () {
	$('html, body').each(function () {
		var initScrollTop = $(this).attr('scrollTop');
		$(this).attr('scrollTop', initScrollTop + 1);
		if ($(this).attr('scrollTop') == initScrollTop + 1) {
			scrollElement = this.nodeName.toLowerCase();
			$(this).attr('scrollTop', initScrollTop);
			return false;
		}
	});

	window.onhashchange = function(event) {
		event.preventDefault();

		$('.section').addClass('hide');
		goToSection(event.newURL);
	};

	$(".goToSection").on('click', function(event) {
		if (window.location.href === event.target.href) {
			goToSection(window.location.href);
			event.preventDefault();
		}
	});

	//resize
	$(window).resize(function () {
		resizePages();
	});

	resizePages();

	goToSection(window.location.href);
});

// Load Google Maps
function initializeMaps() {
	var ourLocation = new google.maps.LatLng(18.53585, 73.885988);
	var isTouchDevice = 'ontouchstart' in document.documentElement;
	var mapOptions = {
		zoom: 13,
		center: ourLocation,
		draggable: !isTouchDevice,	// Don't allow dragging on touch devices
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("map"), mapOptions);

	var marker = new google.maps.Marker({
		map: map,
		position: ourLocation
	});

	var contentString = $("#addressTemplate").html();

	var infowindow = new google.maps.InfoWindow({
		content: contentString
	});

	google.maps.event.addListener(marker, 'click', function () {
		infowindow.open(map, marker);
	});
}

function loadMaps() {
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAFWFw3Rdf7fBuvwo4DTUV2DcTD5W7tBWc&sensor=true&callback=initializeMaps";
	document.body.appendChild(script);
}

window.onload = loadMaps;