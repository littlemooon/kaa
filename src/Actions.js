'use strict';

import {getCursorFns, mapObj, navigatePath, callIfFunction, throwError} from 'junglejs-common';

export default class Actions {

	constructor(tree, baseUrl, definition, defaults) {
		if (!tree) throwError(`Must provide a tree object to Actions that encapsulates all application state`);
		const {path, url, actions} = definition ? definition : throwError(`Must provide a definition object to Actions that details all actions over the tree`);

		// give actions access to the whole tree
		this.getTree = () => tree;

		// set cursor prop to a function returning the cursor
		path && (this.getCursor = getCursorFn(tree, path));

		// set url prop to a function returning the full url
		url && (this.getUrl = getUrlFn(tree, path, baseUrl, url));

		// set a prop for each action
		actions && this._setActions__(actions, defaults);

		// set all remaining props on the definition to a prop on this
		this._setChildren__(tree, baseUrl, definition, defaults);
	}

	_setActions__(actions, defaults) {
		if (typeof actions !== 'object') throwError(`Defined actions must to be an object`);

		// set a prop on this for each action
		mapObj(getActions(actions, defaults), (v, k) =>
			this[k] = typeof v === 'function' ? v.bind(this) : throwError(`Action '${k}' must be a function`)
		);
	}

	_setChildren__(tree, baseUrl, definition, defaults) {
		const keyProps = ['path', 'url', 'actions'];

		// create a new actions object and set a prop on this for each remaining prop in the definition
		mapObj(definition, (v, k) =>
			keyProps.indexOf(k) < 0 ? this[k] = new Actions(tree, baseUrl, v, defaults) : null
		);
	}
}

const getCursorFn = (tree, path) => {
	const getFn = getCursorFns(tree).get;

	// resolve the cursor and return the value
	return k => navigatePath(callIfFunction(path, k), tree, getFn);
};

const getUrlFn = (tree, path, baseUrl, url) => {
	const getCursor = path && getCursorFn(tree, path);
	const valFn = getCursorFns(tree).value;

	// resolve the url and return the full url
	return k => baseUrl + callIfFunction(url, k, getCursor && valFn(getCursor(k)));
};

const getActions = (actions, defaults) => {
	// return the map of actions after setting any defaults
	return mapObj(actions, (v, k) =>
		v === true ? getDefaultAction(k, defaults) : v
	);
};

const getDefaultAction = (name, defaults) => {
	const defaultAction = defaults && defaults[name];
	return defaultAction ? defaultAction : throwError(`Default action '${name}' used but not defined`);
};
