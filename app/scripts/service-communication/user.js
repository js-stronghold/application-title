define([
	'./database-link',
	'./request',
	'interface/notifications',
	'calendar/calendar',
	'jquery'
], function(DB, request, notify, calendar, $) {
	var CONSOLE_STYLE_GOOD = 'color: green',
		CONSOLE_STYLE_HEAD = 'color: blue; font-weight: bold',
		CONSOLE_STYLE_BAD = 'color: red',
		CONSOLE_STYLE_FYI = 'color: #AEB2D0; font-style: italic';

	var isLoggedIn = false,
		username = null,
		user = {},
		initPromise = init();	

	function updateInformation(newInformation) {
		isLoggedIn = true;
		username = newInformation.DisplayName;
		console.log('%cUser information updated', CONSOLE_STYLE_FYI);
	}

	function init() {
		return request.GET('Users/me', {
				authorisation: 'Bearer ' + localStorage.getItem('access_token')
			})
			.then(function(res) {
				console.log('%cUser Init...', CONSOLE_STYLE_HEAD);
				return updateInformation(res);
			})
			.then(function() {
				console.log('%cLoading Database', CONSOLE_STYLE_FYI);
				return DB.downloadFromCloud();
			})
			.then(function() {
				console.log('%cResetting calendar information', CONSOLE_STYLE_FYI);
				return calendar.resetContent();
			})
			.then(function() {
				console.log('%c...User Init Successful', CONSOLE_STYLE_HEAD);
			})
			.catch(function(err) {
				console.log(err);
			});
	}

	function switchLoggedState() {
		if (!isLoggedIn || !username) {
			init();
		} else {
			console.log('%cUser signed off', CONSOLE_STYLE_FYI);
			isLoggedIn = false;
			username = null;
		}
	}

	Object.defineProperties(user, {
		username: {
			get: function() {
				return username;
			},
			enumerable: true
		},

		isLoggedIn: {
			get: function() {
				return isLoggedIn;
			},
			enumerable: true
		},

		init: {
			value: init,
			enumerable: true
		},

		initPromise: {
			get: function() {
				return initPromise;
			},
			enumerable: true
		},

		switchLoggedState: {
			value: switchLoggedState,
			enumerable: true
		}
	});

	return user;
});