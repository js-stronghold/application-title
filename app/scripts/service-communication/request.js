define(['jquery', 'underscore'], function($, _) {
	var apiKey = '6xPucpp6M25LHsGZ',
		baseWebURL = 'http://api.everlive.com/v1/' + apiKey + '/';

	function get(address, options) {
		var promise = new Promise(function(resolve, reject) {
			$.ajax({
				url: baseWebURL + address,
				method: 'GET',
				contentType: options.contentType || 'application/json',

				headers: filterHeaders(options),

				data: JSON.stringify(options.data) || '',

				success: function(res) {
					resolve(res.Result);
				},
				error: function(err) {
					reject(err);
				}
			});
		});

		return promise;
	}

	function post(address, options) {
		var promise = new Promise(function(resolve, reject) {
			$.ajax({
				url: baseWebURL + address,
				method: 'POST',
				contentType: options.contentType || 'application/json',

				headers: filterHeaders(options),

				data: JSON.stringify(options.data),

				success: function(res) {
					resolve(res.Result);
				},
				error: function(err) {
					reject(err);
				}
			});
		});

		return promise;
	}

	function put(address, options) {
		var promise = new Promise(function(resolve, reject) {
			$.ajax({
				url: baseWebURL + address,
				method: 'PUT',
				contentType: options.contentType || 'application/x-www-form-urlencoded; charset=UTF-8',
				
				headers: filterHeaders(options),

				data: JSON.stringify(options.data),

				success: function(res) {
					resolve(res.Result);
				},

				error: function(err) {
					reject(err);
				}
			});
		});

		return promise;
	}

	function deleteContent(address, options) {
		var promise = new Promise(function(resolve, reject) {
			$.ajax({
				url: baseWebURL + address,
				method: 'DELETE',
				contentType: options.contentType || 'application/json',

				headers: filterHeaders(options),

				success: function(res) {
					resolve(res.Result);
				},

				error: function(err) {
					reject(err);
				}
			});
		});

		return promise;
	}

	function head(address, options) {
		var promise = new Promise(function(resolve, reject) {
			$.ajax({
				url: baseWebURL + address,
				method: 'HEAD',
				contentType: options.contentType || 'application/x-www-form-urlencoded; charset=UTF-8',
				
				headers: filterHeaders(options),

				success: function(res) {
					resolve(res);
				},

				error: function(err) {
					console.log(err);
					reject(err);
				}
			});
		});

		return promise;
	}

	function filterHeaders(options) {
		var headers = {};

		if (options.authorisation) {
			headers['Authorization'] = options.authorisation;
		}

		if (options.fields) {
			headers['X-Everlive-Fields'] = JSON.stringify(options.fields);
		}

		if (options.filter) {
			headers['X-Everlive-Filter'] = JSON.stringify(options.filter);
		}

		return headers;
	}


	return {
		GET: get,
		POST: post,
		PUT: put,
		DELETE: deleteContent,
		HEAD: head

	};
});