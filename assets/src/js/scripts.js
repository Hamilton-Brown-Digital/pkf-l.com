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
			var scrollY = window.scrollY;
			$('body').addClass('jsModalActive').css('top', -scrollY + 'px');
			$('.customModal').addClass('jsModalActive');
		});

		$('.closeModal').click(function(e){
			e.preventDefault();
			var scrollY = parseInt($('body').css('top') || '0') * -1;
			$('body').removeClass('jsModalActive').css('top', '');
			window.scrollTo(0, scrollY);
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
					var contentSection = $(this);
					var contentElem = contentSection.find('.hero');
					var heightSection = contentSection.outerHeight(true);

					contentElem.attr('style', 'filter:blur(0px)');

					var scene = new ScrollMagic.Scene({
						triggerElement: this,
						triggerHook:0,
						offset:-heightHeader,
						duration:heightSection - heightHeader,
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
		function fnScrollMagicWhereDoesYourBusinessSit(){

			if( $('.WhereDoesYourBusinessSitContent').length ){
				$('.WhereDoesYourBusinessSitContent').each(function(i) {
					var contentSection = $(this);

					var animationDuration = contentSection.find('.animationDuration');

					var backgroundElem = contentSection.find('.background');
					var containerElem = contentSection.find('.container');
					var pinnedTitle = contentSection.find('.pinnedTitle');
					var pinnedText = contentSection.find('.pinnedText');
					var WhereDoesYourBusinessSitTile01Elem = contentSection.find('.WhereDoesYourBusinessSitTile01');
					var WhereDoesYourBusinessSitTile02Elem = contentSection.find('.WhereDoesYourBusinessSitTile02');
					var WhereDoesYourBusinessSitTile03Elem = contentSection.find('.WhereDoesYourBusinessSitTile03');

					var heightSection = contentSection.outerHeight(true);
					var animationDurationHeight = animationDuration.outerHeight(true);
					var containerElemHeight = containerElem.outerHeight(true);

					if(containerElemHeight <= (heightViewport - heightHeader)){

						WhereDoesYourBusinessSitTile01Elem.attr('style', 'filter:blur(50px); opacity:0; transform:translateX(-30vw) translateY(-80vh) scale(1.5);');
						WhereDoesYourBusinessSitTile02Elem.attr('style', 'filter:blur(50px); opacity:0; transform:translateX(20vw) translateY(-10vh) scale(1.5);');
						WhereDoesYourBusinessSitTile03Elem.attr('style', 'filter:blur(50px); opacity:0; transform:translateX(30vw) translateY(-70vh) scale(1.5);');

						pinnedTitle.attr('style', 'transform:scale(2); filter:blur(10px); opacity:0;');
						pinnedText.attr('style', 'opacity:0;');


						// Title
						var scene = new ScrollMagic.Scene({
							triggerElement: this,
							offset:animationDurationHeight / 8,
							duration:animationDurationHeight / 4,
							triggerHook:0.75,
						})
						// .setClassToggle('.pinnedTitle', 'jsPinned')
						.setTween(pinnedTitle, {opacity:1.0, filter:'blur(0px)', scale:1.0, ease: Linear.easeInOut})
						.addTo(ScrollMagicController)
						// .addIndicators({
						// 	name: 'title'
						// })


						// Text
						var scene = new ScrollMagic.Scene({
							triggerElement: this,
							offset:animationDurationHeight / 16,
							duration:animationDurationHeight / 16,
							triggerHook:0.3,
						})
						// .setClassToggle('.pinnedText', 'jsAnimate')
						.setTween(pinnedText, {opacity:1.0, ease: Linear.easeInOut})
						.addTo(ScrollMagicController)
						// .addIndicators({
						// 	name: 'text'
						// })

						// Tile01
						var scene = new ScrollMagic.Scene({
							triggerElement: this,
							offset:animationDurationHeight / 8,
							duration:animationDurationHeight / 4,
							triggerHook:0.75,
						})
						.setTween(WhereDoesYourBusinessSitTile01Elem, {x: '0%', y: '0%', opacity:1.0, filter:'blur(0px)', scale:1.0, ease: Linear.easeInOut})
						.addTo(ScrollMagicController)
						// .addIndicators({
						// 	name: 'tile01'
						// })

						// Tile02
						var scene = new ScrollMagic.Scene({
							triggerElement: this,
							offset:animationDurationHeight / 8,
							duration:animationDurationHeight / 4,
							triggerHook:0.75,
						})
						.setTween(WhereDoesYourBusinessSitTile02Elem, {x: '0%', y: '0%', opacity:1.0, filter:'blur(0px)', scale:1.0, ease: Linear.easeOut})
						.addTo(ScrollMagicController)
						// .addIndicators({
						// 	name: 'fnScrollMagicWhereDoesYourBusinessSit'
						// })

						// Tile03
						var scene = new ScrollMagic.Scene({
							triggerElement: this,
							offset:animationDurationHeight / 8,
							duration:animationDurationHeight / 4,
							triggerHook:0.75,
						})
						.setTween(WhereDoesYourBusinessSitTile03Elem, {x: '0%', y: '0%', opacity:1.0, filter:'blur(0px)', scale:1.0, ease: Linear.easeOut})
						.addTo(ScrollMagicController)
						// .addIndicators({
						// 	name: 'fnScrollMagicWhereDoesYourBusinessSit'
						// })

						// Pin Container
						var scene = new ScrollMagic.Scene({
							triggerElement: this,
							triggerHook:0,
							offset:0,
							duration:animationDurationHeight / 2,
						})
						.setPin('.pinnedContainer', {pushFollowers: false})
						.addTo(ScrollMagicController)
						// .addIndicators({
						// 	name: 'pin'
						// })
					}

					// Background
					var scene = new ScrollMagic.Scene({
						triggerElement: this,
						triggerHook:100,
						offset:0,
						duration:animationDurationHeight * 1.5,
					})
					.setTween(backgroundElem, {rotation: 20})
					.addTo(ScrollMagicController)
					// .addIndicators({
					// 	name: 'bg'
					// })
				});
			}


		}
		if( $(window).width() >= 1280){
			fnScrollMagicWhereDoesYourBusinessSit();
			console.log('1280');
		}

		// Phase
		function fnScrollMagicPhase(){

			// Parallax Background
			if( $('.jsPhaseActive .phaseElemBackground').length ){
				$('.jsPhaseActive .phaseElemBackground').each(function(i) {
					var contentSection = $(this);
					var backgroundElem = contentSection.find('.image');
					var heightSection = contentSection.outerHeight(true);

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

			// Parallax Shapes
			if( $('.jsPhaseActive .phaseShape01').length ){
				$('.jsPhaseActive .phaseShape01').each(function(i) {
					var contentSection = $(this);
					var backgroundElem = contentSection.find('.image');
					var heightSection = contentSection.outerHeight(true);

					// Title: Background
					var scene = new ScrollMagic.Scene({
						triggerElement: this,
						triggerHook:1.0,
						offset:0,
						duration:heightViewport + (heightSection * 2),
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
					var contentSection = $(this);
					var backgroundElem = contentSection.find('.image');
					var heightSection = contentSection.outerHeight(true);

					// Title: Background
					var scene = new ScrollMagic.Scene({
						triggerElement: this,
						triggerHook:1.0,
						offset:0,
						duration:heightViewport + (heightSection * 2),
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
					var contentSection = $(this);
					var backgroundElem = contentSection.find('.image');
					var heightSection = contentSection.outerHeight(true);

					// Title: Background
					var scene = new ScrollMagic.Scene({
						triggerElement: this,
						triggerHook:1.0,
						offset:0,
						duration:heightViewport + (heightSection * 2),
					})
					.setTween(backgroundElem, {y:'85%', ease: Linear.easeOut})
					.addTo(ScrollMagicController)
					// .addIndicators({
					// 	name: 'phaseShape03'
					// })
            		arrScrollMagicResetScenes.push(scene); // Push each scene into the array for resets
				});
			}

			// Pin Title
			/* if( $('.pinnedTitle').length ){
				var contentSection = $('.pinnedTitle');
				var pinnedElem = contentSection.find('.pinnedElem');
				var pinnedTrigger = contentSection.find('.pinnedTrigger');
				var pinnedDuration = contentSection.find('.pinnedDuration');
				var pinnedElemHeight = pinnedElem.outerHeight(true);
				var pinnedDurationHeight = pinnedDuration.outerHeight(true);

				console.log('pinnedElemHeight: ' + pinnedElemHeight);
				console.log('pinnedDurationHeight: ' + pinnedDurationHeight);

				var scene = new ScrollMagic.Scene({
					triggerElement: '.pinnedTrigger',
					duration:pinnedDurationHeight - pinnedElemHeight,
					triggerHook:0.5,
				})
				.setPin('.pinnedElem', {pushFollowers: false})
				.setClassToggle('.pinnedTitle', 'jsPinned')
				.addTo(ScrollMagicController)
				.addIndicators({
					name: 'pinnedTitle'
				})
			} */
		}
		fnScrollMagicPhase();

		// Contact Us
		function fnScrollMagicContactUs(){

			if( $('.contactusContent').length ){
				$('.contactusContent').each(function(i) {
					var contentSection = $(this);
					var backgroundElem = contentSection.find('.background span');
					var heightSection = contentSection.outerHeight(true);

					backgroundElem.attr('style', 'bottom:-5%;');

					// Background
					var scene = new ScrollMagic.Scene({
						triggerElement: this,
						triggerHook:0,
						offset:-heightSection,
						duration:heightSection * 2,
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