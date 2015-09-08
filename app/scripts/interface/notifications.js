define(['jquery'], function($) {
	var $notificationBox = $('#notfications-container');

	function printError(err) {
		printNotification(err, 'text bg-danger text-danger center-block big ui-corner-all');
	}

	function printWarrning(warn) {
		printNotification(warn, 'text bg-warning text-warning center-block big ui-corner-all');
	}

	function printSuccess(good) {
		printNotification(good, 'text bg-success text-success center-block big ui-corner-all');
	}

	function printNotification(content, notifyClass) {
		var message;

		if (content.message) {
			message = content.message;
		} else if (content.responseJSON) {
			message = content.responseJSON.message;
		} else if (typeof(content) === 'string') {
			message = content;
		} else {
			throw new Error('printWarrning received unknown value: ' + content);
		}

		$notificationBox
			.finish()
			.removeClass()
			.addClass(notifyClass)
			.text(message)
			.fadeIn(250)
			.fadeOut(7250);
	}

	return {
		printError: printError,
		printWarrning: printWarrning,
		printSuccess: printSuccess
	};
});