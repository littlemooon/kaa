'use strict';

import {getCursorFns, mapObj, navigatePath, callIfFunction, getDefaultAction} from './helpers';

const defaultActions = ['get', 'create', 'update', 'delete'];
const keyProps = ['data', 'url', 'actions'];

export default class Actions {

	constructor(tree, baseUrl, actions) {
		this.data = this._getCursor(tree, actions.data);
		this.url = this._getUrl(baseUrl, actions.url);

		// set actions as methods on this object
		mapObj(this._getActions(actions.actions), (v, k) => this[k] = v);

		// set all non key props as methods on this object returning a new Actions object
		mapObj(actions, (v, k) => !keyProps.contains(k) ? this[k] = new Actions(tree, baseUrl, k) : null);
	}

	_getActions(actionDefs) {
		return mapObj(actionDefs, (v, k) =>
			defaultActions.contains(k) ? getDefaultAction(k, v) : v
		);
	}

	_getCursor(tree, path) {
		const getFn = getCursorFns(this._tree).get;
		return (k, v) => navigatePath(callIfFunction(path, k, v), tree, 'Cursor', getFn);
	}

	_getUrl(baseUrl, url) {
		return (k, v) => baseUrl + callIfFunction(url, k, v);
	}
}
