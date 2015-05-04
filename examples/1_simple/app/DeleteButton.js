'use strict';

import React from 'react';
import {Mixin} from 'the-jungle';

const button = React.createFactory('button');

export default React.createClass({
	displayName: 'DeleteButton',

	mixins: [Mixin],

	// propTypes: {
	// 	id: React.PropTypes.number.idRequired
	// },

	actions: {
		remove: 'fruitList.delete'
	},

	_handleClick: function() {
		this.actions.remove(this.props.id);
	},

	render: function() {
		return button({
			onClick: this._handleClick
		}, 'Delete');
	}
});
