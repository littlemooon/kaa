/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	var _Actions = __webpack_require__(2);

	var _Actions2 = _interopRequireWildcard(_Actions);

	'use strict';

	exports['default'] = {
		Actions: _Actions2['default']
	};
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	var _getCursorFns$mapObj$navigatePath$callIfFunction$getDefaultAction = __webpack_require__(3);

	'use strict';

	var defaultActions = ['get', 'create', 'update', 'delete'];
	var keyProps = ['data', 'url', 'actions'];

	var Actions = (function () {
		function Actions(tree, baseUrl, actions) {
			var _this = this;

			_classCallCheck(this, Actions);

			this.data = this._getCursor(tree, actions.data);
			this.url = this._getUrl(baseUrl, actions.url);

			// set actions as methods on this object
			_getCursorFns$mapObj$navigatePath$callIfFunction$getDefaultAction.mapObj(this._getActions(actions.actions), function (v, k) {
				return _this[k] = v;
			});

			// set all non key props as methods on this object returning a new Actions object
			_getCursorFns$mapObj$navigatePath$callIfFunction$getDefaultAction.mapObj(actions, function (v, k) {
				return !keyProps.contains(k) ? _this[k] = new Actions(tree, baseUrl, k) : null;
			});
		}

		_createClass(Actions, [{
			key: '_getActions',
			value: function _getActions(actionDefs) {
				return _getCursorFns$mapObj$navigatePath$callIfFunction$getDefaultAction.mapObj(actionDefs, function (v, k) {
					return defaultActions.contains(k) ? _getCursorFns$mapObj$navigatePath$callIfFunction$getDefaultAction.getDefaultAction(k, v) : v;
				});
			}
		}, {
			key: '_getCursor',
			value: function _getCursor(tree, path) {
				var getFn = _getCursorFns$mapObj$navigatePath$callIfFunction$getDefaultAction.getCursorFns(this._tree).get;
				return function (k, v) {
					return _getCursorFns$mapObj$navigatePath$callIfFunction$getDefaultAction.navigatePath(_getCursorFns$mapObj$navigatePath$callIfFunction$getDefaultAction.callIfFunction(path, k, v), tree, 'Cursor', getFn);
				};
			}
		}, {
			key: '_getUrl',
			value: function _getUrl(baseUrl, url) {
				return function (k, v) {
					return baseUrl + _getCursorFns$mapObj$navigatePath$callIfFunction$getDefaultAction.callIfFunction(url, k, v);
				};
			}
		}]);

		return Actions;
	})();

	exports['default'] = Actions;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});
	'use strict';

	exports['default'] = {
		getCursorFns: function getCursorFns(cursor) {
			switch (cursor.constructor.name) {
				case 'Cortex':
					return cursorFns.cortex;
				case 'Baobab':
					return cursorFns.baobab;
				default:
					return cursorFns['default'];
			}
		},

		getDefaultAction: function getDefaultAction(name, value) {
			return value === true ? defaultActions[name] : value;
		},

		reducePaths: function reducePaths(paths, tree, desc, getFn) {
			// dont get rekt
			if (!paths) {
				return {};
			}if (!tree) throw new Error('No ' + desc + 's have been passed to your root component');

			// return a map of each path through the tree
			return undefined.mapObj(paths, function (val) {
				return undefined.navigatePath(val, tree, desc, getFn);
			});
		},

		navigatePath: function navigatePath(path, tree, desc, getFn) {
			return pathAsArray(path).reduce(function (obj, key) {
				// if we have been given a getter then use it, otherwise treat as an object
				var value = obj && (getFn ? getFn(obj, key) : obj[key]);

				if (value === undefined) console.warn('' + desc + ' \'' + path + '\' (key: \'' + key + '\') cannot be found');

				// return null if not found
				return !obj || value === undefined ? null : value;
			}, tree);
		},

		mapObj: function mapObj(obj, fn) {
			return Object.keys(obj).reduce(function (acc, key) {
				acc[key] = fn(obj[key], key);
				return acc;
			}, {});
		},

		callIfFunction: function callIfFunction(obj) {
			for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				args[_key - 1] = arguments[_key];
			}

			return typeof obj === 'function' ? obj.apply(undefined, args) : obj;
		}
	};

	var pathAsArray = function pathAsArray(path) {
		return path.constructor === Array ? path : path.split('.');
	};

	// define api for different tree implementations
	var cursorFns = {
		cortex: {
			get: function get(x, key) {
				return x[key];
			},
			value: function value(x) {
				return x.val();
			}
		},
		baobab: {
			get: function get(x, key) {
				return x.select(key);
			},
			value: function value(x) {
				return x.get();
			},
			on: function on(x, cb) {
				return x.on('update', cb);
			},
			off: function off(x, cb) {
				return x.off('update', cb);
			}
		},
		immstruct: {
			get: function get(x, key) {
				return x.cursor(key);
			},
			value: function value(x) {
				return x.deref();
			},
			on: function on(x, cb) {
				return x.on('swap', cb);
			},
			off: function off(x, cb) {
				return x.off('swap', cb);
			}
		},
		reactCursor: {
			get: function get(x, key) {
				return x.refine(key);
			},
			value: function value(x) {
				return x.value;
			}
		},
		'default': {
			get: function get(x, key) {
				return x[key];
			},
			value: function value(x) {
				return x;
			}
		}
	};

	// define default actions
	var defaultActions = {
		get: function get() {
			console.log('get');
		},
		create: function create() {
			console.log('create');
		},
		update: function update() {
			console.log('update');
		},
		'delete': function _delete() {
			console.log('delete');
		}
	};
	module.exports = exports['default'];

/***/ }
/******/ ]);