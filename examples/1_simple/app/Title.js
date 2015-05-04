'use strict';

import React from 'react';
import {Mixin} from 'the-jungle';

const h4 = React.createFactory('h4');

export default React.createClass({
	displayName: 'Title',

	mixins: [Mixin],

	data: {
		text: 'title.text'
	},

	render: function() {
		return h4({}, this.state.text);
	}
});
