var scrollElement = 'html, body';
var minSectionHeight = 500;
var menuHeight = $("#menu").innerHeight();
var logoHeight = $("#logo").height();

function resizePages() {
	var h = $(window).height();
	minSectionHeight  =  h < minSectionHeight ? minSectionHeight : h;

	// Each sections height
	$('section#cover').css('height', minSectionHeight);
	$('section#cover .wrapper').css('min-height', minSectionHeight);

	$('section').css('min-height', minSectionHeight - menuHeight);
	$('.section .wrapper').each(function () {
		$(this).css('min-height', minSectionHeight - menuHeight);
	});

	// Height adjust on cover page
	$('#logo').css('padding-top', minSectionHeight / 2 - logoHeight);
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
	var newTop = sectionTag.offset().top - menuHeight;

	$(scrollElement).stop().animate({
		'scrollTop': newTop
	}, 300, 'swing');

	// if it is map section initialize map
	if (sectionId === "contactus") {
		initializeMaps();
	}
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
	// Adjust the map container height
	var sectionWrapper = $("#contactus .wrapper");
	var sectionWrapperHeight = sectionWrapper.height();
	var blankSpaceHeight = sectionWrapperHeight - sectionWrapper.children().height();

	$("#map").height($("#map").height() + blankSpaceHeight);

	if (typeof google === "undefined") {
		loadMaps();
		return;
	}

	renderMaps();
}

function renderMaps () {
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
	if (typeof google !== "undefined") return;
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAFWFw3Rdf7fBuvwo4DTUV2DcTD5W7tBWc&sensor=true&callback=renderMaps";
	document.body.appendChild(script);
}