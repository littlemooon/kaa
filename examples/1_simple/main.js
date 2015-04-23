'use strict';

import React from 'react/addons';
import Baobab from 'Baobab';
import {Actions} from 'kaa';

const App = React.createFactory(require('./app/App'));

// define initial data
let tree = new Baobab({
  someNamespace: {
    title: {
      text: 'Have some fruit!'
    },
    fruitList: {
      '1': {name: 'Apple', color: 'Red'},
      '2': {name: 'Orange', color: 'Orange'},
      '3': {name: 'Banana', color: 'Yellow'}
    }
  }
});

// define actions on data
const actions = new Actions(tree, 'http://localhost:3000/api/', {
  fruitList: {
    data: 'someNamespace.fruitList',
    url: 'fruit',
    actions: {
      get: true,
      create: true,
      log: (action) => console.log(`Calling '${action}' on fruitList`)
    },
    item: {
      data: k => `someNamespace.fruitList.${k}`,
      url: (k, v) => `fruit/${v.id}`,
      actions: {
        update: true,
        delete: true,
        log: (action) => console.log(`Calling '${action}' on fruitList item`)
      }
    }
  }
});

// render application passing in initial data and actions
React.render(
  App({tree: tree, actions: actions}),
  document.body
);
