'use strict';

import React from 'react';
import {Mixin} from 'mowgli';

const div = React.createFactory('div');
const Title = React.createFactory(require('./Title'));
const ListItem = React.createFactory(require('./ListItem'));
const AddButton = React.createFactory(require('./AddButton'));

export default React.createClass({
	displayName: 'List',

	mixins: [Mixin],

	data: {
		items: 'fruitList'
	},

	actions: {
		getList: 'fruitList.get'
	},

	componentWillMount: function() {
		this.actions.getList();
	},

	_renderList: function() {
		return div({},
			this.state.items && this.state.items.map((item, i) =>
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
