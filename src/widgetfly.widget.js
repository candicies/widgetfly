Widgetfly.Widget = (function(global) {'use strict';
	// Widget
	// -------------
	var Widget = function() {
		this.id = Widgetfly.Utils.uniqueId('widget');
	};

	Widgetfly.Utils.inherit(Widget, Widgetfly.Events);

	Widget.prototype.getId = function() {
		return this.id;
	};

	Widget.prototype.onStart = function(callback) {
		if (Widgetfly.Utils.isFunction(callback)) {
			this.on('onStart', callback);
		}
	};

	Widget.prototype.start = function() {
		console.log('Widget.Action start');
		var handlers = Widgetfly.Mediator.getActionHandlers(this.id);
		if (handlers && Widgetfly.Utils.isFunction(handlers.onStart)) {
			handlers.onStart();
		}
	};

	Widget.prototype.onHide = function(callback) {
		if (Widgetfly.Utils.isFunction(callback)) {
			this.on('onHide', callback);
		}
	};

	Widget.prototype.hide = function() {
		console.log('Widget.Action hide');
		if (this.setting.appendType === 'id') {
			window.document.getElementById(this.setting.container).hide();
		} else {
			window.document.getElementsByClassName(this.setting.container)[0].hide();
		}
		var handlers = Widgetfly.Mediator.getActionHandlers(this.id);
		if (handlers && Widgetfly.Utils.isFunction(handlers.onHide)) {
			handlers.onHide();
		}
	};

	Widget.prototype.onShow = function(callback) {
		if (Widgetfly.Utils.isFunction(callback)) {
			this.on('onShow', callback);
		}
	};

	Widget.prototype.show = function() {
		console.log('Widget.Action show');
		var self = this, handlers;
		if (self.setting.appendType === 'id') {
			if (window.document.getElementById(self.setting.container) !== undefined) {
				window.document.getElementById(self.setting.container).show();
			}
		} else {
			if (window.document.getElementsByClassName(self.setting.container)[0] !== undefined) {
				window.document.getElementsByClassName(self.setting.container)[0].show();
			}
		}
		handlers = Widgetfly.Mediator.getActionHandlers(this.id);
		if (handlers && Widgetfly.Utils.isFunction(handlers.onShow)) {
			handlers.onShow();
		}
	};

	Widget.prototype.onBeforeClose = function(callback) {
		if (Widgetfly.Utils.isFunction(callback)) {
			this.on('onBeforeClose', callback);
		}
	};

	Widget.prototype.close = function() {
		console.log('Widget.Action close');
		var self = this, handlers;
		handlers = Widgetfly.Mediator.getActionHandlers(this.id);
		if (handlers && Widgetfly.Utils.isFunction(handlers.onBeforeClose)) {
			handlers.onBeforeClose();
		}
		Widgetfly.Mediator.unregister(this.id, function() {
			var removeDom;
			if (self.setting.appendType === 'class') {
				removeDom = document.getElementsByClassName(self.setting.container)[0];
			} else {
				removeDom = document.getElementById(self.setting.container);
			}
			removeDom.parentNode.removeChild(removeDom);
		});
	};

	Widget.prototype.register = function() {
		var nowScripts = document.getElementsByTagName('script'), cScript = nowScripts[nowScripts.length - 1];
		//console.log(this);
		Widgetfly.Mediator.register(this.id, this);
		cScript.setAttribute('data-id', this.id);
	};

	Widget.prototype.render = function() {
		var src, iframe = document.createElement('iFrame'), origin, urlOptions;
		if (window.location.protocol === 'file:') {
			origin = window.location.href;
		} else {
			origin = window.location.protocol + '//' + window.location.host;
		}

		urlOptions = {
			origin : origin
		};

		iframe.setAttribute('name', this.id);

		if (this.setting.options.src.indexOf('#') === -1) {
			src = this.setting.options.src + '#';
		} else {
			src = this.etting.options.src + '&';
		}

		src = src + 'wo=' + decodeURIComponent(JSON.stringify(urlOptions));

		iframe.setAttribute('src', src);
		return iframe;
	};

	return Widget;
})(this);