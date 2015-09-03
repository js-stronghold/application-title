define('home-page', ['jquery', 'underscore', 'calendar/calendar'],
	function($, _) {
		return {
			openHomePage: function(selector) {
				var quotes = [
					"Managing your time without setting priorities is like shooting randomly and calling wherever you hit the target. - Peter Turla",
					"All time management begins with planning. - Tom Greening",
					"Until we can manage time we can manage nothing else. - Unknown",
					"Most of us spend too much time on what is urgent and not enough time on what is important. - Stephen Covey",
					"Time is what we want most but what we use worst. - William Penn",
					"Lack of direction, not lack of time is the problem.We all have twenty-four hour days. - Zig Ziglar",
					"You spend too much time thinking about a thing, you'll never get it done. - Bruce Lee",
					"Don't be a time manager, be a priority manager. Cut your major goals into bite-slized pices. Each small priority or requirement on the way to ultimate doal become a mini goal in itself. - Denis Watley"
				];

				var quoteHeader = $('<div />')
					.html(quotes[Math.floor(Math.random() * quotes.length)])
					.css({
						'color': '#FFFFFF',
						'margin': '0 auto',
						'font-width': '20',
						'text-align': 'center'
					});

				var miniCalendar = $('<div />')
					.attr('id', 'calendar-container')
					.css({
						'width': '200px',
						'margin': '0 auto',
						'text-align': 'center'
					})
					.click(function() {
						$.remove(quoteHeader);
						$('#calendar-container').css({
							'width': '500px'
						});
					});

				miniCalendar.calendar();

				var mainContainer = $(selector)
					.css({
						'background': '#ED1C24'
					})
					.append(quoteHeader)
					.append(miniCalendar);
			}
		};

	});