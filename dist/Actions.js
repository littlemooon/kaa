'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _getCursorFns$mapObj$navigatePath$callIfFunction$throwError = require('junglejs-common');

'use strict';

var Actions = (function () {
	function Actions(tree, baseUrl, definition, defaults) {
		_classCallCheck(this, Actions);

		if (!tree) _getCursorFns$mapObj$navigatePath$callIfFunction$throwError.throwError('Must provide a tree object to Actions that encapsulates all application state');

		var _ref = definition ? definition : _getCursorFns$mapObj$navigatePath$callIfFunction$throwError.throwError('Must provide a definition object to Actions that details all actions over the tree');

		var path = _ref.path;
		var url = _ref.url;
		var actions = _ref.actions;

		// give actions access to the whole tree
		this.getTree = function () {
			return tree;
		};

		// set cursor prop to a function returning the cursor
		path && (this.getCursor = getCursorFn(tree, path));

		// set url prop to a function returning the full url
		url && (this.getUrl = getUrlFn(tree, path, baseUrl, url));

		// set a prop for each action
		actions && this._setActions__(actions, defaults);

		// set all remaining props on the definition to a prop on this
		this._setChildren__(tree, baseUrl, definition, defaults);
	}

	_createClass(Actions, [{
		key: '_setActions__',
		value: function _setActions__(actions, defaults) {
			var _this = this;

			if (typeof actions !== 'object') _getCursorFns$mapObj$navigatePath$callIfFunction$throwError.throwError('Defined actions must to be an object');

			// set a prop on this for each action
			_getCursorFns$mapObj$navigatePath$callIfFunction$throwError.mapObj(getActions(actions, defaults), function (v, k) {
				return _this[k] = typeof v === 'function' ? v.bind(_this) : _getCursorFns$mapObj$navigatePath$callIfFunction$throwError.throwError('Action \'' + k + '\' must be a function');
			});
		}
	}, {
		key: '_setChildren__',
		value: function _setChildren__(tree, baseUrl, definition, defaults) {
			var _this2 = this;

			var keyProps = ['path', 'url', 'actions'];

			// create a new actions object and set a prop on this for each remaining prop in the definition
			_getCursorFns$mapObj$navigatePath$callIfFunction$throwError.mapObj(definition, function (v, k) {
				return keyProps.indexOf(k) < 0 ? _this2[k] = new Actions(tree, baseUrl, v, defaults) : null;
			});
		}
	}]);

	return Actions;
})();

exports['default'] = Actions;

var getCursorFn = function getCursorFn(tree, path) {
	var getFn = _getCursorFns$mapObj$navigatePath$callIfFunction$throwError.getCursorFns(tree).get;

	// resolve the cursor and return the value
	return function (k) {
		return _getCursorFns$mapObj$navigatePath$callIfFunction$throwError.navigatePath(_getCursorFns$mapObj$navigatePath$callIfFunction$throwError.callIfFunction(path, k), tree, getFn);
	};
};

var getUrlFn = function getUrlFn(tree, path, baseUrl, url) {
	var getCursor = path && getCursorFn(tree, path);
	var valFn = _getCursorFns$mapObj$navigatePath$callIfFunction$throwError.getCursorFns(tree).value;

	// resolve the url and return the full url
	return function (k) {
		return baseUrl + _getCursorFns$mapObj$navigatePath$callIfFunction$throwError.callIfFunction(url, k, getCursor && valFn(getCursor(k)));
	};
};

var getActions = function getActions(actions, defaults) {
	// return the map of actions after setting any defaults
	return _getCursorFns$mapObj$navigatePath$callIfFunction$throwError.mapObj(actions, function (v, k) {
		return v === true ? getDefaultAction(k, defaults) : v;
	});
};

var getDefaultAction = function getDefaultAction(name, defaults) {
	var defaultAction = defaults && defaults[name];
	return defaultAction ? defaultAction : _getCursorFns$mapObj$navigatePath$callIfFunction$throwError.throwError('Default action \'' + name + '\' used but not defined');
};
module.exports = exports['default'];