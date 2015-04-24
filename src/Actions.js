'use strict';

import {getCursorFns, mapObj, navigatePath, callIfFunction} from './helpers';

export default class Actions {

	constructor(tree, baseUrl, definition, defaults) {
		const cursor = definition.cursor;
		const url = definition.url;
		const actions = definition.actions;

		// set cursor prop to a function returning the cursor
		cursor && (this.getCursor = getCursorFn(tree, cursor));

		// set url prop to a function returning the full url
		url && (this.getUrl = getUrlFn(tree, cursor, baseUrl, url));

		// set a prop for each action
		this._setActions__(actions, defaults);

		// set all remaining props on the definition to a prop on this
		this._setChildren__(tree, baseUrl, definition, defaults);
	}

	_setActions__(actions, defaults) {
		// set a prop on this for each action
		actions && mapObj(getActions(actions, defaults), (v, k) =>
			this[k] = v.bind(this)
		);
	}

	_setChildren__(tree, baseUrl, definition, defaults) {
		const keyProps = ['cursor', 'url', 'actions'];

		// create a new actions object and set a prop on this for each remaining prop in the definition
		mapObj(definition, (v, k) =>
			keyProps.indexOf(k) < 0 ? this[k] = new Actions(tree, baseUrl, v, defaults) : null
		);
	}
}

const getCursorFn = (tree, path) => {
	const getFn = getCursorFns(tree).get;

	// resolve the cursor and return the value
	return k => navigatePath(callIfFunction(path, k), tree, 'Cursor', getFn);
};

const getUrlFn = (tree, path, baseUrl, url) => {
	const getCursor = getCursorFn(tree, path);
	const valFn = getCursorFns(tree).value;

	// resolve the url and return the full url
	return k => baseUrl + callIfFunction(url, k, valFn(getCursor(k)));
};

const getActions = (actions, defaults) => {
	// return the map of actions after setting any defaults
	return mapObj(actions, (v, k) =>
		v === true ? getDefaultAction(k, defaults) : v
	);
};

const getDefaultAction = (name, defaults) => {
	const defaultAction = defaults && defaults[name];
	if (!defaultAction) throw new Error(`Default action ${name} used but not specified`);
	return defaultAction;
};
