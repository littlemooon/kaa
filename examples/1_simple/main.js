'use strict';

import React from 'react/addons';
import Baobab from 'Baobab';
import {Actions} from 'kaa';

const App = React.createFactory(require('./app/App'));

// define initial data
const tree = new Baobab({
  title: {
    text: 'Have some fruit!'
  }
});

// define default actions
const defaultActions = {
  get: function() {
    this.getCursor().set([
      {id: 123, name: 'Apple', color: 'Red'},
      {id: 234, name: 'Orange', color: 'Orange'},
      {id: 345, name: 'Banana', color: 'Yellow'}
    ]);
  },
  create: () => {
    console.log('create');
  },
  update: () => {
    console.log('update');
  },
  delete: () => {
    console.log('delete');
  }
};

// define actions on data
const actions = new Actions(tree, 'http://localhost:3000/api/', {
  fruitList: {
    path: 'fruitList',
    url: 'fruit',
    actions: {
      get: true,
      create: true,
      log: (action) => console.log(`Calling '${action}' on fruitList`)
    },
    item: {
      path: k => `fruitList.${k}`,
      url: (k, v) => `fruit/${v.id}`,
      actions: {
        update: true,
        delete: true,
        log: (action) => console.log(`Calling '${action}' on fruitList item`)
      }
    }
  }
}, defaultActions);

// render application passing in initial data and actions
React.render(
  App({tree: tree, actions: actions}),
  document.body
);
