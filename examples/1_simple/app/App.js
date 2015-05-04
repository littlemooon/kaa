'use strict';

import React from 'react';
import {RootMixin} from 'the-jungle';

const List = React.createFactory(require('./List'));

export default React.createClass({
	displayName: 'App',

	mixins: [RootMixin],

	render: function() {
		return (List());
	}
});
