'use strict';

import React from 'react';

const p = React.createFactory('p');
const EditButton = React.createFactory(require('./EditButton'));
const DeleteButton = React.createFactory(require('./DeleteButton'));

export default React.createClass({
	displayName: 'ListItem',

	propTypes: {
		id: React.PropTypes.number,
		name: React.PropTypes.string,
		color: React.PropTypes.string
	},

	render: function() {
		return p({},
			`The ${this.props.name} is ${this.props.color}`,
			EditButton({id: this.props.id}),
			DeleteButton({id: this.props.id})
		);
	}
});
