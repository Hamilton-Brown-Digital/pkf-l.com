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


	// ----- Modal
	// ---------------------------------------------

		$('.showModal').click(function(e){
			e.preventDefault();
			$('.customModal').addClass('jsModalActive');

		});

		$('.closeModal').click(function(e){
			e.preventDefault();
			$('.customModal').removeClass('jsModalActive');
		});


	// ----- Phase
	// ---------------------------------------------

		$('.showPhase').click(function(e){
			e.preventDefault();
			phaseID = $(this).attr('data-phase-id');
			$('#' + phaseID).addClass('jsPhaseActive');
			$('.phaseContact').addClass('jsPhaseActive');

		});

		$('.resetPhase').click(function(e){
			e.preventDefault();
			$('.phaseElem').removeClass('jsPhaseActive');
			$('.phaseContact').removeClass('jsPhaseActive');
		});


	});