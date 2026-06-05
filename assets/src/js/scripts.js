/** ----- General Scripts for the site ----- **/


// Avoid `console` errors in browsers that lack a console
// -----------------------------------------------------------

	(function() {
		var method;
		var noop = function () {};
		var methods = [
			'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
			'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
			'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
			'timeStamp', 'trace', 'warn'
		];
		var length = methods.length;
		var console = (window.console = window.console || {});

		while (length--) {
			method = methods[length];

			// Only stub undefined methods.
			if (!console[method]) {
				console[method] = noop;
			}
		}
	}());


// $(document).ready: As we're enqueing script, encode jQuery so we can use $
// -------------------------------------------------------------------------------

	jQuery(document).ready(function($){


	// ----- Menu
	// ---------------------------------------------

		// Show mobile menu
		$('.showMenu').click(function(e){
			e.preventDefault();
			$('body').toggleClass('jsMenuActive');
			$('.customLandingPage_navigation').toggleClass('jsMenuActive');
			if ($(this).text() == 'Close'){
				$(this).text('Menu');
			}
			else{
				$(this).text('Close');
			}
		});

		// Hide mobile menu
		$('.hideMenu').click(function(e){
			e.preventDefault();
			$('body').removeClass('jsMenuActive');
			$('.customLandingPage_navigation').removeClass('jsMenuActive');
			$('.showMenu').text('Menu');
		});

		// Close mobile menu when you click items
		$('.anchorMenu a[href^="#"]').click(function(e){
			$('body').removeClass('jsMenuActive');
			$('.customLandingPage_navigation').removeClass('jsMenuActive');
			$('.showMenu').text('Menu');
		});

		// Highlight the current anchored sections as you scroll through them
		function fnHighlightCurrentSection(){
			const $menuLinks = $('.anchorMenu a[href^="#"]');
			let scrollTimeout;
			$(window).on('scroll', function() {
				if (!scrollTimeout) {
					scrollTimeout = setTimeout(function() {
						const triggerPoint = $(window).scrollTop() + ($(window).height() * 0.3);

						$menuLinks.each(function() {
							const cleanId = $(this).attr('href').replace('#', '');
							const $section = $('#section--' + cleanId);

							if ($section.length && triggerPoint >= $section.offset().top && triggerPoint < ($section.offset().top + $section.outerHeight())) {
								$menuLinks.removeClass('jsSectionActive');
								$(this).addClass('jsSectionActive');
							}
						});

						scrollTimeout = null;
					}, 50); // Checks positions every 50ms
				}
			});
		}
		fnHighlightCurrentSection();


	// ----- Modal
	// ---------------------------------------------

		$('.showModal').click(function(e){
			e.preventDefault();
			$('body').addClass('jsModalActive');
			$('.customModal').addClass('jsModalActive');
		});

		$('.closeModal').click(function(e){
			e.preventDefault();
			$('body').removeClass('jsModalActive');
			$('.customModal').removeClass('jsModalActive');
		});


	// ----- Phase
	// ---------------------------------------------

		$('.showPhase').click(function(e){
			// e.preventDefault();
			phaseID = $(this).attr('data-phase-id');
			$('.phaseElem').removeClass('jsPhaseActive');
			$('#' + phaseID).addClass('jsPhaseActive');
			$('.phaseContact').addClass('jsPhaseActive');
			$('.phaseContact').attr('data-phase', phaseID);

		});

		$('.resetPhase').click(function(e){
			// e.preventDefault();
			$('.phaseElem').removeClass('jsPhaseActive');
			$('.phaseContact').removeClass('jsPhaseActive');
			$('.phaseContact').attr('data-phase', '');
		});


	// ----- Carousel
	// ---------------------------------------------

		// Decision Roadmap
		var flickityCarouselElem = document.querySelectorAll('.flickityCarousel');
		if(flickityCarouselElem.length){
			flickityCarouselElem.forEach(function(el, index, list){
				// console.log(el);
				// console.log(index);

				// Create Carousel
				var flickityCarousel = new Flickity(el, {
					draggable: '>1',
					groupCells: true,
					wrapAround: false,
					autoPlay: false,
					adaptiveHeight: false,
					groupCells: true,

					cellSelector: '.slide',

					cellAlign: 'left',
					contain: false,
					percentPosition: true,

					fade:true,

					pageDots: false,
					prevNextButtons: true,
					arrowShape: 'M0,50L40.5,9.5l6.7,6.7l-30,30H100v9.4H18.9l28.2,28.2l-6.7,6.7L0,50z',
				});

				// Resize flickity after load to account for sizing errors on load
				setTimeout(function(){
					flickityCarousel.resize();
				}, 1000);
			});
		}


	});