define('home-page', ['jquery', 'underscore', 'interface/search', 'calendar/calendar'],
	function($, _, searchFunction) {
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

				var calendar = $('<div />')
					.attr({
						id: 'calendar-container'
					})
					.calendar();

				var mainContainer = $(selector)
					.append(quoteHeader)
					.append(calendar);

				quoteHeader.hide({
					duration: 10000
				});

				searchFunction();	
			}
		};
	});