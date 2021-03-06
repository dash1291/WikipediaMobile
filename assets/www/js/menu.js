
function setMenuItemState(action, state) {
	// Stupid iterator
	$.each(menu_items, function(i, item) {
		if(item.id == action) {
			item.disabled = !state;
		}
	});
	updateMenuState();
}

function setPageActionsState(state) {
	setMenuItemState("page-actions", state);
}

function getAboutVersionString() {
	return "3.1beta2";
}

var menu_items = [
	{
		id: 'go-back',
		action: chrome.goBack,
		disabled: true
	},
	{
		id: 'go-forward',
		action: chrome.goForward,
		disabled: true
	},
	{
		id: 'read-in',
		action:  languageLinks.showAvailableLanguages
	},
	{
		id: 'page-actions',
		action: function() {
			popupMenu([
				mw.msg('menu-savePage'),
				mw.msg('menu-share-twitter'),
				mw.msg('menu-share-ril'),
				mw.msg('menu-share-fb'),
				mw.msg('menu-cancel')
			], function(value, index) {
				if (index == 0) {
					savedPages.saveCurrentPage();
				} else if (index == 1) {
					shareTwitter();
				} else if (index == 2) {
					shareRIL();
				} else if (index == 3) {
					shareFB();
				}
			}, {
				cancelButtonIndex: 4,
				origin: this
			});
		}
	},
	{
		id: 'list-actions',
		action: function() {
			popupMenu([
				mw.msg('menu-nearby'),
				mw.msg('menu-savedPages'),
				mw.msg('menu-history'),
				mw.msg('menu-cancel')
			], function(val, index) {
				if (index == 0) {
					geo.showNearbyArticles();
				} else if (index == 1) {
					savedPages.showSavedPages();
				} else if (index == 2) {
					appHistory.showHistory();
				}
			}, {
				cancelButtonIndex: 3,
				origin: this
			});
		}
	},
	{
		id: 'view-settings',
		action: appSettings.showSettings
	}
];

function updateMenuState() {
	$('#menu').remove();
	var $menu = $('<div>');
	$menu
		.attr('id', 'menu')
		.appendTo('body');

	$.each(menu_items, function(i, item) {
		var $button = $('<button>');
		$button
			.attr('id', item.id)
			.attr('title', mw.msg(item.id));
		if(item.disabled) {
			$button.addClass("disabled");
		} else {
			$button.click(function() {
				item.action.apply(this);
			});
		}
		$button.append('<span>')
			.appendTo($menu);
	});
};

// Default emulation, override with platform-specific menu popups
function popupMenu(items, callback, options) {
	options = $.extend({destructiveButtonIndex: null, cancelButtonIndex: null}, options || {});

	var $bg = $('<div class="actionsheet-bg"></div>').appendTo('body'),
		$sheet = $('<div class="actionsheet"></div>').appendTo('body');
	$.each(items, function(index, label) {
		var $button = $('<button>')
			.text(label)
			.appendTo($sheet)
			.click(function() {
				$sheet.remove();
				$bg.remove();
				callback(label, index);
			});
		if (index === options.destructiveButtonIndex) {
			$button.addClass('destructive');
		}
		if (index === options.cancelButtonIndex) {
			$button.addClass('cancel');
		}
	});
}

