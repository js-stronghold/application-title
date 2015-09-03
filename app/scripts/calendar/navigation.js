define('navigation', ['jquery', 'underscore', 'handlebars', 'calendar/database', 'extensions/date'],
	function($, _, Handlebars, database) {
		$.fn.fillnavigation = function() {
			var $this = this;
			var logger = {
				logged: false,
				toMonthView: function(){
					//TODO
				}
			};

			var sorce = $('#navigation-template').html();
			var template = Handlebars.compile(sorce);

			var result = $(template(logger)).appendTo($this);

			//if(logger.logged)
			//{
			//	var logout = $this.('#logout').addClass('log');
			//} else {
			//	var login = $this.('#login').addClass('log');
			//}

		}
	});