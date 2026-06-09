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

			// Reset ScrollMagic scenes on click
			$.each(arrScrollMagicResetScenes, function(index, scene) {
				scene.destroy(true);
			});
			arrScrollMagicResetScenes = [];
			fnScrollMagicPhase();
			ScrollMagicController.update(true);
		});

		$('.resetPhase').click(function(e){
			// e.preventDefault();
			$('.phaseContainer').addClass('jsPhaseFadeOut');
			setTimeout(function(){
				$('.phaseContainer').removeClass('jsPhaseFadeOut');
				$('.phaseElem').removeClass('jsPhaseActive');
				$('.phaseContainer').removeClass('jsPhaseActive').attr('data-phase', '');
			}, 500);

			// Remove unused ScrollMagic scenes on click
			$.each(arrScrollMagicResetScenes, function(index, scene) {
				scene.destroy(true);
			});
			arrScrollMagicResetScenes = [];
		});

		// Get URL has and show selected element
		var urlHash = window.location.hash;
		if(urlHash === '#phase-1' || urlHash === '#phase-2' || urlHash === '#phase-3'){
			cleanHash = urlHash.replace('#','');

			// Get the data-phase-id from the relevant showPhase button
			phaseID = $('.showPhase[href="#' + cleanHash + '"]').attr('data-phase-id');

			// Show correct element
			$('.phaseElem').removeClass('jsPhaseActive');
			$('#' + phaseID).addClass('jsPhaseActive');
			$('.phaseContainer').addClass('jsPhaseActive').attr('data-phase', phaseID);

			// Scroll to the correct element
			setTimeout(function(){
				var target = $('#' + cleanHash);
				if(target.length){
					$('html, body').animate({
						scrollTop: target.offset().top
					});
				}
				// console.log('scrolly: ' + '#' + urlHash);
			}, 2000);
		}


	// ----- Carousel
	// ---------------------------------------------

		// Decision Roadmap
		var flickityCarouselElem = document.querySelectorAll('.flickityCarousel');
		if (flickityCarouselElem.length) {

			// Resize Flickity when it enters the viewport
			var observerOptions = {
				root: null, // use the viewport
				rootMargin: '0px',
				threshold: 0.05 // trigger as soon as 5% of the carousel is visible
			};
			var observer = new IntersectionObserver(function(entries, observer) {
				entries.forEach(function(entry) {
					if (entry.isIntersecting) {
						var flkty = Flickity.data(entry.target);
						if (flkty) {
							flkty.resize();
							// console.log('Flickity refreshed on viewport entry!');
						}
					}
				});
			}, observerOptions);


			flickityCarouselElem.forEach(function(el) {

				// Setup flickity
				var flickityCarousel = new Flickity(el, {
					draggable: '>1',
					groupCells: true,
					wrapAround: false,
					autoPlay: false,
					adaptiveHeight: false,
					cellSelector: '.slide',
					cellAlign: 'left',
					contain: false,
					percentPosition: true,
					fade: true,
					pageDots: false,
					prevNextButtons: true,
					arrowShape: '',
				});

				// Tell the observer to watch this specific carousel element
				observer.observe(el);

				// Resize fallback just in case
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
		var heightViewport = $(window).height();

		// Array to be used for reset states
		var arrScrollMagicResetScenes = [];

		// --- ANIMATIONS ------

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

					var scene = new ScrollMagic.Scene({
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
					var scene = new ScrollMagic.Scene({
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

					var scene = new ScrollMagic.Scene({
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
					var scene = new ScrollMagic.Scene({
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
		function fnScrollMagicPhase(){

			if( $('.jsPhaseActive .phaseElemBackground').length ){
				$('.jsPhaseActive .phaseElemBackground').each(function(i) {
					var contentContainer = $(this);
					var backgroundElem = contentContainer.find('.image');
					var heightContainer = contentContainer.outerHeight(true);

					// Title: Background
					var scene = new ScrollMagic.Scene({
						triggerElement: this,
						triggerHook:1.0,
						offset:0,
						duration:heightViewport * 2,
					})
					.setTween(backgroundElem, {y:'35%', ease: Linear.easeOut})
					.addTo(ScrollMagicController)
					// .addIndicators({
					// 	name: 'fnScrollMagicPhase'
					// })

            		arrScrollMagicResetScenes.push(scene); // Push each scene into the array for resets
				});
			}

			if( $('.jsPhaseActive .phaseShape01').length ){
				$('.jsPhaseActive .phaseShape01').each(function(i) {
					var contentContainer = $(this);
					var backgroundElem = contentContainer.find('.image');
					var heightContainer = contentContainer.outerHeight(true);

					// Title: Background
					var scene = new ScrollMagic.Scene({
						triggerElement: this,
						triggerHook:1.0,
						offset:0,
						duration:heightViewport + (heightContainer * 2),
					})
					.setTween(backgroundElem, {y:'-50%', ease: Linear.easeOut})
					.addTo(ScrollMagicController)
					// .addIndicators({
					// 	name: 'phaseShape01'
					// })
            		arrScrollMagicResetScenes.push(scene); // Push each scene into the array for resets
				});
			}

			if( $('.jsPhaseActive .phaseShape02').length ){
				$('.jsPhaseActive .phaseShape02').each(function(i) {
					var contentContainer = $(this);
					var backgroundElem = contentContainer.find('.image');
					var heightContainer = contentContainer.outerHeight(true);

					// Title: Background
					var scene = new ScrollMagic.Scene({
						triggerElement: this,
						triggerHook:1.0,
						offset:0,
						duration:heightViewport + (heightContainer * 2),
					})
					.setTween(backgroundElem, {y:'25%', ease: Linear.easeOut})
					.addTo(ScrollMagicController)
					// .addIndicators({
					// 	name: 'phaseShape02'
					// })
            		arrScrollMagicResetScenes.push(scene); // Push each scene into the array for resets
				});
			}

			if( $('.jsPhaseActive .phaseShape03').length ){
				$('.jsPhaseActive .phaseShape03').each(function(i) {
					var contentContainer = $(this);
					var backgroundElem = contentContainer.find('.image');
					var heightContainer = contentContainer.outerHeight(true);

					// Title: Background
					var scene = new ScrollMagic.Scene({
						triggerElement: this,
						triggerHook:1.0,
						offset:0,
						duration:heightViewport + (heightContainer * 2),
					})
					.setTween(backgroundElem, {y:'85%', ease: Linear.easeOut})
					.addTo(ScrollMagicController)
					// .addIndicators({
					// 	name: 'phaseShape03'
					// })
            		arrScrollMagicResetScenes.push(scene); // Push each scene into the array for resets
				});
			}
		}
		fnScrollMagicPhase();

		// Contact Us
		function fnScrollMagicContactUs(){

			if( $('.contactusContent').length ){
				$('.contactusContent').each(function(i) {
					var contentContainer = $(this);
					var backgroundElem = contentContainer.find('.background span');
					var heightContainer = contentContainer.outerHeight(true);

					backgroundElem.attr('style', 'bottom:-5%;');

					// Background
					var scene = new ScrollMagic.Scene({
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
	});