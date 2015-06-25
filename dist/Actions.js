'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _junglejsCommon = require('junglejs-common');

var Actions = (function () {
	function Actions(tree, baseUrl, definition, defaults) {
		var allActions = arguments[4] === undefined ? this : arguments[4];

		_classCallCheck(this, Actions);

		if (!tree) (0, _junglejsCommon.throwError)('Must provide a tree object to Actions that encapsulates all application state');

		var _ref = definition ? definition : (0, _junglejsCommon.throwError)('Must provide a definition object to Actions that details all actions over the tree');

		var path = _ref.path;
		var url = _ref.url;
		var actions = _ref.actions;

		// give access to the root actions node
		this.getAllActions = function () {
			return allActions;
		};

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
		this._setChildren__(tree, baseUrl, definition, defaults, allActions);
	}

	_createClass(Actions, [{
		key: '_setActions__',
		value: function _setActions__(actions, defaults) {
			var _this = this;

			if (typeof actions !== 'object') (0, _junglejsCommon.throwError)('Defined actions must to be an object');

			// set a prop on this for each action
			(0, _junglejsCommon.mapObj)(getActions(actions, defaults), function (v, k) {
				return _this[k] = typeof v === 'function' ? v.bind(_this) : (0, _junglejsCommon.throwError)('Action \'' + k + '\' must be a function');
			});
		}
	}, {
		key: '_setChildren__',
		value: function _setChildren__(tree, baseUrl, definition, defaults, allActions) {
			var _this2 = this;

			var keyProps = ['path', 'url', 'actions'];

			// create a new actions object and set a prop on this for each remaining prop in the definition
			(0, _junglejsCommon.mapObj)(definition, function (v, k) {
				return keyProps.indexOf(k) < 0 ? _this2[k] = new Actions(tree, baseUrl, v, defaults, allActions) : null;
			});
		}
	}]);

	return Actions;
})();

exports['default'] = Actions;

var getCursorFn = function getCursorFn(tree, path) {
	var getFn = (0, _junglejsCommon.getCursorFns)(tree).get;

	// resolve the cursor and return the value
	return function () {
		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return (0, _junglejsCommon.navigatePath)(_junglejsCommon.callIfFunction.apply(undefined, [path].concat(args)), tree, getFn);
	};
};

var getUrlFn = function getUrlFn(tree, path, baseUrl, url) {
	// resolve the url and return the full url
	return function () {
		for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
			args[_key2] = arguments[_key2];
		}

		return baseUrl + _junglejsCommon.callIfFunction.apply(undefined, [url].concat(args));
	};
};

var getActions = function getActions(actions, defaults) {
	// return the map of actions after setting any defaults
	return (0, _junglejsCommon.mapObj)(actions, function (v, k) {
		return v === true ? getDefaultAction(k, defaults) : v;
	});
};

var getDefaultAction = function getDefaultAction(name, defaults) {
	var defaultAction = defaults && defaults[name];
	return defaultAction ? defaultAction : (0, _junglejsCommon.throwError)('Default action \'' + name + '\' used but not defined');
};
module.exports = exports['default'];