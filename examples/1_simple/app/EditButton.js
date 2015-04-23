'use strict';

import React from 'react/addons';
import {Mixin} from 'mowgli';

const button = React.createFactory('button');

export default React.createClass({
	displayName: 'EditButton',

	mixins: [Mixin],

	propTypes: {
		id: React.PropTypes.number.idRequired
	},

	actions: {
		edit: 'fruitList.update'
	},

	_handleClick: function() {
		this.actions.edit({name: 'Watermelon', color: 'Magical'});
	},

	render: function() {
		return button({
			onClick: this._handleClick
		}, 'Edit');
	}
});
