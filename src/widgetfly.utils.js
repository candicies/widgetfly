Widgetfly.Utils = (function(global) {'use strict';
	// Utilities
	// -------------

	var idCounter = 0, Utils = {
		has : function(obj, key) {
			return Object.prototype.hasOwnProperty.call(obj, key);
		},

		each : function(obj, iterator, context) {
			var i, l, key;

			if (obj === null) {
				return false;
			}

			if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
				obj.forEach(iterator, context);
			} else if ( typeof obj.length === 'number') {
				for ( i = 0, l = obj.length; i < l; i++) {
					if (iterator.call(context, obj[i], i, obj) === {}) {
						return false;
					}
				}
			} else {
				for (key in obj) {
					if (Widgetfly.Utils.has(obj, key)) {
						if (iterator.call(context, obj[key], key, obj) === {}) {
							return false;
						}
					}
				}
			}
		},

		isEmpty : function(obj) {
			// null and undefined are "empty"
			if (obj === null) {
				return true;
			}

			// Assume if it has a length property with a non-zero value
			// that that property is correct.
			if (obj.length > 0) {
				return false;
			}

			if (obj.length === 0) {
				return true;
			}

			// Otherwise, does it have any properties of its own?
			// Note that this doesn't handle
			// toString and valueOf enumeration bugs in IE < 9
			for (var key in obj) {
				if (hasOwnProperty.call(obj, key)) {
					return false;
				}
			}
			return true;
		},

		extend : function(obj) {
			this.each(Array.prototype.slice.call(arguments, 1), function(source) {
				if (source) {
					for (var prop in source) {
						obj[prop] = source[prop];
					}
				}
			});
			return obj;
		},

		inherit : function(Child, Parent) {
			var F = function() {
			};
			F.prototype = Parent.prototype;
			Child.prototype = new F();
			Child.prototype.constructor = Child;
			Child.uber = Parent.prototype;
		},

		parseUrl : function(URL, checkLib) {
			var nowSrc, parameter, createParam = {}, i, tmpStr, tmpParam;
			if ( typeof URL !== 'string' && URL.length > 0) {
				URL = URL[URL.length - 1];
				if (URL.getAttribute.length !== undefined) {
					nowSrc = URL.getAttribute('src', -1);
				}
			} else {
				nowSrc = URL;
			}
			parameter = nowSrc.split('?', 2);
			if (parameter.length > 1) {
				parameter = parameter[1];
				parameter = parameter.split('?');
				if (parameter.length > 0) {
					if (parameter[0].split('=', 2).length > 0) {
						createParam.type = parameter[0].split('=', 2)[1];
					}

					if (parameter[1] !== undefined && parameter[1].split('=', 2).length > 0) {
						if (parameter[1].split('=', 2)[1] !== '') {
							createParam.container = parameter[1].split('=', 2)[1];
							if (parameter[1].split('=', 2)[0] === 'appendClass') {
								createParam.appendType = 'class';
								createParam.dom = '.' + createParam.container;
							} else {
								createParam.appendType = 'id';
								createParam.dom = '#' + createParam.container;
							}
						}
					}
					if (parameter.length > 2) {
						createParam.options = {};
						for ( i = 2; i < parameter.length; i++) {
							if (parameter[i].split('=', 2).length > 0) {
								tmpParam = parameter[i].split('=', 2)[1];
								tmpParam = tmpParam.split(':');
								if (tmpParam.length > 0) {
									tmpStr = tmpParam.shift();
									if (tmpParam.length !== 0) {
										tmpParam = tmpParam.join(':');
										if (tmpParam !== '' && tmpParam !== null && tmpParam !== 'null') {
											createParam.options[tmpStr] = tmpParam;
										}
									}
								}
							}
						}
					}
				}
			}

			if (checkLib === undefined) {
				return createParam;
			} else {
				checkLib(createParam);
			}
		},

		uniqueId : function(prefix) {
			var id = String(++idCounter);
			return prefix ? prefix + id : id;
		},

		getElementsByClassName : function(testClass, startFrom) {
			/**
			 * getElementsByClassName
			 * @fileOverview An easy way to find DOM Nodes with a specific class
			 * @author Dan Beam <dan@danbeam.org>
			 * @param {string} className - the class we're looking for on DOM Nodes
			 * @param {element} startFrom (optional) - a point in the DOM to start from
			 * @return {array} results - any DOM Nodes that have the specified class
			 */

			for (var// this will be incremented to 0 at start of loop
			i = -1,
			// results of the DOM query (elements with matching class)
			results = [],
			// regular expression to see if the class attribute contains
			// the searched for class
			finder = new RegExp('(?:^|\\s)' + testClass + '(?:\\s|$)'),
			// grab all DOM elements and the set's length
			a = startFrom && startFrom.getElementsByTagName && startFrom.getElementsByTagName('*') || document.all || document.getElementsByTagName('*'),

			// cache the length property
			l = a.length;

			// this is done before we start and at every comparison (note the ++)
			++i < l;
			// this is done after the first comparison and every iteration afterward
			finder.test(a[i].className) && results.push(a[i])) {
			}
			// do memory management and return the results of our query
			a = null;
			return results;
		},

		inIframe : function() {
			try {
				return window.self !== window.top;
			} catch (e) {
				return true;
			}
		},

		isFunction : function(obj) {
			return typeof obj === 'function';
		},

		isElement : function(o) {
			return ( typeof HTMLElement === 'object' ? o instanceof HTMLElement : o && typeof o === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName === 'string');
		},

		trans2Elem : function(element, startFrom) {
			var target;
			if ( typeof element === 'string') {
				if (element.substr(0, 1) === '#') {
					target = document.getElementById(element.replace('#', ''));
				} else if (element.substr(0, 1) === '.') {
					target = this.getElementsByClassName(element.replace('.', ''), startFrom)[0];
				} else {
					target = document.getElementsByTagName(element)[0];
				}
			} else {
				target = element;
			}
			return target;
		},

		hasClass : function(element, cls) {
			return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
		},
		
		addClass : function(element, className, startFrom) {
			var target;
			if (startFrom === undefined) {
				startFrom = document;
			}
			target = this.trans2Elem(element, startFrom);
			
			if (!this.hasClass(target, className)) {
				target.className += ' ' + className;
			}
			this.innerStyle(target);
		},
	
		removeClass : function(element, rmClass, startFrom) {
			var target, newClass;
			if (startFrom === undefined) {
				startFrom = document;
			}
			target = this.trans2Elem(element, startFrom);

			if (target !== undefined && this.isElement(target)) {
				newClass = ' ' + target.className.replace(/[\t\r\n]/g, ' ') + ' ';
				if (this.hasClass(target, rmClass)) {
					while (newClass.indexOf(' ' + rmClass + ' ') >= 0) {
						newClass = newClass.replace(' ' + rmClass + ' ', ' ');
					}
					target.className = newClass.replace(/^\s+|\s+$/g, '');
				}
			}
			this.innerStyle(target);
		},

		toggleClass : function(element, className, startFrom) {
			var target, newClass;
			if (startFrom === undefined) {
				startFrom = document;
			}
			target = this.trans2Elem(element, startFrom);
			if (target !== undefined && this.isElement(target)) {
				newClass = ' ' + target.className.replace(/[\t\r\n]/g, ' ') + ' ';
				if (this.hasClass(target, className)) {
					while (newClass.indexOf(' ' + className + ' ') >= 0) {
						newClass = newClass.replace(' ' + className + ' ', ' ');
					}
					target.className = newClass.replace(/^\s+|\s+$/g, '');
				} else {
					target.className += ' ' + className;
				}
			}
			this.innerStyle(target);
		},
		
		innerStyle : function css(a) {
		    var i,r, match, ruleExp, result,styles = [],rules, sheets = document.styleSheets, o = [];
		    a.matches = a.matches || a.webkitMatchesSelector || a.mozMatchesSelector || a.msMatchesSelector || a.oMatchesSelector;
		    for (i in sheets) {
		        rules = sheets[i].rules || sheets[i].cssRules;
		        for (r in rules) {
		            if (a.matches(rules[r].selectorText)) {
		                o.push(rules[r].cssText);
		            }
		        }
		    }
		    for (i in o){
				r = o[i];
				if(r.indexOf('.widgetfly') === 0){
					ruleExp = /\{\s*([^\}]+)\s\}/g;
					match = ruleExp.exec(r);
					if(match){
						styles.push(match[1]);
					}
				}
		    }
		    result = styles.join(' ');
		    if(a.hasAttribute('data-ext-style')){
				result = result + ' ' + a.getAttribute('data-ext-style');
			}
			a.style.cssText = result;
		},
		
		actual : function(el){
			var elWidth,elHeight,style,
			fixStyle = ' visibility: hidden !important; display: block !important; position: absolute !important;',
			size = function(s){
					if(Boolean(s)){
						return parseInt(s.substring(0,s.indexOf('px')),10);
					}else{
						return 0;
					}
			};
			
			if (el.offsetParent === null) {
				el.setAttribute('style', el.getAttribute('style') + fixStyle);
			}
			
			elWidth = el.offsetWidth;
			
			elHeight = el.offsetHeight;
			
			style = el.getAttribute('style');
			if(style && style.indexOf(fixStyle) !== 0){
				el.setAttribute('style', style.substring(0,style.indexOf(fixStyle)));
			}
			return {
				width : elWidth + size(el.style.marginLeft) + size(el.style.marginRight),
				height : elHeight + size(el.style.marginTop) + size(el.style.marginBottom)
			};
		},
		
		offset: function(el) {
			var docElem, win,
			elem = el,
			box = { top: 0, left: 0 },
			doc = elem && elem.ownerDocument;

			if ( !doc ) {
				return;
			}
	
			docElem = doc.documentElement;
			// If we don't have gBCR, just use 0,0 rather than error
			// BlackBerry 5, iOS 3 (original iPhone)
			if ( typeof elem.getBoundingClientRect !== undefined ) {
				box = elem.getBoundingClientRect();
			}
			win = window;
			return {
				top: box.top + win.pageYOffset - docElem.clientTop,
				left: box.left + win.pageXOffset - docElem.clientLeft
			};
		},
		
		toElement : function(content){
			var el = document.createElement('div');
			el.innerHTML = content;
			return el.firstChild;
		}
		
	};

	return Utils;
})(this);
