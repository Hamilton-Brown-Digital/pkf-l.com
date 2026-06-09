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
			$('.phaseContainer').addClass('jsPhaseActive').attr('data-phase', phaseID);
		});

		$('.resetPhase').click(function(e){
			// e.preventDefault();
			$('.phaseContainer').addClass('jsPhaseFadeOut');
			setTimeout(function(){
				$('.phaseContainer').removeClass('jsPhaseFadeOut');
				$('.phaseElem').removeClass('jsPhaseActive');
				$('.phaseContainer').removeClass('jsPhaseActive').attr('data-phase', '');
			}, 500);
		});

		// Get URL has and show selected element
		var urlHash = window.location.hash;
		if(urlHash == '#phase-1' || urlHash == '#phase-2' || urlHash == '#phase-3'){
			urlHash = urlHash.replace('#','');

			// Get the data-phase-id from the relevant showPhase button
			phaseID = $('.showPhase[href="#' + urlHash + '"]').attr('data-phase-id');

			// Show correct element
			$('.phaseElem').removeClass('jsPhaseActive');
			$('#' + phaseID).addClass('jsPhaseActive');
			$('.phaseContainer').addClass('jsPhaseActive').attr('data-phase', phaseID);

			// Scroll to the correct element
			setTimeout(function(){
				$('html, body').animate({
					scrollTop: $('#' + urlHash).offset().top
				});
				console.log('scrolly: ' + '#' + urlHash);
			}, 2000);
		}


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


	// ----- ScrollMagic
	// ---------------------------------------------

		var ScrollMagicController = new ScrollMagic.Controller();

		var headerElem = $('header');
		var heightHeader = headerElem.outerHeight(true);


		// Generic: fade in sections when the trigger reaches 75% unless specified
		function fnScrollMagicFadeIn(){
			if( $('.animateFadeIn').length ){
				$('.animateFadeIn').each(function(i) {
					triggerHook = $(this).attr('data-trigger');
					if(!triggerHook){
						triggerHook = '0.75';
					}
					triggerOffset = $(this).attr('data-offset');
					if(!triggerOffset){
						triggerOffset = 0;
					}

					new ScrollMagic.Scene({
						triggerElement: this,
						triggerHook:triggerHook,
						offset:triggerOffset,
					})
					.setClassToggle(this, 'jsFadeIn')
					.addTo(ScrollMagicController)
					// .addIndicators({
					// 	name: 'fnScrollMagicFadeIn'
					// })
				});
			}
		}
		fnScrollMagicFadeIn();

		// Generic: trigger class on elem when it reaches 75% (compensate for 1rem)
		function fnScrollMagicElemTrigger(){

			if( $('.elemTrigger').length ){
				$('.elemTrigger').each(function(i) {
					heightElement = $(this).outerHeight() + 40;
					new ScrollMagic.Scene({
						triggerElement: this,
						triggerHook:0.75,
						offset:0,
						// duration:heightElement,
					})
					.setClassToggle(this, 'jsToggleElem')
					.addTo(ScrollMagicController)
					// .addIndicators({
					// 	name: 'elemTrigger'
					// })
				});
			}
		}
		fnScrollMagicElemTrigger();

		// Hero
		function fnScrollMagicHeroFade(){
			if( $('.heroContent').length ){
				$('.heroContent').each(function(i) {
					var contentContainer = $(this);
					var contentElem = contentContainer.find('.hero');
					var heightContainer = contentContainer.outerHeight(true);

					contentElem.attr('style', 'filter:blur(0px)');

					new ScrollMagic.Scene({
						triggerElement: this,
						triggerHook:0,
						offset:-heightHeader,
						duration:heightContainer - heightHeader,
					})
					.setTween(contentElem, {y: '50%', opacity:0, filter:'blur(40px)', scale:1.2, ease: 'power2.in'})
					.addTo(ScrollMagicController)
					// .addIndicators({
					// 	name: 'fnScrollMagicHeroFade'
					// })
				});
			}
		}
		fnScrollMagicHeroFade();

		// Who Is It For?
		function fnScrollMagicWhoIsItFor(){

			if( $('.whoisitforContent').length ){
				$('.whoisitforContent').each(function(i) {
					var contentContainer = $(this);
					var backgroundElem = contentContainer.find('.background');
					var heightContainer = contentContainer.outerHeight(true);

					// Background
					new ScrollMagic.Scene({
						triggerElement: this,
						triggerHook:100,
						offset:0,
						duration:heightContainer * 1.5,
					})
					.setTween(backgroundElem, {rotation: 20})
					.addTo(ScrollMagicController)
					// .addIndicators({
					// 	name: 'fnScrollMagicWhoIsItFor'
					// })
				});
			}
		}
		fnScrollMagicWhoIsItFor();

		// Phase
		// function fnScrollMagicPhase(){

		// 	if( $('.phaseElem .title').length ){
		// 		$('.phaseElem .title').each(function(i) {
		// 			var contentContainer = $(this);
		// 			var backgroundElem_title = contentContainer.find('.title .background');
		// 			// var backgroundElem_callout = contentContainer.find('.callout .background');
		// 			var heightContainer = contentContainer.outerHeight(true);

		// 			backgroundElem_title.attr('style', 'bottom:-5%;');

		// 			// Title: Background
		// 			new ScrollMagic.Scene({
		// 				triggerElement: this,
		// 				triggerHook:0,
		// 				offset:-heightContainer,
		// 				duration:heightContainer * 2,
		// 			})
		// 			.setTween(backgroundElem_title, {y:'-150%', ease: Linear.easeOut})
		// 			.addTo(ScrollMagicController)
		// 			.addIndicators({
		// 				name: 'fnScrollMagicPhase'
		// 			})
		// 		});
		// 	}
		// }
		// fnScrollMagicPhase();

		// Contact Us
		function fnScrollMagicContactUs(){

			if( $('.contactusContent').length ){
				$('.contactusContent').each(function(i) {
					var contentContainer = $(this);
					var backgroundElem = contentContainer.find('.background span');
					var heightContainer = contentContainer.outerHeight(true);

					backgroundElem.attr('style', 'bottom:-5%;');

					// Background
					new ScrollMagic.Scene({
						triggerElement: this,
						triggerHook:0,
						offset:-heightContainer,
						duration:heightContainer * 2,
					})
					.setTween(backgroundElem, {y:'-20%', ease: Linear.easeOut})
					.addTo(ScrollMagicController)
					// .addIndicators({
					// 	name: 'contactusContent'
					// })
				});
			}
		}
		fnScrollMagicContactUs();


		// Parallax Images
		function fnScrollMagicParallaxImage(){
			if( $('.parallaxImage').length ){
				$('.parallaxImage').each(function(i) {

					var heightWindow = $(window).height();
					var heightElement = $(this).outerHeight(true);
					var targetElement = $(this).find('img');
					triggerHook = $(this).attr('data-trigger');
					if(!triggerHook){
						triggerHook = '1.0';
					}
					triggerOffset = $(this).attr('data-offset');
					if(!triggerOffset){
						triggerOffset = 0;
					}
					scrollSpeed = $(this).attr('data-speed');
					if(!scrollSpeed){
						calculatedScrollSpeed = '-150%';
					}
                    else{
                        calculatedScrollSpeed = scrollSpeed * -100 + '%';
                    }

					var scene = new ScrollMagic.Scene({
						triggerElement: this,
						// duration: (heightWindow / scrollSpeed) + heightElement,
						duration: heightWindow + heightElement,
						// duration: heightWindow / scrollSpeed,
						triggerHook: triggerHook,
						offset:triggerOffset,
						reverse: true
					})
					.setTween(targetElement, {y: calculatedScrollSpeed, ease: Linear.easeOut})
					.addTo(ScrollMagicController)
					// .addIndicators({
					// 	name: 'parallax ' + $(this).attr('id')
					// })
				});

			}
		}
		fnScrollMagicParallaxImage();


	});