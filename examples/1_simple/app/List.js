'use strict';

import React from 'react/addons';
import {Mixin} from 'mowgli';

const div = React.createFactory('div');
const p = React.createFactory('p');
const Title = React.createFactory(require('./Title'));
const ListItem = React.createFactory(require('./ListItem'));
const AddButton = React.createFactory(require('./AddButton'));

export default React.createClass({
	displayName: 'List',

	mixins: [Mixin],

	data: {
		items: 'fruitList',
		isLoading: 'list.loading'
	},

	actions: {
		getList: 'fruitList.get'
	},

	componentWillMount: function() {
		this.actions.getList();
	},

	_renderList: function() {
		if (this.state.isLoading) return p({}, 'Loading..');

		return div({},
			this.state.items.map((item, i) =>
				ListItem({key: i, id: item.id, name: item.name, color: item.color})
			),
			AddButton()
		);
	},

	render: function() {
		return div({},
			Title(),
			this._renderList()
		);
	}
});
